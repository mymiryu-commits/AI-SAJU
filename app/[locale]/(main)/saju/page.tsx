'use client';

import { useState } from 'react';
import { useTranslations } from 'next-intl';
import { Link } from '@/i18n/routing';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';
import {
  Sparkles,
  Star,
  Heart,
  Users,
  Zap,
  ArrowRight,
  Crown,
  Gift,
  TrendingUp,
  Clock,
  CheckCircle,
  Play,
  Coins,
} from 'lucide-react';

type CategoryFilter = 'all' | 'free' | 'premium' | 'recommended';

interface SajuService {
  id: string;
  titleKey: string;
  descriptionKey: string;
  icon: React.ElementType;
  gradient: string;
  bgImage?: string;
  category: 'free' | 'premium';
  recommended: boolean;
  rating: number;
  reviewCount: number;
  points?: number;
  originalPoints?: number;
  href: string;
  badge?: string;
}

const sajuServices: SajuService[] = [
  {
    id: 'basic-saju',
    titleKey: 'basicSaju',
    descriptionKey: 'basicSajuDesc',
    icon: Zap,
    gradient: 'from-violet-500 to-purple-600',
    category: 'free',
    recommended: true,
    rating: 4.8,
    reviewCount: 12543,
    href: '/fortune/saju',
    badge: 'HOT',
  },
  {
    id: 'deep-saju',
    titleKey: 'deepSaju',
    descriptionKey: 'deepSajuDesc',
    icon: Crown,
    gradient: 'from-amber-500 to-orange-600',
    category: 'premium',
    recommended: true,
    rating: 4.9,
    reviewCount: 8721,
    points: 50,
    originalPoints: 80,
    href: '/fortune/saju?tier=deep',
    badge: 'BEST',
  },
  {
    id: 'face-reading',
    titleKey: 'faceReading',
    descriptionKey: 'faceReadingDesc',
    icon: Star,
    gradient: 'from-blue-500 to-cyan-600',
    category: 'premium',
    recommended: false,
    rating: 4.7,
    reviewCount: 5432,
    points: 30,
    href: '/fortune/face',
  },
  {
    id: 'compatibility',
    titleKey: 'compatibility',
    descriptionKey: 'compatibilityDesc',
    icon: Heart,
    gradient: 'from-pink-500 to-rose-600',
    category: 'premium',
    recommended: true,
    rating: 4.8,
    reviewCount: 9876,
    points: 50,
    href: '/fortune/compatibility',
    badge: 'NEW',
  },
  {
    id: 'group-analysis',
    titleKey: 'groupAnalysis',
    descriptionKey: 'groupAnalysisDesc',
    icon: Users,
    gradient: 'from-emerald-500 to-teal-600',
    category: 'premium',
    recommended: false,
    rating: 4.6,
    reviewCount: 3210,
    points: 80,
    href: '/fortune/group',
  },
  {
    id: 'yearly-fortune',
    titleKey: 'yearlyFortune',
    descriptionKey: 'yearlyFortuneDesc',
    icon: TrendingUp,
    gradient: 'from-indigo-500 to-violet-600',
    category: 'free',
    recommended: false,
    rating: 4.5,
    reviewCount: 7654,
    href: '/fortune/free',
  },
];

const stats = [
  { value: '1,234,567', labelKey: 'totalAnalyses' },
  { value: '4.8', labelKey: 'avgRating' },
  { value: '98%', labelKey: 'satisfaction' },
];

export default function SajuLandingPage() {
  const t = useTranslations('saju');
  const [activeCategory, setActiveCategory] = useState<CategoryFilter>('all');

  const filteredServices = sajuServices.filter((service) => {
    if (activeCategory === 'all') return true;
    if (activeCategory === 'free') return service.category === 'free';
    if (activeCategory === 'premium') return service.category === 'premium';
    if (activeCategory === 'recommended') return service.recommended;
    return true;
  });

  return (
    <div className="flex flex-col min-h-screen">
      {/* Hero Section */}
      <section className="relative overflow-hidden bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 text-white">
        {/* Animated Background Elements */}
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-purple-500/20 rounded-full blur-3xl animate-pulse" />
          <div className="absolute bottom-1/4 right-1/4 w-80 h-80 bg-pink-500/20 rounded-full blur-3xl animate-pulse delay-1000" />
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-gradient-to-r from-purple-500/10 to-pink-500/10 rounded-full blur-3xl" />
        </div>

        {/* Star Pattern Overlay */}
        <div className="absolute inset-0 bg-[url('/stars.svg')] opacity-30" />

        <div className="container mx-auto px-4 py-20 md:py-32 relative z-10">
          <div className="max-w-4xl mx-auto text-center">
            {/* Badge */}
            <Badge className="mb-6 bg-white/10 text-white border-white/20 backdrop-blur-sm px-4 py-2">
              <Sparkles className="mr-2 h-4 w-4 text-yellow-400" />
              {t('hero.badge')}
            </Badge>

            {/* Main Title */}
            <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold mb-6 leading-tight">
              <span className="bg-gradient-to-r from-white via-purple-200 to-pink-200 bg-clip-text text-transparent">
                {t('hero.title')}
              </span>
            </h1>

            {/* Subtitle */}
            <p className="text-xl md:text-2xl text-white/70 mb-10 max-w-2xl mx-auto leading-relaxed">
              {t('hero.subtitle')}
            </p>

            {/* CTA Buttons */}
            <div className="flex flex-col sm:flex-row gap-4 justify-center mb-12">
              <Link href="/fortune/saju">
                <Button size="lg" className="bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white border-0 px-8 py-6 text-lg rounded-xl shadow-lg shadow-purple-500/25">
                  <Gift className="mr-2 h-5 w-5" />
                  {t('hero.freeCta')}
                </Button>
              </Link>
              <Button size="lg" variant="outline" className="border-white/30 text-white hover:bg-white/10 px-8 py-6 text-lg rounded-xl backdrop-blur-sm">
                <Play className="mr-2 h-5 w-5" />
                {t('hero.demoCta')}
              </Button>
            </div>

            {/* Stats */}
            <div className="flex flex-wrap justify-center gap-8 md:gap-16">
              {stats.map((stat, index) => (
                <div key={index} className="text-center">
                  <div className="text-3xl md:text-4xl font-bold text-white mb-1">
                    {stat.value}
                  </div>
                  <div className="text-sm text-white/60">{t(`hero.stats.${stat.labelKey}`)}</div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Bottom Gradient Fade */}
        <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-background to-transparent" />
      </section>

      {/* Services Section */}
      <section className="container mx-auto px-4 py-16 md:py-24">
        {/* Section Header */}
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">{t('services.title')}</h2>
          <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
            {t('services.subtitle')}
          </p>
        </div>

        {/* Category Tabs */}
        <div className="flex justify-center mb-10">
          <Tabs value={activeCategory} onValueChange={(v) => setActiveCategory(v as CategoryFilter)} className="w-full max-w-lg">
            <TabsList className="grid grid-cols-4 w-full h-12 bg-muted/50 p-1 rounded-xl">
              <TabsTrigger value="all" className="rounded-lg data-[state=active]:bg-background data-[state=active]:shadow-sm">
                {t('services.filters.all')}
              </TabsTrigger>
              <TabsTrigger value="free" className="rounded-lg data-[state=active]:bg-background data-[state=active]:shadow-sm">
                <Gift className="mr-1.5 h-4 w-4" />
                {t('services.filters.free')}
              </TabsTrigger>
              <TabsTrigger value="premium" className="rounded-lg data-[state=active]:bg-background data-[state=active]:shadow-sm">
                <Crown className="mr-1.5 h-4 w-4" />
                {t('services.filters.premium')}
              </TabsTrigger>
              <TabsTrigger value="recommended" className="rounded-lg data-[state=active]:bg-background data-[state=active]:shadow-sm">
                <Star className="mr-1.5 h-4 w-4" />
                {t('services.filters.recommended')}
              </TabsTrigger>
            </TabsList>
          </Tabs>
        </div>

        {/* Services Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredServices.map((service) => (
            <ServiceCard key={service.id} service={service} />
          ))}
        </div>
      </section>

      {/* Premium Benefits Section */}
      <section className="bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 text-white py-16 md:py-24">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <div className="text-center mb-12">
              <Badge className="mb-4 bg-white/10 border-white/20">
                <Crown className="mr-2 h-4 w-4 text-yellow-400" />
                Premium
              </Badge>
              <h2 className="text-3xl md:text-4xl font-bold mb-4">{t('premium.title')}</h2>
              <p className="text-white/70 text-lg">{t('premium.subtitle')}</p>
            </div>

            <div className="grid md:grid-cols-3 gap-6">
              {['detailedReport', 'expertAdvice', 'unlimitedAccess'].map((feature, index) => (
                <Card key={feature} className="bg-white/5 border-white/10 backdrop-blur-sm">
                  <CardContent className="p-6 text-center">
                    <div className="w-12 h-12 mx-auto mb-4 rounded-full bg-gradient-to-r from-purple-500 to-pink-500 flex items-center justify-center">
                      <CheckCircle className="h-6 w-6 text-white" />
                    </div>
                    <h3 className="text-lg font-semibold text-white mb-2">
                      {t(`premium.features.${feature}.title`)}
                    </h3>
                    <p className="text-white/60 text-sm">
                      {t(`premium.features.${feature}.description`)}
                    </p>
                  </CardContent>
                </Card>
              ))}
            </div>

            <div className="text-center mt-10">
              <Link href="/pricing">
                <Button size="lg" className="bg-white text-purple-900 hover:bg-white/90 px-8">
                  {t('premium.cta')}
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Quick Start CTA */}
      <section className="container mx-auto px-4 py-16 md:py-24">
        <Card className="overflow-hidden border-0 shadow-2xl">
          <div className="grid md:grid-cols-2">
            <div className="p-8 md:p-12 bg-gradient-to-br from-purple-600 to-pink-600 text-white">
              <Badge className="mb-4 bg-white/20 border-0">
                <Clock className="mr-2 h-4 w-4" />
                {t('quickStart.badge')}
              </Badge>
              <h2 className="text-3xl md:text-4xl font-bold mb-4">{t('quickStart.title')}</h2>
              <p className="text-white/80 mb-6 text-lg">{t('quickStart.description')}</p>
              <ul className="space-y-3 mb-8">
                {['step1', 'step2', 'step3'].map((step) => (
                  <li key={step} className="flex items-center gap-3">
                    <CheckCircle className="h-5 w-5 text-white/80" />
                    <span>{t(`quickStart.steps.${step}`)}</span>
                  </li>
                ))}
              </ul>
              <Link href="/fortune/saju">
                <Button size="lg" className="bg-white text-purple-700 hover:bg-white/90">
                  {t('quickStart.cta')}
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </Link>
            </div>
            <div className="p-8 md:p-12 flex flex-col justify-center bg-gradient-to-br from-purple-50 to-pink-50 dark:from-purple-950/20 dark:to-pink-950/20">
              <div className="space-y-4">
                {['accuracy', 'speed', 'privacy'].map((item) => (
                  <div key={item} className="flex items-start gap-4">
                    <div className="w-10 h-10 rounded-full bg-gradient-to-r from-purple-500 to-pink-500 flex items-center justify-center flex-shrink-0">
                      <CheckCircle className="h-5 w-5 text-white" />
                    </div>
                    <div>
                      <h3 className="font-semibold mb-1">{t(`quickStart.benefits.${item}.title`)}</h3>
                      <p className="text-sm text-muted-foreground">{t(`quickStart.benefits.${item}.description`)}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </Card>
      </section>
    </div>
  );
}

function ServiceCard({ service }: { service: SajuService }) {
  const t = useTranslations('saju.services.items');
  const Icon = service.icon;

  return (
    <Link href={service.href}>
      <Card className="group h-full overflow-hidden cursor-pointer transition-all duration-300 hover:shadow-xl hover:-translate-y-1 border-0 shadow-lg">
        {/* Card Header with Gradient */}
        <div className={`relative h-40 bg-gradient-to-br ${service.gradient} p-6`}>
          {/* Badge */}
          {service.badge && (
            <Badge className="absolute top-4 right-4 bg-white/20 text-white border-0 backdrop-blur-sm">
              {service.badge}
            </Badge>
          )}

          {/* Category Badge */}
          <Badge
            className={`absolute top-4 left-4 border-0 ${
              service.category === 'free'
                ? 'bg-green-500/90 text-white'
                : 'bg-amber-500/90 text-white'
            }`}
          >
            {service.category === 'free' ? (
              <>
                <Gift className="mr-1 h-3 w-3" />
                FREE
              </>
            ) : (
              <>
                <Crown className="mr-1 h-3 w-3" />
                PREMIUM
              </>
            )}
          </Badge>

          {/* Icon */}
          <div className="absolute bottom-4 left-6">
            <div className="w-14 h-14 rounded-2xl bg-white/20 backdrop-blur-sm flex items-center justify-center group-hover:scale-110 transition-transform">
              <Icon className="h-7 w-7 text-white" />
            </div>
          </div>
        </div>

        {/* Card Content */}
        <CardContent className="p-6">
          <h3 className="text-xl font-bold mb-2 group-hover:text-primary transition-colors">
            {t(`${service.id}.title`)}
          </h3>
          <p className="text-muted-foreground text-sm mb-4 line-clamp-2">
            {t(`${service.id}.description`)}
          </p>

          {/* Rating */}
          <div className="flex items-center gap-2 mb-4">
            <div className="flex items-center gap-1">
              {[...Array(5)].map((_, i) => (
                <Star
                  key={i}
                  className={`h-4 w-4 ${
                    i < Math.floor(service.rating)
                      ? 'text-yellow-400 fill-yellow-400'
                      : 'text-gray-300'
                  }`}
                />
              ))}
            </div>
            <span className="text-sm font-medium">{service.rating}</span>
            <span className="text-sm text-muted-foreground">
              ({service.reviewCount.toLocaleString()})
            </span>
          </div>

          {/* Points & CTA */}
          <div className="flex items-center justify-between">
            <div>
              {service.points ? (
                <div className="flex items-center gap-2">
                  <div className="flex items-center gap-1">
                    <Coins className="h-5 w-5 text-amber-500" />
                    <span className="text-2xl font-bold text-primary">
                      {service.points}
                    </span>
                  </div>
                  {service.originalPoints && (
                    <span className="text-sm text-muted-foreground line-through">
                      {service.originalPoints}P
                    </span>
                  )}
                </div>
              ) : (
                <div className="flex items-center gap-1">
                  <Gift className="h-5 w-5 text-green-500" />
                  <span className="text-xl font-bold text-green-600">무료</span>
                </div>
              )}
            </div>
            <Button size="sm" className="group-hover:bg-primary group-hover:text-white transition-colors">
              시작하기
              <ArrowRight className="ml-1 h-4 w-4 group-hover:translate-x-1 transition-transform" />
            </Button>
          </div>
        </CardContent>
      </Card>
    </Link>
  );
}
