'use client';

import { useState, useRef, useCallback, useEffect } from 'react';
import { useTranslations } from 'next-intl';
import { useRouter } from 'next/navigation';
import { Link } from '@/i18n/routing';
import { useAuth } from '@/lib/hooks/useAuth';
import { isAdminEmail } from '@/lib/auth/permissions';
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
  Ticket,
  Volume2,
  Crown,
  TrendingUp,
  Users,
  BookOpen,
  ChevronDown,
  ChevronUp,
} from 'lucide-react';
import type { FaceAnalysisResult, FacePartType, FacePartAnalysis } from '@/types/face';
import { FACE_PART_KOREAN, FORTUNE_TYPE_KOREAN, getGradeFromScore } from '@/types/face';

export default function FaceReadingPage() {
  const t = useTranslations('fortune');
  const router = useRouter();
  const { user, isLoading: authLoading } = useAuth();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [image, setImage] = useState<string | null>(null);
  const [step, setStep] = useState<'upload' | 'analyzing' | 'result' | 'no_voucher'>('upload');
  const [progress, setProgress] = useState(0);
  const [analysisProgress, setAnalysisProgress] = useState('');
  const [voucherCount, setVoucherCount] = useState<number>(0);
  const [checkingVoucher, setCheckingVoucher] = useState(false);
  const [result, setResult] = useState<FaceAnalysisResult | null>(null);
  const [ttsScript, setTtsScript] = useState<string>('');

  const isAdmin = user?.email ? isAdminEmail(user.email) : false;

  // 결제권 확인
  useEffect(() => {
    const checkVoucher = async () => {
      if (!user || isAdmin) return;
      try {
        const res = await fetch('/api/voucher/check?service_type=face');
        const data = await res.json();
        setVoucherCount(data.summary?.face?.total || 0);
      } catch (error) {
        console.error('Voucher check error:', error);
      }
    };
    if (user) checkVoucher();
  }, [user, isAdmin]);

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

  const handleAnalyze = async () => {
    // 로그인 체크
    if (!user) {
      router.push('/login?redirect=/fortune/face');
      return;
    }

    setStep('analyzing');
    setProgress(0);

    // 분석 진행 시뮬레이션
    const progressSteps = [
      { progress: 15, text: '얼굴 영역 인식 중...' },
      { progress: 30, text: '이마 분석 중...' },
      { progress: 45, text: '눈 특징 분석 중...' },
      { progress: 55, text: '코 비율 분석 중...' },
      { progress: 65, text: '입 형태 분석 중...' },
      { progress: 75, text: '턱선 분석 중...' },
      { progress: 85, text: '귀 형태 분석 중...' },
      { progress: 95, text: '종합 점수 계산 중...' },
    ];

    let stepIndex = 0;
    const progressInterval = setInterval(() => {
      if (stepIndex < progressSteps.length) {
        setProgress(progressSteps[stepIndex].progress);
        setAnalysisProgress(progressSteps[stepIndex].text);
        stepIndex++;
      }
    }, 400);

    try {
      const res = await fetch('/api/fortune/face/analyze', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          imageData: image,
          generateVoice: false,
        }),
      });

      clearInterval(progressInterval);

      const data = await res.json();

      if (!res.ok) {
        if (data.errorCode === 'NO_VOUCHER') {
          setStep('no_voucher');
          return;
        }
        throw new Error(data.error || '분석 실패');
      }

      setProgress(100);
      setAnalysisProgress('분석 완료!');
      setResult(data.result);
      setTtsScript(data.ttsScript);
      setVoucherCount(data.remainingVouchers || 0);

      setTimeout(() => {
        setStep('result');
      }, 500);
    } catch (error) {
      clearInterval(progressInterval);
      console.error('Analysis error:', error);
      setStep('upload');
      alert('분석 중 오류가 발생했습니다. 다시 시도해주세요.');
    }
  };

  const handleReset = () => {
    setImage(null);
    setStep('upload');
    setProgress(0);
    setResult(null);
    setTtsScript('');
  };

  // 결제권 부족 화면
  if (step === 'no_voucher') {
    return (
      <div className="container mx-auto px-4 py-16">
        <div className="max-w-md mx-auto text-center">
          <div className="w-20 h-20 mx-auto mb-6 rounded-full bg-amber-100 dark:bg-amber-900/30 flex items-center justify-center">
            <Ticket className="h-10 w-10 text-amber-600" />
          </div>
          <h2 className="text-2xl font-bold mb-4">결제권이 필요합니다</h2>
          <p className="text-muted-foreground mb-6">
            관상 분석은 결제권이 필요한 유료 서비스입니다.
          </p>
          <div className="flex flex-col gap-3">
            <Link href="/my/vouchers">
              <Button className="w-full bg-gradient-to-r from-purple-500 to-pink-500">
                결제권 구매하기
              </Button>
            </Link>
            <Button variant="outline" onClick={() => setStep('upload')}>
              돌아가기
            </Button>
          </div>
        </div>
      </div>
    );
  }

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
            {analysisProgress || 'AI가 얼굴 특징을 분석하고 있습니다...'}
          </p>
          <div className="space-y-2">
            <Progress value={progress} className="h-3" />
            <p className="text-sm text-muted-foreground">{progress}% 완료</p>
          </div>
        </div>
      </div>
    );
  }

  if (step === 'result' && result) {
    return <FaceReadingResult result={result} image={image} ttsScript={ttsScript} onReset={handleReset} />;
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

        {/* 관상학 소개 */}
        <Card className="mb-6 border-purple-200 dark:border-purple-800 bg-gradient-to-br from-purple-50 to-pink-50 dark:from-purple-900/20 dark:to-pink-900/20">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-purple-700 dark:text-purple-300">
              <BookOpen className="h-5 w-5" />
              관상학이란?
            </CardTitle>
          </CardHeader>
          <CardContent className="text-sm text-gray-700 dark:text-gray-300 space-y-3">
            <p>
              <strong>관상학(觀相學)</strong>은 수천 년 동양 지혜가 담긴 얼굴 분석 학문입니다.
              이마, 눈, 코, 입, 턱, 귀 등 얼굴의 각 부위에서 성격과 운명의 단서를 읽어냅니다.
            </p>
            <div className="grid grid-cols-2 gap-2 mt-4">
              <div className="flex items-center gap-2">
                <span className="w-2 h-2 bg-purple-500 rounded-full"></span>
                <span>이마 - 지성, 초년운</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="w-2 h-2 bg-blue-500 rounded-full"></span>
                <span>눈 - 통찰력, 정신력</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="w-2 h-2 bg-yellow-500 rounded-full"></span>
                <span>코 - 재물운, 중년운</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="w-2 h-2 bg-pink-500 rounded-full"></span>
                <span>입 - 표현력, 대인관계</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="w-2 h-2 bg-green-500 rounded-full"></span>
                <span>턱 - 의지력, 말년운</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="w-2 h-2 bg-orange-500 rounded-full"></span>
                <span>귀 - 복덕, 수명</span>
              </div>
            </div>
          </CardContent>
        </Card>

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
                <Button onClick={handleAnalyze} className="w-full" size="lg" disabled={checkingVoucher}>
                  {checkingVoucher ? (
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  ) : (
                    <Sparkles className="mr-2 h-4 w-4" />
                  )}
                  {checkingVoucher ? '확인 중...' : '분석 시작'}
                </Button>
                {!isAdmin && user && (
                  <p className="text-sm text-center text-muted-foreground">
                    <Ticket className="inline h-4 w-4 mr-1" />
                    보유 결제권: {voucherCount}장
                  </p>
                )}
                {isAdmin && (
                  <p className="text-sm text-center text-purple-600">
                    <Crown className="inline h-4 w-4 mr-1" />
                    관리자 무제한 이용
                  </p>
                )}
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

// ===== 결과 컴포넌트 =====
function FaceReadingResult({
  result,
  image,
  ttsScript,
  onReset,
}: {
  result: FaceAnalysisResult;
  image: string | null;
  ttsScript: string;
  onReset: () => void;
}) {
  const [expandedPart, setExpandedPart] = useState<FacePartType | null>(null);
  const [showFullStory, setShowFullStory] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);

  const grade = getGradeFromScore(result.scores.overallScore);

  const partOrder: FacePartType[] = ['forehead', 'eyes', 'nose', 'mouth', 'chin', 'ears'];

  const fortuneItems: { key: keyof typeof result.scores.fortuneScores; icon: any; color: string }[] = [
    { key: 'career', icon: Briefcase, color: 'text-blue-500' },
    { key: 'wealth', icon: Coins, color: 'text-yellow-500' },
    { key: 'love', icon: Heart, color: 'text-pink-500' },
    { key: 'health', icon: Shield, color: 'text-green-500' },
    { key: 'social', icon: Users, color: 'text-purple-500' },
  ];

  const handlePlayTTS = () => {
    if ('speechSynthesis' in window) {
      if (isPlaying) {
        window.speechSynthesis.cancel();
        setIsPlaying(false);
      } else {
        const utterance = new SpeechSynthesisUtterance(ttsScript);
        utterance.lang = 'ko-KR';
        utterance.rate = 0.9;
        utterance.onend = () => setIsPlaying(false);
        window.speechSynthesis.speak(utterance);
        setIsPlaying(true);
      }
    }
  };

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
                <div className="flex items-center justify-center md:justify-start gap-3 mb-4">
                  <h2 className="text-lg text-muted-foreground">종합 점수</h2>
                  <Badge className={`${grade.grade === 'S' ? 'bg-gradient-to-r from-yellow-400 to-amber-500' : grade.grade === 'A' ? 'bg-purple-500' : 'bg-blue-500'} text-white`}>
                    {grade.grade}등급 ({grade.korean})
                  </Badge>
                </div>
                <div className="text-6xl font-bold text-primary mb-2">
                  {result.scores.overallScore}
                  <span className="text-2xl text-muted-foreground">/100</span>
                </div>
                {result.scores.bonusPoints > 0 && (
                  <p className="text-sm text-green-600 mb-2">
                    <TrendingUp className="inline h-4 w-4 mr-1" />
                    보너스 +{result.scores.bonusPoints}점 ({result.scores.bonusReason})
                  </p>
                )}
                <div className="h-3 bg-muted rounded-full overflow-hidden">
                  <div
                    className="h-full bg-gradient-to-r from-purple-500 to-pink-500 transition-all duration-1000"
                    style={{ width: `${result.scores.overallScore}%` }}
                  />
                </div>
                <p className="mt-4 text-muted-foreground">{grade.description}</p>
              </div>
            </div>
          </div>
        </Card>

        {/* 강점/보완점 하이라이트 */}
        {(result.highlights.strengths.length > 0 || result.highlights.improvements.length > 0) && (
          <div className="grid md:grid-cols-2 gap-4 mb-6">
            {result.highlights.strengths.length > 0 && (
              <Card className="border-green-200 dark:border-green-800 bg-green-50/50 dark:bg-green-900/10">
                <CardHeader className="pb-2">
                  <CardTitle className="text-lg text-green-700 dark:text-green-400 flex items-center gap-2">
                    <Star className="h-5 w-5" />
                    강점 부위
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  {result.highlights.strengths.map((s) => (
                    <div key={s.part} className="flex items-center justify-between py-2 border-b last:border-0 border-green-200 dark:border-green-800">
                      <span className="font-medium">{s.partKorean}</span>
                      <div className="flex items-center gap-2">
                        <span className="text-green-600 font-bold">{s.score}점</span>
                        <Badge variant="outline" className="text-xs">{s.trait}</Badge>
                      </div>
                    </div>
                  ))}
                </CardContent>
              </Card>
            )}
            {result.highlights.improvements.length > 0 && (
              <Card className="border-amber-200 dark:border-amber-800 bg-amber-50/50 dark:bg-amber-900/10">
                <CardHeader className="pb-2">
                  <CardTitle className="text-lg text-amber-700 dark:text-amber-400 flex items-center gap-2">
                    <TrendingUp className="h-5 w-5" />
                    보완점
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  {result.highlights.improvements.map((s) => (
                    <div key={s.part} className="flex items-center justify-between py-2 border-b last:border-0 border-amber-200 dark:border-amber-800">
                      <span className="font-medium">{s.partKorean}</span>
                      <div className="flex items-center gap-2">
                        <span className="text-amber-600 font-bold">{s.score}점</span>
                        <Badge variant="outline" className="text-xs">{s.trait}</Badge>
                      </div>
                    </div>
                  ))}
                  <p className="text-xs text-amber-600 mt-2">
                    * 보완점은 노력과 덕을 쌓으면 개선될 수 있습니다.
                  </p>
                </CardContent>
              </Card>
            )}
          </div>
        )}

        {/* 부위별 상세 분석 */}
        <Card className="mb-6">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Eye className="h-5 w-5" />
              부위별 상세 분석
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {partOrder.map((part) => {
                const feature = result.features[part];
                const isExpanded = expandedPart === part;
                const partGrade = getGradeFromScore(feature.score);

                return (
                  <div key={part} className="border rounded-lg overflow-hidden">
                    <button
                      onClick={() => setExpandedPart(isExpanded ? null : part)}
                      className="w-full p-4 flex items-center justify-between hover:bg-muted/50 transition-colors"
                    >
                      <div className="flex items-center gap-3">
                        <div className={`w-10 h-10 rounded-full flex items-center justify-center ${feature.isStrength ? 'bg-green-100 text-green-600' : feature.isImprovement ? 'bg-amber-100 text-amber-600' : 'bg-blue-100 text-blue-600'}`}>
                          <span className="font-bold text-sm">{feature.score}</span>
                        </div>
                        <div className="text-left">
                          <div className="flex items-center gap-2">
                            <span className="font-medium">{feature.partKorean}</span>
                            <Badge variant="outline" className="text-xs">
                              {partGrade.grade}등급
                            </Badge>
                          </div>
                          <p className="text-sm text-muted-foreground">{feature.shape.korean} - {feature.trait}</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <Progress value={feature.score} className="w-24 h-2" />
                        {isExpanded ? <ChevronUp className="h-5 w-5" /> : <ChevronDown className="h-5 w-5" />}
                      </div>
                    </button>
                    {isExpanded && (
                      <div className="px-4 pb-4 space-y-3 border-t bg-muted/30">
                        <div className="pt-4">
                          <h4 className="font-medium mb-2">상세 해석</h4>
                          <p className="text-sm text-muted-foreground">{feature.meaning}</p>
                        </div>
                        <div>
                          <h4 className="font-medium mb-2">스토리</h4>
                          <p className="text-sm text-muted-foreground italic">{feature.storytelling}</p>
                        </div>
                        {feature.examples && feature.examples.length > 0 && (
                          <div>
                            <h4 className="font-medium mb-2">유명인 예시</h4>
                            <p className="text-sm text-muted-foreground">{feature.examples.join(', ')}</p>
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </CardContent>
        </Card>

        {/* 운세 예측 */}
        <div className="grid grid-cols-2 md:grid-cols-5 gap-3 mb-6">
          {fortuneItems.map((item) => {
            const Icon = item.icon;
            const score = result.scores.fortuneScores[item.key];
            return (
              <Card key={item.key}>
                <CardContent className="p-4 text-center">
                  <Icon className={`h-6 w-6 mx-auto mb-2 ${item.color}`} />
                  <div className="text-2xl font-bold mb-1">{score}</div>
                  <div className="text-xs text-muted-foreground">{FORTUNE_TYPE_KOREAN[item.key]}</div>
                  <Progress value={score} className="h-1 mt-2" />
                </CardContent>
              </Card>
            );
          })}
        </div>

        {/* 성격 분석 */}
        <Card className="mb-6">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <User className="h-5 w-5" />
              성격 분석
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <h4 className="font-medium mb-2">핵심 특성</h4>
              <div className="flex flex-wrap gap-2">
                {result.personality.coreTraits.map((trait, i) => (
                  <Badge key={i} variant="secondary">{trait}</Badge>
                ))}
              </div>
            </div>
            <div>
              <h4 className="font-medium mb-2">숨겨진 잠재력</h4>
              <p className="text-sm text-muted-foreground">{result.personality.hiddenPotential}</p>
            </div>
            <div className="grid md:grid-cols-2 gap-4">
              <div>
                <h4 className="font-medium mb-2">대인관계 스타일</h4>
                <p className="text-sm text-muted-foreground">{result.personality.socialStyle}</p>
              </div>
              <div>
                <h4 className="font-medium mb-2">의사결정 스타일</h4>
                <p className="text-sm text-muted-foreground">{result.personality.decisionStyle}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* 스토리텔링 */}
        <Card className="mb-6 border-purple-200 dark:border-purple-800">
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle className="flex items-center gap-2 text-purple-700 dark:text-purple-300">
                <BookOpen className="h-5 w-5" />
                관상 이야기
              </CardTitle>
              <Button
                variant="outline"
                size="sm"
                onClick={handlePlayTTS}
                className="flex items-center gap-2"
              >
                <Volume2 className={`h-4 w-4 ${isPlaying ? 'animate-pulse' : ''}`} />
                {isPlaying ? '정지' : '음성으로 듣기'}
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            <div className="prose prose-sm dark:prose-invert max-w-none">
              <p className="whitespace-pre-line">
                {showFullStory
                  ? result.storytelling.fullScript
                  : result.storytelling.opening + '\n\n' + result.storytelling.closingAdvice}
              </p>
            </div>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setShowFullStory(!showFullStory)}
              className="mt-4"
            >
              {showFullStory ? '간략히 보기' : '전체 이야기 보기'}
              {showFullStory ? <ChevronUp className="ml-2 h-4 w-4" /> : <ChevronDown className="ml-2 h-4 w-4" />}
            </Button>
          </CardContent>
        </Card>

        {/* 전문가 조언 */}
        <Card className="mb-6">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Sparkles className="h-5 w-5" />
              전문가 조언
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid md:grid-cols-2 gap-4">
              <div>
                <h4 className="font-medium mb-2 flex items-center gap-2">
                  <Briefcase className="h-4 w-4 text-blue-500" /> 직업
                </h4>
                <p className="text-sm text-muted-foreground">{result.advice.career}</p>
              </div>
              <div>
                <h4 className="font-medium mb-2 flex items-center gap-2">
                  <Heart className="h-4 w-4 text-pink-500" /> 인간관계
                </h4>
                <p className="text-sm text-muted-foreground">{result.advice.relationship}</p>
              </div>
              <div>
                <h4 className="font-medium mb-2 flex items-center gap-2">
                  <Coins className="h-4 w-4 text-yellow-500" /> 재물
                </h4>
                <p className="text-sm text-muted-foreground">{result.advice.wealth}</p>
              </div>
              <div>
                <h4 className="font-medium mb-2 flex items-center gap-2">
                  <Star className="h-4 w-4 text-purple-500" /> 생활
                </h4>
                <p className="text-sm text-muted-foreground">{result.advice.lifestyle}</p>
              </div>
            </div>
            <div className="border-t pt-4 mt-4">
              <h4 className="font-medium mb-3">행운의 요소</h4>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                <div className="text-center p-3 bg-muted rounded-lg">
                  <div className="text-2xl mb-1">🎨</div>
                  <div className="text-xs text-muted-foreground">행운의 색</div>
                  <div className="font-medium">{result.advice.lucky.color}</div>
                </div>
                <div className="text-center p-3 bg-muted rounded-lg">
                  <div className="text-2xl mb-1">🔢</div>
                  <div className="text-xs text-muted-foreground">행운의 숫자</div>
                  <div className="font-medium">{result.advice.lucky.number}</div>
                </div>
                <div className="text-center p-3 bg-muted rounded-lg">
                  <div className="text-2xl mb-1">🧭</div>
                  <div className="text-xs text-muted-foreground">행운의 방향</div>
                  <div className="font-medium">{result.advice.lucky.direction}</div>
                </div>
                <div className="text-center p-3 bg-muted rounded-lg">
                  <div className="text-2xl mb-1">⏰</div>
                  <div className="text-xs text-muted-foreground">행운의 시간</div>
                  <div className="font-medium">{result.advice.lucky.time}</div>
                </div>
              </div>
            </div>
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
