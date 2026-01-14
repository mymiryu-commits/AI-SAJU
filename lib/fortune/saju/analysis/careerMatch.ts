/**
 * 직업 매칭 분석 (Career Match Analysis)
 * 사주와 직업의 적합도 분석
 */

import {
  UserInput, SajuChart, OhengBalance, CareerAnalysis,
  CareerType, Element, ELEMENT_KOREAN
} from '@/types/saju';
import { calculateAge } from '../calculator';

// 직업-오행 매칭 테이블
const CAREER_ELEMENT_MATCH: Record<CareerType, {
  primary: Element[];
  secondary: Element[];
  avoid: Element[];
  description: string;
}> = {
  business: {
    primary: ['earth', 'metal'],
    secondary: ['fire'],
    avoid: ['water'],
    description: '안정적 기반(土)과 결단력(金)이 필요한 분야'
  },
  professional: {
    primary: ['metal', 'water'],
    secondary: ['wood'],
    avoid: [],
    description: '정밀함(金)과 깊은 지식(水)이 필요한 분야'
  },
  finance: {
    primary: ['metal', 'water'],
    secondary: ['earth'],
    avoid: ['fire'],
    description: '분석력(水)과 결단력(金)이 중요한 분야'
  },
  marketing: {
    primary: ['fire', 'wood'],
    secondary: ['earth'],
    avoid: [],
    description: '열정(火)과 창의성(木)이 필요한 분야'
  },
  creative: {
    primary: ['fire', 'wood'],
    secondary: ['water'],
    avoid: ['metal'],
    description: '표현력(火)과 성장 에너지(木)가 핵심인 분야'
  },
  manufacturing: {
    primary: ['metal', 'earth'],
    secondary: ['fire'],
    avoid: [],
    description: '기술력(金)과 안정성(土)이 중요한 분야'
  },
  it: {
    primary: ['metal', 'water'],
    secondary: ['wood'],
    avoid: [],
    description: '논리(金)와 유연성(水)이 필요한 분야'
  },
  education: {
    primary: ['wood', 'fire'],
    secondary: ['earth'],
    avoid: [],
    description: '성장 마인드(木)와 열정(火)이 핵심인 분야'
  },
  service: {
    primary: ['fire', 'earth'],
    secondary: ['water'],
    avoid: [],
    description: '친화력(火)과 신뢰(土)가 중요한 분야'
  },
  public: {
    primary: ['earth', 'metal'],
    secondary: ['water'],
    avoid: ['fire'],
    description: '안정성(土)과 규율(金)이 필요한 분야'
  },
  freelance: {
    primary: ['wood', 'fire'],
    secondary: ['water'],
    avoid: [],
    description: '자기 주도(木)와 열정(火)이 필수인 분야'
  },
  jobseeker: {
    primary: ['wood'],
    secondary: ['fire', 'water'],
    avoid: [],
    description: '성장 잠재력(木)을 키워야 하는 시기'
  }
};

// 직업별 MBTI 매칭
const CAREER_MBTI_MATCH: Record<CareerType, string[]> = {
  business: ['ENTJ', 'ESTJ', 'ENTP', 'INTJ'],
  professional: ['ISTJ', 'INTJ', 'INTP', 'ISTP'],
  finance: ['ISTJ', 'INTJ', 'ESTJ', 'ENTJ'],
  marketing: ['ENFP', 'ENTP', 'ENFJ', 'ESFP'],
  creative: ['INFP', 'ENFP', 'ISFP', 'INTP'],
  manufacturing: ['ISTJ', 'ISTP', 'ESTJ', 'ESTP'],
  it: ['INTJ', 'INTP', 'ISTJ', 'ENTJ'],
  education: ['ENFJ', 'INFJ', 'ENFP', 'ESFJ'],
  service: ['ESFJ', 'ENFJ', 'ESFP', 'ISFJ'],
  public: ['ISTJ', 'ESTJ', 'ISFJ', 'ESFJ'],
  freelance: ['INTP', 'ENTP', 'INFP', 'ISTP'],
  jobseeker: []
};

// 일간별 직업 시너지
const DAY_MASTER_CAREER_SYNERGY: Record<string, Partial<Record<CareerType, string>>> = {
  '甲': {
    business: '추진력 → 사업 확장에 유리',
    creative: '성장 에너지 → 창작 활력',
    education: '리더십 → 학생 성장 유도',
    freelance: '독립성 → 자기 주도적 업무'
  },
  '乙': {
    marketing: '유연함 → 트렌드 적응력',
    creative: '섬세함 → 디테일 강점',
    service: '친화력 → 고객 관계 구축'
  },
  '丙': {
    marketing: '열정 → 캠페인 추진력',
    business: '카리스마 → 팀 이끌기',
    creative: '표현력 → 독창적 아이디어'
  },
  '丁': {
    it: '섬세함 → 코드 품질 강점',
    education: '배려심 → 학생 이해도',
    professional: '분석력 → 정밀한 작업'
  },
  '戊': {
    business: '신뢰감 → 파트너십 구축',
    finance: '안정성 → 리스크 관리',
    public: '책임감 → 조직 충성도'
  },
  '己': {
    service: '배려심 → 고객 만족',
    education: '인내심 → 학생 성장 지원',
    manufacturing: '꼼꼼함 → 품질 관리'
  },
  '庚': {
    finance: '결단력 → 신속한 의사결정',
    it: '논리성 → 문제 해결 능력',
    professional: '정밀함 → 전문성 발휘'
  },
  '辛': {
    creative: '미적 감각 → 디자인 강점',
    finance: '분석력 → 데이터 기반 판단',
    marketing: '세련됨 → 브랜딩 감각'
  },
  '壬': {
    it: '유연성 → 변화 적응력',
    creative: '창의성 → 다양한 아이디어',
    business: '포용력 → 네트워크 확장'
  },
  '癸': {
    professional: '지혜 → 깊은 전문성',
    education: '통찰력 → 학생 파악',
    creative: '감수성 → 예술적 표현'
  }
};

/**
 * 직업 매칭 분석 메인 함수
 */
export function analyzeCareerMatch(
  user: UserInput,
  saju: SajuChart,
  oheng: OhengBalance
): CareerAnalysis | null {
  if (!user.careerType) return null;

  const careerConfig = CAREER_ELEMENT_MATCH[user.careerType];
  const age = calculateAge(user.birthDate);

  // 매칭 점수 계산
  const matchScore = calculateCareerMatchScore(
    oheng,
    careerConfig,
    user.mbti,
    user.careerType
  );

  // 시너지 포인트
  const synergy = identifySynergyPoints(
    saju,
    oheng,
    user.careerType,
    user.mbti
  );

  // 약점
  const weakPoints = identifyWeakPoints(
    saju,
    oheng,
    user.careerType
  );

  // 해결책
  const solutions = generateSolutions(weakPoints, oheng, user.careerType);

  // 또래 포지션
  const peerPosition = calculateCareerPeerPosition(
    user.careerType,
    user.careerLevel,
    user.yearsExp,
    age,
    matchScore
  );

  // 최적 방향
  const optimalDirection = generateOptimalDirection(
    user.careerType,
    user.careerLevel,
    age,
    matchScore,
    saju
  );

  // 전환 타이밍
  const pivotTiming = calculatePivotTiming(saju, age);

  return {
    matchScore,
    synergy,
    weakPoints,
    solutions,
    peerPosition,
    optimalDirection,
    pivotTiming
  };
}

/**
 * 직업 매칭 점수 계산
 */
function calculateCareerMatchScore(
  oheng: OhengBalance,
  config: { primary: Element[]; secondary: Element[]; avoid: Element[] },
  mbti?: string,
  careerType?: CareerType
): number {
  let score = 50; // 기본 점수

  // 주요 오행 매칭 (+25점까지)
  for (const el of config.primary) {
    if (oheng[el] >= 2.5) score += 12;
    else if (oheng[el] >= 1.5) score += 8;
    else if (oheng[el] >= 1) score += 4;
  }

  // 보조 오행 매칭 (+12점까지)
  for (const el of config.secondary) {
    if (oheng[el] >= 2) score += 6;
    else if (oheng[el] >= 1) score += 3;
  }

  // 회피 오행 패널티 (-18점까지)
  for (const el of config.avoid) {
    if (oheng[el] >= 3.5) score -= 18;
    else if (oheng[el] >= 2.5) score -= 12;
    else if (oheng[el] >= 2) score -= 6;
  }

  // MBTI 매칭 보너스 (+15점)
  if (mbti && careerType) {
    const mbtiMatch = CAREER_MBTI_MATCH[careerType];
    if (mbtiMatch.includes(mbti)) {
      score += 15;
    } else if (mbtiMatch.length === 0) {
      // jobseeker는 MBTI 무관
      score += 5;
    }
  }

  return Math.max(0, Math.min(100, Math.round(score)));
}

/**
 * 시너지 포인트 식별
 */
function identifySynergyPoints(
  saju: SajuChart,
  oheng: OhengBalance,
  careerType: CareerType,
  mbti?: string
): string[] {
  const synergy: string[] = [];
  const dayMaster = saju.day.heavenlyStem;

  // 일간별 직업 시너지
  const dayMasterSynergy = DAY_MASTER_CAREER_SYNERGY[dayMaster];
  if (dayMasterSynergy?.[careerType]) {
    synergy.push(dayMasterSynergy[careerType]!);
  }

  // 강한 오행 기반 시너지
  const strongElements = (Object.entries(oheng) as [Element, number][])
    .filter(([, count]) => count >= 2.5)
    .map(([el]) => el);

  const elementSynergy: Record<Element, Partial<Record<CareerType, string>>> = {
    fire: {
      marketing: '열정 → 캠페인 추진력이 강함',
      creative: '표현력 → 독창적 아이디어 풍부',
      service: '친화력 → 고객 감동 서비스'
    },
    earth: {
      business: '안정성 → 신뢰 구축에 강함',
      public: '책임감 → 조직 충성도 높음',
      finance: '신중함 → 리스크 관리 능력'
    },
    metal: {
      finance: '결단력 → 신속한 의사결정',
      it: '논리성 → 버그 해결 능력 우수',
      professional: '정밀함 → 전문성 높음'
    },
    wood: {
      education: '성장 마인드 → 학생 발전 유도',
      freelance: '독립성 → 자기주도 업무에 강함',
      creative: '창의성 → 새로운 시도에 유리'
    },
    water: {
      creative: '유연성 → 다양한 스타일 소화',
      professional: '지혜 → 깊은 전문성 보유',
      it: '적응력 → 신기술 습득 빠름'
    }
  };

  for (const el of strongElements) {
    if (elementSynergy[el]?.[careerType]) {
      synergy.push(elementSynergy[el][careerType]!);
    }
  }

  // MBTI 시너지
  if (mbti && CAREER_MBTI_MATCH[careerType].includes(mbti)) {
    synergy.push(`${mbti} 성향이 ${careerType} 직군과 높은 시너지`);
  }

  return synergy;
}

/**
 * 약점 식별
 */
function identifyWeakPoints(
  saju: SajuChart,
  oheng: OhengBalance,
  careerType: CareerType
): string[] {
  const weakPoints: string[] = [];

  // 약한 오행 기반 약점
  const weakElements = (Object.entries(oheng) as [Element, number][])
    .filter(([, count]) => count <= 1)
    .map(([el]) => el);

  const elementWeakness: Record<Element, Partial<Record<CareerType, string>>> = {
    metal: {
      business: '결단력 부족 → 의사결정 지연 가능',
      finance: '결단력 부족 → 타이밍 놓칠 위험',
      it: '마감 관리 약점 → 스프린트 압박 스트레스'
    },
    wood: {
      creative: '새 아이디어 발굴 속도 저하',
      freelance: '새 프로젝트 수주 어려움',
      it: '신기술 학습 속도 평균 이하'
    },
    fire: {
      marketing: '열정 표현 부족 → 프레젠테이션 약점',
      service: '고객 응대 에너지 부족',
      business: '추진력 부족 → 사업 확장 더딤'
    },
    water: {
      professional: '유연성 부족 → 변화 적응 어려움',
      creative: '아이디어 흐름 정체',
      it: '새로운 관점 부족'
    },
    earth: {
      business: '신뢰 구축에 시간이 오래 걸림',
      public: '조직 적응 시간 필요',
      service: '고객 신뢰 구축 더딤'
    }
  };

  for (const el of weakElements) {
    if (elementWeakness[el]?.[careerType]) {
      weakPoints.push(elementWeakness[el][careerType]!);
    }
  }

  return weakPoints;
}

/**
 * 해결책 생성
 */
function generateSolutions(
  weakPoints: string[],
  oheng: OhengBalance,
  careerType: CareerType
): string[] {
  const solutions: string[] = [];

  // 약한 오행 보완책
  const weakElements = (Object.entries(oheng) as [Element, number][])
    .filter(([, count]) => count <= 1)
    .map(([el]) => el);

  const elementSolutions: Record<Element, string[]> = {
    metal: [
      '의사결정 전 체크리스트 활용하기',
      '마감 1일 전 완료를 목표로 설정',
      '흰색/은색 아이템으로 금 기운 보충'
    ],
    wood: [
      '분기당 1개 신기술/스킬 학습 목표 세우기',
      '아침 시간을 새로운 시작에 활용',
      '녹색 식물 가까이 두기'
    ],
    fire: [
      '발표 전 충분한 리허설로 자신감 확보',
      '열정 표현 스크립트 미리 준비',
      '빨간색 포인트 아이템 활용'
    ],
    water: [
      '유연한 플랜 B를 항상 준비',
      '명상이나 요가로 유연성 훈련',
      '물가 산책이나 수족관 방문으로 수 기운 보충'
    ],
    earth: [
      '장기 관계 구축에 시간 투자',
      '작은 약속부터 지켜 신뢰 쌓기',
      '황색/베이지 톤 컬러 활용'
    ]
  };

  for (const el of weakElements) {
    solutions.push(...elementSolutions[el].slice(0, 2));
  }

  // 직업별 추가 솔루션
  const careerSolutions: Partial<Record<CareerType, string[]>> = {
    business: ['멘토 네트워크 구축', '분기별 사업 점검 루틴 확립'],
    it: ['코드 리뷰 문화 적극 참여', '기술 블로그 작성으로 정리'],
    marketing: ['트렌드 리포트 주간 구독', '고객 인터뷰 정기적 진행'],
    finance: ['리스크 관리 체크리스트 활용', '감정과 분리된 투자 원칙 수립']
  };

  if (careerSolutions[careerType]) {
    solutions.push(...careerSolutions[careerType]!);
  }

  return [...new Set(solutions)];
}

/**
 * 커리어 또래 포지션 계산
 */
function calculateCareerPeerPosition(
  careerType: CareerType,
  careerLevel?: string,
  yearsExp?: number,
  age?: number,
  matchScore?: number
): {
  techMaturity: number;
  leadershipPotential: number;
  burnoutRisk: 'low' | 'average' | 'high';
} {
  let techMaturity = 50;
  let leadershipPotential = 50;
  let burnoutScore = 50;

  // 경력 수준 반영
  if (careerLevel === 'executive') {
    techMaturity = 15;
    leadershipPotential = 10;
  } else if (careerLevel === 'senior') {
    techMaturity = 25;
    leadershipPotential = 20;
  } else if (careerLevel === 'mid') {
    techMaturity = 40;
    leadershipPotential = 35;
  } else if (careerLevel === 'entry') {
    techMaturity = 60;
    leadershipPotential = 65;
  }

  // 경력 연수 반영
  if (yearsExp) {
    if (yearsExp >= 15) {
      techMaturity = Math.min(techMaturity, 20);
      leadershipPotential = Math.min(leadershipPotential, 15);
    } else if (yearsExp >= 10) {
      techMaturity = Math.min(techMaturity, 30);
      leadershipPotential = Math.min(leadershipPotential, 25);
    }
  }

  // 매칭 점수 반영
  if (matchScore) {
    if (matchScore >= 80) {
      techMaturity = Math.max(1, techMaturity - 10);
      leadershipPotential = Math.max(1, leadershipPotential - 10);
      burnoutScore -= 20;
    } else if (matchScore >= 65) {
      burnoutScore -= 10;
    } else if (matchScore <= 45) {
      burnoutScore += 25;
    }
  }

  // 나이 및 중년 위기 반영
  if (age) {
    if (age >= 45 && age <= 52) {
      burnoutScore += 15;
    } else if (age >= 35 && age <= 44) {
      burnoutScore += 5;
    }
  }

  const burnoutRisk: 'low' | 'average' | 'high' =
    burnoutScore < 40 ? 'low' : burnoutScore > 65 ? 'high' : 'average';

  return {
    techMaturity: Math.max(1, Math.min(99, Math.round(techMaturity))),
    leadershipPotential: Math.max(1, Math.min(99, Math.round(leadershipPotential))),
    burnoutRisk
  };
}

/**
 * 최적 방향 제안
 */
function generateOptimalDirection(
  careerType: CareerType,
  careerLevel?: string,
  age?: number,
  matchScore?: number,
  saju?: SajuChart
): string {
  const directions: Record<CareerType, Record<string, string>> = {
    it: {
      executive: 'CTO/기술 고문 역할에 집중. 후배 양성과 기술 비전 제시가 핵심',
      senior: '테크리드/아키텍트 전환이 최적. 리더십 경험 축적 시기',
      mid: '전문성 심화 또는 관리직 분기점. 3년 내 방향 결정 필요',
      entry: '기술 스택 확장에 집중. 다양한 프로젝트 경험 축적'
    },
    business: {
      executive: '후계자 양성/지분 정리 준비 시기. 출구 전략 검토',
      senior: '사업 다각화 또는 EXIT 전략 수립. 새 도전보다 안정화',
      mid: '핵심 역량 집중. 불필요한 확장 자제하고 내실 다지기',
      entry: '한 분야 전문성 확보 후 확장. 네트워크 구축이 핵심'
    },
    finance: {
      executive: '자문/컨설팅 역할로 전환. 경험 기반 가치 창출',
      senior: '포트폴리오 매니저 또는 독립 투자자 방향 검토',
      mid: '전문 분야 심화. CFA/자격증 등 공신력 확보',
      entry: '기초 분석 능력 확보. 멘토 찾기가 최우선'
    },
    marketing: {
      executive: 'CMO/브랜드 컨설턴트로서 전략적 역할',
      senior: '디지털 마케팅 또는 브랜드 전략 특화',
      mid: '데이터 기반 마케팅 역량 강화가 차별화 포인트',
      entry: '다양한 채널 경험 축적. 성과 측정 능력 필수'
    },
    creative: {
      executive: '크리에이티브 디렉터/스튜디오 운영 방향',
      senior: '개인 브랜드 구축과 포트폴리오 강화',
      mid: '특화 분야 선정. 범용성보다 전문성이 중요',
      entry: '기본기 탄탄히. 다양한 프로젝트 참여로 스타일 확립'
    },
    manufacturing: {
      executive: '공정 혁신/자동화 추진 리더십 발휘',
      senior: '품질관리 또는 생산관리 전문가 방향',
      mid: '스마트 팩토리 관련 역량 확보가 미래 경쟁력',
      entry: '현장 경험 충실히. 자격증 취득 병행'
    },
    education: {
      executive: '교육 정책/커리큘럼 개발 역할',
      senior: '에듀테크 또는 콘텐츠 개발로 영역 확장',
      mid: '전문 분야 심화와 강의 역량 동시 개발',
      entry: '교수법 연구와 학생 소통 능력이 핵심'
    },
    service: {
      executive: '프랜차이즈/다점포 운영 또는 컨설팅',
      senior: '서비스 교육/품질관리 전문가 방향',
      mid: '고객 경험 설계 역량이 차별화 포인트',
      entry: '현장 서비스 마스터 후 관리직으로 성장'
    },
    public: {
      executive: '정책 결정자 또는 기관장 역할 준비',
      senior: '전문 분야 심화 또는 행정 관리 선택',
      mid: '승진 준비와 함께 전문성 확보 병행',
      entry: '조직 적응과 업무 파악이 최우선'
    },
    freelance: {
      executive: '에이전시 설립 또는 플랫폼 운영자 방향',
      senior: '고단가 프로젝트 집중과 브랜드 강화',
      mid: '안정적 클라이언트 확보와 영역 특화',
      entry: '포트폴리오 구축과 네트워크 형성이 핵심'
    },
    professional: {
      executive: '로펌/병원 경영 또는 학계 진출',
      senior: '전문 분야 권위자로 포지셔닝',
      mid: '전문성 심화와 고객 기반 확대 동시 추진',
      entry: '자격 취득 완료 후 경험 축적에 집중'
    },
    jobseeker: {
      executive: '재취업보다 창업/컨설팅 방향 검토',
      senior: '경험 기반 차별화된 포지셔닝 필요',
      mid: '스킬 업데이트 후 목표 기업 집중 공략',
      entry: '기초 역량 확보와 인턴/계약직도 적극 고려'
    }
  };

  const level = careerLevel || 'mid';
  const baseDirection = directions[careerType]?.[level];

  if (baseDirection) {
    if (matchScore && matchScore >= 75) {
      return baseDirection + ' 현재 진로와의 적합도가 높아 기존 방향 유지를 권장합니다.';
    } else if (matchScore && matchScore <= 45) {
      return baseDirection + ' 단, 현재 진로와의 적합도가 낮아 방향 전환을 고려해볼 시기입니다.';
    }
    return baseDirection;
  }

  return `${age || 40}세 현재, ${careerType} 분야에서 다음 단계 준비가 필요한 시기입니다.`;
}

/**
 * 전환 타이밍 계산
 */
function calculatePivotTiming(saju: SajuChart, age: number): string {
  // 대운 전환점 계산 (간략화)
  const nextMajorChange = Math.ceil(age / 10) * 10 + 1;
  const yearsUntilChange = nextMajorChange - age;

  if (yearsUntilChange <= 2) {
    return `${nextMajorChange}세 대운 전환이 임박했습니다. 지금 준비를 시작하면 새 대운에서 좋은 시작이 가능합니다.`;
  } else if (yearsUntilChange <= 5) {
    return `${nextMajorChange}세 대운 전환까지 ${yearsUntilChange}년. 현재부터 ${nextMajorChange - 1}세까지가 전환 준비 최적기입니다.`;
  }

  return `현재 대운의 에너지를 충분히 활용하세요. 급한 전환보다 내실을 다지는 시기입니다.`;
}

/**
 * 추천 직업군 계산 (진로 탐색용)
 */
export function recommendCareerTypes(
  saju: SajuChart,
  oheng: OhengBalance,
  mbti?: string
): { careerType: CareerType; score: number; reason: string }[] {
  const results: { careerType: CareerType; score: number; reason: string }[] = [];

  for (const careerType of Object.keys(CAREER_ELEMENT_MATCH) as CareerType[]) {
    const config = CAREER_ELEMENT_MATCH[careerType];
    const score = calculateCareerMatchScore(oheng, config, mbti, careerType);

    let reason = config.description;
    const synergy = DAY_MASTER_CAREER_SYNERGY[saju.day.heavenlyStem];
    if (synergy?.[careerType]) {
      reason += ` / ${synergy[careerType]}`;
    }

    results.push({ careerType, score, reason });
  }

  return results.sort((a, b) => b.score - a.score).slice(0, 5);
}
