import createMiddleware from 'next-intl/middleware';
import { type NextRequest, NextResponse } from 'next/server';
import { createServerClient } from '@supabase/ssr';
import { routing } from '@/i18n/routing';

// Admin 허용 이메일 목록
const ADMIN_EMAILS = ['mymiryu@gmail.com'];

// Admin 전용 라우트
const ADMIN_ROUTES = ['/admin'];

// 보호된 라우트 (로그인 필요)
const PROTECTED_ROUTES = ['/my/'];

// 인증이 필요 없는 라우트
const PUBLIC_ROUTES = [
  '/login',
  '/signup',
  '/auth',
  '/fortune/free',
  '/fortune/saju',
  '/fortune/tarot',
  '/pricing',
  '/terms',
  '/privacy',
  '/refund',
];

const intlMiddleware = createMiddleware(routing);

export default async function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // API 라우트는 별도 처리
  if (pathname.startsWith('/api/')) {
    // Admin API는 인증 필요
    if (pathname.startsWith('/api/admin')) {
      return await checkAdminApiAuth(request);
    }
    return NextResponse.next();
  }

  // locale prefix 제거하여 실제 경로 확인
  const pathWithoutLocale = pathname.replace(/^\/(ko|ja|en)/, '') || '/';

  // Public 라우트는 인증 불필요
  const isPublicRoute = PUBLIC_ROUTES.some(route =>
    pathWithoutLocale.startsWith(route) || pathWithoutLocale === route
  );

  // Admin 라우트 체크
  const isAdminRoute = ADMIN_ROUTES.some(route =>
    pathWithoutLocale.startsWith(route)
  );

  // Protected 라우트 체크
  const isProtectedRoute = PROTECTED_ROUTES.some(route =>
    pathWithoutLocale.startsWith(route)
  );

  // Admin 또는 Protected 라우트인 경우 인증 체크
  if ((isAdminRoute || isProtectedRoute) && !isPublicRoute) {
    const authResult = await checkPageAuth(request, isAdminRoute);
    if (authResult) {
      return authResult;
    }
  }

  // i18n 미들웨어 적용
  return intlMiddleware(request);
}

async function checkPageAuth(request: NextRequest, requireAdmin: boolean = false): Promise<NextResponse | null> {
  try {
    // 환경변수 체크
    if (!process.env.NEXT_PUBLIC_SUPABASE_URL || !process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY) {
      console.error('[Proxy] Missing Supabase environment variables');
      return null; // 환경변수 없으면 인증 스킵 (페이지에서 처리)
    }

    const response = NextResponse.next();

    const supabase = createServerClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
      {
        cookies: {
          getAll() {
            return request.cookies.getAll();
          },
          setAll(cookiesToSet) {
            cookiesToSet.forEach(({ name, value, options }) => {
              response.cookies.set(name, value, options);
            });
          },
        },
      }
    );

    const { data: { user }, error } = await supabase.auth.getUser();

    // 인증 실패 시 로그인 페이지로 리다이렉트
    if (error || !user) {
      const locale = request.nextUrl.pathname.match(/^\/(ko|ja|en)/)?.[1] || 'ko';
      const loginUrl = new URL(`/${locale}/login`, request.url);
      loginUrl.searchParams.set('redirect', request.nextUrl.pathname);
      return NextResponse.redirect(loginUrl);
    }

    // Admin 라우트인 경우 Admin 이메일 체크
    if (requireAdmin) {
      const userEmail = user.email?.toLowerCase();
      if (!userEmail || !ADMIN_EMAILS.includes(userEmail)) {
        // Admin이 아닌 경우 홈으로 리다이렉트
        const locale = request.nextUrl.pathname.match(/^\/(ko|ja|en)/)?.[1] || 'ko';
        return NextResponse.redirect(new URL(`/${locale}`, request.url));
      }
    }

    return null; // 인증 통과
  } catch (err) {
    console.error('[Proxy] Auth check error:', err);
    return null; // 에러 시 인증 스킵 (페이지에서 처리)
  }
}

async function checkAdminApiAuth(request: NextRequest): Promise<NextResponse> {
  try {
    // 환경변수 체크
    if (!process.env.NEXT_PUBLIC_SUPABASE_URL || !process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY) {
      console.error('[Proxy] Missing Supabase environment variables');
      return NextResponse.json({ error: 'Server configuration error' }, { status: 500 });
    }

    const supabase = createServerClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
      {
        cookies: {
          getAll() {
            return request.cookies.getAll();
          },
          setAll() {},
        },
      }
    );

    const { data: { user }, error } = await supabase.auth.getUser();

    if (error || !user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const userEmail = user.email?.toLowerCase();
    if (!userEmail || !ADMIN_EMAILS.includes(userEmail)) {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
    }

    return NextResponse.next();
  } catch (err) {
    console.error('[Proxy] Admin API auth error:', err);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

export const config = {
  matcher: [
    // Match all pathnames except for
    // - /_next (Next.js internals)
    // - /_vercel (Vercel internals)
    // - /static (static files)
    // - files with extensions
    '/((?!_next|_vercel|static|.*\\..*).*)',
  ],
};
