'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { X } from 'lucide-react';
import { cn } from '@/lib/utils';
import type { LottoBannerSettings } from '@/types/settings';
import { DEFAULT_LOTTO_BANNER_SETTINGS } from '@/types/settings';

interface LottoBannerProps {
  locale?: string;
  className?: string;
}

export function LottoBanner({ locale = 'ko', className }: LottoBannerProps) {
  const [settings, setSettings] = useState<LottoBannerSettings>(DEFAULT_LOTTO_BANNER_SETTINGS);
  const [dismissed, setDismissed] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadSettings() {
      try {
        const res = await fetch('/api/admin/settings?key=lotto_banner');
        if (res.ok) {
          const data = await res.json();
          if (data.value) {
            setSettings(data.value);
          }
        }
      } catch (e) {
        console.error('Failed to load banner settings:', e);
      } finally {
        setLoading(false);
      }
    }
    loadSettings();
  }, []);

  // 배너가 비활성화되었거나 닫혔으면 표시하지 않음
  if (loading || !settings.enabled || dismissed || !settings.imageUrl) {
    return null;
  }

  const altText = settings.altText?.[locale as keyof typeof settings.altText] || 'Lotto Banner';

  const bannerContent = (
    <div
      className={cn(
        'relative w-full overflow-hidden',
        settings.style?.borderRadius && `rounded-[${settings.style.borderRadius}]`,
        className
      )}
      style={{
        maxHeight: settings.style?.maxHeight || '200px',
        borderRadius: settings.style?.borderRadius || '12px',
      }}
    >
      <Image
        src={settings.imageUrl}
        alt={altText}
        width={1200}
        height={200}
        className="w-full h-auto object-cover"
        priority
      />
      <button
        onClick={(e) => {
          e.preventDefault();
          e.stopPropagation();
          setDismissed(true);
        }}
        className="absolute top-2 right-2 p-1.5 bg-black/50 hover:bg-black/70 rounded-full text-white transition-colors"
        aria-label="배너 닫기"
      >
        <X className="h-4 w-4" />
      </button>
    </div>
  );

  // 링크가 있으면 Link로 감싸기
  if (settings.linkUrl) {
    return (
      <Link href={settings.linkUrl} className="block mb-6">
        {bannerContent}
      </Link>
    );
  }

  return <div className="mb-6">{bannerContent}</div>;
}
