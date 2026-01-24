// 과거 검증 시스템 - 신뢰 형성을 위한 과거 예측

import type { PastVerification } from '@/types/cards';
import type { SajuChart, UserInput } from '@/types/saju';

// 대운 전환기 계산 (10년 주기)
function calculateDaeunTransitions(birthYear: number, currentYear: number): number[] {
  const transitions: number[] = [];
  // 대운은 보통 2-8세에 시작하여 10년 주기
  const startAge = 4; // 평균 시작 연령
  const startYear = birthYear + startAge;

  for (let year = startYear; year <= currentYear; year += 10) {
    if (year >= birthYear + 10 && year <= currentYear) {
      transitions.push(year);
    }
  }

  return transitions;
}

// 세운에서 충(沖)이 발생하는 연도 찾기
function findClashYears(
  dayBranch: string,
  birthYear: number,
  currentYear: number
): number[] {
  const branches = ['자', '축', '인', '묘', '진', '사', '오', '미', '신', '유', '술', '해'];
  const clashPairs: Record<string, string> = {
    '자': '오', '축': '미', '인': '신', '묘': '유',
    '진': '술', '사': '해', '오': '자', '미': '축',
    '신': '인', '유': '묘', '술': '진', '해': '사'
  };

  const yearBranches = ['자', '축', '인', '묘', '진', '사', '오', '미', '신', '유', '술', '해'];
  const clashBranch = clashPairs[dayBranch];
  const clashYears: number[] = [];

  // 1984년은 자년, 12년 주기로 같은 지지 반복
  const baseYear = 1984;
  const clashIndex = branches.indexOf(clashBranch);

  for (let year = birthYear + 10; year <= currentYear; year++) {
    const yearIndex = (year - baseYear) % 12;
    const actualIndex = yearIndex < 0 ? yearIndex + 12 : yearIndex;
    if (actualIndex === clashIndex) {
      clashYears.push(year);
    }
  }

  return clashYears.slice(-3); // 최근 3개만
}

// 오행 에너지가 강한 시기 찾기
function findStrongElementYears(
  weakElement: string,
  birthYear: number,
  currentYear: number
): number[] {
  // 오행과 지지 매핑
  const elementYearBranches: Record<string, string[]> = {
    '목': ['인', '묘'],
    '화': ['사', '오'],
    '토': ['진', '술', '축', '미'],
    '금': ['신', '유'],
    '수': ['자', '해']
  };

  const branches = ['자', '축', '인', '묘', '진', '사', '오', '미', '신', '유', '술', '해'];
  const targetBranches = elementYearBranches[weakElement] || [];
  const strongYears: number[] = [];

  const baseYear = 1984; // 자년

  for (let year = birthYear + 10; year <= currentYear; year++) {
    const yearIndex = ((year - baseYear) % 12 + 12) % 12;
    const yearBranch = branches[yearIndex];
    if (targetBranches.includes(yearBranch)) {
      strongYears.push(year);
    }
  }

  return strongYears.slice(-3); // 최근 3개만
}

// 과거 검증 이벤트 생성
function generatePastEvent(
  year: number,
  eventType: 'transition' | 'clash' | 'element_peak' | 'decision',
  context: {
    element?: string;
    branch?: string;
    userAge?: number;
  }
): PastVerification {
  const halfYear = Math.random() > 0.5 ? '상반기' : '하반기';
  const nextYear = year + 1;
  const period = `${year}년 ${halfYear} ~ ${nextYear}년 ${halfYear === '상반기' ? '상반기' : '하반기'}`;

  const events: Record<string, { prediction: string; keywords: string[]; category: PastVerification['category'] }[]> = {
    transition: [
      {
        prediction: '관계나 환경에서 큰 변화가 있었거나, 중요한 선택의 기로에 섰던 시기입니다.',
        keywords: ['변화', '전환점', '새로운 시작'],
        category: 'environment'
      },
      {
        prediction: '삶의 방향이 달라지는 전환점이었습니다. 새로운 사람을 만났거나, 새로운 곳으로 이동했을 수 있습니다.',
        keywords: ['방향 전환', '새 인연', '이동'],
        category: 'relationship'
      },
      {
        prediction: '내면적으로 큰 성장이 있었던 시기입니다. 가치관이나 생각이 많이 바뀌었을 수 있습니다.',
        keywords: ['내면 성장', '가치관 변화', '깨달음'],
        category: 'decision'
      }
    ],
    clash: [
      {
        prediction: '예상치 못한 일이 발생했거나, 갈등 상황을 겪었을 가능성이 있습니다.',
        keywords: ['예상 밖의 일', '갈등', '충돌'],
        category: 'relationship'
      },
      {
        prediction: '건강이나 체력적으로 힘들었던 시기일 수 있습니다. 또는 사고나 부상의 경험이 있었을 수 있습니다.',
        keywords: ['건강 주의', '체력 저하', '사고'],
        category: 'health'
      },
      {
        prediction: '직장이나 학업에서 큰 변동이 있었던 시기입니다. 이직, 퇴사, 전과 등의 경험이 있었을 수 있습니다.',
        keywords: ['직장 변동', '진로 변화', '도전'],
        category: 'career'
      }
    ],
    element_peak: [
      {
        prediction: '에너지가 높아져 활발하게 활동했던 시기입니다. 새로운 도전을 시작했거나 성과를 거뒀을 수 있습니다.',
        keywords: ['활발한 활동', '도전', '성과'],
        category: 'career'
      },
      {
        prediction: '재물운이 좋았던 시기입니다. 수입이 늘었거나, 좋은 투자 기회가 있었을 수 있습니다.',
        keywords: ['재물운', '수입 증가', '기회'],
        category: 'finance'
      }
    ],
    decision: [
      {
        prediction: '중요한 결정을 내려야 했던 시기입니다. 결혼, 이직, 창업, 이사 등 인생의 큰 결정이 있었을 수 있습니다.',
        keywords: ['중요한 결정', '인생 선택', '전환'],
        category: 'decision'
      },
      {
        prediction: '책임감이 커진 시기입니다. 새로운 역할을 맡았거나, 가족에 대한 책임이 늘었을 수 있습니다.',
        keywords: ['책임 증가', '새 역할', '성장'],
        category: 'career'
      }
    ]
  };

  const eventList = events[eventType];
  const selectedEvent = eventList[Math.floor(Math.random() * eventList.length)];

  return {
    period,
    prediction: selectedEvent.prediction,
    keywords: selectedEvent.keywords,
    confidence: 70 + Math.floor(Math.random() * 20), // 70-89%
    category: selectedEvent.category
  };
}

// 과거 검증 목록 생성 (메인 함수)
export function generatePastVerifications(
  user: UserInput,
  saju: SajuChart,
  yongsin: string[],
  gisin: string[]
): PastVerification[] {
  const currentYear = new Date().getFullYear();
  const birthYear = parseInt(user.birthDate.split('-')[0]);
  const verifications: PastVerification[] = [];

  // 1. 대운 전환기 찾기
  const daeunTransitions = calculateDaeunTransitions(birthYear, currentYear);
  for (const year of daeunTransitions.slice(-2)) { // 최근 2개
    verifications.push(generatePastEvent(year, 'transition', {}));
  }

  // 2. 충(沖) 연도 찾기
  const dayBranch = saju.day.branchKorean;
  const clashYears = findClashYears(dayBranch, birthYear, currentYear);
  for (const year of clashYears.slice(-1)) { // 최근 1개
    verifications.push(generatePastEvent(year, 'clash', { branch: dayBranch }));
  }

  // 3. 용신 에너지 강한 시기
  if (yongsin.length > 0) {
    const strongYears = findStrongElementYears(yongsin[0], birthYear, currentYear);
    for (const year of strongYears.slice(-1)) { // 최근 1개
      verifications.push(generatePastEvent(year, 'element_peak', { element: yongsin[0] }));
    }
  }

  // 중복 연도 제거하고 최신순 정렬
  const uniqueVerifications = verifications.reduce((acc, v) => {
    const existingYears = acc.map(a => a.period.split('년')[0]);
    const currentYearStr = v.period.split('년')[0];
    if (!existingYears.includes(currentYearStr)) {
      acc.push(v);
    }
    return acc;
  }, [] as PastVerification[]);

  // 최신순 정렬 후 3개만 반환
  return uniqueVerifications
    .sort((a, b) => {
      const yearA = parseInt(a.period.split('년')[0]);
      const yearB = parseInt(b.period.split('년')[0]);
      return yearB - yearA;
    })
    .slice(0, 3);
}

// 과거 검증 피드백 처리 (맞아요/아니에요 클릭 후)
export function generateVerificationResponse(
  isCorrect: boolean,
  verification: PastVerification
): string {
  if (isCorrect) {
    return `역시 사주가 말해주고 있었네요. ${verification.keywords[0]}의 시기였군요. ` +
      `이 경험이 지금의 당신을 만들었습니다. 앞으로의 흐름도 함께 살펴볼까요?`;
  } else {
    // 리커버리 메시지
    const recoveryMessages = [
      '그렇다면 내면적인 변화였을 수 있어요. 겉으로 드러나지 않아도, 마음속에서 무언가가 달라지고 있었을 거예요.',
      '직접적인 사건이 아니라, 생각이나 가치관의 변화였을 수 있습니다. 혹시 그 무렵 고민이 많았던 기억이 있으신가요?',
      '때로는 변화의 씨앗이 뿌려지는 시기이고, 실제 결과는 나중에 나타나기도 합니다. 이후 1-2년 사이에 변화가 있었을 수도 있어요.'
    ];
    return recoveryMessages[Math.floor(Math.random() * recoveryMessages.length)];
  }
}

// 과거 검증 신뢰도 계산
export function calculateOverallConfidence(
  verifications: PastVerification[],
  userFeedback: boolean[]
): number {
  if (userFeedback.length === 0) return 75; // 기본값

  const correctCount = userFeedback.filter(f => f).length;
  const baseConfidence = (correctCount / userFeedback.length) * 100;

  // 평균 예측 신뢰도 반영
  const avgPredictionConfidence = verifications.reduce((sum, v) => sum + v.confidence, 0) / verifications.length;

  // 두 값의 가중 평균 (사용자 피드백 70%, 예측 신뢰도 30%)
  return Math.round(baseConfidence * 0.7 + avgPredictionConfidence * 0.3);
}
