'use client';

import { cn } from '@/lib/utils';
import { MessageSquare, Zap, Crown } from 'lucide-react';
import type { UserChatQuota } from '@/types/chat';

interface TokenCounterProps {
  quota: UserChatQuota | null;
  className?: string;
}

export function TokenCounter({ quota, className }: TokenCounterProps) {
  if (!quota) {
    return (
      <div className={cn('animate-pulse bg-gray-100 dark:bg-gray-800 rounded-lg h-16', className)} />
    );
  }

  const messagesUsed = quota.usedToday;
  const messagesLimit = quota.dailyLimit;
  const messagesPercent = Math.min((messagesUsed / messagesLimit) * 100, 100);

  const tokensUsed = quota.tokensUsedToday;
  const tokensLimit = quota.tier === 'free' ? 1500 : quota.tier === 'subscriber' ? 10000 : 20000;
  const tokensPercent = Math.min((tokensUsed / tokensLimit) * 100, 100);

  const tierInfo = {
    free: { label: '무료', color: 'gray', icon: <MessageSquare className="w-4 h-4" /> },
    subscriber: { label: '구독자', color: 'blue', icon: <Zap className="w-4 h-4" /> },
    premium: { label: '프리미엄', color: 'purple', icon: <Crown className="w-4 h-4" /> }
  };

  const tier = tierInfo[quota.tier];

  return (
    <div className={cn('p-4 bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700', className)}>
      {/* 티어 정보 */}
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2">
          <div className={cn(
            'p-1.5 rounded-lg',
            quota.tier === 'free' ? 'bg-gray-100 text-gray-600' :
            quota.tier === 'subscriber' ? 'bg-blue-100 text-blue-600' :
            'bg-purple-100 text-purple-600'
          )}>
            {tier.icon}
          </div>
          <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
            {tier.label} 플랜
          </span>
        </div>
        <span className="text-xs text-gray-400">
          {new Date(quota.resetAt).toLocaleDateString('ko-KR')} 초기화
        </span>
      </div>

      {/* 메시지 사용량 */}
      <div className="space-y-2">
        <div className="flex items-center justify-between text-sm">
          <span className="text-gray-600 dark:text-gray-400">오늘 상담</span>
          <span className={cn(
            'font-medium',
            messagesPercent >= 100 ? 'text-red-500' :
            messagesPercent >= 80 ? 'text-yellow-500' :
            'text-green-500'
          )}>
            {messagesUsed} / {messagesLimit}회
          </span>
        </div>

        <div className="h-2 bg-gray-100 dark:bg-gray-700 rounded-full overflow-hidden">
          <div
            className={cn(
              'h-full transition-all duration-300',
              messagesPercent >= 100 ? 'bg-red-500' :
              messagesPercent >= 80 ? 'bg-yellow-500' :
              'bg-green-500'
            )}
            style={{ width: `${messagesPercent}%` }}
          />
        </div>
      </div>

      {/* 토큰 사용량 */}
      <div className="mt-3 space-y-2">
        <div className="flex items-center justify-between text-sm">
          <span className="text-gray-600 dark:text-gray-400">토큰 사용</span>
          <span className={cn(
            'font-medium',
            tokensPercent >= 100 ? 'text-red-500' :
            tokensPercent >= 80 ? 'text-yellow-500' :
            'text-gray-500'
          )}>
            {tokensUsed.toLocaleString()} / {tokensLimit.toLocaleString()}
          </span>
        </div>

        <div className="h-1.5 bg-gray-100 dark:bg-gray-700 rounded-full overflow-hidden">
          <div
            className={cn(
              'h-full transition-all duration-300 bg-gradient-to-r',
              tokensPercent >= 100 ? 'from-red-400 to-red-600' :
              tokensPercent >= 80 ? 'from-yellow-400 to-yellow-600' :
              'from-blue-400 to-purple-600'
            )}
            style={{ width: `${tokensPercent}%` }}
          />
        </div>
      </div>

      {/* 경고 메시지 */}
      {messagesPercent >= 100 && (
        <div className="mt-3 p-2 bg-red-50 dark:bg-red-900/20 rounded-lg">
          <p className="text-xs text-red-600 dark:text-red-400">
            오늘 무료 상담 횟수를 모두 사용했습니다.
            추가 상담은 100P가 필요합니다.
          </p>
        </div>
      )}
    </div>
  );
}
