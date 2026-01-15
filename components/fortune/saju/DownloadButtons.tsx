'use client';

/**
 * 사주 분석 결과 다운로드 버튼 컴포넌트
 *
 * PDF 문서 및 음성 파일 다운로드 기능 제공
 */

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import type {
  UserInput,
  SajuChart,
  OhengBalance,
  AnalysisResult,
  PremiumContent
} from '@/types/saju';

interface DownloadButtonsProps {
  user: UserInput;
  saju: SajuChart;
  oheng: OhengBalance;
  result: AnalysisResult;
  premium?: PremiumContent;
  targetYear?: number;
  analysisId?: string; // 저장된 분석 ID (있으면 GET 방식)
  isPremium?: boolean; // 프리미엄 기능 활성화 여부
  onUpgradeClick?: () => void; // 업그레이드 클릭 핸들러
  onPurchaseDownload?: (type: DownloadType) => void; // 다운로드 구매 핸들러
}

// 다운로드 가격
const DOWNLOAD_PRICES = {
  pdf: 2900,
  audio: 3900,
  bundle: 4900
};

type DownloadType = 'pdf' | 'audio';

interface DownloadState {
  pdf: 'idle' | 'loading' | 'success' | 'error';
  audio: 'idle' | 'loading' | 'success' | 'error';
}

export default function DownloadButtons({
  user,
  saju,
  oheng,
  result,
  premium,
  targetYear = 2026,
  analysisId,
  isPremium = false,
  onUpgradeClick,
  onPurchaseDownload
}: DownloadButtonsProps) {
  const [downloadState, setDownloadState] = useState<DownloadState>({
    pdf: 'idle',
    audio: 'idle'
  });
  const [showPreview, setShowPreview] = useState(false);
  const [previewContent, setPreviewContent] = useState<string>('');
  const [estimatedDuration, setEstimatedDuration] = useState<number>(0);
  const [showPurchaseModal, setShowPurchaseModal] = useState(false);
  const [selectedType, setSelectedType] = useState<DownloadType | null>(null);

  const handleDownload = async (type: DownloadType) => {
    if (!isPremium) {
      // 무료 사용자는 구매 모달 표시
      setSelectedType(type);
      setShowPurchaseModal(true);
      return;
    }

    setDownloadState(prev => ({ ...prev, [type]: 'loading' }));

    try {
      let response: Response;

      if (analysisId) {
        // 저장된 분석에서 다운로드 (GET)
        response = await fetch(
          `/api/fortune/saju/download?type=${type}&analysisId=${analysisId}`,
          { method: 'GET' }
        );
      } else {
        // 실시간 생성 다운로드 (POST)
        response = await fetch('/api/fortune/saju/download', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            type,
            user,
            saju,
            oheng,
            result,
            premium,
            targetYear
          })
        });
      }

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.error || '다운로드에 실패했습니다.');
      }

      // 파일 다운로드
      const blob = await response.blob();
      const filename = response.headers.get('Content-Disposition')
        ?.match(/filename="(.+)"/)?.[1] || `download.${type === 'pdf' ? 'pdf' : 'mp3'}`;

      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = decodeURIComponent(filename);
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);

      setDownloadState(prev => ({ ...prev, [type]: 'success' }));

      // 3초 후 상태 리셋
      setTimeout(() => {
        setDownloadState(prev => ({ ...prev, [type]: 'idle' }));
      }, 3000);

    } catch (error) {
      console.error(`${type} download error:`, error);
      setDownloadState(prev => ({ ...prev, [type]: 'error' }));

      // 5초 후 상태 리셋
      setTimeout(() => {
        setDownloadState(prev => ({ ...prev, [type]: 'idle' }));
      }, 5000);
    }
  };

  const handlePreview = async () => {
    if (!isPremium) {
      onUpgradeClick?.();
      return;
    }

    try {
      const response = await fetch('/api/fortune/saju/download', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          type: 'script',
          user,
          saju,
          oheng,
          result,
          premium,
          targetYear
        })
      });

      if (!response.ok) {
        throw new Error('미리보기 생성 실패');
      }

      const data = await response.json();
      setPreviewContent(data.script);
      setEstimatedDuration(data.estimatedDuration);
      setShowPreview(true);

    } catch (error) {
      console.error('Preview error:', error);
    }
  };

  const getButtonContent = (type: DownloadType) => {
    const state = downloadState[type];
    const isAudio = type === 'audio';

    if (state === 'loading') {
      return (
        <span className="flex items-center gap-2">
          <LoadingSpinner />
          {isAudio ? '음성 생성 중...' : 'PDF 생성 중...'}
        </span>
      );
    }

    if (state === 'success') {
      return (
        <span className="flex items-center gap-2">
          <CheckIcon />
          다운로드 완료
        </span>
      );
    }

    if (state === 'error') {
      return (
        <span className="flex items-center gap-2">
          <ErrorIcon />
          다시 시도
        </span>
      );
    }

    return (
      <span className="flex items-center gap-2">
        {isAudio ? <AudioIcon /> : <PDFIcon />}
        {isAudio ? '음성 다운로드' : 'PDF 다운로드'}
      </span>
    );
  };

  return (
    <div className="space-y-4">
      {/* 다운로드 버튼들 */}
      <div className="flex flex-wrap gap-3">
        {/* PDF 다운로드 */}
        <motion.button
          onClick={() => handleDownload('pdf')}
          disabled={downloadState.pdf === 'loading'}
          className={`
            flex-1 min-w-[140px] px-4 py-3 rounded-lg font-medium
            transition-all duration-200
            ${!isPremium
              ? 'bg-gray-100 text-gray-500 cursor-not-allowed'
              : downloadState.pdf === 'success'
              ? 'bg-green-500 text-white'
              : downloadState.pdf === 'error'
              ? 'bg-red-500 text-white'
              : 'bg-blue-500 hover:bg-blue-600 text-white'
            }
            disabled:opacity-50
          `}
          whileHover={isPremium ? { scale: 1.02 } : {}}
          whileTap={isPremium ? { scale: 0.98 } : {}}
        >
          {getButtonContent('pdf')}
        </motion.button>

        {/* 음성 다운로드 */}
        <motion.button
          onClick={() => handleDownload('audio')}
          disabled={downloadState.audio === 'loading'}
          className={`
            flex-1 min-w-[140px] px-4 py-3 rounded-lg font-medium
            transition-all duration-200
            ${!isPremium
              ? 'bg-gray-100 text-gray-500 cursor-not-allowed'
              : downloadState.audio === 'success'
              ? 'bg-green-500 text-white'
              : downloadState.audio === 'error'
              ? 'bg-red-500 text-white'
              : 'bg-purple-500 hover:bg-purple-600 text-white'
            }
            disabled:opacity-50
          `}
          whileHover={isPremium ? { scale: 1.02 } : {}}
          whileTap={isPremium ? { scale: 0.98 } : {}}
        >
          {getButtonContent('audio')}
        </motion.button>
      </div>

      {/* 미리보기 버튼 */}
      <button
        onClick={handlePreview}
        className={`
          w-full px-4 py-2 rounded-lg text-sm
          ${isPremium
            ? 'bg-gray-100 hover:bg-gray-200 text-gray-700'
            : 'bg-gray-50 text-gray-400 cursor-not-allowed'
          }
          transition-colors
        `}
      >
        <span className="flex items-center justify-center gap-2">
          <PreviewIcon />
          나레이션 스크립트 미리보기
        </span>
      </button>

      {/* 비프리미엄 안내 */}
      {!isPremium && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="p-4 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-lg border border-blue-200"
        >
          <div className="flex items-start gap-3">
            <DownloadIcon className="w-5 h-5 text-blue-500 flex-shrink-0 mt-0.5" />
            <div className="flex-1">
              <p className="text-sm font-medium text-blue-800">
                다운로드 구매 가능
              </p>
              <p className="text-xs text-blue-600 mt-1">
                PDF 리포트 ₩{DOWNLOAD_PRICES.pdf.toLocaleString()} / 음성 파일 ₩{DOWNLOAD_PRICES.audio.toLocaleString()}
              </p>
              <p className="text-xs text-blue-600 mt-1">
                프리미엄 구독 시 무료로 무제한 다운로드 가능!
              </p>
              <button
                onClick={onUpgradeClick}
                className="mt-2 text-xs font-medium text-blue-700 hover:text-blue-800 underline"
              >
                프리미엄 업그레이드 →
              </button>
            </div>
          </div>
        </motion.div>
      )}

      {/* 구매 모달 */}
      <AnimatePresence>
        {showPurchaseModal && selectedType && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4"
            onClick={() => setShowPurchaseModal(false)}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="bg-white rounded-xl max-w-sm w-full overflow-hidden shadow-xl"
              onClick={e => e.stopPropagation()}
            >
              <div className="p-6">
                <h3 className="text-lg font-bold text-gray-900 mb-2">
                  {selectedType === 'pdf' ? 'PDF 리포트' : '음성 파일'} 다운로드
                </h3>
                <p className="text-gray-600 text-sm mb-4">
                  {user.name}님의 사주 분석 결과를 {selectedType === 'pdf' ? 'PDF 문서로' : '음성 파일로'} 다운로드하세요.
                </p>

                <div className="bg-gray-50 rounded-lg p-4 mb-4">
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-gray-600">다운로드 비용</span>
                    <span className="text-xl font-bold text-gray-900">
                      ₩{DOWNLOAD_PRICES[selectedType].toLocaleString()}
                    </span>
                  </div>
                  <p className="text-xs text-gray-500">
                    결제 후 즉시 다운로드 가능합니다.
                  </p>
                </div>

                <div className="space-y-2">
                  <button
                    onClick={() => {
                      setShowPurchaseModal(false);
                      onPurchaseDownload?.(selectedType);
                    }}
                    className="w-full py-3 bg-blue-500 text-white font-medium rounded-lg hover:bg-blue-600 transition-colors"
                  >
                    ₩{DOWNLOAD_PRICES[selectedType].toLocaleString()}로 구매
                  </button>
                  <button
                    onClick={() => {
                      setShowPurchaseModal(false);
                      onUpgradeClick?.();
                    }}
                    className="w-full py-3 bg-gradient-to-r from-purple-500 to-pink-500 text-white font-medium rounded-lg hover:from-purple-600 hover:to-pink-600 transition-colors"
                  >
                    프리미엄으로 무제한 다운로드
                  </button>
                  <button
                    onClick={() => setShowPurchaseModal(false)}
                    className="w-full py-2 text-gray-500 text-sm hover:text-gray-700"
                  >
                    취소
                  </button>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* 미리보기 모달 */}
      <AnimatePresence>
        {showPreview && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4"
            onClick={() => setShowPreview(false)}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="bg-white rounded-xl max-w-2xl w-full max-h-[80vh] overflow-hidden"
              onClick={e => e.stopPropagation()}
            >
              <div className="p-4 border-b flex items-center justify-between">
                <div>
                  <h3 className="font-semibold text-gray-900">나레이션 스크립트</h3>
                  <p className="text-sm text-gray-500">
                    예상 재생 시간: {Math.floor(estimatedDuration / 60)}분 {estimatedDuration % 60}초
                  </p>
                </div>
                <button
                  onClick={() => setShowPreview(false)}
                  className="p-2 hover:bg-gray-100 rounded-lg"
                >
                  <CloseIcon />
                </button>
              </div>

              <div className="p-4 overflow-y-auto max-h-[60vh]">
                <pre className="whitespace-pre-wrap text-sm text-gray-700 font-sans leading-relaxed">
                  {previewContent}
                </pre>
              </div>

              <div className="p-4 border-t flex gap-3">
                <button
                  onClick={() => handleDownload('audio')}
                  disabled={downloadState.audio === 'loading'}
                  className="flex-1 px-4 py-2 bg-purple-500 text-white rounded-lg hover:bg-purple-600 disabled:opacity-50"
                >
                  {downloadState.audio === 'loading' ? '생성 중...' : '이 내용으로 음성 생성'}
                </button>
                <button
                  onClick={() => setShowPreview(false)}
                  className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200"
                >
                  닫기
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

// 아이콘 컴포넌트들
function PDFIcon() {
  return (
    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
        d="M7 21h10a2 2 0 002-2V9.414a1 1 0 00-.293-.707l-5.414-5.414A1 1 0 0012.586 3H7a2 2 0 00-2 2v14a2 2 0 002 2z" />
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
        d="M9 17h6M9 13h6M9 9h2" />
    </svg>
  );
}

function AudioIcon() {
  return (
    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
        d="M15.536 8.464a5 5 0 010 7.072M17.95 6.05a8 8 0 010 11.9M12 9v6M12 15a3 3 0 100-6 3 3 0 000 6z" />
    </svg>
  );
}

function LoadingSpinner() {
  return (
    <svg className="w-5 h-5 animate-spin" fill="none" viewBox="0 0 24 24">
      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
      <path className="opacity-75" fill="currentColor"
        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
    </svg>
  );
}

function CheckIcon() {
  return (
    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
    </svg>
  );
}

function ErrorIcon() {
  return (
    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
        d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
    </svg>
  );
}

function PreviewIcon() {
  return (
    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
        d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
        d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
    </svg>
  );
}

function LockIcon({ className }: { className?: string }) {
  return (
    <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
        d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
    </svg>
  );
}

function CloseIcon() {
  return (
    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
    </svg>
  );
}

function DownloadIcon({ className }: { className?: string }) {
  return (
    <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
        d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
    </svg>
  );
}
