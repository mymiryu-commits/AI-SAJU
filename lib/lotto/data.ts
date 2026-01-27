import type { LottoResult } from '@/types/lotto';
import lottoHistoryData from '@/data/lotto-history.json';

// 기준점: 1회차 추첨일 (2002년 12월 7일 토요일 20:45 KST)
const FIRST_DRAW_DATE = new Date('2002-12-07T20:45:00+09:00');
const ONE_WEEK_MS = 7 * 24 * 60 * 60 * 1000;

/**
 * 현재 회차 번호 계산 (정확한 시간 기반)
 * - 매주 토요일 20:45 KST에 추첨
 * - 추첨 후에는 해당 회차, 추첨 전에는 이전 회차
 */
export function getCurrentRound(): number {
  const now = new Date();
  const timeDiff = now.getTime() - FIRST_DRAW_DATE.getTime();

  // 1회차 이전
  if (timeDiff < 0) return 0;

  // 주 단위 계산
  const weeksPassed = Math.floor(timeDiff / ONE_WEEK_MS);
  const currentWeekStart = new Date(FIRST_DRAW_DATE.getTime() + weeksPassed * ONE_WEEK_MS);

  // 현재 주의 추첨 시간이 지났는지 확인
  if (now >= currentWeekStart) {
    return weeksPassed + 1;
  }

  return weeksPassed;
}

/**
 * 최신 추첨 완료된 회차 (결과가 발표된 회차)
 */
export function getLatestCompletedRound(): number {
  const now = new Date();
  const timeDiff = now.getTime() - FIRST_DRAW_DATE.getTime();

  if (timeDiff < 0) return 0;

  const weeksPassed = Math.floor(timeDiff / ONE_WEEK_MS);
  const currentDrawTime = new Date(FIRST_DRAW_DATE.getTime() + weeksPassed * ONE_WEEK_MS);

  // 토요일 20:45 이후면 해당 회차 완료, 아니면 이전 회차
  // 실제로는 결과 발표까지 약 1시간 소요되므로 21:45로 설정
  const resultAnnouncedTime = new Date(currentDrawTime.getTime() + 60 * 60 * 1000);

  if (now >= resultAnnouncedTime) {
    return weeksPassed + 1;
  }

  return weeksPassed;
}

/**
 * 다음 추첨 회차 번호
 */
export function getNextRound(): number {
  return getLatestCompletedRound() + 1;
}

/**
 * 로컬 JSON 데이터에서 로또 이력 로딩
 */
export function loadLottoHistory(): LottoResult[] {
  return lottoHistoryData.results.map((item) => ({
    round: item.round,
    numbers: item.numbers,
    bonus: item.bonus,
    drawDate: item.drawDate,
    prize1st: item.prize1st,
    winners1st: item.winners1st,
  }));
}

/**
 * Supabase에서 로또 이력 로딩 (서버사이드)
 */
export async function loadLottoHistoryFromDB(
  supabaseUrl?: string,
  supabaseKey?: string,
  limit: number = 50
): Promise<LottoResult[]> {
  const url = supabaseUrl || process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = supabaseKey || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

  if (!url || !key) {
    console.warn('Supabase not configured, falling back to local data');
    return loadLottoHistory();
  }

  try {
    const response = await fetch(
      `${url}/rest/v1/lotto_history?select=*&order=round.desc&limit=${limit}`,
      {
        headers: {
          apikey: key,
          Authorization: `Bearer ${key}`,
        },
        cache: 'no-store',
      }
    );

    if (!response.ok) {
      throw new Error(`Supabase error: ${response.status}`);
    }

    const data = await response.json();

    if (data && data.length > 0) {
      return data.map((item: any) => ({
        round: item.round,
        numbers: item.numbers,
        bonus: item.bonus,
        drawDate: item.draw_date,
        prize1st: item.prize_1st,
        winners1st: item.winners_1st,
      }));
    }

    // DB에 데이터가 없으면 로컬 데이터 반환
    return loadLottoHistory();
  } catch (error) {
    console.error('Failed to load from Supabase:', error);
    return loadLottoHistory();
  }
}

/**
 * 동행복권 API에서 최신 결과 가져오기
 * 참고: CORS 문제로 서버사이드에서만 호출 가능
 */
export async function fetchLatestResults(count: number = 10): Promise<LottoResult[]> {
  const results: LottoResult[] = [];
  const latestRound = getLatestCompletedRound();

  for (let i = 0; i < count; i++) {
    const round = latestRound - i;
    if (round < 1) break;

    try {
      const response = await fetch(
        `https://www.dhlottery.co.kr/common.do?method=getLottoNumber&drwNo=${round}`,
        { cache: 'no-store' }
      );

      if (!response.ok) continue;

      const data = await response.json();

      if (data.returnValue === 'success') {
        results.push({
          round: data.drwNo,
          numbers: [
            data.drwtNo1,
            data.drwtNo2,
            data.drwtNo3,
            data.drwtNo4,
            data.drwtNo5,
            data.drwtNo6,
          ].sort((a, b) => a - b),
          bonus: data.bnusNo,
          drawDate: data.drwNoDate,
          prize1st: data.firstWinamnt,
          winners1st: data.firstPrzwnerCo,
        });
      }
    } catch (error) {
      console.error(`Failed to fetch round ${round}:`, error);
    }
  }

  return results;
}

/**
 * 특정 회차 결과 가져오기
 */
export async function fetchRoundResult(round: number): Promise<LottoResult | null> {
  try {
    const response = await fetch(
      `https://www.dhlottery.co.kr/common.do?method=getLottoNumber&drwNo=${round}`,
      { cache: 'no-store' }
    );

    if (!response.ok) return null;

    const data = await response.json();

    if (data.returnValue === 'success') {
      return {
        round: data.drwNo,
        numbers: [
          data.drwtNo1,
          data.drwtNo2,
          data.drwtNo3,
          data.drwtNo4,
          data.drwtNo5,
          data.drwtNo6,
        ].sort((a, b) => a - b),
        bonus: data.bnusNo,
        drawDate: data.drwNoDate,
        prize1st: data.firstWinamnt,
        winners1st: data.firstPrzwnerCo,
      };
    }

    return null;
  } catch (error) {
    console.error(`Failed to fetch round ${round}:`, error);
    return null;
  }
}

/**
 * 다음 추첨일 계산 (KST 기준)
 */
export function getNextDrawDate(): Date {
  const now = new Date();
  const latestRound = getLatestCompletedRound();

  // 다음 회차의 추첨 시간 = 1회차 시간 + (다음회차 - 1) * 1주일
  const nextDrawTime = new Date(
    FIRST_DRAW_DATE.getTime() + latestRound * ONE_WEEK_MS
  );

  return nextDrawTime;
}

/**
 * 다음 추첨까지 남은 시간
 */
export function getTimeUntilNextDraw(): {
  days: number;
  hours: number;
  minutes: number;
  seconds: number;
} {
  const now = new Date();
  const nextDraw = getNextDrawDate();
  const diff = nextDraw.getTime() - now.getTime();

  if (diff <= 0) {
    return { days: 0, hours: 0, minutes: 0, seconds: 0 };
  }

  const days = Math.floor(diff / (1000 * 60 * 60 * 24));
  const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
  const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
  const seconds = Math.floor((diff % (1000 * 60)) / 1000);

  return { days, hours, minutes, seconds };
}

/**
 * 특정 회차의 추첨일 계산
 */
export function getDrawDateForRound(round: number): Date {
  return new Date(FIRST_DRAW_DATE.getTime() + (round - 1) * ONE_WEEK_MS);
}

/**
 * 번호 색상 반환 (동행복권 기준)
 */
export function getNumberColor(num: number): string {
  if (num <= 10) return '#fbc400'; // 노랑
  if (num <= 20) return '#69c8f2'; // 파랑
  if (num <= 30) return '#ff7272'; // 빨강
  if (num <= 40) return '#aaa'; // 회색
  return '#b0d840'; // 초록
}

/**
 * 번호 색상 클래스 반환 (Tailwind)
 */
export function getNumberColorClass(num: number): string {
  if (num <= 10) return 'bg-yellow-400 text-yellow-900';
  if (num <= 20) return 'bg-blue-400 text-blue-900';
  if (num <= 30) return 'bg-red-400 text-white';
  if (num <= 40) return 'bg-gray-400 text-gray-900';
  return 'bg-green-400 text-green-900';
}

/**
 * 포맷된 금액 반환
 */
export function formatPrize(amount: number): string {
  if (amount >= 100000000) {
    return `${(amount / 100000000).toFixed(1)}억원`;
  }
  if (amount >= 10000) {
    return `${(amount / 10000).toFixed(0)}만원`;
  }
  return `${amount.toLocaleString()}원`;
}

/**
 * 당첨 등수 계산
 */
export function calculateRank(
  userNumbers: number[],
  winningNumbers: number[],
  bonusNumber: number
): number | null {
  const matchCount = userNumbers.filter((n) => winningNumbers.includes(n)).length;
  const hasBonus = userNumbers.includes(bonusNumber);

  if (matchCount === 6) return 1;
  if (matchCount === 5 && hasBonus) return 2;
  if (matchCount === 5) return 3;
  if (matchCount === 4) return 4;
  if (matchCount === 3) return 5;
  return null;
}
