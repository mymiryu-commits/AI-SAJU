/**
 * 관리자 회원 관리 API
 *
 * GET /api/admin/users - 회원 목록 조회
 * POST /api/admin/users/grant-points - 포인트 부여
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

export async function GET(request: NextRequest) {
  try {
    const supabase = await createClient();

    // 사용자 인증 확인
    const { data: { user }, error: authError } = await supabase.auth.getUser();
    if (authError || !user) {
      return NextResponse.json(
        { error: '로그인이 필요합니다.' },
        { status: 401 }
      );
    }

    // 관리자 권한 확인
    if (user.email !== ADMIN_EMAIL) {
      return NextResponse.json(
        { error: '관리자 권한이 필요합니다.' },
        { status: 403 }
      );
    }

    const serviceSupabase = getServiceSupabase();
    if (!serviceSupabase) {
      return NextResponse.json(
        { error: '서버 설정 오류' },
        { status: 500 }
      );
    }

    // auth.users에서 모든 사용자 조회
    const { data: authUsers, error: authUsersError } = await serviceSupabase.auth.admin.listUsers();

    if (authUsersError) {
      console.error('Auth users fetch error:', authUsersError);
      return NextResponse.json(
        { error: '사용자 목록 조회 실패' },
        { status: 500 }
      );
    }

    // profiles 테이블에서 포인트 정보 조회
    const { data: profiles } = await serviceSupabase
      .from('profiles')
      .select('id, points, created_at, updated_at');

    const profilesMap = new Map(profiles?.map(p => [p.id, p]) || []);

    // 사용자 목록 구성
    const users = authUsers.users.map(authUser => {
      const profile = profilesMap.get(authUser.id);
      return {
        id: authUser.id,
        email: authUser.email || '',
        name: authUser.user_metadata?.full_name || authUser.user_metadata?.name || authUser.email?.split('@')[0] || '사용자',
        points: profile?.points || 0,
        createdAt: authUser.created_at,
        lastSignIn: authUser.last_sign_in_at,
        isAdmin: authUser.email === ADMIN_EMAIL,
      };
    });

    // 최신 가입순으로 정렬
    users.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());

    return NextResponse.json({
      success: true,
      users,
      total: users.length,
    });
  } catch (error) {
    console.error('Users fetch error:', error);
    return NextResponse.json(
      { error: '회원 목록 조회 중 오류가 발생했습니다.' },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const supabase = await createClient();

    // 사용자 인증 확인
    const { data: { user }, error: authError } = await supabase.auth.getUser();
    if (authError || !user) {
      return NextResponse.json(
        { error: '로그인이 필요합니다.' },
        { status: 401 }
      );
    }

    // 관리자 권한 확인
    if (user.email !== ADMIN_EMAIL) {
      return NextResponse.json(
        { error: '관리자 권한이 필요합니다.' },
        { status: 403 }
      );
    }

    const body = await request.json();
    const { userId, points, reason } = body;

    if (!userId || points === undefined) {
      return NextResponse.json(
        { error: 'userId와 points가 필요합니다.' },
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

    // 현재 포인트 조회
    const { data: profile } = await serviceSupabase
      .from('profiles')
      .select('points')
      .eq('id', userId)
      .single();

    const currentPoints = profile?.points || 0;
    const newPoints = currentPoints + points;

    // 프로필 업데이트 또는 생성
    const { error: upsertError } = await serviceSupabase
      .from('profiles')
      .upsert({
        id: userId,
        points: newPoints,
        updated_at: new Date().toISOString(),
      });

    if (upsertError) {
      console.error('Points update error:', upsertError);
      return NextResponse.json(
        { error: '포인트 부여 실패' },
        { status: 500 }
      );
    }

    // 포인트 이력 기록 (선택적)
    try {
      await serviceSupabase.from('point_transactions').insert({
        user_id: userId,
        amount: points,
        type: points > 0 ? 'admin_grant' : 'admin_deduct',
        description: reason || '관리자 포인트 부여',
        balance_after: newPoints,
      });
    } catch (e) {
      // 이력 테이블이 없어도 무시
      console.log('Point transaction log skipped');
    }

    return NextResponse.json({
      success: true,
      message: `${points > 0 ? '+' : ''}${points}P 부여 완료`,
      previousPoints: currentPoints,
      newPoints,
    });
  } catch (error) {
    console.error('Grant points error:', error);
    return NextResponse.json(
      { error: '포인트 부여 중 오류가 발생했습니다.' },
      { status: 500 }
    );
  }
}
