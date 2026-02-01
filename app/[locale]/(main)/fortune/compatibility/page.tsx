'use client';

import { useState } from 'react';
import { useTranslations } from 'next-intl';
import { Link } from '@/i18n/routing';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertDescription } from '@/components/ui/alert';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Progress } from '@/components/ui/progress';
import {
  Heart,
  Users,
  Briefcase,
  Home,
  ArrowRight,
  ArrowLeft,
  Loader2,
  Sparkles,
  ThumbsUp,
  AlertTriangle,
  Star,
  Lock,
  AlertCircle,
  Calendar,
  TrendingUp,
  MessageCircle,
  Flame,
  Shield,
  Target,
  Share2,
} from 'lucide-react';
import { CompatibilityShareCard } from '@/components/common/SocialShareButtons';

type RelationType = 'couple' | 'friend' | 'colleague' | 'family';

interface PersonData {
  name: string;
  birthDate: string;
  birthHour: string;
  gender: string;
  calendar: string;
}

interface CompatibilityResult {
  totalScore: number;
  grade: 'S' | 'A' | 'B' | 'C' | 'D';
  gradeDescription: string;
  categories: {
    dayMaster: { name: string; score: number; description: string; details: string[] };
    earthlyBranch: { name: string; score: number; description: string; details: string[] };
    oheng: { name: string; score: number; description: string; details: string[] };
    yongsin: { name: string; score: number; description: string; details: string[] };
  };
  synergy: {
    communication: number;
    passion: number;
    stability: number;
    growth: number;
    trust: number;
  };
  strengths: string[];
  challenges: string[];
  advice: string[];
  relationAdvice: string[];
  monthlyCompatibility: { month: string; score: number; advice: string }[];
  person1: { name: string; dayMaster: string; dayMasterKorean: string };
  person2: { name: string; dayMaster: string; dayMasterKorean: string };
}

const relationTypes: { id: RelationType; label: string; icon: typeof Heart; color: string }[] = [
  { id: 'couple', label: '연인/배우자', icon: Heart, color: 'text-pink-500' },
  { id: 'friend', label: '친구', icon: Users, color: 'text-blue-500' },
  { id: 'colleague', label: '동료/비즈니스', icon: Briefcase, color: 'text-green-500' },
  { id: 'family', label: '가족', icon: Home, color: 'text-orange-500' },
];

const birthHours = Array.from({ length: 24 }, (_, i) => ({
  value: i.toString().padStart(2, '0'),
  label: `${i.toString().padStart(2, '0')}:00 - ${i.toString().padStart(2, '0')}:59`,
}));

// 등급별 색상
const gradeColors: Record<string, string> = {
  S: 'bg-gradient-to-r from-yellow-400 to-amber-500 text-white',
  A: 'bg-gradient-to-r from-pink-500 to-rose-500 text-white',
  B: 'bg-gradient-to-r from-blue-500 to-indigo-500 text-white',
  C: 'bg-gradient-to-r from-green-500 to-emerald-500 text-white',
  D: 'bg-gradient-to-r from-gray-500 to-slate-500 text-white',
};

export default function CompatibilityPage() {
  const t = useTranslations('fortune');
  const router = useRouter();
  const [step, setStep] = useState<'form' | 'analyzing' | 'result' | 'error'>('form');
  const [progress, setProgress] = useState(0);
  const [relationType, setRelationType] = useState<RelationType>('couple');
  const [result, setResult] = useState<CompatibilityResult | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isPremiumUnlocked, setIsPremiumUnlocked] = useState(false);

  const [person1, setPerson1] = useState<PersonData>({
    name: '',
    birthDate: '',
    birthHour: '',
    gender: '',
    calendar: 'solar',
  });
  const [person2, setPerson2] = useState<PersonData>({
    name: '',
    birthDate: '',
    birthHour: '',
    gender: '',
    calendar: 'solar',
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // 필수 필드 검증
    if (!person1.name || !person1.birthDate || !person1.gender) {
      setError('첫 번째 분의 이름, 생년월일, 성별을 입력해주세요.');
      return;
    }
    if (!person2.name || !person2.birthDate || !person2.gender) {
      setError('두 번째 분의 이름, 생년월일, 성별을 입력해주세요.');
      return;
    }

    setStep('analyzing');
    setError(null);
    setProgress(0);

    // 진행률 시뮬레이션
    const progressInterval = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 90) return prev;
        return prev + 10;
      });
    }, 300);

    try {
      const response = await fetch('/api/fortune/compatibility', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          type: relationType,
          person1: {
            name: person1.name,
            birthDate: person1.birthDate,
            birthTime: person1.birthHour && person1.birthHour !== 'unknown'
              ? `${person1.birthHour}:00`
              : undefined,
            gender: person1.gender,
            calendar: person1.calendar,
          },
          person2: {
            name: person2.name,
            birthDate: person2.birthDate,
            birthTime: person2.birthHour && person2.birthHour !== 'unknown'
              ? `${person2.birthHour}:00`
              : undefined,
            gender: person2.gender,
            calendar: person2.calendar,
          },
        }),
      });

      clearInterval(progressInterval);
      const data = await response.json();

      if (!response.ok || !data.success) {
        throw new Error(data.error || '궁합 분석 중 오류가 발생했습니다.');
      }

      setProgress(100);
      setResult(data.data);

      setTimeout(() => {
        setStep('result');
      }, 500);

    } catch (err) {
      clearInterval(progressInterval);
      console.error('Compatibility error:', err);
      setError(err instanceof Error ? err.message : '궁합 분석 중 오류가 발생했습니다.');
      setStep('error');
    }
  };

  const handleChange = (person: 1 | 2, name: string, value: string) => {
    if (person === 1) {
      setPerson1((prev) => ({ ...prev, [name]: value }));
    } else {
      setPerson2((prev) => ({ ...prev, [name]: value }));
    }
  };

  const handleReset = () => {
    setStep('form');
    setProgress(0);
    setResult(null);
    setError(null);
  };

  // 에러 화면
  if (step === 'error') {
    return (
      <div className="container mx-auto px-4 py-16">
        <div className="max-w-md mx-auto text-center">
          <div className="w-20 h-20 mx-auto mb-6 rounded-full bg-red-100 dark:bg-red-900/30 flex items-center justify-center">
            <AlertCircle className="h-10 w-10 text-red-500" />
          </div>
          <h2 className="text-2xl font-bold mb-4">분석 중 문제가 발생했습니다</h2>
          <p className="text-muted-foreground mb-6">{error}</p>
          <Button onClick={handleReset}>
            <ArrowLeft className="mr-2 h-4 w-4" />
            다시 시도
          </Button>
        </div>
      </div>
    );
  }

  // 분석 중 화면
  if (step === 'analyzing') {
    return (
      <div className="container mx-auto px-4 py-16">
        <div className="max-w-md mx-auto text-center">
          <div className="mb-8">
            <div className="w-24 h-24 mx-auto mb-6 rounded-full bg-gradient-to-r from-pink-500 to-red-500 flex items-center justify-center animate-pulse">
              <Heart className="h-12 w-12 text-white" />
            </div>
            <h2 className="text-2xl font-bold mb-2">궁합 분석 중</h2>
            <p className="text-muted-foreground">
              {person1.name}님과 {person2.name}님의 운명적 연결을 분석하고 있습니다...
            </p>
          </div>
          <div className="space-y-2">
            <Progress value={progress} className="h-3" />
            <p className="text-sm text-muted-foreground">{progress}% 완료</p>
          </div>
          <div className="mt-8 space-y-2 text-sm text-muted-foreground">
            {progress > 20 && <p>✓ 사주팔자 계산 완료</p>}
            {progress > 40 && <p>✓ 일간 궁합 분석 중</p>}
            {progress > 60 && <p>✓ 오행 상생상극 분석 중</p>}
            {progress > 80 && <p>✓ 시너지 점수 계산 중</p>}
          </div>
          <div className="mt-8 flex items-center justify-center gap-2 text-sm text-muted-foreground">
            <Loader2 className="h-4 w-4 animate-spin" />
            <span>잠시만 기다려주세요...</span>
          </div>
        </div>
      </div>
    );
  }

  // 결과 화면
  if (step === 'result' && result) {
    return (
      <div className="container mx-auto px-4 py-8 md:py-12">
        <div className="max-w-3xl mx-auto">
          {/* Header */}
          <div className="text-center mb-8">
            <Badge className="mb-4 bg-pink-100 text-pink-700 dark:bg-pink-900 dark:text-pink-300">
              {relationTypes.find(r => r.id === relationType)?.label} 궁합 분석 완료
            </Badge>
            <h1 className="text-3xl font-bold mb-2">
              {result.person1.name} ❤️ {result.person2.name}
            </h1>
            <p className="text-muted-foreground">
              {result.person1.dayMasterKorean}({result.person1.dayMaster}) ↔ {result.person2.dayMasterKorean}({result.person2.dayMaster})
            </p>
          </div>

          {/* Main Score */}
          <Card className="mb-6 text-center bg-gradient-to-r from-pink-50 to-red-50 dark:from-pink-950/20 dark:to-red-950/20 border-pink-200 dark:border-pink-800">
            <CardContent className="py-8">
              <div className="inline-flex items-center gap-3 mb-4">
                <Badge className={`text-2xl px-4 py-2 ${gradeColors[result.grade]}`}>
                  {result.grade}
                </Badge>
                <span className="text-5xl font-bold text-pink-600">{result.totalScore}점</span>
              </div>
              <p className="text-lg text-muted-foreground mb-4">{result.gradeDescription}</p>
              <div className="flex justify-center gap-1">
                {Array.from({ length: 5 }).map((_, i) => (
                  <Star
                    key={i}
                    className={`h-6 w-6 ${
                      i < Math.round(result.totalScore / 20)
                        ? 'text-yellow-400 fill-yellow-400'
                        : 'text-gray-300'
                    }`}
                  />
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Synergy Scores */}
          <Card className="mb-6">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Sparkles className="h-5 w-5 text-pink-500" />
                시너지 점수
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {[
                  { key: 'communication', label: '소통', icon: MessageCircle, score: result.synergy.communication, color: 'bg-blue-500' },
                  { key: 'passion', label: '열정', icon: Flame, score: result.synergy.passion, color: 'bg-pink-500' },
                  { key: 'stability', label: '안정', icon: Shield, score: result.synergy.stability, color: 'bg-green-500' },
                  { key: 'growth', label: '성장', icon: TrendingUp, score: result.synergy.growth, color: 'bg-purple-500' },
                  { key: 'trust', label: '신뢰', icon: Heart, score: result.synergy.trust, color: 'bg-orange-500' },
                ].map((item) => {
                  const Icon = item.icon;
                  return (
                    <div key={item.key}>
                      <div className="flex justify-between mb-1">
                        <span className="text-sm flex items-center gap-1">
                          <Icon className="h-4 w-4" />
                          {item.label}
                        </span>
                        <span className="text-sm font-bold">{item.score}점</span>
                      </div>
                      <div className="h-2 bg-muted rounded-full overflow-hidden">
                        <div
                          className={`h-full ${item.color} transition-all`}
                          style={{ width: `${item.score}%` }}
                        />
                      </div>
                    </div>
                  );
                })}
              </div>
            </CardContent>
          </Card>

          {/* Category Scores */}
          <Card className="mb-6">
            <CardHeader>
              <CardTitle>상세 궁합 분석</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 gap-4">
                {Object.entries(result.categories).map(([key, category]) => (
                  <div key={key} className="p-4 rounded-lg bg-muted/50">
                    <div className="flex justify-between items-center mb-2">
                      <span className="font-medium">{category.name}</span>
                      <Badge variant="secondary">{category.score}점</Badge>
                    </div>
                    <p className="text-sm text-muted-foreground">{category.description}</p>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Strengths */}
          <Card className="mb-6">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <ThumbsUp className="h-5 w-5 text-green-500" />
                잘 맞는 점
              </CardTitle>
            </CardHeader>
            <CardContent>
              <ul className="space-y-2">
                {result.strengths.map((strength, i) => (
                  <li key={i} className="flex items-start gap-2">
                    <Sparkles className="h-4 w-4 text-green-500 mt-0.5 flex-shrink-0" />
                    <span>{strength}</span>
                  </li>
                ))}
              </ul>
            </CardContent>
          </Card>

          {/* Challenges */}
          <Card className="mb-6">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <AlertTriangle className="h-5 w-5 text-amber-500" />
                주의할 점
              </CardTitle>
            </CardHeader>
            <CardContent>
              <ul className="space-y-2">
                {result.challenges.map((challenge, i) => (
                  <li key={i} className="flex items-start gap-2">
                    <AlertTriangle className="h-4 w-4 text-amber-500 mt-0.5 flex-shrink-0" />
                    <span>{challenge}</span>
                  </li>
                ))}
              </ul>
            </CardContent>
          </Card>

          {/* Relation Advice */}
          <Card className="mb-6">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Target className="h-5 w-5 text-primary" />
                맞춤 조언
              </CardTitle>
            </CardHeader>
            <CardContent>
              <ul className="space-y-2">
                {result.relationAdvice.map((advice, i) => (
                  <li key={i} className="flex items-start gap-2">
                    <ArrowRight className="h-4 w-4 text-primary mt-0.5 flex-shrink-0" />
                    <span>{advice}</span>
                  </li>
                ))}
              </ul>
            </CardContent>
          </Card>

          {/* Premium: Monthly Compatibility */}
          <div className="relative mb-6">
            {!isPremiumUnlocked && (
              <div className="absolute inset-0 flex flex-col items-center justify-center z-10 bg-white/80 dark:bg-black/80 backdrop-blur-sm rounded-xl">
                <Lock className="h-12 w-12 text-pink-500 mb-4" />
                <h3 className="text-xl font-bold mb-2">2026년 월별 궁합</h3>
                <p className="text-muted-foreground text-center mb-4 px-4">
                  월별 궁합 점수와 조언을 확인하세요
                </p>
                <div className="flex items-center gap-2 mb-4">
                  <span className="text-2xl font-bold text-pink-600">₩9,900</span>
                  <Badge className="bg-red-500 text-white">스탠다드 패키지</Badge>
                </div>
                <Button
                  className="bg-gradient-to-r from-pink-500 to-red-500"
                  onClick={() => router.push('/pricing')}
                >
                  결제권 구매하기
                </Button>
              </div>
            )}

            <Card className={!isPremiumUnlocked ? 'blur-sm pointer-events-none' : ''}>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Calendar className="h-5 w-5 text-primary" />
                  2026년 월별 궁합
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-3 md:grid-cols-4 gap-3">
                  {result.monthlyCompatibility.map((month) => (
                    <div key={month.month} className="text-center p-3 rounded-lg bg-muted">
                      <div className="text-sm font-medium mb-1">{month.month}</div>
                      <div className={`text-xl font-bold ${
                        month.score >= 85 ? 'text-pink-600' :
                        month.score >= 75 ? 'text-blue-600' :
                        'text-gray-600'
                      }`}>
                        {month.score}
                      </div>
                      {isPremiumUnlocked && (
                        <div className="text-xs text-muted-foreground mt-1">{month.advice}</div>
                      )}
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* 공유 카드 - 바이럴 마케팅 */}
          <Card className="mb-6 overflow-hidden">
            <CardHeader className="bg-gradient-to-r from-pink-50 to-purple-50 dark:from-pink-950/30 dark:to-purple-950/30">
              <CardTitle className="flex items-center gap-2 text-lg">
                <Share2 className="h-5 w-5 text-pink-500" />
                결과 공유하기
              </CardTitle>
              <CardDescription>
                친구에게 궁합 결과를 공유하고 함께 분석해보세요!
              </CardDescription>
            </CardHeader>
            <CardContent className="p-0">
              <CompatibilityShareCard
                person1Name={result.person1.name}
                person2Name={result.person2.name}
                score={result.totalScore}
                grade={result.grade}
                relationType={relationType}
              />
            </CardContent>
          </Card>

          {/* Actions */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button variant="outline" onClick={handleReset}>
              <ArrowLeft className="mr-2 h-4 w-4" />
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

  // 입력 폼
  return (
    <div className="container mx-auto px-4 py-8 md:py-12">
      <div className="max-w-2xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <Badge className="mb-4 bg-pink-100 text-pink-700 dark:bg-pink-900 dark:text-pink-300">
            <Heart className="mr-1 h-3 w-3" />
            궁합 분석
          </Badge>
          <h1 className="text-3xl md:text-4xl font-bold mb-4">사주 궁합 분석</h1>
          <p className="text-muted-foreground">
            두 사람의 사주를 분석하여 궁합을 확인하세요
          </p>
        </div>

        {/* Error Alert */}
        {error && (
          <Alert variant="destructive" className="mb-6">
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}

        {/* Relation Type */}
        <Card className="mb-6">
          <CardHeader>
            <CardTitle>관계 유형</CardTitle>
            <CardDescription>분석할 관계 유형을 선택해주세요</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-4 gap-2">
              {relationTypes.map((type) => {
                const Icon = type.icon;
                const isSelected = relationType === type.id;
                return (
                  <button
                    key={type.id}
                    onClick={() => setRelationType(type.id)}
                    className={`p-4 rounded-lg border-2 transition-all ${
                      isSelected
                        ? 'border-primary bg-primary/5'
                        : 'border-muted hover:border-muted-foreground/20'
                    }`}
                  >
                    <Icon className={`h-6 w-6 mx-auto mb-2 ${isSelected ? 'text-primary' : type.color}`} />
                    <div className="text-xs font-medium">{type.label}</div>
                  </button>
                );
              })}
            </div>
          </CardContent>
        </Card>

        {/* Form */}
        <form onSubmit={handleSubmit}>
          <div className="grid md:grid-cols-2 gap-6">
            {/* Person 1 */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">첫 번째 분</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label>이름 *</Label>
                  <Input
                    placeholder="이름을 입력하세요"
                    value={person1.name}
                    onChange={(e) => handleChange(1, 'name', e.target.value)}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label>생년월일 *</Label>
                  <Input
                    type="date"
                    value={person1.birthDate}
                    onChange={(e) => handleChange(1, 'birthDate', e.target.value)}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label>양력/음력</Label>
                  <Tabs
                    value={person1.calendar}
                    onValueChange={(value) => handleChange(1, 'calendar', value)}
                  >
                    <TabsList className="grid w-full grid-cols-2">
                      <TabsTrigger value="solar">양력</TabsTrigger>
                      <TabsTrigger value="lunar">음력</TabsTrigger>
                    </TabsList>
                  </Tabs>
                </div>
                <div className="space-y-2">
                  <Label>태어난 시간</Label>
                  <Select
                    value={person1.birthHour}
                    onValueChange={(value) => handleChange(1, 'birthHour', value)}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="시간 선택" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="unknown">모름</SelectItem>
                      {birthHours.map((hour) => (
                        <SelectItem key={hour.value} value={hour.value}>
                          {hour.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label>성별 *</Label>
                  <Tabs
                    value={person1.gender}
                    onValueChange={(value) => handleChange(1, 'gender', value)}
                  >
                    <TabsList className="grid w-full grid-cols-2">
                      <TabsTrigger value="male">남성</TabsTrigger>
                      <TabsTrigger value="female">여성</TabsTrigger>
                    </TabsList>
                  </Tabs>
                </div>
              </CardContent>
            </Card>

            {/* Person 2 */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">두 번째 분</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label>이름 *</Label>
                  <Input
                    placeholder="이름을 입력하세요"
                    value={person2.name}
                    onChange={(e) => handleChange(2, 'name', e.target.value)}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label>생년월일 *</Label>
                  <Input
                    type="date"
                    value={person2.birthDate}
                    onChange={(e) => handleChange(2, 'birthDate', e.target.value)}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label>양력/음력</Label>
                  <Tabs
                    value={person2.calendar}
                    onValueChange={(value) => handleChange(2, 'calendar', value)}
                  >
                    <TabsList className="grid w-full grid-cols-2">
                      <TabsTrigger value="solar">양력</TabsTrigger>
                      <TabsTrigger value="lunar">음력</TabsTrigger>
                    </TabsList>
                  </Tabs>
                </div>
                <div className="space-y-2">
                  <Label>태어난 시간</Label>
                  <Select
                    value={person2.birthHour}
                    onValueChange={(value) => handleChange(2, 'birthHour', value)}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="시간 선택" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="unknown">모름</SelectItem>
                      {birthHours.map((hour) => (
                        <SelectItem key={hour.value} value={hour.value}>
                          {hour.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label>성별 *</Label>
                  <Tabs
                    value={person2.gender}
                    onValueChange={(value) => handleChange(2, 'gender', value)}
                  >
                    <TabsList className="grid w-full grid-cols-2">
                      <TabsTrigger value="male">남성</TabsTrigger>
                      <TabsTrigger value="female">여성</TabsTrigger>
                    </TabsList>
                  </Tabs>
                </div>
              </CardContent>
            </Card>
          </div>

          <Button
            type="submit"
            size="lg"
            className="w-full mt-6 bg-gradient-to-r from-pink-500 to-red-500 hover:from-pink-600 hover:to-red-600"
          >
            <Heart className="mr-2 h-5 w-5" />
            궁합 분석하기
            <ArrowRight className="ml-2 h-5 w-5" />
          </Button>
        </form>
      </div>
    </div>
  );
}
