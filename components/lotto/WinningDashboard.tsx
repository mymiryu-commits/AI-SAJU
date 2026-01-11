'use client';

import { useEffect, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Trophy, TrendingUp, Users, Coins } from 'lucide-react';
import { LottoNumbers } from './LottoBall';

interface TotalStats {
  total_recommendations: number;
  total_winners: number;
  winners_rank1: number;
  winners_rank2: number;
  winners_rank3: number;
  winners_rank4: number;
  winners_rank5: number;
  total_prize_amount: number;
  hit_rate: number;
}

interface RecentWinner {
  id: string;
  round: number;
  numbers: number[];
  matched_count: number;
  prize_rank: number;
  prize_amount: number;
  winning_numbers: number[];
}

export function WinningDashboard() {
  const [stats, setStats] = useState<TotalStats | null>(null);
  const [recentWinners, setRecentWinners] = useState<RecentWinner[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchStats() {
      try {
        const response = await fetch('/api/lotto/stats');
        const data = await response.json();

        if (data.success) {
          setStats(data.totalStats);
          setRecentWinners(data.recentWinners || []);
        }
      } catch (error) {
        console.error('Failed to fetch stats:', error);
      } finally {
        setLoading(false);
      }
    }

    fetchStats();
  }, []);

  const formatPrize = (amount: number) => {
    if (amount >= 100000000) {
      return `${(amount / 100000000).toFixed(1)}억`;
    }
    if (amount >= 10000) {
      return `${Math.floor(amount / 10000)}만`;
    }
    return amount.toLocaleString();
  };

  if (loading) {
    return (
      <Card>
        <CardContent className="p-8 text-center">
          <div className="animate-pulse">로딩 중...</div>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      {/* 당첨 배너 */}
      {stats && stats.total_winners > 0 && (
        <Card className="bg-gradient-to-r from-yellow-50 to-amber-50 dark:from-yellow-950/20 dark:to-amber-950/20 border-yellow-200">
          <CardContent className="p-4">
            <div className="flex items-center justify-center gap-2 text-amber-600">
              <Trophy className="h-5 w-5" />
              <span className="font-bold">
                AI 수익화 추천번호 누적 {stats.total_winners}명 당첨!
              </span>
              <Trophy className="h-5 w-5" />
            </div>
          </CardContent>
        </Card>
      )}

      {/* 통계 카드 */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-2 text-muted-foreground mb-1">
              <Users className="h-4 w-4" />
              <span className="text-xs">총 추천</span>
            </div>
            <div className="text-2xl font-bold">
              {stats?.total_recommendations.toLocaleString() || 0}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-2 text-muted-foreground mb-1">
              <Trophy className="h-4 w-4" />
              <span className="text-xs">당첨자</span>
            </div>
            <div className="text-2xl font-bold text-green-600">
              {stats?.total_winners || 0}명
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-2 text-muted-foreground mb-1">
              <TrendingUp className="h-4 w-4" />
              <span className="text-xs">당첨률</span>
            </div>
            <div className="text-2xl font-bold">
              {stats?.hit_rate?.toFixed(2) || 0}%
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-2 text-muted-foreground mb-1">
              <Coins className="h-4 w-4" />
              <span className="text-xs">총 당첨금</span>
            </div>
            <div className="text-2xl font-bold text-amber-600">
              {formatPrize(stats?.total_prize_amount || 0)}원
            </div>
          </CardContent>
        </Card>
      </div>

      {/* 등수별 당첨 현황 */}
      {stats && (
        <Card>
          <CardHeader>
            <CardTitle className="text-lg flex items-center gap-2">
              <Trophy className="h-5 w-5 text-yellow-500" />
              등수별 당첨 현황
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-5 gap-2 text-center">
              <div className="p-3 bg-gradient-to-b from-yellow-100 to-yellow-50 rounded-lg">
                <div className="text-xs text-muted-foreground mb-1">1등</div>
                <div className="text-xl font-bold text-yellow-600">
                  {stats.winners_rank1}
                </div>
              </div>
              <div className="p-3 bg-gradient-to-b from-gray-100 to-gray-50 rounded-lg">
                <div className="text-xs text-muted-foreground mb-1">2등</div>
                <div className="text-xl font-bold text-gray-600">
                  {stats.winners_rank2}
                </div>
              </div>
              <div className="p-3 bg-gradient-to-b from-amber-100 to-amber-50 rounded-lg">
                <div className="text-xs text-muted-foreground mb-1">3등</div>
                <div className="text-xl font-bold text-amber-600">
                  {stats.winners_rank3}
                </div>
              </div>
              <div className="p-3 bg-gradient-to-b from-blue-100 to-blue-50 rounded-lg">
                <div className="text-xs text-muted-foreground mb-1">4등</div>
                <div className="text-xl font-bold text-blue-600">
                  {stats.winners_rank4}
                </div>
              </div>
              <div className="p-3 bg-gradient-to-b from-green-100 to-green-50 rounded-lg">
                <div className="text-xs text-muted-foreground mb-1">5등</div>
                <div className="text-xl font-bold text-green-600">
                  {stats.winners_rank5}
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* 최근 당첨자 */}
      {recentWinners.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">최근 당첨자</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {recentWinners.map((winner) => (
                <div
                  key={winner.id}
                  className="flex items-center justify-between p-3 bg-muted/50 rounded-lg"
                >
                  <div className="flex items-center gap-3">
                    <Badge
                      variant={winner.prize_rank <= 3 ? 'default' : 'secondary'}
                    >
                      {winner.prize_rank}등
                    </Badge>
                    <div>
                      <div className="text-sm font-medium">
                        {winner.round}회차
                      </div>
                      <div className="text-xs text-muted-foreground">
                        {winner.matched_count}개 일치
                      </div>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="font-bold text-green-600">
                      {formatPrize(winner.prize_amount)}원
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
