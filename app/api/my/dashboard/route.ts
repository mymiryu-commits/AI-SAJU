/**
 * 대시보드 API
 *
 * GET /api/my/dashboard - 사용자 대시보드 데이터 조회
 */

import { NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';

export async function GET() {
  try {
    const supabase = await createClient();

    // 사용자 인증 확인
    const { data: { user: authUser }, error: authError } = await supabase.auth.getUser();
    if (authError || !authUser) {
      return NextResponse.json(
        { error: '로그인이 필요합니다.' },
        { status: 401 }
      );
    }

    // profiles 테이블에서 포인트 정보 조회
    const { data: profileData } = await (supabase as any)
      .from('profiles')
      .select('*')
      .eq('id', authUser.id)
      .single();

    // users 테이블에서 사용자 정보 조회 (선택적)
    const { data: userData } = await (supabase as any)
      .from('users')
      .select('*')
      .eq('id', authUser.id)
      .single();

    // 최근 분석 결과 조회 (최대 5개)
    const { data: recentAnalyses } = await (supabase as any)
      .from('fortune_analyses')
      .select('id, type, subtype, created_at, scores, result_summary')
      .eq('user_id', authUser.id)
      .order('created_at', { ascending: false })
      .limit(5);

    // 구독 정보 조회 (있으면)
    let subscriptionData = null;
    try {
      const { data: subscription } = await (supabase as any)
        .from('subscriptions')
        .select('*')
        .eq('user_id', authUser.id)
        .eq('status', 'active')
        .order('created_at', { ascending: false })
        .limit(1)
        .single();
      subscriptionData = subscription;
    } catch {
      // subscriptions 테이블이 없거나 데이터가 없음 - 무시
    }

    // 출석 스트릭 조회 (있으면)
    let checkinData = null;
    try {
      const { data: checkin } = await (supabase as any)
        .from('checkins')
        .select('streak_count')
        .eq('user_id', authUser.id)
        .order('checked_at', { ascending: false })
        .limit(1)
        .single();
      checkinData = checkin;
    } catch {
      // checkins 테이블이 없거나 데이터가 없음 - 무시
    }

    // 리퍼럴 정보 조회 (있으면)
    let referrals: any[] = [];
    try {
      const { data: refs } = await (supabase as any)
        .from('referrals')
        .select('id')
        .eq('referrer_id', authUser.id);
      referrals = refs || [];
    } catch {
      // referrals 테이블이 없거나 데이터가 없음 - 무시
    }

    // 응답 데이터 구성 (profiles + users + auth 데이터 통합)
    const user = {
      id: authUser.id,
      name: userData?.name || authUser.user_metadata?.full_name || authUser.email?.split('@')[0] || '사용자',
      email: authUser.email || userData?.email || '',
      avatarUrl: userData?.avatar_url || authUser.user_metadata?.avatar_url || null,
      membership: userData?.membership_tier || (profileData?.premium_until ? 'premium' : 'free'),
      membershipExpiresAt: userData?.membership_expires_at || profileData?.premium_until || null,
      // profiles 테이블의 포인트 정보 사용
      points: profileData?.points || 0,
      totalPointsEarned: profileData?.total_points_earned || 0,
      totalPointsSpent: profileData?.total_points_spent || 0,
      // 기존 coins 필드도 유지 (호환성)
      coins: profileData?.points || userData?.coin_balance || 0,
      totalAnalyses: profileData?.total_analyses || userData?.total_analyses || recentAnalyses?.length || 0,
      streak: checkinData?.streak_count || 0,
      joinDate: userData?.created_at || authUser.created_at,
      referralCode: userData?.referral_code || null,
      referralCount: referrals?.length || 0,
      // 관리자 여부
      isAdmin: authUser.email?.includes('admin') || false,
    };

    // 구독 정보 변환
    const subscription = subscriptionData ? {
      plan: subscriptionData.tier,
      status: subscriptionData.status,
      expiresAt: subscriptionData.current_period_end,
      autoRenew: subscriptionData.cancelled_at === null,
      startedAt: subscriptionData.current_period_start,
    } : null;

    // 최근 분석 결과 변환
    const analyses = (recentAnalyses || []).map((analysis: any) => ({
      id: analysis.id,
      type: analysis.type,
      subtype: analysis.subtype,
      date: analysis.created_at,
      score: analysis.scores?.overall || analysis.result_summary?.score || 0,
    }));

    return NextResponse.json({
      success: true,
      user,
      subscription,
      recentAnalyses: analyses,
    });
  } catch (error) {
    console.error('Dashboard API error:', error);
    return NextResponse.json(
      { error: '서버 오류가 발생했습니다.' },
      { status: 500 }
    );
  }
}
