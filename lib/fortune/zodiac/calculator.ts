/**
 * 별자리 계산 및 분석 로직
 */

import {
  ZodiacSign,
  ZodiacInfo,
  ZodiacAnalysis,
  ZodiacCompatibility,
  ZODIAC_DATA,
} from './types';

// 날짜로 별자리 계산
export function getZodiacSign(birthDate: string): ZodiacSign {
  const date = new Date(birthDate);
  const month = date.getMonth() + 1;
  const day = date.getDate();

  if ((month === 3 && day >= 21) || (month === 4 && day <= 19)) return 'aries';
  if ((month === 4 && day >= 20) || (month === 5 && day <= 20)) return 'taurus';
  if ((month === 5 && day >= 21) || (month === 6 && day <= 21)) return 'gemini';
  if ((month === 6 && day >= 22) || (month === 7 && day <= 22)) return 'cancer';
  if ((month === 7 && day >= 23) || (month === 8 && day <= 22)) return 'leo';
  if ((month === 8 && day >= 23) || (month === 9 && day <= 22)) return 'virgo';
  if ((month === 9 && day >= 23) || (month === 10 && day <= 22)) return 'libra';
  if ((month === 10 && day >= 23) || (month === 11 && day <= 21)) return 'scorpio';
  if ((month === 11 && day >= 22) || (month === 12 && day <= 21)) return 'sagittarius';
  if ((month === 12 && day >= 22) || (month === 1 && day <= 19)) return 'capricorn';
  if ((month === 1 && day >= 20) || (month === 2 && day <= 18)) return 'aquarius';
  return 'pisces';
}

// 별자리 정보 가져오기
export function getZodiacInfo(sign: ZodiacSign): ZodiacInfo {
  return ZODIAC_DATA[sign];
}

// 별자리 성격 분석
const PERSONALITY_DATA: Record<ZodiacSign, {
  strengths: string[];
  weaknesses: string[];
  traits: string[];
  loveStyle: string;
  workStyle: string;
}> = {
  aries: {
    strengths: ['용감함', '열정적', '자신감 넘침', '결단력 있음', '리더십'],
    weaknesses: ['충동적', '참을성 부족', '공격적일 수 있음', '자기중심적'],
    traits: ['개척정신이 강하고 새로운 도전을 좋아합니다', '직접적이고 솔직한 성격', '에너지가 넘치고 활동적'],
    loveStyle: '열정적이고 직접적인 애정 표현을 합니다. 정복하는 것을 좋아하며, 연애 초반에 가장 열정적입니다.',
    workStyle: '빠른 결정과 실행력이 뛰어납니다. 리더 역할을 선호하며 경쟁 환경에서 빛을 발합니다.',
  },
  taurus: {
    strengths: ['신뢰할 수 있음', '인내심', '실용적', '헌신적', '책임감'],
    weaknesses: ['완고함', '소유욕', '변화에 저항', '물질주의적'],
    traits: ['안정을 추구하고 편안함을 좋아합니다', '감각적이고 미적 감각이 뛰어남', '느리지만 확실하게 목표를 달성'],
    loveStyle: '한 번 사랑하면 헌신적이고 충실합니다. 물질적 안정과 신체적 애정을 중요시합니다.',
    workStyle: '꾸준하고 믿을 수 있는 작업자입니다. 재정 관련 업무나 예술 분야에서 뛰어납니다.',
  },
  gemini: {
    strengths: ['적응력', '소통 능력', '지적 호기심', '재치 있음', '다재다능'],
    weaknesses: ['우유부단', '불안정', '표면적', '집중력 부족'],
    traits: ['다양한 관심사를 가지고 있습니다', '대화를 즐기고 정보 수집을 좋아함', '빠른 사고와 언어 능력이 뛰어남'],
    loveStyle: '지적인 자극을 주는 상대에게 끌립니다. 대화가 중요하며, 자유로운 관계를 선호합니다.',
    workStyle: '멀티태스킹에 능하고 커뮤니케이션 능력이 뛰어납니다. 다양한 프로젝트를 동시에 진행할 수 있습니다.',
  },
  cancer: {
    strengths: ['배려심', '직관력', '보호 본능', '상상력', '충성심'],
    weaknesses: ['변덕스러움', '의심 많음', '감정적', '과보호적'],
    traits: ['가정과 가족을 소중히 여깁니다', '감정이 풍부하고 공감 능력이 뛰어남', '직관력이 강하고 기억력이 좋음'],
    loveStyle: '깊고 감정적인 유대를 추구합니다. 상대를 보호하고 돌보는 것을 좋아합니다.',
    workStyle: '팀의 조화를 중시하고 협력적입니다. 고객 서비스나 돌봄 관련 직종에서 능력을 발휘합니다.',
  },
  leo: {
    strengths: ['창의력', '열정', '관대함', '자신감', '카리스마'],
    weaknesses: ['자만심', '완고함', '관심 요구', '드라마틱'],
    traits: ['주목받는 것을 좋아하고 무대에서 빛납니다', '따뜻하고 관대한 마음을 가짐', '리더십과 창의력이 뛰어남'],
    loveStyle: '로맨틱하고 열정적입니다. 파트너에게 아낌없이 주고 존경받기를 원합니다.',
    workStyle: '창의적인 분야에서 뛰어납니다. 리더 역할을 자연스럽게 수행하며 팀에 영감을 줍니다.',
  },
  virgo: {
    strengths: ['분석력', '근면성', '실용성', '친절함', '신뢰성'],
    weaknesses: ['비판적', '걱정 많음', '완벽주의', '까다로움'],
    traits: ['세부 사항에 주의를 기울입니다', '실용적이고 분석적인 사고방식', '봉사하고 돕는 것을 좋아함'],
    loveStyle: '신중하고 헌신적입니다. 실용적인 방식으로 사랑을 표현하며 파트너를 돌봅니다.',
    workStyle: '꼼꼼하고 효율적입니다. 분석, 편집, 건강 관련 분야에서 뛰어난 능력을 발휘합니다.',
  },
  libra: {
    strengths: ['외교적', '공정함', '사교적', '협력적', '우아함'],
    weaknesses: ['우유부단', '회피적', '자기연민', '의존적'],
    traits: ['조화와 균형을 추구합니다', '아름다움과 예술을 사랑함', '공정함과 정의를 중요시'],
    loveStyle: '파트너십을 중요시하고 로맨틱합니다. 조화로운 관계를 위해 노력합니다.',
    workStyle: '팀워크와 협력에 능합니다. 예술, 법률, 디자인 분야에서 능력을 발휘합니다.',
  },
  scorpio: {
    strengths: ['결단력', '용감함', '충성심', '통찰력', '열정'],
    weaknesses: ['질투심', '비밀주의', '조종적', '복수심'],
    traits: ['깊은 감정과 통찰력을 가지고 있습니다', '진실을 파헤치는 것을 좋아함', '변화와 재생의 힘을 가짐'],
    loveStyle: '강렬하고 깊은 관계를 원합니다. 완전한 헌신을 요구하며 질투심이 강할 수 있습니다.',
    workStyle: '집중력과 결단력이 뛰어납니다. 연구, 심리학, 수사 분야에서 능력을 발휘합니다.',
  },
  sagittarius: {
    strengths: ['낙관적', '자유로움', '지적', '정직함', '모험심'],
    weaknesses: ['무책임', '조급함', '무신경', '과장됨'],
    traits: ['모험과 자유를 사랑합니다', '철학적이고 진실을 추구함', '유머 감각이 뛰어나고 낙관적'],
    loveStyle: '자유로운 관계를 선호합니다. 함께 모험하고 성장할 파트너를 찾습니다.',
    workStyle: '다양한 경험을 좋아하고 루틴을 싫어합니다. 여행, 교육, 출판 분야에서 능력을 발휘합니다.',
  },
  capricorn: {
    strengths: ['책임감', '규율', '자제력', '경영 능력', '인내심'],
    weaknesses: ['비관적', '완고함', '지나친 진지함', '무정함'],
    traits: ['목표 지향적이고 야심이 있습니다', '전통과 구조를 중요시함', '현실적이고 실용적인 접근'],
    loveStyle: '신중하고 진지합니다. 장기적인 관계를 추구하며 안정을 중요시합니다.',
    workStyle: '책임감 있고 근면합니다. 관리, 금융, 정치 분야에서 성공을 거둡니다.',
  },
  aquarius: {
    strengths: ['독창성', '인도주의', '진보적', '독립적', '지적'],
    weaknesses: ['반항적', '감정적 거리감', '예측불가', '고집스러움'],
    traits: ['독특하고 개혁적인 생각을 합니다', '인류애와 사회 문제에 관심이 많음', '자유와 독립을 중요시'],
    loveStyle: '지적인 연결을 중요시합니다. 전통적인 관계보다 우정 같은 파트너십을 선호합니다.',
    workStyle: '혁신적이고 미래 지향적입니다. 기술, 과학, 사회 운동 분야에서 능력을 발휘합니다.',
  },
  pisces: {
    strengths: ['직관력', '공감 능력', '예술적', '온화함', '지혜'],
    weaknesses: ['현실 도피', '과민함', '의존적', '우유부단'],
    traits: ['상상력이 풍부하고 예술적입니다', '다른 사람의 감정을 잘 이해함', '영적이고 신비로운 면이 있음'],
    loveStyle: '로맨틱하고 이상적인 사랑을 꿈꿉니다. 깊은 감정적 연결을 추구합니다.',
    workStyle: '창의적이고 직관적입니다. 예술, 음악, 치유 분야에서 재능을 발휘합니다.',
  },
};

// 별자리 궁합 매트릭스 (0-100)
const COMPATIBILITY_MATRIX: Record<ZodiacSign, Record<ZodiacSign, number>> = {
  aries: { aries: 65, taurus: 55, gemini: 80, cancer: 45, leo: 90, virgo: 50, libra: 75, scorpio: 60, sagittarius: 95, capricorn: 45, aquarius: 80, pisces: 55 },
  taurus: { aries: 55, taurus: 70, gemini: 50, cancer: 90, leo: 60, virgo: 95, libra: 70, scorpio: 85, sagittarius: 45, capricorn: 95, aquarius: 50, pisces: 85 },
  gemini: { aries: 80, taurus: 50, gemini: 70, cancer: 55, leo: 85, virgo: 50, libra: 95, scorpio: 45, sagittarius: 80, capricorn: 50, aquarius: 95, pisces: 55 },
  cancer: { aries: 45, taurus: 90, gemini: 55, cancer: 75, leo: 60, virgo: 85, libra: 55, scorpio: 95, sagittarius: 45, capricorn: 70, aquarius: 50, pisces: 95 },
  leo: { aries: 90, taurus: 60, gemini: 85, cancer: 60, leo: 70, virgo: 55, libra: 85, scorpio: 55, sagittarius: 95, capricorn: 50, aquarius: 70, pisces: 55 },
  virgo: { aries: 50, taurus: 95, gemini: 50, cancer: 85, leo: 55, virgo: 70, libra: 60, scorpio: 80, sagittarius: 50, capricorn: 95, aquarius: 50, pisces: 70 },
  libra: { aries: 75, taurus: 70, gemini: 95, cancer: 55, leo: 85, virgo: 60, libra: 70, scorpio: 60, sagittarius: 85, capricorn: 55, aquarius: 95, pisces: 65 },
  scorpio: { aries: 60, taurus: 85, gemini: 45, cancer: 95, leo: 55, virgo: 80, libra: 60, scorpio: 75, sagittarius: 50, capricorn: 80, aquarius: 50, pisces: 95 },
  sagittarius: { aries: 95, taurus: 45, gemini: 80, cancer: 45, leo: 95, virgo: 50, libra: 85, scorpio: 50, sagittarius: 75, capricorn: 55, aquarius: 90, pisces: 55 },
  capricorn: { aries: 45, taurus: 95, gemini: 50, cancer: 70, leo: 50, virgo: 95, libra: 55, scorpio: 80, sagittarius: 55, capricorn: 70, aquarius: 60, pisces: 75 },
  aquarius: { aries: 80, taurus: 50, gemini: 95, cancer: 50, leo: 70, virgo: 50, libra: 95, scorpio: 50, sagittarius: 90, capricorn: 60, aquarius: 70, pisces: 65 },
  pisces: { aries: 55, taurus: 85, gemini: 55, cancer: 95, leo: 55, virgo: 70, libra: 65, scorpio: 95, sagittarius: 55, capricorn: 75, aquarius: 65, pisces: 70 },
};

// 별자리 분석 생성
export function analyzeZodiac(birthDate: string): ZodiacAnalysis {
  const sign = getZodiacSign(birthDate);
  const signInfo = getZodiacInfo(sign);
  const personality = PERSONALITY_DATA[sign];

  // 오늘의 운세 생성 (시드 기반 랜덤)
  const today = new Date();
  const seed = today.getFullYear() * 10000 + (today.getMonth() + 1) * 100 + today.getDate();
  const signIndex = Object.keys(ZODIAC_DATA).indexOf(sign);

  const dailyFortune = generateDailyFortune(sign, seed, signIndex);
  const compatibility = getCompatibility(sign);

  return {
    sign,
    signInfo,
    birthDate,
    personality,
    dailyFortune,
    compatibility,
  };
}

// 일일 운세 생성
function generateDailyFortune(sign: ZodiacSign, seed: number, signIndex: number) {
  const random = (index: number) => {
    const x = Math.sin((seed + signIndex * 1000 + index) * 12.9898) * 43758.5453;
    return Math.floor((x - Math.floor(x)) * 100);
  };

  const today = new Date();
  const signInfo = ZODIAC_DATA[sign];

  const advices = [
    '오늘은 새로운 시작에 좋은 날입니다. 미뤄왔던 일을 시작해보세요.',
    '인내심이 필요한 하루입니다. 급하게 결정하지 말고 신중하게 행동하세요.',
    '창의적인 에너지가 넘칩니다. 예술 활동이나 취미에 시간을 투자해보세요.',
    '대인 관계에서 좋은 소식이 있을 수 있습니다. 주변 사람들에게 친절하게 대하세요.',
    '재정적인 기회가 올 수 있습니다. 투자나 저축에 대해 생각해보세요.',
    '건강에 신경 쓰는 것이 좋습니다. 충분한 휴식을 취하세요.',
    '직장에서의 노력이 인정받을 수 있습니다. 최선을 다하세요.',
    '사랑에 있어 좋은 징조가 보입니다. 솔직한 감정 표현이 도움이 됩니다.',
  ];

  const luckyTimes = ['오전 9시', '정오', '오후 3시', '오후 6시', '저녁 8시'];
  const luckyColors = ['빨강', '파랑', '초록', '노랑', '보라', '분홍', '하늘색', '주황'];

  return {
    date: today.toISOString().split('T')[0],
    overall: Math.max(50, Math.min(100, random(1) + 10)),
    love: Math.max(40, Math.min(100, random(2) + 5)),
    career: Math.max(45, Math.min(100, random(3) + 5)),
    money: Math.max(40, Math.min(100, random(4) + 5)),
    health: Math.max(50, Math.min(100, random(5) + 10)),
    advice: advices[random(6) % advices.length],
    luckyTime: luckyTimes[random(7) % luckyTimes.length],
    luckyColor: luckyColors[random(8) % luckyColors.length],
    luckyNumber: Math.max(1, random(9) % 50),
  };
}

// 궁합 정보 가져오기
function getCompatibility(sign: ZodiacSign) {
  const scores = COMPATIBILITY_MATRIX[sign];
  const sorted = Object.entries(scores)
    .map(([s, score]) => ({ sign: s as ZodiacSign, score }))
    .sort((a, b) => b.score - a.score);

  return {
    bestMatches: sorted.slice(0, 3).map(s => s.sign),
    goodMatches: sorted.slice(3, 6).map(s => s.sign),
    challengingMatches: sorted.slice(-3).map(s => s.sign),
  };
}

// 두 별자리 궁합 분석
export function analyzeZodiacCompatibility(
  birthDate1: string,
  birthDate2: string
): ZodiacCompatibility {
  const sign1 = getZodiacSign(birthDate1);
  const sign2 = getZodiacSign(birthDate2);

  const overallScore = COMPATIBILITY_MATRIX[sign1][sign2];
  const info1 = ZODIAC_DATA[sign1];
  const info2 = ZODIAC_DATA[sign2];

  // 원소 상호작용
  const elementInteraction = getElementInteraction(info1.element, info2.element);

  // 궁합 세부 점수
  const loveScore = Math.min(100, overallScore + (elementInteraction.modifier * 5));
  const friendshipScore = Math.min(100, overallScore + 5);
  const workScore = Math.min(100, overallScore - 5 + (elementInteraction.modifier * 3));

  // 강점과 약점 생성
  const strengths = generateStrengths(sign1, sign2, overallScore);
  const challenges = generateChallenges(sign1, sign2, overallScore);
  const advice = generateAdvice(sign1, sign2, overallScore);

  return {
    sign1,
    sign2,
    overallScore,
    loveScore,
    friendshipScore,
    workScore,
    strengths,
    challenges,
    advice,
    elementInteraction: elementInteraction.description,
  };
}

// 원소 상호작용
function getElementInteraction(e1: string, e2: string): { description: string; modifier: number } {
  const same = e1 === e2;

  if (same) {
    return { description: '같은 원소로 서로를 깊이 이해합니다', modifier: 2 };
  }

  const fireAir = (e1 === 'fire' && e2 === 'air') || (e1 === 'air' && e2 === 'fire');
  const earthWater = (e1 === 'earth' && e2 === 'water') || (e1 === 'water' && e2 === 'earth');

  if (fireAir) {
    return { description: '불과 공기의 만남 - 서로를 북돋아주는 열정적인 조합', modifier: 3 };
  }
  if (earthWater) {
    return { description: '땅과 물의 만남 - 안정적이고 풍요로운 조합', modifier: 3 };
  }

  const fireWater = (e1 === 'fire' && e2 === 'water') || (e1 === 'water' && e2 === 'fire');
  const airEarth = (e1 === 'air' && e2 === 'earth') || (e1 === 'earth' && e2 === 'air');

  if (fireWater) {
    return { description: '불과 물의 만남 - 도전적이지만 균형을 찾으면 강해집니다', modifier: -1 };
  }
  if (airEarth) {
    return { description: '공기와 땅의 만남 - 다른 방식으로 세상을 봅니다', modifier: 0 };
  }

  return { description: '서로 다른 원소의 조화', modifier: 1 };
}

// 강점 생성
function generateStrengths(sign1: ZodiacSign, sign2: ZodiacSign, score: number): string[] {
  const strengths: string[] = [];

  if (score >= 80) {
    strengths.push('자연스럽게 서로를 이해하고 공감합니다');
    strengths.push('함께 있으면 에너지가 상승합니다');
  }
  if (score >= 60) {
    strengths.push('서로의 장점을 발견하고 존중합니다');
    strengths.push('대화가 잘 통하고 소통이 원활합니다');
  }
  if (score >= 40) {
    strengths.push('서로 다른 관점을 배울 수 있습니다');
  }

  const info1 = ZODIAC_DATA[sign1];
  const info2 = ZODIAC_DATA[sign2];

  if (info1.element === info2.element) {
    strengths.push('같은 원소로 깊은 공감대를 형성합니다');
  }

  return strengths.length > 0 ? strengths : ['서로에 대해 알아가며 성장할 수 있습니다'];
}

// 도전 과제 생성
function generateChallenges(sign1: ZodiacSign, sign2: ZodiacSign, score: number): string[] {
  const challenges: string[] = [];

  if (score < 50) {
    challenges.push('서로의 방식이 달라 충돌이 생길 수 있습니다');
    challenges.push('이해하기 위해 더 많은 노력이 필요합니다');
  }
  if (score < 70) {
    challenges.push('의사소통에 있어 오해가 생길 수 있습니다');
  }

  const info1 = ZODIAC_DATA[sign1];
  const info2 = ZODIAC_DATA[sign2];

  if (info1.quality === info2.quality && info1.quality === 'fixed') {
    challenges.push('둘 다 고집이 세서 타협이 어려울 수 있습니다');
  }

  return challenges.length > 0 ? challenges : ['큰 도전 없이 조화롭게 지낼 수 있습니다'];
}

// 조언 생성
function generateAdvice(sign1: ZodiacSign, sign2: ZodiacSign, score: number): string {
  if (score >= 85) {
    return '천생연분! 서로를 있는 그대로 사랑하고 함께 성장해가세요.';
  }
  if (score >= 70) {
    return '좋은 궁합입니다. 서로의 장점을 인정하고 작은 차이는 유연하게 받아들이세요.';
  }
  if (score >= 55) {
    return '노력하면 좋은 관계를 유지할 수 있습니다. 열린 대화와 이해가 중요합니다.';
  }
  return '서로 다르지만 그만큼 배울 것도 많습니다. 인내심을 가지고 서로를 이해하려 노력하세요.';
}
