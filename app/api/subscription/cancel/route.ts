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
    const { reason, feedback } = body;

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

    // Cancel subscription (will remain active until current_period_end)
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const { error: updateError } = await (supabase as any)
      .from('subscriptions')
      .update({
        status: 'canceled',
        canceled_at: new Date().toISOString(),
        cancel_reason: reason,
      })
      .eq('id', subscription.id);

    if (updateError) {
      console.error('Error canceling subscription:', updateError);
      return NextResponse.json(
        { error: 'Failed to cancel subscription' },
        { status: 500 }
      );
    }

    // Log cancellation event
    await (supabase as any).from('retention_events').insert({
      user_id: user.id,
      event_type: 'subscription_canceled',
      cancel_reason: reason,
      feedback: feedback,
    });

    // Save feedback if provided
    if (feedback) {
      await (supabase as any).from('user_feedback').insert({
        user_id: user.id,
        type: 'cancellation',
        content: feedback,
        metadata: {
          subscription_tier: subscription.tier,
          cancel_reason: reason,
          subscription_duration_days: Math.floor(
            (Date.now() - new Date(subscription.created_at).getTime()) / (1000 * 60 * 60 * 24)
          ),
        },
      });
    }

    // Schedule downgrade at period end
    await (supabase as any).from('scheduled_actions').insert({
      user_id: user.id,
      action_type: 'downgrade_to_free',
      scheduled_at: subscription.current_period_end,
      metadata: {
        subscription_id: subscription.id,
        previous_tier: subscription.tier,
      },
    });

    // Send cancellation confirmation email
    await (supabase as any).from('email_queue').insert({
      user_id: user.id,
      template: 'subscription_canceled',
      scheduled_at: new Date().toISOString(),
      metadata: {
        tier: subscription.tier,
        end_date: subscription.current_period_end,
        reason: reason,
      },
    });

    // Schedule win-back email series
    const winBackDates = [7, 14, 30]; // Days after cancellation
    for (const days of winBackDates) {
      const sendDate = new Date();
      sendDate.setDate(sendDate.getDate() + days);

      await (supabase as any).from('email_queue').insert({
        user_id: user.id,
        template: `winback_${days}d`,
        scheduled_at: sendDate.toISOString(),
        metadata: {
          previous_tier: subscription.tier,
          days_since_cancel: days,
        },
      });
    }

    return NextResponse.json({
      success: true,
      data: {
        message: 'Subscription canceled successfully',
        effectiveUntil: subscription.current_period_end,
        subscription: {
          ...subscription,
          status: 'canceled',
          canceled_at: new Date().toISOString(),
        },
      },
    });
  } catch (error) {
    console.error('Cancel subscription error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

// Reactivate canceled subscription
export async function PUT(request: NextRequest) {
  try {
    const supabase = await createClient();

    const { data: { user }, error: authError } = await supabase.auth.getUser();
    if (authError || !user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Get canceled subscription
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const { data: subscription } = await (supabase as any)
      .from('subscriptions')
      .select('*')
      .eq('user_id', user.id)
      .eq('status', 'canceled')
      .single();

    if (!subscription) {
      return NextResponse.json(
        { error: 'No canceled subscription found' },
        { status: 404 }
      );
    }

    // Check if still within grace period
    const currentPeriodEnd = new Date(subscription.current_period_end);
    if (currentPeriodEnd < new Date()) {
      return NextResponse.json(
        { error: 'Subscription has already expired. Please create a new subscription.' },
        { status: 400 }
      );
    }

    // Reactivate subscription
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const { error: updateError } = await (supabase as any)
      .from('subscriptions')
      .update({
        status: 'active',
        canceled_at: null,
        cancel_reason: null,
      })
      .eq('id', subscription.id);

    if (updateError) {
      console.error('Error reactivating subscription:', updateError);
      return NextResponse.json(
        { error: 'Failed to reactivate subscription' },
        { status: 500 }
      );
    }

    // Cancel scheduled downgrade
    await (supabase as any)
      .from('scheduled_actions')
      .delete()
      .eq('user_id', user.id)
      .eq('action_type', 'downgrade_to_free');

    // Cancel win-back emails
    await (supabase as any)
      .from('email_queue')
      .delete()
      .eq('user_id', user.id)
      .like('template', 'winback_%');

    // Log reactivation
    await (supabase as any).from('retention_events').insert({
      user_id: user.id,
      event_type: 'subscription_reactivated',
    });

    return NextResponse.json({
      success: true,
      data: {
        message: 'Subscription reactivated successfully',
        subscription: {
          ...subscription,
          status: 'active',
          canceled_at: null,
        },
      },
    });
  } catch (error) {
    console.error('Reactivate subscription error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
