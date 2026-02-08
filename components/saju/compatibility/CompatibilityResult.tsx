'use client';

import { cn } from '@/lib/utils';
import { Heart, Star, TrendingUp, TrendingDown, Users, Briefcase } from 'lucide-react';
import type { CoupleCompatibilityResult } from '@/lib/fortune/compatibility';
import { SynergyRadar } from './SynergyRadar';

interface CompatibilityResultProps {
  result: CoupleCompatibilityResult;
  person1Name?: string;
  person2Name?: string;
  className?: string;
}

const GRADE_COLORS = {
  S: 'from-yellow-400 to-amber-500',
  A: 'from-green-400 to-emerald-500',
  B: 'from-blue-400 to-cyan-500',
  C: 'from-orange-400 to-amber-500',
  D: 'from-gray-400 to-slate-500'
};

const GRADE_BG = {
  S: 'bg-yellow-50 dark:bg-yellow-900/20 border-yellow-200 dark:border-yellow-800',
  A: 'bg-green-50 dark:bg-green-900/20 border-green-200 dark:border-green-800',
  B: 'bg-blue-50 dark:bg-blue-900/20 border-blue-200 dark:border-blue-800',
  C: 'bg-orange-50 dark:bg-orange-900/20 border-orange-200 dark:border-orange-800',
  D: 'bg-gray-50 dark:bg-gray-800/50 border-gray-200 dark:border-gray-700'
};

function ScoreBar({ score, label }: { score: number; label: string }) {
  const getColor = () => {
    if (score >= 70) return 'bg-green-500';
    if (score >= 50) return 'bg-yellow-500';
    return 'bg-red-500';
  };

  return (
    <div className="space-y-1">
      <div className="flex justify-between text-sm">
        <span className="text-gray-600 dark:text-gray-400">{label}</span>
        <span className="font-medium text-gray-800 dark:text-white">{score}점</span>
      </div>
      <div className="h-2 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
        <div
          className={cn('h-full rounded-full transition-all', getColor())}
          style={{ width: `${score}%` }}
        />
      </div>
    </div>
  );
}

export function CompatibilityResult({
  result,
  person1Name = '나',
  person2Name = '상대방',
  className
}: CompatibilityResultProps) {
  return (
    <div className={cn('space-y-6', className)}>
      {/* 메인 점수 카드 */}
      <div className={cn(
        'rounded-2xl p-6 border-2 text-center',
        GRADE_BG[result.grade]
      )}>
        <div className="flex justify-center mb-4">
          <Heart className="w-8 h-8 text-pink-500" />
        </div>

        <div className={cn(
          'inline-block px-6 py-3 rounded-xl bg-gradient-to-r text-white font-bold text-4xl mb-2',
          GRADE_COLORS[result.grade]
        )}>
          {result.totalScore}점
        </div>

        <div className="mt-4">
          <span className={cn(
            'inline-block px-4 py-2 rounded-full text-lg font-bold bg-gradient-to-r text-white',
            GRADE_COLORS[result.grade]
          )}>
            {result.grade}등급
          </span>
        </div>

        <p className="mt-4 text-lg text-gray-700 dark:text-gray-300">
          {result.gradeDescription}
        </p>

        <div className="mt-4 text-sm text-gray-500 dark:text-gray-400">
          {person1Name} ♥ {person2Name}
        </div>
      </div>

      {/* 카테고리별 점수 */}
      <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-sm border border-gray-200 dark:border-gray-700">
        <h3 className="text-lg font-bold text-gray-800 dark:text-white mb-4">
          분야별 궁합
        </h3>

        <div className="space-y-4">
          <div>
            <ScoreBar score={result.categories.dayMaster.score} label="일간 궁합 (성격)" />
            <p className="text-xs text-gray-500 mt-1">{result.categories.dayMaster.description}</p>
          </div>
          <div>
            <ScoreBar score={result.categories.earthlyBranch.score} label="지지 궁합 (인연)" />
            <p className="text-xs text-gray-500 mt-1">{result.categories.earthlyBranch.description}</p>
          </div>
          <div>
            <ScoreBar score={result.categories.oheng.score} label="오행 조화 (에너지)" />
            <p className="text-xs text-gray-500 mt-1">{result.categories.oheng.description}</p>
          </div>
          <div>
            <ScoreBar score={result.categories.yongsin.score} label="용신 보완 (시너지)" />
            <p className="text-xs text-gray-500 mt-1">{result.categories.yongsin.description}</p>
          </div>
        </div>
      </div>

      {/* 시너지 레이더 차트 */}
      <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-sm border border-gray-200 dark:border-gray-700">
        <h3 className="text-lg font-bold text-gray-800 dark:text-white mb-4">
          관계 시너지
        </h3>
        <SynergyRadar synergy={result.synergy} />
      </div>

      {/* 상세 분석 */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* 장점 */}
        <div className="bg-green-50 dark:bg-green-900/20 rounded-xl p-5 border border-green-200 dark:border-green-800">
          <div className="flex items-center gap-2 mb-3">
            <TrendingUp className="w-5 h-5 text-green-600 dark:text-green-400" />
            <h4 className="font-bold text-green-700 dark:text-green-400">장점</h4>
          </div>
          <ul className="space-y-2">
            {result.strengths.map((strength, idx) => (
              <li key={idx} className="text-sm text-green-800 dark:text-green-300 flex items-start gap-2">
                <Star className="w-4 h-4 mt-0.5 flex-shrink-0" />
                <span>{strength}</span>
              </li>
            ))}
          </ul>
        </div>

        {/* 과제 */}
        <div className="bg-orange-50 dark:bg-orange-900/20 rounded-xl p-5 border border-orange-200 dark:border-orange-800">
          <div className="flex items-center gap-2 mb-3">
            <TrendingDown className="w-5 h-5 text-orange-600 dark:text-orange-400" />
            <h4 className="font-bold text-orange-700 dark:text-orange-400">과제</h4>
          </div>
          <ul className="space-y-2">
            {result.challenges.map((challenge, idx) => (
              <li key={idx} className="text-sm text-orange-800 dark:text-orange-300 flex items-start gap-2">
                <span className="mt-0.5">•</span>
                <span>{challenge}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>

      {/* 조언 */}
      <div className="bg-gradient-to-r from-purple-50 to-pink-50 dark:from-purple-900/20 dark:to-pink-900/20 rounded-xl p-6 border border-purple-200 dark:border-purple-800">
        <h4 className="font-bold text-purple-700 dark:text-purple-400 mb-3">
          💝 관계 조언
        </h4>
        <ul className="space-y-2">
          {result.advice.map((adv, idx) => (
            <li key={idx} className="text-sm text-gray-700 dark:text-gray-300">
              {adv}
            </li>
          ))}
        </ul>
      </div>

      {/* 상세 정보 */}
      <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-sm border border-gray-200 dark:border-gray-700">
        <h3 className="text-lg font-bold text-gray-800 dark:text-white mb-4">
          상세 분석
        </h3>

        {Object.entries(result.categories).map(([key, category]) => (
          <div key={key} className="mb-4 last:mb-0">
            <h5 className="font-medium text-gray-700 dark:text-gray-300 mb-2">
              {category.name}
            </h5>
            <ul className="space-y-1">
              {category.details.map((detail, idx) => (
                <li key={idx} className="text-sm text-gray-600 dark:text-gray-400 pl-4 relative">
                  <span className="absolute left-0">•</span>
                  {detail}
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>
    </div>
  );
}
