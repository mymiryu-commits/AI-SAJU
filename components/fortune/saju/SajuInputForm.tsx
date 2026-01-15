'use client';

import { useState, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronLeft, ChevronRight, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  UserInput,
  CareerType,
  InterestType,
  ConcernType,
  CAREER_KOREAN,
  INTEREST_KOREAN,
  CONCERN_KOREAN
} from '@/types/saju';

interface Props {
  onSubmit: (data: UserInput) => void;
  isLoading: boolean;
}

const CAREER_OPTIONS: { value: CareerType; label: string }[] = Object.entries(CAREER_KOREAN).map(
  ([value, label]) => ({ value: value as CareerType, label })
);

const INTEREST_OPTIONS: { value: InterestType; label: string }[] = Object.entries(INTEREST_KOREAN).map(
  ([value, label]) => ({ value: value as InterestType, label })
);

const CONCERN_OPTIONS: { value: ConcernType; label: string; emoji: string }[] = Object.entries(CONCERN_KOREAN).map(
  ([value, { label, emoji }]) => ({ value: value as ConcernType, label, emoji })
);

const MBTI_OPTIONS = [
  'INTJ', 'INTP', 'ENTJ', 'ENTP',
  'INFJ', 'INFP', 'ENFJ', 'ENFP',
  'ISTJ', 'ISFJ', 'ESTJ', 'ESFJ',
  'ISTP', 'ISFP', 'ESTP', 'ESFP'
];

export default function SajuInputForm({ onSubmit, isLoading }: Props) {
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState<Partial<UserInput>>({
    gender: 'male',
    calendar: 'solar',
    interests: []
  });

  // 생년월일 분리 입력
  const [birthYear, setBirthYear] = useState('');
  const [birthMonth, setBirthMonth] = useState('');
  const [birthDay, setBirthDay] = useState('');

  // 자동 포커스 이동을 위한 ref
  const monthRef = useRef<HTMLInputElement>(null);
  const dayRef = useRef<HTMLInputElement>(null);

  const totalSteps = 4;

  const handleChange = (field: keyof UserInput, value: unknown) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  // 생년월일을 조합하여 formData에 저장
  const updateBirthDate = (year: string, month: string, day: string) => {
    if (year.length === 4 && month.length >= 1 && day.length >= 1) {
      const paddedMonth = month.padStart(2, '0');
      const paddedDay = day.padStart(2, '0');
      handleChange('birthDate', `${year}-${paddedMonth}-${paddedDay}`);
    }
  };

  // 년도 입력 핸들러
  const handleYearChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    // 숫자만 허용, 최대 4자리 강제 적용
    const numericValue = value.replace(/[^0-9]/g, '');

    // 4자리 초과 시 4자리로 자름
    const limitedValue = numericValue.substring(0, 4);

    // 입력값이 4자리 초과면 입력 무시
    if (numericValue.length > 4) {
      e.target.value = limitedValue;
      return;
    }

    setBirthYear(limitedValue);

    // 4자리 입력 완료 시 자동으로 월로 이동
    if (limitedValue.length === 4) {
      monthRef.current?.focus();
    }

    updateBirthDate(limitedValue, birthMonth, birthDay);
  };

  // 월 입력 핸들러
  const handleMonthChange = (value: string) => {
    // 숫자만 허용, 최대 2자리
    let numericValue = value.replace(/\D/g, '').slice(0, 2);

    // 월 범위 제한 (1-12)
    if (numericValue.length === 2) {
      const monthNum = parseInt(numericValue);
      if (monthNum > 12) numericValue = '12';
      if (monthNum < 1 && numericValue !== '') numericValue = '01';
    }

    setBirthMonth(numericValue);

    // 2자리 입력 완료 또는 2 이상의 숫자로 시작 시 자동으로 일로 이동
    if (numericValue.length === 2 || (numericValue.length === 1 && parseInt(numericValue) > 1)) {
      if (numericValue.length === 2 || parseInt(numericValue) > 1) {
        dayRef.current?.focus();
      }
    }

    updateBirthDate(birthYear, numericValue, birthDay);
  };

  // 일 입력 핸들러
  const handleDayChange = (value: string) => {
    // 숫자만 허용, 최대 2자리
    let numericValue = value.replace(/\D/g, '').slice(0, 2);

    // 일 범위 제한 (1-31)
    if (numericValue.length === 2) {
      const dayNum = parseInt(numericValue);
      if (dayNum > 31) numericValue = '31';
      if (dayNum < 1 && numericValue !== '') numericValue = '01';
    }

    setBirthDay(numericValue);
    updateBirthDate(birthYear, birthMonth, numericValue);
  };

  const handleInterestToggle = (interest: InterestType) => {
    const current = formData.interests || [];
    if (current.includes(interest)) {
      handleChange('interests', current.filter(i => i !== interest));
    } else if (current.length < 3) {
      handleChange('interests', [...current, interest]);
    }
  };

  const handleNext = () => setStep(prev => Math.min(prev + 1, totalSteps));
  const handlePrev = () => setStep(prev => Math.max(prev - 1, 1));

  const handleSubmit = () => {
    if (!formData.name || !formData.birthDate || !formData.gender) {
      return;
    }
    onSubmit(formData as UserInput);
  };

  const isStepValid = () => {
    switch (step) {
      case 1:
        // 이름과 생년월일 필수 (년4자리, 월1-2자리, 일1-2자리)
        return formData.name && birthYear.length === 4 && birthMonth.length >= 1 && birthDay.length >= 1;
      case 2:
        return true; // 직업 정보는 선택
      case 3:
        return true; // 가족 정보는 선택
      case 4:
        return formData.currentConcern;
      default:
        return false;
    }
  };

  return (
    <div className="max-w-lg mx-auto p-6 bg-white dark:bg-gray-900 rounded-2xl shadow-lg">
      {/* Progress Bar */}
      <div className="mb-8">
        <div className="flex justify-between mb-2">
          {Array.from({ length: totalSteps }, (_, i) => i + 1).map(s => (
            <div
              key={s}
              className={`w-10 h-10 rounded-full flex items-center justify-center text-sm font-bold transition-all
                ${step >= s
                  ? 'bg-purple-600 text-white'
                  : 'bg-gray-200 dark:bg-gray-700 text-gray-500 dark:text-gray-400'}`}
            >
              {s}
            </div>
          ))}
        </div>
        <div className="h-2 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
          <motion.div
            className="h-full bg-gradient-to-r from-purple-500 to-pink-500"
            initial={{ width: 0 }}
            animate={{ width: `${(step / totalSteps) * 100}%` }}
            transition={{ duration: 0.3 }}
          />
        </div>
        <p className="text-center text-sm text-gray-500 mt-2">
          {step}/{totalSteps} 단계
        </p>
      </div>

      <AnimatePresence mode="wait">
        {/* Step 1: 기본 정보 */}
        {step === 1 && (
          <motion.div
            key="step1"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            className="space-y-6"
          >
            <h2 className="text-xl font-bold text-gray-800 dark:text-white">기본 정보</h2>

            <div>
              <Label htmlFor="name">이름 <span className="text-red-500">*</span></Label>
              <Input
                id="name"
                value={formData.name || ''}
                onChange={e => handleChange('name', e.target.value)}
                placeholder="홍길동"
                className="mt-1"
              />
            </div>

            <div>
              <Label>생년월일 <span className="text-red-500">*</span></Label>
              <div className="flex gap-2 mt-1">
                <div className="flex-1">
                  <Input
                    id="birthYear"
                    type="text"
                    inputMode="numeric"
                    pattern="[0-9]*"
                    value={birthYear}
                    onChange={handleYearChange}
                    onPaste={(e) => {
                      // 붙여넣기 시에도 4자리 제한
                      const pasted = e.clipboardData.getData('text');
                      const numeric = pasted.replace(/[^0-9]/g, '').substring(0, 4);
                      if (numeric !== pasted) {
                        e.preventDefault();
                        setBirthYear(numeric);
                        if (numeric.length === 4) {
                          monthRef.current?.focus();
                        }
                        updateBirthDate(numeric, birthMonth, birthDay);
                      }
                    }}
                    placeholder="1978"
                    maxLength={4}
                    className="text-center"
                  />
                  <p className="text-xs text-gray-400 text-center mt-1">년</p>
                </div>
                <div className="w-16">
                  <Input
                    ref={monthRef}
                    id="birthMonth"
                    type="text"
                    inputMode="numeric"
                    value={birthMonth}
                    onChange={e => handleMonthChange(e.target.value)}
                    placeholder="02"
                    maxLength={2}
                    className="text-center"
                  />
                  <p className="text-xs text-gray-400 text-center mt-1">월</p>
                </div>
                <div className="w-16">
                  <Input
                    ref={dayRef}
                    id="birthDay"
                    type="text"
                    inputMode="numeric"
                    value={birthDay}
                    onChange={e => handleDayChange(e.target.value)}
                    placeholder="15"
                    maxLength={2}
                    className="text-center"
                  />
                  <p className="text-xs text-gray-400 text-center mt-1">일</p>
                </div>
              </div>
            </div>

            <div>
              <Label htmlFor="calendar">달력 유형</Label>
              <Select
                value={formData.calendar || 'solar'}
                onValueChange={value => handleChange('calendar', value)}
              >
                <SelectTrigger className="mt-1">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="solar">양력</SelectItem>
                  <SelectItem value="lunar">음력</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label htmlFor="birthTime">태어난 시간 (선택)</Label>
              <Input
                id="birthTime"
                type="time"
                value={formData.birthTime || ''}
                onChange={e => handleChange('birthTime', e.target.value)}
                className="mt-1"
              />
              <p className="text-xs text-gray-500 mt-1">
                모르시면 비워두세요. 시주 없이 분석됩니다.
              </p>
            </div>

            <div>
              <Label>성별 <span className="text-red-500">*</span></Label>
              <div className="flex gap-4 mt-2">
                {[
                  { value: 'male', label: '남성' },
                  { value: 'female', label: '여성' }
                ].map(option => (
                  <button
                    key={option.value}
                    type="button"
                    onClick={() => handleChange('gender', option.value)}
                    className={`flex-1 py-3 rounded-lg border-2 transition-all font-medium
                      ${formData.gender === option.value
                        ? 'border-purple-600 bg-purple-50 dark:bg-purple-900/30 text-purple-600'
                        : 'border-gray-200 dark:border-gray-700 hover:border-purple-300'}`}
                  >
                    {option.label}
                  </button>
                ))}
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="bloodType">혈액형</Label>
                <Select
                  value={formData.bloodType || ''}
                  onValueChange={value => handleChange('bloodType', value)}
                >
                  <SelectTrigger className="mt-1">
                    <SelectValue placeholder="선택" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="A">A형</SelectItem>
                    <SelectItem value="B">B형</SelectItem>
                    <SelectItem value="O">O형</SelectItem>
                    <SelectItem value="AB">AB형</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label htmlFor="mbti">MBTI</Label>
                <Select
                  value={formData.mbti || ''}
                  onValueChange={value => handleChange('mbti', value)}
                >
                  <SelectTrigger className="mt-1">
                    <SelectValue placeholder="선택" />
                  </SelectTrigger>
                  <SelectContent>
                    {MBTI_OPTIONS.map(type => (
                      <SelectItem key={type} value={type}>{type}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
          </motion.div>
        )}

        {/* Step 2: 직업 정보 */}
        {step === 2 && (
          <motion.div
            key="step2"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            className="space-y-6"
          >
            <h2 className="text-xl font-bold text-gray-800 dark:text-white">직업 정보</h2>
            <p className="text-sm text-gray-500">
              직업에 맞는 맞춤 분석을 제공합니다. (선택사항)
            </p>

            <div>
              <Label>직업군 선택</Label>
              <div className="grid grid-cols-2 gap-2 mt-2">
                {CAREER_OPTIONS.map(option => (
                  <button
                    key={option.value}
                    type="button"
                    onClick={() => handleChange('careerType', option.value)}
                    className={`py-3 px-4 rounded-lg text-sm transition-all text-left
                      ${formData.careerType === option.value
                        ? 'bg-purple-600 text-white'
                        : 'bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700'}`}
                  >
                    {option.label}
                  </button>
                ))}
              </div>
            </div>

            {formData.careerType && (
              <>
                <div>
                  <Label htmlFor="careerLevel">직급/경력 수준</Label>
                  <Select
                    value={formData.careerLevel || ''}
                    onValueChange={value => handleChange('careerLevel', value)}
                  >
                    <SelectTrigger className="mt-1">
                      <SelectValue placeholder="선택" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="entry">신입/주니어 (0-3년)</SelectItem>
                      <SelectItem value="mid">중간/시니어 (4-10년)</SelectItem>
                      <SelectItem value="senior">관리자/리더 (10년+)</SelectItem>
                      <SelectItem value="executive">임원/경영진</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <Label htmlFor="yearsExp">총 경력 연수</Label>
                  <Input
                    id="yearsExp"
                    type="number"
                    value={formData.yearsExp || ''}
                    onChange={e => handleChange('yearsExp', parseInt(e.target.value) || undefined)}
                    placeholder="예: 15"
                    min="0"
                    max="50"
                    className="mt-1"
                  />
                </div>
              </>
            )}
          </motion.div>
        )}

        {/* Step 3: 가족 정보 */}
        {step === 3 && (
          <motion.div
            key="step3"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            className="space-y-6"
          >
            <h2 className="text-xl font-bold text-gray-800 dark:text-white">가족 정보</h2>
            <p className="text-sm text-gray-500">
              가족 상황에 맞는 인생 설계를 제안합니다. (선택사항)
            </p>

            <div>
              <Label>결혼 상태</Label>
              <div className="grid grid-cols-2 gap-2 mt-2">
                {[
                  { value: 'single', label: '미혼' },
                  { value: 'married', label: '기혼' },
                  { value: 'divorced', label: '이혼' },
                  { value: 'remarried', label: '재혼' }
                ].map(option => (
                  <button
                    key={option.value}
                    type="button"
                    onClick={() => handleChange('maritalStatus', option.value)}
                    className={`py-3 px-4 rounded-lg transition-all
                      ${formData.maritalStatus === option.value
                        ? 'bg-purple-600 text-white'
                        : 'bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700'}`}
                  >
                    {option.label}
                  </button>
                ))}
              </div>
            </div>

            {formData.maritalStatus && formData.maritalStatus !== 'single' && (
              <>
                <div>
                  <Label>자녀 유무</Label>
                  <div className="flex gap-4 mt-2">
                    <button
                      type="button"
                      onClick={() => handleChange('hasChildren', true)}
                      className={`flex-1 py-3 rounded-lg border-2 transition-all
                        ${formData.hasChildren === true
                          ? 'border-purple-600 bg-purple-50 dark:bg-purple-900/30'
                          : 'border-gray-200 dark:border-gray-700'}`}
                    >
                      있음
                    </button>
                    <button
                      type="button"
                      onClick={() => handleChange('hasChildren', false)}
                      className={`flex-1 py-3 rounded-lg border-2 transition-all
                        ${formData.hasChildren === false
                          ? 'border-purple-600 bg-purple-50 dark:bg-purple-900/30'
                          : 'border-gray-200 dark:border-gray-700'}`}
                    >
                      없음
                    </button>
                  </div>
                </div>

                {formData.hasChildren && (
                  <div>
                    <Label htmlFor="childrenAges">자녀 나이 (쉼표로 구분)</Label>
                    <Input
                      id="childrenAges"
                      placeholder="예: 5, 12, 18"
                      onChange={e => {
                        const ages = e.target.value
                          .split(',')
                          .map(s => parseInt(s.trim()))
                          .filter(n => !isNaN(n));
                        handleChange('childrenAges', ages.length > 0 ? ages : undefined);
                      }}
                      className="mt-1"
                    />
                  </div>
                )}
              </>
            )}
          </motion.div>
        )}

        {/* Step 4: 관심사 & 고민 */}
        {step === 4 && (
          <motion.div
            key="step4"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            className="space-y-6"
          >
            <h2 className="text-xl font-bold text-gray-800 dark:text-white">관심사 & 현재 고민</h2>

            <div>
              <Label>관심사 선택 (최대 3개)</Label>
              <div className="grid grid-cols-3 gap-2 mt-2">
                {INTEREST_OPTIONS.map(option => (
                  <button
                    key={option.value}
                    type="button"
                    onClick={() => handleInterestToggle(option.value)}
                    className={`py-2 px-2 rounded-lg text-xs transition-all
                      ${formData.interests?.includes(option.value)
                        ? 'bg-purple-600 text-white'
                        : 'bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700'}`}
                  >
                    {option.label}
                  </button>
                ))}
              </div>
              <p className="text-xs text-gray-500 mt-2">
                {formData.interests?.length || 0}/3 선택됨
              </p>
            </div>

            <div>
              <Label>현재 가장 큰 고민은? <span className="text-red-500">*</span></Label>
              <div className="space-y-2 mt-3">
                {CONCERN_OPTIONS.map(option => (
                  <button
                    key={option.value}
                    type="button"
                    onClick={() => handleChange('currentConcern', option.value)}
                    className={`w-full py-4 px-4 rounded-lg text-left transition-all flex items-center gap-3
                      ${formData.currentConcern === option.value
                        ? 'bg-purple-600 text-white'
                        : 'bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700'}`}
                  >
                    <span className="text-2xl">{option.emoji}</span>
                    <span className="font-medium">{option.label}</span>
                  </button>
                ))}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Navigation Buttons */}
      <div className="mt-8 flex gap-4">
        {step > 1 && (
          <Button
            type="button"
            variant="outline"
            onClick={handlePrev}
            className="flex-1"
          >
            <ChevronLeft className="w-4 h-4 mr-1" />
            이전
          </Button>
        )}

        {step < totalSteps ? (
          <Button
            type="button"
            onClick={handleNext}
            disabled={!isStepValid()}
            className="flex-1 bg-purple-600 hover:bg-purple-700"
          >
            다음
            <ChevronRight className="w-4 h-4 ml-1" />
          </Button>
        ) : (
          <Button
            type="button"
            onClick={handleSubmit}
            disabled={isLoading || !isStepValid()}
            className="flex-1 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700"
          >
            {isLoading ? (
              <>
                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                분석 중...
              </>
            ) : (
              '무료 분석 시작'
            )}
          </Button>
        )}
      </div>
    </div>
  );
}
