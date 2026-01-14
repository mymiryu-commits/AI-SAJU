-- 사주 프리미엄 분석을 위한 스키마 확장
-- Migration: 003_saju_premium_schema.sql

-- 사용자 테이블에 사주 관련 필드 추가
ALTER TABLE users ADD COLUMN IF NOT EXISTS career_type TEXT;
ALTER TABLE users ADD COLUMN IF NOT EXISTS career_level TEXT;
ALTER TABLE users ADD COLUMN IF NOT EXISTS years_exp INTEGER;
ALTER TABLE users ADD COLUMN IF NOT EXISTS marital_status TEXT;
ALTER TABLE users ADD COLUMN IF NOT EXISTS has_children BOOLEAN DEFAULT FALSE;
ALTER TABLE users ADD COLUMN IF NOT EXISTS children_ages JSONB;
ALTER TABLE users ADD COLUMN IF NOT EXISTS interests JSONB;
ALTER TABLE users ADD COLUMN IF NOT EXISTS current_concern TEXT;

-- 다자간 궁합 분석 테이블
CREATE TABLE IF NOT EXISTS group_analyses (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES users(id) ON DELETE CASCADE,

    -- 멤버 정보
    members JSONB NOT NULL, -- [{name, birthDate, birthTime, gender, relation}]
    total_members INTEGER NOT NULL,

    -- 분석 결과
    group_dynamics JSONB, -- {overallHarmony, dominantElement, ...}
    pair_analyses JSONB, -- 개별 쌍 분석 결과
    role_assignments JSONB, -- 역할 배정
    cooperation_strategies JSONB, -- 협력 전략
    conflict_warnings JSONB, -- 충돌 경고
    group_lucky JSONB, -- 그룹 행운 요소

    -- 메타데이터
    analysis_date DATE DEFAULT CURRENT_DATE,
    product_type TEXT DEFAULT 'group',
    price_paid INTEGER,
    currency TEXT DEFAULT 'KRW',

    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 프리미엄 분석 결과 테이블 (상세 분석용)
CREATE TABLE IF NOT EXISTS premium_analyses (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    analysis_id UUID REFERENCES fortune_analyses(id) ON DELETE CASCADE,
    user_id UUID REFERENCES users(id) ON DELETE CASCADE,

    -- 프리미엄 분석 유형
    product_type TEXT NOT NULL, -- 'basic', 'family', 'premium', 'vip'
    target_year INTEGER DEFAULT 2026,

    -- 분석 결과
    family_impact JSONB,
    career_analysis JSONB,
    interest_strategies JSONB,
    monthly_action_plan JSONB,
    life_timeline JSONB,
    timing_analysis JSONB,

    -- 문서/음성 URL
    pdf_url TEXT,
    audio_url TEXT,

    -- 결제 정보
    price_paid INTEGER,
    currency TEXT DEFAULT 'KRW',
    payment_id TEXT,

    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 전환 이벤트 추적 테이블
CREATE TABLE IF NOT EXISTS conversion_events (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES users(id) ON DELETE SET NULL,
    session_id TEXT,

    -- 이벤트 유형
    event_type TEXT NOT NULL, -- 'view_paywall', 'click_cta', 'purchase', 'exit_intent'
    template_type TEXT, -- 'freeToPaywall', 'timing', 'family', 'peer', 'exit', 'group'

    -- 컨텍스트
    product_id TEXT,
    discount_amount INTEGER,
    page_path TEXT,

    -- A/B 테스트
    variant TEXT, -- 'A', 'B'

    -- 결과
    converted BOOLEAN DEFAULT FALSE,
    revenue INTEGER,

    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 사주 분석 히스토리 뷰 (사용자별 분석 요약)
CREATE OR REPLACE VIEW user_saju_summary AS
SELECT
    u.id AS user_id,
    u.name,
    u.birth_date,
    u.gender,
    COUNT(DISTINCT fa.id) AS total_analyses,
    COUNT(DISTINCT CASE WHEN fa.subtype != 'basic' THEN fa.id END) AS premium_analyses,
    MAX(fa.created_at) AS last_analysis_date,
    COALESCE(SUM(pa.price_paid), 0) AS total_spent
FROM users u
LEFT JOIN fortune_analyses fa ON u.id = fa.user_id AND fa.type = 'saju'
LEFT JOIN premium_analyses pa ON u.id = pa.user_id
GROUP BY u.id, u.name, u.birth_date, u.gender;

-- 인덱스 추가
CREATE INDEX IF NOT EXISTS idx_group_analyses_user ON group_analyses(user_id);
CREATE INDEX IF NOT EXISTS idx_group_analyses_date ON group_analyses(analysis_date);
CREATE INDEX IF NOT EXISTS idx_premium_analyses_user ON premium_analyses(user_id);
CREATE INDEX IF NOT EXISTS idx_premium_analyses_type ON premium_analyses(product_type);
CREATE INDEX IF NOT EXISTS idx_conversion_events_user ON conversion_events(user_id);
CREATE INDEX IF NOT EXISTS idx_conversion_events_type ON conversion_events(event_type);
CREATE INDEX IF NOT EXISTS idx_conversion_events_date ON conversion_events(created_at);

-- RLS 정책
ALTER TABLE group_analyses ENABLE ROW LEVEL SECURITY;
ALTER TABLE premium_analyses ENABLE ROW LEVEL SECURITY;

-- 사용자는 자신의 분석만 볼 수 있음
CREATE POLICY "Users can view own group analyses" ON group_analyses
    FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own group analyses" ON group_analyses
    FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can view own premium analyses" ON premium_analyses
    FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own premium analyses" ON premium_analyses
    FOR INSERT WITH CHECK (auth.uid() = user_id);

-- 트리거: updated_at 자동 업데이트
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER update_group_analyses_updated_at
    BEFORE UPDATE ON group_analyses
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_premium_analyses_updated_at
    BEFORE UPDATE ON premium_analyses
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- 코멘트
COMMENT ON TABLE group_analyses IS '다자간 궁합 분석 결과 저장';
COMMENT ON TABLE premium_analyses IS '프리미엄 사주 분석 결과 저장';
COMMENT ON TABLE conversion_events IS '결제 전환 이벤트 추적';
