import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';

// Referral levels with commission rates
const REFERRAL_LEVELS = [
  { level: 1, minReferrals: 0, commission: 20, bonus: 0 },
  { level: 2, minReferrals: 5, commission: 25, bonus: 100 },
  { level: 3, minReferrals: 20, commission: 30, bonus: 300 },
  { level: 4, minReferrals: 50, commission: 35, bonus: 500 },
];

// Points reward for referral (마케팅 전략: 합계 500P = 사주분석 비용)
const REFERRAL_REWARD_POINTS = 300;  // 추천인 보상
const REFEREE_BONUS_POINTS = 200;    // 신규 가입자 보상

export async function GET(request: NextRequest) {
  try {
    const supabase = await createClient();

    const { data: { user }, error: authError } = await supabase.auth.getUser();
    if (authError || !user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Get user's referral stats
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const { data: profile } = await (supabase as any)
      .from('profiles')
      .select('referral_code, total_referrals, referral_earnings')
      .eq('id', user.id)
      .single();

    // Generate referral code if not exists
    let referralCode = profile?.referral_code;
    if (!referralCode) {
      referralCode = `REF-${user.id.substring(0, 8).toUpperCase()}`;
      await (supabase as any)
        .from('profiles')
        .update({ referral_code: referralCode })
        .eq('id', user.id);
    }

    // Get list of referred users
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const { data: referrals } = await (supabase as any)
      .from('referrals')
      .select(`
        id,
        created_at,
        status,
        commission_earned,
        referee:referee_id (
          id,
          email,
          membership_type
        )
      `)
      .eq('referrer_id', user.id)
      .order('created_at', { ascending: false });

    // Calculate current level
    const totalReferrals = profile?.total_referrals || 0;
    const currentLevel = REFERRAL_LEVELS.reduce((acc, level) => {
      return totalReferrals >= level.minReferrals ? level : acc;
    }, REFERRAL_LEVELS[0]);

    const nextLevel = REFERRAL_LEVELS.find(l => l.level === currentLevel.level + 1);
    const referralsToNextLevel = nextLevel
      ? nextLevel.minReferrals - totalReferrals
      : 0;

    return NextResponse.json({
      success: true,
      data: {
        referralCode,
        referralLink: `${process.env.NEXT_PUBLIC_APP_URL}/signup?ref=${referralCode}`,
        stats: {
          totalReferrals,
          totalEarnings: profile?.referral_earnings || 0,
          currentLevel,
          nextLevel,
          referralsToNextLevel,
        },
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        referrals: referrals?.map((r: any) => ({
          id: r.id,
          date: r.created_at,
          status: r.status,
          commissionEarned: r.commission_earned,
          referee: {
            id: r.referee?.id,
            email: r.referee?.email?.replace(/(.{2}).*(@.*)/, '$1***$2'),
            membershipType: r.referee?.membership_type,
          },
        })) || [],
        levels: REFERRAL_LEVELS,
      },
    });
  } catch (error) {
    console.error('Get referral error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

// Process referral signup
export async function POST(request: NextRequest) {
  try {
    const supabase = await createClient();

    const { data: { user }, error: authError } = await supabase.auth.getUser();
    if (authError || !user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await request.json();
    const { referralCode } = body;

    if (!referralCode) {
      return NextResponse.json(
        { error: 'Missing referral code' },
        { status: 400 }
      );
    }

    // Find referrer by code
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const { data: referrer } = await (supabase as any)
      .from('profiles')
      .select('id, total_referrals')
      .eq('referral_code', referralCode)
      .single();

    if (!referrer) {
      return NextResponse.json(
        { error: 'Invalid referral code' },
        { status: 404 }
      );
    }

    // Check if user was already referred
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const { data: existingReferral } = await (supabase as any)
      .from('referrals')
      .select('id')
      .eq('referee_id', user.id)
      .single();

    if (existingReferral) {
      return NextResponse.json(
        { error: 'Already referred' },
        { status: 400 }
      );
    }

    // Can't refer yourself
    if (referrer.id === user.id) {
      return NextResponse.json(
        { error: 'Cannot refer yourself' },
        { status: 400 }
      );
    }

    // Create referral record
    await (supabase as any).from('referrals').insert({
      referrer_id: referrer.id,
      referee_id: user.id,
      status: 'pending',
      commission_rate: REFERRAL_LEVELS.find(
        l => (referrer.total_referrals || 0) >= l.minReferrals
      )?.commission || 20,
    });

    // Give bonus coins to new user
    await (supabase as any).rpc('increment_coins', {
      user_id: user.id,
      amount: REFEREE_BONUS_POINTS,
    });

    // Log coin transaction
    await (supabase as any).from('coin_transactions').insert({
      user_id: user.id,
      amount: REFEREE_BONUS_POINTS,
      type: 'referral_bonus',
      description: `Welcome bonus from referral`,
    });

    return NextResponse.json({
      success: true,
      data: {
        message: 'Referral applied successfully',
        bonusCoins: REFEREE_BONUS_POINTS,
      },
    });
  } catch (error) {
    console.error('Process referral error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

// Complete referral (when referee makes first purchase)
export async function PUT(request: NextRequest) {
  try {
    const supabase = await createClient();

    const body = await request.json();
    const { refereeId, purchaseAmount } = body;

    // This would typically be called from a webhook or internal process
    // Verify admin or system call
    const { data: { user }, error: authError } = await supabase.auth.getUser();
    if (authError || !user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Get pending referral
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const { data: referral } = await (supabase as any)
      .from('referrals')
      .select('*, referrer:referrer_id (id, total_referrals, referral_earnings)')
      .eq('referee_id', refereeId)
      .eq('status', 'pending')
      .single();

    if (!referral) {
      return NextResponse.json(
        { error: 'No pending referral found' },
        { status: 404 }
      );
    }

    // Calculate commission
    const commissionRate = referral.commission_rate || 20;
    const commission = Math.floor(purchaseAmount * (commissionRate / 100));

    // Update referral status
    await (supabase as any)
      .from('referrals')
      .update({
        status: 'completed',
        commission_earned: commission,
        completed_at: new Date().toISOString(),
      })
      .eq('id', referral.id);

    // Update referrer stats
    const referrer = referral.referrer as any;
    await (supabase as any)
      .from('profiles')
      .update({
        total_referrals: (referrer.total_referrals || 0) + 1,
        referral_earnings: (referrer.referral_earnings || 0) + commission,
      })
      .eq('id', referrer.id);

    // Give referrer reward coins
    await (supabase as any).rpc('increment_coins', {
      user_id: referrer.id,
      amount: REFERRAL_REWARD_POINTS + commission,
    });

    // Log transactions
    await (supabase as any).from('coin_transactions').insert([
      {
        user_id: referrer.id,
        amount: REFERRAL_REWARD_POINTS,
        type: 'referral_reward',
        description: 'Referral completion bonus',
      },
      {
        user_id: referrer.id,
        amount: commission,
        type: 'referral_commission',
        description: `Commission from referral (${commissionRate}%)`,
      },
    ]);

    return NextResponse.json({
      success: true,
      data: {
        referralId: referral.id,
        referrerId: referrer.id,
        commission,
        totalReward: REFERRAL_REWARD_POINTS + commission,
      },
    });
  } catch (error) {
    console.error('Complete referral error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
