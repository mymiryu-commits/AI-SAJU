'use client';

import { useState, useEffect } from 'react';
import type { UserPermissions, UserRole } from '@/lib/auth/permissions';

const defaultPermissions: UserPermissions = {
  role: 'guest',
  isPremium: false,
  isAdmin: false,
  canAccessFeature: () => false,
};

/**
 * 사용자 권한 Hook
 * 클라이언트에서 사용자 권한 정보를 가져옴
 */
export function usePermissions() {
  const [permissions, setPermissions] = useState<UserPermissions>(defaultPermissions);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadPermissions() {
      try {
        const { getUserPermissions } = await import('@/lib/auth/permissions');
        const perms = await getUserPermissions();
        setPermissions(perms);
      } catch (error) {
        console.error('Failed to load permissions:', error);
        setPermissions(defaultPermissions);
      } finally {
        setLoading(false);
      }
    }

    loadPermissions();
  }, []);

  return { ...permissions, loading };
}

/**
 * 프리미엄 여부만 체크하는 간단한 Hook
 */
export function useIsPremium() {
  const { isPremium, loading } = usePermissions();
  return { isPremium, loading };
}

/**
 * 관리자 여부만 체크하는 간단한 Hook
 */
export function useIsAdmin() {
  const { isAdmin, loading } = usePermissions();
  return { isAdmin, loading };
}

/**
 * 특정 기능 접근 가능 여부 체크 Hook
 */
export function useCanAccessFeature(feature: string) {
  const { canAccessFeature, loading } = usePermissions();
  return { canAccess: canAccessFeature(feature), loading };
}
