import { createBrowserClient } from '@supabase/ssr';
import { Database } from '@/types/database';

// Fallback values for environments where env vars aren't loaded
const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://rjahkzljlcidixnvfcwj.supabase.co';
const SUPABASE_ANON_KEY = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InJqYWhremxqbGNpZGl4bnZmY3dqIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjgwMjkxMjUsImV4cCI6MjA4MzYwNTEyNX0.4YLhGvCRuNLIx_S8cSEXkhtTQwATUcZgyMEqYJtWDV4';

export function createClient() {
  return createBrowserClient<Database>(
    SUPABASE_URL,
    SUPABASE_ANON_KEY
  );
}
