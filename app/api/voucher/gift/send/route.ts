import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import { nanoid } from 'nanoid';

/**
 * 이용권 선물하기 API
 * POST /api/voucher/gift/send
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
    const { voucher_id, quantity, recipient_email, recipient_phone, message } = body;

    if (!voucher_id || !quantity || quantity < 1) {
      return NextResponse.json(
        { error: '이용권 ID와 선물 횟수를 입력해주세요.' },
        { status: 400 }
      );
    }

    if (!recipient_email && !recipient_phone) {
      return NextResponse.json(
        { error: '수신자 이메일 또는 전화번호를 입력해주세요.' },
        { status: 400 }
      );
    }

    // 보유 이용권 확인
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const { data: voucher, error: voucherError } = await (supabase as any)
      .from('user_vouchers')
      .select('*')
      .eq('id', voucher_id)
      .eq('user_id', user.id)
      .eq('status', 'active')
      .single();

    if (voucherError || !voucher) {
      return NextResponse.json(
        { error: '유효한 이용권이 아닙니다.' },
        { status: 404 }
      );
    }

    // 잔여 횟수 확인
    if (voucher.remaining_quantity < quantity) {
      return NextResponse.json(
        { error: `선물 가능한 횟수가 부족합니다. (잔여: ${voucher.remaining_quantity}회)` },
        { status: 400 }
      );
    }

    // 선물 코드 생성
    const giftCode = nanoid(12).toUpperCase();

    // 유효기간 설정 (7일)
    const expiresAt = new Date();
    expiresAt.setDate(expiresAt.getDate() + 7);

    // 수신자가 이미 가입한 회원인지 확인
    let recipientId = null;
    if (recipient_email) {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const { data: existingUser } = await (supabase as any)
        .from('users')
        .select('id')
        .eq('email', recipient_email)
        .single();

      if (existingUser) {
        recipientId = existingUser.id;
      }
    }

    // 선물 레코드 생성
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const { data: gift, error: giftError } = await (supabase as any)
      .from('voucher_gifts')
      .insert({
        sender_id: user.id,
        sender_voucher_id: voucher_id,
        service_type: voucher.service_type,
        quantity: quantity,
        recipient_id: recipientId,
        recipient_email: recipient_email,
        recipient_phone: recipient_phone,
        gift_code: giftCode,
        gift_url: `${process.env.NEXT_PUBLIC_SITE_URL || 'https://www.ai-planx.com'}/gift/claim?code=${giftCode}`,
        message: message,
        status: 'pending',
        expires_at: expiresAt.toISOString(),
      })
      .select()
      .single();

    if (giftError) {
      console.error('Gift creation error:', giftError);
      return NextResponse.json(
        { error: '선물 생성에 실패했습니다.' },
        { status: 500 }
      );
    }

    // 발송자의 이용권에서 차감
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const { error: updateError } = await (supabase as any)
      .from('user_vouchers')
      .update({
        used_quantity: voucher.used_quantity + quantity,
        updated_at: new Date().toISOString(),
      })
      .eq('id', voucher_id);

    if (updateError) {
      // 롤백: 선물 레코드 삭제
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      await (supabase as any).from('voucher_gifts').delete().eq('id', gift.id);

      return NextResponse.json(
        { error: '이용권 차감에 실패했습니다.' },
        { status: 500 }
      );
    }

    return NextResponse.json({
      success: true,
      gift: {
        id: gift.id,
        code: giftCode,
        url: gift.gift_url,
        quantity: quantity,
        service_type: voucher.service_type,
        expires_at: expiresAt.toISOString(),
      },
      message: '선물이 생성되었습니다. 수신자에게 링크를 공유해주세요.',
    });
  } catch (error) {
    console.error('Gift send API error:', error);
    return NextResponse.json(
      { error: '서버 오류가 발생했습니다.' },
      { status: 500 }
    );
  }
}
