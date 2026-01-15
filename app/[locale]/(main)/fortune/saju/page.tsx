'use client';

import { useState, useCallback } from 'react';
import { useTranslations } from 'next-intl';
import { Badge } from '@/components/ui/badge';
import { Sparkles, Loader2, CheckCircle } from 'lucide-react';
import { Progress } from '@/components/ui/progress';

// 새로 구현한 컴포넌트들
import {
  SajuInputForm,
  SajuResultCard,
  PaywallModal
} from '@/components/fortune/saju';

// 타입
import type { UserInput, AnalysisResult, PremiumContent } from '@/types/saju';

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
  const [isPremiumUnlocked, setIsPremiumUnlocked] = useState(false);
  const [isPurchasing, setIsPurchasing] = useState(false);
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
    setIsPremiumUnlocked(false);
    setIsPurchasing(false);
    setError(null);
  };

  const handleUpgrade = () => {
    setShowPaywall(true);
  };

  // 프리미엄 분석 데이터 로드
  const loadPremiumAnalysis = useCallback(async (productId: string) => {
    if (!userInput || !analysisId) return;

    setIsPurchasing(true);

    try {
      const response = await fetch('/api/fortune/saju/premium', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          input: userInput,
          productType: productId,
          analysisId
        })
      });

      const data = await response.json();

      if (!response.ok || !data.success) {
        throw new Error(data.error || '프리미엄 분석 로드 중 오류가 발생했습니다.');
      }

      // 분석 결과에 프리미엄 데이터 추가
      setAnalysisResult(prev => {
        if (!prev) return prev;
        return {
          ...prev,
          premium: data.data.premium
        };
      });

      setIsPremiumUnlocked(true);
      setShowPaywall(false);

    } catch (err) {
      setError(err instanceof Error ? err.message : '프리미엄 분석 로드 중 오류가 발생했습니다.');
    } finally {
      setIsPurchasing(false);
    }
  }, [userInput, analysisId]);

  // 구매 처리
  const handlePurchase = async (productId: string) => {
    // 실제로는 여기서 결제 API를 호출합니다
    // 현재는 시연용으로 바로 프리미엄 분석을 로드합니다
    console.log('Purchase initiated:', productId, analysisId);

    // 결제 시뮬레이션 (실제 환경에서는 결제 게이트웨이 연동)
    await loadPremiumAnalysis(productId);
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
              isPremiumUnlocked={isPremiumUnlocked}
            />

            {/* 전환 유도 영역 */}
            {conversionData && !isPremiumUnlocked && (
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

            {/* 프리미엄 해제 완료 메시지 */}
            {isPremiumUnlocked && (
              <div className="mt-8 p-6 bg-gradient-to-r from-green-500 to-emerald-500 text-white rounded-xl">
                <div className="flex items-center gap-3">
                  <CheckCircle className="w-8 h-8" />
                  <div>
                    <h3 className="text-xl font-bold">프리미엄 분석이 해제되었습니다!</h3>
                    <p className="text-sm text-white/80">
                      위의 &apos;프리미엄&apos; 탭에서 모든 분석 결과를 확인하세요.
                    </p>
                  </div>
                </div>
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
            isOpen={showPaywall && !isPurchasing}
            onClose={() => setShowPaywall(false)}
            template={conversionData.paywallTemplate}
            onPurchase={handlePurchase}
          />
        )}

        {/* 구매 처리 중 오버레이 */}
        {isPurchasing && (
          <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50">
            <div className="bg-white dark:bg-gray-900 rounded-2xl p-8 text-center max-w-sm">
              <Loader2 className="w-12 h-12 mx-auto mb-4 text-purple-600 animate-spin" />
              <h3 className="text-xl font-bold text-gray-800 dark:text-white mb-2">
                프리미엄 분석 준비 중...
              </h3>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                AI가 심층 분석을 생성하고 있습니다.
              </p>
            </div>
          </div>
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
