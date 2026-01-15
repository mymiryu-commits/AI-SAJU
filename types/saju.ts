// ===== 입력 타입 =====
export interface UserInput {
  // 필수
  name: string;
  birthDate: string;        // "1978-02-15"
  birthTime?: string;       // "13:30" or null
  gender: "male" | "female";
  calendar?: "solar" | "lunar";

  // 선택 (기본)
  bloodType?: "A" | "B" | "O" | "AB";
  mbti?: string;

  // 추가 입력
  careerType?: CareerType;
  careerLevel?: "entry" | "mid" | "senior" | "executive";
  yearsExp?: number;

  maritalStatus?: "single" | "married" | "divorced" | "remarried";
  hasChildren?: boolean;
  childrenAges?: number[];

  interests?: InterestType[];  // max 3
  currentConcern?: ConcernType;
}

// 직업 타입 (12개)
export type CareerType =
  | "business"      // 경영/사업가
  | "professional"  // 전문직
  | "finance"       // 금융/투자
  | "marketing"     // 마케팅/기획
  | "creative"      // 크리에이티브
  | "manufacturing" // 제조/기술직
  | "it"            // IT/개발
  | "education"     // 교육/연구
  | "service"       // 서비스/판매
  | "public"        // 공무원/공기업
  | "freelance"     // 프리랜서/1인기업
  | "jobseeker";    // 취준/전환기

// 관심사 타입 (15개)
export type InterestType =
  | "investment"    // 재테크/투자
  | "health"        // 건강/운동
  | "selfdev"       // 자기계발
  | "startup"       // 창업/사업
  | "romance"       // 연애/결혼
  | "parenting"     // 자녀교육
  | "career"        // 이직/커리어
  | "realestate"    // 부동산
  | "relationship"  // 인간관계
  | "hobby"         // 취미/여가
  | "emigration"    // 해외이주
  | "retirement"    // 은퇴설계
  | "mentalhealth"  // 정신건강
  | "family"        // 가족관계
  | "study";        // 학업/시험

// 고민 타입 (8개)
export type ConcernType =
  | "money"         // 돈/재정 문제
  | "career"        // 직장/커리어 고민
  | "romance"       // 연애/결혼 문제
  | "family"        // 가족 갈등
  | "health"        // 건강 걱정
  | "direction"     // 인생 방향 혼란
  | "relationship"  // 인간관계 스트레스
  | "none";         // 특별한 고민 없음

// ===== 사주 타입 =====
export interface SajuPillar {
  heavenlyStem: string;   // 천간 (甲乙丙丁...)
  earthlyBranch: string;  // 지지 (子丑寅卯...)
  stemKorean: string;     // 천간 한글
  branchKorean: string;   // 지지 한글
  element: Element;       // 오행
  zodiac: string;         // 띠
}

export interface SajuChart {
  year: SajuPillar;
  month: SajuPillar;
  day: SajuPillar;
  time?: SajuPillar;
}

export type Element = "wood" | "fire" | "earth" | "metal" | "water";

export interface OhengBalance {
  wood: number;
  fire: number;
  earth: number;
  metal: number;
  water: number;
}

// ===== 분석 결과 타입 =====
export interface AnalysisResult {
  // 기본 정보
  user: UserInput;
  saju: SajuChart;
  oheng: OhengBalance;

  // 점수
  scores: {
    overall: number;
    wealth: number;
    love: number;
    career: number;
    health: number;
  };

  // 용신/기신
  yongsin: Element[];
  gisin: Element[];

  // 성격 분석
  personality: PersonalityAnalysis;

  // 또래 비교 (무료)
  peerComparison: PeerComparison;

  // 핵심 메시지 (고민 기반)
  coreMessage: CoreMessage;

  // AI 분석 (OpenAI 생성)
  aiAnalysis?: AIAnalysis;

  // 프리미엄 컨텐츠 (유료)
  premium?: PremiumContent;
}

// AI 분석 결과
export interface AIAnalysis {
  personalityReading: string;
  fortuneAdvice: {
    overall: string;
    wealth: string;
    love: string;
    career: string;
    health: string;
  };
  lifePath: string;
  luckyElements: string;
  warningAdvice: string;
  // 전문가 수준 분석 (새 필드)
  dayMasterAnalysis?: string;      // 일주 분석
  tenYearFortune?: string;         // 대운 분석
  yearlyFortune?: string;          // 세운 (2026년 운세)
  monthlyFortune?: string;         // 월운 분석
  relationshipAnalysis?: string;   // 인연/대인관계 분석
  careerGuidance?: string;         // 직업 가이드
  wealthStrategy?: string;         // 재물 전략
  healthAdvice?: string;           // 건강 조언
  spiritualGuidance?: string;      // 영적/정신적 가이드
  actionPlan?: string[];           // 실천 액션플랜
}

export interface PeerComparison {
  careerMaturity: number;      // 상위 N%
  decisionStability: number;
  wealthManagement: number;
  riskExposure: "low" | "average" | "high";

  // 비교 문구
  summary: string;
}

export interface PersonalityAnalysis {
  // 사주 기반
  sajuTraits: string[];

  // MBTI 연동 (있을 경우)
  mbtiTraits?: string[];

  // 교차 분석
  crossAnalysis: {
    matchRate: number;        // 일치도
    synergy: string;          // 시너지 포인트
    conflict: string;         // 충돌 포인트
    resolution: string;       // 해결책
  };

  // 통합 키워드
  coreKeyword: string;        // "따뜻한 전략가"
}

export interface CoreMessage {
  concern: ConcernType;
  hook: string;               // 첫 화면 훅 메시지
  insight: string;            // 핵심 인사이트
  urgency: string;            // 긴급성 메시지
  cta: string;                // CTA 문구
}

// 프리미엄 컨텐츠
export interface PremiumContent {
  // 가족 영향 분석
  familyImpact?: FamilyImpact;

  // 직업 맞춤 분석
  careerAnalysis?: CareerAnalysis;

  // 관심사 맞춤 전략
  interestStrategies?: InterestStrategy[];

  // 월별 액션플랜
  monthlyActionPlan?: MonthlyAction[];

  // 인생 타임라인
  lifeTimeline?: LifeTimeline;

  // 타이밍 분석
  timingAnalysis?: TimingAnalysis;

  // 다자간 궁합 (새 기능)
  groupCompatibility?: GroupCompatibility;
}

export interface FamilyImpact {
  spouseStress: "low" | "medium" | "high";
  childrenImpact: "positive" | "neutral" | "negative";
  parentCare: string;

  warnings: string[];
  recommendations: string[];

  financialTimeline: {
    year: number;
    event: string;
    impact: string;
  }[];
}

export interface CareerAnalysis {
  matchScore: number;         // 직업-사주 매칭도
  synergy: string[];
  weakPoints: string[];
  solutions: string[];

  peerPosition: {
    techMaturity: number;
    leadershipPotential: number;
    burnoutRisk: "low" | "average" | "high";
  };

  optimalDirection: string;
  pivotTiming: string;
}

export interface InterestStrategy {
  interest: InterestType;
  priority: number;

  sajuAlignment: number;      // 사주 적합도
  timing: string;             // 최적 시기

  doList: string[];
  dontList: string[];

  specificAdvice: string;
}

export interface MonthlyAction {
  month: number;              // 1-12
  monthName: string;          // 1월, 2월...
  score: number;

  mustDo: {
    category: string;
    action: string;
    optimalDays: number[];
    optimalTime: string;
  }[];

  mustAvoid: string[];

  luckyElements: {
    color: string;
    number: number;
    direction: string;
  };
}

export interface LifeTimeline {
  currentAge: number;

  phases: {
    ageRange: string;         // "48-52"
    phase: string;            // "재도약기"
    score: number;
    opportunities: string[];
    challenges: string[];
  }[];

  turningPoints: {
    age: number;
    year: number;
    event: string;
    importance: "critical" | "important" | "normal";
  }[];

  goldenWindows: {
    period: string;
    purpose: string;
    successRate: number;
  }[];
}

export interface TimingAnalysis {
  currentWindow: {
    isOpen: boolean;
    remainingDays: number;
    missedConsequence: string;
    recoveryTime: string;
  };

  nextOpportunity: {
    date: string;
    probability: number;
  };
}

// ===== 다자간 궁합 타입 (새 기능) =====
export type RelationType =
  | "family"        // 가족
  | "friend"        // 친구
  | "lover"         // 연인
  | "colleague"     // 동료
  | "potential"     // 썸남/썸녀
  | "business";     // 사업 파트너

export interface GroupMember {
  id: string;
  name: string;
  birthDate: string;
  birthTime?: string;
  gender: "male" | "female";
  relation: RelationType;
  saju?: SajuChart;
  oheng?: OhengBalance;
}

export interface PairCompatibility {
  member1Id: string;
  member2Id: string;
  member1Name: string;
  member2Name: string;

  overallScore: number;       // 0-100

  elementInteraction: {
    type: "상생" | "상극" | "비화" | "중화";
    description: string;
  };

  strengths: string[];
  challenges: string[];
  advice: string;

  bestActivities: string[];   // 함께 하면 좋은 활동
  avoidSituations: string[];  // 피해야 할 상황
}

export interface GroupCompatibility {
  members: GroupMember[];
  totalMembers: number;
  analysisDate: string;

  // 전체 그룹 분석
  groupDynamics: {
    overallHarmony: number;   // 0-100
    dominantElement: Element;
    missingElement: Element;
    groupStrength: string;
    groupWeakness: string;
  };

  // 개별 쌍 분석
  pairAnalyses: PairCompatibility[];

  // 역할 분석
  roleAssignments: {
    memberId: string;
    memberName: string;
    bestRole: string;         // "리더", "조율자", "실행자" 등
    contribution: string;
  }[];

  // 상생 협력 전략
  cooperationStrategies: {
    situation: string;
    strategy: string;
    keyPerson: string;
  }[];

  // 주의 사항
  conflictWarnings: {
    involvedMembers: string[];
    issue: string;
    prevention: string;
  }[];

  // 그룹 행운 요소
  groupLucky: {
    bestDay: string;
    bestTime: string;
    luckyColor: string;
    luckyNumber: number;
    luckyDirection: string;
  };
}

// ===== 결제 전환 타입 =====
export interface ConversionTemplate {
  type: "freeToPaywall" | "timing" | "family" | "peer" | "exit" | "group";

  headline: string;
  bullets: string[];
  urgency?: string;
  cta: string;

  discount?: {
    amount: number;
    expiresIn: number;        // hours
  };
}

// ===== 상품 타입 =====
export interface ProductType {
  id: string;
  name: string;
  price: number;
  originalPrice: number;
  features: string[];
  recommended?: boolean;
}

export const PRODUCTS: ProductType[] = [
  {
    id: "basic",
    name: "기본 분석",
    price: 9900,
    originalPrice: 12900,
    features: [
      "상세 성격 분석",
      "2026년 운세 분석",
      "월별 액션플랜",
      "PDF 리포트"
    ]
  },
  {
    id: "family",
    name: "가족 연결 분석",
    price: 29900,
    originalPrice: 39900,
    features: [
      "기본 분석 포함",
      "가족 영향 분석",
      "자녀 교육 타이밍",
      "가계 재정 타임라인"
    ]
  },
  {
    id: "premium",
    name: "프리미엄 분석",
    price: 49900,
    originalPrice: 69900,
    features: [
      "가족 연결 분석 포함",
      "인생 타임라인",
      "골든윈도우 분석",
      "음성 리포트"
    ],
    recommended: true
  },
  {
    id: "group",
    name: "다자간 궁합 분석",
    price: 39900,
    originalPrice: 59900,
    features: [
      "2~5인 동시 분석",
      "개별 궁합 분석",
      "그룹 역학 분석",
      "협력 전략 제공"
    ]
  },
  {
    id: "vip",
    name: "VIP 종합 분석",
    price: 99900,
    originalPrice: 149900,
    features: [
      "모든 분석 포함",
      "다자간 궁합 포함",
      "10년 타임라인",
      "전문가 상담 1회"
    ]
  }
];

// ===== 유틸리티 타입 =====
export interface AnalysisSession {
  id: string;
  userId?: string;
  input: UserInput;
  result?: AnalysisResult;
  createdAt: Date;
  paidProducts: string[];
}

// 한글 매핑
export const ELEMENT_KOREAN: Record<Element, string> = {
  wood: "목(木)",
  fire: "화(火)",
  earth: "토(土)",
  metal: "금(金)",
  water: "수(水)"
};

export const CAREER_KOREAN: Record<CareerType, string> = {
  business: "경영/사업가",
  professional: "전문직",
  finance: "금융/투자",
  marketing: "마케팅/기획",
  creative: "크리에이티브",
  manufacturing: "제조/기술직",
  it: "IT/개발",
  education: "교육/연구",
  service: "서비스/판매",
  public: "공무원/공기업",
  freelance: "프리랜서/1인기업",
  jobseeker: "취준/전환기"
};

export const INTEREST_KOREAN: Record<InterestType, string> = {
  investment: "재테크/투자",
  health: "건강/운동",
  selfdev: "자기계발",
  startup: "창업/사업",
  romance: "연애/결혼",
  parenting: "자녀교육",
  career: "이직/커리어",
  realestate: "부동산",
  relationship: "인간관계",
  hobby: "취미/여가",
  emigration: "해외이주",
  retirement: "은퇴설계",
  mentalhealth: "정신건강",
  family: "가족관계",
  study: "학업/시험"
};

export const CONCERN_KOREAN: Record<ConcernType, { label: string; emoji: string }> = {
  money: { label: "돈/재정 문제", emoji: "💰" },
  career: { label: "직장/커리어 고민", emoji: "💼" },
  romance: { label: "연애/결혼 문제", emoji: "💕" },
  family: { label: "가족 갈등", emoji: "👨‍👩‍👧" },
  health: { label: "건강 걱정", emoji: "🏥" },
  direction: { label: "인생 방향 혼란", emoji: "🧭" },
  relationship: { label: "인간관계 스트레스", emoji: "😤" },
  none: { label: "특별한 고민 없음", emoji: "😊" }
};

export const RELATION_KOREAN: Record<RelationType, string> = {
  family: "가족",
  friend: "친구",
  lover: "연인",
  colleague: "동료",
  potential: "썸남/썸녀",
  business: "사업 파트너"
};
