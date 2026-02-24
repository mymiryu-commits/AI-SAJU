'use client';

import { cn } from '@/lib/utils';

export type AdSlot = 'top' | 'bottom' | 'inline' | 'sidebar';
export type AdSize = 'banner' | 'leaderboard' | 'rectangle' | 'skyscraper';

interface AdBannerProps {
  slot: AdSlot;
  size?: AdSize;
  className?: string;
  isPremium?: boolean; // Premium users don't see ads
}

const sizeMap: Record<AdSize, { width: string; height: string }> = {
  banner: { width: 'w-full max-w-[320px]', height: 'h-[50px]' },
  leaderboard: { width: 'w-full max-w-[728px]', height: 'h-[90px]' },
  rectangle: { width: 'w-full max-w-[300px]', height: 'h-[250px]' },
  skyscraper: { width: 'w-[160px]', height: 'h-[600px]' },
};

const defaultSizes: Record<AdSlot, AdSize> = {
  top: 'leaderboard',
  bottom: 'banner',
  inline: 'rectangle',
  sidebar: 'skyscraper',
};

export function AdBanner({ slot, size, className, isPremium = false }: AdBannerProps) {
  // Don't render ads for premium users
  if (isPremium) return null;

  const adSize = size || defaultSizes[slot];
  const dimensions = sizeMap[adSize];

  return (
    <div
      className={cn(
        'flex items-center justify-center mx-auto',
        dimensions.width,
        dimensions.height,
        'bg-muted/30 border border-dashed border-muted-foreground/20 rounded-lg',
        'text-xs text-muted-foreground/50',
        'overflow-hidden',
        className
      )}
      data-ad-slot={slot}
      data-ad-size={adSize}
    >
      {/*
        Production: Replace with actual ad provider script
        - Google AdSense: <ins class="adsbygoogle" ...>
        - Kakao AdFit: <ins class="kakao_ad_area" ...>

        To integrate:
        1. Add ad provider script to app/[locale]/layout.tsx
        2. Replace this placeholder with provider's ad component
        3. Pass slot/size to configure ad unit
      */}
      <div className="text-center p-2">
        <p className="font-medium">AD</p>
        <p className="text-[10px]">{adSize}</p>
      </div>
    </div>
  );
}
