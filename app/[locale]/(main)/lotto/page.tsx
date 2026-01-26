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
  LottoBanner,
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
      {/* 상단 배너 */}
      <LottoBanner locale="ko" />

      {/* 헤더 */}
      <div className="text-center mb-10">
        <Badge className="mb-4 px-4 py-1.5 text-sm bg-gradient-to-r from-purple-500 to-pink-500 text-white border-0 shadow-lg shadow-purple-500/25">
          <Sparkles className="mr-1.5 h-3.5 w-3.5" />
          AI 로또 분석기
        </Badge>
        <h1 className="text-3xl md:text-5xl font-extrabold mb-4 bg-gradient-to-r from-gray-900 via-purple-900 to-gray-900 dark:from-white dark:via-purple-200 dark:to-white bg-clip-text text-transparent">
          AI 기반 로또 번호 분석
        </h1>
        <p className="text-muted-foreground max-w-2xl mx-auto text-base md:text-lg">
          통계 분석과 필터링 알고리즘을 활용한{' '}
          <span className="text-purple-600 dark:text-purple-400 font-semibold">스마트한</span> 번호 생성
        </p>
      </div>

      {/* 상단 정보 카드들 */}
      <div className="grid md:grid-cols-3 gap-4 mb-8">
        {/* 다음 추첨 카운트다운 */}
        <Card className="bg-gradient-to-br from-purple-50 via-pink-50 to-orange-50 dark:from-purple-950/30 dark:via-pink-950/20 dark:to-orange-950/20 border-purple-200/50 dark:border-purple-800/50 shadow-lg shadow-purple-500/10 overflow-hidden relative">
          <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-purple-400/20 to-transparent rounded-full -translate-y-1/2 translate-x-1/2" />
          <CardContent className="p-5 relative">
            <div className="flex items-center justify-between mb-3">
              <span className="text-sm font-medium text-purple-700 dark:text-purple-300">다음 추첨까지</span>
              <div className="p-2 bg-purple-100 dark:bg-purple-900/50 rounded-lg">
                <Clock className="h-4 w-4 text-purple-600 dark:text-purple-400" />
              </div>
            </div>
            <div className="flex gap-1 text-2xl font-bold justify-center">
              {[
                { value: countdown.days, label: '일' },
                { value: countdown.hours, label: '시' },
                { value: countdown.minutes, label: '분' },
                { value: countdown.seconds, label: '초' },
              ].map((item, i) => (
                <div key={item.label} className="flex items-center">
                  {i > 0 && <span className="text-purple-400 mx-0.5">:</span>}
                  <div className="text-center bg-white/60 dark:bg-gray-800/60 rounded-lg px-2 py-1 min-w-[44px]">
                    <span className="text-purple-600 dark:text-purple-400 font-extrabold tabular-nums">
                      {String(item.value).padStart(2, '0')}
                    </span>
                    <span className="text-[10px] text-muted-foreground block -mt-0.5">{item.label}</span>
                  </div>
                </div>
              ))}
            </div>
            <p className="text-xs text-purple-600/80 dark:text-purple-400/80 mt-3 text-center font-medium">
              {nextRound}회 추첨 예정
            </p>
          </CardContent>
        </Card>

        {/* 최신 당첨번호 */}
        <Card className="bg-gradient-to-br from-yellow-50 to-orange-50 dark:from-yellow-950/20 dark:to-orange-950/20 border-yellow-200/50 dark:border-yellow-800/50 shadow-lg shadow-yellow-500/10 overflow-hidden relative">
          <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-yellow-400/20 to-transparent rounded-full -translate-y-1/2 translate-x-1/2" />
          <CardContent className="p-5 relative">
            <div className="flex items-center justify-between mb-3">
              <span className="text-sm font-medium text-yellow-700 dark:text-yellow-300">최신 당첨번호</span>
              <div className="p-2 bg-yellow-100 dark:bg-yellow-900/50 rounded-lg">
                <Trophy className="h-4 w-4 text-yellow-600 dark:text-yellow-400" />
              </div>
            </div>
            {latestResult ? (
              <>
                <div className="mb-3 flex justify-center">
                  <LottoNumbers
                    numbers={latestResult.numbers}
                    bonus={latestResult.bonus}
                    size="sm"
                  />
                </div>
                <p className="text-xs text-yellow-600/80 dark:text-yellow-400/80 text-center font-medium">
                  {latestResult.round}회 ({latestResult.drawDate})
                </p>
              </>
            ) : (
              <div className="flex items-center justify-center h-16">
                <div className="animate-pulse text-sm text-muted-foreground">로딩 중...</div>
              </div>
            )}
          </CardContent>
        </Card>

        {/* 당첨 통계 */}
        <Card className="bg-gradient-to-br from-green-50 to-emerald-50 dark:from-green-950/20 dark:to-emerald-950/20 border-green-200/50 dark:border-green-800/50 shadow-lg shadow-green-500/10 overflow-hidden relative">
          <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-green-400/20 to-transparent rounded-full -translate-y-1/2 translate-x-1/2" />
          <CardContent className="p-5 relative">
            <div className="flex items-center justify-between mb-3">
              <span className="text-sm font-medium text-green-700 dark:text-green-300">AI 추천 당첨 현황</span>
              <div className="p-2 bg-green-100 dark:bg-green-900/50 rounded-lg">
                <Target className="h-4 w-4 text-green-600 dark:text-green-400" />
              </div>
            </div>
            <div className="grid grid-cols-3 gap-2 text-center">
              <div className="bg-white/60 dark:bg-gray-800/60 rounded-lg p-2">
                <div className="text-2xl font-extrabold text-green-600 dark:text-green-400">0</div>
                <div className="text-[10px] text-muted-foreground font-medium">3등+</div>
              </div>
              <div className="bg-white/60 dark:bg-gray-800/60 rounded-lg p-2">
                <div className="text-2xl font-extrabold text-blue-600 dark:text-blue-400">12</div>
                <div className="text-[10px] text-muted-foreground font-medium">4등</div>
              </div>
              <div className="bg-white/60 dark:bg-gray-800/60 rounded-lg p-2">
                <div className="text-2xl font-extrabold text-gray-600 dark:text-gray-400">89</div>
                <div className="text-[10px] text-muted-foreground font-medium">5등</div>
              </div>
            </div>
            <p className="text-xs text-green-600/80 dark:text-green-400/80 mt-3 text-center font-medium">
              총 추천: 15,420건
            </p>
          </CardContent>
        </Card>
      </div>

      {/* 메인 콘텐츠 */}
      <Tabs defaultValue="generate" className="space-y-6">
        <TabsList className="grid w-full grid-cols-5 h-auto p-1 bg-muted/50 rounded-xl">
          <TabsTrigger
            value="generate"
            className="flex items-center gap-1.5 py-2.5 data-[state=active]:bg-white dark:data-[state=active]:bg-gray-800 data-[state=active]:shadow-md rounded-lg transition-all"
          >
            <Sparkles className="h-4 w-4" />
            <span className="hidden sm:inline">번호 생성</span>
          </TabsTrigger>
          <TabsTrigger
            value="winning"
            className="flex items-center gap-1.5 py-2.5 data-[state=active]:bg-white dark:data-[state=active]:bg-gray-800 data-[state=active]:shadow-md rounded-lg transition-all"
          >
            <Trophy className="h-4 w-4" />
            <span className="hidden sm:inline">당첨 현황</span>
          </TabsTrigger>
          <TabsTrigger
            value="statistics"
            className="flex items-center gap-1.5 py-2.5 data-[state=active]:bg-white dark:data-[state=active]:bg-gray-800 data-[state=active]:shadow-md rounded-lg transition-all"
          >
            <TrendingUp className="h-4 w-4" />
            <span className="hidden sm:inline">통계 분석</span>
          </TabsTrigger>
          <TabsTrigger
            value="history"
            className="flex items-center gap-1.5 py-2.5 data-[state=active]:bg-white dark:data-[state=active]:bg-gray-800 data-[state=active]:shadow-md rounded-lg transition-all"
          >
            <History className="h-4 w-4" />
            <span className="hidden sm:inline">당첨 이력</span>
          </TabsTrigger>
          <TabsTrigger
            value="saved"
            className="flex items-center gap-1.5 py-2.5 data-[state=active]:bg-white dark:data-[state=active]:bg-gray-800 data-[state=active]:shadow-md rounded-lg transition-all"
          >
            <Ticket className="h-4 w-4" />
            <span className="hidden sm:inline">내 번호</span>
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
      <Card className="mt-10 bg-gradient-to-r from-purple-600 via-pink-600 to-orange-500 border-0 shadow-xl shadow-purple-500/25 overflow-hidden relative">
        <div className="absolute inset-0 bg-[url('/patterns/grid.svg')] opacity-10" />
        <CardContent className="p-8 relative">
          <div className="flex flex-col md:flex-row items-center justify-between gap-6">
            <div className="text-center md:text-left">
              <div className="inline-flex items-center gap-2 px-3 py-1 bg-white/20 rounded-full text-white/90 text-sm mb-3">
                <Sparkles className="h-3.5 w-3.5" />
                PREMIUM
              </div>
              <h3 className="text-xl md:text-2xl font-bold text-white mb-2">
                프리미엄 분석으로 당첨 확률 UP!
              </h3>
              <p className="text-white/80 text-sm md:text-base">
                백테스트, AI 시뮬레이션, 자동 당첨 대조 기능을 이용해보세요
              </p>
            </div>
            <Button
              size="lg"
              className="bg-white text-purple-600 hover:bg-white/90 font-bold px-8 shadow-lg"
            >
              프리미엄 시작하기
              <ChevronRight className="ml-2 h-5 w-5" />
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
