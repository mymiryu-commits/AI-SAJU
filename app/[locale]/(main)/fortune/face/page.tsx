'use client';

import { useState, useRef, useCallback } from 'react';
import { useTranslations } from 'next-intl';
import { Link } from '@/i18n/routing';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import {
  Camera,
  Upload,
  X,
  Sparkles,
  ArrowRight,
  Loader2,
  Eye,
  Smile,
  User,
  Star,
  Heart,
  Briefcase,
  Coins,
  Shield,
  AlertCircle,
} from 'lucide-react';

// Mock 관상 분석 결과
const mockFaceResult = {
  overallScore: 82,
  features: {
    forehead: {
      score: 85,
      meaning: '높고 넓은 이마는 뛰어난 지성과 출세운을 나타냅니다.',
      trait: '지적 리더십',
    },
    eyes: {
      score: 88,
      meaning: '맑고 밝은 눈은 정직함과 좋은 통찰력을 보여줍니다.',
      trait: '통찰력 & 정직',
    },
    nose: {
      score: 78,
      meaning: '균형 잡힌 코는 안정적인 재물 성장을 나타냅니다.',
      trait: '안정된 재물운',
    },
    mouth: {
      score: 80,
      meaning: '풍성한 입술은 좋은 의사소통 능력과 카리스마를 나타냅니다.',
      trait: '카리스마 있는 화술',
    },
    jawline: {
      score: 75,
      meaning: '강한 턱선은 결단력과 회복력을 보여줍니다.',
      trait: '결단력',
    },
  },
  predictions: {
    career: 85,
    wealth: 78,
    love: 82,
    health: 80,
  },
  personality: [
    '강한 결정력을 가진 타고난 리더',
    '문제 해결에 탁월한 창의적 사고력',
    '타인에 대한 공감과 이해심',
    '미래에 대한 명확한 비전을 가진 야심가',
  ],
  advice: '관상 분석 결과 균형 잡힌 인생이 예상됩니다. 타고난 카리스마를 직업에 활용하세요. 앞으로 5년이 사업 운이 특히 좋습니다.',
};

export default function FaceReadingPage() {
  const t = useTranslations('fortune');
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [image, setImage] = useState<string | null>(null);
  const [step, setStep] = useState<'upload' | 'analyzing' | 'result'>('upload');
  const [progress, setProgress] = useState(0);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        setImage(e.target?.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    const file = e.dataTransfer.files?.[0];
    if (file && file.type.startsWith('image/')) {
      const reader = new FileReader();
      reader.onload = (e) => {
        setImage(e.target?.result as string);
      };
      reader.readAsDataURL(file);
    }
  }, []);

  const handleAnalyze = () => {
    setStep('analyzing');
    const interval = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 100) {
          clearInterval(interval);
          setStep('result');
          return 100;
        }
        return prev + 5;
      });
    }, 150);
  };

  const handleReset = () => {
    setImage(null);
    setStep('upload');
    setProgress(0);
  };

  if (step === 'analyzing') {
    return (
      <div className="container mx-auto px-4 py-16">
        <div className="max-w-md mx-auto text-center">
          <div className="relative mb-8">
            {image && (
              <div className="w-48 h-48 mx-auto rounded-full overflow-hidden border-4 border-primary">
                <img
                  src={image}
                  alt="사진"
                  className="w-full h-full object-cover"
                />
              </div>
            )}
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="w-56 h-56 rounded-full border-4 border-primary border-t-transparent animate-spin" />
            </div>
          </div>
          <h2 className="text-2xl font-bold mb-2">관상을 분석하고 있습니다</h2>
          <p className="text-muted-foreground mb-6">
            AI가 얼굴 특징을 분석하고 있습니다...
          </p>
          <div className="space-y-2">
            <Progress value={progress} className="h-3" />
            <p className="text-sm text-muted-foreground">{progress}% 완료</p>
          </div>
          <div className="mt-8 space-y-2 text-sm text-muted-foreground">
            {progress > 20 && <p className="animate-pulse">이마 영역 분석 중...</p>}
            {progress > 40 && <p className="animate-pulse">눈 특징 분석 중...</p>}
            {progress > 60 && <p className="animate-pulse">코 비율 분석 중...</p>}
            {progress > 80 && <p className="animate-pulse">전체 조화 평가 중...</p>}
          </div>
        </div>
      </div>
    );
  }

  if (step === 'result') {
    return <FaceReadingResult result={mockFaceResult} image={image} onReset={handleReset} />;
  }

  return (
    <div className="container mx-auto px-4 py-8 md:py-16">
      <div className="max-w-2xl mx-auto">
        {/* 헤더 */}
        <div className="text-center mb-8">
          <Badge className="mb-4 bg-blue-100 text-blue-700 dark:bg-blue-900 dark:text-blue-300">
            <Eye className="mr-1 h-3 w-3" />
            AI 관상 분석
          </Badge>
          <h1 className="text-3xl md:text-4xl font-bold mb-4">AI 관상 분석</h1>
          <p className="text-muted-foreground">
            선명한 정면 사진을 업로드하면 AI가 관상을 분석해 드립니다
          </p>
        </div>

        {/* 업로드 카드 */}
        <Card>
          <CardHeader>
            <CardTitle>사진 업로드</CardTitle>
            <CardDescription>
              정확한 분석을 위해 정면 사진과 좋은 조명이 필요합니다
            </CardDescription>
          </CardHeader>
          <CardContent>
            {!image ? (
              <div
                className="border-2 border-dashed rounded-lg p-12 text-center hover:border-primary transition-colors cursor-pointer"
                onDragOver={(e) => e.preventDefault()}
                onDrop={handleDrop}
                onClick={() => fileInputRef.current?.click()}
              >
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/*"
                  className="hidden"
                  onChange={handleFileChange}
                />
                <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-muted flex items-center justify-center">
                  <Upload className="h-8 w-8 text-muted-foreground" />
                </div>
                <p className="text-lg font-medium mb-2">
                  사진을 드래그하거나 클릭하여 업로드하세요
                </p>
                <p className="text-sm text-muted-foreground">
                  JPG, PNG 지원 (최대 10MB)
                </p>
              </div>
            ) : (
              <div className="space-y-4">
                <div className="relative w-64 h-64 mx-auto">
                  <img
                    src={image}
                    alt="업로드된 사진"
                    className="w-full h-full object-cover rounded-lg"
                  />
                  <button
                    onClick={handleReset}
                    className="absolute -top-2 -right-2 p-1 bg-destructive text-destructive-foreground rounded-full"
                  >
                    <X className="h-4 w-4" />
                  </button>
                </div>
                <Button onClick={handleAnalyze} className="w-full" size="lg">
                  <Sparkles className="mr-2 h-4 w-4" />
                  분석 시작
                </Button>
              </div>
            )}
          </CardContent>
        </Card>

        {/* 팁 */}
        <Card className="mt-6">
          <CardHeader>
            <CardTitle className="text-lg">좋은 결과를 위한 팁</CardTitle>
          </CardHeader>
          <CardContent>
            <ul className="space-y-3">
              <li className="flex items-start gap-3">
                <Camera className="h-5 w-5 text-primary mt-0.5" />
                <span>정면을 바라보는 선명한 사진을 사용하세요</span>
              </li>
              <li className="flex items-start gap-3">
                <Smile className="h-5 w-5 text-primary mt-0.5" />
                <span>무표정을 유지해 주세요</span>
              </li>
              <li className="flex items-start gap-3">
                <User className="h-5 w-5 text-primary mt-0.5" />
                <span>얼굴 전체가 보이도록 해주세요</span>
              </li>
              <li className="flex items-start gap-3">
                <AlertCircle className="h-5 w-5 text-primary mt-0.5" />
                <span>진한 화장이나 액세서리는 피해주세요</span>
              </li>
            </ul>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

function FaceReadingResult({
  result,
  image,
  onReset,
}: {
  result: typeof mockFaceResult;
  image: string | null;
  onReset: () => void;
}) {
  const featureLabels: Record<string, string> = {
    forehead: '이마',
    eyes: '눈',
    nose: '코',
    mouth: '입',
    jawline: '턱선',
  };

  const featureIcons = {
    forehead: User,
    eyes: Eye,
    nose: Smile,
    mouth: Smile,
    jawline: Shield,
  };

  const predictionItems = [
    { key: 'career', label: '직업운', icon: Briefcase, color: 'text-blue-500' },
    { key: 'wealth', label: '재물운', icon: Coins, color: 'text-yellow-500' },
    { key: 'love', label: '애정운', icon: Heart, color: 'text-pink-500' },
    { key: 'health', label: '건강운', icon: Shield, color: 'text-green-500' },
  ];

  return (
    <div className="container mx-auto px-4 py-8 md:py-16">
      <div className="max-w-4xl mx-auto">
        {/* 헤더 */}
        <div className="text-center mb-8">
          <Badge className="mb-4 bg-green-100 text-green-700 dark:bg-green-900 dark:text-green-300">
            분석 완료
          </Badge>
          <h1 className="text-3xl md:text-4xl font-bold mb-4">관상 분석 결과</h1>
        </div>

        {/* 종합 점수 카드 */}
        <Card className="mb-6 overflow-hidden">
          <div className="grid md:grid-cols-3">
            {image && (
              <div className="p-6 flex items-center justify-center bg-muted">
                <img
                  src={image}
                  alt="사진"
                  className="w-48 h-48 object-cover rounded-full border-4 border-background"
                />
              </div>
            )}
            <div className={`p-6 ${image ? 'md:col-span-2' : 'md:col-span-3'}`}>
              <div className="text-center md:text-left">
                <h2 className="text-lg text-muted-foreground mb-2">종합 점수</h2>
                <div className="text-6xl font-bold text-primary mb-4">
                  {result.overallScore}
                  <span className="text-2xl text-muted-foreground">/100</span>
                </div>
                <div className="h-3 bg-muted rounded-full overflow-hidden">
                  <div
                    className="h-full bg-gradient-to-r from-purple-500 to-pink-500"
                    style={{ width: `${result.overallScore}%` }}
                  />
                </div>
              </div>
            </div>
          </div>
        </Card>

        {/* 부위별 분석 */}
        <Card className="mb-6">
          <CardHeader>
            <CardTitle>부위별 분석</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-6">
              {Object.entries(result.features).map(([key, data]) => {
                const Icon = featureIcons[key as keyof typeof featureIcons] || Star;
                const label = featureLabels[key] || key;
                return (
                  <div key={key} className="space-y-2">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <Icon className="h-5 w-5 text-primary" />
                        <span className="font-medium">{label}</span>
                        <Badge variant="outline" className="ml-2">
                          {data.trait}
                        </Badge>
                      </div>
                      <span className="font-bold">{data.score}/100</span>
                    </div>
                    <Progress value={data.score} className="h-2" />
                    <p className="text-sm text-muted-foreground">{data.meaning}</p>
                  </div>
                );
              })}
            </div>
          </CardContent>
        </Card>

        {/* 운세 예측 */}
        <div className="grid md:grid-cols-4 gap-4 mb-6">
          {predictionItems.map((item) => {
            const Icon = item.icon;
            const score = result.predictions[item.key as keyof typeof result.predictions];
            return (
              <Card key={item.key}>
                <CardContent className="p-4 text-center">
                  <Icon className={`h-8 w-8 mx-auto mb-2 ${item.color}`} />
                  <div className="text-2xl font-bold mb-1">{score}</div>
                  <div className="text-sm text-muted-foreground">{item.label}</div>
                  <Progress value={score} className="h-1 mt-2" />
                </CardContent>
              </Card>
            );
          })}
        </div>

        {/* 성격 특성 */}
        <Card className="mb-6">
          <CardHeader>
            <CardTitle>성격 분석</CardTitle>
          </CardHeader>
          <CardContent>
            <ul className="space-y-3">
              {result.personality.map((trait, index) => (
                <li key={index} className="flex items-start gap-3">
                  <Star className="h-5 w-5 text-yellow-500 mt-0.5" />
                  <span>{trait}</span>
                </li>
              ))}
            </ul>
          </CardContent>
        </Card>

        {/* 조언 */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle>전문가 조언</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground">{result.advice}</p>
          </CardContent>
        </Card>

        {/* 액션 버튼 */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Button variant="outline" onClick={onReset}>
            다른 사진으로 분석
          </Button>
          <Link href="/fortune/saju">
            <Button>
              사주 분석 받기
              <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
}
