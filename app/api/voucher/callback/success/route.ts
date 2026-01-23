import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';

/**
 * 토스페이먼츠 결제 성공 콜백
 * GET /api/voucher/callback/success
 */
export async function GET(request: NextRequest) {
  const redirectBase = process.env.NEXT_PUBLIC_SITE_URL || 'https://www.ai-planx.com';

  try {
    const { searchParams } = new URL(request.url);
    const paymentKey = searchParams.get('paymentKey');
    const orderId = searchParams.get('orderId');
    const amount = searchParams.get('amount');

    if (!paymentKey || !orderId || !amount) {
      return NextResponse.redirect(`${redirectBase}/my/vouchers?error=invalid_params`);
    }

    const supabase = await createClient();

    // 결제 레코드 조회
    const { data: payment, error: paymentError } = await supabase
      .from('voucher_payments')
      .select('*, voucher_packages(*)')
      .eq('order_id', orderId)
      .single();

    if (paymentError || !payment) {
      console.error('Payment not found:', paymentError);
      return NextResponse.redirect(`${redirectBase}/my/vouchers?error=payment_not_found`);
    }

    // 금액 검증
    if (payment.amount !== parseInt(amount)) {
      console.error('Amount mismatch:', payment.amount, amount);
      return NextResponse.redirect(`${redirectBase}/my/vouchers?error=amount_mismatch`);
    }

    // 토스페이먼츠 결제 승인 요청
    const secretKey = process.env.TOSS_PAYMENTS_SECRET_KEY;
    if (!secretKey) {
      console.error('TOSS_PAYMENTS_SECRET_KEY not configured');
      return NextResponse.redirect(`${redirectBase}/my/vouchers?error=config_error`);
    }

    const confirmResponse = await fetch(
      'https://api.tosspayments.com/v1/payments/confirm',
      {
        method: 'POST',
        headers: {
          'Authorization': `Basic ${Buffer.from(`${secretKey}:`).toString('base64')}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          paymentKey,
          orderId,
          amount: parseInt(amount),
        }),
      }
    );

    const confirmData = await confirmResponse.json();

    if (!confirmResponse.ok) {
      console.error('Toss confirm failed:', confirmData);
      // 결제 실패 처리
      await supabase
        .from('voucher_payments')
        .update({
          status: 'failed',
          response_data: confirmData,
          updated_at: new Date().toISOString(),
        })
        .eq('id', payment.id);

      return NextResponse.redirect(`${redirectBase}/my/vouchers?error=payment_failed`);
    }

    // 결제 성공 처리
    const pkg = payment.voucher_packages;

    // 유효기간 계산
    const expiresAt = new Date();
    expiresAt.setDate(expiresAt.getDate() + (pkg?.validity_days || 365));

    // 이용권 생성
    const { data: voucher, error: voucherError } = await supabase
      .from('user_vouchers')
      .insert({
        user_id: payment.user_id,
        package_id: pkg?.id,
        service_type: pkg?.service_type,
        total_quantity: pkg?.quantity,
        used_quantity: 0,
        remaining_quantity: pkg?.quantity,
        purchase_price: payment.amount,
        unit_price: pkg?.unit_price,
        payment_id: paymentKey,
        order_id: orderId,
        status: 'active',
        source: 'purchase',
        expires_at: expiresAt.toISOString(),
      })
      .select()
      .single();

    if (voucherError) {
      console.error('Voucher creation error:', voucherError);
      // 결제는 성공했지만 이용권 생성 실패 - 수동 처리 필요
      await supabase
        .from('voucher_payments')
        .update({
          status: 'completed',
          payment_key: paymentKey,
          response_data: confirmData,
          approved_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
        })
        .eq('id', payment.id);

      return NextResponse.redirect(`${redirectBase}/my/vouchers?error=voucher_creation_failed&contact=true`);
    }

    // 결제 레코드 업데이트
    await supabase
      .from('voucher_payments')
      .update({
        status: 'completed',
        payment_key: paymentKey,
        voucher_id: voucher.id,
        response_data: confirmData,
        method: confirmData.method,
        approved_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      })
      .eq('id', payment.id);

    // 프로모션 판매 수량 업데이트
    if (pkg?.is_promotion && pkg?.promotion_limit) {
      await supabase
        .from('voucher_packages')
        .update({
          promotion_sold: (pkg.promotion_sold || 0) + 1,
          updated_at: new Date().toISOString(),
        })
        .eq('id', pkg.id);
    }

    // 성공 페이지로 리다이렉트
    return NextResponse.redirect(
      `${redirectBase}/my/vouchers?success=true&quantity=${pkg?.quantity}&service=${pkg?.service_type}`
    );
  } catch (error) {
    console.error('Voucher callback success error:', error);
    return NextResponse.redirect(`${redirectBase}/my/vouchers?error=server_error`);
  }
}
