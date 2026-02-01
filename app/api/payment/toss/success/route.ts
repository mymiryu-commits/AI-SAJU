import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';

// 추천 보상 상수
const REFERRAL_REWARD_POINTS = 300;  // 추천인 기본 보상

/**
 * 추천 보상 처리
 * 사용자의 결제 완료 시 추천인에게 커미션 지급
 */
// eslint-disable-next-line @typescript-eslint/no-explicit-any
async function processReferralReward(supabase: any, userId: string, purchaseAmount: number) {
  try {
    // 1. pending 상태인 추천 조회
    const { data: referral, error: refError } = await supabase
      .from('referrals')
      .select(`
        id,
        referrer_id,
        commission_rate,
        status,
        first_purchase_processed
      `)
      .eq('referee_id', userId)
      .single();

    // 추천 기록이 없음
    if (refError || !referral) {
      return;
    }

    // 이미 첫 구매 보상이 처리된 경우 (중복 방지)
    if (referral.first_purchase_processed) {
      console.log(`[Referral] Already processed first purchase for user ${userId}`);
      return;
    }

    // 2. 커미션 계산
    const commissionRate = referral.commission_rate || 20;
    const commission = Math.floor(purchaseAmount * (commissionRate / 100));
    const totalReward = REFERRAL_REWARD_POINTS + commission;

    console.log(`[Referral] Processing reward: referrer=${referral.referrer_id}, commission=${commission}P (${commissionRate}%)`);

    // 3. 추천인 정보 조회
    const { data: referrerProfile } = await supabase
      .from('profiles')
      .select('total_referrals, referral_earnings')
      .eq('id', referral.referrer_id)
      .single();

    // 4. 추천 레코드 업데이트 (완료 처리)
    await supabase
      .from('referrals')
      .update({
        status: 'completed',
        commission_earned: commission,
        completed_at: new Date().toISOString(),
        first_purchase_processed: true,
        first_purchase_amount: purchaseAmount,
      })
      .eq('id', referral.id);

    // 5. 추천인 프로필 통계 업데이트
    await supabase
      .from('profiles')
      .update({
        total_referrals: (referrerProfile?.total_referrals || 0) + 1,
        referral_earnings: (referrerProfile?.referral_earnings || 0) + commission,
      })
      .eq('id', referral.referrer_id);

    // 6. 추천인에게 포인트 지급
    try {
      await supabase.rpc('increment_coins', {
        user_id: referral.referrer_id,
        amount: totalReward,
      });
    } catch {
      // RPC가 없으면 직접 업데이트
      const { data: userData } = await supabase
        .from('users')
        .select('coin_balance')
        .eq('id', referral.referrer_id)
        .single();

      await supabase
        .from('users')
        .update({ coin_balance: (userData?.coin_balance || 0) + totalReward })
        .eq('id', referral.referrer_id);
    }

    // 7. 포인트 거래 기록
    await supabase.from('coin_transactions').insert([
      {
        user_id: referral.referrer_id,
        amount: REFERRAL_REWARD_POINTS,
        type: 'referral_reward',
        description: '추천 완료 보상',
      },
      {
        user_id: referral.referrer_id,
        amount: commission,
        type: 'referral_commission',
        description: `추천 커미션 (${commissionRate}%)`,
      },
    ]);

    console.log(`[Referral] Successfully rewarded ${totalReward}P to referrer ${referral.referrer_id}`);
  } catch (error) {
    // 추천 보상 실패해도 결제는 성공 처리
    console.error('[Referral] Error processing referral reward:', error);
  }
}

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const paymentKey = searchParams.get('paymentKey');
  const orderId = searchParams.get('orderId');
  const amount = searchParams.get('amount');

  if (!paymentKey || !orderId || !amount) {
    return NextResponse.redirect(
      new URL('/payment/fail?error=missing_params', request.url)
    );
  }

  try {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
      return NextResponse.redirect(
        new URL('/login?redirect=/my/dashboard', request.url)
      );
    }

    // Confirm payment with Toss
    const secretKey = process.env.TOSS_SECRET_KEY;

    if (!secretKey) {
      // Demo mode - skip actual payment confirmation
      console.log('Demo mode: Payment confirmation skipped');
      return NextResponse.redirect(
        new URL('/my/dashboard?payment=success', request.url)
      );
    }

    const confirmResponse = await fetch(
      'https://api.tosspayments.com/v1/payments/confirm',
      {
        method: 'POST',
        headers: {
          Authorization: `Basic ${Buffer.from(`${secretKey}:`).toString('base64')}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          paymentKey,
          orderId,
          amount: parseInt(amount),
        }),
      }
    );

    const paymentResult = await confirmResponse.json();

    if (!confirmResponse.ok) {
      console.error('Payment confirmation failed:', paymentResult);
      return NextResponse.redirect(
        new URL(`/payment/fail?error=${paymentResult.code || 'confirmation_failed'}`, request.url)
      );
    }

    // Update payment status in database
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const { error: updateError } = await (supabase as any)
      .from('payments')
      .update({
        payment_status: 'completed',
        payment_key: paymentKey,
        paid_at: new Date().toISOString(),
      })
      .eq('id', orderId);

    if (updateError) {
      console.error('Failed to update payment status:', updateError);
    }

    // Get payment to determine subscription/product type
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const { data: payment } = await (supabase as any)
      .from('payments')
      .select('*')
      .eq('id', orderId)
      .single();

    // If subscription, create/update subscription record
    if (payment?.type === 'subscription') {
      const expiresAt = new Date();
      expiresAt.setMonth(expiresAt.getMonth() + 1); // 1 month subscription

      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      await (supabase as any)
        .from('subscriptions')
        .upsert({
          user_id: user.id,
          plan: payment.reference_id,
          status: 'active',
          started_at: new Date().toISOString(),
          expires_at: expiresAt.toISOString(),
        }, { onConflict: 'user_id' });
    }

    // ============ 추천 보상 처리 ============
    // 결제 완료 시 추천인에게 커미션 지급
    if (payment) {
      await processReferralReward(supabase, user.id, parseInt(amount));
    }

    // Redirect to success page
    return NextResponse.redirect(
      new URL('/my/dashboard?payment=success', request.url)
    );
  } catch (error) {
    console.error('Payment success handler error:', error);
    return NextResponse.redirect(
      new URL('/payment/fail?error=server_error', request.url)
    );
  }
}
