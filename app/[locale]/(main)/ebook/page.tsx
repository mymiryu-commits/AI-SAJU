'use client';

import { useState } from 'react';
import { BookOpen, Star, Download, Eye, ShoppingCart, Check, Sparkles } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

const ebooks = [
  {
    id: '1',
    title: 'AI 수익화 완벽 가이드',
    subtitle: '2024년 최신 업데이트',
    description: 'ChatGPT, Claude, Midjourney를 활용한 월 1,000만원 수익화 전략. 실제 성공 사례와 단계별 가이드 수록.',
    price: 39900,
    originalPrice: 89000,
    rating: 4.9,
    reviews: 324,
    downloads: 2847,
    pages: 186,
    chapters: 12,
    features: [
      '12개 챕터 186페이지 분량',
      '실제 수익 인증 자료 포함',
      '무료 업데이트 평생 제공',
      '1:1 질문 답변 지원',
    ],
    badge: 'BEST SELLER',
    gradient: 'from-amber-500 to-orange-500',
  },
  {
    id: '2',
    title: '쇼츠 자동화 시스템',
    subtitle: '얼굴 없이 시작하는',
    description: 'AI로 완전 자동화된 유튜브 쇼츠 채널 운영법. 스크립트 작성부터 영상 제작까지 A to Z.',
    price: 29900,
    originalPrice: 59000,
    rating: 4.8,
    reviews: 189,
    downloads: 1523,
    pages: 124,
    chapters: 8,
    features: [
      '8개 챕터 124페이지 분량',
      '자동화 템플릿 10종 제공',
      '수익 채널 사례 분석',
      '프롬프트 모음집 포함',
    ],
    badge: 'NEW',
    gradient: 'from-rose-500 to-pink-500',
  },
  {
    id: '3',
    title: 'AI 이미지 수익화',
    subtitle: 'Midjourney & DALL-E 마스터',
    description: 'AI 이미지 생성부터 판매까지. 스톡 이미지, NFT, 굿즈 제작 등 다양한 수익화 방법 총정리.',
    price: 34900,
    originalPrice: 69000,
    rating: 4.7,
    reviews: 156,
    downloads: 1234,
    pages: 142,
    chapters: 10,
    features: [
      '10개 챕터 142페이지 분량',
      '프롬프트 500개 포함',
      '판매 플랫폼 가이드',
      '저작권 이슈 총정리',
    ],
    badge: 'HOT',
    gradient: 'from-violet-500 to-purple-500',
  },
  {
    id: '4',
    title: 'AI 블로그 수익화',
    subtitle: '애드센스 & 쿠팡파트너스',
    description: 'AI로 하루 10개 포스팅하고 월 500만원 만들기. SEO 최적화와 수익 자동화 전략 수록.',
    price: 24900,
    originalPrice: 49000,
    rating: 4.6,
    reviews: 234,
    downloads: 1876,
    pages: 98,
    chapters: 7,
    features: [
      '7개 챕터 98페이지 분량',
      'SEO 키워드 리서치 방법',
      '자동 포스팅 시스템 구축',
      '수익 최적화 A/B 테스트',
    ],
    badge: null,
    gradient: 'from-emerald-500 to-teal-500',
  },
  {
    id: '5',
    title: 'AI 프롬프트 마스터',
    subtitle: '전문가처럼 AI 활용하기',
    description: '프롬프트 엔지니어링 A to Z. ChatGPT, Claude, Midjourney 프롬프트 작성법과 최적화 기법.',
    price: 19900,
    originalPrice: 39000,
    rating: 4.8,
    reviews: 312,
    downloads: 2156,
    pages: 112,
    chapters: 9,
    features: [
      '9개 챕터 112페이지 분량',
      '프롬프트 템플릿 200개',
      '카테고리별 프롬프트 정리',
      '프롬프트 판매 가이드',
    ],
    badge: null,
    gradient: 'from-sky-500 to-blue-500',
  },
  {
    id: '6',
    title: 'AI SaaS 창업 가이드',
    subtitle: 'Cursor로 개발부터 런칭까지',
    description: '코딩 경험 없이 AI로 SaaS 서비스 만들기. 아이디어 발굴부터 수익화까지 완벽 가이드.',
    price: 49900,
    originalPrice: 99000,
    rating: 4.9,
    reviews: 87,
    downloads: 654,
    pages: 210,
    chapters: 15,
    features: [
      '15개 챕터 210페이지 분량',
      '실제 SaaS 프로젝트 튜토리얼',
      '마케팅 & 런칭 전략',
      '월정액 수익 모델 설계',
    ],
    badge: 'PREMIUM',
    gradient: 'from-indigo-500 to-purple-500',
  },
];

const bundles = [
  {
    id: 'bundle-1',
    title: '올인원 번들',
    description: '모든 E-Book 포함',
    ebooks: ['1', '2', '3', '4', '5', '6'],
    price: 129000,
    originalPrice: 298900,
    discount: 57,
  },
  {
    id: 'bundle-2',
    title: '수익화 스타터',
    description: '입문자 추천 번들',
    ebooks: ['1', '4', '5'],
    price: 59900,
    originalPrice: 177000,
    discount: 66,
  },
  {
    id: 'bundle-3',
    title: '크리에이터 번들',
    description: '콘텐츠 제작 집중',
    ebooks: ['2', '3'],
    price: 49900,
    originalPrice: 128000,
    discount: 61,
  },
];

export default function EbookPage() {
  const [selectedBundle, setSelectedBundle] = useState<string | null>(null);

  return (
    <div className="content-area">
      {/* Header */}
      <div className="section-header animate-fade-in-up">
        <div className="inline-flex items-center gap-2 px-4 py-2 bg-primary/10 rounded-full mb-4">
          <Sparkles className="h-4 w-4 text-primary" />
          <span className="text-sm font-medium">프리미엄 콘텐츠</span>
        </div>
        <h1 className="section-title">수익화 E-Book</h1>
        <p className="section-subtitle">검증된 AI 수익화 노하우를 담은 프리미엄 전자책</p>
      </div>

      {/* Bundle Section */}
      <div className="mb-12 animate-fade-in-up animation-delay-100">
        <h2 className="text-xl font-bold mb-4">번들 패키지</h2>
        <div className="grid md:grid-cols-3 gap-4">
          {bundles.map((bundle) => (
            <div
              key={bundle.id}
              className={cn(
                'rank-card p-5 cursor-pointer transition-all',
                selectedBundle === bundle.id && 'ring-2 ring-primary'
              )}
              onClick={() => setSelectedBundle(bundle.id)}
            >
              <div className="flex items-center justify-between mb-3">
                <span className="text-xs font-bold text-white bg-gradient-to-r from-rose-500 to-orange-500 px-2 py-1 rounded">
                  -{bundle.discount}%
                </span>
                <span className="text-xs text-muted-foreground">{bundle.ebooks.length}권 포함</span>
              </div>
              <h3 className="font-bold text-lg mb-1">{bundle.title}</h3>
              <p className="text-sm text-muted-foreground mb-3">{bundle.description}</p>
              <div className="flex items-end gap-2">
                <span className="text-2xl font-bold">₩{bundle.price.toLocaleString()}</span>
                <span className="text-sm text-muted-foreground line-through">
                  ₩{bundle.originalPrice.toLocaleString()}
                </span>
              </div>
              <Button className="w-full mt-4 btn-primary">
                <ShoppingCart className="h-4 w-4 mr-2" />
                구매하기
              </Button>
            </div>
          ))}
        </div>
      </div>

      {/* E-Books Grid */}
      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
        {ebooks.map((ebook, index) => (
          <div
            key={ebook.id}
            className="rank-card overflow-hidden animate-fade-in-up"
            style={{ animationDelay: `${(index + 2) * 100}ms` }}
          >
            {/* Cover Gradient */}
            <div className={cn('h-32 bg-gradient-to-br relative', ebook.gradient)}>
              <div className="absolute inset-0 flex items-center justify-center">
                <BookOpen className="h-16 w-16 text-white/30" />
              </div>
              {ebook.badge && (
                <span className="absolute top-3 left-3 text-xs font-bold text-white bg-black/30 backdrop-blur px-2 py-1 rounded">
                  {ebook.badge}
                </span>
              )}
            </div>

            {/* Content */}
            <div className="p-5">
              <p className="text-xs text-muted-foreground mb-1">{ebook.subtitle}</p>
              <h3 className="font-bold text-lg mb-2">{ebook.title}</h3>
              <p className="text-sm text-muted-foreground mb-4 line-clamp-2">{ebook.description}</p>

              {/* Stats */}
              <div className="flex items-center gap-4 mb-4 text-sm text-muted-foreground">
                <div className="flex items-center gap-1">
                  <Star className="h-4 w-4 rating-star" />
                  <span>{ebook.rating}</span>
                  <span>({ebook.reviews})</span>
                </div>
                <div className="flex items-center gap-1">
                  <Download className="h-4 w-4" />
                  <span>{ebook.downloads.toLocaleString()}</span>
                </div>
              </div>

              {/* Features */}
              <div className="space-y-2 mb-4">
                {ebook.features.slice(0, 2).map((feature, i) => (
                  <div key={i} className="flex items-center gap-2 text-sm">
                    <Check className="h-4 w-4 text-green-500" />
                    <span>{feature}</span>
                  </div>
                ))}
              </div>

              {/* Price & CTA */}
              <div className="flex items-end justify-between pt-4 border-t">
                <div>
                  <span className="text-xs text-muted-foreground line-through block">
                    ₩{ebook.originalPrice.toLocaleString()}
                  </span>
                  <span className="text-xl font-bold">₩{ebook.price.toLocaleString()}</span>
                </div>
                <div className="flex gap-2">
                  <Button variant="outline" size="sm">
                    <Eye className="h-4 w-4" />
                  </Button>
                  <Button size="sm" className="btn-primary">
                    구매
                  </Button>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
