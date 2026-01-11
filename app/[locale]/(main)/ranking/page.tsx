'use client';

import { useState, Suspense, useEffect } from 'react';
import { useSearchParams } from 'next/navigation';
import { Star, Trophy, ExternalLink, Check, X, Sparkles } from 'lucide-react';
import { cn } from '@/lib/utils';
import { getStorageLogoUrl, getFallbackLogoUrl } from '@/lib/storage/getLogoUrl';
import { aiToolsData, categoryLabels, categorySubtitles, AITool, defaultWebsites } from '@/lib/data/aiTools';

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

function ToolCard({ tool, rank }: { tool: AITool; rank: number }) {
  const isTopThree = rank <= 3;
  const [logoState, setLogoState] = useState<'storage' | 'fallback' | 'initials'>('storage');
  const [isHovered, setIsHovered] = useState(false);
  const referralUrls = useReferralUrls();

  // Get the URL to navigate to (referral URL if set, otherwise default)
  const getNavigationUrl = () => {
    return referralUrls[tool.name] || tool.website || defaultWebsites[tool.name] || '#';
  };

  // Get URLs from the logo system
  const storageUrl = getStorageLogoUrl(tool.name);
  const fallbackUrl = getFallbackLogoUrl(tool.name) || tool.logo;

  const handleImageError = () => {
    if (logoState === 'storage') {
      setLogoState('fallback');
    } else if (logoState === 'fallback') {
      setLogoState('initials');
    }
  };

  const getCurrentLogoUrl = () => {
    if (logoState === 'storage' && storageUrl) {
      return storageUrl;
    }
    if (logoState === 'fallback' || (logoState === 'storage' && !storageUrl)) {
      return fallbackUrl;
    }
    return null;
  };

  const logoUrl = getCurrentLogoUrl();

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

  const hasDetailedInfo = tool.detailedDescription || (tool.features && tool.features.length > 0);

  return (
    <div className="relative group">
      <div
        onClick={handleCardClick}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
        className={cn(
          'rank-card p-5 animate-fade-in-up cursor-pointer transition-all duration-300',
          'hover:scale-[1.02] hover:shadow-xl hover:z-10',
          rank === 1 && 'rank-1',
          rank === 2 && 'rank-2',
          rank === 3 && 'rank-3'
        )}
        style={{ animationDelay: `${(rank - 1) * 50}ms` }}
      >
        {/* Top Row - Trophy/Rank & Category */}
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            {isTopThree ? getTrophyIcon() : (
              <span className="text-sm font-medium text-muted-foreground">#{rank}</span>
            )}
          </div>
          <span className="category-tag">{getCategoryLabel(tool.category)}</span>
          {isTopThree && (
            <span className="text-sm font-medium text-muted-foreground">#{rank}</span>
          )}
        </div>

        {/* Logo & Info */}
        <div className="flex items-start gap-4 mb-3">
          <div className="logo-container">
            {logoUrl && logoState !== 'initials' ? (
              <img
                src={logoUrl}
                alt={`${tool.name} logo`}
                className="w-full h-full object-contain p-1"
                onError={handleImageError}
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

      {/* Hover Tooltip */}
      {isHovered && hasDetailedInfo && (
        <div
          className="absolute left-1/2 -translate-x-1/2 bottom-full mb-2 w-80 z-50 animate-fade-in-up pointer-events-none"
          style={{ animationDuration: '150ms' }}
        >
          <div className="bg-card border border-border rounded-xl shadow-2xl p-4 space-y-3">
            {/* Header */}
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-secondary flex items-center justify-center overflow-hidden">
                {logoUrl && logoState !== 'initials' ? (
                  <img src={logoUrl} alt={tool.name} className="w-8 h-8 object-contain" />
                ) : (
                  <span className="text-sm font-bold text-muted-foreground">
                    {tool.name.substring(0, 2).toUpperCase()}
                  </span>
                )}
              </div>
              <div>
                <h4 className="font-bold text-foreground">{tool.name}</h4>
                <p className="text-xs text-muted-foreground">{tool.company}</p>
              </div>
            </div>

            {/* Detailed Description */}
            {tool.detailedDescription && (
              <p className="text-sm text-muted-foreground leading-relaxed">
                {tool.detailedDescription}
              </p>
            )}

            {/* Features */}
            {tool.features && tool.features.length > 0 && (
              <div>
                <h5 className="text-xs font-semibold text-foreground mb-2 flex items-center gap-1">
                  <Sparkles className="h-3 w-3" />
                  주요 기능
                </h5>
                <div className="flex flex-wrap gap-1">
                  {tool.features.slice(0, 5).map((feature, i) => (
                    <span key={i} className="text-xs bg-secondary text-secondary-foreground px-2 py-0.5 rounded-full">
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
                        <li key={i} className="text-xs text-muted-foreground flex items-start gap-1">
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
                        <li key={i} className="text-xs text-muted-foreground flex items-start gap-1">
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
            <div className="pt-2 border-t border-border">
              <p className="text-xs text-primary text-center flex items-center justify-center gap-1">
                <ExternalLink className="h-3 w-3" />
                클릭하여 사이트 방문
              </p>
            </div>
          </div>
          {/* Arrow */}
          <div className="absolute left-1/2 -translate-x-1/2 top-full w-0 h-0 border-l-8 border-r-8 border-t-8 border-l-transparent border-r-transparent border-t-border" />
        </div>
      )}
    </div>
  );
}

function RankingContent() {
  const searchParams = useSearchParams();
  const category = searchParams.get('category') || 'all';

  // Get tools for current category
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
