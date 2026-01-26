// 사주 심볼 카드 시스템 모듈
// 스토리텔링 기반의 감성적 분석 제공

// 타입 내보내기
export type {
  CardDeck,
  EssenceCard,
  EnergyCard,
  TalentCard,
  FlowCard,
  FortuneCard,
  GuardianCard,
  CardStyle,
  PastVerification,
  YearlyTimeline,
  TimelinePeriod,
  StorytellingAnalysis,
  CardImageConfig,
  CardImageOutput
} from '@/types/cards';

// 카드 데이터
export {
  ESSENCE_CARDS,
  ENERGY_CARDS,
  TALENT_CARDS,
  FLOW_CARDS,
  MAIN_GEM_BY_YONGSIN,
  SUB_GEM_BY_DAYMASTER,
  LUCKY_NUMBERS_BY_ELEMENT,
  LUCKY_DIRECTION_BY_ELEMENT,
  LUCKY_COLOR_BY_ELEMENT,
  TIMELINE_PHASES,
  generateGuardianStory
} from './cardData';

// 카드 생성
export {
  generateCardDeck,
  generateCardDeckSummary,
  getCardDescription,
  generateCardImagePrompt
} from './cardGenerator';

// 과거 검증
export {
  generatePastVerifications,
  generateVerificationResponse,
  calculateOverallConfidence
} from './pastVerification';

// 스토리텔링
export {
  generateStorytellingAnalysis,
  generateYearlyTimeline,
  generateDestinyLine,
  generateFullStory,
  convertToSajuNarrative,
  generateEmotionalHook,
  generatePositiveReframe
} from './storytelling';
