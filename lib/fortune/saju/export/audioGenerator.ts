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
 */
export function generateNarrationScript(options: AudioGeneratorOptions): NarrationScript {
  const { user, saju, oheng, yongsin, gisin, premium, targetYear = 2026 } = options;
  const sections: NarrationSection[] = [];

  // 기본 정보 추출
  const dayMaster = saju.day?.stemKorean || '갑';
  const primaryYongsin = yongsin?.[0] || 'wood';
  const zodiac = saju.year?.zodiac || '';
  const age = calculateKoreanAge(user.birthDate);
  const lifeStage = getLifeStage(age);

  // ========== 1. 오프닝 ==========
  const birthTimeKorean = formatTimeToNaturalKorean(user.birthTime);
  sections.push({
    title: '오프닝',
    content: `${user.name}님, 안녕하세요. ` +
             `지금부터 당신만을 위한 특별한 이야기를 들려드릴게요. ` +
             `이 이야기는 당신의 생년월일, 사주, 그리고 타고난 기운을 바탕으로 만들어졌습니다. ` +
             `편안하게 귀 기울여 주세요.`,
    pauseAfter: 2000
  });

  // ========== 2. 프로필 소개 ==========
  const formattedDate = user.birthDate.replace(/-/g, '년 ').replace(/년 (\d+)$/, '월 $1일');
  sections.push({
    title: '프로필',
    content: `${user.name}님은 ${formattedDate}, ${birthTimeKorean}에 태어나셨어요. ` +
             `${zodiac}띠이시고, 올해로 ${age}세가 되셨네요. ` +
             `${age}세라면 인생에서 "${lifeStage.theme}"의 시기입니다. ${lifeStage.advice}`,
    pauseAfter: 2000
  });

  // ========== 3. 본질 카드 - 나는 누구인가 ==========
  const essenceCard = ESSENCE_CARD_STORIES[dayMaster] || ESSENCE_CARD_STORIES['갑'];
  sections.push({
    title: '본질 카드',
    content: `먼저, 당신이 어떤 사람인지 이야기해 볼게요. ` +
             `당신을 꽃에 비유하면 "${essenceCard.flower}"입니다. ` +
             `${essenceCard.story} ` +
             `이게 바로 당신의 타고난 본질이에요. 부정하지 마세요. 그게 당신의 힘입니다.`,
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

  // ========== 7. 빛나는 환경 vs 피해야 할 환경 ==========
  sections.push({
    title: '환경 분석',
    content: `당신이 어디서 가장 빛나는지 말씀드릴게요. ` +
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

  // ========== 13. 클로징 ==========
  sections.push({
    title: '마무리',
    content: `${user.name}님, 긴 이야기 끝까지 들어주셔서 감사합니다. ` +
             `오늘 들은 이야기 중에 "아, 이건 정말 나네" 하고 고개를 끄덕인 부분이 있으셨을 거예요. ` +
             `그 느낌을 기억해주세요. 그게 당신을 이해하는 첫걸음입니다. ` +
             `운명은 정해진 게 아니라, 알고 대비하면 바꿀 수 있습니다. ` +
             `이 분석이 당신의 인생에 작은 나침반이 되기를 바랍니다. ` +
             `${user.name}님의 앞날에 좋은 일만 가득하기를 진심으로 기원합니다.`,
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
 *
 * 음성 선택 가이드:
 * - alloy: 중성적, 균형잡힌 (추천 - 울림 없이 깔끔)
 * - shimmer: 여성적, 따뜻한 (고령자 친화적)
 * - nova: 여성적, 밝은 (약간 울림 있음)
 * - onyx: 남성적, 깊은
 */
export async function generateAudioWithOpenAI(
  text: string,
  apiKey: string,
  voice: string = 'shimmer' // 울림 없이 따뜻한 음성으로 변경
): Promise<Buffer> {
  const response = await fetch('https://api.openai.com/v1/audio/speech', {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${apiKey}`,
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      model: 'tts-1', // HD 대신 기본 모델 사용 (울림 감소, 더 자연스러움)
      input: text,
      voice: voice,
      response_format: 'mp3',
      speed: 0.9 // 고령자를 위해 조금 더 천천히
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
  try {
    const nodeEdgeTTS = await getNodeEdgeTTS();
    const { EdgeTTS } = nodeEdgeTTS;

    // EdgeTTS 인스턴스 생성
    const tts = new EdgeTTS();

    // 텍스트를 음성으로 변환
    const audioData = await tts.ttsPromise(text, {
      voice,
      rate,
      pitch,
      volume
    });

    if (!audioData || audioData.length === 0) {
      throw new Error('오디오 데이터가 생성되지 않았습니다.');
    }

    return Buffer.from(audioData);
  } catch (error) {
    throw new Error(`Edge TTS Error: ${error instanceof Error ? error.message : String(error)}`);
  }
}

/**
 * Edge TTS 사용 가능한 음성 목록 조회
 */
export async function getEdgeVoices(): Promise<any[]> {
  try {
    const nodeEdgeTTS = await getNodeEdgeTTS();
    const { EdgeTTS } = nodeEdgeTTS;

    const tts = new EdgeTTS();
    const allVoices = await tts.getVoices();

    // 한국어 음성만 필터링
    return allVoices.filter((v: any) => v.Locale?.startsWith('ko-KR') || v.locale?.startsWith('ko-KR'));
  } catch (error) {
    console.error('Edge TTS voices error:', error);
    return [];
  }
}

/**
 * 통합 음성 생성 함수
 */
export async function generateSajuAudio(options: AudioGeneratorOptions): Promise<Buffer> {
  const script = generateNarrationScript(options);
  const fullText = narrationToText(script);

  const config = options.config || { provider: 'openai' as TTSProvider };

  switch (config.provider) {
    case 'edge':
      // Edge TTS - 무료, API 키 불필요 (기본값으로 추천)
      return generateAudioWithEdge(
        fullText,
        config.voiceId || 'ko-KR-SunHiNeural',
        '-10%', // 속도
        '-5Hz', // 피치
        '+0%'   // 볼륨
      );

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
  generateAudioWithNaver,
  generateAudioWithEdge,
  getEdgeVoices
};
