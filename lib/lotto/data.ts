import type { LottoResult } from '@/types/lotto';
import lottoHistoryData from '@/data/lotto-history.json';

/**
 * 로컬 데이터에서 로또 이력 로딩
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
 * 동행복권 API에서 최신 결과 가져오기
 * 참고: CORS 문제로 서버사이드에서만 호출 가능
 */
export async function fetchLatestResults(count: number = 10): Promise<LottoResult[]> {
  const results: LottoResult[] = [];

  // 현재 회차 추정 (2002년 12월 7일 1회차 기준)
  const startDate = new Date('2002-12-07');
  const today = new Date();
  const weeksDiff = Math.floor((today.getTime() - startDate.getTime()) / (7 * 24 * 60 * 60 * 1000));
  const estimatedRound = weeksDiff + 1;

  for (let i = 0; i < count; i++) {
    const round = estimatedRound - i;

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
 * 현재 회차 번호 계산
 */
export function getCurrentRound(): number {
  const startDate = new Date('2002-12-07');
  const today = new Date();
  const weeksDiff = Math.floor((today.getTime() - startDate.getTime()) / (7 * 24 * 60 * 60 * 1000));
  return weeksDiff + 1;
}

/**
 * 다음 추첨일 계산
 */
export function getNextDrawDate(): Date {
  const now = new Date();
  const dayOfWeek = now.getDay();

  // 토요일(6)까지 남은 일수 계산
  let daysUntilSaturday = (6 - dayOfWeek + 7) % 7;

  // 토요일이고 20:45 이전이면 오늘
  if (dayOfWeek === 6 && now.getHours() < 20) {
    daysUntilSaturday = 0;
  } else if (dayOfWeek === 6) {
    daysUntilSaturday = 7;
  }

  const nextDraw = new Date(now);
  nextDraw.setDate(now.getDate() + daysUntilSaturday);
  nextDraw.setHours(20, 45, 0, 0);

  return nextDraw;
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
