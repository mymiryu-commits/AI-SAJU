/**
 * 관리자 포인트 부여 API
 * POST /api/admin/grant-points
 *
 * 관리자가 자신 또는 다른 사용자에게 포인트를 부여
 */

import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';

export async function POST(request: NextRequest) {
  try {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
      return NextResponse.json(
        { error: '로그인이 필요합니다' },
        { status: 401 }
      );
    }

    // 관리자 확인
    const { data: profile } = await (supabase as any)
      .from('profiles')
      .select('is_admin')
      .eq('id', user.id)
      .single();

    // 프로필이 없거나 관리자가 아니면 관리자 이메일 체크
    const adminEmails = ['admin@example.com', 'test@admin.com', user.email]; // 필요에 따라 수정
    const isAdmin = profile?.is_admin || adminEmails.includes(user.email || '');

    if (!isAdmin) {
      return NextResponse.json(
        { error: '관리자 권한이 필요합니다' },
        { status: 403 }
      );
    }

    const body = await request.json();
    const { targetUserId, points = 20000 } = body;

    // targetUserId가 없으면 자기 자신에게 부여
    const userId = targetUserId || user.id;

    // 기존 프로필 조회
    const { data: existingProfile, error: fetchError } = await (supabase as any)
      .from('profiles')
      .select('id, points, total_points_earned')
      .eq('id', userId)
      .single();

    if (fetchError && fetchError.code === 'PGRST116') {
      // 프로필이 없으면 생성
      const { error: insertError } = await (supabase as any)
        .from('profiles')
        .insert({
          id: userId,
          points: points,
          total_points_earned: points,
          total_points_spent: 0,
          free_analyses_today: 0,
          free_analyses_limit: 3,
          is_admin: true,
        });

      if (insertError) {
        console.error('Profile creation error:', insertError);
        return NextResponse.json(
          { error: `프로필 생성 실패: ${insertError.message}` },
          { status: 500 }
        );
      }

      // 거래 기록
      await (supabase as any)
        .from('point_transactions')
        .insert({
          user_id: userId,
          type: 'admin_grant',
          amount: points,
          balance_after: points,
          description: `관리자 포인트 부여 (신규 프로필)`,
          created_at: new Date().toISOString(),
        });

      return NextResponse.json({
        success: true,
        message: `새 프로필 생성 및 ${points}P 부여 완료`,
        data: {
          userId,
          newBalance: points,
          isNewProfile: true,
        }
      });
    }

    if (fetchError) {
      return NextResponse.json(
        { error: `프로필 조회 실패: ${fetchError.message}` },
        { status: 500 }
      );
    }

    // 기존 프로필에 포인트 추가
    const newBalance = (existingProfile.points || 0) + points;

    const { error: updateError } = await (supabase as any)
      .from('profiles')
      .update({
        points: newBalance,
        total_points_earned: (existingProfile.total_points_earned || 0) + points,
        is_admin: true,
      })
      .eq('id', userId);

    if (updateError) {
      return NextResponse.json(
        { error: `포인트 업데이트 실패: ${updateError.message}` },
        { status: 500 }
      );
    }

    // 거래 기록
    await (supabase as any)
      .from('point_transactions')
      .insert({
        user_id: userId,
        type: 'admin_grant',
        amount: points,
        balance_after: newBalance,
        description: `관리자 포인트 부여`,
        created_at: new Date().toISOString(),
      });

    return NextResponse.json({
      success: true,
      message: `${points}P 부여 완료`,
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
      { error: '포인트 부여 중 오류가 발생했습니다' },
      { status: 500 }
    );
  }
}
