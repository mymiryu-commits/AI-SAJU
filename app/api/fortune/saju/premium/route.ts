/**
 * 프리미엄 사주 분석 API
 * POST /api/fortune/saju/premium
 *
 * 포인트 차감 후 프리미엄 분석 제공
 * - premium: 500P
 * - deep: 1000P
 * - vip: 2000P
 */

import { NextRequest, NextResponse } from 'next/server';
import { createClient, createServiceClient } from '@/lib/supabase/server';
import {
  calculateSaju,
  analyzeOheng,
  analyzeFamilyImpact,
  analyzeCareerMatch,
  generateMonthlyActionPlan,
  generateLifeTimeline,
  generateTimingAnalysis,
  generateInterestStrategies
} from '@/lib/fortune/saju/newIndex';
import {
  generateStorytellingAnalysis,
  generateCardDeck,
  generatePastVerifications,
  generateYearlyTimeline
} from '@/lib/fortune/saju/cards';
import {
  generateSixtyJiaziAnalysis,
  generateMBTIIntegrationAnalysis,
  generateElementPoetryAnalysis,
  generateDestinyCardsAnalysis,
  generateAnalysisPrologue,
  generateAnalysisEpilogue,
} from '@/lib/fortune/saju/analysis/premiumAnalysisGenerator';
import {
  deductPoints,
  getPointBalance,
  PRODUCT_COSTS,
  type ProductType as PointProductType,
} from '@/lib/services/pointService';
import {
  integrateZodiacAnalysis,
} from '@/lib/services/analysisService';
import { generateAIAnalysis } from '@/lib/fortune/saju/ai/openaiAnalysis';
import { isAdminEmail } from '@/lib/auth/permissions';
import type { UserInput, PremiumContent, AIAnalysis } from '@/types/saju';
import type { StorytellingAnalysis } from '@/types/cards';
import type { ZodiacAnalysis } from '@/lib/fortune/zodiac/types';

// 상품 유형별 포인트 비용 매핑
const PRODUCT_TO_POINT_TYPE: Record<string, PointProductType> = {
  'basic': 'basic',
  'family': 'premium',
  'premium': 'premium',
  'deep': 'deep',
  'vip': 'vip',
};

export async function POST(request: NextRequest) {
  try {
    const { input, productType, analysisId, skipPayment } = await request.json() as {
      input: UserInput;
      productType: 'basic' | 'family' | 'premium' | 'deep' | 'vip';
      analysisId?: string;
      skipPayment?: boolean; // 이미 결제된 경우 (블라인드 해제 등)
    };

    // 인증 확인
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
      return NextResponse.json(
        { success: false, error: '로그인이 필요합니다.' },
        { status: 401 }
      );
    }

    // 관리자 체크 - 관리자는 결제 없이 프리미엄 기능 사용 가능
    const userIsAdmin = isAdminEmail(user.email || '');

    // 포인트 차감 (관리자 또는 이미 결제된 경우 제외)
    if (!userIsAdmin && !skipPayment && productType !== 'basic') {
      const pointProductType = PRODUCT_TO_POINT_TYPE[productType] || 'premium';
      const deductResult = await deductPoints(
        user.id,
        pointProductType,
        analysisId,
        `프리미엄 분석 (${productType})`
      );

      if (!deductResult.success) {
        const balance = await getPointBalance(user.id);
        return NextResponse.json({
          success: false,
          error: deductResult.error,
          errorCode: deductResult.errorCode,
          data: {
            currentPoints: balance?.points || 0,
            requiredPoints: PRODUCT_COSTS[pointProductType],
            shortfall: (PRODUCT_COSTS[pointProductType]) - (balance?.points || 0),
          }
        }, { status: 402 }); // Payment Required
      }
    }

    // 사주 계산
    const saju = calculateSaju(
      input.birthDate,
      input.birthTime,
      input.calendar === 'lunar'
    );

    // 오행 분석
    const ohengResult = analyzeOheng(saju);

    const currentYear = new Date().getFullYear();
    const targetYear = currentYear + 1; // 내년 분석

    // 기본 점수 계산
    const scores = {
      overall: 75,
      wealth: 70,
      love: 70,
      career: 75,
      health: 70
    };

    // AI 분석 생성 (프리미엄 전용 - 블라인드 해제된 전체 분석)
    let aiAnalysis: AIAnalysis | undefined;
    try {
      const aiResult = await generateAIAnalysis({
        user: input,
        saju,
        oheng: ohengResult.balance,
        yongsin: ohengResult.yongsin,
        gisin: ohengResult.gisin,
        scores,
        dayMasterStrength: ohengResult.dayMasterStrength
      });

      aiAnalysis = {
        personalityReading: aiResult.personalityReading,
        fortuneAdvice: aiResult.fortuneAdvice,
        lifePath: aiResult.lifePath,
        luckyElements: aiResult.luckyElements,
        warningAdvice: aiResult.warningAdvice,
        // 전문가 수준 분석 필드 (프리미엄 전용)
        dayMasterAnalysis: aiResult.dayMasterAnalysis,
        tenYearFortune: aiResult.tenYearFortune,
        yearlyFortune: aiResult.yearlyFortune,
        monthlyFortune: aiResult.monthlyFortune,
        relationshipAnalysis: aiResult.relationshipAnalysis,
        careerGuidance: aiResult.careerGuidance,
        wealthStrategy: aiResult.wealthStrategy,
        healthAdvice: aiResult.healthAdvice,
        spiritualGuidance: aiResult.spiritualGuidance,
        actionPlan: aiResult.actionPlan
      };
    } catch (aiError) {
      console.warn('AI 분석 생성 실패:', aiError);
    }

    // 프리미엄 컨텐츠 생성
    const premiumContent: PremiumContent = {};

    // 상품 유형에 따른 분석 범위
    if (['family', 'premium', 'vip'].includes(productType)) {
      // 가족 영향 분석
      premiumContent.familyImpact = analyzeFamilyImpact(
        input,
        saju,
        targetYear
      ) || undefined;
    }

    if (['basic', 'premium', 'vip'].includes(productType)) {
      // 직업 매칭 분석
      premiumContent.careerAnalysis = analyzeCareerMatch(
        input,
        saju,
        ohengResult.balance
      ) || undefined;

      // 관심사 전략
      if (input.interests && input.interests.length > 0) {
        premiumContent.interestStrategies = generateInterestStrategies(
          input.interests,
          saju,
          ohengResult.balance,
          ohengResult.yongsin
        );
      }

      // 월별 액션플랜
      premiumContent.monthlyActionPlan = generateMonthlyActionPlan(
        saju,
        ohengResult.balance,
        targetYear,
        ohengResult.yongsin
      );
    }

    if (['premium', 'vip'].includes(productType)) {
      // 인생 타임라인
      premiumContent.lifeTimeline = generateLifeTimeline(input, saju);

      // 타이밍 분석
      premiumContent.timingAnalysis = generateTimingAnalysis(
        saju,
        input.currentConcern
      );
    }

    // 스토리텔링 분석 (모든 프리미엄 상품에 포함)
    // 주요 십신 결정 (간단하게 일간 기준)
    const dominantSipsin = getDominantSipsin(saju);

    const storytelling = generateStorytellingAnalysis(
      input,
      saju,
      ohengResult.balance,
      ohengResult.yongsin,
      ohengResult.gisin,
      dominantSipsin,
      targetYear
    );

    premiumContent.storytelling = storytelling;

    // ===== v2.0 새 기능 추가 =====

    // 60갑자 분석
    const sixtyJiazi = generateSixtyJiaziAnalysis(input, saju);
    if (sixtyJiazi) {
      premiumContent.sixtyJiazi = sixtyJiazi;
    }

    // MBTI-사주 통합 분석 (MBTI 입력된 경우)
    if (input.mbti) {
      const mbtiIntegration = generateMBTIIntegrationAnalysis(input, saju, ohengResult.yongsin);
      if (mbtiIntegration) {
        premiumContent.mbtiIntegration = mbtiIntegration;
      }
    }

    // 오행 관계 시적 해석
    const elementPoetry = generateElementPoetryAnalysis(
      saju,
      ohengResult.balance,
      ohengResult.yongsin,
      ohengResult.gisin
    );
    premiumContent.elementPoetry = elementPoetry;

    // 6장 운명 카드 (강화 버전)
    const destinyCards = generateDestinyCardsAnalysis(
      input,
      saju,
      ohengResult.balance,
      ohengResult.yongsin,
      dominantSipsin,
      targetYear
    );
    premiumContent.destinyCards = destinyCards;

    // 프롤로그/에필로그 생성
    premiumContent.prologue = generateAnalysisPrologue(input, saju, sixtyJiazi, ohengResult.yongsin);
    premiumContent.epilogue = generateAnalysisEpilogue(input, saju, sixtyJiazi, ohengResult.yongsin, targetYear);

    // 별자리 분석 통합
    let zodiacAnalysis: ZodiacAnalysis | null = null;
    try {
      zodiacAnalysis = integrateZodiacAnalysis(input.birthDate);
    } catch (error) {
      console.warn('별자리 분석 통합 실패:', error);
    }

    // 45일 후 만료일 계산
    const expiresAt = new Date();
    expiresAt.setDate(expiresAt.getDate() + 45);

    // 분석 결과 저장 (기존 분석 업데이트 또는 새로 생성)
    const analysisRecord = {
      user_id: user.id,
      type: 'saju',
      subtype: productType,
      input_data: input,
      result_summary: {
        saju: {
          year: `${saju.year.heavenlyStem}${saju.year.earthlyBranch}`,
          month: `${saju.month.heavenlyStem}${saju.month.earthlyBranch}`,
          day: `${saju.day.heavenlyStem}${saju.day.earthlyBranch}`,
          time: saju.time ? `${saju.time.heavenlyStem}${saju.time.earthlyBranch}` : null
        },
        productType,
        targetYear,
        zodiac: zodiacAnalysis?.sign || null
      },
      result_full: {
        saju,
        oheng: ohengResult,
        premium: premiumContent,
        zodiac: zodiacAnalysis
      },
      keywords: [
        saju.day.element,
        productType,
        ...ohengResult.yongsin,
        zodiacAnalysis?.sign || 'unknown',
        input.currentConcern || 'none'
      ],
      scores: {
        overall: premiumContent.monthlyActionPlan?.[0]?.score || 70,
        love: zodiacAnalysis?.dailyFortune?.love || 70,
        career: zodiacAnalysis?.dailyFortune?.career || 70,
        money: zodiacAnalysis?.dailyFortune?.money || 70,
        health: zodiacAnalysis?.dailyFortune?.health || 70
      },
      is_premium: true,
      is_blinded: false,
      zodiac_included: !!zodiacAnalysis,
      zodiac_data: zodiacAnalysis,
      expires_at: expiresAt.toISOString()  // 45일 보관 기한
    };

    let savedAnalysisId = analysisId;

    // Service client 사용 (RLS 우회, 인증 확인 완료 후)
    const serviceClient = createServiceClient();

    if (analysisId) {
      // 기존 분석 업데이트 (프리미엄으로 업그레이드)
      const { error } = await (serviceClient as any)
        .from('fortune_analyses')
        .update({
          subtype: productType,
          result_full: analysisRecord.result_full,
          scores: analysisRecord.scores,
          is_premium: true,
          is_blinded: false,
          zodiac_included: analysisRecord.zodiac_included,
          zodiac_data: analysisRecord.zodiac_data,
          expires_at: expiresAt.toISOString()  // 45일 보관 기한 갱신
        })
        .eq('id', analysisId)
        .eq('user_id', user.id);

      if (error) {
        console.error('분석 업데이트 실패:', error);
      }
    } else {
      // 새 분석 생성
      const { data, error } = await (serviceClient as any)
        .from('fortune_analyses')
        .insert(analysisRecord)
        .select('id')
        .single();

      if (error) {
        console.error('[Premium] 분석 저장 실패:', error);
      } else if (data) {
        savedAnalysisId = data.id;
        console.log('[Premium] 분석 저장 성공:', savedAnalysisId);
      }
    }

    // 현재 포인트 잔액 조회
    const currentBalance = await getPointBalance(user.id);

    return NextResponse.json({
      success: true,
      data: {
        premium: premiumContent,
        aiAnalysis,  // 블라인드 해제된 AI 분석
        saju,
        oheng: ohengResult.balance,
        yongsin: ohengResult.yongsin,
        gisin: ohengResult.gisin,
        zodiac: zodiacAnalysis
      },
      meta: {
        analysisId: savedAnalysisId,
        productType,
        targetYear,
        expiresAt: expiresAt.toISOString(),
        timestamp: new Date().toISOString()
      },
      pointBalance: {
        current: currentBalance?.points || 0,
        isPremium: currentBalance?.isPremium || false
      }
    });

  } catch (error) {
    console.error('Premium analysis error:', error);
    return NextResponse.json(
      { success: false, error: '프리미엄 분석 중 오류가 발생했습니다.' },
      { status: 500 }
    );
  }
}

// 주요 십신 결정 헬퍼 함수
function getDominantSipsin(saju: { day: { heavenlyStem: string }; month: { heavenlyStem: string } }): string {
  // 일간과 월간의 관계로 주요 십신 판단
  const dayStem = saju.day.heavenlyStem;
  const monthStem = saju.month.heavenlyStem;

  // 천간 오행 매핑
  const stemElement: Record<string, string> = {
    '甲': '목', '乙': '목',
    '丙': '화', '丁': '화',
    '戊': '토', '己': '토',
    '庚': '금', '辛': '금',
    '壬': '수', '癸': '수'
  };

  const dayElement = stemElement[dayStem] || '목';
  const monthElement = stemElement[monthStem] || '화';

  // 상생/상극 관계로 십신 판단 (간략화)
  const generating: Record<string, string> = {
    '목': '화', '화': '토', '토': '금', '금': '수', '수': '목'
  };
  const controlling: Record<string, string> = {
    '목': '토', '화': '금', '토': '수', '금': '목', '수': '화'
  };

  if (dayElement === monthElement) {
    return '비견';
  } else if (generating[dayElement] === monthElement) {
    return '식신';
  } else if (generating[monthElement] === dayElement) {
    return '정인';
  } else if (controlling[dayElement] === monthElement) {
    return '편재';
  } else if (controlling[monthElement] === dayElement) {
    return '편관';
  }

  return '식신'; // 기본값
}
