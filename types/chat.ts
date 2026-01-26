/**
 * AI 사주 상담 챗봇 타입 정의
 */

export type ChatScenario = 'love' | 'career' | 'finance' | 'health' | 'family';

export interface ChatScenarioInfo {
  id: ChatScenario;
  name: string;
  icon: string;
  description: string;
  color: string;
  sajuDataUsed: string[];
}

export const CHAT_SCENARIOS: Record<ChatScenario, ChatScenarioInfo> = {
  love: {
    id: 'love',
    name: '연애/결혼',
    icon: '💕',
    description: '연애운, 결혼 시기, 이상형 분석',
    color: 'pink',
    sajuDataUsed: ['도화살', '천을귀인', '월운', '일주']
  },
  career: {
    id: 'career',
    name: '커리어',
    icon: '💼',
    description: '이직 타이밍, 적합 업종, 승진운',
    color: 'blue',
    sajuDataUsed: ['관성', '인성', '대운', '십신']
  },
  finance: {
    id: 'finance',
    name: '재테크',
    icon: '💰',
    description: '투자 시기, 재물운, 리스크 분석',
    color: 'yellow',
    sajuDataUsed: ['재성', '세운', '월운', '오행']
  },
  health: {
    id: 'health',
    name: '건강',
    icon: '🏥',
    description: '체질 분석, 주의 부위, 보완 활동',
    color: 'green',
    sajuDataUsed: ['오행 체질', '월운', '일간']
  },
  family: {
    id: 'family',
    name: '가족/관계',
    icon: '👨‍👩‍👧',
    description: '가족 관계, 소통 팁, 육친 분석',
    color: 'purple',
    sajuDataUsed: ['육친', '합충', '십신']
  }
};

export interface ChatMessage {
  id: string;
  role: 'user' | 'assistant' | 'system';
  content: string;
  timestamp: Date;
  tokensUsed?: number;
}

export interface ChatSession {
  id: string;
  userId: string;
  scenario: ChatScenario;
  messages: ChatMessage[];
  createdAt: Date;
  updatedAt: Date;
  totalTokensUsed: number;
}

export interface ChatRequest {
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
  };
}

export interface ChatResponse {
  sessionId: string;
  message: string;
  tokensUsed: number;
  remainingTokens: number;
  dailyLimit: number;
}

export interface UserChatQuota {
  userId: string;
  tier: 'free' | 'subscriber' | 'premium';
  dailyLimit: number;
  usedToday: number;
  tokensUsedToday: number;
  resetAt: Date;
}

// 티어별 제한
export const CHAT_TIER_LIMITS = {
  free: {
    dailyMessages: 3,
    dailyTokens: 1500,
    model: 'haiku' as const
  },
  subscriber: {
    dailyMessages: 50,
    dailyTokens: 10000,
    model: 'gpt-4o' as const
  },
  premium: {
    dailyMessages: 100,
    dailyTokens: 20000,
    model: 'gpt-4o' as const
  }
};

// 포인트 비용
export const CHAT_POINT_COSTS = {
  additionalMessage: 100,  // 무료 한도 초과 시 1회당
  scenarioDeepAnalysis: 300  // 심층 분석
};
