'use client';

import { useState, useCallback } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import {
  Sparkles,
  Zap,
  RefreshCw,
  Save,
  Trash2,
  Copy,
  Check,
  Crown,
  TrendingUp,
  Target,
  Brain,
  Rocket,
} from 'lucide-react';
import { LottoNumbers } from './LottoBall';
import { cn } from '@/lib/utils';
import type { FilterConfig, LottoResult, PatternAnalysis } from '@/types/lotto';
import { DEFAULT_FILTER_CONFIG } from '@/types/lotto';
import {
  generateLottoNumbers,
  calculateQualityScore,
  getNumberStats,
} from '@/lib/lotto';

interface GeneratedGame {
  numbers: number[];
  score: number;
  stats: ReturnType<typeof getNumberStats>;
}

interface NumberGeneratorProps {
  previousResults: LottoResult[];
  analysis?: PatternAnalysis;
  onSave?: (games: number[][]) => void;
  isPremium?: boolean;
}

export function NumberGenerator({
  previousResults,
  analysis,
  onSave,
  isPremium = false,
}: NumberGeneratorProps) {
  const [games, setGames] = useState<GeneratedGame[]>([]);
  const [gameCount, setGameCount] = useState<'1' | '5' | '10' | '20'>('5');
  const [usePattern, setUsePattern] = useState(true);
  const [usePremium, setUsePremium] = useState(false);
  const [useAI, setUseAI] = useState(false);
  const [isGenerating, setIsGenerating] = useState(false);
  const [copied, setCopied] = useState(false);
  const [config] = useState<FilterConfig>(DEFAULT_FILTER_CONFIG);

  const handleGenerate = useCallback(() => {
    setIsGenerating(true);

    // 약간의 딜레이로 로딩 효과
    setTimeout(() => {
      const result = generateLottoNumbers({
        count: parseInt(gameCount),
        config,
        previousResults,
        usePattern,
        premium: usePremium,
        sortByQuality: true,
      });

      const generatedGames: GeneratedGame[] = result.games.map((numbers) => ({
        numbers,
        score: calculateQualityScore(numbers, analysis),
        stats: getNumberStats(numbers),
      }));

      setGames(generatedGames);
      setIsGenerating(false);
    }, 800);
  }, [gameCount, config, previousResults, usePattern, usePremium, analysis]);

  const handleRemoveGame = (index: number) => {
    setGames(games.filter((_, i) => i !== index));
  };

  const handleCopyAll = () => {
    const text = games
      .map((g, i) => `${i + 1}. ${g.numbers.join(', ')}`)
      .join('\n');
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleSave = () => {
    if (onSave && games.length > 0) {
      onSave(games.map((g) => g.numbers));
    }
  };

  const getScoreColor = (score: number) => {
    if (score >= 80) return 'from-green-500 to-emerald-600';
    if (score >= 60) return 'from-blue-500 to-cyan-600';
    if (score >= 40) return 'from-yellow-500 to-orange-500';
    return 'from-gray-400 to-gray-500';
  };

  const getScoreLabel = (score: number) => {
    if (score >= 80) return '최상';
    if (score >= 60) return '우수';
    if (score >= 40) return '보통';
    return '낮음';
  };

  return (
    <Card className="relative overflow-hidden border-0 shadow-xl bg-gradient-to-br from-card via-card to-muted/20">
      {/* 배경 장식 */}
      <div className="absolute top-0 right-0 w-48 h-48 bg-gradient-to-bl from-purple-500/10 to-transparent rounded-full -translate-y-1/2 translate-x-1/2" />
      <div className="absolute bottom-0 left-0 w-40 h-40 bg-gradient-to-tr from-blue-500/10 to-transparent rounded-full translate-y-1/2 -translate-x-1/2" />

      <CardHeader className="relative">
        <CardTitle className="flex items-center gap-3">
          <div className="p-2.5 rounded-xl bg-gradient-to-br from-purple-500 to-pink-500 shadow-lg shadow-purple-500/25">
            <Sparkles className="h-5 w-5 text-white" />
          </div>
          <div>
            <span className="text-xl font-bold">AI 번호 생성기</span>
            <p className="text-sm text-muted-foreground font-normal mt-0.5">
              통계 기반 스마트 번호 추천
            </p>
          </div>
        </CardTitle>
      </CardHeader>

      <CardContent className="relative space-y-6">
        {/* 생성 옵션 */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {/* 게임 수 */}
          <div className="space-y-2">
            <Label className="text-xs text-muted-foreground">게임 수</Label>
            <Select
              value={gameCount}
              onValueChange={(v) => setGameCount(v as typeof gameCount)}
            >
              <SelectTrigger className="bg-muted/50 border-0">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="1">1게임</SelectItem>
                <SelectItem value="5">5게임</SelectItem>
                <SelectItem value="10">10게임</SelectItem>
                <SelectItem value="20">20게임</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* 패턴 분석 */}
          <OptionCard
            icon={<TrendingUp className="h-4 w-4" />}
            label="패턴 분석"
            description="통계 기반"
            enabled={usePattern}
            onChange={setUsePattern}
          />

          {/* 프리미엄 모드 */}
          <OptionCard
            icon={<Crown className="h-4 w-4" />}
            label="프리미엄"
            description="인기번호 회피"
            enabled={usePremium}
            onChange={setUsePremium}
            isPremium={!isPremium}
          />

          {/* AI 추천 */}
          <OptionCard
            icon={<Brain className="h-4 w-4" />}
            label="AI 추천"
            description="머신러닝"
            enabled={useAI}
            onChange={setUseAI}
            isPremium={!isPremium}
            badge="BETA"
          />
        </div>

        {/* 생성 버튼 */}
        <Button
          onClick={handleGenerate}
          disabled={isGenerating}
          size="lg"
          className={cn(
            'w-full h-14 text-lg font-bold relative overflow-hidden',
            'bg-gradient-to-r from-purple-600 via-pink-600 to-purple-600',
            'hover:from-purple-700 hover:via-pink-700 hover:to-purple-700',
            'shadow-lg shadow-purple-500/25 hover:shadow-xl hover:shadow-purple-500/30',
            'transition-all duration-300'
          )}
        >
          {/* 애니메이션 배경 */}
          <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent animate-shimmer" />

          <span className="relative flex items-center justify-center gap-2">
            {isGenerating ? (
              <>
                <RefreshCw className="h-5 w-5 animate-spin" />
                AI가 분석 중...
              </>
            ) : (
              <>
                <Rocket className="h-5 w-5" />
                번호 생성하기
              </>
            )}
          </span>
        </Button>

        {/* 생성된 번호 */}
        {games.length > 0 && (
          <div className="space-y-4">
            {/* 헤더 */}
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Target className="h-5 w-5 text-primary" />
                <span className="font-bold">생성된 번호</span>
                <Badge
                  variant="outline"
                  className="bg-primary/10 border-primary/30"
                >
                  {games.length}게임
                </Badge>
              </div>
              <div className="flex gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={handleCopyAll}
                  className="gap-1"
                >
                  {copied ? (
                    <>
                      <Check className="h-4 w-4 text-green-500" />
                      복사됨
                    </>
                  ) : (
                    <>
                      <Copy className="h-4 w-4" />
                      복사
                    </>
                  )}
                </Button>
                {onSave && (
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={handleSave}
                    className="gap-1"
                  >
                    <Save className="h-4 w-4" />
                    저장
                  </Button>
                )}
              </div>
            </div>

            {/* 게임 리스트 */}
            <div className="space-y-3">
              {games.map((game, index) => (
                <div
                  key={index}
                  className={cn(
                    'relative overflow-hidden rounded-xl p-4',
                    'bg-gradient-to-r from-muted/50 via-muted/30 to-transparent',
                    'border border-border/50',
                    'hover:border-primary/30 hover:shadow-lg',
                    'transition-all duration-300 group'
                  )}
                >
                  {/* 순위 배지 */}
                  <div className="absolute top-0 left-0 w-8 h-8 flex items-center justify-center">
                    <div
                      className={cn(
                        'w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold',
                        index === 0
                          ? 'bg-gradient-to-br from-yellow-400 to-orange-500 text-white'
                          : index === 1
                          ? 'bg-gradient-to-br from-gray-300 to-gray-400 text-gray-800'
                          : index === 2
                          ? 'bg-gradient-to-br from-amber-600 to-amber-700 text-white'
                          : 'bg-muted text-muted-foreground'
                      )}
                    >
                      {index + 1}
                    </div>
                  </div>

                  <div className="flex items-center justify-between pl-8">
                    {/* 번호 */}
                    <LottoNumbers numbers={game.numbers} size="sm" animated={false} />

                    {/* 점수 및 액션 */}
                    <div className="flex items-center gap-3">
                      {/* 점수 */}
                      <div className="text-right">
                        <div
                          className={cn(
                            'text-lg font-bold bg-gradient-to-r bg-clip-text text-transparent',
                            getScoreColor(game.score)
                          )}
                        >
                          {game.score}점
                        </div>
                        <div className="text-[10px] text-muted-foreground">
                          {getScoreLabel(game.score)}
                        </div>
                      </div>

                      {/* 삭제 버튼 */}
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => handleRemoveGame(index)}
                        className="opacity-0 group-hover:opacity-100 transition-opacity"
                      >
                        <Trash2 className="h-4 w-4 text-muted-foreground hover:text-destructive" />
                      </Button>
                    </div>
                  </div>

                  {/* 통계 미니바 */}
                  <div className="mt-3 pt-3 border-t border-border/50 flex gap-4 text-xs text-muted-foreground">
                    <span>
                      합계: <strong className="text-foreground">{game.stats.sum}</strong>
                    </span>
                    <span>
                      홀수: <strong className="text-foreground">{game.stats.oddCount}</strong>개
                    </span>
                    <span>
                      저번호: <strong className="text-foreground">{game.stats.lowCount}</strong>개
                    </span>
                  </div>
                </div>
              ))}
            </div>

            {/* 전체 통계 */}
            <div className="grid grid-cols-4 gap-3">
              <StatCard
                label="평균 점수"
                value={`${(games.reduce((sum, g) => sum + g.score, 0) / games.length).toFixed(0)}점`}
                icon={<Target className="h-4 w-4" />}
                color="purple"
              />
              <StatCard
                label="평균 합계"
                value={Math.round(
                  games.reduce((sum, g) => sum + g.stats.sum, 0) / games.length
                ).toString()}
                icon={<TrendingUp className="h-4 w-4" />}
                color="blue"
              />
              <StatCard
                label="커버리지"
                value={`${((new Set(games.flatMap((g) => g.numbers)).size / 45) * 100).toFixed(0)}%`}
                icon={<Zap className="h-4 w-4" />}
                color="green"
              />
              <StatCard
                label="사용 번호"
                value={`${new Set(games.flatMap((g) => g.numbers)).size}개`}
                icon={<Sparkles className="h-4 w-4" />}
                color="orange"
              />
            </div>
          </div>
        )}

        {/* 빈 상태 */}
        {games.length === 0 && (
          <div className="text-center py-8">
            <div className="w-16 h-16 mx-auto mb-4 rounded-2xl bg-gradient-to-br from-purple-500/20 to-pink-500/20 flex items-center justify-center">
              <Sparkles className="h-8 w-8 text-purple-500" />
            </div>
            <p className="text-muted-foreground">
              위 버튼을 클릭하여 번호를 생성하세요
            </p>
          </div>
        )}
      </CardContent>
    </Card>
  );
}

// 옵션 카드 컴포넌트
function OptionCard({
  icon,
  label,
  description,
  enabled,
  onChange,
  isPremium,
  badge,
}: {
  icon: React.ReactNode;
  label: string;
  description: string;
  enabled: boolean;
  onChange: (enabled: boolean) => void;
  isPremium?: boolean;
  badge?: string;
}) {
  return (
    <div
      className={cn(
        'p-3 rounded-xl border transition-all cursor-pointer',
        enabled
          ? 'bg-primary/10 border-primary/30'
          : 'bg-muted/50 border-transparent hover:border-border',
        isPremium && 'opacity-60 cursor-not-allowed'
      )}
      onClick={() => !isPremium && onChange(!enabled)}
    >
      <div className="flex items-center justify-between mb-2">
        <div
          className={cn(
            'p-1.5 rounded-lg',
            enabled ? 'bg-primary/20 text-primary' : 'bg-muted text-muted-foreground'
          )}
        >
          {icon}
        </div>
        <Switch
          checked={enabled}
          onCheckedChange={onChange}
          disabled={isPremium}
          className="scale-75"
        />
      </div>
      <div className="flex items-center gap-1.5">
        <span className="text-sm font-medium">{label}</span>
        {badge && (
          <Badge
            variant="outline"
            className="text-[8px] px-1 py-0 h-4 border-purple-500 text-purple-500"
          >
            {badge}
          </Badge>
        )}
      </div>
      <span className="text-[10px] text-muted-foreground">{description}</span>
    </div>
  );
}

// 통계 카드 컴포넌트
function StatCard({
  label,
  value,
  icon,
  color,
}: {
  label: string;
  value: string;
  icon: React.ReactNode;
  color: 'purple' | 'blue' | 'green' | 'orange';
}) {
  const colorClasses = {
    purple: 'from-purple-500/20 to-pink-500/20 text-purple-600 dark:text-purple-400',
    blue: 'from-blue-500/20 to-cyan-500/20 text-blue-600 dark:text-blue-400',
    green: 'from-green-500/20 to-emerald-500/20 text-green-600 dark:text-green-400',
    orange: 'from-orange-500/20 to-amber-500/20 text-orange-600 dark:text-orange-400',
  };

  return (
    <div
      className={cn(
        'p-3 rounded-xl bg-gradient-to-br',
        colorClasses[color].split(' ')[0],
        colorClasses[color].split(' ')[1]
      )}
    >
      <div className="flex items-center gap-1.5 mb-1">
        <span className={colorClasses[color].split(' ').slice(2).join(' ')}>
          {icon}
        </span>
        <span className="text-[10px] text-muted-foreground">{label}</span>
      </div>
      <div className={cn('text-lg font-bold', colorClasses[color].split(' ').slice(2).join(' '))}>
        {value}
      </div>
    </div>
  );
}
