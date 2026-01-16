/**
 * Korean Font Loader for jsPDF
 *
 * Noto Sans KR 폰트를 동적으로 로드하여 jsPDF에서 사용
 */

import { jsPDF } from 'jspdf';

// 폰트 캐시
let fontCache: ArrayBuffer | null = null;

/**
 * Noto Sans KR 폰트 URL (Google Fonts CDN)
 * Regular weight subset for common Korean characters
 */
const NOTO_SANS_KR_URL =
  'https://fonts.gstatic.com/s/notosanskr/v36/PbyxFmXiEBPT4ITbgNA5Cgms3VYcOA-vvnIzzuoyeLGC5nYm.woff2';

// Fallback: 경량 한글 폰트 (나눔고딕 subset)
const NANUM_GOTHIC_URL =
  'https://cdn.jsdelivr.net/gh/nicecode-dev/NanumFontFiles@main/NanumGothic/NanumGothic-Regular.ttf';

/**
 * 폰트 파일을 ArrayBuffer로 가져오기
 */
async function fetchFont(url: string): Promise<ArrayBuffer> {
  const response = await fetch(url);
  if (!response.ok) {
    throw new Error(`Failed to fetch font: ${response.status}`);
  }
  return response.arrayBuffer();
}

/**
 * ArrayBuffer를 Base64 문자열로 변환
 */
function arrayBufferToBase64(buffer: ArrayBuffer): string {
  const bytes = new Uint8Array(buffer);
  let binary = '';
  for (let i = 0; i < bytes.byteLength; i++) {
    binary += String.fromCharCode(bytes[i]);
  }
  return btoa(binary);
}

/**
 * jsPDF 인스턴스에 한글 폰트 추가
 */
export async function addKoreanFontToPDF(doc: jsPDF): Promise<void> {
  try {
    // 캐시된 폰트가 있으면 사용
    if (!fontCache) {
      // NanumGothic TTF 사용 (더 안정적)
      fontCache = await fetchFont(NANUM_GOTHIC_URL);
    }

    const fontBase64 = arrayBufferToBase64(fontCache);

    // jsPDF VFS에 폰트 파일 추가
    doc.addFileToVFS('NanumGothic-Regular.ttf', fontBase64);

    // 폰트 등록
    doc.addFont('NanumGothic-Regular.ttf', 'NanumGothic', 'normal');

    // 기본 폰트로 설정
    doc.setFont('NanumGothic');
  } catch (error) {
    console.error('Failed to load Korean font:', error);
    // 폰트 로드 실패 시 기본 폰트 사용 (한글이 깨질 수 있음)
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
  fontCache = null;
}

export default {
  addKoreanFontToPDF,
  createKoreanPDF,
  clearFontCache
};
