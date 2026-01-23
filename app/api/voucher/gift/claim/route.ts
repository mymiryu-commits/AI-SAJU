import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';

/**
 * 선물 수령 API
 * POST /api/voucher/gift/claim
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
    const { code } = body;

    if (!code) {
      return NextResponse.json(
        { error: '선물 코드를 입력해주세요.' },
        { status: 400 }
      );
    }

    // 선물 정보 조회
    const { data: gift, error: giftError } = await supabase
      .from('voucher_gifts')
      .select('*, sender:sender_id(email, user_metadata)')
      .eq('gift_code', code.toUpperCase())
      .single();

    if (giftError || !gift) {
      return NextResponse.json(
        { error: '유효하지 않은 선물 코드입니다.' },
        { status: 404 }
      );
    }

    // 이미 수령된 선물인지 확인
    if (gift.status === 'claimed') {
      return NextResponse.json(
        { error: '이미 수령된 선물입니다.' },
        { status: 400 }
      );
    }

    // 만료된 선물인지 확인
    if (new Date(gift.expires_at) < new Date()) {
      return NextResponse.json(
        { error: '선물 수령 기한이 만료되었습니다.' },
        { status: 400 }
      );
    }

    // 취소된 선물인지 확인
    if (gift.status === 'cancelled') {
      return NextResponse.json(
        { error: '취소된 선물입니다.' },
        { status: 400 }
      );
    }

    // 자기 자신에게 선물 수령 불가
    if (gift.sender_id === user.id) {
      return NextResponse.json(
        { error: '자신이 보낸 선물은 수령할 수 없습니다.' },
        { status: 400 }
      );
    }

    // 유효기간 계산 (선물받은 날로부터 1년)
    const expiresAt = new Date();
    expiresAt.setFullYear(expiresAt.getFullYear() + 1);

    // 수신자의 이용권 생성
    const { data: newVoucher, error: voucherError } = await supabase
      .from('user_vouchers')
      .insert({
        user_id: user.id,
        service_type: gift.service_type,
        total_quantity: gift.quantity,
        used_quantity: 0,
        remaining_quantity: gift.quantity,
        purchase_price: 0,
        unit_price: 0,
        status: 'active',
        source: 'gift',
        source_user_id: gift.sender_id,
        expires_at: expiresAt.toISOString(),
      })
      .select()
      .single();

    if (voucherError) {
      console.error('Voucher creation error:', voucherError);
      return NextResponse.json(
        { error: '이용권 생성에 실패했습니다.' },
        { status: 500 }
      );
    }

    // 선물 상태 업데이트
    const { error: updateError } = await supabase
      .from('voucher_gifts')
      .update({
        status: 'claimed',
        recipient_id: user.id,
        claimed_at: new Date().toISOString(),
        claimed_voucher_id: newVoucher.id,
      })
      .eq('id', gift.id);

    if (updateError) {
      console.error('Gift update error:', updateError);
    }

    return NextResponse.json({
      success: true,
      voucher: {
        id: newVoucher.id,
        service_type: gift.service_type,
        quantity: gift.quantity,
        expires_at: expiresAt.toISOString(),
      },
      gift: {
        sender_name: gift.sender?.user_metadata?.name || gift.sender?.email?.split('@')[0] || '익명',
        message: gift.message,
      },
      message: `${gift.quantity}회 이용권을 받았습니다!`,
    });
  } catch (error) {
    console.error('Gift claim API error:', error);
    return NextResponse.json(
      { error: '서버 오류가 발생했습니다.' },
      { status: 500 }
    );
  }
}

/**
 * 선물 코드 정보 조회
 * GET /api/voucher/gift/claim?code=ABC123
 */
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const code = searchParams.get('code');

    if (!code) {
      return NextResponse.json(
        { error: '선물 코드가 필요합니다.' },
        { status: 400 }
      );
    }

    const supabase = await createClient();

    // 선물 정보 조회 (민감 정보 제외)
    const { data: gift, error } = await supabase
      .from('voucher_gifts')
      .select('service_type, quantity, message, status, expires_at, sender:sender_id(user_metadata)')
      .eq('gift_code', code.toUpperCase())
      .single();

    if (error || !gift) {
      return NextResponse.json(
        { error: '유효하지 않은 선물 코드입니다.' },
        { status: 404 }
      );
    }

    // 만료 체크
    const isExpired = new Date(gift.expires_at) < new Date();

    return NextResponse.json({
      success: true,
      gift: {
        service_type: gift.service_type,
        quantity: gift.quantity,
        message: gift.message,
        status: isExpired ? 'expired' : gift.status,
        expires_at: gift.expires_at,
        sender_name: gift.sender?.user_metadata?.name || '익명',
        is_claimable: gift.status === 'pending' && !isExpired,
      },
    });
  } catch (error) {
    console.error('Gift info API error:', error);
    return NextResponse.json(
      { error: '서버 오류가 발생했습니다.' },
      { status: 500 }
    );
  }
}
