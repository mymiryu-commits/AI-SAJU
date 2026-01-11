'use client';

import { useState, useEffect, useMemo } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import {
  Ticket,
  TrendingUp,
  Clock,
  Trophy,
  History,
  Sparkles,
  ChevronRight,
  Target,
} from 'lucide-react';
import {
  LottoNumbers,
  LottoResultDisplay,
  NumberGenerator,
  StatisticsChart,
  FilterPanel,
  WinningDashboard,
} from '@/components/lotto';
import {
  loadLottoHistory,
  analyzePatterns,
  getTimeUntilNextDraw,
  getCurrentRound,
} from '@/lib/lotto';
import type { LottoResult, PatternAnalysis, FilterConfig } from '@/types/lotto';
import { DEFAULT_FILTER_CONFIG } from '@/types/lotto';

export default function LottoPage() {
  const [results, setResults] = useState<LottoResult[]>([]);
  const [analysis, setAnalysis] = useState<PatternAnalysis | null>(null);
  const [countdown, setCountdown] = useState({ days: 0, hours: 0, minutes: 0, seconds: 0 });
  const [filterConfig, setFilterConfig] = useState<FilterConfig>(DEFAULT_FILTER_CONFIG);
  const [savedGames, setSavedGames] = useState<number[][]>([]);

  // 데이터 로드
  useEffect(() => {
    const data = loadLottoHistory();
    setResults(data);

    if (data.length > 0) {
      setAnalysis(analyzePatterns(data, 10));
    }
  }, []);

  // 카운트다운 업데이트
  useEffect(() => {
    const updateCountdown = () => {
      setCountdown(getTimeUntilNextDraw());
    };

    updateCountdown();
    const interval = setInterval(updateCountdown, 1000);

    return () => clearInterval(interval);
  }, []);

  // 최신 당첨번호
  const latestResult = results[0];
  const nextRound = getCurrentRound() + 1;

  // 게임 저장 핸들러
  const handleSaveGames = (games: number[][]) => {
    setSavedGames((prev) => [...prev, ...games]);
  };

  return (
    <div className="container mx-auto px-4 py-8">
      {/* 헤더 */}
      <div className="text-center mb-8">
        <Badge className="mb-4" variant="secondary">
          <Ticket className="mr-1 h-3 w-3" />
          AI 로또 분석기
        </Badge>
        <h1 className="text-3xl md:text-4xl font-bold mb-4">
          AI 기반 로또 번호 분석
        </h1>
        <p className="text-muted-foreground max-w-2xl mx-auto">
          통계 분석과 필터링 알고리즘을 활용한 스마트한 번호 생성
        </p>
      </div>

      {/* 상단 정보 카드들 */}
      <div className="grid md:grid-cols-3 gap-4 mb-8">
        {/* 다음 추첨 카운트다운 */}
        <Card className="bg-gradient-to-br from-purple-50 to-pink-50 dark:from-purple-950/20 dark:to-pink-950/20">
          <CardContent className="p-4">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm text-muted-foreground">다음 추첨까지</span>
              <Clock className="h-4 w-4 text-purple-500" />
            </div>
            <div className="flex gap-2 text-2xl font-bold">
              <div className="text-center">
                <span className="text-purple-600">{countdown.days}</span>
                <span className="text-xs text-muted-foreground block">일</span>
              </div>
              <span>:</span>
              <div className="text-center">
                <span className="text-purple-600">{countdown.hours}</span>
                <span className="text-xs text-muted-foreground block">시</span>
              </div>
              <span>:</span>
              <div className="text-center">
                <span className="text-purple-600">{countdown.minutes}</span>
                <span className="text-xs text-muted-foreground block">분</span>
              </div>
              <span>:</span>
              <div className="text-center">
                <span className="text-purple-600">{countdown.seconds}</span>
                <span className="text-xs text-muted-foreground block">초</span>
              </div>
            </div>
            <p className="text-xs text-muted-foreground mt-2">
              {nextRound}회 추첨 예정
            </p>
          </CardContent>
        </Card>

        {/* 최신 당첨번호 */}
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm text-muted-foreground">최신 당첨번호</span>
              <Trophy className="h-4 w-4 text-yellow-500" />
            </div>
            {latestResult ? (
              <>
                <div className="mb-2">
                  <LottoNumbers
                    numbers={latestResult.numbers}
                    bonus={latestResult.bonus}
                    size="sm"
                  />
                </div>
                <p className="text-xs text-muted-foreground">
                  {latestResult.round}회 ({latestResult.drawDate})
                </p>
              </>
            ) : (
              <p className="text-sm text-muted-foreground">로딩 중...</p>
            )}
          </CardContent>
        </Card>

        {/* 당첨 통계 */}
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm text-muted-foreground">AI 추천 당첨 현황</span>
              <Target className="h-4 w-4 text-green-500" />
            </div>
            <div className="grid grid-cols-3 gap-2 text-center">
              <div>
                <div className="text-2xl font-bold text-green-600">0</div>
                <div className="text-xs text-muted-foreground">3등+</div>
              </div>
              <div>
                <div className="text-2xl font-bold text-blue-600">12</div>
                <div className="text-xs text-muted-foreground">4등</div>
              </div>
              <div>
                <div className="text-2xl font-bold text-gray-600">89</div>
                <div className="text-xs text-muted-foreground">5등</div>
              </div>
            </div>
            <p className="text-xs text-muted-foreground mt-2">
              총 추천: 15,420건
            </p>
          </CardContent>
        </Card>
      </div>

      {/* 메인 콘텐츠 */}
      <Tabs defaultValue="generate" className="space-y-6">
        <TabsList className="grid w-full grid-cols-5">
          <TabsTrigger value="generate" className="flex items-center gap-1">
            <Sparkles className="h-4 w-4" />
            번호 생성
          </TabsTrigger>
          <TabsTrigger value="winning" className="flex items-center gap-1">
            <Trophy className="h-4 w-4" />
            당첨 현황
          </TabsTrigger>
          <TabsTrigger value="statistics" className="flex items-center gap-1">
            <TrendingUp className="h-4 w-4" />
            통계 분석
          </TabsTrigger>
          <TabsTrigger value="history" className="flex items-center gap-1">
            <History className="h-4 w-4" />
            당첨 이력
          </TabsTrigger>
          <TabsTrigger value="saved" className="flex items-center gap-1">
            <Ticket className="h-4 w-4" />
            내 번호
          </TabsTrigger>
        </TabsList>

        {/* 번호 생성 탭 */}
        <TabsContent value="generate">
          <div className="grid lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2">
              <NumberGenerator
                previousResults={results}
                analysis={analysis || undefined}
                onSave={handleSaveGames}
              />
            </div>
            <div>
              <FilterPanel
                config={filterConfig}
                onChange={setFilterConfig}
              />
            </div>
          </div>
        </TabsContent>

        {/* 당첨 현황 탭 */}
        <TabsContent value="winning">
          <WinningDashboard />
        </TabsContent>

        {/* 통계 분석 탭 */}
        <TabsContent value="statistics">
          {analysis ? (
            <StatisticsChart results={results.slice(0, 10)} analysis={analysis} />
          ) : (
            <Card>
              <CardContent className="p-8 text-center">
                <p className="text-muted-foreground">데이터 로딩 중...</p>
              </CardContent>
            </Card>
          )}
        </TabsContent>

        {/* 당첨 이력 탭 */}
        <TabsContent value="history">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <History className="h-5 w-5" />
                최근 당첨 이력
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {results.slice(0, 20).map((result) => (
                  <LottoResultDisplay
                    key={result.round}
                    round={result.round}
                    numbers={result.numbers}
                    bonus={result.bonus}
                    drawDate={result.drawDate}
                    prize1st={result.prize1st}
                    winners1st={result.winners1st}
                  />
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* 내 번호 탭 */}
        <TabsContent value="saved">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Ticket className="h-5 w-5" />
                저장된 번호
              </CardTitle>
            </CardHeader>
            <CardContent>
              {savedGames.length > 0 ? (
                <div className="space-y-3">
                  {savedGames.map((game, index) => (
                    <div
                      key={index}
                      className="flex items-center justify-between p-3 bg-muted/50 rounded-lg"
                    >
                      <div className="flex items-center gap-3">
                        <span className="text-sm font-medium text-muted-foreground">
                          #{index + 1}
                        </span>
                        <LottoNumbers numbers={game} size="sm" />
                      </div>
                      <Badge variant="outline">대기중</Badge>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8">
                  <Ticket className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
                  <p className="text-muted-foreground mb-4">
                    저장된 번호가 없습니다
                  </p>
                  <p className="text-sm text-muted-foreground">
                    번호 생성 후 저장 버튼을 클릭하세요
                  </p>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* 하단 CTA */}
      <Card className="mt-8 bg-gradient-to-r from-yellow-50 to-orange-50 dark:from-yellow-950/20 dark:to-orange-950/20 border-yellow-200">
        <CardContent className="p-6">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            <div>
              <h3 className="text-lg font-bold mb-1">프리미엄 분석</h3>
              <p className="text-sm text-muted-foreground">
                백테스트, 시뮬레이션, 자동 당첨 대조 기능을 이용해보세요
              </p>
            </div>
            <Button>
              프리미엄 시작하기
              <ChevronRight className="ml-2 h-4 w-4" />
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
