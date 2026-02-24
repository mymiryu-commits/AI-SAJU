-- ============================================
-- 비즈니스 파트너 시스템 마이그레이션
-- 식당/카페 등 오프라인 파트너 QR 기반 수익 쉐어
-- ============================================

-- 1. 비즈니스 파트너 테이블
CREATE TABLE IF NOT EXISTS business_partners (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  company_name VARCHAR(255) NOT NULL,
  business_type VARCHAR(50) DEFAULT 'restaurant',
  contact_name VARCHAR(100),
  contact_email VARCHAR(255),
  contact_phone VARCHAR(50),
  address TEXT,
  tier VARCHAR(20) DEFAULT 'bronze',
  commission_rate DECIMAL(5,2) DEFAULT 25.00,
  is_active BOOLEAN DEFAULT true,
  total_revenue DECIMAL(12,2) DEFAULT 0,
  total_commission DECIMAL(12,2) DEFAULT 0,
  pending_commission DECIMAL(12,2) DEFAULT 0,
  bank_name VARCHAR(100),
  bank_account VARCHAR(50),
  bank_holder VARCHAR(100),
  metadata JSONB DEFAULT '{}',
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 2. 파트너 QR 코드 테이블
CREATE TABLE IF NOT EXISTS partner_qr_codes (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  partner_id UUID REFERENCES business_partners(id) ON DELETE CASCADE,
  code VARCHAR(20) UNIQUE NOT NULL,
  name VARCHAR(100) NOT NULL,
  qr_type VARCHAR(20) DEFAULT 'payment',
  qr_code_url TEXT,
  short_url TEXT,
  scan_count INTEGER DEFAULT 0,
  conversion_count INTEGER DEFAULT 0,
  total_revenue DECIMAL(12,2) DEFAULT 0,
  is_active BOOLEAN DEFAULT true,
  metadata JSONB DEFAULT '{}',
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 3. 파트너 거래 내역 테이블
CREATE TABLE IF NOT EXISTS partner_transactions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  partner_id UUID REFERENCES business_partners(id) ON DELETE CASCADE,
  qr_code_id UUID REFERENCES partner_qr_codes(id) ON DELETE SET NULL,
  payment_id UUID,
  user_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  transaction_amount DECIMAL(10,2) NOT NULL,
  partner_commission DECIMAL(10,2) NOT NULL,
  platform_fee DECIMAL(10,2) NOT NULL,
  status VARCHAR(20) DEFAULT 'pending',
  paid_out_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 4. 파트너 QR 스캔 로그 테이블
CREATE TABLE IF NOT EXISTS partner_qr_scans (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  qr_code_id UUID REFERENCES partner_qr_codes(id) ON DELETE CASCADE,
  ip_address INET,
  user_agent TEXT,
  referer TEXT,
  country VARCHAR(10),
  city VARCHAR(100),
  scanned_at TIMESTAMPTZ DEFAULT NOW()
);

-- 5. 파트너 정산 테이블
CREATE TABLE IF NOT EXISTS partner_payouts (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  partner_id UUID REFERENCES business_partners(id) ON DELETE CASCADE,
  amount DECIMAL(12,2) NOT NULL,
  status VARCHAR(20) DEFAULT 'pending',
  payout_method VARCHAR(50) DEFAULT 'bank_transfer',
  bank_name VARCHAR(100),
  bank_account VARCHAR(50),
  bank_holder VARCHAR(100),
  transaction_ids UUID[] DEFAULT '{}',
  processed_at TIMESTAMPTZ,
  notes TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 인덱스 생성
CREATE INDEX IF NOT EXISTS idx_partner_qr_codes_code ON partner_qr_codes(code);
CREATE INDEX IF NOT EXISTS idx_partner_qr_codes_partner ON partner_qr_codes(partner_id);
CREATE INDEX IF NOT EXISTS idx_partner_transactions_partner ON partner_transactions(partner_id);
CREATE INDEX IF NOT EXISTS idx_partner_transactions_status ON partner_transactions(status);
CREATE INDEX IF NOT EXISTS idx_partner_qr_scans_qr_code ON partner_qr_scans(qr_code_id);
CREATE INDEX IF NOT EXISTS idx_partner_qr_scans_date ON partner_qr_scans(scanned_at);

-- RLS 정책
ALTER TABLE business_partners ENABLE ROW LEVEL SECURITY;
ALTER TABLE partner_qr_codes ENABLE ROW LEVEL SECURITY;
ALTER TABLE partner_transactions ENABLE ROW LEVEL SECURITY;
ALTER TABLE partner_qr_scans ENABLE ROW LEVEL SECURITY;
ALTER TABLE partner_payouts ENABLE ROW LEVEL SECURITY;

-- 파트너 본인 접근 정책
CREATE POLICY "Partners can view own data" ON business_partners
  FOR SELECT USING (user_id = auth.uid());

CREATE POLICY "Partners can view own QR codes" ON partner_qr_codes
  FOR SELECT USING (partner_id IN (
    SELECT id FROM business_partners WHERE user_id = auth.uid()
  ));

CREATE POLICY "Partners can view own transactions" ON partner_transactions
  FOR SELECT USING (partner_id IN (
    SELECT id FROM business_partners WHERE user_id = auth.uid()
  ));

-- 관리자 정책 (서비스 롤)
-- Note: 서비스 롤은 RLS를 우회하므로 별도 정책 불필요

-- 추천 테이블에 파트너 추적 컬럼 추가 (기존 테이블 수정)
ALTER TABLE referrals ADD COLUMN IF NOT EXISTS first_purchase_processed BOOLEAN DEFAULT false;
ALTER TABLE referrals ADD COLUMN IF NOT EXISTS first_purchase_amount DECIMAL(10,2);
ALTER TABLE referrals ADD COLUMN IF NOT EXISTS partner_id UUID REFERENCES business_partners(id);

-- profiles 테이블에 추천 관련 컬럼 추가
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS total_referrals INTEGER DEFAULT 0;
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS referral_earnings DECIMAL(12,2) DEFAULT 0;

-- 업데이트 트리거
CREATE OR REPLACE FUNCTION update_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER update_business_partners_updated_at
  BEFORE UPDATE ON business_partners
  FOR EACH ROW EXECUTE FUNCTION update_updated_at();

CREATE TRIGGER update_partner_qr_codes_updated_at
  BEFORE UPDATE ON partner_qr_codes
  FOR EACH ROW EXECUTE FUNCTION update_updated_at();
