import type {
  FilterConfig,
  LottoResult,
  PatternAnalysis,
  DEFAULT_FILTER_CONFIG,
} from '@/types/lotto';
import { applyAllFilters, getNumberStats } from './filters';
import { analyzePatterns, calculateAllNumberScores } from './analyzer';

/**
 * 랜덤 6개 번호 생성 (정렬됨)
 */
export function generateRandomNumbers(): number[] {
  const numbers: number[] = [];
  const available = Array.from({ length: 45 }, (_, i) => i + 1);

  for (let i = 0; i < 6; i++) {
    const randomIndex = Math.floor(Math.random() * available.length);
    numbers.push(available[randomIndex]);
    available.splice(randomIndex, 1);
  }

  return numbers.sort((a, b) => a - b);
}

/**
 * 가중치 기반 랜덤 번호 선택
 */
export function weightedRandomSelect(
  weights: Map<number, number>,
  count: number
): number[] {
  const selected: number[] = [];
  const available = new Map(weights);

  for (let i = 0; i < count; i++) {
    const totalWeight = Array.from(available.values()).reduce(
      (sum, w) => sum + w,
      0
    );
    let random = Math.random() * totalWeight;

    for (const [num, weight] of available) {
      random -= weight;
      if (random <= 0) {
        selected.push(num);
        available.delete(num);
        break;
      }
    }
  }

  return selected.sort((a, b) => a - b);
}

/**
 * 필터 조건을 만족하는 번호 생성 (최대 시도 횟수 제한)
 */
export function generateFilteredNumbers(
  config: FilterConfig,
  previousResults: LottoResult[] = [],
  maxAttempts: number = 10000
): number[] | null {
  for (let i = 0; i < maxAttempts; i++) {
    const numbers = generateRandomNumbers();

    if (applyAllFilters(numbers, config, previousResults)) {
      return numbers;
    }
  }

  return null; // 조건 만족 실패
}

/**
 * 패턴 기반 번호 생성
 */
export function generatePatternBasedNumbers(
  config: FilterConfig,
  previousResults: LottoResult[],
  analysis: PatternAnalysis,
  maxAttempts: number = 10000
): number[] | null {
  const scores = calculateAllNumberScores(analysis);

  for (let i = 0; i < maxAttempts; i++) {
    // 가중치 기반으로 번호 선택
    const numbers = weightedRandomSelect(scores, 6);

    if (applyAllFilters(numbers, config, previousResults)) {
      return numbers;
    }
  }

  // 가중치 실패 시 일반 필터 생성으로 폴백
  return generateFilteredNumbers(config, previousResults, maxAttempts);
}

/**
 * 필수 포함 번호가 있는 경우 번호 생성
 */
export function generateWithIncludeNumbers(
  includeNumbers: number[],
  config: FilterConfig,
  previousResults: LottoResult[] = [],
  maxAttempts: number = 10000
): number[] | null {
  if (includeNumbers.length > 6) {
    throw new Error('필수 포함 번호는 6개 이하여야 합니다.');
  }

  const remainingCount = 6 - includeNumbers.length;
  const excludeSet = new Set(includeNumbers);

  for (let i = 0; i < maxAttempts; i++) {
    // 나머지 번호 랜덤 생성
    const available = Array.from({ length: 45 }, (_, i) => i + 1).filter(
      (n) => !excludeSet.has(n)
    );

    const additional: number[] = [];
    for (let j = 0; j < remainingCount; j++) {
      const randomIndex = Math.floor(Math.random() * available.length);
      additional.push(available[randomIndex]);
      available.splice(randomIndex, 1);
    }

    const numbers = [...includeNumbers, ...additional].sort((a, b) => a - b);

    if (applyAllFilters(numbers, config, previousResults)) {
      return numbers;
    }
  }

  return null;
}

/**
 * 다중 게임 생성
 */
export function generateMultipleGames(
  count: number,
  config: FilterConfig,
  previousResults: LottoResult[] = [],
  usePattern: boolean = false,
  analysis?: PatternAnalysis
): number[][] {
  const games: number[][] = [];
  const generatedSet = new Set<string>();
  let attempts = 0;
  const maxTotalAttempts = count * 100;

  while (games.length < count && attempts < maxTotalAttempts) {
    attempts++;

    let numbers: number[] | null;

    if (usePattern && analysis) {
      numbers = generatePatternBasedNumbers(
        config,
        previousResults,
        analysis,
        1000
      );
    } else {
      numbers = generateFilteredNumbers(config, previousResults, 1000);
    }

    if (numbers) {
      const key = numbers.join(',');

      // 중복 방지
      if (!generatedSet.has(key)) {
        generatedSet.add(key);
        games.push(numbers);
      }
    }
  }

  return games;
}

/**
 * 인기 번호 조합 회피 (1등 당첨금 극대화)
 * 많은 사람들이 선택하는 패턴 회피
 */
export function avoidPopularPatterns(numbers: number[]): boolean {
  // 1. 등차수열 회피 (1,2,3,4,5,6 등)
  const sorted = [...numbers].sort((a, b) => a - b);
  const diffs = [];
  for (let i = 1; i < sorted.length; i++) {
    diffs.push(sorted[i] - sorted[i - 1]);
  }
  if (new Set(diffs).size === 1) return false; // 등차수열

  // 2. 특정 패턴 회피 (생년월일 패턴: 1-12, 1-31 집중)
  const under12 = numbers.filter((n) => n <= 12).length;
  const under31 = numbers.filter((n) => n <= 31).length;
  if (under12 >= 4 || under31 >= 5) return false;

  // 3. 대각선/수직선 패턴 회피 (용지 기준)
  // 7*7 매트릭스 기준 패턴 체크
  const row = (n: number) => Math.floor((n - 1) / 7);
  const col = (n: number) => (n - 1) % 7;

  const rows = numbers.map(row);
  const cols = numbers.map(col);

  // 같은 행에 4개 이상
  const rowCounts = new Map<number, number>();
  rows.forEach((r) => rowCounts.set(r, (rowCounts.get(r) || 0) + 1));
  if (Math.max(...rowCounts.values()) >= 4) return false;

  // 같은 열에 4개 이상
  const colCounts = new Map<number, number>();
  cols.forEach((c) => colCounts.set(c, (colCounts.get(c) || 0) + 1));
  if (Math.max(...colCounts.values()) >= 4) return false;

  return true;
}

/**
 * 프리미엄 번호 생성 (인기 패턴 회피 포함)
 */
export function generatePremiumNumbers(
  config: FilterConfig,
  previousResults: LottoResult[] = [],
  analysis?: PatternAnalysis,
  maxAttempts: number = 20000
): number[] | null {
  for (let i = 0; i < maxAttempts; i++) {
    let numbers: number[] | null;

    if (analysis) {
      numbers = generatePatternBasedNumbers(
        config,
        previousResults,
        analysis,
        1
      );
    } else {
      numbers = generateFilteredNumbers(config, previousResults, 1);
    }

    if (numbers && avoidPopularPatterns(numbers)) {
      return numbers;
    }
  }

  // 실패 시 인기 패턴 회피 없이 생성
  return analysis
    ? generatePatternBasedNumbers(config, previousResults, analysis, 10000)
    : generateFilteredNumbers(config, previousResults, 10000);
}

/**
 * 번호 조합의 품질 점수 계산
 */
export function calculateQualityScore(
  numbers: number[],
  analysis?: PatternAnalysis
): number {
  const stats = getNumberStats(numbers);
  let score = 0;

  // 합계 범위 (100-170이 이상적)
  if (stats.sum >= 100 && stats.sum <= 170) score += 20;
  else if (stats.sum >= 80 && stats.sum <= 190) score += 10;

  // 홀짝 균형 (3:3이 이상적)
  if (stats.oddCount === 3) score += 15;
  else if (stats.oddCount >= 2 && stats.oddCount <= 4) score += 10;

  // 고저 균형
  if (stats.lowCount === 3) score += 15;
  else if (stats.lowCount >= 2 && stats.lowCount <= 4) score += 10;

  // AC값 (높을수록 좋음)
  if (stats.acValue >= 9) score += 15;
  else if (stats.acValue >= 7) score += 10;
  else if (stats.acValue >= 5) score += 5;

  // 연속번호 (적을수록 좋음)
  if (stats.maxConsecutive <= 2) score += 10;

  // 동일 끝자리 (적을수록 좋음)
  if (stats.maxSameEnding <= 2) score += 10;

  // 동일 십단위 (적을수록 좋음)
  if (stats.maxSameTens <= 3) score += 5;

  // 패턴 분석 기반 추가 점수
  if (analysis) {
    let patternScore = 0;
    for (const num of numbers) {
      // 냉각 번호 포함 시 가점
      if (analysis.coldNumbers.includes(num)) patternScore += 2;
      // 과열 번호 포함 시 감점
      if (analysis.hotNumbers.includes(num)) patternScore -= 1;
    }
    score += Math.max(0, patternScore);
  }

  return Math.min(100, score);
}

/**
 * 생성된 게임들을 품질 점수로 정렬
 */
export function sortByQuality(
  games: number[][],
  analysis?: PatternAnalysis
): { numbers: number[]; score: number }[] {
  return games
    .map((numbers) => ({
      numbers,
      score: calculateQualityScore(numbers, analysis),
    }))
    .sort((a, b) => b.score - a.score);
}

/**
 * 통합 번호 생성 함수
 */
export function generateLottoNumbers(options: {
  count: number;
  config: FilterConfig;
  previousResults?: LottoResult[];
  usePattern?: boolean;
  premium?: boolean;
  sortByQuality?: boolean;
}): {
  games: number[][];
  analysis?: PatternAnalysis;
  quality?: { numbers: number[]; score: number }[];
} {
  const {
    count,
    config,
    previousResults = [],
    usePattern = false,
    premium = false,
    sortByQuality: shouldSort = false,
  } = options;

  let analysis: PatternAnalysis | undefined;

  if (usePattern && previousResults.length > 0) {
    analysis = analyzePatterns(previousResults, 10);
  }

  const games: number[][] = [];
  const generatedSet = new Set<string>();
  let attempts = 0;
  const maxAttempts = count * 100; // 무한 루프 방지

  while (games.length < count && attempts < maxAttempts) {
    attempts++;
    let numbers: number[] | null;

    if (premium) {
      numbers = generatePremiumNumbers(config, previousResults, analysis);
    } else if (usePattern && analysis) {
      numbers = generatePatternBasedNumbers(
        config,
        previousResults,
        analysis,
        10000
      );
    } else {
      numbers = generateFilteredNumbers(config, previousResults, 10000);
    }

    if (numbers) {
      // 중복 방지
      const key = numbers.join(',');

      if (!generatedSet.has(key)) {
        generatedSet.add(key);
        games.push(numbers);
      }
    }
  }

  const result: {
    games: number[][];
    analysis?: PatternAnalysis;
    quality?: { numbers: number[]; score: number }[];
  } = { games };

  if (analysis) {
    result.analysis = analysis;
  }

  if (shouldSort) {
    result.quality = sortByQuality(games, analysis);
    result.games = result.quality.map((q) => q.numbers);
  }

  return result;
}
