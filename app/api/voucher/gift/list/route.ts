import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';

/**
 * 선물 내역 조회 API
 * GET /api/voucher/gift/list?type=sent|received
 */
export async function GET(request: NextRequest) {
  try {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
      return NextResponse.json(
        { error: '로그인이 필요합니다.' },
        { status: 401 }
      );
    }

    const { searchParams } = new URL(request.url);
    const type = searchParams.get('type') || 'all';

    let query = supabase
      .from('voucher_gifts')
      .select(`
        *,
        sender:sender_id(email, user_metadata),
        recipient:recipient_id(email, user_metadata)
      `)
      .order('created_at', { ascending: false });

    if (type === 'sent') {
      query = query.eq('sender_id', user.id);
    } else if (type === 'received') {
      query = query.eq('recipient_id', user.id);
    } else {
      // all: 보낸 것과 받은 것 모두
      query = query.or(`sender_id.eq.${user.id},recipient_id.eq.${user.id}`);
    }

    const { data: gifts, error } = await query;

    if (error) {
      console.error('Gift list error:', error);
      return NextResponse.json(
        { error: '선물 내역 조회에 실패했습니다.' },
        { status: 500 }
      );
    }

    // 민감 정보 제거 및 데이터 가공
    const processedGifts = gifts?.map(gift => ({
      id: gift.id,
      service_type: gift.service_type,
      quantity: gift.quantity,
      gift_code: gift.sender_id === user.id ? gift.gift_code : null, // 보낸 선물만 코드 표시
      gift_url: gift.sender_id === user.id ? gift.gift_url : null,
      message: gift.message,
      status: gift.status,
      expires_at: gift.expires_at,
      claimed_at: gift.claimed_at,
      created_at: gift.created_at,
      is_sender: gift.sender_id === user.id,
      sender_name: gift.sender?.user_metadata?.name || gift.sender?.email?.split('@')[0] || '익명',
      recipient_name: gift.recipient?.user_metadata?.name || gift.recipient?.email?.split('@')[0] || gift.recipient_email || gift.recipient_phone || '대기 중',
    }));

    return NextResponse.json({
      success: true,
      gifts: processedGifts || [],
    });
  } catch (error) {
    console.error('Gift list API error:', error);
    return NextResponse.json(
      { error: '서버 오류가 발생했습니다.' },
      { status: 500 }
    );
  }
}
