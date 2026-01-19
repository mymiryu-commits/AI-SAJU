'use client';

import { useState, useCallback, useEffect, useRef } from 'react';
import { useTranslations } from 'next-intl';
import { Badge } from '@/components/ui/badge';
import { Sparkles, Loader2, CheckCircle, Coins, Crown, MessageCircle, BookOpen, Heart, ChevronRight } from 'lucide-react';
import { Progress } from '@/components/ui/progress';
import { useAuth } from '@/lib/hooks/useAuth';
import Link from 'next/link';

// 새로 구현한 컴포넌트들
import {
  SajuInputForm,
  SajuResultCard,
  PaywallModal
} from '@/components/fortune/saju';

// 타입
import type { UserInput, AnalysisResult, PRODUCTS } from '@/types/saju';

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

// 상품 레벨 타입
type ProductLevel = 'free' | 'basic' | 'deep' | 'premium' | 'vip';

export default function SajuPage() {
  const t = useTranslations('fortune.saju');
  const { user, isAdmin } = useAuth();
  const [step, setStep] = useState<'form' | 'analyzing' | 'result'>('form');
  const [progress, setProgress] = useState(0);
  const [userInput, setUserInput] = useState<UserInput | null>(null);
  const [analysisResult, setAnalysisResult] = useState<AnalysisResult | null>(null);
  const [conversionData, setConversionData] = useState<ConversionData | null>(null);
  const [analysisId, setAnalysisId] = useState<string | null>(null);
  const [showPaywall, setShowPaywall] = useState(false);
  const [isPremiumUnlocked, setIsPremiumUnlocked] = useState(false);
  const [productLevel, setProductLevel] = useState<ProductLevel>('free');  // 구매한 상품 레벨
  const [isPurchasing, setIsPurchasing] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // 포인트 관련 상태
  const [userPoints, setUserPoints] = useState(0);
  const [isLoadingPoints, setIsLoadingPoints] = useState(true);

  // Refs to track latest values (for closure issues)
  const userInputRef = useRef<UserInput | null>(null);
  const analysisIdRef = useRef<string | null>(null);

  // Sync refs with state
  useEffect(() => {
    userInputRef.current = userInput;
    console.log('userInputRef updated:', userInput?.name || 'null');
  }, [userInput]);

  useEffect(() => {
    analysisIdRef.current = analysisId;
    console.log('analysisIdRef updated:', analysisId || 'null');
  }, [analysisId]);

  // 포인트 조회
  useEffect(() => {
    const fetchPoints = async () => {
      try {
        const response = await fetch('/api/points');
        const data = await response.json();
        if (data.success) {
          setUserPoints(data.data.points);
        }
      } catch (err) {
        console.error('Failed to fetch points:', err);
      } finally {
        setIsLoadingPoints(false);
      }
    };

    fetchPoints();
  }, []);

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
    setProductLevel('free');  // 상품 레벨 초기화
    setIsPurchasing(false);
    setError(null);
  };

  const handleUpgrade = () => {
    setShowPaywall(true);
  };

  // 프리미엄 분석 데이터 로드
  const loadPremiumAnalysis = useCallback(async (productId: string) => {
    // Use refs to get the latest values (avoid stale closures)
    const currentUserInput = userInputRef.current;
    const currentAnalysisId = analysisIdRef.current;

    console.log('loadPremiumAnalysis called:', {
      productId,
      hasUserInput: !!currentUserInput,
      userInputName: currentUserInput?.name,
      analysisId: currentAnalysisId || 'null (will create new)',
      // Also log state values for debugging
      stateUserInput: !!userInput,
      stateAnalysisId: analysisId
    });

    // userInput만 필수, analysisId는 선택 (없으면 새로 생성됨)
    if (!currentUserInput) {
      console.error('Missing userInput - free analysis required first');
      throw new Error('분석 데이터가 없습니다. 먼저 무료 분석을 진행해주세요.');
    }

    try {
      console.log('Calling premium API with input:', currentUserInput.name);
      const response = await fetch('/api/fortune/saju/premium', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          input: currentUserInput,
          productType: productId,
          analysisId: currentAnalysisId || undefined  // null이면 undefined로 전달
        })
      });

      const data = await response.json();
      console.log('Premium API response:', { ok: response.ok, success: data.success });

      if (!response.ok || !data.success) {
        console.error('Premium API error:', data.error);
        throw new Error(data.error || '프리미엄 분석 로드 중 오류가 발생했습니다.');
      }

      console.log('Updating analysis result with premium data...');
      // 분석 결과에 프리미엄 데이터 추가
      setAnalysisResult(prev => {
        if (!prev) return prev;
        return {
          ...prev,
          premium: data.data.premium
        };
      });

      // 새로 생성된 analysisId가 있으면 저장
      if (data.meta?.analysisId && !currentAnalysisId) {
        setAnalysisId(data.meta.analysisId);
      }

      setIsPremiumUnlocked(true);
      setShowPaywall(false);

    } catch (err) {
      throw err;
    }
  }, [userInput, analysisId]);

  // 포인트 차감 후 프리미엄 분석 구매 (관리자는 무료)
  const handlePurchase = async (productId: string) => {
    console.log('handlePurchase called with productId:', productId);
    setIsPurchasing(true);
    setError(null);

    try {
      // 관리자는 포인트 차감 없이 바로 프리미엄 분석
      if (isAdmin) {
        console.log('Admin user - skipping point deduction');
        try {
          await loadPremiumAnalysis(productId);
          // 구매한 상품 레벨 설정
          setProductLevel(productId as ProductLevel);
          console.log('Premium analysis loaded successfully for admin');
        } catch (adminErr) {
          console.error('Admin premium analysis error:', adminErr);
          throw adminErr;
        }
        return;
      }

      // PRODUCTS에서 포인트 비용 찾기
      const { PRODUCTS } = await import('@/types/saju');
      const product = PRODUCTS.find(p => p.id === productId);

      if (!product) {
        throw new Error('상품을 찾을 수 없습니다.');
      }

      const pointCost = product.pointCost;

      // 포인트 부족 체크
      if (userPoints < pointCost) {
        throw new Error(`포인트가 부족합니다. (필요: ${pointCost}P, 보유: ${userPoints}P)`);
      }

      // 포인트 차감 API 호출
      const pointResponse = await fetch('/api/points', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          productId,
          pointCost,
          analysisId
        })
      });

      const pointData = await pointResponse.json();

      if (!pointResponse.ok || !pointData.success) {
        throw new Error(pointData.error || '포인트 차감에 실패했습니다.');
      }

      // 포인트 잔액 업데이트
      setUserPoints(pointData.data.newBalance);

      // 프리미엄 분석 로드
      await loadPremiumAnalysis(productId);

      // 구매한 상품 레벨 설정
      setProductLevel(productId as ProductLevel);

    } catch (err) {
      setError(err instanceof Error ? err.message : '구매 중 오류가 발생했습니다.');
      setShowPaywall(false);
    } finally {
      setIsPurchasing(false);
    }
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

              {/* 포인트 표시 */}
              {!isLoadingPoints && (
                <div className="mt-4 inline-flex items-center gap-2 px-4 py-2 bg-yellow-50 dark:bg-yellow-900/30 rounded-full">
                  <Coins className="w-4 h-4 text-yellow-600" />
                  <span className="text-sm text-yellow-700 dark:text-yellow-400">
                    보유 포인트: <strong>{userPoints.toLocaleString()}P</strong>
                  </span>
                </div>
              )}
            </div>

            {/* 에러 메시지 */}
            {error && (
              <div className="mb-6 p-4 bg-red-100 text-red-700 rounded-lg">
                {error}
              </div>
            )}

            {/* 결과 카드 */}
            <SajuResultCard
              result={{ ...analysisResult, user: userInput } as AnalysisResult}
              onUnlockPremium={handleUpgrade}
              isPremiumUnlocked={isPremiumUnlocked}
              productLevel={productLevel}
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
                <div className="flex items-center gap-2 text-sm text-white/80 mb-4">
                  <Coins className="w-4 h-4" />
                  <span>포인트로 바로 구매 가능!</span>
                </div>
                <button
                  onClick={handleUpgrade}
                  className="w-full py-3 bg-white text-purple-600 font-bold rounded-lg hover:bg-white/90 transition flex items-center justify-center gap-2"
                >
                  <Coins className="w-5 h-5" />
                  포인트로 프리미엄 분석 받기
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
            userPoints={userPoints}
            isAdmin={isAdmin}
          />
        )}

        {/* 구매 처리 중 오버레이 */}
        {isPurchasing && (
          <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50">
            <div className="bg-white dark:bg-gray-900 rounded-2xl p-8 text-center max-w-sm">
              <Loader2 className="w-12 h-12 mx-auto mb-4 text-purple-600 animate-spin" />
              <h3 className="text-xl font-bold text-gray-800 dark:text-white mb-2">
                포인트 차감 및 분석 준비 중...
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

          {/* 포인트 표시 */}
          {!isLoadingPoints && userPoints > 0 && (
            <div className="mt-4 inline-flex items-center gap-2 px-4 py-2 bg-yellow-50 dark:bg-yellow-900/30 rounded-full">
              <Coins className="w-4 h-4 text-yellow-600" />
              <span className="text-sm text-yellow-700 dark:text-yellow-400">
                보유 포인트: <strong>{userPoints.toLocaleString()}P</strong>
              </span>
            </div>
          )}
        </div>

        {/* 관련 기능 메뉴 */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
          <Link href="/saju/chat" className="group">
            <div className="p-4 bg-gradient-to-br from-purple-50 to-pink-50 dark:from-purple-900/20 dark:to-pink-900/20 rounded-xl border border-purple-100 dark:border-purple-800/30 hover:shadow-lg transition-all hover:-translate-y-1">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-gradient-to-br from-purple-500 to-pink-500 rounded-lg flex items-center justify-center">
                    <MessageCircle className="w-5 h-5 text-white" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-900 dark:text-white">AI 사주 상담</h3>
                    <p className="text-xs text-gray-500 dark:text-gray-400">맞춤형 AI 상담사</p>
                  </div>
                </div>
                <ChevronRight className="w-5 h-5 text-gray-400 group-hover:text-purple-500 transition-colors" />
              </div>
            </div>
          </Link>

          <Link href="/saju/advanced" className="group">
            <div className="p-4 bg-gradient-to-br from-amber-50 to-orange-50 dark:from-amber-900/20 dark:to-orange-900/20 rounded-xl border border-amber-100 dark:border-amber-800/30 hover:shadow-lg transition-all hover:-translate-y-1">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-gradient-to-br from-amber-500 to-orange-500 rounded-lg flex items-center justify-center">
                    <BookOpen className="w-5 h-5 text-white" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-900 dark:text-white">정통 사주 심화</h3>
                    <p className="text-xs text-gray-500 dark:text-gray-400">십신/신살/12운성/합충</p>
                  </div>
                </div>
                <ChevronRight className="w-5 h-5 text-gray-400 group-hover:text-amber-500 transition-colors" />
              </div>
            </div>
          </Link>

          <Link href="/fortune/compatibility" className="group">
            <div className="p-4 bg-gradient-to-br from-rose-50 to-pink-50 dark:from-rose-900/20 dark:to-pink-900/20 rounded-xl border border-rose-100 dark:border-rose-800/30 hover:shadow-lg transition-all hover:-translate-y-1">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-gradient-to-br from-rose-500 to-pink-500 rounded-lg flex items-center justify-center">
                    <Heart className="w-5 h-5 text-white" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-900 dark:text-white">궁합 분석</h3>
                    <p className="text-xs text-gray-500 dark:text-gray-400">커플/비즈니스 궁합</p>
                  </div>
                </div>
                <ChevronRight className="w-5 h-5 text-gray-400 group-hover:text-rose-500 transition-colors" />
              </div>
            </div>
          </Link>
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
