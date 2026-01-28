-- 사주 프로필 저장/불러오기 기능
-- Migration: 004_saju_profiles_schema.sql

-- 사주 프로필 테이블
CREATE TABLE IF NOT EXISTS saju_profiles (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES users(id) ON DELETE CASCADE,

    -- 기본 정보
    name VARCHAR(100) NOT NULL,
    birth_date DATE NOT NULL,
    birth_time TIME,
    gender VARCHAR(10) NOT NULL,
    calendar VARCHAR(10) DEFAULT 'solar',

    -- 추가 정보
    blood_type VARCHAR(2),
    mbti VARCHAR(4),

    -- 직업 정보
    career_type VARCHAR(30),
    career_level VARCHAR(20),
    years_exp INTEGER,

    -- 가족 정보
    marital_status VARCHAR(20),
    has_children BOOLEAN DEFAULT FALSE,
    children_ages JSONB,

    -- 관심사 및 고민
    interests JSONB,
    current_concern VARCHAR(30),

    -- 관계 유형 (본인, 가족, 친구 등)
    relation_type VARCHAR(20) DEFAULT 'self',

    -- 별칭 (쉬운 식별용)
    nickname VARCHAR(50),

    -- 순서 (정렬용)
    display_order INTEGER DEFAULT 0,

    -- 즐겨찾기
    is_favorite BOOLEAN DEFAULT FALSE,

    -- 메타데이터
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 인덱스
CREATE INDEX IF NOT EXISTS idx_saju_profiles_user ON saju_profiles(user_id);
CREATE INDEX IF NOT EXISTS idx_saju_profiles_name ON saju_profiles(name);
CREATE INDEX IF NOT EXISTS idx_saju_profiles_favorite ON saju_profiles(user_id, is_favorite);
CREATE INDEX IF NOT EXISTS idx_saju_profiles_order ON saju_profiles(user_id, display_order);

-- RLS 정책
ALTER TABLE saju_profiles ENABLE ROW LEVEL SECURITY;

-- 사용자는 자신의 프로필만 볼 수 있음
CREATE POLICY "Users can view own saju profiles" ON saju_profiles
    FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own saju profiles" ON saju_profiles
    FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own saju profiles" ON saju_profiles
    FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Users can delete own saju profiles" ON saju_profiles
    FOR DELETE USING (auth.uid() = user_id);

-- 트리거: updated_at 자동 업데이트
CREATE TRIGGER update_saju_profiles_updated_at
    BEFORE UPDATE ON saju_profiles
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- 코멘트
COMMENT ON TABLE saju_profiles IS '사주 분석용 사용자 프로필 저장';
COMMENT ON COLUMN saju_profiles.relation_type IS '프로필 관계: self(본인), family(가족), friend(친구), colleague(동료), other(기타)';
COMMENT ON COLUMN saju_profiles.nickname IS '프로필 별칭 (예: 엄마, 아빠, 남편 등)';
