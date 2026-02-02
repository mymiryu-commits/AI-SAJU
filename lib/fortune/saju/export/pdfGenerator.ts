/**
 * 사주 분석 결과 PDF 생성기
 *
 * 서버 사이드에서 PDF 문서를 생성합니다.
 * @jspdf 라이브러리 사용 (한글 폰트 지원)
 */

import { jsPDF } from 'jspdf';
import autoTable from 'jspdf-autotable';
import { createKoreanPDF } from '@/lib/fonts/koreanFont';
import type {
  UserInput,
  SajuChart,
  SajuPillar,
  OhengBalance,
  PremiumContent,
  MonthlyAction,
  Element
} from '@/types/saju';
import {
  ELEMENT_KOREAN,
  CAREER_KOREAN,
  INTEREST_KOREAN
} from '@/types/saju';
import {
  getSixtyJiaziInfo,
  generateJiaziPrologue,
  generateJiaziEpilogue,
  analyzeMBTISajuMatch,
  generateIntegratedAnalysis,
  getMBTIDescription,
  generateElementBalancePoetry,
  generatePrologue,
  generateEpilogue,
  GENERATING_RELATIONS,
  CONTROLLING_RELATIONS,
  ELEMENT_INFO,
  // 전문 명리학 용어 시스템
  DAY_MASTER_PROFESSIONAL,
  STRATEGIC_ADVICE,
  getMonthlyTaboo,
  generateIdentityTitle,
  getHiddenTraitMessage,
  calculateGoldenTimes,
  generateFortunePrescriptions,
  // 차별화된 콘텐츠 시스템
  generateTraitAnalysis,
  generateMonthlyFortune,
  generateGrowthStrategy,
  generateFamilyAdvice,
  DIFFERENTIATION_POINTS,
  type MBTIType
} from '../mappings';
import { ESSENCE_CARDS, ENERGY_CARDS, TALENT_CARDS } from '../cards/cardData';
import { generateZodiacAnalysis, getZodiacInfo, type ZodiacAnalysis } from '../analysis/zodiacAnalysis';
import { generateComprehensiveAnalysis, type ComprehensiveAnalysis } from '../analysis/comprehensiveAnalysis';
import { calculateAge } from '../calculator';
import {
  analyzeSipsin,
  analyzeSinsal,
  analyzeUnsung,
  analyzeHapChung,
  interpretSipsinChart,
  transformToConsumerFriendlyRisk,
  analyzeRiskTiming,
  generateYearlyDashboard,
  SIPSIN_INFO,
  type SipsinChart,
  type SipsinType,
  type SinsalAnalysis,
  type UnsungAnalysis,
  type HapChungAnalysis,
  type ConsumerFriendlyRisk,
  type RiskTimingAnalysis,
  type YearlyDashboard
} from '../analysis';

// ========== 연령별 분기 시스템 ==========
type AgeGroup = 'child' | 'youth' | 'adult' | 'senior';

function getAgeGroup(birthDate: string, targetYear: number = new Date().getFullYear()): { group: AgeGroup; age: number } {
  // 정확한 만 나이 계산 (생일 기준)
  const age = calculateAge(birthDate);

  if (age <= 12) return { group: 'child', age };
  if (age <= 22) return { group: 'youth', age };
  if (age <= 45) return { group: 'adult', age };
  return { group: 'senior', age };
}

// 천간 한글 변환
function getDayMasterKorean(heavenlyStem: string): string {
  const mapping: Record<string, string> = {
    '甲': '갑', '乙': '을', '丙': '병', '丁': '정', '戊': '무',
    '己': '기', '庚': '경', '辛': '신', '壬': '임', '癸': '계'
  };
  return mapping[heavenlyStem] || '갑';
}

// 오행 한글 변환
function getElementKorean(element: string): string {
  const mapping: Record<string, string> = {
    'wood': '목', 'fire': '화', 'earth': '토', 'metal': '금', 'water': '수',
    '목': '목', '화': '화', '토': '토', '금': '금', '수': '수'
  };
  return mapping[element] || '목';
}

// 생년월일로 별자리 계산
function getZodiacSignFromBirthDate(birthDate: string): string {
  const date = new Date(birthDate);
  const month = date.getMonth() + 1;
  const day = date.getDate();

  if ((month === 3 && day >= 21) || (month === 4 && day <= 19)) return '양자리';
  if ((month === 4 && day >= 20) || (month === 5 && day <= 20)) return '황소자리';
  if ((month === 5 && day >= 21) || (month === 6 && day <= 21)) return '쌍둥이자리';
  if ((month === 6 && day >= 22) || (month === 7 && day <= 22)) return '게자리';
  if ((month === 7 && day >= 23) || (month === 8 && day <= 22)) return '사자자리';
  if ((month === 8 && day >= 23) || (month === 9 && day <= 22)) return '처녀자리';
  if ((month === 9 && day >= 23) || (month === 10 && day <= 22)) return '천칭자리';
  if ((month === 10 && day >= 23) || (month === 11 && day <= 21)) return '전갈자리';
  if ((month === 11 && day >= 22) || (month === 12 && day <= 21)) return '사수자리';
  if ((month === 12 && day >= 22) || (month === 1 && day <= 19)) return '염소자리';
  if ((month === 1 && day >= 20) || (month === 2 && day <= 18)) return '물병자리';
  return '물고기자리';
}

// Element 영어 → 한글 키 변환
const ELEMENT_TO_KO_KEY: Record<string, string> = {
  'wood': '목', 'fire': '화', 'earth': '토', 'metal': '금', 'water': '수',
  '목': '목', '화': '화', '토': '토', '금': '금', '수': '수'
};

// 오행 자연어 풍부화 함수 (PDF용)
function getElementRichDescription(element: Element | string, type: 'yongsin' | 'gisin' | 'display' = 'display'): string {
  const koKey = ELEMENT_TO_KO_KEY[element] || '목';
  const info = ELEMENT_INFO[koKey];

  if (!info) {
    return ELEMENT_KOREAN[element as Element] || element;
  }

  switch (type) {
    case 'yongsin':
      return `${info.poeticName}(${ELEMENT_KOREAN[element as Element]}) - ${info.season}의 기운, ${info.nature}`;
    case 'gisin':
      return `${info.poeticName}(${ELEMENT_KOREAN[element as Element]}) - ${info.emotion}의 감정, ${info.organ} 건강 주의`;
    case 'display':
    default:
      return `${info.poeticName}(${koKey})`;
  }
}

// 오행 상세 설명 (PDF 섹션용)
function getElementDetailedDescription(element: Element | string): string {
  const koKey = ELEMENT_TO_KO_KEY[element] || '목';
  const info = ELEMENT_INFO[koKey];

  if (!info) return '';

  return `${info.poeticName}은 ${info.season}의 에너지입니다. ` +
         `${info.direction}을 향하면 좋고, ${info.color} 계열의 색상이 행운을 가져옵니다. ` +
         `${info.nature}의 본성을 가지며, ${info.organ}과 관련이 깊습니다.`;
}

// OhengBalance를 Record<string, number>로 변환
function convertOhengToRecord(oheng: OhengBalance): Record<string, number> {
  return {
    '목': oheng.wood || 0,
    '화': oheng.fire || 0,
    '토': oheng.earth || 0,
    '금': oheng.metal || 0,
    '수': oheng.water || 0
  };
}

// 연령별 콘텐츠 라벨
const AGE_GROUP_LABELS: Record<AgeGroup, {
  title: string;
  careerLabel: string;
  wealthLabel: string;
  relationLabel: string;
}> = {
  child: {
    title: '잠재력 분석',
    careerLabel: '추천 활동/교육',
    wealthLabel: '교육 자금 설계',
    relationLabel: '친구/가족 관계'
  },
  youth: {
    title: '진로 분석',
    careerLabel: '학업/진로 방향',
    wealthLabel: '용돈 관리/저축 습관',
    relationLabel: '또래 관계/연애'
  },
  adult: {
    title: '커리어 분석',
    careerLabel: '직업/사업 적합도',
    wealthLabel: '재테크/투자',
    relationLabel: '인간관계/결혼'
  },
  senior: {
    title: '인생 2막 분석',
    careerLabel: '은퇴 설계/제2직업',
    wealthLabel: '자산 보전/상속',
    relationLabel: '가족/건강 관리'
  }
};

// ========== 오행 정규화 함수 ==========
function normalizeOheng(oheng: OhengBalance): OhengBalance {
  const elements: Element[] = ['wood', 'fire', 'earth', 'metal', 'water'];
  const total = elements.reduce((sum, el) => sum + (oheng[el] || 0), 0);

  if (total === 0) {
    return { wood: 20, fire: 20, earth: 20, metal: 20, water: 20 };
  }

  const normalized: OhengBalance = {} as OhengBalance;
  elements.forEach(el => {
    normalized[el] = Math.round(((oheng[el] || 0) / total) * 1000) / 10; // 소수점 1자리
  });

  return normalized;
}

// ========== 아동용 재능 DNA 분석 ==========
const CHILD_TALENT_CATEGORIES: Record<Element, {
  talent: string;
  activities: string[];
  education: string[];
}> = {
  wood: {
    talent: '창의성과 성장 잠재력',
    activities: ['미술/그림', '자연 탐구', '레고/블록', '정원 가꾸기'],
    education: ['예술 교육', '환경 교육', '창의력 개발']
  },
  fire: {
    talent: '표현력과 리더십',
    activities: ['연극/뮤지컬', '스포츠', '발표/토론', '댄스'],
    education: ['언어 교육', '리더십 캠프', '예체능']
  },
  earth: {
    talent: '안정감과 포용력',
    activities: ['요리', '만들기', '동물 돌봄', '텃밭 가꾸기'],
    education: ['과학 실험', '생활 기술', '사회성 교육']
  },
  metal: {
    talent: '집중력과 분석력',
    activities: ['피아노/악기', '퍼즐', '코딩', '수학 게임'],
    education: ['음악 교육', '논리 사고', 'STEM 교육']
  },
  water: {
    talent: '지혜와 적응력',
    activities: ['수영', '독서', '명상/요가', '외국어'],
    education: ['언어 학습', '철학적 사고', '창의 글쓰기']
  }
};

// ========== 월별 차별화된 용신 활용법 ==========
const MONTHLY_YONGSIN_TIPS: Record<number, Record<Element, string>> = {
  1: {
    wood: '새해 목표 세우기, 실내 화분 관리로 목 기운 보충',
    fire: '따뜻한 색상 인테리어, 가족과 온기 나누기',
    earth: '안정적인 루틴 시작, 영양가 있는 음식 섭취',
    metal: '새해 계획 정리정돈, 불필요한 것 정리',
    water: '충분한 수면과 휴식, 따뜻한 차 마시기'
  },
  2: {
    wood: '봄맞이 준비, 새싹 기르기 시작',
    fire: '실내 운동으로 체온 유지, 양초 명상',
    earth: '겨울 음식 마무리, 봄 식단 계획',
    metal: '겨울 옷 정리, 봄 옷 준비',
    water: '입춘 전후 충분한 휴식, 족욕'
  },
  3: {
    wood: '야외 활동 시작, 산책/등산으로 목 기운 충전',
    fire: '봄 햇살 쬐기, 활동적 취미 시작',
    earth: '봄나물 섭취, 텃밭 시작',
    metal: '환절기 건강 관리, 깨끗한 공기 마시기',
    water: '꽃비 맞으며 산책, 수분 섭취 늘리기'
  },
  4: {
    wood: '꽃구경, 녹색 식물 곁에서 시간 보내기',
    fire: '야외 운동, 사람들과 적극 교류',
    earth: '봄 농사 시작, 흙 만지는 활동',
    metal: '봄 대청소, 공기청정기 관리',
    water: '비 오는 날 독서, 차분한 명상'
  },
  5: {
    wood: '신록의 계절 숲 체험, 원예 활동',
    fire: '어린이날/가정의달 가족 활동, 즐거운 이벤트',
    earth: '가족 요리, 피크닉',
    metal: '봄 정리 마무리, 여름 준비',
    water: '계곡 물소리 듣기, 온천'
  },
  6: {
    wood: '장마 전 야외 활동 마무리, 실내 정원 가꾸기',
    fire: '하지 양기 활용, 활동적 운동',
    earth: '제철 과일 섭취, 건강식',
    metal: '에어컨 정비, 실내 공기 관리',
    water: '물놀이 시작, 수영장'
  },
  7: {
    wood: '나무 그늘에서 휴식, 시원한 숲 산책',
    fire: '열정적 활동, 여름 축제 참여',
    earth: '보양식 섭취, 체력 관리',
    metal: '시원한 실내 활동, 냉방 관리',
    water: '물놀이, 해변/계곡 여행'
  },
  8: {
    wood: '말복 이후 야외 활동 재개, 나무 아래 독서',
    fire: '여름 마무리 에너지 발산, 캠핑',
    earth: '가을 준비, 추석 준비 시작',
    metal: '여름 정리, 가을 옷 꺼내기',
    water: '물놀이 마무리, 피서 여행'
  },
  9: {
    wood: '단풍 시작, 숲 산책으로 기운 충전',
    fire: '추석 가족 모임, 따뜻한 대화',
    earth: '추수의 계절 풍요로운 음식, 감사 나누기',
    metal: '가을 옷 정리, 환절기 건강 관리',
    water: '가을비 감상, 차분한 독서'
  },
  10: {
    wood: '단풍놀이, 가을 숲 체험',
    fire: '야외 활동 적극 참여, 따뜻한 옷차림',
    earth: '수확의 계절 맛있는 음식, 저장 음식 준비',
    metal: '청명한 공기 마시기, 대청소',
    water: '온천 여행, 따뜻한 음료'
  },
  11: {
    wood: '낙엽 밟기 산책, 실내 화분 관리',
    fire: '따뜻한 실내 모임, 캔들 명상',
    earth: '김장, 겨울 음식 준비',
    metal: '겨울 준비 정리, 난방기 점검',
    water: '입동 전후 충분한 휴식, 따뜻한 목욕'
  },
  12: {
    wood: '연말 계획 세우기, 새해 목표 구상',
    fire: '따뜻한 연말 모임, 감사 표현하기',
    earth: '연말 음식 나누기, 가족 식사',
    metal: '한 해 정리, 새해 계획 정돈',
    water: '동지 휴식, 충분한 수면으로 기력 회복'
  }
};

// ========== 행운 요소 다양화 풀 ==========
const LUCKY_ELEMENTS_POOL: Record<Element, {
  colors: string[];
  numbers: number[];
  directions: string[];
  foods: string[];
  activities: string[];
}> = {
  wood: {
    colors: ['녹색', '청록색', '연두색', '민트색'],
    numbers: [3, 8, 13, 18],
    directions: ['동쪽', '동남쪽'],
    foods: ['녹색 채소', '신 과일', '새싹', '나물'],
    activities: ['숲 산책', '등산', '원예', '요가']
  },
  fire: {
    colors: ['빨간색', '주황색', '보라색', '핑크색'],
    numbers: [2, 7, 12, 17],
    directions: ['남쪽', '남동쪽'],
    foods: ['고추', '토마토', '딸기', '양고기'],
    activities: ['운동', '댄스', '캠핑', '바베큐']
  },
  earth: {
    colors: ['노란색', '베이지', '갈색', '황토색'],
    numbers: [5, 10, 15, 20],
    directions: ['중앙', '남서쪽', '북동쪽'],
    foods: ['곡물', '감자', '호박', '된장'],
    activities: ['요리', '도예', '정원 가꾸기', '명상']
  },
  metal: {
    colors: ['흰색', '은색', '금색', '회색'],
    numbers: [4, 9, 14, 19],
    directions: ['서쪽', '북서쪽'],
    foods: ['흰쌀', '배', '무', '닭고기'],
    activities: ['악기 연주', '독서', '정리정돈', '공예']
  },
  water: {
    colors: ['검정색', '남색', '파란색', '하늘색'],
    numbers: [1, 6, 11, 16],
    directions: ['북쪽', '북동쪽'],
    foods: ['검은콩', '미역', '생선', '물'],
    activities: ['수영', '명상', '독서', '음악 감상']
  }
};

// ========== 월별 맥락화된 주의사항 (우유부단함 등 반복 방지) ==========
const MONTHLY_CONTEXTUALIZED_WARNINGS: Record<number, {
  water: string;  // 수 기운 관련 맥락화된 조언
  general: string;  // 일반 주의사항
}> = {
  1: {
    water: '새해 계획을 세울 때 지나친 고민보다 직관을 믿으세요. 수 기운의 지혜가 빛납니다.',
    general: '새해 목표 설정 시 현실적인 범위로 시작하세요.'
  },
  2: {
    water: '아직 때가 아니라면 기다리는 것도 전략입니다. 입춘까지 내면을 다듬으세요.',
    general: '조급한 결정보다 충분한 준비가 중요한 시기입니다.'
  },
  3: {
    water: '봄바람에 흔들리지 말고 핵심에 집중하세요. 명확한 우선순위가 힘이 됩니다.',
    general: '새로운 기회가 많지만 모두 잡으려 하지 마세요.'
  },
  4: {
    water: '인간관계에서 감정보다 논리로 접근하면 오해를 줄일 수 있습니다.',
    general: '대인 관계에서 명확한 커뮤니케이션이 필요합니다.'
  },
  5: {
    water: '가정과 일의 균형에서 양쪽 모두에 욕심내지 마세요. 선택과 집중이 필요합니다.',
    general: '가정의 달, 업무와 가족 시간의 균형을 조절하세요.'
  },
  6: {
    water: '상반기 성과에 집착하지 말고, 하반기 전략을 냉정하게 수정하세요.',
    general: '중간 점검의 시기, 방향 전환이 필요하면 과감하게.'
  },
  7: {
    water: '더위에 지치기 쉬운 시기, 중요한 결정은 충분한 휴식 후에 내리세요.',
    general: '휴가 계획 시 완전한 휴식에 집중하세요.'
  },
  8: {
    water: '열정적인 도전도 좋지만, 안전망 없이 뛰어들지는 마세요.',
    general: '새로운 시도 전 충분한 검토가 필요합니다.'
  },
  9: {
    water: '관계 정리가 필요한 시기, 명확한 기준으로 결단하세요.',
    general: '불필요한 것을 정리하고 핵심에 집중하세요.'
  },
  10: {
    water: '연말 목표 달성을 위해 집중력을 발휘하세요. 분산하지 마세요.',
    general: '마무리해야 할 일들의 우선순위를 정하세요.'
  },
  11: {
    water: '한 해를 돌아보며 감정에 치우치지 않고 객관적으로 평가하세요.',
    general: '성과와 부족한 점을 냉정하게 분석하는 시기입니다.'
  },
  12: {
    water: '새해 준비에 너무 많은 것을 담지 마세요. 핵심 목표 3개로 압축하세요.',
    general: '휴식과 재충전, 과도한 계획보다 회복에 집중하세요.'
  }
};

// ========== 경영자/사업가 특화 콘텐츠 ==========
const EXECUTIVE_CONTENT: Record<Element, {
  leadershipStyle: string;
  businessStrength: string;
  riskFactor: string;
  teamManagement: string;
  growthStrategy: string;
}> = {
  wood: {
    leadershipStyle: '비전 제시형 - 성장과 확장을 이끄는 리더',
    businessStrength: '신사업 개척, 스타트업, 혁신 주도',
    riskFactor: '너무 빠른 확장으로 인한 관리 부실 주의',
    teamManagement: '팀원들에게 성장 기회를 제공하면 충성도 상승',
    growthStrategy: '신규 시장 진출과 제품/서비스 다양화에 유리'
  },
  fire: {
    leadershipStyle: '열정 주도형 - 동기부여와 추진력의 리더',
    businessStrength: '마케팅, 영업, 대외 활동에 강점',
    riskFactor: '과도한 열정으로 인한 번아웃과 팀 피로 주의',
    teamManagement: '명확한 비전과 인정으로 팀 사기 고취',
    growthStrategy: '브랜딩 강화와 적극적인 홍보 활동이 효과적'
  },
  earth: {
    leadershipStyle: '안정 추구형 - 신뢰와 지속성의 리더',
    businessStrength: '운영 관리, 고객 관계, 장기 계획에 강점',
    riskFactor: '변화에 대한 저항으로 기회 상실 주의',
    teamManagement: '안정적인 환경과 명확한 역할 부여로 팀 안정',
    growthStrategy: '기존 고객 유지와 점진적 확장이 안전하고 효과적'
  },
  metal: {
    leadershipStyle: '원칙 중시형 - 효율과 품질의 리더',
    businessStrength: '시스템 구축, 품질 관리, 재무 관리에 강점',
    riskFactor: '지나친 완벽주의로 속도 저하 주의',
    teamManagement: '명확한 기준과 공정한 평가로 팀 신뢰 확보',
    growthStrategy: '프로세스 최적화와 비용 절감으로 경쟁력 확보'
  },
  water: {
    leadershipStyle: '전략 지향형 - 통찰력과 적응력의 리더',
    businessStrength: '시장 분석, 위기 관리, 네트워킹에 강점',
    riskFactor: '결정 지연으로 기회 상실 주의 - 분석 마비 경계',
    teamManagement: '유연한 조직 문화와 자율성 부여로 창의성 발휘',
    growthStrategy: '트렌드 파악과 타이밍 포착이 핵심, 기회 포착 시 과감하게'
  }
};

// ========== 관심사별 구체적 전략 풀 ==========
const INTEREST_SPECIFIC_STRATEGIES: Record<string, {
  doList: string[];
  dontList: string[];
  monthlyTip: Record<number, string>;
}> = {
  health: {
    doList: ['정기 건강검진 예약', '수면 패턴 일정하게 유지', '하루 30분 이상 움직이기'],
    dontList: ['야식 습관', '과도한 음주', '수면 부족'],
    monthlyTip: {
      1: '신년 건강 목표 설정 - 달성 가능한 수준으로',
      2: '면역력 강화 - 환절기 대비',
      3: '봄 야외 활동 시작 - 가벼운 산책부터',
      4: '꽃가루 알레르기 주의 - 실내 운동 병행',
      5: '가정의 달 스트레스 관리',
      6: '하지 건강 점검 - 상반기 피로 해소',
      7: '더위로 인한 체력 저하 주의',
      8: '말복 보양식으로 기력 회복',
      9: '환절기 면역 관리',
      10: '가을 운동 적기 - 활동량 늘리기',
      11: '겨울 대비 건강 점검',
      12: '연말 피로 해소와 충분한 휴식'
    }
  },
  investment: {
    doList: ['월별 예산 계획 수립', '비상금 확보', '분산 투자 원칙 지키기'],
    dontList: ['충동 구매', '고위험 투자 올인', '보험 미가입'],
    monthlyTip: {
      1: '연간 재무 계획 수립',
      2: '설 연휴 지출 관리',
      3: '1분기 결산 및 조정',
      4: '세금 관련 사항 점검',
      5: '가정의 달 지출 대비',
      6: '상반기 재무 점검',
      7: '휴가 예산 관리',
      8: '추석 자금 준비',
      9: '하반기 투자 전략 조정',
      10: '연말 정산 준비 시작',
      11: '연말 지출 계획',
      12: '내년 재무 목표 설정'
    }
  },
  career: {
    doList: ['분기별 성과 정리', '네트워킹 활동', '역량 개발 투자'],
    dontList: ['이직 충동적 결정', '인간관계 소홀', '자기계발 중단'],
    monthlyTip: {
      1: '연간 커리어 목표 설정',
      2: '상반기 프로젝트 준비',
      3: '봄 채용 시즌 기회 탐색',
      4: '1분기 성과 정리',
      5: '상반기 중간 점검',
      6: '하반기 계획 수립',
      7: '휴가 중 자기계발 계획',
      8: '하반기 프로젝트 착수',
      9: '가을 채용 시즌 활용',
      10: '연말 성과 마무리',
      11: '내년 커리어 계획 수립',
      12: '올해 성과 정리 및 포트폴리오 업데이트'
    }
  },
  relationship: {
    doList: ['정기적 가족 시간', '감사 표현하기', '경청하는 습관'],
    dontList: ['일 핑계로 소통 미루기', '감정적 대응', '비교하는 말'],
    monthlyTip: {
      1: '새해 가족 목표 공유',
      2: '발렌타인/설 가족 시간',
      3: '봄나들이 계획',
      4: '소중한 사람과 꽃구경',
      5: '가정의 달 감사 표현',
      6: '상반기 관계 점검',
      7: '여름 휴가 함께 계획',
      8: '추석 가족 모임 준비',
      9: '추석 연휴 소통의 시간',
      10: '가을 데이트 계획',
      11: '감사함 나누기',
      12: '연말 따뜻한 마무리'
    }
  },
  study: {
    doList: ['학습 계획 수립', '규칙적 복습', '질문하는 습관'],
    dontList: ['벼락치기', '비교로 인한 스트레스', '수면 시간 줄이기'],
    monthlyTip: {
      1: '학년/학기 목표 설정',
      2: '새 학기 준비',
      3: '새 학기 적응 기간',
      4: '중간고사 대비',
      5: '1학기 중간 점검',
      6: '기말고사 및 학기 마무리',
      7: '방학 중 보충 학습',
      8: '2학기 준비',
      9: '2학기 안정기',
      10: '중간고사 대비',
      11: '기말고사 준비 시작',
      12: '학년 마무리 및 다음 학년 준비'
    }
  },
  realestate: {
    doList: ['시장 동향 모니터링', '입지 분석', '전문가 상담'],
    dontList: ['무리한 대출', '검증 없는 투자', '단기 시세 차익 집착'],
    monthlyTip: {
      1: '연간 부동산 계획 수립',
      2: '봄 이사 시즌 준비',
      3: '이사 성수기 - 물건 탐색',
      4: '계약 시 세부 사항 확인',
      5: '5월 매물 탐색 적기',
      6: '상반기 시장 동향 분석',
      7: '하반기 투자 전략 수립',
      8: '가을 이사 시즌 대비',
      9: '추석 전후 매물 탐색',
      10: '연말 매물 협상 유리',
      11: '내년 부동산 계획 수립',
      12: '연말 세금 관련 정리'
    }
  },
  // 추가 관심사 전략
  selfdev: {
    doList: ['독서 목표 설정', '온라인 강의 수강', '멘토 찾기'],
    dontList: ['너무 많은 목표', '비교로 인한 조급함', '실천 없는 계획'],
    monthlyTip: {
      1: '연간 자기계발 목표 설정',
      2: '새로운 습관 형성 시작',
      3: '1분기 학습 점검',
      4: '새로운 스킬 도전',
      5: '중간 점검 및 조정',
      6: '상반기 성과 정리',
      7: '휴가 중 독서/학습',
      8: '하반기 계획 재정비',
      9: '자격증/시험 준비',
      10: '연말 목표 달성 추진',
      11: '내년 계획 수립',
      12: '올해 성장 정리'
    }
  },
  startup: {
    doList: ['시장 조사', '사업 계획서 정비', '네트워킹 확대'],
    dontList: ['검증 없는 확장', '자금 관리 소홀', '원맨 쇼'],
    monthlyTip: {
      1: '연간 사업 목표 설정',
      2: '1분기 전략 수립',
      3: '마케팅 강화',
      4: '1분기 성과 분석',
      5: '파트너십 구축',
      6: '상반기 결산',
      7: '하반기 준비',
      8: '신제품/서비스 기획',
      9: '4분기 전략 수립',
      10: '연말 프로모션',
      11: '내년 사업 계획',
      12: '연말 결산 및 세무 준비'
    }
  },
  romance: {
    doList: ['자기 자신 가꾸기', '새로운 만남에 열린 마음', '소통 연습'],
    dontList: ['과거에 집착', '상대방 이상화', '성급한 결정'],
    monthlyTip: {
      1: '새해 연애 운 점검',
      2: '발렌타인 데이 준비',
      3: '봄 소개팅 시즌',
      4: '벚꽃 데이트',
      5: '가정의 달 가족 소개',
      6: '관계 점검',
      7: '여름 휴가 계획',
      8: '추석 전 관계 정리',
      9: '결혼 시즌 준비',
      10: '가을 데이트',
      11: '연말 계획 공유',
      12: '연말 프로포즈 시즌'
    }
  },
  parenting: {
    doList: ['자녀와 대화 시간 확보', '칭찬 습관화', '일관된 훈육'],
    dontList: ['과도한 비교', '감정적 훈육', '약속 어기기'],
    monthlyTip: {
      1: '새 학년 준비',
      2: '방학 마무리 학습',
      3: '새 학기 적응 지원',
      4: '중간고사 관리',
      5: '가정의 달 가족 활동',
      6: '기말고사 및 1학기 마무리',
      7: '방학 계획 수립',
      8: '2학기 준비',
      9: '추석 가족 시간',
      10: '중간고사 관리',
      11: '기말고사 준비',
      12: '연말 가족 시간'
    }
  },
  family: {
    doList: ['정기적 가족 식사', '부모님 건강 챙기기', '형제간 소통'],
    dontList: ['금전 문제로 갈등', '과거 문제 들춰내기', '비교하기'],
    monthlyTip: {
      1: '새해 가족 모임',
      2: '설 연휴 준비',
      3: '부모님 건강 검진',
      4: '봄나들이',
      5: '어버이날 감사 표현',
      6: '상반기 가족 점검',
      7: '여름 휴가 함께',
      8: '추석 준비',
      9: '추석 가족 모임',
      10: '가을 여행',
      11: '연말 모임 계획',
      12: '연말 가족 시간'
    }
  }
};

// 월별 고유 조언 데이터
const MONTHLY_UNIQUE_ADVICE: Record<number, {
  theme: string;
  wisdom: string;
  actionTip: string;
}> = {
  1: {
    theme: '새로운 시작의 달',
    wisdom: '겨울의 끝자락에서 봄을 준비하듯, 이 달은 내면의 계획을 다듬는 시기입니다.',
    actionTip: '올해의 큰 그림을 그리고, 첫 발걸음을 내딛으세요.'
  },
  2: {
    theme: '인내와 축적의 달',
    wisdom: '아직 땅은 차갑지만, 씨앗은 이미 싹틀 준비를 합니다.',
    actionTip: '조급함을 버리고 기초를 다지는 데 집중하세요.'
  },
  3: {
    theme: '도약의 달',
    wisdom: '봄바람이 불어오듯, 새로운 기회의 문이 열리기 시작합니다.',
    actionTip: '망설이던 일을 시작하기에 좋은 시기입니다.'
  },
  4: {
    theme: '성장의 달',
    wisdom: '꽃이 피어나듯, 당신의 노력도 눈에 보이는 결과로 나타납니다.',
    actionTip: '인맥을 넓히고 협력 관계를 강화하세요.'
  },
  5: {
    theme: '결실 준비의 달',
    wisdom: '열매를 맺기 위해서는 꾸준한 관리가 필요합니다.',
    actionTip: '진행 중인 프로젝트의 완성도를 높이세요.'
  },
  6: {
    theme: '전환의 달',
    wisdom: '한 해의 절반이 지나는 시점, 방향을 점검할 때입니다.',
    actionTip: '상반기를 돌아보고 하반기 전략을 수정하세요.'
  },
  7: {
    theme: '도전의 달',
    wisdom: '뜨거운 여름처럼 열정을 불태울 시기입니다.',
    actionTip: '두려움을 떨치고 새로운 도전에 나서세요.'
  },
  8: {
    theme: '수확의 달',
    wisdom: '그동안 뿌린 씨앗이 열매를 맺는 시기입니다.',
    actionTip: '노력의 결과를 인정받을 기회를 놓치지 마세요.'
  },
  9: {
    theme: '정리의 달',
    wisdom: '가을의 시작과 함께 불필요한 것을 정리할 때입니다.',
    actionTip: '관계와 업무를 점검하고 효율을 높이세요.'
  },
  10: {
    theme: '완성의 달',
    wisdom: '한 해의 프로젝트를 마무리할 최적의 시기입니다.',
    actionTip: '미루던 일을 끝내고 성취감을 느끼세요.'
  },
  11: {
    theme: '성찰의 달',
    wisdom: '겨울을 앞두고 내면을 돌아보는 시간입니다.',
    actionTip: '올해의 성과를 정리하고 감사함을 나누세요.'
  },
  12: {
    theme: '마무리와 재충전의 달',
    wisdom: '한 해를 마감하며 새해를 위한 에너지를 모으세요.',
    actionTip: '휴식과 재충전으로 내년을 준비하세요.'
  }
};

// 오행별 건강/재물/관계 영향 데이터
const ELEMENT_LIFE_IMPACT: Record<Element, {
  health: { organ: string; risk: string; tip: string };
  wealth: { strength: string; advice: string };
  relationship: { style: string; tip: string };
}> = {
  wood: {
    health: { organ: '간/담낭/눈', risk: '스트레스로 인한 두통, 눈 피로', tip: '녹색 채소 섭취, 숲 산책 추천' },
    wealth: { strength: '창업과 성장에 유리', advice: '새로운 사업 기회를 적극 탐색하세요' },
    relationship: { style: '진취적이고 리더십 있음', tip: '상대방의 의견도 경청하는 자세 필요' }
  },
  fire: {
    health: { organ: '심장/소장/혀', risk: '과로로 인한 심장 부담', tip: '충분한 휴식과 명상 추천' },
    wealth: { strength: '투자와 확장에 유리', advice: '열정을 활용하되 신중한 판단 필요' },
    relationship: { style: '열정적이고 표현력 풍부', tip: '감정 조절로 관계 안정화' }
  },
  earth: {
    health: { organ: '위/비장/입술', risk: '소화기 문제 주의', tip: '규칙적인 식사와 제철 음식 섭취' },
    wealth: { strength: '안정적인 자산 관리에 유리', advice: '꾸준한 저축과 장기 투자 추천' },
    relationship: { style: '신뢰감 있고 포용력 있음', tip: '변화에 유연하게 대처하기' }
  },
  metal: {
    health: { organ: '폐/대장/피부', risk: '호흡기와 피부 문제 주의', tip: '맑은 공기와 충분한 수분 섭취' },
    wealth: { strength: '절제와 축적에 유리', advice: '지출을 줄이고 알찬 투자에 집중' },
    relationship: { style: '원칙적이고 정의로움', tip: '융통성을 발휘하면 관계 개선' }
  },
  water: {
    health: { organ: '신장/방광/귀', risk: '피로 누적과 면역력 저하 주의', tip: '충분한 수면과 따뜻한 음식 섭취' },
    wealth: { strength: '유연한 재테크에 유리', advice: '흐름을 읽고 적응력 있게 대처' },
    relationship: { style: '지혜롭고 깊은 통찰력', tip: '감정을 솔직하게 표현하기' }
  }
};

// 용신 구체적 추천 (색상, 방향, 음식, 사람, 감각)
const YONGSIN_SPECIFICS: Record<Element, {
  colors: string; direction: string; foods: string;
  personTypes: string; mbtiTypes: string; sense: string; senseAdvice: string;
}> = {
  wood: {
    colors: '청록색, 초록색, 연두색 계열',
    direction: '동쪽 방향 (동향 창문, 동쪽 카페/공원)',
    foods: '푸른 잎채소, 신맛 과일(레몬, 귤, 매실), 식초 드레싱 샐러드',
    personTypes: '도전적이고 추진력 있는 사람, 창의적 성향, 성장 지향적인 사람',
    mbtiTypes: 'ENFP, ENTP, ENTJ',
    sense: '시각',
    senseAdvice: '자연의 푸른 풍경을 자주 보면 마음이 안정됩니다. 복잡한 시각 환경은 피로를 유발하니 정리된 공간을 유지하세요.'
  },
  fire: {
    colors: '빨간색, 자주색, 오렌지색 계열',
    direction: '남쪽 방향 (남향 공간, 남쪽 모임 장소)',
    foods: '쓴맛 식품(커피, 다크초콜릿, 녹차), 붉은 과일(석류, 토마토)',
    personTypes: '에너지 넘치고 밝은 성격, 열정적 리더형, 유머 감각 있는 사람',
    mbtiTypes: 'ESFP, ENFJ, ESTP',
    sense: '미각',
    senseAdvice: '다양한 맛의 음식으로 에너지를 충전하되, 자극적인 음식은 감정 기복을 키울 수 있으니 균형 잡힌 식사를 권합니다.'
  },
  earth: {
    colors: '노란색, 베이지색, 갈색 계열',
    direction: '거주지 중심부 (집 가까운 곳, 익숙한 공간)',
    foods: '단맛 식품(고구마, 호박, 꿀, 대추차), 곡물류(현미, 잡곡밥), 뿌리채소(당근, 감자)',
    personTypes: '신뢰감 있고 안정적인 사람, 책임감 강한 사람, 포용력 있는 사람',
    mbtiTypes: 'ISFJ, ISTJ, ESFJ',
    sense: '촉각',
    senseAdvice: '부드러운 소재의 옷이나 침구가 안정감을 줍니다. 맨발로 흙이나 잔디를 밟는 접지(어싱)가 기운 보충에 도움됩니다.'
  },
  metal: {
    colors: '흰색, 금색, 은색 계열',
    direction: '서쪽 방향 (서향 공간, 서쪽 지역 여행)',
    foods: '매운맛 식품(생강차, 마늘, 양파), 흰색 식품(무, 배, 도라지), 견과류',
    personTypes: '원칙적이고 체계적인 사람, 논리적인 사람, 정직하고 결단력 있는 사람',
    mbtiTypes: 'INTJ, ESTJ, ISTJ',
    sense: '후각',
    senseAdvice: '은은한 아로마(라벤더, 유칼립투스)가 집중력을 높입니다. 강한 향이나 환기 안 되는 공간은 피하세요.'
  },
  water: {
    colors: '검정색, 남색, 짙은 파란색 계열',
    direction: '북쪽 방향 (북향 서재, 수변 공간)',
    foods: '해산물(생선, 새우, 미역), 콩류(두부, 된장, 검은콩), 수분 풍부한 과일(수박, 배)',
    personTypes: '차분하고 사려 깊은 사람, 감성 풍부한 사람, 깊이 있는 대화를 나눌 수 있는 사람',
    mbtiTypes: 'INFJ, INTP, INFP',
    sense: '청각',
    senseAdvice: '자연의 물소리나 잔잔한 음악이 평화를 줍니다. 소음 환경은 에너지를 빠르게 소모시키니 조용한 시간을 확보하세요.'
  }
};

// 기신 구체적 주의사항
const GISIN_CAUTION: Record<Element, string> = {
  wood: '목(木) 과잉 시: 푸른색 계열을 줄이고, 동쪽 방향의 큰 결정을 미루세요. 신맛 음식을 줄이고, 무계획적 도전만 추구하는 사람과 거리를 두세요.',
  fire: '화(火) 과잉 시: 빨간색 계열을 줄이고, 뜨거운 환경을 피하세요. 자극적인 음식을 줄이고, 흥분을 부추기는 사람과의 접촉을 자제하세요.',
  earth: '토(土) 과잉 시: 갈색·베이지 톤을 줄이고, 익숙한 곳만 고집하지 마세요. 단맛 음식을 줄이고, 변화를 두려워하는 사람에게서 벗어나세요.',
  metal: '금(金) 과잉 시: 흰색·금속 톤을 줄이고, 서쪽 방향의 중요 계약을 재고하세요. 매운 음식을 줄이고, 융통성 없는 사람과의 갈등을 조심하세요.',
  water: '수(水) 과잉 시: 검정·남색 의류를 줄이고, 북쪽 방향 이동을 자제하세요. 짠 음식을 줄이고, 비관적이고 소극적인 사람과의 장시간 교류를 피하세요.'
};

// 연간 운세 요약 생성
function generateYearSummary(
  oheng: OhengBalance,
  yongsin?: Element[],
  premium?: PremiumContent
): { overallScore: number; highlights: string[]; challenges: string[]; luckyMonths: number[] } {
  // 전체 점수 계산 (월별 평균)
  const monthlyScores = premium?.monthlyActionPlan?.map(m => m.score) || [];
  const overallScore = monthlyScores.length > 0
    ? Math.round(monthlyScores.reduce((a, b) => a + b, 0) / monthlyScores.length)
    : 75;

  // 상위 3개월 찾기
  const luckyMonths = monthlyScores
    .map((score, idx) => ({ month: idx + 1, score }))
    .sort((a, b) => b.score - a.score)
    .slice(0, 3)
    .map(m => m.month);

  // 하이라이트 생성
  const highlights: string[] = [];
  const challenges: string[] = [];

  if (yongsin?.length) {
    const yongsinNames = yongsin.map(e => {
      const koKey = ELEMENT_TO_KO_KEY[e] || '목';
      return ELEMENT_INFO[koKey]?.poeticName || ELEMENT_KOREAN[e];
    }).join(', ');
    highlights.push(`${yongsinNames}의 기운을 가까이 하면 운세가 상승합니다`);
  }

  // 오행 균형 분석
  const elements: Element[] = ['wood', 'fire', 'earth', 'metal', 'water'];
  const sortedElements = elements
    .map(e => ({ element: e, value: oheng[e] || 0 }))
    .sort((a, b) => b.value - a.value);

  const strongestElement = sortedElements[0];
  const weakestElement = sortedElements[sortedElements.length - 1];

  if (strongestElement.value > 30) {
    const strongKoKey = ELEMENT_TO_KO_KEY[strongestElement.element] || '목';
    const strongName = ELEMENT_INFO[strongKoKey]?.poeticName || ELEMENT_KOREAN[strongestElement.element];
    highlights.push(`${strongName}의 강한 기운(${strongestElement.value.toFixed(0)}%)이 당신의 핵심 동력입니다`);
  }

  if (weakestElement.value < 10) {
    const weakKoKey = ELEMENT_TO_KO_KEY[weakestElement.element] || '목';
    const weakName = ELEMENT_INFO[weakKoKey]?.poeticName || ELEMENT_KOREAN[weakestElement.element];
    challenges.push(`${weakName}의 기운이 부족하여 관련 영역 보완이 필요합니다`);
  }

  if (premium?.lifeTimeline?.goldenWindows?.length) {
    highlights.push('황금 기회의 시기가 다가오고 있습니다');
  }

  if (premium?.careerAnalysis?.matchScore && premium.careerAnalysis.matchScore >= 70) {
    highlights.push('현재 직업과의 궁합이 좋은 해입니다');
  }

  return { overallScore, highlights, challenges, luckyMonths };
}

// 스토리텔링 생성 함수 (연령별 맞춤)
function generateMonthlyStory(
  monthNum: number,
  score: number,
  yongsin?: Element[],
  userName?: string,
  ageGroup?: AgeGroup
): string {
  const advice = MONTHLY_UNIQUE_ADVICE[monthNum];
  if (!advice) return '';

  // 점수별 감성 표현
  const scoreEmoji = score >= 90 ? '🌟' : score >= 80 ? '✨' : score >= 70 ? '💫' : score >= 60 ? '🌙' : '🌱';
  const scoreStars = '★'.repeat(Math.round(score / 20)) + '☆'.repeat(5 - Math.round(score / 20));

  // 연령별 스토리텔링
  let storyOpening = '';
  if (ageGroup === 'child') {
    storyOpening = score >= 80
      ? `${userName || '아이'}에게 ${monthNum}월은 마법처럼 반짝이는 시간이에요!`
      : score >= 60
        ? `${userName || '아이'}에게 ${monthNum}월은 차근차근 성장하는 시기예요.`
        : `${userName || '아이'}에게 ${monthNum}월은 조금 쉬어가며 힘을 모으는 때예요.`;
  } else if (ageGroup === 'youth') {
    storyOpening = score >= 80
      ? `${userName}님, ${monthNum}월은 꿈을 향해 달려가기 좋은 때입니다!`
      : score >= 60
        ? `${userName}님, ${monthNum}월은 기초를 다지며 준비하는 시기입니다.`
        : `${userName}님, ${monthNum}월은 잠시 멈춰 방향을 점검할 때입니다.`;
  } else {
    storyOpening = score >= 80
      ? `${userName}님에게 ${monthNum}월은 풍요로운 기운이 감도는 시기입니다.`
      : score >= 60
        ? `${userName}님에게 ${monthNum}월은 안정 속에서 발전을 이루는 시기입니다.`
        : `${userName}님에게 ${monthNum}월은 신중하게 기회를 엿보는 시기입니다.`;
  }

  // 용신 활용 조언 (월별 차별화)
  let yongsinTip = '';
  if (yongsin?.length) {
    const monthTips = MONTHLY_YONGSIN_TIPS[monthNum];
    if (monthTips && monthTips[yongsin[0]]) {
      yongsinTip = `\n${ELEMENT_KOREAN[yongsin[0]]} 기운 활용법: ${monthTips[yongsin[0]]}`;
    }
  }

  return `${scoreEmoji} 점수: ${score}점 ${scoreStars}\n\n${storyOpening}\n\n${advice.wisdom}${yongsinTip}`;
}

interface PDFGeneratorOptions {
  user: UserInput;
  saju: SajuChart;
  oheng: OhengBalance;
  yongsin?: Element[];
  gisin?: Element[];
  premium?: PremiumContent;
  targetYear?: number;
}

interface PDFSection {
  title: string;
  content: string[];
}

/**
 * 사주 분석 PDF 문서 생성
 */
export async function generateSajuPDF(options: PDFGeneratorOptions): Promise<Buffer> {
  const { user, saju, yongsin, gisin, premium, targetYear = 2026 } = options;

  // 연령 그룹 판정 (목표 연도 기준 정확한 만 나이 계산)
  const { group: ageGroup, age: userAge } = getAgeGroup(user.birthDate, targetYear);
  const ageLabels = AGE_GROUP_LABELS[ageGroup];

  // 오행 정규화 (합계 100%)
  const oheng = normalizeOheng(options.oheng);

  // PDF 생성 (A4 사이즈, 한글 폰트 지원)
  const doc = await createKoreanPDF({
    orientation: 'portrait',
    unit: 'mm',
    format: 'a4'
  });

  const pageWidth = 210;
  const pageHeight = 297;
  const margin = 20;
  const pageTopMargin = 34; // 프린트 시 상단 잘림 방지 (2줄 추가 여백)
  const contentWidth = pageWidth - margin * 2;
  const lineHeight = 7;
  let yPos = pageTopMargin;

  // 헬퍼 함수: 줄바꿈 체크 및 페이지 추가
  const checkNewPage = (height: number = lineHeight) => {
    if (yPos + height > pageHeight - margin) {
      doc.addPage();
      yPos = pageTopMargin;
    }
  };

  // 헬퍼 함수: 텍스트 출력
  const addText = (text: string, fontSize: number = 10) => {
    doc.setFontSize(fontSize);
    checkNewPage(fontSize * 0.5);

    // 긴 텍스트 줄바꿈 처리
    const lines = doc.splitTextToSize(text, contentWidth);
    lines.forEach((line: string) => {
      checkNewPage();
      doc.text(line, margin, yPos);
      yPos += lineHeight;
    });
  };

  // 헬퍼 함수: 섹션 제목
  const addSectionTitle = (title: string) => {
    yPos += 5;
    checkNewPage(15);
    doc.setFontSize(14);
    doc.text(title, margin, yPos);
    yPos += 3;
    doc.setLineWidth(0.5);
    doc.line(margin, yPos, pageWidth - margin, yPos);
    yPos += 10;
  };

  // 헬퍼 함수: 서브 섹션
  const addSubSection = (title: string) => {
    yPos += 3;
    checkNewPage(12);
    doc.setFontSize(12);
    doc.text(`■ ${title}`, margin, yPos);
    yPos += 8;
  };

  // 헬퍼 함수: 테이블 출력 (jspdf-autotable 사용)
  const addTable = (
    headers: string[],
    rows: string[][],
    options: {
      title?: string;
      columnWidths?: number[];
      headerColor?: [number, number, number];
    } = {}
  ) => {
    checkNewPage(30);

    if (options.title) {
      addSubSection(options.title);
    }

    // autoTable 호출
    autoTable(doc, {
      startY: yPos,
      head: [headers],
      body: rows,
      margin: { left: margin, right: margin },
      styles: {
        font: 'NanumGothic',
        fontSize: 9,
        cellPadding: 3,
        overflow: 'linebreak',
        lineWidth: 0.1
      },
      headStyles: {
        fillColor: options.headerColor || [59, 130, 246],
        textColor: [255, 255, 255],
        fontStyle: 'bold',
        halign: 'center'
      },
      bodyStyles: {
        textColor: [33, 33, 33]
      },
      alternateRowStyles: {
        fillColor: [248, 250, 252]
      },
      columnStyles: options.columnWidths ?
        options.columnWidths.reduce((acc, width, idx) => {
          acc[idx] = { cellWidth: width };
          return acc;
        }, {} as Record<number, { cellWidth: number }>) : undefined
    });

    // autoTable이 설정한 최종 Y 위치 가져오기
    yPos = (doc as any).lastAutoTable.finalY + 10;
  };

  // 헬퍼 함수: 2열 정보 테이블 (키-값 쌍)
  const addInfoTable = (
    data: Array<{ label: string; value: string }>,
    title?: string
  ) => {
    const rows = data.map(d => [d.label, d.value]);
    addTable(['항목', '내용'], rows, {
      title,
      columnWidths: [50, contentWidth - 50],
      headerColor: [100, 116, 139]
    });
  };

  // 헬퍼 함수: 점수 테이블 (항목별 점수 표시)
  const addScoreTable = (
    items: Array<{ category: string; score: number; description?: string }>,
    title?: string
  ) => {
    const rows = items.map(item => {
      const bar = '█'.repeat(Math.round(item.score / 10)) + '░'.repeat(10 - Math.round(item.score / 10));
      return [item.category, `${item.score}점`, bar, item.description || ''];
    });
    addTable(['분야', '점수', '시각화', '설명'], rows, {
      title,
      columnWidths: [35, 25, 45, contentWidth - 105],
      headerColor: [34, 197, 94]
    });
  };

  // 헬퍼 함수: 월별 운세 테이블
  const addMonthlyTable = (
    months: Array<{ month: string; score: number; action: string; avoid: string }>,
    title?: string
  ) => {
    const rows = months.map(m => {
      const emoji = m.score >= 80 ? '🌟' : m.score >= 60 ? '✨' : '🌙';
      return [m.month, `${m.score}점 ${emoji}`, m.action, m.avoid];
    });
    addTable(['월', '점수', '해야 할 것', '피해야 할 것'], rows, {
      title,
      columnWidths: [25, 30, (contentWidth - 55) / 2, (contentWidth - 55) / 2],
      headerColor: [168, 85, 247]
    });
  };

  // ========== 표지 ==========
  doc.setFontSize(28);
  doc.text('사주팔자 분석 리포트', pageWidth / 2, 70, { align: 'center' });

  doc.setFontSize(16);
  const reportSubtitle = ageGroup === 'child'
    ? `${targetYear}년 성장 가이드`
    : ageGroup === 'youth'
      ? `${targetYear}년 진로·학업 운세`
      : `${targetYear}년 운세 분석`;
  doc.text(reportSubtitle, pageWidth / 2, 90, { align: 'center' });

  doc.setFontSize(14);
  doc.text(`성명: ${user.name}`, pageWidth / 2, 120, { align: 'center' });
  doc.text(`생년월일: ${user.birthDate} (만 ${userAge}세)`, pageWidth / 2, 130, { align: 'center' });
  if (user.birthTime) {
    doc.text(`출생시간: ${user.birthTime}`, pageWidth / 2, 140, { align: 'center' });
  }
  doc.text(`성별: ${user.gender === 'male' ? '남성' : '여성'}`, pageWidth / 2, 150, { align: 'center' });

  // 연령별 맞춤 안내
  doc.setFontSize(11);
  const targetAudience = ageGroup === 'child'
    ? '※ 이 리포트는 부모님을 위한 양육 가이드입니다.'
    : ageGroup === 'youth'
      ? '※ 학업과 진로 설계에 도움이 되는 리포트입니다.'
      : '';
  if (targetAudience) {
    doc.text(targetAudience, pageWidth / 2, 170, { align: 'center' });
  }

  doc.setFontSize(10);
  doc.text(`발행일: ${new Date().toLocaleDateString('ko-KR')}`, pageWidth / 2, 250, { align: 'center' });
  doc.text('AI-PLANX Premium Service', pageWidth / 2, 260, { align: 'center' });

  // ========== 프롤로그 페이지 (60갑자 + 시적 도입부) ==========
  doc.addPage();
  yPos = pageTopMargin;

  // 60갑자 정보 가져오기 (v2.0: premium.sixtyJiazi 우선 사용)
  const yearStem = saju.year?.heavenlyStem || '甲';
  const yearBranch = saju.year?.earthlyBranch || '子';
  // premium.sixtyJiazi는 SixtyJiaziAnalysis 타입 (이미 생성된 분석 콘텐츠)
  const sixtyJiaziAnalysis = premium?.sixtyJiazi;
  // getSixtyJiaziInfo는 SixtyJiaziInfo 타입 (원본 매핑 데이터) - 폴백용
  const jiaziInfo = getSixtyJiaziInfo(yearStem, yearBranch);

  // 일간 정보로 꽃/동물 카드 가져오기
  const dayMasterKorean = getDayMasterKorean(saju.day?.heavenlyStem || '甲');
  const essenceCard = ESSENCE_CARDS[dayMasterKorean];
  const primaryYongsin = yongsin?.[0] || 'wood';
  const yongsinKorean = getElementKorean(primaryYongsin);
  const energyCard = ENERGY_CARDS[yongsinKorean];

  // 프롤로그 제목
  doc.setFontSize(16);
  doc.text('✧ 당신의 운명 이야기 ✧', pageWidth / 2, yPos, { align: 'center' });
  yPos += 15;

  // v2.0: premium.prologue 또는 premium.sixtyJiazi 사용
  const prologueText = premium?.prologue
    || sixtyJiaziAnalysis?.prologueText
    || (jiaziInfo ? generateJiaziPrologue(jiaziInfo) : null);

  if (prologueText) {
    // 60갑자 제목
    if (premium?.sixtyJiazi) {
      doc.setFontSize(12);
      doc.text(`${premium.sixtyJiazi.yearKorean}년 ${premium.sixtyJiazi.animalDescription}`, pageWidth / 2, yPos, { align: 'center' });
      yPos += 10;
    } else if (jiaziInfo && 'korean' in jiaziInfo && 'animalKorean' in jiaziInfo) {
      doc.setFontSize(12);
      doc.text(`${(jiaziInfo as any).korean}년 ${(jiaziInfo as any).animalKorean}`, pageWidth / 2, yPos, { align: 'center' });
      yPos += 10;
    }

    doc.setFontSize(10);
    const prologueLines = doc.splitTextToSize(prologueText, contentWidth - 20);
    prologueLines.forEach((line: string) => {
      checkNewPage();
      doc.text(line, pageWidth / 2, yPos, { align: 'center' });
      yPos += 6;
    });
    yPos += 10;
  }

  // 본질 카드 (꽃)
  if (essenceCard) {
    doc.setFontSize(11);
    doc.text(`🌸 본질의 꽃: ${essenceCard.flowerKorean}`, margin, yPos);
    yPos += 8;
    doc.setFontSize(9);
    const essenceLines = doc.splitTextToSize(essenceCard.story, contentWidth);
    essenceLines.forEach((line: string) => {
      checkNewPage();
      doc.text(line, margin, yPos);
      yPos += 5;
    });
    yPos += 8;
  }

  // 에너지 카드 (동물)
  if (energyCard) {
    doc.setFontSize(11);
    doc.text(`🐾 에너지 동물: ${energyCard.animalKorean}`, margin, yPos);
    yPos += 8;
    doc.setFontSize(9);
    const energyLines = doc.splitTextToSize(energyCard.story, contentWidth);
    energyLines.forEach((line: string) => {
      checkNewPage();
      doc.text(line, margin, yPos);
      yPos += 5;
    });
    yPos += 10;
  }

  // 오행 시적 해석
  const elementPoetry = generateElementBalancePoetry(convertOhengToRecord(oheng));
  if (elementPoetry) {
    doc.setFontSize(11);
    doc.text('✦ 오행의 조화 ✦', pageWidth / 2, yPos, { align: 'center' });
    yPos += 10;
    doc.setFontSize(9);
    const poetryLines = doc.splitTextToSize(elementPoetry, contentWidth - 10);
    poetryLines.forEach((line: string) => {
      checkNewPage();
      doc.text(line, margin + 5, yPos);
      yPos += 5;
    });
  }

  // ========== 전문가 분석: 운명 정체성 페이지 ==========
  doc.addPage();
  yPos = pageTopMargin;

  const dayStem = saju.day?.heavenlyStem || '甲';
  const dayMasterPro = DAY_MASTER_PROFESSIONAL[dayStem];
  const identityTitle = generateIdentityTitle(
    user.name,
    dayStem,
    yongsin || ['wood'],
    user.mbti,
    user.bloodType
  );

  // 킬러 타이틀
  doc.setFontSize(14);
  doc.text('✧ 당신의 운명 정체성 ✧', pageWidth / 2, yPos, { align: 'center' });
  yPos += 15;

  doc.setFontSize(12);
  const mainTitleLines = doc.splitTextToSize(identityTitle.mainTitle, contentWidth - 20);
  mainTitleLines.forEach((line: string) => {
    doc.text(line, pageWidth / 2, yPos, { align: 'center' });
    yPos += 8;
  });
  yPos += 5;

  doc.setFontSize(10);
  doc.text(`"${identityTitle.subTitle}"`, pageWidth / 2, yPos, { align: 'center' });
  yPos += 15;

  // 일간 전문 분석
  if (dayMasterPro) {
    doc.setFontSize(11);
    doc.text(`【${dayMasterPro.hanja}】 ${dayMasterPro.poeticTitle}`, margin, yPos);
    yPos += 10;

    doc.setFontSize(9);
    const proDescLines = doc.splitTextToSize(dayMasterPro.professionalDesc, contentWidth);
    proDescLines.forEach((line: string) => {
      checkNewPage();
      doc.text(line, margin, yPos);
      yPos += 5;
    });
    yPos += 8;

    // 핵심 키워드
    doc.setFontSize(10);
    doc.text(`핵심 키워드: ${dayMasterPro.coreKeyword}`, margin, yPos);
    yPos += 8;

    // 인생 주제
    doc.text(`인생 주제: ${dayMasterPro.lifeTheme}`, margin, yPos);
    yPos += 12;

    // 숨겨진 성격 (소름 포인트)
    doc.setFontSize(11);
    doc.text('🔮 당신만 아는 은밀한 속마음', margin, yPos);
    yPos += 8;

    const hiddenTrait = getHiddenTraitMessage(dayStem, user.mbti);
    doc.setFontSize(9);
    const hiddenLines = doc.splitTextToSize(hiddenTrait, contentWidth);
    hiddenLines.forEach((line: string) => {
      checkNewPage();
      doc.text(line, margin, yPos);
      yPos += 5;
    });
    yPos += 10;
  }

  // 황금 기회일
  const goldenTimes = calculateGoldenTimes(user.birthDate, dayStem, yongsin || ['wood'], targetYear);
  if (goldenTimes.length > 0) {
    doc.setFontSize(11);
    doc.text(`⭐ ${targetYear}년 황금 기회일 (Golden Time)`, margin, yPos);
    yPos += 10;

    doc.setFontSize(9);
    goldenTimes.forEach((gt, idx) => {
      checkNewPage();
      doc.text(`${idx + 1}. ${gt.date}`, margin, yPos);
      yPos += 5;
      const reasonLines = doc.splitTextToSize(`   ${gt.reason}`, contentWidth - 10);
      reasonLines.forEach((line: string) => {
        doc.text(line, margin, yPos);
        yPos += 5;
      });
      doc.text(`   → ${gt.action}`, margin, yPos);
      yPos += 7;
    });
    yPos += 8;
  }

  // 개운 처방전
  const prescriptions = generateFortunePrescriptions(yongsin || ['wood'], gisin || ['fire']);
  if (prescriptions.length > 0) {
    checkNewPage(60);
    doc.setFontSize(11);
    doc.text('💊 개운(開運) 처방전', margin, yPos);
    yPos += 10;

    doc.setFontSize(9);
    prescriptions.forEach(rx => {
      checkNewPage();
      doc.text(`[${rx.category}] ${rx.item}`, margin, yPos);
      yPos += 5;
      const howToLines = doc.splitTextToSize(`  → ${rx.howTo}`, contentWidth - 10);
      howToLines.forEach((line: string) => {
        doc.text(line, margin, yPos);
        yPos += 5;
      });
      yPos += 3;
    });
  }

  // 이번 달 금기 사항
  const currentMonth = new Date().getMonth() + 1;
  const monthlyTaboo = getMonthlyTaboo(currentMonth, primaryYongsin);

  checkNewPage(50);
  doc.setFontSize(11);
  doc.text(`⚠️ ${currentMonth}월 주의 사항 & 행운 아이템`, margin, yPos);
  yPos += 10;

  doc.setFontSize(9);
  doc.text(`❌ 피해야 할 것:`, margin, yPos);
  yPos += 5;
  doc.text(`   • 음식: ${monthlyTaboo.avoidFood}`, margin, yPos);
  yPos += 5;
  doc.text(`   • 색상: ${monthlyTaboo.avoidColor}`, margin, yPos);
  yPos += 5;
  doc.text(`   • 행동: ${monthlyTaboo.avoidAction}`, margin, yPos);
  yPos += 8;

  doc.text(`✅ 행운을 부르는 것:`, margin, yPos);
  yPos += 5;
  doc.text(`   • 음식: ${monthlyTaboo.luckyFood}`, margin, yPos);
  yPos += 5;
  doc.text(`   • 색상: ${monthlyTaboo.luckyColor}`, margin, yPos);
  yPos += 5;
  doc.text(`   • 방향: ${monthlyTaboo.luckyDirection}`, margin, yPos);
  yPos += 5;
  doc.text(`   • 행운 아이템: ${monthlyTaboo.luckyItem}`, margin, yPos);
  yPos += 10;

  // 부적 메시지
  doc.setFontSize(10);
  doc.text('🔯 디지털 부적', margin, yPos);
  yPos += 8;
  doc.setFontSize(9);
  const amuletLines = doc.splitTextToSize(`"${monthlyTaboo.amuletMessage}"`, contentWidth - 20);
  amuletLines.forEach((line: string) => {
    doc.text(line, pageWidth / 2, yPos, { align: 'center' });
    yPos += 5;
  });

  // ========== 올해 운영 대시보드 (Day7 추가) ==========
  doc.addPage();
  yPos = pageTopMargin;

  // 합충형파해 분석 및 리스크 타이밍 생성 (대시보드용)
  const hapchungForDashboard = analyzeHapChung(saju);
  const riskTimingForDashboard = analyzeRiskTiming(saju, targetYear);
  const yearlyDashboard = generateYearlyDashboard(saju, hapchungForDashboard, riskTimingForDashboard, targetYear);

  // 대시보드 제목
  doc.setFontSize(16);
  doc.text(`📊 ${targetYear}년 운영 대시보드`, pageWidth / 2, yPos, { align: 'center' });
  yPos += 15;

  // 올해 점수 대형 표시
  doc.setFontSize(40);
  doc.text(`${yearlyDashboard.yearScore}`, pageWidth / 2, yPos, { align: 'center' });
  yPos += 8;
  doc.setFontSize(12);
  doc.text('점 / 100점', pageWidth / 2, yPos, { align: 'center' });
  yPos += 15;

  // 점수 이유 3개
  doc.setFontSize(11);
  doc.text('📝 점수 산출 근거', margin, yPos);
  yPos += 8;
  doc.setFontSize(9);
  yearlyDashboard.scoreReasons.forEach((reason, idx) => {
    addText(`  ${idx + 1}. ${reason}`);
  });
  yPos += 8;

  // 2열 레이아웃: 기회 Top3 | 리스크 Top3
  const colWidth = (contentWidth - 10) / 2;

  // 기회 Top3 (왼쪽)
  doc.setFontSize(11);
  doc.text('🌟 기회 Top3', margin, yPos);
  doc.text('⚠️ 리스크 Top3', margin + colWidth + 10, yPos);
  yPos += 8;

  doc.setFontSize(9);
  for (let i = 0; i < 3; i++) {
    const opp = yearlyDashboard.opportunityTop3[i];
    const risk = yearlyDashboard.riskTop3[i];

    if (opp) {
      const oppText = `${i + 1}. ${opp.month}: ${opp.item}`;
      const oppLines = doc.splitTextToSize(oppText, colWidth - 5);
      oppLines.forEach((line: string) => {
        doc.text(line, margin, yPos);
        yPos += 5;
      });
    }

    if (risk) {
      const riskText = `${i + 1}. ${risk.month}: ${risk.item}`;
      const riskLines = doc.splitTextToSize(riskText, colWidth - 5);
      // 리스크는 같은 y 위치에서 오른쪽 열에 표시
      const riskY = yPos - 5 * (opp ? doc.splitTextToSize(`${i + 1}. ${opp.month}: ${opp.item}`, colWidth - 5).length : 1);
      riskLines.forEach((line: string, lineIdx: number) => {
        doc.text(line, margin + colWidth + 10, riskY + lineIdx * 5);
      });
    }
    yPos += 3;
  }
  yPos += 8;

  // 행운의 달 + 액션 아이템
  doc.setFontSize(11);
  doc.text('🍀 행운의 달 & 액션 아이템', margin, yPos);
  yPos += 8;

  doc.setFontSize(9);
  yearlyDashboard.luckyMonths.forEach(lm => {
    checkNewPage();
    addText(`  ✨ ${lm.actionItem}`);
  });
  yPos += 10;

  // ========== Top 5 액션 아이템 (연령별 맞춤) ==========
  yPos += 5;
  const top5Title = ageGroup === 'child' ? '📋 올해 부모님이 챙겨주실 5가지' : '📋 올해 꼭 실천할 5가지';
  addSubSection(top5Title);

  let top5Actions: string[];
  if (ageGroup === 'child') {
    const childTalent = yongsin?.length ? CHILD_TALENT_CATEGORIES[yongsin[0]] : null;
    top5Actions = [
      childTalent ? `${ELEMENT_KOREAN[yongsin![0]]} 기운 활용 - ${childTalent.activities[0]} 권장` : '아이의 관심사 발견하고 지지해주기',
      '규칙적인 생활 리듬 - 충분한 수면과 균형 잡힌 식사',
      '친구 관계 - 또래와 어울리는 시간 충분히 확보',
      '자연 체험 - 야외 활동으로 오행 균형 맞추기',
      '칭찬과 격려 - 작은 성취도 인정해주기'
    ];
  } else if (ageGroup === 'youth') {
    top5Actions = [
      yongsin?.length ? `${ELEMENT_KOREAN[yongsin[0]]} 기운 활용 - 집중력 향상에 도움` : '자신의 강점 발견하기',
      '학업 관리 - 효율적인 시간 관리와 집중력 강화',
      '진로 탐색 - 관심 분야 체험과 정보 수집',
      '건강 관리 - 수면과 운동 균형',
      '또래 관계 - 긍정적인 친구 관계 유지'
    ];
  } else if (ageGroup === 'senior') {
    top5Actions = [
      yongsin?.length ? `${ELEMENT_KOREAN[yongsin[0]]} 기운 활용 - ${ELEMENT_LIFE_IMPACT[yongsin[0]]?.health.tip || '건강 관리에 집중'}` : '건강 최우선으로 관리',
      '건강 검진 - 정기적인 건강 체크',
      '가족 관계 - 자녀/손주와 소통 강화',
      '자산 관리 - 안정적인 자산 운용',
      '취미 생활 - 삶의 활력 유지'
    ];
  } else {
    top5Actions = [
      yongsin?.length ? `${ELEMENT_KOREAN[yongsin[0]]} 기운 활용 - ${ELEMENT_LIFE_IMPACT[yongsin[0]]?.wealth.advice || '적극적으로 활용하세요'}` : '긍정적인 마음가짐 유지',
      '건강 관리 - 규칙적인 운동과 충분한 수면',
      '인간관계 - 소중한 사람들과 소통 강화',
      '재정 관리 - 계획적인 저축과 투자',
      '자기 계발 - 새로운 기술이나 지식 습득'
    ];
  }
  top5Actions.forEach((action, idx) => addText(`${idx + 1}. ${action}`));

  // ========== 본문 시작 ==========
  doc.addPage();
  yPos = pageTopMargin;

  // 1. 사주팔자 기본 정보
  addSectionTitle('1. 사주팔자 기본 정보');

  // 사주 구성 - 테이블 형식
  const sajuRows: string[][] = [];
  const pillars: { name: string; pillar?: SajuPillar }[] = [
    { name: '년주(年柱)', pillar: saju.year },
    { name: '월주(月柱)', pillar: saju.month },
    { name: '일주(日柱)', pillar: saju.day },
    { name: '시주(時柱)', pillar: saju.time }
  ];

  pillars.forEach(({ name, pillar }) => {
    if (pillar) {
      const elementKo = pillar.element ? ELEMENT_KOREAN[pillar.element] : '-';
      sajuRows.push([
        name,
        `${pillar.heavenlyStem}${pillar.earthlyBranch}`,
        `${pillar.stemKorean}${pillar.branchKorean}`,
        elementKo
      ]);
    }
  });

  addTable(['주(柱)', '한자', '한글', '오행'], sajuRows, {
    title: '사주 구성',
    columnWidths: [40, 35, 50, 45],
    headerColor: [59, 130, 246]
  });

  // 2. 오행 분석
  addSectionTitle('2. 오행(五行) 분석');

  // 오행 분포 - 테이블 형식
  const elements: Element[] = ['wood', 'fire', 'earth', 'metal', 'water'];
  const ohengRows: string[][] = elements.map(el => {
    const percentage = oheng[el] || 0;
    const barFilled = Math.round(percentage / 5);
    const bar = '█'.repeat(barFilled) + '░'.repeat(20 - barFilled);
    const status = percentage > 25 ? '과다' : percentage < 15 ? '부족' : '적정';
    return [ELEMENT_KOREAN[el], `${percentage.toFixed(1)}%`, bar, status];
  });

  addTable(['오행', '비율', '시각화', '상태'], ohengRows, {
    title: '오행 분포',
    columnWidths: [35, 30, 70, 35],
    headerColor: [34, 197, 94]
  });

  if (yongsin?.length || gisin?.length) {
    addSubSection('용신/기신 분석 - 나에게 필요한 기운과 주의할 기운');
    addText('용신은 사주에서 부족한 기운을 채워 균형을 잡아주는 행운의 에너지이고,');
    addText('기신은 이미 과한 기운이 더해질 때 불균형을 일으키는 에너지입니다.');
    if (yongsin?.length) {
      addText('');
      addText('★ 용신(用神) - 나에게 힘이 되는 기운');
      yongsin.forEach(e => {
        const richDesc = getElementRichDescription(e, 'yongsin');
        const detailedDesc = getElementDetailedDescription(e);
        addText(`  • ${richDesc}`);
        addText(`    ${detailedDesc}`);
        const impact = ELEMENT_LIFE_IMPACT[e];
        if (impact) {
          addText(`    ▸ 활용법: ${impact.wealth.advice}`);
        }
        // 구체적 추천
        const specifics = YONGSIN_SPECIFICS[e];
        if (specifics) {
          addText(`    ▸ 행운 색상: ${specifics.colors}`);
          addText(`    ▸ 유리한 방향: ${specifics.direction}`);
          addText(`    ▸ 추천 음식: ${specifics.foods}`);
          addText(`    ▸ 함께하면 좋은 사람: ${specifics.personTypes} (${specifics.mbtiTypes})`);
        }
      });
      // 감각 민감도
      const firstYongsin = yongsin[0];
      const senseInfo = YONGSIN_SPECIFICS[firstYongsin];
      if (senseInfo) {
        addText('');
        addText(`  ※ 민감한 감각 (${senseInfo.sense}): ${senseInfo.senseAdvice}`);
      }
    }
    if (gisin?.length) {
      addText('');
      addText('☆ 기신(忌神) - 조심해야 할 기운');
      gisin.forEach(e => {
        const richDesc = getElementRichDescription(e, 'gisin');
        addText(`  • ${richDesc}`);
        const caution = GISIN_CAUTION[e];
        if (caution) {
          addText(`    ${caution}`);
        }
      });
    }
  }

  // 오행 균형으로 가장 강한/약한 요소 찾기
  const sortedOheng = elements
    .map(e => ({ element: e, value: oheng[e] || 0 }))
    .sort((a, b) => b.value - a.value);
  const strongestEl = sortedOheng[0];
  const weakestEl = sortedOheng[sortedOheng.length - 1];

  // ========== 전통 사주 이론 분석 섹션 (고급 템플릿) ==========
  doc.addPage();
  yPos = pageTopMargin;

  // 전통 분석 실행
  const sipsinChart = analyzeSipsin(saju);
  const sipsinInterp = interpretSipsinChart(sipsinChart);
  const sinsalAnalysis = analyzeSinsal(saju);
  const unsungAnalysis = analyzeUnsung(saju);
  const hapchungAnalysis = analyzeHapChung(saju);

  addSectionTitle('전통 사주 이론 분석');

  // 십신 타입을 한글로 변환하는 헬퍼 함수
  const sipsinToKorean = (type: SipsinType): string => SIPSIN_INFO[type]?.korean || type;

  // 십신(十神) 분석
  addSubSection('십신(十神) 분석 - 사주 내 관계의 해석');
  addText('십신은 일간(나)을 기준으로 다른 천간/지지와의 관계를 나타냅니다.');
  yPos += 3;

  addText(`• 년주 십신: ${sipsinToKorean(sipsinChart.yearStem)} (천간) / ${sipsinToKorean(sipsinChart.yearBranch)} (지지)`);
  addText(`• 월주 십신: ${sipsinToKorean(sipsinChart.monthStem)} (천간) / ${sipsinToKorean(sipsinChart.monthBranch)} (지지)`);
  addText(`• 일주 십신: ${sipsinToKorean(sipsinChart.dayStem)} (천간) / ${sipsinToKorean(sipsinChart.dayBranch)} (지지)`);
  addText(`• 시주 십신: ${sipsinChart.hourStem ? sipsinToKorean(sipsinChart.hourStem) : '미상'} (천간) / ${sipsinChart.hourBranch ? sipsinToKorean(sipsinChart.hourBranch) : '미상'} (지지)`);
  yPos += 3;

  // 십신 분포
  const sipsinDistribution = Object.entries(sipsinChart.distribution)
    .filter(([_, count]) => (count as number) > 0)
    .map(([type, count]) => `${sipsinToKorean(type as SipsinType)}(${count})`);
  if (sipsinDistribution.length > 0) {
    addText(`십신 분포: ${sipsinDistribution.join(', ')}`);
  }
  yPos += 3;

  // 십신 해석
  if (sipsinInterp.dominant.length > 0) {
    addText(`★ 우세 십신: ${sipsinInterp.dominant.map(d => sipsinToKorean(d)).join(', ')}`);
  }
  if (sipsinInterp.missing.length > 0) {
    addText(`☆ 부족 십신: ${sipsinInterp.missing.map(m => sipsinToKorean(m)).join(', ')}`);
  }
  addText(`균형 상태: ${sipsinInterp.balance}`);
  addText(`성격 특성: ${sipsinInterp.personality}`);
  addText(`직업 적성: ${sipsinInterp.career}`);
  yPos += 5;

  // 12운성 분석
  addSubSection('12운성(十二運星) 분석 - 생애 에너지 주기');
  addText('12운성은 각 지지가 일간에 미치는 에너지 상태를 나타냅니다.');
  yPos += 3;

  unsungAnalysis.positions.forEach(p => {
    const energyBar = '●'.repeat(Math.round(p.info.energyLevel / 2)) + '○'.repeat(5 - Math.round(p.info.energyLevel / 2));
    addText(`• ${p.pillar} ${p.branch}: ${p.info.korean}(${p.info.hanja}) ${energyBar} - ${p.info.description}`);
  });
  yPos += 3;

  addText(`현재 생애 주기: ${unsungAnalysis.dominantStage}`);
  addText(`평균 에너지: ${unsungAnalysis.averageEnergy.toFixed(1)}/10점`);
  addText(`최고 에너지: ${unsungAnalysis.peakPosition.pillar} (${unsungAnalysis.peakPosition.info.korean})`);
  addText(`최저 에너지: ${unsungAnalysis.lowestPosition.pillar} (${unsungAnalysis.lowestPosition.info.korean})`);
  yPos += 5;

  // 신살(神殺) 분석 - 새 페이지
  doc.addPage();
  yPos = pageTopMargin;

  addSubSection('신살(神殺) 분석 - 특별한 기운의 영향');
  addText('신살은 사주에 작용하는 특별한 기운으로 길신(복)과 흉살(주의)로 나뉩니다.');
  yPos += 5;

  // 길신
  const activeGilsin = sinsalAnalysis.gilsin.filter(s => s.present).slice(0, 4);
  if (activeGilsin.length > 0) {
    addText('★ 길신(吉神) - 복을 가져다주는 기운');
    activeGilsin.forEach(s => {
      addText(`  • ${s.info.korean}(${s.info.hanja})${s.location ? ` [${s.location}]` : ''}`);
      addText(`    → ${s.info.description}`);
      addText(`    효과: ${s.info.effect}`);
    });
    yPos += 3;
  }

  // 특수살
  const activeTeuksu = sinsalAnalysis.teuksuSal.filter(s => s.present).slice(0, 3);
  if (activeTeuksu.length > 0) {
    addText('◎ 특수살(特殊殺) - 특별한 재능의 기운');
    activeTeuksu.forEach(s => {
      addText(`  • ${s.info.korean}(${s.info.hanja})${s.location ? ` [${s.location}]` : ''}`);
      addText(`    → ${s.info.description}`);
      addText(`    효과: ${s.info.effect}`);
    });
    yPos += 3;
  }

  // 흉살
  const activeHyungsal = sinsalAnalysis.hyungsal.filter(s => s.present).slice(0, 3);
  if (activeHyungsal.length > 0) {
    addText('△ 흉살(凶殺) - 주의가 필요한 기운');
    activeHyungsal.forEach(s => {
      addText(`  • ${s.info.korean}(${s.info.hanja})${s.location ? ` [${s.location}]` : ''}`);
      addText(`    → ${s.info.description}`);
      addText(`    주의: ${s.info.effect}`);
      if (s.info.remedy) {
        addText(`    해소법: ${s.info.remedy}`);
      }
    });
    yPos += 3;
  }

  addText(`신살 종합 평가: ${sinsalAnalysis.summary}`);
  if (sinsalAnalysis.advice.length > 0) {
    addText(`조언: ${sinsalAnalysis.advice.slice(0, 2).join(' ')}`);
  }
  yPos += 5;

  // 합충형파해 분석 → 관계/계약/이동 리스크 (소비자 친화적 변환)
  addSubSection('관계·계약·이동 리스크 분석');
  addText('당신의 사주에서 발견된 주요 관계 패턴과 타이밍을 분석합니다.');
  yPos += 3;

  // 조화 점수 시각화
  addText(`전반적 조화 점수: ${hapchungAnalysis.harmonyScore}점 / 100점`);
  const harmonyBar = '█'.repeat(Math.round(hapchungAnalysis.harmonyScore / 10)) + '░'.repeat(10 - Math.round(hapchungAnalysis.harmonyScore / 10));
  addText(`[${harmonyBar}]`);
  yPos += 5;

  // 소비자 친화적 리스크 변환
  const consumerRisks = transformToConsumerFriendlyRisk(hapchungAnalysis);

  // 기회·연결 (합)
  const opportunities = consumerRisks.filter(r => r.type === '기회·연결');
  if (opportunities.length > 0) {
    addText('🌟 기회·연결 (인복/협력 운)');
    opportunities.slice(0, 3).forEach(r => {
      addText(`  • ${r.description}`);
      addText(`    💡 ${r.actionTip}`);
    });
    yPos += 3;
  }

  // 변화·이동 (충)
  const changes = consumerRisks.filter(r => r.type === '변화·이동');
  if (changes.length > 0) {
    addText('🔄 변화·이동 (이직/이사 시기)');
    changes.slice(0, 2).forEach(r => {
      addText(`  • ${r.description}`);
      addText(`    ⚠️ ${r.actionTip}`);
    });
    yPos += 3;
  }

  // 스트레스·자기압박 (형)
  const stress = consumerRisks.filter(r => r.type === '스트레스·자기압박');
  if (stress.length > 0) {
    addText('⚡ 스트레스·자기압박 (번아웃 주의)');
    stress.slice(0, 2).forEach(r => {
      addText(`  • ${r.description}`);
      addText(`    🧘 ${r.actionTip}`);
    });
    yPos += 3;
  }

  // 관계 오해·계약 파손 (파/해)
  const relationRisks = consumerRisks.filter(r => r.type === '관계 오해·계약 파손');
  if (relationRisks.length > 0) {
    addText('💔 관계 오해·계약 파손 (소통/서류 주의)');
    relationRisks.slice(0, 2).forEach(r => {
      addText(`  • ${r.description}`);
      addText(`    📋 ${r.actionTip}`);
    });
    yPos += 3;
  }

  if (consumerRisks.length === 0) {
    addText('✨ 특별한 리스크 없이 안정적인 사주입니다.');
    addText('   꾸준히 기본기를 다지면 좋은 결과가 있을 것입니다.');
  }

  // 리스크 타이밍 분석 추가
  const riskTiming = analyzeRiskTiming(saju, targetYear);
  yPos += 5;

  addText('📅 올해 타이밍 분석');
  yPos += 3;

  // 관계 리스크 월 TOP2
  addText('⛔ 관계 리스크 월 TOP2:');
  riskTiming.relationshipRiskMonths.slice(0, 2).forEach((rm, idx) => {
    if (rm.month > 0) {
      const level = rm.riskLevel === 'high' ? '🔴' : rm.riskLevel === 'medium' ? '🟡' : '🟢';
      addText(`  ${idx + 1}. ${rm.monthName} ${level} - ${rm.reason}`);
      addText(`     💡 ${rm.tip}`);
    }
  });
  yPos += 3;

  // 계약/투자 주의 주간 TOP2
  addText('📋 계약/투자 주의 시기 TOP2:');
  riskTiming.contractCautionWeeks.slice(0, 2).forEach((cw, idx) => {
    if (cw.weekNumber > 0) {
      const level = cw.riskLevel === 'high' ? '🔴' : cw.riskLevel === 'medium' ? '🟡' : '🟢';
      addText(`  ${idx + 1}. ${cw.period} ${level}`);
      addText(`     💡 ${cw.tip}`);
    }
  });
  yPos += 3;

  // 기회의 달
  if (riskTiming.opportunityMonths.length > 0) {
    addText('🌟 기회의 달 (네트워킹/계약에 좋은 시기):');
    riskTiming.opportunityMonths.slice(0, 3).forEach(om => {
      addText(`  • ${om.monthName}: ${om.reason} → ${om.actionTip}`);
    });
  }

  addText(`종합: ${hapchungAnalysis.summary}`)

  // ========== 다음 섹션으로 이동 ==========
  doc.addPage();
  yPos = pageTopMargin;

  // 3. 아동용: 재능 DNA 분석 / 성인용: 건강·재물·관계 분석
  if (ageGroup === 'child') {
    addSectionTitle('3. 타고난 재능 DNA 분석');

    addSubSection(`${user.name}의 핵심 재능`);
    const primaryTalent = CHILD_TALENT_CATEGORIES[strongestEl.element];
    if (primaryTalent) {
      addText(`핵심 오행: ${ELEMENT_KOREAN[strongestEl.element]} (${strongestEl.value.toFixed(0)}%)`);
      addText(`타고난 재능: ${primaryTalent.talent}`);
      yPos += 3;

      addText('추천 활동:');
      primaryTalent.activities.forEach(act => addText(`  • ${act}`));
      yPos += 3;

      addText('추천 교육 방향:');
      primaryTalent.education.forEach(edu => addText(`  • ${edu}`));
    }
    yPos += 5;

    if (yongsin?.length) {
      const yongsinTalent = CHILD_TALENT_CATEGORIES[yongsin[0]];
      if (yongsinTalent) {
        addSubSection('보완하면 좋은 영역 (용신 기반)');
        addText(`보완 오행: ${ELEMENT_KOREAN[yongsin[0]]}`);
        addText(`발전 가능성: ${yongsinTalent.talent}`);
        addText('추천 활동:');
        yongsinTalent.activities.slice(0, 2).forEach(act => addText(`  • ${act}`));
      }
      yPos += 5;
    }

    addSubSection('부모님께 드리는 양육 팁');
    const parentTips = [
      `${user.name}은(는) ${ELEMENT_KOREAN[strongestEl.element]} 기운이 강해 ${primaryTalent?.talent || '창의성'}이 뛰어납니다.`,
      '이 아이의 장점을 인정하고 격려해주세요.',
      weakestEl.value < 10 ? `${ELEMENT_KOREAN[weakestEl.element]} 기운 보충을 위해 관련 활동을 권장합니다.` : '균형 잡힌 오행으로 다양한 활동에 적합합니다.',
      '비교보다는 개인의 성장에 집중해주세요.'
    ];
    parentTips.forEach(tip => addText(`• ${tip}`));
    yPos += 5;

  } else {
    // 성인용: 기존 건강·재물·관계 분석
    addSectionTitle(`3. ${ageLabels.title}`);

    addSubSection('건강 운세');
    addText(`${user.name}님의 건강 핵심 오행: ${ELEMENT_KOREAN[strongestEl.element]}`);
    const healthImpact = ELEMENT_LIFE_IMPACT[strongestEl.element]?.health;
    if (healthImpact) {
      addText(`관련 신체 부위: ${healthImpact.organ}`);
      addText(`주의할 점: ${healthImpact.risk}`);
      addText(`건강 팁: ${healthImpact.tip}`);
    }
    if (weakestEl.value < 10) {
      const weakHealth = ELEMENT_LIFE_IMPACT[weakestEl.element]?.health;
      if (weakHealth) {
        addText(`${ELEMENT_KOREAN[weakestEl.element]} 부족 시 주의: ${weakHealth.risk}`);
      }
    }
    yPos += 3;

    addSubSection(ageLabels.wealthLabel);
    const wealthImpact = ELEMENT_LIFE_IMPACT[strongestEl.element]?.wealth;
    if (wealthImpact) {
      if (ageGroup === 'youth') {
        addText(`학업 성향: ${wealthImpact.strength.replace('사업', '학업').replace('투자', '노력')}`);
        addText(`학습 조언: 꾸준한 노력과 계획적인 시간 관리가 중요합니다.`);
      } else if (ageGroup === 'senior') {
        addText(`자산 성향: ${wealthImpact.strength}`);
        addText(`자산 관리 조언: 안정적인 자산 보전과 가족과의 소통이 중요합니다.`);
      } else {
        addText(`재물 성향: ${wealthImpact.strength}`);
        addText(`재테크 조언: ${wealthImpact.advice}`);
      }
    }
    if (yongsin?.length) {
      const yongsinWealth = ELEMENT_LIFE_IMPACT[yongsin[0]]?.wealth;
      if (yongsinWealth) {
        addText(`용신 활용 전략: ${yongsinWealth.advice}`);
      }
    }
    yPos += 3;

    addSubSection(ageLabels.relationLabel);
    const relationImpact = ELEMENT_LIFE_IMPACT[strongestEl.element]?.relationship;
    if (relationImpact) {
      addText(`관계 스타일: ${relationImpact.style}`);
      addText(`관계 개선 팁: ${relationImpact.tip}`);
    }
    yPos += 5;
  }

  // 4. 프리미엄 콘텐츠 (있는 경우)
  if (premium) {
    // 가족 영향 분석
    if (premium.familyImpact) {
      addSectionTitle('4. 가족 관계 분석');
      const family = premium.familyImpact;

      addSubSection('가족 상황');
      addText(`배우자 스트레스: ${family.spouseStress === 'low' ? '낮음' : family.spouseStress === 'medium' ? '보통' : '높음'}`);
      addText(`자녀 영향: ${family.childrenImpact === 'positive' ? '긍정적' : family.childrenImpact === 'neutral' ? '중립' : '주의 필요'}`);
      addText(`부모 돌봄: ${family.parentCare}`);

      if (family.warnings?.length) {
        addSubSection('주의 사항');
        family.warnings.forEach(w => addText(`• ${w}`));
      }

      if (family.recommendations?.length) {
        addSubSection('권장 사항');
        family.recommendations.forEach(r => addText(`• ${r}`));
      }
    }

    // 직업 분석
    if (premium.careerAnalysis) {
      addSectionTitle('5. 직업 및 커리어 분석');
      const career = premium.careerAnalysis;

      addSubSection('현재 직업 적합도');
      if (user.careerType) {
        addText(`현재 직업: ${CAREER_KOREAN[user.careerType] || user.careerType}`);
      }
      addText(`적합도 점수: ${career.matchScore || 0}점 / 100점`);

      if (career.synergy?.length) {
        addSubSection('시너지 포인트');
        career.synergy.forEach(s => addText(`• ${s}`));
      }

      if (career.weakPoints?.length) {
        addSubSection('보완 필요 영역');
        career.weakPoints.forEach(w => addText(`• ${w}`));
      }

      if (career.solutions?.length) {
        addSubSection('해결책');
        career.solutions.forEach(s => addText(`• ${s}`));
      }

      addText(`최적 방향: ${career.optimalDirection}`);
      addText(`전환 시기: ${career.pivotTiming}`);
    }

    // 월별 액션플랜 (표 형식)
    if (premium.monthlyActionPlan?.length) {
      addSectionTitle('6. 월별 행운 액션플랜');

      // 간단한 안내
      addText('각 월의 핵심만 정리했습니다. 점수가 높을수록 기회, 낮을수록 신중함이 필요합니다.');
      yPos += 5;

      // 월별 피해야 할 것 데이터
      const MONTHLY_AVOID: Record<number, string> = {
        1: '무리한 새 프로젝트 착수',
        2: '고위험 투자/충동 결제',
        3: '과도한 약속/일정 과부하',
        4: '급격한 변화/이직 결정',
        5: '과도한 지출/인간관계 갈등',
        6: '지나친 완벽주의/번아웃',
        7: '휴식 없는 과로/건강 무시',
        8: '충동적 결정/감정적 대응',
        9: '마무리 없는 새 시작',
        10: '검증 안 된 투자/사기 주의',
        11: '급한 결정/연말 과소비',
        12: '과도한 약속/체력 무리'
      };

      // 상반기 테이블
      const firstHalf = premium.monthlyActionPlan.slice(0, 6);
      const firstHalfRows = firstHalf.map((action: MonthlyAction, index: number) => {
        const monthNum = index + 1;
        const monthAdvice = MONTHLY_UNIQUE_ADVICE[monthNum];
        const scoreEmoji = action.score >= 80 ? '🌟' : action.score >= 60 ? '✨' : '🌙';
        const mustDoAction = action.mustDo?.[0]?.action || monthAdvice?.actionTip || '기초를 다지세요';
        return [
          action.monthName,
          `${action.score}점 ${scoreEmoji}`,
          mustDoAction,
          MONTHLY_AVOID[monthNum]
        ];
      });

      addTable(['월', '점수', '✓ 해야 할 것', '✗ 피해야 할 것'], firstHalfRows, {
        title: '상반기 (1~6월)',
        columnWidths: [20, 28, (contentWidth - 48) / 2, (contentWidth - 48) / 2],
        headerColor: [168, 85, 247]
      });

      // 하반기 테이블
      const secondHalf = premium.monthlyActionPlan.slice(6);
      if (secondHalf.length > 0) {
        const secondHalfRows = secondHalf.map((action: MonthlyAction, index: number) => {
          const monthNum = index + 7;
          const monthAdvice = MONTHLY_UNIQUE_ADVICE[monthNum];
          const scoreEmoji = action.score >= 80 ? '🌟' : action.score >= 60 ? '✨' : '🌙';
          const mustDoAction = action.mustDo?.[0]?.action || monthAdvice?.actionTip || '기초를 다지세요';
          return [
            action.monthName,
            `${action.score}점 ${scoreEmoji}`,
            mustDoAction,
            MONTHLY_AVOID[monthNum]
          ];
        });

        addTable(['월', '점수', '✓ 해야 할 것', '✗ 피해야 할 것'], secondHalfRows, {
          title: '하반기 (7~12월)',
          columnWidths: [20, 28, (contentWidth - 48) / 2, (contentWidth - 48) / 2],
          headerColor: [168, 85, 247]
        });
      }

      // 행운 요소 테이블
      if (yongsin?.length) {
        const luckyPool = LUCKY_ELEMENTS_POOL[yongsin[0]];
        if (luckyPool) {
          addTable(['항목', '내용'], [
            ['행운색', luckyPool.colors.slice(0, 4).join(', ')],
            ['행운숫자', luckyPool.numbers.slice(0, 4).join(', ')],
            ['행운방향', luckyPool.directions.join(', ')],
            ['행운음식', luckyPool.foods?.slice(0, 3).join(', ') || '-']
          ], {
            title: '행운 요소 참고',
            columnWidths: [40, contentWidth - 40],
            headerColor: [251, 191, 36]
          });
        }
      }
    }

    // 인생 타임라인
    if (premium.lifeTimeline) {
      addSectionTitle('7. 인생 타임라인');

      const timeline = premium.lifeTimeline;
      addText(`현재 나이: ${timeline.currentAge}세`);

      // 인생 단계 점수 산출 공식 설명 추가
      addSubSection('📊 인생 시기별 점수 산출 기준');
      addText('기본 점수 70점에서 대운(10년 주기 운)과의 관계를 반영합니다:');
      addText('• 대운의 기운이 나의 일간을 도우면(상생) +15점');
      addText('• 대운의 기운이 나의 일간과 충돌하면(상극) -15점');
      addText('점수가 높을수록 해당 시기에 기회가 많고, 낮을수록 신중함이 필요합니다.');
      yPos += 3;

      if (timeline.phases?.length) {
        addSubSection('인생 시기별 분석');
        timeline.phases.forEach(phase => {
          addText(`[${phase.ageRange}세] ${phase.phase} (${phase.score}점)`);
          if (phase.opportunities?.length) {
            addText(`  기회: ${phase.opportunities.join(', ')}`);
          }
          if (phase.challenges?.length) {
            addText(`  도전: ${phase.challenges.join(', ')}`);
          }
        });
      }

      if (timeline.turningPoints?.length) {
        addSubSection('전환점');
        timeline.turningPoints.forEach(tp => {
          const importance = tp.importance === 'critical' ? '★★★' : tp.importance === 'important' ? '★★' : '★';
          addText(`${tp.year}년 (${tp.age}세) ${importance}: ${tp.event}`);
        });
      }

      if (timeline.goldenWindows?.length) {
        addSubSection('황금 기회의 시기');
        addText('성공률은 대운/세운 조합과 목적별 최적 시기를 종합 분석한 결과입니다.');
        yPos += 2;
        timeline.goldenWindows.forEach(gw => {
          addText(`• ${gw.period}: ${gw.purpose} (성공률 ${gw.successRate}%)`);
        });
      }
    }

    // 타이밍 분석
    if (premium.timingAnalysis) {
      addSectionTitle('8. 최적 타이밍 분석');

      const timing = premium.timingAnalysis;

      addSubSection('현재 기회의 창');
      addText(`상태: ${timing.currentWindow.isOpen ? '열림' : '닫힘'}`);
      addText(`남은 기간: ${timing.currentWindow.remainingDays}일`);
      addText(`놓칠 경우: ${timing.currentWindow.missedConsequence}`);
      addText(`회복 시간: ${timing.currentWindow.recoveryTime}`);

      addSubSection('다음 기회');
      addText(`시기: ${timing.nextOpportunity.date}`);
      addText(`확률: ${timing.nextOpportunity.probability}%`);
    }

    // 관심사별 전략 (차별화된 조언)
    if (premium.interestStrategies?.length) {
      addSectionTitle('9. 관심사별 맞춤 전략');

      // 현재 월 기준 월별 팁 제공
      const currentMonth = new Date().getMonth() + 1;

      premium.interestStrategies.forEach((strategy, strategyIdx) => {
        addSubSection(INTEREST_KOREAN[strategy.interest] || strategy.interest);
        addText(`적합도: ${strategy.sajuAlignment}점 | 최적 시기: ${strategy.timing}`);
        addText(`우선순위: ${strategy.priority}순위`);

        // 차별화된 전략 가져오기
        const specificStrategy = INTEREST_SPECIFIC_STRATEGIES[strategy.interest];

        if (specificStrategy) {
          // 관심사별 구체적인 해야 할 것
          addText('✓ 실천 항목:');
          specificStrategy.doList.forEach(item => addText(`  • ${item}`));

          // 관심사별 구체적인 피해야 할 것
          addText('✗ 주의 항목:');
          specificStrategy.dontList.forEach(item => addText(`  • ${item}`));

          // 월별 맞춤 팁 (각 관심사마다 다른 월별 조언)
          const monthlyTip = specificStrategy.monthlyTip[currentMonth];
          if (monthlyTip) {
            addText(`📅 ${currentMonth}월 팁: ${monthlyTip}`);
          }
        } else {
          // 기존 방식 fallback
          if (strategy.doList?.length) {
            addText(`해야 할 것: ${strategy.doList.join(', ')}`);
          }
          if (strategy.dontList?.length) {
            addText(`피해야 할 것: ${strategy.dontList.join(', ')}`);
          }
        }

        // 용신 기반 맞춤 조언 (관심사별로 다르게)
        if (yongsin?.length) {
          const yongsinElement = yongsin[0];
          const elementImpact = ELEMENT_LIFE_IMPACT[yongsinElement];
          if (elementImpact) {
            let specificAdvice = '';
            switch(strategy.interest) {
              case 'health':
              case 'mentalhealth':
                specificAdvice = elementImpact.health.tip;
                break;
              case 'investment':
              case 'realestate':
              case 'retirement':
                specificAdvice = elementImpact.wealth.advice;
                break;
              case 'relationship':
              case 'romance':
              case 'family':
              case 'parenting':
                specificAdvice = elementImpact.relationship.tip;
                break;
              case 'career':
              case 'study':
              case 'selfdev':
              case 'startup':
                specificAdvice = `${ELEMENT_KOREAN[yongsinElement]} 기운을 활용하면 ${elementImpact.wealth.strength}`;
                break;
              default:
                specificAdvice = strategy.specificAdvice;
            }
            addText(`💡 ${ELEMENT_KOREAN[yongsinElement]} 기운 활용: ${specificAdvice}`);
          }
        } else if (strategy.specificAdvice) {
          addText(`조언: ${strategy.specificAdvice}`);
        }

        yPos += 3;
      });
    }

    // 경영자/사업가 특화 섹션 (해당되는 경우)
    if (user.careerType && ['executive', 'business', 'entrepreneur', 'ceo', 'owner'].some(type =>
      user.careerType?.toLowerCase().includes(type))) {
      addSectionTitle('10. 경영자 특화 분석');

      const primaryElement = strongestEl.element;
      const execContent = EXECUTIVE_CONTENT[primaryElement];

      if (execContent) {
        addSubSection('리더십 스타일');
        addText(execContent.leadershipStyle);
        yPos += 2;

        addSubSection('사업 강점');
        addText(execContent.businessStrength);
        yPos += 2;

        addSubSection('리스크 관리');
        addText(`⚠️ ${execContent.riskFactor}`);
        yPos += 2;

        addSubSection('팀 관리 전략');
        addText(execContent.teamManagement);
        yPos += 2;

        addSubSection(`${targetYear}년 성장 전략`);
        addText(execContent.growthStrategy);

        // 용신 기반 추가 조언
        if (yongsin?.length) {
          const yongsinExec = EXECUTIVE_CONTENT[yongsin[0]];
          if (yongsinExec && yongsin[0] !== primaryElement) {
            yPos += 5;
            addSubSection('용신 활용 보완 전략');
            addText(`${ELEMENT_KOREAN[yongsin[0]]} 기운 활용: ${yongsinExec.growthStrategy}`);
          }
        }
      }
    }

    // ========== MBTI 연동 분석 (MBTI 정보가 있는 경우) ==========
    if (user.mbti) {
      addSectionTitle('11. MBTI × 사주 통합 분석');

      // v2.0: premium.mbtiIntegration 사용 (있으면)
      if (premium?.mbtiIntegration) {
        const mbtiData = premium.mbtiIntegration;

        addSubSection(`${mbtiData.mbti} 유형과 사주의 조화`);
        addText(`일치도: ${mbtiData.matchScore}%`);
        addText(mbtiData.isBestMatch ? '✓ 최적의 조합입니다!' : mbtiData.isChallengingMatch ? '△ 도전적이지만 성장 가능한 조합입니다.' : '○ 보완적인 조합입니다.');
        yPos += 5;

        // T/F 분기 분석
        const isThinkingType = mbtiData.mbti.includes('T');
        addSubSection(isThinkingType ? 'T(사고형) 관점 강점' : 'F(감정형) 관점 강점');
        addText(isThinkingType ? mbtiData.strengthsWithT : mbtiData.strengthsWithF);
        yPos += 3;

        addSubSection('맞춤 조언');
        addText(isThinkingType ? mbtiData.adviceForT : mbtiData.adviceForF);
        yPos += 3;

        // 통합 분석
        addSubSection('통합 분석');
        const analysisLines = doc.splitTextToSize(mbtiData.integratedAnalysis, contentWidth);
        analysisLines.forEach((line: string) => {
          checkNewPage();
          doc.text(line, margin, yPos);
          yPos += 5;
        });
        yPos += 5;

        // 발전 제안
        if (mbtiData.developmentSuggestions?.length > 0) {
          addSubSection('발전 제안');
          mbtiData.developmentSuggestions.forEach(s => addText(`• ${s}`));
        }
      } else {
        // 기존 로직 (fallback)
        const mbtiType = user.mbti.toUpperCase() as MBTIType;
        const dayMasterStr = getDayMasterKorean(saju.day?.heavenlyStem || '甲');
        const mbtiMatch = analyzeMBTISajuMatch(dayMasterStr, mbtiType);

        addSubSection(`${mbtiType} 유형과 사주의 조화`);
        addText(`일치도: ${mbtiMatch.matchScore}%`);
        addText(mbtiMatch.summary);
        yPos += 3;

        if (mbtiMatch.strengths.length > 0) {
          addSubSection('통합 강점');
          mbtiMatch.strengths.forEach(s => addText(`• ${s}`));
        }

        if (mbtiMatch.growthAreas.length > 0) {
          addSubSection('성장 영역');
          mbtiMatch.growthAreas.forEach(g => addText(`• ${g}`));
        }

        addSubSection('통합 조언');
        addText(mbtiMatch.advice);

        // MBTI와 용신 통합 분석
        if (yongsin?.length) {
          yPos += 5;
          const integratedAnalysis = generateIntegratedAnalysis(dayMasterStr, mbtiType, yongsin);
          const analysisLines = doc.splitTextToSize(integratedAnalysis, contentWidth);
          analysisLines.forEach((line: string) => {
            checkNewPage();
            doc.text(line, margin, yPos);
            yPos += 5;
          });
        }
      }
    }

    // ========== 6장 운명 카드 (v2.0) ==========
    if (premium?.destinyCards && premium.destinyCards.cards.length > 0) {
      doc.addPage();
      yPos = margin;

      addSectionTitle('12. 운명의 6장 카드');

      // 핵심 메시지
      addText(premium.destinyCards.coreMessage);
      yPos += 8;

      // 각 카드 출력
      premium.destinyCards.cards.forEach((card, idx) => {
        checkNewPage(40);
        addSubSection(`${card.typeKorean} 카드: ${card.title}`);
        addText(`상징: ${card.symbol}`);
        addText(`키워드: ${card.keywords.join(', ')}`);

        const storyLines = doc.splitTextToSize(card.story, contentWidth - 10);
        storyLines.forEach((line: string) => {
          checkNewPage();
          doc.text(line, margin + 5, yPos);
          yPos += 5;
        });

        addText(`조언: ${card.advice}`);
        yPos += 5;
      });

      // 전체 요약
      yPos += 5;
      addSubSection('카드 종합 해석');
      const summaryLines = doc.splitTextToSize(premium.destinyCards.summary, contentWidth);
      summaryLines.forEach((line: string) => {
        checkNewPage();
        doc.text(line, margin, yPos);
        yPos += 5;
      });
    }

    // ========== 오행 시적 해석 (v2.0) ==========
    if (premium?.elementPoetry) {
      doc.addPage();
      yPos = margin;

      addSectionTitle('13. 오행 관계의 시적 해석');

      // 전체 조화 분석
      addSubSection('오행의 조화');
      const harmonyLines = doc.splitTextToSize(premium.elementPoetry.overallHarmony, contentWidth);
      harmonyLines.forEach((line: string) => {
        checkNewPage();
        doc.text(line, margin, yPos);
        yPos += 5;
      });
      yPos += 5;

      // 강한 오행
      addSubSection(`강한 기운: ${premium.elementPoetry.dominantElement.korean}`);
      addText(premium.elementPoetry.dominantElement.poeticDescription);
      yPos += 3;

      // 약한 오행
      addSubSection(`보완이 필요한 기운: ${premium.elementPoetry.weakElement.korean}`);
      addText(premium.elementPoetry.weakElement.poeticDescription);
      yPos += 5;

      // 상생 관계
      if (premium.elementPoetry.generatingRelations.length > 0) {
        addSubSection('상생(相生) 관계');
        premium.elementPoetry.generatingRelations.forEach(rel => {
          addText(`${rel.relationName}: ${rel.poeticExpression}`);
          addText(`→ ${rel.advice}`);
          yPos += 3;
        });
      }

      // 상극 관계
      if (premium.elementPoetry.controllingRelations.length > 0) {
        addSubSection('상극(相剋) 관계');
        premium.elementPoetry.controllingRelations.forEach(rel => {
          addText(`${rel.relationName}: ${rel.poeticExpression}`);
          addText(`→ ${rel.advice}`);
          yPos += 3;
        });
      }
    }
  }

  // ========== 별자리(Zodiac) 분석 페이지 ==========
  doc.addPage();
  yPos = pageTopMargin;

  // 오행에서 가장 강한 요소 찾기
  const dominantElement = elements.reduce((max, el) =>
    (oheng[el] || 0) > (oheng[max] || 0) ? el : max
  , 'wood' as Element);

  // 별자리 분석 생성
  const zodiacAnalysis = generateZodiacAnalysis(user.birthDate, dominantElement, targetYear);
  const zodiacSign = zodiacAnalysis.sign;

  addSectionTitle('14. 별자리 × 사주 통합 분석');

  // 별자리 기본 정보
  addSubSection(`${zodiacSign.name} (${zodiacSign.english}) ${zodiacSign.symbol}`);
  addText(`기간: ${zodiacSign.dateRange}`);
  addText(`원소: ${zodiacSign.element} | 수호성: ${zodiacSign.ruler} | 특성: ${zodiacSign.quality}`);
  yPos += 3;

  // 성격 특성
  addSubSection('별자리 성격');
  addText(zodiacSign.personality);
  yPos += 3;

  // 강점
  addSubSection('강점');
  addText(`• ${zodiacSign.strengths.join(', ')}`);
  yPos += 3;

  // 주의할 점
  addSubSection('주의할 성향');
  addText(`• ${zodiacSign.weaknesses.join(', ')}`);
  yPos += 3;

  // 나와 잘 맞는 사람 (성격 기반 궁합)
  addSubSection('나와 잘 맞는 사람');
  const compatLines = doc.splitTextToSize(zodiacSign.compatibilityDesc, contentWidth);
  compatLines.forEach((line: string) => {
    checkNewPage();
    doc.text(line, margin, yPos);
    yPos += 5;
  });
  addText(`궁합 좋은 별자리: ${zodiacSign.compatibility.join(', ')}`);
  yPos += 3;

  // 이상적인 배우자/파트너
  addSubSection('이상적인 배우자');
  const partnerLines = doc.splitTextToSize(zodiacSign.idealPartner, contentWidth);
  partnerLines.forEach((line: string) => {
    checkNewPage();
    doc.text(line, margin, yPos);
    yPos += 5;
  });
  yPos += 3;

  // 사주와의 조화 분석
  addSubSection('별자리 × 사주 조화');
  addText(`조화도: ${zodiacAnalysis.harmony.score}점`);
  addText(zodiacAnalysis.harmony.description);
  yPos += 3;

  // 통합 인사이트
  addSubSection('통합 인사이트');
  const insightLines = doc.splitTextToSize(zodiacAnalysis.integratedInsight, contentWidth);
  insightLines.forEach((line: string) => {
    checkNewPage();
    doc.text(line, margin, yPos);
    yPos += 5;
  });
  yPos += 3;

  // 올해 운세 예측
  addSubSection(`${targetYear}년 별자리 운세`);
  addText(zodiacAnalysis.yearForecast);
  yPos += 3;

  // 행운의 요소
  addSubSection('행운의 요소');
  addText(`행운의 색: ${zodiacSign.luckyColor}`);
  addText(`행운의 숫자: ${zodiacSign.luckyNumber.join(', ')}`);
  addText(`관련 신체 부위: ${zodiacSign.bodyPart}`);
  yPos += 5;

  // 키워드
  addSubSection('핵심 키워드');
  addText(`#${zodiacSign.keywords.join(' #')}`);

  // ========== 종합 성향 분석 (혈액형+MBTI+사주+별자리) ==========
  doc.addPage();
  yPos = pageTopMargin;

  addSectionTitle('15. 나의 성향 종합 분석');

  const dayMasterStr = getDayMasterKorean(saju.day?.heavenlyStem || '甲');
  const mbtiType = user.mbti?.toUpperCase() as MBTIType | undefined;
  const bloodType = (user as any).bloodType as string | undefined;

  const comprehensiveAnalysis = generateComprehensiveAnalysis(
    dayMasterStr,
    mbtiType,
    bloodType,
    user.birthDate,
    user.name
  );

  // 핵심 요약
  addSubSection('📌 핵심 성향 요약');
  const summaryLines = doc.splitTextToSize(comprehensiveAnalysis.coreSummary, contentWidth);
  summaryLines.forEach((line: string) => {
    checkNewPage();
    doc.text(line, margin, yPos);
    yPos += 5;
  });
  yPos += 3;

  // 일관된 특성
  if (comprehensiveAnalysis.consistentTraits.length > 0) {
    addSubSection('🎯 모든 분석에서 일관되게 나타나는 특성');
    addText(`당신의 핵심 키워드: ${comprehensiveAnalysis.consistentTraits.join(', ')}`);
    addText('이 특성들은 혈액형, MBTI, 사주, 별자리 분석에서 공통적으로 확인됩니다.');
    yPos += 3;
  }

  // 개별 체계별 인사이트
  addSubSection('🔍 분석 체계별 핵심 인사이트');

  if (comprehensiveAnalysis.sajuInsight) {
    addText(`[사주 일간] ${comprehensiveAnalysis.sajuInsight}`);
  }
  if (comprehensiveAnalysis.mbtiInsight) {
    addText(`[MBTI] ${comprehensiveAnalysis.mbtiInsight}`);
  }
  if (comprehensiveAnalysis.bloodTypeInsight) {
    addText(`[혈액형] ${comprehensiveAnalysis.bloodTypeInsight}`);
  }
  if (comprehensiveAnalysis.zodiacInsight) {
    addText(`[별자리] ${comprehensiveAnalysis.zodiacInsight}`);
  }
  yPos += 3;

  // 강점 종합
  if (comprehensiveAnalysis.combinedStrengths.length > 0) {
    addSubSection('💪 종합 강점');
    comprehensiveAnalysis.combinedStrengths.forEach(s => addText(s));
    yPos += 3;
  }

  // 성장 포인트
  if (comprehensiveAnalysis.growthPoints.length > 0) {
    addSubSection('🌱 성장 포인트');
    comprehensiveAnalysis.growthPoints.forEach(p => addText(`• ${p}`));
    yPos += 3;
  }

  // 이상적인 파트너
  addSubSection('💕 이상적인 파트너');
  const partnerSummaryLines = doc.splitTextToSize(comprehensiveAnalysis.idealPartnerSummary, contentWidth);
  partnerSummaryLines.forEach((line: string) => {
    checkNewPage();
    doc.text(line, margin, yPos);
    yPos += 5;
  });
  yPos += 3;

  // 커리어 종합
  addSubSection('💼 커리어 종합');
  const careerLines = doc.splitTextToSize(comprehensiveAnalysis.careerSummary, contentWidth);
  careerLines.forEach((line: string) => {
    checkNewPage();
    doc.text(line, margin, yPos);
    yPos += 5;
  });
  yPos += 3;

  // 최종 메시지
  addSubSection('✨ 종합 메시지');
  const finalMsgLines = doc.splitTextToSize(comprehensiveAnalysis.finalMessage, contentWidth);
  finalMsgLines.forEach((line: string) => {
    checkNewPage();
    doc.text(line, margin, yPos);
    yPos += 5;
  });

  // ========== 16. 선천적/후천적 기질 분석 (차별화된 콘텐츠) ==========
  doc.addPage();
  yPos = pageTopMargin;

  const dayStemForTrait = saju.day?.heavenlyStem || '甲';
  const userZodiacSign = getZodiacSignFromBirthDate(user.birthDate);
  const traitAnalysis = generateTraitAnalysis(
    dayStemForTrait,
    mbtiType,
    bloodType,
    userZodiacSign,
    userAge
  );

  addSectionTitle('16. 선천적 기질 vs 후천적 기질');

  addSubSection('🌟 선천적 기질 (타고난 본성)');
  const innateLines = doc.splitTextToSize(
    `핵심 성격: ${traitAnalysis.innate.corePersonality}\n\n` +
    `숨겨진 잠재력: ${traitAnalysis.innate.hiddenPotential}\n\n` +
    `천부적 재능: ${traitAnalysis.innate.naturalTalent}\n\n` +
    `인생 테마: ${traitAnalysis.innate.lifeTheme}`,
    contentWidth
  );
  innateLines.forEach((line: string) => {
    checkNewPage();
    doc.text(line, margin, yPos);
    yPos += 5;
  });
  yPos += 5;

  addSubSection('🔄 후천적 기질 (환경과 학습으로 형성됨)');
  const acquiredLines = doc.splitTextToSize(
    `학습된 행동: ${traitAnalysis.acquired.learnedBehavior}\n\n` +
    `사회적 페르소나: ${traitAnalysis.acquired.socialMask}\n\n` +
    `스트레스 대응: ${traitAnalysis.acquired.copingStyle}\n\n` +
    `성장 방향: ${traitAnalysis.acquired.growthDirection}`,
    contentWidth
  );
  acquiredLines.forEach((line: string) => {
    checkNewPage();
    doc.text(line, margin, yPos);
    yPos += 5;
  });
  yPos += 5;

  addSubSection('💫 통합 인사이트');
  const synthesisLines = doc.splitTextToSize(
    `현재 상태: ${traitAnalysis.synthesis.currentState}\n\n` +
    `미래 전망: ${traitAnalysis.synthesis.futureProjection}\n\n` +
    `핵심 조언: ${traitAnalysis.synthesis.keyAdvice}`,
    contentWidth
  );
  synthesisLines.forEach((line: string) => {
    checkNewPage();
    doc.text(line, margin, yPos);
    yPos += 5;
  });

  // ========== 17. 이번 달 상세 운세 ==========
  doc.addPage();
  yPos = pageTopMargin;

  const thisMonth = new Date().getMonth() + 1;
  const monthlyFortune = generateMonthlyFortune(
    dayStemForTrait,
    yongsin?.map(y => y as string) || ['wood'],
    targetYear,
    thisMonth
  );

  addSectionTitle(`17. ${thisMonth}월 상세 운세`);

  // 베스트 데이
  addSubSection('🏆 이번 달 최고의 날');
  monthlyFortune.bestDays.forEach(bd => {
    addText(`${thisMonth}월 ${bd.day}일 - ${bd.reason}`);
    addText(`   → 추천 행동: ${bd.action}`);
  });
  yPos += 3;

  // 좋은 날
  addSubSection('✅ 좋은 날');
  monthlyFortune.goodDays.forEach(gd => {
    addText(`${thisMonth}월 ${gd.day}일 - ${gd.reason}`);
  });
  yPos += 3;

  // 피해야 할 날
  addSubSection('⚠️ 주의가 필요한 날');
  monthlyFortune.avoidDays.forEach(ad => {
    addText(`${thisMonth}월 ${ad.day}일 - ${ad.reason}`);
    addText(`   ⚡ ${ad.warning}`);
  });
  yPos += 3;

  // 로또 번호
  addSubSection('🎰 이번 달 행운의 숫자');
  addText(`행운의 숫자: ${monthlyFortune.luckyNumbers.join(', ')}`);
  addText(`로또 추천 번호: ${monthlyFortune.lottoNumbers.join(', ')}`);
  addText('* 참고용이며, 도박을 조장하지 않습니다.');
  yPos += 5;

  // 함께해야 할 사람 유형
  addSubSection('💚 이번 달 함께하면 좋은 사람');
  monthlyFortune.bestPeopleTypes.forEach(bp => {
    const bpLines = doc.splitTextToSize(`• ${bp.type}: ${bp.reason}`, contentWidth - 5);
    bpLines.forEach((line: string) => {
      checkNewPage();
      doc.text(line, margin, yPos);
      yPos += 5;
    });
  });
  yPos += 3;

  // 피해야 할 사람 유형
  addSubSection('💔 이번 달 거리를 둘 사람');
  monthlyFortune.avoidPeopleTypes.forEach(ap => {
    const apLines = doc.splitTextToSize(`• ${ap.type}: ${ap.reason}`, contentWidth - 5);
    apLines.forEach((line: string) => {
      checkNewPage();
      doc.text(line, margin, yPos);
      yPos += 5;
    });
    addText(`   → 대처법: ${ap.howToHandle}`);
  });

  // ========== 18. 5대 영역 성장 전략 ==========
  doc.addPage();
  yPos = pageTopMargin;

  const growthStrategy = generateGrowthStrategy(
    dayStemForTrait,
    yongsin?.map(y => y as string) || ['wood'],
    mbtiType,
    userAge
  );

  addSectionTitle('18. 5대 영역 성장 전략');

  addSubSection('👥 인맥 (People)');
  addText(`조언: ${growthStrategy.people.advice}`);
  addText(`실천: ${growthStrategy.people.action}`);
  yPos += 3;

  addSubSection('🍀 행운 (Luck)');
  addText(`조언: ${growthStrategy.luck.advice}`);
  addText(`실천: ${growthStrategy.luck.action}`);
  yPos += 3;

  addSubSection('💰 경제 (Economy)');
  addText(`조언: ${growthStrategy.economy.advice}`);
  addText(`실천: ${growthStrategy.economy.action}`);
  yPos += 3;

  addSubSection('❤️ 사랑 (Love)');
  addText(`조언: ${growthStrategy.love.advice}`);
  addText(`실천: ${growthStrategy.love.action}`);
  yPos += 3;

  addSubSection('🏠 환경 (Environment)');
  addText(`조언: ${growthStrategy.environment.advice}`);
  addText(`실천: ${growthStrategy.environment.action}`);
  yPos += 5;

  // 차별화 포인트
  addSubSection('✨ 우리 분석의 차별점');
  DIFFERENTIATION_POINTS.points.slice(0, 3).forEach(point => {
    addText(`기존: ${point.traditional}`);
    addText(`→ 우리: ${point.ours}`);
    yPos += 2;
  });
  addText(`\n"${DIFFERENTIATION_POINTS.closingMessage}"`);

  // ========== 19. 가족/자녀 관계 조언 ==========
  doc.addPage();
  yPos = pageTopMargin;

  const hasChildren = user.hasChildren === true;
  const familyAdvice = generateFamilyAdvice(
    dayStemForTrait,
    hasChildren,
    mbtiType
  );

  addSectionTitle('19. 가족 관계 성장 가이드');

  addSubSection('👨‍👩‍👧 부모로서의 강점');
  const parentLines = doc.splitTextToSize(familyAdvice.parentStrength, contentWidth);
  parentLines.forEach((line: string) => {
    checkNewPage();
    doc.text(line, margin, yPos);
    yPos += 5;
  });
  yPos += 3;

  addSubSection('👶 자녀 양육 방향');
  const childLines = doc.splitTextToSize(familyAdvice.childGuidance, contentWidth);
  childLines.forEach((line: string) => {
    checkNewPage();
    doc.text(line, margin, yPos);
    yPos += 5;
  });
  yPos += 3;

  addSubSection('🏡 가족 화합 팁');
  const harmonyLines = doc.splitTextToSize(familyAdvice.familyHarmony, contentWidth);
  harmonyLines.forEach((line: string) => {
    checkNewPage();
    doc.text(line, margin, yPos);
    yPos += 5;
  });
  yPos += 3;

  addSubSection('🔗 세대 간 소통');
  const intergenLines = doc.splitTextToSize(familyAdvice.intergenerational, contentWidth);
  intergenLines.forEach((line: string) => {
    checkNewPage();
    doc.text(line, margin, yPos);
    yPos += 5;
  });
  yPos += 5;

  // 업그레이드 유도
  doc.setFontSize(9);
  const upgradeLines = doc.splitTextToSize(familyAdvice.upgradeHint, contentWidth);
  upgradeLines.forEach((line: string) => {
    checkNewPage();
    doc.text(line, margin, yPos);
    yPos += 5;
  });
  doc.setFontSize(10);

  // ========== 에필로그 페이지 (60갑자 + 시적 마무리) ==========
  doc.addPage();
  yPos = pageTopMargin;

  // v2.0: premium.epilogue 또는 premium.sixtyJiazi 사용
  const epilogueText = premium?.epilogue
    || premium?.sixtyJiazi?.epilogueText
    || (jiaziInfo ? generateJiaziEpilogue(jiaziInfo, getElementKorean(saju.day?.element || 'wood')) : null);

  if (epilogueText) {
    doc.setFontSize(12);
    doc.text('✧ 에필로그 ✧', pageWidth / 2, yPos, { align: 'center' });
    yPos += 15;

    // 60갑자 정보 표시 (있는 경우)
    if (premium?.sixtyJiazi) {
      doc.setFontSize(11);
      doc.text(`${premium.sixtyJiazi.yearKorean}년 ${premium.sixtyJiazi.animalDescription}`, pageWidth / 2, yPos, { align: 'center' });
      yPos += 10;
    }

    doc.setFontSize(10);
    const epilogueLines = doc.splitTextToSize(epilogueText, contentWidth - 20);
    epilogueLines.forEach((line: string) => {
      checkNewPage();
      doc.text(line, pageWidth / 2, yPos, { align: 'center' });
      yPos += 6;
    });
    yPos += 15;
  }

  // ========== 마무리 페이지 ==========
  doc.addPage();
  yPos = 60;

  doc.setFontSize(18);
  const closingTitle = ageGroup === 'child'
    ? `${user.name} 부모님께 드리는 메시지`
    : `${user.name}님께 드리는 메시지`;
  doc.text(closingTitle, pageWidth / 2, yPos, { align: 'center' });
  yPos += 25;

  doc.setFontSize(11);

  // 연령별 개인화된 마무리 메시지
  let closingText: string[];

  if (ageGroup === 'child') {
    const childTalent = yongsin?.length ? CHILD_TALENT_CATEGORIES[yongsin[0]] : null;
    closingText = [
      `${user.name}은(는) ${ELEMENT_KOREAN[strongestEl.element]}의 기운을 타고난`,
      `${childTalent?.talent || '무한한 가능성'}을 가진 아이입니다.`,
      '',
      '아이의 타고난 기질을 이해하고 존중해주세요.',
      '비교보다는 개인의 성장 속도를 인정해주세요.',
      '작은 성취에도 충분한 칭찬과 격려를 아끼지 마세요.',
      '',
      '━━━━━━━━━━━━━━━━━━━━━━━━━━━━━',
      '',
      '부모님을 위한 성찰 질문:',
      `1. ${user.name}의 가장 빛나는 순간은 언제인가요?`,
      '2. 아이의 관심사를 어떻게 지지해줄 수 있을까요?',
      '3. 오늘 아이에게 해주고 싶은 칭찬은 무엇인가요?',
      '',
      '━━━━━━━━━━━━━━━━━━━━━━━━━━━━━',
    ];
  } else if (ageGroup === 'youth') {
    closingText = [
      yongsin?.length
        ? `${user.name}님, ${targetYear}년은 ${ELEMENT_KOREAN[yongsin[0]]}의 기운을 활용해 꿈에 한 걸음 다가갈 수 있는 해입니다.`
        : `${user.name}님, ${targetYear}년은 자신의 길을 찾아가는 중요한 해입니다.`,
      '',
      '지금 하는 모든 노력은 미래의 자산이 됩니다.',
      '조급해하지 말고, 자신만의 속도로 나아가세요.',
      '실패는 성장의 밑거름입니다.',
      '',
      '━━━━━━━━━━━━━━━━━━━━━━━━━━━━━',
      '',
      '자기 성찰 질문:',
      `1. ${targetYear}년 가장 도전해보고 싶은 것은?`,
      '2. 나의 강점을 어떻게 활용할 수 있을까?',
      '3. 10년 후 나는 어떤 모습이길 바라는가?',
      '',
      '━━━━━━━━━━━━━━━━━━━━━━━━━━━━━',
    ];
  } else {
    const personalizedClosing = yongsin?.length
      ? `${user.name}님의 ${targetYear}년은 ${ELEMENT_KOREAN[yongsin[0]]}의 기운을 잘 활용하면 큰 성과를 거둘 수 있는 해입니다.`
      : `${user.name}님의 ${targetYear}년은 새로운 가능성이 열리는 해입니다.`;

    closingText = [
      personalizedClosing,
      '',
      '사주는 운명의 청사진이지만, 그것을 어떻게 활용하느냐는',
      '전적으로 당신의 선택에 달려 있습니다.',
      '',
      '이 리포트가 당신의 한 해를 계획하고',
      '더 나은 결정을 내리는 데 도움이 되길 바랍니다.',
      '',
      '━━━━━━━━━━━━━━━━━━━━━━━━━━━━━',
      '',
      '자기 성찰 질문:',
      `1. ${targetYear}년 가장 이루고 싶은 목표는 무엇인가요?`,
      '2. 용신의 기운을 어떻게 일상에서 활용할 수 있을까요?',
      '3. 도전 과제를 극복하기 위해 어떤 노력을 할 수 있을까요?',
      '',
      '━━━━━━━━━━━━━━━━━━━━━━━━━━━━━',
    ];
  }

  closingText.forEach(line => {
    doc.text(line, pageWidth / 2, yPos, { align: 'center' });
    yPos += 8;
  });

  yPos += 10;
  doc.setFontSize(10);
  doc.text(`분석 생성일: ${new Date().toLocaleDateString('ko-KR')}`, pageWidth / 2, yPos, { align: 'center' });
  yPos += 15;
  doc.setFontSize(12);
  doc.text('AI-PLANX Premium Service', pageWidth / 2, yPos, { align: 'center' });
  yPos += 8;
  doc.setFontSize(10);
  doc.text('Your Fortune, Your Choice', pageWidth / 2, yPos, { align: 'center' });

  // PDF를 Buffer로 반환
  const pdfOutput = doc.output('arraybuffer');
  return Buffer.from(pdfOutput);
}

/**
 * PDF 파일명 생성
 */
export function generatePDFFilename(user: UserInput, targetYear: number = 2026): string {
  const date = new Date().toISOString().split('T')[0];
  const safeName = user.name.replace(/[^가-힣a-zA-Z0-9]/g, '');
  return `사주분석_${safeName}_${targetYear}년_${date}.pdf`;
}

/**
 * PDF 문서 섹션 데이터 생성 (텍스트 변환용)
 */
export function generatePDFSections(options: PDFGeneratorOptions): PDFSection[] {
  const { user, saju, oheng, yongsin, gisin, premium, targetYear = 2026 } = options;
  const sections: PDFSection[] = [];

  // 기본 정보
  sections.push({
    title: '기본 정보',
    content: [
      `성명: ${user.name}`,
      `생년월일: ${user.birthDate}`,
      `출생시간: ${user.birthTime || '미상'}`,
      `성별: ${user.gender === 'male' ? '남성' : '여성'}`
    ]
  });

  // 사주 구성
  const sajuContent: string[] = [];
  if (saju.year) sajuContent.push(`년주: ${saju.year.heavenlyStem}${saju.year.earthlyBranch}`);
  if (saju.month) sajuContent.push(`월주: ${saju.month.heavenlyStem}${saju.month.earthlyBranch}`);
  if (saju.day) sajuContent.push(`일주: ${saju.day.heavenlyStem}${saju.day.earthlyBranch}`);
  if (saju.time) sajuContent.push(`시주: ${saju.time.heavenlyStem}${saju.time.earthlyBranch}`);
  sections.push({ title: '사주팔자', content: sajuContent });

  // 오행 분석
  const ohengContent = [
    `목(木): ${oheng.wood?.toFixed(1) || 0}%`,
    `화(火): ${oheng.fire?.toFixed(1) || 0}%`,
    `토(土): ${oheng.earth?.toFixed(1) || 0}%`,
    `금(金): ${oheng.metal?.toFixed(1) || 0}%`,
    `수(水): ${oheng.water?.toFixed(1) || 0}%`
  ];

  if (yongsin?.length) {
    ohengContent.push(`용신(힘이 되는 기운): ${yongsin.map(e => getElementRichDescription(e, 'display')).join(', ')}`);
  }
  if (gisin?.length) {
    ohengContent.push(`기신(주의할 기운): ${gisin.map(e => getElementRichDescription(e, 'display')).join(', ')}`);
  }
  sections.push({ title: '오행 분석', content: ohengContent });

  // 프리미엄 콘텐츠 섹션들...
  if (premium?.monthlyActionPlan?.length) {
    const monthlyContent = premium.monthlyActionPlan.map((m: MonthlyAction) =>
      `${m.monthName}: ${m.mustDo?.map(d => d.action).join(', ') || ''}`
    );
    sections.push({ title: `${targetYear}년 월별 운세`, content: monthlyContent });
  }

  return sections;
}

export default {
  generateSajuPDF,
  generatePDFFilename,
  generatePDFSections
};
