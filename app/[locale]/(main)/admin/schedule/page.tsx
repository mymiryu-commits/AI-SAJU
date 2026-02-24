'use client';

import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import {
  CalendarCheck,
  Plus,
  Loader2,
  CheckCircle,
  AlertCircle,
  RefreshCw,
  Trash2,
  ExternalLink,
  Link as LinkIcon,
  Check,
  Circle,
  Edit2,
  X,
  Calendar,
  Flag,
} from 'lucide-react';

interface Schedule {
  id: string;
  title: string;
  description: string | null;
  link_url: string | null;
  link_label: string | null;
  is_completed: boolean;
  priority: number;
  due_date: string | null;
  created_by: string;
  created_at: string;
  updated_at: string;
  completed_at: string | null;
}

export default function AdminSchedulePage() {
  const [schedules, setSchedules] = useState<Schedule[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);
  const [isAdding, setIsAdding] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  // 새 스케줄 폼
  const [newSchedule, setNewSchedule] = useState({
    title: '',
    description: '',
    link_url: '',
    link_label: '',
    priority: 0,
    due_date: '',
  });

  // 수정 폼
  const [editSchedule, setEditSchedule] = useState({
    title: '',
    description: '',
    link_url: '',
    link_label: '',
    priority: 0,
    due_date: '',
  });

  const fetchSchedules = async () => {
    setIsLoading(true);
    try {
      const response = await fetch('/api/admin/schedule');
      const data = await response.json();

      if (data.success) {
        setSchedules(data.schedules);
      } else {
        setMessage({ type: 'error', text: data.error || '스케줄 목록을 불러올 수 없습니다.' });
      }
    } catch {
      setMessage({ type: 'error', text: '스케줄 목록 조회 중 오류가 발생했습니다.' });
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchSchedules();
  }, []);

  // 자동 메시지 제거
  useEffect(() => {
    if (message) {
      const timer = setTimeout(() => setMessage(null), 3000);
      return () => clearTimeout(timer);
    }
  }, [message]);

  const handleAdd = async () => {
    if (!newSchedule.title.trim()) {
      setMessage({ type: 'error', text: '제목을 입력해주세요.' });
      return;
    }

    setSubmitting(true);
    try {
      const response = await fetch('/api/admin/schedule', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newSchedule),
      });

      const data = await response.json();

      if (data.success) {
        setMessage({ type: 'success', text: '스케줄이 추가되었습니다.' });
        setNewSchedule({ title: '', description: '', link_url: '', link_label: '', priority: 0, due_date: '' });
        setIsAdding(false);
        await fetchSchedules();
      } else {
        setMessage({ type: 'error', text: data.error || '스케줄 추가 실패' });
      }
    } catch {
      setMessage({ type: 'error', text: '스케줄 추가 중 오류가 발생했습니다.' });
    } finally {
      setSubmitting(false);
    }
  };

  const handleToggleComplete = async (schedule: Schedule) => {
    try {
      const response = await fetch('/api/admin/schedule', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          id: schedule.id,
          is_completed: !schedule.is_completed,
        }),
      });

      const data = await response.json();

      if (data.success) {
        setSchedules(prev =>
          prev.map(s =>
            s.id === schedule.id ? { ...s, is_completed: !s.is_completed } : s
          )
        );
      }
    } catch {
      setMessage({ type: 'error', text: '상태 변경 중 오류가 발생했습니다.' });
    }
  };

  const handleEdit = (schedule: Schedule) => {
    setEditingId(schedule.id);
    setEditSchedule({
      title: schedule.title,
      description: schedule.description || '',
      link_url: schedule.link_url || '',
      link_label: schedule.link_label || '',
      priority: schedule.priority,
      due_date: schedule.due_date || '',
    });
  };

  const handleSaveEdit = async (id: string) => {
    if (!editSchedule.title.trim()) {
      setMessage({ type: 'error', text: '제목을 입력해주세요.' });
      return;
    }

    setSubmitting(true);
    try {
      const response = await fetch('/api/admin/schedule', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id, ...editSchedule }),
      });

      const data = await response.json();

      if (data.success) {
        setMessage({ type: 'success', text: '스케줄이 수정되었습니다.' });
        setEditingId(null);
        await fetchSchedules();
      } else {
        setMessage({ type: 'error', text: data.error || '스케줄 수정 실패' });
      }
    } catch {
      setMessage({ type: 'error', text: '스케줄 수정 중 오류가 발생했습니다.' });
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('정말 삭제하시겠습니까?')) return;

    try {
      const response = await fetch(`/api/admin/schedule?id=${id}`, {
        method: 'DELETE',
      });

      const data = await response.json();

      if (data.success) {
        setMessage({ type: 'success', text: '스케줄이 삭제되었습니다.' });
        setSchedules(prev => prev.filter(s => s.id !== id));
      } else {
        setMessage({ type: 'error', text: data.error || '스케줄 삭제 실패' });
      }
    } catch {
      setMessage({ type: 'error', text: '스케줄 삭제 중 오류가 발생했습니다.' });
    }
  };

  const formatDate = (dateString: string | null) => {
    if (!dateString) return '';
    return new Date(dateString).toLocaleDateString('ko-KR', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
  };

  const getPriorityColor = (priority: number) => {
    if (priority >= 3) return 'text-red-500';
    if (priority >= 2) return 'text-orange-500';
    if (priority >= 1) return 'text-yellow-500';
    return 'text-gray-400';
  };

  const incompleteCount = schedules.filter(s => !s.is_completed).length;
  const completedCount = schedules.filter(s => s.is_completed).length;

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-8 max-w-4xl">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-emerald-100 to-teal-100 dark:from-emerald-900/30 dark:to-teal-900/30 flex items-center justify-center">
              <CalendarCheck className="h-6 w-6 text-emerald-600 dark:text-emerald-400" />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-foreground">스케줄 관리</h1>
              <p className="text-muted-foreground text-sm">
                {incompleteCount}개 진행 중 / {completedCount}개 완료
              </p>
            </div>
          </div>
          <div className="flex gap-2">
            <Button
              variant="outline"
              onClick={fetchSchedules}
              disabled={isLoading}
            >
              <RefreshCw className={`h-4 w-4 mr-2 ${isLoading ? 'animate-spin' : ''}`} />
              새로고침
            </Button>
            <Button
              onClick={() => setIsAdding(true)}
              className="bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-600 hover:to-teal-600 text-white"
            >
              <Plus className="h-4 w-4 mr-2" />
              새 할일
            </Button>
          </div>
        </div>

        {/* Message */}
        {message && (
          <div className={`mb-6 p-4 rounded-xl flex items-center gap-3 ${
            message.type === 'success'
              ? 'bg-emerald-100 dark:bg-emerald-900/30 text-emerald-700 dark:text-emerald-300'
              : 'bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-300'
          }`}>
            {message.type === 'success' ? (
              <CheckCircle className="h-5 w-5" />
            ) : (
              <AlertCircle className="h-5 w-5" />
            )}
            <span className="text-sm font-medium">{message.text}</span>
          </div>
        )}

        {/* Add New Schedule Form */}
        {isAdding && (
          <div className="mb-6 bg-card border border-border rounded-2xl p-6">
            <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
              <Plus className="h-5 w-5 text-emerald-500" />
              새 할일 추가
            </h3>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-1">제목 *</label>
                <input
                  type="text"
                  value={newSchedule.title}
                  onChange={(e) => setNewSchedule(prev => ({ ...prev, title: e.target.value }))}
                  placeholder="할일 제목을 입력하세요"
                  className="w-full px-4 py-2 rounded-lg border border-border bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-emerald-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">설명</label>
                <textarea
                  value={newSchedule.description}
                  onChange={(e) => setNewSchedule(prev => ({ ...prev, description: e.target.value }))}
                  placeholder="상세 설명 (선택)"
                  rows={2}
                  className="w-full px-4 py-2 rounded-lg border border-border bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-emerald-500 resize-none"
                />
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium mb-1">
                    <LinkIcon className="h-4 w-4 inline mr-1" />
                    관련 URL
                  </label>
                  <input
                    type="url"
                    value={newSchedule.link_url}
                    onChange={(e) => setNewSchedule(prev => ({ ...prev, link_url: e.target.value }))}
                    placeholder="https://example.com"
                    className="w-full px-4 py-2 rounded-lg border border-border bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-emerald-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">링크 레이블</label>
                  <input
                    type="text"
                    value={newSchedule.link_label}
                    onChange={(e) => setNewSchedule(prev => ({ ...prev, link_label: e.target.value }))}
                    placeholder="사이트 바로가기"
                    className="w-full px-4 py-2 rounded-lg border border-border bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-emerald-500"
                  />
                </div>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium mb-1">
                    <Calendar className="h-4 w-4 inline mr-1" />
                    마감일
                  </label>
                  <input
                    type="date"
                    value={newSchedule.due_date}
                    onChange={(e) => setNewSchedule(prev => ({ ...prev, due_date: e.target.value }))}
                    className="w-full px-4 py-2 rounded-lg border border-border bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-emerald-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">
                    <Flag className="h-4 w-4 inline mr-1" />
                    우선순위
                  </label>
                  <select
                    value={newSchedule.priority}
                    onChange={(e) => setNewSchedule(prev => ({ ...prev, priority: parseInt(e.target.value) }))}
                    className="w-full px-4 py-2 rounded-lg border border-border bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-emerald-500"
                  >
                    <option value="0">보통</option>
                    <option value="1">낮음</option>
                    <option value="2">중간</option>
                    <option value="3">높음</option>
                  </select>
                </div>
              </div>
              <div className="flex gap-2 pt-2">
                <Button
                  onClick={handleAdd}
                  disabled={submitting}
                  className="bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-600 hover:to-teal-600 text-white"
                >
                  {submitting ? <Loader2 className="h-4 w-4 animate-spin mr-2" /> : <Plus className="h-4 w-4 mr-2" />}
                  추가
                </Button>
                <Button
                  variant="outline"
                  onClick={() => {
                    setIsAdding(false);
                    setNewSchedule({ title: '', description: '', link_url: '', link_label: '', priority: 0, due_date: '' });
                  }}
                >
                  취소
                </Button>
              </div>
            </div>
          </div>
        )}

        {/* Schedule List */}
        <div className="space-y-3">
          {schedules.length === 0 ? (
            <div className="bg-card border border-border rounded-2xl p-12 text-center">
              <CalendarCheck className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
              <p className="text-muted-foreground">등록된 스케줄이 없습니다.</p>
              <Button
                onClick={() => setIsAdding(true)}
                variant="outline"
                className="mt-4"
              >
                <Plus className="h-4 w-4 mr-2" />
                첫 번째 할일 추가하기
              </Button>
            </div>
          ) : (
            schedules.map(schedule => (
              <div
                key={schedule.id}
                className={`bg-card border border-border rounded-xl p-4 transition-all ${
                  schedule.is_completed ? 'opacity-60' : ''
                }`}
              >
                {editingId === schedule.id ? (
                  // 수정 모드
                  <div className="space-y-3">
                    <input
                      type="text"
                      value={editSchedule.title}
                      onChange={(e) => setEditSchedule(prev => ({ ...prev, title: e.target.value }))}
                      className="w-full px-3 py-2 rounded-lg border border-border bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-emerald-500"
                    />
                    <textarea
                      value={editSchedule.description}
                      onChange={(e) => setEditSchedule(prev => ({ ...prev, description: e.target.value }))}
                      placeholder="설명"
                      rows={2}
                      className="w-full px-3 py-2 rounded-lg border border-border bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-emerald-500 resize-none"
                    />
                    <div className="grid grid-cols-2 gap-2">
                      <input
                        type="url"
                        value={editSchedule.link_url}
                        onChange={(e) => setEditSchedule(prev => ({ ...prev, link_url: e.target.value }))}
                        placeholder="URL"
                        className="px-3 py-2 rounded-lg border border-border bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-emerald-500"
                      />
                      <input
                        type="text"
                        value={editSchedule.link_label}
                        onChange={(e) => setEditSchedule(prev => ({ ...prev, link_label: e.target.value }))}
                        placeholder="링크 레이블"
                        className="px-3 py-2 rounded-lg border border-border bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-emerald-500"
                      />
                    </div>
                    <div className="grid grid-cols-2 gap-2">
                      <input
                        type="date"
                        value={editSchedule.due_date}
                        onChange={(e) => setEditSchedule(prev => ({ ...prev, due_date: e.target.value }))}
                        className="px-3 py-2 rounded-lg border border-border bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-emerald-500"
                      />
                      <select
                        value={editSchedule.priority}
                        onChange={(e) => setEditSchedule(prev => ({ ...prev, priority: parseInt(e.target.value) }))}
                        className="px-3 py-2 rounded-lg border border-border bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-emerald-500"
                      >
                        <option value="0">보통</option>
                        <option value="1">낮음</option>
                        <option value="2">중간</option>
                        <option value="3">높음</option>
                      </select>
                    </div>
                    <div className="flex gap-2">
                      <Button
                        size="sm"
                        onClick={() => handleSaveEdit(schedule.id)}
                        disabled={submitting}
                        className="bg-emerald-500 hover:bg-emerald-600 text-white"
                      >
                        {submitting ? <Loader2 className="h-4 w-4 animate-spin" /> : <Check className="h-4 w-4" />}
                      </Button>
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => setEditingId(null)}
                      >
                        <X className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                ) : (
                  // 보기 모드
                  <div className="flex items-start gap-3">
                    {/* 체크 버튼 */}
                    <button
                      onClick={() => handleToggleComplete(schedule)}
                      className={`flex-shrink-0 w-6 h-6 rounded-full border-2 flex items-center justify-center transition-all mt-0.5 ${
                        schedule.is_completed
                          ? 'bg-emerald-500 border-emerald-500 text-white'
                          : 'border-gray-300 dark:border-gray-600 hover:border-emerald-400'
                      }`}
                    >
                      {schedule.is_completed ? (
                        <Check className="h-4 w-4" />
                      ) : (
                        <Circle className="h-4 w-4 opacity-0 group-hover:opacity-100" />
                      )}
                    </button>

                    {/* 내용 */}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2">
                        {schedule.priority > 0 && (
                          <Flag className={`h-4 w-4 ${getPriorityColor(schedule.priority)}`} />
                        )}
                        <span className={`font-medium ${schedule.is_completed ? 'line-through text-muted-foreground' : 'text-foreground'}`}>
                          {schedule.title}
                        </span>
                      </div>

                      {schedule.description && (
                        <p className="text-sm text-muted-foreground mt-1">{schedule.description}</p>
                      )}

                      <div className="flex flex-wrap items-center gap-3 mt-2">
                        {schedule.link_url && (
                          <a
                            href={schedule.link_url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex items-center gap-1 text-sm text-blue-600 dark:text-blue-400 hover:underline"
                          >
                            <ExternalLink className="h-3 w-3" />
                            {schedule.link_label || '링크 열기'}
                          </a>
                        )}

                        {schedule.due_date && (
                          <span className="text-xs text-muted-foreground flex items-center gap-1">
                            <Calendar className="h-3 w-3" />
                            {formatDate(schedule.due_date)}
                          </span>
                        )}
                      </div>
                    </div>

                    {/* 액션 버튼 */}
                    <div className="flex-shrink-0 flex gap-1">
                      <Button
                        size="sm"
                        variant="ghost"
                        onClick={() => handleEdit(schedule)}
                        className="h-8 w-8 p-0 hover:bg-secondary"
                      >
                        <Edit2 className="h-4 w-4 text-muted-foreground" />
                      </Button>
                      <Button
                        size="sm"
                        variant="ghost"
                        onClick={() => handleDelete(schedule.id)}
                        className="h-8 w-8 p-0 hover:bg-red-100 dark:hover:bg-red-900/30"
                      >
                        <Trash2 className="h-4 w-4 text-red-500" />
                      </Button>
                    </div>
                  </div>
                )}
              </div>
            ))
          )}
        </div>

        {/* Info */}
        <div className="mt-8 bg-emerald-50 dark:bg-emerald-950/20 border border-emerald-200 dark:border-emerald-800/30 rounded-xl p-5">
          <h3 className="font-semibold text-emerald-800 dark:text-emerald-300 mb-2">스케줄 관리 안내</h3>
          <ul className="text-sm text-emerald-700 dark:text-emerald-400 space-y-1">
            <li>- 체크 버튼을 클릭하여 완료/미완료 상태를 변경할 수 있습니다</li>
            <li>- URL을 입력하면 클릭 시 해당 사이트로 연결됩니다</li>
            <li>- 우선순위가 높은 항목이 상단에 표시됩니다</li>
            <li>- 완료된 항목은 하단으로 이동합니다</li>
          </ul>
        </div>
      </div>
    </div>
  );
}
