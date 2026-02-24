'use client';

import { cn } from '@/lib/utils';
import { Bot, User } from 'lucide-react';
import type { ChatMessage as ChatMessageType } from '@/types/chat';

interface ChatMessageProps {
  message: ChatMessageType;
  isTyping?: boolean;
}

export function ChatMessage({ message, isTyping }: ChatMessageProps) {
  const isAssistant = message.role === 'assistant';

  return (
    <div
      className={cn(
        'flex gap-3 p-4 rounded-lg',
        isAssistant
          ? 'bg-gradient-to-r from-purple-50 to-blue-50 dark:from-purple-900/20 dark:to-blue-900/20'
          : 'bg-gray-50 dark:bg-gray-800/50'
      )}
    >
      {/* 아바타 */}
      <div
        className={cn(
          'flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center',
          isAssistant
            ? 'bg-gradient-to-br from-purple-500 to-blue-500 text-white'
            : 'bg-gray-200 dark:bg-gray-700 text-gray-600 dark:text-gray-300'
        )}
      >
        {isAssistant ? <Bot className="w-5 h-5" /> : <User className="w-5 h-5" />}
      </div>

      {/* 메시지 내용 */}
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2 mb-1">
          <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
            {isAssistant ? 'AI 상담사' : '나'}
          </span>
          <span className="text-xs text-gray-400">
            {new Date(message.timestamp).toLocaleTimeString('ko-KR', {
              hour: '2-digit',
              minute: '2-digit'
            })}
          </span>
        </div>

        <div className="text-sm text-gray-800 dark:text-gray-200 whitespace-pre-wrap">
          {isTyping ? (
            <span className="flex items-center gap-1">
              <span className="w-2 h-2 bg-purple-500 rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
              <span className="w-2 h-2 bg-purple-500 rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
              <span className="w-2 h-2 bg-purple-500 rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
            </span>
          ) : (
            <MessageContent content={message.content} />
          )}
        </div>

        {/* 토큰 사용량 (어시스턴트만) */}
        {isAssistant && message.tokensUsed && (
          <div className="mt-2 text-xs text-gray-400">
            토큰 사용: {message.tokensUsed}
          </div>
        )}
      </div>
    </div>
  );
}

function MessageContent({ content }: { content: string }) {
  // 마크다운 스타일 파싱 (간단 버전)
  const lines = content.split('\n');

  return (
    <div className="space-y-2">
      {lines.map((line, idx) => {
        // 제목 스타일
        if (line.startsWith('###')) {
          return (
            <h4 key={idx} className="font-semibold text-purple-700 dark:text-purple-400 mt-3">
              {line.replace(/^###\s*/, '')}
            </h4>
          );
        }
        if (line.startsWith('##')) {
          return (
            <h3 key={idx} className="font-bold text-lg text-purple-800 dark:text-purple-300 mt-4">
              {line.replace(/^##\s*/, '')}
            </h3>
          );
        }

        // 리스트 아이템
        if (line.startsWith('- ') || line.startsWith('• ')) {
          return (
            <div key={idx} className="flex gap-2 ml-2">
              <span className="text-purple-500">•</span>
              <span>{line.replace(/^[-•]\s*/, '')}</span>
            </div>
          );
        }

        // 숫자 리스트
        if (/^\d+\.\s/.test(line)) {
          const match = line.match(/^(\d+)\.\s(.*)$/);
          if (match) {
            return (
              <div key={idx} className="flex gap-2 ml-2">
                <span className="text-purple-500 font-medium">{match[1]}.</span>
                <span>{match[2]}</span>
              </div>
            );
          }
        }

        // 강조 텍스트
        if (line.includes('**')) {
          const parts = line.split(/\*\*(.*?)\*\*/g);
          return (
            <p key={idx}>
              {parts.map((part, i) =>
                i % 2 === 1 ? (
                  <strong key={i} className="text-purple-700 dark:text-purple-400">
                    {part}
                  </strong>
                ) : (
                  part
                )
              )}
            </p>
          );
        }

        // 일반 텍스트
        if (line.trim()) {
          return <p key={idx}>{line}</p>;
        }

        return <div key={idx} className="h-2" />;
      })}
    </div>
  );
}
