/**
 * 오행 상생/상극 시적 표현 시스템
 *
 * 오행의 관계를 아름다운 시적 표현으로 해석합니다.
 */

// 오행 기본 정보
export interface ElementInfo {
  element: string;
  korean: string;
  season: string;
  direction: string;
  color: string;
  emotion: string;
  organ: string;
  nature: string;
  poeticName: string;
}

export const ELEMENT_INFO: Record<string, ElementInfo> = {
  '목': {
    element: '목',
    korean: '나무',
    season: '봄',
    direction: '동쪽',
    color: '청색',
    emotion: '분노',
    organ: '간',
    nature: '생장(生長)',
    poeticName: '푸른 새싹'
  },
  '화': {
    element: '화',
    korean: '불',
    season: '여름',
    direction: '남쪽',
    color: '적색',
    emotion: '기쁨',
    organ: '심장',
    nature: '발산(發散)',
    poeticName: '타오르는 불꽃'
  },
  '토': {
    element: '토',
    korean: '흙',
    season: '환절기',
    direction: '중앙',
    color: '황색',
    emotion: '사려',
    organ: '비장',
    nature: '조화(調和)',
    poeticName: '너른 대지'
  },
  '금': {
    element: '금',
    korean: '쇠',
    season: '가을',
    direction: '서쪽',
    color: '백색',
    emotion: '슬픔',
    organ: '폐',
    nature: '수렴(收斂)',
    poeticName: '빛나는 보석'
  },
  '수': {
    element: '수',
    korean: '물',
    season: '겨울',
    direction: '북쪽',
    color: '흑색',
    emotion: '두려움',
    organ: '신장',
    nature: '저장(貯藏)',
    poeticName: '깊은 물'
  }
};

// 상생 관계 시적 표현
export interface GeneratingRelation {
  from: string;
  to: string;
  relationName: string;
  poeticExpression: string;
  story: string;
  advice: string;
}

export const GENERATING_RELATIONS: Record<string, GeneratingRelation> = {
  '목_화': {
    from: '목',
    to: '화',
    relationName: '목생화(木生火)',
    poeticExpression: '나무가 타올라 불이 되듯',
    story: '당신 안의 나무 기운이 열정의 불을 피워냅니다. 새로운 아이디어와 성장의 에너지가 뜨거운 열정으로 변화합니다. 시작한 것이 불처럼 활활 타오를 것입니다.',
    advice: '성장의 에너지를 열정으로 전환하세요. 시작한 일을 뜨겁게 밀어붙이면 결실을 맺습니다.'
  },
  '화_토': {
    from: '화',
    to: '토',
    relationName: '화생토(火生土)',
    poeticExpression: '불이 타고 난 후 기름진 재가 되듯',
    story: '당신의 열정이 안정적인 기반으로 변화합니다. 뜨겁게 타오른 후, 그 재가 대지를 비옥하게 만들듯, 당신의 노력이 단단한 성과로 쌓여갑니다.',
    advice: '열정 후에는 정리와 안정의 시간이 필요합니다. 이룬 것을 바탕으로 기반을 다지세요.'
  },
  '토_금': {
    from: '토',
    to: '금',
    relationName: '토생금(土生金)',
    poeticExpression: '대지 속에서 보석이 태어나듯',
    story: '안정된 기반 위에서 가치 있는 것이 만들어집니다. 땅을 깊이 파면 보석이 나오듯, 당신의 꾸준한 노력이 빛나는 결실로 돌아옵니다.',
    advice: '기반을 탄탄히 다지면 결국 가치 있는 결과를 얻습니다. 인내하세요.'
  },
  '금_수': {
    from: '금',
    to: '수',
    relationName: '금생수(金生水)',
    poeticExpression: '바위 틈에서 맑은 샘물이 솟듯',
    story: '단단함 속에서 유연함이 태어납니다. 결단력과 원칙이 지혜로운 흐름으로 변화합니다. 강함이 부드러움을 낳습니다.',
    advice: '결단 후에는 유연하게 흐르세요. 강함과 부드러움을 모두 가질 때 완전해집니다.'
  },
  '수_목': {
    from: '수',
    to: '목',
    relationName: '수생목(水生木)',
    poeticExpression: '물을 먹고 나무가 자라듯',
    story: '지혜의 물이 성장의 나무를 키웁니다. 깊은 사고와 통찰이 새로운 시작과 발전으로 이어집니다. 잠복기 후에 도약이 옵니다.',
    advice: '충분히 충전하고 배운 후, 새로운 시작을 하세요. 물이 가득 차면 나무가 자랍니다.'
  }
};

// 상극 관계 시적 표현
export interface ControllingRelation {
  from: string;
  to: string;
  relationName: string;
  poeticExpression: string;
  story: string;
  challenge: string;
  advice: string;
}

export const CONTROLLING_RELATIONS: Record<string, ControllingRelation> = {
  '목_토': {
    from: '목',
    to: '토',
    relationName: '목극토(木克土)',
    poeticExpression: '나무 뿌리가 땅을 뚫듯',
    story: '성장의 힘이 안정을 뚫고 나옵니다. 때로는 변화를 위해 기존의 기반을 깨야 할 때가 있습니다.',
    challenge: '성장과 안정 사이에서 갈등할 수 있습니다.',
    advice: '변화와 안정 사이에서 균형을 찾으세요. 둘 다 필요합니다.'
  },
  '토_수': {
    from: '토',
    to: '수',
    relationName: '토극수(土克水)',
    poeticExpression: '흙이 물을 막듯',
    story: '안정을 추구하는 힘이 유연한 흐름을 막을 수 있습니다. 지나친 고착이 지혜의 흐름을 방해합니다.',
    challenge: '안정을 추구하다 새로운 기회를 놓칠 수 있습니다.',
    advice: '안정도 중요하지만 흐름을 완전히 막지 마세요. 물이 흘러야 생명이 있습니다.'
  },
  '수_화': {
    from: '수',
    to: '화',
    relationName: '수극화(水克火)',
    poeticExpression: '물이 불을 끄듯',
    story: '지혜와 신중함이 열정을 식힐 수 있습니다. 때로는 냉철함이 뜨거운 행동을 멈추게 합니다.',
    challenge: '너무 많은 생각이 행동을 막을 수 있습니다.',
    advice: '신중함도 필요하지만, 열정의 불을 완전히 끄지 마세요. 적당히 온도를 조절하세요.'
  },
  '화_금': {
    from: '화',
    to: '금',
    relationName: '화극금(火克金)',
    poeticExpression: '불이 쇠를 녹이듯',
    story: '열정의 불이 단단한 원칙을 녹일 수 있습니다. 뜨거운 감정이 이성적 판단을 흐리게 할 수 있습니다.',
    challenge: '열정이 앞서 원칙을 무시할 수 있습니다.',
    advice: '열정은 좋지만, 원칙과 결단력도 지키세요. 불로 쇠를 다루면 더 좋은 도구가 됩니다.'
  },
  '금_목': {
    from: '금',
    to: '목',
    relationName: '금극목(金克木)',
    poeticExpression: '도끼가 나무를 베듯',
    story: '결단의 칼날이 성장하는 것을 잘라낼 수 있습니다. 때로는 가지치기가 필요하지만, 지나치면 성장을 멈추게 합니다.',
    challenge: '과도한 비판과 잘라냄이 성장을 방해할 수 있습니다.',
    advice: '결단력을 발휘하되, 성장의 가능성은 남겨두세요. 가지치기는 나무를 죽이려는 게 아닙니다.'
  }
};

/**
 * 두 오행의 관계 분석
 */
export function analyzeElementRelation(element1: string, element2: string): {
  type: 'generating' | 'controlling' | 'same' | 'reverse_generating' | 'reverse_controlling';
  relation: GeneratingRelation | ControllingRelation | null;
  summary: string;
} {
  if (element1 === element2) {
    return {
      type: 'same',
      relation: null,
      summary: `같은 ${ELEMENT_INFO[element1]?.korean || element1} 기운이 만나 서로 힘을 더합니다.`
    };
  }

  // 상생 관계 확인
  const generatingKey = `${element1}_${element2}`;
  if (GENERATING_RELATIONS[generatingKey]) {
    return {
      type: 'generating',
      relation: GENERATING_RELATIONS[generatingKey],
      summary: GENERATING_RELATIONS[generatingKey].poeticExpression
    };
  }

  // 역상생 관계 확인
  const reverseGeneratingKey = `${element2}_${element1}`;
  if (GENERATING_RELATIONS[reverseGeneratingKey]) {
    return {
      type: 'reverse_generating',
      relation: GENERATING_RELATIONS[reverseGeneratingKey],
      summary: `${ELEMENT_INFO[element2]?.korean || element2}이(가) ${ELEMENT_INFO[element1]?.korean || element1}을(를) 낳습니다.`
    };
  }

  // 상극 관계 확인
  const controllingKey = `${element1}_${element2}`;
  if (CONTROLLING_RELATIONS[controllingKey]) {
    return {
      type: 'controlling',
      relation: CONTROLLING_RELATIONS[controllingKey],
      summary: CONTROLLING_RELATIONS[controllingKey].poeticExpression
    };
  }

  // 역상극 관계 확인
  const reverseControllingKey = `${element2}_${element1}`;
  if (CONTROLLING_RELATIONS[reverseControllingKey]) {
    return {
      type: 'reverse_controlling',
      relation: CONTROLLING_RELATIONS[reverseControllingKey],
      summary: `${ELEMENT_INFO[element2]?.korean || element2}이(가) ${ELEMENT_INFO[element1]?.korean || element1}을(를) 극합니다.`
    };
  }

  return {
    type: 'same',
    relation: null,
    summary: '오행 관계를 분석할 수 없습니다.'
  };
}

/**
 * 오행 균형 시적 해석
 */
export function generateElementBalancePoetry(balance: Record<string, number>): string {
  const elements = Object.entries(balance).sort((a, b) => b[1] - a[1]);
  const strongest = elements[0];
  const weakest = elements[elements.length - 1];

  const strongInfo = ELEMENT_INFO[strongest[0]];
  const weakInfo = ELEMENT_INFO[weakest[0]];

  if (!strongInfo || !weakInfo) return '';

  let poetry = `당신의 오행 속에서

${strongInfo.poeticName}의 기운이 가장 강하게 빛납니다.
${strongInfo.season}의 에너지, ${strongInfo.nature}의 본성이
당신의 핵심을 이룹니다.

그러나 ${weakInfo.poeticName}의 기운이 부족하니,
${weakInfo.season}의 지혜를 빌려와
균형을 맞추어야 합니다.`;

  // 상생 조언 추가
  const generatingKey = Object.keys(GENERATING_RELATIONS).find(key =>
    key.endsWith(`_${weakest[0]}`)
  );

  if (generatingKey) {
    const generating = GENERATING_RELATIONS[generatingKey];
    poetry += `

${generating.poeticExpression}
${generating.advice}`;
  }

  return poetry;
}

/**
 * 오행별 실행 처방 (Action Prescriptions)
 */
export const ELEMENT_ACTION_PRESCRIPTIONS: Record<string, {
  title: string;
  actions: string[];
  closingMessage: string;
  transitions: string[];
}> = {
  '목': {
    title: '나무 기운 보강 실천 3단 규칙',
    actions: [
      '오늘 새로운 것 하나 시작하기 (독서, 운동, 취미)',
      '자연 속에서 30분 이상 걷기',
      '성장 목표를 종이에 적어두기'
    ],
    closingMessage: '새싹이 땅을 뚫고 나오듯, 작은 시작이 큰 성장이 됩니다.',
    transitions: ['정체 → 성장 전환 필요', '수동 → 능동 구조 강화', '계획 → 실행 트리거 생성']
  },
  '화': {
    title: '불꽃 기운 보강 실천 3단 규칙',
    actions: [
      '오늘 미룬 일 1개 → 30분 즉시 착수',
      '공개 선언 1회 (메모·SNS·메신저)',
      '완료 체크 표시 남기기'
    ],
    closingMessage: '작은 불씨가 흐름을 바꿉니다.',
    transitions: ['계획 → 실행 전환 필요', '축적 → 발산 구조 강화', '관찰 → 행동 트리거 생성']
  },
  '토': {
    title: '대지 기운 보강 실천 3단 규칙',
    actions: [
      '오늘 하루 일정을 미리 정리하기',
      '한 가지 습관을 꾸준히 지키기',
      '주변을 깔끔하게 정돈하기'
    ],
    closingMessage: '단단한 기반 위에 모든 것이 세워집니다.',
    transitions: ['불안정 → 안정 전환 필요', '분산 → 집중 구조 강화', '변화 → 지속 트리거 생성']
  },
  '금': {
    title: '보석 기운 보강 실천 3단 규칙',
    actions: [
      '오늘 결정해야 할 것 하나 즉시 결정하기',
      '불필요한 것 1개 정리하거나 버리기',
      '명확한 기준으로 선택하기'
    ],
    closingMessage: '결단의 칼날이 길을 열어줍니다.',
    transitions: ['우유부단 → 결단 전환 필요', '혼란 → 명확 구조 강화', '보류 → 실행 트리거 생성']
  },
  '수': {
    title: '깊은 물 기운 보강 실천 3단 규칙',
    actions: [
      '오늘 10분 이상 조용히 생각하는 시간 갖기',
      '새로운 정보나 지식 하나 습득하기',
      '물 충분히 마시며 몸과 마음 정화하기'
    ],
    closingMessage: '고요한 물이 가장 깊은 지혜를 품습니다.',
    transitions: ['조급함 → 여유 전환 필요', '표면 → 심층 구조 강화', '반응 → 성찰 트리거 생성']
  }
};

/**
 * 향상된 오행 시적 해석 (사용자 표준안 적용)
 */
export interface EnhancedElementPoetry {
  title: string;
  mainInterpretation: string;
  coreMessage: {
    title: string;
    strongElement: string;
    weakElement: string;
    balanceAdvice: string;
    transitions: string[];
  };
  generatingRelations: {
    emoji: string;
    relationName: string;
    poeticExpression: string;
    advice: string;
  }[];
  controllingRelations: {
    emoji: string;
    relationName: string;
    poeticExpression: string;
    warning: string;
  }[];
  actionPrescription: {
    title: string;
    actions: string[];
    closingMessage: string;
  };
}

export function generateEnhancedElementPoetry(
  balance: Record<string, number>,
  yongsin?: string[]
): EnhancedElementPoetry {
  const elements = Object.entries(balance).sort((a, b) => b[1] - a[1]);
  const strongest = elements[0];
  const weakest = elements[elements.length - 1];

  const strongInfo = ELEMENT_INFO[strongest[0]];
  const weakInfo = ELEMENT_INFO[weakest[0]];

  // 용신이 있으면 용신 기준, 없으면 가장 부족한 오행 기준
  const targetElement = yongsin?.[0] ?
    (yongsin[0] === 'wood' ? '목' : yongsin[0] === 'fire' ? '화' :
     yongsin[0] === 'earth' ? '토' : yongsin[0] === 'metal' ? '금' :
     yongsin[0] === 'water' ? '수' : weakest[0]) : weakest[0];
  const targetInfo = ELEMENT_INFO[targetElement] || weakInfo;

  // 메인 해석
  const mainInterpretation = `당신의 오행 중심에는 ${strongInfo?.poeticName || '강한'}의 기운(${strongest[0]})이 가장 강하게 흐릅니다.
${strongInfo?.season || '특별한 계절'}의 에너지, ${strongInfo?.nature || '특별한'}의 본성이 당신의 핵심입니다.

그러나 ${targetInfo?.korean || '필요한'}(${targetElement})의 온기가 부족하면
${strongInfo?.korean || '강한 기운'}은 흐르지 못하고 머무르게 됩니다.

${getTransitionPoetry(strongest[0], targetElement)}

👉 시작한 일을 끝까지 밀어붙일 때 운은 따라옵니다.`;

  // 핵심 보완 메시지
  const actionData = ELEMENT_ACTION_PRESCRIPTIONS[targetElement] || ELEMENT_ACTION_PRESCRIPTIONS['화'];

  // 상생 관계 찾기 (타겟 오행 기준)
  const generatingRelations = Object.entries(GENERATING_RELATIONS)
    .filter(([key]) => key.includes(targetElement))
    .slice(0, 2)
    .map(([key, rel]) => ({
      emoji: getElementEmoji(rel.from),
      relationName: rel.relationName,
      poeticExpression: `${rel.poeticExpression}\n${rel.story}`,
      advice: rel.advice
    }));

  // 상극 관계 찾기
  const controllingRelations = Object.entries(CONTROLLING_RELATIONS)
    .filter(([key]) => key.includes(strongest[0]) || key.includes(targetElement))
    .slice(0, 2)
    .map(([key, rel]) => ({
      emoji: getElementEmoji(rel.from),
      relationName: rel.relationName,
      poeticExpression: `${rel.poeticExpression}\n${rel.story}`,
      warning: rel.challenge
    }));

  return {
    title: '오행의 시적 해석 — 에너지 균형 리포트',
    mainInterpretation,
    coreMessage: {
      title: `${getElementEmoji(targetElement)} 핵심 보완 메시지`,
      strongElement: `${strongInfo?.poeticName || strongest[0]}`,
      weakElement: `${targetInfo?.poeticName || targetElement}`,
      balanceAdvice: `${strongInfo?.poeticName || strongest[0]}의 기운이 강한 당신,\n${targetInfo?.poeticName || targetElement}의 기운을 더해 균형을 완성하세요.`,
      transitions: actionData.transitions
    },
    generatingRelations,
    controllingRelations,
    actionPrescription: {
      title: actionData.title,
      actions: actionData.actions,
      closingMessage: actionData.closingMessage
    }
  };
}

// 오행별 이모지
function getElementEmoji(element: string): string {
  const emojis: Record<string, string> = {
    '목': '🌳', '화': '🔥', '토': '🏔️', '금': '💎', '수': '💧'
  };
  return emojis[element] || '✨';
}

// 상생 전환 시적 표현
function getTransitionPoetry(from: string, to: string): string {
  const transitions: Record<string, string> = {
    '목_화': '나무(木)가 타올라 불이 되듯\n성장의 에너지를 행동과 열정으로 전환할 때,\n당신의 잠재력은 현실의 성과로 바뀝니다.',
    '화_토': '불(火)이 타고 재가 되어 땅을 비옥하게 하듯\n열정을 안정으로 전환할 때,\n당신의 노력은 단단한 기반이 됩니다.',
    '토_금': '대지(土) 속에서 보석이 태어나듯\n꾸준함을 결단으로 전환할 때,\n당신의 가치가 빛나게 됩니다.',
    '금_수': '바위 틈에서 맑은 샘이 솟듯\n결단을 지혜로 전환할 때,\n당신의 판단이 깊어집니다.',
    '수_목': '물을 머금고 나무가 자라듯\n지혜를 성장으로 전환할 때,\n당신의 가능성이 펼쳐집니다.'
  };

  // 직접 상생 관계 찾기
  const directKey = `${from}_${to}`;
  if (transitions[directKey]) return transitions[directKey];

  // 역방향 또는 기본값
  for (const [key, value] of Object.entries(transitions)) {
    if (key.includes(to)) return value;
  }

  return `${ELEMENT_INFO[to]?.poeticName || to}의 기운을 더할 때,\n당신의 에너지 균형이 완성됩니다.`;
}

/**
 * 프롤로그 템플릿 생성
 */
export function generatePrologue(
  name: string,
  dayMaster: string,
  yongsin: string[],
  birthYear: string
): string {
  const dayMasterInfo = ELEMENT_INFO[dayMaster];
  const yongsinInfo = yongsin[0] ? ELEMENT_INFO[yongsin[0]] : null;

  const yearAnimal = getYearAnimalFromBirthYear(birthYear);

  return `═══════════════════════════════════════
       ${name}님의 사주 이야기
═══════════════════════════════════════

${yearAnimal} 해에 태어나
${dayMasterInfo?.poeticName || '특별한 기운'}을 품고
이 세상에 왔습니다.

당신의 영혼 깊은 곳에는
${dayMasterInfo?.nature || '독특한'}의 본성이 흐르고,
${yongsinInfo?.poeticName || '필요한 기운'}이
당신을 완성으로 이끕니다.

이제, 당신만의 운명 이야기가 시작됩니다.

───────────────────────────────────────`;
}

/**
 * 에필로그 템플릿 생성
 */
export function generateEpilogue(
  name: string,
  dayMaster: string,
  yongsin: string[],
  targetYear: number
): string {
  const dayMasterInfo = ELEMENT_INFO[dayMaster];
  const yongsinInfo = yongsin[0] ? ELEMENT_INFO[yongsin[0]] : null;

  return `───────────────────────────────────────
       ${targetYear}년을 향한 메시지
───────────────────────────────────────

${name}님,

당신은 ${dayMasterInfo?.poeticName || '특별한 존재'}의 기운으로
이 세상에 유일무이한 존재로 태어났습니다.

${targetYear}년,
${yongsinInfo?.poeticName || '필요한 기운'}을 가까이 하고,
${yongsinInfo?.direction || '길한 방향'}으로 나아가면
운명이 당신을 도울 것입니다.

기억하세요.
운명은 정해진 것이 아니라,
당신이 만들어가는 것입니다.

이 분석이 당신의 선택에
작은 등불이 되기를 바랍니다.

행운을 빕니다. 🌟

═══════════════════════════════════════
        AI-SAJU 운명 분석 서비스
═══════════════════════════════════════`;
}

// 출생 연도로 띠 동물 가져오기
function getYearAnimalFromBirthYear(birthYear: string): string {
  const year = parseInt(birthYear.split('-')[0]);
  const animals = ['원숭이', '닭', '개', '돼지', '쥐', '소', '호랑이', '토끼', '용', '뱀', '말', '양'];
  const index = (year - 1900) % 12;
  return animals[index >= 0 ? index : index + 12];
}

export default {
  ELEMENT_INFO,
  GENERATING_RELATIONS,
  CONTROLLING_RELATIONS,
  ELEMENT_ACTION_PRESCRIPTIONS,
  analyzeElementRelation,
  generateElementBalancePoetry,
  generateEnhancedElementPoetry,
  generatePrologue,
  generateEpilogue
};
