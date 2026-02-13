/**
 * 합충형파해(合沖刑破害) 분석 모듈
 *
 * 지지(地支) 간의 관계를 분석합니다:
 * - 합(合): 두 지지가 합쳐져 새로운 기운 생성 (육합, 삼합, 방합)
 * - 충(沖): 두 지지가 충돌하여 변화/갈등 발생
 * - 형(刑): 지지 간의 형벌, 고통과 시련
 * - 파(破): 깨지고 파괴됨
 * - 해(害): 서로 해를 끼침, 방해
 */

import type { SajuChart } from '@/types/saju';

export type RelationType = '육합' | '삼합' | '방합' | '충' | '형' | '파' | '해';

export interface BranchRelation {
  type: RelationType;
  branches: string[];
  positions: string[];  // 어느 주에 있는지
  result?: string;      // 합의 결과 오행
  effect: string;
  isPositive: boolean;
}

// 육합(六合) - 12지지 중 2개가 합하여 새로운 오행 생성
const YUKAP_TABLE: Record<string, { partner: string; result: string }> = {
  '子': { partner: '丑', result: '土' },  // 자축합토
  '丑': { partner: '子', result: '土' },
  '寅': { partner: '亥', result: '木' },  // 인해합목
  '亥': { partner: '寅', result: '木' },
  '卯': { partner: '戌', result: '火' },  // 묘술합화
  '戌': { partner: '卯', result: '火' },
  '辰': { partner: '酉', result: '金' },  // 진유합금
  '酉': { partner: '辰', result: '金' },
  '巳': { partner: '申', result: '水' },  // 사신합수
  '申': { partner: '巳', result: '水' },
  '午': { partner: '未', result: '土' },  // 오미합토 (또는 火)
  '未': { partner: '午', result: '土' }
};

// 삼합(三合) - 3개의 지지가 모여 하나의 오행 형성
const SAMHAP_TABLE: { branches: string[]; result: string }[] = [
  { branches: ['寅', '午', '戌'], result: '火' },  // 인오술 화국
  { branches: ['申', '子', '辰'], result: '水' },  // 신자진 수국
  { branches: ['巳', '酉', '丑'], result: '金' },  // 사유축 금국
  { branches: ['亥', '卯', '未'], result: '木' }   // 해묘미 목국
];

// 방합(方合) - 같은 방향의 3개 지지
const BANGHAP_TABLE: { branches: string[]; result: string; direction: string }[] = [
  { branches: ['寅', '卯', '辰'], result: '木', direction: '동방' },
  { branches: ['巳', '午', '未'], result: '火', direction: '남방' },
  { branches: ['申', '酉', '戌'], result: '金', direction: '서방' },
  { branches: ['亥', '子', '丑'], result: '水', direction: '북방' }
];

// 충(沖) - 정반대 위치의 지지끼리 충돌
const CHUNG_TABLE: Record<string, string> = {
  '子': '午', '午': '子',  // 자오충
  '丑': '未', '未': '丑',  // 축미충
  '寅': '申', '申': '寅',  // 인신충
  '卯': '酉', '酉': '卯',  // 묘유충
  '辰': '戌', '戌': '辰',  // 진술충
  '巳': '亥', '亥': '巳'   // 사해충
};

// 형(刑) - 지지 간의 형벌 관계
const HYUNG_TABLE: { branches: string[]; name: string; description: string }[] = [
  { branches: ['寅', '巳', '申'], name: '무은지형', description: '은혜를 원수로 갚는 형벌' },
  { branches: ['丑', '戌', '未'], name: '지세지형', description: '권세를 믿고 날뛰는 형벌' },
  { branches: ['子', '卯'], name: '무례지형', description: '예의 없는 형벌' },
  { branches: ['辰', '辰'], name: '자형', description: '스스로 해침' },
  { branches: ['午', '午'], name: '자형', description: '스스로 해침' },
  { branches: ['酉', '酉'], name: '자형', description: '스스로 해침' },
  { branches: ['亥', '亥'], name: '자형', description: '스스로 해침' }
];

// 파(破) - 파괴하는 관계
const PA_TABLE: Record<string, string> = {
  '子': '酉', '酉': '子',  // 자유파
  '丑': '辰', '辰': '丑',  // 축진파
  '寅': '亥', '亥': '寅',  // 인해파
  '卯': '午', '午': '卯',  // 묘오파
  '巳': '申', '申': '巳',  // 사신파
  '未': '戌', '戌': '未'   // 미술파
};

// 해(害) - 서로 해를 끼치는 관계
const HAE_TABLE: Record<string, string> = {
  '子': '未', '未': '子',  // 자미해
  '丑': '午', '午': '丑',  // 축오해
  '寅': '巳', '巳': '寅',  // 인사해
  '卯': '辰', '辰': '卯',  // 묘진해
  '申': '亥', '亥': '申',  // 신해해
  '酉': '戌', '戌': '酉'   // 유술해
};

export interface HapChungAnalysis {
  relations: BranchRelation[];
  harmonies: BranchRelation[];      // 합 관계들
  conflicts: BranchRelation[];      // 충/형/파/해 관계들
  harmonyScore: number;             // 조화 점수 (0~100)
  summary: string;
  advice: string[];
}

const PILLAR_NAMES = ['년지', '월지', '일지', '시지'];

/**
 * 합충형파해 분석 실행
 */
export function analyzeHapChung(saju: SajuChart): HapChungAnalysis {
  const branches = [
    saju.year.earthlyBranch,
    saju.month.earthlyBranch,
    saju.day.earthlyBranch,
    ...(saju.time ? [saju.time.earthlyBranch] : [])
  ];

  const relations: BranchRelation[] = [];

  // 1. 육합 체크 (2개씩 비교)
  for (let i = 0; i < branches.length; i++) {
    for (let j = i + 1; j < branches.length; j++) {
      const yukap = YUKAP_TABLE[branches[i]];
      if (yukap && yukap.partner === branches[j]) {
        relations.push({
          type: '육합',
          branches: [branches[i], branches[j]],
          positions: [PILLAR_NAMES[i], PILLAR_NAMES[j]],
          result: yukap.result,
          effect: `${branches[i]}${branches[j]}합${getOhengName(yukap.result)} - 두 기운이 합쳐져 ${getOhengName(yukap.result)} 에너지 생성`,
          isPositive: true
        });
      }
    }
  }

  // 2. 삼합 체크
  SAMHAP_TABLE.forEach(samhap => {
    const found = samhap.branches.filter(b => branches.includes(b));
    if (found.length >= 2) {
      const positions = found.map(b => PILLAR_NAMES[branches.indexOf(b)]);
      relations.push({
        type: '삼합',
        branches: found,
        positions,
        result: samhap.result,
        effect: found.length === 3
          ? `${found.join('')} 완전삼합 - ${getOhengName(samhap.result)} 기운 강화`
          : `${found.join('')} 반삼합 - ${getOhengName(samhap.result)} 기운 일부 형성`,
        isPositive: true
      });
    }
  });

  // 3. 방합 체크
  BANGHAP_TABLE.forEach(banghap => {
    const found = banghap.branches.filter(b => branches.includes(b));
    if (found.length >= 2) {
      const positions = found.map(b => PILLAR_NAMES[branches.indexOf(b)]);
      relations.push({
        type: '방합',
        branches: found,
        positions,
        result: banghap.result,
        effect: `${banghap.direction} ${getOhengName(banghap.result)} 방합 - ${banghap.direction}의 기운 강화`,
        isPositive: true
      });
    }
  });

  // 4. 충 체크
  for (let i = 0; i < branches.length; i++) {
    for (let j = i + 1; j < branches.length; j++) {
      if (CHUNG_TABLE[branches[i]] === branches[j]) {
        relations.push({
          type: '충',
          branches: [branches[i], branches[j]],
          positions: [PILLAR_NAMES[i], PILLAR_NAMES[j]],
          effect: `${branches[i]}${branches[j]}충 - ${getChungMeaning(PILLAR_NAMES[i], PILLAR_NAMES[j])}`,
          isPositive: false
        });
      }
    }
  }

  // 5. 형 체크
  HYUNG_TABLE.forEach(hyung => {
    const found = hyung.branches.filter(b => branches.includes(b));
    // 자형(自刑)의 경우 같은 지지가 2개 이상 있는지 확인
    if (hyung.branches.length === 2 && hyung.branches[0] === hyung.branches[1]) {
      const count = branches.filter(b => b === hyung.branches[0]).length;
      if (count >= 2) {
        relations.push({
          type: '형',
          branches: [hyung.branches[0], hyung.branches[0]],
          positions: branches.map((b, i) => b === hyung.branches[0] ? PILLAR_NAMES[i] : null).filter(Boolean) as string[],
          effect: `${hyung.branches[0]}${hyung.branches[0]} ${hyung.name} - ${hyung.description}`,
          isPositive: false
        });
      }
    } else if (found.length >= 2) {
      const positions = found.map(b => {
        const idx = branches.indexOf(b);
        return PILLAR_NAMES[idx];
      });
      relations.push({
        type: '형',
        branches: found,
        positions,
        effect: `${found.join('')} ${hyung.name} - ${hyung.description}`,
        isPositive: false
      });
    }
  });

  // 6. 파 체크
  for (let i = 0; i < branches.length; i++) {
    for (let j = i + 1; j < branches.length; j++) {
      if (PA_TABLE[branches[i]] === branches[j]) {
        relations.push({
          type: '파',
          branches: [branches[i], branches[j]],
          positions: [PILLAR_NAMES[i], PILLAR_NAMES[j]],
          effect: `${branches[i]}${branches[j]}파 - 깨지고 흩어지는 기운`,
          isPositive: false
        });
      }
    }
  }

  // 7. 해 체크
  for (let i = 0; i < branches.length; i++) {
    for (let j = i + 1; j < branches.length; j++) {
      if (HAE_TABLE[branches[i]] === branches[j]) {
        relations.push({
          type: '해',
          branches: [branches[i], branches[j]],
          positions: [PILLAR_NAMES[i], PILLAR_NAMES[j]],
          effect: `${branches[i]}${branches[j]}해 - 서로 해를 끼치는 관계`,
          isPositive: false
        });
      }
    }
  }

  // 분류
  const harmonies = relations.filter(r => r.isPositive);
  const conflicts = relations.filter(r => !r.isPositive);

  // 조화 점수 계산
  const harmonyScore = calculateHarmonyScore(harmonies, conflicts);

  // 요약 및 조언 생성
  const summary = generateSummary(harmonies, conflicts, harmonyScore);
  const advice = generateAdvice(harmonies, conflicts);

  return {
    relations,
    harmonies,
    conflicts,
    harmonyScore,
    summary,
    advice
  };
}

function getOhengName(oheng: string): string {
  const names: Record<string, string> = {
    '木': '목(木)',
    '火': '화(火)',
    '土': '토(土)',
    '金': '금(金)',
    '水': '수(水)'
  };
  return names[oheng] || oheng;
}

function getChungMeaning(pos1: string, pos2: string): string {
  // 년지-월지 충: 부모와의 갈등
  // 월지-일지 충: 직장/사회와의 갈등
  // 일지-시지 충: 배우자/자녀와의 갈등
  // 년지-일지 충: 조상/근본과의 갈등

  if ((pos1 === '년지' && pos2 === '월지') || (pos1 === '월지' && pos2 === '년지')) {
    return '초년기 환경 변화, 부모와의 관계에 유의';
  }
  if ((pos1 === '월지' && pos2 === '일지') || (pos1 === '일지' && pos2 === '월지')) {
    return '직장/사회생활에서의 변화와 갈등';
  }
  if ((pos1 === '일지' && pos2 === '시지') || (pos1 === '시지' && pos2 === '일지')) {
    return '가정사 변화, 배우자/자녀 관계 유의';
  }
  if ((pos1 === '년지' && pos2 === '일지') || (pos1 === '일지' && pos2 === '년지')) {
    return '자아 정체성의 갈등, 인생 방향 고민';
  }
  return '변화와 움직임이 많음';
}

function calculateHarmonyScore(harmonies: BranchRelation[], conflicts: BranchRelation[]): number {
  let score = 50; // 기본 점수

  // 합에 따른 가산
  harmonies.forEach(h => {
    if (h.type === '삼합') {
      score += h.branches.length === 3 ? 20 : 12;
    } else if (h.type === '육합') {
      score += 15;
    } else if (h.type === '방합') {
      score += h.branches.length === 3 ? 15 : 8;
    }
  });

  // 충돌에 따른 감산
  conflicts.forEach(c => {
    if (c.type === '충') {
      score -= 12;
    } else if (c.type === '형') {
      score -= 10;
    } else if (c.type === '파') {
      score -= 6;
    } else if (c.type === '해') {
      score -= 5;
    }
  });

  return Math.max(0, Math.min(100, score));
}

function generateSummary(
  harmonies: BranchRelation[],
  conflicts: BranchRelation[],
  harmonyScore: number
): string {
  let summary = '';

  if (harmonyScore >= 70) {
    summary += '사주 내 지지의 조화가 좋습니다. ';
  } else if (harmonyScore >= 50) {
    summary += '사주 내 지지가 적당히 균형을 이루고 있습니다. ';
  } else {
    summary += '사주 내 지지 간 충돌이 있어 변화가 많습니다. ';
  }

  if (harmonies.length > 0) {
    const hapTypes = [...new Set(harmonies.map(h => h.type))];
    summary += `${hapTypes.join(', ')}이 있어 인복과 안정감이 있습니다. `;
  }

  if (conflicts.length > 0) {
    const conflictTypes = [...new Set(conflicts.map(c => c.type))];
    summary += `${conflictTypes.join(', ')}이 있어 변화와 도전이 예상됩니다.`;
  } else if (harmonies.length === 0) {
    summary += '특별한 합이나 충 없이 평탄한 흐름입니다.';
  }

  return summary;
}

function generateAdvice(harmonies: BranchRelation[], conflicts: BranchRelation[]): string[] {
  const advice: string[] = [];

  // 합에 대한 조언
  harmonies.forEach(h => {
    if (h.type === '삼합' && h.branches.length === 3) {
      advice.push(`✨ ${h.result} 삼합: 해당 오행의 직업/활동에서 큰 성과를 기대할 수 있습니다.`);
    }
    if (h.type === '육합') {
      advice.push(`💫 ${h.branches.join('')}합: ${h.positions.join('-')} 간의 좋은 인연이 있습니다.`);
    }
  });

  // 충돌에 대한 조언
  conflicts.forEach(c => {
    if (c.type === '충') {
      advice.push(`⚠️ ${c.branches.join('')}충: ${c.positions.join('-')} 관계에서 갈등 해소 노력이 필요합니다.`);
    }
    if (c.type === '형') {
      advice.push(`🔸 ${c.branches.join('')}형: 스스로를 다스리고 인내심을 기르세요.`);
    }
    if (c.type === '해') {
      advice.push(`💔 ${c.branches.join('')}해: 가까운 관계에서 오해가 생기지 않도록 주의하세요.`);
    }
  });

  // 종합 조언
  if (conflicts.length > harmonies.length) {
    advice.push('🧘 변화 속에서도 중심을 잡고, 급한 결정은 피하세요.');
  } else if (harmonies.length > conflicts.length) {
    advice.push('🌟 좋은 인연과 기회를 잘 활용하세요.');
  }

  return advice;
}

/**
 * 특정 두 지지 간의 관계 확인
 */
export function checkBranchRelation(branch1: string, branch2: string): RelationType | null {
  if (YUKAP_TABLE[branch1]?.partner === branch2) return '육합';
  if (CHUNG_TABLE[branch1] === branch2) return '충';
  if (PA_TABLE[branch1] === branch2) return '파';
  if (HAE_TABLE[branch1] === branch2) return '해';

  // 형 체크
  for (const hyung of HYUNG_TABLE) {
    if (hyung.branches.includes(branch1) && hyung.branches.includes(branch2)) {
      return '형';
    }
  }

  return null;
}

/**
 * 삼합 여부 확인
 */
export function checkSamhap(branches: string[]): { result: string } | null {
  for (const samhap of SAMHAP_TABLE) {
    const matching = samhap.branches.filter(b => branches.includes(b));
    if (matching.length >= 2) {
      return { result: samhap.result };
    }
  }
  return null;
}

// ========== 소비자 친화적 리스크 변환 (Day7) ==========

/**
 * 합충형파해 → 관계/계약/이동 리스크 변환
 *
 * - 합(合) = "기회·연결" (긍정적)
 * - 충(沖) = "변화·이동" (주의 필요)
 * - 형(刑) = "스트레스·자기압박" (주의 필요)
 * - 파/해 = "관계 오해·계약 파손" (주의 필요)
 */
export interface ConsumerFriendlyRisk {
  type: '기회·연결' | '변화·이동' | '스트레스·자기압박' | '관계 오해·계약 파손';
  originalType: RelationType;
  positions: string[];
  description: string;
  actionTip: string;
  isPositive: boolean;
}

export interface RiskTimingAnalysis {
  // 관계 리스크 월 TOP2
  relationshipRiskMonths: Array<{
    month: number;
    monthName: string;
    riskLevel: 'high' | 'medium' | 'low';
    reason: string;
    tip: string;
  }>;
  // 계약/투자 주의 주간 TOP2
  contractCautionWeeks: Array<{
    weekNumber: number;
    period: string;  // "1월 2째주" 형태
    riskLevel: 'high' | 'medium' | 'low';
    reason: string;
    tip: string;
  }>;
  // 기회/연결 좋은 월
  opportunityMonths: Array<{
    month: number;
    monthName: string;
    reason: string;
    actionTip: string;
  }>;
}

const CONSUMER_FRIENDLY_TYPE_MAP: Record<RelationType, ConsumerFriendlyRisk['type']> = {
  '육합': '기회·연결',
  '삼합': '기회·연결',
  '방합': '기회·연결',
  '충': '변화·이동',
  '형': '스트레스·자기압박',
  '파': '관계 오해·계약 파손',
  '해': '관계 오해·계약 파손'
};

const RISK_ACTION_TIPS: Record<ConsumerFriendlyRisk['type'], string[]> = {
  '기회·연결': [
    '새로운 만남에 적극적으로 임하세요.',
    '협력 관계를 맺기에 좋은 시기입니다.',
    '네트워킹 활동을 늘려보세요.',
    '중요한 계약/약속을 이 시기에 맞추세요.'
  ],
  '변화·이동': [
    '이직, 이사 등 변화가 자연스러운 시기입니다.',
    '급격한 결정보다 충분한 검토가 필요합니다.',
    '여행이나 출장이 많을 수 있으니 건강 관리에 유의하세요.',
    '변화를 두려워하지 말고 준비된 자세로 임하세요.'
  ],
  '스트레스·자기압박': [
    '완벽주의를 내려놓고 여유를 가지세요.',
    '스스로를 너무 몰아붙이지 마세요.',
    '명상, 운동 등 스트레스 해소 활동을 추천합니다.',
    '중요한 결정은 미루고 휴식을 취하세요.'
  ],
  '관계 오해·계약 파손': [
    '오해가 생기기 쉬우니 명확한 소통을 하세요.',
    '계약서는 꼼꼼히 검토하고 서명하세요.',
    '구두 약속보다 문서화를 권장합니다.',
    '친한 사이일수록 경계를 명확히 하세요.'
  ]
};

/**
 * 합충형파해를 소비자 친화적 리스크로 변환
 */
export function transformToConsumerFriendlyRisk(analysis: HapChungAnalysis): ConsumerFriendlyRisk[] {
  return analysis.relations.map(relation => {
    const consumerType = CONSUMER_FRIENDLY_TYPE_MAP[relation.type];
    const tips = RISK_ACTION_TIPS[consumerType];
    const randomTip = tips[Math.floor(Math.random() * tips.length)];

    // 위치에 따른 구체적 설명
    const positionMeaning = getPositionMeaning(relation.positions);

    return {
      type: consumerType,
      originalType: relation.type,
      positions: relation.positions,
      description: `${positionMeaning} ${relation.effect}`,
      actionTip: randomTip,
      isPositive: relation.isPositive
    };
  });
}

function getPositionMeaning(positions: string[]): string {
  const posSet = new Set(positions);

  if (posSet.has('년지') && posSet.has('월지')) {
    return '가족/직장 환경에서';
  }
  if (posSet.has('월지') && posSet.has('일지')) {
    return '직장/사회생활에서';
  }
  if (posSet.has('일지') && posSet.has('시지')) {
    return '가정/배우자 관계에서';
  }
  if (posSet.has('년지') && posSet.has('일지')) {
    return '인생 방향/정체성에서';
  }
  return '전반적인 삶에서';
}

// 월별 지지 매핑 (음력 기준 대략)
const MONTH_BRANCH_MAP: Record<number, string> = {
  1: '寅', 2: '卯', 3: '辰', 4: '巳', 5: '午', 6: '未',
  7: '申', 8: '酉', 9: '戌', 10: '亥', 11: '子', 12: '丑'
};

const MONTH_NAMES = ['1월', '2월', '3월', '4월', '5월', '6월', '7월', '8월', '9월', '10월', '11월', '12월'];

/**
 * 사주 기반 리스크 타이밍 분석
 * 관계 리스크 월 TOP2, 계약/투자 주의 주간 TOP2, 기회 월 분석
 */
export function analyzeRiskTiming(saju: SajuChart, targetYear: number = 2026): RiskTimingAnalysis {
  const branches = [
    saju.year.earthlyBranch,
    saju.month.earthlyBranch,
    saju.day.earthlyBranch,
    ...(saju.time ? [saju.time.earthlyBranch] : [])
  ];

  const monthRisks: Array<{ month: number; riskScore: number; reasons: string[] }> = [];
  const monthOpportunities: Array<{ month: number; score: number; reasons: string[] }> = [];

  // 각 월별로 사주 지지와의 충돌/합 체크
  for (let month = 1; month <= 12; month++) {
    const monthBranch = MONTH_BRANCH_MAP[month];
    let riskScore = 0;
    let opportunityScore = 0;
    const riskReasons: string[] = [];
    const oppReasons: string[] = [];

    branches.forEach((branch, idx) => {
      // 충 체크
      if (CHUNG_TABLE[branch] === monthBranch) {
        riskScore += 30;
        riskReasons.push(`${PILLAR_NAMES[idx]}과 ${month}월 지지가 충(沖)`);
      }
      // 형 체크
      HYUNG_TABLE.forEach(hyung => {
        if (hyung.branches.includes(branch) && hyung.branches.includes(monthBranch)) {
          riskScore += 20;
          riskReasons.push(`${hyung.name} 형(刑) 발생`);
        }
      });
      // 파 체크
      if (PA_TABLE[branch] === monthBranch) {
        riskScore += 15;
        riskReasons.push(`${PILLAR_NAMES[idx]}과 파(破)`);
      }
      // 해 체크
      if (HAE_TABLE[branch] === monthBranch) {
        riskScore += 15;
        riskReasons.push(`${PILLAR_NAMES[idx]}과 해(害)`);
      }
      // 육합 체크 (긍정)
      if (YUKAP_TABLE[branch]?.partner === monthBranch) {
        opportunityScore += 25;
        oppReasons.push(`${PILLAR_NAMES[idx]}과 육합(六合) - 좋은 인연`);
      }
    });

    // 삼합 체크 (긍정)
    SAMHAP_TABLE.forEach(samhap => {
      const matching = samhap.branches.filter(b => branches.includes(b) || b === monthBranch);
      if (matching.length >= 2 && samhap.branches.includes(monthBranch)) {
        opportunityScore += 20;
        oppReasons.push(`삼합(三合) 기운 형성`);
      }
    });

    if (riskScore > 0) {
      monthRisks.push({ month, riskScore, reasons: riskReasons });
    }
    if (opportunityScore > 0) {
      monthOpportunities.push({ month, score: opportunityScore, reasons: oppReasons });
    }
  }

  // 리스크 TOP2 정렬
  monthRisks.sort((a, b) => b.riskScore - a.riskScore);
  const topRiskMonths = monthRisks.slice(0, 2).map(r => ({
    month: r.month,
    monthName: MONTH_NAMES[r.month - 1],
    riskLevel: r.riskScore >= 40 ? 'high' as const : r.riskScore >= 20 ? 'medium' as const : 'low' as const,
    reason: r.reasons[0] || '지지 충돌',
    tip: r.riskScore >= 40
      ? '이 달은 중요한 인간관계 결정을 피하고, 갈등 해소에 집중하세요.'
      : '관계에서 오해가 생기지 않도록 명확한 소통을 권장합니다.'
  }));

  // 기회 월 정렬
  monthOpportunities.sort((a, b) => b.score - a.score);
  const topOpportunityMonths = monthOpportunities.slice(0, 3).map(o => ({
    month: o.month,
    monthName: MONTH_NAMES[o.month - 1],
    reason: o.reasons[0] || '지지 조화',
    actionTip: '네트워킹, 새로운 계약, 중요한 만남에 좋은 시기입니다.'
  }));

  // 계약/투자 주의 주간 (리스크 높은 월의 특정 주간)
  const contractCautionWeeks = topRiskMonths.slice(0, 2).map((rm, idx) => ({
    weekNumber: idx + 1,
    period: `${rm.monthName} ${idx === 0 ? '초순(1~10일)' : '중순(11~20일)'}`,
    riskLevel: rm.riskLevel,
    reason: '지지 충돌로 인한 불안정 에너지',
    tip: '중요 계약은 이 시기를 피하고, 투자 결정은 신중히 검토하세요.'
  }));

  return {
    relationshipRiskMonths: topRiskMonths.length > 0 ? topRiskMonths : [{
      month: 0,
      monthName: '특별히 주의할 월 없음',
      riskLevel: 'low',
      reason: '전반적으로 안정적',
      tip: '꾸준히 관계를 유지하세요.'
    }],
    contractCautionWeeks: contractCautionWeeks.length > 0 ? contractCautionWeeks : [{
      weekNumber: 0,
      period: '특별히 주의할 주간 없음',
      riskLevel: 'low',
      reason: '전반적으로 안정적',
      tip: '계획대로 진행하세요.'
    }],
    opportunityMonths: topOpportunityMonths.length > 0 ? topOpportunityMonths : [{
      month: 5,
      monthName: '5월',
      reason: '봄의 활기찬 에너지',
      actionTip: '새로운 시작에 좋은 시기입니다.'
    }]
  };
}

/**
 * 올해 운영 대시보드 데이터 생성
 */
export interface YearlyDashboard {
  yearScore: number;
  scoreReasons: string[];  // 점수 이유 3개
  opportunityTop3: Array<{ item: string; month: string; tip: string }>;
  riskTop3: Array<{ item: string; month: string; tip: string }>;
  luckyMonths: Array<{ month: number; monthName: string; actionItem: string }>;
}

export function generateYearlyDashboard(
  saju: SajuChart,
  hapchungAnalysis: HapChungAnalysis,
  riskTiming: RiskTimingAnalysis,
  targetYear: number = 2026
): YearlyDashboard {
  // 기본 점수 계산 (합충 조화 점수 기반)
  const baseScore = hapchungAnalysis.harmonyScore;

  // 점수 이유 3개 생성
  const scoreReasons: string[] = [];

  if (hapchungAnalysis.harmonies.length > 0) {
    const hapTypes = [...new Set(hapchungAnalysis.harmonies.map(h => h.type))];
    scoreReasons.push(`${hapTypes.join('·')}이 있어 인복과 조력자 운이 좋습니다 (+${hapchungAnalysis.harmonies.length * 10}점)`);
  }

  if (hapchungAnalysis.conflicts.length > 0) {
    const conflictCount = hapchungAnalysis.conflicts.length;
    scoreReasons.push(`${conflictCount}개의 충돌 관계로 변화와 도전이 예상됩니다 (-${conflictCount * 8}점)`);
  } else {
    scoreReasons.push('충돌 없이 안정적인 흐름입니다 (+10점)');
  }

  // 년지 기반 올해 운 분석
  const yearBranch = saju.year.earthlyBranch;
  const targetYearBranch = getYearBranch(targetYear);
  const yearRelation = checkBranchRelation(yearBranch, targetYearBranch);

  if (yearRelation === '육합' || yearRelation === '삼합') {
    scoreReasons.push(`올해(${targetYear}) 지지와 조화로운 관계로 기회가 많습니다 (+15점)`);
  } else if (yearRelation === '충') {
    scoreReasons.push(`올해(${targetYear}) 지지와 충돌하여 변화가 많은 해입니다 (-10점)`);
  } else {
    scoreReasons.push(`올해(${targetYear})는 무난한 흐름으로 기본기를 다지기 좋습니다`);
  }

  // 기회 Top3
  const opportunityTop3 = riskTiming.opportunityMonths.slice(0, 3).map(om => ({
    item: om.reason,
    month: om.monthName,
    tip: om.actionTip
  }));

  // 부족하면 기본값 추가
  while (opportunityTop3.length < 3) {
    opportunityTop3.push({
      item: '꾸준한 자기계발',
      month: `${6 + opportunityTop3.length}월`,
      tip: '실력을 쌓는 시기로 활용하세요.'
    });
  }

  // 리스크 Top3
  const riskTop3: Array<{ item: string; month: string; tip: string }> = [];

  riskTiming.relationshipRiskMonths.forEach(rm => {
    if (rm.month > 0) {
      riskTop3.push({
        item: '관계 갈등 주의',
        month: rm.monthName,
        tip: rm.tip
      });
    }
  });

  riskTiming.contractCautionWeeks.forEach(cw => {
    if (cw.weekNumber > 0) {
      riskTop3.push({
        item: '계약/투자 신중',
        month: cw.period,
        tip: cw.tip
      });
    }
  });

  // 부족하면 기본값 추가
  while (riskTop3.length < 3) {
    riskTop3.push({
      item: '과로/건강 주의',
      month: `${7 + riskTop3.length}월`,
      tip: '무리하지 말고 휴식을 챙기세요.'
    });
  }

  // 행운의 달 (기회 월 + 삼합/육합 월)
  const luckyMonths = riskTiming.opportunityMonths.slice(0, 3).map(om => ({
    month: om.month,
    monthName: om.monthName,
    actionItem: `${om.monthName}: ${om.actionTip}`
  }));

  return {
    yearScore: baseScore,
    scoreReasons: scoreReasons.slice(0, 3),
    opportunityTop3: opportunityTop3.slice(0, 3),
    riskTop3: riskTop3.slice(0, 3),
    luckyMonths
  };
}

// 연도별 지지 계산 (간단한 공식)
function getYearBranch(year: number): string {
  const branches = ['子', '丑', '寅', '卯', '辰', '巳', '午', '未', '申', '酉', '戌', '亥'];
  // 1984년은 甲子년이므로 자(子)
  const index = (year - 4) % 12;
  return branches[index >= 0 ? index : index + 12];
}

export default {
  analyzeHapChung,
  checkBranchRelation,
  checkSamhap,
  transformToConsumerFriendlyRisk,
  analyzeRiskTiming,
  generateYearlyDashboard
};
