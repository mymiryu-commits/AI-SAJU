/**
 * 신살(神殺) 분석 모듈
 *
 * 신살은 사주에서 특별한 영향을 미치는 별(신)과 살(殺)을 의미합니다.
 * 길신(吉神)은 좋은 영향, 흉살(凶殺)은 주의가 필요한 영향을 줍니다.
 */

import type { SajuChart } from '@/types/saju';

export type SinsalType =
  // 길신 (吉神)
  | 'cheoneuigwiin'  // 천을귀인 (天乙貴人)
  | 'munchanggwisin' // 문창귀인 (文昌貴人)
  | 'taegeuggwisin'  // 태극귀인 (太極貴人)
  | 'cheondeoggwisin' // 천덕귀인 (天德貴人)
  | 'woldeogghwisin' // 월덕귀인 (月德貴人)
  | 'geummyeo'       // 금여 (金輿)
  | 'nokma'          // 녹마 (祿馬)
  // 특수살
  | 'yeokmasal'      // 역마살 (驛馬殺)
  | 'dohwasal'       // 도화살 (桃花殺)
  | 'hwagaesal'      // 화개살 (華蓋殺)
  | 'gongmang'       // 공망 (空亡)
  | 'yanginyeok'     // 양인역 (羊刃逆)
  | 'baekhosal'      // 백호살 (白虎殺)
  | 'gwanssal'       // 관살 (官殺)
  | 'wongjin'        // 원진 (怨嗔)
  | 'gyeokgak';      // 격각 (隔角)

export interface SinsalInfo {
  type: SinsalType;
  korean: string;
  hanja: string;
  category: '길신' | '특수살' | '흉살';
  description: string;
  effect: string;
  activation: string;
  remedy?: string;
}

// 신살 정보
export const SINSAL_INFO: Record<SinsalType, SinsalInfo> = {
  cheoneuigwiin: {
    type: 'cheoneuigwiin',
    korean: '천을귀인',
    hanja: '天乙貴人',
    category: '길신',
    description: '하늘이 보내준 귀한 사람',
    effect: '위기 시 귀인의 도움을 받음. 인덕이 있고 사회적 지위 상승',
    activation: '관직, 사업, 중요한 일에서 도움을 받음'
  },
  munchanggwisin: {
    type: 'munchanggwisin',
    korean: '문창귀인',
    hanja: '文昌貴人',
    category: '길신',
    description: '학문의 별',
    effect: '학업 능력이 뛰어나고 문서 운이 좋음. 시험, 계약에 유리',
    activation: '공부, 시험, 자격증, 문서 관련 일'
  },
  taegeuggwisin: {
    type: 'taegeuggwisin',
    korean: '태극귀인',
    hanja: '太極貴人',
    category: '길신',
    description: '최고의 귀인',
    effect: '큰 행운과 보호. 위기에서 벗어남',
    activation: '인생의 중요한 전환점에서 발현'
  },
  cheondeoggwisin: {
    type: 'cheondeoggwisin',
    korean: '천덕귀인',
    hanja: '天德貴人',
    category: '길신',
    description: '하늘의 덕을 받은 귀인',
    effect: '재난을 피하고 복을 받음. 인품이 좋음',
    activation: '어려운 상황에서 자연스럽게 해결됨'
  },
  woldeogghwisin: {
    type: 'woldeogghwisin',
    korean: '월덕귀인',
    hanja: '月德貴人',
    category: '길신',
    description: '달의 덕을 받은 귀인',
    effect: '매월 특정 시기에 운이 좋음. 평화로운 삶',
    activation: '월별로 길한 시기가 있음'
  },
  geummyeo: {
    type: 'geummyeo',
    korean: '금여',
    hanja: '金輿',
    category: '길신',
    description: '황금 수레',
    effect: '재물운과 이동운이 좋음. 귀한 대접을 받음',
    activation: '이동, 여행, 이사 시 좋은 일이 생김'
  },
  nokma: {
    type: 'nokma',
    korean: '녹마',
    hanja: '祿馬',
    category: '길신',
    description: '녹봉과 말',
    effect: '재물과 명예를 얻음. 승진, 진급에 유리',
    activation: '직장, 사업에서 발전의 기회'
  },
  yeokmasal: {
    type: 'yeokmasal',
    korean: '역마살',
    hanja: '驛馬殺',
    category: '특수살',
    description: '역참의 말',
    effect: '이동이 많고 변화가 많음. 해외 인연, 출장 多',
    activation: '여행, 이사, 해외 관련 일에 영향',
    remedy: '한 곳에 정착하려는 노력 필요'
  },
  dohwasal: {
    type: 'dohwasal',
    korean: '도화살',
    hanja: '桃花殺',
    category: '특수살',
    description: '복숭아꽃의 살',
    effect: '이성에게 매력적. 연예인 기질. 다만 바람기 주의',
    activation: '연애, 예술, 대인관계에서 발현',
    remedy: '적절한 절제와 분별력 필요'
  },
  hwagaesal: {
    type: 'hwagaesal',
    korean: '화개살',
    hanja: '華蓋殺',
    category: '특수살',
    description: '꽃으로 덮인 덮개',
    effect: '예술, 종교, 철학에 관심. 고독하지만 깊은 내면',
    activation: '예술 활동, 종교 활동, 수행에 적합',
    remedy: '고독을 창조적으로 승화'
  },
  gongmang: {
    type: 'gongmang',
    korean: '공망',
    hanja: '空亡',
    category: '흉살',
    description: '비어서 망함',
    effect: '해당 영역이 비어 있어 실속이 없을 수 있음',
    activation: '특정 분야에서 허탕, 공허함 경험',
    remedy: '실질적인 준비와 노력으로 극복'
  },
  yanginyeok: {
    type: 'yanginyeok',
    korean: '양인',
    hanja: '羊刃',
    category: '특수살',
    description: '양의 칼날',
    effect: '강한 기운. 결단력 있지만 사고 주의',
    activation: '급박한 상황, 경쟁에서 발현',
    remedy: '신중함과 인내 필요'
  },
  baekhosal: {
    type: 'baekhosal',
    korean: '백호살',
    hanja: '白虎殺',
    category: '흉살',
    description: '흰 호랑이의 살기',
    effect: '사고, 수술, 피를 볼 일 주의',
    activation: '건강, 안전 관련 상황',
    remedy: '건강 관리, 안전 주의'
  },
  gwanssal: {
    type: 'gwanssal',
    korean: '관살',
    hanja: '官殺',
    category: '특수살',
    description: '관의 살',
    effect: '법적 문제, 관재구설 주의. 다만 통제력 상승',
    activation: '법적 분쟁, 관공서 일',
    remedy: '법률 전문가 상담, 조심스러운 행동'
  },
  wongjin: {
    type: 'wongjin',
    korean: '원진',
    hanja: '怨嗔',
    category: '흉살',
    description: '원한과 분노',
    effect: '특정인과의 갈등, 원한 관계 주의',
    activation: '인간관계 갈등',
    remedy: '화해와 용서의 노력'
  },
  gyeokgak: {
    type: 'gyeokgak',
    korean: '격각',
    hanja: '隔角',
    category: '흉살',
    description: '떨어진 모서리',
    effect: '부모, 배우자와의 이별운 주의',
    activation: '가족 관계',
    remedy: '관계 개선 노력, 소통'
  }
};

// 천을귀인 조견표 (일간 기준)
const CHEONEUIGWIIN_TABLE: Record<string, string[]> = {
  '甲': ['丑', '未'],
  '乙': ['子', '申'],
  '丙': ['亥', '酉'],
  '丁': ['亥', '酉'],
  '戊': ['丑', '未'],
  '己': ['子', '申'],
  '庚': ['丑', '未'],
  '辛': ['寅', '午'],
  '壬': ['卯', '巳'],
  '癸': ['卯', '巳']
};

// 역마살 조견표 (일지/연지 기준)
const YEOKMASAL_TABLE: Record<string, string> = {
  '寅': '申', '午': '申', '戌': '申',  // 인오술 → 신
  '申': '寅', '子': '寅', '辰': '寅',  // 신자진 → 인
  '巳': '亥', '酉': '亥', '丑': '亥',  // 사유축 → 해
  '亥': '巳', '卯': '巳', '未': '巳'   // 해묘미 → 사
};

// 도화살 조견표 (일지/연지 기준)
const DOHWASAL_TABLE: Record<string, string> = {
  '寅': '卯', '午': '卯', '戌': '卯',  // 인오술 → 묘
  '申': '酉', '子': '酉', '辰': '酉',  // 신자진 → 유
  '巳': '午', '酉': '午', '丑': '午',  // 사유축 → 오
  '亥': '子', '卯': '子', '未': '子'   // 해묘미 → 자
};

// 화개살 조견표 (일지/연지 기준)
const HWAGAESAL_TABLE: Record<string, string> = {
  '寅': '戌', '午': '戌', '戌': '戌',  // 인오술 → 술
  '申': '辰', '子': '辰', '辰': '辰',  // 신자진 → 진
  '巳': '丑', '酉': '丑', '丑': '丑',  // 사유축 → 축
  '亥': '未', '卯': '未', '未': '未'   // 해묘미 → 미
};

export interface SinsalResult {
  type: SinsalType;
  present: boolean;
  location?: string;  // 어느 주에 있는지
  info: SinsalInfo;
}

export interface SinsalAnalysis {
  gilsin: SinsalResult[];    // 길신
  teuksuSal: SinsalResult[]; // 특수살
  hyungsal: SinsalResult[];  // 흉살
  summary: string;
  advice: string[];
}

/**
 * 신살 분석 실행
 */
export function analyzeSinsal(saju: SajuChart): SinsalAnalysis {
  const dayMaster = saju.day.heavenlyStem;
  const dayBranch = saju.day.earthlyBranch;
  const yearBranch = saju.year.earthlyBranch;

  const allBranches = [
    { branch: saju.year.earthlyBranch, location: '년지' },
    { branch: saju.month.earthlyBranch, location: '월지' },
    { branch: saju.day.earthlyBranch, location: '일지' },
    ...(saju.time ? [{ branch: saju.time.earthlyBranch, location: '시지' }] : [])
  ];

  const results: SinsalResult[] = [];

  // 1. 천을귀인 체크
  const gwiin = CHEONEUIGWIIN_TABLE[dayMaster] || [];
  allBranches.forEach(({ branch, location }) => {
    if (gwiin.includes(branch)) {
      results.push({
        type: 'cheoneuigwiin',
        present: true,
        location,
        info: SINSAL_INFO.cheoneuigwiin
      });
    }
  });

  // 2. 역마살 체크
  const yeokmaTarget = YEOKMASAL_TABLE[dayBranch] || YEOKMASAL_TABLE[yearBranch];
  if (yeokmaTarget) {
    allBranches.forEach(({ branch, location }) => {
      if (branch === yeokmaTarget) {
        results.push({
          type: 'yeokmasal',
          present: true,
          location,
          info: SINSAL_INFO.yeokmasal
        });
      }
    });
  }

  // 3. 도화살 체크
  const dohwaTarget = DOHWASAL_TABLE[dayBranch] || DOHWASAL_TABLE[yearBranch];
  if (dohwaTarget) {
    allBranches.forEach(({ branch, location }) => {
      if (branch === dohwaTarget) {
        results.push({
          type: 'dohwasal',
          present: true,
          location,
          info: SINSAL_INFO.dohwasal
        });
      }
    });
  }

  // 4. 화개살 체크
  const hwagaeTarget = HWAGAESAL_TABLE[dayBranch] || HWAGAESAL_TABLE[yearBranch];
  if (hwagaeTarget) {
    allBranches.forEach(({ branch, location }) => {
      if (branch === hwagaeTarget) {
        results.push({
          type: 'hwagaesal',
          present: true,
          location,
          info: SINSAL_INFO.hwagaesal
        });
      }
    });
  }

  // 분류
  const gilsin = results.filter(r => r.info.category === '길신');
  const teuksuSal = results.filter(r => r.info.category === '특수살');
  const hyungsal = results.filter(r => r.info.category === '흉살');

  // 없는 신살도 체크용으로 추가
  const checkNotPresent = (type: SinsalType): SinsalResult => ({
    type,
    present: false,
    info: SINSAL_INFO[type]
  });

  // 요약 생성
  let summary = '';
  if (gilsin.length > 0) {
    summary += `귀인(貴人)의 기운이 있어 어려울 때 도움을 받습니다. `;
  }
  if (teuksuSal.some(s => s.type === 'yeokmasal')) {
    summary += `역마살로 인해 이동과 변화가 많습니다. `;
  }
  if (teuksuSal.some(s => s.type === 'dohwasal')) {
    summary += `도화살로 이성에게 인기가 있습니다. `;
  }
  if (teuksuSal.some(s => s.type === 'hwagaesal')) {
    summary += `화개살로 예술/종교적 기질이 있습니다. `;
  }
  if (summary === '') {
    summary = '특별히 강한 신살이 없어 안정적인 사주입니다.';
  }

  // 조언 생성
  const advice: string[] = [];
  gilsin.forEach(g => {
    advice.push(`✨ ${g.info.korean}: ${g.info.activation}`);
  });
  teuksuSal.forEach(s => {
    if (s.info.remedy) {
      advice.push(`⚡ ${s.info.korean}: ${s.info.remedy}`);
    }
  });
  hyungsal.forEach(h => {
    if (h.info.remedy) {
      advice.push(`⚠️ ${h.info.korean}: ${h.info.remedy}`);
    }
  });

  return {
    gilsin,
    teuksuSal,
    hyungsal,
    summary,
    advice
  };
}

export default {
  SINSAL_INFO,
  analyzeSinsal
};
