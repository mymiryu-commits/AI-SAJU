'use client';

import { motion } from 'framer-motion';
import type { YearlyTimeline, TimelinePeriod } from '@/types/cards';

interface YearlyTimelineProps {
  timeline: YearlyTimeline;
  className?: string;
}

// 단계별 색상
const phaseColors: Record<TimelinePeriod['phase'], { bg: string; bar: string; text: string }> = {
  preparation: { bg: 'bg-slate-100', bar: 'bg-slate-400', text: 'text-slate-600' },
  rising: { bg: 'bg-emerald-50', bar: 'bg-emerald-500', text: 'text-emerald-700' },
  adjustment: { bg: 'bg-amber-50', bar: 'bg-amber-400', text: 'text-amber-700' },
  dormant: { bg: 'bg-gray-100', bar: 'bg-gray-400', text: 'text-gray-600' },
  harvest: { bg: 'bg-orange-50', bar: 'bg-orange-500', text: 'text-orange-700' },
  closing: { bg: 'bg-indigo-50', bar: 'bg-indigo-400', text: 'text-indigo-700' }
};

// 단계별 아이콘
const phaseIcons: Record<TimelinePeriod['phase'], string> = {
  preparation: '🌱',
  rising: '🌅',
  adjustment: '☁️',
  dormant: '🌫️',
  harvest: '🌾',
  closing: '🌙'
};

export function YearlyTimeline({ timeline, className = '' }: YearlyTimelineProps) {
  return (
    <div className={`rounded-xl border border-gray-200 bg-white p-6 ${className}`}>
      {/* 헤더 */}
      <div className="mb-6 text-center">
        <h3 className="text-lg font-bold text-gray-900">
          📅 {timeline.year}년 당신의 흐름
        </h3>
        <p className="mt-2 text-sm text-gray-500">
          {timeline.story}
        </p>
      </div>

      {/* 타임라인 바 */}
      <div className="space-y-3">
        {timeline.periods.map((period, index) => {
          const colors = phaseColors[period.phase];
          const icon = phaseIcons[period.phase];

          return (
            <motion.div
              key={period.months}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.1 }}
              className={`rounded-lg p-3 ${colors.bg} ${period.highlight ? 'ring-2 ring-yellow-400' : ''}`}
            >
              <div className="flex items-center justify-between">
                {/* 왼쪽: 기간 정보 */}
                <div className="flex items-center gap-3">
                  <span className="text-xl">{icon}</span>
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="font-medium text-gray-900">{period.months}</span>
                      <span className={`text-xs font-semibold ${colors.text}`}>
                        {period.phaseKorean}
                      </span>
                      {period.highlight && (
                        <span className="text-xs text-yellow-600">⭐</span>
                      )}
                    </div>
                    <p className="text-xs text-gray-500">{period.description}</p>
                  </div>
                </div>

                {/* 오른쪽: 점수 바 */}
                <div className="flex items-center gap-2">
                  <div className="h-2 w-24 overflow-hidden rounded-full bg-gray-200">
                    <motion.div
                      initial={{ width: 0 }}
                      animate={{ width: `${period.score}%` }}
                      transition={{ delay: index * 0.1 + 0.3, duration: 0.5 }}
                      className={`h-full ${colors.bar}`}
                    />
                  </div>
                  <span className="text-xs font-medium text-gray-600 w-8">
                    {period.score}
                  </span>
                </div>
              </div>

              {/* 추천 행동 (접힌 상태에서는 숨김) */}
              {period.highlight && (
                <div className="mt-2 flex flex-wrap gap-1">
                  {period.actions.map((action, i) => (
                    <span
                      key={i}
                      className="rounded-full bg-white/80 px-2 py-0.5 text-xs text-gray-600"
                    >
                      {action}
                    </span>
                  ))}
                </div>
              )}
            </motion.div>
          );
        })}
      </div>

      {/* 핵심 메시지 */}
      <div className="mt-6 rounded-lg bg-gradient-to-r from-purple-50 to-pink-50 p-4">
        <p className="text-center text-sm font-medium text-gray-700">
          💡 <span className="text-purple-700">{timeline.keyMessage}</span>
        </p>
      </div>
    </div>
  );
}

export default YearlyTimeline;
