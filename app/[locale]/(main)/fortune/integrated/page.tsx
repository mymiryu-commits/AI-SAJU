'use client';

import { useState, useEffect, useCallback, Suspense } from 'react';
import { useTranslations } from 'next-intl';
import { useSearchParams, useRouter } from 'next/navigation';
import { Link } from '@/i18n/routing';
import { useAuth } from '@/lib/hooks/useAuth';
import { isAdminEmail } from '@/lib/auth/permissions';
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
  Sparkles,
  ArrowRight,
  ArrowLeft,
  Loader2,
  Star,
  Sun,
  Moon,
  Zap,
  Crown,
  CheckCircle,
  Lock,
  FileText,
  Headphones,
  Download,
  ChevronLeft,
  ChevronRight,
  AlertCircle,
} from 'lucide-react';
import Image from 'next/image';
import { SlideImage, FortuneSlideSettings } from '@/types/settings';
import SajuResultCard from '@/components/fortune/saju/SajuResultCard';
import type { AnalysisResult, UserInput } from '@/types/saju';

const birthHours = Array.from({ length: 24 }, (_, i) => ({
  value: i.toString().padStart(2, '0'),
  label: `${i.toString().padStart(2, '0')}:00 - ${i.toString().padStart(2, '0')}:59`,
}));

const mbtiTypes = [
  'INTJ', 'INTP', 'ENTJ', 'ENTP',
  'INFJ', 'INFP', 'ENFJ', 'ENFP',
  'ISTJ', 'ISFJ', 'ESTJ', 'ESFJ',
  'ISTP', 'ISFP', 'ESTP', 'ESFP',
];

const bloodTypes = ['A', 'B', 'O', 'AB'];

const zodiacSigns = [
  '양자리', '황소자리', '쌍둥이자리', '게자리',
  '사자자리', '처녀자리', '천칭자리', '전갈자리',
  '사수자리', '염소자리', '물병자리', '물고기자리',
];

const packages = [
  {
    id: 'basic',
    name: '베이직',
    price: 14900,
    discountedPrice: 10430,
    features: [
      '사주팔자 기본 분석',
      '2026년 총운',
      '성격 분석',
      '행운의 요소',
    ],
    color: 'border-muted',
  },
  {
    id: 'standard',
    name: '스탠다드',
    price: 24900,
    discountedPrice: 17430,
    features: [
      '베이직 패키지 전체',
      '관상 분석 (사진 필요)',
      '별자리 운세 통합',
      '월별 상세 운세',
      'PDF 리포트 다운로드',
    ],
    popular: true,
    color: 'border-primary',
  },
  {
    id: 'premium',
    name: '프리미엄',
    price: 39900,
    discountedPrice: 27930,
    features: [
      '스탠다드 패키지 전체',
      'MBTI 성격 통합 분석',
      '혈액형 성향 분석',
      '10년 대운 분석',
      '음성 리포트 제공',
      '전문가 1:1 상담 10분',
    ],
    color: 'border-yellow-500',
  },
];

// 기본 슬라이드 데이터 (설정이 없을 때 사용)
const defaultSlides: SlideImage[] = [
  {
    id: 'default-1',
    url: '',
    title: 'AI 통합 운세 분석',
    description: '사주, 관상, 별자리, MBTI를 한 번에 분석',
    order: 1,
  },
  {
    id: 'default-2',
    url: '',
    title: '정확한 AI 분석',
    description: '동양과 서양의 운세 데이터를 결합한 분석',
    order: 2,
  },
  {
    id: 'default-3',
    url: '',
    title: '상세 리포트 제공',
    description: 'PDF, 음성 리포트로 언제든지 확인',
    order: 3,
  },
];

// 상품 레벨 타입
type ProductLevel = 'free' | 'basic' | 'deep' | 'premium' | 'vip';

function IntegratedAnalysisPageContent() {
  const t = useTranslations('fortune');
  const searchParams = useSearchParams();
  const router = useRouter();
  const { user, isLoading: authLoading } = useAuth();

  // 관리자 테스트 모드 체크
  const isAdminTest = searchParams.get('admin_test') === 'true';
  const isAdmin = user?.email ? isAdminEmail(user.email) : false;
  const adminBypass = isAdminTest && isAdmin;

  const [step, setStep] = useState<'intro' | 'form' | 'analyzing' | 'result' | 'error'>('intro');
  const [progress, setProgress] = useState(0);
  const [selectedPackage, setSelectedPackage] = useState<string>('standard');
  const [slides, setSlides] = useState<SlideImage[]>(defaultSlides);
  const [currentSlide, setCurrentSlide] = useState(0);
  const [isAutoPlaying, setIsAutoPlaying] = useState(true);

  // 분석 결과 상태
  const [analysisResult, setAnalysisResult] = useState<AnalysisResult | null>(null);
  const [analysisId, setAnalysisId] = useState<string | null>(null);
  const [isPremiumUnlocked, setIsPremiumUnlocked] = useState(false);
  const [productLevel, setProductLevel] = useState<ProductLevel>('free');
  const [error, setError] = useState<string | null>(null);

  const [formData, setFormData] = useState({
    name: '',
    birthDate: '',
    birthHour: '',
    gender: '',
    calendar: 'solar',
    mbti: '',
    bloodType: '',
    zodiac: '',
    concerns: [] as string[],
    question: '',
  });

  // 슬라이드 설정 가져오기
  useEffect(() => {
    const fetchSlideSettings = async () => {
      try {
        const response = await fetch('/api/site-settings?key=fortune_slides');
        const result = await response.json();
        if (result.data?.value?.slides && result.data.value.slides.length > 0) {
          setSlides(result.data.value.slides);
          setIsAutoPlaying(result.data.value.autoPlay !== false);
        }
      } catch (error) {
        console.error('Error fetching slide settings:', error);
      }
    };
    fetchSlideSettings();
  }, []);

  // 자동 슬라이드
  useEffect(() => {
    if (!isAutoPlaying || slides.length <= 1) return;

    const interval = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % slides.length);
    }, 4000);

    return () => clearInterval(interval);
  }, [isAutoPlaying, slides.length]);

  const nextSlide = useCallback(() => {
    setCurrentSlide((prev) => (prev + 1) % slides.length);
  }, [slides.length]);

  const prevSlide = useCallback(() => {
    setCurrentSlide((prev) => (prev - 1 + slides.length) % slides.length);
  }, [slides.length]);

  // 실제 API 호출하여 분석 수행
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.name || !formData.birthDate || !formData.gender) {
      setError('이름, 생년월일, 성별은 필수 입력 항목입니다.');
      return;
    }

    setStep('analyzing');
    setError(null);
    setProgress(0);

    // 진행률 시뮬레이션
    const progressInterval = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 90) {
          return prev;
        }
        return prev + 10;
      });
    }, 500);

    try {
      // UserInput 형식으로 변환
      const userInput: UserInput = {
        name: formData.name,
        birthDate: formData.birthDate,
        birthTime: formData.birthHour && formData.birthHour !== 'unknown'
          ? `${formData.birthHour}:00`
          : undefined,
        gender: formData.gender as 'male' | 'female',
        calendar: formData.calendar as 'solar' | 'lunar',
        mbti: formData.mbti || undefined,
        bloodType: formData.bloodType ? (formData.bloodType as 'A' | 'B' | 'O' | 'AB') : undefined,
        currentConcern: formData.question ? (formData.question as any) : undefined,
      };

      // 분석 API 호출
      const response = await fetch('/api/fortune/saju/analyze', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(userInput),
      });

      const data = await response.json();

      clearInterval(progressInterval);

      if (!response.ok) {
        // 포인트 부족 에러 처리
        if (data.errorCode === 'INSUFFICIENT_POINTS') {
          setError(data.error || '포인트가 부족합니다. 충전 후 다시 시도해주세요.');
          setStep('error');
          return;
        }
        throw new Error(data.error || '분석 중 오류가 발생했습니다.');
      }

      setProgress(100);

      // 결과 저장
      const result = data.data?.fullResult || data.data?.result;
      if (result) {
        setAnalysisResult(result);
        setAnalysisId(data.meta?.analysisId || null);
        setIsPremiumUnlocked(!data.data?.isBlinded || isAdmin);
        setProductLevel(data.data?.isBlinded ? 'free' : 'basic');

        // 잠시 후 결과 화면으로 전환
        setTimeout(() => {
          setStep('result');
        }, 500);
      } else {
        throw new Error('분석 결과를 받지 못했습니다.');
      }
    } catch (err) {
      clearInterval(progressInterval);
      console.error('Analysis error:', err);
      setError(err instanceof Error ? err.message : '분석 중 오류가 발생했습니다.');
      setStep('error');
    }
  };

  // 프리미엄 업그레이드
  const handleUnlockPremium = async () => {
    if (!analysisResult || !user) {
      router.push('/login');
      return;
    }

    try {
      const userInput: UserInput = {
        name: formData.name,
        birthDate: formData.birthDate,
        birthTime: formData.birthHour && formData.birthHour !== 'unknown'
          ? `${formData.birthHour}:00`
          : undefined,
        gender: formData.gender as 'male' | 'female',
        calendar: formData.calendar as 'solar' | 'lunar',
        mbti: formData.mbti || undefined,
        bloodType: formData.bloodType ? (formData.bloodType as 'A' | 'B' | 'O' | 'AB') : undefined,
        currentConcern: formData.question ? (formData.question as any) : undefined,
      };

      const response = await fetch('/api/fortune/saju/premium', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          input: userInput,
          productType: selectedPackage === 'premium' ? 'vip' : selectedPackage === 'standard' ? 'deep' : 'basic',
          analysisId,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        if (response.status === 402) {
          // 포인트 부족
          alert(`포인트가 부족합니다. 현재: ${data.data?.currentPoints || 0}P, 필요: ${data.data?.requiredPoints || 0}P`);
          router.push('/points');
          return;
        }
        throw new Error(data.error || '프리미엄 업그레이드 실패');
      }

      // 프리미엄 결과로 업데이트
      if (data.data) {
        setAnalysisResult((prev) => prev ? {
          ...prev,
          premium: data.data.premium,
          aiAnalysis: data.data.aiAnalysis,
        } : null);
        setIsPremiumUnlocked(true);
        setProductLevel(selectedPackage === 'premium' ? 'vip' : selectedPackage === 'standard' ? 'deep' : 'basic');
        setAnalysisId(data.meta?.analysisId || analysisId);
      }
    } catch (err) {
      console.error('Premium upgrade error:', err);
      alert(err instanceof Error ? err.message : '프리미엄 업그레이드 중 오류가 발생했습니다.');
    }
  };

  const handleChange = (name: string, value: string) => {
    setFormData((prev) => ({ ...prev, [name]: value }));
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
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <Button onClick={() => { setStep('form'); setError(null); }}>
              <ArrowLeft className="mr-2 h-4 w-4" />
              다시 시도
            </Button>
            <Link href="/points">
              <Button variant="outline">
                포인트 충전하기
              </Button>
            </Link>
          </div>
        </div>
      </div>
    );
  }

  if (step === 'intro') {
    return (
      <div className="min-h-screen">
        {/* 이미지 슬라이드 섹션 */}
        <section className="relative w-full h-[300px] md:h-[400px] overflow-hidden bg-gradient-to-br from-purple-600 via-pink-500 to-orange-400">
          {slides.map((slide, index) => (
            <div
              key={slide.id}
              className={`absolute inset-0 transition-opacity duration-700 ${
                index === currentSlide ? 'opacity-100' : 'opacity-0'
              }`}
            >
              {slide.url ? (
                <Image
                  src={slide.url}
                  alt={slide.title || '슬라이드 이미지'}
                  fill
                  className="object-cover"
                  priority={index === 0}
                />
              ) : (
                <div className="absolute inset-0 bg-gradient-to-br from-purple-600 via-pink-500 to-orange-400" />
              )}
              {/* 오버레이 */}
              <div className="absolute inset-0 bg-black/30" />
              {/* 슬라이드 텍스트 */}
              <div className="absolute inset-0 flex flex-col items-center justify-center text-white text-center px-4">
                {slide.title && (
                  <h2 className="text-2xl md:text-4xl font-bold mb-3 drop-shadow-lg">
                    {slide.title}
                  </h2>
                )}
                {slide.description && (
                  <p className="text-lg md:text-xl text-white/90 max-w-xl drop-shadow-md">
                    {slide.description}
                  </p>
                )}
              </div>
            </div>
          ))}

          {/* 슬라이드 네비게이션 */}
          {slides.length > 1 && (
            <>
              <button
                onClick={prevSlide}
                className="absolute left-4 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-white/20 backdrop-blur-sm flex items-center justify-center text-white hover:bg-white/30 transition-colors"
              >
                <ChevronLeft className="h-6 w-6" />
              </button>
              <button
                onClick={nextSlide}
                className="absolute right-4 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-white/20 backdrop-blur-sm flex items-center justify-center text-white hover:bg-white/30 transition-colors"
              >
                <ChevronRight className="h-6 w-6" />
              </button>
              {/* 인디케이터 */}
              <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2">
                {slides.map((_, index) => (
                  <button
                    key={index}
                    onClick={() => setCurrentSlide(index)}
                    className={`w-2 h-2 rounded-full transition-all ${
                      index === currentSlide
                        ? 'w-6 bg-white'
                        : 'bg-white/50 hover:bg-white/70'
                    }`}
                  />
                ))}
              </div>
            </>
          )}
        </section>

        {/* 메인 컨텐츠 */}
        <div className="container mx-auto px-4 py-8 md:py-12">
          <div className="max-w-4xl mx-auto">
            {/* 헤더 */}
            <div className="text-center mb-10">
              <Badge className="mb-4 bg-gradient-to-r from-purple-500 to-pink-500 text-white">
                <Crown className="mr-1 h-3 w-3" />
                프리미엄 통합 분석
              </Badge>
              <h1 className="text-2xl md:text-3xl font-bold mb-3">
                동양 + 서양 통합 운세 분석
              </h1>
              <p className="text-muted-foreground max-w-xl mx-auto">
                사주오행, 별자리, MBTI, 혈액형, 12개월 운세, 대운 분석까지
              </p>
            </div>

            {/* 분석 항목 미리보기 */}
            <div className="grid grid-cols-4 gap-3 mb-10">
              {[
                { icon: Sun, label: '사주오행', color: 'text-amber-500' },
                { icon: Moon, label: '별자리', color: 'text-indigo-500' },
                { icon: Star, label: '12개월 운세', color: 'text-purple-500' },
                { icon: Zap, label: '대운 분석', color: 'text-pink-500' },
              ].map((feature, i) => {
                const Icon = feature.icon;
                return (
                  <div key={i} className="text-center p-3 rounded-xl bg-muted/50">
                    <Icon className={`h-6 w-6 mx-auto mb-1 ${feature.color}`} />
                    <p className="text-xs font-medium">{feature.label}</p>
                  </div>
                );
              })}
            </div>

            {/* 패키지 선택 */}
            <div className="mb-8">
              <h2 className="text-lg font-bold mb-4 text-center">패키지 선택</h2>
              <div className="grid md:grid-cols-3 gap-4">
                {packages.map((pkg) => (
                  <Card
                    key={pkg.id}
                    className={`relative cursor-pointer transition-all hover:shadow-lg ${
                      selectedPackage === pkg.id ? pkg.color + ' border-2 shadow-lg' : 'border'
                    }`}
                    onClick={() => setSelectedPackage(pkg.id)}
                  >
                    {pkg.popular && (
                      <Badge className="absolute -top-3 left-1/2 transform -translate-x-1/2 bg-primary text-xs">
                        인기
                      </Badge>
                    )}
                    <CardHeader className="text-center pb-2">
                      <CardTitle className="text-base">{pkg.name}</CardTitle>
                      <div className="mt-1">
                        <span className="text-2xl font-bold text-primary">
                          ₩{pkg.discountedPrice.toLocaleString()}
                        </span>
                        <span className="text-muted-foreground line-through text-sm ml-2">
                          ₩{pkg.price.toLocaleString()}
                        </span>
                      </div>
                      <Badge variant="secondary" className="mt-1 text-xs">30% 할인</Badge>
                    </CardHeader>
                    <CardContent className="pt-0">
                      <ul className="space-y-1.5">
                        {pkg.features.slice(0, 4).map((feature, i) => (
                          <li key={i} className="flex items-start gap-2 text-xs">
                            <CheckCircle className="h-3 w-3 text-green-500 mt-0.5 flex-shrink-0" />
                            <span>{feature}</span>
                          </li>
                        ))}
                        {pkg.features.length > 4 && (
                          <li className="text-xs text-muted-foreground">
                            +{pkg.features.length - 4}개 더...
                          </li>
                        )}
                      </ul>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>

            {/* CTA 버튼 */}
            <div className="text-center">
              <Button
                size="lg"
                onClick={() => setStep('form')}
                className="bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white px-10 py-6 text-lg shadow-lg"
              >
                <Sparkles className="mr-2 h-5 w-5" />
                분석 시작하기
                <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
              <p className="text-sm text-muted-foreground mt-3">
                무료 분석 후 상세 결과 확인 시 포인트가 필요합니다
              </p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (step === 'analyzing') {
    return (
      <div className="container mx-auto px-4 py-16">
        <div className="max-w-md mx-auto text-center">
          <div className="mb-8">
            <div className="w-24 h-24 mx-auto mb-6 rounded-full bg-gradient-to-r from-purple-500 via-pink-500 to-orange-500 flex items-center justify-center animate-pulse">
              <Sparkles className="h-12 w-12 text-white" />
            </div>
            <h2 className="text-2xl font-bold mb-2">통합 분석 진행 중</h2>
            <p className="text-muted-foreground">
              동양과 서양의 지혜를 결합하여<br/>
              {formData.name}님만의 특별한 분석을 준비하고 있습니다...
            </p>
          </div>

          <div className="space-y-4">
            <Progress value={progress} className="h-3" />
            <p className="text-sm text-muted-foreground">{progress}% 완료</p>
          </div>

          <div className="mt-8 space-y-2 text-sm text-muted-foreground">
            {progress > 10 && <p>✓ 사주팔자 계산 중</p>}
            {progress > 30 && <p>✓ 오행 분석 완료</p>}
            {progress > 50 && <p>✓ 별자리 운세 통합 중</p>}
            {progress > 70 && <p>✓ AI 분석 진행 중</p>}
            {progress > 90 && <p>✓ 최종 리포트 생성 중</p>}
          </div>

          <div className="mt-8 flex items-center justify-center gap-2 text-sm text-muted-foreground">
            <Loader2 className="h-4 w-4 animate-spin" />
            <span>잠시만 기다려주세요...</span>
          </div>
        </div>
      </div>
    );
  }

  // 결과 화면 - SajuResultCard 사용
  if (step === 'result' && analysisResult) {
    return (
      <div className="container mx-auto px-4 py-8 md:py-12">
        <div className="max-w-3xl mx-auto">
          {/* 관리자 테스트 모드 배지 */}
          {adminBypass && (
            <Alert className="mb-4 bg-green-50 dark:bg-green-950/30 border-green-200">
              <CheckCircle className="h-4 w-4 text-green-500" />
              <AlertDescription className="text-green-700 dark:text-green-400">
                관리자 테스트 모드로 모든 기능이 해금되었습니다.
              </AlertDescription>
            </Alert>
          )}

          {/* SajuResultCard 컴포넌트 사용 */}
          <SajuResultCard
            result={analysisResult}
            onUnlockPremium={handleUnlockPremium}
            isPremiumUnlocked={isPremiumUnlocked || adminBypass}
            productLevel={adminBypass ? 'vip' : productLevel}
            analysisId={analysisId || undefined}
          />

          {/* 하단 액션 버튼 */}
          <div className="mt-8 flex flex-col sm:flex-row gap-4 justify-center">
            <Button variant="outline" onClick={() => { setStep('form'); setProgress(0); setAnalysisResult(null); }}>
              <ArrowLeft className="mr-2 h-4 w-4" />
              새로운 분석
            </Button>
            <Link href="/my/history">
              <Button variant="ghost">
                히스토리 보기
              </Button>
            </Link>
          </div>
        </div>
      </div>
    );
  }

  // 입력 폼
  return (
    <div className="container mx-auto px-4 py-8 md:py-16">
      <div className="max-w-2xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <Badge className="mb-4 bg-gradient-to-r from-purple-500 to-pink-500 text-white">
            {packages.find(p => p.id === selectedPackage)?.name} 패키지
          </Badge>
          <h1 className="text-2xl md:text-3xl font-bold mb-4">상세 정보 입력</h1>
          <p className="text-muted-foreground">
            정확한 분석을 위해 정보를 입력해주세요
          </p>
        </div>

        {/* 에러 메시지 */}
        {error && (
          <Alert variant="destructive" className="mb-6">
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}

        {/* Form */}
        <form onSubmit={handleSubmit}>
          <Card className="mb-6">
            <CardHeader>
              <CardTitle>기본 정보</CardTitle>
              <CardDescription>필수 입력 사항입니다</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label>이름 *</Label>
                <Input
                  placeholder="이름을 입력하세요"
                  value={formData.name}
                  onChange={(e) => handleChange('name', e.target.value)}
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>생년월일 *</Label>
                  <Input
                    type="date"
                    value={formData.birthDate}
                    onChange={(e) => handleChange('birthDate', e.target.value)}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label>양력/음력</Label>
                  <Tabs
                    value={formData.calendar}
                    onValueChange={(value) => handleChange('calendar', value)}
                  >
                    <TabsList className="grid w-full grid-cols-2">
                      <TabsTrigger value="solar">양력</TabsTrigger>
                      <TabsTrigger value="lunar">음력</TabsTrigger>
                    </TabsList>
                  </Tabs>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>태어난 시간</Label>
                  <Select
                    value={formData.birthHour}
                    onValueChange={(value) => handleChange('birthHour', value)}
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
                    value={formData.gender}
                    onValueChange={(value) => handleChange('gender', value)}
                  >
                    <TabsList className="grid w-full grid-cols-2">
                      <TabsTrigger value="male">남성</TabsTrigger>
                      <TabsTrigger value="female">여성</TabsTrigger>
                    </TabsList>
                  </Tabs>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="mb-6">
            <CardHeader>
              <CardTitle>추가 정보</CardTitle>
              <CardDescription>더 정확한 분석을 위해 입력해주세요 (선택)</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-3 gap-4">
                <div className="space-y-2">
                  <Label>MBTI</Label>
                  <Select
                    value={formData.mbti}
                    onValueChange={(value) => handleChange('mbti', value)}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="선택" />
                    </SelectTrigger>
                    <SelectContent>
                      {mbtiTypes.map((type) => (
                        <SelectItem key={type} value={type}>
                          {type}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label>혈액형</Label>
                  <Select
                    value={formData.bloodType}
                    onValueChange={(value) => handleChange('bloodType', value)}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="선택" />
                    </SelectTrigger>
                    <SelectContent>
                      {bloodTypes.map((type) => (
                        <SelectItem key={type} value={type}>
                          {type}형
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label>별자리</Label>
                  <Select
                    value={formData.zodiac}
                    onValueChange={(value) => handleChange('zodiac', value)}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="선택" />
                    </SelectTrigger>
                    <SelectContent>
                      {zodiacSigns.map((sign) => (
                        <SelectItem key={sign} value={sign}>
                          {sign}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>

              {/* 현재 고민 입력 */}
              <div className="space-y-2">
                <Label>현재 고민 (선택)</Label>
                <Input
                  placeholder="예: 이직, 연애, 건강 등"
                  value={formData.question}
                  onChange={(e) => handleChange('question', e.target.value)}
                />
              </div>
            </CardContent>
          </Card>

          <div className="flex gap-4">
            <Button
              type="button"
              variant="outline"
              onClick={() => setStep('intro')}
              className="flex-1"
            >
              <ArrowLeft className="mr-2 h-4 w-4" />
              이전
            </Button>
            <Button
              type="submit"
              size="lg"
              className="flex-[2] bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600"
            >
              분석 시작하기
              <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}

// Suspense boundary로 감싸서 useSearchParams 사용 가능하게 함
export default function IntegratedAnalysisPage() {
  return (
    <Suspense fallback={
      <div className="container mx-auto px-4 py-16 flex items-center justify-center min-h-[400px]">
        <div className="animate-pulse text-muted-foreground">로딩 중...</div>
      </div>
    }>
      <IntegratedAnalysisPageContent />
    </Suspense>
  );
}
