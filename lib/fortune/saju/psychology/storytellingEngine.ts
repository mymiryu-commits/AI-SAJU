/**
 * 4막 구조 심리 스토리텔링 엔진
 *
 * 감정 곡선을 따라가는 몰입형 사주 해석
 * 신뢰 구축 → 공감/위로 → 전환/희망 → 여운
 */

import type { Element } from '@/types/saju';
import {
  getLifeStage,
  getLifecycleData,
  type LifeStage,
  type LifecycleData
} from './lifecycleStages';
import {
  getArchetypeByDayMaster,
  generateArchetypeStory,
  getDestinyPhrase,
  type ArchetypeInfo
} from './jungianArchetypes';

// 4막 구조 타입
export interface FourActStructure {
  act1_prologue: StoryAct;      // 프롤로그: 신뢰 구축
  act2_empathy: StoryAct;       // 공감과 위로
  act3_hope: StoryAct;          // 전환과 희망 (클라이맥스)
  act4_epilogue: StoryAct;      // 에필로그: 여운
  destinyLine: string;          // 운명 한 줄
  memorableQuote: string;       // 기억에 남는 명언
}

export interface StoryAct {
  title: string;
  content: string;
  emotionalTone: 'trust' | 'empathy' | 'insight' | 'hope' | 'warmth';
  pauseDuration: number;        // 나레이션 후 쉬는 시간 (ms)
}

// 과거 검증 데이터 (미러링)
export interface PastMirror {
  period: string;               // "2020년 하반기"
  ageAtTime: number;
  lifeEvent: string;            // 추정 사건
  emotionalState: string;       // 당시 감정
  validation: string;           // 검증/인정
}

// 스토리텔링 생성 옵션
export interface StorytellingOptions {
  userName: string;
  dayMaster: string;
  dayMasterKo: string;
  age: number;
  gender: 'male' | 'female';
  birthYear: number;
  yongsin: Element[];
  currentDaeunElement?: Element;
  targetYear: number;
}

// ========== 과거 검증 생성 (미러링 기법) ==========

/**
 * 대운과 나이를 기반으로 과거 사건 추론
 */
export function generatePastMirrors(
  birthYear: number,
  age: number,
  dayMaster: string
): PastMirror[] {
  const currentYear = new Date().getFullYear();
  const mirrors: PastMirror[] = [];

  // 주요 인생 전환점들
  const transitionAges = [18, 22, 25, 28, 30, 35, 40, 45, 50, 55, 60];

  // 지나온 전환점 찾기
  const passedTransitions = transitionAges.filter(a => a < age);
  const recentTransitions = passedTransitions.slice(-2); // 최근 2개

  recentTransitions.forEach(transitionAge => {
    const year = birthYear + transitionAge;

    // 전환점별 추정 사건
    const eventMap: Record<number, PastMirror> = {
      18: {
        period: `${year}년`,
        ageAtTime: 18,
        lifeEvent: '인생의 방향을 고민하셨을 거예요. 수능이나 진로 결정...',
        emotionalState: '불안과 기대가 공존했던 시기',
        validation: '그때 고민이 지금의 당신을 만들었습니다.'
      },
      22: {
        period: `${year}년`,
        ageAtTime: 22,
        lifeEvent: '졸업이나 사회 첫발을 내딛는 시기였죠.',
        emotionalState: '새로운 시작에 대한 두려움과 설렘',
        validation: '그 용기가 지금까지 이어지고 있어요.'
      },
      25: {
        period: `${year}년 즈음`,
        ageAtTime: 25,
        lifeEvent: '중요한 선택 앞에서 밤잠을 설치셨을 거예요.',
        emotionalState: '주변 시선과 자신의 목소리 사이에서 갈등',
        validation: '결국 자신의 직감을 따르셨죠. 그게 맞았습니다.'
      },
      28: {
        period: `${year}년`,
        ageAtTime: 28,
        lifeEvent: '삶의 방향이 흔들리는 느낌이 있으셨을 거예요.',
        emotionalState: '이대로 괜찮나 하는 불안',
        validation: '그 고민이 성장의 신호였어요.'
      },
      30: {
        period: `${year}년`,
        ageAtTime: 30,
        lifeEvent: '30대에 접어들며 많은 것이 바뀌셨죠.',
        emotionalState: '책임감과 압박감이 커지던 시기',
        validation: '버텨내셨습니다. 대단해요.'
      },
      35: {
        period: `${year}년`,
        ageAtTime: 35,
        lifeEvent: '일과 삶 사이에서 균형을 찾으려 하셨을 거예요.',
        emotionalState: '지침과 의무감 사이의 줄다리기',
        validation: '그 균형 잡기가 지금의 안정을 만들었습니다.'
      },
      40: {
        period: `${year}년`,
        ageAtTime: 40,
        lifeEvent: '인생의 반을 돌아보며 많은 생각을 하셨을 거예요.',
        emotionalState: '성찰과 새로운 방향에 대한 갈망',
        validation: '그 성찰이 후반전의 지혜가 됩니다.'
      },
      45: {
        period: `${year}년`,
        ageAtTime: 45,
        lifeEvent: '정체성에 대해 다시 생각하셨을 거예요.',
        emotionalState: '나는 누구인가에 대한 깊은 질문',
        validation: '그 질문이 진짜 당신을 찾게 합니다.'
      },
      50: {
        period: `${year}년`,
        ageAtTime: 50,
        lifeEvent: '인생의 의미에 대해 생각하셨을 거예요.',
        emotionalState: '후회와 감사가 교차하던 시기',
        validation: '모든 경험이 당신의 지혜가 되었습니다.'
      },
      55: {
        period: `${year}년`,
        ageAtTime: 55,
        lifeEvent: '새로운 시작을 고민하셨을 거예요.',
        emotionalState: '아직 할 수 있다는 희망과 두려움',
        validation: '그 희망이 맞습니다. 아직 시간이 있어요.'
      },
      60: {
        period: `${year}년`,
        ageAtTime: 60,
        lifeEvent: '삶을 정리하며 많은 것을 되돌아보셨을 거예요.',
        emotionalState: '평화와 아쉬움이 공존',
        validation: '잘 살아오셨습니다. 충분히.'
      }
    };

    if (eventMap[transitionAge]) {
      mirrors.push(eventMap[transitionAge]);
    }
  });

  return mirrors;
}

// ========== 4막 구조 스토리 생성 ==========

/**
 * 메인 스토리텔링 생성 함수
 */
export function generatePsychologicalStory(
  options: StorytellingOptions
): FourActStructure {
  const {
    userName,
    dayMaster,
    dayMasterKo,
    age,
    gender,
    birthYear,
    yongsin,
    currentDaeunElement,
    targetYear
  } = options;

  // 생애주기 데이터
  const lifecycleData = getLifecycleData(age);

  // 융 원형 데이터
  const archetype = getArchetypeByDayMaster(dayMasterKo);

  // 과거 미러링
  const pastMirrors = generatePastMirrors(birthYear, age, dayMasterKo);

  // 용신 한글 변환
  const yongsinKoMap: Record<Element, string> = {
    wood: '목', fire: '화', earth: '토', metal: '금', water: '수'
  };
  const yongsinKo = yongsin[0] ? yongsinKoMap[yongsin[0]] : '목';

  // ===== 1막: 프롤로그 (신뢰 구축) =====
  const act1 = generateAct1_Prologue(
    userName,
    dayMasterKo,
    archetype,
    pastMirrors,
    age
  );

  // ===== 2막: 공감과 위로 =====
  const act2 = generateAct2_Empathy(
    userName,
    dayMasterKo,
    archetype,
    lifecycleData,
    age,
    gender
  );

  // ===== 3막: 전환과 희망 (클라이맥스) =====
  const act3 = generateAct3_Hope(
    userName,
    dayMasterKo,
    archetype,
    lifecycleData,
    yongsinKo,
    currentDaeunElement,
    targetYear,
    age
  );

  // ===== 4막: 에필로그 =====
  const act4 = generateAct4_Epilogue(
    userName,
    dayMasterKo,
    archetype,
    lifecycleData
  );

  // 운명 한 줄
  const destinyLine = `"${archetype.destinyPhrase}" - ${userName}님의 운명`;

  // 기억에 남는 명언
  const memorableQuote = lifecycleData.wisdomQuotes.original;

  return {
    act1_prologue: act1,
    act2_empathy: act2,
    act3_hope: act3,
    act4_epilogue: act4,
    destinyLine,
    memorableQuote
  };
}

// ===== 개별 막 생성 함수들 =====

// 다양한 오프닝 패턴 (식상한 패턴 탈피, 부드러운 시작)
const OPENING_PATTERNS = {
  // 일간별 오프닝 (성격에 맞춘 접근)
  dayMaster: {
    '갑': [
      '${userName}님, 당신의 이야기를 들려드릴게요.',
      '${userName}님, 나무처럼 곧은 기운이 느껴집니다.',
      '${userName}님, 당신 안에 숲의 기운이 흐르고 있어요.'
    ],
    '을': [
      '${userName}님, 부드럽지만 강한 에너지가 느껴져요.',
      '${userName}님, 봄바람 같은 기운을 가지셨네요.',
      '${userName}님, 유연함 속에 담긴 당신의 이야기입니다.'
    ],
    '병': [
      '${userName}님, 밝은 빛 같은 기운이 보여요.',
      '${userName}님, 태양처럼 따뜻한 사람이시네요.',
      '${userName}님, 당신의 빛나는 이야기를 시작할게요.'
    ],
    '정': [
      '${userName}님, 은은하게 빛나는 분이시네요.',
      '${userName}님, 촛불처럼 따스한 기운이 느껴져요.',
      '${userName}님, 당신만의 온기가 전해집니다.'
    ],
    '무': [
      '${userName}님, 산처럼 든든한 기운이 있으시네요.',
      '${userName}님, 흔들리지 않는 중심이 보여요.',
      '${userName}님, 대지의 포용력을 가지셨어요.'
    ],
    '기': [
      '${userName}님, 따뜻하고 비옥한 기운이에요.',
      '${userName}님, 사람들을 품는 마음이 느껴져요.',
      '${userName}님, 정원 같은 편안함이 있으시네요.'
    ],
    '경': [
      '${userName}님, 단단하고 빛나는 기운이시네요.',
      '${userName}님, 의지가 강한 분이시네요.',
      '${userName}님, 날카로운 통찰력이 느껴집니다.'
    ],
    '신': [
      '${userName}님, 섬세하고 정교한 기운이에요.',
      '${userName}님, 보석처럼 빛나는 가능성이 보여요.',
      '${userName}님, 세심한 감성이 느껴집니다.'
    ],
    '임': [
      '${userName}님, 깊고 넓은 바다 같은 분이시네요.',
      '${userName}님, 지혜의 물결이 느껴집니다.',
      '${userName}님, 유연하게 흘러가는 힘이 있으시네요.'
    ],
    '계': [
      '${userName}님, 맑고 순수한 기운이 느껴져요.',
      '${userName}님, 이슬처럼 영롱한 에너지시네요.',
      '${userName}님, 섬세한 감성의 소유자시네요.'
    ]
  },
  // 연령대별 부드러운 접근
  ageGroup: {
    youth: [ // 20대
      '앞으로 펼쳐질 당신의 이야기가 궁금하시죠?',
      '지금 서 있는 길목에서 잠시 이야기 나눠볼까요?',
      '당신의 가능성에 대해 이야기해 드릴게요.'
    ],
    young_adult: [ // 30대
      '바쁜 하루 속에서 잠시 당신을 위한 시간이에요.',
      '지금 걸어온 길을 함께 돌아볼까요?',
      '당신이 궁금했던 이야기를 시작해 볼게요.'
    ],
    middle: [ // 40대
      '경험이 쌓인 지금, 새로운 시선으로 봐드릴게요.',
      '인생의 중심에 서 계신 당신의 이야기입니다.',
      '지혜가 깊어지는 시기, 함께 들여다볼까요?'
    ],
    mature: [ // 50대 이상
      '살아온 세월만큼 깊은 이야기가 있으시죠.',
      '풍요로운 경험 속에 담긴 당신을 읽어볼게요.',
      '지혜의 시간을 보내고 계신 당신의 이야기예요.'
    ]
  },
  // 계절/월별 감성적 터치
  seasonal: {
    spring: '봄기운이 감도는 요즘, 새로운 시작의 기운과 함께',
    summer: '무더운 여름, 당신의 열정만큼 뜨거운 이야기',
    autumn: '선선한 바람이 부는 계절, 차분하게 들여다보면',
    winter: '겨울의 고요함 속에서 당신을 읽어봅니다'
  }
};

// 이름에서 해시값 생성 (같은 이름은 같은 패턴)
function getNameHash(name: string): number {
  let hash = 0;
  for (let i = 0; i < name.length; i++) {
    const char = name.charCodeAt(i);
    hash = ((hash << 5) - hash) + char;
    hash = hash & hash;
  }
  return Math.abs(hash);
}

// 계절 가져오기
function getCurrentSeason(): 'spring' | 'summer' | 'autumn' | 'winter' {
  const month = new Date().getMonth() + 1;
  if (month >= 3 && month <= 5) return 'spring';
  if (month >= 6 && month <= 8) return 'summer';
  if (month >= 9 && month <= 11) return 'autumn';
  return 'winter';
}

// 연령대 그룹
function getAgeGroupKey(age: number): 'youth' | 'young_adult' | 'middle' | 'mature' {
  if (age < 30) return 'youth';
  if (age < 40) return 'young_adult';
  if (age < 50) return 'middle';
  return 'mature';
}

function generateAct1_Prologue(
  userName: string,
  dayMasterKo: string,
  archetype: ArchetypeInfo,
  pastMirrors: PastMirror[],
  age: number
): StoryAct {
  const nameHash = getNameHash(userName);
  const season = getCurrentSeason();
  const ageGroup = getAgeGroupKey(age);

  // 일간별 오프닝 선택 (이름 해시로 다양화)
  type DayMasterKey = keyof typeof OPENING_PATTERNS.dayMaster;
  const dayMasterKey = (dayMasterKo in OPENING_PATTERNS.dayMaster) ? dayMasterKo as DayMasterKey : '갑' as DayMasterKey;
  const dayMasterOpenings = OPENING_PATTERNS.dayMaster[dayMasterKey];
  const dayMasterOpening = dayMasterOpenings[nameHash % dayMasterOpenings.length].replace('${userName}', userName);

  // 연령대별 접근 선택
  const ageOpenings = OPENING_PATTERNS.ageGroup[ageGroup];
  const ageOpening = ageOpenings[(nameHash + age) % ageOpenings.length];

  // 계절 터치
  const seasonalTouch = OPENING_PATTERNS.seasonal[season];

  // 과거 미러링 (부드러운 질문으로 전환)
  let mirrorText = '';
  if (pastMirrors.length > 0) {
    const recentMirror = pastMirrors[pastMirrors.length - 1];
    // 압박하지 않는 방식으로 변경
    const softMirrors = [
      `${recentMirror.period}쯤, 중요한 결정을 하셨던 기억이 있으실 거예요.`,
      `지나온 시간 속에 ${recentMirror.emotionalState}의 순간들이 있었죠.`,
      `${recentMirror.period}, 무언가 바뀌기 시작한 시기였을 거예요.`
    ];
    mirrorText = softMirrors[nameHash % softMirrors.length];
  } else {
    // 20대 초반용 부드러운 접근
    const youngMirrors = age < 25
      ? [
          '지금은 길을 찾아가는 중이시죠.',
          '앞으로 어떤 사람이 될지 그리고 계실 거예요.',
          '무한한 가능성 앞에 서 계시네요.'
        ]
      : [
          '살아오면서 중요한 순간들이 있으셨죠.',
          '때로는 쉽지 않은 선택도 하셨을 거예요.',
          '지금까지 잘 걸어오셨어요.'
        ];
    mirrorText = youngMirrors[nameHash % youngMirrors.length];
  }

  // 원형 설명도 부드럽게
  const archetypeIntros = [
    `당신에게는 ${archetype.korean}의 기운이 흐르고 있어요.`,
    `${archetype.korean}의 에너지를 가지고 계시네요.`,
    `당신의 내면에 ${archetype.korean}의 영혼이 살고 있어요.`
  ];
  const archetypeIntro = archetypeIntros[nameHash % archetypeIntros.length];

  // 부드럽게 조합
  const content = `${dayMasterOpening} ` +
    `${ageOpening} ` +
    `${mirrorText} ` +
    `${archetypeIntro} ` +
    `${archetype.metaphor}처럼, ${archetype.coreDesire}`;

  return {
    title: '프롤로그: 당신을 읽습니다',
    content,
    emotionalTone: 'trust',
    pauseDuration: 2500
  };
}

function generateAct2_Empathy(
  userName: string,
  dayMasterKo: string,
  archetype: ArchetypeInfo,
  lifecycleData: LifecycleData,
  age: number,
  gender: 'male' | 'female'
): StoryAct {
  // 연령대별 현실적 고민 반영
  const concerns = lifecycleData.realLifeConcerns;
  const empathy = lifecycleData.empathyMessages;

  // 성별에 따른 미세 조정
  const genderContext = gender === 'female'
    ? '여성으로서 더 많은 것을 감당해야 했을 수도 있어요.'
    : '남자라서 더 티 내지 못한 힘듦이 있었을 거예요.';

  const content = `${empathy.opening} ` +
    `${concerns.hiddenFear}... 그런 생각이 드셨을 거예요. ` +
    `${empathy.validation} ` +
    `${genderContext} ` +
    `${archetype.korean}의 기운을 가진 당신이라면, ` +
    `${archetype.greatestFear}이 가장 두려웠을 거예요. ` +
    `하지만 알아두세요. ${empathy.understanding}`;

  return {
    title: '2막: 당신의 마음을 압니다',
    content,
    emotionalTone: 'empathy',
    pauseDuration: 3000
  };
}

function generateAct3_Hope(
  userName: string,
  dayMasterKo: string,
  archetype: ArchetypeInfo,
  lifecycleData: LifecycleData,
  yongsinKo: string,
  currentDaeunElement: Element | undefined,
  targetYear: number,
  age: number
): StoryAct {
  const insights = lifecycleData.insights;
  const hopes = lifecycleData.hopeMessages;

  // 대운에 따른 시기 해석
  const daeunContext = currentDaeunElement
    ? `지금 ${yongsinKo}의 기운이 흐르는 대운입니다. `
    : '';

  // 연령대별 희망 포인트
  const ageHopePoint = age < 30
    ? `${targetYear}년, 당신의 씨앗이 싹을 틔웁니다.`
    : age < 45
      ? `${targetYear}년, 지금까지 쌓아온 것들이 결실을 맺기 시작합니다.`
      : age < 60
        ? `${targetYear}년, 당신의 지혜가 빛나는 시기입니다.`
        : `${targetYear}년, 평화롭고 충만한 시간이 기다립니다.`;

  const content = `이제 중요한 이야기를 드릴게요. ` +
    `${daeunContext}` +
    `${insights.paradigmShift} ` +
    `${ageHopePoint} ` +
    `${hopes.shortTerm} ` +
    `${userName}님, ${archetype.closingLine}`;

  return {
    title: '3막: 희망의 빛',
    content,
    emotionalTone: 'hope',
    pauseDuration: 3000
  };
}

function generateAct4_Epilogue(
  userName: string,
  dayMasterKo: string,
  archetype: ArchetypeInfo,
  lifecycleData: LifecycleData
): StoryAct {
  const content = `마지막으로 한 가지만 기억해 주세요. ` +
    `${lifecycleData.wisdomQuotes.original} ` +
    `${userName}님의 운명 한 줄: "${archetype.destinyPhrase}" ` +
    `오늘도 응원합니다.`;

  return {
    title: '에필로그: 기억해 주세요',
    content,
    emotionalTone: 'warmth',
    pauseDuration: 2000
  };
}

// ========== 스토리를 텍스트로 변환 ==========

/**
 * 4막 구조를 하나의 텍스트로 변환 (PDF/MP3용)
 */
export function storyToText(story: FourActStructure): string {
  return [
    story.act1_prologue.content,
    story.act2_empathy.content,
    story.act3_hope.content,
    story.act4_epilogue.content
  ].join('\n\n');
}

/**
 * 나레이션 섹션 배열로 변환 (MP3용)
 */
export function storyToNarrationSections(story: FourActStructure): Array<{
  title: string;
  content: string;
  pauseAfter: number;
}> {
  return [
    {
      title: story.act1_prologue.title,
      content: story.act1_prologue.content,
      pauseAfter: story.act1_prologue.pauseDuration
    },
    {
      title: story.act2_empathy.title,
      content: story.act2_empathy.content,
      pauseAfter: story.act2_empathy.pauseDuration
    },
    {
      title: story.act3_hope.title,
      content: story.act3_hope.content,
      pauseAfter: story.act3_hope.pauseDuration
    },
    {
      title: story.act4_epilogue.title,
      content: story.act4_epilogue.content,
      pauseAfter: story.act4_epilogue.pauseDuration
    }
  ];
}

// ========== 연령대별 맞춤 조언 생성 ==========

/**
 * 연령대별 핵심 조언 한 문장
 */
export function getAgeSpecificAdvice(age: number): string {
  if (age < 25) {
    return '지금은 방향을 찾는 시간입니다. 조급해하지 마세요.';
  } else if (age < 30) {
    return '선택의 시간입니다. 완벽보다 시작이 중요합니다.';
  } else if (age < 35) {
    return '기반을 다지는 시간입니다. 천천히, 하지만 꾸준히.';
  } else if (age < 40) {
    return '균형의 시간입니다. 나도 챙기세요.';
  } else if (age < 45) {
    return '정리의 시간입니다. 버릴 건 버리세요.';
  } else if (age < 50) {
    return '재탄생의 시간입니다. 새로 시작해도 됩니다.';
  } else if (age < 55) {
    return '성찰의 시간입니다. 앞으로가 더 중요합니다.';
  } else if (age < 60) {
    return '수확의 시간입니다. 당신의 경험이 자산입니다.';
  } else if (age < 65) {
    return '받아들임의 시간입니다. 잘 살아오셨습니다.';
  } else {
    return '평화의 시간입니다. 이제 쉬셔도 됩니다.';
  }
}

/**
 * 연령대별 행동 제안
 */
export function getAgeSpecificActions(age: number): string[] {
  const lifecycleData = getLifecycleData(age);
  return [
    lifecycleData.insights.practicalAdvice,
    lifecycleData.hopeMessages.immediate,
    lifecycleData.insights.avoidance
  ];
}
