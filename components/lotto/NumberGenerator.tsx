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
import { Checkbox } from '@/components/ui/checkbox';
import { Label } from '@/components/ui/label';
import { Sparkles, Zap, RefreshCw, Save, Trash2, Copy, Check } from 'lucide-react';
import { LottoNumbers } from './LottoBall';
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
}

export function NumberGenerator({
  previousResults,
  analysis,
  onSave,
}: NumberGeneratorProps) {
  const [games, setGames] = useState<GeneratedGame[]>([]);
  const [gameCount, setGameCount] = useState<'1' | '5' | '10' | '20'>('5');
  const [usePattern, setUsePattern] = useState(true);
  const [usePremium, setUsePremium] = useState(false);
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
    }, 500);
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

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Sparkles className="h-5 w-5 text-yellow-500" />
          번호 생성기
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* 옵션 */}
        <div className="flex flex-wrap gap-4">
          <div className="space-y-1">
            <Label className="text-xs">게임 수</Label>
            <Select
              value={gameCount}
              onValueChange={(v) => setGameCount(v as typeof gameCount)}
            >
              <SelectTrigger className="w-24">
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

          <div className="flex items-center space-x-2">
            <Checkbox
              id="pattern"
              checked={usePattern}
              onCheckedChange={(checked) => setUsePattern(checked === true)}
            />
            <Label htmlFor="pattern" className="text-sm cursor-pointer">
              패턴 분석 적용
            </Label>
          </div>

          <div className="flex items-center space-x-2">
            <Checkbox
              id="premium"
              checked={usePremium}
              onCheckedChange={(checked) => setUsePremium(checked === true)}
            />
            <Label htmlFor="premium" className="text-sm cursor-pointer">
              프리미엄 모드
            </Label>
            <Badge variant="secondary" className="text-xs">
              인기번호 회피
            </Badge>
          </div>
        </div>

        {/* 생성 버튼 */}
        <Button
          onClick={handleGenerate}
          disabled={isGenerating}
          className="w-full"
          size="lg"
        >
          {isGenerating ? (
            <RefreshCw className="h-4 w-4 mr-2 animate-spin" />
          ) : (
            <Zap className="h-4 w-4 mr-2" />
          )}
          {isGenerating ? '생성 중...' : '번호 생성'}
        </Button>

        {/* 생성된 번호 */}
        {games.length > 0 && (
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium">
                생성된 번호 ({games.length}게임)
              </span>
              <div className="flex gap-2">
                <Button variant="outline" size="sm" onClick={handleCopyAll}>
                  {copied ? (
                    <Check className="h-4 w-4 mr-1" />
                  ) : (
                    <Copy className="h-4 w-4 mr-1" />
                  )}
                  {copied ? '복사됨' : '전체 복사'}
                </Button>
                {onSave && (
                  <Button variant="outline" size="sm" onClick={handleSave}>
                    <Save className="h-4 w-4 mr-1" />
                    저장
                  </Button>
                )}
              </div>
            </div>

            <div className="space-y-2">
              {games.map((game, index) => (
                <div
                  key={index}
                  className="flex items-center justify-between p-3 bg-muted/50 rounded-lg"
                >
                  <div className="flex items-center gap-3">
                    <span className="text-sm font-medium text-muted-foreground w-6">
                      {index + 1}
                    </span>
                    <LottoNumbers numbers={game.numbers} size="sm" />
                  </div>
                  <div className="flex items-center gap-2">
                    <Badge
                      variant={
                        game.score >= 70
                          ? 'default'
                          : game.score >= 50
                          ? 'secondary'
                          : 'outline'
                      }
                      className="text-xs"
                    >
                      {game.score}점
                    </Badge>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleRemoveGame(index)}
                    >
                      <Trash2 className="h-4 w-4 text-muted-foreground" />
                    </Button>
                  </div>
                </div>
              ))}
            </div>

            {/* 통계 요약 */}
            {games.length > 0 && (
              <div className="p-3 bg-muted/30 rounded-lg text-sm">
                <div className="grid grid-cols-2 gap-2 text-muted-foreground">
                  <div>
                    평균 점수:{' '}
                    <span className="text-foreground font-medium">
                      {(games.reduce((sum, g) => sum + g.score, 0) / games.length).toFixed(1)}점
                    </span>
                  </div>
                  <div>
                    평균 합계:{' '}
                    <span className="text-foreground font-medium">
                      {Math.round(
                        games.reduce((sum, g) => sum + g.stats.sum, 0) / games.length
                      )}
                    </span>
                  </div>
                  <div>
                    커버리지:{' '}
                    <span className="text-foreground font-medium">
                      {((new Set(games.flatMap((g) => g.numbers)).size / 45) * 100).toFixed(0)}%
                    </span>
                  </div>
                  <div>
                    사용 번호:{' '}
                    <span className="text-foreground font-medium">
                      {new Set(games.flatMap((g) => g.numbers)).size}개
                    </span>
                  </div>
                </div>
              </div>
            )}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
