-- =====================================================
-- 012: 결제권 테이블 FK 참조 수정
-- users(id) → auth.users(id)로 변경
-- 기존 users 테이블 대신 auth.users를 참조하여
-- 인증된 사용자가 바로 결제할 수 있도록 수정
-- =====================================================

-- 1. user_vouchers 테이블 FK 수정
ALTER TABLE user_vouchers DROP CONSTRAINT IF EXISTS user_vouchers_user_id_fkey;
ALTER TABLE user_vouchers ADD CONSTRAINT user_vouchers_user_id_fkey
  FOREIGN KEY (user_id) REFERENCES auth.users(id) ON DELETE CASCADE;

ALTER TABLE user_vouchers DROP CONSTRAINT IF EXISTS user_vouchers_source_user_id_fkey;
ALTER TABLE user_vouchers ADD CONSTRAINT user_vouchers_source_user_id_fkey
  FOREIGN KEY (source_user_id) REFERENCES auth.users(id) ON DELETE SET NULL;

-- 2. voucher_usage_log 테이블 FK 수정
ALTER TABLE voucher_usage_log DROP CONSTRAINT IF EXISTS voucher_usage_log_user_id_fkey;
ALTER TABLE voucher_usage_log ADD CONSTRAINT voucher_usage_log_user_id_fkey
  FOREIGN KEY (user_id) REFERENCES auth.users(id) ON DELETE CASCADE;

-- 3. voucher_gifts 테이블 FK 수정
ALTER TABLE voucher_gifts DROP CONSTRAINT IF EXISTS voucher_gifts_sender_id_fkey;
ALTER TABLE voucher_gifts ADD CONSTRAINT voucher_gifts_sender_id_fkey
  FOREIGN KEY (sender_id) REFERENCES auth.users(id) ON DELETE CASCADE;

ALTER TABLE voucher_gifts DROP CONSTRAINT IF EXISTS voucher_gifts_recipient_id_fkey;
ALTER TABLE voucher_gifts ADD CONSTRAINT voucher_gifts_recipient_id_fkey
  FOREIGN KEY (recipient_id) REFERENCES auth.users(id) ON DELETE SET NULL;

-- 4. voucher_payments 테이블 FK 수정
ALTER TABLE voucher_payments DROP CONSTRAINT IF EXISTS voucher_payments_user_id_fkey;
ALTER TABLE voucher_payments ADD CONSTRAINT voucher_payments_user_id_fkey
  FOREIGN KEY (user_id) REFERENCES auth.users(id) ON DELETE CASCADE;
