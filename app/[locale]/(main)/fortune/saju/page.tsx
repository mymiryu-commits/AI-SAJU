'use client';

import { useState, useEffect } from 'react';
import { useTranslations } from 'next-intl';
import { useRouter, Link } from '@/i18n/routing';
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
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Progress } from '@/components/ui/progress';
import { Sparkles, ArrowRight, Loader2, Zap, Star, Heart, Briefcase, Activity, Lock } from 'lucide-react';

// Generate hour options for birth time
const birthHours = Array.from({ length: 24 }, (_, i) => ({
  value: i.toString().padStart(2, '0'),
  label: `${i.toString().padStart(2, '0')}:00 - ${i.toString().padStart(2, '0')}:59`,
}));

// Mock result data for demonstration
const mockResult = {
  fourPillars: {
    year: { heavenly: '甲', earthly: '子', element: '목(木)' },
    month: { heavenly: '丙', earthly: '寅', element: '화(火)' },
    day: { heavenly: '戊', earthly: '午', element: '토(土)' },
    hour: { heavenly: '庚', earthly: '申', element: '금(金)' },
  },
  scores: {
    overall: 85,
    wealth: 78,
    love: 82,
    career: 90,
    health: 75,
  },
  personality: [
    '강한 리더십과 추진력이 있습니다',
    '창의적이고 혁신적인 사고를 가지고 있습니다',
    '타인을 이끄는 자연스러운 능력이 있습니다',
    '문제 해결에 있어 실용적인 접근을 합니다',
  ],
  advice: '올해는 직장 성장의 기회가 있습니다. 관계 구축과 네트워킹에 집중하세요. 하반기에는 재정적 사안에 신중한 주의가 필요합니다.',
  luckyElements: {
    color: '보라색',
    number: '7',
    direction: '남쪽',
  },
};

export default function SajuPage() {
  const t = useTranslations('fortune.saju');
  const router = useRouter();
  const [step, setStep] = useState<'form' | 'analyzing' | 'result'>('form');
  const [progress, setProgress] = useState(0);
  const [formData, setFormData] = useState({
    name: '',
    birthDate: '',
    birthHour: '',
    gender: '',
    calendar: 'solar',
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setStep('analyzing');

    // Simulate analysis progress
    const progressInterval = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 100) {
          clearInterval(progressInterval);
          setStep('result');
          return 100;
        }
        return prev + 10;
      });
    }, 300);
  };

  const handleChange = (name: string, value: string) => {
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  if (step === 'analyzing') {
    return <AnalyzingView progress={progress} />;
  }

  if (step === 'result') {
    return <ResultView result={mockResult} formData={formData} onReset={() => { setStep('form'); setProgress(0); }} />;
  }

  return (
    <div className="container mx-auto px-4 py-8 md:py-16">
      <div className="max-w-2xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <Badge className="mb-4 bg-purple-100 text-purple-700 dark:bg-purple-900 dark:text-purple-300">
            <Sparkles className="mr-1 h-3 w-3" />
            무료 분석
          </Badge>
          <h1 className="text-3xl md:text-4xl font-bold mb-4">{t('title')}</h1>
          <p className="text-muted-foreground">{t('subtitle')}</p>
        </div>

        {/* Form */}
        <Card>
          <CardHeader>
            <CardTitle>생년월일 정보 입력</CardTitle>
            <CardDescription>
              정확한 분석을 위해 생년월일 정보가 필요합니다
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Name */}
              <div className="space-y-2">
                <Label htmlFor="name">{t('form.name')}</Label>
                <Input
                  id="name"
                  placeholder={t('form.namePlaceholder')}
                  value={formData.name}
                  onChange={(e) => handleChange('name', e.target.value)}
                  required
                />
              </div>

              {/* Birth Date */}
              <div className="space-y-2">
                <Label htmlFor="birthDate">{t('form.birthDate')}</Label>
                <Input
                  id="birthDate"
                  type="date"
                  value={formData.birthDate}
                  onChange={(e) => handleChange('birthDate', e.target.value)}
                  required
                />
              </div>

              {/* Calendar Type */}
              <div className="space-y-2">
                <Label>{t('form.calendar')}</Label>
                <Tabs
                  value={formData.calendar}
                  onValueChange={(value) => handleChange('calendar', value)}
                >
                  <TabsList className="grid w-full grid-cols-2">
                    <TabsTrigger value="solar">{t('form.calendarSolar')}</TabsTrigger>
                    <TabsTrigger value="lunar">{t('form.calendarLunar')}</TabsTrigger>
                  </TabsList>
                </Tabs>
              </div>

              {/* Birth Time */}
              <div className="space-y-2">
                <Label>{t('form.birthTime')}</Label>
                <Select
                  value={formData.birthHour}
                  onValueChange={(value) => handleChange('birthHour', value)}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="시간 선택" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="unknown">{t('form.birthTimeUnknown')}</SelectItem>
                    {birthHours.map((hour) => (
                      <SelectItem key={hour.value} value={hour.value}>
                        {hour.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {/* Gender */}
              <div className="space-y-2">
                <Label>{t('form.gender')}</Label>
                <Tabs
                  value={formData.gender}
                  onValueChange={(value) => handleChange('gender', value)}
                >
                  <TabsList className="grid w-full grid-cols-2">
                    <TabsTrigger value="male">{t('form.genderMale')}</TabsTrigger>
                    <TabsTrigger value="female">{t('form.genderFemale')}</TabsTrigger>
                  </TabsList>
                </Tabs>
              </div>

              <Button type="submit" size="lg" className="w-full">
                {t('form.submit')}
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

function AnalyzingView({ progress }: { progress: number }) {
  return (
    <div className="container mx-auto px-4 py-16">
      <div className="max-w-md mx-auto text-center">
        <div className="mb-8">
          <div className="w-24 h-24 mx-auto mb-6 rounded-full fortune-gradient flex items-center justify-center animate-pulse">
            <Sparkles className="h-12 w-12 text-white" />
          </div>
          <h2 className="text-2xl font-bold mb-2">사주팔자 분석 중</h2>
          <p className="text-muted-foreground">
            AI가 당신의 사주팔자를 분석하고 있습니다...
          </p>
        </div>
        <div className="space-y-2">
          <Progress value={progress} className="h-3" />
          <p className="text-sm text-muted-foreground">{progress}% 완료</p>
        </div>
        <div className="mt-8 flex items-center justify-center gap-2 text-sm text-muted-foreground">
          <Loader2 className="h-4 w-4 animate-spin" />
          <span>잠시만 기다려주세요...</span>
        </div>
      </div>
    </div>
  );
}

function ResultView({
  result,
  formData,
  onReset,
}: {
  result: typeof mockResult;
  formData: { name: string; birthDate: string };
  onReset: () => void;
}) {
  const t = useTranslations('fortune.saju.result');
  const [timeLeft, setTimeLeft] = useState({ hours: 23, minutes: 59, seconds: 59 });

  // Countdown timer effect
  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft(prev => {
        let { hours, minutes, seconds } = prev;
        seconds--;
        if (seconds < 0) {
          seconds = 59;
          minutes--;
        }
        if (minutes < 0) {
          minutes = 59;
          hours--;
        }
        if (hours < 0) {
          hours = 23;
          minutes = 59;
          seconds = 59;
        }
        return { hours, minutes, seconds };
      });
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  const scoreItems = [
    { key: 'overall', label: '종합운', icon: Zap, color: 'text-purple-500' },
    { key: 'wealth', label: '재물운', icon: Star, color: 'text-yellow-500' },
    { key: 'love', label: '애정운', icon: Heart, color: 'text-pink-500' },
    { key: 'career', label: '직업운', icon: Briefcase, color: 'text-blue-500' },
    { key: 'health', label: '건강운', icon: Activity, color: 'text-green-500' },
  ];

  // Premium content that will be blurred
  const premiumContent = {
    detailedPersonality: '당신은 강한 리더십과 창의적 사고를 가진 사람입니다. 天干의 甲木이 강하게 작용하여 새로운 시작과 도전에 적합한 운을 타고났습니다. 특히 사업과 창업에 있어서 남다른 안목을 가지고 있으며, 위기 상황에서도 침착하게 대처하는 능력이 있습니다...',
    wealthFortune: '2025년 재물운은 상반기에 집중되어 있습니다. 특히 3월과 7월에 좋은 기회가 찾아올 것입니다. 투자보다는 저축과 안정적인 자산 관리에 집중하는 것이 좋습니다. 下半期에는 예상치 못한 지출이 있을 수 있으니 비상금을 준비해두세요...',
    loveFortune: '연애운은 5월에서 8월 사이가 가장 좋습니다. 싱글이라면 이 시기에 좋은 인연을 만날 가능성이 높습니다. 기존 연인이 있다면 관계가 더욱 깊어지는 시기입니다. 다만 11월경에는 사소한 오해로 갈등이 생길 수 있으니 대화를 아끼지 마세요...',
    careerFortune: '직장인이라면 승진 또는 중요한 프로젝트 기회가 있습니다. 특히 상반기에 좋은 결과를 얻을 수 있습니다. 이직을 고려 중이라면 6월 이후가 적합합니다. 사업을 하고 계신다면 새로운 파트너십을 통해 성장할 기회가 있습니다...',
    monthlyFortune: [
      { month: '1월', score: 75, summary: '새해 계획 수립에 좋은 시기' },
      { month: '2월', score: 82, summary: '인간관계 확장의 달' },
      { month: '3월', score: 90, summary: '재물운 상승, 투자 기회' },
      { month: '4월', score: 78, summary: '건강 관리 필요' },
      { month: '5월', score: 85, summary: '연애운 상승' },
      { month: '6월', score: 80, summary: '이직/전직 고려 적기' },
      { month: '7월', score: 92, summary: '황금 기회의 달' },
      { month: '8월', score: 75, summary: '휴식과 재충전' },
      { month: '9월', score: 83, summary: '학업/자기계발 유리' },
      { month: '10월', score: 88, summary: '사업 확장 기회' },
      { month: '11월', score: 70, summary: '신중한 결정 필요' },
      { month: '12월', score: 85, summary: '한 해 마무리와 준비' },
    ],
  };

  return (
    <div className="container mx-auto px-4 py-8 md:py-16">
      <div className="max-w-3xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <Badge className="mb-4 bg-green-100 text-green-700 dark:bg-green-900 dark:text-green-300">
            분석 완료
          </Badge>
          <h1 className="text-3xl md:text-4xl font-bold mb-2">{t('title')}</h1>
          <p className="text-muted-foreground">
            {formData.name} - {formData.birthDate}
          </p>
        </div>

        {/* Four Pillars - FREE */}
        <Card className="mb-6">
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle>{t('fourPillars')}</CardTitle>
              <Badge variant="secondary">무료</Badge>
            </div>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-4 gap-4">
              {Object.entries(result.fourPillars).map(([pillar, data]) => (
                <div key={pillar} className="text-center p-4 rounded-lg bg-muted">
                  <div className="text-xs text-muted-foreground mb-2 capitalize">
                    {t(`${pillar}Pillar` as 'yearPillar' | 'monthPillar' | 'dayPillar' | 'hourPillar')}
                  </div>
                  <div className="text-2xl font-bold mb-1">
                    {data.heavenly}
                  </div>
                  <div className="text-xl mb-2">{data.earthly}</div>
                  <Badge variant="outline" className="text-xs">
                    {data.element}
                  </Badge>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Scores - FREE */}
        <Card className="mb-6">
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle>2025년 운세 점수</CardTitle>
              <Badge variant="secondary">무료</Badge>
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {scoreItems.map((item) => {
                const Icon = item.icon;
                const score = result.scores[item.key as keyof typeof result.scores];
                return (
                  <div key={item.key} className="flex items-center gap-4">
                    <div className={`p-2 rounded-lg bg-muted ${item.color}`}>
                      <Icon className="h-5 w-5" />
                    </div>
                    <div className="flex-1">
                      <div className="flex justify-between mb-1">
                        <span className="text-sm font-medium">{item.label}</span>
                        <span className="text-sm font-bold">{score}/100</span>
                      </div>
                      <div className="h-2 bg-muted rounded-full overflow-hidden">
                        <div
                          className="h-full bg-gradient-to-r from-purple-500 to-pink-500 transition-all"
                          style={{ width: `${score}%` }}
                        />
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </CardContent>
        </Card>

        {/* Basic Personality - FREE */}
        <Card className="mb-6">
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle>기본 성격 분석</CardTitle>
              <Badge variant="secondary">무료</Badge>
            </div>
          </CardHeader>
          <CardContent>
            <ul className="space-y-2">
              {result.personality.map((trait, index) => (
                <li key={index} className="flex items-start gap-2">
                  <Sparkles className="h-4 w-4 text-primary mt-0.5" />
                  <span>{trait}</span>
                </li>
              ))}
            </ul>
          </CardContent>
        </Card>

        {/* Lucky Elements - FREE */}
        <Card className="mb-6">
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle>행운의 요소</CardTitle>
              <Badge variant="secondary">무료</Badge>
            </div>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-3 gap-4">
              <div className="text-center p-4 rounded-lg bg-muted">
                <div className="text-sm text-muted-foreground mb-1">행운의 색</div>
                <div className="font-bold text-purple-500">{result.luckyElements.color}</div>
              </div>
              <div className="text-center p-4 rounded-lg bg-muted">
                <div className="text-sm text-muted-foreground mb-1">행운의 숫자</div>
                <div className="font-bold text-primary">{result.luckyElements.number}</div>
              </div>
              <div className="text-center p-4 rounded-lg bg-muted">
                <div className="text-sm text-muted-foreground mb-1">행운의 방향</div>
                <div className="font-bold">{result.luckyElements.direction}</div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* PREMIUM SECTION - BLURRED */}
        <div className="relative mb-6">
          <div className="absolute inset-0 flex flex-col items-center justify-center z-10 bg-white/80 dark:bg-black/80 backdrop-blur-sm rounded-xl">
            <Lock className="h-12 w-12 text-primary mb-4" />
            <h3 className="text-xl font-bold mb-2">프리미엄 분석 보기</h3>
            <p className="text-muted-foreground text-center mb-4 px-4">
              상세 성격 분석, 재물운, 연애운, 직업운까지<br/>
              모든 정보를 확인하세요
            </p>
            <div className="flex items-center gap-2 mb-4">
              <span className="text-2xl font-bold text-primary">₩4,130</span>
              <span className="text-muted-foreground line-through">₩5,900</span>
              <Badge className="bg-red-500">30% OFF</Badge>
            </div>
          </div>

          <Card className="blur-sm pointer-events-none">
            <CardHeader>
              <CardTitle>상세 성격 분석</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground">{premiumContent.detailedPersonality}</p>
            </CardContent>
          </Card>
        </div>

        <div className="relative mb-6">
          <div className="absolute inset-0 flex items-center justify-center z-10">
            <Badge className="bg-purple-600 text-white px-4 py-2">
              <Lock className="h-4 w-4 mr-2" />
              Premium
            </Badge>
          </div>
          <Card className="blur-sm pointer-events-none">
            <CardHeader>
              <CardTitle>2025년 재물운 상세</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground">{premiumContent.wealthFortune}</p>
            </CardContent>
          </Card>
        </div>

        <div className="relative mb-6">
          <div className="absolute inset-0 flex items-center justify-center z-10">
            <Badge className="bg-pink-600 text-white px-4 py-2">
              <Lock className="h-4 w-4 mr-2" />
              Premium
            </Badge>
          </div>
          <Card className="blur-sm pointer-events-none">
            <CardHeader>
              <CardTitle>2025년 연애운 상세</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground">{premiumContent.loveFortune}</p>
            </CardContent>
          </Card>
        </div>

        <div className="relative mb-6">
          <div className="absolute inset-0 flex items-center justify-center z-10">
            <Badge className="bg-blue-600 text-white px-4 py-2">
              <Lock className="h-4 w-4 mr-2" />
              Premium
            </Badge>
          </div>
          <Card className="blur-sm pointer-events-none">
            <CardHeader>
              <CardTitle>2025년 직업운 상세</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground">{premiumContent.careerFortune}</p>
            </CardContent>
          </Card>
        </div>

        {/* Monthly Fortune Preview - BLURRED */}
        <div className="relative mb-8">
          <div className="absolute inset-0 flex flex-col items-center justify-center z-10 bg-white/60 dark:bg-black/60 backdrop-blur-sm rounded-xl">
            <Lock className="h-8 w-8 text-primary mb-2" />
            <p className="font-semibold">월별 상세 운세 12개월</p>
          </div>
          <Card className="blur-sm pointer-events-none">
            <CardHeader>
              <CardTitle>2025년 월별 운세</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-4 gap-2">
                {premiumContent.monthlyFortune.slice(0, 8).map((month) => (
                  <div key={month.month} className="text-center p-2 rounded bg-muted">
                    <div className="font-bold">{month.month}</div>
                    <div className="text-primary">{month.score}점</div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Conversion CTA */}
        <Card className="mb-8 bg-gradient-to-r from-purple-600 to-pink-600 text-white border-0">
          <CardContent className="p-8 text-center">
            <h3 className="text-2xl font-bold mb-2">지금 결제하면 30% 할인!</h3>
            <p className="text-white/80 mb-4">
              상세 분석 + 월별 운세 + PDF 다운로드까지
            </p>

            {/* Countdown Timer */}
            <div className="flex justify-center gap-4 mb-6">
              <div className="bg-white/20 rounded-lg px-4 py-2">
                <div className="text-2xl font-bold">{timeLeft.hours.toString().padStart(2, '0')}</div>
                <div className="text-xs text-white/60">시간</div>
              </div>
              <div className="text-2xl font-bold">:</div>
              <div className="bg-white/20 rounded-lg px-4 py-2">
                <div className="text-2xl font-bold">{timeLeft.minutes.toString().padStart(2, '0')}</div>
                <div className="text-xs text-white/60">분</div>
              </div>
              <div className="text-2xl font-bold">:</div>
              <div className="bg-white/20 rounded-lg px-4 py-2">
                <div className="text-2xl font-bold">{timeLeft.seconds.toString().padStart(2, '0')}</div>
                <div className="text-xs text-white/60">초</div>
              </div>
            </div>

            <div className="flex items-center justify-center gap-4 mb-6">
              <span className="text-3xl font-bold">₩4,130</span>
              <span className="text-xl text-white/60 line-through">₩5,900</span>
            </div>

            <Button size="lg" className="bg-white text-purple-600 hover:bg-white/90 w-full max-w-md">
              프리미엄 분석 결제하기
              <ArrowRight className="ml-2 h-4 w-4" />
            </Button>

            <p className="text-xs text-white/60 mt-4">
              카카오페이, 네이버페이, 신용카드 결제 가능
            </p>
          </CardContent>
        </Card>

        {/* Actions */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Button variant="outline" onClick={onReset}>
            다시 분석하기
          </Button>
          <Link href="/fortune">
            <Button variant="ghost">
              다른 운세 보기
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
}
