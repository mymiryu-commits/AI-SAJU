/**
 * 궁합 분석 API
 */

import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import {
  analyzeCoupleCompatibility,
  analyzeBusinessCompatibility,
  type PersonInfo,
  type BusinessPerson
} from '@/lib/fortune/compatibility';
import type { SajuChart } from '@/types/saju';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { type, person1, person2 } = body;

    if (!type || !person1 || !person2) {
      return NextResponse.json(
        { error: '필수 정보가 누락되었습니다.' },
        { status: 400 }
      );
    }

    // 사주 차트 유효성 검사
    if (!person1.sajuChart || !person2.sajuChart) {
      return NextResponse.json(
        { error: '사주 차트 정보가 필요합니다.' },
        { status: 400 }
      );
    }

    let result;

    switch (type) {
      case 'couple':
        result = analyzeCoupleCompatibility(
          person1 as PersonInfo,
          person2 as PersonInfo
        );
        break;

      case 'business':
        result = analyzeBusinessCompatibility(
          person1 as BusinessPerson,
          person2 as BusinessPerson
        );
        break;

      default:
        return NextResponse.json(
          { error: '유효하지 않은 궁합 유형입니다.' },
          { status: 400 }
        );
    }

    return NextResponse.json({
      type,
      result,
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    console.error('Compatibility analysis error:', error);
    return NextResponse.json(
      { error: '궁합 분석 중 오류가 발생했습니다.' },
      { status: 500 }
    );
  }
}

// 저장된 사주로 궁합 분석 (GET)
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

    const { searchParams } = new URL(request.url);
    const partnerId = searchParams.get('partnerId');
    const type = searchParams.get('type') || 'couple';

    if (!partnerId) {
      return NextResponse.json(
        { error: '파트너 ID가 필요합니다.' },
        { status: 400 }
      );
    }

    // 사용자 사주 조회
    const { data: userSaju, error: userError } = await supabase
      .from('saju_results')
      .select('saju_chart')
      .eq('user_id', user.id)
      .order('created_at', { ascending: false })
      .limit(1)
      .single() as { data: { saju_chart: SajuChart } | null; error: any };

    if (userError || !userSaju?.saju_chart) {
      return NextResponse.json(
        { error: '내 사주 분석 결과가 없습니다.' },
        { status: 404 }
      );
    }

    // 파트너 사주 조회
    const { data: partnerSaju, error: partnerError } = await supabase
      .from('saju_results')
      .select('saju_chart')
      .eq('user_id', partnerId)
      .order('created_at', { ascending: false })
      .limit(1)
      .single() as { data: { saju_chart: SajuChart } | null; error: any };

    if (partnerError || !partnerSaju?.saju_chart) {
      return NextResponse.json(
        { error: '파트너의 사주 분석 결과가 없습니다.' },
        { status: 404 }
      );
    }

    // 궁합 분석
    const person1: PersonInfo = {
      gender: 'male', // 기본값, 실제로는 프로필에서 가져와야 함
      sajuChart: userSaju.saju_chart
    };

    const person2: PersonInfo = {
      gender: 'female',
      sajuChart: partnerSaju.saju_chart
    };

    let result;
    if (type === 'business') {
      result = analyzeBusinessCompatibility(
        { sajuChart: userSaju.saju_chart },
        { sajuChart: partnerSaju.saju_chart }
      );
    } else {
      result = analyzeCoupleCompatibility(person1, person2);
    }

    return NextResponse.json({
      type,
      result,
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    console.error('Compatibility analysis error:', error);
    return NextResponse.json(
      { error: '궁합 분석 중 오류가 발생했습니다.' },
      { status: 500 }
    );
  }
}
