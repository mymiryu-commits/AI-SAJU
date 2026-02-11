'use client';

import { Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { XCircle, Loader2, ArrowLeft, RefreshCw } from 'lucide-react';
import { Link } from '@/i18n/routing';

const errorMessages: Record<string, string> = {
  missing_params: '결제 정보가 누락되었습니다.',
  invalid_order_id: '유효하지 않은 주문번호입니다.',
  invalid_amount: '유효하지 않은 결제 금액입니다.',
  payment_not_found: '결제 정보를 찾을 수 없습니다.',
  amount_mismatch: '결제 금액이 일치하지 않습니다.',
  payment_config_error: '결제 설정에 문제가 있습니다. 고객센터로 문의해주세요.',
  confirmation_failed: '결제 승인에 실패했습니다.',
  update_failed: '결제 처리 중 오류가 발생했습니다.',
  server_error: '서버 오류가 발생했습니다. 잠시 후 다시 시도해주세요.',
  PAY_PROCESS_CANCELED: '결제가 취소되었습니다.',
  PAY_PROCESS_ABORTED: '결제가 중단되었습니다.',
  REJECT_CARD_COMPANY: '카드사에서 결제를 거절했습니다. 다른 카드로 시도해주세요.',
};

function PaymentFailContent() {
  const searchParams = useSearchParams();
  const errorCode = searchParams.get('error') || 'unknown';
  const errorMessage = searchParams.get('message');

  const displayMessage = errorMessage
    ? decodeURIComponent(errorMessage)
    : errorMessages[errorCode] || '결제 처리 중 문제가 발생했습니다.';

  return (
    <div className="container mx-auto px-4 py-8 max-w-lg">
      <Card className="text-center">
        <CardHeader className="pb-2">
          <div className="mx-auto w-16 h-16 rounded-full bg-red-100 dark:bg-red-900/30 flex items-center justify-center mb-4">
            <XCircle className="h-10 w-10 text-red-600 dark:text-red-400" />
          </div>
          <CardTitle className="text-xl">결제 실패</CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <p className="text-muted-foreground">{displayMessage}</p>

          {errorCode !== 'unknown' && (
            <div className="text-xs text-muted-foreground bg-muted/50 rounded-lg p-3">
              <span className="font-medium">오류 코드: </span>
              <span className="font-mono">{errorCode}</span>
            </div>
          )}

          <div className="flex flex-col gap-3 pt-2">
            <Link href="/pricing">
              <Button className="w-full" size="lg">
                <RefreshCw className="mr-2 h-4 w-4" />
                다시 결제하기
              </Button>
            </Link>
            <Link href="/my/dashboard">
              <Button variant="outline" className="w-full">
                <ArrowLeft className="mr-2 h-4 w-4" />
                대시보드로 돌아가기
              </Button>
            </Link>
          </div>

          <p className="text-xs text-muted-foreground">
            문제가 지속되면 고객센터로 문의해주세요.<br />
            1588-5617 | mymiryu@gmail.com
          </p>
        </CardContent>
      </Card>
    </div>
  );
}

export default function PaymentFailPage() {
  return (
    <Suspense fallback={
      <div className="container mx-auto px-4 py-8 max-w-lg">
        <Card className="text-center p-8">
          <Loader2 className="h-8 w-8 mx-auto mb-4 animate-spin text-primary" />
          <p className="text-muted-foreground">결제 결과를 확인하는 중...</p>
        </Card>
      </div>
    }>
      <PaymentFailContent />
    </Suspense>
  );
}
