import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';

/**
 * 선물 취소 API
 * POST /api/voucher/gift/cancel
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
    const { gift_id } = body;

    if (!gift_id) {
      return NextResponse.json(
        { error: '선물 ID가 필요합니다.' },
        { status: 400 }
      );
    }

    // 선물 정보 조회
    const { data: gift, error: giftError } = await supabase
      .from('voucher_gifts')
      .select('*')
      .eq('id', gift_id)
      .eq('sender_id', user.id)
      .single();

    if (giftError || !gift) {
      return NextResponse.json(
        { error: '선물을 찾을 수 없습니다.' },
        { status: 404 }
      );
    }

    // 이미 수령된 선물은 취소 불가
    if (gift.status === 'claimed') {
      return NextResponse.json(
        { error: '이미 수령된 선물은 취소할 수 없습니다.' },
        { status: 400 }
      );
    }

    // 이미 취소된 선물
    if (gift.status === 'cancelled') {
      return NextResponse.json(
        { error: '이미 취소된 선물입니다.' },
        { status: 400 }
      );
    }

    // 발송자의 이용권 복구
    const { data: voucher, error: voucherError } = await supabase
      .from('user_vouchers')
      .select('*')
      .eq('id', gift.sender_voucher_id)
      .single();

    if (voucherError || !voucher) {
      return NextResponse.json(
        { error: '원본 이용권을 찾을 수 없습니다.' },
        { status: 500 }
      );
    }

    // 이용권 복구
    const { error: updateVoucherError } = await supabase
      .from('user_vouchers')
      .update({
        used_quantity: Math.max(0, voucher.used_quantity - gift.quantity),
        updated_at: new Date().toISOString(),
      })
      .eq('id', gift.sender_voucher_id);

    if (updateVoucherError) {
      return NextResponse.json(
        { error: '이용권 복구에 실패했습니다.' },
        { status: 500 }
      );
    }

    // 선물 상태 업데이트
    const { error: updateGiftError } = await supabase
      .from('voucher_gifts')
      .update({
        status: 'cancelled',
      })
      .eq('id', gift_id);

    if (updateGiftError) {
      // 롤백: 이용권 다시 차감
      await supabase
        .from('user_vouchers')
        .update({
          used_quantity: voucher.used_quantity,
        })
        .eq('id', gift.sender_voucher_id);

      return NextResponse.json(
        { error: '선물 취소에 실패했습니다.' },
        { status: 500 }
      );
    }

    return NextResponse.json({
      success: true,
      message: '선물이 취소되었습니다. 이용권이 복구되었습니다.',
      restored_quantity: gift.quantity,
    });
  } catch (error) {
    console.error('Gift cancel API error:', error);
    return NextResponse.json(
      { error: '서버 오류가 발생했습니다.' },
      { status: 500 }
    );
  }
}
