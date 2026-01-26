'use client';

import { useState } from 'react';
import { Link } from '@/i18n/routing';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
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
  Users,
  Gem,
  ChevronRight,
} from 'lucide-react';

// 프리미엄 사주분석 패키지
const premiumPackages = [
  {
    id: 'starter',
    name: '스타터',
    subtitle: '첫 경험을 위한',
    quantity: 1,
    regularPrice: 29900,
    salePrice: 14900,
    perUse: 14900,
    discount: 50,
    features: [
      '사주팔자 완전 분석',
      '2025년 운세 리포트',
      'PDF 다운로드',
      '음성 해설 MP3',
    ],
    color: 'from-slate-500 to-slate-600',
    bgGlow: 'from-slate-400/20',
    borderColor: 'border-slate-200 dark:border-slate-700',
    popular: false,
  },
  {
    id: 'standard',
    name: '스탠다드',
    subtitle: '가장 인기있는',
    quantity: 5,
    regularPrice: 119900,
    salePrice: 59900,
    perUse: 11980,
    discount: 50,
    extraDiscount: 20,
    features: [
      '스타터 모든 기능',
      '월별 상세 운세',
      '적성/직업 분석',
      '5회 분석 가능',
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
    quantity: 10,
    regularPrice: 199900,
    salePrice: 97000,
    perUse: 9700,
    discount: 51,
    extraDiscount: 35,
    features: [
      '스탠다드 모든 기능',
      '대운/세운 심층 분석',
      '인생 타임라인',
      '10회 분석 가능',
    ],
    color: 'from-amber-500 to-orange-600',
    bgGlow: 'from-amber-400/20',
    borderColor: 'border-amber-300 dark:border-amber-700',
    badge: 'BEST',
    popular: false,
  },
];

// VIP 패키지
const vipPackage = {
  name: 'VIP 무제한',
  subtitle: '프로페셔널을 위한',
  quantity: 50,
  regularPrice: 749000,
  salePrice: 399000,
  perUse: 7980,
  discount: 47,
  features: [
    '모든 프리미엄 기능',
    '50회 분석 가능',
    '우선 고객 지원',
    '신규 기능 우선 체험',
    '전문가 1:1 상담 1회',
  ],
};

export default function PricingPage() {
  const [selectedPackage, setSelectedPackage] = useState('standard');

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('ko-KR').format(price);
  };

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="relative overflow-hidden bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 text-white py-20 md:py-28">
        {/* Background Effects */}
        <div className="absolute inset-0">
          <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-purple-500/20 rounded-full blur-[120px]" />
          <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-amber-500/10 rounded-full blur-[120px]" />
          <div className="absolute inset-0 bg-[url('/patterns/grid.svg')] opacity-5" />
        </div>

        <div className="container mx-auto px-4 relative z-10">
          <div className="max-w-4xl mx-auto text-center">
            <Badge className="mb-6 bg-white/10 text-white/90 backdrop-blur-sm border-white/20 px-4 py-1.5">
              <Gem className="mr-2 h-4 w-4 text-amber-400" />
              Premium AI 사주분석
            </Badge>

            <h1 className="text-4xl md:text-6xl font-bold mb-6 leading-tight tracking-tight">
              당신의 운명을 읽는
              <br />
              <span className="bg-gradient-to-r from-amber-200 via-yellow-300 to-amber-200 bg-clip-text text-transparent">
                프리미엄 사주 서비스
              </span>
            </h1>

            <p className="text-lg md:text-xl text-white/70 mb-8 max-w-2xl mx-auto leading-relaxed">
              정통 사주명리학과 최첨단 AI의 완벽한 조화
              <br className="hidden md:block" />
              12페이지 PDF 리포트와 음성 해설을 함께 제공합니다
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
      <section className="py-16 md:py-24 -mt-8">
        <div className="container mx-auto px-4">
          {/* Section Title */}
          <div className="text-center mb-12">
            <h2 className="text-2xl md:text-3xl font-bold mb-3">이용권 선택</h2>
            <p className="text-muted-foreground">필요에 맞는 플랜을 선택하세요</p>
          </div>

          {/* Pricing Cards */}
          <div className="grid md:grid-cols-3 gap-6 max-w-5xl mx-auto mb-12">
            {premiumPackages.map((pkg) => (
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
                  <div className="absolute -top-3 left-1/2 -translate-x-1/2 z-10">
                    <Badge className="bg-gradient-to-r from-violet-500 to-purple-600 text-white border-0 px-3 py-1">
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

                <CardHeader className={`relative ${pkg.popular ? 'pt-8' : 'pt-6'}`}>
                  <div className="mb-2">
                    <span className="text-xs font-medium text-muted-foreground uppercase tracking-wider">
                      {pkg.subtitle}
                    </span>
                  </div>
                  <CardTitle className="text-2xl">{pkg.name}</CardTitle>
                  <CardDescription>{pkg.quantity}회 분석</CardDescription>
                </CardHeader>

                <CardContent className="relative">
                  {/* Price */}
                  <div className="mb-6">
                    <div className="flex items-baseline gap-2">
                      <span className="text-4xl font-bold">₩{formatPrice(pkg.salePrice)}</span>
                    </div>
                    <div className="flex items-center gap-2 mt-1">
                      <span className="text-sm text-muted-foreground line-through">
                        ₩{formatPrice(pkg.regularPrice)}
                      </span>
                      <Badge variant="secondary" className="bg-red-100 text-red-600 dark:bg-red-900/30 dark:text-red-400">
                        {pkg.discount}% 할인
                      </Badge>
                    </div>
                    <p className="text-sm text-muted-foreground mt-2">
                      1회당 ₩{formatPrice(pkg.perUse)}
                      {pkg.extraDiscount && (
                        <span className="text-green-600 dark:text-green-400 ml-1">
                          ({pkg.extraDiscount}% 추가할인)
                        </span>
                      )}
                    </p>
                  </div>

                  {/* Features */}
                  <ul className="space-y-3 mb-6">
                    {pkg.features.map((feature, index) => (
                      <li key={index} className="flex items-center gap-3 text-sm">
                        <div className={`w-5 h-5 rounded-full bg-gradient-to-br ${pkg.color} flex items-center justify-center`}>
                          <Check className="h-3 w-3 text-white" />
                        </div>
                        <span>{feature}</span>
                      </li>
                    ))}
                  </ul>

                  {/* CTA Button */}
                  <Link href="/my/vouchers" className="block">
                    <Button
                      size="lg"
                      className={`w-full ${
                        pkg.popular
                          ? 'bg-gradient-to-r from-violet-500 to-purple-600 hover:from-violet-600 hover:to-purple-700 shadow-lg shadow-violet-500/25'
                          : ''
                      }`}
                      variant={pkg.popular ? 'default' : 'outline'}
                    >
                      구매하기
                      <ChevronRight className="ml-1 h-4 w-4" />
                    </Button>
                  </Link>
                </CardContent>
              </Card>
            ))}
          </div>

          {/* VIP Section */}
          <div className="max-w-4xl mx-auto">
            <Card className="relative overflow-hidden bg-gradient-to-br from-slate-900 to-slate-800 text-white border-0">
              {/* Background Pattern */}
              <div className="absolute inset-0 bg-[url('/patterns/grid.svg')] opacity-5" />
              <div className="absolute top-0 right-0 w-64 h-64 bg-amber-500/10 rounded-full blur-[80px]" />

              <CardContent className="relative p-8 md:p-10">
                <div className="flex flex-col md:flex-row items-center gap-8">
                  {/* Left: Info */}
                  <div className="flex-1 text-center md:text-left">
                    <Badge className="mb-4 bg-gradient-to-r from-amber-400 to-yellow-500 text-slate-900 border-0">
                      <Crown className="mr-1 h-3 w-3" />
                      VIP EXCLUSIVE
                    </Badge>
                    <h3 className="text-2xl md:text-3xl font-bold mb-2">{vipPackage.name}</h3>
                    <p className="text-white/70 mb-4">{vipPackage.subtitle} 최상위 플랜</p>
                    <ul className="space-y-2 text-sm text-white/80">
                      {vipPackage.features.map((feature, index) => (
                        <li key={index} className="flex items-center gap-2">
                          <Zap className="h-4 w-4 text-amber-400" />
                          <span>{feature}</span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  {/* Right: Price & CTA */}
                  <div className="text-center md:text-right">
                    <div className="mb-4">
                      <span className="text-sm text-white/50 line-through">₩{formatPrice(vipPackage.regularPrice)}</span>
                      <div className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-amber-200 to-yellow-400 bg-clip-text text-transparent">
                        ₩{formatPrice(vipPackage.salePrice)}
                      </div>
                      <p className="text-sm text-white/60">1회당 ₩{formatPrice(vipPackage.perUse)}</p>
                    </div>
                    <Link href="/my/vouchers">
                      <Button size="lg" className="bg-gradient-to-r from-amber-400 to-yellow-500 text-slate-900 hover:from-amber-500 hover:to-yellow-600 font-semibold px-8">
                        VIP 시작하기
                        <ArrowRight className="ml-2 h-4 w-4" />
                      </Button>
                    </Link>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-16 bg-muted/30">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-2xl md:text-3xl font-bold mb-3">프리미엄 분석에 포함된 내용</h2>
            <p className="text-muted-foreground">모든 플랜에서 제공되는 핵심 기능</p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 max-w-5xl mx-auto">
            <Card className="text-center p-6 hover:shadow-lg transition-shadow">
              <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center mx-auto mb-4">
                <FileText className="h-7 w-7 text-white" />
              </div>
              <h3 className="font-semibold mb-2">12페이지 PDF</h3>
              <p className="text-sm text-muted-foreground">
                상세한 사주 분석 리포트를 PDF로 다운로드
              </p>
            </Card>

            <Card className="text-center p-6 hover:shadow-lg transition-shadow">
              <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-purple-500 to-pink-600 flex items-center justify-center mx-auto mb-4">
                <Volume2 className="h-7 w-7 text-white" />
              </div>
              <h3 className="font-semibold mb-2">음성 해설</h3>
              <p className="text-sm text-muted-foreground">
                8분 분량의 음성 해설 MP3 파일 제공
              </p>
            </Card>

            <Card className="text-center p-6 hover:shadow-lg transition-shadow">
              <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-amber-500 to-orange-600 flex items-center justify-center mx-auto mb-4">
                <Star className="h-7 w-7 text-white" />
              </div>
              <h3 className="font-semibold mb-2">운세 분석</h3>
              <p className="text-sm text-muted-foreground">
                2025년 총운 및 월별 상세 운세 제공
              </p>
            </Card>

            <Card className="text-center p-6 hover:shadow-lg transition-shadow">
              <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-emerald-500 to-teal-600 flex items-center justify-center mx-auto mb-4">
                <Users className="h-7 w-7 text-white" />
              </div>
              <h3 className="font-semibold mb-2">성격/적성</h3>
              <p className="text-sm text-muted-foreground">
                타고난 성격, 적성, 재능 심층 분석
              </p>
            </Card>
          </div>
        </div>
      </section>

      {/* Gift Section */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto">
            <Card className="relative overflow-hidden bg-gradient-to-r from-pink-50 via-purple-50 to-indigo-50 dark:from-pink-950/30 dark:via-purple-950/30 dark:to-indigo-950/30 border-pink-200/50 dark:border-pink-800/30">
              <div className="absolute top-0 right-0 w-48 h-48 bg-gradient-to-br from-pink-200/50 to-purple-200/50 dark:from-pink-500/10 dark:to-purple-500/10 rounded-full blur-[60px]" />
              <CardContent className="relative p-8">
                <div className="flex flex-col md:flex-row items-center gap-6">
                  <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-pink-500 to-rose-600 flex items-center justify-center shadow-lg shadow-pink-500/25">
                    <Gift className="h-10 w-10 text-white" />
                  </div>
                  <div className="flex-1 text-center md:text-left">
                    <h3 className="text-xl font-bold mb-2">소중한 분께 선물하세요</h3>
                    <p className="text-muted-foreground">
                      이용권 구매 후 링크로 간편하게 전달! 받는 분이 직접 사주 정보를 입력하여 분석받을 수 있습니다.
                    </p>
                  </div>
                  <Link href="/my/vouchers">
                    <Button variant="outline" size="lg" className="shrink-0 border-pink-300 text-pink-600 hover:bg-pink-50 dark:border-pink-700 dark:text-pink-400">
                      선물하기
                      <ArrowRight className="ml-2 h-4 w-4" />
                    </Button>
                  </Link>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Trust Section */}
      <section className="py-16 bg-muted/30">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto">
            <Card className="bg-gradient-to-br from-amber-50 to-yellow-50 dark:from-amber-950/20 dark:to-yellow-950/20 border-amber-200/50 dark:border-amber-800/30">
              <CardContent className="p-6">
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-amber-400 to-yellow-500 flex items-center justify-center shrink-0">
                    <Shield className="h-6 w-6 text-white" />
                  </div>
                  <div>
                    <h4 className="font-semibold mb-2">안심하고 결제하세요</h4>
                    <ul className="space-y-1 text-sm text-muted-foreground">
                      <li className="flex items-center gap-2">
                        <Check className="h-4 w-4 text-green-500" />
                        모든 이용권은 구매일로부터 1년간 유효
                      </li>
                      <li className="flex items-center gap-2">
                        <Check className="h-4 w-4 text-green-500" />
                        미사용 이용권 환불 가능
                      </li>
                      <li className="flex items-center gap-2">
                        <Check className="h-4 w-4 text-green-500" />
                        토스페이, 카카오페이, 신용카드 등 다양한 결제 수단
                      </li>
                    </ul>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Final CTA */}
      <section className="py-20">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-2xl md:text-3xl font-bold mb-4">지금 바로 시작하세요</h2>
          <p className="text-muted-foreground mb-8 max-w-xl mx-auto">
            AI가 분석하는 정확한 사주풀이, 지금 50% 할인된 가격으로 만나보세요
          </p>
          <Link href="/my/vouchers">
            <Button size="lg" className="px-10 bg-gradient-to-r from-violet-500 to-purple-600 hover:from-violet-600 hover:to-purple-700 shadow-lg shadow-violet-500/25">
              이용권 구매하기
              <ArrowRight className="ml-2 h-5 w-5" />
            </Button>
          </Link>
        </div>
      </section>
    </div>
  );
}
