'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Clock, Shield, Users, CheckCircle, Coins, AlertCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { ConversionTemplate, PRODUCTS } from '@/types/saju';
import { Link } from '@/i18n/routing';

interface Props {
  isOpen: boolean;
  onClose: () => void;
  template: ConversionTemplate;
  onPurchase: (productId: string) => void;
  userPoints?: number;
  socialProof?: string[];
}

export default function PaywallModal({
  isOpen,
  onClose,
  template,
  onPurchase,
  userPoints = 0,
  socialProof = []
}: Props) {
  const [timeLeft, setTimeLeft] = useState(template.discount?.expiresIn || 24);
  const [selectedProduct, setSelectedProduct] = useState<string | null>('deep');

  useEffect(() => {
    if (!isOpen || !template.discount) return;

    const timer = setInterval(() => {
      setTimeLeft(prev => Math.max(0, prev - 1 / 3600));
    }, 1000);

    return () => clearInterval(timer);
  }, [isOpen, template.discount]);

  if (!isOpen) return null;

  const formatTime = (hours: number) => {
    const h = Math.floor(hours);
    const m = Math.floor((hours - h) * 60);
    const s = Math.floor(((hours - h) * 60 - m) * 60);
    return `${h}시간 ${m}분 ${s}초`;
  };

  const selectedProductData = PRODUCTS.find(p => p.id === selectedProduct);
  const hasEnoughPoints = userPoints >= (selectedProductData?.pointCost || 0);

  const handlePurchase = () => {
    if (selectedProduct && hasEnoughPoints) {
      onPurchase(selectedProduct);
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
          className="bg-white dark:bg-gray-900 rounded-2xl max-w-md w-full max-h-[90vh] overflow-y-auto shadow-2xl"
          onClick={e => e.stopPropagation()}
        >
          {/* Header */}
          <div className="relative p-6 border-b dark:border-gray-800">
            <button
              onClick={onClose}
              className="absolute top-4 right-4 p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
            >
              <X className="w-5 h-5 text-gray-500" />
            </button>
            <h2 className="text-xl font-bold text-gray-800 dark:text-white whitespace-pre-line pr-8">
              {template.headline}
            </h2>

            {/* 보유 포인트 표시 */}
            <div className="mt-3 flex items-center gap-2 text-sm">
              <Coins className="w-4 h-4 text-yellow-500" />
              <span className="text-gray-600 dark:text-gray-400">보유 포인트:</span>
              <span className="font-bold text-yellow-600">{userPoints.toLocaleString()}P</span>
            </div>
          </div>

          {/* Content */}
          <div className="p-6 space-y-4">
            {template.bullets.slice(0, 2).map((bullet, idx) => (
              <motion.div
                key={idx}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: idx * 0.1 }}
                className="p-3 bg-gray-50 dark:bg-gray-800 rounded-xl"
              >
                <p className="text-sm text-gray-700 dark:text-gray-300 whitespace-pre-line leading-relaxed">
                  {bullet}
                </p>
              </motion.div>
            ))}

            {/* 포인트 할인 타이머 */}
            {template.discount && (
              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.3 }}
                className="p-4 bg-gradient-to-r from-yellow-50 to-amber-50 dark:from-yellow-900/30 dark:to-amber-900/30 border border-yellow-200 dark:border-yellow-800 rounded-xl text-center"
              >
                <div className="flex items-center justify-center gap-2 text-yellow-600 dark:text-yellow-400 font-bold text-lg">
                  <Clock className="w-5 h-5" />
                  30% 포인트 할인 중!
                </div>
                <p className="text-sm text-yellow-500 dark:text-yellow-400 mt-2 font-mono">
                  남은 시간: {formatTime(timeLeft)}
                </p>
              </motion.div>
            )}

            {/* 상품 선택 (포인트 기반) */}
            <div className="space-y-3 pt-2">
              <p className="text-sm font-medium text-gray-700 dark:text-gray-300">
                분석 상품 선택
              </p>
              {PRODUCTS.slice(0, 3).map(product => {
                const canAfford = userPoints >= product.pointCost;
                return (
                  <button
                    key={product.id}
                    onClick={() => setSelectedProduct(product.id)}
                    className={`w-full p-4 rounded-xl border-2 text-left transition-all
                      ${selectedProduct === product.id
                        ? 'border-purple-600 bg-purple-50 dark:bg-purple-900/30'
                        : 'border-gray-200 dark:border-gray-700 hover:border-purple-300'}
                      ${!canAfford ? 'opacity-60' : ''}`}
                  >
                    <div className="flex justify-between items-start">
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="font-bold text-gray-800 dark:text-white">
                            {product.name}
                          </span>
                          {product.recommended && (
                            <span className="px-2 py-0.5 bg-purple-600 text-white text-xs rounded-full">
                              추천
                            </span>
                          )}
                        </div>
                        <div className="flex items-center gap-2 mt-1">
                          <Coins className="w-4 h-4 text-yellow-500" />
                          <span className="text-lg font-bold text-purple-600">
                            {product.pointCost.toLocaleString()}P
                          </span>
                          <span className="text-sm text-gray-400 line-through">
                            {product.originalPointCost.toLocaleString()}P
                          </span>
                        </div>
                        {!canAfford && (
                          <p className="text-xs text-red-500 mt-1 flex items-center gap-1">
                            <AlertCircle className="w-3 h-3" />
                            포인트 부족 ({(product.pointCost - userPoints).toLocaleString()}P 필요)
                          </p>
                        )}
                      </div>
                      <div className={`w-6 h-6 rounded-full border-2 flex items-center justify-center
                        ${selectedProduct === product.id
                          ? 'border-purple-600 bg-purple-600'
                          : 'border-gray-300'}`}
                      >
                        {selectedProduct === product.id && (
                          <CheckCircle className="w-4 h-4 text-white" />
                        )}
                      </div>
                    </div>
                    <ul className="mt-2 space-y-1">
                      {product.features.slice(0, 2).map((feature, i) => (
                        <li key={i} className="text-xs text-gray-500 dark:text-gray-400 flex items-center gap-1">
                          <span className="text-green-500">✓</span> {feature}
                        </li>
                      ))}
                    </ul>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Footer */}
          <div className="p-6 border-t dark:border-gray-800 space-y-3">
            {hasEnoughPoints ? (
              <Button
                onClick={handlePurchase}
                className="w-full py-6 text-lg font-bold bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700"
              >
                <Coins className="w-5 h-5 mr-2" />
                {selectedProductData?.pointCost.toLocaleString()}P로 분석 받기
              </Button>
            ) : (
              <Link href="/my/points" className="block">
                <Button
                  className="w-full py-6 text-lg font-bold bg-gradient-to-r from-yellow-500 to-amber-500 hover:from-yellow-600 hover:to-amber-600"
                >
                  <Coins className="w-5 h-5 mr-2" />
                  포인트 충전하러 가기
                </Button>
              </Link>
            )}

            <button
              onClick={onClose}
              className="w-full py-3 text-gray-500 hover:text-gray-700 dark:hover:text-gray-300 transition-colors text-sm"
            >
              나중에 할게요
            </button>

            {/* Trust Badges */}
            <div className="flex flex-wrap justify-center gap-3 pt-2">
              <div className="flex items-center gap-1 text-xs text-gray-400">
                <Shield className="w-3 h-3" />
                분석 불만족시 포인트 환불
              </div>
              <div className="flex items-center gap-1 text-xs text-gray-400">
                <Users className="w-3 h-3" />
                {socialProof[0] || '3,847명이 이용함'}
              </div>
            </div>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}

/**
 * 포인트 부족 팝업
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
          className="bg-white dark:bg-gray-900 rounded-2xl max-w-sm w-full p-6 text-center"
        >
          <div className="w-16 h-16 mx-auto mb-4 bg-yellow-100 dark:bg-yellow-900/30 rounded-full flex items-center justify-center">
            <Coins className="w-8 h-8 text-yellow-600" />
          </div>
          <h3 className="text-xl font-bold text-gray-800 dark:text-white mb-2">
            포인트가 부족합니다
          </h3>
          <p className="text-gray-600 dark:text-gray-400 mb-2">
            필요: <span className="font-bold text-purple-600">{requiredPoints.toLocaleString()}P</span>
          </p>
          <p className="text-gray-600 dark:text-gray-400 mb-6">
            보유: <span className="font-bold">{currentPoints.toLocaleString()}P</span>
            <span className="text-red-500 ml-2">(-{neededPoints.toLocaleString()}P)</span>
          </p>

          <div className="space-y-3">
            <Link href="/my/points">
              <Button className="w-full bg-gradient-to-r from-yellow-500 to-amber-500">
                <Coins className="w-4 h-4 mr-2" />
                포인트 충전하기
              </Button>
            </Link>
            <button
              onClick={onClose}
              className="w-full py-2 text-gray-500 text-sm"
            >
              닫기
            </button>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}

/**
 * 이탈 방지 팝업 (포인트 할인)
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
          className="bg-white dark:bg-gray-900 rounded-2xl max-w-sm w-full p-6 text-center"
        >
          <div className="text-4xl mb-4">🎁</div>
          <h3 className="text-xl font-bold text-gray-800 dark:text-white mb-2">
            잠깐만요!
          </h3>
          <p className="text-gray-600 dark:text-gray-400 mb-6">
            지금 결정하시면
            <br />
            <span className="font-bold text-yellow-600">
              보너스 {bonusPoints.toLocaleString()}P
            </span>를 드립니다!
          </p>

          <div className="space-y-3">
            <Button
              onClick={onAcceptOffer}
              className="w-full bg-gradient-to-r from-purple-600 to-pink-600"
            >
              <Coins className="w-4 h-4 mr-2" />
              보너스 받고 계속하기
            </Button>
            <button
              onClick={onClose}
              className="w-full py-2 text-gray-500 text-sm"
            >
              그냥 나갈게요
            </button>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}
