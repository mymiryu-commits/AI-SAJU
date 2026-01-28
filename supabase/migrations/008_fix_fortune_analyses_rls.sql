-- fortune_analyses RLS 정책 수정
-- INSERT 작업을 위한 명시적 WITH CHECK 추가

-- 기존 정책 삭제
DROP POLICY IF EXISTS fortune_analyses_self ON fortune_analyses;

-- 새 정책: SELECT, UPDATE, DELETE
CREATE POLICY fortune_analyses_select ON fortune_analyses
    FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY fortune_analyses_update ON fortune_analyses
    FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY fortune_analyses_delete ON fortune_analyses
    FOR DELETE USING (auth.uid() = user_id);

-- INSERT 정책: WITH CHECK 명시적 추가
CREATE POLICY fortune_analyses_insert ON fortune_analyses
    FOR INSERT WITH CHECK (auth.uid() = user_id);

-- 인덱스 추가 (성능 향상)
CREATE INDEX IF NOT EXISTS idx_fortune_analyses_user_created
    ON fortune_analyses(user_id, created_at DESC);
