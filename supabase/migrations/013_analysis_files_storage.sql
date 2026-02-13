-- =====================================================
-- 분석 파일 스토리지 버킷 설정
-- PDF 및 MP3 파일 저장용
-- =====================================================

-- 1. Storage 버킷 생성
INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES (
  'analysis-files',
  'analysis-files',
  false,  -- 비공개 버킷 (signed URL로만 접근)
  52428800,  -- 50MB 제한
  ARRAY['application/pdf', 'audio/mpeg', 'audio/mp3']
)
ON CONFLICT (id) DO UPDATE SET
  file_size_limit = EXCLUDED.file_size_limit,
  allowed_mime_types = EXCLUDED.allowed_mime_types;

-- 2. RLS 정책: 사용자는 자신의 파일만 접근 가능

-- 업로드 정책 (서비스 롤만 가능 - API에서 처리)
CREATE POLICY "Service can upload analysis files"
ON storage.objects FOR INSERT
TO service_role
WITH CHECK (bucket_id = 'analysis-files');

-- 다운로드 정책 (서비스 롤만 가능 - API에서 처리)
CREATE POLICY "Service can download analysis files"
ON storage.objects FOR SELECT
TO service_role
USING (bucket_id = 'analysis-files');

-- 삭제 정책 (서비스 롤만 가능)
CREATE POLICY "Service can delete analysis files"
ON storage.objects FOR DELETE
TO service_role
USING (bucket_id = 'analysis-files');

-- 3. 만료된 파일 자동 삭제를 위한 함수 (선택사항)
-- Supabase에서는 Storage의 lifecycle 정책을 설정하거나
-- Edge Function/Cron으로 주기적 삭제 처리

-- 만료된 분석의 파일 정보 조회 함수
CREATE OR REPLACE FUNCTION get_expired_analysis_files()
RETURNS TABLE (
  user_id UUID,
  analysis_id UUID,
  pdf_url TEXT,
  audio_url TEXT
) AS $$
BEGIN
  RETURN QUERY
  SELECT
    fa.user_id,
    fa.id as analysis_id,
    fa.pdf_url,
    fa.audio_url
  FROM fortune_analyses fa
  WHERE
    fa.expires_at IS NOT NULL
    AND fa.expires_at < NOW()
    AND (fa.pdf_url IS NOT NULL OR fa.audio_url IS NOT NULL);
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- 만료된 분석의 URL 정보 초기화 함수
CREATE OR REPLACE FUNCTION clear_expired_analysis_urls()
RETURNS void AS $$
BEGIN
  UPDATE fortune_analyses
  SET
    pdf_url = NULL,
    audio_url = NULL
  WHERE
    expires_at IS NOT NULL
    AND expires_at < NOW()
    AND (pdf_url IS NOT NULL OR audio_url IS NOT NULL);
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- 4. 인덱스 추가 (파일 관련 조회 최적화)
CREATE INDEX IF NOT EXISTS idx_fortune_analyses_files
ON fortune_analyses(user_id, pdf_url, audio_url)
WHERE pdf_url IS NOT NULL OR audio_url IS NOT NULL;
