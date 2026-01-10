'use client';

import { useState } from 'react';
import { useTranslations } from 'next-intl';
import { useRouter } from '@/i18n/routing';
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
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import { Progress } from '@/components/ui/progress';
import { Sparkles, ArrowRight, Loader2, Zap, Star, Heart, Briefcase, Activity } from 'lucide-react';

// Generate hour options for birth time
const birthHours = Array.from({ length: 24 }, (_, i) => ({
  value: i.toString().padStart(2, '0'),
  label: `${i.toString().padStart(2, '0')}:00 - ${i.toString().padStart(2, '0')}:59`,
}));

// Mock result data for demonstration
const mockResult = {
  fourPillars: {
    year: { heavenly: '甲', earthly: '子', element: 'Wood' },
    month: { heavenly: '丙', earthly: '寅', element: 'Fire' },
    day: { heavenly: '戊', earthly: '午', element: 'Earth' },
    hour: { heavenly: '庚', earthly: '申', element: 'Metal' },
  },
  scores: {
    overall: 85,
    wealth: 78,
    love: 82,
    career: 90,
    health: 75,
  },
  personality: [
    'Strong leadership qualities',
    'Creative and innovative thinking',
    'Natural ability to inspire others',
    'Practical approach to problem-solving',
  ],
  advice: 'This year brings opportunities for career growth. Focus on building relationships and networking. Financial matters require careful attention in the second half of the year.',
  luckyElements: {
    color: 'Purple',
    number: '7',
    direction: 'South',
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
            Free Analysis
          </Badge>
          <h1 className="text-3xl md:text-4xl font-bold mb-4">{t('title')}</h1>
          <p className="text-muted-foreground">{t('subtitle')}</p>
        </div>

        {/* Form */}
        <Card>
          <CardHeader>
            <CardTitle>Enter Your Information</CardTitle>
            <CardDescription>
              We need your birth information for accurate analysis
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
                    <SelectValue placeholder="Select time" />
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
          <h2 className="text-2xl font-bold mb-2">Analyzing Your Destiny</h2>
          <p className="text-muted-foreground">
            Our AI is analyzing your four pillars of destiny...
          </p>
        </div>
        <div className="space-y-2">
          <Progress value={progress} className="h-3" />
          <p className="text-sm text-muted-foreground">{progress}% complete</p>
        </div>
        <div className="mt-8 flex items-center justify-center gap-2 text-sm text-muted-foreground">
          <Loader2 className="h-4 w-4 animate-spin" />
          <span>Please wait...</span>
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

  const scoreItems = [
    { key: 'overall', icon: Zap, color: 'text-purple-500' },
    { key: 'wealth', icon: Star, color: 'text-yellow-500' },
    { key: 'love', icon: Heart, color: 'text-pink-500' },
    { key: 'career', icon: Briefcase, color: 'text-blue-500' },
    { key: 'health', icon: Activity, color: 'text-green-500' },
  ];

  return (
    <div className="container mx-auto px-4 py-8 md:py-16">
      <div className="max-w-3xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <Badge className="mb-4 bg-green-100 text-green-700 dark:bg-green-900 dark:text-green-300">
            Analysis Complete
          </Badge>
          <h1 className="text-3xl md:text-4xl font-bold mb-2">{t('title')}</h1>
          <p className="text-muted-foreground">
            {formData.name} - {formData.birthDate}
          </p>
        </div>

        {/* Four Pillars */}
        <Card className="mb-6">
          <CardHeader>
            <CardTitle>{t('fourPillars')}</CardTitle>
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

        {/* Scores */}
        <Card className="mb-6">
          <CardHeader>
            <CardTitle>Fortune Scores</CardTitle>
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
                        <span className="text-sm font-medium capitalize">{item.key}</span>
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

        {/* Personality */}
        <Card className="mb-6">
          <CardHeader>
            <CardTitle>{t('personality')}</CardTitle>
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

        {/* Advice */}
        <Card className="mb-6">
          <CardHeader>
            <CardTitle>{t('advice')}</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground">{result.advice}</p>
          </CardContent>
        </Card>

        {/* Lucky Elements */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle>Lucky Elements</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-3 gap-4">
              <div className="text-center p-4 rounded-lg bg-muted">
                <div className="text-sm text-muted-foreground mb-1">Color</div>
                <div className="font-bold text-purple-500">{result.luckyElements.color}</div>
              </div>
              <div className="text-center p-4 rounded-lg bg-muted">
                <div className="text-sm text-muted-foreground mb-1">Number</div>
                <div className="font-bold text-primary">{result.luckyElements.number}</div>
              </div>
              <div className="text-center p-4 rounded-lg bg-muted">
                <div className="text-sm text-muted-foreground mb-1">Direction</div>
                <div className="font-bold">{result.luckyElements.direction}</div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Actions */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Button variant="outline" onClick={onReset}>
            Try Again
          </Button>
          <Button>
            Get Premium Analysis
            <ArrowRight className="ml-2 h-4 w-4" />
          </Button>
        </div>
      </div>
    </div>
  );
}
