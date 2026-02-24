import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import { createServiceClient } from '@/lib/supabase/server';

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
  const urlAmount = searchParams.get('amount');

  // 기본 파라미터 검증
  if (!paymentKey || !orderId || !urlAmount) {
    return NextResponse.redirect(
      new URL('/payment/fail?error=missing_params', request.url)
    );
  }

  // orderId 형식 검증 (UUID)
  const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
  if (!uuidRegex.test(orderId)) {
    return NextResponse.redirect(
      new URL('/payment/fail?error=invalid_order_id', request.url)
    );
  }

  // amount가 양수인지 검증
  const parsedUrlAmount = parseInt(urlAmount);
  if (isNaN(parsedUrlAmount) || parsedUrlAmount <= 0) {
    return NextResponse.redirect(
      new URL('/payment/fail?error=invalid_amount', request.url)
    );
  }

  try {
    const supabase = await createClient();
    const serviceClient = createServiceClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
      return NextResponse.redirect(
        new URL('/login?redirect=/my/dashboard', request.url)
      );
    }

    // ============ 보안 강화: 결제 기록 검증 ============
    // 1. DB에서 결제 기록 조회 (사용자 소유권 검증 포함)
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const { data: payment, error: paymentError } = await (serviceClient as any)
      .from('payments')
      .select('*')
      .eq('id', orderId)
      .eq('user_id', user.id)  // 소유권 검증
      .eq('payment_status', 'pending')  // 아직 처리되지 않은 결제만
      .single();

    if (paymentError || !payment) {
      console.error('Payment not found or not owned by user:', paymentError);
      return NextResponse.redirect(
        new URL('/payment/fail?error=payment_not_found', request.url)
      );
    }

    // 2. 금액 검증: URL 금액과 DB 금액 비교
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const dbAmount = (payment as any).amount;
    if (dbAmount !== parsedUrlAmount) {
      console.error(`Amount mismatch: URL=${parsedUrlAmount}, DB=${dbAmount}`);
      return NextResponse.redirect(
        new URL('/payment/fail?error=amount_mismatch', request.url)
      );
    }

    // ============ 토스 결제 확인 ============
    const secretKey = process.env.TOSS_SECRET_KEY;

    // 프로덕션 환경에서는 반드시 토스 결제 확인 필요
    if (!secretKey) {
      // Demo/개발 모드 - 프로덕션에서는 허용하지 않음
      if (process.env.NODE_ENV === 'production') {
        console.error('TOSS_SECRET_KEY is required in production');
        return NextResponse.redirect(
          new URL('/payment/fail?error=payment_config_error', request.url)
        );
      }

      console.warn('[DEV MODE] Payment confirmation skipped - TOSS_SECRET_KEY not set');
      // 개발 모드에서만 결제 건너뛰기 허용
    } else {
      // 토스 결제 확인 API 호출
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
            amount: dbAmount,  // DB에 저장된 금액 사용 (URL 파라미터가 아닌)
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
    }

    // ============ 결제 완료 처리 ============
    // 트랜잭션처럼 처리 (실패 시 롤백은 별도 처리 필요)
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const { error: updateError } = await (serviceClient as any)
      .from('payments')
      .update({
        payment_status: 'completed',
        payment_key: paymentKey,
        paid_at: new Date().toISOString(),
      })
      .eq('id', orderId)
      .eq('user_id', user.id);  // 다시 한번 소유권 확인

    if (updateError) {
      console.error('Failed to update payment status:', updateError);
      // 토스에서 결제 취소 필요할 수 있음 (추후 구현)
      return NextResponse.redirect(
        new URL('/payment/fail?error=update_failed', request.url)
      );
    }

    // If subscription, create/update subscription record
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const paymentData = payment as any;
    if (paymentData?.type === 'subscription') {
      const expiresAt = new Date();
      expiresAt.setMonth(expiresAt.getMonth() + 1); // 1 month subscription

      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      await (serviceClient as any)
        .from('subscriptions')
        .upsert({
          user_id: user.id,
          plan: paymentData.reference_id,
          status: 'active',
          started_at: new Date().toISOString(),
          expires_at: expiresAt.toISOString(),
        }, { onConflict: 'user_id' });
    }

    // ============ 추천 보상 처리 ============
    // 결제 완료 시 추천인에게 커미션 지급 (DB 금액 사용)
    await processReferralReward(serviceClient, user.id, dbAmount);

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
