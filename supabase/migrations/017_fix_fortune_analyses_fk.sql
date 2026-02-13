-- =====================================================
-- 017: fortune_analyses FK 제약조건 수정
-- =====================================================
-- 문제: fortune_analyses.user_id가 users(id)를 참조하지만,
--       OAuth 로그인 사용자는 auth.users에만 존재함
-- 해결: FK 제약조건을 auth.users로 변경

-- 1. 기존 FK 제약조건 제거
ALTER TABLE fortune_analyses
DROP CONSTRAINT IF EXISTS fortune_analyses_user_id_fkey;

-- 2. auth.users를 참조하는 새 FK 추가
ALTER TABLE fortune_analyses
ADD CONSTRAINT fortune_analyses_user_id_fkey
FOREIGN KEY (user_id) REFERENCES auth.users(id) ON DELETE SET NULL;

-- 3. daily_fortunes 테이블도 같은 문제가 있을 수 있음
ALTER TABLE daily_fortunes
DROP CONSTRAINT IF EXISTS daily_fortunes_user_id_fkey;

ALTER TABLE daily_fortunes
ADD CONSTRAINT daily_fortunes_user_id_fkey
FOREIGN KEY (user_id) REFERENCES auth.users(id) ON DELETE CASCADE;

-- 4. checkins 테이블
ALTER TABLE checkins
DROP CONSTRAINT IF EXISTS checkins_user_id_fkey;

ALTER TABLE checkins
ADD CONSTRAINT checkins_user_id_fkey
FOREIGN KEY (user_id) REFERENCES auth.users(id) ON DELETE CASCADE;

-- 5. RLS 정책 확인 (이미 auth.uid() 사용 중이므로 문제 없음)
-- fortune_analyses_self 정책: auth.uid() = user_id

-- =====================================================
-- 코멘트
-- =====================================================
COMMENT ON COLUMN fortune_analyses.user_id IS 'auth.users(id)를 참조 - OAuth 로그인 사용자 지원';
