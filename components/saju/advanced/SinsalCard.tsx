'use client';

import { cn } from '@/lib/utils';
import { Star, Sparkles, AlertTriangle, Shield } from 'lucide-react';
import type { SinsalAnalysis, SinsalResult } from '@/lib/fortune/saju/analysis/sinsal';

interface SinsalCardProps {
  analysis: SinsalAnalysis;
  className?: string;
}

// 카테고리별 스타일
const CATEGORY_STYLES = {
  '길신': {
    icon: Sparkles,
    bg: 'bg-gradient-to-r from-yellow-50 to-amber-50 dark:from-yellow-900/20 dark:to-amber-900/20',
    border: 'border-yellow-200 dark:border-yellow-800',
    iconColor: 'text-yellow-500',
    badge: 'bg-yellow-100 text-yellow-700 dark:bg-yellow-900/50 dark:text-yellow-400'
  },
  '특수살': {
    icon: Star,
    bg: 'bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-900/20 dark:to-indigo-900/20',
    border: 'border-blue-200 dark:border-blue-800',
    iconColor: 'text-blue-500',
    badge: 'bg-blue-100 text-blue-700 dark:bg-blue-900/50 dark:text-blue-400'
  },
  '흉살': {
    icon: AlertTriangle,
    bg: 'bg-gradient-to-r from-red-50 to-orange-50 dark:from-red-900/20 dark:to-orange-900/20',
    border: 'border-red-200 dark:border-red-800',
    iconColor: 'text-red-500',
    badge: 'bg-red-100 text-red-700 dark:bg-red-900/50 dark:text-red-400'
  }
};

function SinsalItem({ result }: { result: SinsalResult }) {
  const style = CATEGORY_STYLES[result.info.category];
  const Icon = style.icon;

  return (
    <div className={cn(
      'p-4 rounded-lg border',
      style.bg,
      style.border
    )}>
      <div className="flex items-start gap-3">
        <div className={cn('p-2 rounded-full bg-white dark:bg-gray-800', style.iconColor)}>
          <Icon className="w-5 h-5" />
        </div>

        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-1">
            <span className="font-bold text-gray-800 dark:text-white">
              {result.info.korean}
            </span>
            <span className="text-sm text-gray-500 dark:text-gray-400">
              ({result.info.hanja})
            </span>
            {result.location && (
              <span className={cn('px-2 py-0.5 rounded text-xs font-medium', style.badge)}>
                {result.location}
              </span>
            )}
          </div>

          <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">
            {result.info.description}
          </p>

          <div className="text-sm text-gray-700 dark:text-gray-300">
            <strong>효과:</strong> {result.info.effect}
          </div>

          <div className="text-sm text-gray-600 dark:text-gray-400 mt-1">
            <strong>발현:</strong> {result.info.activation}
          </div>

          {result.info.remedy && (
            <div className="mt-2 flex items-center gap-2 text-sm text-green-700 dark:text-green-400">
              <Shield className="w-4 h-4" />
              <span>{result.info.remedy}</span>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export function SinsalCard({ analysis, className }: SinsalCardProps) {
  const hasGilsin = analysis.gilsin.length > 0;
  const hasTeuksu = analysis.teuksuSal.length > 0;
  const hasHyung = analysis.hyungsal.length > 0;

  return (
    <div className={cn('space-y-6', className)}>
      {/* 요약 */}
      <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-sm border border-gray-200 dark:border-gray-700">
        <h3 className="text-lg font-bold text-gray-800 dark:text-white mb-4">
          신살(神殺) 분석 요약
        </h3>

        <p className="text-gray-600 dark:text-gray-300 mb-4">
          {analysis.summary}
        </p>

        {/* 통계 */}
        <div className="grid grid-cols-3 gap-4 mb-4">
          <div className="text-center p-3 bg-yellow-50 dark:bg-yellow-900/20 rounded-lg">
            <div className="text-2xl font-bold text-yellow-600 dark:text-yellow-400">
              {analysis.gilsin.length}
            </div>
            <div className="text-sm text-gray-600 dark:text-gray-400">길신</div>
          </div>
          <div className="text-center p-3 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
            <div className="text-2xl font-bold text-blue-600 dark:text-blue-400">
              {analysis.teuksuSal.length}
            </div>
            <div className="text-sm text-gray-600 dark:text-gray-400">특수살</div>
          </div>
          <div className="text-center p-3 bg-red-50 dark:bg-red-900/20 rounded-lg">
            <div className="text-2xl font-bold text-red-600 dark:text-red-400">
              {analysis.hyungsal.length}
            </div>
            <div className="text-sm text-gray-600 dark:text-gray-400">흉살</div>
          </div>
        </div>
      </div>

      {/* 길신 */}
      {hasGilsin && (
        <div className="space-y-3">
          <h4 className="text-md font-bold text-gray-700 dark:text-gray-200 flex items-center gap-2">
            <Sparkles className="w-5 h-5 text-yellow-500" />
            길신 (吉神)
          </h4>
          {analysis.gilsin.map((result, idx) => (
            <SinsalItem key={idx} result={result} />
          ))}
        </div>
      )}

      {/* 특수살 */}
      {hasTeuksu && (
        <div className="space-y-3">
          <h4 className="text-md font-bold text-gray-700 dark:text-gray-200 flex items-center gap-2">
            <Star className="w-5 h-5 text-blue-500" />
            특수살 (特殊殺)
          </h4>
          {analysis.teuksuSal.map((result, idx) => (
            <SinsalItem key={idx} result={result} />
          ))}
        </div>
      )}

      {/* 흉살 */}
      {hasHyung && (
        <div className="space-y-3">
          <h4 className="text-md font-bold text-gray-700 dark:text-gray-200 flex items-center gap-2">
            <AlertTriangle className="w-5 h-5 text-red-500" />
            흉살 (凶殺)
          </h4>
          {analysis.hyungsal.map((result, idx) => (
            <SinsalItem key={idx} result={result} />
          ))}
        </div>
      )}

      {/* 조언 */}
      {analysis.advice.length > 0 && (
        <div className="bg-gradient-to-r from-purple-50 to-blue-50 dark:from-purple-900/20 dark:to-blue-900/20 rounded-xl p-6 border border-purple-200 dark:border-purple-800">
          <h4 className="text-md font-bold text-gray-700 dark:text-gray-200 mb-3">
            신살 활용 조언
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

      {/* 아무것도 없을 때 */}
      {!hasGilsin && !hasTeuksu && !hasHyung && (
        <div className="bg-gray-50 dark:bg-gray-800 rounded-xl p-8 text-center">
          <Shield className="w-12 h-12 text-gray-400 mx-auto mb-3" />
          <p className="text-gray-600 dark:text-gray-400">
            특별히 강하게 작용하는 신살이 없습니다.<br />
            평탄하고 안정적인 사주입니다.
          </p>
        </div>
      )}
    </div>
  );
}
