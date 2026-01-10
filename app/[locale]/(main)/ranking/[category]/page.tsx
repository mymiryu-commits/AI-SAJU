'use client';

import { useTranslations } from 'next-intl';
import { useParams } from 'next/navigation';
import { Link } from '@/i18n/routing';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Button } from '@/components/ui/button';
import {
  MessageSquare,
  Image,
  Video,
  Code,
  Mic,
  FileText,
  Palette,
  Zap,
  Search,
  Star,
  ExternalLink,
  ArrowLeft,
} from 'lucide-react';

const CATEGORIES: Record<string, { icon: typeof MessageSquare; color: string }> = {
  chat: { icon: MessageSquare, color: 'text-blue-500' },
  image: { icon: Image, color: 'text-purple-500' },
  video: { icon: Video, color: 'text-red-500' },
  code: { icon: Code, color: 'text-green-500' },
  voice: { icon: Mic, color: 'text-yellow-500' },
  writing: { icon: FileText, color: 'text-orange-500' },
  design: { icon: Palette, color: 'text-pink-500' },
  automation: { icon: Zap, color: 'text-cyan-500' },
  search: { icon: Search, color: 'text-indigo-500' },
};

// Sample data for AI tools by category
const AI_TOOLS_BY_CATEGORY: Record<string, Array<{
  slug: string;
  name: string;
  description: string;
  logo: string;
  totalScore: number;
  scores: { quality: number; free: number; ux: number; value: number; updates: number };
  pricingType: 'free' | 'freemium' | 'paid';
  isFeatured: boolean;
}>> = {
  chat: [
    {
      slug: 'chatgpt',
      name: 'ChatGPT',
      description: 'OpenAI의 대화형 AI 모델',
      logo: '🤖',
      totalScore: 95,
      scores: { quality: 98, free: 85, ux: 95, value: 90, updates: 95 },
      pricingType: 'freemium',
      isFeatured: true,
    },
    {
      slug: 'claude',
      name: 'Claude',
      description: 'Anthropic의 안전한 AI 어시스턴트',
      logo: '🧠',
      totalScore: 94,
      scores: { quality: 97, free: 80, ux: 96, value: 92, updates: 90 },
      pricingType: 'freemium',
      isFeatured: true,
    },
    {
      slug: 'gemini',
      name: 'Gemini',
      description: 'Google의 멀티모달 AI',
      logo: '💎',
      totalScore: 92,
      scores: { quality: 95, free: 90, ux: 90, value: 88, updates: 92 },
      pricingType: 'freemium',
      isFeatured: false,
    },
    {
      slug: 'perplexity',
      name: 'Perplexity',
      description: 'AI 기반 검색 엔진',
      logo: '🔍',
      totalScore: 88,
      scores: { quality: 90, free: 85, ux: 88, value: 85, updates: 90 },
      pricingType: 'freemium',
      isFeatured: false,
    },
  ],
  image: [
    {
      slug: 'midjourney',
      name: 'Midjourney',
      description: '최고 품질의 AI 이미지 생성',
      logo: '🎨',
      totalScore: 96,
      scores: { quality: 99, free: 70, ux: 85, value: 88, updates: 95 },
      pricingType: 'paid',
      isFeatured: true,
    },
    {
      slug: 'dall-e',
      name: 'DALL-E 3',
      description: 'OpenAI의 이미지 생성 AI',
      logo: '🖼️',
      totalScore: 93,
      scores: { quality: 95, free: 80, ux: 95, value: 90, updates: 90 },
      pricingType: 'freemium',
      isFeatured: true,
    },
    {
      slug: 'stable-diffusion',
      name: 'Stable Diffusion',
      description: '오픈소스 이미지 생성 모델',
      logo: '🌊',
      totalScore: 90,
      scores: { quality: 88, free: 100, ux: 75, value: 95, updates: 92 },
      pricingType: 'free',
      isFeatured: false,
    },
  ],
  video: [
    {
      slug: 'runway',
      name: 'Runway',
      description: '차세대 비디오 AI 도구',
      logo: '🎬',
      totalScore: 92,
      scores: { quality: 95, free: 75, ux: 92, value: 85, updates: 95 },
      pricingType: 'freemium',
      isFeatured: true,
    },
    {
      slug: 'pika',
      name: 'Pika',
      description: '텍스트/이미지 to 비디오',
      logo: '⚡',
      totalScore: 88,
      scores: { quality: 90, free: 80, ux: 88, value: 85, updates: 90 },
      pricingType: 'freemium',
      isFeatured: false,
    },
  ],
  code: [
    {
      slug: 'github-copilot',
      name: 'GitHub Copilot',
      description: 'AI 코드 어시스턴트',
      logo: '👨‍💻',
      totalScore: 94,
      scores: { quality: 96, free: 70, ux: 95, value: 90, updates: 95 },
      pricingType: 'paid',
      isFeatured: true,
    },
    {
      slug: 'cursor',
      name: 'Cursor',
      description: 'AI 기반 코드 에디터',
      logo: '📝',
      totalScore: 93,
      scores: { quality: 95, free: 85, ux: 94, value: 92, updates: 90 },
      pricingType: 'freemium',
      isFeatured: true,
    },
  ],
  voice: [
    {
      slug: 'elevenlabs',
      name: 'ElevenLabs',
      description: '초고품질 AI 음성 합성',
      logo: '🎙️',
      totalScore: 95,
      scores: { quality: 98, free: 80, ux: 92, value: 88, updates: 95 },
      pricingType: 'freemium',
      isFeatured: true,
    },
    {
      slug: 'suno',
      name: 'Suno',
      description: 'AI 음악 생성',
      logo: '🎵',
      totalScore: 91,
      scores: { quality: 92, free: 85, ux: 90, value: 90, updates: 88 },
      pricingType: 'freemium',
      isFeatured: false,
    },
  ],
  writing: [
    {
      slug: 'notion-ai',
      name: 'Notion AI',
      description: 'AI 기반 문서 작성',
      logo: '📄',
      totalScore: 90,
      scores: { quality: 92, free: 75, ux: 95, value: 88, updates: 90 },
      pricingType: 'paid',
      isFeatured: true,
    },
    {
      slug: 'jasper',
      name: 'Jasper',
      description: '마케팅 콘텐츠 AI',
      logo: '✍️',
      totalScore: 87,
      scores: { quality: 88, free: 70, ux: 90, value: 85, updates: 88 },
      pricingType: 'paid',
      isFeatured: false,
    },
  ],
};

export default function CategoryPage() {
  const t = useTranslations();
  const params = useParams();
  const category = params.category as string;

  const categoryInfo = CATEGORIES[category];
  const tools = AI_TOOLS_BY_CATEGORY[category] || [];
  const Icon = categoryInfo?.icon || MessageSquare;

  const categoryNames: Record<string, string> = {
    chat: '대화형 AI',
    image: '이미지 생성',
    video: '영상 생성',
    code: '코딩',
    voice: '음성/음악',
    writing: '문서 작성',
    design: '디자인',
    automation: '자동화',
    search: '검색',
  };

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Back Button */}
      <Link href="/ranking" className="inline-flex items-center gap-2 text-muted-foreground hover:text-foreground mb-6">
        <ArrowLeft className="h-4 w-4" />
        전체 순위로 돌아가기
      </Link>

      {/* Category Header */}
      <div className="flex items-center gap-4 mb-8">
        <div className={`p-4 rounded-2xl bg-muted ${categoryInfo?.color || 'text-primary'}`}>
          <Icon className="h-8 w-8" />
        </div>
        <div>
          <h1 className="text-3xl font-bold">{categoryNames[category] || category}</h1>
          <p className="text-muted-foreground">
            {tools.length}개의 AI 도구가 등록되어 있습니다
          </p>
        </div>
      </div>

      {/* Tools Grid */}
      <div className="grid gap-6">
        {tools.map((tool, index) => (
          <Card key={tool.slug} className="overflow-hidden hover:shadow-lg transition-shadow">
            <CardContent className="p-6">
              <div className="flex items-start gap-6">
                {/* Rank */}
                <div className="flex-shrink-0 w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center">
                  <span className="text-xl font-bold text-primary">#{index + 1}</span>
                </div>

                {/* Logo */}
                <div className="text-4xl">{tool.logo}</div>

                {/* Info */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1">
                    <h3 className="text-xl font-semibold">{tool.name}</h3>
                    {tool.isFeatured && (
                      <Badge className="bg-yellow-100 text-yellow-800">
                        <Star className="h-3 w-3 mr-1" />
                        추천
                      </Badge>
                    )}
                    <Badge variant={
                      tool.pricingType === 'free' ? 'default' :
                      tool.pricingType === 'freemium' ? 'secondary' : 'outline'
                    }>
                      {tool.pricingType === 'free' ? '무료' :
                       tool.pricingType === 'freemium' ? '부분무료' : '유료'}
                    </Badge>
                  </div>
                  <p className="text-muted-foreground mb-4">{tool.description}</p>

                  {/* Score Bars */}
                  <div className="grid grid-cols-5 gap-4 text-sm">
                    <div>
                      <div className="flex justify-between mb-1">
                        <span className="text-muted-foreground">품질</span>
                        <span className="font-medium">{tool.scores.quality}</span>
                      </div>
                      <Progress value={tool.scores.quality} className="h-2" />
                    </div>
                    <div>
                      <div className="flex justify-between mb-1">
                        <span className="text-muted-foreground">무료</span>
                        <span className="font-medium">{tool.scores.free}</span>
                      </div>
                      <Progress value={tool.scores.free} className="h-2" />
                    </div>
                    <div>
                      <div className="flex justify-between mb-1">
                        <span className="text-muted-foreground">UX</span>
                        <span className="font-medium">{tool.scores.ux}</span>
                      </div>
                      <Progress value={tool.scores.ux} className="h-2" />
                    </div>
                    <div>
                      <div className="flex justify-between mb-1">
                        <span className="text-muted-foreground">가성비</span>
                        <span className="font-medium">{tool.scores.value}</span>
                      </div>
                      <Progress value={tool.scores.value} className="h-2" />
                    </div>
                    <div>
                      <div className="flex justify-between mb-1">
                        <span className="text-muted-foreground">업데이트</span>
                        <span className="font-medium">{tool.scores.updates}</span>
                      </div>
                      <Progress value={tool.scores.updates} className="h-2" />
                    </div>
                  </div>
                </div>

                {/* Score & Actions */}
                <div className="flex-shrink-0 text-center">
                  <div className="text-4xl font-bold text-primary mb-2">{tool.totalScore}</div>
                  <div className="text-sm text-muted-foreground mb-4">총점</div>
                  <div className="space-y-2">
                    <Link href={`/ranking/${category}/${tool.slug}`}>
                      <Button className="w-full">자세히 보기</Button>
                    </Link>
                    <Button variant="outline" size="sm" className="w-full">
                      <ExternalLink className="h-4 w-4 mr-1" />
                      바로가기
                    </Button>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {tools.length === 0 && (
        <Card className="p-12 text-center">
          <p className="text-muted-foreground">이 카테고리에 등록된 AI 도구가 없습니다.</p>
        </Card>
      )}
    </div>
  );
}
