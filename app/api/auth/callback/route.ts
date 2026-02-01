import { createClient } from '@/lib/supabase/server';
import { NextResponse } from 'next/server';

// 허용된 리다이렉트 경로 (prefix 매칭)
const ALLOWED_REDIRECT_PREFIXES = [
  '/my/',
  '/fortune/',
  '/pricing',
  '/admin',
  '/',
];

// 리다이렉트 경로 검증
function isAllowedRedirect(path: string): boolean {
  // 빈 경로이거나 홈 경로는 허용
  if (!path || path === '/') return true;

  // 외부 URL 차단 (프로토콜 포함 시)
  if (path.includes('://') || path.startsWith('//')) return false;

  // 허용된 경로 prefix 체크
  return ALLOWED_REDIRECT_PREFIXES.some(prefix => path.startsWith(prefix));
}

// 안전한 리다이렉트 경로 생성
function getSafeRedirectPath(next: string | null): string {
  const defaultPath = '/';

  if (!next) return defaultPath;

  // URL 디코딩 및 정규화
  try {
    const decodedPath = decodeURIComponent(next);
    // 상대 경로만 허용 (/ 로 시작해야 함)
    if (!decodedPath.startsWith('/')) return defaultPath;

    // 허용된 경로인지 확인
    if (!isAllowedRedirect(decodedPath)) {
      console.warn(`[Auth] Blocked redirect to: ${decodedPath}`);
      return defaultPath;
    }

    return decodedPath;
  } catch {
    return defaultPath;
  }
}

export async function GET(request: Request) {
  const { searchParams, origin } = new URL(request.url);
  const code = searchParams.get('code');
  const next = searchParams.get('next');

  if (code) {
    const supabase = await createClient();
    const { error } = await supabase.auth.exchangeCodeForSession(code);

    if (!error) {
      const safePath = getSafeRedirectPath(next);
      return NextResponse.redirect(`${origin}${safePath}`);
    }
  }

  // Return the user to an error page with instructions
  return NextResponse.redirect(`${origin}/auth/auth-code-error`);
}
