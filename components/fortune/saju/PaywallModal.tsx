'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Clock, Shield, Users, CheckCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { ConversionTemplate, PRODUCTS } from '@/types/saju';

interface Props {
  isOpen: boolean;
  onClose: () => void;
  template: ConversionTemplate;
  onPurchase: (productId: string) => void;
  socialProof?: string[];
}

export default function PaywallModal({
  isOpen,
  onClose,
  template,
  onPurchase,
  socialProof = []
}: Props) {
  const [timeLeft, setTimeLeft] = useState(template.discount?.expiresIn || 24);
  const [selectedProduct, setSelectedProduct] = useState<string | null>(null);

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

  const handlePurchase = () => {
    if (selectedProduct) {
      onPurchase(selectedProduct);
    } else {
      onPurchase('basic');
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
          </div>

          {/* Content */}
          <div className="p-6 space-y-4">
            {template.bullets.map((bullet, idx) => (
              <motion.div
                key={idx}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: idx * 0.1 }}
                className="p-4 bg-gray-50 dark:bg-gray-800 rounded-xl"
              >
                <p className="text-sm text-gray-700 dark:text-gray-300 whitespace-pre-line leading-relaxed">
                  {bullet}
                </p>
              </motion.div>
            ))}

            {/* Urgency Message */}
            {template.urgency && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.3 }}
                className="p-4 bg-amber-50 dark:bg-amber-900/30 border border-amber-200 dark:border-amber-800 rounded-xl"
              >
                <p className="text-sm text-amber-800 dark:text-amber-200 whitespace-pre-line font-medium">
                  {template.urgency}
                </p>
              </motion.div>
            )}

            {/* Discount Timer */}
            {template.discount && (
              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.4 }}
                className="p-4 bg-gradient-to-r from-red-50 to-pink-50 dark:from-red-900/30 dark:to-pink-900/30 border border-red-200 dark:border-red-800 rounded-xl text-center"
              >
                <div className="flex items-center justify-center gap-2 text-red-600 dark:text-red-400 font-bold text-lg">
                  <Clock className="w-5 h-5" />
                  {template.discount.amount.toLocaleString()}원 할인
                </div>
                <p className="text-sm text-red-500 dark:text-red-400 mt-2 font-mono">
                  남은 시간: {formatTime(timeLeft)}
                </p>
              </motion.div>
            )}

            {/* Product Selection */}
            {template.type !== 'exit' && (
              <div className="space-y-3 pt-2">
                <p className="text-sm font-medium text-gray-700 dark:text-gray-300">
                  상품 선택
                </p>
                {PRODUCTS.slice(0, 3).map(product => (
                  <button
                    key={product.id}
                    onClick={() => setSelectedProduct(product.id)}
                    className={`w-full p-4 rounded-xl border-2 text-left transition-all
                      ${selectedProduct === product.id
                        ? 'border-purple-600 bg-purple-50 dark:bg-purple-900/30'
                        : 'border-gray-200 dark:border-gray-700 hover:border-purple-300'}`}
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
                          <span className="text-lg font-bold text-purple-600">
                            {(product.price - (template.discount?.amount || 0)).toLocaleString()}원
                          </span>
                          <span className="text-sm text-gray-400 line-through">
                            {product.originalPrice.toLocaleString()}원
                          </span>
                        </div>
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
                ))}
              </div>
            )}
          </div>

          {/* Footer */}
          <div className="p-6 border-t dark:border-gray-800 space-y-3">
            <Button
              onClick={handlePurchase}
              className="w-full py-6 text-lg font-bold bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700"
            >
              {template.cta}
            </Button>

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
                24시간 환불 보장
              </div>
              <div className="flex items-center gap-1 text-xs text-gray-400">
                <Users className="w-3 h-3" />
                {socialProof[0] || '3,847명이 확인함'}
              </div>
            </div>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}

/**
 * 이탈 방지 팝업 (간소화 버전)
 */
export function ExitIntentPopup({
  isOpen,
  onClose,
  onAcceptOffer,
  discountAmount = 3000
}: {
  isOpen: boolean;
  onClose: () => void;
  onAcceptOffer: () => void;
  discountAmount?: number;
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
          <div className="text-4xl mb-4">😢</div>
          <h3 className="text-xl font-bold text-gray-800 dark:text-white mb-2">
            잠깐만요!
          </h3>
          <p className="text-gray-600 dark:text-gray-400 mb-6">
            지금 떠나시면 분석 결과가 사라집니다.
            <br />
            <span className="font-bold text-purple-600">
              {discountAmount.toLocaleString()}원 할인 쿠폰
            </span>을 드릴까요?
          </p>

          <div className="space-y-3">
            <Button
              onClick={onAcceptOffer}
              className="w-full bg-gradient-to-r from-purple-600 to-pink-600"
            >
              할인받고 계속하기
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
