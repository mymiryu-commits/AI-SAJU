/**
 * 정통 사주 분석 API
 * 십신, 신살, 12운성, 합충형파해 분석
 */

import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import {
  analyzeSipsin,
  interpretSipsinChart,
  analyzeSinsal,
  analyzeUnsung,
  analyzeHapChung
} from '@/lib/fortune/saju/analysis';
import type { SajuChart } from '@/types/saju';

interface AdvancedAnalysisResult {
  sipsin: {
    chart: ReturnType<typeof analyzeSipsin>;
    interpretation: ReturnType<typeof interpretSipsinChart>;
  };
  sinsal: ReturnType<typeof analyzeSinsal>;
  unsung: ReturnType<typeof analyzeUnsung>;
  hapchung: ReturnType<typeof analyzeHapChung>;
  timestamp: string;
}

export async function GET(request: NextRequest) {
  try {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
      return NextResponse.json(
        { error: '로그인이 필요합니다.' },
        { status: 401 }
      );
    }

    // 저장된 사주 차트 조회
    const { data: sajuResult, error } = await supabase
      .from('saju_results')
      .select('saju_chart')
      .eq('user_id', user.id)
      .order('created_at', { ascending: false })
      .limit(1)
      .single() as { data: { saju_chart: SajuChart } | null; error: any };

    if (error || !sajuResult?.saju_chart) {
      return NextResponse.json(
        { error: '사주 분석 결과를 찾을 수 없습니다. 먼저 사주 분석을 진행해주세요.' },
        { status: 404 }
      );
    }

    const sajuChart = sajuResult.saju_chart;

    // 정통 사주 분석 실행
    const sipsinChart = analyzeSipsin(sajuChart);
    const sipsinInterpretation = interpretSipsinChart(sipsinChart);
    const sinsalAnalysis = analyzeSinsal(sajuChart);
    const unsungAnalysis = analyzeUnsung(sajuChart);
    const hapchungAnalysis = analyzeHapChung(sajuChart);

    const result: AdvancedAnalysisResult = {
      sipsin: {
        chart: sipsinChart,
        interpretation: sipsinInterpretation
      },
      sinsal: sinsalAnalysis,
      unsung: unsungAnalysis,
      hapchung: hapchungAnalysis,
      timestamp: new Date().toISOString()
    };

    return NextResponse.json(result);
  } catch (error) {
    console.error('Advanced saju analysis error:', error);
    return NextResponse.json(
      { error: '정통 사주 분석 중 오류가 발생했습니다.' },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    // 사주 차트를 직접 전달받아 분석
    const body = await request.json();
    const sajuChart: SajuChart = body.sajuChart;

    if (!sajuChart) {
      return NextResponse.json(
        { error: '사주 차트 정보가 필요합니다.' },
        { status: 400 }
      );
    }

    // 정통 사주 분석 실행
    const sipsinChart = analyzeSipsin(sajuChart);
    const sipsinInterpretation = interpretSipsinChart(sipsinChart);
    const sinsalAnalysis = analyzeSinsal(sajuChart);
    const unsungAnalysis = analyzeUnsung(sajuChart);
    const hapchungAnalysis = analyzeHapChung(sajuChart);

    const result: AdvancedAnalysisResult = {
      sipsin: {
        chart: sipsinChart,
        interpretation: sipsinInterpretation
      },
      sinsal: sinsalAnalysis,
      unsung: unsungAnalysis,
      hapchung: hapchungAnalysis,
      timestamp: new Date().toISOString()
    };

    return NextResponse.json(result);
  } catch (error) {
    console.error('Advanced saju analysis error:', error);
    return NextResponse.json(
      { error: '정통 사주 분석 중 오류가 발생했습니다.' },
      { status: 500 }
    );
  }
}
