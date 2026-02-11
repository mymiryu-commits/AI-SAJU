'use client';

import { useEffect, useRef, useState, Suspense } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import Script from 'next/script';
import Image from 'next/image';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { Loader2, CreditCard, AlertCircle, ArrowLeft, Sparkles, QrCode, Shield, CheckCircle2 } from 'lucide-react';
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

// 서비스 타입별 기본 정보
const serviceTypeConfig: Record<string, {
  icon: typeof Sparkles;
  label: string;
  image: string;
  color: string;
  description: string;
}> = {
  saju: {
    icon: Sparkles,
    label: '사주 완전분석 이용권',
    image: '/images/products/saju-voucher.png',
    color: 'text-purple-500 bg-purple-100 dark:bg-purple-900/30',
    description: '정통 사주팔자와 AI 기술이 만난 프리미엄 사주 분석 서비스입니다. 오행 분석, 2026년 운세, 월별 상세 운세를 제공합니다.',
  },
  qrcode: {
    icon: QrCode,
    label: 'QR코드 생성 이용권',
    image: '/images/products/qrcode-voucher.png',
    color: 'text-blue-500 bg-blue-100 dark:bg-blue-900/30',
    description: '고품질 QR코드를 무제한으로 생성할 수 있는 이용권입니다. URL, 명함, WiFi, 이메일 등 8가지 QR 타입을 지원합니다.',
  },
};

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
  const serviceType = searchParams.get('serviceType') || 'saju';
  const quantity = searchParams.get('quantity');
  const regularPrice = searchParams.get('regularPrice');
  const description = searchParams.get('description');

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

  // 서비스 타입 설정
  const config = serviceTypeConfig[serviceType] || serviceTypeConfig.saju;
  const Icon = config.icon;
  const productDescription = description ? decodeURIComponent(description) : config.description;
  const hasDiscount = regularPrice && parseInt(regularPrice) > parseInt(amount || '0');

  return (
    <>
      <Script
        src="https://js.tosspayments.com/v1/payment"
        onLoad={handleScriptLoad}
        strategy="afterInteractive"
      />

      <div className="container mx-auto px-4 py-8 max-w-2xl">
        <Card>
          <CardHeader className="pb-4">
            <CardTitle className="flex items-center gap-2">
              <CreditCard className="h-5 w-5" />
              결제하기
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* 상품 정보 - 토스페이먼츠 심사 필수: 상품명, 이미지, 상세설명, 금액 */}
            <div className="border rounded-lg p-4 space-y-4">
              <div className="flex gap-4">
                {/* 상품 이미지 */}
                <div className="relative w-24 h-24 rounded-lg overflow-hidden bg-muted flex-shrink-0">
                  <div className={`absolute inset-0 flex items-center justify-center ${config.color}`}>
                    <Icon className="h-12 w-12" />
                  </div>
                </div>

                {/* 상품 정보 */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-start justify-between gap-2">
                    <div>
                      <h3 className="font-semibold text-lg">
                        {decodeURIComponent(orderName || '')}
                      </h3>
                      {quantity && (
                        <Badge variant="secondary" className="mt-1">
                          {quantity}회 이용권
                        </Badge>
                      )}
                    </div>
                    {hasDiscount && (
                      <Badge className="bg-red-500 text-white">
                        할인
                      </Badge>
                    )}
                  </div>

                  {/* 상세설명 */}
                  <p className="text-sm text-muted-foreground mt-2 line-clamp-2">
                    {productDescription}
                  </p>
                </div>
              </div>

              {/* 서비스 특징 */}
              <div className="grid grid-cols-2 gap-2 pt-2 border-t">
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <CheckCircle2 className="h-4 w-4 text-green-500" />
                  <span>구매 후 즉시 사용</span>
                </div>
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <CheckCircle2 className="h-4 w-4 text-green-500" />
                  <span>1년간 유효</span>
                </div>
              </div>
            </div>

            <Separator />

            {/* 주문 정보 상세 */}
            <div className="space-y-3">
              <h4 className="font-medium">주문 정보</h4>

              <div className="flex justify-between items-center py-2">
                <span className="text-muted-foreground">주문번호</span>
                <span className="text-sm font-mono">{orderId}</span>
              </div>

              {hasDiscount && (
                <>
                  <div className="flex justify-between items-center py-2">
                    <span className="text-muted-foreground">정가</span>
                    <span className="text-muted-foreground line-through">
                      {formatPrice(regularPrice)}원
                    </span>
                  </div>
                  <div className="flex justify-between items-center py-2">
                    <span className="text-muted-foreground">할인</span>
                    <span className="text-red-500">
                      -{formatPrice(String(parseInt(regularPrice!) - parseInt(amount!)))}원
                    </span>
                  </div>
                </>
              )}

              <div className="flex justify-between items-center py-3 border-t">
                <span className="font-medium">최종 결제금액</span>
                <span className="text-2xl font-bold text-primary">
                  {formatPrice(amount)}원
                </span>
              </div>
            </div>

            <Separator />

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

            {/* 보안 및 안내 문구 */}
            <div className="bg-muted/50 rounded-lg p-4 space-y-3">
              <div className="flex items-center gap-2 text-sm">
                <Shield className="h-4 w-4 text-green-600" />
                <span className="font-medium">안전한 결제</span>
              </div>
              <div className="text-xs text-muted-foreground space-y-1">
                <p>• 결제는 토스페이먼츠를 통해 안전하게 처리됩니다.</p>
                <p>• 결제 완료 후 이용권이 즉시 충전됩니다.</p>
                <p>• 환불 정책은 <Link href="/legal/refund" className="underline hover:text-primary">환불 정책</Link>을 참고해주세요.</p>
              </div>
            </div>

            {/* 판매자 정보 - 토스페이먼츠 심사 필수 */}
            <div className="text-xs text-muted-foreground border-t pt-4 space-y-1">
              <p><strong>판매자:</strong> 플랜엑스솔루션 주식회사</p>
              <p><strong>사업자등록번호:</strong> 786-87-03494</p>
              <p><strong>대표:</strong> 김형석</p>
              <p><strong>주소:</strong> 강원특별자치도 춘천시 춘천순환로 108, 501호</p>
              <p><strong>고객센터:</strong> 1588-5617 | mymiryu@gmail.com</p>
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
