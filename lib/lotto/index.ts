// 타입 재내보내기
export type {
  LottoNumber,
  LottoCombination,
  LottoResult,
  FilterConfig,
  PatternAnalysis,
  OptimizedSet,
  SimulationResult,
  LottoRecommendation,
  WinningStats,
  UserTicket,
  GenerateOptions,
  GenerateResponse,
} from '@/types/lotto';

export {
  DEFAULT_FILTER_CONFIG,
  PRIZE_BY_RANK,
  WIN_PROBABILITY,
} from '@/types/lotto';

// 필터 함수들
export {
  calculateSum,
  countOdd,
  countEven,
  getMaxConsecutive,
  getMaxSameEnding,
  getMaxSameTens,
  countLow,
  countHigh,
  calculateAC,
  applyAllFilters,
  filterCombinations,
  getNumberStats,
  calculateFilterPassRate,
} from './filters';

// 분석 함수들
export {
  calculateFrequency,
  calculateOverdueCycles,
  getHotNumbers,
  getColdNumbers,
  calculateConsecutiveRate,
  getSumTrend,
  getOddEvenPattern,
  getLowHighPattern,
  getZoneDistribution,
  getEndingDistribution,
  getPairFrequency,
  getFrequentPairs,
  analyzePatterns,
  calculateNumberScore,
  calculateAllNumberScores,
  analyzeMatch,
  generateHeatmapData,
  generateStatsSummary,
} from './analyzer';

// 생성 함수들
export {
  generateRandomNumbers,
  generateFilteredNumbers,
  generatePatternBasedNumbers,
  generateWithIncludeNumbers,
  generateMultipleGames,
  generatePremiumNumbers,
  calculateQualityScore,
  sortByQuality,
  generateLottoNumbers,
} from './generator';

// 최적화 함수들
export {
  calculateCoverage,
  calculateOverlapRate,
  calculateExpectedHitRate,
  calculateDiversityScore,
  evaluateGameSet,
  optimizeForCoverage,
  optimizeForMinOverlap,
  optimizeBalanced,
  optimizeZoneDistribution,
  optimizeMultiGame,
  optimizeFromPool,
  improveGameSet,
  generateOptimizedRecommendation,
} from './optimizer';

// 시뮬레이터 함수들
export {
  testSingleGame,
  runBacktest,
  runRandomBacktest,
  runMonteCarloSimulation,
  analyzeFilterEffect,
  compareStrategies,
  generateSimulationSummary,
  calculateExpectedValue,
  calculateBreakEvenPoint,
} from './simulator';

// 데이터 로딩
export {
  loadLottoHistory,
  fetchLatestResults,
  fetchRoundResult,
  getCurrentRound,
  getNextDrawDate,
  getTimeUntilNextDraw,
  getNumberColor,
  getNumberColorClass,
  formatPrize,
  calculateRank,
} from './data';
