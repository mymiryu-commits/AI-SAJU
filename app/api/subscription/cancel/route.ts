/**
 * 구독 해지 API
 *
 * POST /api/subscription/cancel - 현재 구독 해지
 */

import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';

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

    // 현재 활성 구독 조회
    const { data: subscription, error: fetchError } = await (supabase as any)
      .from('subscriptions')
      .select('*')
      .eq('user_id', user.id)
      .eq('status', 'active')
      .order('created_at', { ascending: false })
      .limit(1)
      .single();

    if (fetchError || !subscription) {
      return NextResponse.json(
        { error: '활성 구독이 없습니다.' },
        { status: 404 }
      );
    }

    // 구독 상태 업데이트 (해지 처리)
    const { error: updateError } = await (supabase as any)
      .from('subscriptions')
      .update({
        status: 'canceled',
        cancelled_at: new Date().toISOString(),
        cancel_reason: 'user_requested',
      })
      .eq('id', subscription.id);

    if (updateError) {
      console.error('Subscription cancel error:', updateError);
      return NextResponse.json(
        { error: '구독 해지 중 오류가 발생했습니다.' },
        { status: 500 }
      );
    }

    // 이벤트 로깅
    await (supabase as any).from('events').insert({
      user_id: user.id,
      event_type: 'subscription_cancelled',
      event_data: {
        subscription_id: subscription.id,
        plan: subscription.tier,
        expires_at: subscription.current_period_end,
      },
    });

    return NextResponse.json({
      success: true,
      message: '구독이 해지되었습니다.',
      expiresAt: subscription.current_period_end,
    });
  } catch (error) {
    console.error('Subscription cancel API error:', error);
    return NextResponse.json(
      { error: '서버 오류가 발생했습니다.' },
      { status: 500 }
    );
  }
}
