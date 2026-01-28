import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';

/**
 * 횟수권 패키지 목록 조회 API
 * GET /api/voucher/packages?service_type=saju
 */
export async function GET(request: NextRequest) {
  try {
    const supabase = await createClient();
    const { searchParams } = new URL(request.url);
    const serviceType = searchParams.get('service_type');

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    let query = (supabase as any)
      .from('voucher_packages')
      .select('*')
      .eq('is_active', true)
      .order('sort_order', { ascending: true });

    if (serviceType) {
      query = query.eq('service_type', serviceType);
    }

    const { data: packages, error } = await query;

    if (error) {
      console.error('Voucher packages fetch error:', error);
      return NextResponse.json(
        { error: '패키지 목록을 불러오는데 실패했습니다.' },
        { status: 500 }
      );
    }

    // 프로모션 패키지의 남은 수량 계산
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const packagesWithAvailability = packages?.map((pkg: any) => ({
      ...pkg,
      promotion_remaining: pkg.promotion_limit
        ? pkg.promotion_limit - (pkg.promotion_sold || 0)
        : null,
      is_sold_out: pkg.promotion_limit
        ? pkg.promotion_sold >= pkg.promotion_limit
        : false,
    }));

    return NextResponse.json({
      success: true,
      packages: packagesWithAvailability,
    });
  } catch (error) {
    console.error('Voucher packages API error:', error);
    return NextResponse.json(
      { error: '서버 오류가 발생했습니다.' },
      { status: 500 }
    );
  }
}
