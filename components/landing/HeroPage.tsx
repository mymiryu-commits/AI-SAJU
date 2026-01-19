'use client';

import { motion } from 'framer-motion';
import { useEffect, useState } from 'react';
import Link from 'next/link';
import {
  Heart, Briefcase, Wallet, Activity, Users,
  Sparkles, MessageCircle, Crown, ArrowRight,
  Mic, Star, Lock, Unlock, Moon, Sun
} from 'lucide-react';
import { cn } from '@/lib/utils';

// 시나리오 데이터
const SCENARIOS = [
  { id: 'love', icon: Heart, label: '연애', gradient: 'from-rose-500/80 to-pink-600/80' },
  { id: 'career', icon: Briefcase, label: '커리어', gradient: 'from-blue-500/80 to-indigo-600/80' },
  { id: 'finance', icon: Wallet, label: '재테크', gradient: 'from-amber-500/80 to-yellow-600/80' },
  { id: 'health', icon: Activity, label: '건강', gradient: 'from-emerald-500/80 to-green-600/80' },
  { id: 'family', icon: Users, label: '가족', gradient: 'from-violet-500/80 to-purple-600/80' },
];

// 정통 사주 항목
const TRADITIONAL_ITEMS = [
  { id: 'sipsin', icon: '命', label: '십신', desc: '성격과 관계', locked: false },
  { id: 'sinsal', icon: '煞', label: '신살', desc: '특별한 기운', locked: false },
  { id: 'unsung', icon: '運', label: '12운성', desc: '에너지 흐름', locked: true },
  { id: 'hapchung', icon: '合', label: '합충', desc: '조화와 충돌', locked: true },
];

// 분석 카드 데이터
const ANALYSIS_CARDS = [
  {
    icon: '✦',
    title: '사주 분석',
    desc: '당신만의 운명 카드',
    features: ['사주팔자 해석', '오행 밸런스', '용신 분석'],
    href: '/fortune/saju',
    cta: '무료 분석',
    accent: 'from-violet-500 to-purple-600',
  },
  {
    icon: '☽',
    title: '오늘의 운세',
    desc: '매일 업데이트되는 가이드',
    features: ['일일 운세', '럭키 아이템', '주의사항'],
    href: '/fortune/free',
    cta: '확인하기',
    accent: 'from-indigo-500 to-blue-600',
  },
  {
    icon: '♡',
    title: '궁합 분석',
    desc: '관계의 시너지 발견',
    features: ['커플 궁합', '비즈니스 궁합', '가족 분석'],
    href: '/fortune/compatibility',
    cta: '분석하기',
    accent: 'from-rose-500 to-pink-600',
    premium: true,
  },
];

// Fade in animation variants
const fadeIn = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0 }
};

// 시나리오 버튼 컴포넌트
function ScenarioButton({ scenario, index }: {
  scenario: typeof SCENARIOS[0];
  index: number;
}) {
  const Icon = scenario.icon;

  return (
    <motion.button
      className={cn(
        'group relative flex flex-col items-center gap-3 p-5 rounded-2xl',
        'bg-white/[0.03] border border-white/[0.08]',
        'hover:bg-white/[0.06] hover:border-white/[0.15]',
        'transition-all duration-500'
      )}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.1 * index, duration: 0.5 }}
      whileHover={{ y: -4 }}
    >
      {/* Glow effect on hover */}
      <div className={cn(
        'absolute inset-0 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-500',
        'bg-gradient-to-br', scenario.gradient,
        'blur-xl -z-10'
      )} />

      <div className={cn(
        'w-12 h-12 rounded-xl flex items-center justify-center',
        'bg-gradient-to-br', scenario.gradient
      )}>
        <Icon className="w-5 h-5 text-white" />
      </div>
      <span className="text-sm font-medium text-white/80 group-hover:text-white transition-colors">
        {scenario.label}
      </span>
    </motion.button>
  );
}

// 분석 카드 컴포넌트
function AnalysisCard({ card, index }: { card: typeof ANALYSIS_CARDS[0]; index: number }) {
  return (
    <motion.div
      className="group relative"
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true }}
      variants={fadeIn}
      transition={{ delay: 0.15 * index, duration: 0.6 }}
    >
      <Link href={card.href}>
        <div className={cn(
          'relative h-full p-6 rounded-3xl overflow-hidden',
          'bg-gradient-to-br from-white/[0.05] to-white/[0.02]',
          'border border-white/[0.08] hover:border-white/[0.15]',
          'transition-all duration-500 hover:-translate-y-2'
        )}>
          {/* Premium badge */}
          {card.premium && (
            <div className="absolute top-4 right-4">
              <span className="px-2 py-1 text-[10px] font-medium bg-gradient-to-r from-amber-500/20 to-yellow-500/20 text-amber-300 rounded-full border border-amber-500/20">
                PREMIUM
              </span>
            </div>
          )}

          {/* Icon */}
          <div className={cn(
            'w-14 h-14 rounded-2xl flex items-center justify-center mb-5',
            'bg-gradient-to-br', card.accent,
            'text-2xl font-light text-white'
          )}>
            {card.icon}
          </div>

          {/* Content */}
          <h3 className="text-lg font-semibold text-white mb-1">{card.title}</h3>
          <p className="text-sm text-white/50 mb-4">{card.desc}</p>

          {/* Features */}
          <ul className="space-y-2 mb-6">
            {card.features.map((feature, i) => (
              <li key={i} className="flex items-center gap-2 text-sm text-white/60">
                <span className="w-1 h-1 rounded-full bg-white/40" />
                {feature}
              </li>
            ))}
          </ul>

          {/* CTA */}
          <div className="flex items-center gap-2 text-sm font-medium text-white/70 group-hover:text-white transition-colors">
            {card.cta}
            <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
          </div>

          {/* Hover glow */}
          <div className={cn(
            'absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 -z-10',
            'bg-gradient-to-br', card.accent,
            'blur-3xl'
          )} />
        </div>
      </Link>
    </motion.div>
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
        {/* Hero Section - 오늘의 운세 */}
        <section className="pt-12 pb-8 px-4">
          <div className="max-w-5xl mx-auto">
            <motion.div
              className="text-center mb-12"
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
            >
              {/* Date badge */}
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/[0.03] border border-white/[0.08] mb-8">
                <Moon className="w-4 h-4 text-violet-400" />
                <span className="text-sm text-white/60">{dateStr} {dayStr}요일</span>
              </div>

              {/* Main title */}
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-light text-white mb-4 tracking-tight">
                오늘의 <span className="font-semibold bg-gradient-to-r from-violet-400 via-purple-400 to-indigo-400 bg-clip-text text-transparent">운세</span>
              </h1>

              <p className="text-lg text-white/40 mb-8 font-light">
                당신의 하루를 위한 맞춤 가이드
              </p>
            </motion.div>

            {/* Fortune Card */}
            <motion.div
              className="relative max-w-2xl mx-auto"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.2, duration: 0.8 }}
            >
              <div className={cn(
                'relative p-8 rounded-3xl overflow-hidden',
                'bg-gradient-to-br from-white/[0.06] to-white/[0.02]',
                'border border-white/[0.1]',
                'backdrop-blur-xl'
              )}>
                {/* Decorative glow */}
                <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2 w-64 h-32 bg-violet-500/20 rounded-full blur-3xl" />

                {/* Energy indicator */}
                <div className="flex items-center justify-center gap-3 mb-6">
                  <div className="flex items-center gap-2 px-4 py-2 rounded-full bg-emerald-500/10 border border-emerald-500/20">
                    <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                    <span className="text-sm font-medium text-emerald-400">목(木) 에너지 상승</span>
                  </div>
                </div>

                {/* Main message */}
                <div className="text-center mb-8">
                  <h2 className="text-2xl font-light text-white mb-3">
                    새로운 시작에 유리한 하루
                  </h2>
                  <p className="text-white/50 text-sm leading-relaxed max-w-md mx-auto">
                    오늘은 창의적인 아이디어가 빛을 발하는 날입니다.
                    중요한 결정은 오전 중에 내리세요.
                  </p>
                </div>

                {/* Lucky items */}
                <div className="grid grid-cols-4 gap-3">
                  {[
                    { icon: '🎨', label: '색상', value: '파랑' },
                    { icon: '✦', label: '숫자', value: '7' },
                    { icon: '🧭', label: '방향', value: '동쪽' },
                    { icon: '⏰', label: '시간', value: '9-11시' },
                  ].map((item, i) => (
                    <div key={i} className="text-center p-3 rounded-2xl bg-white/[0.03] border border-white/[0.05]">
                      <span className="text-lg mb-1 block">{item.icon}</span>
                      <span className="text-[10px] text-white/40 block">{item.label}</span>
                      <span className="text-xs text-white/70 font-medium">{item.value}</span>
                    </div>
                  ))}
                </div>

                {/* Synergy preview */}
                <Link href="/fortune/integrated">
                  <motion.div
                    className="mt-6 p-4 rounded-2xl bg-gradient-to-r from-violet-500/10 to-indigo-500/10 border border-violet-500/20 cursor-pointer"
                    whileHover={{ scale: 1.02 }}
                    transition={{ duration: 0.2 }}
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-violet-500 to-indigo-500 flex items-center justify-center">
                          <Sparkles className="w-5 h-5 text-white" />
                        </div>
                        <div>
                          <span className="text-sm text-white/60">나의 시너지 점수</span>
                          <div className="text-xl font-semibold text-white">87<span className="text-sm text-white/40">점</span></div>
                        </div>
                      </div>
                      <ArrowRight className="w-5 h-5 text-white/40" />
                    </div>
                    <div className="mt-3 flex gap-4 text-xs text-white/40">
                      <span>사주 92</span>
                      <span>MBTI 86</span>
                      <span>별자리 85</span>
                      <span>혈액형 78</span>
                    </div>
                  </motion.div>
                </Link>
              </div>
            </motion.div>
          </div>
        </section>

        {/* AI 사주 상담 섹션 */}
        <section className="py-16 px-4">
          <div className="max-w-5xl mx-auto">
            <motion.div
              className="relative p-8 md:p-12 rounded-[2rem] overflow-hidden"
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8 }}
            >
              {/* Background gradient */}
              <div className="absolute inset-0 bg-gradient-to-br from-violet-600/20 via-purple-600/10 to-indigo-600/20" />
              <div className="absolute inset-0 bg-[#0a0a0f]/60 backdrop-blur-xl" />
              <div className="absolute inset-0 border border-white/[0.1] rounded-[2rem]" />

              {/* Decorative elements */}
              <div className="absolute top-0 right-0 w-64 h-64 bg-violet-500/10 rounded-full blur-[100px]" />
              <div className="absolute bottom-0 left-0 w-48 h-48 bg-indigo-500/10 rounded-full blur-[80px]" />

              <div className="relative z-10">
                {/* Header */}
                <div className="flex items-center justify-between mb-8">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-violet-500 to-purple-600 flex items-center justify-center">
                      <MessageCircle className="w-5 h-5 text-white" />
                    </div>
                    <div>
                      <h2 className="text-xl font-semibold text-white">AI 사주 상담사</h2>
                      <p className="text-sm text-white/40">당신의 운명을 읽어드립니다</p>
                    </div>
                  </div>
                  <span className="px-3 py-1.5 text-xs font-medium bg-violet-500/20 text-violet-300 rounded-full border border-violet-500/30">
                    핵심 기능
                  </span>
                </div>

                {/* Quote */}
                <div className="text-center py-6 mb-8">
                  <p className="text-lg md:text-xl text-white/70 font-light italic">
                    "오늘 중요한 결정이 있으신가요?
                  </p>
                  <p className="text-lg md:text-xl text-white/70 font-light italic">
                    당신의 사주를 기반으로 최적의 답을 드립니다"
                  </p>
                </div>

                {/* Scenario buttons */}
                <div className="grid grid-cols-5 gap-3 mb-8">
                  {SCENARIOS.map((scenario, i) => (
                    <ScenarioButton key={scenario.id} scenario={scenario} index={i} />
                  ))}
                </div>

                {/* CTA Button */}
                <Link href="/saju/chat">
                  <motion.button
                    className={cn(
                      'w-full py-5 rounded-2xl font-medium text-lg',
                      'bg-gradient-to-r from-violet-600 to-purple-600',
                      'text-white flex items-center justify-center gap-3',
                      'hover:from-violet-500 hover:to-purple-500 transition-all duration-300',
                      'shadow-lg shadow-violet-500/25'
                    )}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    <Mic className="w-5 h-5" />
                    무료로 상담 시작하기
                    <span className="text-sm text-white/60">(오늘 3회 남음)</span>
                  </motion.button>
                </Link>
              </div>
            </motion.div>
          </div>
        </section>

        {/* 나의 분석 섹션 */}
        <section className="py-16 px-4">
          <div className="max-w-5xl mx-auto">
            {/* Section header */}
            <motion.div
              className="mb-10"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
            >
              <h2 className="text-2xl font-light text-white mb-2">
                나의 <span className="font-semibold">분석</span>
              </h2>
              <p className="text-white/40">당신을 위한 맞춤 분석 서비스</p>
            </motion.div>

            {/* Cards grid */}
            <div className="grid md:grid-cols-3 gap-5">
              {ANALYSIS_CARDS.map((card, i) => (
                <AnalysisCard key={card.title} card={card} index={i} />
              ))}
            </div>
          </div>
        </section>

        {/* 정통 사주 심화 섹션 */}
        <section className="py-16 px-4">
          <div className="max-w-5xl mx-auto">
            {/* Section header */}
            <motion.div
              className="flex items-center justify-between mb-10"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
            >
              <div>
                <h2 className="text-2xl font-light text-white mb-2">
                  정통 사주 <span className="font-semibold">심화</span>
                </h2>
                <p className="text-white/40">전통 명리학 기반의 깊은 분석</p>
              </div>
              <Link href="/saju/advanced" className="flex items-center gap-2 text-sm text-white/50 hover:text-white transition-colors">
                더보기 <ArrowRight className="w-4 h-4" />
              </Link>
            </motion.div>

            {/* Traditional items */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {TRADITIONAL_ITEMS.map((item, i) => (
                <motion.div
                  key={item.id}
                  className={cn(
                    'relative p-6 rounded-2xl text-center',
                    'bg-gradient-to-br from-white/[0.04] to-white/[0.01]',
                    'border border-white/[0.08] hover:border-white/[0.15]',
                    'transition-all duration-500 hover:-translate-y-1',
                    item.locked && 'opacity-60'
                  )}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: 0.1 * i }}
                >
                  {/* Lock indicator */}
                  <div className="absolute top-3 right-3">
                    {item.locked ? (
                      <Lock className="w-3.5 h-3.5 text-white/30" />
                    ) : (
                      <Unlock className="w-3.5 h-3.5 text-emerald-400/60" />
                    )}
                  </div>

                  {/* Icon */}
                  <div className="text-3xl font-light text-white/80 mb-3 font-serif">
                    {item.icon}
                  </div>

                  {/* Label */}
                  <h3 className="text-sm font-medium text-white mb-1">{item.label}</h3>
                  <p className="text-xs text-white/40">{item.desc}</p>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* 프리미엄 섹션 */}
        <section className="py-16 px-4 pb-24">
          <div className="max-w-5xl mx-auto">
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
                    { icon: Star, text: '정통 사주 전체' },
                    { icon: MessageCircle, text: 'AI 상담 무제한' },
                    { icon: Sun, text: '월별 액션플랜' },
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
      </div>
    </div>
  );
}

export default HeroPage;
