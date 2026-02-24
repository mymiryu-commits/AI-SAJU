/**
 * AI 동물 DNA 분석 시스템
 * 사주 오행 기반 동물 유형 매칭
 */

// 동물 유형 정의 (16종 MVP)
export type AnimalType =
  | 'fox' | 'deer' | 'tiger' | 'dragon'      // 木 계열
  | 'eagle' | 'lion' | 'phoenix' | 'snake'   // 火 계열
  | 'bear' | 'ox' | 'elephant' | 'wolf'      // 土/金 계열
  | 'dolphin' | 'turtle' | 'whale' | 'swan'; // 水 계열

// 오행 타입
export type FiveElement = '木' | '火' | '土' | '金' | '水';

// 동물 정보 인터페이스
export interface AnimalInfo {
  id: AnimalType;
  name: string;
  nameEn: string;
  emoji: string;
  element: FiveElement;
  subElement?: FiveElement;
  title: string;           // 별칭 (예: "전략적 여우")
  description: string;     // 한 줄 설명
  traits: {
    observation: number;   // 관찰력 (0-100)
    adaptability: number;  // 적응력
    independence: number;  // 독립성
    leadership: number;    // 리더십
    creativity: number;    // 창의성
    stability: number;     // 안정성
  };
  strengths: string[];     // 강점
  weaknesses: string[];    // 약점
  bestMatch: AnimalType[]; // 궁합 동물
  worstMatch: AnimalType[];// 상극 동물
  careerFit: string[];     // 적합 직업
  loveStyle: string;       // 연애 스타일
}

// 16종 동물 데이터베이스
export const ANIMAL_DATABASE: Record<AnimalType, AnimalInfo> = {
  // ===== 木 계열 (성장, 창의, 유연) =====
  fox: {
    id: 'fox',
    name: '여우',
    nameEn: 'Fox',
    emoji: '🦊',
    element: '木',
    subElement: '水',
    title: '전략적 여우',
    description: '날카로운 직관과 뛰어난 적응력으로 어떤 상황도 헤쳐나가는 전략가',
    traits: {
      observation: 92,
      adaptability: 88,
      independence: 85,
      leadership: 65,
      creativity: 78,
      stability: 45,
    },
    strengths: ['뛰어난 상황 판단력', '유연한 사고방식', '위기 대처 능력'],
    weaknesses: ['지나친 경계심', '신뢰 형성에 시간 필요', '혼자 해결하려는 성향'],
    bestMatch: ['eagle', 'wolf', 'dragon'],
    worstMatch: ['ox', 'elephant'],
    careerFit: ['전략기획', '마케팅', '투자', '협상가'],
    loveStyle: '천천히 마음을 여는 신중파, 한번 믿으면 깊은 헌신',
  },
  deer: {
    id: 'deer',
    name: '사슴',
    nameEn: 'Deer',
    emoji: '🦌',
    element: '木',
    subElement: '土',
    title: '순수한 사슴',
    description: '온화하고 섬세한 감성으로 주변을 치유하는 힐러',
    traits: {
      observation: 75,
      adaptability: 70,
      independence: 55,
      leadership: 40,
      creativity: 82,
      stability: 68,
    },
    strengths: ['높은 공감능력', '예술적 감각', '순수한 마음'],
    weaknesses: ['상처받기 쉬움', '우유부단함', '갈등 회피'],
    bestMatch: ['turtle', 'swan', 'bear'],
    worstMatch: ['tiger', 'lion'],
    careerFit: ['예술가', '상담사', '교육자', '디자이너'],
    loveStyle: '로맨틱하고 헌신적, 감정 교류 중시',
  },
  tiger: {
    id: 'tiger',
    name: '호랑이',
    nameEn: 'Tiger',
    emoji: '🐯',
    element: '木',
    subElement: '火',
    title: '용맹한 호랑이',
    description: '강인한 의지와 카리스마로 앞장서서 이끄는 리더',
    traits: {
      observation: 70,
      adaptability: 60,
      independence: 90,
      leadership: 95,
      creativity: 65,
      stability: 55,
    },
    strengths: ['강력한 리더십', '결단력', '용기와 추진력'],
    weaknesses: ['독선적 성향', '참을성 부족', '타협 어려움'],
    bestMatch: ['dragon', 'eagle', 'wolf'],
    worstMatch: ['fox', 'snake'],
    careerFit: ['CEO', '군인', '운동선수', '정치인'],
    loveStyle: '주도적이고 보호적, 열정적인 표현',
  },
  dragon: {
    id: 'dragon',
    name: '용',
    nameEn: 'Dragon',
    emoji: '🐉',
    element: '木',
    subElement: '火',
    title: '신비로운 용',
    description: '비범한 카리스마와 창의력으로 세상을 변화시키는 혁신가',
    traits: {
      observation: 80,
      adaptability: 75,
      independence: 88,
      leadership: 92,
      creativity: 95,
      stability: 50,
    },
    strengths: ['탁월한 창의력', '강한 야망', '카리스마'],
    weaknesses: ['완벽주의', '현실과의 괴리', '자만심'],
    bestMatch: ['phoenix', 'tiger', 'eagle'],
    worstMatch: ['turtle', 'ox'],
    careerFit: ['창업가', '예술감독', '발명가', '작가'],
    loveStyle: '이상적인 사랑 추구, 드라마틱한 로맨스',
  },

  // ===== 火 계열 (열정, 에너지, 확장) =====
  eagle: {
    id: 'eagle',
    name: '독수리',
    nameEn: 'Eagle',
    emoji: '🦅',
    element: '火',
    subElement: '金',
    title: '날카로운 독수리',
    description: '넓은 시야와 정확한 판단력으로 목표를 향해 직진하는 사냥꾼',
    traits: {
      observation: 98,
      adaptability: 65,
      independence: 92,
      leadership: 78,
      creativity: 60,
      stability: 70,
    },
    strengths: ['뛰어난 통찰력', '집중력', '목표 지향적'],
    weaknesses: ['고독함', '완고함', '세부사항 놓침'],
    bestMatch: ['fox', 'tiger', 'wolf'],
    worstMatch: ['deer', 'swan'],
    careerFit: ['분석가', '파일럿', '외과의사', 'CEO'],
    loveStyle: '신중하게 선택, 한번 결정하면 충실함',
  },
  lion: {
    id: 'lion',
    name: '사자',
    nameEn: 'Lion',
    emoji: '🦁',
    element: '火',
    subElement: '土',
    title: '당당한 사자',
    description: '왕의 품격으로 모두를 이끄는 타고난 지도자',
    traits: {
      observation: 72,
      adaptability: 55,
      independence: 85,
      leadership: 98,
      creativity: 58,
      stability: 75,
    },
    strengths: ['압도적 리더십', '자신감', '보호본능'],
    weaknesses: ['자존심', '권위적 성향', '칭찬 욕구'],
    bestMatch: ['phoenix', 'elephant', 'bear'],
    worstMatch: ['fox', 'snake'],
    careerFit: ['경영자', '정치인', '연예인', '변호사'],
    loveStyle: '왕자/공주 대우 기대, 관대하고 로맨틱',
  },
  phoenix: {
    id: 'phoenix',
    name: '봉황',
    nameEn: 'Phoenix',
    emoji: '🔥',
    element: '火',
    subElement: '木',
    title: '불사조 봉황',
    description: '역경을 딛고 일어서는 불굴의 의지를 가진 재생의 상징',
    traits: {
      observation: 78,
      adaptability: 92,
      independence: 80,
      leadership: 85,
      creativity: 90,
      stability: 45,
    },
    strengths: ['회복력', '변화 수용', '영감을 주는 힘'],
    weaknesses: ['극단적 성향', '안정 추구 부족', '번아웃 위험'],
    bestMatch: ['dragon', 'lion', 'eagle'],
    worstMatch: ['turtle', 'ox'],
    careerFit: ['예술가', '혁신가', '치료사', '종교인'],
    loveStyle: '격정적이고 변화무쌍, 깊은 영혼의 연결 추구',
  },
  snake: {
    id: 'snake',
    name: '뱀',
    nameEn: 'Snake',
    emoji: '🐍',
    element: '火',
    subElement: '水',
    title: '지혜로운 뱀',
    description: '깊은 통찰력과 신비로운 매력으로 사람을 사로잡는 현자',
    traits: {
      observation: 95,
      adaptability: 80,
      independence: 88,
      leadership: 60,
      creativity: 85,
      stability: 65,
    },
    strengths: ['깊은 지혜', '직관력', '신비로운 매력'],
    weaknesses: ['의심 많음', '질투심', '비밀주의'],
    bestMatch: ['fox', 'dolphin', 'owl' as AnimalType],
    worstMatch: ['tiger', 'lion'],
    careerFit: ['심리학자', '연구원', '철학자', '금융전문가'],
    loveStyle: '신비롭고 깊은 관계, 소유욕 강함',
  },

  // ===== 土/金 계열 (안정, 신뢰, 힘) =====
  bear: {
    id: 'bear',
    name: '곰',
    nameEn: 'Bear',
    emoji: '🐻',
    element: '土',
    subElement: '木',
    title: '포근한 곰',
    description: '든든한 보호자로서 가족과 동료를 지키는 수호자',
    traits: {
      observation: 65,
      adaptability: 55,
      independence: 70,
      leadership: 72,
      creativity: 50,
      stability: 95,
    },
    strengths: ['신뢰감', '인내심', '보호본능'],
    weaknesses: ['느린 적응', '고집', '변화 거부'],
    bestMatch: ['deer', 'turtle', 'elephant'],
    worstMatch: ['phoenix', 'dragon'],
    careerFit: ['공무원', '요리사', '보안전문가', '농부'],
    loveStyle: '헌신적이고 안정적, 행동으로 사랑 표현',
  },
  ox: {
    id: 'ox',
    name: '황소',
    nameEn: 'Ox',
    emoji: '🐂',
    element: '土',
    subElement: '金',
    title: '묵묵한 황소',
    description: '성실함과 끈기로 목표를 향해 꾸준히 나아가는 노력가',
    traits: {
      observation: 60,
      adaptability: 40,
      independence: 75,
      leadership: 65,
      creativity: 45,
      stability: 98,
    },
    strengths: ['성실함', '끈기', '책임감'],
    weaknesses: ['융통성 부족', '고집', '변화 적응 어려움'],
    bestMatch: ['turtle', 'bear', 'elephant'],
    worstMatch: ['fox', 'dragon'],
    careerFit: ['회계사', '엔지니어', '장인', '농업인'],
    loveStyle: '느리지만 확실한 사랑, 한결같은 헌신',
  },
  elephant: {
    id: 'elephant',
    name: '코끼리',
    nameEn: 'Elephant',
    emoji: '🐘',
    element: '土',
    subElement: '水',
    title: '지혜로운 코끼리',
    description: '깊은 기억력과 지혜로 가족을 이끄는 현명한 어른',
    traits: {
      observation: 78,
      adaptability: 50,
      independence: 60,
      leadership: 80,
      creativity: 55,
      stability: 92,
    },
    strengths: ['기억력', '가족애', '지혜'],
    weaknesses: ['감정 축적', '느린 변화', '집착'],
    bestMatch: ['lion', 'bear', 'turtle'],
    worstMatch: ['fox', 'phoenix'],
    careerFit: ['교수', '판사', '역사가', '상담가'],
    loveStyle: '가족 중심적, 깊고 오래가는 사랑',
  },
  wolf: {
    id: 'wolf',
    name: '늑대',
    nameEn: 'Wolf',
    emoji: '🐺',
    element: '金',
    subElement: '木',
    title: '충직한 늑대',
    description: '강한 유대감과 팀워크로 무리를 이끄는 충성스러운 전사',
    traits: {
      observation: 85,
      adaptability: 75,
      independence: 65,
      leadership: 82,
      creativity: 60,
      stability: 78,
    },
    strengths: ['충성심', '팀워크', '전략적 사고'],
    weaknesses: ['배타성', '복수심', '무리 의존'],
    bestMatch: ['fox', 'eagle', 'tiger'],
    worstMatch: ['deer', 'swan'],
    careerFit: ['군인', '경찰', '스포츠팀', '프로젝트 매니저'],
    loveStyle: '충성스럽고 보호적, 파트너에게 전적인 헌신',
  },

  // ===== 水 계열 (지혜, 유연, 깊이) =====
  dolphin: {
    id: 'dolphin',
    name: '돌고래',
    nameEn: 'Dolphin',
    emoji: '🐬',
    element: '水',
    subElement: '火',
    title: '사교적인 돌고래',
    description: '밝은 에너지와 소통 능력으로 모두를 즐겁게 하는 엔터테이너',
    traits: {
      observation: 72,
      adaptability: 90,
      independence: 55,
      leadership: 60,
      creativity: 88,
      stability: 58,
    },
    strengths: ['소통능력', '유머감각', '긍정 에너지'],
    weaknesses: ['진지함 부족', '산만함', '깊이 부족'],
    bestMatch: ['swan', 'phoenix', 'deer'],
    worstMatch: ['ox', 'bear'],
    careerFit: ['방송인', '영업직', '이벤트 기획', '교사'],
    loveStyle: '밝고 유쾌한 관계, 소통과 재미 중시',
  },
  turtle: {
    id: 'turtle',
    name: '거북이',
    nameEn: 'Turtle',
    emoji: '🐢',
    element: '水',
    subElement: '土',
    title: '현명한 거북이',
    description: '느리지만 꾸준한 지혜로 결국 목표에 도달하는 현자',
    traits: {
      observation: 82,
      adaptability: 45,
      independence: 85,
      leadership: 55,
      creativity: 60,
      stability: 98,
    },
    strengths: ['인내심', '지혜', '장기적 관점'],
    weaknesses: ['느린 속도', '소극적', '기회 놓침'],
    bestMatch: ['bear', 'ox', 'elephant'],
    worstMatch: ['dragon', 'phoenix'],
    careerFit: ['학자', '명상가', '장인', '투자자'],
    loveStyle: '천천히 깊어지는 사랑, 평생의 동반자 추구',
  },
  whale: {
    id: 'whale',
    name: '고래',
    nameEn: 'Whale',
    emoji: '🐋',
    element: '水',
    subElement: '木',
    title: '대범한 고래',
    description: '깊은 내면과 넓은 포용력으로 모두를 품는 바다의 왕',
    traits: {
      observation: 75,
      adaptability: 70,
      independence: 80,
      leadership: 75,
      creativity: 78,
      stability: 85,
    },
    strengths: ['포용력', '깊은 감성', '평화 추구'],
    weaknesses: ['고독감', '현실 도피', '무거운 감정'],
    bestMatch: ['turtle', 'elephant', 'deer'],
    worstMatch: ['eagle', 'lion'],
    careerFit: ['음악가', '작가', '심리상담사', '사회복지사'],
    loveStyle: '깊고 영적인 연결, 말없이 통하는 관계',
  },
  swan: {
    id: 'swan',
    name: '백조',
    nameEn: 'Swan',
    emoji: '🦢',
    element: '水',
    subElement: '金',
    title: '우아한 백조',
    description: '기품 있는 아름다움과 순수함으로 주변을 빛나게 하는 존재',
    traits: {
      observation: 70,
      adaptability: 65,
      independence: 72,
      leadership: 50,
      creativity: 92,
      stability: 68,
    },
    strengths: ['우아함', '미적 감각', '순수함'],
    weaknesses: ['예민함', '허영심', '현실 부적응'],
    bestMatch: ['deer', 'dolphin', 'whale'],
    worstMatch: ['wolf', 'eagle'],
    careerFit: ['무용가', '모델', '플로리스트', '큐레이터'],
    loveStyle: '동화 같은 사랑, 아름다운 로맨스 추구',
  },
};

// 오행 기반 동물 매칭 로직
interface SajuElements {
  yearStem: string;  // 연간
  monthStem: string; // 월간
  dayStem: string;   // 일간 (가장 중요)
  hourStem: string;  // 시간
}

// 천간 → 오행 매핑
const STEM_TO_ELEMENT: Record<string, FiveElement> = {
  '甲': '木', '乙': '木',
  '丙': '火', '丁': '火',
  '戊': '土', '己': '土',
  '庚': '金', '辛': '金',
  '壬': '水', '癸': '水',
};

// 천간 → 음양 매핑
const STEM_TO_YINYANG: Record<string, 'yang' | 'yin'> = {
  '甲': 'yang', '乙': 'yin',
  '丙': 'yang', '丁': 'yin',
  '戊': 'yang', '己': 'yin',
  '庚': 'yang', '辛': 'yin',
  '壬': 'yang', '癸': 'yin',
};

// 오행별 동물 그룹
const ELEMENT_ANIMALS: Record<FiveElement, AnimalType[]> = {
  '木': ['fox', 'deer', 'tiger', 'dragon'],
  '火': ['eagle', 'lion', 'phoenix', 'snake'],
  '土': ['bear', 'ox', 'elephant', 'wolf'],
  '金': ['wolf', 'eagle', 'swan', 'tiger'],
  '水': ['dolphin', 'turtle', 'whale', 'swan'],
};

// 주 오행 + 부 오행 조합으로 동물 결정
const ELEMENT_COMBINATION_MAP: Record<string, AnimalType> = {
  // 木 주 오행
  '木_木': 'tiger',
  '木_火': 'dragon',
  '木_土': 'deer',
  '木_金': 'fox',
  '木_水': 'fox',

  // 火 주 오행
  '火_木': 'phoenix',
  '火_火': 'lion',
  '火_土': 'lion',
  '火_金': 'eagle',
  '火_水': 'snake',

  // 土 주 오행
  '土_木': 'bear',
  '土_火': 'elephant',
  '土_土': 'ox',
  '土_金': 'ox',
  '土_水': 'elephant',

  // 金 주 오행
  '金_木': 'wolf',
  '金_火': 'eagle',
  '金_土': 'ox',
  '金_金': 'wolf',
  '金_水': 'swan',

  // 水 주 오행
  '水_木': 'whale',
  '水_火': 'dolphin',
  '水_土': 'turtle',
  '水_金': 'swan',
  '水_水': 'turtle',
};

/**
 * 사주 정보로 동물 DNA 분석
 */
export function analyzeAnimalDna(
  birthYear: number,
  birthMonth: number,
  birthDay: number,
  birthHour?: number
): {
  animal: AnimalInfo;
  mainElement: FiveElement;
  subElement: FiveElement;
  yinYang: 'yang' | 'yin';
  compatibility: AnimalType[];
  incompatibility: AnimalType[];
} {
  // 간단한 일간 계산 (실제로는 만세력 사용)
  const dayStem = calculateDayStem(birthYear, birthMonth, birthDay);
  const monthStem = calculateMonthStem(birthYear, birthMonth);

  const mainElement = STEM_TO_ELEMENT[dayStem] || '木';
  const subElement = STEM_TO_ELEMENT[monthStem] || '火';
  const yinYang = STEM_TO_YINYANG[dayStem] || 'yang';

  // 조합으로 동물 결정
  const combinationKey = `${mainElement}_${subElement}`;
  const animalType = ELEMENT_COMBINATION_MAP[combinationKey] || 'fox';
  const animal = ANIMAL_DATABASE[animalType];

  return {
    animal,
    mainElement,
    subElement,
    yinYang,
    compatibility: animal.bestMatch,
    incompatibility: animal.worstMatch,
  };
}

/**
 * 간단한 일간 계산 (간이 버전)
 * 실제 서비스에서는 정확한 만세력 데이터 사용
 */
function calculateDayStem(year: number, month: number, day: number): string {
  const stems = ['甲', '乙', '丙', '丁', '戊', '己', '庚', '辛', '壬', '癸'];

  // 간단한 계산 공식 (정확도 위해 만세력 라이브러리 권장)
  const baseDate = new Date(1900, 0, 1);
  const targetDate = new Date(year, month - 1, day);
  const diffDays = Math.floor((targetDate.getTime() - baseDate.getTime()) / (1000 * 60 * 60 * 24));

  // 1900년 1월 1일 = 甲子일
  const stemIndex = (diffDays % 10 + 10) % 10;
  return stems[stemIndex];
}

/**
 * 월간 계산 (간이 버전)
 */
function calculateMonthStem(year: number, month: number): string {
  const stems = ['甲', '乙', '丙', '丁', '戊', '己', '庚', '辛', '壬', '癸'];
  const yearStemIndex = (year - 4) % 10;
  const monthStemIndex = (yearStemIndex * 2 + month) % 10;
  return stems[monthStemIndex];
}

/**
 * 두 동물의 궁합 점수 계산
 */
export function calculateAnimalCompatibility(
  animal1: AnimalType,
  animal2: AnimalType
): {
  score: number;
  relationship: 'best' | 'good' | 'neutral' | 'bad' | 'worst';
  description: string;
} {
  const info1 = ANIMAL_DATABASE[animal1];
  const info2 = ANIMAL_DATABASE[animal2];

  let score = 50; // 기본 점수
  let relationship: 'best' | 'good' | 'neutral' | 'bad' | 'worst' = 'neutral';

  // 상성 체크
  if (info1.bestMatch.includes(animal2)) {
    score += 35;
    relationship = 'best';
  } else if (info1.worstMatch.includes(animal2)) {
    score -= 30;
    relationship = 'worst';
  }

  // 오행 상생/상극 체크
  const elementCompatibility = checkElementCompatibility(info1.element, info2.element);
  score += elementCompatibility;

  // 점수 범위 조정
  score = Math.max(10, Math.min(100, score));

  // 관계 세분화
  if (relationship === 'neutral') {
    if (score >= 70) relationship = 'good';
    else if (score <= 30) relationship = 'bad';
  }

  const descriptions: Record<string, string> = {
    best: `${info1.name}와(과) ${info2.name}은(는) 환상의 궁합! 서로를 완벽히 보완합니다.`,
    good: `${info1.name}와(과) ${info2.name}은(는) 좋은 관계를 형성할 수 있습니다.`,
    neutral: `${info1.name}와(과) ${info2.name}은(는) 무난한 관계입니다.`,
    bad: `${info1.name}와(과) ${info2.name}은(는) 노력이 필요한 관계입니다.`,
    worst: `${info1.name}와(과) ${info2.name}은(는) 서로 다른 길을 걸을 수 있습니다.`,
  };

  return {
    score,
    relationship,
    description: descriptions[relationship],
  };
}

/**
 * 오행 상생/상극 점수
 */
function checkElementCompatibility(element1: FiveElement, element2: FiveElement): number {
  // 상생 관계 (木→火→土→金→水→木)
  const generatingPairs: [FiveElement, FiveElement][] = [
    ['木', '火'], ['火', '土'], ['土', '金'], ['金', '水'], ['水', '木'],
  ];

  // 상극 관계 (木→土→水→火→金→木)
  const overcomingPairs: [FiveElement, FiveElement][] = [
    ['木', '土'], ['土', '水'], ['水', '火'], ['火', '金'], ['金', '木'],
  ];

  // 상생 체크
  for (const [a, b] of generatingPairs) {
    if ((element1 === a && element2 === b) || (element1 === b && element2 === a)) {
      return 15;
    }
  }

  // 상극 체크
  for (const [a, b] of overcomingPairs) {
    if (element1 === a && element2 === b) {
      return -15;
    }
    if (element1 === b && element2 === a) {
      return -10;
    }
  }

  // 같은 오행
  if (element1 === element2) {
    return 10;
  }

  return 0;
}

/**
 * 모든 동물 목록 반환
 */
export function getAllAnimals(): AnimalInfo[] {
  return Object.values(ANIMAL_DATABASE);
}

/**
 * 특정 오행의 동물들 반환
 */
export function getAnimalsByElement(element: FiveElement): AnimalInfo[] {
  return ELEMENT_ANIMALS[element].map(type => ANIMAL_DATABASE[type]);
}

// ===== 겉과 속 동물 DNA 분석 =====

/**
 * 겉/속 일치도 유형
 */
export type MatchLevel = 'identical' | 'similar' | 'different' | 'opposite';

/**
 * 겉/속 동물 DNA 결과
 */
export interface DualAnimalResult {
  outer: {
    animal: AnimalInfo;
    element: FiveElement;
    description: string;
  };
  inner: {
    animal: AnimalInfo;
    element: FiveElement;
    description: string;
  };
  matchScore: number;           // 0-100
  matchLevel: MatchLevel;
  matchDescription: string;     // 일치도 설명
  combinedTitle: string;        // 예: "겉은 사자, 속은 여우"
  personality: string;          // 종합 성격 설명
  yinYang: {
    outer: 'yang' | 'yin';
    inner: 'yang' | 'yin';
  };
}

/**
 * 겉/속 일치도별 설명
 */
const MATCH_DESCRIPTIONS: Record<MatchLevel, string[]> = {
  identical: [
    '겉과 속이 일치하는 진정성 있는 사람입니다.',
    '보이는 대로 느끼고, 느끼는 대로 표현합니다.',
    '숨김없는 솔직함이 매력입니다.',
  ],
  similar: [
    '겉과 속이 비슷하지만 미묘한 차이가 있습니다.',
    '대체로 일관된 모습을 보이지만, 가끔 다른 면도 있습니다.',
    '상황에 따라 유연하게 대처하는 타입입니다.',
  ],
  different: [
    '겉과 속이 상당히 다른 반전 매력의 소유자입니다.',
    '처음 만났을 때와 친해진 후의 모습이 다릅니다.',
    '알면 알수록 새로운 모습을 발견하게 됩니다.',
  ],
  opposite: [
    '겉과 속이 완전히 다른 이중적인 매력을 가졌습니다.',
    '첫인상과 실제 성격이 정반대인 경우가 많습니다.',
    '가까운 사람만 진짜 모습을 알 수 있습니다.',
  ],
};

/**
 * 겉/속 조합별 종합 성격 설명
 */
function generateCombinedPersonality(outerAnimal: AnimalInfo, innerAnimal: AnimalInfo): string {
  // 특별한 조합들
  const specialCombos: Record<string, string> = {
    'lion_deer': '겉으로는 당당하고 카리스마 있지만, 내면은 섬세하고 상처받기 쉬운 감성파입니다.',
    'lion_fox': '리더처럼 보이지만 속으로는 전략적으로 상황을 계산하는 타입입니다.',
    'tiger_deer': '강해 보이지만 실제로는 부드럽고 여린 마음을 가진 사람입니다.',
    'wolf_dolphin': '차갑고 날카로워 보이지만 알고 보면 유쾌하고 사교적입니다.',
    'bear_eagle': '포근해 보이지만 내면은 날카로운 통찰력을 가지고 있습니다.',
    'swan_wolf': '우아하고 순해 보이지만 속은 강인하고 충직합니다.',
    'fox_bear': '영리해 보이지만 실제로는 순수하고 따뜻한 마음을 가졌습니다.',
    'eagle_turtle': '날카롭고 빠르게 보이지만 내면은 신중하고 깊은 사색가입니다.',
    'dragon_ox': '화려하고 야망 있어 보이지만 실제로는 묵묵히 노력하는 성실파입니다.',
    'phoenix_turtle': '열정적이고 변화를 추구하는 것처럼 보이지만 내면은 안정을 원합니다.',
  };

  const comboKey = `${outerAnimal.id}_${innerAnimal.id}`;
  if (specialCombos[comboKey]) {
    return specialCombos[comboKey];
  }

  // 일반적인 설명 생성
  return `겉으로는 ${outerAnimal.name}처럼 ${outerAnimal.strengths[0].replace('인', '지만').replace('한', '지만')}, 내면은 ${innerAnimal.name}처럼 ${innerAnimal.strengths[0]}을 가진 사람입니다.`;
}

/**
 * 두 동물 간 일치도 점수 계산
 */
function calculateMatchScore(outer: AnimalType, inner: AnimalType): number {
  // 같은 동물
  if (outer === inner) return 100;

  const outerInfo = ANIMAL_DATABASE[outer];
  const innerInfo = ANIMAL_DATABASE[inner];

  let score = 50;

  // 같은 오행 계열
  if (outerInfo.element === innerInfo.element) {
    score += 25;
  }

  // 상생 관계
  const generatingPairs: [FiveElement, FiveElement][] = [
    ['木', '火'], ['火', '土'], ['土', '金'], ['金', '水'], ['水', '木'],
  ];
  for (const [a, b] of generatingPairs) {
    if ((outerInfo.element === a && innerInfo.element === b) ||
        (outerInfo.element === b && innerInfo.element === a)) {
      score += 15;
      break;
    }
  }

  // 상극 관계
  const overcomingPairs: [FiveElement, FiveElement][] = [
    ['木', '土'], ['土', '水'], ['水', '火'], ['火', '金'], ['金', '木'],
  ];
  for (const [a, b] of overcomingPairs) {
    if (outerInfo.element === a && innerInfo.element === b) {
      score -= 20;
      break;
    }
  }

  // 궁합 동물 여부
  if (outerInfo.bestMatch.includes(inner)) {
    score += 10;
  }
  if (outerInfo.worstMatch.includes(inner)) {
    score -= 15;
  }

  // 성향 유사도 (traits 비교)
  const traitKeys = ['observation', 'adaptability', 'independence', 'leadership', 'creativity', 'stability'] as const;
  let traitDiff = 0;
  for (const key of traitKeys) {
    traitDiff += Math.abs(outerInfo.traits[key] - innerInfo.traits[key]);
  }
  const avgTraitDiff = traitDiff / traitKeys.length;
  score += Math.round((100 - avgTraitDiff) / 5); // 성향이 비슷할수록 점수 증가

  return Math.max(0, Math.min(100, score));
}

/**
 * 일치도 점수 → 레벨 변환
 */
function getMatchLevel(score: number): MatchLevel {
  if (score >= 85) return 'identical';
  if (score >= 60) return 'similar';
  if (score >= 35) return 'different';
  return 'opposite';
}

/**
 * 연간 계산 (간이 버전)
 */
function calculateYearStem(year: number): string {
  const stems = ['甲', '乙', '丙', '丁', '戊', '己', '庚', '辛', '壬', '癸'];
  return stems[(year - 4) % 10];
}

/**
 * 시간 천간 계산 (간이 버전)
 */
function calculateHourStem(year: number, month: number, day: number, hour: number): string {
  const stems = ['甲', '乙', '丙', '丁', '戊', '己', '庚', '辛', '壬', '癸'];
  const dayStem = calculateDayStem(year, month, day);
  const dayStemIndex = stems.indexOf(dayStem);
  const hourBranch = Math.floor((hour + 1) / 2) % 12;
  const hourStemIndex = (dayStemIndex * 2 + hourBranch) % 10;
  return stems[hourStemIndex];
}

/**
 * 겉과 속 동물 DNA 분석 (메인 함수)
 */
export function analyzeDualAnimalDna(
  birthYear: number,
  birthMonth: number,
  birthDay: number,
  birthHour?: number
): DualAnimalResult {
  // 천간 계산
  const dayStem = calculateDayStem(birthYear, birthMonth, birthDay);    // 일간 → 속 (내면)
  const monthStem = calculateMonthStem(birthYear, birthMonth);           // 월간 → 겉 (외면)
  const yearStem = calculateYearStem(birthYear);                         // 연간 (보조)

  // 오행 변환
  const innerElement = STEM_TO_ELEMENT[dayStem] || '木';
  const outerElement = STEM_TO_ELEMENT[monthStem] || '火';
  const yearElement = STEM_TO_ELEMENT[yearStem] || '木';

  // 음양
  const innerYinYang = STEM_TO_YINYANG[dayStem] || 'yang';
  const outerYinYang = STEM_TO_YINYANG[monthStem] || 'yang';

  // 동물 결정: 주 오행 + 부 오행 조합
  // 겉: 월간(주) + 연간(부)
  const outerCombinationKey = `${outerElement}_${yearElement}`;
  const outerAnimalType = ELEMENT_COMBINATION_MAP[outerCombinationKey] || 'lion';
  const outerAnimal = ANIMAL_DATABASE[outerAnimalType];

  // 속: 일간(주) + 월간(부)
  const innerCombinationKey = `${innerElement}_${outerElement}`;
  const innerAnimalType = ELEMENT_COMBINATION_MAP[innerCombinationKey] || 'fox';
  const innerAnimal = ANIMAL_DATABASE[innerAnimalType];

  // 일치도 계산
  const matchScore = calculateMatchScore(outerAnimalType, innerAnimalType);
  const matchLevel = getMatchLevel(matchScore);

  // 설명 생성
  const matchDescriptions = MATCH_DESCRIPTIONS[matchLevel];
  const matchDescription = matchDescriptions[Math.floor(Math.random() * matchDescriptions.length)];

  const combinedTitle = outerAnimalType === innerAnimalType
    ? `순수한 ${outerAnimal.name}형`
    : `겉은 ${outerAnimal.name}, 속은 ${innerAnimal.name}`;

  const personality = outerAnimalType === innerAnimalType
    ? `${outerAnimal.description} 겉과 속이 같아 진정성 있는 모습을 보여줍니다.`
    : generateCombinedPersonality(outerAnimal, innerAnimal);

  return {
    outer: {
      animal: outerAnimal,
      element: outerElement,
      description: `타인에게 ${outerAnimal.name}처럼 보입니다. ${outerAnimal.strengths[0]}이(가) 돋보입니다.`,
    },
    inner: {
      animal: innerAnimal,
      element: innerElement,
      description: `내면은 ${innerAnimal.name}입니다. ${innerAnimal.strengths[0]}을(를) 중요하게 생각합니다.`,
    },
    matchScore,
    matchLevel,
    matchDescription,
    combinedTitle,
    personality,
    yinYang: {
      outer: outerYinYang,
      inner: innerYinYang,
    },
  };
}

/**
 * 일치도 레벨 한글 변환
 */
export function getMatchLevelLabel(level: MatchLevel): string {
  const labels: Record<MatchLevel, string> = {
    identical: '완전 일치',
    similar: '비슷함',
    different: '다름',
    opposite: '정반대',
  };
  return labels[level];
}

/**
 * 일치도 레벨 이모지
 */
export function getMatchLevelEmoji(level: MatchLevel): string {
  const emojis: Record<MatchLevel, string> = {
    identical: '🎯',
    similar: '🤝',
    different: '🎭',
    opposite: '🔄',
  };
  return emojis[level];
}
