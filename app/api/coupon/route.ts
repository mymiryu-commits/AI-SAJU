/**
 * 쿠폰 시스템 API
 *
 * GET  - 사용자 보유 쿠폰 조회
 * POST - 쿠폰 코드 등록
 * PUT  - 쿠폰 사용
 */

import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';

// 쿠폰 타입
export type CouponType = 'percentage' | 'fixed' | 'free_analysis' | 'coins' | 'premium_trial';

interface Coupon {
  id: string;
  code: string;
  type: CouponType;
  value: number; // 할인율(%) 또는 금액 또는 코인 수
  min_purchase?: number;
  max_discount?: number;
  valid_products?: string[]; // 적용 가능 상품 ID들
  expires_at: string;
  usage_limit?: number;
  used_count: number;
  is_active: boolean;
}

// 쿠폰 코드 생성 규칙
const COUPON_PATTERNS = {
  WELCOME: { type: 'coins' as CouponType, value: 100, description: '웰컴 보너스' },
  FRIEND: { type: 'percentage' as CouponType, value: 20, description: '친구 추천 할인' },
  PREMIUM: { type: 'premium_trial' as CouponType, value: 7, description: '프리미엄 7일 체험' },
  LUNAR: { type: 'free_analysis' as CouponType, value: 1, description: '무료 분석권' }
};

// 사용자 쿠폰 조회
export async function GET(request: NextRequest) {
  try {
    const supabase = await createClient();

    const { data: { user }, error: authError } = await supabase.auth.getUser();
    if (authError || !user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // 사용자 보유 쿠폰 조회
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const { data: userCoupons, error } = await (supabase as any)
      .from('user_coupons')
      .select(`
        id,
        is_used,
        used_at,
        created_at,
        coupon:coupon_id (
          id,
          code,
          type,
          value,
          min_purchase,
          max_discount,
          valid_products,
          expires_at,
          description
        )
      `)
      .eq('user_id', user.id)
      .eq('is_used', false)
      .gte('coupon.expires_at', new Date().toISOString())
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Get coupons error:', error);
      return NextResponse.json({ error: 'Failed to fetch coupons' }, { status: 500 });
    }

    // 사용 완료된 쿠폰도 함께 조회 (최근 10개)
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const { data: usedCoupons } = await (supabase as any)
      .from('user_coupons')
      .select(`
        id,
        is_used,
        used_at,
        coupon:coupon_id (code, type, value, description)
      `)
      .eq('user_id', user.id)
      .eq('is_used', true)
      .order('used_at', { ascending: false })
      .limit(10);

    return NextResponse.json({
      success: true,
      data: {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        available: userCoupons?.filter((c: any) => c.coupon).map((c: any) => ({
          id: c.id,
          code: c.coupon.code,
          type: c.coupon.type,
          value: c.coupon.value,
          minPurchase: c.coupon.min_purchase,
          maxDiscount: c.coupon.max_discount,
          validProducts: c.coupon.valid_products,
          expiresAt: c.coupon.expires_at,
          description: c.coupon.description,
          createdAt: c.created_at
        })) || [],
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        used: usedCoupons?.map((c: any) => ({
          id: c.id,
          code: c.coupon?.code,
          type: c.coupon?.type,
          value: c.coupon?.value,
          description: c.coupon?.description,
          usedAt: c.used_at
        })) || []
      }
    });

  } catch (error) {
    console.error('Get coupons error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

// 쿠폰 코드 등록
export async function POST(request: NextRequest) {
  try {
    const supabase = await createClient();

    const { data: { user }, error: authError } = await supabase.auth.getUser();
    if (authError || !user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await request.json();
    const { code } = body;

    if (!code || typeof code !== 'string') {
      return NextResponse.json({ error: 'Invalid coupon code' }, { status: 400 });
    }

    const normalizedCode = code.toUpperCase().trim();

    // 쿠폰 조회
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const { data: coupon, error: couponError } = await (supabase as any)
      .from('coupons')
      .select('*')
      .eq('code', normalizedCode)
      .eq('is_active', true)
      .single();

    if (couponError || !coupon) {
      return NextResponse.json({ error: 'Invalid or expired coupon code' }, { status: 404 });
    }

    // 만료 확인
    if (new Date(coupon.expires_at) < new Date()) {
      return NextResponse.json({ error: 'Coupon has expired' }, { status: 400 });
    }

    // 사용 제한 확인
    if (coupon.usage_limit && coupon.used_count >= coupon.usage_limit) {
      return NextResponse.json({ error: 'Coupon usage limit reached' }, { status: 400 });
    }

    // 이미 등록한 쿠폰인지 확인
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const { data: existingCoupon } = await (supabase as any)
      .from('user_coupons')
      .select('id')
      .eq('user_id', user.id)
      .eq('coupon_id', coupon.id)
      .single();

    if (existingCoupon) {
      return NextResponse.json({ error: 'Coupon already registered' }, { status: 400 });
    }

    // 쿠폰 등록
    await (supabase as any).from('user_coupons').insert({
      user_id: user.id,
      coupon_id: coupon.id,
      is_used: false
    });

    // 쿠폰 사용 횟수 증가
    await (supabase as any)
      .from('coupons')
      .update({ used_count: coupon.used_count + 1 })
      .eq('id', coupon.id);

    // 코인 쿠폰인 경우 즉시 지급
    if (coupon.type === 'coins') {
      await (supabase as any).rpc('increment_coins', {
        user_id: user.id,
        amount: coupon.value
      });

      await (supabase as any).from('coin_transactions').insert({
        user_id: user.id,
        amount: coupon.value,
        type: 'coupon_reward',
        description: `Coupon: ${normalizedCode}`
      });

      // 코인 쿠폰은 즉시 사용 처리
      await (supabase as any)
        .from('user_coupons')
        .update({ is_used: true, used_at: new Date().toISOString() })
        .eq('user_id', user.id)
        .eq('coupon_id', coupon.id);
    }

    // 프리미엄 체험 쿠폰인 경우
    if (coupon.type === 'premium_trial') {
      const trialDays = coupon.value;
      const expiresAt = new Date();
      expiresAt.setDate(expiresAt.getDate() + trialDays);

      await (supabase as any)
        .from('profiles')
        .update({
          membership_tier: 'premium_trial',
          membership_expires_at: expiresAt.toISOString()
        })
        .eq('id', user.id);

      // 체험 쿠폰은 즉시 사용 처리
      await (supabase as any)
        .from('user_coupons')
        .update({ is_used: true, used_at: new Date().toISOString() })
        .eq('user_id', user.id)
        .eq('coupon_id', coupon.id);
    }

    return NextResponse.json({
      success: true,
      data: {
        code: coupon.code,
        type: coupon.type,
        value: coupon.value,
        description: coupon.description,
        message: getCouponApplyMessage(coupon.type, coupon.value)
      }
    });

  } catch (error) {
    console.error('Register coupon error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

// 쿠폰 사용
export async function PUT(request: NextRequest) {
  try {
    const supabase = await createClient();

    const { data: { user }, error: authError } = await supabase.auth.getUser();
    if (authError || !user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await request.json();
    const { userCouponId, productId, purchaseAmount } = body;

    if (!userCouponId) {
      return NextResponse.json({ error: 'User coupon ID required' }, { status: 400 });
    }

    // 쿠폰 조회
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const { data: userCoupon, error } = await (supabase as any)
      .from('user_coupons')
      .select(`
        id,
        is_used,
        coupon:coupon_id (*)
      `)
      .eq('id', userCouponId)
      .eq('user_id', user.id)
      .single();

    if (error || !userCoupon) {
      return NextResponse.json({ error: 'Coupon not found' }, { status: 404 });
    }

    if (userCoupon.is_used) {
      return NextResponse.json({ error: 'Coupon already used' }, { status: 400 });
    }

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const coupon = userCoupon.coupon as any;

    // 만료 확인
    if (new Date(coupon.expires_at) < new Date()) {
      return NextResponse.json({ error: 'Coupon has expired' }, { status: 400 });
    }

    // 적용 가능 상품 확인
    if (coupon.valid_products?.length && productId && !coupon.valid_products.includes(productId)) {
      return NextResponse.json({ error: 'Coupon not valid for this product' }, { status: 400 });
    }

    // 최소 구매 금액 확인
    if (coupon.min_purchase && purchaseAmount && purchaseAmount < coupon.min_purchase) {
      return NextResponse.json({
        error: 'Minimum purchase amount not met',
        minPurchase: coupon.min_purchase
      }, { status: 400 });
    }

    // 할인 금액 계산
    let discountAmount = 0;
    if (coupon.type === 'percentage') {
      discountAmount = Math.floor(purchaseAmount * (coupon.value / 100));
      if (coupon.max_discount) {
        discountAmount = Math.min(discountAmount, coupon.max_discount);
      }
    } else if (coupon.type === 'fixed') {
      discountAmount = coupon.value;
    }

    // 쿠폰 사용 처리
    await (supabase as any)
      .from('user_coupons')
      .update({
        is_used: true,
        used_at: new Date().toISOString(),
        used_for_product: productId,
        discount_applied: discountAmount
      })
      .eq('id', userCouponId);

    return NextResponse.json({
      success: true,
      data: {
        couponType: coupon.type,
        discountAmount,
        finalAmount: purchaseAmount ? purchaseAmount - discountAmount : null,
        message: `쿠폰이 적용되었습니다. ${discountAmount > 0 ? `${discountAmount.toLocaleString()}원 할인` : ''}`
      }
    });

  } catch (error) {
    console.error('Use coupon error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

function getCouponApplyMessage(type: CouponType, value: number): string {
  switch (type) {
    case 'percentage':
      return `${value}% 할인 쿠폰이 등록되었습니다.`;
    case 'fixed':
      return `${value.toLocaleString()}원 할인 쿠폰이 등록되었습니다.`;
    case 'coins':
      return `${value} 코인이 지급되었습니다!`;
    case 'free_analysis':
      return `무료 분석권 ${value}회가 지급되었습니다.`;
    case 'premium_trial':
      return `프리미엄 ${value}일 체험권이 활성화되었습니다!`;
    default:
      return '쿠폰이 등록되었습니다.';
  }
}
