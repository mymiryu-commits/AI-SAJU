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
  Save,
  Users,
  Trash2,
} from 'lucide-react';
import Image from 'next/image';
import { SlideImage, FortuneSlideSettings } from '@/types/settings';
import SajuResultCard from '@/components/fortune/saju/SajuResultCard';
import PremiumUpgradeModal from '@/components/fortune/saju/PremiumUpgradeModal';
import type { AnalysisResult, UserInput } from '@/types/saju';

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
  nickname?: string;
  is_favorite?: boolean;
  created_at: string;
}

// 별자리 계산 함수
function calculateZodiacSign(birthDate: string): string {
  if (!birthDate) return '';
  const date = new Date(birthDate);
  const month = date.getMonth() + 1;
  const day = date.getDate();

  if ((month === 3 && day >= 21) || (month === 4 && day <= 19)) return '양자리';
  if ((month === 4 && day >= 20) || (month === 5 && day <= 20)) return '황소자리';
  if ((month === 5 && day >= 21) || (month === 6 && day <= 21)) return '쌍둥이자리';
  if ((month === 6 && day >= 22) || (month === 7 && day <= 22)) return '게자리';
  if ((month === 7 && day >= 23) || (month === 8 && day <= 22)) return '사자자리';
  if ((month === 8 && day >= 23) || (month === 9 && day <= 22)) return '처녀자리';
  if ((month === 9 && day >= 23) || (month === 10 && day <= 22)) return '천칭자리';
  if ((month === 10 && day >= 23) || (month === 11 && day <= 21)) return '전갈자리';
  if ((month === 11 && day >= 22) || (month === 12 && day <= 21)) return '사수자리';
  if ((month === 12 && day >= 22) || (month === 1 && day <= 19)) return '염소자리';
  if ((month === 1 && day >= 20) || (month === 2 && day <= 18)) return '물병자리';
  if ((month === 2 && day >= 19) || (month === 3 && day <= 20)) return '물고기자리';
  return '';
}

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
    price: 9800,
    discountedPrice: 4900,
    tickets: 1,
    features: [
      '사주팔자 기본 분석',
      '오행 분석',
      '2026년 총운',
      '성격 분석',
    ],
    color: 'border-slate-300 dark:border-slate-600',
    gradient: 'from-slate-500 to-slate-600',
  },
  {
    id: 'standard',
    name: '스탠다드',
    price: 19600,
    discountedPrice: 9800,
    tickets: 2,
    features: [
      '베이직 패키지 전체',
      '궁합 분석',
      '월별 상세 운세 12개월',
      'PDF 리포트 다운로드',
    ],
    popular: true,
    color: 'border-violet-500',
    gradient: 'from-violet-500 to-purple-600',
  },
  {
    id: 'premium',
    name: '프리미엄',
    price: 39200,
    discountedPrice: 19600,
    tickets: 4,
    features: [
      '스탠다드 패키지 전체',
      '10년 대운 분석',
      'MBTI/혈액형 통합 분석',
      '음성 리포트 (MP3)',
      'AI 1:1 상담',
    ],
    color: 'border-amber-500',
    gradient: 'from-amber-500 to-orange-600',
    badge: 'BEST',
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
  // 관리자는 자동 우회 (admin_test 파라미터 없이도 가능)
  const adminBypass = isAdmin;

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
  const [showUpgradeModal, setShowUpgradeModal] = useState(false);

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

  // 프로필 관련 상태
  const [savedProfiles, setSavedProfiles] = useState<SavedProfile[]>([]);
  const [showProfileSelector, setShowProfileSelector] = useState(false);
  const [loadingProfiles, setLoadingProfiles] = useState(false);
  const [savingProfile, setSavingProfile] = useState(false);
  const [profileMessage, setProfileMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  // 프로필 목록 불러오기
  const loadProfiles = useCallback(async () => {
    if (!user?.id) return;
    setLoadingProfiles(true);
    try {
      const response = await fetch('/api/saju-profiles', {
        headers: { 'x-user-id': user.id }
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

  // 생년월일 변경 시 별자리 자동 계산
  useEffect(() => {
    if (formData.birthDate) {
      const zodiac = calculateZodiacSign(formData.birthDate);
      if (zodiac && zodiac !== formData.zodiac) {
        setFormData(prev => ({ ...prev, zodiac }));
      }
    }
  }, [formData.birthDate, formData.zodiac]);

  // 프로필 저장
  const handleSaveProfile = async () => {
    if (!user?.id) {
      setProfileMessage({ type: 'error', text: '로그인이 필요합니다.' });
      return;
    }
    if (!formData.name || !formData.birthDate || !formData.gender) {
      setProfileMessage({ type: 'error', text: '이름, 생년월일, 성별을 입력해주세요.' });
      setTimeout(() => setProfileMessage(null), 3000);
      return;
    }

    setSavingProfile(true);
    try {
      const response = await fetch('/api/saju-profiles', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'x-user-id': user.id },
        body: JSON.stringify({
          profile: {
            name: formData.name,
            birth_date: formData.birthDate,
            birth_time: formData.birthHour ? `${formData.birthHour}:00` : null,
            gender: formData.gender,
            calendar: formData.calendar,
            blood_type: formData.bloodType || null,
            mbti: formData.mbti || null,
          }
        })
      });

      if (response.ok) {
        setProfileMessage({ type: 'success', text: '프로필이 저장되었습니다.' });
        loadProfiles();
      } else {
        const data = await response.json();
        setProfileMessage({ type: 'error', text: data.error || '저장에 실패했습니다.' });
      }
    } catch (error) {
      setProfileMessage({ type: 'error', text: '저장 중 오류가 발생했습니다.' });
    } finally {
      setSavingProfile(false);
      setTimeout(() => setProfileMessage(null), 3000);
    }
  };

  // 프로필 불러오기
  const handleLoadProfile = (profile: SavedProfile) => {
    setFormData({
      name: profile.name,
      birthDate: profile.birth_date,
      birthHour: profile.birth_time ? profile.birth_time.split(':')[0] : '',
      gender: profile.gender,
      calendar: profile.calendar || 'solar',
      mbti: profile.mbti || '',
      bloodType: profile.blood_type || '',
      zodiac: calculateZodiacSign(profile.birth_date),
      concerns: [],
      question: '',
    });
    setShowProfileSelector(false);
    setProfileMessage({ type: 'success', text: `"${profile.nickname || profile.name}" 정보를 불러왔습니다.` });
    setTimeout(() => setProfileMessage(null), 3000);
  };

  // 프로필 삭제
  const handleDeleteProfile = async (profileId: string, e: React.MouseEvent) => {
    e.stopPropagation();
    if (!user?.id || !confirm('이 프로필을 삭제하시겠습니까?')) return;

    try {
      const response = await fetch(`/api/saju-profiles?profileId=${profileId}`, {
        method: 'DELETE',
        headers: { 'x-user-id': user.id }
      });
      if (response.ok) {
        setSavedProfiles(prev => prev.filter(p => p.id !== profileId));
      }
    } catch (error) {
      console.error('프로필 삭제 오류:', error);
    }
  };

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

      // 분석 API 호출 (결제권 사용 강제 - 통합 페이지는 무료분석 없음)
      const response = await fetch('/api/fortune/saju/analyze', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...userInput,
          useVoucher: true,
        }),
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
      const apiIsAdmin = data.meta?.isAdmin || isAdmin;

      // 디버그 로그 (개발용)
      console.log('[분석 결과]', {
        hasResult: !!result,
        analysisId: data.meta?.analysisId,
        isBlinded: data.data?.isBlinded,
        apiIsAdmin,
        frontendIsAdmin: isAdmin,
        userId: data.meta?.userId,
      });

      if (result) {
        setAnalysisResult(result);
        setAnalysisId(data.meta?.analysisId || null);

        // 통합 페이지는 결제 후 분석이므로, 선택한 패키지에 맞는 레벨 설정
        const pkgLevels: Record<string, ProductLevel> = {
          basic: 'basic',
          standard: 'deep',
          premium: 'premium',
        };
        const resolvedLevel = apiIsAdmin ? 'vip' : (pkgLevels[selectedPackage] || 'basic');
        const resolvedUnlocked = !data.data?.isBlinded || apiIsAdmin || data.meta?.usedVoucher;

        setIsPremiumUnlocked(resolvedUnlocked);
        setProductLevel(resolvedLevel);

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

  // 프리미엄 업그레이드 모달 열기
  const handleUnlockPremium = () => {
    if (!user) {
      router.push('/login?redirect=/fortune/integrated');
      return;
    }
    setShowUpgradeModal(true);
  };

  // 패키지 선택 후 결제 처리 (업그레이드 모달에서 호출)
  const handleSelectPackage = async (pkgId: string) => {
    setShowUpgradeModal(false);
    await startPaymentFlow(pkgId);
  };

  // 분석 시작 전 결제 확인
  const handleStartAnalysis = async () => {
    if (!user) {
      router.push('/login?redirect=/fortune/integrated');
      return;
    }

    // 결제권 확인
    try {
      const response = await fetch('/api/voucher/check?service_type=saju');
      const data = await response.json();

      if (data.hasVoucher) {
        // 결제권 있음 → 바로 폼으로 이동
        // 선택한 패키지 레벨 저장
        const pkgLevels: Record<string, ProductLevel> = {
          basic: 'basic',
          standard: 'deep',
          premium: 'premium',
        };
        setProductLevel(pkgLevels[selectedPackage] || 'basic');
        setIsPremiumUnlocked(true);
        setStep('form');
      } else {
        // 결제권 없음 → 결제 진행
        await startPaymentFlow(selectedPackage);
      }
    } catch (error) {
      console.error('Voucher check error:', error);
      // 확인 실패 시 결제 화면으로
      await startPaymentFlow(selectedPackage);
    }
  };

  // 결제 플로우 시작
  const startPaymentFlow = async (pkgId: string) => {
    setSelectedPackage(pkgId);

    try {
      // 번들 패키지 ID 가져오기
      const pkgResponse = await fetch('/api/voucher/packages?service_type=bundle');
      const pkgData = await pkgResponse.json();

      const dbPackage = pkgData.packages?.find((p: { plan_type: string }) => p.plan_type === pkgId);

      if (!dbPackage) {
        alert('패키지 정보를 불러올 수 없습니다. 잠시 후 다시 시도해주세요.');
        return;
      }

      // 결제권 구매 API 호출
      const response = await fetch('/api/voucher/purchase', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          package_id: dbPackage.id,
        }),
      });

      const data = await response.json();

      if (data.success && data.toss) {
        // 토스페이먼츠 결제
        const tossClientKey = process.env.NEXT_PUBLIC_TOSS_CLIENT_KEY;
        if (tossClientKey && typeof window !== 'undefined') {
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          const tossPayments = (window as any).TossPayments?.(tossClientKey);
          if (tossPayments) {
            await tossPayments.requestPayment('카드', {
              amount: data.toss.amount,
              orderId: data.toss.orderId,
              orderName: data.toss.orderName,
              customerName: data.toss.customerName,
              // 결제 성공 시 다시 이 페이지로 돌아오도록 설정
              successUrl: `${window.location.origin}/api/voucher/callback/success?redirect=/fortune/integrated`,
              failUrl: `${window.location.origin}/api/voucher/callback/fail?redirect=/fortune/integrated`,
            });
          } else {
            // SDK 없으면 체크아웃 페이지로 이동
            window.location.href = `/payment/checkout?orderId=${data.orderId}&amount=${data.toss.amount}&orderName=${encodeURIComponent(data.toss.orderName)}&redirect=/fortune/integrated`;
          }
        }
      } else {
        alert(data.error || '결제 준비 중 오류가 발생했습니다.');
      }
    } catch (error) {
      console.error('Payment error:', error);
      alert('결제 처리 중 오류가 발생했습니다.');
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
          <Button onClick={() => { setStep('form'); setError(null); }}>
            <ArrowLeft className="mr-2 h-4 w-4" />
            다시 시도
          </Button>
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
            <div className="mb-10">
              <h2 className="text-xl font-bold mb-2 text-center">결제권 선택</h2>
              <p className="text-sm text-muted-foreground text-center mb-6">필요에 맞는 패키지를 선택하세요</p>
              <div className="grid md:grid-cols-3 gap-5">
                {packages.map((pkg) => (
                  <Card
                    key={pkg.id}
                    className={`relative cursor-pointer transition-all duration-300 hover:shadow-xl hover:-translate-y-1 ${
                      selectedPackage === pkg.id
                        ? `${pkg.color} border-2 shadow-xl ring-2 ring-offset-2 ${pkg.id === 'standard' ? 'ring-violet-500' : pkg.id === 'premium' ? 'ring-amber-500' : 'ring-slate-400'}`
                        : 'border hover:border-muted-foreground/30'
                    } ${pkg.popular ? 'md:scale-105 md:z-10' : ''}`}
                    onClick={() => setSelectedPackage(pkg.id)}
                  >
                    {/* 인기 배지 */}
                    {pkg.popular && (
                      <div className="absolute -top-3 left-1/2 transform -translate-x-1/2 z-10">
                        <Badge className="bg-gradient-to-r from-violet-500 to-purple-600 text-white border-0 px-3 py-1 shadow-lg">
                          <Star className="mr-1 h-3 w-3" />
                          인기
                        </Badge>
                      </div>
                    )}
                    {/* BEST 배지 */}
                    {pkg.badge && (
                      <div className="absolute -top-3 right-4 z-10">
                        <Badge className="bg-gradient-to-r from-amber-500 to-orange-500 text-white border-0 px-2 py-0.5 text-xs shadow-lg">
                          {pkg.badge}
                        </Badge>
                      </div>
                    )}

                    {/* 선택 체크 표시 */}
                    {selectedPackage === pkg.id && (
                      <div className="absolute top-3 right-3">
                        <div className={`w-6 h-6 rounded-full bg-gradient-to-r ${pkg.gradient} flex items-center justify-center`}>
                          <CheckCircle className="h-4 w-4 text-white" />
                        </div>
                      </div>
                    )}

                    <CardHeader className={`text-center ${pkg.popular ? 'pt-8' : 'pt-5'} pb-3`}>
                      <p className="text-xs text-muted-foreground uppercase tracking-wider mb-1">
                        결제권 {pkg.tickets}장
                      </p>
                      <CardTitle className="text-lg">{pkg.name}</CardTitle>
                      <div className="mt-2">
                        <span className={`text-3xl font-bold bg-gradient-to-r ${pkg.gradient} bg-clip-text text-transparent`}>
                          ₩{pkg.discountedPrice.toLocaleString()}
                        </span>
                      </div>
                      <div className="flex items-center justify-center gap-2 mt-1">
                        <span className="text-muted-foreground line-through text-sm">
                          ₩{pkg.price.toLocaleString()}
                        </span>
                        <Badge variant="secondary" className="bg-red-100 text-red-600 dark:bg-red-900/30 dark:text-red-400 text-xs">
                          50% 할인
                        </Badge>
                      </div>
                    </CardHeader>
                    <CardContent className="pt-0 pb-5">
                      <ul className="space-y-2">
                        {pkg.features.map((feature, i) => (
                          <li key={i} className="flex items-start gap-2 text-sm">
                            <div className={`w-5 h-5 rounded-full bg-gradient-to-r ${pkg.gradient} flex items-center justify-center flex-shrink-0 mt-0.5`}>
                              <CheckCircle className="h-3 w-3 text-white" />
                            </div>
                            <span>{feature}</span>
                          </li>
                        ))}
                      </ul>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>

            {/* CTA 버튼 */}
            <div className="text-center">
              <div className="inline-flex flex-col items-center p-6 rounded-2xl bg-gradient-to-r from-purple-50 to-pink-50 dark:from-purple-950/30 dark:to-pink-950/30 border border-purple-100 dark:border-purple-800/50">
                <p className="text-sm text-muted-foreground mb-3">
                  선택한 패키지: <span className="font-semibold text-foreground">{packages.find(p => p.id === selectedPackage)?.name}</span>
                </p>
                <Button
                  size="lg"
                  onClick={handleStartAnalysis}
                  className="bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white px-12 py-7 text-lg shadow-xl hover:shadow-2xl transition-all hover:-translate-y-0.5"
                >
                  <Sparkles className="mr-2 h-5 w-5" />
                  분석 시작하기
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Button>
                <div className="flex items-center gap-4 mt-4 text-xs text-muted-foreground">
                  <span className="flex items-center gap-1">
                    <CheckCircle className="h-3 w-3 text-green-500" />
                    안전한 결제
                  </span>
                  <span className="flex items-center gap-1">
                    <CheckCircle className="h-3 w-3 text-green-500" />
                    7일 이내 환불
                  </span>
                  <span className="flex items-center gap-1">
                    <CheckCircle className="h-3 w-3 text-green-500" />
                    1년 유효기간
                  </span>
                </div>
              </div>
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

          {/* 프리미엄 업그레이드 유도 배너 (미해금 시) */}
          {!isPremiumUnlocked && !adminBypass && (
            <Card className="mb-6 bg-gradient-to-r from-purple-50 to-pink-50 dark:from-purple-950/30 dark:to-pink-950/30 border-purple-200 dark:border-purple-800">
              <CardContent className="py-4">
                <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 rounded-full bg-gradient-to-r from-purple-500 to-pink-500 flex items-center justify-center">
                      <Crown className="h-6 w-6 text-white" />
                    </div>
                    <div>
                      <p className="font-semibold">전체 분석 결과 보기</p>
                      <p className="text-sm text-muted-foreground">
                        월별 운세, 대운 분석, PDF/음성 리포트까지
                      </p>
                    </div>
                  </div>
                  <Button
                    onClick={handleUnlockPremium}
                    className="bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600"
                  >
                    <Sparkles className="mr-2 h-4 w-4" />
                    프리미엄 해금
                  </Button>
                </div>
              </CardContent>
            </Card>
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

          {/* 프리미엄 업그레이드 모달 */}
          <PremiumUpgradeModal
            isOpen={showUpgradeModal}
            onClose={() => setShowUpgradeModal(false)}
            onSelectPackage={handleSelectPackage}
            currentAnalysisId={analysisId || undefined}
          />
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

        {/* 에러/성공 메시지 */}
        {error && (
          <Alert variant="destructive" className="mb-6">
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}
        {profileMessage && (
          <Alert className={`mb-6 ${profileMessage.type === 'success' ? 'bg-green-50 border-green-200 dark:bg-green-950/30 dark:border-green-800' : 'bg-red-50 border-red-200 dark:bg-red-950/30 dark:border-red-800'}`}>
            <CheckCircle className={`h-4 w-4 ${profileMessage.type === 'success' ? 'text-green-500' : 'text-red-500'}`} />
            <AlertDescription className={profileMessage.type === 'success' ? 'text-green-700 dark:text-green-400' : 'text-red-700 dark:text-red-400'}>
              {profileMessage.text}
            </AlertDescription>
          </Alert>
        )}

        {/* 저장된 프로필 섹션 */}
        {user && (
          <Card className="mb-6 border-dashed">
            <CardContent className="py-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <Users className="h-4 w-4" />
                  <span>저장된 프로필</span>
                </div>
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={() => setShowProfileSelector(!showProfileSelector)}
                >
                  {showProfileSelector ? '닫기' : `불러오기 (${savedProfiles.length})`}
                </Button>
              </div>

              {showProfileSelector && (
                <div className="mt-4 space-y-2">
                  {loadingProfiles ? (
                    <div className="flex items-center justify-center py-4">
                      <Loader2 className="h-5 w-5 animate-spin text-purple-500" />
                    </div>
                  ) : savedProfiles.length === 0 ? (
                    <p className="text-sm text-muted-foreground text-center py-4">
                      저장된 프로필이 없습니다.
                    </p>
                  ) : (
                    <div className="max-h-48 overflow-y-auto space-y-2">
                      {savedProfiles.map(profile => (
                        <div
                          key={profile.id}
                          onClick={() => handleLoadProfile(profile)}
                          className="flex items-center justify-between p-3 bg-muted/50 rounded-lg cursor-pointer hover:bg-muted transition-colors"
                        >
                          <div>
                            <p className="font-medium">
                              {profile.nickname || profile.name}
                              {profile.nickname && <span className="ml-2 text-xs text-muted-foreground">({profile.name})</span>}
                            </p>
                            <p className="text-xs text-muted-foreground">
                              {profile.birth_date} · {profile.gender === 'male' ? '남' : '여'}
                            </p>
                          </div>
                          <Button
                            type="button"
                            variant="ghost"
                            size="sm"
                            onClick={(e) => handleDeleteProfile(profile.id, e)}
                            className="text-muted-foreground hover:text-red-500"
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              )}
            </CardContent>
          </Card>
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
                    max={new Date().toISOString().split('T')[0]}
                    min="1920-01-01"
                    required
                    className="appearance-none"
                  />
                  <p className="text-xs text-muted-foreground">달력을 클릭해 선택하세요</p>
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
                  <Label>별자리 {formData.zodiac && <span className="text-xs text-green-500">(자동계산)</span>}</Label>
                  <Input
                    value={formData.zodiac || '생년월일 입력 시 자동 계산'}
                    disabled
                    className="bg-muted/50"
                  />
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

          {/* 프로필 저장 버튼 */}
          {user && formData.name && formData.birthDate && formData.gender && (
            <div className="mt-4">
              <Button
                type="button"
                variant="outline"
                onClick={handleSaveProfile}
                disabled={savingProfile}
                className="w-full"
              >
                {savingProfile ? (
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                ) : (
                  <Save className="mr-2 h-4 w-4" />
                )}
                이 정보를 프로필로 저장
              </Button>
            </div>
          )}
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
