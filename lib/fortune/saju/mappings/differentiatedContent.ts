/**
 * 차별화된 사주 분석 콘텐츠 시스템
 *
 * 기존 전통 사주(십신, 신살, 12운성, 합충)를 넘어
 * MBTI, 별자리, 혈액형을 통합한 현대적 분석
 * 선천적 기질 + 후천적 기질 = 성장 전략
 */

import type { Element } from '@/types/saju';

// ========== 선천적 vs 후천적 기질 시스템 ==========
export interface TraitAnalysis {
  innate: {
    // 선천적 기질 (사주 + 별자리)
    corePersonality: string;
    hiddenPotential: string;
    naturalTalent: string;
    lifeTheme: string;
  };
  acquired: {
    // 후천적 기질 (MBTI + 혈액형 + 환경)
    learnedBehavior: string;
    socialMask: string;
    copingStyle: string;
    growthDirection: string;
  };
  synthesis: {
    // 통합 분석
    currentState: string;
    futureProjection: string;
    keyAdvice: string;
  };
}

// 일간별 선천적 기질
const INNATE_BY_DAYMASTER: Record<string, { core: string; potential: string; talent: string; theme: string }> = {
  '甲': {
    core: '정의롭고 곧은 리더의 기질',
    potential: '큰 조직을 이끌 수 있는 통솔력',
    talent: '새로운 것을 개척하고 시작하는 능력',
    theme: '성장과 확장'
  },
  '乙': {
    core: '유연하고 적응력 높은 협력가의 기질',
    potential: '어떤 환경에서도 살아남는 생존력',
    talent: '사람들 사이를 조율하고 화합시키는 능력',
    theme: '조화와 연결'
  },
  '丙': {
    core: '밝고 열정적인 영향력자의 기질',
    potential: '사람들에게 영감을 주는 카리스마',
    talent: '분위기를 이끌고 에너지를 전파하는 능력',
    theme: '빛과 영향력'
  },
  '丁': {
    core: '섬세하고 통찰력 있는 전문가의 기질',
    potential: '깊이 있는 분석과 통찰력',
    talent: '복잡한 것을 명쾌하게 정리하는 능력',
    theme: '깊이와 정교함'
  },
  '戊': {
    core: '신뢰받고 포용력 있는 중심축의 기질',
    potential: '모든 것을 품어내는 너른 그릇',
    talent: '흔들림 없이 중심을 지키는 능력',
    theme: '안정과 신뢰'
  },
  '己': {
    core: '배려심 깊고 헌신적인 양육자의 기질',
    potential: '사람과 관계를 성장시키는 힘',
    talent: '세심하게 돌보고 가꾸는 능력',
    theme: '헌신과 성장 지원'
  },
  '庚': {
    core: '결단력 있고 정의로운 실행가의 기질',
    potential: '목표를 향해 돌진하는 추진력',
    talent: '단호하게 결정하고 실행하는 능력',
    theme: '결단과 성취'
  },
  '辛': {
    core: '섬세하고 완벽주의적인 예술가의 기질',
    potential: '아름다움을 창조하는 미적 감각',
    talent: '디테일을 놓치지 않는 정교함',
    theme: '정교함과 가치 창출'
  },
  '壬': {
    core: '지혜롭고 포용력 있는 철학자의 기질',
    potential: '큰 그림을 보는 통찰력',
    talent: '어떤 상황에도 적응하는 유연함',
    theme: '지혜와 흐름'
  },
  '癸': {
    core: '직관적이고 감수성 풍부한 치유자의 기질',
    potential: '보이지 않는 것을 감지하는 직관력',
    talent: '사람의 마음을 읽고 치유하는 능력',
    theme: '직관과 치유'
  }
};

// MBTI별 후천적 기질
const ACQUIRED_BY_MBTI: Record<string, { behavior: string; mask: string; coping: string; growth: string }> = {
  'INTJ': {
    behavior: '논리적 체계를 구축하고 전략을 세우는 방식으로 세상을 대합니다',
    mask: '냉철하고 계산적인 전략가의 모습을 보이지만',
    coping: '스트레스 시 혼자만의 시간으로 재충전합니다',
    growth: '감정 표현과 유연성을 기르면 더 성장합니다'
  },
  'INTP': {
    behavior: '끊임없이 질문하고 분석하며 진리를 탐구합니다',
    mask: '거리를 두고 관찰하는 분석가의 모습을 보이지만',
    coping: '복잡한 문제 해결에 몰두하며 스트레스를 해소합니다',
    growth: '실행력과 사회적 연결을 강화하면 더 성장합니다'
  },
  'ENTJ': {
    behavior: '목표를 세우고 팀을 이끌어 성과를 만들어냅니다',
    mask: '자신감 넘치는 리더의 모습을 보이지만',
    coping: '더 큰 도전을 찾아 에너지를 발산합니다',
    growth: '경청과 공감 능력을 기르면 더 성장합니다'
  },
  'ENTP': {
    behavior: '새로운 아이디어를 탐구하고 가능성을 확장합니다',
    mask: '논쟁을 즐기는 도전자의 모습을 보이지만',
    coping: '새로운 프로젝트 시작으로 활력을 얻습니다',
    growth: '끈기와 마무리 능력을 기르면 더 성장합니다'
  },
  'INFJ': {
    behavior: '사람들의 성장을 돕고 더 나은 세상을 꿈꿉니다',
    mask: '조용히 지지하는 조력자의 모습을 보이지만',
    coping: '창작 활동이나 의미 있는 대화로 재충전합니다',
    growth: '자기 경계 설정과 현실 감각을 기르면 더 성장합니다'
  },
  'INFP': {
    behavior: '가치를 추구하고 진정성 있는 삶을 살려 합니다',
    mask: '평화로운 몽상가의 모습을 보이지만',
    coping: '예술이나 글쓰기로 내면을 표현합니다',
    growth: '실행력과 갈등 대처 능력을 기르면 더 성장합니다'
  },
  'ENFJ': {
    behavior: '사람들을 격려하고 잠재력을 끌어올립니다',
    mask: '카리스마 있는 멘토의 모습을 보이지만',
    coping: '사람들과의 깊은 대화로 에너지를 얻습니다',
    growth: '자기 돌봄과 거절하는 법을 배우면 더 성장합니다'
  },
  'ENFP': {
    behavior: '열정적으로 새로운 경험을 추구하고 사람들과 연결됩니다',
    mask: '밝고 긍정적인 활력소의 모습을 보이지만',
    coping: '새로운 사람들과의 만남으로 재충전합니다',
    growth: '집중력과 일관성을 기르면 더 성장합니다'
  },
  'ISTJ': {
    behavior: '책임감 있게 맡은 일을 완수하고 신뢰를 쌓습니다',
    mask: '묵묵히 실행하는 실무자의 모습을 보이지만',
    coping: '익숙한 루틴과 정리로 안정을 찾습니다',
    growth: '유연성과 새로운 시도를 받아들이면 더 성장합니다'
  },
  'ISFJ': {
    behavior: '조용히 헌신하며 주변을 돌봅니다',
    mask: '따뜻한 서포터의 모습을 보이지만',
    coping: '가까운 사람들과의 시간으로 회복합니다',
    growth: '자기 주장과 경계 설정을 배우면 더 성장합니다'
  },
  'ESTJ': {
    behavior: '체계적으로 조직하고 효율적으로 운영합니다',
    mask: '엄격한 관리자의 모습을 보이지만',
    coping: '성취와 완료로 만족감을 얻습니다',
    growth: '감정적 유연성과 다양성 존중을 배우면 더 성장합니다'
  },
  'ESFJ': {
    behavior: '화합을 추구하고 모두를 배려합니다',
    mask: '친절한 호스트의 모습을 보이지만',
    coping: '사교 활동과 도움 주기로 에너지를 얻습니다',
    growth: '자기 욕구 인정과 갈등 감내력을 기르면 더 성장합니다'
  },
  'ISTP': {
    behavior: '실용적으로 문제를 해결하고 기술을 연마합니다',
    mask: '쿨하고 독립적인 해결사의 모습을 보이지만',
    coping: '손을 사용하는 활동이나 스포츠로 해소합니다',
    growth: '감정 표현과 장기 계획 능력을 기르면 더 성장합니다'
  },
  'ISFP': {
    behavior: '조용히 자신만의 미학을 추구합니다',
    mask: '온화한 예술가의 모습을 보이지만',
    coping: '자연이나 예술 속에서 평화를 찾습니다',
    growth: '자기 표현과 주도성을 기르면 더 성장합니다'
  },
  'ESTP': {
    behavior: '순간을 즐기고 행동으로 옮깁니다',
    mask: '대담한 모험가의 모습을 보이지만',
    coping: '스릴 있는 활동으로 스트레스를 해소합니다',
    growth: '장기적 사고와 감정 인식을 기르면 더 성장합니다'
  },
  'ESFP': {
    behavior: '현재를 즐기고 주변에 활력을 줍니다',
    mask: '파티의 중심인 연예인의 모습을 보이지만',
    coping: '재미있는 활동과 사람들과의 어울림으로 회복합니다',
    growth: '집중력과 미래 계획 능력을 기르면 더 성장합니다'
  }
};

// 별자리별 선천적 특성 보완
const ZODIAC_INNATE: Record<string, { trait: string; strength: string; challenge: string }> = {
  '양자리': { trait: '개척자 정신과 용기', strength: '시작하는 힘, 추진력', challenge: '인내심과 마무리' },
  '황소자리': { trait: '안정 추구와 감각적 즐거움', strength: '끈기와 실용성', challenge: '변화 수용' },
  '쌍둥이자리': { trait: '호기심과 소통 능력', strength: '적응력과 재치', challenge: '깊이와 집중' },
  '게자리': { trait: '보호 본능과 감정 깊이', strength: '돌봄과 직관력', challenge: '객관성 유지' },
  '사자자리': { trait: '자기 표현과 리더십', strength: '카리스마와 창의성', challenge: '겸손함' },
  '처녀자리': { trait: '분석력과 완벽 추구', strength: '세심함과 실용성', challenge: '완벽주의 조절' },
  '천칭자리': { trait: '조화 추구와 미적 감각', strength: '외교력과 공정함', challenge: '결단력' },
  '전갈자리': { trait: '강렬함과 변환 능력', strength: '통찰력과 집중력', challenge: '집착 놓기' },
  '사수자리': { trait: '자유 추구와 낙천성', strength: '비전과 모험심', challenge: '현실 감각' },
  '염소자리': { trait: '책임감과 목표 지향', strength: '인내와 성취력', challenge: '여유와 즐거움' },
  '물병자리': { trait: '독창성과 인류애', strength: '혁신과 객관성', challenge: '감정 연결' },
  '물고기자리': { trait: '공감력과 상상력', strength: '직관과 치유력', challenge: '경계 설정' }
};

// 혈액형별 후천적 사회화 패턴
const BLOODTYPE_ACQUIRED: Record<string, { social: string; stress: string; relationship: string }> = {
  'A': {
    social: '조화를 중시하고 규칙을 따르는 방식으로 사회화되었습니다',
    stress: '완벽해야 한다는 압박과 타인의 시선에 민감합니다',
    relationship: '신뢰 쌓는 데 시간이 걸리지만 한번 열면 깊게 연결됩니다'
  },
  'B': {
    social: '자유롭게 자기 방식을 추구하며 사회화되었습니다',
    stress: '구속받는 느낌과 오해받는 것에 스트레스를 받습니다',
    relationship: '독립성을 존중받으면 가장 충성스러운 파트너가 됩니다'
  },
  'O': {
    social: '리더십과 사교성을 발휘하며 사회화되었습니다',
    stress: '통제력 상실과 무력감에 취약합니다',
    relationship: '넓은 인맥을 가지지만 진짜 속마음은 소수에게만 엽니다'
  },
  'AB': {
    social: '다양한 면을 상황에 맞게 보여주며 사회화되었습니다',
    stress: '이해받지 못한다는 느낌에 외로워집니다',
    relationship: '복잡한 내면을 가졌지만 진정한 연결을 갈망합니다'
  }
};

/**
 * 통합 기질 분석 생성
 */
export function generateTraitAnalysis(
  dayStem: string,
  mbti?: string,
  bloodType?: string,
  zodiacSign?: string,
  age?: number
): TraitAnalysis {
  const innateData = INNATE_BY_DAYMASTER[dayStem] || INNATE_BY_DAYMASTER['甲'];
  const acquiredData = mbti ? ACQUIRED_BY_MBTI[mbti] : null;
  const zodiacData = zodiacSign ? ZODIAC_INNATE[zodiacSign] : null;
  const bloodData = bloodType ? BLOODTYPE_ACQUIRED[bloodType] : null;

  // 선천적 기질 조합
  let innateCore = innateData.core;
  if (zodiacData) {
    innateCore += `, 그리고 ${zodiacSign}의 ${zodiacData.trait}이 더해져`;
  }

  // 후천적 기질 조합
  let acquiredBehavior = acquiredData?.behavior || '환경에 따라 다양하게 적응해왔습니다';
  if (bloodData) {
    acquiredBehavior = `${bloodData.social} ${acquiredData?.behavior || ''}`;
  }

  // 미래 투영 (나이에 따라)
  let futureProjection = '';
  if (age && age < 30) {
    futureProjection = `지금의 ${innateData.talent}을 잘 갈고닦으면, 30대에는 ${innateData.theme}를 주제로 크게 성장할 것입니다.`;
  } else if (age && age < 45) {
    futureProjection = `이제 ${innateData.potential}이 무르익는 시기입니다. ${acquiredData?.growth || '꾸준히 성장하면'} 인생 2막이 열립니다.`;
  } else if (age && age < 60) {
    futureProjection = `${innateData.theme}의 완성 단계입니다. 그동안의 경험이 지혜로 승화되어, 주변에 영향력을 미치게 됩니다.`;
  } else {
    futureProjection = `인생의 깊이가 빛나는 시기입니다. ${innateData.potential}이 후대에 전해지는 유산이 됩니다.`;
  }

  return {
    innate: {
      corePersonality: innateCore,
      hiddenPotential: innateData.potential + (zodiacData ? `. 특히 ${zodiacData.strength}이 강점입니다.` : ''),
      naturalTalent: innateData.talent,
      lifeTheme: innateData.theme
    },
    acquired: {
      learnedBehavior: acquiredBehavior,
      socialMask: acquiredData?.mask || '상황에 맞는 모습을 보여주지만',
      copingStyle: acquiredData?.coping || (bloodData?.stress || '나름의 방식으로 스트레스를 관리합니다'),
      growthDirection: acquiredData?.growth || '자기 이해를 통해 성장합니다'
    },
    synthesis: {
      currentState: `선천적으로 ${innateData.core}을 타고났고, 후천적으로 ${acquiredData?.behavior?.slice(0, 30) || '환경에 적응하며'}... 살아왔습니다.`,
      futureProjection,
      keyAdvice: `${zodiacData?.challenge || innateData.theme}에 주의하면서, ${acquiredData?.growth || '꾸준히 성장하세요'}`
    }
  };
}

// ========== 이번 달 운세 상세 ==========
export interface MonthlyFortune {
  month: number;
  year: number;
  bestDays: { day: number; reason: string; action: string }[];
  goodDays: { day: number; reason: string }[];
  avoidDays: { day: number; reason: string; warning: string }[];
  luckyNumbers: number[];
  lottoNumbers: number[];
  bestPeopleTypes: { type: string; reason: string }[];
  avoidPeopleTypes: { type: string; reason: string; howToHandle: string }[];
}

/**
 * 이번 달 상세 운세 생성
 */
export function generateMonthlyFortune(
  dayStem: string,
  yongsin: string[],
  targetYear: number,
  targetMonth: number
): MonthlyFortune {
  const primaryYongsin = yongsin[0] || 'wood';

  // 일간 숫자 기반 시드
  const stemIndex = '甲乙丙丁戊己庚辛壬癸'.indexOf(dayStem);
  const seed = (stemIndex + 1) * targetMonth;

  // 용신 왕성일 계산
  const yongsinPeakDays: Record<string, number[]> = {
    wood: [3, 8, 13, 18, 23, 28],
    fire: [2, 7, 12, 17, 22, 27],
    earth: [5, 10, 15, 20, 25, 30],
    metal: [4, 9, 14, 19, 24, 29],
    water: [1, 6, 11, 16, 21, 26]
  };

  // 상충일 계산 (기신 관련)
  const gisinDays: Record<string, number[]> = {
    wood: [4, 14, 24],  // 금극목
    fire: [1, 11, 21],  // 수극화
    earth: [3, 13, 23], // 목극토
    metal: [2, 12, 22], // 화극금
    water: [5, 15, 25]  // 토극수
  };

  const peakDays = yongsinPeakDays[primaryYongsin] || yongsinPeakDays.wood;
  const conflictDays = gisinDays[primaryYongsin] || gisinDays.wood;

  // 최고의 날 (귀인일 + 용신왕성)
  const bestDays = peakDays.slice(0, 2).map((day, idx) => ({
    day,
    reason: idx === 0 ? '천을귀인(天乙貴人)이 임하는 날' : '용신이 가장 왕성한 날',
    action: idx === 0 ? '중요한 미팅, 계약, 고백에 최적' : '새로운 시작, 투자 결정에 좋음'
  }));

  // 좋은 날
  const goodDays = peakDays.slice(2, 5).map(day => ({
    day,
    reason: '기운이 순조롭게 흐르는 날'
  }));

  // 피해야 할 날
  const avoidDays = conflictDays.map((day, idx) => ({
    day,
    reason: idx === 0 ? '상충(相衝) 기운이 강한 날' : '에너지 소모가 큰 날',
    warning: idx === 0 ? '계약서 날인, 큰 결정 미루세요' : '무리하지 말고 휴식하세요'
  }));

  // 로또 번호 (용신 기반 + 시드)
  const lottoBase = [
    ((seed * 7) % 45) + 1,
    ((seed * 11) % 45) + 1,
    ((seed * 13) % 45) + 1,
    ((seed * 17) % 45) + 1,
    ((seed * 19) % 45) + 1,
    ((seed * 23) % 45) + 1
  ];
  // 중복 제거 및 정렬
  const lottoNumbers = [...new Set(lottoBase)].sort((a, b) => a - b).slice(0, 6);
  while (lottoNumbers.length < 6) {
    const newNum = ((seed * (lottoNumbers.length + 29)) % 45) + 1;
    if (!lottoNumbers.includes(newNum)) lottoNumbers.push(newNum);
  }

  // 행운의 숫자
  const luckyNumbers = [
    ((stemIndex + 1) * 3) % 10 || 10,
    ((stemIndex + 1) * 7) % 10 || 10,
    ((stemIndex + targetMonth) % 10) || 10
  ];

  // 함께해야 할 사람 유형
  const bestPeopleTypes = getBestPeopleTypes(dayStem, primaryYongsin);

  // 피해야 할 사람 유형
  const avoidPeopleTypes = getAvoidPeopleTypes(dayStem, primaryYongsin);

  return {
    month: targetMonth,
    year: targetYear,
    bestDays,
    goodDays,
    avoidDays,
    luckyNumbers: [...new Set(luckyNumbers)],
    lottoNumbers: lottoNumbers.sort((a, b) => a - b),
    bestPeopleTypes,
    avoidPeopleTypes
  };
}

function getBestPeopleTypes(dayStem: string, yongsin: string): { type: string; reason: string }[] {
  const typesByYongsin: Record<string, { type: string; reason: string }[]> = {
    wood: [
      { type: '창의적이고 성장 지향적인 사람', reason: '함께 성장의 시너지를 낼 수 있습니다' },
      { type: '물(수) 기운을 가진 사람 (계수, 임수 일간)', reason: '당신에게 영감과 지혜를 줍니다' },
      { type: '조용하지만 깊이 있는 대화를 나누는 타입', reason: '내면을 풍요롭게 채워줍니다' }
    ],
    fire: [
      { type: '열정적이고 활동적인 사람', reason: '에너지가 상승하고 의욕이 생깁니다' },
      { type: '나무(목) 기운을 가진 사람', reason: '당신의 열정에 연료를 공급합니다' },
      { type: '솔직하고 표현력이 풍부한 타입', reason: '소통이 잘 되어 관계가 깊어집니다' }
    ],
    earth: [
      { type: '안정적이고 신뢰할 수 있는 사람', reason: '함께 있으면 마음이 편안해집니다' },
      { type: '불(화) 기운을 가진 사람', reason: '당신에게 따뜻함과 활력을 줍니다' },
      { type: '현실적이고 계획적인 타입', reason: '함께 구체적인 성과를 만들 수 있습니다' }
    ],
    metal: [
      { type: '원칙적이고 정직한 사람', reason: '서로 신뢰하며 목표를 향해 갈 수 있습니다' },
      { type: '흙(토) 기운을 가진 사람', reason: '당신을 지지하고 가치를 높여줍니다' },
      { type: '결단력 있고 실행력 있는 타입', reason: '함께 일을 추진하면 성과가 납니다' }
    ],
    water: [
      { type: '지혜롭고 유연한 사람', reason: '깊은 대화와 통찰을 나눌 수 있습니다' },
      { type: '쇠(금) 기운을 가진 사람', reason: '당신에게 구조와 방향을 제시합니다' },
      { type: '감성적이면서 이성적인 균형을 가진 타입', reason: '정서적으로 안정감을 줍니다' }
    ]
  };

  return typesByYongsin[yongsin] || typesByYongsin.wood;
}

function getAvoidPeopleTypes(dayStem: string, yongsin: string): { type: string; reason: string; howToHandle: string }[] {
  const typesByYongsin: Record<string, { type: string; reason: string; howToHandle: string }[]> = {
    wood: [
      { type: '지나치게 비판적이고 깎아내리는 사람', reason: '성장 에너지가 꺾입니다', howToHandle: '거리를 두고 최소한의 교류만 하세요' },
      { type: '쇠(금) 기운이 과한 사람', reason: '당신의 기운을 억압합니다', howToHandle: '대면 시 물(수) 기운 아이템을 지니세요' }
    ],
    fire: [
      { type: '차갑고 냉소적인 사람', reason: '열정이 꺼지고 의욕을 잃습니다', howToHandle: '필요한 만큼만 만나고 감정 소모를 줄이세요' },
      { type: '물(수) 기운이 과한 사람', reason: '당신의 에너지를 약화시킵니다', howToHandle: '나무(목) 기운 매개자를 통해 소통하세요' }
    ],
    earth: [
      { type: '변덕스럽고 약속을 안 지키는 사람', reason: '안정감이 흔들리고 불안해집니다', howToHandle: '기대치를 낮추고 핵심만 확인하세요' },
      { type: '나무(목) 기운이 과한 사람', reason: '당신의 기반을 흔듭니다', howToHandle: '불(화) 기운 매개자를 통해 완충하세요' }
    ],
    metal: [
      { type: '감정적이고 충동적인 사람', reason: '판단이 흐려지고 원칙이 무너집니다', howToHandle: '업무적 관계로만 유지하세요' },
      { type: '불(화) 기운이 과한 사람', reason: '당신의 결단력이 녹아버립니다', howToHandle: '흙(토) 기운 환경에서 만나세요' }
    ],
    water: [
      { type: '고압적이고 통제하려는 사람', reason: '자유로운 흐름이 막힙니다', howToHandle: '거리를 확보하고 독립성을 지키세요' },
      { type: '흙(토) 기운이 과한 사람', reason: '당신의 지혜가 막힙니다', howToHandle: '쇠(금) 기운 매개자를 활용하세요' }
    ]
  };

  return typesByYongsin[yongsin] || typesByYongsin.wood;
}

// ========== 5대 영역 성장 전략 ==========
export interface GrowthStrategy {
  people: { advice: string; action: string };
  luck: { advice: string; action: string };
  economy: { advice: string; action: string };
  love: { advice: string; action: string };
  environment: { advice: string; action: string };
}

export function generateGrowthStrategy(
  dayStem: string,
  yongsin: string[],
  mbti?: string,
  age?: number
): GrowthStrategy {
  const primaryYongsin = yongsin[0] || 'wood';
  const innateData = INNATE_BY_DAYMASTER[dayStem] || INNATE_BY_DAYMASTER['甲'];
  const acquiredData = mbti ? ACQUIRED_BY_MBTI[mbti] : null;

  const strategies: Record<string, GrowthStrategy> = {
    wood: {
      people: {
        advice: '성장을 도와주는 멘토와 파트너를 만나세요',
        action: '매월 새로운 분야의 전문가 1명과 대화하는 시간을 가지세요'
      },
      luck: {
        advice: '새로운 시작과 도전이 운을 열어줍니다',
        action: '분기마다 작은 것이라도 새로운 프로젝트를 시작하세요'
      },
      economy: {
        advice: '성장 산업과 미래 가치에 투자하세요',
        action: '소득의 10%는 자기 계발과 미래 산업에 투자하세요'
      },
      love: {
        advice: '함께 성장할 수 있는 파트너가 최고입니다',
        action: '공동의 목표나 취미를 만들어 함께 발전하세요'
      },
      environment: {
        advice: '녹색 공간과 자연이 에너지를 줍니다',
        action: '집이나 사무실에 식물을 두고, 주 1회 자연 속 산책을 하세요'
      }
    },
    fire: {
      people: {
        advice: '열정을 함께 나눌 동료와 지지자를 모으세요',
        action: '비전을 공유하는 커뮤니티에 적극 참여하세요'
      },
      luck: {
        advice: '표현하고 드러낼 때 운이 따릅니다',
        action: '생각을 글이나 말로 적극적으로 표현하세요'
      },
      economy: {
        advice: '자신의 브랜드와 영향력을 자산화하세요',
        action: '개인 브랜딩이나 콘텐츠 제작에 투자하세요'
      },
      love: {
        advice: '존경하고 존경받는 관계가 오래갑니다',
        action: '파트너의 장점을 매일 하나씩 인정해주세요'
      },
      environment: {
        advice: '밝고 활기찬 공간이 에너지를 높입니다',
        action: '조명을 밝게 하고, 따뜻한 색감의 인테리어를 하세요'
      }
    },
    earth: {
      people: {
        advice: '신뢰할 수 있는 소수의 핵심 인맥을 키우세요',
        action: '매주 중요한 사람 1명에게 안부를 전하세요'
      },
      luck: {
        advice: '꾸준함과 성실함이 결국 운을 만듭니다',
        action: '매일 같은 시간에 같은 루틴을 지키세요'
      },
      economy: {
        advice: '안정적인 자산과 부동산에 주목하세요',
        action: '투기보다 장기 안정 자산에 투자하세요'
      },
      love: {
        advice: '편안함과 안정감을 주는 관계가 최고입니다',
        action: '일상의 소소한 것을 함께 즐기세요'
      },
      environment: {
        advice: '안정감 있고 정리된 공간이 힘이 됩니다',
        action: '주 1회 공간 정리를 하고, 흙색 계열 소품을 두세요'
      }
    },
    metal: {
      people: {
        advice: '실력을 인정해주는 전문가 네트워크를 구축하세요',
        action: '업계 모임이나 세미나에 분기 1회 참석하세요'
      },
      luck: {
        advice: '결단하고 실행할 때 운이 열립니다',
        action: '미루던 결정을 이번 주 안에 하나 처리하세요'
      },
      economy: {
        advice: '가치 있는 것에 집중 투자하세요',
        action: '분산보다 확신이 드는 곳에 집중 투자하세요'
      },
      love: {
        advice: '서로의 가치관이 맞는지가 중요합니다',
        action: '인생관, 금전관, 가족관을 솔직히 대화하세요'
      },
      environment: {
        advice: '깔끔하고 정돈된 미니멀 공간이 좋습니다',
        action: '불필요한 물건을 정리하고, 금속/흰색 소품을 두세요'
      }
    },
    water: {
      people: {
        advice: '깊이 있는 대화가 되는 소울메이트를 만나세요',
        action: '매주 한 사람과 1시간 이상 깊은 대화를 나누세요'
      },
      luck: {
        advice: '흐름을 따르고 직관을 믿을 때 운이 옵니다',
        action: '첫 느낌을 무시하지 말고 기록해두세요'
      },
      economy: {
        advice: '현금 흐름과 유동성을 확보하세요',
        action: '비상금을 넉넉히 준비하고, 유연한 포트폴리오를 유지하세요'
      },
      love: {
        advice: '감정적 교류와 깊은 이해가 핵심입니다',
        action: '하루 끝에 서로의 하루를 5분 이상 나누세요'
      },
      environment: {
        advice: '물과 관련된 요소가 에너지를 줍니다',
        action: '작은 수족관이나 분수를 두고, 물가 여행을 계획하세요'
      }
    }
  };

  return strategies[primaryYongsin] || strategies.wood;
}

// ========== 가족/자녀 관계 조언 ==========
export interface FamilyAdvice {
  parentStrength: string;      // 부모로서의 강점
  childGuidance: string;       // 자녀 양육 방향
  familyHarmony: string;       // 가족 화합 팁
  intergenerational: string;   // 세대 간 소통
  upgradeHint: string;         // 가족 분석 업그레이드 유도
}

export function generateFamilyAdvice(
  dayStem: string,
  hasChildren: boolean,
  mbti?: string
): FamilyAdvice {
  const innateData = INNATE_BY_DAYMASTER[dayStem] || INNATE_BY_DAYMASTER['甲'];

  const parentStrengths: Record<string, string> = {
    '甲': '자녀에게 도전정신과 리더십을 물려줄 수 있습니다. 큰 꿈을 품게 해주세요.',
    '乙': '자녀에게 유연함과 적응력을 가르칠 수 있습니다. 다양한 경험을 제공하세요.',
    '丙': '자녀에게 자신감과 표현력을 키워줄 수 있습니다. 빛나는 무대를 만들어주세요.',
    '丁': '자녀에게 섬세함과 통찰력을 전해줄 수 있습니다. 깊이 생각하는 습관을 길러주세요.',
    '戊': '자녀에게 안정감과 신뢰를 줄 수 있습니다. 든든한 울타리가 되어주세요.',
    '己': '자녀에게 배려심과 헌신을 보여줄 수 있습니다. 따뜻한 가정을 만들어주세요.',
    '庚': '자녀에게 결단력과 용기를 심어줄 수 있습니다. 옳은 것을 지키게 해주세요.',
    '辛': '자녀에게 섬세함과 미적 감각을 물려줄 수 있습니다. 아름다움을 보는 눈을 키워주세요.',
    '壬': '자녀에게 지혜와 큰 그림을 보는 눈을 줄 수 있습니다. 넓은 세상을 보여주세요.',
    '癸': '자녀에게 직관력과 감수성을 전해줄 수 있습니다. 마음을 읽는 법을 가르쳐주세요.'
  };

  const childGuidance = hasChildren
    ? `당신의 ${innateData.talent}이 자녀에게 가장 중요한 유산입니다. 말보다 보여주는 것이 효과적입니다.`
    : `미래에 자녀를 갖게 되면, ${innateData.talent}을 자연스럽게 전수하게 될 것입니다.`;

  return {
    parentStrength: parentStrengths[dayStem] || parentStrengths['甲'],
    childGuidance,
    familyHarmony: `가족 간에는 ${innateData.theme}의 가치를 공유하세요. 이것이 가문의 철학이 됩니다.`,
    intergenerational: '각 세대의 사주를 함께 보면, 서로를 더 깊이 이해할 수 있습니다.',
    upgradeHint: '🔮 가족 구성원 전체의 사주를 분석하면, 가족 간의 숨겨진 역학 관계와 최적의 소통법을 알 수 있습니다. "가족 궁합 분석"을 통해 더 깊은 인사이트를 얻어보세요.'
  };
}

// ========== 차별화 포인트 요약 ==========
export const DIFFERENTIATION_POINTS = {
  title: '우리 분석의 차별점',
  points: [
    {
      traditional: '전통 사주: 십신, 신살, 12운성 나열',
      ours: '현대적 해석: 선천적 기질과 후천적 성장을 통합 분석'
    },
    {
      traditional: '전통 사주: "좋다/나쁘다" 단순 판정',
      ours: '성장 전략: 5대 영역별 구체적 행동 제시'
    },
    {
      traditional: '전통 사주: 추상적 조언',
      ours: '실행 가능: 이번 달 베스트 데이, 로또 번호까지'
    },
    {
      traditional: '전통 사주: 사주만 분석',
      ours: '통합 분석: 사주 + MBTI + 별자리 + 혈액형 = 완전한 나'
    },
    {
      traditional: '전통 사주: 혼자 보는 리포트',
      ours: '공유 가치: 킬러 타이틀 + 디지털 부적 + SNS 공유'
    }
  ],
  closingMessage: '사주는 운명을 읽는 것이 아니라, 운명을 "설계"하는 도구입니다.'
};

export default {
  generateTraitAnalysis,
  generateMonthlyFortune,
  generateGrowthStrategy,
  generateFamilyAdvice,
  DIFFERENTIATION_POINTS,
  ZODIAC_INNATE
};
