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
  pointCost?: number; // 포인트로 구매 시 필요한 포인트
}

// 포인트 패키지 (기존 구독제 대체)
export const POINT_PACKAGES: Record<string, ProductConfig & { points: number; bonusPoints: number; bonusPercent: number }> = {
  starter: {
    id: 'point_starter',
    name: {
      ko: '스타터 패키지',
      ja: 'スターターパッケージ',
      en: 'Starter Package',
    },
    description: {
      ko: '처음 시작하시는 분을 위한 패키지',
      ja: '初めての方向けパッケージ',
      en: 'Package for beginners',
    },
    price: { krw: 5000, jpy: 550, usd: 3.99 },
    points: 500,
    bonusPoints: 0,
    bonusPercent: 0,
    features: [
      '500 포인트 지급',
      '기본 사주 분석 1회 가능',
    ],
  },
  basic: {
    id: 'point_basic',
    name: {
      ko: '베이직 패키지',
      ja: 'ベーシックパッケージ',
      en: 'Basic Package',
    },
    description: {
      ko: '가장 인기있는 패키지',
      ja: '最も人気のパッケージ',
      en: 'Most popular package',
    },
    price: { krw: 10000, jpy: 1100, usd: 7.99 },
    points: 1000,
    bonusPoints: 100,
    bonusPercent: 10,
    features: [
      '1,000 포인트 지급',
      '보너스 100 포인트 (+10%)',
      '기본 사주 분석 2회 가능',
    ],
  },
  standard: {
    id: 'point_standard',
    name: {
      ko: '스탠다드 패키지',
      ja: 'スタンダードパッケージ',
      en: 'Standard Package',
    },
    description: {
      ko: '가성비 최고의 패키지',
      ja: 'コスパ最高のパッケージ',
      en: 'Best value package',
    },
    price: { krw: 30000, jpy: 3300, usd: 24.99 },
    points: 3000,
    bonusPoints: 600,
    bonusPercent: 20,
    features: [
      '3,000 포인트 지급',
      '보너스 600 포인트 (+20%)',
      '프리미엄 분석 2회 가능',
      '무료 다운로드 3회 제공',
    ],
  },
  premium: {
    id: 'point_premium',
    name: {
      ko: '프리미엄 패키지',
      ja: 'プレミアムパッケージ',
      en: 'Premium Package',
    },
    description: {
      ko: '헤비 유저를 위한 최고의 패키지',
      ja: 'ヘビーユーザー向け最高のパッケージ',
      en: 'Best package for heavy users',
    },
    price: { krw: 50000, jpy: 5500, usd: 39.99 },
    points: 5000,
    bonusPoints: 1500,
    bonusPercent: 30,
    features: [
      '5,000 포인트 지급',
      '보너스 1,500 포인트 (+30%)',
      '프리미엄 분석 4회 가능',
      '무료 다운로드 무제한',
      '음성 리포트 3회 제공',
    ],
  },
  vip: {
    id: 'point_vip',
    name: {
      ko: 'VIP 패키지',
      ja: 'VIPパッケージ',
      en: 'VIP Package',
    },
    description: {
      ko: '최고 혜택의 VIP 전용 패키지',
      ja: '最高特典のVIP専用パッケージ',
      en: 'Exclusive VIP package with best benefits',
    },
    price: { krw: 100000, jpy: 11000, usd: 79.99 },
    points: 10000,
    bonusPoints: 5000,
    bonusPercent: 50,
    features: [
      '10,000 포인트 지급',
      '보너스 5,000 포인트 (+50%)',
      '모든 분석 무제한 이용',
      '다운로드 및 음성 무제한',
      '전문가 상담 30분 무료',
      'VIP 전용 고객 지원',
    ],
  },
};

// 분석 상품 (포인트로 구매)
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
    pointCost: 500,
    features: [
      '사주팔자 기본 분석',
      '2025년 총운',
      '성격 및 적성 분석',
      '행운의 요소',
    ],
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
    pointCost: 1000,
    features: [
      '기본 분석 전체 포함',
      '대운 흐름 분석',
      '10년 운세 예측',
      '월별 상세 운세',
    ],
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
    pointCost: 2000,
    features: [
      '심층 분석 전체 포함',
      '월별 액션 플랜',
      '인생 타임라인',
      '적성 직업 분석',
      'PDF 리포트 다운로드',
      '음성 리포트 제공',
    ],
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
    pointCost: 500,
    features: [
      'AI 관상 분석',
      '성격 특성 분석',
      '대인 관계 성향',
      '행운 포인트',
    ],
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
    pointCost: 1200,
    features: [
      '사주팔자 분석',
      '관상 분석',
      '별자리 운세',
      'MBTI 통합 분석',
      '종합 리포트',
    ],
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
    pointCost: 800,
    features: [
      '두 사람 궁합 점수',
      '상성 분석',
      '주의 사항',
      '관계 발전 조언',
    ],
  },
  group_compatibility: {
    id: 'analysis_group',
    name: {
      ko: '그룹 궁합 분석',
      ja: 'グループ相性分析',
      en: 'Group Compatibility Analysis',
    },
    description: {
      ko: '2~5인 그룹 궁합 분석',
      ja: '2~5人グループ相性分析',
      en: 'Group compatibility for 2-5 people',
    },
    price: { krw: 19900, jpy: 2200, usd: 15.99 },
    discountedPrice: { krw: 13930, jpy: 1540, usd: 11.19 },
    discountPercent: 30,
    pointCost: 1500,
    features: [
      '2~5인 그룹 분석',
      '팀 시너지 분석',
      '역할 배분 추천',
      '협업 전략',
      '갈등 해결 조언',
    ],
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

// 추가 구매 옵션 (포인트로 구매)
export const ADDON_PRODUCTS: Record<string, ProductConfig> = {
  pdf_download: {
    id: 'addon_pdf',
    name: {
      ko: 'PDF 다운로드',
      ja: 'PDFダウンロード',
      en: 'PDF Download',
    },
    description: {
      ko: '분석 결과를 PDF로 다운로드',
      ja: '分析結果をPDFでダウンロード',
      en: 'Download analysis result as PDF',
    },
    price: { krw: 2900, jpy: 320, usd: 2.49 },
    pointCost: 300,
    features: [
      'PDF 형식 다운로드',
      '고해상도 인쇄 가능',
      '영구 보관',
    ],
  },
  audio_report: {
    id: 'addon_audio',
    name: {
      ko: '음성 리포트',
      ja: '音声レポート',
      en: 'Audio Report',
    },
    description: {
      ko: '분석 결과를 음성으로 청취',
      ja: '分析結果を音声で聴取',
      en: 'Listen to analysis result as audio',
    },
    price: { krw: 3900, jpy: 430, usd: 3.49 },
    pointCost: 400,
    features: [
      'AI 음성 리포트',
      '약 15분 분량',
      'MP3 다운로드',
    ],
  },
  bundle_download: {
    id: 'addon_bundle',
    name: {
      ko: 'PDF + 음성 번들',
      ja: 'PDF + 音声バンドル',
      en: 'PDF + Audio Bundle',
    },
    description: {
      ko: 'PDF와 음성을 함께 할인된 가격으로',
      ja: 'PDFと音声をセットで割引価格で',
      en: 'PDF and Audio at discounted price',
    },
    price: { krw: 4900, jpy: 540, usd: 4.49 },
    pointCost: 500,
    features: [
      'PDF 다운로드',
      '음성 리포트',
      '30% 할인된 가격',
    ],
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

export function getPointCost(product: ProductConfig): number {
  return product.pointCost ?? 0;
}

// 포인트 패키지 보너스 계산
export function calculateTotalPoints(packageKey: string): number {
  const pkg = POINT_PACKAGES[packageKey];
  if (!pkg) return 0;
  return pkg.points + pkg.bonusPoints;
}

// 포인트로 구매 가능한지 확인
export function canPurchaseWithPoints(userPoints: number, product: ProductConfig): boolean {
  return userPoints >= (product.pointCost ?? 0);
}

// 원화를 포인트로 변환 (1원 = 0.1포인트 기준)
export function krwToPoints(krw: number): number {
  return Math.floor(krw / 10);
}

// 포인트를 원화로 변환
export function pointsToKrw(points: number): number {
  return points * 10;
}
