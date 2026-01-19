'use client';

import { motion, useSpring, useTransform } from 'framer-motion';
import { useEffect, useState } from 'react';
import Link from 'next/link';
import {
  Heart, Briefcase, Wallet, Activity, Users,
  Sparkles, Calendar, MessageCircle, Crown,
  ChevronRight, Mic, Star, Lock, Unlock
} from 'lucide-react';
import { cn } from '@/lib/utils';

// 색상 시스템
const colors = {
  bgHero: 'bg-gradient-to-br from-[#1a1a2e] via-[#16213e] to-[#0f3460]',
  accentPrimary: '#e94560',
  accentSecondary: '#533483',
};

// 시나리오 데이터
const SCENARIOS = [
  { id: 'love', icon: Heart, label: '연애', color: 'text-pink-400' },
  { id: 'career', icon: Briefcase, label: '커리어', color: 'text-blue-400' },
  { id: 'finance', icon: Wallet, label: '재테크', color: 'text-yellow-400' },
  { id: 'health', icon: Activity, label: '건강', color: 'text-green-400' },
  { id: 'family', icon: Users, label: '가족', color: 'text-purple-400' },
];

// 정통 사주 항목
const TRADITIONAL_ITEMS = [
  { id: 'sipsin', icon: '🎭', label: '십신', locked: false },
  { id: 'sinsal', icon: '⚔️', label: '신살', locked: false },
  { id: 'unsung', icon: '🔄', label: '12운성', locked: true },
  { id: 'hapchung', icon: '🔗', label: '합충', locked: true },
];

// 숫자 카운트업 애니메이션
function AnimatedNumber({ value }: { value: number }) {
  const spring = useSpring(0, { stiffness: 100, damping: 30 });
  const display = useTransform(spring, (v) => Math.round(v));
  const [displayValue, setDisplayValue] = useState(0);

  useEffect(() => {
    spring.set(value);
    return spring.on('change', (v) => setDisplayValue(Math.round(v)));
  }, [spring, value]);

  return <span>{displayValue}</span>;
}

// 시나리오 버튼 컴포넌트
function ScenarioButton({ scenario, onClick }: {
  scenario: typeof SCENARIOS[0];
  onClick: () => void;
}) {
  const Icon = scenario.icon;

  return (
    <motion.button
      onClick={onClick}
      className={cn(
        'flex flex-col items-center gap-2 p-4 rounded-xl',
        'bg-white/5 border border-white/10 backdrop-blur-sm',
        'hover:bg-white/10 transition-colors'
      )}
      whileHover={{ scale: 1.05, boxShadow: '0 0 20px rgba(233, 69, 96, 0.3)' }}
      whileTap={{ scale: 0.95 }}
    >
      <Icon className={cn('w-6 h-6', scenario.color)} />
      <span className="text-sm text-white/90">{scenario.label}</span>
    </motion.button>
  );
}

// 분석 카드 컴포넌트
function AnalysisCard({ icon, title, features, cta, href, price }: {
  icon: React.ReactNode;
  title: string;
  features: string[];
  cta: string;
  href: string;
  price?: string;
}) {
  return (
    <motion.div
      className="bg-white/5 border border-white/10 rounded-2xl p-5 backdrop-blur-sm"
      whileHover={{ y: -4, boxShadow: '0 10px 40px rgba(0,0,0,0.3)' }}
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.5 }}
    >
      <div className="text-3xl mb-3">{icon}</div>
      <h3 className="text-lg font-bold text-white mb-2">{title}</h3>
      <div className="space-y-1 mb-4">
        {features.map((f, i) => (
          <p key={i} className="text-sm text-white/60">{f}</p>
        ))}
      </div>
      <Link
        href={href}
        className={cn(
          'inline-flex items-center gap-1 text-sm font-medium',
          price ? 'text-[#e94560]' : 'text-white/80 hover:text-white'
        )}
      >
        {price ? price : cta}
        <ChevronRight className="w-4 h-4" />
      </Link>
    </motion.div>
  );
}

export function HeroPage() {
  const [remainingChats, setRemainingChats] = useState(3);

  // 오늘 날짜
  const today = new Date();
  const dateStr = `${today.getFullYear()}.${String(today.getMonth() + 1).padStart(2, '0')}.${String(today.getDate()).padStart(2, '0')}`;
  const dayNames = ['일', '월', '화', '수', '목', '금', '토'];
  const dayStr = dayNames[today.getDay()];

  return (
    <div className={cn('min-h-screen', colors.bgHero)}>
      {/* 오늘의 운세 섹션 */}
      <motion.section
        className="pt-8 pb-6 px-4"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
      >
        <div className="max-w-4xl mx-auto">
          <div className="bg-white/5 border border-white/10 rounded-2xl p-6 backdrop-blur-sm">
            {/* 헤더 */}
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-white/90 font-medium flex items-center gap-2">
                🎯 오늘의 운세
              </h2>
              <span className="text-white/50 text-sm">{dateStr} {dayStr}</span>
            </div>

            {/* 메인 운세 */}
            <div className="text-center py-4">
              <motion.div
                className="text-xl font-bold text-white mb-2"
                animate={{ scale: [1, 1.02, 1] }}
                transition={{ duration: 2, repeat: Infinity }}
              >
                ✨ 목(木) 에너지 상승일 ✨
              </motion.div>
              <p className="text-white/70">새로운 시작에 유리한 하루입니다</p>
            </div>

            {/* 행운 아이템 */}
            <div className="flex justify-center gap-6 py-4 text-white/60 text-sm">
              <div className="flex items-center gap-1">
                <span>🎨</span> 파랑
              </div>
              <div className="flex items-center gap-1">
                <span>🔢</span> 7
              </div>
              <div className="flex items-center gap-1">
                <span>🧭</span> 동쪽
              </div>
              <div className="flex items-center gap-1">
                <span>⏰</span> 오전 9-11시
              </div>
            </div>

            {/* 시너지 스코어 미니뷰 */}
            <Link href="/saju/synergy">
              <motion.div
                className="mt-4 p-4 bg-gradient-to-r from-purple-500/20 to-pink-500/20 rounded-xl border border-purple-500/30"
                whileHover={{ scale: 1.02 }}
              >
                <div className="flex justify-between items-center">
                  <div className="flex items-center gap-2">
                    <span className="text-lg">📊</span>
                    <span className="text-white font-medium">나의 시너지:</span>
                    <span className="text-2xl font-bold text-pink-400">
                      <AnimatedNumber value={87} />점
                    </span>
                  </div>
                  <ChevronRight className="w-5 h-5 text-white/50" />
                </div>
                <div className="mt-2 text-xs text-white/50">
                  사주 92 · MBTI 86 · 별자리 85 · 혈액형 78
                </div>
              </motion.div>
            </Link>
          </div>
        </div>
      </motion.section>

      {/* AI 사주 상담 섹션 */}
      <motion.section
        className="py-6 px-4"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.3, duration: 0.6 }}
      >
        <div className="max-w-4xl mx-auto">
          <div className="bg-gradient-to-br from-[#533483]/30 to-[#e94560]/20 border-2 border-[#e94560]/30 rounded-2xl p-6 backdrop-blur-sm">
            {/* 헤더 */}
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-white font-bold text-lg flex items-center gap-2">
                💬 AI 사주 상담사
              </h2>
              <span className="px-2 py-1 bg-[#e94560]/20 text-[#e94560] text-xs rounded-full">
                ✨ 핵심 기능
              </span>
            </div>

            {/* 소개 메시지 */}
            <div className="text-center py-4 text-white/80">
              <p className="text-lg italic">
                "오늘 중요한 결정이 있으신가요?
              </p>
              <p className="text-lg italic">
                당신의 사주를 기반으로 최적의 답을 드립니다"
              </p>
            </div>

            {/* 시나리오 버튼 */}
            <div className="grid grid-cols-5 gap-2 my-6">
              {SCENARIOS.map((scenario) => (
                <ScenarioButton
                  key={scenario.id}
                  scenario={scenario}
                  onClick={() => {}}
                />
              ))}
            </div>

            {/* CTA 버튼 */}
            <Link href="/saju/chat">
              <motion.button
                className={cn(
                  'w-full py-4 rounded-xl font-bold text-white text-lg',
                  'bg-gradient-to-r from-[#e94560] to-[#533483]',
                  'flex items-center justify-center gap-2'
                )}
                animate={{ scale: [1, 1.02, 1] }}
                transition={{ duration: 2, repeat: Infinity }}
                whileHover={{ scale: 1.03 }}
                whileTap={{ scale: 0.98 }}
              >
                <Mic className="w-5 h-5" />
                무료로 상담 시작하기 (오늘 {remainingChats}회 남음)
              </motion.button>
            </Link>
          </div>
        </div>
      </motion.section>

      {/* 나의 분석 섹션 */}
      <section className="py-6 px-4">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-white font-bold text-lg mb-4 flex items-center gap-2">
            🔮 나의 분석
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <AnalysisCard
              icon="✨"
              title="사주 분석"
              features={['6장 카드', '오행/용신']}
              cta="보기"
              href="/saju/result"
            />
            <AnalysisCard
              icon="📅"
              title="운세 캘린더"
              features={['월별 흐름', '액션플랜']}
              cta="보기"
              href="/saju/calendar"
            />
            <AnalysisCard
              icon="💑"
              title="궁합 분석"
              features={['커플/비즈', '가족 궁합']}
              cta="분석하기"
              href="/saju/compatibility"
              price="9,900원~"
            />
          </div>
        </div>
      </section>

      {/* 정통 사주 심화 섹션 */}
      <section className="py-6 px-4">
        <div className="max-w-4xl mx-auto">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-white font-bold text-lg flex items-center gap-2">
              🏛️ 정통 사주 심화
            </h2>
            <Link href="/saju/advanced" className="text-white/50 text-sm flex items-center gap-1">
              더보기 <ChevronRight className="w-4 h-4" />
            </Link>
          </div>

          <div className="flex gap-3 overflow-x-auto pb-2">
            {TRADITIONAL_ITEMS.map((item) => (
              <motion.div
                key={item.id}
                className={cn(
                  'flex-shrink-0 w-20 h-24 rounded-xl flex flex-col items-center justify-center gap-2',
                  'bg-white/5 border border-white/10'
                )}
                whileHover={{ scale: 1.05 }}
              >
                <span className="text-2xl">{item.icon}</span>
                <span className="text-xs text-white/80">{item.label}</span>
                {item.locked ? (
                  <Lock className="w-3 h-3 text-white/30" />
                ) : (
                  <Unlock className="w-3 h-3 text-green-400" />
                )}
              </motion.div>
            ))}
            <motion.div
              className={cn(
                'flex-shrink-0 w-20 h-24 rounded-xl flex flex-col items-center justify-center',
                'bg-white/5 border border-white/10 border-dashed'
              )}
              whileHover={{ scale: 1.05 }}
            >
              <span className="text-white/40 text-sm">+2</span>
            </motion.div>
          </div>
        </div>
      </section>

      {/* 프리미엄 섹션 */}
      <section className="py-6 px-4 pb-12">
        <div className="max-w-4xl mx-auto">
          <motion.div
            className="bg-gradient-to-r from-yellow-500/20 to-amber-500/20 border border-yellow-500/30 rounded-2xl p-6"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <div className="flex items-center gap-2 mb-4">
              <Crown className="w-6 h-6 text-yellow-400" />
              <h2 className="text-white font-bold text-lg">프리미엄</h2>
            </div>

            <p className="text-white/80 mb-4">
              월 9,900원으로 모든 분석 + AI 상담 무제한
            </p>

            <div className="grid grid-cols-2 gap-2 mb-6 text-sm text-white/70">
              <div className="flex items-center gap-2">
                <Star className="w-4 h-4 text-yellow-400" />
                정통 사주 전체 분석
              </div>
              <div className="flex items-center gap-2">
                <Star className="w-4 h-4 text-yellow-400" />
                AI 상담 무제한
              </div>
              <div className="flex items-center gap-2">
                <Star className="w-4 h-4 text-yellow-400" />
                월별 액션플랜
              </div>
              <div className="flex items-center gap-2">
                <Star className="w-4 h-4 text-yellow-400" />
                궁합 분석 포함
              </div>
            </div>

            <Link href="/pricing">
              <motion.button
                className={cn(
                  'w-full py-3 rounded-xl font-bold text-black',
                  'bg-gradient-to-r from-yellow-400 to-amber-400'
                )}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                7일 무료 체험 시작
              </motion.button>
            </Link>
          </motion.div>
        </div>
      </section>
    </div>
  );
}

export default HeroPage;
