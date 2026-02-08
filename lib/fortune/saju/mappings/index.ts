/**
 * 사주 매핑 시스템 통합 인덱스
 *
 * 60갑자, MBTI 연동, 시적 표현 시스템을 내보냅니다.
 */

// 60갑자 시스템
export {
  SIXTY_JIAZI_MAPPING,
  HEAVENLY_STEMS,
  HEAVENLY_STEMS_KOREAN,
  EARTHLY_BRANCHES,
  EARTHLY_BRANCHES_KOREAN,
  ZODIAC_ANIMALS,
  getSixtyJiaziInfo,
  getYearJiaziInfo,
  generateJiaziPrologue,
  generateJiaziEpilogue,
  type SixtyJiaziInfo
} from './sixtyJiazi';

// MBTI 연동 시스템
export {
  DAYMASTER_MBTI_MATCH,
  MBTI_DESCRIPTIONS,
  analyzeMBTISajuMatch,
  getMBTIDescription,
  generateIntegratedAnalysis,
  type MBTIType,
  type MBTIDayMasterMatch,
  type MBTISajuMatch
} from './mbtiIntegration';

// 시적 표현 시스템
export {
  ELEMENT_INFO,
  GENERATING_RELATIONS,
  CONTROLLING_RELATIONS,
  analyzeElementRelation,
  generateElementBalancePoetry,
  generatePrologue,
  generateEpilogue,
  type ElementInfo,
  type GeneratingRelation,
  type ControllingRelation
} from './poeticExpressions';

// 전문 명리학 용어 시스템
export {
  DAY_MASTER_PROFESSIONAL,
  STRATEGIC_ADVICE,
  getMonthlyTaboo,
  generateIdentityTitle,
  getHiddenTraitMessage,
  calculateGoldenTimes,
  generateFortunePrescriptions,
  type DayMasterProfessional,
  type StrategicAdvice,
  type MonthlyTaboo,
  type IdentityTitle,
  type GoldenTime,
  type FortunePrescription
} from './professionalTerms';

// 차별화된 콘텐츠 시스템 (사주+MBTI+별자리+혈액형 통합)
export {
  generateTraitAnalysis,
  generateMonthlyFortune,
  generateGrowthStrategy,
  generateFamilyAdvice,
  generateBloodTypeIntegration,
  DIFFERENTIATION_POINTS,
  type TraitAnalysis,
  type MonthlyFortune,
  type GrowthStrategy,
  type FamilyAdvice
} from './differentiatedContent';
