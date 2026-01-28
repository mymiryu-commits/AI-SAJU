/**
 * 관상학(Physiognomy) 분석 타입 정의
 * - 부위별 점수화 시스템
 * - 가중치 통합 점수
 * - 스토리텔링 기반 해석
 */

// ===== 부위 타입 =====
export type FacePartType = 'forehead' | 'eyes' | 'nose' | 'mouth' | 'chin' | 'ears';

export const FACE_PART_KOREAN: Record<FacePartType, string> = {
  forehead: '이마',
  eyes: '눈',
  nose: '코',
  mouth: '입',
  chin: '턱',
  ears: '귀',
};

// ===== 관상 특성 =====
export interface FaceFeatureShape {
  id: string;
  korean: string;
  description: string;
  fortuneType: 'positive' | 'neutral' | 'challenging';
}

// 이마 형태
export const FOREHEAD_SHAPES: Record<string, FaceFeatureShape> = {
  wide_high: { id: 'wide_high', korean: '넓고 높은 이마', description: '지성과 출세운', fortuneType: 'positive' },
  round: { id: 'round', korean: '둥근 이마', description: '원만한 대인관계', fortuneType: 'positive' },
  flat: { id: 'flat', korean: '평평한 이마', description: '안정적 성장', fortuneType: 'neutral' },
  narrow: { id: 'narrow', korean: '좁은 이마', description: '집중력과 전문성', fortuneType: 'neutral' },
  protruding: { id: 'protruding', korean: '돌출된 이마', description: '강한 추진력', fortuneType: 'positive' },
};

// 눈 형태
export const EYE_SHAPES: Record<string, FaceFeatureShape> = {
  phoenix: { id: 'phoenix', korean: '봉황눈', description: '귀인운과 리더십', fortuneType: 'positive' },
  dragon: { id: 'dragon', korean: '용눈', description: '강한 카리스마', fortuneType: 'positive' },
  almond: { id: 'almond', korean: '아몬드눈', description: '지혜와 통찰력', fortuneType: 'positive' },
  round: { id: 'round', korean: '둥근 눈', description: '순수함과 친화력', fortuneType: 'positive' },
  long: { id: 'long', korean: '긴 눈', description: '관찰력과 신중함', fortuneType: 'neutral' },
  small: { id: 'small', korean: '작은 눈', description: '집중력과 신중함', fortuneType: 'neutral' },
};

// 코 형태
export const NOSE_SHAPES: Record<string, FaceFeatureShape> = {
  straight: { id: 'straight', korean: '곧은 코', description: '정직과 원칙', fortuneType: 'positive' },
  high_bridge: { id: 'high_bridge', korean: '높은 콧대', description: '자존심과 성취욕', fortuneType: 'positive' },
  wide_wings: { id: 'wide_wings', korean: '넓은 콧볼', description: '재물복과 안정', fortuneType: 'positive' },
  rounded_tip: { id: 'rounded_tip', korean: '둥근 코끝', description: '재물 축적 능력', fortuneType: 'positive' },
  aquiline: { id: 'aquiline', korean: '매부리코', description: '사업수완과 야심', fortuneType: 'neutral' },
  button: { id: 'button', korean: '단추코', description: '낙천적 성격', fortuneType: 'neutral' },
};

// 입 형태
export const MOUTH_SHAPES: Record<string, FaceFeatureShape> = {
  cherry: { id: 'cherry', korean: '앵두입술', description: '연예운과 매력', fortuneType: 'positive' },
  full: { id: 'full', korean: '풍성한 입술', description: '표현력과 카리스마', fortuneType: 'positive' },
  thin: { id: 'thin', korean: '얇은 입술', description: '논리력과 분석력', fortuneType: 'neutral' },
  wide: { id: 'wide', korean: '넓은 입', description: '사교성과 적극성', fortuneType: 'positive' },
  upturned: { id: 'upturned', korean: '올라간 입꼬리', description: '긍정적 에너지', fortuneType: 'positive' },
  defined: { id: 'defined', korean: '뚜렷한 인중', description: '자녀운과 생명력', fortuneType: 'positive' },
};

// 턱 형태
export const CHIN_SHAPES: Record<string, FaceFeatureShape> = {
  square: { id: 'square', korean: '각진 턱', description: '결단력과 의지력', fortuneType: 'positive' },
  round: { id: 'round', korean: '둥근 턱', description: '인덕과 복록', fortuneType: 'positive' },
  pointed: { id: 'pointed', korean: '뾰족한 턱', description: '예리함과 창의력', fortuneType: 'neutral' },
  wide: { id: 'wide', korean: '넓은 턱', description: '안정감과 지구력', fortuneType: 'positive' },
  double: { id: 'double', korean: '이중턱', description: '재물복과 여유', fortuneType: 'positive' },
  cleft: { id: 'cleft', korean: '움푹 들어간 턱', description: '개성과 매력', fortuneType: 'neutral' },
};

// 귀 형태
export const EAR_SHAPES: Record<string, FaceFeatureShape> = {
  buddha: { id: 'buddha', korean: '부처귀', description: '지혜와 복덕', fortuneType: 'positive' },
  thick_lobe: { id: 'thick_lobe', korean: '두꺼운 귓불', description: '재물운과 장수', fortuneType: 'positive' },
  attached: { id: 'attached', korean: '붙은 귀', description: '실행력과 현실감', fortuneType: 'neutral' },
  detached: { id: 'detached', korean: '떨어진 귀', description: '독립심과 창의성', fortuneType: 'positive' },
  pointed: { id: 'pointed', korean: '뾰족한 귀', description: '직관력과 감수성', fortuneType: 'neutral' },
  large: { id: 'large', korean: '큰 귀', description: '복과 수명', fortuneType: 'positive' },
};

// ===== 부위별 분석 결과 =====
export interface FacePartAnalysis {
  part: FacePartType;
  partKorean: string;
  score: number;                    // 0-100
  shape: FaceFeatureShape;
  trait: string;                    // 핵심 특성
  meaning: string;                  // 상세 해석
  isStrength: boolean;              // 강점 여부 (85점 이상)
  isImprovement: boolean;           // 보완점 여부 (70점 미만)
  storytelling: string;             // 스토리텔링 설명
  examples?: string[];              // 예시 (유명인 등)
  confidence?: number;              // Vision API 신뢰도 (0-1)
}

// ===== 운세 예측 =====
export interface FaceFortuneScores {
  career: number;
  wealth: number;
  love: number;
  health: number;
  social: number;
}

export const FORTUNE_TYPE_KOREAN: Record<keyof FaceFortuneScores, string> = {
  career: '직업운',
  wealth: '재물운',
  love: '애정운',
  health: '건강운',
  social: '대인운',
};

// ===== 종합 분석 결과 =====
export interface FaceAnalysisResult {
  // 기본 정보
  analysisId: string;
  analyzedAt: string;

  // 부위별 분석
  features: {
    forehead: FacePartAnalysis;
    eyes: FacePartAnalysis;
    nose: FacePartAnalysis;
    mouth: FacePartAnalysis;
    chin: FacePartAnalysis;
    ears: FacePartAnalysis;
  };

  // 점수 시스템
  scores: {
    // 부위별 원점수
    partScores: Record<FacePartType, number>;
    // 가중치 적용 점수
    weightedScores: Record<FacePartType, number>;
    // 특별 보너스 (특출난 부위)
    bonusPoints: number;
    bonusReason?: string;
    // 종합 점수 (0-100)
    overallScore: number;
    // 운세별 점수
    fortuneScores: FaceFortuneScores;
  };

  // 강점/보완점
  highlights: {
    strengths: FacePartAnalysis[];       // 강점 부위 (85점 이상)
    improvements: FacePartAnalysis[];    // 보완점 (70점 미만)
    exceptional?: FacePartAnalysis;      // 특별히 뛰어난 부위 (95점 이상)
  };

  // 성격 분석
  personality: {
    coreTraits: string[];               // 핵심 성격 특성 (3-5개)
    hiddenPotential: string;            // 숨겨진 잠재력
    socialStyle: string;                // 대인관계 스타일
    decisionStyle: string;              // 의사결정 스타일
  };

  // 스토리텔링 해석
  storytelling: {
    opening: string;                    // 도입부 (호기심 유발)
    featureStory: string;               // 부위별 연결 스토리
    fortuneNarrative: string;           // 운세 이야기
    closingAdvice: string;              // 마무리 조언
    fullScript: string;                 // 전체 음성용 스크립트
  };

  // 전문가 조언
  advice: {
    career: string;
    relationship: string;
    wealth: string;
    lifestyle: string;
    lucky: {
      color: string;
      number: number;
      direction: string;
      time: string;
    };
  };

  // 음성 파일 정보 (TTS 생성 후)
  audio?: {
    url: string;
    duration: number;
    generatedAt: string;
  };

  // 분석 메타데이터
  metadata?: {
    useAI: boolean;                 // Vision API 사용 여부
    overallDescription?: string;    // Vision API 전체 인상 설명
  };
}

// ===== 가중치 설정 =====
export const FACE_PART_WEIGHTS: Record<FacePartType, number> = {
  forehead: 0.18,  // 이마: 18% - 지성, 초년운
  eyes: 0.22,      // 눈: 22% - 통찰력, 정신력 (가장 중요)
  nose: 0.20,      // 코: 20% - 재물운, 중년운
  mouth: 0.15,     // 입: 15% - 표현력, 대인관계
  chin: 0.13,      // 턱: 13% - 의지력, 말년운
  ears: 0.12,      // 귀: 12% - 복덕, 수명
};

// 운세별 부위 영향도
export const FORTUNE_PART_INFLUENCE: Record<keyof FaceFortuneScores, Record<FacePartType, number>> = {
  career: { forehead: 0.30, eyes: 0.30, nose: 0.15, mouth: 0.10, chin: 0.10, ears: 0.05 },
  wealth: { forehead: 0.10, eyes: 0.15, nose: 0.35, mouth: 0.10, chin: 0.15, ears: 0.15 },
  love: { forehead: 0.10, eyes: 0.35, nose: 0.10, mouth: 0.30, chin: 0.10, ears: 0.05 },
  health: { forehead: 0.15, eyes: 0.20, nose: 0.15, mouth: 0.10, chin: 0.15, ears: 0.25 },
  social: { forehead: 0.15, eyes: 0.30, nose: 0.10, mouth: 0.30, chin: 0.10, ears: 0.05 },
};

// ===== 등급 시스템 =====
export type FaceGrade = 'S' | 'A' | 'B' | 'C' | 'D';

export interface GradeInfo {
  grade: FaceGrade;
  korean: string;
  description: string;
  minScore: number;
  maxScore: number;
}

export const GRADE_INFO: GradeInfo[] = [
  { grade: 'S', korean: '최상', description: '타고난 복상', minScore: 90, maxScore: 100 },
  { grade: 'A', korean: '상', description: '좋은 관상', minScore: 80, maxScore: 89 },
  { grade: 'B', korean: '중상', description: '균형 잡힌 관상', minScore: 70, maxScore: 79 },
  { grade: 'C', korean: '중', description: '평범한 관상', minScore: 60, maxScore: 69 },
  { grade: 'D', korean: '하', description: '노력이 필요한 관상', minScore: 0, maxScore: 59 },
];

export function getGradeFromScore(score: number): GradeInfo {
  return GRADE_INFO.find(g => score >= g.minScore && score <= g.maxScore) || GRADE_INFO[4];
}

// ===== 유명인 예시 데이터 =====
export const CELEBRITY_EXAMPLES: Record<FacePartType, Record<string, string[]>> = {
  forehead: {
    wide_high: ['이순신', '세종대왕', '앨버트 아인슈타인'],
    round: ['유재석', '강호동'],
  },
  eyes: {
    phoenix: ['원빈', '송혜교'],
    dragon: ['이병헌', '전지현'],
    almond: ['김태희', '공유'],
  },
  nose: {
    straight: ['현빈', '수지'],
    high_bridge: ['정우성', '한가인'],
    wide_wings: ['마윈', '이건희'],
  },
  mouth: {
    cherry: ['아이유', '수지'],
    full: ['안젤리나 졸리', '송강'],
    wide: ['이순재', '차태현'],
  },
  chin: {
    square: ['이순신', '박정희'],
    round: ['정주영', '이건희'],
    wide: ['유재석', '안정환'],
  },
  ears: {
    buddha: ['부처', '공자'],
    thick_lobe: ['빌 게이츠', '워렌 버핏'],
    large: ['버락 오바마', '마크 저커버그'],
  },
};
