// ===== Site Settings Types =====

export type SettingKey =
  | 'pricing'
  | 'lotto_banner'
  | 'site_general'
  | 'notification'
  | 'feature_flags'
  | 'service_card_images'
  | 'fortune_slides';

// 가격 설정 타입
export interface ServicePriceSettings {
  // 사주 분석 가격
  saju: {
    basic: PriceConfig;
    deep: PriceConfig;
    premium: PriceConfig;
  };
  // 관상 분석 가격
  face: {
    basic: PriceConfig;
  };
  // 통합 분석 가격
  integrated: {
    standard: PriceConfig;
  };
  // 궁합 분석 가격
  compatibility: {
    standard: PriceConfig;
    group: PriceConfig;
  };
  // 구독 가격
  subscription: {
    basic: PriceConfig;
    pro: PriceConfig;
    premium: PriceConfig;
  };
  // 코인 패키지
  coins: {
    c100: CoinPackageConfig;
    c500: CoinPackageConfig;
    c1000: CoinPackageConfig;
    c3000: CoinPackageConfig;
  };
  // 글로벌 할인 설정
  globalDiscount?: {
    enabled: boolean;
    percent: number;
    expiresAt?: string;
    message?: {
      ko: string;
      ja: string;
      en: string;
    };
  };
}

export interface PriceConfig {
  krw: number;
  jpy: number;
  usd: number;
  discountPercent?: number;
  isActive: boolean;
}

export interface CoinPackageConfig extends PriceConfig {
  coins: number;
  bonus: number;
}

// 로또 배너 설정 타입
export interface LottoBannerSettings {
  enabled: boolean;
  imageUrl?: string;
  linkUrl?: string;
  altText?: {
    ko: string;
    ja: string;
    en: string;
  };
  position: 'top' | 'bottom';
  style?: {
    borderRadius?: string;
    maxHeight?: string;
  };
}

// 사이트 일반 설정 타입
export interface SiteGeneralSettings {
  siteName: {
    ko: string;
    ja: string;
    en: string;
  };
  siteDescription: {
    ko: string;
    ja: string;
    en: string;
  };
  maintenanceMode: boolean;
  maintenanceMessage?: {
    ko: string;
    ja: string;
    en: string;
  };
  socialLinks?: {
    twitter?: string;
    instagram?: string;
    youtube?: string;
    facebook?: string;
  };
  contactEmail?: string;
  analytics?: {
    googleAnalyticsId?: string;
    mixpanelToken?: string;
  };
}

// 알림 설정 타입
export interface NotificationSettings {
  email: {
    enabled: boolean;
    welcomeEmail: boolean;
    analysisComplete: boolean;
    promotions: boolean;
  };
  push: {
    enabled: boolean;
    dailyFortune: boolean;
    lottoResults: boolean;
    promotions: boolean;
  };
}

// 기능 플래그 타입
export interface FeatureFlagSettings {
  animalDna: boolean;
  lottoAi: boolean;
  faceReading: boolean;
  groupCompatibility: boolean;
  audioReport: boolean;
  pdfReport: boolean;
  expertConsultation: boolean;
}

// 전체 사이트 설정 타입
export interface SiteSettings {
  pricing: ServicePriceSettings;
  lottoBanner: LottoBannerSettings;
  siteGeneral: SiteGeneralSettings;
  notification: NotificationSettings;
  featureFlags: FeatureFlagSettings;
  updatedAt: string;
}

// DB Row 타입
export interface SiteSettingRow {
  id: string;
  key: SettingKey;
  value: Record<string, unknown>;
  created_at: string;
  updated_at: string;
  updated_by?: string | null;
}

// 기본값
export const DEFAULT_PRICE_SETTINGS: ServicePriceSettings = {
  saju: {
    basic: { krw: 5900, jpy: 650, usd: 4.99, discountPercent: 30, isActive: true },
    deep: { krw: 12900, jpy: 1430, usd: 10.99, discountPercent: 30, isActive: true },
    premium: { krw: 24900, jpy: 2750, usd: 19.99, discountPercent: 30, isActive: true },
  },
  face: {
    basic: { krw: 5900, jpy: 650, usd: 4.99, isActive: true },
  },
  integrated: {
    standard: { krw: 14900, jpy: 1650, usd: 12.99, discountPercent: 30, isActive: true },
  },
  compatibility: {
    standard: { krw: 9900, jpy: 1100, usd: 8.99, discountPercent: 30, isActive: true },
    group: { krw: 39900, jpy: 4400, usd: 32.99, isActive: true },
  },
  subscription: {
    basic: { krw: 4900, jpy: 550, usd: 3.99, isActive: true },
    pro: { krw: 9900, jpy: 1100, usd: 7.99, isActive: true },
    premium: { krw: 19900, jpy: 2200, usd: 15.99, isActive: true },
  },
  coins: {
    c100: { krw: 1100, jpy: 120, usd: 0.99, coins: 100, bonus: 10, isActive: true },
    c500: { krw: 4500, jpy: 500, usd: 3.99, coins: 500, bonus: 100, isActive: true },
    c1000: { krw: 7900, jpy: 880, usd: 6.99, coins: 1000, bonus: 300, isActive: true },
    c3000: { krw: 19900, jpy: 2200, usd: 15.99, coins: 3000, bonus: 1200, isActive: true },
  },
};

export const DEFAULT_LOTTO_BANNER_SETTINGS: LottoBannerSettings = {
  enabled: false,
  position: 'top',
  style: {
    borderRadius: '12px',
    maxHeight: '200px',
  },
};

export const DEFAULT_FEATURE_FLAGS: FeatureFlagSettings = {
  animalDna: true,
  lottoAi: true,
  faceReading: true,
  groupCompatibility: true,
  audioReport: true,
  pdfReport: true,
  expertConsultation: false,
};

/**
 * 서비스 카드 이미지 설정 타입
 * 새로운 컨텐츠 추가 시 여기에 키를 추가하세요
 */
export interface ServiceCardImages {
  // 기본 서비스
  daily_fortune?: string;     // 오늘의 운세
  saju_basic?: string;        // 사주 분석
  saju_advanced?: string;     // 정통 사주
  ai_chat?: string;           // AI 사주 상담
  compatibility?: string;     // 궁합 분석
  tarot?: string;             // 타로 점
  lotto?: string;             // 로또 분석

  // 추가 컨텐츠
  mbti?: string;              // MBTI 분석
  tti?: string;               // 띠별 운세
  newyear?: string;           // 신년운세
  animal_dna?: string;        // AI 동물 DNA

  // 향후 추가될 컨텐츠를 위한 인덱스 시그니처
  [key: string]: string | undefined;
}

/**
 * 서비스 카드 정보 타입
 */
export interface ServiceCardInfo {
  id: string;
  title: string;
  subtitle?: string;
  description?: string;
  href: string;
  buttonText: string;
  price?: string;
  priceColor?: string;
  gradient: string;
  shadowColor?: string;
  isPremium?: boolean;
}

/**
 * 슬라이드 이미지 설정 타입
 * 통합 분석 페이지 상단 슬라이드용
 */
export interface SlideImage {
  id: string;
  url: string;
  title?: string;
  description?: string;
  link?: string;
  order: number;
}

export interface FortuneSlideSettings {
  slides: SlideImage[];
  autoPlay?: boolean;
  autoPlayInterval?: number;  // 밀리초 단위
}
