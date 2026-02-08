-- =====================================================
-- zoa1027@gmail.com 사용자에게 20회 무료 사주분석 이용권 제공
-- =====================================================

-- 1. 사용자 ID 찾기 및 이용권 부여
DO $$
DECLARE
  v_user_id UUID;
  v_expires_at TIMESTAMP;
BEGIN
  -- 이메일로 사용자 찾기
  SELECT id INTO v_user_id
  FROM auth.users
  WHERE email = 'zoa1027@gmail.com';

  IF v_user_id IS NULL THEN
    RAISE NOTICE '사용자를 찾을 수 없습니다: zoa1027@gmail.com';
    RETURN;
  END IF;

  -- 유효기간: 1년
  v_expires_at := NOW() + INTERVAL '1 year';

  -- 무료 이용권 삽입
  INSERT INTO user_vouchers (
    user_id,
    service_type,
    total_quantity,
    used_quantity,
    remaining_quantity,
    purchase_price,
    unit_price,
    status,
    source,
    expires_at
  ) VALUES (
    v_user_id,
    'saju',
    20,                    -- 총 20회
    0,                     -- 사용 0회
    20,                    -- 남은 20회
    0,                     -- 무료 제공
    29900,                 -- 정가 기준 단가
    'active',
    'promotion',           -- 프로모션으로 획득
    v_expires_at
  );

  RAISE NOTICE '성공: zoa1027@gmail.com에게 20회 무료 이용권 부여 완료. 만료일: %', v_expires_at;
END $$;
