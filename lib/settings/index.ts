// Site Settings Management Utilities
import { createClient } from '@/lib/supabase/client';
import type {
  SettingKey,
  ServicePriceSettings,
  LottoBannerSettings,
  SiteGeneralSettings,
  FeatureFlagSettings,
  DEFAULT_PRICE_SETTINGS,
  DEFAULT_LOTTO_BANNER_SETTINGS,
  DEFAULT_FEATURE_FLAGS,
} from '@/types/settings';

// 캐시 저장소
const settingsCache = new Map<SettingKey, { data: unknown; timestamp: number }>();
const CACHE_TTL = 5 * 60 * 1000; // 5분

// 설정 가져오기 (캐시 포함)
export async function getSetting<T>(key: SettingKey, defaultValue: T): Promise<T> {
  // 캐시 확인
  const cached = settingsCache.get(key);
  if (cached && Date.now() - cached.timestamp < CACHE_TTL) {
    return cached.data as T;
  }

  try {
    const supabase = createClient();
    const { data, error } = await supabase
      .from('site_settings')
      .select('value')
      .eq('key', key)
      .single();

    if (error || !data) {
      return defaultValue;
    }

    // 캐시 저장
    settingsCache.set(key, { data: data.value, timestamp: Date.now() });
    return data.value as T;
  } catch {
    return defaultValue;
  }
}

// 설정 저장하기
export async function setSetting<T extends Record<string, unknown>>(
  key: SettingKey,
  value: T
): Promise<boolean> {
  try {
    const supabase = createClient();
    const { error } = await supabase
      .from('site_settings')
      .upsert({
        key,
        value,
        updated_at: new Date().toISOString(),
      }, {
        onConflict: 'key',
      });

    if (error) {
      console.error('Failed to save setting:', error);
      return false;
    }

    // 캐시 업데이트
    settingsCache.set(key, { data: value, timestamp: Date.now() });
    return true;
  } catch (e) {
    console.error('Failed to save setting:', e);
    return false;
  }
}

// 캐시 무효화
export function invalidateSettingsCache(key?: SettingKey) {
  if (key) {
    settingsCache.delete(key);
  } else {
    settingsCache.clear();
  }
}

// === 편의 함수들 ===

// 가격 설정 가져오기
export async function getPriceSettings(): Promise<ServicePriceSettings> {
  const { DEFAULT_PRICE_SETTINGS } = await import('@/types/settings');
  return getSetting<ServicePriceSettings>('pricing', DEFAULT_PRICE_SETTINGS);
}

// 가격 설정 저장하기
export async function setPriceSettings(settings: ServicePriceSettings): Promise<boolean> {
  return setSetting('pricing', settings as unknown as Record<string, unknown>);
}

// 로또 배너 설정 가져오기
export async function getLottoBannerSettings(): Promise<LottoBannerSettings> {
  const { DEFAULT_LOTTO_BANNER_SETTINGS } = await import('@/types/settings');
  return getSetting<LottoBannerSettings>('lotto_banner', DEFAULT_LOTTO_BANNER_SETTINGS);
}

// 로또 배너 설정 저장하기
export async function setLottoBannerSettings(settings: LottoBannerSettings): Promise<boolean> {
  return setSetting('lotto_banner', settings as unknown as Record<string, unknown>);
}

// 기능 플래그 가져오기
export async function getFeatureFlags(): Promise<FeatureFlagSettings> {
  const { DEFAULT_FEATURE_FLAGS } = await import('@/types/settings');
  return getSetting<FeatureFlagSettings>('feature_flags', DEFAULT_FEATURE_FLAGS);
}

// 기능 플래그 저장하기
export async function setFeatureFlags(settings: FeatureFlagSettings): Promise<boolean> {
  return setSetting('feature_flags', settings as unknown as Record<string, unknown>);
}

// 특정 서비스 가격 가져오기 (통화별)
export async function getServicePrice(
  category: keyof ServicePriceSettings,
  tier: string,
  currency: 'krw' | 'jpy' | 'usd' = 'krw'
): Promise<{ price: number; discountedPrice?: number; discountPercent?: number }> {
  const settings = await getPriceSettings();
  const categorySettings = settings[category] as Record<string, {
    krw: number;
    jpy: number;
    usd: number;
    discountPercent?: number;
  }>;

  if (!categorySettings || !categorySettings[tier]) {
    return { price: 0 };
  }

  const tierConfig = categorySettings[tier];
  const basePrice = tierConfig[currency];

  if (tierConfig.discountPercent) {
    const discountedPrice = Math.round(basePrice * (1 - tierConfig.discountPercent / 100));
    return {
      price: basePrice,
      discountedPrice,
      discountPercent: tierConfig.discountPercent,
    };
  }

  return { price: basePrice };
}

// 가격 포맷팅
export function formatPrice(amount: number, currency: 'krw' | 'jpy' | 'usd'): string {
  const formats: Record<typeof currency, Intl.NumberFormatOptions> = {
    krw: { style: 'currency', currency: 'KRW', maximumFractionDigits: 0 },
    jpy: { style: 'currency', currency: 'JPY', maximumFractionDigits: 0 },
    usd: { style: 'currency', currency: 'USD', minimumFractionDigits: 2 },
  };

  const locales: Record<typeof currency, string> = {
    krw: 'ko-KR',
    jpy: 'ja-JP',
    usd: 'en-US',
  };

  return new Intl.NumberFormat(locales[currency], formats[currency]).format(amount);
}
