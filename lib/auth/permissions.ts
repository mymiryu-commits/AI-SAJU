/**
 * 사용자 권한 및 프리미엄 체크 유틸리티
 */

import { createClient } from '@/lib/supabase/client';

// 관리자 이메일 목록 (환경변수에서도 설정 가능)
const ADMIN_EMAILS = [
  'admin@ai-planx.com',
  'mymiryu@gmail.com',
  // 추가 관리자 이메일
];

export type UserRole = 'guest' | 'user' | 'premium' | 'admin';

export interface UserPermissions {
  role: UserRole;
  isPremium: boolean;
  isAdmin: boolean;
  canAccessFeature: (feature: string) => boolean;
}

/**
 * 현재 사용자의 권한 정보 가져오기
 */
export async function getUserPermissions(): Promise<UserPermissions> {
  const supabase = createClient();

  try {
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
      return createPermissions('guest', false, false);
    }

    // 관리자 체크
    const isAdmin = ADMIN_EMAILS.includes(user.email || '') ||
      user.app_metadata?.role === 'admin';

    // 프리미엄 구독 체크
    const { data: subscription } = await supabase
      .from('subscriptions')
      .select('status, tier')
      .eq('user_id', user.id)
      .eq('status', 'active')
      .single();

    // 관리자는 자동 프리미엄, 또는 활성 구독이 있거나, 메타데이터에 프리미엄 설정된 경우
    const isPremium = isAdmin ||
      !!subscription ||
      user.app_metadata?.premium === true;

    const role: UserRole = isAdmin
      ? 'admin'
      : isPremium
      ? 'premium'
      : 'user';

    return createPermissions(role, isPremium, isAdmin);
  } catch (error) {
    console.error('Failed to get user permissions:', error);
    return createPermissions('guest', false, false);
  }
}

/**
 * 권한 객체 생성
 */
function createPermissions(
  role: UserRole,
  isPremium: boolean,
  isAdmin: boolean
): UserPermissions {
  return {
    role,
    isPremium,
    isAdmin,
    canAccessFeature: (feature: string) => {
      // 관리자는 모든 기능 접근 가능
      if (isAdmin) return true;

      // 프리미엄 기능 목록
      const premiumFeatures = [
        'lotto_ai_analysis',
        'lotto_backtest',
        'lotto_simulation',
        'saju_premium',
        'saju_pdf',
        'saju_audio',
        'face_advanced',
        'group_compatibility',
        'expert_consultation',
      ];

      // 무료 기능
      const freeFeatures = [
        'lotto_basic',
        'saju_basic',
        'daily_fortune',
        'saved_numbers',
      ];

      if (freeFeatures.includes(feature)) return true;
      if (premiumFeatures.includes(feature)) return isPremium;

      return false;
    },
  };
}

/**
 * 관리자 여부 체크 (간단한 버전)
 */
export async function isAdmin(): Promise<boolean> {
  const permissions = await getUserPermissions();
  return permissions.isAdmin;
}

/**
 * 프리미엄 여부 체크 (간단한 버전)
 */
export async function isPremiumUser(): Promise<boolean> {
  const permissions = await getUserPermissions();
  return permissions.isPremium;
}

/**
 * 특정 이메일이 관리자인지 체크 (서버사이드용)
 */
export function isAdminEmail(email: string): boolean {
  return ADMIN_EMAILS.includes(email);
}

/**
 * 환경변수에서 관리자 이메일 목록 가져오기
 */
export function getAdminEmails(): string[] {
  const envAdmins = process.env.ADMIN_EMAILS?.split(',').map(e => e.trim()) || [];
  return [...new Set([...ADMIN_EMAILS, ...envAdmins])];
}
