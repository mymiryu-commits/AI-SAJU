'use client';

import { cn } from '@/lib/utils';
import { TrendingUp, TrendingDown, Circle, Zap } from 'lucide-react';
import type { UnsungAnalysis, UnsungPosition } from '@/lib/fortune/saju/analysis/unsung';

interface UnsungChartProps {
  analysis: UnsungAnalysis;
  className?: string;
}

// 단계별 색상
const STAGE_COLORS = {
  '성장기': {
    bg: 'bg-green-100 dark:bg-green-900/30',
    border: 'border-green-300 dark:border-green-700',
    text: 'text-green-700 dark:text-green-400',
    bar: 'bg-green-500'
  },
  '전성기': {
    bg: 'bg-yellow-100 dark:bg-yellow-900/30',
    border: 'border-yellow-300 dark:border-yellow-700',
    text: 'text-yellow-700 dark:text-yellow-400',
    bar: 'bg-yellow-500'
  },
  '쇠퇴기': {
    bg: 'bg-orange-100 dark:bg-orange-900/30',
    border: 'border-orange-300 dark:border-orange-700',
    text: 'text-orange-700 dark:text-orange-400',
    bar: 'bg-orange-500'
  },
  '휴식기': {
    bg: 'bg-blue-100 dark:bg-blue-900/30',
    border: 'border-blue-300 dark:border-blue-700',
    text: 'text-blue-700 dark:text-blue-400',
    bar: 'bg-blue-500'
  }
};

function EnergyBar({ level, stage }: { level: number; stage: string }) {
  const colors = STAGE_COLORS[stage as keyof typeof STAGE_COLORS];
  const percentage = (level / 10) * 100;

  return (
    <div className="flex items-center gap-2">
      <div className="flex-1 h-2 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
        <div
          className={cn('h-full rounded-full transition-all', colors.bar)}
          style={{ width: `${percentage}%` }}
        />
      </div>
      <span className={cn('text-sm font-medium min-w-[2rem] text-right', colors.text)}>
        {level}
      </span>
    </div>
  );
}

function UnsungCard({ position, isPeak, isLowest }: {
  position: UnsungPosition;
  isPeak: boolean;
  isLowest: boolean;
}) {
  const colors = STAGE_COLORS[position.info.stage];

  return (
    <div className={cn(
      'p-4 rounded-lg border relative',
      colors.bg,
      colors.border,
      isPeak && 'ring-2 ring-yellow-400 dark:ring-yellow-500',
      isLowest && 'ring-2 ring-gray-400 dark:ring-gray-500'
    )}>
      {isPeak && (
        <div className="absolute -top-2 -right-2 bg-yellow-500 text-white p-1 rounded-full">
          <TrendingUp className="w-3 h-3" />
        </div>
      )}
      {isLowest && (
        <div className="absolute -top-2 -right-2 bg-gray-500 text-white p-1 rounded-full">
          <TrendingDown className="w-3 h-3" />
        </div>
      )}

      <div className="text-xs text-gray-500 dark:text-gray-400 mb-1">
        {position.pillar}
      </div>

      <div className="flex items-center gap-2 mb-2">
        <span className="text-lg font-bold text-gray-800 dark:text-white">
          {position.branch}
        </span>
        <span className={cn('font-medium', colors.text)}>
          {position.info.korean}
        </span>
      </div>

      <div className="text-xs text-gray-500 dark:text-gray-400 mb-2">
        {position.info.hanja} - {position.info.description}
      </div>

      <EnergyBar level={position.info.energyLevel} stage={position.info.stage} />

      <div className={cn('text-xs mt-2 px-2 py-1 rounded-full inline-block', colors.text, colors.bg)}>
        {position.info.stage}
      </div>
    </div>
  );
}

export function UnsungChart({ analysis, className }: UnsungChartProps) {
  return (
    <div className={cn('space-y-6', className)}>
      {/* 요약 카드 */}
      <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-sm border border-gray-200 dark:border-gray-700">
        <h3 className="text-lg font-bold text-gray-800 dark:text-white mb-4">
          12운성(十二運星) 분석
        </h3>

        <p className="text-gray-600 dark:text-gray-300 mb-4">
          {analysis.lifeCycleSummary}
        </p>

        {/* 통계 */}
        <div className="grid grid-cols-2 gap-4">
          <div className="p-4 bg-gradient-to-r from-purple-50 to-blue-50 dark:from-purple-900/20 dark:to-blue-900/20 rounded-lg">
            <div className="text-sm text-gray-600 dark:text-gray-400 mb-1">주도 단계</div>
            <div className={cn(
              'text-xl font-bold',
              STAGE_COLORS[analysis.dominantStage].text
            )}>
              {analysis.dominantStage}
            </div>
          </div>
          <div className="p-4 bg-gradient-to-r from-yellow-50 to-orange-50 dark:from-yellow-900/20 dark:to-orange-900/20 rounded-lg">
            <div className="text-sm text-gray-600 dark:text-gray-400 mb-1">평균 에너지</div>
            <div className="flex items-center gap-2">
              <Zap className="w-5 h-5 text-yellow-500" />
              <span className="text-xl font-bold text-gray-800 dark:text-white">
                {analysis.averageEnergy}/10
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* 운성 배치 */}
      <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-sm border border-gray-200 dark:border-gray-700">
        <h4 className="text-md font-bold text-gray-700 dark:text-gray-200 mb-4">
          사주 운성 배치
        </h4>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {analysis.positions.map((pos, idx) => (
            <UnsungCard
              key={idx}
              position={pos}
              isPeak={pos === analysis.peakPosition}
              isLowest={pos === analysis.lowestPosition}
            />
          ))}
        </div>

        <div className="flex items-center gap-4 mt-4 text-sm text-gray-500 dark:text-gray-400">
          <div className="flex items-center gap-1">
            <div className="w-4 h-4 bg-yellow-500 rounded-full flex items-center justify-center">
              <TrendingUp className="w-2 h-2 text-white" />
            </div>
            <span>최고 에너지</span>
          </div>
          <div className="flex items-center gap-1">
            <div className="w-4 h-4 bg-gray-500 rounded-full flex items-center justify-center">
              <TrendingDown className="w-2 h-2 text-white" />
            </div>
            <span>최저 에너지</span>
          </div>
        </div>
      </div>

      {/* 에너지 사이클 시각화 */}
      <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-sm border border-gray-200 dark:border-gray-700">
        <h4 className="text-md font-bold text-gray-700 dark:text-gray-200 mb-4">
          에너지 사이클
        </h4>

        <div className="space-y-3">
          {analysis.positions.map((pos, idx) => (
            <div key={idx} className="flex items-center gap-4">
              <div className="w-16 text-sm text-gray-500 dark:text-gray-400">
                {pos.pillar}
              </div>
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-1">
                  <span className="font-medium text-gray-800 dark:text-white">
                    {pos.info.korean}
                  </span>
                  <span className={cn(
                    'text-xs px-2 py-0.5 rounded',
                    STAGE_COLORS[pos.info.stage].bg,
                    STAGE_COLORS[pos.info.stage].text
                  )}>
                    {pos.info.stage}
                  </span>
                </div>
                <EnergyBar level={pos.info.energyLevel} stage={pos.info.stage} />
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* 특성 */}
      <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-sm border border-gray-200 dark:border-gray-700">
        <h4 className="text-md font-bold text-gray-700 dark:text-gray-200 mb-4">
          일주 운성 특성
        </h4>

        {(() => {
          const dayPos = analysis.positions.find(p => p.pillar === '일주');
          if (!dayPos) return null;

          return (
            <div className="space-y-3">
              <div className="flex items-center gap-3">
                <div className={cn(
                  'w-12 h-12 rounded-full flex items-center justify-center',
                  STAGE_COLORS[dayPos.info.stage].bg
                )}>
                  <Circle className={cn('w-6 h-6', STAGE_COLORS[dayPos.info.stage].text)} />
                </div>
                <div>
                  <div className="font-bold text-gray-800 dark:text-white">
                    {dayPos.info.korean} ({dayPos.info.hanja})
                  </div>
                  <div className="text-sm text-gray-500">{dayPos.info.description}</div>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-2 mt-4">
                {dayPos.info.characteristics.map((char, idx) => (
                  <div
                    key={idx}
                    className={cn(
                      'p-2 rounded text-sm',
                      STAGE_COLORS[dayPos.info.stage].bg,
                      STAGE_COLORS[dayPos.info.stage].text
                    )}
                  >
                    {char}
                  </div>
                ))}
              </div>

              <div className="mt-4 p-4 bg-gray-50 dark:bg-gray-700/50 rounded-lg">
                <div className="text-sm text-gray-600 dark:text-gray-400">
                  <strong>조언:</strong> {dayPos.info.advice}
                </div>
              </div>
            </div>
          );
        })()}
      </div>

      {/* 조언 */}
      {analysis.advice.length > 0 && (
        <div className="bg-gradient-to-r from-purple-50 to-blue-50 dark:from-purple-900/20 dark:to-blue-900/20 rounded-xl p-6 border border-purple-200 dark:border-purple-800">
          <h4 className="text-md font-bold text-gray-700 dark:text-gray-200 mb-3">
            운성 활용 조언
          </h4>
          <ul className="space-y-2">
            {analysis.advice.map((adv, idx) => (
              <li key={idx} className="text-sm text-gray-600 dark:text-gray-300">
                {adv}
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}
