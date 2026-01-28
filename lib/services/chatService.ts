/**
 * AI 챗봇 서비스
 *
 * 채팅 세션 관리, 사용량 추적, AI 응답 생성을 담당합니다.
 */

import { createClient } from '@/lib/supabase/server';
import { generateAIResponse, getModelForTier, estimateTokens } from '@/lib/ai/client';
import { generatePrompt, getSystemPrompt } from '@/lib/ai/prompts';
import type {
  ChatScenario,
  ChatSession,
  ChatMessage,
  UserChatQuota,
  CHAT_TIER_LIMITS
} from '@/types/chat';

interface ChatInput {
  userId: string;
  sessionId?: string;
  scenario: ChatScenario;
  message: string;
  sajuData?: {
    dayMaster: string;
    fourPillars: any;
    yongsin: string[];
    oheng: any;
    mbti?: string;
    bloodType?: string;
    birthDate: string;
    userName?: string;
  };
}

interface ChatOutput {
  sessionId: string;
  message: string;
  tokensUsed: number;
  remainingTokens: number;
  dailyLimit: number;
}

// 티어별 제한
const TIER_LIMITS = {
  free: { dailyMessages: 3, dailyTokens: 1500, model: 'haiku' as const },
  subscriber: { dailyMessages: 50, dailyTokens: 10000, model: 'gpt-4o' as const },
  premium: { dailyMessages: 100, dailyTokens: 20000, model: 'gpt-4o' as const }
};

/**
 * 사용자 티어 조회
 */
async function getUserTier(userId: string): Promise<'free' | 'subscriber' | 'premium'> {
  const supabase = await createClient();

  const { data: profile } = await supabase
    .from('profiles')
    .select('subscription_status, subscription_tier')
    .eq('id', userId)
    .single() as { data: { subscription_status?: string; subscription_tier?: string } | null };

  if (!profile) return 'free';

  if (profile.subscription_tier === 'premium') return 'premium';
  if (profile.subscription_status === 'active') return 'subscriber';

  return 'free';
}

/**
 * 일일 사용량 조회/생성
 */
async function getDailyUsage(userId: string): Promise<{
  chatCount: number;
  tokensUsed: number;
}> {
  const supabase = await createClient();
  const today = new Date().toISOString().split('T')[0];

  const { data: usage } = await supabase
    .from('daily_usage')
    .select('chat_count, tokens_used')
    .eq('user_id', userId)
    .eq('date', today)
    .single() as { data: { chat_count: number; tokens_used: number } | null };

  if (usage) {
    return {
      chatCount: usage.chat_count,
      tokensUsed: usage.tokens_used
    };
  }

  // 오늘 첫 사용 - 레코드 생성
  await (supabase
    .from('daily_usage') as any)
    .insert({
      user_id: userId,
      date: today,
      chat_count: 0,
      tokens_used: 0
    });

  return { chatCount: 0, tokensUsed: 0 };
}

/**
 * 일일 사용량 업데이트
 */
async function updateDailyUsage(
  userId: string,
  tokensUsed: number
): Promise<void> {
  const supabase = await createClient();
  const today = new Date().toISOString().split('T')[0];

  await (supabase as any).rpc('increment_daily_usage', {
    p_user_id: userId,
    p_date: today,
    p_tokens: tokensUsed
  });
}

/**
 * 채팅 세션 생성/조회
 */
async function getOrCreateSession(
  userId: string,
  sessionId: string | undefined,
  scenario: ChatScenario
): Promise<string> {
  const supabase = await createClient();

  if (sessionId) {
    // 기존 세션 확인
    const { data: session } = await supabase
      .from('chat_sessions')
      .select('id')
      .eq('id', sessionId)
      .eq('user_id', userId)
      .single() as { data: { id: string } | null };

    if (session) return session.id;
  }

  // 새 세션 생성
  const { data: newSession, error } = await (supabase
    .from('chat_sessions') as any)
    .insert({
      user_id: userId,
      scenario
    })
    .select('id')
    .single() as { data: { id: string } | null; error: any };

  if (error || !newSession) {
    throw new Error('Failed to create chat session');
  }

  return newSession.id;
}

/**
 * 메시지 저장
 */
async function saveMessage(
  sessionId: string,
  role: 'user' | 'assistant',
  content: string,
  tokensUsed?: number
): Promise<void> {
  const supabase = await createClient();

  await (supabase.from('chat_messages') as any).insert({
    session_id: sessionId,
    role,
    content,
    tokens_used: tokensUsed || 0
  });
}

/**
 * 이전 메시지 조회 (컨텍스트용)
 */
async function getPreviousMessages(
  sessionId: string,
  limitCount: number = 10
): Promise<{ role: string; content: string }[]> {
  const supabase = await createClient();

  const { data: messages } = await supabase
    .from('chat_messages')
    .select('role, content')
    .eq('session_id', sessionId)
    .order('created_at', { ascending: false })
    .limit(limitCount) as { data: { role: string; content: string }[] | null };

  return (messages || []).reverse();
}

/**
 * 사용자 쿼터 조회
 */
export async function getUserQuota(userId: string): Promise<UserChatQuota> {
  const tier = await getUserTier(userId);
  const usage = await getDailyUsage(userId);
  const limits = TIER_LIMITS[tier];

  const tomorrow = new Date();
  tomorrow.setDate(tomorrow.getDate() + 1);
  tomorrow.setHours(0, 0, 0, 0);

  return {
    userId,
    tier,
    dailyLimit: limits.dailyMessages,
    usedToday: usage.chatCount,
    tokensUsedToday: usage.tokensUsed,
    resetAt: tomorrow
  };
}

/**
 * 채팅 메시지 처리
 */
export async function processChat(input: ChatInput): Promise<ChatOutput> {
  const { userId, sessionId, scenario, message, sajuData } = input;

  // 1. 사용자 티어 및 사용량 확인
  const tier = await getUserTier(userId);
  const usage = await getDailyUsage(userId);
  const limits = TIER_LIMITS[tier];

  // 2. 한도 체크
  if (usage.chatCount >= limits.dailyMessages && tier === 'free') {
    throw new Error('일일 무료 상담 한도를 초과했습니다. 포인트를 사용하거나 구독을 업그레이드해주세요.');
  }

  if (usage.tokensUsed >= limits.dailyTokens) {
    throw new Error('일일 토큰 한도를 초과했습니다.');
  }

  // 3. 세션 처리
  const activeSessionId = await getOrCreateSession(userId, sessionId, scenario);

  // 4. 이전 대화 컨텍스트 조회
  const previousMessages = await getPreviousMessages(activeSessionId);

  // 5. 사용자 메시지 저장
  await saveMessage(activeSessionId, 'user', message);

  // 6. AI 프롬프트 생성
  const systemPrompt = getSystemPrompt(scenario);

  // 컨텍스트에 이전 대화 포함
  let contextPrompt = '';
  if (previousMessages.length > 0) {
    contextPrompt = '\n\n## 이전 대화\n';
    previousMessages.forEach((msg) => {
      const role = msg.role === 'user' ? '상담자' : 'AI';
      contextPrompt += `${role}: ${msg.content}\n`;
    });
    contextPrompt += '\n---\n';
  }

  const userPrompt = generatePrompt(
    scenario,
    sajuData || {
      dayMaster: '미상',
      fourPillars: null,
      yongsin: [],
      oheng: {},
      birthDate: ''
    },
    contextPrompt + message
  );

  // 7. AI 응답 생성
  const model = getModelForTier(tier);

  const aiResponse = await generateAIResponse({
    model,
    systemPrompt,
    userPrompt,
    maxTokens: tier === 'free' ? 500 : 1024,
    temperature: 0.7
  });

  // 8. AI 메시지 저장
  await saveMessage(activeSessionId, 'assistant', aiResponse.content, aiResponse.tokensUsed);

  // 9. 사용량 업데이트
  await updateDailyUsage(userId, aiResponse.tokensUsed);

  // 10. 응답 반환
  return {
    sessionId: activeSessionId,
    message: aiResponse.content,
    tokensUsed: aiResponse.tokensUsed,
    remainingTokens: limits.dailyTokens - usage.tokensUsed - aiResponse.tokensUsed,
    dailyLimit: limits.dailyMessages
  };
}

export default {
  processChat,
  getUserQuota
};
