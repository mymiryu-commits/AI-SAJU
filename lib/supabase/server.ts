import { createServerClient } from '@supabase/ssr';
import { createClient as createSupabaseClient } from '@supabase/supabase-js';
import { cookies } from 'next/headers';
import { Database } from '@/types/database';

// AI-SAJU-LOTTO Supabase Project
const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://bnlrrlnjisokppslkmck.supabase.co';
const SUPABASE_ANON_KEY = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImJubHJybG5qaXNva3Bwc2xrbWNrIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjgxNDMxMzQsImV4cCI6MjA4MzcxOTEzNH0.TGPZpr7Vu5TyadoU71-7BxgmNNMwzRME4rJcB9e42Jw';
const SUPABASE_SERVICE_ROLE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY || '';

export async function createClient() {
  const cookieStore = await cookies();

  return createServerClient<Database>(
    SUPABASE_URL,
    SUPABASE_ANON_KEY,
    {
      cookies: {
        getAll() {
          return cookieStore.getAll();
        },
        setAll(cookiesToSet) {
          try {
            cookiesToSet.forEach(({ name, value, options }) =>
              cookieStore.set(name, value, options)
            );
          } catch {
            // The `setAll` method was called from a Server Component.
            // This can be ignored if you have middleware refreshing
            // user sessions.
          }
        },
      },
    }
  );
}

/**
 * 서비스 롤 클라이언트 - RLS 우회 (admin 작업용)
 * 주의: 서버 사이드에서만 사용, 인증 확인 후에만 사용
 */
export function createServiceClient() {
  if (!SUPABASE_SERVICE_ROLE_KEY) {
    console.warn('SUPABASE_SERVICE_ROLE_KEY is not set, falling back to anon key');
    // Service role key가 없으면 일반 클라이언트 반환 (RLS 적용됨)
    return createSupabaseClient<Database>(SUPABASE_URL, SUPABASE_ANON_KEY);
  }

  return createSupabaseClient<Database>(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY, {
    auth: {
      autoRefreshToken: false,
      persistSession: false,
    },
  });
}
