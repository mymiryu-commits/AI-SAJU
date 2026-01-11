import type { FilterConfig, LottoResult } from '@/types/lotto';

/**
 * 합계 계산
 */
export function calculateSum(numbers: number[]): number {
  return numbers.reduce((sum, n) => sum + n, 0);
}

/**
 * 홀수 개수 계산
 */
export function countOdd(numbers: number[]): number {
  return numbers.filter((n) => n % 2 === 1).length;
}

/**
 * 짝수 개수 계산
 */
export function countEven(numbers: number[]): number {
  return numbers.filter((n) => n % 2 === 0).length;
}

/**
 * 연속번호 최대 길이 계산
 */
export function getMaxConsecutive(numbers: number[]): number {
  const sorted = [...numbers].sort((a, b) => a - b);
  let maxConsecutive = 1;
  let currentConsecutive = 1;

  for (let i = 1; i < sorted.length; i++) {
    if (sorted[i] === sorted[i - 1] + 1) {
      currentConsecutive++;
      maxConsecutive = Math.max(maxConsecutive, currentConsecutive);
    } else {
      currentConsecutive = 1;
    }
  }

  return maxConsecutive;
}

/**
 * 동일 끝자리 최대 개수 계산
 */
export function getMaxSameEnding(numbers: number[]): number {
  const endings = new Map<number, number>();

  for (const n of numbers) {
    const ending = n % 10;
    endings.set(ending, (endings.get(ending) || 0) + 1);
  }

  return Math.max(...endings.values());
}

/**
 * 동일 십단위 최대 개수 계산 (1-9, 10-19, 20-29, 30-39, 40-45)
 */
export function getMaxSameTens(numbers: number[]): number {
  const tens = new Map<number, number>();

  for (const n of numbers) {
    const ten = Math.floor(n / 10);
    tens.set(ten, (tens.get(ten) || 0) + 1);
  }

  return Math.max(...tens.values());
}

/**
 * 저번호 개수 계산 (1-22)
 */
export function countLow(numbers: number[]): number {
  return numbers.filter((n) => n <= 22).length;
}

/**
 * 고번호 개수 계산 (23-45)
 */
export function countHigh(numbers: number[]): number {
  return numbers.filter((n) => n >= 23).length;
}

/**
 * AC값 (Arithmetic Complexity) 계산
 * 6개 번호 간의 차이값 종류 수 - 5
 * 권장: 7 이상
 */
export function calculateAC(numbers: number[]): number {
  const differences = new Set<number>();
  const sorted = [...numbers].sort((a, b) => a - b);

  for (let i = 0; i < sorted.length; i++) {
    for (let j = i + 1; j < sorted.length; j++) {
      differences.add(sorted[j] - sorted[i]);
    }
  }

  return differences.size - 5;
}

/**
 * 이전 회차와 중복 개수 계산
 */
export function countOverlapWithPrevious(
  numbers: number[],
  previousResults: LottoResult[]
): number {
  const previousNumbers = new Set(previousResults.flatMap((r) => r.numbers));
  return numbers.filter((n) => previousNumbers.has(n)).length;
}

/**
 * 단일 필터 적용 함수들
 */
export const filterFunctions = {
  // 합계 범위 필터
  sumRange: (numbers: number[], config: FilterConfig['sumRange']): boolean => {
    if (!config.enabled) return true;
    const sum = calculateSum(numbers);
    return sum >= config.min && sum <= config.max;
  },

  // 홀짝 비율 필터
  oddEvenRatio: (
    numbers: number[],
    config: FilterConfig['oddEvenRatio']
  ): boolean => {
    if (!config.enabled) return true;
    const oddCount = countOdd(numbers);
    return config.allowedRatios.includes(oddCount);
  },

  // 연속번호 필터
  consecutiveMax: (
    numbers: number[],
    config: FilterConfig['consecutiveMax']
  ): boolean => {
    if (!config.enabled) return true;
    return getMaxConsecutive(numbers) <= config.max;
  },

  // 동일 끝자리 필터
  sameEndingMax: (
    numbers: number[],
    config: FilterConfig['sameEndingMax']
  ): boolean => {
    if (!config.enabled) return true;
    return getMaxSameEnding(numbers) <= config.max;
  },

  // 동일 십단위 필터
  sameTensMax: (
    numbers: number[],
    config: FilterConfig['sameTensMax']
  ): boolean => {
    if (!config.enabled) return true;
    return getMaxSameTens(numbers) <= config.max;
  },

  // 저고 비율 필터
  lowHighRatio: (
    numbers: number[],
    config: FilterConfig['lowHighRatio']
  ): boolean => {
    if (!config.enabled) return true;
    const lowCount = countLow(numbers);
    return config.allowedRatios.includes(lowCount);
  },

  // AC값 필터
  acValueMin: (
    numbers: number[],
    config: FilterConfig['acValueMin']
  ): boolean => {
    if (!config.enabled) return true;
    return calculateAC(numbers) >= config.min;
  },

  // 제외 번호 필터
  excludeNumbers: (
    numbers: number[],
    config: FilterConfig['excludeNumbers']
  ): boolean => {
    if (!config.enabled || config.numbers.length === 0) return true;
    return !numbers.some((n) => config.numbers.includes(n));
  },

  // 필수 포함 번호 필터
  includeNumbers: (
    numbers: number[],
    config: FilterConfig['includeNumbers']
  ): boolean => {
    if (!config.enabled || config.numbers.length === 0) return true;
    return config.numbers.every((n) => numbers.includes(n));
  },
};

/**
 * 이전 회차 중복 필터 (별도 처리 - 이전 결과 필요)
 */
export function filterByPreviousOverlap(
  numbers: number[],
  config: FilterConfig['excludePrevious'],
  previousResults: LottoResult[]
): boolean {
  if (!config.enabled || previousResults.length === 0) return true;

  const recentResults = previousResults.slice(0, config.count);
  const overlap = countOverlapWithPrevious(numbers, recentResults);

  return overlap <= config.maxOverlap;
}

/**
 * 모든 필터 적용
 */
export function applyAllFilters(
  numbers: number[],
  config: FilterConfig,
  previousResults: LottoResult[] = []
): boolean {
  // 기본 필터들 적용
  if (!filterFunctions.sumRange(numbers, config.sumRange)) return false;
  if (!filterFunctions.oddEvenRatio(numbers, config.oddEvenRatio)) return false;
  if (!filterFunctions.consecutiveMax(numbers, config.consecutiveMax))
    return false;
  if (!filterFunctions.sameEndingMax(numbers, config.sameEndingMax))
    return false;
  if (!filterFunctions.sameTensMax(numbers, config.sameTensMax)) return false;
  if (!filterFunctions.lowHighRatio(numbers, config.lowHighRatio)) return false;
  if (!filterFunctions.acValueMin(numbers, config.acValueMin)) return false;
  if (!filterFunctions.excludeNumbers(numbers, config.excludeNumbers))
    return false;
  if (!filterFunctions.includeNumbers(numbers, config.includeNumbers))
    return false;

  // 이전 회차 중복 필터
  if (!filterByPreviousOverlap(numbers, config.excludePrevious, previousResults))
    return false;

  return true;
}

/**
 * 조합 배열에 필터 적용
 */
export function filterCombinations(
  combinations: number[][],
  config: FilterConfig,
  previousResults: LottoResult[] = []
): number[][] {
  return combinations.filter((combo) =>
    applyAllFilters(combo, config, previousResults)
  );
}

/**
 * 번호 조합의 통계 정보 계산
 */
export function getNumberStats(numbers: number[]) {
  return {
    sum: calculateSum(numbers),
    oddCount: countOdd(numbers),
    evenCount: countEven(numbers),
    lowCount: countLow(numbers),
    highCount: countHigh(numbers),
    maxConsecutive: getMaxConsecutive(numbers),
    maxSameEnding: getMaxSameEnding(numbers),
    maxSameTens: getMaxSameTens(numbers),
    acValue: calculateAC(numbers),
  };
}

/**
 * 필터 통과율 계산 (디버그/통계용)
 */
export function calculateFilterPassRate(
  combinations: number[][],
  config: FilterConfig,
  previousResults: LottoResult[] = []
): {
  total: number;
  passed: number;
  passRate: number;
  filterBreakdown: Record<string, number>;
} {
  const total = combinations.length;
  let passed = 0;
  const filterBreakdown: Record<string, number> = {
    sumRange: 0,
    oddEvenRatio: 0,
    consecutiveMax: 0,
    sameEndingMax: 0,
    sameTensMax: 0,
    lowHighRatio: 0,
    acValueMin: 0,
    excludeNumbers: 0,
    includeNumbers: 0,
    excludePrevious: 0,
  };

  for (const combo of combinations) {
    let passedAll = true;

    if (!filterFunctions.sumRange(combo, config.sumRange)) {
      filterBreakdown.sumRange++;
      passedAll = false;
    }
    if (!filterFunctions.oddEvenRatio(combo, config.oddEvenRatio)) {
      filterBreakdown.oddEvenRatio++;
      passedAll = false;
    }
    if (!filterFunctions.consecutiveMax(combo, config.consecutiveMax)) {
      filterBreakdown.consecutiveMax++;
      passedAll = false;
    }
    if (!filterFunctions.sameEndingMax(combo, config.sameEndingMax)) {
      filterBreakdown.sameEndingMax++;
      passedAll = false;
    }
    if (!filterFunctions.sameTensMax(combo, config.sameTensMax)) {
      filterBreakdown.sameTensMax++;
      passedAll = false;
    }
    if (!filterFunctions.lowHighRatio(combo, config.lowHighRatio)) {
      filterBreakdown.lowHighRatio++;
      passedAll = false;
    }
    if (!filterFunctions.acValueMin(combo, config.acValueMin)) {
      filterBreakdown.acValueMin++;
      passedAll = false;
    }
    if (!filterFunctions.excludeNumbers(combo, config.excludeNumbers)) {
      filterBreakdown.excludeNumbers++;
      passedAll = false;
    }
    if (!filterFunctions.includeNumbers(combo, config.includeNumbers)) {
      filterBreakdown.includeNumbers++;
      passedAll = false;
    }
    if (
      !filterByPreviousOverlap(combo, config.excludePrevious, previousResults)
    ) {
      filterBreakdown.excludePrevious++;
      passedAll = false;
    }

    if (passedAll) passed++;
  }

  return {
    total,
    passed,
    passRate: (passed / total) * 100,
    filterBreakdown,
  };
}
