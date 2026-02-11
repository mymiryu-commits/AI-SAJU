import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import { createServiceClient } from '@/lib/supabase/server';

// 추천 보상 상수
const REFERRAL_REWARD_POINTS = 300;  // 추천인 기본 보상

// 포인트 패키지별 지급 포인트 (pricing.ts와 동기화)
const POINT_PACKAGE_MAP: Record<string, { points: number; bonus: number }> = {
  point_starter:  { points: 500,   bonus: 0 },
  point_basic:    { points: 1000,  bonus: 100 },
  point_standard: { points: 3000,  bonus: 600 },
  point_premium:  { points: 5000,  bonus: 1500 },
  point_vip:      { points: 10000, bonus: 5000 },
};

// 통화에서 로케일 추출
function getLocaleFromCurrency(currency: string): string {
  switch (currency) {
    case 'krw': return 'ko';
    case 'jpy': return 'ja';
    default: return 'en';
  }
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

/**
 * 결제 완료 후 상품별 후처리
 */
// eslint-disable-next-line @typescript-eslint/no-explicit-any
async function processPaymentByType(serviceClient: any, userId: string, payment: any) {
  const { type, reference_id, amount, currency } = payment;

  switch (type) {
    case 'point': {
      // 포인트 패키지 충전
      const packageInfo = POINT_PACKAGE_MAP[reference_id];
      if (!packageInfo) {
        console.error(`[Payment] Unknown point package: ${reference_id}`);
        return;
      }

      const totalPoints = packageInfo.points + packageInfo.bonus;
      console.log(`[Payment] Crediting ${totalPoints}P (base: ${packageInfo.points}, bonus: ${packageInfo.bonus}) to user ${userId}`);

      // 현재 잔액 조회
      const { data: userData } = await serviceClient
        .from('users')
        .select('coin_balance')
        .eq('id', userId)
        .single();

      const currentBalance = userData?.coin_balance || 0;
      const newBalance = currentBalance + totalPoints;

      // 잔액 업데이트
      await serviceClient
        .from('users')
        .update({ coin_balance: newBalance })
        .eq('id', userId);

      // 거래 기록
      await serviceClient.from('coin_transactions').insert({
        user_id: userId,
        type: 'charge',
        amount: totalPoints,
        balance_after: newBalance,
        description: `포인트 충전: ${packageInfo.points}P + 보너스 ${packageInfo.bonus}P`,
        reference_type: 'payment',
        reference_id: payment.id,
      });

      console.log(`[Payment] Points credited. Balance: ${currentBalance} → ${newBalance}`);
      break;
    }

    case 'subscription': {
      // 구독 생성/갱신
      const expiresAt = new Date();
      expiresAt.setMonth(expiresAt.getMonth() + 1);

      await serviceClient
        .from('subscriptions')
        .upsert({
          user_id: userId,
          plan: reference_id,
          status: 'active',
          started_at: new Date().toISOString(),
          expires_at: expiresAt.toISOString(),
          price: amount,
          currency,
          payment_provider: 'toss',
        }, { onConflict: 'user_id' });

      // 사용자 멤버십 업데이트
      const tier = reference_id.replace('sub_', '');
      await serviceClient
        .from('users')
        .update({
          membership_tier: tier,
          membership_expires_at: expiresAt.toISOString(),
        })
        .eq('id', userId);

      console.log(`[Payment] Subscription activated: ${tier} until ${expiresAt.toISOString()}`);
      break;
    }

    case 'analysis': {
      // 분석 상품은 결제 완료 기록만 (분석 생성은 클라이언트에서)
      console.log(`[Payment] Analysis payment completed: ${reference_id}`);
      break;
    }

    case 'addon': {
      // 부가 상품 (PDF, 음성 등) - 결제 완료 기록
      console.log(`[Payment] Addon payment completed: ${reference_id}`);
      break;
    }

    case 'qr': {
      // QR 코드 플랜 활성화
      const expiresAt = new Date();
      expiresAt.setMonth(expiresAt.getMonth() + 1);

      await serviceClient
        .from('subscriptions')
        .upsert({
          user_id: userId,
          plan: reference_id,
          status: 'active',
          started_at: new Date().toISOString(),
          expires_at: expiresAt.toISOString(),
          price: amount,
          currency,
          payment_provider: 'toss',
        }, { onConflict: 'user_id' });

      console.log(`[Payment] QR plan activated: ${reference_id}`);
      break;
    }

    default:
      console.warn(`[Payment] Unknown payment type: ${type}`);
  }
}

export async function GET(request: NextRequest) {
  const redirectBase = process.env.NEXT_PUBLIC_SITE_URL || '';
  const { searchParams } = new URL(request.url);
  const paymentKey = searchParams.get('paymentKey');
  const orderId = searchParams.get('orderId');
  const urlAmount = searchParams.get('amount');

  // 기본 파라미터 검증
  if (!paymentKey || !orderId || !urlAmount) {
    return NextResponse.redirect(
      `${redirectBase}/ko/payment/fail?error=missing_params`
    );
  }

  // orderId 형식 검증 (UUID)
  const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
  if (!uuidRegex.test(orderId)) {
    return NextResponse.redirect(
      `${redirectBase}/ko/payment/fail?error=invalid_order_id`
    );
  }

  // amount가 양수인지 검증
  const parsedUrlAmount = parseInt(urlAmount);
  if (isNaN(parsedUrlAmount) || parsedUrlAmount <= 0) {
    return NextResponse.redirect(
      `${redirectBase}/ko/payment/fail?error=invalid_amount`
    );
  }

  try {
    const supabase = await createClient();
    const serviceClient = createServiceClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
      return NextResponse.redirect(
        `${redirectBase}/ko/login?redirect=/my/dashboard`
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
        `${redirectBase}/ko/payment/fail?error=payment_not_found`
      );
    }

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const paymentData = payment as any;
    const locale = getLocaleFromCurrency(paymentData.currency || 'krw');

    // 2. 금액 검증: URL 금액과 DB 금액 비교
    const dbAmount = paymentData.amount;
    if (dbAmount !== parsedUrlAmount) {
      console.error(`Amount mismatch: URL=${parsedUrlAmount}, DB=${dbAmount}`);
      return NextResponse.redirect(
        `${redirectBase}/${locale}/payment/fail?error=amount_mismatch`
      );
    }

    // ============ 토스 결제 승인 (Confirm) ============
    const secretKey = process.env.TOSS_SECRET_KEY;

    if (!secretKey) {
      // Demo/개발 모드 - 프로덕션에서는 허용하지 않음
      if (process.env.NODE_ENV === 'production') {
        console.error('TOSS_SECRET_KEY is required in production');
        return NextResponse.redirect(
          `${redirectBase}/${locale}/payment/fail?error=payment_config_error`
        );
      }
      console.warn('[DEV MODE] Payment confirmation skipped - TOSS_SECRET_KEY not set');
    } else {
      // 토스 결제 승인 API 호출
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

        // 결제 실패 시 상태 업데이트
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        await (serviceClient as any)
          .from('payments')
          .update({
            payment_status: 'failed',
            payment_key: paymentKey,
            updated_at: new Date().toISOString(),
          })
          .eq('id', orderId)
          .eq('user_id', user.id);

        return NextResponse.redirect(
          `${redirectBase}/${locale}/payment/fail?error=${paymentResult.code || 'confirmation_failed'}&message=${encodeURIComponent(paymentResult.message || '')}`
        );
      }

      console.log(`[Payment] Toss confirmation successful: orderId=${orderId}, method=${paymentResult.method}`);
    }

    // ============ 결제 완료 처리 ============
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const { error: updateError } = await (serviceClient as any)
      .from('payments')
      .update({
        payment_status: 'completed',
        payment_key: paymentKey,
        paid_at: new Date().toISOString(),
      })
      .eq('id', orderId)
      .eq('user_id', user.id);  // 소유권 재확인

    if (updateError) {
      console.error('Failed to update payment status:', updateError);
      return NextResponse.redirect(
        `${redirectBase}/${locale}/payment/fail?error=update_failed`
      );
    }

    // ============ 상품별 후처리 ============
    await processPaymentByType(serviceClient, user.id, paymentData);

    // ============ 추천 보상 처리 ============
    await processReferralReward(serviceClient, user.id, dbAmount);

    // ============ 총 결제금액 업데이트 ============
    try {
      await (serviceClient as any).rpc('increment_total_spent', {
        user_id: user.id,
        amount: dbAmount,
      });
    } catch {
      // RPC가 없으면 무시
    }

    // 성공 페이지로 리다이렉트
    const successParams = new URLSearchParams({
      payment: 'success',
      type: paymentData.type || '',
      orderId: orderId,
    });

    return NextResponse.redirect(
      `${redirectBase}/${locale}/payment/success?${successParams.toString()}`
    );
  } catch (error) {
    console.error('Payment success handler error:', error);
    return NextResponse.redirect(
      `${redirectBase}/ko/payment/fail?error=server_error`
    );
  }
}
