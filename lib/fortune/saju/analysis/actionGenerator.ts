/**
 * 액션플랜 생성기 (Action Plan Generator)
 * 월별 액션플랜, 인생 타임라인, 타이밍 분석
 */

import {
  UserInput, SajuChart, OhengBalance, Element,
  MonthlyAction, LifeTimeline, TimingAnalysis, InterestStrategy,
  InterestType, ELEMENT_KOREAN, INTEREST_KOREAN
} from '@/types/saju';
import { calculateAge, calculateWolun, calculateSeun, calculateDaeun } from '../calculator';
import { getLuckyColors, getLuckyNumbers, getLuckyDirections } from '../oheng';

// 월별 기본 에너지 (절기 기준)
const MONTHLY_ENERGY: Record<number, { element: Element; description: string }> = {
  1: { element: 'water', description: '축월(丑月) - 준비와 계획의 시기' },
  2: { element: 'wood', description: '인월(寅月) - 새로운 시작의 에너지' },
  3: { element: 'wood', description: '묘월(卯月) - 성장과 발전의 시기' },
  4: { element: 'earth', description: '진월(辰月) - 기반 다지기의 시기' },
  5: { element: 'fire', description: '사월(巳月) - 열정과 추진의 시기' },
  6: { element: 'fire', description: '오월(午月) - 최고조 에너지 시기' },
  7: { element: 'earth', description: '미월(未月) - 결실 준비의 시기' },
  8: { element: 'metal', description: '신월(申月) - 수확과 결단의 시기' },
  9: { element: 'metal', description: '유월(酉月) - 완성과 마무리의 시기' },
  10: { element: 'earth', description: '술월(戌月) - 정리와 저장의 시기' },
  11: { element: 'water', description: '해월(亥月) - 쉼과 충전의 시기' },
  12: { element: 'water', description: '자월(子月) - 내면 성찰의 시기' }
};

// 오행별 액션 카테고리
const ELEMENT_ACTIONS: Record<Element, {
  boost: { category: string; actions: string[] }[];
  avoid: string[];
}> = {
  wood: {
    boost: [
      { category: '학습/성장', actions: ['새로운 스킬 배우기', '온라인 강의 수강', '독서 모임 참여'] },
      { category: '시작/도전', actions: ['새 프로젝트 시작', '운동 루틴 시작', '취미 활동 시작'] },
      { category: '관계', actions: ['새로운 인맥 만들기', '멘토 찾기', '네트워킹 이벤트'] }
    ],
    avoid: ['과도한 휴식', '기회 미루기', '변화 회피']
  },
  fire: {
    boost: [
      { category: '표현/발표', actions: ['프레젠테이션', '아이디어 제안', 'SNS 활동 강화'] },
      { category: '열정/추진', actions: ['목표 재설정', '도전적 과제 수행', '리더십 발휘'] },
      { category: '사교', actions: ['모임 주최', '이벤트 참여', '관계 강화 활동'] }
    ],
    avoid: ['감정적 대응', '충동적 결정', '과로']
  },
  earth: {
    boost: [
      { category: '안정/기반', actions: ['재정 점검', '건강 검진', '집안 정리'] },
      { category: '신뢰/관계', actions: ['약속 지키기', '진정성 있는 대화', '가족 시간'] },
      { category: '계획', actions: ['장기 계획 수립', '예산 편성', '보험 점검'] }
    ],
    avoid: ['급격한 변화', '모험적 투자', '불안정한 결정']
  },
  metal: {
    boost: [
      { category: '결단/실행', actions: ['미뤄둔 결정 내리기', '계약 체결', '협상 진행'] },
      { category: '정리/완성', actions: ['프로젝트 마무리', '서류 정리', '목표 점검'] },
      { category: '전문성', actions: ['자격증 취득', '전문 지식 심화', '포트폴리오 정리'] }
    ],
    avoid: ['우유부단함', '마감 미루기', '완벽주의 과잉']
  },
  water: {
    boost: [
      { category: '휴식/충전', actions: ['명상', '온천/사우나', '충분한 수면'] },
      { category: '창의/사고', actions: ['브레인스토밍', '여행 계획', '새로운 관점 탐색'] },
      { category: '유연성', actions: ['플랜 B 준비', '대안 모색', '변화 수용 연습'] }
    ],
    avoid: ['경직된 태도', '휴식 없는 질주', '새로운 것 거부']
  }
};

/**
 * 월별 액션플랜 생성
 */
export function generateMonthlyActionPlan(
  saju: SajuChart,
  oheng: OhengBalance,
  year: number,
  yongsin: Element[]
): MonthlyAction[] {
  const seun = calculateSeun(year);
  const monthlyPlans: MonthlyAction[] = [];

  for (let month = 1; month <= 12; month++) {
    const wolun = calculateWolun(year, month);
    const monthEnergy = MONTHLY_ENERGY[month];

    // 월운 점수 계산
    const score = calculateMonthScore(
      saju.day.element,
      monthEnergy.element,
      wolun.element,
      yongsin
    );

    // 해야 할 일
    const mustDo = generateMustDoActions(
      yongsin,
      monthEnergy.element,
      score,
      month
    );

    // 피해야 할 일
    const mustAvoid = generateMustAvoidActions(
      saju.day.element,
      monthEnergy.element,
      score
    );

    // 행운 요소
    const luckyElements = {
      color: getLuckyColors(yongsin)[0] || '흰색',
      number: getLuckyNumbers(yongsin)[0] || 7,
      direction: getLuckyDirections(yongsin)[0] || '동쪽'
    };

    monthlyPlans.push({
      month,
      monthName: `${month}월`,
      score,
      mustDo,
      mustAvoid,
      luckyElements
    });
  }

  return monthlyPlans;
}

/**
 * 월 점수 계산
 */
function calculateMonthScore(
  dayElement: Element,
  monthElement: Element,
  wolunElement: Element,
  yongsin: Element[]
): number {
  let score = 70;

  // 용신과의 관계
  if (yongsin.includes(monthElement)) {
    score += 15;
  }
  if (yongsin.includes(wolunElement)) {
    score += 10;
  }

  // 상생 관계
  const generatingMap: Record<Element, Element> = {
    wood: 'fire', fire: 'earth', earth: 'metal', metal: 'water', water: 'wood'
  };

  if (generatingMap[monthElement] === dayElement) {
    score += 10; // 월이 나를 생함
  }
  if (generatingMap[dayElement] === monthElement) {
    score += 5; // 내가 월을 생함
  }

  // 상극 관계
  const controllingMap: Record<Element, Element> = {
    wood: 'earth', earth: 'water', water: 'fire', fire: 'metal', metal: 'wood'
  };

  if (controllingMap[monthElement] === dayElement) {
    score -= 15; // 월이 나를 극함
  }

  return Math.max(30, Math.min(100, score));
}

/**
 * 해야 할 일 생성
 */
function generateMustDoActions(
  yongsin: Element[],
  monthElement: Element,
  score: number,
  month: number
): { category: string; action: string; optimalDays: number[]; optimalTime: string }[] {
  const actions: { category: string; action: string; optimalDays: number[]; optimalTime: string }[] = [];

  // 용신 기반 액션
  for (const el of yongsin) {
    const elementActions = ELEMENT_ACTIONS[el];
    if (elementActions) {
      const categoryData = elementActions.boost[0];
      actions.push({
        category: categoryData.category,
        action: categoryData.actions[Math.floor(Math.random() * categoryData.actions.length)],
        optimalDays: getOptimalDays(month, el),
        optimalTime: getOptimalTime(el)
      });
    }
  }

  // 점수가 높은 달은 추가 액션
  if (score >= 80) {
    actions.push({
      category: '도전/기회',
      action: '새로운 도전이나 중요 결정에 좋은 시기',
      optimalDays: [1, 11, 21],
      optimalTime: '오전 9-11시'
    });
  }

  return actions.slice(0, 3);
}

/**
 * 피해야 할 일 생성
 */
function generateMustAvoidActions(
  dayElement: Element,
  monthElement: Element,
  score: number
): string[] {
  const avoids: string[] = [];

  // 상극 관계면 주의
  const controllingMap: Record<Element, Element> = {
    wood: 'earth', earth: 'water', water: 'fire', fire: 'metal', metal: 'wood'
  };

  if (controllingMap[monthElement] === dayElement) {
    avoids.push('큰 결정이나 계약은 신중하게');
    avoids.push('충동적인 투자 피하기');
  }

  // 점수 낮으면 추가 주의
  if (score < 50) {
    avoids.push('새로운 시작보다 유지에 집중');
    avoids.push('무리한 일정 피하기');
    avoids.push('건강 관리에 특히 주의');
  }

  // 기본 주의사항
  avoids.push(...ELEMENT_ACTIONS[dayElement].avoid.slice(0, 2));

  return [...new Set(avoids)].slice(0, 4);
}

/**
 * 인생 타임라인 생성
 */
export function generateLifeTimeline(
  user: UserInput,
  saju: SajuChart
): LifeTimeline {
  const currentAge = calculateAge(user.birthDate);
  const currentYear = new Date().getFullYear();

  // 대운 계산
  const daeunList = calculateDaeun(saju, user.gender, user.birthDate);

  // 인생 단계
  const phases = generateLifePhases(currentAge, saju, daeunList);

  // 터닝포인트
  const turningPoints = generateTurningPoints(currentAge, currentYear, daeunList, saju);

  // 골든윈도우
  const goldenWindows = generateGoldenWindows(currentAge, currentYear, saju, daeunList);

  return {
    currentAge,
    phases,
    turningPoints,
    goldenWindows
  };
}

/**
 * 인생 단계 생성
 */
function generateLifePhases(
  currentAge: number,
  saju: SajuChart,
  daeunList: { age: number; element: Element }[]
): LifeTimeline['phases'] {
  const phases: LifeTimeline['phases'] = [];

  // 현재 대운 찾기
  let currentDaeunIdx = 0;
  for (let i = 0; i < daeunList.length; i++) {
    if (daeunList[i].age <= currentAge) {
      currentDaeunIdx = i;
    }
  }

  // 현재 + 향후 3개 대운 분석
  for (let i = currentDaeunIdx; i < Math.min(currentDaeunIdx + 4, daeunList.length); i++) {
    const daeun = daeunList[i];
    const nextDaeun = daeunList[i + 1];
    const ageRange = nextDaeun
      ? `${daeun.age}-${nextDaeun.age - 1}세`
      : `${daeun.age}세 이후`;

    const phaseData = generatePhaseData(daeun.element, saju.day.element, i === currentDaeunIdx);

    phases.push({
      ageRange,
      phase: phaseData.phase,
      score: phaseData.score,
      opportunities: phaseData.opportunities,
      challenges: phaseData.challenges
    });
  }

  return phases;
}

/**
 * 단계별 데이터 생성
 */
function generatePhaseData(
  daeunElement: Element,
  dayElement: Element,
  isCurrent: boolean
): {
  phase: string;
  score: number;
  opportunities: string[];
  challenges: string[];
} {
  const phaseNames: Record<Element, string> = {
    wood: '성장기',
    fire: '도약기',
    earth: '안정기',
    metal: '수확기',
    water: '전환기'
  };

  // 기본 점수
  let score = 70;

  // 상생 보너스
  const generatingMap: Record<Element, Element> = {
    wood: 'fire', fire: 'earth', earth: 'metal', metal: 'water', water: 'wood'
  };

  if (generatingMap[daeunElement] === dayElement) {
    score += 15;
  }

  // 상극 감점
  const controllingMap: Record<Element, Element> = {
    wood: 'earth', earth: 'water', water: 'fire', fire: 'metal', metal: 'wood'
  };

  if (controllingMap[daeunElement] === dayElement) {
    score -= 15;
  }

  const opportunities = generateOpportunities(daeunElement, score);
  const challenges = generateChallenges(daeunElement, score);

  return {
    phase: isCurrent ? `현재 ${phaseNames[daeunElement]}` : phaseNames[daeunElement],
    score: Math.max(30, Math.min(100, score)),
    opportunities,
    challenges
  };
}

/**
 * 기회 생성
 */
function generateOpportunities(element: Element, score: number): string[] {
  const baseOpportunities: Record<Element, string[]> = {
    wood: ['새로운 학습 기회', '사업 확장 가능성', '인맥 확대'],
    fire: ['승진/인정 기회', '리더십 발휘', '창의적 프로젝트'],
    earth: ['안정적 수입', '자산 증식', '신뢰 관계 구축'],
    metal: ['성과 인정', '계약/협상 성공', '전문성 인정'],
    water: ['통찰력 향상', '유연한 적응', '새로운 가능성 발견']
  };

  const opps = [...baseOpportunities[element]];

  if (score >= 80) {
    opps.push('예상치 못한 행운');
  }

  return opps.slice(0, 3);
}

/**
 * 도전과제 생성
 */
function generateChallenges(element: Element, score: number): string[] {
  const baseChallenges: Record<Element, string[]> = {
    wood: ['과욕 주의', '경쟁 심화', '체력 관리'],
    fire: ['감정 조절', '번아웃 위험', '대인 갈등'],
    earth: ['변화 대응 어려움', '보수적 사고', '기회 놓침'],
    metal: ['완벽주의 스트레스', '유연성 부족', '인간관계 경직'],
    water: ['우유부단', '방향 혼란', '감정 기복']
  };

  const challenges = [...baseChallenges[element]];

  if (score < 50) {
    challenges.push('건강 악화 주의');
    challenges.push('재정적 어려움 가능성');
  }

  return challenges.slice(0, 3);
}

/**
 * 터닝포인트 생성
 */
function generateTurningPoints(
  currentAge: number,
  currentYear: number,
  daeunList: { age: number; element: Element }[],
  saju: SajuChart
): LifeTimeline['turningPoints'] {
  const points: LifeTimeline['turningPoints'] = [];

  // 대운 전환점
  for (const daeun of daeunList) {
    if (daeun.age > currentAge && daeun.age <= currentAge + 20) {
      points.push({
        age: daeun.age,
        year: currentYear + (daeun.age - currentAge),
        event: `대운 전환 - ${ELEMENT_KOREAN[daeun.element]} 시대 시작`,
        importance: 'critical'
      });
    }
  }

  // 10년 단위 터닝포인트
  const nextDecade = Math.ceil(currentAge / 10) * 10;
  if (nextDecade > currentAge && nextDecade <= currentAge + 15) {
    points.push({
      age: nextDecade,
      year: currentYear + (nextDecade - currentAge),
      event: `${nextDecade}대 진입 - 라이프스타일 재점검 시기`,
      importance: 'important'
    });
  }

  // 특수 연령대
  const specialAges = [
    { age: 40, event: '인생 후반 설계 시작점', importance: 'important' as const },
    { age: 50, event: '제2의 인생 본격화', importance: 'critical' as const },
    { age: 60, event: '시니어 라이프 전환', importance: 'critical' as const }
  ];

  for (const special of specialAges) {
    if (special.age > currentAge && special.age <= currentAge + 20) {
      points.push({
        age: special.age,
        year: currentYear + (special.age - currentAge),
        event: special.event,
        importance: special.importance
      });
    }
  }

  return points.sort((a, b) => a.age - b.age);
}

/**
 * 골든윈도우 생성
 */
function generateGoldenWindows(
  currentAge: number,
  currentYear: number,
  saju: SajuChart,
  daeunList: { age: number; element: Element }[]
): LifeTimeline['goldenWindows'] {
  const windows: LifeTimeline['goldenWindows'] = [];

  // 현재 대운에서 가장 좋은 시기 찾기
  const currentDaeun = daeunList.find(d => d.age <= currentAge && d.age + 10 > currentAge);

  if (currentDaeun) {
    // 재물 골든윈도우
    windows.push({
      period: `${currentYear}-${currentYear + 2}`,
      purpose: '재물 증식',
      successRate: 72
    });

    // 커리어 골든윈도우
    windows.push({
      period: `${currentYear + 1}-${currentYear + 3}`,
      purpose: '커리어 도약',
      successRate: 68
    });

    // 관계 골든윈도우
    windows.push({
      period: `${currentYear}-${currentYear + 1}`,
      purpose: '중요한 인연',
      successRate: 75
    });
  }

  return windows;
}

/**
 * 타이밍 분석 생성
 */
export function generateTimingAnalysis(
  saju: SajuChart,
  currentConcern?: string
): TimingAnalysis {
  const today = new Date();
  const currentMonth = today.getMonth() + 1;
  const monthEnergy = MONTHLY_ENERGY[currentMonth];

  // 현재 창이 열려있는지 확인
  const isWindowOpen = monthEnergy.element === saju.day.element ||
    ['wood', 'fire'].includes(monthEnergy.element);

  // 남은 일수 계산 (다음 절기까지)
  const nextSolarTerm = getNextSolarTermDate(today);
  const remainingDays = Math.ceil(
    (nextSolarTerm.getTime() - today.getTime()) / (1000 * 60 * 60 * 24)
  );

  return {
    currentWindow: {
      isOpen: isWindowOpen,
      remainingDays,
      missedConsequence: isWindowOpen
        ? '이 기회를 놓치면 비슷한 조건이 4-6개월 후에 옵니다'
        : '현재는 준비 시기입니다. 다음 기회를 위해 기반을 다지세요',
      recoveryTime: isWindowOpen ? '4-6개월' : '1-2개월'
    },
    nextOpportunity: {
      date: getNextGoldenDate(saju),
      probability: isWindowOpen ? 82 : 65
    }
  };
}

/**
 * 관심사별 전략 생성
 */
export function generateInterestStrategies(
  interests: InterestType[],
  saju: SajuChart,
  oheng: OhengBalance,
  yongsin: Element[]
): InterestStrategy[] {
  return interests.map((interest, index) => {
    const alignment = calculateInterestAlignment(interest, saju.day.element, oheng);

    return {
      interest,
      priority: index + 1,
      sajuAlignment: alignment,
      timing: getInterestTiming(interest, alignment),
      doList: getInterestDoList(interest, yongsin),
      dontList: getInterestDontList(interest, saju.day.element),
      specificAdvice: getInterestSpecificAdvice(interest, alignment, saju)
    };
  });
}

// ===== 헬퍼 함수들 =====

function getOptimalDays(month: number, element: Element): number[] {
  // 오행별 좋은 날짜 (간략화)
  const baseDays: Record<Element, number[]> = {
    wood: [3, 8, 13, 18, 23, 28],
    fire: [2, 7, 12, 17, 22, 27],
    earth: [5, 10, 15, 20, 25, 30],
    metal: [4, 9, 14, 19, 24, 29],
    water: [1, 6, 11, 16, 21, 26]
  };
  return baseDays[element].slice(0, 3);
}

function getOptimalTime(element: Element): string {
  const times: Record<Element, string> = {
    wood: '오전 5-9시',
    fire: '오전 9시-오후 1시',
    earth: '오후 1-5시',
    metal: '오후 5-9시',
    water: '밤 9시-새벽 1시'
  };
  return times[element];
}

function getNextSolarTermDate(from: Date): Date {
  // 다음 절기 (간략화 - 다음 달 5일 전후)
  const next = new Date(from);
  next.setMonth(next.getMonth() + 1);
  next.setDate(5);
  return next;
}

function getNextGoldenDate(saju: SajuChart): string {
  const today = new Date();
  const goldenMonth = today.getMonth() + 3; // 3개월 후
  const goldenDate = new Date(today.getFullYear(), goldenMonth, 1);
  return goldenDate.toISOString().split('T')[0];
}

function calculateInterestAlignment(
  interest: InterestType,
  dayElement: Element,
  oheng: OhengBalance
): number {
  // 관심사와 오행 매핑
  const interestElements: Partial<Record<InterestType, Element[]>> = {
    investment: ['metal', 'water'],
    health: ['wood', 'earth'],
    career: ['fire', 'metal'],
    romance: ['fire', 'water'],
    realestate: ['earth', 'metal']
  };

  const matchElements = interestElements[interest] || ['earth'];
  let alignment = 60;

  for (const el of matchElements) {
    if (oheng[el] >= 2) alignment += 15;
    if (el === dayElement) alignment += 10;
  }

  return Math.min(100, alignment);
}

function getInterestTiming(interest: InterestType, alignment: number): string {
  if (alignment >= 80) {
    return '지금이 최적의 시기입니다. 적극적으로 추진하세요.';
  } else if (alignment >= 60) {
    return '조건이 좋은 편입니다. 준비 후 실행하세요.';
  }
  return '기반을 먼저 다지는 시기입니다. 학습과 준비에 집중하세요.';
}

function getInterestDoList(interest: InterestType, yongsin: Element[]): string[] {
  const baseLists: Partial<Record<InterestType, string[]>> = {
    investment: ['분산 투자 전략 수립', '재무 공부', '전문가 상담'],
    health: ['정기 검진', '규칙적 운동', '식단 관리'],
    career: ['스킬 업그레이드', '네트워킹', '포트폴리오 정리'],
    romance: ['자기 관리', '새로운 만남', '소통 연습'],
    realestate: ['시장 조사', '자금 계획', '전문가 상담']
  };

  return baseLists[interest] || ['목표 설정', '계획 수립', '실행'];
}

function getInterestDontList(interest: InterestType, dayElement: Element): string[] {
  const baseLists: Partial<Record<InterestType, string[]>> = {
    investment: ['충동적 투자', '빚 내서 투자', '한 곳에 몰빵'],
    health: ['무리한 운동', '식단 극단주의', '검진 미루기'],
    career: ['감정적 퇴사', '준비 없는 이직', '관계 소홀'],
    romance: ['집착', '급한 결정', '자기 비하']
  };

  return baseLists[interest] || ['급한 결정', '과욕', '무리한 추진'];
}

function getInterestSpecificAdvice(
  interest: InterestType,
  alignment: number,
  saju: SajuChart
): string {
  const dayElement = saju.day.element;

  if (interest === 'investment' && dayElement === 'fire') {
    return '충동적 투자 결정을 피하세요. 24시간 룰을 적용하면 손실을 줄일 수 있습니다.';
  }

  if (interest === 'career' && dayElement === 'wood') {
    return '성장 에너지가 강합니다. 새로운 도전에 유리하지만, 기존 관계도 소중히 하세요.';
  }

  if (alignment >= 80) {
    return `${INTEREST_KOREAN[interest]}에 대한 사주 적합도가 높습니다. 적극적으로 추진하되, 과욕은 금물입니다.`;
  }

  return `기반을 다지는 시기입니다. ${INTEREST_KOREAN[interest]} 관련 학습과 준비에 집중하세요.`;
}
