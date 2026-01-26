'use client';

import { useState, useRef, useEffect, useCallback } from 'react';
import { Send, Loader2, RefreshCw, Info, Sparkles } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { ChatMessage } from './ChatMessage';
import { ScenarioSelector } from './ScenarioSelector';
import { TokenCounter } from './TokenCounter';
import { cn } from '@/lib/utils';
import type {
  ChatScenario,
  ChatMessage as ChatMessageType,
  UserChatQuota,
  ChatRequest
} from '@/types/chat';

interface ChatInterfaceProps {
  sajuData?: {
    dayMaster: string;
    fourPillars: any;
    yongsin: string[];
    oheng: any;
    mbti?: string;
    bloodType?: string;
    birthDate: string;
  };
  userName?: string;
  initialScenario?: ChatScenario;
}

export function ChatInterface({ sajuData, userName, initialScenario }: ChatInterfaceProps) {
  const [scenario, setScenario] = useState<ChatScenario | null>(initialScenario || null);
  const [messages, setMessages] = useState<ChatMessageType[]>([]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [sessionId, setSessionId] = useState<string | null>(null);
  const [quota, setQuota] = useState<UserChatQuota | null>(null);
  const [error, setError] = useState<string | null>(null);

  const messagesEndRef = useRef<HTMLDivElement>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  // 스크롤 자동 이동
  const scrollToBottom = useCallback(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, []);

  useEffect(() => {
    scrollToBottom();
  }, [messages, scrollToBottom]);

  // 사용량 조회
  useEffect(() => {
    async function fetchQuota() {
      try {
        const res = await fetch('/api/chat/quota');
        if (res.ok) {
          const data = await res.json();
          setQuota(data);
        }
      } catch (err) {
        console.error('Failed to fetch quota:', err);
      }
    }
    fetchQuota();
  }, []);

  // 시나리오 선택 시 환영 메시지
  useEffect(() => {
    if (scenario && messages.length === 0) {
      const welcomeMessages: Record<ChatScenario, string> = {
        love: `안녕하세요${userName ? ` ${userName}님` : ''}! 💕\n\n연애와 결혼에 관한 상담을 도와드릴게요.\n\n당신의 사주를 분석해보니 **도화살**과 **천을귀인**의 영향이 보이네요.\n\n어떤 점이 궁금하신가요?\n- 나의 이상형은 어떤 사람인가요?\n- 올해 연애운이 어떤가요?\n- 결혼하기 좋은 시기는 언제인가요?`,
        career: `안녕하세요${userName ? ` ${userName}님` : ''}! 💼\n\n커리어와 직장에 관한 상담을 도와드릴게요.\n\n당신의 사주에서 **관성**과 **인성**을 분석했어요.\n\n어떤 점이 궁금하신가요?\n- 이직하기 좋은 시기는 언제인가요?\n- 나에게 맞는 업종/직무는 무엇인가요?\n- 올해 승진 가능성이 있을까요?`,
        finance: `안녕하세요${userName ? ` ${userName}님` : ''}! 💰\n\n재테크와 금전운에 관한 상담을 도와드릴게요.\n\n당신의 **재성**과 **세운**을 분석했어요.\n\n어떤 점이 궁금하신가요?\n- 투자하기 좋은 시기는 언제인가요?\n- 올해 재물운이 어떤가요?\n- 사업을 시작해도 괜찮을까요?`,
        health: `안녕하세요${userName ? ` ${userName}님` : ''}! 🏥\n\n건강과 체질에 관한 상담을 도와드릴게요.\n\n당신의 **오행 체질**을 분석했어요.\n\n어떤 점이 궁금하신가요?\n- 나의 체질에 맞는 운동은 무엇인가요?\n- 특별히 주의해야 할 건강 부위가 있나요?\n- 올해 건강 관리 팁을 알려주세요.`,
        family: `안녕하세요${userName ? ` ${userName}님` : ''}! 👨‍👩‍👧\n\n가족과 인간관계에 관한 상담을 도와드릴게요.\n\n당신의 **육친** 관계를 분석했어요.\n\n어떤 점이 궁금하신가요?\n- 부모님과의 관계를 개선하고 싶어요.\n- 자녀와 소통하는 방법이 궁금해요.\n- 형제/자매와의 관계가 어렵습니다.`
      };

      const welcomeMsg: ChatMessageType = {
        id: `welcome-${Date.now()}`,
        role: 'assistant',
        content: welcomeMessages[scenario],
        timestamp: new Date()
      };
      setMessages([welcomeMsg]);
    }
  }, [scenario, userName, messages.length]);

  // 메시지 전송
  const handleSend = async () => {
    if (!input.trim() || !scenario || isLoading) return;

    const userMessage: ChatMessageType = {
      id: `user-${Date.now()}`,
      role: 'user',
      content: input.trim(),
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMessage]);
    setInput('');
    setIsLoading(true);
    setError(null);

    try {
      const request: ChatRequest = {
        sessionId: sessionId || undefined,
        scenario,
        message: userMessage.content,
        sajuData
      };

      const res = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(request)
      });

      if (!res.ok) {
        const errorData = await res.json();
        throw new Error(errorData.error || '응답 생성에 실패했습니다.');
      }

      const data = await res.json();

      if (!sessionId) {
        setSessionId(data.sessionId);
      }

      const assistantMessage: ChatMessageType = {
        id: `assistant-${Date.now()}`,
        role: 'assistant',
        content: data.message,
        timestamp: new Date(),
        tokensUsed: data.tokensUsed
      };

      setMessages(prev => [...prev, assistantMessage]);

      // 사용량 업데이트
      if (quota) {
        setQuota({
          ...quota,
          usedToday: quota.usedToday + 1,
          tokensUsedToday: quota.tokensUsedToday + data.tokensUsed
        });
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : '오류가 발생했습니다.');
    } finally {
      setIsLoading(false);
      textareaRef.current?.focus();
    }
  };

  // Enter 키 전송
  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  // 새 대화 시작
  const handleReset = () => {
    setMessages([]);
    setSessionId(null);
    setScenario(null);
    setError(null);
  };

  return (
    <div className="flex flex-col h-full max-h-[800px] bg-gray-50 dark:bg-gray-900 rounded-xl overflow-hidden">
      {/* 헤더 */}
      <div className="flex items-center justify-between p-4 bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-gradient-to-br from-purple-500 to-blue-500 rounded-full flex items-center justify-center">
            <Sparkles className="w-5 h-5 text-white" />
          </div>
          <div>
            <h2 className="font-semibold text-gray-800 dark:text-white">AI 사주 상담</h2>
            <p className="text-xs text-gray-500">당신의 사주 데이터를 기반으로 맞춤 상담</p>
          </div>
        </div>

        {messages.length > 0 && (
          <Button
            variant="outline"
            size="sm"
            onClick={handleReset}
            className="gap-1"
          >
            <RefreshCw className="w-4 h-4" />
            새 대화
          </Button>
        )}
      </div>

      {/* 사이드바 (데스크톱) */}
      <div className="flex flex-1 overflow-hidden">
        <div className="hidden lg:block w-64 p-4 bg-white dark:bg-gray-800 border-r border-gray-200 dark:border-gray-700 overflow-y-auto">
          <TokenCounter quota={quota} className="mb-4" />

          {!scenario && (
            <div className="p-3 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
              <div className="flex items-center gap-2 text-blue-700 dark:text-blue-400 mb-1">
                <Info className="w-4 h-4" />
                <span className="text-sm font-medium">시작하기</span>
              </div>
              <p className="text-xs text-blue-600 dark:text-blue-300">
                상담 주제를 선택하면 AI가 맞춤 상담을 시작합니다.
              </p>
            </div>
          )}
        </div>

        {/* 메인 채팅 영역 */}
        <div className="flex-1 flex flex-col overflow-hidden">
          {/* 시나리오 미선택 시 */}
          {!scenario ? (
            <div className="flex-1 flex flex-col items-center justify-center p-6">
              <div className="max-w-md w-full">
                <div className="text-center mb-6">
                  <h3 className="text-xl font-bold text-gray-800 dark:text-white mb-2">
                    무엇이 궁금하신가요?
                  </h3>
                  <p className="text-sm text-gray-500">
                    상담 주제를 선택하면 사주 데이터를 기반으로<br />
                    맞춤 상담을 시작합니다.
                  </p>
                </div>
                <ScenarioSelector
                  selected={scenario}
                  onSelect={setScenario}
                />
              </div>
            </div>
          ) : (
            <>
              {/* 메시지 목록 */}
              <div className="flex-1 overflow-y-auto p-4 space-y-4">
                {/* 모바일 사용량 표시 */}
                <div className="lg:hidden">
                  <TokenCounter quota={quota} className="mb-4" />
                </div>

                {messages.map((msg) => (
                  <ChatMessage key={msg.id} message={msg} />
                ))}

                {isLoading && (
                  <ChatMessage
                    message={{
                      id: 'loading',
                      role: 'assistant',
                      content: '',
                      timestamp: new Date()
                    }}
                    isTyping
                  />
                )}

                {error && (
                  <div className="p-4 bg-red-50 dark:bg-red-900/20 rounded-lg text-red-600 dark:text-red-400 text-sm">
                    {error}
                  </div>
                )}

                <div ref={messagesEndRef} />
              </div>

              {/* 입력 영역 */}
              <div className="p-4 bg-white dark:bg-gray-800 border-t border-gray-200 dark:border-gray-700">
                <div className="flex gap-2">
                  <Textarea
                    ref={textareaRef}
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    onKeyDown={handleKeyDown}
                    placeholder="메시지를 입력하세요... (Shift+Enter: 줄바꿈)"
                    className="min-h-[60px] max-h-[120px] resize-none"
                    disabled={isLoading}
                  />
                  <Button
                    onClick={handleSend}
                    disabled={!input.trim() || isLoading}
                    className={cn(
                      'h-auto min-w-[60px] bg-gradient-to-r from-purple-500 to-blue-500',
                      'hover:from-purple-600 hover:to-blue-600'
                    )}
                  >
                    {isLoading ? (
                      <Loader2 className="w-5 h-5 animate-spin" />
                    ) : (
                      <Send className="w-5 h-5" />
                    )}
                  </Button>
                </div>

                <p className="mt-2 text-xs text-gray-400 text-center">
                  AI 상담은 참고용이며, 중요한 결정은 전문가와 상담하세요.
                </p>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
