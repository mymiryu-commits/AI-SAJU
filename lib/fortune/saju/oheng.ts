/**
 * 오행 분석 엔진 (Five Elements Analysis)
 * 오행 균형, 용신/기신 계산, 보완 액션 생성
 */

import { SajuChart, OhengBalance, Element, ELEMENT_KOREAN } from '@/types/saju';
import { STEM_ELEMENTS, BRANCH_ELEMENTS } from './calculator';

// 지장간 (지지 속 숨은 천간)
const HIDDEN_STEMS: Record<string, { main: string; middle?: string; residual?: string }> = {
  '子': { main: '癸' },
  '丑': { main: '己', middle: '癸', residual: '辛' },
  '寅': { main: '甲', middle: '丙', residual: '戊' },
  '卯': { main: '乙' },
  '辰': { main: '戊', middle: '乙', residual: '癸' },
  '巳': { main: '丙', middle: '庚', residual: '戊' },
  '午': { main: '丁', middle: '己' },
  '未': { main: '己', middle: '丁', residual: '乙' },
  '申': { main: '庚', middle: '壬', residual: '戊' },
  '酉': { main: '辛' },
  '戌': { main: '戊', middle: '辛', residual: '丁' },
  '亥': { main: '壬', middle: '甲' }
};

// 오행 상생 관계
const GENERATING_CYCLE: Record<Element, Element> = {
  wood: 'fire',   // 목생화
  fire: 'earth',  // 화생토
  earth: 'metal', // 토생금
  metal: 'water', // 금생수
  water: 'wood'   // 수생목
};

// 오행 상극 관계
const CONTROLLING_CYCLE: Record<Element, Element> = {
  wood: 'earth',  // 목극토
  earth: 'water', // 토극수
  water: 'fire',  // 수극화
  fire: 'metal',  // 화극금
  metal: 'wood'   // 금극목
};

// 오행 역생 관계 (나를 생하는 오행)
const GENERATED_BY: Record<Element, Element> = {
  wood: 'water',
  fire: 'wood',
  earth: 'fire',
  metal: 'earth',
  water: 'metal'
};

// 오행 역극 관계 (나를 극하는 오행)
const CONTROLLED_BY: Record<Element, Element> = {
  wood: 'metal',
  fire: 'water',
  earth: 'wood',
  metal: 'fire',
  water: 'earth'
};

/**
 * 오행 분석 메인 함수
 */
export function analyzeOheng(saju: SajuChart): {
  balance: OhengBalance;
  strong: Element[];
  weak: Element[];
  yongsin: Element[];
  gisin: Element[];
  dayMasterStrength: 'strong' | 'weak' | 'balanced';
} {
  // 오행 카운트
  const balance = calculateOhengBalance(saju);

  // 강/약 오행 판별
  const { strong, weak } = categorizeElements(balance);

  // 일간(일주 천간) 기준 용신/기신 계산
  const dayMaster = saju.day.element;
  const dayMasterStrength = calculateDayMasterStrength(dayMaster, balance, saju);
  const { yongsin, gisin } = calculateYongsinGisin(dayMaster, balance, dayMasterStrength);

  return { balance, strong, weak, yongsin, gisin, dayMasterStrength };
}

/**
 * 오행 균형 계산 (지장간 포함)
 */
function calculateOhengBalance(saju: SajuChart): OhengBalance {
  const balance: OhengBalance = {
    wood: 0,
    fire: 0,
    earth: 0,
    metal: 0,
    water: 0
  };

  const pillars = [saju.year, saju.month, saju.day, saju.time].filter(Boolean);

  for (const pillar of pillars) {
    if (!pillar) continue;

    // 천간 오행 (가중치 1.0)
    balance[pillar.element] += 1.0;

    // 지지 본기 오행 (가중치 0.7)
    const branchElement = BRANCH_ELEMENTS[pillar.earthlyBranch];
    balance[branchElement] += 0.7;

    // 지장간 오행 (가중치 0.3)
    const hiddenStems = HIDDEN_STEMS[pillar.earthlyBranch];
    if (hiddenStems) {
      if (hiddenStems.middle) {
        balance[STEM_ELEMENTS[hiddenStems.middle]] += 0.2;
      }
      if (hiddenStems.residual) {
        balance[STEM_ELEMENTS[hiddenStems.residual]] += 0.1;
      }
    }
  }

  // 소수점 1자리로 반올림
  Object.keys(balance).forEach(key => {
    balance[key as Element] = Math.round(balance[key as Element] * 10) / 10;
  });

  return balance;
}

/**
 * 강/약 오행 분류
 */
function categorizeElements(balance: OhengBalance): { strong: Element[]; weak: Element[] } {
  const entries = Object.entries(balance) as [Element, number][];
  const total = entries.reduce((sum, [, count]) => sum + count, 0);
  const average = total / 5;

  const strong = entries
    .filter(([, count]) => count >= average * 1.3)
    .sort((a, b) => b[1] - a[1])
    .map(([el]) => el);

  const weak = entries
    .filter(([, count]) => count <= average * 0.7)
    .sort((a, b) => a[1] - b[1])
    .map(([el]) => el);

  return { strong, weak };
}

/**
 * 일간 강약 판단
 */
function calculateDayMasterStrength(
  dayMaster: Element,
  balance: OhengBalance,
  saju: SajuChart
): 'strong' | 'weak' | 'balanced' {
  // 일간과 같은 오행 + 일간을 생하는 오행
  const supportingElement = GENERATED_BY[dayMaster];
  const supportStrength = balance[dayMaster] + balance[supportingElement] * 0.7;

  // 일간을 극하는 오행 + 일간이 생하는 오행 (설기)
  const controllingElement = CONTROLLED_BY[dayMaster];
  const generatingElement = GENERATING_CYCLE[dayMaster];
  const drainStrength = balance[controllingElement] + balance[generatingElement] * 0.5;

  // 월령 가산 (월지가 일간을 돕는 경우)
  const monthBranchElement = BRANCH_ELEMENTS[saju.month.earthlyBranch];
  let monthBonus = 0;
  if (monthBranchElement === dayMaster || monthBranchElement === supportingElement) {
    monthBonus = 1.5;
  }

  const finalSupport = supportStrength + monthBonus;

  if (finalSupport > drainStrength * 1.3) {
    return 'strong';
  } else if (finalSupport < drainStrength * 0.7) {
    return 'weak';
  }
  return 'balanced';
}

/**
 * 용신/기신 계산
 */
function calculateYongsinGisin(
  dayMaster: Element,
  balance: OhengBalance,
  strength: 'strong' | 'weak' | 'balanced'
): { yongsin: Element[]; gisin: Element[] } {
  const yongsin: Element[] = [];
  const gisin: Element[] = [];

  if (strength === 'strong') {
    // 신강: 설기(내가 생하는 것), 극기(나를 극하는 것) 필요
    yongsin.push(GENERATING_CYCLE[dayMaster]); // 설기
    yongsin.push(CONTROLLED_BY[dayMaster]);    // 극기

    // 기신: 자신 오행, 나를 생하는 오행
    gisin.push(dayMaster);
    gisin.push(GENERATED_BY[dayMaster]);
  } else if (strength === 'weak') {
    // 신약: 비겁(같은 오행), 생기(나를 생하는 것) 필요
    yongsin.push(dayMaster);                   // 비겁
    yongsin.push(GENERATED_BY[dayMaster]);     // 생기

    // 기신: 나를 극하는 오행, 내가 극하는 오행
    gisin.push(CONTROLLED_BY[dayMaster]);
    gisin.push(CONTROLLING_CYCLE[dayMaster]);
  } else {
    // 중화: 부족한 오행 보충
    const weak = Object.entries(balance)
      .filter(([, count]) => count <= 1)
      .map(([el]) => el as Element);

    if (weak.length > 0) {
      yongsin.push(...weak.slice(0, 2));
    } else {
      yongsin.push(GENERATING_CYCLE[dayMaster]);
    }

    const strong = Object.entries(balance)
      .filter(([, count]) => count >= 3)
      .map(([el]) => el as Element);

    gisin.push(...strong);
  }

  return { yongsin, gisin };
}

/**
 * 오행 보완 액션 생성
 */
export function generateOhengActions(
  yongsin: Element[],
  gisin: Element[]
): { boost: string[]; avoid: string[] } {
  const elementActions: Record<Element, { boost: string[]; avoid: string[] }> = {
    wood: {
      boost: [
        '동쪽 방향 활용하기',
        '녹색/청색 아이템 착용',
        '식물 키우기 또는 나무가 많은 곳 방문',
        '아침 시간대 활용 (5-7시)',
        '새로운 시작과 학습에 집중',
        '목재 가구나 소품 배치'
      ],
      avoid: [
        '과도한 금속 악세서리',
        '서쪽 방향의 중요 미팅 피하기'
      ]
    },
    fire: {
      boost: [
        '남쪽 방향 활용하기',
        '빨간색/주황색/보라색 착용',
        '밝은 조명 환경에서 활동',
        '점심 시간대 활용 (11-13시)',
        '열정적인 활동과 발표',
        '촛불이나 따뜻한 조명 활용'
      ],
      avoid: [
        '과도한 냉방 환경',
        '북쪽 방향의 중요 미팅 피하기'
      ]
    },
    earth: {
      boost: [
        '중앙/동북/서남 방향 활용',
        '황색/베이지/갈색 착용',
        '안정적인 환경 유지하기',
        '오후 시간대 활용 (13-15시, 19-21시)',
        '신뢰 구축 활동에 집중',
        '도자기나 흙 관련 취미'
      ],
      avoid: [
        '급격한 변화나 이동',
        '불안정한 환경에서의 결정'
      ]
    },
    metal: {
      boost: [
        '서쪽 방향 활용하기',
        '흰색/은색/금색 착용',
        '금속 악세서리 활용',
        '저녁 시간대 활용 (17-19시)',
        '결단력 있는 마무리 작업',
        '칼, 가위 등 금속 도구 정리'
      ],
      avoid: [
        '우유부단한 태도',
        '불 관련 활동 주의'
      ]
    },
    water: {
      boost: [
        '북쪽 방향 활용하기',
        '검정색/파란색/남색 착용',
        '수분 섭취 늘리기',
        '밤 시간대 활용 (21-23시)',
        '유연하고 창의적인 사고',
        '물가나 수족관 방문'
      ],
      avoid: [
        '과도한 열 노출',
        '남쪽 방향의 중요 미팅 피하기'
      ]
    }
  };

  const boost: string[] = [];
  const avoid: string[] = [];

  // 용신 오행 활동 추가
  for (const el of yongsin) {
    boost.push(...elementActions[el].boost);
  }

  // 기신 오행 주의사항 추가
  for (const el of gisin) {
    avoid.push(...elementActions[el].avoid);
    avoid.push(`${ELEMENT_KOREAN[el]} 에너지 과잉 주의`);
  }

  // 중복 제거
  return {
    boost: [...new Set(boost)],
    avoid: [...new Set(avoid)]
  };
}

/**
 * 오행별 행운 색상
 */
export function getLuckyColors(yongsin: Element[]): string[] {
  const colorMap: Record<Element, string[]> = {
    wood: ['녹색', '청색', '연두색'],
    fire: ['빨간색', '주황색', '보라색', '분홍색'],
    earth: ['황색', '베이지', '갈색', '카키'],
    metal: ['흰색', '은색', '금색', '회색'],
    water: ['검정색', '파란색', '남색', '네이비']
  };

  return yongsin.flatMap(el => colorMap[el]);
}

/**
 * 오행별 행운 방향
 */
export function getLuckyDirections(yongsin: Element[]): string[] {
  const directionMap: Record<Element, string> = {
    wood: '동쪽',
    fire: '남쪽',
    earth: '중앙/동북/서남',
    metal: '서쪽',
    water: '북쪽'
  };

  return yongsin.map(el => directionMap[el]);
}

/**
 * 오행별 행운 숫자
 */
export function getLuckyNumbers(yongsin: Element[]): number[] {
  const numberMap: Record<Element, number[]> = {
    wood: [3, 8],
    fire: [2, 7],
    earth: [5, 10],
    metal: [4, 9],
    water: [1, 6]
  };

  return yongsin.flatMap(el => numberMap[el]);
}

/**
 * 오행별 행운 시간대
 */
export function getLuckyTimes(yongsin: Element[]): string[] {
  const timeMap: Record<Element, string> = {
    wood: '05:00-09:00 (인묘시)',
    fire: '09:00-13:00 (사오시)',
    earth: '01:00-03:00, 07:00-09:00, 13:00-15:00, 19:00-21:00 (축진미술시)',
    metal: '15:00-19:00 (신유시)',
    water: '21:00-01:00 (해자시)'
  };

  return yongsin.map(el => timeMap[el]);
}

/**
 * 오행 상성 분석 (두 사람 간)
 */
export function analyzeElementInteraction(
  element1: Element,
  element2: Element
): {
  type: '상생' | '상극' | '비화' | '중화';
  description: string;
  compatibility: number;
} {
  // 같은 오행
  if (element1 === element2) {
    return {
      type: '비화',
      description: '같은 에너지로 서로 이해하지만, 발전이 정체될 수 있습니다.',
      compatibility: 70
    };
  }

  // 상생 관계
  if (GENERATING_CYCLE[element1] === element2) {
    return {
      type: '상생',
      description: `${ELEMENT_KOREAN[element1]}이(가) ${ELEMENT_KOREAN[element2]}을(를) 생하여 서로 돕는 관계입니다.`,
      compatibility: 90
    };
  }

  if (GENERATING_CYCLE[element2] === element1) {
    return {
      type: '상생',
      description: `${ELEMENT_KOREAN[element2]}이(가) ${ELEMENT_KOREAN[element1]}을(를) 생하여 서로 돕는 관계입니다.`,
      compatibility: 85
    };
  }

  // 상극 관계
  if (CONTROLLING_CYCLE[element1] === element2) {
    return {
      type: '상극',
      description: `${ELEMENT_KOREAN[element1]}이(가) ${ELEMENT_KOREAN[element2]}을(를) 극하여 긴장 관계가 있습니다.`,
      compatibility: 50
    };
  }

  if (CONTROLLING_CYCLE[element2] === element1) {
    return {
      type: '상극',
      description: `${ELEMENT_KOREAN[element2]}이(가) ${ELEMENT_KOREAN[element1]}을(를) 극하여 긴장 관계가 있습니다.`,
      compatibility: 55
    };
  }

  // 그 외 중화
  return {
    type: '중화',
    description: '직접적인 상생상극이 없어 중립적인 관계입니다.',
    compatibility: 75
  };
}

/**
 * 오행 균형 시각화 데이터
 */
export function getOhengChartData(balance: OhengBalance): {
  name: string;
  value: number;
  color: string;
  korean: string;
}[] {
  const colors: Record<Element, string> = {
    wood: '#22c55e',
    fire: '#ef4444',
    earth: '#eab308',
    metal: '#f8fafc',
    water: '#3b82f6'
  };

  return (Object.entries(balance) as [Element, number][]).map(([element, value]) => ({
    name: element,
    value,
    color: colors[element],
    korean: ELEMENT_KOREAN[element]
  }));
}
