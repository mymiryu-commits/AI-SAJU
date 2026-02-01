/**
 * 이상형 매칭 분석 (Ideal Type Analysis)
 * 사주 기반 이상형/궁합 맞는 사람 유형 분석
 */

import { SajuChart, Element, OhengResult } from '@/types/saju';

// 이상형 분석 결과
export interface IdealTypeAnalysis {
  // 이상형 프로필
  idealProfile: {
    mbtiTypes: string[];  // 궁합 좋은 MBTI
    elementType: Element;  // 이상형의 주요 오행
    elementTypeKorean: string;
    personality: string[];  // 이상형 성격 특성
    occupation: string[];  // 어울리는 직업군
    appearance: string[];  // 외모 특성 (오행 기반)
    warning: string[];  // 피해야 할 타입
  };

  // 연애 스타일
  loveStyle: {
    myType: string;  // 나의 연애 스타일
    myStrengths: string[];  // 연애 장점
    myWeaknesses: string[];  // 연애 단점
    idealPartnerStyle: string;  // 이상적인 파트너 스타일
    communicationTip: string;  // 소통 팁
  };

  // 궁합 점수별 특성
  matchScores: {
    bestMatch: {
      element: Element;
      score: number;
      description: string;
    };
    goodMatch: {
      element: Element;
      score: number;
      description: string;
    };
    challengeMatch: {
      element: Element;
      score: number;
      description: string;
    };
  };

  // 이상형 요약
  summary: string;
  viralTitle: string;  // SNS 공유용 제목
}

// 오행별 MBTI 매칭
const ELEMENT_MBTI_MATCH: Record<Element, { best: string[]; good: string[]; challenge: string[] }> = {
  wood: {
    best: ['ENFP', 'INFP', 'ENFJ'],
    good: ['ENTP', 'INTP', 'INFJ'],
    challenge: ['ISTJ', 'ESTJ', 'ISFJ']
  },
  fire: {
    best: ['ESTP', 'ESFP', 'ENTJ'],
    good: ['ENFP', 'ENTP', 'ISFP'],
    challenge: ['INTP', 'ISTP', 'INTJ']
  },
  earth: {
    best: ['ISFJ', 'ESFJ', 'ISTJ'],
    good: ['INFJ', 'ENFJ', 'ISFP'],
    challenge: ['ENTP', 'ENFP', 'ESTP']
  },
  metal: {
    best: ['INTJ', 'ENTJ', 'ISTJ'],
    good: ['INTP', 'ESTJ', 'ISTP'],
    challenge: ['ENFP', 'ESFP', 'INFP']
  },
  water: {
    best: ['INFJ', 'INFP', 'INTP'],
    good: ['INTJ', 'ISFJ', 'ENFJ'],
    challenge: ['ESTP', 'ESFP', 'ESTJ']
  }
};

// 오행별 이상형 특성
const ELEMENT_IDEAL_PROFILE: Record<Element, {
  personality: string[];
  occupation: string[];
  appearance: string[];
  warning: string[];
}> = {
  wood: {
    personality: ['성장 지향적', '창의적', '자유로운 영혼', '배움을 즐기는'],
    occupation: ['교육/연구직', '창작 분야', '스타트업', '환경/사회 분야'],
    appearance: ['키가 큰 편', '날씬한 체형', '단정한 이미지', '지적인 인상'],
    warning: ['지나치게 완고한 타입', '변화를 두려워하는 타입', '소통을 거부하는 타입']
  },
  fire: {
    personality: ['열정적', '리더십 있는', '사교적', '활기찬'],
    occupation: ['예술/엔터테인먼트', '영업/마케팅', 'CEO/경영', '방송/미디어'],
    appearance: ['화사한 인상', '눈빛이 또렷한', '패션 감각 좋은', '밝은 분위기'],
    warning: ['너무 차가운 타입', '비판적인 타입', '에너지가 낮은 타입']
  },
  earth: {
    personality: ['안정적', '믿음직한', '배려심 깊은', '현실적'],
    occupation: ['금융/회계', '부동산', '의료/간호', '공무원/행정'],
    appearance: ['부드러운 인상', '신뢰감 있는', '편안한 분위기', '단정한'],
    warning: ['너무 즉흥적인 타입', '책임감 없는 타입', '과도하게 모험적인 타입']
  },
  metal: {
    personality: ['원칙적', '정의로운', '결단력 있는', '세련된'],
    occupation: ['법률/법조', 'IT/기술', '엔지니어링', '컨설팅'],
    appearance: ['세련된 스타일', '날카로운 인상', '깔끔한', '카리스마 있는'],
    warning: ['너무 감정적인 타입', '우유부단한 타입', '약속을 못 지키는 타입']
  },
  water: {
    personality: ['지혜로운', '유연한', '깊이 있는', '직관적'],
    occupation: ['연구/학술', '심리/상담', '예술/창작', '철학/종교'],
    appearance: ['신비로운 분위기', '깊은 눈빛', '잔잔한 인상', '예술가 기질'],
    warning: ['너무 시끄러운 타입', '깊이 없는 타입', '배려 없는 타입']
  }
};

// 오행별 연애 스타일
const ELEMENT_LOVE_STYLE: Record<Element, {
  myType: string;
  strengths: string[];
  weaknesses: string[];
  idealPartner: string;
  commTip: string;
}> = {
  wood: {
    myType: '성장하는 사랑을 추구하는 로맨티스트',
    strengths: ['함께 성장하려는 의지', '새로운 시도를 두려워하지 않음', '배려심 있는 대화'],
    weaknesses: ['이상이 너무 높을 수 있음', '현실적인 문제에 취약', '독립성이 과할 수 있음'],
    idealPartner: '나의 꿈을 응원하면서도 현실적인 조언을 해주는 사람',
    commTip: '감정보다 비전을 공유하면 마음이 열립니다'
  },
  fire: {
    myType: '열정적이고 직진하는 연애 스타일',
    strengths: ['화끈한 표현력', '분위기 메이커', '적극적인 애정 표현'],
    weaknesses: ['급한 성격', '쉽게 식을 수 있음', '갈등시 격해질 수 있음'],
    idealPartner: '나의 열정을 받아주면서 차분하게 중심을 잡아주는 사람',
    commTip: '진심 어린 칭찬과 인정이 사랑의 열쇠입니다'
  },
  earth: {
    myType: '안정적이고 헌신적인 연애 스타일',
    strengths: ['변함없는 사랑', '실질적인 배려', '믿음직한 파트너'],
    weaknesses: ['표현이 서투를 수 있음', '변화에 느린 적응', '고집이 셀 수 있음'],
    idealPartner: '나의 헌신을 알아주고 감사함을 표현하는 사람',
    commTip: '행동으로 보여주는 것보다 말로 표현하는 연습을 하세요'
  },
  metal: {
    myType: '원칙 있고 세련된 연애 스타일',
    strengths: ['명확한 의사소통', '지적인 대화', '품격 있는 관계'],
    weaknesses: ['감정 표현이 서투름', '비판적으로 보일 수 있음', '융통성 부족'],
    idealPartner: '나의 가치관을 존중하면서 부드러움을 더해주는 사람',
    commTip: '논리보다 감정을 먼저 공감하면 관계가 깊어집니다'
  },
  water: {
    myType: '깊고 영적인 연결을 추구하는 연애 스타일',
    strengths: ['깊은 이해력', '공감 능력', '영혼의 교류'],
    weaknesses: ['우유부단할 수 있음', '감정의 파도에 휩쓸림', '현실 도피 경향'],
    idealPartner: '나의 깊은 세계를 이해하면서 현실적으로 이끌어주는 사람',
    commTip: '침묵도 대화라는 것을 알아주는 사람이 진정한 인연입니다'
  }
};

// 오행 한글 매핑
const ELEMENT_KOREAN: Record<Element, string> = {
  wood: '목(木)', fire: '화(火)', earth: '토(土)', metal: '금(金)', water: '수(水)'
};

// 상생 관계
const ELEMENT_GENERATES: Record<Element, Element> = {
  wood: 'fire', fire: 'earth', earth: 'metal', metal: 'water', water: 'wood'
};

// 상극 관계
const ELEMENT_CONTROLS: Record<Element, Element> = {
  wood: 'earth', fire: 'metal', earth: 'water', metal: 'wood', water: 'fire'
};

/**
 * 이상형 분석 메인 함수
 */
export function analyzeIdealType(
  saju: SajuChart,
  oheng: OhengResult
): IdealTypeAnalysis {
  // 일간(Day Master) 기반 분석 - 가장 중요한 기준
  const dayMasterElement = saju.day.element;

  // 용신 기반 이상형 (부족한 기운을 채워주는 사람)
  const yongsinElement = findYongsinElement(oheng);

  // 이상형의 주요 오행 결정 (용신 + 상생)
  const idealElement = yongsinElement || ELEMENT_GENERATES[dayMasterElement];

  // MBTI 매칭
  const mbtiMatch = ELEMENT_MBTI_MATCH[idealElement];

  // 이상형 프로필
  const idealProfile = ELEMENT_IDEAL_PROFILE[idealElement];

  // 연애 스타일
  const loveStyleData = ELEMENT_LOVE_STYLE[dayMasterElement];

  // 궁합 점수 계산
  const matchScores = calculateMatchScores(dayMasterElement);

  // 요약 생성
  const summary = generateIdealTypeSummary(dayMasterElement, idealElement, loveStyleData);
  const viralTitle = generateViralTitle(dayMasterElement, idealElement);

  return {
    idealProfile: {
      mbtiTypes: mbtiMatch.best,
      elementType: idealElement,
      elementTypeKorean: ELEMENT_KOREAN[idealElement],
      personality: idealProfile.personality,
      occupation: idealProfile.occupation,
      appearance: idealProfile.appearance,
      warning: idealProfile.warning
    },
    loveStyle: {
      myType: loveStyleData.myType,
      myStrengths: loveStyleData.strengths,
      myWeaknesses: loveStyleData.weaknesses,
      idealPartnerStyle: loveStyleData.idealPartner,
      communicationTip: loveStyleData.commTip
    },
    matchScores,
    summary,
    viralTitle
  };
}

/**
 * 용신 오행 찾기 (가장 부족한 기운)
 */
function findYongsinElement(oheng: OhengResult): Element | null {
  const elements: [Element, number][] = [
    ['wood', oheng.wood],
    ['fire', oheng.fire],
    ['earth', oheng.earth],
    ['metal', oheng.metal],
    ['water', oheng.water]
  ];

  // 가장 부족한 오행 찾기
  const sorted = elements.sort((a, b) => a[1] - b[1]);
  return sorted[0][0];
}

/**
 * 궁합 점수 계산
 */
function calculateMatchScores(dayElement: Element): IdealTypeAnalysis['matchScores'] {
  const generatingElement = ELEMENT_GENERATES[dayElement];  // 내가 생하는 오행
  const generatedByElement = Object.keys(ELEMENT_GENERATES).find(
    key => ELEMENT_GENERATES[key as Element] === dayElement
  ) as Element;  // 나를 생하는 오행
  const controllingElement = ELEMENT_CONTROLS[dayElement];  // 내가 극하는 오행

  return {
    bestMatch: {
      element: generatedByElement,
      score: 95,
      description: `${ELEMENT_KOREAN[generatedByElement]} 기운의 사람은 당신을 성장시켜주는 이상적인 파트너입니다. 상생 관계로 서로를 보완하며 함께 발전할 수 있어요.`
    },
    goodMatch: {
      element: generatingElement,
      score: 80,
      description: `${ELEMENT_KOREAN[generatingElement]} 기운의 사람과는 안정적인 관계를 유지할 수 있습니다. 당신이 이끌어주는 역할을 하게 됩니다.`
    },
    challengeMatch: {
      element: controllingElement,
      score: 55,
      description: `${ELEMENT_KOREAN[controllingElement]} 기운의 사람과는 긴장감이 있지만, 서로 성장시키는 관계가 될 수 있습니다. 노력이 필요해요.`
    }
  };
}

/**
 * 이상형 요약 생성
 */
function generateIdealTypeSummary(
  dayElement: Element,
  idealElement: Element,
  loveStyle: typeof ELEMENT_LOVE_STYLE[Element]
): string {
  const dayKorean = ELEMENT_KOREAN[dayElement];
  const idealKorean = ELEMENT_KOREAN[idealElement];

  return `당신은 ${dayKorean} 기운의 ${loveStyle.myType}입니다. ` +
    `${idealKorean} 기운을 가진 사람과 만나면 서로를 보완하며 최고의 궁합을 이룰 수 있어요. ` +
    `${loveStyle.idealPartner}. ` +
    `연애할 때 기억하세요: ${loveStyle.commTip}`;
}

/**
 * SNS 공유용 제목 생성
 */
function generateViralTitle(dayElement: Element, idealElement: Element): string {
  const titles: Record<Element, Record<Element, string>> = {
    wood: {
      wood: '함께 성장하는 꿈꾸는 연인을 만나세요! 🌱',
      fire: '당신의 열정을 불태워줄 인연을 찾아요! 🔥',
      earth: '든든한 버팀목이 될 인연이 기다려요! 🏔️',
      metal: '세련된 감각의 파트너를 찾아요! ⚔️',
      water: '깊은 영혼의 교류를 나눌 인연! 🌊'
    },
    fire: {
      wood: '당신을 성장시켜줄 인연을 찾아요! 🌱',
      fire: '함께 타오르는 열정적인 사랑! 🔥',
      earth: '안정과 열정의 완벽한 조화! 🏔️',
      metal: '도전과 세련미의 케미! ⚔️',
      water: '뜨거움을 식혀줄 신비로운 인연! 🌊'
    },
    earth: {
      wood: '변화와 성장을 함께할 인연! 🌱',
      fire: '당신에게 활력을 줄 인연! 🔥',
      earth: '평생 함께할 든든한 인연! 🏔️',
      metal: '신뢰와 품격의 만남! ⚔️',
      water: '깊고 신비로운 연결! 🌊'
    },
    metal: {
      wood: '유연함을 배울 인연! 🌱',
      fire: '열정을 배울 인연! 🔥',
      earth: '당신을 지지할 완벽한 인연! 🏔️',
      metal: '원칙과 세련미의 만남! ⚔️',
      water: '지혜를 함께 나눌 인연! 🌊'
    },
    water: {
      wood: '함께 성장할 최고의 인연! 🌱',
      fire: '당신에게 열정을 줄 인연! 🔥',
      earth: '안정을 줄 든든한 인연! 🏔️',
      metal: '지혜와 결단력의 만남! ⚔️',
      water: '영혼까지 통하는 운명적 만남! 🌊'
    }
  };

  return titles[dayElement][idealElement] || '당신의 운명적 인연을 찾아요! 💕';
}

export default analyzeIdealType;
