/**
 * 사주 분석 결과 내보내기 모듈
 *
 * PDF 문서 및 음성 파일 생성 기능
 */

// PDF 생성
export {
  generateSajuPDF,
  generatePDFFilename,
  generatePDFSections
} from './pdfGenerator';

// 음성 생성
export {
  generateNarrationScript,
  narrationToText,
  generateSajuAudio,
  generateAudioFilename,
  generateAudioWithOpenAI,
  generateAudioWithGoogle,
  generateAudioWithNaver,
  generateAudioWithEdge,
  getEdgeVoices,
  OPENAI_VOICES,
  type TTSProvider
} from './audioGenerator';
