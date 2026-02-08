'use client';

import { useTranslations } from 'next-intl';
import { Link } from '@/i18n/routing';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';
import {
  Sparkles,
  Star,
  Heart,
  Users,
  Moon,
  Zap,
  ArrowRight,
  CheckCircle,
  Crown,
  TrendingUp,
  Calendar,
  Eye,
} from 'lucide-react';

const fortuneServices = [
  {
    key: 'saju',
    icon: Zap,
    gradient: 'from-amber-500 to-orange-600',
    shadowColor: 'shadow-amber-500/25',
    href: '/fortune/saju',
  },
  {
    key: 'zodiac',
    icon: Star,
    gradient: 'from-indigo-500 to-purple-600',
    shadowColor: 'shadow-indigo-500/25',
    href: '/fortune/zodiac',
  },
  {
    key: 'face',
    icon: Eye,
    gradient: 'from-purple-500 to-indigo-600',
    shadowColor: 'shadow-purple-500/25',
    href: '/fortune/face',
  },
  {
    key: 'daily',
    icon: Calendar,
    gradient: 'from-emerald-500 to-teal-600',
    shadowColor: 'shadow-emerald-500/25',
    href: '/fortune/free',
  },
  {
    key: 'tarot',
    icon: Moon,
    gradient: 'from-violet-500 to-purple-600',
    shadowColor: 'shadow-violet-500/25',
    href: '/fortune/tarot',
  },
  {
    key: 'compatibility',
    icon: Heart,
    gradient: 'from-rose-500 to-pink-600',
    shadowColor: 'shadow-rose-500/25',
    href: '/fortune/compatibility',
  },
];

const premiumFeatures = [
  { text: '상세 분석 리포트', icon: TrendingUp },
  { text: 'PDF 다운로드', icon: ArrowRight },
  { text: '음성 나레이션', icon: Sparkles },
  { text: '월별 운세 예측', icon: Calendar },
  { text: '전문가 1:1 상담', icon: Users },
];

export default function FortunePage() {
  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="relative overflow-hidden">
        {/* Background */}
        <div className="absolute inset-0 fortune-gradient" />
        <div className="absolute inset-0 bg-gradient-to-b from-black/10 via-transparent to-black/20" />

        {/* Decorative Elements */}
        <div className="absolute top-20 left-10 w-20 h-20 bg-white/10 rounded-full blur-2xl animate-pulse" />
        <div className="absolute bottom-20 right-10 w-32 h-32 bg-white/10 rounded-full blur-3xl animate-pulse delay-700" />
        <div className="absolute top-1/2 left-1/4 w-16 h-16 bg-yellow-300/20 rounded-full blur-xl animate-zodiac" />

        <div className="relative container mx-auto px-4 py-20 md:py-28">
          <div className="max-w-4xl mx-auto text-center">
            {/* Badge */}
            <Badge className="mb-6 px-4 py-2 bg-white/20 backdrop-blur-sm text-white border-white/30 text-sm">
              <Sparkles className="mr-2 h-4 w-4" />
              AI 운세 분석 서비스
            </Badge>

            {/* Title */}
            <h1 className="text-4xl md:text-6xl font-bold text-white mb-6 leading-tight">
              당신의 운명을
              <br />
              <span className="text-yellow-200">AI가 분석합니다</span>
            </h1>

            {/* Subtitle */}
            <p className="text-xl md:text-2xl text-white/90 mb-10 max-w-2xl mx-auto">
              사주, 관상, 타로까지 - 첨단 AI 기술로
              <br className="hidden md:block" />
              정확한 운세 분석을 경험하세요
            </p>

            {/* CTA Buttons */}
            <div className="flex flex-wrap justify-center gap-4">
              <Link href="/fortune/saju">
                <Button
                  size="lg"
                  className="h-14 px-8 text-lg bg-white text-amber-700 hover:bg-white/95 shadow-xl shadow-black/20"
                >
                  <Zap className="mr-2 h-5 w-5" />
                  무료 사주 보기
                </Button>
              </Link>
              <Link href="/fortune/free">
                <Button
                  size="lg"
                  variant="outline"
                  className="h-14 px-8 text-lg border-2 border-white/50 text-white bg-white/10 hover:bg-white/20 backdrop-blur-sm"
                >
                  오늘의 운세
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Button>
              </Link>
            </div>

            {/* Stats */}
            <div className="mt-16 grid grid-cols-3 gap-8 max-w-lg mx-auto">
              {[
                { value: '150만+', label: '분석 완료' },
                { value: '98%', label: '만족도' },
                { value: '24시간', label: '언제든지' },
              ].map((stat, i) => (
                <div key={i} className="text-center">
                  <div className="text-2xl md:text-3xl font-bold text-white">{stat.value}</div>
                  <div className="text-sm text-white/70">{stat.label}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Services Grid */}
      <section className="container mx-auto px-4 py-20">
        <div className="text-center mb-16">
          <Badge className="mb-4" variant="outline">
            <Star className="mr-1 h-3 w-3 text-amber-500" />
            운세 서비스
          </Badge>
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            다양한 AI 운세 서비스
          </h2>
          <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
            사주팔자부터 타로까지, AI가 분석하는 정확한 운세를 만나보세요
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {fortuneServices.map((service) => {
            const Icon = service.icon;
            return (
              <Link key={service.key} href={service.href}>
                <Card
                  className={cn(
                    'relative h-full cursor-pointer overflow-hidden group',
                    'fortune-service-card border-0 shadow-lg',
                    'bg-gradient-to-br from-card via-card to-muted/30'
                  )}
                >
                  {/* 이미지 배경 영역 - 이미지 업로드 시 이 영역에 이미지가 표시됨 */}
                  <div className="relative h-48 bg-gradient-to-br from-gray-100 to-gray-200 dark:from-gray-800 dark:to-gray-900 overflow-hidden">
                    {/* 기본 아이콘 (이미지 없을 때) */}
                    <div className="absolute inset-0 flex items-center justify-center">
                      <div
                        className={cn(
                          'w-20 h-20 rounded-full flex items-center justify-center',
                          'bg-gradient-to-br shadow-lg',
                          'group-hover:scale-110 transition-transform',
                          service.gradient,
                          service.shadowColor
                        )}
                      >
                        <Icon className="h-10 w-10 text-white" />
                      </div>
                    </div>
                  </div>

                  <CardContent className="p-4">
                    {/* Button */}
                    <Button
                      variant="ghost"
                      className="w-full justify-between group hover:bg-primary/5"
                    >
                      <span>시작하기</span>
                      <ArrowRight className="h-4 w-4 group-hover:translate-x-1 transition-transform" />
                    </Button>
                  </CardContent>

                  {/* Background Decoration */}
                  <div
                    className={cn(
                      'absolute -bottom-10 -right-10 w-32 h-32 rounded-full opacity-10',
                      'bg-gradient-to-br',
                      service.gradient
                    )}
                  />
                </Card>
              </Link>
            );
          })}
        </div>
      </section>

      {/* Premium Section */}
      <section className="bg-muted/30 py-20">
        <div className="container mx-auto px-4">
          <Card className="relative overflow-hidden border-0 shadow-2xl">
            <div className="grid lg:grid-cols-2">
              {/* Left - Info */}
              <div className="relative p-8 md:p-12 fortune-gradient">
                <div className="absolute inset-0 bg-gradient-to-br from-black/10 to-black/30" />
                <div className="relative z-10">
                  <Badge className="mb-6 bg-white/20 text-white border-white/30">
                    <Crown className="mr-1 h-3 w-3" />
                    프리미엄
                  </Badge>

                  <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
                    더 깊은 통찰이
                    <br />
                    필요하신가요?
                  </h2>

                  <p className="text-white/80 text-lg mb-8">
                    프리미엄 멤버십으로 전문적인 운세 분석과
                    <br />
                    1:1 전문가 상담을 받아보세요
                  </p>

                  <ul className="space-y-4 mb-8">
                    {premiumFeatures.map((feature, index) => (
                      <li key={index} className="flex items-center gap-3 text-white">
                        <div className="w-8 h-8 rounded-lg bg-white/20 flex items-center justify-center">
                          <feature.icon className="h-4 w-4" />
                        </div>
                        <span>{feature.text}</span>
                      </li>
                    ))}
                  </ul>

                  <Link href="/pricing">
                    <Button
                      size="lg"
                      className="bg-white text-amber-700 hover:bg-white/95 shadow-lg"
                    >
                      프리미엄 시작하기
                      <ArrowRight className="ml-2 h-4 w-4" />
                    </Button>
                  </Link>
                </div>
              </div>

              {/* Right - Pricing */}
              <CardContent className="p-8 md:p-12 flex flex-col justify-center bg-gradient-to-br from-amber-50/50 to-orange-50/50 dark:from-amber-950/20 dark:to-orange-950/20">
                <div className="text-center">
                  <p className="text-muted-foreground mb-2">시작 가격</p>
                  <div className="mb-6">
                    <span className="text-5xl md:text-6xl font-bold bg-gradient-to-r from-amber-600 to-orange-600 bg-clip-text text-transparent">
                      ₩4,900
                    </span>
                    <span className="text-muted-foreground text-lg"> / 월</span>
                  </div>

                  <ul className="space-y-3 mb-8 text-left max-w-xs mx-auto">
                    {['무제한 운세 분석', '상세 리포트 제공', 'PDF 다운로드', '광고 없음'].map(
                      (item, i) => (
                        <li key={i} className="flex items-center gap-2 text-sm">
                          <CheckCircle className="h-4 w-4 text-emerald-500" />
                          <span>{item}</span>
                        </li>
                      )
                    )}
                  </ul>

                  <Link href="/pricing">
                    <Button
                      size="lg"
                      className="w-full bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600 text-white shadow-lg shadow-amber-500/25"
                    >
                      요금제 보기
                    </Button>
                  </Link>

                  <p className="text-xs text-muted-foreground mt-4">
                    언제든지 취소 가능 • 7일 무료 체험
                  </p>
                </div>
              </CardContent>
            </div>
          </Card>
        </div>
      </section>

      {/* Daily Fortune Preview */}
      <section className="container mx-auto px-4 py-20">
        <div className="text-center mb-12">
          <Badge className="mb-4" variant="outline">
            <Calendar className="mr-1 h-3 w-3 text-amber-500" />
            오늘의 운세
          </Badge>
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            지금 바로 확인하세요
          </h2>
          <p className="text-muted-foreground text-lg">
            매일 업데이트되는 맞춤 운세를 무료로 확인해보세요
          </p>
        </div>

        <Card className="max-w-xl mx-auto border-0 shadow-xl overflow-hidden">
          <CardContent className="p-0">
            {/* Header */}
            <div className="fortune-gradient p-6 text-center">
              <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-white/20 backdrop-blur-sm flex items-center justify-center">
                <Sparkles className="h-8 w-8 text-white" />
              </div>
              <h3 className="text-xl font-bold text-white mb-1">오늘의 종합 운세</h3>
              <p className="text-white/80 text-sm">
                {new Date().toLocaleDateString('ko-KR', {
                  year: 'numeric',
                  month: 'long',
                  day: 'numeric',
                })}
              </p>
            </div>

            {/* Scores */}
            <div className="p-6">
              <div className="grid grid-cols-2 gap-4 mb-6">
                {[
                  { label: '종합운', score: 85, color: 'text-amber-500' },
                  { label: '금전운', score: 92, color: 'text-emerald-500' },
                  { label: '애정운', score: 78, color: 'text-rose-500' },
                  { label: '건강운', score: 88, color: 'text-blue-500' },
                ].map((item, i) => (
                  <div
                    key={i}
                    className="text-center p-4 rounded-xl bg-muted/50 hover:bg-muted transition-colors"
                  >
                    <div className={cn('text-3xl font-bold mb-1', item.color)}>
                      {item.score}
                    </div>
                    <div className="text-sm text-muted-foreground">{item.label}</div>
                  </div>
                ))}
              </div>

              <Link href="/fortune/free">
                <Button
                  size="lg"
                  className="w-full bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600 text-white shadow-lg shadow-amber-500/25"
                >
                  상세 운세 확인하기
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </Link>
            </div>
          </CardContent>
        </Card>
      </section>
    </div>
  );
}
