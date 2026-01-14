/**
 * 사주 분석 라이브러리 통합 내보내기
 *
 * 사용법:
 * import { calculateSaju, analyzeOheng, calculatePeerComparison } from '@/lib/fortune/saju/newIndex';
 */

// 사주 계산기
export {
  calculateSaju,
  calculateAge,
  calculateKoreanAge,
  calculateDaeun,
  calculateSeun,
  calculateWolun,
  HEAVENLY_STEMS,
  HEAVENLY_STEMS_KO,
  EARTHLY_BRANCHES,
  EARTHLY_BRANCHES_KO,
  STEM_ELEMENTS,
  BRANCH_ELEMENTS,
  ZODIAC_NAMES,
  SIXTY_JIAZI
} from './calculator';

// 오행 분석
export {
  analyzeOheng,
  generateOhengActions,
  getLuckyColors,
  getLuckyDirections,
  getLuckyNumbers,
  getLuckyTimes,
  analyzeElementInteraction,
  getOhengChartData
} from './oheng';

// 분석 모듈
export {
  calculatePeerComparison,
  generateDetailedPeerAnalysis,
  analyzeFamilyImpact,
  analyzeSpouseCompatibility,
  analyzeCareerMatch,
  recommendCareerTypes,
  analyzeGroupCompatibility,
  generateGroupSummary,
  generateMonthlyActionPlan,
  generateLifeTimeline,
  generateTimingAnalysis,
  generateInterestStrategies
} from './analysis';

// 전환 문구
export {
  generateFreeToPaywallTemplate,
  generateTimingTemplate,
  generateFamilyTemplate,
  generatePeerTemplate,
  generateGroupTemplate,
  generateExitTemplate,
  generateFaceProtectionMessage,
  generateCoreMessage,
  generateUrgencyBanner,
  generateSocialProof,
  generateProductRecommendation,
  getTemplateVariant
} from './conversion';

// 타입 재내보내기
export type {
  UserInput,
  SajuChart,
  SajuPillar,
  OhengBalance,
  Element,
  AnalysisResult,
  PeerComparison,
  PersonalityAnalysis,
  CoreMessage,
  PremiumContent,
  FamilyImpact,
  CareerAnalysis,
  InterestStrategy,
  MonthlyAction,
  LifeTimeline,
  TimingAnalysis,
  GroupMember,
  GroupCompatibility,
  PairCompatibility,
  ConversionTemplate,
  CareerType,
  InterestType,
  ConcernType,
  RelationType
} from '@/types/saju';

// 상수 재내보내기
export {
  ELEMENT_KOREAN,
  CAREER_KOREAN,
  INTEREST_KOREAN,
  CONCERN_KOREAN,
  RELATION_KOREAN,
  PRODUCTS
} from '@/types/saju';

// 내보내기 (PDF/음성)
export {
  generateSajuPDF,
  generatePDFFilename,
  generatePDFSections,
  generateNarrationScript,
  narrationToText,
  generateSajuAudio,
  generateAudioFilename,
  generateAudioWithOpenAI,
  generateAudioWithGoogle,
  generateAudioWithNaver,
  type TTSProvider
} from './export';
