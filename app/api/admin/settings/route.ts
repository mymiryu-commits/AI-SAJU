import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

// Supabase Admin 클라이언트 (Service Role)
function createAdminClient() {
  return createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
  );
}

// GET - 설정 조회
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const key = searchParams.get('key');

    if (!key) {
      return NextResponse.json({ error: 'key 파라미터가 필요합니다' }, { status: 400 });
    }

    const supabase = createAdminClient();
    const { data, error } = await supabase
      .from('site_settings')
      .select('*')
      .eq('key', key)
      .single();

    if (error && error.code !== 'PGRST116') {
      console.error('Settings fetch error:', error);
      return NextResponse.json({ error: '설정을 불러오는데 실패했습니다' }, { status: 500 });
    }

    return NextResponse.json({
      key,
      value: data?.value || null,
      updatedAt: data?.updated_at || null,
    });
  } catch (e) {
    console.error('Settings GET error:', e);
    return NextResponse.json({ error: '서버 오류' }, { status: 500 });
  }
}

// POST - 설정 저장
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { key, value } = body;

    if (!key || !value) {
      return NextResponse.json({ error: 'key와 value가 필요합니다' }, { status: 400 });
    }

    const supabase = createAdminClient();

    // Upsert 방식으로 저장
    const { error } = await supabase
      .from('site_settings')
      .upsert(
        {
          key,
          value,
          updated_at: new Date().toISOString(),
        },
        {
          onConflict: 'key',
        }
      );

    if (error) {
      console.error('Settings save error:', error);
      return NextResponse.json({ error: '설정 저장에 실패했습니다' }, { status: 500 });
    }

    return NextResponse.json({ success: true, key });
  } catch (e) {
    console.error('Settings POST error:', e);
    return NextResponse.json({ error: '서버 오류' }, { status: 500 });
  }
}

// DELETE - 설정 삭제
export async function DELETE(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const key = searchParams.get('key');

    if (!key) {
      return NextResponse.json({ error: 'key 파라미터가 필요합니다' }, { status: 400 });
    }

    const supabase = createAdminClient();
    const { error } = await supabase
      .from('site_settings')
      .delete()
      .eq('key', key);

    if (error) {
      console.error('Settings delete error:', error);
      return NextResponse.json({ error: '설정 삭제에 실패했습니다' }, { status: 500 });
    }

    return NextResponse.json({ success: true, key });
  } catch (e) {
    console.error('Settings DELETE error:', e);
    return NextResponse.json({ error: '서버 오류' }, { status: 500 });
  }
}
