/**
 * 연령대별 맞춤형 콘텐츠 시스템
 *
 * 사용자 나이에 따라 톤, 호칭, 관심사, 콘텐츠를 자동 조정
 */

// 연령대 구분
export type AgeGroup = 'youth' | 'middle_early' | 'middle_late' | 'senior';

// 연령대별 설정
export interface AgeGroupConfig {
  ageRange: [number, number];
  label: string;
  honorific: string;
  honorificFormal: string;
  style: 'friendly' | 'strategic' | 'supportive' | 'respectful';
  narrationSpeed: number; // 1.0 = 보통, 0.85 = 느림
  focusAreas: string[];
  healthFocus: string[];
  familyFocus: string[];
  financeFocus: string[];
}

// 연령대별 설정 데이터
export const AGE_GROUP_CONFIG: Record<AgeGroup, AgeGroupConfig> = {
  youth: {
    ageRange: [20, 34],
    label: '청년',
    honorific: '{name}님',
    honorificFormal: '{name}님',
    style: 'friendly',
    narrationSpeed: 1.0,
    focusAreas: ['진로/취업', '연애/결혼', '자산 형성', '자아 정체성'],
    healthFocus: ['체력 관리', '정신 건강', '생활 습관'],
    familyFocus: ['부모와의 관계', '연인 관계', '결혼 준비'],
    financeFocus: ['종잣돈 마련', '투자 시작', '내집마련 준비']
  },
  middle_early: {
    ageRange: [35, 49],
    label: '중년 초기',
    honorific: '{name}님',
    honorificFormal: '{name}님',
    style: 'strategic',
    narrationSpeed: 1.0,
    focusAreas: ['승진/커리어', '자녀 교육', '부부 관계', '자산 증식'],
    healthFocus: ['성인병 예방', '스트레스 관리', '정기 검진'],
    familyFocus: ['자녀 교육', '부부 관계', '부모 봉양'],
    financeFocus: ['자산 증식', '내집마련', '자녀 교육비', '노후 준비 시작']
  },
  middle_late: {
    ageRange: [50, 64],
    label: '중년 후기',
    honorific: '{name}님',
    honorificFormal: '{name} 선생님',
    style: 'supportive',
    narrationSpeed: 0.95,
    focusAreas: ['은퇴 준비', '건강 관리', '자녀 결혼', '노후 설계'],
    healthFocus: ['만성질환 관리', '관절/허리', '정기 검진', '예방 관리'],
    familyFocus: ['자녀 결혼', '자녀 독립', '배우자 관계', '노부모 봉양'],
    financeFocus: ['은퇴 자금', '노후 설계', '자녀 지원', '자산 정리']
  },
  senior: {
    ageRange: [65, 120],
    label: '시니어',
    honorific: '어르신',
    honorificFormal: '{name} 선생님',
    style: 'respectful',
    narrationSpeed: 0.85,
    focusAreas: ['건강 유지', '자녀/손주', '인생 회고', '영적 평안'],
    healthFocus: ['건강 유지', '만성질환 관리', '낙상 예방', '정기 검진'],
    familyFocus: ['자녀와의 관계', '손주 사랑', '가족 화합', '유산/증여'],
    financeFocus: ['자산 관리', '증여 계획', '의료비 준비', '상속 정리']
  }
};

/**
 * 나이로 연령대 구분
 */
export function getAgeGroup(age: number): AgeGroup {
  if (age < 35) return 'youth';
  if (age < 50) return 'middle_early';
  if (age < 65) return 'middle_late';
  return 'senior';
}

/**
 * 연령대 설정 가져오기
 */
export function getAgeGroupConfig(age: number): AgeGroupConfig {
  const group = getAgeGroup(age);
  return AGE_GROUP_CONFIG[group];
}

/**
 * 호칭 생성
 */
export function getHonorific(name: string, age: number, formal: boolean = false): string {
  const config = getAgeGroupConfig(age);
  const template = formal ? config.honorificFormal : config.honorific;
  return template.replace('{name}', name);
}

// ========== 연령대별 건강 콘텐츠 ==========

export interface AgeHealthContent {
  title: string;
  intro: string;
  priorities: { organ: string; element: string; advice: string; }[];
  recommendations: string[];
  warnings: string[];
  checkupTiming: string;
}

/**
 * 연령대별 오행 건강 콘텐츠 생성
 */
export function generateHealthContent(
  age: number,
  weakElements: string[],
  strongElements: string[]
): AgeHealthContent {
  const group = getAgeGroup(age);
  const config = AGE_GROUP_CONFIG[group];

  // 오행별 장기 매핑
  const elementOrgans: Record<string, { organs: string; advice50: string; advice65: string }> = {
    '목': {
      organs: '간, 담, 눈, 근육',
      advice50: '간 건강 검진, 눈 정기 검사 시작하세요',
      advice65: '간 기능 관리, 눈 건강 꾸준히 챙기세요'
    },
    '화': {
      organs: '심장, 소장, 혀, 혈관',
      advice50: '혈압/콜레스테롤 관리, 심장 검진 받으세요',
      advice65: '심장 무리하지 마시고, 혈압 관리가 최우선입니다'
    },
    '토': {
      organs: '위, 비장, 입, 소화기',
      advice50: '위내시경 정기 검진, 식습관 관리하세요',
      advice65: '소화 잘 되는 음식 위주로, 과식 피하세요'
    },
    '금': {
      organs: '폐, 대장, 코, 피부',
      advice50: '폐 건강 관리, 금연 필수, 대장 내시경 받으세요',
      advice65: '호흡기 관리, 가을철 특히 조심하세요'
    },
    '수': {
      organs: '신장, 방광, 귀, 뼈',
      advice50: '신장 기능 검사, 허리/관절 관리 시작하세요',
      advice65: '신장 기능 유지, 뼈 건강, 낙상 주의하세요'
    }
  };

  const priorities = weakElements.slice(0, 3).map(el => {
    const info = elementOrgans[el] || { organs: '', advice50: '', advice65: '' };
    return {
      organ: info.organs,
      element: el,
      advice: group === 'senior' ? info.advice65 : info.advice50
    };
  });

  // 연령대별 인트로
  const intros: Record<AgeGroup, string> = {
    youth: '건강한 습관을 지금 만들면 평생 갑니다.',
    middle_early: '지금 관리가 10년 후를 결정합니다.',
    middle_late: '50대는 관리하면 70까지 건강합니다. 지금 습관이 20년을 좌우합니다.',
    senior: '건강이 최고의 재산입니다. 오래오래 건강하시길 바랍니다.'
  };

  // 연령대별 추천
  const recommendations: Record<AgeGroup, string[]> = {
    youth: ['규칙적인 운동', '충분한 수면', '균형 잡힌 식단'],
    middle_early: ['정기 건강검진', '스트레스 관리', '적정 체중 유지'],
    middle_late: ['정기 검진 필수', '무리한 운동 피하기', '스트레칭/요가 추천'],
    senior: ['가벼운 산책', '스트레칭', '균형 운동', '충분한 수분 섭취']
  };

  // 연령대별 주의사항
  const warnings: Record<AgeGroup, string[]> = {
    youth: ['과음/흡연', '불규칙한 생활', '과도한 스트레스'],
    middle_early: ['야근 과로', '음주 과다', '운동 부족'],
    middle_late: ['과격한 운동', '과로', '스트레스 방치'],
    senior: ['낙상', '과로', '급격한 온도 변화', '혼자 무리한 활동']
  };

  return {
    title: group === 'senior' ? '오행으로 보는 건강 관리' : '건강 에너지 체크',
    intro: intros[group],
    priorities,
    recommendations: recommendations[group],
    warnings: warnings[group],
    checkupTiming: '3월, 9월 (환절기 전후)'
  };
}

// ========== 연령대별 자녀/가족 콘텐츠 ==========

export interface AgeFamilyContent {
  title: string;
  childrenSection: {
    title: string;
    content: string[];
  };
  adviceSection: {
    title: string;
    content: string;
  };
}

/**
 * 연령대별 가족 콘텐츠 생성
 */
export function generateFamilyContent(
  age: number,
  timeColumn: string // 시주 정보
): AgeFamilyContent {
  const group = getAgeGroup(age);

  if (group === 'youth') {
    return {
      title: '가족 관계',
      childrenSection: {
        title: '부모님과의 관계',
        content: [
          '부모님의 조언을 경청하되 자신의 결정을 존중받으세요',
          '정기적인 연락과 방문이 관계를 돈독하게 합니다'
        ]
      },
      adviceSection: {
        title: '관계 조언',
        content: '독립과 연결의 균형을 찾으세요. 경제적 독립이 관계를 더 건강하게 만듭니다.'
      }
    };
  }

  if (group === 'middle_early') {
    return {
      title: '자녀운과 가족 관계',
      childrenSection: {
        title: '자녀와의 관계',
        content: [
          '자녀의 성장 단계에 맞는 소통이 중요합니다',
          '학업보다 정서적 지지가 장기적으로 더 큰 영향을 줍니다',
          '배우자와의 육아 협력이 가족 화합의 열쇠입니다'
        ]
      },
      adviceSection: {
        title: '부모로서의 역할',
        content: '자녀에게 모범을 보이는 것이 최고의 교육입니다. 말보다 행동으로 보여주세요.'
      }
    };
  }

  if (group === 'middle_late') {
    return {
      title: '자녀운 - 결혼과 진로',
      childrenSection: {
        title: '성인 자녀와의 관계',
        content: [
          '자녀가 당신의 조언을 존중하지만 직접적인 간섭보다 지지가 효과적입니다',
          '자녀의 결혼/취업 결정을 믿고 기다려주세요',
          '경제적 지원은 계획적으로, 무리하지 마세요'
        ]
      },
      adviceSection: {
        title: '부모로서의 역할',
        content: '"조언은 하되 결정은 맡기세요." 자녀 스스로 결정할 때 더 좋은 결과가 옵니다.'
      }
    };
  }

  // senior
  return {
    title: '자녀와 손주 이야기',
    childrenSection: {
      title: '자녀·손주와의 관계',
      content: [
        '자녀분들이 바쁘더라도 마음은 항상 어르신을 향해 있습니다',
        '먼저 연락하시면 더 자주 찾아올 거예요',
        '손주와의 시간이 서로에게 큰 기쁨이 됩니다',
        '옛이야기와 지혜를 전해주시면 손주가 평생 기억합니다'
      ]
    },
    adviceSection: {
      title: '가족의 어른으로서',
      content: '어르신이 쌓으신 덕이 자손에게 갑니다. "조상이 심은 나무에 자손이 쉰다" 하지요.'
    }
  };
}

// ========== 연령대별 나레이션 톤 ==========

export interface NarrationTone {
  opening: string;
  closing: string;
  transitionPhrases: string[];
  encouragement: string[];
}

/**
 * 연령대별 나레이션 톤 가져오기
 */
export function getNarrationTone(age: number, name: string): NarrationTone {
  const group = getAgeGroup(age);
  const honorific = getHonorific(name, age);

  const tones: Record<AgeGroup, NarrationTone> = {
    youth: {
      opening: `${honorific}, 사주 분석을 시작하겠습니다.`,
      closing: `${honorific}, 앞으로의 여정을 응원합니다. 좋은 일이 가득하길 바랍니다.`,
      transitionPhrases: ['다음으로', '이어서', '그리고'],
      encouragement: ['잘하고 계세요', '가능성이 많습니다', '기대되는 시기입니다']
    },
    middle_early: {
      opening: `${honorific}, 사주 분석을 시작하겠습니다.`,
      closing: `${honorific}, 좋은 결과 있으시길 바랍니다.`,
      transitionPhrases: ['다음으로', '이어서', '또한'],
      encouragement: ['지금 잘하고 계십니다', '좋은 흐름입니다', '기회가 옵니다']
    },
    middle_late: {
      opening: `${honorific}, 사주 분석을 시작해 드리겠습니다.`,
      closing: `${honorific}, 좋은 일만 가득하시길 바랍니다. 늘 건강하세요.`,
      transitionPhrases: ['다음으로', '그리고', '또한'],
      encouragement: ['지금까지 잘해오셨습니다', '앞으로도 좋은 시기입니다', '믿고 나아가세요']
    },
    senior: {
      opening: `${honorific}, 사주 분석을 시작해 드리겠습니다. 편안하게 들어주세요.`,
      closing: `${honorific}, 늘 건강하시고 좋은 일만 가득하시길 바랍니다. 오래오래 행복하세요.`,
      transitionPhrases: ['그리고요', '또', '이어서 말씀드리면'],
      encouragement: ['정말 잘 살아오셨습니다', '복이 많으십니다', '앞으로 더 편안한 시간이 기다립니다']
    }
  };

  return tones[group];
}

// ========== 연령대별 인생 회고 콘텐츠 ==========

export interface LifeReviewContent {
  title: string;
  periods: {
    age: string;
    description: string;
    question?: string;
  }[];
  validation: string;
  futureMessage: string;
}

/**
 * 연령대별 인생 회고 콘텐츠 생성 (50대 이상용)
 */
export function generateLifeReviewContent(
  age: number,
  birthYear: number,
  daeunList: { startAge: number; endAge: number; element: string }[]
): LifeReviewContent | null {
  if (age < 50) return null; // 50대 미만은 회고 콘텐츠 미제공

  const group = getAgeGroup(age);

  const periods = [];

  // 20대
  const twentiesStart = birthYear + 20;
  periods.push({
    age: '20대',
    description: '배움과 도전의 시기였습니다. 혹시 그때 고향을 떠나 새 출발을 하셨나요?',
    question: '이 시기에 큰 결심을 하신 적이 있으신가요?'
  });

  // 30대
  periods.push({
    age: '30대',
    description: '기반을 다지는 시기입니다. 이때 내 집 마련이나 사업 기반을 다지셨을 가능성이 높습니다.'
  });

  // 40대
  periods.push({
    age: '40대',
    description: '사회적 인정을 받거나 직장에서 성과를 내셨을 것입니다. 다만 이 시기에 건강이나 가정에 어려움이 있었다면 대운의 영향입니다.'
  });

  // 50대
  if (age >= 50) {
    periods.push({
      age: '50대',
      description: '인생의 전환기입니다. 지금까지의 경험이 앞으로의 지혜가 됩니다.'
    });
  }

  const validations: Record<AgeGroup, string> = {
    youth: '',
    middle_early: '',
    middle_late: '지금까지 정말 잘 버텨오셨습니다. 쉽지 않은 시간이었지만, 그 모든 경험이 지금의 당신을 만들었습니다.',
    senior: '정말 파란만장한 인생을 사셨습니다. 그 모든 시간을 잘 견뎌오셨습니다. 존경스럽습니다.'
  };

  const futureMessages: Record<AgeGroup, string> = {
    youth: '',
    middle_early: '',
    middle_late: '앞으로는 좀 더 여유로운 시간이 기다리고 있습니다. 건강 관리하시면서 인생 2막을 즐기세요.',
    senior: '앞으로는 편안하고 존경받는 시기가 됩니다. 오래오래 건강하시고 행복하세요.'
  };

  return {
    title: group === 'senior' ? '당신의 인생 스토리' : '인생 돌아보기',
    periods,
    validation: validations[group],
    futureMessage: futureMessages[group]
  };
}
