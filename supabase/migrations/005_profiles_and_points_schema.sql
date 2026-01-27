-- 프로필 및 포인트 시스템 스키마
-- Migration: 005_profiles_and_points_schema.sql

-- =====================================================
-- 1. 프로필 테이블 (포인트 관리 포함)
-- =====================================================

CREATE TABLE IF NOT EXISTS profiles (
    id UUID PRIMARY KEY REFERENCES users(id) ON DELETE CASCADE,

    -- 포인트 시스템
    points INTEGER DEFAULT 0,
    total_points_earned INTEGER DEFAULT 0,
    total_points_spent INTEGER DEFAULT 0,

    -- 무료 분석 제한
    free_analyses_today INTEGER DEFAULT 0,
    free_analyses_limit INTEGER DEFAULT 3,
    last_analysis_date DATE,

    -- 프리미엄 상태
    premium_until TIMESTAMPTZ,
    subscription_type TEXT, -- 'none', 'basic', 'pro', 'vip'

    -- 통계
    total_analyses INTEGER DEFAULT 0,
    premium_analyses INTEGER DEFAULT 0,

    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- =====================================================
-- 2. 포인트 거래 내역 테이블
-- =====================================================

CREATE TABLE IF NOT EXISTS point_transactions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES users(id) ON DELETE CASCADE,

    -- 거래 유형
    type TEXT NOT NULL, -- 'charge', 'spend', 'refund', 'bonus', 'expire'
    amount INTEGER NOT NULL, -- 양수: 충전, 음수: 차감
    balance_after INTEGER NOT NULL,

    -- 거래 상세
    description TEXT,
    reference_type TEXT, -- 'payment', 'analysis', 'pdf', 'voice', 'refund', 'signup_bonus', 'referral'
    reference_id TEXT,

    -- 메타데이터
    metadata JSONB,

    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- =====================================================
-- 3. 분석 기록 테이블 확장 (45일 유지 관리)
-- =====================================================

-- fortune_analyses에 컬럼 추가
ALTER TABLE fortune_analyses
ADD COLUMN IF NOT EXISTS is_premium BOOLEAN DEFAULT FALSE,
ADD COLUMN IF NOT EXISTS is_blinded BOOLEAN DEFAULT FALSE,
ADD COLUMN IF NOT EXISTS unblind_price INTEGER,
ADD COLUMN IF NOT EXISTS expires_at TIMESTAMPTZ,
ADD COLUMN IF NOT EXISTS zodiac_included BOOLEAN DEFAULT FALSE,
ADD COLUMN IF NOT EXISTS zodiac_data JSONB;

-- 45일 유지 정책을 위한 인덱스
CREATE INDEX IF NOT EXISTS idx_fortune_analyses_expires ON fortune_analyses(expires_at);

-- =====================================================
-- 4. 상품 정의 테이블
-- =====================================================

CREATE TABLE IF NOT EXISTS products (
    id TEXT PRIMARY KEY,
    name TEXT NOT NULL,
    description TEXT,

    -- 가격
    point_cost INTEGER NOT NULL,

    -- 기능 플래그
    features JSONB DEFAULT '{}',
    -- 예: {"pdf": true, "voice": true, "premium_analysis": true, "zodiac": true}

    -- 메타
    is_active BOOLEAN DEFAULT TRUE,
    display_order INTEGER DEFAULT 0,

    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 기본 상품 데이터
INSERT INTO products (id, name, description, point_cost, features, display_order) VALUES
    ('basic', '기본 분석', '성격, 2026년 운세, 월별 플랜', 0, '{"free": true}', 1),
    ('premium', '프리미엄 분석', '기본 + 가족 영향, 커리어 분석, 타이밍 분석', 500, '{"premium_analysis": true, "pdf": true, "zodiac": true}', 2),
    ('deep', '심층 분석', '프리미엄 + 10년 대운, 주요 운세 흐름', 1000, '{"premium_analysis": true, "pdf": true, "zodiac": true, "ten_year": true}', 3),
    ('vip', 'VIP 분석', '심층 + 인생 타임라인, 음성 해설', 2000, '{"premium_analysis": true, "pdf": true, "voice": true, "zodiac": true, "ten_year": true, "timeline": true}', 4),
    ('pdf_only', 'PDF 다운로드', '분석 결과 PDF 생성', 200, '{"pdf": true}', 10),
    ('voice_only', '음성 해설', '분석 결과 음성 생성', 300, '{"voice": true}', 11)
ON CONFLICT (id) DO UPDATE SET
    name = EXCLUDED.name,
    description = EXCLUDED.description,
    point_cost = EXCLUDED.point_cost,
    features = EXCLUDED.features,
    display_order = EXCLUDED.display_order;

-- =====================================================
-- 5. 인덱스 추가
-- =====================================================

CREATE INDEX IF NOT EXISTS idx_profiles_points ON profiles(points);
CREATE INDEX IF NOT EXISTS idx_profiles_premium ON profiles(premium_until);
CREATE INDEX IF NOT EXISTS idx_point_transactions_user ON point_transactions(user_id);
CREATE INDEX IF NOT EXISTS idx_point_transactions_type ON point_transactions(type);
CREATE INDEX IF NOT EXISTS idx_point_transactions_created ON point_transactions(created_at DESC);

-- =====================================================
-- 6. RLS 정책
-- =====================================================

ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE point_transactions ENABLE ROW LEVEL SECURITY;

-- 사용자는 자신의 프로필만 접근 가능
CREATE POLICY profiles_self ON profiles
    FOR ALL USING (auth.uid() = id);

-- 사용자는 자신의 거래 내역만 조회 가능
CREATE POLICY point_transactions_self ON point_transactions
    FOR SELECT USING (auth.uid() = user_id);

-- 시스템만 거래 내역 생성 가능 (서비스 롤 사용)
CREATE POLICY point_transactions_insert ON point_transactions
    FOR INSERT WITH CHECK (auth.uid() = user_id);

-- =====================================================
-- 7. 트리거: 프로필 자동 생성
-- =====================================================

CREATE OR REPLACE FUNCTION create_profile_for_user()
RETURNS TRIGGER AS $$
BEGIN
    INSERT INTO profiles (id, points, total_points_earned)
    VALUES (NEW.id, 500, 500) -- 가입 보너스 500P
    ON CONFLICT (id) DO NOTHING;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- 새 사용자 생성 시 프로필 자동 생성
DROP TRIGGER IF EXISTS create_profile_trigger ON users;
CREATE TRIGGER create_profile_trigger
    AFTER INSERT ON users
    FOR EACH ROW EXECUTE FUNCTION create_profile_for_user();

-- =====================================================
-- 8. 트리거: updated_at 자동 업데이트
-- =====================================================

CREATE OR REPLACE FUNCTION update_profile_updated_at()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS update_profiles_updated_at ON profiles;
CREATE TRIGGER update_profiles_updated_at
    BEFORE UPDATE ON profiles
    FOR EACH ROW EXECUTE FUNCTION update_profile_updated_at();

-- =====================================================
-- 9. 함수: 45일 지난 분석 만료 처리
-- =====================================================

CREATE OR REPLACE FUNCTION expire_old_analyses()
RETURNS void AS $$
BEGIN
    -- PDF/음성 URL 삭제 (45일 경과)
    UPDATE fortune_analyses
    SET
        pdf_url = NULL,
        audio_url = NULL
    WHERE expires_at IS NOT NULL
      AND expires_at < NOW();
END;
$$ LANGUAGE plpgsql;

-- =====================================================
-- 코멘트
-- =====================================================

COMMENT ON TABLE profiles IS '사용자 프로필 및 포인트 관리';
COMMENT ON TABLE point_transactions IS '포인트 거래 내역';
COMMENT ON TABLE products IS '상품 정의 (포인트 비용 포함)';
COMMENT ON COLUMN profiles.free_analyses_today IS '오늘 사용한 무료 분석 횟수';
COMMENT ON COLUMN fortune_analyses.is_blinded IS '무료 분석 - 프리미엄 콘텐츠 블라인드 여부';
COMMENT ON COLUMN fortune_analyses.expires_at IS 'PDF/음성 다운로드 만료일 (45일)';
