import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';

// Churn risk indicators and their weights
const RISK_INDICATORS = {
  low_activity: 30,           // No activity in last 7 days
  declining_usage: 20,        // Usage dropped significantly
  no_recent_purchase: 15,     // No purchase in subscription period
  low_feature_adoption: 15,   // Not using premium features
  negative_feedback: 10,      // Left negative feedback
  support_tickets: 10,        // Multiple unresolved tickets
};

export async function GET(request: NextRequest) {
  try {
    const supabase = await createClient();

    const { data: { user }, error: authError } = await supabase.auth.getUser();
    if (authError || !user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Get user profile and activity data
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const [profileResult, activityResult, purchaseResult] = await Promise.all([
      (supabase as any).from('profiles').select('*').eq('id', user.id).single(),
      (supabase as any).from('user_activity').select('*').eq('user_id', user.id).order('created_at', { ascending: false }).limit(30),
      (supabase as any).from('payments').select('*').eq('user_id', user.id).eq('status', 'completed').order('created_at', { ascending: false }).limit(10),
    ]);

    const profile = profileResult.data;
    const activities: any[] = activityResult.data || [];
    const purchases: any[] = purchaseResult.data || [];

    // Calculate churn risk score
    let riskScore = 0;
    const riskFactors: string[] = [];

    // Check last activity
    const lastActivity = activities[0]?.created_at;
    const daysSinceActivity = lastActivity
      ? Math.floor((Date.now() - new Date(lastActivity).getTime()) / (1000 * 60 * 60 * 24))
      : 999;

    if (daysSinceActivity > 7) {
      riskScore += RISK_INDICATORS.low_activity;
      riskFactors.push('low_activity');
    }

    // Check usage trend (compare last 7 days vs previous 7 days)
    const now = new Date();
    const weekAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
    const twoWeeksAgo = new Date(now.getTime() - 14 * 24 * 60 * 60 * 1000);

    const recentActivities = activities.filter(a => new Date(a.created_at) > weekAgo).length;
    const previousActivities = activities.filter(a => {
      const date = new Date(a.created_at);
      return date > twoWeeksAgo && date <= weekAgo;
    }).length;

    if (previousActivities > 0 && recentActivities < previousActivities * 0.5) {
      riskScore += RISK_INDICATORS.declining_usage;
      riskFactors.push('declining_usage');
    }

    // Check recent purchases
    const lastPurchase = purchases[0]?.created_at;
    const daysSincePurchase = lastPurchase
      ? Math.floor((Date.now() - new Date(lastPurchase).getTime()) / (1000 * 60 * 60 * 24))
      : 999;

    if (daysSincePurchase > 30 && profile?.membership_type !== 'free') {
      riskScore += RISK_INDICATORS.no_recent_purchase;
      riskFactors.push('no_recent_purchase');
    }

    // Check feature adoption (mock - would need actual feature usage tracking)
    const premiumFeaturesUsed = activities.filter(a =>
      a.activity_type === 'premium_feature'
    ).length;

    if (premiumFeaturesUsed < 3 && profile?.membership_type !== 'free') {
      riskScore += RISK_INDICATORS.low_feature_adoption;
      riskFactors.push('low_feature_adoption');
    }

    // Determine risk level
    let riskLevel: 'low' | 'medium' | 'high' | 'critical';
    if (riskScore >= 60) {
      riskLevel = 'critical';
    } else if (riskScore >= 40) {
      riskLevel = 'high';
    } else if (riskScore >= 20) {
      riskLevel = 'medium';
    } else {
      riskLevel = 'low';
    }

    // Generate recommended actions based on risk factors
    const recommendations: { action: string; priority: number }[] = [];

    if (riskFactors.includes('low_activity')) {
      recommendations.push({
        action: 'send_reengagement_email',
        priority: 1,
      });
    }

    if (riskFactors.includes('declining_usage')) {
      recommendations.push({
        action: 'offer_feature_tutorial',
        priority: 2,
      });
    }

    if (riskFactors.includes('no_recent_purchase')) {
      recommendations.push({
        action: 'send_special_offer',
        priority: 1,
      });
    }

    if (riskFactors.includes('low_feature_adoption')) {
      recommendations.push({
        action: 'highlight_unused_features',
        priority: 3,
      });
    }

    // Log retention check for analytics
    await (supabase as any).from('retention_checks').insert({
      user_id: user.id,
      risk_score: riskScore,
      risk_level: riskLevel,
      risk_factors: riskFactors,
      recommendations: recommendations,
    });

    return NextResponse.json({
      success: true,
      data: {
        riskScore,
        riskLevel,
        riskFactors,
        recommendations: recommendations.sort((a, b) => a.priority - b.priority),
        metrics: {
          daysSinceActivity,
          daysSincePurchase,
          recentActivities,
          previousActivities,
          premiumFeaturesUsed,
        },
      },
    });
  } catch (error) {
    console.error('Retention check error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

// Batch check for all at-risk users (admin endpoint)
export async function POST(request: NextRequest) {
  try {
    const supabase = await createClient();

    const { data: { user }, error: authError } = await supabase.auth.getUser();
    if (authError || !user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Check if admin
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const { data: profile } = await (supabase as any)
      .from('profiles')
      .select('role')
      .eq('id', user.id)
      .single();

    if (profile?.role !== 'admin') {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
    }

    // Get users with subscriptions who haven't been active recently
    const sevenDaysAgo = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString();

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const { data: inactiveUsers } = await (supabase as any)
      .from('profiles')
      .select('id, email, membership_type, last_active_at')
      .neq('membership_type', 'free')
      .lt('last_active_at', sevenDaysAgo);

    const atRiskUsers: any[] = inactiveUsers || [];

    // Queue re-engagement emails for at-risk users
    for (const atRiskUser of atRiskUsers) {
      await (supabase as any).from('email_queue').insert({
        user_id: atRiskUser.id,
        email: atRiskUser.email,
        template: 'reengagement',
        scheduled_at: new Date().toISOString(),
        metadata: {
          membership_type: atRiskUser.membership_type,
          days_inactive: Math.floor(
            (Date.now() - new Date(atRiskUser.last_active_at).getTime()) / (1000 * 60 * 60 * 24)
          ),
        },
      });
    }

    return NextResponse.json({
      success: true,
      data: {
        atRiskCount: atRiskUsers.length,
        emailsQueued: atRiskUsers.length,
      },
    });
  } catch (error) {
    console.error('Batch retention check error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
