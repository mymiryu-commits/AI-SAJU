'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Ticket, HelpCircle, ChevronRight, Crown, Sparkles, Check, ShoppingCart } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { ConversionTemplate } from '@/types/saju';
import { Link } from '@/i18n/routing';

interface Props {
  isOpen: boolean;
  onClose: () => void;
  template: ConversionTemplate;
  onPurchase: (productId: string) => void;
  userVouchers?: number;
  isAdmin?: boolean;
}

// 결제권 패키지
const VOUCHER_PACKAGES = [
  { id: 'basic', name: '베이직', tickets: 1, price: 4900, features: ['사주 기본 분석', '오행 분석', '성격 분석'] },
  { id: 'standard', name: '스탠다드', tickets: 2, price: 9800, features: ['베이직 전체', '궁합 분석', 'PDF 리포트'], recommended: true },
  { id: 'premium', name: '프리미엄', tickets: 4, price: 19600, features: ['스탠다드 전체', '10년 대운', 'AI 상담', '음성 리포트'] },
];

export default function PaywallModal({
  isOpen,
  onClose,
  template,
  onPurchase,
  userVouchers = 0,
  isAdmin = false,
}: Props) {
  const [selectedPackage, setSelectedPackage] = useState<string>('standard');

  if (!isOpen) return null;

  const hasVoucher = isAdmin || userVouchers > 0;

  const handlePurchase = () => {
    if (selectedPackage && hasVoucher) {
      onPurchase(selectedPackage);
    }
  };

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4"
        onClick={onClose}
      >
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 20 }}
          className="bg-white dark:bg-gray-900 rounded-2xl max-w-sm w-full max-h-[85vh] overflow-y-auto shadow-2xl"
          onClick={e => e.stopPropagation()}
        >
          {/* ===== 헤더 ===== */}
          <div className="relative p-5 pb-4">
            <button
              onClick={onClose}
              className="absolute top-3 right-3 p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-800"
            >
              <X className="w-5 h-5 text-gray-400" />
            </button>

            <div className="flex items-center gap-3">
              <div className="w-12 h-12 bg-gradient-to-br from-purple-500 to-pink-500 rounded-xl flex items-center justify-center">
                <Sparkles className="w-6 h-6 text-white" />
              </div>
              <div>
                <h2 className="text-lg font-bold text-gray-800 dark:text-white">
                  프리미엄 분석
                </h2>
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  더 깊은 인사이트를 확인하세요
                </p>
              </div>
            </div>
          </div>

          {/* ===== 관리자 모드 ===== */}
          {isAdmin && (
            <div className="mx-5 mb-4 p-3 bg-gradient-to-r from-purple-500 to-pink-500 rounded-xl">
              <div className="flex items-center gap-2 text-white">
                <Crown className="w-5 h-5" />
                <span className="font-bold">관리자 무제한 이용</span>
              </div>
            </div>
          )}

          {/* ===== 내 결제권 현황 ===== */}
          {!isAdmin && (
            <div className="mx-5 mb-4 p-4 bg-gray-50 dark:bg-gray-800 rounded-xl">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Ticket className="w-5 h-5 text-purple-500" />
                  <span className="text-sm text-gray-600 dark:text-gray-400">내 결제권</span>
                </div>
                <span className="text-xl font-bold text-gray-800 dark:text-white">
                  {userVouchers}장
                </span>
              </div>
              {!hasVoucher && (
                <div className="mt-2 text-sm text-red-500">
                  결제권이 없습니다
                </div>
              )}
            </div>
          )}

          {/* ===== 패키지 선택 ===== */}
          <div className="px-5 pb-4 space-y-3">
            {VOUCHER_PACKAGES.map(pkg => {
              const isSelected = selectedPackage === pkg.id;

              return (
                <button
                  key={pkg.id}
                  onClick={() => setSelectedPackage(pkg.id)}
                  className={`w-full p-4 rounded-xl border-2 text-left transition-all
                    ${isSelected
                      ? 'border-purple-500 bg-purple-50 dark:bg-purple-900/20'
                      : 'border-gray-200 dark:border-gray-700 hover:border-purple-300'}`}
                >
                  <div className="flex items-start justify-between">
                    <div className="flex items-start gap-3">
                      <div className={`w-5 h-5 mt-0.5 rounded-full border-2 flex items-center justify-center flex-shrink-0
                        ${isSelected ? 'border-purple-500 bg-purple-500' : 'border-gray-300'}`}>
                        {isSelected && <Check className="w-3 h-3 text-white" />}
                      </div>
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="font-bold text-gray-800 dark:text-white">{pkg.name}</span>
                          {pkg.recommended && (
                            <span className="px-1.5 py-0.5 bg-purple-500 text-white text-[10px] rounded font-medium">추천</span>
                          )}
                        </div>
                        <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                          결제권 {pkg.tickets}장 · ₩{pkg.price.toLocaleString()}
                        </p>
                      </div>
                    </div>
                    <div className="text-right flex-shrink-0 ml-3">
                      <span className="font-bold text-purple-600 text-lg">{pkg.tickets}장</span>
                    </div>
                  </div>

                  {/* 선택된 상품의 상세 기능 표시 */}
                  {isSelected && (
                    <div className="mt-3 pt-3 border-t border-purple-200 dark:border-purple-800">
                      <ul className="space-y-1">
                        {pkg.features.map((feature, idx) => (
                          <li key={idx} className="flex items-center gap-2 text-xs text-gray-600 dark:text-gray-400">
                            <Check className="w-3 h-3 text-purple-500 flex-shrink-0" />
                            <span>{feature}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}
                </button>
              );
            })}
          </div>

          {/* ===== 분석/구매 버튼 ===== */}
          <div className="p-5 pt-0 space-y-3">
            {hasVoucher ? (
              <Button
                onClick={handlePurchase}
                className="w-full py-5 text-base font-bold bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700"
              >
                결제권 사용하여 분석받기
              </Button>
            ) : (
              <Link href="/my/vouchers" className="block">
                <Button className="w-full py-5 text-base font-bold bg-gradient-to-r from-amber-500 to-orange-500">
                  <ShoppingCart className="w-5 h-5 mr-2" />
                  결제권 구매하기
                </Button>
              </Link>
            )}

            <button
              onClick={onClose}
              className="w-full py-2 text-sm text-gray-400 hover:text-gray-600"
            >
              다음에 할게요
            </button>
          </div>

          {/* ===== 안내 링크 ===== */}
          <div className="px-5 pb-5 space-y-1">
            {[
              { label: '결제권 이용안내', href: '/guide#vouchers' },
              { label: '환불 정책', href: '/legal/refund' },
              { label: '자주 묻는 질문', href: '/guide#faq' },
            ].map(link => (
              <Link
                key={link.href}
                href={link.href}
                className="flex items-center justify-between py-2 text-sm text-gray-500 hover:text-gray-700 dark:hover:text-gray-300"
              >
                <div className="flex items-center gap-2">
                  <HelpCircle className="w-4 h-4" />
                  {link.label}
                </div>
                <ChevronRight className="w-4 h-4" />
              </Link>
            ))}
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}

/**
 * 결제권 부족 팝업
 */
export function NoVoucherPopup({
  isOpen,
  onClose,
}: {
  isOpen: boolean;
  onClose: () => void;
}) {
  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 bg-black/70 flex items-center justify-center z-50 p-4"
      >
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 20 }}
          className="bg-white dark:bg-gray-900 rounded-2xl max-w-xs w-full p-6 text-center"
        >
          <div className="w-14 h-14 mx-auto mb-4 bg-amber-100 dark:bg-amber-900/30 rounded-full flex items-center justify-center">
            <Ticket className="w-7 h-7 text-amber-600" />
          </div>
          <h3 className="text-lg font-bold text-gray-800 dark:text-white mb-3">
            결제권이 없습니다
          </h3>
          <p className="text-sm text-gray-500 dark:text-gray-400 mb-4">
            분석을 계속하려면 결제권을 구매해주세요.
          </p>

          <Link href="/my/vouchers" className="block mb-3">
            <Button className="w-full bg-gradient-to-r from-purple-500 to-pink-500">
              결제권 구매하기
            </Button>
          </Link>
          <button onClick={onClose} className="w-full py-2 text-gray-400 text-sm">
            닫기
          </button>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}
