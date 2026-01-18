/**
 * 사주 분석 결과 PDF 생성기
 *
 * 서버 사이드에서 PDF 문서를 생성합니다.
 * @jspdf 라이브러리 사용 (한글 폰트 지원)
 */

import { jsPDF } from 'jspdf';
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

// ========== 연령별 분기 시스템 ==========
type AgeGroup = 'child' | 'youth' | 'adult' | 'senior';

function getAgeGroup(birthDate: string, targetYear: number = new Date().getFullYear()): { group: AgeGroup; age: number } {
  const birth = new Date(birthDate);

  // 정확한 만 나이 계산 (목표 연도 말 기준 - 그 해에 도달하는 나이)
  // 예: 1978년생 → 2026년 = 48세 (2026 - 1978 = 48)
  const age = targetYear - birth.getFullYear();

  if (age <= 12) return { group: 'child', age };
  if (age <= 22) return { group: 'youth', age };
  if (age <= 45) return { group: 'adult', age };
  return { group: 'senior', age };
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
    highlights.push(`용신 ${yongsin.map(e => ELEMENT_KOREAN[e]).join(', ')}의 기운을 활용하면 운세 상승`);
  }

  // 오행 균형 분석
  const elements: Element[] = ['wood', 'fire', 'earth', 'metal', 'water'];
  const sortedElements = elements
    .map(e => ({ element: e, value: oheng[e] || 0 }))
    .sort((a, b) => b.value - a.value);

  const strongestElement = sortedElements[0];
  const weakestElement = sortedElements[sortedElements.length - 1];

  if (strongestElement.value > 30) {
    highlights.push(`${ELEMENT_KOREAN[strongestElement.element]}(${strongestElement.value.toFixed(0)}%)의 강한 기운이 핵심 동력`);
  }

  if (weakestElement.value < 10) {
    challenges.push(`${ELEMENT_KOREAN[weakestElement.element]} 기운 부족으로 관련 영역 보완 필요`);
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

  let yPos = 20;
  const pageWidth = 210;
  const pageHeight = 297;
  const margin = 20;
  const contentWidth = pageWidth - margin * 2;
  const lineHeight = 7;

  // 헬퍼 함수: 줄바꿈 체크 및 페이지 추가
  const checkNewPage = (height: number = lineHeight) => {
    if (yPos + height > pageHeight - margin) {
      doc.addPage();
      yPos = margin;
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
  doc.text('AI-SAJU Premium Service', pageWidth / 2, 260, { align: 'center' });

  // ========== Executive Summary ==========
  doc.addPage();
  yPos = margin;

  const summary = generateYearSummary(oheng, yongsin, premium);

  addSectionTitle(`${targetYear}년 운세 핵심 요약`);

  // 전체 점수 표시
  addSubSection(`${user.name}님의 ${targetYear}년 종합 운세`);
  const scoreBar = '★'.repeat(Math.round(summary.overallScore / 20)) + '☆'.repeat(5 - Math.round(summary.overallScore / 20));
  addText(`종합 점수: ${summary.overallScore}점 ${scoreBar}`);
  yPos += 5;

  // 행운의 달
  if (summary.luckyMonths.length > 0) {
    addText(`행운의 달: ${summary.luckyMonths.map(m => m + '월').join(', ')}`);
    yPos += 3;
  }

  // 핵심 하이라이트
  if (summary.highlights.length > 0) {
    addSubSection('올해의 기회');
    summary.highlights.forEach(h => addText(`✓ ${h}`));
    yPos += 3;
  }

  // 도전 과제
  if (summary.challenges.length > 0) {
    addSubSection('주의할 점');
    summary.challenges.forEach(c => addText(`△ ${c}`));
    yPos += 3;
  }

  // Top 5 액션 아이템 (연령별 맞춤)
  const top5Title = ageGroup === 'child' ? '올해 부모님이 챙겨주실 5가지' : '올해 꼭 실천할 5가지';
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
  yPos = margin;

  // 1. 사주팔자 기본 정보
  addSectionTitle('1. 사주팔자 기본 정보');

  addSubSection('사주 구성');
  const pillars: { name: string; pillar?: SajuPillar }[] = [
    { name: '년주(年柱)', pillar: saju.year },
    { name: '월주(月柱)', pillar: saju.month },
    { name: '일주(日柱)', pillar: saju.day },
    { name: '시주(時柱)', pillar: saju.time }
  ];

  pillars.forEach(({ name, pillar }) => {
    if (pillar) {
      const elementKo = pillar.element ? ELEMENT_KOREAN[pillar.element] : '';
      addText(`${name}: ${pillar.heavenlyStem}${pillar.earthlyBranch} (${pillar.stemKorean}${pillar.branchKorean}) - ${elementKo}`);
    }
  });

  // 2. 오행 분석
  addSectionTitle('2. 오행(五行) 분석');

  addSubSection('오행 분포');
  const elements: Element[] = ['wood', 'fire', 'earth', 'metal', 'water'];
  elements.forEach(el => {
    const percentage = oheng[el] || 0;
    const barFilled = Math.round(percentage / 5);
    const bar = '█'.repeat(barFilled) + '░'.repeat(20 - barFilled);
    addText(`${ELEMENT_KOREAN[el]}: ${bar} ${percentage.toFixed(1)}%`);
  });

  if (yongsin?.length || gisin?.length) {
    addSubSection('용신/기신 분석');
    if (yongsin?.length) {
      addText(`용신(用神): ${yongsin.map(e => ELEMENT_KOREAN[e]).join(', ')}`);
      addText('- 용신은 당신의 사주에서 부족하거나 필요한 기운입니다.');
      addText('- 이 오행과 관련된 색상, 방향, 활동을 활용하면 운이 상승합니다.');
      yongsin.forEach(e => {
        const impact = ELEMENT_LIFE_IMPACT[e];
        if (impact) {
          addText(`  ▸ ${ELEMENT_KOREAN[e]} 활용법: ${impact.wealth.advice}`);
        }
      });
    }
    if (gisin?.length) {
      addText(`기신(忌神): ${gisin.map(e => ELEMENT_KOREAN[e]).join(', ')}`);
      addText('- 기신은 사주에 이미 과한 기운으로, 피하면 균형을 유지할 수 있습니다.');
    }
  }

  // 오행 균형으로 가장 강한/약한 요소 찾기
  const sortedOheng = elements
    .map(e => ({ element: e, value: oheng[e] || 0 }))
    .sort((a, b) => b.value - a.value);
  const strongestEl = sortedOheng[0];
  const weakestEl = sortedOheng[sortedOheng.length - 1];

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

    // 월별 액션플랜
    if (premium.monthlyActionPlan?.length) {
      addSectionTitle('6. 월별 행운 액션플랜');

      premium.monthlyActionPlan.forEach((action: MonthlyAction, index: number) => {
        const monthNum = index + 1;
        const monthAdvice = MONTHLY_UNIQUE_ADVICE[monthNum];

        checkNewPage(50);
        addSubSection(`${action.monthName} - ${monthAdvice?.theme || ''} (점수: ${action.score}점)`);

        // 스토리텔링 문구 추가 (연령별 맞춤)
        const story = generateMonthlyStory(monthNum, action.score, yongsin, user.name, ageGroup);
        if (story) {
          addText(story);
          yPos += 3;
        }

        // 이달의 핵심 조언 (연령별 맞춤)
        if (monthAdvice?.actionTip) {
          const tipLabel = ageGroup === 'child' ? '부모님 팁' : '이달의 핵심';
          addText(`💡 ${tipLabel}: ${monthAdvice.actionTip}`);
          yPos += 2;
        }

        if (action.mustDo?.length) {
          const doLabel = ageGroup === 'child' ? '추천 활동:' : '▸ 실천 항목:';
          addText(doLabel);
          action.mustDo.forEach(item => {
            // 아동용: 부적절한 카테고리 필터링
            if (ageGroup === 'child' && ['재테크', '부동산', '투자', '사업'].includes(item.category)) {
              return; // 아동에게 부적절한 항목 스킵
            }
            addText(`  • [${item.category}] ${item.action}`);
            if (item.optimalDays?.length) {
              addText(`    추천일: ${item.optimalDays.join(', ')}일 / 시간: ${item.optimalTime}`);
            }
          });
        }

        // 월별 맥락화된 주의사항 (반복 방지)
        const contextWarning = MONTHLY_CONTEXTUALIZED_WARNINGS[monthNum];
        if (contextWarning) {
          // 용신이 수(水)인 경우 수 기운 관련 맥락화된 조언
          if (yongsin?.includes('water')) {
            addText(`▸ 이달의 조언: ${contextWarning.water}`);
          } else {
            addText(`▸ 이달의 조언: ${contextWarning.general}`);
          }
        }

        // 행운 요소 다양화 (용신 기반 + 월별 변화)
        if (yongsin?.length) {
          const luckyPool = LUCKY_ELEMENTS_POOL[yongsin[0]];
          if (luckyPool) {
            const colorIdx = (monthNum - 1) % luckyPool.colors.length;
            const numberIdx = (monthNum - 1) % luckyPool.numbers.length;
            const dirIdx = (monthNum - 1) % luckyPool.directions.length;
            const foodIdx = (monthNum - 1) % luckyPool.foods.length;
            addText(`▸ 행운 요소: 색상(${luckyPool.colors[colorIdx]}) | 숫자(${luckyPool.numbers[numberIdx]}) | 방향(${luckyPool.directions[dirIdx]})`);
            if (ageGroup === 'child') {
              addText(`▸ 추천 음식: ${luckyPool.foods[foodIdx]}`);
            }
          }
        } else if (action.luckyElements) {
          addText(`▸ 행운 요소: 색상(${action.luckyElements.color}) | 숫자(${action.luckyElements.number}) | 방향(${action.luckyElements.direction})`);
        }

        yPos += 5;
      });
    }

    // 인생 타임라인
    if (premium.lifeTimeline) {
      addSectionTitle('7. 인생 타임라인');

      const timeline = premium.lifeTimeline;
      addText(`현재 나이: ${timeline.currentAge}세`);

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
  doc.text('AI-SAJU Premium Service', pageWidth / 2, yPos, { align: 'center' });
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
    ohengContent.push(`용신: ${yongsin.map(e => ELEMENT_KOREAN[e]).join(', ')}`);
  }
  if (gisin?.length) {
    ohengContent.push(`기신: ${gisin.map(e => ELEMENT_KOREAN[e]).join(', ')}`);
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
