'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Coins, Gift, CreditCard, HelpCircle, ChevronRight, Crown, Sparkles, Check } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { ConversionTemplate, PRODUCTS } from '@/types/saju';
import { Link } from '@/i18n/routing';

interface Props {
  isOpen: boolean;
  onClose: () => void;
  template: ConversionTemplate;
  onPurchase: (productId: string) => void;
  userPoints?: number;
  isAdmin?: boolean;
  isFirstVisit?: boolean;
}

// 포인트 충전 금액별 보너스
const POINT_BONUS = [
  { amount: 5000, bonus: 0, label: '5,000원' },
  { amount: 10000, bonus: 10, label: '10,000원', tag: '+10%' },
  { amount: 30000, bonus: 15, label: '30,000원', tag: '+15%' },
  { amount: 50000, bonus: 20, label: '50,000원', tag: '+20%', recommended: true },
];

export default function PaywallModal({
  isOpen,
  onClose,
  template,
  onPurchase,
  userPoints = 0,
  isAdmin = false,
  isFirstVisit = false
}: Props) {
  const [selectedProduct, setSelectedProduct] = useState<string>('deep');
  const [showCouponCopied, setShowCouponCopied] = useState(false);

  if (!isOpen) return null;

  const selectedProductData = PRODUCTS.find(p => p.id === selectedProduct);
  const requiredPoints = selectedProductData?.pointCost || 0;
  const hasEnoughPoints = isAdmin || userPoints >= requiredPoints;
  const neededPoints = Math.max(0, requiredPoints - userPoints);

  const handlePurchase = () => {
    if (selectedProduct && hasEnoughPoints) {
      onPurchase(selectedProduct);
    }
  };

  const handleCopyCoupon = () => {
    navigator.clipboard.writeText('WELCOME50');
    setShowCouponCopied(true);
    setTimeout(() => setShowCouponCopied(false), 2000);
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

          {/* ===== 첫 가입 쿠폰 ===== */}
          {isFirstVisit && !isAdmin && (
            <div className="mx-5 mb-4 p-4 bg-gradient-to-r from-amber-50 to-yellow-50 dark:from-amber-900/20 dark:to-yellow-900/20 rounded-xl border border-amber-200 dark:border-amber-800">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Gift className="w-5 h-5 text-amber-600" />
                  <span className="font-bold text-amber-700 dark:text-amber-400">첫 가입 50% 쿠폰</span>
                </div>
                <button
                  onClick={handleCopyCoupon}
                  className="px-3 py-1.5 bg-amber-500 hover:bg-amber-600 text-white text-sm font-medium rounded-lg transition-colors"
                >
                  {showCouponCopied ? '복사됨!' : 'WELCOME50'}
                </button>
              </div>
              <p className="text-xs text-amber-600 dark:text-amber-500 mt-2">
                포인트 충전 시 쿠폰코드 입력하세요
              </p>
            </div>
          )}

          {/* ===== 내 포인트 현황 ===== */}
          {!isAdmin && (
            <div className="mx-5 mb-4 p-4 bg-gray-50 dark:bg-gray-800 rounded-xl">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Coins className="w-5 h-5 text-yellow-500" />
                  <span className="text-sm text-gray-600 dark:text-gray-400">내 포인트</span>
                </div>
                <span className="text-xl font-bold text-gray-800 dark:text-white">
                  {userPoints.toLocaleString()}P
                </span>
              </div>
              {!hasEnoughPoints && (
                <div className="mt-2 text-sm text-red-500">
                  {neededPoints.toLocaleString()}P 더 필요해요
                </div>
              )}
            </div>
          )}

          {/* ===== 상품 선택 (심플) ===== */}
          <div className="px-5 pb-4 space-y-2">
            {PRODUCTS.slice(0, 3).map(product => {
              const isSelected = selectedProduct === product.id;
              const canAfford = isAdmin || userPoints >= product.pointCost;

              return (
                <button
                  key={product.id}
                  onClick={() => setSelectedProduct(product.id)}
                  className={`w-full p-3 rounded-xl border-2 text-left transition-all flex items-center justify-between
                    ${isSelected
                      ? 'border-purple-500 bg-purple-50 dark:bg-purple-900/20'
                      : 'border-gray-200 dark:border-gray-700 hover:border-purple-300'}
                    ${!canAfford && !isAdmin ? 'opacity-50' : ''}`}
                >
                  <div className="flex items-center gap-3">
                    <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center
                      ${isSelected ? 'border-purple-500 bg-purple-500' : 'border-gray-300'}`}>
                      {isSelected && <Check className="w-3 h-3 text-white" />}
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="font-medium text-gray-800 dark:text-white">{product.name}</span>
                        {product.recommended && (
                          <span className="px-1.5 py-0.5 bg-purple-500 text-white text-[10px] rounded">추천</span>
                        )}
                      </div>
                      <p className="text-xs text-gray-500 dark:text-gray-400">
                        {product.features[0]}
                      </p>
                    </div>
                  </div>
                  <div className="text-right">
                    <span className="font-bold text-purple-600">{product.pointCost.toLocaleString()}P</span>
                    <p className="text-xs text-gray-400 line-through">{product.originalPointCost.toLocaleString()}P</p>
                  </div>
                </button>
              );
            })}
          </div>

          {/* ===== 구매/충전 버튼 ===== */}
          <div className="p-5 pt-0 space-y-3">
            {hasEnoughPoints ? (
              <Button
                onClick={handlePurchase}
                className="w-full py-5 text-base font-bold bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700"
              >
                {requiredPoints.toLocaleString()}P로 분석받기
              </Button>
            ) : (
              <Link href="/my/points" className="block">
                <Button className="w-full py-5 text-base font-bold bg-gradient-to-r from-amber-500 to-orange-500">
                  <CreditCard className="w-5 h-5 mr-2" />
                  포인트 충전하기
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

          {/* ===== 포인트 보너스 안내 ===== */}
          {!isAdmin && !hasEnoughPoints && (
            <div className="px-5 pb-5">
              <div className="p-4 bg-blue-50 dark:bg-blue-900/20 rounded-xl">
                <p className="text-sm font-medium text-blue-700 dark:text-blue-400 mb-3">
                  💡 충전 금액별 보너스
                </p>
                <div className="grid grid-cols-2 gap-2">
                  {POINT_BONUS.map(item => (
                    <div
                      key={item.amount}
                      className={`p-2 rounded-lg text-center text-sm
                        ${item.recommended
                          ? 'bg-blue-100 dark:bg-blue-800/30 border border-blue-300 dark:border-blue-700'
                          : 'bg-white dark:bg-gray-800'}`}
                    >
                      <p className="font-medium text-gray-800 dark:text-white">{item.label}</p>
                      {item.tag && (
                        <span className="text-xs text-blue-600 dark:text-blue-400 font-bold">{item.tag}</span>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* ===== 안내 링크 ===== */}
          <div className="px-5 pb-5 space-y-1">
            {[
              { label: '포인트 이용안내', href: '/guide#points' },
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
 * 포인트 부족 팝업 (심플 버전)
 */
export function InsufficientPointsPopup({
  isOpen,
  onClose,
  requiredPoints,
  currentPoints
}: {
  isOpen: boolean;
  onClose: () => void;
  requiredPoints: number;
  currentPoints: number;
}) {
  if (!isOpen) return null;

  const neededPoints = requiredPoints - currentPoints;

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
            <Coins className="w-7 h-7 text-amber-600" />
          </div>
          <h3 className="text-lg font-bold text-gray-800 dark:text-white mb-3">
            포인트가 부족해요
          </h3>
          <div className="p-3 bg-gray-50 dark:bg-gray-800 rounded-xl mb-4">
            <div className="flex justify-between text-sm mb-1">
              <span className="text-gray-500">필요</span>
              <span className="font-bold text-purple-600">{requiredPoints.toLocaleString()}P</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-gray-500">보유</span>
              <span className="font-bold">{currentPoints.toLocaleString()}P</span>
            </div>
            <div className="border-t dark:border-gray-700 mt-2 pt-2 flex justify-between text-sm">
              <span className="text-gray-500">부족</span>
              <span className="font-bold text-red-500">{neededPoints.toLocaleString()}P</span>
            </div>
          </div>

          <Link href="/my/points" className="block mb-3">
            <Button className="w-full bg-gradient-to-r from-amber-500 to-orange-500">
              포인트 충전하기
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

/**
 * 이탈 방지 팝업 (심플 버전)
 */
export function ExitIntentPopup({
  isOpen,
  onClose,
  onAcceptOffer,
  bonusPoints = 100
}: {
  isOpen: boolean;
  onClose: () => void;
  onAcceptOffer: () => void;
  bonusPoints?: number;
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
          <div className="text-4xl mb-3">🎁</div>
          <h3 className="text-lg font-bold text-gray-800 dark:text-white mb-2">
            잠깐만요!
          </h3>
          <p className="text-gray-600 dark:text-gray-400 mb-4">
            지금 결정하면 <span className="font-bold text-amber-600">{bonusPoints}P</span> 보너스!
          </p>

          <Button
            onClick={onAcceptOffer}
            className="w-full mb-3 bg-gradient-to-r from-purple-600 to-pink-600"
          >
            보너스 받고 계속하기
          </Button>
          <button onClick={onClose} className="w-full py-2 text-gray-400 text-sm">
            그냥 나갈게요
          </button>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}
