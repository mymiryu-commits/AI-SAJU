'use client';

import { motion } from 'framer-motion';
import { useEffect, useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import {
  Heart, Briefcase, Wallet, Activity, Users,
  Sparkles, MessageCircle, Crown, ArrowRight,
  Mic, Star, Lock, Unlock, Moon, Sun,
  Coins, Gift, Zap, Eye, Calendar, UserCheck,
  TrendingUp, Compass, Brain, Flame
} from 'lucide-react';
import { cn } from '@/lib/utils';

// 컨텐츠 카드 타입 정의
interface ContentCard {
  id: string;
  title: string;
  subtitle: string;
  description: string;
  href: string;
  imagePath: string; // 이미지 경로 (추후 교체)
  imageAlt: string;
  isFree: boolean;
  points?: number; // 유료인 경우 필요 포인트
  badge?: string;
  gradient: string;
  icon: React.ElementType;
  features: string[];
}

// 컨텐츠 카드 데이터
const CONTENT_CARDS: ContentCard[] = [
  {
    id: 'today-fortune',
    title: '오늘의 운세',
    subtitle: '매일 새로운 운세 확인',
    description: '오늘 하루의 길흉화복을 AI가 분석해드립니다. 럭키 컬러, 행운의 숫자, 주의사항까지!',
    href: '/fortune/free',
    imagePath: '/images/hero/today-fortune.png',
    imageAlt: '오늘의 운세 이미지',
    isFree: true,
    badge: '무료',
    gradient: 'from-violet-500 to-purple-600',
    icon: Calendar,
    features: ['일일 운세', '럭키 아이템', '시간대별 운세']
  },
  {
    id: 'saju-analysis',
    title: '사주팔자 분석',
    subtitle: '당신만의 운명 지도',
    description: '타고난 사주를 기반으로 성격, 적성, 인생의 흐름을 심층 분석합니다.',
    href: '/fortune/saju',
    imagePath: '/images/hero/saju-analysis.png',
    imageAlt: '사주팔자 분석 이미지',
    isFree: true,
    badge: '기본 무료',
    gradient: 'from-indigo-500 to-blue-600',
    icon: Compass,
    features: ['사주팔자 해석', '오행 밸런스', '용신 분석']
  },
  {
    id: 'ai-consultation',
    title: 'AI 사주 상담',
    subtitle: '실시간 1:1 상담',
    description: '연애, 커리어, 재테크 등 궁금한 것을 AI 상담사에게 직접 물어보세요.',
    href: '/saju/chat',
    imagePath: '/images/hero/ai-consultation.png',
    imageAlt: 'AI 사주 상담 이미지',
    isFree: true,
    points: 0,
    badge: '매일 3회 무료',
    gradient: 'from-rose-500 to-pink-600',
    icon: MessageCircle,
    features: ['실시간 상담', '맞춤 조언', '대화 기록']
  },
  {
    id: 'compatibility',
    title: '궁합 분석',
    subtitle: '인연의 케미스트리',
    description: '연인, 친구, 동료와의 궁합을 분석하고 더 좋은 관계를 만들어보세요.',
    href: '/fortune/compatibility',
    imagePath: '/images/hero/compatibility.png',
    imageAlt: '궁합 분석 이미지',
    isFree: false,
    points: 100,
    badge: '100P',
    gradient: 'from-pink-500 to-rose-600',
    icon: Heart,
    features: ['커플 궁합', '비즈니스 궁합', '가족 궁합']
  },
  {
    id: 'career-fortune',
    title: '직업운 분석',
    subtitle: '나에게 맞는 직업은?',
    description: '사주에서 보이는 당신의 적성과 성공 가능성 높은 분야를 알려드립니다.',
    href: '/fortune/saju?type=career',
    imagePath: '/images/hero/career-fortune.png',
    imageAlt: '직업운 분석 이미지',
    isFree: false,
    points: 150,
    badge: '150P',
    gradient: 'from-blue-500 to-cyan-600',
    icon: Briefcase,
    features: ['적성 분석', '성공 시기', '직업 추천']
  },
  {
    id: 'wealth-fortune',
    title: '재물운 분석',
    subtitle: '부의 흐름 읽기',
    description: '금전운의 흐름과 투자 시기, 주의해야 할 시점을 분석해드립니다.',
    href: '/fortune/saju?type=wealth',
    imagePath: '/images/hero/wealth-fortune.png',
    imageAlt: '재물운 분석 이미지',
    isFree: false,
    points: 200,
    badge: '200P',
    gradient: 'from-amber-500 to-yellow-600',
    icon: Wallet,
    features: ['재물운 흐름', '투자 시기', '금전 조언']
  },
  {
    id: 'yearly-fortune',
    title: '신년 대운',
    subtitle: '한 해의 큰 그림',
    description: '올해 전체 운세와 월별 주의사항, 중요한 시기를 알려드립니다.',
    href: '/fortune/saju?type=yearly',
    imagePath: '/images/hero/yearly-fortune.png',
    imageAlt: '신년 대운 이미지',
    isFree: false,
    points: 300,
    badge: '300P',
    gradient: 'from-emerald-500 to-green-600',
    icon: TrendingUp,
    features: ['연간 운세', '월별 운세', '대운 분석']
  },
  {
    id: 'advanced-saju',
    title: '정통 사주 심화',
    subtitle: '명리학의 깊이',
    description: '십신, 신살, 12운성, 합충형파해 등 전통 명리학 기반의 깊은 분석.',
    href: '/saju/advanced',
    imagePath: '/images/hero/advanced-saju.png',
    imageAlt: '정통 사주 심화 이미지',
    isFree: false,
    points: 500,
    badge: 'PREMIUM',
    gradient: 'from-purple-500 to-violet-600',
    icon: Crown,
    features: ['십신 분석', '신살 해석', '운성 분석']
  },
];

// 시나리오 데이터 (AI 상담용)
const SCENARIOS = [
  { id: 'love', icon: Heart, label: '연애', gradient: 'from-rose-500/80 to-pink-600/80' },
  { id: 'career', icon: Briefcase, label: '커리어', gradient: 'from-blue-500/80 to-indigo-600/80' },
  { id: 'finance', icon: Wallet, label: '재테크', gradient: 'from-amber-500/80 to-yellow-600/80' },
  { id: 'health', icon: Activity, label: '건강', gradient: 'from-emerald-500/80 to-green-600/80' },
  { id: 'family', icon: Users, label: '가족', gradient: 'from-violet-500/80 to-purple-600/80' },
];

// Fade in animation variants
const fadeIn = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0 }
};

const staggerContainer = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1
    }
  }
};

// 컨텐츠 카드 컴포넌트
function ContentCardComponent({ card, index }: { card: ContentCard; index: number }) {
  const Icon = card.icon;

  return (
    <motion.div
      className="group relative"
      variants={fadeIn}
      transition={{ duration: 0.5 }}
    >
      <Link href={card.href}>
        <div className={cn(
          'relative h-full rounded-3xl overflow-hidden',
          'bg-gradient-to-br from-white/[0.06] to-white/[0.02]',
          'border border-white/[0.1] hover:border-white/[0.2]',
          'transition-all duration-500 hover:-translate-y-2 hover:shadow-2xl',
          'cursor-pointer'
        )}>
          {/* 이미지 영역 */}
          <div className="relative w-full aspect-[16/10] overflow-hidden">
            {/* 플레이스홀더 - 실제 이미지로 교체 예정 */}
            <div className={cn(
              'absolute inset-0 bg-gradient-to-br',
              card.gradient,
              'flex items-center justify-center'
            )}>
              {/* 이미지가 없을 때 표시할 아이콘 */}
              <Icon className="w-16 h-16 text-white/40" />

              {/* 실제 이미지 (이미지 경로가 유효할 때 표시) */}
              {/*
              <Image
                src={card.imagePath}
                alt={card.imageAlt}
                fill
                className="object-cover group-hover:scale-105 transition-transform duration-700"
              />
              */}
            </div>

            {/* 이미지 오버레이 그라데이션 */}
            <div className="absolute inset-0 bg-gradient-to-t from-[#0a0a0f] via-transparent to-transparent" />

            {/* 배지 (무료/유료) */}
            <div className="absolute top-4 right-4">
              <span className={cn(
                'px-3 py-1.5 text-xs font-bold rounded-full',
                'backdrop-blur-md shadow-lg',
                card.isFree
                  ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30'
                  : 'bg-amber-500/20 text-amber-300 border border-amber-500/30'
              )}>
                {card.isFree ? (
                  <span className="flex items-center gap-1">
                    <Gift className="w-3 h-3" />
                    {card.badge}
                  </span>
                ) : (
                  <span className="flex items-center gap-1">
                    <Coins className="w-3 h-3" />
                    {card.badge}
                  </span>
                )}
              </span>
            </div>

            {/* 아이콘 */}
            <div className="absolute bottom-4 left-4">
              <div className={cn(
                'w-12 h-12 rounded-xl flex items-center justify-center',
                'bg-gradient-to-br', card.gradient,
                'shadow-lg backdrop-blur-sm border border-white/20'
              )}>
                <Icon className="w-6 h-6 text-white" />
              </div>
            </div>
          </div>

          {/* 컨텐츠 영역 */}
          <div className="p-5">
            {/* 제목 */}
            <h3 className="text-lg font-bold text-white mb-1 group-hover:text-white/90 transition-colors">
              {card.title}
            </h3>
            <p className="text-sm text-white/50 mb-3">{card.subtitle}</p>

            {/* 설명 */}
            <p className="text-sm text-white/40 mb-4 line-clamp-2 leading-relaxed">
              {card.description}
            </p>

            {/* 특징 태그 */}
            <div className="flex flex-wrap gap-2 mb-4">
              {card.features.map((feature, i) => (
                <span
                  key={i}
                  className="px-2 py-1 text-[10px] rounded-full bg-white/[0.05] text-white/50 border border-white/[0.08]"
                >
                  {feature}
                </span>
              ))}
            </div>

            {/* CTA */}
            <div className="flex items-center justify-between">
              <span className="flex items-center gap-2 text-sm font-medium text-white/70 group-hover:text-white transition-colors">
                {card.isFree ? '시작하기' : '분석받기'}
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </span>

              {!card.isFree && card.points && (
                <span className="flex items-center gap-1 text-sm text-amber-400/80">
                  <Coins className="w-4 h-4" />
                  {card.points}P
                </span>
              )}
            </div>
          </div>

          {/* Hover glow effect */}
          <div className={cn(
            'absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 -z-10',
            'bg-gradient-to-br', card.gradient,
            'blur-3xl'
          )} />
        </div>
      </Link>
    </motion.div>
  );
}

// 사용자 정보 입력 안내 배너
function UserInfoBanner() {
  return (
    <motion.div
      className={cn(
        'relative p-6 rounded-2xl overflow-hidden mb-12',
        'bg-gradient-to-r from-violet-500/10 via-purple-500/10 to-indigo-500/10',
        'border border-violet-500/20'
      )}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.2 }}
    >
      <div className="flex flex-col md:flex-row items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-violet-500 to-purple-600 flex items-center justify-center">
            <UserCheck className="w-6 h-6 text-white" />
          </div>
          <div>
            <h3 className="text-lg font-semibold text-white">사주 정보를 입력하세요</h3>
            <p className="text-sm text-white/50">한 번 입력하면 모든 컨텐츠를 바로 이용할 수 있어요!</p>
          </div>
        </div>
        <Link href="/fortune/saju">
          <motion.button
            className={cn(
              'px-6 py-3 rounded-xl font-medium',
              'bg-gradient-to-r from-violet-600 to-purple-600',
              'text-white hover:from-violet-500 hover:to-purple-500',
              'transition-all duration-300 flex items-center gap-2'
            )}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
          >
            <Zap className="w-4 h-4" />
            정보 입력하기
          </motion.button>
        </Link>
      </div>
    </motion.div>
  );
}

// 무료 컨텐츠 섹션
function FreeContentSection() {
  const freeCards = CONTENT_CARDS.filter(card => card.isFree);

  return (
    <section className="py-12 px-4">
      <div className="max-w-6xl mx-auto">
        {/* 섹션 헤더 */}
        <motion.div
          className="flex items-center justify-between mb-8"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
        >
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-emerald-500 to-green-600 flex items-center justify-center">
              <Gift className="w-5 h-5 text-white" />
            </div>
            <div>
              <h2 className="text-2xl font-bold text-white">무료 컨텐츠</h2>
              <p className="text-sm text-white/40">로그인만 하면 무료로 이용 가능해요</p>
            </div>
          </div>
        </motion.div>

        {/* 카드 그리드 */}
        <motion.div
          className="grid md:grid-cols-2 lg:grid-cols-3 gap-6"
          variants={staggerContainer}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
        >
          {freeCards.map((card, i) => (
            <ContentCardComponent key={card.id} card={card} index={i} />
          ))}
        </motion.div>
      </div>
    </section>
  );
}

// 프리미엄 컨텐츠 섹션
function PremiumContentSection() {
  const paidCards = CONTENT_CARDS.filter(card => !card.isFree);

  return (
    <section className="py-12 px-4">
      <div className="max-w-6xl mx-auto">
        {/* 섹션 헤더 */}
        <motion.div
          className="flex items-center justify-between mb-8"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
        >
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-amber-500 to-yellow-600 flex items-center justify-center">
              <Coins className="w-5 h-5 text-white" />
            </div>
            <div>
              <h2 className="text-2xl font-bold text-white">프리미엄 분석</h2>
              <p className="text-sm text-white/40">포인트로 더 깊은 분석을 받아보세요</p>
            </div>
          </div>
          <Link href="/pricing" className="flex items-center gap-2 text-sm text-amber-400 hover:text-amber-300 transition-colors">
            <Coins className="w-4 h-4" />
            포인트 충전
            <ArrowRight className="w-4 h-4" />
          </Link>
        </motion.div>

        {/* 카드 그리드 */}
        <motion.div
          className="grid md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6"
          variants={staggerContainer}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
        >
          {paidCards.map((card, i) => (
            <ContentCardComponent key={card.id} card={card} index={i} />
          ))}
        </motion.div>
      </div>
    </section>
  );
}

// 프리미엄 멤버십 배너
function PremiumMembershipBanner() {
  return (
    <section className="py-12 px-4">
      <div className="max-w-6xl mx-auto">
        <motion.div
          className="relative p-8 md:p-12 rounded-[2rem] overflow-hidden"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
        >
          {/* Background */}
          <div className="absolute inset-0 bg-gradient-to-br from-amber-500/10 via-yellow-500/5 to-orange-500/10" />
          <div className="absolute inset-0 bg-[#0a0a0f]/70 backdrop-blur-xl" />
          <div className="absolute inset-0 border border-amber-500/20 rounded-[2rem]" />

          {/* Glow */}
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[400px] h-[200px] bg-amber-500/10 rounded-full blur-[100px]" />

          <div className="relative z-10 text-center">
            {/* Crown icon */}
            <div className="w-16 h-16 mx-auto mb-6 rounded-2xl bg-gradient-to-br from-amber-500 to-yellow-600 flex items-center justify-center shadow-lg shadow-amber-500/25">
              <Crown className="w-8 h-8 text-white" />
            </div>

            <h2 className="text-2xl md:text-3xl font-light text-white mb-3">
              프리미엄 <span className="font-semibold bg-gradient-to-r from-amber-400 to-yellow-400 bg-clip-text text-transparent">멤버십</span>
            </h2>

            <p className="text-white/50 mb-8 max-w-md mx-auto">
              월 9,900원으로 모든 분석과 AI 상담을 무제한으로 이용하세요
            </p>

            {/* Features */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8 max-w-2xl mx-auto">
              {[
                { icon: Star, text: '모든 분석 무제한' },
                { icon: MessageCircle, text: 'AI 상담 무제한' },
                { icon: TrendingUp, text: '월별 대운 리포트' },
                { icon: Heart, text: '궁합 분석 포함' },
              ].map((feature, i) => (
                <div key={i} className="flex items-center gap-2 justify-center text-sm text-white/60">
                  <feature.icon className="w-4 h-4 text-amber-400/80" />
                  <span>{feature.text}</span>
                </div>
              ))}
            </div>

            {/* CTA */}
            <Link href="/pricing">
              <motion.button
                className={cn(
                  'px-8 py-4 rounded-2xl font-medium',
                  'bg-gradient-to-r from-amber-500 to-yellow-500',
                  'text-black hover:from-amber-400 hover:to-yellow-400',
                  'transition-all duration-300',
                  'shadow-lg shadow-amber-500/25'
                )}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.98 }}
              >
                7일 무료 체험 시작
              </motion.button>
            </Link>
          </div>
        </motion.div>
      </div>
    </section>
  );
}

export function HeroPage() {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  // 오늘 날짜
  const today = new Date();
  const dateStr = `${today.getFullYear()}.${String(today.getMonth() + 1).padStart(2, '0')}.${String(today.getDate()).padStart(2, '0')}`;
  const dayNames = ['일', '월', '화', '수', '목', '금', '토'];
  const dayStr = dayNames[today.getDay()];

  if (!mounted) return null;

  return (
    <div className="min-h-screen bg-[#0a0a0f] overflow-hidden">
      {/* Background Effects */}
      <div className="fixed inset-0 pointer-events-none">
        {/* Gradient orbs */}
        <div className="absolute top-0 left-1/4 w-[600px] h-[600px] bg-violet-600/10 rounded-full blur-[150px]" />
        <div className="absolute bottom-0 right-1/4 w-[500px] h-[500px] bg-indigo-600/10 rounded-full blur-[150px]" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-purple-600/5 rounded-full blur-[200px]" />

        {/* Subtle grid */}
        <div
          className="absolute inset-0 opacity-[0.02]"
          style={{
            backgroundImage: 'linear-gradient(rgba(255,255,255,0.1) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.1) 1px, transparent 1px)',
            backgroundSize: '100px 100px'
          }}
        />
      </div>

      {/* Content */}
      <div className="relative z-10">
        {/* Hero Header */}
        <section className="pt-12 pb-6 px-4">
          <div className="max-w-6xl mx-auto">
            <motion.div
              className="text-center mb-8"
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
            >
              {/* Date badge */}
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/[0.03] border border-white/[0.08] mb-6">
                <Moon className="w-4 h-4 text-violet-400" />
                <span className="text-sm text-white/60">{dateStr} {dayStr}요일</span>
              </div>

              {/* Main title */}
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-light text-white mb-4 tracking-tight">
                AI <span className="font-semibold bg-gradient-to-r from-violet-400 via-purple-400 to-indigo-400 bg-clip-text text-transparent">사주</span>
              </h1>

              <p className="text-lg text-white/40 font-light max-w-xl mx-auto">
                사주팔자부터 궁합, 운세까지
                <br />
                AI가 분석하는 당신만의 운명 가이드
              </p>
            </motion.div>

            {/* 사용자 정보 입력 안내 */}
            <UserInfoBanner />
          </div>
        </section>

        {/* 무료 컨텐츠 섹션 */}
        <FreeContentSection />

        {/* 프리미엄 컨텐츠 섹션 */}
        <PremiumContentSection />

        {/* 프리미엄 멤버십 배너 */}
        <PremiumMembershipBanner />

        {/* Bottom Spacer */}
        <div className="h-24" />
      </div>
    </div>
  );
}

export default HeroPage;
