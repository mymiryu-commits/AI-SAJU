/**
 * 동물 DNA 분석 (Animal DNA Analysis)
 * 사주 기반 동물 성향과 MBTI 동물 비교 분석
 *
 * 9종 중복 동물: 여우, 사슴, 호랑이, 독수리, 사자, 곰, 코끼리, 늑대, 돌고래
 */

import type { SajuChart, OhengBalance, Element } from '@/types/saju';

// 동물 타입 (사주 + MBTI 공통 9종)
export type AnimalType =
  | 'fox'      // 여우 - 영리함, 전략적
  | 'deer'     // 사슴 - 온화함, 직관적
  | 'tiger'    // 호랑이 - 카리스마, 리더십
  | 'eagle'    // 독수리 - 비전, 통찰력
  | 'lion'     // 사자 - 용맹함, 권위
  | 'bear'     // 곰 - 인내력, 보호본능
  | 'elephant' // 코끼리 - 지혜, 기억력
  | 'wolf'     // 늑대 - 충성심, 협동
  | 'dolphin'; // 돌고래 - 친화력, 지능

// 동물 상세 정보
export interface AnimalProfile {
  type: AnimalType;
  name: {
    ko: string;
    ja: string;
    en: string;
  };
  emoji: string;
  traits: {
    ko: string[];
    ja: string[];
    en: string[];
  };
  strengths: {
    ko: string[];
    ja: string[];
    en: string[];
  };
  weaknesses: {
    ko: string[];
    ja: string[];
    en: string[];
  };
  elements: Element[];  // 관련 오행
  mbtiTypes: string[];  // 관련 MBTI
  description: {
    ko: string;
    ja: string;
    en: string;
  };
}

// 동물 프로필 데이터
export const ANIMAL_PROFILES: Record<AnimalType, AnimalProfile> = {
  fox: {
    type: 'fox',
    name: { ko: '여우', ja: 'キツネ', en: 'Fox' },
    emoji: '🦊',
    traits: {
      ko: ['영리함', '전략적 사고', '적응력'],
      ja: ['賢さ', '戦略的思考', '適応力'],
      en: ['Cleverness', 'Strategic Thinking', 'Adaptability'],
    },
    strengths: {
      ko: ['상황 판단이 빠름', '위기 대처 능력', '융통성'],
      ja: ['状況判断が速い', '危機対応能力', '柔軟性'],
      en: ['Quick situation assessment', 'Crisis management', 'Flexibility'],
    },
    weaknesses: {
      ko: ['과도한 계산', '신뢰 구축 어려움', '불안정성'],
      ja: ['過度な計算', '信頼構築の困難', '不安定性'],
      en: ['Over-calculation', 'Trust building difficulty', 'Instability'],
    },
    elements: ['water', 'wood'],
    mbtiTypes: ['ENTP', 'INTP', 'INTJ'],
    description: {
      ko: '예리한 지성과 전략적 사고로 어떤 상황에서도 최선의 방법을 찾아내는 타입입니다.',
      ja: '鋭い知性と戦略的思考で、どんな状況でも最善の方法を見つけ出すタイプです。',
      en: 'A type that finds the best solution in any situation with sharp intelligence and strategic thinking.',
    },
  },
  deer: {
    type: 'deer',
    name: { ko: '사슴', ja: '鹿', en: 'Deer' },
    emoji: '🦌',
    traits: {
      ko: ['온화함', '직관력', '섬세함'],
      ja: ['穏やかさ', '直感力', '繊細さ'],
      en: ['Gentleness', 'Intuition', 'Delicacy'],
    },
    strengths: {
      ko: ['공감 능력', '예술적 감각', '평화 유지'],
      ja: ['共感能力', '芸術的感覚', '平和維持'],
      en: ['Empathy', 'Artistic sense', 'Peace-keeping'],
    },
    weaknesses: {
      ko: ['우유부단함', '갈등 회피', '자기 주장 부족'],
      ja: ['優柔不断', '葛藤回避', '自己主張不足'],
      en: ['Indecisiveness', 'Conflict avoidance', 'Lack of assertiveness'],
    },
    elements: ['wood', 'water'],
    mbtiTypes: ['INFP', 'ISFP', 'INFJ'],
    description: {
      ko: '따뜻한 마음과 예민한 감수성으로 주변을 평화롭게 만드는 타입입니다.',
      ja: '温かい心と繊細な感受性で周りを平和にするタイプです。',
      en: 'A type that brings peace to surroundings with a warm heart and sensitive nature.',
    },
  },
  tiger: {
    type: 'tiger',
    name: { ko: '호랑이', ja: '虎', en: 'Tiger' },
    emoji: '🐯',
    traits: {
      ko: ['카리스마', '용맹함', '독립성'],
      ja: ['カリスマ', '勇猛さ', '独立性'],
      en: ['Charisma', 'Bravery', 'Independence'],
    },
    strengths: {
      ko: ['리더십', '추진력', '결단력'],
      ja: ['リーダーシップ', '推進力', '決断力'],
      en: ['Leadership', 'Drive', 'Decisiveness'],
    },
    weaknesses: {
      ko: ['고집', '타협 어려움', '급한 성격'],
      ja: ['頑固さ', '妥協の困難', '急な性格'],
      en: ['Stubbornness', 'Difficulty compromising', 'Impatience'],
    },
    elements: ['wood', 'fire'],
    mbtiTypes: ['ENTJ', 'ESTJ', 'ESTP'],
    description: {
      ko: '강한 카리스마와 추진력으로 목표를 향해 거침없이 나아가는 타입입니다.',
      ja: '強いカリスマと推進力で目標に向かって突き進むタイプです。',
      en: 'A type that fearlessly advances toward goals with strong charisma and drive.',
    },
  },
  eagle: {
    type: 'eagle',
    name: { ko: '독수리', ja: '鷲', en: 'Eagle' },
    emoji: '🦅',
    traits: {
      ko: ['통찰력', '비전', '고독함'],
      ja: ['洞察力', 'ビジョン', '孤独'],
      en: ['Insight', 'Vision', 'Solitude'],
    },
    strengths: {
      ko: ['큰 그림 파악', '전략적 시야', '집중력'],
      ja: ['全体像把握', '戦略的視野', '集中力'],
      en: ['Big picture thinking', 'Strategic vision', 'Focus'],
    },
    weaknesses: {
      ko: ['고독 선호', '세부사항 간과', '접근 어려움'],
      ja: ['孤独の好み', '細部の見落とし', '近づきにくさ'],
      en: ['Preference for solitude', 'Overlooking details', 'Unapproachability'],
    },
    elements: ['metal', 'fire'],
    mbtiTypes: ['INTJ', 'INFJ', 'ISTJ'],
    description: {
      ko: '높은 곳에서 전체를 조망하며 미래를 내다보는 통찰력 있는 타입입니다.',
      ja: '高い所から全体を見渡し、未来を見通す洞察力のあるタイプです。',
      en: 'An insightful type that overlooks the whole from above and foresees the future.',
    },
  },
  lion: {
    type: 'lion',
    name: { ko: '사자', ja: 'ライオン', en: 'Lion' },
    emoji: '🦁',
    traits: {
      ko: ['권위', '자부심', '당당함'],
      ja: ['権威', '自負心', '堂々さ'],
      en: ['Authority', 'Pride', 'Dignity'],
    },
    strengths: {
      ko: ['통솔력', '보호 본능', '자신감'],
      ja: ['統率力', '保護本能', '自信'],
      en: ['Command ability', 'Protective instinct', 'Confidence'],
    },
    weaknesses: {
      ko: ['자존심 강함', '지시적 태도', '안주 경향'],
      ja: ['自尊心の強さ', '指示的態度', '現状維持傾向'],
      en: ['Strong ego', 'Directive attitude', 'Complacency tendency'],
    },
    elements: ['fire', 'earth'],
    mbtiTypes: ['ESTJ', 'ENTJ', 'ENFJ'],
    description: {
      ko: '타고난 리더로서 당당한 자신감과 권위로 주변을 이끄는 타입입니다.',
      ja: '生まれながらのリーダーとして、堂々とした自信と権威で周りを導くタイプです。',
      en: 'A natural leader who leads with confident dignity and authority.',
    },
  },
  bear: {
    type: 'bear',
    name: { ko: '곰', ja: '熊', en: 'Bear' },
    emoji: '🐻',
    traits: {
      ko: ['인내력', '보호본능', '차분함'],
      ja: ['忍耐力', '保護本能', '落ち着き'],
      en: ['Patience', 'Protective instinct', 'Calmness'],
    },
    strengths: {
      ko: ['끈기', '신뢰성', '포용력'],
      ja: ['粘り強さ', '信頼性', '包容力'],
      en: ['Perseverance', 'Reliability', 'Embrace'],
    },
    weaknesses: {
      ko: ['느린 행동', '변화 저항', '과보호'],
      ja: ['遅い行動', '変化への抵抗', '過保護'],
      en: ['Slow action', 'Resistance to change', 'Overprotection'],
    },
    elements: ['earth', 'metal'],
    mbtiTypes: ['ISFJ', 'ISTJ', 'ESFJ'],
    description: {
      ko: '강한 인내력과 보호 본능으로 주변 사람들을 든든하게 지켜주는 타입입니다.',
      ja: '強い忍耐力と保護本能で周りの人々を頼もしく守るタイプです。',
      en: 'A type that reliably protects people around with strong patience and protective instincts.',
    },
  },
  elephant: {
    type: 'elephant',
    name: { ko: '코끼리', ja: '象', en: 'Elephant' },
    emoji: '🐘',
    traits: {
      ko: ['지혜', '기억력', '충성심'],
      ja: ['知恵', '記憶力', '忠誠心'],
      en: ['Wisdom', 'Memory', 'Loyalty'],
    },
    strengths: {
      ko: ['경험 활용', '가족 중시', '관계 유지'],
      ja: ['経験活用', '家族重視', '関係維持'],
      en: ['Experience utilization', 'Family focus', 'Relationship maintenance'],
    },
    weaknesses: {
      ko: ['과거 집착', '변화 거부', '느린 적응'],
      ja: ['過去への執着', '変化拒否', '遅い適応'],
      en: ['Past fixation', 'Change rejection', 'Slow adaptation'],
    },
    elements: ['earth', 'water'],
    mbtiTypes: ['INFJ', 'ISFJ', 'ENFJ'],
    description: {
      ko: '깊은 지혜와 뛰어난 기억력으로 경험을 바탕으로 현명한 판단을 내리는 타입입니다.',
      ja: '深い知恵と優れた記憶力で経験を基に賢明な判断を下すタイプです。',
      en: 'A type that makes wise decisions based on experience with deep wisdom and excellent memory.',
    },
  },
  wolf: {
    type: 'wolf',
    name: { ko: '늑대', ja: '狼', en: 'Wolf' },
    emoji: '🐺',
    traits: {
      ko: ['충성심', '협동심', '전략성'],
      ja: ['忠誠心', '協調性', '戦略性'],
      en: ['Loyalty', 'Teamwork', 'Strategic mind'],
    },
    strengths: {
      ko: ['팀워크', '목표 지향', '신뢰 구축'],
      ja: ['チームワーク', '目標指向', '信頼構築'],
      en: ['Teamwork', 'Goal orientation', 'Trust building'],
    },
    weaknesses: {
      ko: ['집단 의존', '외부인 경계', '융통성 부족'],
      ja: ['集団依存', '部外者への警戒', '柔軟性不足'],
      en: ['Group dependency', 'Wariness of outsiders', 'Lack of flexibility'],
    },
    elements: ['metal', 'wood'],
    mbtiTypes: ['ISTP', 'ESTP', 'ENFP'],
    description: {
      ko: '강한 유대감과 충성심으로 팀을 위해 헌신하며, 함께 목표를 달성하는 타입입니다.',
      ja: '強い絆と忠誠心でチームのために献身し、共に目標を達成するタイプです。',
      en: 'A type that dedicates to the team with strong bonds and loyalty, achieving goals together.',
    },
  },
  dolphin: {
    type: 'dolphin',
    name: { ko: '돌고래', ja: 'イルカ', en: 'Dolphin' },
    emoji: '🐬',
    traits: {
      ko: ['친화력', '지능', '유쾌함'],
      ja: ['親和力', '知性', '愉快さ'],
      en: ['Affability', 'Intelligence', 'Cheerfulness'],
    },
    strengths: {
      ko: ['소통 능력', '적응력', '긍정성'],
      ja: ['コミュニケーション能力', '適応力', '肯定性'],
      en: ['Communication skills', 'Adaptability', 'Positivity'],
    },
    weaknesses: {
      ko: ['깊이 부족', '산만함', '진지함 결여'],
      ja: ['深みの欠如', '散漫さ', '真剣さの欠如'],
      en: ['Lack of depth', 'Distractibility', 'Lack of seriousness'],
    },
    elements: ['water', 'fire'],
    mbtiTypes: ['ENFP', 'ESFP', 'ENTP'],
    description: {
      ko: '밝은 에너지와 뛰어난 소통 능력으로 어디서든 분위기 메이커가 되는 타입입니다.',
      ja: '明るいエネルギーと優れたコミュニケーション能力で、どこでも雰囲気メーカーになるタイプです。',
      en: 'A type that becomes the mood maker anywhere with bright energy and excellent communication skills.',
    },
  },
};

// 동물 호환성 매트릭스
export const ANIMAL_COMPATIBILITY: Record<AnimalType, {
  best: AnimalType[];
  good: AnimalType[];
  neutral: AnimalType[];
  challenging: AnimalType[];
}> = {
  fox: {
    best: ['eagle', 'wolf'],
    good: ['dolphin', 'deer'],
    neutral: ['elephant', 'bear'],
    challenging: ['lion', 'tiger'],
  },
  deer: {
    best: ['bear', 'elephant'],
    good: ['dolphin', 'fox'],
    neutral: ['wolf', 'eagle'],
    challenging: ['tiger', 'lion'],
  },
  tiger: {
    best: ['lion', 'wolf'],
    good: ['eagle', 'bear'],
    neutral: ['dolphin', 'elephant'],
    challenging: ['fox', 'deer'],
  },
  eagle: {
    best: ['fox', 'elephant'],
    good: ['tiger', 'wolf'],
    neutral: ['lion', 'bear'],
    challenging: ['dolphin', 'deer'],
  },
  lion: {
    best: ['tiger', 'bear'],
    good: ['elephant', 'wolf'],
    neutral: ['eagle', 'dolphin'],
    challenging: ['fox', 'deer'],
  },
  bear: {
    best: ['deer', 'lion'],
    good: ['elephant', 'wolf'],
    neutral: ['dolphin', 'fox'],
    challenging: ['tiger', 'eagle'],
  },
  elephant: {
    best: ['deer', 'eagle'],
    good: ['bear', 'lion'],
    neutral: ['fox', 'wolf'],
    challenging: ['dolphin', 'tiger'],
  },
  wolf: {
    best: ['tiger', 'fox'],
    good: ['bear', 'eagle'],
    neutral: ['lion', 'deer'],
    challenging: ['dolphin', 'elephant'],
  },
  dolphin: {
    best: ['deer', 'fox'],
    good: ['lion', 'wolf'],
    neutral: ['bear', 'tiger'],
    challenging: ['eagle', 'elephant'],
  },
};

// 띠별 기본 동물 매핑 (12지지 → 9종 동물)
const ZODIAC_TO_ANIMAL: Record<string, AnimalType> = {
  '子': 'fox',       // 쥐 → 여우 (영리함)
  '丑': 'bear',      // 소 → 곰 (인내)
  '寅': 'tiger',     // 호랑이 → 호랑이
  '卯': 'deer',      // 토끼 → 사슴 (온화함)
  '辰': 'eagle',     // 용 → 독수리 (비전)
  '巳': 'fox',       // 뱀 → 여우 (전략)
  '午': 'lion',      // 말 → 사자 (열정)
  '未': 'deer',      // 양 → 사슴 (온화함)
  '申': 'dolphin',   // 원숭이 → 돌고래 (지능)
  '酉': 'eagle',     // 닭 → 독수리 (통찰)
  '戌': 'wolf',      // 개 → 늑대 (충성)
  '亥': 'bear',      // 돼지 → 곰 (포용)
};

// MBTI별 동물 매핑
const MBTI_TO_ANIMAL: Record<string, AnimalType> = {
  'INTJ': 'eagle',
  'INTP': 'fox',
  'ENTJ': 'tiger',
  'ENTP': 'fox',
  'INFJ': 'elephant',
  'INFP': 'deer',
  'ENFJ': 'lion',
  'ENFP': 'dolphin',
  'ISTJ': 'bear',
  'ISFJ': 'bear',
  'ESTJ': 'lion',
  'ESFJ': 'elephant',
  'ISTP': 'wolf',
  'ISFP': 'deer',
  'ESTP': 'tiger',
  'ESFP': 'dolphin',
};

// 오행별 동물 가중치
const ELEMENT_ANIMAL_WEIGHTS: Record<Element, Partial<Record<AnimalType, number>>> = {
  wood: { tiger: 3, deer: 2, wolf: 2, fox: 1 },
  fire: { lion: 3, tiger: 2, dolphin: 2, eagle: 1 },
  earth: { bear: 3, elephant: 2, lion: 1 },
  metal: { eagle: 3, wolf: 2, bear: 1, fox: 1 },
  water: { dolphin: 3, fox: 2, deer: 1, elephant: 1 },
};

/**
 * 사주 기반 동물 DNA 계산
 */
export function calculateSajuAnimal(saju: SajuChart, oheng: OhengBalance): {
  primary: AnimalType;
  secondary: AnimalType;
  scores: Record<AnimalType, number>;
} {
  const scores: Record<AnimalType, number> = {
    fox: 0, deer: 0, tiger: 0, eagle: 0, lion: 0,
    bear: 0, elephant: 0, wolf: 0, dolphin: 0,
  };

  // 1. 일지(일간 지지) 기반 기본 동물 (가장 높은 가중치)
  const dayBranch = saju.day.earthlyBranch;
  if (ZODIAC_TO_ANIMAL[dayBranch]) {
    scores[ZODIAC_TO_ANIMAL[dayBranch]] += 30;
  }

  // 2. 연지(년 지지) 기반 (띠)
  const yearBranch = saju.year.earthlyBranch;
  if (ZODIAC_TO_ANIMAL[yearBranch]) {
    scores[ZODIAC_TO_ANIMAL[yearBranch]] += 15;
  }

  // 3. 오행 기반 가중치
  for (const [element, balance] of Object.entries(oheng) as [Element, number][]) {
    const weights = ELEMENT_ANIMAL_WEIGHTS[element];
    if (weights) {
      for (const [animal, weight] of Object.entries(weights) as [AnimalType, number][]) {
        scores[animal] += weight * balance;
      }
    }
  }

  // 4. 일간(천간) 성향 반영
  const dayMasterElement = getDayMasterElement(saju.day.heavenlyStem);
  if (dayMasterElement) {
    const weights = ELEMENT_ANIMAL_WEIGHTS[dayMasterElement];
    if (weights) {
      for (const [animal, weight] of Object.entries(weights) as [AnimalType, number][]) {
        scores[animal] += weight * 2;
      }
    }
  }

  // 정렬하여 1, 2위 추출
  const sorted = Object.entries(scores)
    .sort(([, a], [, b]) => b - a) as [AnimalType, number][];

  return {
    primary: sorted[0][0],
    secondary: sorted[1][0],
    scores,
  };
}

/**
 * MBTI 기반 동물 계산
 */
export function calculateMbtiAnimal(mbti: string): AnimalType | null {
  const normalized = mbti.toUpperCase();
  return MBTI_TO_ANIMAL[normalized] || null;
}

/**
 * 동물 DNA 비교 분석
 */
export interface AnimalDnaComparison {
  sajuAnimal: {
    primary: AnimalProfile;
    secondary: AnimalProfile;
  };
  mbtiAnimal: AnimalProfile | null;
  matchLevel: 'perfect' | 'good' | 'moderate' | 'different';
  matchDescription: {
    ko: string;
    ja: string;
    en: string;
  };
  synergyPoints: {
    ko: string[];
    ja: string[];
    en: string[];
  };
  conflictPoints: {
    ko: string[];
    ja: string[];
    en: string[];
  };
  advice: {
    ko: string;
    ja: string;
    en: string;
  };
}

export function compareAnimalDna(
  saju: SajuChart,
  oheng: OhengBalance,
  mbti?: string
): AnimalDnaComparison {
  const sajuResult = calculateSajuAnimal(saju, oheng);
  const mbtiAnimal = mbti ? calculateMbtiAnimal(mbti) : null;

  const primaryProfile = ANIMAL_PROFILES[sajuResult.primary];
  const secondaryProfile = ANIMAL_PROFILES[sajuResult.secondary];
  const mbtiProfile = mbtiAnimal ? ANIMAL_PROFILES[mbtiAnimal] : null;

  // 매칭 레벨 결정
  let matchLevel: AnimalDnaComparison['matchLevel'] = 'different';
  if (mbtiAnimal) {
    if (mbtiAnimal === sajuResult.primary) {
      matchLevel = 'perfect';
    } else if (mbtiAnimal === sajuResult.secondary) {
      matchLevel = 'good';
    } else if (
      ANIMAL_COMPATIBILITY[sajuResult.primary].best.includes(mbtiAnimal) ||
      ANIMAL_COMPATIBILITY[sajuResult.primary].good.includes(mbtiAnimal)
    ) {
      matchLevel = 'moderate';
    }
  }

  // 매칭 설명
  const matchDescriptions: Record<typeof matchLevel, { ko: string; ja: string; en: string }> = {
    perfect: {
      ko: '완벽한 조화! 사주와 MBTI 동물이 일치하여 타고난 성향이 명확합니다.',
      ja: '完璧な調和！四柱とMBTI動物が一致し、生まれつきの性向が明確です。',
      en: 'Perfect harmony! Your innate tendencies are clear as Saju and MBTI animals match.',
    },
    good: {
      ko: '좋은 조화! 보조 동물과 MBTI가 일치하여 잠재된 성향을 활용할 수 있습니다.',
      ja: '良い調和！補助動物とMBTIが一致し、潜在的な性向を活かせます。',
      en: 'Good harmony! You can utilize latent tendencies as secondary animal matches MBTI.',
    },
    moderate: {
      ko: '보완적 관계. 서로 다른 성향이 균형을 이룹니다.',
      ja: '補完的関係。異なる性向がバランスを取ります。',
      en: 'Complementary relationship. Different tendencies create balance.',
    },
    different: {
      ko: '독특한 조합. 다양한 성향을 가지고 있어 상황에 따라 유연하게 대처할 수 있습니다.',
      ja: 'ユニークな組み合わせ。様々な性向を持ち、状況に応じて柔軟に対応できます。',
      en: 'Unique combination. Having diverse tendencies allows flexible responses to situations.',
    },
  };

  // 시너지 포인트
  const synergyPoints = {
    ko: [] as string[],
    ja: [] as string[],
    en: [] as string[],
  };

  // 사주 동물 강점
  synergyPoints.ko.push(
    `${primaryProfile.name.ko}의 ${primaryProfile.strengths.ko[0]}`,
    `${primaryProfile.name.ko}의 ${primaryProfile.strengths.ko[1]}`,
  );
  synergyPoints.ja.push(
    `${primaryProfile.name.ja}の${primaryProfile.strengths.ja[0]}`,
    `${primaryProfile.name.ja}の${primaryProfile.strengths.ja[1]}`,
  );
  synergyPoints.en.push(
    `${primaryProfile.name.en}'s ${primaryProfile.strengths.en[0]}`,
    `${primaryProfile.name.en}'s ${primaryProfile.strengths.en[1]}`,
  );

  if (mbtiProfile && matchLevel !== 'different') {
    synergyPoints.ko.push(`${mbtiProfile.name.ko}의 ${mbtiProfile.strengths.ko[0]}`);
    synergyPoints.ja.push(`${mbtiProfile.name.ja}の${mbtiProfile.strengths.ja[0]}`);
    synergyPoints.en.push(`${mbtiProfile.name.en}'s ${mbtiProfile.strengths.en[0]}`);
  }

  // 충돌 포인트
  const conflictPoints = {
    ko: primaryProfile.weaknesses.ko.slice(0, 2),
    ja: primaryProfile.weaknesses.ja.slice(0, 2),
    en: primaryProfile.weaknesses.en.slice(0, 2),
  };

  // 조언
  const advice = {
    ko: matchLevel === 'perfect' || matchLevel === 'good'
      ? `${primaryProfile.name.ko}의 타고난 강점을 적극 활용하세요. ${primaryProfile.traits.ko[0]}이(가) 당신의 핵심 경쟁력입니다.`
      : `${primaryProfile.name.ko}의 특성과 함께 ${mbtiProfile?.name.ko || secondaryProfile.name.ko}의 장점을 조화롭게 발휘하세요.`,
    ja: matchLevel === 'perfect' || matchLevel === 'good'
      ? `${primaryProfile.name.ja}の生まれつきの強みを積極的に活かしてください。${primaryProfile.traits.ja[0]}があなたの核心競争力です。`
      : `${primaryProfile.name.ja}の特性と${mbtiProfile?.name.ja || secondaryProfile.name.ja}の長所を調和させてください。`,
    en: matchLevel === 'perfect' || matchLevel === 'good'
      ? `Actively utilize the ${primaryProfile.name.en}'s innate strengths. ${primaryProfile.traits.en[0]} is your core competency.`
      : `Harmonize the ${primaryProfile.name.en}'s characteristics with the advantages of the ${mbtiProfile?.name.en || secondaryProfile.name.en}.`,
  };

  return {
    sajuAnimal: {
      primary: primaryProfile,
      secondary: secondaryProfile,
    },
    mbtiAnimal: mbtiProfile,
    matchLevel,
    matchDescription: matchDescriptions[matchLevel],
    synergyPoints,
    conflictPoints,
    advice,
  };
}

/**
 * 일간 오행 추출
 */
function getDayMasterElement(heavenlyStem: string): Element | null {
  const stemElements: Record<string, Element> = {
    '甲': 'wood', '乙': 'wood',
    '丙': 'fire', '丁': 'fire',
    '戊': 'earth', '己': 'earth',
    '庚': 'metal', '辛': 'metal',
    '壬': 'water', '癸': 'water',
  };
  return stemElements[heavenlyStem] || null;
}

/**
 * 두 사람의 동물 궁합 분석
 */
export function analyzeAnimalCompatibility(
  animal1: AnimalType,
  animal2: AnimalType
): {
  level: 'best' | 'good' | 'neutral' | 'challenging';
  score: number;
  description: { ko: string; ja: string; en: string };
} {
  const compat = ANIMAL_COMPATIBILITY[animal1];
  const profile1 = ANIMAL_PROFILES[animal1];
  const profile2 = ANIMAL_PROFILES[animal2];

  let level: 'best' | 'good' | 'neutral' | 'challenging';
  let score: number;

  if (compat.best.includes(animal2)) {
    level = 'best';
    score = 95;
  } else if (compat.good.includes(animal2)) {
    level = 'good';
    score = 80;
  } else if (compat.neutral.includes(animal2)) {
    level = 'neutral';
    score = 60;
  } else {
    level = 'challenging';
    score = 40;
  }

  const descriptions: Record<typeof level, { ko: string; ja: string; en: string }> = {
    best: {
      ko: `${profile1.name.ko}와(과) ${profile2.name.ko}는 최고의 파트너십을 형성합니다.`,
      ja: `${profile1.name.ja}と${profile2.name.ja}は最高のパートナーシップを形成します。`,
      en: `${profile1.name.en} and ${profile2.name.en} form the best partnership.`,
    },
    good: {
      ko: `${profile1.name.ko}와(과) ${profile2.name.ko}는 서로를 잘 보완합니다.`,
      ja: `${profile1.name.ja}と${profile2.name.ja}は互いを補完します。`,
      en: `${profile1.name.en} and ${profile2.name.en} complement each other well.`,
    },
    neutral: {
      ko: `${profile1.name.ko}와(과) ${profile2.name.ko}는 무난한 관계를 유지할 수 있습니다.`,
      ja: `${profile1.name.ja}と${profile2.name.ja}は無難な関係を維持できます。`,
      en: `${profile1.name.en} and ${profile2.name.en} can maintain a neutral relationship.`,
    },
    challenging: {
      ko: `${profile1.name.ko}와(과) ${profile2.name.ko}는 서로 노력이 필요한 관계입니다.`,
      ja: `${profile1.name.ja}と${profile2.name.ja}は互いに努力が必要な関係です。`,
      en: `${profile1.name.en} and ${profile2.name.en} need effort in their relationship.`,
    },
  };

  return {
    level,
    score,
    description: descriptions[level],
  };
}

// 모든 동물 목록 내보내기
export const ANIMAL_TYPES: AnimalType[] = [
  'fox', 'deer', 'tiger', 'eagle', 'lion', 'bear', 'elephant', 'wolf', 'dolphin'
];
