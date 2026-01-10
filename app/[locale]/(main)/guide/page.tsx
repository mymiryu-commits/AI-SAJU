'use client';

import { useTranslations } from 'next-intl';
import { Link } from '@/i18n/routing';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  BookOpen,
  TrendingUp,
  Clock,
  Search,
  MessageSquare,
  Image,
  Video,
  Code,
  Mic,
  FileText,
  ArrowRight,
  Eye,
  ThumbsUp,
} from 'lucide-react';

const CATEGORIES = [
  { id: 'all', label: '전체', icon: BookOpen },
  { id: 'chat', label: '대화형 AI', icon: MessageSquare },
  { id: 'image', label: '이미지', icon: Image },
  { id: 'video', label: '영상', icon: Video },
  { id: 'code', label: '코딩', icon: Code },
  { id: 'voice', label: '음성', icon: Mic },
  { id: 'writing', label: '문서', icon: FileText },
];

const GUIDES = [
  {
    id: '1',
    slug: 'chatgpt-vs-claude-2025',
    title: 'ChatGPT vs Claude: 2025년 완벽 비교 가이드',
    excerpt: 'OpenAI ChatGPT와 Anthropic Claude, 어떤 AI가 나에게 맞을까? 실제 사용 경험을 바탕으로 두 AI를 비교합니다.',
    category: 'chat',
    image: '/guides/chatgpt-claude.jpg',
    author: 'AI RANK 팀',
    date: '2025-01-08',
    readTime: 8,
    views: 15420,
    likes: 342,
    isFeatured: true,
    tags: ['ChatGPT', 'Claude', '비교', '가이드'],
  },
  {
    id: '2',
    slug: 'midjourney-prompt-guide',
    title: 'Midjourney 프롬프트 작성법: 초보자 완벽 가이드',
    excerpt: 'Midjourney로 원하는 이미지를 만들기 위한 프롬프트 작성 팁과 실전 예제를 소개합니다.',
    category: 'image',
    image: '/guides/midjourney-prompt.jpg',
    author: 'AI RANK 팀',
    date: '2025-01-06',
    readTime: 12,
    views: 23150,
    likes: 567,
    isFeatured: true,
    tags: ['Midjourney', '프롬프트', '이미지 생성'],
  },
  {
    id: '3',
    slug: 'cursor-vs-github-copilot',
    title: 'Cursor vs GitHub Copilot: 개발자를 위한 AI 코딩 도구 비교',
    excerpt: 'AI 코딩 도구 양대 산맥, Cursor와 GitHub Copilot을 실제 개발 환경에서 비교 분석합니다.',
    category: 'code',
    image: '/guides/cursor-copilot.jpg',
    author: 'AI RANK 팀',
    date: '2025-01-04',
    readTime: 10,
    views: 8920,
    likes: 234,
    isFeatured: false,
    tags: ['Cursor', 'Copilot', '코딩', 'IDE'],
  },
  {
    id: '4',
    slug: 'suno-ai-music-tutorial',
    title: 'Suno로 AI 음악 만들기: 시작 가이드',
    excerpt: '프롬프트만으로 전문가 수준의 음악을 만드는 방법! Suno AI 음악 생성 완벽 가이드.',
    category: 'voice',
    image: '/guides/suno-music.jpg',
    author: 'AI RANK 팀',
    date: '2025-01-02',
    readTime: 7,
    views: 6540,
    likes: 189,
    isFeatured: false,
    tags: ['Suno', '음악', 'AI 생성'],
  },
  {
    id: '5',
    slug: 'runway-gen3-video-guide',
    title: 'Runway Gen-3로 AI 영상 만들기',
    excerpt: '텍스트와 이미지로 고품질 영상을 생성하는 Runway Gen-3 완벽 사용법.',
    category: 'video',
    image: '/guides/runway-gen3.jpg',
    author: 'AI RANK 팀',
    date: '2024-12-28',
    readTime: 9,
    views: 11230,
    likes: 298,
    isFeatured: false,
    tags: ['Runway', '영상 생성', 'Gen-3'],
  },
  {
    id: '6',
    slug: 'ai-writing-tools-comparison',
    title: '2025년 최고의 AI 글쓰기 도구 TOP 5',
    excerpt: 'Jasper, Copy.ai, Notion AI... 어떤 AI 글쓰기 도구를 선택해야 할까?',
    category: 'writing',
    image: '/guides/ai-writing.jpg',
    author: 'AI RANK 팀',
    date: '2024-12-25',
    readTime: 11,
    views: 9870,
    likes: 267,
    isFeatured: false,
    tags: ['글쓰기', 'AI 도구', '비교'],
  },
];

export default function GuidePage() {
  const t = useTranslations();

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Hero Section */}
      <div className="text-center mb-12">
        <Badge className="mb-4" variant="secondary">AI 가이드</Badge>
        <h1 className="text-4xl font-bold mb-4">AI 도구 활용 가이드</h1>
        <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
          AI 도구의 사용법, 비교 분석, 팁과 트릭까지. AI를 더 잘 활용하는 방법을 알려드립니다.
        </p>
      </div>

      {/* Search */}
      <div className="max-w-xl mx-auto mb-8">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-5 w-5" />
          <Input
            placeholder="가이드 검색..."
            className="pl-10 h-12"
          />
        </div>
      </div>

      {/* Category Tabs */}
      <div className="flex flex-wrap justify-center gap-2 mb-12">
        {CATEGORIES.map((cat) => (
          <Button
            key={cat.id}
            variant={cat.id === 'all' ? 'default' : 'outline'}
            size="sm"
            className="gap-2"
          >
            <cat.icon className="h-4 w-4" />
            {cat.label}
          </Button>
        ))}
      </div>

      {/* Featured Guides */}
      <section className="mb-12">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold flex items-center gap-2">
            <TrendingUp className="h-6 w-6 text-primary" />
            인기 가이드
          </h2>
        </div>
        <div className="grid md:grid-cols-2 gap-6">
          {GUIDES.filter(g => g.isFeatured).map((guide) => (
            <Card key={guide.id} className="overflow-hidden hover:shadow-lg transition-shadow group">
              <div className="aspect-video bg-gradient-to-br from-primary/20 to-primary/5 flex items-center justify-center">
                <BookOpen className="h-16 w-16 text-primary/40" />
              </div>
              <CardContent className="p-6">
                <div className="flex items-center gap-2 mb-3">
                  <Badge variant="secondary">{CATEGORIES.find(c => c.id === guide.category)?.label}</Badge>
                  <span className="text-sm text-muted-foreground flex items-center gap-1">
                    <Clock className="h-3 w-3" />
                    {guide.readTime}분
                  </span>
                </div>
                <h3 className="text-xl font-semibold mb-2 group-hover:text-primary transition-colors">
                  {guide.title}
                </h3>
                <p className="text-muted-foreground mb-4 line-clamp-2">{guide.excerpt}</p>
                <div className="flex items-center justify-between text-sm text-muted-foreground">
                  <span>{guide.author} · {guide.date}</span>
                  <div className="flex items-center gap-3">
                    <span className="flex items-center gap-1">
                      <Eye className="h-4 w-4" />
                      {guide.views.toLocaleString()}
                    </span>
                    <span className="flex items-center gap-1">
                      <ThumbsUp className="h-4 w-4" />
                      {guide.likes}
                    </span>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </section>

      {/* All Guides */}
      <section>
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold flex items-center gap-2">
            <Clock className="h-6 w-6 text-primary" />
            최신 가이드
          </h2>
        </div>
        <div className="grid md:grid-cols-3 gap-6">
          {GUIDES.map((guide) => (
            <Card key={guide.id} className="overflow-hidden hover:shadow-lg transition-shadow group">
              <div className="aspect-[16/9] bg-gradient-to-br from-muted to-muted/50 flex items-center justify-center">
                <BookOpen className="h-12 w-12 text-muted-foreground/40" />
              </div>
              <CardContent className="p-4">
                <div className="flex items-center gap-2 mb-2">
                  <Badge variant="outline" className="text-xs">
                    {CATEGORIES.find(c => c.id === guide.category)?.label}
                  </Badge>
                  <span className="text-xs text-muted-foreground">
                    {guide.readTime}분
                  </span>
                </div>
                <h3 className="font-semibold mb-2 group-hover:text-primary transition-colors line-clamp-2">
                  {guide.title}
                </h3>
                <p className="text-sm text-muted-foreground line-clamp-2 mb-3">{guide.excerpt}</p>
                <div className="flex items-center justify-between text-xs text-muted-foreground">
                  <span>{guide.date}</span>
                  <span className="flex items-center gap-1">
                    <Eye className="h-3 w-3" />
                    {guide.views.toLocaleString()}
                  </span>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        <div className="text-center mt-8">
          <Button variant="outline" size="lg">
            더 많은 가이드 보기
            <ArrowRight className="ml-2 h-4 w-4" />
          </Button>
        </div>
      </section>

      {/* CTA Banner */}
      <section className="mt-16">
        <Card className="bg-gradient-to-r from-primary/10 via-primary/5 to-transparent border-primary/20">
          <CardContent className="p-8 md:p-12 flex flex-col md:flex-row items-center justify-between gap-6">
            <div>
              <h3 className="text-2xl font-bold mb-2">AI 운세로 당신의 미래를 확인하세요!</h3>
              <p className="text-muted-foreground">
                무료 사주 분석으로 2025년 운세를 확인하고, AI의 인사이트를 받아보세요.
              </p>
            </div>
            <Link href="/fortune/free">
              <Button size="lg" className="whitespace-nowrap">
                무료 운세 보기
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </Link>
          </CardContent>
        </Card>
      </section>
    </div>
  );
}
