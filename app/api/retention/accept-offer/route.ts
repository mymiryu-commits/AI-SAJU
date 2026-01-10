import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';

export async function POST(request: NextRequest) {
  try {
    const supabase = await createClient();

    const { data: { user }, error: authError } = await supabase.auth.getUser();
    if (authError || !user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await request.json();
    const { reason, offer } = body;

    if (!reason) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }

    // Get current subscription
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const { data: subscription } = await (supabase as any)
      .from('subscriptions')
      .select('*')
      .eq('user_id', user.id)
      .eq('status', 'active')
      .single();

    if (!subscription) {
      return NextResponse.json(
        { error: 'No active subscription found' },
        { status: 404 }
      );
    }

    const updates: Record<string, any> = {};
    const coinReward = offer?.bonusCoins || 0;

    // Handle different offer types
    if (offer?.pauseDays) {
      // Pause subscription
      const pauseEndDate = new Date();
      pauseEndDate.setDate(pauseEndDate.getDate() + offer.pauseDays);

      updates.status = 'paused';
      updates.paused_until = pauseEndDate.toISOString();

      // Extend subscription end date
      const currentEndDate = new Date(subscription.current_period_end);
      currentEndDate.setDate(currentEndDate.getDate() + offer.pauseDays);
      updates.current_period_end = currentEndDate.toISOString();
    }

    if (offer?.discount) {
      // Apply discount for next billing cycles
      updates.discount_percent = offer.discount;
      updates.discount_months_remaining = 3; // 3 months discount
    }

    // Update subscription
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const { error: updateError } = await (supabase as any)
      .from('subscriptions')
      .update(updates)
      .eq('id', subscription.id);

    if (updateError) {
      console.error('Error updating subscription:', updateError);
      return NextResponse.json(
        { error: 'Failed to apply offer' },
        { status: 500 }
      );
    }

    // Add bonus coins if applicable
    if (coinReward > 0) {
      await (supabase as any).rpc('increment_coins', {
        user_id: user.id,
        amount: coinReward,
      });

      // Log coin transaction
      await (supabase as any).from('coin_transactions').insert({
        user_id: user.id,
        amount: coinReward,
        type: 'retention_bonus',
        description: `Retention offer bonus coins`,
      });
    }

    // Log retention event
    await (supabase as any).from('retention_events').insert({
      user_id: user.id,
      event_type: 'offer_accepted',
      cancel_reason: reason,
      offer_type: offer?.discount ? 'discount' : offer?.pauseDays ? 'pause' : 'bonus',
      offer_details: offer,
    });

    // Send confirmation email (queue for background processing)
    await (supabase as any).from('email_queue').insert({
      user_id: user.id,
      template: 'retention_offer_accepted',
      scheduled_at: new Date().toISOString(),
      metadata: {
        offer_type: offer?.discount ? 'discount' : offer?.pauseDays ? 'pause' : 'bonus',
        discount_percent: offer?.discount,
        pause_days: offer?.pauseDays,
        bonus_coins: coinReward,
      },
    });

    return NextResponse.json({
      success: true,
      data: {
        message: 'Offer applied successfully',
        appliedOffer: {
          discount: offer?.discount,
          pauseDays: offer?.pauseDays,
          bonusCoins: coinReward,
        },
        subscription: {
          ...subscription,
          ...updates,
        },
      },
    });
  } catch (error) {
    console.error('Accept offer error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
