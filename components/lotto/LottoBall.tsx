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

function getColorStyle(num: number): { bg: string; shadow: string } {
  if (num <= 10) {
    return {
      bg: 'bg-gradient-to-br from-yellow-300 via-yellow-400 to-yellow-500 text-yellow-900',
      shadow: 'shadow-yellow-400/50',
    };
  }
  if (num <= 20) {
    return {
      bg: 'bg-gradient-to-br from-blue-400 via-blue-500 to-blue-600 text-white',
      shadow: 'shadow-blue-500/50',
    };
  }
  if (num <= 30) {
    return {
      bg: 'bg-gradient-to-br from-red-400 via-red-500 to-red-600 text-white',
      shadow: 'shadow-red-500/50',
    };
  }
  if (num <= 40) {
    return {
      bg: 'bg-gradient-to-br from-gray-400 via-gray-500 to-gray-600 text-white',
      shadow: 'shadow-gray-500/50',
    };
  }
  return {
    bg: 'bg-gradient-to-br from-green-400 via-green-500 to-green-600 text-white',
    shadow: 'shadow-green-500/50',
  };
}

const sizeClasses = {
  sm: 'w-8 h-8 text-xs',
  md: 'w-10 h-10 text-sm',
  lg: 'w-12 h-12 text-base',
  xl: 'w-14 h-14 text-lg',
};

export function LottoBall({
  number,
  size = 'md',
  isBonus = false,
  animated = false,
  delay = 0,
  className,
}: LottoBallProps) {
  const colorStyle = getColorStyle(number);

  return (
    <div
      className={cn(
        'rounded-full flex items-center justify-center font-bold shadow-lg',
        'relative overflow-hidden transition-all duration-300',
        'hover:scale-110 hover:shadow-xl',
        colorStyle.bg,
        colorStyle.shadow,
        sizeClasses[size],
        isBonus && 'ring-2 ring-purple-500 ring-offset-2 ring-offset-background',
        animated && 'animate-bounce-in',
        className
      )}
      style={animated ? { animationDelay: `${delay}ms` } : undefined}
    >
      {/* 하이라이트 효과 */}
      <div className="absolute inset-0 bg-gradient-to-br from-white/30 to-transparent rounded-full" />
      {/* 숫자 */}
      <span className="relative z-10 font-extrabold drop-shadow-sm">
        {number}
      </span>
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
  animated = false,
  className,
}: LottoNumbersProps) {
  return (
    <div className={cn('flex items-center gap-1.5 sm:gap-2', className)}>
      {numbers.map((num, index) => (
        <LottoBall
          key={`${num}-${index}`}
          number={num}
          size={size}
          animated={animated}
          delay={index * 100}
        />
      ))}
      {bonus !== undefined && (
        <>
          {showPlus && (
            <span className="text-muted-foreground mx-1 font-bold text-lg">+</span>
          )}
          <LottoBall
            number={bonus}
            size={size}
            isBonus
            animated={animated}
            delay={numbers.length * 100}
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
  highlight = false,
}: LottoResultDisplayProps) {
  const formatPrize = (amount: number) => {
    if (amount >= 100000000) {
      return `${(amount / 100000000).toFixed(0)}억`;
    }
    return `${(amount / 10000).toFixed(0)}만`;
  };

  return (
    <div
      className={cn(
        'rounded-xl p-4 border transition-all duration-300',
        highlight
          ? 'bg-gradient-to-br from-yellow-50 to-orange-50 dark:from-yellow-950/20 dark:to-orange-950/20 border-yellow-200 dark:border-yellow-800 shadow-md'
          : 'bg-card hover:shadow-md hover:border-primary/20'
      )}
    >
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <span
            className={cn(
              'text-lg font-bold',
              highlight && 'text-yellow-700 dark:text-yellow-400'
            )}
          >
            {round}회
          </span>
          {drawDate && (
            <span className="text-sm text-muted-foreground px-2 py-0.5 bg-muted rounded-full">
              {drawDate}
            </span>
          )}
        </div>
        {prize1st && (
          <div className="text-right">
            <div className="text-xs text-muted-foreground uppercase tracking-wide">
              1등 당첨금
            </div>
            <div className="font-bold text-lg text-green-600 dark:text-green-400">
              {formatPrize(prize1st)}원
            </div>
            {winners1st !== undefined && (
              <div className="text-xs text-muted-foreground flex items-center justify-end gap-1">
                <span className="inline-block w-2 h-2 rounded-full bg-green-500" />
                {winners1st}명 당첨
              </div>
            )}
          </div>
        )}
      </div>
      <LottoNumbers numbers={numbers} bonus={bonus} animated={highlight} />
    </div>
  );
}
