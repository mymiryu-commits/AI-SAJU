/**
 * 관리자 무료 결제권 발급 API
 * POST /api/admin/issue-vouchers
 *
 * 관리자가 결제 없이 결제권을 발급받아 서비스 테스트 가능
 * plan_type: 'basic' | 'standard' | 'premium'
 */

import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import { createServiceClient } from '@/lib/supabase/server';
import { isAdminEmail } from '@/lib/auth/permissions';

export async function POST(request: NextRequest) {
  try {
    // 인증 확인
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user || !user.email || !isAdminEmail(user.email)) {
      return NextResponse.json(
        { error: '관리자 권한이 필요합니다.' },
        { status: 403 }
      );
    }

    const body = await request.json();
    const { plan_type } = body;

    if (!plan_type || !['basic', 'standard', 'premium'].includes(plan_type)) {
      return NextResponse.json(
        { error: 'plan_type은 basic, standard, premium 중 하나여야 합니다.' },
        { status: 400 }
      );
    }

    // Service Role 클라이언트 (RLS 우회)
    const serviceSupabase = createServiceClient();

    // 번들 패키지 조회
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const { data: pkg, error: pkgError } = await (serviceSupabase as any)
      .from('voucher_packages')
      .select('*')
      .eq('service_type', 'bundle')
      .eq('plan_type', plan_type)
      .eq('is_active', true)
      .single();

    if (pkgError || !pkg) {
      return NextResponse.json(
        { error: `${plan_type} 번들 패키지를 찾을 수 없습니다.`, detail: pkgError?.message },
        { status: 404 }
      );
    }

    // 유효기간 계산 (365일)
    const expiresAt = new Date();
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    expiresAt.setDate(expiresAt.getDate() + ((pkg as any).validity_days || 365));

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const pkgData = pkg as any;

    // 번들 패키지: issue_bundle_vouchers RPC 사용
    if (pkgData.bundle_services) {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const { data: bundleResult, error: bundleError } = await (serviceSupabase as any).rpc(
        'issue_bundle_vouchers',
        {
          p_user_id: user.id,
          p_package_id: pkgData.id,
          p_payment_id: `admin_grant_${Date.now()}`,
          p_order_id: `ADMIN-${Date.now()}`,
          p_expires_at: expiresAt.toISOString(),
        }
      );

      if (bundleError) {
        console.error('Bundle voucher issue error:', bundleError);
        // RPC가 없을 수 있음 → 수동 발급 시도
        return await issueVouchersManually(serviceSupabase, user.id, pkgData, expiresAt);
      }

      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const result = bundleResult as any;
      if (result && result.success === false) {
        return await issueVouchersManually(serviceSupabase, user.id, pkgData, expiresAt);
      }

      return NextResponse.json({
        success: true,
        message: `${plan_type} 번들 결제권이 발급되었습니다.`,
        plan_type,
        result: bundleResult,
      });
    }

    // bundle_services가 없으면 수동 발급
    return await issueVouchersManually(serviceSupabase, user.id, pkgData, expiresAt);

  } catch (error) {
    console.error('Admin issue vouchers error:', error);
    return NextResponse.json(
      { error: '서버 오류가 발생했습니다.' },
      { status: 500 }
    );
  }
}

/**
 * bundle_services JSONB를 파싱하여 수동으로 결제권 발급
 */
// eslint-disable-next-line @typescript-eslint/no-explicit-any
async function issueVouchersManually(serviceSupabase: any, userId: string, pkg: any, expiresAt: Date) {
  const bundleServices = pkg.bundle_services || { saju: 1 };
  const issuedVouchers = [];

  for (const [serviceType, quantity] of Object.entries(bundleServices)) {
    const { data: voucher, error: voucherError } = await serviceSupabase
      .from('user_vouchers')
      .insert({
        user_id: userId,
        package_id: pkg.id,
        service_type: serviceType,
        total_quantity: quantity as number,
        used_quantity: 0,
        remaining_quantity: quantity as number,
        purchase_price: 0,
        unit_price: 0,
        payment_id: `admin_grant_${Date.now()}`,
        order_id: `ADMIN-${Date.now()}-${serviceType}`,
        status: 'active',
        source: 'promotion',
        expires_at: expiresAt.toISOString(),
      })
      .select()
      .single();

    if (voucherError) {
      console.error(`Voucher creation error for ${serviceType}:`, voucherError);
    } else {
      issuedVouchers.push({ service_type: serviceType, quantity, voucher_id: voucher?.id });
    }
  }

  return NextResponse.json({
    success: true,
    message: `${pkg.plan_type} 번들 결제권이 수동 발급되었습니다.`,
    plan_type: pkg.plan_type,
    vouchers: issuedVouchers,
  });
}
