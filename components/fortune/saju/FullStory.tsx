'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import type { StorytellingAnalysis } from '@/types/cards';

interface FullStoryProps {
  story: StorytellingAnalysis['fullStory'];
  destinyLine?: string;
  className?: string;
}

type StoryAct = 'opening' | 'development' | 'climax' | 'resolution';

const actInfo: Record<StoryAct, { title: string; subtitle: string; icon: string; gradient: string }> = {
  opening: {
    title: '1막: 과거',
    subtitle: '당신의 길을 돌아봅니다',
    icon: '🌅',
    gradient: 'from-amber-400 to-orange-500'
  },
  development: {
    title: '2막: 현재',
    subtitle: '지금 당신의 자리',
    icon: '🌿',
    gradient: 'from-emerald-400 to-teal-500'
  },
  climax: {
    title: '3막: 미래',
    subtitle: '펼쳐질 내일의 이야기',
    icon: '✨',
    gradient: 'from-purple-400 to-pink-500'
  },
  resolution: {
    title: '4막: 행동',
    subtitle: '당신이 해야 할 것',
    icon: '🚀',
    gradient: 'from-blue-400 to-indigo-500'
  }
};

const acts: StoryAct[] = ['opening', 'development', 'climax', 'resolution'];

export function FullStory({ story, destinyLine, className = '' }: FullStoryProps) {
  const [currentAct, setCurrentAct] = useState<StoryAct>('opening');
  const [hasSeenAll, setHasSeenAll] = useState(false);
  const [seenActs, setSeenActs] = useState<Set<StoryAct>>(new Set(['opening']));

  const currentIndex = acts.indexOf(currentAct);
  const isLastAct = currentAct === 'resolution';

  const goToNextAct = () => {
    if (!isLastAct) {
      const nextAct = acts[currentIndex + 1];
      setCurrentAct(nextAct);
      setSeenActs(prev => new Set([...prev, nextAct]));
    } else {
      setHasSeenAll(true);
    }
  };

  const goToPrevAct = () => {
    if (currentIndex > 0) {
      setCurrentAct(acts[currentIndex - 1]);
    }
  };

  const info = actInfo[currentAct];

  return (
    <div className={`rounded-xl border border-gray-200 bg-white overflow-hidden ${className}`}>
      {/* 진행 탭 */}
      <div className="flex border-b border-gray-200">
        {acts.map((act, i) => {
          const actData = actInfo[act];
          const isActive = currentAct === act;
          const hasSeen = seenActs.has(act);

          return (
            <button
              key={act}
              onClick={() => hasSeen && setCurrentAct(act)}
              disabled={!hasSeen}
              className={`flex-1 py-3 text-center transition-colors ${
                isActive
                  ? 'bg-gray-900 text-white'
                  : hasSeen
                  ? 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  : 'bg-gray-50 text-gray-400 cursor-not-allowed'
              }`}
            >
              <span className="text-lg">{actData.icon}</span>
              <span className="ml-1 text-xs hidden sm:inline">{i + 1}막</span>
            </button>
          );
        })}
      </div>

      {/* 스토리 콘텐츠 */}
      <AnimatePresence mode="wait">
        <motion.div
          key={currentAct}
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -20 }}
          transition={{ duration: 0.3 }}
          className="p-6"
        >
          {/* 막 제목 */}
          <div className={`mb-6 rounded-lg bg-gradient-to-r ${info.gradient} p-4 text-white`}>
            <div className="flex items-center gap-2">
              <span className="text-2xl">{info.icon}</span>
              <div>
                <h3 className="font-bold">{info.title}</h3>
                <p className="text-sm opacity-90">{info.subtitle}</p>
              </div>
            </div>
          </div>

          {/* 스토리 텍스트 */}
          <div className="min-h-[150px]">
            <p className="text-sm text-gray-700 leading-relaxed whitespace-pre-line">
              {story[currentAct]}
            </p>
          </div>

          {/* 한 줄 운명 (마지막 막에서만) */}
          {isLastAct && destinyLine && hasSeenAll && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="mt-6 rounded-lg bg-gradient-to-r from-gray-900 to-gray-800 p-4 text-center"
            >
              <p className="text-xs text-gray-400 mb-1">당신의 운명을 한 줄로</p>
              <p className="text-sm font-medium text-white">
                "{destinyLine}"
              </p>
            </motion.div>
          )}

          {/* 네비게이션 버튼 */}
          <div className="mt-6 flex gap-3">
            {currentIndex > 0 && (
              <button
                onClick={goToPrevAct}
                className="flex-1 rounded-lg border border-gray-300 bg-white py-3 text-sm font-medium text-gray-700 hover:bg-gray-50"
              >
                ← 이전
              </button>
            )}
            <button
              onClick={goToNextAct}
              className={`flex-1 rounded-lg py-3 text-sm font-medium text-white bg-gradient-to-r ${info.gradient} hover:opacity-90`}
            >
              {isLastAct ? (hasSeenAll ? '✓ 완료' : '마무리') : '다음 →'}
            </button>
          </div>
        </motion.div>
      </AnimatePresence>
    </div>
  );
}

export default FullStory;
