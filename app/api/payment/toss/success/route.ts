import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';

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
