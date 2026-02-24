/**
 * 별자리 분석 타입 정의
 */

// 12궁 별자리
export type ZodiacSign =
  | 'aries'       // 양자리 (3/21 - 4/19)
  | 'taurus'      // 황소자리 (4/20 - 5/20)
  | 'gemini'      // 쌍둥이자리 (5/21 - 6/21)
  | 'cancer'      // 게자리 (6/22 - 7/22)
  | 'leo'         // 사자자리 (7/23 - 8/22)
  | 'virgo'       // 처녀자리 (8/23 - 9/22)
  | 'libra'       // 천칭자리 (9/23 - 10/22)
  | 'scorpio'     // 전갈자리 (10/23 - 11/21)
  | 'sagittarius' // 사수자리 (11/22 - 12/21)
  | 'capricorn'   // 염소자리 (12/22 - 1/19)
  | 'aquarius'    // 물병자리 (1/20 - 2/18)
  | 'pisces';     // 물고기자리 (2/19 - 3/20)

// 원소 (Element)
export type ZodiacElement = 'fire' | 'earth' | 'air' | 'water';

// 특성 (Quality/Modality)
export type ZodiacQuality = 'cardinal' | 'fixed' | 'mutable';

// 별자리 정보
export interface ZodiacInfo {
  sign: ZodiacSign;
  korean: string;
  symbol: string;
  dateRange: string;
  element: ZodiacElement;
  quality: ZodiacQuality;
  rulingPlanet: string;
  luckyColor: string;
  luckyNumber: number[];
  luckyDay: string;
}

// 별자리 분석 결과
export interface ZodiacAnalysis {
  // 기본 정보
  sign: ZodiacSign;
  signInfo: ZodiacInfo;
  birthDate: string;

  // 성격 분석
  personality: {
    strengths: string[];
    weaknesses: string[];
    traits: string[];
    loveStyle: string;
    workStyle: string;
  };

  // 오늘의 운세
  dailyFortune: {
    date: string;
    overall: number;
    love: number;
    career: number;
    money: number;
    health: number;
    advice: string;
    luckyTime: string;
    luckyColor: string;
    luckyNumber: number;
  };

  // 주간 운세
  weeklyFortune?: {
    startDate: string;
    endDate: string;
    overall: string;
    highlights: string[];
    challenges: string[];
    advice: string;
  };

  // 월간 운세
  monthlyFortune?: {
    month: number;
    year: number;
    overall: string;
    love: string;
    career: string;
    money: string;
    health: string;
    keyDates: { date: string; event: string }[];
  };

  // 연간 운세
  yearlyFortune?: {
    year: number;
    overview: string;
    quarters: {
      q1: string;
      q2: string;
      q3: string;
      q4: string;
    };
    majorEvents: { month: string; event: string }[];
    advice: string;
  };

  // 궁합
  compatibility: {
    bestMatches: ZodiacSign[];
    goodMatches: ZodiacSign[];
    challengingMatches: ZodiacSign[];
  };
}

// 별자리 궁합 결과
export interface ZodiacCompatibility {
  sign1: ZodiacSign;
  sign2: ZodiacSign;
  overallScore: number;
  loveScore: number;
  friendshipScore: number;
  workScore: number;
  strengths: string[];
  challenges: string[];
  advice: string;
  elementInteraction: string;
}

// 별자리 데이터
export const ZODIAC_DATA: Record<ZodiacSign, ZodiacInfo> = {
  aries: {
    sign: 'aries',
    korean: '양자리',
    symbol: '♈',
    dateRange: '3월 21일 - 4월 19일',
    element: 'fire',
    quality: 'cardinal',
    rulingPlanet: '화성 (Mars)',
    luckyColor: '빨강',
    luckyNumber: [1, 8, 17],
    luckyDay: '화요일',
  },
  taurus: {
    sign: 'taurus',
    korean: '황소자리',
    symbol: '♉',
    dateRange: '4월 20일 - 5월 20일',
    element: 'earth',
    quality: 'fixed',
    rulingPlanet: '금성 (Venus)',
    luckyColor: '초록',
    luckyNumber: [2, 6, 9],
    luckyDay: '금요일',
  },
  gemini: {
    sign: 'gemini',
    korean: '쌍둥이자리',
    symbol: '♊',
    dateRange: '5월 21일 - 6월 21일',
    element: 'air',
    quality: 'mutable',
    rulingPlanet: '수성 (Mercury)',
    luckyColor: '노랑',
    luckyNumber: [5, 7, 14],
    luckyDay: '수요일',
  },
  cancer: {
    sign: 'cancer',
    korean: '게자리',
    symbol: '♋',
    dateRange: '6월 22일 - 7월 22일',
    element: 'water',
    quality: 'cardinal',
    rulingPlanet: '달 (Moon)',
    luckyColor: '은색',
    luckyNumber: [2, 7, 11],
    luckyDay: '월요일',
  },
  leo: {
    sign: 'leo',
    korean: '사자자리',
    symbol: '♌',
    dateRange: '7월 23일 - 8월 22일',
    element: 'fire',
    quality: 'fixed',
    rulingPlanet: '태양 (Sun)',
    luckyColor: '금색',
    luckyNumber: [1, 3, 10],
    luckyDay: '일요일',
  },
  virgo: {
    sign: 'virgo',
    korean: '처녀자리',
    symbol: '♍',
    dateRange: '8월 23일 - 9월 22일',
    element: 'earth',
    quality: 'mutable',
    rulingPlanet: '수성 (Mercury)',
    luckyColor: '베이지',
    luckyNumber: [5, 14, 23],
    luckyDay: '수요일',
  },
  libra: {
    sign: 'libra',
    korean: '천칭자리',
    symbol: '♎',
    dateRange: '9월 23일 - 10월 22일',
    element: 'air',
    quality: 'cardinal',
    rulingPlanet: '금성 (Venus)',
    luckyColor: '분홍',
    luckyNumber: [4, 6, 13],
    luckyDay: '금요일',
  },
  scorpio: {
    sign: 'scorpio',
    korean: '전갈자리',
    symbol: '♏',
    dateRange: '10월 23일 - 11월 21일',
    element: 'water',
    quality: 'fixed',
    rulingPlanet: '명왕성 (Pluto)',
    luckyColor: '검정',
    luckyNumber: [8, 11, 18],
    luckyDay: '화요일',
  },
  sagittarius: {
    sign: 'sagittarius',
    korean: '사수자리',
    symbol: '♐',
    dateRange: '11월 22일 - 12월 21일',
    element: 'fire',
    quality: 'mutable',
    rulingPlanet: '목성 (Jupiter)',
    luckyColor: '보라',
    luckyNumber: [3, 7, 9],
    luckyDay: '목요일',
  },
  capricorn: {
    sign: 'capricorn',
    korean: '염소자리',
    symbol: '♑',
    dateRange: '12월 22일 - 1월 19일',
    element: 'earth',
    quality: 'cardinal',
    rulingPlanet: '토성 (Saturn)',
    luckyColor: '갈색',
    luckyNumber: [4, 8, 13],
    luckyDay: '토요일',
  },
  aquarius: {
    sign: 'aquarius',
    korean: '물병자리',
    symbol: '♒',
    dateRange: '1월 20일 - 2월 18일',
    element: 'air',
    quality: 'fixed',
    rulingPlanet: '천왕성 (Uranus)',
    luckyColor: '파랑',
    luckyNumber: [4, 7, 11],
    luckyDay: '토요일',
  },
  pisces: {
    sign: 'pisces',
    korean: '물고기자리',
    symbol: '♓',
    dateRange: '2월 19일 - 3월 20일',
    element: 'water',
    quality: 'mutable',
    rulingPlanet: '해왕성 (Neptune)',
    luckyColor: '바다색',
    luckyNumber: [3, 9, 12],
    luckyDay: '목요일',
  },
};

// 원소 한글 매핑
export const ELEMENT_KOREAN: Record<ZodiacElement, string> = {
  fire: '불 (Fire)',
  earth: '땅 (Earth)',
  air: '공기 (Air)',
  water: '물 (Water)',
};

// 특성 한글 매핑
export const QUALITY_KOREAN: Record<ZodiacQuality, string> = {
  cardinal: '활동궁 (Cardinal)',
  fixed: '고정궁 (Fixed)',
  mutable: '변통궁 (Mutable)',
};
