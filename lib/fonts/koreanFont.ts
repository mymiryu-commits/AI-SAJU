/**
 * Korean Font Loader for jsPDF
 *
 * 한글 폰트를 jsPDF에서 사용하기 위한 유틸리티
 * 고령 사용자를 위해 안정적인 한글 출력 보장
 *
 * 참고: jsPDF는 TTF 폰트가 필요하며, 외부 URL 접근이 제한된 환경에서는
 * 기본 폰트로 폴백합니다. 한글 PDF 생성이 필요한 경우
 * 로컬 TTF 폰트 파일을 public 폴더에 추가하고 경로를 설정하세요.
 */

import { jsPDF } from 'jspdf';
import * as fs from 'fs';
import * as path from 'path';

// 폰트 캐시 (Base64 문자열)
let fontCacheBase64: string | null = null;

/**
 * 로컬 폰트 파일 경로 (TTF 필요)
 * public/fonts/NanumGothic-Regular.ttf 또는 다른 한글 TTF 폰트
 */
const LOCAL_FONT_PATHS = [
  // 프로젝트 내 폰트 파일 경로들
  path.join(process.cwd(), 'public', 'fonts', 'NanumGothic-Regular.ttf'),
  path.join(process.cwd(), 'public', 'fonts', 'NanumGothic.ttf'),
  path.join(process.cwd(), 'fonts', 'NanumGothic-Regular.ttf'),
];

/**
 * 로컬 폰트 파일에서 Base64로 읽기
 */
function loadLocalFont(): string | null {
  for (const fontPath of LOCAL_FONT_PATHS) {
    try {
      if (fs.existsSync(fontPath)) {
        const fontBuffer = fs.readFileSync(fontPath);
        console.log(`Korean font loaded from: ${fontPath}`);
        return fontBuffer.toString('base64');
      }
    } catch (error) {
      console.warn(`Failed to load font from ${fontPath}:`, error);
    }
  }
  return null;
}

/**
 * 원격 URL에서 폰트 가져오기 (폴백)
 */
async function fetchRemoteFont(): Promise<string | null> {
  const fontUrls = [
    'https://hangeul.pstatic.net/hangeul_static/webfont/NanumGothic/NanumGothic.ttf',
    'https://cdn.rawgit.com/nicecode-dev/NanumFontFiles/master/NanumGothic/NanumGothic-Regular.ttf'
  ];

  for (const url of fontUrls) {
    try {
      const response = await fetch(url, {
        headers: { 'User-Agent': 'Mozilla/5.0' }
      });
      if (response.ok) {
        const arrayBuffer = await response.arrayBuffer();
        console.log(`Korean font loaded from URL: ${url}`);
        return Buffer.from(arrayBuffer).toString('base64');
      }
    } catch (error) {
      console.warn(`Failed to fetch font from ${url}:`, error);
    }
  }
  return null;
}

/**
 * jsPDF 인스턴스에 한글 폰트 추가
 */
export async function addKoreanFontToPDF(doc: jsPDF): Promise<void> {
  try {
    // 캐시된 폰트가 있으면 사용
    if (!fontCacheBase64) {
      // 1. 로컬 파일에서 먼저 시도
      fontCacheBase64 = loadLocalFont();

      // 2. 로컬 실패 시 원격에서 시도
      if (!fontCacheBase64) {
        fontCacheBase64 = await fetchRemoteFont();
      }
    }

    if (fontCacheBase64) {
      // jsPDF VFS에 폰트 파일 추가
      doc.addFileToVFS('NanumGothic-Regular.ttf', fontCacheBase64);
      doc.addFont('NanumGothic-Regular.ttf', 'NanumGothic', 'normal');
      doc.setFont('NanumGothic');
      console.log('Korean font applied successfully');
    } else {
      // 폰트 로드 실패 - 기본 폰트 사용 (한글이 깨질 수 있음)
      console.warn('Korean font not available. PDF may not display Korean text correctly.');
      console.warn('To fix: Add NanumGothic-Regular.ttf to public/fonts/ directory');
      // Helvetica는 기본 폰트로 유지
    }
  } catch (error) {
    console.error('Failed to load Korean font:', error);
    // 에러 발생해도 PDF 생성은 계속 진행 (기본 폰트로)
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

/**
 * 한글 폰트 사용 가능 여부 확인
 */
export function isKoreanFontAvailable(): boolean {
  return fontCacheBase64 !== null || loadLocalFont() !== null;
}

export default {
  addKoreanFontToPDF,
  createKoreanPDF,
  clearFontCache,
  isKoreanFontAvailable
};
