/**
 * 생성 활동 로그 서비스
 *
 * PDF/MP3 생성 요청의 성공/실패를 기록하여
 * 민원 대응 및 시스템 모니터링에 활용
 */

import { createClient as createServerClient } from '@/lib/supabase/server';

export type GenerationType = 'pdf' | 'audio';
export type GenerationStatus = 'started' | 'success' | 'failed' | 'skipped';

export interface GenerationLogInput {
  userId: string;
  userEmail?: string;
  analysisId: string;
  analysisType?: string;
  generationType: GenerationType;
  status: GenerationStatus;
  ttsProvider?: string;
  ttsVoice?: string;
  fileSizeBytes?: number;
  fileUrl?: string;
  storagePath?: string;
  pointsCharged?: number;
  isFreeGeneration?: boolean;
  freeReason?: 'admin' | 'premium_user' | 'premium_analysis';
  generationTimeMs?: number;
  errorCode?: string;
  errorMessage?: string;
  errorDetails?: Record<string, unknown>;
  source?: 'dashboard' | 'api' | 'admin';
  ipAddress?: string;
  userAgent?: string;
  metadata?: Record<string, unknown>;
}

/**
 * 생성 로그 기록
 */
export async function logGeneration(input: GenerationLogInput): Promise<string | null> {
  try {
    const supabase = await createServerClient();

    const { data, error } = await (supabase as any)
      .from('generation_logs')
      .insert({
        user_id: input.userId,
        user_email: input.userEmail,
        analysis_id: input.analysisId,
        analysis_type: input.analysisType || 'saju',
        generation_type: input.generationType,
        status: input.status,
        tts_provider: input.ttsProvider,
        tts_voice: input.ttsVoice,
        file_size_bytes: input.fileSizeBytes,
        file_url: input.fileUrl,
        storage_path: input.storagePath,
        points_charged: input.pointsCharged || 0,
        is_free_generation: input.isFreeGeneration || false,
        free_reason: input.freeReason,
        generation_time_ms: input.generationTimeMs,
        error_code: input.errorCode,
        error_message: input.errorMessage,
        error_details: input.errorDetails,
        source: input.source || 'api',
        ip_address: input.ipAddress,
        user_agent: input.userAgent,
        metadata: input.metadata,
        completed_at: input.status !== 'started' ? new Date().toISOString() : null,
      })
      .select('id')
      .single();

    if (error) {
      console.error('[GenerationLog] Failed to log generation:', error);
      return null;
    }

    return data?.id || null;
  } catch (error) {
    console.error('[GenerationLog] Error logging generation:', error);
    return null;
  }
}

/**
 * 로그 상태 업데이트 (started → success/failed)
 */
export async function updateGenerationLog(
  logId: string,
  update: Partial<Pick<GenerationLogInput,
    'status' | 'fileSizeBytes' | 'fileUrl' | 'storagePath' |
    'generationTimeMs' | 'errorCode' | 'errorMessage' | 'errorDetails'
  >>
): Promise<boolean> {
  try {
    const supabase = await createServerClient();

    const { error } = await (supabase as any)
      .from('generation_logs')
      .update({
        status: update.status,
        file_size_bytes: update.fileSizeBytes,
        file_url: update.fileUrl,
        storage_path: update.storagePath,
        generation_time_ms: update.generationTimeMs,
        error_code: update.errorCode,
        error_message: update.errorMessage,
        error_details: update.errorDetails,
        completed_at: new Date().toISOString(),
      })
      .eq('id', logId);

    if (error) {
      console.error('[GenerationLog] Failed to update log:', error);
      return false;
    }

    return true;
  } catch (error) {
    console.error('[GenerationLog] Error updating log:', error);
    return false;
  }
}

/**
 * 사용자의 생성 이력 조회
 */
export async function getUserGenerationHistory(
  userId: string,
  options?: {
    type?: GenerationType;
    limit?: number;
    offset?: number;
  }
): Promise<{
  logs: GenerationLogInput[];
  total: number;
}> {
  try {
    const supabase = await createServerClient();

    let query = (supabase as any)
      .from('generation_logs')
      .select('*', { count: 'exact' })
      .eq('user_id', userId)
      .order('created_at', { ascending: false });

    if (options?.type) {
      query = query.eq('generation_type', options.type);
    }

    if (options?.limit) {
      query = query.limit(options.limit);
    }

    if (options?.offset) {
      query = query.range(options.offset, options.offset + (options.limit || 10) - 1);
    }

    const { data, error, count } = await query;

    if (error) {
      console.error('[GenerationLog] Failed to get user history:', error);
      return { logs: [], total: 0 };
    }

    return {
      logs: data || [],
      total: count || 0,
    };
  } catch (error) {
    console.error('[GenerationLog] Error getting user history:', error);
    return { logs: [], total: 0 };
  }
}

/**
 * 일별 통계 조회 (관리자용)
 */
export async function getDailyStats(days: number = 7): Promise<{
  date: string;
  generation_type: string;
  total_requests: number;
  success_count: number;
  failed_count: number;
  success_rate: number;
}[]> {
  try {
    const supabase = await createServerClient();

    const { data, error } = await (supabase as any)
      .from('generation_stats_daily')
      .select('*')
      .gte('date', new Date(Date.now() - days * 24 * 60 * 60 * 1000).toISOString().split('T')[0])
      .order('date', { ascending: false });

    if (error) {
      console.error('[GenerationLog] Failed to get daily stats:', error);
      return [];
    }

    return (data || []).map((row: any) => ({
      ...row,
      success_rate: row.total_requests > 0
        ? Math.round((row.success_count / row.total_requests) * 100 * 100) / 100
        : 0,
    }));
  } catch (error) {
    console.error('[GenerationLog] Error getting daily stats:', error);
    return [];
  }
}

/**
 * 실시간 에러 조회 (관리자용)
 */
export async function getRecentErrors(limit: number = 20): Promise<{
  id: string;
  created_at: string;
  user_email: string;
  generation_type: string;
  error_code: string;
  error_message: string;
  analysis_id: string;
}[]> {
  try {
    const supabase = await createServerClient();

    const { data, error } = await (supabase as any)
      .from('generation_logs')
      .select('id, created_at, user_email, generation_type, error_code, error_message, analysis_id')
      .eq('status', 'failed')
      .order('created_at', { ascending: false })
      .limit(limit);

    if (error) {
      console.error('[GenerationLog] Failed to get recent errors:', error);
      return [];
    }

    return data || [];
  } catch (error) {
    console.error('[GenerationLog] Error getting recent errors:', error);
    return [];
  }
}

/**
 * 오늘의 통계 요약 (관리자용)
 */
export async function getTodayStats(): Promise<{
  pdf: { total: number; success: number; failed: number };
  audio: { total: number; success: number; failed: number };
  totalPointsCharged: number;
  uniqueUsers: number;
}> {
  try {
    const supabase = await createServerClient();

    const today = new Date().toISOString().split('T')[0];

    const { data, error } = await (supabase as any)
      .from('generation_logs')
      .select('generation_type, status, points_charged, user_id')
      .gte('created_at', today);

    if (error) {
      console.error('[GenerationLog] Failed to get today stats:', error);
      return {
        pdf: { total: 0, success: 0, failed: 0 },
        audio: { total: 0, success: 0, failed: 0 },
        totalPointsCharged: 0,
        uniqueUsers: 0,
      };
    }

    const logs = data || [];

    const pdfLogs = logs.filter((l: any) => l.generation_type === 'pdf');
    const audioLogs = logs.filter((l: any) => l.generation_type === 'audio');

    return {
      pdf: {
        total: pdfLogs.length,
        success: pdfLogs.filter((l: any) => l.status === 'success').length,
        failed: pdfLogs.filter((l: any) => l.status === 'failed').length,
      },
      audio: {
        total: audioLogs.length,
        success: audioLogs.filter((l: any) => l.status === 'success').length,
        failed: audioLogs.filter((l: any) => l.status === 'failed').length,
      },
      totalPointsCharged: logs.reduce((sum: number, l: any) => sum + (l.points_charged || 0), 0),
      uniqueUsers: new Set(logs.map((l: any) => l.user_id)).size,
    };
  } catch (error) {
    console.error('[GenerationLog] Error getting today stats:', error);
    return {
      pdf: { total: 0, success: 0, failed: 0 },
      audio: { total: 0, success: 0, failed: 0 },
      totalPointsCharged: 0,
      uniqueUsers: 0,
    };
  }
}
