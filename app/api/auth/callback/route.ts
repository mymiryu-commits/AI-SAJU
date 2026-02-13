import { createServerClient } from '@supabase/ssr';
import { cookies } from 'next/headers';
import { NextRequest, NextResponse } from 'next/server';
import type { Database } from '@/types/database';

const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://bnlrrlnjisokppslkmck.supabase.co';
const SUPABASE_ANON_KEY = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImJubHJybG5qaXNva3Bwc2xrbWNrIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjgxNDMxMzQsImV4cCI6MjA4MzcxOTEzNH0.TGPZpr7Vu5TyadoU71-7BxgmNNMwzRME4rJcB9e42Jw';

export async function GET(request: NextRequest) {
  const requestUrl = new URL(request.url);
  const code = requestUrl.searchParams.get('code');
  const next = requestUrl.searchParams.get('next') ?? '/';
  const error = requestUrl.searchParams.get('error');
  const errorDescription = requestUrl.searchParams.get('error_description');

  console.log('[Auth Callback] Request URL:', request.url);
  console.log('[Auth Callback] Code:', code ? 'present' : 'missing');
  console.log('[Auth Callback] Next:', next);
  console.log('[Auth Callback] Error:', error);
  console.log('[Auth Callback] Error Description:', errorDescription);

  // OAuth 에러 처리
  if (error) {
    console.error('[Auth Callback] OAuth error:', error, errorDescription);
    const errorUrl = new URL('/auth/auth-code-error', requestUrl.origin);
    errorUrl.searchParams.set('error', error);
    if (errorDescription) {
      errorUrl.searchParams.set('error_description', errorDescription);
    }
    return NextResponse.redirect(errorUrl);
  }

  if (code) {
    const cookieStore = await cookies();

    // 쿠키를 Response에 설정하기 위한 임시 저장소
    const cookiesToSet: Array<{ name: string; value: string; options: any }> = [];

    const supabase = createServerClient<Database>(
      SUPABASE_URL,
      SUPABASE_ANON_KEY,
      {
        cookies: {
          getAll() {
            const allCookies = cookieStore.getAll();
            console.log('[Auth Callback] Getting cookies:', allCookies.map(c => c.name));
            return allCookies;
          },
          setAll(cookies) {
            console.log('[Auth Callback] Setting cookies:', cookies.map(c => c.name));
            cookies.forEach((cookie) => {
              cookiesToSet.push(cookie);
            });
          },
        },
      }
    );

    try {
      const { data, error: exchangeError } = await supabase.auth.exchangeCodeForSession(code);

      if (exchangeError) {
        console.error('[Auth Callback] Exchange error:', exchangeError.message);
        const errorUrl = new URL('/auth/auth-code-error', requestUrl.origin);
        errorUrl.searchParams.set('error', 'exchange_failed');
        errorUrl.searchParams.set('error_description', exchangeError.message);
        return NextResponse.redirect(errorUrl);
      }

      console.log('[Auth Callback] Exchange successful, user:', data?.user?.email);
      console.log('[Auth Callback] Cookies to set:', cookiesToSet.length);

      // 안전한 리다이렉트 경로 결정
      let redirectPath = next;
      if (!redirectPath.startsWith('/')) {
        redirectPath = '/';
      }

      const redirectUrl = new URL(redirectPath, requestUrl.origin);
      const response = NextResponse.redirect(redirectUrl);

      // Response에 쿠키 설정
      for (const cookie of cookiesToSet) {
        console.log('[Auth Callback] Setting cookie:', cookie.name);
        response.cookies.set(cookie.name, cookie.value, {
          ...cookie.options,
          // 쿠키 옵션 강제 설정
          path: '/',
          sameSite: 'lax',
          secure: process.env.NODE_ENV === 'production',
        });
      }

      return response;
    } catch (err) {
      console.error('[Auth Callback] Exception:', err);
      const errorUrl = new URL('/auth/auth-code-error', requestUrl.origin);
      errorUrl.searchParams.set('error', 'exception');
      errorUrl.searchParams.set('error_description', err instanceof Error ? err.message : 'Unknown error');
      return NextResponse.redirect(errorUrl);
    }
  }

  // code가 없는 경우
  console.error('[Auth Callback] No code provided');
  const errorUrl = new URL('/auth/auth-code-error', requestUrl.origin);
  errorUrl.searchParams.set('error', 'no_code');
  errorUrl.searchParams.set('error_description', 'Authorization code not provided');
  return NextResponse.redirect(errorUrl);
}
