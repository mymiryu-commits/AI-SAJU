/**
 * 별자리(Zodiac) 분석 모듈
 * 서양 점성술 기반 별자리 분석을 사주와 통합
 */

// 별자리 정보 타입
export interface ZodiacSign {
  name: string;           // 한글 이름
  english: string;        // 영문 이름
  symbol: string;         // 심볼
  element: string;        // 원소 (불, 흙, 공기, 물)
  quality: string;        // 특성 (활동궁, 고정궁, 변통궁)
  ruler: string;          // 수호성
  dateRange: string;      // 날짜 범위
  keywords: string[];     // 키워드
  personality: string;    // 성격 특성
  strengths: string[];    // 강점
  weaknesses: string[];   // 약점
  compatibility: string[];// 궁합 좋은 별자리
  luckyColor: string;     // 행운의 색
  luckyNumber: number[];  // 행운의 숫자
  bodyPart: string;       // 관련 신체 부위
}

// 별자리 데이터
export const ZODIAC_SIGNS: Record<string, ZodiacSign> = {
  aries: {
    name: '양자리',
    english: 'Aries',
    symbol: '♈',
    element: '불',
    quality: '활동궁',
    ruler: '화성',
    dateRange: '3월 21일 ~ 4월 19일',
    keywords: ['리더십', '열정', '용기', '개척정신'],
    personality: '열정적이고 용감하며 도전을 두려워하지 않습니다. 새로운 것을 시작하는 데 탁월하며, 강한 리더십을 발휘합니다.',
    strengths: ['용기', '결단력', '자신감', '열정'],
    weaknesses: ['성급함', '충동적', '참을성 부족'],
    compatibility: ['사자자리', '사수자리', '쌍둥이자리', '물병자리'],
    luckyColor: '빨강',
    luckyNumber: [1, 8, 17],
    bodyPart: '머리, 얼굴'
  },
  taurus: {
    name: '황소자리',
    english: 'Taurus',
    symbol: '♉',
    element: '흙',
    quality: '고정궁',
    ruler: '금성',
    dateRange: '4월 20일 ~ 5월 20일',
    keywords: ['안정', '인내', '감각', '실용성'],
    personality: '안정적이고 신뢰할 수 있으며, 인내심이 강합니다. 물질적 안정과 감각적 즐거움을 중시합니다.',
    strengths: ['인내심', '신뢰성', '실용적', '헌신적'],
    weaknesses: ['고집', '변화 거부', '소유욕'],
    compatibility: ['처녀자리', '염소자리', '게자리', '물고기자리'],
    luckyColor: '초록',
    luckyNumber: [2, 6, 9, 12],
    bodyPart: '목, 목구멍'
  },
  gemini: {
    name: '쌍둥이자리',
    english: 'Gemini',
    symbol: '♊',
    element: '공기',
    quality: '변통궁',
    ruler: '수성',
    dateRange: '5월 21일 ~ 6월 20일',
    keywords: ['소통', '지적호기심', '적응력', '다재다능'],
    personality: '호기심이 많고 소통 능력이 뛰어납니다. 다양한 관심사를 가지며 빠르게 적응합니다.',
    strengths: ['소통능력', '적응력', '지적호기심', '유머'],
    weaknesses: ['일관성 부족', '피상적', '우유부단'],
    compatibility: ['천칭자리', '물병자리', '양자리', '사자자리'],
    luckyColor: '노랑',
    luckyNumber: [5, 7, 14, 23],
    bodyPart: '팔, 손, 폐'
  },
  cancer: {
    name: '게자리',
    english: 'Cancer',
    symbol: '♋',
    element: '물',
    quality: '활동궁',
    ruler: '달',
    dateRange: '6월 21일 ~ 7월 22일',
    keywords: ['가정', '감성', '보호', '직관'],
    personality: '감성이 풍부하고 가정을 중시합니다. 강한 직관력과 보호 본능을 가지고 있습니다.',
    strengths: ['공감능력', '직관력', '보호본능', '충성심'],
    weaknesses: ['감정기복', '과민반응', '집착'],
    compatibility: ['전갈자리', '물고기자리', '황소자리', '처녀자리'],
    luckyColor: '은색',
    luckyNumber: [2, 3, 15, 20],
    bodyPart: '가슴, 위장'
  },
  leo: {
    name: '사자자리',
    english: 'Leo',
    symbol: '♌',
    element: '불',
    quality: '고정궁',
    ruler: '태양',
    dateRange: '7월 23일 ~ 8월 22일',
    keywords: ['자신감', '창조성', '카리스마', '관대함'],
    personality: '타고난 리더십과 카리스마를 가지고 있습니다. 창의적이며 관대하고 따뜻한 마음을 지녔습니다.',
    strengths: ['창의성', '자신감', '관대함', '충성심'],
    weaknesses: ['자만심', '독단적', '관심욕구'],
    compatibility: ['양자리', '사수자리', '쌍둥이자리', '천칭자리'],
    luckyColor: '금색',
    luckyNumber: [1, 3, 10, 19],
    bodyPart: '심장, 등'
  },
  virgo: {
    name: '처녀자리',
    english: 'Virgo',
    symbol: '♍',
    element: '흙',
    quality: '변통궁',
    ruler: '수성',
    dateRange: '8월 23일 ~ 9월 22일',
    keywords: ['분석', '완벽', '봉사', '실용성'],
    personality: '분석적이고 세심하며 완벽을 추구합니다. 실용적이고 타인을 돕는 것을 좋아합니다.',
    strengths: ['분석력', '근면함', '세심함', '신뢰성'],
    weaknesses: ['비판적', '걱정', '완벽주의'],
    compatibility: ['황소자리', '염소자리', '게자리', '전갈자리'],
    luckyColor: '베이지',
    luckyNumber: [5, 14, 15, 23],
    bodyPart: '소화기관'
  },
  libra: {
    name: '천칭자리',
    english: 'Libra',
    symbol: '♎',
    element: '공기',
    quality: '활동궁',
    ruler: '금성',
    dateRange: '9월 23일 ~ 10월 22일',
    keywords: ['균형', '조화', '정의', '파트너십'],
    personality: '균형과 조화를 중시하며, 공정함을 추구합니다. 관계를 소중히 여기고 외교적입니다.',
    strengths: ['외교력', '공정함', '사교성', '협력'],
    weaknesses: ['우유부단', '갈등회피', '의존적'],
    compatibility: ['쌍둥이자리', '물병자리', '사자자리', '사수자리'],
    luckyColor: '분홍',
    luckyNumber: [4, 6, 13, 15],
    bodyPart: '신장, 허리'
  },
  scorpio: {
    name: '전갈자리',
    english: 'Scorpio',
    symbol: '♏',
    element: '물',
    quality: '고정궁',
    ruler: '명왕성',
    dateRange: '10월 23일 ~ 11월 21일',
    keywords: ['열정', '통찰', '변화', '집중력'],
    personality: '강렬하고 열정적이며 깊은 통찰력을 가지고 있습니다. 비밀을 잘 지키고 충성스럽습니다.',
    strengths: ['통찰력', '결단력', '충성심', '집중력'],
    weaknesses: ['질투', '집착', '복수심'],
    compatibility: ['게자리', '물고기자리', '처녀자리', '염소자리'],
    luckyColor: '검정',
    luckyNumber: [8, 11, 18, 22],
    bodyPart: '생식기관'
  },
  sagittarius: {
    name: '사수자리',
    english: 'Sagittarius',
    symbol: '♐',
    element: '불',
    quality: '변통궁',
    ruler: '목성',
    dateRange: '11월 22일 ~ 12월 21일',
    keywords: ['자유', '모험', '철학', '낙관'],
    personality: '자유를 사랑하고 모험을 즐깁니다. 철학적이며 항상 긍정적인 시각을 유지합니다.',
    strengths: ['낙관성', '정직함', '지적호기심', '유머'],
    weaknesses: ['무책임', '과장', '참을성 부족'],
    compatibility: ['양자리', '사자자리', '천칭자리', '물병자리'],
    luckyColor: '보라',
    luckyNumber: [3, 7, 9, 12],
    bodyPart: '허벅지, 간'
  },
  capricorn: {
    name: '염소자리',
    english: 'Capricorn',
    symbol: '♑',
    element: '흙',
    quality: '활동궁',
    ruler: '토성',
    dateRange: '12월 22일 ~ 1월 19일',
    keywords: ['야망', '인내', '책임감', '성취'],
    personality: '야망이 크고 목표 지향적입니다. 책임감이 강하며 꾸준히 노력하여 성공을 이룹니다.',
    strengths: ['책임감', '인내심', '야망', '실용성'],
    weaknesses: ['완고함', '비관적', '일중독'],
    compatibility: ['황소자리', '처녀자리', '전갈자리', '물고기자리'],
    luckyColor: '갈색',
    luckyNumber: [4, 8, 13, 22],
    bodyPart: '무릎, 뼈'
  },
  aquarius: {
    name: '물병자리',
    english: 'Aquarius',
    symbol: '♒',
    element: '공기',
    quality: '고정궁',
    ruler: '천왕성',
    dateRange: '1월 20일 ~ 2월 18일',
    keywords: ['혁신', '독창성', '인도주의', '자유'],
    personality: '독창적이고 진보적인 사고를 가지고 있습니다. 인류애가 강하며 혁신을 추구합니다.',
    strengths: ['독창성', '인도주의', '지적능력', '독립심'],
    weaknesses: ['냉담함', '반항적', '예측불가'],
    compatibility: ['쌍둥이자리', '천칭자리', '양자리', '사수자리'],
    luckyColor: '청록',
    luckyNumber: [4, 7, 11, 22],
    bodyPart: '발목, 순환계'
  },
  pisces: {
    name: '물고기자리',
    english: 'Pisces',
    symbol: '♓',
    element: '물',
    quality: '변통궁',
    ruler: '해왕성',
    dateRange: '2월 19일 ~ 3월 20일',
    keywords: ['직관', '공감', '상상력', '영성'],
    personality: '직관력이 뛰어나고 공감 능력이 강합니다. 상상력이 풍부하며 예술적 감각을 타고났습니다.',
    strengths: ['공감능력', '직관력', '창의성', '헌신'],
    weaknesses: ['현실도피', '우유부단', '자기희생'],
    compatibility: ['게자리', '전갈자리', '황소자리', '염소자리'],
    luckyColor: '연보라',
    luckyNumber: [3, 9, 12, 15],
    bodyPart: '발, 림프계'
  }
};

/**
 * 생년월일로 별자리 계산
 */
export function getZodiacSign(birthDate: string): string {
  const [year, month, day] = birthDate.split('-').map(Number);

  // 별자리 날짜 범위 (월, 시작일, 종료일)
  const zodiacDates: Array<{ sign: string; startMonth: number; startDay: number; endMonth: number; endDay: number }> = [
    { sign: 'capricorn', startMonth: 12, startDay: 22, endMonth: 1, endDay: 19 },
    { sign: 'aquarius', startMonth: 1, startDay: 20, endMonth: 2, endDay: 18 },
    { sign: 'pisces', startMonth: 2, startDay: 19, endMonth: 3, endDay: 20 },
    { sign: 'aries', startMonth: 3, startDay: 21, endMonth: 4, endDay: 19 },
    { sign: 'taurus', startMonth: 4, startDay: 20, endMonth: 5, endDay: 20 },
    { sign: 'gemini', startMonth: 5, startDay: 21, endMonth: 6, endDay: 20 },
    { sign: 'cancer', startMonth: 6, startDay: 21, endMonth: 7, endDay: 22 },
    { sign: 'leo', startMonth: 7, startDay: 23, endMonth: 8, endDay: 22 },
    { sign: 'virgo', startMonth: 8, startDay: 23, endMonth: 9, endDay: 22 },
    { sign: 'libra', startMonth: 9, startDay: 23, endMonth: 10, endDay: 22 },
    { sign: 'scorpio', startMonth: 10, startDay: 23, endMonth: 11, endDay: 21 },
    { sign: 'sagittarius', startMonth: 11, startDay: 22, endMonth: 12, endDay: 21 },
  ];

  for (const zodiac of zodiacDates) {
    if (zodiac.startMonth === 12) {
      // 염소자리 특별 처리 (12월~1월)
      if ((month === 12 && day >= zodiac.startDay) || (month === 1 && day <= zodiac.endDay)) {
        return zodiac.sign;
      }
    } else if (
      (month === zodiac.startMonth && day >= zodiac.startDay) ||
      (month === zodiac.endMonth && day <= zodiac.endDay)
    ) {
      return zodiac.sign;
    }
  }

  return 'aries'; // 기본값
}

/**
 * 별자리 정보 가져오기
 */
export function getZodiacInfo(birthDate: string): ZodiacSign {
  const signKey = getZodiacSign(birthDate);
  return ZODIAC_SIGNS[signKey];
}

/**
 * 별자리와 사주 오행의 조화 분석
 */
export function analyzeZodiacSajuHarmony(
  zodiacElement: string,
  dominantOheng: string
): { score: number; description: string } {
  // 별자리 원소와 사주 오행의 대응
  const zodiacToOheng: Record<string, string> = {
    '불': 'fire',
    '흙': 'earth',
    '공기': 'metal', // 공기는 금에 대응
    '물': 'water'
  };

  const zodiacOheng = zodiacToOheng[zodiacElement] || 'earth';

  // 상생 관계
  const generating: Record<string, string> = {
    'wood': 'fire',
    'fire': 'earth',
    'earth': 'metal',
    'metal': 'water',
    'water': 'wood'
  };

  // 상극 관계
  const controlling: Record<string, string> = {
    'wood': 'earth',
    'fire': 'metal',
    'earth': 'water',
    'metal': 'wood',
    'water': 'fire'
  };

  if (zodiacOheng === dominantOheng) {
    return {
      score: 95,
      description: '별자리와 사주의 기운이 완벽하게 일치합니다. 타고난 기질이 조화롭게 발현됩니다.'
    };
  }

  if (generating[zodiacOheng] === dominantOheng) {
    return {
      score: 85,
      description: '별자리가 사주의 기운을 생()합니다. 서양과 동양의 운명이 서로를 강화합니다.'
    };
  }

  if (generating[dominantOheng] === zodiacOheng) {
    return {
      score: 80,
      description: '사주가 별자리의 기운을 생()합니다. 내면의 힘이 외적으로 잘 표현됩니다.'
    };
  }

  if (controlling[zodiacOheng] === dominantOheng) {
    return {
      score: 60,
      description: '별자리와 사주 사이에 긴장이 있습니다. 이 에너지를 잘 활용하면 성장의 원동력이 됩니다.'
    };
  }

  return {
    score: 70,
    description: '별자리와 사주가 독립적으로 작용합니다. 다양한 면모를 가진 복합적인 성격입니다.'
  };
}

/**
 * 별자리 분석 결과 생성
 */
export interface ZodiacAnalysis {
  sign: ZodiacSign;
  harmony: {
    score: number;
    description: string;
  };
  integratedInsight: string;
  yearForecast: string;
}

export function generateZodiacAnalysis(
  birthDate: string,
  dominantOheng: string,
  currentYear: number = new Date().getFullYear()
): ZodiacAnalysis {
  const sign = getZodiacInfo(birthDate);
  const harmony = analyzeZodiacSajuHarmony(sign.element, dominantOheng);

  // 통합 인사이트 생성
  const ohengKorean: Record<string, string> = {
    'wood': '목(木)', 'fire': '화(火)', 'earth': '토(土)',
    'metal': '금(金)', 'water': '수(水)'
  };

  const integratedInsight = `${sign.name}의 ${sign.element} 기운과 사주의 ${ohengKorean[dominantOheng]} 기운이 만나 ` +
    `${sign.keywords.slice(0, 2).join(', ')}의 특성이 더욱 강화됩니다. ` +
    `${sign.strengths[0]}과(와) ${sign.strengths[1]}이(가) 당신의 핵심 강점입니다.`;

  // 올해 운세 예측
  const yearForecasts: Record<string, string> = {
    aries: '새로운 시작의 해입니다. 과감한 도전이 성공을 가져옵니다.',
    taurus: '안정과 풍요의 해입니다. 꾸준함이 보상받습니다.',
    gemini: '소통과 학습의 해입니다. 새로운 지식이 기회를 열어줍니다.',
    cancer: '가정과 내면 성장의 해입니다. 감정의 지혜를 얻습니다.',
    leo: '빛나는 성취의 해입니다. 리더십이 인정받습니다.',
    virgo: '완성과 정리의 해입니다. 세심함이 빛을 발합니다.',
    libra: '관계와 협력의 해입니다. 파트너십이 발전합니다.',
    scorpio: '변화와 재탄생의 해입니다. 깊은 통찰을 얻습니다.',
    sagittarius: '확장과 모험의 해입니다. 새로운 세계가 열립니다.',
    capricorn: '성취와 인정의 해입니다. 노력이 결실을 맺습니다.',
    aquarius: '혁신과 자유의 해입니다. 독창성이 빛납니다.',
    pisces: '직관과 영성의 해입니다. 내면의 목소리를 따르세요.'
  };

  const signKey = getZodiacSign(birthDate);
  const yearForecast = yearForecasts[signKey] || yearForecasts.aries;

  return {
    sign,
    harmony,
    integratedInsight,
    yearForecast
  };
}
