'use client';

import { useState } from 'react';
import { Link } from '@/i18n/routing';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import {
  Search,
  Sparkles,
  Star,
  ShoppingCart,
  Download,
  Eye,
  Heart,
  MessageSquare,
  Image,
  Video,
  Code,
  Music,
  FileText,
  Briefcase,
  TrendingUp,
  Crown,
  Zap,
  Filter,
  ArrowRight,
  Copy,
  Check,
  ExternalLink,
} from 'lucide-react';

// 프롬프트 카테고리
const categories = [
  { id: 'all', name: '전체', icon: Sparkles, count: 156 },
  { id: 'chatgpt', name: 'ChatGPT', icon: MessageSquare, count: 48 },
  { id: 'midjourney', name: 'Midjourney', icon: Image, count: 35 },
  { id: 'dalle', name: 'DALL-E', icon: Image, count: 22 },
  { id: 'stable', name: 'Stable Diffusion', icon: Image, count: 18 },
  { id: 'claude', name: 'Claude', icon: MessageSquare, count: 15 },
  { id: 'video', name: '영상 AI', icon: Video, count: 10 },
  { id: 'code', name: '코딩', icon: Code, count: 8 },
];

// 인기 프롬프트 데이터
const prompts = [
  {
    id: '1',
    title: '바이럴 쇼츠 스크립트 생성기',
    description: '조회수 100만 쇼츠의 패턴을 분석한 바이럴 스크립트 프롬프트. 후킹-전개-CTA 구조 포함.',
    category: 'chatgpt',
    price: 9900,
    originalPrice: 19900,
    rating: 4.9,
    reviews: 234,
    sales: 1250,
    preview: '다음 조건에 맞는 유튜브 쇼츠 스크립트를 작성해줘:\n\n주제: [주제 입력]\n타겟: [타겟층]\n톤: [원하는 톤]\n\n구조:\n1. 후킹 (첫 3초에 시청자를 사로잡는 질문/충격적 사실)\n2. 문제 제기 (공감 유도)\n3. 해결책 제시...',
    author: 'AI마스터',
    isFeatured: true,
    isHot: true,
    gradient: 'from-rose-500 to-pink-600',
    tags: ['유튜브', '쇼츠', '바이럴', '스크립트'],
  },
  {
    id: '2',
    title: '고퀄리티 상세페이지 이미지',
    description: '스마트스토어, 쿠팡 상세페이지에 최적화된 제품 이미지 생성 프롬프트 세트.',
    category: 'midjourney',
    price: 14900,
    originalPrice: 29900,
    rating: 4.8,
    reviews: 189,
    sales: 890,
    preview: '/imagine prompt: professional product photography of [제품명], white background, studio lighting, commercial style, 8k resolution, hyperrealistic, detailed texture...',
    author: '디자인프로',
    isFeatured: true,
    isHot: false,
    gradient: 'from-violet-500 to-purple-600',
    tags: ['상세페이지', '제품사진', '이커머스'],
  },
  {
    id: '3',
    title: 'SEO 블로그 글쓰기 마스터',
    description: '구글 상위 노출을 위한 SEO 최적화 블로그 포스팅 프롬프트. 키워드 분석부터 글쓰기까지.',
    category: 'chatgpt',
    price: 12900,
    originalPrice: 24900,
    rating: 4.9,
    reviews: 312,
    sales: 2100,
    preview: '다음 키워드로 SEO 최적화된 블로그 글을 작성해줘:\n\n메인 키워드: [키워드]\n서브 키워드: [키워드들]\n글자수: 2000자 이상\n\n포함 요소:\n- H1, H2, H3 태그 구조\n- 키워드 밀도 2-3%\n- 메타 디스크립션...',
    author: 'SEO전문가',
    isFeatured: true,
    isHot: true,
    gradient: 'from-emerald-500 to-teal-600',
    tags: ['블로그', 'SEO', '글쓰기', '애드센스'],
  },
  {
    id: '4',
    title: '이모티콘 캐릭터 세트',
    description: '카카오/라인 이모티콘 심사 통과율 높은 캐릭터 디자인 프롬프트 32종 세트.',
    category: 'midjourney',
    price: 19900,
    originalPrice: 39900,
    rating: 4.7,
    reviews: 156,
    sales: 670,
    preview: '/imagine prompt: cute kawaii character emoticon, [감정 표현], simple line art, white background, sticker style, rounded edges, pastel colors, consistent character design...',
    author: '이모지크리에이터',
    isFeatured: false,
    isHot: false,
    gradient: 'from-amber-500 to-orange-600',
    tags: ['이모티콘', '캐릭터', '카카오', '라인'],
  },
  {
    id: '5',
    title: '유튜브 썸네일 마스터팩',
    description: 'CTR 높은 유튜브 썸네일 이미지 생성 프롬프트 20종. 다양한 장르별 템플릿 포함.',
    category: 'dalle',
    price: 11900,
    originalPrice: 23900,
    rating: 4.8,
    reviews: 201,
    sales: 980,
    preview: 'Create a YouTube thumbnail: [주제], eye-catching design, bold text space on right side, dramatic lighting, vibrant colors, 16:9 aspect ratio, professional quality...',
    author: '썸네일장인',
    isFeatured: false,
    isHot: true,
    gradient: 'from-cyan-500 to-blue-600',
    tags: ['유튜브', '썸네일', 'CTR'],
  },
  {
    id: '6',
    title: '비즈니스 이메일 자동화',
    description: '상황별 비즈니스 이메일 템플릿 프롬프트. 제안서, 협업, 클레임 대응 등 50가지.',
    category: 'claude',
    price: 8900,
    originalPrice: 17900,
    rating: 4.6,
    reviews: 98,
    sales: 450,
    preview: '다음 상황에 맞는 비즈니스 이메일을 작성해줘:\n\n상황: [제안서/협업요청/클레임대응/...]\n수신자: [직급/관계]\n톤: [격식체/반격식체]\n핵심 메시지: [...]\n\n포함할 내용:...',
    author: '비즈니스프로',
    isFeatured: false,
    isHot: false,
    gradient: 'from-slate-500 to-gray-600',
    tags: ['이메일', '비즈니스', '자동화'],
  },
  {
    id: '7',
    title: 'AI 아바타 영상 스크립트',
    description: 'HeyGen/Synthesia용 AI 아바타 영상 스크립트 프롬프트. 교육, 마케팅, 소개 영상.',
    category: 'video',
    price: 15900,
    originalPrice: 31900,
    rating: 4.7,
    reviews: 87,
    sales: 320,
    preview: 'AI 아바타가 발표할 스크립트를 작성해줘:\n\n용도: [교육/마케팅/회사소개/...]\n길이: [1분/3분/5분]\n톤: [전문적/친근한/설득적]\n\n구조:\n1. 인사 및 자기소개\n2. 주제 소개...',
    author: 'AI영상마스터',
    isFeatured: false,
    isHot: false,
    gradient: 'from-pink-500 to-rose-600',
    tags: ['영상', 'AI아바타', 'HeyGen'],
  },
  {
    id: '8',
    title: '풀스택 코드 생성기',
    description: 'Next.js + TypeScript + Tailwind 풀스택 앱 코드 생성 프롬프트. 컴포넌트부터 API까지.',
    category: 'code',
    price: 24900,
    originalPrice: 49900,
    rating: 4.9,
    reviews: 145,
    sales: 560,
    preview: '다음 요구사항에 맞는 Next.js 앱을 만들어줘:\n\n기능: [기능 설명]\n기술스택: Next.js 14, TypeScript, Tailwind CSS, Prisma\n\n필요한 것:\n1. 페이지 컴포넌트\n2. API 라우트\n3. 데이터베이스 스키마...',
    author: '풀스택개발자',
    isFeatured: true,
    isHot: true,
    gradient: 'from-indigo-500 to-violet-600',
    tags: ['코딩', 'Next.js', 'TypeScript'],
  },
];

// 번들 상품
const bundles = [
  {
    id: 'bundle-1',
    title: '쇼츠 크리에이터 올인원',
    description: '쇼츠 제작에 필요한 모든 프롬프트 패키지',
    prompts: ['스크립트', '썸네일', '해시태그', '제목'],
    originalPrice: 89600,
    price: 39900,
    discount: 55,
    gradient: 'from-rose-500 via-pink-500 to-purple-600',
  },
  {
    id: 'bundle-2',
    title: '이커머스 셀러 패키지',
    description: '상세페이지, 상품 설명, 리뷰 답변 프롬프트',
    prompts: ['상세페이지', '상품설명', '리뷰답변', 'CS응대'],
    originalPrice: 79600,
    price: 34900,
    discount: 56,
    gradient: 'from-emerald-500 via-teal-500 to-cyan-600',
  },
  {
    id: 'bundle-3',
    title: '콘텐츠 마케터 풀패키지',
    description: '블로그, SNS, 이메일 마케팅 프롬프트 세트',
    prompts: ['블로그', 'SNS', '이메일', '광고카피'],
    originalPrice: 99600,
    price: 44900,
    discount: 55,
    gradient: 'from-violet-500 via-purple-500 to-indigo-600',
  },
];

export default function PromptsPage() {
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [copiedId, setCopiedId] = useState<string | null>(null);

  const filteredPrompts = prompts.filter((prompt) => {
    const matchesCategory = selectedCategory === 'all' || prompt.category === selectedCategory;
    const matchesSearch = prompt.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      prompt.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      prompt.tags.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase()));
    return matchesCategory && matchesSearch;
  });

  const handleCopyPreview = (id: string, preview: string) => {
    navigator.clipboard.writeText(preview);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-6 relative z-10">
        {/* Compact Header */}
        <header className="mb-6">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-5">
            <div className="flex items-center gap-3">
              <div className="inline-flex items-center gap-2 bg-gradient-to-r from-violet-100 to-purple-100 dark:from-violet-900/30 dark:to-purple-900/30 border border-violet-200/50 dark:border-violet-700/50 rounded-full px-4 py-1.5">
                <Sparkles className="h-4 w-4 text-violet-500" />
                <span className="text-violet-700 dark:text-violet-300 text-sm font-medium">프롬프트 마켓</span>
              </div>
              <p className="text-muted-foreground text-sm hidden md:block">
                전문가들이 만든 고품질 프롬프트로 시간을 절약하고 퀄리티를 높이세요
              </p>
            </div>

            {/* Stats - Compact */}
            <div className="flex items-center gap-6">
              {[
                { value: '156+', label: '프롬프트' },
                { value: '12.8K', label: '판매' },
                { value: '4.8', label: '평균 평점' },
              ].map((stat) => (
                <div key={stat.label} className="text-center">
                  <div className="text-lg font-bold text-foreground">{stat.value}</div>
                  <div className="text-muted-foreground text-xs">{stat.label}</div>
                </div>
              ))}
            </div>
          </div>

          {/* Search */}
          <div className="max-w-md relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="프롬프트 검색..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10 h-10 bg-secondary/50 border-border rounded-xl"
            />
          </div>
        </header>

        {/* Categories - Compact */}
        <section className="mb-6">
          <div className="flex flex-wrap gap-2">
            {categories.map((cat) => {
              const Icon = cat.icon;
              const isActive = selectedCategory === cat.id;
              return (
                <button
                  key={cat.id}
                  onClick={() => setSelectedCategory(cat.id)}
                  className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-sm transition-all ${
                    isActive
                      ? 'bg-gradient-to-r from-violet-500 to-purple-600 text-white shadow-md shadow-violet-500/20'
                      : 'bg-secondary/50 text-muted-foreground hover:text-foreground hover:bg-secondary'
                  }`}
                >
                  <Icon className="h-3.5 w-3.5" />
                  <span className="font-medium">{cat.name}</span>
                  <span className={`text-xs px-1.5 py-0.5 rounded-full ${
                    isActive ? 'bg-white/20' : 'bg-secondary'
                  }`}>
                    {cat.count}
                  </span>
                </button>
              );
            })}
          </div>
        </section>

        {/* Featured Bundles - Compact */}
        <section className="mb-8">
          <div className="flex items-center gap-3 mb-4">
            <Crown className="h-5 w-5 text-amber-500" />
            <h2 className="text-lg font-bold text-foreground">베스트 번들</h2>
            <span className="text-muted-foreground text-sm">최대 56% 할인 패키지</span>
          </div>

          <div className="grid md:grid-cols-3 gap-4">
            {bundles.map((bundle) => (
              <div
                key={bundle.id}
                className="bg-card border border-border rounded-xl overflow-hidden hover:shadow-lg transition-shadow"
              >
                <div className={`bg-gradient-to-r ${bundle.gradient} p-4`}>
                  <Badge className="bg-white/20 text-white border-0 text-xs mb-2">
                    {bundle.discount}% 할인
                  </Badge>
                  <h3 className="text-lg font-bold text-white mb-1">{bundle.title}</h3>
                  <p className="text-white/80 text-xs">{bundle.description}</p>
                </div>
                <div className="p-4">
                  <div className="flex flex-wrap gap-1.5 mb-3">
                    {bundle.prompts.map((p) => (
                      <span key={p} className="text-xs text-muted-foreground bg-secondary px-2 py-1 rounded-md">
                        {p}
                      </span>
                    ))}
                  </div>
                  <div className="flex items-center justify-between">
                    <div>
                      <span className="text-muted-foreground line-through text-xs">
                        ₩{bundle.originalPrice.toLocaleString()}
                      </span>
                      <span className="text-xl font-bold text-foreground ml-2">
                        ₩{bundle.price.toLocaleString()}
                      </span>
                    </div>
                    <Button size="sm" className="bg-gradient-to-r from-violet-500 to-purple-600 hover:from-violet-600 hover:to-purple-700 text-white rounded-lg">
                      <ShoppingCart className="mr-1.5 h-3.5 w-3.5" />
                      구매
                    </Button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Prompt List */}
        <section>
          <div className="flex items-center gap-3 mb-4">
            <Zap className="h-5 w-5 text-amber-500" />
            <h2 className="text-lg font-bold text-foreground">인기 프롬프트</h2>
            <span className="text-muted-foreground text-sm">{filteredPrompts.length}개</span>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
            {filteredPrompts.map((prompt, index) => (
              <PromptCard
                key={prompt.id}
                prompt={prompt}
                index={index}
                onCopy={handleCopyPreview}
                isCopied={copiedId === prompt.id}
              />
            ))}
          </div>

          {filteredPrompts.length === 0 && (
            <div className="text-center py-16">
              <p className="text-muted-foreground">검색 결과가 없습니다</p>
            </div>
          )}
        </section>

        {/* CTA */}
        <section className="mt-12">
          <div className="bg-gradient-to-br from-violet-50 via-purple-50 to-pink-50 dark:from-violet-950/30 dark:via-purple-950/20 dark:to-pink-950/10 border border-violet-200/50 dark:border-violet-800/30 rounded-2xl p-8 text-center relative overflow-hidden">
            <div className="absolute top-0 right-0 w-64 h-64 bg-violet-200/30 dark:bg-violet-600/10 rounded-full blur-[80px]" />
            <div className="absolute bottom-0 left-0 w-48 h-48 bg-pink-200/30 dark:bg-pink-600/10 rounded-full blur-[80px]" />

            <div className="relative z-10">
              <h3 className="text-xl font-bold text-foreground mb-2">
                나만의 프롬프트를 판매하고 싶으신가요?
              </h3>
              <p className="text-muted-foreground mb-6 text-sm max-w-md mx-auto">
                검증된 프롬프트를 등록하고 수익을 창출하세요. 판매 수수료 15%만 받습니다.
              </p>
              <Button
                className="bg-gradient-to-r from-violet-500 to-purple-600 hover:from-violet-600 hover:to-purple-700 text-white px-6 py-5 rounded-xl shadow-lg shadow-violet-500/20"
              >
                <TrendingUp className="mr-2 h-4 w-4" />
                판매자 등록하기
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}

function PromptCard({
  prompt,
  index,
  onCopy,
  isCopied,
}: {
  prompt: (typeof prompts)[0];
  index: number;
  onCopy: (id: string, preview: string) => void;
  isCopied: boolean;
}) {
  const [showPreview, setShowPreview] = useState(false);
  const discount = Math.round((1 - prompt.price / prompt.originalPrice) * 100);

  return (
    <div
      className="bg-card border border-border rounded-xl overflow-hidden hover:shadow-lg transition-all"
    >
      {/* Header */}
      <div className={`bg-gradient-to-r ${prompt.gradient} p-3 relative`}>
        <div className="flex items-start justify-between">
          <div className="flex gap-1.5">
            {prompt.isHot && (
              <Badge className="bg-white/20 text-white border-0 text-[10px] px-1.5">
                🔥 인기
              </Badge>
            )}
            {prompt.isFeatured && (
              <Badge className="bg-white/20 text-white border-0 text-[10px] px-1.5">
                ⭐ 추천
              </Badge>
            )}
          </div>
          <Badge className="bg-white/20 text-white border-0 text-[10px] px-1.5">
            {discount}% 할인
          </Badge>
        </div>
        <h3 className="text-base font-bold text-white mt-2 mb-0.5 line-clamp-1">
          {prompt.title}
        </h3>
        <p className="text-white/70 text-xs">{prompt.author}</p>
      </div>

      {/* Content */}
      <div className="p-3">
        <p className="text-muted-foreground text-xs mb-2 line-clamp-2">
          {prompt.description}
        </p>

        {/* Tags */}
        <div className="flex flex-wrap gap-1 mb-3">
          {prompt.tags.slice(0, 3).map((tag) => (
            <span key={tag} className="text-[10px] text-muted-foreground bg-secondary px-1.5 py-0.5 rounded">
              #{tag}
            </span>
          ))}
        </div>

        {/* Stats */}
        <div className="flex items-center gap-3 text-[11px] text-muted-foreground mb-3">
          <span className="flex items-center gap-1">
            <Star className="h-3 w-3 text-amber-400 fill-amber-400" />
            {prompt.rating}
          </span>
          <span className="flex items-center gap-1">
            <MessageSquare className="h-3 w-3" />
            {prompt.reviews}
          </span>
          <span className="flex items-center gap-1">
            <Download className="h-3 w-3" />
            {prompt.sales}
          </span>
        </div>

        {/* Preview Toggle */}
        <button
          onClick={() => setShowPreview(!showPreview)}
          className="w-full text-left mb-3"
        >
          <div className="flex items-center justify-between text-[11px] text-muted-foreground mb-1">
            <span className="flex items-center gap-1">
              <Eye className="h-3 w-3" />
              미리보기
            </span>
            <span>{showPreview ? '접기' : '펼치기'}</span>
          </div>
          {showPreview && (
            <div className="relative">
              <pre className="text-[11px] text-foreground bg-secondary p-2 rounded-lg overflow-x-auto whitespace-pre-wrap font-mono leading-relaxed max-h-28 overflow-y-auto">
                {prompt.preview}
              </pre>
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  onCopy(prompt.id, prompt.preview);
                }}
                className="absolute top-1.5 right-1.5 p-1 bg-background/80 hover:bg-background rounded transition-colors"
              >
                {isCopied ? (
                  <Check className="h-3 w-3 text-emerald-500" />
                ) : (
                  <Copy className="h-3 w-3 text-muted-foreground" />
                )}
              </button>
            </div>
          )}
        </button>

        {/* Price & Buy */}
        <div className="flex items-center justify-between pt-3 border-t border-border">
          <div>
            <span className="text-muted-foreground line-through text-[10px]">
              ₩{prompt.originalPrice.toLocaleString()}
            </span>
            <span className="text-base font-bold text-foreground ml-1.5">
              ₩{prompt.price.toLocaleString()}
            </span>
          </div>
          <Button
            size="sm"
            className="bg-gradient-to-r from-violet-500 to-purple-600 hover:from-violet-600 hover:to-purple-700 text-white rounded-lg text-xs h-8 px-3"
          >
            구매
          </Button>
        </div>
      </div>
    </div>
  );
}
