'use client';

import { useState, useRef, useEffect } from 'react';
import { MessageCircle, X, Send, Bot, User, Sparkles, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

interface Message {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: Date;
}

const quickQuestions = [
  '어떤 AI로 수익화를 시작하면 좋을까요?',
  '초보자에게 추천하는 AI 툴은?',
  '로또 분석 기능은 어떻게 사용하나요?',
  '프리미엄 서비스 혜택이 궁금해요',
];

const defaultResponses: Record<string, string> = {
  '어떤 AI로 수익화를 시작하면 좋을까요?': '초보자분께는 ChatGPT나 Claude로 블로그 글쓰기나 카피라이팅을 추천드려요. 월 50~150만원 수익이 가능하고, 별도의 기술 없이 시작할 수 있습니다. 자세한 내용은 "전체 순위" 메뉴에서 확인해보세요!',
  '초보자에게 추천하는 AI 툴은?': '1️⃣ ChatGPT - 글쓰기, 번역\n2️⃣ Midjourney - 이미지 생성\n3️⃣ Canva AI - 디자인\n\n이 세 가지로 시작하시면 다양한 수익화가 가능합니다!',
  '로또 분석 기능은 어떻게 사용하나요?': '로또 분석 메뉴에서 AI 기반 번호 생성, 통계 분석, 과거 당첨 패턴을 확인할 수 있어요. 필터 설정으로 원하는 조건의 번호만 생성할 수도 있습니다.',
  '프리미엄 서비스 혜택이 궁금해요': '프리미엄 회원은 다음 혜택을 받으실 수 있어요:\n✅ 고급 필터 조합 무제한\n✅ AI 맞춤 추천\n✅ 백테스트 시뮬레이션\n✅ 당첨 자동 대조\n✅ 우선 고객 지원',
};

export function AIChatbot() {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      role: 'assistant',
      content: '안녕하세요! AI-PlanX 상담 봇입니다. 🤖\n\nAI 수익화, 로또 분석, 서비스 이용에 대해 무엇이든 물어보세요!',
      timestamp: new Date(),
    },
  ]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSend = async (text?: string) => {
    const messageText = text || input.trim();
    if (!messageText || isLoading) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      role: 'user',
      content: messageText,
      timestamp: new Date(),
    };

    setMessages((prev) => [...prev, userMessage]);
    setInput('');
    setIsLoading(true);

    // Simulate AI response
    setTimeout(() => {
      const response = defaultResponses[messageText] ||
        '감사합니다! 해당 질문에 대해 더 자세한 상담이 필요하시면 커뮤니티에 질문을 남겨주시거나, 프리미엄 1:1 상담을 이용해주세요. 😊';

      const assistantMessage: Message = {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content: response,
        timestamp: new Date(),
      };

      setMessages((prev) => [...prev, assistantMessage]);
      setIsLoading(false);
    }, 1000);
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  return (
    <>
      {/* Floating Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className={cn(
          'fixed bottom-6 right-6 z-50 w-14 h-14 rounded-full shadow-2xl transition-all duration-300 flex items-center justify-center',
          isOpen
            ? 'bg-gray-600 hover:bg-gray-700 rotate-0'
            : 'bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600 hover:scale-110 shadow-amber-500/40'
        )}
      >
        {isOpen ? (
          <X className="h-6 w-6 text-white" />
        ) : (
          <MessageCircle className="h-6 w-6 text-white" />
        )}
      </button>

      {/* Chat Window */}
      {isOpen && (
        <div className="fixed bottom-24 right-6 z-50 w-[380px] max-w-[calc(100vw-48px)] bg-background border border-border rounded-2xl shadow-2xl overflow-hidden animate-in slide-in-from-bottom-4 fade-in duration-300">
          {/* Header */}
          <div className="bg-gradient-to-r from-amber-500 to-orange-500 p-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-white/20 flex items-center justify-center">
                <Bot className="h-5 w-5 text-white" />
              </div>
              <div>
                <h3 className="font-semibold text-white">AI-PlanX 상담</h3>
                <p className="text-white/80 text-xs flex items-center gap-1">
                  <span className="w-2 h-2 bg-green-400 rounded-full animate-pulse" />
                  온라인
                </p>
              </div>
            </div>
          </div>

          {/* Messages */}
          <div className="h-[350px] overflow-y-auto p-4 space-y-4 bg-gradient-to-b from-amber-50/30 to-background dark:from-amber-950/10 dark:to-background">
            {messages.map((message) => (
              <div
                key={message.id}
                className={cn(
                  'flex gap-2',
                  message.role === 'user' ? 'justify-end' : 'justify-start'
                )}
              >
                {message.role === 'assistant' && (
                  <div className="w-8 h-8 rounded-full bg-gradient-to-br from-amber-400 to-orange-500 flex items-center justify-center flex-shrink-0">
                    <Sparkles className="h-4 w-4 text-white" />
                  </div>
                )}
                <div
                  className={cn(
                    'max-w-[75%] rounded-2xl px-4 py-2.5 text-sm whitespace-pre-line',
                    message.role === 'user'
                      ? 'bg-gradient-to-r from-amber-500 to-orange-500 text-white rounded-br-md'
                      : 'bg-white dark:bg-gray-800 border border-border shadow-sm rounded-bl-md'
                  )}
                >
                  {message.content}
                </div>
                {message.role === 'user' && (
                  <div className="w-8 h-8 rounded-full bg-gray-200 dark:bg-gray-700 flex items-center justify-center flex-shrink-0">
                    <User className="h-4 w-4 text-gray-600 dark:text-gray-300" />
                  </div>
                )}
              </div>
            ))}
            {isLoading && (
              <div className="flex gap-2 justify-start">
                <div className="w-8 h-8 rounded-full bg-gradient-to-br from-amber-400 to-orange-500 flex items-center justify-center flex-shrink-0">
                  <Sparkles className="h-4 w-4 text-white" />
                </div>
                <div className="bg-white dark:bg-gray-800 border border-border shadow-sm rounded-2xl rounded-bl-md px-4 py-3">
                  <Loader2 className="h-4 w-4 animate-spin text-amber-500" />
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Quick Questions */}
          <div className="px-4 py-2 border-t border-border bg-secondary/30">
            <p className="text-xs text-muted-foreground mb-2">자주 묻는 질문</p>
            <div className="flex flex-wrap gap-1.5">
              {quickQuestions.map((question, i) => (
                <button
                  key={i}
                  onClick={() => handleSend(question)}
                  className="text-xs px-2.5 py-1.5 rounded-full bg-white dark:bg-gray-800 border border-border hover:border-amber-300 hover:bg-amber-50 dark:hover:bg-amber-900/20 transition-colors truncate max-w-full"
                >
                  {question.length > 20 ? question.slice(0, 20) + '...' : question}
                </button>
              ))}
            </div>
          </div>

          {/* Input */}
          <div className="p-4 border-t border-border bg-background">
            <div className="flex gap-2">
              <input
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyPress={handleKeyPress}
                placeholder="메시지를 입력하세요..."
                className="flex-1 px-4 py-2.5 rounded-xl border border-border bg-secondary/50 focus:outline-none focus:ring-2 focus:ring-amber-500/50 focus:border-amber-500 text-sm"
              />
              <Button
                onClick={() => handleSend()}
                disabled={!input.trim() || isLoading}
                className="bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600 text-white rounded-xl px-4"
              >
                <Send className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
