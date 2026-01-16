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
} from 'lucide-react';
import {
  FULL_DECK,
  drawRandomCards,
  TarotCardInfo,
  SpreadType,
  SPREAD_DEFINITIONS,
  DrawnCard,
  SUIT_DATA,
  interpretCard,
  generateDailyMessage,
  MAJOR_MEANINGS,
} from '@/lib/fortune/tarot';

// 신비로운 배경 효과
const MysticBackground = () => (
  <div className="absolute inset-0 overflow-hidden pointer-events-none">
    {/* 별빛 파티클 - 작은 별들 */}
    {Array.from({ length: 50 }).map((_, i) => (
      <div
        key={`star-${i}`}
        className="absolute rounded-full bg-white animate-twinkle"
        style={{
          width: `${1 + Math.random() * 2}px`,
          height: `${1 + Math.random() * 2}px`,
          top: `${Math.random() * 100}%`,
          left: `${Math.random() * 100}%`,
          animationDelay: `${Math.random() * 3}s`,
          animationDuration: `${2 + Math.random() * 2}s`,
        }}
      />
    ))}

    {/* 큰 빛나는 별들 */}
    {Array.from({ length: 8 }).map((_, i) => (
      <div
        key={`glow-${i}`}
        className="absolute animate-pulse-slow"
        style={{
          top: `${10 + Math.random() * 80}%`,
          left: `${10 + Math.random() * 80}%`,
          animationDelay: `${Math.random() * 4}s`,
        }}
      >
        <div className="w-1 h-1 bg-yellow-200 rounded-full shadow-[0_0_10px_4px_rgba(253,224,71,0.4)]" />
      </div>
    ))}

    {/* 마법 오브 */}
    {Array.from({ length: 5 }).map((_, i) => (
      <div
        key={`orb-${i}`}
        className="absolute rounded-full animate-float-slow opacity-20"
        style={{
          width: `${100 + Math.random() * 150}px`,
          height: `${100 + Math.random() * 150}px`,
          background: `radial-gradient(circle, ${
            ['rgba(147,51,234,0.3)', 'rgba(59,130,246,0.3)', 'rgba(236,72,153,0.3)', 'rgba(99,102,241,0.3)'][i % 4]
          } 0%, transparent 70%)`,
          top: `${Math.random() * 100}%`,
          left: `${Math.random() * 100}%`,
          animationDelay: `${Math.random() * 5}s`,
          animationDuration: `${8 + Math.random() * 4}s`,
        }}
      />
    ))}

    {/* 성좌 연결선 */}
    <svg className="absolute inset-0 w-full h-full opacity-10">
      <defs>
        <linearGradient id="lineGradient" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#a855f7" />
          <stop offset="100%" stopColor="#3b82f6" />
        </linearGradient>
      </defs>
      {Array.from({ length: 6 }).map((_, i) => (
        <line
          key={i}
          x1={`${20 + Math.random() * 30}%`}
          y1={`${20 + Math.random() * 30}%`}
          x2={`${50 + Math.random() * 30}%`}
          y2={`${50 + Math.random() * 30}%`}
          stroke="url(#lineGradient)"
          strokeWidth="1"
        />
      ))}
    </svg>
  </div>
);

// 마법 파티클 배경 (기존 호환)
const MagicParticles = () => <MysticBackground />;

// 원소 아이콘
const ElementIcon = ({ element, className = '' }: { element?: string; className?: string }) => {
  switch (element) {
    case 'fire':
      return <Flame className={`text-orange-500 ${className}`} />;
    case 'earth':
      return <Mountain className={`text-amber-700 ${className}`} />;
    case 'air':
      return <Wind className={`text-sky-500 ${className}`} />;
    case 'water':
      return <Droplets className={`text-blue-500 ${className}`} />;
    default:
      return <Star className={className} />;
  }
};

// 타로 카드 컴포넌트 (플립 애니메이션)
const TarotCard = ({
  card,
  isReversed,
  isFlipped,
  onClick,
  delay = 0,
  size = 'medium',
  showMeaning = false,
}: {
  card?: TarotCardInfo;
  isReversed?: boolean;
  isFlipped: boolean;
  onClick?: () => void;
  delay?: number;
  size?: 'small' | 'medium' | 'large';
  showMeaning?: boolean;
}) => {
  const sizeClasses = {
    small: 'w-20 h-32',
    medium: 'w-28 h-44',
    large: 'w-36 h-56',
  };

  const cardBack = (
    <div className="absolute inset-0 rounded-xl overflow-hidden backface-hidden">
      {/* 메인 배경 그라데이션 */}
      <div className="absolute inset-0 bg-gradient-to-br from-slate-900 via-indigo-950 to-purple-950" />

      {/* 골드 테두리 */}
      <div className="absolute inset-0 rounded-xl border-2 border-amber-500/60 shadow-[inset_0_0_20px_rgba(251,191,36,0.1)]" />
      <div className="absolute inset-[3px] rounded-lg border border-amber-600/40" />

      {/* 마법진 패턴 */}
      <div className="absolute inset-0 flex items-center justify-center">
        {/* 외곽 원 */}
        <div className="absolute w-[85%] h-[85%] border border-amber-500/20 rounded-full" />
        <div className="absolute w-[70%] h-[70%] border border-purple-400/30 rounded-full animate-spin-slow" />
        <div className="absolute w-[55%] h-[55%] border border-indigo-400/20 rounded-full" />

        {/* 별 패턴 */}
        <svg className="absolute w-[60%] h-[60%] opacity-30" viewBox="0 0 100 100">
          <polygon
            points="50,5 61,40 98,40 68,62 79,97 50,75 21,97 32,62 2,40 39,40"
            fill="none"
            stroke="url(#starGradient)"
            strokeWidth="0.5"
          />
          <defs>
            <linearGradient id="starGradient" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#fbbf24" />
              <stop offset="100%" stopColor="#a855f7" />
            </linearGradient>
          </defs>
        </svg>

        {/* 중앙 심볼 */}
        <div className="relative z-10 text-center">
          <div className="text-3xl mb-1 drop-shadow-[0_0_8px_rgba(251,191,36,0.5)]">✦</div>
          <div className="text-[8px] text-amber-300/80 font-serif tracking-widest">TAROT</div>
        </div>
      </div>

      {/* 코너 장식 */}
      <div className="absolute top-2 left-2 w-4 h-4 border-l-2 border-t-2 border-amber-500/50 rounded-tl" />
      <div className="absolute top-2 right-2 w-4 h-4 border-r-2 border-t-2 border-amber-500/50 rounded-tr" />
      <div className="absolute bottom-2 left-2 w-4 h-4 border-l-2 border-b-2 border-amber-500/50 rounded-bl" />
      <div className="absolute bottom-2 right-2 w-4 h-4 border-r-2 border-b-2 border-amber-500/50 rounded-br" />

      {/* 빛나는 효과 */}
      <div className="absolute inset-0 bg-gradient-to-t from-transparent via-white/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
    </div>
  );

  const cardFront = card ? (
    <div
      className={`absolute inset-0 rounded-xl border-2 ${card.type === 'major' ? 'border-amber-500' : 'border-slate-300 dark:border-slate-600'
        } backface-hidden rotate-y-180 overflow-hidden ${isReversed ? 'rotate-180' : ''}`}
    >
      {/* 카드 앞면 디자인 */}
      <div className={`relative w-full h-full ${isReversed ? 'rotate-180' : ''}`}>
        {/* 배경 그라데이션 */}
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

        {/* 카드 콘텐츠 */}
        <div className="absolute inset-0 flex flex-col items-center justify-center p-2">
          <div className="text-3xl mb-1 drop-shadow-md">
            {card.type === 'major' ? getMajorSymbol(card.id) : SUIT_DATA[card.suit!]?.symbol}
          </div>
          <div className="text-[10px] font-bold text-center text-slate-700 dark:text-slate-200 leading-tight">
            {card.korean}
          </div>
          {card.type === 'minor' && (
            <div className="text-[8px] text-slate-500 dark:text-slate-400 mt-0.5">
              {card.suit === 'wands' ? '완드' : card.suit === 'cups' ? '컵' : card.suit === 'swords' ? '소드' : '펜타클'}
            </div>
          )}
        </div>

        {/* 장식 테두리 */}
        <div className="absolute inset-1 border border-amber-300/30 dark:border-amber-500/20 rounded-lg pointer-events-none" />
      </div>

      {/* 역방향 표시 */}
      {isReversed && (
        <div className="absolute top-1 right-1 bg-red-500 text-white text-[8px] px-1 rounded z-10">
          역
        </div>
      )}

      {/* 메이저 아르카나 표시 */}
      {card.type === 'major' && (
        <div className="absolute top-1 left-1">
          <Crown className="h-3 w-3 text-amber-500" />
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
      {/* 호버 글로우 효과 */}
      {onClick && (
        <div className="absolute -inset-2 rounded-2xl bg-gradient-to-r from-amber-500/0 via-purple-500/0 to-pink-500/0 group-hover:from-amber-500/20 group-hover:via-purple-500/30 group-hover:to-pink-500/20 blur-xl transition-all duration-500 opacity-0 group-hover:opacity-100" />
      )}

      <div
        className={`relative w-full h-full transition-all duration-700 transform-style-3d ${isFlipped ? 'rotate-y-180' : ''
          } ${onClick ? 'group-hover:scale-110 group-hover:-translate-y-3 group-hover:shadow-[0_20px_40px_rgba(168,85,247,0.4)]' : ''}`}
      >
        {cardBack}
        {cardFront}
      </div>
    </div>
  );
};

// 메이저 아르카나 심볼 가져오기
function getMajorSymbol(id: string): string {
  const symbols: Record<string, string> = {
    'the-fool': '🃏',
    'the-magician': '🎩',
    'the-high-priestess': '🌙',
    'the-empress': '👑',
    'the-emperor': '🦅',
    'the-hierophant': '⛪',
    'the-lovers': '💕',
    'the-chariot': '🏆',
    'strength': '🦁',
    'the-hermit': '🏮',
    'wheel-of-fortune': '☸️',
    'justice': '⚖️',
    'the-hanged-man': '🙃',
    'death': '🦋',
    'temperance': '🏺',
    'the-devil': '😈',
    'the-tower': '🗼',
    'the-star': '⭐',
    'the-moon': '🌙',
    'the-sun': '☀️',
    'judgement': '📯',
    'the-world': '🌍',
  };
  return symbols[id] || '✨';
}

// 스프레드 선택 컴포넌트
const SpreadSelector = ({
  selected,
  onSelect,
}: {
  selected: SpreadType;
  onSelect: (type: SpreadType) => void;
}) => {
  const spreads: { type: SpreadType; icon: React.ReactNode; color: string }[] = [
    { type: 'single', icon: <Star className="h-5 w-5" />, color: 'from-purple-500 to-indigo-500' },
    { type: 'three-card', icon: <Clock className="h-5 w-5" />, color: 'from-blue-500 to-cyan-500' },
    { type: 'celtic-cross', icon: <Sparkles className="h-5 w-5" />, color: 'from-amber-500 to-orange-500' },
    { type: 'love', icon: <Heart className="h-5 w-5" />, color: 'from-rose-500 to-pink-500' },
    { type: 'career', icon: <Briefcase className="h-5 w-5" />, color: 'from-emerald-500 to-teal-500' },
  ];

  return (
    <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
      {spreads.map(({ type, icon, color }) => {
        const spread = SPREAD_DEFINITIONS[type];
        return (
          <button
            key={type}
            onClick={() => onSelect(type)}
            className={`p-4 rounded-xl border-2 transition-all ${selected === type
              ? `border-purple-500 bg-gradient-to-br ${color} text-white shadow-lg scale-105`
              : 'border-muted hover:border-purple-300 hover:bg-muted/50'
              }`}
          >
            <div className="flex flex-col items-center gap-2">
              {icon}
              <span className="text-sm font-medium">{spread.korean}</span>
              <span className="text-xs opacity-75">{spread.cardCount}장</span>
            </div>
          </button>
        );
      })}
    </div>
  );
};

// 카드 선택 화면 (셔플 & 드로우)
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
    if (phase === 'shuffle' && shuffleCount < 3) {
      const timer = setTimeout(() => {
        setShuffleCount((prev) => prev + 1);
      }, 600);
      return () => clearTimeout(timer);
    } else if (shuffleCount >= 3) {
      setPhase('draw');
    }
  }, [phase, shuffleCount]);

  // 카드 선택
  const handleCardClick = (index: number) => {
    if (phase !== 'draw') return;
    if (selectedCards.includes(index) || selectedCards.length >= spread.cardCount) return;

    const newSelected = [...selectedCards, index];
    setSelectedCards(newSelected);

    if (newSelected.length === spread.cardCount) {
      // 모든 카드 선택 완료 - 랜덤 카드 뽑고 reveal 단계로
      const drawn = drawRandomCards(spread.cardCount);
      setDrawnCards(drawn);
      setPhase('reveal');
    }
  };

  // 분석 시작 버튼 클릭
  const handleStartAnalysis = () => {
    const result: DrawnCard[] = drawnCards.map((d, i) => ({
      card: d.card,
      orientation: d.isReversed ? 'reversed' : 'upright',
      position: spread.positions[i]?.korean,
      positionMeaning: spread.positions[i]?.description,
    }));
    onComplete(result);
  };

  // 디버그용 - 콘솔에 상태 출력
  useEffect(() => {
    console.log('[CardDrawing] phase:', phase, 'drawnCards:', drawnCards.length, 'selectedCards:', selectedCards.length);
  }, [phase, drawnCards.length, selectedCards.length]);

  if (phase === 'shuffle') {
    return (
      <div className="text-center py-16">
        {/* 셔플 애니메이션 영역 */}
        <div className="relative w-40 h-56 mx-auto mb-8">
          {/* 마법진 배경 */}
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="absolute w-64 h-64 border border-purple-500/20 rounded-full animate-spin-slow" />
            <div className="absolute w-48 h-48 border border-amber-500/20 rounded-full animate-spin-slow" style={{ animationDirection: 'reverse' }} />
          </div>

          {[0, 1, 2].map((i) => (
            <div
              key={i}
              className={`absolute inset-0 transition-all duration-500 ${shuffleCount > i ? 'opacity-0 scale-90 rotate-180' : ''
                }`}
              style={{
                transform: `rotate(${(i - 1) * 15}deg) translateX(${(i - 1) * 20}px)`,
              }}
            >
              <TarotCard isFlipped={false} size="large" />
            </div>
          ))}
        </div>

        <h2 className="text-2xl font-bold text-white mb-2">카드를 섞고 있습니다...</h2>
        <p className="text-purple-200/70">
          마음을 가다듬고 질문에 집중하세요
        </p>

        {/* 진행 인디케이터 */}
        <div className="flex justify-center gap-3 mt-6">
          {[0, 1, 2].map((i) => (
            <div
              key={i}
              className={`w-3 h-3 rounded-full transition-all duration-500 ${shuffleCount > i
                ? 'bg-gradient-to-r from-amber-400 to-purple-500 shadow-[0_0_10px_rgba(168,85,247,0.5)]'
                : 'bg-white/20'
                }`}
            />
          ))}
        </div>
      </div>
    );
  }

  if (phase === 'draw') {
    return (
      <div className="text-center py-8">
        {/* 헤더 */}
        <div className="mb-8">
          <h2 className="text-2xl font-bold text-white mb-2">
            {spread.cardCount}장의 카드를 선택하세요
          </h2>
          <p className="text-purple-200/80 mb-4">
            마음이 끌리는 카드를 직감에 따라 선택하세요
          </p>

          {/* 선택 진행 바 */}
          <div className="max-w-xs mx-auto">
            <div className="flex justify-between text-xs text-purple-300 mb-2">
              <span>선택</span>
              <span>{selectedCards.length} / {spread.cardCount}</span>
            </div>
            <div className="h-2 bg-white/10 rounded-full overflow-hidden">
              <div
                className="h-full bg-gradient-to-r from-amber-400 via-purple-500 to-pink-500 transition-all duration-500 rounded-full shadow-[0_0_10px_rgba(168,85,247,0.5)]"
                style={{ width: `${(selectedCards.length / spread.cardCount) * 100}%` }}
              />
            </div>
          </div>
        </div>

        {/* 카드 그리드 */}
        <div className="relative max-w-4xl mx-auto px-4">
          {/* 테이블 표면 효과 */}
          <div className="absolute inset-0 -top-10 -bottom-10 bg-gradient-to-b from-transparent via-purple-900/20 to-transparent rounded-3xl" />

          <div className="relative flex flex-wrap justify-center gap-3 md:gap-4">
            {Array.from({ length: 22 }).map((_, i) => (
              <div
                key={i}
                className={`transition-all duration-500 ${selectedCards.includes(i)
                  ? 'scale-75 opacity-30 blur-[1px] pointer-events-none'
                  : ''
                  }`}
                style={{
                  animationDelay: `${i * 50}ms`,
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
        <div className="mt-10 flex justify-center gap-3 flex-wrap px-4">
          {spread.positions.map((pos, i) => (
            <div
              key={pos.id}
              className={`px-4 py-2 rounded-xl border-2 transition-all duration-300 ${i < selectedCards.length
                ? 'border-amber-400/60 bg-gradient-to-r from-amber-500/20 to-purple-500/20 text-white shadow-[0_0_15px_rgba(251,191,36,0.2)]'
                : 'border-dashed border-white/20 text-white/50'
                }`}
            >
              <span className="text-sm font-medium">{pos.korean}</span>
            </div>
          ))}
        </div>
      </div>
    );
  }

  // reveal phase - 버튼 항상 표시
  return (
    <div className="text-center py-8">
      <h2 className="text-xl font-bold text-white mb-2">
        카드가 공개되었습니다!
      </h2>
      <p className="text-purple-200 mb-6">
        아래 버튼을 눌러 해석을 확인하세요
      </p>

      {/* 카드 표시 */}
      {drawnCards.length > 0 ? (
        <div className="flex justify-center gap-4 flex-wrap mb-8">
          {drawnCards.map((drawn, i) => (
            <div key={i} className="text-center">
              <div className="mb-2 text-sm text-purple-200">
                {spread.positions[i]?.korean}
              </div>
              <TarotCard
                card={drawn.card}
                isReversed={drawn.isReversed}
                isFlipped={true}
                delay={i * 300}
                size="medium"
              />
            </div>
          ))}
        </div>
      ) : (
        <div className="flex justify-center items-center py-16">
          <div className="w-8 h-8 border-2 border-purple-500 border-t-transparent rounded-full animate-spin" />
          <span className="ml-3 text-purple-200">카드를 준비하는 중...</span>
        </div>
      )}

      {/* 분석 시작 버튼 - 항상 표시 */}
      <div className="mt-4">
        <Button
          onClick={handleStartAnalysis}
          disabled={drawnCards.length === 0}
          className="bg-gradient-to-r from-purple-500 via-pink-500 to-rose-500 hover:from-purple-600 hover:via-pink-600 hover:to-rose-600 text-white shadow-lg shadow-purple-500/25 h-14 px-8 text-lg disabled:opacity-50"
        >
          <Sparkles className="mr-2 h-5 w-5" />
          타로 해석 보기
          <ArrowRight className="ml-2 h-5 w-5" />
        </Button>
      </div>
    </div>
  );
};

// 결과 화면
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

  return (
    <div className="space-y-8">
      {/* 헤더 */}
      <div className="text-center">
        <Badge className="mb-4 bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-300">
          {spread.korean} 리딩 완료
        </Badge>
        <h1 className="text-2xl font-bold mb-2">당신의 타로 리딩</h1>
        {question && (
          <p className="text-muted-foreground">"{question}"</p>
        )}
      </div>

      {/* 카드 배치 */}
      <div className="flex justify-center gap-4 flex-wrap py-6">
        {cards.map((drawn, i) => (
          <div
            key={i}
            className={`text-center cursor-pointer transition-all ${selectedCard === i ? 'scale-110' : 'opacity-70 hover:opacity-100'
              }`}
            onClick={() => setSelectedCard(i)}
          >
            <div className="mb-2 text-sm text-muted-foreground">
              {drawn.position}
            </div>
            <TarotCard
              card={drawn.card}
              isReversed={drawn.orientation === 'reversed'}
              isFlipped={true}
              size="medium"
            />
          </div>
        ))}
      </div>

      {/* 선택된 카드 상세 해석 */}
      <Card className="bg-gradient-to-br from-purple-50 to-indigo-50 dark:from-purple-950/30 dark:to-indigo-950/30">
        <CardHeader>
          <div className="flex items-center gap-4">
            <div className="text-4xl">
              {cards[selectedCard].card.type === 'major'
                ? getMajorSymbol(cards[selectedCard].card.id)
                : SUIT_DATA[cards[selectedCard].card.suit!]?.symbol}
            </div>
            <div>
              <CardTitle className="flex items-center gap-2">
                {cards[selectedCard].card.korean}
                {cards[selectedCard].orientation === 'reversed' && (
                  <Badge variant="destructive" className="text-xs">역방향</Badge>
                )}
              </CardTitle>
              <CardDescription>
                {cards[selectedCard].position} - {cards[selectedCard].positionMeaning}
              </CardDescription>
            </div>
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* 스토리 */}
          {MAJOR_MEANINGS[cards[selectedCard].card.id]?.story && (
            <div className="p-4 rounded-lg bg-white/50 dark:bg-black/20 italic">
              "{MAJOR_MEANINGS[cards[selectedCard].card.id].story}"
            </div>
          )}

          {/* 해석 */}
          <div className="space-y-3">
            <div>
              <h4 className="font-medium mb-1">이 위치에서의 의미</h4>
              <p className="text-muted-foreground">
                {interpretCard(
                  cards[selectedCard].card,
                  cards[selectedCard].orientation,
                  'general'
                )}
              </p>
            </div>

            {/* 키워드 */}
            <div>
              <h4 className="font-medium mb-2">키워드</h4>
              <div className="flex flex-wrap gap-2">
                {cards[selectedCard].card.keywords.map((keyword, i) => (
                  <Badge key={i} variant="outline">
                    {keyword}
                  </Badge>
                ))}
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* 종합 메시지 */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Sparkles className="h-5 w-5 text-purple-500" />
            종합 메시지
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-lg leading-relaxed">
            {generateOverallMessage(cards)}
          </p>
        </CardContent>
      </Card>

      {/* 액션 버튼 */}
      <div className="flex justify-center gap-4">
        <Button variant="outline" onClick={onReset}>
          <RotateCcw className="mr-2 h-4 w-4" />
          다시 리딩하기
        </Button>
        <Link href="/fortune">
          <Button variant="ghost">
            다른 운세 보기
          </Button>
        </Link>
      </div>
    </div>
  );
};

// 종합 메시지 생성
function generateOverallMessage(cards: DrawnCard[]): string {
  const majorCount = cards.filter(c => c.card.type === 'major').length;
  const reversedCount = cards.filter(c => c.orientation === 'reversed').length;

  let message = '';

  if (majorCount >= cards.length / 2) {
    message += '메이저 아르카나가 많이 등장했습니다. 이것은 인생의 중요한 전환점이나 영적 성장의 시기임을 나타냅니다. ';
  }

  if (reversedCount >= cards.length / 2) {
    message += '많은 카드가 역방향으로 나왔습니다. 내면을 돌아보고 막힌 에너지를 풀어줄 시간이 필요합니다. ';
  } else if (reversedCount === 0) {
    message += '모든 카드가 정방향으로 나왔습니다. 현재 에너지가 순조롭게 흐르고 있습니다. ';
  }

  message += '카드가 전하는 메시지를 마음에 새기고, 직관을 믿으며 앞으로 나아가세요.';

  return message;
}

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

  // 결과 화면
  if (step === 'result') {
    return (
      <div className="min-h-screen bg-gradient-to-b from-slate-50 to-white dark:from-slate-950 dark:to-slate-900">
        <div className="container mx-auto px-4 py-8 md:py-12">
          <div className="max-w-4xl mx-auto">
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

  // 카드 드로우 화면
  if (step === 'draw') {
    return (
      <div className="min-h-screen bg-gradient-to-b from-indigo-950 via-purple-950 to-slate-950">
        <MagicParticles />
        <div className="container mx-auto px-4 py-8 relative z-10">
          <CardDrawing
            spreadType={spreadType}
            onComplete={handleDrawComplete}
          />
        </div>
      </div>
    );
  }

  // 질문 입력 화면
  if (step === 'question') {
    return (
      <div className="min-h-screen bg-gradient-to-b from-indigo-950 via-purple-950 to-slate-950">
        <MagicParticles />
        <div className="container mx-auto px-4 py-8 md:py-16 relative z-10">
          <div className="max-w-xl mx-auto">
            <div className="text-center mb-8">
              <Badge className="mb-4 bg-white/10 text-white border-white/20">
                {SPREAD_DEFINITIONS[spreadType].korean}
              </Badge>
              <h1 className="text-3xl font-bold text-white mb-4">
                질문을 떠올리세요
              </h1>
              <p className="text-purple-200">
                카드에게 물어보고 싶은 것을 마음속에 담으세요
              </p>
            </div>

            <Card className="bg-white/10 border-white/20 backdrop-blur-sm">
              <CardContent className="pt-6 space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="question" className="text-white/80">
                    질문 (선택사항)
                  </Label>
                  <Textarea
                    id="question"
                    placeholder="예: 현재 직장에서의 앞날은 어떻게 될까요?"
                    value={question}
                    onChange={(e) => setQuestion(e.target.value)}
                    className="bg-white/10 border-white/20 text-white placeholder:text-white/40 min-h-[100px]"
                  />
                </div>

                <div className="text-sm text-purple-200 space-y-1">
                  <p>💡 질문 작성 팁:</p>
                  <ul className="list-disc list-inside text-purple-300/70 space-y-1">
                    <li>구체적인 질문이 더 명확한 답을 가져옵니다</li>
                    <li>"예/아니오"보다 "어떻게", "무엇이" 질문이 좋습니다</li>
                    <li>질문 없이도 리딩은 가능합니다</li>
                  </ul>
                </div>

                <div className="flex gap-3 pt-4">
                  <Button
                    variant="outline"
                    className="flex-1 border-white/20 text-white hover:bg-white/10"
                    onClick={() => setStep('spread')}
                  >
                    뒤로
                  </Button>
                  <Button
                    className="flex-1 bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600"
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

  // 스프레드 선택 화면
  return (
    <div className="min-h-screen bg-gradient-to-b from-indigo-950 via-purple-950 to-slate-950">
      <MagicParticles />
      <div className="container mx-auto px-4 py-8 md:py-16 relative z-10">
        <div className="max-w-3xl mx-auto">
          {/* 헤더 */}
          <div className="text-center mb-8">
            <Badge className="mb-4 bg-white/10 text-white border-white/20">
              <Sparkles className="mr-1 h-3 w-3" />
              타로 카드 리딩
            </Badge>
            <h1 className="text-3xl md:text-5xl font-bold text-white mb-4">
              운명의 카드가<br />당신을 기다립니다
            </h1>
            <p className="text-purple-200">
              78장의 카드 속에 담긴 지혜가
              <br />
              당신의 질문에 답할 준비가 되어 있습니다
            </p>
          </div>

          {/* 스프레드 선택 */}
          <Card className="bg-white/10 border-white/20 backdrop-blur-sm mb-6">
            <CardHeader>
              <CardTitle className="text-white">스프레드 선택</CardTitle>
              <CardDescription className="text-white/60">
                원하는 리딩 방식을 선택하세요
              </CardDescription>
            </CardHeader>
            <CardContent>
              <SpreadSelector selected={spreadType} onSelect={handleSpreadSelect} />
            </CardContent>
          </Card>

          {/* 선택된 스프레드 정보 */}
          <Card className="bg-white/5 border-white/10 backdrop-blur-sm mb-6">
            <CardContent className="py-6">
              <div className="flex items-start gap-4">
                <Eye className="h-8 w-8 text-purple-400 mt-1" />
                <div>
                  <h3 className="font-bold text-white mb-1">
                    {SPREAD_DEFINITIONS[spreadType].korean}
                  </h3>
                  <p className="text-purple-200 text-sm">
                    {SPREAD_DEFINITIONS[spreadType].description}
                  </p>
                  <div className="flex flex-wrap gap-2 mt-3">
                    {SPREAD_DEFINITIONS[spreadType].positions.map((pos) => (
                      <Badge
                        key={pos.id}
                        variant="outline"
                        className="border-purple-400/50 text-purple-200"
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
            className="w-full bg-gradient-to-r from-purple-500 via-pink-500 to-rose-500 hover:from-purple-600 hover:via-pink-600 hover:to-rose-600 text-white shadow-lg shadow-purple-500/25 h-14 text-lg"
            onClick={handleStart}
          >
            리딩 시작하기
            <ArrowRight className="ml-2 h-5 w-5" />
          </Button>

          {/* 안내 */}
          <Card className="mt-6 bg-white/5 border-white/10 backdrop-blur-sm">
            <CardContent className="py-4">
              <div className="flex items-start gap-3">
                <Sparkles className="h-5 w-5 text-purple-300 mt-0.5" />
                <div className="text-sm text-white/60">
                  <p className="font-medium mb-1 text-white/80">타로 리딩이란?</p>
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
