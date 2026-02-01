-- =====================================================
-- 생성 활동 로그 시스템
-- PDF/MP3 생성 요청의 성공/실패 기록
-- 민원 대응 및 시스템 모니터링용
-- =====================================================

-- 1. 생성 활동 로그 테이블
CREATE TABLE IF NOT EXISTS generation_logs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),

  -- 사용자 정보
  user_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  user_email TEXT,  -- 탈퇴 후에도 로그 유지

  -- 분석 정보
  analysis_id UUID REFERENCES fortune_analyses(id) ON DELETE SET NULL,
  analysis_type TEXT,  -- 'saju', 'compatibility', etc.

  -- 생성 정보
  generation_type TEXT NOT NULL,  -- 'pdf', 'audio'
  status TEXT NOT NULL,  -- 'started', 'success', 'failed', 'skipped'

  -- TTS 관련 (audio만)
  tts_provider TEXT,  -- 'openai', 'gemini-flash', 'gemini-pro', 'edge'
  tts_voice TEXT,

  -- 파일 정보
  file_size_bytes INTEGER,
  file_url TEXT,
  storage_path TEXT,

  -- 비용/포인트
  points_charged INTEGER DEFAULT 0,
  is_free_generation BOOLEAN DEFAULT false,
  free_reason TEXT,  -- 'admin', 'premium_user', 'premium_analysis'

  -- 성능 측정
  generation_time_ms INTEGER,  -- 생성 소요 시간

  -- 에러 정보
  error_code TEXT,
  error_message TEXT,
  error_details JSONB,

  -- 요청 정보
  source TEXT,  -- 'dashboard', 'api', 'admin'
  ip_address TEXT,
  user_agent TEXT,

  -- 메타데이터
  metadata JSONB,

  -- 타임스탬프
  created_at TIMESTAMPTZ DEFAULT NOW(),
  completed_at TIMESTAMPTZ
);

-- 2. 인덱스 생성
CREATE INDEX idx_generation_logs_user ON generation_logs(user_id);
CREATE INDEX idx_generation_logs_analysis ON generation_logs(analysis_id);
CREATE INDEX idx_generation_logs_status ON generation_logs(status);
CREATE INDEX idx_generation_logs_type ON generation_logs(generation_type);
CREATE INDEX idx_generation_logs_created ON generation_logs(created_at DESC);
CREATE INDEX idx_generation_logs_error ON generation_logs(error_code) WHERE error_code IS NOT NULL;

-- 3. 일별 통계 뷰 (관리자 대시보드용)
CREATE OR REPLACE VIEW generation_stats_daily AS
SELECT
  DATE(created_at) as date,
  generation_type,
  COUNT(*) as total_requests,
  COUNT(*) FILTER (WHERE status = 'success') as success_count,
  COUNT(*) FILTER (WHERE status = 'failed') as failed_count,
  COUNT(*) FILTER (WHERE status = 'skipped') as skipped_count,
  ROUND(AVG(generation_time_ms)::numeric, 2) as avg_generation_time_ms,
  SUM(file_size_bytes) as total_file_size_bytes,
  SUM(points_charged) as total_points_charged,
  COUNT(DISTINCT user_id) as unique_users
FROM generation_logs
WHERE created_at >= NOW() - INTERVAL '90 days'
GROUP BY DATE(created_at), generation_type
ORDER BY date DESC, generation_type;

-- 4. 시간별 통계 뷰 (실시간 모니터링용)
CREATE OR REPLACE VIEW generation_stats_hourly AS
SELECT
  DATE_TRUNC('hour', created_at) as hour,
  generation_type,
  COUNT(*) as total_requests,
  COUNT(*) FILTER (WHERE status = 'success') as success_count,
  COUNT(*) FILTER (WHERE status = 'failed') as failed_count,
  ROUND(
    (COUNT(*) FILTER (WHERE status = 'success')::numeric / NULLIF(COUNT(*), 0) * 100),
    2
  ) as success_rate
FROM generation_logs
WHERE created_at >= NOW() - INTERVAL '24 hours'
GROUP BY DATE_TRUNC('hour', created_at), generation_type
ORDER BY hour DESC;

-- 5. 에러 요약 뷰
CREATE OR REPLACE VIEW generation_errors_summary AS
SELECT
  DATE(created_at) as date,
  generation_type,
  error_code,
  error_message,
  COUNT(*) as error_count,
  array_agg(DISTINCT user_email) as affected_users
FROM generation_logs
WHERE
  status = 'failed'
  AND created_at >= NOW() - INTERVAL '7 days'
GROUP BY DATE(created_at), generation_type, error_code, error_message
ORDER BY date DESC, error_count DESC;

-- 6. RLS 정책
ALTER TABLE generation_logs ENABLE ROW LEVEL SECURITY;

-- 서비스 롤은 모든 작업 가능
CREATE POLICY "Service can manage generation logs"
ON generation_logs FOR ALL
TO service_role
USING (true)
WITH CHECK (true);

-- 사용자는 자신의 로그만 조회 가능
CREATE POLICY "Users can view own generation logs"
ON generation_logs FOR SELECT
TO authenticated
USING (user_id = auth.uid());

-- 7. 관리자 활동 로그 테이블
CREATE TABLE IF NOT EXISTS admin_action_logs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),

  admin_user_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  admin_email TEXT NOT NULL,

  action_type TEXT NOT NULL,  -- 'grant_points', 'issue_voucher', 'change_settings', 'view_user', etc.
  action_description TEXT,

  target_user_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  target_user_email TEXT,

  target_resource_type TEXT,  -- 'user', 'voucher', 'settings', 'analysis'
  target_resource_id TEXT,

  before_value JSONB,
  after_value JSONB,

  ip_address TEXT,
  user_agent TEXT,

  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_admin_logs_admin ON admin_action_logs(admin_user_id);
CREATE INDEX idx_admin_logs_target ON admin_action_logs(target_user_id);
CREATE INDEX idx_admin_logs_action ON admin_action_logs(action_type);
CREATE INDEX idx_admin_logs_created ON admin_action_logs(created_at DESC);

-- 8. 시스템 에러 로그 테이블
CREATE TABLE IF NOT EXISTS system_error_logs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),

  error_level TEXT NOT NULL,  -- 'error', 'warning', 'critical'
  error_type TEXT NOT NULL,   -- 'tts_api', 'storage', 'database', 'payment', etc.

  error_code TEXT,
  error_message TEXT NOT NULL,
  error_stack TEXT,

  endpoint TEXT,
  http_method TEXT,
  http_status INTEGER,

  user_id UUID,
  request_id TEXT,

  context JSONB,

  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_system_errors_level ON system_error_logs(error_level);
CREATE INDEX idx_system_errors_type ON system_error_logs(error_type);
CREATE INDEX idx_system_errors_created ON system_error_logs(created_at DESC);

-- 9. 오래된 로그 정리 함수 (90일 이상 보관 후 삭제)
CREATE OR REPLACE FUNCTION cleanup_old_logs()
RETURNS void AS $$
BEGIN
  -- 90일 이상된 생성 로그 삭제
  DELETE FROM generation_logs WHERE created_at < NOW() - INTERVAL '90 days';

  -- 180일 이상된 관리자 로그 삭제
  DELETE FROM admin_action_logs WHERE created_at < NOW() - INTERVAL '180 days';

  -- 30일 이상된 시스템 에러 로그 삭제
  DELETE FROM system_error_logs WHERE created_at < NOW() - INTERVAL '30 days';
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- 10. 생성 로그 요약 함수 (특정 사용자)
CREATE OR REPLACE FUNCTION get_user_generation_summary(p_user_id UUID)
RETURNS TABLE (
  generation_type TEXT,
  total_count BIGINT,
  success_count BIGINT,
  failed_count BIGINT,
  total_points_spent BIGINT,
  last_generation TIMESTAMPTZ
) AS $$
BEGIN
  RETURN QUERY
  SELECT
    gl.generation_type,
    COUNT(*)::BIGINT as total_count,
    COUNT(*) FILTER (WHERE gl.status = 'success')::BIGINT as success_count,
    COUNT(*) FILTER (WHERE gl.status = 'failed')::BIGINT as failed_count,
    COALESCE(SUM(gl.points_charged), 0)::BIGINT as total_points_spent,
    MAX(gl.created_at) as last_generation
  FROM generation_logs gl
  WHERE gl.user_id = p_user_id
  GROUP BY gl.generation_type;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;
