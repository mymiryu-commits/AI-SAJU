// 사주 심볼 카드 시스템 타입 정의

export type CardStyle = 'minimal' | 'traditional' | 'fantasy' | 'luxury';

// 본질 카드 (꽃) - 일간 기반
export interface EssenceCard {
  id: string;
  dayMaster: string;          // 일간 (갑, 을, 병, 정, 무, 기, 경, 신, 임, 계)
  flower: string;             // 꽃 이름
  flowerKorean: string;       // 꽃 한글명
  keywords: string[];         // 핵심 키워드 3개
  story: string;              // 스토리텔링 설명
  imageKey: string;           // 이미지 키
  color: string;              // 대표 색상
}

// 에너지 카드 (동물) - 용신 기반
export interface EnergyCard {
  id: string;
  yongsin: string;            // 용신 오행 (목, 화, 토, 금, 수)
  animal: string;             // 동물 이름
  animalKorean: string;       // 동물 한글명
  keywords: string[];         // 핵심 키워드 3개
  story: string;              // 스토리텔링 설명
  imageKey: string;
  color: string;
  subAnimals: {               // 보조 동물 (연령/성별 분기)
    young: string;
    mature: string;
  };
}

// 재능 카드 (나무) - 주요 십신 기반
export interface TalentCard {
  id: string;
  sipsin: string;             // 십신 (비견, 겁재, 식신, 상관, 편재, 정재, 편관, 정관, 편인, 정인)
  tree: string;               // 나무 이름
  treeKorean: string;         // 나무 한글명
  keywords: string[];         // 핵심 키워드 3개
  story: string;              // 스토리텔링 설명
  imageKey: string;
  color: string;
}

// 흐름 카드 (자연현상) - 연운 기반
export interface FlowCard {
  id: string;
  flowType: 'rising' | 'peak' | 'adjusting' | 'dormant' | 'harvest' | 'transition' | 'challenge' | 'recovery';
  phenomenon: string;         // 자연현상 이름
  phenomenonKorean: string;   // 자연현상 한글명
  keywords: string[];         // 핵심 키워드 3개
  story: string;              // 스토리텔링 설명
  imageKey: string;
  color: string;
  monthRange?: string;        // 해당 월 범위
}

// 행운 카드 (숫자) - 복합 산출
export interface FortuneCard {
  id: string;
  luckyNumbers: number[];     // 행운의 숫자 2개
  luckyMonths: number[];      // 행운의 달
  luckyDirection: string;     // 행운의 방위
  luckyColor: string;         // 행운의 색상
  story: string;              // 스토리텔링 설명
  imageKey: string;
}

// 수호 카드 (보석) - 용신 + 일간 조합
export interface GuardianCard {
  id: string;
  mainGem: string;            // 메인 보석 (용신 기반)
  mainGemKorean: string;      // 보석 한글명
  subGem: string;             // 서브 보석 (일간 기반)
  subGemKorean: string;       // 서브 보석 한글명
  keywords: string[];         // 핵심 키워드 3개
  story: string;              // 스토리텔링 설명
  imageKey: string;
  color: string;
}

// 전체 카드 덱
export interface CardDeck {
  essence: EssenceCard;       // 본질 (꽃)
  energy: EnergyCard;         // 에너지 (동물)
  talent: TalentCard;         // 재능 (나무)
  flow: FlowCard;             // 흐름 (자연현상)
  fortune: FortuneCard;       // 행운 (숫자)
  guardian: GuardianCard;     // 수호 (보석)
  generatedAt: string;        // 생성 시간
  style: CardStyle;           // 카드 스타일
}

// 과거 검증 시스템
export interface PastVerification {
  period: string;             // 검증 기간 (예: "2020년 하반기 ~ 2021년 상반기")
  prediction: string;         // 예측 내용
  keywords: string[];         // 관련 키워드
  confidence: number;         // 신뢰도 (0-100)
  category: 'career' | 'relationship' | 'health' | 'finance' | 'decision' | 'environment';
}

// 연간 타임라인
export interface YearlyTimeline {
  year: number;
  periods: TimelinePeriod[];
  keyMessage: string;         // 올해 핵심 메시지
  story: string;              // 스토리텔링 설명
}

export interface TimelinePeriod {
  months: string;             // 예: "1-2월"
  phase: 'preparation' | 'rising' | 'adjustment' | 'dormant' | 'harvest' | 'closing';
  phaseKorean: string;        // 예: "준비기"
  score: number;              // 0-100
  description: string;        // 설명
  highlight?: boolean;        // 중요 시기 여부
  actions: string[];          // 추천 행동
}

// 스토리텔링 분석 결과
export interface StorytellingAnalysis {
  // 과거 검증 (신뢰 형성)
  pastVerifications: PastVerification[];

  // 카드 덱
  cardDeck: CardDeck;

  // 연간 타임라인
  yearlyTimeline: YearlyTimeline;

  // 한 줄 운명
  destinyLine: string;

  // 전체 스토리 (4막 구조)
  fullStory: {
    opening: string;          // 1막: 과거 (신뢰 형성)
    development: string;      // 2막: 현재 (공감)
    climax: string;           // 3막: 미래 (가치)
    resolution: string;       // 4막: 행동 (CTA)
  };
}

// 카드 이미지 생성 설정
export interface CardImageConfig {
  elements: {
    flower: string;
    animal: string;
    tree: string;
    nature: string;
    numbers: number[];
    gem: string;
  };
  style: CardStyle;
  userName: string;
  birthDate: string;
  dayMaster: string;
}

// 카드 이미지 출력
export interface CardImageOutput {
  deckImageUrl: string;       // 6장 덱 전체 이미지
  individualCards: {
    essence: string;
    energy: string;
    talent: string;
    flow: string;
    fortune: string;
    guardian: string;
  };
  phoneWallpaper: string;     // 폰 배경 (9:16)
  squareVersion: string;      // 공유용 (1:1)
  talismanImage: string;      // 부적 이미지
}
