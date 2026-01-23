import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import { nanoid } from 'nanoid';

/**
 * 횟수권 구매 요청 API
 * POST /api/voucher/purchase
 */
export async function POST(request: NextRequest) {
  try {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
      return NextResponse.json(
        { error: '로그인이 필요합니다.' },
        { status: 401 }
      );
    }

    const body = await request.json();
    const packageId = body.package_id || body.packageId;

    if (!packageId) {
      return NextResponse.json(
        { error: '패키지 ID가 필요합니다.' },
        { status: 400 }
      );
    }

    // 패키지 정보 조회
    const { data: pkg, error: pkgError } = await supabase
      .from('voucher_packages')
      .select('*')
      .eq('id', packageId)
      .eq('is_active', true)
      .single();

    if (pkgError || !pkg) {
      return NextResponse.json(
        { error: '유효하지 않은 패키지입니다.' },
        { status: 404 }
      );
    }

    // 프로모션 품절 체크
    if (pkg.promotion_limit && pkg.promotion_sold >= pkg.promotion_limit) {
      return NextResponse.json(
        { error: '선착순 마감되었습니다.' },
        { status: 400 }
      );
    }

    // 주문번호 생성
    const orderId = `VOUCHER-${Date.now()}-${nanoid(8)}`;

    // 결제 대기 레코드 생성
    const { data: payment, error: paymentError } = await supabase
      .from('voucher_payments')
      .insert({
        user_id: user.id,
        order_id: orderId,
        order_name: pkg.name,
        amount: pkg.sale_price,
        package_id: pkg.id,
        status: 'pending',
      })
      .select()
      .single();

    if (paymentError) {
      console.error('Payment record creation error:', paymentError);
      return NextResponse.json(
        { error: '결제 생성에 실패했습니다.' },
        { status: 500 }
      );
    }

    // 토스페이먼츠 결제 정보 생성
    const tossPaymentData = {
      orderId: orderId,
      orderName: pkg.name,
      amount: pkg.sale_price,
      customerName: user.user_metadata?.name || user.email?.split('@')[0] || '고객',
      customerEmail: user.email,
      successUrl: `${process.env.NEXT_PUBLIC_SITE_URL || 'https://www.ai-planx.com'}/api/voucher/callback/success`,
      failUrl: `${process.env.NEXT_PUBLIC_SITE_URL || 'https://www.ai-planx.com'}/api/voucher/callback/fail`,
    };

    return NextResponse.json({
      success: true,
      paymentId: payment.id,
      orderId: orderId,
      package: {
        id: pkg.id,
        name: pkg.name,
        quantity: pkg.quantity,
        amount: pkg.sale_price,
        serviceType: pkg.service_type,
      },
      toss: tossPaymentData,
    });
  } catch (error) {
    console.error('Voucher purchase API error:', error);
    return NextResponse.json(
      { error: '서버 오류가 발생했습니다.' },
      { status: 500 }
    );
  }
}
