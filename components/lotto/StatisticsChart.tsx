'use client';

import { useMemo } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { BarChart3, TrendingUp, Flame, Snowflake } from 'lucide-react';
import type { LottoResult, PatternAnalysis } from '@/types/lotto';
import { LottoBall } from './LottoBall';

interface StatisticsChartProps {
  results: LottoResult[];
  analysis: PatternAnalysis;
}

export function StatisticsChart({ results, analysis }: StatisticsChartProps) {
  // 번호별 출현 빈도 계산
  const frequencyData = useMemo(() => {
    const data: { number: number; count: number; percentage: number }[] = [];

    for (let i = 1; i <= 45; i++) {
      const count = analysis.recentFrequency.get(i) || 0;
      const percentage = results.length > 0 ? (count / results.length) * 100 : 0;
      data.push({ number: i, count, percentage });
    }

    return data.sort((a, b) => b.count - a.count);
  }, [analysis, results]);

  // 최다 출현 번호
  const topNumbers = frequencyData.slice(0, 10);

  // 미출현 주기가 긴 번호
  const overdueNumbers = useMemo(() => {
    const data: { number: number; cycles: number }[] = [];

    for (let i = 1; i <= 45; i++) {
      const cycles = analysis.overdueCycles.get(i) || 0;
      data.push({ number: i, cycles });
    }

    return data.sort((a, b) => b.cycles - a.cycles).slice(0, 10);
  }, [analysis]);

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <BarChart3 className="h-5 w-5" />
          통계 분석
        </CardTitle>
      </CardHeader>
      <CardContent>
        <Tabs defaultValue="frequency">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="frequency">출현 빈도</TabsTrigger>
            <TabsTrigger value="hot-cold">과열/냉각</TabsTrigger>
            <TabsTrigger value="pattern">패턴</TabsTrigger>
          </TabsList>

          {/* 출현 빈도 탭 */}
          <TabsContent value="frequency" className="space-y-4">
            <div>
              <h4 className="text-sm font-medium mb-2">최다 출현 번호 (최근 {results.length}회)</h4>
              <div className="space-y-2">
                {topNumbers.map((item) => (
                  <div
                    key={item.number}
                    className="flex items-center gap-3"
                  >
                    <LottoBall number={item.number} size="sm" />
                    <div className="flex-1 h-2 bg-muted rounded-full overflow-hidden">
                      <div
                        className="h-full bg-primary transition-all"
                        style={{ width: `${item.percentage * 5}%` }}
                      />
                    </div>
                    <span className="text-sm text-muted-foreground w-16 text-right">
                      {item.count}회 ({item.percentage.toFixed(1)}%)
                    </span>
                  </div>
                ))}
              </div>
            </div>

            {/* 번호대별 분포 */}
            <div className="pt-4 border-t">
              <h4 className="text-sm font-medium mb-2">번호대별 분포</h4>
              <div className="grid grid-cols-5 gap-2">
                {['1-10', '11-20', '21-30', '31-40', '41-45'].map((range, idx) => {
                  const [start, end] = range.split('-').map(Number);
                  const count = frequencyData
                    .filter((d) => d.number >= start && d.number <= end)
                    .reduce((sum, d) => sum + d.count, 0);
                  const total = frequencyData.reduce((sum, d) => sum + d.count, 0);
                  const percentage = total > 0 ? (count / total) * 100 : 0;

                  return (
                    <div
                      key={range}
                      className="text-center p-2 bg-muted rounded-lg"
                    >
                      <div className="text-xs text-muted-foreground">{range}</div>
                      <div className="font-bold">{count}</div>
                      <div className="text-xs text-muted-foreground">
                        {percentage.toFixed(1)}%
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </TabsContent>

          {/* 과열/냉각 탭 */}
          <TabsContent value="hot-cold" className="space-y-4">
            {/* 과열 번호 */}
            <div>
              <h4 className="text-sm font-medium mb-2 flex items-center gap-2">
                <Flame className="h-4 w-4 text-red-500" />
                과열 번호 (자주 출현)
              </h4>
              <div className="flex flex-wrap gap-2">
                {analysis.hotNumbers.length > 0 ? (
                  analysis.hotNumbers.map((num) => (
                    <div key={num} className="relative">
                      <LottoBall number={num} />
                      <Badge
                        variant="destructive"
                        className="absolute -top-1 -right-1 h-4 w-4 p-0 flex items-center justify-center text-[10px]"
                      >
                        {analysis.recentFrequency.get(num) || 0}
                      </Badge>
                    </div>
                  ))
                ) : (
                  <p className="text-sm text-muted-foreground">
                    과열 번호 없음
                  </p>
                )}
              </div>
            </div>

            {/* 냉각 번호 */}
            <div className="pt-4 border-t">
              <h4 className="text-sm font-medium mb-2 flex items-center gap-2">
                <Snowflake className="h-4 w-4 text-blue-500" />
                냉각 번호 (오래 미출현)
              </h4>
              <div className="flex flex-wrap gap-2">
                {analysis.coldNumbers.length > 0 ? (
                  analysis.coldNumbers.map((num) => (
                    <div key={num} className="relative">
                      <LottoBall number={num} />
                      <Badge
                        variant="secondary"
                        className="absolute -top-1 -right-1 h-4 w-4 p-0 flex items-center justify-center text-[10px]"
                      >
                        {analysis.overdueCycles.get(num) || 0}
                      </Badge>
                    </div>
                  ))
                ) : (
                  <p className="text-sm text-muted-foreground">
                    냉각 번호 없음
                  </p>
                )}
              </div>
            </div>

            {/* 미출현 주기 */}
            <div className="pt-4 border-t">
              <h4 className="text-sm font-medium mb-2">미출현 주기 TOP 10</h4>
              <div className="space-y-2">
                {overdueNumbers.map((item) => (
                  <div
                    key={item.number}
                    className="flex items-center gap-3"
                  >
                    <LottoBall number={item.number} size="sm" />
                    <div className="flex-1 h-2 bg-muted rounded-full overflow-hidden">
                      <div
                        className="h-full bg-blue-500 transition-all"
                        style={{
                          width: `${Math.min(item.cycles * 5, 100)}%`,
                        }}
                      />
                    </div>
                    <span className="text-sm text-muted-foreground w-16 text-right">
                      {item.cycles}회차
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </TabsContent>

          {/* 패턴 탭 */}
          <TabsContent value="pattern" className="space-y-4">
            {/* 홀짝 패턴 */}
            <div>
              <h4 className="text-sm font-medium mb-2">홀짝 분포</h4>
              <div className="grid grid-cols-5 gap-2">
                {[
                  { odd: 0, even: 6 },
                  { odd: 1, even: 5 },
                  { odd: 2, even: 4 },
                  { odd: 3, even: 3 },
                  { odd: 4, even: 2 },
                  { odd: 5, even: 1 },
                  { odd: 6, even: 0 },
                ].map(({ odd, even }) => {
                  const count = analysis.oddEvenPattern.filter(
                    (p) => p.odd === odd
                  ).length;
                  const percentage =
                    analysis.oddEvenPattern.length > 0
                      ? (count / analysis.oddEvenPattern.length) * 100
                      : 0;

                  return (
                    <div
                      key={`${odd}-${even}`}
                      className="text-center p-2 bg-muted rounded-lg"
                    >
                      <div className="text-xs text-muted-foreground">
                        {odd}:{even}
                      </div>
                      <div className="font-bold">{count}</div>
                      <div className="text-xs text-muted-foreground">
                        {percentage.toFixed(0)}%
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* 저고 패턴 */}
            <div className="pt-4 border-t">
              <h4 className="text-sm font-medium mb-2">저고 분포 (1-22:23-45)</h4>
              <div className="grid grid-cols-5 gap-2">
                {[
                  { low: 0, high: 6 },
                  { low: 1, high: 5 },
                  { low: 2, high: 4 },
                  { low: 3, high: 3 },
                  { low: 4, high: 2 },
                  { low: 5, high: 1 },
                  { low: 6, high: 0 },
                ].map(({ low, high }) => {
                  const count = analysis.lowHighPattern.filter(
                    (p) => p.low === low
                  ).length;
                  const percentage =
                    analysis.lowHighPattern.length > 0
                      ? (count / analysis.lowHighPattern.length) * 100
                      : 0;

                  return (
                    <div
                      key={`${low}-${high}`}
                      className="text-center p-2 bg-muted rounded-lg"
                    >
                      <div className="text-xs text-muted-foreground">
                        {low}:{high}
                      </div>
                      <div className="font-bold">{count}</div>
                      <div className="text-xs text-muted-foreground">
                        {percentage.toFixed(0)}%
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* 합계 추이 */}
            <div className="pt-4 border-t">
              <h4 className="text-sm font-medium mb-2 flex items-center gap-2">
                <TrendingUp className="h-4 w-4" />
                합계 추이 (최근 10회)
              </h4>
              <div className="flex items-end gap-1 h-20">
                {analysis.sumTrend.slice(0, 10).reverse().map((sum, idx) => {
                  const height = ((sum - 21) / (255 - 21)) * 100;
                  const isOptimal = sum >= 100 && sum <= 170;

                  return (
                    <div
                      key={idx}
                      className="flex-1 flex flex-col items-center gap-1"
                    >
                      <div
                        className={`w-full rounded-t transition-all ${
                          isOptimal ? 'bg-green-500' : 'bg-muted-foreground/30'
                        }`}
                        style={{ height: `${height}%` }}
                      />
                      <span className="text-[10px] text-muted-foreground">
                        {sum}
                      </span>
                    </div>
                  );
                })}
              </div>
              <p className="text-xs text-muted-foreground mt-2">
                권장 범위: 100-170 (초록색)
              </p>
            </div>

            {/* 연번 출현율 */}
            <div className="pt-4 border-t">
              <h4 className="text-sm font-medium mb-2">연번 출현율</h4>
              <div className="flex items-center gap-3">
                <div className="flex-1 h-3 bg-muted rounded-full overflow-hidden">
                  <div
                    className="h-full bg-primary transition-all"
                    style={{ width: `${analysis.consecutiveRate}%` }}
                  />
                </div>
                <span className="text-sm font-medium">
                  {analysis.consecutiveRate.toFixed(1)}%
                </span>
              </div>
              <p className="text-xs text-muted-foreground mt-1">
                연속번호(예: 5,6)가 포함된 회차 비율
              </p>
            </div>
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
}
