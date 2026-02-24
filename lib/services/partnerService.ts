/**
 * 비즈니스 파트너 서비스
 *
 * 식당, 카페 등 오프라인 파트너의 QR 코드 기반 수익 쉐어 시스템
 * 파트너 QR 스캔 → 사주 분석 결제 → 수익 분배
 */

// 파트너 티어 정의
export const PARTNER_TIERS = {
  bronze: {
    name: '브론즈',
    minMonthlyRevenue: 0,
    commissionRate: 25, // 25% 수익 쉐어
    features: ['기본 QR 코드', '월간 리포트'],
  },
  silver: {
    name: '실버',
    minMonthlyRevenue: 500000, // 50만원 이상
    commissionRate: 30,
    features: ['커스텀 QR 디자인', '주간 리포트', '고객 분석'],
  },
  gold: {
    name: '골드',
    minMonthlyRevenue: 2000000, // 200만원 이상
    commissionRate: 35,
    features: ['프리미엄 QR', '실시간 대시보드', 'API 접근'],
  },
  platinum: {
    name: '플래티넘',
    minMonthlyRevenue: 5000000, // 500만원 이상
    commissionRate: 40,
    features: ['전용 매니저', '공동 마케팅', '맞춤 기능'],
  },
} as const;

export type PartnerTier = keyof typeof PARTNER_TIERS;

export interface BusinessPartner {
  id: string;
  userId: string; // 파트너 관리자 계정
  companyName: string;
  businessType: 'restaurant' | 'cafe' | 'bar' | 'hotel' | 'other';
  contactName: string;
  contactEmail: string;
  contactPhone: string;
  address?: string;
  tier: PartnerTier;
  commissionRate: number;
  isActive: boolean;
  totalRevenue: number;
  totalCommission: number;
  pendingCommission: number;
  createdAt: string;
  updatedAt: string;
}

export interface PartnerQRCode {
  id: string;
  partnerId: string;
  code: string; // 고유 QR 코드 (예: PTN-ABC123)
  name: string; // QR 이름 (예: "테이블 1", "카운터")
  qrType: 'payment' | 'menu' | 'loyalty' | 'feedback';
  qrCodeUrl: string;
  shortUrl: string;
  scanCount: number;
  conversionCount: number; // 결제까지 이어진 횟수
  totalRevenue: number;
  isActive: boolean;
  metadata?: {
    tableNumber?: string;
    location?: string;
    campaign?: string;
  };
  createdAt: string;
}

export interface PartnerTransaction {
  id: string;
  partnerId: string;
  qrCodeId?: string;
  paymentId: string;
  userId: string; // 결제한 고객
  transactionAmount: number;
  partnerCommission: number;
  platformFee: number;
  status: 'pending' | 'completed' | 'paid_out' | 'cancelled';
  paidOutAt?: string;
  createdAt: string;
}

/**
 * 파트너 QR 코드 생성
 */
export function generatePartnerCode(partnerId: string): string {
  const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789';
  let code = '';
  for (let i = 0; i < 6; i++) {
    code += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return `PTN-${code}`;
}

/**
 * 파트너 결제 URL 생성
 */
export function generatePartnerPaymentUrl(qrCode: string): string {
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://ai-planx.com';
  return `${baseUrl}/fortune/integrated?partner=${qrCode}`;
}

/**
 * 수익 분배 계산
 */
export function calculateRevenueSplit(
  paymentAmount: number,
  commissionRate: number
): {
  partnerCommission: number;
  platformFee: number;
} {
  const partnerCommission = Math.floor(paymentAmount * (commissionRate / 100));
  const platformFee = paymentAmount - partnerCommission;

  return {
    partnerCommission,
    platformFee,
  };
}

/**
 * 파트너 티어 결정
 */
export function determinePartnerTier(monthlyRevenue: number): PartnerTier {
  if (monthlyRevenue >= PARTNER_TIERS.platinum.minMonthlyRevenue) {
    return 'platinum';
  } else if (monthlyRevenue >= PARTNER_TIERS.gold.minMonthlyRevenue) {
    return 'gold';
  } else if (monthlyRevenue >= PARTNER_TIERS.silver.minMonthlyRevenue) {
    return 'silver';
  }
  return 'bronze';
}

/**
 * 파트너 통계 집계
 */
export interface PartnerStats {
  totalRevenue: number;
  totalCommission: number;
  pendingCommission: number;
  totalScans: number;
  totalConversions: number;
  conversionRate: number;
  topQRCodes: {
    id: string;
    name: string;
    revenue: number;
    scans: number;
  }[];
  recentTransactions: PartnerTransaction[];
  monthlyTrend: {
    month: string;
    revenue: number;
    commission: number;
  }[];
}

/**
 * DB에서 파트너 정보 가져오기 (서버사이드)
 */
export async function getPartnerByQRCode(
  supabase: any,
  qrCode: string
): Promise<{ partner: BusinessPartner; qr: PartnerQRCode } | null> {
  try {
    const { data: qr, error: qrError } = await supabase
      .from('partner_qr_codes')
      .select('*, partner:partner_id (*)')
      .eq('code', qrCode)
      .eq('is_active', true)
      .single();

    if (qrError || !qr) {
      return null;
    }

    return {
      partner: qr.partner,
      qr: qr,
    };
  } catch (error) {
    console.error('Error fetching partner by QR code:', error);
    return null;
  }
}

/**
 * 파트너 결제 추적
 */
export async function trackPartnerPayment(
  supabase: any,
  qrCode: string,
  paymentId: string,
  userId: string,
  amount: number
): Promise<boolean> {
  try {
    // 1. QR 코드로 파트너 정보 조회
    const partnerData = await getPartnerByQRCode(supabase, qrCode);
    if (!partnerData) {
      console.log(`[Partner] QR code not found: ${qrCode}`);
      return false;
    }

    const { partner, qr } = partnerData;

    // 2. 수익 분배 계산
    const { partnerCommission, platformFee } = calculateRevenueSplit(
      amount,
      partner.commissionRate
    );

    // 3. 거래 기록 생성
    await supabase.from('partner_transactions').insert({
      partner_id: partner.id,
      qr_code_id: qr.id,
      payment_id: paymentId,
      user_id: userId,
      transaction_amount: amount,
      partner_commission: partnerCommission,
      platform_fee: platformFee,
      status: 'pending',
    });

    // 4. QR 코드 통계 업데이트
    await supabase
      .from('partner_qr_codes')
      .update({
        conversion_count: (qr.conversionCount || 0) + 1,
        total_revenue: (qr.totalRevenue || 0) + amount,
      })
      .eq('id', qr.id);

    // 5. 파트너 통계 업데이트
    await supabase
      .from('business_partners')
      .update({
        total_revenue: (partner.totalRevenue || 0) + amount,
        total_commission: (partner.totalCommission || 0) + partnerCommission,
        pending_commission: (partner.pendingCommission || 0) + partnerCommission,
      })
      .eq('id', partner.id);

    console.log(
      `[Partner] Tracked payment: partner=${partner.companyName}, amount=${amount}, commission=${partnerCommission}`
    );

    return true;
  } catch (error) {
    console.error('[Partner] Error tracking payment:', error);
    return false;
  }
}

/**
 * QR 스캔 기록
 */
export async function trackQRScan(
  supabase: any,
  qrCode: string,
  metadata?: {
    ipAddress?: string;
    userAgent?: string;
    referer?: string;
  }
): Promise<boolean> {
  try {
    // QR 코드 조회
    const { data: qr, error } = await supabase
      .from('partner_qr_codes')
      .select('id, scan_count')
      .eq('code', qrCode)
      .single();

    if (error || !qr) {
      return false;
    }

    // 스캔 횟수 증가
    await supabase
      .from('partner_qr_codes')
      .update({ scan_count: (qr.scan_count || 0) + 1 })
      .eq('id', qr.id);

    // 스캔 로그 기록
    await supabase.from('partner_qr_scans').insert({
      qr_code_id: qr.id,
      ip_address: metadata?.ipAddress,
      user_agent: metadata?.userAgent,
      referer: metadata?.referer,
    });

    return true;
  } catch (error) {
    console.error('[Partner] Error tracking QR scan:', error);
    return false;
  }
}
