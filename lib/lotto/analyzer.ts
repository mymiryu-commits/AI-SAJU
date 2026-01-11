import type { LottoResult, PatternAnalysis } from '@/types/lotto';
import {
  calculateSum,
  countOdd,
  countLow,
  getMaxConsecutive,
} from './filters';

/**
 * 번호별 출현 빈도 계산
 */
export function calculateFrequency(
  results: LottoResult[],
  includeBonus: boolean = false
): Map<number, number> {
  const frequency = new Map<number, number>();

  // 1-45 초기화
  for (let i = 1; i <= 45; i++) {
    frequency.set(i, 0);
  }

  for (const result of results) {
    for (const num of result.numbers) {
      frequency.set(num, (frequency.get(num) || 0) + 1);
    }
    if (includeBonus) {
      frequency.set(result.bonus, (frequency.get(result.bonus) || 0) + 1);
    }
  }

  return frequency;
}

/**
 * 번호별 미출현 주기 계산
 */
export function calculateOverdueCycles(
  results: LottoResult[]
): Map<number, number> {
  const overdue = new Map<number, number>();

  // 1-45 초기화 (최대 주기로)
  for (let i = 1; i <= 45; i++) {
    overdue.set(i, results.length);
  }

  // 가장 최근부터 역순으로 탐색
  for (let i = 0; i < results.length; i++) {
    for (const num of results[i].numbers) {
      // 아직 발견되지 않은 경우에만 주기 설정
      if (overdue.get(num) === results.length) {
        overdue.set(num, i);
      }
    }
  }

  return overdue;
}

/**
 * 과열 번호 추출 (최근 자주 출현)
 */
export function getHotNumbers(
  results: LottoResult[],
  count: number = 10,
  threshold: number = 3
): number[] {
  const recentResults = results.slice(0, count);
  const frequency = calculateFrequency(recentResults);

  return Array.from(frequency.entries())
    .filter(([_, freq]) => freq >= threshold)
    .sort((a, b) => b[1] - a[1])
    .map(([num]) => num);
}

/**
 * 냉각 번호 추출 (오래 미출현)
 */
export function getColdNumbers(
  results: LottoResult[],
  threshold: number = 10
): number[] {
  const overdue = calculateOverdueCycles(results);

  return Array.from(overdue.entries())
    .filter(([_, cycles]) => cycles >= threshold)
    .sort((a, b) => b[1] - a[1])
    .map(([num]) => num);
}

/**
 * 연번 출현율 계산
 */
export function calculateConsecutiveRate(results: LottoResult[]): number {
  let hasConsecutive = 0;

  for (const result of results) {
    if (getMaxConsecutive(result.numbers) >= 2) {
      hasConsecutive++;
    }
  }

  return (hasConsecutive / results.length) * 100;
}

/**
 * 합계 추이 분석
 */
export function getSumTrend(results: LottoResult[]): number[] {
  return results.map((r) => calculateSum(r.numbers));
}

/**
 * 홀짝 패턴 분석
 */
export function getOddEvenPattern(
  results: LottoResult[]
): { odd: number; even: number }[] {
  return results.map((r) => ({
    odd: countOdd(r.numbers),
    even: 6 - countOdd(r.numbers),
  }));
}

/**
 * 고저 패턴 분석
 */
export function getLowHighPattern(
  results: LottoResult[]
): { low: number; high: number }[] {
  return results.map((r) => ({
    low: countLow(r.numbers),
    high: 6 - countLow(r.numbers),
  }));
}

/**
 * 번호대별 분포 분석 (1-10, 11-20, 21-30, 31-40, 41-45)
 */
export function getZoneDistribution(
  results: LottoResult[]
): Map<string, number>[] {
  const zones = ['1-10', '11-20', '21-30', '31-40', '41-45'];

  return results.map((r) => {
    const dist = new Map<string, number>();
    zones.forEach((z) => dist.set(z, 0));

    for (const num of r.numbers) {
      if (num <= 10) dist.set('1-10', (dist.get('1-10') || 0) + 1);
      else if (num <= 20) dist.set('11-20', (dist.get('11-20') || 0) + 1);
      else if (num <= 30) dist.set('21-30', (dist.get('21-30') || 0) + 1);
      else if (num <= 40) dist.set('31-40', (dist.get('31-40') || 0) + 1);
      else dist.set('41-45', (dist.get('41-45') || 0) + 1);
    }

    return dist;
  });
}

/**
 * 끝자리 분포 분석
 */
export function getEndingDistribution(results: LottoResult[]): Map<number, number> {
  const distribution = new Map<number, number>();

  for (let i = 0; i <= 9; i++) {
    distribution.set(i, 0);
  }

  for (const result of results) {
    for (const num of result.numbers) {
      const ending = num % 10;
      distribution.set(ending, (distribution.get(ending) || 0) + 1);
    }
  }

  return distribution;
}

/**
 * 번호 쌍 출현 빈도 분석
 */
export function getPairFrequency(
  results: LottoResult[]
): Map<string, number> {
  const pairs = new Map<string, number>();

  for (const result of results) {
    const sorted = [...result.numbers].sort((a, b) => a - b);

    for (let i = 0; i < sorted.length; i++) {
      for (let j = i + 1; j < sorted.length; j++) {
        const key = `${sorted[i]}-${sorted[j]}`;
        pairs.set(key, (pairs.get(key) || 0) + 1);
      }
    }
  }

  return pairs;
}

/**
 * 자주 함께 출현하는 번호 쌍 추출
 */
export function getFrequentPairs(
  results: LottoResult[],
  topN: number = 10
): { pair: [number, number]; count: number }[] {
  const pairs = getPairFrequency(results);

  return Array.from(pairs.entries())
    .sort((a, b) => b[1] - a[1])
    .slice(0, topN)
    .map(([key, count]) => {
      const [a, b] = key.split('-').map(Number);
      return { pair: [a, b] as [number, number], count };
    });
}

/**
 * 종합 패턴 분석
 */
export function analyzePatterns(
  results: LottoResult[],
  recentCount: number = 10
): PatternAnalysis {
  const recentResults = results.slice(0, recentCount);
  const allResults = results;

  return {
    recentFrequency: calculateFrequency(recentResults),
    overdueCycles: calculateOverdueCycles(allResults),
    consecutiveRate: calculateConsecutiveRate(allResults),
    sumTrend: getSumTrend(recentResults),
    hotNumbers: getHotNumbers(allResults, recentCount, 3),
    coldNumbers: getColdNumbers(allResults, 15),
    oddEvenPattern: getOddEvenPattern(recentResults),
    lowHighPattern: getLowHighPattern(recentResults),
  };
}

/**
 * 번호 추천 점수 계산 (패턴 기반)
 */
export function calculateNumberScore(
  num: number,
  analysis: PatternAnalysis
): number {
  let score = 50; // 기본 점수

  // 최근 빈도 반영 (적당히 출현한 번호 선호)
  const freq = analysis.recentFrequency.get(num) || 0;
  if (freq >= 1 && freq <= 3) score += 10;
  else if (freq === 0) score += 5; // 미출현 번호도 약간 가점
  else if (freq > 4) score -= 10; // 과출현 번호 감점

  // 미출현 주기 반영 (오래 미출현 시 가점)
  const overdue = analysis.overdueCycles.get(num) || 0;
  if (overdue >= 10 && overdue <= 20) score += 15;
  else if (overdue > 20) score += 10;

  // 과열/냉각 번호 반영
  if (analysis.hotNumbers.includes(num)) score -= 5;
  if (analysis.coldNumbers.includes(num)) score += 10;

  return Math.max(0, Math.min(100, score));
}

/**
 * 전체 번호 추천 점수 계산
 */
export function calculateAllNumberScores(
  analysis: PatternAnalysis
): Map<number, number> {
  const scores = new Map<number, number>();

  for (let i = 1; i <= 45; i++) {
    scores.set(i, calculateNumberScore(i, analysis));
  }

  return scores;
}

/**
 * 당첨 결과 매칭 분석
 */
export function analyzeMatch(
  userNumbers: number[],
  winningResult: LottoResult
): {
  matchedNumbers: number[];
  matchedBonus: boolean;
  matchCount: number;
  rank: number | null;
} {
  const matchedNumbers = userNumbers.filter((n) =>
    winningResult.numbers.includes(n)
  );
  const matchedBonus = userNumbers.includes(winningResult.bonus);
  const matchCount = matchedNumbers.length;

  let rank: number | null = null;

  if (matchCount === 6) rank = 1;
  else if (matchCount === 5 && matchedBonus) rank = 2;
  else if (matchCount === 5) rank = 3;
  else if (matchCount === 4) rank = 4;
  else if (matchCount === 3) rank = 5;

  return {
    matchedNumbers,
    matchedBonus,
    matchCount,
    rank,
  };
}

/**
 * 히트맵 데이터 생성 (최근 N회차)
 */
export function generateHeatmapData(
  results: LottoResult[],
  recentCount: number = 20
): { number: number; round: number; hit: boolean }[] {
  const recentResults = results.slice(0, recentCount);
  const data: { number: number; round: number; hit: boolean }[] = [];

  for (let num = 1; num <= 45; num++) {
    for (let i = 0; i < recentResults.length; i++) {
      data.push({
        number: num,
        round: recentResults[i].round,
        hit: recentResults[i].numbers.includes(num),
      });
    }
  }

  return data;
}

/**
 * 통계 요약 생성
 */
export function generateStatsSummary(results: LottoResult[]): {
  totalRounds: number;
  avgSum: number;
  mostFrequentOddEven: string;
  mostFrequentLowHigh: string;
  consecutiveRate: number;
  hotNumbers: number[];
  coldNumbers: number[];
} {
  const sums = results.map((r) => calculateSum(r.numbers));
  const avgSum = sums.reduce((a, b) => a + b, 0) / sums.length;

  const oddEvenCounts = new Map<string, number>();
  const lowHighCounts = new Map<string, number>();

  for (const r of results) {
    const odd = countOdd(r.numbers);
    const low = countLow(r.numbers);

    const oeKey = `${odd}:${6 - odd}`;
    const lhKey = `${low}:${6 - low}`;

    oddEvenCounts.set(oeKey, (oddEvenCounts.get(oeKey) || 0) + 1);
    lowHighCounts.set(lhKey, (lowHighCounts.get(lhKey) || 0) + 1);
  }

  const mostFrequentOddEven = Array.from(oddEvenCounts.entries()).sort(
    (a, b) => b[1] - a[1]
  )[0][0];

  const mostFrequentLowHigh = Array.from(lowHighCounts.entries()).sort(
    (a, b) => b[1] - a[1]
  )[0][0];

  return {
    totalRounds: results.length,
    avgSum: Math.round(avgSum),
    mostFrequentOddEven,
    mostFrequentLowHigh,
    consecutiveRate: calculateConsecutiveRate(results),
    hotNumbers: getHotNumbers(results, 10, 3),
    coldNumbers: getColdNumbers(results, 15),
  };
}
