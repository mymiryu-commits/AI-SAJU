/**
 * 사주 분석 결과 음성 나레이션 생성기
 *
 * TTS(Text-to-Speech) 서비스를 사용하여 음성 파일 생성
 * 스토리텔링 기반의 감성적인 나레이션 지원
 * 지원 서비스: Google Cloud TTS, Naver Clova, OpenAI TTS
 */

import type {
  UserInput,
  SajuChart,
  OhengBalance,
  PremiumContent,
  MonthlyAction,
  Element
} from '@/types/saju';
import { ELEMENT_KOREAN, CAREER_KOREAN } from '@/types/saju';

// TTS 제공자 타입
export type TTSProvider = 'google' | 'naver' | 'openai';

interface TTSConfig {
  provider: TTSProvider;
  apiKey?: string;
  voiceId?: string;
  speed?: number;
  pitch?: number;
}

interface AudioGeneratorOptions {
  user: UserInput;
  saju: SajuChart;
  oheng: OhengBalance;
  yongsin?: Element[];
  gisin?: Element[];
  premium?: PremiumContent;
  targetYear?: number;
  config?: TTSConfig;
}

interface NarrationScript {
  sections: NarrationSection[];
  totalDuration: number; // 예상 시간 (초)
}

interface NarrationSection {
  title: string;
  content: string;
  pauseAfter: number; // ms
}

// ========== 시간 형식 자연스러운 한국어 변환 ==========

/**
 * 시간을 자연스러운 한국어로 변환
 * "13:52:00" → "오후 한시 오십이분"
 * "09:30" → "오전 아홉시 삼십분"
 */
function formatTimeToNaturalKorean(timeStr?: string): string {
  if (!timeStr) return '미상';

  // HH:MM:SS 또는 HH:MM 형식 파싱
  const parts = timeStr.split(':');
  if (parts.length < 2) return timeStr;

  let hour = parseInt(parts[0], 10);
  const minute = parseInt(parts[1], 10);

  if (isNaN(hour) || isNaN(minute)) return timeStr;

  // 오전/오후 구분
  const isAM = hour < 12;
  const period = isAM ? '오전' : '오후';

  // 12시간제로 변환
  if (hour === 0) hour = 12;
  else if (hour > 12) hour -= 12;

  // 숫자를 한글로 변환
  const hourKorean = numberToKorean(hour);
  const minuteKorean = minute > 0 ? numberToKorean(minute) + '분' : '정각';

  return `${period} ${hourKorean}시 ${minuteKorean}`;
}

/**
 * 숫자를 한글로 변환 (1~59)
 */
function numberToKorean(num: number): string {
  const units = ['', '일', '이', '삼', '사', '오', '육', '칠', '팔', '구'];
  const tens = ['', '십', '이십', '삼십', '사십', '오십'];

  if (num === 0) return '영';
  if (num < 10) return units[num];
  if (num === 10) return '십';
  if (num < 20) return '십' + units[num - 10];

  const tenDigit = Math.floor(num / 10);
  const unitDigit = num % 10;

  return tens[tenDigit] + (unitDigit > 0 ? units[unitDigit] : '');
}

// ========== 카드 기반 스토리텔링 데이터 ==========

// 일간별 본질 카드 (꽃)
const ESSENCE_CARD_STORIES: Record<string, { flower: string; story: string }> = {
  '갑': { flower: '소나무', story: '우뚝 솟은 소나무처럼, 당신은 어떤 풍파에도 꺾이지 않는 곧은 심지를 가졌습니다. 앞장서서 길을 내고, 뒤따르는 이들에게 그늘이 되어주는 사람. 그것이 당신의 타고난 본질입니다.' },
  '을': { flower: '난초', story: '바람에 흔들리는 난초처럼, 당신은 강인함보다 유연함으로 세상을 헤쳐나갑니다. 어떤 환경에서도 자신만의 향기를 잃지 않고, 우아하게 피어나는 사람입니다.' },
  '병': { flower: '해바라기', story: '태양을 향해 고개 드는 해바라기처럼, 당신은 어디서든 빛나는 존재입니다. 사람들의 중심에 서서 따뜻한 에너지를 나누고, 주변을 환하게 밝히는 사람입니다.' },
  '정': { flower: '동백', story: '어둠 속에서도 피어나는 동백처럼, 당신은 조용히 그러나 분명하게 빛납니다. 겉으로 드러나지 않아도 깊은 열정을 품고, 사랑하는 이들을 위해 묵묵히 헌신하는 따뜻한 사람입니다.' },
  '무': { flower: '모란', story: '만개한 모란처럼, 당신은 너그럽고 든든한 존재입니다. 산처럼 묵직하게 자리를 지키며, 모든 것을 품어주는 넉넉함이 있습니다.' },
  '기': { flower: '국화', story: '서리가 내려도 꺾이지 않는 국화처럼, 당신은 어떤 상황에서도 원칙을 지키고, 한번 정한 건 끝까지 가는 사람입니다.' },
  '경': { flower: '백합', story: '고결한 백합처럼, 당신은 정의롭고 깨끗한 마음을 가졌습니다. 옳고 그름을 명확히 구분하고, 타협하지 않는 단단함이 있습니다.' },
  '신': { flower: '매화', story: '추운 겨울에도 피어나는 매화처럼, 당신은 역경 속에서 더 강해지는 사람입니다. 섬세하면서도 날카로운 통찰력으로 세상을 바라봅니다.' },
  '임': { flower: '연꽃', story: '진흙 속에서도 맑게 피어나는 연꽃처럼, 당신은 깊은 지혜와 포용력을 가졌습니다. 유유히 흐르는 큰 강처럼 어떤 상황도 담담히 받아들이는 힘이 있습니다.' },
  '계': { flower: '물망초', story: '작지만 강인한 물망초처럼, 당신은 섬세하고 감수성이 풍부합니다. 남들이 보지 못하는 것을 느끼고, 조용히 세상을 변화시키는 힘을 가졌습니다.' }
};

// 용신별 에너지 카드 (동물)
const ENERGY_CARD_STORIES: Record<string, { animal: string; story: string }> = {
  'wood': { animal: '사슴', story: '당신에게 필요한 건 사슴의 기운입니다. 새벽 숲을 뛰어다니는 사슴처럼 새로운 시작, 첫 발을 내딛는 용기가 당신의 운을 열어줍니다.' },
  'fire': { animal: '봉황', story: '당신에게 필요한 건 봉황의 기운입니다. 불꽃처럼 타오르는 열정과 변화를 두려워하지 않는 용기가 당신의 운을 높여줍니다.' },
  'earth': { animal: '황소', story: '당신에게 필요한 건 황소의 기운입니다. 묵묵히 땅을 일구는 황소처럼 꾸준함과 인내가 당신에게 풍요를 가져다줍니다.' },
  'metal': { animal: '백호', story: '당신에게 필요한 건 백호의 기운입니다. 날카롭고 결단력 있는 백호처럼 과감한 선택과 집중이 당신을 성공으로 이끕니다.' },
  'water': { animal: '거북이', story: '당신에게 필요한 건 거북이의 기운입니다. 깊은 바다를 유영하는 거북이처럼 지혜롭게 기다리고 때를 아는 것이 당신의 힘이 됩니다.' }
};

// 재능 카드 (십신별)
const TALENT_CARD_STORIES: Record<string, { tree: string; story: string }> = {
  '비견': { tree: '대나무', story: '당신 안에는 대나무처럼 곧게 뻗어가는 독립심이 있습니다. 남에게 기대지 않고 스스로 일어서는 힘, 그것이 당신의 재능입니다.' },
  '겁재': { tree: '덩굴나무', story: '당신 안에는 덩굴처럼 뻗어가는 확장의 에너지가 있습니다. 새로운 영역을 개척하고 도전하는 것, 그것이 당신의 재능입니다.' },
  '식신': { tree: '과일나무', story: '당신 안에는 열매 맺는 과일나무가 있습니다. 표현하고, 만들고, 나누는 것. 그것이 당신의 타고난 재능입니다.' },
  '상관': { tree: '버드나무', story: '당신 안에는 유연하게 흔들리는 버드나무가 있습니다. 틀을 깨고 새롭게 창조하는 것, 그것이 당신의 재능입니다.' },
  '편재': { tree: '밤나무', story: '당신 안에는 풍성한 열매의 밤나무가 있습니다. 기회를 포착하고 재물을 모으는 것, 그것이 당신의 재능입니다.' },
  '정재': { tree: '은행나무', story: '당신 안에는 오래 사는 은행나무가 있습니다. 착실하게 쌓아가고 지키는 것, 그것이 당신의 재능입니다.' },
  '편관': { tree: '참나무', story: '당신 안에는 강인한 참나무가 있습니다. 리더십과 추진력으로 세상을 이끄는 것, 그것이 당신의 재능입니다.' },
  '정관': { tree: '향나무', story: '당신 안에는 향기로운 향나무가 있습니다. 질서를 세우고 사람들을 바른 길로 인도하는 것, 그것이 당신의 재능입니다.' },
  '편인': { tree: '소나무', story: '당신 안에는 지혜로운 소나무가 있습니다. 깊이 사고하고 통찰하는 것, 그것이 당신의 재능입니다.' },
  '정인': { tree: '느티나무', story: '당신 안에는 포근한 느티나무가 있습니다. 배우고 가르치며 지식을 나누는 것, 그것이 당신의 재능입니다.' }
};

/**
 * 스토리텔링 기반 나레이션 스크립트 생성
 */
export function generateNarrationScript(options: AudioGeneratorOptions): NarrationScript {
  const { user, saju, oheng, yongsin, gisin, premium, targetYear = 2026 } = options;
  const sections: NarrationSection[] = [];

  // 일간 추출
  const dayMaster = saju.day?.stemKorean || '갑';
  const primaryYongsin = yongsin?.[0] || 'wood';

  // ========== 오프닝 ==========
  const birthTimeKorean = formatTimeToNaturalKorean(user.birthTime);
  sections.push({
    title: '오프닝',
    content: `안녕하세요, ${user.name}님. ` +
             `지금부터 당신만의 인생 이야기를 들려드릴게요. ` +
             `편안하게 귀 기울여 주세요.`,
    pauseAfter: 2000
  });

  // ========== 프로필 소개 ==========
  sections.push({
    title: '프로필',
    content: `${user.name}님은 ${user.birthDate.replace(/-/g, '년 ').replace(/년 (\d+)$/, '월 $1일')}에 ` +
             `${birthTimeKorean}에 태어나셨어요. ` +
             `${saju.year?.zodiac || ''}띠로, 특별한 운명을 가지고 이 세상에 오셨습니다.`,
    pauseAfter: 1500
  });

  // ========== 본질 카드 (꽃) ==========
  const essenceCard = ESSENCE_CARD_STORIES[dayMaster] || ESSENCE_CARD_STORIES['갑'];
  sections.push({
    title: '본질 카드',
    content: `첫 번째, 당신의 본질 카드입니다. ` +
             `당신의 꽃은 "${essenceCard.flower}"입니다. ` +
             `${essenceCard.story}`,
    pauseAfter: 2000
  });

  // ========== 에너지 카드 (동물) ==========
  const energyCard = ENERGY_CARD_STORIES[primaryYongsin] || ENERGY_CARD_STORIES['wood'];
  sections.push({
    title: '에너지 카드',
    content: `두 번째, 당신의 에너지 카드입니다. ` +
             `당신에게 힘이 되는 동물은 "${energyCard.animal}"입니다. ` +
             `${energyCard.story}`,
    pauseAfter: 2000
  });

  // ========== 오행 분석 (스토리텔링 방식) ==========
  const ohengStory = generateOhengStory(oheng, yongsin, gisin);
  sections.push({
    title: '오행 이야기',
    content: ohengStory,
    pauseAfter: 2000
  });

  // ========== 프리미엄 콘텐츠 ==========
  if (premium) {
    // 인생 타임라인
    if (premium.lifeTimeline) {
      const timelineStory = generateTimelineStory(premium.lifeTimeline, user.name, targetYear);
      sections.push({
        title: '인생 타임라인',
        content: timelineStory,
        pauseAfter: 2000
      });
    }

    // 월별 운세 하이라이트
    if (premium.monthlyActionPlan?.length) {
      const monthlyStory = generateMonthlyStory(premium.monthlyActionPlan, targetYear);
      sections.push({
        title: '월별 운세',
        content: monthlyStory,
        pauseAfter: 2000
      });
    }

    // 황금 기회의 시기
    if (premium.lifeTimeline?.goldenWindows?.length) {
      const goldenStory = generateGoldenWindowStory(premium.lifeTimeline.goldenWindows);
      sections.push({
        title: '황금 기회',
        content: goldenStory,
        pauseAfter: 2000
      });
    }
  }

  // ========== 행운 카드 ==========
  const luckyNumbers = getLuckyNumbers(primaryYongsin);
  const luckyDirection = getLuckyDirection(primaryYongsin);
  sections.push({
    title: '행운 카드',
    content: `마지막으로, 당신의 행운 카드입니다. ` +
             `숫자 ${luckyNumbers.join('과 ')}이 당신의 열쇠입니다. ` +
             `${getLuckyMonths(primaryYongsin)}에 중요한 기회가 오고, ` +
             `${luckyDirection} 방향에서 좋은 인연이 찾아옵니다.`,
    pauseAfter: 2000
  });

  // ========== 클로징 ==========
  sections.push({
    title: '마무리',
    content: `이상으로 ${user.name}님의 운명 이야기를 마칩니다. ` +
             `운명은 정해진 길이 아니라, 당신이 만들어가는 이야기입니다. ` +
             `오늘 들은 이야기가 당신의 인생에 작은 등불이 되기를 바랍니다. ` +
             `${user.name}님의 앞날에 행운이 함께하기를 진심으로 기원합니다.`,
    pauseAfter: 0
  });

  // 예상 시간 계산 (한글 약 4~5글자/초)
  const totalChars = sections.reduce((sum, s) => sum + s.content.length, 0);
  const totalDuration = Math.ceil(totalChars / 4.5);

  return { sections, totalDuration };
}

/**
 * 오행 분석을 스토리텔링 방식으로 변환
 */
function generateOhengStory(
  oheng: OhengBalance,
  yongsin?: Element[],
  gisin?: Element[]
): string {
  const parts: string[] = [];

  // 가장 강한 오행과 약한 오행 찾기
  const elements = [
    { name: '목', nameKr: '나무', value: oheng.wood || 0 },
    { name: '화', nameKr: '불', value: oheng.fire || 0 },
    { name: '토', nameKr: '흙', value: oheng.earth || 0 },
    { name: '금', nameKr: '쇠', value: oheng.metal || 0 },
    { name: '수', nameKr: '물', value: oheng.water || 0 }
  ].sort((a, b) => b.value - a.value);

  const strongest = elements[0];
  const weakest = elements[4];

  parts.push(`세 번째, 당신의 기운 이야기입니다.`);
  parts.push(`당신 안에는 ${strongest.nameKr}의 기운이 가장 강하게 흐르고 있어요.`);

  // 강한 오행에 대한 의미 부여
  const strongMeaning = getElementMeaning(strongest.name, 'strong');
  parts.push(strongMeaning);

  // 약한 오행에 대한 조언
  if (weakest.value < 15) {
    const weakMeaning = getElementMeaning(weakest.name, 'weak');
    parts.push(weakMeaning);
  }

  // 용신 스토리텔링
  if (yongsin?.length) {
    const yongsinKo = yongsin.map(e => ELEMENT_KOREAN[e]).join(', ');
    parts.push(`그리고 ${yongsinKo}의 기운이 당신에게 행운을 가져다줍니다.`);
    parts.push(getYongsinAdvice(yongsin[0]));
  }

  return parts.join(' ');
}

/**
 * 오행별 의미 해석
 */
function getElementMeaning(element: string, type: 'strong' | 'weak'): string {
  const meanings: Record<string, { strong: string; weak: string }> = {
    '목': {
      strong: '성장하고 발전하려는 에너지가 넘치는 당신은, 새로운 것을 시작하고 도전하는 데 뛰어난 능력이 있습니다.',
      weak: '때로는 조급함을 내려놓고, 충분히 준비한 후에 시작하는 것이 좋습니다.'
    },
    '화': {
      strong: '열정과 표현력이 뛰어난 당신은, 사람들의 마음을 움직이고 분위기를 밝게 만드는 힘이 있습니다.',
      weak: '차분하게 생각하고 감정을 조절하는 연습이 도움이 됩니다.'
    },
    '토': {
      strong: '안정감과 신뢰를 주는 당신은, 사람들이 의지하고 싶어하는 든든한 존재입니다.',
      weak: '변화를 두려워하지 말고, 가끔은 새로운 시도도 필요합니다.'
    },
    '금': {
      strong: '결단력과 판단력이 뛰어난 당신은, 복잡한 상황에서도 명확한 선택을 할 수 있는 힘이 있습니다.',
      weak: '너무 엄격하지 않게, 유연함을 갖추면 더 좋은 결과를 얻을 수 있습니다.'
    },
    '수': {
      strong: '지혜롭고 통찰력이 뛰어난 당신은, 남들이 보지 못하는 것을 꿰뚫어 보는 능력이 있습니다.',
      weak: '생각만 하지 말고, 때로는 과감하게 행동으로 옮기는 것이 필요합니다.'
    }
  };

  return meanings[element]?.[type] || '';
}

/**
 * 용신별 실천 조언
 */
function getYongsinAdvice(element: Element): string {
  const advices: Record<string, string> = {
    'wood': '푸른 색상을 가까이하고, 동쪽 방향에서 좋은 기회를 찾아보세요. 아침 시간에 중요한 일을 결정하면 좋습니다.',
    'fire': '붉은 색상이나 밝은 조명이 있는 곳에서 에너지를 얻을 수 있어요. 남쪽 방향과 낮 시간에 기운이 좋아집니다.',
    'earth': '노란색이나 베이지 색상이 당신에게 안정을 줍니다. 중심을 잡고 착실하게 나아가면 큰 결실을 맺을 수 있습니다.',
    'metal': '흰색이나 금색이 행운을 가져다줍니다. 서쪽 방향에서 귀인을 만나고, 저녁 시간에 좋은 소식이 찾아옵니다.',
    'water': '검은색이나 파란색이 당신의 기운을 높여줍니다. 북쪽 방향이 길하고, 밤 시간에 좋은 아이디어가 떠오릅니다.'
  };

  return advices[element] || '';
}

/**
 * 인생 타임라인 스토리
 */
function generateTimelineStory(timeline: any, userName: string, targetYear: number): string {
  const parts: string[] = [];

  parts.push(`네 번째, ${userName}님의 인생 흐름을 살펴볼게요.`);

  if (timeline.currentAge) {
    parts.push(`지금 ${timeline.currentAge}세인 당신은,`);
  }

  // 현재 시기 분석
  const currentPhase = timeline.phases?.find((p: any) => {
    const [start, end] = p.ageRange.split('-').map(Number);
    return timeline.currentAge >= start && timeline.currentAge <= end;
  });

  if (currentPhase) {
    parts.push(`"${currentPhase.phase}"의 시기를 보내고 있습니다.`);
    if (currentPhase.opportunities?.length) {
      parts.push(`이 시기의 기회는 ${currentPhase.opportunities.join(', ')}입니다.`);
    }
  }

  // 전환점
  const upcomingTurningPoint = timeline.turningPoints?.find((tp: any) => tp.year >= targetYear);
  if (upcomingTurningPoint) {
    parts.push(`${upcomingTurningPoint.year}년에 중요한 전환점이 예상됩니다. ${upcomingTurningPoint.event}`);
  }

  return parts.join(' ');
}

/**
 * 월별 운세 스토리
 */
function generateMonthlyStory(monthlyPlan: MonthlyAction[], year: number): string {
  const parts: string[] = [];

  parts.push(`다섯 번째, ${year}년 운세 흐름입니다.`);

  // 최고의 달 찾기
  const sortedMonths = [...monthlyPlan].sort((a, b) => (b.score || 0) - (a.score || 0));
  const bestMonth = sortedMonths[0];
  const challengingMonth = sortedMonths[sortedMonths.length - 1];

  if (bestMonth) {
    parts.push(`${year}년, 당신에게 해가 가장 밝게 떠오르는 때는 ${bestMonth.monthName}입니다.`);
    parts.push(`이때 시작한 일이 좋은 결실을 맺을 거예요.`);
  }

  if (challengingMonth && challengingMonth.score && challengingMonth.score < 60) {
    parts.push(`${challengingMonth.monthName}에는 조금 신중하게 움직이세요.`);
    parts.push(`무리한 결정보다는 준비하고 기다리는 시간으로 삼으면 좋습니다.`);
  }

  return parts.join(' ');
}

/**
 * 황금 기회 스토리
 */
function generateGoldenWindowStory(goldenWindows: any[]): string {
  const parts: string[] = [];

  parts.push(`특별히 주목할 황금 기회의 시기가 있습니다.`);

  goldenWindows.slice(0, 2).forEach((gw: any) => {
    parts.push(`${gw.period}에는 ${gw.purpose}에 좋은 시기입니다.`);
    parts.push(`이때 적극적으로 움직이면 좋은 결과를 얻을 수 있어요.`);
  });

  return parts.join(' ');
}

/**
 * 용신별 행운의 숫자
 */
function getLuckyNumbers(element: Element): number[] {
  const numbers: Record<string, number[]> = {
    'wood': [3, 8],
    'fire': [2, 7],
    'earth': [5, 10],
    'metal': [4, 9],
    'water': [1, 6]
  };
  return numbers[element] || [3, 8];
}

/**
 * 용신별 행운의 방향
 */
function getLuckyDirection(element: Element): string {
  const directions: Record<string, string> = {
    'wood': '동쪽',
    'fire': '남쪽',
    'earth': '중앙',
    'metal': '서쪽',
    'water': '북쪽'
  };
  return directions[element] || '동쪽';
}

/**
 * 용신별 행운의 달
 */
function getLuckyMonths(element: Element): string {
  const months: Record<string, string> = {
    'wood': '3월과 4월',
    'fire': '5월과 6월',
    'earth': '7월과 8월',
    'metal': '9월과 10월',
    'water': '11월과 12월'
  };
  return months[element] || '3월과 4월';
}

/**
 * 나레이션을 단일 텍스트로 변환
 */
export function narrationToText(script: NarrationScript): string {
  return script.sections.map(s => s.content).join('\n\n');
}

/**
 * OpenAI TTS API를 사용한 음성 생성
 */
export async function generateAudioWithOpenAI(
  text: string,
  apiKey: string,
  voice: string = 'nova'
): Promise<Buffer> {
  const response = await fetch('https://api.openai.com/v1/audio/speech', {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${apiKey}`,
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      model: 'tts-1-hd',
      input: text,
      voice: voice, // alloy, echo, fable, onyx, nova, shimmer
      response_format: 'mp3',
      speed: 0.95 // 조금 느리게 읽어서 친근한 느낌
    })
  });

  if (!response.ok) {
    const error = await response.text();
    throw new Error(`OpenAI TTS Error: ${error}`);
  }

  const arrayBuffer = await response.arrayBuffer();
  return Buffer.from(arrayBuffer);
}

/**
 * Google Cloud TTS API를 사용한 음성 생성
 */
export async function generateAudioWithGoogle(
  text: string,
  apiKey: string,
  languageCode: string = 'ko-KR',
  voiceName: string = 'ko-KR-Wavenet-A'
): Promise<Buffer> {
  const response = await fetch(
    `https://texttospeech.googleapis.com/v1/text:synthesize?key=${apiKey}`,
    {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        input: { text },
        voice: {
          languageCode,
          name: voiceName
        },
        audioConfig: {
          audioEncoding: 'MP3',
          speakingRate: 0.95,
          pitch: 0
        }
      })
    }
  );

  if (!response.ok) {
    const error = await response.text();
    throw new Error(`Google TTS Error: ${error}`);
  }

  const data = await response.json();
  return Buffer.from(data.audioContent, 'base64');
}

/**
 * Naver Clova TTS API를 사용한 음성 생성
 */
export async function generateAudioWithNaver(
  text: string,
  clientId: string,
  clientSecret: string,
  speaker: string = 'nara' // nara, njinho, nhajun, ndain, etc.
): Promise<Buffer> {
  const response = await fetch('https://naveropenapi.apigw.ntruss.com/tts-premium/v1/tts', {
    method: 'POST',
    headers: {
      'X-NCP-APIGW-API-KEY-ID': clientId,
      'X-NCP-APIGW-API-KEY': clientSecret,
      'Content-Type': 'application/x-www-form-urlencoded'
    },
    body: new URLSearchParams({
      speaker,
      text,
      volume: '0',
      speed: '-1', // 조금 느리게
      pitch: '0',
      format: 'mp3'
    })
  });

  if (!response.ok) {
    const error = await response.text();
    throw new Error(`Naver TTS Error: ${error}`);
  }

  const arrayBuffer = await response.arrayBuffer();
  return Buffer.from(arrayBuffer);
}

/**
 * 통합 음성 생성 함수
 */
export async function generateSajuAudio(options: AudioGeneratorOptions): Promise<Buffer> {
  const script = generateNarrationScript(options);
  const fullText = narrationToText(script);

  const config = options.config || { provider: 'openai' as TTSProvider };

  switch (config.provider) {
    case 'openai':
      if (!config.apiKey) throw new Error('OpenAI API key required');
      return generateAudioWithOpenAI(fullText, config.apiKey, config.voiceId || 'nova');

    case 'google':
      if (!config.apiKey) throw new Error('Google API key required');
      return generateAudioWithGoogle(fullText, config.apiKey);

    case 'naver':
      // Naver는 clientId/clientSecret 필요
      throw new Error('Naver TTS requires separate client ID and secret');

    default:
      throw new Error(`Unknown TTS provider: ${config.provider}`);
  }
}

/**
 * 음성 파일명 생성
 */
export function generateAudioFilename(user: UserInput, targetYear: number = 2026): string {
  const date = new Date().toISOString().split('T')[0];
  const safeName = user.name.replace(/[^가-힣a-zA-Z0-9]/g, '');
  return `사주분석_음성_${safeName}_${targetYear}년_${date}.mp3`;
}

export default {
  generateNarrationScript,
  narrationToText,
  generateSajuAudio,
  generateAudioFilename,
  generateAudioWithOpenAI,
  generateAudioWithGoogle,
  generateAudioWithNaver
};
