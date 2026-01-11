'use client';

import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Checkbox } from '@/components/ui/checkbox';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion';
import { Settings, RotateCcw, Info } from 'lucide-react';
import type { FilterConfig } from '@/types/lotto';
import { DEFAULT_FILTER_CONFIG } from '@/types/lotto';

interface FilterPanelProps {
  config: FilterConfig;
  onChange: (config: FilterConfig) => void;
  onReset?: () => void;
}

export function FilterPanel({ config, onChange, onReset }: FilterPanelProps) {
  const handleToggle = (
    key: keyof FilterConfig,
    enabled: boolean
  ) => {
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
      <CardContent className="space-y-4">
        <Accordion type="single" collapsible defaultValue="basic">
          {/* 기본 필터 */}
          <AccordionItem value="basic">
            <AccordionTrigger>기본 필터</AccordionTrigger>
            <AccordionContent className="space-y-4 pt-2">
              {/* 합계 범위 */}
              <div className="flex items-center justify-between">
                <div>
                  <Label className="text-sm font-medium">합계 범위</Label>
                  <p className="text-xs text-muted-foreground">
                    6개 번호 합계 {config.sumRange.min}~{config.sumRange.max}
                  </p>
                </div>
                <Switch
                  checked={config.sumRange.enabled}
                  onCheckedChange={(checked) =>
                    handleToggle('sumRange', checked)
                  }
                />
              </div>

              {/* 홀짝 비율 */}
              <div className="flex items-center justify-between">
                <div>
                  <Label className="text-sm font-medium">홀짝 비율</Label>
                  <p className="text-xs text-muted-foreground">
                    홀수 {config.oddEvenRatio.allowedRatios.join(',')}개 허용
                  </p>
                </div>
                <Switch
                  checked={config.oddEvenRatio.enabled}
                  onCheckedChange={(checked) =>
                    handleToggle('oddEvenRatio', checked)
                  }
                />
              </div>

              {/* 저고 비율 */}
              <div className="flex items-center justify-between">
                <div>
                  <Label className="text-sm font-medium">저고 비율</Label>
                  <p className="text-xs text-muted-foreground">
                    저번호(1-22) {config.lowHighRatio.allowedRatios.join(',')}개
                  </p>
                </div>
                <Switch
                  checked={config.lowHighRatio.enabled}
                  onCheckedChange={(checked) =>
                    handleToggle('lowHighRatio', checked)
                  }
                />
              </div>

              {/* AC값 */}
              <div className="flex items-center justify-between">
                <div>
                  <Label className="text-sm font-medium">AC값</Label>
                  <p className="text-xs text-muted-foreground">
                    최소 {config.acValueMin.min} 이상
                  </p>
                </div>
                <Switch
                  checked={config.acValueMin.enabled}
                  onCheckedChange={(checked) =>
                    handleToggle('acValueMin', checked)
                  }
                />
              </div>
            </AccordionContent>
          </AccordionItem>

          {/* 패턴 필터 */}
          <AccordionItem value="pattern">
            <AccordionTrigger>패턴 필터</AccordionTrigger>
            <AccordionContent className="space-y-4 pt-2">
              {/* 연속번호 */}
              <div className="flex items-center justify-between">
                <div>
                  <Label className="text-sm font-medium">연속번호 제한</Label>
                  <p className="text-xs text-muted-foreground">
                    최대 {config.consecutiveMax.max}개 연속
                  </p>
                </div>
                <Switch
                  checked={config.consecutiveMax.enabled}
                  onCheckedChange={(checked) =>
                    handleToggle('consecutiveMax', checked)
                  }
                />
              </div>

              {/* 동일 끝자리 */}
              <div className="flex items-center justify-between">
                <div>
                  <Label className="text-sm font-medium">동일 끝자리</Label>
                  <p className="text-xs text-muted-foreground">
                    최대 {config.sameEndingMax.max}개 동일
                  </p>
                </div>
                <Switch
                  checked={config.sameEndingMax.enabled}
                  onCheckedChange={(checked) =>
                    handleToggle('sameEndingMax', checked)
                  }
                />
              </div>

              {/* 동일 십단위 */}
              <div className="flex items-center justify-between">
                <div>
                  <Label className="text-sm font-medium">동일 십단위</Label>
                  <p className="text-xs text-muted-foreground">
                    최대 {config.sameTensMax.max}개 동일
                  </p>
                </div>
                <Switch
                  checked={config.sameTensMax.enabled}
                  onCheckedChange={(checked) =>
                    handleToggle('sameTensMax', checked)
                  }
                />
              </div>
            </AccordionContent>
          </AccordionItem>

          {/* 이전 회차 필터 */}
          <AccordionItem value="previous">
            <AccordionTrigger>이전 회차 필터</AccordionTrigger>
            <AccordionContent className="space-y-4 pt-2">
              <div className="flex items-center justify-between">
                <div>
                  <Label className="text-sm font-medium">이전 회차 중복</Label>
                  <p className="text-xs text-muted-foreground">
                    최근 {config.excludePrevious.count}회차와 최대{' '}
                    {config.excludePrevious.maxOverlap}개 중복
                  </p>
                </div>
                <Switch
                  checked={config.excludePrevious.enabled}
                  onCheckedChange={(checked) =>
                    handleToggle('excludePrevious', checked)
                  }
                />
              </div>
            </AccordionContent>
          </AccordionItem>
        </Accordion>

        {/* 활성화된 필터 배지 */}
        <div className="pt-2 border-t">
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
