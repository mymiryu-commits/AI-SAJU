'use client';

import { useState, useEffect } from 'react';
import { useTranslations } from 'next-intl';
import { Link } from '@/i18n/routing';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
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
  Coins,
  BarChart3,
  Calendar,
  ArrowRight,
  Sparkles,
  Star,
  Gift,
  Users,
  Clock,
  AlertTriangle,
  XCircle,
  CheckCircle,
  Loader2,
} from 'lucide-react';
import { useAuth } from '@/lib/hooks/useAuth';

// Mock user data
const mockUser = {
  name: 'John Doe',
  email: 'john@example.com',
  membership: 'free',
  coins: 150,
  totalAnalyses: 12,
  streak: 5,
  joinDate: '2024-01-15',
  recentAnalyses: [
    { id: '1', type: 'saju', date: '2025-01-09', score: 85 },
    { id: '2', type: 'face', date: '2025-01-08', score: 82 },
    { id: '3', type: 'daily', date: '2025-01-07', score: 78 },
  ],
  referralCode: 'JOHN2025',
  referralCount: 3,
};

export default function DashboardPage() {
  const t = useTranslations('mypage.dashboard');
  const { user } = useAuth();
  const [showCancelDialog, setShowCancelDialog] = useState(false);
  const [isCanceling, setIsCanceling] = useState(false);
  const [cancelSuccess, setCancelSuccess] = useState(false);

  // Mock subscription data (실제로는 API에서 가져옴)
  const [subscription, setSubscription] = useState<{
    plan: string;
    status: 'active' | 'canceled' | 'expired';
    expiresAt: string;
    autoRenew: boolean;
  } | null>(null);

  useEffect(() => {
    // TODO: Fetch actual subscription from API
    // 데모용 구독 데이터
    if (mockUser.membership !== 'free') {
      setSubscription({
        plan: mockUser.membership,
        status: 'active',
        expiresAt: '2025-02-15',
        autoRenew: true,
      });
    }
  }, []);

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
        alert('구독 해지 중 오류가 발생했습니다. 고객센터로 문의해주세요.');
      }
    } catch (error) {
      alert('구독 해지 중 오류가 발생했습니다. 고객센터로 문의해주세요.');
    } finally {
      setIsCanceling(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Welcome Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h1 className="text-2xl md:text-3xl font-bold">
            {t('welcome', { name: mockUser.name })}
          </h1>
          <p className="text-muted-foreground">
            Here&apos;s an overview of your account
          </p>
        </div>
        <Link href="/fortune/free">
          <Button>
            <Sparkles className="mr-2 h-4 w-4" />
            Check Today&apos;s Fortune
          </Button>
        </Link>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center gap-4">
              <div className="p-3 rounded-lg bg-purple-100 dark:bg-purple-900/20">
                <Crown className="h-6 w-6 text-purple-500" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">{t('membership')}</p>
                <p className="text-xl font-bold capitalize">{mockUser.membership}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center gap-4">
              <div className="p-3 rounded-lg bg-yellow-100 dark:bg-yellow-900/20">
                <Coins className="h-6 w-6 text-yellow-500" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">{t('coins')}</p>
                <p className="text-xl font-bold">{mockUser.coins}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center gap-4">
              <div className="p-3 rounded-lg bg-blue-100 dark:bg-blue-900/20">
                <BarChart3 className="h-6 w-6 text-blue-500" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">{t('analyses')}</p>
                <p className="text-xl font-bold">{mockUser.totalAnalyses}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center gap-4">
              <div className="p-3 rounded-lg bg-green-100 dark:bg-green-900/20">
                <Calendar className="h-6 w-6 text-green-500" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">{t('streak')}</p>
                <p className="text-xl font-bold">{mockUser.streak} days</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Main Content Grid */}
      <div className="grid lg:grid-cols-2 gap-6">
        {/* Recent Analyses */}
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle>Recent Analyses</CardTitle>
              <Link href="/my/history">
                <Button variant="ghost" size="sm">
                  View All
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </Link>
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {mockUser.recentAnalyses.map((analysis) => (
                <div
                  key={analysis.id}
                  className="flex items-center justify-between p-4 rounded-lg bg-muted"
                >
                  <div className="flex items-center gap-4">
                    <div className="p-2 rounded-lg bg-background">
                      <Star className="h-5 w-5 text-primary" />
                    </div>
                    <div>
                      <p className="font-medium capitalize">{analysis.type} Analysis</p>
                      <p className="text-sm text-muted-foreground">{analysis.date}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="font-bold text-lg">{analysis.score}</p>
                    <p className="text-xs text-muted-foreground">score</p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Quick Actions */}
        <Card>
          <CardHeader>
            <CardTitle>Quick Actions</CardTitle>
            <CardDescription>Start a new analysis or explore features</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 gap-4">
              <Link href="/fortune/saju">
                <div className="p-4 rounded-lg border hover:border-primary transition-colors cursor-pointer text-center">
                  <Sparkles className="h-8 w-8 mx-auto mb-2 text-purple-500" />
                  <p className="font-medium">Saju Analysis</p>
                </div>
              </Link>
              <Link href="/fortune/face">
                <div className="p-4 rounded-lg border hover:border-primary transition-colors cursor-pointer text-center">
                  <Star className="h-8 w-8 mx-auto mb-2 text-blue-500" />
                  <p className="font-medium">Face Reading</p>
                </div>
              </Link>
              <Link href="/fortune/compatibility">
                <div className="p-4 rounded-lg border hover:border-primary transition-colors cursor-pointer text-center">
                  <Users className="h-8 w-8 mx-auto mb-2 text-pink-500" />
                  <p className="font-medium">Compatibility</p>
                </div>
              </Link>
              <Link href="/pricing">
                <div className="p-4 rounded-lg border hover:border-primary transition-colors cursor-pointer text-center">
                  <Crown className="h-8 w-8 mx-auto mb-2 text-yellow-500" />
                  <p className="font-medium">Upgrade Plan</p>
                </div>
              </Link>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Referral Card */}
      <Card className="bg-gradient-to-r from-purple-50 to-pink-50 dark:from-purple-950/20 dark:to-pink-950/20">
        <CardContent className="p-6">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div className="flex items-center gap-4">
              <div className="p-3 rounded-lg bg-purple-500 text-white">
                <Gift className="h-6 w-6" />
              </div>
              <div>
                <h3 className="font-bold text-lg">Invite Friends & Earn Rewards</h3>
                <p className="text-muted-foreground">
                  Share your code and get 100 coins for each friend who signs up
                </p>
              </div>
            </div>
            <div className="flex items-center gap-4">
              <div className="text-center">
                <p className="text-2xl font-bold text-primary">{mockUser.referralCount}</p>
                <p className="text-xs text-muted-foreground">Referrals</p>
              </div>
              <div className="px-4 py-2 rounded-lg bg-background font-mono">
                {mockUser.referralCode}
              </div>
              <Button>Copy Code</Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Subscription Management Card */}
      {subscription && subscription.status === 'active' && (
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle className="flex items-center gap-2">
                <Crown className="h-5 w-5 text-yellow-500" />
                구독 관리
              </CardTitle>
              <Badge className={subscription.status === 'active' ? 'bg-green-500' : 'bg-gray-500'}>
                {subscription.status === 'active' ? '활성' : '해지됨'}
              </Badge>
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex justify-between items-center p-4 bg-muted rounded-lg">
                <div>
                  <p className="font-semibold capitalize">{subscription.plan} 플랜</p>
                  <p className="text-sm text-muted-foreground">
                    만료일: {new Date(subscription.expiresAt).toLocaleDateString('ko-KR')}
                  </p>
                </div>
                <div className="text-right">
                  <p className="text-sm text-muted-foreground">
                    {subscription.autoRenew ? '자동 갱신 예정' : '갱신 안 함'}
                  </p>
                </div>
              </div>

              <div className="flex gap-2">
                <Link href="/pricing" className="flex-1">
                  <Button variant="outline" className="w-full">
                    플랜 변경
                  </Button>
                </Link>
                <Button
                  variant="destructive"
                  onClick={() => setShowCancelDialog(true)}
                  className="flex-1"
                >
                  <XCircle className="mr-2 h-4 w-4" />
                  구독 해지
                </Button>
              </div>

              <p className="text-xs text-muted-foreground text-center">
                구독 해지 시 {new Date(subscription.expiresAt).toLocaleDateString('ko-KR')}까지 서비스 이용 가능합니다.
                <br />
                문의: <a href="tel:1588-5617" className="text-primary">1588-5617</a> | <a href="mailto:mymiryu@gmail.com" className="text-primary">mymiryu@gmail.com</a>
              </p>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Upgrade Banner for Free Users */}
      {mockUser.membership === 'free' && (
        <Card className="border-primary">
          <CardContent className="p-6">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
              <div>
                <Badge className="mb-2 bg-primary">Limited Offer</Badge>
                <h3 className="font-bold text-lg">Upgrade to Pro for 30% off</h3>
                <p className="text-muted-foreground">
                  Get unlimited analyses, voice reports, and priority support
                </p>
              </div>
              <Link href="/pricing">
                <Button size="lg">
                  Upgrade Now
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </Link>
            </div>
          </CardContent>
        </Card>
      )}

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
                {subscription?.expiresAt && new Date(subscription.expiresAt).toLocaleDateString('ko-KR')}까지
                서비스를 이용하실 수 있습니다.
              </p>
            </div>
          ) : (
            <>
              <div className="space-y-3 py-4">
                <div className="flex items-start gap-3 p-3 bg-yellow-50 dark:bg-yellow-950/20 rounded-lg">
                  <AlertTriangle className="h-5 w-5 text-yellow-600 mt-0.5" />
                  <div className="text-sm">
                    <p className="font-medium text-yellow-800 dark:text-yellow-200">
                      만료일({subscription?.expiresAt && new Date(subscription.expiresAt).toLocaleDateString('ko-KR')})까지 이용 가능
                    </p>
                    <p className="text-yellow-700 dark:text-yellow-300">
                      해지 후에도 결제 기간 동안 서비스를 계속 이용할 수 있습니다.
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

              <div className="text-sm text-muted-foreground">
                <p>환불 문의: 1588-5617 (평일 09:00~18:00)</p>
                <p>
                  <a href="/legal/refund" target="_blank" className="text-primary underline">
                    환불정책 보기
                  </a>
                </p>
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
