'use client';

import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';

interface NativeAdProps {
  context?: 'health' | 'love' | 'career' | 'wealth' | 'general';
  className?: string;
  isPremium?: boolean;
}

// Context-aware native ads for synergy with fortune content
const contextAds: Record<string, { title: string; description: string; cta: string }> = {
  health: {
    title: '건강운이 걱정되시나요?',
    description: '맞춤 건강 상담을 받아보세요',
    cta: '자세히 보기',
  },
  love: {
    title: '인연을 찾고 계신가요?',
    description: '사주 궁합으로 확인하는 나의 인연',
    cta: '궁합 보기',
  },
  career: {
    title: '직업운이 높은 지금!',
    description: '사주 기반 적성 분석으로 커리어 전환을 계획해보세요',
    cta: '적성 분석',
  },
  wealth: {
    title: '재물운을 높이는 방법',
    description: '올해 재테크 운세와 함께 스마트한 투자 계획을 세워보세요',
    cta: '재물운 분석',
  },
  general: {
    title: '프리미엄 분석으로 더 깊이 알아보세요',
    description: '월 3,900원부터 광고 없는 상세 분석',
    cta: '업그레이드',
  },
};

export function NativeAd({ context = 'general', className, isPremium = false }: NativeAdProps) {
  if (isPremium) return null;

  const ad = contextAds[context] || contextAds.general;

  return (
    <Card className={cn('bg-muted/30 border-dashed', className)}>
      <CardContent className="p-4">
        <div className="flex items-start justify-between">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <Badge variant="outline" className="text-[10px] px-1.5 py-0">
                AD
              </Badge>
              <h4 className="text-sm font-medium">{ad.title}</h4>
            </div>
            <p className="text-xs text-muted-foreground">{ad.description}</p>
          </div>
          <button className="text-xs text-primary font-medium hover:underline whitespace-nowrap ml-4">
            {ad.cta}
          </button>
        </div>
      </CardContent>
    </Card>
  );
}
