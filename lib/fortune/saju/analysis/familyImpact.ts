/**
 * 가족 영향 분석 (Family Impact Analysis)
 * 배우자, 자녀, 부모에 대한 영향 분석
 */

import { UserInput, SajuChart, FamilyImpact, Element } from '@/types/saju';
import { calculateAge } from '../calculator';
import { BRANCH_ELEMENTS } from '../calculator';

/**
 * 가족 영향 분석 메인 함수
 */
export function analyzeFamilyImpact(
  user: UserInput,
  saju: SajuChart,
  targetYear: number = 2026
): FamilyImpact | null {
  // 미혼이면 null 반환 (단, 연애 관련 정보는 별도 제공 가능)
  if (user.maritalStatus === 'single') {
    return null;
  }

  const age = calculateAge(user.birthDate);
  const currentYear = new Date().getFullYear();

  // 배우자 스트레스 영향
  const spouseStress = calculateSpouseStress(saju, user.careerType, age);

  // 자녀 영향
  const childrenImpact = user.hasChildren && user.childrenAges
    ? calculateChildrenImpact(user.childrenAges, age, targetYear, currentYear)
    : 'neutral';

  // 부모 부양
  const parentCare = calculateParentCare(age, targetYear, currentYear);

  // 경고 사항
  const warnings = generateFamilyWarnings(
    user,
    saju,
    spouseStress,
    childrenImpact,
    age
  );

  // 권장 사항
  const recommendations = generateFamilyRecommendations(
    user,
    spouseStress,
    childrenImpact,
    age
  );

  // 재정 타임라인
  const financialTimeline = generateFinancialTimeline(
    user,
    age,
    targetYear,
    currentYear
  );

  return {
    spouseStress,
    childrenImpact,
    parentCare,
    warnings,
    recommendations,
    financialTimeline
  };
}

/**
 * 배우자 스트레스 영향 계산
 */
function calculateSpouseStress(
  saju: SajuChart,
  careerType?: string,
  age?: number
): 'low' | 'medium' | 'high' {
  let stressScore = 50;

  // 일간 기반 분석
  const dayElement = saju.day.element;

  // 화(火) 일간 = 열정적이지만 갈등 가능성
  if (dayElement === 'fire') {
    stressScore += 12;
  }

  // 목(木) 일간 = 성장 지향적, 변화 추구
  if (dayElement === 'wood') {
    stressScore += 8;
  }

  // 토(土) 일간 = 안정적, 스트레스 낮음
  if (dayElement === 'earth') {
    stressScore -= 10;
  }

  // 일지(배우자궁) 분석
  const dayBranchElement = BRANCH_ELEMENTS[saju.day.earthlyBranch];

  // 일지가 충(冲)을 받으면 스트레스 증가
  const conflictBranches: Record<string, string> = {
    '子': '午', '丑': '未', '寅': '申', '卯': '酉',
    '辰': '戌', '巳': '亥', '午': '子', '未': '丑',
    '申': '寅', '酉': '卯', '戌': '辰', '亥': '巳'
  };

  // 월지나 시지가 일지와 충하면
  const dayBranch = saju.day.earthlyBranch;
  const conflictTarget = conflictBranches[dayBranch];

  if (saju.month.earthlyBranch === conflictTarget) {
    stressScore += 15;
  }
  if (saju.time?.earthlyBranch === conflictTarget) {
    stressScore += 10;
  }

  // 고위험 직업
  if (careerType === 'business' || careerType === 'finance') {
    stressScore += 10;
  } else if (careerType === 'freelance') {
    stressScore += 8;
  }

  // 40대 후반 ~ 50대 초반 = 중년 위기 시기
  if (age && age >= 45 && age <= 52) {
    stressScore += 12;
  }

  if (stressScore < 45) return 'low';
  if (stressScore > 65) return 'high';
  return 'medium';
}

/**
 * 자녀 영향 계산
 */
function calculateChildrenImpact(
  childrenAges: number[],
  parentAge: number,
  targetYear: number,
  currentYear: number
): 'positive' | 'neutral' | 'negative' {
  const yearDiff = targetYear - currentYear;
  const projectedAges = childrenAges.map(age => age + yearDiff);

  // 대입/수능 시기 자녀 (고3-재수)
  const hasCollegeEntranceAge = projectedAges.some(age => age >= 17 && age <= 20);

  // 중학교 입학 시기
  const hasMiddleSchoolAge = projectedAges.some(age => age >= 12 && age <= 14);

  // 독립 시기 자녀
  const hasIndependentAge = projectedAges.some(age => age >= 26);

  // 취업 준비 시기
  const hasJobSearchAge = projectedAges.some(age => age >= 22 && age <= 25);

  // 점수 계산
  let impactScore = 0;

  if (hasCollegeEntranceAge) impactScore -= 3;
  if (hasMiddleSchoolAge) impactScore -= 1;
  if (hasJobSearchAge) impactScore -= 2;
  if (hasIndependentAge) impactScore += 3;

  // 어린 자녀 (양육 부담)
  const youngChildren = projectedAges.filter(age => age <= 6).length;
  impactScore -= youngChildren;

  if (impactScore >= 2) return 'positive';
  if (impactScore <= -2) return 'negative';
  return 'neutral';
}

/**
 * 부모 부양 분석
 */
function calculateParentCare(age: number, targetYear: number, currentYear: number): string {
  // 부모 세대 추정 (25-30년 차이)
  const estimatedParentAge = age + 28;
  const projectedParentAge = estimatedParentAge + (targetYear - currentYear);

  if (projectedParentAge >= 85) {
    return '본격 부양 시기 진입 - 의료비 및 간병 비용 준비 필요';
  } else if (projectedParentAge >= 80) {
    return '고령 부양 시기 - 건강 관리 지원 및 비용 증가 예상';
  } else if (projectedParentAge >= 75) {
    return '건강 관리 지원 필요 시기 - 정기 검진 동행 권장';
  } else if (projectedParentAge >= 70) {
    return '독립 생활 가능하나 정기적 관심 필요';
  } else {
    return '아직 독립적 생활 가능 예상';
  }
}

/**
 * 가족 관련 경고 사항 생성
 */
function generateFamilyWarnings(
  user: UserInput,
  saju: SajuChart,
  spouseStress: 'low' | 'medium' | 'high',
  childrenImpact: 'positive' | 'neutral' | 'negative',
  age: number
): string[] {
  const warnings: string[] = [];

  // 배우자 스트레스 경고
  if (spouseStress === 'high') {
    warnings.push('커리어 전환이나 큰 결정 시 배우자와 충분한 협의가 필수입니다.');
    warnings.push('일주일에 최소 1회 배우자와 단둘이 대화 시간을 가지세요.');
  } else if (spouseStress === 'medium') {
    warnings.push('중요 결정 전 배우자의 의견을 먼저 듣는 습관을 기르세요.');
  }

  // 자녀 영향 경고
  if (childrenImpact === 'negative') {
    warnings.push('자녀 교육비 피크 시기와 재정 계획을 연동해야 합니다.');
    warnings.push('자녀의 중요 시기에 가족 시간 확보가 필요합니다.');
  }

  // 중년 전환기 경고
  if (age >= 48 && age <= 52) {
    warnings.push('중년 전환기입니다 - 가족 소통 시간 확보가 특히 중요합니다.');
  }

  // 사주 기반 경고
  const dayElement = saju.day.element;
  if (dayElement === 'fire') {
    warnings.push('충동적 결정이 가족 전체에 영향을 줄 수 있습니다. 24시간 숙고 규칙을 적용하세요.');
  }
  if (dayElement === 'wood') {
    warnings.push('성장과 변화 욕구가 강하지만, 가족의 안정도 함께 고려하세요.');
  }

  // 재혼 가정 추가 경고
  if (user.maritalStatus === 'remarried') {
    warnings.push('재혼 가정의 경우 자녀들과의 소통에 더 많은 시간을 투자하세요.');
  }

  return warnings;
}

/**
 * 가족 관련 권장 사항 생성
 */
function generateFamilyRecommendations(
  user: UserInput,
  spouseStress: 'low' | 'medium' | 'high',
  childrenImpact: 'positive' | 'neutral' | 'negative',
  age: number
): string[] {
  const recommendations: string[] = [];

  // 기본 권장사항
  recommendations.push('월 1회 가족 재정 회의 시간을 확보하세요.');

  // 배우자 관련
  if (spouseStress !== 'low') {
    recommendations.push('주 1회 이상 배우자와 단둘이 식사하거나 산책하세요.');
    recommendations.push('중요 결정 전 배우자에게 먼저 공유하고 24시간 후 결정하세요.');
  }

  // 자녀 관련
  if (childrenImpact === 'negative') {
    recommendations.push('자녀 진로 상담 시 현실적 비용 계획을 함께 공유하세요.');
    recommendations.push('자녀 교육비 피크 시기에 맞춰 비상 자금을 준비하세요.');
  }

  if (user.hasChildren && user.childrenAges) {
    const hasTeenager = user.childrenAges.some(age => age >= 13 && age <= 19);
    if (hasTeenager) {
      recommendations.push('사춘기 자녀와는 일대일 대화 시간을 따로 마련하세요.');
    }

    const hasYoungChild = user.childrenAges.some(age => age <= 7);
    if (hasYoungChild) {
      recommendations.push('어린 자녀가 있으면 커리어 결정 시 육아 분담을 먼저 논의하세요.');
    }
  }

  // 연령별 권장사항
  if (age >= 45) {
    recommendations.push('부모님 건강검진에 연 1회 이상 동행하세요.');
    recommendations.push('노후 준비 현황을 가족과 공유하세요.');
  }

  if (age >= 50) {
    recommendations.push('본인의 건강 관리를 가족 최우선 과제로 설정하세요.');
    recommendations.push('자산 현황을 배우자와 정기적으로 점검하세요.');
  }

  return recommendations;
}

/**
 * 재정 타임라인 생성
 */
function generateFinancialTimeline(
  user: UserInput,
  age: number,
  targetYear: number,
  currentYear: number
): { year: number; event: string; impact: string }[] {
  const timeline: { year: number; event: string; impact: string }[] = [];

  // 자녀 교육 이벤트
  if (user.hasChildren && user.childrenAges) {
    for (const childAge of user.childrenAges) {
      // 초등학교 입학
      const elementaryYear = currentYear + (7 - childAge);
      if (elementaryYear >= targetYear && elementaryYear <= targetYear + 10 && elementaryYear > currentYear) {
        timeline.push({
          year: elementaryYear,
          event: '자녀 초등학교 입학',
          impact: '학원비 등 교육비 본격 시작'
        });
      }

      // 중학교 입학
      const middleYear = currentYear + (13 - childAge);
      if (middleYear >= targetYear && middleYear <= targetYear + 10 && middleYear > currentYear) {
        timeline.push({
          year: middleYear,
          event: '자녀 중학교 입학',
          impact: '학원비 증가 예상'
        });
      }

      // 고등학교 입학
      const highYear = currentYear + (16 - childAge);
      if (highYear >= targetYear && highYear <= targetYear + 10 && highYear > currentYear) {
        timeline.push({
          year: highYear,
          event: '자녀 고등학교 입학',
          impact: '교육비 피크 시작'
        });
      }

      // 대학 입학 시기
      const collegeYear = currentYear + (19 - childAge);
      if (collegeYear >= targetYear && collegeYear <= targetYear + 10 && collegeYear > currentYear) {
        timeline.push({
          year: collegeYear,
          event: '자녀 대학 입학',
          impact: '등록금 + 생활비로 연간 2,000만원+ 예상'
        });
      }

      // 대학 졸업/취업 시기
      const graduationYear = currentYear + (23 - childAge);
      if (graduationYear >= targetYear && graduationYear <= targetYear + 10 && graduationYear > currentYear) {
        timeline.push({
          year: graduationYear,
          event: '자녀 대학 졸업 예정',
          impact: '교육비 부담 완화 시작'
        });
      }

      // 독립 시기
      const independentYear = currentYear + (26 - childAge);
      if (independentYear >= targetYear && independentYear <= targetYear + 10 && independentYear > currentYear) {
        timeline.push({
          year: independentYear,
          event: '자녀 경제적 독립 예상',
          impact: '가계 여유 증가'
        });
      }

      // 결혼 지원 시기 (28-32세 추정)
      const weddingYear = currentYear + (30 - childAge);
      if (weddingYear >= targetYear && weddingYear <= targetYear + 10 && weddingYear > currentYear) {
        timeline.push({
          year: weddingYear,
          event: '자녀 결혼 지원 예상 시기',
          impact: '일시적 큰 지출 발생 가능'
        });
      }
    }
  }

  // 부모 관련 이벤트
  const parentAge = age + 28;

  // 부모 80세 시점
  const parent80Year = currentYear + (80 - parentAge);
  if (parent80Year >= targetYear && parent80Year <= targetYear + 10 && parent80Year > currentYear) {
    timeline.push({
      year: parent80Year,
      event: '부모님 80세 전후',
      impact: '의료비/간병비 증가 예상'
    });
  }

  // 은퇴 준비 시점
  const retireYear = currentYear + (60 - age);
  if (retireYear >= targetYear && retireYear > currentYear) {
    timeline.push({
      year: Math.max(targetYear, retireYear - 5),
      event: '은퇴 준비 본격화 시기',
      impact: '자산 재배치 및 연금 전략 수립 필요'
    });
  }

  // 연도순 정렬 및 중복 제거
  return timeline
    .filter((item, index, self) =>
      index === self.findIndex(t => t.year === item.year && t.event === item.event)
    )
    .sort((a, b) => a.year - b.year);
}

/**
 * 가족 궁합 간단 분석 (프리미엄)
 */
export function analyzeSpouseCompatibility(
  userSaju: SajuChart,
  spouseBirthDate: string,
  spouseBirthTime?: string
): {
  score: number;
  strengths: string[];
  challenges: string[];
  advice: string;
} {
  // 배우자 사주 계산 필요 - 여기서는 간략화
  const userDayElement = userSaju.day.element;

  // 기본 궁합 점수 (실제로는 더 복잡한 계산 필요)
  const baseScore = 70;

  return {
    score: baseScore,
    strengths: [
      '서로 다른 관점으로 보완하는 관계입니다.',
      '위기 상황에서 협력이 잘 됩니다.'
    ],
    challenges: [
      '소통 방식의 차이로 오해가 생길 수 있습니다.',
      '재정 관련 의견 조율이 필요합니다.'
    ],
    advice: '주 1회 이상 단둘이 대화하는 시간을 만들고, 중요 결정은 함께 내리세요.'
  };
}

// ========== 부모 영향도 분석 (신규 추가) ==========

/**
 * 부모 영향도 분석 결과
 */
export interface ParentInfluenceAnalysis {
  fatherInfluence: {
    score: number;  // 0-100
    percentage: number;  // 전체 대비 비율
    elements: {
      personality: number;  // 성격 영향도
      career: number;  // 진로/직업 영향도
      values: number;  // 가치관 영향도
      health: number;  // 건강/체질 영향도
    };
    sharedTraits: string[];  // 공통점
    differences: string[];  // 차이점
    advice: string;
  };
  motherInfluence: {
    score: number;
    percentage: number;
    elements: {
      personality: number;
      career: number;
      values: number;
      health: number;
    };
    sharedTraits: string[];
    differences: string[];
    advice: string;
  };
  dominantParent: 'father' | 'mother' | 'balanced';
  summary: string;
  detailedAnalysis: string[];
}

/**
 * 오행 상생/상극 관계 매핑
 */
const ELEMENT_RELATIONS: Record<Element, { generates: Element; controls: Element; generatedBy: Element; controlledBy: Element }> = {
  wood: { generates: 'fire', controls: 'earth', generatedBy: 'water', controlledBy: 'metal' },
  fire: { generates: 'earth', controls: 'metal', generatedBy: 'wood', controlledBy: 'water' },
  earth: { generates: 'metal', controls: 'water', generatedBy: 'fire', controlledBy: 'wood' },
  metal: { generates: 'water', controls: 'wood', generatedBy: 'earth', controlledBy: 'fire' },
  water: { generates: 'wood', controls: 'fire', generatedBy: 'metal', controlledBy: 'earth' }
};

/**
 * 오행 한글 매핑
 */
const ELEMENT_KOREAN_MAP: Record<Element, string> = {
  wood: '목(木)', fire: '화(火)', earth: '토(土)', metal: '금(金)', water: '수(水)'
};

/**
 * 부모 영향도 분석 메인 함수
 * 부모의 생년월일을 입력받아 사용자가 어느 부모의 영향을 더 많이 받았는지 분석
 */
export function analyzeParentInfluence(
  userSaju: SajuChart,
  fatherBirthDate: string,
  motherBirthDate: string,
  fatherBirthTime?: string,
  motherBirthTime?: string
): ParentInfluenceAnalysis {
  // 부모 사주 계산 (외부에서 계산해서 전달받거나 여기서 계산)
  // 여기서는 간단히 연/월/일 기반으로 추정
  const fatherYear = parseInt(fatherBirthDate.split('-')[0]);
  const motherYear = parseInt(motherBirthDate.split('-')[0]);

  // 지지 추정 (연도 기반)
  const fatherBranch = getYearBranch(fatherYear);
  const motherBranch = getYearBranch(motherYear);
  const userBranch = userSaju.year.earthlyBranch;

  // 천간/지지 오행 비교
  const userDayElement = userSaju.day.element;
  const userYearElement = userSaju.year.element;

  // 부모 연도 오행 추정
  const fatherYearElement = getYearElement(fatherYear);
  const motherYearElement = getYearElement(motherYear);

  // 영향도 계산
  const fatherScore = calculateParentScore(userSaju, fatherYearElement, fatherBranch);
  const motherScore = calculateParentScore(userSaju, motherYearElement, motherBranch);

  const totalScore = fatherScore.total + motherScore.total;
  const fatherPercentage = Math.round((fatherScore.total / totalScore) * 100);
  const motherPercentage = 100 - fatherPercentage;

  // 공통점/차이점 분석
  const fatherShared = analyzeSharedTraits(userDayElement, fatherYearElement, '아버지');
  const motherShared = analyzeSharedTraits(userDayElement, motherYearElement, '어머니');

  // 우세 부모 판단
  let dominantParent: 'father' | 'mother' | 'balanced';
  if (Math.abs(fatherPercentage - motherPercentage) <= 10) {
    dominantParent = 'balanced';
  } else if (fatherPercentage > motherPercentage) {
    dominantParent = 'father';
  } else {
    dominantParent = 'mother';
  }

  // 종합 분석
  const summary = generateParentInfluenceSummary(dominantParent, fatherPercentage, motherPercentage, userDayElement);
  const detailedAnalysis = generateDetailedParentAnalysis(
    userSaju, fatherYearElement, motherYearElement, fatherScore, motherScore
  );

  return {
    fatherInfluence: {
      score: fatherScore.total,
      percentage: fatherPercentage,
      elements: {
        personality: fatherScore.personality,
        career: fatherScore.career,
        values: fatherScore.values,
        health: fatherScore.health
      },
      sharedTraits: fatherShared.shared,
      differences: fatherShared.differences,
      advice: generateParentAdvice('father', fatherYearElement, userDayElement)
    },
    motherInfluence: {
      score: motherScore.total,
      percentage: motherPercentage,
      elements: {
        personality: motherScore.personality,
        career: motherScore.career,
        values: motherScore.values,
        health: motherScore.health
      },
      sharedTraits: motherShared.shared,
      differences: motherShared.differences,
      advice: generateParentAdvice('mother', motherYearElement, userDayElement)
    },
    dominantParent,
    summary,
    detailedAnalysis
  };
}

/**
 * 연도 지지 계산
 */
function getYearBranch(year: number): string {
  const branches = ['子', '丑', '寅', '卯', '辰', '巳', '午', '未', '申', '酉', '戌', '亥'];
  const index = (year - 4) % 12;
  return branches[index >= 0 ? index : index + 12];
}

/**
 * 연도 오행 추정
 */
function getYearElement(year: number): Element {
  const cycle = (year - 4) % 10;
  // 천간 순서: 갑(목), 을(목), 병(화), 정(화), 무(토), 기(토), 경(금), 신(금), 임(수), 계(수)
  const elements: Element[] = ['wood', 'wood', 'fire', 'fire', 'earth', 'earth', 'metal', 'metal', 'water', 'water'];
  return elements[cycle >= 0 ? cycle : cycle + 10];
}

/**
 * 부모 영향 점수 계산
 */
function calculateParentScore(
  userSaju: SajuChart,
  parentElement: Element,
  parentBranch: string
): { total: number; personality: number; career: number; values: number; health: number } {
  const userElement = userSaju.day.element;
  const userBranch = userSaju.day.earthlyBranch;

  let personality = 50;
  let career = 50;
  let values = 50;
  let health = 50;

  // 오행 관계 분석
  const relation = ELEMENT_RELATIONS[userElement];

  // 상생 관계 (부모가 나를 생함) = 높은 영향
  if (relation.generatedBy === parentElement) {
    personality += 25;
    values += 20;
    career += 15;
  }

  // 동일 오행 = 성격/가치관 유사
  if (userElement === parentElement) {
    personality += 30;
    values += 25;
    health += 20;
  }

  // 상극 관계 = 갈등 가능성 but 성장 자극
  if (relation.controlledBy === parentElement) {
    personality += 10;
    career += 20;  // 엄격한 양육 → 성취욕
    values -= 5;
  }

  // 지지 관계 (육합, 삼합, 충 등)
  const branchRelation = checkBranchInfluence(userBranch, parentBranch);
  if (branchRelation === 'harmony') {
    personality += 15;
    health += 15;
  } else if (branchRelation === 'conflict') {
    career += 10;  // 갈등 → 독립심
    personality -= 5;
  }

  return {
    total: Math.round((personality + career + values + health) / 4),
    personality: Math.min(100, Math.max(0, personality)),
    career: Math.min(100, Math.max(0, career)),
    values: Math.min(100, Math.max(0, values)),
    health: Math.min(100, Math.max(0, health))
  };
}

/**
 * 지지 관계 확인
 */
function checkBranchInfluence(userBranch: string, parentBranch: string): 'harmony' | 'conflict' | 'neutral' {
  // 육합 관계
  const yukap: Record<string, string> = {
    '子': '丑', '丑': '子', '寅': '亥', '卯': '戌', '辰': '酉', '巳': '申',
    '午': '未', '未': '午', '申': '巳', '酉': '辰', '戌': '卯', '亥': '寅'
  };

  // 충 관계
  const chung: Record<string, string> = {
    '子': '午', '丑': '未', '寅': '申', '卯': '酉', '辰': '戌', '巳': '亥',
    '午': '子', '未': '丑', '申': '寅', '酉': '卯', '戌': '辰', '亥': '巳'
  };

  if (yukap[userBranch] === parentBranch) return 'harmony';
  if (chung[userBranch] === parentBranch) return 'conflict';
  return 'neutral';
}

/**
 * 공통점/차이점 분석
 */
function analyzeSharedTraits(
  userElement: Element,
  parentElement: Element,
  parentLabel: string
): { shared: string[]; differences: string[] } {
  const shared: string[] = [];
  const differences: string[] = [];

  const traits: Record<Element, { positive: string[]; negative: string[] }> = {
    wood: {
      positive: ['성장 지향적', '리더십', '창의성', '인내심'],
      negative: ['고집', '융통성 부족', '과도한 경쟁심']
    },
    fire: {
      positive: ['열정적', '사교적', '표현력', '낙관적'],
      negative: ['충동적', '감정 기복', '인내심 부족']
    },
    earth: {
      positive: ['안정적', '신뢰감', '책임감', '포용력'],
      negative: ['보수적', '변화 거부', '고지식함']
    },
    metal: {
      positive: ['결단력', '정의감', '분석력', '원칙주의'],
      negative: ['융통성 부족', '완벽주의', '냉정함']
    },
    water: {
      positive: ['지혜로움', '유연함', '통찰력', '적응력'],
      negative: ['우유부단', '비밀주의', '감정적']
    }
  };

  if (userElement === parentElement) {
    shared.push(`${parentLabel}와 같은 ${ELEMENT_KOREAN_MAP[userElement]} 기질 - 기본 성향이 유사합니다.`);
    shared.push(...traits[userElement].positive.slice(0, 2).map(t => `공통 강점: ${t}`));
  } else {
    const relation = ELEMENT_RELATIONS[userElement];
    if (relation.generatedBy === parentElement) {
      shared.push(`${parentLabel}(${ELEMENT_KOREAN_MAP[parentElement]})가 나(${ELEMENT_KOREAN_MAP[userElement]})를 생하는 관계`);
      shared.push('자연스러운 지원과 양육의 관계입니다.');
    } else if (relation.controlledBy === parentElement) {
      differences.push(`${parentLabel}(${ELEMENT_KOREAN_MAP[parentElement]})가 나(${ELEMENT_KOREAN_MAP[userElement]})를 극하는 관계`);
      differences.push('엄격한 훈육을 통해 성장한 측면이 있습니다.');
    } else {
      differences.push(`${parentLabel}와 다른 오행 기질을 가졌습니다.`);
    }
  }

  return { shared, differences };
}

/**
 * 부모별 조언 생성
 */
function generateParentAdvice(parent: 'father' | 'mother', parentElement: Element, userElement: Element): string {
  const parentLabel = parent === 'father' ? '아버지' : '어머니';
  const relation = ELEMENT_RELATIONS[userElement];

  if (relation.generatedBy === parentElement) {
    return `${parentLabel}로부터 자연스럽게 기운을 받았습니다. ${parentLabel}의 장점을 적극 활용하세요.`;
  } else if (relation.controlledBy === parentElement) {
    return `${parentLabel}의 엄격함이 오히려 성장의 자극이 되었습니다. 갈등 경험이 있다면 화해의 시간을 가져보세요.`;
  } else if (userElement === parentElement) {
    return `${parentLabel}와 기질이 같아 이해가 쉽지만, 같은 단점도 공유할 수 있으니 주의하세요.`;
  } else {
    return `${parentLabel}와 다른 기질을 가졌습니다. 서로의 차이를 인정하고 배우는 자세가 도움됩니다.`;
  }
}

/**
 * 종합 요약 생성
 */
function generateParentInfluenceSummary(
  dominant: 'father' | 'mother' | 'balanced',
  fatherPct: number,
  motherPct: number,
  userElement: Element
): string {
  if (dominant === 'balanced') {
    return `부모님 양쪽에서 균형 있게 영향을 받았습니다. 아버지 ${fatherPct}%, 어머니 ${motherPct}%로 고른 영향을 받아 다양한 관점을 가지게 되었습니다.`;
  } else if (dominant === 'father') {
    return `아버지의 영향을 더 많이 받았습니다(${fatherPct}%). 아버지의 가치관, 행동 패턴, 직업관이 당신에게 많이 전해졌습니다.`;
  } else {
    return `어머니의 영향을 더 많이 받았습니다(${motherPct}%). 어머니의 성격, 감성, 대인관계 방식이 당신에게 많이 전해졌습니다.`;
  }
}

/**
 * 상세 분석 생성
 */
function generateDetailedParentAnalysis(
  userSaju: SajuChart,
  fatherElement: Element,
  motherElement: Element,
  fatherScore: { total: number; personality: number; career: number; values: number; health: number },
  motherScore: { total: number; personality: number; career: number; values: number; health: number }
): string[] {
  const analysis: string[] = [];
  const userElement = userSaju.day.element;

  // 성격 영향
  if (fatherScore.personality > motherScore.personality) {
    analysis.push(`성격/기질: 아버지 영향이 더 큼 (${fatherScore.personality}점 vs ${motherScore.personality}점)`);
  } else if (motherScore.personality > fatherScore.personality) {
    analysis.push(`성격/기질: 어머니 영향이 더 큼 (${motherScore.personality}점 vs ${fatherScore.personality}점)`);
  } else {
    analysis.push(`성격/기질: 양쪽 부모님에게서 균등하게 영향 받음`);
  }

  // 직업/진로 영향
  if (fatherScore.career > motherScore.career) {
    analysis.push(`진로/직업관: 아버지의 영향이 더 큼 - 아버지의 직업관이나 성취욕이 전해졌습니다.`);
  } else if (motherScore.career > fatherScore.career) {
    analysis.push(`진로/직업관: 어머니의 영향이 더 큼 - 어머니의 현실감각이나 안정 지향이 전해졌습니다.`);
  }

  // 가치관 영향
  if (fatherScore.values > motherScore.values) {
    analysis.push(`가치관: 아버지의 가치관과 더 유사합니다.`);
  } else if (motherScore.values > fatherScore.values) {
    analysis.push(`가치관: 어머니의 가치관과 더 유사합니다.`);
  }

  // 건강/체질 영향
  if (fatherScore.health > motherScore.health) {
    analysis.push(`건강/체질: 아버지쪽 체질을 더 많이 물려받았을 가능성이 높습니다.`);
  } else if (motherScore.health > fatherScore.health) {
    analysis.push(`건강/체질: 어머니쪽 체질을 더 많이 물려받았을 가능성이 높습니다.`);
  }

  return analysis;
}
