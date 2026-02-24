'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import type { PastVerification as PastVerificationType } from '@/types/cards';
import { generateVerificationResponse } from '@/lib/fortune/saju/cards';

interface PastVerificationProps {
  verifications: PastVerificationType[];
  onComplete?: (results: boolean[]) => void;
  className?: string;
}

export function PastVerification({
  verifications,
  onComplete,
  className = ''
}: PastVerificationProps) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [results, setResults] = useState<boolean[]>([]);
  const [showResponse, setShowResponse] = useState(false);
  const [lastResponse, setLastResponse] = useState('');
  const [isComplete, setIsComplete] = useState(false);

  const currentVerification = verifications[currentIndex];
  const isLastQuestion = currentIndex === verifications.length - 1;

  const handleAnswer = (isCorrect: boolean) => {
    // 응답 메시지 생성
    const response = generateVerificationResponse(isCorrect, currentVerification);
    setLastResponse(response);
    setShowResponse(true);

    // 결과 저장
    const newResults = [...results, isCorrect];
    setResults(newResults);

    // 3초 후 다음으로
    setTimeout(() => {
      setShowResponse(false);

      if (isLastQuestion) {
        setIsComplete(true);
        onComplete?.(newResults);
      } else {
        setCurrentIndex(currentIndex + 1);
      }
    }, 3000);
  };

  // 완료 화면
  if (isComplete) {
    const correctCount = results.filter(r => r).length;
    const confidenceLevel = correctCount >= 2 ? '높음' : correctCount >= 1 ? '중간' : '낮음';

    return (
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className={`rounded-xl border border-gray-200 bg-white p-6 text-center ${className}`}
      >
        <div className="text-4xl mb-3">✨</div>
        <h3 className="text-lg font-bold text-gray-900">
          과거 검증 완료
        </h3>
        <p className="mt-2 text-sm text-gray-600">
          {correctCount}개의 예측이 맞았습니다
        </p>
        <div className={`mt-3 inline-block rounded-full px-4 py-1 text-sm font-medium ${
          confidenceLevel === '높음' ? 'bg-green-100 text-green-700' :
          confidenceLevel === '중간' ? 'bg-yellow-100 text-yellow-700' :
          'bg-gray-100 text-gray-700'
        }`}>
          신뢰도: {confidenceLevel}
        </div>
        <p className="mt-4 text-sm text-gray-500">
          과거가 맞았다면, 미래도 믿어주세요.
        </p>
      </motion.div>
    );
  }

  return (
    <div className={`rounded-xl border border-gray-200 bg-white p-6 ${className}`}>
      {/* 헤더 */}
      <div className="mb-4 text-center">
        <h3 className="text-lg font-bold text-gray-900">
          📍 먼저, 과거를 한번 볼게요
        </h3>
        <p className="mt-1 text-sm text-gray-500">
          {currentIndex + 1} / {verifications.length}
        </p>
      </div>

      {/* 진행 바 */}
      <div className="mb-6 h-1 w-full overflow-hidden rounded-full bg-gray-200">
        <motion.div
          initial={{ width: 0 }}
          animate={{ width: `${((currentIndex + (showResponse ? 1 : 0)) / verifications.length) * 100}%` }}
          className="h-full bg-purple-500"
        />
      </div>

      <AnimatePresence mode="wait">
        {showResponse ? (
          // 응답 화면
          <motion.div
            key="response"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="min-h-[200px] flex flex-col items-center justify-center"
          >
            <div className="rounded-lg bg-purple-50 p-4 text-center">
              <p className="text-sm text-purple-800 leading-relaxed">
                {lastResponse}
              </p>
            </div>
          </motion.div>
        ) : (
          // 질문 화면
          <motion.div
            key={`question-${currentIndex}`}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="min-h-[200px]"
          >
            {/* 기간 표시 */}
            <div className="mb-4 rounded-lg bg-gray-50 p-4 text-center">
              <p className="text-sm font-medium text-gray-900">
                {currentVerification.period}
              </p>
            </div>

            {/* 예측 내용 */}
            <div className="mb-6">
              <p className="text-center text-sm text-gray-700 leading-relaxed">
                {currentVerification.prediction}
              </p>

              {/* 키워드 */}
              <div className="mt-3 flex flex-wrap justify-center gap-2">
                {currentVerification.keywords.map((keyword, i) => (
                  <span
                    key={i}
                    className="rounded-full bg-gray-100 px-3 py-1 text-xs text-gray-600"
                  >
                    {keyword}
                  </span>
                ))}
              </div>
            </div>

            {/* 응답 버튼 */}
            <div className="flex gap-3">
              <button
                onClick={() => handleAnswer(true)}
                className="flex-1 rounded-lg bg-purple-500 py-3 text-sm font-medium text-white hover:bg-purple-600 transition-colors"
              >
                맞아요 ✓
              </button>
              <button
                onClick={() => handleAnswer(false)}
                className="flex-1 rounded-lg border border-gray-300 bg-white py-3 text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors"
              >
                아니에요
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

export default PastVerification;
