'use client';

import { useState, useEffect } from 'react';
import { useTranslations } from 'next-intl';
import { Link } from '@/i18n/routing';
import Image from 'next/image';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import {
  Sparkles,
  Sun,
  Crown,
  MessageCircle,
  Heart,
  Flower2,
  Ticket,
  Moon,
  ArrowRight,
  CheckCircle,
  Gift,
  Lock,
  Star,
  Users,
  Timer,
  Calendar,
  Zap,
} from 'lucide-react';

// 서비스 카드 이미지 타입
interface ServiceCardImages {
  daily_fortune?: string;
  saju_basic?: string;
  saju_advanced?: string;
  ai_chat?: string;
  compatibility?: string;
  tarot?: string;
  lotto?: string;
}

// 서비스 정의 - 이미지 키 매핑 포함
const services = [
  {
    id: 'daily_fortune',
    title: '오늘의 운세',
    subtitle: '매일 새로운 운세',
    description: '오늘 하루의 운세를 확인하세요',
    icon: Sun,
    gradient: 'from-amber-400 to-orange-500',
    href: '/fortune/free',
    badge: { text: '무료', variant: 'free' as const },
  },
  {
    id: 'saju_basic',
    title: '사주 분석',
    subtitle: '기본 사주풀이',
    description: '타고난 운명과 성격을 분석합니다',
    icon: Star,
    gradient: 'from-blue-400 to-indigo-500',
    href: '/fortune/integrated',
    badge: { text: '프리미엄', variant: 'premium' as const },
  },
  {
    id: 'saju_advanced',
    title: '정통 사주',
    subtitle: '심층 분석',
    description: '십신, 신살, 12운성 상세 분석',
    icon: Moon,
    gradient: 'from-purple-400 to-violet-500',
    href: '/fortune/integrated',
    badge: { text: '프리미엄', variant: 'premium' as const },
  },
  {
    id: 'ai_chat',
    title: 'AI 사주 상담',
    subtitle: '1:1 맞춤 상담',
    description: 'AI와 대화로 깊은 상담을 받으세요',
    icon: MessageCircle,
    gradient: 'from-rose-400 to-pink-500',
    href: '/fortune/experts',
    badge: { text: 'VIP', variant: 'vip' as const },
    requiresPremium: true,
  },
  {
    id: 'compatibility',
    title: '궁합 분석',
    subtitle: '연인/가족 궁합',
    description: '두 사람의 궁합을 확인하세요',
    icon: Heart,
    gradient: 'from-pink-400 to-rose-500',
    href: '/fortune/compatibility',
    badge: { text: '준비 중', variant: 'coming' as const },
    comingSoon: true,
  },
  {
    id: 'tarot',
    title: '타로 점',
    subtitle: 'AI 타로 리딩',
    description: '카드가 전하는 메시지를 확인하세요',
    icon: Flower2,
    gradient: 'from-violet-400 to-purple-500',
    href: '/fortune/tarot',
    badge: { text: '베타', variant: 'beta' as const },
  },
  {
    id: 'lotto',
    title: '로또 분석',
    subtitle: 'AI 번호 추천',
    description: '사주 기반 행운의 번호를 받아보세요',
    icon: Ticket,
    gradient: 'from-emerald-400 to-teal-500',
    href: '/lotto',
    badge: { text: '무료', variant: 'free' as const },
  },
];

// 배지 스타일
const badgeStyles = {
  free: 'bg-emerald-500 text-white border-0',
  premium: 'bg-amber-500 text-white border-0',
  vip: 'bg-gradient-to-r from-purple-500 to-pink-500 text-white border-0',
  coming: 'bg-gray-400 text-white border-0',
  beta: 'bg-violet-500 text-white border-0',
  required: 'bg-blue-500 text-white border-0',
};

export default function SajuPage() {
  const t = useTranslations('fortune');
  const [cardImages, setCardImages] = useState<ServiceCardImages>({});
  const [imagesLoaded, setImagesLoaded] = useState(false);

  // 서비스 카드 이미지 불러오기
  useEffect(() => {
    const fetchCardImages = async () => {
      try {
        const response = await fetch('/api/site-settings?key=service_card_images');
        const result = await response.json();
        if (result.data?.value) {
          setCardImages(result.data.value);
        }
      } catch (error) {
        console.error('Error fetching card images:', error);
      } finally {
        setImagesLoaded(true);
      }
    };
    fetchCardImages();
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-b from-background to-muted/30">
      {/* Hero Section */}
      <section className="relative overflow-hidden bg-gradient-to-br from-violet-600 via-purple-600 to-indigo-700 text-white">
        <div className="absolute inset-0">
          <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-white/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2" />
          <div className="absolute bottom-0 left-0 w-[400px] h-[400px] bg-pink-500/20 rounded-full blur-3xl translate-y-1/2 -translate-x-1/2" />
        </div>

        <div className="container mx-auto px-4 py-16 md:py-20 relative z-10">
          <div className="max-w-4xl mx-auto text-center">
            <Badge className="mb-6 bg-white/20 text-white hover:bg-white/30 backdrop-blur-sm border-0 px-4 py-1.5">
              <Sparkles className="mr-2 h-4 w-4" />
              AI 사주 · 운세 서비스
            </Badge>

            <h1 className="text-4xl md:text-5xl font-bold mb-6 leading-tight">
              당신의 운명을
              <br />
              <span className="text-amber-300">AI가 읽어드립니다</span>
            </h1>

            <p className="text-lg md:text-xl text-white/80 mb-8 max-w-2xl mx-auto">
              정통 사주명리학과 최첨단 AI의 만남
            </p>

            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
              <Link href="/fortune/free">
                <Button size="lg" className="bg-white text-purple-700 hover:bg-white/90 shadow-xl px-8">
                  <Sun className="mr-2 h-5 w-5 text-amber-500" />
                  오늘의 운세 보기
                </Button>
              </Link>
              <Link href="/fortune/integrated">
                <Button size="lg" variant="outline" className="border-2 border-white/50 text-white hover:bg-white/10 px-8">
                  <Crown className="mr-2 h-5 w-5 text-amber-300" />
                  사주분석 시작
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Services Grid - 스크린샷 스타일 */}
      <section className="container mx-auto px-4 py-12 md:py-16">
        <div className="text-center mb-10">
          <h2 className="text-2xl md:text-3xl font-bold mb-3">분석 서비스</h2>
          <p className="text-muted-foreground">원하는 분석을 선택하세요</p>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6 max-w-5xl mx-auto">
          {services.map((service) => {
            const Icon = service.icon;
            const imageUrl = cardImages[service.id as keyof ServiceCardImages];
            const isDisabled = service.comingSoon;

            return (
              <Link
                key={service.id}
                href={isDisabled ? '#' : service.href}
                className={isDisabled ? 'pointer-events-none' : ''}
              >
                <Card className={`group overflow-hidden border-0 shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-1 ${isDisabled ? 'opacity-70' : ''}`}>
                  {/* 이미지/그라디언트 영역 */}
                  <div className={`relative aspect-[4/3] overflow-hidden bg-gradient-to-br ${service.gradient}`}>
                    {imageUrl ? (
                      <Image
                        src={imageUrl}
                        alt={service.title}
                        fill
                        className="object-cover"
                      />
                    ) : (
                      <div className="absolute inset-0 flex items-center justify-center">
                        <Icon className="h-16 w-16 text-white/80" />
                      </div>
                    )}

                    {/* 배지 - 우측 상단 */}
                    {service.badge && (
                      <div className="absolute top-3 right-3">
                        <Badge className={`${badgeStyles[service.badge.variant]} text-xs px-2 py-0.5`}>
                          {service.badge.variant === 'vip' && <Crown className="mr-1 h-3 w-3" />}
                          {service.badge.variant === 'coming' && <Timer className="mr-1 h-3 w-3" />}
                          {service.badge.text}
                        </Badge>
                      </div>
                    )}

                    {/* 제목 오버레이 - 하단 그라디언트 */}
                    <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/60 via-black/30 to-transparent p-4">
                      <h3 className="text-white font-bold text-lg">{service.title}</h3>
                    </div>
                  </div>

                  {/* 하단 정보 영역 - 최소화 */}
                  <CardContent className="p-3">
                    <p className="text-xs text-muted-foreground line-clamp-1">{service.subtitle}</p>
                    <p className="text-sm text-foreground/80 line-clamp-1 mt-0.5">{service.description}</p>
                  </CardContent>
                </Card>
              </Link>
            );
          })}
        </div>
      </section>

      {/* Premium CTA */}
      <section className="container mx-auto px-4 pb-16">
        <Card className="max-w-4xl mx-auto overflow-hidden border-0 shadow-2xl">
          <div className="grid md:grid-cols-2">
            <div className="bg-gradient-to-br from-purple-600 via-violet-600 to-indigo-700 p-8 md:p-10 text-white relative overflow-hidden">
              <div className="absolute top-0 right-0 w-48 h-48 bg-white/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2" />
              <div className="relative z-10">
                <Badge className="mb-4 bg-amber-400 text-amber-900 border-0">
                  <Crown className="mr-1 h-3 w-3" />
                  PREMIUM
                </Badge>
                <h3 className="text-2xl font-bold mb-3">
                  프리미엄 사주분석
                </h3>
                <p className="text-white/80 mb-6 text-sm">
                  정통 사주명리학 기반의 심층 분석으로<br />
                  10년 대운, 월운까지 상세하게 확인하세요
                </p>
                <ul className="space-y-2 mb-6">
                  {['사주팔자 원국 분석', '대운/세운 10년 해석', 'PDF 리포트 다운로드', 'AI 1:1 상담 가능'].map((feature, i) => (
                    <li key={i} className="flex items-center gap-2 text-sm">
                      <CheckCircle className="h-4 w-4 text-amber-300" />
                      <span>{feature}</span>
                    </li>
                  ))}
                </ul>
                <Link href="/fortune/integrated">
                  <Button className="bg-white text-purple-700 hover:bg-white/90">
                    시작하기
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </Button>
                </Link>
              </div>
            </div>

            <div className="p-8 md:p-10 flex flex-col justify-center bg-gradient-to-br from-purple-50 to-indigo-50 dark:from-purple-950/30 dark:to-indigo-950/30">
              <div className="text-center">
                <p className="text-sm text-muted-foreground mb-2">프리미엄 분석</p>
                <div className="mb-3">
                  <span className="text-muted-foreground text-lg line-through">₩29,000</span>
                  <div className="text-4xl font-bold text-purple-600 mt-1">₩14,900</div>
                  <Badge className="mt-2 bg-red-500 text-white border-0">49% 할인</Badge>
                </div>
                <p className="text-sm text-muted-foreground mb-2">
                  첫 분석 특별 가격 · 평생 소장
                </p>
                <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-gradient-to-r from-amber-100 to-yellow-100 dark:from-amber-900/30 dark:to-yellow-900/30 border border-amber-200 dark:border-amber-800 mb-4">
                  <Ticket className="h-4 w-4 text-amber-600" />
                  <span className="text-sm font-medium text-amber-700 dark:text-amber-300">쿠폰 할인 적용 가능</span>
                </div>

                <Link href="/pricing" className="block">
                  <Button variant="outline" className="w-full">
                    요금제 비교하기
                  </Button>
                </Link>
              </div>
            </div>
          </div>
        </Card>
      </section>

      {/* Trust Badges */}
      <section className="bg-muted/50 py-10">
        <div className="container mx-auto px-4">
          <div className="flex flex-wrap justify-center items-center gap-8 md:gap-12 text-muted-foreground">
            <div className="flex items-center gap-2">
              <Lock className="h-5 w-5" />
              <span className="text-sm">안전한 결제</span>
            </div>
            <div className="flex items-center gap-2">
              <Users className="h-5 w-5" />
              <span className="text-sm">50만+ 이용자</span>
            </div>
            <div className="flex items-center gap-2">
              <Star className="h-5 w-5" />
              <span className="text-sm">4.9점 만족도</span>
            </div>
            <div className="flex items-center gap-2">
              <CheckCircle className="h-5 w-5" />
              <span className="text-sm">환불 보장</span>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
