import type {
  FilterConfig,
  LottoResult,
  SimulationResult,
  PRIZE_BY_RANK,
} from '@/types/lotto';
import { generateFilteredNumbers, generateRandomNumbers } from './generator';
import { analyzeMatch } from './analyzer';

// 당첨금 상수
const PRIZES = {
  1: 2000000000, // 20억 (평균)
  2: 50000000, // 5천만원 (평균)
  3: 1500000, // 150만원 (고정)
  4: 50000, // 5만원 (고정)
  5: 5000, // 5천원 (고정)
};

const TICKET_PRICE = 1000; // 1게임 1000원

/**
 * 단일 게임 백테스트
 */
export function testSingleGame(
  numbers: number[],
  results: LottoResult[]
): {
  totalRounds: number;
  hits: { round: number; rank: number; prize: number }[];
  totalPrize: number;
} {
  const hits: { round: number; rank: number; prize: number }[] = [];
  let totalPrize = 0;

  for (const result of results) {
    const match = analyzeMatch(numbers, result);

    if (match.rank) {
      const prize = PRIZES[match.rank as keyof typeof PRIZES];
      hits.push({
        round: result.round,
        rank: match.rank,
        prize,
      });
      totalPrize += prize;
    }
  }

  return {
    totalRounds: results.length,
    hits,
    totalPrize,
  };
}

/**
 * 필터 전략 백테스트
 */
export function runBacktest(
  config: FilterConfig,
  historicalResults: LottoResult[],
  options: {
    simulationRounds?: number;
    gamesPerRound?: number;
    comparisonRounds?: number;
  } = {}
): SimulationResult {
  const {
    simulationRounds = 100,
    gamesPerRound = 5,
    comparisonRounds = 100,
  } = options;

  const hitsByRank = {
    rank1: 0,
    rank2: 0,
    rank3: 0,
    rank4: 0,
    rank5: 0,
  };

  let totalReturn = 0;
  let bestRound: SimulationResult['bestRound'];

  // 각 시뮬레이션 라운드
  for (let i = 0; i < simulationRounds; i++) {
    // 해당 회차 이전 데이터로 번호 생성
    const pastResults = historicalResults.slice(i + 1);
    const targetResult = historicalResults[i];

    if (!targetResult || pastResults.length < 10) continue;

    // 필터 기반 번호 생성
    for (let g = 0; g < gamesPerRound; g++) {
      const numbers = generateFilteredNumbers(config, pastResults, 5000);

      if (numbers) {
        const match = analyzeMatch(numbers, targetResult);

        if (match.rank) {
          const prize = PRIZES[match.rank as keyof typeof PRIZES];
          totalReturn += prize;

          hitsByRank[`rank${match.rank}` as keyof typeof hitsByRank]++;

          // 최고 당첨 기록
          if (
            !bestRound ||
            match.matchCount > (bestRound.matchCount || 0) ||
            (match.matchCount === bestRound.matchCount && prize > bestRound.prize)
          ) {
            bestRound = {
              round: targetResult.round,
              matchCount: match.matchCount,
              prize,
            };
          }
        }
      }
    }
  }

  const totalInvestment = simulationRounds * gamesPerRound * TICKET_PRICE;
  const roi = ((totalReturn - totalInvestment) / totalInvestment) * 100;

  // 랜덤 비교
  const randomResult = runRandomBacktest(
    historicalResults,
    comparisonRounds,
    gamesPerRound
  );

  const totalHits =
    hitsByRank.rank1 +
    hitsByRank.rank2 +
    hitsByRank.rank3 +
    hitsByRank.rank4 +
    hitsByRank.rank5;

  const comparisonToRandom =
    randomResult.hitRate > 0
      ? ((totalHits / (simulationRounds * gamesPerRound) / randomResult.hitRate) - 1) * 100
      : 0;

  return {
    totalRounds: simulationRounds,
    totalInvestment,
    totalReturn,
    roi,
    hitsByRank,
    hitRate: (totalHits / (simulationRounds * gamesPerRound)) * 100,
    comparisonToRandom,
    bestRound,
  };
}

/**
 * 랜덤 번호 백테스트 (비교용)
 */
export function runRandomBacktest(
  historicalResults: LottoResult[],
  rounds: number,
  gamesPerRound: number
): {
  totalReturn: number;
  hitRate: number;
  hitsByRank: SimulationResult['hitsByRank'];
} {
  const hitsByRank = {
    rank1: 0,
    rank2: 0,
    rank3: 0,
    rank4: 0,
    rank5: 0,
  };

  let totalReturn = 0;

  for (let i = 0; i < rounds && i < historicalResults.length; i++) {
    const targetResult = historicalResults[i];

    for (let g = 0; g < gamesPerRound; g++) {
      const numbers = generateRandomNumbers();
      const match = analyzeMatch(numbers, targetResult);

      if (match.rank) {
        const prize = PRIZES[match.rank as keyof typeof PRIZES];
        totalReturn += prize;
        hitsByRank[`rank${match.rank}` as keyof typeof hitsByRank]++;
      }
    }
  }

  const totalGames = rounds * gamesPerRound;
  const totalHits =
    hitsByRank.rank1 +
    hitsByRank.rank2 +
    hitsByRank.rank3 +
    hitsByRank.rank4 +
    hitsByRank.rank5;

  return {
    totalReturn,
    hitRate: (totalHits / totalGames) * 100,
    hitsByRank,
  };
}

/**
 * 몬테카를로 시뮬레이션
 */
export function runMonteCarloSimulation(
  config: FilterConfig,
  iterations: number = 10000
): {
  expectedReturn: number;
  expectedROI: number;
  hitProbabilities: Record<string, number>;
  confidenceInterval: { low: number; high: number };
} {
  const returns: number[] = [];
  const hitCounts = {
    rank1: 0,
    rank2: 0,
    rank3: 0,
    rank4: 0,
    rank5: 0,
  };

  for (let i = 0; i < iterations; i++) {
    // 가상의 당첨 번호 생성
    const winningNumbers = generateRandomNumbers();
    const winningResult: LottoResult = {
      round: i,
      numbers: winningNumbers,
      bonus: Math.floor(Math.random() * 45) + 1,
      drawDate: new Date().toISOString(),
    };

    // 보너스 번호가 당첨 번호와 중복되지 않게
    while (winningNumbers.includes(winningResult.bonus)) {
      winningResult.bonus = Math.floor(Math.random() * 45) + 1;
    }

    // 필터 기반 번호 생성
    const userNumbers = generateFilteredNumbers(config, [], 1000);

    if (userNumbers) {
      const match = analyzeMatch(userNumbers, winningResult);

      if (match.rank) {
        const prize = PRIZES[match.rank as keyof typeof PRIZES];
        returns.push(prize - TICKET_PRICE);
        hitCounts[`rank${match.rank}` as keyof typeof hitCounts]++;
      } else {
        returns.push(-TICKET_PRICE);
      }
    } else {
      returns.push(-TICKET_PRICE);
    }
  }

  // 평균 수익
  const expectedReturn = returns.reduce((a, b) => a + b, 0) / iterations;
  const expectedROI = (expectedReturn / TICKET_PRICE) * 100;

  // 당첨 확률
  const hitProbabilities = {
    rank1: (hitCounts.rank1 / iterations) * 100,
    rank2: (hitCounts.rank2 / iterations) * 100,
    rank3: (hitCounts.rank3 / iterations) * 100,
    rank4: (hitCounts.rank4 / iterations) * 100,
    rank5: (hitCounts.rank5 / iterations) * 100,
  };

  // 95% 신뢰구간
  const sorted = [...returns].sort((a, b) => a - b);
  const lowIndex = Math.floor(iterations * 0.025);
  const highIndex = Math.floor(iterations * 0.975);

  return {
    expectedReturn,
    expectedROI,
    hitProbabilities,
    confidenceInterval: {
      low: sorted[lowIndex],
      high: sorted[highIndex],
    },
  };
}

/**
 * 필터 효과 분석
 */
export function analyzeFilterEffect(
  config: FilterConfig,
  historicalResults: LottoResult[]
): {
  passRate: number;
  historicalHitRate: number;
  improvement: number;
} {
  let passCount = 0;
  let hitInPassedCount = 0;

  for (const result of historicalResults) {
    const passes = generateFilteredNumbers(config, [], 1);

    if (passes) {
      passCount++;

      // 이 필터를 통과한 번호가 실제로 당첨되었는지 (근사 계산)
      // 실제로는 당첨 번호가 필터를 통과하는지 확인
      const numbers = generateFilteredNumbers(config, [], 100);
      if (numbers) {
        const match = analyzeMatch(numbers, result);
        if (match.matchCount >= 3) {
          hitInPassedCount++;
        }
      }
    }
  }

  const passRate = (passCount / historicalResults.length) * 100;
  const historicalHitRate = (hitInPassedCount / passCount) * 100;

  // 랜덤 대비 개선율
  const randomHitRate = 2.2; // 5등 확률 약 2.2%
  const improvement =
    randomHitRate > 0
      ? ((historicalHitRate - randomHitRate) / randomHitRate) * 100
      : 0;

  return {
    passRate,
    historicalHitRate,
    improvement,
  };
}

/**
 * 전략 비교
 */
export function compareStrategies(
  historicalResults: LottoResult[],
  strategies: { name: string; config: FilterConfig }[]
): {
  name: string;
  result: SimulationResult;
}[] {
  return strategies.map(({ name, config }) => ({
    name,
    result: runBacktest(config, historicalResults, {
      simulationRounds: 50,
      gamesPerRound: 5,
    }),
  }));
}

/**
 * 시뮬레이션 결과 요약 생성
 */
export function generateSimulationSummary(result: SimulationResult): string {
  const totalHits =
    result.hitsByRank.rank1 +
    result.hitsByRank.rank2 +
    result.hitsByRank.rank3 +
    result.hitsByRank.rank4 +
    result.hitsByRank.rank5;

  return `
## 백테스트 결과 요약

### 투자 현황
- 총 시뮬레이션 라운드: ${result.totalRounds}회
- 총 투자금: ${result.totalInvestment.toLocaleString()}원
- 총 수익금: ${result.totalReturn.toLocaleString()}원
- ROI: ${result.roi.toFixed(2)}%

### 당첨 현황
- 1등: ${result.hitsByRank.rank1}회
- 2등: ${result.hitsByRank.rank2}회
- 3등: ${result.hitsByRank.rank3}회
- 4등: ${result.hitsByRank.rank4}회
- 5등: ${result.hitsByRank.rank5}회
- 총 당첨: ${totalHits}회 (${result.hitRate.toFixed(2)}%)

### 랜덤 대비
- 랜덤 대비 성과: ${result.comparisonToRandom > 0 ? '+' : ''}${result.comparisonToRandom.toFixed(2)}%

${
  result.bestRound
    ? `### 최고 당첨
- 회차: ${result.bestRound.round}회
- 맞은 개수: ${result.bestRound.matchCount}개
- 당첨금: ${result.bestRound.prize.toLocaleString()}원`
    : ''
}
`.trim();
}

/**
 * 기대값 계산
 */
export function calculateExpectedValue(config: FilterConfig): number {
  // 각 등수별 기대값 계산
  const ev1 = PRIZES[1] * (1 / 8145060);
  const ev2 = PRIZES[2] * (1 / 1357510);
  const ev3 = PRIZES[3] * (1 / 35724);
  const ev4 = PRIZES[4] * (1 / 733);
  const ev5 = PRIZES[5] * (1 / 45);

  // 총 기대값 - 티켓 가격
  return ev1 + ev2 + ev3 + ev4 + ev5 - TICKET_PRICE;
}

/**
 * 손익분기점 계산
 */
export function calculateBreakEvenPoint(
  config: FilterConfig,
  averageReturn: number
): number {
  if (averageReturn <= 0) return Infinity;

  // 투자금 회수에 필요한 게임 수
  return Math.ceil(TICKET_PRICE / averageReturn);
}
