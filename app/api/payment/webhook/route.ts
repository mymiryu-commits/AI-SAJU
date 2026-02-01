import { NextRequest, NextResponse } from 'next/server';
import { createClient, createServiceClient } from '@/lib/supabase/server';

// Referral levels with commission rates
const REFERRAL_LEVELS = [
  { level: 1, minReferrals: 0, commission: 20, bonus: 0 },
  { level: 2, minReferrals: 5, commission: 25, bonus: 100 },
  { level: 3, minReferrals: 20, commission: 30, bonus: 300 },
  { level: 4, minReferrals: 50, commission: 35, bonus: 500 },
];

// Points reward for referral
const REFERRAL_REWARD_POINTS = 300;  // 추천인 기본 보상

// Webhook handler for payment confirmations
export async function POST(request: NextRequest) {
  try {
    const body = await request.text();
    const signature = request.headers.get('x-webhook-signature');

    // Determine provider from headers
    const provider = request.headers.get('x-payment-provider') || 'toss';

    // Verify webhook signature (implement based on provider)
    // For Toss: verify using HMAC-SHA256
    // For Stripe: verify using stripe.webhooks.constructEvent

    const payload = JSON.parse(body);

    const supabase = await createClient();

    if (provider === 'toss') {
      // Toss Payments webhook handling
      const { orderId, status, paymentKey, approvedAt } = payload;

      if (status === 'DONE') {
        // Update payment status
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const { data: payment, error } = await (supabase as any)
          .from('payments')
          .update({
            payment_id: paymentKey,
            payment_status: 'completed',
            updated_at: new Date().toISOString(),
          })
          .eq('id', orderId)
          .select()
          .single();

        if (error) {
          console.error('Payment update error:', error);
          return NextResponse.json({ error: 'Update failed' }, { status: 500 });
        }

        // Process the successful payment
        await processSuccessfulPayment(supabase, payment);
      }
    } else if (provider === 'stripe') {
      // Stripe webhook handling
      const event = payload;

      switch (event.type) {
        case 'checkout.session.completed': {
          const session = event.data.object;
          const paymentId = session.metadata?.paymentId;

          if (paymentId) {
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            const { data: payment, error } = await (supabase as any)
              .from('payments')
              .update({
                payment_id: session.payment_intent,
                payment_status: 'completed',
                updated_at: new Date().toISOString(),
              })
              .eq('id', paymentId)
              .select()
              .single();

            if (!error && payment) {
              await processSuccessfulPayment(supabase, payment);
            }
          }
          break;
        }
        case 'payment_intent.payment_failed': {
          const paymentIntent = event.data.object;
          const paymentId = paymentIntent.metadata?.paymentId;

          if (paymentId) {
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            await (supabase as any)
              .from('payments')
              .update({
                payment_status: 'failed',
                updated_at: new Date().toISOString(),
              })
              .eq('id', paymentId);
          }
          break;
        }
      }
    }

    return NextResponse.json({ received: true });
  } catch (error) {
    console.error('Webhook error:', error);
    return NextResponse.json(
      { error: 'Webhook processing failed' },
      { status: 500 }
    );
  }
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
async function processSuccessfulPayment(supabase: any, payment: any) {
  const { user_id, type, reference_id, amount, currency } = payment;

  switch (type) {
    case 'subscription': {
      // Create or update subscription
      const tier = reference_id.replace('sub_', '');
      const expiresAt = new Date();
      expiresAt.setMonth(expiresAt.getMonth() + 1); // 1 month subscription

      await supabase
        .from('subscriptions')
        .upsert({
          user_id,
          tier,
          status: 'active',
          current_period_start: new Date().toISOString(),
          current_period_end: expiresAt.toISOString(),
          price: amount,
          currency,
          payment_provider: payment.payment_provider,
        });

      // Update user membership
      await supabase
        .from('users')
        .update({
          membership_tier: tier,
          membership_expires_at: expiresAt.toISOString(),
        })
        .eq('id', user_id);
      break;
    }
    case 'analysis': {
      // Analysis is already created, just mark as paid
      // The actual analysis generation happens on the client
      break;
    }
    case 'coin': {
      // Add coins to user balance
      const coinPackage = reference_id.replace('coin_', '');
      const coinAmounts: Record<string, number> = {
        '100': 110,
        '500': 600,
        '1000': 1300,
        '3000': 4200,
      };
      const coinsToAdd = coinAmounts[coinPackage] || 0;

      if (coinsToAdd > 0) {
        // Get current balance
        const { data: userData } = await supabase
          .from('users')
          .select('coin_balance')
          .eq('id', user_id)
          .single();

        const newBalance = (userData?.coin_balance || 0) + coinsToAdd;

        // Update balance
        await supabase
          .from('users')
          .update({ coin_balance: newBalance })
          .eq('id', user_id);

        // Record transaction
        await supabase
          .from('coin_transactions')
          .insert({
            user_id,
            type: 'charge',
            amount: coinsToAdd,
            balance_after: newBalance,
            description: `Coin package purchase: ${coinPackage}`,
            reference_type: 'payment',
            reference_id: payment.id,
          });
      }
      break;
    }
  }

  // Update user total spent
  await supabase.rpc('increment_total_spent', {
    user_id,
    amount,
  });

  // ============ 추천 보상 처리 ============
  // 결제 완료 시 pending 상태인 추천이 있으면 보상 지급
  await processReferralReward(supabase, user_id, amount);
}

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

    // 추천 기록이 없거나 이미 첫 구매 처리됨
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
