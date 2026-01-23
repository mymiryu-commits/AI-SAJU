import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';

/**
 * 이용권 사용 내역 조회
 * GET /api/voucher/history?service_type=saju&page=1&limit=10
 */
export async function GET(request: NextRequest) {
  try {
    const supabase = await createClient();
    const { searchParams } = new URL(request.url);
    const serviceType = searchParams.get('service_type');
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '10');
    const offset = (page - 1) * limit;

    // 인증 확인
    const { data: { user }, error: authError } = await supabase.auth.getUser();
    if (authError || !user) {
      return NextResponse.json(
        { error: '로그인이 필요합니다.' },
        { status: 401 }
      );
    }

    // 사용 로그 조회
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    let query = (supabase as any)
      .from('voucher_usage_log')
      .select('*, user_vouchers(package_id, voucher_packages(name))', { count: 'exact' })
      .eq('user_id', user.id)
      .order('used_at', { ascending: false })
      .range(offset, offset + limit - 1);

    if (serviceType) {
      query = query.eq('service_type', serviceType);
    }

    const { data: logs, error, count } = await query;

    if (error) {
      console.error('Voucher history error:', error);
      return NextResponse.json(
        { error: '내역 조회에 실패했습니다.' },
        { status: 500 }
      );
    }

    return NextResponse.json({
      success: true,
      logs: logs || [],
      pagination: {
        page,
        limit,
        total: count || 0,
        totalPages: Math.ceil((count || 0) / limit),
      },
    });
  } catch (error) {
    console.error('Voucher history API error:', error);
    return NextResponse.json(
      { error: '서버 오류가 발생했습니다.' },
      { status: 500 }
    );
  }
}
