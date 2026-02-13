'use client';

import { useState, useEffect } from 'react';
import {
  Activity,
  FileText,
  Volume2,
  CheckCircle,
  XCircle,
  AlertTriangle,
  Clock,
  Users,
  Coins,
  TrendingUp,
  TrendingDown,
  RefreshCw,
  Loader2,
  ChevronLeft,
  ChevronRight,
  Filter,
  SkipForward,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Link } from '@/i18n/routing';

interface TodayStats {
  pdf: { total: number; success: number; failed: number };
  audio: { total: number; success: number; failed: number };
  totalPointsCharged: number;
  uniqueUsers: number;
}

interface DailyStat {
  date: string;
  generation_type: string;
  total_requests: number;
  success_count: number;
  failed_count: number;
  success_rate: number;
}

interface RecentError {
  id: string;
  created_at: string;
  user_email: string;
  generation_type: string;
  error_code: string;
  error_message: string;
  analysis_id: string;
}

interface GenerationLog {
  id: string;
  created_at: string;
  user_email: string;
  generation_type: string;
  status: string;
  tts_provider: string;
  file_size_bytes: number;
  points_charged: number;
  is_free_generation: boolean;
  free_reason: string;
  generation_time_ms: number;
  error_code: string;
  error_message: string;
}

export default function GenerationLogsPage() {
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [todayStats, setTodayStats] = useState<TodayStats | null>(null);
  const [dailyStats, setDailyStats] = useState<DailyStat[]>([]);
  const [recentErrors, setRecentErrors] = useState<RecentError[]>([]);
  const [recentLogs, setRecentLogs] = useState<GenerationLog[]>([]);

  // Pagination
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [statusFilter, setStatusFilter] = useState<string>('');
  const [typeFilter, setTypeFilter] = useState<string>('');

  const fetchData = async (showRefreshing = false) => {
    if (showRefreshing) setRefreshing(true);
    else setLoading(true);

    try {
      const response = await fetch('/api/admin/generation-logs?type=all');
      const result = await response.json();

      if (result.success) {
        setTodayStats(result.data.today);
        setDailyStats(result.data.daily);
        setRecentErrors(result.data.errors);
        setRecentLogs(result.data.recentLogs);
      }
    } catch (error) {
      console.error('Error fetching generation logs:', error);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  const fetchLogs = async () => {
    try {
      const params = new URLSearchParams({
        type: 'logs',
        page: page.toString(),
        limit: '20',
      });
      if (statusFilter) params.set('status', statusFilter);
      if (typeFilter) params.set('generation_type', typeFilter);

      const response = await fetch(`/api/admin/generation-logs?${params}`);
      const result = await response.json();

      if (result.success) {
        setRecentLogs(result.data);
        setTotalPages(result.pagination.totalPages);
      }
    } catch (error) {
      console.error('Error fetching logs:', error);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  useEffect(() => {
    if (!loading) {
      fetchLogs();
    }
  }, [page, statusFilter, typeFilter]);

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleString('ko-KR', {
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  const formatBytes = (bytes: number) => {
    if (!bytes) return '-';
    if (bytes < 1024) return `${bytes} B`;
    if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
    return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'success':
        return <CheckCircle className="h-4 w-4 text-green-500" />;
      case 'failed':
        return <XCircle className="h-4 w-4 text-red-500" />;
      case 'skipped':
        return <SkipForward className="h-4 w-4 text-blue-500" />;
      case 'started':
        return <Clock className="h-4 w-4 text-yellow-500" />;
      default:
        return <AlertTriangle className="h-4 w-4 text-gray-500" />;
    }
  };

  const getStatusLabel = (status: string) => {
    switch (status) {
      case 'success':
        return '성공';
      case 'failed':
        return '실패';
      case 'skipped':
        return '캐시';
      case 'started':
        return '진행중';
      default:
        return status;
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-8 max-w-7xl">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center gap-3">
            <Link href="/admin/settings">
              <Button variant="ghost" size="sm">
                <ChevronLeft className="h-4 w-4 mr-1" />
                설정
              </Button>
            </Link>
            <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-violet-100 to-purple-100 dark:from-violet-900/30 dark:to-purple-900/30 flex items-center justify-center">
              <Activity className="h-6 w-6 text-violet-600 dark:text-violet-400" />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-foreground">생성 로그 모니터링</h1>
              <p className="text-muted-foreground text-sm">PDF/MP3 생성 현황 및 에러 추적</p>
            </div>
          </div>
          <Button
            onClick={() => fetchData(true)}
            disabled={refreshing}
            variant="outline"
          >
            {refreshing ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : (
              <RefreshCw className="h-4 w-4" />
            )}
            <span className="ml-2">새로고침</span>
          </Button>
        </div>

        {/* Today Stats Cards */}
        {todayStats && (
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
            {/* PDF Stats */}
            <div className="bg-card border border-border rounded-xl p-4">
              <div className="flex items-center gap-2 mb-2">
                <FileText className="h-5 w-5 text-blue-500" />
                <span className="font-medium text-foreground">PDF 생성</span>
              </div>
              <div className="text-2xl font-bold text-foreground">{todayStats.pdf.total}</div>
              <div className="flex items-center gap-2 text-sm mt-1">
                <span className="text-green-600">{todayStats.pdf.success} 성공</span>
                <span className="text-muted-foreground">|</span>
                <span className="text-red-600">{todayStats.pdf.failed} 실패</span>
              </div>
            </div>

            {/* Audio Stats */}
            <div className="bg-card border border-border rounded-xl p-4">
              <div className="flex items-center gap-2 mb-2">
                <Volume2 className="h-5 w-5 text-purple-500" />
                <span className="font-medium text-foreground">음성 생성</span>
              </div>
              <div className="text-2xl font-bold text-foreground">{todayStats.audio.total}</div>
              <div className="flex items-center gap-2 text-sm mt-1">
                <span className="text-green-600">{todayStats.audio.success} 성공</span>
                <span className="text-muted-foreground">|</span>
                <span className="text-red-600">{todayStats.audio.failed} 실패</span>
              </div>
            </div>

            {/* Points */}
            <div className="bg-card border border-border rounded-xl p-4">
              <div className="flex items-center gap-2 mb-2">
                <Coins className="h-5 w-5 text-amber-500" />
                <span className="font-medium text-foreground">포인트 소비</span>
              </div>
              <div className="text-2xl font-bold text-foreground">{todayStats.totalPointsCharged.toLocaleString()}</div>
              <p className="text-sm text-muted-foreground mt-1">오늘 사용된 포인트</p>
            </div>

            {/* Users */}
            <div className="bg-card border border-border rounded-xl p-4">
              <div className="flex items-center gap-2 mb-2">
                <Users className="h-5 w-5 text-cyan-500" />
                <span className="font-medium text-foreground">활성 사용자</span>
              </div>
              <div className="text-2xl font-bold text-foreground">{todayStats.uniqueUsers}</div>
              <p className="text-sm text-muted-foreground mt-1">오늘 생성한 사용자</p>
            </div>
          </div>
        )}

        <div className="grid md:grid-cols-2 gap-6">
          {/* Daily Stats */}
          <div className="bg-card border border-border rounded-xl p-6">
            <h2 className="text-lg font-bold text-foreground mb-4 flex items-center gap-2">
              <TrendingUp className="h-5 w-5 text-green-500" />
              일별 통계 (7일)
            </h2>
            <div className="space-y-3">
              {dailyStats.length === 0 ? (
                <p className="text-muted-foreground text-sm">데이터가 없습니다.</p>
              ) : (
                dailyStats.slice(0, 10).map((stat, index) => (
                  <div
                    key={`${stat.date}-${stat.generation_type}-${index}`}
                    className="flex items-center justify-between p-3 rounded-lg bg-secondary/50"
                  >
                    <div className="flex items-center gap-3">
                      {stat.generation_type === 'pdf' ? (
                        <FileText className="h-4 w-4 text-blue-500" />
                      ) : (
                        <Volume2 className="h-4 w-4 text-purple-500" />
                      )}
                      <div>
                        <span className="font-medium text-foreground text-sm">
                          {new Date(stat.date).toLocaleDateString('ko-KR', { month: 'short', day: 'numeric' })}
                        </span>
                        <span className="text-muted-foreground text-xs ml-2">
                          ({stat.generation_type.toUpperCase()})
                        </span>
                      </div>
                    </div>
                    <div className="flex items-center gap-4 text-sm">
                      <span className="text-foreground">{stat.total_requests}건</span>
                      <span className={`font-medium ${stat.success_rate >= 95 ? 'text-green-600' : stat.success_rate >= 80 ? 'text-yellow-600' : 'text-red-600'}`}>
                        {stat.success_rate}%
                      </span>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>

          {/* Recent Errors */}
          <div className="bg-card border border-border rounded-xl p-6">
            <h2 className="text-lg font-bold text-foreground mb-4 flex items-center gap-2">
              <AlertTriangle className="h-5 w-5 text-red-500" />
              최근 에러
            </h2>
            <div className="space-y-3 max-h-[400px] overflow-y-auto">
              {recentErrors.length === 0 ? (
                <div className="text-center py-8">
                  <CheckCircle className="h-12 w-12 text-green-500 mx-auto mb-2" />
                  <p className="text-muted-foreground text-sm">에러가 없습니다!</p>
                </div>
              ) : (
                recentErrors.map((error) => (
                  <div
                    key={error.id}
                    className="p-3 rounded-lg bg-red-50 dark:bg-red-950/20 border border-red-200 dark:border-red-800/30"
                  >
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-xs text-red-600 dark:text-red-400 font-mono">
                        {error.error_code}
                      </span>
                      <span className="text-xs text-muted-foreground">
                        {formatDate(error.created_at)}
                      </span>
                    </div>
                    <p className="text-sm text-red-700 dark:text-red-300 line-clamp-2">
                      {error.error_message}
                    </p>
                    <div className="flex items-center gap-2 mt-2 text-xs text-muted-foreground">
                      <span>{error.user_email || '익명'}</span>
                      <span>|</span>
                      <span>{error.generation_type.toUpperCase()}</span>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>

        {/* Recent Logs Table */}
        <div className="mt-8 bg-card border border-border rounded-xl p-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-bold text-foreground">전체 로그</h2>
            <div className="flex items-center gap-2">
              <Filter className="h-4 w-4 text-muted-foreground" />
              <select
                value={statusFilter}
                onChange={(e) => { setStatusFilter(e.target.value); setPage(1); }}
                className="px-3 py-1.5 rounded-lg border border-border bg-background text-sm"
              >
                <option value="">모든 상태</option>
                <option value="success">성공</option>
                <option value="failed">실패</option>
                <option value="skipped">캐시</option>
                <option value="started">진행중</option>
              </select>
              <select
                value={typeFilter}
                onChange={(e) => { setTypeFilter(e.target.value); setPage(1); }}
                className="px-3 py-1.5 rounded-lg border border-border bg-background text-sm"
              >
                <option value="">모든 타입</option>
                <option value="pdf">PDF</option>
                <option value="audio">Audio</option>
              </select>
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-border">
                  <th className="text-left py-3 px-2 text-sm font-medium text-muted-foreground">상태</th>
                  <th className="text-left py-3 px-2 text-sm font-medium text-muted-foreground">타입</th>
                  <th className="text-left py-3 px-2 text-sm font-medium text-muted-foreground">사용자</th>
                  <th className="text-left py-3 px-2 text-sm font-medium text-muted-foreground">TTS</th>
                  <th className="text-left py-3 px-2 text-sm font-medium text-muted-foreground">크기</th>
                  <th className="text-left py-3 px-2 text-sm font-medium text-muted-foreground">포인트</th>
                  <th className="text-left py-3 px-2 text-sm font-medium text-muted-foreground">소요시간</th>
                  <th className="text-left py-3 px-2 text-sm font-medium text-muted-foreground">시간</th>
                </tr>
              </thead>
              <tbody>
                {recentLogs.map((log) => (
                  <tr key={log.id} className="border-b border-border/50 hover:bg-secondary/30">
                    <td className="py-3 px-2">
                      <div className="flex items-center gap-1.5">
                        {getStatusIcon(log.status)}
                        <span className="text-sm">{getStatusLabel(log.status)}</span>
                      </div>
                    </td>
                    <td className="py-3 px-2">
                      <div className="flex items-center gap-1">
                        {log.generation_type === 'pdf' ? (
                          <FileText className="h-4 w-4 text-blue-500" />
                        ) : (
                          <Volume2 className="h-4 w-4 text-purple-500" />
                        )}
                        <span className="text-sm uppercase">{log.generation_type}</span>
                      </div>
                    </td>
                    <td className="py-3 px-2">
                      <span className="text-sm text-muted-foreground truncate max-w-[150px] block">
                        {log.user_email || '-'}
                      </span>
                    </td>
                    <td className="py-3 px-2">
                      <span className="text-sm text-muted-foreground">
                        {log.tts_provider || '-'}
                      </span>
                    </td>
                    <td className="py-3 px-2">
                      <span className="text-sm text-muted-foreground">
                        {formatBytes(log.file_size_bytes)}
                      </span>
                    </td>
                    <td className="py-3 px-2">
                      {log.is_free_generation ? (
                        <span className="text-xs px-2 py-0.5 rounded-full bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400">
                          무료
                        </span>
                      ) : (
                        <span className="text-sm text-amber-600">{log.points_charged || 0}</span>
                      )}
                    </td>
                    <td className="py-3 px-2">
                      <span className="text-sm text-muted-foreground">
                        {log.generation_time_ms ? `${(log.generation_time_ms / 1000).toFixed(1)}초` : '-'}
                      </span>
                    </td>
                    <td className="py-3 px-2">
                      <span className="text-sm text-muted-foreground">
                        {formatDate(log.created_at)}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Pagination */}
          <div className="flex items-center justify-between mt-4 pt-4 border-t border-border">
            <span className="text-sm text-muted-foreground">
              페이지 {page} / {totalPages}
            </span>
            <div className="flex items-center gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setPage(p => Math.max(1, p - 1))}
                disabled={page === 1}
              >
                <ChevronLeft className="h-4 w-4" />
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={() => setPage(p => Math.min(totalPages, p + 1))}
                disabled={page === totalPages}
              >
                <ChevronRight className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </div>

        {/* Info Box */}
        <div className="mt-6 bg-violet-50 dark:bg-violet-950/20 border border-violet-200 dark:border-violet-800/30 rounded-xl p-5">
          <h3 className="font-semibold text-violet-800 dark:text-violet-300 mb-2">로그 정보</h3>
          <ul className="text-sm text-violet-700 dark:text-violet-400 space-y-1">
            <li>• <strong>성공:</strong> 파일 생성이 정상적으로 완료됨</li>
            <li>• <strong>캐시:</strong> 이미 저장된 파일을 재사용 (비용 절감)</li>
            <li>• <strong>실패:</strong> 생성 중 오류 발생</li>
            <li>• <strong>무료:</strong> 관리자, 프리미엄 구독자, 또는 프리미엄 분석</li>
            <li>• 로그는 90일 후 자동 삭제됩니다</li>
          </ul>
        </div>
      </div>
    </div>
  );
}
