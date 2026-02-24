'use client';

import { useState, useEffect } from 'react';
import { Link } from '@/i18n/routing';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import {
  Crown,
  CreditCard,
  Calendar,
  CheckCircle,
  XCircle,
  AlertTriangle,
  Loader2,
  AlertCircle,
  Sparkles,
  ArrowRight,
  Clock,
  Gift,
} from 'lucide-react';
import { useAuth } from '@/lib/hooks/useAuth';
import { useToast } from '@/hooks/use-toast';

interface Subscription {
  plan: string;
  status: 'active' | 'canceled' | 'expired' | 'none';
  expiresAt: string | null;
  startedAt: string | null;
  autoRenew: boolean;
  nextBillingDate: string | null;
  price: number;
}

const planDetails: Record<string, { name: string; features: string[]; color: string }> = {
  free: {
    name: '무료',
    features: ['기본 운세 분석', '일일 운세 1회', '제한된 기능'],
    color: 'bg-gray-100 text-gray-700 dark:bg-gray-800 dark:text-gray-300',
  },
  basic: {
    name: '베이직',
    features: ['무제한 기본 분석', '사주 카드 4장', 'PDF 리포트'],
    color: 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-300',
  },
  premium: {
    name: '프리미엄',
    features: ['무제한 프리미엄 분석', '사주 카드 6장', 'PDF + 음성 리포트', '우선 고객지원'],
    color: 'bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-300',
  },
  vip: {
    name: 'VIP',
    features: ['모든 프리미엄 기능', '1:1 상담 포함', '독점 콘텐츠', '전문가 리뷰'],
    color: 'bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-300',
  },
};

export default function SubscriptionPage() {
  const { user, isLoading: authLoading } = useAuth();
  const { toast } = useToast();

  const [subscription, setSubscription] = useState<Subscription | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [showCancelDialog, setShowCancelDialog] = useState(false);
  const [isCanceling, setIsCanceling] = useState(false);
  const [cancelSuccess, setCancelSuccess] = useState(false);

  useEffect(() => {
    if (!authLoading && user) {
      fetchSubscription();
    } else if (!authLoading && !user) {
      setIsLoading(false);
    }
  }, [user, authLoading]);

  const fetchSubscription = async () => {
    try {
      setIsLoading(true);
      setError(null);

      const response = await fetch('/api/my/dashboard');
      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || '구독 정보를 불러오는데 실패했습니다.');
      }

      // Dashboard API에서 구독 정보 가져옴
      if (data.subscription) {
        setSubscription({
          ...data.subscription,
          price: getPlanPrice(data.subscription.plan),
        });
      } else {
        setSubscription({
          plan: data.user?.membership || 'free',
          status: 'none',
          expiresAt: null,
          startedAt: null,
          autoRenew: false,
          nextBillingDate: null,
          price: 0,
        });
      }
    } catch (err) {
      console.error('Fetch subscription error:', err);
      setError(err instanceof Error ? err.message : '오류가 발생했습니다.');
    } finally {
      setIsLoading(false);
    }
  };

  const getPlanPrice = (plan: string): number => {
    const prices: Record<string, number> = {
      free: 0,
      basic: 9900,
      premium: 19900,
      vip: 49900,
    };
    return prices[plan] || 0;
  };

  const handleCancelSubscription = async () => {
    setIsCanceling(true);
    try {
      const response = await fetch('/api/subscription/cancel', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
      });

      if (response.ok) {
        setCancelSuccess(true);
        setSubscription(prev => prev ? { ...prev, status: 'canceled', autoRenew: false } : null);
      } else {
        toast({
          title: '구독 해지 실패',
          description: '고객센터로 문의해주세요.',
          variant: 'destructive',
        });
      }
    } catch {
      toast({
        title: '구독 해지 실패',
        description: '네트워크 오류가 발생했습니다.',
        variant: 'destructive',
      });
    } finally {
      setIsCanceling(false);
    }
  };

  // 로그인 필요 화면
  if (!authLoading && !user) {
    return (
      <div className="space-y-6">
        <Card className="p-8 text-center">
          <AlertCircle className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
          <h3 className="font-semibold mb-2">로그인이 필요합니다</h3>
          <p className="text-muted-foreground mb-4">
            구독 정보를 확인하려면 로그인해주세요
          </p>
          <Link href="/auth/login">
            <Button>로그인하기</Button>
          </Link>
        </Card>
      </div>
    );
  }

  // 로딩 상태
  if (isLoading) {
    return (
      <div className="space-y-6">
        <Card className="p-8 text-center">
          <Loader2 className="h-8 w-8 mx-auto mb-4 animate-spin text-primary" />
          <p className="text-muted-foreground">구독 정보를 불러오는 중...</p>
        </Card>
      </div>
    );
  }

  // 오류 상태
  if (error) {
    return (
      <div className="space-y-6">
        <Card className="p-8 text-center border-red-200 bg-red-50 dark:bg-red-950/20">
          <AlertCircle className="h-12 w-12 mx-auto mb-4 text-red-500" />
          <h3 className="font-semibold mb-2 text-red-700 dark:text-red-400">{error}</h3>
          <Button variant="outline" onClick={fetchSubscription}>
            다시 시도
          </Button>
        </Card>
      </div>
    );
  }

  const currentPlan = planDetails[subscription?.plan || 'free'] || planDetails.free;
  const hasActiveSubscription = subscription?.status === 'active';

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold mb-2">구독 관리</h1>
        <p className="text-muted-foreground">
          현재 구독 상태와 결제 정보를 확인하세요
        </p>
      </div>

      {/* Current Plan Card */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="flex items-center gap-2">
              <Crown className="h-5 w-5 text-amber-500" />
              현재 플랜
            </CardTitle>
            <Badge className={currentPlan.color}>
              {currentPlan.name}
            </Badge>
          </div>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {/* Plan Features */}
            <div className="p-4 bg-muted/50 rounded-lg">
              <h4 className="font-medium mb-2">포함된 기능</h4>
              <ul className="space-y-1">
                {currentPlan.features.map((feature, index) => (
                  <li key={index} className="flex items-center gap-2 text-sm text-muted-foreground">
                    <CheckCircle className="h-4 w-4 text-green-500" />
                    {feature}
                  </li>
                ))}
              </ul>
            </div>

            {/* Subscription Details */}
            {hasActiveSubscription && subscription && (
              <div className="space-y-3">
                <div className="flex justify-between items-center p-3 bg-muted/30 rounded-lg">
                  <div className="flex items-center gap-2 text-sm">
                    <Calendar className="h-4 w-4 text-muted-foreground" />
                    <span>구독 시작일</span>
                  </div>
                  <span className="text-sm font-medium">
                    {subscription.startedAt
                      ? new Date(subscription.startedAt).toLocaleDateString('ko-KR')
                      : '-'}
                  </span>
                </div>

                <div className="flex justify-between items-center p-3 bg-muted/30 rounded-lg">
                  <div className="flex items-center gap-2 text-sm">
                    <Clock className="h-4 w-4 text-muted-foreground" />
                    <span>다음 결제일</span>
                  </div>
                  <span className="text-sm font-medium">
                    {subscription.autoRenew && subscription.expiresAt
                      ? new Date(subscription.expiresAt).toLocaleDateString('ko-KR')
                      : '자동 갱신 안 함'}
                  </span>
                </div>

                <div className="flex justify-between items-center p-3 bg-muted/30 rounded-lg">
                  <div className="flex items-center gap-2 text-sm">
                    <CreditCard className="h-4 w-4 text-muted-foreground" />
                    <span>월 결제 금액</span>
                  </div>
                  <span className="text-sm font-medium">
                    {subscription.price > 0
                      ? `${subscription.price.toLocaleString()}원`
                      : '무료'}
                  </span>
                </div>

                {subscription.status === 'canceled' && (
                  <div className="p-3 bg-amber-50 dark:bg-amber-950/20 border border-amber-200 dark:border-amber-800/30 rounded-lg">
                    <div className="flex items-start gap-2">
                      <AlertTriangle className="h-5 w-5 text-amber-600 mt-0.5" />
                      <div>
                        <p className="text-sm font-medium text-amber-800 dark:text-amber-200">
                          구독이 해지되었습니다
                        </p>
                        <p className="text-sm text-amber-700 dark:text-amber-300">
                          {subscription.expiresAt
                            ? `${new Date(subscription.expiresAt).toLocaleDateString('ko-KR')}까지 서비스를 이용할 수 있습니다.`
                            : '서비스가 곧 종료됩니다.'}
                        </p>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* Action Buttons */}
            <div className="flex gap-2 pt-2">
              <Link href="/pricing" className="flex-1">
                <Button className="w-full" variant={hasActiveSubscription ? 'outline' : 'default'}>
                  <Sparkles className="mr-2 h-4 w-4" />
                  {hasActiveSubscription ? '플랜 변경' : '프리미엄 업그레이드'}
                </Button>
              </Link>
              {hasActiveSubscription && subscription?.status !== 'canceled' && (
                <Button
                  variant="destructive"
                  onClick={() => setShowCancelDialog(true)}
                >
                  <XCircle className="mr-2 h-4 w-4" />
                  해지
                </Button>
              )}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Upgrade Banner for Free Users */}
      {(!subscription || subscription.plan === 'free') && (
        <Card className="border-primary bg-gradient-to-r from-purple-50 to-pink-50 dark:from-purple-950/20 dark:to-pink-950/20">
          <CardContent className="p-6">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
              <div className="flex items-center gap-4">
                <div className="p-3 rounded-lg bg-purple-500 text-white">
                  <Gift className="h-6 w-6" />
                </div>
                <div>
                  <Badge className="mb-1 bg-primary">한정 혜택</Badge>
                  <h3 className="font-bold text-lg">프리미엄 30% 할인 중</h3>
                  <p className="text-muted-foreground">
                    무제한 분석, 음성 리포트, 우선 지원까지 모두 누리세요
                  </p>
                </div>
              </div>
              <Link href="/pricing">
                <Button size="lg">
                  지금 업그레이드
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </Link>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Help Section */}
      <Card>
        <CardHeader>
          <CardTitle>문의 및 도움말</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3 text-sm text-muted-foreground">
            <p>
              구독 관련 문의: <a href="tel:1588-5617" className="text-primary font-medium">1588-5617</a> (평일 09:00~18:00)
            </p>
            <p>
              이메일: <a href="mailto:mymiryu@gmail.com" className="text-primary font-medium">mymiryu@gmail.com</a>
            </p>
            <div className="flex gap-2 pt-2">
              <Link href="/legal/refund">
                <Button variant="link" size="sm" className="px-0">
                  환불정책 보기
                </Button>
              </Link>
              <Link href="/legal/terms">
                <Button variant="link" size="sm" className="px-0">
                  이용약관 보기
                </Button>
              </Link>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Cancel Subscription Dialog */}
      <Dialog open={showCancelDialog} onOpenChange={setShowCancelDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <AlertTriangle className="h-5 w-5 text-yellow-500" />
              구독을 해지하시겠습니까?
            </DialogTitle>
            <DialogDescription>
              구독을 해지하시면 다음과 같은 변경사항이 적용됩니다.
            </DialogDescription>
          </DialogHeader>

          {cancelSuccess ? (
            <div className="py-6 text-center">
              <CheckCircle className="h-16 w-16 text-green-500 mx-auto mb-4" />
              <h3 className="text-lg font-semibold mb-2">해지가 완료되었습니다</h3>
              <p className="text-muted-foreground">
                {subscription?.expiresAt
                  ? `${new Date(subscription.expiresAt).toLocaleDateString('ko-KR')}까지 서비스를 이용하실 수 있습니다.`
                  : '서비스가 곧 종료됩니다.'}
              </p>
            </div>
          ) : (
            <>
              <div className="space-y-3 py-4">
                <div className="flex items-start gap-3 p-3 bg-yellow-50 dark:bg-yellow-950/20 rounded-lg">
                  <AlertTriangle className="h-5 w-5 text-yellow-600 mt-0.5" />
                  <div className="text-sm">
                    <p className="font-medium text-yellow-800 dark:text-yellow-200">
                      결제 기간 동안 이용 가능
                    </p>
                    <p className="text-yellow-700 dark:text-yellow-300">
                      해지 후에도 만료일까지 서비스를 계속 이용할 수 있습니다.
                    </p>
                  </div>
                </div>
                <div className="flex items-start gap-3 p-3 bg-muted rounded-lg">
                  <XCircle className="h-5 w-5 text-muted-foreground mt-0.5" />
                  <div className="text-sm">
                    <p className="font-medium">자동 갱신이 중단됩니다</p>
                    <p className="text-muted-foreground">
                      다음 결제일에 자동으로 결제되지 않습니다.
                    </p>
                  </div>
                </div>
              </div>
            </>
          )}

          <DialogFooter>
            {cancelSuccess ? (
              <Button onClick={() => setShowCancelDialog(false)}>
                확인
              </Button>
            ) : (
              <>
                <Button variant="outline" onClick={() => setShowCancelDialog(false)}>
                  취소
                </Button>
                <Button
                  variant="destructive"
                  onClick={handleCancelSubscription}
                  disabled={isCanceling}
                >
                  {isCanceling ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      처리 중...
                    </>
                  ) : (
                    '구독 해지'
                  )}
                </Button>
              </>
            )}
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
