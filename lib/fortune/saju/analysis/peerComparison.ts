/**
 * 또래 비교 엔진 (Peer Comparison)
 * 동년배 대비 순위 및 비교 분석
 */

import { UserInput, SajuChart, OhengBalance, PeerComparison, CareerType, Element } from '@/types/saju';
import { calculateAge } from '../calculator';

// 연령대별 통계 기준 데이터
const PEER_STATISTICS = {
  ageGroups: {
    '20-24': { careerPeak: 40, stability: 35, wealth: 30 },
    '25-29': { careerPeak: 50, stability: 45, wealth: 40 },
    '30-34': { careerPeak: 60, stability: 55, wealth: 50 },
    '35-39': { careerPeak: 65, stability: 60, wealth: 55 },
    '40-44': { careerPeak: 70, stability: 65, wealth: 60 },
    '45-49': { careerPeak: 75, stability: 70, wealth: 65 },
    '50-54': { careerPeak: 80, stability: 75, wealth: 70 },
    '55-59': { careerPeak: 75, stability: 80, wealth: 75 },
    '60-64': { careerPeak: 70, stability: 85, wealth: 80 },
    '65+': { careerPeak: 65, stability: 90, wealth: 85 }
  },

  // 직업군별 가중치
  careerWeights: {
    business: { career: 1.2, wealth: 1.3, risk: 1.4 },
    professional: { career: 1.1, wealth: 1.0, risk: 0.8 },
    finance: { career: 1.0, wealth: 1.4, risk: 1.3 },
    marketing: { career: 1.1, wealth: 1.0, risk: 1.1 },
    creative: { career: 1.0, wealth: 0.9, risk: 1.2 },
    manufacturing: { career: 0.9, wealth: 0.9, risk: 0.9 },
    it: { career: 1.1, wealth: 1.1, risk: 1.0 },
    education: { career: 0.9, wealth: 0.8, risk: 0.7 },
    service: { career: 0.8, wealth: 0.8, risk: 0.9 },
    public: { career: 0.9, wealth: 0.8, risk: 0.6 },
    freelance: { career: 1.0, wealth: 1.0, risk: 1.3 },
    jobseeker: { career: 0.7, wealth: 0.6, risk: 1.0 }
  } as Record<CareerType, { career: number; wealth: number; risk: number }>
};

// 일간별 특성 보너스
const DAY_MASTER_BONUSES: Record<string, { career: number; stability: number; wealth: number }> = {
  '甲': { career: 6, stability: 4, wealth: 3 },
  '乙': { career: 4, stability: 5, wealth: 4 },
  '丙': { career: 7, stability: 3, wealth: 5 },
  '丁': { career: 5, stability: 6, wealth: 4 },
  '戊': { career: 4, stability: 7, wealth: 5 },
  '己': { career: 3, stability: 6, wealth: 6 },
  '庚': { career: 6, stability: 5, wealth: 6 },
  '辛': { career: 5, stability: 6, wealth: 5 },
  '壬': { career: 6, stability: 4, wealth: 5 },
  '癸': { career: 4, stability: 5, wealth: 4 }
};

/**
 * 또래 비교 계산 메인 함수
 */
export function calculatePeerComparison(
  user: UserInput,
  saju: SajuChart,
  oheng: OhengBalance,
  scores: { overall: number; wealth: number; career: number }
): PeerComparison {
  const age = calculateAge(user.birthDate);
  const ageGroup = getAgeGroup(age);
  const baseStats = PEER_STATISTICS.ageGroups[ageGroup as keyof typeof PEER_STATISTICS.ageGroups]
    || PEER_STATISTICS.ageGroups['40-44'];

  // 직업 가중치 적용
  const careerWeight = user.careerType
    ? PEER_STATISTICS.careerWeights[user.careerType]
    : { career: 1.0, wealth: 1.0, risk: 1.0 };

  // 사주 기반 보정
  const sajuBonus = calculateSajuBonus(saju, oheng);

  // 최종 순위 계산 (상위 N%)
  const careerMaturity = calculatePercentile(
    scores.career * careerWeight.career + sajuBonus.career,
    baseStats.careerPeak
  );

  const decisionStability = calculatePercentile(
    calculateStabilityScore(oheng) + sajuBonus.stability,
    baseStats.stability
  );

  const wealthManagement = calculatePercentile(
    scores.wealth * careerWeight.wealth + sajuBonus.wealth,
    baseStats.wealth
  );

  // 위험 노출도
  const riskScore = calculateRiskScore(oheng, user.careerType, age);
  const riskExposure: 'low' | 'average' | 'high' =
    riskScore < 40 ? 'low' : riskScore > 70 ? 'high' : 'average';

  // 요약 문구 생성
  const summary = generatePeerSummary(
    careerMaturity,
    decisionStability,
    wealthManagement,
    riskExposure,
    age,
    user.gender
  );

  return {
    careerMaturity,
    decisionStability,
    wealthManagement,
    riskExposure,
    summary
  };
}

/**
 * 연령대 그룹 반환
 */
function getAgeGroup(age: number): string {
  if (age < 25) return '20-24';
  if (age < 30) return '25-29';
  if (age < 35) return '30-34';
  if (age < 40) return '35-39';
  if (age < 45) return '40-44';
  if (age < 50) return '45-49';
  if (age < 55) return '50-54';
  if (age < 60) return '55-59';
  if (age < 65) return '60-64';
  return '65+';
}

/**
 * 사주 기반 보너스 계산
 */
function calculateSajuBonus(saju: SajuChart, oheng: OhengBalance): {
  career: number;
  stability: number;
  wealth: number;
} {
  const base = DAY_MASTER_BONUSES[saju.day.heavenlyStem] || { career: 4, stability: 4, wealth: 4 };

  // 오행 균형 보너스
  const balanceBonus = calculateBalanceBonus(oheng);

  return {
    career: base.career + balanceBonus.career,
    stability: base.stability + balanceBonus.stability,
    wealth: base.wealth + balanceBonus.wealth
  };
}

/**
 * 오행 균형 보너스 계산
 */
function calculateBalanceBonus(oheng: OhengBalance): {
  career: number;
  stability: number;
  wealth: number;
} {
  const values = Object.values(oheng);
  const max = Math.max(...values);
  const min = Math.min(...values);
  const variance = max - min;

  // 균형잡힌 사주일수록 안정성 보너스
  const stabilityBonus = variance <= 2 ? 6 : variance <= 3 ? 4 : variance <= 4 ? 2 : 0;

  // 금(金) 강하면 재물 보너스
  const wealthBonus = oheng.metal >= 2.5 ? 4 : oheng.metal >= 1.5 ? 2 : 0;

  // 목(木) 강하면 커리어 보너스
  const careerBonus = oheng.wood >= 2.5 ? 4 : oheng.wood >= 1.5 ? 2 : 0;

  return {
    career: careerBonus,
    stability: stabilityBonus,
    wealth: wealthBonus
  };
}

/**
 * 안정성 점수 계산
 */
function calculateStabilityScore(oheng: OhengBalance): number {
  const values = Object.values(oheng);
  const variance = Math.max(...values) - Math.min(...values);

  // 낮은 분산 = 높은 안정성
  let baseScore = Math.max(0, 100 - variance * 12);

  // 토(土) 오행이 강하면 안정성 보너스
  if (oheng.earth >= 2) {
    baseScore += 10;
  }

  return Math.min(100, baseScore);
}

/**
 * 위험 노출도 계산
 */
function calculateRiskScore(oheng: OhengBalance, careerType?: CareerType, age?: number): number {
  let baseRisk = 50;

  // 화(火) 과다 = 충동 위험
  if (oheng.fire >= 4) baseRisk += 20;
  else if (oheng.fire >= 3) baseRisk += 10;

  // 금(金) 부족 = 결단력 부족 위험
  if (oheng.metal <= 0.5) baseRisk += 15;
  else if (oheng.metal <= 1) baseRisk += 8;

  // 수(水) 과다 = 변동성 위험
  if (oheng.water >= 4) baseRisk += 15;

  // 직업별 위험 가중
  if (careerType === 'business' || careerType === 'finance') {
    baseRisk += 12;
  } else if (careerType === 'freelance') {
    baseRisk += 8;
  } else if (careerType === 'public' || careerType === 'education') {
    baseRisk -= 10;
  }

  // 나이별 조정
  if (age) {
    if (age >= 45 && age <= 52) {
      baseRisk += 8; // 중년 전환기
    } else if (age >= 25 && age <= 35) {
      baseRisk += 5; // 도전기
    }
  }

  return Math.min(100, Math.max(0, baseRisk));
}

/**
 * 백분위 계산 (점수 -> 상위 N%)
 */
function calculatePercentile(score: number, baseline: number): number {
  const diff = score - baseline;
  const percentile = 50 - diff * 1.5;
  return Math.max(1, Math.min(99, Math.round(percentile)));
}

/**
 * 또래 비교 요약 문구 생성
 */
function generatePeerSummary(
  career: number,
  decision: number,
  wealth: number,
  risk: 'low' | 'average' | 'high',
  age: number,
  gender: 'male' | 'female'
): string {
  const genderText = gender === 'male' ? '남성' : '여성';
  const highlights: string[] = [];

  if (career <= 15) {
    highlights.push(`커리어 성숙도 상위 ${career}%로 매우 우수`);
  } else if (career <= 25) {
    highlights.push(`커리어 성숙도 상위 ${career}%`);
  } else if (career <= 40) {
    highlights.push(`커리어 성숙도 평균 이상`);
  }

  if (decision <= 15) {
    highlights.push(`결정 안정성 상위 ${decision}%로 탁월`);
  } else if (decision <= 25) {
    highlights.push(`결정 안정성 우수`);
  }

  if (wealth <= 20) {
    highlights.push(`재물 관리 능력 상위 ${wealth}%`);
  } else if (wealth <= 35) {
    highlights.push(`재물 관리 능력 우수`);
  }

  if (risk === 'high') {
    highlights.push('단, 위험 노출도 주의 필요');
  } else if (risk === 'low') {
    highlights.push('위험 관리 능력 양호');
  }

  if (highlights.length === 0) {
    return `${age}세 ${genderText} 동년배 평균 수준의 안정적인 상태입니다. 꾸준한 성장을 통해 상위권 진입이 가능합니다.`;
  }

  const baseText = `${age}세 ${genderText} 동년배 기준: `;
  return baseText + highlights.join('. ') + '.';
}

/**
 * 상세 또래 비교 분석 (프리미엄)
 */
export function generateDetailedPeerAnalysis(
  user: UserInput,
  comparison: PeerComparison
): {
  strengths: string[];
  improvements: string[];
  topPercentActions: string[];
  warnings: string[];
} {
  const age = calculateAge(user.birthDate);
  const strengths: string[] = [];
  const improvements: string[] = [];
  const topPercentActions: string[] = [];
  const warnings: string[] = [];

  // 강점 분석
  if (comparison.careerMaturity <= 25) {
    strengths.push(`동년배 대비 커리어 성숙도가 높습니다. 현재 방향을 유지하세요.`);
    topPercentActions.push('상위 15%는 이 시기에 멘토링이나 후배 양성을 시작합니다.');
  }

  if (comparison.decisionStability <= 25) {
    strengths.push(`결정 안정성이 높아 중요한 선택에서 실수가 적습니다.`);
    topPercentActions.push('상위 15%는 이 강점을 활용해 팀 리더 역할을 맡습니다.');
  }

  if (comparison.wealthManagement <= 25) {
    strengths.push(`재물 관리 능력이 뛰어납니다.`);
    topPercentActions.push('상위 15%는 이 시기에 자산 다각화를 시작합니다.');
  }

  // 개선점 분석
  if (comparison.careerMaturity > 60) {
    improvements.push('커리어 방향성 재점검이 필요합니다. 현재 위치에서 3년 후를 그려보세요.');
  }

  if (comparison.decisionStability > 60) {
    improvements.push('중요 결정 전 24시간 숙고 규칙을 적용해 보세요.');
  }

  if (comparison.wealthManagement > 60) {
    improvements.push('재무 관리 시스템을 점검하세요. 자동 저축을 시작하면 좋습니다.');
  }

  // 경고 사항
  if (comparison.riskExposure === 'high') {
    warnings.push(`현재 위험 노출도가 높습니다. 중요 결정은 신중하게 하세요.`);
    if (age >= 40) {
      warnings.push('특히 큰 투자나 사업 확장은 충분한 검토 후 진행하세요.');
    }
  }

  // 연령별 특별 조언
  if (age >= 45 && age <= 52) {
    warnings.push('중년 전환기입니다. 이 시기의 결정이 향후 10년을 좌우합니다.');
    topPercentActions.push('상위 10%는 이 시기에 건강 관리와 자산 재배치를 병행합니다.');
  }

  return { strengths, improvements, topPercentActions, warnings };
}
