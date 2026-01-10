import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';

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
}
