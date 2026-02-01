/**
 * 분석 파일 저장 서비스
 * PDF와 MP3 파일을 Supabase Storage에 저장하고 관리
 *
 * MP3는 비용 발생으로 최초 1회만 생성, 이후 저장된 파일 제공
 */

import { createClient as createServerClient } from '@/lib/supabase/server';

const BUCKET_NAME = 'analysis-files';

export interface AnalysisFileResult {
  success: boolean;
  url?: string;
  error?: string;
  isNewFile?: boolean;
}

/**
 * 분석 파일 경로 생성
 * 형식: {userId}/{analysisId}/{type}.{ext}
 */
function getFilePath(userId: string, analysisId: string, type: 'pdf' | 'audio'): string {
  const ext = type === 'pdf' ? 'pdf' : 'mp3';
  return `${userId}/${analysisId}/${type}.${ext}`;
}

/**
 * 저장된 파일 URL 조회
 */
export async function getStoredFileUrl(
  userId: string,
  analysisId: string,
  type: 'pdf' | 'audio'
): Promise<string | null> {
  try {
    const supabase = await createServerClient();
    const filePath = getFilePath(userId, analysisId, type);

    // 파일 존재 여부 확인
    const { data, error } = await supabase.storage
      .from(BUCKET_NAME)
      .createSignedUrl(filePath, 60 * 60); // 1시간 유효

    if (error || !data?.signedUrl) {
      return null;
    }

    return data.signedUrl;
  } catch (error) {
    console.error('getStoredFileUrl error:', error);
    return null;
  }
}

/**
 * 파일 존재 여부 확인
 */
export async function checkFileExists(
  userId: string,
  analysisId: string,
  type: 'pdf' | 'audio'
): Promise<boolean> {
  try {
    const supabase = await createServerClient();
    const filePath = getFilePath(userId, analysisId, type);

    const { data, error } = await supabase.storage
      .from(BUCKET_NAME)
      .list(`${userId}/${analysisId}`, {
        search: type === 'pdf' ? 'pdf.pdf' : 'audio.mp3'
      });

    if (error) {
      console.error('checkFileExists error:', error);
      return false;
    }

    return data && data.length > 0;
  } catch (error) {
    console.error('checkFileExists error:', error);
    return false;
  }
}

/**
 * 파일 업로드 (PDF 또는 MP3)
 */
export async function uploadAnalysisFile(
  userId: string,
  analysisId: string,
  type: 'pdf' | 'audio',
  fileBuffer: Buffer | Uint8Array
): Promise<AnalysisFileResult> {
  try {
    const supabase = await createServerClient();
    const filePath = getFilePath(userId, analysisId, type);
    const contentType = type === 'pdf' ? 'application/pdf' : 'audio/mpeg';

    // 이미 파일이 존재하는지 확인 (MP3는 재생성 방지)
    if (type === 'audio') {
      const exists = await checkFileExists(userId, analysisId, type);
      if (exists) {
        const url = await getStoredFileUrl(userId, analysisId, type);
        return {
          success: true,
          url: url || undefined,
          isNewFile: false,
          error: '이미 생성된 음성 파일이 있습니다.'
        };
      }
    }

    // 파일 업로드
    const { data, error } = await supabase.storage
      .from(BUCKET_NAME)
      .upload(filePath, fileBuffer, {
        contentType,
        cacheControl: '86400', // 24시간 캐시
        upsert: type === 'pdf' // PDF는 덮어쓰기 허용, MP3는 불허
      });

    if (error) {
      console.error('uploadAnalysisFile error:', error);
      return {
        success: false,
        error: error.message
      };
    }

    // Signed URL 생성 (45일 유효)
    const { data: urlData } = await supabase.storage
      .from(BUCKET_NAME)
      .createSignedUrl(filePath, 45 * 24 * 60 * 60); // 45일

    return {
      success: true,
      url: urlData?.signedUrl,
      isNewFile: true
    };
  } catch (error) {
    console.error('uploadAnalysisFile error:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : '파일 업로드 실패'
    };
  }
}

/**
 * 저장된 파일 다운로드 (Buffer로 반환)
 */
export async function downloadStoredFile(
  userId: string,
  analysisId: string,
  type: 'pdf' | 'audio'
): Promise<{ success: boolean; data?: Buffer; error?: string }> {
  try {
    const supabase = await createServerClient();
    const filePath = getFilePath(userId, analysisId, type);

    const { data, error } = await supabase.storage
      .from(BUCKET_NAME)
      .download(filePath);

    if (error || !data) {
      return {
        success: false,
        error: error?.message || '파일을 찾을 수 없습니다.'
      };
    }

    // Blob to Buffer
    const arrayBuffer = await data.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);

    return {
      success: true,
      data: buffer
    };
  } catch (error) {
    console.error('downloadStoredFile error:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : '파일 다운로드 실패'
    };
  }
}

/**
 * 파일 삭제 (만료 시 호출)
 */
export async function deleteAnalysisFile(
  userId: string,
  analysisId: string,
  type?: 'pdf' | 'audio'
): Promise<boolean> {
  try {
    const supabase = await createServerClient();

    if (type) {
      // 특정 타입만 삭제
      const filePath = getFilePath(userId, analysisId, type);
      const { error } = await supabase.storage
        .from(BUCKET_NAME)
        .remove([filePath]);

      return !error;
    } else {
      // 분석 관련 모든 파일 삭제
      const { data: files } = await supabase.storage
        .from(BUCKET_NAME)
        .list(`${userId}/${analysisId}`);

      if (files && files.length > 0) {
        const paths = files.map(f => `${userId}/${analysisId}/${f.name}`);
        const { error } = await supabase.storage
          .from(BUCKET_NAME)
          .remove(paths);

        return !error;
      }

      return true;
    }
  } catch (error) {
    console.error('deleteAnalysisFile error:', error);
    return false;
  }
}

/**
 * DB의 파일 URL 업데이트
 */
export async function updateAnalysisFileUrls(
  analysisId: string,
  urls: { pdfUrl?: string; audioUrl?: string }
): Promise<boolean> {
  try {
    const supabase = await createServerClient();

    const updateData: Record<string, string | null> = {};
    if (urls.pdfUrl !== undefined) updateData.pdf_url = urls.pdfUrl;
    if (urls.audioUrl !== undefined) updateData.audio_url = urls.audioUrl;

    const { error } = await (supabase as any)
      .from('fortune_analyses')
      .update(updateData)
      .eq('id', analysisId);

    return !error;
  } catch (error) {
    console.error('updateAnalysisFileUrls error:', error);
    return false;
  }
}
