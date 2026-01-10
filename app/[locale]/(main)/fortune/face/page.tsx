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

// Mock face reading result
const mockFaceResult = {
  overallScore: 82,
  features: {
    forehead: {
      score: 85,
      meaning: 'High and wide forehead indicates strong intelligence and career potential.',
      trait: 'Intellectual Leadership',
    },
    eyes: {
      score: 88,
      meaning: 'Clear and bright eyes suggest honesty and good perception.',
      trait: 'Perceptive & Honest',
    },
    nose: {
      score: 78,
      meaning: 'Well-proportioned nose indicates steady financial growth.',
      trait: 'Stable Wealth',
    },
    mouth: {
      score: 80,
      meaning: 'Full lips suggest good communication skills and charisma.',
      trait: 'Charismatic Speaker',
    },
    jawline: {
      score: 75,
      meaning: 'Strong jawline indicates determination and resilience.',
      trait: 'Determined',
    },
  },
  predictions: {
    career: 85,
    wealth: 78,
    love: 82,
    health: 80,
  },
  personality: [
    'Natural leader with strong decision-making abilities',
    'Creative thinker who excels in problem-solving',
    'Empathetic and understanding towards others',
    'Ambitious with a clear vision for the future',
  ],
  advice: 'Your facial features suggest a balanced life ahead. Focus on leveraging your natural charisma in your career. The next 5 years are particularly favorable for business ventures.',
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
                  alt="Your photo"
                  className="w-full h-full object-cover"
                />
              </div>
            )}
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="w-56 h-56 rounded-full border-4 border-primary border-t-transparent animate-spin" />
            </div>
          </div>
          <h2 className="text-2xl font-bold mb-2">Analyzing Your Features</h2>
          <p className="text-muted-foreground mb-6">
            Our AI is reading your facial features...
          </p>
          <div className="space-y-2">
            <Progress value={progress} className="h-3" />
            <p className="text-sm text-muted-foreground">{progress}% complete</p>
          </div>
          <div className="mt-8 space-y-2 text-sm text-muted-foreground">
            {progress > 20 && <p className="animate-pulse">Analyzing forehead region...</p>}
            {progress > 40 && <p className="animate-pulse">Examining eye characteristics...</p>}
            {progress > 60 && <p className="animate-pulse">Reading nose proportions...</p>}
            {progress > 80 && <p className="animate-pulse">Evaluating overall harmony...</p>}
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
        {/* Header */}
        <div className="text-center mb-8">
          <Badge className="mb-4 bg-blue-100 text-blue-700 dark:bg-blue-900 dark:text-blue-300">
            <Eye className="mr-1 h-3 w-3" />
            AI Face Reading
          </Badge>
          <h1 className="text-3xl md:text-4xl font-bold mb-4">{t('categories.face')}</h1>
          <p className="text-muted-foreground">
            Upload a clear photo of your face for AI-powered physiognomy analysis
          </p>
        </div>

        {/* Upload Card */}
        <Card>
          <CardHeader>
            <CardTitle>Upload Your Photo</CardTitle>
            <CardDescription>
              For best results, use a front-facing photo with good lighting
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
                  Drop your photo here or click to upload
                </p>
                <p className="text-sm text-muted-foreground">
                  Supports JPG, PNG (max 10MB)
                </p>
              </div>
            ) : (
              <div className="space-y-4">
                <div className="relative w-64 h-64 mx-auto">
                  <img
                    src={image}
                    alt="Uploaded photo"
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
                  Start Analysis
                </Button>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Tips */}
        <Card className="mt-6">
          <CardHeader>
            <CardTitle className="text-lg">Tips for Best Results</CardTitle>
          </CardHeader>
          <CardContent>
            <ul className="space-y-3">
              <li className="flex items-start gap-3">
                <Camera className="h-5 w-5 text-primary mt-0.5" />
                <span>Use a clear, front-facing photo</span>
              </li>
              <li className="flex items-start gap-3">
                <Smile className="h-5 w-5 text-primary mt-0.5" />
                <span>Keep a neutral expression</span>
              </li>
              <li className="flex items-start gap-3">
                <User className="h-5 w-5 text-primary mt-0.5" />
                <span>Ensure your full face is visible</span>
              </li>
              <li className="flex items-start gap-3">
                <AlertCircle className="h-5 w-5 text-primary mt-0.5" />
                <span>Avoid heavy makeup or accessories</span>
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
  const featureIcons = {
    forehead: User,
    eyes: Eye,
    nose: Smile,
    mouth: Smile,
    jawline: Shield,
  };

  const predictionItems = [
    { key: 'career', icon: Briefcase, color: 'text-blue-500' },
    { key: 'wealth', icon: Coins, color: 'text-yellow-500' },
    { key: 'love', icon: Heart, color: 'text-pink-500' },
    { key: 'health', icon: Shield, color: 'text-green-500' },
  ];

  return (
    <div className="container mx-auto px-4 py-8 md:py-16">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <Badge className="mb-4 bg-green-100 text-green-700 dark:bg-green-900 dark:text-green-300">
            Analysis Complete
          </Badge>
          <h1 className="text-3xl md:text-4xl font-bold mb-4">Your Face Reading Result</h1>
        </div>

        {/* Overview Card */}
        <Card className="mb-6 overflow-hidden">
          <div className="grid md:grid-cols-3">
            {image && (
              <div className="p-6 flex items-center justify-center bg-muted">
                <img
                  src={image}
                  alt="Your photo"
                  className="w-48 h-48 object-cover rounded-full border-4 border-background"
                />
              </div>
            )}
            <div className={`p-6 ${image ? 'md:col-span-2' : 'md:col-span-3'}`}>
              <div className="text-center md:text-left">
                <h2 className="text-lg text-muted-foreground mb-2">Overall Score</h2>
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

        {/* Feature Analysis */}
        <Card className="mb-6">
          <CardHeader>
            <CardTitle>Feature Analysis</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-6">
              {Object.entries(result.features).map(([key, data]) => {
                const Icon = featureIcons[key as keyof typeof featureIcons] || Star;
                return (
                  <div key={key} className="space-y-2">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <Icon className="h-5 w-5 text-primary" />
                        <span className="font-medium capitalize">{key}</span>
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

        {/* Life Predictions */}
        <div className="grid md:grid-cols-4 gap-4 mb-6">
          {predictionItems.map((item) => {
            const Icon = item.icon;
            const score = result.predictions[item.key as keyof typeof result.predictions];
            return (
              <Card key={item.key}>
                <CardContent className="p-4 text-center">
                  <Icon className={`h-8 w-8 mx-auto mb-2 ${item.color}`} />
                  <div className="text-2xl font-bold mb-1">{score}</div>
                  <div className="text-sm text-muted-foreground capitalize">{item.key}</div>
                  <Progress value={score} className="h-1 mt-2" />
                </CardContent>
              </Card>
            );
          })}
        </div>

        {/* Personality Traits */}
        <Card className="mb-6">
          <CardHeader>
            <CardTitle>Personality Insights</CardTitle>
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

        {/* Advice */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle>Expert Advice</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground">{result.advice}</p>
          </CardContent>
        </Card>

        {/* Actions */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Button variant="outline" onClick={onReset}>
            Try Another Photo
          </Button>
          <Link href="/fortune/saju">
            <Button>
              Get Saju Analysis
              <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
}
