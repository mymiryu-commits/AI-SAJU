/**
 * 포인트 관리 서비스
 * - 포인트 조회/차감/충전
 * - 프리미엄 기능 접근 권한 확인
 */

import { createClient } from '@/lib/supabase/server';

// 상품별 포인트 비용 (1P = 1원)
export const PRODUCT_COSTS = {
  free: 0,            // 무료 분석 (2장 카드: 근본, 본질)
  basic: 500,         // 베이직 분석 (4장 카드: +에너지, 재능)
  deep: 1000,         // 심층 분석 (6장 카드: +흐름, 수호) - 권장
  premium: 2000,      // 프리미엄 분석 (전체 + 타임라인, 가족영향)
  vip: 5000,          // VIP 종합 분석 (모든 분석 + 전문가 상담)
  pdf: 200,           // PDF 다운로드
  voice: 300,         // 음성 생성
  group: 1500,        // 그룹 분석
} as const;

// 상품별 해금 카드 (누적)
export const PRODUCT_CARDS = {
  free: ['root', 'essence'],                                      // 근본, 본질
  basic: ['root', 'essence', 'energy', 'talent'],                 // + 에너지, 재능
  deep: ['root', 'essence', 'energy', 'talent', 'flow', 'guardian'], // + 흐름, 수호
  premium: ['root', 'essence', 'energy', 'talent', 'flow', 'guardian'], // 전체
  vip: ['root', 'essence', 'energy', 'talent', 'flow', 'guardian'],    // 전체
} as const;

// 상품별 콘텐츠 레벨
export const PRODUCT_FEATURES = {
  free: {
    cards: 2,
    monthlyFortune: 1,      // 1개월 힌트만
    aiAnalysis: false,
    timeline: false,
    familyImpact: false,
    pdf: false,
  },
  basic: {
    cards: 4,
    monthlyFortune: 3,      // 3개월
    aiAnalysis: false,
    timeline: false,
    familyImpact: false,
    pdf: false,
  },
  deep: {
    cards: 6,
    monthlyFortune: 12,     // 12개월
    aiAnalysis: true,
    timeline: false,
    familyImpact: false,
    pdf: true,
  },
  premium: {
    cards: 6,
    monthlyFortune: 12,
    aiAnalysis: true,
    timeline: true,         // 인생 타임라인
    familyImpact: true,     // 가족 영향
    pdf: true,
  },
  vip: {
    cards: 6,
    monthlyFortune: 12,
    aiAnalysis: true,
    timeline: true,
    familyImpact: true,
    pdf: true,
    consultation: true,     // 전문가 상담
  },
} as const;

export type ProductType = keyof typeof PRODUCT_COSTS;

interface PointBalance {
  points: number;
  totalEarned: number;
  totalSpent: number;
  freeAnalysesToday: number;
  freeAnalysesLimit: number;
  isPremium: boolean;
  premiumUntil: Date | null;
}

interface PointDeductionResult {
  success: boolean;
  newBalance?: number;
  previousBalance?: number;
  error?: string;
  errorCode?: 'INSUFFICIENT_POINTS' | 'USER_NOT_FOUND' | 'TRANSACTION_FAILED';
}

/**
 * 사용자 포인트 잔액 조회
 */
export async function getPointBalance(userId: string): Promise<PointBalance | null> {
  const supabase = await createClient();

  const { data: profile, error } = await (supabase as any)
    .from('profiles')
    .select('points, total_points_earned, total_points_spent, free_analyses_today, free_analyses_limit, premium_until, last_analysis_date')
    .eq('id', userId)
    .single();

  if (error) {
    // 프로필이 없으면 생성
    if (error.code === 'PGRST116') {
      await createProfile(userId);
      return {
        points: 500, // 가입 보너스
        totalEarned: 500,
        totalSpent: 0,
        freeAnalysesToday: 0,
        freeAnalysesLimit: 3,
        isPremium: false,
        premiumUntil: null,
      };
    }
    return null;
  }

  // 날짜가 바뀌면 무료 분석 횟수 리셋
  const today = new Date().toISOString().split('T')[0];
  const lastDate = profile.last_analysis_date;
  const freeToday = lastDate === today ? (profile.free_analyses_today || 0) : 0;

  const premiumUntil = profile.premium_until ? new Date(profile.premium_until) : null;
  const isPremium = premiumUntil ? premiumUntil > new Date() : false;

  return {
    points: profile.points || 0,
    totalEarned: profile.total_points_earned || 0,
    totalSpent: profile.total_points_spent || 0,
    freeAnalysesToday: freeToday,
    freeAnalysesLimit: profile.free_analyses_limit || 3,
    isPremium,
    premiumUntil,
  };
}

/**
 * 프로필 생성 (가입 보너스 포함)
 */
async function createProfile(userId: string): Promise<void> {
  const supabase = await createClient();

  await (supabase as any)
    .from('profiles')
    .insert({
      id: userId,
      points: 500, // 가입 보너스
      total_points_earned: 500,
      total_points_spent: 0,
      free_analyses_today: 0,
      free_analyses_limit: 3,
    });

  // 가입 보너스 거래 기록
  await (supabase as any)
    .from('point_transactions')
    .insert({
      user_id: userId,
      type: 'bonus',
      amount: 500,
      balance_after: 500,
      description: '회원가입 보너스',
      reference_type: 'signup_bonus',
    });
}

/**
 * 포인트 차감
 */
export async function deductPoints(
  userId: string,
  productType: ProductType,
  referenceId?: string,
  description?: string
): Promise<PointDeductionResult> {
  const supabase = await createClient();
  const cost = PRODUCT_COSTS[productType];

  if (cost === 0) {
    return { success: true, newBalance: 0 };
  }

  // 현재 포인트 조회
  const balance = await getPointBalance(userId);
  if (!balance) {
    return {
      success: false,
      error: '로그인이 필요하거나 프로필 정보를 불러올 수 없습니다. 다시 로그인해주세요.',
      errorCode: 'USER_NOT_FOUND'
    };
  }

  // 포인트 부족 체크
  if (balance.points < cost) {
    return {
      success: false,
      error: `포인트가 부족합니다. 필요: ${cost}P, 보유: ${balance.points}P`,
      errorCode: 'INSUFFICIENT_POINTS',
      previousBalance: balance.points,
    };
  }

  // 포인트 차감
  const newPoints = balance.points - cost;

  const { error: updateError } = await (supabase as any)
    .from('profiles')
    .update({
      points: newPoints,
      total_points_spent: (balance.totalSpent || 0) + cost,
    })
    .eq('id', userId);

  if (updateError) {
    return { success: false, error: '포인트 차감 실패', errorCode: 'TRANSACTION_FAILED' };
  }

  // 거래 기록
  await (supabase as any)
    .from('point_transactions')
    .insert({
      user_id: userId,
      type: 'spend',
      amount: -cost,
      balance_after: newPoints,
      description: description || `${productType} 구매`,
      reference_type: 'analysis',
      reference_id: referenceId,
      metadata: { product: productType },
    });

  return {
    success: true,
    previousBalance: balance.points,
    newBalance: newPoints,
  };
}

/**
 * 무료 분석 횟수 증가
 */
export async function incrementFreeAnalysis(userId: string): Promise<boolean> {
  const supabase = await createClient();
  const today = new Date().toISOString().split('T')[0];

  // 현재 상태 조회
  const { data: profile } = await (supabase as any)
    .from('profiles')
    .select('free_analyses_today, last_analysis_date')
    .eq('id', userId)
    .single();

  const lastDate = profile?.last_analysis_date;
  const currentCount = lastDate === today ? (profile?.free_analyses_today || 0) : 0;

  // 업데이트
  const { error } = await (supabase as any)
    .from('profiles')
    .update({
      free_analyses_today: currentCount + 1,
      last_analysis_date: today,
      total_analyses: (profile?.total_analyses || 0) + 1,
    })
    .eq('id', userId);

  return !error;
}

/**
 * 프리미엄 기능 접근 권한 확인
 */
export async function canAccessPremium(userId: string): Promise<{
  canAccess: boolean;
  reason?: string;
  requiredPoints?: number;
  currentPoints?: number;
}> {
  const balance = await getPointBalance(userId);

  if (!balance) {
    return { canAccess: false, reason: '로그인이 필요합니다' };
  }

  // 프리미엄 구독자는 무제한
  if (balance.isPremium) {
    return { canAccess: true };
  }

  // 포인트 확인
  if (balance.points >= PRODUCT_COSTS.premium) {
    return { canAccess: true };
  }

  return {
    canAccess: false,
    reason: '포인트가 부족합니다',
    requiredPoints: PRODUCT_COSTS.premium,
    currentPoints: balance.points,
  };
}

/**
 * 무료 분석 가능 여부 확인
 */
export async function canUseFreeAnalysis(userId: string | null): Promise<{
  canUse: boolean;
  remaining: number;
  limit: number;
}> {
  if (!userId) {
    // 비로그인 사용자도 분석 가능 (저장 안 됨)
    return { canUse: true, remaining: 1, limit: 1 };
  }

  const balance = await getPointBalance(userId);

  if (!balance) {
    return { canUse: true, remaining: 3, limit: 3 };
  }

  // 프리미엄 사용자는 무제한
  if (balance.isPremium) {
    return { canUse: true, remaining: 999, limit: 999 };
  }

  const remaining = balance.freeAnalysesLimit - balance.freeAnalysesToday;

  return {
    canUse: remaining > 0,
    remaining: Math.max(0, remaining),
    limit: balance.freeAnalysesLimit,
  };
}

/**
 * 포인트 충전 (결제 완료 후 호출)
 */
export async function chargePoints(
  userId: string,
  points: number,
  bonusPoints: number = 0,
  paymentId?: string
): Promise<{ success: boolean; newBalance?: number; error?: string }> {
  const supabase = await createClient();
  const totalPoints = points + bonusPoints;

  // 현재 포인트 조회
  const balance = await getPointBalance(userId);
  if (!balance) {
    return { success: false, error: '프로필 정보를 불러올 수 없습니다. 다시 로그인해주세요.' };
  }

  const newPoints = balance.points + totalPoints;

  // 포인트 추가
  const { error: updateError } = await (supabase as any)
    .from('profiles')
    .update({
      points: newPoints,
      total_points_earned: (balance.totalEarned || 0) + totalPoints,
    })
    .eq('id', userId);

  if (updateError) {
    return { success: false, error: '포인트 충전 실패' };
  }

  // 거래 기록
  await (supabase as any)
    .from('point_transactions')
    .insert({
      user_id: userId,
      type: 'charge',
      amount: totalPoints,
      balance_after: newPoints,
      description: bonusPoints > 0
        ? `포인트 충전 ${points}P + 보너스 ${bonusPoints}P`
        : `포인트 충전 ${points}P`,
      reference_type: 'payment',
      reference_id: paymentId,
      metadata: { basePoints: points, bonusPoints },
    });

  return { success: true, newBalance: newPoints };
}

export default {
  getPointBalance,
  deductPoints,
  chargePoints,
  canAccessPremium,
  canUseFreeAnalysis,
  incrementFreeAnalysis,
  PRODUCT_COSTS,
};
