'use client';

import { useState, useEffect } from 'react';
import { Link } from '@/i18n/routing';
import {
  Loader2,
  BookOpen,
  Star,
  Activity,
  Link2,
  ArrowRight,
  Crown,
  Moon,
  Calendar,
  User,
  Clock,
  Sparkles,
  ChevronRight,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { SipsinChart, SinsalCard, UnsungChart, HapChungDiagram } from '@/components/saju/advanced';
import { cn } from '@/lib/utils';

type TabType = 'sipsin' | 'sinsal' | 'unsung' | 'hapchung';
type StepType = 'intro' | 'loading' | 'result' | 'error';

const TABS: { id: TabType; label: string; icon: React.ElementType; description: string }[] = [
  { id: 'sipsin', label: '십신(十神)', icon: BookOpen, description: '일간과 다른 천간의 관계 분석' },
  { id: 'sinsal', label: '신살(神殺)', icon: Star, description: '길흉을 나타내는 특수 기운' },
  { id: 'unsung', label: '12운성', icon: Activity, description: '오행의 강약과 생명 주기' },
  { id: 'hapchung', label: '합충형파해', icon: Link2, description: '지지 간의 상호작용 분석' },
];

const HOURS = [
  { value: '', label: '모름' },
  { value: '23:30', label: '자시 (23:30~01:30)' },
  { value: '01:30', label: '축시 (01:30~03:30)' },
  { value: '03:30', label: '인시 (03:30~05:30)' },
  { value: '05:30', label: '묘시 (05:30~07:30)' },
  { value: '07:30', label: '진시 (07:30~09:30)' },
  { value: '09:30', label: '사시 (09:30~11:30)' },
  { value: '11:30', label: '오시 (11:30~13:30)' },
  { value: '13:30', label: '미시 (13:30~15:30)' },
  { value: '15:30', label: '신시 (15:30~17:30)' },
  { value: '17:30', label: '유시 (17:30~19:30)' },
  { value: '19:30', label: '술시 (19:30~21:30)' },
  { value: '21:30', label: '해시 (21:30~23:30)' },
];

export default function AdvancedSajuPage() {
  const [step, setStep] = useState<StepType>('intro');
  const [activeTab, setActiveTab] = useState<TabType>('sipsin');
  const [data, setData] = useState<any>(null);
  const [error, setError] = useState<string | null>(null);
  const [heroBackground, setHeroBackground] = useState<string | null>(null);
  const [formData, setFormData] = useState({
    name: '',
    birthDate: '',
    birthHour: '',
    gender: '',
    calendar: 'solar',
  });

  // 배경 이미지 설정 및 sessionStorage 데이터 확인
  useEffect(() => {
    // 배경 이미지 설정 가져오기
    const fetchHeroSettings = async () => {
      try {
        const response = await fetch('/api/site-settings?key=saju_advanced_hero');
        const result = await response.json();
        if (result.data?.value?.backgroundImage) {
          setHeroBackground(result.data.value.backgroundImage);
        }
      } catch (error) {
        console.error('Error fetching hero settings:', error);
      }
    };
    fetchHeroSettings();

    // sessionStorage에서 데이터 확인하고 바로 분석
    const storedChart = sessionStorage.getItem('sajuChart');
    if (storedChart) {
      fetchAnalysis(JSON.parse(storedChart));
    }
  }, []);

  const fetchAnalysis = async (sajuChart: any) => {
    try {
      setStep('loading');
      setError(null);

      const res = await fetch('/api/saju/advanced', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ sajuChart }),
      });

      if (!res.ok) {
        const errorData = await res.json();
        throw new Error(errorData.error || '분석 데이터를 불러올 수 없습니다.');
      }

      const result = await res.json();
      setData(result);
      setStep('result');
    } catch (err) {
      setError(err instanceof Error ? err.message : '오류가 발생했습니다.');
      setStep('error');
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.birthDate || !formData.gender) {
      setError('생년월일과 성별을 입력해주세요.');
      return;
    }

    try {
      setStep('loading');
      setError(null);

      // 먼저 사주 차트 계산 API 호출
      const chartRes = await fetch('/api/fortune/saju', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          birthDate: formData.birthDate,
          birthTime: formData.birthHour || null,
          gender: formData.gender,
          calendar: formData.calendar,
          name: formData.name,
        }),
      });

      if (!chartRes.ok) {
        throw new Error('사주 계산에 실패했습니다.');
      }

      const chartData = await chartRes.json();

      // 정통사주 분석 API 호출
      const analysisRes = await fetch('/api/saju/advanced', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ sajuChart: chartData.chart || chartData }),
      });

      if (!analysisRes.ok) {
        const errorData = await analysisRes.json();
        throw new Error(errorData.error || '정통사주 분석에 실패했습니다.');
      }

      const result = await analysisRes.json();
      setData(result);
      setStep('result');
    } catch (err) {
      setError(err instanceof Error ? err.message : '오류가 발생했습니다.');
      setStep('error');
    }
  };

  // 인트로/입력 폼
  if (step === 'intro') {
    return (
      <div className="min-h-screen bg-gradient-to-b from-purple-50 to-indigo-50 dark:from-purple-950/20 dark:to-indigo-950/20">
        {/* 히어로 섹션 */}
        <section className="relative overflow-hidden text-white py-16">
          {/* 배경 이미지 또는 그라데이션 */}
          <div className="absolute inset-0">
            {heroBackground ? (
              <>
                <div
                  className="absolute inset-0 bg-cover bg-center"
                  style={{ backgroundImage: `url(${heroBackground})` }}
                />
                <div className="absolute inset-0 bg-gradient-to-br from-purple-900/80 via-violet-900/70 to-indigo-900/80" />
              </>
            ) : (
              <div className="absolute inset-0 bg-gradient-to-br from-purple-600 via-violet-600 to-indigo-700" />
            )}
            <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-white/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2" />
            <div className="absolute bottom-0 left-0 w-[400px] h-[400px] bg-pink-500/20 rounded-full blur-3xl translate-y-1/2 -translate-x-1/2" />
          </div>

          <div className="container mx-auto px-4 relative z-10">
            <div className="max-w-3xl mx-auto text-center">
              <Badge className="mb-4 bg-white/20 text-white border-0">
                <Crown className="mr-1 h-3 w-3" />
                프리미엄 분석
              </Badge>
              <h1 className="text-3xl md:text-4xl font-bold mb-4">
                정통 사주 분석
              </h1>
              <p className="text-lg text-white/80 mb-6">
                전통 명리학의 핵심 이론으로 운명의 깊은 비밀을 파헤칩니다
              </p>

              {/* 분석 항목 미리보기 */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-3 max-w-2xl mx-auto">
                {TABS.map((tab) => {
                  const Icon = tab.icon;
                  return (
                    <div
                      key={tab.id}
                      className="bg-white/10 backdrop-blur-sm rounded-xl p-3 text-center"
                    >
                      <Icon className="h-6 w-6 mx-auto mb-1" />
                      <p className="text-sm font-medium">{tab.label}</p>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        </section>

        {/* 입력 폼 */}
        <section className="container mx-auto px-4 py-12">
          <div className="max-w-xl mx-auto">
            <Card className="shadow-xl border-0">
              <CardHeader className="text-center">
                <CardTitle className="flex items-center justify-center gap-2">
                  <Moon className="h-5 w-5 text-purple-500" />
                  사주 정보 입력
                </CardTitle>
                <CardDescription>
                  정확한 분석을 위해 출생 정보를 입력해주세요
                </CardDescription>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleSubmit} className="space-y-5">
                  {/* 이름 */}
                  <div>
                    <Label htmlFor="name" className="flex items-center gap-2">
                      <User className="h-4 w-4 text-gray-500" />
                      이름 (선택)
                    </Label>
                    <Input
                      id="name"
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      placeholder="홍길동"
                      className="mt-1"
                    />
                  </div>

                  {/* 생년월일 */}
                  <div>
                    <Label htmlFor="birthDate" className="flex items-center gap-2">
                      <Calendar className="h-4 w-4 text-gray-500" />
                      생년월일 <span className="text-red-500">*</span>
                    </Label>
                    <Input
                      id="birthDate"
                      type="date"
                      value={formData.birthDate}
                      onChange={(e) => setFormData({ ...formData, birthDate: e.target.value })}
                      required
                      className="mt-1"
                    />
                  </div>

                  {/* 태어난 시간 */}
                  <div>
                    <Label htmlFor="birthHour" className="flex items-center gap-2">
                      <Clock className="h-4 w-4 text-gray-500" />
                      태어난 시간 (선택)
                    </Label>
                    <Select
                      value={formData.birthHour}
                      onValueChange={(value) => setFormData({ ...formData, birthHour: value })}
                    >
                      <SelectTrigger className="mt-1">
                        <SelectValue placeholder="시간을 선택하세요" />
                      </SelectTrigger>
                      <SelectContent>
                        {HOURS.map((hour) => (
                          <SelectItem key={hour.value} value={hour.value || 'unknown'}>
                            {hour.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <p className="text-xs text-muted-foreground mt-1">
                      시간을 모르면 '모름'을 선택하세요
                    </p>
                  </div>

                  {/* 성별 */}
                  <div>
                    <Label className="flex items-center gap-2 mb-2">
                      <User className="h-4 w-4 text-gray-500" />
                      성별 <span className="text-red-500">*</span>
                    </Label>
                    <div className="grid grid-cols-2 gap-3">
                      {['male', 'female'].map((gender) => (
                        <button
                          key={gender}
                          type="button"
                          onClick={() => setFormData({ ...formData, gender })}
                          className={cn(
                            'p-3 rounded-xl border-2 text-center transition-all',
                            formData.gender === gender
                              ? 'border-purple-500 bg-purple-50 dark:bg-purple-950/30'
                              : 'border-gray-200 dark:border-gray-700 hover:border-purple-300'
                          )}
                        >
                          <span className="text-2xl block mb-1">
                            {gender === 'male' ? '👨' : '👩'}
                          </span>
                          <span className="text-sm font-medium">
                            {gender === 'male' ? '남성' : '여성'}
                          </span>
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* 양력/음력 */}
                  <div>
                    <Label className="mb-2 block">달력 종류</Label>
                    <div className="grid grid-cols-2 gap-3">
                      {['solar', 'lunar'].map((cal) => (
                        <button
                          key={cal}
                          type="button"
                          onClick={() => setFormData({ ...formData, calendar: cal })}
                          className={cn(
                            'p-2 rounded-lg border text-sm font-medium transition-all',
                            formData.calendar === cal
                              ? 'border-purple-500 bg-purple-50 dark:bg-purple-950/30 text-purple-700 dark:text-purple-300'
                              : 'border-gray-200 dark:border-gray-700 hover:border-purple-300'
                          )}
                        >
                          {cal === 'solar' ? '☀️ 양력' : '🌙 음력'}
                        </button>
                      ))}
                    </div>
                  </div>

                  {error && (
                    <div className="p-3 rounded-lg bg-red-50 dark:bg-red-950/30 text-red-600 dark:text-red-400 text-sm">
                      {error}
                    </div>
                  )}

                  <Button
                    type="submit"
                    className="w-full bg-gradient-to-r from-purple-500 to-indigo-500 hover:from-purple-600 hover:to-indigo-600 text-white py-6"
                  >
                    <Sparkles className="mr-2 h-5 w-5" />
                    정통사주 분석 시작
                    <ArrowRight className="ml-2 h-5 w-5" />
                  </Button>
                </form>
              </CardContent>
            </Card>

            {/* 안내 문구 */}
            <div className="mt-6 text-center text-sm text-muted-foreground">
              <p>
                기본 사주 분석을 원하시나요?{' '}
                <Link href="/fortune/integrated" className="text-purple-600 hover:underline">
                  통합 운세 분석 →
                </Link>
              </p>
            </div>
          </div>
        </section>
      </div>
    );
  }

  // 로딩
  if (step === 'loading') {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-purple-50 to-indigo-50 dark:from-purple-950/20 dark:to-indigo-950/20">
        <div className="text-center">
          <Loader2 className="w-12 h-12 text-purple-500 animate-spin mx-auto mb-4" />
          <p className="text-gray-600 dark:text-gray-400">정통 사주 분석 중...</p>
          <p className="text-sm text-muted-foreground mt-2">
            십신, 신살, 12운성, 합충형파해를 분석하고 있습니다
          </p>
        </div>
      </div>
    );
  }

  // 에러
  if (step === 'error') {
    return (
      <div className="min-h-screen flex items-center justify-center p-4 bg-gradient-to-b from-purple-50 to-indigo-50 dark:from-purple-950/20 dark:to-indigo-950/20">
        <div className="max-w-md w-full bg-white dark:bg-gray-800 rounded-xl p-8 shadow-lg text-center">
          <div className="w-16 h-16 bg-red-100 dark:bg-red-900/30 rounded-full flex items-center justify-center mx-auto mb-4">
            <span className="text-3xl">!</span>
          </div>
          <h2 className="text-xl font-bold text-gray-800 dark:text-white mb-2">
            분석에 실패했습니다
          </h2>
          <p className="text-gray-600 dark:text-gray-400 mb-6">{error}</p>
          <div className="flex flex-col gap-3">
            <Button onClick={() => setStep('intro')}>다시 시도하기</Button>
            <Link href="/fortune/integrated">
              <Button variant="outline" className="w-full">
                통합 분석으로 이동
              </Button>
            </Link>
          </div>
        </div>
      </div>
    );
  }

  // 결과 화면
  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-8">
      <div className="container mx-auto px-4 max-w-4xl">
        {/* 헤더 */}
        <div className="text-center mb-8">
          <Badge className="mb-2 bg-gradient-to-r from-purple-500 to-indigo-500 text-white">
            <Crown className="mr-1 h-3 w-3" />
            정통 분석 완료
          </Badge>
          <h1 className="text-3xl font-bold text-gray-800 dark:text-white mb-2">
            정통 사주 분석
          </h1>
          <p className="text-gray-600 dark:text-gray-400">
            십신, 신살, 12운성, 합충형파해를 통한 심층 분석
          </p>
        </div>

        {/* 탭 네비게이션 */}
        <div className="bg-white dark:bg-gray-800 rounded-xl p-2 mb-6 shadow-sm border border-gray-200 dark:border-gray-700">
          <div className="flex gap-2 overflow-x-auto">
            {TABS.map((tab) => {
              const Icon = tab.icon;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={cn(
                    'flex items-center gap-2 px-4 py-3 rounded-lg text-sm font-medium transition-all whitespace-nowrap flex-1',
                    activeTab === tab.id
                      ? 'bg-gradient-to-r from-purple-500 to-indigo-500 text-white shadow-md'
                      : 'text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700'
                  )}
                >
                  <Icon className="w-4 h-4" />
                  <span className="hidden sm:inline">{tab.label}</span>
                </button>
              );
            })}
          </div>
        </div>

        {/* 탭 콘텐츠 */}
        <div className="animate-in fade-in duration-300">
          {activeTab === 'sipsin' && data?.sipsin && (
            <SipsinChart
              chart={data.sipsin.chart}
              interpretation={data.sipsin.interpretation}
            />
          )}

          {activeTab === 'sinsal' && data?.sinsal && (
            <SinsalCard analysis={data.sinsal} />
          )}

          {activeTab === 'unsung' && data?.unsung && (
            <UnsungChart analysis={data.unsung} />
          )}

          {activeTab === 'hapchung' && data?.hapchung && (
            <HapChungDiagram analysis={data.hapchung} />
          )}
        </div>

        {/* 다른 분석 버튼 */}
        <div className="mt-8 flex flex-col sm:flex-row gap-3 justify-center">
          <Button variant="outline" onClick={() => setStep('intro')}>
            새로운 분석하기
          </Button>
          <Link href="/fortune/integrated">
            <Button className="w-full sm:w-auto">
              통합 분석 보기
              <ChevronRight className="ml-1 h-4 w-4" />
            </Button>
          </Link>
        </div>

        {/* 면책조항 */}
        <div className="mt-8 text-center text-sm text-gray-500 dark:text-gray-400">
          <p>본 분석은 전통 명리학 이론에 기반한 참고 자료입니다.</p>
          <p>중요한 결정은 반드시 전문가와 상담하시기 바랍니다.</p>
        </div>
      </div>
    </div>
  );
}
