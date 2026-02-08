-- =====================================================
-- 관리자(mymiryu@gmail.com)에게 30회 무료 사주분석 이용권 제공
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
  WHERE email = 'mymiryu@gmail.com';

  IF v_user_id IS NULL THEN
    RAISE NOTICE '사용자를 찾을 수 없습니다: mymiryu@gmail.com';
    RETURN;
  END IF;

  -- 유효기간: 2년 (관리자용)
  v_expires_at := NOW() + INTERVAL '2 years';

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
    30,                    -- 총 30회
    0,                     -- 사용 0회
    30,                    -- 남은 30회
    0,                     -- 무료 제공
    29900,                 -- 정가 기준 단가
    'active',
    'admin_grant',         -- 관리자 지급
    v_expires_at
  );

  RAISE NOTICE '성공: mymiryu@gmail.com(관리자)에게 30회 무료 이용권 부여 완료. 만료일: %', v_expires_at;
END $$;
