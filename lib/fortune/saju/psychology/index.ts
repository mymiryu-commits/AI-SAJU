/**
 * 심리 기반 스토리텔링 시스템
 *
 * 칼 융 원형 이론 + 에릭슨 발달 심리 + 감정 곡선 설계
 * 생애주기 맞춤형 4막 구조 스토리텔링
 */

// 생애주기 모듈
export {
  LIFECYCLE_DATA,
  getLifeStage,
  getLifecycleData,
  getGenderAdjustedMessage,
  getAgeConcernKeywords,
  getDayMasterLifeStageInsight,
  type LifeStage,
  type LifecycleData
} from './lifecycleStages';

// 융 원형 모듈
export {
  DAYMASTER_ARCHETYPE,
  ARCHETYPE_INFO,
  getArchetypeByDayMaster,
  generateArchetypeStory,
  getArchetypeShadowAndGrowth,
  getDestinyPhrase,
  analyzeArchetypeCombination,
  type JungianArchetype,
  type ArchetypeInfo
} from './jungianArchetypes';

// 스토리텔링 엔진
export {
  generatePsychologicalStory,
  generatePastMirrors,
  storyToText,
  storyToNarrationSections,
  getAgeSpecificAdvice,
  getAgeSpecificActions,
  type FourActStructure,
  type StoryAct,
  type PastMirror,
  type StorytellingOptions
} from './storytellingEngine';
