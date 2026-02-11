'use client';

import { Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { CheckCircle2, Loader2, ArrowRight, Sparkles, CreditCard, QrCode } from 'lucide-react';
import { Link } from '@/i18n/routing';

const typeConfig: Record<string, {
  title: string;
  description: string;
  icon: typeof Sparkles;
  redirectPath: string;
  redirectLabel: string;
}> = {
  point: {
    title: '포인트 충전 완료',
    description: '포인트가 성공적으로 충전되었습니다. 지금 바로 분석 서비스를 이용해보세요.',
    icon: Sparkles,
    redirectPath: '/my/dashboard',
    redirectLabel: '대시보드로 이동',
  },
  subscription: {
    title: '구독 결제 완료',
    description: '구독이 성공적으로 활성화되었습니다.',
    icon: CreditCard,
    redirectPath: '/my/dashboard',
    redirectLabel: '대시보드로 이동',
  },
  analysis: {
    title: '분석 결제 완료',
    description: '결제가 완료되었습니다. 분석 결과를 확인해보세요.',
    icon: Sparkles,
    redirectPath: '/my/dashboard',
    redirectLabel: '분석 결과 보기',
  },
  qr: {
    title: 'QR 플랜 결제 완료',
    description: 'QR코드 플랜이 활성화되었습니다.',
    icon: QrCode,
    redirectPath: '/qrcode',
    redirectLabel: 'QR코드 생성하기',
  },
};

function PaymentSuccessContent() {
  const searchParams = useSearchParams();
  const type = searchParams.get('type') || 'point';
  const orderId = searchParams.get('orderId');

  const config = typeConfig[type] || typeConfig.point;
  const Icon = config.icon;

  return (
    <div className="container mx-auto px-4 py-8 max-w-lg">
      <Card className="text-center">
        <CardHeader className="pb-2">
          <div className="mx-auto w-16 h-16 rounded-full bg-green-100 dark:bg-green-900/30 flex items-center justify-center mb-4">
            <CheckCircle2 className="h-10 w-10 text-green-600 dark:text-green-400" />
          </div>
          <CardTitle className="text-xl">{config.title}</CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="flex items-center justify-center gap-2 text-muted-foreground">
            <Icon className="h-5 w-5" />
            <p>{config.description}</p>
          </div>

          {orderId && (
            <div className="text-xs text-muted-foreground bg-muted/50 rounded-lg p-3">
              <span className="font-medium">주문번호: </span>
              <span className="font-mono">{orderId}</span>
            </div>
          )}

          <div className="flex flex-col gap-3 pt-2">
            <Link href={config.redirectPath}>
              <Button className="w-full" size="lg">
                {config.redirectLabel}
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </Link>
            <Link href="/my/dashboard">
              <Button variant="ghost" className="w-full">
                대시보드로 돌아가기
              </Button>
            </Link>
          </div>

          <p className="text-xs text-muted-foreground">
            결제 관련 문의: 1588-5617 | mymiryu@gmail.com
          </p>
        </CardContent>
      </Card>
    </div>
  );
}

export default function PaymentSuccessPage() {
  return (
    <Suspense fallback={
      <div className="container mx-auto px-4 py-8 max-w-lg">
        <Card className="text-center p-8">
          <Loader2 className="h-8 w-8 mx-auto mb-4 animate-spin text-primary" />
          <p className="text-muted-foreground">결제 결과를 확인하는 중...</p>
        </Card>
      </div>
    }>
      <PaymentSuccessContent />
    </Suspense>
  );
}
