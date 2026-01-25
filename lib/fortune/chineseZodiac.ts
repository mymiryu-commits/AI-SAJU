/**
 * 띠별 운세 (Chinese Zodiac Fortune) Library
 * 12간지 동물띠 기반 운세 분석
 */

// 12간지 동물띠 데이터
export const CHINESE_ZODIAC = {
  rat: {
    name: '쥐',
    korean: '자(子)',
    emoji: '🐀',
    element: 'water',
    years: [1924, 1936, 1948, 1960, 1972, 1984, 1996, 2008, 2020],
    personality: ['영리함', '적응력', '사교성', '민첩함'],
    strengths: ['뛰어난 직감', '재물운이 좋음', '위기 대처 능력'],
    weaknesses: ['걱정이 많음', '욕심이 과할 수 있음'],
    bestMatch: ['dragon', 'monkey', 'ox'],
    worstMatch: ['horse', 'rooster'],
    luckyColors: ['파란색', '금색', '녹색'],
    luckyNumbers: [2, 3],
    luckyDirection: '북쪽',
  },
  ox: {
    name: '소',
    korean: '축(丑)',
    emoji: '🐂',
    element: 'earth',
    years: [1925, 1937, 1949, 1961, 1973, 1985, 1997, 2009, 2021],
    personality: ['성실함', '인내심', '책임감', '신뢰성'],
    strengths: ['꾸준한 노력', '안정적인 성취', '믿음직함'],
    weaknesses: ['고집이 셈', '변화를 싫어함'],
    bestMatch: ['rat', 'snake', 'rooster'],
    worstMatch: ['tiger', 'dragon', 'horse', 'sheep'],
    luckyColors: ['흰색', '노란색', '녹색'],
    luckyNumbers: [1, 4],
    luckyDirection: '남쪽',
  },
  tiger: {
    name: '호랑이',
    korean: '인(寅)',
    emoji: '🐅',
    element: 'wood',
    years: [1926, 1938, 1950, 1962, 1974, 1986, 1998, 2010, 2022],
    personality: ['용감함', '자신감', '리더십', '열정'],
    strengths: ['카리스마', '추진력', '정의로움'],
    weaknesses: ['성급함', '독단적일 수 있음'],
    bestMatch: ['dragon', 'horse', 'pig'],
    worstMatch: ['ox', 'tiger', 'snake', 'monkey'],
    luckyColors: ['파란색', '회색', '주황색'],
    luckyNumbers: [1, 3, 4],
    luckyDirection: '동쪽',
  },
  rabbit: {
    name: '토끼',
    korean: '묘(卯)',
    emoji: '🐇',
    element: 'wood',
    years: [1927, 1939, 1951, 1963, 1975, 1987, 1999, 2011, 2023],
    personality: ['온화함', '친절함', '예술성', '섬세함'],
    strengths: ['외교술', '평화 유지', '예술적 감각'],
    weaknesses: ['우유부단함', '소심할 수 있음'],
    bestMatch: ['sheep', 'pig', 'dog'],
    worstMatch: ['snake', 'rooster'],
    luckyColors: ['빨간색', '분홍색', '보라색', '파란색'],
    luckyNumbers: [3, 4, 6],
    luckyDirection: '동쪽',
  },
  dragon: {
    name: '용',
    korean: '진(辰)',
    emoji: '🐉',
    element: 'earth',
    years: [1928, 1940, 1952, 1964, 1976, 1988, 2000, 2012, 2024],
    personality: ['야망', '에너지', '카리스마', '자신감'],
    strengths: ['성공 기질', '창의성', '권위'],
    weaknesses: ['오만함', '참을성 부족'],
    bestMatch: ['rooster', 'rat', 'monkey'],
    worstMatch: ['ox', 'sheep', 'dog'],
    luckyColors: ['금색', '은색', '회색'],
    luckyNumbers: [1, 6, 7],
    luckyDirection: '동쪽',
  },
  snake: {
    name: '뱀',
    korean: '사(巳)',
    emoji: '🐍',
    element: 'fire',
    years: [1929, 1941, 1953, 1965, 1977, 1989, 2001, 2013, 2025],
    personality: ['지혜', '신비로움', '직관력', '우아함'],
    strengths: ['통찰력', '결단력', '매력'],
    weaknesses: ['의심이 많음', '질투심'],
    bestMatch: ['dragon', 'rooster'],
    worstMatch: ['tiger', 'rabbit', 'snake', 'pig'],
    luckyColors: ['검은색', '빨간색', '노란색'],
    luckyNumbers: [2, 8, 9],
    luckyDirection: '남쪽',
  },
  horse: {
    name: '말',
    korean: '오(午)',
    emoji: '🐎',
    element: 'fire',
    years: [1930, 1942, 1954, 1966, 1978, 1990, 2002, 2014, 2026],
    personality: ['활동적', '자유로움', '긍정적', '사교적'],
    strengths: ['열정', '독립심', '빠른 판단'],
    weaknesses: ['참을성 부족', '무모함'],
    bestMatch: ['tiger', 'sheep', 'rabbit'],
    worstMatch: ['rat', 'ox', 'rooster', 'horse'],
    luckyColors: ['노란색', '녹색'],
    luckyNumbers: [2, 3, 7],
    luckyDirection: '남쪽',
  },
  sheep: {
    name: '양',
    korean: '미(未)',
    emoji: '🐑',
    element: 'earth',
    years: [1931, 1943, 1955, 1967, 1979, 1991, 2003, 2015, 2027],
    personality: ['온순함', '예술성', '동정심', '평화로움'],
    strengths: ['창의력', '친절함', '배려심'],
    weaknesses: ['의존적', '비관적일 수 있음'],
    bestMatch: ['horse', 'rabbit', 'pig'],
    worstMatch: ['ox', 'tiger', 'dog'],
    luckyColors: ['녹색', '빨간색', '보라색'],
    luckyNumbers: [2, 7],
    luckyDirection: '남쪽',
  },
  monkey: {
    name: '원숭이',
    korean: '신(申)',
    emoji: '🐵',
    element: 'metal',
    years: [1932, 1944, 1956, 1968, 1980, 1992, 2004, 2016, 2028],
    personality: ['영리함', '재치', '호기심', '다재다능'],
    strengths: ['문제 해결력', '적응력', '유머'],
    weaknesses: ['장난기', '불안정할 수 있음'],
    bestMatch: ['ox', 'rabbit'],
    worstMatch: ['tiger', 'pig'],
    luckyColors: ['흰색', '파란색', '금색'],
    luckyNumbers: [4, 9],
    luckyDirection: '서쪽',
  },
  rooster: {
    name: '닭',
    korean: '유(酉)',
    emoji: '🐓',
    element: 'metal',
    years: [1933, 1945, 1957, 1969, 1981, 1993, 2005, 2017, 2029],
    personality: ['근면함', '정직함', '용감함', '자신감'],
    strengths: ['부지런함', '관찰력', '솔직함'],
    weaknesses: ['비판적', '완고함'],
    bestMatch: ['ox', 'snake'],
    worstMatch: ['rat', 'rabbit', 'horse', 'rooster', 'dog'],
    luckyColors: ['금색', '갈색', '노란색'],
    luckyNumbers: [5, 7, 8],
    luckyDirection: '서쪽',
  },
  dog: {
    name: '개',
    korean: '술(戌)',
    emoji: '🐕',
    element: 'earth',
    years: [1934, 1946, 1958, 1970, 1982, 1994, 2006, 2018, 2030],
    personality: ['충성심', '정직함', '신뢰성', '보호 본능'],
    strengths: ['의리', '공정함', '헌신'],
    weaknesses: ['걱정이 많음', '고집이 셈'],
    bestMatch: ['rabbit'],
    worstMatch: ['dragon', 'sheep', 'rooster'],
    luckyColors: ['빨간색', '녹색', '보라색'],
    luckyNumbers: [3, 4, 9],
    luckyDirection: '동쪽',
  },
  pig: {
    name: '돼지',
    korean: '해(亥)',
    emoji: '🐷',
    element: 'water',
    years: [1935, 1947, 1959, 1971, 1983, 1995, 2007, 2019, 2031],
    personality: ['너그러움', '진실함', '관대함', '낙천적'],
    strengths: ['성실함', '인내심', '행운'],
    weaknesses: ['순진함', '게으름'],
    bestMatch: ['tiger', 'rabbit', 'sheep'],
    worstMatch: ['snake', 'monkey'],
    luckyColors: ['노란색', '회색', '갈색', '금색'],
    luckyNumbers: [2, 5, 8],
    luckyDirection: '북쪽',
  },
} as const;

export type ChineseZodiacSign = keyof typeof CHINESE_ZODIAC;

const ZODIAC_ORDER: ChineseZodiacSign[] = [
  'rat', 'ox', 'tiger', 'rabbit', 'dragon', 'snake',
  'horse', 'sheep', 'monkey', 'rooster', 'dog', 'pig'
];

/**
 * 태어난 해로 띠 계산
 */
export function getChineseZodiac(year: number): ChineseZodiacSign {
  // 1900년은 쥐띠
  const index = (year - 1900) % 12;
  return ZODIAC_ORDER[index >= 0 ? index : index + 12];
}

/**
 * 날짜 기반 일일 운세 생성 (띠별)
 */
export function generateDailyZodiacFortune(sign: ChineseZodiacSign, date: Date = new Date()) {
  const seed = date.getFullYear() * 10000 + (date.getMonth() + 1) * 100 + date.getDate();
  const signIndex = ZODIAC_ORDER.indexOf(sign);

  const random = (min: number, max: number, offset: number = 0) => {
    const x = Math.sin((seed + signIndex * 1000 + offset) * 9999) * 10000;
    return Math.floor((x - Math.floor(x)) * (max - min + 1)) + min;
  };

  const overallScore = random(55, 95, 1);
  const wealthScore = random(50, 98, 2);
  const loveScore = random(45, 95, 3);
  const careerScore = random(55, 95, 4);
  const healthScore = random(50, 92, 5);

  const dailyAdvices = [
    '오늘은 새로운 기회가 찾아올 수 있는 날입니다. 열린 마음으로 주변을 살펴보세요.',
    '차분한 마음으로 하루를 시작하면 좋은 결과를 얻을 수 있습니다.',
    '인간관계에서 따뜻한 대화가 행운을 가져다줄 것입니다.',
    '오늘은 중요한 결정을 내리기에 좋은 날입니다. 직감을 믿으세요.',
    '주변 사람들과의 협력이 성공의 열쇠가 될 것입니다.',
    '자신을 믿고 나아가세요. 당신의 노력이 빛을 발할 때입니다.',
    '오늘 만나는 사람 중에 귀인이 있을 수 있습니다. 모든 만남을 소중히 여기세요.',
    '재물운이 상승하는 날입니다. 투자나 사업에 관심을 기울여 보세요.',
  ];

  const cautions = [
    '급한 결정은 피하고 신중하게 생각하세요.',
    '건강 관리에 특별히 신경 쓰는 것이 좋겠습니다.',
    '감정적인 대응보다는 이성적인 판단이 필요합니다.',
    '과도한 지출을 조심하세요.',
    '타인의 말에 너무 휘둘리지 마세요.',
    '무리한 일정은 피하고 충분한 휴식을 취하세요.',
  ];

  const luckyTimes = ['오전 9시-11시', '정오 12시-오후 2시', '오후 3시-5시', '저녁 6시-8시'];
  const luckyActivities = [
    '산책하기', '중요한 회의', '새로운 프로젝트 시작', '친구 만남',
    '독서', '운동', '쇼핑', '학습', '명상', '창작 활동'
  ];

  const zodiacData = CHINESE_ZODIAC[sign];

  return {
    sign,
    signInfo: zodiacData,
    date: date.toISOString().split('T')[0],
    scores: {
      overall: overallScore,
      wealth: wealthScore,
      love: loveScore,
      career: careerScore,
      health: healthScore,
    },
    fortune: {
      overall: getFortuneText(overallScore, '종합'),
      wealth: getFortuneText(wealthScore, '재물'),
      love: getFortuneText(loveScore, '애정'),
      career: getFortuneText(careerScore, '직장'),
      health: getFortuneText(healthScore, '건강'),
    },
    advice: dailyAdvices[random(0, dailyAdvices.length - 1, 10)],
    caution: cautions[random(0, cautions.length - 1, 11)],
    luckyTime: luckyTimes[random(0, luckyTimes.length - 1, 12)],
    luckyActivity: luckyActivities[random(0, luckyActivities.length - 1, 13)],
    luckyColor: zodiacData.luckyColors[random(0, zodiacData.luckyColors.length - 1, 14)],
    luckyNumber: zodiacData.luckyNumbers[random(0, zodiacData.luckyNumbers.length - 1, 15)],
    luckyDirection: zodiacData.luckyDirection,
  };
}

function getFortuneText(score: number, category: string): string {
  const fortunes: Record<string, string[]> = {
    종합: [
      '오늘은 조용히 힘을 비축하는 날입니다.',
      '평온한 하루가 될 것입니다. 안정을 추구하세요.',
      '좋은 기운이 감돌고 있습니다. 적극적으로 행동하세요.',
      '모든 일이 순조롭게 풀리는 날입니다!',
      '최상의 운이 함께합니다. 도전하세요!',
    ],
    재물: [
      '지출에 주의하세요. 불필요한 소비를 피하세요.',
      '안정적인 재정 운용을 권합니다.',
      '작은 수익의 기회가 있을 수 있습니다.',
      '재물운이 상승 중입니다. 기회를 놓치지 마세요!',
      '뜻밖의 수입이 생길 수 있는 날입니다!',
    ],
    애정: [
      '연인과의 소통에 주의하세요.',
      '평화로운 관계 유지가 중요합니다.',
      '새로운 만남에 긍정적인 기운이 있습니다.',
      '사랑하는 사람과 좋은 시간을 보낼 수 있습니다.',
      '로맨틱한 기운이 가득한 날입니다!',
    ],
    직장: [
      '업무에 집중하기 어려울 수 있으니 차분하게.',
      '꾸준한 노력이 필요한 시기입니다.',
      '동료들과의 협업이 좋은 결과를 가져옵니다.',
      '업무 성과가 인정받을 수 있는 날입니다!',
      '승진이나 새로운 기회가 찾아올 수 있습니다!',
    ],
    건강: [
      '충분한 휴식을 취하세요.',
      '가벼운 운동으로 활력을 유지하세요.',
      '건강한 식단으로 활력을 채우세요.',
      '활력이 넘치는 날입니다!',
      '최상의 컨디션을 유지할 수 있습니다!',
    ],
  };

  const texts = fortunes[category] || fortunes['종합'];
  const index = Math.min(Math.floor(score / 20), texts.length - 1);
  return texts[index];
}

/**
 * 2026년 신년 운세 생성
 */
export function generateNewYearFortune(sign: ChineseZodiacSign, birthYear: number) {
  const zodiacData = CHINESE_ZODIAC[sign];
  const currentYear = 2026;
  const currentYearZodiac = getChineseZodiac(currentYear); // 2026 = 말띠 해

  // 띠별 상성 계산
  const isGoodMatch = (zodiacData.bestMatch as readonly string[]).includes(currentYearZodiac);
  const isBadMatch = (zodiacData.worstMatch as readonly string[]).includes(currentYearZodiac);

  // 기본 운세 점수 (띠 상성 반영)
  let baseScore = 70;
  if (isGoodMatch) baseScore += 15;
  if (isBadMatch) baseScore -= 10;

  const age = currentYear - birthYear + 1; // 한국 나이

  // 나이에 따른 대운 조정
  const ageModifier = Math.sin(age / 10) * 5;

  const overallScore = Math.min(95, Math.max(55, Math.round(baseScore + ageModifier)));

  return {
    year: currentYear,
    sign,
    signInfo: zodiacData,
    birthYear,
    age,
    yearZodiac: currentYearZodiac,
    yearZodiacInfo: CHINESE_ZODIAC[currentYearZodiac],

    compatibility: {
      isGoodMatch,
      isBadMatch,
      description: isGoodMatch
        ? `${currentYear}년 ${CHINESE_ZODIAC[currentYearZodiac].name}띠 해와 ${zodiacData.name}띠의 궁합이 좋습니다!`
        : isBadMatch
          ? `${currentYear}년에는 조금 더 신중하게 행동하면 좋겠습니다.`
          : `${currentYear}년은 안정적인 한 해가 될 것입니다.`,
    },

    scores: {
      overall: overallScore,
      wealth: Math.min(95, Math.max(50, overallScore + Math.round(Math.random() * 10 - 5))),
      love: Math.min(95, Math.max(50, overallScore + Math.round(Math.random() * 10 - 5))),
      career: Math.min(95, Math.max(50, overallScore + Math.round(Math.random() * 10 - 5))),
      health: Math.min(95, Math.max(50, overallScore + Math.round(Math.random() * 10 - 5))),
    },

    // 무료 프리뷰 (일부만 공개)
    freePreview: {
      overallMessage: generateYearlyMessage(sign, overallScore),
      keyAdvice: isGoodMatch
        ? '올해는 당신에게 많은 기회가 찾아오는 해입니다. 적극적으로 도전하세요!'
        : isBadMatch
          ? '올해는 내면의 성장에 집중하는 것이 좋겠습니다. 차분하게 준비하세요.'
          : '꾸준한 노력이 결실을 맺는 한 해가 될 것입니다.',
      luckyMonths: [3, 7, 11], // 행운의 달
      cautionMonths: isBadMatch ? [5, 9] : [6],
    },

    // 프리미엄 컨텐츠 (유료)
    premiumContent: {
      monthlyFortune: '프리미엄 회원만 확인 가능',
      detailedCareer: '프리미엄 회원만 확인 가능',
      loveAnalysis: '프리미엄 회원만 확인 가능',
      wealthStrategy: '프리미엄 회원만 확인 가능',
      healthAdvice: '프리미엄 회원만 확인 가능',
      luckyDays: '프리미엄 회원만 확인 가능',
    },
  };
}

function generateYearlyMessage(sign: ChineseZodiacSign, score: number): string {
  const zodiacData = CHINESE_ZODIAC[sign];

  if (score >= 85) {
    return `${zodiacData.name}띠에게 2026년은 빛나는 한 해가 될 것입니다! 새로운 도전과 성취의 기회가 가득합니다.`;
  } else if (score >= 70) {
    return `${zodiacData.name}띠의 2026년은 안정과 성장의 해입니다. 꾸준한 노력이 좋은 결과로 이어질 것입니다.`;
  } else if (score >= 55) {
    return `${zodiacData.name}띠에게 2026년은 내면을 다지는 시간이 될 것입니다. 차분하게 준비하면 좋은 기회가 찾아옵니다.`;
  } else {
    return `${zodiacData.name}띠의 2026년은 신중함이 필요한 해입니다. 건강과 인간관계에 특별히 신경 쓰세요.`;
  }
}

/**
 * 모든 띠의 오늘 운세 순위
 */
export function getTodayZodiacRanking(date: Date = new Date()): Array<{
  sign: ChineseZodiacSign;
  signInfo: typeof CHINESE_ZODIAC[ChineseZodiacSign];
  score: number;
  rank: number;
}> {
  const fortunes = ZODIAC_ORDER.map(sign => {
    const fortune = generateDailyZodiacFortune(sign, date);
    return {
      sign,
      signInfo: CHINESE_ZODIAC[sign],
      score: fortune.scores.overall,
    };
  });

  // 점수순 정렬
  fortunes.sort((a, b) => b.score - a.score);

  // 순위 추가
  return fortunes.map((item, index) => ({
    ...item,
    rank: index + 1,
  }));
}
