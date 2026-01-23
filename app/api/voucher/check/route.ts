import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';

/**
 * 사용자 이용권 잔여 횟수 확인
 * GET /api/voucher/check?service_type=saju
 */
export async function GET(request: NextRequest) {
  try {
    const supabase = await createClient();
    const { searchParams } = new URL(request.url);
    const serviceType = searchParams.get('service_type');

    // 인증 확인
    const { data: { user }, error: authError } = await supabase.auth.getUser();
    if (authError || !user) {
      return NextResponse.json(
        { error: '로그인이 필요합니다.' },
        { status: 401 }
      );
    }

    // 서비스 타입별 조회 또는 전체 조회
    let query = supabase
      .from('user_vouchers')
      .select('*')
      .eq('user_id', user.id)
      .eq('status', 'active')
      .gt('remaining_quantity', 0)
      .gt('expires_at', new Date().toISOString())
      .order('expires_at', { ascending: true });

    if (serviceType) {
      query = query.eq('service_type', serviceType);
    }

    const { data: vouchers, error } = await query;

    if (error) {
      console.error('Voucher check error:', error);
      return NextResponse.json(
        { error: '이용권 조회에 실패했습니다.' },
        { status: 500 }
      );
    }

    // 서비스 타입별 합계 계산
    const summary: Record<string, { total: number; expiring_soon: number }> = {};

    vouchers?.forEach(voucher => {
      const type = voucher.service_type;
      if (!summary[type]) {
        summary[type] = { total: 0, expiring_soon: 0 };
      }
      summary[type].total += voucher.remaining_quantity;

      // 7일 이내 만료되는 이용권 체크
      const expiresAt = new Date(voucher.expires_at);
      const sevenDaysLater = new Date();
      sevenDaysLater.setDate(sevenDaysLater.getDate() + 7);
      if (expiresAt <= sevenDaysLater) {
        summary[type].expiring_soon += voucher.remaining_quantity;
      }
    });

    return NextResponse.json({
      success: true,
      vouchers: vouchers || [],
      summary,
      hasVoucher: (vouchers?.length || 0) > 0,
    });
  } catch (error) {
    console.error('Voucher check API error:', error);
    return NextResponse.json(
      { error: '서버 오류가 발생했습니다.' },
      { status: 500 }
    );
  }
}
