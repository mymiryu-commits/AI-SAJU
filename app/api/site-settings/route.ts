import { NextRequest, NextResponse } from 'next/server';
import { createClient, createServiceClient } from '@/lib/supabase/server';
import type { Database, Json } from '@/types/database';

export interface HeroSettings {
  background_image_url: string | null;
  content_image_url: string | null;
  use_gradient: boolean;
  gradient_from: string;
  gradient_via: string;
  gradient_to: string;
}

type SiteSettingsRow = Database['public']['Tables']['site_settings']['Row'];
type UsersRow = Database['public']['Tables']['users']['Row'];

// GET - Fetch site settings (public)
export async function GET(request: NextRequest) {
  try {
    const supabase = await createClient();
    const { searchParams } = new URL(request.url);
    const key = searchParams.get('key') || 'hero_settings';

    const { data, error } = await supabase
      .from('site_settings')
      .select('*')
      .eq('key', key)
      .single<SiteSettingsRow>();

    if (error && error.code !== 'PGRST116') {
      console.error('Error fetching site settings:', error);
      return NextResponse.json(
        { error: 'Failed to fetch settings' },
        { status: 500 }
      );
    }

    // Return default settings if not found
    if (!data) {
      const defaultSettings: HeroSettings = {
        background_image_url: null,
        content_image_url: null,
        use_gradient: true,
        gradient_from: '#9333ea',
        gradient_via: '#7e22ce',
        gradient_to: '#db2777',
      };
      return NextResponse.json({ data: { key, value: defaultSettings } });
    }

    return NextResponse.json({ data });
  } catch (error) {
    console.error('Error in GET /api/site-settings:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

// POST - Update site settings (admin only)
export async function POST(request: NextRequest) {
  try {
    const supabase = await createClient();

    // Check if user is authenticated
    const { data: { user }, error: authError } = await supabase.auth.getUser();

    if (authError || !user) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    // Check if user is admin (email-based + DB fallback)
    const adminEmails = ['mymiryu@gmail.com']; // 하드코딩 admin 이메일
    const envEmails = process.env.NEXT_PUBLIC_ADMIN_EMAILS?.split(',') || [];
    const allAdminEmails = [...new Set([...adminEmails, ...envEmails])];

    let isAdmin = user.email && allAdminEmails.includes(user.email);

    // DB에서도 체크 (users 테이블이 있는 경우)
    if (!isAdmin) {
      try {
        const { data: userData } = await supabase
          .from('users')
          .select('membership_tier')
          .eq('id', user.id)
          .single<Pick<UsersRow, 'membership_tier'>>();

        isAdmin = userData?.membership_tier === 'admin';
      } catch {
        // users 테이블이 없으면 무시
      }
    }

    if (!isAdmin) {
      return NextResponse.json(
        { error: 'Forbidden - Admin access required' },
        { status: 403 }
      );
    }

    const body = await request.json();
    const { key, value } = body as { key: string; value: Json };

    if (!key || !value) {
      return NextResponse.json(
        { error: 'Missing required fields: key and value' },
        { status: 400 }
      );
    }

    // 서비스 롤 클라이언트 사용 (RLS 우회)
    const serviceClient = createServiceClient();

    // Upsert the setting
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const { data, error } = await (serviceClient as any)
      .from('site_settings')
      .upsert(
        {
          key,
          value,
          updated_by: user.id,
          updated_at: new Date().toISOString(),
        },
        {
          onConflict: 'key',
        }
      )
      .select()
      .single();

    if (error) {
      console.error('Error updating site settings:', error);
      return NextResponse.json(
        { error: 'Failed to update settings' },
        { status: 500 }
      );
    }

    return NextResponse.json({ data, message: 'Settings updated successfully' });
  } catch (error) {
    console.error('Error in POST /api/site-settings:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
