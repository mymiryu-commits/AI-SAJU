import { createBrowserClient } from '@supabase/ssr';
import { Database } from '@/types/database';

// AI-SAJU-LOTTO Supabase Project
const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://bnlrrlnjisokppslkmck.supabase.co';
const SUPABASE_ANON_KEY = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImJubHJybG5qaXNva3Bwc2xrbWNrIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjgxNDMxMzQsImV4cCI6MjA4MzcxOTEzNH0.TGPZpr7Vu5TyadoU71-7BxgmNNMwzRME4rJcB9e42Jw';

export function createClient() {
  return createBrowserClient<Database>(
    SUPABASE_URL,
    SUPABASE_ANON_KEY
  );
}
