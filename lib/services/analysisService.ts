/**
 * 분석 서비스
 * - 무료 분석 블라인드 처리
 * - 분석 결과 저장 (45일 유지)
 * - 별자리 분석 통합
 */

import { createClient } from '@/lib/supabase/server';
import { analyzeZodiac } from '@/lib/fortune/zodiac/calculator';
import type { ZodiacAnalysis } from '@/lib/fortune/zodiac/types';
import type { AnalysisResult, PremiumContent, Element } from '@/types/saju';

// 블라인드 처리된 텍스트
const BLINDED_TEXT = '🔒 프리미엄 분석에서 확인하세요';
const BLINDED_ARRAY = ['🔒 프리미엄 전용 콘텐츠'];

/**
 * 무료 분석 결과 블라인드 처리
 * 프리미엄 콘텐츠는 일부만 보여주고 나머지는 블러 처리
 */
export function blindFreeAnalysis(result: AnalysisResult): AnalysisResult {
  const blinded = { ...result };

  // AI 분석 일부 블라인드
  if (blinded.aiAnalysis) {
    const original = blinded.aiAnalysis;
    blinded.aiAnalysis = {
      ...original,
      // 무료로 제공
      personalityReading: original.personalityReading,
      // 일부만 보여주기 (첫 문장만)
      fortuneAdvice: {
        overall: original.fortuneAdvice?.overall
          ? original.fortuneAdvice.overall.split('.')[0] + '. ' + BLINDED_TEXT
          : BLINDED_TEXT,
        wealth: BLINDED_TEXT,
        love: BLINDED_TEXT,
        career: BLINDED_TEXT,
        health: BLINDED_TEXT,
      },
      lifePath: BLINDED_TEXT,
      warningAdvice: original.warningAdvice
        ? original.warningAdvice.split('.')[0] + '. ' + BLINDED_TEXT
        : BLINDED_TEXT,
      // 프리미엄 전용
      dayMasterAnalysis: BLINDED_TEXT,
      tenYearFortune: BLINDED_TEXT,
      yearlyFortune: BLINDED_TEXT,
      monthlyFortune: BLINDED_TEXT,
      relationshipAnalysis: BLINDED_TEXT,
      careerGuidance: BLINDED_TEXT,
      wealthStrategy: BLINDED_TEXT,
      healthAdvice: BLINDED_TEXT,
      spiritualGuidance: BLINDED_TEXT,
      actionPlan: BLINDED_ARRAY,
    };
  }

  // 페어 비교는 무료 제공
  // coreMessage는 무료 제공 (전환용)

  return blinded;
}

/**
 * 프리미엄 콘텐츠 블라인드 처리
 */
export function blindPremiumContent(premium: PremiumContent): PremiumContent {
  return {
    ...premium,
    // 가족 영향 분석 - 요약만 제공
    familyImpact: premium.familyImpact ? {
      ...premium.familyImpact,
      recommendations: BLINDED_ARRAY,
      warnings: BLINDED_ARRAY,
    } : undefined,
    // 커리어 분석 - 점수만 제공
    careerAnalysis: premium.careerAnalysis ? {
      ...premium.careerAnalysis,
      synergy: BLINDED_ARRAY,
      weakPoints: BLINDED_ARRAY,
      solutions: BLINDED_ARRAY,
      optimalDirection: BLINDED_TEXT,
      pivotTiming: BLINDED_TEXT,
    } : undefined,
    // 월별 플랜 - 처음 2개월만 제공
    monthlyActionPlan: premium.monthlyActionPlan?.slice(0, 2).concat(
      Array(10).fill({
        monthName: '🔒',
        score: 0,
        mustDo: [{ category: '프리미엄', action: BLINDED_TEXT }],
        mustAvoid: [BLINDED_TEXT],
        luckyElements: { color: '🔒', number: 0, direction: '🔒' },
      })
    ),
    // 인생 타임라인 - 블라인드
    lifeTimeline: premium.lifeTimeline ? {
      ...premium.lifeTimeline,
      phases: premium.lifeTimeline.phases?.slice(0, 1).concat([
        { ageRange: '🔒', phase: BLINDED_TEXT, score: 0, opportunities: BLINDED_ARRAY, challenges: BLINDED_ARRAY },
      ]),
      turningPoints: [{ year: 0, age: 0, event: BLINDED_TEXT, importance: 'normal' }],
      goldenWindows: [{ period: '🔒', purpose: BLINDED_TEXT, successRate: 0 }],
    } : undefined,
    // 타이밍 분석 - 블라인드
    timingAnalysis: undefined,
    // 관심사 전략 - 첫번째만
    interestStrategies: premium.interestStrategies?.slice(0, 1).concat([
      {
        interest: 'health' as const,
        sajuAlignment: 0,
        timing: BLINDED_TEXT,
        doList: BLINDED_ARRAY,
        dontList: BLINDED_ARRAY,
        specificAdvice: BLINDED_TEXT,
        priority: 99,
      },
    ]),
    // 스토리텔링 - 핵심만 제공
    storytelling: premium.storytelling ? {
      ...premium.storytelling,
      // 과거 검증 1개만 제공
      pastVerifications: premium.storytelling.pastVerifications?.slice(0, 1).concat([
        { period: '🔒', prediction: BLINDED_TEXT, keywords: BLINDED_ARRAY, confidence: 0, category: 'career' as const },
      ]),
      // 타임라인 일부만
      yearlyTimeline: {
        ...premium.storytelling.yearlyTimeline,
        periods: premium.storytelling.yearlyTimeline?.periods?.slice(0, 2).concat([
          { months: '🔒', phase: 'preparation' as const, phaseKorean: '🔒', score: 0, description: BLINDED_TEXT, actions: BLINDED_ARRAY },
        ]),
      },
      // 풀스토리 1막만
      fullStory: {
        opening: premium.storytelling.fullStory?.opening || BLINDED_TEXT,
        development: BLINDED_TEXT,
        climax: BLINDED_TEXT,
        resolution: BLINDED_TEXT,
      },
    } : undefined,
  };
}

/**
 * 별자리 분석 통합
 */
export function integrateZodiacAnalysis(birthDate: string): ZodiacAnalysis | null {
  try {
    const zodiac = analyzeZodiac(birthDate);
    return zodiac;
  } catch (error) {
    console.warn('별자리 분석 실패:', error);
    return null;
  }
}

/**
 * 분석 결과 저장 (45일 유지)
 */
export async function saveAnalysisResult(
  userId: string,
  result: AnalysisResult,
  options: {
    isPremium: boolean;
    isBlinded: boolean;
    productType: string;
    pointsPaid?: number;
    zodiacData?: ZodiacAnalysis | null;
    pdfUrl?: string;
    audioUrl?: string;
  }
): Promise<{ id: string | null; error?: string }> {
  try {
    const supabase = await createClient();

    // 인증 상태 확인
    const { data: { user }, error: authError } = await supabase.auth.getUser();
    if (authError || !user) {
      console.error('분석 저장 실패: 인증 오류', authError);
      return { id: null, error: '인증되지 않은 사용자' };
    }

    // userId가 현재 인증된 사용자와 일치하는지 확인
    if (user.id !== userId) {
      console.error('분석 저장 실패: 사용자 ID 불일치', { expected: userId, actual: user.id });
      return { id: null, error: '사용자 ID 불일치' };
    }

    const { saju, oheng, scores, yongsin, gisin, personality, peerComparison } = result;

    // result_summary에 모든 메타 정보 포함 (DB 스키마에 맞게)
    const resultSummary = {
      saju: {
        year: `${saju.year.heavenlyStem}${saju.year.earthlyBranch}`,
        month: `${saju.month.heavenlyStem}${saju.month.earthlyBranch}`,
        day: `${saju.day.heavenlyStem}${saju.day.earthlyBranch}`,
        time: saju.time ? `${saju.time.heavenlyStem}${saju.time.earthlyBranch}` : null,
      },
      scores,
      zodiac: saju.year.zodiac,
      dayMaster: saju.day.heavenlyStem,
      yongsin,
      gisin,
      // 프리미엄/블라인드 상태를 result_summary에 저장
      isPremium: options.isPremium,
      isBlinded: options.isBlinded,
      unblindPrice: options.isBlinded ? 500 : null,
      zodiacIncluded: !!options.zodiacData,
      zodiacData: options.zodiacData,
    };

    // 30일 보관 (대시보드 표시 기간)
    const expiresAt = new Date();
    expiresAt.setDate(expiresAt.getDate() + 30);

    // DB 스키마에 맞는 insert 데이터
    const insertData: Record<string, unknown> = {
      user_id: userId,
      type: 'saju',
      subtype: options.productType,
      input_data: result.user,
      result_summary: resultSummary,
      result_full: result,
      keywords: [
        saju.day.element,
        saju.year.zodiac,
        ...(yongsin || []),
        result.user.currentConcern || 'none',
      ],
      scores,
      pdf_url: options.pdfUrl || null,
      audio_url: options.audioUrl || null,
      price_paid: options.pointsPaid || 0,
      // 추가 컬럼 (005 마이그레이션)
      is_premium: options.isPremium,
      is_blinded: options.isBlinded,
      unblind_price: options.isBlinded ? 500 : null,
      expires_at: expiresAt.toISOString(),
      zodiac_included: !!options.zodiacData,
      zodiac_data: options.zodiacData || null,
    };

    console.log('분석 저장 시도:', { userId, productType: options.productType, isPremium: options.isPremium });

    const { data, error } = await (supabase as any)
      .from('fortune_analyses')
      .insert(insertData)
      .select('id')
      .single();

    if (error) {
      console.error('분석 결과 저장 실패:', {
        message: error.message,
        details: error.details,
        hint: error.hint,
        code: error.code,
      });
      return { id: null, error: error.message };
    }

    console.log('분석 저장 성공:', data.id);
    return { id: data.id };
  } catch (err) {
    console.error('분석 저장 예외:', err);
    return { id: null, error: err instanceof Error ? err.message : '알 수 없는 오류' };
  }
}

/**
 * 저장된 분석 결과 조회
 */
export async function getAnalysisById(
  analysisId: string,
  userId: string
): Promise<{
  analysis: any | null;
  canAccess: boolean;
  isBlinded: boolean;
  unblindPrice?: number;
}> {
  const supabase = await createClient();

  const { data, error } = await (supabase as any)
    .from('fortune_analyses')
    .select('*')
    .eq('id', analysisId)
    .eq('user_id', userId)
    .single();

  if (error || !data) {
    return { analysis: null, canAccess: false, isBlinded: false };
  }

  // result_summary에서 블라인드 정보 추출
  const resultSummary = data.result_summary || {};
  const isBlinded = resultSummary.isBlinded || false;
  const unblindPrice = resultSummary.unblindPrice || 500;

  // 45일 만료 체크
  const createdAt = new Date(data.created_at);
  const expiresAt = new Date(createdAt);
  expiresAt.setDate(expiresAt.getDate() + 45);

  if (new Date() > expiresAt) {
    // 만료됨 - PDF/음성 URL 제거
    return {
      analysis: { ...data, pdf_url: null, audio_url: null },
      canAccess: true,
      isBlinded,
      unblindPrice,
    };
  }

  return {
    analysis: data,
    canAccess: true,
    isBlinded,
    unblindPrice,
  };
}

/**
 * 사용자의 분석 히스토리 조회
 */
export async function getUserAnalysisHistory(
  userId: string,
  options: {
    limit?: number;
    offset?: number;
    type?: string;
    onlyPremium?: boolean;
  } = {}
): Promise<{
  analyses: any[];
  total: number;
  hasMore: boolean;
}> {
  const supabase = await createClient();
  const { limit = 10, offset = 0, type, onlyPremium } = options;

  let query = (supabase as any)
    .from('fortune_analyses')
    .select('id, type, subtype, input_data, result_summary, scores, price_paid, pdf_url, audio_url, created_at', { count: 'exact' })
    .eq('user_id', userId)
    .order('created_at', { ascending: false })
    .range(offset, offset + limit - 1);

  if (type) {
    query = query.eq('type', type);
  }

  // onlyPremium 필터: price_paid > 0 체크
  if (onlyPremium) {
    query = query.gt('price_paid', 0);
  }

  const { data, count, error } = await query;

  if (error) {
    console.error('히스토리 조회 실패:', error);
    return { analyses: [], total: 0, hasMore: false };
  }

  return {
    analyses: data || [],
    total: count || 0,
    hasMore: (count || 0) > offset + limit,
  };
}

/**
 * 블라인드 해제 (포인트 차감)
 */
export async function unblindAnalysis(
  userId: string,
  analysisId: string
): Promise<{ success: boolean; error?: string }> {
  const supabase = await createClient();

  // 분석 정보 조회
  const { analysis, isBlinded, unblindPrice } = await getAnalysisById(analysisId, userId);

  if (!analysis) {
    return { success: false, error: '분석을 찾을 수 없습니다' };
  }

  if (!isBlinded) {
    return { success: true }; // 이미 해제됨
  }

  // 포인트 차감
  const { deductPoints } = await import('./pointService');
  const deductResult = await deductPoints(userId, 'premium', analysisId, '블라인드 해제');

  if (!deductResult.success) {
    return { success: false, error: deductResult.error };
  }

  // 블라인드 해제 - result_summary 업데이트
  const currentSummary = analysis.result_summary || {};
  const updatedSummary = {
    ...currentSummary,
    isBlinded: false,
    isPremium: true,
  };

  const { error } = await (supabase as any)
    .from('fortune_analyses')
    .update({
      result_summary: updatedSummary,
    })
    .eq('id', analysisId);

  if (error) {
    return { success: false, error: '블라인드 해제 실패' };
  }

  return { success: true };
}

export default {
  blindFreeAnalysis,
  blindPremiumContent,
  integrateZodiacAnalysis,
  saveAnalysisResult,
  getAnalysisById,
  getUserAnalysisHistory,
  unblindAnalysis,
};
