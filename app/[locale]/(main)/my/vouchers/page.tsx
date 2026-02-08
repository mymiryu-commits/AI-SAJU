'use client';

import { useState, useEffect, useCallback, Suspense } from 'react';
import { Link } from '@/i18n/routing';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Progress } from '@/components/ui/progress';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';
import {
  Ticket,
  ShoppingCart,
  Gift,
  Clock,
  AlertCircle,
  Loader2,
  CheckCircle,
  Sparkles,
  QrCode,
  Calendar,
  ChevronRight,
  History,
  XCircle,
} from 'lucide-react';
import { useAuth } from '@/lib/hooks/useAuth';
import { useSearchParams } from 'next/navigation';

interface VoucherPackage {
  id: string;
  service_type: string;
  name: string;
  description: string;
  quantity: number;
  regular_price: number;
  sale_price: number;
  unit_price: number;
  discount_rate: number;
  discount_label: string;
  is_promotion: boolean;
  promotion_limit: number | null;
  promotion_remaining: number | null;
  is_sold_out: boolean;
  validity_days: number;
}

interface UserVoucher {
  id: string;
  service_type: string;
  total_quantity: number;
  used_quantity: number;
  remaining_quantity: number;
  purchase_price: number;
  unit_price: number;
  status: string;
  source: string;
  expires_at: string;
  created_at: string;
}

interface VoucherSummary {
  [key: string]: {
    total: number;
    expiring_soon: number;
  };
}

const serviceTypeConfig: Record<string, { icon: typeof Sparkles; label: string; color: string }> = {
  saju: {
    icon: Sparkles,
    label: '사주 완전분석',
    color: 'text-purple-500 bg-purple-100 dark:bg-purple-900/30',
  },
  qrcode: {
    icon: QrCode,
    label: 'QR코드 생성',
    color: 'text-blue-500 bg-blue-100 dark:bg-blue-900/30',
  },
};

function VouchersPageContent() {
  const { user, isLoading: authLoading } = useAuth();
  const searchParams = useSearchParams();

  // URL 파라미터 처리 (결제 결과)
  const success = searchParams.get('success');
  const error = searchParams.get('error');
  const errorMessage = searchParams.get('message');

  const [packages, setPackages] = useState<VoucherPackage[]>([]);
  const [vouchers, setVouchers] = useState<UserVoucher[]>([]);
  const [summary, setSummary] = useState<VoucherSummary>({});
  const [isLoading, setIsLoading] = useState(true);
  const [isPurchasing, setIsPurchasing] = useState<string | null>(null);
  const [selectedPackage, setSelectedPackage] = useState<VoucherPackage | null>(null);
  const [activeTab, setActiveTab] = useState('vouchers');

  // 데이터 로딩
  const fetchData = useCallback(async () => {
    try {
      setIsLoading(true);

      // 패키지 목록과 사용자 이용권 동시 조회
      const [packagesRes, vouchersRes] = await Promise.all([
        fetch('/api/voucher/packages'),
        user ? fetch('/api/voucher/check') : Promise.resolve(null),
      ]);

      const packagesData = await packagesRes.json();
      if (packagesData.success) {
        setPackages(packagesData.packages || []);
      }

      if (vouchersRes) {
        const vouchersData = await vouchersRes.json();
        if (vouchersData.success) {
          setVouchers(vouchersData.vouchers || []);
          setSummary(vouchersData.summary || {});
        }
      }
    } catch (err) {
      console.error('Fetch data error:', err);
    } finally {
      setIsLoading(false);
    }
  }, [user]);

  useEffect(() => {
    if (!authLoading) {
      fetchData();
    }
  }, [authLoading, fetchData]);

  // 결제 성공 시 데이터 새로고침
  useEffect(() => {
    if (success === 'true') {
      fetchData();
    }
  }, [success, fetchData]);

  // 구매하기
  const handlePurchase = async (pkg: VoucherPackage) => {
    if (!user) {
      window.location.href = '/auth/login?redirect=/my/vouchers';
      return;
    }

    try {
      setIsPurchasing(pkg.id);

      const response = await fetch('/api/voucher/purchase', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ package_id: pkg.id }),
      });

      const data = await response.json();

      if (!response.ok) {
        alert(data.error || '구매 요청에 실패했습니다.');
        return;
      }

      // 토스페이먼츠 결제창 호출 (실제 구현에서는 토스 SDK 사용)
      if (data.toss) {
        // 토스페이먼츠 결제 URL로 리다이렉트
        const tossParams = new URLSearchParams({
          orderId: data.toss.orderId,
          orderName: data.toss.orderName,
          amount: data.toss.amount.toString(),
          successUrl: data.toss.successUrl,
          failUrl: data.toss.failUrl,
        });

        // 토스페이먼츠 결제 위젯이 있는 페이지로 이동
        window.location.href = `/payment/checkout?${tossParams.toString()}`;
      }
    } catch (err) {
      console.error('Purchase error:', err);
      alert('오류가 발생했습니다.');
    } finally {
      setIsPurchasing(null);
    }
  };

  // 금액 포맷
  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('ko-KR').format(price);
  };

  // 날짜 포맷
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('ko-KR', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  };

  // 남은 일수 계산
  const getDaysRemaining = (expiresAt: string) => {
    const now = new Date();
    const expires = new Date(expiresAt);
    const diff = expires.getTime() - now.getTime();
    return Math.ceil(diff / (1000 * 60 * 60 * 24));
  };

  // 로딩 중
  if (isLoading || authLoading) {
    return (
      <div className="space-y-6">
        <Card className="p-8 text-center">
          <Loader2 className="h-8 w-8 mx-auto mb-4 animate-spin text-primary" />
          <p className="text-muted-foreground">데이터를 불러오는 중...</p>
        </Card>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold mb-2">내 이용권</h1>
        <p className="text-muted-foreground">
          이용권을 구매하고 관리하세요
        </p>
      </div>

      {/* 결제 결과 알림 */}
      {success === 'true' && (
        <Card className="border-green-200 bg-green-50 dark:bg-green-950/20">
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <CheckCircle className="h-5 w-5 text-green-600" />
              <div>
                <h4 className="font-medium text-green-800 dark:text-green-200">결제가 완료되었습니다!</h4>
                <p className="text-sm text-green-700 dark:text-green-300">
                  이용권이 충전되었습니다. 지금 바로 서비스를 이용해보세요.
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {error && (
        <Card className="border-red-200 bg-red-50 dark:bg-red-950/20">
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <XCircle className="h-5 w-5 text-red-600" />
              <div>
                <h4 className="font-medium text-red-800 dark:text-red-200">결제에 실패했습니다</h4>
                <p className="text-sm text-red-700 dark:text-red-300">
                  {errorMessage ? decodeURIComponent(errorMessage) : '다시 시도해주세요.'}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* 보유 이용권 요약 */}
      {user && Object.keys(summary).length > 0 && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {Object.entries(summary).map(([serviceType, data]) => {
            const config = serviceTypeConfig[serviceType] || {
              icon: Ticket,
              label: serviceType,
              color: 'text-gray-500 bg-gray-100',
            };
            const Icon = config.icon;

            return (
              <Card key={serviceType}>
                <CardContent className="p-4">
                  <div className="flex items-center gap-3">
                    <div className={`p-2 rounded-lg ${config.color}`}>
                      <Icon className="h-5 w-5" />
                    </div>
                    <div className="flex-1">
                      <p className="text-sm text-muted-foreground">{config.label}</p>
                      <p className="text-2xl font-bold">{data.total}회</p>
                    </div>
                    {data.expiring_soon > 0 && (
                      <Badge variant="outline" className="text-orange-500 border-orange-500">
                        <Clock className="h-3 w-3 mr-1" />
                        {data.expiring_soon}회 만료 임박
                      </Badge>
                    )}
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>
      )}

      {/* Tabs */}
      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="vouchers" className="gap-1">
            <Ticket className="h-4 w-4" />
            내 이용권
          </TabsTrigger>
          <TabsTrigger value="packages" className="gap-1">
            <ShoppingCart className="h-4 w-4" />
            구매하기
          </TabsTrigger>
          <TabsTrigger value="history" className="gap-1">
            <History className="h-4 w-4" />
            사용 내역
          </TabsTrigger>
        </TabsList>

        {/* 내 이용권 탭 */}
        <TabsContent value="vouchers" className="space-y-4">
          {!user ? (
            <Card className="p-8 text-center">
              <AlertCircle className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
              <h3 className="font-semibold mb-2">로그인이 필요합니다</h3>
              <p className="text-muted-foreground mb-4">
                이용권을 확인하려면 로그인해주세요
              </p>
              <Link href="/auth/login?redirect=/my/vouchers">
                <Button>로그인하기</Button>
              </Link>
            </Card>
          ) : vouchers.length === 0 ? (
            <Card className="p-8 text-center">
              <Ticket className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
              <h3 className="font-semibold mb-2">보유한 이용권이 없습니다</h3>
              <p className="text-muted-foreground mb-4">
                이용권을 구매하고 다양한 서비스를 이용해보세요
              </p>
              <Button onClick={() => setActiveTab('packages')}>
                이용권 구매하기
                <ChevronRight className="ml-1 h-4 w-4" />
              </Button>
            </Card>
          ) : (
            <div className="space-y-3">
              {vouchers.map((voucher) => {
                const config = serviceTypeConfig[voucher.service_type] || {
                  icon: Ticket,
                  label: voucher.service_type,
                  color: 'text-gray-500 bg-gray-100',
                };
                const Icon = config.icon;
                const daysRemaining = getDaysRemaining(voucher.expires_at);
                const usagePercent = (voucher.used_quantity / voucher.total_quantity) * 100;

                return (
                  <Card key={voucher.id} className="overflow-hidden">
                    <CardContent className="p-4">
                      <div className="flex items-start justify-between gap-4">
                        <div className="flex items-start gap-3 flex-1">
                          <div className={`p-2 rounded-lg shrink-0 ${config.color}`}>
                            <Icon className="h-5 w-5" />
                          </div>
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center gap-2 mb-2 flex-wrap">
                              <h3 className="font-semibold">{config.label}</h3>
                              {voucher.source === 'gift' && (
                                <Badge variant="outline" className="text-pink-500 border-pink-500">
                                  <Gift className="h-3 w-3 mr-1" />
                                  선물받음
                                </Badge>
                              )}
                              {voucher.source === 'promotion' && (
                                <Badge variant="outline" className="text-purple-500 border-purple-500">
                                  프로모션
                                </Badge>
                              )}
                            </div>

                            {/* 사용량 프로그레스 */}
                            <div className="mb-2">
                              <div className="flex justify-between text-sm mb-1">
                                <span>남은 횟수: {voucher.remaining_quantity}회</span>
                                <span className="text-muted-foreground">
                                  {voucher.used_quantity}/{voucher.total_quantity}회 사용
                                </span>
                              </div>
                              <Progress value={usagePercent} className="h-2" />
                            </div>

                            <div className="flex items-center gap-4 text-xs text-muted-foreground flex-wrap">
                              <span className="flex items-center gap-1">
                                <Calendar className="h-3 w-3" />
                                {formatDate(voucher.created_at)} 구매
                              </span>
                              <span className={`flex items-center gap-1 ${daysRemaining <= 30 ? 'text-orange-500' : ''}`}>
                                <Clock className="h-3 w-3" />
                                {daysRemaining > 0 ? `D-${daysRemaining} 만료` : '만료됨'}
                              </span>
                            </div>
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                );
              })}
            </div>
          )}
        </TabsContent>

        {/* 구매하기 탭 */}
        <TabsContent value="packages" className="space-y-6">
          {/* 서비스 타입별 패키지 그룹 */}
          {['saju', 'qrcode'].map((serviceType) => {
            const typePackages = packages.filter((p) => p.service_type === serviceType);
            if (typePackages.length === 0) return null;

            const config = serviceTypeConfig[serviceType];
            const Icon = config.icon;

            return (
              <div key={serviceType}>
                <div className="flex items-center gap-2 mb-4">
                  <div className={`p-2 rounded-lg ${config.color}`}>
                    <Icon className="h-5 w-5" />
                  </div>
                  <h2 className="text-lg font-semibold">{config.label}</h2>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {typePackages.map((pkg) => (
                    <Card
                      key={pkg.id}
                      className={`relative overflow-hidden ${pkg.is_sold_out ? 'opacity-60' : ''}`}
                    >
                      {/* 할인 라벨 */}
                      {pkg.discount_label && !pkg.is_sold_out && (
                        <div className="absolute top-2 right-2">
                          <Badge className="bg-red-500 text-white">
                            {pkg.discount_label}
                          </Badge>
                        </div>
                      )}

                      {/* 품절 라벨 */}
                      {pkg.is_sold_out && (
                        <div className="absolute inset-0 flex items-center justify-center bg-black/50 z-10">
                          <Badge variant="secondary" className="text-lg py-2 px-4">
                            품절
                          </Badge>
                        </div>
                      )}

                      <CardHeader className="pb-2">
                        <CardTitle className="text-lg">{pkg.name}</CardTitle>
                        <CardDescription>{pkg.description}</CardDescription>
                      </CardHeader>

                      <CardContent>
                        <div className="space-y-3">
                          {/* 가격 */}
                          <div>
                            {pkg.regular_price !== pkg.sale_price && (
                              <p className="text-sm text-muted-foreground line-through">
                                {formatPrice(pkg.regular_price)}원
                              </p>
                            )}
                            <p className="text-2xl font-bold text-primary">
                              {formatPrice(pkg.sale_price)}원
                            </p>
                            <p className="text-xs text-muted-foreground">
                              1회당 {formatPrice(Math.round(pkg.sale_price / pkg.quantity))}원
                            </p>
                          </div>

                          {/* 프로모션 남은 수량 */}
                          {pkg.is_promotion && pkg.promotion_remaining !== null && !pkg.is_sold_out && (
                            <div className="flex items-center gap-1 text-sm text-orange-500">
                              <Clock className="h-4 w-4" />
                              선착순 {pkg.promotion_remaining}명 남음
                            </div>
                          )}

                          {/* 유효기간 */}
                          <p className="text-xs text-muted-foreground">
                            유효기간: 구매일로부터 {pkg.validity_days}일
                          </p>

                          {/* 구매 버튼 */}
                          <Button
                            className="w-full"
                            onClick={() => handlePurchase(pkg)}
                            disabled={pkg.is_sold_out || isPurchasing === pkg.id}
                          >
                            {isPurchasing === pkg.id ? (
                              <>
                                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                처리 중...
                              </>
                            ) : pkg.is_sold_out ? (
                              '품절'
                            ) : (
                              <>
                                <ShoppingCart className="mr-2 h-4 w-4" />
                                구매하기
                              </>
                            )}
                          </Button>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </div>
            );
          })}

          {/* 안내 */}
          <Card className="bg-muted/50">
            <CardContent className="p-4">
              <div className="flex items-start gap-3">
                <AlertCircle className="h-5 w-5 text-muted-foreground mt-0.5" />
                <div className="text-sm text-muted-foreground space-y-1">
                  <p>• 이용권은 구매일로부터 1년간 유효합니다.</p>
                  <p>• 사용한 이용권은 환불이 제한될 수 있습니다. 자세한 내용은 <Link href="/legal/refund" className="text-primary underline">환불 정책</Link>을 확인해주세요.</p>
                  <p>• 결제 관련 문의: mymiryu@gmail.com</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* 사용 내역 탭 */}
        <TabsContent value="history" className="space-y-4">
          {!user ? (
            <Card className="p-8 text-center">
              <AlertCircle className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
              <h3 className="font-semibold mb-2">로그인이 필요합니다</h3>
              <p className="text-muted-foreground mb-4">
                사용 내역을 확인하려면 로그인해주세요
              </p>
              <Link href="/auth/login?redirect=/my/vouchers">
                <Button>로그인하기</Button>
              </Link>
            </Card>
          ) : (
            <VoucherUsageHistory />
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
}

// 사용 내역 컴포넌트
function VoucherUsageHistory() {
  const [logs, setLogs] = useState<Array<{
    id: string;
    service_type: string;
    quantity_used: number;
    used_at: string;
    related_type: string | null;
  }>>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  useEffect(() => {
    fetchLogs();
  }, [page]);

  const fetchLogs = async () => {
    try {
      setIsLoading(true);
      const response = await fetch(`/api/voucher/history?page=${page}&limit=10`);
      const data = await response.json();

      if (data.success) {
        setLogs(data.logs || []);
        setTotalPages(data.pagination?.totalPages || 1);
      }
    } catch (err) {
      console.error('Fetch logs error:', err);
    } finally {
      setIsLoading(false);
    }
  };

  if (isLoading) {
    return (
      <Card className="p-8 text-center">
        <Loader2 className="h-8 w-8 mx-auto mb-4 animate-spin text-primary" />
        <p className="text-muted-foreground">내역을 불러오는 중...</p>
      </Card>
    );
  }

  if (logs.length === 0) {
    return (
      <Card className="p-8 text-center">
        <History className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
        <h3 className="font-semibold mb-2">사용 내역이 없습니다</h3>
        <p className="text-muted-foreground">
          이용권을 사용하면 여기에 기록됩니다
        </p>
      </Card>
    );
  }

  return (
    <div className="space-y-4">
      <div className="space-y-3">
        {logs.map((log) => {
          const config = serviceTypeConfig[log.service_type] || {
            icon: Ticket,
            label: log.service_type,
            color: 'text-gray-500 bg-gray-100',
          };
          const Icon = config.icon;

          return (
            <Card key={log.id}>
              <CardContent className="p-4">
                <div className="flex items-center justify-between gap-4">
                  <div className="flex items-center gap-3">
                    <div className={`p-2 rounded-lg ${config.color}`}>
                      <Icon className="h-4 w-4" />
                    </div>
                    <div>
                      <p className="font-medium">{config.label}</p>
                      <p className="text-sm text-muted-foreground">
                        {new Date(log.used_at).toLocaleString('ko-KR')}
                      </p>
                    </div>
                  </div>
                  <Badge variant="outline">-{log.quantity_used}회</Badge>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* 페이지네이션 */}
      {totalPages > 1 && (
        <div className="flex justify-center gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => setPage((p) => Math.max(1, p - 1))}
            disabled={page === 1}
          >
            이전
          </Button>
          <span className="flex items-center px-3 text-sm text-muted-foreground">
            {page} / {totalPages}
          </span>
          <Button
            variant="outline"
            size="sm"
            onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
            disabled={page === totalPages}
          >
            다음
          </Button>
        </div>
      )}
    </div>
  );
}

// Wrapper with Suspense for useSearchParams
export default function VouchersPage() {
  return (
    <Suspense fallback={
      <div className="space-y-6">
        <Card className="p-8 text-center">
          <Loader2 className="h-8 w-8 mx-auto mb-4 animate-spin text-primary" />
          <p className="text-muted-foreground">데이터를 불러오는 중...</p>
        </Card>
      </div>
    }>
      <VouchersPageContent />
    </Suspense>
  );
}
