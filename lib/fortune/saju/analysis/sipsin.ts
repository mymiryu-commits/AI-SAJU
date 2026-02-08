/**
 * 십신(十神) 분석 모듈
 *
 * 십신은 일간(日干)을 기준으로 다른 천간/지지와의 관계를 나타냅니다.
 */

import type { SajuChart, SajuPillar, Element } from '@/types/saju';

// 십신 종류
export type SipsinType =
  | 'bijeon'    // 비견 (比肩) - 같은 오행, 같은 음양
  | 'geopjae'   // 겁재 (劫財) - 같은 오행, 다른 음양
  | 'siksin'    // 식신 (食神) - 내가 생하는 오행, 같은 음양
  | 'sanggwan'  // 상관 (傷官) - 내가 생하는 오행, 다른 음양
  | 'jeongjae'  // 정재 (正財) - 내가 극하는 오행, 다른 음양
  | 'pyeonjae'  // 편재 (偏財) - 내가 극하는 오행, 같은 음양
  | 'jeonggwan' // 정관 (正官) - 나를 극하는 오행, 다른 음양
  | 'pyeongwan' // 편관 (偏官) - 나를 극하는 오행, 같은 음양 (칠살)
  | 'jeongin'   // 정인 (正印) - 나를 생하는 오행, 다른 음양
  | 'pyeonin';  // 편인 (偏印) - 나를 생하는 오행, 같은 음양

export interface SipsinInfo {
  type: SipsinType;
  korean: string;
  hanja: string;
  meaning: string;
  category: '비겁' | '식상' | '재성' | '관성' | '인성';
  personality: string;
  strength: string;
  weakness: string;
  career: string[];
  relationship: string;
}

// 십신 정보
export const SIPSIN_INFO: Record<SipsinType, SipsinInfo> = {
  bijeon: {
    type: 'bijeon',
    korean: '비견',
    hanja: '比肩',
    meaning: '어깨를 나란히 하다',
    category: '비겁',
    personality: '독립심이 강하고 자존심이 높습니다. 주관이 뚜렷하고 고집이 있습니다.',
    strength: '자신감, 독립성, 리더십, 개척정신',
    weakness: '고집, 독선, 타협의 어려움',
    career: ['사업가', '프리랜서', '자영업', '창업자'],
    relationship: '형제, 친구, 동료와의 경쟁과 협력 관계'
  },
  geopjae: {
    type: 'geopjae',
    korean: '겁재',
    hanja: '劫財',
    meaning: '재물을 빼앗다',
    category: '비겁',
    personality: '욕심이 많고 승부욕이 강합니다. 추진력과 행동력이 있습니다.',
    strength: '추진력, 경쟁심, 도전정신',
    weakness: '탐욕, 무모함, 인내력 부족',
    career: ['영업', '투자', '스포츠', '도전적 분야'],
    relationship: '형제, 친구와의 경쟁적 관계'
  },
  siksin: {
    type: 'siksin',
    korean: '식신',
    hanja: '食神',
    meaning: '먹을 것을 주는 신',
    category: '식상',
    personality: '온화하고 낙천적입니다. 창의력과 표현력이 뛰어납니다.',
    strength: '창의력, 표현력, 낙관성, 인복',
    weakness: '게으름, 나태함, 현실 안주',
    career: ['예술가', '요리사', '교육자', '서비스업'],
    relationship: '자녀운이 좋고, 편안한 대인관계'
  },
  sanggwan: {
    type: 'sanggwan',
    korean: '상관',
    hanja: '傷官',
    meaning: '관을 해치다',
    category: '식상',
    personality: '재능이 뛰어나고 비판적입니다. 창의적이지만 반항기가 있습니다.',
    strength: '재능, 창의성, 언변, 분석력',
    weakness: '반항심, 독설, 조직 부적응',
    career: ['예술가', '비평가', '변호사', '프리랜서'],
    relationship: '권위에 대한 도전, 자유로운 관계 선호'
  },
  jeongjae: {
    type: 'jeongjae',
    korean: '정재',
    hanja: '正財',
    meaning: '바른 재물',
    category: '재성',
    personality: '성실하고 현실적입니다. 저축과 관리에 능합니다.',
    strength: '성실함, 절약, 현실감각, 책임감',
    weakness: '소심함, 인색함, 모험 기피',
    career: ['회계사', '은행원', '공무원', '관리직'],
    relationship: '안정적인 가정, 배우자 복'
  },
  pyeonjae: {
    type: 'pyeonjae',
    korean: '편재',
    hanja: '偏財',
    meaning: '치우친 재물',
    category: '재성',
    personality: '활동적이고 사교적입니다. 투자와 사업에 관심이 많습니다.',
    strength: '사교성, 사업수완, 융통성, 행동력',
    weakness: '낭비, 바람기, 불안정',
    career: ['사업가', '투자자', '영업', '자영업'],
    relationship: '넓은 인맥, 활발한 사회활동'
  },
  jeonggwan: {
    type: 'jeonggwan',
    korean: '정관',
    hanja: '正官',
    meaning: '바른 관직',
    category: '관성',
    personality: '책임감이 강하고 규범을 중시합니다. 사회적 지위를 중요시합니다.',
    strength: '책임감, 신뢰성, 조직력, 명예욕',
    weakness: '경직됨, 권위주의, 융통성 부족',
    career: ['공무원', '관리자', '법조인', '대기업'],
    relationship: '안정적인 결혼, 명예로운 지위'
  },
  pyeongwan: {
    type: 'pyeongwan',
    korean: '편관',
    hanja: '偏官',
    meaning: '치우친 관직 (칠살)',
    category: '관성',
    personality: '강단이 있고 결단력이 있습니다. 위기 상황에서 빛납니다.',
    strength: '결단력, 추진력, 위기관리, 리더십',
    weakness: '독재적, 공격적, 스트레스',
    career: ['군인', '경찰', '외과의', '위기관리'],
    relationship: '도전적인 관계, 강한 배우자'
  },
  jeongin: {
    type: 'jeongin',
    korean: '정인',
    hanja: '正印',
    meaning: '바른 도장',
    category: '인성',
    personality: '배움을 좋아하고 지혜롭습니다. 어머니와의 인연이 깊습니다.',
    strength: '학문, 지혜, 인자함, 배려심',
    weakness: '우유부단, 의존성, 실행력 부족',
    career: ['교수', '연구원', '교사', '종교인'],
    relationship: '어머니 복, 스승과의 인연'
  },
  pyeonin: {
    type: 'pyeonin',
    korean: '편인',
    hanja: '偏印',
    meaning: '치우친 도장',
    category: '인성',
    personality: '직관적이고 창의적입니다. 독특한 사고방식을 가집니다.',
    strength: '직관력, 창의성, 영성, 독창성',
    weakness: '고독, 외톨이, 실용성 부족',
    career: ['예술가', '철학자', '연구원', '종교인'],
    relationship: '독특한 인연, 의외의 도움'
  }
};

// 천간 정보
const HEAVENLY_STEMS = {
  '甲': { element: 'wood' as Element, yang: true },
  '乙': { element: 'wood' as Element, yang: false },
  '丙': { element: 'fire' as Element, yang: true },
  '丁': { element: 'fire' as Element, yang: false },
  '戊': { element: 'earth' as Element, yang: true },
  '己': { element: 'earth' as Element, yang: false },
  '庚': { element: 'metal' as Element, yang: true },
  '辛': { element: 'metal' as Element, yang: false },
  '壬': { element: 'water' as Element, yang: true },
  '癸': { element: 'water' as Element, yang: false }
};

// 지지의 본기
const EARTHLY_BRANCH_MAIN = {
  '子': { element: 'water' as Element, yang: true },
  '丑': { element: 'earth' as Element, yang: false },
  '寅': { element: 'wood' as Element, yang: true },
  '卯': { element: 'wood' as Element, yang: false },
  '辰': { element: 'earth' as Element, yang: true },
  '巳': { element: 'fire' as Element, yang: false },
  '午': { element: 'fire' as Element, yang: true },
  '未': { element: 'earth' as Element, yang: false },
  '申': { element: 'metal' as Element, yang: true },
  '酉': { element: 'metal' as Element, yang: false },
  '戌': { element: 'earth' as Element, yang: true },
  '亥': { element: 'water' as Element, yang: false }
};

// 오행 상생 (생하는 오행)
const GENERATES: Record<Element, Element> = {
  wood: 'fire',
  fire: 'earth',
  earth: 'metal',
  metal: 'water',
  water: 'wood'
};

// 오행 상극 (극하는 오행)
const CONTROLS: Record<Element, Element> = {
  wood: 'earth',
  earth: 'water',
  water: 'fire',
  fire: 'metal',
  metal: 'wood'
};

/**
 * 십신 계산
 */
export function calculateSipsin(
  dayElement: Element,
  dayYang: boolean,
  targetElement: Element,
  targetYang: boolean
): SipsinType {
  const sameElement = dayElement === targetElement;
  const sameYangYin = dayYang === targetYang;
  const iGenerate = GENERATES[dayElement] === targetElement;
  const iControl = CONTROLS[dayElement] === targetElement;
  const generatesMe = GENERATES[targetElement] === dayElement;
  const controlsMe = CONTROLS[targetElement] === dayElement;

  // 비겁 (같은 오행)
  if (sameElement) {
    return sameYangYin ? 'bijeon' : 'geopjae';
  }

  // 식상 (내가 생하는 오행)
  if (iGenerate) {
    return sameYangYin ? 'siksin' : 'sanggwan';
  }

  // 재성 (내가 극하는 오행)
  if (iControl) {
    return sameYangYin ? 'pyeonjae' : 'jeongjae';
  }

  // 관성 (나를 극하는 오행)
  if (controlsMe) {
    return sameYangYin ? 'pyeongwan' : 'jeonggwan';
  }

  // 인성 (나를 생하는 오행)
  if (generatesMe) {
    return sameYangYin ? 'pyeonin' : 'jeongin';
  }

  // 기본값 (일어나지 않아야 함)
  return 'bijeon';
}

export interface SipsinChart {
  // 각 주의 천간 십신
  yearStem: SipsinType;
  monthStem: SipsinType;
  dayStem: SipsinType;  // 일간은 자신 (비견)
  hourStem: SipsinType;

  // 각 주의 지지 본기 십신
  yearBranch: SipsinType;
  monthBranch: SipsinType;
  dayBranch: SipsinType;
  hourBranch: SipsinType;

  // 십신 분포 (카운트)
  distribution: Record<SipsinType, number>;

  // 십신 카테고리 분포
  categoryDistribution: {
    bigeop: number;   // 비겁
    siksang: number;  // 식상
    jaesung: number;  // 재성
    gwansung: number; // 관성
    insung: number;   // 인성
  };
}

/**
 * 사주 십신 배치도 생성
 */
export function analyzeSipsin(saju: SajuChart): SipsinChart {
  const dayMaster = saju.day.heavenlyStem;
  const dayInfo = HEAVENLY_STEMS[dayMaster as keyof typeof HEAVENLY_STEMS];

  if (!dayInfo) {
    throw new Error(`Invalid day master: ${dayMaster}`);
  }

  const dayStemElement = dayInfo.element;
  const dayStemYang = dayInfo.yang;

  // 천간 십신 계산
  const getStemSipsin = (stem: string): SipsinType => {
    const stemInfo = HEAVENLY_STEMS[stem as keyof typeof HEAVENLY_STEMS];
    if (!stemInfo) return 'bijeon';
    return calculateSipsin(dayStemElement, dayStemYang, stemInfo.element, stemInfo.yang);
  };

  // 지지 십신 계산 (본기 기준)
  const getBranchSipsin = (branch: string): SipsinType => {
    const branchInfo = EARTHLY_BRANCH_MAIN[branch as keyof typeof EARTHLY_BRANCH_MAIN];
    if (!branchInfo) return 'bijeon';
    return calculateSipsin(dayStemElement, dayStemYang, branchInfo.element, branchInfo.yang);
  };

  const yearStem = getStemSipsin(saju.year.heavenlyStem);
  const monthStem = getStemSipsin(saju.month.heavenlyStem);
  const dayStem = 'bijeon' as SipsinType; // 일간은 자신
  const hourStem = saju.time ? getStemSipsin(saju.time.heavenlyStem) : 'bijeon' as SipsinType;

  const yearBranch = getBranchSipsin(saju.year.earthlyBranch);
  const monthBranch = getBranchSipsin(saju.month.earthlyBranch);
  const dayBranch = getBranchSipsin(saju.day.earthlyBranch);
  const hourBranch = saju.time ? getBranchSipsin(saju.time.earthlyBranch) : 'bijeon' as SipsinType;

  // 분포 계산
  const allSipsin = [
    yearStem, monthStem, hourStem, // 일간 제외
    yearBranch, monthBranch, dayBranch, hourBranch
  ];

  const distribution: Record<SipsinType, number> = {
    bijeon: 0, geopjae: 0, siksin: 0, sanggwan: 0,
    jeongjae: 0, pyeonjae: 0, jeonggwan: 0, pyeongwan: 0,
    jeongin: 0, pyeonin: 0
  };

  allSipsin.forEach(sipsin => {
    distribution[sipsin]++;
  });

  // 카테고리 분포
  const categoryDistribution = {
    bigeop: distribution.bijeon + distribution.geopjae,
    siksang: distribution.siksin + distribution.sanggwan,
    jaesung: distribution.jeongjae + distribution.pyeonjae,
    gwansung: distribution.jeonggwan + distribution.pyeongwan,
    insung: distribution.jeongin + distribution.pyeonin
  };

  return {
    yearStem,
    monthStem,
    dayStem,
    hourStem,
    yearBranch,
    monthBranch,
    dayBranch,
    hourBranch,
    distribution,
    categoryDistribution
  };
}

export interface SipsinInterpretation {
  dominant: SipsinType[];
  missing: SipsinType[];
  balance: string;
  personality: string;
  career: string;
  advice: string;
}

/**
 * 십신 분석 해석 생성
 */
export function interpretSipsinChart(chart: SipsinChart): SipsinInterpretation {
  // 과다 십신 (2개 이상)
  const dominant = Object.entries(chart.distribution)
    .filter(([_, count]) => count >= 2)
    .map(([type]) => type as SipsinType);

  // 부재 십신
  const missing = Object.entries(chart.distribution)
    .filter(([_, count]) => count === 0)
    .map(([type]) => type as SipsinType);

  // 균형 분석
  const { bigeop, siksang, jaesung, gwansung, insung } = chart.categoryDistribution;
  let balance = '';

  if (bigeop > 3) {
    balance = '비겁이 과다하여 독립성은 강하나 협조가 어려울 수 있습니다.';
  } else if (siksang > 3) {
    balance = '식상이 과다하여 표현력이 뛰어나나 관을 해칠 수 있습니다.';
  } else if (jaesung > 3) {
    balance = '재성이 과다하여 재물에 집착할 수 있습니다.';
  } else if (gwansung > 3) {
    balance = '관성이 과다하여 스트레스와 압박이 많을 수 있습니다.';
  } else if (insung > 3) {
    balance = '인성이 과다하여 생각이 많고 실행력이 부족할 수 있습니다.';
  } else {
    balance = '전체적으로 균형 잡힌 배치입니다.';
  }

  // 성격 해석
  const dominantInfo = dominant.length > 0 ? SIPSIN_INFO[dominant[0]] : null;
  const personality = dominantInfo
    ? `${dominantInfo.korean}의 기운이 강하여 ${dominantInfo.personality}`
    : '다양한 십신이 균형있게 배치되어 융통성 있는 성격입니다.';

  // 직업 추천
  const careers = dominant.flatMap(d => SIPSIN_INFO[d].career);
  const uniqueCareers = [...new Set(careers)];
  const career = uniqueCareers.length > 0
    ? `추천 직업: ${uniqueCareers.slice(0, 4).join(', ')}`
    : '다양한 분야에서 능력을 발휘할 수 있습니다.';

  // 조언
  let advice = '';
  if (missing.length > 0) {
    const missingInfo = SIPSIN_INFO[missing[0]];
    advice = `${missingInfo.korean}이 부족하므로 ${missingInfo.strength}을 보완하면 좋습니다.`;
  } else if (dominant.length > 0) {
    const dominantWeakness = SIPSIN_INFO[dominant[0]].weakness;
    advice = `과다한 기운으로 인한 ${dominantWeakness}을 주의하세요.`;
  } else {
    advice = '균형 잡힌 사주이므로 자신의 장점을 살려 발전하세요.';
  }

  return {
    dominant,
    missing,
    balance,
    personality,
    career,
    advice
  };
}

export default {
  SIPSIN_INFO,
  calculateSipsin,
  analyzeSipsin,
  interpretSipsinChart
};
