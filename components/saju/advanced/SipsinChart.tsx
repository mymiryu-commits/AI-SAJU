'use client';

import { cn } from '@/lib/utils';
import type {
  SipsinChart as SipsinChartType,
  SipsinInterpretation,
  SipsinType
} from '@/lib/fortune/saju/analysis/sipsin';
import { SIPSIN_INFO } from '@/lib/fortune/saju/analysis/sipsin';

interface SipsinChartProps {
  chart: SipsinChartType;
  interpretation: SipsinInterpretation;
  className?: string;
}

// 십신 카테고리별 색상
const CATEGORY_COLORS: Record<string, { bg: string; text: string; border: string; bar: string }> = {
  '비겁': { bg: 'bg-blue-100 dark:bg-blue-900/30', text: 'text-blue-700 dark:text-blue-400', border: 'border-blue-300 dark:border-blue-700', bar: 'bg-blue-500' },
  '식상': { bg: 'bg-green-100 dark:bg-green-900/30', text: 'text-green-700 dark:text-green-400', border: 'border-green-300 dark:border-green-700', bar: 'bg-green-500' },
  '재성': { bg: 'bg-yellow-100 dark:bg-yellow-900/30', text: 'text-yellow-700 dark:text-yellow-400', border: 'border-yellow-300 dark:border-yellow-700', bar: 'bg-yellow-500' },
  '관성': { bg: 'bg-red-100 dark:bg-red-900/30', text: 'text-red-700 dark:text-red-400', border: 'border-red-300 dark:border-red-700', bar: 'bg-red-500' },
  '인성': { bg: 'bg-purple-100 dark:bg-purple-900/30', text: 'text-purple-700 dark:text-purple-400', border: 'border-purple-300 dark:border-purple-700', bar: 'bg-purple-500' }
};

function SipsinCell({ sipsinType, label }: { sipsinType: SipsinType; label: string }) {
  const info = SIPSIN_INFO[sipsinType];
  const colors = CATEGORY_COLORS[info.category];

  return (
    <div className={cn('p-3 rounded-lg border', colors.bg, colors.border)}>
      <div className="text-xs text-gray-500 dark:text-gray-400 mb-1">{label}</div>
      <div className={cn('text-lg font-bold', colors.text)}>
        {info.korean}
      </div>
      <div className="text-xs text-gray-600 dark:text-gray-400">
        {info.hanja}
      </div>
    </div>
  );
}

export function SipsinChart({ chart, interpretation, className }: SipsinChartProps) {
  // 카테고리별 분포 계산
  const categoryDistribution = {
    '비겁': chart.categoryDistribution.bigeop,
    '식상': chart.categoryDistribution.siksang,
    '재성': chart.categoryDistribution.jaesung,
    '관성': chart.categoryDistribution.gwansung,
    '인성': chart.categoryDistribution.insung
  };

  const totalCount = Object.values(categoryDistribution).reduce((a, b) => a + b, 0);

  return (
    <div className={cn('space-y-6', className)}>
      {/* 사주 원국 십신 배치 */}
      <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-sm border border-gray-200 dark:border-gray-700">
        <h3 className="text-lg font-bold text-gray-800 dark:text-white mb-4">
          사주 십신 배치
        </h3>

        <div className="grid grid-cols-4 gap-2 text-center mb-4">
          {/* 주 이름 */}
          {['시주', '일주', '월주', '년주'].map((name) => (
            <div key={name} className="text-xs text-gray-500 font-medium">
              {name}
            </div>
          ))}
        </div>

        {/* 천간 십신 */}
        <div className="grid grid-cols-4 gap-2 mb-2">
          <SipsinCell sipsinType={chart.hourStem} label="천간" />
          <SipsinCell sipsinType={chart.dayStem} label="일간(나)" />
          <SipsinCell sipsinType={chart.monthStem} label="천간" />
          <SipsinCell sipsinType={chart.yearStem} label="천간" />
        </div>

        {/* 지지 십신 */}
        <div className="grid grid-cols-4 gap-2">
          <SipsinCell sipsinType={chart.hourBranch} label="지지" />
          <SipsinCell sipsinType={chart.dayBranch} label="지지" />
          <SipsinCell sipsinType={chart.monthBranch} label="지지" />
          <SipsinCell sipsinType={chart.yearBranch} label="지지" />
        </div>
      </div>

      {/* 십신 분포 차트 */}
      <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-sm border border-gray-200 dark:border-gray-700">
        <h3 className="text-lg font-bold text-gray-800 dark:text-white mb-4">
          십신 카테고리 분포
        </h3>

        <div className="space-y-3">
          {Object.entries(categoryDistribution).map(([category, count]) => {
            const colors = CATEGORY_COLORS[category];
            const percentage = totalCount > 0 ? (count / totalCount) * 100 : 0;

            return (
              <div key={category} className="space-y-1">
                <div className="flex justify-between text-sm">
                  <span className={cn('font-medium', colors.text)}>{category}</span>
                  <span className="text-gray-500">{count}개</span>
                </div>
                <div className="h-3 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
                  <div
                    className={cn('h-full rounded-full transition-all', colors.bar)}
                    style={{ width: `${percentage}%` }}
                  />
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* 해석 */}
      <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-sm border border-gray-200 dark:border-gray-700">
        <h3 className="text-lg font-bold text-gray-800 dark:text-white mb-4">
          십신 해석
        </h3>

        <div className="space-y-4">
          {/* 주도 십신 */}
          {interpretation.dominant.length > 0 && (
            <div className="p-4 bg-gradient-to-r from-purple-50 to-blue-50 dark:from-purple-900/20 dark:to-blue-900/20 rounded-lg">
              <div className="text-sm text-gray-600 dark:text-gray-400 mb-1">주도 십신</div>
              <div className="text-lg font-bold text-purple-700 dark:text-purple-400">
                {interpretation.dominant.map(d => SIPSIN_INFO[d].korean).join(', ')}
              </div>
              <p className="text-sm text-gray-600 dark:text-gray-300 mt-1">
                {interpretation.dominant[0] && SIPSIN_INFO[interpretation.dominant[0]].personality}
              </p>
            </div>
          )}

          {/* 부족한 십신 */}
          {interpretation.missing.length > 0 && (
            <div className="p-4 bg-gray-50 dark:bg-gray-700/50 rounded-lg">
              <div className="text-sm text-gray-600 dark:text-gray-400 mb-1">보완이 필요한 십신</div>
              <div className="text-md font-medium text-gray-700 dark:text-gray-300">
                {interpretation.missing.map(m => SIPSIN_INFO[m].korean).join(', ')}
              </div>
            </div>
          )}

          {/* 균형 상태 */}
          <div className="p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
            <div className="text-sm text-gray-600 dark:text-gray-400 mb-1">균형 분석</div>
            <p className="text-sm text-gray-700 dark:text-gray-300">
              {interpretation.balance}
            </p>
          </div>

          {/* 성격 */}
          <div>
            <div className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">성격 특성</div>
            <p className="text-sm text-gray-600 dark:text-gray-400 bg-gray-50 dark:bg-gray-700/50 p-3 rounded-lg">
              {interpretation.personality}
            </p>
          </div>

          {/* 적합 직업 */}
          <div>
            <div className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">적합 직업</div>
            <p className="text-sm text-gray-600 dark:text-gray-400 bg-green-50 dark:bg-green-900/20 p-3 rounded-lg">
              {interpretation.career}
            </p>
          </div>

          {/* 조언 */}
          <div className="border-t border-gray-200 dark:border-gray-700 pt-4">
            <div className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">조언</div>
            <p className="text-sm text-gray-600 dark:text-gray-400">
              {interpretation.advice}
            </p>
          </div>
        </div>
      </div>

      {/* 십신 상세 정보 */}
      <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-sm border border-gray-200 dark:border-gray-700">
        <h3 className="text-lg font-bold text-gray-800 dark:text-white mb-4">
          십신 개념 설명
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
          {Object.entries(CATEGORY_COLORS).map(([category, colors]) => (
            <div key={category} className={cn('p-3 rounded-lg', colors.bg)}>
              <div className={cn('font-bold mb-1', colors.text)}>{category}</div>
              <div className="text-gray-600 dark:text-gray-400">
                {category === '비겁' && '나와 같은 기운 - 비견, 겁재 (독립심, 경쟁)'}
                {category === '식상' && '내가 생하는 기운 - 식신, 상관 (표현, 창의)'}
                {category === '재성' && '내가 극하는 기운 - 정재, 편재 (재물, 사업)'}
                {category === '관성' && '나를 극하는 기운 - 정관, 편관 (직장, 명예)'}
                {category === '인성' && '나를 생하는 기운 - 정인, 편인 (학문, 지혜)'}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
