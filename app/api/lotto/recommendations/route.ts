import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import { getCurrentRound } from '@/lib/lotto/data';
import type { Json } from '@/types/database';

// 추천번호 저장
export async function POST(request: NextRequest) {
  try {
    const supabase = await createClient();

    // 인증 확인
    const {
      data: { user },
      error: authError,
    } = await supabase.auth.getUser();

    if (authError || !user) {
      return NextResponse.json(
        { error: '로그인이 필요합니다.' },
        { status: 401 }
      );
    }

    const body = await request.json();
    const { numbers, filters, qualityScore } = body as {
      numbers: number[][];
      filters?: Json;
      qualityScore?: number;
    };

    if (!numbers || !Array.isArray(numbers) || numbers.length === 0) {
      return NextResponse.json(
        { error: '번호가 필요합니다.' },
        { status: 400 }
      );
    }

    // 다음 회차 계산
    const nextRound = getCurrentRound() + 1;

    // 번호 저장
    const recommendations = numbers.map((nums) => ({
      user_id: user.id,
      round: nextRound,
      numbers: nums,
      filters: filters ?? undefined,
      quality_score: qualityScore ?? undefined,
    }));

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const { data, error } = await (supabase as any)
      .from('lotto_recommendations')
      .insert(recommendations)
      .select();

    if (error) {
      console.error('Save recommendation error:', error);
      return NextResponse.json(
        { error: '저장 중 오류가 발생했습니다.' },
        { status: 500 }
      );
    }

    return NextResponse.json({
      success: true,
      count: data.length,
      round: nextRound,
      message: `${data.length}개의 번호가 ${nextRound}회차에 저장되었습니다.`,
    });
  } catch (error) {
    console.error('Recommendations API Error:', error);
    return NextResponse.json(
      { error: '서버 오류가 발생했습니다.' },
      { status: 500 }
    );
  }
}

// 내 추천번호 조회
export async function GET(request: NextRequest) {
  try {
    const supabase = await createClient();

    // 인증 확인
    const {
      data: { user },
      error: authError,
    } = await supabase.auth.getUser();

    if (authError || !user) {
      return NextResponse.json(
        { error: '로그인이 필요합니다.' },
        { status: 401 }
      );
    }

    const searchParams = request.nextUrl.searchParams;
    const round = searchParams.get('round');
    const limit = parseInt(searchParams.get('limit') || '50');
    const onlyWinners = searchParams.get('winners') === 'true';

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    let query = (supabase as any)
      .from('lotto_recommendations')
      .select('*')
      .eq('user_id', user.id)
      .order('created_at', { ascending: false })
      .limit(limit);

    if (round) {
      query = query.eq('round', parseInt(round));
    }

    if (onlyWinners) {
      query = query.not('prize_rank', 'is', null);
    }

    const { data, error } = await query;

    if (error) {
      console.error('Get recommendations error:', error);
      return NextResponse.json(
        { error: '조회 중 오류가 발생했습니다.' },
        { status: 500 }
      );
    }

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const records = data as any[];

    // 통계 계산
    const stats = {
      total: records.length,
      checked: records.filter((r) => r.is_checked).length,
      winners: records.filter((r) => r.prize_rank).length,
      totalPrize: records.reduce((sum, r) => sum + (r.prize_amount || 0), 0),
    };

    return NextResponse.json({
      success: true,
      recommendations: data,
      stats,
    });
  } catch (error) {
    console.error('Recommendations GET Error:', error);
    return NextResponse.json(
      { error: '서버 오류가 발생했습니다.' },
      { status: 500 }
    );
  }
}
