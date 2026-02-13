-- 관상 분석 스키마
-- Migration: 010_face_analyses_schema.sql

-- 관상 분석 결과 저장 테이블
CREATE TABLE IF NOT EXISTS face_analyses (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  analysis_id VARCHAR(50) NOT NULL UNIQUE,  -- 프론트엔드용 ID

  -- 점수 데이터
  overall_score INT NOT NULL CHECK (overall_score >= 0 AND overall_score <= 100),
  part_scores JSONB NOT NULL,       -- { forehead: 85, eyes: 90, ... }
  weighted_scores JSONB,            -- 가중치 적용 점수
  fortune_scores JSONB,             -- { career: 85, wealth: 80, ... }
  bonus_points INT DEFAULT 0,
  bonus_reason TEXT,

  -- 분석 상세
  features JSONB NOT NULL,          -- 부위별 상세 분석 결과
  personality JSONB,                -- 성격 분석
  advice JSONB,                     -- 전문가 조언
  storytelling JSONB,               -- 스토리텔링 해석

  -- 메타데이터
  use_ai BOOLEAN DEFAULT false,     -- Vision API 사용 여부
  ai_description TEXT,              -- Vision API 전체 인상 설명
  tts_script TEXT,                  -- TTS 음성 스크립트
  audio_url TEXT,                   -- 생성된 음성 파일 URL

  -- 원본 이미지 해시 (중복 분석 방지용, 이미지 자체는 저장 안 함)
  image_hash VARCHAR(64),

  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 인덱스
CREATE INDEX IF NOT EXISTS idx_face_analyses_user_id ON face_analyses(user_id);
CREATE INDEX IF NOT EXISTS idx_face_analyses_analysis_id ON face_analyses(analysis_id);
CREATE INDEX IF NOT EXISTS idx_face_analyses_overall_score ON face_analyses(overall_score);
CREATE INDEX IF NOT EXISTS idx_face_analyses_created_at ON face_analyses(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_face_analyses_image_hash ON face_analyses(image_hash);

-- RLS 정책
ALTER TABLE face_analyses ENABLE ROW LEVEL SECURITY;

-- 사용자는 자신의 관상 분석 결과만 볼 수 있음
CREATE POLICY "Users can view own face analyses"
  ON face_analyses FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can create face analyses"
  ON face_analyses FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own face analyses"
  ON face_analyses FOR UPDATE
  USING (auth.uid() = user_id);

CREATE POLICY "Users can delete own face analyses"
  ON face_analyses FOR DELETE
  USING (auth.uid() = user_id);

-- 관리자는 모든 분석 결과를 볼 수 있음
CREATE POLICY "Admins can view all face analyses"
  ON face_analyses FOR ALL
  USING (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE profiles.id = auth.uid()
      AND profiles.role = 'admin'
    )
  );

-- 업데이트 트리거
CREATE OR REPLACE FUNCTION update_face_analyses_timestamp()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS trigger_update_face_analyses ON face_analyses;
CREATE TRIGGER trigger_update_face_analyses
  BEFORE UPDATE ON face_analyses
  FOR EACH ROW
  EXECUTE FUNCTION update_face_analyses_timestamp();

-- 분석 통계 뷰
CREATE OR REPLACE VIEW face_analysis_stats AS
SELECT
  DATE(created_at) as date,
  COUNT(*) as total_analyses,
  AVG(overall_score) as avg_score,
  MIN(overall_score) as min_score,
  MAX(overall_score) as max_score,
  SUM(CASE WHEN use_ai THEN 1 ELSE 0 END) as ai_analyses,
  SUM(CASE WHEN use_ai = false THEN 1 ELSE 0 END) as deterministic_analyses
FROM face_analyses
GROUP BY DATE(created_at)
ORDER BY date DESC;

-- 코멘트
COMMENT ON TABLE face_analyses IS '관상 분석 결과 저장 테이블';
COMMENT ON COLUMN face_analyses.analysis_id IS '프론트엔드용 고유 분석 ID';
COMMENT ON COLUMN face_analyses.overall_score IS '종합 점수 (0-100)';
COMMENT ON COLUMN face_analyses.part_scores IS '부위별 원점수 JSON';
COMMENT ON COLUMN face_analyses.fortune_scores IS '운세별 점수 (career, wealth, love, health, social)';
COMMENT ON COLUMN face_analyses.use_ai IS 'Vision API 사용 여부 (false면 결정론적 분석)';
COMMENT ON COLUMN face_analyses.image_hash IS '원본 이미지 해시 (프라이버시 보호를 위해 이미지 자체는 저장하지 않음)';
