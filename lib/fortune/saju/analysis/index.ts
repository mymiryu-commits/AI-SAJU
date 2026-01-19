/**
 * 사주 분석 모듈 통합 내보내기
 */

// 또래 비교
export {
  calculatePeerComparison,
  generateDetailedPeerAnalysis
} from './peerComparison';

// 가족 영향
export {
  analyzeFamilyImpact,
  analyzeSpouseCompatibility
} from './familyImpact';

// 직업 매칭
export {
  analyzeCareerMatch,
  recommendCareerTypes
} from './careerMatch';

// 다자간 궁합
export {
  analyzeGroupCompatibility,
  generateGroupSummary
} from './groupCompatibility';

// 액션플랜 생성
export {
  generateMonthlyActionPlan,
  generateLifeTimeline,
  generateTimingAnalysis,
  generateInterestStrategies
} from './actionGenerator';

// 별자리 분석
export {
  getZodiacSign,
  getZodiacInfo,
  analyzeZodiacSajuHarmony,
  generateZodiacAnalysis,
  ZODIAC_SIGNS,
  type ZodiacSign,
  type ZodiacAnalysis
} from './zodiacAnalysis';

// 종합 분석 (혈액형+MBTI+사주+별자리)
export {
  generateComprehensiveAnalysis,
  BLOOD_TYPE_TRAITS,
  DAY_MASTER_TRAITS,
  type ComprehensiveAnalysis
} from './comprehensiveAnalysis';

// 십신 분석
export {
  type SipsinType,
  type SipsinInfo,
  type SipsinChart,
  type SipsinInterpretation,
  SIPSIN_INFO,
  analyzeSipsin,
  interpretSipsinChart
} from './sipsin';

// 신살 분석
export {
  type SinsalType,
  type SinsalInfo,
  type SinsalResult,
  type SinsalAnalysis,
  SINSAL_INFO,
  analyzeSinsal
} from './sinsal';

// 12운성 분석
export {
  type UnsungType,
  type UnsungInfo,
  type UnsungPosition,
  type UnsungAnalysis,
  UNSUNG_INFO,
  analyzeUnsung,
  getUnsungForBranch
} from './unsung';

// 합충형파해 분석
export {
  type RelationType,
  type BranchRelation,
  type HapChungAnalysis,
  analyzeHapChung,
  checkBranchRelation,
  checkSamhap
} from './hapchung';
