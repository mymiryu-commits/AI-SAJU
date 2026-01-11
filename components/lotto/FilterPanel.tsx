'use client';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Checkbox } from '@/components/ui/checkbox';
import { Settings, RotateCcw } from 'lucide-react';
import type { FilterConfig } from '@/types/lotto';
import { DEFAULT_FILTER_CONFIG } from '@/types/lotto';

interface FilterPanelProps {
  config: FilterConfig;
  onChange: (config: FilterConfig) => void;
  onReset?: () => void;
}

export function FilterPanel({ config, onChange, onReset }: FilterPanelProps) {
  const handleToggle = (key: keyof FilterConfig, enabled: boolean) => {
    onChange({
      ...config,
      [key]: {
        ...config[key],
        enabled,
      },
    });
  };

  const handleReset = () => {
    onChange(DEFAULT_FILTER_CONFIG);
    onReset?.();
  };

  const filters = [
    {
      key: 'sumRange' as const,
      label: '합계 범위',
      desc: `6개 번호 합계 ${config.sumRange.min}~${config.sumRange.max}`,
    },
    {
      key: 'oddEvenRatio' as const,
      label: '홀짝 비율',
      desc: `홀수 ${config.oddEvenRatio.allowedRatios.join(',')}개 허용`,
    },
    {
      key: 'lowHighRatio' as const,
      label: '저고 비율',
      desc: `저번호(1-22) ${config.lowHighRatio.allowedRatios.join(',')}개`,
    },
    {
      key: 'acValueMin' as const,
      label: 'AC값',
      desc: `최소 ${config.acValueMin.min} 이상`,
    },
    {
      key: 'consecutiveMax' as const,
      label: '연속번호 제한',
      desc: `최대 ${config.consecutiveMax.max}개 연속`,
    },
    {
      key: 'sameEndingMax' as const,
      label: '동일 끝자리',
      desc: `최대 ${config.sameEndingMax.max}개 동일`,
    },
    {
      key: 'sameTensMax' as const,
      label: '동일 십단위',
      desc: `최대 ${config.sameTensMax.max}개 동일`,
    },
    {
      key: 'excludePrevious' as const,
      label: '이전 회차 중복',
      desc: `최근 ${config.excludePrevious.count}회차와 최대 ${config.excludePrevious.maxOverlap}개 중복`,
    },
  ];

  return (
    <Card>
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center gap-2 text-lg">
            <Settings className="h-5 w-5" />
            필터 설정
          </CardTitle>
          <Button variant="ghost" size="sm" onClick={handleReset}>
            <RotateCcw className="h-4 w-4 mr-1" />
            초기화
          </Button>
        </div>
      </CardHeader>
      <CardContent className="space-y-3">
        {filters.map((filter) => (
          <div
            key={filter.key}
            className="flex items-center justify-between p-2 rounded-lg hover:bg-muted/50"
          >
            <div className="flex items-center gap-3">
              <Checkbox
                id={filter.key}
                checked={config[filter.key].enabled}
                onCheckedChange={(checked) =>
                  handleToggle(filter.key, checked === true)
                }
              />
              <div>
                <Label
                  htmlFor={filter.key}
                  className="text-sm font-medium cursor-pointer"
                >
                  {filter.label}
                </Label>
                <p className="text-xs text-muted-foreground">{filter.desc}</p>
              </div>
            </div>
          </div>
        ))}

        {/* 활성화된 필터 배지 */}
        <div className="pt-3 border-t">
          <Label className="text-xs text-muted-foreground">활성화된 필터</Label>
          <div className="flex flex-wrap gap-1 mt-2">
            {config.sumRange.enabled && (
              <Badge variant="secondary" className="text-xs">
                합계
              </Badge>
            )}
            {config.oddEvenRatio.enabled && (
              <Badge variant="secondary" className="text-xs">
                홀짝
              </Badge>
            )}
            {config.lowHighRatio.enabled && (
              <Badge variant="secondary" className="text-xs">
                저고
              </Badge>
            )}
            {config.acValueMin.enabled && (
              <Badge variant="secondary" className="text-xs">
                AC값
              </Badge>
            )}
            {config.consecutiveMax.enabled && (
              <Badge variant="secondary" className="text-xs">
                연속
              </Badge>
            )}
            {config.sameEndingMax.enabled && (
              <Badge variant="secondary" className="text-xs">
                끝자리
              </Badge>
            )}
            {config.sameTensMax.enabled && (
              <Badge variant="secondary" className="text-xs">
                십단위
              </Badge>
            )}
            {config.excludePrevious.enabled && (
              <Badge variant="secondary" className="text-xs">
                이전회차
              </Badge>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
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

  return (
    <div className="space-y-2">
      <Label className="text-sm font-medium">
        {label} ({selected.length}/{max})
      </Label>
      <div className="grid grid-cols-9 gap-1">
        {Array.from({ length: 45 }, (_, i) => i + 1).map((num) => {
          const isSelected = selected.includes(num);
          return (
            <button
              key={num}
              onClick={() => toggleNumber(num)}
              className={`
                w-8 h-8 rounded text-xs font-medium transition-colors
                ${
                  isSelected
                    ? 'bg-primary text-primary-foreground'
                    : 'bg-muted hover:bg-muted/80'
                }
              `}
            >
              {num}
            </button>
          );
        })}
      </div>
    </div>
  );
}
