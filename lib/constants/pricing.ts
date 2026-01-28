// 가격 정보 통합 관리 파일
// 모든 결제 관련 페이지에서 이 파일의 상수를 사용합니다.

export const PRICING = {
  // 구독 플랜
  subscription: {
    monthly: {
      free: { price: 0, period: 'forever' as const },
      basic: { price: 4900, period: 'month' as const },
      pro: { price: 9900, period: 'month' as const },
      premium: { price: 19900, period: 'month' as const },
    },
    yearly: {
      free: { price: 0, period: 'forever' as const },
      basic: { price: 39900, period: 'year' as const, monthlyEquiv: 3325 },
      pro: { price: 79900, period: 'year' as const, monthlyEquiv: 6658 },
      premium: { price: 149900, period: 'year' as const, monthlyEquiv: 12491 },
    },
  },

  // 개별 서비스 (1회 이용권)
  individual: {
    saju: { price: 5900, label: '사주 분석' },
    face: { price: 5900, label: '관상 분석' },
    compatibility: { price: 9900, label: '궁합 분석' },
    integrated: {
      basic: { price: 14900, discountedPrice: 10430, label: '베이직' },
      standard: { price: 24900, discountedPrice: 17430, label: '스탠다드' },
      premium: { price: 39900, discountedPrice: 27930, label: '프리미엄' },
    },
  },

  // 전문가 상담 (분당 요금)
  expert: {
    chat: { min: 2000, max: 4000 },
    call: { min: 3500, max: 6000 },
    video: { min: 5000, max: 8000 },
  },

  // 할인율
  discount: {
    yearly: 17, // 연간 구독 할인율 (%)
    integrated: 30, // 통합 분석 할인율 (%)
    compatibility: 30, // 궁합 프리미엄 할인율 (%)
  },
} as const;

// 가격 포맷팅 함수
export function formatPrice(price: number): string {
  return new Intl.NumberFormat('ko-KR').format(price);
}

// 할인 가격 계산
export function calculateDiscountedPrice(
  originalPrice: number,
  discountPercent: number
): number {
  return Math.round(originalPrice * (1 - discountPercent / 100));
}

// 플랜별 기능 목록
export const PLAN_FEATURES = {
  free: [
    { text: '매일 무료 운세', included: true },
    { text: '기본 사주 분석 (1회)', included: true },
    { text: 'AI 랭킹 조회', included: true },
    { text: '기본 가이드', included: true },
    { text: '상세 분석', included: false },
    { text: 'PDF 리포트', included: false },
    { text: '음성 리포트', included: false },
    { text: '전문가 상담', included: false },
  ],
  basic: [
    { text: '매일 무료 운세', included: true },
    { text: '상세 사주 분석 (월 3회)', included: true },
    { text: 'AI 랭킹 조회', included: true },
    { text: '모든 가이드 & 튜토리얼', included: true },
    { text: '광고 없는 경험', included: true },
    { text: 'PDF 리포트', included: true },
    { text: '음성 리포트', included: false },
    { text: '전문가 상담', included: false },
  ],
  pro: [
    { text: '매일 무료 운세', included: true },
    { text: '무제한 사주 & 관상 분석', included: true },
    { text: 'AI 랭킹 조회', included: true },
    { text: '모든 가이드 & 튜토리얼', included: true },
    { text: '광고 없는 경험', included: true },
    { text: 'PDF 리포트', included: true },
    { text: '음성 리포트', included: true },
    { text: '우선 지원', included: true },
  ],
  premium: [
    { text: 'Pro 플랜의 모든 기능', included: true },
    { text: '통합 분석', included: true },
    { text: '가족/그룹 분석', included: true },
    { text: '전문가 상담 (월 1회)', included: true },
    { text: '맞춤형 예측', included: true },
    { text: '신기능 조기 접근', included: true },
    { text: '전담 지원', included: true },
    { text: 'API 접근', included: true },
  ],
} as const;

// 플랜 메타 정보
export const PLAN_META = {
  free: {
    name: '무료',
    description: '무료로 시작하기',
    color: 'text-gray-500',
    bgColor: 'bg-gray-100'
  },
  basic: {
    name: '베이직',
    description: '가벼운 사용자용',
    color: 'text-blue-500',
    bgColor: 'bg-blue-100'
  },
  pro: {
    name: '프로',
    description: '정기 사용자용',
    color: 'text-purple-500',
    bgColor: 'bg-purple-100',
    popular: true
  },
  premium: {
    name: '프리미엄',
    description: '파워 사용자용',
    color: 'text-yellow-500',
    bgColor: 'bg-yellow-100'
  },
} as const;

export type PlanType = keyof typeof PLAN_FEATURES;
export type BillingPeriod = 'monthly' | 'yearly';
