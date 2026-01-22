// 사주 심볼 카드 데이터 매핑

import type { EssenceCard, EnergyCard, TalentCard, FlowCard, GuardianCard } from '@/types/cards';

// ============================================
// 본질 카드 (자연물) - 일간 매핑
// 참고: category로 나무/꽃을 구분하여 정확한 표현 사용
// ============================================
export const ESSENCE_CARDS: Record<string, Omit<EssenceCard, 'id'>> = {
  '갑': {
    dayMaster: '갑',
    flower: 'pine',
    flowerKorean: '소나무',
    category: 'tree', // 나무
    keywords: ['곧음', '리더십', '개척'],
    story: '우뚝 솟은 소나무처럼, 당신은 어떤 풍파에도 꺾이지 않는 곧은 심지를 가졌습니다. 앞장서서 길을 내고, 뒤따르는 이들에게 그늘이 되어주는 사람. 그것이 당신의 타고난 본질입니다.',
    imageKey: 'essence-pine',
    color: '#2D5A27'
  },
  '을': {
    dayMaster: '을',
    flower: 'orchid',
    flowerKorean: '난초',
    keywords: ['유연함', '적응력', '우아함'],
    story: '바람에 흔들리는 난초처럼, 당신은 강인함보다 유연함으로 세상을 헤쳐나갑니다. 어떤 환경에서도 자신만의 향기를 잃지 않고, 우아하게 피어나는 사람. 부드러움 속에 진정한 강함이 있습니다.',
    imageKey: 'essence-orchid',
    color: '#9B7EBD'
  },
  '병': {
    dayMaster: '병',
    flower: 'sunflower',
    flowerKorean: '해바라기',
    keywords: ['열정', '중심', '밝음'],
    story: '태양을 향해 고개 드는 해바라기처럼, 당신은 어디서든 빛나는 존재입니다. 사람들의 중심에 서서 따뜻한 에너지를 나누고, 주변을 환하게 밝히는 사람. 당신이 있는 곳에 활기가 넘칩니다.',
    imageKey: 'essence-sunflower',
    color: '#FFD700'
  },
  '정': {
    dayMaster: '정',
    flower: 'camellia',
    flowerKorean: '동백',
    keywords: ['따뜻함', '헌신', '섬세함'],
    story: '어둠 속에서도 피어나는 동백처럼, 당신은 조용히 그러나 분명하게 빛납니다. 겉으로 드러나지 않아도 깊은 열정을 품고, 사랑하는 이들을 위해 묵묵히 헌신하는 사람. 당신의 따뜻함이 세상을 녹입니다.',
    imageKey: 'essence-camellia',
    color: '#DC143C'
  },
  '무': {
    dayMaster: '무',
    flower: 'peony',
    flowerKorean: '모란',
    keywords: ['안정', '포용', '중후함'],
    story: '만개한 모란처럼, 당신은 너그럽고 든든한 존재입니다. 산처럼 묵직하게 자리를 지키며, 모든 것을 품어주는 넉넉함이 있습니다. 당신 곁에 있으면 사람들은 안심합니다.',
    imageKey: 'essence-peony',
    color: '#E75480'
  },
  '기': {
    dayMaster: '기',
    flower: 'cosmos',
    flowerKorean: '코스모스',
    keywords: ['다정함', '감성', '조화'],
    story: '들판에 피어난 코스모스처럼, 당신은 소박하지만 깊은 아름다움을 가졌습니다. 주변과 조화를 이루며, 작은 것에서도 행복을 찾는 감성이 있습니다. 당신의 다정함이 사람들의 마음을 어루만집니다.',
    imageKey: 'essence-cosmos',
    color: '#FFB6C1'
  },
  '경': {
    dayMaster: '경',
    flower: 'chrysanthemum',
    flowerKorean: '국화',
    keywords: ['결단', '의리', '절개'],
    story: '서리가 내려도 꺾이지 않는 국화처럼, 당신은 어떤 상황에서도 원칙을 지킵니다. 한번 정한 것은 끝까지 가고, 맺은 인연은 절대 저버리지 않는 사람. 단단함 속에 진정한 아름다움이 있습니다.',
    imageKey: 'essence-chrysanthemum',
    color: '#DAA520'
  },
  '신': {
    dayMaster: '신',
    flower: 'plum',
    flowerKorean: '매화',
    keywords: ['섬세함', '고고함', '순수'],
    story: '눈 속에서 피어나는 매화처럼, 당신은 역경 속에서 더욱 빛납니다. 세상의 기준에 휘둘리지 않고 자신만의 아름다움을 지키는 고고함이 있습니다. 당신의 순수함이 사람들에게 감동을 줍니다.',
    imageKey: 'essence-plum',
    color: '#FFF0F5'
  },
  '임': {
    dayMaster: '임',
    flower: 'lotus',
    flowerKorean: '연꽃',
    keywords: ['지혜', '포용', '깊이'],
    story: '진흙 속에서도 청아하게 피어나는 연꽃처럼, 당신은 깊은 지혜를 가졌습니다. 모든 것을 받아들이면서도 물들지 않고, 넓은 마음으로 세상을 품는 사람. 당신의 깊이가 사람들을 이끕니다.',
    imageKey: 'essence-lotus',
    color: '#FFC0CB'
  },
  '계': {
    dayMaster: '계',
    flower: 'forgetmenot',
    flowerKorean: '물망초',
    keywords: ['감성', '직관', '스며듦'],
    story: '이슬 맺힌 물망초처럼, 당신은 섬세한 감수성으로 세상을 느낍니다. 말하지 않아도 상대의 마음을 읽고, 조용히 스며들어 영향을 주는 사람. 당신의 직관이 길을 밝혀줍니다.',
    imageKey: 'essence-forgetmenot',
    color: '#87CEEB'
  }
};

// ============================================
// 에너지 카드 (동물) - 용신 매핑
// ============================================
export const ENERGY_CARDS: Record<string, Omit<EnergyCard, 'id'>> = {
  '목': {
    yongsin: '목',
    animal: 'deer',
    animalKorean: '사슴',
    keywords: ['시작', '성장', '도약'],
    story: '새벽 숲을 뛰어다니는 사슴처럼, 당신에게 필요한 건 새로운 시작의 용기입니다. 첫 발을 내딛는 순간, 운명의 문이 열립니다. 망설이지 마세요. 성장의 기운이 당신을 기다리고 있습니다.',
    imageKey: 'energy-deer',
    color: '#228B22',
    subAnimals: {
      young: '토끼',
      mature: '청룡'
    }
  },
  '화': {
    yongsin: '화',
    animal: 'phoenix',
    animalKorean: '봉황',
    keywords: ['열정', '재탄생', '빛'],
    story: '불꽃 속에서 다시 태어나는 봉황처럼, 당신에게 필요한 건 열정의 불씨입니다. 두려움을 태우고 일어서는 순간, 새로운 당신이 시작됩니다. 빛나는 존재가 되어 세상을 밝히세요.',
    imageKey: 'energy-phoenix',
    color: '#FF4500',
    subAnimals: {
      young: '공작',
      mature: '주작'
    }
  },
  '토': {
    yongsin: '토',
    animal: 'elephant',
    animalKorean: '코끼리',
    keywords: ['안정', '신뢰', '기반'],
    story: '대지 위를 묵직하게 걷는 코끼리처럼, 당신에게 필요한 건 흔들리지 않는 기반입니다. 급하게 달리지 않아도 됩니다. 한 걸음 한 걸음 쌓아올린 것들이 결국 당신을 지탱해줄 것입니다.',
    imageKey: 'energy-elephant',
    color: '#8B4513',
    subAnimals: {
      young: '소',
      mature: '산양'
    }
  },
  '금': {
    yongsin: '금',
    animal: 'tiger',
    animalKorean: '백호',
    keywords: ['결단', '실행', '완결'],
    story: '달빛 아래 포효하는 백호처럼, 당신에게 필요한 건 결단의 힘입니다. 생각만 하던 것을 행동으로 옮기는 순간, 모든 것이 움직이기 시작합니다. 망설임을 끊고 앞으로 나아가세요.',
    imageKey: 'energy-tiger',
    color: '#C0C0C0',
    subAnimals: {
      young: '독수리',
      mature: '백호'
    }
  },
  '수': {
    yongsin: '수',
    animal: 'dragon',
    animalKorean: '용',
    keywords: ['지혜', '흐름', '변화'],
    story: '물속에서 용으로 변하는 잉어처럼, 당신에게 필요한 건 흐름을 타는 지혜입니다. 억지로 밀어붙이지 말고, 때를 기다리며 준비하세요. 변화의 순간이 오면, 당신은 하늘로 오를 것입니다.',
    imageKey: 'energy-dragon',
    color: '#000080',
    subAnimals: {
      young: '거북',
      mature: '흑룡'
    }
  }
};

// ============================================
// 재능 카드 (나무) - 십신 매핑
// ============================================
export const TALENT_CARDS: Record<string, Omit<TalentCard, 'id'>> = {
  '비견': {
    sipsin: '비견',
    tree: 'bamboo',
    treeKorean: '대나무 숲',
    keywords: ['독립', '경쟁', '동료'],
    story: '빽빽한 대나무 숲처럼, 당신 안에는 독립의 힘이 있습니다. 홀로 서도 당당하고, 함께 서면 더 강해지는 사람. 경쟁을 두려워하지 않고, 좋은 동료를 곁에 두는 것이 당신의 재능입니다.',
    imageKey: 'talent-bamboo',
    color: '#3CB371'
  },
  '겁재': {
    sipsin: '겁재',
    tree: 'ivy',
    treeKorean: '담쟁이',
    keywords: ['추진력', '도전', '확장'],
    story: '벽을 타고 오르는 담쟁이처럼, 당신 안에는 멈추지 않는 추진력이 있습니다. 불가능해 보이는 곳도 도전하고, 영역을 끊임없이 넓혀가는 사람. 그 확장의 에너지가 당신의 재능입니다.',
    imageKey: 'talent-ivy',
    color: '#006400'
  },
  '식신': {
    sipsin: '식신',
    tree: 'fruit',
    treeKorean: '과일나무',
    keywords: ['표현', '창작', '풍요'],
    story: '열매 맺은 과일나무처럼, 당신 안에는 풍요로운 창작의 힘이 있습니다. 표현하고, 만들고, 나누는 것. 당신이 만든 것들이 사람들에게 기쁨을 주는 것, 그것이 당신의 재능입니다.',
    imageKey: 'talent-fruit',
    color: '#FF6347'
  },
  '상관': {
    sipsin: '상관',
    tree: 'wildflower',
    treeKorean: '야생화 덤불',
    keywords: ['자유', '창의', '파격'],
    story: '자유롭게 핀 야생화 덤불처럼, 당신 안에는 틀에 갇히지 않는 창의력이 있습니다. 남들이 가지 않는 길을 가고, 새로운 것을 만들어내는 사람. 그 파격의 에너지가 당신의 재능입니다.',
    imageKey: 'talent-wildflower',
    color: '#FF69B4'
  },
  '편재': {
    sipsin: '편재',
    tree: 'ginkgo',
    treeKorean: '은행나무',
    keywords: ['재물', '활동', '변화'],
    story: '황금빛으로 물드는 은행나무처럼, 당신 안에는 재물을 모으는 힘이 있습니다. 활발하게 움직이고, 변화를 기회로 만드는 사람. 돈의 흐름을 읽는 감각이 당신의 재능입니다.',
    imageKey: 'talent-ginkgo',
    color: '#FFD700'
  },
  '정재': {
    sipsin: '정재',
    tree: 'zelkova',
    treeKorean: '느티나무',
    keywords: ['안정', '축적', '관리'],
    story: '마을 정자나무처럼 듬직한 느티나무처럼, 당신 안에는 꾸준히 쌓아가는 힘이 있습니다. 급하게 벌기보다 차곡차곡 모으고, 지키는 사람. 안정적인 재물 관리가 당신의 재능입니다.',
    imageKey: 'talent-zelkova',
    color: '#8B4513'
  },
  '편관': {
    sipsin: '편관',
    tree: 'juniper',
    treeKorean: '향나무',
    keywords: ['책임', '도전', '권위'],
    story: '곧게 뻗은 향나무처럼, 당신 안에는 책임을 지는 힘이 있습니다. 어려운 상황에서도 물러서지 않고, 앞장서서 문제를 해결하는 사람. 리더십과 권위가 당신의 재능입니다.',
    imageKey: 'talent-juniper',
    color: '#2F4F4F'
  },
  '정관': {
    sipsin: '정관',
    tree: 'cherry',
    treeKorean: '벚나무',
    keywords: ['명예', '질서', '인정'],
    story: '만개한 벚꽃처럼, 당신 안에는 인정받고자 하는 힘이 있습니다. 질서를 지키고, 맡은 바를 완수하여 명예를 얻는 사람. 신뢰와 존경을 쌓는 것이 당신의 재능입니다.',
    imageKey: 'talent-cherry',
    color: '#FFB7C5'
  },
  '편인': {
    sipsin: '편인',
    tree: 'ancient',
    treeKorean: '고목',
    keywords: ['통찰', '독창', '고독'],
    story: '이끼 낀 고목처럼, 당신 안에는 깊은 통찰의 힘이 있습니다. 남들이 보지 못하는 것을 보고, 혼자만의 시간에서 독창적인 것을 만들어내는 사람. 깊이 있는 사고가 당신의 재능입니다.',
    imageKey: 'talent-ancient',
    color: '#556B2F'
  },
  '정인': {
    sipsin: '정인',
    tree: 'willow',
    treeKorean: '버드나무',
    keywords: ['지식', '보호', '모성'],
    story: '늘어진 버드나무처럼, 당신 안에는 감싸안는 힘이 있습니다. 배움을 사랑하고, 아는 것을 나누며, 약한 것을 보호하는 사람. 따뜻한 지식 나눔이 당신의 재능입니다.',
    imageKey: 'talent-willow',
    color: '#9ACD32'
  }
};

// ============================================
// 흐름 카드 (자연현상) - 운세 흐름 매핑
// ============================================
export const FLOW_CARDS: Record<string, Omit<FlowCard, 'id'>> = {
  'rising': {
    flowType: 'rising',
    phenomenon: 'sunrise',
    phenomenonKorean: '일출',
    keywords: ['시작', '기회', '성장'],
    story: '산 위로 떠오르는 해처럼, 당신의 운세가 밝아지고 있습니다. 새로운 시작을 위한 에너지가 충만한 시기. 지금 시작하는 것들이 앞으로의 기반이 됩니다. 용기를 내어 첫 발을 내딛으세요.',
    imageKey: 'flow-sunrise',
    color: '#FF8C00'
  },
  'peak': {
    flowType: 'peak',
    phenomenon: 'noon',
    phenomenonKorean: '한낮 태양',
    keywords: ['정점', '성취', '빛남'],
    story: '찬란한 정오의 태양처럼, 당신은 지금 가장 빛나는 시기에 있습니다. 그동안의 노력이 결실을 맺고, 당신의 가치가 인정받는 때. 자신감을 갖고 당당하게 나아가세요.',
    imageKey: 'flow-noon',
    color: '#FFD700'
  },
  'adjusting': {
    flowType: 'adjusting',
    phenomenon: 'cloudy',
    phenomenonKorean: '구름 낀 하늘',
    keywords: ['점검', '준비', '휴식'],
    story: '구름 사이로 빛줄기가 비치는 하늘처럼, 지금은 잠시 속도를 조절할 때입니다. 무리하게 밀어붙이기보다, 지나온 길을 점검하고 다음을 준비하세요. 쉬어가는 것도 전진입니다.',
    imageKey: 'flow-cloudy',
    color: '#B0C4DE'
  },
  'dormant': {
    flowType: 'dormant',
    phenomenon: 'fog',
    phenomenonKorean: '안개',
    keywords: ['기다림', '내면 성장', '잠복'],
    story: '신비로운 안개 숲처럼, 지금은 밖으로 드러나지 않는 시기입니다. 하지만 보이지 않는 곳에서 당신은 성장하고 있습니다. 조급해하지 말고 내면을 가꾸세요. 안개가 걷히면 새로운 풍경이 펼쳐집니다.',
    imageKey: 'flow-fog',
    color: '#778899'
  },
  'harvest': {
    flowType: 'harvest',
    phenomenon: 'sunset',
    phenomenonKorean: '노을',
    keywords: ['결실', '보상', '완성'],
    story: '황금빛 노을처럼, 당신의 노력이 드디어 결실을 맺는 시기입니다. 씨 뿌린 것을 거두고, 그동안의 수고가 보상받는 때. 감사하는 마음으로 열매를 누리세요.',
    imageKey: 'flow-sunset',
    color: '#FF6347'
  },
  'transition': {
    flowType: 'transition',
    phenomenon: 'starrynight',
    phenomenonKorean: '별이 뜨는 밤',
    keywords: ['변화', '전환', '새 방향'],
    story: '별이 쏟아지는 밤하늘처럼, 당신 앞에 새로운 방향이 펼쳐지고 있습니다. 익숙한 것이 끝나고 낯선 것이 시작되는 전환점. 두려워하지 마세요. 별들이 새로운 길을 안내해줄 것입니다.',
    imageKey: 'flow-starrynight',
    color: '#191970'
  },
  'challenge': {
    flowType: 'challenge',
    phenomenon: 'storm',
    phenomenonKorean: '폭풍우',
    keywords: ['도전', '시험', '성장통'],
    story: '번개 치는 폭풍우처럼, 지금은 당신을 시험하는 시기입니다. 힘들고 흔들릴 수 있지만, 이 시련을 통해 당신은 더 강해집니다. 폭풍이 지나면 맑은 하늘이 옵니다. 버텨내세요.',
    imageKey: 'flow-storm',
    color: '#4B0082'
  },
  'recovery': {
    flowType: 'recovery',
    phenomenon: 'rainbow',
    phenomenonKorean: '무지개',
    keywords: ['회복', '희망', '재도약'],
    story: '비 갠 후 피어나는 무지개처럼, 당신에게 희망의 시기가 왔습니다. 어려웠던 시간이 끝나고, 다시 일어설 힘이 생기는 때. 새로운 마음으로 재도약하세요. 더 아름다운 내일이 기다립니다.',
    imageKey: 'flow-rainbow',
    color: '#FF1493'
  }
};

// ============================================
// 수호 카드 (보석) - 용신 + 일간 매핑
// ============================================

// 용신 기반 메인 보석
export const MAIN_GEM_BY_YONGSIN: Record<string, { gem: string; gemKorean: string; keywords: string[]; color: string }> = {
  '목': {
    gem: 'emerald',
    gemKorean: '에메랄드',
    keywords: ['성장', '치유', '새 시작'],
    color: '#50C878'
  },
  '화': {
    gem: 'ruby',
    gemKorean: '루비',
    keywords: ['열정', '용기', '활력'],
    color: '#E0115F'
  },
  '토': {
    gem: 'citrine',
    gemKorean: '시트린',
    keywords: ['안정', '재물', '자신감'],
    color: '#E4D00A'
  },
  '금': {
    gem: 'diamond',
    gemKorean: '다이아몬드',
    keywords: ['결단', '순수', '완성'],
    color: '#B9F2FF'
  },
  '수': {
    gem: 'sapphire',
    gemKorean: '사파이어',
    keywords: ['지혜', '직관', '평화'],
    color: '#0F52BA'
  }
};

// 일간 기반 서브 보석
export const SUB_GEM_BY_DAYMASTER: Record<string, { gem: string; gemKorean: string; trait: string }> = {
  '갑': { gem: 'peridot', gemKorean: '페리도트', trait: '리더십 강화' },
  '을': { gem: 'jade', gemKorean: '옥', trait: '유연함, 조화' },
  '병': { gem: 'carnelian', gemKorean: '카넬리안', trait: '자신감, 표현력' },
  '정': { gem: 'garnet', gemKorean: '가넷', trait: '헌신, 따뜻함' },
  '무': { gem: 'amber', gemKorean: '호박', trait: '안정, 포용력' },
  '기': { gem: 'rosequartz', gemKorean: '로즈쿼츠', trait: '사랑, 감성' },
  '경': { gem: 'onyx', gemKorean: '오닉스', trait: '결단력, 보호' },
  '신': { gem: 'pearl', gemKorean: '진주', trait: '순수, 섬세함' },
  '임': { gem: 'aquamarine', gemKorean: '아쿠아마린', trait: '지혜, 소통' },
  '계': { gem: 'moonstone', gemKorean: '문스톤', trait: '직관, 감수성' }
};

// 수호 카드 스토리 생성
export function generateGuardianStory(yongsin: string, dayMaster: string): string {
  const mainGem = MAIN_GEM_BY_YONGSIN[yongsin];
  const subGem = SUB_GEM_BY_DAYMASTER[dayMaster];

  if (!mainGem || !subGem) {
    return '당신을 지키는 보석의 기운이 함께합니다.';
  }

  return `${mainGem.gemKorean}와 ${subGem.gemKorean}가 당신을 수호합니다. ` +
    `${mainGem.gemKorean}는 ${mainGem.keywords.join(', ')}의 에너지를 더하고, ` +
    `${subGem.gemKorean}는 당신의 ${subGem.trait}을 높여줍니다. ` +
    `이 두 보석을 가까이 두면, 당신의 운이 한층 밝아질 것입니다.`;
}

// ============================================
// 행운 숫자/방위/색상 매핑
// ============================================
export const LUCKY_NUMBERS_BY_ELEMENT: Record<string, number[]> = {
  '목': [3, 8],
  '화': [2, 7],
  '토': [5, 10],
  '금': [4, 9],
  '수': [1, 6]
};

export const LUCKY_DIRECTION_BY_ELEMENT: Record<string, string> = {
  '목': '동쪽',
  '화': '남쪽',
  '토': '중앙',
  '금': '서쪽',
  '수': '북쪽'
};

export const LUCKY_COLOR_BY_ELEMENT: Record<string, string> = {
  '목': '청록색',
  '화': '빨간색',
  '토': '노란색',
  '금': '흰색',
  '수': '검은색'
};

// ============================================
// 연간 타임라인 기본 데이터
// ============================================
export const TIMELINE_PHASES = {
  preparation: { korean: '준비기', description: '새 시작보다 정리·계획 시기' },
  rising: { korean: '상승기', description: '결정·시작하기 좋은 타이밍' },
  adjustment: { korean: '조정기', description: '속도 조절, 점검 필요' },
  dormant: { korean: '잠복기', description: '무리한 확장 자제' },
  harvest: { korean: '수확기', description: '노력의 결과 가시화' },
  closing: { korean: '마무리', description: '다음 해 준비' }
};
