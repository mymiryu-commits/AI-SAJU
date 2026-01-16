/**
 * Korean Font Loader for jsPDF
 *
 * 한글 폰트를 jsPDF에서 사용하기 위한 유틸리티
 * 고령 사용자를 위해 안정적인 한글 출력 보장
 */

import { jsPDF } from 'jspdf';

// 폰트 캐시 (Base64 문자열)
let fontCacheBase64: string | null = null;

// 나눔고딕 폰트 URL (여러 CDN 폴백)
const FONT_URLS = [
  'https://cdn.jsdelivr.net/gh/nicecode-dev/NanumFontFiles@main/NanumGothic/NanumGothic-Regular.ttf',
  'https://fastly.jsdelivr.net/gh/nicecode-dev/NanumFontFiles@main/NanumGothic/NanumGothic-Regular.ttf',
  'https://raw.githubusercontent.com/nicecode-dev/NanumFontFiles/main/NanumGothic/NanumGothic-Regular.ttf'
];

/**
 * 폰트 파일을 가져와서 Base64로 변환
 * 여러 CDN 폴백 지원
 */
async function fetchFontAsBase64(): Promise<string> {
  let lastError: Error | null = null;

  for (const url of FONT_URLS) {
    try {
      const response = await fetch(url);
      if (!response.ok) {
        throw new Error(`HTTP ${response.status}`);
      }

      const arrayBuffer = await response.arrayBuffer();

      // Node.js와 브라우저 모두 지원하는 Base64 변환
      if (typeof Buffer !== 'undefined') {
        // Node.js 환경
        return Buffer.from(arrayBuffer).toString('base64');
      } else {
        // 브라우저 환경
        const bytes = new Uint8Array(arrayBuffer);
        let binary = '';
        for (let i = 0; i < bytes.byteLength; i++) {
          binary += String.fromCharCode(bytes[i]);
        }
        return btoa(binary);
      }
    } catch (error) {
      lastError = error as Error;
      console.warn(`Font fetch failed from ${url}:`, error);
      continue;
    }
  }

  throw new Error(`All font sources failed. Last error: ${lastError?.message}`);
}

/**
 * jsPDF 인스턴스에 한글 폰트 추가
 */
export async function addKoreanFontToPDF(doc: jsPDF): Promise<void> {
  try {
    // 캐시된 폰트가 있으면 사용
    if (!fontCacheBase64) {
      fontCacheBase64 = await fetchFontAsBase64();
    }

    // jsPDF VFS에 폰트 파일 추가
    doc.addFileToVFS('NanumGothic-Regular.ttf', fontCacheBase64);

    // 폰트 등록
    doc.addFont('NanumGothic-Regular.ttf', 'NanumGothic', 'normal');

    // 기본 폰트로 설정
    doc.setFont('NanumGothic');

    console.log('Korean font loaded successfully');
  } catch (error) {
    console.error('Failed to load Korean font:', error);
    // 폰트 로드 실패 시 에러 발생 (한글 출력이 필수이므로)
    throw new Error('한글 폰트 로드에 실패했습니다. PDF를 생성할 수 없습니다.');
  }
}

/**
 * 한글 폰트가 적용된 jsPDF 인스턴스 생성
 */
export async function createKoreanPDF(options?: {
  orientation?: 'portrait' | 'landscape';
  unit?: 'mm' | 'pt' | 'px';
  format?: string | number[];
}): Promise<jsPDF> {
  const doc = new jsPDF({
    orientation: options?.orientation || 'portrait',
    unit: options?.unit || 'mm',
    format: options?.format || 'a4'
  });

  await addKoreanFontToPDF(doc);

  return doc;
}

/**
 * 폰트 캐시 초기화 (메모리 정리용)
 */
export function clearFontCache(): void {
  fontCacheBase64 = null;
}

export default {
  addKoreanFontToPDF,
  createKoreanPDF,
  clearFontCache
};
