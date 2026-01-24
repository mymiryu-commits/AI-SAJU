/**
 * 비즈니스 궁합 분석 모듈
 *
 * 사업 파트너, 동료 간의 사주 궁합을 분석합니다.
 */

import type { SajuChart } from '@/types/saju';
import { checkBranchRelation } from '../saju/analysis/hapchung';

export interface BusinessPerson {
  name?: string;
  role?: string;  // CEO, 파트너, 팀원 등
  sajuChart: SajuChart;
}

export interface BusinessCompatibilityResult {
  totalScore: number;
  grade: 'S' | 'A' | 'B' | 'C' | 'D';
  gradeDescription: string;
  categories: {
    leadership: { score: number; description: string; details: string[] };
    communication: { score: number; description: string; details: string[] };
    execution: { score: number; description: string; details: string[] };
    creativity: { score: number; description: string; details: string[] };
  };
  teamDynamics: string;
  strengths: string[];
  risks: string[];
  advice: string[];
  recommendedRoles: {
    person1: string[];
    person2: string[];
  };
}

// 천간 오행 매핑
const STEM_ELEMENT: Record<string, string> = {
  '甲': '木', '乙': '木', '丙': '火', '丁': '火',
  '戊': '土', '己': '土', '庚': '金', '辛': '金',
  '壬': '水', '癸': '水'
};

// 오행별 비즈니스 특성
const ELEMENT_BUSINESS_TRAITS: Record<string, { leadership: number; communication: number; execution: number; creativity: number; roles: string[] }> = {
  '木': { leadership: 80, communication: 70, execution: 75, creativity: 85, roles: ['기획자', '창업가', '개발자', '연구원'] },
  '火': { leadership: 90, communication: 85, execution: 70, creativity: 80, roles: ['마케터', '영업', 'CEO', '홍보'] },
  '土': { leadership: 75, communication: 80, execution: 90, creativity: 60, roles: ['관리자', '운영', '재무', 'HR'] },
  '金': { leadership: 85, communication: 65, execution: 85, creativity: 70, roles: ['품질관리', '법무', '전략', '분석가'] },
  '水': { leadership: 70, communication: 90, execution: 65, creativity: 90, roles: ['크리에이터', '디자이너', '컨설턴트', '기술자'] }
};

// 오행 상생
const ELEMENT_GENERATES: Record<string, string> = {
  '木': '火', '火': '土', '土': '金', '金': '水', '水': '木'
};

/**
 * 비즈니스 궁합 분석
 */
export function analyzeBusinessCompatibility(
  person1: BusinessPerson,
  person2: BusinessPerson
): BusinessCompatibilityResult {
  const element1 = STEM_ELEMENT[person1.sajuChart.day.heavenlyStem];
  const element2 = STEM_ELEMENT[person2.sajuChart.day.heavenlyStem];

  const traits1 = ELEMENT_BUSINESS_TRAITS[element1];
  const traits2 = ELEMENT_BUSINESS_TRAITS[element2];

  // 1. 리더십 궁합
  const leadershipResult = analyzeLeadership(element1, element2, traits1, traits2);

  // 2. 소통 궁합
  const communicationResult = analyzeCommunication(
    person1.sajuChart,
    person2.sajuChart,
    traits1,
    traits2
  );

  // 3. 실행력 궁합
  const executionResult = analyzeExecution(element1, element2, traits1, traits2);

  // 4. 창의성 궁합
  const creativityResult = analyzeCreativity(element1, element2, traits1, traits2);

  // 종합 점수
  const totalScore = Math.round(
    leadershipResult.score * 0.25 +
    communicationResult.score * 0.3 +
    executionResult.score * 0.25 +
    creativityResult.score * 0.2
  );

  const grade = getGrade(totalScore);
  const gradeDescription = getBusinessGradeDescription(grade);

  // 팀 다이내믹스
  const teamDynamics = generateTeamDynamics(element1, element2);

  // 장점, 리스크, 조언
  const strengths = generateBusinessStrengths(element1, element2, totalScore);
  const risks = generateBusinessRisks(element1, element2);
  const advice = generateBusinessAdvice(element1, element2, totalScore);

  return {
    totalScore,
    grade,
    gradeDescription,
    categories: {
      leadership: leadershipResult,
      communication: communicationResult,
      execution: executionResult,
      creativity: creativityResult
    },
    teamDynamics,
    strengths,
    risks,
    advice,
    recommendedRoles: {
      person1: traits1.roles,
      person2: traits2.roles
    }
  };
}

function analyzeLeadership(
  element1: string,
  element2: string,
  traits1: typeof ELEMENT_BUSINESS_TRAITS['木'],
  traits2: typeof ELEMENT_BUSINESS_TRAITS['木']
) {
  let score = 50;
  const details: string[] = [];

  // 리더십 차이 분석
  const diff = Math.abs(traits1.leadership - traits2.leadership);

  if (diff >= 15) {
    score += 20;
    details.push('리더십 차이가 명확하여 역할 분담이 쉽습니다.');
  } else if (diff <= 5) {
    score -= 5;
    details.push('비슷한 리더십으로 주도권 경쟁이 있을 수 있습니다.');
  } else {
    score += 10;
    details.push('적절한 리더십 균형입니다.');
  }

  // 상생 관계면 보너스
  if (ELEMENT_GENERATES[element1] === element2 || ELEMENT_GENERATES[element2] === element1) {
    score += 15;
    details.push('상생 관계로 서로 리더십을 높여줍니다.');
  }

  score = Math.max(0, Math.min(100, score));

  return {
    score,
    description: score >= 70 ? '리더십 시너지가 좋습니다.' :
                 score >= 50 ? '리더십 균형이 보통입니다.' :
                 '리더십 역할 조율이 필요합니다.',
    details
  };
}

function analyzeCommunication(
  saju1: SajuChart,
  saju2: SajuChart,
  traits1: typeof ELEMENT_BUSINESS_TRAITS['木'],
  traits2: typeof ELEMENT_BUSINESS_TRAITS['木']
) {
  let score = 50;
  const details: string[] = [];

  // 소통 능력 합산
  const avgComm = (traits1.communication + traits2.communication) / 2;
  score += Math.round((avgComm - 70) / 2);

  // 일지 관계 확인
  const dayRelation = checkBranchRelation(
    saju1.day.earthlyBranch,
    saju2.day.earthlyBranch
  );

  if (dayRelation === '육합') {
    score += 20;
    details.push('일지 합으로 소통이 원활합니다.');
  } else if (dayRelation === '충') {
    score -= 10;
    details.push('일지 충으로 의견 충돌이 있을 수 있습니다.');
  }

  details.push(`평균 소통 역량: ${Math.round(avgComm)}점`);

  score = Math.max(0, Math.min(100, score));

  return {
    score,
    description: score >= 70 ? '소통이 원활한 팀입니다.' :
                 score >= 50 ? '소통에 노력이 필요합니다.' :
                 '소통 방식 개선이 필요합니다.',
    details
  };
}

function analyzeExecution(
  element1: string,
  element2: string,
  traits1: typeof ELEMENT_BUSINESS_TRAITS['木'],
  traits2: typeof ELEMENT_BUSINESS_TRAITS['木']
) {
  let score = 50;
  const details: string[] = [];

  // 실행력 합산
  const avgExec = (traits1.execution + traits2.execution) / 2;
  score += Math.round((avgExec - 70) / 2);

  // 土나 金이 있으면 실행력 보너스
  if (element1 === '土' || element2 === '土') {
    score += 10;
    details.push('土 기운으로 안정적인 실행이 가능합니다.');
  }
  if (element1 === '金' || element2 === '金') {
    score += 10;
    details.push('金 기운으로 정확한 실행이 가능합니다.');
  }

  details.push(`평균 실행 역량: ${Math.round(avgExec)}점`);

  score = Math.max(0, Math.min(100, score));

  return {
    score,
    description: score >= 70 ? '실행력이 뛰어난 팀입니다.' :
                 score >= 50 ? '실행력이 보통입니다.' :
                 '실행력 보완이 필요합니다.',
    details
  };
}

function analyzeCreativity(
  element1: string,
  element2: string,
  traits1: typeof ELEMENT_BUSINESS_TRAITS['木'],
  traits2: typeof ELEMENT_BUSINESS_TRAITS['木']
) {
  let score = 50;
  const details: string[] = [];

  // 창의성 합산
  const avgCreativity = (traits1.creativity + traits2.creativity) / 2;
  score += Math.round((avgCreativity - 70) / 2);

  // 木이나 水가 있으면 창의성 보너스
  if (element1 === '木' || element2 === '木') {
    score += 10;
    details.push('木 기운으로 새로운 아이디어가 샘솟습니다.');
  }
  if (element1 === '水' || element2 === '水') {
    score += 10;
    details.push('水 기운으로 유연한 사고가 가능합니다.');
  }

  // 다른 오행이면 다양성 보너스
  if (element1 !== element2) {
    score += 5;
    details.push('다양한 관점으로 창의성이 높아집니다.');
  }

  details.push(`평균 창의 역량: ${Math.round(avgCreativity)}점`);

  score = Math.max(0, Math.min(100, score));

  return {
    score,
    description: score >= 70 ? '창의적인 팀입니다.' :
                 score >= 50 ? '창의성이 보통입니다.' :
                 '창의성 향상이 필요합니다.',
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

function getBusinessGradeDescription(grade: 'S' | 'A' | 'B' | 'C' | 'D'): string {
  switch (grade) {
    case 'S': return '최고의 비즈니스 파트너! 함께하면 큰 성공이 기대됩니다.';
    case 'A': return '좋은 파트너십입니다. 시너지 효과가 있습니다.';
    case 'B': return '무난한 협력 관계입니다. 역할 분담이 중요합니다.';
    case 'C': return '보완이 필요한 관계입니다. 명확한 규칙이 필요합니다.';
    case 'D': return '신중한 협력이 필요합니다. 역할과 책임을 명확히 하세요.';
  }
}

function generateTeamDynamics(element1: string, element2: string): string {
  if (ELEMENT_GENERATES[element1] === element2) {
    return `${element1}이 ${element2}를 돕는 관계입니다. 첫 번째 분이 아이디어를 제공하고, 두 번째 분이 실현합니다.`;
  }
  if (ELEMENT_GENERATES[element2] === element1) {
    return `${element2}이 ${element1}을 돕는 관계입니다. 두 번째 분이 지원하고, 첫 번째 분이 이끕니다.`;
  }
  if (element1 === element2) {
    return `같은 ${element1} 기운으로 비슷한 스타일입니다. 역할 분담을 명확히 하세요.`;
  }
  return '독립적인 스타일로 각자의 영역에서 강점을 발휘합니다.';
}

function generateBusinessStrengths(element1: string, element2: string, score: number): string[] {
  const strengths: string[] = [];

  if (score >= 70) {
    strengths.push('전반적으로 좋은 비즈니스 궁합입니다.');
  }

  if (ELEMENT_GENERATES[element1] === element2 || ELEMENT_GENERATES[element2] === element1) {
    strengths.push('상생 관계로 서로 성장을 돕습니다.');
  }

  if (element1 !== element2) {
    strengths.push('다양한 관점으로 균형 잡힌 의사결정이 가능합니다.');
  }

  const traits1 = ELEMENT_BUSINESS_TRAITS[element1];
  const traits2 = ELEMENT_BUSINESS_TRAITS[element2];

  if (traits1.execution >= 80 || traits2.execution >= 80) {
    strengths.push('뛰어난 실행력을 갖추고 있습니다.');
  }

  if (strengths.length === 0) {
    strengths.push('서로 보완하며 성장할 수 있는 관계입니다.');
  }

  return strengths;
}

function generateBusinessRisks(element1: string, element2: string): string[] {
  const risks: string[] = [];

  const traits1 = ELEMENT_BUSINESS_TRAITS[element1];
  const traits2 = ELEMENT_BUSINESS_TRAITS[element2];

  if (Math.abs(traits1.leadership - traits2.leadership) <= 5) {
    risks.push('비슷한 리더십으로 주도권 갈등 가능성');
  }

  if (element1 === element2) {
    risks.push('같은 오행으로 시각이 편향될 수 있음');
  }

  if (traits1.communication < 70 && traits2.communication < 70) {
    risks.push('소통 역량이 부족할 수 있음');
  }

  if (risks.length === 0) {
    risks.push('특별히 큰 리스크는 없습니다.');
  }

  return risks;
}

function generateBusinessAdvice(element1: string, element2: string, score: number): string[] {
  const advice: string[] = [];

  advice.push('정기적인 회의로 방향을 조율하세요.');

  if (element1 === element2) {
    advice.push('외부 전문가의 조언을 구해 시각을 넓히세요.');
  }

  if (score < 60) {
    advice.push('역할과 책임을 문서로 명확히 하세요.');
    advice.push('갈등 해결 프로세스를 미리 정해두세요.');
  }

  advice.push('각자의 강점을 살려 역할을 분담하세요.');

  return advice;
}

export default {
  analyzeBusinessCompatibility
};
