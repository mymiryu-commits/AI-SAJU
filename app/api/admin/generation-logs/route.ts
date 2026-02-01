/**
 * 관리자 생성 로그 조회 API
 *
 * GET /api/admin/generation-logs - 로그 목록 및 통계 조회
 * GET /api/admin/generation-logs?type=stats - 오늘 통계
 * GET /api/admin/generation-logs?type=daily - 일별 통계
 * GET /api/admin/generation-logs?type=errors - 최근 에러
 * GET /api/admin/generation-logs?type=logs - 전체 로그 목록
 */

import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import {
  getTodayStats,
  getDailyStats,
  getRecentErrors,
} from '@/lib/services/generationLogService';

// 관리자 이메일 목록
const ADMIN_EMAILS = ['mymiryu@gmail.com'];

export async function GET(request: NextRequest) {
  try {
    const supabase = await createClient();

    // 사용자 확인
    const { data: { user }, error: authError } = await supabase.auth.getUser();
    if (authError || !user) {
      return NextResponse.json(
        { error: '로그인이 필요합니다.' },
        { status: 401 }
      );
    }

    // 관리자 권한 확인
    const isAdmin = user.email ? ADMIN_EMAILS.includes(user.email) : false;
    if (!isAdmin) {
      return NextResponse.json(
        { error: '관리자 권한이 필요합니다.' },
        { status: 403 }
      );
    }

    const { searchParams } = new URL(request.url);
    const type = searchParams.get('type') || 'all';
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '20');
    const days = parseInt(searchParams.get('days') || '7');

    switch (type) {
      case 'stats': {
        // 오늘 통계
        const todayStats = await getTodayStats();
        return NextResponse.json({
          success: true,
          data: todayStats
        });
      }

      case 'daily': {
        // 일별 통계
        const dailyStats = await getDailyStats(days);
        return NextResponse.json({
          success: true,
          data: dailyStats
        });
      }

      case 'errors': {
        // 최근 에러
        const recentErrors = await getRecentErrors(limit);
        return NextResponse.json({
          success: true,
          data: recentErrors
        });
      }

      case 'logs': {
        // 전체 로그 목록 (페이지네이션)
        const offset = (page - 1) * limit;
        const statusFilter = searchParams.get('status');
        const generationType = searchParams.get('generation_type');

        let query = (supabase as any)
          .from('generation_logs')
          .select('*', { count: 'exact' })
          .order('created_at', { ascending: false })
          .range(offset, offset + limit - 1);

        if (statusFilter) {
          query = query.eq('status', statusFilter);
        }

        if (generationType) {
          query = query.eq('generation_type', generationType);
        }

        const { data, error, count } = await query;

        if (error) {
          console.error('Error fetching logs:', error);
          return NextResponse.json(
            { error: '로그 조회에 실패했습니다.' },
            { status: 500 }
          );
        }

        return NextResponse.json({
          success: true,
          data: data || [],
          pagination: {
            page,
            limit,
            total: count || 0,
            totalPages: Math.ceil((count || 0) / limit)
          }
        });
      }

      case 'all':
      default: {
        // 모든 데이터 한 번에 조회
        const [todayStats, dailyStats, recentErrors] = await Promise.all([
          getTodayStats(),
          getDailyStats(7),
          getRecentErrors(10)
        ]);

        // 최근 로그 20개
        const { data: recentLogs } = await (supabase as any)
          .from('generation_logs')
          .select('*')
          .order('created_at', { ascending: false })
          .limit(20);

        return NextResponse.json({
          success: true,
          data: {
            today: todayStats,
            daily: dailyStats,
            errors: recentErrors,
            recentLogs: recentLogs || []
          }
        });
      }
    }
  } catch (error) {
    console.error('Generation logs API error:', error);
    return NextResponse.json(
      { error: '서버 오류가 발생했습니다.' },
      { status: 500 }
    );
  }
}
