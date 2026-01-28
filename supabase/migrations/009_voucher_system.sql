-- =====================================================
-- 횟수권/이용권 시스템 (Voucher System)
-- =====================================================

-- =====================================================
-- 1. 상품 패키지 정의
-- =====================================================

CREATE TABLE voucher_packages (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),

  -- 상품 정보
  service_type VARCHAR(30) NOT NULL, -- 'saju', 'qrcode', 'lotto'
  name VARCHAR(100) NOT NULL,        -- '사주분석 10회권'
  description TEXT,

  -- 횟수 및 가격
  quantity INT NOT NULL,             -- 10
  regular_price INT NOT NULL,        -- 정가 199,900
  sale_price INT NOT NULL,           -- 판매가 97,000
  unit_price INT NOT NULL,           -- 정가 기준 1회당 가격 (환불 계산용) 29,900

  -- 할인 정보
  discount_rate INT DEFAULT 0,       -- 할인율 (%)
  discount_label VARCHAR(50),        -- '런칭특가', '35%↓'

  -- 판매 제한
  is_active BOOLEAN DEFAULT TRUE,
  is_promotion BOOLEAN DEFAULT FALSE,
  promotion_limit INT,               -- 선착순 인원 제한 (NULL이면 무제한)
  promotion_sold INT DEFAULT 0,      -- 현재 판매 수량

  -- 유효기간
  validity_days INT DEFAULT 365,     -- 구매 후 유효기간 (일)

  -- 정렬 순서
  sort_order INT DEFAULT 0,

  -- 타임스탬프
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- 인덱스
CREATE INDEX idx_voucher_packages_service ON voucher_packages(service_type);
CREATE INDEX idx_voucher_packages_active ON voucher_packages(is_active);

-- =====================================================
-- 2. 사용자 이용권
-- =====================================================

CREATE TABLE user_vouchers (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,

  -- 상품 정보
  package_id UUID REFERENCES voucher_packages(id),
  service_type VARCHAR(30) NOT NULL, -- 'saju', 'qrcode', 'lotto'

  -- 수량
  total_quantity INT NOT NULL,       -- 구매한 총 횟수
  used_quantity INT DEFAULT 0,       -- 사용한 횟수
  remaining_quantity INT NOT NULL,   -- 남은 횟수 (total - used)

  -- 구매 정보
  purchase_price INT NOT NULL,       -- 실제 결제 금액
  unit_price INT NOT NULL,           -- 환불 시 차감 단가 (정가)
  payment_id VARCHAR(100),           -- 토스페이 결제 ID
  order_id VARCHAR(100),             -- 주문번호

  -- 상태
  status VARCHAR(20) DEFAULT 'active', -- 'active', 'expired', 'refunded'

  -- 획득 경로
  source VARCHAR(30) DEFAULT 'purchase', -- 'purchase', 'gift', 'promotion', 'referral'
  source_user_id UUID REFERENCES users(id), -- 선물한 사람 ID

  -- 유효기간
  expires_at TIMESTAMP NOT NULL,

  -- 타임스탬프
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- 인덱스
CREATE INDEX idx_user_vouchers_user ON user_vouchers(user_id);
CREATE INDEX idx_user_vouchers_service ON user_vouchers(service_type);
CREATE INDEX idx_user_vouchers_status ON user_vouchers(status);
CREATE INDEX idx_user_vouchers_expires ON user_vouchers(expires_at);

-- =====================================================
-- 3. 이용권 사용 로그
-- =====================================================

CREATE TABLE voucher_usage_log (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  voucher_id UUID NOT NULL REFERENCES user_vouchers(id) ON DELETE CASCADE,
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,

  -- 사용 정보
  service_type VARCHAR(30) NOT NULL,
  quantity_used INT DEFAULT 1,       -- 사용 횟수

  -- 관련 데이터
  related_id UUID,                   -- 생성된 분석 결과 ID 등
  related_type VARCHAR(50),          -- 'fortune_analysis', 'qrcode', 'lotto'

  -- 메타데이터
  metadata JSONB,

  -- 타임스탬프
  used_at TIMESTAMP DEFAULT NOW()
);

-- 인덱스
CREATE INDEX idx_voucher_usage_voucher ON voucher_usage_log(voucher_id);
CREATE INDEX idx_voucher_usage_user ON voucher_usage_log(user_id);
CREATE INDEX idx_voucher_usage_date ON voucher_usage_log(used_at);

-- =====================================================
-- 4. 선물하기
-- =====================================================

CREATE TABLE voucher_gifts (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),

  -- 발송자
  sender_id UUID NOT NULL REFERENCES users(id),
  sender_voucher_id UUID NOT NULL REFERENCES user_vouchers(id),

  -- 선물 정보
  service_type VARCHAR(30) NOT NULL,
  quantity INT NOT NULL,             -- 선물할 횟수

  -- 수신자
  recipient_id UUID REFERENCES users(id),  -- 이미 가입한 회원인 경우
  recipient_phone VARCHAR(20),             -- 비회원에게 선물 (전화번호)
  recipient_email VARCHAR(255),            -- 비회원에게 선물 (이메일)

  -- 선물 코드 (비회원 수신용)
  gift_code VARCHAR(20) UNIQUE,
  gift_url TEXT,

  -- 메시지
  message TEXT,

  -- 상태
  status VARCHAR(20) DEFAULT 'pending', -- 'pending', 'claimed', 'expired', 'cancelled'

  -- 유효기간
  expires_at TIMESTAMP NOT NULL,      -- 선물 수령 기한
  claimed_at TIMESTAMP,               -- 수령 시간

  -- 수신 후 생성된 이용권
  claimed_voucher_id UUID REFERENCES user_vouchers(id),

  -- 타임스탬프
  created_at TIMESTAMP DEFAULT NOW()
);

-- 인덱스
CREATE INDEX idx_voucher_gifts_sender ON voucher_gifts(sender_id);
CREATE INDEX idx_voucher_gifts_recipient ON voucher_gifts(recipient_id);
CREATE INDEX idx_voucher_gifts_code ON voucher_gifts(gift_code);
CREATE INDEX idx_voucher_gifts_status ON voucher_gifts(status);

-- =====================================================
-- 5. 결제 내역
-- =====================================================

CREATE TABLE voucher_payments (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES users(id),

  -- 토스페이먼츠 정보
  payment_key VARCHAR(200),           -- 토스 paymentKey
  order_id VARCHAR(100) NOT NULL,     -- 주문번호
  order_name VARCHAR(200),            -- 주문명

  -- 결제 금액
  amount INT NOT NULL,

  -- 결제 수단
  method VARCHAR(30),                 -- 'CARD', 'VIRTUAL_ACCOUNT', 'TRANSFER', 'EASY_PAY'

  -- 상태
  status VARCHAR(20) DEFAULT 'pending', -- 'pending', 'completed', 'failed', 'refunded', 'partial_refunded'

  -- 환불 정보
  refund_amount INT DEFAULT 0,
  refund_reason TEXT,
  refunded_at TIMESTAMP,

  -- 관련 이용권
  voucher_id UUID REFERENCES user_vouchers(id),
  package_id UUID REFERENCES voucher_packages(id),

  -- 응답 데이터
  response_data JSONB,

  -- 타임스탬프
  created_at TIMESTAMP DEFAULT NOW(),
  approved_at TIMESTAMP,
  updated_at TIMESTAMP DEFAULT NOW()
);

-- 인덱스
CREATE INDEX idx_voucher_payments_user ON voucher_payments(user_id);
CREATE INDEX idx_voucher_payments_order ON voucher_payments(order_id);
CREATE INDEX idx_voucher_payments_status ON voucher_payments(status);

-- =====================================================
-- 6. 초기 상품 데이터 삽입
-- =====================================================

-- 사주분석 패키지
INSERT INTO voucher_packages (service_type, name, description, quantity, regular_price, sale_price, unit_price, discount_rate, discount_label, is_promotion, promotion_limit, sort_order) VALUES
('saju', '사주 완전분석 1회', '프리미엄 사주분석 PDF + 음성 리포트', 1, 29900, 14900, 29900, 50, '런칭특가 50%', true, 1000, 1),
('saju', '사주 완전분석 3회', '프리미엄 사주분석 PDF + 음성 리포트', 3, 79900, 38900, 29900, 51, '런칭특가', true, NULL, 2),
('saju', '사주 완전분석 5회', '프리미엄 사주분석 PDF + 음성 리포트', 5, 119900, 59900, 29900, 50, '런칭특가', true, NULL, 3),
('saju', '사주 완전분석 10회', '프리미엄 사주분석 PDF + 음성 리포트', 10, 199900, 97000, 29900, 51, '런칭특가 추천', true, NULL, 4),
('saju', '사주 완전분석 30회', '프리미엄 사주분석 PDF + 음성 리포트', 30, 449000, 299000, 29900, 33, '33%↓', false, NULL, 5),
('saju', '사주 완전분석 50회', '프리미엄 사주분석 PDF + 음성 리포트', 50, 749000, 399000, 29900, 47, '최대 할인', false, NULL, 6);

-- QR코드 패키지
INSERT INTO voucher_packages (service_type, name, description, quantity, regular_price, sale_price, unit_price, sort_order) VALUES
('qrcode', 'QR코드 30회권', 'QR코드 생성 30회', 30, 4900, 4900, 500, 1),
('qrcode', 'QR코드 100회권', 'QR코드 생성 100회', 100, 9900, 9900, 500, 2);

-- 로또 패키지
INSERT INTO voucher_packages (service_type, name, description, quantity, regular_price, sale_price, unit_price, sort_order) VALUES
('lotto', '로또번호 AI추천 30회권', '로또번호 AI추천 30회', 30, 4900, 4900, 500, 1),
('lotto', '로또번호 AI추천 100회권', '로또번호 AI추천 100회', 100, 9900, 9900, 500, 2);

-- =====================================================
-- 7. RLS 정책
-- =====================================================

-- user_vouchers RLS
ALTER TABLE user_vouchers ENABLE ROW LEVEL SECURITY;

CREATE POLICY user_vouchers_select ON user_vouchers
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY user_vouchers_insert ON user_vouchers
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY user_vouchers_update ON user_vouchers
  FOR UPDATE USING (auth.uid() = user_id);

-- voucher_usage_log RLS
ALTER TABLE voucher_usage_log ENABLE ROW LEVEL SECURITY;

CREATE POLICY voucher_usage_log_select ON voucher_usage_log
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY voucher_usage_log_insert ON voucher_usage_log
  FOR INSERT WITH CHECK (auth.uid() = user_id);

-- voucher_gifts RLS
ALTER TABLE voucher_gifts ENABLE ROW LEVEL SECURITY;

CREATE POLICY voucher_gifts_select ON voucher_gifts
  FOR SELECT USING (auth.uid() = sender_id OR auth.uid() = recipient_id);

CREATE POLICY voucher_gifts_insert ON voucher_gifts
  FOR INSERT WITH CHECK (auth.uid() = sender_id);

CREATE POLICY voucher_gifts_update ON voucher_gifts
  FOR UPDATE USING (auth.uid() = sender_id OR auth.uid() = recipient_id);

-- voucher_payments RLS
ALTER TABLE voucher_payments ENABLE ROW LEVEL SECURITY;

CREATE POLICY voucher_payments_select ON voucher_payments
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY voucher_payments_insert ON voucher_payments
  FOR INSERT WITH CHECK (auth.uid() = user_id);

-- voucher_packages는 공개 읽기 허용
ALTER TABLE voucher_packages ENABLE ROW LEVEL SECURITY;

CREATE POLICY voucher_packages_select ON voucher_packages
  FOR SELECT USING (true);

-- =====================================================
-- 8. 트리거: remaining_quantity 자동 계산
-- =====================================================

CREATE OR REPLACE FUNCTION update_remaining_quantity()
RETURNS TRIGGER AS $$
BEGIN
  NEW.remaining_quantity := NEW.total_quantity - NEW.used_quantity;
  NEW.updated_at := NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trigger_update_remaining_quantity
  BEFORE UPDATE ON user_vouchers
  FOR EACH ROW
  EXECUTE FUNCTION update_remaining_quantity();

-- =====================================================
-- 9. 함수: 이용권 사용
-- =====================================================

CREATE OR REPLACE FUNCTION use_voucher(
  p_user_id UUID,
  p_service_type VARCHAR(30),
  p_quantity INT DEFAULT 1,
  p_related_id UUID DEFAULT NULL,
  p_related_type VARCHAR(50) DEFAULT NULL
)
RETURNS JSONB AS $$
DECLARE
  v_voucher RECORD;
  v_remaining INT;
  v_result JSONB;
BEGIN
  -- 유효한 이용권 찾기 (FIFO: 만료일 빠른 순)
  SELECT * INTO v_voucher
  FROM user_vouchers
  WHERE user_id = p_user_id
    AND service_type = p_service_type
    AND status = 'active'
    AND remaining_quantity >= p_quantity
    AND expires_at > NOW()
  ORDER BY expires_at ASC
  LIMIT 1
  FOR UPDATE;

  IF NOT FOUND THEN
    RETURN jsonb_build_object(
      'success', false,
      'error', '사용 가능한 이용권이 없습니다.'
    );
  END IF;

  -- 이용권 차감
  UPDATE user_vouchers
  SET used_quantity = used_quantity + p_quantity
  WHERE id = v_voucher.id;

  -- 사용 로그 기록
  INSERT INTO voucher_usage_log (voucher_id, user_id, service_type, quantity_used, related_id, related_type)
  VALUES (v_voucher.id, p_user_id, p_service_type, p_quantity, p_related_id, p_related_type);

  -- 남은 횟수 조회
  SELECT remaining_quantity INTO v_remaining
  FROM user_vouchers WHERE id = v_voucher.id;

  RETURN jsonb_build_object(
    'success', true,
    'voucher_id', v_voucher.id,
    'remaining', v_remaining
  );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;
