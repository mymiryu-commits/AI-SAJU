'use client';

import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Switch } from '@/components/ui/switch';
import { Slider } from '@/components/ui/slider';
import {
  Settings,
  RotateCcw,
  Crown,
  Lock,
  ChevronDown,
  ChevronUp,
  Sparkles,
  Zap,
  Target,
  TrendingUp,
  Shield,
  Star,
} from 'lucide-react';
import { cn } from '@/lib/utils';
import type { FilterConfig } from '@/types/lotto';
import { DEFAULT_FILTER_CONFIG } from '@/types/lotto';

interface FilterPanelProps {
  config: FilterConfig;
  onChange: (config: FilterConfig) => void;
  onReset?: () => void;
  isPremium?: boolean;
  onUpgrade?: () => void;
}

export function FilterPanel({
  config,
  onChange,
  onReset,
  isPremium = false,
  onUpgrade,
}: FilterPanelProps) {
  const [expandedSections, setExpandedSections] = useState<string[]>(['basic']);

  const handleToggle = (key: keyof FilterConfig, enabled: boolean) => {
    onChange({
      ...config,
      [key]: {
        ...config[key],
        enabled,
      },
    });
  };

  const handleRangeChange = (
    key: 'sumRange',
    field: 'min' | 'max',
    value: number
  ) => {
    onChange({
      ...config,
      [key]: {
        ...config[key],
        [field]: value,
      },
    });
  };

  const handleMaxChange = (
    key: 'consecutiveMax' | 'sameEndingMax' | 'sameTensMax',
    value: number
  ) => {
    onChange({
      ...config,
      [key]: {
        ...config[key],
        max: value,
      },
    });
  };

  const handleMinChange = (key: 'acValueMin', value: number) => {
    onChange({
      ...config,
      [key]: {
        ...config[key],
        min: value,
      },
    });
  };

  const handlePreviousChange = (field: 'count' | 'maxOverlap', value: number) => {
    onChange({
      ...config,
      excludePrevious: {
        ...config.excludePrevious,
        [field]: value,
      },
    });
  };

  const handleReset = () => {
    onChange(DEFAULT_FILTER_CONFIG);
    onReset?.();
  };

  const toggleSection = (section: string) => {
    setExpandedSections((prev) =>
      prev.includes(section)
        ? prev.filter((s) => s !== section)
        : [...prev, section]
    );
  };

  const activeFiltersCount = Object.values(config).filter(
    (f) => typeof f === 'object' && 'enabled' in f && f.enabled
  ).length;

  return (
    <Card className="relative overflow-hidden border-0 shadow-xl bg-gradient-to-br from-card via-card to-muted/20">
      {/* 배경 장식 */}
      <div className="absolute top-0 right-0 w-40 h-40 bg-gradient-to-bl from-amber-500/10 to-transparent rounded-full -translate-y-1/2 translate-x-1/2" />
      <div className="absolute bottom-0 left-0 w-32 h-32 bg-gradient-to-tr from-orange-500/10 to-transparent rounded-full translate-y-1/2 -translate-x-1/2" />

      <CardHeader className="relative pb-3">
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center gap-2 text-lg">
            <div className="p-2 rounded-xl bg-gradient-to-br from-amber-400 to-orange-500 shadow-lg shadow-orange-500/25">
              <Settings className="h-4 w-4 text-white" />
            </div>
            <span>필터 설정</span>
            <Badge
              variant="outline"
              className="ml-2 bg-gradient-to-r from-amber-500/10 to-orange-500/10 border-amber-500/30"
            >
              {activeFiltersCount}개 활성
            </Badge>
          </CardTitle>
          <Button
            variant="ghost"
            size="sm"
            onClick={handleReset}
            className="hover:bg-destructive/10 hover:text-destructive"
          >
            <RotateCcw className="h-4 w-4 mr-1" />
            초기화
          </Button>
        </div>
      </CardHeader>

      <CardContent className="relative space-y-4">
        {/* 기본 필터 섹션 */}
        <FilterSection
          title="기본 필터"
          icon={<Target className="h-4 w-4" />}
          isExpanded={expandedSections.includes('basic')}
          onToggle={() => toggleSection('basic')}
        >
          {/* 합계 범위 */}
          <FilterItem
            label="합계 범위"
            description={`6개 번호 합계: ${config.sumRange.min} ~ ${config.sumRange.max}`}
            icon={<TrendingUp className="h-4 w-4 text-blue-500" />}
            enabled={config.sumRange.enabled}
            onToggle={(enabled) => handleToggle('sumRange', enabled)}
          >
            <div className="space-y-3 pt-2">
              <div className="flex items-center justify-between text-xs text-muted-foreground">
                <span>최소: {config.sumRange.min}</span>
                <span>최대: {config.sumRange.max}</span>
              </div>
              <div className="flex gap-4">
                <Slider
                  value={[config.sumRange.min]}
                  min={21}
                  max={200}
                  step={1}
                  onValueChange={([v]) => handleRangeChange('sumRange', 'min', v)}
                  className="flex-1"
                  disabled={!config.sumRange.enabled}
                />
                <Slider
                  value={[config.sumRange.max]}
                  min={100}
                  max={255}
                  step={1}
                  onValueChange={([v]) => handleRangeChange('sumRange', 'max', v)}
                  className="flex-1"
                  disabled={!config.sumRange.enabled}
                />
              </div>
              <div className="flex justify-center gap-2">
                {[
                  { label: '보수적', min: 100, max: 150 },
                  { label: '균형', min: 100, max: 170 },
                  { label: '공격적', min: 80, max: 190 },
                ].map((preset) => (
                  <Button
                    key={preset.label}
                    variant="outline"
                    size="sm"
                    className="text-xs h-7"
                    onClick={() => {
                      handleRangeChange('sumRange', 'min', preset.min);
                      handleRangeChange('sumRange', 'max', preset.max);
                    }}
                    disabled={!config.sumRange.enabled}
                  >
                    {preset.label}
                  </Button>
                ))}
              </div>
            </div>
          </FilterItem>

          {/* 홀짝 비율 */}
          <FilterItem
            label="홀짝 비율"
            description={`홀수 ${config.oddEvenRatio.allowedRatios.join(', ')}개 허용`}
            icon={<span className="text-sm">🎯</span>}
            enabled={config.oddEvenRatio.enabled}
            onToggle={(enabled) => handleToggle('oddEvenRatio', enabled)}
          />

          {/* 저고 비율 */}
          <FilterItem
            label="저고 비율"
            description={`저번호(1-22) ${config.lowHighRatio.allowedRatios.join(', ')}개`}
            icon={<span className="text-sm">⚖️</span>}
            enabled={config.lowHighRatio.enabled}
            onToggle={(enabled) => handleToggle('lowHighRatio', enabled)}
          />
        </FilterSection>

        {/* 고급 필터 섹션 */}
        <FilterSection
          title="고급 필터"
          icon={<Sparkles className="h-4 w-4" />}
          isExpanded={expandedSections.includes('advanced')}
          onToggle={() => toggleSection('advanced')}
          isPremium={!isPremium}
        >
          {/* 연속번호 제한 */}
          <FilterItem
            label="연속번호 제한"
            description={`최대 ${config.consecutiveMax.max}개 연속 허용`}
            icon={<span className="text-sm">🔢</span>}
            enabled={config.consecutiveMax.enabled}
            onToggle={(enabled) => handleToggle('consecutiveMax', enabled)}
            locked={!isPremium}
          >
            <div className="pt-2">
              <Slider
                value={[config.consecutiveMax.max]}
                min={0}
                max={4}
                step={1}
                onValueChange={([v]) => handleMaxChange('consecutiveMax', v)}
                disabled={!config.consecutiveMax.enabled || !isPremium}
              />
              <div className="flex justify-between text-xs text-muted-foreground mt-1">
                <span>제한없음</span>
                <span>최대 4개</span>
              </div>
            </div>
          </FilterItem>

          {/* 동일 끝자리 */}
          <FilterItem
            label="동일 끝자리"
            description={`최대 ${config.sameEndingMax.max}개 동일 허용`}
            icon={<span className="text-sm">🔚</span>}
            enabled={config.sameEndingMax.enabled}
            onToggle={(enabled) => handleToggle('sameEndingMax', enabled)}
            locked={!isPremium}
          >
            <div className="pt-2">
              <Slider
                value={[config.sameEndingMax.max]}
                min={1}
                max={4}
                step={1}
                onValueChange={([v]) => handleMaxChange('sameEndingMax', v)}
                disabled={!config.sameEndingMax.enabled || !isPremium}
              />
            </div>
          </FilterItem>

          {/* 동일 십단위 */}
          <FilterItem
            label="동일 십단위"
            description={`최대 ${config.sameTensMax.max}개 동일 허용`}
            icon={<span className="text-sm">🔟</span>}
            enabled={config.sameTensMax.enabled}
            onToggle={(enabled) => handleToggle('sameTensMax', enabled)}
            locked={!isPremium}
          >
            <div className="pt-2">
              <Slider
                value={[config.sameTensMax.max]}
                min={1}
                max={5}
                step={1}
                onValueChange={([v]) => handleMaxChange('sameTensMax', v)}
                disabled={!config.sameTensMax.enabled || !isPremium}
              />
            </div>
          </FilterItem>
        </FilterSection>

        {/* 프로 필터 섹션 */}
        <FilterSection
          title="프로 필터"
          icon={<Shield className="h-4 w-4" />}
          isExpanded={expandedSections.includes('pro')}
          onToggle={() => toggleSection('pro')}
          isPremium={!isPremium}
          badge="PRO"
        >
          {/* AC값 */}
          <FilterItem
            label="AC값 (복잡도)"
            description={`최소 ${config.acValueMin.min} 이상`}
            icon={<span className="text-sm">📊</span>}
            enabled={config.acValueMin.enabled}
            onToggle={(enabled) => handleToggle('acValueMin', enabled)}
            locked={!isPremium}
          >
            <div className="pt-2">
              <Slider
                value={[config.acValueMin.min]}
                min={4}
                max={10}
                step={1}
                onValueChange={([v]) => handleMinChange('acValueMin', v)}
                disabled={!config.acValueMin.enabled || !isPremium}
              />
              <div className="flex justify-between text-xs text-muted-foreground mt-1">
                <span>낮음 (4)</span>
                <span>높음 (10)</span>
              </div>
            </div>
          </FilterItem>

          {/* 이전 회차 중복 */}
          <FilterItem
            label="이전 회차 중복 제한"
            description={`최근 ${config.excludePrevious.count}회차와 최대 ${config.excludePrevious.maxOverlap}개 중복`}
            icon={<span className="text-sm">🔄</span>}
            enabled={config.excludePrevious.enabled}
            onToggle={(enabled) => handleToggle('excludePrevious', enabled)}
            locked={!isPremium}
          >
            <div className="pt-2 space-y-3">
              <div>
                <Label className="text-xs text-muted-foreground">참조 회차 수</Label>
                <Slider
                  value={[config.excludePrevious.count]}
                  min={1}
                  max={10}
                  step={1}
                  onValueChange={([v]) => handlePreviousChange('count', v)}
                  disabled={!config.excludePrevious.enabled || !isPremium}
                />
              </div>
              <div>
                <Label className="text-xs text-muted-foreground">최대 중복 허용</Label>
                <Slider
                  value={[config.excludePrevious.maxOverlap]}
                  min={0}
                  max={5}
                  step={1}
                  onValueChange={([v]) => handlePreviousChange('maxOverlap', v)}
                  disabled={!config.excludePrevious.enabled || !isPremium}
                />
              </div>
            </div>
          </FilterItem>
        </FilterSection>

        {/* 프리미엄 업그레이드 배너 */}
        {!isPremium && (
          <div className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-amber-500 via-orange-500 to-amber-600 p-4 text-white shadow-xl shadow-orange-500/25">
            <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full -translate-y-1/2 translate-x-1/2" />
            <div className="absolute bottom-0 left-0 w-24 h-24 bg-white/10 rounded-full translate-y-1/2 -translate-x-1/2" />

            <div className="relative flex items-center gap-4">
              <div className="flex-shrink-0 p-3 bg-white/20 rounded-xl backdrop-blur-sm">
                <Crown className="h-6 w-6" />
              </div>
              <div className="flex-1">
                <h4 className="font-bold text-lg">프리미엄으로 업그레이드</h4>
                <p className="text-sm text-white/80">
                  모든 필터 범위 조절 + 백테스트 + 자동 당첨 확인
                </p>
              </div>
              <Button
                onClick={onUpgrade}
                className="bg-white text-orange-600 hover:bg-white/90 shadow-lg"
              >
                <Zap className="h-4 w-4 mr-1" />
                업그레이드
              </Button>
            </div>
          </div>
        )}

        {/* 활성화된 필터 요약 */}
        <div className="p-4 rounded-xl bg-muted/50 border border-border/50">
          <div className="flex items-center gap-2 mb-3">
            <Star className="h-4 w-4 text-amber-500" />
            <Label className="text-sm font-medium">활성화된 필터</Label>
          </div>
          <div className="flex flex-wrap gap-1.5">
            {config.sumRange.enabled && (
              <FilterBadge label="합계" color="blue" />
            )}
            {config.oddEvenRatio.enabled && (
              <FilterBadge label="홀짝" color="green" />
            )}
            {config.lowHighRatio.enabled && (
              <FilterBadge label="저고" color="purple" />
            )}
            {config.acValueMin.enabled && (
              <FilterBadge label="AC값" color="orange" isPremium={!isPremium} />
            )}
            {config.consecutiveMax.enabled && (
              <FilterBadge label="연속" color="red" isPremium={!isPremium} />
            )}
            {config.sameEndingMax.enabled && (
              <FilterBadge label="끝자리" color="pink" isPremium={!isPremium} />
            )}
            {config.sameTensMax.enabled && (
              <FilterBadge label="십단위" color="cyan" isPremium={!isPremium} />
            )}
            {config.excludePrevious.enabled && (
              <FilterBadge label="이전회차" color="yellow" isPremium={!isPremium} />
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

// 필터 섹션 컴포넌트
interface FilterSectionProps {
  title: string;
  icon: React.ReactNode;
  isExpanded: boolean;
  onToggle: () => void;
  isPremium?: boolean;
  badge?: string;
  children: React.ReactNode;
}

function FilterSection({
  title,
  icon,
  isExpanded,
  onToggle,
  isPremium,
  badge,
  children,
}: FilterSectionProps) {
  return (
    <div className="rounded-xl border border-border/50 overflow-hidden">
      <button
        onClick={onToggle}
        className={cn(
          'w-full flex items-center justify-between p-3',
          'bg-gradient-to-r from-muted/50 to-transparent',
          'hover:from-muted transition-colors'
        )}
      >
        <div className="flex items-center gap-2">
          {icon}
          <span className="font-medium text-sm">{title}</span>
          {isPremium && (
            <Badge className="bg-gradient-to-r from-amber-500 to-orange-500 text-white text-[10px] px-1.5 py-0">
              <Lock className="h-2.5 w-2.5 mr-0.5" />
              PREMIUM
            </Badge>
          )}
          {badge && !isPremium && (
            <Badge variant="outline" className="text-[10px] px-1.5 py-0 border-purple-500 text-purple-500">
              {badge}
            </Badge>
          )}
        </div>
        {isExpanded ? (
          <ChevronUp className="h-4 w-4 text-muted-foreground" />
        ) : (
          <ChevronDown className="h-4 w-4 text-muted-foreground" />
        )}
      </button>
      {isExpanded && (
        <div className={cn('p-3 space-y-3', isPremium && 'opacity-60')}>
          {children}
        </div>
      )}
    </div>
  );
}

// 필터 아이템 컴포넌트
interface FilterItemProps {
  label: string;
  description: string;
  icon: React.ReactNode;
  enabled: boolean;
  onToggle: (enabled: boolean) => void;
  locked?: boolean;
  children?: React.ReactNode;
}

function FilterItem({
  label,
  description,
  icon,
  enabled,
  onToggle,
  locked,
  children,
}: FilterItemProps) {
  return (
    <div
      className={cn(
        'p-3 rounded-lg transition-all',
        enabled ? 'bg-primary/5 border border-primary/20' : 'bg-muted/30',
        locked && 'cursor-not-allowed'
      )}
    >
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-lg bg-background flex items-center justify-center shadow-sm">
            {icon}
          </div>
          <div>
            <div className="flex items-center gap-2">
              <Label className="text-sm font-medium">{label}</Label>
              {locked && <Lock className="h-3 w-3 text-muted-foreground" />}
            </div>
            <p className="text-xs text-muted-foreground">{description}</p>
          </div>
        </div>
        <Switch
          checked={enabled}
          onCheckedChange={onToggle}
          disabled={locked}
        />
      </div>
      {children && enabled && <div className="mt-3">{children}</div>}
    </div>
  );
}

// 필터 배지 컴포넌트
function FilterBadge({
  label,
  color,
  isPremium,
}: {
  label: string;
  color: string;
  isPremium?: boolean;
}) {
  const colorClasses: Record<string, string> = {
    blue: 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400',
    green: 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400',
    purple: 'bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-400',
    orange: 'bg-orange-100 text-orange-700 dark:bg-orange-900/30 dark:text-orange-400',
    red: 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400',
    pink: 'bg-pink-100 text-pink-700 dark:bg-pink-900/30 dark:text-pink-400',
    cyan: 'bg-cyan-100 text-cyan-700 dark:bg-cyan-900/30 dark:text-cyan-400',
    yellow: 'bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400',
  };

  return (
    <span
      className={cn(
        'inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium',
        colorClasses[color] || colorClasses.blue,
        isPremium && 'opacity-50'
      )}
    >
      {isPremium && <Lock className="h-2.5 w-2.5" />}
      {label}
    </span>
  );
}

// 번호 선택 컴포넌트
interface NumberSelectorProps {
  selected: number[];
  onChange: (numbers: number[]) => void;
  max?: number;
  label?: string;
}

export function NumberSelector({
  selected,
  onChange,
  max = 6,
  label = '번호 선택',
}: NumberSelectorProps) {
  const toggleNumber = (num: number) => {
    if (selected.includes(num)) {
      onChange(selected.filter((n) => n !== num));
    } else if (selected.length < max) {
      onChange([...selected, num].sort((a, b) => a - b));
    }
  };

  const getBallColor = (num: number) => {
    if (num <= 10) return 'bg-gradient-to-br from-yellow-300 to-yellow-500 text-yellow-900';
    if (num <= 20) return 'bg-gradient-to-br from-blue-400 to-blue-600 text-white';
    if (num <= 30) return 'bg-gradient-to-br from-red-400 to-red-600 text-white';
    if (num <= 40) return 'bg-gradient-to-br from-gray-400 to-gray-600 text-white';
    return 'bg-gradient-to-br from-green-400 to-green-600 text-white';
  };

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <Label className="text-sm font-medium">{label}</Label>
        <Badge variant="outline">
          {selected.length}/{max}
        </Badge>
      </div>
      <div className="grid grid-cols-9 gap-1.5">
        {Array.from({ length: 45 }, (_, i) => i + 1).map((num) => {
          const isSelected = selected.includes(num);
          return (
            <button
              key={num}
              onClick={() => toggleNumber(num)}
              className={cn(
                'w-8 h-8 rounded-full text-xs font-bold transition-all duration-200',
                'shadow-sm hover:shadow-md hover:scale-110',
                isSelected
                  ? cn(getBallColor(num), 'ring-2 ring-offset-2 ring-primary')
                  : 'bg-muted hover:bg-muted/80 text-muted-foreground'
              )}
            >
              {num}
            </button>
          );
        })}
      </div>
      {selected.length > 0 && (
        <div className="flex items-center justify-between p-2 bg-muted/50 rounded-lg">
          <span className="text-xs text-muted-foreground">선택됨:</span>
          <div className="flex gap-1">
            {selected.map((num) => (
              <span
                key={num}
                className={cn(
                  'w-6 h-6 rounded-full text-[10px] font-bold flex items-center justify-center',
                  getBallColor(num)
                )}
              >
                {num}
              </span>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
