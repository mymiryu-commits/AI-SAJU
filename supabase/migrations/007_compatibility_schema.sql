-- 궁합 분석 스키마
-- Migration: 007_compatibility_schema.sql

-- 궁합 분석 결과 저장 테이블
CREATE TABLE IF NOT EXISTS compatibility_results (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  partner_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  partner_name VARCHAR(50),  -- 비회원 파트너의 경우
  compatibility_type VARCHAR(20) NOT NULL CHECK (compatibility_type IN ('couple', 'business', 'family')),
  total_score INT NOT NULL,
  grade VARCHAR(1) NOT NULL CHECK (grade IN ('S', 'A', 'B', 'C', 'D')),
  result_data JSONB NOT NULL,  -- 전체 분석 결과 JSON
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 인덱스
CREATE INDEX IF NOT EXISTS idx_compatibility_user_id ON compatibility_results(user_id);
CREATE INDEX IF NOT EXISTS idx_compatibility_partner_id ON compatibility_results(partner_id);
CREATE INDEX IF NOT EXISTS idx_compatibility_type ON compatibility_results(compatibility_type);
CREATE INDEX IF NOT EXISTS idx_compatibility_created_at ON compatibility_results(created_at DESC);

-- RLS 정책
ALTER TABLE compatibility_results ENABLE ROW LEVEL SECURITY;

-- 사용자는 자신의 궁합 결과만 볼 수 있음
CREATE POLICY "Users can view own compatibility results"
  ON compatibility_results FOR SELECT
  USING (auth.uid() = user_id OR auth.uid() = partner_id);

CREATE POLICY "Users can create compatibility results"
  ON compatibility_results FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can delete own compatibility results"
  ON compatibility_results FOR DELETE
  USING (auth.uid() = user_id);

-- 정통 사주 분석 결과 캐시 테이블
CREATE TABLE IF NOT EXISTS advanced_saju_results (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE UNIQUE,
  sipsin_data JSONB,
  sinsal_data JSONB,
  unsung_data JSONB,
  hapchung_data JSONB,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 인덱스
CREATE INDEX IF NOT EXISTS idx_advanced_saju_user_id ON advanced_saju_results(user_id);

-- RLS 정책
ALTER TABLE advanced_saju_results ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own advanced saju results"
  ON advanced_saju_results FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own advanced saju results"
  ON advanced_saju_results FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own advanced saju results"
  ON advanced_saju_results FOR UPDATE
  USING (auth.uid() = user_id);

-- 업데이트 트리거
CREATE OR REPLACE FUNCTION update_advanced_saju_timestamp()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS trigger_update_advanced_saju ON advanced_saju_results;
CREATE TRIGGER trigger_update_advanced_saju
  BEFORE UPDATE ON advanced_saju_results
  FOR EACH ROW
  EXECUTE FUNCTION update_advanced_saju_timestamp();
