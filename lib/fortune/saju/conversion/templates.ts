/**
 * 결제 전환 문구 템플릿 시스템 (Conversion Templates)
 * 심리적 트리거를 활용한 전환 유도
 */

import {
  UserInput, AnalysisResult, ConversionTemplate, ConcernType, PeerComparison
} from '@/types/saju';
import { calculateAge } from '../calculator';

// 고민별 훅 메시지
const CONCERN_HOOKS: Record<ConcernType, {
  hook: string;
  insight: string;
  urgency: string;
}> = {
  career: {
    hook: '이 회사에서 더 버텨야 하나,\n새로운 도전을 해야 하나...',
    insight: "지금은 '버티기'가 아니라 '방향 전환'의 골든타임입니다.",
    urgency: '단, 충동적 퇴사는 금물.\n대운 전환 전까지 "준비하며 이동"이 정답입니다.'
  },
  money: {
    hook: '왜 열심히 해도\n돈이 안 모이는 걸까...',
    insight: "당신의 재물 흐름에 '막힌 곳'이 있습니다.",
    urgency: '지금 이 패턴을 바꾸지 않으면\n같은 상황이 4-6년 더 반복됩니다.'
  },
  romance: {
    hook: '이 사람이 맞는 건지,\n계속 가야 하는 건지...',
    insight: "당신의 사주가 말하는 '인연의 타이밍'이 있습니다.",
    urgency: '지금이 결정의 창이 열린 시기입니다.\n미루면 같은 고민이 3년 더 이어집니다.'
  },
  family: {
    hook: '가족 때문에 힘든데,\n어떻게 해야 할지...',
    insight: "갈등의 원인이 '성격'이 아니라 '에너지 충돌'일 수 있습니다.",
    urgency: '지금 이해하면 관계가 풀립니다.\n미루면 골이 깊어집니다.'
  },
  health: {
    hook: '요즘 몸이 예전 같지 않아서\n걱정이 됩니다...',
    insight: "당신의 체질과 사주가 말하는 '진짜 약점'이 있습니다.",
    urgency: '지금 관리 시작하면 큰 문제 예방.\n방치하면 3년 내 경고 신호가 옵니다.'
  },
  direction: {
    hook: '뭘 해야 할지 모르겠고,\n인생이 막막합니다...',
    insight: "방향이 없는 게 아니라, '전환점'에 서 있는 겁니다.",
    urgency: '지금 이 혼란이 오히려 기회입니다.\n다음 골든윈도우까지 시간이 있습니다.'
  },
  relationship: {
    hook: '사람 때문에 스트레스받고\n지칩니다...',
    insight: "당신의 에너지를 '빼는 관계'와 '채우는 관계'가 있습니다.",
    urgency: '지금 정리하면 에너지가 돌아옵니다.\n미루면 번아웃이 옵니다.'
  },
  none: {
    hook: '특별한 고민은 없지만,\n앞으로가 궁금합니다.',
    insight: '지금 안정적인 상태가 언제까지 갈지 알고 계시나요?',
    urgency: '준비된 사람만이 기회를 잡습니다.\n다가올 변화를 미리 확인하세요.'
  }
};

/**
 * 무료→유료 전환 템플릿
 */
export function generateFreeToPaywallTemplate(
  user: UserInput,
  result: AnalysisResult
): ConversionTemplate {
  const age = calculateAge(user.birthDate);
  const peer = result.peerComparison;

  return {
    type: 'freeToPaywall',
    headline: `${user.name} 님의 기본 분석이 완료되었습니다.\n\n하지만 아직 확인하지 못한 것이 있습니다:`,
    bullets: [
      `2026년 당신에게 찾아올 3번의 위기\n└─ 그중 1번은 피할 수 있습니다`,
      `${age}세 동년배 상위 15%가 지금 하고 있는 것\n└─ 당신은 아직 시작하지 않았습니다`,
      `당신의 사주에서 가장 약한 고리\n└─ 이것이 모든 문제의 원인입니다`
    ],
    urgency: `9,900원으로 확인하면\n"아, 이래서 그랬구나"가 됩니다.\n\n모르고 지나가면\n같은 실수를 반복합니다.`,
    cta: '지금 확인하기',
    discount: {
      amount: 3000,
      expiresIn: 24
    }
  };
}

/**
 * 타이밍 압박 템플릿
 */
export function generateTimingTemplate(
  user: UserInput,
  result: AnalysisResult
): ConversionTemplate {
  const remainingDays = calculateRemainingDays();

  return {
    type: 'timing',
    headline: `${user.name} 님, 타이밍 알림`,
    bullets: [
      `당신의 사주에서 2026년 1분기는\n"결정의 창"이 열리는 시기입니다.`,
      `이 시기에 내린 결정은\n향후 4-6년의 방향을 결정합니다.`,
      `남은 시간: ${remainingDays}일`
    ],
    urgency: `지금 이 정보를 모르고 결정하면\n"그때 알았으면..."이 됩니다.\n\n4-6년을 돌아가는 것과\n9,900원.\n\n어느 쪽이 더 비쌉니까?`,
    cta: `${remainingDays}일 안에 확인하기`
  };
}

/**
 * 가족 책임 템플릿
 */
export function generateFamilyTemplate(
  user: UserInput,
  result: AnalysisResult
): ConversionTemplate {
  return {
    type: 'family',
    headline: `${user.name} 님, 가족을 위한 질문`,
    bullets: [
      `"지금 내 선택이\n가족에게 어떤 영향을 주는지\n정확히 알고 계십니까?"`,
      `기본 분석에서 확인된 것:\n✓ 배우자 스트레스 영향: 중간 이상\n✓ 자녀 환경 영향: 조건부 긍정`,
      `아직 확인하지 않은 것:\n? 구체적으로 어떤 선택이 문제인지\n? 언제까지 결정해야 하는지\n? 가족과 어떻게 대화해야 하는지`
    ],
    urgency: `29,900원 가족 연결 분석으로\n"나만의 문제"가 아님을 증명하세요.\n\n가족 회의 때 이 리포트 하나면\n설득이 아니라 이해가 됩니다.`,
    cta: '가족을 위해 확인하기'
  };
}

/**
 * 또래 비교 템플릿
 */
export function generatePeerTemplate(
  user: UserInput,
  peerComparison: PeerComparison
): ConversionTemplate {
  const birthYear = new Date(user.birthDate).getFullYear();
  const genderText = user.gender === 'male' ? '남성' : '여성';

  return {
    type: 'peer',
    headline: `${birthYear}년생 ${genderText} 기준 리포트`,
    bullets: [
      `${user.name} 님의 현재 위치:\n├─ 커리어 성숙도: 상위 ${peerComparison.careerMaturity}%\n├─ 결정 안정성: 상위 ${peerComparison.decisionStability}%\n└─ 재물 관리: ${peerComparison.wealthManagement <= 50 ? '우수' : '평균'}`,
      `궁금하지 않으세요?\n\n"상위 15%는 지금 뭘 하고 있을까?"\n"나는 왜 이 부분이 약할까?"\n"10%로 올라가려면?"`
    ],
    urgency: `월 9,900원 구독으로\n매달 또래 대비 내 위치와\n"상위권이 하는 것"을 알려드립니다.`,
    cta: '상위 10% 전략 확인하기'
  };
}

/**
 * 다자간 궁합 템플릿
 */
export function generateGroupTemplate(
  user: UserInput
): ConversionTemplate {
  return {
    type: 'group',
    headline: `${user.name} 님, 주변 사람들과의 관계가 궁금하신가요?`,
    bullets: [
      `가족, 연인, 동료, 친구...\n함께하는 사람들과의 궁합을 한 번에!`,
      `2~5인 동시 분석으로\n├─ 개별 궁합 점수\n├─ 그룹 내 역할 배정\n└─ 협력 전략 제공`,
      `"왜 이 사람과는 자주 부딪힐까?"\n"누구와 팀을 이루면 좋을까?"\n모든 답을 한 번에 확인하세요.`
    ],
    urgency: `39,900원으로 최대 5인까지 분석.\n개별로 받으면 5배 비용!`,
    cta: '다자간 궁합 분석하기'
  };
}

/**
 * 이탈 방지 템플릿
 */
export function generateExitTemplate(
  user: UserInput,
  result: AnalysisResult
): ConversionTemplate {
  const age = calculateAge(user.birthDate);

  return {
    type: 'exit',
    headline: `잠깐, ${user.name} 님`,
    bullets: [
      '지금 나가시면 확인하지 못하는 것:',
      `1. 2026년 5월 - 당신에게 올 첫 번째 기회`,
      `2. ${age}세에 반드시 바꿔야 할 습관 1가지`,
      '3. 당신 사주의 숨겨진 재물 코드'
    ],
    urgency: `지금 떠나면 이 정보는 사라집니다.\n다시 분석하려면 처음부터 입력해야 합니다.\n\n3,000원 할인 쿠폰을 드릴까요?\n(24시간 한정)`,
    cta: '할인받고 계속하기',
    discount: {
      amount: 3000,
      expiresIn: 24
    }
  };
}

/**
 * 체면 보호 문구
 */
export function generateFaceProtectionMessage(
  user: UserInput,
  result: AnalysisResult
): string {
  const age = calculateAge(user.birthDate);

  return `${user.name} 님께 드리는 솔직한 이야기

지금까지의 선택이 틀린 게 아닙니다.
당시 상황에서는 최선이었습니다.

다만, 사주 분석 결과
"같은 방식"을 유지하면
${age}세 이후 손실이 커지는 구조입니다.

이건 능력의 문제가 아니라
"타이밍과 방향"의 문제입니다.`;
}

/**
 * 핵심 메시지 생성 (고민 기반)
 */
export function generateCoreMessage(
  user: UserInput,
  result: AnalysisResult
): {
  hook: string;
  insight: string;
  urgency: string;
  cta: string;
} {
  const concern = user.currentConcern || 'none';
  const concernData = CONCERN_HOOKS[concern];

  return {
    hook: `${user.name} 님, 지금 이 고민 하고 계시죠?\n\n"${concernData.hook}"`,
    insight: `당신의 사주가 말합니다:\n\n"${concernData.insight}"`,
    urgency: concernData.urgency,
    cta: '구체적인 해결 방법 확인하기'
  };
}

/**
 * 긴급성 배너 문구
 */
export function generateUrgencyBanner(user: UserInput): {
  message: string;
  subMessage: string;
} {
  const age = calculateAge(user.birthDate);
  const daeunAge = Math.ceil(age / 10) * 10 + 1;
  const yearsLeft = daeunAge - age;

  if (yearsLeft <= 2) {
    return {
      message: `대운 전환까지 ${yearsLeft}년!`,
      subMessage: '지금 준비하지 않으면 새 대운을 놓칩니다'
    };
  } else if (yearsLeft <= 5) {
    return {
      message: `${daeunAge}세 대운 전환 준비 시기`,
      subMessage: '골든타임을 놓치지 마세요'
    };
  }

  return {
    message: '2026년 운세 미리보기',
    subMessage: '올해의 기회와 위기를 확인하세요'
  };
}

/**
 * 소셜 프루프 문구
 */
export function generateSocialProof(user: UserInput): string[] {
  const birthYear = new Date(user.birthDate).getFullYear();
  const genderText = user.gender === 'male' ? '남성' : '여성';

  return [
    `${birthYear}년생 ${genderText} 3,847명이 이미 확인했습니다`,
    '24시간 내 환불 보장',
    '평균 만족도 4.7/5.0',
    '분석 정확도 87%'
  ];
}

/**
 * 상품별 추천 문구
 */
export function generateProductRecommendation(
  user: UserInput,
  result: AnalysisResult
): { productId: string; reason: string } {
  // 가족이 있으면 가족 분석 추천
  if (user.maritalStatus !== 'single' && user.hasChildren) {
    return {
      productId: 'family',
      reason: '자녀가 있는 가정에 최적화된 분석입니다'
    };
  }

  // 커리어 고민이면 기본 분석 추천
  if (user.currentConcern === 'career' || user.currentConcern === 'money') {
    return {
      productId: 'basic',
      reason: '커리어와 재물운 집중 분석이 포함되어 있습니다'
    };
  }

  // 연애/결혼 고민이면 다자간 궁합 추천
  if (user.currentConcern === 'romance') {
    return {
      productId: 'group',
      reason: '상대방과의 궁합을 함께 분석할 수 있습니다'
    };
  }

  // 기본적으로 프리미엄 추천
  return {
    productId: 'premium',
    reason: '가장 인기 있는 종합 분석 패키지입니다'
  };
}

// 유틸리티 함수
function calculateRemainingDays(): number {
  const today = new Date();
  const goldenWindow = new Date('2026-03-01');
  const diff = goldenWindow.getTime() - today.getTime();
  return Math.max(1, Math.ceil(diff / (1000 * 60 * 60 * 24)));
}

/**
 * A/B 테스트용 변형 템플릿
 */
export function getTemplateVariant(
  templateType: string,
  variant: 'A' | 'B'
): Partial<ConversionTemplate> {
  const variants: Record<string, Record<'A' | 'B', Partial<ConversionTemplate>>> = {
    freeToPaywall: {
      A: {
        headline: '아직 확인하지 못한 것이 있습니다',
        cta: '지금 확인하기'
      },
      B: {
        headline: '당신의 사주가 말하지 않은 것이 있습니다',
        cta: '숨겨진 정보 보기'
      }
    },
    timing: {
      A: {
        cta: '타이밍 분석 받기'
      },
      B: {
        cta: '골든타임 확인하기'
      }
    },
    exit: {
      A: {
        headline: '잠깐만요!',
        cta: '할인받고 계속하기'
      },
      B: {
        headline: '정말 떠나시겠습니까?',
        cta: '특별 혜택 받기'
      }
    }
  };

  return variants[templateType]?.[variant] || {};
}
