// Heavenly Stems (천간)
const HEAVENLY_STEMS = ['甲', '乙', '丙', '丁', '戊', '己', '庚', '辛', '壬', '癸'];
const HEAVENLY_STEMS_KO = ['갑', '을', '병', '정', '무', '기', '경', '신', '임', '계'];
const HEAVENLY_STEMS_EN = ['Jia', 'Yi', 'Bing', 'Ding', 'Wu', 'Ji', 'Geng', 'Xin', 'Ren', 'Gui'];

// Earthly Branches (지지)
const EARTHLY_BRANCHES = ['子', '丑', '寅', '卯', '辰', '巳', '午', '未', '申', '酉', '戌', '亥'];
const EARTHLY_BRANCHES_KO = ['자', '축', '인', '묘', '진', '사', '오', '미', '신', '유', '술', '해'];
const EARTHLY_BRANCHES_EN = ['Zi', 'Chou', 'Yin', 'Mao', 'Chen', 'Si', 'Wu', 'Wei', 'Shen', 'You', 'Xu', 'Hai'];

// Zodiac animals
const ZODIAC_ANIMALS = ['Rat', 'Ox', 'Tiger', 'Rabbit', 'Dragon', 'Snake', 'Horse', 'Goat', 'Monkey', 'Rooster', 'Dog', 'Pig'];
const ZODIAC_ANIMALS_KO = ['쥐', '소', '호랑이', '토끼', '용', '뱀', '말', '양', '원숭이', '닭', '개', '돼지'];

// Five Elements (오행)
const FIVE_ELEMENTS = ['Wood', 'Fire', 'Earth', 'Metal', 'Water'];
const FIVE_ELEMENTS_KO = ['목', '화', '토', '금', '수'];

// Element mapping for stems and branches
const STEM_ELEMENTS = [0, 0, 1, 1, 2, 2, 3, 3, 4, 4]; // Wood, Wood, Fire, Fire, etc.
const BRANCH_ELEMENTS = [4, 2, 0, 0, 2, 1, 1, 2, 3, 3, 2, 4];

interface SajuInput {
  birthDate: Date;
  birthTime: string | null;
  gender: 'male' | 'female';
  isLunar: boolean;
}

interface Pillar {
  heavenly: string;
  earthly: string;
  element: string;
  heavenlyKo: string;
  earthlyKo: string;
  elementKo: string;
}

interface SajuResult {
  fourPillars: {
    year: Pillar;
    month: Pillar;
    day: Pillar;
    hour: Pillar;
  };
  zodiac: {
    animal: string;
    animalKo: string;
  };
  dominantElement: string;
  elementBalance: Record<string, number>;
  scores: {
    overall: number;
    wealth: number;
    love: number;
    career: number;
    health: number;
  };
  personality: string[];
  career: string[];
  relationships: string[];
  advice: string;
  keywords: string[];
  summary: {
    mainTrait: string;
    strength: string;
    weakness: string;
    luckyColor: string;
    luckyNumber: number;
    luckyDirection: string;
  };
}

// Calculate the stem and branch for a given date
function calculatePillar(year: number, month: number, day: number, hour: number): {
  yearPillar: { stem: number; branch: number };
  monthPillar: { stem: number; branch: number };
  dayPillar: { stem: number; branch: number };
  hourPillar: { stem: number; branch: number };
} {
  // Year pillar calculation
  const yearOffset = (year - 4) % 60;
  const yearStem = yearOffset % 10;
  const yearBranch = yearOffset % 12;

  // Simplified month pillar calculation
  const monthStem = (yearStem * 2 + month) % 10;
  const monthBranch = (month + 1) % 12;

  // Day pillar calculation (simplified - actual calculation is complex)
  const baseDate = new Date(1900, 0, 1);
  const targetDate = new Date(year, month - 1, day);
  const dayDiff = Math.floor((targetDate.getTime() - baseDate.getTime()) / (1000 * 60 * 60 * 24));
  const dayOffset = (dayDiff + 10) % 60;
  const dayStem = dayOffset % 10;
  const dayBranch = dayOffset % 12;

  // Hour pillar calculation
  const hourIndex = Math.floor((hour + 1) / 2) % 12;
  const hourStem = (dayStem * 2 + hourIndex) % 10;
  const hourBranch = hourIndex;

  return {
    yearPillar: { stem: yearStem, branch: yearBranch },
    monthPillar: { stem: monthStem, branch: monthBranch },
    dayPillar: { stem: dayStem, branch: dayBranch },
    hourPillar: { stem: hourStem, branch: hourBranch },
  };
}

function createPillar(stem: number, branch: number): Pillar {
  const elementIndex = STEM_ELEMENTS[stem];
  return {
    heavenly: HEAVENLY_STEMS[stem],
    earthly: EARTHLY_BRANCHES[branch],
    element: FIVE_ELEMENTS[elementIndex],
    heavenlyKo: HEAVENLY_STEMS_KO[stem],
    earthlyKo: EARTHLY_BRANCHES_KO[branch],
    elementKo: FIVE_ELEMENTS_KO[elementIndex],
  };
}

function calculateElementBalance(pillars: ReturnType<typeof calculatePillar>): Record<string, number> {
  const balance: Record<string, number> = {
    Wood: 0,
    Fire: 0,
    Earth: 0,
    Metal: 0,
    Water: 0,
  };

  // Count elements from stems
  [pillars.yearPillar.stem, pillars.monthPillar.stem, pillars.dayPillar.stem, pillars.hourPillar.stem].forEach(stem => {
    balance[FIVE_ELEMENTS[STEM_ELEMENTS[stem]]]++;
  });

  // Count elements from branches
  [pillars.yearPillar.branch, pillars.monthPillar.branch, pillars.dayPillar.branch, pillars.hourPillar.branch].forEach(branch => {
    balance[FIVE_ELEMENTS[BRANCH_ELEMENTS[branch]]]++;
  });

  return balance;
}

function generatePersonalityTraits(dominantElement: string, gender: string): string[] {
  const traits: Record<string, string[]> = {
    Wood: [
      'Natural leader with strong vision',
      'Compassionate and growth-oriented',
      'Sometimes inflexible in opinions',
      'Creative problem solver',
    ],
    Fire: [
      'Passionate and enthusiastic',
      'Charismatic and inspiring to others',
      'Quick-tempered but forgiving',
      'Natural entertainer and communicator',
    ],
    Earth: [
      'Stable and reliable personality',
      'Nurturing and supportive of others',
      'Practical approach to life',
      'Can be stubborn at times',
    ],
    Metal: [
      'Disciplined and organized',
      'Strong sense of justice',
      'High standards for self and others',
      'Excellent at precision work',
    ],
    Water: [
      'Intuitive and perceptive',
      'Adaptable to any situation',
      'Deep thinker and philosopher',
      'Sometimes overly emotional',
    ],
  };

  return traits[dominantElement] || traits.Water;
}

function generateCareerAdvice(dominantElement: string): string[] {
  const careers: Record<string, string[]> = {
    Wood: ['Education', 'Healthcare', 'Environmental work', 'Publishing', 'Agriculture'],
    Fire: ['Entertainment', 'Marketing', 'Public relations', 'Sports', 'Politics'],
    Earth: ['Real estate', 'Construction', 'Finance', 'Agriculture', 'Mining'],
    Metal: ['Technology', 'Engineering', 'Law', 'Military', 'Jewelry'],
    Water: ['Research', 'Shipping', 'Tourism', 'Communication', 'Arts'],
  };

  return careers[dominantElement] || careers.Water;
}

function generateScores(elementBalance: Record<string, number>, dominantElement: string): SajuResult['scores'] {
  // Generate somewhat random but consistent scores based on element balance
  const baseScore = 70;
  const variance = 20;

  const hash = (str: string) => {
    let h = 0;
    for (let i = 0; i < str.length; i++) {
      h = ((h << 5) - h) + str.charCodeAt(i);
    }
    return Math.abs(h);
  };

  const generateScore = (seed: string) => {
    const h = hash(dominantElement + seed);
    return baseScore + (h % variance);
  };

  return {
    overall: generateScore('overall'),
    wealth: generateScore('wealth'),
    love: generateScore('love'),
    career: generateScore('career'),
    health: generateScore('health'),
  };
}

export function calculateSaju(input: SajuInput): SajuResult {
  const { birthDate, birthTime, gender, isLunar } = input;

  const year = birthDate.getFullYear();
  const month = birthDate.getMonth() + 1;
  const day = birthDate.getDate();
  const hour = birthTime ? parseInt(birthTime.split(':')[0], 10) : 12;

  // Calculate pillars
  const pillars = calculatePillar(year, month, day, hour);

  // Create pillar objects
  const fourPillars = {
    year: createPillar(pillars.yearPillar.stem, pillars.yearPillar.branch),
    month: createPillar(pillars.monthPillar.stem, pillars.monthPillar.branch),
    day: createPillar(pillars.dayPillar.stem, pillars.dayPillar.branch),
    hour: createPillar(pillars.hourPillar.stem, pillars.hourPillar.branch),
  };

  // Calculate element balance
  const elementBalance = calculateElementBalance(pillars);

  // Find dominant element
  const dominantElement = Object.entries(elementBalance).reduce((a, b) =>
    a[1] > b[1] ? a : b
  )[0];

  // Get zodiac
  const zodiacIndex = pillars.yearPillar.branch;

  // Generate scores
  const scores = generateScores(elementBalance, dominantElement);

  // Generate traits and advice
  const personality = generatePersonalityTraits(dominantElement, gender);
  const career = generateCareerAdvice(dominantElement);

  const luckyColors: Record<string, string> = {
    Wood: 'Green',
    Fire: 'Red',
    Earth: 'Yellow',
    Metal: 'White',
    Water: 'Blue',
  };

  const luckyDirections: Record<string, string> = {
    Wood: 'East',
    Fire: 'South',
    Earth: 'Center',
    Metal: 'West',
    Water: 'North',
  };

  return {
    fourPillars,
    zodiac: {
      animal: ZODIAC_ANIMALS[zodiacIndex],
      animalKo: ZODIAC_ANIMALS_KO[zodiacIndex],
    },
    dominantElement,
    elementBalance,
    scores,
    personality,
    career,
    relationships: [
      `Best compatibility with ${ZODIAC_ANIMALS[(zodiacIndex + 4) % 12]} and ${ZODIAC_ANIMALS[(zodiacIndex + 8) % 12]}`,
      `Challenging relationships with ${ZODIAC_ANIMALS[(zodiacIndex + 6) % 12]}`,
      'Communication is key in all relationships',
    ],
    advice: `Your ${dominantElement} energy suggests focusing on balance this year. Career opportunities are strong, but remember to nurture personal relationships. Financial decisions should be made carefully after thorough research.`,
    keywords: [dominantElement, ZODIAC_ANIMALS[zodiacIndex], 'Growth', 'Balance', 'Opportunity'],
    summary: {
      mainTrait: personality[0],
      strength: personality[1],
      weakness: personality[2],
      luckyColor: luckyColors[dominantElement],
      luckyNumber: (zodiacIndex + 1) * 3,
      luckyDirection: luckyDirections[dominantElement],
    },
  };
}
