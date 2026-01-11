'use client';

import React, { useState, Suspense, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { useSearchParams } from 'next/navigation';
import { Star, Trophy, ExternalLink, Check, X, Sparkles, ArrowRight } from 'lucide-react';
import { cn } from '@/lib/utils';
import { aiToolsData, categoryLabels, categorySubtitles, AITool, defaultWebsites } from '@/lib/data/aiTools';
import { Link } from '@/i18n/routing';
import { useToolLogos } from '@/lib/hooks/useToolLogos';

// Category color schemes for visual distinction
const categoryColors: Record<string, { bg: string; border: string; tag: string; gradient: string }> = {
  writing: {
    bg: 'bg-blue-50 dark:bg-blue-950/30',
    border: 'border-blue-200 dark:border-blue-800',
    tag: 'bg-blue-100 text-blue-700 dark:bg-blue-900/50 dark:text-blue-300',
    gradient: 'from-blue-500 to-blue-600'
  },
  image: {
    bg: 'bg-purple-50 dark:bg-purple-950/30',
    border: 'border-purple-200 dark:border-purple-800',
    tag: 'bg-purple-100 text-purple-700 dark:bg-purple-900/50 dark:text-purple-300',
    gradient: 'from-purple-500 to-purple-600'
  },
  audio: {
    bg: 'bg-pink-50 dark:bg-pink-950/30',
    border: 'border-pink-200 dark:border-pink-800',
    tag: 'bg-pink-100 text-pink-700 dark:bg-pink-900/50 dark:text-pink-300',
    gradient: 'from-pink-500 to-pink-600'
  },
  website: {
    bg: 'bg-cyan-50 dark:bg-cyan-950/30',
    border: 'border-cyan-200 dark:border-cyan-800',
    tag: 'bg-cyan-100 text-cyan-700 dark:bg-cyan-900/50 dark:text-cyan-300',
    gradient: 'from-cyan-500 to-cyan-600'
  },
  coding: {
    bg: 'bg-green-50 dark:bg-green-950/30',
    border: 'border-green-200 dark:border-green-800',
    tag: 'bg-green-100 text-green-700 dark:bg-green-900/50 dark:text-green-300',
    gradient: 'from-green-500 to-green-600'
  },
  automation: {
    bg: 'bg-orange-50 dark:bg-orange-950/30',
    border: 'border-orange-200 dark:border-orange-800',
    tag: 'bg-orange-100 text-orange-700 dark:bg-orange-900/50 dark:text-orange-300',
    gradient: 'from-orange-500 to-orange-600'
  },
  education: {
    bg: 'bg-indigo-50 dark:bg-indigo-950/30',
    border: 'border-indigo-200 dark:border-indigo-800',
    tag: 'bg-indigo-100 text-indigo-700 dark:bg-indigo-900/50 dark:text-indigo-300',
    gradient: 'from-indigo-500 to-indigo-600'
  },
  marketing: {
    bg: 'bg-rose-50 dark:bg-rose-950/30',
    border: 'border-rose-200 dark:border-rose-800',
    tag: 'bg-rose-100 text-rose-700 dark:bg-rose-900/50 dark:text-rose-300',
    gradient: 'from-rose-500 to-rose-600'
  },
  platform: {
    bg: 'bg-amber-50 dark:bg-amber-950/30',
    border: 'border-amber-200 dark:border-amber-800',
    tag: 'bg-amber-100 text-amber-700 dark:bg-amber-900/50 dark:text-amber-300',
    gradient: 'from-amber-500 to-amber-600'
  },
};

// Hook to get referral URLs from localStorage (can be managed by admin)
function useReferralUrls() {
  const [referralUrls, setReferralUrls] = useState<Record<string, string>>({});

  useEffect(() => {
    const stored = localStorage.getItem('ai-referral-urls');
    if (stored) {
      try {
        setReferralUrls(JSON.parse(stored));
      } catch (e) {
        console.error('Failed to parse referral URLs:', e);
      }
    }
  }, []);

  return referralUrls;
}

function ToolCard({ tool, rank, showCategoryColor = false }: { tool: AITool; rank: number; showCategoryColor?: boolean }) {
  const isTopThree = rank <= 3;
  const [imageError, setImageError] = useState(false);
  const [isHovered, setIsHovered] = useState(false);
  const [tooltipPosition, setTooltipPosition] = useState({ top: 0, left: 0 });
  const cardRef = React.useRef<HTMLDivElement>(null);
  const referralUrls = useReferralUrls();
  const { getToolLogo, isLoaded: logosLoaded } = useToolLogos();

  const colors = categoryColors[tool.category] || categoryColors.writing;

  // Calculate tooltip position when hovered (right-aligned with card)
  const handleMouseEnter = () => {
    if (cardRef.current) {
      const rect = cardRef.current.getBoundingClientRect();
      setTooltipPosition({
        top: rect.bottom + window.scrollY + 8,
        left: rect.right + window.scrollX, // Align right edges
      });
    }
    setIsHovered(true);
  };

  // Get the URL to navigate to (referral URL if set, otherwise default)
  const getNavigationUrl = () => {
    return referralUrls[tool.name] || tool.website || defaultWebsites[tool.name] || '#';
  };

  // Custom logo from admin settings (Supabase Storage) - PRIORITY 1
  const customLogo = logosLoaded ? getToolLogo(tool.name) : null;

  // Fallback URL from tool data - PRIORITY 2
  const fallbackUrl = tool.logo;

  // Simple logo URL selection: custom > fallback
  const logoUrl = customLogo || fallbackUrl;

  // Debug: log custom logo lookup
  useEffect(() => {
    if (logosLoaded && rank <= 5) {
      console.log(`[ToolCard] ${tool.name}: customLogo=${customLogo ? 'YES' : 'NO'}, logoUrl=${logoUrl?.substring(0, 50)}...`);
    }
  }, [logosLoaded, customLogo, logoUrl, tool.name, rank]);

  // Reset error state when logo URL changes
  useEffect(() => {
    setImageError(false);
  }, [logoUrl]);

  const getTrophyIcon = () => {
    if (rank === 1) return <Trophy className="h-5 w-5 trophy-gold" />;
    if (rank === 2) return <Trophy className="h-5 w-5 trophy-silver" />;
    if (rank === 3) return <Trophy className="h-5 w-5 trophy-bronze" />;
    return null;
  };

  const getCategoryLabel = (cat: string) => {
    const labels: Record<string, string> = {
      writing: '글쓰기',
      image: '이미지/영상',
      audio: '음원',
      website: '홈페이지',
      coding: 'AI코딩',
      automation: '업무/자동화',
      education: '교육',
      marketing: '마케팅/광고',
      platform: 'AI 플랫폼',
    };
    return labels[cat] || cat;
  };

  const handleCardClick = () => {
    const url = getNavigationUrl();
    if (url && url !== '#') {
      window.open(url, '_blank', 'noopener,noreferrer');
    }
  };

  return (
    <div ref={cardRef} className="relative group">
      <div
        onClick={handleCardClick}
        onMouseEnter={handleMouseEnter}
        onMouseLeave={() => setIsHovered(false)}
        className={cn(
          'rank-card p-5 animate-fade-in-up cursor-pointer transition-all duration-300',
          'hover:scale-[1.02] hover:shadow-xl',
          showCategoryColor && colors.bg,
          showCategoryColor && colors.border,
          !showCategoryColor && isTopThree && rank === 1 && 'rank-1',
          !showCategoryColor && isTopThree && rank === 2 && 'rank-2',
          !showCategoryColor && isTopThree && rank === 3 && 'rank-3'
        )}
        style={{ animationDelay: `${(rank - 1) * 50}ms` }}
      >
        {/* Top Row - Trophy & Category */}
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            {isTopThree && getTrophyIcon()}
          </div>
          <span className={cn(
            'inline-flex items-center px-3 py-1 rounded-full text-xs font-medium',
            showCategoryColor ? colors.tag : 'category-tag'
          )}>
            {getCategoryLabel(tool.category)}
          </span>
        </div>

        {/* Logo & Info */}
        <div className="flex items-start gap-4 mb-3">
          <div className="logo-container">
            {logoUrl && !imageError ? (
              <img
                src={logoUrl}
                alt={`${tool.name} logo`}
                className="w-full h-full object-contain p-1"
                onError={() => setImageError(true)}
              />
            ) : (
              <span className="text-lg font-bold text-muted-foreground">
                {tool.name.substring(0, 2).toUpperCase()}
              </span>
            )}
          </div>
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2">
              <h3 className="font-bold text-lg truncate">{tool.name}</h3>
              <ExternalLink className="h-4 w-4 text-muted-foreground opacity-0 group-hover:opacity-100 transition-opacity" />
            </div>
            <div className="flex items-center gap-2 mt-1">
              <div className="rating">
                <Star className="h-4 w-4 rating-star" />
                <span className="text-sm font-medium">{tool.rating}</span>
              </div>
              <span className="price-tag text-sm">{tool.price}</span>
            </div>
          </div>
        </div>

        {/* Description */}
        <p className="text-sm text-muted-foreground line-clamp-2">
          {tool.description}
        </p>

        {/* Visit Link Indicator */}
        <div className="mt-3 flex items-center justify-between">
          <span className="text-xs text-muted-foreground">{tool.company}</span>
          <span className="text-xs text-primary flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
            <ExternalLink className="h-3 w-3" />
            방문하기
          </span>
        </div>
      </div>

      {/* Hover Tooltip - Portal to body for z-index */}
      {isHovered && typeof document !== 'undefined' && createPortal(
        <div
          className="fixed w-80 z-[9999] pointer-events-none"
          style={{
            top: tooltipPosition.top,
            left: tooltipPosition.left,
            transform: 'translateX(-100%)', // Right-align with card
            animation: 'fade-in-down 150ms ease-out forwards'
          }}
        >
          {/* Arrow pointing up - positioned towards right */}
          <div className="absolute right-8 -top-2 w-0 h-0 border-l-8 border-r-8 border-b-8 border-l-transparent border-r-transparent border-b-white dark:border-b-gray-800" />

          <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl shadow-2xl p-4 space-y-3">
            {/* Header */}
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-gray-100 dark:bg-gray-700 flex items-center justify-center overflow-hidden">
                {logoUrl && logoState !== 'initials' ? (
                  <img src={logoUrl} alt={tool.name} className="w-8 h-8 object-contain" />
                ) : (
                  <span className="text-sm font-bold text-gray-500 dark:text-gray-400">
                    {tool.name.substring(0, 2).toUpperCase()}
                  </span>
                )}
              </div>
              <div>
                <h4 className="font-bold text-gray-900 dark:text-white">{tool.name}</h4>
                <p className="text-xs text-gray-500 dark:text-gray-400">{tool.company} · {tool.price}</p>
              </div>
            </div>

            {/* Detailed Description or Basic Description */}
            <p className="text-sm text-gray-600 dark:text-gray-300 leading-relaxed">
              {tool.detailedDescription || tool.description}
            </p>

            {/* Features */}
            {tool.features && tool.features.length > 0 && (
              <div>
                <h5 className="text-xs font-semibold text-gray-900 dark:text-white mb-2 flex items-center gap-1">
                  <Sparkles className="h-3 w-3" />
                  주요 기능
                </h5>
                <div className="flex flex-wrap gap-1">
                  {tool.features.slice(0, 5).map((feature, i) => (
                    <span key={i} className="text-xs bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 px-2 py-0.5 rounded-full">
                      {feature}
                    </span>
                  ))}
                </div>
              </div>
            )}

            {/* Pros & Cons */}
            {((tool.pros && tool.pros.length > 0) || (tool.cons && tool.cons.length > 0)) && (
              <div className="grid grid-cols-2 gap-2">
                {tool.pros && tool.pros.length > 0 && (
                  <div>
                    <h5 className="text-xs font-semibold text-green-600 dark:text-green-400 mb-1">장점</h5>
                    <ul className="space-y-0.5">
                      {tool.pros.slice(0, 3).map((pro, i) => (
                        <li key={i} className="text-xs text-gray-600 dark:text-gray-300 flex items-start gap-1">
                          <Check className="h-3 w-3 text-green-500 mt-0.5 flex-shrink-0" />
                          <span>{pro}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
                {tool.cons && tool.cons.length > 0 && (
                  <div>
                    <h5 className="text-xs font-semibold text-red-600 dark:text-red-400 mb-1">단점</h5>
                    <ul className="space-y-0.5">
                      {tool.cons.slice(0, 3).map((con, i) => (
                        <li key={i} className="text-xs text-gray-600 dark:text-gray-300 flex items-start gap-1">
                          <X className="h-3 w-3 text-red-500 mt-0.5 flex-shrink-0" />
                          <span>{con}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>
            )}

            {/* Click to visit */}
            <div className="pt-2 border-t border-gray-200 dark:border-gray-700">
              <p className="text-xs text-amber-500 text-center flex items-center justify-center gap-1">
                <ExternalLink className="h-3 w-3" />
                클릭하여 사이트 방문
              </p>
            </div>
          </div>
        </div>,
        document.body
      )}
    </div>
  );
}

// Category Section for "All" view
function CategorySection({ categoryKey, tools }: { categoryKey: string; tools: AITool[] }) {
  const colors = categoryColors[categoryKey] || categoryColors.writing;
  const categoryLabel = {
    writing: '글쓰기',
    image: '이미지/영상',
    audio: '음원',
    website: '홈페이지',
    coding: 'AI코딩',
    automation: '업무/자동화',
    education: '교육',
    marketing: '마케팅/광고',
    platform: 'AI 플랫폼',
  }[categoryKey] || categoryKey;

  return (
    <div className="mb-10 animate-fade-in-up">
      {/* Category Header */}
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-3">
          <div className={cn('w-1.5 h-8 rounded-full bg-gradient-to-b', colors.gradient)} />
          <h2 className="text-xl font-bold text-foreground">{categoryLabel}</h2>
          <span className={cn('px-2 py-0.5 rounded-full text-xs font-medium', colors.tag)}>
            TOP 3
          </span>
        </div>
        <Link
          href={`/ranking?category=${categoryKey}`}
          className="text-sm text-muted-foreground hover:text-primary flex items-center gap-1 transition-colors"
        >
          더보기
          <ArrowRight className="h-4 w-4" />
        </Link>
      </div>

      {/* Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {tools.slice(0, 3).map((tool, index) => (
          <ToolCard key={tool.id} tool={tool} rank={index + 1} showCategoryColor />
        ))}
      </div>
    </div>
  );
}

function RankingContent() {
  const searchParams = useSearchParams();
  const category = searchParams.get('category') || 'all';

  // For "all" view, show categorized sections
  if (category === 'all') {
    const categoryOrder = ['writing', 'image', 'audio', 'coding', 'website', 'automation', 'education', 'marketing', 'platform'];

    return (
      <>
        {/* Section Header */}
        <div className="section-header animate-fade-in-up mb-8">
          <h1 className="section-title">{categoryLabels.all}</h1>
          <p className="section-subtitle">카테고리별 TOP 3 AI 도구를 한눈에 확인하세요</p>
        </div>

        {/* Category Sections */}
        {categoryOrder.map((catKey) => {
          const tools = aiToolsData[catKey];
          if (!tools || tools.length === 0) return null;
          return <CategorySection key={catKey} categoryKey={catKey} tools={tools} />;
        })}
      </>
    );
  }

  // For specific category view
  const tools = aiToolsData[category] || aiToolsData.all;

  return (
    <>
      {/* Section Header */}
      <div className="section-header animate-fade-in-up">
        <h1 className="section-title">{categoryLabels[category] || categoryLabels.all}</h1>
        <p className="section-subtitle">{categorySubtitles[category] || categorySubtitles.all}</p>
      </div>

      {/* Tools Grid */}
      <div className="grid-cards">
        {tools.map((tool, index) => (
          <ToolCard key={tool.id} tool={tool} rank={index + 1} />
        ))}
      </div>
    </>
  );
}

function RankingFallback() {
  return (
    <>
      <div className="section-header animate-fade-in-up">
        <div className="h-10 w-64 bg-secondary rounded animate-pulse mx-auto mb-4"></div>
        <div className="h-6 w-96 bg-secondary rounded animate-pulse mx-auto"></div>
      </div>
      <div className="grid-cards">
        {[...Array(8)].map((_, i) => (
          <div key={i} className="rank-card p-5 animate-pulse">
            <div className="flex justify-between mb-4">
              <div className="h-6 w-6 bg-secondary rounded"></div>
              <div className="h-6 w-16 bg-secondary rounded"></div>
            </div>
            <div className="flex gap-4 mb-3">
              <div className="w-12 h-12 bg-secondary rounded-lg"></div>
              <div className="flex-1">
                <div className="h-6 bg-secondary rounded mb-2"></div>
                <div className="h-4 w-24 bg-secondary rounded"></div>
              </div>
            </div>
            <div className="h-10 bg-secondary rounded"></div>
          </div>
        ))}
      </div>
    </>
  );
}

export default function RankingPage() {
  return (
    <div className="content-area">
      <Suspense fallback={<RankingFallback />}>
        <RankingContent />
      </Suspense>
    </div>
  );
}
