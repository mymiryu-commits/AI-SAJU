'use client';

import { useState } from 'react';
import { ShoppingBag, Star, Users, Eye, Heart, Filter, Search, ArrowUpRight, Tag, Clock, Verified } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

const categories = [
  { key: 'all', label: '전체' },
  { key: 'template', label: '템플릿' },
  { key: 'automation', label: '자동화' },
  { key: 'course', label: '강의' },
  { key: 'service', label: '서비스' },
  { key: 'tool', label: '도구' },
];

const products = [
  {
    id: '1',
    title: 'AI 쇼츠 자동화 노션 템플릿',
    seller: '크리에이터Lab',
    sellerVerified: true,
    category: 'template',
    price: 19900,
    originalPrice: 39000,
    rating: 4.9,
    reviews: 156,
    sales: 892,
    thumbnail: '🎬',
    tags: ['노션', '유튜브', '자동화'],
    description: '유튜브 쇼츠 제작 워크플로우를 자동화하는 노션 템플릿',
    featured: true,
  },
  {
    id: '2',
    title: 'ChatGPT 프롬프트 마스터 클래스',
    seller: 'AI스쿨',
    sellerVerified: true,
    category: 'course',
    price: 89000,
    originalPrice: 150000,
    rating: 4.8,
    reviews: 324,
    sales: 1247,
    thumbnail: '📚',
    tags: ['강의', 'ChatGPT', '프롬프트'],
    description: '초보자도 전문가처럼 ChatGPT를 활용하는 방법',
    featured: true,
  },
  {
    id: '3',
    title: 'n8n 자동화 워크플로우 50선',
    seller: '자동화마스터',
    sellerVerified: true,
    category: 'automation',
    price: 49900,
    originalPrice: 99000,
    rating: 4.7,
    reviews: 89,
    sales: 456,
    thumbnail: '⚡',
    tags: ['n8n', '자동화', '워크플로우'],
    description: '바로 사용 가능한 n8n 자동화 템플릿 50개 세트',
    featured: false,
  },
  {
    id: '4',
    title: 'AI 블로그 자동 포스팅 봇',
    seller: '블로그마스터',
    sellerVerified: false,
    category: 'tool',
    price: 29900,
    originalPrice: 59000,
    rating: 4.5,
    reviews: 67,
    sales: 234,
    thumbnail: '🤖',
    tags: ['블로그', '자동화', 'API'],
    description: 'ChatGPT API를 활용한 자동 블로그 포스팅 도구',
    featured: false,
  },
  {
    id: '5',
    title: 'Midjourney 프롬프트 1000선',
    seller: '이미지크리에이터',
    sellerVerified: true,
    category: 'template',
    price: 15900,
    originalPrice: 30000,
    rating: 4.8,
    reviews: 234,
    sales: 1876,
    thumbnail: '🎨',
    tags: ['Midjourney', '프롬프트', '이미지'],
    description: '카테고리별로 정리된 Midjourney 프롬프트 모음',
    featured: true,
  },
  {
    id: '6',
    title: '쿠팡파트너스 AI 리뷰 생성기',
    seller: '수익화연구소',
    sellerVerified: true,
    category: 'tool',
    price: 39900,
    originalPrice: 79000,
    rating: 4.6,
    reviews: 123,
    sales: 567,
    thumbnail: '💰',
    tags: ['쿠팡', '제휴마케팅', 'AI'],
    description: 'AI로 쿠팡파트너스 상품 리뷰를 자동 생성하는 도구',
    featured: false,
  },
  {
    id: '7',
    title: 'AI 마케팅 컨설팅 (1시간)',
    seller: '마케팅프로',
    sellerVerified: true,
    category: 'service',
    price: 150000,
    originalPrice: 300000,
    rating: 5.0,
    reviews: 45,
    sales: 89,
    thumbnail: '💼',
    tags: ['컨설팅', '마케팅', '1:1'],
    description: '당신의 비즈니스에 맞는 AI 마케팅 전략 컨설팅',
    featured: false,
  },
  {
    id: '8',
    title: 'Figma AI UI키트 프리미엄',
    seller: '디자인허브',
    sellerVerified: true,
    category: 'template',
    price: 59000,
    originalPrice: 120000,
    rating: 4.9,
    reviews: 78,
    sales: 345,
    thumbnail: '🎯',
    tags: ['Figma', 'UI/UX', '템플릿'],
    description: 'AI 서비스 제작에 최적화된 Figma UI 컴포넌트',
    featured: false,
  },
];

export default function MarketplacePage() {
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');

  const filteredProducts = products.filter((product) => {
    const matchesCategory = selectedCategory === 'all' || product.category === selectedCategory;
    const matchesSearch = product.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          product.tags.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase()));
    return matchesCategory && matchesSearch;
  });

  const featuredProducts = filteredProducts.filter(p => p.featured);
  const regularProducts = filteredProducts.filter(p => !p.featured);

  return (
    <div className="content-area">
      {/* Header */}
      <div className="section-header animate-fade-in-up">
        <div className="inline-flex items-center gap-2 px-4 py-2 bg-primary/10 rounded-full mb-4">
          <ShoppingBag className="h-4 w-4 text-primary" />
          <span className="text-sm font-medium">크리에이터 마켓</span>
        </div>
        <h1 className="section-title">AI 자료 마켓플레이스</h1>
        <p className="section-subtitle">검증된 크리에이터의 프리미엄 자료를 만나보세요</p>
      </div>

      {/* Search & Filter */}
      <div className="flex flex-col md:flex-row gap-4 mb-8 animate-fade-in-up animation-delay-100">
        <div className="search-bar flex-1">
          <Search className="h-5 w-5 text-muted-foreground" />
          <input
            type="text"
            placeholder="템플릿, 강의, 도구 검색..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="flex-1"
          />
        </div>
        <div className="flex gap-2 overflow-x-auto pb-2">
          {categories.map((cat) => (
            <Button
              key={cat.key}
              variant={selectedCategory === cat.key ? 'default' : 'outline'}
              size="sm"
              onClick={() => setSelectedCategory(cat.key)}
              className={cn(
                'whitespace-nowrap',
                selectedCategory === cat.key && 'btn-primary'
              )}
            >
              {cat.label}
            </Button>
          ))}
        </div>
      </div>

      {/* Featured Products */}
      {featuredProducts.length > 0 && (
        <div className="mb-10 animate-fade-in-up animation-delay-200">
          <h2 className="text-xl font-bold mb-4 flex items-center gap-2">
            <Star className="h-5 w-5 text-amber-500" />
            추천 상품
          </h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-5">
            {featuredProducts.map((product) => (
              <ProductCard key={product.id} product={product} featured />
            ))}
          </div>
        </div>
      )}

      {/* All Products */}
      <div className="animate-fade-in-up animation-delay-300">
        <h2 className="text-xl font-bold mb-4">전체 상품</h2>
        <div className="grid md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
          {regularProducts.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      </div>

      {filteredProducts.length === 0 && (
        <div className="text-center py-16">
          <p className="text-muted-foreground">검색 결과가 없습니다.</p>
        </div>
      )}
    </div>
  );
}

function ProductCard({ product, featured = false }: { product: typeof products[0]; featured?: boolean }) {
  return (
    <div className={cn(
      'rank-card overflow-hidden group',
      featured && 'ring-2 ring-primary/20'
    )}>
      {/* Thumbnail */}
      <div className="h-32 bg-secondary flex items-center justify-center text-5xl relative">
        {product.thumbnail}
        {featured && (
          <span className="absolute top-2 left-2 text-xs font-bold text-white bg-gradient-to-r from-amber-500 to-orange-500 px-2 py-1 rounded">
            추천
          </span>
        )}
        <button className="absolute top-2 right-2 p-2 bg-white/80 dark:bg-black/50 rounded-full opacity-0 group-hover:opacity-100 transition-opacity">
          <Heart className="h-4 w-4" />
        </button>
      </div>

      {/* Content */}
      <div className="p-4">
        {/* Seller */}
        <div className="flex items-center gap-2 mb-2">
          <span className="text-xs text-muted-foreground">{product.seller}</span>
          {product.sellerVerified && (
            <Verified className="h-3.5 w-3.5 text-blue-500" />
          )}
        </div>

        {/* Title */}
        <h3 className="font-bold mb-2 line-clamp-2 group-hover:text-primary transition-colors">
          {product.title}
        </h3>

        {/* Tags */}
        <div className="flex flex-wrap gap-1 mb-3">
          {product.tags.slice(0, 3).map((tag) => (
            <span key={tag} className="text-xs px-2 py-0.5 bg-secondary rounded">
              {tag}
            </span>
          ))}
        </div>

        {/* Stats */}
        <div className="flex items-center gap-3 text-sm text-muted-foreground mb-3">
          <div className="flex items-center gap-1">
            <Star className="h-3.5 w-3.5 rating-star" />
            <span>{product.rating}</span>
          </div>
          <div className="flex items-center gap-1">
            <Users className="h-3.5 w-3.5" />
            <span>{product.sales}</span>
          </div>
        </div>

        {/* Price */}
        <div className="flex items-end justify-between pt-3 border-t">
          <div>
            <span className="text-xs text-muted-foreground line-through block">
              ₩{product.originalPrice.toLocaleString()}
            </span>
            <span className="text-lg font-bold">₩{product.price.toLocaleString()}</span>
          </div>
          <Button size="sm" className="btn-primary">
            구매
          </Button>
        </div>
      </div>
    </div>
  );
}
