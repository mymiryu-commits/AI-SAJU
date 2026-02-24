/**
 * MBTI 연동 분석 시스템
 *
 * 사주와 MBTI를 교차 분석하여
 * 더 깊은 성격 통찰을 제공합니다.
 */

// MBTI 16유형
export type MBTIType =
  | 'INTJ' | 'INTP' | 'ENTJ' | 'ENTP'
  | 'INFJ' | 'INFP' | 'ENFJ' | 'ENFP'
  | 'ISTJ' | 'ISFJ' | 'ESTJ' | 'ESFJ'
  | 'ISTP' | 'ISFP' | 'ESTP' | 'ESFP';

// 일간별 MBTI 궁합 및 분기
export interface MBTIDayMasterMatch {
  dayMaster: string;
  bestMBTI: MBTIType[];
  challengingMBTI: MBTIType[];
  strengthsWithT: string;  // 사고형(T) 성향일 때 강점
  strengthsWithF: string;  // 감정형(F) 성향일 때 강점
  adviceForT: string;
  adviceForF: string;
}

// 일간별 MBTI 매칭 데이터
export const DAYMASTER_MBTI_MATCH: Record<string, MBTIDayMasterMatch> = {
  '갑': {
    dayMaster: '갑',
    bestMBTI: ['ENTJ', 'ENFJ', 'INTJ', 'INFJ'],
    challengingMBTI: ['ISFP', 'ESFP', 'ISTP', 'ESTP'],
    strengthsWithT: '논리적 리더십으로 조직을 이끌며, 전략적 사고로 목표를 달성합니다.',
    strengthsWithF: '따뜻한 카리스마로 사람들을 감화시키며, 공감과 비전으로 이끕니다.',
    adviceForT: '가끔은 감정에 귀 기울여보세요. 논리만으로는 사람의 마음을 얻기 어렵습니다.',
    adviceForF: '감정과 논리의 균형을 찾으세요. 당신의 따뜻함에 전략을 더하면 더욱 빛납니다.'
  },
  '을': {
    dayMaster: '을',
    bestMBTI: ['INFP', 'INFJ', 'ENFP', 'ISFP'],
    challengingMBTI: ['ESTJ', 'ENTJ', 'ISTJ', 'INTJ'],
    strengthsWithT: '유연한 논리로 복잡한 문제를 풀어내며, 적응력 있는 분석을 합니다.',
    strengthsWithF: '섬세한 공감 능력으로 사람들의 마음을 읽으며, 예술적 감성을 발휘합니다.',
    adviceForT: '당신의 유연함이 큰 장점입니다. 때로는 원칙보다 유연함이 더 효과적입니다.',
    adviceForF: '감성을 발휘하되 현실감각도 놓치지 마세요. 꿈과 현실 사이의 다리가 되세요.'
  },
  '병': {
    dayMaster: '병',
    bestMBTI: ['ENFP', 'ENTP', 'ENFJ', 'ESFP'],
    challengingMBTI: ['ISTJ', 'ISFJ', 'INTJ', 'INFJ'],
    strengthsWithT: '열정적인 논쟁과 아이디어로 세상을 변화시킵니다.',
    strengthsWithF: '밝은 에너지로 주변을 감화시키고, 열정으로 영감을 줍니다.',
    adviceForT: '열정에 논리를 더하면 더 큰 영향력을 가질 수 있습니다.',
    adviceForF: '당신의 열정이 너무 뜨거워 타인을 압도하지 않도록 온도 조절을 해보세요.'
  },
  '정': {
    dayMaster: '정',
    bestMBTI: ['INFJ', 'INFP', 'ISFJ', 'ENFJ'],
    challengingMBTI: ['ESTP', 'ENTP', 'ISTP', 'INTP'],
    strengthsWithT: '섬세한 분석으로 디테일을 놓치지 않으며, 정교한 계획을 세웁니다.',
    strengthsWithF: '깊은 헌신과 따뜻함으로 사람들을 돌봅니다.',
    adviceForT: '분석력에 따뜻함을 더하세요. 섬세함이 더욱 빛날 것입니다.',
    adviceForF: '감정에 휩쓸리지 않도록 균형을 찾으세요. 당신의 헌신은 충분합니다.'
  },
  '무': {
    dayMaster: '무',
    bestMBTI: ['ISTJ', 'ISFJ', 'ESTJ', 'ESFJ'],
    challengingMBTI: ['ENFP', 'ENTP', 'INFP', 'INTP'],
    strengthsWithT: '체계적 사고와 안정적 실행력으로 조직의 기둥이 됩니다.',
    strengthsWithF: '든든한 포용력으로 모두를 품어주며, 신뢰의 상징이 됩니다.',
    adviceForT: '원칙을 지키되 유연함도 필요합니다. 변화를 두려워하지 마세요.',
    adviceForF: '당신의 안정감이 큰 위안이 됩니다. 더 많은 사람을 품어주세요.'
  },
  '기': {
    dayMaster: '기',
    bestMBTI: ['ISFP', 'ISFJ', 'INFP', 'ESFP'],
    challengingMBTI: ['ENTJ', 'ESTJ', 'INTJ', 'ENTP'],
    strengthsWithT: '실용적 분석으로 현실적인 해결책을 제시합니다.',
    strengthsWithF: '다정하고 섬세한 배려로 주변을 편안하게 합니다.',
    adviceForT: '논리에 감성을 더하면 더욱 설득력 있습니다.',
    adviceForF: '당신의 다정함이 많은 이들에게 위안이 됩니다. 자신도 돌보세요.'
  },
  '경': {
    dayMaster: '경',
    bestMBTI: ['ESTJ', 'ENTJ', 'ISTJ', 'INTJ'],
    challengingMBTI: ['INFP', 'ENFP', 'ISFP', 'ESFP'],
    strengthsWithT: '단호한 결정력과 철저한 실행으로 목표를 달성합니다.',
    strengthsWithF: '의리와 정으로 한번 맺은 인연을 끝까지 책임집니다.',
    adviceForT: '때로는 유연함이 더 강한 힘이 됩니다. 부드러움을 배워보세요.',
    adviceForF: '의리를 지키되 자신을 너무 희생하지 마세요. 균형이 필요합니다.'
  },
  '신': {
    dayMaster: '신',
    bestMBTI: ['INTJ', 'INTP', 'ISTJ', 'ISTP'],
    challengingMBTI: ['ENFJ', 'ENFP', 'ESFJ', 'ESFP'],
    strengthsWithT: '예리한 분석력과 정교함으로 완벽을 추구합니다.',
    strengthsWithF: '섬세한 감성으로 아름다움을 창조합니다.',
    adviceForT: '완벽을 추구하되 지나치지 않도록. 80%도 충분히 훌륭합니다.',
    adviceForF: '당신의 감성이 특별합니다. 더 많이 표현해도 좋습니다.'
  },
  '임': {
    dayMaster: '임',
    bestMBTI: ['INTP', 'ENTP', 'INTJ', 'ENTJ'],
    challengingMBTI: ['ISFJ', 'ESFJ', 'ISFP', 'ESFP'],
    strengthsWithT: '깊은 통찰과 전략적 사고로 큰 그림을 그립니다.',
    strengthsWithF: '포용력 있는 지혜로 사람들을 이끕니다.',
    adviceForT: '분석에 공감을 더하면 더 큰 영향력을 가집니다.',
    adviceForF: '당신의 지혜를 더 많이 나눠주세요. 세상이 필요로 합니다.'
  },
  '계': {
    dayMaster: '계',
    bestMBTI: ['INFP', 'INFJ', 'INTP', 'INTJ'],
    challengingMBTI: ['ESTJ', 'ENTJ', 'ESTP', 'ESFJ'],
    strengthsWithT: '직관적 통찰로 남들이 보지 못하는 것을 봅니다.',
    strengthsWithF: '깊은 감수성으로 예술적 영감을 받습니다.',
    adviceForT: '직관을 믿으세요. 당신의 통찰은 특별합니다.',
    adviceForF: '감성에 빠지지 않도록 현실도 바라보세요. 균형이 중요합니다.'
  }
};

// MBTI와 사주 일치도 계산
export interface MBTISajuMatch {
  matchScore: number;       // 0-100
  matchLevel: 'excellent' | 'good' | 'average' | 'challenging';
  summary: string;
  strengths: string[];
  growthAreas: string[];
  advice: string;
}

/**
 * MBTI와 사주 일치도 분석
 */
export function analyzeMBTISajuMatch(
  dayMaster: string,
  mbti: MBTIType
): MBTISajuMatch {
  const dayMasterKorean = dayMaster.length === 1 ? dayMaster : dayMaster.charAt(0);
  const match = DAYMASTER_MBTI_MATCH[dayMasterKorean];

  if (!match) {
    return {
      matchScore: 50,
      matchLevel: 'average',
      summary: '사주와 MBTI 정보를 확인해주세요.',
      strengths: [],
      growthAreas: [],
      advice: '더 정확한 분석을 위해 정보를 확인해주세요.'
    };
  }

  // T/F 분기
  const isThinker = mbti.includes('T');

  // 매칭 점수 계산
  let matchScore = 60; // 기본점수
  let matchLevel: MBTISajuMatch['matchLevel'] = 'average';

  if (match.bestMBTI.includes(mbti)) {
    matchScore = 85 + Math.floor(Math.random() * 10);
    matchLevel = 'excellent';
  } else if (match.challengingMBTI.includes(mbti)) {
    matchScore = 45 + Math.floor(Math.random() * 15);
    matchLevel = 'challenging';
  } else {
    matchScore = 60 + Math.floor(Math.random() * 20);
    matchLevel = 'good';
  }

  const strengths = isThinker
    ? [match.strengthsWithT]
    : [match.strengthsWithF];

  const advice = isThinker
    ? match.adviceForT
    : match.adviceForF;

  const levelDescriptions = {
    excellent: `${dayMasterKorean}일간과 ${mbti} 유형이 아주 잘 맞습니다. 타고난 강점이 배가 됩니다.`,
    good: `${dayMasterKorean}일간과 ${mbti} 유형이 조화롭습니다. 균형 잡힌 성향입니다.`,
    average: `${dayMasterKorean}일간과 ${mbti} 유형은 보완 관계입니다. 서로 다른 점이 성장 기회가 됩니다.`,
    challenging: `${dayMasterKorean}일간과 ${mbti} 유형은 도전적 조합입니다. 내면의 갈등이 있지만, 그것이 성장의 원천이 됩니다.`
  };

  return {
    matchScore,
    matchLevel,
    summary: levelDescriptions[matchLevel],
    strengths,
    growthAreas: matchLevel === 'challenging'
      ? ['내면의 상충되는 욕구 조율하기', '다양한 상황에 맞는 대응력 키우기']
      : ['현재 강점을 더욱 발전시키기'],
    advice
  };
}

// MBTI 유형별 설명
export const MBTI_DESCRIPTIONS: Record<MBTIType, {
  nickname: string;
  keywords: string[];
  strength: string;
  weakness: string;
}> = {
  INTJ: {
    nickname: '전략가',
    keywords: ['전략', '독립', '완벽주의'],
    strength: '뛰어난 전략적 사고와 독립심',
    weakness: '타인의 감정에 무심할 수 있음'
  },
  INTP: {
    nickname: '논리술사',
    keywords: ['논리', '분석', '탐구'],
    strength: '깊은 논리적 사고와 분석력',
    weakness: '현실적 실행력이 부족할 수 있음'
  },
  ENTJ: {
    nickname: '통솔자',
    keywords: ['리더십', '결단', '효율'],
    strength: '강력한 리더십과 실행력',
    weakness: '독단적일 수 있음'
  },
  ENTP: {
    nickname: '토론가',
    keywords: ['아이디어', '토론', '혁신'],
    strength: '창의적 문제해결과 토론 능력',
    weakness: '세부사항을 놓칠 수 있음'
  },
  INFJ: {
    nickname: '옹호자',
    keywords: ['통찰', '이상', '헌신'],
    strength: '깊은 통찰력과 이상주의',
    weakness: '과도한 이상으로 지칠 수 있음'
  },
  INFP: {
    nickname: '중재자',
    keywords: ['이상', '감성', '진정성'],
    strength: '깊은 감성과 진정성',
    weakness: '현실과 이상의 괴리에 힘들 수 있음'
  },
  ENFJ: {
    nickname: '선도자',
    keywords: ['카리스마', '공감', '영향력'],
    strength: '뛰어난 공감과 영향력',
    weakness: '타인에게 지나치게 신경 쓸 수 있음'
  },
  ENFP: {
    nickname: '활동가',
    keywords: ['열정', '창의', '자유'],
    strength: '넘치는 열정과 창의성',
    weakness: '집중력과 인내심이 부족할 수 있음'
  },
  ISTJ: {
    nickname: '현실주의자',
    keywords: ['책임', '성실', '전통'],
    strength: '강한 책임감과 성실함',
    weakness: '변화에 저항할 수 있음'
  },
  ISFJ: {
    nickname: '수호자',
    keywords: ['헌신', '보호', '세심함'],
    strength: '타인을 위한 헌신과 세심함',
    weakness: '자기 욕구를 억누를 수 있음'
  },
  ESTJ: {
    nickname: '경영자',
    keywords: ['조직', '효율', '전통'],
    strength: '뛰어난 조직력과 실행력',
    weakness: '융통성이 부족할 수 있음'
  },
  ESFJ: {
    nickname: '집정관',
    keywords: ['화합', '배려', '사교'],
    strength: '뛰어난 사교성과 배려심',
    weakness: '타인의 평가에 민감할 수 있음'
  },
  ISTP: {
    nickname: '장인',
    keywords: ['분석', '실용', '적응'],
    strength: '실용적 문제해결과 적응력',
    weakness: '감정 표현이 서툴 수 있음'
  },
  ISFP: {
    nickname: '모험가',
    keywords: ['감성', '예술', '자유'],
    strength: '예술적 감성과 유연함',
    weakness: '계획적 접근이 어려울 수 있음'
  },
  ESTP: {
    nickname: '사업가',
    keywords: ['행동', '현실', '모험'],
    strength: '빠른 행동력과 현실 감각',
    weakness: '장기적 계획에 약할 수 있음'
  },
  ESFP: {
    nickname: '연예인',
    keywords: ['즐거움', '사교', '낙관'],
    strength: '뛰어난 사교성과 낙관주의',
    weakness: '심각한 상황을 회피할 수 있음'
  }
};

/**
 * MBTI 유형 설명 생성
 */
export function getMBTIDescription(mbti: MBTIType): string {
  const desc = MBTI_DESCRIPTIONS[mbti];
  if (!desc) return '';

  return `당신의 MBTI 유형은 ${mbti} - "${desc.nickname}"입니다.

핵심 키워드: ${desc.keywords.join(', ')}

강점: ${desc.strength}
성장 포인트: ${desc.weakness}`;
}

/**
 * 사주와 MBTI 통합 분석 요약 생성
 */
export function generateIntegratedAnalysis(
  dayMaster: string,
  mbti: MBTIType,
  yongsin: string[]
): string {
  const match = analyzeMBTISajuMatch(dayMaster, mbti);
  const mbtiDesc = MBTI_DESCRIPTIONS[mbti];

  if (!mbtiDesc) return '';

  const isThinker = mbti.includes('T');
  const isIntrovert = mbti.startsWith('I');

  let analysisText = `🔮 사주 × MBTI 통합 분석

【일치도】 ${match.matchScore}% (${match.matchLevel === 'excellent' ? '아주 좋음' : match.matchLevel === 'good' ? '좋음' : match.matchLevel === 'average' ? '보통' : '도전적'})

${match.summary}

【당신의 복합적 강점】
`;

  if (isThinker && isIntrovert) {
    analysisText += `깊이 생각하고 신중하게 결정하는 타입입니다. 조용하지만 강력한 영향력을 가집니다.`;
  } else if (isThinker && !isIntrovert) {
    analysisText += `논리적이면서도 활동적입니다. 리더십을 발휘하며 조직을 이끌 수 있습니다.`;
  } else if (!isThinker && isIntrovert) {
    analysisText += `깊은 감성과 내면의 세계를 가졌습니다. 예술적 감각이 뛰어납니다.`;
  } else {
    analysisText += `따뜻하고 활동적입니다. 사람들과 함께할 때 에너지가 넘칩니다.`;
  }

  analysisText += `

【성장 조언】
${match.advice}

용신 ${yongsin.join(', ')}의 기운을 활용하면, ${mbtiDesc.nickname}로서의 강점이 더욱 빛날 것입니다.`;

  return analysisText;
}

export default {
  DAYMASTER_MBTI_MATCH,
  MBTI_DESCRIPTIONS,
  analyzeMBTISajuMatch,
  getMBTIDescription,
  generateIntegratedAnalysis
};
