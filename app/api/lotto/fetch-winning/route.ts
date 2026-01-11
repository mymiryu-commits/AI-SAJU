import { NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';
import { fetchRoundResult, getCurrentRound } from '@/lib/lotto/data';

// Vercel Cron Job용 엔드포인트
// vercel.json에서 schedule: "0 10 * * 6" (매주 토요일 10시 KST = 01:00 UTC)
export const dynamic = 'force-dynamic';

// 서비스 역할 클라이언트 (서버사이드 전용)
function getServiceClient() {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

  if (!supabaseUrl || !supabaseServiceKey) {
    throw new Error('Supabase 환경 변수가 설정되지 않았습니다.');
  }

  return createClient(supabaseUrl, supabaseServiceKey);
}

export async function GET() {
  try {
    const currentRound = getCurrentRound();

    // 최신 회차 결과 가져오기
    const result = await fetchRoundResult(currentRound);

    if (!result) {
      return NextResponse.json({
        success: false,
        message: `${currentRound}회차 결과를 가져올 수 없습니다. 아직 추첨이 완료되지 않았을 수 있습니다.`,
      });
    }

    // Supabase 서비스 클라이언트
    let supabase;
    try {
      supabase = getServiceClient();
    } catch {
      // Supabase 설정이 없으면 결과만 반환
      return NextResponse.json({
        success: true,
        round: result.round,
        numbers: result.numbers,
        bonus: result.bonus,
        prize1st: result.prize1st,
        winners1st: result.winners1st,
        message: `${result.round}회차 결과 수집 완료 (DB 저장 건너뜀)`,
      });
    }

    // 1. 당첨 결과 저장
    const { error: historyError } = await supabase
      .from('lotto_history')
      .upsert({
        round: result.round,
        numbers: result.numbers,
        bonus: result.bonus,
        draw_date: result.drawDate,
        prize_1st: result.prize1st,
        winners_1st: result.winners1st,
      }, { onConflict: 'round' });

    if (historyError) {
      console.error('History save error:', historyError);
    }

    // 2. 추천 번호 매칭 (PostgreSQL 함수 호출)
    const { data: matchResult, error: matchError } = await supabase
      .rpc('match_lotto_recommendations', {
        p_round: result.round,
        p_winning_numbers: result.numbers,
        p_bonus: result.bonus,
      });

    if (matchError) {
      console.error('Match error:', matchError);
    }

    // 3. 당첨 통계 조회
    const { data: stats } = await supabase
      .from('lotto_winning_stats')
      .select('*')
      .eq('round', result.round)
      .single();

    return NextResponse.json({
      success: true,
      round: result.round,
      numbers: result.numbers,
      bonus: result.bonus,
      prize1st: result.prize1st,
      winners1st: result.winners1st,
      matching: {
        processedCount: matchResult || 0,
        stats: stats || null,
      },
      message: `${result.round}회차 결과 수집 및 매칭 완료`,
    });
  } catch (error) {
    console.error('Fetch Winning API Error:', error);
    return NextResponse.json(
      { error: '당첨번호 수집 중 오류가 발생했습니다.' },
      { status: 500 }
    );
  }
}
