/**
 * 별자리 스토리텔링 - 신화와 운명의 이야기
 */

import { ZodiacSign, ZODIAC_DATA } from './types';

// 별자리별 신화 스토리
export const ZODIAC_MYTHOLOGY: Record<ZodiacSign, {
  title: string;
  story: string;
  deity: string;
  blessing: string;
  destinyPath: string;
}> = {
  aries: {
    title: '황금 양의 전설',
    story: '그리스 신화 속 황금 양은 헬레와 프릭소스 남매를 구해 하늘로 올랐습니다. 이 용감한 양처럼, 당신에게는 위기의 순간에 빛나는 영웅의 기질이 흐르고 있습니다.',
    deity: '전쟁의 신 아레스',
    blessing: '불굴의 용기와 개척 정신',
    destinyPath: '당신은 새로운 길을 여는 선구자입니다. 남들이 두려워하는 곳에서 당신의 빛이 가장 밝게 빛납니다.',
  },
  taurus: {
    title: '제우스의 변신',
    story: '제우스는 아름다운 에우로페를 만나기 위해 순백의 황소로 변신했습니다. 당신 안에는 그 신성한 황소의 고귀함과 헌신적인 사랑이 깃들어 있습니다.',
    deity: '미의 여신 아프로디테',
    blessing: '풍요와 아름다움을 끌어당기는 힘',
    destinyPath: '당신은 세상의 아름다움을 발견하고 지키는 수호자입니다. 느리지만 확실하게, 당신만의 낙원을 만들어갑니다.',
  },
  gemini: {
    title: '쌍둥이 별의 우정',
    story: '카스토르와 폴룩스, 하늘의 쌍둥이 형제는 영원히 함께하기 위해 별이 되었습니다. 당신에게는 그들처럼 깊은 유대와 소통의 재능이 있습니다.',
    deity: '전령의 신 헤르메스',
    blessing: '말과 글로 세상을 연결하는 힘',
    destinyPath: '당신은 다리를 놓는 사람입니다. 서로 다른 세계를 연결하고, 이해의 언어로 사람들을 하나로 모읍니다.',
  },
  cancer: {
    title: '헤라클레스와 게',
    story: '여신 헤라가 보낸 게는 영웅 헤라클레스에게 도전했습니다. 비록 작은 존재였지만 사랑하는 이를 위해 용감히 맞섰던 그 마음이 당신 안에 있습니다.',
    deity: '달의 여신 셀레네',
    blessing: '깊은 직관과 모성애의 보호막',
    destinyPath: '당신은 감정의 바다를 항해하는 선장입니다. 당신의 직관은 폭풍 속에서도 안전한 항구를 찾아냅니다.',
  },
  leo: {
    title: '네메아의 사자',
    story: '하늘의 사자는 어떤 무기로도 상처받지 않는 존재였습니다. 당신 안에는 그 무적의 사자처럼 꺾이지 않는 자존심과 왕의 기품이 있습니다.',
    deity: '태양신 아폴론',
    blessing: '빛나는 카리스마와 창조의 불꽃',
    destinyPath: '당신은 태어난 순간부터 무대의 중심에 서도록 운명 지어졌습니다. 당신의 빛은 주변을 따뜻하게 비춥니다.',
  },
  virgo: {
    title: '별이 된 정의의 여신',
    story: '아스트라이아는 인간 세상이 타락했을 때도 끝까지 남아있던 순수의 여신입니다. 당신에게는 그녀의 고결함과 완벽을 향한 열망이 흐릅니다.',
    deity: '지혜의 여신 아테나',
    blessing: '세밀한 분석력과 봉사의 마음',
    destinyPath: '당신은 혼란 속에서 질서를 만드는 사람입니다. 보이지 않는 곳에서 세상을 더 나은 곳으로 만들어갑니다.',
  },
  libra: {
    title: '정의의 저울',
    story: '올림포스의 저울은 인간의 영혼을 달아 진실을 밝힙니다. 당신에게는 균형과 조화를 향한 깊은 갈망이 있습니다.',
    deity: '미와 사랑의 아프로디테',
    blessing: '아름다움을 알아보고 조화를 만드는 힘',
    destinyPath: '당신은 세상의 균형을 잡는 중재자입니다. 갈등 속에서 평화를, 불협화음 속에서 화음을 찾아냅니다.',
  },
  scorpio: {
    title: '오리온을 쓰러뜨린 전갈',
    story: '거만한 사냥꾼 오리온을 물리친 전갈은 겸손의 중요성을 가르쳤습니다. 당신에게는 그 깊은 통찰력과 숨겨진 진실을 찾는 힘이 있습니다.',
    deity: '저승의 신 하데스',
    blessing: '재생과 변화의 신비로운 힘',
    destinyPath: '당신은 어둠 속에서 빛을 찾는 연금술사입니다. 죽음과 재생의 순환을 통해 더 강해집니다.',
  },
  sagittarius: {
    title: '현자 케이론의 활',
    story: '케이론은 신들의 스승이자 치유자였습니다. 반인반마의 현자처럼, 당신에게는 지혜를 탐구하고 나누는 고귀한 사명이 있습니다.',
    deity: '번개의 왕 제우스',
    blessing: '끝없는 지적 호기심과 모험 정신',
    destinyPath: '당신은 진리를 향해 화살을 쏘는 궁수입니다. 지평선 너머의 새로운 세계가 당신을 부릅니다.',
  },
  capricorn: {
    title: '판 신의 변신',
    story: '목신 판은 괴물 티폰을 피해 물고기 꼬리를 가진 염소로 변했습니다. 당신에게는 어떤 상황에서도 살아남는 놀라운 적응력이 있습니다.',
    deity: '시간의 신 크로노스',
    blessing: '인내와 성취를 향한 불굴의 의지',
    destinyPath: '당신은 정상을 향해 오르는 산악인입니다. 한 걸음씩, 반드시 목표를 이룹니다.',
  },
  aquarius: {
    title: '신들의 술 따르는 소년',
    story: '가니메데스는 아름다움으로 제우스의 눈에 띄어 신들의 잔에 물을 따르는 영예를 얻었습니다. 당신에게는 인류에게 지혜를 나누는 사명이 있습니다.',
    deity: '하늘의 신 우라노스',
    blessing: '혁신과 인류애의 비전',
    destinyPath: '당신은 미래에서 온 사람입니다. 남들이 보지 못하는 가능성을 보고, 세상을 바꿉니다.',
  },
  pisces: {
    title: '아프로디테와 에로스의 피신',
    story: '괴물 티폰을 피해 여신 아프로디테와 에로스는 물고기로 변해 강을 건넜습니다. 당신에게는 사랑과 희생의 깊은 정신이 흐릅니다.',
    deity: '바다의 신 포세이돈',
    blessing: '무한한 상상력과 영적 감수성',
    destinyPath: '당신은 꿈과 현실의 경계를 넘나드는 몽상가입니다. 예술과 영성으로 세상을 치유합니다.',
  },
};

// 오늘의 운세 스토리 템플릿
export const DAILY_STORY_TEMPLATES = {
  excellent: [
    '오늘 별들이 당신을 위해 특별히 정렬했습니다. {sign}인 당신에게 우주가 미소 짓는 날입니다.',
    '하늘의 별빛이 당신의 길을 환하게 비춥니다. 오늘은 {sign}의 행운이 빛나는 날입니다.',
    '{sign}의 수호성이 가장 밝게 빛나는 오늘, 당신이 원하는 것을 향해 과감히 나아가세요.',
  ],
  good: [
    '별자리의 기운이 당신을 감싸고 있습니다. {sign}의 당신에게 좋은 기운이 흐르는 하루입니다.',
    '우주의 리듬이 당신과 조화를 이룹니다. 오늘 {sign}인 당신은 자연스러운 흐름을 탈 수 있습니다.',
    '수호성의 가호 아래, {sign}인 당신의 노력이 결실을 맺기 시작합니다.',
  ],
  average: [
    '별들이 균형을 이루는 날입니다. {sign}인 당신은 오늘 내면의 목소리에 귀 기울여보세요.',
    '우주가 당신에게 잠시 멈춤의 시간을 선물합니다. 성찰과 준비의 하루가 될 것입니다.',
    '{sign}의 기운이 재충전되는 시간입니다. 급하게 서두르지 말고 여유를 가지세요.',
  ],
  challenging: [
    '별들이 당신에게 시련을 통한 성장의 기회를 줍니다. {sign}의 용기로 이겨내세요.',
    '우주가 당신의 진정한 힘을 시험하는 날입니다. 도전 속에서 {sign}의 진가가 드러납니다.',
    '어둠이 짙을수록 별은 더 밝게 빛납니다. 오늘의 역경은 내일의 {sign}를 더 강하게 만듭니다.',
  ],
};

// 사랑 운세 스토리
export const LOVE_STORY_TEMPLATES: Record<string, string[]> = {
  excellent: [
    '금성이 당신의 사랑의 집을 밝히고 있습니다. 특별한 만남이나 깊어지는 감정이 예상됩니다.',
    '사랑의 여신 아프로디테가 미소 짓습니다. 당신의 매력이 빛을 발하는 날입니다.',
    '심장을 두근거리게 하는 순간이 찾아올 것입니다. 마음을 열어두세요.',
  ],
  good: [
    '따뜻한 감정의 교류가 있는 하루입니다. 소소한 대화에서 사랑을 느낄 수 있습니다.',
    '인연의 실이 조금씩 당겨지고 있습니다. 주변을 둘러보세요.',
    '달빛처럼 은은하지만 확실한 애정의 신호가 옵니다.',
  ],
  average: [
    '사랑의 에너지가 내면을 향합니다. 자기 자신을 사랑하는 시간이 필요합니다.',
    '관계의 안정기입니다. 화려하진 않지만 편안함이 있습니다.',
    '지금은 사랑보다 자신을 돌볼 때입니다.',
  ],
  challenging: [
    '오해나 감정의 엇갈림이 있을 수 있습니다. 대화로 풀어가세요.',
    '사랑에도 겨울은 필요합니다. 이 시간이 지나면 봄이 옵니다.',
    '인내심이 필요한 시기입니다. 서두르지 마세요.',
  ],
};

// 재물 운세 스토리
export const MONEY_STORY_TEMPLATES: Record<string, string[]> = {
  excellent: [
    '풍요의 뿔 코르누코피아가 당신에게 향합니다. 예상치 못한 행운이 찾아올 수 있습니다.',
    '목성의 축복이 당신의 재정을 비춥니다. 과감한 투자나 결정에 좋은 날입니다.',
    '황금빛 기운이 당신을 감쌉니다. 금전적 좋은 소식이 있을 것입니다.',
  ],
  good: [
    '안정적인 재정 흐름이 예상됩니다. 계획대로 진행하세요.',
    '작지만 확실한 이득이 있는 날입니다. 감사하는 마음이 더 큰 복을 부릅니다.',
    '노력한 만큼의 보상이 돌아옵니다.',
  ],
  average: [
    '지출을 점검하기 좋은 날입니다. 불필요한 소비를 줄여보세요.',
    '재정의 균형을 맞추는 시간입니다. 큰 결정은 미루세요.',
    '현재에 만족하며 미래를 준비하는 하루입니다.',
  ],
  challenging: [
    '지갑을 닫아두는 것이 좋습니다. 충동구매를 조심하세요.',
    '재정적 압박을 느낄 수 있지만, 지혜롭게 대처하면 괜찮습니다.',
    '투자나 큰 결정은 다음 기회를 기다리세요.',
  ],
};

// 운세 레벨 결정
export function getFortuneLevel(score: number): 'excellent' | 'good' | 'average' | 'challenging' {
  if (score >= 85) return 'excellent';
  if (score >= 70) return 'good';
  if (score >= 55) return 'average';
  return 'challenging';
}

// 오늘의 스토리 생성
export function generateDailyStory(sign: ZodiacSign, score: number): string {
  const level = getFortuneLevel(score);
  const templates = DAILY_STORY_TEMPLATES[level];
  const signKorean = ZODIAC_DATA[sign].korean;

  // 날짜 기반 일관된 선택
  const today = new Date();
  const index = (today.getDate() + Object.keys(ZODIAC_DATA).indexOf(sign)) % templates.length;

  return templates[index].replace('{sign}', signKorean);
}

// 사랑 스토리 생성
export function generateLoveStory(score: number): string {
  const level = getFortuneLevel(score);
  const templates = LOVE_STORY_TEMPLATES[level];
  const today = new Date();
  const index = today.getDate() % templates.length;
  return templates[index];
}

// 재물 스토리 생성
export function generateMoneyStory(score: number): string {
  const level = getFortuneLevel(score);
  const templates = MONEY_STORY_TEMPLATES[level];
  const today = new Date();
  const index = (today.getDate() + 7) % templates.length;
  return templates[index];
}

// 성격 서사 생성
export function generatePersonalityNarrative(sign: ZodiacSign): string {
  const myth = ZODIAC_MYTHOLOGY[sign];
  const info = ZODIAC_DATA[sign];

  return `
${myth.title}의 별 아래 태어난 당신.

${myth.story}

${info.element === 'fire' ? '불의 원소가 당신의 가슴 속에 타오릅니다. 열정과 용기가 당신의 본질입니다.' : ''}
${info.element === 'earth' ? '대지의 원소가 당신에게 안정과 풍요를 선물합니다. 현실적이고 신뢰할 수 있는 존재입니다.' : ''}
${info.element === 'air' ? '바람의 원소가 당신의 생각을 자유롭게 합니다. 지성과 소통이 당신의 무기입니다.' : ''}
${info.element === 'water' ? '물의 원소가 당신의 감정을 깊게 합니다. 직관과 공감 능력이 당신의 선물입니다.' : ''}

${myth.deity}의 가호 아래, 당신은 "${myth.blessing}"을(를) 타고났습니다.

${myth.destinyPath}
  `.trim();
}

// 궁합 스토리 생성
export function generateCompatibilityStory(
  sign1: ZodiacSign,
  sign2: ZodiacSign,
  score: number
): string {
  const info1 = ZODIAC_DATA[sign1];
  const info2 = ZODIAC_DATA[sign2];
  const myth1 = ZODIAC_MYTHOLOGY[sign1];
  const myth2 = ZODIAC_MYTHOLOGY[sign2];

  let elementStory = '';

  if (info1.element === info2.element) {
    elementStory = `같은 ${info1.element === 'fire' ? '불' : info1.element === 'earth' ? '대지' : info1.element === 'air' ? '바람' : '물'}의 원소를 공유하는 두 영혼. 서로를 거울처럼 비추며 깊은 이해로 연결됩니다.`;
  } else if (
    (info1.element === 'fire' && info2.element === 'air') ||
    (info1.element === 'air' && info2.element === 'fire')
  ) {
    elementStory = '불과 바람이 만났습니다. 바람은 불을 더 크게 타오르게 하고, 불은 바람에 열정을 더합니다. 서로를 고양시키는 역동적인 조합입니다.';
  } else if (
    (info1.element === 'earth' && info2.element === 'water') ||
    (info1.element === 'water' && info2.element === 'earth')
  ) {
    elementStory = '대지와 물이 만났습니다. 물은 대지를 비옥하게 하고, 대지는 물에게 형태를 줍니다. 자연스러운 풍요와 성장의 조합입니다.';
  } else if (
    (info1.element === 'fire' && info2.element === 'water') ||
    (info1.element === 'water' && info2.element === 'fire')
  ) {
    elementStory = '불과 물의 만남. 충돌할 수 있지만, 그 긴장 속에서 놀라운 균형을 찾으면 증기처럼 강력한 힘이 됩니다.';
  } else {
    elementStory = '서로 다른 원소의 만남은 배움의 기회입니다. 다름을 인정할 때 더 넓은 세계가 열립니다.';
  }

  let scoreStory = '';
  if (score >= 85) {
    scoreStory = '별들이 축복하는 인연입니다. 마치 하늘이 정해준 것처럼, 두 영혼이 자연스럽게 조화를 이룹니다.';
  } else if (score >= 70) {
    scoreStory = '좋은 기운이 흐르는 관계입니다. 약간의 노력으로 더 깊은 유대를 만들 수 있습니다.';
  } else if (score >= 55) {
    scoreStory = '서로에게 배울 점이 많은 관계입니다. 이해와 인내가 열쇠입니다.';
  } else {
    scoreStory = '도전적인 조합이지만, 그래서 더 크게 성장할 수 있습니다. 차이를 포용하세요.';
  }

  return `
${info1.korean}(${info1.symbol})과 ${info2.korean}(${info2.symbol})의 만남

${elementStory}

${myth1.deity}의 아이와 ${myth2.deity}의 아이가 만났을 때,
"${myth1.blessing}"과 "${myth2.blessing}"이 교차합니다.

${scoreStory}

이 관계의 비밀: 서로의 빛과 그림자를 모두 품을 때, 진정한 조화가 시작됩니다.
  `.trim();
}

// 오늘의 메시지 생성
export function generateTodayMessage(sign: ZodiacSign): string {
  const myth = ZODIAC_MYTHOLOGY[sign];
  const today = new Date();
  const dayOfWeek = today.getDay();

  const messages = [
    `오늘 ${myth.deity}의 기운이 당신과 함께합니다. 두려움 없이 나아가세요.`,
    `별들이 속삭입니다. "${myth.blessing}"을(를) 믿으세요.`,
    `${myth.title}의 용기가 필요한 날입니다. 당신은 할 수 있습니다.`,
    `우주가 당신의 편입니다. 당신의 직관을 따르세요.`,
    `오늘은 ${myth.destinyPath.slice(0, 20)}... 그 길을 걸어가는 날입니다.`,
    `하늘의 별빛이 당신의 결정을 비춥니다. 명확하게 보일 것입니다.`,
    `쉬어가도 괜찮습니다. 별도 밤에는 쉬어가며 빛납니다.`,
  ];

  const index = (dayOfWeek + Object.keys(ZODIAC_DATA).indexOf(sign)) % messages.length;
  return messages[index];
}
