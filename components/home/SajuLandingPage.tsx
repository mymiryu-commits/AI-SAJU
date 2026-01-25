'use client';

import { useState, useEffect } from 'react';
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
  Calendar,
  TrendingUp,
  Brain,
} from 'lucide-react';
import Image from 'next/image';
import PremiumShowcase from '@/components/home/PremiumShowcase';
import {
  CHINESE_ZODIAC,
  ChineseZodiacSign,
  getTodayZodiacRanking,
} from '@/lib/fortune/chineseZodiac';
import { ServiceCardImages } from '@/types/settings';

// 띠 아이콘 매핑
const zodiacEmojis: Record<ChineseZodiacSign, string> = {
  rat: '🐀', ox: '🐂', tiger: '🐅', rabbit: '🐇', dragon: '🐉', snake: '🐍',
  horse: '🐎', sheep: '🐑', monkey: '🐵', rooster: '🐓', dog: '🐕', pig: '🐷',
};

// 서비스 카드 데이터
const serviceCards = [
  {
    id: 'daily_fortune',
    title: '오늘의 운세',
    subtitle: '매일 새로운 운세',
    description: '오늘 하루의 운세를 확인하세요',
    href: '/fortune',
    icon: Sun,
    buttonText: '운세 확인하기',
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
    buttonText: '사주 분석하기',
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
    buttonText: '심층 분석하기',
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
    buttonText: 'AI 상담하기',
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
    buttonText: '궁합 보기',
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
    buttonText: '타로 보기',
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
    buttonText: '번호 추천받기',
    price: '무료',
    priceColor: 'text-green-600',
    gradient: 'from-emerald-400 to-teal-500',
    shadowColor: 'shadow-emerald-500/20',
  },
  {
    id: 'mbti',
    title: 'MBTI 분석',
    subtitle: '성향 강도 분석',
    description: '대/소문자로 보는 나의 성격 강도',
    href: '/mbti',
    icon: Brain,
    buttonText: 'MBTI 분석하기',
    price: '무료',
    priceColor: 'text-green-600',
    gradient: 'from-indigo-400 to-purple-500',
    shadowColor: 'shadow-indigo-500/20',
  },
];

export default function SajuLandingPage() {
  const [cardImages, setCardImages] = useState<ServiceCardImages>({});
  const [zodiacRanking, setZodiacRanking] = useState<ReturnType<typeof getTodayZodiacRanking>>([]);
  const [currentDate, setCurrentDate] = useState<string>('');

  useEffect(() => {
    // 서비스 카드 이미지 설정 가져오기
    const fetchCardImages = async () => {
      try {
        const response = await fetch('/api/site-settings?key=service_card_images');
        const result = await response.json();
        if (result.data?.value) {
          setCardImages(result.data.value);
        }
      } catch (error) {
        console.error('Error fetching card images:', error);
      }
    };

    fetchCardImages();

    // 오늘의 띠별 운세 순위 가져오기
    const today = new Date();
    setCurrentDate(today.toLocaleDateString('ko-KR', { month: 'long', day: 'numeric' }));
    setZodiacRanking(getTodayZodiacRanking(today));
  }, []);

  return (
    <div className="min-h-screen bg-background">
      {/* ===== HERO SECTION - 띠별 운세 중심 ===== */}
      <section className="relative py-12 md:py-16 overflow-hidden">
        {/* 배경 */}
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-b from-amber-50/80 via-orange-50/50 to-background dark:from-amber-950/30 dark:via-orange-950/20 dark:to-background" />
          <div className="absolute top-0 left-1/4 w-[500px] h-[500px] bg-gradient-to-br from-amber-200/30 to-orange-300/20 dark:from-amber-600/10 dark:to-orange-500/5 rounded-full blur-[120px]" />
          <div className="absolute bottom-0 right-1/4 w-[400px] h-[400px] bg-gradient-to-br from-red-200/20 to-pink-300/15 dark:from-red-600/10 dark:to-pink-500/5 rounded-full blur-[100px]" />
        </div>

        <div className="container mx-auto px-4 relative z-10">
          {/* 오늘의 띠별 운세 - 메인 */}
          {zodiacRanking.length > 0 && (
            <div className="max-w-4xl mx-auto">
              {/* 날짜 헤더 */}
              <div className="text-center mb-6">
                <div className="inline-flex items-center gap-2 bg-gradient-to-r from-amber-500 to-orange-500 text-white rounded-full px-4 py-1.5 text-sm font-medium mb-3">
                  <span>🔮</span>
                  <span>{currentDate}</span>
                </div>
                <h1 className="text-2xl md:text-3xl font-bold">오늘의 띠별 운세</h1>
              </div>

              {/* 1위 강조 */}
              <Link href="/fortune/tti" className="block mb-6">
                <div className="relative bg-gradient-to-r from-amber-500 via-orange-500 to-red-500 rounded-3xl p-1 shadow-2xl shadow-amber-500/30 hover:shadow-amber-500/50 transition-all hover:-translate-y-1">
                  <div className="bg-white dark:bg-card rounded-[22px] p-6 md:p-8">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-4 md:gap-6">
                        <div className="relative">
                          <div className="absolute -inset-2 bg-gradient-to-r from-amber-400 to-orange-400 rounded-full blur-lg opacity-50 animate-pulse" />
                          <div className="relative text-5xl md:text-7xl animate-bounce" style={{ animationDuration: '2s' }}>
                            {zodiacEmojis[zodiacRanking[0].sign]}
                          </div>
                        </div>
                        <div>
                          <div className="flex items-center gap-2 mb-1">
                            <span className="text-amber-500 font-bold text-lg">👑 오늘의 1위</span>
                          </div>
                          <h2 className="text-2xl md:text-3xl font-bold">{zodiacRanking[0].signInfo.name}띠</h2>
                          <p className="text-muted-foreground text-sm md:text-base mt-1">
                            오늘 가장 좋은 운을 가진 띠입니다
                          </p>
                        </div>
                      </div>
                      <div className="text-right hidden md:block">
                        <div className="text-4xl font-bold text-amber-500">{zodiacRanking[0].score}점</div>
                        <div className="text-sm text-muted-foreground">종합 운세</div>
                      </div>
                    </div>
                  </div>
                </div>
              </Link>

              {/* 2-6위 순위 */}
              <Link href="/fortune/tti" className="block">
                <div className="grid grid-cols-5 gap-2 md:gap-4 mb-6">
                  {zodiacRanking.slice(1, 6).map((item, index) => (
                    <div
                      key={item.sign}
                      className="bg-white/80 dark:bg-card/80 backdrop-blur-sm rounded-2xl p-3 md:p-4 text-center hover:bg-white dark:hover:bg-card hover:shadow-lg transition-all cursor-pointer border border-border/50"
                    >
                      <div className="text-2xl md:text-4xl mb-1">{zodiacEmojis[item.sign]}</div>
                      <div className={`text-xs font-bold mb-0.5 ${
                        index === 0 ? 'text-gray-400' :
                        index === 1 ? 'text-amber-700' :
                        'text-gray-500'
                      }`}>
                        {index + 2}위
                      </div>
                      <div className="text-xs md:text-sm font-medium">{item.signInfo.name}</div>
                      <div className="text-[10px] md:text-xs text-muted-foreground">{item.score}점</div>
                    </div>
                  ))}
                </div>
              </Link>

              {/* 내 띠 확인 CTA */}
              <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
                <Link href="/fortune/tti">
                  <button className="inline-flex items-center justify-center h-12 px-8 bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600 text-white font-semibold rounded-xl shadow-lg transition-all text-sm">
                    <span className="mr-2">🔍</span>
                    내 띠 운세 확인하기
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </button>
                </Link>
                <Link href="/fortune/newyear">
                  <button className="inline-flex items-center justify-center h-12 px-6 bg-white dark:bg-gray-800 text-gray-800 dark:text-white border-2 border-amber-300 dark:border-amber-600 hover:bg-amber-50 dark:hover:bg-gray-700 font-semibold rounded-xl transition-all text-sm">
                    <span className="mr-2">🧧</span>
                    2026 신년운세
                  </button>
                </Link>
              </div>
            </div>
          )}
        </div>
      </section>

      {/* ===== 프리미엄 서비스 배너 ===== */}
      <section className="py-8 bg-gradient-to-r from-purple-600 via-pink-600 to-rose-600">
        <div className="container mx-auto px-4">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            <div className="text-white text-center md:text-left">
              <h2 className="text-xl md:text-2xl font-bold mb-1">더 깊은 운명 분석이 필요하신가요?</h2>
              <p className="text-white/80 text-sm md:text-base">사주팔자 기반 AI 심층 분석</p>
            </div>
            <div className="flex gap-3">
              <Link href="/fortune/saju">
                <button className="inline-flex items-center justify-center h-11 px-6 bg-white text-purple-700 hover:bg-gray-100 rounded-xl font-semibold text-sm transition-colors shadow-lg">
                  <Zap className="mr-2 h-4 w-4" />
                  무료 사주 분석
                </button>
              </Link>
              <Link href="/fortune/integrated">
                <button className="inline-flex items-center justify-center h-11 px-6 bg-purple-700 text-white hover:bg-purple-800 rounded-xl font-semibold text-sm transition-colors border-2 border-white/30">
                  <Crown className="mr-2 h-4 w-4" />
                  프리미엄
                </button>
              </Link>
            </div>
          </div>
        </div>
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
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-5 md:gap-7">
            {serviceCards.map((card, index) => {
              const Icon = card.icon;
              const imageUrl = cardImages[card.id as keyof ServiceCardImages];

              return (
                <Link
                  key={card.id}
                  href={card.href}
                  className="group block"
                >
                  <div
                    className={`relative bg-card rounded-3xl overflow-hidden transition-all duration-500 h-full
                      shadow-lg hover:shadow-2xl hover:-translate-y-2
                      border border-border/50 hover:border-purple-200 dark:hover:border-purple-800/50
                      ${card.shadowColor}`}
                    style={{ animationDelay: `${index * 50}ms` }}
                  >
                    {/* Card Image Area */}
                    <div className={`relative aspect-[4/3] overflow-hidden ${!imageUrl ? `bg-gradient-to-br ${card.gradient}` : ''}`}>
                      {imageUrl ? (
                        /* 업로드된 이미지 표시 */
                        <>
                          <Image
                            src={imageUrl}
                            alt={card.title}
                            fill
                            className="object-cover transition-transform duration-700 group-hover:scale-110"
                          />
                          {/* 이미지 오버레이 */}
                          <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                        </>
                      ) : (
                        /* 기본 아이콘 표시 */
                        <>
                          {/* 배경 패턴 */}
                          <div className="absolute inset-0 opacity-30">
                            <div className="absolute top-4 right-4 w-24 h-24 bg-white/20 rounded-full blur-2xl" />
                            <div className="absolute bottom-4 left-4 w-16 h-16 bg-white/20 rounded-full blur-xl" />
                          </div>
                          {/* 아이콘 */}
                          <div className="absolute inset-0 flex items-center justify-center">
                            <div className="relative">
                              <div className="absolute inset-0 bg-white/30 rounded-full blur-xl scale-150 group-hover:scale-175 transition-transform duration-500" />
                              <div className="relative w-18 h-18 md:w-22 md:h-22 rounded-full bg-white/25 backdrop-blur-md flex items-center justify-center border border-white/30 shadow-2xl group-hover:scale-110 transition-all duration-500">
                                <Icon className="h-9 w-9 md:h-11 md:w-11 text-white drop-shadow-lg" />
                              </div>
                            </div>
                          </div>
                          {/* 하단 그라데이션 */}
                          <div className="absolute inset-x-0 bottom-0 h-1/3 bg-gradient-to-t from-black/20 to-transparent" />
                        </>
                      )}
                    </div>

                    {/* Card Button Area */}
                    <div className="p-4 md:p-5 bg-gradient-to-b from-card to-muted/20">
                      <Button
                        variant="ghost"
                        className="w-full justify-center font-medium text-sm md:text-base py-5
                          bg-gradient-to-r from-purple-50 to-pink-50 dark:from-purple-900/20 dark:to-pink-900/20
                          hover:from-purple-100 hover:to-pink-100 dark:hover:from-purple-900/40 dark:hover:to-pink-900/40
                          border border-purple-100 dark:border-purple-800/30
                          rounded-xl transition-all duration-300
                          group-hover:shadow-md"
                      >
                        <span className="bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent font-semibold">
                          {card.buttonText}
                        </span>
                        <ArrowRight className="ml-2 h-4 w-4 text-purple-500 group-hover:translate-x-1 transition-transform duration-300" />
                      </Button>
                    </div>

                    {/* Decorative corner gradient */}
                    <div className={`absolute -top-12 -right-12 w-24 h-24 bg-gradient-to-br ${card.gradient} opacity-20 rounded-full blur-2xl group-hover:opacity-30 transition-opacity duration-500`} />
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
