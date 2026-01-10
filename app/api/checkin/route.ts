import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';

// Daily rewards by streak day (1-7 cycle)
const DAILY_REWARDS = [
  { day: 1, coins: 10 },
  { day: 2, coins: 10 },
  { day: 3, coins: 15 },
  { day: 4, coins: 15 },
  { day: 5, coins: 20 },
  { day: 6, coins: 20 },
  { day: 7, coins: 50, bonus: 'tarot_free' }, // Week completion bonus
];

// Milestone rewards
const MILESTONE_REWARDS: Record<number, { coins: number; bonus?: string }> = {
  14: { coins: 100 },
  30: { coins: 200, bonus: 'basic_analysis_free' },
  60: { coins: 300 },
  100: { coins: 500 },
  180: { coins: 700 },
  365: { coins: 1000, bonus: 'premium_month_free' },
};

export async function GET(request: NextRequest) {
  try {
    const supabase = await createClient();

    const { data: { user }, error: authError } = await supabase.auth.getUser();
    if (authError || !user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Get user's check-in history for current month
    const today = new Date();
    const startOfMonth = new Date(today.getFullYear(), today.getMonth(), 1);

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const { data: checkins } = await (supabase as any)
      .from('checkins')
      .select('*')
      .eq('user_id', user.id)
      .gte('checked_in_at', startOfMonth.toISOString())
      .order('checked_in_at', { ascending: false });

    // Get streak info
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const { data: profile } = await (supabase as any)
      .from('profiles')
      .select('checkin_streak, max_checkin_streak, total_checkins, last_checkin_at')
      .eq('id', user.id)
      .single();

    // Check if already checked in today
    const todayStr = today.toISOString().split('T')[0];
    const lastCheckinDate = profile?.last_checkin_at
      ? new Date(profile.last_checkin_at).toISOString().split('T')[0]
      : null;
    const hasCheckedInToday = lastCheckinDate === todayStr;

    // Calculate next reward
    const currentStreak = profile?.checkin_streak || 0;
    const dayInCycle = (currentStreak % 7) + 1;
    const nextReward = DAILY_REWARDS[dayInCycle - 1];

    // Get upcoming milestones
    const upcomingMilestones = Object.entries(MILESTONE_REWARDS)
      .filter(([days]) => parseInt(days) > (profile?.total_checkins || 0))
      .slice(0, 3)
      .map(([days, reward]) => ({
        days: parseInt(days),
        daysRemaining: parseInt(days) - (profile?.total_checkins || 0),
        ...reward,
      }));

    return NextResponse.json({
      success: true,
      data: {
        hasCheckedInToday,
        currentStreak: profile?.checkin_streak || 0,
        maxStreak: profile?.max_checkin_streak || 0,
        totalCheckins: profile?.total_checkins || 0,
        dayInCycle,
        nextReward,
        upcomingMilestones,
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        thisMonthCheckins: checkins?.map((c: any) => c.checked_in_at) || [],
      },
    });
  } catch (error) {
    console.error('Get check-in error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const supabase = await createClient();

    const { data: { user }, error: authError } = await supabase.auth.getUser();
    if (authError || !user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Get current profile
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const { data: profile } = await (supabase as any)
      .from('profiles')
      .select('checkin_streak, max_checkin_streak, total_checkins, last_checkin_at')
      .eq('id', user.id)
      .single();

    // Check if already checked in today
    const today = new Date();
    const todayStr = today.toISOString().split('T')[0];
    const lastCheckinDate = profile?.last_checkin_at
      ? new Date(profile.last_checkin_at).toISOString().split('T')[0]
      : null;

    if (lastCheckinDate === todayStr) {
      return NextResponse.json(
        { error: 'Already checked in today' },
        { status: 400 }
      );
    }

    // Calculate streak
    const yesterday = new Date(today);
    yesterday.setDate(yesterday.getDate() - 1);
    const yesterdayStr = yesterday.toISOString().split('T')[0];

    let newStreak: number;
    if (lastCheckinDate === yesterdayStr) {
      // Continuing streak
      newStreak = (profile?.checkin_streak || 0) + 1;
    } else {
      // Streak broken, start new
      newStreak = 1;
    }

    const newTotalCheckins = (profile?.total_checkins || 0) + 1;
    const newMaxStreak = Math.max(newStreak, profile?.max_checkin_streak || 0);

    // Calculate reward
    const dayInCycle = ((newStreak - 1) % 7) + 1;
    const dailyReward = DAILY_REWARDS[dayInCycle - 1];
    let totalCoins = dailyReward.coins;
    let bonuses: string[] = [];

    if (dailyReward.bonus) {
      bonuses.push(dailyReward.bonus);
    }

    // Check for milestone rewards
    const milestoneReward = MILESTONE_REWARDS[newTotalCheckins];
    if (milestoneReward) {
      totalCoins += milestoneReward.coins;
      if (milestoneReward.bonus) {
        bonuses.push(milestoneReward.bonus);
      }
    }

    // Update profile
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const { error: updateError } = await (supabase as any)
      .from('profiles')
      .update({
        checkin_streak: newStreak,
        max_checkin_streak: newMaxStreak,
        total_checkins: newTotalCheckins,
        last_checkin_at: today.toISOString(),
      })
      .eq('id', user.id);

    if (updateError) {
      console.error('Error updating profile:', updateError);
      return NextResponse.json(
        { error: 'Failed to update check-in' },
        { status: 500 }
      );
    }

    // Add coins
    await (supabase as any).rpc('increment_coins', {
      user_id: user.id,
      amount: totalCoins,
    });

    // Log check-in
    await (supabase as any).from('checkins').insert({
      user_id: user.id,
      checked_in_at: today.toISOString(),
      streak_day: newStreak,
      coins_earned: totalCoins,
      bonuses: bonuses,
    });

    // Log coin transaction
    await (supabase as any).from('coin_transactions').insert({
      user_id: user.id,
      amount: totalCoins,
      type: 'checkin',
      description: `Day ${dayInCycle} check-in reward${milestoneReward ? ` + ${newTotalCheckins} day milestone` : ''}`,
    });

    // Grant bonus items
    for (const bonus of bonuses) {
      await (supabase as any).from('user_items').insert({
        user_id: user.id,
        item_type: bonus,
        expires_at: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(), // 30 days
        source: 'checkin_reward',
      });
    }

    return NextResponse.json({
      success: true,
      data: {
        streak: newStreak,
        maxStreak: newMaxStreak,
        totalCheckins: newTotalCheckins,
        dayInCycle,
        coinsEarned: totalCoins,
        bonuses,
        isMilestone: !!milestoneReward,
        milestoneDay: milestoneReward ? newTotalCheckins : null,
      },
    });
  } catch (error) {
    console.error('Check-in error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
