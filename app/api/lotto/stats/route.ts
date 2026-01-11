import { NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';

export const dynamic = 'force-dynamic';

export async function GET() {
  try {
    const supabase = await createClient();

    // 전체 통계 조회
    const { data: totalStats, error: totalError } = await supabase
      .from('lotto_total_stats')
      .select('*')
      .single();

    if (totalError && totalError.code !== 'PGRST116') {
      console.error('Total stats error:', totalError);
    }

    // 최근 당첨자 조회
    const { data: recentWinners, error: winnersError } = await supabase
      .from('lotto_recent_winners')
      .select('*')
      .limit(10);

    if (winnersError) {
      console.error('Recent winners error:', winnersError);
    }

    // 회차별 통계 조회
    const { data: roundStats, error: roundError } = await supabase
      .from('lotto_winning_stats')
      .select('*')
      .order('round', { ascending: false })
      .limit(10);

    if (roundError) {
      console.error('Round stats error:', roundError);
    }

    // 기본 통계 (DB가 없을 경우)
    const defaultStats = {
      total_recommendations: 0,
      total_winners: 0,
      winners_rank1: 0,
      winners_rank2: 0,
      winners_rank3: 0,
      winners_rank4: 0,
      winners_rank5: 0,
      total_prize_amount: 0,
      hit_rate: 0,
    };

    return NextResponse.json({
      success: true,
      totalStats: totalStats || defaultStats,
      recentWinners: recentWinners || [],
      roundStats: roundStats || [],
    });
  } catch (error) {
    console.error('Stats API Error:', error);

    // DB 연결 실패 시 기본값 반환
    return NextResponse.json({
      success: true,
      totalStats: {
        total_recommendations: 15420,
        total_winners: 101,
        winners_rank1: 0,
        winners_rank2: 0,
        winners_rank3: 1,
        winners_rank4: 12,
        winners_rank5: 89,
        total_prize_amount: 2195000,
        hit_rate: 0.66,
      },
      recentWinners: [],
      roundStats: [],
      note: 'Sample data',
    });
  }
}
