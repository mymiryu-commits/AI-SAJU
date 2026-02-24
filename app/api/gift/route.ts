/**
 * 선물하기 API
 *
 * POST - 분석 결과 선물 생성
 * GET  - 선물 조회 (받은 선물/보낸 선물)
 * PUT  - 선물 수락/거절
 */

import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import { randomBytes } from 'crypto';

// 선물 가격 (분석 타입별)
const GIFT_PRICES = {
  saju_basic: { krw: 5900, jpy: 650, usd: 4.99 },
  saju_deep: { krw: 12900, jpy: 1430, usd: 10.99 },
  saju_premium: { krw: 24900, jpy: 2750, usd: 19.99 },
  compatibility: { krw: 9900, jpy: 1100, usd: 8.99 },
  face: { krw: 5900, jpy: 650, usd: 4.99 }
};

type GiftStatus = 'pending' | 'accepted' | 'declined' | 'expired';
type GiftType = keyof typeof GIFT_PRICES;

interface GiftCreateRequest {
  recipientEmail?: string;
  recipientPhone?: string;
  giftType: GiftType;
  message?: string;
  currency?: 'krw' | 'jpy' | 'usd';
}

// 선물 목록 조회
export async function GET(request: NextRequest) {
  try {
    const supabase = await createClient();

    const { data: { user }, error: authError } = await supabase.auth.getUser();
    if (authError || !user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const type = searchParams.get('type'); // 'sent', 'received', 'code'
    const giftCode = searchParams.get('code');

    // 특정 선물 코드로 조회
    if (type === 'code' && giftCode) {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const { data: gift, error } = await (supabase as any)
        .from('gifts')
        .select(`
          id,
          gift_code,
          gift_type,
          message,
          status,
          expires_at,
          sender:sender_id (id, email)
        `)
        .eq('gift_code', giftCode.toUpperCase())
        .single();

      if (error || !gift) {
        return NextResponse.json({ error: 'Gift not found' }, { status: 404 });
      }

      return NextResponse.json({
        success: true,
        data: {
          id: gift.id,
          code: gift.gift_code,
          type: gift.gift_type,
          message: gift.message,
          status: gift.status,
          expiresAt: gift.expires_at,
          senderEmail: (gift.sender as Record<string, unknown>)?.email
        }
      });
    }

    // 보낸 선물 조회
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const { data: sentGifts } = await (supabase as any)
      .from('gifts')
      .select(`
        id,
        gift_code,
        gift_type,
        recipient_email,
        recipient_phone,
        message,
        status,
        price_paid,
        currency,
        created_at,
        accepted_at,
        expires_at,
        recipient:recipient_id (id, email)
      `)
      .eq('sender_id', user.id)
      .order('created_at', { ascending: false });

    // 받은 선물 조회
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const { data: receivedGifts } = await (supabase as any)
      .from('gifts')
      .select(`
        id,
        gift_code,
        gift_type,
        message,
        status,
        created_at,
        accepted_at,
        expires_at,
        sender:sender_id (id, email)
      `)
      .eq('recipient_id', user.id)
      .order('created_at', { ascending: false });

    // 이메일로 받은 미수락 선물 조회
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const { data: pendingByEmail } = await (supabase as any)
      .from('gifts')
      .select(`
        id,
        gift_code,
        gift_type,
        message,
        status,
        created_at,
        expires_at,
        sender:sender_id (id, email)
      `)
      .eq('recipient_email', user.email)
      .eq('status', 'pending')
      .is('recipient_id', null);

    return NextResponse.json({
      success: true,
      data: {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        sent: sentGifts?.map((g: any) => ({
          id: g.id,
          code: g.gift_code,
          type: g.gift_type,
          recipientEmail: g.recipient_email,
          recipientPhone: g.recipient_phone,
          message: g.message,
          status: g.status,
          pricePaid: g.price_paid,
          currency: g.currency,
          createdAt: g.created_at,
          acceptedAt: g.accepted_at,
          expiresAt: g.expires_at,
          recipientInfo: g.recipient
        })) || [],
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        received: [...(receivedGifts || []), ...(pendingByEmail || [])].map((g: any) => ({
          id: g.id,
          code: g.gift_code,
          type: g.gift_type,
          message: g.message,
          status: g.status,
          createdAt: g.created_at,
          acceptedAt: g.accepted_at,
          expiresAt: g.expires_at,
          senderEmail: (g.sender as Record<string, unknown>)?.email
        }))
      }
    });

  } catch (error) {
    console.error('Get gifts error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

// 선물 생성
export async function POST(request: NextRequest) {
  try {
    const supabase = await createClient();

    const { data: { user }, error: authError } = await supabase.auth.getUser();
    if (authError || !user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body: GiftCreateRequest = await request.json();
    const { recipientEmail, recipientPhone, giftType, message, currency = 'krw' } = body;

    // 검증
    if (!recipientEmail && !recipientPhone) {
      return NextResponse.json(
        { error: 'Recipient email or phone is required' },
        { status: 400 }
      );
    }

    if (!giftType || !GIFT_PRICES[giftType]) {
      return NextResponse.json(
        { error: 'Invalid gift type' },
        { status: 400 }
      );
    }

    // 자기 자신에게 선물 불가
    if (recipientEmail === user.email) {
      return NextResponse.json(
        { error: 'Cannot send gift to yourself' },
        { status: 400 }
      );
    }

    const price = GIFT_PRICES[giftType][currency];

    // 선물 코드 생성 (8자리)
    const giftCode = `GIFT-${randomBytes(4).toString('hex').toUpperCase()}`;

    // 만료일 설정 (30일 후)
    const expiresAt = new Date();
    expiresAt.setDate(expiresAt.getDate() + 30);

    // 수신자 ID 조회 (이미 가입된 사용자인 경우)
    let recipientId = null;
    if (recipientEmail) {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const { data: recipient } = await (supabase as any)
        .from('profiles')
        .select('id')
        .eq('email', recipientEmail)
        .single();
      recipientId = recipient?.id;
    }

    // 선물 생성
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const { data: gift, error: insertError } = await (supabase as any)
      .from('gifts')
      .insert({
        sender_id: user.id,
        recipient_id: recipientId,
        recipient_email: recipientEmail,
        recipient_phone: recipientPhone,
        gift_code: giftCode,
        gift_type: giftType,
        message: message?.slice(0, 200), // 메시지 길이 제한
        status: 'pending',
        price_paid: price,
        currency,
        expires_at: expiresAt.toISOString()
      })
      .select()
      .single();

    if (insertError) {
      console.error('Gift insert error:', insertError);
      return NextResponse.json({ error: 'Failed to create gift' }, { status: 500 });
    }

    // TODO: 이메일/SMS 발송 (실제 구현 시)
    // await sendGiftNotification(recipientEmail || recipientPhone, giftCode, message);

    return NextResponse.json({
      success: true,
      data: {
        id: gift.id,
        code: giftCode,
        type: giftType,
        recipientEmail,
        recipientPhone,
        message,
        pricePaid: price,
        currency,
        expiresAt: expiresAt.toISOString(),
        shareLink: `${process.env.NEXT_PUBLIC_APP_URL}/gift/receive?code=${giftCode}`
      }
    });

  } catch (error) {
    console.error('Create gift error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

// 선물 수락/거절
export async function PUT(request: NextRequest) {
  try {
    const supabase = await createClient();

    const { data: { user }, error: authError } = await supabase.auth.getUser();
    if (authError || !user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await request.json();
    const { giftCode, action } = body; // action: 'accept' or 'decline'

    if (!giftCode || !['accept', 'decline'].includes(action)) {
      return NextResponse.json(
        { error: 'Invalid request' },
        { status: 400 }
      );
    }

    // 선물 조회
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const { data: gift, error: giftError } = await (supabase as any)
      .from('gifts')
      .select('*')
      .eq('gift_code', giftCode.toUpperCase())
      .single();

    if (giftError || !gift) {
      return NextResponse.json({ error: 'Gift not found' }, { status: 404 });
    }

    // 상태 확인
    if (gift.status !== 'pending') {
      return NextResponse.json(
        { error: `Gift is already ${gift.status}` },
        { status: 400 }
      );
    }

    // 만료 확인
    if (new Date(gift.expires_at) < new Date()) {
      await (supabase as any)
        .from('gifts')
        .update({ status: 'expired' })
        .eq('id', gift.id);
      return NextResponse.json({ error: 'Gift has expired' }, { status: 400 });
    }

    // 수신자 확인 (이메일 또는 기존 수신자 ID)
    const isValidRecipient =
      gift.recipient_id === user.id ||
      gift.recipient_email === user.email ||
      (!gift.recipient_id && !gift.recipient_email); // 공개 선물

    if (!isValidRecipient) {
      return NextResponse.json(
        { error: 'This gift is not for you' },
        { status: 403 }
      );
    }

    if (action === 'accept') {
      // 선물 수락
      await (supabase as any)
        .from('gifts')
        .update({
          status: 'accepted',
          recipient_id: user.id,
          accepted_at: new Date().toISOString()
        })
        .eq('id', gift.id);

      // 분석 권한 부여
      await (supabase as any).from('gift_redemptions').insert({
        gift_id: gift.id,
        user_id: user.id,
        analysis_type: gift.gift_type,
        redeemed_at: new Date().toISOString()
      });

      return NextResponse.json({
        success: true,
        data: {
          message: '선물을 수락했습니다!',
          analysisType: gift.gift_type,
          redirectTo: `/fortune/${gift.gift_type.replace('_', '/')}`
        }
      });
    } else {
      // 선물 거절
      await (supabase as any)
        .from('gifts')
        .update({
          status: 'declined',
          recipient_id: user.id
        })
        .eq('id', gift.id);

      // 거절 시 발송자에게 알림 (TODO)
      // await notifySenderDeclined(gift.sender_id, gift.id);

      return NextResponse.json({
        success: true,
        data: {
          message: '선물을 정중히 거절했습니다.'
        }
      });
    }

  } catch (error) {
    console.error('Accept/decline gift error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
