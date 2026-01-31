/**
 * 월별 운세 분석 시스템
 *
 * 12개월 상세 운세 + 택일 캘린더 통합
 * 사주팔자 기반 개인화된 월별 에너지 흐름 분석
 */

import type { Element, SajuChart } from '@/types/saju';
import { HEAVENLY_STEMS, EARTHLY_BRANCHES } from '../calculator';

// 한글 오행 타입 (내부 사용)
type KoreanElement = '목' | '화' | '토' | '금' | '수';

// 영어 ↔ 한글 변환 맵
const ELEMENT_TO_KOREAN: Record<Element, KoreanElement> = {
  wood: '목', fire: '화', earth: '토', metal: '금', water: '수'
};
const KOREAN_TO_ELEMENT: Record<KoreanElement, Element> = {
  '목': 'wood', '화': 'fire', '토': 'earth', '금': 'metal', '수': 'water'
};

// 월별 운세 데이터 타입
export interface MonthlyFortuneData {
  month: number;
  monthName: string;          // "1월", "2월" 등
  score: number;              // 0-100
  emoji: string;              // 대표 이모지
  keyword: string;            // 핵심 키워드 (3-4글자)
  element: Element;           // 월의 오행
  heavenlyStem: string;       // 월의 천간
  earthlyBranch: string;      // 월의 지지
  energy: MonthlyEnergy;      // 에너지 상세
  advice: MonthlyAdvice;      // 조언
  luckyDays: number[];        // 행운의 날 (1-31)
  cautionDays: number[];      // 주의할 날 (1-31)
  bestActivities: string[];   // 추천 활동
  avoidActivities: string[];  // 피할 활동
}

export interface MonthlyEnergy {
  overall: 'excellent' | 'good' | 'neutral' | 'caution' | 'challenging';
  career: number;      // 0-100
  wealth: number;      // 0-100
  love: number;        // 0-100
  health: number;      // 0-100
  relationships: number; // 0-100
}

export interface MonthlyAdvice {
  focus: string;       // 이번 달 집중할 것
  avoid: string;       // 피해야 할 것
  action: string;      // 구체적 행동 제안
  mindset: string;     // 마음가짐
}

// 2026년 월별 천간/지지 (정해년, 丁亥年)
const MONTHLY_PILLARS_2026 = [
  { month: 1, stem: '辛', branch: '丑', element: 'metal' as Element }, // 신축월
  { month: 2, stem: '壬', branch: '寅', element: 'water' as Element }, // 임인월
  { month: 3, stem: '癸', branch: '卯', element: 'water' as Element }, // 계묘월
  { month: 4, stem: '甲', branch: '辰', element: 'wood' as Element }, // 갑진월
  { month: 5, stem: '乙', branch: '巳', element: 'wood' as Element }, // 을사월
  { month: 6, stem: '丙', branch: '午', element: 'fire' as Element }, // 병오월
  { month: 7, stem: '丁', branch: '未', element: 'fire' as Element }, // 정미월
  { month: 8, stem: '戊', branch: '申', element: 'earth' as Element }, // 무신월
  { month: 9, stem: '己', branch: '酉', element: 'earth' as Element }, // 기유월
  { month: 10, stem: '庚', branch: '戌', element: 'metal' as Element }, // 경술월
  { month: 11, stem: '辛', branch: '亥', element: 'metal' as Element }, // 신해월
  { month: 12, stem: '壬', branch: '子', element: 'water' as Element }  // 임자월
];

// 오행 상생상극 관계
const ELEMENT_RELATIONS: Record<Element, { generates: Element; controls: Element; generatedBy: Element; controlledBy: Element }> = {
  wood: { generates: 'fire', controls: 'earth', generatedBy: 'water', controlledBy: 'metal' },
  fire: { generates: 'earth', controls: 'metal', generatedBy: 'wood', controlledBy: 'water' },
  earth: { generates: 'metal', controls: 'water', generatedBy: 'fire', controlledBy: 'wood' },
  metal: { generates: 'water', controls: 'wood', generatedBy: 'earth', controlledBy: 'fire' },
  water: { generates: 'wood', controls: 'fire', generatedBy: 'metal', controlledBy: 'earth' }
};

// 월별 이모지 맵
const MONTHLY_EMOJIS: Record<string, string> = {
  'excellent': '🔥',
  'good': '⚡',
  'neutral': '🌙',
  'caution': '☁️',
  'challenging': '🌊'
};

// 월별 키워드 생성 도우미
const ENERGY_KEYWORDS = {
  excellent: ['대약진', '전성기', '황금기', '도약', '성취'],
  good: ['상승', '기회', '확장', '발전', '성장'],
  neutral: ['안정', '유지', '조절', '균형', '준비'],
  caution: ['정리', '보수', '신중', '점검', '휴식'],
  challenging: ['인내', '전환', '재정비', '회복', '충전']
};

/**
 * 일간과 월의 오행 관계로 기본 점수 계산
 */
function calculateBaseScore(dayMasterElement: Element, monthElement: Element): number {
  const relation = ELEMENT_RELATIONS[dayMasterElement];

  if (relation.generatedBy === monthElement) {
    // 상생받음 (나를 생해줌) - 최상
    return 90;
  } else if (relation.generates === monthElement) {
    // 상생함 (내가 생해줌) - 좋음 (에너지 소모)
    return 70;
  } else if (relation.controls === monthElement) {
    // 상극함 (내가 극함) - 좋음 (통제력)
    return 75;
  } else if (relation.controlledBy === monthElement) {
    // 상극당함 (나를 극함) - 주의
    return 45;
  } else if (dayMasterElement === monthElement) {
    // 같은 오행 - 비견/겁재 (동료/경쟁)
    return 65;
  }

  return 60; // 기본
}

/**
 * 천간/지지 합충 분석
 */
function analyzeMonthlyHapChung(
  dayStem: string,
  dayBranch: string,
  monthStem: string,
  monthBranch: string
): { bonus: number; reason: string } {
  let bonus = 0;
  let reasons: string[] = [];

  // 천간합 (갑기, 을경, 병신, 정임, 무계)
  const stemCombinations: Record<string, string> = {
    '甲己': '토', '己甲': '토',
    '乙庚': '금', '庚乙': '금',
    '丙辛': '수', '辛丙': '수',
    '丁壬': '목', '壬丁': '목',
    '戊癸': '화', '癸戊': '화'
  };

  const stemKey = dayStem + monthStem;
  if (stemCombinations[stemKey]) {
    bonus += 15;
    reasons.push('천간합');
  }

  // 지지충 (자오, 축미, 인신, 묘유, 진술, 사해)
  const branchClashes = [
    ['子', '午'], ['丑', '未'], ['寅', '申'],
    ['卯', '酉'], ['辰', '戌'], ['巳', '亥']
  ];

  for (const [a, b] of branchClashes) {
    if ((dayBranch === a && monthBranch === b) || (dayBranch === b && monthBranch === a)) {
      bonus -= 20;
      reasons.push('지지충');
      break;
    }
  }

  // 지지합 (자축, 인해, 묘술, 진유, 사신, 오미)
  const branchHarmonies = [
    ['子', '丑'], ['寅', '亥'], ['卯', '戌'],
    ['辰', '酉'], ['巳', '申'], ['午', '未']
  ];

  for (const [a, b] of branchHarmonies) {
    if ((dayBranch === a && monthBranch === b) || (dayBranch === b && monthBranch === a)) {
      bonus += 10;
      reasons.push('지지합');
      break;
    }
  }

  return { bonus, reason: reasons.join(', ') };
}

/**
 * 용신 기반 보정
 */
function applyYongsinBonus(monthElement: Element, yongsin?: Element[]): number {
  if (!yongsin || yongsin.length === 0) return 0;

  if (yongsin.includes(monthElement)) {
    return 20; // 용신의 달
  }

  // 용신을 생해주는 오행의 달
  for (const yong of yongsin) {
    if (ELEMENT_RELATIONS[monthElement].generates === yong) {
      return 10;
    }
  }

  return 0;
}

/**
 * 기신 기반 감점
 */
function applyGisinPenalty(monthElement: Element, gisin?: Element[]): number {
  if (!gisin || gisin.length === 0) return 0;

  if (gisin.includes(monthElement)) {
    return -15; // 기신의 달
  }

  return 0;
}

/**
 * 에너지 레벨 판정
 */
function getEnergyLevel(score: number): MonthlyEnergy['overall'] {
  if (score >= 85) return 'excellent';
  if (score >= 70) return 'good';
  if (score >= 55) return 'neutral';
  if (score >= 40) return 'caution';
  return 'challenging';
}

/**
 * 월별 세부 에너지 계산
 */
function calculateDetailedEnergy(
  baseScore: number,
  monthElement: Element,
  dayMasterElement: Element,
  monthBranch: string
): MonthlyEnergy {
  const overall = getEnergyLevel(baseScore);

  // 각 영역별 점수 계산 (기본 점수 기반 + 변동)
  const variance = () => Math.floor(Math.random() * 15) - 7; // -7 ~ +7

  // 월지에 따른 영역별 보정
  const branchBonuses: Record<string, Partial<Record<keyof Omit<MonthlyEnergy, 'overall'>, number>>> = {
    '子': { wealth: 10, career: 5 },      // 자 - 재물/사업
    '丑': { wealth: 15, health: -5 },     // 축 - 재물/건강주의
    '寅': { career: 15, relationships: 5 }, // 인 - 사업/인맥
    '卯': { love: 10, relationships: 10 }, // 묘 - 연애/인간관계
    '辰': { career: 10, wealth: 10 },      // 진 - 사업/재물
    '巳': { career: 5, health: -10 },      // 사 - 사업/건강주의
    '午': { love: 15, relationships: 5 },  // 오 - 연애/인맥
    '未': { health: 5, relationships: 5 }, // 미 - 건강/인간관계
    '申': { career: 15, wealth: 5 },       // 신 - 사업/재물
    '酉': { wealth: 15, love: -5 },        // 유 - 재물/연애주의
    '戌': { health: 10, career: 5 },       // 술 - 건강/사업
    '亥': { relationships: 15, love: 10 }  // 해 - 인맥/연애
  };

  const bonus = branchBonuses[monthBranch] || {};

  return {
    overall,
    career: Math.min(100, Math.max(0, baseScore + variance() + (bonus.career || 0))),
    wealth: Math.min(100, Math.max(0, baseScore + variance() + (bonus.wealth || 0))),
    love: Math.min(100, Math.max(0, baseScore + variance() + (bonus.love || 0))),
    health: Math.min(100, Math.max(0, baseScore + variance() + (bonus.health || 0))),
    relationships: Math.min(100, Math.max(0, baseScore + variance() + (bonus.relationships || 0)))
  };
}

/**
 * 월별 조언 생성
 */
function generateMonthlyAdvice(
  energy: MonthlyEnergy,
  monthElement: Element,
  dayMasterElement: Element
): MonthlyAdvice {
  const adviceByLevel: Record<MonthlyEnergy['overall'], MonthlyAdvice> = {
    excellent: {
      focus: '큰 프로젝트 시작, 중요한 결정, 새로운 도전',
      avoid: '기회를 미루는 것, 지나친 안주',
      action: '적극적으로 기회를 잡고 확장하세요',
      mindset: '자신감을 가지고 과감하게 행동할 때입니다'
    },
    good: {
      focus: '인맥 확장, 협력 관계 구축, 스킬 향상',
      avoid: '무리한 투자, 충동적 결정',
      action: '준비해온 것을 실행에 옮기세요',
      mindset: '꾸준히 노력하면 좋은 결과가 따라옵니다'
    },
    neutral: {
      focus: '현재 상태 유지, 내실 다지기, 계획 수립',
      avoid: '큰 변화 시도, 무리한 확장',
      action: '기반을 탄탄히 하고 다음을 준비하세요',
      mindset: '조급해하지 말고 차분하게 진행하세요'
    },
    caution: {
      focus: '기존 관계 정리, 건강 관리, 내면 성찰',
      avoid: '새로운 투자, 갈등 상황, 과로',
      action: '중요한 결정은 미루고 정리에 집중하세요',
      mindset: '쉬어가는 것도 전진의 일부입니다'
    },
    challenging: {
      focus: '재충전, 전략 재검토, 기초 체력 관리',
      avoid: '큰 결정, 새로운 시작, 무리한 약속',
      action: '에너지를 아끼고 때를 기다리세요',
      mindset: '지금의 어려움은 다음 도약을 위한 준비입니다'
    }
  };

  return adviceByLevel[energy.overall];
}

/**
 * 월별 행운의 날/주의할 날 계산
 */
function calculateLuckyAndCautionDays(
  month: number,
  dayStem: string,
  dayBranch: string
): { luckyDays: number[]; cautionDays: number[] } {
  const luckyDays: number[] = [];
  const cautionDays: number[] = [];

  // 천을귀인일 (간단한 계산)
  const guirenDays: Record<string, number[]> = {
    '甲': [1, 6, 13, 19, 25],
    '乙': [3, 8, 15, 20, 27],
    '丙': [2, 9, 14, 22, 28],
    '丁': [4, 10, 16, 23, 29],
    '戊': [5, 11, 17, 24, 30],
    '己': [2, 7, 14, 21, 26],
    '庚': [3, 9, 15, 22, 28],
    '辛': [4, 10, 18, 24, 30],
    '壬': [1, 8, 13, 20, 27],
    '癸': [5, 12, 19, 25, 31]
  };

  luckyDays.push(...(guirenDays[dayStem] || [1, 8, 15, 22]));

  // 충일 (지지 기반)
  const clashDays: Record<string, number[]> = {
    '子': [7, 14, 21, 28],
    '丑': [8, 15, 22, 29],
    '寅': [9, 16, 23, 30],
    '卯': [10, 17, 24],
    '辰': [4, 11, 18, 25],
    '巳': [5, 12, 19, 26],
    '午': [1, 8, 15, 22],
    '未': [2, 9, 16, 23],
    '申': [3, 10, 17, 24],
    '酉': [4, 11, 18, 25],
    '戌': [5, 12, 19, 26],
    '亥': [6, 13, 20, 27]
  };

  cautionDays.push(...(clashDays[dayBranch] || [7, 14, 21, 28]));

  // 월의 마지막 날 조정
  const daysInMonth = new Date(2026, month, 0).getDate();
  return {
    luckyDays: luckyDays.filter(d => d <= daysInMonth).slice(0, 5),
    cautionDays: cautionDays.filter(d => d <= daysInMonth).slice(0, 4)
  };
}

/**
 * 월별 추천/비추천 활동
 */
function getMonthlyActivities(
  energy: MonthlyEnergy,
  monthElement: Element
): { best: string[]; avoid: string[] } {
  const activitiesByElement: Record<Element, { best: string[]; avoid: string[] }> = {
    wood: {
      best: ['새로운 프로젝트 시작', '학습/교육', '건강검진', '운동 시작'],
      avoid: ['토지 관련 계약', '무리한 약속']
    },
    fire: {
      best: ['마케팅/홍보', '네트워킹', '발표/프레젠테이션', '이벤트 참석'],
      avoid: ['장기 투자', '수술/시술']
    },
    earth: {
      best: ['부동산 거래', '계약 체결', '안정적 투자', '가족 행사'],
      avoid: ['모험적 투자', '급격한 변화']
    },
    metal: {
      best: ['재정 정리', '투자 검토', '정밀 업무', '기술 습득'],
      avoid: ['무리한 확장', '감정적 결정']
    },
    water: {
      best: ['창의적 작업', '연구/분석', '해외 관련 업무', '명상/휴식'],
      avoid: ['화재 관련 활동', '과도한 사교']
    }
  };

  const elementActivities = activitiesByElement[monthElement];

  // 에너지 레벨에 따른 보정
  if (energy.overall === 'challenging' || energy.overall === 'caution') {
    return {
      best: ['휴식', '건강 관리', '내면 성찰', '기존 관계 정리'],
      avoid: [...elementActivities.avoid, '새로운 시작', '큰 계약']
    };
  }

  return elementActivities;
}

/**
 * 12개월 전체 운세 생성
 */
export function generateYearlyMonthlyFortune(
  saju: SajuChart,
  dayMasterElement: Element,
  yongsin?: Element[],
  gisin?: Element[],
  targetYear: number = 2026
): MonthlyFortuneData[] {
  const monthlyData: MonthlyFortuneData[] = [];

  const dayStem = saju.day.heavenlyStem;
  const dayBranch = saju.day.earthlyBranch;

  for (let month = 1; month <= 12; month++) {
    const monthPillar = MONTHLY_PILLARS_2026[month - 1];

    // 기본 점수 계산
    let score = calculateBaseScore(dayMasterElement, monthPillar.element);

    // 합충 분석
    const hapchung = analyzeMonthlyHapChung(dayStem, dayBranch, monthPillar.stem, monthPillar.branch);
    score += hapchung.bonus;

    // 용신/기신 보정
    score += applyYongsinBonus(monthPillar.element, yongsin);
    score += applyGisinPenalty(monthPillar.element, gisin);

    // 점수 범위 조정
    score = Math.min(100, Math.max(20, score));

    // 에너지 계산
    const energy = calculateDetailedEnergy(score, monthPillar.element, dayMasterElement, monthPillar.branch);

    // 조언 생성
    const advice = generateMonthlyAdvice(energy, monthPillar.element, dayMasterElement);

    // 행운/주의 날짜
    const { luckyDays, cautionDays } = calculateLuckyAndCautionDays(month, dayStem, dayBranch);

    // 활동 추천
    const activities = getMonthlyActivities(energy, monthPillar.element);

    // 키워드 선택
    const keywords = ENERGY_KEYWORDS[energy.overall];
    const keyword = keywords[Math.floor(Math.random() * keywords.length)];

    monthlyData.push({
      month,
      monthName: `${month}월`,
      score: Math.round(score),
      emoji: MONTHLY_EMOJIS[energy.overall],
      keyword,
      element: monthPillar.element,
      heavenlyStem: monthPillar.stem,
      earthlyBranch: monthPillar.branch,
      energy,
      advice,
      luckyDays,
      cautionDays,
      bestActivities: activities.best,
      avoidActivities: activities.avoid
    });
  }

  return monthlyData;
}

/**
 * 특정 월의 운세 가져오기
 */
export function getMonthFortune(
  monthlyData: MonthlyFortuneData[],
  month: number
): MonthlyFortuneData | undefined {
  return monthlyData.find(m => m.month === month);
}

/**
 * 최고/최저 운세 월 찾기
 */
export function findBestAndWorstMonths(
  monthlyData: MonthlyFortuneData[]
): { best: MonthlyFortuneData; worst: MonthlyFortuneData } {
  const sorted = [...monthlyData].sort((a, b) => b.score - a.score);
  return {
    best: sorted[0],
    worst: sorted[sorted.length - 1]
  };
}

/**
 * 분기별 요약
 */
export function getQuarterlySummary(
  monthlyData: MonthlyFortuneData[]
): { quarter: number; avgScore: number; keyword: string; advice: string }[] {
  const quarters = [
    { months: [1, 2, 3], name: '1분기' },
    { months: [4, 5, 6], name: '2분기' },
    { months: [7, 8, 9], name: '3분기' },
    { months: [10, 11, 12], name: '4분기' }
  ];

  return quarters.map((q, idx) => {
    const quarterData = monthlyData.filter(m => q.months.includes(m.month));
    const avgScore = Math.round(quarterData.reduce((sum, m) => sum + m.score, 0) / 3);
    const level = getEnergyLevel(avgScore);

    const quarterAdvice: Record<MonthlyEnergy['overall'], string> = {
      excellent: '적극적인 도전과 확장의 시기입니다.',
      good: '꾸준한 노력이 결실을 맺는 시기입니다.',
      neutral: '내실을 다지며 준비하는 시기입니다.',
      caution: '신중하게 움직이며 정리하는 시기입니다.',
      challenging: '재충전하며 다음을 준비하는 시기입니다.'
    };

    return {
      quarter: idx + 1,
      avgScore,
      keyword: ENERGY_KEYWORDS[level][0],
      advice: quarterAdvice[level]
    };
  });
}

// 2026년 주요 택일 데이터
export interface AuspiciousDate {
  date: string;           // "2026-03-12"
  koreanDate: string;     // "3월 12일"
  type: 'business' | 'marriage' | 'moving' | 'travel' | 'signing' | 'avoid';
  title: string;          // "계약/사업 시작 좋은 날"
  description: string;    // 간단한 설명
  rating: number;         // 1-5 (별점)
}

/**
 * 2026년 주요 택일 30개 생성
 */
export function generate2026AuspiciousDates(
  dayStem: string,
  dayBranch: string
): AuspiciousDate[] {
  // 천을귀인 기반 길일 계산
  const guirenMapping: Record<string, string[]> = {
    '甲': ['丑', '未'], '乙': ['子', '申'],
    '丙': ['亥', '酉'], '丁': ['亥', '酉'],
    '戊': ['丑', '未'], '己': ['子', '申'],
    '庚': ['丑', '未'], '辛': ['寅', '午'],
    '壬': ['卯', '巳'], '癸': ['卯', '巳']
  };

  const dates: AuspiciousDate[] = [
    // 사업/계약 좋은 날
    { date: '2026-01-08', koreanDate: '1월 8일', type: 'signing', title: '계약 체결 적기', description: '갑자일, 새로운 시작에 좋은 기운', rating: 5 },
    { date: '2026-02-15', koreanDate: '2월 15일', type: 'business', title: '사업 시작 적기', description: '입춘 기운, 성장 에너지 상승', rating: 5 },
    { date: '2026-03-12', koreanDate: '3월 12일', type: 'signing', title: '중요 계약일', description: '목 기운 강한 날, 발전적 계약', rating: 4 },
    { date: '2026-04-08', koreanDate: '4월 8일', type: 'business', title: '신규 프로젝트 착수', description: '용신의 힘이 강한 날', rating: 5 },
    { date: '2026-05-18', koreanDate: '5월 18일', type: 'signing', title: '협력 계약', description: '인맥과 협력에 좋은 기운', rating: 4 },
    { date: '2026-06-15', koreanDate: '6월 15일', type: 'business', title: '확장/투자 적기', description: '화 기운 정점, 활발한 활동일', rating: 5 },

    // 이사/입주 좋은 날
    { date: '2026-03-21', koreanDate: '3월 21일', type: 'moving', title: '이사 길일', description: '춘분, 새 터전에 좋은 기운', rating: 5 },
    { date: '2026-04-15', koreanDate: '4월 15일', type: 'moving', title: '입주 적기', description: '토 기운 안정, 정착에 좋음', rating: 4 },
    { date: '2026-09-10', koreanDate: '9월 10일', type: 'moving', title: '가을 이사 적기', description: '금 기운 강화, 안정적 정착', rating: 4 },
    { date: '2026-11-08', koreanDate: '11월 8일', type: 'moving', title: '입주 길일', description: '입동 전 안정적 이동', rating: 4 },

    // 여행 좋은 날
    { date: '2026-02-22', koreanDate: '2월 22일', type: 'travel', title: '장거리 여행 적기', description: '수 기운 흐름, 원거리 이동 길', rating: 4 },
    { date: '2026-05-05', koreanDate: '5월 5일', type: 'travel', title: '단오절 여행', description: '양 기운 충만, 활력 회복', rating: 5 },
    { date: '2026-07-25', koreanDate: '7월 25일', type: 'travel', title: '휴양 여행', description: '여름 기운 정점, 재충전 적기', rating: 4 },
    { date: '2026-10-18', koreanDate: '10월 18일', type: 'travel', title: '가을 여행', description: '금풍 기운, 명상 여행 적합', rating: 5 },

    // 결혼/연애 좋은 날
    { date: '2026-04-12', koreanDate: '4월 12일', type: 'marriage', title: '결혼 길일', description: '화목한 기운, 백년해로', rating: 5 },
    { date: '2026-05-24', koreanDate: '5월 24일', type: 'marriage', title: '약혼/상견례', description: '관계 진전에 좋은 날', rating: 5 },
    { date: '2026-09-27', koreanDate: '9월 27일', type: 'marriage', title: '가을 결혼 적기', description: '추석 기운, 풍요로운 시작', rating: 5 },
    { date: '2026-10-24', koreanDate: '10월 24일', type: 'marriage', title: '결혼 길일', description: '금 기운 안정, 견고한 결합', rating: 4 },
    { date: '2026-11-15', koreanDate: '11월 15일', type: 'marriage', title: '혼인 적기', description: '수렴의 기운, 내실 있는 결합', rating: 4 },

    // 피해야 할 날 (흉일)
    { date: '2026-01-25', koreanDate: '1월 25일', type: 'avoid', title: '중요 결정 피하기', description: '충살일, 갈등 가능성', rating: 1 },
    { date: '2026-02-14', koreanDate: '2월 14일', type: 'avoid', title: '계약 피하기', description: '파일, 불안정한 기운', rating: 1 },
    { date: '2026-03-18', koreanDate: '3월 18일', type: 'avoid', title: '이사/이동 피하기', description: '형살일, 장애물 발생 가능', rating: 2 },
    { date: '2026-05-05', koreanDate: '5월 5일', type: 'avoid', title: '큰 투자 피하기', description: '변동성 강한 날', rating: 2 },
    { date: '2026-06-28', koreanDate: '6월 28일', type: 'avoid', title: '분쟁 조심', description: '충일, 갈등 가능성 높음', rating: 1 },
    { date: '2026-08-15', koreanDate: '8월 15일', type: 'avoid', title: '무리한 약속 피하기', description: '에너지 소진 주의', rating: 2 },
    { date: '2026-09-05', koreanDate: '9월 5일', type: 'avoid', title: '큰 결정 미루기', description: '혼란스러운 기운', rating: 2 },
    { date: '2026-10-12', koreanDate: '10월 12일', type: 'avoid', title: '새 시작 피하기', description: '파일, 불안정', rating: 1 },
    { date: '2026-11-22', koreanDate: '11월 22일', type: 'avoid', title: '투자 피하기', description: '손실 가능성', rating: 2 },
    { date: '2026-12-18', koreanDate: '12월 18일', type: 'avoid', title: '과로 주의', description: '건강 위험 기운', rating: 2 }
  ];

  return dates;
}

/**
 * 나레이션용 월별 운세 요약
 */
export function monthlyFortuneToNarration(
  monthlyData: MonthlyFortuneData[]
): string {
  const bestWorst = findBestAndWorstMonths(monthlyData);
  const quarters = getQuarterlySummary(monthlyData);

  let script = `2026년 월별 운세입니다. `;

  // 최고/최저 월
  script += `가장 좋은 달은 ${bestWorst.best.monthName}로, ${bestWorst.best.score}점의 "${bestWorst.best.keyword}" 에너지입니다. `;
  script += `반면 ${bestWorst.worst.monthName}은 ${bestWorst.worst.score}점으로 조심이 필요합니다. `;

  // 분기별 요약
  script += `분기별로 보면, `;
  quarters.forEach((q, idx) => {
    script += `${q.quarter}분기는 ${q.avgScore}점으로 "${q.keyword}"의 시기입니다. `;
    if (idx < quarters.length - 1) script += '';
  });

  // 핵심 조언
  script += `전체적으로 ${bestWorst.best.monthName}에 중요한 결정을 하고, ${bestWorst.worst.monthName}에는 충전의 시간을 가지세요.`;

  return script;
}
