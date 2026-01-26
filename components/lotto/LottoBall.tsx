'use client';

import { cn } from '@/lib/utils';

interface LottoBallProps {
  number: number;
  size?: 'sm' | 'md' | 'lg' | 'xl';
  isBonus?: boolean;
  animated?: boolean;
  delay?: number;
  className?: string;
}

// 공식 로또 색상 (한국 동행복권 기준)
function getBallColors(num: number): {
  primary: string;
  secondary: string;
  highlight: string;
  text: string;
  shadow: string;
  glow: string;
} {
  if (num <= 10) {
    // 노랑 (1-10)
    return {
      primary: 'from-yellow-300 via-yellow-400 to-yellow-500',
      secondary: 'from-yellow-200 to-yellow-400',
      highlight: 'from-white/80 via-yellow-100/60 to-transparent',
      text: 'text-yellow-900',
      shadow: 'shadow-yellow-500/50',
      glow: 'shadow-yellow-400/60',
    };
  }
  if (num <= 20) {
    // 파랑 (11-20)
    return {
      primary: 'from-blue-400 via-blue-500 to-blue-600',
      secondary: 'from-blue-300 to-blue-500',
      highlight: 'from-white/80 via-blue-200/60 to-transparent',
      text: 'text-white',
      shadow: 'shadow-blue-600/50',
      glow: 'shadow-blue-500/60',
    };
  }
  if (num <= 30) {
    // 빨강 (21-30)
    return {
      primary: 'from-red-400 via-red-500 to-red-600',
      secondary: 'from-red-300 to-red-500',
      highlight: 'from-white/80 via-red-200/60 to-transparent',
      text: 'text-white',
      shadow: 'shadow-red-600/50',
      glow: 'shadow-red-500/60',
    };
  }
  if (num <= 40) {
    // 회색 (31-40)
    return {
      primary: 'from-gray-400 via-gray-500 to-gray-600',
      secondary: 'from-gray-300 to-gray-500',
      highlight: 'from-white/80 via-gray-200/60 to-transparent',
      text: 'text-white',
      shadow: 'shadow-gray-600/50',
      glow: 'shadow-gray-500/60',
    };
  }
  // 초록 (41-45)
  return {
    primary: 'from-green-400 via-green-500 to-green-600',
    secondary: 'from-green-300 to-green-500',
    highlight: 'from-white/80 via-green-200/60 to-transparent',
    text: 'text-white',
    shadow: 'shadow-green-600/50',
    glow: 'shadow-green-500/60',
  };
}

const sizeConfig = {
  sm: {
    ball: 'w-9 h-9',
    text: 'text-sm font-bold',
    highlight: 'w-4 h-2',
    shadow: 'shadow-lg',
  },
  md: {
    ball: 'w-12 h-12',
    text: 'text-base font-bold',
    highlight: 'w-5 h-2.5',
    shadow: 'shadow-xl',
  },
  lg: {
    ball: 'w-14 h-14',
    text: 'text-lg font-bold',
    highlight: 'w-6 h-3',
    shadow: 'shadow-xl',
  },
  xl: {
    ball: 'w-16 h-16',
    text: 'text-xl font-extrabold',
    highlight: 'w-7 h-3.5',
    shadow: 'shadow-2xl',
  },
};

export function LottoBall({
  number,
  size = 'md',
  isBonus = false,
  animated = true,
  delay = 0,
  className,
}: LottoBallProps) {
  const colors = getBallColors(number);
  const config = sizeConfig[size];

  return (
    <div
      className={cn(
        'relative group',
        animated && 'animate-ball-drop',
        className
      )}
      style={{ animationDelay: `${delay}ms` }}
    >
      {/* 메인 공 */}
      <div
        className={cn(
          'relative rounded-full flex items-center justify-center',
          'bg-gradient-to-br',
          colors.primary,
          config.ball,
          config.shadow,
          colors.shadow,
          // 3D 효과
          'transform-gpu transition-all duration-300',
          'hover:scale-110 hover:-translate-y-1',
          animated && 'hover:animate-bounce-soft',
          // 보너스 볼 효과
          isBonus && [
            'ring-2 ring-offset-2 ring-purple-500',
            'after:absolute after:inset-0 after:rounded-full',
            'after:animate-ping after:bg-purple-400/30',
          ]
        )}
      >
        {/* 상단 하이라이트 (빛 반사) */}
        <div
          className={cn(
            'absolute top-1 left-1/2 -translate-x-1/2',
            'rounded-full opacity-90',
            'bg-gradient-to-b',
            colors.highlight,
            config.highlight
          )}
        />

        {/* 내부 그라데이션 (깊이감) */}
        <div
          className={cn(
            'absolute inset-1 rounded-full',
            'bg-gradient-to-br from-white/20 via-transparent to-black/20'
          )}
        />

        {/* 숫자 */}
        <span
          className={cn(
            'relative z-10',
            config.text,
            colors.text,
            'drop-shadow-sm',
            // 텍스트 입체감
            'text-shadow-ball'
          )}
          style={{
            textShadow: '0 1px 2px rgba(0,0,0,0.3), 0 -1px 1px rgba(255,255,255,0.2)',
          }}
        >
          {number}
        </span>

        {/* 하단 그림자 효과 */}
        <div
          className={cn(
            'absolute inset-0 rounded-full',
            'bg-gradient-to-t from-black/20 via-transparent to-transparent'
          )}
        />
      </div>

      {/* 바닥 그림자 */}
      <div
        className={cn(
          'absolute -bottom-1 left-1/2 -translate-x-1/2',
          'w-3/4 h-1 rounded-full',
          'bg-black/20 blur-sm',
          'transform-gpu transition-all duration-300',
          'group-hover:w-1/2 group-hover:blur-md group-hover:-bottom-2'
        )}
      />

      {/* 보너스 볼 라벨 */}
      {isBonus && (
        <div className="absolute -top-2 -right-2 z-20">
          <span className="inline-flex items-center justify-center w-5 h-5 text-[10px] font-bold text-white bg-purple-500 rounded-full shadow-lg animate-pulse">
            B
          </span>
        </div>
      )}
    </div>
  );
}

interface LottoNumbersProps {
  numbers: number[];
  bonus?: number;
  size?: 'sm' | 'md' | 'lg' | 'xl';
  showPlus?: boolean;
  animated?: boolean;
  className?: string;
}

export function LottoNumbers({
  numbers,
  bonus,
  size = 'md',
  showPlus = true,
  animated = true,
  className,
}: LottoNumbersProps) {
  return (
    <div className={cn('flex items-center gap-2 flex-wrap', className)}>
      {numbers.map((num, index) => (
        <LottoBall
          key={`${num}-${index}`}
          number={num}
          size={size}
          animated={animated}
          delay={animated ? index * 100 : 0}
        />
      ))}
      {bonus !== undefined && (
        <>
          {showPlus && (
            <span className="text-2xl font-light text-muted-foreground mx-2 animate-pulse">
              +
            </span>
          )}
          <LottoBall
            number={bonus}
            size={size}
            isBonus
            animated={animated}
            delay={animated ? numbers.length * 100 + 200 : 0}
          />
        </>
      )}
    </div>
  );
}

interface LottoResultDisplayProps {
  round: number;
  numbers: number[];
  bonus: number;
  drawDate?: string;
  prize1st?: number;
  winners1st?: number;
  highlight?: boolean;
}

export function LottoResultDisplay({
  round,
  numbers,
  bonus,
  drawDate,
  prize1st,
  winners1st,
}: LottoResultDisplayProps) {
  const formatPrize = (amount: number) => {
    if (amount >= 100000000) {
      return `${(amount / 100000000).toFixed(0)}억`;
    }
    return `${(amount / 10000).toFixed(0)}만`;
  };

  return (
    <div className="relative overflow-hidden bg-gradient-to-br from-card via-card to-muted/30 rounded-2xl p-5 border border-border/50 shadow-lg hover:shadow-xl transition-all duration-300 group">
      {/* 배경 장식 */}
      <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-bl from-primary/5 to-transparent rounded-full -translate-y-1/2 translate-x-1/2" />
      <div className="absolute bottom-0 left-0 w-24 h-24 bg-gradient-to-tr from-primary/5 to-transparent rounded-full translate-y-1/2 -translate-x-1/2" />

      {/* 헤더 */}
      <div className="relative flex items-center justify-between mb-4">
        <div className="flex items-center gap-3">
          <div className="flex items-center justify-center w-12 h-12 rounded-xl bg-gradient-to-br from-amber-400 to-orange-500 shadow-lg shadow-orange-500/25">
            <span className="text-white font-bold text-lg">{round}</span>
          </div>
          <div>
            <span className="text-lg font-bold">제 {round}회</span>
            {drawDate && (
              <span className="text-sm text-muted-foreground block">
                {drawDate}
              </span>
            )}
          </div>
        </div>
        {prize1st && (
          <div className="text-right">
            <div className="text-xs text-muted-foreground mb-0.5">1등 당첨금</div>
            <div className="text-lg font-bold text-transparent bg-clip-text bg-gradient-to-r from-green-500 to-emerald-600">
              {formatPrize(prize1st)}원
            </div>
            {winners1st !== undefined && (
              <div className="text-xs text-muted-foreground">
                {winners1st}명 당첨
              </div>
            )}
          </div>
        )}
      </div>

      {/* 당첨 번호 */}
      <div className="relative">
        <LottoNumbers numbers={numbers} bonus={bonus} size="md" animated={false} />
      </div>

      {/* 호버 효과 */}
      <div className="absolute inset-0 rounded-2xl bg-gradient-to-r from-primary/0 via-primary/5 to-primary/0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none" />
    </div>
  );
}
