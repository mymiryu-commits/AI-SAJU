/**
 * MBTI 성향 분석 라이브러리
 * 성향이 강하면 대문자, 약하면 소문자로 표시
 */

// MBTI 차원별 정보
export const MBTI_DIMENSIONS = {
  EI: {
    name: '에너지 방향',
    E: { name: '외향', full: 'Extraversion', traits: ['사교적', '활동적', '말하면서 생각', '폭넓은 관계'] },
    I: { name: '내향', full: 'Introversion', traits: ['신중함', '깊이 있는 관계', '생각 후 말함', '혼자만의 시간'] },
  },
  SN: {
    name: '인식 기능',
    S: { name: '감각', full: 'Sensing', traits: ['현실적', '구체적', '경험 중시', '세부사항 주목'] },
    N: { name: '직관', full: 'Intuition', traits: ['미래지향', '가능성 탐색', '패턴 인식', '창의적'] },
  },
  TF: {
    name: '판단 기능',
    T: { name: '사고', full: 'Thinking', traits: ['논리적', '객관적', '원칙 중시', '분석적'] },
    F: { name: '감정', full: 'Feeling', traits: ['공감적', '조화 중시', '가치 기반', '배려심'] },
  },
  JP: {
    name: '생활 양식',
    J: { name: '판단', full: 'Judging', traits: ['계획적', '체계적', '결정 선호', '마감 준수'] },
    P: { name: '인식', full: 'Perceiving', traits: ['유연함', '적응력', '열린 태도', '즉흥적'] },
  },
} as const;

// 16가지 MBTI 유형 상세 정보
export const MBTI_TYPES = {
  INTJ: {
    name: '전략가',
    nickname: '용의주도한 전략가',
    description: '독립적이고 분석적이며, 높은 기준을 가진 완벽주의자입니다.',
    strengths: ['전략적 사고', '독립성', '결단력', '높은 기준'],
    weaknesses: ['지나친 비판', '감정 표현 부족', '완고함'],
    careers: ['과학자', '엔지니어', '전략 컨설턴트', '투자 분석가'],
    compatibility: { best: ['ENFP', 'ENTP'], good: ['INTJ', 'ENTJ', 'INFJ'] },
  },
  INTP: {
    name: '논리술사',
    nickname: '논리적인 사색가',
    description: '창의적이고 분석적이며, 지식을 탐구하는 것을 좋아합니다.',
    strengths: ['논리적 분석', '창의성', '객관성', '호기심'],
    weaknesses: ['우유부단함', '감정 둔감', '현실과 괴리'],
    careers: ['프로그래머', '수학자', '철학자', '건축가'],
    compatibility: { best: ['ENTJ', 'ESTJ'], good: ['INTP', 'ENTP', 'INFP'] },
  },
  ENTJ: {
    name: '통솔자',
    nickname: '대담한 통솔자',
    description: '카리스마 있고 자신감 넘치며, 목표 달성에 집중합니다.',
    strengths: ['리더십', '효율성', '자신감', '전략적 계획'],
    weaknesses: ['지배적', '참을성 부족', '감정 무시'],
    careers: ['CEO', '변호사', '기업가', '정치인'],
    compatibility: { best: ['INTP', 'ISTP'], good: ['ENTJ', 'INTJ', 'ENFP'] },
  },
  ENTP: {
    name: '변론가',
    nickname: '뜨거운 논쟁을 즐기는 변론가',
    description: '창의적이고 재치있으며, 새로운 아이디어를 탐구합니다.',
    strengths: ['창의성', '재치', '적응력', '지식욕'],
    weaknesses: ['논쟁적', '일관성 부족', '규칙 무시'],
    careers: ['기업가', '변호사', '컨설턴트', '발명가'],
    compatibility: { best: ['INFJ', 'INTJ'], good: ['ENTP', 'ENFP', 'INTP'] },
  },
  INFJ: {
    name: '옹호자',
    nickname: '선의의 옹호자',
    description: '이상주의적이고 통찰력 있으며, 다른 사람을 돕고자 합니다.',
    strengths: ['통찰력', '이타심', '창의성', '결단력'],
    weaknesses: ['완벽주의', '은둔 경향', '비판에 민감'],
    careers: ['상담사', '작가', '심리학자', 'NGO 활동가'],
    compatibility: { best: ['ENTP', 'ENFP'], good: ['INFJ', 'INTJ', 'INFP'] },
  },
  INFP: {
    name: '중재자',
    nickname: '열정적인 중재자',
    description: '이상주의적이고 공감 능력이 뛰어나며, 가치를 중시합니다.',
    strengths: ['공감력', '창의성', '이상주의', '헌신'],
    weaknesses: ['현실 회피', '자기 비판', '지나친 이상화'],
    careers: ['작가', '예술가', '상담사', '사회복지사'],
    compatibility: { best: ['ENFJ', 'ENTJ'], good: ['INFP', 'INFJ', 'INTP'] },
  },
  ENFJ: {
    name: '선도자',
    nickname: '정의로운 선도자',
    description: '카리스마 있고 영감을 주며, 다른 사람의 성장을 돕습니다.',
    strengths: ['리더십', '공감력', '설득력', '이타심'],
    weaknesses: ['지나친 이상주의', '자기 희생', '비판에 민감'],
    careers: ['교사', '코치', 'HR 매니저', '정치인'],
    compatibility: { best: ['INFP', 'ISFP'], good: ['ENFJ', 'INFJ', 'ENFP'] },
  },
  ENFP: {
    name: '활동가',
    nickname: '재기발랄한 활동가',
    description: '열정적이고 창의적이며, 가능성을 탐구합니다.',
    strengths: ['열정', '창의성', '사교성', '공감력'],
    weaknesses: ['집중력 부족', '지나친 낙관', '실행력 부족'],
    careers: ['마케터', '저널리스트', '배우', '이벤트 플래너'],
    compatibility: { best: ['INTJ', 'INFJ'], good: ['ENFP', 'ENTP', 'INFP'] },
  },
  ISTJ: {
    name: '현실주의자',
    nickname: '청렴결백한 논리주의자',
    description: '책임감 있고 신뢰할 수 있으며, 전통을 중시합니다.',
    strengths: ['신뢰성', '책임감', '체계성', '인내심'],
    weaknesses: ['융통성 부족', '감정 표현 어려움', '변화 저항'],
    careers: ['회계사', '군인', '관리자', '판사'],
    compatibility: { best: ['ESFP', 'ESTP'], good: ['ISTJ', 'ISFJ', 'ESTJ'] },
  },
  ISFJ: {
    name: '수호자',
    nickname: '용감한 수호자',
    description: '헌신적이고 따뜻하며, 다른 사람을 보살피는 것을 좋아합니다.',
    strengths: ['헌신', '신뢰성', '인내심', '관찰력'],
    weaknesses: ['변화 저항', '자기 억압', '지나친 겸손'],
    careers: ['간호사', '교사', '사회복지사', '행정 전문가'],
    compatibility: { best: ['ESFP', 'ESTP'], good: ['ISFJ', 'ISTJ', 'ESFJ'] },
  },
  ESTJ: {
    name: '경영자',
    nickname: '엄격한 관리자',
    description: '체계적이고 실용적이며, 질서와 규칙을 중시합니다.',
    strengths: ['조직력', '헌신', '정직함', '인내심'],
    weaknesses: ['융통성 부족', '감정 무시', '지나친 고집'],
    careers: ['관리자', '군 장교', '판사', '재무 담당자'],
    compatibility: { best: ['ISFP', 'ISTP'], good: ['ESTJ', 'ISTJ', 'ENTJ'] },
  },
  ESFJ: {
    name: '집정관',
    nickname: '사교적인 외교관',
    description: '배려심 깊고 사교적이며, 조화를 중시합니다.',
    strengths: ['배려심', '협동심', '실용성', '충성심'],
    weaknesses: ['승인 욕구', '비판에 민감', '변화 저항'],
    careers: ['의료진', '교사', '이벤트 플래너', 'HR 담당자'],
    compatibility: { best: ['ISFP', 'ISTP'], good: ['ESFJ', 'ISFJ', 'ENFJ'] },
  },
  ISTP: {
    name: '장인',
    nickname: '만능 재주꾼',
    description: '실용적이고 관찰력이 뛰어나며, 도구와 기계를 다루는 데 능숙합니다.',
    strengths: ['문제 해결', '적응력', '실용성', '위기 대처'],
    weaknesses: ['감정 표현 부족', '약속 기피', '무감각'],
    careers: ['엔지니어', '기술자', '파일럿', '운동선수'],
    compatibility: { best: ['ESFJ', 'ESTJ'], good: ['ISTP', 'ESTP', 'INTP'] },
  },
  ISFP: {
    name: '모험가',
    nickname: '호기심 많은 예술가',
    description: '온화하고 민감하며, 아름다움과 조화를 추구합니다.',
    strengths: ['예술성', '공감력', '유연성', '충성심'],
    weaknesses: ['지나친 겸손', '갈등 회피', '계획성 부족'],
    careers: ['예술가', '수의사', '셰프', '물리치료사'],
    compatibility: { best: ['ESFJ', 'ESTJ', 'ENFJ'], good: ['ISFP', 'INFP', 'ESFP'] },
  },
  ESTP: {
    name: '사업가',
    nickname: '모험을 즐기는 사업가',
    description: '에너지 넘치고 실용적이며, 즉흥적으로 행동합니다.',
    strengths: ['대담함', '실용성', '사교성', '관찰력'],
    weaknesses: ['참을성 부족', '위험 추구', '규칙 무시'],
    careers: ['기업가', '영업', '응급구조사', '스포츠 에이전트'],
    compatibility: { best: ['ISFJ', 'ISTJ'], good: ['ESTP', 'ISTP', 'ESFP'] },
  },
  ESFP: {
    name: '연예인',
    nickname: '자유로운 영혼의 연예인',
    description: '활기차고 재미있으며, 순간을 즐기는 것을 좋아합니다.',
    strengths: ['열정', '실용성', '관찰력', '사교성'],
    weaknesses: ['집중력 부족', '계획성 부족', '비판에 민감'],
    careers: ['연예인', '이벤트 플래너', '영업', '여행 가이드'],
    compatibility: { best: ['ISFJ', 'ISTJ'], good: ['ESFP', 'ESTP', 'ISFP'] },
  },
} as const;

export type MBTIType = keyof typeof MBTI_TYPES;

// MBTI 유형별 동물 매칭
export const MBTI_ANIMALS: Record<MBTIType, {
  animal: string;
  emoji: string;
  traits: string[];
  description: string;
}> = {
  INTJ: {
    animal: '독수리',
    emoji: '🦅',
    traits: ['전략적 시야', '독립적', '날카로운 통찰력', '고고한 자세'],
    description: '높은 곳에서 전체를 조망하며 목표물을 정확히 포착하는 독수리처럼, 장기적 비전과 전략적 사고로 목표를 달성합니다.',
  },
  INTP: {
    animal: '올빼미',
    emoji: '🦉',
    traits: ['지혜로움', '관찰력', '밤의 사색가', '호기심'],
    description: '밤에 깨어 세상을 관찰하는 올빼미처럼, 깊은 사고와 지적 탐구를 즐기며 남들이 놓치는 것을 발견합니다.',
  },
  ENTJ: {
    animal: '사자',
    emoji: '🦁',
    traits: ['리더십', '카리스마', '당당함', '목표지향'],
    description: '백수의 왕 사자처럼, 타고난 리더십과 카리스마로 무리를 이끌고 목표를 향해 돌진합니다.',
  },
  ENTP: {
    animal: '여우',
    emoji: '🦊',
    traits: ['재치', '영리함', '적응력', '장난기'],
    description: '영리하고 재치있는 여우처럼, 어떤 상황에서도 창의적인 해결책을 찾고 논쟁을 즐깁니다.',
  },
  INFJ: {
    animal: '늑대',
    emoji: '🐺',
    traits: ['직관력', '충성심', '깊은 유대', '신비로움'],
    description: '무리에 헌신하면서도 신비로운 늑대처럼, 깊은 통찰력과 강한 유대감으로 소중한 이들을 보호합니다.',
  },
  INFP: {
    animal: '사슴',
    emoji: '🦌',
    traits: ['순수함', '감수성', '온화함', '이상주의'],
    description: '숲 속의 순수한 사슴처럼, 아름다움과 이상을 추구하며 자신만의 내면 세계에서 영감을 얻습니다.',
  },
  ENFJ: {
    animal: '돌고래',
    emoji: '🐬',
    traits: ['사교성', '공감력', '지능', '협동심'],
    description: '영리하고 사교적인 돌고래처럼, 주변 사람들과 깊은 유대를 형성하고 모두를 이끌어 성장시킵니다.',
  },
  ENFP: {
    animal: '골든리트리버',
    emoji: '🐕',
    traits: ['열정', '친근함', '긍정', '충성심'],
    description: '언제나 밝고 친근한 골든리트리버처럼, 넘치는 열정과 따뜻함으로 주변을 행복하게 만듭니다.',
  },
  ISTJ: {
    animal: '코끼리',
    emoji: '🐘',
    traits: ['기억력', '충실함', '인내심', '가족애'],
    description: '강한 기억력과 가족에 대한 헌신을 가진 코끼리처럼, 책임감 있게 전통과 약속을 지킵니다.',
  },
  ISFJ: {
    animal: '곰',
    emoji: '🐻',
    traits: ['보호본능', '따뜻함', '헌신', '강인함'],
    description: '가족을 보호하는 따뜻한 곰처럼, 소중한 사람들을 위해 묵묵히 헌신하고 보살핍니다.',
  },
  ESTJ: {
    animal: '코뿔소',
    emoji: '🦏',
    traits: ['강인함', '직진형', '원칙주의', '결단력'],
    description: '목표를 향해 직진하는 코뿔소처럼, 원칙과 규칙을 중시하며 강한 추진력으로 일을 완수합니다.',
  },
  ESFJ: {
    animal: '꿀벌',
    emoji: '🐝',
    traits: ['협동심', '부지런함', '사회성', '헌신'],
    description: '공동체를 위해 부지런히 일하는 꿀벌처럼, 주변 사람들의 조화와 행복을 위해 노력합니다.',
  },
  ISTP: {
    animal: '치타',
    emoji: '🐆',
    traits: ['민첩함', '독립성', '실용적', '순발력'],
    description: '빠르고 민첩한 치타처럼, 상황을 빠르게 파악하고 효율적으로 문제를 해결합니다.',
  },
  ISFP: {
    animal: '나비',
    emoji: '🦋',
    traits: ['자유로움', '예술성', '아름다움', '변화'],
    description: '자유롭게 날아다니는 나비처럼, 아름다움을 추구하며 자신만의 방식으로 세상을 탐험합니다.',
  },
  ESTP: {
    animal: '호랑이',
    emoji: '🐅',
    traits: ['대담함', '모험심', '민첩함', '본능적'],
    description: '대담하고 민첩한 호랑이처럼, 스릴과 도전을 즐기며 본능적으로 기회를 포착합니다.',
  },
  ESFP: {
    animal: '앵무새',
    emoji: '🦜',
    traits: ['활발함', '화려함', '사교성', '엔터테이너'],
    description: '화려하고 사교적인 앵무새처럼, 어디서든 분위기를 밝히고 사람들을 즐겁게 합니다.',
  },
};

// MBTI 궁합 상세 정보 (이유 포함)
export const MBTI_COMPATIBILITY_DETAILS: Record<MBTIType, {
  bestMatch: { type: MBTIType; reason: string }[];
  worstMatch: { type: MBTIType; reason: string }[];
}> = {
  INTJ: {
    bestMatch: [
      { type: 'ENFP', reason: '서로의 부족한 부분을 채워주며, ENFP의 열정이 INTJ의 계획을 현실로 만들어줍니다.' },
      { type: 'ENTP', reason: '지적 대화를 즐기며, 서로의 아이디어에 자극을 받아 함께 성장합니다.' },
    ],
    worstMatch: [
      { type: 'ESFP', reason: '즉흥적인 ESFP와 계획적인 INTJ는 생활 방식의 차이로 갈등할 수 있습니다.' },
      { type: 'ISFP', reason: '감정 표현 방식과 의사결정 기준이 달라 오해가 생기기 쉽습니다.' },
    ],
  },
  INTP: {
    bestMatch: [
      { type: 'ENTJ', reason: 'ENTJ의 실행력이 INTP의 아이디어를 현실화하며, 서로 존경합니다.' },
      { type: 'ESTJ', reason: '현실적인 ESTJ가 INTP의 이론을 실용적으로 적용하도록 도와줍니다.' },
    ],
    worstMatch: [
      { type: 'ESFJ', reason: '사회적 기대를 중시하는 ESFJ와 자유로운 INTP는 가치관 충돌이 있습니다.' },
      { type: 'ISFJ', reason: '전통을 중시하는 ISFJ와 혁신을 추구하는 INTP는 접근 방식이 다릅니다.' },
    ],
  },
  ENTJ: {
    bestMatch: [
      { type: 'INTP', reason: 'INTP의 깊은 분석력이 ENTJ의 전략을 더욱 정교하게 만들어줍니다.' },
      { type: 'ISTP', reason: '실용적인 ISTP가 ENTJ의 비전을 기술적으로 구현하는데 탁월합니다.' },
    ],
    worstMatch: [
      { type: 'ISFP', reason: '성과 중심의 ENTJ와 과정을 즐기는 ISFP는 목표 설정에서 충돌합니다.' },
      { type: 'INFP', reason: '직접적인 ENTJ의 소통 방식이 섬세한 INFP에게 상처가 될 수 있습니다.' },
    ],
  },
  ENTP: {
    bestMatch: [
      { type: 'INFJ', reason: 'INFJ의 깊은 통찰력이 ENTP의 아이디어에 의미와 방향을 더해줍니다.' },
      { type: 'INTJ', reason: '서로의 지적 호기심을 자극하며 끊임없이 토론하고 성장합니다.' },
    ],
    worstMatch: [
      { type: 'ISFJ', reason: '변화를 즐기는 ENTP와 안정을 추구하는 ISFJ는 템포가 맞지 않습니다.' },
      { type: 'ISTJ', reason: '규칙을 따르는 ISTJ와 규칙에 도전하는 ENTP는 자주 의견 충돌이 있습니다.' },
    ],
  },
  INFJ: {
    bestMatch: [
      { type: 'ENFP', reason: 'ENFP의 밝은 에너지가 INFJ를 세상 밖으로 이끌어주며 서로 영감을 줍니다.' },
      { type: 'ENTP', reason: '깊은 대화를 통해 서로의 관점을 넓히며 지적으로 교감합니다.' },
    ],
    worstMatch: [
      { type: 'ESTP', reason: '행동 중심의 ESTP와 의미를 찾는 INFJ는 대화의 깊이가 다릅니다.' },
      { type: 'ESTJ', reason: '효율을 중시하는 ESTJ와 가치를 중시하는 INFJ는 우선순위가 다릅니다.' },
    ],
  },
  INFP: {
    bestMatch: [
      { type: 'ENFJ', reason: 'ENFJ의 리더십이 INFP의 이상을 현실화하도록 격려하고 지지해줍니다.' },
      { type: 'ENTJ', reason: 'ENTJ의 추진력이 INFP의 창의적 아이디어에 날개를 달아줍니다.' },
    ],
    worstMatch: [
      { type: 'ESTJ', reason: '원칙적인 ESTJ의 직설적 표현이 섬세한 INFP에게 상처가 될 수 있습니다.' },
      { type: 'ESTP', reason: '행동 지향적 ESTP와 내면 지향적 INFP는 에너지 방향이 다릅니다.' },
    ],
  },
  ENFJ: {
    bestMatch: [
      { type: 'INFP', reason: 'INFP의 깊은 감성이 ENFJ의 공감 능력과 완벽하게 어우러집니다.' },
      { type: 'ISFP', reason: 'ISFP의 예술적 감성이 ENFJ의 열정에 영감을 더해줍니다.' },
    ],
    worstMatch: [
      { type: 'ISTP', reason: '감정 표현이 적은 ISTP와 소통을 중시하는 ENFJ는 교감하기 어렵습니다.' },
      { type: 'INTP', reason: '논리 중심의 INTP와 관계 중심의 ENFJ는 우선순위가 다릅니다.' },
    ],
  },
  ENFP: {
    bestMatch: [
      { type: 'INTJ', reason: 'INTJ의 깊이 있는 사고가 ENFP의 다양한 아이디어에 방향을 잡아줍니다.' },
      { type: 'INFJ', reason: '서로의 직관을 이해하며 깊은 정서적 유대를 형성합니다.' },
    ],
    worstMatch: [
      { type: 'ISTJ', reason: '자유로운 ENFP와 규칙적인 ISTJ는 생활 방식에서 마찰이 생깁니다.' },
      { type: 'ESTJ', reason: '창의성을 중시하는 ENFP와 효율성을 중시하는 ESTJ는 접근법이 다릅니다.' },
    ],
  },
  ISTJ: {
    bestMatch: [
      { type: 'ESFP', reason: 'ESFP의 활력이 ISTJ의 삶에 즐거움을 더하고, ISTJ는 안정감을 제공합니다.' },
      { type: 'ESTP', reason: '실용적인 두 유형이 현실적인 목표를 함께 달성해나갑니다.' },
    ],
    worstMatch: [
      { type: 'ENFP', reason: '즉흥적인 ENFP의 변화가 계획적인 ISTJ에게 스트레스가 됩니다.' },
      { type: 'ENTP', reason: '토론을 즐기는 ENTP와 결론을 선호하는 ISTJ는 소통 방식이 다릅니다.' },
    ],
  },
  ISFJ: {
    bestMatch: [
      { type: 'ESFP', reason: 'ESFP의 밝은 에너지가 ISFJ를 즐겁게 하고, ISFJ는 따뜻한 지지를 보냅니다.' },
      { type: 'ESTP', reason: '활동적인 ESTP가 ISFJ의 세계를 넓혀주며 새로운 경험을 선사합니다.' },
    ],
    worstMatch: [
      { type: 'ENTP', reason: '변화를 추구하는 ENTP와 안정을 원하는 ISFJ는 삶의 방향이 다릅니다.' },
      { type: 'ENTJ', reason: '성과 중심의 ENTJ와 관계 중심의 ISFJ는 가치관 차이가 있습니다.' },
    ],
  },
  ESTJ: {
    bestMatch: [
      { type: 'ISFP', reason: 'ISFP의 유연함이 ESTJ의 경직됨을 부드럽게 해주며 균형을 맞춥니다.' },
      { type: 'ISTP', reason: '실용적인 두 유형이 효율적으로 협력하며 목표를 달성합니다.' },
    ],
    worstMatch: [
      { type: 'INFP', reason: '직설적인 ESTJ와 섬세한 INFP는 의사소통에서 오해가 생기기 쉽습니다.' },
      { type: 'ENFP', reason: '규칙을 따르는 ESTJ와 자유를 추구하는 ENFP는 갈등이 잦습니다.' },
    ],
  },
  ESFJ: {
    bestMatch: [
      { type: 'ISFP', reason: '두 유형 모두 조화를 중시하며 서로를 배려하는 따뜻한 관계를 만듭니다.' },
      { type: 'ISTP', reason: 'ISTP의 문제 해결 능력이 ESFJ의 사회적 상황에서 큰 도움이 됩니다.' },
    ],
    worstMatch: [
      { type: 'INTP', reason: '감정적 교류를 원하는 ESFJ와 논리적 대화를 선호하는 INTP는 충족되지 않습니다.' },
      { type: 'INTJ', reason: '사회적 기대를 중시하는 ESFJ와 독립적인 INTJ는 기대치가 다릅니다.' },
    ],
  },
  ISTP: {
    bestMatch: [
      { type: 'ESFJ', reason: 'ESFJ의 따뜻함이 ISTP를 사회적으로 이끌어주며 안정감을 제공합니다.' },
      { type: 'ESTJ', reason: '실용적인 두 유형이 효율적으로 문제를 해결하며 협력합니다.' },
    ],
    worstMatch: [
      { type: 'ENFJ', reason: '깊은 감정 교류를 원하는 ENFJ와 독립적인 ISTP는 니즈가 다릅니다.' },
      { type: 'INFJ', reason: '의미를 찾는 INFJ와 실용을 추구하는 ISTP는 관점이 다릅니다.' },
    ],
  },
  ISFP: {
    bestMatch: [
      { type: 'ESFJ', reason: '두 유형 모두 조화와 아름다움을 추구하며 서로를 깊이 이해합니다.' },
      { type: 'ESTJ', reason: 'ESTJ의 체계성이 ISFP의 창의성에 구조를 제공해줍니다.' },
      { type: 'ENFJ', reason: 'ENFJ의 격려가 ISFP의 예술적 재능을 꽃피우게 합니다.' },
    ],
    worstMatch: [
      { type: 'ENTJ', reason: '결과 중심의 ENTJ와 과정을 즐기는 ISFP는 접근 방식이 충돌합니다.' },
      { type: 'INTJ', reason: '효율을 추구하는 INTJ와 자유를 원하는 ISFP는 기대가 다릅니다.' },
    ],
  },
  ESTP: {
    bestMatch: [
      { type: 'ISFJ', reason: 'ISFJ의 안정감이 ESTP의 모험적 삶에 따뜻한 귀환처가 됩니다.' },
      { type: 'ISTJ', reason: '두 유형 모두 현실적이며, ISTJ가 ESTP에게 신뢰할 수 있는 파트너가 됩니다.' },
    ],
    worstMatch: [
      { type: 'INFJ', reason: '깊은 의미를 찾는 INFJ와 순간을 즐기는 ESTP는 초점이 다릅니다.' },
      { type: 'INFP', reason: '이상을 추구하는 INFP와 현실적인 ESTP는 대화 주제가 맞지 않습니다.' },
    ],
  },
  ESFP: {
    bestMatch: [
      { type: 'ISFJ', reason: 'ISFJ의 헌신이 ESFP에게 안정감을 주고, ESFP는 즐거움을 선사합니다.' },
      { type: 'ISTJ', reason: 'ISTJ의 신뢰성이 ESFP의 자유로운 삶에 든든한 기반이 됩니다.' },
    ],
    worstMatch: [
      { type: 'INTJ', reason: '계획적인 INTJ와 즉흥적인 ESFP는 생활 리듬이 맞지 않습니다.' },
      { type: 'INTP', reason: '이론적인 INTP와 경험적인 ESFP는 관심사가 다릅니다.' },
    ],
  },
};

// MBTI 성향 강도 (0-100, 50이 중간)
export interface MBTITendency {
  EI: number; // 0=완전 E, 100=완전 I
  SN: number; // 0=완전 S, 100=완전 N
  TF: number; // 0=완전 T, 100=완전 F
  JP: number; // 0=완전 J, 100=완전 P
}

// 설문 문항
export const MBTI_QUESTIONS = [
  // E vs I (에너지 방향)
  {
    id: 1,
    dimension: 'EI' as const,
    question: '새로운 사람들을 만나는 모임에서 나는...',
    optionA: { text: '여러 사람과 적극적으로 대화한다', tendency: 'E' },
    optionB: { text: '소수의 사람과 깊이 있는 대화를 선호한다', tendency: 'I' },
  },
  {
    id: 2,
    dimension: 'EI' as const,
    question: '휴식을 취할 때 나는...',
    optionA: { text: '친구들과 함께 시간을 보내고 싶다', tendency: 'E' },
    optionB: { text: '혼자만의 시간이 필요하다', tendency: 'I' },
  },
  {
    id: 3,
    dimension: 'EI' as const,
    question: '나는 생각을...',
    optionA: { text: '말하면서 정리하는 편이다', tendency: 'E' },
    optionB: { text: '충분히 생각한 후에 말하는 편이다', tendency: 'I' },
  },
  {
    id: 4,
    dimension: 'EI' as const,
    question: '활동적인 하루를 보낸 후 나는...',
    optionA: { text: '에너지가 충전된 느낌이다', tendency: 'E' },
    optionB: { text: '에너지가 소진된 느낌이다', tendency: 'I' },
  },
  // S vs N (인식 기능)
  {
    id: 5,
    dimension: 'SN' as const,
    question: '문제를 해결할 때 나는...',
    optionA: { text: '검증된 방법을 선호한다', tendency: 'S' },
    optionB: { text: '새로운 방법을 시도해보고 싶다', tendency: 'N' },
  },
  {
    id: 6,
    dimension: 'SN' as const,
    question: '설명을 들을 때 나는...',
    optionA: { text: '구체적인 사실과 예시를 원한다', tendency: 'S' },
    optionB: { text: '전체적인 개념과 의미를 원한다', tendency: 'N' },
  },
  {
    id: 7,
    dimension: 'SN' as const,
    question: '나는 주로...',
    optionA: { text: '현재에 집중하는 편이다', tendency: 'S' },
    optionB: { text: '미래의 가능성을 상상하는 편이다', tendency: 'N' },
  },
  {
    id: 8,
    dimension: 'SN' as const,
    question: '새로운 것을 배울 때 나는...',
    optionA: { text: '단계별로 차근차근 배우는 것을 좋아한다', tendency: 'S' },
    optionB: { text: '전체 그림을 먼저 파악하고 싶다', tendency: 'N' },
  },
  // T vs F (판단 기능)
  {
    id: 9,
    dimension: 'TF' as const,
    question: '결정을 내릴 때 나는...',
    optionA: { text: '논리와 객관적 사실을 중시한다', tendency: 'T' },
    optionB: { text: '사람들의 감정과 가치를 중시한다', tendency: 'F' },
  },
  {
    id: 10,
    dimension: 'TF' as const,
    question: '친구가 고민을 털어놓을 때 나는...',
    optionA: { text: '해결책을 제시하려고 한다', tendency: 'T' },
    optionB: { text: '먼저 공감하고 들어주려고 한다', tendency: 'F' },
  },
  {
    id: 11,
    dimension: 'TF' as const,
    question: '비판을 받았을 때 나는...',
    optionA: { text: '그 내용이 타당한지 분석한다', tendency: 'T' },
    optionB: { text: '먼저 마음이 상한다', tendency: 'F' },
  },
  {
    id: 12,
    dimension: 'TF' as const,
    question: '중요한 일을 처리할 때 나는...',
    optionA: { text: '효율성을 최우선으로 생각한다', tendency: 'T' },
    optionB: { text: '관련된 사람들의 입장을 고려한다', tendency: 'F' },
  },
  // J vs P (생활 양식)
  {
    id: 13,
    dimension: 'JP' as const,
    question: '일정을 관리할 때 나는...',
    optionA: { text: '미리 계획을 세우고 따른다', tendency: 'J' },
    optionB: { text: '상황에 따라 유연하게 대처한다', tendency: 'P' },
  },
  {
    id: 14,
    dimension: 'JP' as const,
    question: '마감 기한이 있는 일을 할 때 나는...',
    optionA: { text: '일찍 시작해서 여유있게 끝낸다', tendency: 'J' },
    optionB: { text: '마감 직전에 집중력이 높아진다', tendency: 'P' },
  },
  {
    id: 15,
    dimension: 'JP' as const,
    question: '여행을 갈 때 나는...',
    optionA: { text: '상세한 계획을 세운다', tendency: 'J' },
    optionB: { text: '대략적인 방향만 정하고 즉흥적으로 움직인다', tendency: 'P' },
  },
  {
    id: 16,
    dimension: 'JP' as const,
    question: '선택을 해야 할 때 나는...',
    optionA: { text: '빠르게 결정하고 넘어가는 것을 선호한다', tendency: 'J' },
    optionB: { text: '여러 옵션을 열어두고 천천히 결정한다', tendency: 'P' },
  },
];

// 답변 타입
export interface MBTIAnswer {
  questionId: number;
  answer: 'A' | 'B';
}

/**
 * MBTI 결과 계산
 * 각 차원별로 0-100 사이의 값으로 성향 강도를 계산
 */
export function calculateMBTI(answers: MBTIAnswer[]): {
  type: MBTIType;
  tendency: MBTITendency;
  displayType: string;
  typeInfo: typeof MBTI_TYPES[MBTIType];
} {
  const dimensionScores = {
    EI: { E: 0, I: 0 },
    SN: { S: 0, N: 0 },
    TF: { T: 0, F: 0 },
    JP: { J: 0, P: 0 },
  };

  // 답변 집계
  answers.forEach((answer) => {
    const question = MBTI_QUESTIONS.find((q) => q.id === answer.questionId);
    if (!question) return;

    const selectedOption = answer.answer === 'A' ? question.optionA : question.optionB;
    const dimension = question.dimension;

    if (dimension === 'EI') {
      if (selectedOption.tendency === 'E') dimensionScores.EI.E++;
      else dimensionScores.EI.I++;
    } else if (dimension === 'SN') {
      if (selectedOption.tendency === 'S') dimensionScores.SN.S++;
      else dimensionScores.SN.N++;
    } else if (dimension === 'TF') {
      if (selectedOption.tendency === 'T') dimensionScores.TF.T++;
      else dimensionScores.TF.F++;
    } else if (dimension === 'JP') {
      if (selectedOption.tendency === 'J') dimensionScores.JP.J++;
      else dimensionScores.JP.P++;
    }
  });

  // 성향 강도 계산 (0-100, 첫 글자 방향 기준)
  const totalPerDimension = 4; // 각 차원당 4문항
  const tendency: MBTITendency = {
    EI: Math.round((dimensionScores.EI.I / totalPerDimension) * 100),
    SN: Math.round((dimensionScores.SN.N / totalPerDimension) * 100),
    TF: Math.round((dimensionScores.TF.F / totalPerDimension) * 100),
    JP: Math.round((dimensionScores.JP.P / totalPerDimension) * 100),
  };

  // MBTI 유형 결정
  const e = tendency.EI < 50 ? 'E' : 'I';
  const s = tendency.SN < 50 ? 'S' : 'N';
  const t = tendency.TF < 50 ? 'T' : 'F';
  const j = tendency.JP < 50 ? 'J' : 'P';

  const type = `${e}${s}${t}${j}` as MBTIType;

  // 대소문자 표시 (50에 가까울수록 소문자)
  const threshold = 25; // 25% 이내면 약한 성향 (소문자)
  const displayType = [
    Math.abs(tendency.EI - 50) > threshold ? e : e.toLowerCase(),
    Math.abs(tendency.SN - 50) > threshold ? s : s.toLowerCase(),
    Math.abs(tendency.TF - 50) > threshold ? t : t.toLowerCase(),
    Math.abs(tendency.JP - 50) > threshold ? j : j.toLowerCase(),
  ].join('');

  return {
    type,
    tendency,
    displayType,
    typeInfo: MBTI_TYPES[type],
  };
}

/**
 * 성향 강도 설명 생성
 */
export function getTendencyDescription(value: number, dimension: keyof typeof MBTI_DIMENSIONS): string {
  const strength = Math.abs(value - 50);
  const isFirst = value < 50;

  // 각 차원별 이름 매핑
  const dimensionNames: Record<string, { first: string; second: string }> = {
    EI: { first: '외향', second: '내향' },
    SN: { first: '감각', second: '직관' },
    TF: { first: '사고', second: '감정' },
    JP: { first: '판단', second: '인식' },
  };

  const names = dimensionNames[dimension];
  const tendencyName = isFirst ? names.first : names.second;

  if (strength >= 40) {
    return `매우 강한 ${tendencyName} 성향`;
  } else if (strength >= 25) {
    return `${tendencyName} 성향`;
  } else if (strength >= 10) {
    return `약한 ${tendencyName} 성향`;
  } else {
    return `${names.first}와 ${names.second} 사이`;
  }
}

/**
 * 궁합 점수 계산
 */
export function calculateCompatibility(type1: MBTIType, type2: MBTIType): {
  score: number;
  description: string;
} {
  const info1 = MBTI_TYPES[type1];
  const info2 = MBTI_TYPES[type2];

  let score = 60; // 기본 점수

  // 최고 궁합
  if ((info1.compatibility.best as readonly string[]).includes(type2)) score = 95;
  else if ((info1.compatibility.good as readonly string[]).includes(type2)) score = 80;

  // 양방향 체크
  if ((info2.compatibility.best as readonly string[]).includes(type1)) score = Math.max(score, 95);
  else if ((info2.compatibility.good as readonly string[]).includes(type1)) score = Math.max(score, 80);

  let description = '';
  if (score >= 90) description = '환상의 궁합! 서로를 깊이 이해할 수 있습니다.';
  else if (score >= 75) description = '좋은 궁합! 서로에게 긍정적인 영향을 줍니다.';
  else if (score >= 60) description = '보통의 궁합. 노력하면 좋은 관계를 만들 수 있습니다.';
  else description = '도전적인 궁합. 서로의 차이를 이해하려는 노력이 필요합니다.';

  return { score, description };
}
