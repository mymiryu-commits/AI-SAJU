import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';

const TOSS_SECRET_KEY = process.env.TOSS_SECRET_KEY || '';

export async function POST(request: NextRequest) {
  try {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
      return NextResponse.json(
        { error: 'Authentication required' },
        { status: 401 }
      );
    }

    const { paymentKey, orderId, amount } = await request.json();

    if (!paymentKey || !orderId || !amount) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }

    // Verify payment with Toss API
    const confirmResponse = await fetch(
      'https://api.tosspayments.com/v1/payments/confirm',
      {
        method: 'POST',
        headers: {
          Authorization: `Basic ${Buffer.from(TOSS_SECRET_KEY + ':').toString('base64')}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ paymentKey, orderId, amount }),
      }
    );

    const paymentResult = await confirmResponse.json();

    if (!confirmResponse.ok) {
      console.error('Toss confirm error:', paymentResult);
      return NextResponse.json(
        { error: paymentResult.message || 'Payment confirmation failed' },
        { status: 400 }
      );
    }

    // Update payment record in database
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const { error: updateError } = await (supabase as any)
      .from('payments')
      .update({
        payment_id: paymentKey,
        payment_status: 'completed',
        updated_at: new Date().toISOString(),
      })
      .eq('id', orderId)
      .eq('user_id', user.id);

    if (updateError) {
      console.error('Payment record update error:', updateError);
    }

    // Process successful payment
    await processPayment(supabase, orderId, user.id);

    return NextResponse.json({
      success: true,
      paymentKey,
      orderId,
      status: paymentResult.status,
    });
  } catch (error) {
    console.error('Payment confirmation error:', error);
    return NextResponse.json(
      { error: 'Payment confirmation failed' },
      { status: 500 }
    );
  }
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
async function processPayment(supabase: any, orderId: string, userId: string) {
  // Fetch payment record
  const { data: payment } = await supabase
    .from('payments')
    .select('*')
    .eq('id', orderId)
    .single();

  if (!payment) return;

  if (payment.type === 'subscription') {
    const now = new Date();
    const periodEnd = new Date(now);
    periodEnd.setMonth(periodEnd.getMonth() + 1);

    await supabase
      .from('subscriptions')
      .upsert({
        user_id: userId,
        tier: payment.reference_id.replace('sub_', ''),
        status: 'active',
        current_period_start: now.toISOString(),
        current_period_end: periodEnd.toISOString(),
        price: payment.amount,
        currency: payment.currency,
        payment_provider: 'toss',
      });

    await supabase
      .from('users')
      .update({
        membership_tier: payment.reference_id.replace('sub_', ''),
        membership_expires_at: periodEnd.toISOString(),
      })
      .eq('id', userId);
  } else if (payment.type === 'coin') {
    const coinMap: Record<string, { coins: number; bonus: number }> = {
      coin_100: { coins: 100, bonus: 10 },
      coin_500: { coins: 500, bonus: 100 },
      coin_1000: { coins: 1000, bonus: 300 },
      coin_3000: { coins: 3000, bonus: 1200 },
    };
    const pkg = coinMap[payment.reference_id];
    if (pkg) {
      const totalCoins = pkg.coins + pkg.bonus;
      await supabase.rpc('increment_coin_balance', {
        user_id_input: userId,
        amount_input: totalCoins,
      });
    }
  }
}
