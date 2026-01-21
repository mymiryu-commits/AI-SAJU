/**
 * 사주팔자 (四柱八字) Calculator
 * Calculates the Four Pillars of Destiny based on birth date and time
 */

// 천간 (Heavenly Stems) - 10 stems
export const HEAVENLY_STEMS = ['甲', '乙', '丙', '丁', '戊', '己', '庚', '辛', '壬', '癸'] as const;
export const HEAVENLY_STEMS_KOREAN = ['갑', '을', '병', '정', '무', '기', '경', '신', '임', '계'] as const;

// 지지 (Earthly Branches) - 12 branches
export const EARTHLY_BRANCHES = ['子', '丑', '寅', '卯', '辰', '巳', '午', '未', '申', '酉', '戌', '亥'] as const;
export const EARTHLY_BRANCHES_KOREAN = ['자', '축', '인', '묘', '진', '사', '오', '미', '신', '유', '술', '해'] as const;

// 십이지 동물 (12 Animals)
export const ZODIAC_ANIMALS = ['쥐', '소', '호랑이', '토끼', '용', '뱀', '말', '양', '원숭이', '닭', '개', '돼지'] as const;

// 오행 (Five Elements)
export const FIVE_ELEMENTS = ['木', '火', '土', '金', '水'] as const;
export const FIVE_ELEMENTS_KOREAN = ['목', '화', '토', '금', '수'] as const;

// 천간 오행 배속
export const STEM_ELEMENTS: Record<string, string> = {
  '甲': '木', '乙': '木',
  '丙': '火', '丁': '火',
  '戊': '土', '己': '土',
  '庚': '金', '辛': '金',
  '壬': '水', '癸': '水',
};

// 지지 오행 배속
export const BRANCH_ELEMENTS: Record<string, string> = {
  '子': '水', '丑': '土', '寅': '木', '卯': '木',
  '辰': '土', '巳': '火', '午': '火', '未': '土',
  '申': '金', '酉': '金', '戌': '土', '亥': '水',
};

// 지지 시간 배속 (시주 계산용)
export const BRANCH_HOURS: Record<number, number> = {
  23: 0, 0: 0, 1: 1, 2: 1, 3: 2, 4: 2, 5: 3, 6: 3,
  7: 4, 8: 4, 9: 5, 10: 5, 11: 6, 12: 6, 13: 7, 14: 7,
  15: 8, 16: 8, 17: 9, 18: 9, 19: 10, 20: 10, 21: 11, 22: 11,
};

// 절기 데이터 (2000-2030년 간략화 - 실제로는 더 정확한 만세력 필요)
// 월별 절기 시작일 (대략적)
export const SOLAR_TERMS_START = [
  [2, 4],   // 1월 - 소한 후 입춘 전까지는 전년도 12월로 계산
  [2, 4],   // 2월 - 입춘 (寅월 시작)
  [3, 6],   // 3월 - 경칩 (卯월 시작)
  [4, 5],   // 4월 - 청명 (辰월 시작)
  [5, 6],   // 5월 - 입하 (巳월 시작)
  [6, 6],   // 6월 - 망종 (午월 시작)
  [7, 7],   // 7월 - 소서 (未월 시작)
  [8, 8],   // 8월 - 입추 (申월 시작)
  [9, 8],   // 9월 - 백로 (酉월 시작)
  [10, 8],  // 10월 - 한로 (戌월 시작)
  [11, 7],  // 11월 - 입동 (亥월 시작)
  [12, 7],  // 12월 - 대설 (子월 시작)
];

export interface FourPillars {
  year: { stem: string; branch: string; element: string; animal: string };
  month: { stem: string; branch: string; element: string };
  day: { stem: string; branch: string; element: string };
  hour: { stem: string; branch: string; element: string };
}

export interface ElementBalance {
  木: number;
  火: number;
  土: number;
  金: number;
  水: number;
}

export interface SajuAnalysis {
  fourPillars: FourPillars;
  dayMaster: string;           // 일간 (Day Stem) - 사주의 주인공
  dayMasterElement: string;    // 일간의 오행
  elementBalance: ElementBalance;
  strongElements: string[];    // 강한 오행
  weakElements: string[];      // 약한 오행
  characteristics: string[];   // 성격 특성
  career: string[];           // 적합 직업
  health: string[];           // 건강 주의사항
  relationships: string[];    // 대인관계 특성
  luckyElements: string[];    // 용신 (도움이 되는 오행)
  unluckyElements: string[];  // 기신 (피해야 할 오행)
}

/**
 * 년주 (Year Pillar) 계산
 * 입춘(양력 2월 4일경) 기준으로 년도가 바뀜
 */
export function calculateYearPillar(year: number, month: number, day: number): { stem: string; branch: string } {
  // 입춘 전이면 전년도로 계산
  let adjustedYear = year;
  if (month < 2 || (month === 2 && day < 4)) {
    adjustedYear = year - 1;
  }

  // 천간: (년도 - 4) % 10
  const stemIndex = (adjustedYear - 4) % 10;
  // 지지: (년도 - 4) % 12
  const branchIndex = (adjustedYear - 4) % 12;

  return {
    stem: HEAVENLY_STEMS[stemIndex >= 0 ? stemIndex : stemIndex + 10],
    branch: EARTHLY_BRANCHES[branchIndex >= 0 ? branchIndex : branchIndex + 12],
  };
}

/**
 * 월주 (Month Pillar) 계산
 * 절기 기준으로 월이 바뀜
 */
export function calculateMonthPillar(year: number, month: number, day: number): { stem: string; branch: string } {
  // 절기 기준 월 계산 (인월=1, 묘월=2, ...)
  let lunarMonth = month - 1; // 0-indexed

  // 절기 시작일 이전이면 전월로
  const solarTermDay = SOLAR_TERMS_START[month - 1]?.[1] || 4;
  if (day < solarTermDay) {
    lunarMonth = lunarMonth - 1;
    if (lunarMonth < 0) lunarMonth = 11;
  }

  // 인월(寅)이 1월이므로 조정
  const branchIndex = (lunarMonth + 2) % 12;

  // 년간에 따른 월간 계산 (년간 × 2 + 월지)
  const yearPillar = calculateYearPillar(year, month, day);
  const yearStemIndex = (HEAVENLY_STEMS as readonly string[]).indexOf(yearPillar.stem);

  // 월간 계산 공식: (년간 % 5) * 2 + 월지
  const monthStemBase = (yearStemIndex % 5) * 2;
  const stemIndex = (monthStemBase + lunarMonth) % 10;

  return {
    stem: HEAVENLY_STEMS[stemIndex],
    branch: EARTHLY_BRANCHES[branchIndex],
  };
}

/**
 * 일주 (Day Pillar) 계산
 * 1900년 1월 1일이 갑진일(甲辰日)임을 기준으로 계산
 */
export function calculateDayPillar(year: number, month: number, day: number): { stem: string; branch: string } {
  // 1900년 1월 1일부터의 일수 계산
  const baseDate = new Date(1900, 0, 1);
  const targetDate = new Date(year, month - 1, day);
  const diffDays = Math.floor((targetDate.getTime() - baseDate.getTime()) / (1000 * 60 * 60 * 24));

  // 1900년 1월 1일 = 갑진(甲辰) = 천간 0, 지지 4
  const stemIndex = (diffDays + 0) % 10;
  const branchIndex = (diffDays + 4) % 12;

  return {
    stem: HEAVENLY_STEMS[stemIndex >= 0 ? stemIndex : stemIndex + 10],
    branch: EARTHLY_BRANCHES[branchIndex >= 0 ? branchIndex : branchIndex + 12],
  };
}

/**
 * 시주 (Hour Pillar) 계산
 */
export function calculateHourPillar(year: number, month: number, day: number, hour: number): { stem: string; branch: string } {
  // 시간에 따른 지지
  const branchIndex = BRANCH_HOURS[hour] ?? 0;

  // 일간에 따른 시간 계산
  const dayPillar = calculateDayPillar(year, month, day);
  const dayStemIndex = (HEAVENLY_STEMS as readonly string[]).indexOf(dayPillar.stem);

  // 시간 계산 공식: (일간 % 5) * 2 + 시지
  const hourStemBase = (dayStemIndex % 5) * 2;
  const stemIndex = (hourStemBase + branchIndex) % 10;

  return {
    stem: HEAVENLY_STEMS[stemIndex],
    branch: EARTHLY_BRANCHES[branchIndex],
  };
}

/**
 * 사주팔자 전체 계산
 */
export function calculateFourPillars(
  year: number,
  month: number,
  day: number,
  hour: number = 12
): FourPillars {
  const yearPillar = calculateYearPillar(year, month, day);
  const monthPillar = calculateMonthPillar(year, month, day);
  const dayPillar = calculateDayPillar(year, month, day);
  const hourPillar = calculateHourPillar(year, month, day, hour);

  const branchIndex = (EARTHLY_BRANCHES as readonly string[]).indexOf(yearPillar.branch);

  return {
    year: {
      ...yearPillar,
      element: `${STEM_ELEMENTS[yearPillar.stem]}(${FIVE_ELEMENTS_KOREAN[(FIVE_ELEMENTS as readonly string[]).indexOf(STEM_ELEMENTS[yearPillar.stem])]})`,
      animal: ZODIAC_ANIMALS[branchIndex >= 0 ? branchIndex : 0],
    },
    month: {
      ...monthPillar,
      element: `${STEM_ELEMENTS[monthPillar.stem]}(${FIVE_ELEMENTS_KOREAN[(FIVE_ELEMENTS as readonly string[]).indexOf(STEM_ELEMENTS[monthPillar.stem])]})`,
    },
    day: {
      ...dayPillar,
      element: `${STEM_ELEMENTS[dayPillar.stem]}(${FIVE_ELEMENTS_KOREAN[(FIVE_ELEMENTS as readonly string[]).indexOf(STEM_ELEMENTS[dayPillar.stem])]})`,
    },
    hour: {
      ...hourPillar,
      element: `${STEM_ELEMENTS[hourPillar.stem]}(${FIVE_ELEMENTS_KOREAN[(FIVE_ELEMENTS as readonly string[]).indexOf(STEM_ELEMENTS[hourPillar.stem])]})`,
    },
  };
}

/**
 * 오행 균형 계산
 */
export function calculateElementBalance(fourPillars: FourPillars): ElementBalance {
  const balance: ElementBalance = { 木: 0, 火: 0, 土: 0, 金: 0, 水: 0 };

  // 각 주의 천간과 지지의 오행 계산
  const pillars = [fourPillars.year, fourPillars.month, fourPillars.day, fourPillars.hour];

  pillars.forEach((pillar, index) => {
    // 천간 오행 (가중치: 일간 > 월간 > 년간/시간)
    const stemElement = STEM_ELEMENTS[pillar.stem] as keyof ElementBalance;
    const stemWeight = index === 2 ? 3 : index === 1 ? 2 : 1;
    if (stemElement) balance[stemElement] += stemWeight;

    // 지지 오행
    const branchElement = BRANCH_ELEMENTS[pillar.branch] as keyof ElementBalance;
    const branchWeight = index === 2 ? 2 : 1;
    if (branchElement) balance[branchElement] += branchWeight;
  });

  return balance;
}

/**
 * 종합 사주 분석
 */
export function analyzeSaju(
  year: number,
  month: number,
  day: number,
  hour: number = 12
): SajuAnalysis {
  const fourPillars = calculateFourPillars(year, month, day, hour);
  const elementBalance = calculateElementBalance(fourPillars);

  // 일간 (Day Master)
  const dayMaster = fourPillars.day.stem;
  const dayMasterElement = STEM_ELEMENTS[dayMaster];

  // 오행 강약 분석
  const sortedElements = Object.entries(elementBalance)
    .sort(([, a], [, b]) => b - a);

  const strongElements = sortedElements.slice(0, 2).map(([el]) => el);
  const weakElements = sortedElements.slice(-2).map(([el]) => el);

  // 용신/기신 계산 (간략화)
  const luckyElements = weakElements;
  const unluckyElements = strongElements.slice(0, 1);

  // 일간별 특성 분석
  const characteristics = getDayMasterCharacteristics(dayMaster);
  const career = getCareerSuggestions(dayMasterElement, strongElements);
  const health = getHealthAdvice(weakElements);
  const relationships = getRelationshipTraits(dayMaster, elementBalance);

  return {
    fourPillars,
    dayMaster,
    dayMasterElement,
    elementBalance,
    strongElements,
    weakElements,
    characteristics,
    career,
    health,
    relationships,
    luckyElements,
    unluckyElements,
  };
}

/**
 * 일간별 성격 특성
 */
function getDayMasterCharacteristics(dayMaster: string): string[] {
  const traits: Record<string, string[]> = {
    '甲': ['진취적이고 리더십이 강함', '정의감이 뛰어나고 곧음', '새로운 시작을 좋아함', '때로는 고집이 셀 수 있음'],
    '乙': ['유연하고 적응력이 뛰어남', '부드럽고 인내심이 강함', '예술적 감각이 있음', '협조적이고 조화로움'],
    '丙': ['밝고 열정적임', '리더십과 카리스마가 있음', '낙관적이고 활발함', '때로는 성급할 수 있음'],
    '丁': ['섬세하고 따뜻함', '지적이고 분석적임', '헌신적이고 배려심이 깊음', '감정적으로 예민할 수 있음'],
    '戊': ['신뢰할 수 있고 안정적임', '포용력이 크고 든든함', '책임감이 강함', '변화를 싫어할 수 있음'],
    '己': ['꼼꼼하고 실용적임', '배려심이 깊고 겸손함', '인내심이 강함', '걱정이 많을 수 있음'],
    '庚': ['결단력이 있고 의지가 강함', '정의롭고 원칙적임', '강인하고 용감함', '완고할 수 있음'],
    '辛': ['예리하고 심미안이 뛰어남', '섬세하고 품위가 있음', '완벽주의 성향', '예민할 수 있음'],
    '壬': ['지혜롭고 통찰력이 뛰어남', '대범하고 포용력이 있음', '창의적이고 자유로움', '변덕스러울 수 있음'],
    '癸': ['직관적이고 영적 감각이 뛰어남', '부드럽고 적응력이 좋음', '상상력이 풍부함', '우유부단할 수 있음'],
  };

  return traits[dayMaster] || ['분석 데이터가 부족합니다'];
}

/**
 * 적합 직업 추천
 */
function getCareerSuggestions(dayMasterElement: string, strongElements: string[]): string[] {
  const careers: Record<string, string[]> = {
    '木': ['교육자', '연구원', '작가', '디자이너', '의료인', '환경 관련 직종'],
    '火': ['연예인', '마케터', '강사', '홍보', '서비스업', '요식업'],
    '土': ['부동산', '건축', '농업', '금융', '행정', '중개업'],
    '金': ['법조인', '군인', '경찰', '엔지니어', '금속/기계 관련', 'IT'],
    '水': ['무역', '유통', '여행업', '수산업', '컨설턴트', '기획'],
  };

  const result = careers[dayMasterElement] || [];
  strongElements.forEach(el => {
    if (careers[el]) {
      result.push(...careers[el].slice(0, 2));
    }
  });

  return [...new Set(result)].slice(0, 6);
}

/**
 * 건강 조언
 */
function getHealthAdvice(weakElements: string[]): string[] {
  const health: Record<string, string[]> = {
    '木': ['간, 담낭 건강에 주의', '눈 건강 관리 필요', '스트레칭과 유연성 운동 권장'],
    '火': ['심장, 혈액순환에 주의', '눈과 혀 건강 관리', '과로와 스트레스 관리 필요'],
    '土': ['소화기 건강에 주의', '비장, 위장 관리 필요', '규칙적인 식습관 중요'],
    '金': ['폐, 호흡기 건강에 주의', '피부 관리 필요', '호흡 운동과 명상 권장'],
    '水': ['신장, 방광 건강에 주의', '뼈와 관절 관리 필요', '충분한 수분 섭취 중요'],
  };

  const result: string[] = [];
  weakElements.forEach(el => {
    if (health[el]) {
      result.push(...health[el]);
    }
  });

  return result.slice(0, 4);
}

/**
 * 대인관계 특성
 */
function getRelationshipTraits(dayMaster: string, balance: ElementBalance): string[] {
  const stemIndex = (HEAVENLY_STEMS as readonly string[]).indexOf(dayMaster);
  const isYang = stemIndex % 2 === 0; // 양간/음간

  const traits: string[] = [];

  if (isYang) {
    traits.push('적극적이고 주도적인 관계를 선호합니다');
    traits.push('자신의 의견을 명확히 표현합니다');
  } else {
    traits.push('조화롭고 협력적인 관계를 선호합니다');
    traits.push('상대방의 의견을 잘 수용합니다');
  }

  if (balance['火'] >= 3) {
    traits.push('사교적이고 인기가 많습니다');
  }
  if (balance['水'] >= 3) {
    traits.push('지혜롭게 관계를 조율합니다');
  }
  if (balance['土'] >= 3) {
    traits.push('신뢰할 수 있는 친구입니다');
  }

  return traits.slice(0, 4);
}

/**
 * 한글 천간지지 변환
 */
export function toKorean(pillar: { stem: string; branch: string }): string {
  const stemIndex = (HEAVENLY_STEMS as readonly string[]).indexOf(pillar.stem);
  const branchIndex = (EARTHLY_BRANCHES as readonly string[]).indexOf(pillar.branch);

  const koreanStem = HEAVENLY_STEMS_KOREAN[stemIndex] || pillar.stem;
  const koreanBranch = EARTHLY_BRANCHES_KOREAN[branchIndex] || pillar.branch;

  return `${koreanStem}${koreanBranch}(${pillar.stem}${pillar.branch})`;
}
