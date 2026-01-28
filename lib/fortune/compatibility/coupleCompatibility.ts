/**
 * 커플 궁합 분석 모듈
 *
 * 연인/배우자 간의 사주 궁합을 분석합니다.
 */

import type { SajuChart } from '@/types/saju';
import { checkBranchRelation, checkSamhap } from '../saju/analysis/hapchung';

export interface PersonInfo {
  name?: string;
  gender: 'male' | 'female';
  sajuChart: SajuChart;
  birthDate?: string;
}

export interface CompatibilityCategory {
  name: string;
  score: number; // 0-100
  description: string;
  details: string[];
}

export interface CoupleCompatibilityResult {
  totalScore: number; // 0-100
  grade: 'S' | 'A' | 'B' | 'C' | 'D';
  gradeDescription: string;
  categories: {
    dayMaster: CompatibilityCategory;    // 일간 궁합
    earthlyBranch: CompatibilityCategory; // 지지 궁합
    oheng: CompatibilityCategory;         // 오행 상생상극
    yongsin: CompatibilityCategory;       // 용신 보완
  };
  strengths: string[];
  challenges: string[];
  advice: string[];
  synergy: {
    communication: number;  // 소통
    passion: number;        // 열정
    stability: number;      // 안정
    growth: number;         // 성장
    trust: number;          // 신뢰
  };
}

// 천간 오행 매핑
const STEM_ELEMENT: Record<string, string> = {
  '甲': '木', '乙': '木',
  '丙': '火', '丁': '火',
  '戊': '土', '己': '土',
  '庚': '金', '辛': '金',
  '壬': '水', '癸': '水'
};

// 천간 음양 매핑
const STEM_YANG: Record<string, boolean> = {
  '甲': true, '乙': false,
  '丙': true, '丁': false,
  '戊': true, '己': false,
  '庚': true, '辛': false,
  '壬': true, '癸': false
};

// 오행 상생 관계
const ELEMENT_GENERATES: Record<string, string> = {
  '木': '火', '火': '土', '土': '金', '金': '水', '水': '木'
};

// 오행 상극 관계
const ELEMENT_CONTROLS: Record<string, string> = {
  '木': '土', '土': '水', '水': '火', '火': '金', '金': '木'
};

/**
 * 커플 궁합 분석
 */
export function analyzeCoupleCompatibility(
  person1: PersonInfo,
  person2: PersonInfo
): CoupleCompatibilityResult {
  // 1. 일간 궁합 분석
  const dayMasterResult = analyzeDayMasterCompatibility(
    person1.sajuChart.day.heavenlyStem,
    person2.sajuChart.day.heavenlyStem
  );

  // 2. 지지 궁합 분석
  const earthlyBranchResult = analyzeEarthlyBranchCompatibility(
    person1.sajuChart,
    person2.sajuChart
  );

  // 3. 오행 상생상극 분석
  const ohengResult = analyzeOhengCompatibility(
    person1.sajuChart,
    person2.sajuChart
  );

  // 4. 용신 보완 분석
  const yongsinResult = analyzeYongsinComplement(
    person1.sajuChart,
    person2.sajuChart
  );

  // 종합 점수 계산 (가중치 적용)
  const totalScore = Math.round(
    dayMasterResult.score * 0.3 +
    earthlyBranchResult.score * 0.25 +
    ohengResult.score * 0.25 +
    yongsinResult.score * 0.2
  );

  // 등급 계산
  const grade = getGrade(totalScore);
  const gradeDescription = getGradeDescription(grade);

  // 시너지 계산
  const synergy = calculateSynergy(
    dayMasterResult,
    earthlyBranchResult,
    ohengResult,
    yongsinResult
  );

  // 장점, 과제, 조언 생성
  const strengths = generateStrengths(dayMasterResult, earthlyBranchResult, ohengResult);
  const challenges = generateChallenges(dayMasterResult, earthlyBranchResult, ohengResult);
  const advice = generateAdvice(dayMasterResult, earthlyBranchResult, ohengResult, yongsinResult);

  return {
    totalScore,
    grade,
    gradeDescription,
    categories: {
      dayMaster: dayMasterResult,
      earthlyBranch: earthlyBranchResult,
      oheng: ohengResult,
      yongsin: yongsinResult
    },
    strengths,
    challenges,
    advice,
    synergy
  };
}

function analyzeDayMasterCompatibility(stem1: string, stem2: string): CompatibilityCategory {
  const element1 = STEM_ELEMENT[stem1];
  const element2 = STEM_ELEMENT[stem2];
  const yang1 = STEM_YANG[stem1];
  const yang2 = STEM_YANG[stem2];

  let score = 50;
  const details: string[] = [];

  // 음양 조화 체크
  if (yang1 !== yang2) {
    score += 15;
    details.push('음양 조화: 서로 다른 음양으로 균형이 좋습니다.');
  } else {
    details.push('음양 같음: 비슷한 성향으로 이해가 쉽습니다.');
  }

  // 오행 관계 체크
  if (element1 === element2) {
    score += 10;
    details.push(`같은 오행(${element1}): 가치관이 비슷합니다.`);
  } else if (ELEMENT_GENERATES[element1] === element2) {
    score += 25;
    details.push(`${element1}이 ${element2}을 생함: 서로 북돋아주는 관계입니다.`);
  } else if (ELEMENT_GENERATES[element2] === element1) {
    score += 25;
    details.push(`${element2}이 ${element1}을 생함: 서로 성장하게 돕습니다.`);
  } else if (ELEMENT_CONTROLS[element1] === element2) {
    score -= 10;
    details.push(`${element1}이 ${element2}을 극함: 갈등이 생길 수 있습니다.`);
  } else if (ELEMENT_CONTROLS[element2] === element1) {
    score -= 10;
    details.push(`${element2}이 ${element1}을 극함: 조율이 필요합니다.`);
  } else {
    details.push('오행이 독립적: 각자의 영역을 존중합니다.');
  }

  // 천간 합 체크
  const GANHAP: Record<string, string> = {
    '甲': '己', '己': '甲',
    '乙': '庚', '庚': '乙',
    '丙': '辛', '辛': '丙',
    '丁': '壬', '壬': '丁',
    '戊': '癸', '癸': '戊'
  };

  if (GANHAP[stem1] === stem2) {
    score += 20;
    details.push('천간합: 운명적인 끌림이 있는 최상의 궁합입니다.');
  }

  score = Math.max(0, Math.min(100, score));

  return {
    name: '일간 궁합',
    score,
    description: score >= 70 ? '일간 궁합이 좋아 자연스럽게 맞는 편입니다.' :
                 score >= 50 ? '일간 궁합이 보통입니다. 노력으로 조화를 이룰 수 있습니다.' :
                 '일간 궁합에 도전이 있습니다. 서로 이해하려는 노력이 필요합니다.',
    details
  };
}

function analyzeEarthlyBranchCompatibility(saju1: SajuChart, saju2: SajuChart): CompatibilityCategory {
  const branches1 = [
    saju1.year.earthlyBranch,
    saju1.month.earthlyBranch,
    saju1.day.earthlyBranch
  ];
  const branches2 = [
    saju2.year.earthlyBranch,
    saju2.month.earthlyBranch,
    saju2.day.earthlyBranch
  ];

  let score = 50;
  const details: string[] = [];

  // 일지 관계 확인 (가장 중요)
  const dayBranch1 = saju1.day.earthlyBranch;
  const dayBranch2 = saju2.day.earthlyBranch;
  const dayRelation = checkBranchRelation(dayBranch1, dayBranch2);

  if (dayRelation === '육합') {
    score += 30;
    details.push(`일지 육합(${dayBranch1}-${dayBranch2}): 최고의 배우자 인연입니다.`);
  } else if (dayRelation === '충') {
    score -= 15;
    details.push(`일지 충(${dayBranch1}-${dayBranch2}): 갈등과 변화가 있을 수 있습니다.`);
  } else if (dayRelation === '형') {
    score -= 10;
    details.push(`일지 형: 시련을 통해 성장하는 관계입니다.`);
  } else if (dayRelation === '해') {
    score -= 5;
    details.push(`일지 해: 작은 오해가 쌓이지 않도록 주의하세요.`);
  }

  // 삼합 확인
  const allBranches = [...branches1, ...branches2];
  const samhapResult = checkSamhap(allBranches);
  if (samhapResult) {
    score += 15;
    details.push(`삼합(${samhapResult.result}): 함께하면 좋은 에너지가 모입니다.`);
  }

  // 년지 관계 (가족 인연)
  const yearRelation = checkBranchRelation(
    saju1.year.earthlyBranch,
    saju2.year.earthlyBranch
  );
  if (yearRelation === '육합') {
    score += 10;
    details.push('년지 합: 가족 인연이 좋습니다.');
  }

  score = Math.max(0, Math.min(100, score));

  return {
    name: '지지 궁합',
    score,
    description: score >= 70 ? '지지 궁합이 좋아 인연이 깊습니다.' :
                 score >= 50 ? '지지 궁합이 보통입니다.' :
                 '지지에 충돌이 있어 조율이 필요합니다.',
    details
  };
}

function analyzeOhengCompatibility(saju1: SajuChart, saju2: SajuChart): CompatibilityCategory {
  // 간단히 일간 오행의 상생상극으로 분석
  const element1 = STEM_ELEMENT[saju1.day.heavenlyStem];
  const element2 = STEM_ELEMENT[saju2.day.heavenlyStem];

  let score = 50;
  const details: string[] = [];

  // 상생 관계
  if (ELEMENT_GENERATES[element1] === element2 || ELEMENT_GENERATES[element2] === element1) {
    score += 25;
    details.push('오행 상생: 서로에게 좋은 에너지를 줍니다.');
    details.push(`${element1}과 ${element2}은 생(生) 관계입니다.`);
  }
  // 상극 관계
  else if (ELEMENT_CONTROLS[element1] === element2 || ELEMENT_CONTROLS[element2] === element1) {
    score -= 10;
    details.push('오행 상극: 긴장감이 있지만 변화를 이끕니다.');
    details.push(`${element1}과 ${element2}은 극(克) 관계입니다.`);
  }
  // 같은 오행
  else if (element1 === element2) {
    score += 15;
    details.push(`같은 오행(${element1}): 비슷한 기질로 이해가 쉽습니다.`);
  } else {
    details.push('오행이 독립적: 각자의 개성을 유지합니다.');
  }

  score = Math.max(0, Math.min(100, score));

  return {
    name: '오행 조화',
    score,
    description: score >= 70 ? '오행이 조화롭게 어울립니다.' :
                 score >= 50 ? '오행 관계가 무난합니다.' :
                 '오행 상극이 있어 조율이 필요합니다.',
    details
  };
}

function analyzeYongsinComplement(saju1: SajuChart, saju2: SajuChart): CompatibilityCategory {
  // 일간 기준으로 서로의 부족한 오행을 채워주는지 분석
  const element1 = STEM_ELEMENT[saju1.day.heavenlyStem];
  const element2 = STEM_ELEMENT[saju2.day.heavenlyStem];

  let score = 50;
  const details: string[] = [];

  // 상대방이 나에게 필요한 오행인지 (간단 버전)
  // 실제로는 용신 분석이 필요하지만, 여기서는 상생 관계로 대체
  if (ELEMENT_GENERATES[element2] === element1) {
    score += 20;
    details.push(`상대방(${element2})이 나(${element1})를 돕는 오행입니다.`);
  }
  if (ELEMENT_GENERATES[element1] === element2) {
    score += 20;
    details.push(`내가(${element1}) 상대방(${element2})을 돕는 오행입니다.`);
  }

  // 서로 다른 오행이면 보완
  if (element1 !== element2) {
    score += 10;
    details.push('서로 다른 오행으로 보완 관계입니다.');
  }

  score = Math.max(0, Math.min(100, score));

  return {
    name: '용신 보완',
    score,
    description: score >= 70 ? '서로의 부족함을 채워주는 좋은 관계입니다.' :
                 score >= 50 ? '보완 관계가 보통입니다.' :
                 '추가적인 노력으로 서로를 채워줄 수 있습니다.',
    details
  };
}

function getGrade(score: number): 'S' | 'A' | 'B' | 'C' | 'D' {
  if (score >= 85) return 'S';
  if (score >= 70) return 'A';
  if (score >= 55) return 'B';
  if (score >= 40) return 'C';
  return 'D';
}

function getGradeDescription(grade: 'S' | 'A' | 'B' | 'C' | 'D'): string {
  switch (grade) {
    case 'S': return '천생연분! 최고의 궁합입니다.';
    case 'A': return '좋은 궁합입니다. 함께하면 행복합니다.';
    case 'B': return '무난한 궁합입니다. 노력하면 더 좋아집니다.';
    case 'C': return '평범한 궁합입니다. 서로 이해하려는 노력이 필요합니다.';
    case 'D': return '도전적인 궁합입니다. 많은 노력과 이해가 필요합니다.';
  }
}

function calculateSynergy(
  dayMaster: CompatibilityCategory,
  earthlyBranch: CompatibilityCategory,
  oheng: CompatibilityCategory,
  yongsin: CompatibilityCategory
) {
  return {
    communication: Math.round((dayMaster.score + oheng.score) / 2),
    passion: Math.round((earthlyBranch.score + dayMaster.score) / 2),
    stability: Math.round((earthlyBranch.score + yongsin.score) / 2),
    growth: Math.round((oheng.score + yongsin.score) / 2),
    trust: Math.round((dayMaster.score + earthlyBranch.score + yongsin.score) / 3)
  };
}

function generateStrengths(
  dayMaster: CompatibilityCategory,
  earthlyBranch: CompatibilityCategory,
  oheng: CompatibilityCategory
): string[] {
  const strengths: string[] = [];

  if (dayMaster.score >= 70) {
    strengths.push('서로의 성격과 가치관이 잘 맞습니다.');
  }
  if (earthlyBranch.score >= 70) {
    strengths.push('깊은 인연으로 연결되어 있습니다.');
  }
  if (oheng.score >= 70) {
    strengths.push('함께 있으면 좋은 에너지가 흐릅니다.');
  }

  if (strengths.length === 0) {
    strengths.push('서로 다른 점에서 배울 수 있습니다.');
  }

  return strengths;
}

function generateChallenges(
  dayMaster: CompatibilityCategory,
  earthlyBranch: CompatibilityCategory,
  oheng: CompatibilityCategory
): string[] {
  const challenges: string[] = [];

  if (dayMaster.score < 50) {
    challenges.push('성격 차이로 인한 갈등이 생길 수 있습니다.');
  }
  if (earthlyBranch.score < 50) {
    challenges.push('지지 충돌로 변화가 많을 수 있습니다.');
  }
  if (oheng.score < 50) {
    challenges.push('오행 상극으로 긴장감이 있을 수 있습니다.');
  }

  if (challenges.length === 0) {
    challenges.push('특별히 큰 어려움은 예상되지 않습니다.');
  }

  return challenges;
}

function generateAdvice(
  dayMaster: CompatibilityCategory,
  earthlyBranch: CompatibilityCategory,
  oheng: CompatibilityCategory,
  yongsin: CompatibilityCategory
): string[] {
  const advice: string[] = [];

  if (dayMaster.score < 60) {
    advice.push('서로의 다른 점을 인정하고 존중하세요.');
  }
  if (earthlyBranch.score < 60) {
    advice.push('변화를 두려워하지 말고 함께 성장하세요.');
  }
  if (oheng.score >= 70) {
    advice.push('좋은 에너지를 유지하며 함께 발전하세요.');
  }
  if (yongsin.score >= 70) {
    advice.push('서로의 강점을 살려 시너지를 만드세요.');
  }

  advice.push('정기적인 대화와 이해가 관계를 더 깊게 합니다.');

  return advice;
}

export default {
  analyzeCoupleCompatibility
};
