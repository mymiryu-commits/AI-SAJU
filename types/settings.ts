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
