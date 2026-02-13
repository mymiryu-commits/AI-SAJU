/**
 * 12운성(十二運星) 분석 모듈
 *
 * 12운성은 일간(日干)의 에너지가 각 지지(地支)에서 어떤 상태인지를 나타냅니다.
 * 사람의 일생처럼 태어나서 죽음에 이르는 12단계의 에너지 순환을 의미합니다.
 */

import type { SajuChart } from '@/types/saju';

export type UnsungType =
  | 'jangseong'  // 장생 (長生) - 탄생
  | 'mokryok'    // 목욕 (沐浴) - 성장
  | 'gwandae'    // 관대 (冠帶) - 성인
  | 'geonnok'    // 건록 (建祿) - 취업
  | 'jewang'     // 제왕 (帝旺) - 전성기
  | 'soe'        // 쇠 (衰) - 쇠퇴
  | 'byeong'     // 병 (病) - 병약
  | 'sa'         // 사 (死) - 죽음
  | 'myo'        // 묘 (墓) - 무덤
  | 'jeol'       // 절 (絶) - 소멸
  | 'tae'        // 태 (胎) - 잉태
  | 'yang';      // 양 (養) - 양육

export interface UnsungInfo {
  type: UnsungType;
  korean: string;
  hanja: string;
  stage: '성장기' | '전성기' | '쇠퇴기' | '휴식기';
  energyLevel: number; // 1~10
  description: string;
  characteristics: string[];
  advice: string;
}

// 12운성 정보
export const UNSUNG_INFO: Record<UnsungType, UnsungInfo> = {
  jangseong: {
    type: 'jangseong',
    korean: '장생',
    hanja: '長生',
    stage: '성장기',
    energyLevel: 7,
    description: '태어남, 새로운 시작',
    characteristics: [
      '새로운 시작에 대한 열정',
      '순수하고 낙관적인 성격',
      '성장 잠재력이 큼',
      '새로운 환경에 적응력 좋음'
    ],
    advice: '새로운 일을 시작하기 좋은 에너지입니다. 배움과 성장에 집중하세요.'
  },
  mokryok: {
    type: 'mokryok',
    korean: '목욕',
    hanja: '沐浴',
    stage: '성장기',
    energyLevel: 5,
    description: '깨끗이 씻음, 정화',
    characteristics: [
      '호기심이 많고 모험적',
      '감정 기복이 있을 수 있음',
      '변화를 추구함',
      '연애에 관심이 많음'
    ],
    advice: '감정 조절에 유의하고, 충동적인 결정은 피하세요.'
  },
  gwandae: {
    type: 'gwandae',
    korean: '관대',
    hanja: '冠帶',
    stage: '성장기',
    energyLevel: 8,
    description: '관을 쓰고 띠를 두름, 성인식',
    characteristics: [
      '자존심과 명예를 중시',
      '외모와 체면에 신경 씀',
      '사회적 인정을 원함',
      '리더십 발휘'
    ],
    advice: '자신감을 갖고 사회 활동에 적극 참여하세요.'
  },
  geonnok: {
    type: 'geonnok',
    korean: '건록',
    hanja: '建祿',
    stage: '전성기',
    energyLevel: 9,
    description: '녹봉을 받음, 직장 생활',
    characteristics: [
      '안정적이고 성실함',
      '직장 생활에 적합',
      '책임감이 강함',
      '실용적 능력 발휘'
    ],
    advice: '꾸준히 노력하면 성과가 있습니다. 안정을 유지하세요.'
  },
  jewang: {
    type: 'jewang',
    korean: '제왕',
    hanja: '帝旺',
    stage: '전성기',
    energyLevel: 10,
    description: '왕이 됨, 전성기',
    characteristics: [
      '최고의 에너지 상태',
      '강한 추진력과 리더십',
      '자신감 충만',
      '성공 가능성 높음'
    ],
    advice: '에너지가 최고조입니다. 큰 일을 추진하기 좋습니다. 다만 겸손함을 유지하세요.'
  },
  soe: {
    type: 'soe',
    korean: '쇠',
    hanja: '衰',
    stage: '쇠퇴기',
    energyLevel: 6,
    description: '쇠퇴하기 시작',
    characteristics: [
      '신중하고 보수적',
      '경험을 바탕으로 판단',
      '현실적인 접근',
      '위험 회피 성향'
    ],
    advice: '무리한 도전보다 안정을 유지하며 지혜를 쌓으세요.'
  },
  byeong: {
    type: 'byeong',
    korean: '병',
    hanja: '病',
    stage: '쇠퇴기',
    energyLevel: 4,
    description: '병이 듦, 약해짐',
    characteristics: [
      '건강 관리 필요',
      '내면에 집중하는 시기',
      '민감하고 예민함',
      '예술적 감수성'
    ],
    advice: '건강에 유의하고, 무리하지 마세요. 휴식이 필요한 시기입니다.'
  },
  sa: {
    type: 'sa',
    korean: '사',
    hanja: '死',
    stage: '쇠퇴기',
    energyLevel: 3,
    description: '죽음, 마무리',
    characteristics: [
      '한 단계가 끝나감',
      '집착을 내려놓음',
      '정리와 마무리',
      '철학적 사고'
    ],
    advice: '끝은 새로운 시작입니다. 미련을 버리고 정리하세요.'
  },
  myo: {
    type: 'myo',
    korean: '묘',
    hanja: '墓',
    stage: '휴식기',
    energyLevel: 2,
    description: '무덤에 들어감, 저장',
    characteristics: [
      '에너지를 저장하는 시기',
      '내면 성찰',
      '준비의 시간',
      '저축과 비축에 유리'
    ],
    advice: '조용히 힘을 비축하세요. 때가 되면 다시 기회가 옵니다.'
  },
  jeol: {
    type: 'jeol',
    korean: '절',
    hanja: '絶',
    stage: '휴식기',
    energyLevel: 1,
    description: '완전히 소멸',
    characteristics: [
      '완전한 휴식 필요',
      '새로운 시작 전 단계',
      '집착 없음',
      '자유로움'
    ],
    advice: '에너지가 바닥입니다. 절대적 휴식 후 재충전하세요.'
  },
  tae: {
    type: 'tae',
    korean: '태',
    hanja: '胎',
    stage: '휴식기',
    energyLevel: 3,
    description: '잉태됨, 새 생명',
    characteristics: [
      '새로운 가능성 싹틈',
      '아이디어 구상',
      '계획 수립',
      '희망의 시작'
    ],
    advice: '아직 드러나지 않았지만 가능성이 자라고 있습니다. 신중히 계획하세요.'
  },
  yang: {
    type: 'yang',
    korean: '양',
    hanja: '養',
    stage: '휴식기',
    energyLevel: 5,
    description: '양육됨, 성장 준비',
    characteristics: [
      '에너지가 자라는 중',
      '준비와 학습',
      '보호가 필요',
      '성장 가능성'
    ],
    advice: '조급해하지 말고 차근차근 준비하세요. 때가 되면 꽃피웁니다.'
  }
};

// 12운성 조견표 (일간 → 지지별 운성)
// 양간(갑병무경임)은 순행, 음간(을정기신계)은 역행
const UNSUNG_TABLE: Record<string, Record<string, UnsungType>> = {
  // 갑(甲) - 양목
  '甲': {
    '亥': 'jangseong', '子': 'mokryok', '丑': 'gwandae', '寅': 'geonnok',
    '卯': 'jewang', '辰': 'soe', '巳': 'byeong', '午': 'sa',
    '未': 'myo', '申': 'jeol', '酉': 'tae', '戌': 'yang'
  },
  // 을(乙) - 음목
  '乙': {
    '午': 'jangseong', '巳': 'mokryok', '辰': 'gwandae', '卯': 'geonnok',
    '寅': 'jewang', '丑': 'soe', '子': 'byeong', '亥': 'sa',
    '戌': 'myo', '酉': 'jeol', '申': 'tae', '未': 'yang'
  },
  // 병(丙) - 양화
  '丙': {
    '寅': 'jangseong', '卯': 'mokryok', '辰': 'gwandae', '巳': 'geonnok',
    '午': 'jewang', '未': 'soe', '申': 'byeong', '酉': 'sa',
    '戌': 'myo', '亥': 'jeol', '子': 'tae', '丑': 'yang'
  },
  // 정(丁) - 음화
  '丁': {
    '酉': 'jangseong', '申': 'mokryok', '未': 'gwandae', '午': 'geonnok',
    '巳': 'jewang', '辰': 'soe', '卯': 'byeong', '寅': 'sa',
    '丑': 'myo', '子': 'jeol', '亥': 'tae', '戌': 'yang'
  },
  // 무(戊) - 양토
  '戊': {
    '寅': 'jangseong', '卯': 'mokryok', '辰': 'gwandae', '巳': 'geonnok',
    '午': 'jewang', '未': 'soe', '申': 'byeong', '酉': 'sa',
    '戌': 'myo', '亥': 'jeol', '子': 'tae', '丑': 'yang'
  },
  // 기(己) - 음토
  '己': {
    '酉': 'jangseong', '申': 'mokryok', '未': 'gwandae', '午': 'geonnok',
    '巳': 'jewang', '辰': 'soe', '卯': 'byeong', '寅': 'sa',
    '丑': 'myo', '子': 'jeol', '亥': 'tae', '戌': 'yang'
  },
  // 경(庚) - 양금
  '庚': {
    '巳': 'jangseong', '午': 'mokryok', '未': 'gwandae', '申': 'geonnok',
    '酉': 'jewang', '戌': 'soe', '亥': 'byeong', '子': 'sa',
    '丑': 'myo', '寅': 'jeol', '卯': 'tae', '辰': 'yang'
  },
  // 신(辛) - 음금
  '辛': {
    '子': 'jangseong', '亥': 'mokryok', '戌': 'gwandae', '酉': 'geonnok',
    '申': 'jewang', '未': 'soe', '午': 'byeong', '巳': 'sa',
    '辰': 'myo', '卯': 'jeol', '寅': 'tae', '丑': 'yang'
  },
  // 임(壬) - 양수
  '壬': {
    '申': 'jangseong', '酉': 'mokryok', '戌': 'gwandae', '亥': 'geonnok',
    '子': 'jewang', '丑': 'soe', '寅': 'byeong', '卯': 'sa',
    '辰': 'myo', '巳': 'jeol', '午': 'tae', '未': 'yang'
  },
  // 계(癸) - 음수
  '癸': {
    '卯': 'jangseong', '寅': 'mokryok', '丑': 'gwandae', '子': 'geonnok',
    '亥': 'jewang', '戌': 'soe', '酉': 'byeong', '申': 'sa',
    '未': 'myo', '午': 'jeol', '巳': 'tae', '辰': 'yang'
  }
};

export interface UnsungPosition {
  pillar: '년주' | '월주' | '일주' | '시주';
  branch: string;
  unsung: UnsungType;
  info: UnsungInfo;
}

export interface UnsungAnalysis {
  positions: UnsungPosition[];
  dominantStage: '성장기' | '전성기' | '쇠퇴기' | '휴식기';
  averageEnergy: number;
  peakPosition: UnsungPosition;
  lowestPosition: UnsungPosition;
  lifeCycleSummary: string;
  advice: string[];
}

/**
 * 12운성 분석 실행
 */
export function analyzeUnsung(saju: SajuChart): UnsungAnalysis {
  const dayMaster = saju.day.heavenlyStem;
  const table = UNSUNG_TABLE[dayMaster];

  if (!table) {
    throw new Error(`Unknown day master: ${dayMaster}`);
  }

  const pillars: { name: '년주' | '월주' | '일주' | '시주'; branch: string }[] = [
    { name: '년주', branch: saju.year.earthlyBranch },
    { name: '월주', branch: saju.month.earthlyBranch },
    { name: '일주', branch: saju.day.earthlyBranch },
    ...(saju.time ? [{ name: '시주' as const, branch: saju.time.earthlyBranch }] : [])
  ];

  const positions: UnsungPosition[] = pillars.map(({ name, branch }) => {
    const unsungType = table[branch];
    return {
      pillar: name,
      branch,
      unsung: unsungType,
      info: UNSUNG_INFO[unsungType]
    };
  });

  // 에너지 평균 계산
  const totalEnergy = positions.reduce((sum, p) => sum + p.info.energyLevel, 0);
  const averageEnergy = Math.round((totalEnergy / positions.length) * 10) / 10;

  // 최고/최저 에너지 위치
  const peakPosition = positions.reduce((max, p) =>
    p.info.energyLevel > max.info.energyLevel ? p : max
  );
  const lowestPosition = positions.reduce((min, p) =>
    p.info.energyLevel < min.info.energyLevel ? p : min
  );

  // 주요 단계 판단
  const stageCounts = {
    '성장기': 0,
    '전성기': 0,
    '쇠퇴기': 0,
    '휴식기': 0
  };
  positions.forEach(p => {
    stageCounts[p.info.stage]++;
  });

  type StageType = '성장기' | '전성기' | '쇠퇴기' | '휴식기';
  const dominantStage = (Object.entries(stageCounts) as [StageType, number][])
    .reduce((a, b) => (b[1] > a[1] ? b : a))[0];

  // 인생 주기 요약 생성
  const lifeCycleSummary = generateLifeCycleSummary(positions, dominantStage, averageEnergy);

  // 조언 생성
  const advice = generateUnsungAdvice(positions, dominantStage);

  return {
    positions,
    dominantStage,
    averageEnergy,
    peakPosition,
    lowestPosition,
    lifeCycleSummary,
    advice
  };
}

function generateLifeCycleSummary(
  positions: UnsungPosition[],
  dominantStage: string,
  averageEnergy: number
): string {
  const dayUnsung = positions.find(p => p.pillar === '일주');
  const monthUnsung = positions.find(p => p.pillar === '월주');

  let summary = '';

  // 일주 기반 핵심 성향
  if (dayUnsung) {
    summary += `일주의 ${dayUnsung.info.korean}(${dayUnsung.info.hanja})은 `;
    summary += `${dayUnsung.info.description}의 에너지를 나타내며, `;
  }

  // 전체 에너지 수준
  if (averageEnergy >= 7) {
    summary += '전반적으로 활력이 넘치는 사주입니다. ';
  } else if (averageEnergy >= 5) {
    summary += '균형 잡힌 에너지 흐름을 보입니다. ';
  } else {
    summary += '차분하고 내면에 집중하는 에너지입니다. ';
  }

  // 주요 단계별 특성
  switch (dominantStage) {
    case '성장기':
      summary += '성장과 발전의 기운이 강하여 새로운 도전에 유리합니다.';
      break;
    case '전성기':
      summary += '전성기 에너지가 충만하여 큰 성취를 이룰 수 있습니다.';
      break;
    case '쇠퇴기':
      summary += '경험과 지혜를 바탕으로 안정을 추구하는 것이 좋습니다.';
      break;
    case '휴식기':
      summary += '내면을 다지고 준비하는 시기로, 때를 기다리세요.';
      break;
  }

  return summary;
}

function generateUnsungAdvice(
  positions: UnsungPosition[],
  dominantStage: string
): string[] {
  const advice: string[] = [];

  // 각 주별 조언
  positions.forEach(p => {
    const pillarMeaning = getPillarMeaning(p.pillar);
    if (p.info.energyLevel >= 8) {
      advice.push(`📈 ${p.pillar}(${p.info.korean}): ${pillarMeaning}에서 좋은 에너지가 있습니다.`);
    } else if (p.info.energyLevel <= 3) {
      advice.push(`📉 ${p.pillar}(${p.info.korean}): ${pillarMeaning}에서 에너지 보충이 필요합니다.`);
    }
  });

  // 단계별 종합 조언
  switch (dominantStage) {
    case '성장기':
      advice.push('🌱 새로운 분야에 도전하거나 배움을 시작하기 좋습니다.');
      break;
    case '전성기':
      advice.push('👑 지금이 기회입니다. 목표를 향해 적극적으로 나아가세요.');
      break;
    case '쇠퇴기':
      advice.push('📚 무리한 확장보다 경험을 정리하고 후배 양성에 힘쓰세요.');
      break;
    case '휴식기':
      advice.push('🧘 조급해하지 말고 내면을 가꾸세요. 준비된 자에게 기회가 옵니다.');
      break;
  }

  return advice;
}

function getPillarMeaning(pillar: string): string {
  switch (pillar) {
    case '년주': return '조상운/초년기';
    case '월주': return '부모운/청년기';
    case '일주': return '본인/배우자운';
    case '시주': return '자녀운/말년기';
    default: return '';
  }
}

/**
 * 특정 지지에 대한 운성 조회
 */
export function getUnsungForBranch(dayMaster: string, branch: string): UnsungInfo | null {
  const table = UNSUNG_TABLE[dayMaster];
  if (!table || !table[branch]) return null;
  return UNSUNG_INFO[table[branch]];
}

export default {
  UNSUNG_INFO,
  analyzeUnsung,
  getUnsungForBranch
};
