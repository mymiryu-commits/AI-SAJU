/**
 * 종합 성향 분석 모듈
 *
 * 혈액형, MBTI, 사주(일간), 별자리 네 가지 체계를 통합하여
 * 일관된 성격 특성을 도출하고 종합적인 인사이트를 제공합니다.
 */

import { getZodiacSign, getZodiacInfo, type ZodiacSign } from './zodiacAnalysis';
import { analyzeMBTISajuMatch, MBTI_DESCRIPTIONS, type MBTIType } from '../mappings/mbtiIntegration';
import type { Element } from '@/types/saju';

// MBTI 설명 타입
type MBTIDescriptionType = typeof MBTI_DESCRIPTIONS[MBTIType];

// ========== 혈액형 성향 데이터 ==========
interface BloodTypeTraits {
  core: string;          // 핵심 성향
  strength: string;      // 강점
  socialStyle: string;   // 대인관계 스타일
  workStyle: string;     // 일하는 스타일
  loveStyle: string;     // 연애 스타일
  keywords: string[];    // 키워드
}

const BLOOD_TYPE_TRAITS: Record<string, BloodTypeTraits> = {
  'A': {
    core: '신중하고 배려심이 깊은 완벽주의자',
    strength: '꼼꼼함, 성실함, 책임감',
    socialStyle: '상대방의 감정을 잘 읽고 배려하며, 갈등을 피하려는 경향',
    workStyle: '계획적이고 체계적, 디테일에 강함',
    loveStyle: '진심을 다하고 헌신적, 다소 소극적인 표현',
    keywords: ['신중함', '배려', '완벽주의', '성실', '책임감']
  },
  'B': {
    core: '자유로운 영혼, 창의적인 개척자',
    strength: '창의력, 적응력, 솔직함',
    socialStyle: '자기 페이스대로, 솔직하고 직설적',
    workStyle: '틀에 박힌 일보다 새로운 도전을 선호',
    loveStyle: '열정적이지만 변화무쌍, 자유로운 연애 선호',
    keywords: ['자유', '창의성', '솔직함', '도전', '개성']
  },
  'O': {
    core: '타고난 리더, 목표 지향적 추진력',
    strength: '리더십, 추진력, 결단력',
    socialStyle: '사교적이고 활동적, 사람들을 이끄는 매력',
    workStyle: '목표가 생기면 밀어붙이는 추진력',
    loveStyle: '적극적인 구애, 소유욕이 강할 수 있음',
    keywords: ['리더십', '추진력', '자신감', '목표지향', '열정']
  },
  'AB': {
    core: '다면적 매력, 이성과 감성의 조화',
    strength: '분석력, 창의력, 균형감각',
    socialStyle: '친해지기까지 시간이 걸리지만 깊은 관계 형성',
    workStyle: '전략적 사고와 독창적 아이디어의 결합',
    loveStyle: '쉽게 마음을 열지 않지만 깊이 빠지면 진지함',
    keywords: ['다면성', '분석력', '신비로움', '균형', '독창성']
  }
};

// ========== 일간별 핵심 성향 데이터 ==========
interface DayMasterTraits {
  core: string;
  element: Element;
  personality: string;
  strength: string;
  keywords: string[];
}

const DAY_MASTER_TRAITS: Record<string, DayMasterTraits> = {
  '갑': {
    core: '큰 나무처럼 곧고 진취적인 리더',
    element: 'wood',
    personality: '정의롭고 도전적이며 리더십이 강함',
    strength: '개척정신, 결단력, 정의감',
    keywords: ['리더십', '도전', '정의', '개척', '당당함']
  },
  '을': {
    core: '유연한 풀처럼 적응력 있는 중재자',
    element: 'wood',
    personality: '유연하고 부드러우며 적응력이 뛰어남',
    strength: '협조성, 유연함, 섬세함',
    keywords: ['유연함', '적응력', '협조', '섬세함', '인내']
  },
  '병': {
    core: '태양처럼 밝고 활기찬 열정가',
    element: 'fire',
    personality: '밝고 열정적이며 사교적',
    strength: '열정, 사교성, 명랑함',
    keywords: ['열정', '밝음', '사교성', '표현력', '활기']
  },
  '정': {
    core: '촛불처럼 은은하고 깊은 통찰력',
    element: 'fire',
    personality: '온화하고 사려깊으며 예술적 감각',
    strength: '섬세함, 예술성, 배려심',
    keywords: ['온화함', '통찰력', '예술성', '배려', '깊이']
  },
  '무': {
    core: '큰 산처럼 든든하고 안정적인 기둥',
    element: 'earth',
    personality: '안정적이고 포용력 있으며 믿음직함',
    strength: '신뢰감, 포용력, 안정감',
    keywords: ['안정', '신뢰', '포용력', '든든함', '중심']
  },
  '기': {
    core: '비옥한 땅처럼 풍요롭고 현실적',
    element: 'earth',
    personality: '현실적이고 착실하며 실용적',
    strength: '현실감각, 실용성, 꾸준함',
    keywords: ['현실적', '착실함', '실용성', '풍요', '수용']
  },
  '경': {
    core: '강철처럼 단단하고 결단력 있는 실행가',
    element: 'metal',
    personality: '강직하고 결단력 있으며 원칙적',
    strength: '결단력, 원칙, 실행력',
    keywords: ['결단력', '원칙', '강직함', '실행력', '정의']
  },
  '신': {
    core: '보석처럼 섬세하고 완벽을 추구',
    element: 'metal',
    personality: '섬세하고 완벽주의적이며 심미적',
    strength: '완벽추구, 심미안, 정밀함',
    keywords: ['섬세함', '완벽', '심미안', '정교함', '품격']
  },
  '임': {
    core: '큰 바다처럼 깊고 지혜로운 철학자',
    element: 'water',
    personality: '지혜롭고 포용력 있으며 깊이 있음',
    strength: '지혜, 포용력, 통찰력',
    keywords: ['지혜', '깊이', '포용', '통찰', '흐름']
  },
  '계': {
    core: '맑은 샘물처럼 순수하고 영감 넘침',
    element: 'water',
    personality: '영감이 풍부하고 직관적이며 순수함',
    strength: '직관력, 영감, 순수함',
    keywords: ['영감', '직관', '순수', '감수성', '창의']
  }
};

// ========== 종합 분석 인터페이스 ==========
export interface ComprehensiveAnalysis {
  // 핵심 성향 요약
  coreSummary: string;

  // 일관되게 나타나는 특성들
  consistentTraits: string[];

  // 개별 분석 요약
  sajuInsight: string;
  mbtiInsight: string;
  bloodTypeInsight: string;
  zodiacInsight: string;

  // 강점 종합
  combinedStrengths: string[];

  // 성장 포인트
  growthPoints: string[];

  // 이상적인 파트너 종합
  idealPartnerSummary: string;

  // 커리어 종합
  careerSummary: string;

  // 최종 메시지
  finalMessage: string;
}

// ========== 키워드 일치도 분석 ==========
function findConsistentTraits(
  bloodKeywords: string[],
  dayMasterKeywords: string[],
  mbtiKeywords: string[],
  zodiacKeywords: string[]
): string[] {
  const allKeywords = [...bloodKeywords, ...dayMasterKeywords, ...mbtiKeywords, ...zodiacKeywords];
  const keywordCount = new Map<string, number>();

  // 유사 키워드 그룹핑
  const synonymGroups: Record<string, string[]> = {
    '리더십': ['리더십', '리더', '추진력', '결단력', '개척', '도전'],
    '창의성': ['창의성', '창의', '영감', '예술성', '독창성', '직관'],
    '안정': ['안정', '신뢰', '책임감', '든든함', '착실함', '성실'],
    '배려': ['배려', '협조', '포용력', '온화함', '섬세함', '따뜻함'],
    '유연함': ['유연함', '적응력', '균형', '조화', '흐름'],
    '열정': ['열정', '활기', '밝음', '에너지', '활동적'],
    '완벽주의': ['완벽주의', '완벽', '꼼꼼함', '정교함', '정밀함'],
    '독립성': ['독립성', '자유', '개성', '독립적', '자신감'],
    '통찰력': ['통찰력', '지혜', '깊이', '분석력', '통찰'],
    '정의감': ['정의감', '정의', '원칙', '강직함', '공정']
  };

  // 각 키워드를 대표 키워드로 매핑
  allKeywords.forEach(keyword => {
    for (const [representative, synonyms] of Object.entries(synonymGroups)) {
      if (synonyms.some(syn => keyword.includes(syn) || syn.includes(keyword))) {
        keywordCount.set(representative, (keywordCount.get(representative) || 0) + 1);
        return;
      }
    }
    // 매핑되지 않은 키워드
    keywordCount.set(keyword, (keywordCount.get(keyword) || 0) + 1);
  });

  // 2번 이상 등장한 특성 추출 (최소 2개 이상의 체계에서 일치)
  const consistentTraits: string[] = [];
  keywordCount.forEach((count, keyword) => {
    if (count >= 2) {
      consistentTraits.push(keyword);
    }
  });

  return consistentTraits.slice(0, 5); // 상위 5개
}

// ========== MBTI 키워드 추출 ==========
function getMBTIKeywords(mbti: MBTIType): string[] {
  const keywords: string[] = [];

  if (mbti.startsWith('E')) keywords.push('사교성', '활동적', '에너지');
  if (mbti.startsWith('I')) keywords.push('깊이', '신중함', '내면');

  if (mbti.includes('N')) keywords.push('직관', '창의', '가능성');
  if (mbti.includes('S')) keywords.push('현실적', '실용성', '안정');

  if (mbti.includes('T')) keywords.push('논리적', '분석력', '원칙');
  if (mbti.includes('F')) keywords.push('배려', '공감', '조화');

  if (mbti.includes('J')) keywords.push('계획적', '체계적', '책임감');
  if (mbti.includes('P')) keywords.push('유연함', '적응력', '자유');

  return keywords;
}

// ========== 종합 분석 생성 ==========
export function generateComprehensiveAnalysis(
  dayMaster: string,
  mbti: MBTIType | undefined,
  bloodType: string | undefined,
  birthDate: string,
  userName: string
): ComprehensiveAnalysis {
  // 각 체계별 데이터 가져오기
  const dayMasterData = DAY_MASTER_TRAITS[dayMaster];
  const bloodData = bloodType ? BLOOD_TYPE_TRAITS[bloodType] : null;
  const zodiacName = getZodiacSign(birthDate);
  const zodiacData = getZodiacInfo(zodiacName);
  const mbtiData = mbti ? MBTI_DESCRIPTIONS[mbti] : null;
  const mbtiMatch = mbti ? analyzeMBTISajuMatch(dayMaster, mbti) : null;

  // 키워드 수집
  const dayMasterKeywords = dayMasterData?.keywords || [];
  const bloodKeywords = bloodData?.keywords || [];
  const mbtiKeywords = mbti ? getMBTIKeywords(mbti) : [];
  const zodiacKeywords = zodiacData?.keywords || [];

  // 일관된 특성 찾기
  const consistentTraits = findConsistentTraits(
    bloodKeywords,
    dayMasterKeywords,
    mbtiKeywords,
    zodiacKeywords
  );

  // 핵심 요약 생성
  const coreSummary = generateCoreSummary(
    userName,
    dayMasterData,
    mbtiData,
    bloodData,
    zodiacData,
    consistentTraits
  );

  // 개별 인사이트
  const sajuInsight = dayMasterData
    ? `${dayMasterData.core}입니다. ${dayMasterData.personality}`
    : '';

  const mbtiInsight = mbtiData && mbtiMatch
    ? `${mbtiData.nickname}(${mbti})로서 ${mbtiMatch.summary.split('.')[0]}.`
    : mbti ? `${mbti} 유형입니다.` : '';

  const bloodTypeInsight = bloodData
    ? `${bloodType}형 - ${bloodData.core}`
    : '';

  const zodiacInsight = zodiacData
    ? `${zodiacData.name}(${zodiacData.symbol}) - ${zodiacData.personality}`
    : '';

  // 강점 종합
  const combinedStrengths = generateCombinedStrengths(
    dayMasterData,
    mbtiData,
    bloodData,
    zodiacData
  );

  // 성장 포인트
  const growthPoints = generateGrowthPoints(
    dayMasterData,
    mbtiMatch,
    bloodData,
    zodiacData
  );

  // 이상적인 파트너
  const idealPartnerSummary = generateIdealPartnerSummary(
    dayMasterData,
    bloodData,
    zodiacData,
    mbti
  );

  // 커리어 요약
  const careerSummary = generateCareerSummary(
    dayMasterData,
    mbtiData,
    bloodData,
    zodiacData
  );

  // 최종 메시지
  const finalMessage = generateFinalMessage(
    userName,
    consistentTraits,
    dayMasterData,
    zodiacData
  );

  return {
    coreSummary,
    consistentTraits,
    sajuInsight,
    mbtiInsight,
    bloodTypeInsight,
    zodiacInsight,
    combinedStrengths,
    growthPoints,
    idealPartnerSummary,
    careerSummary,
    finalMessage
  };
}

// ========== 핵심 요약 생성 ==========
function generateCoreSummary(
  userName: string,
  dayMaster: DayMasterTraits | undefined,
  mbti: MBTIDescriptionType | null,
  blood: BloodTypeTraits | null,
  zodiac: ZodiacSign | null,
  consistentTraits: string[]
): string {
  const traitText = consistentTraits.length > 0
    ? consistentTraits.join(', ')
    : '다양한 매력';

  let summary = `${userName}님은 `;

  if (dayMaster) {
    summary += `${dayMaster.core}의 기질을 타고났습니다. `;
  }

  if (consistentTraits.length >= 2) {
    summary += `여러 분석 체계에서 공통적으로 '${traitText}'의 특성이 두드러지게 나타납니다. `;
    summary += `이는 당신의 가장 본질적인 성격이 이러한 방향으로 형성되어 있음을 의미합니다.`;
  } else {
    summary += `다양한 분석을 종합해보면, 복합적이고 다면적인 매력을 지니고 계십니다.`;
  }

  return summary;
}

// ========== 강점 종합 ==========
function generateCombinedStrengths(
  dayMaster: DayMasterTraits | undefined,
  mbti: MBTIDescriptionType | null,
  blood: BloodTypeTraits | null,
  zodiac: ZodiacSign | null
): string[] {
  const strengths: string[] = [];

  if (dayMaster?.strength) {
    strengths.push(`[사주] ${dayMaster.strength}`);
  }
  if (mbti?.strength) {
    strengths.push(`[MBTI] ${mbti.strength}`);
  }
  if (blood?.strength) {
    strengths.push(`[혈액형] ${blood.strength}`);
  }
  if (zodiac?.strengths?.length) {
    strengths.push(`[별자리] ${zodiac.strengths.slice(0, 3).join(', ')}`);
  }

  return strengths;
}

// ========== 성장 포인트 ==========
function generateGrowthPoints(
  dayMaster: DayMasterTraits | undefined,
  mbtiMatch: ReturnType<typeof analyzeMBTISajuMatch> | null,
  blood: BloodTypeTraits | null,
  zodiac: ZodiacSign | null
): string[] {
  const points: string[] = [];

  if (mbtiMatch?.advice) {
    points.push(mbtiMatch.advice);
  }

  if (zodiac?.weaknesses?.length) {
    const weakness = zodiac.weaknesses[0];
    points.push(`${weakness}에 대한 인식이 성장의 열쇠가 됩니다.`);
  }

  // 일간별 성장 조언
  if (dayMaster) {
    const growthAdvice: Record<Element, string> = {
      wood: '때로는 유연하게 굽히는 것도 강함입니다.',
      fire: '열정을 지속 가능한 온기로 조절하는 연습이 필요합니다.',
      earth: '변화를 두려워하지 말고, 새로움에 마음을 열어보세요.',
      metal: '완벽함보다 완성을 선택하는 용기가 필요합니다.',
      water: '흐름을 따르되, 명확한 방향성을 가지세요.'
    };
    points.push(growthAdvice[dayMaster.element]);
  }

  return points.slice(0, 3);
}

// ========== 이상적인 파트너 종합 ==========
function generateIdealPartnerSummary(
  dayMaster: DayMasterTraits | undefined,
  blood: BloodTypeTraits | null,
  zodiac: ZodiacSign | null,
  mbti: MBTIType | undefined
): string {
  let summary = '당신에게 맞는 파트너는 ';
  const traits: string[] = [];

  // 일간 기반 보완 특성
  if (dayMaster) {
    const complementMap: Record<Element, string> = {
      wood: '당신의 추진력을 부드럽게 감싸주는',
      fire: '당신의 열정을 함께 나누면서도 안정감을 주는',
      earth: '새로운 자극과 변화를 가져다주는',
      metal: '당신의 원칙을 존중하면서 유연함을 더해주는',
      water: '명확한 방향성을 제시해주는'
    };
    traits.push(complementMap[dayMaster.element]);
  }

  // MBTI 기반
  if (mbti) {
    if (mbti.includes('T')) {
      traits.push('감성적인 따뜻함을 가진');
    } else {
      traits.push('논리적 관점을 보완해주는');
    }
  }

  // 별자리 기반
  if (zodiac?.idealPartner) {
    summary += traits.join(', ') + ' 사람입니다. ';
    summary += zodiac.idealPartner;
  } else {
    summary += traits.join(', ') + ' 사람이 좋습니다.';
  }

  return summary;
}

// ========== 커리어 종합 ==========
function generateCareerSummary(
  dayMaster: DayMasterTraits | undefined,
  mbti: MBTIDescriptionType | null,
  blood: BloodTypeTraits | null,
  zodiac: ZodiacSign | null
): string {
  let summary = '';

  if (dayMaster && blood) {
    summary = `${dayMaster.core}의 기질과 ${blood.workStyle}이 결합되어, `;
  } else if (dayMaster) {
    summary = `${dayMaster.core}의 기질로, `;
  }

  // 직업 적합도 제안
  const careerSuggestions: string[] = [];

  if (dayMaster?.element === 'wood') {
    careerSuggestions.push('창업', '기획', '영업');
  } else if (dayMaster?.element === 'fire') {
    careerSuggestions.push('마케팅', '엔터테인먼트', '교육');
  } else if (dayMaster?.element === 'earth') {
    careerSuggestions.push('부동산', '건설', '금융 안정권');
  } else if (dayMaster?.element === 'metal') {
    careerSuggestions.push('법률', '의료', 'IT 개발');
  } else if (dayMaster?.element === 'water') {
    careerSuggestions.push('연구', '컨설팅', '예술');
  }

  // MBTI 키워드 기반 추가 제안
  if (mbti?.keywords?.length) {
    if (mbti.keywords.includes('리더십')) {
      careerSuggestions.push('경영', '관리직');
    }
    if (mbti.keywords.includes('창의') || mbti.keywords.includes('예술')) {
      careerSuggestions.push('디자인', '콘텐츠');
    }
    if (mbti.keywords.includes('분석') || mbti.keywords.includes('논리')) {
      careerSuggestions.push('데이터 분석', '연구');
    }
  }

  summary += `${careerSuggestions.slice(0, 4).join(', ')} 분야에서 재능을 발휘할 수 있습니다.`;

  return summary;
}

// ========== 최종 메시지 ==========
function generateFinalMessage(
  userName: string,
  consistentTraits: string[],
  dayMaster: DayMasterTraits | undefined,
  zodiac: ZodiacSign | null
): string {
  const traitText = consistentTraits.length > 0
    ? consistentTraits.slice(0, 3).join('과 ')
    : '당신만의 독특한 매력';

  let message = `${userName}님, 혈액형·MBTI·사주·별자리 네 가지 체계가 모두 일관되게 보여주는 것은 `;
  message += `당신이 ${traitText}을 타고났다는 것입니다. `;

  if (dayMaster && zodiac) {
    message += `${dayMaster.keywords[0]}의 사주 기운과 ${zodiac.name}의 별자리 에너지가 `;
    message += `당신 안에서 조화를 이루며, 이것이 당신을 특별하게 만듭니다. `;
  }

  message += `자신의 본질을 이해하고 받아들일 때, 가장 빛나는 모습을 발견하게 될 것입니다.`;

  return message;
}

export {
  BLOOD_TYPE_TRAITS,
  DAY_MASTER_TRAITS
};

export default {
  generateComprehensiveAnalysis,
  BLOOD_TYPE_TRAITS,
  DAY_MASTER_TRAITS
};
