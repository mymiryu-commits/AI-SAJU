import { NextResponse } from 'next/server';
import { fetchRoundResult, getCurrentRound, calculateRank } from '@/lib/lotto/data';

// Vercel Cron Job용 엔드포인트
// vercel.json에서 schedule: "0 10 * * 6" (매주 토요일 10시)
export const dynamic = 'force-dynamic';

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

    // TODO: Supabase에 결과 저장
    // await supabase.from('lotto_history').upsert({
    //   round: result.round,
    //   numbers: result.numbers,
    //   bonus: result.bonus,
    //   draw_date: result.drawDate,
    //   prize_1st: result.prize1st,
    //   winners_1st: result.winners1st,
    // });

    // TODO: 추천 번호와 당첨 매칭
    // const recommendations = await supabase
    //   .from('lotto_recommendations')
    //   .select('*')
    //   .eq('round', result.round)
    //   .is('matched_count', null);

    // for (const rec of recommendations) {
    //   const rank = calculateRank(rec.numbers, result.numbers, result.bonus);
    //   const matchedCount = rec.numbers.filter(n => result.numbers.includes(n)).length;
    //
    //   await supabase.from('lotto_recommendations').update({
    //     matched_count: matchedCount,
    //     prize_rank: rank,
    //   }).eq('id', rec.id);
    // }

    return NextResponse.json({
      success: true,
      round: result.round,
      numbers: result.numbers,
      bonus: result.bonus,
      prize1st: result.prize1st,
      winners1st: result.winners1st,
      message: `${result.round}회차 결과가 수집되었습니다.`,
    });
  } catch (error) {
    console.error('Fetch Winning API Error:', error);
    return NextResponse.json(
      { error: '당첨번호 수집 중 오류가 발생했습니다.' },
      { status: 500 }
    );
  }
}
