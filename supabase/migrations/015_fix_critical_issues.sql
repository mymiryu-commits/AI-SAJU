-- =====================================================
-- 015_fix_critical_issues.sql
-- 서비스 런칭 전 필수 수정 사항
-- 1. increment_coins RPC 함수 추가
-- 2. referrals 테이블 스키마 수정
-- 3. profiles 테이블에 referral_code 컬럼 추가
-- 4. site_settings에 api_keys 지원 추가
-- 5. increment_total_spent RPC 함수 추가
-- =====================================================

-- =====================================================
-- 1. increment_coins RPC 함수
-- 포인트/코인 증가 및 거래 기록
-- =====================================================
CREATE OR REPLACE FUNCTION increment_coins(
  p_user_id UUID,
  p_amount INTEGER,
  p_reason TEXT DEFAULT 'bonus'
)
RETURNS void AS $$
DECLARE
  v_current_balance INTEGER;
  v_new_balance INTEGER;
BEGIN
  -- 현재 잔액 조회 (users 테이블)
  SELECT COALESCE(coin_balance, 0) INTO v_current_balance
  FROM users
  WHERE id = p_user_id;

  -- 새 잔액 계산
  v_new_balance := v_current_balance + p_amount;

  -- 잔액 업데이트
  UPDATE users
  SET
    coin_balance = v_new_balance,
    updated_at = NOW()
  WHERE id = p_user_id;

  -- 거래 기록 추가
  INSERT INTO coin_transactions (
    user_id,
    amount,
    type,
    description,
    balance_after,
    created_at
  ) VALUES (
    p_user_id,
    p_amount,
    p_reason,
    p_reason,
    v_new_balance,
    NOW()
  );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- =====================================================
-- 2. increment_total_spent RPC 함수
-- 총 지출 금액 업데이트
-- =====================================================
CREATE OR REPLACE FUNCTION increment_total_spent(
  p_user_id UUID,
  p_amount INTEGER
)
RETURNS void AS $$
BEGIN
  UPDATE profiles
  SET
    total_spent = COALESCE(total_spent, 0) + p_amount,
    updated_at = NOW()
  WHERE id = p_user_id;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- =====================================================
-- 3. referrals 테이블 스키마 수정
-- 컬럼명 변경 및 누락 컬럼 추가
-- =====================================================

-- 3-1. referred_id → referee_id 컬럼명 변경 (존재하는 경우)
DO $$
BEGIN
  IF EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'referrals' AND column_name = 'referred_id'
  ) THEN
    ALTER TABLE referrals RENAME COLUMN referred_id TO referee_id;
  END IF;
END $$;

-- 3-2. 누락 컬럼 추가
ALTER TABLE referrals
  ADD COLUMN IF NOT EXISTS status VARCHAR(20) DEFAULT 'pending',
  ADD COLUMN IF NOT EXISTS commission_rate DECIMAL(5,2) DEFAULT 20,
  ADD COLUMN IF NOT EXISTS commission_earned DECIMAL(12,2) DEFAULT 0,
  ADD COLUMN IF NOT EXISTS completed_at TIMESTAMP WITH TIME ZONE,
  ADD COLUMN IF NOT EXISTS first_purchase_processed BOOLEAN DEFAULT FALSE,
  ADD COLUMN IF NOT EXISTS first_purchase_amount DECIMAL(12,2);

-- 3-3. 인덱스 추가
CREATE INDEX IF NOT EXISTS idx_referrals_referee_id ON referrals(referee_id);
CREATE INDEX IF NOT EXISTS idx_referrals_referrer_id ON referrals(referrer_id);
CREATE INDEX IF NOT EXISTS idx_referrals_status ON referrals(status);

-- =====================================================
-- 4. profiles 테이블에 referral 관련 컬럼 추가
-- =====================================================
ALTER TABLE profiles
  ADD COLUMN IF NOT EXISTS referral_code VARCHAR(20) UNIQUE,
  ADD COLUMN IF NOT EXISTS total_referrals INTEGER DEFAULT 0,
  ADD COLUMN IF NOT EXISTS referral_earnings DECIMAL(12,2) DEFAULT 0;

-- 기존 사용자들에게 referral_code 생성 (없는 경우)
UPDATE profiles
SET referral_code = 'REF-' || UPPER(SUBSTRING(id::TEXT, 1, 8))
WHERE referral_code IS NULL;

-- =====================================================
-- 5. site_settings 테이블 확장 (API Keys 저장)
-- =====================================================

-- api_keys 컬럼이 없으면 추가 (JSON 형태로 저장)
ALTER TABLE site_settings
  ADD COLUMN IF NOT EXISTS api_keys JSONB DEFAULT '{}';

-- 기본 API 키 설정 예시 (암호화된 값으로 저장해야 함)
-- INSERT INTO site_settings (id, api_keys)
-- VALUES (1, '{"gemini": "encrypted_key", "openai": "encrypted_key"}')
-- ON CONFLICT (id) DO UPDATE SET api_keys = EXCLUDED.api_keys;

-- =====================================================
-- 6. coin_transactions 테이블 확인/생성
-- =====================================================
CREATE TABLE IF NOT EXISTS coin_transactions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  amount INTEGER NOT NULL,
  type VARCHAR(50) NOT NULL,
  description TEXT,
  balance_after INTEGER,
  reference_type VARCHAR(50),
  reference_id UUID,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_coin_transactions_user_id ON coin_transactions(user_id);
CREATE INDEX IF NOT EXISTS idx_coin_transactions_type ON coin_transactions(type);
CREATE INDEX IF NOT EXISTS idx_coin_transactions_created_at ON coin_transactions(created_at);

-- RLS 정책
ALTER TABLE coin_transactions ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Users can view own transactions" ON coin_transactions;
CREATE POLICY "Users can view own transactions" ON coin_transactions
  FOR SELECT USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "Service role can insert transactions" ON coin_transactions;
CREATE POLICY "Service role can insert transactions" ON coin_transactions
  FOR INSERT WITH CHECK (true);

-- =====================================================
-- 7. payments 테이블에 누락된 컬럼 추가
-- =====================================================
ALTER TABLE payments
  ADD COLUMN IF NOT EXISTS payment_status VARCHAR(20) DEFAULT 'pending',
  ADD COLUMN IF NOT EXISTS payment_key VARCHAR(255),
  ADD COLUMN IF NOT EXISTS paid_at TIMESTAMP WITH TIME ZONE;

-- =====================================================
-- 8. 함수 권한 설정
-- =====================================================
GRANT EXECUTE ON FUNCTION increment_coins TO authenticated;
GRANT EXECUTE ON FUNCTION increment_coins TO service_role;
GRANT EXECUTE ON FUNCTION increment_total_spent TO authenticated;
GRANT EXECUTE ON FUNCTION increment_total_spent TO service_role;

-- =====================================================
-- 완료 메시지
-- =====================================================
DO $$
BEGIN
  RAISE NOTICE 'Migration 015_fix_critical_issues completed successfully';
END $$;
