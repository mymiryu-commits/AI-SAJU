/**
 * 사주 분석 결과 음성 나레이션 생성기
 *
 * TTS(Text-to-Speech) 서비스를 사용하여 음성 파일 생성
 * 스토리텔링 기반의 감성적인 나레이션 지원
 * 전문 명리학 용어를 활용한 신뢰도 높은 분석
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
import {
  DAY_MASTER_PROFESSIONAL,
  STRATEGIC_ADVICE,
  getMonthlyTaboo,
  generateIdentityTitle,
  getHiddenTraitMessage,
  calculateGoldenTimes,
  generateFortunePrescriptions
} from '../mappings/professionalTerms';
import {
  generateTraitAnalysis,
  generateMonthlyFortune,
  generateGrowthStrategy,
  generateFamilyAdvice
} from '../mappings/differentiatedContent';

// TTS 제공자 타입
export type TTSProvider = 'google' | 'naver' | 'openai' | 'edge';

// node-edge-tts 동적 import
let NodeEdgeTTS: any = null;
async function getNodeEdgeTTS() {
  if (!NodeEdgeTTS) {
    try {
      NodeEdgeTTS = await import('node-edge-tts');
    } catch (e) {
      throw new Error('node-edge-tts 패키지가 설치되지 않았습니다. npm install node-edge-tts');
    }
  }
  return NodeEdgeTTS;
}

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
 * "01:30" → "오전 한시 삼십분" (고유어 시 + 한자어 분)
 * "13:52" → "오후 한시 오십이분"
 */
function formatTimeToNaturalKorean(timeStr?: string): string {
  if (!timeStr) return '시간 미상';

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

  // 시는 고유어, 분은 한자어
  const hourKorean = hourToNativeKorean(hour);
  const minuteKorean = minute > 0 ? minuteToSinoKorean(minute) + '분' : '정각';

  return `${period} ${hourKorean}시 ${minuteKorean}`;
}

/**
 * 시(時)를 고유어로 변환 (한시, 두시, 세시...)
 */
function hourToNativeKorean(hour: number): string {
  const nativeNumbers: Record<number, string> = {
    1: '한', 2: '두', 3: '세', 4: '네', 5: '다섯',
    6: '여섯', 7: '일곱', 8: '여덟', 9: '아홉', 10: '열',
    11: '열한', 12: '열두'
  };
  return nativeNumbers[hour] || String(hour);
}

/**
 * 분(分)을 한자어로 변환 (일분, 이분, 삼십분...)
 */
function minuteToSinoKorean(num: number): string {
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

/**
 * 생년월일로 별자리 계산
 */
function getZodiacSignFromDate(birthDate: string): string {
  const date = new Date(birthDate);
  const month = date.getMonth() + 1;
  const day = date.getDate();

  if ((month === 3 && day >= 21) || (month === 4 && day <= 19)) return '양자리';
  if ((month === 4 && day >= 20) || (month === 5 && day <= 20)) return '황소자리';
  if ((month === 5 && day >= 21) || (month === 6 && day <= 21)) return '쌍둥이자리';
  if ((month === 6 && day >= 22) || (month === 7 && day <= 22)) return '게자리';
  if ((month === 7 && day >= 23) || (month === 8 && day <= 22)) return '사자자리';
  if ((month === 8 && day >= 23) || (month === 9 && day <= 22)) return '처녀자리';
  if ((month === 9 && day >= 23) || (month === 10 && day <= 22)) return '천칭자리';
  if ((month === 10 && day >= 23) || (month === 11 && day <= 21)) return '전갈자리';
  if ((month === 11 && day >= 22) || (month === 12 && day <= 21)) return '사수자리';
  if ((month === 12 && day >= 22) || (month === 1 && day <= 19)) return '염소자리';
  if ((month === 1 && day >= 20) || (month === 2 && day <= 18)) return '물병자리';
  return '물고기자리';
}

// ========== 카드 기반 스토리텔링 데이터 ==========

// 일간별 본질 카드 (자연물 - 꽃/나무 구분)
const ESSENCE_CARD_STORIES: Record<string, { symbol: string; category: 'flower' | 'tree'; trait: string; story: string }> = {
  '갑': { symbol: '소나무', category: 'tree', trait: '곧은 신념과 리더십을 지닌', story: '우뚝 솟은 소나무처럼, 당신은 어떤 풍파에도 꺾이지 않는 곧은 심지를 가졌습니다. 앞장서서 길을 내고, 뒤따르는 이들에게 그늘이 되어주는 사람. 그것이 당신의 타고난 본질입니다.' },
  '을': { symbol: '난초', category: 'flower', trait: '유연하면서도 우아함을 잃지 않는', story: '바람에 흔들리는 난초처럼, 당신은 강인함보다 유연함으로 세상을 헤쳐나갑니다. 어떤 환경에서도 자신만의 향기를 잃지 않고, 우아하게 피어나는 사람입니다.' },
  '병': { symbol: '해바라기', category: 'flower', trait: '에너지가 넘치고 주변을 밝히는', story: '태양을 향해 고개 드는 해바라기처럼, 당신은 어디서든 빛나는 존재입니다. 사람들의 중심에 서서 따뜻한 에너지를 나누고, 주변을 환하게 밝히는 사람입니다.' },
  '정': { symbol: '동백꽃', category: 'flower', trait: '따뜻하고 헌신적인 마음을 가진', story: '어둠 속에서도 피어나는 동백꽃처럼, 당신은 조용히 그러나 분명하게 빛납니다. 겉으로 드러나지 않아도 깊은 열정을 품고, 사랑하는 이들을 위해 묵묵히 헌신하는 따뜻한 사람입니다.' },
  '무': { symbol: '모란', category: 'flower', trait: '포용력이 크고 믿음직한', story: '만개한 모란처럼, 당신은 너그럽고 든든한 존재입니다. 산처럼 묵직하게 자리를 지키며, 모든 것을 품어주는 넉넉함이 있습니다.' },
  '기': { symbol: '코스모스', category: 'flower', trait: '감성이 풍부하고 조화를 이루는', story: '들판의 코스모스처럼, 당신은 소박하지만 깊은 아름다움을 가졌습니다. 주변과 자연스럽게 어우러지며 작은 것에서도 행복을 찾는 사람입니다.' },
  '경': { symbol: '국화', category: 'flower', trait: '의리 있고 원칙을 중시하는', story: '서리가 내려도 꺾이지 않는 국화처럼, 당신은 어떤 상황에서도 원칙을 지키고, 한번 정한 건 끝까지 가는 사람입니다.' },
  '신': { symbol: '매화', category: 'flower', trait: '섬세하면서 내면이 단단한', story: '추운 겨울에도 피어나는 매화처럼, 당신은 역경 속에서 더 강해지는 사람입니다. 섬세하면서도 날카로운 통찰력으로 세상을 바라봅니다.' },
  '임': { symbol: '연꽃', category: 'flower', trait: '깊은 지혜와 포용력을 가진', story: '진흙 속에서도 맑게 피어나는 연꽃처럼, 당신은 깊은 지혜와 포용력을 가졌습니다. 유유히 흐르는 큰 강처럼 어떤 상황도 담담히 받아들이는 힘이 있습니다.' },
  '계': { symbol: '물망초', category: 'flower', trait: '직관이 뛰어나고 감수성이 풍부한', story: '작지만 강인한 물망초처럼, 당신은 섬세하고 감수성이 풍부합니다. 남들이 보지 못하는 것을 느끼고, 조용히 세상을 변화시키는 힘을 가졌습니다.' }
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

// ========== 혈액형별 성향 분석 ==========
interface BloodTypeProfile {
  strength: string;
  weakness: string;
  love: string;
  work: string;
  stress: string;
}

const BLOOD_TYPE_STORIES: Record<string, BloodTypeProfile> = {
  'A': {
    strength: '당신은 신중하고 배려심이 깊습니다. 한번 마음 먹으면 끝까지 해내는 성실함이 있고, 주변 사람들의 감정을 잘 읽어내는 섬세한 안테나를 가지고 있어요.',
    weakness: '다만, 너무 남의 눈치를 보다 보면 정작 자신의 마음을 잃어버릴 때가 있어요. 모든 사람을 만족시킬 순 없다는 걸 기억하세요.',
    love: '사랑할 때 당신은 진심을 다합니다. 상대방을 위해 자신을 희생하는 경향이 있는데, 가끔은 받기만 해도 괜찮아요.',
    work: '꼼꼼하고 책임감 있는 당신은 팀에서 없어서는 안 될 존재입니다. 하지만 완벽주의가 스트레스가 될 수 있어요.',
    stress: '스트레스를 받으면 혼자 삭이는 경향이 있어요. 가끔은 속 시원하게 털어놓는 것도 필요합니다.'
  },
  'B': {
    strength: '당신은 자유로운 영혼입니다. 틀에 박힌 것을 싫어하고, 자신만의 방식으로 세상을 살아가는 용기가 있어요.',
    weakness: '하지만 그 자유로움이 때로는 주변 사람들에게 예측불가능한 사람으로 보일 수 있어요. 중요한 약속은 꼭 지켜주세요.',
    love: '사랑에 빠지면 온 세상이 그 사람뿐입니다. 하지만 식으면 또 빨리 식어버리기도 해요. 꾸준함을 연습해보세요.',
    work: '창의적인 아이디어가 넘치는 당신, 루틴한 일보다는 새로운 프로젝트에서 빛납니다.',
    stress: '갑갑할 때 어디론가 훌쩍 떠나고 싶어집니다. 가끔은 정말 떠나도 괜찮아요. 충전이 필요하니까요.'
  },
  'O': {
    strength: '당신은 타고난 리더입니다. 목표가 생기면 불도저처럼 밀고 나가는 추진력이 있고, 사람들을 끌어모으는 매력이 있어요.',
    weakness: '하지만 자신감이 넘칠 때 다른 사람의 의견을 무시하게 될 수 있어요. 경청하는 연습이 필요합니다.',
    love: '사랑할 때 소유욕이 강해질 수 있어요. 사랑한다고 다 내 것이 아니라는 걸 기억하세요.',
    work: '위기 상황에서 진가를 발휘합니다. 남들이 포기할 때 당신은 해결책을 찾아내는 사람이에요.',
    stress: '스트레스를 운동이나 활동으로 푸는 것이 좋습니다. 가만히 있으면 오히려 더 답답해져요.'
  },
  'AB': {
    strength: '당신은 다면적인 매력의 소유자입니다. 이성적이면서도 감성적이고, 냉철하면서도 따뜻한 양면을 가지고 있어요.',
    weakness: '그래서 가끔 자신도 자신이 헷갈릴 때가 있습니다. 그게 당신의 복잡한 매력이에요.',
    love: '쉽게 마음을 열지 않지만, 한번 마음을 열면 깊이 빠져듭니다. 벽을 너무 높이 쌓지 마세요.',
    work: '분석력과 창의력을 겸비한 당신은 전략을 짜는 일에 탁월합니다.',
    stress: '혼자만의 시간이 절대적으로 필요합니다. 그 시간이 당신을 재충전시켜 줄 거예요.'
  }
};

// ========== 일간별 궁합 및 환경 분석 ==========
interface CompatibilityProfile {
  bestMatch: string[];
  bestMatchReason: string;
  worstMatch: string[];
  worstMatchReason: string;
  bestEnvironment: string;
  avoidEnvironment: string;
  shineIn: string;
  warningSign: string;
}

const DAYMASTER_COMPATIBILITY: Record<string, CompatibilityProfile> = {
  '갑': {
    bestMatch: ['기', '계'],
    bestMatchReason: '당신의 강한 에너지를 부드럽게 받아주는 기토, 당신을 성장시켜주는 계수와 만나면 시너지가 폭발합니다. 서로를 이해하면서도 채워주는 관계가 됩니다.',
    worstMatch: ['경', '신'],
    worstMatchReason: '금의 기운을 가진 사람과는 충돌이 잦을 수 있어요. 서로의 방식이 너무 달라 조율이 필요합니다.',
    bestEnvironment: '새로운 프로젝트의 시작 단계, 리더십이 필요한 상황, 개척자가 필요한 환경에서 당신은 가장 빛납니다.',
    avoidEnvironment: '경직된 관료 조직, 세밀한 규정이 많은 환경, 자유가 없는 상황은 당신의 기를 꺾습니다.',
    shineIn: '스타트업, 창업, 새로운 분야 개척, 리더 포지션',
    warningSign: '주변에서 "너무 독단적이다"라는 말이 나오면 잠시 멈추고 경청하세요.'
  },
  '을': {
    bestMatch: ['경', '임'],
    bestMatchReason: '단단한 경금이 당신을 다듬어주고, 풍부한 임수가 당신을 키워줍니다. 의외로 강한 사람과 만나야 당신이 빛납니다.',
    worstMatch: ['갑', '무'],
    worstMatchReason: '같은 목의 갑목과는 경쟁 관계가 되기 쉽고, 무토의 무거움은 당신을 답답하게 할 수 있어요.',
    bestEnvironment: '창의력이 중시되는 환경, 유연한 사고가 필요한 상황, 협력이 중요한 팀에서 빛납니다.',
    avoidEnvironment: '일방적인 지시만 내리는 상사, 딱딱하고 권위적인 조직문화는 피하세요.',
    shineIn: '예술, 상담, 중재, 디자인, 인테리어, 고객 응대',
    warningSign: '자신의 의견을 너무 숨기고만 있으면 결국 폭발합니다. 적당히 표현하세요.'
  },
  '병': {
    bestMatch: ['신', '임'],
    bestMatchReason: '예리한 신금이 당신의 에너지를 정제해주고, 차분한 임수가 균형을 잡아줍니다.',
    worstMatch: ['계', '을'],
    worstMatchReason: '계수의 축축함은 당신의 불꽃을 꺼뜨리고, 을목은 당신에게 과하게 의존할 수 있어요.',
    bestEnvironment: '무대 위, 사람들 앞에서 말하는 상황, 주목받는 자리에서 당신은 최고의 퍼포먼스를 보여줍니다.',
    avoidEnvironment: '뒤에서 묵묵히 서포트만 해야 하는 역할, 인정받지 못하는 환경은 당신을 시들게 합니다.',
    shineIn: '영업, 강연, 방송, 이벤트, 홍보, 마케팅',
    warningSign: '주변에서 "너무 튄다"는 말이 나오면 조금 낮추는 것도 전략입니다.'
  },
  '정': {
    bestMatch: ['임', '갑'],
    bestMatchReason: '임수의 차분함이 당신의 열정을 조절해주고, 갑목이 당신을 키워줍니다.',
    worstMatch: ['계', '경'],
    worstMatchReason: '작은 물인 계수는 당신을 꺼뜨리고, 경금의 차가움은 당신을 불편하게 합니다.',
    bestEnvironment: '진심이 통하는 환경, 한 사람 한 사람과 깊이 만나는 일, 세심함이 필요한 자리.',
    avoidEnvironment: '대충대충 넘어가는 문화, 진정성 없는 관계, 겉만 화려한 환경은 맞지 않습니다.',
    shineIn: '상담, 교육, 힐링, 요리, 수공예, 정밀 작업',
    warningSign: '혼자 너무 많은 것을 짊어지고 있다면 도움을 요청하세요.'
  },
  '무': {
    bestMatch: ['계', '병'],
    bestMatchReason: '계수가 당신의 건조함을 촉촉하게 적셔주고, 병화가 따뜻함을 더해줍니다.',
    worstMatch: ['갑', '을'],
    worstMatchReason: '목의 기운이 당신을 파고들어 흔들 수 있어요. 너무 의존하는 관계는 피하세요.',
    bestEnvironment: '안정적인 조직, 오래된 기업, 신뢰가 중요한 분야에서 당신의 진가가 발휘됩니다.',
    avoidEnvironment: '급변하는 스타트업, 매일 새로운 것을 요구하는 환경은 당신을 지치게 합니다.',
    shineIn: '부동산, 농업, 건설, 중간관리자, 인사, 총무',
    warningSign: '변화를 너무 두려워하면 시대에 뒤처질 수 있습니다. 조금씩 시도해보세요.'
  },
  '기': {
    bestMatch: ['갑', '병'],
    bestMatchReason: '갑목이 당신에게 방향성을 주고, 병화가 온기를 더해줍니다. 당신을 이끌어주는 사람이 필요합니다.',
    worstMatch: ['을', '계'],
    worstMatchReason: '을목은 당신의 것을 빼앗아가는 느낌을 주고, 계수는 당신을 흔들리게 합니다.',
    bestEnvironment: '꼼꼼함이 필요한 업무, 디테일이 중요한 분야, 원칙을 지키는 조직.',
    avoidEnvironment: '너무 큰 그림만 강조하는 환경, 세부사항을 무시하는 문화는 불편합니다.',
    shineIn: '회계, 법률, 품질관리, 편집, 감수, 연구',
    warningSign: '너무 완벽을 추구하면 아무것도 시작하지 못합니다. 80%도 괜찮아요.'
  },
  '경': {
    bestMatch: ['을', '정'],
    bestMatchReason: '부드러운 을목이 당신의 날카로움을 녹여주고, 따뜻한 정화가 당신을 정제합니다.',
    worstMatch: ['갑', '병'],
    worstMatchReason: '갑목과는 충돌이 잦고, 병화는 당신을 녹여버릴 수 있어요.',
    bestEnvironment: '결단력이 필요한 상황, 위기 상황에서 빠른 판단이 필요한 곳.',
    avoidEnvironment: '우유부단한 리더 밑, 결정을 미루는 문화는 당신을 답답하게 합니다.',
    shineIn: '군인, 경찰, 의사, 변호사, 위기관리, 구조조정',
    warningSign: '날카로운 말투가 사람을 다치게 할 수 있습니다. 부드럽게 말해도 전달됩니다.'
  },
  '신': {
    bestMatch: ['병', '임'],
    bestMatchReason: '병화가 당신을 단련시키고, 임수가 당신을 빛나게 해줍니다. 강한 불과 깊은 물이 당신을 보석으로 만듭니다.',
    worstMatch: ['정', '을'],
    worstMatchReason: '작은 불인 정화는 당신을 녹이지 못하고 자신만 타고, 을목은 당신에게 부담이 됩니다.',
    bestEnvironment: '정밀함이 필요한 분야, 전문성이 인정받는 환경, 장인정신이 존중되는 곳.',
    avoidEnvironment: '대충 넘어가는 문화, 퀄리티보다 양을 중시하는 환경은 맞지 않습니다.',
    shineIn: '기술, IT, 금융분석, 보석, 정밀기계, 전문직',
    warningSign: '너무 날카롭게 굴면 주변에 사람이 남지 않습니다. 온기를 유지하세요.'
  },
  '임': {
    bestMatch: ['병', '무'],
    bestMatchReason: '병화가 당신에게 따뜻함을 주고, 무토가 당신을 담아줍니다. 넓게 흐르는 당신에게 방향을 잡아주는 존재가 필요합니다.',
    worstMatch: ['무', '기'],
    worstMatchReason: '너무 많은 토의 기운은 당신의 흐름을 막습니다. 갑갑함을 느낄 수 있어요.',
    bestEnvironment: '자유롭게 아이디어를 펼칠 수 있는 환경, 넓은 시야가 필요한 분야.',
    avoidEnvironment: '좁은 칸막이 사무실, 제한이 많은 환경, 작은 그릇 안에 갇히는 상황.',
    shineIn: '무역, 외교, 철학, 종교, 큰 그림을 그리는 기획',
    warningSign: '너무 흘러가기만 하면 아무데도 도착하지 못합니다. 때로는 멈추세요.'
  },
  '계': {
    bestMatch: ['무', '경'],
    bestMatchReason: '무토가 당신을 담아주고, 경금이 당신을 맑게 해줍니다. 단단한 사람 옆에 있을 때 당신은 빛납니다.',
    worstMatch: ['병', '정'],
    worstMatchReason: '불의 기운은 당신을 증발시킵니다. 너무 강렬한 사람 옆에 있으면 소진됩니다.',
    bestEnvironment: '섬세함이 필요한 환경, 감수성을 발휘할 수 있는 분야, 조용히 깊이 파고드는 일.',
    avoidEnvironment: '시끄럽고 정신없는 환경, 감정을 무시하는 문화는 당신을 메마르게 합니다.',
    shineIn: '심리상담, 글쓰기, 음악, 연구, 명상, 치유',
    warningSign: '감정에 너무 빠지면 객관성을 잃습니다. 가끔은 한 발 떨어져 보세요.'
  }
};

// ========== 띠별 특성 및 궁합 ==========
interface ZodiacProfile {
  personality: string;
  bestZodiac: string[];
  worstZodiac: string[];
}

const ZODIAC_COMPATIBILITY: Record<string, ZodiacProfile> = {
  '쥐': {
    personality: '재치 있고 영리한 당신은 어떤 상황에서도 빠르게 적응합니다. 기회를 포착하는 눈이 뛰어나지만, 때로는 너무 계산적으로 보일 수 있어요.',
    bestZodiac: ['용', '원숭이'],
    worstZodiac: ['말', '양']
  },
  '소': {
    personality: '묵묵히 자기 길을 가는 우직함이 있습니다. 느리지만 확실하게 성과를 내고, 한번 정한 건 끝까지 밀고 나갑니다.',
    bestZodiac: ['뱀', '닭'],
    worstZodiac: ['양', '말']
  },
  '호랑이': {
    personality: '용기 있고 카리스마 넘치는 당신은 어디서든 존재감이 드러납니다. 정의감이 강하지만 독선적이 되지 않도록 주의하세요.',
    bestZodiac: ['말', '개'],
    worstZodiac: ['원숭이', '뱀']
  },
  '토끼': {
    personality: '온화하고 배려심이 깊은 당신은 사람들의 마음을 편안하게 합니다. 다만 갈등을 피하려다 자신의 의견을 숨기기도 해요.',
    bestZodiac: ['양', '돼지'],
    worstZodiac: ['닭', '용']
  },
  '용': {
    personality: '야망이 크고 에너지가 넘치는 당신은 큰 일을 도모합니다. 하지만 자존심이 너무 강하면 외로워질 수 있어요.',
    bestZodiac: ['쥐', '원숭이'],
    worstZodiac: ['개', '토끼']
  },
  '뱀': {
    personality: '지혜롭고 신비로운 매력이 있습니다. 깊이 사고하고 통찰력이 뛰어나지만, 속을 드러내지 않아 오해받기도 합니다.',
    bestZodiac: ['소', '닭'],
    worstZodiac: ['호랑이', '돼지']
  },
  '말': {
    personality: '활동적이고 사교적인 당신은 어디서든 인기인입니다. 자유를 사랑하지만 끈기가 부족할 수 있어요.',
    bestZodiac: ['호랑이', '양'],
    worstZodiac: ['쥐', '소']
  },
  '양': {
    personality: '예술적 감각이 뛰어나고 마음이 따뜻합니다. 평화를 추구하지만 결정을 미루는 경향이 있어요.',
    bestZodiac: ['토끼', '말'],
    worstZodiac: ['소', '개']
  },
  '원숭이': {
    personality: '영리하고 재치 있어 어떤 문제도 해결해냅니다. 하지만 잔꾀가 지나치면 신뢰를 잃을 수 있어요.',
    bestZodiac: ['쥐', '용'],
    worstZodiac: ['호랑이', '돼지']
  },
  '닭': {
    personality: '완벽주의자인 당신은 디테일에 강합니다. 정직하고 솔직하지만 지나친 비판은 관계를 해칩니다.',
    bestZodiac: ['소', '뱀'],
    worstZodiac: ['토끼', '개']
  },
  '개': {
    personality: '충성스럽고 정직한 당신은 믿음직한 친구입니다. 정의감이 강하지만 걱정이 너무 많을 수 있어요.',
    bestZodiac: ['호랑이', '토끼'],
    worstZodiac: ['용', '양']
  },
  '돼지': {
    personality: '순수하고 관대한 당신은 사람들에게 복을 나눠줍니다. 욕심이 없지만 너무 순진하면 이용당할 수 있어요.',
    bestZodiac: ['토끼', '양'],
    worstZodiac: ['뱀', '원숭이']
  }
};

// ========== 생애주기별 조언 ==========
interface LifeStageAdvice {
  ageRange: string;
  theme: string;
  advice: string;
}

const LIFE_STAGE_ADVICE: Record<string, LifeStageAdvice[]> = {
  'default': [
    { ageRange: '20대', theme: '도전과 탐색', advice: '실패를 두려워하지 마세요. 이 시기의 시행착오가 평생의 자산이 됩니다.' },
    { ageRange: '30대', theme: '기반 구축', advice: '선택과 집중의 시간입니다. 모든 것을 다 할 수 없음을 인정하세요.' },
    { ageRange: '40대', theme: '확장과 성취', advice: '쌓아온 것을 펼치는 시기입니다. 자신감을 가지되 겸손을 잃지 마세요.' },
    { ageRange: '50대', theme: '지혜와 전수', advice: '경험을 나누는 시기입니다. 후배들에게 좋은 멘토가 되어주세요.' },
    { ageRange: '60대 이후', theme: '완성과 향유', advice: '인생을 음미하는 시간입니다. 감사하며 여유롭게 지내세요.' }
  ]
};

/**
 * 나이 계산 (한국 나이)
 */
function calculateKoreanAge(birthDate: string): number {
  const birthYear = parseInt(birthDate.split('-')[0]);
  const currentYear = new Date().getFullYear();
  return currentYear - birthYear + 1;
}

/**
 * 생애주기 단계 반환
 */
function getLifeStage(age: number): LifeStageAdvice {
  const stages = LIFE_STAGE_ADVICE['default'];
  if (age < 30) return stages[0];
  if (age < 40) return stages[1];
  if (age < 50) return stages[2];
  if (age < 60) return stages[3];
  return stages[4];
}

/**
 * 스토리텔링 기반 나레이션 스크립트 생성 (풍부한 분석 포함)
 * 전문 명리학 용어를 활용한 신뢰도 높은 분석
 */
export function generateNarrationScript(options: AudioGeneratorOptions): NarrationScript {
  const { user, saju, oheng, yongsin, gisin, premium, targetYear = 2026 } = options;
  const sections: NarrationSection[] = [];

  // 기본 정보 추출
  const dayMaster = saju.day?.stemKorean || '갑';
  const dayStem = saju.day?.heavenlyStem || '甲';
  const primaryYongsin = yongsin?.[0] || 'wood';
  const zodiac = saju.year?.zodiac || '';
  const age = calculateKoreanAge(user.birthDate);
  const lifeStage = getLifeStage(age);

  // 전문 명리학 용어 가져오기
  const dayMasterPro = DAY_MASTER_PROFESSIONAL[dayStem] || DAY_MASTER_PROFESSIONAL['甲'];
  const identityTitle = generateIdentityTitle(
    user.name,
    dayStem,
    yongsin || ['wood'],
    user.mbti,
    user.bloodType
  );

  // ========== 1. 오프닝 - 전문가 스타일 후킹 ==========
  const birthTimeKorean = formatTimeToNaturalKorean(user.birthTime);
  const essenceCardData = ESSENCE_CARD_STORIES[dayMaster] || ESSENCE_CARD_STORIES['갑'];

  sections.push({
    title: '인트로',
    content: `AI 운명 상담가가 전해드리는 ${user.name}님만의 특별한 운명 분석입니다. ` +
             `지금부터 동양 최고의 명리학, 사주 분석을 시작합니다.`,
    pauseAfter: 2500
  });

  sections.push({
    title: '후킹',
    content: `${user.name}님, 당신은 ${dayMasterPro.hanja}의 기운을 타고났습니다. ` +
             `${dayMasterPro.poeticTitle}로 불리는 이 명은, ${dayMasterPro.professionalDesc.slice(0, 80)}. ` +
             `지금부터 이 명이 어떤 의미인지 자세히 풀어드리겠습니다.`,
    pauseAfter: 3000
  });

  // ========== 2. 운명 정체성 ==========
  sections.push({
    title: '운명 정체성',
    content: `${identityTitle.mainTitle}. ` +
             `"${identityTitle.subTitle}" ` +
             `이것이 당신의 운명 정체성입니다. 기억해 두세요.`,
    pauseAfter: 2500
  });

  // ========== 3. 프로필 소개 ==========
  const formattedDate = user.birthDate.replace(/-/g, '년 ').replace(/년 (\d+)$/, '월 $1일');
  sections.push({
    title: '프로필',
    content: `${user.name}님은 ${formattedDate}, ${birthTimeKorean}에 태어나셨어요. ` +
             `${zodiac}띠이시고, 올해로 ${age}세가 되셨네요. ` +
             `${age}세라면 인생에서 "${lifeStage.theme}"의 시기입니다. ${lifeStage.advice}`,
    pauseAfter: 2000
  });

  // ========== 4. 본질 카드 + 전문 용어 ==========
  const essenceCard = ESSENCE_CARD_STORIES[dayMaster] || ESSENCE_CARD_STORIES['갑'];
  const categoryText = essenceCard.category === 'tree' ? '나무로' : '꽃으로';
  sections.push({
    title: '본질 카드',
    content: `당신의 일간(日干)은 ${dayMasterPro.hanja}입니다. ` +
             `${dayMasterPro.symbol}에 비유되며, ${dayMasterPro.nature}의 기운을 가졌습니다. ` +
             `당신을 ${categoryText} 표현하면 "${essenceCard.symbol}"입니다. ` +
             `${essenceCard.story} ` +
             `이게 바로 당신의 타고난 본질이에요.`,
    pauseAfter: 2500
  });

  // ========== 5. 숨겨진 성격 (소름 포인트) ==========
  sections.push({
    title: '숨겨진 속마음',
    content: `${user.name}님, 여기서 소름 돋는 이야기를 하나 해드릴게요. ` +
             `${dayMasterPro.hiddenTrait}. ` +
             `맞으시죠? 이건 사주에서만 알 수 있는 당신의 숨겨진 속마음입니다.`,
    pauseAfter: 2500
  });

  // ========== 4. 혈액형 분석 (있으면) ==========
  const bloodType = (user as any).bloodType;
  if (bloodType && BLOOD_TYPE_STORIES[bloodType]) {
    const blood = BLOOD_TYPE_STORIES[bloodType];
    sections.push({
      title: '혈액형 분석',
      content: `${bloodType}형인 당신의 특징을 말씀드릴게요. ` +
               `${blood.strength} ` +
               `${blood.weakness} ` +
               `스트레스를 받을 때는 어떠세요? ${blood.stress}`,
      pauseAfter: 2000
    });
  }

  // ========== 5. 띠별 성격 ==========
  if (zodiac && ZODIAC_COMPATIBILITY[zodiac]) {
    const zodiacInfo = ZODIAC_COMPATIBILITY[zodiac];
    sections.push({
      title: '띠 성격',
      content: `${zodiac}띠인 당신은요, ${zodiacInfo.personality}`,
      pauseAfter: 1500
    });
  }

  // ========== 6. 잘 맞는 사람, 안 맞는 사람 ==========
  const compatibility = DAYMASTER_COMPATIBILITY[dayMaster] || DAYMASTER_COMPATIBILITY['갑'];
  sections.push({
    title: '인연 궁합',
    content: `이제 중요한 이야기를 할게요. 당신과 잘 맞는 사람, 그리고 조심해야 할 사람이에요. ` +
             `당신과 찰떡궁합인 사람은 "${compatibility.bestMatch.join('", "')}" 일간을 가진 사람이에요. ` +
             `${compatibility.bestMatchReason} ` +
             `반면에 "${compatibility.worstMatch.join('", "')}" 일간을 가진 사람과는 마찰이 있을 수 있어요. ` +
             `${compatibility.worstMatchReason}`,
    pauseAfter: 2500
  });

  // 띠 궁합도 추가
  if (zodiac && ZODIAC_COMPATIBILITY[zodiac]) {
    const zodiacInfo = ZODIAC_COMPATIBILITY[zodiac];
    sections.push({
      title: '띠 궁합',
      content: `띠로 보면, ${zodiacInfo.bestZodiac.join('띠, ')}띠와 잘 맞아요. 서로 기운이 통해서 편안한 관계가 됩니다. ` +
               `${zodiacInfo.worstZodiac.join('띠, ')}띠와는 처음엔 끌릴 수 있지만, 오래 가면 힘들 수 있어요. 조금 거리를 두는 게 좋습니다.`,
      pauseAfter: 2000
    });
  }

  // ========== 7. 이성관/관계운 분석 - 결혼 상태 맞춤형 ==========
  const maritalStatus = user.maritalStatus || 'single';
  const idealPartner = getIdealPartnerByDaymaster(dayMaster, user.gender || 'male');

  if (maritalStatus === 'married' || maritalStatus === 'remarried') {
    // 기혼자/재혼자용 - 배우자 관계 조언
    const isRemarried = maritalStatus === 'remarried';
    sections.push({
      title: '부부 관계 서론',
      content: `${user.name}님, 이제 ${isRemarried ? '지금의 반려자와의' : '부부'} 관계에 대해 말씀드릴게요. ` +
               `결혼 생활에서 가장 중요한 것은 서로에 대한 이해와 존중입니다. ` +
               `사주를 통해 ${isRemarried ? '현재' : ''} 배우자와의 조화로운 관계를 위한 조언을 드리겠습니다.`,
      pauseAfter: 2500
    });

    sections.push({
      title: '배우자와의 궁합',
      content: `당신의 사주에서 보면, ${idealPartner.marriedAdvice || idealPartner.traits} ` +
               `배우자와 갈등이 생길 때는 상대의 입장에서 한 번 더 생각해보세요. ` +
               `특히 ${idealPartner.conflictAreas || '사소한 일상의 결정'}에서 의견 차이가 있을 수 있어요.`,
      pauseAfter: 2500
    });

    sections.push({
      title: '관계 개선 조언',
      content: `부부 관계를 더 좋게 만드는 팁을 드릴게요. ` +
               `첫째, 감사의 말을 자주 표현하세요. 당연하다고 생각하는 것들에 고마움을 전해보세요. ` +
               `둘째, 함께하는 시간을 의도적으로 만드세요. 바쁜 일상 속에서도 둘만의 시간이 필요합니다. ` +
               `셋째, 서로의 개인 시간과 공간을 존중해주세요. ` +
               `이 세 가지만 실천해도 관계가 한층 깊어질 거예요.`,
      pauseAfter: 3000
    });

    if (user.hasChildren) {
      sections.push({
        title: '가정 운세',
        content: `자녀가 있으시니, 가정 전체의 화목에 대해서도 말씀드릴게요. ` +
                 `부모의 관계가 좋으면 자녀에게도 긍정적인 영향을 미칩니다. ` +
                 `가족 간의 대화 시간을 꼭 챙기시고, 서로의 이야기에 귀 기울여주세요.`,
        pauseAfter: 2000
      });
    }
  } else if (maritalStatus === 'divorced') {
    // 이혼자용 - 치유와 새로운 시작
    sections.push({
      title: '새로운 시작',
      content: `${user.name}님, 인생에서 힘든 시간을 보내셨을 수 있어요. ` +
               `하지만 사주에서 보면, 모든 끝은 새로운 시작을 의미합니다. ` +
               `과거의 경험은 당신을 더 강하고 현명하게 만들어주었습니다.`,
      pauseAfter: 2500
    });

    sections.push({
      title: '치유의 시간',
      content: `지금 가장 중요한 것은 자신을 돌보는 시간입니다. ` +
               `새로운 인연을 급하게 찾기보다, 먼저 내면의 상처를 치유하세요. ` +
               `당신의 사주에서 ${idealPartner.healingAdvice || '조용한 취미 활동이나 자기 계발'}이 큰 도움이 될 거예요.`,
      pauseAfter: 2500
    });

    sections.push({
      title: '미래의 인연',
      content: `준비가 되셨을 때, 좋은 인연은 분명 다시 찾아옵니다. ` +
               `${idealPartner.traits} ` +
               `이전의 실패를 거울삼아, 더 나은 선택을 하실 수 있을 거예요. ` +
               `천천히, 자신의 속도로 나아가세요.`,
      pauseAfter: 2500
    });
  } else {
    // 미혼자용 - 기존 연애/만남 조언
    sections.push({
      title: '이성관 서론',
      content: `${user.name}님, 여기서 정말 중요한 이야기를 드릴게요. ` +
               `살면서 좋은 이성을 만나는 것은 인생의 큰 축이 바뀌는 일입니다. ` +
               `누구를 만나느냐에 따라 10년, 20년의 행복이 결정됩니다. ` +
               `그래서 사주에서 이성운은 가장 신중하게 봐야 할 부분이에요.`,
      pauseAfter: 2500
    });

    sections.push({
      title: '이상적 파트너',
      content: `당신에게 맞는 이상적인 파트너는 어떤 사람일까요? ` +
               `${idealPartner.traits} ` +
               `${idealPartner.compatibility}`,
      pauseAfter: 2500
    });

    sections.push({
      title: '주의할 이성',
      content: `반대로, 이런 사람은 조심하셔야 해요. ` +
               `${idealPartner.warningTypes} ` +
               `첫인상이 좋아도 시간을 두고 확인하세요. 급하게 결정하면 후회할 수 있습니다.`,
      pauseAfter: 2000
    });

    sections.push({
      title: '인연 만나기',
      content: `좋은 인연은 어디서 만날까요? ` +
               `${idealPartner.whereToMeet} ` +
               `억지로 찾기보다, 자신을 가꾸면서 자연스럽게 만나는 게 가장 좋습니다.`,
      pauseAfter: 2000
    });

    sections.push({
      title: '파트너 체크',
      content: `지금 만나는 분이 있다면, 이 다섯 가지를 체크해보세요. ` +
               `첫째, 당신의 말을 끝까지 듣고 공감해주는가. ` +
               `둘째, 작은 약속도 성실하게 지키는가. ` +
               `셋째, 갈등 상황에서 해결하려고 노력하는가. ` +
               `넷째, 당신의 가족과 친구를 존중하는가. ` +
               `다섯째, 미래에 대한 비전이 비슷한가. ` +
               `세 개 이상 해당된다면 좋은 인연일 가능성이 높습니다.`,
      pauseAfter: 3000
    });
  }

  // ========== 8. 빛나는 환경 vs 피해야 할 환경 ==========
  sections.push({
    title: '환경 분석',
    content: `이제 직업과 환경 이야기입니다. 당신이 어디서 가장 빛나는지 말씀드릴게요. ` +
             `${compatibility.bestEnvironment} ` +
             `구체적으로 말하면, ${compatibility.shineIn} 같은 분야에서 당신의 재능이 폭발합니다. ` +
             `반대로, ${compatibility.avoidEnvironment} ` +
             `그리고 이 말을 기억하세요. ${compatibility.warningSign}`,
    pauseAfter: 2500
  });

  // ========== 8. 에너지 카드 - 필요한 기운 ==========
  const energyCard = ENERGY_CARD_STORIES[primaryYongsin] || ENERGY_CARD_STORIES['wood'];
  sections.push({
    title: '에너지 카드',
    content: `지금 당신에게 필요한 기운을 알려드릴게요. ` +
             `당신의 에너지 동물은 "${energyCard.animal}"입니다. ` +
             `${energyCard.story}`,
    pauseAfter: 2000
  });

  // ========== 9. 오행 분석 ==========
  const ohengStory = generateOhengStory(oheng, yongsin, gisin);
  sections.push({
    title: '오행 이야기',
    content: ohengStory,
    pauseAfter: 2000
  });

  // ========== 10. 장단점 솔직하게 ==========
  sections.push({
    title: '솔직한 조언',
    content: `${user.name}님, 솔직하게 말씀드릴게요. ` +
             `당신의 가장 큰 장점은 한번 마음 먹으면 끝까지 가는 끈기입니다. ` +
             `하지만 단점도 있어요. 때로는 너무 완고해서 다른 의견을 듣지 않을 때가 있습니다. ` +
             `이 단점을 인정하고 조금씩 유연해지면, 당신의 장점이 더 빛날 거예요.`,
    pauseAfter: 2000
  });

  // ========== 11. 프리미엄 콘텐츠 ==========
  if (premium) {
    if (premium.lifeTimeline) {
      const timelineStory = generateTimelineStory(premium.lifeTimeline, user.name, targetYear);
      sections.push({
        title: '인생 타임라인',
        content: timelineStory,
        pauseAfter: 2000
      });
    }

    if (premium.monthlyActionPlan?.length) {
      const monthlyStory = generateMonthlyStory(premium.monthlyActionPlan, targetYear);
      sections.push({
        title: '월별 운세',
        content: monthlyStory,
        pauseAfter: 2000
      });
    }

    if (premium.lifeTimeline?.goldenWindows?.length) {
      const goldenStory = generateGoldenWindowStory(premium.lifeTimeline.goldenWindows);
      sections.push({
        title: '황금 기회',
        content: goldenStory,
        pauseAfter: 2000
      });
    }
  }

  // ========== 12. 행운 정보 ==========
  const luckyNumbers = getLuckyNumbers(primaryYongsin);
  const luckyDirection = getLuckyDirection(primaryYongsin);
  sections.push({
    title: '행운 카드',
    content: `마지막으로 행운을 높이는 팁을 드릴게요. ` +
             `당신의 행운 숫자는 ${luckyNumbers.join('과 ')}입니다. 비밀번호나 중요한 선택에 참고하세요. ` +
             `${getLuckyMonths(primaryYongsin)}에는 새로운 시작에 유리하고, ` +
             `${luckyDirection} 방향에서 좋은 기운이 흘러옵니다. ` +
             `여행이나 이사를 생각하신다면 이 방향을 고려해보세요.`,
    pauseAfter: 2000
  });

  // ========== 13. 황금 기회일 ==========
  const goldenTimes = calculateGoldenTimes(user.birthDate, dayStem, yongsin || ['wood'], targetYear);
  if (goldenTimes.length > 0) {
    const firstGolden = goldenTimes[0];
    sections.push({
      title: '황금 기회일',
      content: `${user.name}님, 특별히 기억해야 할 날을 알려드릴게요. ` +
               `${firstGolden.date}은 당신에게 "천을귀인(天乙貴人)"이 임하는 황금 기회의 날입니다. ` +
               `이 날은 ${firstGolden.action}. ` +
               `달력에 꼭 표시해 두세요. 이 기운을 놓치면 아깝습니다.`,
      pauseAfter: 2500
    });
  }

  // ========== 14. 이번 달 금기 사항 ==========
  const currentMonth = new Date().getMonth() + 1;
  const monthlyTaboo = getMonthlyTaboo(currentMonth, primaryYongsin);
  sections.push({
    title: '월별 주의사항',
    content: `${currentMonth}월 주의사항을 알려드릴게요. ` +
             `이번 달은 ${monthlyTaboo.avoidAction}. 이건 피하시는 게 좋습니다. ` +
             `반면에, ${monthlyTaboo.luckyItem}을 가까이 두시면 운이 열립니다. ` +
             `${monthlyTaboo.luckyColor} 계열의 옷을 입으시면 더욱 좋고요. ` +
             `작은 것 하나가 운을 바꿉니다. 실천해 보세요.`,
    pauseAfter: 2500
  });

  // ========== 15. 개운 처방전 ==========
  const prescriptions = generateFortunePrescriptions(yongsin || ['wood'], gisin || ['fire']);
  if (prescriptions.length > 0) {
    const envRx = prescriptions.find(p => p.category === '환경');
    const avoidRx = prescriptions.find(p => p.category === '피할 것');

    let rxContent = `마지막으로 일상에서 실천할 수 있는 개운법(開運法)을 알려드릴게요. `;
    if (envRx) {
      rxContent += `${envRx.item}을 ${envRx.howTo} `;
    }
    if (avoidRx) {
      rxContent += `반면에, ${avoidRx.item}은 조금 줄이시는 게 좋겠습니다. `;
    }
    rxContent += `이런 작은 변화가 운의 흐름을 바꿉니다.`;

    sections.push({
      title: '개운 처방전',
      content: rxContent,
      pauseAfter: 2500
    });
  }

  // ========== 16. 선천적 vs 후천적 기질 분석 ==========
  const zodiacSign = getZodiacSignFromDate(user.birthDate);
  const traitAnalysis = generateTraitAnalysis(
    dayStem,
    user.mbti,
    user.bloodType,
    zodiacSign,
    age
  );

  sections.push({
    title: '기질 분석',
    content: `${user.name}님, 이제 당신이 타고난 것과 환경에서 배운 것을 구분해서 말씀드릴게요. ` +
             `선천적으로 당신은 ${traitAnalysis.innate.corePersonality}. ` +
             `타고난 재능은 ${traitAnalysis.innate.naturalTalent}이고, ` +
             `인생의 큰 테마는 "${traitAnalysis.innate.lifeTheme}"입니다. ` +
             `반면 후천적으로는 ${traitAnalysis.acquired.learnedBehavior} ` +
             `스트레스를 받으면 ${traitAnalysis.acquired.copingStyle} ` +
             `앞으로의 성장 방향은 ${traitAnalysis.acquired.growthDirection}`,
    pauseAfter: 3500
  });

  // ========== 17. 이번 달 상세 운세 ==========
  const monthlyFortune = generateMonthlyFortune(
    dayStem,
    yongsin?.map(y => y as string) || ['wood'],
    targetYear,
    currentMonth
  );

  sections.push({
    title: '이번 달 베스트 데이',
    content: `${currentMonth}월 가장 좋은 날을 알려드릴게요. ` +
             `${currentMonth}월 ${monthlyFortune.bestDays[0]?.day}일은 ${monthlyFortune.bestDays[0]?.reason}. ` +
             `이 날은 ${monthlyFortune.bestDays[0]?.action}. ` +
             `반면에 ${currentMonth}월 ${monthlyFortune.avoidDays[0]?.day}일은 조심하세요. ` +
             `${monthlyFortune.avoidDays[0]?.reason}. ${monthlyFortune.avoidDays[0]?.warning}`,
    pauseAfter: 2500
  });

  // 로또 및 행운의 숫자
  sections.push({
    title: '행운의 숫자',
    content: `이번 달 행운의 숫자는 ${monthlyFortune.luckyNumbers.join(', ')}입니다. ` +
             `로또 번호 추천은 ${monthlyFortune.lottoNumbers.join(', ')}예요. ` +
             `물론 참고용이니까요, 과도한 기대는 금물입니다. 하지만 기운이 좋을 때 시도하면 분명 다릅니다.`,
    pauseAfter: 2000
  });

  // 함께할 사람 / 피할 사람
  sections.push({
    title: '인연 관리',
    content: `${currentMonth}월에 특히 함께하면 좋은 사람 유형이 있어요. ` +
             `${monthlyFortune.bestPeopleTypes[0]?.type}. ${monthlyFortune.bestPeopleTypes[0]?.reason} ` +
             `반면에 거리를 둬야 할 유형도 있어요. ` +
             `${monthlyFortune.avoidPeopleTypes[0]?.type}. ${monthlyFortune.avoidPeopleTypes[0]?.reason} ` +
             `${monthlyFortune.avoidPeopleTypes[0]?.howToHandle}`,
    pauseAfter: 3000
  });

  // ========== 18. 5대 영역 성장 전략 ==========
  const growthStrategy = generateGrowthStrategy(
    dayStem,
    yongsin?.map(y => y as string) || ['wood'],
    user.mbti,
    age
  );

  sections.push({
    title: '성장 전략',
    content: `${user.name}님의 5대 영역 성장 전략을 말씀드릴게요. ` +
             `인맥 관리는요, ${growthStrategy.people.advice} ${growthStrategy.people.action} ` +
             `행운을 끌어당기려면, ${growthStrategy.luck.advice} ${growthStrategy.luck.action} ` +
             `재정적으로는, ${growthStrategy.economy.advice} ` +
             `사랑 운을 높이려면, ${growthStrategy.love.advice} ` +
             `그리고 환경적으로, ${growthStrategy.environment.advice} ` +
             `이 다섯 가지 영역에서 균형을 잡으면, 삶 전체가 상승합니다.`,
    pauseAfter: 4000
  });

  // ========== 19. 가족/자녀 조언 (해당 시) ==========
  const hasChildren = user.hasChildren === true;
  const familyAdvice = generateFamilyAdvice(dayStem, hasChildren, user.mbti);

  if (hasChildren || maritalStatus === 'married' || maritalStatus === 'remarried') {
    sections.push({
      title: '가족 조언',
      content: `가정에 대해서도 말씀드릴게요. ` +
               `부모로서 당신의 강점은요, ${familyAdvice.parentStrength} ` +
               `자녀 양육에서는, ${familyAdvice.childGuidance} ` +
               `가족 화합을 위해서는, ${familyAdvice.familyHarmony} ` +
               `세대 간 소통 팁도 드릴게요. ${familyAdvice.intergenerational}`,
      pauseAfter: 3000
    });
  }

  // ========== 20. 클로징 ==========
  sections.push({
    title: '마무리',
    content: `${user.name}님, 긴 이야기 끝까지 들어주셔서 감사합니다. ` +
             `오늘 들은 이야기 중에 "아, 이건 정말 나네" 하고 고개를 끄덕인 부분이 있으셨을 거예요. ` +
             `그 느낌을 기억해주세요. 그게 당신을 이해하는 첫걸음입니다. ` +
             `운명은 정해진 게 아니라, 알고 대비하면 바꿀 수 있습니다. ` +
             `사주가 당신의 길을 정하는 것이 아니라, 당신이 이 운세를 어떻게 "사용"할지가 중요합니다. ` +
             `이 분석이 당신의 인생에 작은 나침반이 되기를 바랍니다. ` +
             `${user.name}님의 앞날에 좋은 일만 가득하기를 진심으로 기원합니다.`,
    pauseAfter: 1500
  });

  // ========== 17. 아웃트로 ==========
  sections.push({
    title: '아웃트로',
    content: `이 분석이 도움이 되셨다면, 소중한 분께 공유해 보세요. ` +
             `더 자세한 분석은 AI 플랜엑스 닷컴에서 확인하실 수 있습니다. ` +
             `AI 플랜엑스, 당신의 운명과 함께합니다.`,
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
 * 일간별 이상적인 파트너 특성 반환
 */
interface IdealPartnerProfile {
  traits: string;
  compatibility: string;
  warningTypes: string;
  whereToMeet: string;
  // 기혼자용 추가 필드
  marriedAdvice?: string;
  conflictAreas?: string;
  // 이혼자용 추가 필드
  healingAdvice?: string;
}

function getIdealPartnerByDaymaster(dayMaster: string, gender: 'male' | 'female'): IdealPartnerProfile {
  // 일간별 이상적 파트너 프로필 (성별에 따라 다르게 제공)
  const profiles: Record<string, { male: IdealPartnerProfile; female: IdealPartnerProfile }> = {
    '갑': {
      male: {
        traits: '당신에게는 부드럽고 포용력 있는 파트너가 맞습니다. 당신의 강한 추진력을 받아주면서, 지나칠 때 살짝 브레이크를 걸어줄 수 있는 사람이요. 감성적이고 배려 깊은 사람, 말보다 행동으로 사랑을 표현하는 타입이 당신과 잘 맞아요.',
        compatibility: '연인이 MBTI로 F 성향이 강하거나, 물이나 토의 기운을 가진 사람이라면 더욱 좋습니다. 당신을 존경하면서도 자기 색깔이 있는 사람, 그런 사람과 함께하면 오래 갑니다.',
        warningTypes: '자기주장이 너무 강해서 매사 부딪히는 사람, 당신보다 더 리더십이 강해서 경쟁하게 되는 사람, 그리고 감정 기복이 심해서 당신을 지치게 하는 사람은 피하세요.',
        whereToMeet: '당신의 커리어나 목표와 관련된 곳에서 인연을 만날 확률이 높습니다. 세미나, 업무 관련 모임, 혹은 취미 동아리에서 자연스럽게 만나게 될 거예요.'
      },
      female: {
        traits: '당신에게는 든든하고 안정적인 파트너가 맞습니다. 당신의 독립심을 존중하면서도 때로는 기댈 수 있는 넓은 어깨를 가진 사람이요. 말이 많지 않아도 행동으로 보여주는 타입, 성실하고 책임감 있는 사람이 당신과 잘 맞아요.',
        compatibility: '연인이 MBTI로 T 성향이 강하거나, 토나 금의 기운을 가진 사람이라면 좋습니다. 당신의 활동성을 응원하면서도 가정적인 면이 있는 사람, 그런 사람과 함께하면 균형 잡힌 삶을 살 수 있어요.',
        warningTypes: '질투심이 너무 강해서 당신을 구속하려는 사람, 자기 일에 무책임한 사람, 그리고 말만 앞서고 실천이 없는 사람은 피하세요.',
        whereToMeet: '전문성을 기르는 곳에서 좋은 인연을 만날 수 있어요. 자격증 공부 모임, 운동 동호회, 혹은 봉사활동에서 진지하게 만나게 될 거예요.'
      }
    },
    '을': {
      male: {
        traits: '당신에게는 강단 있고 결단력 있는 파트너가 맞습니다. 당신이 고민할 때 방향을 제시해주고, 용기를 북돋아주는 사람이요. 자기 세계가 뚜렷하고 자신감 있는 타입이 당신과 잘 맞아요.',
        compatibility: '연인이 MBTI로 J 성향이 강하거나, 금이나 수의 기운을 가진 사람이라면 좋습니다. 당신의 유연함을 사랑하면서도 때로는 이끌어줄 수 있는 사람, 그런 사람과 함께하면 성장합니다.',
        warningTypes: '너무 우유부단해서 결정을 못 하는 사람, 당신처럼 눈치만 보는 사람, 그리고 이기적이어서 당신의 희생만 요구하는 사람은 피하세요.',
        whereToMeet: '예술이나 창작 관련 활동에서 좋은 인연을 만날 수 있어요. 전시회, 공연장, 혹은 문화센터 강좌에서 감성이 통하는 사람을 만나게 될 거예요.'
      },
      female: {
        traits: '당신에게는 따뜻하고 소통을 잘하는 파트너가 맞습니다. 당신의 이야기를 끝까지 들어주고 공감해주는 사람이요. 감정 표현이 솔직하고 애정 표현이 풍부한 타입이 당신과 잘 맞아요.',
        compatibility: '연인이 MBTI로 F 성향이 강하거나, 수나 목의 기운을 가진 사람이라면 좋습니다. 당신의 섬세함을 이해하고 함께 성장하려는 사람, 그런 사람과 함께하면 행복합니다.',
        warningTypes: '감정 표현이 없고 무뚝뚝하기만 한 사람, 당신을 통제하려는 사람, 그리고 자기중심적이어서 공감 능력이 없는 사람은 피하세요.',
        whereToMeet: '일상적인 곳에서 좋은 인연을 만날 수 있어요. 카페, 서점, 혹은 소규모 독서 모임에서 천천히 알아가는 인연이 될 거예요.'
      }
    },
    '병': {
      male: {
        traits: '당신에게는 차분하고 안정적인 파트너가 맞습니다. 당신의 뜨거운 에너지를 받아주면서 균형을 잡아줄 수 있는 사람이요. 조용히 지원해주는 타입, 자기 일을 묵묵히 하면서 당신을 빛나게 해주는 사람이 맞아요.',
        compatibility: '연인이 MBTI로 I 성향이 강하거나, 수나 금의 기운을 가진 사람이라면 좋습니다. 당신의 화려함을 사랑하면서도 자신만의 세계를 가진 사람, 그런 사람과 함께하면 오래 갑니다.',
        warningTypes: '당신보다 더 주목받으려고 경쟁하는 사람, 질투심이 강해서 당신의 인간관계를 제한하려는 사람, 그리고 변덕이 심해서 당신을 혼란스럽게 하는 사람은 피하세요.',
        whereToMeet: '사람들이 많이 모이는 활동적인 곳에서 인연을 만날 확률이 높습니다. 스포츠 동호회, 파티, 혹은 네트워킹 행사에서 자연스럽게 만나게 될 거예요.'
      },
      female: {
        traits: '당신에게는 지적이고 신뢰할 수 있는 파트너가 맞습니다. 당신과 대화가 통하고, 함께 성장할 수 있는 사람이요. 자기 분야에서 전문성이 있고, 당신의 열정을 진심으로 응원해주는 타입이 맞아요.',
        compatibility: '연인이 MBTI로 N 성향이 강하거나, 금이나 수의 기운을 가진 사람이라면 좋습니다. 당신의 밝은 에너지를 사랑하면서도 깊이 있는 대화를 나눌 수 있는 사람, 그런 사람과 함께하면 균형잡힙니다.',
        warningTypes: '소유욕이 지나치게 강한 사람, 당신의 사교성을 문제 삼는 사람, 그리고 자기 발전에 관심 없이 안주하는 사람은 피하세요.',
        whereToMeet: '배움이 있는 곳에서 좋은 인연을 만날 수 있어요. 세미나, 강연회, 혹은 스터디 그룹에서 가치관이 맞는 사람을 만나게 될 거예요.'
      }
    },
    '정': {
      male: {
        traits: '당신에게는 넓은 포용력을 가진 파트너가 맞습니다. 당신의 섬세한 감정을 이해하고 받아주는 사람이요. 표현은 서툴러도 행동으로 사랑을 증명하는 타입, 든든하고 변하지 않는 사람이 맞아요.',
        compatibility: '연인이 MBTI로 S 성향이 강하거나, 토나 목의 기운을 가진 사람이라면 좋습니다. 당신의 헌신을 당연하게 여기지 않고 감사할 줄 아는 사람, 그런 사람과 함께하면 행복합니다.',
        warningTypes: '당신의 진심을 가볍게 여기는 사람, 이용하려고만 하는 사람, 그리고 감정적으로 냉담한 사람은 절대 피하세요. 당신이 상처받습니다.',
        whereToMeet: '따뜻한 분위기의 장소에서 좋은 인연을 만날 수 있어요. 요리 클래스, 봉사활동, 혹은 소모임에서 진심이 통하는 사람을 만나게 될 거예요.'
      },
      female: {
        traits: '당신에게는 안정감과 진정성을 가진 파트너가 맞습니다. 말보다 행동이 앞서고, 꾸준히 곁에 있어주는 사람이요. 표현은 서툴러도 마음이 따뜻하고, 약속을 지키는 사람이 맞아요.',
        compatibility: '연인이 MBTI로 F 성향이 강하거나, 목이나 토의 기운을 가진 사람이라면 좋습니다. 당신의 따뜻함을 알아보고 소중히 여기는 사람, 그런 사람과 함께하면 오래 갑니다.',
        warningTypes: '말만 번지르르한 사람, 책임감 없이 나대는 사람, 그리고 당신의 희생을 당연하게 여기는 사람은 피하세요.',
        whereToMeet: '가족이나 지인 소개로 좋은 인연을 만날 확률이 높습니다. 혹은 종교 모임, 취미 활동에서 오래 알고 지낸 후 연인이 되는 케이스가 많아요.'
      }
    },
    '무': {
      male: {
        traits: '당신에게는 생기 있고 밝은 파트너가 맞습니다. 당신의 무거움을 환하게 밝혀줄 수 있는 사람이요. 표현력이 좋고 소통을 즐기는 타입, 당신을 편안하게 웃게 해주는 사람이 맞아요.',
        compatibility: '연인이 MBTI로 E 성향이 강하거나, 화나 수의 기운을 가진 사람이라면 좋습니다. 당신의 든든함을 사랑하면서도 일상에 활력을 주는 사람, 그런 사람과 함께하면 균형잡힙니다.',
        warningTypes: '너무 의존적인 사람, 변화를 싫어해서 같이 정체되는 사람, 그리고 책임을 회피하는 사람은 피하세요.',
        whereToMeet: '안정적인 환경에서 좋은 인연을 만날 수 있어요. 직장, 동창 모임, 혹은 지인 소개로 신뢰할 수 있는 사람을 만나게 될 거예요.'
      },
      female: {
        traits: '당신에게는 신뢰할 수 있고 책임감 있는 파트너가 맞습니다. 당신처럼 착실하고, 가정을 중요하게 생각하는 사람이요. 화려함보다 진정성을 가진 타입, 오래 함께할 수 있는 사람이 맞아요.',
        compatibility: '연인이 MBTI로 J 성향이 강하거나, 금이나 화의 기운을 가진 사람이라면 좋습니다. 당신의 포용력을 사랑하고 함께 가정을 꾸리고 싶어하는 사람, 그런 사람과 함께하면 행복합니다.',
        warningTypes: '말만 앞서고 실천이 없는 사람, 책임을 남에게 미루는 사람, 그리고 가정보다 개인을 우선시하는 사람은 피하세요.',
        whereToMeet: '안정적이고 신뢰할 수 있는 곳에서 인연을 만날 확률이 높습니다. 종교 모임, 동문 모임, 혹은 가족 소개로 만나는 인연이 좋아요.'
      }
    },
    '기': {
      male: {
        traits: '당신에게는 리더십 있고 방향을 제시해주는 파트너가 맞습니다. 당신이 고민할 때 결단을 도와주는 사람이요. 목표가 뚜렷하고 추진력이 있는 타입, 당신을 이끌어주는 사람이 맞아요.',
        compatibility: '연인이 MBTI로 J 성향이 강하거나, 목이나 화의 기운을 가진 사람이라면 좋습니다. 당신의 꼼꼼함을 인정하고 함께 성장하려는 사람, 그런 사람과 함께하면 발전합니다.',
        warningTypes: '우유부단하고 결정을 못 하는 사람, 계획 없이 흘러가는 사람, 그리고 세부사항을 무시하는 사람은 피하세요.',
        whereToMeet: '전문성을 기르는 곳에서 좋은 인연을 만날 수 있어요. 스터디 그룹, 자격증 모임, 혹은 직장에서 능력 있는 사람을 만나게 될 거예요.'
      },
      female: {
        traits: '당신에게는 따뜻하고 표현을 잘하는 파트너가 맞습니다. 당신의 노력을 알아주고 칭찬해주는 사람이요. 애정 표현이 풍부하고 감성이 통하는 타입, 당신을 인정해주는 사람이 맞아요.',
        compatibility: '연인이 MBTI로 F 성향이 강하거나, 화나 목의 기운을 가진 사람이라면 좋습니다. 당신의 섬세함을 사랑하고 소통을 중요하게 여기는 사람, 그런 사람과 함께하면 행복합니다.',
        warningTypes: '무뚝뚝하고 표현이 없는 사람, 당신의 노력을 당연하게 여기는 사람, 그리고 감정적으로 냉담한 사람은 피하세요.',
        whereToMeet: '소규모 모임에서 좋은 인연을 만날 확률이 높습니다. 취미 클래스, 독서 모임, 혹은 지인 소개로 천천히 알아가는 인연이 좋아요.'
      }
    },
    '경': {
      male: {
        traits: '당신에게는 부드럽고 포용력 있는 파트너가 맞습니다. 당신의 날카로움을 녹여주고, 따뜻함을 느끼게 해주는 사람이요. 감성적이고 배려 깊은 타입, 당신의 마음을 열게 하는 사람이 맞아요.',
        compatibility: '연인이 MBTI로 F 성향이 강하거나, 목이나 화의 기운을 가진 사람이라면 좋습니다. 당신의 강함 속 여림을 알아보는 사람, 그런 사람과 함께하면 균형잡힙니다.',
        warningTypes: '당신만큼 강해서 매사 부딪히는 사람, 감정 기복이 심한 사람, 그리고 자기주장만 강하고 듣지 않는 사람은 피하세요.',
        whereToMeet: '목표 지향적인 활동에서 좋은 인연을 만날 수 있어요. 스포츠, 투자 모임, 혹은 전문가 네트워킹에서 서로 인정하는 관계가 시작될 거예요.'
      },
      female: {
        traits: '당신에게는 따뜻하고 감성적인 파트너가 맞습니다. 당신의 차가운 면을 녹여주고, 편안함을 느끼게 해주는 사람이요. 표현력이 좋고 공감 능력이 뛰어난 타입, 당신을 이해하려 노력하는 사람이 맞아요.',
        compatibility: '연인이 MBTI로 F 성향이 강하거나, 화나 목의 기운을 가진 사람이라면 좋습니다. 당신의 원칙을 존중하면서도 유연함을 가르쳐주는 사람, 그런 사람과 함께하면 성장합니다.',
        warningTypes: '당신보다 더 완고해서 절대 양보 안 하는 사람, 감정 표현이 전혀 없는 사람, 그리고 신뢰가 안 가는 사람은 피하세요.',
        whereToMeet: '전문성이 인정되는 곳에서 좋은 인연을 만날 확률이 높습니다. 직장, 세미나, 혹은 업무 관련 모임에서 서로 실력을 인정하면서 시작되는 인연이 좋아요.'
      }
    },
    '신': {
      male: {
        traits: '당신에게는 따뜻하고 인정이 많은 파트너가 맞습니다. 당신의 예리함을 부드럽게 감싸주고, 온기를 전해주는 사람이요. 포용력이 크고 감성이 풍부한 타입, 당신의 단단함 속 여림을 알아주는 사람이 맞아요.',
        compatibility: '연인이 MBTI로 F 성향이 강하거나, 화나 수의 기운을 가진 사람이라면 좋습니다. 당신의 장인정신을 인정하고 응원하는 사람, 그런 사람과 함께하면 빛납니다.',
        warningTypes: '디테일을 무시하고 대충 넘어가는 사람, 진정성 없이 겉만 화려한 사람, 그리고 깊이가 없는 사람은 피하세요.',
        whereToMeet: '전문성이 중요한 곳에서 좋은 인연을 만날 수 있어요. 기술 모임, 전문가 커뮤니티, 혹은 같은 분야 세미나에서 서로 인정하는 관계가 될 거예요.'
      },
      female: {
        traits: '당신에게는 든든하고 열정적인 파트너가 맞습니다. 당신을 단련시키고 성장하게 해주는 사람이요. 목표가 뚜렷하고 에너지가 넘치는 타입, 당신과 함께 빛나려는 사람이 맞아요.',
        compatibility: '연인이 MBTI로 T 성향이 강하거나, 화나 수의 기운을 가진 사람이라면 좋습니다. 당신의 섬세함을 사랑하면서 함께 성장하려는 사람, 그런 사람과 함께하면 시너지가 납니다.',
        warningTypes: '게으르고 발전이 없는 사람, 당신을 가볍게 대하는 사람, 그리고 신뢰가 안 가는 사람은 피하세요.',
        whereToMeet: '자기 계발과 관련된 곳에서 좋은 인연을 만날 확률이 높습니다. 운동, 어학, 혹은 전문 스킬을 기르는 모임에서 목표가 비슷한 사람을 만나게 될 거예요.'
      }
    },
    '임': {
      male: {
        traits: '당신에게는 방향감을 잡아주는 파트너가 맞습니다. 당신의 넓은 생각에 구체적인 목표를 더해주는 사람이요. 실행력이 있고 현실감각이 뛰어난 타입, 당신의 꿈을 현실로 만들어줄 사람이 맞아요.',
        compatibility: '연인이 MBTI로 J 성향이 강하거나, 토나 화의 기운을 가진 사람이라면 좋습니다. 당신의 깊이를 사랑하면서 행동으로 이끌어주는 사람, 그런 사람과 함께하면 발전합니다.',
        warningTypes: '당신처럼 흘러가기만 하는 사람, 결정을 못 하고 우유부단한 사람, 그리고 깊이가 없이 가볍기만 한 사람은 피하세요.',
        whereToMeet: '지적인 활동에서 좋은 인연을 만날 수 있어요. 철학 토론, 독서 모임, 혹은 여행 동호회에서 생각이 통하는 사람을 만나게 될 거예요.'
      },
      female: {
        traits: '당신에게는 안정감 있고 신뢰할 수 있는 파트너가 맞습니다. 당신의 자유로움을 이해하면서도 든든한 울타리가 되어주는 사람이요. 포용력이 크고 변하지 않는 타입, 당신이 기댈 수 있는 사람이 맞아요.',
        compatibility: '연인이 MBTI로 S 성향이 강하거나, 토나 금의 기운을 가진 사람이라면 좋습니다. 당신의 지혜를 인정하고 함께 꿈을 키워가는 사람, 그런 사람과 함께하면 행복합니다.',
        warningTypes: '자유를 너무 제한하는 사람, 당신의 생각을 무시하는 사람, 그리고 깊이 없이 표면적인 관계만 원하는 사람은 피하세요.',
        whereToMeet: '넓은 세계와 연결된 곳에서 좋은 인연을 만날 확률이 높습니다. 해외 여행, 국제 행사, 혹은 외국어 스터디에서 시야가 넓은 사람을 만나게 될 거예요.'
      }
    },
    '계': {
      male: {
        traits: '당신에게는 든든하고 안정적인 파트너가 맞습니다. 당신의 섬세한 감성을 담아줄 수 있는 그릇 같은 사람이요. 현실감각이 있고 책임감 있는 타입, 당신이 마음 놓고 기댈 수 있는 사람이 맞아요.',
        compatibility: '연인이 MBTI로 T 성향이 강하거나, 토나 금의 기운을 가진 사람이라면 좋습니다. 당신의 감수성을 사랑하면서 현실적인 지원을 해주는 사람, 그런 사람과 함께하면 균형잡힙니다.',
        warningTypes: '감정적으로 불안정한 사람, 당신의 예민함을 "유난"이라고 치부하는 사람, 그리고 너무 강렬해서 당신을 소진시키는 사람은 피하세요.',
        whereToMeet: '감성적인 활동에서 좋은 인연을 만날 수 있어요. 음악, 미술, 문학 관련 모임에서 영혼이 통하는 사람을 만나게 될 거예요.'
      },
      female: {
        traits: '당신에게는 따뜻하고 표현을 잘하는 파트너가 맞습니다. 당신의 조용한 매력을 알아보고 적극적으로 다가오는 사람이요. 감성이 풍부하고 소통을 중요하게 여기는 타입, 당신과 깊이 교감할 수 있는 사람이 맞아요.',
        compatibility: '연인이 MBTI로 F 성향이 강하거나, 금이나 토의 기운을 가진 사람이라면 좋습니다. 당신의 직관을 존중하고 함께 내면을 탐구하는 사람, 그런 사람과 함께하면 성장합니다.',
        warningTypes: '너무 시끄럽고 정신없는 사람, 감정적 교감 없이 외면만 보는 사람, 그리고 당신을 이해하려는 노력이 없는 사람은 피하세요.',
        whereToMeet: '조용하고 깊이 있는 곳에서 좋은 인연을 만날 확률이 높습니다. 명상 모임, 힐링 관련 활동, 혹은 소규모 감성 모임에서 영혼의 단짝을 만나게 될 거예요.'
      }
    }
  };

  // 기본값 (갑)
  const profile = profiles[dayMaster] || profiles['갑'];
  const baseProfile = profile[gender];

  // 기혼자/이혼자용 추가 조언 (일간별 기본 특성 기반)
  const marriedAdviceMap: Record<string, string> = {
    '갑': '배우자의 유연함을 존중하고, 때로는 물러설 줄 아는 지혜가 필요해요. 당신의 강한 추진력이 때로는 상대를 압도할 수 있습니다.',
    '을': '배우자에게 더 의지해도 괜찮아요. 혼자 감당하려 하지 마시고, 함께 해결하려는 모습이 관계를 깊게 합니다.',
    '병': '배우자에게 관심과 스포트라이트를 나눠주세요. 당신이 빛나는 만큼, 상대도 빛날 기회를 주면 더 좋은 관계가 됩니다.',
    '정': '당신의 헌신이 당연하게 받아들여지지 않도록, 가끔은 솔직하게 표현하세요. 배우자에게 당신의 마음을 전하는 것도 중요해요.',
    '무': '변화와 새로움을 두려워하지 마세요. 배우자가 제안하는 새로운 시도에 열린 마음으로 함께 하면 관계가 더 풍요로워집니다.',
    '기': '완벽하지 않아도 괜찮다는 것을 기억하세요. 배우자의 부족함을 지적하기보다 있는 그대로를 인정해주면 사랑이 깊어집니다.',
    '경': '때로는 날카로운 말 대신 부드러운 표현을 선택해보세요. 옳고 그름보다 관계의 온기가 더 중요할 때가 있습니다.',
    '신': '세세한 것에 얽매이기보다 큰 그림을 보세요. 배우자의 작은 실수보다 전체적인 노력과 마음을 봐주시면 좋겠습니다.',
    '임': '꿈과 이상도 좋지만, 현실적인 가정 문제에도 관심을 기울여주세요. 배우자와 함께 구체적인 계획을 세우면 더욱 든든합니다.',
    '계': '당신의 직관과 감성을 배우자에게 솔직히 표현해보세요. 말하지 않으면 모르는 것들이 있습니다.'
  };

  const conflictAreasMap: Record<string, string> = {
    '갑': '주도권과 결정 과정',
    '을': '의사소통과 감정 표현',
    '병': '관심과 인정받고 싶은 욕구',
    '정': '헌신의 정도와 감사 표현',
    '무': '변화와 안정 사이의 균형',
    '기': '기대치와 완벽주의',
    '경': '의견 충돌과 양보',
    '신': '세부사항과 전체적인 방향',
    '임': '현실적 문제와 이상적 추구',
    '계': '감정 공유와 표현 방식'
  };

  const healingAdviceMap: Record<string, string> = {
    '갑': '새로운 도전이나 운동을 통해 에너지를 발산하세요. 산이나 숲에서 시간을 보내면 마음이 정화됩니다.',
    '을': '가까운 친구들과의 깊은 대화나 글쓰기가 치유에 도움이 됩니다. 작은 식물을 키워보는 것도 좋아요.',
    '병': '새로운 사람들과의 만남, 밝은 곳에서의 활동이 에너지 회복에 좋습니다. 햇살 아래 산책이 추천됩니다.',
    '정': '요리, 수공예 등 손으로 하는 활동이 마음을 안정시켜줍니다. 가까운 사람들과의 따뜻한 교류도 중요해요.',
    '무': '흙을 만지는 활동이나 정원 가꾸기가 치유에 도움이 됩니다. 안정적인 일상 루틴을 만들어보세요.',
    '기': '세밀한 작업이나 정리 정돈 활동이 마음의 안정을 줍니다. 명상이나 요가도 좋습니다.',
    '경': '운동이나 새로운 기술 배우기가 감정 정리에 도움이 됩니다. 목표를 세우고 도전하세요.',
    '신': '공예, 악기 연주 등 집중을 요하는 활동이 좋습니다. 혼자만의 시간을 충분히 가지세요.',
    '임': '여행이나 새로운 배움이 시야를 넓혀줍니다. 물가에서 시간을 보내면 마음이 정화됩니다.',
    '계': '명상, 음악 감상, 예술 활동이 내면을 치유합니다. 조용한 공간에서 자신을 돌아보는 시간이 필요해요.'
  };

  return {
    ...baseProfile,
    marriedAdvice: marriedAdviceMap[dayMaster] || marriedAdviceMap['갑'],
    conflictAreas: conflictAreasMap[dayMaster] || conflictAreasMap['갑'],
    healingAdvice: healingAdviceMap[dayMaster] || healingAdviceMap['갑']
  };
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
 *
 * 음성 선택 가이드:
 * - alloy: 중성적, 균형잡힌 (추천 - 울림 없이 깔끔)
 * - shimmer: 여성적, 따뜻한 (고령자 친화적)
 * - nova: 여성적, 밝은 (약간 울림 있음)
 * - onyx: 남성적, 깊은
 */
/**
 * OpenAI TTS 사용 가능한 음성 목록
 * - alloy: 중성, 균형 잡힌 톤
 * - echo: 남성, 낮고 차분함
 * - fable: 남성, 영국식 표현력
 * - onyx: 남성, 깊고 권위적
 * - nova: 여성, 따뜻하고 친근함 (여성 추천)
 * - shimmer: 여성, 맑고 또렷함 (여성 추천)
 */
export const OPENAI_VOICES = {
  male: ['echo', 'onyx', 'fable', 'alloy'],
  female: ['nova', 'shimmer', 'alloy']
} as const;

export async function generateAudioWithOpenAI(
  text: string,
  apiKey: string,
  voice: string = 'nova' // 기본값: 따뜻한 여성 음성
): Promise<Buffer> {
  const response = await fetch('https://api.openai.com/v1/audio/speech', {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${apiKey}`,
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      model: 'tts-1-hd', // HD 모델 사용 (더 깨끗한 음질, 울림 감소)
      input: text,
      voice: voice,
      response_format: 'mp3',
      speed: 0.95 // 자연스러운 속도 (0.9는 너무 느림)
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
 *
 * 한국어 음성 추천:
 * - ko-KR-Neural2-A: 여성, 자연스럽고 따뜻함 (추천)
 * - ko-KR-Neural2-B: 여성, 차분함
 * - ko-KR-Neural2-C: 남성, 안정감
 * - ko-KR-Wavenet-A/B/C/D: 기존 음성 (약간 기계적)
 */
export async function generateAudioWithGoogle(
  text: string,
  apiKey: string,
  languageCode: string = 'ko-KR',
  voiceName: string = 'ko-KR-Neural2-A' // Neural2로 업그레이드 (더 자연스러움)
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
          speakingRate: 0.85, // 고령자를 위해 더 천천히
          pitch: -1.0, // 약간 낮은 톤 (더 안정감 있음)
          volumeGainDb: 0 // 기본 볼륨 유지
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
 *
 * 한국어 음성 추천:
 * - vdain: 여성, 차분하고 신뢰감 (고령자 추천)
 * - vhyeri: 여성, 밝고 친근함
 * - vyuna: 여성, 부드럽고 따뜻함
 * - vgoeun: 여성, 편안함
 * - nara: 여성, 기본
 */
export async function generateAudioWithNaver(
  text: string,
  clientId: string,
  clientSecret: string,
  speaker: string = 'vdain' // 차분하고 신뢰감 있는 음성으로 변경
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
      speed: '-2', // 고령자를 위해 더 천천히 (-5 ~ 5, 음수가 느림)
      pitch: '-1', // 약간 낮은 톤
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
 * Microsoft Edge TTS를 사용한 음성 생성 (무료, API 키 불필요)
 *
 * 한국어 음성 추천:
 * - ko-KR-SunHiNeural: 여성, 따뜻하고 자연스러움 (추천)
 * - ko-KR-InJoonNeural: 남성, 신뢰감 있음
 * - ko-KR-BongJinNeural: 남성, 차분함
 * - ko-KR-GookMinNeural: 남성, 명확함
 * - ko-KR-JiMinNeural: 여성, 밝고 친근함
 * - ko-KR-SeoHyeonNeural: 여성, 부드러움
 * - ko-KR-SoonBokNeural: 여성, 편안함 (고령자 친화적)
 * - ko-KR-YuJinNeural: 여성, 자연스러움
 */
export async function generateAudioWithEdge(
  text: string,
  voice: string = 'ko-KR-SunHiNeural',
  rate: string = '-10%', // 고령자를 위해 조금 느리게
  pitch: string = '-5Hz', // 약간 낮은 톤
  volume: string = '+0%'
): Promise<Buffer> {
  const fs = await import('fs/promises');
  const path = await import('path');
  const os = await import('os');

  // 임시 파일 경로 생성
  const tempDir = os.tmpdir();
  const tempFilename = `edge-tts-${Date.now()}-${Math.random().toString(36).substring(7)}.mp3`;
  const tempFilePath = path.join(tempDir, tempFilename);

  try {
    const nodeEdgeTTS = await getNodeEdgeTTS();
    const { EdgeTTS } = nodeEdgeTTS;

    // EdgeTTS 인스턴스 생성 (설정은 생성자에 전달)
    const tts = new EdgeTTS({
      voice,
      lang: 'ko-KR',
      rate,
      pitch,
      volume,
      timeout: 60000 // 60초 타임아웃 (긴 텍스트 대비)
    });

    // 텍스트를 음성 파일로 변환
    await tts.ttsPromise(text, tempFilePath);

    // 파일 읽기
    const audioBuffer = await fs.readFile(tempFilePath);

    if (!audioBuffer || audioBuffer.length === 0) {
      throw new Error('오디오 데이터가 생성되지 않았습니다.');
    }

    return audioBuffer;
  } catch (error) {
    throw new Error(`Edge TTS Error: ${error instanceof Error ? error.message : String(error)}`);
  } finally {
    // 임시 파일 정리
    try {
      await fs.unlink(tempFilePath);
    } catch {
      // 파일이 없거나 삭제 실패해도 무시
    }
  }
}

/**
 * Edge TTS 사용 가능한 한국어 음성 목록 반환 (하드코딩)
 * node-edge-tts에는 getVoices 메서드가 없으므로 하드코딩된 목록 사용
 */
export function getEdgeVoices(): any[] {
  // 한국어 음성 목록 (Microsoft Edge TTS 제공)
  return [
    { name: 'ko-KR-SunHiNeural', gender: 'Female', description: '따뜻하고 자연스러움 (추천)' },
    { name: 'ko-KR-InJoonNeural', gender: 'Male', description: '신뢰감 있음' },
    { name: 'ko-KR-BongJinNeural', gender: 'Male', description: '차분함' },
    { name: 'ko-KR-GookMinNeural', gender: 'Male', description: '명확함' },
    { name: 'ko-KR-JiMinNeural', gender: 'Female', description: '밝고 친근함' },
    { name: 'ko-KR-SeoHyeonNeural', gender: 'Female', description: '부드러움' },
    { name: 'ko-KR-SoonBokNeural', gender: 'Female', description: '편안함 (고령자 친화적)' },
    { name: 'ko-KR-YuJinNeural', gender: 'Female', description: '자연스러움' }
  ];
}

/**
 * 사용자 성별에 따른 자동 음성 선택
 * 남성 사용자 → 여성 음성 (더 친근하고 부드러운 느낌)
 * 여성 사용자 → 남성 음성 (신뢰감 있고 안정적인 느낌)
 */
function getAutoVoice(userGender: 'male' | 'female', provider: TTSProvider): string {
  if (provider === 'openai') {
    // OpenAI: 남성 사용자 → nova(여성), 여성 사용자 → onyx(남성)
    return userGender === 'male' ? 'nova' : 'onyx';
  } else if (provider === 'edge') {
    // Edge TTS: 남성 사용자 → SunHiNeural(여성), 여성 사용자 → InJoonNeural(남성)
    return userGender === 'male' ? 'ko-KR-SunHiNeural' : 'ko-KR-InJoonNeural';
  }
  return 'nova'; // 기본값
}

/**
 * 통합 음성 생성 함수
 */
export async function generateSajuAudio(options: AudioGeneratorOptions): Promise<Buffer> {
  const script = generateNarrationScript(options);
  const fullText = narrationToText(script);

  const config = options.config || { provider: 'openai' as TTSProvider };
  const userGender = options.user.gender || 'male';

  // 음성 자동 선택 (voiceId가 명시되지 않은 경우)
  const autoVoice = config.voiceId || getAutoVoice(userGender, config.provider);

  switch (config.provider) {
    case 'edge':
      // Edge TTS - 무료, API 키 불필요 (기본값으로 추천)
      return generateAudioWithEdge(
        fullText,
        autoVoice,
        '-5%', // 속도 (약간 천천히)
        '-3Hz', // 피치 (약간 낮게 - 울림 감소)
        '+0%'   // 볼륨
      );

    case 'openai':
      if (!config.apiKey) throw new Error('OpenAI API key required');
      return generateAudioWithOpenAI(fullText, config.apiKey, autoVoice);

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
  generateAudioWithNaver,
  generateAudioWithEdge,
  getEdgeVoices,
  OPENAI_VOICES
};
