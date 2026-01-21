/**
 * 사주 분석 API
 * POST /api/fortune/saju/analyze
 *
 * 무료 분석: 블라인드 처리된 결과 제공
 * 프리미엄 분석: 포인트 차감 후 전체 결과 제공
 */

import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import {
  calculateSaju,
  analyzeOheng,
  generateOhengActions,
  calculatePeerComparison,
  generateCoreMessage,
  generateFreeToPaywallTemplate,
  generateUrgencyBanner,
  generateSocialProof,
  generateProductRecommendation
} from '@/lib/fortune/saju/newIndex';
import { generateAIAnalysis } from '@/lib/fortune/saju/ai/openaiAnalysis';
import {
  canUseFreeAnalysis,
  incrementFreeAnalysis,
  getPointBalance,
  deductPoints,
  PRODUCT_COSTS,
} from '@/lib/services/pointService';
import {
  blindFreeAnalysis,
  integrateZodiacAnalysis,
  saveAnalysisResult,
} from '@/lib/services/analysisService';
import type { UserInput, AnalysisResult, PersonalityAnalysis, AIAnalysis } from '@/types/saju';

export async function POST(request: NextRequest) {
  try {
    const input: UserInput = await request.json();

    // 필수 필드 검증
    if (!input.name || !input.birthDate || !input.gender) {
      return NextResponse.json(
        { success: false, error: '필수 정보가 누락되었습니다.' },
        { status: 400 }
      );
    }

    // 1. 사주 계산
    const saju = calculateSaju(
      input.birthDate,
      input.birthTime,
      input.calendar === 'lunar'
    );

    // 2. 오행 분석
    const ohengResult = analyzeOheng(saju);
    const ohengActions = generateOhengActions(ohengResult.yongsin, ohengResult.gisin);

    // 3. 운세 점수 계산
    const scores = calculateFortuneScores(saju, ohengResult);

    // 4. 성격 분석
    const personality = analyzePersonality(saju, input.mbti, input.bloodType);

    // 5. 또래 비교 (무료)
    const peerComparison = calculatePeerComparison(
      input,
      saju,
      ohengResult.balance,
      scores
    );

    // 6. 핵심 메시지 생성 (고민 기반)
    const coreMessage = generateCoreMessage(input, {
      user: input,
      saju,
      oheng: ohengResult.balance,
      scores,
      yongsin: ohengResult.yongsin,
      gisin: ohengResult.gisin,
      personality,
      peerComparison,
      coreMessage: { concern: input.currentConcern || 'none', hook: '', insight: '', urgency: '', cta: '' }
    });

    // 7. 전환 관련 데이터
    const paywallTemplate = generateFreeToPaywallTemplate(input, {
      user: input,
      saju,
      oheng: ohengResult.balance,
      scores,
      yongsin: ohengResult.yongsin,
      gisin: ohengResult.gisin,
      personality,
      peerComparison,
      coreMessage
    });

    const urgencyBanner = generateUrgencyBanner(input);
    const socialProof = generateSocialProof(input);
    const productRecommendation = generateProductRecommendation(input, {
      user: input,
      saju,
      oheng: ohengResult.balance,
      scores,
      yongsin: ohengResult.yongsin,
      gisin: ohengResult.gisin,
      personality,
      peerComparison,
      coreMessage
    });

    // 8. AI 분석 생성 (OpenAI)
    let aiAnalysis: AIAnalysis | undefined;
    try {
      const aiResult = await generateAIAnalysis({
        user: input,
        saju,
        oheng: ohengResult.balance,
        yongsin: ohengResult.yongsin,
        gisin: ohengResult.gisin,
        scores,
        dayMasterStrength: ohengResult.dayMasterStrength
      });

      aiAnalysis = {
        personalityReading: aiResult.personalityReading,
        fortuneAdvice: aiResult.fortuneAdvice,
        lifePath: aiResult.lifePath,
        luckyElements: aiResult.luckyElements,
        warningAdvice: aiResult.warningAdvice,
        // 전문가 수준 분석 필드
        dayMasterAnalysis: aiResult.dayMasterAnalysis,
        tenYearFortune: aiResult.tenYearFortune,
        yearlyFortune: aiResult.yearlyFortune,
        monthlyFortune: aiResult.monthlyFortune,
        relationshipAnalysis: aiResult.relationshipAnalysis,
        careerGuidance: aiResult.careerGuidance,
        wealthStrategy: aiResult.wealthStrategy,
        healthAdvice: aiResult.healthAdvice,
        spiritualGuidance: aiResult.spiritualGuidance,
        actionPlan: aiResult.actionPlan
      };

      // AI 생성 메시지로 coreMessage 업데이트
      if (aiResult.coreMessage) {
        coreMessage.hook = aiResult.coreMessage.hook || coreMessage.hook;
        coreMessage.insight = aiResult.coreMessage.insight || coreMessage.insight;
        coreMessage.urgency = aiResult.coreMessage.urgency || coreMessage.urgency;
      }
    } catch (aiError) {
      console.warn('AI 분석 생성 실패:', aiError);
    }

    // 9. 별자리 분석 통합
    const zodiacAnalysis = integrateZodiacAnalysis(input.birthDate);

    // 결과 객체
    const result: AnalysisResult = {
      user: input,
      saju,
      oheng: ohengResult.balance,
      scores,
      yongsin: ohengResult.yongsin,
      gisin: ohengResult.gisin,
      personality,
      peerComparison,
      coreMessage,
      aiAnalysis
    };

    // Supabase에 저장 (인증된 사용자인 경우)
    let userId: string | null = null;
    let analysisId: string | null = null;
    let pointBalance = null;
    let freeAnalysisStatus = { canUse: true, remaining: 3, limit: 3 };
    let isBlinded = true; // 무료 분석은 기본적으로 블라인드
    let isAdmin = false;
    let usedPoints = 0;

    // 관리자 이메일 목록
    const ADMIN_EMAILS = ['mymiryu@gmail.com'];

    try {
      const supabase = await createClient();
      const { data: { user } } = await supabase.auth.getUser();

      if (user) {
        userId = user.id;

        // 관리자 확인
        isAdmin = user.email ? ADMIN_EMAILS.includes(user.email) : false;

        // 포인트 잔액 조회
        pointBalance = await getPointBalance(userId);

        if (isAdmin) {
          // 관리자: 무제한 무료 (포인트 차감 없음)
          freeAnalysisStatus = { canUse: true, remaining: 999, limit: 999 };
          isBlinded = false;
        } else {
          // 일반 사용자: 무료 분석 횟수 확인
          freeAnalysisStatus = await canUseFreeAnalysis(userId);

          if (freeAnalysisStatus.canUse) {
            // 무료 분석 가능 → 사용
            await incrementFreeAnalysis(userId);
            isBlinded = true;
          } else {
            // 무료 분석 소진 → 포인트로 결제
            const currentPoints = pointBalance?.points || 0;
            const analysisCost = PRODUCT_COSTS.basic; // 500 포인트

            if (currentPoints >= analysisCost) {
              // 포인트 차감
              const deductResult = await deductPoints(userId, 'basic');
              if (deductResult.success) {
                usedPoints = analysisCost;
                isBlinded = false; // 포인트 결제 시 블라인드 해제
                // 포인트 잔액 업데이트
                pointBalance = await getPointBalance(userId);
              } else {
                return NextResponse.json({
                  success: false,
                  error: '포인트 차감에 실패했습니다.',
                  data: { pointBalance, upgradeCost: PRODUCT_COSTS.basic }
                }, { status: 500 });
              }
            } else {
              // 포인트 부족
              return NextResponse.json({
                success: false,
                error: '오늘의 무료 분석 횟수를 모두 사용했습니다. 포인트를 충전해주세요.',
                errorCode: 'INSUFFICIENT_POINTS',
                data: {
                  freeAnalysisStatus,
                  pointBalance: {
                    current: currentPoints,
                    required: analysisCost,
                    shortage: analysisCost - currentPoints
                  },
                  upgradeCost: PRODUCT_COSTS.basic,
                }
              }, { status: 402 });
            }
          }
        }

        // 분석 결과 저장
        const saveResult = await saveAnalysisResult(userId, result, {
          isPremium: !isBlinded,
          isBlinded: isBlinded,
          productType: usedPoints > 0 ? 'basic' : 'free',
          pointsPaid: usedPoints,
          zodiacData: zodiacAnalysis,
        });

        if (saveResult.id) {
          analysisId = saveResult.id;
        }

        // 포인트 잔액 업데이트
        pointBalance = await getPointBalance(userId);
        if (!isAdmin) {
          freeAnalysisStatus = await canUseFreeAnalysis(userId);
        }
      }
    } catch (dbError) {
      console.warn('DB 저장 실패:', dbError);
    }

    // 블라인드 처리 (관리자/포인트 결제 제외)
    const blindedResult = isBlinded ? blindFreeAnalysis(result) : result;

    return NextResponse.json({
      success: true,
      data: {
        result: blindedResult,
        fullResult: !isBlinded ? result : null, // 관리자/포인트결제에게만 제공
        ohengActions,
        zodiacAnalysis, // 별자리 분석 포함
        isBlinded,
        conversion: {
          paywallTemplate,
          urgencyBanner,
          socialProof,
          productRecommendation
        }
      },
      meta: {
        userId,
        analysisId,
        timestamp: new Date().toISOString(),
        pointBalance: pointBalance ? {
          current: pointBalance.points,
          isPremium: isAdmin,
        } : null,
        freeAnalysis: freeAnalysisStatus,
        isAdmin,
        usedPoints,
        upgradeCost: {
          basic: PRODUCT_COSTS.basic,
          deep: PRODUCT_COSTS.deep,
          premium: PRODUCT_COSTS.premium,
        }
      }
    });

  } catch (error) {
    console.error('Analysis error:', error);
    return NextResponse.json(
      { success: false, error: '분석 중 오류가 발생했습니다.' },
      { status: 500 }
    );
  }
}

/**
 * 운세 점수 계산
 */
function calculateFortuneScores(
  saju: any,
  oheng: { balance: any; yongsin: string[]; gisin: string[]; dayMasterStrength: string }
): {
  overall: number;
  wealth: number;
  love: number;
  career: number;
  health: number;
} {
  const dayMaster = saju.day.element;
  const balance = oheng.balance;

  // 기본 점수 (일간 강약에 따라)
  let baseScore = 70;
  if (oheng.dayMasterStrength === 'balanced') {
    baseScore = 80;
  } else if (oheng.dayMasterStrength === 'strong') {
    baseScore = 75;
  }

  // 해시 기반 일관된 점수 생성
  const hash = (str: string) => {
    let h = 0;
    for (let i = 0; i < str.length; i++) {
      h = ((h << 5) - h) + str.charCodeAt(i);
    }
    return Math.abs(h);
  };

  const generateScore = (seed: string, bonus: number = 0) => {
    const h = hash(dayMaster + saju.day.earthlyBranch + seed);
    const variance = (h % 20) - 10;
    return Math.max(50, Math.min(95, baseScore + variance + bonus));
  };

  // 오행별 보너스
  const wealthBonus = balance.metal >= 2 ? 8 : balance.metal >= 1 ? 4 : 0;
  const careerBonus = balance.wood >= 2 ? 8 : balance.fire >= 2 ? 6 : 0;
  const loveBonus = balance.fire >= 2 ? 8 : balance.water >= 2 ? 5 : 0;
  const healthBonus = oheng.dayMasterStrength === 'balanced' ? 10 : 0;

  return {
    overall: generateScore('overall'),
    wealth: generateScore('wealth', wealthBonus),
    love: generateScore('love', loveBonus),
    career: generateScore('career', careerBonus),
    health: generateScore('health', healthBonus)
  };
}

/**
 * 성격 분석
 */
function analyzePersonality(
  saju: any,
  mbti?: string,
  bloodType?: string
): PersonalityAnalysis {
  const dayMasterTraits: Record<string, string[]> = {
    '甲': ['추진력이 강함', '리더십 있음', '정의감이 강함', '때로는 고집스러움'],
    '乙': ['유연하고 적응력 높음', '협조적', '섬세함', '우유부단할 수 있음'],
    '丙': ['밝고 활기참', '열정적', '사교적', '충동적일 수 있음'],
    '丁': ['섬세하고 따뜻함', '지적이고 분석적', '헌신적', '내성적일 수 있음'],
    '戊': ['듬직하고 신뢰감', '책임감 강함', '실용적', '보수적일 수 있음'],
    '己': ['배려심 깊음', '인내심 강함', '꼼꼼함', '소극적일 수 있음'],
    '庚': ['결단력 있음', '정의로움', '실행력 강함', '완고할 수 있음'],
    '辛': ['섬세하고 세련됨', '미적 감각 뛰어남', '완벽주의', '예민할 수 있음'],
    '壬': ['지혜롭고 포용적', '창의적', '유연함', '변덕스러울 수 있음'],
    '癸': ['직관적', '감수성 풍부', '깊은 사고', '감정 기복 있을 수 있음']
  };

  const sajuTraits = dayMasterTraits[saju.day.heavenlyStem] || ['분석 중'];

  // MBTI 특성
  const mbtiTraitsMap: Record<string, string[]> = {
    'INTJ': ['전략적 사고', '독립적', '혁신적'],
    'INTP': ['논리적', '분석적', '호기심 많음'],
    'ENTJ': ['리더십', '결단력', '효율 중시'],
    'ENTP': ['창의적', '논쟁적', '다재다능'],
    'INFJ': ['통찰력', '이상주의', '헌신적'],
    'INFP': ['이상주의', '창의적', '공감 능력'],
    'ENFJ': ['카리스마', '이타적', '설득력'],
    'ENFP': ['열정적', '창의적', '사교적'],
    'ISTJ': ['신뢰성', '체계적', '책임감'],
    'ISFJ': ['배려심', '충실함', '헌신적'],
    'ESTJ': ['조직적', '실용적', '리더십'],
    'ESFJ': ['사교적', '협조적', '배려심'],
    'ISTP': ['논리적', '실용적', '독립적'],
    'ISFP': ['예술적', '온화함', '적응력'],
    'ESTP': ['활동적', '현실적', '대담함'],
    'ESFP': ['사교적', '낙천적', '유연함']
  };

  const mbtiTraits = mbti ? mbtiTraitsMap[mbti] : undefined;

  // 교차 분석
  let crossAnalysis = {
    matchRate: 75,
    synergy: '기본적인 시너지가 있습니다',
    conflict: '상황에 따른 갈등이 있을 수 있습니다',
    resolution: '상호 이해와 소통으로 해결 가능합니다'
  };

  if (mbti) {
    crossAnalysis = calculateCrossAnalysis(saju.day.heavenlyStem, mbti);
  }

  // 핵심 키워드 생성
  const coreKeyword = generateCoreKeyword(saju.day.heavenlyStem, mbti);

  return {
    sajuTraits,
    mbtiTraits,
    crossAnalysis,
    coreKeyword
  };
}

/**
 * 사주-MBTI 교차 분석
 */
function calculateCrossAnalysis(
  dayStem: string,
  mbti: string
): PersonalityAnalysis['crossAnalysis'] {
  // 일간-MBTI 궁합 테이블 (간략화)
  const matchTable: Record<string, Record<string, number>> = {
    '甲': { 'ENTJ': 90, 'ESTJ': 85, 'INTJ': 82, 'ENTP': 78 },
    '乙': { 'INFP': 88, 'ENFP': 85, 'ISFP': 80, 'INFJ': 78 },
    '丙': { 'ENFP': 90, 'ESFP': 88, 'ENFJ': 85, 'ESTP': 82 },
    '丁': { 'INTJ': 88, 'INFJ': 90, 'INTP': 82, 'INFP': 80 },
    '戊': { 'ISTJ': 90, 'ESTJ': 88, 'ISFJ': 85, 'ESFJ': 82 },
    '己': { 'ISFJ': 90, 'ESFJ': 88, 'INFJ': 82, 'ISTJ': 80 },
    '庚': { 'ENTJ': 88, 'ESTJ': 90, 'INTJ': 85, 'ISTJ': 82 },
    '辛': { 'INTJ': 85, 'INFJ': 82, 'ISFP': 88, 'INFP': 80 },
    '壬': { 'ENTP': 90, 'INTP': 88, 'ENFP': 82, 'INFP': 80 },
    '癸': { 'INFP': 90, 'INFJ': 88, 'INTP': 85, 'ISFP': 82 }
  };

  const baseMatch = matchTable[dayStem]?.[mbti] || 75;

  if (baseMatch >= 85) {
    return {
      matchRate: baseMatch,
      synergy: '높은 일관성 - 내면과 외면이 조화롭습니다. 자신의 강점을 잘 발휘할 수 있습니다.',
      conflict: '과도한 일관성으로 인해 경직될 수 있습니다. 다양한 관점 수용이 필요합니다.',
      resolution: '새로운 시도와 다른 의견에 열린 자세를 가지세요.'
    };
  } else if (baseMatch >= 70) {
    return {
      matchRate: baseMatch,
      synergy: '보완적 구조 - 서로 다른 면이 균형을 이룹니다.',
      conflict: '내면 갈등이 있을 수 있어 중요 결정 시 혼란이 올 수 있습니다.',
      resolution: '중요 결정 전 24시간 숙고하고, 신뢰할 수 있는 사람의 조언을 구하세요.'
    };
  }

  return {
    matchRate: baseMatch,
    synergy: '독특한 조합 - 다양한 가능성이 있습니다.',
    conflict: '자기 이해에 시간이 필요할 수 있습니다.',
    resolution: '자기 성찰의 시간을 갖고, 다양한 경험을 통해 자신을 알아가세요.'
  };
}

/**
 * 핵심 키워드 생성
 */
function generateCoreKeyword(dayStem: string, mbti?: string): string {
  const keywords: Record<string, Record<string, string>> = {
    '甲': { 'ENTJ': '정복하는 리더', 'ESTJ': '실행하는 장군', 'default': '성장하는 나무' },
    '乙': { 'INFP': '꿈꾸는 풀꽃', 'ENFP': '춤추는 덩굴', 'default': '유연한 풀' },
    '丙': { 'ENFP': '빛나는 태양', 'ESFP': '열정의 불꽃', 'default': '뜨거운 태양' },
    '丁': { 'INTJ': '따뜻한 전략가', 'INFJ': '섬세한 촛불', 'default': '조용한 촛불' },
    '戊': { 'ISTJ': '든든한 산', 'ESTJ': '굳건한 대지', 'default': '믿음직한 대지' },
    '己': { 'ISFJ': '기르는 땅', 'ESFJ': '품는 대지', 'default': '부드러운 흙' },
    '庚': { 'ENTJ': '결단의 검', 'ESTJ': '정의의 도끼', 'default': '날카로운 쇠' },
    '辛': { 'INTJ': '빛나는 보석', 'ISFP': '섬세한 귀금속', 'default': '정교한 금' },
    '壬': { 'ENTP': '흐르는 강', 'INTP': '깊은 바다', 'default': '넓은 바다' },
    '癸': { 'INFP': '촉촉한 이슬', 'INFJ': '고요한 샘물', 'default': '맑은 시냇물' }
  };

  if (mbti && keywords[dayStem]?.[mbti]) {
    return keywords[dayStem][mbti];
  }

  return keywords[dayStem]?.default || '독자적 존재';
}
