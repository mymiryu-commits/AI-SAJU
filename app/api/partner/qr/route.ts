/**
 * 파트너 QR 코드 관리 API
 *
 * GET - QR 코드 목록/상세 조회
 * POST - 새 QR 코드 생성
 * PUT - QR 코드 업데이트
 * DELETE - QR 코드 비활성화
 */

import { NextRequest, NextResponse } from 'next/server';
import { createClient, createServiceClient } from '@/lib/supabase/server';
import {
  generatePartnerCode,
  generatePartnerPaymentUrl,
  trackQRScan,
} from '@/lib/services/partnerService';
import QRCode from 'qrcode';

// 관리자 이메일 목록
const ADMIN_EMAILS = ['mymiryu@gmail.com'];

/**
 * GET - QR 코드 조회
 */
export async function GET(request: NextRequest) {
  try {
    const supabase = await createClient();
    const { searchParams } = new URL(request.url);
    const code = searchParams.get('code');
    const partnerId = searchParams.get('partnerId');

    // QR 코드로 조회 (스캔 추적용 - 인증 불필요)
    if (code) {
      const { data: qr, error } = await (supabase as any)
        .from('partner_qr_codes')
        .select(`
          id, code, name, qr_type, short_url, is_active,
          partner:partner_id (id, company_name, tier, is_active)
        `)
        .eq('code', code)
        .single();

      if (error || !qr || !qr.is_active || !qr.partner?.is_active) {
        return NextResponse.json(
          { error: 'QR code not found or inactive' },
          { status: 404 }
        );
      }

      // 스캔 추적
      const ipAddress = request.headers.get('x-forwarded-for') ||
                        request.headers.get('x-real-ip');
      const userAgent = request.headers.get('user-agent');
      const referer = request.headers.get('referer');

      await trackQRScan(supabase, code, { ipAddress: ipAddress || undefined, userAgent: userAgent || undefined, referer: referer || undefined });

      return NextResponse.json({
        success: true,
        data: {
          code: qr.code,
          name: qr.name,
          type: qr.qr_type,
          paymentUrl: qr.short_url,
          partner: {
            name: qr.partner.company_name,
          },
        },
      });
    }

    // 파트너 ID로 QR 목록 조회 (인증 필요)
    const { data: { user }, error: authError } = await supabase.auth.getUser();
    if (authError || !user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const isAdmin = user.email && ADMIN_EMAILS.includes(user.email);

    // 파트너 권한 확인
    let targetPartnerId = partnerId;
    if (!isAdmin) {
      const { data: myPartner } = await (supabase as any)
        .from('business_partners')
        .select('id')
        .eq('user_id', user.id)
        .single();

      if (!myPartner) {
        return NextResponse.json({ error: 'Not a partner' }, { status: 403 });
      }
      targetPartnerId = myPartner.id;
    }

    if (!targetPartnerId) {
      return NextResponse.json({ error: 'Partner ID required' }, { status: 400 });
    }

    const { data: qrCodes, error: listError } = await (supabase as any)
      .from('partner_qr_codes')
      .select('*')
      .eq('partner_id', targetPartnerId)
      .order('created_at', { ascending: false });

    if (listError) {
      return NextResponse.json(
        { error: 'Failed to fetch QR codes' },
        { status: 500 }
      );
    }

    return NextResponse.json({
      success: true,
      data: qrCodes || [],
    });
  } catch (error) {
    console.error('QR GET error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

/**
 * POST - 새 QR 코드 생성
 */
export async function POST(request: NextRequest) {
  try {
    const supabase = await createClient();
    const { data: { user }, error: authError } = await supabase.auth.getUser();

    if (authError || !user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await request.json();
    const { partnerId, name, qrType = 'payment', metadata } = body;

    const isAdmin = user.email && ADMIN_EMAILS.includes(user.email);

    // 파트너 권한 확인
    let targetPartnerId = partnerId;
    if (!isAdmin) {
      const { data: myPartner } = await (supabase as any)
        .from('business_partners')
        .select('id')
        .eq('user_id', user.id)
        .single();

      if (!myPartner) {
        return NextResponse.json({ error: 'Not a partner' }, { status: 403 });
      }
      targetPartnerId = myPartner.id;
    }

    if (!targetPartnerId || !name) {
      return NextResponse.json(
        { error: 'Partner ID and name are required' },
        { status: 400 }
      );
    }

    // QR 코드 생성
    const code = generatePartnerCode(targetPartnerId);
    const paymentUrl = generatePartnerPaymentUrl(code);

    // QR 코드 이미지 생성
    const qrCodeDataUrl = await QRCode.toDataURL(paymentUrl, {
      width: 300,
      margin: 2,
      color: { dark: '#000000', light: '#ffffff' },
    });

    const serviceClient = createServiceClient();
    const { data: qr, error: createError } = await (serviceClient as any)
      .from('partner_qr_codes')
      .insert({
        partner_id: targetPartnerId,
        code,
        name,
        qr_type: qrType,
        short_url: paymentUrl,
        qr_code_url: qrCodeDataUrl,
        metadata: metadata || {},
      })
      .select()
      .single();

    if (createError) {
      console.error('QR creation error:', createError);
      return NextResponse.json(
        { error: 'QR 코드 생성에 실패했습니다.' },
        { status: 500 }
      );
    }

    return NextResponse.json({
      success: true,
      data: qr,
      message: 'QR 코드가 생성되었습니다.',
    });
  } catch (error) {
    console.error('QR POST error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

/**
 * PUT - QR 코드 업데이트
 */
export async function PUT(request: NextRequest) {
  try {
    const supabase = await createClient();
    const { data: { user }, error: authError } = await supabase.auth.getUser();

    if (authError || !user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await request.json();
    const { qrId, name, isActive, metadata } = body;

    if (!qrId) {
      return NextResponse.json({ error: 'QR ID required' }, { status: 400 });
    }

    const isAdmin = user.email && ADMIN_EMAILS.includes(user.email);

    // QR 코드 권한 확인
    const { data: qr } = await (supabase as any)
      .from('partner_qr_codes')
      .select('id, partner_id, partner:partner_id (user_id)')
      .eq('id', qrId)
      .single();

    if (!qr) {
      return NextResponse.json({ error: 'QR not found' }, { status: 404 });
    }

    if (!isAdmin && qr.partner?.user_id !== user.id) {
      return NextResponse.json({ error: 'Access denied' }, { status: 403 });
    }

    const updates: Record<string, any> = {};
    if (name !== undefined) updates.name = name;
    if (isActive !== undefined) updates.is_active = isActive;
    if (metadata !== undefined) updates.metadata = metadata;

    const serviceClient = createServiceClient();
    const { data: updated, error: updateError } = await (serviceClient as any)
      .from('partner_qr_codes')
      .update(updates)
      .eq('id', qrId)
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
    console.error('QR PUT error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

/**
 * DELETE - QR 코드 비활성화
 */
export async function DELETE(request: NextRequest) {
  try {
    const supabase = await createClient();
    const { data: { user }, error: authError } = await supabase.auth.getUser();

    if (authError || !user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const qrId = searchParams.get('id');

    if (!qrId) {
      return NextResponse.json({ error: 'QR ID required' }, { status: 400 });
    }

    const isAdmin = user.email && ADMIN_EMAILS.includes(user.email);

    // QR 코드 권한 확인
    const { data: qr } = await (supabase as any)
      .from('partner_qr_codes')
      .select('id, partner:partner_id (user_id)')
      .eq('id', qrId)
      .single();

    if (!qr) {
      return NextResponse.json({ error: 'QR not found' }, { status: 404 });
    }

    if (!isAdmin && qr.partner?.user_id !== user.id) {
      return NextResponse.json({ error: 'Access denied' }, { status: 403 });
    }

    // 소프트 삭제 (비활성화)
    const serviceClient = createServiceClient();
    await (serviceClient as any)
      .from('partner_qr_codes')
      .update({ is_active: false })
      .eq('id', qrId);

    return NextResponse.json({
      success: true,
      message: 'QR 코드가 비활성화되었습니다.',
    });
  } catch (error) {
    console.error('QR DELETE error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
