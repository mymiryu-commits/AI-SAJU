/**
 * 칼 융 원형 이론 + 일간 매핑
 *
 * 12가지 원형을 사주 일간과 연결하여
 * 깊이 있는 성격 분석과 스토리텔링 제공
 */

// 융 원형 타입
export type JungianArchetype =
  | 'hero'          // 영웅 - 용기, 도전
  | 'caregiver'     // 돌봄이 - 보살핌, 희생
  | 'explorer'      // 탐험가 - 자유, 발견
  | 'rebel'         // 반항아 - 혁명, 변화
  | 'lover'         // 연인 - 열정, 친밀감
  | 'creator'       // 창조자 - 상상력, 예술
  | 'jester'        // 광대 - 유머, 즐거움
  | 'sage'          // 현자 - 지혜, 진리
  | 'magician'      // 마법사 - 변환, 비전
  | 'ruler'         // 통치자 - 통제, 리더십
  | 'innocent'      // 순수한 자 - 낙관, 신뢰
  | 'everyman';     // 평범한 사람 - 소속감, 공감

// 원형 상세 정보
export interface ArchetypeInfo {
  type: JungianArchetype;
  korean: string;
  symbol: string;
  coreDesire: string;          // 핵심 욕구
  greatestFear: string;        // 가장 큰 두려움
  talent: string;              // 재능
  weakness: string;            // 약점
  motivation: string;          // 동기
  strategy: string;            // 전략
  shadowSide: string;          // 그림자 측면
  transformationPath: string;  // 성장 경로

  // 스토리텔링 요소
  metaphor: string;            // 은유
  openingLine: string;         // 시작 문장
  closingLine: string;         // 마무리 문장
  destinyPhrase: string;       // 운명 문구
}

// 일간별 원형 매핑
export const DAYMASTER_ARCHETYPE: Record<string, JungianArchetype> = {
  '갑': 'hero',        // 갑목 - 영웅 (개척, 선구자)
  '을': 'explorer',    // 을목 - 탐험가 (적응, 유연)
  '병': 'ruler',       // 병화 - 통치자 (빛, 영향력)
  '정': 'lover',       // 정화 - 연인 (따뜻함, 섬세함)
  '무': 'caregiver',   // 무토 - 돌봄이 (안정, 포용)
  '기': 'everyman',    // 기토 - 평범한 사람 (연결, 실용)
  '경': 'rebel',       // 경금 - 반항아 (변화, 결단)
  '신': 'creator',     // 신금 - 창조자 (섬세함, 예술)
  '임': 'sage',        // 임수 - 현자 (지혜, 깊이)
  '계': 'magician'     // 계수 - 마법사 (직관, 변환)
};

// 원형 상세 데이터
export const ARCHETYPE_INFO: Record<JungianArchetype, ArchetypeInfo> = {
  hero: {
    type: 'hero',
    korean: '영웅',
    symbol: '불을 든 손',
    coreDesire: '가치 있는 것을 증명하고 싶다',
    greatestFear: '나약해지거나 겁쟁이가 되는 것',
    talent: '용기, 능력, 결단력',
    weakness: '오만함, 적을 항상 찾는 것',
    motivation: '세상을 더 나은 곳으로 만들기',
    strategy: '힘을 기르고 유능해지기',
    shadowSide: '무자비함, 집착',
    transformationPath: '힘보다 지혜를, 승리보다 평화를 배우기',

    metaphor: '새벽 숲의 첫 번째 나무',
    openingLine: '당신 안에는 개척자의 영혼이 있습니다.',
    closingLine: '혼자 앞서가는 것이 외로워도, 당신 뒤에 숲이 자랍니다.',
    destinyPhrase: '길을 여는 자, 숲을 시작하는 첫 나무'
  },

  explorer: {
    type: 'explorer',
    korean: '탐험가',
    symbol: '나침반',
    coreDesire: '자유롭게 세상을 경험하고 싶다',
    greatestFear: '갇히거나 속박당하는 것',
    talent: '자율성, 야망, 충실함',
    weakness: '무목적 방황, 소외',
    motivation: '더 진정성 있고 충만한 삶',
    strategy: '여행하고, 새로운 것을 찾고, 일상을 탈출하기',
    shadowSide: '영원한 방황자, 뿌리 없음',
    transformationPath: '외부 탐험에서 내면 탐험으로',

    metaphor: '바람에 흔들리는 버드나무',
    openingLine: '당신은 어디든 갈 수 있는 자유로운 영혼입니다.',
    closingLine: '바람처럼 유연하게, 하지만 뿌리는 잊지 마세요.',
    destinyPhrase: '바람을 타는 자, 어디서든 뿌리내리는 나무'
  },

  ruler: {
    type: 'ruler',
    korean: '통치자',
    symbol: '왕관',
    coreDesire: '통제하고 영향력을 갖고 싶다',
    greatestFear: '혼란, 권력 상실',
    talent: '책임감, 리더십',
    weakness: '독재적 성향, 통제 불능에 대한 두려움',
    motivation: '번영하고 성공적인 커뮤니티 만들기',
    strategy: '리더십과 권력 행사',
    shadowSide: '폭군, 권력 남용',
    transformationPath: '지배에서 봉사로',

    metaphor: '정오의 태양',
    openingLine: '당신은 주변을 밝히는 태양과 같은 존재입니다.',
    closingLine: '빛이 강할수록 그림자도 깊습니다. 겸손이 당신의 무기입니다.',
    destinyPhrase: '빛을 나누는 자, 모두를 비추는 태양'
  },

  lover: {
    type: 'lover',
    korean: '연인',
    symbol: '장미',
    coreDesire: '친밀함과 경험을 원한다',
    greatestFear: '혼자 남겨지는 것, 사랑받지 못하는 것',
    talent: '열정, 감사, 헌신',
    weakness: '맹목적 사랑, 정체성 상실',
    motivation: '사랑하는 사람/일/환경과 함께하기',
    strategy: '매력적이 되고 친밀해지기',
    shadowSide: '질투, 집착',
    transformationPath: '소유에서 나눔으로',

    metaphor: '가느다란 촛불',
    openingLine: '당신은 따뜻함 그 자체입니다.',
    closingLine: '당신의 불꽃은 작아 보여도, 누군가의 어둠을 밝힙니다.',
    destinyPhrase: '어둠을 밝히는 자, 따뜻함을 나누는 촛불'
  },

  caregiver: {
    type: 'caregiver',
    korean: '돌봄이',
    symbol: '품에 안은 손',
    coreDesire: '다른 사람을 보호하고 돌보고 싶다',
    greatestFear: '이기심, 배은망덕',
    talent: '동정심, 관대함',
    weakness: '순교자 심리, 착취당함',
    motivation: '다른 사람을 돕기',
    strategy: '다른 사람을 위해 일하기',
    shadowSide: '자기희생, 통제욕',
    transformationPath: '타인 돌봄에서 자기 돌봄으로',

    metaphor: '넓은 대지',
    openingLine: '당신은 누구나 쉬어갈 수 있는 넓은 대지입니다.',
    closingLine: '대지도 가끔은 쉬어야 합니다. 자신도 돌보세요.',
    destinyPhrase: '품어주는 자, 모두의 쉼터가 되는 대지'
  },

  everyman: {
    type: 'everyman',
    korean: '평범한 사람',
    symbol: '손을 맞잡은 모습',
    coreDesire: '소속되고 연결되고 싶다',
    greatestFear: '소외되거나 튀어 보이는 것',
    talent: '현실감, 공감, 진실함',
    weakness: '자신을 잃어버림, 순응',
    motivation: '소속되기',
    strategy: '평범한 미덕 개발',
    shadowSide: '무개성, 눈에 띄지 않음',
    transformationPath: '순응에서 진정성으로',

    metaphor: '비옥한 텃밭',
    openingLine: '당신은 모든 것이 자라날 수 있는 기름진 땅입니다.',
    closingLine: '평범해 보여도, 당신 없이는 아무것도 자라지 않습니다.',
    destinyPhrase: '연결하는 자, 모두를 이어주는 다리'
  },

  rebel: {
    type: 'rebel',
    korean: '반항아',
    symbol: '부러진 사슬',
    coreDesire: '혁명, 복수, 변화',
    greatestFear: '무력함, 비효율성',
    talent: '급진적 자유, 분노의 에너지',
    weakness: '어둠에 빠지기, 범죄',
    motivation: '작동하지 않는 것을 파괴하기',
    strategy: '뒤집고, 부수고, 충격주기',
    shadowSide: '파괴성, 무모함',
    transformationPath: '파괴에서 재건으로',

    metaphor: '벼락을 맞아도 서 있는 바위',
    openingLine: '당신은 세상을 바꿀 수 있는 힘을 가졌습니다.',
    closingLine: '부수는 것만큼 다시 세우는 것도 용기입니다.',
    destinyPhrase: '바꾸는 자, 낡은 것을 새롭게 하는 불꽃'
  },

  creator: {
    type: 'creator',
    korean: '창조자',
    symbol: '붓',
    coreDesire: '영원한 가치를 창조하고 싶다',
    greatestFear: '평범하거나 무의미한 비전',
    talent: '창의성, 상상력',
    weakness: '완벽주의, 실행력 부족',
    motivation: '비전을 실현하기',
    strategy: '예술적 통제력 개발',
    shadowSide: '과도한 드라마, 비현실성',
    transformationPath: '머릿속 비전을 현실로',

    metaphor: '달빛 아래 피어나는 야생화',
    openingLine: '당신 안에는 세상에 없던 아름다움이 있습니다.',
    closingLine: '완벽하지 않아도 피어나세요. 야생화는 그래서 아름답습니다.',
    destinyPhrase: '빚어내는 자, 없던 것을 만들어내는 예술가'
  },

  sage: {
    type: 'sage',
    korean: '현자',
    symbol: '책',
    coreDesire: '진리와 이해를 찾고 싶다',
    greatestFear: '속거나 무지에 빠지는 것',
    talent: '지혜, 지성',
    weakness: '행동 없이 생각만, 냉소',
    motivation: '세상을 이해하기',
    strategy: '정보와 지식 추구',
    shadowSide: '교만, 비실용성',
    transformationPath: '지식에서 지혜로',

    metaphor: '깊은 바다',
    openingLine: '당신은 표면 아래 깊은 진실을 아는 사람입니다.',
    closingLine: '깊이만큼 표현도 필요합니다. 지혜를 나누세요.',
    destinyPhrase: '아는 자, 깊이에서 진리를 길어 올리는 현자'
  },

  magician: {
    type: 'magician',
    korean: '마법사',
    symbol: '수정구',
    coreDesire: '우주의 법칙을 이해하고 싶다',
    greatestFear: '의도치 않은 부정적 결과',
    talent: '변환, 비전 발견',
    weakness: '조종, 속임수',
    motivation: '꿈을 현실로',
    strategy: '비전을 개발하고 살아가기',
    shadowSide: '조종, 흑마법',
    transformationPath: '개인 이익에서 공동 선으로',

    metaphor: '안개 속 등대',
    openingLine: '당신은 보이지 않는 것을 보는 눈을 가졌습니다.',
    closingLine: '직관을 믿으세요. 그것이 당신의 마법입니다.',
    destinyPhrase: '변환하는 자, 불가능을 가능으로 바꾸는 마법사'
  },

  innocent: {
    type: 'innocent',
    korean: '순수한 자',
    symbol: '흰 깃털',
    coreDesire: '행복을 느끼고 싶다',
    greatestFear: '벌받거나 나쁜 일을 하는 것',
    talent: '믿음, 낙관',
    weakness: '순진함, 부정',
    motivation: '행복해지기',
    strategy: '바른 일하기',
    shadowSide: '순진함 이용당함',
    transformationPath: '순수함에서 지혜로운 낙관으로',

    metaphor: '봄의 새싹',
    openingLine: '당신은 세상을 밝게 보는 귀한 시선을 가졌습니다.',
    closingLine: '순수함을 지키되, 세상의 복잡함도 이해하세요.',
    destinyPhrase: '믿는 자, 어둠 속에서도 빛을 보는 희망'
  },

  jester: {
    type: 'jester',
    korean: '광대',
    symbol: '종',
    coreDesire: '현재를 즐기고 싶다',
    greatestFear: '지루하거나 다른 사람을 지루하게 하는 것',
    talent: '기쁨, 유머',
    weakness: '경박함, 시간 낭비',
    motivation: '좋은 시간 보내기',
    strategy: '놀고, 농담하고, 재미있게',
    shadowSide: '무책임, 잔인한 유머',
    transformationPath: '표면적 재미에서 깊은 기쁨으로',

    metaphor: '무지개',
    openingLine: '당신은 주변에 웃음을 선물하는 특별한 존재입니다.',
    closingLine: '웃음 뒤에 숨은 깊이도 드러내세요. 그것도 당신입니다.',
    destinyPhrase: '웃기는 자, 세상을 밝게 하는 무지개'
  }
};

// ========== 헬퍼 함수 ==========

/**
 * 일간으로 원형 정보 가져오기
 */
export function getArchetypeByDayMaster(dayMaster: string): ArchetypeInfo {
  const archetype = DAYMASTER_ARCHETYPE[dayMaster] || 'everyman';
  return ARCHETYPE_INFO[archetype];
}

/**
 * 원형 기반 스토리 생성
 */
export function generateArchetypeStory(dayMaster: string, age: number): string {
  const archetype = getArchetypeByDayMaster(dayMaster);

  const ageContext = age < 30
    ? '아직 당신의 잠재력이 피어나는 중입니다.'
    : age < 45
      ? '당신의 본질이 점점 드러나고 있습니다.'
      : age < 60
        ? '당신의 지혜가 빛나는 시기입니다.'
        : '당신의 완성된 모습이 보입니다.';

  return `${archetype.openingLine} ${archetype.metaphor}처럼, ` +
    `${archetype.coreDesire} 그것이 당신의 본질입니다. ` +
    `${ageContext} ${archetype.closingLine}`;
}

/**
 * 원형의 그림자와 성장 메시지
 */
export function getArchetypeShadowAndGrowth(dayMaster: string): {
  shadow: string;
  growth: string;
} {
  const archetype = getArchetypeByDayMaster(dayMaster);
  return {
    shadow: `주의할 점: ${archetype.shadowSide}에 빠지지 않도록 경계하세요.`,
    growth: `성장의 길: ${archetype.transformationPath}`
  };
}

/**
 * 운명 한 줄 생성
 */
export function getDestinyPhrase(dayMaster: string): string {
  const archetype = getArchetypeByDayMaster(dayMaster);
  return archetype.destinyPhrase;
}

/**
 * 원형 조합 분석 (일간 + 용신)
 */
export function analyzeArchetypeCombination(
  dayMaster: string,
  yongsin: string[]
): string {
  const mainArchetype = getArchetypeByDayMaster(dayMaster);

  // 용신에 따른 보조 원형
  const yongsinArchetypeMap: Record<string, string> = {
    '목': '성장을 추구하는',
    '화': '열정을 발산하는',
    '토': '안정을 찾는',
    '금': '정의를 세우는',
    '수': '지혜를 깨우는'
  };

  const yongsinKo = yongsin[0] || '목';
  const yongsinTrait = yongsinArchetypeMap[yongsinKo] ||
    yongsinArchetypeMap['목'];

  return `당신은 ${mainArchetype.korean}의 원형에 ${yongsinTrait} 에너지가 더해졌습니다. ` +
    `${mainArchetype.talent}에 더해, ${yongsinTrait} 힘이 당신을 이끕니다.`;
}
