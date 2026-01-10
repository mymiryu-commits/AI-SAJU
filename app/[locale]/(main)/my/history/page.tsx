'use client';

import { useState } from 'react';
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
} from 'lucide-react';
import { Input } from '@/components/ui/input';

// Mock data for fortune history
const historyItems = [
  {
    id: '1',
    type: 'saju',
    title: '사주 분석',
    subtitle: '2024년 종합 운세',
    date: '2024-12-15',
    isPremium: true,
    result: {
      summary: '전반적으로 좋은 기운이 감도는 해입니다. 특히 재물운과 건강운이 상승세에 있으며...',
      score: 85,
    },
    saved: true,
    hasPdf: true,
  },
  {
    id: '2',
    type: 'daily',
    title: '오늘의 운세',
    subtitle: '2024년 12월 14일',
    date: '2024-12-14',
    isPremium: false,
    result: {
      summary: '새로운 만남이 기대되는 하루입니다. 대인관계에서 좋은 소식이...',
      score: 78,
    },
    saved: false,
    hasPdf: false,
  },
  {
    id: '3',
    type: 'compatibility',
    title: '궁합 분석',
    subtitle: '나 ♥ 배우자',
    date: '2024-12-10',
    isPremium: true,
    result: {
      summary: '서로 보완하는 좋은 궁합입니다. 음양의 조화가 잘 맞아...',
      score: 92,
    },
    saved: true,
    hasPdf: true,
  },
  {
    id: '4',
    type: 'tarot',
    title: '타로 상담',
    subtitle: '연애운 3카드 스프레드',
    date: '2024-12-08',
    isPremium: false,
    result: {
      summary: '현재 관계에 대한 새로운 관점이 필요합니다. 과거를 돌아보며...',
      score: 0,
    },
    saved: true,
    hasPdf: false,
  },
  {
    id: '5',
    type: 'integrated',
    title: '통합 분석',
    subtitle: '동양 + 서양 + AI',
    date: '2024-12-05',
    isPremium: true,
    result: {
      summary: '종합적인 분석 결과, 12월은 성장의 시기입니다. 사주와 별자리 모두...',
      score: 88,
    },
    saved: true,
    hasPdf: true,
  },
  {
    id: '6',
    type: 'face',
    title: '관상 분석',
    subtitle: 'AI 얼굴 분석',
    date: '2024-12-01',
    isPremium: true,
    result: {
      summary: '이마의 형태와 눈썹의 위치로 볼 때 리더십이 뛰어난 상입니다...',
      score: 81,
    },
    saved: false,
    hasPdf: true,
  },
];

const typeIcons: Record<string, typeof Star> = {
  saju: Sparkles,
  daily: Sun,
  compatibility: Heart,
  tarot: Moon,
  integrated: Compass,
  face: Eye,
  group: Users,
};

const typeLabels: Record<string, string> = {
  saju: '사주',
  daily: '일일 운세',
  compatibility: '궁합',
  tarot: '타로',
  integrated: '통합 분석',
  face: '관상',
  group: '그룹',
};

const typeColors: Record<string, string> = {
  saju: 'text-purple-500 bg-purple-100 dark:bg-purple-900/30',
  daily: 'text-green-500 bg-green-100 dark:bg-green-900/30',
  compatibility: 'text-pink-500 bg-pink-100 dark:bg-pink-900/30',
  tarot: 'text-indigo-500 bg-indigo-100 dark:bg-indigo-900/30',
  integrated: 'text-blue-500 bg-blue-100 dark:bg-blue-900/30',
  face: 'text-orange-500 bg-orange-100 dark:bg-orange-900/30',
  group: 'text-teal-500 bg-teal-100 dark:bg-teal-900/30',
};

// Mock data for saved analyses
const savedAnalyses = historyItems.filter((item) => item.saved);

// Mock data for shared with me
const sharedWithMe = [
  {
    id: 's1',
    type: 'saju',
    title: '가족 사주 분석',
    sharedBy: '배우자',
    date: '2024-12-12',
    members: ['나', '배우자', '아들', '딸'],
  },
  {
    id: 's2',
    type: 'compatibility',
    title: '팀 궁합 분석',
    sharedBy: '팀장님',
    date: '2024-12-01',
    members: ['팀장님', '나', '동기'],
  },
];

export default function HistoryPage() {
  const t = useTranslations();
  const [selectedType, setSelectedType] = useState<string>('all');
  const [sortBy, setSortBy] = useState<string>('date');
  const [searchQuery, setSearchQuery] = useState('');

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

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold mb-2">내 운세 히스토리</h1>
        <p className="text-muted-foreground">
          지난 운세 결과를 확인하고 저장된 분석을 관리하세요
        </p>
      </div>

      {/* Tabs */}
      <Tabs defaultValue="history" className="space-y-4">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="history" className="gap-1">
            <History className="h-4 w-4" />
            전체 기록
          </TabsTrigger>
          <TabsTrigger value="saved" className="gap-1">
            <Star className="h-4 w-4" />
            저장됨
          </TabsTrigger>
          <TabsTrigger value="shared" className="gap-1">
            <Users className="h-4 w-4" />
            공유받음
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
                            {item.saved && (
                              <Star className="h-4 w-4 text-yellow-500 fill-yellow-500" />
                            )}
                          </div>
                          <p className="text-sm text-muted-foreground mb-2">
                            {item.subtitle}
                          </p>
                          <p className="text-sm line-clamp-2 text-muted-foreground">
                            {item.result.summary}
                          </p>
                          <div className="flex items-center gap-4 mt-2 text-xs text-muted-foreground">
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
                          <Button variant="ghost" size="icon">
                            <Download className="h-4 w-4" />
                          </Button>
                        )}
                        <Button variant="ghost" size="icon">
                          <Share2 className="h-4 w-4" />
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
                        <Button variant="ghost" size="icon" className="text-red-500 hover:text-red-600">
                          <Trash2 className="h-4 w-4" />
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

        {/* Shared Tab */}
        <TabsContent value="shared" className="space-y-4">
          <div className="space-y-3">
            {sharedWithMe.map((item) => {
              const Icon = typeIcons[item.type] || Star;
              return (
                <Card key={item.id} className="overflow-hidden hover:shadow-md transition-shadow">
                  <CardContent className="p-4">
                    <div className="flex items-start justify-between gap-4">
                      <div className="flex items-start gap-3 flex-1">
                        <div className="p-2 rounded-lg bg-blue-100 dark:bg-blue-900/30 shrink-0">
                          <Icon className="h-5 w-5 text-blue-600" />
                        </div>
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-1">
                            <h3 className="font-semibold">{item.title}</h3>
                            <Badge variant="secondary" className="text-xs">
                              공유받음
                            </Badge>
                          </div>
                          <p className="text-sm text-muted-foreground mb-2">
                            {item.sharedBy}님이 공유함
                          </p>
                          <div className="flex flex-wrap gap-1 mb-2">
                            {item.members.map((member) => (
                              <Badge key={member} variant="outline" className="text-xs">
                                {member}
                              </Badge>
                            ))}
                          </div>
                          <div className="flex items-center gap-4 text-xs text-muted-foreground">
                            <span className="flex items-center gap-1">
                              <Calendar className="h-3 w-3" />
                              {new Date(item.date).toLocaleDateString('ko-KR')}
                            </span>
                          </div>
                        </div>
                      </div>
                      <Button size="sm">
                        보기
                        <ChevronRight className="ml-1 h-4 w-4" />
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>

          {sharedWithMe.length === 0 && (
            <Card className="p-8 text-center">
              <Users className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
              <h3 className="font-semibold mb-2">공유받은 분석이 없습니다</h3>
              <p className="text-muted-foreground">
                가족이나 친구가 공유한 분석이 여기에 표시됩니다
              </p>
            </Card>
          )}
        </TabsContent>
      </Tabs>

      {/* Stats Summary */}
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
                {historyItems.length}
              </div>
              <div className="text-sm text-muted-foreground">전체 분석</div>
            </div>
            <div className="text-center p-4 rounded-lg bg-muted/50">
              <div className="text-2xl font-bold text-primary">
                {savedAnalyses.length}
              </div>
              <div className="text-sm text-muted-foreground">저장됨</div>
            </div>
            <div className="text-center p-4 rounded-lg bg-muted/50">
              <div className="text-2xl font-bold text-primary">
                {historyItems.filter((i) => i.isPremium).length}
              </div>
              <div className="text-sm text-muted-foreground">프리미엄</div>
            </div>
            <div className="text-center p-4 rounded-lg bg-muted/50">
              <div className="text-2xl font-bold text-primary">
                {Math.round(
                  historyItems
                    .filter((i) => i.result.score > 0)
                    .reduce((acc, i) => acc + i.result.score, 0) /
                    historyItems.filter((i) => i.result.score > 0).length
                )}
              </div>
              <div className="text-sm text-muted-foreground">평균 점수</div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
