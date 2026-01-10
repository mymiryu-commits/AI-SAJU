'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import {
  AlertTriangle,
  Gift,
  Pause,
  Clock,
  Heart,
  ArrowLeft,
  CheckCircle,
  Sparkles,
  Calendar,
  Coins,
  Crown,
  X,
} from 'lucide-react';

interface CancelFlowProps {
  isOpen: boolean;
  onClose: () => void;
  subscription: {
    tier: 'basic' | 'pro' | 'premium';
    tierName: string;
    expiresAt: string;
    streakDays: number;
    totalCoins: number;
    savedAnalyses: number;
  };
}

type CancelReason =
  | 'too_expensive'
  | 'not_using'
  | 'missing_features'
  | 'found_alternative'
  | 'temporary'
  | 'other';

const CANCEL_REASONS: { id: CancelReason; label: string }[] = [
  { id: 'too_expensive', label: '가격이 부담됩니다' },
  { id: 'not_using', label: '자주 사용하지 않아요' },
  { id: 'missing_features', label: '원하는 기능이 없어요' },
  { id: 'found_alternative', label: '다른 서비스를 찾았어요' },
  { id: 'temporary', label: '일시적으로 쉬고 싶어요' },
  { id: 'other', label: '기타' },
];

const RETENTION_OFFERS: Record<CancelReason, {
  title: string;
  description: string;
  icon: typeof Gift;
  action: string;
  discount?: number;
  pauseDays?: number;
  bonusCoins?: number;
}> = {
  too_expensive: {
    title: '50% 할인 혜택',
    description: '다음 3개월간 50% 할인된 가격으로 이용하세요',
    icon: Gift,
    action: '할인 적용하기',
    discount: 50,
  },
  not_using: {
    title: '잠시 쉬어가세요',
    description: '최대 30일간 구독을 일시정지할 수 있어요',
    icon: Pause,
    action: '일시정지하기',
    pauseDays: 30,
  },
  missing_features: {
    title: '보너스 코인 지급',
    description: '원하는 기능 피드백 남기시면 200코인을 드려요',
    icon: Coins,
    action: '피드백 남기고 코인받기',
    bonusCoins: 200,
  },
  found_alternative: {
    title: '프리미엄 무료 체험',
    description: '7일간 프리미엄 기능을 무료로 체험해보세요',
    icon: Crown,
    action: '프리미엄 체험하기',
  },
  temporary: {
    title: '최대 60일 일시정지',
    description: '구독을 일시정지하고 나중에 다시 시작하세요',
    icon: Clock,
    action: '일시정지하기',
    pauseDays: 60,
  },
  other: {
    title: '특별 혜택 드릴게요',
    description: '30% 할인과 100코인 보너스를 드려요',
    icon: Sparkles,
    action: '혜택 받기',
    discount: 30,
    bonusCoins: 100,
  },
};

export function CancelFlow({ isOpen, onClose, subscription }: CancelFlowProps) {
  const router = useRouter();
  const [step, setStep] = useState<'reason' | 'offer' | 'confirm' | 'feedback'>('reason');
  const [selectedReason, setSelectedReason] = useState<CancelReason | null>(null);
  const [feedback, setFeedback] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);

  const handleReasonSelect = (reason: CancelReason) => {
    setSelectedReason(reason);
    setStep('offer');
  };

  const handleAcceptOffer = async () => {
    if (!selectedReason) return;

    setIsProcessing(true);
    const offer = RETENTION_OFFERS[selectedReason];

    try {
      const response = await fetch('/api/retention/accept-offer', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          reason: selectedReason,
          offer: {
            discount: offer.discount,
            pauseDays: offer.pauseDays,
            bonusCoins: offer.bonusCoins,
          },
        }),
      });

      if (response.ok) {
        onClose();
        // Show success message
      }
    } catch (error) {
      console.error('Error accepting offer:', error);
    } finally {
      setIsProcessing(false);
    }
  };

  const handleProceedToCancel = () => {
    setStep('confirm');
  };

  const handleConfirmCancel = async () => {
    setIsProcessing(true);

    try {
      const response = await fetch('/api/subscription/cancel', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          reason: selectedReason,
          feedback,
        }),
      });

      if (response.ok) {
        setStep('feedback');
      }
    } catch (error) {
      console.error('Error canceling subscription:', error);
    } finally {
      setIsProcessing(false);
    }
  };

  const offer = selectedReason ? RETENTION_OFFERS[selectedReason] : null;
  const expiresDate = new Date(subscription.expiresAt);

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-lg">
        {step === 'reason' && (
          <>
            <DialogHeader>
              <DialogTitle className="flex items-center gap-2">
                <AlertTriangle className="h-5 w-5 text-yellow-500" />
                구독 해지
              </DialogTitle>
              <DialogDescription>
                떠나시기 전에 이유를 알려주시면 서비스 개선에 큰 도움이 됩니다
              </DialogDescription>
            </DialogHeader>

            <div className="space-y-4 py-4">
              {/* What you'll lose */}
              <Card className="bg-red-50 dark:bg-red-950/20 border-red-200">
                <CardContent className="pt-4">
                  <h4 className="font-semibold text-red-700 dark:text-red-400 mb-3">
                    해지 시 잃게 되는 혜택
                  </h4>
                  <div className="space-y-2 text-sm">
                    <div className="flex items-center gap-2">
                      <Calendar className="h-4 w-4 text-red-500" />
                      <span>{subscription.streakDays}일 연속 출석 기록</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Coins className="h-4 w-4 text-red-500" />
                      <span>{subscription.totalCoins} 코인 잔액</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Heart className="h-4 w-4 text-red-500" />
                      <span>{subscription.savedAnalyses}개 저장된 분석</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Crown className="h-4 w-4 text-red-500" />
                      <span>{subscription.tierName} 회원 전용 혜택</span>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Reason selection */}
              <div className="space-y-3">
                <h4 className="font-medium">해지 이유를 선택해주세요</h4>
                <RadioGroup onValueChange={(v) => handleReasonSelect(v as CancelReason)}>
                  {CANCEL_REASONS.map((reason) => (
                    <div
                      key={reason.id}
                      className="flex items-center space-x-3 p-3 rounded-lg border hover:bg-muted/50 cursor-pointer"
                    >
                      <RadioGroupItem value={reason.id} id={reason.id} />
                      <Label htmlFor={reason.id} className="flex-1 cursor-pointer">
                        {reason.label}
                      </Label>
                    </div>
                  ))}
                </RadioGroup>
              </div>
            </div>

            <div className="flex justify-between">
              <Button variant="ghost" onClick={onClose}>
                <ArrowLeft className="mr-2 h-4 w-4" />
                돌아가기
              </Button>
            </div>
          </>
        )}

        {step === 'offer' && offer && (
          <>
            <DialogHeader>
              <DialogTitle className="flex items-center gap-2">
                <Sparkles className="h-5 w-5 text-primary" />
                특별 혜택을 드릴게요!
              </DialogTitle>
              <DialogDescription>
                떠나시기 전에 이 혜택은 어떠세요?
              </DialogDescription>
            </DialogHeader>

            <div className="py-6">
              <Card className="bg-gradient-to-br from-primary/10 to-purple-500/10 border-primary/20">
                <CardContent className="pt-6 text-center">
                  <div className="inline-flex p-4 rounded-full bg-primary/20 mb-4">
                    <offer.icon className="h-8 w-8 text-primary" />
                  </div>
                  <h3 className="text-xl font-bold mb-2">{offer.title}</h3>
                  <p className="text-muted-foreground mb-4">{offer.description}</p>

                  {offer.discount && (
                    <Badge variant="default" className="text-lg px-4 py-1">
                      {offer.discount}% 할인
                    </Badge>
                  )}
                  {offer.pauseDays && (
                    <Badge variant="default" className="text-lg px-4 py-1">
                      {offer.pauseDays}일 일시정지
                    </Badge>
                  )}
                  {offer.bonusCoins && (
                    <Badge variant="secondary" className="text-lg px-4 py-1 ml-2">
                      +{offer.bonusCoins} 코인
                    </Badge>
                  )}
                </CardContent>
              </Card>
            </div>

            <div className="flex flex-col gap-2">
              <Button onClick={handleAcceptOffer} disabled={isProcessing} size="lg">
                <CheckCircle className="mr-2 h-4 w-4" />
                {offer.action}
              </Button>
              <Button
                variant="ghost"
                onClick={handleProceedToCancel}
                className="text-muted-foreground"
              >
                아니요, 해지할게요
              </Button>
            </div>
          </>
        )}

        {step === 'confirm' && (
          <>
            <DialogHeader>
              <DialogTitle className="flex items-center gap-2 text-red-600">
                <AlertTriangle className="h-5 w-5" />
                정말 해지하시겠어요?
              </DialogTitle>
              <DialogDescription>
                {expiresDate.toLocaleDateString('ko-KR')}까지 이용 가능합니다
              </DialogDescription>
            </DialogHeader>

            <div className="py-4 space-y-4">
              <div className="space-y-2">
                <Label htmlFor="feedback">추가 의견 (선택사항)</Label>
                <Textarea
                  id="feedback"
                  placeholder="서비스 개선을 위한 의견을 남겨주세요..."
                  value={feedback}
                  onChange={(e) => setFeedback(e.target.value)}
                  rows={4}
                />
              </div>

              <div className="p-4 bg-muted rounded-lg text-sm text-muted-foreground">
                <p>• 구독 종료 후에도 무료 기능은 계속 이용 가능합니다</p>
                <p>• 코인은 30일 후 소멸됩니다</p>
                <p>• 언제든 다시 구독하실 수 있습니다</p>
              </div>
            </div>

            <div className="flex gap-2">
              <Button variant="outline" onClick={() => setStep('offer')} className="flex-1">
                <ArrowLeft className="mr-2 h-4 w-4" />
                이전
              </Button>
              <Button
                variant="destructive"
                onClick={handleConfirmCancel}
                disabled={isProcessing}
                className="flex-1"
              >
                {isProcessing ? '처리 중...' : '해지 확인'}
              </Button>
            </div>
          </>
        )}

        {step === 'feedback' && (
          <>
            <DialogHeader>
              <DialogTitle className="flex items-center gap-2">
                <Heart className="h-5 w-5 text-pink-500" />
                함께해 주셔서 감사합니다
              </DialogTitle>
            </DialogHeader>

            <div className="py-6 text-center">
              <p className="text-muted-foreground mb-4">
                구독이 해지되었습니다.<br />
                {expiresDate.toLocaleDateString('ko-KR')}까지 현재 혜택을 이용하실 수 있습니다.
              </p>
              <p className="text-sm text-muted-foreground">
                언제든 돌아오시면 환영합니다 💜
              </p>
            </div>

            <Button onClick={onClose} className="w-full">
              확인
            </Button>
          </>
        )}
      </DialogContent>
    </Dialog>
  );
}
