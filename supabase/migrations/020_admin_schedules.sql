-- Admin Schedule Management Table
-- 관리자 전용 스케줄/할일 관리 테이블

CREATE TABLE IF NOT EXISTS admin_schedules (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title TEXT NOT NULL,
  description TEXT,
  link_url TEXT,
  link_label TEXT,
  is_completed BOOLEAN DEFAULT FALSE,
  priority INTEGER DEFAULT 0,
  due_date DATE,
  created_by TEXT NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  completed_at TIMESTAMPTZ
);

-- Index for faster queries
CREATE INDEX IF NOT EXISTS idx_admin_schedules_created_by ON admin_schedules(created_by);
CREATE INDEX IF NOT EXISTS idx_admin_schedules_is_completed ON admin_schedules(is_completed);
CREATE INDEX IF NOT EXISTS idx_admin_schedules_due_date ON admin_schedules(due_date);
CREATE INDEX IF NOT EXISTS idx_admin_schedules_priority ON admin_schedules(priority DESC);

-- Enable RLS
ALTER TABLE admin_schedules ENABLE ROW LEVEL SECURITY;

-- RLS Policy: Only admins can access
CREATE POLICY "Admin can manage schedules" ON admin_schedules
  FOR ALL
  USING (true)
  WITH CHECK (true);

-- Function to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_admin_schedules_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  IF NEW.is_completed = TRUE AND OLD.is_completed = FALSE THEN
    NEW.completed_at = NOW();
  ELSIF NEW.is_completed = FALSE THEN
    NEW.completed_at = NULL;
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Trigger for updated_at
DROP TRIGGER IF EXISTS trigger_admin_schedules_updated_at ON admin_schedules;
CREATE TRIGGER trigger_admin_schedules_updated_at
  BEFORE UPDATE ON admin_schedules
  FOR EACH ROW
  EXECUTE FUNCTION update_admin_schedules_updated_at();

-- Comments
COMMENT ON TABLE admin_schedules IS '관리자 스케줄/할일 관리 테이블';
COMMENT ON COLUMN admin_schedules.id IS '고유 식별자';
COMMENT ON COLUMN admin_schedules.title IS '할일 제목';
COMMENT ON COLUMN admin_schedules.description IS '할일 상세 설명';
COMMENT ON COLUMN admin_schedules.link_url IS '관련 사이트 URL';
COMMENT ON COLUMN admin_schedules.link_label IS '링크 표시 텍스트';
COMMENT ON COLUMN admin_schedules.is_completed IS '완료 여부';
COMMENT ON COLUMN admin_schedules.priority IS '우선순위 (높을수록 상위)';
COMMENT ON COLUMN admin_schedules.due_date IS '마감일';
COMMENT ON COLUMN admin_schedules.created_by IS '생성자 이메일';
COMMENT ON COLUMN admin_schedules.completed_at IS '완료 시간';
