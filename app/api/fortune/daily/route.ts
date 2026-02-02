import { NextRequest, NextResponse } from 'next/server';
import { createClient, createServiceClient } from '@/lib/supabase/server';

function generateDailyFortune(date: Date, userId?: string) {
  // Use date and userId as seed for consistent daily fortune
  const seed = date.getFullYear() * 10000 + (date.getMonth() + 1) * 100 + date.getDate();
  const userSeed = userId ? userId.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0) : 0;
  const combinedSeed = seed + userSeed;

  const random = (min: number, max: number, offset: number = 0) => {
    const x = Math.sin((combinedSeed + offset) * 9999) * 10000;
    return Math.floor((x - Math.floor(x)) * (max - min + 1)) + min;
  };

  const colors = ['Purple', 'Blue', 'Green', 'Red', 'Yellow', 'Orange', 'Pink', 'White'];
  const directions = ['North', 'South', 'East', 'West', 'Northeast', 'Southeast', 'Northwest', 'Southwest'];

  const advices = [
    'Today is a great day for new beginnings. Trust your instincts and take that first step.',
    'Focus on relationships today. Good communication will open unexpected doors.',
    'Financial matters require attention. Review your budget and plan for the future.',
    'Your creative energy is high. Express yourself through art, writing, or music.',
    'Take time for self-care. A healthy mind leads to a productive day.',
    'Networking opportunities abound. Reach out to old connections.',
    'Learning something new today will bring long-term benefits.',
    'Your patience will be tested, but staying calm will lead to positive outcomes.',
  ];

  const cautions = [
    'Avoid impulsive decisions in the afternoon.',
    'Be careful with words around colleagues.',
    'Double-check important documents before submitting.',
    'Watch your spending on non-essential items.',
    'Don\'t skip meals - your health needs attention.',
    'Avoid making major commitments without thinking.',
    'Be wary of miscommunication in digital messages.',
    'Take breaks to avoid burnout.',
  ];

  return {
    date: date.toISOString().split('T')[0],
    scores: {
      overall: random(60, 95, 1),
      wealth: random(55, 98, 2),
      love: random(50, 95, 3),
      career: random(60, 95, 4),
      health: random(55, 90, 5),
    },
    lucky: {
      time: `${random(6, 18, 6).toString().padStart(2, '0')}:00`,
      color: colors[random(0, colors.length - 1, 7)],
      number: random(1, 99, 8),
      direction: directions[random(0, directions.length - 1, 9)],
    },
    advice: advices[random(0, advices.length - 1, 10)],
    caution: cautions[random(0, cautions.length - 1, 11)],
  };
}

export async function GET(request: NextRequest) {
  try {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();

    const today = new Date();
    const fortune = generateDailyFortune(today, user?.id);

    // If user is logged in, check/save daily fortune
    if (user) {
      const dateStr = today.toISOString().split('T')[0];

      // Check if today's fortune exists
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const { data: existing } = await (supabase as any)
        .from('daily_fortunes')
        .select('*')
        .eq('user_id', user.id)
        .eq('fortune_date', dateStr)
        .single();

      if (!existing) {
        // Save new daily fortune (Service client 사용)
        const serviceClient = createServiceClient();
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const { error: dailyError } = await (serviceClient as any).from('daily_fortunes').insert({
          user_id: user.id,
          fortune_date: dateStr,
          overall_score: fortune.scores.overall,
          wealth_score: fortune.scores.wealth,
          love_score: fortune.scores.love,
          career_score: fortune.scores.career,
          health_score: fortune.scores.health,
          summary: fortune.advice,
          advice: fortune.advice,
          lucky_time: fortune.lucky.time,
          lucky_color: fortune.lucky.color,
          lucky_number: fortune.lucky.number.toString(),
          caution: fortune.caution,
        });
        if (dailyError) {
          console.error('[Daily] 운세 저장 실패:', dailyError);
        }
      }
    }

    return NextResponse.json({
      success: true,
      fortune,
    });
  } catch (error) {
    console.error('Daily fortune error:', error);
    return NextResponse.json(
      { error: 'Failed to generate fortune' },
      { status: 500 }
    );
  }
}

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

    const today = new Date().toISOString().split('T')[0];

    // Check in for today
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const { data: existing } = await (supabase as any)
      .from('checkins')
      .select('*')
      .eq('user_id', user.id)
      .eq('checked_at', today)
      .single() as { data: { streak_count: number } | null };

    if (existing) {
      return NextResponse.json({
        success: true,
        alreadyCheckedIn: true,
        streak: existing.streak_count,
      });
    }

    // Get yesterday's check-in for streak calculation
    const yesterday = new Date(Date.now() - 86400000).toISOString().split('T')[0];
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const { data: yesterdayCheckin } = await (supabase as any)
      .from('checkins')
      .select('streak_count')
      .eq('user_id', user.id)
      .eq('checked_at', yesterday)
      .single() as { data: { streak_count: number } | null };

    const newStreak = yesterdayCheckin ? yesterdayCheckin.streak_count + 1 : 1;

    // Determine reward
    let rewardType = 'coin';
    let rewardAmount = 10;

    if (newStreak % 7 === 0) {
      rewardType = 'bonus';
      rewardAmount = 50;
    } else if (newStreak % 30 === 0) {
      rewardType = 'premium_day';
      rewardAmount = 1;
    }

    // Create check-in (Service client 사용)
    const serviceClient = createServiceClient();
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const { error: checkinError } = await (serviceClient as any).from('checkins').insert({
      user_id: user.id,
      checked_at: today,
      streak_count: newStreak,
      reward_type: rewardType,
      reward_amount: rewardAmount,
    });
    if (checkinError) {
      console.error('[Checkin] 체크인 저장 실패:', checkinError);
    }

    // Add coins to user balance
    if (rewardType === 'coin' || rewardType === 'bonus') {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      await (serviceClient as any).rpc('increment_coins', {
        user_id: user.id,
        amount: rewardAmount,
      });
    }

    return NextResponse.json({
      success: true,
      streak: newStreak,
      reward: {
        type: rewardType,
        amount: rewardAmount,
      },
    });
  } catch (error) {
    console.error('Check-in error:', error);
    return NextResponse.json(
      { error: 'Check-in failed' },
      { status: 500 }
    );
  }
}
