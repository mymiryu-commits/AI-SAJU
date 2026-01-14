/**
 * 프리미엄 사주 분석 API
 * POST /api/fortune/saju/premium
 */

import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';
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
import type { UserInput, PremiumContent } from '@/types/saju';

export async function POST(request: NextRequest) {
  try {
    const { input, productType, analysisId } = await request.json() as {
      input: UserInput;
      productType: 'basic' | 'family' | 'premium' | 'vip';
      analysisId?: string;
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

    // 결제 확인 (실제로는 결제 상태 체크)
    // TODO: 결제 시스템 연동 시 구현

    // 사주 계산
    const saju = calculateSaju(
      input.birthDate,
      input.birthTime,
      input.calendar === 'lunar'
    );

    // 오행 분석
    const ohengResult = analyzeOheng(saju);

    // 프리미엄 컨텐츠 생성
    const premiumContent: PremiumContent = {};
    const currentYear = new Date().getFullYear();
    const targetYear = currentYear + 1; // 내년 분석

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
        targetYear
      },
      result_full: {
        saju,
        oheng: ohengResult,
        premium: premiumContent
      },
      keywords: [
        saju.day.element,
        productType,
        ...ohengResult.yongsin,
        input.currentConcern || 'none'
      ]
    };

    let savedAnalysisId = analysisId;

    if (analysisId) {
      // 기존 분석 업데이트
      const { error } = await supabase
        .from('fortune_analyses')
        .update({
          subtype: productType,
          result_full: analysisRecord.result_full
        })
        .eq('id', analysisId)
        .eq('user_id', user.id);

      if (error) {
        console.error('분석 업데이트 실패:', error);
      }
    } else {
      // 새 분석 생성
      const { data, error } = await supabase
        .from('fortune_analyses')
        .insert(analysisRecord)
        .select('id')
        .single();

      if (!error && data) {
        savedAnalysisId = data.id;
      }
    }

    return NextResponse.json({
      success: true,
      data: {
        premium: premiumContent,
        saju,
        oheng: ohengResult.balance,
        yongsin: ohengResult.yongsin,
        gisin: ohengResult.gisin
      },
      meta: {
        analysisId: savedAnalysisId,
        productType,
        targetYear,
        timestamp: new Date().toISOString()
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
