'use client';

import { useState, useEffect } from 'react';
import { useSearchParams } from 'next/navigation';
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
  ShieldAlert,
  Play,
  RefreshCw,
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
  analyzePatterns,
  getTimeUntilNextDraw,
  getLatestCompletedRound,
} from '@/lib/lotto';
import type { LottoResult, PatternAnalysis, FilterConfig } from '@/types/lotto';
import { DEFAULT_FILTER_CONFIG } from '@/types/lotto';

// 관리자 접근 키 (환경변수로 관리 권장)
const ADMIN_KEY = process.env.NEXT_PUBLIC_LOTTO_ADMIN_KEY || 'mymiryu2026';

// 예상 당첨금 계산 (실제로는 API에서 가져와야 함)
function estimateJackpot(previousPrize?: number): number {
  // 기본 예상 당첨금 (이월 없을 경우 약 20억)
  const basePrize = 2000000000;
  // 이전 당첨금 기반 추정
  if (previousPrize) {
    return Math.round(previousPrize * 1.1); // 10% 증가 추정
  }
  return basePrize + Math.floor(Math.random() * 500000000);
}

// 금액 포맷팅
function formatPrizeAmount(amount: number): string {
  return amount.toLocaleString('ko-KR');
}

export default function LottoPage() {
  const searchParams = useSearchParams();
  const [isAdmin, setIsAdmin] = useState(false);

  // 관리자 접근 체크
  useEffect(() => {
    const adminParam = searchParams.get('admin');
    const storedAdmin = localStorage.getItem('lotto_admin_access');

    if (adminParam === ADMIN_KEY) {
      localStorage.setItem('lotto_admin_access', 'true');
      setIsAdmin(true);
    } else if (storedAdmin === 'true') {
      setIsAdmin(true);
    }
  }, [searchParams]);

  const [results, setResults] = useState<LottoResult[]>([]);
  const [analysis, setAnalysis] = useState<PatternAnalysis | null>(null);
  const [countdown, setCountdown] = useState({ days: 0, hours: 0, minutes: 0, seconds: 0 });
  const [filterConfig, setFilterConfig] = useState<FilterConfig>(DEFAULT_FILTER_CONFIG);
  const [savedGames, setSavedGames] = useState<number[][]>([]);
  const [estimatedPrize, setEstimatedPrize] = useState(0);
  const [isRefreshing, setIsRefreshing] = useState(false);

  // 데이터 로드 (API에서 Supabase 데이터 가져오기)
  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch('/api/lotto/history?limit=50');
        const data = await response.json();

        if (data.success && data.results) {
          setResults(data.results);
          // 결과가 있으면 클라이언트에서 분석 수행
          if (data.results.length > 0) {
            setAnalysis(analyzePatterns(data.results, 10));
            setEstimatedPrize(estimateJackpot(data.results[0]?.prize1st));
          }
        }
      } catch (error) {
        console.error('Failed to fetch lotto history:', error);
      }
    };

    fetchData();
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
  const nextRound = getLatestCompletedRound() + 1;

  // 게임 저장 핸들러
  const handleSaveGames = (games: number[][]) => {
    setSavedGames((prev) => [...prev, ...games]);
  };

  // 데이터 새로고침
  const handleRefresh = async () => {
    setIsRefreshing(true);
    try {
      // API 호출로 최신 데이터 갱신
      await fetch('/api/lotto/fetch-winning');
      // 새로운 데이터 가져오기
      const response = await fetch('/api/lotto/history?limit=50');
      const data = await response.json();
      if (data.success && data.results) {
        setResults(data.results);
        if (data.results.length > 0) {
          setAnalysis(analyzePatterns(data.results, 10));
          setEstimatedPrize(estimateJackpot(data.results[0]?.prize1st));
        }
      }
    } catch (e) {
      console.error('Failed to refresh:', e);
    } finally {
      setIsRefreshing(false);
    }
  };

  // 관리자가 아닌 경우 접근 제한
  if (!isAdmin) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-md mx-auto text-center">
          <Card className="border-orange-200 bg-orange-50 dark:bg-orange-950/20">
            <CardContent className="p-8">
              <ShieldAlert className="h-16 w-16 mx-auto text-orange-500 mb-4" />
              <h1 className="text-2xl font-bold mb-2">접근 제한</h1>
              <p className="text-muted-foreground mb-4">
                이 페이지는 현재 관리자 전용입니다.
              </p>
              <p className="text-sm text-muted-foreground">
                서비스 준비 중입니다. 곧 만나요!
              </p>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      {/* 상단 배너 */}
      <LottoBanner locale="ko" />

      {/* 메인 정보 바 (이미지 스타일) */}
      <div className="mb-8 rounded-xl overflow-hidden shadow-2xl">
        <div className="bg-gradient-to-r from-slate-800 via-slate-700 to-slate-800 p-1">
          <div className="grid md:grid-cols-3 divide-y md:divide-y-0 md:divide-x divide-slate-600/50">
            {/* 왼쪽: 회차 및 카운트다운 */}
            <div className="p-4 md:p-6 flex flex-col justify-center">
              <div className="flex items-baseline gap-2 mb-2">
                <span className="text-slate-400 text-sm">제</span>
                <span className="text-yellow-400 font-bold text-2xl md:text-3xl">{nextRound}</span>
                <span className="text-slate-400 text-sm">회</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-slate-400 text-sm">남은시간</span>
                <div className="flex items-center text-cyan-400 font-mono font-bold text-lg md:text-xl">
                  <span>{countdown.days}</span>
                  <span className="text-slate-500 mx-0.5">일</span>
                  <span>{String(countdown.hours).padStart(2, '0')}</span>
                  <span className="text-slate-500 animate-pulse">:</span>
                  <span>{String(countdown.minutes).padStart(2, '0')}</span>
                </div>
              </div>
            </div>

            {/* 중앙: 예상 당첨금 */}
            <div className="p-4 md:p-6 text-center bg-gradient-to-b from-slate-700/50 to-transparent">
              <div className="text-slate-300 text-xs md:text-sm mb-1">
                1등 예상 총 당첨금액
              </div>
              <div className="text-white font-bold text-2xl md:text-4xl tracking-tight">
                <span className="text-yellow-400">{formatPrizeAmount(estimatedPrize)}</span>
              </div>
              <div className="text-slate-400 text-xs mt-1">
                *예상 금액이며 실제와 다를 수 있습니다
              </div>
            </div>

            {/* 오른쪽: 최신 당첨결과 */}
            <div className="p-4 md:p-6">
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-2">
                  <span className="text-yellow-400 font-bold text-lg md:text-xl">
                    {latestResult?.round || '---'}
                  </span>
                  <span className="text-slate-400 text-sm">회 당첨 결과</span>
                </div>
                <Button
                  variant="outline"
                  size="sm"
                  className="border-cyan-500/50 text-cyan-400 hover:bg-cyan-500/10 text-xs h-7"
                  onClick={() => window.open('https://www.dhlottery.co.kr', '_blank')}
                >
                  <Play className="h-3 w-3 mr-1" />
                  추첨방송보기
                </Button>
              </div>
              {latestResult ? (
                <div className="flex items-center gap-1.5">
                  {latestResult.numbers.map((num, i) => (
                    <div
                      key={i}
                      className={`w-8 h-8 md:w-9 md:h-9 rounded-full flex items-center justify-center font-bold text-sm md:text-base shadow-lg ${
                        num <= 10
                          ? 'bg-gradient-to-br from-yellow-300 to-yellow-500 text-yellow-900'
                          : num <= 20
                          ? 'bg-gradient-to-br from-blue-400 to-blue-600 text-white'
                          : num <= 30
                          ? 'bg-gradient-to-br from-red-400 to-red-600 text-white'
                          : num <= 40
                          ? 'bg-gradient-to-br from-gray-400 to-gray-600 text-white'
                          : 'bg-gradient-to-br from-green-400 to-green-600 text-white'
                      }`}
                    >
                      {num}
                    </div>
                  ))}
                  <span className="text-slate-400 mx-1 text-lg">+</span>
                  <div
                    className={`w-8 h-8 md:w-9 md:h-9 rounded-full flex items-center justify-center font-bold text-sm md:text-base shadow-lg ring-2 ring-purple-400 ${
                      latestResult.bonus <= 10
                        ? 'bg-gradient-to-br from-yellow-300 to-yellow-500 text-yellow-900'
                        : latestResult.bonus <= 20
                        ? 'bg-gradient-to-br from-blue-400 to-blue-600 text-white'
                        : latestResult.bonus <= 30
                        ? 'bg-gradient-to-br from-red-400 to-red-600 text-white'
                        : latestResult.bonus <= 40
                        ? 'bg-gradient-to-br from-gray-400 to-gray-600 text-white'
                        : 'bg-gradient-to-br from-green-400 to-green-600 text-white'
                    }`}
                  >
                    {latestResult.bonus}
                  </div>
                </div>
              ) : (
                <div className="flex items-center justify-center h-10">
                  <div className="animate-pulse text-slate-400 text-sm">로딩 중...</div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* 새로고침 버튼 */}
      <div className="flex justify-end mb-4">
        <Button
          variant="outline"
          size="sm"
          onClick={handleRefresh}
          disabled={isRefreshing}
          className="text-xs"
        >
          <RefreshCw className={`h-3.5 w-3.5 mr-1.5 ${isRefreshing ? 'animate-spin' : ''}`} />
          {isRefreshing ? '갱신 중...' : '최신 데이터 갱신'}
        </Button>
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
