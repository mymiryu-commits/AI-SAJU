'use client';

import { cn } from '@/lib/utils';

interface LottoBallProps {
  number: number;
  size?: 'sm' | 'md' | 'lg';
  isBonus?: boolean;
  className?: string;
}

function getColorClass(num: number): string {
  if (num <= 10) return 'bg-yellow-400 text-yellow-900';
  if (num <= 20) return 'bg-blue-400 text-white';
  if (num <= 30) return 'bg-red-400 text-white';
  if (num <= 40) return 'bg-gray-500 text-white';
  return 'bg-green-500 text-white';
}

const sizeClasses = {
  sm: 'w-8 h-8 text-sm',
  md: 'w-10 h-10 text-base',
  lg: 'w-12 h-12 text-lg',
};

export function LottoBall({
  number,
  size = 'md',
  isBonus = false,
  className,
}: LottoBallProps) {
  return (
    <div
      className={cn(
        'rounded-full flex items-center justify-center font-bold shadow-md',
        getColorClass(number),
        sizeClasses[size],
        isBonus && 'ring-2 ring-purple-500 ring-offset-2',
        className
      )}
    >
      {number}
    </div>
  );
}

interface LottoNumbersProps {
  numbers: number[];
  bonus?: number;
  size?: 'sm' | 'md' | 'lg';
  showPlus?: boolean;
  className?: string;
}

export function LottoNumbers({
  numbers,
  bonus,
  size = 'md',
  showPlus = true,
  className,
}: LottoNumbersProps) {
  return (
    <div className={cn('flex items-center gap-2', className)}>
      {numbers.map((num, index) => (
        <LottoBall key={`${num}-${index}`} number={num} size={size} />
      ))}
      {bonus !== undefined && (
        <>
          {showPlus && <span className="text-muted-foreground mx-1">+</span>}
          <LottoBall number={bonus} size={size} isBonus />
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
    <div className="bg-card rounded-lg p-4 border">
      <div className="flex items-center justify-between mb-3">
        <div>
          <span className="text-lg font-bold">{round}회</span>
          {drawDate && (
            <span className="text-sm text-muted-foreground ml-2">
              {drawDate}
            </span>
          )}
        </div>
        {prize1st && (
          <div className="text-right">
            <div className="text-sm text-muted-foreground">1등 당첨금</div>
            <div className="font-bold text-green-600">
              {formatPrize(prize1st)}원
            </div>
            {winners1st && (
              <div className="text-xs text-muted-foreground">
                {winners1st}명 당첨
              </div>
            )}
          </div>
        )}
      </div>
      <LottoNumbers numbers={numbers} bonus={bonus} />
    </div>
  );
}
