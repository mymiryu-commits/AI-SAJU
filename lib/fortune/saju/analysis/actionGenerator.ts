/**
 * 액션플랜 생성기 (Action Plan Generator)
 * 월별 액션플랜, 인생 타임라인, 타이밍 분석
 *
 * v2.0 - 합/충/형/해/파 분석 추가, 월별 고유 테마, 오행 개운법
 */

import {
  UserInput, SajuChart, OhengBalance, Element,
  MonthlyAction, LifeTimeline, TimingAnalysis, InterestStrategy,
  InterestType, ELEMENT_KOREAN, INTEREST_KOREAN
} from '@/types/saju';
import { calculateAge, calculateWolun, calculateSeun, calculateDaeun } from '../calculator';
import { getLuckyColors, getLuckyNumbers, getLuckyDirections } from '../oheng';

// 월별 지지 정보 (양력 기준 근사치)
const MONTHLY_BRANCH: Record<number, { branch: string; branchKorean: string; element: Element }> = {
  1: { branch: '丑', branchKorean: '축', element: 'earth' },  // 대한~입춘 전
  2: { branch: '寅', branchKorean: '인', element: 'wood' },   // 입춘~경칩 전
  3: { branch: '卯', branchKorean: '묘', element: 'wood' },   // 경칩~청명 전
  4: { branch: '辰', branchKorean: '진', element: 'earth' },  // 청명~입하 전
  5: { branch: '巳', branchKorean: '사', element: 'fire' },   // 입하~망종 전
  6: { branch: '午', branchKorean: '오', element: 'fire' },   // 망종~소서 전
  7: { branch: '未', branchKorean: '미', element: 'earth' },  // 소서~입추 전
  8: { branch: '申', branchKorean: '신', element: 'metal' },  // 입추~백로 전
  9: { branch: '酉', branchKorean: '유', element: 'metal' },  // 백로~한로 전
  10: { branch: '戌', branchKorean: '술', element: 'earth' }, // 한로~입동 전
  11: { branch: '亥', branchKorean: '해', element: 'water' }, // 입동~대설 전
  12: { branch: '子', branchKorean: '자', element: 'water' }  // 대설~소한 전
};

// 지지 충(沖) 관계 - 180도 대충
const BRANCH_CLASH: Record<string, string> = {
  '子': '午', '午': '子',  // 자오충
  '丑': '未', '未': '丑',  // 축미충
  '寅': '申', '申': '寅',  // 인신충
  '卯': '酉', '酉': '卯',  // 묘유충
  '辰': '戌', '戌': '辰',  // 진술충
  '巳': '亥', '亥': '巳'   // 사해충
};

// 지지 합(合) 관계 - 육합
const BRANCH_HARMONY: Record<string, { partner: string; result: Element; name: string }> = {
  '子': { partner: '丑', result: 'earth', name: '자축합토' },
  '丑': { partner: '子', result: 'earth', name: '자축합토' },
  '寅': { partner: '亥', result: 'wood', name: '인해합목' },
  '亥': { partner: '寅', result: 'wood', name: '인해합목' },
  '卯': { partner: '戌', result: 'fire', name: '묘술합화' },
  '戌': { partner: '卯', result: 'fire', name: '묘술합화' },
  '辰': { partner: '酉', result: 'metal', name: '진유합금' },
  '酉': { partner: '辰', result: 'metal', name: '진유합금' },
  '巳': { partner: '申', result: 'water', name: '사신합수' },
  '申': { partner: '巳', result: 'water', name: '사신합수' },
  '午': { partner: '未', result: 'fire', name: '오미합화' },
  '未': { partner: '午', result: 'fire', name: '오미합화' }
};

// 지지 형(刑) 관계
const BRANCH_PUNISHMENT: Record<string, { targets: string[]; type: string; description: string }> = {
  '寅': { targets: ['巳', '申'], type: '무은지형', description: '은혜를 저버리는 형' },
  '巳': { targets: ['寅', '申'], type: '무은지형', description: '은혜를 저버리는 형' },
  '申': { targets: ['寅', '巳'], type: '무은지형', description: '은혜를 저버리는 형' },
  '丑': { targets: ['戌', '未'], type: '무례지형', description: '예의 없는 형' },
  '戌': { targets: ['丑', '未'], type: '무례지형', description: '예의 없는 형' },
  '未': { targets: ['丑', '戌'], type: '무례지형', description: '예의 없는 형' },
  '子': { targets: ['卯'], type: '무례지형', description: '예의 없는 형' },
  '卯': { targets: ['子'], type: '무례지형', description: '예의 없는 형' },
  '辰': { targets: ['辰'], type: '자형', description: '스스로를 해치는 형' },
  '午': { targets: ['午'], type: '자형', description: '스스로를 해치는 형' },
  '酉': { targets: ['酉'], type: '자형', description: '스스로를 해치는 형' },
  '亥': { targets: ['亥'], type: '자형', description: '스스로를 해치는 형' }
};

// 월별 기본 에너지 (절기 기준)
const MONTHLY_ENERGY: Record<number, { element: Element; description: string }> = {
  1: { element: 'earth', description: '축월(丑月) - 준비와 계획의 시기' },
  2: { element: 'wood', description: '인월(寅月) - 새로운 시작의 에너지' },
  3: { element: 'wood', description: '묘월(卯月) - 성장과 발전의 시기' },
  4: { element: 'earth', description: '진월(辰月) - 기반 다지기의 시기' },
  5: { element: 'fire', description: '사월(巳月) - 열정과 추진의 시기' },
  6: { element: 'fire', description: '오월(午月) - 최고조 에너지 시기' },
  7: { element: 'earth', description: '미월(未月) - 결실 준비의 시기' },
  8: { element: 'metal', description: '신월(申月) - 수확과 결단의 시기' },
  9: { element: 'metal', description: '유월(酉月) - 완성과 마무리의 시기' },
  10: { element: 'earth', description: '술월(戌月) - 정리와 저장의 시기' },
  11: { element: 'water', description: '해월(亥月) - 쉼과 충전의 시기' },
  12: { element: 'water', description: '자월(子月) - 내면 성찰의 시기' }
};

// 오행별 액션 카테고리 (세분화)
const ELEMENT_ACTIONS: Record<Element, {
  boost: { category: string; actions: string[] }[];
  avoid: string[];
}> = {
  wood: {
    boost: [
      { category: '학습/성장', actions: ['새로운 스킬 배우기', '온라인 강의 수강', '독서 모임 참여'] },
      { category: '시작/도전', actions: ['새 프로젝트 시작', '운동 루틴 시작', '취미 활동 시작'] },
      { category: '관계', actions: ['새로운 인맥 만들기', '멘토 찾기', '네트워킹 이벤트'] }
    ],
    avoid: ['과도한 휴식', '기회 미루기', '변화 회피']
  },
  fire: {
    boost: [
      { category: '표현/발표', actions: ['프레젠테이션', '아이디어 제안', 'SNS 활동 강화'] },
      { category: '열정/추진', actions: ['목표 재설정', '도전적 과제 수행', '리더십 발휘'] },
      { category: '사교', actions: ['모임 주최', '이벤트 참여', '관계 강화 활동'] }
    ],
    avoid: ['감정적 대응', '충동적 결정', '과로']
  },
  earth: {
    boost: [
      { category: '안정/기반', actions: ['재정 점검', '건강 검진', '집안 정리'] },
      { category: '신뢰/관계', actions: ['약속 지키기', '진정성 있는 대화', '가족 시간'] },
      { category: '계획', actions: ['장기 계획 수립', '예산 편성', '보험 점검'] }
    ],
    avoid: ['급격한 변화', '모험적 투자', '불안정한 결정']
  },
  metal: {
    boost: [
      { category: '결단/실행', actions: ['미뤄둔 결정 내리기', '계약 체결', '협상 진행'] },
      { category: '정리/완성', actions: ['프로젝트 마무리', '서류 정리', '목표 점검'] },
      { category: '전문성', actions: ['자격증 취득', '전문 지식 심화', '포트폴리오 정리'] }
    ],
    avoid: ['우유부단함', '마감 미루기', '완벽주의 과잉']
  },
  water: {
    boost: [
      { category: '휴식/충전', actions: ['명상', '온천/사우나', '충분한 수면'] },
      { category: '창의/사고', actions: ['브레인스토밍', '여행 계획', '새로운 관점 탐색'] },
      { category: '유연성', actions: ['플랜 B 준비', '대안 모색', '변화 수용 연습'] }
    ],
    avoid: ['경직된 태도', '휴식 없는 질주', '새로운 것 거부']
  }
};

// 오행 부족 시 구체적 개운법 (비즈니스/실생활 관점)
const ELEMENT_DEFICIENCY_REMEDIES: Record<Element, {
  lifestyle: string[];
  business: string[];
  color: string[];
  direction: string;
  numbers: number[];
  foods: string[];
  activities: string[];
  warning: string;
}> = {
  wood: {
    lifestyle: [
      '아침 6시 기상 습관으로 목(木)기운 활성화',
      '녹색 식물이 있는 공간에서 업무 진행',
      '주 2회 이상 숲길 산책 또는 등산'
    ],
    business: [
      '신사업 기획은 봄철(2-4월)에 집중',
      '동쪽 방향의 클라이언트/파트너 우선 접촉',
      '교육, 출판, 스타트업 분야에서 기회 탐색'
    ],
    color: ['청색', '녹색', '민트'],
    direction: '동쪽',
    numbers: [3, 8],
    foods: ['푸른 채소', '신맛 과일', '새싹 채소'],
    activities: ['요가', '필라테스', '새벽 조깅'],
    warning: '급한 결정, 분노 조절 실패 주의'
  },
  fire: {
    lifestyle: [
      '오전 9시-오후 1시 핵심 업무 집중',
      '빨간색 또는 오렌지색 소품 활용',
      '월 1회 이상 문화 공연/전시 관람'
    ],
    business: [
      '프레젠테이션, 미팅은 한낮에 진행',
      '남쪽 방향 사업장이나 파트너에 주목',
      '마케팅, 미디어, 엔터테인먼트 분야 기회 탐색'
    ],
    color: ['빨강', '보라', '주황'],
    direction: '남쪽',
    numbers: [2, 7],
    foods: ['쓴맛 채소', '커피', '붉은 과일'],
    activities: ['뜨거운 운동(핫요가)', '사우나', '활동적 취미'],
    warning: '과도한 흥분, 번아웃 주의'
  },
  earth: {
    lifestyle: [
      '규칙적인 식사 시간 엄수',
      '주거 공간 중앙에 안정적인 가구 배치',
      '월 1회 가족/친지 모임 참석'
    ],
    business: [
      '기존 사업 내실 다지기 우선',
      '부동산, 농업, 요식업 분야 검토',
      '장기 계약, 안정적 수익 모델 추구'
    ],
    color: ['노랑', '베이지', '갈색'],
    direction: '중앙',
    numbers: [5, 10],
    foods: ['단맛 식품', '뿌리채소', '곡물'],
    activities: ['등산', '텃밭 가꾸기', '도자기 공예'],
    warning: '지나친 보수성, 변화 거부 주의'
  },
  metal: {
    lifestyle: [
      '오후 3-5시 중요 의사결정 시간 확보',
      '흰색/금색 인테리어 요소 추가',
      '정리정돈 루틴 확립'
    ],
    business: [
      '계약서 검토, 협상은 가을철(8-10월) 유리',
      '서쪽 방향 사업 기회 탐색',
      '금융, IT, 제조업 분야에서 기회 모색'
    ],
    color: ['흰색', '금색', '은색'],
    direction: '서쪽',
    numbers: [4, 9],
    foods: ['매운 음식', '흰 채소(무, 양파)', '견과류'],
    activities: ['검도', '골프', '악기 연주'],
    warning: '지나친 완벽주의, 인간관계 냉담 주의'
  },
  water: {
    lifestyle: [
      '밤 9시-11시 창의적 사고 시간 확보',
      '검정색 또는 남색 의류/소품 활용',
      '주 1회 수영 또는 목욕 문화 즐기기'
    ],
    business: [
      '정보 수집, 리서치에 시간 투자',
      '북쪽 방향 사업 기회 우선 검토',
      '유통, 물류, 컨설팅 분야 기회 탐색'
    ],
    color: ['검정', '남색', '파랑'],
    direction: '북쪽',
    numbers: [1, 6],
    foods: ['짠맛 식품', '해산물', '검은콩'],
    activities: ['수영', '명상', '글쓰기'],
    warning: '우유부단, 과도한 두려움 주의'
  }
};

// 월별 고유 테마 (각 월의 특성 반영)
const MONTHLY_THEMES: Record<number, {
  theme: string;
  energy: string;
  focus: string[];
  caution: string[];
}> = {
  1: {
    theme: '겨울의 끝자락, 새해의 씨앗을 심는 달',
    energy: '토(土) 에너지가 물(水)을 지탱 - 내실 다지기',
    focus: ['새해 목표 구체화', '지난해 회고 및 교훈 정리', '건강 기초 다지기'],
    caution: ['성급한 신년 결심 주의', '무리한 다이어트 자제', '연말 피로 회복 우선']
  },
  2: {
    theme: '봄의 문을 여는 달, 새로운 시작의 기운',
    energy: '목(木) 에너지 상승 - 성장과 확장',
    focus: ['새 프로젝트 기획', '교육/학습 시작', '인맥 확장 활동'],
    caution: ['조급한 추진 자제', '기존 업무와의 균형', '건강 관리 소홀 주의']
  },
  3: {
    theme: '본격적인 봄, 만물이 깨어나는 달',
    energy: '목(木) 에너지 최고조 - 결단과 실행',
    focus: ['핵심 프로젝트 착수', '중요 미팅 및 협상', '적극적 마케팅'],
    caution: ['과욕 경계', '팀워크 중시', '체력 안배']
  },
  4: {
    theme: '봄에서 여름으로, 기반을 다지는 달',
    energy: '토(土) 에너지 - 안정과 중심',
    focus: ['1분기 성과 점검', '시스템 정비', '인간관계 정리'],
    caution: ['방향 전환 신중히', '재정 관리 철저', '건강 검진 권장']
  },
  5: {
    theme: '초여름의 열기, 추진력이 필요한 달',
    energy: '화(火) 에너지 상승 - 열정과 표현',
    focus: ['프레젠테이션/발표', '적극적 영업', '브랜딩 활동'],
    caution: ['감정적 대응 자제', '충동 구매 주의', '과로 경계']
  },
  6: {
    theme: '한여름의 정점, 에너지 최고조의 달',
    energy: '화(火) 에너지 최고조 - 성과와 인정',
    focus: ['상반기 마무리', '성과 가시화', '중요 계약 체결'],
    caution: ['번아웃 예방', '냉정한 판단 유지', '휴식 확보']
  },
  7: {
    theme: '여름의 후반, 열매가 맺히기 시작하는 달',
    energy: '토(土) 에너지 - 결실 준비',
    focus: ['상반기 평가', '하반기 계획 수립', '재정 점검'],
    caution: ['더위로 인한 컨디션 저하', '중요 결정 연기 고려', '휴가 계획']
  },
  8: {
    theme: '가을의 시작, 수확을 준비하는 달',
    energy: '금(金) 에너지 상승 - 결단과 수확',
    focus: ['핵심 결정 실행', '계약 마무리', '인력/자원 재배치'],
    caution: ['급격한 변화 자제', '인간관계 냉담 주의', '건강 관리']
  },
  9: {
    theme: '본격적인 가을, 결실의 달',
    energy: '금(金) 에너지 최고조 - 완성과 마무리',
    focus: ['프로젝트 완료', '성과 수확', '네트워크 강화'],
    caution: ['완벽주의 과잉 주의', '유연성 유지', '감사 표현']
  },
  10: {
    theme: '가을에서 겨울로, 정리의 달',
    energy: '토(土) 에너지 - 저장과 정리',
    focus: ['4분기 전략 수립', '불필요한 것 정리', '관계 점검'],
    caution: ['우울감 주의', '실내 활동 증가 대비', '비타민 D 보충']
  },
  11: {
    theme: '초겨울, 내면을 돌아보는 달',
    energy: '수(水) 에너지 상승 - 성찰과 지혜',
    focus: ['내년 계획 구상', '자기 계발 투자', '인맥 관리'],
    caution: ['우울감/무기력 대비', '과도한 음주 자제', '따뜻한 인간관계 유지']
  },
  12: {
    theme: '한겨울의 시작, 마무리와 준비의 달',
    energy: '수(水) 에너지 최고조 - 완결과 재생',
    focus: ['연간 성과 정리', '감사 표현', '내년 씨앗 준비'],
    caution: ['과도한 연말 모임 자제', '재정 관리 철저', '건강 우선']
  }
};

// 충(沖) 발생 시 구체적 조언
const CLASH_ADVICE: Record<string, {
  situation: string;
  action: string[];
  caution: string[];
}> = {
  '자오충': {
    situation: '북(子)과 남(午)의 충돌 - 방향성 갈등, 심리적 동요',
    action: ['중요 결정 2주 연기', '명상/심리 안정 활동', '제3자 조언 구하기'],
    caution: ['급격한 이직/이사 자제', '감정적 대응 금물', '건강(심장/신장) 주의']
  },
  '축미충': {
    situation: '토(土)끼리의 충돌 - 재물/부동산 관련 변동',
    action: ['부동산 계약 신중', '재정 상태 점검', '가족 관계 케어'],
    caution: ['투자 판단 미루기', '위장/비장 건강 주의', '고집 부리지 않기']
  },
  '인신충': {
    situation: '동(寅)과 서(申)의 충돌 - 이동수, 변화의 기운',
    action: ['출장/여행 계획 재검토', '이사/사무실 이전 검토', '교통 안전 주의'],
    caution: ['장거리 운전 조심', '간/폐 건강 체크', '급격한 직업 변화 신중']
  },
  '묘유충': {
    situation: '동(卯)과 서(酉)의 충돌 - 인간관계 마찰',
    action: ['중요 협상 연기 고려', '갈등 상대와 거리 두기', '문서 작업 꼼꼼히'],
    caution: ['계약서 재검토 필수', '간/폐 건강 주의', '법적 분쟁 피하기']
  },
  '진술충': {
    situation: '토(土)끼리의 충돌 - 기반 흔들림, 저장고 문제',
    action: ['기존 계획 재점검', '자산 관리 정비', '건강 검진 예약'],
    caution: ['부동산 거래 신중', '위장 건강 주의', '과거 문제 재발 주의']
  },
  '사해충': {
    situation: '화(巳)와 수(亥)의 충돌 - 물불 충돌, 강한 변동',
    action: ['이동 계획 수립', '새로운 기회 모색', '적극적 변화 준비'],
    caution: ['화재/수해 주의', '심혈관 건강 체크', '급격한 투자 피하기']
  }
};

// 합(合) 발생 시 구체적 조언
const HARMONY_ADVICE: Record<string, {
  situation: string;
  action: string[];
  opportunity: string[];
}> = {
  '자축합토': {
    situation: '수(水)와 토(土)의 융합 - 안정적 재물운',
    action: ['부동산 투자 검토', '저축/재테크 시작', '기반 사업 확장'],
    opportunity: ['부동산 거래 유리', '안정적 수익 기회', '신뢰 기반 파트너십']
  },
  '인해합목': {
    situation: '목(木) 기운 강화 - 성장과 확장',
    action: ['신사업 기획', '교육/학습 투자', '새로운 인맥 확장'],
    opportunity: ['스타트업/신사업 기회', '교육/출판 분야', '동쪽 방향 사업']
  },
  '묘술합화': {
    situation: '화(火) 기운 생성 - 인기와 표현',
    action: ['마케팅 강화', '대외 활동 증가', '브랜딩 투자'],
    opportunity: ['미디어/홍보 기회', '대중적 인지도 상승', '창의적 프로젝트']
  },
  '진유합금': {
    situation: '금(金) 기운 생성 - 결단과 수확',
    action: ['계약 체결', '투자 수익 실현', '전문성 인정받기'],
    opportunity: ['금융/투자 기회', '계약/협상 유리', '실질적 성과']
  },
  '사신합수': {
    situation: '수(水) 기운 생성 - 지혜와 유연성',
    action: ['정보 수집 강화', '네트워크 확대', '전략적 사고'],
    opportunity: ['컨설팅/조언 기회', '유통/물류 분야', '정보 기반 사업']
  },
  '오미합화': {
    situation: '화(火) 기운 강화 - 열정과 성취',
    action: ['적극적 영업', '대외 활동', '리더십 발휘'],
    opportunity: ['승진/인정 기회', '창업/독립 유리', '예술/문화 분야']
  }
};

/**
 * 월별 지지 상호작용 분석
 */
interface BranchInteraction {
  type: 'clash' | 'harmony' | 'punishment' | 'none';
  name?: string;
  description?: string;
  advice?: {
    situation?: string;
    action?: string[];
    caution?: string[];
    opportunity?: string[];
  };
}

function analyzeBranchInteraction(
  monthBranch: string,
  userBranches: string[]
): BranchInteraction {
  // 충(沖) 체크
  const clashTarget = BRANCH_CLASH[monthBranch];
  if (clashTarget && userBranches.includes(clashTarget)) {
    const clashNames: Record<string, string> = {
      '子午': '자오충', '午子': '자오충',
      '丑未': '축미충', '未丑': '축미충',
      '寅申': '인신충', '申寅': '인신충',
      '卯酉': '묘유충', '酉卯': '묘유충',
      '辰戌': '진술충', '戌辰': '진술충',
      '巳亥': '사해충', '亥巳': '사해충'
    };
    const name = clashNames[monthBranch + clashTarget] || clashNames[clashTarget + monthBranch] || '';
    return {
      type: 'clash',
      name,
      description: `${monthBranch}와 ${clashTarget}이 충돌`,
      advice: CLASH_ADVICE[name]
    };
  }

  // 합(合) 체크
  const harmonyInfo = BRANCH_HARMONY[monthBranch];
  if (harmonyInfo && userBranches.includes(harmonyInfo.partner)) {
    return {
      type: 'harmony',
      name: harmonyInfo.name,
      description: `${monthBranch}와 ${harmonyInfo.partner}이 합`,
      advice: HARMONY_ADVICE[harmonyInfo.name]
    };
  }

  // 형(刑) 체크
  const punishmentInfo = BRANCH_PUNISHMENT[monthBranch];
  if (punishmentInfo) {
    for (const target of punishmentInfo.targets) {
      if (userBranches.includes(target)) {
        return {
          type: 'punishment',
          name: punishmentInfo.type,
          description: `${punishmentInfo.description} - ${monthBranch}와 ${target}`,
          advice: {
            situation: punishmentInfo.description,
            action: ['신중한 언행', '인간관계 주의', '건강 관리 강화'],
            caution: ['갈등 상황 피하기', '법적 문제 주의', '스트레스 관리']
          }
        };
      }
    }
  }

  return { type: 'none' };
}

/**
 * 오행 불균형 분석 및 개운법 생성
 */
function analyzeElementDeficiency(
  oheng: OhengBalance
): { element: Element; percentage: number; remedies: typeof ELEMENT_DEFICIENCY_REMEDIES[Element] }[] {
  const deficiencies: { element: Element; percentage: number; remedies: typeof ELEMENT_DEFICIENCY_REMEDIES[Element] }[] = [];

  const elements: Element[] = ['wood', 'fire', 'earth', 'metal', 'water'];
  for (const el of elements) {
    const percentage = oheng[el] || 0;
    if (percentage <= 10) {  // 10% 이하면 부족으로 판단
      deficiencies.push({
        element: el,
        percentage,
        remedies: ELEMENT_DEFICIENCY_REMEDIES[el]
      });
    }
  }

  return deficiencies.sort((a, b) => a.percentage - b.percentage);
}

/**
 * 월별 액션플랜 생성 (v2.0 - 합/충/형 분석 포함)
 */
export function generateMonthlyActionPlan(
  saju: SajuChart,
  oheng: OhengBalance,
  year: number,
  yongsin: Element[]
): MonthlyAction[] {
  const seun = calculateSeun(year);
  const monthlyPlans: MonthlyAction[] = [];

  // 사주의 지지들 추출
  const userBranches = [
    saju.year.earthlyBranch,
    saju.month.earthlyBranch,
    saju.day.earthlyBranch,
    saju.time?.earthlyBranch
  ].filter(Boolean) as string[];

  // 오행 불균형 분석
  const elementDeficiencies = analyzeElementDeficiency(oheng);

  for (let month = 1; month <= 12; month++) {
    const wolun = calculateWolun(year, month);
    const monthEnergy = MONTHLY_ENERGY[month];
    const monthBranchInfo = MONTHLY_BRANCH[month];
    const monthTheme = MONTHLY_THEMES[month];

    // 월지와 사주 지지의 상호작용 분석
    const branchInteraction = analyzeBranchInteraction(
      monthBranchInfo.branch,
      userBranches
    );

    // 월운 점수 계산 (상호작용 반영)
    let score = calculateMonthScore(
      saju.day.element,
      monthEnergy.element,
      wolun.element,
      yongsin
    );

    // 충이면 점수 감소, 합이면 점수 증가
    if (branchInteraction.type === 'clash') {
      score = Math.max(30, score - 15);
    } else if (branchInteraction.type === 'harmony') {
      score = Math.min(100, score + 15);
    } else if (branchInteraction.type === 'punishment') {
      score = Math.max(35, score - 10);
    }

    // 해야 할 일 (월별 고유 테마 + 상호작용 반영)
    const mustDo = generateMustDoActionsV2(
      yongsin,
      monthEnergy.element,
      score,
      month,
      branchInteraction,
      monthTheme,
      elementDeficiencies
    );

    // 피해야 할 일 (상호작용 반영)
    const mustAvoid = generateMustAvoidActionsV2(
      saju.day.element,
      monthEnergy.element,
      score,
      branchInteraction,
      monthTheme
    );

    // 행운 요소 (월별로 다르게)
    const luckyElements = {
      color: getMonthlyLuckyColor(month, yongsin),
      number: getMonthlyLuckyNumber(month, yongsin),
      direction: getMonthlyLuckyDirection(month, yongsin)
    };

    // 월별 핵심 메시지 생성
    const monthlyHighlight = generateMonthlyHighlight(
      month,
      branchInteraction,
      monthTheme,
      score
    );

    monthlyPlans.push({
      month,
      monthName: `${month}월`,
      score,
      mustDo,
      mustAvoid,
      luckyElements,
      // 확장 필드 (타입에 추가 필요시)
      theme: monthTheme.theme,
      branchInteraction: branchInteraction.type !== 'none' ? {
        type: branchInteraction.type,
        name: branchInteraction.name,
        description: branchInteraction.description
      } : undefined,
      highlight: monthlyHighlight
    } as MonthlyAction & { theme?: string; branchInteraction?: unknown; highlight?: string });
  }

  return monthlyPlans;
}

/**
 * 월별 핵심 하이라이트 메시지 생성
 */
function generateMonthlyHighlight(
  month: number,
  interaction: BranchInteraction,
  theme: typeof MONTHLY_THEMES[1],
  score: number
): string {
  // 충/합/형이 있으면 그것이 핵심
  if (interaction.type === 'clash' && interaction.name) {
    return `⚠️ ${interaction.name}이 발생하는 달입니다. ${interaction.advice?.situation || ''} 중요 결정은 신중하게 진행하세요.`;
  }
  if (interaction.type === 'harmony' && interaction.name) {
    return `✨ ${interaction.name}이 형성되는 달입니다. ${interaction.advice?.situation || ''} 적극적으로 기회를 잡으세요.`;
  }
  if (interaction.type === 'punishment') {
    return `⚡ ${interaction.description || '형살'}이 있는 달입니다. 인간관계와 건강에 특히 주의하세요.`;
  }

  // 점수 기반 메시지
  if (score >= 85) {
    return `🌟 ${theme.theme} - 올해 최고의 기회가 있는 달입니다!`;
  } else if (score >= 70) {
    return `📈 ${theme.theme} - 순조로운 흐름이 예상됩니다.`;
  } else if (score >= 50) {
    return `📊 ${theme.theme} - 안정적인 관리가 필요한 시기입니다.`;
  }
  return `🔄 ${theme.theme} - 내실을 다지며 준비하는 달입니다.`;
}

/**
 * 해야 할 일 생성 v2 (월별 고유성 강화)
 */
function generateMustDoActionsV2(
  yongsin: Element[],
  monthElement: Element,
  score: number,
  month: number,
  interaction: BranchInteraction,
  theme: typeof MONTHLY_THEMES[1],
  deficiencies: ReturnType<typeof analyzeElementDeficiency>
): { category: string; action: string; optimalDays: number[]; optimalTime: string }[] {
  const actions: { category: string; action: string; optimalDays: number[]; optimalTime: string }[] = [];

  // 1. 월별 고유 테마 기반 액션 (최우선)
  const themeFocus = theme.focus[0];
  actions.push({
    category: theme.energy.split(' - ')[1] || '핵심 활동',
    action: themeFocus,
    optimalDays: getOptimalDays(month, monthElement),
    optimalTime: getOptimalTime(monthElement)
  });

  // 2. 합/충/형 기반 액션
  if (interaction.type === 'harmony' && interaction.advice?.action) {
    actions.push({
      category: '기회 활용',
      action: interaction.advice.action[0],
      optimalDays: [5, 15, 25],
      optimalTime: '오전 10시-12시'
    });
  } else if (interaction.type === 'clash' && interaction.advice?.action) {
    actions.push({
      category: '리스크 관리',
      action: interaction.advice.action[0],
      optimalDays: [1, 11, 21],
      optimalTime: '오전 중'
    });
  }

  // 3. 오행 부족 보완 액션
  if (deficiencies.length > 0) {
    const topDeficiency = deficiencies[0];
    const remedyAction = topDeficiency.remedies.business[0];
    actions.push({
      category: `${ELEMENT_KOREAN[topDeficiency.element]}기운 보강`,
      action: remedyAction,
      optimalDays: topDeficiency.remedies.numbers,
      optimalTime: getOptimalTime(topDeficiency.element)
    });
  }

  // 4. 용신 기반 기본 액션 (차별화)
  for (const el of yongsin) {
    const elementActions = ELEMENT_ACTIONS[el];
    if (elementActions) {
      // 월별로 다른 카테고리 선택
      const categoryIndex = (month - 1) % elementActions.boost.length;
      const categoryData = elementActions.boost[categoryIndex];
      const actionIndex = (month - 1) % categoryData.actions.length;
      actions.push({
        category: categoryData.category,
        action: categoryData.actions[actionIndex],
        optimalDays: getOptimalDays(month, el),
        optimalTime: getOptimalTime(el)
      });
    }
  }

  // 5. 점수가 높은 달 특별 액션
  if (score >= 80 && interaction.type !== 'clash') {
    actions.push({
      category: '골든 타이밍',
      action: '중요 결정, 계약, 새로운 시작에 최적의 시기 - 적극 추진',
      optimalDays: [8, 18, 28],
      optimalTime: '오전 9-11시'
    });
  }

  // 중복 제거 및 상위 4개 반환
  const uniqueActions = actions.filter((action, index, self) =>
    index === self.findIndex(a => a.action === action.action)
  );

  return uniqueActions.slice(0, 4);
}

/**
 * 피해야 할 일 생성 v2 (상호작용 반영)
 */
function generateMustAvoidActionsV2(
  dayElement: Element,
  monthElement: Element,
  score: number,
  interaction: BranchInteraction,
  theme: typeof MONTHLY_THEMES[1]
): string[] {
  const avoids: string[] = [];

  // 1. 충/형 발생 시 특별 주의사항
  if (interaction.type === 'clash' && interaction.advice?.caution) {
    avoids.push(...interaction.advice.caution.slice(0, 2));
  } else if (interaction.type === 'punishment' && interaction.advice?.caution) {
    avoids.push(...interaction.advice.caution.slice(0, 2));
  }

  // 2. 월별 고유 주의사항
  avoids.push(...theme.caution.slice(0, 2));

  // 3. 상극 관계면 추가 주의
  const controllingMap: Record<Element, Element> = {
    wood: 'earth', earth: 'water', water: 'fire', fire: 'metal', metal: 'wood'
  };

  if (controllingMap[monthElement] === dayElement) {
    avoids.push('큰 결정이나 계약은 다음 달로 연기 검토');
  }

  // 4. 점수 낮으면 추가 주의
  if (score < 50) {
    avoids.push('새로운 시작보다 기존 업무 유지에 집중');
    avoids.push('건강 관리에 특히 신경 쓰기');
  }

  // 5. 오행별 기본 주의사항
  const elementAvoids = ELEMENT_ACTIONS[dayElement].avoid;
  if (elementAvoids.length > 0 && avoids.length < 4) {
    avoids.push(elementAvoids[0]);
  }

  return [...new Set(avoids)].slice(0, 4);
}

/**
 * 월별 행운 색상 (고유화)
 */
function getMonthlyLuckyColor(month: number, yongsin: Element[]): string {
  const monthElement = MONTHLY_BRANCH[month].element;
  const colorMap: Record<Element, string[]> = {
    wood: ['초록', '청록', '민트'],
    fire: ['빨강', '주황', '보라'],
    earth: ['노랑', '베이지', '갈색'],
    metal: ['흰색', '금색', '은색'],
    water: ['검정', '남색', '파랑']
  };

  // 월의 오행과 용신의 조합으로 색상 선택
  const primaryElement = yongsin[0] || monthElement;
  const colors = colorMap[primaryElement];
  const colorIndex = (month - 1) % colors.length;
  return colors[colorIndex];
}

/**
 * 월별 행운 숫자 (고유화)
 */
function getMonthlyLuckyNumber(month: number, yongsin: Element[]): number {
  const numberMap: Record<Element, number[]> = {
    wood: [3, 8],
    fire: [2, 7],
    earth: [5, 10],
    metal: [4, 9],
    water: [1, 6]
  };

  const primaryElement = yongsin[0] || MONTHLY_BRANCH[month].element;
  const numbers = numberMap[primaryElement];
  const numIndex = (month - 1) % numbers.length;
  return numbers[numIndex];
}

/**
 * 월별 행운 방향 (고유화)
 */
function getMonthlyLuckyDirection(month: number, yongsin: Element[]): string {
  const directionMap: Record<Element, string> = {
    wood: '동쪽',
    fire: '남쪽',
    earth: '중앙',
    metal: '서쪽',
    water: '북쪽'
  };

  // 계절에 따른 방향 변화
  const seasonDirections: Record<number, string> = {
    1: '북동쪽', 2: '동쪽', 3: '동쪽',
    4: '남동쪽', 5: '남쪽', 6: '남쪽',
    7: '남서쪽', 8: '서쪽', 9: '서쪽',
    10: '북서쪽', 11: '북쪽', 12: '북쪽'
  };

  const primaryElement = yongsin[0];
  if (primaryElement) {
    return directionMap[primaryElement];
  }
  return seasonDirections[month];
}

/**
 * 오행 부족 개운법 조회 (외부에서 사용 가능)
 */
export function getElementDeficiencyRemedies(
  oheng: OhengBalance
): ReturnType<typeof analyzeElementDeficiency> {
  return analyzeElementDeficiency(oheng);
}

/**
 * 특정 오행 개운법 상세 조회
 */
export function getElementRemedy(element: Element): typeof ELEMENT_DEFICIENCY_REMEDIES[Element] {
  return ELEMENT_DEFICIENCY_REMEDIES[element];
}

/**
 * 월 점수 계산
 */
function calculateMonthScore(
  dayElement: Element,
  monthElement: Element,
  wolunElement: Element,
  yongsin: Element[]
): number {
  let score = 70;

  // 용신과의 관계
  if (yongsin.includes(monthElement)) {
    score += 15;
  }
  if (yongsin.includes(wolunElement)) {
    score += 10;
  }

  // 상생 관계
  const generatingMap: Record<Element, Element> = {
    wood: 'fire', fire: 'earth', earth: 'metal', metal: 'water', water: 'wood'
  };

  if (generatingMap[monthElement] === dayElement) {
    score += 10; // 월이 나를 생함
  }
  if (generatingMap[dayElement] === monthElement) {
    score += 5; // 내가 월을 생함
  }

  // 상극 관계
  const controllingMap: Record<Element, Element> = {
    wood: 'earth', earth: 'water', water: 'fire', fire: 'metal', metal: 'wood'
  };

  if (controllingMap[monthElement] === dayElement) {
    score -= 15; // 월이 나를 극함
  }

  return Math.max(30, Math.min(100, score));
}

// 기존 generateMustDoActions, generateMustAvoidActions 함수는
// generateMustDoActionsV2, generateMustAvoidActionsV2로 대체됨

/**
 * 인생 타임라인 생성
 */
export function generateLifeTimeline(
  user: UserInput,
  saju: SajuChart
): LifeTimeline {
  const currentAge = calculateAge(user.birthDate);
  const currentYear = new Date().getFullYear();

  // 대운 계산
  const daeunList = calculateDaeun(saju, user.gender, user.birthDate);

  // 인생 단계
  const phases = generateLifePhases(currentAge, saju, daeunList);

  // 터닝포인트
  const turningPoints = generateTurningPoints(currentAge, currentYear, daeunList, saju);

  // 골든윈도우
  const goldenWindows = generateGoldenWindows(currentAge, currentYear, saju, daeunList);

  return {
    currentAge,
    phases,
    turningPoints,
    goldenWindows
  };
}

/**
 * 인생 단계 생성
 */
function generateLifePhases(
  currentAge: number,
  saju: SajuChart,
  daeunList: { age: number; element: Element }[]
): LifeTimeline['phases'] {
  const phases: LifeTimeline['phases'] = [];

  // 현재 대운 찾기
  let currentDaeunIdx = 0;
  for (let i = 0; i < daeunList.length; i++) {
    if (daeunList[i].age <= currentAge) {
      currentDaeunIdx = i;
    }
  }

  // 현재 + 향후 3개 대운 분석
  for (let i = currentDaeunIdx; i < Math.min(currentDaeunIdx + 4, daeunList.length); i++) {
    const daeun = daeunList[i];
    const nextDaeun = daeunList[i + 1];
    const ageRange = nextDaeun
      ? `${daeun.age}-${nextDaeun.age - 1}세`
      : `${daeun.age}세 이후`;

    const phaseData = generatePhaseData(daeun.element, saju.day.element, i === currentDaeunIdx);

    phases.push({
      ageRange,
      phase: phaseData.phase,
      score: phaseData.score,
      opportunities: phaseData.opportunities,
      challenges: phaseData.challenges
    });
  }

  return phases;
}

/**
 * 단계별 데이터 생성
 */
function generatePhaseData(
  daeunElement: Element,
  dayElement: Element,
  isCurrent: boolean
): {
  phase: string;
  score: number;
  opportunities: string[];
  challenges: string[];
} {
  const phaseNames: Record<Element, string> = {
    wood: '성장기',
    fire: '도약기',
    earth: '안정기',
    metal: '수확기',
    water: '전환기'
  };

  // 기본 점수
  let score = 70;

  // 상생 보너스
  const generatingMap: Record<Element, Element> = {
    wood: 'fire', fire: 'earth', earth: 'metal', metal: 'water', water: 'wood'
  };

  if (generatingMap[daeunElement] === dayElement) {
    score += 15;
  }

  // 상극 감점
  const controllingMap: Record<Element, Element> = {
    wood: 'earth', earth: 'water', water: 'fire', fire: 'metal', metal: 'wood'
  };

  if (controllingMap[daeunElement] === dayElement) {
    score -= 15;
  }

  const opportunities = generateOpportunities(daeunElement, score);
  const challenges = generateChallenges(daeunElement, score);

  return {
    phase: isCurrent ? `현재 ${phaseNames[daeunElement]}` : phaseNames[daeunElement],
    score: Math.max(30, Math.min(100, score)),
    opportunities,
    challenges
  };
}

/**
 * 기회 생성
 */
function generateOpportunities(element: Element, score: number): string[] {
  const baseOpportunities: Record<Element, string[]> = {
    wood: ['새로운 학습 기회', '사업 확장 가능성', '인맥 확대'],
    fire: ['승진/인정 기회', '리더십 발휘', '창의적 프로젝트'],
    earth: ['안정적 수입', '자산 증식', '신뢰 관계 구축'],
    metal: ['성과 인정', '계약/협상 성공', '전문성 인정'],
    water: ['통찰력 향상', '유연한 적응', '새로운 가능성 발견']
  };

  const opps = [...baseOpportunities[element]];

  if (score >= 80) {
    opps.push('예상치 못한 행운');
  }

  return opps.slice(0, 3);
}

/**
 * 도전과제 생성
 */
function generateChallenges(element: Element, score: number): string[] {
  const baseChallenges: Record<Element, string[]> = {
    wood: ['과욕 주의', '경쟁 심화', '체력 관리'],
    fire: ['감정 조절', '번아웃 위험', '대인 갈등'],
    earth: ['변화 대응 어려움', '보수적 사고', '기회 놓침'],
    metal: ['완벽주의 스트레스', '유연성 부족', '인간관계 경직'],
    water: ['우유부단', '방향 혼란', '감정 기복']
  };

  const challenges = [...baseChallenges[element]];

  if (score < 50) {
    challenges.push('건강 악화 주의');
    challenges.push('재정적 어려움 가능성');
  }

  return challenges.slice(0, 3);
}

/**
 * 터닝포인트 생성
 */
function generateTurningPoints(
  currentAge: number,
  currentYear: number,
  daeunList: { age: number; element: Element }[],
  saju: SajuChart
): LifeTimeline['turningPoints'] {
  const points: LifeTimeline['turningPoints'] = [];

  // 대운 전환점
  for (const daeun of daeunList) {
    if (daeun.age > currentAge && daeun.age <= currentAge + 20) {
      points.push({
        age: daeun.age,
        year: currentYear + (daeun.age - currentAge),
        event: `대운 전환 - ${ELEMENT_KOREAN[daeun.element]} 시대 시작`,
        importance: 'critical'
      });
    }
  }

  // 10년 단위 터닝포인트
  const nextDecade = Math.ceil(currentAge / 10) * 10;
  if (nextDecade > currentAge && nextDecade <= currentAge + 15) {
    points.push({
      age: nextDecade,
      year: currentYear + (nextDecade - currentAge),
      event: `${nextDecade}대 진입 - 라이프스타일 재점검 시기`,
      importance: 'important'
    });
  }

  // 특수 연령대
  const specialAges = [
    { age: 40, event: '인생 후반 설계 시작점', importance: 'important' as const },
    { age: 50, event: '제2의 인생 본격화', importance: 'critical' as const },
    { age: 60, event: '시니어 라이프 전환', importance: 'critical' as const }
  ];

  for (const special of specialAges) {
    if (special.age > currentAge && special.age <= currentAge + 20) {
      points.push({
        age: special.age,
        year: currentYear + (special.age - currentAge),
        event: special.event,
        importance: special.importance
      });
    }
  }

  return points.sort((a, b) => a.age - b.age);
}

/**
 * 골든윈도우 생성
 */
function generateGoldenWindows(
  currentAge: number,
  currentYear: number,
  saju: SajuChart,
  daeunList: { age: number; element: Element }[]
): LifeTimeline['goldenWindows'] {
  const windows: LifeTimeline['goldenWindows'] = [];

  // 현재 대운에서 가장 좋은 시기 찾기
  const currentDaeun = daeunList.find(d => d.age <= currentAge && d.age + 10 > currentAge);

  if (currentDaeun) {
    // 재물 골든윈도우
    windows.push({
      period: `${currentYear}-${currentYear + 2}`,
      purpose: '재물 증식',
      successRate: 72
    });

    // 커리어 골든윈도우
    windows.push({
      period: `${currentYear + 1}-${currentYear + 3}`,
      purpose: '커리어 도약',
      successRate: 68
    });

    // 관계 골든윈도우
    windows.push({
      period: `${currentYear}-${currentYear + 1}`,
      purpose: '중요한 인연',
      successRate: 75
    });
  }

  return windows;
}

/**
 * 타이밍 분석 생성
 */
export function generateTimingAnalysis(
  saju: SajuChart,
  currentConcern?: string
): TimingAnalysis {
  const today = new Date();
  const currentMonth = today.getMonth() + 1;
  const monthEnergy = MONTHLY_ENERGY[currentMonth];

  // 현재 창이 열려있는지 확인
  const isWindowOpen = monthEnergy.element === saju.day.element ||
    ['wood', 'fire'].includes(monthEnergy.element);

  // 남은 일수 계산 (다음 절기까지)
  const nextSolarTerm = getNextSolarTermDate(today);
  const remainingDays = Math.ceil(
    (nextSolarTerm.getTime() - today.getTime()) / (1000 * 60 * 60 * 24)
  );

  return {
    currentWindow: {
      isOpen: isWindowOpen,
      remainingDays,
      missedConsequence: isWindowOpen
        ? '이 기회를 놓치면 비슷한 조건이 4-6개월 후에 옵니다'
        : '현재는 준비 시기입니다. 다음 기회를 위해 기반을 다지세요',
      recoveryTime: isWindowOpen ? '4-6개월' : '1-2개월'
    },
    nextOpportunity: {
      date: getNextGoldenDate(saju),
      probability: isWindowOpen ? 82 : 65
    }
  };
}

/**
 * 관심사별 전략 생성
 */
export function generateInterestStrategies(
  interests: InterestType[],
  saju: SajuChart,
  oheng: OhengBalance,
  yongsin: Element[]
): InterestStrategy[] {
  return interests.map((interest, index) => {
    const alignment = calculateInterestAlignment(interest, saju.day.element, oheng);

    return {
      interest,
      priority: index + 1,
      sajuAlignment: alignment,
      timing: getInterestTiming(interest, alignment),
      doList: getInterestDoList(interest, yongsin),
      dontList: getInterestDontList(interest, saju.day.element),
      specificAdvice: getInterestSpecificAdvice(interest, alignment, saju)
    };
  });
}

// ===== 헬퍼 함수들 =====

function getOptimalDays(month: number, element: Element): number[] {
  // 오행별 좋은 날짜 (간략화)
  const baseDays: Record<Element, number[]> = {
    wood: [3, 8, 13, 18, 23, 28],
    fire: [2, 7, 12, 17, 22, 27],
    earth: [5, 10, 15, 20, 25, 30],
    metal: [4, 9, 14, 19, 24, 29],
    water: [1, 6, 11, 16, 21, 26]
  };
  return baseDays[element].slice(0, 3);
}

function getOptimalTime(element: Element): string {
  const times: Record<Element, string> = {
    wood: '오전 5-9시',
    fire: '오전 9시-오후 1시',
    earth: '오후 1-5시',
    metal: '오후 5-9시',
    water: '밤 9시-새벽 1시'
  };
  return times[element];
}

function getNextSolarTermDate(from: Date): Date {
  // 다음 절기 (간략화 - 다음 달 5일 전후)
  const next = new Date(from);
  next.setMonth(next.getMonth() + 1);
  next.setDate(5);
  return next;
}

function getNextGoldenDate(saju: SajuChart): string {
  const today = new Date();
  const goldenMonth = today.getMonth() + 3; // 3개월 후
  const goldenDate = new Date(today.getFullYear(), goldenMonth, 1);
  return goldenDate.toISOString().split('T')[0];
}

function calculateInterestAlignment(
  interest: InterestType,
  dayElement: Element,
  oheng: OhengBalance
): number {
  // 관심사와 오행 매핑
  const interestElements: Partial<Record<InterestType, Element[]>> = {
    investment: ['metal', 'water'],
    health: ['wood', 'earth'],
    career: ['fire', 'metal'],
    romance: ['fire', 'water'],
    realestate: ['earth', 'metal']
  };

  const matchElements = interestElements[interest] || ['earth'];
  let alignment = 60;

  for (const el of matchElements) {
    if (oheng[el] >= 2) alignment += 15;
    if (el === dayElement) alignment += 10;
  }

  return Math.min(100, alignment);
}

function getInterestTiming(interest: InterestType, alignment: number): string {
  if (alignment >= 80) {
    return '지금이 최적의 시기입니다. 적극적으로 추진하세요.';
  } else if (alignment >= 60) {
    return '조건이 좋은 편입니다. 준비 후 실행하세요.';
  }
  return '기반을 먼저 다지는 시기입니다. 학습과 준비에 집중하세요.';
}

function getInterestDoList(interest: InterestType, yongsin: Element[]): string[] {
  const baseLists: Partial<Record<InterestType, string[]>> = {
    investment: ['분산 투자 전략 수립', '재무 공부', '전문가 상담'],
    health: ['정기 검진', '규칙적 운동', '식단 관리'],
    career: ['스킬 업그레이드', '네트워킹', '포트폴리오 정리'],
    romance: ['자기 관리', '새로운 만남', '소통 연습'],
    realestate: ['시장 조사', '자금 계획', '전문가 상담']
  };

  return baseLists[interest] || ['목표 설정', '계획 수립', '실행'];
}

function getInterestDontList(interest: InterestType, dayElement: Element): string[] {
  const baseLists: Partial<Record<InterestType, string[]>> = {
    investment: ['충동적 투자', '빚 내서 투자', '한 곳에 몰빵'],
    health: ['무리한 운동', '식단 극단주의', '검진 미루기'],
    career: ['감정적 퇴사', '준비 없는 이직', '관계 소홀'],
    romance: ['집착', '급한 결정', '자기 비하']
  };

  return baseLists[interest] || ['급한 결정', '과욕', '무리한 추진'];
}

function getInterestSpecificAdvice(
  interest: InterestType,
  alignment: number,
  saju: SajuChart
): string {
  const dayElement = saju.day.element;

  if (interest === 'investment' && dayElement === 'fire') {
    return '충동적 투자 결정을 피하세요. 24시간 룰을 적용하면 손실을 줄일 수 있습니다.';
  }

  if (interest === 'career' && dayElement === 'wood') {
    return '성장 에너지가 강합니다. 새로운 도전에 유리하지만, 기존 관계도 소중히 하세요.';
  }

  if (alignment >= 80) {
    return `${INTEREST_KOREAN[interest]}에 대한 사주 적합도가 높습니다. 적극적으로 추진하되, 과욕은 금물입니다.`;
  }

  return `기반을 다지는 시기입니다. ${INTEREST_KOREAN[interest]} 관련 학습과 준비에 집중하세요.`;
}
