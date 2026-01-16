// 스토리텔링 내러티브 생성기
// 이야기를 들려주듯 몰입감 높은 분석을 제공

import type { UserInput, SajuChart, OhengBalance } from '@/types/saju';
import type { StorytellingAnalysis, YearlyTimeline, TimelinePeriod, CardDeck } from '@/types/cards';
import { generateCardDeck } from './cardGenerator';
import { generatePastVerifications } from './pastVerification';

// 한 줄 운명 생성
const DESTINY_LINES: Record<string, string[]> = {
  '갑': [
    '숲의 왕처럼 우뚝 서서, 세상을 이끄는 별',
    '곧은 나무처럼, 흔들려도 꺾이지 않는 운명',
    '개척자의 길을 걷는, 앞서가는 영혼'
  ],
  '을': [
    '바람에 춤추듯, 유연하게 피어나는 꽃',
    '물처럼 스며들어, 어디서든 뿌리내리는 생명력',
    '부드러움이 강함을 이기는, 대기만성의 별'
  ],
  '병': [
    '태양처럼 빛나며, 세상을 밝히는 존재',
    '한낮의 햇살처럼, 숨길 수 없는 눈부심',
    '열정으로 세상을 녹이는, 불꽃 같은 영혼'
  ],
  '정': [
    '촛불처럼 조용히, 그러나 분명하게 빛나는 별',
    '어둠을 밝히는 작은 불씨, 세상을 따뜻하게',
    '스며드는 온기로 마음을 녹이는 운명'
  ],
  '무': [
    '산처럼 묵직하게, 모든 것을 품는 대지',
    '흔들리지 않는 중심, 세상의 기둥이 되는 별',
    '너그러운 품으로 세상을 안는 운명'
  ],
  '기': [
    '들판의 흙처럼, 모든 씨앗을 키우는 어머니',
    '소박하지만 깊은, 감성의 보물창고',
    '작은 것에서 행복을 찾는, 따뜻한 영혼'
  ],
  '경': [
    '단단하지만 날카롭게, 원칙을 지키며 빛나는 칼날',
    '서리 맞은 국화처럼, 절개를 지키는 별',
    '결단으로 길을 여는, 강철 같은 의지'
  ],
  '신': [
    '다듬어진 보석처럼, 섬세하게 빛나는 존재',
    '눈 속의 매화처럼, 고고하게 피어나는 별',
    '순수함으로 세상을 감동시키는 운명'
  ],
  '임': [
    '바다처럼 깊고 넓게, 모든 것을 담는 그릇',
    '흐르는 물처럼, 막힘없이 길을 찾는 별',
    '지혜의 바다에서 진주를 건지는 운명'
  ],
  '계': [
    '이슬처럼 맑고 섬세하게, 세상에 스며드는 존재',
    '감성의 촉수로 보이지 않는 것을 보는 별',
    '직관으로 진실을 꿰뚫는, 물방울 같은 영혼'
  ]
};

// 한 줄 운명 생성 함수
export function generateDestinyLine(dayMaster: string): string {
  const lines = DESTINY_LINES[dayMaster] || DESTINY_LINES['갑'];
  return lines[Math.floor(Math.random() * lines.length)];
}

// 연간 타임라인 생성
export function generateYearlyTimeline(
  user: UserInput,
  saju: SajuChart,
  oheng: OhengBalance,
  yongsin: string[],
  targetYear: number
): YearlyTimeline {
  const dayMaster = saju.day.stemKorean;
  const dayElement = saju.day.element;

  // 월별 에너지 매핑
  const monthlyEnergy: Record<number, { element: string; phase: TimelinePeriod['phase'] }> = {
    1: { element: '수', phase: 'preparation' },
    2: { element: '수', phase: 'preparation' },
    3: { element: '목', phase: 'rising' },
    4: { element: '목', phase: 'rising' },
    5: { element: '화', phase: 'adjustment' },
    6: { element: '화', phase: 'adjustment' },
    7: { element: '토', phase: 'dormant' },
    8: { element: '토', phase: 'dormant' },
    9: { element: '금', phase: 'harvest' },
    10: { element: '금', phase: 'harvest' },
    11: { element: '수', phase: 'closing' },
    12: { element: '수', phase: 'closing' }
  };

  // 용신과 기신에 따른 점수 조정
  const calculateMonthScore = (month: number): number => {
    const { element } = monthlyEnergy[month];
    let score = 50; // 기본 점수

    // 용신 월이면 +30
    if (yongsin.includes(element)) {
      score += 30;
    }

    // 일간 오행과 상생이면 +15
    const generatingRelation: Record<string, string> = {
      '목': '화', '화': '토', '토': '금', '금': '수', '수': '목'
    };
    if (generatingRelation[dayElement] === element || generatingRelation[element] === dayElement) {
      score += 15;
    }

    // 계절 보너스
    const seasonBonus: Record<number, number> = {
      3: 10, 4: 15, 9: 15, 10: 10 // 봄과 가을에 보너스
    };
    score += seasonBonus[month] || 0;

    return Math.min(100, Math.max(20, score));
  };

  // 기간별 타임라인 생성
  const periods: TimelinePeriod[] = [
    {
      months: '1-2월',
      phase: 'preparation',
      phaseKorean: '준비기',
      score: Math.round((calculateMonthScore(1) + calculateMonthScore(2)) / 2),
      description: '새 시작보다 정리·계획 시기',
      actions: ['지난해 마무리', '올해 계획 수립', '체력 관리'],
      highlight: false
    },
    {
      months: '3-4월',
      phase: 'rising',
      phaseKorean: '상승기',
      score: Math.round((calculateMonthScore(3) + calculateMonthScore(4)) / 2),
      description: '결정·시작하기 좋은 타이밍',
      actions: ['새로운 시작', '중요한 결정', '적극적 행동'],
      highlight: true
    },
    {
      months: '5-6월',
      phase: 'adjustment',
      phaseKorean: '조정기',
      score: Math.round((calculateMonthScore(5) + calculateMonthScore(6)) / 2),
      description: '속도 조절, 점검 필요',
      actions: ['진행 상황 점검', '방향 수정', '재충전'],
      highlight: false
    },
    {
      months: '7-8월',
      phase: 'dormant',
      phaseKorean: '잠복기',
      score: Math.round((calculateMonthScore(7) + calculateMonthScore(8)) / 2),
      description: '무리한 확장 자제',
      actions: ['내실 다지기', '관계 정리', '휴식'],
      highlight: false
    },
    {
      months: '9-10월',
      phase: 'harvest',
      phaseKorean: '수확기',
      score: Math.round((calculateMonthScore(9) + calculateMonthScore(10)) / 2),
      description: '상반기 노력의 결과 가시화',
      actions: ['성과 확인', '보상 수확', '감사 표현'],
      highlight: true
    },
    {
      months: '11-12월',
      phase: 'closing',
      phaseKorean: '마무리',
      score: Math.round((calculateMonthScore(11) + calculateMonthScore(12)) / 2),
      description: '다음 해 준비',
      actions: ['정리 정돈', '내년 계획', '관계 점검'],
      highlight: false
    }
  ];

  // 핵심 메시지 생성
  const highlightMonths = periods.filter(p => p.highlight).map(p => p.months).join('과 ');
  const keyMessage = `${highlightMonths}에 시작한 것이 열매를 맺습니다. 상반기의 행동이 하반기를 결정하는 해입니다.`;

  // 스토리 생성
  const story = generateTimelineStory(dayMaster, periods, targetYear);

  return {
    year: targetYear,
    periods,
    keyMessage,
    story
  };
}

// 타임라인 스토리 생성
function generateTimelineStory(
  dayMaster: string,
  periods: TimelinePeriod[],
  year: number
): string {
  const risingPeriod = periods.find(p => p.phase === 'rising');
  const harvestPeriod = periods.find(p => p.phase === 'harvest');

  return `${year}년, 당신에게 해가 떠오르는 한 해입니다. ` +
    `${risingPeriod?.months || '봄'}에 뿌린 씨앗이 ${harvestPeriod?.months || '가을'}에 열매를 맺습니다. ` +
    `조급해하지 마세요. 계절은 반드시 돌아오고, 당신이 심은 것은 반드시 자랍니다. ` +
    `다만, 씨앗을 심지 않으면 거둘 것도 없습니다. 지금이 바로 그 때입니다.`;
}

// 4막 구조 전체 스토리 생성
export function generateFullStory(
  user: UserInput,
  saju: SajuChart,
  cardDeck: CardDeck,
  timeline: YearlyTimeline
): StorytellingAnalysis['fullStory'] {
  const dayMaster = saju.day.stemKorean;
  const flower = cardDeck.essence.flowerKorean;
  const animal = cardDeck.energy.animalKorean;

  // 1막: 과거 (신뢰 형성)
  const opening = `당신의 사주를 펼쳐보았습니다. ` +
    `${flower}의 본질을 가진 당신, 지금까지 참 많은 길을 걸어오셨네요. ` +
    `때로는 힘들었고, 때로는 빛났던 그 시간들... 사주는 모두 알고 있었습니다. ` +
    `당신이 어떤 선택을 할 때 흔들렸는지, 어떤 순간에 가장 빛났는지. ` +
    `과거가 맞았다면, 미래도 믿어주세요.`;

  // 2막: 현재 (공감)
  const development = `지금 당신은 어떤 고민을 안고 계신가요? ` +
    `${animal}의 기운이 필요한 시기입니다. ${cardDeck.energy.story} ` +
    `모든 것이 막혀있는 것 같아도, 실은 물밑에서 많은 것이 움직이고 있습니다. ` +
    `당신이 느끼는 답답함은 '정체'가 아니라 '전환'의 신호입니다.`;

  // 3막: 미래 (가치)
  const climax = timeline.story + ` ` +
    `당신의 ${cardDeck.talent.treeKorean} 재능이 빛을 발할 때가 왔습니다. ` +
    `${cardDeck.talent.story} ` +
    `행운의 숫자 ${cardDeck.fortune.luckyNumbers.join(', ')}을 기억하세요. ` +
    `${cardDeck.fortune.luckyMonths.map(m => m + '월').join(', ')}에 중요한 기회가 옵니다.`;

  // 4막: 행동 (CTA)
  const resolution = `이제 무엇을 해야 할지 아시겠죠? ` +
    `${cardDeck.guardian.mainGemKorean}와 ${cardDeck.guardian.subGemKorean}가 당신을 지켜줄 것입니다. ` +
    `${cardDeck.guardian.story} ` +
    `당신의 운명 카드를 간직하세요. 힘들 때마다 꺼내보세요. ` +
    `당신은 이미 답을 알고 있습니다. 이제 실행할 시간입니다.`;

  return {
    opening,
    development,
    climax,
    resolution
  };
}

// 스토리텔링 분석 전체 생성 (메인 함수)
export function generateStorytellingAnalysis(
  user: UserInput,
  saju: SajuChart,
  oheng: OhengBalance,
  yongsin: string[],
  gisin: string[],
  dominantSipsin: string,
  targetYear: number = new Date().getFullYear()
): StorytellingAnalysis {
  // 1. 과거 검증 생성
  const pastVerifications = generatePastVerifications(user, saju, yongsin, gisin);

  // 2. 카드 덱 생성
  const cardDeck = generateCardDeck(
    user,
    saju,
    oheng,
    yongsin,
    dominantSipsin,
    targetYear
  );

  // 3. 연간 타임라인 생성
  const yearlyTimeline = generateYearlyTimeline(
    user,
    saju,
    oheng,
    yongsin,
    targetYear
  );

  // 4. 한 줄 운명 생성
  const dayMaster = saju.day.stemKorean;
  const destinyLine = generateDestinyLine(dayMaster);

  // 5. 전체 스토리 생성
  const fullStory = generateFullStory(user, saju, cardDeck, yearlyTimeline);

  return {
    pastVerifications,
    cardDeck,
    yearlyTimeline,
    destinyLine,
    fullStory
  };
}

// 사주 화법으로 변환 (기존 분석 텍스트를 스토리텔링으로)
export function convertToSajuNarrative(text: string, dayMaster: string): string {
  // "~입니다" → "~하고, ~하고" 리듬 변환
  const patterns = [
    { from: /입니다\./g, to: '이에요.' },
    { from: /합니다\./g, to: '해요.' },
    { from: /있습니다\./g, to: '있어요.' },
    { from: /됩니다\./g, to: '돼요.' },
    { from: /습니다\./g, to: '어요.' }
  ];

  let converted = text;
  for (const { from, to } of patterns) {
    converted = converted.replace(from, to);
  }

  return converted;
}

// 감정적 훅 생성
export function generateEmotionalHook(concern: string): string {
  const hooks: Record<string, string> = {
    career: '"이 일이 정말 나한테 맞는 걸까..." 한 번쯤 생각해보셨죠?',
    money: '"왜 열심히 해도 돈이 안 모이지..." 답답하셨을 거예요.',
    romance: '"이 사람이 맞는 건지..." 밤에 고민 많으셨죠.',
    family: '"가족 때문에 힘든 건 나만 그런 걸까..." 외로우셨을 거예요.',
    health: '"예전 같지 않은 몸이 걱정되시죠..." 느끼고 계실 거예요.',
    direction: '"뭘 해야 할지 모르겠고..." 막막하셨을 거예요.',
    relationship: '"사람 때문에 지치셨죠..." 에너지가 빠지는 느낌이었을 거예요.',
    none: '"특별한 고민은 없지만..." 뭔가 허전하셨을 수 있어요.'
  };

  return hooks[concern] || hooks['none'];
}

// 긍정적 리프레이밍
export function generatePositiveReframe(concern: string): string {
  const reframes: Record<string, string> = {
    career: '지금의 고민은 "성장통"이에요. 당신이 더 큰 사람이 되려고 몸부림치는 증거예요.',
    money: '돈이 안 모이는 건 "능력"이 아니라 "타이밍"의 문제예요. 흐름이 바뀔 때가 왔어요.',
    romance: '헷갈리는 건 당연해요. 그만큼 진지하게 생각하고 계신 거니까요.',
    family: '가족 갈등은 "성격"이 아니라 "에너지 충돌"이에요. 이해하면 풀려요.',
    health: '몸의 신호는 "경고"가 아니라 "안내"예요. 지금 관리하면 괜찮아요.',
    direction: '방향이 없는 게 아니에요. "전환점"에 서 있는 거예요.',
    relationship: '지치는 건 당신이 약해서가 아니에요. 에너지를 빼는 관계가 있는 거예요.',
    none: '안정적인 지금이 영원할 것 같지만, 변화는 예고 없이 와요. 준비가 필요해요.'
  };

  return reframes[concern] || reframes['none'];
}
