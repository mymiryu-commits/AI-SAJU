/**
 * 프리미엄 사주 스토리텔링 엔진
 * Premium Saju Storytelling Engine
 */

import { FourPillars, ElementBalance, SajuAnalysis } from './calculator';

// 일간별 스토리텔링 성향
export type DayMasterPersonality = 'leader' | 'creative' | 'analytical' | 'nurturing' | 'adventurous';

export interface LifeCycle {
  startAge: number;
  endAge: number;
  stem: string;
  branch: string;
  element: string;
  theme: string;
  opportunities: string[];
  challenges: string[];
  advice: string;
}

export interface YearlyFortune {
  year: number;
  stem: string;
  branch: string;
  animal: string;
  overall: number;
  wealth: number;
  love: number;
  career: number;
  health: number;
  keywords: string[];
  monthlyHighlights: { month: number; event: string }[];
  risks: string[];
  opportunities: string[];
}

export interface DailyFortune {
  date: string;
  stem: string;
  branch: string;
  luckyTime: string;
  luckyColor: string;
  luckyNumber: number;
  luckyDirection: string;
  overallScore: number;
  advice: string;
  warning: string;
  affirmation: string;
}

export interface CompatibilityResult {
  score: number;
  chemistry: string;
  strengths: string[];
  challenges: string[];
  advice: string;
  bestAspects: string[];
}

export interface CareerMatch {
  field: string;
  matchScore: number;
  reasons: string[];
  successFactors: string[];
  risks: string[];
  idealRole: string;
}

export interface PremiumStoryResult {
  // 기본 정보
  profile: {
    dayMaster: string;
    dayMasterName: string;
    personality: DayMasterPersonality;
    element: string;
    animalSign: string;
    coreTraits: string[];
  };

  // 인트로 스토리
  introStory: string;

  // 성격 심층 분석
  personalityDeepDive: {
    innateNature: string;
    hiddenPotential: string;
    shadowSide: string;
    lifeLesson: string;
  };

  // 대운 (10년 주기)
  majorCycles: LifeCycle[];

  // 소운 (연운)
  yearlyFortunes: YearlyFortune[];

  // 오늘의 운세
  dailyFortune: DailyFortune;

  // 인간관계
  relationships: {
    idealPartner: string;
    compatibleTypes: string[];
    challengingTypes: string[];
    friendshipStyle: string;
    familyDynamics: string;
  };

  // 직업 적성
  careerMatches: CareerMatch[];

  // 재물운
  wealthProfile: {
    moneyPersonality: string;
    incomeStyle: string;
    investmentAdvice: string;
    wealthPeakPeriod: string;
    financialRisks: string[];
  };

  // 건강 주의
  healthProfile: {
    constitutionType: string;
    vulnerabilities: string[];
    preventiveMeasures: string[];
    idealExercise: string;
    dietRecommendations: string[];
  };

  // 인생 조언
  lifeGuidance: {
    missionStatement: string;
    yearlyTheme: string;
    currentPhaseAdvice: string;
    futureOutlook: string;
  };

  // 행운의 요소
  luckyElements: {
    colors: string[];
    numbers: number[];
    directions: string[];
    gemstones: string[];
    plants: string[];
  };
}

// 천간 정보
const STEM_INFO: Record<string, {
  name: string;
  element: string;
  yin_yang: '양' | '음';
  personality: DayMasterPersonality;
  nature: string;
  keywords: string[];
}> = {
  '甲': {
    name: '갑목',
    element: '木',
    yin_yang: '양',
    personality: 'leader',
    nature: '큰 나무처럼 곧고 강직함',
    keywords: ['리더십', '정의감', '진취성', '독립심'],
  },
  '乙': {
    name: '을목',
    element: '木',
    yin_yang: '음',
    personality: 'creative',
    nature: '풀과 덩굴처럼 유연하고 적응력 있음',
    keywords: ['유연성', '적응력', '예술성', '협조'],
  },
  '丙': {
    name: '병화',
    element: '火',
    yin_yang: '양',
    personality: 'leader',
    nature: '태양처럼 밝고 열정적',
    keywords: ['열정', '카리스마', '낙관', '표현력'],
  },
  '丁': {
    name: '정화',
    element: '火',
    yin_yang: '음',
    personality: 'analytical',
    nature: '촛불처럼 섬세하고 따뜻함',
    keywords: ['섬세함', '지성', '헌신', '감수성'],
  },
  '戊': {
    name: '무토',
    element: '土',
    yin_yang: '양',
    personality: 'nurturing',
    nature: '산처럼 듬직하고 포용력 있음',
    keywords: ['신뢰', '안정', '포용', '책임감'],
  },
  '己': {
    name: '기토',
    element: '土',
    yin_yang: '음',
    personality: 'nurturing',
    nature: '논밭처럼 생산적이고 실용적',
    keywords: ['실용성', '겸손', '인내', '배려'],
  },
  '庚': {
    name: '경금',
    element: '金',
    yin_yang: '양',
    personality: 'adventurous',
    nature: '바위와 쇠처럼 강인하고 결단력 있음',
    keywords: ['결단력', '의지', '정의', '용기'],
  },
  '辛': {
    name: '신금',
    element: '金',
    yin_yang: '음',
    personality: 'analytical',
    nature: '보석처럼 섬세하고 품위 있음',
    keywords: ['심미안', '완벽주의', '섬세함', '품격'],
  },
  '壬': {
    name: '임수',
    element: '水',
    yin_yang: '양',
    personality: 'adventurous',
    nature: '바다처럼 깊고 포용력 있음',
    keywords: ['지혜', '포용력', '자유', '창의성'],
  },
  '癸': {
    name: '계수',
    element: '水',
    yin_yang: '음',
    personality: 'creative',
    nature: '이슬과 빗물처럼 순수하고 직관적',
    keywords: ['직관', '상상력', '순수함', '적응력'],
  },
};

// 사상체질 자동 계산 (오행 균형 기반)
export function calculateSasangConstitution(elementBalance: ElementBalance): {
  type: string;
  name: string;
  confidence: number;
  description: string;
} {
  const { 木, 火, 土, 金, 水 } = elementBalance;

  // 체질 판단 로직
  // 태양인: 폐대간소 (金강 木약)
  // 소양인: 비대신소 (火강 水약)
  // 태음인: 간대폐소 (木강 金약)
  // 소음인: 신대비소 (水강 火약)

  const scores = {
    taeyang: (金 * 2 - 木) + (火 - 水),
    soyang: (火 * 2 - 水) + (土 - 金),
    taeeum: (木 * 2 - 金) + (水 - 火),
    soeum: (水 * 2 - 火) + (金 - 木),
  };

  const maxScore = Math.max(...Object.values(scores));
  const constitution = Object.entries(scores).find(([, score]) => score === maxScore)?.[0] || 'taeeum';

  const info: Record<string, { name: string; description: string }> = {
    taeyang: {
      name: '태양인(太陽人)',
      description: '폐 기능이 발달하고 간 기능이 약한 체질입니다. 창의적이고 추진력이 강하나 지구력이 약할 수 있습니다.',
    },
    soyang: {
      name: '소양인(少陽人)',
      description: '비장 기능이 발달하고 신장 기능이 약한 체질입니다. 활발하고 사교적이나 신중함이 필요합니다.',
    },
    taeeum: {
      name: '태음인(太陰人)',
      description: '간 기능이 발달하고 폐 기능이 약한 체질입니다. 인내심이 강하고 신중하나 활동성이 필요합니다.',
    },
    soeum: {
      name: '소음인(少陰人)',
      description: '신장 기능이 발달하고 비장 기능이 약한 체질입니다. 섬세하고 꼼꼼하나 자신감이 필요합니다.',
    },
  };

  return {
    type: constitution,
    name: info[constitution].name,
    confidence: Math.min(95, 60 + Math.abs(maxScore) * 5),
    description: info[constitution].description,
  };
}

// 대운 계산 (10년 주기)
export function calculateMajorCycles(
  birthYear: number,
  birthMonth: number,
  birthDay: number,
  gender: 'male' | 'female',
  fourPillars: FourPillars
): LifeCycle[] {
  const cycles: LifeCycle[] = [];
  const stems = ['甲', '乙', '丙', '丁', '戊', '己', '庚', '辛', '壬', '癸'];
  const branches = ['子', '丑', '寅', '卯', '辰', '巳', '午', '未', '申', '酉', '戌', '亥'];

  // 월주 기준으로 대운 산출
  const monthStemIdx = stems.indexOf(fourPillars.month.stem);
  const monthBranchIdx = branches.indexOf(fourPillars.month.branch);

  // 년간의 음양과 성별로 순행/역행 결정
  const yearStemIdx = stems.indexOf(fourPillars.year.stem);
  const isYangYear = yearStemIdx % 2 === 0;
  const direction = (isYangYear && gender === 'male') || (!isYangYear && gender === 'female') ? 1 : -1;

  // 대운 시작 나이 계산 (간략화)
  const startAge = 3 + (birthMonth % 3);

  for (let i = 0; i < 8; i++) {
    const stemIdx = (monthStemIdx + (i + 1) * direction + 10) % 10;
    const branchIdx = (monthBranchIdx + (i + 1) * direction + 12) % 12;

    const stem = stems[stemIdx];
    const branch = branches[branchIdx];

    const cycleStartAge = startAge + i * 10;
    const cycleEndAge = cycleStartAge + 9;

    const element = getElementFromStem(stem);
    const theme = getCycleTheme(stem, branch, i);

    cycles.push({
      startAge: cycleStartAge,
      endAge: cycleEndAge,
      stem,
      branch,
      element,
      theme: theme.theme,
      opportunities: theme.opportunities,
      challenges: theme.challenges,
      advice: theme.advice,
    });
  }

  return cycles;
}

function getElementFromStem(stem: string): string {
  const elements: Record<string, string> = {
    '甲': '木', '乙': '木', '丙': '火', '丁': '火', '戊': '土',
    '己': '土', '庚': '金', '辛': '金', '壬': '水', '癸': '水',
  };
  return elements[stem] || '土';
}

function getCycleTheme(stem: string, branch: string, cycleIndex: number): {
  theme: string;
  opportunities: string[];
  challenges: string[];
  advice: string;
} {
  const themes: Record<string, {
    theme: string;
    opportunities: string[];
    challenges: string[];
    advice: string;
  }> = {
    '甲': {
      theme: '새로운 시작과 성장의 시기',
      opportunities: ['새로운 사업 기회', '리더십 발휘', '자기계발'],
      challenges: ['고집으로 인한 갈등', '과도한 욕심'],
      advice: '유연한 태도로 새로운 시작을 모색하세요.',
    },
    '乙': {
      theme: '협력과 조화의 시기',
      opportunities: ['인맥 확장', '협업 프로젝트', '예술적 성취'],
      challenges: ['우유부단함', '타인 의존'],
      advice: '주변과의 조화를 이루며 부드럽게 전진하세요.',
    },
    '丙': {
      theme: '열정과 표현의 시기',
      opportunities: ['대외 활동 성공', '인기 상승', '창작 활동'],
      challenges: ['급한 성격', '과시욕'],
      advice: '열정을 지혜롭게 표현하고 꾸준함을 유지하세요.',
    },
    '丁': {
      theme: '성찰과 지혜의 시기',
      opportunities: ['학문적 성취', '기술 연마', '내면 성장'],
      challenges: ['예민함', '과도한 걱정'],
      advice: '내면의 빛을 키우고 지혜롭게 행동하세요.',
    },
    '戊': {
      theme: '안정과 확장의 시기',
      opportunities: ['재물 축적', '부동산 기회', '신뢰 구축'],
      challenges: ['보수성', '변화 거부'],
      advice: '안정을 기반으로 한 단계 도약을 준비하세요.',
    },
    '己': {
      theme: '수확과 정리의 시기',
      opportunities: ['실질적 성과', '인간관계 정리', '내실 다지기'],
      challenges: ['지나친 겸손', '자기비하'],
      advice: '겸손하되 자신의 가치를 인정하세요.',
    },
    '庚': {
      theme: '변혁과 결단의 시기',
      opportunities: ['과감한 변화', '새 분야 도전', '결단의 성과'],
      challenges: ['과격함', '관계 갈등'],
      advice: '정의롭되 유연하게, 결단하되 신중하게 행동하세요.',
    },
    '辛': {
      theme: '정제와 완성의 시기',
      opportunities: ['전문성 확보', '품격 향상', '섬세한 성과'],
      challenges: ['완벽주의', '고독감'],
      advice: '세밀함을 강점으로 삼되 완벽에 집착하지 마세요.',
    },
    '壬': {
      theme: '지혜와 포용의 시기',
      opportunities: ['해외 활동', '큰 그림 완성', '지적 성장'],
      challenges: ['방향 상실', '변덕'],
      advice: '넓은 시야로 흐름을 읽고 유연하게 대처하세요.',
    },
    '癸': {
      theme: '직관과 치유의 시기',
      opportunities: ['영적 성장', '창작 활동', '상담/치유 분야'],
      challenges: ['현실 도피', '감정 기복'],
      advice: '직관을 믿되 현실적 기반을 놓치지 마세요.',
    },
  };

  return themes[stem] || themes['戊'];
}

// 연운 계산
export function calculateYearlyFortune(
  targetYear: number,
  fourPillars: FourPillars,
  dayMaster: string
): YearlyFortune {
  const stems = ['甲', '乙', '丙', '丁', '戊', '己', '庚', '辛', '壬', '癸'];
  const branches = ['子', '丑', '寅', '卯', '辰', '巳', '午', '未', '申', '酉', '戌', '亥'];
  const animals = ['쥐', '소', '호랑이', '토끼', '용', '뱀', '말', '양', '원숭이', '닭', '개', '돼지'];

  const stemIdx = (targetYear - 4) % 10;
  const branchIdx = (targetYear - 4) % 12;

  const yearStem = stems[stemIdx >= 0 ? stemIdx : stemIdx + 10];
  const yearBranch = branches[branchIdx >= 0 ? branchIdx : branchIdx + 12];
  const yearAnimal = animals[branchIdx >= 0 ? branchIdx : branchIdx + 12];

  // 일간과 년간의 관계로 운세 계산
  const dayMasterIdx = stems.indexOf(dayMaster);
  const yearStemIdx = stems.indexOf(yearStem);
  const relationship = (yearStemIdx - dayMasterIdx + 10) % 10;

  // 기본 점수 (관계에 따라)
  const baseScore = 70 + Math.sin(relationship * Math.PI / 5) * 15;

  const scores = {
    overall: Math.round(baseScore + Math.random() * 10),
    wealth: Math.round(baseScore + (relationship % 2 === 0 ? 5 : -3) + Math.random() * 8),
    love: Math.round(baseScore + (relationship === 6 ? 10 : 0) + Math.random() * 8),
    career: Math.round(baseScore + (relationship < 5 ? 5 : -3) + Math.random() * 8),
    health: Math.round(baseScore - Math.abs(relationship - 5) + Math.random() * 8),
  };

  // 월별 하이라이트
  const monthlyHighlights = generateMonthlyHighlights(yearStem, fourPillars);

  // 키워드
  const keywords = getYearKeywords(yearStem, yearBranch, dayMaster);

  // 리스크와 기회
  const { risks, opportunities } = getYearRisksOpportunities(yearStem, dayMaster, scores);

  return {
    year: targetYear,
    stem: yearStem,
    branch: yearBranch,
    animal: yearAnimal,
    overall: Math.min(95, Math.max(50, scores.overall)),
    wealth: Math.min(95, Math.max(50, scores.wealth)),
    love: Math.min(95, Math.max(50, scores.love)),
    career: Math.min(95, Math.max(50, scores.career)),
    health: Math.min(95, Math.max(50, scores.health)),
    keywords,
    monthlyHighlights,
    risks,
    opportunities,
  };
}

function generateMonthlyHighlights(yearStem: string, fourPillars: FourPillars): { month: number; event: string }[] {
  const highlights: { month: number; event: string }[] = [];

  const events = [
    '새로운 기회가 찾아옴',
    '인간관계에서 좋은 소식',
    '재물운 상승',
    '건강 관리 필요',
    '중요한 결정의 시기',
    '여행이나 이동수',
    '학업/자기계발 적기',
    '가족 경사',
    '사업 확장 기회',
    '내면 성찰의 시간',
    '협력자를 만남',
    '한 해 결실의 시기',
  ];

  // 각 월별로 이벤트 배정
  for (let m = 1; m <= 12; m++) {
    if (m % 3 === 0 || m === 1 || m === 12) {
      highlights.push({
        month: m,
        event: events[(m - 1) % events.length],
      });
    }
  }

  return highlights;
}

function getYearKeywords(yearStem: string, yearBranch: string, dayMaster: string): string[] {
  const stemKeywords: Record<string, string[]> = {
    '甲': ['시작', '성장', '도전'],
    '乙': ['협력', '유연성', '조화'],
    '丙': ['열정', '표현', '인기'],
    '丁': ['지혜', '통찰', '섬세'],
    '戊': ['안정', '신뢰', '확장'],
    '己': ['수확', '정리', '내실'],
    '庚': ['변화', '결단', '혁신'],
    '辛': ['정제', '품격', '완성'],
    '壬': ['지혜', '포용', '자유'],
    '癸': ['직관', '치유', '창조'],
  };

  return stemKeywords[yearStem] || ['변화', '성장', '도전'];
}

function getYearRisksOpportunities(yearStem: string, dayMaster: string, scores: Record<string, number>): {
  risks: string[];
  opportunities: string[];
} {
  const risks: string[] = [];
  const opportunities: string[] = [];

  if (scores.health < 70) risks.push('건강 관리에 각별히 신경 쓰세요');
  if (scores.wealth < 70) risks.push('무리한 투자는 삼가세요');
  if (scores.love < 70) risks.push('인간관계에서 오해가 생길 수 있어요');
  if (scores.career < 70) risks.push('직장 내 갈등에 주의하세요');

  if (scores.overall >= 80) opportunities.push('전반적으로 좋은 흐름입니다');
  if (scores.wealth >= 80) opportunities.push('재물운이 좋아 투자 적기입니다');
  if (scores.love >= 80) opportunities.push('새로운 인연을 만날 수 있습니다');
  if (scores.career >= 80) opportunities.push('승진이나 이직의 좋은 기회입니다');

  return { risks, opportunities };
}

// 일진 계산
export function calculateDailyFortune(
  date: Date,
  fourPillars: FourPillars,
  dayMaster: string
): DailyFortune {
  const stems = ['甲', '乙', '丙', '丁', '戊', '己', '庚', '辛', '壬', '癸'];
  const branches = ['子', '丑', '寅', '卯', '辰', '巳', '午', '未', '申', '酉', '戌', '亥'];

  // 1900년 1월 1일 기준 일진 계산
  const baseDate = new Date(1900, 0, 1);
  const diffDays = Math.floor((date.getTime() - baseDate.getTime()) / (1000 * 60 * 60 * 24));

  const stemIdx = (diffDays + 0) % 10;
  const branchIdx = (diffDays + 4) % 12;

  const dayStem = stems[stemIdx >= 0 ? stemIdx : stemIdx + 10];
  const dayBranch = branches[branchIdx >= 0 ? branchIdx : branchIdx + 12];

  // 일간과 일진의 관계
  const dayMasterIdx = stems.indexOf(dayMaster);
  const todayStemIdx = stems.indexOf(dayStem);
  const relationship = (todayStemIdx - dayMasterIdx + 10) % 10;

  const score = Math.round(60 + Math.sin(relationship * Math.PI / 5) * 25 + Math.random() * 10);

  const colors = ['빨간색', '주황색', '노란색', '초록색', '파란색', '남색', '보라색', '흰색', '검은색', '분홍색'];
  const directions = ['동쪽', '동남쪽', '남쪽', '남서쪽', '서쪽', '서북쪽', '북쪽', '북동쪽'];
  const times = ['06-08시', '08-10시', '10-12시', '12-14시', '14-16시', '16-18시', '18-20시'];

  return {
    date: date.toISOString().split('T')[0],
    stem: dayStem,
    branch: dayBranch,
    luckyTime: times[todayStemIdx % times.length],
    luckyColor: colors[todayStemIdx],
    luckyNumber: ((todayStemIdx + branchIdx) % 9) + 1,
    luckyDirection: directions[branchIdx % 8],
    overallScore: Math.min(95, Math.max(40, score)),
    advice: getDailyAdvice(dayStem, dayMaster, score),
    warning: getDailyWarning(dayStem, dayMaster, score),
    affirmation: getDailyAffirmation(dayMaster),
  };
}

function getDailyAdvice(dayStem: string, dayMaster: string, score: number): string {
  if (score >= 80) return '오늘은 적극적으로 행동해도 좋은 날입니다. 미뤄왔던 일을 추진하세요.';
  if (score >= 60) return '무난한 하루입니다. 계획한 일을 차분히 진행하세요.';
  return '오늘은 신중하게 행동하세요. 중요한 결정은 미루는 것이 좋습니다.';
}

function getDailyWarning(dayStem: string, dayMaster: string, score: number): string {
  if (score < 50) return '건강과 안전에 각별히 주의하세요.';
  if (score < 70) return '대인관계에서 오해가 생기지 않도록 주의하세요.';
  return '좋은 에너지를 유지하되 과욕은 금물입니다.';
}

function getDailyAffirmation(dayMaster: string): string {
  const affirmations: Record<string, string> = {
    '甲': '나는 힘차게 성장하는 큰 나무입니다.',
    '乙': '나는 유연하게 어디서든 뿌리내립니다.',
    '丙': '나는 세상을 밝히는 태양입니다.',
    '丁': '나는 어둠을 밝히는 따뜻한 불빛입니다.',
    '戊': '나는 모두를 품는 든든한 산입니다.',
    '己': '나는 생명을 키우는 비옥한 땅입니다.',
    '庚': '나는 정의를 세우는 강한 검입니다.',
    '辛': '나는 빛나는 보석처럼 가치 있습니다.',
    '壬': '나는 모든 것을 포용하는 바다입니다.',
    '癸': '나는 생명을 주는 맑은 샘물입니다.',
  };
  return affirmations[dayMaster] || '나는 오늘도 최선을 다합니다.';
}

// 궁합 분석
export function calculateCompatibility(
  person1DayMaster: string,
  person2DayMaster: string
): CompatibilityResult {
  const stems = ['甲', '乙', '丙', '丁', '戊', '己', '庚', '辛', '壬', '癸'];

  const idx1 = stems.indexOf(person1DayMaster);
  const idx2 = stems.indexOf(person2DayMaster);
  const diff = Math.abs(idx1 - idx2);

  // 천간합 체크 (甲己, 乙庚, 丙辛, 丁壬, 戊癸)
  const isHarmony = (diff === 5);

  // 상생/상극 체크
  const elements = ['木', '木', '火', '火', '土', '土', '金', '金', '水', '水'];
  const el1 = elements[idx1];
  const el2 = elements[idx2];

  let baseScore = 60;
  let chemistry = '보통';

  if (isHarmony) {
    baseScore = 90;
    chemistry = '천생연분';
  } else if (diff === 2 || diff === 8) {
    baseScore = 75;
    chemistry = '좋은 궁합';
  } else if (diff === 4 || diff === 6) {
    baseScore = 55;
    chemistry = '노력이 필요한 궁합';
  }

  return {
    score: baseScore + Math.floor(Math.random() * 10),
    chemistry,
    strengths: getCompatibilityStrengths(person1DayMaster, person2DayMaster, isHarmony),
    challenges: getCompatibilityChallenges(person1DayMaster, person2DayMaster),
    advice: getCompatibilityAdvice(chemistry),
    bestAspects: isHarmony ? ['정서적 교감', '상호 성장', '안정적 관계'] : ['상호 보완', '새로운 관점'],
  };
}

function getCompatibilityStrengths(dm1: string, dm2: string, isHarmony: boolean): string[] {
  if (isHarmony) {
    return ['서로를 깊이 이해함', '자연스러운 소통', '정서적 안정감', '함께 성장할 수 있음'];
  }
  return ['다양한 관점 공유', '서로의 부족함을 채움', '새로운 자극을 줌'];
}

function getCompatibilityChallenges(dm1: string, dm2: string): string[] {
  return ['가치관 차이 조율 필요', '의사소통 방식 이해 필요', '서로의 속도 맞추기'];
}

function getCompatibilityAdvice(chemistry: string): string {
  if (chemistry === '천생연분') return '서로를 있는 그대로 받아들이면 최고의 파트너가 됩니다.';
  if (chemistry === '좋은 궁합') return '작은 배려가 관계를 더욱 깊게 만듭니다.';
  return '차이를 인정하고 존중하는 것이 관계의 열쇠입니다.';
}

// 직업 매칭
export function matchCareers(
  dayMaster: string,
  elementBalance: ElementBalance
): CareerMatch[] {
  const careersByElement: Record<string, CareerMatch[]> = {
    '木': [
      { field: '교육/학문', matchScore: 85, reasons: ['성장을 돕는 역할에 적합', '지식 전달 능력 우수'], successFactors: ['꾸준한 자기계발', '인내심'], risks: ['번아웃 주의'], idealRole: '교수, 연구원, 코치' },
      { field: '의료/건강', matchScore: 80, reasons: ['생명을 다루는 일에 적성', '치유 에너지 보유'], successFactors: ['공감 능력', '전문성'], risks: ['감정 소진'], idealRole: '의사, 한의사, 상담사' },
    ],
    '火': [
      { field: '미디어/엔터테인먼트', matchScore: 90, reasons: ['표현력 우수', '카리스마'], successFactors: ['꾸준한 자기관리', '겸손'], risks: ['과시욕 주의'], idealRole: '방송인, 배우, 유튜버' },
      { field: '마케팅/영업', matchScore: 85, reasons: ['설득력 있음', '열정적'], successFactors: ['인맥 관리', '신뢰 구축'], risks: ['급한 성격 조절'], idealRole: '마케터, 영업 관리자' },
    ],
    '土': [
      { field: '부동산/건설', matchScore: 88, reasons: ['안정 지향', '장기 안목'], successFactors: ['시장 분석력', '인내'], risks: ['보수적 성향'], idealRole: '부동산 개발자, 건축가' },
      { field: '금융/투자', matchScore: 82, reasons: ['신뢰감', '꼼꼼함'], successFactors: ['리스크 관리', '정보력'], risks: ['결단력 부족'], idealRole: '펀드매니저, 재무설계사' },
    ],
    '金': [
      { field: '법률/경찰', matchScore: 87, reasons: ['정의감', '결단력'], successFactors: ['원칙 준수', '유연성'], risks: ['융통성 부족'], idealRole: '판사, 검사, 변호사' },
      { field: 'IT/기술', matchScore: 84, reasons: ['논리적', '분석력'], successFactors: ['지속적 학습', '팀워크'], risks: ['완벽주의'], idealRole: '개발자, 데이터 분석가' },
    ],
    '水': [
      { field: '무역/유통', matchScore: 86, reasons: ['적응력', '글로벌 감각'], successFactors: ['네트워킹', '유연성'], risks: ['방향성 상실'], idealRole: '무역상, 물류 전문가' },
      { field: '예술/창작', matchScore: 88, reasons: ['창의성', '직관'], successFactors: ['꾸준한 창작', '자기표현'], risks: ['현실감각'], idealRole: '작가, 예술가, 디자이너' },
    ],
  };

  const dayMasterElement = STEM_INFO[dayMaster]?.element || '土';

  // 주요 원소의 직업 추천
  const primaryCareers = careersByElement[dayMasterElement] || [];

  // 오행 균형에서 강한 원소의 직업도 추가
  const sortedElements = Object.entries(elementBalance)
    .sort(([, a], [, b]) => b - a);

  const strongElement = sortedElements[0][0];
  const secondaryCareers = strongElement !== dayMasterElement
    ? (careersByElement[strongElement] || []).slice(0, 1)
    : [];

  return [...primaryCareers, ...secondaryCareers];
}

// 프리미엄 스토리 생성
export function generatePremiumStory(
  sajuAnalysis: SajuAnalysis,
  birthYear: number,
  birthMonth: number,
  birthDay: number,
  birthHour: number,
  gender: 'male' | 'female',
  name: string
): PremiumStoryResult {
  const dayMaster = sajuAnalysis.dayMaster;
  const stemInfo = STEM_INFO[dayMaster];
  const currentYear = new Date().getFullYear();

  // 사상체질 계산
  const constitution = calculateSasangConstitution(sajuAnalysis.elementBalance);

  // 대운 계산
  const majorCycles = calculateMajorCycles(
    birthYear, birthMonth, birthDay, gender, sajuAnalysis.fourPillars
  );

  // 연운 계산 (현재 년도부터 5년)
  const yearlyFortunes: YearlyFortune[] = [];
  for (let y = currentYear; y <= currentYear + 4; y++) {
    yearlyFortunes.push(calculateYearlyFortune(y, sajuAnalysis.fourPillars, dayMaster));
  }

  // 오늘의 운세
  const dailyFortune = calculateDailyFortune(new Date(), sajuAnalysis.fourPillars, dayMaster);

  // 직업 매칭
  const careerMatches = matchCareers(dayMaster, sajuAnalysis.elementBalance);

  // 인트로 스토리 생성
  const introStory = generateIntroStory(name, stemInfo, sajuAnalysis.fourPillars.year.animal, constitution);

  return {
    profile: {
      dayMaster,
      dayMasterName: stemInfo?.name || dayMaster,
      personality: stemInfo?.personality || 'analytical',
      element: stemInfo?.element || '土',
      animalSign: sajuAnalysis.fourPillars.year.animal,
      coreTraits: stemInfo?.keywords || [],
    },

    introStory,

    personalityDeepDive: {
      innateNature: stemInfo?.nature || '안정적이고 신뢰할 수 있는 성격',
      hiddenPotential: getHiddenPotential(dayMaster),
      shadowSide: getShadowSide(dayMaster),
      lifeLesson: getLifeLesson(dayMaster),
    },

    majorCycles,
    yearlyFortunes,
    dailyFortune,

    relationships: {
      idealPartner: getIdealPartner(dayMaster),
      compatibleTypes: getCompatibleTypes(dayMaster),
      challengingTypes: getChallengingTypes(dayMaster),
      friendshipStyle: getFriendshipStyle(dayMaster),
      familyDynamics: getFamilyDynamics(dayMaster),
    },

    careerMatches,

    wealthProfile: {
      moneyPersonality: getMoneyPersonality(dayMaster),
      incomeStyle: getIncomeStyle(dayMaster),
      investmentAdvice: getInvestmentAdvice(dayMaster, sajuAnalysis.elementBalance),
      wealthPeakPeriod: getWealthPeakPeriod(majorCycles),
      financialRisks: getFinancialRisks(dayMaster),
    },

    healthProfile: {
      constitutionType: constitution.name,
      vulnerabilities: getHealthVulnerabilities(sajuAnalysis.weakElements),
      preventiveMeasures: getPreventiveMeasures(sajuAnalysis.weakElements),
      idealExercise: getIdealExercise(constitution.type),
      dietRecommendations: getDietRecommendations(constitution.type),
    },

    lifeGuidance: {
      missionStatement: getMissionStatement(dayMaster),
      yearlyTheme: yearlyFortunes[0]?.keywords.join(', ') || '성장과 도전',
      currentPhaseAdvice: getCurrentPhaseAdvice(majorCycles, currentYear - birthYear),
      futureOutlook: getFutureOutlook(yearlyFortunes),
    },

    luckyElements: {
      colors: getLuckyColors(sajuAnalysis.luckyElements),
      numbers: getLuckyNumbers(dayMaster),
      directions: getLuckyDirections(sajuAnalysis.luckyElements),
      gemstones: getLuckyGemstones(sajuAnalysis.luckyElements),
      plants: getLuckyPlants(sajuAnalysis.luckyElements),
    },
  };
}

// 헬퍼 함수들
function generateIntroStory(name: string, stemInfo: typeof STEM_INFO[string], animal: string, constitution: { name: string }): string {
  return `${name}님은 ${animal}띠의 기운을 타고난 ${stemInfo?.name || ''}의 주인공입니다.

${stemInfo?.nature || ''} 당신의 사주에는 특별한 에너지가 흐르고 있습니다.

${constitution.name}의 체질을 가진 당신은 고유한 강점과 함께 돌봐야 할 부분도 있습니다.

이 분석을 통해 당신만의 인생 내비게이션을 발견하시길 바랍니다.`;
}

function getHiddenPotential(dayMaster: string): string {
  const potentials: Record<string, string> = {
    '甲': '큰 조직을 이끄는 리더십과 새로운 분야를 개척하는 선구자적 능력',
    '乙': '예술적 감각과 사람들 사이에서 조화를 이끌어내는 외교적 능력',
    '丙': '대중을 사로잡는 카리스마와 새로운 트렌드를 만드는 창조력',
    '丁': '깊은 통찰력과 복잡한 문제를 해결하는 분석력',
    '戊': '흔들리지 않는 신뢰감과 큰 자산을 관리하는 능력',
    '己': '섬세한 배려와 실질적인 문제 해결 능력',
    '庚': '과감한 결단력과 조직을 혁신하는 추진력',
    '辛': '뛰어난 심미안과 완벽한 결과물을 만드는 장인 정신',
    '壬': '넓은 시야와 글로벌 무대에서 활약할 수 있는 역량',
    '癸': '강한 직관력과 사람의 마음을 치유하는 능력',
  };
  return potentials[dayMaster] || '숨겨진 잠재력이 있습니다.';
}

function getShadowSide(dayMaster: string): string {
  const shadows: Record<string, string> = {
    '甲': '고집과 독선, 타인의 의견을 무시하는 경향',
    '乙': '우유부단함, 주체성 부족, 타인 의존',
    '丙': '급한 성격, 과시욕, 지속력 부족',
    '丁': '과도한 걱정, 예민함, 자기비판',
    '戊': '고지식함, 변화 거부, 느린 적응',
    '己': '자기비하, 과도한 겸손, 소극성',
    '庚': '공격성, 융통성 부족, 관계 갈등',
    '辛': '완벽주의로 인한 스트레스, 고독감',
    '壬': '방향 상실, 변덕, 책임 회피',
    '癸': '현실 도피, 감정 기복, 의존성',
  };
  return shadows[dayMaster] || '조심해야 할 부분이 있습니다.';
}

function getLifeLesson(dayMaster: string): string {
  const lessons: Record<string, string> = {
    '甲': '유연함을 배우고, 함께 성장하는 리더가 되는 것',
    '乙': '자기 주관을 세우고, 독립적인 힘을 기르는 것',
    '丙': '꾸준함을 기르고, 내면의 빛을 가꾸는 것',
    '丁': '자신감을 키우고, 걱정을 내려놓는 것',
    '戊': '변화를 받아들이고, 유연하게 대처하는 것',
    '己': '자신의 가치를 인정하고, 당당해지는 것',
    '庚': '부드러움을 배우고, 관계의 소중함을 아는 것',
    '辛': '완벽하지 않아도 괜찮다는 것을 받아들이는 것',
    '壬': '방향을 정하고, 책임감을 기르는 것',
    '癸': '현실에 발 딛고, 감정을 다스리는 것',
  };
  return lessons[dayMaster] || '인생의 교훈을 찾아가는 중입니다.';
}

function getIdealPartner(dayMaster: string): string {
  const partners: Record<string, string> = {
    '甲': '부드럽고 유연하며 당신의 열정을 이해하는 사람 (乙, 己)',
    '乙': '든든하고 안정적이며 당신을 보호해주는 사람 (庚, 甲)',
    '丙': '지적이고 섬세하며 당신의 열정을 차분하게 해주는 사람 (辛, 壬)',
    '丁': '활동적이고 밝으며 당신에게 에너지를 주는 사람 (壬, 甲)',
    '戊': '섬세하고 실용적이며 함께 안정을 추구하는 사람 (癸, 己)',
    '己': '리더십 있고 결단력 있으며 당신을 이끌어주는 사람 (甲, 庚)',
    '庚': '유연하고 예술적이며 당신의 강함을 부드럽게 하는 사람 (乙, 丁)',
    '辛': '열정적이고 밝으며 당신에게 따뜻함을 주는 사람 (丙, 壬)',
    '壬': '섬세하고 직관적이며 깊은 교감이 가능한 사람 (丁, 己)',
    '癸': '안정적이고 든든하며 현실적인 기반을 주는 사람 (戊, 庚)',
  };
  return partners[dayMaster] || '서로를 이해하고 존중하는 사람';
}

function getCompatibleTypes(dayMaster: string): string[] {
  const types: Record<string, string[]> = {
    '甲': ['己土형 - 부드러운 배려', '癸水형 - 지지와 양육'],
    '乙': ['庚金형 - 결단력 보완', '壬水형 - 지혜로운 조언'],
    '丙': ['辛金형 - 섬세한 균형', '壬水형 - 차분한 안정'],
    '丁': ['壬水형 - 깊은 교감', '甲木형 - 에너지 충전'],
    '戊': ['癸水형 - 부드러운 소통', '丙火형 - 열정적 자극'],
    '己': ['甲木형 - 리더십 보완', '辛金형 - 섬세한 조화'],
    '庚': ['乙木형 - 유연성 배움', '丁火형 - 따뜻한 정제'],
    '辛': ['丙火형 - 밝은 에너지', '壬水형 - 지혜로운 소통'],
    '壬': ['丁火형 - 따뜻한 빛', '己土형 - 안정적 기반'],
    '癸': ['戊土형 - 든든한 지지', '甲木형 - 성장 에너지'],
  };
  return types[dayMaster] || ['상호 이해형', '보완형'];
}

function getChallengingTypes(dayMaster: string): string[] {
  const types: Record<string, string[]> = {
    '甲': ['庚金형 - 충돌 가능', '同甲木형 - 경쟁 관계'],
    '乙': ['辛金형 - 상처 주고받음', '同乙木형 - 의존 관계'],
    '丙': ['壬水형(과다) - 열정 억제', '同丙火형 - 과열 경쟁'],
    '丁': ['癸水형 - 감정 충돌', '庚金형 - 냉정한 관계'],
    '戊': ['甲木형(과다) - 권위 도전', '同戊土형 - 고집 충돌'],
    '己': ['乙木형 - 우유부단 강화', '同己土형 - 소극적'],
    '庚': ['丙火형 - 녹아내림', '同庚金형 - 강대강 충돌'],
    '辛': ['丁火형(과다) - 상처', '同辛金형 - 완벽주의 경쟁'],
    '壬': ['戊土형(과다) - 자유 억압', '同壬水형 - 방향 상실'],
    '癸': ['己土형(과다) - 흡수됨', '同癸水형 - 감정 과잉'],
  };
  return types[dayMaster] || ['같은 유형', '상극 유형'];
}

function getFriendshipStyle(dayMaster: string): string {
  const styles: Record<string, string> = {
    '甲': '리더 역할을 맡으며, 친구들에게 방향을 제시합니다. 충성스럽고 정의로운 친구입니다.',
    '乙': '조화를 중시하며, 갈등을 중재합니다. 부드럽고 배려심 깊은 친구입니다.',
    '丙': '분위기 메이커로 모임의 중심이 됩니다. 열정적이고 재미있는 친구입니다.',
    '丁': '깊은 대화를 나누며, 친구의 고민을 들어줍니다. 섬세하고 이해심 많은 친구입니다.',
    '戊': '든든한 버팀목이 되어줍니다. 신뢰할 수 있고 변함없는 친구입니다.',
    '己': '실질적인 도움을 주며, 함께 성장합니다. 겸손하고 성실한 친구입니다.',
    '庚': '직설적이고 솔직한 조언을 합니다. 정의롭고 원칙적인 친구입니다.',
    '辛': '품격 있는 관계를 추구합니다. 섬세하고 격조 있는 친구입니다.',
    '壬': '자유롭고 열린 관계를 맺습니다. 포용적이고 지혜로운 친구입니다.',
    '癸': '직관적으로 친구의 마음을 읽습니다. 공감능력이 뛰어난 친구입니다.',
  };
  return styles[dayMaster] || '진정성 있는 관계를 맺습니다.';
}

function getFamilyDynamics(dayMaster: string): string {
  const dynamics: Record<string, string> = {
    '甲': '가족의 기둥 역할을 합니다. 책임감이 강하지만 때로는 고집이 갈등의 원인이 됩니다.',
    '乙': '가족 간의 화합을 중시합니다. 부드러운 중재자지만 자기 주장이 약할 수 있습니다.',
    '丙': '가정에 활력을 불어넣습니다. 밝은 에너지지만 급한 성격에 주의가 필요합니다.',
    '丁': '가족의 감정을 세심하게 챙깁니다. 따뜻하지만 예민함에 주의해야 합니다.',
    '戊': '안정적인 가정을 추구합니다. 든든하지만 변화에 유연해질 필요가 있습니다.',
    '己': '가족을 위해 헌신합니다. 희생적이지만 자기 돌봄도 필요합니다.',
    '庚': '가족에게 원칙을 강조합니다. 정의롭지만 부드러움도 필요합니다.',
    '辛': '품격 있는 가정을 추구합니다. 섬세하지만 완벽주의에 주의해야 합니다.',
    '壬': '자유로운 가정 분위기를 원합니다. 개방적이지만 책임감도 중요합니다.',
    '癸': '가족의 감정에 민감합니다. 공감적이지만 현실적 역할도 필요합니다.',
  };
  return dynamics[dayMaster] || '가족과 조화롭게 지냅니다.';
}

function getMoneyPersonality(dayMaster: string): string {
  const personalities: Record<string, string> = {
    '甲': '큰 그림을 보는 투자자형. 장기적 안목으로 자산을 키웁니다.',
    '乙': '안전한 재테크형. 리스크를 피하고 꾸준히 모읍니다.',
    '丙': '적극적 투자자형. 트렌드를 읽고 과감하게 베팅합니다.',
    '丁': '분석적 투자자형. 꼼꼼한 분석 후 신중하게 투자합니다.',
    '戊': '부동산 선호형. 실물 자산과 안정적 투자를 좋아합니다.',
    '己': '저축 우선형. 아끼고 모으며 내실을 다집니다.',
    '庚': '고수익 추구형. 과감한 결정으로 큰 수익을 노립니다.',
    '辛': '가치 투자형. 품질과 가치가 있는 것에 투자합니다.',
    '壬': '다각화 투자형. 여러 분야에 분산 투자합니다.',
    '癸': '직관적 투자형. 느낌을 따라 투자하는 경향이 있습니다.',
  };
  return personalities[dayMaster] || '균형 잡힌 재테크를 합니다.';
}

function getIncomeStyle(dayMaster: string): string {
  const styles: Record<string, string> = {
    '甲': '사업이나 리더 역할에서 큰 수입을 올릴 수 있습니다.',
    '乙': '협력과 네트워킹을 통해 안정적 수입을 만듭니다.',
    '丙': '인기와 명성을 통해 수입을 창출합니다.',
    '丁': '전문성과 기술로 부가가치를 만듭니다.',
    '戊': '부동산이나 큰 자산 관리에서 수입을 얻습니다.',
    '己': '실용적인 사업이나 서비스업에서 수입을 올립니다.',
    '庚': '법률, 금융, 기술 분야에서 높은 수입을 얻습니다.',
    '辛': '예술, 디자인, 고급 서비스에서 수입을 창출합니다.',
    '壬': '무역, 유통, 글로벌 사업에서 수입을 올립니다.',
    '癸': '창작, 상담, 치유 분야에서 수입을 만듭니다.',
  };
  return styles[dayMaster] || '다양한 방식으로 수입을 얻습니다.';
}

function getInvestmentAdvice(dayMaster: string, balance: ElementBalance): string {
  const strongElement = Object.entries(balance).sort(([, a], [, b]) => b - a)[0][0];

  const advice: Record<string, string> = {
    '木': '성장주, 바이오, 환경 관련 투자가 유리합니다.',
    '火': 'IT, 미디어, 엔터테인먼트 분야 투자를 고려하세요.',
    '土': '부동산, 건설, 금융 분야가 안정적입니다.',
    '金': '제조업, 기술, 귀금속 관련 투자가 적합합니다.',
    '水': '무역, 물류, 창작 분야 투자를 고려하세요.',
  };

  return advice[strongElement] || '분산 투자로 리스크를 관리하세요.';
}

function getWealthPeakPeriod(cycles: LifeCycle[]): string {
  // 토(土)나 금(金) 대운 시기 찾기
  const wealthCycle = cycles.find(c => c.element.includes('土') || c.element.includes('金'));
  if (wealthCycle) {
    return `${wealthCycle.startAge}세 ~ ${wealthCycle.endAge}세 (${wealthCycle.theme})`;
  }
  return '꾸준한 노력으로 재물을 축적하는 유형입니다.';
}

function getFinancialRisks(dayMaster: string): string[] {
  const risks: Record<string, string[]> = {
    '甲': ['과도한 확장', '무리한 투자', '보증 문제'],
    '乙': ['결정 지연으로 인한 기회 손실', '타인 의존'],
    '丙': ['충동적 투자', '과시로 인한 지출'],
    '丁': ['과도한 분석으로 타이밍 놓침', '걱정으로 인한 소극적 투자'],
    '戊': ['유동성 부족', '변화에 늦은 대응'],
    '己': ['너무 보수적인 투자', '기회 놓침'],
    '庚': ['과격한 투자', '올인 경향'],
    '辛': ['완벽한 타이밍 기다리다 놓침', '높은 기준으로 인한 기회 상실'],
    '壬': ['분산 과다', '방향 없는 투자'],
    '癸': ['감정적 투자', '현실성 부족'],
  };
  return risks[dayMaster] || ['리스크 관리 필요'];
}

function getHealthVulnerabilities(weakElements: string[]): string[] {
  const vulnerabilities: Record<string, string[]> = {
    '木': ['간, 담낭 기능 약화', '눈 건강 주의', '근육, 관절 문제'],
    '火': ['심장, 혈액순환 문제', '눈 충혈', '정신적 스트레스'],
    '土': ['소화기 문제', '비장, 위장 약화', '살이 찌기 쉬움'],
    '金': ['폐, 호흡기 문제', '피부 질환', '대장 건강'],
    '水': ['신장, 방광 문제', '생식기 건강', '뼈, 관절 약화'],
  };

  const result: string[] = [];
  weakElements.forEach(el => {
    if (vulnerabilities[el]) {
      result.push(...vulnerabilities[el]);
    }
  });
  return result.slice(0, 4);
}

function getPreventiveMeasures(weakElements: string[]): string[] {
  const measures: Record<string, string[]> = {
    '木': ['녹색 채소 충분히 섭취', '눈 휴식 자주 취하기', '스트레칭 습관화'],
    '火': ['심호흡, 명상 실천', '과로 피하기', '차가운 음식 적절히'],
    '土': ['규칙적인 식사', '과식 피하기', '소화 촉진 음식 섭취'],
    '金': ['호흡 운동', '피부 보습', '환기 자주하기'],
    '水': ['충분한 수분 섭취', '허리 건강 관리', '보온에 신경쓰기'],
  };

  const result: string[] = [];
  weakElements.forEach(el => {
    if (measures[el]) {
      result.push(...measures[el]);
    }
  });
  return result.slice(0, 4);
}

function getIdealExercise(constitutionType: string): string {
  const exercises: Record<string, string> = {
    taeyang: '수영, 산책 등 가벼운 유산소 운동',
    soyang: '수영, 요가 등 열을 식히는 운동',
    taeeum: '등산, 달리기 등 땀을 많이 흘리는 운동',
    soeum: '실내 운동, 따뜻한 환경에서의 가벼운 운동',
  };
  return exercises[constitutionType] || '본인에게 맞는 적절한 운동';
}

function getDietRecommendations(constitutionType: string): string[] {
  const diets: Record<string, string[]> = {
    taeyang: ['메밀', '냉면', '해산물', '채소', '차가운 음식'],
    soyang: ['돼지고기', '오이', '수박', '참외', '보리'],
    taeeum: ['소고기', '무', '도라지', '콩나물', '율무'],
    soeum: ['닭고기', '양고기', '파', '마늘', '따뜻한 음식'],
  };
  return diets[constitutionType] || ['균형 잡힌 식단'];
}

function getMissionStatement(dayMaster: string): string {
  const missions: Record<string, string> = {
    '甲': '새로운 길을 개척하고 사람들을 이끌어 더 나은 세상을 만드는 것',
    '乙': '조화와 아름다움을 창조하며 사람들을 연결하는 것',
    '丙': '밝은 에너지로 세상을 비추고 영감을 주는 것',
    '丁': '깊은 지혜로 진리를 탐구하고 나누는 것',
    '戊': '안정적인 기반을 만들어 모두가 기대는 버팀목이 되는 것',
    '己': '실질적인 가치를 창출하고 사람들을 돌보는 것',
    '庚': '정의를 세우고 필요한 변화를 이끄는 것',
    '辛': '아름다움과 가치를 창조하고 품격을 높이는 것',
    '壬': '지혜를 나누고 모든 것을 포용하는 것',
    '癸': '직관과 영감으로 사람들의 마음을 치유하는 것',
  };
  return missions[dayMaster] || '자신만의 사명을 발견하는 여정 중입니다.';
}

function getCurrentPhaseAdvice(cycles: LifeCycle[], currentAge: number): string {
  const currentCycle = cycles.find(c => currentAge >= c.startAge && currentAge <= c.endAge);
  if (currentCycle) {
    return `현재 ${currentCycle.theme}의 시기입니다. ${currentCycle.advice}`;
  }
  return '꾸준히 자신의 길을 걸어가세요.';
}

function getFutureOutlook(yearlyFortunes: YearlyFortune[]): string {
  const avgScore = yearlyFortunes.reduce((sum, y) => sum + y.overall, 0) / yearlyFortunes.length;

  if (avgScore >= 80) {
    return '향후 5년간 전반적으로 좋은 흐름입니다. 적극적으로 기회를 잡으세요.';
  } else if (avgScore >= 70) {
    return '안정적인 흐름이 예상됩니다. 꾸준한 노력이 결실을 맺을 것입니다.';
  } else {
    return '도전적인 시기가 있을 수 있으나, 내면의 성장을 위한 기회입니다.';
  }
}

function getLuckyColors(luckyElements: string[]): string[] {
  const colors: Record<string, string[]> = {
    '木': ['초록색', '청록색'],
    '火': ['빨간색', '주황색', '분홍색'],
    '土': ['노란색', '베이지', '갈색'],
    '金': ['흰색', '은색', '금색'],
    '水': ['검은색', '파란색', '남색'],
  };

  const result: string[] = [];
  luckyElements.forEach(el => {
    if (colors[el]) result.push(...colors[el]);
  });
  return result.slice(0, 4);
}

function getLuckyNumbers(dayMaster: string): number[] {
  const stemIndex = ['甲', '乙', '丙', '丁', '戊', '己', '庚', '辛', '壬', '癸'].indexOf(dayMaster);
  const base = (stemIndex % 5) + 1;
  return [base, base + 5, base * 2];
}

function getLuckyDirections(luckyElements: string[]): string[] {
  const directions: Record<string, string> = {
    '木': '동쪽',
    '火': '남쪽',
    '土': '중앙',
    '金': '서쪽',
    '水': '북쪽',
  };
  return luckyElements.map(el => directions[el] || '중앙');
}

function getLuckyGemstones(luckyElements: string[]): string[] {
  const stones: Record<string, string[]> = {
    '木': ['에메랄드', '비취'],
    '火': ['루비', '가넷'],
    '土': ['황수정', '호안석'],
    '金': ['다이아몬드', '백수정'],
    '水': ['사파이어', '흑요석'],
  };

  const result: string[] = [];
  luckyElements.forEach(el => {
    if (stones[el]) result.push(...stones[el]);
  });
  return result.slice(0, 3);
}

function getLuckyPlants(luckyElements: string[]): string[] {
  const plants: Record<string, string[]> = {
    '木': ['대나무', '소나무', '느티나무'],
    '火': ['해바라기', '장미', '작약'],
    '土': ['국화', '매화', '선인장'],
    '金': ['난초', '백합', '치자'],
    '水': ['연꽃', '수련', '아이비'],
  };

  const result: string[] = [];
  luckyElements.forEach(el => {
    if (plants[el]) result.push(...plants[el]);
  });
  return result.slice(0, 3);
}
