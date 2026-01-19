import { useTranslations } from 'next-intl';
import { setRequestLocale } from 'next-intl/server';
import { Link } from '@/i18n/routing';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import {
  ArrowRight,
  Sparkles,
  TrendingUp,
  Star,
  Zap,
  MessageSquare,
  Image as ImageIcon,
  Video,
  Code,
} from 'lucide-react';
import { createClient } from '@/lib/supabase/server';
import Image from 'next/image';
import type { Database } from '@/types/database';

type SiteSettingsRow = Database['public']['Tables']['site_settings']['Row'];

interface HeroSettings {
  background_image_url: string | null;
  content_image_url: string | null;
  use_gradient: boolean;
  gradient_from: string;
  gradient_via: string;
  gradient_to: string;
}

const defaultHeroSettings: HeroSettings = {
  background_image_url: null,
  content_image_url: null,
  use_gradient: true,
  gradient_from: '#9333ea',
  gradient_via: '#7e22ce',
  gradient_to: '#db2777',
};

const categories = [
  { key: 'chat', icon: MessageSquare, color: 'bg-blue-500' },
  { key: 'image', icon: ImageIcon, color: 'bg-purple-500' },
  { key: 'video', icon: Video, color: 'bg-pink-500' },
  { key: 'code', icon: Code, color: 'bg-green-500' },
];

const topTools = [
  {
    name: 'ChatGPT',
    category: 'chat',
    score: 95,
    trend: 'up',
    badge: 'TOP 1',
  },
  {
    name: 'Claude',
    category: 'chat',
    score: 93,
    trend: 'up',
    badge: 'TOP 2',
  },
  {
    name: 'Midjourney',
    category: 'image',
    score: 98,
    trend: 'stable',
    badge: 'TOP 1',
  },
  {
    name: 'Runway',
    category: 'video',
    score: 90,
    trend: 'up',
    badge: 'HOT',
  },
];

async function getHeroSettings(): Promise<HeroSettings> {
  try {
    const supabase = await createClient();
    const { data, error } = await supabase
      .from('site_settings')
      .select('value')
      .eq('key', 'hero_settings')
      .single<Pick<SiteSettingsRow, 'value'>>();

    if (error || !data) {
      return defaultHeroSettings;
    }

    return data.value as unknown as HeroSettings;
  } catch (error) {
    console.error('Error fetching hero settings:', error);
    return defaultHeroSettings;
  }
}

export default async function HomePage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);

  const heroSettings = await getHeroSettings();

  return (
    <div className="flex flex-col">
      {/* Hero Section */}
      <HeroSection heroSettings={heroSettings} locale={locale} />

      {/* Categories Section */}
      <section className="container mx-auto px-4 py-16">
        <CategoriesSection locale={locale} />
      </section>

      {/* Top AI Tools Section */}
      <section className="bg-muted/50 py-16">
        <div className="container mx-auto px-4">
          <TopToolsSection locale={locale} tools={topTools} />
        </div>
      </section>

      {/* Fortune CTA Section */}
      <section className="container mx-auto px-4 py-16">
        <FortuneCTASection locale={locale} />
      </section>
    </div>
  );
}

function HeroSection({
  heroSettings,
  locale,
}: {
  heroSettings: HeroSettings;
  locale: string;
}) {
  const hasBackgroundImage = !!heroSettings.background_image_url;
  const hasContentImage = !!heroSettings.content_image_url;

  // Build background style
  const backgroundStyle: React.CSSProperties = hasBackgroundImage
    ? {}
    : heroSettings.use_gradient
    ? {
        background: `linear-gradient(to bottom right, ${heroSettings.gradient_from}, ${heroSettings.gradient_via}, ${heroSettings.gradient_to})`,
      }
    : {
        background: `linear-gradient(to bottom right, #9333ea, #7e22ce, #db2777)`,
      };

  return (
    <section
      className="relative overflow-hidden text-white"
      style={backgroundStyle}
    >
      {/* Background Image */}
      {hasBackgroundImage && (
        <div className="absolute inset-0">
          <Image
            src={heroSettings.background_image_url!}
            alt="Hero background"
            fill
            className="object-cover"
            priority
          />
          <div className="absolute inset-0 bg-black/40" />
        </div>
      )}

      {/* Grid Pattern Overlay */}
      <div className="absolute inset-0 bg-[url('/grid.svg')] opacity-10" />

      <div className="container mx-auto px-4 py-20 md:py-32">
        <div
          className={`relative z-10 ${
            hasContentImage
              ? 'grid md:grid-cols-2 gap-8 items-center'
              : 'max-w-3xl'
          }`}
        >
          {/* Text Content */}
          <div>
            <Badge className="mb-4 bg-white/20 text-white hover:bg-white/30">
              <Sparkles className="mr-1 h-3 w-3" />
              2025 AI Tools Ranking
            </Badge>
            <HeroContent locale={locale} />
          </div>

          {/* Content Image */}
          {hasContentImage && (
            <div className="relative hidden md:block">
              <div className="relative w-full aspect-square max-w-md mx-auto">
                <Image
                  src={heroSettings.content_image_url!}
                  alt="Hero content"
                  fill
                  className="object-contain drop-shadow-2xl"
                  priority
                />
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Decorative elements */}
      <div className="absolute right-0 top-1/2 -translate-y-1/2 w-96 h-96 bg-white/10 rounded-full blur-3xl" />
      <div className="absolute left-1/4 bottom-0 w-64 h-64 bg-pink-500/20 rounded-full blur-3xl" />
    </section>
  );
}

function HeroContent({ locale }: { locale: string }) {
  const t = useTranslations('home.hero');
  return (
    <>
      <h1 className="text-4xl md:text-6xl font-bold mb-6 leading-tight">
        {t('title')}
      </h1>
      <p className="text-xl md:text-2xl mb-8 text-white/80">{t('subtitle')}</p>
      <div className="flex flex-wrap gap-4">
        <Link href="/ranking">
          <Button size="lg" className="bg-white text-purple-700 hover:bg-white/90">
            {t('cta')}
            <ArrowRight className="ml-2 h-4 w-4" />
          </Button>
        </Link>
        <Link href="/fortune/free">
          <Button
            size="lg"
            variant="outline"
            className="border-white/50 text-white hover:bg-white/10"
          >
            <Sparkles className="mr-2 h-4 w-4" />
            AI Fortune
          </Button>
        </Link>
      </div>
    </>
  );
}

function CategoriesSection({ locale }: { locale: string }) {
  const t = useTranslations('ranking.categories');
  return (
    <>
      <div className="flex items-center justify-between mb-8">
        <h2 className="text-2xl md:text-3xl font-bold">AI Categories</h2>
        <Link href="/ranking" className="text-primary hover:underline text-sm">
          View All <ArrowRight className="inline h-4 w-4" />
        </Link>
      </div>
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {categories.map((cat) => {
          const Icon = cat.icon;
          return (
            <Link key={cat.key} href={`/ranking/${cat.key}`}>
              <Card className="card-hover cursor-pointer">
                <CardContent className="flex items-center gap-4 p-6">
                  <div className={`p-3 rounded-lg ${cat.color}`}>
                    <Icon className="h-6 w-6 text-white" />
                  </div>
                  <div>
                    <h3 className="font-semibold">{t(cat.key)}</h3>
                    <p className="text-sm text-muted-foreground">
                      View rankings
                    </p>
                  </div>
                </CardContent>
              </Card>
            </Link>
          );
        })}
      </div>
    </>
  );
}

function TopToolsSection({
  locale,
  tools,
}: {
  locale: string;
  tools: typeof topTools;
}) {
  const t = useTranslations('home.sections');
  return (
    <>
      <div className="flex items-center justify-between mb-8">
        <h2 className="text-2xl md:text-3xl font-bold">{t('topAI')}</h2>
        <Link href="/ranking" className="text-primary hover:underline text-sm">
          View All <ArrowRight className="inline h-4 w-4" />
        </Link>
      </div>
      <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4">
        {tools.map((tool, index) => (
          <Card key={tool.name} className="card-hover">
            <CardHeader className="pb-2">
              <div className="flex items-center justify-between">
                <Badge
                  variant={index === 0 ? 'default' : 'secondary'}
                  className={index === 0 ? 'bg-yellow-500' : ''}
                >
                  {tool.badge}
                </Badge>
                {tool.trend === 'up' && (
                  <TrendingUp className="h-4 w-4 text-green-500" />
                )}
              </div>
            </CardHeader>
            <CardContent>
              <div className="flex items-center gap-3 mb-3">
                <div className="w-12 h-12 rounded-lg bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center text-white font-bold">
                  {tool.name.charAt(0)}
                </div>
                <div>
                  <h3 className="font-semibold">{tool.name}</h3>
                  <p className="text-sm text-muted-foreground capitalize">
                    {tool.category}
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <div className="flex-1 h-2 bg-muted rounded-full overflow-hidden">
                  <div
                    className="h-full bg-gradient-to-r from-purple-500 to-pink-500"
                    style={{ width: `${tool.score}%` }}
                  />
                </div>
                <span className="text-sm font-medium">{tool.score}</span>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </>
  );
}

function FortuneCTASection({ locale }: { locale: string }) {
  const t = useTranslations('fortune');
  return (
    <Card className="overflow-hidden">
      <div className="grid md:grid-cols-2">
        <div className="fortune-gradient p-8 md:p-12 text-white">
          <Badge className="mb-4 bg-white/20 text-white">
            <Sparkles className="mr-1 h-3 w-3" />
            AI Fortune
          </Badge>
          <h2 className="text-2xl md:text-3xl font-bold mb-4">{t('title')}</h2>
          <p className="text-white/80 mb-6">{t('subtitle')}</p>
          <Link href="/fortune/free">
            <Button className="bg-white text-purple-700 hover:bg-white/90">
              {t('free.cta')}
              <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
          </Link>
        </div>
        <CardContent className="p-8 md:p-12 flex flex-col justify-center">
          <h3 className="font-semibold mb-4">Services</h3>
          <div className="grid grid-cols-2 gap-3">
            <Link href="/fortune/saju">
              <div className="p-3 rounded-lg border hover:border-primary transition-colors cursor-pointer">
                <Zap className="h-5 w-5 text-primary mb-2" />
                <span className="text-sm font-medium">
                  {t('categories.saju')}
                </span>
              </div>
            </Link>
            <Link href="/fortune/face">
              <div className="p-3 rounded-lg border hover:border-primary transition-colors cursor-pointer">
                <Star className="h-5 w-5 text-primary mb-2" />
                <span className="text-sm font-medium">
                  {t('categories.face')}
                </span>
              </div>
            </Link>
            <Link href="/fortune/astrology">
              <div className="p-3 rounded-lg border hover:border-primary transition-colors cursor-pointer">
                <Sparkles className="h-5 w-5 text-primary mb-2" />
                <span className="text-sm font-medium">
                  {t('categories.astrology')}
                </span>
              </div>
            </Link>
            <Link href="/fortune/compatibility">
              <div className="p-3 rounded-lg border hover:border-primary transition-colors cursor-pointer">
                <TrendingUp className="h-5 w-5 text-primary mb-2" />
                <span className="text-sm font-medium">
                  {t('categories.compatibility')}
                </span>
              </div>
            </Link>
          </div>
        </CardContent>
      </div>
    </Card>
  );
}
