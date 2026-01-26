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

/**
 * 페이지 히어로 배경 이미지 설정
 */
export interface PageHeroSettings {
  backgroundImage?: string;
  overlayColor?: string;
  overlayOpacity?: number;
}

/**
 * 상품 가격 설정 타입
 */
export interface ServicePriceSettings {
  daily_fortune?: number;      // 통합 운세 분석
  saju_basic?: number;         // 사주 분석
  saju_advanced?: number;      // 정통 사주
  newyear?: number;            // 신년운세
  animal_dna?: number;         // AI 동물 DNA
  ai_chat?: number;            // AI 사주 상담
  compatibility?: number;      // 궁합 분석
  tarot?: number;              // 타로 점
  lotto?: number;              // 로또 분석
  mbti?: number;               // MBTI 분석
  [key: string]: number | undefined;
}

/**
 * 사용자 저장 정보 타입 (생년월일 등)
 */
export interface SavedUserInfo {
  name?: string;
  birthDate?: string;          // YYYY-MM-DD
  birthHour?: string;          // HH:mm 또는 시주 값
  gender?: 'male' | 'female';
  calendar?: 'solar' | 'lunar';
  savedAt?: string;            // ISO date string
}
