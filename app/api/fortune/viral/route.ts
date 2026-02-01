/**
 * 바이럴 퀵 테스트 API
 *
 * 짧고 재미있는 사주 기반 테스트들
 * - 이상형 매칭
 * - 부모 닮음 테스트
 * - 성공 프로필
 * - 퀵 궁합 테스트
 */

import { NextRequest, NextResponse } from 'next/server';
import { calculateSaju } from '@/lib/fortune/saju/calculator';
import { calculateOheng } from '@/lib/fortune/saju/oheng';
import { analyzeIdealType } from '@/lib/fortune/saju/analysis/idealType';
import { analyzeParentInfluence } from '@/lib/fortune/saju/analysis/familyImpact';

// 테스트 타입
type TestType = 'ideal-type' | 'parent-similarity' | 'success-profile' | 'quick-compatibility';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { testType, user, extraData } = body;

    // 사주 계산
    const saju = calculateSaju(
      user.birthDate,
      user.birthTime || '12:00',
      user.gender || 'male',
      user.calendar || 'solar'
    );
    const oheng = calculateOheng(saju);

    let result;

    switch (testType as TestType) {
      case 'ideal-type':
        result = handleIdealTypeTest(saju, oheng);
        break;

      case 'parent-similarity':
        if (!extraData?.fatherBirthDate || !extraData?.motherBirthDate) {
          return NextResponse.json(
            { error: '부모님 생년월일이 필요합니다.' },
            { status: 400 }
          );
        }
        result = handleParentSimilarityTest(
          saju,
          extraData.fatherBirthDate,
          extraData.motherBirthDate,
          extraData.fatherBirthTime,
          extraData.motherBirthTime
        );
        break;

      case 'success-profile':
        result = handleSuccessProfileTest(saju, oheng);
        break;

      case 'quick-compatibility':
        if (!extraData?.person2) {
          return NextResponse.json(
            { error: '상대방 정보가 필요합니다.' },
            { status: 400 }
          );
        }
        result = handleQuickCompatibilityTest(saju, extraData.person2);
        break;

      default:
        return NextResponse.json(
          { error: '지원하지 않는 테스트 타입입니다.' },
          { status: 400 }
        );
    }

    return NextResponse.json({
      success: true,
      data: result,
    });
  } catch (error) {
    console.error('Viral test error:', error);
    return NextResponse.json(
      { error: '테스트 처리 중 오류가 발생했습니다.' },
      { status: 500 }
    );
  }
}

/**
 * 이상형 매칭 테스트
 */
function handleIdealTypeTest(saju: any, oheng: any) {
  const idealType = analyzeIdealType(saju, oheng);

  return {
    testType: 'ideal-type',
    title: '나의 이상형 테스트',
    subtitle: idealType.viralTitle,
    result: {
      idealProfile: idealType.idealProfile,
      loveStyle: idealType.loveStyle,
      matchScores: idealType.matchScores,
      summary: idealType.summary,
    },
    shareText: idealType.viralTitle,
    shareTitle: `나의 이상형은 ${idealType.idealProfile.elementTypeKorean} 타입!`,
    emoji: getElementEmoji(idealType.idealProfile.elementType),
  };
}

/**
 * 부모 닮음 테스트
 */
function handleParentSimilarityTest(
  saju: any,
  fatherBirthDate: string,
  motherBirthDate: string,
  fatherBirthTime?: string,
  motherBirthTime?: string
) {
  const analysis = analyzeParentInfluence(
    saju,
    fatherBirthDate,
    motherBirthDate,
    fatherBirthTime,
    motherBirthTime
  );

  // 결과 텍스트 생성
  let resultText = '';
  let emoji = '';

  if (analysis.dominantParent === 'father') {
    resultText = `아버지를 ${analysis.fatherInfluence.percentage}% 닮았어요!`;
    emoji = '👨';
  } else if (analysis.dominantParent === 'mother') {
    resultText = `어머니를 ${analysis.motherInfluence.percentage}% 닮았어요!`;
    emoji = '👩';
  } else {
    resultText = '부모님을 골고루 닮았어요!';
    emoji = '👨‍👩‍👧';
  }

  // 닮은 부분 요약
  const fatherTraits = analysis.fatherInfluence.sharedTraits.slice(0, 3);
  const motherTraits = analysis.motherInfluence.sharedTraits.slice(0, 3);

  return {
    testType: 'parent-similarity',
    title: '엄마 vs 아빠, 누구를 더 닮았을까?',
    subtitle: resultText,
    result: {
      dominantParent: analysis.dominantParent,
      fatherPercentage: analysis.fatherInfluence.percentage,
      motherPercentage: analysis.motherInfluence.percentage,
      fatherTraits,
      motherTraits,
      fatherElements: analysis.fatherInfluence.elements,
      motherElements: analysis.motherInfluence.elements,
      summary: analysis.summary,
      detailedAnalysis: analysis.detailedAnalysis.slice(0, 5),
    },
    shareText: resultText,
    shareTitle: '나는 엄마/아빠 누구를 더 닮았을까?',
    emoji,
  };
}

/**
 * 성공 프로필 테스트
 */
function handleSuccessProfileTest(saju: any, oheng: any) {
  const dayElement = saju.day.element;
  const dayMaster = saju.day.heavenlyStem;

  // 성공 유형 분석
  const successProfiles: Record<string, {
    type: string;
    strengths: string[];
    obstacles: string[];
    strategy: string;
    career: string[];
    emoji: string;
  }> = {
    wood: {
      type: '성장형 리더',
      strengths: ['창의력', '추진력', '성장 마인드', '새로운 도전'],
      obstacles: ['급한 성격', '완벽주의', '갈등 회피'],
      strategy: '장기적 비전을 세우고 단계별로 실행하세요. 인맥을 넓히는 것이 성공의 열쇠입니다.',
      career: ['스타트업 창업', '교육/멘토링', '콘텐츠 크리에이터', '환경/ESG'],
      emoji: '🌳'
    },
    fire: {
      type: '열정형 개척자',
      strengths: ['열정', '카리스마', '실행력', '커뮤니케이션'],
      obstacles: ['지구력 부족', '감정 기복', '세부 사항 놓침'],
      strategy: '팀을 이뤄 함께 하세요. 당신의 열정이 전염되면 큰 일을 이룰 수 있습니다.',
      career: ['연예/방송', '영업/마케팅', 'CEO/리더십', '이벤트/기획'],
      emoji: '🔥'
    },
    earth: {
      type: '안정형 빌더',
      strengths: ['신뢰성', '끈기', '현실 감각', '조직력'],
      obstacles: ['변화 두려움', '고집', '느린 적응'],
      strategy: '한 분야에서 전문성을 쌓으세요. 시간이 당신의 편입니다. 복리로 성장합니다.',
      career: ['부동산/자산관리', '금융/회계', '프랜차이즈', '행정/관리'],
      emoji: '🏔️'
    },
    metal: {
      type: '정밀형 전략가',
      strengths: ['분석력', '결단력', '원칙', '효율성'],
      obstacles: ['감정 소통 부족', '융통성 부족', '과도한 비판'],
      strategy: '시스템을 만들고 최적화하세요. 당신만의 원칙이 성공의 무기가 됩니다.',
      career: ['IT/기술', '법률/컨설팅', '엔지니어링', '투자/분석'],
      emoji: '⚔️'
    },
    water: {
      type: '지혜형 연결자',
      strengths: ['통찰력', '유연성', '공감력', '창의성'],
      obstacles: ['우유부단', '현실 회피', '에너지 관리'],
      strategy: '직관을 믿되, 멘토의 조언을 구하세요. 네트워크가 성공을 만듭니다.',
      career: ['연구/학술', '상담/심리', '예술/창작', '기획/전략'],
      emoji: '🌊'
    }
  };

  const profile = successProfiles[dayElement];

  // 강점/약점 비율 계산 (오행 기반)
  const strongPoints = Object.entries(oheng)
    .filter(([_, value]) => value > 20)
    .map(([key, _]) => key);

  const weakPoints = Object.entries(oheng)
    .filter(([_, value]) => value < 15)
    .map(([key, _]) => key);

  return {
    testType: 'success-profile',
    title: '나의 성공 DNA 분석',
    subtitle: `당신은 "${profile.type}"입니다!`,
    result: {
      successType: profile.type,
      strengths: profile.strengths,
      obstacles: profile.obstacles,
      strategy: profile.strategy,
      recommendedCareers: profile.career,
      elementStrengths: strongPoints,
      elementWeaknesses: weakPoints,
      actionPlan: generateActionPlan(dayElement, oheng),
    },
    shareText: `나의 성공 유형: ${profile.type} ${profile.emoji}`,
    shareTitle: '나의 성공 DNA는?',
    emoji: profile.emoji,
  };
}

/**
 * 퀵 궁합 테스트
 */
function handleQuickCompatibilityTest(saju1: any, person2: any) {
  const saju2 = calculateSaju(
    person2.birthDate,
    person2.birthTime || '12:00',
    person2.gender || 'male',
    person2.calendar || 'solar'
  );

  const element1 = saju1.day.element;
  const element2 = saju2.day.element;

  // 간단한 궁합 점수 계산
  const compatibilityMatrix: Record<string, Record<string, number>> = {
    wood: { wood: 70, fire: 95, earth: 55, metal: 45, water: 90 },
    fire: { wood: 95, fire: 65, earth: 90, metal: 50, water: 40 },
    earth: { wood: 55, fire: 90, earth: 75, metal: 95, water: 50 },
    metal: { wood: 45, fire: 50, earth: 95, metal: 70, water: 90 },
    water: { wood: 90, fire: 40, earth: 50, metal: 90, water: 75 }
  };

  const score = compatibilityMatrix[element1][element2];
  const grade = score >= 90 ? 'S' : score >= 80 ? 'A' : score >= 70 ? 'B' : score >= 60 ? 'C' : 'D';

  const gradeDescriptions: Record<string, string> = {
    S: '운명적 만남! 최고의 궁합입니다 💕',
    A: '아주 좋은 궁합! 서로를 성장시켜요',
    B: '좋은 궁합! 노력하면 더 좋아져요',
    C: '보통 궁합! 서로를 이해하려는 노력 필요',
    D: '도전적 관계! 성장의 기회로 삼으세요'
  };

  return {
    testType: 'quick-compatibility',
    title: '퀵 궁합 테스트',
    subtitle: `${score}점 (${grade}등급)`,
    result: {
      score,
      grade,
      gradeDescription: gradeDescriptions[grade],
      element1: element1,
      element2: element2,
      chemistry: getElementChemistry(element1, element2),
    },
    shareText: `우리 궁합은 ${score}점! ${grade}등급 ${getCompatibilityEmoji(score)}`,
    shareTitle: '우리의 궁합은?',
    emoji: getCompatibilityEmoji(score),
  };
}

/**
 * 실행 계획 생성
 */
function generateActionPlan(element: string, oheng: any): string[] {
  const plans: Record<string, string[]> = {
    wood: [
      '매일 10분 독서로 성장 마인드 유지하기',
      '분기별 새로운 스킬 하나 도전하기',
      '멘토 1명 정하고 정기적으로 조언 구하기',
      '장기 목표를 3개월 단위로 쪼개서 실행하기'
    ],
    fire: [
      '열정을 유지할 팀/커뮤니티 참여하기',
      '매주 새로운 사람 1명 만나기',
      '감정 일기 쓰며 에너지 관리하기',
      '큰 목표를 작은 승리로 나눠 성취감 쌓기'
    ],
    earth: [
      '한 분야에서 5년 계획 세우기',
      '자산/재정 관리 시스템 구축하기',
      '변화를 두려워말고 월 1회 새로운 시도하기',
      '신뢰할 수 있는 네트워크 구축하기'
    ],
    metal: [
      '효율적인 업무 시스템 구축하기',
      '감정 소통 스킬 주 1회 연습하기',
      '원칙을 정리하고 실천 체크리스트 만들기',
      '전문 분야 자격증/인증 획득하기'
    ],
    water: [
      '직관을 신뢰하되 데이터로 검증하기',
      '규칙적인 루틴으로 에너지 관리하기',
      '멘토/조언자 네트워크 구축하기',
      '창의적 아이디어를 실행 가능한 계획으로 바꾸기'
    ]
  };

  return plans[element] || plans.earth;
}

/**
 * 오행 이모지
 */
function getElementEmoji(element: string): string {
  const emojis: Record<string, string> = {
    wood: '🌳', fire: '🔥', earth: '🏔️', metal: '⚔️', water: '🌊'
  };
  return emojis[element] || '✨';
}

/**
 * 궁합 점수별 이모지
 */
function getCompatibilityEmoji(score: number): string {
  if (score >= 90) return '💕';
  if (score >= 80) return '❤️';
  if (score >= 70) return '💛';
  if (score >= 60) return '💙';
  return '🤍';
}

/**
 * 오행 케미스트리 설명
 */
function getElementChemistry(el1: string, el2: string): string {
  const chemistries: Record<string, Record<string, string>> = {
    wood: {
      wood: '함께 성장하는 동반자! 비전을 공유하세요.',
      fire: '최고의 시너지! 당신의 에너지가 상대를 빛나게 해요.',
      earth: '안정과 성장의 균형이 필요해요.',
      metal: '서로 다른 세계, 하지만 배울 점이 많아요.',
      water: '깊은 교감! 영혼까지 통하는 관계예요.'
    },
    fire: {
      wood: '당신을 빛나게 해주는 완벽한 파트너!',
      fire: '뜨거운 열정! 하지만 불꽃 튈 수 있어요.',
      earth: '열정을 현실로! 든든한 지원군이에요.',
      metal: '화끈함 vs 차가움, 밀고 당기기 관계.',
      water: '극과 극! 끌리지만 주의가 필요해요.'
    },
    earth: {
      wood: '변화의 바람을 불어넣어 줄 파트너.',
      fire: '당신에게 활력을 불어넣어 줘요!',
      earth: '평생 함께할 안정적인 관계.',
      metal: '완벽한 신뢰 관계! 서로를 지지해요.',
      water: '깊은 이해가 필요한 관계예요.'
    },
    metal: {
      wood: '서로 다르지만 배울 점이 많아요.',
      fire: '열정을 배울 수 있는 관계.',
      earth: '든든한 지지자! 최고의 파트너.',
      metal: '원칙과 신뢰로 단단한 관계.',
      water: '지혜를 나누는 깊은 관계.'
    },
    water: {
      wood: '당신이 성장시키는 관계! 보람 있어요.',
      fire: '끌리지만 조심해야 하는 관계.',
      earth: '안정을 배울 수 있어요.',
      metal: '서로를 더 강하게 만드는 관계.',
      water: '영혼의 동반자! 말없이도 통해요.'
    }
  };

  return chemistries[el1]?.[el2] || '서로를 이해하며 성장하는 관계!';
}
