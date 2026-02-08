/**
 * 관리자 스케줄 관리 API
 *
 * GET /api/admin/schedule - 스케줄 목록 조회
 * POST /api/admin/schedule - 새 스케줄 생성
 * PUT /api/admin/schedule - 스케줄 수정 (완료 토글, 내용 수정)
 * DELETE /api/admin/schedule - 스케줄 삭제
 */

import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import { createClient as createSupabaseClient } from '@supabase/supabase-js';

const ADMIN_EMAIL = 'mymiryu@gmail.com';

// Service Role 클라이언트 (RLS 우회)
function getServiceSupabase() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY;
  if (!url || !key) return null;
  return createSupabaseClient(url, key);
}

// 관리자 인증 확인
async function verifyAdmin() {
  const supabase = await createClient();
  const { data: { user }, error: authError } = await supabase.auth.getUser();

  if (authError || !user) {
    return { error: '로그인이 필요합니다.', status: 401, user: null };
  }

  if (user.email !== ADMIN_EMAIL) {
    return { error: '관리자 권한이 필요합니다.', status: 403, user: null };
  }

  return { error: null, status: 200, user };
}

// GET: 스케줄 목록 조회
export async function GET() {
  try {
    const { error, status, user } = await verifyAdmin();
    if (error) {
      return NextResponse.json({ error }, { status });
    }

    const serviceSupabase = getServiceSupabase();
    if (!serviceSupabase) {
      return NextResponse.json(
        { error: '서버 설정 오류' },
        { status: 500 }
      );
    }

    const { data: schedules, error: fetchError } = await serviceSupabase
      .from('admin_schedules')
      .select('*')
      .order('is_completed', { ascending: true })
      .order('priority', { ascending: false })
      .order('due_date', { ascending: true, nullsFirst: false })
      .order('created_at', { ascending: false });

    if (fetchError) {
      console.error('Schedules fetch error:', fetchError);
      return NextResponse.json(
        { error: '스케줄 목록 조회 실패' },
        { status: 500 }
      );
    }

    return NextResponse.json({
      success: true,
      schedules: schedules || [],
      total: schedules?.length || 0,
    });
  } catch (error) {
    console.error('Schedules GET error:', error);
    return NextResponse.json(
      { error: '스케줄 목록 조회 중 오류가 발생했습니다.' },
      { status: 500 }
    );
  }
}

// POST: 새 스케줄 생성
export async function POST(request: NextRequest) {
  try {
    const { error, status, user } = await verifyAdmin();
    if (error || !user) {
      return NextResponse.json({ error }, { status });
    }

    const body = await request.json();
    const { title, description, link_url, link_label, priority, due_date } = body;

    if (!title?.trim()) {
      return NextResponse.json(
        { error: '제목은 필수입니다.' },
        { status: 400 }
      );
    }

    const serviceSupabase = getServiceSupabase();
    if (!serviceSupabase) {
      return NextResponse.json(
        { error: '서버 설정 오류' },
        { status: 500 }
      );
    }

    const { data: schedule, error: insertError } = await serviceSupabase
      .from('admin_schedules')
      .insert({
        title: title.trim(),
        description: description?.trim() || null,
        link_url: link_url?.trim() || null,
        link_label: link_label?.trim() || null,
        priority: priority || 0,
        due_date: due_date || null,
        created_by: user.email,
        is_completed: false,
      })
      .select()
      .single();

    if (insertError) {
      console.error('Schedule insert error:', insertError);
      return NextResponse.json(
        { error: '스케줄 생성 실패' },
        { status: 500 }
      );
    }

    return NextResponse.json({
      success: true,
      message: '스케줄이 생성되었습니다.',
      schedule,
    });
  } catch (error) {
    console.error('Schedule POST error:', error);
    return NextResponse.json(
      { error: '스케줄 생성 중 오류가 발생했습니다.' },
      { status: 500 }
    );
  }
}

// PUT: 스케줄 수정
export async function PUT(request: NextRequest) {
  try {
    const { error, status } = await verifyAdmin();
    if (error) {
      return NextResponse.json({ error }, { status });
    }

    const body = await request.json();
    const { id, title, description, link_url, link_label, priority, due_date, is_completed } = body;

    if (!id) {
      return NextResponse.json(
        { error: '스케줄 ID가 필요합니다.' },
        { status: 400 }
      );
    }

    const serviceSupabase = getServiceSupabase();
    if (!serviceSupabase) {
      return NextResponse.json(
        { error: '서버 설정 오류' },
        { status: 500 }
      );
    }

    const updateData: Record<string, unknown> = {};

    if (title !== undefined) updateData.title = title.trim();
    if (description !== undefined) updateData.description = description?.trim() || null;
    if (link_url !== undefined) updateData.link_url = link_url?.trim() || null;
    if (link_label !== undefined) updateData.link_label = link_label?.trim() || null;
    if (priority !== undefined) updateData.priority = priority;
    if (due_date !== undefined) updateData.due_date = due_date || null;
    if (is_completed !== undefined) updateData.is_completed = is_completed;

    const { data: schedule, error: updateError } = await serviceSupabase
      .from('admin_schedules')
      .update(updateData)
      .eq('id', id)
      .select()
      .single();

    if (updateError) {
      console.error('Schedule update error:', updateError);
      return NextResponse.json(
        { error: '스케줄 수정 실패' },
        { status: 500 }
      );
    }

    return NextResponse.json({
      success: true,
      message: '스케줄이 수정되었습니다.',
      schedule,
    });
  } catch (error) {
    console.error('Schedule PUT error:', error);
    return NextResponse.json(
      { error: '스케줄 수정 중 오류가 발생했습니다.' },
      { status: 500 }
    );
  }
}

// DELETE: 스케줄 삭제
export async function DELETE(request: NextRequest) {
  try {
    const { error, status } = await verifyAdmin();
    if (error) {
      return NextResponse.json({ error }, { status });
    }

    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');

    if (!id) {
      return NextResponse.json(
        { error: '스케줄 ID가 필요합니다.' },
        { status: 400 }
      );
    }

    const serviceSupabase = getServiceSupabase();
    if (!serviceSupabase) {
      return NextResponse.json(
        { error: '서버 설정 오류' },
        { status: 500 }
      );
    }

    const { error: deleteError } = await serviceSupabase
      .from('admin_schedules')
      .delete()
      .eq('id', id);

    if (deleteError) {
      console.error('Schedule delete error:', deleteError);
      return NextResponse.json(
        { error: '스케줄 삭제 실패' },
        { status: 500 }
      );
    }

    return NextResponse.json({
      success: true,
      message: '스케줄이 삭제되었습니다.',
    });
  } catch (error) {
    console.error('Schedule DELETE error:', error);
    return NextResponse.json(
      { error: '스케줄 삭제 중 오류가 발생했습니다.' },
      { status: 500 }
    );
  }
}
