import type {
  FilterConfig,
  LottoResult,
  OptimizedSet,
  PatternAnalysis,
} from '@/types/lotto';
import { generateMultipleGames, calculateQualityScore } from './generator';
import { analyzePatterns } from './analyzer';

/**
 * 번호 커버리지 계산 (전체 45개 중 몇 개를 커버하는지)
 */
export function calculateCoverage(games: number[][]): number {
  const allNumbers = new Set(games.flat());
  return (allNumbers.size / 45) * 100;
}

/**
 * 게임 간 중복률 계산
 */
export function calculateOverlapRate(games: number[][]): number {
  if (games.length < 2) return 0;

  let totalOverlap = 0;
  let comparisons = 0;

  for (let i = 0; i < games.length; i++) {
    for (let j = i + 1; j < games.length; j++) {
      const overlap = games[i].filter((n) => games[j].includes(n)).length;
      totalOverlap += overlap;
      comparisons++;
    }
  }

  // 평균 중복 개수 / 6 * 100
  return ((totalOverlap / comparisons) / 6) * 100;
}

/**
 * 5등 이상 기대 당첨률 추정
 * 45개 중 6개가 당첨될 때, N게임으로 3개 이상 맞출 확률
 */
export function calculateExpectedHitRate(games: number[][]): number {
  const coverage = new Set(games.flat());
  const coveredCount = coverage.size;

  // 간단한 추정: 커버리지가 높을수록 5등 확률 증가
  // 실제로는 더 복잡한 조합 계산 필요
  const baseProbability = 1 / 45; // 5등 기본 확률 약 2.2%

  // 커버리지 보너스
  const coverageBonus = coveredCount / 45;

  // 게임 수 보너스
  const gameBonus = Math.min(games.length / 10, 1);

  return baseProbability * 100 * (1 + coverageBonus + gameBonus);
}

/**
 * 다양성 점수 계산
 */
export function calculateDiversityScore(games: number[][]): number {
  if (games.length === 0) return 0;

  // 1. 번호 분포 다양성
  const numberCounts = new Map<number, number>();
  for (const game of games) {
    for (const num of game) {
      numberCounts.set(num, (numberCounts.get(num) || 0) + 1);
    }
  }

  // 표준편차 계산 (낮을수록 균등 분포)
  const counts = Array.from(numberCounts.values());
  const mean = counts.reduce((a, b) => a + b, 0) / counts.length;
  const variance =
    counts.reduce((sum, c) => sum + Math.pow(c - mean, 2), 0) / counts.length;
  const stdDev = Math.sqrt(variance);

  // 표준편차가 낮을수록 높은 점수
  const distributionScore = Math.max(0, 100 - stdDev * 20);

  // 2. 합계 다양성
  const sums = games.map((g) => g.reduce((a, b) => a + b, 0));
  const sumRange = Math.max(...sums) - Math.min(...sums);
  const sumDiversityScore = Math.min(sumRange, 50); // 최대 50점

  // 3. 홀짝 다양성
  const oddCounts = new Set(games.map((g) => g.filter((n) => n % 2 === 1).length));
  const oddDiversityScore = oddCounts.size * 10; // 다양할수록 높은 점수

  return (distributionScore + sumDiversityScore + oddDiversityScore) / 3;
}

/**
 * 게임 세트 평가
 */
export function evaluateGameSet(games: number[][]): OptimizedSet {
  return {
    games,
    coverage: calculateCoverage(games),
    overlapRate: calculateOverlapRate(games),
    expectedHitRate: calculateExpectedHitRate(games),
    diversityScore: calculateDiversityScore(games),
  };
}

/**
 * 그리디 최적화: 커버리지 최대화
 */
export function optimizeForCoverage(
  candidates: number[][],
  targetCount: number
): number[][] {
  const selected: number[][] = [];
  const covered = new Set<number>();
  const remaining = [...candidates];

  while (selected.length < targetCount && remaining.length > 0) {
    let bestIndex = -1;
    let bestNewCoverage = -1;

    // 가장 많은 새로운 번호를 커버하는 게임 선택
    for (let i = 0; i < remaining.length; i++) {
      const newNumbers = remaining[i].filter((n) => !covered.has(n));
      if (newNumbers.length > bestNewCoverage) {
        bestNewCoverage = newNumbers.length;
        bestIndex = i;
      }
    }

    if (bestIndex >= 0) {
      const game = remaining[bestIndex];
      selected.push(game);
      game.forEach((n) => covered.add(n));
      remaining.splice(bestIndex, 1);
    } else {
      break;
    }
  }

  // 목표 개수 미달 시 남은 것 중 랜덤 추가
  while (selected.length < targetCount && remaining.length > 0) {
    const randomIndex = Math.floor(Math.random() * remaining.length);
    selected.push(remaining[randomIndex]);
    remaining.splice(randomIndex, 1);
  }

  return selected;
}

/**
 * 그리디 최적화: 중복 최소화
 */
export function optimizeForMinOverlap(
  candidates: number[][],
  targetCount: number
): number[][] {
  const selected: number[][] = [];
  const remaining = [...candidates];

  // 첫 번째 게임은 랜덤 또는 품질 점수 기준
  if (remaining.length > 0) {
    selected.push(remaining.shift()!);
  }

  while (selected.length < targetCount && remaining.length > 0) {
    let bestIndex = -1;
    let minOverlap = Infinity;

    // 기존 선택된 게임들과 가장 중복이 적은 게임 선택
    for (let i = 0; i < remaining.length; i++) {
      let totalOverlap = 0;
      for (const selectedGame of selected) {
        const overlap = remaining[i].filter((n) =>
          selectedGame.includes(n)
        ).length;
        totalOverlap += overlap;
      }

      if (totalOverlap < minOverlap) {
        minOverlap = totalOverlap;
        bestIndex = i;
      }
    }

    if (bestIndex >= 0) {
      selected.push(remaining[bestIndex]);
      remaining.splice(bestIndex, 1);
    } else {
      break;
    }
  }

  return selected;
}

/**
 * 균형 최적화: 커버리지와 중복 균형
 */
export function optimizeBalanced(
  candidates: number[][],
  targetCount: number,
  coverageWeight: number = 0.6
): number[][] {
  const selected: number[][] = [];
  const covered = new Set<number>();
  const remaining = [...candidates];

  while (selected.length < targetCount && remaining.length > 0) {
    let bestIndex = -1;
    let bestScore = -Infinity;

    for (let i = 0; i < remaining.length; i++) {
      // 커버리지 점수
      const newCoverage = remaining[i].filter((n) => !covered.has(n)).length;
      const coverageScore = newCoverage / 6;

      // 중복 점수 (낮을수록 좋음)
      let totalOverlap = 0;
      for (const selectedGame of selected) {
        totalOverlap += remaining[i].filter((n) =>
          selectedGame.includes(n)
        ).length;
      }
      const overlapScore =
        selected.length > 0
          ? 1 - totalOverlap / (selected.length * 6)
          : 1;

      // 가중 점수
      const score =
        coverageScore * coverageWeight +
        overlapScore * (1 - coverageWeight);

      if (score > bestScore) {
        bestScore = score;
        bestIndex = i;
      }
    }

    if (bestIndex >= 0) {
      const game = remaining[bestIndex];
      selected.push(game);
      game.forEach((n) => covered.add(n));
      remaining.splice(bestIndex, 1);
    } else {
      break;
    }
  }

  return selected;
}

/**
 * 번호대별 균등 분포 최적화
 */
export function optimizeZoneDistribution(
  candidates: number[][],
  targetCount: number
): number[][] {
  // 각 게임의 번호대 분포 점수 계산
  const withScores = candidates.map((game) => {
    const zones = [0, 0, 0, 0, 0]; // 1-9, 10-19, 20-29, 30-39, 40-45

    for (const num of game) {
      if (num < 10) zones[0]++;
      else if (num < 20) zones[1]++;
      else if (num < 30) zones[2]++;
      else if (num < 40) zones[3]++;
      else zones[4]++;
    }

    // 균등 분포일수록 높은 점수
    const variance =
      zones.reduce((sum, z) => sum + Math.pow(z - 1.2, 2), 0) / 5;
    const score = 1 / (1 + variance);

    return { game, score };
  });

  // 점수 높은 순으로 정렬
  withScores.sort((a, b) => b.score - a.score);

  // 상위 후보 중에서 균형 최적화
  const topCandidates = withScores.slice(0, targetCount * 3).map((s) => s.game);

  return optimizeBalanced(topCandidates, targetCount);
}

/**
 * 다중게임 최적화 메인 함수
 */
export function optimizeMultiGame(
  config: FilterConfig,
  previousResults: LottoResult[],
  gameCount: 5 | 10 | 20,
  options: {
    usePattern?: boolean;
    strategy?: 'coverage' | 'minOverlap' | 'balanced' | 'zone';
    candidateMultiplier?: number;
  } = {}
): OptimizedSet {
  const {
    usePattern = true,
    strategy = 'balanced',
    candidateMultiplier = 5,
  } = options;

  // 후보 생성 (목표의 N배)
  const candidateCount = gameCount * candidateMultiplier;

  let analysis: PatternAnalysis | undefined;
  if (usePattern && previousResults.length > 0) {
    analysis = analyzePatterns(previousResults, 10);
  }

  const candidates = generateMultipleGames(
    candidateCount,
    config,
    previousResults,
    usePattern,
    analysis
  );

  // 후보가 부족한 경우 추가 생성
  if (candidates.length < gameCount) {
    const additional = generateMultipleGames(
      gameCount - candidates.length,
      config,
      previousResults,
      false
    );
    candidates.push(...additional);
  }

  // 전략별 최적화
  let optimized: number[][];

  switch (strategy) {
    case 'coverage':
      optimized = optimizeForCoverage(candidates, gameCount);
      break;
    case 'minOverlap':
      optimized = optimizeForMinOverlap(candidates, gameCount);
      break;
    case 'zone':
      optimized = optimizeZoneDistribution(candidates, gameCount);
      break;
    case 'balanced':
    default:
      optimized = optimizeBalanced(candidates, gameCount);
      break;
  }

  return evaluateGameSet(optimized);
}

/**
 * 번호 풀 생성 후 최적 조합 선택
 */
export function optimizeFromPool(
  numberPool: number[],
  gameCount: number
): OptimizedSet {
  if (numberPool.length < 6) {
    throw new Error('번호 풀은 최소 6개 이상이어야 합니다.');
  }

  // 번호 풀에서 가능한 모든 6개 조합 생성 (제한적)
  const candidates: number[][] = [];
  const maxCandidates = 1000;

  // 랜덤 샘플링으로 후보 생성
  for (let i = 0; i < maxCandidates; i++) {
    const shuffled = [...numberPool].sort(() => Math.random() - 0.5);
    const combo = shuffled.slice(0, 6).sort((a, b) => a - b);
    const key = combo.join(',');

    if (!candidates.some((c) => c.join(',') === key)) {
      candidates.push(combo);
    }
  }

  return evaluateGameSet(optimizeBalanced(candidates, gameCount));
}

/**
 * 기존 게임 세트 개선
 */
export function improveGameSet(
  existingGames: number[][],
  config: FilterConfig,
  previousResults: LottoResult[],
  improvementRatio: number = 0.3
): OptimizedSet {
  const replaceCount = Math.ceil(existingGames.length * improvementRatio);
  const keepCount = existingGames.length - replaceCount;

  // 품질 점수로 정렬하여 하위 게임 교체
  const analysis = analyzePatterns(previousResults, 10);
  const scored = existingGames.map((game) => ({
    game,
    score: calculateQualityScore(game, analysis),
  }));

  scored.sort((a, b) => b.score - a.score);

  const kept = scored.slice(0, keepCount).map((s) => s.game);

  // 새로운 게임 생성
  const newGames = generateMultipleGames(
    replaceCount,
    config,
    previousResults,
    true,
    analysis
  );

  // 기존 게임과 중복 최소화
  const optimizedNew = optimizeForMinOverlap(
    newGames,
    replaceCount
  );

  return evaluateGameSet([...kept, ...optimizedNew]);
}

/**
 * 추천 최적화 세트 생성 (프리미엄 기능)
 */
export function generateOptimizedRecommendation(
  config: FilterConfig,
  previousResults: LottoResult[],
  gameCount: 5 | 10 | 20
): {
  primary: OptimizedSet;
  alternative: OptimizedSet;
  analysis: PatternAnalysis;
} {
  const analysis = analyzePatterns(previousResults, 10);

  // 메인 추천: 균형 전략
  const primary = optimizeMultiGame(config, previousResults, gameCount, {
    usePattern: true,
    strategy: 'balanced',
  });

  // 대안 추천: 커버리지 전략
  const alternative = optimizeMultiGame(config, previousResults, gameCount, {
    usePattern: true,
    strategy: 'coverage',
  });

  return { primary, alternative, analysis };
}
