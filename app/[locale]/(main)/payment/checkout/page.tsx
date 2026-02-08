'use client';

import { useEffect, useRef, useState, Suspense } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import Script from 'next/script';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Loader2, CreditCard, AlertCircle, ArrowLeft } from 'lucide-react';
import { Link } from '@/i18n/routing';

declare global {
  interface Window {
    TossPayments?: {
      (clientKey: string): {
        requestPayment(
          method: string,
          options: {
            amount: number;
            orderId: string;
            orderName: string;
            successUrl: string;
            failUrl: string;
            customerEmail?: string;
            customerName?: string;
          }
        ): Promise<void>;
      };
    };
  }
}

function CheckoutPageContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const scriptLoaded = useRef(false);

  const orderId = searchParams.get('orderId');
  const orderName = searchParams.get('orderName');
  const amount = searchParams.get('amount');
  const successUrl = searchParams.get('successUrl');
  const failUrl = searchParams.get('failUrl');

  useEffect(() => {
    // 필수 파라미터 검증
    if (!orderId || !orderName || !amount || !successUrl || !failUrl) {
      setError('결제 정보가 올바르지 않습니다.');
      setIsLoading(false);
    } else {
      setIsLoading(false);
    }
  }, [orderId, orderName, amount, successUrl, failUrl]);

  const handleScriptLoad = () => {
    scriptLoaded.current = true;
  };

  const handlePayment = async () => {
    if (!window.TossPayments) {
      setError('결제 모듈을 불러오는 중입니다. 잠시 후 다시 시도해주세요.');
      return;
    }

    const clientKey = process.env.NEXT_PUBLIC_TOSS_PAYMENTS_CLIENT_KEY;
    if (!clientKey) {
      setError('결제 설정이 올바르지 않습니다.');
      return;
    }

    try {
      setIsProcessing(true);
      const tossPayments = window.TossPayments(clientKey);

      await tossPayments.requestPayment('카드', {
        amount: parseInt(amount!),
        orderId: orderId!,
        orderName: decodeURIComponent(orderName!),
        successUrl: successUrl!,
        failUrl: failUrl!,
      });
    } catch (err: unknown) {
      // 사용자가 결제창을 닫은 경우
      if (typeof err === 'object' && err !== null && 'code' in err && (err as { code: string }).code === 'USER_CANCEL') {
        setIsProcessing(false);
        return;
      }
      console.error('Payment error:', err);
      setError('결제 처리 중 오류가 발생했습니다.');
      setIsProcessing(false);
    }
  };

  const formatPrice = (price: string | null) => {
    if (!price) return '0';
    return new Intl.NumberFormat('ko-KR').format(parseInt(price));
  };

  if (isLoading) {
    return (
      <div className="container mx-auto px-4 py-8 max-w-lg">
        <Card className="text-center p-8">
          <Loader2 className="h-8 w-8 mx-auto mb-4 animate-spin text-primary" />
          <p className="text-muted-foreground">결제 정보를 불러오는 중...</p>
        </Card>
      </div>
    );
  }

  if (error) {
    return (
      <div className="container mx-auto px-4 py-8 max-w-lg">
        <Card className="text-center p-8">
          <AlertCircle className="h-12 w-12 mx-auto mb-4 text-red-500" />
          <h2 className="text-lg font-semibold mb-2">오류가 발생했습니다</h2>
          <p className="text-muted-foreground mb-4">{error}</p>
          <Link href="/my/vouchers">
            <Button variant="outline">
              <ArrowLeft className="mr-2 h-4 w-4" />
              돌아가기
            </Button>
          </Link>
        </Card>
      </div>
    );
  }

  return (
    <>
      <Script
        src="https://js.tosspayments.com/v1/payment"
        onLoad={handleScriptLoad}
        strategy="afterInteractive"
      />

      <div className="container mx-auto px-4 py-8 max-w-lg">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <CreditCard className="h-5 w-5" />
              결제하기
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* 주문 정보 */}
            <div className="space-y-4">
              <div className="flex justify-between items-center py-3 border-b">
                <span className="text-muted-foreground">상품명</span>
                <span className="font-medium">{decodeURIComponent(orderName || '')}</span>
              </div>
              <div className="flex justify-between items-center py-3 border-b">
                <span className="text-muted-foreground">주문번호</span>
                <span className="text-sm font-mono">{orderId}</span>
              </div>
              <div className="flex justify-between items-center py-3">
                <span className="text-muted-foreground">결제금액</span>
                <span className="text-2xl font-bold text-primary">
                  {formatPrice(amount)}원
                </span>
              </div>
            </div>

            {/* 결제 버튼 */}
            <Button
              className="w-full h-12 text-lg"
              onClick={handlePayment}
              disabled={isProcessing}
            >
              {isProcessing ? (
                <>
                  <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                  결제 진행 중...
                </>
              ) : (
                <>
                  <CreditCard className="mr-2 h-5 w-5" />
                  {formatPrice(amount)}원 결제하기
                </>
              )}
            </Button>

            {/* 취소 */}
            <div className="text-center">
              <Link href="/my/vouchers">
                <Button variant="ghost" disabled={isProcessing}>
                  취소하고 돌아가기
                </Button>
              </Link>
            </div>

            {/* 안내 문구 */}
            <div className="text-xs text-muted-foreground space-y-1 pt-4 border-t">
              <p>• 결제는 토스페이먼츠를 통해 안전하게 처리됩니다.</p>
              <p>• 결제 완료 후 이용권이 즉시 충전됩니다.</p>
              <p>• 환불 정책은 <Link href="/legal/refund" className="underline">환불 정책</Link>을 참고해주세요.</p>
            </div>
          </CardContent>
        </Card>
      </div>
    </>
  );
}

// Wrapper with Suspense for useSearchParams
export default function CheckoutPage() {
  return (
    <Suspense fallback={
      <div className="container mx-auto px-4 py-8 max-w-lg">
        <Card className="text-center p-8">
          <Loader2 className="h-8 w-8 mx-auto mb-4 animate-spin text-primary" />
          <p className="text-muted-foreground">결제 정보를 불러오는 중...</p>
        </Card>
      </div>
    }>
      <CheckoutPageContent />
    </Suspense>
  );
}
