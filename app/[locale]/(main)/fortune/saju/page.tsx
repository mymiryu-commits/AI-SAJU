'use client';

import { useState, useEffect } from 'react';
import { useTranslations } from 'next-intl';
import { Link } from '@/i18n/routing';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import {
  Sparkles,
  Sun,
  Crown,
  MessageCircle,
  Heart,
  Flower2,
  Ticket,
  QrCode,
  ArrowRight,
  CheckCircle,
  Gift,
  Lock,
  Clock,
  Star,
  Coins,
  Activity,
  Briefcase,
  Calendar,
  TrendingUp,
  Zap,
  Users,
  Timer,
  ChevronRight,
} from 'lucide-react';

// 오늘의 운세 생성
function generateDailyFortune(date: Date) {
  const seed = date.getFullYear() * 10000 + (date.getMonth() + 1) * 100 + date.getDate();
  const random = (min: number, max: number) => {
    const x = Math.sin(seed * 9999) * 10000;
    return Math.floor((x - Math.floor(x)) * (max - min + 1)) + min;
  };

  return {
    overall: random(60, 95),
    wealth: random(55, 98),
    love: random(50, 95),
    career: random(60, 95),
    health: random(55, 90),
    luckyTime: `${random(9, 18)}:00`,
    luckyColor: ['보라', '파랑', '초록', '빨강', '노랑', '주황'][random(0, 5)],
    luckyNumber: random(1, 45),
    message: [
      '오늘은 새로운 시작에 좋은 날입니다. 직감을 믿으세요.',
      '인간관계에 집중하세요. 좋은 대화가 기회를 가져옵니다.',
      '오늘의 재정 결정은 장기적인 영향을 미칩니다.',
      '자기 관리에 시간을 투자하세요. 건강이 재산입니다.',
      '창의적인 활동이 예상치 못한 보상을 가져옵니다.',
      '다른 사람들에게 인내심을 가지세요. 친절은 열 배로 돌아옵니다.',
    ][random(0, 5)],
  };
}

// 서비스 정의
const services = [
  {
    id: 'daily-fortune',
    title: '오늘의 운세',
    description: '매일 무료로 확인하는 나의 오늘 운세',
    icon: Sun,
    gradient: 'from-amber-400 via-orange-400 to-yellow-500',
    bgGradient: 'from-amber-50 to-orange-50 dark:from-amber-950/30 dark:to-orange-950/30',
    borderColor: 'border-amber-200 dark:border-amber-800',
    href: '/fortune/free',
    badge: { text: '무료', variant: 'free' as const },
    features: ['매일 갱신', '출석 체크인', '행운의 아이템'],
  },
  {
    id: 'saju-analysis',
    title: '사주분석',
    description: '정통 사주명리학 기반 AI 종합 분석',
    icon: Crown,
    gradient: 'from-purple-500 via-violet-500 to-indigo-600',
    bgGradient: 'from-purple-50 to-indigo-50 dark:from-purple-950/30 dark:to-indigo-950/30',
    borderColor: 'border-purple-200 dark:border-purple-800',
    href: '/fortune/integrated',
    badge: { text: '프리미엄', variant: 'premium' as const },
    features: ['사주팔자 분석', '대운/세운 해석', 'PDF 리포트'],
  },
  {
    id: 'ai-consultation',
    title: 'AI 사주 상담',
    description: '사주분석 기반 1:1 AI 상담 서비스',
    icon: MessageCircle,
    gradient: 'from-cyan-400 via-blue-500 to-indigo-500',
    bgGradient: 'from-cyan-50 to-blue-50 dark:from-cyan-950/30 dark:to-blue-950/30',
    borderColor: 'border-cyan-200 dark:border-cyan-800',
    href: '/fortune/experts',
    badge: { text: '사주분석 필요', variant: 'required' as const },
    features: ['실시간 AI 상담', '맞춤형 조언', '무제한 질문'],
    requiresPremium: true,
  },
  {
    id: 'compatibility',
    title: '궁합분석',
    description: '두 사람의 사주로 보는 궁합 분석',
    icon: Heart,
    gradient: 'from-pink-400 via-rose-500 to-red-500',
    bgGradient: 'from-pink-50 to-rose-50 dark:from-pink-950/30 dark:to-rose-950/30',
    borderColor: 'border-pink-200 dark:border-pink-800',
    href: '/fortune/compatibility',
    badge: { text: '준비 중', variant: 'coming' as const },
    features: ['연인 궁합', '사업 파트너', '가족 관계'],
    comingSoon: true,
  },
  {
    id: 'tarot',
    title: '타로',
    description: 'AI 타로 카드 리딩',
    icon: Flower2,
    gradient: 'from-fuchsia-400 via-purple-500 to-violet-600',
    bgGradient: 'from-fuchsia-50 to-violet-50 dark:from-fuchsia-950/30 dark:to-violet-950/30',
    borderColor: 'border-fuchsia-200 dark:border-fuchsia-800',
    href: '/fortune/tarot',
    badge: { text: '베타', variant: 'beta' as const },
    features: ['원카드', '쓰리카드', '켈틱크로스'],
  },
  {
    id: 'lotto',
    title: '로또',
    description: 'AI 로또 번호 분석 및 생성',
    icon: Ticket,
    gradient: 'from-emerald-400 via-green-500 to-teal-500',
    bgGradient: 'from-emerald-50 to-teal-50 dark:from-emerald-950/30 dark:to-teal-950/30',
    borderColor: 'border-emerald-200 dark:border-emerald-800',
    href: '/lotto',
    badge: null,
    features: ['통계 분석', '번호 생성', '당첨 확인'],
  },
  {
    id: 'qr-generator',
    title: 'QR 코드',
    description: 'AI 기반 QR 코드 생성 서비스',
    icon: QrCode,
    gradient: 'from-slate-400 via-gray-500 to-zinc-600',
    bgGradient: 'from-slate-50 to-zinc-50 dark:from-slate-950/30 dark:to-zinc-950/30',
    borderColor: 'border-slate-200 dark:border-slate-800',
    href: '/qr',
    badge: { text: '준비 중', variant: 'coming' as const },
    features: ['URL QR 생성', '디자인 커스텀', '다운로드'],
    comingSoon: true,
  },
];

// 배지 스타일
const badgeStyles = {
  free: 'bg-gradient-to-r from-emerald-500 to-green-500 text-white border-0',
  premium: 'bg-gradient-to-r from-amber-500 to-yellow-500 text-white border-0',
  required: 'bg-gradient-to-r from-blue-500 to-cyan-500 text-white border-0',
  coming: 'bg-gradient-to-r from-gray-400 to-slate-500 text-white border-0',
  beta: 'bg-gradient-to-r from-violet-500 to-purple-500 text-white border-0',
};

export default function SajuPage() {
  const t = useTranslations('fortune');
  const [fortune, setFortune] = useState<ReturnType<typeof generateDailyFortune> | null>(null);
  const [checkedIn, setCheckedIn] = useState(false);
  const [streak, setStreak] = useState(0);
  const [currentTime, setCurrentTime] = useState(new Date());

  useEffect(() => {
    setFortune(generateDailyFortune(new Date()));
    const lastCheckin = localStorage.getItem('lastCheckin');
    const today = new Date().toDateString();
    if (lastCheckin === today) {
      setCheckedIn(true);
      setStreak(parseInt(localStorage.getItem('streak') || '1', 10));
    }
  }, []);

  useEffect(() => {
    const timer = setInterval(() => setCurrentTime(new Date()), 60000);
    return () => clearInterval(timer);
  }, []);

  const handleCheckin = () => {
    const today = new Date().toDateString();
    const lastCheckin = localStorage.getItem('lastCheckin');
    const yesterday = new Date(Date.now() - 86400000).toDateString();

    let newStreak = 1;
    if (lastCheckin === yesterday) {
      newStreak = parseInt(localStorage.getItem('streak') || '0', 10) + 1;
    }

    localStorage.setItem('lastCheckin', today);
    localStorage.setItem('streak', newStreak.toString());
    setCheckedIn(true);
    setStreak(newStreak);
  };

  const scoreItems = [
    { key: '총운', icon: Star, score: fortune?.overall || 0, color: 'text-purple-500', bg: 'bg-purple-100 dark:bg-purple-900/30' },
    { key: '재물운', icon: Coins, score: fortune?.wealth || 0, color: 'text-yellow-500', bg: 'bg-yellow-100 dark:bg-yellow-900/30' },
    { key: '애정운', icon: Heart, score: fortune?.love || 0, color: 'text-pink-500', bg: 'bg-pink-100 dark:bg-pink-900/30' },
    { key: '직장운', icon: Briefcase, score: fortune?.career || 0, color: 'text-blue-500', bg: 'bg-blue-100 dark:bg-blue-900/30' },
  ];

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="relative overflow-hidden bg-gradient-to-br from-violet-600 via-purple-600 to-indigo-700 text-white">
        <div className="absolute inset-0">
          <div className="absolute inset-0 bg-[url('/grid.svg')] opacity-10" />
          <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-white/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2" />
          <div className="absolute bottom-0 left-0 w-[400px] h-[400px] bg-pink-500/20 rounded-full blur-3xl translate-y-1/2 -translate-x-1/2" />
          <div className="absolute top-1/2 left-1/2 w-[300px] h-[300px] bg-blue-500/10 rounded-full blur-3xl -translate-x-1/2 -translate-y-1/2" />
        </div>

        <div className="container mx-auto px-4 py-16 md:py-24 relative z-10">
          <div className="max-w-4xl mx-auto text-center">
            <Badge className="mb-6 bg-white/20 text-white hover:bg-white/30 backdrop-blur-sm border-0 px-4 py-1.5">
              <Sparkles className="mr-2 h-4 w-4" />
              AI 사주 · 운세 서비스
            </Badge>

            <h1 className="text-4xl md:text-6xl font-bold mb-6 leading-tight">
              <span className="bg-clip-text text-transparent bg-gradient-to-r from-white via-purple-100 to-white">
                당신의 운명을
              </span>
              <br />
              <span className="bg-clip-text text-transparent bg-gradient-to-r from-amber-200 via-yellow-300 to-amber-200">
                AI가 읽어드립니다
              </span>
            </h1>

            <p className="text-xl md:text-2xl text-white/80 mb-10 max-w-2xl mx-auto leading-relaxed">
              정통 사주명리학과 최첨단 AI의 만남<br className="hidden md:block" />
              <span className="text-amber-300 font-medium">매일 무료 운세</span>부터 <span className="text-purple-200 font-medium">프리미엄 사주분석</span>까지
            </p>

            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
              <Link href="/fortune/free">
                <Button size="lg" className="bg-white text-purple-700 hover:bg-white/90 shadow-xl shadow-purple-900/30 px-8 py-6 text-lg font-semibold group">
                  <Sun className="mr-2 h-5 w-5 text-amber-500" />
                  오늘의 운세 보기
                  <ArrowRight className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform" />
                </Button>
              </Link>
              <Link href="/fortune/integrated">
                <Button size="lg" variant="outline" className="border-2 border-white/50 text-white hover:bg-white/10 backdrop-blur-sm px-8 py-6 text-lg font-semibold">
                  <Crown className="mr-2 h-5 w-5 text-amber-300" />
                  사주분석 시작
                </Button>
              </Link>
            </div>

            {/* Stats */}
            <div className="mt-12 grid grid-cols-3 gap-8 max-w-lg mx-auto">
              <div className="text-center">
                <div className="text-3xl font-bold text-amber-300">50만+</div>
                <div className="text-sm text-white/60 mt-1">누적 분석</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-amber-300">4.9</div>
                <div className="text-sm text-white/60 mt-1">만족도</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-amber-300">99%</div>
                <div className="text-sm text-white/60 mt-1">정확도</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Today's Fortune Preview - Free */}
      <section className="container mx-auto px-4 -mt-8 relative z-20">
        <Card className="max-w-4xl mx-auto shadow-2xl border-0 overflow-hidden">
          <div className="bg-gradient-to-r from-amber-500 via-orange-500 to-yellow-500 p-6 text-white">
            <div className="flex flex-col md:flex-row items-center justify-between gap-4">
              <div className="flex items-center gap-4">
                <div className="w-14 h-14 rounded-2xl bg-white/20 backdrop-blur-sm flex items-center justify-center">
                  <Sun className="h-8 w-8" />
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <h2 className="text-xl font-bold">오늘의 운세</h2>
                    <Badge className="bg-white/20 text-white border-0 text-xs">무료</Badge>
                  </div>
                  <p className="text-white/80 text-sm flex items-center gap-2">
                    <Calendar className="h-4 w-4" />
                    {currentTime.toLocaleDateString('ko-KR', { year: 'numeric', month: 'long', day: 'numeric', weekday: 'long' })}
                  </p>
                </div>
              </div>

              {checkedIn ? (
                <div className="flex items-center gap-3">
                  <div className="flex items-center gap-2 bg-white/20 rounded-full px-4 py-2">
                    <CheckCircle className="h-5 w-5" />
                    <span className="font-medium">{streak}일 연속 출석</span>
                  </div>
                </div>
              ) : (
                <Button
                  onClick={handleCheckin}
                  className="bg-white text-orange-600 hover:bg-white/90 font-semibold shadow-lg"
                >
                  <Gift className="mr-2 h-4 w-4" />
                  출석 체크하기
                </Button>
              )}
            </div>

            {/* Streak Bar */}
            <div className="mt-4 flex gap-1">
              {Array.from({ length: 7 }).map((_, i) => (
                <div
                  key={i}
                  className={`flex-1 h-2 rounded-full transition-all ${
                    i < streak ? 'bg-white' : 'bg-white/30'
                  }`}
                />
              ))}
            </div>
            <p className="text-xs text-white/60 mt-2">7일 연속 출석 시 보너스 혜택!</p>
          </div>

          <CardContent className="p-6">
            {fortune && (
              <>
                {/* Score Grid */}
                <div className="grid grid-cols-4 gap-3 mb-6">
                  {scoreItems.map((item) => {
                    const Icon = item.icon;
                    return (
                      <div key={item.key} className={`text-center p-4 rounded-xl ${item.bg}`}>
                        <Icon className={`h-5 w-5 mx-auto mb-2 ${item.color}`} />
                        <div className="text-2xl font-bold">{item.score}</div>
                        <div className="text-xs text-muted-foreground">{item.key}</div>
                      </div>
                    );
                  })}
                </div>

                {/* Today's Message */}
                <div className="p-4 rounded-xl bg-gradient-to-r from-purple-50 to-pink-50 dark:from-purple-950/30 dark:to-pink-950/30 border border-purple-100 dark:border-purple-800">
                  <p className="text-sm text-purple-800 dark:text-purple-200 flex items-start gap-2">
                    <Sparkles className="h-4 w-4 mt-0.5 flex-shrink-0" />
                    <span>{fortune.message}</span>
                  </p>
                </div>

                {/* Lucky Items */}
                <div className="mt-4 flex flex-wrap gap-3 justify-center">
                  <div className="flex items-center gap-2 px-4 py-2 rounded-full bg-muted text-sm">
                    <Clock className="h-4 w-4 text-primary" />
                    행운의 시간: <span className="font-semibold">{fortune.luckyTime}</span>
                  </div>
                  <div className="flex items-center gap-2 px-4 py-2 rounded-full bg-muted text-sm">
                    <Star className="h-4 w-4 text-amber-500" />
                    행운의 색: <span className="font-semibold">{fortune.luckyColor}</span>
                  </div>
                  <div className="flex items-center gap-2 px-4 py-2 rounded-full bg-muted text-sm">
                    <Zap className="h-4 w-4 text-yellow-500" />
                    행운의 숫자: <span className="font-semibold">{fortune.luckyNumber}</span>
                  </div>
                </div>

                <div className="mt-6 text-center">
                  <Link href="/fortune/free">
                    <Button variant="outline" className="group">
                      상세 운세 보기
                      <ChevronRight className="ml-1 h-4 w-4 group-hover:translate-x-1 transition-transform" />
                    </Button>
                  </Link>
                </div>
              </>
            )}
          </CardContent>
        </Card>
      </section>

      {/* Services Grid */}
      <section className="container mx-auto px-4 py-16 md:py-24">
        <div className="text-center mb-12">
          <Badge className="mb-4 bg-purple-100 text-purple-700 dark:bg-purple-900 dark:text-purple-300">
            <Sparkles className="mr-1 h-3 w-3" />
            AI 운세 서비스
          </Badge>
          <h2 className="text-3xl md:text-4xl font-bold mb-4">모든 운세 서비스</h2>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            전통 동양 철학과 현대 AI 기술이 만나 당신의 운명을 해석합니다
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 max-w-7xl mx-auto">
          {services.map((service) => {
            const Icon = service.icon;
            const isDisabled = service.comingSoon;

            return (
              <Link
                key={service.id}
                href={isDisabled ? '#' : service.href}
                className={isDisabled ? 'pointer-events-none' : ''}
              >
                <Card className={`h-full cursor-pointer transition-all duration-300 hover:shadow-xl hover:-translate-y-1 relative overflow-hidden group ${service.bgGradient} ${service.borderColor} ${isDisabled ? 'opacity-70' : ''}`}>
                  {/* Gradient Overlay on Hover */}
                  <div className={`absolute inset-0 bg-gradient-to-br ${service.gradient} opacity-0 group-hover:opacity-5 transition-opacity`} />

                  {/* Badge */}
                  {service.badge && (
                    <div className="absolute top-4 right-4">
                      <Badge className={badgeStyles[service.badge.variant]}>
                        {service.badge.variant === 'coming' && <Timer className="mr-1 h-3 w-3" />}
                        {service.badge.variant === 'required' && <Lock className="mr-1 h-3 w-3" />}
                        {service.badge.text}
                      </Badge>
                    </div>
                  )}

                  <CardHeader className="pb-2">
                    <div className={`w-14 h-14 rounded-2xl bg-gradient-to-br ${service.gradient} flex items-center justify-center mb-4 shadow-lg`}>
                      <Icon className="h-7 w-7 text-white" />
                    </div>
                    <CardTitle className="text-xl">{service.title}</CardTitle>
                    <CardDescription className="text-sm">
                      {service.description}
                    </CardDescription>
                  </CardHeader>

                  <CardContent>
                    <ul className="space-y-2">
                      {service.features.map((feature, i) => (
                        <li key={i} className="flex items-center gap-2 text-sm text-muted-foreground">
                          <CheckCircle className="h-4 w-4 text-green-500 flex-shrink-0" />
                          {feature}
                        </li>
                      ))}
                    </ul>

                    <div className="mt-4 pt-4 border-t">
                      <Button
                        variant={isDisabled ? 'secondary' : 'outline'}
                        className="w-full group/btn"
                        disabled={isDisabled}
                      >
                        {isDisabled ? '준비 중' : '시작하기'}
                        {!isDisabled && <ArrowRight className="ml-2 h-4 w-4 group-hover/btn:translate-x-1 transition-transform" />}
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              </Link>
            );
          })}
        </div>
      </section>

      {/* Premium CTA */}
      <section className="container mx-auto px-4 pb-16 md:pb-24">
        <Card className="max-w-5xl mx-auto overflow-hidden border-0 shadow-2xl">
          <div className="grid md:grid-cols-2">
            <div className="bg-gradient-to-br from-purple-600 via-violet-600 to-indigo-700 p-8 md:p-12 text-white relative overflow-hidden">
              <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2" />
              <div className="relative z-10">
                <Badge className="mb-4 bg-amber-400 text-amber-900 border-0">
                  <Crown className="mr-1 h-3 w-3" />
                  PREMIUM
                </Badge>
                <h3 className="text-2xl md:text-3xl font-bold mb-4">
                  프리미엄 사주분석으로<br />
                  인생의 흐름을 읽으세요
                </h3>
                <p className="text-white/80 mb-6">
                  정통 사주명리학 기반의 심층 분석으로<br />
                  10년 대운, 월운, 일진까지 상세하게 확인하세요
                </p>
                <ul className="space-y-3 mb-8">
                  {['사주팔자 원국 분석', '대운/세운 10년 해석', '월별 상세 운세', 'PDF 리포트 다운로드', 'AI 1:1 상담 가능'].map((feature, i) => (
                    <li key={i} className="flex items-center gap-2">
                      <CheckCircle className="h-5 w-5 text-amber-300" />
                      <span>{feature}</span>
                    </li>
                  ))}
                </ul>
                <Link href="/fortune/integrated">
                  <Button size="lg" className="bg-white text-purple-700 hover:bg-white/90 shadow-xl">
                    프리미엄 시작하기
                    <ArrowRight className="ml-2 h-5 w-5" />
                  </Button>
                </Link>
              </div>
            </div>

            <div className="p-8 md:p-12 flex flex-col justify-center bg-gradient-to-br from-purple-50 to-indigo-50 dark:from-purple-950/30 dark:to-indigo-950/30">
              <div className="text-center">
                <p className="text-sm text-muted-foreground mb-2">프리미엄 분석</p>
                <div className="mb-4">
                  <span className="text-muted-foreground text-lg line-through">₩29,000</span>
                  <div className="text-5xl font-bold text-purple-600 mt-1">₩14,900</div>
                  <Badge className="mt-2 bg-red-500 text-white border-0">49% 할인</Badge>
                </div>
                <p className="text-sm text-muted-foreground mb-2">
                  첫 분석 특별 가격 · 평생 소장
                </p>
                <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-gradient-to-r from-amber-100 to-yellow-100 dark:from-amber-900/30 dark:to-yellow-900/30 border border-amber-200 dark:border-amber-800 mb-4">
                  <Ticket className="h-4 w-4 text-amber-600" />
                  <span className="text-sm font-medium text-amber-700 dark:text-amber-300">쿠폰 할인 적용 가능</span>
                </div>

                <div className="space-y-3 text-left bg-white dark:bg-gray-900 p-6 rounded-xl shadow-inner">
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">사주분석 리포트</span>
                    <span className="font-medium">포함</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">대운 해석</span>
                    <span className="font-medium">10년치</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">PDF 다운로드</span>
                    <span className="font-medium">무제한</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">AI 상담</span>
                    <span className="font-medium">이용 가능</span>
                  </div>
                </div>

                <Link href="/pricing" className="block mt-6">
                  <Button variant="outline" className="w-full">
                    요금제 비교하기
                  </Button>
                </Link>
              </div>
            </div>
          </div>
        </Card>
      </section>

      {/* Trust Badges */}
      <section className="bg-muted/50 py-12">
        <div className="container mx-auto px-4">
          <div className="flex flex-wrap justify-center items-center gap-8 md:gap-16 text-muted-foreground">
            <div className="flex items-center gap-2">
              <Lock className="h-5 w-5" />
              <span className="text-sm">안전한 결제</span>
            </div>
            <div className="flex items-center gap-2">
              <Users className="h-5 w-5" />
              <span className="text-sm">50만+ 이용자</span>
            </div>
            <div className="flex items-center gap-2">
              <Star className="h-5 w-5" />
              <span className="text-sm">4.9점 만족도</span>
            </div>
            <div className="flex items-center gap-2">
              <CheckCircle className="h-5 w-5" />
              <span className="text-sm">환불 보장</span>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
