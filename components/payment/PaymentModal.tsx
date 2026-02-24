'use client';

import { useState, useEffect } from 'react';
import { useLocale } from 'next-intl';
import { loadTossPayments, TossPaymentsWidgets } from '@tosspayments/tosspayments-sdk';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
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

const TOSS_CLIENT_KEY = process.env.NEXT_PUBLIC_TOSS_CLIENT_KEY || '';

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
  const [tossWidgets, setTossWidgets] = useState<TossPaymentsWidgets | null>(null);

  const price = getPrice(product, currency);
  const originalPrice = getOriginalPrice(product, currency);
  const hasDiscount = price < originalPrice;

  const availableMethods = paymentMethods.filter((m) =>
    m.available.includes(locale)
  );

  // Initialize Toss Payments SDK
  useEffect(() => {
    if (!isOpen || !TOSS_CLIENT_KEY || locale !== 'ko') return;

    let cancelled = false;

    async function initToss() {
      try {
        const tossPayments = await loadTossPayments(TOSS_CLIENT_KEY);
        if (!cancelled) {
          const widgets = tossPayments.widgets({ customerKey: 'ANONYMOUS' });
          setTossWidgets(widgets);
        }
      } catch (error) {
        console.error('Failed to load Toss Payments SDK:', error);
      }
    }

    initToss();

    return () => {
      cancelled = true;
    };
  }, [isOpen, locale]);

  const handlePayment = async () => {
    if (!agreedToTerms || !agreedToPrivacy) return;

    setIsProcessing(true);

    try {
      // Step 1: Create payment record
      const response = await fetch('/api/payment/create', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          productType,
          productId: product.id.replace(`${productType === 'subscription' ? 'sub' : productType === 'analysis' ? 'analysis' : 'coin'}_`, ''),
          locale,
          paymentMethod: selectedMethod,
        }),
      });

      const data = await response.json();

      if (!data.success) {
        throw new Error(data.error || 'Failed to create payment');
      }

      // Step 2: Initiate payment with appropriate provider
      if (data.provider === 'toss' && tossWidgets) {
        // Use Toss Payments Widget SDK
        await tossWidgets.setAmount({
          currency: 'KRW',
          value: data.paymentData.amount,
        });

        await tossWidgets.requestPayment({
          orderId: data.paymentData.orderId,
          orderName: data.paymentData.orderName,
          customerName: data.paymentData.customerName,
          customerEmail: data.paymentData.customerEmail,
          successUrl: data.paymentData.successUrl,
          failUrl: data.paymentData.failUrl,
        });
      } else if (data.provider === 'toss') {
        // Fallback: Direct Toss Payments API (without widget)
        const tossPayments = await loadTossPayments(TOSS_CLIENT_KEY);
        const payment = tossPayments.payment({ customerKey: 'ANONYMOUS' });

        // Use CARD method — Toss CARD payment window supports all payment methods
        // including card, KakaoPay, NaverPay, TossPay via unified checkout
        await payment.requestPayment({
          method: 'CARD',
          amount: { currency: 'KRW', value: data.paymentData.amount },
          orderId: data.paymentData.orderId,
          orderName: data.paymentData.orderName,
          customerName: data.paymentData.customerName,
          customerEmail: data.paymentData.customerEmail,
          successUrl: data.paymentData.successUrl,
          failUrl: data.paymentData.failUrl,
        });
      } else {
        // Stripe for international payments
        console.log('Stripe payment:', data.paymentData);
        // For now, show that Stripe integration is pending
        alert('International payment (Stripe) coming soon. Please use Korean payment methods.');
        setIsProcessing(false);
        return;
      }

      // Payment widget handles the redirect, so this code
      // only runs if there's no redirect (shouldn't happen normally)
      onSuccess?.();
      onClose();
    } catch (error) {
      console.error('Payment error:', error);
      setIsProcessing(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>
            {locale === 'ko' ? '결제하기' : locale === 'ja' ? 'お支払い' : 'Payment'}
          </DialogTitle>
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
            <h4 className="font-medium mb-3">
              {locale === 'ko' ? '결제 수단' : locale === 'ja' ? '決済方法' : 'Payment Method'}
            </h4>
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
                <span className="text-primary underline">
                  {locale === 'ko' ? '이용약관' : locale === 'ja' ? '利用規約' : 'Terms of Service'}
                </span>
                {locale === 'ko' ? '에 동의합니다' : locale === 'ja' ? 'に同意します' : ' agreed'}
              </Label>
            </div>
            <div className="flex items-start gap-2">
              <Checkbox
                id="privacy"
                checked={agreedToPrivacy}
                onCheckedChange={(checked) => setAgreedToPrivacy(checked as boolean)}
              />
              <Label htmlFor="privacy" className="text-sm leading-tight cursor-pointer">
                <span className="text-primary underline">
                  {locale === 'ko' ? '개인정보처리방침' : locale === 'ja' ? 'プライバシーポリシー' : 'Privacy Policy'}
                </span>
                {locale === 'ko' ? '에 동의합니다' : locale === 'ja' ? 'に同意します' : ' agreed'}
              </Label>
            </div>
          </div>

          {/* Security Notice */}
          <div className="flex items-center gap-2 text-xs text-muted-foreground">
            <Shield className="h-4 w-4" />
            <span>
              {locale === 'ko'
                ? '결제 정보는 토스페이먼츠를 통해 안전하게 처리됩니다'
                : locale === 'ja'
                ? '決済情報は安全に暗号化されて処理されます'
                : 'Payment is securely processed by Toss Payments'}
            </span>
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
                {locale === 'ko' ? '결제 처리 중...' : locale === 'ja' ? '決済処理中...' : 'Processing...'}
              </>
            ) : (
              <>
                <Lock className="mr-2 h-4 w-4" />
                {formatPrice(price, currency)}{' '}
                {locale === 'ko' ? '결제하기' : locale === 'ja' ? 'お支払い' : 'Pay Now'}
              </>
            )}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
