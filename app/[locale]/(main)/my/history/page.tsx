'use client';

import { useState, useEffect } from 'react';
import { useTranslations } from 'next-intl';
import { Link } from '@/i18n/routing';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';
import {
  History,
  Calendar,
  Star,
  Heart,
  Sparkles,
  Eye,
  Download,
  Trash2,
  ChevronRight,
  Clock,
  Filter,
  Users,
  Compass,
  Sun,
  Moon,
  Share2,
  Search,
  Loader2,
  AlertCircle,
} from 'lucide-react';
import { Input } from '@/components/ui/input';
import { useAuth } from '@/lib/hooks/useAuth';

interface HistoryItem {
  id: string;
  type: string;
  subtype?: string;
  title: string;
  subtitle: string;
  date: string;
  isPremium: boolean;
  result: {
    summary: string;
    score: number;
  };
  saved: boolean;
  hasPdf: boolean;
  hasAudio: boolean;
  pdfUrl?: string | null;
  audioUrl?: string | null;
  canDownload: boolean;
  daysUntilExpire: number;
  downloadExpiresAt: string;
}

interface Stats {
  totalAnalyses: number;
  savedCount: number;
  premiumCount: number;
  averageScore: number;
}

const typeIcons: Record<string, typeof Star> = {
  saju: Sparkles,
  daily: Sun,
  compatibility: Heart,
  tarot: Moon,
  integrated: Compass,
  face: Eye,
  group: Users,
  yearly: Calendar,
  monthly: Calendar,
};

const typeLabels: Record<string, string> = {
  saju: '사주',
  daily: '일일 운세',
  compatibility: '궁합',
  tarot: '타로',
  integrated: '통합 분석',
  face: '관상',
  group: '그룹',
  yearly: '연간 운세',
  monthly: '월간 운세',
};

const typeColors: Record<string, string> = {
  saju: 'text-purple-500 bg-purple-100 dark:bg-purple-900/30',
  daily: 'text-green-500 bg-green-100 dark:bg-green-900/30',
  compatibility: 'text-pink-500 bg-pink-100 dark:bg-pink-900/30',
  tarot: 'text-indigo-500 bg-indigo-100 dark:bg-indigo-900/30',
  integrated: 'text-blue-500 bg-blue-100 dark:bg-blue-900/30',
  face: 'text-orange-500 bg-orange-100 dark:bg-orange-900/30',
  group: 'text-teal-500 bg-teal-100 dark:bg-teal-900/30',
  yearly: 'text-amber-500 bg-amber-100 dark:bg-amber-900/30',
  monthly: 'text-cyan-500 bg-cyan-100 dark:bg-cyan-900/30',
};

export default function HistoryPage() {
  const t = useTranslations();
  const { user, isLoading: authLoading } = useAuth();
  const [selectedType, setSelectedType] = useState<string>('all');
  const [sortBy, setSortBy] = useState<string>('date');
  const [searchQuery, setSearchQuery] = useState('');
  const [historyItems, setHistoryItems] = useState<HistoryItem[]>([]);
  const [stats, setStats] = useState<Stats | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);

  // 데이터 로딩
  useEffect(() => {
    if (!authLoading && user) {
      fetchHistory();
    } else if (!authLoading && !user) {
      setIsLoading(false);
    }
  }, [user, authLoading]);

  const fetchHistory = async () => {
    try {
      setIsLoading(true);
      setError(null);

      const response = await fetch('/api/my/history');
      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || '히스토리를 불러오는데 실패했습니다.');
      }

      setHistoryItems(data.items || []);
      setStats(data.stats || null);
    } catch (err) {
      console.error('Fetch history error:', err);
      setError(err instanceof Error ? err.message : '오류가 발생했습니다.');
    } finally {
      setIsLoading(false);
    }
  };

  // 저장 토글
  const handleToggleSave = async (id: string, currentSaved: boolean) => {
    try {
      const response = await fetch('/api/my/history', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id, saved: !currentSaved }),
      });

      if (response.ok) {
        setHistoryItems(items =>
          items.map(item =>
            item.id === id ? { ...item, saved: !currentSaved } : item
          )
        );
      }
    } catch (err) {
      console.error('Toggle save error:', err);
    }
  };

  // 삭제
  const handleDelete = async () => {
    if (!deleteId) return;

    try {
      setIsDeleting(true);
      const response = await fetch(`/api/my/history?id=${deleteId}`, {
        method: 'DELETE',
      });

      if (response.ok) {
        setHistoryItems(items => items.filter(item => item.id !== deleteId));
        setDeleteId(null);
      }
    } catch (err) {
      console.error('Delete error:', err);
    } finally {
      setIsDeleting(false);
    }
  };

  // 다운로드
  const handleDownload = async (item: HistoryItem, type: 'pdf' | 'audio') => {
    if (!item.canDownload) {
      alert('다운로드 기간이 만료되었습니다. (최대 45일)');
      return;
    }

    const url = type === 'pdf' ? item.pdfUrl : item.audioUrl;
    if (url) {
      window.open(url, '_blank');
    }
  };

  // 필터링 및 정렬
  const filteredHistory = historyItems
    .filter((item) => selectedType === 'all' || item.type === selectedType)
    .filter((item) =>
      searchQuery === '' ||
      item.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.subtitle.toLowerCase().includes(searchQuery.toLowerCase())
    );

  const sortedHistory = [...filteredHistory].sort((a, b) => {
    if (sortBy === 'date') {
      return new Date(b.date).getTime() - new Date(a.date).getTime();
    }
    if (sortBy === 'score') {
      return (b.result.score || 0) - (a.result.score || 0);
    }
    return 0;
  });

  const savedAnalyses = historyItems.filter((item) => item.saved);

  // 로그인 필요 화면
  if (!authLoading && !user) {
    return (
      <div className="space-y-6">
        <Card className="p-8 text-center">
          <AlertCircle className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
          <h3 className="font-semibold mb-2">로그인이 필요합니다</h3>
          <p className="text-muted-foreground mb-4">
            운세 히스토리를 확인하려면 로그인해주세요
          </p>
          <Link href="/auth/login">
            <Button>로그인하기</Button>
          </Link>
        </Card>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold mb-2">내 운세 히스토리</h1>
        <p className="text-muted-foreground">
          지난 운세 결과를 확인하고 저장된 분석을 관리하세요
        </p>
      </div>

      {/* Loading State */}
      {isLoading && (
        <Card className="p-8 text-center">
          <Loader2 className="h-8 w-8 mx-auto mb-4 animate-spin text-primary" />
          <p className="text-muted-foreground">히스토리를 불러오는 중...</p>
        </Card>
      )}

      {/* Error State */}
      {error && (
        <Card className="p-8 text-center border-red-200 bg-red-50 dark:bg-red-950/20">
          <AlertCircle className="h-12 w-12 mx-auto mb-4 text-red-500" />
          <h3 className="font-semibold mb-2 text-red-700 dark:text-red-400">{error}</h3>
          <Button variant="outline" onClick={fetchHistory}>
            다시 시도
          </Button>
        </Card>
      )}

      {/* Content */}
      {!isLoading && !error && (
        <>
          {/* Tabs */}
          <Tabs defaultValue="history" className="space-y-4">
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="history" className="gap-1">
                <History className="h-4 w-4" />
                전체 기록 ({historyItems.length})
              </TabsTrigger>
              <TabsTrigger value="saved" className="gap-1">
                <Star className="h-4 w-4" />
                저장됨 ({savedAnalyses.length})
              </TabsTrigger>
            </TabsList>

            {/* History Tab */}
            <TabsContent value="history" className="space-y-4">
              {/* Filters */}
              <div className="flex flex-col sm:flex-row items-start sm:items-center gap-2">
                <div className="relative flex-1 w-full sm:w-auto">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input
                    placeholder="검색..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="pl-9"
                  />
                </div>
                <div className="flex gap-2 w-full sm:w-auto">
                  <Select value={selectedType} onValueChange={setSelectedType}>
                    <SelectTrigger className="w-full sm:w-[140px]">
                      <Filter className="h-4 w-4 mr-2" />
                      <SelectValue placeholder="유형" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">전체</SelectItem>
                      <SelectItem value="saju">사주</SelectItem>
                      <SelectItem value="daily">일일 운세</SelectItem>
                      <SelectItem value="compatibility">궁합</SelectItem>
                      <SelectItem value="tarot">타로</SelectItem>
                      <SelectItem value="integrated">통합 분석</SelectItem>
                      <SelectItem value="face">관상</SelectItem>
                    </SelectContent>
                  </Select>
                  <Select value={sortBy} onValueChange={setSortBy}>
                    <SelectTrigger className="w-full sm:w-[120px]">
                      <SelectValue placeholder="정렬" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="date">최신순</SelectItem>
                      <SelectItem value="score">점수순</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              {/* History List */}
              <div className="space-y-3">
                {sortedHistory.map((item) => {
                  const Icon = typeIcons[item.type] || Star;
                  const colorClass = typeColors[item.type] || '';
                  return (
                    <Card key={item.id} className="overflow-hidden hover:shadow-md transition-shadow">
                      <CardContent className="p-4">
                        <div className="flex items-start justify-between gap-4">
                          <div className="flex items-start gap-3 flex-1 min-w-0">
                            <div className={`p-2 rounded-lg shrink-0 ${colorClass}`}>
                              <Icon className="h-5 w-5" />
                            </div>
                            <div className="flex-1 min-w-0">
                              <div className="flex items-center gap-2 mb-1 flex-wrap">
                                <h3 className="font-semibold">{item.title}</h3>
                                {item.isPremium && (
                                  <Badge variant="secondary" className="text-xs">
                                    프리미엄
                                  </Badge>
                                )}
                                <button
                                  onClick={() => handleToggleSave(item.id, item.saved)}
                                  className="p-0.5 hover:bg-muted rounded"
                                >
                                  <Star className={`h-4 w-4 ${item.saved ? 'text-yellow-500 fill-yellow-500' : 'text-muted-foreground'}`} />
                                </button>
                              </div>
                              <p className="text-sm text-muted-foreground mb-2">
                                {item.subtitle}
                              </p>
                              {item.result.summary && (
                                <p className="text-sm line-clamp-2 text-muted-foreground">
                                  {item.result.summary}
                                </p>
                              )}
                              <div className="flex items-center gap-4 mt-2 text-xs text-muted-foreground flex-wrap">
                                <span className="flex items-center gap-1">
                                  <Calendar className="h-3 w-3" />
                                  {new Date(item.date).toLocaleDateString('ko-KR')}
                                </span>
                                {item.result.score > 0 && (
                                  <span className="flex items-center gap-1">
                                    <Sparkles className="h-3 w-3" />
                                    점수 {item.result.score}점
                                  </span>
                                )}
                                {!item.canDownload && (item.hasPdf || item.hasAudio) && (
                                  <span className="flex items-center gap-1 text-orange-500">
                                    <Clock className="h-3 w-3" />
                                    다운로드 만료됨
                                  </span>
                                )}
                                {item.canDownload && item.daysUntilExpire <= 7 && (item.hasPdf || item.hasAudio) && (
                                  <span className="flex items-center gap-1 text-orange-500">
                                    <Clock className="h-3 w-3" />
                                    D-{item.daysUntilExpire} 다운로드 만료
                                  </span>
                                )}
                              </div>
                            </div>
                          </div>
                          <div className="flex items-center gap-1 shrink-0">
                            <Link href={`/fortune/result/${item.id}`}>
                              <Button variant="ghost" size="icon">
                                <Eye className="h-4 w-4" />
                              </Button>
                            </Link>
                            {item.hasPdf && (
                              <Button
                                variant="ghost"
                                size="icon"
                                onClick={() => handleDownload(item, 'pdf')}
                                disabled={!item.canDownload}
                                title={item.canDownload ? 'PDF 다운로드' : '다운로드 기간 만료'}
                              >
                                <Download className={`h-4 w-4 ${!item.canDownload ? 'text-muted-foreground' : ''}`} />
                              </Button>
                            )}
                            <Button
                              variant="ghost"
                              size="icon"
                              className="text-red-500 hover:text-red-600"
                              onClick={() => setDeleteId(item.id)}
                            >
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  );
                })}
              </div>

              {sortedHistory.length === 0 && (
                <Card className="p-8 text-center">
                  <History className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
                  <h3 className="font-semibold mb-2">
                    {searchQuery ? '검색 결과가 없습니다' : '아직 기록이 없습니다'}
                  </h3>
                  <p className="text-muted-foreground mb-4">
                    {searchQuery
                      ? '다른 검색어로 시도해보세요'
                      : '운세를 확인하면 여기에 기록됩니다'}
                  </p>
                  {!searchQuery && (
                    <Link href="/fortune">
                      <Button>
                        운세 보러가기
                        <ChevronRight className="ml-1 h-4 w-4" />
                      </Button>
                    </Link>
                  )}
                </Card>
              )}
            </TabsContent>

            {/* Saved Tab */}
            <TabsContent value="saved" className="space-y-4">
              <div className="space-y-3">
                {savedAnalyses.map((item) => {
                  const Icon = typeIcons[item.type] || Star;
                  const colorClass = typeColors[item.type] || '';
                  return (
                    <Card key={item.id} className="overflow-hidden hover:shadow-md transition-shadow">
                      <CardContent className="p-4">
                        <div className="flex items-start justify-between gap-4">
                          <div className="flex items-start gap-3 flex-1">
                            <div className={`p-2 rounded-lg shrink-0 ${colorClass}`}>
                              <Icon className="h-5 w-5" />
                            </div>
                            <div className="flex-1">
                              <div className="flex items-center gap-2 mb-1">
                                <h3 className="font-semibold">{item.title}</h3>
                                <Badge variant="outline" className="text-xs">
                                  {typeLabels[item.type]}
                                </Badge>
                              </div>
                              <p className="text-sm text-muted-foreground">
                                {item.subtitle}
                              </p>
                              <div className="flex items-center gap-4 mt-2 text-xs text-muted-foreground">
                                <span className="flex items-center gap-1">
                                  <Calendar className="h-3 w-3" />
                                  {new Date(item.date).toLocaleDateString('ko-KR')}
                                </span>
                                {item.result.score > 0 && (
                                  <Badge variant="secondary" className="text-xs">
                                    {item.result.score}점
                                  </Badge>
                                )}
                              </div>
                            </div>
                          </div>
                          <div className="flex items-center gap-1 shrink-0">
                            <Link href={`/fortune/result/${item.id}`}>
                              <Button variant="ghost" size="icon">
                                <Eye className="h-4 w-4" />
                              </Button>
                            </Link>
                            <Button
                              variant="ghost"
                              size="icon"
                              onClick={() => handleToggleSave(item.id, item.saved)}
                            >
                              <Star className="h-4 w-4 text-yellow-500 fill-yellow-500" />
                            </Button>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  );
                })}
              </div>

              {savedAnalyses.length === 0 && (
                <Card className="p-8 text-center">
                  <Star className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
                  <h3 className="font-semibold mb-2">저장된 분석이 없습니다</h3>
                  <p className="text-muted-foreground">
                    마음에 드는 분석 결과를 저장해보세요
                  </p>
                </Card>
              )}
            </TabsContent>
          </Tabs>

          {/* Stats Summary */}
          {stats && historyItems.length > 0 && (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Clock className="h-5 w-5 text-primary" />
                  이용 통계
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  <div className="text-center p-4 rounded-lg bg-muted/50">
                    <div className="text-2xl font-bold text-primary">
                      {stats.totalAnalyses}
                    </div>
                    <div className="text-sm text-muted-foreground">전체 분석</div>
                  </div>
                  <div className="text-center p-4 rounded-lg bg-muted/50">
                    <div className="text-2xl font-bold text-primary">
                      {stats.savedCount}
                    </div>
                    <div className="text-sm text-muted-foreground">저장됨</div>
                  </div>
                  <div className="text-center p-4 rounded-lg bg-muted/50">
                    <div className="text-2xl font-bold text-primary">
                      {stats.premiumCount}
                    </div>
                    <div className="text-sm text-muted-foreground">프리미엄</div>
                  </div>
                  <div className="text-center p-4 rounded-lg bg-muted/50">
                    <div className="text-2xl font-bold text-primary">
                      {stats.averageScore || '-'}
                    </div>
                    <div className="text-sm text-muted-foreground">평균 점수</div>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Download Notice */}
          <Card className="bg-amber-50 dark:bg-amber-950/20 border-amber-200">
            <CardContent className="p-4">
              <div className="flex items-start gap-3">
                <Clock className="h-5 w-5 text-amber-600 mt-0.5" />
                <div>
                  <h4 className="font-medium text-amber-800 dark:text-amber-200">다운로드 안내</h4>
                  <p className="text-sm text-amber-700 dark:text-amber-300">
                    PDF와 음성 파일은 분석일로부터 45일 동안 다운로드 가능합니다.
                    중요한 결과는 미리 저장해주세요.
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </>
      )}

      {/* Delete Confirmation Dialog */}
      <AlertDialog open={!!deleteId} onOpenChange={() => setDeleteId(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>분석 결과를 삭제하시겠습니까?</AlertDialogTitle>
            <AlertDialogDescription>
              이 작업은 되돌릴 수 없습니다. 분석 결과와 관련 파일이 영구적으로 삭제됩니다.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={isDeleting}>취소</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDelete}
              disabled={isDeleting}
              className="bg-red-500 hover:bg-red-600"
            >
              {isDeleting ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  삭제 중...
                </>
              ) : (
                '삭제'
              )}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
