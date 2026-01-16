import createMiddleware from 'next-intl/middleware';
import { type NextRequest, NextResponse } from 'next/server';
import { updateSession } from '@/lib/supabase/session';
import { routing } from '@/i18n/routing';

const intlMiddleware = createMiddleware(routing);

export default async function proxy(request: NextRequest) {
  // Update Supabase session
  const response = await updateSession(request);

  // Handle internationalization
  const intlResponse = intlMiddleware(request);

  // Merge headers from both middlewares
  intlResponse.headers.forEach((value, key) => {
    response.headers.set(key, value);
  });

  return response;
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
