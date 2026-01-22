'use client';

import { useState, useRef, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronLeft, ChevronRight, Loader2, Save, Users, Star, Trash2, X, Check } from 'lucide-react';
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
import { useAuth } from '@/lib/hooks/useAuth';

interface Props {
  onSubmit: (data: UserInput) => void;
  isLoading: boolean;
}

// 저장된 프로필 타입
interface SavedProfile {
  id: string;
  name: string;
  birth_date: string;
  birth_time?: string;
  gender: string;
  calendar?: string;
  blood_type?: string;
  mbti?: string;
  career_type?: string;
  career_level?: string;
  years_exp?: number;
  marital_status?: string;
  has_children?: boolean;
  children_ages?: number[];
  interests?: string[];
  current_concern?: string;
  relation_type?: string;
  nickname?: string;
  is_favorite?: boolean;
  created_at: string;
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

const RELATION_OPTIONS = [
  { value: 'self', label: '본인' },
  { value: 'family', label: '가족' },
  { value: 'friend', label: '친구' },
  { value: 'colleague', label: '동료' },
  { value: 'other', label: '기타' }
];

export default function SajuInputForm({ onSubmit, isLoading }: Props) {
  const { user } = useAuth();
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

  // 저장된 프로필 관련 상태
  const [savedProfiles, setSavedProfiles] = useState<SavedProfile[]>([]);
  const [showProfileSelector, setShowProfileSelector] = useState(false);
  const [loadingProfiles, setLoadingProfiles] = useState(false);
  const [savingProfile, setSavingProfile] = useState(false);
  const [saveMessage, setSaveMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);
  const [profileNickname, setProfileNickname] = useState('');
  const [profileRelationType, setProfileRelationType] = useState('self');
  const [showSaveModal, setShowSaveModal] = useState(false);

  const totalSteps = 4;

  // 프로필 목록 불러오기
  const loadProfiles = useCallback(async () => {
    if (!user?.id) return;

    setLoadingProfiles(true);
    try {
      const response = await fetch('/api/saju-profiles', {
        headers: {
          'x-user-id': user.id
        }
      });

      if (response.ok) {
        const data = await response.json();
        setSavedProfiles(data.profiles || []);
      }
    } catch (error) {
      console.error('프로필 로드 오류:', error);
    } finally {
      setLoadingProfiles(false);
    }
  }, [user?.id]);

  // 로그인 시 프로필 목록 불러오기
  useEffect(() => {
    if (user?.id) {
      loadProfiles();
    }
  }, [user?.id, loadProfiles]);

  // 프로필 저장
  const handleSaveProfile = async () => {
    if (!user?.id) {
      setSaveMessage({ type: 'error', text: '로그인이 필요합니다.' });
      return;
    }

    if (!formData.name || !formData.birthDate || !formData.gender) {
      setSaveMessage({ type: 'error', text: '이름, 생년월일, 성별을 입력해주세요.' });
      return;
    }

    setSavingProfile(true);
    setSaveMessage(null);

    try {
      const response = await fetch('/api/saju-profiles', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-user-id': user.id
        },
        body: JSON.stringify({
          profile: {
            name: formData.name,
            birth_date: formData.birthDate,
            birth_time: formData.birthTime || null,
            gender: formData.gender,
            calendar: formData.calendar,
            blood_type: formData.bloodType,
            mbti: formData.mbti,
            career_type: formData.careerType,
            career_level: formData.careerLevel,
            years_exp: formData.yearsExp,
            marital_status: formData.maritalStatus,
            has_children: formData.hasChildren,
            children_ages: formData.childrenAges,
            interests: formData.interests,
            current_concern: formData.currentConcern,
            relation_type: profileRelationType,
            nickname: profileNickname || null
          }
        })
      });

      const data = await response.json();

      // 모달은 항상 닫기
      setShowSaveModal(false);
      setProfileNickname('');

      if (response.ok) {
        setSaveMessage({ type: 'success', text: '프로필이 저장되었습니다.' });
        loadProfiles();
        // 3초 후 메시지 제거
        setTimeout(() => setSaveMessage(null), 3000);
      } else {
        setSaveMessage({ type: 'error', text: data.error || '저장에 실패했습니다.' });
        setTimeout(() => setSaveMessage(null), 5000);
      }
    } catch (error) {
      console.error('프로필 저장 오류:', error);
      setShowSaveModal(false);
      setSaveMessage({ type: 'error', text: '저장 중 오류가 발생했습니다.' });
      setTimeout(() => setSaveMessage(null), 5000);
    } finally {
      setSavingProfile(false);
    }
  };

  // 프로필 불러오기
  const handleLoadProfile = (profile: SavedProfile) => {
    // 날짜 파싱
    const dateParts = profile.birth_date.split('-');
    if (dateParts.length === 3) {
      setBirthYear(dateParts[0]);
      setBirthMonth(dateParts[1].replace(/^0/, ''));
      setBirthDay(dateParts[2].replace(/^0/, ''));
    }

    setFormData({
      name: profile.name,
      birthDate: profile.birth_date,
      birthTime: profile.birth_time || undefined,
      gender: profile.gender as 'male' | 'female',
      calendar: (profile.calendar as 'solar' | 'lunar') || 'solar',
      bloodType: profile.blood_type as 'A' | 'B' | 'O' | 'AB' | undefined,
      mbti: profile.mbti || undefined,
      careerType: profile.career_type as CareerType | undefined,
      careerLevel: profile.career_level as 'entry' | 'mid' | 'senior' | 'executive' | undefined,
      yearsExp: profile.years_exp || undefined,
      maritalStatus: profile.marital_status as 'single' | 'married' | 'divorced' | 'remarried' | undefined,
      hasChildren: profile.has_children || false,
      childrenAges: profile.children_ages || undefined,
      interests: (profile.interests as InterestType[]) || [],
      currentConcern: profile.current_concern as ConcernType | undefined
    });

    setShowProfileSelector(false);
    setSaveMessage({ type: 'success', text: `"${profile.nickname || profile.name}" 정보를 불러왔습니다.` });

    // 3초 후 메시지 제거
    setTimeout(() => setSaveMessage(null), 3000);
  };

  // 프로필 삭제
  const handleDeleteProfile = async (profileId: string, e: React.MouseEvent) => {
    e.stopPropagation();

    if (!user?.id) return;
    if (!confirm('이 프로필을 삭제하시겠습니까?')) return;

    try {
      const response = await fetch(`/api/saju-profiles?profileId=${profileId}`, {
        method: 'DELETE',
        headers: {
          'x-user-id': user.id
        }
      });

      if (response.ok) {
        setSavedProfiles(prev => prev.filter(p => p.id !== profileId));
      }
    } catch (error) {
      console.error('프로필 삭제 오류:', error);
    }
  };

  // 즐겨찾기 토글
  const handleToggleFavorite = async (profileId: string, currentFavorite: boolean, e: React.MouseEvent) => {
    e.stopPropagation();

    if (!user?.id) return;

    try {
      const response = await fetch('/api/saju-profiles', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'x-user-id': user.id
        },
        body: JSON.stringify({
          profileId,
          updates: { is_favorite: !currentFavorite }
        })
      });

      if (response.ok) {
        setSavedProfiles(prev =>
          prev.map(p =>
            p.id === profileId ? { ...p, is_favorite: !currentFavorite } : p
          ).sort((a, b) => {
            if (a.is_favorite && !b.is_favorite) return -1;
            if (!a.is_favorite && b.is_favorite) return 1;
            return 0;
          })
        );
      }
    } catch (error) {
      console.error('즐겨찾기 토글 오류:', error);
    }
  };

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
    const numericValue = value.replace(/[^0-9]/g, '');
    const limitedValue = numericValue.substring(0, 4);

    if (numericValue.length > 4) {
      e.target.value = limitedValue;
      return;
    }

    setBirthYear(limitedValue);

    if (limitedValue.length === 4) {
      monthRef.current?.focus();
    }

    updateBirthDate(limitedValue, birthMonth, birthDay);
  };

  // 월 입력 핸들러
  const handleMonthChange = (value: string) => {
    let numericValue = value.replace(/\D/g, '').slice(0, 2);

    if (numericValue.length === 2) {
      const monthNum = parseInt(numericValue);
      if (monthNum > 12) numericValue = '12';
      if (monthNum < 1 && numericValue !== '') numericValue = '01';
    }

    setBirthMonth(numericValue);

    if (numericValue.length === 2 || (numericValue.length === 1 && parseInt(numericValue) > 1)) {
      if (numericValue.length === 2 || parseInt(numericValue) > 1) {
        dayRef.current?.focus();
      }
    }

    updateBirthDate(birthYear, numericValue, birthDay);
  };

  // 일 입력 핸들러
  const handleDayChange = (value: string) => {
    let numericValue = value.replace(/\D/g, '').slice(0, 2);

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
        return formData.name && birthYear.length === 4 && birthMonth.length >= 1 && birthDay.length >= 1;
      case 2:
        return true;
      case 3:
        return true;
      case 4:
        return formData.currentConcern;
      default:
        return false;
    }
  };

  return (
    <div className="max-w-lg mx-auto p-6 bg-white dark:bg-gray-900 rounded-2xl shadow-lg">
      {/* 저장된 프로필 섹션 */}
      {user && (
        <div className="mb-6 pb-6 border-b border-gray-200 dark:border-gray-700">
          <div className="flex items-center justify-between mb-3">
            <h3 className="text-sm font-medium text-gray-600 dark:text-gray-400 flex items-center gap-2">
              <Users className="w-4 h-4" />
              저장된 프로필
            </h3>
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={() => setShowProfileSelector(!showProfileSelector)}
              className="text-xs"
            >
              {showProfileSelector ? '닫기' : `불러오기 (${savedProfiles.length})`}
            </Button>
          </div>

          {/* 저장/불러오기 메시지 */}
          <AnimatePresence>
            {saveMessage && (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className={`mb-3 p-2 rounded-lg text-sm flex items-center gap-2 ${
                  saveMessage.type === 'success'
                    ? 'bg-green-50 text-green-700 dark:bg-green-900/30 dark:text-green-400'
                    : 'bg-red-50 text-red-700 dark:bg-red-900/30 dark:text-red-400'
                }`}
              >
                {saveMessage.type === 'success' ? (
                  <Check className="w-4 h-4" />
                ) : (
                  <X className="w-4 h-4" />
                )}
                {saveMessage.text}
              </motion.div>
            )}
          </AnimatePresence>

          {/* 프로필 선택 드롭다운 */}
          <AnimatePresence>
            {showProfileSelector && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
                className="overflow-hidden"
              >
                {loadingProfiles ? (
                  <div className="flex items-center justify-center py-4">
                    <Loader2 className="w-5 h-5 animate-spin text-purple-600" />
                  </div>
                ) : savedProfiles.length === 0 ? (
                  <p className="text-sm text-gray-500 text-center py-4">
                    저장된 프로필이 없습니다.
                  </p>
                ) : (
                  <div className="space-y-2 max-h-60 overflow-y-auto">
                    {savedProfiles.map(profile => (
                      <div
                        key={profile.id}
                        onClick={() => handleLoadProfile(profile)}
                        className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-800 rounded-lg cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
                      >
                        <div className="flex items-center gap-3">
                          <button
                            onClick={(e) => handleToggleFavorite(profile.id, !!profile.is_favorite, e)}
                            className={`p-1 rounded-full transition-colors ${
                              profile.is_favorite
                                ? 'text-yellow-500'
                                : 'text-gray-300 hover:text-yellow-400'
                            }`}
                          >
                            <Star className="w-4 h-4" fill={profile.is_favorite ? 'currentColor' : 'none'} />
                          </button>
                          <div>
                            <p className="font-medium text-gray-800 dark:text-white">
                              {profile.nickname || profile.name}
                              {profile.nickname && (
                                <span className="ml-2 text-xs text-gray-500">({profile.name})</span>
                              )}
                            </p>
                            <p className="text-xs text-gray-500">
                              {profile.birth_date} · {profile.gender === 'male' ? '남' : '여'}
                              {profile.relation_type && profile.relation_type !== 'self' && (
                                <span className="ml-1">
                                  · {RELATION_OPTIONS.find(r => r.value === profile.relation_type)?.label}
                                </span>
                              )}
                            </p>
                          </div>
                        </div>
                        <button
                          onClick={(e) => handleDeleteProfile(profile.id, e)}
                          className="p-1.5 text-gray-400 hover:text-red-500 transition-colors"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    ))}
                  </div>
                )}
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      )}

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
                      defaultValue={formData.childrenAges?.join(', ') || ''}
                      onBlur={e => {
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

      {/* 프로필 저장 버튼 (로그인 + 기본정보 입력 시) */}
      {user && formData.name && formData.birthDate && (
        <div className="mt-4">
          <Button
            type="button"
            variant="outline"
            onClick={() => setShowSaveModal(true)}
            className="w-full"
            disabled={savingProfile}
          >
            <Save className="w-4 h-4 mr-2" />
            이 정보를 프로필로 저장
          </Button>
        </div>
      )}

      {/* 프로필 저장 모달 */}
      <AnimatePresence>
        {showSaveModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4"
            onClick={() => setShowSaveModal(false)}
          >
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="bg-white dark:bg-gray-900 rounded-2xl p-6 w-full max-w-sm"
              onClick={e => e.stopPropagation()}
            >
              <h3 className="text-lg font-bold mb-4">프로필 저장</h3>

              <div className="space-y-4">
                <div>
                  <Label htmlFor="profileNickname">별칭 (선택)</Label>
                  <Input
                    id="profileNickname"
                    value={profileNickname}
                    onChange={e => setProfileNickname(e.target.value)}
                    placeholder="예: 엄마, 남편, 친구1"
                    className="mt-1"
                  />
                  <p className="text-xs text-gray-500 mt-1">
                    비워두면 이름으로 표시됩니다.
                  </p>
                </div>

                <div>
                  <Label>관계</Label>
                  <div className="grid grid-cols-3 gap-2 mt-2">
                    {RELATION_OPTIONS.map(option => (
                      <button
                        key={option.value}
                        type="button"
                        onClick={() => setProfileRelationType(option.value)}
                        className={`py-2 px-3 rounded-lg text-sm transition-all
                          ${profileRelationType === option.value
                            ? 'bg-purple-600 text-white'
                            : 'bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700'}`}
                      >
                        {option.label}
                      </button>
                    ))}
                  </div>
                </div>

                <div className="p-3 bg-gray-50 dark:bg-gray-800 rounded-lg">
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    <strong>{formData.name}</strong> ({formData.birthDate})
                  </p>
                </div>
              </div>

              <div className="flex gap-3 mt-6">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setShowSaveModal(false)}
                  className="flex-1"
                >
                  취소
                </Button>
                <Button
                  type="button"
                  onClick={handleSaveProfile}
                  disabled={savingProfile}
                  className="flex-1 bg-purple-600 hover:bg-purple-700"
                >
                  {savingProfile ? (
                    <Loader2 className="w-4 h-4 animate-spin" />
                  ) : (
                    '저장'
                  )}
                </Button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
