/**
 * 다자간 궁합 분석 (Group Compatibility Analysis)
 * 2~5인 동시 분석, 상생 및 협동 전략
 */

import {
  GroupMember, GroupCompatibility, PairCompatibility,
  SajuChart, OhengBalance, Element, RelationType,
  ELEMENT_KOREAN, RELATION_KOREAN
} from '@/types/saju';
import { calculateSaju, BRANCH_ELEMENTS } from '../calculator';
import { analyzeOheng, analyzeElementInteraction } from '../oheng';

// 지지 삼합 (三合)
const TRIPLE_HARMONY: Record<string, { members: string[]; element: Element }> = {
  '申子辰': { members: ['申', '子', '辰'], element: 'water' },
  '亥卯未': { members: ['亥', '卯', '未'], element: 'wood' },
  '寅午戌': { members: ['寅', '午', '戌'], element: 'fire' },
  '巳酉丑': { members: ['巳', '酉', '丑'], element: 'metal' }
};

// 지지 육합 (六合)
const SIX_HARMONY: Record<string, string> = {
  '子': '丑', '丑': '子',
  '寅': '亥', '亥': '寅',
  '卯': '戌', '戌': '卯',
  '辰': '酉', '酉': '辰',
  '巳': '申', '申': '巳',
  '午': '未', '未': '午'
};

// 지지 충 (冲)
const BRANCH_CLASH: Record<string, string> = {
  '子': '午', '午': '子',
  '丑': '未', '未': '丑',
  '寅': '申', '申': '寅',
  '卯': '酉', '酉': '卯',
  '辰': '戌', '戌': '辰',
  '巳': '亥', '亥': '巳'
};

// 역할 특성
const ROLE_TRAITS: Record<Element, { role: string; strength: string }> = {
  wood: { role: '개척자/선구자', strength: '새로운 아이디어와 시작을 이끔' },
  fire: { role: '동기부여자/리더', strength: '열정으로 팀에 활력을 불어넣음' },
  earth: { role: '조율자/중재자', strength: '갈등을 조율하고 안정감 제공' },
  metal: { role: '실행자/완결자', strength: '결단력 있게 마무리를 담당' },
  water: { role: '전략가/분석가', strength: '유연하게 상황을 파악하고 조언' }
};

/**
 * 다자간 궁합 분석 메인 함수
 */
export function analyzeGroupCompatibility(
  members: GroupMember[]
): GroupCompatibility {
  if (members.length < 2 || members.length > 5) {
    throw new Error('2~5인 사이의 인원만 분석 가능합니다.');
  }

  // 각 멤버의 사주/오행 계산
  const analyzedMembers = members.map(member => {
    const saju = member.saju || calculateSaju(member.birthDate, member.birthTime);
    const ohengResult = analyzeOheng(saju);
    return {
      ...member,
      saju,
      oheng: ohengResult.balance
    };
  });

  // 전체 그룹 역학 분석
  const groupDynamics = analyzeGroupDynamics(analyzedMembers);

  // 개별 쌍 분석
  const pairAnalyses = generatePairAnalyses(analyzedMembers);

  // 역할 배정
  const roleAssignments = assignRoles(analyzedMembers);

  // 협력 전략
  const cooperationStrategies = generateCooperationStrategies(
    analyzedMembers,
    pairAnalyses
  );

  // 충돌 경고
  const conflictWarnings = identifyConflictWarnings(analyzedMembers, pairAnalyses);

  // 그룹 행운 요소
  const groupLucky = calculateGroupLucky(analyzedMembers, groupDynamics);

  return {
    members: analyzedMembers,
    totalMembers: analyzedMembers.length,
    analysisDate: new Date().toISOString().split('T')[0],
    groupDynamics,
    pairAnalyses,
    roleAssignments,
    cooperationStrategies,
    conflictWarnings,
    groupLucky
  };
}

/**
 * 그룹 역학 분석
 */
function analyzeGroupDynamics(members: GroupMember[]): {
  overallHarmony: number;
  dominantElement: Element;
  missingElement: Element;
  groupStrength: string;
  groupWeakness: string;
} {
  // 전체 오행 합산
  const totalOheng: OhengBalance = {
    wood: 0, fire: 0, earth: 0, metal: 0, water: 0
  };

  members.forEach(m => {
    if (m.oheng) {
      Object.keys(totalOheng).forEach(key => {
        totalOheng[key as Element] += m.oheng![key as Element];
      });
    }
  });

  // 우세 오행
  const entries = Object.entries(totalOheng) as [Element, number][];
  const sorted = entries.sort((a, b) => b[1] - a[1]);
  const dominantElement = sorted[0][0];
  const missingElement = sorted[sorted.length - 1][0];

  // 조화도 계산
  let harmonyScore = 70;

  // 오행 균형 체크
  const max = sorted[0][1];
  const min = sorted[sorted.length - 1][1];
  const variance = max - min;

  if (variance <= members.length) {
    harmonyScore += 15; // 균형 잡힘
  } else if (variance >= members.length * 3) {
    harmonyScore -= 15; // 불균형
  }

  // 삼합/육합 체크
  const dayBranches = members.map(m => m.saju?.day.earthlyBranch).filter(Boolean) as string[];
  if (hasTripleHarmony(dayBranches)) {
    harmonyScore += 10;
  }
  if (hasSixHarmony(dayBranches)) {
    harmonyScore += 5;
  }

  // 충 체크
  const clashCount = countClashes(dayBranches);
  harmonyScore -= clashCount * 8;

  // 강점/약점 텍스트
  const groupStrength = generateGroupStrength(dominantElement, harmonyScore);
  const groupWeakness = generateGroupWeakness(missingElement, variance, members.length);

  return {
    overallHarmony: Math.max(0, Math.min(100, harmonyScore)),
    dominantElement,
    missingElement,
    groupStrength,
    groupWeakness
  };
}

/**
 * 개별 쌍 분석 생성
 */
function generatePairAnalyses(members: GroupMember[]): PairCompatibility[] {
  const pairs: PairCompatibility[] = [];

  for (let i = 0; i < members.length; i++) {
    for (let j = i + 1; j < members.length; j++) {
      const pair = analyzePair(members[i], members[j]);
      pairs.push(pair);
    }
  }

  return pairs;
}

/**
 * 두 사람 궁합 분석
 */
function analyzePair(member1: GroupMember, member2: GroupMember): PairCompatibility {
  const saju1 = member1.saju!;
  const saju2 = member2.saju!;

  // 일간 오행 상호작용
  const elementInteraction = analyzeElementInteraction(
    saju1.day.element,
    saju2.day.element
  );

  // 지지 관계 분석
  const branch1 = saju1.day.earthlyBranch;
  const branch2 = saju2.day.earthlyBranch;

  let branchBonus = 0;
  let branchNote = '';

  // 육합 체크
  if (SIX_HARMONY[branch1] === branch2) {
    branchBonus = 15;
    branchNote = '일지 육합으로 자연스러운 조화';
  }

  // 충 체크
  if (BRANCH_CLASH[branch1] === branch2) {
    branchBonus = -15;
    branchNote = '일지 충으로 의견 대립 가능성';
  }

  // 최종 점수
  let overallScore = elementInteraction.compatibility + branchBonus;

  // 관계 유형별 보정
  const relationBonus = getRelationBonus(member1.relation, member2.relation);
  overallScore += relationBonus;

  overallScore = Math.max(0, Math.min(100, overallScore));

  // 강점/도전 생성
  const { strengths, challenges } = generatePairStrengthsAndChallenges(
    member1, member2, elementInteraction, branchNote
  );

  // 조언 생성
  const advice = generatePairAdvice(
    member1, member2, elementInteraction.type, overallScore
  );

  // 활동 추천
  const bestActivities = recommendPairActivities(saju1, saju2, member1.relation);
  const avoidSituations = identifyAvoidSituations(elementInteraction.type);

  return {
    member1Id: member1.id,
    member2Id: member2.id,
    member1Name: member1.name,
    member2Name: member2.name,
    overallScore,
    elementInteraction: {
      type: elementInteraction.type,
      description: elementInteraction.description + (branchNote ? ` ${branchNote}` : '')
    },
    strengths,
    challenges,
    advice,
    bestActivities,
    avoidSituations
  };
}

/**
 * 역할 배정
 */
function assignRoles(members: GroupMember[]): {
  memberId: string;
  memberName: string;
  bestRole: string;
  contribution: string;
}[] {
  return members.map(member => {
    const dayElement = member.saju!.day.element;
    const traits = ROLE_TRAITS[dayElement];

    // 오행 기반 세부 역할
    let bestRole = traits.role;
    let contribution = traits.strength;

    // 오행 균형에 따른 조정
    if (member.oheng) {
      const dominant = Object.entries(member.oheng)
        .sort((a, b) => b[1] - a[1])[0][0] as Element;

      if (dominant !== dayElement) {
        const subTraits = ROLE_TRAITS[dominant];
        bestRole += ` + ${subTraits.role.split('/')[0]}`;
        contribution += `. 또한 ${subTraits.strength.slice(0, 20)}...`;
      }
    }

    return {
      memberId: member.id,
      memberName: member.name,
      bestRole,
      contribution
    };
  });
}

/**
 * 협력 전략 생성
 */
function generateCooperationStrategies(
  members: GroupMember[],
  pairAnalyses: PairCompatibility[]
): {
  situation: string;
  strategy: string;
  keyPerson: string;
}[] {
  const strategies: { situation: string; strategy: string; keyPerson: string }[] = [];

  // 의사결정 상황
  const metalPerson = members.find(m => m.saju?.day.element === 'metal');
  if (metalPerson) {
    strategies.push({
      situation: '중요한 의사결정이 필요할 때',
      strategy: '결정권을 위임하거나 최종 의견을 구하세요',
      keyPerson: metalPerson.name
    });
  }

  // 갈등 상황
  const earthPerson = members.find(m => m.saju?.day.element === 'earth');
  if (earthPerson) {
    strategies.push({
      situation: '의견 대립이나 갈등 발생 시',
      strategy: '중재 역할을 맡기세요',
      keyPerson: earthPerson.name
    });
  }

  // 새 프로젝트
  const woodPerson = members.find(m => m.saju?.day.element === 'wood');
  if (woodPerson) {
    strategies.push({
      situation: '새로운 프로젝트나 아이디어가 필요할 때',
      strategy: '먼저 의견을 들어보세요',
      keyPerson: woodPerson.name
    });
  }

  // 동기부여
  const firePerson = members.find(m => m.saju?.day.element === 'fire');
  if (firePerson) {
    strategies.push({
      situation: '팀 사기가 떨어졌을 때',
      strategy: '분위기 전환을 부탁하세요',
      keyPerson: firePerson.name
    });
  }

  // 분석/전략
  const waterPerson = members.find(m => m.saju?.day.element === 'water');
  if (waterPerson) {
    strategies.push({
      situation: '복잡한 문제 해결이 필요할 때',
      strategy: '상황 분석을 맡기세요',
      keyPerson: waterPerson.name
    });
  }

  // 최고 궁합 쌍 활용
  const bestPair = pairAnalyses.sort((a, b) => b.overallScore - a.overallScore)[0];
  if (bestPair && bestPair.overallScore >= 80) {
    strategies.push({
      situation: '중요한 협업이 필요할 때',
      strategy: '두 사람이 함께 진행하면 시너지가 큽니다',
      keyPerson: `${bestPair.member1Name} & ${bestPair.member2Name}`
    });
  }

  return strategies;
}

/**
 * 충돌 경고 식별
 */
function identifyConflictWarnings(
  members: GroupMember[],
  pairAnalyses: PairCompatibility[]
): {
  involvedMembers: string[];
  issue: string;
  prevention: string;
}[] {
  const warnings: { involvedMembers: string[]; issue: string; prevention: string }[] = [];

  // 낮은 궁합 쌍 경고
  const lowScorePairs = pairAnalyses.filter(p => p.overallScore < 50);
  for (const pair of lowScorePairs) {
    warnings.push({
      involvedMembers: [pair.member1Name, pair.member2Name],
      issue: `상극 관계로 의견 충돌 가능성이 높습니다`,
      prevention: pair.advice
    });
  }

  // 같은 일간 경고 (비화)
  const dayMasters: Record<string, string[]> = {};
  members.forEach(m => {
    const dm = m.saju?.day.heavenlyStem || '';
    if (!dayMasters[dm]) dayMasters[dm] = [];
    dayMasters[dm].push(m.name);
  });

  Object.entries(dayMasters).forEach(([, names]) => {
    if (names.length >= 2) {
      warnings.push({
        involvedMembers: names,
        issue: '같은 일간으로 경쟁 의식이 생길 수 있습니다',
        prevention: '서로 다른 영역에서 활동하도록 역할을 분리하세요'
      });
    }
  });

  // 화(火) 다수 경고
  const fireCount = members.filter(m => m.saju?.day.element === 'fire').length;
  if (fireCount >= 2) {
    const fireNames = members
      .filter(m => m.saju?.day.element === 'fire')
      .map(m => m.name);
    warnings.push({
      involvedMembers: fireNames,
      issue: '열정이 충돌하여 과열될 수 있습니다',
      prevention: '토론 시 쿨다운 시간을 두고, 중재자를 지정하세요'
    });
  }

  return warnings;
}

/**
 * 그룹 행운 요소 계산
 */
function calculateGroupLucky(
  members: GroupMember[],
  dynamics: { dominantElement: Element; missingElement: Element }
): {
  bestDay: string;
  bestTime: string;
  luckyColor: string;
  luckyNumber: number;
  luckyDirection: string;
} {
  // 부족한 오행을 보충하는 방향으로 추천
  const targetElement = dynamics.missingElement;

  const dayMap: Record<Element, string> = {
    wood: '목요일 (목 기운 활성)',
    fire: '화요일 (화 기운 활성)',
    earth: '토요일 (토 기운 활성)',
    metal: '금요일 (금 기운 활성)',
    water: '수요일 (수 기운 활성)'
  };

  const timeMap: Record<Element, string> = {
    wood: '오전 5-9시 (인묘시)',
    fire: '오전 9시-오후 1시 (사오시)',
    earth: '오후 1-3시, 저녁 7-9시',
    metal: '오후 3-7시 (신유시)',
    water: '밤 9시-새벽 1시 (해자시)'
  };

  const colorMap: Record<Element, string> = {
    wood: '녹색/청색',
    fire: '빨간색/주황색',
    earth: '황색/베이지',
    metal: '흰색/은색',
    water: '검정색/파란색'
  };

  const numberMap: Record<Element, number> = {
    wood: 3,
    fire: 7,
    earth: 5,
    metal: 9,
    water: 1
  };

  const directionMap: Record<Element, string> = {
    wood: '동쪽',
    fire: '남쪽',
    earth: '중앙',
    metal: '서쪽',
    water: '북쪽'
  };

  return {
    bestDay: dayMap[targetElement],
    bestTime: timeMap[targetElement],
    luckyColor: colorMap[targetElement],
    luckyNumber: numberMap[targetElement],
    luckyDirection: directionMap[targetElement]
  };
}

// ===== 헬퍼 함수들 =====

function hasTripleHarmony(branches: string[]): boolean {
  for (const harmony of Object.values(TRIPLE_HARMONY)) {
    const matchCount = harmony.members.filter(m => branches.includes(m)).length;
    if (matchCount >= 2) return true;
  }
  return false;
}

function hasSixHarmony(branches: string[]): boolean {
  for (let i = 0; i < branches.length; i++) {
    for (let j = i + 1; j < branches.length; j++) {
      if (SIX_HARMONY[branches[i]] === branches[j]) {
        return true;
      }
    }
  }
  return false;
}

function countClashes(branches: string[]): number {
  let count = 0;
  for (let i = 0; i < branches.length; i++) {
    for (let j = i + 1; j < branches.length; j++) {
      if (BRANCH_CLASH[branches[i]] === branches[j]) {
        count++;
      }
    }
  }
  return count;
}

function getRelationBonus(rel1: RelationType, rel2: RelationType): number {
  // 같은 관계 유형끼리는 보너스
  if (rel1 === rel2) {
    if (rel1 === 'family') return 5;
    if (rel1 === 'colleague') return 3;
  }
  // 연인/썸은 특별 케이스
  if ((rel1 === 'lover' || rel1 === 'potential') &&
      (rel2 === 'lover' || rel2 === 'potential')) {
    return 8;
  }
  return 0;
}

function generateGroupStrength(dominant: Element, harmony: number): string {
  const strengths: Record<Element, string> = {
    wood: '성장 지향적이고 새로운 도전을 두려워하지 않는 그룹',
    fire: '열정과 추진력이 넘치는 활기찬 그룹',
    earth: '안정적이고 신뢰를 기반으로 움직이는 그룹',
    metal: '결단력 있고 실행력이 강한 그룹',
    water: '유연하고 지혜로운 전략적 그룹'
  };

  let base = strengths[dominant];
  if (harmony >= 80) {
    base += '. 전체적인 조화도가 매우 높습니다.';
  } else if (harmony >= 65) {
    base += '. 적절한 균형을 이루고 있습니다.';
  }
  return base;
}

function generateGroupWeakness(missing: Element, variance: number, memberCount: number): string {
  const weaknesses: Record<Element, string> = {
    wood: '새로운 시작이나 변화에 소극적일 수 있습니다',
    fire: '열정이나 추진력이 부족할 수 있습니다',
    earth: '안정감이 부족하고 기반이 흔들릴 수 있습니다',
    metal: '결단력이 부족하고 마무리가 약할 수 있습니다',
    water: '유연성이 부족하고 경직될 수 있습니다'
  };

  let base = `${ELEMENT_KOREAN[missing]} 기운 부족으로 ${weaknesses[missing]}`;

  if (variance >= memberCount * 3) {
    base += ' 오행 불균형이 심해 보완이 필요합니다.';
  }

  return base;
}

function generatePairStrengthsAndChallenges(
  m1: GroupMember,
  m2: GroupMember,
  interaction: { type: string; compatibility: number },
  branchNote: string
): { strengths: string[]; challenges: string[] } {
  const strengths: string[] = [];
  const challenges: string[] = [];

  if (interaction.type === '상생') {
    strengths.push('서로를 자연스럽게 돕는 관계입니다');
    strengths.push('함께 있으면 에너지가 상승합니다');
  } else if (interaction.type === '비화') {
    strengths.push('서로를 잘 이해하고 공감합니다');
    challenges.push('비슷한 관점으로 발전이 정체될 수 있습니다');
  } else if (interaction.type === '상극') {
    challenges.push('의견 충돌이 잦을 수 있습니다');
    strengths.push('다른 관점으로 서로를 보완합니다');
  }

  if (branchNote.includes('육합')) {
    strengths.push(branchNote);
  } else if (branchNote.includes('충')) {
    challenges.push(branchNote);
  }

  // 관계 유형별 추가
  if (m1.relation === 'lover' || m2.relation === 'lover') {
    strengths.push('감정적 교류가 깊어질 수 있는 관계');
  }
  if (m1.relation === 'colleague' || m2.relation === 'colleague') {
    strengths.push('업무적 협력이 원활할 수 있습니다');
  }

  return { strengths, challenges };
}

function generatePairAdvice(
  m1: GroupMember,
  m2: GroupMember,
  interactionType: string,
  score: number
): string {
  if (score >= 85) {
    return `${m1.name}님과 ${m2.name}님은 천생연분급 궁합입니다. 함께하는 시간을 늘리세요.`;
  } else if (score >= 70) {
    return `좋은 관계입니다. 서로의 장점을 인정하고 배우는 자세가 관계를 더 깊게 합니다.`;
  } else if (score >= 55) {
    return `보통 수준의 궁합입니다. 소통을 자주 하고, 오해가 생기면 바로 풀어가세요.`;
  } else if (score >= 40) {
    return `다소 긴장감이 있는 관계입니다. 중요한 대화 전 감정을 가라앉히고, 제3자의 중재가 도움됩니다.`;
  }
  return `조심스러운 관계입니다. 직접 대립보다 간접 소통을 활용하고, 공동 목표에 집중하세요.`;
}

function recommendPairActivities(saju1: SajuChart, saju2: SajuChart, relation: RelationType): string[] {
  const activities: string[] = [];

  // 오행 조합별 추천 활동
  const elements = [saju1.day.element, saju2.day.element];

  if (elements.includes('wood')) {
    activities.push('등산, 숲 산책');
  }
  if (elements.includes('fire')) {
    activities.push('운동, 공연 관람');
  }
  if (elements.includes('earth')) {
    activities.push('맛집 탐방, 쿠킹 클래스');
  }
  if (elements.includes('metal')) {
    activities.push('박물관, 전시회');
  }
  if (elements.includes('water')) {
    activities.push('수영, 온천, 낚시');
  }

  // 관계 유형별 추가
  if (relation === 'family') {
    activities.push('가족 여행, 명절 모임');
  } else if (relation === 'colleague') {
    activities.push('팀 빌딩 활동, 워크샵');
  } else if (relation === 'lover' || relation === 'potential') {
    activities.push('영화 데이트, 카페 투어');
  }

  return activities.slice(0, 4);
}

function identifyAvoidSituations(interactionType: string): string[] {
  if (interactionType === '상극') {
    return [
      '피곤하거나 예민한 상태에서의 대화',
      '돈 관련 의사결정',
      '술자리에서의 중요한 논의'
    ];
  } else if (interactionType === '비화') {
    return [
      '같은 목표를 두고 경쟁하는 상황',
      '주도권 다툼이 될 수 있는 프로젝트'
    ];
  }
  return ['특별히 피해야 할 상황이 적습니다'];
}

/**
 * 그룹 궁합 요약 생성
 */
export function generateGroupSummary(analysis: GroupCompatibility): string {
  const { groupDynamics, totalMembers, pairAnalyses } = analysis;

  const avgScore = Math.round(
    pairAnalyses.reduce((sum, p) => sum + p.overallScore, 0) / pairAnalyses.length
  );

  let summary = `${totalMembers}인 그룹의 전체 조화도는 ${groupDynamics.overallHarmony}점입니다. `;
  summary += `평균 쌍별 궁합은 ${avgScore}점이며, `;
  summary += `${ELEMENT_KOREAN[groupDynamics.dominantElement]} 에너지가 강한 그룹입니다. `;
  summary += `${ELEMENT_KOREAN[groupDynamics.missingElement]} 에너지를 보충하면 더 좋은 시너지를 낼 수 있습니다.`;

  return summary;
}
