'use client';

import { useLocale } from 'next-intl';
import { AlertTriangle } from 'lucide-react';
import { cn } from '@/lib/utils';

interface DisclaimerProps {
  className?: string;
}

const disclaimers: Record<string, string> = {
  ko: '본 서비스는 AI 데이터 분석 기반의 엔터테인먼트 서비스이며, 전문적인 의료, 법률, 재무 상담을 대체하지 않습니다. 결과는 참고용이며, 중요한 의사결정 시 전문가 상담을 권장합니다.',
  ja: '本サービスはAIデータ分析に基づくエンターテインメントサービスであり、専門的な医療、法律、財務相談に代わるものではありません。結果は参考用であり、重要な意思決定の際は専門家にご相談ください。',
  en: 'This service is an AI data analysis-based entertainment service and does not replace professional medical, legal, or financial advice. Results are for reference only. We recommend consulting a professional for important decisions.',
};

export function Disclaimer({ className }: DisclaimerProps) {
  const locale = useLocale();
  const text = disclaimers[locale] || disclaimers.en;

  return (
    <div
      className={cn(
        'flex items-start gap-2 p-3 rounded-lg bg-muted/50 border border-muted-foreground/10',
        className
      )}
    >
      <AlertTriangle className="h-4 w-4 text-muted-foreground shrink-0 mt-0.5" />
      <p className="text-xs text-muted-foreground leading-relaxed">{text}</p>
    </div>
  );
}
