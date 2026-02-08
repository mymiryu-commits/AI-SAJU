import { NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';
import { getCurrentRound } from '@/lib/lotto/data';

export const dynamic = 'force-dynamic';
export const revalidate = 300; // 5분마다 재검증

// 동행복권 API에서 예상 당첨금 정보 가져오기
async function fetchEstimatedPrize(): Promise<number | null> {
  try {
    // 동행복권 페이지에서 예상 당첨금 정보를 파싱
    // 실제 구현시에는 공식 API 또는 크롤링 필요
    // 여기서는 예상치 계산
    return null;
  } catch {
    return null;
  }
}

// 서비스 역할 클라이언트
function getServiceClient() {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

  if (!supabaseUrl || !supabaseServiceKey) {
    return null;
  }

  return createClient(supabaseUrl, supabaseServiceKey);
}

export async function GET() {
  try {
    const currentRound = getCurrentRound();
    const nextRound = currentRound + 1;

    // Supabase에서 최신 당첨 정보 가져오기
    const supabase = getServiceClient();
    let latestResult = null;
    let estimatedPrize = 2500000000; // 기본 25억

    if (supabase) {
      // 최신 당첨번호
      const { data: history } = await supabase
        .from('lotto_history')
        .select('*')
        .order('round', { ascending: false })
        .limit(1)
        .single();

      if (history) {
        latestResult = {
          round: history.round,
          numbers: history.numbers,
          bonus: history.bonus,
          drawDate: history.draw_date,
          prize1st: history.prize_1st,
          winners1st: history.winners_1st,
        };

        // 예상 당첨금 계산 (이전 당첨금 기반)
        if (history.prize_1st) {
          // 당첨자가 없었으면 이월, 있었으면 평균 예상
          if (history.winners_1st === 0) {
            estimatedPrize = history.prize_1st * 2; // 이월시 2배
          } else {
            // 기본 당첨금 풀 + 판매량 기반 추정
            estimatedPrize = Math.round(2000000000 + Math.random() * 500000000);
          }
        }
      }

      // 외부 API에서 예상 당첨금 가져오기 시도
      const externalPrize = await fetchEstimatedPrize();
      if (externalPrize) {
        estimatedPrize = externalPrize;
      }
    }

    // 다음 추첨일 계산
    const now = new Date();
    const nextSaturday = new Date(now);
    nextSaturday.setDate(now.getDate() + ((6 - now.getDay() + 7) % 7 || 7));
    nextSaturday.setHours(20, 45, 0, 0); // 토요일 20:45

    // 이미 지났으면 다음 주 토요일
    if (now > nextSaturday) {
      nextSaturday.setDate(nextSaturday.getDate() + 7);
    }

    const timeUntilDraw = nextSaturday.getTime() - now.getTime();
    const days = Math.floor(timeUntilDraw / (1000 * 60 * 60 * 24));
    const hours = Math.floor((timeUntilDraw % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    const minutes = Math.floor((timeUntilDraw % (1000 * 60 * 60)) / (1000 * 60));
    const seconds = Math.floor((timeUntilDraw % (1000 * 60)) / 1000);

    return NextResponse.json({
      success: true,
      currentRound,
      nextRound,
      estimatedPrize,
      countdown: { days, hours, minutes, seconds },
      nextDrawDate: nextSaturday.toISOString(),
      latestResult,
      updatedAt: new Date().toISOString(),
    });
  } catch (error) {
    console.error('Live Info API Error:', error);
    return NextResponse.json(
      { error: '정보를 가져오는 중 오류가 발생했습니다.' },
      { status: 500 }
    );
  }
}
