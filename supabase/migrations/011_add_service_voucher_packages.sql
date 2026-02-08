-- =====================================================
-- 서비스별 결제권 패키지 추가
-- Migration: 011_add_service_voucher_packages.sql
-- =====================================================

-- 궁합 분석 패키지 추가
INSERT INTO voucher_packages (service_type, name, description, quantity, regular_price, sale_price, unit_price, discount_rate, discount_label, is_promotion, sort_order) VALUES
('compatibility', '궁합 분석 1회', '연인/친구/동료 궁합 분석', 1, 9900, 4900, 9900, 50, '런칭특가 50%', true, 1),
('compatibility', '궁합 분석 3회', '연인/친구/동료 궁합 분석', 3, 29700, 12900, 9900, 57, '런칭특가', true, 2),
('compatibility', '궁합 분석 5회', '연인/친구/동료 궁합 분석', 5, 49500, 19900, 9900, 60, '최대 할인', false, 3);

-- 관상 분석 패키지 추가
INSERT INTO voucher_packages (service_type, name, description, quantity, regular_price, sale_price, unit_price, discount_rate, discount_label, is_promotion, sort_order) VALUES
('face', '관상 분석 1회', 'AI 관상 분석 + 부위별 점수', 1, 9900, 4900, 9900, 50, '런칭특가 50%', true, 1),
('face', '관상 분석 3회', 'AI 관상 분석 + 부위별 점수', 3, 29700, 12900, 9900, 57, '런칭특가', true, 2),
('face', '관상 분석 5회', 'AI 관상 분석 + 부위별 점수', 5, 49500, 19900, 9900, 60, '최대 할인', false, 3);

-- =====================================================
-- 통합 분석 번들 패키지 (베이직/스탠다드/프리미엄)
-- service_type = 'bundle' + plan_type 필드 추가
-- =====================================================

-- voucher_packages 테이블에 plan_type 컬럼 추가 (없는 경우)
ALTER TABLE voucher_packages ADD COLUMN IF NOT EXISTS plan_type VARCHAR(30);
ALTER TABLE voucher_packages ADD COLUMN IF NOT EXISTS bundle_services JSONB;

-- 베이직 패키지: 사주 1회
INSERT INTO voucher_packages (service_type, plan_type, name, description, quantity, regular_price, sale_price, unit_price, discount_rate, discount_label, is_promotion, bundle_services, sort_order) VALUES
('bundle', 'basic', '베이직 패키지', '사주 완전분석 1회', 1, 9800, 4900, 9800, 50, '런칭특가 50%', true,
 '{"saju": 1}'::jsonb, 10);

-- 스탠다드 패키지: 사주 1회 + 궁합 1회
INSERT INTO voucher_packages (service_type, plan_type, name, description, quantity, regular_price, sale_price, unit_price, discount_rate, discount_label, is_promotion, promotion_limit, bundle_services, sort_order) VALUES
('bundle', 'standard', '스탠다드 패키지', '사주 완전분석 + 궁합 분석', 1, 19600, 9800, 19600, 50, '인기 50%', true, NULL,
 '{"saju": 1, "compatibility": 1}'::jsonb, 11);

-- 프리미엄 패키지: 사주 1회 + 궁합 1회 + 관상 1회
INSERT INTO voucher_packages (service_type, plan_type, name, description, quantity, regular_price, sale_price, unit_price, discount_rate, discount_label, is_promotion, bundle_services, sort_order) VALUES
('bundle', 'premium', '프리미엄 패키지', '사주 + 궁합 + 관상 통합 분석', 1, 39200, 19600, 39200, 50, 'BEST 50%', true,
 '{"saju": 1, "compatibility": 1, "face": 1}'::jsonb, 12);

-- =====================================================
-- 번들 결제권 발급 함수
-- 번들 패키지 구매 시 각 서비스별 결제권을 자동 생성
-- =====================================================

CREATE OR REPLACE FUNCTION issue_bundle_vouchers(
  p_user_id UUID,
  p_package_id UUID,
  p_payment_id VARCHAR(100),
  p_order_id VARCHAR(100),
  p_expires_at TIMESTAMP
)
RETURNS JSONB AS $$
DECLARE
  v_package RECORD;
  v_service TEXT;
  v_quantity INT;
  v_created_vouchers JSONB := '[]'::jsonb;
  v_voucher_id UUID;
BEGIN
  -- 패키지 정보 조회
  SELECT * INTO v_package
  FROM voucher_packages
  WHERE id = p_package_id;

  IF NOT FOUND THEN
    RETURN jsonb_build_object('success', false, 'error', '패키지를 찾을 수 없습니다.');
  END IF;

  -- 번들 패키지가 아닌 경우 단일 이용권 생성
  IF v_package.service_type != 'bundle' THEN
    INSERT INTO user_vouchers (
      user_id, package_id, service_type, total_quantity, used_quantity,
      remaining_quantity, purchase_price, unit_price, payment_id, order_id,
      status, source, expires_at
    ) VALUES (
      p_user_id, p_package_id, v_package.service_type, v_package.quantity, 0,
      v_package.quantity, v_package.sale_price, v_package.unit_price, p_payment_id, p_order_id,
      'active', 'purchase', p_expires_at
    )
    RETURNING id INTO v_voucher_id;

    RETURN jsonb_build_object(
      'success', true,
      'voucher_ids', jsonb_build_array(v_voucher_id)
    );
  END IF;

  -- 번들 패키지: 각 서비스별 이용권 생성
  FOR v_service, v_quantity IN
    SELECT key, value::int
    FROM jsonb_each_text(v_package.bundle_services)
  LOOP
    INSERT INTO user_vouchers (
      user_id, package_id, service_type, total_quantity, used_quantity,
      remaining_quantity, purchase_price, unit_price, payment_id, order_id,
      status, source, expires_at
    ) VALUES (
      p_user_id, p_package_id, v_service, v_quantity, 0,
      v_quantity, v_package.sale_price, v_package.unit_price, p_payment_id, p_order_id,
      'active', 'purchase', p_expires_at
    )
    RETURNING id INTO v_voucher_id;

    v_created_vouchers := v_created_vouchers || jsonb_build_object(
      'service', v_service,
      'quantity', v_quantity,
      'voucher_id', v_voucher_id
    );
  END LOOP;

  RETURN jsonb_build_object(
    'success', true,
    'bundle_type', v_package.plan_type,
    'vouchers', v_created_vouchers
  );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- 코멘트
COMMENT ON COLUMN voucher_packages.plan_type IS '번들 패키지 종류 (basic, standard, premium)';
COMMENT ON COLUMN voucher_packages.bundle_services IS '번들에 포함된 서비스 및 수량 JSON (예: {"saju": 1, "compatibility": 1})';
COMMENT ON FUNCTION issue_bundle_vouchers IS '번들 패키지 구매 시 각 서비스별 결제권을 자동 발급하는 함수';
