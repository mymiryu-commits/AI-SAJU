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
  Clock,
  Zap,
  ArrowRight,
  CheckCircle,
} from 'lucide-react';

const fortuneServices = [
  {
    key: 'saju',
    icon: Zap,
    color: 'bg-purple-500',
    href: '/fortune/saju',
    free: true,
  },
  {
    key: 'face',
    icon: Star,
    color: 'bg-blue-500',
    href: '/fortune/face',
    free: false,
  },
  {
    key: 'astrology',
    icon: Sparkles,
    color: 'bg-pink-500',
    href: '/fortune/astrology',
    free: true,
  },
  {
    key: 'tarot',
    icon: Clock,
    color: 'bg-orange-500',
    href: '/fortune/tarot',
    free: true,
  },
  {
    key: 'compatibility',
    icon: Heart,
    color: 'bg-red-500',
    href: '/fortune/compatibility',
    free: false,
  },
  {
    key: 'group',
    icon: Users,
    color: 'bg-green-500',
    href: '/fortune/group',
    free: false,
  },
];

const premiumFeatures = [
  'Detailed analysis reports',
  'PDF download available',
  'Voice narration',
  'Monthly predictions',
  'Expert consultation',
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
      {/* Hero Section */}
      <section className="fortune-gradient text-white py-16 md:py-24">
        <div className="container mx-auto px-4">
          <FortuneHero />
        </div>
      </section>

      {/* Services Grid */}
      <section className="container mx-auto px-4 py-16">
        <FortuneServices locale={locale} />
      </section>

      {/* Premium CTA */}
      <section className="bg-muted/50 py-16">
        <div className="container mx-auto px-4">
          <PremiumSection locale={locale} />
        </div>
      </section>

      {/* Daily Fortune Preview */}
      <section className="container mx-auto px-4 py-16">
        <DailyFortunePreview locale={locale} />
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
        AI Fortune Services
      </Badge>
      <h1 className="text-4xl md:text-5xl font-bold mb-4">{t('title')}</h1>
      <p className="text-xl text-white/80 mb-8">{t('subtitle')}</p>
      <div className="flex flex-wrap justify-center gap-4">
        <Link href="/fortune/free">
          <Button size="lg" className="bg-white text-purple-700 hover:bg-white/90">
            {t('free.cta')}
            <ArrowRight className="ml-2 h-4 w-4" />
          </Button>
        </Link>
        <Link href="/fortune/saju">
          <Button
            size="lg"
            variant="outline"
            className="border-white/50 text-white hover:bg-white/10"
          >
            {t('categories.saju')}
          </Button>
        </Link>
      </div>
    </div>
  );
}

function FortuneServices({ locale }: { locale: string }) {
  const t = useTranslations('fortune.categories');
  return (
    <>
      <div className="text-center mb-12">
        <h2 className="text-3xl font-bold mb-4">Our Services</h2>
        <p className="text-muted-foreground max-w-2xl mx-auto">
          Choose from our variety of AI-powered fortune telling services
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
                    Free
                  </Badge>
                )}
                <CardHeader>
                  <div className={`w-12 h-12 rounded-lg ${service.color} flex items-center justify-center mb-4`}>
                    <Icon className="h-6 w-6 text-white" />
                  </div>
                  <CardTitle>{t(service.key)}</CardTitle>
                  <CardDescription>
                    Discover your fortune with AI-powered {service.key} analysis
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <Button variant="outline" className="w-full group">
                    Try Now
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

function PremiumSection({ locale }: { locale: string }) {
  const t = useTranslations('fortune.premium');
  return (
    <Card className="overflow-hidden">
      <div className="grid md:grid-cols-2">
        <div className="fortune-gradient p-8 md:p-12 text-white">
          <Badge className="mb-4 bg-white/20 text-white">Premium</Badge>
          <h2 className="text-3xl font-bold mb-4">{t('title')}</h2>
          <p className="text-white/80 mb-6">
            Get the most comprehensive fortune analysis with our premium services
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
              View Plans
              <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
          </Link>
        </div>
        <CardContent className="p-8 md:p-12 flex flex-col justify-center bg-gradient-to-br from-purple-50 to-pink-50 dark:from-purple-950/20 dark:to-pink-950/20">
          <div className="text-center">
            <div className="text-5xl font-bold mb-2">
              <span className="text-muted-foreground text-xl">from</span>{' '}
              <span className="text-primary">$3.99</span>
              <span className="text-muted-foreground text-xl">/mo</span>
            </div>
            <p className="text-muted-foreground mb-6">
              Start with Basic plan
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

function DailyFortunePreview({ locale }: { locale: string }) {
  const t = useTranslations('fortune.daily');
  return (
    <div className="text-center">
      <h2 className="text-3xl font-bold mb-4">{t('title')}</h2>
      <p className="text-muted-foreground mb-8">{t('todayFortune')}</p>
      <Card className="max-w-md mx-auto">
        <CardContent className="p-8">
          <div className="grid grid-cols-2 gap-4 mb-6">
            <div className="text-center p-4 rounded-lg bg-muted">
              <div className="text-3xl font-bold text-primary">85</div>
              <div className="text-sm text-muted-foreground">{t('scores.overall')}</div>
            </div>
            <div className="text-center p-4 rounded-lg bg-muted">
              <div className="text-3xl font-bold text-green-500">92</div>
              <div className="text-sm text-muted-foreground">{t('scores.wealth')}</div>
            </div>
            <div className="text-center p-4 rounded-lg bg-muted">
              <div className="text-3xl font-bold text-pink-500">78</div>
              <div className="text-sm text-muted-foreground">{t('scores.love')}</div>
            </div>
            <div className="text-center p-4 rounded-lg bg-muted">
              <div className="text-3xl font-bold text-blue-500">88</div>
              <div className="text-sm text-muted-foreground">{t('scores.career')}</div>
            </div>
          </div>
          <Link href="/fortune/free">
            <Button className="w-full">
              {t('checkin')}
              <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
          </Link>
        </CardContent>
      </Card>
    </div>
  );
}
