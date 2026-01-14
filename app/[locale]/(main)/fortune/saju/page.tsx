'use client';

import { useState } from 'react';
import { useTranslations } from 'next-intl';
import { Badge } from '@/components/ui/badge';
import { Sparkles, Loader2 } from 'lucide-react';
import { Progress } from '@/components/ui/progress';

// 새로 구현한 컴포넌트들
import {
  SajuInputForm,
  SajuResultCard,
  PaywallModal
} from '@/components/fortune/saju';

// 타입
import type { UserInput, AnalysisResult } from '@/types/saju';

interface ConversionData {
  paywallTemplate: {
    type: "freeToPaywall" | "timing" | "family" | "peer" | "exit" | "group";
    headline: string;
    bullets: string[];
    urgency: string;
    cta: string;
    discount?: { amount: number; expiresIn: number };
  };
  urgencyBanner: { message: string; subMessage: string };
  socialProof: { message: string };
  productRecommendation: { productId: string; reason: string };
}

export default function SajuPage() {
  const t = useTranslations('fortune.saju');
  const [step, setStep] = useState<'form' | 'analyzing' | 'result'>('form');
  const [progress, setProgress] = useState(0);
  const [userInput, setUserInput] = useState<UserInput | null>(null);
  const [analysisResult, setAnalysisResult] = useState<AnalysisResult | null>(null);
  const [conversionData, setConversionData] = useState<ConversionData | null>(null);
  const [analysisId, setAnalysisId] = useState<string | null>(null);
  const [showPaywall, setShowPaywall] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (input: UserInput) => {
    setUserInput(input);
    setStep('analyzing');
    setProgress(0);
    setError(null);

    // 진행률 애니메이션
    const progressInterval = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 90) {
          return prev;
        }
        return prev + 10;
      });
    }, 200);

    try {
      const response = await fetch('/api/fortune/saju/analyze', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(input)
      });

      const data = await response.json();

      if (!response.ok || !data.success) {
        throw new Error(data.error || '분석 중 오류가 발생했습니다.');
      }

      clearInterval(progressInterval);
      setProgress(100);

      // 결과 저장
      setAnalysisResult(data.data.result);
      setConversionData(data.data.conversion);
      if (data.meta?.analysisId) {
        setAnalysisId(data.meta.analysisId);
      }

      // 약간의 딜레이 후 결과 화면으로
      setTimeout(() => {
        setStep('result');
      }, 500);

    } catch (err) {
      clearInterval(progressInterval);
      setError(err instanceof Error ? err.message : '분석 중 오류가 발생했습니다.');
      setStep('form');
    }
  };

  const handleReset = () => {
    setStep('form');
    setProgress(0);
    setUserInput(null);
    setAnalysisResult(null);
    setConversionData(null);
    setAnalysisId(null);
    setError(null);
  };

  const handleUpgrade = () => {
    setShowPaywall(true);
  };

  // 분석 중 화면
  if (step === 'analyzing') {
    return (
      <div className="container mx-auto px-4 py-16">
        <div className="max-w-md mx-auto text-center">
          <div className="mb-8">
            <div className="w-24 h-24 mx-auto mb-6 rounded-full bg-gradient-to-r from-purple-500 to-pink-500 flex items-center justify-center animate-pulse">
              <Sparkles className="h-12 w-12 text-white" />
            </div>
            <h2 className="text-2xl font-bold mb-2">
              {userInput?.name}님의 사주를 분석 중입니다
            </h2>
            <p className="text-muted-foreground">
              AI가 사주팔자를 정밀 분석하고 있습니다...
            </p>
          </div>
          <div className="space-y-2">
            <Progress value={progress} className="h-3" />
            <p className="text-sm text-muted-foreground">{progress}% 완료</p>
          </div>
          <div className="mt-8 flex items-center justify-center gap-2 text-sm text-muted-foreground">
            <Loader2 className="h-4 w-4 animate-spin" />
            <span>잠시만 기다려주세요...</span>
          </div>
        </div>
      </div>
    );
  }

  // 결과 화면
  if (step === 'result' && analysisResult && userInput) {
    return (
      <>
        <div className="container mx-auto px-4 py-8 md:py-16">
          <div className="max-w-3xl mx-auto">
            {/* 헤더 */}
            <div className="text-center mb-8">
              <Badge className="mb-4 bg-green-100 text-green-700 dark:bg-green-900 dark:text-green-300">
                분석 완료
              </Badge>
              <h1 className="text-3xl md:text-4xl font-bold mb-2">
                {userInput.name}님의 사주 분석 결과
              </h1>
              <p className="text-muted-foreground">
                {userInput.birthDate} | {userInput.gender === 'male' ? '남성' : '여성'}
              </p>
            </div>

            {/* 결과 카드 */}
            <SajuResultCard
              result={{ ...analysisResult, user: userInput } as AnalysisResult}
              onUnlockPremium={handleUpgrade}
            />

            {/* 전환 유도 영역 */}
            {conversionData && (
              <div className="mt-8 p-6 bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-xl">
                <h3 className="text-xl font-bold mb-2">
                  {conversionData.paywallTemplate.headline}
                </h3>
                <ul className="mb-4 space-y-2">
                  {conversionData.paywallTemplate.bullets.slice(0, 3).map((bullet, i) => (
                    <li key={i} className="flex items-start gap-2">
                      <span className="text-yellow-300">✓</span>
                      <span className="text-sm">{bullet}</span>
                    </li>
                  ))}
                </ul>
                <p className="text-sm text-white/80 mb-4">
                  {conversionData.urgencyBanner.message}
                </p>
                <button
                  onClick={handleUpgrade}
                  className="w-full py-3 bg-white text-purple-600 font-bold rounded-lg hover:bg-white/90 transition"
                >
                  {conversionData.paywallTemplate.cta}
                </button>
              </div>
            )}

            {/* 다시 분석하기 버튼 */}
            <div className="mt-8 text-center">
              <button
                onClick={handleReset}
                className="text-muted-foreground hover:text-foreground transition"
              >
                다시 분석하기
              </button>
            </div>
          </div>
        </div>

        {/* 페이월 모달 */}
        {conversionData?.paywallTemplate && (
          <PaywallModal
            isOpen={showPaywall}
            onClose={() => setShowPaywall(false)}
            template={conversionData.paywallTemplate}
            onPurchase={(productId) => {
              console.log('Purchase:', productId, analysisId);
              setShowPaywall(false);
            }}
          />
        )}
      </>
    );
  }

  // 입력 폼 화면
  return (
    <div className="container mx-auto px-4 py-8 md:py-16">
      <div className="max-w-2xl mx-auto">
        {/* 헤더 */}
        <div className="text-center mb-8">
          <Badge className="mb-4 bg-purple-100 text-purple-700 dark:bg-purple-900 dark:text-purple-300">
            <Sparkles className="mr-1 h-3 w-3" />
            AI 사주 분석
          </Badge>
          <h1 className="text-3xl md:text-4xl font-bold mb-4">{t('title')}</h1>
          <p className="text-muted-foreground">{t('subtitle')}</p>
        </div>

        {/* 에러 메시지 */}
        {error && (
          <div className="mb-6 p-4 bg-red-100 text-red-700 rounded-lg">
            {error}
          </div>
        )}

        {/* 입력 폼 */}
        <SajuInputForm onSubmit={handleSubmit} isLoading={false} />
      </div>
    </div>
  );
}
