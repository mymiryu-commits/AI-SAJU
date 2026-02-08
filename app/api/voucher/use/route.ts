import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';

/**
 * 이용권 사용 API
 * POST /api/voucher/use
 */
export async function POST(request: NextRequest) {
  try {
    const supabase = await createClient();

    // 인증 확인
    const { data: { user }, error: authError } = await supabase.auth.getUser();
    if (authError || !user) {
      return NextResponse.json(
        { error: '로그인이 필요합니다.' },
        { status: 401 }
      );
    }

    const body = await request.json();
    const { service_type, quantity = 1, related_id, related_type } = body;

    if (!service_type) {
      return NextResponse.json(
        { error: '서비스 타입이 필요합니다.' },
        { status: 400 }
      );
    }

    // 저장 함수 호출로 이용권 사용
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const { data, error } = await (supabase as any).rpc('use_voucher', {
      p_user_id: user.id,
      p_service_type: service_type,
      p_quantity: quantity,
      p_related_id: related_id || null,
      p_related_type: related_type || null,
    });

    if (error) {
      console.error('Voucher use error:', error);
      return NextResponse.json(
        { error: '이용권 사용에 실패했습니다.' },
        { status: 500 }
      );
    }

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const result = data as any;

    // 저장 함수 결과 확인
    if (!result?.success) {
      return NextResponse.json(
        { error: result?.error || '사용 가능한 이용권이 없습니다.' },
        { status: 400 }
      );
    }

    return NextResponse.json({
      success: true,
      voucher_id: result.voucher_id,
      remaining: result.remaining,
      message: `이용권을 사용했습니다. 남은 횟수: ${result.remaining}회`,
    });
  } catch (error) {
    console.error('Voucher use API error:', error);
    return NextResponse.json(
      { error: '서버 오류가 발생했습니다.' },
      { status: 500 }
    );
  }
}
