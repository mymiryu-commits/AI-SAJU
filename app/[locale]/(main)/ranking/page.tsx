import { Suspense } from 'react';
import { useTranslations } from 'next-intl';
import { setRequestLocale } from 'next-intl/server';
import { Link } from '@/i18n/routing';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  Star,
  ExternalLink,
  TrendingUp,
  MessageSquare,
  Image as ImageIcon,
  Video,
  Code,
  Mic,
  FileText,
  Zap,
} from 'lucide-react';

// Mock data - would come from Supabase in production
const aiTools = [
  {
    id: '1',
    slug: 'chatgpt',
    name: 'ChatGPT',
    category: 'chat',
    description: 'OpenAI의 대화형 AI. GPT-4o 기반으로 자연스러운 대화와 다양한 작업 수행이 가능합니다.',
    logo: '/logos/chatgpt.svg',
    website: 'https://chat.openai.com',
    pricingType: 'freemium',
    totalScore: 95,
    reviewCount: 1250,
    isFeatured: true,
    trend: 'up',
  },
  {
    id: '2',
    slug: 'claude',
    name: 'Claude',
    category: 'chat',
    description: 'Anthropic의 AI 어시스턴트. 긴 문맥 처리와 분석적 사고에 강점이 있습니다.',
    logo: '/logos/claude.svg',
    website: 'https://claude.ai',
    pricingType: 'freemium',
    totalScore: 93,
    reviewCount: 890,
    isFeatured: true,
    trend: 'up',
  },
  {
    id: '3',
    slug: 'midjourney',
    name: 'Midjourney',
    category: 'image',
    description: '최고 품질의 AI 이미지 생성. 예술적이고 창의적인 이미지 제작에 특화되어 있습니다.',
    logo: '/logos/midjourney.svg',
    website: 'https://midjourney.com',
    pricingType: 'paid',
    totalScore: 98,
    reviewCount: 2100,
    isFeatured: true,
    trend: 'stable',
  },
  {
    id: '4',
    slug: 'gemini',
    name: 'Gemini',
    category: 'chat',
    description: 'Google의 멀티모달 AI. 텍스트, 이미지, 코드를 함께 처리할 수 있습니다.',
    logo: '/logos/gemini.svg',
    website: 'https://gemini.google.com',
    pricingType: 'freemium',
    totalScore: 90,
    reviewCount: 780,
    isFeatured: true,
    trend: 'up',
  },
  {
    id: '5',
    slug: 'runway',
    name: 'Runway',
    category: 'video',
    description: '영상 생성 및 편집 AI. Gen-3로 고품질 AI 영상을 만들 수 있습니다.',
    logo: '/logos/runway.svg',
    website: 'https://runway.ml',
    pricingType: 'freemium',
    totalScore: 90,
    reviewCount: 650,
    isFeatured: false,
    trend: 'up',
  },
  {
    id: '6',
    slug: 'github-copilot',
    name: 'GitHub Copilot',
    category: 'code',
    description: 'AI 코딩 어시스턴트. 코드 자동완성과 제안 기능을 제공합니다.',
    logo: '/logos/copilot.svg',
    website: 'https://github.com/features/copilot',
    pricingType: 'paid',
    totalScore: 90,
    reviewCount: 1560,
    isFeatured: true,
    trend: 'stable',
  },
  {
    id: '7',
    slug: 'elevenlabs',
    name: 'ElevenLabs',
    category: 'voice',
    description: '고품질 AI 음성 합성. 자연스러운 음성 생성과 음성 복제가 가능합니다.',
    logo: '/logos/elevenlabs.svg',
    website: 'https://elevenlabs.io',
    pricingType: 'freemium',
    totalScore: 95,
    reviewCount: 720,
    isFeatured: true,
    trend: 'up',
  },
  {
    id: '8',
    slug: 'stable-diffusion',
    name: 'Stable Diffusion',
    category: 'image',
    description: '오픈소스 이미지 생성 AI. 로컬 실행 가능하며 커스터마이징이 자유롭습니다.',
    logo: '/logos/sd.svg',
    website: 'https://stability.ai',
    pricingType: 'free',
    totalScore: 85,
    reviewCount: 1890,
    isFeatured: false,
    trend: 'stable',
  },
];

const categories = [
  { key: 'all', icon: Zap },
  { key: 'chat', icon: MessageSquare },
  { key: 'image', icon: ImageIcon },
  { key: 'video', icon: Video },
  { key: 'code', icon: Code },
  { key: 'voice', icon: Mic },
  { key: 'writing', icon: FileText },
];

export default async function RankingPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Header */}
      <div className="mb-8">
        <RankingHeader />
      </div>

      {/* Filters & Content */}
      <Suspense fallback={<div>Loading...</div>}>
        <RankingContent locale={locale} />
      </Suspense>
    </div>
  );
}

function RankingHeader() {
  const t = useTranslations('ranking');
  return (
    <div>
      <h1 className="text-3xl md:text-4xl font-bold mb-2">{t('title')}</h1>
      <p className="text-muted-foreground">{t('subtitle')}</p>
    </div>
  );
}

function RankingContent({ locale }: { locale: string }) {
  const t = useTranslations('ranking');
  const tFilters = useTranslations('ranking.filters');
  const tCategories = useTranslations('ranking.categories');

  return (
    <Tabs defaultValue="all" className="space-y-6">
      {/* Category Tabs */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <TabsList className="w-full md:w-auto overflow-x-auto">
          {categories.map((cat) => {
            const Icon = cat.icon;
            return (
              <TabsTrigger key={cat.key} value={cat.key} className="gap-2">
                <Icon className="h-4 w-4" />
                <span className="hidden sm:inline">{tCategories(cat.key)}</span>
              </TabsTrigger>
            );
          })}
        </TabsList>

        {/* Filters */}
        <div className="flex gap-2">
          <Select defaultValue="score">
            <SelectTrigger className="w-[140px]">
              <SelectValue placeholder={tFilters('sort')} />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="score">{tFilters('sortByScore')}</SelectItem>
              <SelectItem value="popular">{tFilters('sortByPopular')}</SelectItem>
              <SelectItem value="recent">{tFilters('sortByRecent')}</SelectItem>
            </SelectContent>
          </Select>
          <Select defaultValue="all">
            <SelectTrigger className="w-[140px]">
              <SelectValue placeholder={tFilters('pricing')} />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">{tFilters('pricingAll')}</SelectItem>
              <SelectItem value="free">{tFilters('pricingFree')}</SelectItem>
              <SelectItem value="freemium">{tFilters('pricingFreemium')}</SelectItem>
              <SelectItem value="paid">{tFilters('pricingPaid')}</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* Tool Cards */}
      {categories.map((cat) => (
        <TabsContent key={cat.key} value={cat.key} className="space-y-4">
          <div className="grid gap-4">
            {aiTools
              .filter(
                (tool) => cat.key === 'all' || tool.category === cat.key
              )
              .sort((a, b) => b.totalScore - a.totalScore)
              .map((tool, index) => (
                <ToolCard key={tool.id} tool={tool} rank={index + 1} locale={locale} />
              ))}
          </div>
        </TabsContent>
      ))}
    </Tabs>
  );
}

function ToolCard({
  tool,
  rank,
  locale,
}: {
  tool: (typeof aiTools)[0];
  rank: number;
  locale: string;
}) {
  const t = useTranslations('ranking.card');

  const getPricingBadge = (type: string) => {
    switch (type) {
      case 'free':
        return <Badge variant="success">Free</Badge>;
      case 'freemium':
        return <Badge variant="secondary">Freemium</Badge>;
      case 'paid':
        return <Badge variant="outline">Paid</Badge>;
      default:
        return null;
    }
  };

  return (
    <Card className="card-hover">
      <CardContent className="p-4 md:p-6">
        <div className="flex items-start gap-4">
          {/* Rank */}
          <div className="flex-shrink-0 w-8 h-8 md:w-10 md:h-10 rounded-full bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center text-white font-bold text-sm md:text-base">
            {rank}
          </div>

          {/* Logo */}
          <div className="flex-shrink-0 w-12 h-12 md:w-16 md:h-16 rounded-lg bg-muted flex items-center justify-center text-2xl font-bold">
            {tool.name.charAt(0)}
          </div>

          {/* Info */}
          <div className="flex-1 min-w-0">
            <div className="flex flex-wrap items-center gap-2 mb-1">
              <h3 className="font-semibold text-lg">{tool.name}</h3>
              {tool.isFeatured && (
                <Badge className="bg-yellow-500 text-white">Featured</Badge>
              )}
              {getPricingBadge(tool.pricingType)}
              {tool.trend === 'up' && (
                <TrendingUp className="h-4 w-4 text-green-500" />
              )}
            </div>
            <p className="text-sm text-muted-foreground line-clamp-2 mb-2">
              {tool.description}
            </p>
            <div className="flex items-center gap-4 text-sm">
              <div className="flex items-center gap-1">
                <Star className="h-4 w-4 text-yellow-500 fill-yellow-500" />
                <span className="font-medium">{tool.totalScore}</span>
              </div>
              <span className="text-muted-foreground">
                {tool.reviewCount.toLocaleString()} {t('reviews')}
              </span>
            </div>
          </div>

          {/* Actions */}
          <div className="flex-shrink-0 flex flex-col gap-2">
            <Link href={`/ranking/${tool.category}/${tool.slug}`}>
              <Button size="sm" variant="outline" className="w-full">
                Details
              </Button>
            </Link>
            <a href={tool.website} target="_blank" rel="noopener noreferrer">
              <Button size="sm" className="w-full gap-1">
                {t('visit')}
                <ExternalLink className="h-3 w-3" />
              </Button>
            </a>
          </div>
        </div>

        {/* Score bar */}
        <div className="mt-4 pt-4 border-t">
          <div className="flex items-center gap-4">
            <span className="text-sm text-muted-foreground w-16">{t('score')}</span>
            <div className="flex-1 h-2 bg-muted rounded-full overflow-hidden">
              <div
                className="h-full bg-gradient-to-r from-purple-500 to-pink-500 transition-all"
                style={{ width: `${tool.totalScore}%` }}
              />
            </div>
            <span className="text-sm font-medium w-12 text-right">
              {tool.totalScore}/100
            </span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
