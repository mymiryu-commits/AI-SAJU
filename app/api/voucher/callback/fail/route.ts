import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';

/**
 * 토스페이먼츠 결제 실패 콜백
 * GET /api/voucher/callback/fail
 */
export async function GET(request: NextRequest) {
  const redirectBase = process.env.NEXT_PUBLIC_SITE_URL || 'https://www.ai-planx.com';

  try {
    const { searchParams } = new URL(request.url);
    const orderId = searchParams.get('orderId');
    const code = searchParams.get('code');
    const message = searchParams.get('message');

    if (!orderId) {
      return NextResponse.redirect(`${redirectBase}/my/vouchers?error=invalid_params`);
    }

    const supabase = await createClient();

    // 결제 레코드 조회 및 실패 상태로 업데이트
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const { data: payment, error: paymentError } = await (supabase as any)
      .from('voucher_payments')
      .select('*')
      .eq('order_id', orderId)
      .single();

    if (!paymentError && payment) {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      await (supabase as any)
        .from('voucher_payments')
        .update({
          status: 'failed',
          response_data: { code, message },
          updated_at: new Date().toISOString(),
        })
        .eq('id', payment.id);
    }

    // 실패 사유를 포함하여 리다이렉트
    const errorMessage = encodeURIComponent(message || '결제가 취소되었습니다.');
    return NextResponse.redirect(
      `${redirectBase}/my/vouchers?error=payment_failed&message=${errorMessage}`
    );
  } catch (error) {
    console.error('Voucher callback fail error:', error);
    return NextResponse.redirect(`${redirectBase}/my/vouchers?error=server_error`);
  }
}
