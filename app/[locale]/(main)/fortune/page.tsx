import { useTranslations } from 'next-intl';
import { setRequestLocale } from 'next-intl/server';
import { Link } from '@/i18n/routing';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import {
  Sparkles,
  Star,
  Heart,
  Users,
  Zap,
  ArrowRight,
  CheckCircle,
  Eye,
  Crown,
} from 'lucide-react';
import { PRICING, formatPrice } from '@/lib/constants/pricing';

// 실제 존재하는 서비스만 포함
const fortuneServices = [
  {
    key: 'saju',
    label: 'AI 사주 분석',
    description: '사주팔자로 운명을 분석합니다',
    icon: Zap,
    color: 'bg-purple-500',
    href: '/fortune/saju',
    free: true,
  },
  {
    key: 'face',
    label: 'AI 관상 분석',
    description: 'AI로 얼굴을 분석하여 운세를 봅니다',
    icon: Eye,
    color: 'bg-blue-500',
    href: '/fortune/face',
    free: false,
  },
  {
    key: 'compatibility',
    label: '궁합 분석',
    description: '두 사람의 사주 궁합을 분석합니다',
    icon: Heart,
    color: 'bg-pink-500',
    href: '/fortune/compatibility',
    free: true,
  },
  {
    key: 'integrated',
    label: '통합 분석',
    description: '사주, 관상, 별자리, MBTI 통합 분석',
    icon: Crown,
    color: 'bg-yellow-500',
    href: '/fortune/integrated',
    free: false,
  },
  {
    key: 'experts',
    label: '전문가 상담',
    description: '검증된 전문가와 1:1 상담',
    icon: Users,
    color: 'bg-green-500',
    href: '/fortune/experts',
    free: false,
  },
  {
    key: 'free',
    label: '오늘의 운세',
    description: '매일 무료로 확인하는 오늘의 운세',
    icon: Star,
    color: 'bg-orange-500',
    href: '/fortune/free',
    free: true,
  },
];

const premiumFeatures = [
  '상세 분석 리포트',
  'PDF 다운로드',
  '음성 리포트',
  '월별 예측',
  '전문가 상담',
];

export default async function FortunePage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);

  return (
    <div className="flex flex-col">
      {/* 히어로 섹션 */}
      <section className="fortune-gradient text-white py-16 md:py-24">
        <div className="container mx-auto px-4">
          <FortuneHero />
        </div>
      </section>

      {/* 서비스 그리드 */}
      <section className="container mx-auto px-4 py-16">
        <FortuneServices />
      </section>

      {/* 프리미엄 CTA */}
      <section className="bg-muted/50 py-16">
        <div className="container mx-auto px-4">
          <PremiumSection />
        </div>
      </section>

      {/* 오늘의 운세 미리보기 */}
      <section className="container mx-auto px-4 py-16">
        <DailyFortunePreview />
      </section>
    </div>
  );
}

function FortuneHero() {
  const t = useTranslations('fortune');
  return (
    <div className="max-w-3xl mx-auto text-center">
      <Badge className="mb-4 bg-white/20 text-white">
        <Sparkles className="mr-1 h-3 w-3" />
        AI 운세 서비스
      </Badge>
      <h1 className="text-4xl md:text-5xl font-bold mb-4">{t('title')}</h1>
      <p className="text-xl text-white/80 mb-8">{t('subtitle')}</p>
      <div className="flex flex-wrap justify-center gap-4">
        <Link href="/fortune/free">
          <Button size="lg" className="bg-white text-purple-700 hover:bg-white/90">
            무료 운세 보기
            <ArrowRight className="ml-2 h-4 w-4" />
          </Button>
        </Link>
        <Link href="/fortune/saju">
          <Button
            size="lg"
            variant="outline"
            className="border-white/50 text-white hover:bg-white/10"
          >
            AI 사주 분석
          </Button>
        </Link>
      </div>
    </div>
  );
}

function FortuneServices() {
  return (
    <>
      <div className="text-center mb-12">
        <h2 className="text-3xl font-bold mb-4">운세 서비스</h2>
        <p className="text-muted-foreground max-w-2xl mx-auto">
          AI 기반의 다양한 운세 서비스를 이용해보세요
        </p>
      </div>
      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
        {fortuneServices.map((service) => {
          const Icon = service.icon;
          return (
            <Link key={service.key} href={service.href}>
              <Card className="card-hover h-full cursor-pointer relative overflow-hidden">
                {service.free && (
                  <Badge className="absolute top-4 right-4 bg-green-500">
                    무료
                  </Badge>
                )}
                <CardHeader>
                  <div className={`w-12 h-12 rounded-lg ${service.color} flex items-center justify-center mb-4`}>
                    <Icon className="h-6 w-6 text-white" />
                  </div>
                  <CardTitle>{service.label}</CardTitle>
                  <CardDescription>
                    {service.description}
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <Button variant="outline" className="w-full group">
                    시작하기
                    <ArrowRight className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform" />
                  </Button>
                </CardContent>
              </Card>
            </Link>
          );
        })}
      </div>
    </>
  );
}

function PremiumSection() {
  const t = useTranslations('fortune.premium');
  return (
    <Card className="overflow-hidden">
      <div className="grid md:grid-cols-2">
        <div className="fortune-gradient p-8 md:p-12 text-white">
          <Badge className="mb-4 bg-white/20 text-white">프리미엄</Badge>
          <h2 className="text-3xl font-bold mb-4">{t('title')}</h2>
          <p className="text-white/80 mb-6">
            가장 포괄적인 운세 분석을 프리미엄 서비스로 경험하세요
          </p>
          <ul className="space-y-3 mb-8">
            {premiumFeatures.map((feature, index) => (
              <li key={index} className="flex items-center gap-2">
                <CheckCircle className="h-5 w-5 text-white/80" />
                <span>{feature}</span>
              </li>
            ))}
          </ul>
          <Link href="/pricing">
            <Button className="bg-white text-purple-700 hover:bg-white/90">
              요금제 보기
              <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
          </Link>
        </div>
        <CardContent className="p-8 md:p-12 flex flex-col justify-center bg-gradient-to-br from-purple-50 to-pink-50 dark:from-purple-950/20 dark:to-pink-950/20">
          <div className="text-center">
            <div className="text-5xl font-bold mb-2">
              <span className="text-muted-foreground text-xl">월</span>{' '}
              <span className="text-primary">₩{formatPrice(PRICING.subscription.monthly.basic.price)}</span>
              <span className="text-muted-foreground text-xl">부터</span>
            </div>
            <p className="text-muted-foreground mb-6">
              베이직 플랜 기준
            </p>
            <Link href="/pricing">
              <Button size="lg" className="w-full">
                {t('cta')}
              </Button>
            </Link>
          </div>
        </CardContent>
      </div>
    </Card>
  );
}

function DailyFortunePreview() {
  const t = useTranslations('fortune.daily');
  return (
    <div className="text-center">
      <h2 className="text-3xl font-bold mb-4">{t('title')}</h2>
      <p className="text-muted-foreground mb-8">매일 무료로 운세를 확인하세요</p>
      <Card className="max-w-md mx-auto">
        <CardContent className="p-8">
          <div className="grid grid-cols-2 gap-4 mb-6">
            <div className="text-center p-4 rounded-lg bg-muted">
              <div className="text-3xl font-bold text-primary">85</div>
              <div className="text-sm text-muted-foreground">종합운</div>
            </div>
            <div className="text-center p-4 rounded-lg bg-muted">
              <div className="text-3xl font-bold text-green-500">92</div>
              <div className="text-sm text-muted-foreground">재물운</div>
            </div>
            <div className="text-center p-4 rounded-lg bg-muted">
              <div className="text-3xl font-bold text-pink-500">78</div>
              <div className="text-sm text-muted-foreground">애정운</div>
            </div>
            <div className="text-center p-4 rounded-lg bg-muted">
              <div className="text-3xl font-bold text-blue-500">88</div>
              <div className="text-sm text-muted-foreground">직업운</div>
            </div>
          </div>
          <Link href="/fortune/free">
            <Button className="w-full">
              오늘의 운세 보기
              <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
          </Link>
        </CardContent>
      </Card>
    </div>
  );
}
