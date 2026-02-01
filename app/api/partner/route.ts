/**
 * 파트너 API
 *
 * GET - 파트너 정보 및 통계 조회
 * POST - 새 파트너 등록 (관리자 전용)
 * PUT - 파트너 정보 업데이트
 */

import { NextRequest, NextResponse } from 'next/server';
import { createClient, createServiceClient } from '@/lib/supabase/server';
import {
  generatePartnerCode,
  generatePartnerPaymentUrl,
  PARTNER_TIERS,
  type PartnerTier,
} from '@/lib/services/partnerService';

// 관리자 이메일 목록
const ADMIN_EMAILS = ['mymiryu@gmail.com'];

/**
 * GET - 파트너 정보 조회
 */
export async function GET(request: NextRequest) {
  try {
    const supabase = await createClient();
    const { data: { user }, error: authError } = await supabase.auth.getUser();

    if (authError || !user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const partnerId = searchParams.get('id');
    const isAdmin = user.email && ADMIN_EMAILS.includes(user.email);

    // 특정 파트너 조회 (관리자) 또는 본인 파트너 조회
    if (partnerId && isAdmin) {
      // 관리자: 특정 파트너 상세 조회
      const { data: partner, error } = await (supabase as any)
        .from('business_partners')
        .select(`
          *,
          qr_codes:partner_qr_codes(*),
          transactions:partner_transactions(*, qr_code:qr_code_id(name))
        `)
        .eq('id', partnerId)
        .single();

      if (error) {
        return NextResponse.json({ error: 'Partner not found' }, { status: 404 });
      }

      return NextResponse.json({ success: true, data: partner });
    }

    // 본인 파트너 정보 조회
    const { data: myPartner, error: partnerError } = await (supabase as any)
      .from('business_partners')
      .select(`
        *,
        qr_codes:partner_qr_codes(*)
      `)
      .eq('user_id', user.id)
      .single();

    if (partnerError || !myPartner) {
      // 파트너가 아닌 경우
      return NextResponse.json({
        success: true,
        data: null,
        message: 'Not a registered partner',
      });
    }

    // 최근 거래 내역
    const { data: transactions } = await (supabase as any)
      .from('partner_transactions')
      .select('*')
      .eq('partner_id', myPartner.id)
      .order('created_at', { ascending: false })
      .limit(20);

    // 월별 통계
    const { data: monthlyStats } = await (supabase as any)
      .from('partner_transactions')
      .select('transaction_amount, partner_commission, created_at')
      .eq('partner_id', myPartner.id)
      .eq('status', 'completed')
      .gte('created_at', new Date(new Date().getFullYear(), new Date().getMonth() - 6, 1).toISOString());

    return NextResponse.json({
      success: true,
      data: {
        partner: myPartner,
        transactions: transactions || [],
        monthlyStats: monthlyStats || [],
        tierInfo: PARTNER_TIERS[myPartner.tier as PartnerTier],
      },
    });
  } catch (error) {
    console.error('Partner GET error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

/**
 * POST - 새 파트너 등록 (관리자 전용)
 */
export async function POST(request: NextRequest) {
  try {
    const supabase = await createClient();
    const { data: { user }, error: authError } = await supabase.auth.getUser();

    if (authError || !user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // 관리자 확인
    const isAdmin = user.email && ADMIN_EMAILS.includes(user.email);
    if (!isAdmin) {
      return NextResponse.json({ error: 'Admin access required' }, { status: 403 });
    }

    const body = await request.json();
    const {
      companyName,
      businessType = 'restaurant',
      contactName,
      contactEmail,
      contactPhone,
      address,
      tier = 'bronze',
      userId, // 파트너 관리자 계정 ID (선택)
    } = body;

    if (!companyName || !contactEmail) {
      return NextResponse.json(
        { error: '업체명과 연락처 이메일은 필수입니다.' },
        { status: 400 }
      );
    }

    // 서비스 클라이언트 사용 (RLS 우회)
    const serviceClient = createServiceClient();

    // 파트너 생성
    const { data: partner, error: createError } = await (serviceClient as any)
      .from('business_partners')
      .insert({
        company_name: companyName,
        business_type: businessType,
        contact_name: contactName,
        contact_email: contactEmail,
        contact_phone: contactPhone,
        address,
        tier,
        commission_rate: PARTNER_TIERS[tier as PartnerTier].commissionRate,
        user_id: userId || null,
      })
      .select()
      .single();

    if (createError) {
      console.error('Partner creation error:', createError);
      return NextResponse.json(
        { error: '파트너 생성에 실패했습니다.' },
        { status: 500 }
      );
    }

    // 기본 QR 코드 생성
    const qrCode = generatePartnerCode(partner.id);
    const paymentUrl = generatePartnerPaymentUrl(qrCode);

    const { data: qr, error: qrError } = await (serviceClient as any)
      .from('partner_qr_codes')
      .insert({
        partner_id: partner.id,
        code: qrCode,
        name: '메인 QR',
        qr_type: 'payment',
        short_url: paymentUrl,
      })
      .select()
      .single();

    if (qrError) {
      console.error('QR creation error:', qrError);
    }

    return NextResponse.json({
      success: true,
      data: {
        partner,
        qrCode: qr,
        paymentUrl,
      },
      message: '파트너가 성공적으로 등록되었습니다.',
    });
  } catch (error) {
    console.error('Partner POST error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

/**
 * PUT - 파트너 정보 업데이트
 */
export async function PUT(request: NextRequest) {
  try {
    const supabase = await createClient();
    const { data: { user }, error: authError } = await supabase.auth.getUser();

    if (authError || !user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await request.json();
    const { partnerId, ...updates } = body;

    const isAdmin = user.email && ADMIN_EMAILS.includes(user.email);

    // 본인 파트너 또는 관리자만 수정 가능
    const { data: partner } = await (supabase as any)
      .from('business_partners')
      .select('id, user_id')
      .eq('id', partnerId)
      .single();

    if (!partner) {
      return NextResponse.json({ error: 'Partner not found' }, { status: 404 });
    }

    if (!isAdmin && partner.user_id !== user.id) {
      return NextResponse.json({ error: 'Access denied' }, { status: 403 });
    }

    // 티어 변경 시 커미션 레이트도 업데이트
    if (updates.tier) {
      updates.commission_rate = PARTNER_TIERS[updates.tier as PartnerTier].commissionRate;
    }

    const serviceClient = createServiceClient();
    const { data: updated, error: updateError } = await (serviceClient as any)
      .from('business_partners')
      .update(updates)
      .eq('id', partnerId)
      .select()
      .single();

    if (updateError) {
      return NextResponse.json(
        { error: '업데이트에 실패했습니다.' },
        { status: 500 }
      );
    }

    return NextResponse.json({
      success: true,
      data: updated,
    });
  } catch (error) {
    console.error('Partner PUT error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
