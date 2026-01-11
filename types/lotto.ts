// 로또 번호 타입 (1-45)
export type LottoNumber = number;

// 로또 6개 번호 조합
export type LottoCombination = [number, number, number, number, number, number];

// 당첨 결과
export interface LottoResult {
  round: number;
  numbers: number[];
  bonus: number;
  drawDate: string;
  prize1st?: number;
  winners1st?: number;
}

// 필터 설정
export interface FilterConfig {
  // 합계 범위 (권장: 100-170)
  sumRange: {
    min: number;
    max: number;
    enabled: boolean;
  };
  // 홀짝 비율 (권장: 2:4, 3:3, 4:2)
  oddEvenRatio: {
    allowedRatios: number[]; // [2, 3, 4] = 홀수 2~4개 허용
    enabled: boolean;
  };
  // 연속번호 최대 개수 (권장: 2개 이하)
  consecutiveMax: {
    max: number;
    enabled: boolean;
  };
  // 동일 끝자리 최대 개수 (권장: 2개 이하)
  sameEndingMax: {
    max: number;
    enabled: boolean;
  };
  // 동일 십단위 최대 개수 (권장: 3개 이하)
  sameTensMax: {
    max: number;
    enabled: boolean;
  };
  // 이전 회차 중복 제외 개수
  excludePrevious: {
    count: number; // 최근 N회차
    maxOverlap: number; // 최대 중복 허용 개수
    enabled: boolean;
  };
  // 저고 비율 (1-22: 저, 23-45: 고)
  lowHighRatio: {
    allowedRatios: number[]; // 저번호 개수
    enabled: boolean;
  };
  // AC값 (Arithmetic Complexity) 최소값 (권장: 7 이상)
  acValueMin: {
    min: number;
    enabled: boolean;
  };
  // 제외 번호
  excludeNumbers: {
    numbers: number[];
    enabled: boolean;
  };
  // 필수 포함 번호
  includeNumbers: {
    numbers: number[];
    enabled: boolean;
  };
}

// 패턴 분석 결과
export interface PatternAnalysis {
  // 최근 N회 빈도
  recentFrequency: Map<number, number>;
  // 미출현 주기 (각 번호별)
  overdueCycles: Map<number, number>;
  // 연번 출현율
  consecutiveRate: number;
  // 합계 추이
  sumTrend: number[];
  // 과열 번호 (최근 자주 출현)
  hotNumbers: number[];
  // 냉각 번호 (오래 미출현)
  coldNumbers: number[];
  // 홀짝 패턴
  oddEvenPattern: { odd: number; even: number }[];
  // 고저 패턴
  lowHighPattern: { low: number; high: number }[];
}

// 다중게임 최적화 결과
export interface OptimizedSet {
  games: number[][];
  coverage: number; // 번호 커버리지 (%)
  overlapRate: number; // 게임간 중복률 (%)
  expectedHitRate: number; // 5등 이상 기대율 (%)
  diversityScore: number; // 다양성 점수
}

// 백테스트 시뮬레이션 결과
export interface SimulationResult {
  totalRounds: number;
  totalInvestment: number;
  totalReturn: number;
  roi: number;
  hitsByRank: {
    rank1: number;
    rank2: number;
    rank3: number;
    rank4: number;
    rank5: number;
  };
  hitRate: number; // 5등 이상 당첨률
  comparisonToRandom: number; // 랜덤 대비 성과 (%)
  bestRound?: {
    round: number;
    matchCount: number;
    prize: number;
  };
}

// 추천 번호 저장
export interface LottoRecommendation {
  id: string;
  userId: string;
  round: number;
  numbers: number[];
  filters: FilterConfig;
  createdAt: string;
  matchedCount?: number;
  prizeRank?: number | null;
  prizeAmount?: number;
}

// 당첨 통계
export interface WinningStats {
  totalRecommendations: number;
  totalWinners: number;
  winnersByRank: {
    rank1: number;
    rank2: number;
    rank3: number;
    rank4: number;
    rank5: number;
  };
  totalPrizeAmount: number;
  hitRate: number;
}

// 사용자 티켓
export interface UserTicket {
  id: string;
  userId: string;
  round: number;
  numbers: number[];
  isRecommended: boolean; // AI 추천 번호인지
  result?: {
    matchedNumbers: number[];
    matchedBonus: boolean;
    rank: number | null;
    prize: number;
  };
  createdAt: string;
}

// 번호 생성 옵션
export interface GenerateOptions {
  count: number; // 생성할 게임 수
  filters: FilterConfig;
  usePattern: boolean; // 패턴 분석 적용
  recentRounds: number; // 패턴 분석에 사용할 회차 수
  optimizeMultiple: boolean; // 다중게임 최적화
}

// API 응답 타입
export interface GenerateResponse {
  success: boolean;
  games: number[][];
  analysis?: PatternAnalysis;
  optimization?: OptimizedSet;
  message?: string;
}

// 기본 필터 설정
export const DEFAULT_FILTER_CONFIG: FilterConfig = {
  sumRange: { min: 100, max: 170, enabled: true },
  oddEvenRatio: { allowedRatios: [2, 3, 4], enabled: true },
  consecutiveMax: { max: 2, enabled: true },
  sameEndingMax: { max: 2, enabled: true },
  sameTensMax: { max: 3, enabled: true },
  excludePrevious: { count: 1, maxOverlap: 3, enabled: true },
  lowHighRatio: { allowedRatios: [2, 3, 4], enabled: true },
  acValueMin: { min: 7, enabled: true },
  excludeNumbers: { numbers: [], enabled: false },
  includeNumbers: { numbers: [], enabled: false },
};

// 당첨 순위별 상금 (대략적인 평균)
export const PRIZE_BY_RANK = {
  1: 2000000000, // 20억 (변동)
  2: 50000000, // 5천만원 (변동)
  3: 1500000, // 150만원 (고정)
  4: 50000, // 5만원 (고정)
  5: 5000, // 5천원 (고정)
};

// 당첨 확률
export const WIN_PROBABILITY = {
  1: 1 / 8145060,
  2: 1 / 1357510,
  3: 1 / 35724,
  4: 1 / 733,
  5: 1 / 45,
};
