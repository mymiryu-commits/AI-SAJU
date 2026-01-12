import createMiddleware from 'next-intl/middleware';
import { type NextRequest, NextResponse } from 'next/server';
import { updateSession } from '@/lib/supabase/middleware';
import { routing } from '@/i18n/routing';

const intlMiddleware = createMiddleware(routing);

export async function middleware(request: NextRequest) {
  // Handle internationalization first
  const intlResponse = intlMiddleware(request);

  // If intl middleware returns a redirect, return it immediately
  if (intlResponse.status !== 200) {
    return intlResponse;
  }

  // Update Supabase session
  try {
    const sessionResponse = await updateSession(request);

    // Merge headers from intl middleware
    intlResponse.headers.forEach((value, key) => {
      sessionResponse.headers.set(key, value);
    });

    return sessionResponse;
  } catch (error) {
    // If session update fails, still return the intl response
    console.error('Session update failed:', error);
    return intlResponse;
  }
}

export const config = {
  matcher: [
    // Match all pathnames except for
    // - /api (API routes)
    // - /_next (Next.js internals)
    // - /_vercel (Vercel internals)
    // - /static (static files)
    // - files with extensions
    '/((?!api|_next|_vercel|static|.*\\..*).*)',
  ],
};
