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

// Subscription Tiers (confirmed pricing)
export const SUBSCRIPTION_TIERS: Record<string, ProductConfig> = {
  basic: {
    id: 'sub_basic',
    name: {
      ko: '베이직',
      ja: 'ベーシック',
      en: 'Basic',
    },
    description: {
      ko: '광고 제거 + 기본 분석 월 3회',
      ja: '広告非表示 + 基本分析 月3回',
      en: 'Ad-free + 3 basic analyses per month',
    },
    price: { krw: 3900, jpy: 450, usd: 2.99 },
    features: [
      'daily_fortune',
      'basic_analysis_3',
      'ad_free',
      'pdf_reports',
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
      ko: '무제한 기본 분석 + 심화 분석 월 5회',
      ja: '基本分析無制限 + 深層分析 月5回',
      en: 'Unlimited basic + 5 deep analyses per month',
    },
    price: { krw: 7900, jpy: 880, usd: 5.99 },
    features: [
      'daily_fortune',
      'unlimited_basic_analysis',
      'deep_analysis_5',
      'ad_free',
      'pdf_reports',
      'voice_reports',
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
      ko: '모든 분석 무제한 + PDF/음성 리포트',
      ja: '全分析無制限 + PDF/音声レポート',
      en: 'Unlimited everything + PDF/Audio reports',
    },
    price: { krw: 14900, jpy: 1650, usd: 11.99 },
    features: [
      'daily_fortune',
      'unlimited_all_analysis',
      'expert_consultation',
      'pdf_reports',
      'audio_reports',
      'ad_free',
      'priority_support',
      'early_access',
      'family_analysis',
    ],
  },
};

// Fortune Analysis Products - PAID (pay-per-use)
export const ANALYSIS_PRODUCTS: Record<string, ProductConfig> = {
  saju: {
    id: 'analysis_saju',
    name: {
      ko: '사주 분석',
      ja: '四柱推命分析',
      en: 'Four Pillars Analysis',
    },
    description: {
      ko: '사주팔자 종합 분석 + 올해 운세 + PDF 리포트',
      ja: '四柱八字の総合分析 + 今年の運勢 + PDFレポート',
      en: 'Complete Four Pillars analysis + yearly fortune + PDF report',
    },
    price: { krw: 9900, jpy: 1100, usd: 7.99 },
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
    price: { krw: 3900, jpy: 450, usd: 2.99 },
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
      ko: '사주 + 관상 + 궁합 통합 분석',
      ja: '四柱 + 人相 + 相性 統合分析',
      en: 'Four Pillars + Face + Compatibility Combined',
    },
    price: { krw: 14900, jpy: 1650, usd: 11.99 },
  },
};

// Free Services (ad-supported)
export const FREE_SERVICES: Record<string, ProductConfig> = {
  daily_fortune: {
    id: 'free_daily_fortune',
    name: {
      ko: '오늘의 운세',
      ja: '今日の運勢',
      en: 'Daily Fortune',
    },
    description: {
      ko: '매일 확인하는 오늘의 운세',
      ja: '毎日チェックする今日の運勢',
      en: 'Check your daily fortune every day',
    },
    price: { krw: 0, jpy: 0, usd: 0 },
  },
  tarot: {
    id: 'free_tarot',
    name: {
      ko: '타로 리딩',
      ja: 'タロットリーディング',
      en: 'Tarot Reading',
    },
    description: {
      ko: 'AI 타로 카드 리딩',
      ja: 'AIタロットカードリーディング',
      en: 'AI Tarot Card Reading',
    },
    price: { krw: 0, jpy: 0, usd: 0 },
  },
  mbti_fortune: {
    id: 'free_mbti_fortune',
    name: {
      ko: 'MBTI 운세',
      ja: 'MBTI占い',
      en: 'MBTI Fortune',
    },
    description: {
      ko: 'MBTI 성격 유형 기반 운세 분석',
      ja: 'MBTI性格タイプに基づく運勢分析',
      en: 'Fortune analysis based on MBTI personality type',
    },
    price: { krw: 0, jpy: 0, usd: 0 },
  },
  animal_fortune: {
    id: 'free_animal_fortune',
    name: {
      ko: '나의 동물점',
      ja: '私の動物占い',
      en: 'My Animal Fortune',
    },
    description: {
      ko: '띠 동물로 알아보는 나의 성격과 운세',
      ja: '干支の動物で知る性格と運勢',
      en: 'Discover your personality and fortune through your zodiac animal',
    },
    price: { krw: 0, jpy: 0, usd: 0 },
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
