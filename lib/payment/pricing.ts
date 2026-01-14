// Pricing configuration for all products
export type Currency = 'krw' | 'jpy' | 'usd';

export interface PriceSet {
  krw: number;
  jpy: number;
  usd: number;
}

export interface ProductConfig {
  id: string;
  name: {
    ko: string;
    ja: string;
    en: string;
  };
  description: {
    ko: string;
    ja: string;
    en: string;
  };
  price: PriceSet;
  discountedPrice?: PriceSet;
  discountPercent?: number;
  features?: string[];
}

// Subscription Tiers
export const SUBSCRIPTION_TIERS: Record<string, ProductConfig> = {
  basic: {
    id: 'sub_basic',
    name: {
      ko: '베이직',
      ja: 'ベーシック',
      en: 'Basic',
    },
    description: {
      ko: '개인 사용자를 위한 기본 플랜',
      ja: '個人ユーザー向けの基本プラン',
      en: 'Basic plan for personal use',
    },
    price: { krw: 4900, jpy: 550, usd: 3.99 },
    features: [
      'daily_fortune',
      'basic_analysis',
      'ad_free',
    ],
  },
  pro: {
    id: 'sub_pro',
    name: {
      ko: '프로',
      ja: 'プロ',
      en: 'Pro',
    },
    description: {
      ko: '더 많은 분석이 필요한 분을 위한 플랜',
      ja: 'より多くの分析が必要な方向けのプラン',
      en: 'For those who need more analyses',
    },
    price: { krw: 9900, jpy: 1100, usd: 7.99 },
    features: [
      'daily_fortune',
      'unlimited_basic_analysis',
      'premium_analysis_discount',
      'ad_free',
      'priority_support',
    ],
  },
  premium: {
    id: 'sub_premium',
    name: {
      ko: '프리미엄',
      ja: 'プレミアム',
      en: 'Premium',
    },
    description: {
      ko: '모든 기능을 무제한으로 이용',
      ja: 'すべての機能を無制限に利用',
      en: 'Unlimited access to all features',
    },
    price: { krw: 19900, jpy: 2200, usd: 15.99 },
    features: [
      'daily_fortune',
      'unlimited_all_analysis',
      'expert_consultation_discount',
      'pdf_reports',
      'audio_reports',
      'ad_free',
      'priority_support',
      'early_access',
    ],
  },
};

// Fortune Analysis Products
export const ANALYSIS_PRODUCTS: Record<string, ProductConfig> = {
  saju_basic: {
    id: 'analysis_saju_basic',
    name: {
      ko: '사주 기본 분석',
      ja: '四柱基本分析',
      en: 'Basic Four Pillars Analysis',
    },
    description: {
      ko: '사주팔자 기본 분석 및 2025년 운세',
      ja: '四柱八字の基本分析と2025年の運勢',
      en: 'Basic Four Pillars analysis with 2025 fortune',
    },
    price: { krw: 5900, jpy: 650, usd: 4.99 },
    discountedPrice: { krw: 4130, jpy: 455, usd: 3.49 },
    discountPercent: 30,
  },
  saju_deep: {
    id: 'analysis_saju_deep',
    name: {
      ko: '사주 심층 분석',
      ja: '四柱深層分析',
      en: 'Deep Four Pillars Analysis',
    },
    description: {
      ko: '대운 분석 포함 10년 운세',
      ja: '大運分析を含む10年運勢',
      en: '10-year fortune with major fortune analysis',
    },
    price: { krw: 12900, jpy: 1430, usd: 10.99 },
    discountedPrice: { krw: 9030, jpy: 1001, usd: 7.69 },
    discountPercent: 30,
  },
  saju_premium: {
    id: 'analysis_saju_premium',
    name: {
      ko: '사주 프리미엄 분석',
      ja: '四柱プレミアム分析',
      en: 'Premium Four Pillars Analysis',
    },
    description: {
      ko: '월별 상세 운세 + PDF + 음성 리포트',
      ja: '月別詳細運勢 + PDF + 音声レポート',
      en: 'Monthly detailed fortune + PDF + Audio report',
    },
    price: { krw: 24900, jpy: 2750, usd: 19.99 },
    discountedPrice: { krw: 17430, jpy: 1925, usd: 13.99 },
    discountPercent: 30,
  },
  face: {
    id: 'analysis_face',
    name: {
      ko: '관상 분석',
      ja: '人相分析',
      en: 'Face Reading Analysis',
    },
    description: {
      ko: 'AI 얼굴 분석으로 보는 관상',
      ja: 'AI顔分析で見る人相',
      en: 'Face reading with AI analysis',
    },
    price: { krw: 5900, jpy: 650, usd: 4.99 },
  },
  integrated: {
    id: 'analysis_integrated',
    name: {
      ko: '통합 분석',
      ja: '統合分析',
      en: 'Integrated Analysis',
    },
    description: {
      ko: '사주 + 관상 + 별자리 통합 분석',
      ja: '四柱 + 人相 + 星座 統合分析',
      en: 'Four Pillars + Face + Astrology Combined',
    },
    price: { krw: 14900, jpy: 1650, usd: 12.99 },
    discountedPrice: { krw: 10430, jpy: 1155, usd: 9.09 },
    discountPercent: 30,
  },
  compatibility: {
    id: 'analysis_compatibility',
    name: {
      ko: '궁합 분석',
      ja: '相性分析',
      en: 'Compatibility Analysis',
    },
    description: {
      ko: '두 사람의 사주 궁합 분석',
      ja: '二人の四柱相性分析',
      en: 'Compatibility analysis for two people',
    },
    price: { krw: 9900, jpy: 1100, usd: 8.99 },
    discountedPrice: { krw: 6930, jpy: 770, usd: 6.29 },
    discountPercent: 30,
  },
  lotto_basic: {
    id: 'analysis_lotto_basic',
    name: {
      ko: '로또 기본 분석',
      ja: 'ロト基本分析',
      en: 'Basic Lotto Analysis',
    },
    description: {
      ko: 'AI 기반 번호 추천 10게임',
      ja: 'AI推薦番号10ゲーム',
      en: 'AI-powered 10 game recommendations',
    },
    price: { krw: 3900, jpy: 430, usd: 2.99 },
  },
  lotto_premium: {
    id: 'analysis_lotto_premium',
    name: {
      ko: '로또 프리미엄 분석',
      ja: 'ロトプレミアム分析',
      en: 'Premium Lotto Analysis',
    },
    description: {
      ko: '백테스트 + 시뮬레이션 + 자동 당첨 대조',
      ja: 'バックテスト + シミュレーション + 自動当選照合',
      en: 'Backtest + Simulation + Auto winning check',
    },
    price: { krw: 9900, jpy: 1100, usd: 7.99 },
    discountedPrice: { krw: 6930, jpy: 770, usd: 5.59 },
    discountPercent: 30,
  },
};

// QR Code Plans
export const QR_CODE_PLANS: Record<string, ProductConfig & { monthlyLimit: number; maxSize: number }> = {
  qr_free: {
    id: 'qr_free',
    name: { ko: '무료', ja: '無料', en: 'Free' },
    description: { ko: '기본 QR코드 생성', ja: '基本QRコード生成', en: 'Basic QR code generation' },
    price: { krw: 0, jpy: 0, usd: 0 },
    monthlyLimit: 10,
    maxSize: 300,
    features: ['basic_qr', 'basic_colors'],
  },
  qr_basic: {
    id: 'qr_basic',
    name: { ko: '베이직', ja: 'ベーシック', en: 'Basic' },
    description: { ko: '고화질 QR코드 + 색상 커스터마이징', ja: '高画質QR + カラーカスタマイズ', en: 'High-res QR + Color customization' },
    price: { krw: 4900, jpy: 550, usd: 3.99 },
    monthlyLimit: 100,
    maxSize: 1000,
    features: ['basic_qr', 'basic_colors', 'high_resolution', 'color_custom'],
  },
  qr_pro: {
    id: 'qr_pro',
    name: { ko: '프로', ja: 'プロ', en: 'Pro' },
    description: { ko: '로고 삽입 + 대량 생성 + 스캔 분석', ja: 'ロゴ挿入 + 一括生成 + スキャン分析', en: 'Logo + Batch + Analytics' },
    price: { krw: 9900, jpy: 1100, usd: 7.99 },
    monthlyLimit: -1, // Unlimited
    maxSize: 2000,
    features: ['basic_qr', 'basic_colors', 'high_resolution', 'color_custom', 'logo_insert', 'batch_upload', 'analytics'],
  },
  qr_business: {
    id: 'qr_business',
    name: { ko: '비즈니스', ja: 'ビジネス', en: 'Business' },
    description: { ko: '다이나믹 QR + API 접근 + 우선 지원', ja: 'ダイナミックQR + API + 優先サポート', en: 'Dynamic QR + API + Priority support' },
    price: { krw: 29900, jpy: 3300, usd: 24.99 },
    monthlyLimit: -1,
    maxSize: 4000,
    features: ['basic_qr', 'basic_colors', 'high_resolution', 'color_custom', 'logo_insert', 'batch_upload', 'analytics', 'dynamic_qr', 'api_access', 'priority_support'],
  },
};

// Coin Packages
export const COIN_PACKAGES: Record<string, ProductConfig & { coins: number; bonus: number }> = {
  c100: {
    id: 'coin_100',
    name: { ko: '100 코인', ja: '100コイン', en: '100 Coins' },
    description: { ko: '기본 코인 패키지', ja: '基本コインパッケージ', en: 'Basic coin package' },
    price: { krw: 1100, jpy: 120, usd: 0.99 },
    coins: 100,
    bonus: 10,
  },
  c500: {
    id: 'coin_500',
    name: { ko: '500 코인', ja: '500コイン', en: '500 Coins' },
    description: { ko: '인기 코인 패키지', ja: '人気コインパッケージ', en: 'Popular coin package' },
    price: { krw: 4500, jpy: 500, usd: 3.99 },
    coins: 500,
    bonus: 100,
  },
  c1000: {
    id: 'coin_1000',
    name: { ko: '1000 코인', ja: '1000コイン', en: '1000 Coins' },
    description: { ko: '가성비 코인 패키지', ja: 'コスパコインパッケージ', en: 'Value coin package' },
    price: { krw: 7900, jpy: 880, usd: 6.99 },
    coins: 1000,
    bonus: 300,
  },
  c3000: {
    id: 'coin_3000',
    name: { ko: '3000 코인', ja: '3000コイン', en: '3000 Coins' },
    description: { ko: '대용량 코인 패키지', ja: '大容量コインパッケージ', en: 'Large coin package' },
    price: { krw: 19900, jpy: 2200, usd: 15.99 },
    coins: 3000,
    bonus: 1200,
  },
};

// Helper functions
export function formatPrice(amount: number, currency: Currency): string {
  const formats: Record<Currency, Intl.NumberFormatOptions> = {
    krw: { style: 'currency', currency: 'KRW', maximumFractionDigits: 0 },
    jpy: { style: 'currency', currency: 'JPY', maximumFractionDigits: 0 },
    usd: { style: 'currency', currency: 'USD', minimumFractionDigits: 2 },
  };

  const locales: Record<Currency, string> = {
    krw: 'ko-KR',
    jpy: 'ja-JP',
    usd: 'en-US',
  };

  return new Intl.NumberFormat(locales[currency], formats[currency]).format(amount);
}

export function getCurrencyFromLocale(locale: string): Currency {
  switch (locale) {
    case 'ko':
      return 'krw';
    case 'ja':
      return 'jpy';
    default:
      return 'usd';
  }
}

export function getPrice(product: ProductConfig, currency: Currency): number {
  return product.discountedPrice?.[currency] ?? product.price[currency];
}

export function getOriginalPrice(product: ProductConfig, currency: Currency): number {
  return product.price[currency];
}
