'use client';

import { useState, useEffect } from 'react';
import { Link } from '@/i18n/routing';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { useAuth } from '@/lib/hooks/useAuth';
import {
  Check,
  Sparkles,
  Crown,
  Star,
  Zap,
  Shield,
  Gift,
  ArrowRight,
  FileText,
  Volume2,
  Clock,
  Heart,
  Gem,
  ChevronRight,
  Calendar,
  TrendingUp,
  Users,
  Loader2,
} from 'lucide-react';

// 결제권 패키지 정의
const packages = [
  {
    id: 'basic',
    name: '베이직',
    subtitle: '기본 분석',
    price: 4900,
    originalPrice: 9800,
    tickets: 1,
    discount: 50,
    features: [
      '사주팔자 기본 분석',
      '오행 분석',
      '2026년 총운',
      '성격 분석',
      '행운의 요소',
    ],
    notIncluded: [
      '궁합 분석',
      '월별 운세',
      'PDF 다운로드',
      '음성 리포트',
    ],
    color: 'from-slate-500 to-slate-600',
    bgGlow: 'from-slate-400/20',
    borderColor: 'border-slate-200 dark:border-slate-700',
    popular: false,
  },
  {
    id: 'standard',
    name: '스탠다드',
    subtitle: '인기 패키지',
    price: 9800,
    originalPrice: 19600,
    tickets: 2,
    discount: 50,
    features: [
      '베이직 패키지 전체',
      '궁합 분석 (연인/친구/동료)',
      '정통 사주 (십신/신살/12운성)',
      '월별 상세 운세 12개월',
      'PDF 리포트 다운로드',
    ],
    notIncluded: [
      '10년 대운 분석',
      '음성 리포트',
    ],
    color: 'from-violet-500 to-purple-600',
    bgGlow: 'from-violet-400/20',
    borderColor: 'border-violet-300 dark:border-violet-700',
    popular: true,
  },
  {
    id: 'premium',
    name: '프리미엄',
    subtitle: '최고의 가치',
    price: 19600,
    originalPrice: 39200,
    tickets: 4,
    discount: 50,
    features: [
      '스탠다드 패키지 전체',
      '10년 대운 타임라인',
      'MBTI + 사주 통합 분석',
      '혈액형 + 별자리 크로스 분석',
      '음성 리포트 (MP3)',
      'AI 1:1 상담 (사주 기반)',
    ],
    notIncluded: [],
    color: 'from-amber-500 to-orange-600',
    bgGlow: 'from-amber-400/20',
    borderColor: 'border-amber-300 dark:border-amber-700',
    badge: 'BEST',
    popular: false,
  },
];

// 패키지별 기능 비교 표
const featureComparison = [
  { feature: '사주팔자 기본 분석', basic: true, standard: true, premium: true },
  { feature: '오행 분석', basic: true, standard: true, premium: true },
  { feature: '2026년 총운', basic: true, standard: true, premium: true },
  { feature: '성격 분석', basic: true, standard: true, premium: true },
  { feature: '궁합 분석', basic: false, standard: true, premium: true },
  { feature: '정통 사주 (십신/신살)', basic: false, standard: true, premium: true },
  { feature: '월별 운세 12개월', basic: false, standard: true, premium: true },
  { feature: 'PDF 다운로드', basic: false, standard: true, premium: true },
  { feature: '10년 대운 분석', basic: false, standard: false, premium: true },
  { feature: 'MBTI/혈액형 통합 분석', basic: false, standard: false, premium: true },
  { feature: '음성 리포트 (MP3)', basic: false, standard: false, premium: true },
  { feature: 'AI 1:1 상담', basic: false, standard: false, premium: true },
];

export default function PricingPage() {
  const router = useRouter();
  const { user, isLoading: authLoading } = useAuth();
  const [purchasingId, setPurchasingId] = useState<string | null>(null);
  const [dbPackages, setDbPackages] = useState<Record<string, string>>({});

  // DB에서 번들 패키지 ID 가져오기
  useEffect(() => {
    const fetchPackages = async () => {
      try {
        const response = await fetch('/api/voucher/packages?service_type=bundle');
        if (response.ok) {
          const data = await response.json();
          if (data.packages) {
            const pkgMap: Record<string, string> = {};
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            data.packages.forEach((pkg: any) => {
              if (pkg.plan_type) {
                pkgMap[pkg.plan_type] = pkg.id;
              }
            });
            setDbPackages(pkgMap);
          }
        }
      } catch (error) {
        console.error('Failed to fetch packages:', error);
      }
    };
    fetchPackages();
  }, []);

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('ko-KR').format(price);
  };

  const handlePurchase = async (packageId: string) => {
    if (!user) {
      router.push('/login?redirect=/pricing');
      return;
    }

    setPurchasingId(packageId);

    try {
      const pkg = packages.find(p => p.id === packageId);
      const dbPackageId = dbPackages[packageId];

      if (!dbPackageId) {
        alert('패키지 정보를 불러오는 중입니다. 잠시 후 다시 시도해주세요.');
        setPurchasingId(null);
        return;
      }

      // 결제권 구매 API 호출
      const response = await fetch('/api/voucher/purchase', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          package_id: dbPackageId,
        }),
      });

      const data = await response.json();

      if (data.success && data.toss) {
        // 토스페이먼츠 결제 페이지로 이동
        const tossClientKey = process.env.NEXT_PUBLIC_TOSS_CLIENT_KEY;
        if (tossClientKey && typeof window !== 'undefined') {
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          const tossPayments = (window as any).TossPayments?.(tossClientKey);
          if (tossPayments) {
            await tossPayments.requestPayment('카드', {
              amount: data.toss.amount,
              orderId: data.toss.orderId,
              orderName: data.toss.orderName,
              customerName: data.toss.customerName,
              successUrl: data.toss.successUrl,
              failUrl: data.toss.failUrl,
            });
          } else {
            // SDK 없으면 체크아웃 페이지로 리다이렉트
            window.location.href = `/payment/checkout?orderId=${data.orderId}&amount=${data.toss.amount}&orderName=${encodeURIComponent(data.toss.orderName)}`;
          }
        }
      } else {
        alert(data.error || '결제 준비 중 오류가 발생했습니다.');
      }
    } catch (error) {
      console.error('Payment error:', error);
      alert('결제 처리 중 오류가 발생했습니다.');
    } finally {
      setPurchasingId(null);
    }
  };

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="relative overflow-hidden bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 text-white py-16 md:py-24">
        {/* Background Effects */}
        <div className="absolute inset-0">
          <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-purple-500/20 rounded-full blur-[120px]" />
          <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-amber-500/10 rounded-full blur-[120px]" />
        </div>

        <div className="container mx-auto px-4 relative z-10">
          <div className="max-w-4xl mx-auto text-center">
            <Badge className="mb-6 bg-white/10 text-white/90 backdrop-blur-sm border-white/20 px-4 py-1.5">
              <Gem className="mr-2 h-4 w-4 text-amber-400" />
              AI 사주분석 결제권
            </Badge>

            <h1 className="text-3xl md:text-5xl font-bold mb-6 leading-tight tracking-tight">
              단 한 번의 결제로
              <br />
              <span className="bg-gradient-to-r from-amber-200 via-yellow-300 to-amber-200 bg-clip-text text-transparent">
                프리미엄 사주 분석
              </span>
            </h1>

            <p className="text-lg md:text-xl text-white/70 mb-8 max-w-2xl mx-auto leading-relaxed">
              정통 사주명리학과 최첨단 AI의 완벽한 조화
              <br className="hidden md:block" />
              필요한 만큼만 구매하고, 원할 때 사용하세요
            </p>

            <div className="flex flex-wrap justify-center gap-6 text-sm text-white/60">
              <div className="flex items-center gap-2">
                <Shield className="h-4 w-4 text-green-400" />
                <span>안전한 결제</span>
              </div>
              <div className="flex items-center gap-2">
                <Clock className="h-4 w-4 text-blue-400" />
                <span>1년 유효기간</span>
              </div>
              <div className="flex items-center gap-2">
                <Gift className="h-4 w-4 text-pink-400" />
                <span>선물 가능</span>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Wave */}
        <div className="absolute bottom-0 left-0 right-0">
          <svg viewBox="0 0 1440 120" fill="none" className="w-full h-auto">
            <path
              d="M0 120L60 110C120 100 240 80 360 70C480 60 600 60 720 65C840 70 960 80 1080 85C1200 90 1320 90 1380 90L1440 90V120H1380C1320 120 1200 120 1080 120C960 120 840 120 720 120C600 120 480 120 360 120C240 120 120 120 60 120H0Z"
              className="fill-background"
            />
          </svg>
        </div>
      </section>

      {/* Pricing Cards Section */}
      <section className="py-12 md:py-20 -mt-8">
        <div className="container mx-auto px-4">
          {/* Section Title */}
          <div className="text-center mb-10">
            <h2 className="text-2xl md:text-3xl font-bold mb-3">결제권 선택</h2>
            <p className="text-muted-foreground">필요에 맞는 패키지를 선택하세요</p>
          </div>

          {/* Pricing Cards */}
          <div className="grid md:grid-cols-3 gap-6 max-w-5xl mx-auto mb-16">
            {packages.map((pkg) => (
              <Card
                key={pkg.id}
                className={`relative overflow-hidden transition-all duration-300 hover:shadow-2xl ${
                  pkg.popular
                    ? 'border-2 border-violet-500 shadow-xl shadow-violet-500/10 scale-[1.02] md:scale-105'
                    : pkg.borderColor
                }`}
              >
                {/* Popular Badge */}
                {pkg.popular && (
                  <div className="absolute top-4 left-4 z-10">
                    <Badge className="bg-gradient-to-r from-violet-500 to-purple-600 text-white border-0 px-3 py-1">
                      <Star className="mr-1 h-3 w-3" />
                      인기
                    </Badge>
                  </div>
                )}

                {/* Best Badge */}
                {pkg.badge && (
                  <div className="absolute top-4 right-4">
                    <Badge className="bg-gradient-to-r from-amber-500 to-orange-500 text-white border-0">
                      {pkg.badge}
                    </Badge>
                  </div>
                )}

                {/* Glow Effect */}
                <div className={`absolute inset-0 bg-gradient-to-br ${pkg.bgGlow} to-transparent opacity-50`} />

                <CardHeader className={`relative ${pkg.popular ? 'pt-14' : 'pt-6'}`}>
                  <div className="mb-2">
                    <span className="text-xs font-medium text-muted-foreground uppercase tracking-wider">
                      {pkg.subtitle}
                    </span>
                  </div>
                  <CardTitle className="text-2xl">{pkg.name}</CardTitle>
                  <CardDescription>
                    결제권 {pkg.tickets}장 가치
                  </CardDescription>
                </CardHeader>

                <CardContent className="relative">
                  {/* Price */}
                  <div className="mb-6">
                    <div className="flex items-baseline gap-2">
                      <span className="text-4xl font-bold">₩{formatPrice(pkg.price)}</span>
                    </div>
                    <div className="flex items-center gap-2 mt-1">
                      <span className="text-sm text-muted-foreground line-through">
                        ₩{formatPrice(pkg.originalPrice)}
                      </span>
                      <Badge variant="secondary" className="bg-red-100 text-red-600 dark:bg-red-900/30 dark:text-red-400">
                        {pkg.discount}% 할인
                      </Badge>
                    </div>
                  </div>

                  {/* Features */}
                  <ul className="space-y-2.5 mb-6">
                    {pkg.features.map((feature, index) => (
                      <li key={index} className="flex items-start gap-2 text-sm">
                        <div className={`w-5 h-5 rounded-full bg-gradient-to-br ${pkg.color} flex items-center justify-center flex-shrink-0 mt-0.5`}>
                          <Check className="h-3 w-3 text-white" />
                        </div>
                        <span>{feature}</span>
                      </li>
                    ))}
                    {pkg.notIncluded.map((feature, index) => (
                      <li key={`not-${index}`} className="flex items-start gap-2 text-sm text-muted-foreground">
                        <div className="w-5 h-5 rounded-full bg-muted flex items-center justify-center flex-shrink-0 mt-0.5">
                          <span className="text-xs">-</span>
                        </div>
                        <span className="line-through">{feature}</span>
                      </li>
                    ))}
                  </ul>

                  {/* CTA Button */}
                  <Button
                    size="lg"
                    className={`w-full ${
                      pkg.popular
                        ? 'bg-gradient-to-r from-violet-500 to-purple-600 hover:from-violet-600 hover:to-purple-700 shadow-lg shadow-violet-500/25'
                        : ''
                    }`}
                    variant={pkg.popular ? 'default' : 'outline'}
                    onClick={() => handlePurchase(pkg.id)}
                    disabled={purchasingId === pkg.id}
                  >
                    {purchasingId === pkg.id ? (
                      <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        결제 준비 중...
                      </>
                    ) : (
                      <>
                        결제하기
                        <ChevronRight className="ml-1 h-4 w-4" />
                      </>
                    )}
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>

          {/* Feature Comparison Table */}
          <div className="max-w-4xl mx-auto">
            <h3 className="text-xl font-bold text-center mb-6">패키지 기능 비교</h3>
            <Card>
              <CardContent className="p-0 overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b">
                      <th className="text-left p-4 font-medium">기능</th>
                      <th className="text-center p-4 font-medium">베이직<br/><span className="text-sm font-normal text-muted-foreground">₩4,900</span></th>
                      <th className="text-center p-4 font-medium bg-violet-50 dark:bg-violet-950/30">스탠다드<br/><span className="text-sm font-normal text-muted-foreground">₩9,800</span></th>
                      <th className="text-center p-4 font-medium">프리미엄<br/><span className="text-sm font-normal text-muted-foreground">₩19,600</span></th>
                    </tr>
                  </thead>
                  <tbody>
                    {featureComparison.map((row, index) => (
                      <tr key={index} className={index % 2 === 0 ? 'bg-muted/30' : ''}>
                        <td className="p-4 text-sm">{row.feature}</td>
                        <td className="text-center p-4">
                          {row.basic ? (
                            <Check className="h-5 w-5 text-green-500 mx-auto" />
                          ) : (
                            <span className="text-muted-foreground">-</span>
                          )}
                        </td>
                        <td className="text-center p-4 bg-violet-50 dark:bg-violet-950/30">
                          {row.standard ? (
                            <Check className="h-5 w-5 text-green-500 mx-auto" />
                          ) : (
                            <span className="text-muted-foreground">-</span>
                          )}
                        </td>
                        <td className="text-center p-4">
                          {row.premium ? (
                            <Check className="h-5 w-5 text-green-500 mx-auto" />
                          ) : (
                            <span className="text-muted-foreground">-</span>
                          )}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* What's Included Section */}
      <section className="py-16 bg-muted/30">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-2xl md:text-3xl font-bold mb-3">모든 패키지에 포함된 내용</h2>
            <p className="text-muted-foreground">기본적으로 제공되는 핵심 기능</p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 max-w-5xl mx-auto">
            <Card className="text-center p-6 hover:shadow-lg transition-shadow">
              <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center mx-auto mb-4">
                <Sparkles className="h-7 w-7 text-white" />
              </div>
              <h3 className="font-semibold mb-2">사주팔자 분석</h3>
              <p className="text-sm text-muted-foreground">
                정통 사주명리학 기반의 상세한 분석
              </p>
            </Card>

            <Card className="text-center p-6 hover:shadow-lg transition-shadow">
              <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-purple-500 to-pink-600 flex items-center justify-center mx-auto mb-4">
                <TrendingUp className="h-7 w-7 text-white" />
              </div>
              <h3 className="font-semibold mb-2">오행 분석</h3>
              <p className="text-sm text-muted-foreground">
                목화토금수 오행의 균형과 특성 분석
              </p>
            </Card>

            <Card className="text-center p-6 hover:shadow-lg transition-shadow">
              <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-amber-500 to-orange-600 flex items-center justify-center mx-auto mb-4">
                <Calendar className="h-7 w-7 text-white" />
              </div>
              <h3 className="font-semibold mb-2">2026년 총운</h3>
              <p className="text-sm text-muted-foreground">
                새해 운세와 주요 이벤트 예측
              </p>
            </Card>

            <Card className="text-center p-6 hover:shadow-lg transition-shadow">
              <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-green-500 to-emerald-600 flex items-center justify-center mx-auto mb-4">
                <Users className="h-7 w-7 text-white" />
              </div>
              <h3 className="font-semibold mb-2">성격 분석</h3>
              <p className="text-sm text-muted-foreground">
                타고난 성격과 잠재력 분석
              </p>
            </Card>
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto">
            <h2 className="text-2xl md:text-3xl font-bold text-center mb-10">자주 묻는 질문</h2>

            <div className="space-y-4">
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">결제권은 얼마나 유효한가요?</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground">
                    결제권은 구매일로부터 1년간 유효합니다. 기간 내에 사용하지 않은 결제권은 자동으로 소멸됩니다.
                  </p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">결제권을 선물할 수 있나요?</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground">
                    네, 결제권은 다른 사용자에게 선물할 수 있습니다. 구매 후 마이페이지에서 선물하기 기능을 이용해주세요.
                  </p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">환불이 가능한가요?</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground">
                    미사용 결제권은 구매일로부터 7일 이내에 전액 환불이 가능합니다. 부분 사용 시에는 환불이 불가합니다.
                  </p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">패키지 업그레이드가 가능한가요?</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground">
                    분석 결과 화면에서 언제든지 상위 패키지로 업그레이드할 수 있습니다. 차액만 결제하면 됩니다.
                  </p>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 bg-gradient-to-r from-violet-600 to-purple-600 text-white">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-2xl md:text-3xl font-bold mb-4">
            지금 바로 시작하세요
          </h2>
          <p className="text-white/80 mb-8 max-w-xl mx-auto">
            특별 할인 가격으로 프리미엄 사주 분석을 경험해보세요.
            <br />
            지금이 가장 좋은 시작입니다.
          </p>
          <Button
            size="lg"
            variant="secondary"
            className="bg-white text-purple-600 hover:bg-white/90"
            onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
          >
            <Sparkles className="mr-2 h-5 w-5" />
            패키지 선택하기
            <ArrowRight className="ml-2 h-5 w-5" />
          </Button>
        </div>
      </section>
    </div>
  );
}
