'use client';

import { useState } from 'react';
import { useLocale } from 'next-intl';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Label } from '@/components/ui/label';
import { Checkbox } from '@/components/ui/checkbox';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import {
  CreditCard,
  Smartphone,
  Building,
  Loader2,
  CheckCircle,
  Shield,
  Lock,
} from 'lucide-react';
import {
  ProductConfig,
  getCurrencyFromLocale,
  formatPrice,
  getPrice,
  getOriginalPrice,
} from '@/lib/payment/pricing';

interface PaymentModalProps {
  isOpen: boolean;
  onClose: () => void;
  product: ProductConfig;
  productType: 'subscription' | 'analysis' | 'coin';
  onSuccess?: () => void;
}

type PaymentMethod = 'card' | 'kakaopay' | 'naverpay' | 'tosspay' | 'bank';

const paymentMethods: { id: PaymentMethod; name: string; icon: typeof CreditCard; available: string[] }[] = [
  { id: 'card', name: '신용/체크카드', icon: CreditCard, available: ['ko', 'ja', 'en'] },
  { id: 'kakaopay', name: '카카오페이', icon: Smartphone, available: ['ko'] },
  { id: 'naverpay', name: '네이버페이', icon: Smartphone, available: ['ko'] },
  { id: 'tosspay', name: '토스페이', icon: Smartphone, available: ['ko'] },
  { id: 'bank', name: '계좌이체', icon: Building, available: ['ko'] },
];

export function PaymentModal({
  isOpen,
  onClose,
  product,
  productType,
  onSuccess,
}: PaymentModalProps) {
  const locale = useLocale();
  const currency = getCurrencyFromLocale(locale);
  const [selectedMethod, setSelectedMethod] = useState<PaymentMethod>('card');
  const [agreedToTerms, setAgreedToTerms] = useState(false);
  const [agreedToPrivacy, setAgreedToPrivacy] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);

  const price = getPrice(product, currency);
  const originalPrice = getOriginalPrice(product, currency);
  const hasDiscount = price < originalPrice;

  const availableMethods = paymentMethods.filter((m) =>
    m.available.includes(locale)
  );

  // Load Toss Payments SDK dynamically
  const loadTossPayments = (clientKey: string) => {
    return new Promise<{ requestPayment: (method: string, params: Record<string, unknown>) => Promise<void> }>((resolve, reject) => {
      // Check if already loaded
      if ((window as unknown as { TossPayments?: (key: string) => unknown }).TossPayments) {
        const TossPayments = (window as unknown as { TossPayments: (key: string) => { requestPayment: (method: string, params: Record<string, unknown>) => Promise<void> } }).TossPayments;
        resolve(TossPayments(clientKey));
        return;
      }

      const script = document.createElement('script');
      script.src = 'https://js.tosspayments.com/v1/payment';
      script.onload = () => {
        const TossPayments = (window as unknown as { TossPayments: (key: string) => { requestPayment: (method: string, params: Record<string, unknown>) => Promise<void> } }).TossPayments;
        resolve(TossPayments(clientKey));
      };
      script.onerror = () => reject(new Error('Failed to load Toss Payments SDK'));
      document.head.appendChild(script);
    });
  };

  const handlePayment = async () => {
    if (!agreedToTerms || !agreedToPrivacy) {
      alert('약관에 동의해주세요.');
      return;
    }

    setIsProcessing(true);

    try {
      const response = await fetch('/api/payment/create', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          productType,
          productId: product.id.replace(`${productType}_`, ''),
          locale,
          paymentMethod: selectedMethod,
        }),
      });

      const data = await response.json();

      if (data.success) {
        if (data.provider === 'toss') {
          // Get client key from environment
          const clientKey = process.env.NEXT_PUBLIC_TOSS_CLIENT_KEY;

          if (!clientKey) {
            // Demo mode - simulate success
            console.log('Toss payment (demo mode):', data.paymentData);
            setTimeout(() => {
              setIsProcessing(false);
              onSuccess?.();
              onClose();
            }, 2000);
            return;
          }

          // Load and use Toss Payments SDK
          const tossPayments = await loadTossPayments(clientKey);

          const paymentMethodMap: Record<string, string> = {
            card: '카드',
            kakaopay: '카카오페이',
            naverpay: '네이버페이',
            tosspay: '토스페이',
            bank: '계좌이체',
          };

          await tossPayments.requestPayment(paymentMethodMap[selectedMethod] || '카드', {
            amount: data.paymentData.amount,
            orderId: data.paymentData.orderId,
            orderName: data.paymentData.orderName,
            customerEmail: data.paymentData.customerEmail,
            customerName: data.paymentData.customerName,
            successUrl: data.paymentData.successUrl,
            failUrl: data.paymentData.failUrl,
          });
        } else {
          // Stripe Checkout - redirect to Stripe
          console.log('Stripe payment:', data.paymentData);

          // Demo mode - simulate success
          setTimeout(() => {
            setIsProcessing(false);
            onSuccess?.();
            onClose();
          }, 2000);
        }
      } else {
        throw new Error(data.error);
      }
    } catch (error) {
      console.error('Payment error:', error);
      const errorMessage = error instanceof Error && error.message !== 'USER_CANCEL'
        ? error.message
        : '결제 처리 중 오류가 발생했습니다.';

      if (error instanceof Error && error.message !== 'USER_CANCEL') {
        alert(errorMessage);
      }
      setIsProcessing(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>결제하기</DialogTitle>
          <DialogDescription>
            {product.name[locale as 'ko' | 'ja' | 'en'] || product.name.en}
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6">
          {/* Product Summary */}
          <Card className="bg-muted/50">
            <CardContent className="pt-4">
              <div className="flex justify-between items-center">
                <div>
                  <h4 className="font-semibold">
                    {product.name[locale as 'ko' | 'ja' | 'en'] || product.name.en}
                  </h4>
                  <p className="text-sm text-muted-foreground">
                    {product.description[locale as 'ko' | 'ja' | 'en'] || product.description.en}
                  </p>
                </div>
                <div className="text-right">
                  {hasDiscount && (
                    <div className="text-sm text-muted-foreground line-through">
                      {formatPrice(originalPrice, currency)}
                    </div>
                  )}
                  <div className="text-xl font-bold text-primary">
                    {formatPrice(price, currency)}
                  </div>
                  {hasDiscount && product.discountPercent && (
                    <Badge className="bg-red-500">{product.discountPercent}% OFF</Badge>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Payment Methods */}
          <div>
            <h4 className="font-medium mb-3">결제 수단</h4>
            <RadioGroup
              value={selectedMethod}
              onValueChange={(value) => setSelectedMethod(value as PaymentMethod)}
            >
              <div className="grid grid-cols-2 gap-2">
                {availableMethods.map((method) => {
                  const Icon = method.icon;
                  return (
                    <div key={method.id}>
                      <RadioGroupItem
                        value={method.id}
                        id={method.id}
                        className="peer sr-only"
                      />
                      <Label
                        htmlFor={method.id}
                        className="flex items-center gap-2 p-3 rounded-lg border cursor-pointer peer-data-[state=checked]:border-primary peer-data-[state=checked]:bg-primary/5 hover:bg-muted/50 transition-colors"
                      >
                        <Icon className="h-4 w-4" />
                        <span className="text-sm">{method.name}</span>
                      </Label>
                    </div>
                  );
                })}
              </div>
            </RadioGroup>
          </div>

          {/* Terms */}
          <div className="space-y-3">
            <div className="flex items-start gap-2">
              <Checkbox
                id="terms"
                checked={agreedToTerms}
                onCheckedChange={(checked) => setAgreedToTerms(checked as boolean)}
              />
              <Label htmlFor="terms" className="text-sm leading-tight cursor-pointer">
                <a href="/legal/terms" target="_blank" className="text-primary underline hover:text-primary/80">이용약관</a> 및{' '}
                <a href="/legal/refund" target="_blank" className="text-primary underline hover:text-primary/80">환불정책</a>에 동의합니다
              </Label>
            </div>
            <div className="flex items-start gap-2">
              <Checkbox
                id="privacy"
                checked={agreedToPrivacy}
                onCheckedChange={(checked) => setAgreedToPrivacy(checked as boolean)}
              />
              <Label htmlFor="privacy" className="text-sm leading-tight cursor-pointer">
                <a href="/legal/privacy" target="_blank" className="text-primary underline hover:text-primary/80">개인정보처리방침</a>에 동의합니다
              </Label>
            </div>
          </div>

          {/* Security Notice */}
          <div className="flex items-center gap-2 text-xs text-muted-foreground">
            <Shield className="h-4 w-4" />
            <span>결제 정보는 안전하게 암호화되어 처리됩니다</span>
          </div>

          {/* Payment Button */}
          <Button
            onClick={handlePayment}
            disabled={isProcessing || !agreedToTerms || !agreedToPrivacy}
            className="w-full"
            size="lg"
          >
            {isProcessing ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                결제 처리 중...
              </>
            ) : (
              <>
                <Lock className="mr-2 h-4 w-4" />
                {formatPrice(price, currency)} 결제하기
              </>
            )}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
