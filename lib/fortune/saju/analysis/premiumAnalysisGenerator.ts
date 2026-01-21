/**
 * 프리미엄 분석 생성기
 * 60갑자, MBTI 연동, 시적 표현, 6장 운명 카드 등 v2.0 기능 통합
 */

import type {
  UserInput,
  SajuChart,
  OhengBalance,
  Element,
  SixtyJiaziAnalysis,
  MBTIIntegrationAnalysis,
  ElementPoetryAnalysis,
  DestinyCardsAnalysis,
  DestinyCard,
  ElementRelation,
} from '@/types/saju';

import {
  getSixtyJiaziInfo,
  getYearJiaziInfo,
  generateJiaziPrologue,
  generateJiaziEpilogue,
} from '../mappings/sixtyJiazi';

import {
  analyzeMBTISajuMatch,
  generateIntegratedAnalysis,
  getMBTIDescription,
  DAYMASTER_MBTI_MATCH,
  type MBTIType,
} from '../mappings/mbtiIntegration';

import {
  analyzeElementRelation,
  generateElementBalancePoetry,
  generatePrologue,
  generateEpilogue,
  GENERATING_RELATIONS,
  CONTROLLING_RELATIONS,
} from '../mappings/poeticExpressions';

import {
  ESSENCE_CARDS,
  ENERGY_CARDS,
  TALENT_CARDS,
  FLOW_CARDS,
  MAIN_GEM_BY_YONGSIN,
} from '../cards/cardData';

// 일간 한자 -> 한글 매핑
const STEM_TO_KOREAN: Record<string, string> = {
  '甲': '갑', '乙': '을', '丙': '병', '丁': '정', '戊': '무',
  '己': '기', '庚': '경', '辛': '신', '壬': '임', '癸': '계'
};

// 오행 영문 -> 한글 매핑
const ELEMENT_TO_KOREAN: Record<string, string> = {
  'wood': '목', 'fire': '화', 'earth': '토', 'metal': '금', 'water': '수'
};

// 오행 한글 -> 영문 매핑
const KOREAN_TO_ELEMENT: Record<string, string> = {
  '목': 'wood', '화': 'fire', '토': 'earth', '금': 'metal', '수': 'water'
};

/**
 * 60갑자 분석 생성
 */
export function generateSixtyJiaziAnalysis(
  user: UserInput,
  saju: SajuChart
): SixtyJiaziAnalysis | null {
  const jiaziInfo = getSixtyJiaziInfo(saju.year.heavenlyStem, saju.year.earthlyBranch);

  if (!jiaziInfo) {
    return null;
  }

  const birthYear = parseInt(user.birthDate.split('-')[0]);
  const dayMasterKorean = STEM_TO_KOREAN[saju.day.heavenlyStem] || '갑';
  const dayElement = ELEMENT_TO_KOREAN[saju.day.element] || '목';
  const prologueText = generateJiaziPrologue(jiaziInfo);
  const epilogueText = generateJiaziEpilogue(jiaziInfo, dayElement);

  return {
    yearJiazi: jiaziInfo.jiazi,
    yearKorean: jiaziInfo.korean,
    animal: jiaziInfo.animal,
    animalDescription: jiaziInfo.animalKorean,
    nature: jiaziInfo.nature,
    color: jiaziInfo.color,
    keywords: jiaziInfo.keywords,
    personality: jiaziInfo.personality,
    destiny: jiaziInfo.destiny,
    yearCycle: jiaziInfo.year,
    prologueText,
    epilogueText,
  };
}

/**
 * MBTI-사주 통합 분석 생성
 */
export function generateMBTIIntegrationAnalysis(
  user: UserInput,
  saju: SajuChart,
  yongsin: Element[]
): MBTIIntegrationAnalysis | null {
  if (!user.mbti) {
    return null;
  }

  const dayMasterKorean = STEM_TO_KOREAN[saju.day.heavenlyStem] || '갑';
  const mbtiUpper = user.mbti.toUpperCase();

  // MBTI 유효성 검사
  const validMBTIs = ['INTJ', 'INTP', 'ENTJ', 'ENTP', 'INFJ', 'INFP', 'ENFJ', 'ENFP',
                      'ISTJ', 'ISFJ', 'ESTJ', 'ESFJ', 'ISTP', 'ISFP', 'ESTP', 'ESFP'];
  if (!validMBTIs.includes(mbtiUpper)) {
    return null;
  }

  const mbti = mbtiUpper as MBTIType;

  const matchResult = analyzeMBTISajuMatch(dayMasterKorean, mbti);
  if (!matchResult) {
    return null;
  }

  // yongsin을 string[]으로 변환
  const yongsinStrings = yongsin.map(e => e as string);

  const integratedAnalysis = generateIntegratedAnalysis(
    dayMasterKorean,
    mbti,
    yongsinStrings
  );

  const mbtiDescription = getMBTIDescription(mbti);
  const dayMasterMatch = DAYMASTER_MBTI_MATCH[dayMasterKorean];

  // T/F 판별
  const isThinkingType = mbti.includes('T');

  return {
    mbti,
    dayMaster: dayMasterKorean,
    matchScore: matchResult.matchScore,
    isBestMatch: matchResult.matchLevel === 'excellent',
    isChallengingMatch: matchResult.matchLevel === 'challenging',
    strengthsWithT: dayMasterMatch?.strengthsWithT || '',
    strengthsWithF: dayMasterMatch?.strengthsWithF || '',
    adviceForT: dayMasterMatch?.adviceForT || '',
    adviceForF: dayMasterMatch?.adviceForF || '',
    integratedAnalysis,
    developmentSuggestions: isThinkingType
      ? [
          '감정에 귀 기울이는 시간을 가지세요',
          '타인의 감정을 인정하고 공감하세요',
          '직관적인 결정도 가끔은 신뢰해보세요',
        ]
      : [
          '객관적 데이터에 기반한 결정을 연습하세요',
          '감정과 논리의 균형을 찾으세요',
          '건설적인 피드백을 두려워하지 마세요',
        ],
  };
}

/**
 * 오행 관계 시적 해석 생성
 */
export function generateElementPoetryAnalysis(
  saju: SajuChart,
  oheng: OhengBalance,
  yongsin: Element[],
  gisin: Element[]
): ElementPoetryAnalysis {
  const dayElement = ELEMENT_TO_KOREAN[saju.day.element] || '목';

  // 상생 관계 분석
  const generatingRelations: ElementRelation[] = [];
  Object.entries(GENERATING_RELATIONS).forEach(([key, relation]) => {
    if (relation.from === dayElement || relation.to === dayElement) {
      generatingRelations.push({
        from: relation.from,
        to: relation.to,
        relationName: relation.relationName,
        poeticExpression: relation.poeticExpression,
        story: relation.story,
        advice: relation.advice,
      });
    }
  });

  // 상극 관계 분석
  const controllingRelations: ElementRelation[] = [];
  Object.entries(CONTROLLING_RELATIONS).forEach(([key, relation]) => {
    if (relation.from === dayElement || relation.to === dayElement) {
      controllingRelations.push({
        from: relation.from,
        to: relation.to,
        relationName: relation.relationName,
        poeticExpression: relation.poeticExpression,
        story: relation.story,
        advice: relation.advice,
      });
    }
  });

  // 오행 균형 시적 표현
  const ohengKorean: Record<string, number> = {
    '목': oheng.wood,
    '화': oheng.fire,
    '토': oheng.earth,
    '금': oheng.metal,
    '수': oheng.water,
  };

  const balancePoetry = generateElementBalancePoetry(ohengKorean);

  // 가장 강한 오행
  const maxElement = Object.entries(ohengKorean).reduce((a, b) =>
    a[1] > b[1] ? a : b
  );

  // 가장 약한 오행
  const minElement = Object.entries(ohengKorean).reduce((a, b) =>
    a[1] < b[1] ? a : b
  );

  const elementPoetryMap: Record<string, string> = {
    '목': '나무처럼 곧게 뻗어 하늘을 향하는',
    '화': '불꽃처럼 열정적으로 타오르는',
    '토': '대지처럼 모든 것을 품어 안는',
    '금': '보석처럼 단단하고 빛나는',
    '수': '물처럼 유연하게 흐르는',
  };

  const weakElementPoetryMap: Record<string, string> = {
    '목': '나무의 기운이 부족하여 새로운 시작에 에너지가 필요한',
    '화': '불의 기운이 부족하여 열정을 불태울 연료가 필요한',
    '토': '흙의 기운이 부족하여 안정의 기반이 필요한',
    '금': '금의 기운이 부족하여 결단의 힘이 필요한',
    '수': '물의 기운이 부족하여 지혜의 원천이 필요한',
  };

  return {
    generatingRelations,
    controllingRelations,
    balancePoetry,
    dominantElement: {
      element: maxElement[0],
      korean: maxElement[0] + '(木火土金水'.charAt('목화토금수'.indexOf(maxElement[0])) + ')',
      poeticDescription: elementPoetryMap[maxElement[0]] || '',
    },
    weakElement: {
      element: minElement[0],
      korean: minElement[0] + '(木火土金水'.charAt('목화토금수'.indexOf(minElement[0])) + ')',
      poeticDescription: weakElementPoetryMap[minElement[0]] || '',
    },
    overallHarmony: balancePoetry,
  };
}

/**
 * 6장 운명 카드 분석 생성
 */
export function generateDestinyCardsAnalysis(
  user: UserInput,
  saju: SajuChart,
  oheng: OhengBalance,
  yongsin: Element[],
  dominantSipsin: string,
  targetYear: number
): DestinyCardsAnalysis {
  const dayMasterKorean = STEM_TO_KOREAN[saju.day.heavenlyStem] || '갑';
  const yongsinKorean = yongsin.map(e => ELEMENT_TO_KOREAN[e] || e)[0] || '목';

  const cards: DestinyCard[] = [];

  // 1. 근본 카드 (60갑자 기반)
  const jiaziInfo = getSixtyJiaziInfo(saju.year.heavenlyStem, saju.year.earthlyBranch);
  cards.push({
    type: 'root',
    typeKorean: '근본',
    title: jiaziInfo ? `${jiaziInfo.animalKorean}의 해에 태어난 자` : '근본의 에너지',
    symbol: jiaziInfo?.animal || '용',
    keywords: jiaziInfo?.keywords || ['시작', '기반', '뿌리'],
    story: jiaziInfo?.destiny || '당신의 근본 에너지가 삶의 기반을 형성합니다.',
    advice: '근본의 에너지를 인식하고 그 흐름을 따르세요.',
    color: jiaziInfo?.color || '#2E8B57',
  });

  // 2. 본질 카드 (일간 꽃 매핑)
  const essenceCard = ESSENCE_CARDS[dayMasterKorean];
  if (essenceCard) {
    cards.push({
      type: 'essence',
      typeKorean: '본질',
      title: `${essenceCard.flowerKorean}의 영혼`,
      symbol: essenceCard.flowerKorean,
      keywords: essenceCard.keywords,
      story: essenceCard.story,
      advice: `${essenceCard.flowerKorean}처럼 자신만의 방식으로 피어나세요.`,
      color: essenceCard.color,
    });
  }

  // 3. 에너지 카드 (용신 동물 매핑)
  const energyCard = ENERGY_CARDS[yongsinKorean];
  if (energyCard) {
    cards.push({
      type: 'energy',
      typeKorean: '에너지',
      title: `${energyCard.animalKorean}의 기운`,
      symbol: energyCard.animalKorean,
      keywords: energyCard.keywords,
      story: energyCard.story,
      advice: `${energyCard.animalKorean}의 기운을 가까이하여 부족한 에너지를 채우세요.`,
      color: energyCard.color,
    });
  }

  // 4. 재능 카드 (십신 매핑)
  const talentCard = TALENT_CARDS[dominantSipsin];
  if (talentCard) {
    cards.push({
      type: 'talent',
      typeKorean: '재능',
      title: `${talentCard.treeKorean}의 재능`,
      symbol: talentCard.treeKorean,
      keywords: talentCard.keywords,
      story: talentCard.story,
      advice: `${talentCard.treeKorean}처럼 당신만의 재능을 키워나가세요.`,
      color: talentCard.color,
    });
  }

  // 5. 흐름 카드 (연운 기반)
  const flowType = determineFlowType(oheng, yongsin);
  const flowCard = FLOW_CARDS[flowType];
  if (flowCard) {
    cards.push({
      type: 'flow',
      typeKorean: '흐름',
      title: `${flowCard.phenomenonKorean}의 시기`,
      symbol: flowCard.phenomenonKorean,
      keywords: flowCard.keywords,
      story: flowCard.story,
      advice: `${targetYear}년은 ${flowCard.phenomenonKorean}의 시기입니다. ${flowCard.keywords[0]}에 집중하세요.`,
      color: flowCard.color,
    });
  }

  // 6. 행운 카드 (보석 + 숫자)
  const guardianGem = MAIN_GEM_BY_YONGSIN[yongsinKorean];
  if (guardianGem) {
    cards.push({
      type: 'fortune',
      typeKorean: '행운',
      title: `${guardianGem.gemKorean}의 수호`,
      symbol: guardianGem.gemKorean,
      keywords: guardianGem.keywords,
      story: `${guardianGem.gemKorean}가 당신의 ${targetYear}년을 수호합니다. ${guardianGem.keywords.join(', ')}의 에너지가 함께합니다.`,
      advice: `${guardianGem.gemKorean}를 가까이하면 운이 좋아집니다.`,
      color: guardianGem.color,
    });
  }

  // 전체 요약 생성
  const summary = generateCardsSummary(cards, user.name || '고객');
  const coreMessage = generateCoreMessage(cards, dayMasterKorean);

  return {
    cards,
    summary,
    coreMessage,
  };
}

/**
 * 흐름 타입 결정
 */
function determineFlowType(oheng: OhengBalance, yongsin: Element[]): string {
  const yongsinKorean = yongsin.map(e => ELEMENT_TO_KOREAN[e] || e)[0] || '목';

  // 오행 균형 분석
  const total = oheng.wood + oheng.fire + oheng.earth + oheng.metal + oheng.water;
  const avg = total / 5;

  // 용신 강도에 따른 흐름 결정
  const yongsinValue = (() => {
    switch (yongsinKorean) {
      case '목': return oheng.wood;
      case '화': return oheng.fire;
      case '토': return oheng.earth;
      case '금': return oheng.metal;
      case '수': return oheng.water;
      default: return avg;
    }
  })();

  if (yongsinValue >= avg * 1.5) {
    return 'peak';
  } else if (yongsinValue >= avg) {
    return 'rising';
  } else if (yongsinValue >= avg * 0.5) {
    return 'adjusting';
  } else {
    return 'recovery';
  }
}

/**
 * 카드 요약 생성
 */
function generateCardsSummary(cards: DestinyCard[], userName: string): string {
  const rootCard = cards.find(c => c.type === 'root');
  const essenceCard = cards.find(c => c.type === 'essence');
  const energyCard = cards.find(c => c.type === 'energy');

  return `${userName}님은 ${rootCard?.symbol || ''}의 근본 에너지를 타고나셨습니다. ` +
    `${essenceCard?.symbol || ''}의 본질을 가진 당신에게는 ${energyCard?.symbol || ''}의 기운이 필요합니다. ` +
    `6장의 운명 카드가 당신의 길을 안내할 것입니다.`;
}

/**
 * 핵심 메시지 생성
 */
function generateCoreMessage(cards: DestinyCard[], dayMaster: string): string {
  const coreMessages: Record<string, string> = {
    '갑': '곧게 뻗은 나무처럼, 당신은 세상을 이끄는 리더입니다.',
    '을': '유연한 풀처럼, 당신은 어디서든 적응하고 성장합니다.',
    '병': '밝은 태양처럼, 당신은 주변을 환하게 비춥니다.',
    '정': '따뜻한 촛불처럼, 당신은 어둠 속에서 빛을 냅니다.',
    '무': '든든한 산처럼, 당신은 모든 것을 품어 안습니다.',
    '기': '기름진 땅처럼, 당신은 생명을 키워냅니다.',
    '경': '날카로운 칼처럼, 당신은 결단력으로 길을 엽니다.',
    '신': '빛나는 보석처럼, 당신은 세상을 아름답게 합니다.',
    '임': '깊은 바다처럼, 당신은 모든 것을 담아냅니다.',
    '계': '맑은 이슬처럼, 당신은 세상에 스며듭니다.',
  };

  return coreMessages[dayMaster] || '당신의 운명은 특별합니다.';
}

/**
 * 프롤로그 생성
 */
export function generateAnalysisPrologue(
  user: UserInput,
  saju: SajuChart,
  sixtyJiazi: SixtyJiaziAnalysis | null,
  yongsin: Element[] = []
): string {
  const userName = user.name || '고객';

  if (sixtyJiazi) {
    return sixtyJiazi.prologueText;
  }

  const dayMasterKorean = ELEMENT_TO_KOREAN[saju.day.element] || '목';
  const yongsinStrings = yongsin.map(e => ELEMENT_TO_KOREAN[e as string] || e as string);
  const birthYear = user.birthDate ? user.birthDate.substring(0, 4) : new Date().getFullYear().toString();

  return generatePrologue(
    userName,
    dayMasterKorean,
    yongsinStrings,
    birthYear
  );
}

/**
 * 에필로그 생성
 */
export function generateAnalysisEpilogue(
  user: UserInput,
  saju: SajuChart,
  sixtyJiazi: SixtyJiaziAnalysis | null,
  yongsin: Element[] = [],
  targetYear: number = new Date().getFullYear()
): string {
  const userName = user.name || '고객';

  if (sixtyJiazi) {
    return sixtyJiazi.epilogueText;
  }

  const dayMasterKorean = ELEMENT_TO_KOREAN[saju.day.element] || '목';
  const yongsinStrings = yongsin.map(e => ELEMENT_TO_KOREAN[e as string] || e as string);

  return generateEpilogue(
    userName,
    dayMasterKorean,
    yongsinStrings,
    targetYear
  );
}

export default {
  generateSixtyJiaziAnalysis,
  generateMBTIIntegrationAnalysis,
  generateElementPoetryAnalysis,
  generateDestinyCardsAnalysis,
  generateAnalysisPrologue,
  generateAnalysisEpilogue,
};
