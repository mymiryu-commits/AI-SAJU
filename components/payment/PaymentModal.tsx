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
          // Initialize Toss Payments SDK
          // In production, use actual TossPayments SDK
          console.log('Toss payment data:', data.paymentData);
          // window.TossPayments(clientKey).requestPayment(...)

          // Simulate success for demo
          setTimeout(() => {
            setIsProcessing(false);
            onSuccess?.();
            onClose();
          }, 2000);
        } else {
          // Stripe Checkout
          console.log('Stripe payment data:', data.paymentData);
          // In production, redirect to Stripe Checkout

          // Simulate success for demo
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
      alert('결제 처리 중 오류가 발생했습니다.');
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
                <span className="text-primary underline">이용약관</span>에 동의합니다
              </Label>
            </div>
            <div className="flex items-start gap-2">
              <Checkbox
                id="privacy"
                checked={agreedToPrivacy}
                onCheckedChange={(checked) => setAgreedToPrivacy(checked as boolean)}
              />
              <Label htmlFor="privacy" className="text-sm leading-tight cursor-pointer">
                <span className="text-primary underline">개인정보처리방침</span>에 동의합니다
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
