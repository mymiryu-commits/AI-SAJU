import { createServerClient } from '@supabase/ssr';
import { cookies } from 'next/headers';
import { NextResponse } from 'next/server';
import type { Database } from '@/types/database';

const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://bnlrrlnjisokppslkmck.supabase.co';
const SUPABASE_ANON_KEY = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImJubHJybG5qaXNva3Bwc2xrbWNrIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjgxNDMxMzQsImV4cCI6MjA4MzcxOTEzNH0.TGPZpr7Vu5TyadoU71-7BxgmNNMwzRME4rJcB9e42Jw';

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
    const cookieStore = await cookies();

    // 쿠키를 Response에 설정하기 위한 임시 저장소
    const cookiesToSet: { name: string; value: string; options: any }[] = [];

    const supabase = createServerClient<Database>(
      SUPABASE_URL,
      SUPABASE_ANON_KEY,
      {
        cookies: {
          getAll() {
            return cookieStore.getAll();
          },
          setAll(cookies) {
            // 쿠키 설정을 나중에 Response에 적용하기 위해 저장
            cookies.forEach((cookie) => {
              cookiesToSet.push(cookie);
            });
          },
        },
      }
    );

    const { error } = await supabase.auth.exchangeCodeForSession(code);

    if (!error) {
      const safePath = getSafeRedirectPath(next);
      const response = NextResponse.redirect(`${origin}${safePath}`);

      // Response에 쿠키 설정
      cookiesToSet.forEach(({ name, value, options }) => {
        response.cookies.set(name, value, options);
      });

      return response;
    } else {
      console.error('[Auth Callback] Error exchanging code:', error.message);
    }
  }

  // Return the user to an error page with instructions
  return NextResponse.redirect(`${origin}/auth/auth-code-error`);
}
