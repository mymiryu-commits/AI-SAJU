/**
 * WebView 감지 유틸리티
 * Google OAuth는 인앱 브라우저(WebView)에서 차단됨 (disallowed_useragent 에러)
 */

export function isWebView(): boolean {
  if (typeof window === 'undefined' || typeof navigator === 'undefined') {
    return false;
  }

  const ua = navigator.userAgent || navigator.vendor || '';
  const uaLower = ua.toLowerCase();

  // 일반적인 WebView 감지 패턴
  const webviewPatterns = [
    // Android WebView
    'wv',
    'webview',
    // Facebook
    'fban',
    'fbav',
    'fb_iab',
    // Instagram
    'instagram',
    // KakaoTalk
    'kakaotalk',
    'kakao',
    // LINE
    'line/',
    // Naver
    'naver',
    // Twitter
    'twitter',
    // LinkedIn
    'linkedin',
    // TikTok
    'tiktok',
    'bytedance',
    // WeChat
    'micromessenger',
    // Snapchat
    'snapchat',
    // Pinterest
    'pinterest',
    // Telegram
    'telegram',
  ];

  // WebView 패턴 체크
  for (const pattern of webviewPatterns) {
    if (uaLower.includes(pattern)) {
      return true;
    }
  }

  // iOS WebView 감지 (Safari가 아닌 iOS 브라우저)
  const isIOS = /iphone|ipad|ipod/i.test(ua);
  const isSafari = /safari/i.test(ua) && !/crios|fxios|opios/i.test(ua);

  if (isIOS && !isSafari && !/chrome/i.test(ua)) {
    // iOS에서 Safari가 아니면서 Chrome도 아니면 WebView일 가능성 높음
    return true;
  }

  // Android WebView 감지
  const isAndroid = /android/i.test(ua);
  const isAndroidWebView = isAndroid && /; wv\)/.test(ua);

  if (isAndroidWebView) {
    return true;
  }

  return false;
}

/**
 * 현재 URL을 외부 브라우저에서 열기 위한 URL 생성
 */
export function getExternalBrowserUrl(): string {
  if (typeof window === 'undefined') {
    return '';
  }

  return window.location.href;
}

/**
 * 감지된 WebView 앱 이름 반환
 */
export function getWebViewAppName(): string | null {
  if (typeof navigator === 'undefined') {
    return null;
  }

  const ua = navigator.userAgent || '';
  const uaLower = ua.toLowerCase();

  if (uaLower.includes('kakaotalk') || uaLower.includes('kakao')) {
    return '카카오톡';
  }
  if (uaLower.includes('instagram')) {
    return '인스타그램';
  }
  if (uaLower.includes('fban') || uaLower.includes('fbav') || uaLower.includes('fb_iab')) {
    return '페이스북';
  }
  if (uaLower.includes('naver')) {
    return '네이버';
  }
  if (uaLower.includes('line/')) {
    return '라인';
  }
  if (uaLower.includes('twitter')) {
    return '트위터';
  }
  if (uaLower.includes('tiktok') || uaLower.includes('bytedance')) {
    return '틱톡';
  }
  if (uaLower.includes('telegram')) {
    return '텔레그램';
  }

  return null;
}
