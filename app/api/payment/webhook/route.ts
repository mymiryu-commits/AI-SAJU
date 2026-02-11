import { NextRequest, NextResponse } from 'next/server';
import { createServiceClient } from '@/lib/supabase/server';
import crypto from 'crypto';

// Referral levels with commission rates
const REFERRAL_LEVELS = [
  { level: 1, minReferrals: 0, commission: 20, bonus: 0 },
  { level: 2, minReferrals: 5, commission: 25, bonus: 100 },
  { level: 3, minReferrals: 20, commission: 30, bonus: 300 },
  { level: 4, minReferrals: 50, commission: 35, bonus: 500 },
];

// Points reward for referral
const REFERRAL_REWARD_POINTS = 300;  // 추천인 기본 보상

/**
 * Toss Payments 웹훅 서명 검증
 * HMAC-SHA256 사용
 */
function verifyTossSignature(body: string, signature: string | null): boolean {
  const webhookSecret = process.env.TOSS_WEBHOOK_SECRET;

  if (!webhookSecret) {
    // 프로덕션에서는 반드시 검증 필요
    if (process.env.NODE_ENV === 'production') {
      console.error('TOSS_WEBHOOK_SECRET is required in production');
      return false;
    }
    console.warn('[DEV MODE] Webhook signature verification skipped');
    return true;
  }

  if (!signature) {
    console.error('Missing webhook signature');
    return false;
  }

  try {
    const expectedSignature = crypto
      .createHmac('sha256', webhookSecret)
      .update(body)
      .digest('base64');

    return crypto.timingSafeEqual(
      Buffer.from(signature),
      Buffer.from(expectedSignature)
    );
  } catch (error) {
    console.error('Signature verification error:', error);
    return false;
  }
}

/**
 * Stripe 웹훅 서명 검증
 */
function verifyStripeSignature(body: string, signature: string | null): boolean {
  const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET;

  if (!webhookSecret) {
    if (process.env.NODE_ENV === 'production') {
      console.error('STRIPE_WEBHOOK_SECRET is required in production');
      return false;
    }
    console.warn('[DEV MODE] Stripe webhook signature verification skipped');
    return true;
  }

  if (!signature) {
    console.error('Missing Stripe signature');
    return false;
  }

  try {
    // Stripe signature format: t=timestamp,v1=signature
    const signatureParts = signature.split(',');
    const timestamp = signatureParts.find(p => p.startsWith('t='))?.split('=')[1];
    const v1Signature = signatureParts.find(p => p.startsWith('v1='))?.split('=')[1];

    if (!timestamp || !v1Signature) {
      console.error('Invalid Stripe signature format');
      return false;
    }

    // 5분 이내의 요청만 허용 (replay attack 방지)
    const timestampMs = parseInt(timestamp) * 1000;
    if (Date.now() - timestampMs > 5 * 60 * 1000) {
      console.error('Stripe webhook timestamp too old');
      return false;
    }

    const payload = `${timestamp}.${body}`;
    const expectedSignature = crypto
      .createHmac('sha256', webhookSecret)
      .update(payload)
      .digest('hex');

    return crypto.timingSafeEqual(
      Buffer.from(v1Signature),
      Buffer.from(expectedSignature)
    );
  } catch (error) {
    console.error('Stripe signature verification error:', error);
    return false;
  }
}

// Webhook handler for payment confirmations
export async function POST(request: NextRequest) {
  try {
    const body = await request.text();
    const signature = request.headers.get('x-webhook-signature') ||
                     request.headers.get('stripe-signature');

    // Determine provider from headers
    const provider = request.headers.get('x-payment-provider') ||
                    (request.headers.get('stripe-signature') ? 'stripe' : 'toss');

    // ============ 서명 검증 ============
    if (provider === 'toss') {
      if (!verifyTossSignature(body, signature)) {
        console.error('Invalid Toss webhook signature');
        return NextResponse.json({ error: 'Invalid signature' }, { status: 401 });
      }
    } else if (provider === 'stripe') {
      if (!verifyStripeSignature(body, request.headers.get('stripe-signature'))) {
        console.error('Invalid Stripe webhook signature');
        return NextResponse.json({ error: 'Invalid signature' }, { status: 401 });
      }
    } else {
      console.error('Unknown payment provider:', provider);
      return NextResponse.json({ error: 'Unknown provider' }, { status: 400 });
    }

    const payload = JSON.parse(body);
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const supabase = createServiceClient() as any;

    if (provider === 'toss') {
      // Toss Payments webhook handling
      const { orderId, status, paymentKey } = payload;

      // orderId 형식 검증
      const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
      if (!orderId || !uuidRegex.test(orderId)) {
        console.error('Invalid orderId in webhook:', orderId);
        return NextResponse.json({ error: 'Invalid orderId' }, { status: 400 });
      }

      if (status === 'DONE') {
        // Update payment status
        const { data: payment, error } = await supabase
          .from('payments')
          .update({
            payment_id: paymentKey,
            payment_status: 'completed',
            updated_at: new Date().toISOString(),
          })
          .eq('id', orderId)
          .eq('payment_status', 'pending')  // 아직 처리되지 않은 결제만
          .select()
          .single();

        if (error) {
          console.error('Payment update error:', error);
          // 이미 처리된 결제일 수 있음 (중복 웹훅)
          return NextResponse.json({ received: true, note: 'Already processed or not found' });
        }

        // Process the successful payment
        if (payment) {
          await processSuccessfulPayment(supabase, payment);
        }
      } else if (status === 'CANCELED' || status === 'EXPIRED') {
        // 결제 취소/만료 처리
        await supabase
          .from('payments')
          .update({
            payment_status: status.toLowerCase(),
            updated_at: new Date().toISOString(),
          })
          .eq('id', orderId);
      }
    } else if (provider === 'stripe') {
      // Stripe webhook handling
      const event = payload;

      switch (event.type) {
        case 'checkout.session.completed': {
          const session = event.data.object;
          const paymentId = session.metadata?.paymentId;

          if (paymentId) {
            const { data: payment, error } = await supabase
              .from('payments')
              .update({
                payment_id: session.payment_intent,
                payment_status: 'completed',
                updated_at: new Date().toISOString(),
              })
              .eq('id', paymentId)
              .eq('payment_status', 'pending')
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
            await supabase
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

// 포인트 패키지별 지급 포인트 (pricing.ts와 동기화)
const POINT_PACKAGE_MAP: Record<string, { points: number; bonus: number }> = {
  point_starter:  { points: 500,   bonus: 0 },
  point_basic:    { points: 1000,  bonus: 100 },
  point_standard: { points: 3000,  bonus: 600 },
  point_premium:  { points: 5000,  bonus: 1500 },
  point_vip:      { points: 10000, bonus: 5000 },
};

// eslint-disable-next-line @typescript-eslint/no-explicit-any
async function processSuccessfulPayment(supabase: any, payment: any) {
  const { user_id, type, reference_id, amount, currency } = payment;

  switch (type) {
    case 'subscription': {
      // Create or update subscription
      const tier = reference_id.replace('sub_', '');
      const expiresAt = new Date();
      expiresAt.setMonth(expiresAt.getMonth() + 1);

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
      break;
    }
    case 'addon': {
      // Addon purchase (PDF, audio) - just mark as paid
      break;
    }
    case 'point': {
      // 포인트 패키지 충전
      const packageInfo = POINT_PACKAGE_MAP[reference_id];
      if (!packageInfo) {
        console.error(`[Webhook] Unknown point package: ${reference_id}`);
        break;
      }

      const totalPoints = packageInfo.points + packageInfo.bonus;

      // Get current balance
      const { data: userData } = await supabase
        .from('users')
        .select('coin_balance')
        .eq('id', user_id)
        .single();

      const newBalance = (userData?.coin_balance || 0) + totalPoints;

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
          amount: totalPoints,
          balance_after: newBalance,
          description: `포인트 충전: ${packageInfo.points}P + 보너스 ${packageInfo.bonus}P`,
          reference_type: 'payment',
          reference_id: payment.id,
        });

      console.log(`[Webhook] Points credited: ${totalPoints}P to user ${user_id}`);
      break;
    }
    case 'qr': {
      // QR code plan activation
      const expiresAt = new Date();
      expiresAt.setMonth(expiresAt.getMonth() + 1);

      await supabase
        .from('subscriptions')
        .upsert({
          user_id,
          plan: reference_id,
          status: 'active',
          current_period_start: new Date().toISOString(),
          current_period_end: expiresAt.toISOString(),
          price: amount,
          currency,
          payment_provider: payment.payment_provider,
        });
      break;
    }
  }

  // Update user total spent (if RPC exists)
  try {
    await supabase.rpc('increment_total_spent', {
      user_id,
      amount,
    });
  } catch {
    // RPC가 없으면 무시
  }

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
