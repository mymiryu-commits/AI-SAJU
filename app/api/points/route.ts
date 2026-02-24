import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';

// 포인트 조회
export async function GET() {
  try {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
      return NextResponse.json(
        { error: '로그인이 필요합니다' },
        { status: 401 }
      );
    }

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const { data: profile, error } = await (supabase as any)
      .from('profiles')
      .select('points, total_points_earned, total_points_spent')
      .eq('id', user.id)
      .single();

    if (error) {
      // 프로필이 없으면 기본값 반환
      return NextResponse.json({
        success: true,
        data: {
          points: 0,
          totalEarned: 0,
          totalSpent: 0
        }
      });
    }

    return NextResponse.json({
      success: true,
      data: {
        points: profile.points || 0,
        totalEarned: profile.total_points_earned || 0,
        totalSpent: profile.total_points_spent || 0
      }
    });
  } catch (error) {
    console.error('Points fetch error:', error);
    return NextResponse.json(
      { error: '포인트 조회 실패' },
      { status: 500 }
    );
  }
}

// 포인트 차감 (분석 구매)
export async function POST(request: NextRequest) {
  try {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
      return NextResponse.json(
        { error: '로그인이 필요합니다' },
        { status: 401 }
      );
    }

    const body = await request.json();
    const { productId, pointCost, analysisId } = body;

    if (!productId || !pointCost) {
      return NextResponse.json(
        { error: '상품 정보가 필요합니다' },
        { status: 400 }
      );
    }

    // 현재 포인트 조회
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const { data: profile, error: profileError } = await (supabase as any)
      .from('profiles')
      .select('points')
      .eq('id', user.id)
      .single();

    if (profileError) {
      return NextResponse.json(
        { error: '프로필 조회 실패' },
        { status: 500 }
      );
    }

    const currentPoints = profile?.points || 0;

    // 포인트 부족 체크
    if (currentPoints < pointCost) {
      return NextResponse.json(
        {
          error: '포인트가 부족합니다',
          currentPoints,
          requiredPoints: pointCost,
          shortfall: pointCost - currentPoints
        },
        { status: 402 }
      );
    }

    // 포인트 차감
    const newPoints = currentPoints - pointCost;

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const { error: updateError } = await (supabase as any)
      .from('profiles')
      .update({
        points: newPoints,
        total_points_spent: (profile.total_points_spent || 0) + pointCost,
        updated_at: new Date().toISOString()
      })
      .eq('id', user.id);

    if (updateError) {
      return NextResponse.json(
        { error: '포인트 차감 실패' },
        { status: 500 }
      );
    }

    // 포인트 사용 내역 기록
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    await (supabase as any)
      .from('point_transactions')
      .insert({
        user_id: user.id,
        type: 'spend',
        amount: -pointCost,
        balance_after: newPoints,
        description: `프리미엄 분석 구매: ${productId}`,
        reference_type: 'analysis',
        reference_id: analysisId || null,
        created_at: new Date().toISOString()
      });

    return NextResponse.json({
      success: true,
      data: {
        previousPoints: currentPoints,
        pointsSpent: pointCost,
        newBalance: newPoints,
        productId
      }
    });

  } catch (error) {
    console.error('Point deduction error:', error);
    return NextResponse.json(
      { error: '포인트 차감 실패' },
      { status: 500 }
    );
  }
}

// 포인트 충전 (결제 후 호출)
export async function PUT(request: NextRequest) {
  try {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
      return NextResponse.json(
        { error: '로그인이 필요합니다' },
        { status: 401 }
      );
    }

    const body = await request.json();
    const { points, bonusPoints = 0, packageId, paymentId } = body;

    if (!points || points <= 0) {
      return NextResponse.json(
        { error: '충전할 포인트를 입력하세요' },
        { status: 400 }
      );
    }

    const totalPoints = points + bonusPoints;

    // 현재 포인트 조회
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const { data: profile } = await (supabase as any)
      .from('profiles')
      .select('points, total_points_earned')
      .eq('id', user.id)
      .single();

    const currentPoints = profile?.points || 0;
    const newPoints = currentPoints + totalPoints;

    // 포인트 추가
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const { error: updateError } = await (supabase as any)
      .from('profiles')
      .update({
        points: newPoints,
        total_points_earned: (profile?.total_points_earned || 0) + totalPoints,
        updated_at: new Date().toISOString()
      })
      .eq('id', user.id);

    if (updateError) {
      return NextResponse.json(
        { error: '포인트 충전 실패' },
        { status: 500 }
      );
    }

    // 포인트 충전 내역 기록
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    await (supabase as any)
      .from('point_transactions')
      .insert({
        user_id: user.id,
        type: 'charge',
        amount: totalPoints,
        balance_after: newPoints,
        description: bonusPoints > 0
          ? `포인트 충전 ${points}P + 보너스 ${bonusPoints}P`
          : `포인트 충전 ${points}P`,
        reference_type: 'payment',
        reference_id: paymentId || null,
        metadata: { packageId, basePoints: points, bonusPoints },
        created_at: new Date().toISOString()
      });

    return NextResponse.json({
      success: true,
      data: {
        previousPoints: currentPoints,
        pointsAdded: totalPoints,
        basePoints: points,
        bonusPoints,
        newBalance: newPoints
      }
    });

  } catch (error) {
    console.error('Point charge error:', error);
    return NextResponse.json(
      { error: '포인트 충전 실패' },
      { status: 500 }
    );
  }
}
