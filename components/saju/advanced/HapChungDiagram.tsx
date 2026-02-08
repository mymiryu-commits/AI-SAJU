'use client';

import { cn } from '@/lib/utils';
import { Link2, Unlink2, AlertCircle, Heart, Scale } from 'lucide-react';
import type { HapChungAnalysis, BranchRelation } from '@/lib/fortune/saju/analysis/hapchung';

interface HapChungDiagramProps {
  analysis: HapChungAnalysis;
  className?: string;
}

// 관계 유형별 스타일
const RELATION_STYLES = {
  '육합': {
    bg: 'bg-pink-100 dark:bg-pink-900/30',
    border: 'border-pink-300 dark:border-pink-700',
    text: 'text-pink-700 dark:text-pink-400',
    icon: Heart
  },
  '삼합': {
    bg: 'bg-yellow-100 dark:bg-yellow-900/30',
    border: 'border-yellow-300 dark:border-yellow-700',
    text: 'text-yellow-700 dark:text-yellow-400',
    icon: Link2
  },
  '방합': {
    bg: 'bg-green-100 dark:bg-green-900/30',
    border: 'border-green-300 dark:border-green-700',
    text: 'text-green-700 dark:text-green-400',
    icon: Link2
  },
  '충': {
    bg: 'bg-red-100 dark:bg-red-900/30',
    border: 'border-red-300 dark:border-red-700',
    text: 'text-red-700 dark:text-red-400',
    icon: Unlink2
  },
  '형': {
    bg: 'bg-orange-100 dark:bg-orange-900/30',
    border: 'border-orange-300 dark:border-orange-700',
    text: 'text-orange-700 dark:text-orange-400',
    icon: AlertCircle
  },
  '파': {
    bg: 'bg-purple-100 dark:bg-purple-900/30',
    border: 'border-purple-300 dark:border-purple-700',
    text: 'text-purple-700 dark:text-purple-400',
    icon: Unlink2
  },
  '해': {
    bg: 'bg-gray-100 dark:bg-gray-700/30',
    border: 'border-gray-300 dark:border-gray-600',
    text: 'text-gray-700 dark:text-gray-400',
    icon: AlertCircle
  }
};

function RelationCard({ relation }: { relation: BranchRelation }) {
  const style = RELATION_STYLES[relation.type];
  const Icon = style.icon;

  return (
    <div className={cn(
      'p-4 rounded-lg border',
      style.bg,
      style.border
    )}>
      <div className="flex items-start gap-3">
        <div className={cn('p-2 rounded-full bg-white dark:bg-gray-800')}>
          <Icon className={cn('w-5 h-5', style.text)} />
        </div>

        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-1">
            <span className={cn('font-bold', style.text)}>
              {relation.type}
            </span>
            <span className="text-sm text-gray-600 dark:text-gray-400">
              {relation.branches.join(' - ')}
            </span>
          </div>

          <div className="text-sm text-gray-500 dark:text-gray-400 mb-2">
            {relation.positions.join(' ↔ ')}
          </div>

          <p className="text-sm text-gray-700 dark:text-gray-300">
            {relation.effect}
          </p>

          {relation.result && (
            <div className="mt-2 inline-flex items-center gap-1 px-2 py-1 bg-white/50 dark:bg-black/20 rounded text-sm">
              <span className="text-gray-600 dark:text-gray-400">결과:</span>
              <span className={cn('font-medium', style.text)}>{relation.result} 기운</span>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

function HarmonyScoreGauge({ score }: { score: number }) {
  const getScoreColor = () => {
    if (score >= 70) return 'text-green-500';
    if (score >= 50) return 'text-yellow-500';
    return 'text-red-500';
  };

  const getScoreLabel = () => {
    if (score >= 70) return '조화로움';
    if (score >= 50) return '보통';
    return '갈등 있음';
  };

  const circumference = 2 * Math.PI * 40;
  const offset = circumference - (score / 100) * circumference;

  return (
    <div className="flex flex-col items-center">
      <div className="relative w-24 h-24">
        <svg className="w-24 h-24 transform -rotate-90">
          <circle
            cx="48"
            cy="48"
            r="40"
            stroke="currentColor"
            strokeWidth="8"
            fill="transparent"
            className="text-gray-200 dark:text-gray-700"
          />
          <circle
            cx="48"
            cy="48"
            r="40"
            stroke="currentColor"
            strokeWidth="8"
            fill="transparent"
            strokeDasharray={circumference}
            strokeDashoffset={offset}
            strokeLinecap="round"
            className={getScoreColor()}
          />
        </svg>
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <span className={cn('text-2xl font-bold', getScoreColor())}>{score}</span>
          <span className="text-xs text-gray-500">점</span>
        </div>
      </div>
      <div className={cn('text-sm font-medium mt-2', getScoreColor())}>
        {getScoreLabel()}
      </div>
    </div>
  );
}

export function HapChungDiagram({ analysis, className }: HapChungDiagramProps) {
  const hasHarmonies = analysis.harmonies.length > 0;
  const hasConflicts = analysis.conflicts.length > 0;

  return (
    <div className={cn('space-y-6', className)}>
      {/* 요약 카드 */}
      <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-sm border border-gray-200 dark:border-gray-700">
        <h3 className="text-lg font-bold text-gray-800 dark:text-white mb-4">
          합충형파해(合沖刑破害) 분석
        </h3>

        <div className="flex flex-col md:flex-row items-center gap-6">
          {/* 조화 점수 */}
          <HarmonyScoreGauge score={analysis.harmonyScore} />

          {/* 요약 텍스트 */}
          <div className="flex-1">
            <p className="text-gray-600 dark:text-gray-300 mb-4">
              {analysis.summary}
            </p>

            {/* 통계 */}
            <div className="grid grid-cols-2 gap-4">
              <div className="flex items-center gap-2 p-3 bg-green-50 dark:bg-green-900/20 rounded-lg">
                <Link2 className="w-5 h-5 text-green-500" />
                <div>
                  <div className="text-lg font-bold text-green-600 dark:text-green-400">
                    {analysis.harmonies.length}
                  </div>
                  <div className="text-xs text-gray-500">합(合)</div>
                </div>
              </div>
              <div className="flex items-center gap-2 p-3 bg-red-50 dark:bg-red-900/20 rounded-lg">
                <Unlink2 className="w-5 h-5 text-red-500" />
                <div>
                  <div className="text-lg font-bold text-red-600 dark:text-red-400">
                    {analysis.conflicts.length}
                  </div>
                  <div className="text-xs text-gray-500">충돌</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* 합 관계 */}
      {hasHarmonies && (
        <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-sm border border-gray-200 dark:border-gray-700">
          <h4 className="text-md font-bold text-gray-700 dark:text-gray-200 mb-4 flex items-center gap-2">
            <Link2 className="w-5 h-5 text-green-500" />
            합(合) 관계
          </h4>

          <div className="space-y-3">
            {analysis.harmonies.map((relation, idx) => (
              <RelationCard key={idx} relation={relation} />
            ))}
          </div>
        </div>
      )}

      {/* 충돌 관계 */}
      {hasConflicts && (
        <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-sm border border-gray-200 dark:border-gray-700">
          <h4 className="text-md font-bold text-gray-700 dark:text-gray-200 mb-4 flex items-center gap-2">
            <Unlink2 className="w-5 h-5 text-red-500" />
            충/형/파/해 관계
          </h4>

          <div className="space-y-3">
            {analysis.conflicts.map((relation, idx) => (
              <RelationCard key={idx} relation={relation} />
            ))}
          </div>
        </div>
      )}

      {/* 관계 없음 */}
      {!hasHarmonies && !hasConflicts && (
        <div className="bg-gray-50 dark:bg-gray-800 rounded-xl p-8 text-center">
          <Scale className="w-12 h-12 text-gray-400 mx-auto mb-3" />
          <p className="text-gray-600 dark:text-gray-400">
            지지 간 특별한 합이나 충이 없습니다.<br />
            평탄하고 안정적인 흐름입니다.
          </p>
        </div>
      )}

      {/* 조언 */}
      {analysis.advice.length > 0 && (
        <div className="bg-gradient-to-r from-purple-50 to-blue-50 dark:from-purple-900/20 dark:to-blue-900/20 rounded-xl p-6 border border-purple-200 dark:border-purple-800">
          <h4 className="text-md font-bold text-gray-700 dark:text-gray-200 mb-3">
            합충 활용 조언
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

      {/* 관계 유형 설명 */}
      <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-sm border border-gray-200 dark:border-gray-700">
        <h4 className="text-md font-bold text-gray-700 dark:text-gray-200 mb-4">
          관계 유형 설명
        </h4>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
          <div className="space-y-3">
            <div className="flex items-start gap-2">
              <span className="font-medium text-pink-600 dark:text-pink-400 min-w-[4rem]">육합:</span>
              <span className="text-gray-600 dark:text-gray-400">두 지지가 합하여 새로운 오행 기운 생성</span>
            </div>
            <div className="flex items-start gap-2">
              <span className="font-medium text-yellow-600 dark:text-yellow-400 min-w-[4rem]">삼합:</span>
              <span className="text-gray-600 dark:text-gray-400">세 지지가 모여 강한 오행 기운 형성</span>
            </div>
            <div className="flex items-start gap-2">
              <span className="font-medium text-green-600 dark:text-green-400 min-w-[4rem]">방합:</span>
              <span className="text-gray-600 dark:text-gray-400">같은 방향의 지지가 모여 방위 기운 강화</span>
            </div>
          </div>
          <div className="space-y-3">
            <div className="flex items-start gap-2">
              <span className="font-medium text-red-600 dark:text-red-400 min-w-[4rem]">충:</span>
              <span className="text-gray-600 dark:text-gray-400">정반대 위치 지지의 충돌, 변화와 이동</span>
            </div>
            <div className="flex items-start gap-2">
              <span className="font-medium text-orange-600 dark:text-orange-400 min-w-[4rem]">형:</span>
              <span className="text-gray-600 dark:text-gray-400">지지 간 형벌 관계, 시련과 성장</span>
            </div>
            <div className="flex items-start gap-2">
              <span className="font-medium text-purple-600 dark:text-purple-400 min-w-[4rem]">파/해:</span>
              <span className="text-gray-600 dark:text-gray-400">깨지거나 해하는 관계, 주의 필요</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
