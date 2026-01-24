'use client';

import { Link } from '@/i18n/routing';
import { Button } from '@/components/ui/button';
import {
  ArrowRight,
  Sparkles,
  Sun,
  Moon,
  Heart,
  MessageCircle,
  Dices,
  Crown,
  Star,
  Zap,
  Gift,
} from 'lucide-react';
import Image from 'next/image';
import PremiumShowcase from '@/components/home/PremiumShowcase';

// 서비스 카드 데이터
const serviceCards = [
  {
    id: 'daily_fortune',
    title: '오늘의 운세',
    subtitle: '매일 새로운 운세',
    description: '오늘 하루의 운세를 확인하세요',
    href: '/fortune',
    icon: Sun,
    price: '무료',
    priceColor: 'text-green-600',
    gradient: 'from-amber-400 to-orange-500',
    shadowColor: 'shadow-amber-500/20',
  },
  {
    id: 'saju_basic',
    title: '사주 분석',
    subtitle: '기본 사주풀이',
    description: '타고난 운명과 성격을 분석합니다',
    href: '/fortune/saju',
    icon: Star,
    price: '500P',
    priceColor: 'text-blue-600',
    gradient: 'from-blue-400 to-indigo-500',
    shadowColor: 'shadow-blue-500/20',
  },
  {
    id: 'saju_advanced',
    title: '정통 사주',
    subtitle: '심층 분석',
    description: '십신, 신살, 12운성 상세 분석',
    href: '/saju/advanced',
    icon: Moon,
    price: '1,000P',
    priceColor: 'text-purple-600',
    gradient: 'from-purple-400 to-violet-500',
    shadowColor: 'shadow-purple-500/20',
  },
  {
    id: 'ai_chat',
    title: 'AI 사주 상담',
    subtitle: '1:1 맞춤 상담',
    description: 'AI와 대화로 깊은 상담을 받으세요',
    href: '/saju/chat',
    icon: MessageCircle,
    price: '프리미엄',
    priceColor: 'text-rose-600',
    gradient: 'from-rose-400 to-pink-500',
    shadowColor: 'shadow-rose-500/20',
    isPremium: true,
  },
  {
    id: 'compatibility',
    title: '궁합 분석',
    subtitle: '연인/가족 궁합',
    description: '두 사람의 궁합을 확인하세요',
    href: '/fortune/compatibility',
    icon: Heart,
    price: '800P',
    priceColor: 'text-pink-600',
    gradient: 'from-pink-400 to-rose-500',
    shadowColor: 'shadow-pink-500/20',
  },
  {
    id: 'tarot',
    title: '타로 점',
    subtitle: 'AI 타로 리딩',
    description: '카드가 전하는 메시지를 확인하세요',
    href: '/fortune/tarot',
    icon: Sparkles,
    price: '500P',
    priceColor: 'text-violet-600',
    gradient: 'from-violet-400 to-purple-500',
    shadowColor: 'shadow-violet-500/20',
  },
  {
    id: 'lotto',
    title: '로또 분석',
    subtitle: 'AI 번호 추천',
    description: '사주 기반 행운의 번호를 받아보세요',
    href: '/lotto',
    icon: Dices,
    price: '무료',
    priceColor: 'text-green-600',
    gradient: 'from-emerald-400 to-teal-500',
    shadowColor: 'shadow-emerald-500/20',
  },
];

export default function SajuLandingPage() {
  return (
    <div className="min-h-screen bg-background">
      {/* ===== HERO SECTION ===== */}
      <section className="relative min-h-[60vh] flex items-center justify-center overflow-hidden">
        <div className="absolute inset-0 overflow-hidden">
          {/* Gradient Background */}
          <div
            className="absolute inset-0"
            style={{
              background: 'linear-gradient(135deg, #6366f120, #8b5cf615, #a855f710)'
            }}
          />
          {/* Animated Orbs */}
          <div className="absolute top-1/4 left-1/4 w-[400px] h-[400px] bg-gradient-to-br from-purple-300/30 to-indigo-400/20 dark:from-purple-600/15 dark:to-indigo-500/10 rounded-full blur-[100px] animate-pulse" />
          <div className="absolute bottom-1/4 right-1/4 w-[300px] h-[300px] bg-gradient-to-br from-pink-300/25 to-rose-400/20 dark:from-pink-600/10 dark:to-rose-500/10 rounded-full blur-[100px] animate-pulse" style={{ animationDelay: '1s' }} />
        </div>

        <div className="container mx-auto px-4 relative z-10">
          <div className="max-w-4xl mx-auto text-center">
            {/* Badge */}
            <div className="inline-flex items-center gap-2 bg-gradient-to-r from-purple-100 to-pink-100 dark:from-purple-900/40 dark:to-pink-900/40 border border-purple-200/50 dark:border-purple-700/50 rounded-full px-5 py-2 mb-6">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-purple-500 opacity-75" />
                <span className="relative inline-flex rounded-full h-2 w-2 bg-purple-500" />
              </span>
              <span className="text-purple-700 dark:text-purple-300 text-sm font-medium">
                AI-SAJU 운명 분석
              </span>
            </div>

            {/* Main Headline */}
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6 leading-tight">
              <span className="text-foreground">당신의 운명을</span>
              <br />
              <span className="bg-gradient-to-r from-purple-500 via-pink-500 to-rose-500 bg-clip-text text-transparent">
                AI가 분석합니다
              </span>
            </h1>

            {/* Subtitle */}
            <p className="text-lg md:text-xl text-muted-foreground mb-8 max-w-2xl mx-auto leading-relaxed">
              사주, 타로, 궁합 분석부터 AI 상담까지
              <br className="hidden md:block" />
              <span className="text-foreground font-medium">당신만의 운명 이야기</span>를 만나보세요
            </p>

            {/* CTA Buttons */}
            <div className="flex flex-wrap justify-center gap-4">
              <Link href="/fortune/saju">
                <Button
                  size="lg"
                  className="bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white px-8 py-6 text-base font-semibold rounded-xl shadow-xl shadow-purple-500/25 hover:shadow-purple-500/40 transition-all hover:-translate-y-0.5"
                >
                  <Zap className="mr-2 h-5 w-5" />
                  무료 사주 분석
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Button>
              </Link>
              <Link href="/fortune/integrated">
                <Button
                  size="lg"
                  variant="outline"
                  className="px-8 py-6 text-base font-semibold rounded-xl border-2 hover:bg-secondary/50 transition-all hover:-translate-y-0.5"
                >
                  <Crown className="mr-2 h-5 w-5" />
                  프리미엄 통합 분석
                </Button>
              </Link>
            </div>
          </div>
        </div>

        {/* Bottom Fade */}
        <div className="absolute bottom-0 left-0 right-0 h-24 bg-gradient-to-t from-background to-transparent" />
      </section>

      {/* ===== SERVICE CARDS SECTION ===== */}
      <section className="py-16 relative">
        <div className="container mx-auto px-4">
          {/* Section Header */}
          <div className="text-center mb-12">
            <h2 className="text-2xl md:text-3xl font-bold text-foreground mb-3">
              분석 서비스
            </h2>
            <p className="text-muted-foreground">
              원하는 분석을 선택하세요
            </p>
          </div>

          {/* Service Cards Grid */}
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6">
            {serviceCards.map((card, index) => {
              const Icon = card.icon;

              return (
                <Link
                  key={card.id}
                  href={card.href}
                  className="group block"
                >
                  <div
                    className={`bg-card border border-border rounded-2xl overflow-hidden hover:shadow-xl hover:-translate-y-1 transition-all duration-300 h-full ${card.shadowColor}`}
                    style={{ animationDelay: `${index * 50}ms` }}
                  >
                    {/* Card Image Area - 이미지 업로드 시 이 영역에 이미지가 표시됨 */}
                    <div className={`relative h-40 md:h-48 bg-gradient-to-br ${card.gradient} overflow-hidden`}>
                      <div className="absolute inset-0 flex items-center justify-center">
                        <div className="w-16 h-16 md:w-20 md:h-20 rounded-full bg-white/20 backdrop-blur-sm flex items-center justify-center group-hover:scale-110 transition-transform">
                          <Icon className="h-8 w-8 md:h-10 md:w-10 text-white" />
                        </div>
                      </div>
                    </div>

                    {/* Card Button */}
                    <div className="p-3 md:p-4">
                      <Button
                        variant="ghost"
                        className="w-full justify-center group hover:bg-primary/5 text-sm"
                      >
                        <span>시작하기</span>
                        <ArrowRight className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform" />
                      </Button>
                    </div>
                  </div>
                </Link>
              );
            })}
          </div>
        </div>
      </section>

      {/* ===== PREMIUM SECTION ===== */}
      <section className="py-16 relative">
        <div className="container mx-auto px-4">
          <div className="bg-gradient-to-br from-purple-50 via-pink-50 to-rose-50 dark:from-purple-950/40 dark:via-pink-950/30 dark:to-rose-950/20 border border-purple-200/50 dark:border-purple-800/30 rounded-3xl p-8 md:p-12 relative overflow-hidden">
            {/* Background decoration */}
            <div className="absolute top-0 right-0 w-64 h-64 bg-gradient-to-br from-purple-200/40 to-pink-200/30 dark:from-purple-600/10 dark:to-pink-600/10 rounded-full blur-[80px]" />
            <div className="absolute bottom-0 left-0 w-48 h-48 bg-gradient-to-br from-rose-200/40 to-orange-200/30 dark:from-rose-600/10 dark:to-orange-600/10 rounded-full blur-[80px]" />

            <div className="relative z-10 flex flex-col md:flex-row items-center justify-between gap-8">
              <div className="text-center md:text-left">
                <div className="inline-flex items-center gap-2 bg-gradient-to-r from-amber-400 to-orange-500 text-white rounded-full px-4 py-2 mb-4">
                  <Crown className="h-4 w-4" />
                  <span className="text-sm font-bold">PREMIUM</span>
                </div>
                <h2 className="text-2xl md:text-3xl font-bold text-foreground mb-3">
                  프리미엄 통합 분석
                </h2>
                <p className="text-muted-foreground max-w-md mb-4">
                  사주, 궁합, 타로, AI 상담을 한 번에!
                  <br />
                  <span className="font-medium text-foreground">월 9,900원</span>으로 무제한 이용하세요.
                </p>
                <ul className="text-sm text-muted-foreground space-y-2 mb-6">
                  <li className="flex items-center gap-2">
                    <span className="text-green-500">✓</span> 모든 분석 무제한
                  </li>
                  <li className="flex items-center gap-2">
                    <span className="text-green-500">✓</span> AI 사주 상담 이용 가능
                  </li>
                  <li className="flex items-center gap-2">
                    <span className="text-green-500">✓</span> PDF/음성 리포트 무료
                  </li>
                </ul>
              </div>
              <div className="flex flex-col gap-3">
                <Link href="/pricing">
                  <Button
                    size="lg"
                    className="bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white px-8 py-6 text-base font-semibold rounded-xl shadow-xl shadow-purple-500/25 hover:shadow-purple-500/40 transition-all hover:-translate-y-0.5"
                  >
                    <Crown className="mr-2 h-5 w-5" />
                    프리미엄 시작하기
                  </Button>
                </Link>
                <Link href="/fortune/integrated">
                  <Button
                    size="lg"
                    variant="outline"
                    className="px-8 py-6 text-base font-semibold rounded-xl"
                  >
                    통합 분석 체험하기
                  </Button>
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ===== REFERRAL SECTION ===== */}
      <section className="py-16 relative">
        <div className="container mx-auto px-4">
          <div className="bg-gradient-to-br from-emerald-50 to-teal-50 dark:from-emerald-950/40 dark:to-teal-950/30 border border-emerald-200/50 dark:border-emerald-800/30 rounded-2xl p-6 md:p-8">
            <div className="flex flex-col md:flex-row items-center justify-between gap-6">
              <div className="flex items-center gap-4">
                <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-emerald-400 to-teal-500 flex items-center justify-center shadow-lg">
                  <Gift className="h-7 w-7 text-white" />
                </div>
                <div>
                  <h3 className="text-lg font-bold text-foreground mb-1">
                    친구 추천하고 포인트 받기
                  </h3>
                  <p className="text-sm text-muted-foreground">
                    추천인 <span className="font-bold text-emerald-600">300P</span> + 친구 <span className="font-bold text-emerald-600">200P</span> 지급
                  </p>
                </div>
              </div>
              <Link href="/my/referral">
                <Button className="bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-600 hover:to-teal-600 text-white">
                  추천 코드 받기
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* ===== PREMIUM SHOWCASE ===== */}
      <PremiumShowcase />

      {/* Bottom Spacer */}
      <div className="h-8" />
    </div>
  );
}
