'use client';

import { cn } from '@/lib/utils';
import { CHAT_SCENARIOS, type ChatScenario } from '@/types/chat';
import { Heart, Briefcase, Wallet, Activity, Users } from 'lucide-react';

interface ScenarioSelectorProps {
  selected: ChatScenario | null;
  onSelect: (scenario: ChatScenario) => void;
  disabled?: boolean;
}

const SCENARIO_ICONS: Record<ChatScenario, React.ReactNode> = {
  love: <Heart className="w-5 h-5" />,
  career: <Briefcase className="w-5 h-5" />,
  finance: <Wallet className="w-5 h-5" />,
  health: <Activity className="w-5 h-5" />,
  family: <Users className="w-5 h-5" />
};

const SCENARIO_COLORS: Record<ChatScenario, string> = {
  love: 'from-pink-500 to-rose-500 hover:from-pink-600 hover:to-rose-600',
  career: 'from-blue-500 to-indigo-500 hover:from-blue-600 hover:to-indigo-600',
  finance: 'from-yellow-500 to-orange-500 hover:from-yellow-600 hover:to-orange-600',
  health: 'from-green-500 to-emerald-500 hover:from-green-600 hover:to-emerald-600',
  family: 'from-purple-500 to-violet-500 hover:from-purple-600 hover:to-violet-600'
};

const SCENARIO_BG_COLORS: Record<ChatScenario, string> = {
  love: 'bg-pink-50 dark:bg-pink-900/20 border-pink-200 dark:border-pink-800',
  career: 'bg-blue-50 dark:bg-blue-900/20 border-blue-200 dark:border-blue-800',
  finance: 'bg-yellow-50 dark:bg-yellow-900/20 border-yellow-200 dark:border-yellow-800',
  health: 'bg-green-50 dark:bg-green-900/20 border-green-200 dark:border-green-800',
  family: 'bg-purple-50 dark:bg-purple-900/20 border-purple-200 dark:border-purple-800'
};

export function ScenarioSelector({ selected, onSelect, disabled }: ScenarioSelectorProps) {
  return (
    <div className="space-y-3">
      <h3 className="text-sm font-medium text-gray-700 dark:text-gray-300">
        상담 주제를 선택하세요
      </h3>

      <div className="grid grid-cols-2 sm:grid-cols-5 gap-3">
        {Object.values(CHAT_SCENARIOS).map((scenario) => (
          <button
            key={scenario.id}
            onClick={() => onSelect(scenario.id)}
            disabled={disabled}
            className={cn(
              'relative flex flex-col items-center gap-2 p-4 rounded-xl border-2 transition-all duration-200',
              selected === scenario.id
                ? `${SCENARIO_BG_COLORS[scenario.id]} ring-2 ring-offset-2 ring-offset-white dark:ring-offset-gray-900`
                : 'bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700 hover:border-gray-300 dark:hover:border-gray-600',
              disabled && 'opacity-50 cursor-not-allowed'
            )}
          >
            {/* 아이콘 */}
            <div
              className={cn(
                'w-10 h-10 rounded-full flex items-center justify-center text-white bg-gradient-to-br',
                SCENARIO_COLORS[scenario.id]
              )}
            >
              {SCENARIO_ICONS[scenario.id]}
            </div>

            {/* 텍스트 */}
            <div className="text-center">
              <div className="text-sm font-medium text-gray-800 dark:text-gray-200">
                {scenario.icon} {scenario.name}
              </div>
              <div className="text-xs text-gray-500 dark:text-gray-400 mt-1 hidden sm:block">
                {scenario.description}
              </div>
            </div>

            {/* 선택 표시 */}
            {selected === scenario.id && (
              <div className="absolute -top-1 -right-1 w-5 h-5 bg-green-500 rounded-full flex items-center justify-center">
                <svg className="w-3 h-3 text-white" fill="currentColor" viewBox="0 0 20 20">
                  <path
                    fillRule="evenodd"
                    d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                    clipRule="evenodd"
                  />
                </svg>
              </div>
            )}
          </button>
        ))}
      </div>

      {/* 선택된 시나리오 상세 */}
      {selected && (
        <div className={cn('p-3 rounded-lg border', SCENARIO_BG_COLORS[selected])}>
          <div className="flex items-center gap-2 text-sm">
            <span className="font-medium">활용 데이터:</span>
            <div className="flex flex-wrap gap-1">
              {CHAT_SCENARIOS[selected].sajuDataUsed.map((data) => (
                <span
                  key={data}
                  className="px-2 py-0.5 bg-white/50 dark:bg-black/20 rounded text-xs"
                >
                  {data}
                </span>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
