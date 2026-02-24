'use client';

import { useState, useEffect, useCallback } from 'react';
import { Link } from '@/i18n/routing';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import {
  Sparkles,
  Heart,
  Briefcase,
  Star,
  ArrowRight,
  RotateCcw,
  Shuffle,
  Eye,
  Clock,
  Flame,
  Droplets,
  Wind,
  Mountain,
  Crown,
  BookOpen,
} from 'lucide-react';
import {
  drawRandomCards,
  TarotCardInfo,
  SpreadType,
  SPREAD_DEFINITIONS,
  DrawnCard,
  SUIT_DATA,
  interpretCard,
  MAJOR_MEANINGS,
  getCardImageUrl,
  generateEpicStorytelling,
} from '@/lib/fortune/tarot';
import Image from 'next/image';

// ===== 신비로운 배경 효과 (강화) =====
const MysticBackground = () => (
  <div className="absolute inset-0 overflow-hidden pointer-events-none">
    {/* 별빛 파티클 */}
    {Array.from({ length: 60 }).map((_, i) => (
      <div
        key={`star-${i}`}
        className="absolute rounded-full bg-white animate-twinkle"
        style={{
          width: `${1 + Math.random() * 2.5}px`,
          height: `${1 + Math.random() * 2.5}px`,
          top: `${Math.random() * 100}%`,
          left: `${Math.random() * 100}%`,
          animationDelay: `${Math.random() * 4}s`,
          animationDuration: `${2 + Math.random() * 3}s`,
        }}
      />
    ))}

    {/* 큰 빛나는 별들 */}
    {Array.from({ length: 10 }).map((_, i) => (
      <div
        key={`glow-${i}`}
        className="absolute animate-pulse-slow"
        style={{
          top: `${10 + Math.random() * 80}%`,
          left: `${5 + Math.random() * 90}%`,
          animationDelay: `${Math.random() * 4}s`,
        }}
      >
        <div className="w-1.5 h-1.5 bg-yellow-200 rounded-full shadow-[0_0_12px_5px_rgba(253,224,71,0.4)]" />
      </div>
    ))}

    {/* 성운 오브 */}
    {Array.from({ length: 6 }).map((_, i) => (
      <div
        key={`orb-${i}`}
        className="absolute rounded-full animate-float-slow opacity-20"
        style={{
          width: `${120 + Math.random() * 200}px`,
          height: `${120 + Math.random() * 200}px`,
          background: `radial-gradient(circle, ${
            ['rgba(147,51,234,0.4)', 'rgba(59,130,246,0.3)', 'rgba(236,72,153,0.3)', 'rgba(99,102,241,0.3)', 'rgba(251,191,36,0.2)', 'rgba(139,92,246,0.3)'][i % 6]
          } 0%, transparent 70%)`,
          top: `${Math.random() * 100}%`,
          left: `${Math.random() * 100}%`,
          animationDelay: `${Math.random() * 6}s`,
          animationDuration: `${10 + Math.random() * 5}s`,
        }}
      />
    ))}

    {/* 성좌 연결선 */}
    <svg className="absolute inset-0 w-full h-full opacity-[0.07]">
      <defs>
        <linearGradient id="lineGrad" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#a855f7" />
          <stop offset="50%" stopColor="#fbbf24" />
          <stop offset="100%" stopColor="#ec4899" />
        </linearGradient>
      </defs>
      {Array.from({ length: 8 }).map((_, i) => (
        <line
          key={i}
          x1={`${15 + Math.random() * 35}%`}
          y1={`${15 + Math.random() * 35}%`}
          x2={`${50 + Math.random() * 35}%`}
          y2={`${50 + Math.random() * 35}%`}
          stroke="url(#lineGrad)"
          strokeWidth="1"
        />
      ))}
    </svg>
  </div>
);

// 원소 아이콘
const ElementIcon = ({ element, className = '' }: { element?: string; className?: string }) => {
  switch (element) {
    case 'fire': return <Flame className={`text-orange-500 ${className}`} />;
    case 'earth': return <Mountain className={`text-amber-700 ${className}`} />;
    case 'air': return <Wind className={`text-sky-500 ${className}`} />;
    case 'water': return <Droplets className={`text-blue-500 ${className}`} />;
    default: return <Star className={className} />;
  }
};

// ===== 타로 카드 컴포넌트 (프리미엄 리디자인) =====
const TarotCard = ({
  card,
  isReversed,
  isFlipped,
  onClick,
  delay = 0,
  size = 'medium',
}: {
  card?: TarotCardInfo;
  isReversed?: boolean;
  isFlipped: boolean;
  onClick?: () => void;
  delay?: number;
  size?: 'small' | 'medium' | 'large';
}) => {
  const [imageError, setImageError] = useState(false);

  const sizeClasses = {
    small: 'w-[5.5rem] h-[8.5rem] md:w-[6.5rem] md:h-[10rem]',
    medium: 'w-[8rem] h-[12.5rem] md:w-[10rem] md:h-[15.5rem]',
    large: 'w-[10rem] h-[15.5rem] md:w-[13rem] md:h-[20rem]',
  };

  const cardBack = (
    <div className="absolute inset-0 rounded-xl overflow-hidden backface-hidden">
      {/* 메인 배경 */}
      <div className="absolute inset-0 bg-gradient-to-br from-slate-900 via-indigo-950 to-purple-950" />

      {/* 홀로그래픽 시머 오버레이 */}
      <div
        className="absolute inset-0 opacity-30"
        style={{
          background: 'linear-gradient(135deg, transparent 20%, rgba(168,85,247,0.3) 35%, rgba(251,191,36,0.3) 50%, rgba(236,72,153,0.2) 65%, transparent 80%)',
          backgroundSize: '300% 300%',
          animation: 'shimmer 4s linear infinite',
        }}
      />

      {/* 골드 이중 테두리 */}
      <div className="absolute inset-0 rounded-xl border-2 border-amber-500/50 shadow-[inset_0_0_30px_rgba(251,191,36,0.08)]" />
      <div className="absolute inset-[4px] rounded-[10px] border border-amber-600/30" />

      {/* 마법진 패턴 */}
      <div className="absolute inset-0 flex items-center justify-center">
        <div className="absolute w-[85%] h-[85%] border border-amber-500/15 rounded-full" />
        <div className="absolute w-[70%] h-[70%] border border-purple-400/25 rounded-full animate-spin-slow" />
        <div className="absolute w-[55%] h-[55%] border border-indigo-400/15 rounded-full animate-magic-rotate" style={{ animationDirection: 'reverse' }} />

        {/* 오각별 패턴 */}
        <svg className="absolute w-[60%] h-[60%] opacity-25" viewBox="0 0 100 100">
          <polygon
            points="50,5 61,40 98,40 68,62 79,97 50,75 21,97 32,62 2,40 39,40"
            fill="none"
            stroke="url(#cardStarGrad)"
            strokeWidth="0.5"
          />
          <defs>
            <linearGradient id="cardStarGrad" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#fbbf24" />
              <stop offset="50%" stopColor="#a855f7" />
              <stop offset="100%" stopColor="#ec4899" />
            </linearGradient>
          </defs>
        </svg>

        {/* 중앙 심볼 */}
        <div className="relative z-10 text-center">
          <div className="text-3xl md:text-4xl mb-1 drop-shadow-[0_0_12px_rgba(251,191,36,0.6)]">✦</div>
          <div className="text-[7px] md:text-[9px] text-amber-300/70 font-serif tracking-[0.3em]">TAROT</div>
        </div>
      </div>

      {/* 코너 장식 */}
      <div className="absolute top-2 left-2 w-5 h-5 border-l-2 border-t-2 border-amber-500/40 rounded-tl" />
      <div className="absolute top-2 right-2 w-5 h-5 border-r-2 border-t-2 border-amber-500/40 rounded-tr" />
      <div className="absolute bottom-2 left-2 w-5 h-5 border-l-2 border-b-2 border-amber-500/40 rounded-bl" />
      <div className="absolute bottom-2 right-2 w-5 h-5 border-r-2 border-b-2 border-amber-500/40 rounded-br" />
    </div>
  );

  const cardFront = card ? (
    <div
      className={`absolute inset-0 rounded-xl border-2 ${
        card.type === 'major' ? 'border-amber-500/80' : 'border-slate-300 dark:border-slate-600'
      } backface-hidden rotate-y-180 overflow-hidden ${isReversed ? 'rotate-180' : ''}`}
    >
      <div className={`relative w-full h-full ${isReversed ? 'rotate-180' : ''}`}>
        {!imageError && (
          <Image
            src={getCardImageUrl(card)}
            alt={card.korean}
            fill
            className="object-cover"
            onError={() => setImageError(true)}
            unoptimized
          />
        )}

        {/* 폴백 디자인 */}
        {imageError && (
          <>
            <div className={`absolute inset-0 ${
              card.type === 'major'
                ? 'bg-gradient-to-br from-amber-100 via-yellow-50 to-orange-100 dark:from-amber-900/40 dark:via-yellow-900/30 dark:to-orange-900/40'
                : card.suit === 'wands'
                  ? 'bg-gradient-to-br from-orange-100 via-red-50 to-amber-100 dark:from-orange-900/40 dark:via-red-900/30 dark:to-amber-900/40'
                  : card.suit === 'cups'
                    ? 'bg-gradient-to-br from-blue-100 via-cyan-50 to-indigo-100 dark:from-blue-900/40 dark:via-cyan-900/30 dark:to-indigo-900/40'
                    : card.suit === 'swords'
                      ? 'bg-gradient-to-br from-slate-100 via-gray-50 to-zinc-100 dark:from-slate-800 dark:via-gray-800 dark:to-zinc-800'
                      : 'bg-gradient-to-br from-green-100 via-emerald-50 to-teal-100 dark:from-green-900/40 dark:via-emerald-900/30 dark:to-teal-900/40'
            }`} />
            <div className="absolute inset-0 flex flex-col items-center justify-center p-3">
              <div className="text-4xl md:text-5xl mb-2 drop-shadow-md">
                {card.type === 'major' ? getMajorSymbol(card.id) : SUIT_DATA[card.suit!]?.symbol}
              </div>
              <div className="text-xs md:text-sm font-bold text-center text-slate-700 dark:text-slate-200 leading-tight">
                {card.korean}
              </div>
              {card.type === 'minor' && (
                <div className="text-[9px] md:text-[10px] text-slate-500 dark:text-slate-400 mt-1">
                  {card.suit === 'wands' ? '완드' : card.suit === 'cups' ? '컵' : card.suit === 'swords' ? '소드' : '펜타클'}
                </div>
              )}
            </div>
            <div className="absolute inset-1.5 border border-amber-300/30 dark:border-amber-500/20 rounded-lg pointer-events-none" />
          </>
        )}
      </div>

      {/* 역방향 표시 */}
      {isReversed && (
        <div className="absolute top-1.5 right-1.5 bg-red-500/90 text-white text-[9px] px-1.5 py-0.5 rounded-md font-medium z-10 backdrop-blur-sm">
          역
        </div>
      )}

      {/* 메이저 아르카나 크라운 */}
      {card.type === 'major' && (
        <div className="absolute top-1.5 left-1.5 z-10">
          <Crown className="h-4 w-4 text-amber-500 drop-shadow-[0_0_4px_rgba(251,191,36,0.6)]" />
        </div>
      )}
    </div>
  ) : null;

  return (
    <div
      className={`${sizeClasses[size]} perspective-1000 cursor-pointer group relative`}
      onClick={onClick}
      style={{ animationDelay: `${delay}ms` }}
    >
      {/* 호버 글로우 */}
      {onClick && (
        <div className="absolute -inset-3 rounded-2xl bg-gradient-to-r from-amber-500/0 via-purple-500/0 to-pink-500/0 group-hover:from-amber-500/20 group-hover:via-purple-500/30 group-hover:to-pink-500/20 blur-xl transition-all duration-500 opacity-0 group-hover:opacity-100" />
      )}

      <div
        className={`relative w-full h-full transition-all duration-700 transform-style-3d ${
          isFlipped ? 'rotate-y-180' : ''
        } ${
          onClick
            ? 'group-hover:scale-110 group-hover:-translate-y-4 group-hover:shadow-[0_25px_50px_rgba(168,85,247,0.4)]'
            : ''
        }`}
      >
        {cardBack}
        {cardFront}
      </div>
    </div>
  );
};

// 메이저 아르카나 심볼
function getMajorSymbol(id: string): string {
  const symbols: Record<string, string> = {
    'the-fool': '🃏', 'the-magician': '🎩', 'the-high-priestess': '🌙',
    'the-empress': '👑', 'the-emperor': '🦅', 'the-hierophant': '⛪',
    'the-lovers': '💕', 'the-chariot': '🏆', 'strength': '🦁',
    'the-hermit': '🏮', 'wheel-of-fortune': '☸️', 'justice': '⚖️',
    'the-hanged-man': '🙃', 'death': '🦋', 'temperance': '🏺',
    'the-devil': '😈', 'the-tower': '🗼', 'the-star': '⭐',
    'the-moon': '🌙', 'the-sun': '☀️', 'judgement': '📯', 'the-world': '🌍',
  };
  return symbols[id] || '✨';
}

// ===== 스프레드 선택 (프리미엄) =====
const SpreadSelector = ({
  selected,
  onSelect,
}: {
  selected: SpreadType;
  onSelect: (type: SpreadType) => void;
}) => {
  const spreads: { type: SpreadType; icon: React.ReactNode; color: string; glow: string }[] = [
    { type: 'single', icon: <Star className="h-6 w-6" />, color: 'from-purple-500 to-indigo-500', glow: 'shadow-purple-500/30' },
    { type: 'three-card', icon: <Clock className="h-6 w-6" />, color: 'from-blue-500 to-cyan-500', glow: 'shadow-blue-500/30' },
    { type: 'celtic-cross', icon: <Sparkles className="h-6 w-6" />, color: 'from-amber-500 to-orange-500', glow: 'shadow-amber-500/30' },
    { type: 'love', icon: <Heart className="h-6 w-6" />, color: 'from-rose-500 to-pink-500', glow: 'shadow-rose-500/30' },
    { type: 'career', icon: <Briefcase className="h-6 w-6" />, color: 'from-emerald-500 to-teal-500', glow: 'shadow-emerald-500/30' },
  ];

  return (
    <div className="grid grid-cols-2 md:grid-cols-5 gap-3 md:gap-4">
      {spreads.map(({ type, icon, color, glow }) => {
        const spread = SPREAD_DEFINITIONS[type];
        const isSelected = selected === type;
        return (
          <button
            key={type}
            onClick={() => onSelect(type)}
            className={`relative p-5 md:p-6 rounded-2xl border-2 transition-all duration-300 overflow-hidden ${
              isSelected
                ? `border-transparent bg-gradient-to-br ${color} text-white shadow-xl ${glow} scale-[1.03]`
                : 'border-white/10 bg-white/5 hover:bg-white/10 hover:border-white/20 backdrop-blur-sm'
            }`}
          >
            {/* 선택 시 빛나는 오버레이 */}
            {isSelected && (
              <div className="absolute inset-0 bg-white/10 animate-pulse-slow" />
            )}
            <div className="relative flex flex-col items-center gap-2.5">
              <div className={`p-2.5 rounded-xl ${isSelected ? 'bg-white/20' : 'bg-white/10'}`}>
                {icon}
              </div>
              <span className="text-sm font-semibold">{spread.korean}</span>
              <span className={`text-xs ${isSelected ? 'text-white/80' : 'text-white/50'}`}>
                {spread.cardCount}장
              </span>
            </div>
          </button>
        );
      })}
    </div>
  );
};

// ===== 카드 선택 화면 (강화된 애니메이션) =====
const CardDrawing = ({
  spreadType,
  onComplete,
}: {
  spreadType: SpreadType;
  onComplete: (cards: DrawnCard[]) => void;
}) => {
  const [phase, setPhase] = useState<'shuffle' | 'draw' | 'reveal'>('shuffle');
  const [shuffleCount, setShuffleCount] = useState(0);
  const [selectedCards, setSelectedCards] = useState<number[]>([]);
  const [drawnCards, setDrawnCards] = useState<{ card: TarotCardInfo; isReversed: boolean }[]>([]);
  const spread = SPREAD_DEFINITIONS[spreadType];

  // 셔플 애니메이션
  useEffect(() => {
    if (phase === 'shuffle') {
      if (shuffleCount < 3) {
        const timer = setTimeout(() => {
          setShuffleCount((prev) => prev + 1);
        }, 700);
        return () => clearTimeout(timer);
      } else {
        setPhase('draw');
      }
    }
  }, [phase, shuffleCount]);

  // 카드 선택
  const handleCardClick = (index: number) => {
    if (phase !== 'draw') return;
    if (selectedCards.includes(index) || selectedCards.length >= spread.cardCount) return;

    const newSelected = [...selectedCards, index];
    setSelectedCards(newSelected);

    if (newSelected.length === spread.cardCount) {
      const drawn = drawRandomCards(spread.cardCount);
      setDrawnCards(drawn);
      setPhase('reveal');
    }
  };

  const handleStartAnalysis = () => {
    const result: DrawnCard[] = drawnCards.map((d, i) => ({
      card: d.card,
      orientation: d.isReversed ? 'reversed' : 'upright',
      position: spread.positions[i]?.korean,
      positionMeaning: spread.positions[i]?.description,
    }));
    onComplete(result);
  };

  // ===== 셔플 단계 =====
  if (phase === 'shuffle') {
    return (
      <div className="text-center py-16 md:py-24">
        <div className="relative w-48 h-72 md:w-56 md:h-80 mx-auto mb-10">
          {/* 마법진 배경 */}
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="absolute w-80 h-80 md:w-96 md:h-96 border border-purple-500/15 rounded-full animate-spin-slow" />
            <div className="absolute w-60 h-60 md:w-72 md:h-72 border border-amber-500/15 rounded-full animate-spin-slow" style={{ animationDirection: 'reverse' }} />
            <div className="absolute w-40 h-40 md:w-48 md:h-48 border border-pink-500/15 rounded-full animate-magic-rotate" />
          </div>

          {[0, 1, 2].map((i) => (
            <div
              key={i}
              className={`absolute inset-0 transition-all duration-600 ${
                shuffleCount > i ? 'opacity-0 scale-90 rotate-180' : ''
              }`}
              style={{
                transform: `rotate(${(i - 1) * 12}deg) translateX(${(i - 1) * 15}px)`,
              }}
            >
              <TarotCard isFlipped={false} size="large" />
            </div>
          ))}
        </div>

        <h2 className="text-2xl md:text-3xl font-bold text-white mb-3">
          카드를 섞고 있습니다...
        </h2>
        <p className="text-purple-200/60 text-lg">
          마음을 가다듬고 질문에 집중하세요
        </p>

        {/* 진행 인디케이터 */}
        <div className="flex justify-center gap-4 mt-8">
          {[0, 1, 2].map((i) => (
            <div
              key={i}
              className={`w-3.5 h-3.5 rounded-full transition-all duration-600 ${
                shuffleCount > i
                  ? 'bg-gradient-to-r from-amber-400 to-purple-500 shadow-[0_0_15px_rgba(168,85,247,0.6)] scale-110'
                  : 'bg-white/15'
              }`}
            />
          ))}
        </div>
      </div>
    );
  }

  // ===== 카드 선택 단계 =====
  if (phase === 'draw') {
    return (
      <div className="text-center py-8 md:py-12">
        <div className="mb-10">
          <h2 className="text-2xl md:text-3xl font-bold text-white mb-3">
            {spread.cardCount}장의 카드를 선택하세요
          </h2>
          <p className="text-purple-200/70 mb-6 text-base md:text-lg">
            마음이 끌리는 카드를 직감에 따라 선택하세요
          </p>

          {/* 선택 진행 바 */}
          <div className="max-w-sm mx-auto">
            <div className="flex justify-between text-sm text-purple-300 mb-2.5 font-medium">
              <span>선택</span>
              <span>{selectedCards.length} / {spread.cardCount}</span>
            </div>
            <div className="h-2.5 bg-white/10 rounded-full overflow-hidden backdrop-blur-sm">
              <div
                className="h-full bg-gradient-to-r from-amber-400 via-purple-500 to-pink-500 transition-all duration-500 rounded-full shadow-[0_0_15px_rgba(168,85,247,0.5)]"
                style={{ width: `${(selectedCards.length / spread.cardCount) * 100}%` }}
              />
            </div>
          </div>
        </div>

        {/* 카드 그리드 - 부채꼴 회전 효과 */}
        <div className="relative max-w-5xl mx-auto px-4">
          <div className="absolute inset-0 -top-10 -bottom-10 bg-gradient-to-b from-transparent via-purple-900/20 to-transparent rounded-3xl" />

          <div className="relative flex flex-wrap justify-center gap-2 md:gap-3">
            {Array.from({ length: 22 }).map((_, i) => (
              <div
                key={i}
                className={`transition-all duration-500 ${
                  selectedCards.includes(i)
                    ? 'scale-75 opacity-20 blur-[2px] pointer-events-none -translate-y-2'
                    : 'hover:-translate-y-3'
                }`}
                style={{
                  transform: selectedCards.includes(i)
                    ? undefined
                    : `rotate(${(i - 10.5) * 1.2}deg)`,
                }}
              >
                <TarotCard
                  isFlipped={false}
                  onClick={() => handleCardClick(i)}
                  delay={i * 30}
                  size="small"
                />
              </div>
            ))}
          </div>
        </div>

        {/* 선택된 위치 표시 */}
        <div className="mt-12 flex justify-center gap-3 flex-wrap px-4">
          {spread.positions.map((pos, i) => (
            <div
              key={pos.id}
              className={`px-5 py-2.5 rounded-xl border-2 transition-all duration-400 ${
                i < selectedCards.length
                  ? 'border-amber-400/50 bg-gradient-to-r from-amber-500/15 to-purple-500/15 text-white shadow-[0_0_20px_rgba(251,191,36,0.15)]'
                  : 'border-dashed border-white/15 text-white/40'
              }`}
            >
              <span className="text-sm font-medium">{pos.korean}</span>
            </div>
          ))}
        </div>
      </div>
    );
  }

  // ===== 공개 단계 =====
  return (
    <div className="text-center py-8 md:py-12">
      <div className="mb-2">
        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-gradient-to-r from-amber-500/20 to-purple-500/20 border border-amber-500/30 mb-4">
          <Sparkles className="h-4 w-4 text-amber-400" />
          <span className="text-sm font-medium text-amber-200">카드가 공개되었습니다</span>
        </div>
      </div>
      <h2 className="text-xl md:text-2xl font-bold text-white mb-2">
        운명의 카드가 펼쳐졌습니다
      </h2>
      <p className="text-purple-200/60 mb-8">
        아래 버튼을 눌러 깊은 해석을 확인하세요
      </p>

      {/* 카드 표시 */}
      {drawnCards.length > 0 ? (
        <div className="flex justify-center gap-4 md:gap-6 flex-wrap mb-10 px-4">
          {drawnCards.map((drawn, i) => (
            <div
              key={i}
              className="text-center"
              style={{ animation: `card-reveal 0.6s cubic-bezier(0.34, 1.56, 0.64, 1) ${i * 200}ms both` }}
            >
              <div className="mb-3 text-sm font-medium text-purple-300/80">
                {spread.positions[i]?.korean}
              </div>
              <TarotCard
                card={drawn.card}
                isReversed={drawn.isReversed}
                isFlipped={true}
                delay={i * 200}
                size="medium"
              />
              <div className="mt-2 text-xs text-purple-200/50">
                {drawn.card.korean}
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="flex justify-center items-center py-20">
          <div className="w-10 h-10 border-2 border-purple-500 border-t-transparent rounded-full animate-spin" />
          <span className="ml-4 text-purple-200">카드를 준비하는 중...</span>
        </div>
      )}

      <Button
        onClick={handleStartAnalysis}
        disabled={drawnCards.length === 0}
        className="bg-gradient-to-r from-purple-500 via-pink-500 to-rose-500 hover:from-purple-600 hover:via-pink-600 hover:to-rose-600 text-white shadow-xl shadow-purple-500/30 h-14 px-10 text-lg font-semibold disabled:opacity-50 transition-all hover:-translate-y-0.5"
      >
        <Sparkles className="mr-2 h-5 w-5" />
        타로 해석 보기
        <ArrowRight className="ml-2 h-5 w-5" />
      </Button>
    </div>
  );
};

// ===== 결과 화면 (프리미엄 리디자인) =====
const ReadingResult = ({
  cards,
  spreadType,
  question,
  onReset,
}: {
  cards: DrawnCard[];
  spreadType: SpreadType;
  question?: string;
  onReset: () => void;
}) => {
  const spread = SPREAD_DEFINITIONS[spreadType];
  const [selectedCard, setSelectedCard] = useState<number>(0);

  const currentCard = cards[selectedCard];
  const meaning = MAJOR_MEANINGS[currentCard.card.id];
  const isReversed = currentCard.orientation === 'reversed';
  const interp = isReversed ? meaning?.reversed : meaning?.upright;
  const suitInfo = currentCard.card.suit ? SUIT_DATA[currentCard.card.suit] : null;

  return (
    <div className="space-y-10 md:space-y-14">
      {/* 헤더 */}
      <div className="text-center">
        <div className="inline-flex items-center gap-2 px-5 py-2 rounded-full bg-gradient-to-r from-purple-100/80 to-pink-100/80 dark:from-purple-900/30 dark:to-pink-900/30 border border-purple-200/50 dark:border-purple-700/30 mb-5">
          <Sparkles className="h-4 w-4 text-purple-500" />
          <span className="text-sm font-medium text-purple-700 dark:text-purple-300">
            {spread.korean} 리딩 완료
          </span>
        </div>
        <h1 className="text-3xl md:text-4xl font-bold mb-3 bg-gradient-to-r from-purple-600 via-pink-600 to-purple-600 bg-clip-text text-transparent">
          당신의 타로 리딩
        </h1>
        {question && (
          <p className="text-muted-foreground text-lg italic">"{question}"</p>
        )}
      </div>

      {/* 카드 배치 - 클릭으로 선택 */}
      <div className="flex justify-center gap-3 md:gap-6 flex-wrap py-4">
        {cards.map((drawn, i) => (
          <div
            key={i}
            className={`text-center cursor-pointer transition-all duration-500 ${
              selectedCard === i
                ? 'scale-[1.05] -translate-y-2'
                : 'opacity-50 hover:opacity-80 hover:-translate-y-1'
            }`}
            onClick={() => setSelectedCard(i)}
            style={{ animation: `card-reveal 0.6s ease-out ${i * 120}ms both` }}
          >
            <div className={`mb-3 text-sm font-medium transition-colors duration-300 ${
              selectedCard === i ? 'text-purple-500' : 'text-muted-foreground'
            }`}>
              {drawn.position}
            </div>
            <div className="relative">
              {selectedCard === i && (
                <div className="absolute -inset-2 rounded-2xl bg-gradient-to-r from-purple-500/20 via-pink-500/20 to-purple-500/20 blur-lg animate-pulse-slow" />
              )}
              <TarotCard
                card={drawn.card}
                isReversed={drawn.orientation === 'reversed'}
                isFlipped={true}
                size="medium"
              />
            </div>
            <div className={`mt-2 text-xs transition-colors duration-300 ${
              selectedCard === i ? 'text-foreground font-medium' : 'text-muted-foreground'
            }`}>
              {drawn.card.korean}
              {drawn.orientation === 'reversed' && (
                <span className="text-red-500 ml-1">(역)</span>
              )}
            </div>
          </div>
        ))}
      </div>

      {/* 카드 선택 인디케이터 */}
      <div className="flex justify-center gap-2">
        {cards.map((_, i) => (
          <button
            key={i}
            onClick={() => setSelectedCard(i)}
            className={`w-2.5 h-2.5 rounded-full transition-all duration-300 ${
              selectedCard === i
                ? 'bg-purple-500 scale-125 shadow-[0_0_8px_rgba(168,85,247,0.5)]'
                : 'bg-muted-foreground/30 hover:bg-muted-foreground/50'
            }`}
          />
        ))}
      </div>

      {/* ===== 선택된 카드 상세 해석 ===== */}
      <div className="max-w-2xl mx-auto">
        <Card className="overflow-hidden border-purple-200/30 dark:border-purple-800/30 shadow-xl shadow-purple-500/5">
          {/* 카드 헤더 - 그라데이션 배너 */}
          <div className="relative bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 p-6 md:p-8 text-white overflow-hidden">
            {/* 장식 패턴 */}
            <div className="absolute top-0 right-0 w-40 h-40 bg-white/5 rounded-full -translate-y-1/2 translate-x-1/2" />
            <div className="absolute bottom-0 left-0 w-24 h-24 bg-white/5 rounded-full translate-y-1/2 -translate-x-1/2" />

            <div className="relative flex items-center gap-5">
              <div className="text-5xl md:text-6xl drop-shadow-lg">
                {currentCard.card.type === 'major'
                  ? getMajorSymbol(currentCard.card.id)
                  : SUIT_DATA[currentCard.card.suit!]?.symbol}
              </div>
              <div>
                <h2 className="text-2xl md:text-3xl font-bold mb-1">{currentCard.card.korean}</h2>
                <div className="flex flex-wrap items-center gap-2 text-white/70 text-sm">
                  <span>{currentCard.position}</span>
                  <span className="text-white/40">·</span>
                  <span>{currentCard.card.type === 'major' ? '메이저 아르카나' : `${suitInfo?.korean || ''} 수트`}</span>
                  {currentCard.card.element && (
                    <>
                      <span className="text-white/40">·</span>
                      <div className="flex items-center gap-1">
                        <ElementIcon element={currentCard.card.element} className="h-3.5 w-3.5" />
                        <span className="capitalize">{currentCard.card.element}</span>
                      </div>
                    </>
                  )}
                </div>
                {isReversed && (
                  <Badge className="mt-2 bg-red-500/20 text-red-200 border-red-400/30 hover:bg-red-500/30">
                    역방향
                  </Badge>
                )}
              </div>
            </div>
          </div>

          <CardContent className="p-6 md:p-8 space-y-7">
            {/* 스토리 - 장식적 인용구 */}
            {meaning?.story && (
              <div className="relative">
                <div className="absolute -top-2 -left-1 text-5xl text-purple-300/20 font-serif leading-none select-none">"</div>
                <blockquote className="border-l-4 border-gradient-to-b border-purple-400/60 pl-5 py-3 italic text-muted-foreground bg-gradient-to-r from-purple-50/50 to-transparent dark:from-purple-950/20 dark:to-transparent rounded-r-lg text-[15px] leading-relaxed">
                  {meaning.story}
                </blockquote>
              </div>
            )}

            {/* 상징 설명 */}
            {meaning?.symbolism && (
              <div className="flex items-start gap-3 text-sm text-muted-foreground bg-muted/30 rounded-xl p-4">
                <Eye className="h-4 w-4 mt-0.5 text-purple-400 shrink-0" />
                <div>
                  <span className="font-medium text-foreground">상징: </span>
                  {meaning.symbolism}
                </div>
              </div>
            )}

            {/* 수트 정보 (마이너 아르카나) */}
            {suitInfo && !meaning && (
              <div className="flex items-start gap-3 text-sm bg-muted/30 rounded-xl p-4">
                <span className="text-2xl shrink-0">{suitInfo.symbol}</span>
                <div>
                  <div className="font-semibold text-foreground mb-1">{suitInfo.korean} 수트</div>
                  <p className="text-muted-foreground">{suitInfo.meaning}</p>
                </div>
              </div>
            )}

            {/* ===== 해석 탭 (종합/사랑/커리어) ===== */}
            <div>
              <Tabs defaultValue="general" className="w-full">
                <TabsList className="grid grid-cols-3 w-full bg-muted/50">
                  <TabsTrigger value="general" className="text-sm font-medium">
                    <Sparkles className="h-3.5 w-3.5 mr-1.5" />
                    종합
                  </TabsTrigger>
                  <TabsTrigger value="love" className="text-sm font-medium">
                    <Heart className="h-3.5 w-3.5 mr-1.5" />
                    사랑
                  </TabsTrigger>
                  <TabsTrigger value="career" className="text-sm font-medium">
                    <Briefcase className="h-3.5 w-3.5 mr-1.5" />
                    커리어
                  </TabsTrigger>
                </TabsList>

                <TabsContent value="general" className="mt-5">
                  <div className="text-[15px] leading-relaxed text-foreground/90">
                    {interp
                      ? interp.general
                      : interpretCard(currentCard.card, currentCard.orientation, 'general')}
                  </div>
                </TabsContent>

                <TabsContent value="love" className="mt-5">
                  <div className="text-[15px] leading-relaxed text-foreground/90">
                    {interp
                      ? interp.love
                      : interpretCard(currentCard.card, currentCard.orientation, 'love')}
                  </div>
                </TabsContent>

                <TabsContent value="career" className="mt-5">
                  <div className="text-[15px] leading-relaxed text-foreground/90">
                    {interp
                      ? interp.career
                      : interpretCard(currentCard.card, currentCard.orientation, 'career')}
                  </div>
                </TabsContent>
              </Tabs>
            </div>

            {/* 조언 박스 */}
            {interp?.advice && (
              <div className="bg-gradient-to-r from-amber-50 to-orange-50 dark:from-amber-950/20 dark:to-orange-950/20 rounded-xl p-5 border border-amber-200/40 dark:border-amber-700/30">
                <h4 className="font-semibold text-amber-700 dark:text-amber-400 flex items-center gap-2 mb-2.5 text-sm">
                  <Sparkles className="h-4 w-4" />
                  카드의 조언
                </h4>
                <p className="text-sm leading-relaxed text-amber-900/80 dark:text-amber-200/80">
                  {interp.advice}
                </p>
              </div>
            )}

            {/* 키워드 */}
            <div>
              <h4 className="text-sm font-semibold text-muted-foreground mb-3">키워드</h4>
              <div className="flex flex-wrap gap-2">
                {(interp?.keywords || currentCard.card.keywords).map((keyword, i) => (
                  <Badge
                    key={i}
                    variant="outline"
                    className="border-purple-200/60 dark:border-purple-700/40 text-purple-600 dark:text-purple-300 bg-purple-50/50 dark:bg-purple-950/20 px-3 py-1"
                  >
                    {keyword}
                  </Badge>
                ))}
              </div>
            </div>

            {/* 위치 의미 */}
            {currentCard.positionMeaning && (
              <div className="border-t border-border/50 pt-5">
                <div className="text-sm text-muted-foreground">
                  <span className="font-semibold text-foreground">{currentCard.position}</span>
                  <span className="text-muted-foreground/60 mx-2">—</span>
                  {currentCard.positionMeaning}
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* ===== 대서사시 스토리텔링 ===== */}
      <div className="max-w-3xl mx-auto">
        <Card className="relative overflow-hidden bg-gradient-to-br from-indigo-50/60 via-purple-50/40 to-pink-50/60 dark:from-indigo-950/30 dark:via-purple-950/30 dark:to-pink-950/30 border-purple-200/30 dark:border-purple-800/30 shadow-lg">
          {/* 장식 */}
          <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-purple-200/30 to-pink-200/20 dark:from-purple-600/10 dark:to-pink-600/5 rounded-full blur-[60px]" />
          <div className="absolute bottom-0 left-0 w-24 h-24 bg-gradient-to-br from-indigo-200/30 to-purple-200/20 dark:from-indigo-600/10 dark:to-purple-600/5 rounded-full blur-[40px]" />

          <CardHeader className="relative pb-4">
            <CardTitle className="flex items-center gap-3 text-xl">
              <div className="p-2 rounded-lg bg-gradient-to-br from-purple-500 to-pink-500 text-white">
                <BookOpen className="h-5 w-5" />
              </div>
              <span>당신을 위한 이야기</span>
            </CardTitle>
            <CardDescription>카드들이 전하는 메시지를 이야기로 풀어봅니다</CardDescription>
          </CardHeader>

          <CardContent className="relative">
            <div className="prose prose-purple dark:prose-invert max-w-none">
              <div className="text-[15px] leading-[1.85] whitespace-pre-line text-foreground/85">
                {generateEpicStorytelling(cards, question)}
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* 액션 버튼 */}
      <div className="flex flex-col sm:flex-row justify-center gap-3 pt-4">
        <Button
          variant="outline"
          onClick={onReset}
          className="px-6 py-5 text-base rounded-xl border-purple-200 dark:border-purple-800 hover:bg-purple-50 dark:hover:bg-purple-950/30"
        >
          <RotateCcw className="mr-2 h-4 w-4" />
          다시 리딩하기
        </Button>
        <Link href="/fortune">
          <Button variant="ghost" className="px-6 py-5 text-base rounded-xl">
            다른 운세 보기
            <ArrowRight className="ml-2 h-4 w-4" />
          </Button>
        </Link>
      </div>
    </div>
  );
};

// ===== 메인 페이지 =====
export default function TarotPage() {
  const [step, setStep] = useState<'spread' | 'question' | 'draw' | 'result'>('spread');
  const [spreadType, setSpreadType] = useState<SpreadType>('single');
  const [question, setQuestion] = useState('');
  const [drawnCards, setDrawnCards] = useState<DrawnCard[]>([]);

  const handleSpreadSelect = (type: SpreadType) => {
    setSpreadType(type);
  };

  const handleStart = () => {
    setStep('question');
  };

  const handleQuestionSubmit = () => {
    setStep('draw');
  };

  const handleDrawComplete = useCallback((cards: DrawnCard[]) => {
    setDrawnCards(cards);
    setStep('result');
  }, []);

  const handleReset = () => {
    setStep('spread');
    setQuestion('');
    setDrawnCards([]);
  };

  // ===== 결과 화면 =====
  if (step === 'result') {
    return (
      <div className="min-h-screen bg-gradient-to-b from-slate-50 via-purple-50/30 to-white dark:from-slate-950 dark:via-purple-950/10 dark:to-slate-900">
        <div className="container mx-auto px-4 py-8 md:py-14">
          <div className="max-w-5xl mx-auto">
            <ReadingResult
              cards={drawnCards}
              spreadType={spreadType}
              question={question}
              onReset={handleReset}
            />
          </div>
        </div>
      </div>
    );
  }

  // ===== 카드 드로우 화면 =====
  if (step === 'draw') {
    return (
      <div className="min-h-screen bg-gradient-to-b from-indigo-950 via-purple-950 to-slate-950">
        <MysticBackground />
        <div className="container mx-auto px-4 py-8 relative z-10">
          <CardDrawing
            spreadType={spreadType}
            onComplete={handleDrawComplete}
          />
        </div>
      </div>
    );
  }

  // ===== 질문 입력 화면 =====
  if (step === 'question') {
    return (
      <div className="min-h-screen bg-gradient-to-b from-indigo-950 via-purple-950 to-slate-950">
        <MysticBackground />
        <div className="container mx-auto px-4 py-8 md:py-20 relative z-10">
          <div className="max-w-xl mx-auto">
            <div className="text-center mb-10">
              <Badge className="mb-5 bg-white/10 text-white border-white/20 px-4 py-1.5">
                {SPREAD_DEFINITIONS[spreadType].korean}
              </Badge>
              <h1 className="text-3xl md:text-4xl font-bold text-white mb-4">
                질문을 떠올리세요
              </h1>
              <p className="text-purple-200/60 text-lg">
                카드에게 물어보고 싶은 것을 마음속에 담으세요
              </p>
            </div>

            <Card className="bg-white/[0.07] border-white/15 backdrop-blur-md shadow-2xl">
              <CardContent className="pt-7 pb-7 px-6 md:px-8 space-y-5">
                <div className="space-y-3">
                  <Label htmlFor="question" className="text-white/80 text-sm font-medium">
                    질문 (선택사항)
                  </Label>
                  <Textarea
                    id="question"
                    placeholder="예: 현재 직장에서의 앞날은 어떻게 될까요?"
                    value={question}
                    onChange={(e) => setQuestion(e.target.value)}
                    className="bg-white/[0.07] border-white/15 text-white placeholder:text-white/30 min-h-[120px] text-base focus:border-purple-400/50 focus:ring-purple-400/20 rounded-xl"
                  />
                </div>

                <div className="text-sm text-purple-200/50 space-y-2 bg-white/5 rounded-xl p-4">
                  <p className="font-medium text-purple-200/70">💡 질문 작성 팁</p>
                  <ul className="list-disc list-inside text-purple-300/50 space-y-1.5">
                    <li>구체적인 질문이 더 명확한 답을 가져옵니다</li>
                    <li>"예/아니오"보다 "어떻게", "무엇이" 질문이 좋습니다</li>
                    <li>질문 없이도 리딩은 가능합니다</li>
                  </ul>
                </div>

                <div className="flex gap-3 pt-3">
                  <Button
                    variant="outline"
                    className="flex-1 border-white/15 text-white hover:bg-white/10 py-5 rounded-xl"
                    onClick={() => setStep('spread')}
                  >
                    뒤로
                  </Button>
                  <Button
                    className="flex-1 bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 py-5 rounded-xl text-base font-semibold shadow-lg shadow-purple-500/20"
                    onClick={handleQuestionSubmit}
                  >
                    카드 뽑기
                    <Shuffle className="ml-2 h-4 w-4" />
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    );
  }

  // ===== 스프레드 선택 화면 =====
  return (
    <div className="min-h-screen bg-gradient-to-b from-indigo-950 via-purple-950 to-slate-950">
      <MysticBackground />
      <div className="container mx-auto px-4 py-8 md:py-16 relative z-10">
        <div className="max-w-3xl mx-auto">
          {/* 헤더 */}
          <div className="text-center mb-10 md:mb-12">
            <Badge className="mb-5 bg-white/10 text-white border-white/20 px-4 py-1.5">
              <Sparkles className="mr-1.5 h-3.5 w-3.5" />
              타로 카드 리딩
            </Badge>
            <h1 className="text-4xl md:text-5xl font-bold text-white mb-5 leading-tight">
              운명의 카드가<br />당신을 기다립니다
            </h1>
            <p className="text-purple-200/50 text-base md:text-lg leading-relaxed">
              78장의 카드 속에 담긴 지혜가
              <br />
              당신의 질문에 답할 준비가 되어 있습니다
            </p>
          </div>

          {/* 스프레드 선택 */}
          <Card className="bg-white/[0.07] border-white/15 backdrop-blur-md mb-6 shadow-2xl">
            <CardHeader className="pb-4">
              <CardTitle className="text-white text-lg">스프레드 선택</CardTitle>
              <CardDescription className="text-white/40">
                원하는 리딩 방식을 선택하세요
              </CardDescription>
            </CardHeader>
            <CardContent>
              <SpreadSelector selected={spreadType} onSelect={handleSpreadSelect} />
            </CardContent>
          </Card>

          {/* 선택된 스프레드 정보 */}
          <Card className="bg-white/[0.04] border-white/10 backdrop-blur-sm mb-6">
            <CardContent className="py-6 px-6">
              <div className="flex items-start gap-4">
                <div className="p-3 rounded-xl bg-gradient-to-br from-purple-500/20 to-pink-500/20 border border-purple-500/20">
                  <Eye className="h-6 w-6 text-purple-400" />
                </div>
                <div className="flex-1">
                  <h3 className="font-bold text-white mb-1.5 text-lg">
                    {SPREAD_DEFINITIONS[spreadType].korean}
                  </h3>
                  <p className="text-purple-200/50 text-sm mb-3 leading-relaxed">
                    {SPREAD_DEFINITIONS[spreadType].description}
                  </p>
                  <div className="flex flex-wrap gap-2">
                    {SPREAD_DEFINITIONS[spreadType].positions.map((pos) => (
                      <Badge
                        key={pos.id}
                        variant="outline"
                        className="border-purple-400/30 text-purple-200/80 bg-purple-500/5"
                      >
                        {pos.korean}
                      </Badge>
                    ))}
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* 시작 버튼 */}
          <Button
            className="w-full bg-gradient-to-r from-purple-500 via-pink-500 to-rose-500 hover:from-purple-600 hover:via-pink-600 hover:to-rose-600 text-white shadow-xl shadow-purple-500/25 h-14 text-lg font-semibold rounded-xl transition-all hover:-translate-y-0.5"
            onClick={handleStart}
          >
            리딩 시작하기
            <ArrowRight className="ml-2 h-5 w-5" />
          </Button>

          {/* 안내 */}
          <Card className="mt-6 bg-white/[0.03] border-white/[0.08] backdrop-blur-sm">
            <CardContent className="py-5 px-6">
              <div className="flex items-start gap-3.5">
                <Sparkles className="h-5 w-5 text-purple-300/60 mt-0.5 shrink-0" />
                <div className="text-sm text-white/40 leading-relaxed">
                  <p className="font-medium mb-1.5 text-white/60">타로 리딩이란?</p>
                  <p>
                    타로 카드는 78장의 카드로 구성된 고대의 점술 도구입니다.
                    22장의 메이저 아르카나와 56장의 마이너 아르카나가
                    당신의 현재, 과거, 미래에 대한 통찰을 제공합니다.
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
