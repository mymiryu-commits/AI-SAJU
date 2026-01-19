/**
 * 관리자 포인트 부여 API
 * POST /api/admin/grant-points
 *
 * 관리자가 자신 또는 다른 사용자에게 포인트를 부여
 */

import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import { createClient as createSupabaseClient } from '@supabase/supabase-js';

// Service Role 클라이언트 (RLS 우회)
function getServiceSupabase() {
  return createSupabaseClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
  );
}

export async function POST(request: NextRequest) {
  try {
    // 일반 클라이언트로 사용자 인증 확인
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
      return NextResponse.json(
        { error: '로그인이 필요합니다' },
        { status: 401 }
      );
    }

    // Service Role 클라이언트 (RLS 우회)
    const serviceSupabase = getServiceSupabase();

    // 관리자 확인 (이메일 기반 - 필요시 수정)
    const adminEmails = process.env.ADMIN_EMAILS?.split(',') || [];
    const isAdmin = adminEmails.includes(user.email || '') || user.email?.includes('admin');

    // 관리자가 아니어도 자신에게 부여 가능 (테스트용)
    const body = await request.json();
    const { targetUserId, points = 20000 } = body;
    const userId = targetUserId || user.id;

    // 다른 사용자에게 부여시 관리자 권한 필요
    if (targetUserId && targetUserId !== user.id && !isAdmin) {
      return NextResponse.json(
        { error: '다른 사용자에게 포인트를 부여하려면 관리자 권한이 필요합니다' },
        { status: 403 }
      );
    }

    // 기존 프로필 조회
    const { data: existingProfile, error: fetchError } = await serviceSupabase
      .from('profiles')
      .select('id, points, total_points_earned')
      .eq('id', userId)
      .single();

    console.log('Profile fetch result:', { existingProfile, fetchError });

    if (fetchError && fetchError.code === 'PGRST116') {
      // 프로필이 없으면 생성
      console.log('Creating new profile for user:', userId);

      const { error: insertError } = await serviceSupabase
        .from('profiles')
        .insert({
          id: userId,
          points: points,
          total_points_earned: points,
          total_points_spent: 0,
          free_analyses_today: 0,
          free_analyses_limit: 3,
        });

      if (insertError) {
        console.error('Profile creation error:', insertError);
        return NextResponse.json(
          { error: `프로필 생성 실패: ${insertError.message}`, details: insertError },
          { status: 500 }
        );
      }

      // 거래 기록
      await serviceSupabase
        .from('point_transactions')
        .insert({
          user_id: userId,
          type: 'admin_grant',
          amount: points,
          balance_after: points,
          description: `관리자 포인트 부여 (신규 프로필)`,
        });

      return NextResponse.json({
        success: true,
        message: `새 프로필 생성 및 ${points.toLocaleString()}P 부여 완료`,
        data: {
          userId,
          newBalance: points,
          isNewProfile: true,
        }
      });
    }

    if (fetchError) {
      console.error('Profile fetch error:', fetchError);
      return NextResponse.json(
        { error: `프로필 조회 실패: ${fetchError.message}`, details: fetchError },
        { status: 500 }
      );
    }

    // 기존 프로필에 포인트 추가
    const newBalance = (existingProfile.points || 0) + points;

    const { error: updateError } = await serviceSupabase
      .from('profiles')
      .update({
        points: newBalance,
        total_points_earned: (existingProfile.total_points_earned || 0) + points,
      })
      .eq('id', userId);

    if (updateError) {
      console.error('Profile update error:', updateError);
      return NextResponse.json(
        { error: `포인트 업데이트 실패: ${updateError.message}`, details: updateError },
        { status: 500 }
      );
    }

    // 거래 기록
    await serviceSupabase
      .from('point_transactions')
      .insert({
        user_id: userId,
        type: 'admin_grant',
        amount: points,
        balance_after: newBalance,
        description: `관리자 포인트 부여`,
      });

    return NextResponse.json({
      success: true,
      message: `${points.toLocaleString()}P 부여 완료`,
      data: {
        userId,
        previousBalance: existingProfile.points || 0,
        addedPoints: points,
        newBalance,
      }
    });

  } catch (error) {
    console.error('Grant points error:', error);
    return NextResponse.json(
      { error: '포인트 부여 중 오류가 발생했습니다', details: String(error) },
      { status: 500 }
    );
  }
}
