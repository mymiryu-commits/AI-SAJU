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
