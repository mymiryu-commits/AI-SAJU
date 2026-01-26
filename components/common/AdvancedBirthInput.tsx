'use client';

import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Calendar, Clock, User, Sun, Moon, ChevronLeft, ChevronRight, Save, RotateCcw } from 'lucide-react';
import { cn } from '@/lib/utils';

// 시주 옵션
const HOURS = [
  { value: '', label: '모름', emoji: '' },
  { value: '23:30', label: '자시 (23:30~01:30)', emoji: '🐀', branch: '子' },
  { value: '01:30', label: '축시 (01:30~03:30)', emoji: '🐂', branch: '丑' },
  { value: '03:30', label: '인시 (03:30~05:30)', emoji: '🐅', branch: '寅' },
  { value: '05:30', label: '묘시 (05:30~07:30)', emoji: '🐇', branch: '卯' },
  { value: '07:30', label: '진시 (07:30~09:30)', emoji: '🐉', branch: '辰' },
  { value: '09:30', label: '사시 (09:30~11:30)', emoji: '🐍', branch: '巳' },
  { value: '11:30', label: '오시 (11:30~13:30)', emoji: '🐎', branch: '午' },
  { value: '13:30', label: '미시 (13:30~15:30)', emoji: '🐑', branch: '未' },
  { value: '15:30', label: '신시 (15:30~17:30)', emoji: '🐵', branch: '申' },
  { value: '17:30', label: '유시 (17:30~19:30)', emoji: '🐓', branch: '酉' },
  { value: '19:30', label: '술시 (19:30~21:30)', emoji: '🐕', branch: '戌' },
  { value: '21:30', label: '해시 (21:30~23:30)', emoji: '🐷', branch: '亥' },
];

// 연도 옵션 생성
const currentYear = new Date().getFullYear();
const YEARS = Array.from({ length: currentYear - 1919 }, (_, i) => currentYear - i);
const MONTHS = Array.from({ length: 12 }, (_, i) => i + 1);

interface AdvancedBirthInputProps {
  value: {
    name?: string;
    birthDate?: string;
    birthHour?: string;
    gender?: 'male' | 'female';
    calendar?: 'solar' | 'lunar';
  };
  onChange: (value: {
    name?: string;
    birthDate?: string;
    birthHour?: string;
    gender?: 'male' | 'female';
    calendar?: 'solar' | 'lunar';
  }) => void;
  showName?: boolean;
  showGender?: boolean;
  showCalendar?: boolean;
  showHour?: boolean;
  showSaveButton?: boolean;
  storageKey?: string;
  className?: string;
}

export default function AdvancedBirthInput({
  value,
  onChange,
  showName = true,
  showGender = false,
  showCalendar = true,
  showHour = true,
  showSaveButton = true,
  storageKey = 'userBirthInfo',
  className,
}: AdvancedBirthInputProps) {
  const [inputMode, setInputMode] = useState<'dropdown' | 'date'>('dropdown');
  const [year, setYear] = useState<string>('');
  const [month, setMonth] = useState<string>('');
  const [day, setDay] = useState<string>('');
  const [hasSavedInfo, setHasSavedInfo] = useState(false);

  // value에서 year, month, day 추출
  useEffect(() => {
    if (value.birthDate) {
      const [y, m, d] = value.birthDate.split('-');
      setYear(y || '');
      setMonth(m ? String(parseInt(m, 10)) : '');
      setDay(d ? String(parseInt(d, 10)) : '');
    }
  }, [value.birthDate]);

  // 저장된 정보 확인
  useEffect(() => {
    if (storageKey) {
      const saved = localStorage.getItem(storageKey);
      setHasSavedInfo(!!saved);
    }
  }, [storageKey]);

  // 날짜 변경 시 value 업데이트
  const updateDate = (newYear: string, newMonth: string, newDay: string) => {
    if (newYear && newMonth && newDay) {
      const formattedDate = `${newYear}-${newMonth.padStart(2, '0')}-${newDay.padStart(2, '0')}`;
      onChange({ ...value, birthDate: formattedDate });
    }
  };

  // 일 옵션 생성 (월에 따라 다름)
  const getDaysInMonth = () => {
    if (!year || !month) return 31;
    const y = parseInt(year, 10);
    const m = parseInt(month, 10);
    return new Date(y, m, 0).getDate();
  };

  const DAYS = Array.from({ length: getDaysInMonth() }, (_, i) => i + 1);

  // 정보 저장
  const handleSave = () => {
    if (storageKey) {
      localStorage.setItem(storageKey, JSON.stringify({
        ...value,
        savedAt: new Date().toISOString(),
      }));
      setHasSavedInfo(true);
    }
  };

  // 정보 불러오기
  const handleLoad = () => {
    if (storageKey) {
      const saved = localStorage.getItem(storageKey);
      if (saved) {
        try {
          const parsed = JSON.parse(saved);
          onChange({
            name: parsed.name || '',
            birthDate: parsed.birthDate || '',
            birthHour: parsed.birthHour || '',
            gender: parsed.gender,
            calendar: parsed.calendar || 'solar',
          });
        } catch (e) {
          console.error('Failed to load saved info:', e);
        }
      }
    }
  };

  // 정보 삭제
  const handleClear = () => {
    if (storageKey) {
      localStorage.removeItem(storageKey);
      setHasSavedInfo(false);
    }
  };

  return (
    <div className={cn('space-y-5', className)}>
      {/* 이름 입력 */}
      {showName && (
        <div>
          <Label htmlFor="name" className="flex items-center gap-2">
            <User className="h-4 w-4 text-muted-foreground" />
            이름 (선택)
          </Label>
          <Input
            id="name"
            value={value.name || ''}
            onChange={(e) => onChange({ ...value, name: e.target.value })}
            placeholder="홍길동"
            className="mt-1"
          />
        </div>
      )}

      {/* 양력/음력 선택 */}
      {showCalendar && (
        <div>
          <Label className="mb-2 block">달력 종류</Label>
          <div className="grid grid-cols-2 gap-3">
            <button
              type="button"
              onClick={() => onChange({ ...value, calendar: 'solar' })}
              className={cn(
                'flex items-center justify-center gap-2 p-3 rounded-xl border-2 text-sm font-medium transition-all',
                value.calendar !== 'lunar'
                  ? 'border-amber-500 bg-amber-50 dark:bg-amber-950/30 text-amber-700 dark:text-amber-300'
                  : 'border-gray-200 dark:border-gray-700 hover:border-amber-300'
              )}
            >
              <Sun className="h-4 w-4" />
              양력
            </button>
            <button
              type="button"
              onClick={() => onChange({ ...value, calendar: 'lunar' })}
              className={cn(
                'flex items-center justify-center gap-2 p-3 rounded-xl border-2 text-sm font-medium transition-all',
                value.calendar === 'lunar'
                  ? 'border-indigo-500 bg-indigo-50 dark:bg-indigo-950/30 text-indigo-700 dark:text-indigo-300'
                  : 'border-gray-200 dark:border-gray-700 hover:border-indigo-300'
              )}
            >
              <Moon className="h-4 w-4" />
              음력
            </button>
          </div>
        </div>
      )}

      {/* 생년월일 입력 모드 선택 */}
      <div>
        <div className="flex items-center justify-between mb-2">
          <Label className="flex items-center gap-2">
            <Calendar className="h-4 w-4 text-muted-foreground" />
            생년월일 <span className="text-red-500">*</span>
          </Label>
          <div className="flex gap-1">
            <Button
              type="button"
              variant={inputMode === 'dropdown' ? 'default' : 'ghost'}
              size="sm"
              onClick={() => setInputMode('dropdown')}
              className="h-7 text-xs"
            >
              선택형
            </Button>
            <Button
              type="button"
              variant={inputMode === 'date' ? 'default' : 'ghost'}
              size="sm"
              onClick={() => setInputMode('date')}
              className="h-7 text-xs"
            >
              날짜 입력
            </Button>
          </div>
        </div>

        {inputMode === 'dropdown' ? (
          <div className="grid grid-cols-3 gap-2">
            {/* 년 */}
            <Select
              value={year}
              onValueChange={(v) => {
                setYear(v);
                if (v && month && day) updateDate(v, month, day);
              }}
            >
              <SelectTrigger>
                <SelectValue placeholder="년도" />
              </SelectTrigger>
              <SelectContent className="max-h-[300px]">
                {YEARS.map((y) => (
                  <SelectItem key={y} value={String(y)}>
                    {y}년
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            {/* 월 */}
            <Select
              value={month}
              onValueChange={(v) => {
                setMonth(v);
                if (year && v && day) updateDate(year, v, day);
              }}
            >
              <SelectTrigger>
                <SelectValue placeholder="월" />
              </SelectTrigger>
              <SelectContent>
                {MONTHS.map((m) => (
                  <SelectItem key={m} value={String(m)}>
                    {m}월
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            {/* 일 */}
            <Select
              value={day}
              onValueChange={(v) => {
                setDay(v);
                if (year && month && v) updateDate(year, month, v);
              }}
            >
              <SelectTrigger>
                <SelectValue placeholder="일" />
              </SelectTrigger>
              <SelectContent className="max-h-[300px]">
                {DAYS.map((d) => (
                  <SelectItem key={d} value={String(d)}>
                    {d}일
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        ) : (
          <Input
            type="date"
            value={value.birthDate || ''}
            onChange={(e) => onChange({ ...value, birthDate: e.target.value })}
            max={`${currentYear}-12-31`}
            min="1920-01-01"
          />
        )}
      </div>

      {/* 태어난 시간 */}
      {showHour && (
        <div>
          <Label className="flex items-center gap-2 mb-2">
            <Clock className="h-4 w-4 text-muted-foreground" />
            태어난 시간 (선택)
          </Label>
          <div className="grid grid-cols-4 sm:grid-cols-6 gap-2">
            {HOURS.map((hour) => (
              <button
                key={hour.value || 'unknown'}
                type="button"
                onClick={() => onChange({ ...value, birthHour: hour.value || '' })}
                className={cn(
                  'p-2 rounded-xl text-center text-xs transition-all',
                  value.birthHour === hour.value || (!value.birthHour && !hour.value)
                    ? 'bg-purple-100 dark:bg-purple-900/50 ring-2 ring-purple-500 text-purple-700 dark:text-purple-300'
                    : 'bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700'
                )}
              >
                {hour.emoji && <div className="text-lg mb-0.5">{hour.emoji}</div>}
                <div className="font-medium">{hour.branch || '모름'}</div>
                {hour.value && (
                  <div className="text-[10px] text-muted-foreground">
                    {hour.value.split(':')[0]}시
                  </div>
                )}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* 성별 선택 */}
      {showGender && (
        <div>
          <Label className="flex items-center gap-2 mb-2">
            <User className="h-4 w-4 text-muted-foreground" />
            성별 <span className="text-red-500">*</span>
          </Label>
          <div className="grid grid-cols-2 gap-3">
            {[
              { value: 'male', label: '남성', emoji: '👨' },
              { value: 'female', label: '여성', emoji: '👩' },
            ].map((gender) => (
              <button
                key={gender.value}
                type="button"
                onClick={() => onChange({ ...value, gender: gender.value as 'male' | 'female' })}
                className={cn(
                  'p-4 rounded-xl border-2 text-center transition-all',
                  value.gender === gender.value
                    ? 'border-purple-500 bg-purple-50 dark:bg-purple-950/30'
                    : 'border-gray-200 dark:border-gray-700 hover:border-purple-300'
                )}
              >
                <span className="text-3xl block mb-1">{gender.emoji}</span>
                <span className="text-sm font-medium">{gender.label}</span>
              </button>
            ))}
          </div>
        </div>
      )}

      {/* 저장/불러오기 버튼 */}
      {showSaveButton && (
        <div className="flex gap-2 pt-2">
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={handleSave}
            disabled={!value.birthDate}
          >
            <Save className="h-4 w-4 mr-1" />
            정보 저장
          </Button>
          {hasSavedInfo && (
            <>
              <Button
                type="button"
                variant="ghost"
                size="sm"
                onClick={handleLoad}
              >
                불러오기
              </Button>
              <Button
                type="button"
                variant="ghost"
                size="sm"
                onClick={handleClear}
              >
                <RotateCcw className="h-4 w-4 mr-1" />
                삭제
              </Button>
            </>
          )}
        </div>
      )}
    </div>
  );
}
