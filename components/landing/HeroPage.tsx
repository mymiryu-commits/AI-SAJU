'use client';

import { motion } from 'framer-motion';
import { useEffect, useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import {
  Heart, Briefcase, Wallet, Activity, Users,
  Sparkles, MessageCircle, Crown, ArrowRight,
  Star, Lock, Unlock, Moon, Sun,
  Coins, Gift, Zap, Eye, Calendar, UserCheck,
  TrendingUp, Compass, Brain, Flame, Baby,
  Clock, Shield, BookOpen, FileText, CheckCircle,
  ChevronRight, Infinity, Target, Gem, BarChart3,
  AlertTriangle, Lightbulb, Award
} from 'lucide-react';
import { cn } from '@/lib/utils';

// ===== 타입 정의 =====

// 접근 타입
type AccessType = 'free' | 'daily_limit' | 'points' | 'premium' | 'subscription';

interface ContentItem {
  id: string;
  chapter: number;
  title: string;
  subtitle: string;
  description: string;
  href: string;
  imagePath: string;
  imageAlt: string;
  accessType: AccessType;
  points?: number;           // 포인트 차감형
  dailyLimit?: number;       // 일일 무료 횟수
  premiumOnly?: boolean;     // 프리미엄 전용
  badge?: string;
  gradient: string;
  icon: React.ElementType;
  features: string[];
  isNew?: boolean;           // 신규 표시
  isHot?: boolean;           // 인기 표시
}

interface PartSection {
  id: string;
  partNumber: number;
  title: string;
  subtitle: string;
  description: string;
  gradient: string;
  icon: React.ElementType;
  items: ContentItem[];
}

// ===== 컨텐츠 데이터 =====

// PART 1: 나를 읽다 (본성 분석)
const PART1_ITEMS: ContentItem[] = [
  {
    id: 'saju-structure',
    chapter: 1,
    title: '사주의 구조',
    subtitle: '네 기둥의 비밀',
    description: '사주 네 기둥의 의미와 천간·지지의 작용을 시각화된 도표로 이해합니다.',
    href: '/fortune/saju?section=structure',
    imagePath: '/images/hero/saju-structure.png',
    imageAlt: '사주 구조 분석',
    accessType: 'free',
    badge: '무료',
    gradient: 'from-violet-500 to-purple-600',
    icon: Compass,
    features: ['사주 원국 시각화', '천간·지지 해석', '기초 구조 분석']
  },
  {
    id: 'ilju-essence',
    chapter: 2,
    title: '일주로 보는 본질',
    subtitle: '나의 핵심 성향',
    description: '일주를 통해 근본 기질, 행동 패턴, 타인이 보는 나와 실제 나의 차이를 분석합니다.',
    href: '/fortune/saju?section=ilju',
    imagePath: '/images/hero/ilju-essence.png',
    imageAlt: '일주 본질 분석',
    accessType: 'free',
    badge: '무료',
    gradient: 'from-indigo-500 to-blue-600',
    icon: Eye,
    features: ['핵심 성향 정의', '행동 패턴', '에너지 충전법']
  },
  {
    id: 'ohang-balance',
    chapter: 3,
    title: '오행 밸런스',
    subtitle: '나의 기운 분석',
    description: '오행 구성의 과다·부족을 분석하고 보완 실천법(색상, 방위, 음식)을 제안합니다.',
    href: '/fortune/saju?section=ohang',
    imagePath: '/images/hero/ohang-balance.png',
    imageAlt: '오행 밸런스 분석',
    accessType: 'daily_limit',
    dailyLimit: 3,
    badge: '매일 3회',
    gradient: 'from-emerald-500 to-green-600',
    icon: BarChart3,
    features: ['오행 구성표', '보완 기운', '실천 가이드'],
    isHot: true
  },
  {
    id: 'sipsung',
    chapter: 4,
    title: '십성의 배치',
    subtitle: '사회적 페르소나',
    description: '십성의 배치를 통해 사회적 페르소나와 내면의 욕구, 시기별 에너지를 분석합니다.',
    href: '/fortune/saju?section=sipsung',
    imagePath: '/images/hero/sipsung.png',
    imageAlt: '십성 분석',
    accessType: 'points',
    points: 100,
    badge: '100P',
    gradient: 'from-amber-500 to-yellow-600',
    icon: Star,
    features: ['십성 배치도', '시기별 에너지', '페르소나 분석']
  },
  {
    id: 'sibiunsung',
    chapter: 5,
    title: '십이운성 리듬',
    subtitle: '생애 에너지 곡선',
    description: '십이운성의 흐름을 그래프로 시각화하고 각 시기별 전략적 접근법을 안내합니다.',
    href: '/fortune/saju?section=sibiunsung',
    imagePath: '/images/hero/sibiunsung.png',
    imageAlt: '십이운성 분석',
    accessType: 'points',
    points: 150,
    badge: '150P',
    gradient: 'from-cyan-500 to-blue-600',
    icon: TrendingUp,
    features: ['운성 흐름도', '에너지 그래프', '시기별 전략']
  },
  {
    id: 'sinsal-guin',
    chapter: 6,
    title: '신살과 귀인',
    subtitle: '길흉의 작용',
    description: '길신·흉신의 작용법, 귀인 유형과 만나는 시기, 피해야 할 인연을 분석합니다.',
    href: '/fortune/saju?section=sinsal',
    imagePath: '/images/hero/sinsal-guin.png',
    imageAlt: '신살 귀인 분석',
    accessType: 'points',
    points: 200,
    badge: '200P',
    gradient: 'from-rose-500 to-pink-600',
    icon: Shield,
    features: ['길신 활용법', '흉신 회피법', '귀인 시기']
  },
];

// PART 2: 삶을 설계하다 (실용 운세)
const PART2_ITEMS: ContentItem[] = [
  {
    id: 'wealth-fortune',
    chapter: 7,
    title: '재물운과 자산 전략',
    subtitle: '돈의 흐름 읽기',
    description: '재물 획득 유형, 돈이 들어오는 시기와 패턴, 나에게 맞는 재테크 방향을 분석합니다.',
    href: '/fortune/saju?section=wealth',
    imagePath: '/images/hero/wealth-fortune.png',
    imageAlt: '재물운 분석',
    accessType: 'points',
    points: 200,
    badge: '200P',
    gradient: 'from-amber-500 to-yellow-600',
    icon: Wallet,
    features: ['획득 유형 분석', '재테크 방향', '리스크 시점'],
    isHot: true
  },
  {
    id: 'love-marriage',
    chapter: 8,
    title: '연애와 결혼의 흐름',
    subtitle: '인연의 시작과 끝',
    description: '연애 스타일, 이상형과 실제 인연의 차이, 결혼 적기와 가정운을 분석합니다.',
    href: '/fortune/saju?section=love',
    imagePath: '/images/hero/love-marriage.png',
    imageAlt: '연애 결혼운 분석',
    accessType: 'points',
    points: 200,
    badge: '200P',
    gradient: 'from-pink-500 to-rose-600',
    icon: Heart,
    features: ['연애 스타일', '결혼 적기', '가정운 흐름']
  },
  {
    id: 'compatibility',
    chapter: 9,
    title: '궁합 분석 가이드',
    subtitle: '인연의 케미스트리',
    description: '상대방 생년월일시 입력으로 즉석 궁합 점수를 확인하고 보완책을 제시합니다.',
    href: '/fortune/compatibility',
    imagePath: '/images/hero/compatibility.png',
    imageAlt: '궁합 분석',
    accessType: 'points',
    points: 150,
    badge: '150P',
    gradient: 'from-fuchsia-500 to-purple-600',
    icon: Users,
    features: ['즉석 궁합 점수', '궁합 유형', '보완 해결책'],
    isNew: true,
    isHot: true
  },
  {
    id: 'career-fortune',
    chapter: 10,
    title: '직업운과 커리어',
    subtitle: '나에게 맞는 일',
    description: '타고난 업무 재능, 적합 직종, 승진·이직 최적 시기, 사업 적합도를 분석합니다.',
    href: '/fortune/saju?section=career',
    imagePath: '/images/hero/career-fortune.png',
    imageAlt: '직업운 분석',
    accessType: 'points',
    points: 200,
    badge: '200P',
    gradient: 'from-blue-500 to-indigo-600',
    icon: Briefcase,
    features: ['업무 재능', '적합 직종', '승진 시기']
  },
  {
    id: 'health-fortune',
    chapter: 11,
    title: '건강운과 체질',
    subtitle: '오행 기반 관리',
    description: '오행 기반 체질 유형, 주의가 필요한 부위(경향성), 생활 습관을 제안합니다.',
    href: '/fortune/saju?section=health',
    imagePath: '/images/hero/health-fortune.png',
    imageAlt: '건강운 분석',
    accessType: 'points',
    points: 150,
    badge: '150P',
    gradient: 'from-emerald-500 to-teal-600',
    icon: Activity,
    features: ['체질 유형', '관리 포인트', '생활 습관']
  },
  {
    id: 'children-fortune',
    chapter: 12,
    title: '자녀운과 양육',
    subtitle: '부모-자녀 궁합',
    description: '자녀와의 인연 흐름, 유형별 양육 포인트, 부모-자녀 궁합과 소통법을 안내합니다.',
    href: '/fortune/saju?section=children',
    imagePath: '/images/hero/children-fortune.png',
    imageAlt: '자녀운 분석',
    accessType: 'points',
    points: 200,
    badge: '200P',
    gradient: 'from-orange-500 to-amber-600',
    icon: Baby,
    features: ['자녀 인연', '양육 포인트', '소통법'],
    isNew: true
  },
];

// PART 3: 미래를 준비하다 (시간 운세)
const PART3_ITEMS: ContentItem[] = [
  {
    id: 'daeun',
    chapter: 13,
    title: '대운 - 10년 설계',
    subtitle: '인생의 큰 그림',
    description: '대운 타임라인 시각화, 현재 대운 키워드, 인생 최대 기회·위기 시점을 분석합니다.',
    href: '/fortune/saju?section=daeun',
    imagePath: '/images/hero/daeun.png',
    imageAlt: '대운 분석',
    accessType: 'points',
    points: 300,
    badge: '300P',
    gradient: 'from-violet-500 to-purple-600',
    icon: Clock,
    features: ['대운 타임라인', '전환 시점', '대비 전략'],
    isHot: true
  },
  {
    id: 'yearly-fortune',
    chapter: 14,
    title: '연운 - 올해와 5년',
    subtitle: '2025년 운세 총평',
    description: '올해 운세 총평, 월별 운세 캘린더(12개월), 향후 5년 핵심 전환점을 제공합니다.',
    href: '/fortune/saju?section=yearly',
    imagePath: '/images/hero/yearly-fortune.png',
    imageAlt: '연운 분석',
    accessType: 'points',
    points: 250,
    badge: '250P',
    gradient: 'from-indigo-500 to-blue-600',
    icon: Calendar,
    features: ['2025 총평', '월별 캘린더', '5년 전망'],
    isNew: true
  },
  {
    id: 'samjae',
    chapter: 15,
    title: '삼재와 액운 대비',
    subtitle: '위험 시기 관리',
    description: '삼재 해당 여부와 시기, 기간 중 실천 수칙, 액운 완화 가이드를 제공합니다.',
    href: '/fortune/saju?section=samjae',
    imagePath: '/images/hero/samjae.png',
    imageAlt: '삼재 액운 분석',
    accessType: 'points',
    points: 200,
    badge: '200P',
    gradient: 'from-red-500 to-rose-600',
    icon: AlertTriangle,
    features: ['삼재 시기', '실천 수칙', '완화 가이드']
  },
];

// 무료/입문 컨텐츠 (프롤로그 + 기본)
const FREE_ITEMS: ContentItem[] = [
  {
    id: 'today-fortune',
    chapter: 0,
    title: '오늘의 운세',
    subtitle: '매일 새로운 가이드',
    description: '오늘 하루의 길흉화복을 AI가 분석합니다. 럭키 컬러, 행운의 숫자, 시간대별 운세까지!',
    href: '/fortune/free',
    imagePath: '/images/hero/today-fortune.png',
    imageAlt: '오늘의 운세',
    accessType: 'free',
    badge: '무료',
    gradient: 'from-violet-500 to-purple-600',
    icon: Sun,
    features: ['일일 운세', '럭키 아이템', '시간대별 운세']
  },
  {
    id: 'ai-consultation',
    chapter: 0,
    title: 'AI 사주 상담',
    subtitle: '실시간 1:1 대화',
    description: '연애, 커리어, 재테크 등 궁금한 것을 AI 상담사에게 직접 물어보세요.',
    href: '/saju/chat',
    imagePath: '/images/hero/ai-consultation.png',
    imageAlt: 'AI 사주 상담',
    accessType: 'daily_limit',
    dailyLimit: 3,
    badge: '매일 3회',
    gradient: 'from-rose-500 to-pink-600',
    icon: MessageCircle,
    features: ['실시간 상담', '맞춤 조언', '대화 기록'],
    isHot: true
  },
];

// PART 섹션 데이터
const PART_SECTIONS: PartSection[] = [
  {
    id: 'part1',
    partNumber: 1,
    title: '나를 읽다',
    subtitle: '본성 분석',
    description: '사주 구조부터 십성, 운성, 신살까지 나의 타고난 본질을 심층 분석합니다.',
    gradient: 'from-violet-500 to-purple-600',
    icon: Eye,
    items: PART1_ITEMS,
  },
  {
    id: 'part2',
    partNumber: 2,
    title: '삶을 설계하다',
    subtitle: '실용 운세',
    description: '재물, 연애, 직업, 건강, 자녀까지 실생활에 적용 가능한 운세 분석입니다.',
    gradient: 'from-amber-500 to-orange-600',
    icon: Target,
    items: PART2_ITEMS,
  },
  {
    id: 'part3',
    partNumber: 3,
    title: '미래를 준비하다',
    subtitle: '시간 운세',
    description: '대운, 연운, 삼재까지 시간의 흐름 속에서 기회와 위기를 파악합니다.',
    gradient: 'from-indigo-500 to-blue-600',
    icon: Clock,
    items: PART3_ITEMS,
  },
];

// ===== 애니메이션 =====
const fadeIn = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0 }
};

const staggerContainer = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.08 }
  }
};

// ===== 컴포넌트 =====

// 접근 타입별 배지 렌더링
function AccessBadge({ item }: { item: ContentItem }) {
  const badgeStyles = {
    free: 'bg-emerald-500/20 text-emerald-300 border-emerald-500/30',
    daily_limit: 'bg-sky-500/20 text-sky-300 border-sky-500/30',
    points: 'bg-amber-500/20 text-amber-300 border-amber-500/30',
    premium: 'bg-purple-500/20 text-purple-300 border-purple-500/30',
    subscription: 'bg-rose-500/20 text-rose-300 border-rose-500/30',
  };

  const icons = {
    free: Gift,
    daily_limit: Clock,
    points: Coins,
    premium: Crown,
    subscription: Infinity,
  };

  const Icon = icons[item.accessType];

  return (
    <span className={cn(
      'px-3 py-1.5 text-xs font-bold rounded-full backdrop-blur-md shadow-lg border',
      badgeStyles[item.accessType]
    )}>
      <span className="flex items-center gap-1.5">
        <Icon className="w-3 h-3" />
        {item.badge}
      </span>
    </span>
  );
}

// 컨텐츠 카드 컴포넌트
function ContentCard({ item }: { item: ContentItem }) {
  const Icon = item.icon;

  return (
    <motion.div
      className="group relative"
      variants={fadeIn}
      transition={{ duration: 0.5 }}
    >
      <Link href={item.href}>
        <div className={cn(
          'relative h-full rounded-2xl overflow-hidden',
          'bg-gradient-to-br from-white/[0.06] to-white/[0.02]',
          'border border-white/[0.1] hover:border-white/[0.2]',
          'transition-all duration-500 hover:-translate-y-2 hover:shadow-2xl',
          'cursor-pointer'
        )}>
          {/* 이미지 영역 */}
          <div className="relative w-full aspect-[16/9] overflow-hidden">
            <div className={cn(
              'absolute inset-0 bg-gradient-to-br',
              item.gradient,
              'flex items-center justify-center'
            )}>
              <Icon className="w-12 h-12 text-white/30" />
            </div>

            {/* 오버레이 */}
            <div className="absolute inset-0 bg-gradient-to-t from-[#0a0a0f] via-transparent to-transparent" />

            {/* 배지들 */}
            <div className="absolute top-3 right-3 flex flex-col gap-2">
              <AccessBadge item={item} />
              {item.isNew && (
                <span className="px-2 py-1 text-[10px] font-bold rounded-full bg-rose-500/80 text-white">
                  NEW
                </span>
              )}
              {item.isHot && (
                <span className="px-2 py-1 text-[10px] font-bold rounded-full bg-orange-500/80 text-white flex items-center gap-1">
                  <Flame className="w-3 h-3" /> HOT
                </span>
              )}
            </div>

            {/* 챕터 번호 */}
            {item.chapter > 0 && (
              <div className="absolute top-3 left-3">
                <span className="px-2 py-1 text-[10px] font-medium rounded bg-black/50 text-white/70 backdrop-blur-sm">
                  제{item.chapter}장
                </span>
              </div>
            )}

            {/* 아이콘 */}
            <div className="absolute bottom-3 left-3">
              <div className={cn(
                'w-10 h-10 rounded-xl flex items-center justify-center',
                'bg-gradient-to-br', item.gradient,
                'shadow-lg border border-white/20'
              )}>
                <Icon className="w-5 h-5 text-white" />
              </div>
            </div>
          </div>

          {/* 컨텐츠 */}
          <div className="p-4">
            <h3 className="text-base font-bold text-white mb-0.5 group-hover:text-white/90 transition-colors line-clamp-1">
              {item.title}
            </h3>
            <p className="text-xs text-white/50 mb-2">{item.subtitle}</p>
            <p className="text-xs text-white/40 mb-3 line-clamp-2 leading-relaxed">
              {item.description}
            </p>

            {/* 특징 태그 */}
            <div className="flex flex-wrap gap-1.5 mb-3">
              {item.features.slice(0, 3).map((feature, i) => (
                <span
                  key={i}
                  className="px-2 py-0.5 text-[10px] rounded-full bg-white/[0.05] text-white/50 border border-white/[0.08]"
                >
                  {feature}
                </span>
              ))}
            </div>

            {/* CTA */}
            <div className="flex items-center justify-between">
              <span className="flex items-center gap-1.5 text-xs font-medium text-white/70 group-hover:text-white transition-colors">
                {item.accessType === 'free' ? '무료로 보기' :
                 item.accessType === 'daily_limit' ? '시작하기' : '분석받기'}
                <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
              </span>

              {item.accessType === 'points' && item.points && (
                <span className="flex items-center gap-1 text-xs text-amber-400/80">
                  <Coins className="w-3.5 h-3.5" />
                  {item.points}P
                </span>
              )}
            </div>
          </div>

          {/* Hover glow */}
          <div className={cn(
            'absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 -z-10',
            'bg-gradient-to-br', item.gradient,
            'blur-3xl'
          )} />
        </div>
      </Link>
    </motion.div>
  );
}

// 사용자 정보 입력 배너
function UserInfoBanner() {
  return (
    <motion.div
      className={cn(
        'relative p-5 rounded-2xl overflow-hidden',
        'bg-gradient-to-r from-violet-500/10 via-purple-500/10 to-indigo-500/10',
        'border border-violet-500/20'
      )}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.2 }}
    >
      <div className="flex flex-col md:flex-row items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          <div className="w-11 h-11 rounded-xl bg-gradient-to-br from-violet-500 to-purple-600 flex items-center justify-center">
            <UserCheck className="w-5 h-5 text-white" />
          </div>
          <div>
            <h3 className="text-base font-semibold text-white">사주 정보를 입력하세요</h3>
            <p className="text-sm text-white/50">한 번 입력하면 모든 분석을 바로 이용할 수 있어요!</p>
          </div>
        </div>
        <Link href="/fortune/saju">
          <motion.button
            className={cn(
              'px-5 py-2.5 rounded-xl font-medium text-sm',
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
function FreeSection() {
  return (
    <section className="py-10 px-4">
      <div className="max-w-6xl mx-auto">
        <motion.div
          className="flex items-center gap-3 mb-6"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
        >
          <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-emerald-500 to-green-600 flex items-center justify-center">
            <Gift className="w-4 h-4 text-white" />
          </div>
          <div>
            <h2 className="text-xl font-bold text-white">무료로 시작하기</h2>
            <p className="text-xs text-white/40">로그인만 하면 바로 이용 가능해요</p>
          </div>
        </motion.div>

        <motion.div
          className="grid md:grid-cols-2 gap-5"
          variants={staggerContainer}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
        >
          {FREE_ITEMS.map((item) => (
            <ContentCard key={item.id} item={item} />
          ))}
        </motion.div>
      </div>
    </section>
  );
}

// PART 섹션 컴포넌트
function PartSection({ section, isExpanded = false }: { section: PartSection; isExpanded?: boolean }) {
  const [expanded, setExpanded] = useState(isExpanded);
  const Icon = section.icon;
  const displayItems = expanded ? section.items : section.items.slice(0, 4);

  return (
    <section className="py-10 px-4">
      <div className="max-w-6xl mx-auto">
        {/* 섹션 헤더 */}
        <motion.div
          className="mb-6"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
        >
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className={cn(
                'w-10 h-10 rounded-xl flex items-center justify-center',
                'bg-gradient-to-br', section.gradient
              )}>
                <Icon className="w-5 h-5 text-white" />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <span className={cn(
                    'text-xs font-bold px-2 py-0.5 rounded',
                    'bg-gradient-to-r', section.gradient,
                    'text-white'
                  )}>
                    PART {section.partNumber}
                  </span>
                  <h2 className="text-xl font-bold text-white">{section.title}</h2>
                </div>
                <p className="text-xs text-white/40 mt-0.5">{section.description}</p>
              </div>
            </div>

            {section.items.length > 4 && (
              <button
                onClick={() => setExpanded(!expanded)}
                className="flex items-center gap-1 text-sm text-white/50 hover:text-white transition-colors"
              >
                {expanded ? '접기' : `전체 보기 (${section.items.length})`}
                <ChevronRight className={cn(
                  'w-4 h-4 transition-transform',
                  expanded && 'rotate-90'
                )} />
              </button>
            )}
          </div>
        </motion.div>

        {/* 카드 그리드 */}
        <motion.div
          className="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4"
          variants={staggerContainer}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
        >
          {displayItems.map((item) => (
            <ContentCard key={item.id} item={item} />
          ))}
        </motion.div>
      </div>
    </section>
  );
}

// 프리미엄 멤버십 배너
function PremiumBanner() {
  return (
    <section className="py-10 px-4">
      <div className="max-w-6xl mx-auto">
        <motion.div
          className="relative p-8 md:p-10 rounded-[2rem] overflow-hidden"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
        >
          {/* Background */}
          <div className="absolute inset-0 bg-gradient-to-br from-amber-500/10 via-yellow-500/5 to-orange-500/10" />
          <div className="absolute inset-0 bg-[#0a0a0f]/70 backdrop-blur-xl" />
          <div className="absolute inset-0 border border-amber-500/20 rounded-[2rem]" />
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[400px] h-[200px] bg-amber-500/10 rounded-full blur-[100px]" />

          <div className="relative z-10">
            <div className="flex flex-col md:flex-row items-center justify-between gap-8">
              {/* 왼쪽: 내용 */}
              <div className="text-center md:text-left">
                <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-amber-500/20 border border-amber-500/30 mb-4">
                  <Crown className="w-4 h-4 text-amber-400" />
                  <span className="text-sm font-medium text-amber-300">PREMIUM</span>
                </div>
                <h2 className="text-2xl md:text-3xl font-bold text-white mb-2">
                  프리미엄 <span className="bg-gradient-to-r from-amber-400 to-yellow-400 bg-clip-text text-transparent">전체 분석</span>
                </h2>
                <p className="text-white/50 mb-4 max-w-md">
                  15장 전체 분석 + 월별 운세 + 무제한 AI 상담
                </p>

                {/* 특징 */}
                <div className="flex flex-wrap gap-3 justify-center md:justify-start">
                  {[
                    { icon: FileText, text: '15장 전체' },
                    { icon: Calendar, text: '월별 운세' },
                    { icon: MessageCircle, text: 'AI 무제한' },
                    { icon: Infinity, text: '횟수 제한 없음' },
                  ].map((f, i) => (
                    <div key={i} className="flex items-center gap-1.5 text-sm text-white/60">
                      <f.icon className="w-4 h-4 text-amber-400/80" />
                      <span>{f.text}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* 오른쪽: CTA */}
              <div className="text-center">
                <div className="text-3xl font-bold text-white mb-1">
                  ₩9,900<span className="text-lg text-white/50 font-normal">/월</span>
                </div>
                <p className="text-xs text-white/40 mb-4">첫 7일 무료 체험</p>
                <Link href="/pricing">
                  <motion.button
                    className={cn(
                      'px-8 py-3.5 rounded-xl font-semibold',
                      'bg-gradient-to-r from-amber-500 to-yellow-500',
                      'text-black hover:from-amber-400 hover:to-yellow-400',
                      'shadow-lg shadow-amber-500/25'
                    )}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    무료 체험 시작
                  </motion.button>
                </Link>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}

// 업셀링 포인트 안내
function UpsellSection() {
  const upsells = [
    {
      icon: Users,
      title: '상세 궁합 분석',
      desc: '연인, 가족, 동료와의 깊은 궁합 분석',
      points: 300,
      gradient: 'from-pink-500 to-rose-600'
    },
    {
      icon: Calendar,
      title: '월별 상세 운세',
      desc: '매월 갱신되는 상세 운세 리포트',
      points: 500,
      gradient: 'from-indigo-500 to-blue-600'
    },
    {
      icon: Award,
      title: '프리미엄 서비스',
      desc: '작명, 택일, 전문가 상담 연결',
      points: 1000,
      gradient: 'from-purple-500 to-violet-600'
    },
  ];

  return (
    <section className="py-10 px-4">
      <div className="max-w-6xl mx-auto">
        <motion.div
          className="mb-6"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
        >
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-purple-500 to-violet-600 flex items-center justify-center">
              <Gem className="w-4 h-4 text-white" />
            </div>
            <div>
              <h2 className="text-xl font-bold text-white">추가 분석 서비스</h2>
              <p className="text-xs text-white/40">더 깊은 인사이트를 얻어보세요</p>
            </div>
          </div>
        </motion.div>

        <motion.div
          className="grid md:grid-cols-3 gap-4"
          variants={staggerContainer}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
        >
          {upsells.map((item, i) => (
            <motion.div
              key={i}
              className={cn(
                'relative p-5 rounded-2xl overflow-hidden',
                'bg-gradient-to-br from-white/[0.06] to-white/[0.02]',
                'border border-white/[0.1] hover:border-white/[0.2]',
                'transition-all duration-300 hover:-translate-y-1'
              )}
              variants={fadeIn}
            >
              <div className={cn(
                'w-10 h-10 rounded-xl flex items-center justify-center mb-4',
                'bg-gradient-to-br', item.gradient
              )}>
                <item.icon className="w-5 h-5 text-white" />
              </div>
              <h3 className="text-base font-bold text-white mb-1">{item.title}</h3>
              <p className="text-sm text-white/50 mb-4">{item.desc}</p>
              <div className="flex items-center justify-between">
                <span className="flex items-center gap-1.5 text-sm text-amber-400">
                  <Coins className="w-4 h-4" />
                  {item.points}P
                </span>
                <Link href="/pricing" className="text-sm text-white/50 hover:text-white transition-colors flex items-center gap-1">
                  자세히 <ArrowRight className="w-3.5 h-3.5" />
                </Link>
              </div>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}

// 메인 컴포넌트
export function HeroPage() {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const today = new Date();
  const dateStr = `${today.getFullYear()}.${String(today.getMonth() + 1).padStart(2, '0')}.${String(today.getDate()).padStart(2, '0')}`;
  const dayNames = ['일', '월', '화', '수', '목', '금', '토'];
  const dayStr = dayNames[today.getDay()];

  if (!mounted) return null;

  return (
    <div className="min-h-screen bg-[#0a0a0f] overflow-hidden">
      {/* Background */}
      <div className="fixed inset-0 pointer-events-none">
        <div className="absolute top-0 left-1/4 w-[600px] h-[600px] bg-violet-600/10 rounded-full blur-[150px]" />
        <div className="absolute bottom-0 right-1/4 w-[500px] h-[500px] bg-indigo-600/10 rounded-full blur-[150px]" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-purple-600/5 rounded-full blur-[200px]" />
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
        <section className="pt-10 pb-4 px-4">
          <div className="max-w-6xl mx-auto">
            <motion.div
              className="text-center mb-6"
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
            >
              <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-white/[0.03] border border-white/[0.08] mb-4">
                <Moon className="w-3.5 h-3.5 text-violet-400" />
                <span className="text-xs text-white/60">{dateStr} {dayStr}요일</span>
              </div>

              <h1 className="text-3xl md:text-4xl lg:text-5xl font-light text-white mb-3 tracking-tight">
                AI <span className="font-semibold bg-gradient-to-r from-violet-400 via-purple-400 to-indigo-400 bg-clip-text text-transparent">프리미엄 사주</span>
              </h1>

              <p className="text-base text-white/40 font-light max-w-lg mx-auto">
                기문사주학 200년 계보의 정통 명리학을
                <br />
                AI가 15장 분량으로 심층 분석합니다
              </p>
            </motion.div>

            <UserInfoBanner />
          </div>
        </section>

        {/* 무료 섹션 */}
        <FreeSection />

        {/* PART 섹션들 */}
        {PART_SECTIONS.map((section) => (
          <PartSection key={section.id} section={section} />
        ))}

        {/* 프리미엄 배너 */}
        <PremiumBanner />

        {/* 업셀링 섹션 */}
        <UpsellSection />

        {/* Bottom Spacer */}
        <div className="h-20" />
      </div>
    </div>
  );
}

export default HeroPage;
