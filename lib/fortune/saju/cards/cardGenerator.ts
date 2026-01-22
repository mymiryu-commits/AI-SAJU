// 카드 덱 생성기
// 사주 정보를 기반으로 7장의 심볼 카드 덱 생성 (v2.0: 60갑자 근본 카드 추가)

import type { UserInput, SajuChart, OhengBalance } from '@/types/saju';
import type {
  CardDeck,
  EssenceCard,
  EnergyCard,
  TalentCard,
  FlowCard,
  FortuneCard,
  GuardianCard,
  RootCard,
  CardStyle
} from '@/types/cards';

import {
  ESSENCE_CARDS,
  ENERGY_CARDS,
  TALENT_CARDS,
  FLOW_CARDS,
  MAIN_GEM_BY_YONGSIN,
  SUB_GEM_BY_DAYMASTER,
  LUCKY_NUMBERS_BY_ELEMENT,
  LUCKY_DIRECTION_BY_ELEMENT,
  LUCKY_COLOR_BY_ELEMENT,
  generateGuardianStory
} from './cardData';

// v2.0: 60갑자 매핑
import {
  getSixtyJiaziInfo,
  generateJiaziPrologue,
  generateJiaziEpilogue,
} from '../mappings/sixtyJiazi';

// v2.0: MBTI 매핑
import {
  analyzeMBTISajuMatch,
  type MBTIType,
} from '../mappings/mbtiIntegration';

// v2.0: 시적 표현 매핑
import {
  generateElementBalancePoetry,
  ELEMENT_INFO,
} from '../mappings/poeticExpressions';

// 연령대별 카드 스타일 결정
function determineCardStyle(birthYear: number): CardStyle {
  const currentYear = new Date().getFullYear();
  const age = currentYear - birthYear;

  if (age < 25) return 'minimal';
  if (age < 35) return 'fantasy';
  if (age < 45) return 'traditional';
  return 'luxury';
}

// v2.0: 근본 카드 (60갑자) 생성 - 년간지 기반
function generateRootCard(saju: SajuChart): RootCard | null {
  const yearStem = saju.year?.heavenlyStem || '甲';
  const yearBranch = saju.year?.earthlyBranch || '子';
  const jiaziInfo = getSixtyJiaziInfo(yearStem, yearBranch);

  if (!jiaziInfo) {
    return null;
  }

  // 일간 오행으로 에필로그 생성
  const dayElement = saju.day?.element || 'wood';
  const dayElementKorean: Record<string, string> = {
    'wood': '목', 'fire': '화', 'earth': '토', 'metal': '금', 'water': '수'
  };
  const epilogueText = generateJiaziEpilogue(jiaziInfo, dayElementKorean[dayElement] || '목');
  const prologueText = generateJiaziPrologue(jiaziInfo);

  // 스토리 생성
  const story = `${jiaziInfo.animalKorean}의 해에 태어난 당신은 ${jiaziInfo.nature}과 같습니다. ` +
    `${jiaziInfo.personality} ${jiaziInfo.destiny}`;

  return {
    id: `root-${jiaziInfo.jiazi}`,
    yearJiazi: jiaziInfo.jiazi,
    yearKorean: jiaziInfo.korean,
    animal: jiaziInfo.animal,
    animalKorean: jiaziInfo.animalKorean,
    nature: jiaziInfo.nature,
    keywords: jiaziInfo.keywords,
    personality: jiaziInfo.personality,
    destiny: jiaziInfo.destiny,
    story,
    prologueText,
    epilogueText,
    imageKey: `root-${jiaziInfo.animal}`,
    color: jiaziInfo.color
  };
}

// 본질 카드 (꽃) 생성 - 일간 기반
function generateEssenceCard(saju: SajuChart): EssenceCard {
  const dayMaster = saju.day.stemKorean;
  const cardData = ESSENCE_CARDS[dayMaster] || ESSENCE_CARDS['갑'];

  return {
    id: `essence-${dayMaster}`,
    ...cardData
  };
}

// 에너지 카드 (동물) 생성 - 용신 기반
function generateEnergyCard(yongsin: string[], user: UserInput): EnergyCard {
  const primaryYongsin = yongsin[0] || '목';
  const cardData = ENERGY_CARDS[primaryYongsin] || ENERGY_CARDS['목'];

  // 연령에 따라 보조 동물 선택
  const currentYear = new Date().getFullYear();
  const birthYear = parseInt(user.birthDate.split('-')[0]);
  const age = currentYear - birthYear;
  const animalVariant = age < 35 ? 'young' : 'mature';

  return {
    id: `energy-${primaryYongsin}`,
    ...cardData,
    // 성숙도에 따라 동물 이미지 키 조정
    imageKey: age >= 40 ? `energy-${cardData.subAnimals.mature.toLowerCase()}` : cardData.imageKey
  };
}

// 재능 카드 (나무) 생성 - 주요 십신 기반
function generateTalentCard(dominantSipsin: string): TalentCard {
  const cardData = TALENT_CARDS[dominantSipsin] || TALENT_CARDS['식신'];

  return {
    id: `talent-${dominantSipsin}`,
    ...cardData
  };
}

// 흐름 카드 (자연현상) 생성 - 연운 기반
function generateFlowCard(
  saju: SajuChart,
  oheng: OhengBalance,
  yongsin: string[],
  targetYear: number
): FlowCard {
  const currentMonth = new Date().getMonth() + 1;

  // 현재 시기의 운세 흐름 결정
  // 용신 에너지와 현재 계절의 조화로 판단
  const seasonElement: Record<number, string> = {
    1: '수', 2: '수', 3: '목', 4: '목', 5: '화', 6: '화',
    7: '토', 8: '토', 9: '금', 10: '금', 11: '수', 12: '수'
  };

  const currentElement = seasonElement[currentMonth];
  const isYongsinSeason = yongsin.includes(currentElement);

  // 오행 균형 분석
  const totalBalance = oheng.wood + oheng.fire + oheng.earth + oheng.metal + oheng.water;
  const avgBalance = totalBalance / 5;
  const hasImbalance = Math.abs(Math.max(oheng.wood, oheng.fire, oheng.earth, oheng.metal, oheng.water) - avgBalance) > 15;

  // 흐름 유형 결정
  let flowType: FlowCard['flowType'];

  if (isYongsinSeason && !hasImbalance) {
    // 용신 계절 + 균형 = 상승 또는 수확
    flowType = currentMonth <= 6 ? 'rising' : 'harvest';
  } else if (isYongsinSeason && hasImbalance) {
    // 용신 계절 + 불균형 = 조정
    flowType = 'adjusting';
  } else if (!isYongsinSeason && hasImbalance) {
    // 비용신 + 불균형 = 도전 또는 잠복
    flowType = currentMonth % 2 === 0 ? 'challenge' : 'dormant';
  } else {
    // 비용신 + 균형 = 전환 또는 회복
    flowType = currentMonth <= 6 ? 'transition' : 'recovery';
  }

  // 올해 전체 운세가 좋으면 peak로 상향
  const yearElement = seasonElement[(targetYear % 12) + 1] || '토';
  if (yongsin.includes(yearElement) && flowType === 'rising') {
    flowType = 'peak';
  }

  const cardData = FLOW_CARDS[flowType] || FLOW_CARDS['rising'];

  return {
    id: `flow-${flowType}`,
    ...cardData,
    monthRange: `${currentMonth}월 ~ ${currentMonth + 2 > 12 ? currentMonth - 10 : currentMonth + 2}월`
  };
}

// 행운 카드 (숫자) 생성 - 복합 산출
function generateFortuneCard(
  saju: SajuChart,
  yongsin: string[]
): FortuneCard {
  const dayElement = saju.day.element;
  const primaryYongsin = yongsin[0] || '목';

  // 행운의 숫자: 일간 오행 + 용신 오행
  const dayNumbers = LUCKY_NUMBERS_BY_ELEMENT[dayElement] || [1, 6];
  const yongsinNumbers = LUCKY_NUMBERS_BY_ELEMENT[primaryYongsin] || [3, 8];
  const luckyNumbers = [...new Set([dayNumbers[0], yongsinNumbers[0]])].slice(0, 2);

  // 행운의 달: 용신 왕성 월
  const elementMonths: Record<string, number[]> = {
    '목': [3, 4],
    '화': [5, 6],
    '토': [7, 8],
    '금': [9, 10],
    '수': [11, 12]
  };
  const luckyMonths = elementMonths[primaryYongsin] || [3, 4];

  // 행운의 방위와 색상
  const luckyDirection = LUCKY_DIRECTION_BY_ELEMENT[primaryYongsin] || '동쪽';
  const luckyColor = LUCKY_COLOR_BY_ELEMENT[primaryYongsin] || '청록색';

  // 스토리 생성
  const story = `숫자 ${luckyNumbers.join('과 ')}이 당신의 열쇠입니다. ` +
    `${luckyMonths.map(m => m + '월').join(', ')}에 중요한 기회가 오고, ` +
    `${luckyDirection} 방향에서 좋은 인연이 옵니다. ` +
    `${luckyColor}이 당신의 운을 높여줍니다.`;

  return {
    id: `fortune-${primaryYongsin}`,
    luckyNumbers,
    luckyMonths,
    luckyDirection,
    luckyColor,
    story,
    imageKey: 'fortune-numbers'
  };
}

// 수호 카드 (보석) 생성 - 용신 + 일간 조합
function generateGuardianCard(
  saju: SajuChart,
  yongsin: string[]
): GuardianCard {
  const dayMaster = saju.day.stemKorean;

  // 영문 오행을 한글로 변환
  const elementToKorean: Record<string, string> = {
    'wood': '목', 'fire': '화', 'earth': '토', 'metal': '금', 'water': '수'
  };
  const primaryYongsinRaw = yongsin[0] || 'wood';
  const primaryYongsin = elementToKorean[primaryYongsinRaw] || primaryYongsinRaw || '목';

  const mainGem = MAIN_GEM_BY_YONGSIN[primaryYongsin] || MAIN_GEM_BY_YONGSIN['목'];
  const subGem = SUB_GEM_BY_DAYMASTER[dayMaster] || SUB_GEM_BY_DAYMASTER['갑'];

  const story = generateGuardianStory(primaryYongsin, dayMaster);

  return {
    id: `guardian-${primaryYongsin}-${dayMaster}`,
    mainGem: mainGem.gem,
    mainGemKorean: mainGem.gemKorean,
    subGem: subGem.gem,
    subGemKorean: subGem.gemKorean,
    keywords: [...mainGem.keywords.slice(0, 2), subGem.trait],
    story,
    imageKey: `guardian-${mainGem.gem}`,
    color: mainGem.color
  };
}

// 전체 카드 덱 생성 (메인 함수) - v2.0: 60갑자, MBTI, 시적 표현 통합
export function generateCardDeck(
  user: UserInput,
  saju: SajuChart,
  oheng: OhengBalance,
  yongsin: string[],
  dominantSipsin: string,
  targetYear: number = new Date().getFullYear()
): CardDeck {
  const birthYear = parseInt(user.birthDate.split('-')[0]);
  const style = determineCardStyle(birthYear);

  // v2.0: 근본 카드 (60갑자 기반)
  const rootCard = generateRootCard(saju);

  // v2.0: MBTI 통합 인사이트
  let mbtiInsight: CardDeck['mbtiInsight'];
  if (user.mbti) {
    const mbtiUpper = user.mbti.toUpperCase();
    const validMBTIs = ['INTJ', 'INTP', 'ENTJ', 'ENTP', 'INFJ', 'INFP', 'ENFJ', 'ENFP',
                        'ISTJ', 'ISFJ', 'ESTJ', 'ESFJ', 'ISTP', 'ISFP', 'ESTP', 'ESFP'];
    if (validMBTIs.includes(mbtiUpper)) {
      const dayMaster = saju.day.stemKorean;
      const matchResult = analyzeMBTISajuMatch(dayMaster, mbtiUpper as MBTIType);
      const isThinkingType = mbtiUpper.includes('T');

      mbtiInsight = {
        mbti: mbtiUpper,
        isThinkingType,
        personalizedAdvice: isThinkingType
          ? `논리적인 ${mbtiUpper} 유형과 ${dayMaster}일간의 조합으로, 체계적인 계획과 분석이 강점입니다. 감정적 판단도 때로는 필요합니다.`
          : `감성적인 ${mbtiUpper} 유형과 ${dayMaster}일간의 조합으로, 공감 능력과 직관이 강점입니다. 객관적 분석도 가끔 활용하세요.`
      };
    }
  }

  // v2.0: 오행 시적 표현
  const elementEnToKo: Record<string, string> = {
    'wood': '목', 'fire': '화', 'earth': '토', 'metal': '금', 'water': '수'
  };
  const primaryYongsin = yongsin[0] || 'wood';
  const primaryYongsinKo = elementEnToKo[primaryYongsin] || '목';
  const yongsinInfo = ELEMENT_INFO[primaryYongsinKo];

  const ohengKorean: Record<string, number> = {
    '목': oheng.wood, '화': oheng.fire, '토': oheng.earth, '금': oheng.metal, '수': oheng.water
  };
  const dominantElement = Object.entries(ohengKorean).reduce((a, b) => a[1] > b[1] ? a : b)[0];
  const poeticPhrase = generateElementBalancePoetry(ohengKorean);
  const elementInfo = ELEMENT_INFO[dominantElement];

  const elementPoetry: CardDeck['elementPoetry'] = {
    dominantElement: `${dominantElement}(${elementInfo?.korean || dominantElement})`,
    poeticPhrase,
    balanceAdvice: `${elementInfo?.poeticName || dominantElement}의 기운이 강한 당신, ${yongsinInfo?.poeticName || primaryYongsinKo}의 기운을 더해 균형을 맞추세요.`
  };

  return {
    root: rootCard || undefined,
    essence: generateEssenceCard(saju),
    energy: generateEnergyCard(yongsin, user),
    talent: generateTalentCard(dominantSipsin),
    flow: generateFlowCard(saju, oheng, yongsin, targetYear),
    fortune: generateFortuneCard(saju, yongsin),
    guardian: generateGuardianCard(saju, yongsin),
    generatedAt: new Date().toISOString(),
    style,
    // v2.0: 새 필드
    mbtiInsight,
    elementPoetry
  };
}

// 카드 덱 요약 텍스트 생성 - v2.0: 60갑자, MBTI, 시적 표현 반영
export function generateCardDeckSummary(cardDeck: CardDeck): string {
  // v2.0: 근본 카드가 있으면 60갑자 정보 포함
  const rootIntro = cardDeck.root
    ? `${cardDeck.root.animalKorean}의 해에 태어난 당신은 ${cardDeck.root.nature}의 기운을 타고났습니다. `
    : '';

  const baseSummary = `${cardDeck.essence.flowerKorean}의 본질, ` +
    `${cardDeck.energy.animalKorean}의 에너지, ` +
    `${cardDeck.talent.treeKorean}의 재능을 가진 당신. ` +
    `${cardDeck.flow.phenomenonKorean}의 시기를 지나고 있으며, ` +
    `${cardDeck.guardian.mainGemKorean}가 당신을 지켜줍니다.`;

  // v2.0: 오행 시적 표현 추가
  const poetryAddition = cardDeck.elementPoetry
    ? ` ${cardDeck.elementPoetry.poeticPhrase}`
    : '';

  // v2.0: MBTI 인사이트 추가
  const mbtiAddition = cardDeck.mbtiInsight
    ? ` (${cardDeck.mbtiInsight.mbti} 유형)`
    : '';

  return rootIntro + baseSummary + poetryAddition + mbtiAddition;
}

// 개별 카드 설명 생성 - v2.0: root 카드 추가
export function getCardDescription(
  cardType: 'root' | 'essence' | 'energy' | 'talent' | 'flow' | 'fortune' | 'guardian',
  cardDeck: CardDeck
): { title: string; subtitle: string; description: string; keywords: string[] } {
  switch (cardType) {
    // v2.0: 근본 카드 (60갑자)
    case 'root':
      if (!cardDeck.root) {
        return {
          title: '근본 카드',
          subtitle: '년간지 정보 없음',
          description: '60갑자 정보를 가져올 수 없습니다.',
          keywords: ['근본', '운명', '시작']
        };
      }
      return {
        title: '근본 카드',
        subtitle: `${cardDeck.root.yearKorean}년 ${cardDeck.root.animal}`,
        description: cardDeck.root.story,
        keywords: cardDeck.root.keywords
      };
    case 'essence':
      return {
        title: '본질 카드',
        subtitle: cardDeck.essence.flowerKorean,
        description: cardDeck.essence.story,
        keywords: cardDeck.essence.keywords
      };
    case 'energy':
      return {
        title: '에너지 카드',
        subtitle: cardDeck.energy.animalKorean,
        description: cardDeck.energy.story,
        keywords: cardDeck.energy.keywords
      };
    case 'talent':
      return {
        title: '재능 카드',
        subtitle: cardDeck.talent.treeKorean,
        description: cardDeck.talent.story,
        keywords: cardDeck.talent.keywords
      };
    case 'flow':
      return {
        title: '흐름 카드',
        subtitle: cardDeck.flow.phenomenonKorean,
        description: cardDeck.flow.story,
        keywords: cardDeck.flow.keywords
      };
    case 'fortune':
      return {
        title: '행운 카드',
        subtitle: `${cardDeck.fortune.luckyNumbers.join(' · ')}`,
        description: cardDeck.fortune.story,
        keywords: [`${cardDeck.fortune.luckyMonths[0]}월`, cardDeck.fortune.luckyDirection, cardDeck.fortune.luckyColor]
      };
    case 'guardian':
      return {
        title: '수호 카드',
        subtitle: `${cardDeck.guardian.mainGemKorean} & ${cardDeck.guardian.subGemKorean}`,
        description: cardDeck.guardian.story,
        keywords: cardDeck.guardian.keywords
      };
    default:
      return {
        title: '알 수 없는 카드',
        subtitle: '',
        description: '',
        keywords: []
      };
  }
}

// 카드 이미지 생성을 위한 프롬프트 생성
export function generateCardImagePrompt(cardDeck: CardDeck, userName: string): string {
  const styleGuide: Record<CardDeck['style'], string> = {
    minimal: 'flat design, pastel colors, clean lines, modern minimalist, simple shapes',
    traditional: 'Korean traditional art, ink wash painting, gold leaf accents, hanji texture, oriental',
    fantasy: 'mystical, cosmic, glowing effects, starry background, ethereal, magical',
    luxury: 'metallic finish, embossed effect, premium materials, elegant, sophisticated'
  };

  return `A sacred fortune card design featuring:
- Central symbol: ${cardDeck.energy.animalKorean} (${cardDeck.energy.animal})
- Surrounding flowers: ${cardDeck.essence.flowerKorean} (${cardDeck.essence.flower})
- Background elements: ${cardDeck.talent.treeKorean}, ${cardDeck.flow.phenomenonKorean}
- Decorative gems: ${cardDeck.guardian.mainGemKorean} crystals
- Lucky numbers: ${cardDeck.fortune.luckyNumbers.join(', ')} integrated as design elements

Style: ${styleGuide[cardDeck.style]}

The composition should feel protective, harmonious, and personally meaningful.
Vertical orientation (9:16 ratio), suitable for phone wallpaper.
Name to include: ${userName}`;
}
