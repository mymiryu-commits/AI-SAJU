'use client';

import { useState } from 'react';
import { useTranslations } from 'next-intl';
import { Link } from '@/i18n/routing';
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
import {
  Heart,
  Users,
  Briefcase,
  Home,
  ArrowRight,
  Loader2,
  Sparkles,
  ThumbsUp,
  AlertTriangle,
  Star,
  Lock,
} from 'lucide-react';

type RelationType = 'romantic' | 'friend' | 'colleague' | 'family';

interface PersonData {
  name: string;
  birthDate: string;
  birthHour: string;
  gender: string;
  calendar: string;
}

const relationTypes: { id: RelationType; label: string; icon: typeof Heart; color: string }[] = [
  { id: 'romantic', label: '연인/배우자', icon: Heart, color: 'text-pink-500' },
  { id: 'friend', label: '친구', icon: Users, color: 'text-blue-500' },
  { id: 'colleague', label: '동료/비즈니스', icon: Briefcase, color: 'text-green-500' },
  { id: 'family', label: '가족', icon: Home, color: 'text-orange-500' },
];

const birthHours = Array.from({ length: 24 }, (_, i) => ({
  value: i.toString().padStart(2, '0'),
  label: `${i.toString().padStart(2, '0')}:00 - ${i.toString().padStart(2, '0')}:59`,
}));

// Mock compatibility result
const mockResult = {
  score: 87,
  chemistry: 92,
  communication: 85,
  values: 88,
  growth: 82,
  challenges: 78,
  overallAnalysis: '두 분은 서로를 보완하는 좋은 궁합을 가지고 있습니다. 甲木과 庚金의 조화는 서로 다른 강점을 가져와 균형 잡힌 관계를 만들어냅니다.',
  strengths: [
    '서로의 부족한 부분을 채워주는 보완적 관계',
    '깊은 대화와 감정적 교류가 원활함',
    '함께할수록 성장하는 시너지 효과',
    '비슷한 가치관과 인생 목표',
  ],
  cautions: [
    '간헐적인 의견 충돌 가능 - 대화로 해결 필요',
    '서로의 독립적인 시간 존중 필요',
    '금전 문제에서 사전 합의 권장',
  ],
  advice: '이 관계는 시간이 갈수록 더욱 깊어지는 유형입니다. 서로의 다름을 인정하고 존중하는 자세가 중요합니다. 특히 2025년은 함께 새로운 도전을 시작하기에 좋은 해입니다.',
  monthlyCompatibility: [
    { month: '1월', score: 85 }, { month: '2월', score: 90 },
    { month: '3월', score: 88 }, { month: '4월', score: 82 },
    { month: '5월', score: 95 }, { month: '6월', score: 87 },
    { month: '7월', score: 80 }, { month: '8월', score: 85 },
    { month: '9월', score: 92 }, { month: '10월', score: 88 },
    { month: '11월', score: 75 }, { month: '12월', score: 90 },
  ],
};

export default function CompatibilityPage() {
  const t = useTranslations('fortune');
  const [step, setStep] = useState<'form' | 'analyzing' | 'result'>('form');
  const [progress, setProgress] = useState(0);
  const [relationType, setRelationType] = useState<RelationType>('romantic');
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
    setStep('analyzing');

    const progressInterval = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 100) {
          clearInterval(progressInterval);
          setStep('result');
          return 100;
        }
        return prev + 8;
      });
    }, 300);
  };

  const handleChange = (person: 1 | 2, name: string, value: string) => {
    if (person === 1) {
      setPerson1((prev) => ({ ...prev, [name]: value }));
    } else {
      setPerson2((prev) => ({ ...prev, [name]: value }));
    }
  };

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
          <div className="mt-8 flex items-center justify-center gap-2 text-sm text-muted-foreground">
            <Loader2 className="h-4 w-4 animate-spin" />
            <span>잠시만 기다려주세요...</span>
          </div>
        </div>
      </div>
    );
  }

  if (step === 'result') {
    return (
      <div className="container mx-auto px-4 py-8 md:py-16">
        <div className="max-w-3xl mx-auto">
          {/* Header */}
          <div className="text-center mb-8">
            <Badge className="mb-4 bg-pink-100 text-pink-700 dark:bg-pink-900 dark:text-pink-300">
              궁합 분석 완료
            </Badge>
            <h1 className="text-3xl font-bold mb-2">
              {person1.name} ❤️ {person2.name}
            </h1>
            <p className="text-muted-foreground">궁합 점수</p>
          </div>

          {/* Main Score */}
          <Card className="mb-6 text-center bg-gradient-to-r from-pink-50 to-red-50 dark:from-pink-950/20 dark:to-red-950/20 border-pink-200 dark:border-pink-800">
            <CardContent className="py-8">
              <div className="text-6xl font-bold text-pink-600 mb-2">{mockResult.score}점</div>
              <p className="text-muted-foreground">두 분은 매우 좋은 궁합입니다!</p>
              <div className="flex justify-center gap-1 mt-4">
                {Array.from({ length: 5 }).map((_, i) => (
                  <Star
                    key={i}
                    className={`h-6 w-6 ${
                      i < Math.round(mockResult.score / 20)
                        ? 'text-yellow-400 fill-yellow-400'
                        : 'text-gray-300'
                    }`}
                  />
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Score Breakdown - FREE */}
          <Card className="mb-6">
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle>상세 궁합 점수</CardTitle>
                <Badge variant="secondary">무료</Badge>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {[
                  { key: 'chemistry', label: '케미스트리', score: mockResult.chemistry, color: 'bg-pink-500' },
                  { key: 'communication', label: '소통', score: mockResult.communication, color: 'bg-blue-500' },
                  { key: 'values', label: '가치관', score: mockResult.values, color: 'bg-purple-500' },
                  { key: 'growth', label: '성장', score: mockResult.growth, color: 'bg-green-500' },
                  { key: 'challenges', label: '시련 극복', score: mockResult.challenges, color: 'bg-orange-500' },
                ].map((item) => (
                  <div key={item.key}>
                    <div className="flex justify-between mb-1">
                      <span className="text-sm">{item.label}</span>
                      <span className="text-sm font-bold">{item.score}점</span>
                    </div>
                    <div className="h-2 bg-muted rounded-full overflow-hidden">
                      <div
                        className={`h-full ${item.color} transition-all`}
                        style={{ width: `${item.score}%` }}
                      />
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Strengths - FREE */}
          <Card className="mb-6">
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle className="flex items-center gap-2">
                  <ThumbsUp className="h-5 w-5 text-green-500" />
                  잘 맞는 점
                </CardTitle>
                <Badge variant="secondary">무료</Badge>
              </div>
            </CardHeader>
            <CardContent>
              <ul className="space-y-2">
                {mockResult.strengths.map((strength, i) => (
                  <li key={i} className="flex items-start gap-2">
                    <Sparkles className="h-4 w-4 text-green-500 mt-0.5" />
                    <span>{strength}</span>
                  </li>
                ))}
              </ul>
            </CardContent>
          </Card>

          {/* Cautions - FREE */}
          <Card className="mb-6">
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle className="flex items-center gap-2">
                  <AlertTriangle className="h-5 w-5 text-amber-500" />
                  주의할 점
                </CardTitle>
                <Badge variant="secondary">무료</Badge>
              </div>
            </CardHeader>
            <CardContent>
              <ul className="space-y-2">
                {mockResult.cautions.map((caution, i) => (
                  <li key={i} className="flex items-start gap-2">
                    <AlertTriangle className="h-4 w-4 text-amber-500 mt-0.5" />
                    <span>{caution}</span>
                  </li>
                ))}
              </ul>
            </CardContent>
          </Card>

          {/* Premium Content - BLURRED */}
          <div className="relative mb-6">
            <div className="absolute inset-0 flex flex-col items-center justify-center z-10 bg-white/80 dark:bg-black/80 backdrop-blur-sm rounded-xl">
              <Lock className="h-12 w-12 text-pink-500 mb-4" />
              <h3 className="text-xl font-bold mb-2">상세 분석 보기</h3>
              <p className="text-muted-foreground text-center mb-4 px-4">
                월별 궁합 점수, 관계 발전 조언까지
              </p>
              <div className="flex items-center gap-2 mb-4">
                <span className="text-2xl font-bold text-pink-600">₩6,930</span>
                <span className="text-muted-foreground line-through">₩9,900</span>
                <Badge className="bg-red-500">30% OFF</Badge>
              </div>
              <Button className="bg-gradient-to-r from-pink-500 to-red-500">
                프리미엄 분석 결제하기
              </Button>
            </div>

            <Card className="blur-sm pointer-events-none">
              <CardHeader>
                <CardTitle>2025년 월별 궁합</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-4 gap-2">
                  {mockResult.monthlyCompatibility.map((month) => (
                    <div key={month.month} className="text-center p-2 rounded bg-muted">
                      <div className="text-sm font-medium">{month.month}</div>
                      <div className="text-lg font-bold text-pink-600">{month.score}</div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Actions */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button variant="outline" onClick={() => { setStep('form'); setProgress(0); }}>
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

  return (
    <div className="container mx-auto px-4 py-8 md:py-16">
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
                  <Label>이름</Label>
                  <Input
                    placeholder="이름을 입력하세요"
                    value={person1.name}
                    onChange={(e) => handleChange(1, 'name', e.target.value)}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label>생년월일</Label>
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
                  <Label>성별</Label>
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
                  <Label>이름</Label>
                  <Input
                    placeholder="이름을 입력하세요"
                    value={person2.name}
                    onChange={(e) => handleChange(2, 'name', e.target.value)}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label>생년월일</Label>
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
                  <Label>성별</Label>
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

          {/* Submit */}
          <div className="mt-6">
            <Button type="submit" size="lg" className="w-full">
              궁합 분석하기
              <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
          </div>
        </form>

        {/* Pricing Info */}
        <Card className="mt-6 bg-muted/50">
          <CardContent className="py-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="font-medium">기본 궁합 분석</p>
                <p className="text-sm text-muted-foreground">무료로 제공됩니다</p>
              </div>
              <Badge variant="secondary">무료</Badge>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
