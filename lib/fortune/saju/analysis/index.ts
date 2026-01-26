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

// 동물 DNA 분석
export {
  calculateSajuAnimal,
  calculateMbtiAnimal,
  compareAnimalDna,
  analyzeAnimalCompatibility,
  ANIMAL_PROFILES,
  ANIMAL_COMPATIBILITY,
  ANIMAL_TYPES,
  type AnimalType,
  type AnimalProfile,
  type AnimalDnaComparison
} from './animalDna';
