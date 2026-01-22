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
  AlertCircle,
  Copy,
  Eye,
} from 'lucide-react';
import { useAuth } from '@/lib/hooks/useAuth';
import { useToast } from '@/hooks/use-toast';

interface UserData {
  id: string;
  name: string;
  email: string;
  avatarUrl?: string | null;
  membership: string;
  membershipExpiresAt?: string | null;
  coins: number;
  totalAnalyses: number;
  streak: number;
  joinDate: string;
  referralCode?: string | null;
  referralCount: number;
  isAdmin?: boolean;
}

interface Subscription {
  plan: string;
  status: 'active' | 'canceled' | 'expired';
  expiresAt: string;
  autoRenew: boolean;
  startedAt: string;
}

interface RecentAnalysis {
  id: string;
  type: string;
  date: string;
  score: number;
}

const membershipLabels: Record<string, string> = {
  free: '무료',
  basic: '베이직',
  premium: '프리미엄',
  vip: 'VIP',
};

const typeLabels: Record<string, string> = {
  saju: '사주',
  daily: '일일 운세',
  compatibility: '궁합',
  face: '관상',
  tarot: '타로',
  integrated: '통합',
};

export default function DashboardPage() {
  const t = useTranslations('mypage.dashboard');
  const { user: authUser, isLoading: authLoading } = useAuth();
  const { toast } = useToast();

  const [userData, setUserData] = useState<UserData | null>(null);
  const [subscription, setSubscription] = useState<Subscription | null>(null);
  const [recentAnalyses, setRecentAnalyses] = useState<RecentAnalysis[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [showCancelDialog, setShowCancelDialog] = useState(false);
  const [isCanceling, setIsCanceling] = useState(false);
  const [cancelSuccess, setCancelSuccess] = useState(false);

  // 데이터 로딩
  useEffect(() => {
    if (!authLoading && authUser) {
      fetchDashboardData();
    } else if (!authLoading && !authUser) {
      setIsLoading(false);
    }
  }, [authUser, authLoading]);

  const fetchDashboardData = async () => {
    try {
      setIsLoading(true);
      setError(null);

      const response = await fetch('/api/my/dashboard');
      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || '데이터를 불러오는데 실패했습니다.');
      }

      setUserData(data.user);
      setSubscription(data.subscription);
      setRecentAnalyses(data.recentAnalyses || []);
    } catch (err) {
      console.error('Fetch dashboard error:', err);
      setError(err instanceof Error ? err.message : '오류가 발생했습니다.');
    } finally {
      setIsLoading(false);
    }
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
          title: '구독 해지 중 오류가 발생했습니다.',
          description: '고객센터로 문의해주세요.',
          variant: 'destructive',
        });
      }
    } catch {
      toast({
        title: '구독 해지 중 오류가 발생했습니다.',
        description: '고객센터로 문의해주세요.',
        variant: 'destructive',
      });
    } finally {
      setIsCanceling(false);
    }
  };

  const handleCopyReferralCode = async () => {
    if (userData?.referralCode) {
      try {
        await navigator.clipboard.writeText(userData.referralCode);
        toast({ title: '추천 코드가 복사되었습니다' });
      } catch {
        toast({ title: '복사에 실패했습니다', variant: 'destructive' });
      }
    }
  };

  // 로그인 필요 화면
  if (!authLoading && !authUser) {
    return (
      <div className="space-y-6">
        <Card className="p-8 text-center">
          <AlertCircle className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
          <h3 className="font-semibold mb-2">로그인이 필요합니다</h3>
          <p className="text-muted-foreground mb-4">
            대시보드를 확인하려면 로그인해주세요
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
          <p className="text-muted-foreground">데이터를 불러오는 중...</p>
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
          <Button variant="outline" onClick={fetchDashboardData}>
            다시 시도
          </Button>
        </Card>
      </div>
    );
  }

  const displayName = userData?.name || '사용자';

  return (
    <div className="space-y-6">
      {/* Welcome Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h1 className="text-2xl md:text-3xl font-bold">
            {displayName}님, 환영합니다!
          </h1>
          <p className="text-muted-foreground">
            내 계정 현황을 확인하세요
          </p>
        </div>
        <Link href="/fortune/free">
          <Button>
            <Sparkles className="mr-2 h-4 w-4" />
            오늘의 운세 확인
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
                <p className="text-sm text-muted-foreground">멤버십</p>
                <p className="text-xl font-bold">
                  {membershipLabels[userData?.membership || 'free'] || userData?.membership}
                </p>
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
                <p className="text-sm text-muted-foreground">보유 코인</p>
                <p className="text-xl font-bold">{userData?.coins || 0}</p>
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
                <p className="text-sm text-muted-foreground">총 분석 횟수</p>
                <p className="text-xl font-bold">{userData?.totalAnalyses || 0}</p>
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
                <p className="text-sm text-muted-foreground">연속 출석</p>
                <p className="text-xl font-bold">{userData?.streak || 0}일</p>
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
              <CardTitle>최근 분석 내역</CardTitle>
              <Link href="/my/history">
                <Button variant="ghost" size="sm">
                  전체 보기
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </Link>
            </div>
          </CardHeader>
          <CardContent>
            {recentAnalyses.length > 0 ? (
              <div className="space-y-4">
                {recentAnalyses.map((analysis) => (
                  <div
                    key={analysis.id}
                    className="flex items-center justify-between p-4 rounded-lg bg-muted"
                  >
                    <div className="flex items-center gap-4">
                      <div className="p-2 rounded-lg bg-background">
                        <Star className="h-5 w-5 text-primary" />
                      </div>
                      <div>
                        <p className="font-medium">
                          {typeLabels[analysis.type] || analysis.type} 분석
                        </p>
                        <p className="text-sm text-muted-foreground">
                          {new Date(analysis.date).toLocaleDateString('ko-KR')}
                        </p>
                      </div>
                    </div>
                    <div className="text-right">
                      {analysis.score > 0 && (
                        <>
                          <p className="font-bold text-lg">{analysis.score}</p>
                          <p className="text-xs text-muted-foreground">점수</p>
                        </>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-8 text-muted-foreground">
                <BarChart3 className="h-12 w-12 mx-auto mb-4 opacity-50" />
                <p>아직 분석 내역이 없습니다</p>
                <Link href="/fortune">
                  <Button variant="link" className="mt-2">
                    첫 운세 분석하기
                  </Button>
                </Link>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Quick Actions */}
        <Card>
          <CardHeader>
            <CardTitle>빠른 메뉴</CardTitle>
            <CardDescription>새로운 분석을 시작하거나 기능을 살펴보세요</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 gap-4">
              <Link href="/fortune/saju">
                <div className="p-4 rounded-lg border hover:border-primary transition-colors cursor-pointer text-center">
                  <Sparkles className="h-8 w-8 mx-auto mb-2 text-purple-500" />
                  <p className="font-medium">사주 분석</p>
                </div>
              </Link>
              <Link href="/fortune/face">
                <div className="p-4 rounded-lg border hover:border-primary transition-colors cursor-pointer text-center">
                  <Eye className="h-8 w-8 mx-auto mb-2 text-blue-500" />
                  <p className="font-medium">관상 분석</p>
                </div>
              </Link>
              <Link href="/fortune/compatibility">
                <div className="p-4 rounded-lg border hover:border-primary transition-colors cursor-pointer text-center">
                  <Users className="h-8 w-8 mx-auto mb-2 text-pink-500" />
                  <p className="font-medium">궁합 분석</p>
                </div>
              </Link>
              <Link href="/pricing">
                <div className="p-4 rounded-lg border hover:border-primary transition-colors cursor-pointer text-center">
                  <Crown className="h-8 w-8 mx-auto mb-2 text-yellow-500" />
                  <p className="font-medium">플랜 업그레이드</p>
                </div>
              </Link>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Referral Card */}
      {userData?.referralCode && (
        <Card className="bg-gradient-to-r from-purple-50 to-pink-50 dark:from-purple-950/20 dark:to-pink-950/20">
          <CardContent className="p-6">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
              <div className="flex items-center gap-4">
                <div className="p-3 rounded-lg bg-purple-500 text-white">
                  <Gift className="h-6 w-6" />
                </div>
                <div>
                  <h3 className="font-bold text-lg">친구 초대하고 코인 받기</h3>
                  <p className="text-muted-foreground">
                    추천 코드를 공유하면 친구 가입 시 100 코인을 받아요
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-4">
                <div className="text-center">
                  <p className="text-2xl font-bold text-primary">{userData.referralCount}</p>
                  <p className="text-xs text-muted-foreground">추천 수</p>
                </div>
                <div className="px-4 py-2 rounded-lg bg-background font-mono">
                  {userData.referralCode}
                </div>
                <Button onClick={handleCopyReferralCode}>
                  <Copy className="mr-2 h-4 w-4" />
                  복사
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

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
                  <p className="font-semibold">
                    {membershipLabels[subscription.plan] || subscription.plan} 플랜
                  </p>
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

      {/* Upgrade Banner for Free Users (관리자 제외) */}
      {userData?.membership === 'free' && !userData?.isAdmin && (
        <Card className="border-primary">
          <CardContent className="p-6">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
              <div>
                <Badge className="mb-2 bg-primary">한정 혜택</Badge>
                <h3 className="font-bold text-lg">프리미엄 30% 할인 중</h3>
                <p className="text-muted-foreground">
                  무제한 분석, 음성 리포트, 우선 지원까지 모두 누리세요
                </p>
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
