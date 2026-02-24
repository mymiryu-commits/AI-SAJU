/**
 * 전문 명리학 용어 및 콘텐츠 시스템
 *
 * 한국 소비자들이 신뢰감을 느끼는 전문 용어와
 * 구체적인 행동 지침을 제공합니다.
 */

// ========== 일간(日干) 전문 해석 ==========
export interface DayMasterProfessional {
  hanja: string;           // 한자
  korean: string;          // 한글
  element: string;         // 오행
  elementHanja: string;    // 오행 한자
  nature: string;          // 성질 (양/음)
  symbol: string;          // 상징물
  poeticTitle: string;     // 시적 칭호
  professionalDesc: string; // 전문가 설명
  coreKeyword: string;     // 핵심 키워드
  hiddenTrait: string;     // 숨겨진 특성 (소름 포인트)
  lifeTheme: string;       // 인생 주제
  destinyPhrase: string;   // 운명 문구 (킬러 타이틀용)
}

export const DAY_MASTER_PROFESSIONAL: Record<string, DayMasterProfessional> = {
  '甲': {
    hanja: '甲木',
    korean: '갑목',
    element: 'wood',
    elementHanja: '木',
    nature: '양(陽)',
    symbol: '큰 나무, 대들보',
    poeticTitle: '만물을 깨우는 봄의 거목',
    professionalDesc: '갑목(甲木)은 동쪽의 청룡(靑龍) 기운을 타고난 대들보의 명입니다. 하늘을 향해 곧게 뻗어가는 거목처럼 추진력과 리더십이 강하며, 시작을 두려워하지 않습니다.',
    coreKeyword: '#선구자 #추진력 #대들보',
    hiddenTrait: '겉으로는 강해 보이지만, 혼자 모든 것을 짊어지려는 외로운 책임감이 있습니다',
    lifeTheme: '개척과 성장',
    destinyPhrase: '폭풍 속에서도 흔들리지 않는 천년 거목의 명'
  },
  '乙': {
    hanja: '乙木',
    korean: '을목',
    element: 'wood',
    elementHanja: '木',
    nature: '음(陰)',
    symbol: '풀, 덩굴, 꽃',
    poeticTitle: '바위를 뚫고 피어나는 생명력',
    professionalDesc: '을목(乙木)은 부드러움 속에 강인함을 품은 풀과 꽃의 명입니다. 갑목이 돌파라면, 을목은 우회하여 결국 목적을 이루는 지혜를 가졌습니다.',
    coreKeyword: '#유연함 #생존력 #외유내강',
    hiddenTrait: '순응하는 척하지만, 절대 자신의 방향을 잃지 않는 끈질긴 내면이 있습니다',
    lifeTheme: '적응과 조화',
    destinyPhrase: '콘크리트를 뚫고 피어나는 민들레의 명'
  },
  '丙': {
    hanja: '丙火',
    korean: '병화',
    element: 'fire',
    elementHanja: '火',
    nature: '양(陽)',
    symbol: '태양, 큰 불',
    poeticTitle: '세상을 비추는 태양의 화신',
    professionalDesc: '병화(丙火)는 남쪽의 주작(朱雀) 기운을 받은 태양의 명입니다. 어디서든 중심이 되며, 밝은 에너지로 주변을 이끕니다. 숨기는 것을 못하는 정직함이 특징입니다.',
    coreKeyword: '#태양 #리더십 #정열',
    hiddenTrait: '늘 밝아야 한다는 부담감, 지쳐도 내색하지 못하는 외로움이 있습니다',
    lifeTheme: '빛과 영향력',
    destinyPhrase: '어둠 속에서도 꺼지지 않는 등대의 명'
  },
  '丁': {
    hanja: '丁火',
    korean: '정화',
    element: 'fire',
    elementHanja: '火',
    nature: '음(陰)',
    symbol: '촛불, 달빛, 별',
    poeticTitle: '어둠을 밝히는 고요한 촛불',
    professionalDesc: '정화(丁火)는 은은하게 타오르는 촛불의 명입니다. 병화의 태양과 달리, 섬세하고 깊은 통찰력으로 핵심을 꿰뚫습니다. 학자나 전문가의 기질이 강합니다.',
    coreKeyword: '#통찰력 #섬세함 #지성',
    hiddenTrait: '차분해 보이지만, 내면에는 뜨거운 열정과 완벽주의가 숨어 있습니다',
    lifeTheme: '깊이와 통찰',
    destinyPhrase: '천 개의 촛불을 밝히는 지혜의 수호자'
  },
  '戊': {
    hanja: '戊土',
    korean: '무토',
    element: 'earth',
    elementHanja: '土',
    nature: '양(陽)',
    symbol: '산, 큰 바위, 대지',
    poeticTitle: '천하를 품는 태산의 위엄',
    professionalDesc: '무토(戊土)는 중앙의 황룡(黃龍) 기운을 받은 산과 대지의 명입니다. 흔들림 없는 신뢰감과 포용력이 있으며, 주변 사람들의 중심축 역할을 합니다.',
    coreKeyword: '#신뢰 #포용력 #안정',
    hiddenTrait: '변화를 두려워하는 것이 아니라, 변화 속에서도 지켜야 할 것을 아는 지혜가 있습니다',
    lifeTheme: '안정과 포용',
    destinyPhrase: '세상의 무게를 묵묵히 견디는 태산의 명'
  },
  '己': {
    hanja: '己土',
    korean: '기토',
    element: 'earth',
    elementHanja: '土',
    nature: '음(陰)',
    symbol: '정원, 논밭, 비옥한 흙',
    poeticTitle: '만물을 기르는 비옥한 대지',
    professionalDesc: '기토(己土)는 모든 생명을 품어 기르는 어머니 대지의 명입니다. 무토가 산이라면, 기토는 곡식이 자라는 논밭입니다. 배려심이 깊고 섬세합니다.',
    coreKeyword: '#배려 #헌신 #섬세함',
    hiddenTrait: '남을 위해 자신을 희생하면서도, 정작 본인의 욕구는 표현하지 못하는 면이 있습니다',
    lifeTheme: '헌신과 성장 지원',
    destinyPhrase: '침묵 속에서 천 개의 씨앗을 틔우는 대지의 어머니'
  },
  '庚': {
    hanja: '庚金',
    korean: '경금',
    element: 'metal',
    elementHanja: '金',
    nature: '양(陽)',
    symbol: '칼, 도끼, 원석',
    poeticTitle: '정의를 세우는 불굴의 검',
    professionalDesc: '경금(庚金)은 서쪽의 백호(白虎) 기운을 받은 강철의 명입니다. 결단력과 실행력이 뛰어나며, 옳고 그름에 타협하지 않습니다. 승부사의 기질이 있습니다.',
    coreKeyword: '#결단력 #정의 #승부사',
    hiddenTrait: '차갑게 보이지만, 인정받고 싶은 욕구와 따뜻한 마음이 깊이 숨어 있습니다',
    lifeTheme: '결단과 성취',
    destinyPhrase: '불의 앞에 무릎 꿇지 않는 강철 심장의 전사'
  },
  '辛': {
    hanja: '辛金',
    korean: '신금',
    element: 'metal',
    elementHanja: '金',
    nature: '음(陰)',
    symbol: '보석, 금은, 바늘',
    poeticTitle: '섬세하게 빛나는 보석의 정수',
    professionalDesc: '신금(辛金)은 세공된 보석처럼 섬세하고 예리한 명입니다. 경금의 거친 원석과 달리, 정교함과 미적 감각이 뛰어납니다. 완벽주의 성향이 강합니다.',
    coreKeyword: '#섬세함 #완벽주의 #심미안',
    hiddenTrait: '예민해서 상처받기 쉽지만, 그것을 티 내지 않으려 더 단단해지려 합니다',
    lifeTheme: '정교함과 가치',
    destinyPhrase: '천 번 갈아야 비로소 빛나는 다이아몬드의 명'
  },
  '壬': {
    hanja: '壬水',
    korean: '임수',
    element: 'water',
    elementHanja: '水',
    nature: '양(陽)',
    symbol: '바다, 큰 강, 호수',
    poeticTitle: '모든 것을 품는 바다의 지혜',
    professionalDesc: '임수(壬水)는 북쪽의 현무(玄武) 기운을 받은 바다와 큰 강의 명입니다. 어떤 그릇에도 담기는 포용력과 깊은 지혜가 있으며, 큰 그림을 보는 통찰력이 있습니다.',
    coreKeyword: '#지혜 #포용력 #큰그림',
    hiddenTrait: '흘러가는 듯 보이지만, 실은 모든 것을 기억하고 있습니다',
    lifeTheme: '지혜와 흐름',
    destinyPhrase: '천 갈래 물줄기를 모아 바다가 되는 대하(大河)의 명'
  },
  '癸': {
    hanja: '癸水',
    korean: '계수',
    element: 'water',
    elementHanja: '水',
    nature: '음(陰)',
    symbol: '이슬, 비, 안개, 샘물',
    poeticTitle: '생명을 틔우는 고요한 이슬',
    professionalDesc: '계수(癸水)는 은밀하게 만물을 적시는 이슬과 비의 명입니다. 임수의 바다와 달리, 조용히 스며드는 영향력과 직관력이 뛰어납니다. 영적 감수성이 높습니다.',
    coreKeyword: '#직관력 #감수성 #스며듦',
    hiddenTrait: '말없이 모든 것을 감지하고 있으며, 그래서 때로 지쳐 고립되기도 합니다',
    lifeTheme: '직관과 치유',
    destinyPhrase: '어둠 속에서도 샘을 찾아내는 신비로운 물의 영혼'
  }
};

// ========== 운세 시기별 전략적 조언 ==========
export interface StrategicAdvice {
  timing: string;          // 시기 유형
  coreMessage: string;     // 핵심 메시지
  metaphor: string;        // 은유적 표현
  doAction: string[];      // 해야 할 것
  dontAction: string[];    // 하지 말아야 할 것
  financeTip: string;      // 재테크 팁
  relationTip: string;     // 관계 팁
}

export const STRATEGIC_ADVICE: Record<string, StrategicAdvice> = {
  'growth': {
    timing: '성장기',
    coreMessage: '씨앗을 뿌리는 시기입니다. 새로운 시작이 큰 결실로 이어집니다.',
    metaphor: '봄에 씨앗을 뿌리는 농부처럼',
    doAction: ['새로운 프로젝트 시작', '인맥 확장', '배움에 투자', '건강 관리 시작'],
    dontAction: ['수확을 재촉하기', '조급한 결정', '과거에 집착'],
    financeTip: '성장주나 미래 산업에 분산 투자하세요. 당장의 수익보다 5년 후를 보세요.',
    relationTip: '새로운 만남에 열린 마음을 가지세요. 지금 만나는 사람이 귀인(貴人)이 될 수 있습니다.'
  },
  'peak': {
    timing: '절정기',
    coreMessage: '열매를 수확하는 시기입니다. 그간의 노력이 빛을 발합니다.',
    metaphor: '무르익은 과실을 거두는 농부처럼',
    doAction: ['성과 정리', '승진/이직 추진', '중요한 계약 체결', '자산 확보'],
    dontAction: ['겸손 잃기', '무리한 확장', '건강 무시'],
    financeTip: '수익 실현 타이밍입니다. 번 것의 30%는 안전 자산으로 이동하세요.',
    relationTip: '받은 것을 나누세요. 베풂이 더 큰 복으로 돌아옵니다.'
  },
  'consolidation': {
    timing: '정비기',
    coreMessage: '가지를 치고 내실을 다지는 시기입니다. 확장보다 정리입니다.',
    metaphor: '나무의 가지를 전지(剪枝)하는 정원사처럼',
    doAction: ['불필요한 것 정리', '핵심에 집중', '체력 관리', '관계 정리'],
    dontAction: ['무리한 확장', '신규 대출', '에너지 분산'],
    financeTip: '새 투자보다 기존 포트폴리오 점검이 우선입니다. 손절할 것은 과감히 정리하세요.',
    relationTip: '에너지를 뺏는 관계는 거리를 두세요. 진정한 인연만 남깁니다.'
  },
  'caution': {
    timing: '주의기',
    coreMessage: '겨울을 나는 시기입니다. 지키고 보존하는 것이 현명합니다.',
    metaphor: '겨울잠을 준비하는 동물처럼',
    doAction: ['현상 유지', '저축 늘리기', '건강 검진', '공부와 자기 계발'],
    dontAction: ['큰 투자', '이직', '계약서 날인', '중요한 결정'],
    financeTip: '안전 자산 비중을 높이세요. 현금 보유가 기회가 됩니다. 투기는 절대 금물.',
    relationTip: '가까운 사람과 금전 거래를 피하세요. 오해가 관계를 해칠 수 있습니다.'
  },
  'recovery': {
    timing: '회복기',
    coreMessage: '겨울이 지나고 봄이 오는 시기입니다. 서서히 움직이기 시작하세요.',
    metaphor: '얼음이 녹아 물이 흐르기 시작하듯',
    doAction: ['작은 것부터 시작', '체력 회복', '네트워크 재구축', '계획 수립'],
    dontAction: ['급한 결정', '과거 미련', '한 번에 모든 것 해결하려 하기'],
    financeTip: '조금씩 투자 비중을 늘리세요. 급등주보다 우량주 중심으로.',
    relationTip: '연락이 끊겼던 사람에게 먼저 손 내밀어 보세요. 예상치 못한 도움이 올 수 있습니다.'
  }
};

// ========== 월별 금기 사항과 개운법 ==========
export interface MonthlyTaboo {
  month: number;
  avoidFood: string;       // 피해야 할 음식
  avoidColor: string;      // 피해야 할 색상
  avoidDirection: string;  // 피해야 할 방향
  avoidAction: string;     // 피해야 할 행동
  luckyFood: string;       // 행운 음식
  luckyColor: string;      // 행운 색상
  luckyDirection: string;  // 행운 방향
  luckyItem: string;       // 행운 아이템
  amuletMessage: string;   // 부적 메시지
}

export function getMonthlyTaboo(month: number, yongsin: string): MonthlyTaboo {
  // 용신에 따른 기본 금기/개운 설정
  const baseTaboos: Record<string, Partial<MonthlyTaboo>> = {
    wood: {
      avoidFood: '매운 음식 (금 기운)',
      luckyFood: '푸른 채소, 신맛 음식',
      avoidColor: '흰색, 금색',
      luckyColor: '초록색, 청색',
      luckyDirection: '동쪽',
      avoidDirection: '서쪽'
    },
    fire: {
      avoidFood: '차가운 음식, 검은콩 (수 기운)',
      luckyFood: '붉은 과일, 쓴맛 음식',
      avoidColor: '검정색, 남색',
      luckyColor: '빨간색, 주황색',
      luckyDirection: '남쪽',
      avoidDirection: '북쪽'
    },
    earth: {
      avoidFood: '신맛 음식 (목 기운)',
      luckyFood: '노란 곡물, 달콤한 것',
      avoidColor: '초록색, 청색',
      luckyColor: '노란색, 갈색',
      luckyDirection: '중앙/지역 내',
      avoidDirection: '동쪽'
    },
    metal: {
      avoidFood: '뜨거운 음식 (화 기운)',
      luckyFood: '흰 음식, 매운 것',
      avoidColor: '빨간색, 주황색',
      luckyColor: '흰색, 금색, 은색',
      luckyDirection: '서쪽',
      avoidDirection: '남쪽'
    },
    water: {
      avoidFood: '달콤한 음식 (토 기운)',
      luckyFood: '검은콩, 해산물, 짠 것',
      avoidColor: '노란색, 갈색',
      luckyColor: '검정색, 남색, 파란색',
      luckyDirection: '북쪽',
      avoidDirection: '중앙'
    }
  };

  const base = baseTaboos[yongsin] || baseTaboos.wood;

  // 월별 특수 금기
  const monthlyActions: Record<number, { avoid: string; lucky: string; amulet: string }> = {
    1: { avoid: '급한 결정, 이직 논의', lucky: '한 해 계획 수립, 가족 모임', amulet: '새해 첫 시작, 모든 일에 신중함으로 복을 부르소서' },
    2: { avoid: '큰 지출, 충동 구매', lucky: '소확행, 작은 투자', amulet: '절기의 전환, 마음을 가다듬어 운을 열리라' },
    3: { avoid: '다툼, 법적 분쟁 시작', lucky: '새로운 시작, 운동 시작', amulet: '봄기운과 함께 성장의 문이 열리도다' },
    4: { avoid: '파트너십 결정, 계약', lucky: '네트워킹, 학습', amulet: '만물이 깨어나듯 기회가 찾아오리라' },
    5: { avoid: '무리한 약속, 과음', lucky: '건강 관리, 가족 효도', amulet: '중심을 잡으면 모든 것이 제자리를 찾으리' },
    6: { avoid: '투자 확대, 도박성 행위', lucky: '관계 점검, 휴식', amulet: '반년의 흐름을 정리하며 복을 불러오라' },
    7: { avoid: '중요 계약서 날인', lucky: '여름 휴가, 재충전', amulet: '뜨거운 열기 속에서도 냉정함이 길을 열리라' },
    8: { avoid: '금전 거래, 보증', lucky: '추석 준비, 선물', amulet: '풍요의 계절, 나눔이 복을 부르리라' },
    9: { avoid: '구설수 주의, 험담', lucky: '결혼/약혼, 중매', amulet: '상충(相衝)의 기운을 피해 안녕을 얻으리' },
    10: { avoid: '이사, 큰 변화', lucky: '안정 추구, 저축', amulet: '가을 수확처럼 결실을 거두리라' },
    11: { avoid: '새 사업 시작', lucky: '내년 계획, 정리', amulet: '차분히 준비하면 큰 뜻이 이루어지리라' },
    12: { avoid: '급한 결정, 음주 모임 과다', lucky: '한 해 마무리, 감사 표현', amulet: '한 해를 정리하고 새로운 시작을 축복하라' }
  };

  const monthAction = monthlyActions[month] || monthlyActions[1];

  return {
    month,
    avoidFood: base.avoidFood || '',
    avoidColor: base.avoidColor || '',
    avoidDirection: base.avoidDirection || '',
    avoidAction: monthAction.avoid,
    luckyFood: base.luckyFood || '',
    luckyColor: base.luckyColor || '',
    luckyDirection: base.luckyDirection || '',
    luckyItem: getLuckyItem(yongsin, month),
    amuletMessage: monthAction.amulet
  };
}

function getLuckyItem(yongsin: string, month: number): string {
  const items: Record<string, string[]> = {
    wood: ['작은 화분', '청색 손수건', '나무 액세서리', '녹색 지갑', '대나무 소품', '민트향 디퓨저', '관엽 식물', '청옥 팔찌', '나무 펜', '삼나무 향', '초록 머플러', '소나무 그림'],
    fire: ['붉은 열쇠고리', '자수정', '양초', '태양 모양 액세서리', '보라색 소품', '분홍 장미', '루비 반지', '붉은 매듭', '빨간 지갑', '촛불 명상', '해바라기', '다홍색 스카프'],
    earth: ['황토색 도자기', '수정 클러스터', '테라코타 화분', '갈색 가죽 지갑', '흙냄새 향', '노란 쿠션', '벽돌색 인테리어', '호박석', '갈색 벨트', '베이지 옷', '흙냄새 디퓨저', '도자기 소품'],
    metal: ['은색 팔찌', '메탈 명함 케이스', '금색 열쇠', '흰색 진주', '스테인리스 시계', '은반지', '크리스탈', '백색 천', '금속 펜', '흰 수건', '은 거울', '프래티넘 소품'],
    water: ['수족관/어항', '검정 가죽 지갑', '물 그림', '남색 스카프', '흑요석', '미니 분수', '파란 펜', '진주 귀걸이', '파도 소리', '검정 우산', '남색 넥타이', '거북이 장식']
  };

  const itemList = items[yongsin] || items.wood;
  return itemList[(month - 1) % itemList.length];
}

// ========== 킬러 타이틀 생성기 ==========
export interface IdentityTitle {
  mainTitle: string;       // 메인 타이틀
  subTitle: string;        // 부제
  hashTags: string[];      // 해시태그
  shareText: string;       // 공유용 한 줄
}

export function generateIdentityTitle(
  name: string,
  dayMaster: string,
  yongsin: string[],
  mbti?: string,
  bloodType?: string
): IdentityTitle {
  const dm = DAY_MASTER_PROFESSIONAL[dayMaster] || DAY_MASTER_PROFESSIONAL['甲'];
  const primaryYongsin = yongsin[0] || 'wood';

  // 조합별 특수 타이틀
  const combinationTitles: Record<string, string> = {
    '甲_wood': '거목에서 새싹이 돋는',
    '甲_fire': '불꽃으로 세상을 밝히는',
    '甲_water': '깊은 물에 뿌리 내린',
    '乙_water': '비를 맞으며 강해지는',
    '乙_fire': '작은 불꽃도 들불이 되게 하는',
    '丙_wood': '숲을 살리는 태양',
    '丙_earth': '대지를 따뜻하게 품는',
    '丁_metal': '쇠를 녹여 보석을 만드는',
    '丁_wood': '나무에 불을 밝히는',
    '戊_fire': '불로 단련된 산의',
    '戊_metal': '보석을 품은 태산의',
    '己_water': '비옥한 물을 머금은',
    '己_wood': '만물을 키우는',
    '庚_water': '바위에서 샘을 내는',
    '庚_earth': '대지 깊이 묻힌',
    '辛_water': '맑은 물에 씻긴',
    '辛_fire': '불에 정련된',
    '壬_wood': '나무를 키우는 강의',
    '壬_metal': '바위를 깎아내는',
    '癸_fire': '불과 물이 만나',
    '癸_metal': '이슬에 젖은 보석'
  };

  const comboKey = `${dayMaster}_${primaryYongsin}`;
  const comboTitle = combinationTitles[comboKey] || dm.poeticTitle;

  // MBTI 조합
  const mbtiModifiers: Record<string, string> = {
    'INTJ': '전략가', 'INTP': '사색가', 'ENTJ': '지휘관', 'ENTP': '발명가',
    'INFJ': '옹호자', 'INFP': '중재자', 'ENFJ': '선도자', 'ENFP': '활동가',
    'ISTJ': '현실주의자', 'ISFJ': '수호자', 'ESTJ': '경영자', 'ESFJ': '친선가',
    'ISTP': '장인', 'ISFP': '모험가', 'ESTP': '사업가', 'ESFP': '연예인'
  };

  const mbtiTitle = mbti && mbtiModifiers[mbti] ? mbtiModifiers[mbti] : '';

  // 혈액형 조합
  const bloodModifiers: Record<string, string> = {
    'A': '섬세한', 'B': '자유로운', 'O': '대담한', 'AB': '신비로운'
  };
  const bloodTitle = bloodType && bloodModifiers[bloodType] ? bloodModifiers[bloodType] : '';

  // 최종 타이틀 조합
  const modifier = bloodTitle || (mbtiTitle ? `${mbtiTitle}의 영혼을 가진` : '');

  return {
    mainTitle: `${name}님은 "${comboTitle}" 명을 타고났습니다`,
    subTitle: modifier ? `${modifier} ${dm.destinyPhrase}` : dm.destinyPhrase,
    hashTags: [
      `#${dm.hanja}`,
      `#${dm.coreKeyword.split(' ')[0].replace('#', '')}`,
      mbti ? `#${mbti}` : '',
      `#운명가이드`
    ].filter(Boolean),
    shareText: `나는 ${comboTitle} 명을 가진 사람 ✨ #AI사주 #운명분석`
  };
}

// ========== 소름 포인트: 숨겨진 성격 ==========
export function getHiddenTraitMessage(dayMaster: string, mbti?: string): string {
  const dm = DAY_MASTER_PROFESSIONAL[dayMaster] || DAY_MASTER_PROFESSIONAL['甲'];

  const baseMessage = `[당신만 아는 은밀한 속마음]\n${dm.hiddenTrait}`;

  // MBTI 보완
  if (mbti) {
    const mbtiHidden: Record<string, string> = {
      'INTJ': '완벽한 계획 뒤에는 인정받고 싶은 마음이 있습니다.',
      'INTP': '논리적인 척하지만, 감정에 흔들릴 때 당황합니다.',
      'INFJ': '모두를 이해하는 척하지만, 정작 자신은 외롭습니다.',
      'INFP': '평화로워 보이지만, 내면에는 폭풍이 치고 있습니다.',
      'ENTJ': '자신감 넘쳐 보이지만, 실패가 두렵습니다.',
      'ENTP': '재치 있어 보이지만, 깊은 관계가 어렵습니다.',
      'ENFJ': '모두를 챙기지만, 자신은 챙김받고 싶습니다.',
      'ENFP': '밝아 보이지만, 갑자기 깊은 우울에 빠집니다.'
    };

    if (mbtiHidden[mbti]) {
      return `${baseMessage}\n\n그리고, ${mbtiHidden[mbti]}`;
    }
  }

  return baseMessage;
}

// ========== 황금 기회일 (골든 타임) ==========
export interface GoldenTime {
  date: string;
  reason: string;
  action: string;
  warning: string;
}

export function calculateGoldenTimes(
  birthDate: string,
  dayMaster: string,
  yongsin: string[],
  targetYear: number = new Date().getFullYear()
): GoldenTime[] {
  const goldenTimes: GoldenTime[] = [];
  const primaryYongsin = yongsin[0] || 'wood';

  // 용신의 왕성한 달 계산
  const yongsinPeakMonths: Record<string, number[]> = {
    wood: [2, 3],      // 봄
    fire: [5, 6],      // 여름
    earth: [3, 6, 9, 12], // 환절기
    metal: [8, 9],     // 가을
    water: [11, 12]    // 겨울
  };

  const peakMonths = yongsinPeakMonths[primaryYongsin] || [3];

  // 천을귀인일 계산 (간략화)
  const guirinDays: Record<string, number[]> = {
    '甲': [2, 15], '乙': [3, 16], '丙': [1, 14], '丁': [4, 17], '戊': [5, 18],
    '己': [6, 19], '庚': [7, 20], '辛': [8, 21], '壬': [9, 22], '癸': [10, 23]
  };

  const luckyDays = guirinDays[dayMaster] || [1, 15];

  peakMonths.forEach(month => {
    luckyDays.forEach(day => {
      if (day <= 28) { // 안전한 날짜
        goldenTimes.push({
          date: `${targetYear}년 ${month}월 ${day}일`,
          reason: `천을귀인(天乙貴人)이 임하고 용신이 왕성한 날`,
          action: '중요한 계약, 면접, 고백, 새로운 시작에 최적',
          warning: '이 날의 기운을 낭비하지 마세요. 하루 전 충분히 준비하세요.'
        });
      }
    });
  });

  return goldenTimes.slice(0, 4); // 최대 4개
}

// ========== 개운 처방전 ==========
export interface FortunePrescription {
  category: string;
  item: string;
  reason: string;
  howTo: string;
}

export function generateFortunePrescriptions(yongsin: string[], gisin: string[]): FortunePrescription[] {
  const primaryYongsin = yongsin[0] || 'wood';
  const primaryGisin = gisin[0] || 'fire';

  const prescriptions: FortunePrescription[] = [];

  // 용신 강화 처방
  const yongsinPrescriptions: Record<string, FortunePrescription[]> = {
    wood: [
      { category: '환경', item: '작은 화분이나 관엽 식물', reason: '목(木)의 생기를 집안에 들이기', howTo: '거실 동쪽에 두고 매일 아침 물을 주세요' },
      { category: '음식', item: '푸른 채소와 신맛 과일', reason: '목 기운을 몸에 채우기', howTo: '아침 식사에 샐러드를 추가하세요' },
      { category: '행동', item: '산책이나 등산', reason: '나무의 기운과 교류', howTo: '주 1회 자연 속을 걸으세요' }
    ],
    fire: [
      { category: '환경', item: '캔들이나 간접 조명', reason: '화(火)의 따뜻함을 집안에 들이기', howTo: '저녁에 은은한 조명으로 분위기를 만드세요' },
      { category: '음식', item: '붉은 과일과 따뜻한 차', reason: '화 기운을 몸에 채우기', howTo: '하루 한 잔 따뜻한 음료를 마시세요' },
      { category: '행동', item: '사람들과의 교류', reason: '불처럼 에너지 발산', howTo: '주 1회 사교 모임에 참석하세요' }
    ],
    earth: [
      { category: '환경', item: '도자기나 흙색 인테리어', reason: '토(土)의 안정감 들이기', howTo: '책상 위에 작은 도자기 소품을 두세요' },
      { category: '음식', item: '노란 식재료와 곡물', reason: '토 기운을 몸에 채우기', howTo: '현미밥이나 잡곡을 드세요' },
      { category: '행동', item: '정원 가꾸기, 요리', reason: '흙과의 교류', howTo: '흙을 만지는 활동을 해보세요' }
    ],
    metal: [
      { category: '환경', item: '금속 소품이나 흰색 물건', reason: '금(金)의 명료함 들이기', howTo: '책상에 메탈 소품을 두세요' },
      { category: '음식', item: '흰 음식과 매운 것', reason: '금 기운을 몸에 채우기', howTo: '흰 무, 양파, 마늘을 섭취하세요' },
      { category: '행동', item: '정리 정돈', reason: '금의 질서 에너지', howTo: '주 1회 공간을 정리하세요' }
    ],
    water: [
      { category: '환경', item: '작은 수족관이나 물 그림', reason: '수(水)의 흐름을 집안에 들이기', howTo: '북쪽에 물과 관련된 소품을 두세요' },
      { category: '음식', item: '해산물과 검은콩', reason: '수 기운을 몸에 채우기', howTo: '검은콩이나 미역을 자주 드세요' },
      { category: '행동', item: '명상, 수영', reason: '물처럼 흐르는 연습', howTo: '매일 5분 명상을 해보세요' }
    ]
  };

  prescriptions.push(...(yongsinPrescriptions[primaryYongsin] || yongsinPrescriptions.wood));

  // 기신 약화 처방
  const gisinAvoidance: Record<string, FortunePrescription> = {
    wood: { category: '피할 것', item: '과도한 녹색, 신맛', reason: '넘치는 목 기운 억제', howTo: '인테리어에서 초록을 줄이세요' },
    fire: { category: '피할 것', item: '빨간 옷, 매운 음식 과다', reason: '넘치는 화 기운 억제', howTo: '분노 조절 연습을 하세요' },
    earth: { category: '피할 것', item: '고집, 변화 거부', reason: '넘치는 토 기운 억제', howTo: '새로운 것을 시도해보세요' },
    metal: { category: '피할 것', item: '지나친 완벽주의', reason: '넘치는 금 기운 억제', howTo: '실수를 허용하는 연습을 하세요' },
    water: { category: '피할 것', item: '지나친 걱정, 우울', reason: '넘치는 수 기운 억제', howTo: '밝은 곳에서 시간을 보내세요' }
  };

  if (gisinAvoidance[primaryGisin]) {
    prescriptions.push(gisinAvoidance[primaryGisin]);
  }

  return prescriptions;
}

export default {
  DAY_MASTER_PROFESSIONAL,
  STRATEGIC_ADVICE,
  getMonthlyTaboo,
  generateIdentityTitle,
  getHiddenTraitMessage,
  calculateGoldenTimes,
  generateFortunePrescriptions
};
