'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import type { CardDeck as CardDeckType } from '@/types/cards';
import { getCardDescription } from '@/lib/fortune/saju/cards';

interface CardDeckProps {
  cardDeck: CardDeckType;
  destinyLine?: string;
  userName?: string;
  onSave?: () => void;
  onShare?: () => void;
  className?: string;
}

type CardType = 'essence' | 'energy' | 'talent' | 'flow' | 'fortune' | 'guardian';

// 카드 타입별 아이콘
const cardIcons: Record<CardType, string> = {
  essence: '🌸',
  energy: '🦌',
  talent: '🌳',
  flow: '🌅',
  fortune: '🔢',
  guardian: '💎'
};

// 카드 타입별 배경 그라데이션
const cardGradients: Record<CardType, string> = {
  essence: 'from-pink-400 to-rose-500',
  energy: 'from-emerald-400 to-teal-500',
  talent: 'from-amber-400 to-orange-500',
  flow: 'from-sky-400 to-blue-500',
  fortune: 'from-violet-400 to-purple-500',
  guardian: 'from-cyan-400 to-indigo-500'
};

export function CardDeck({
  cardDeck,
  destinyLine,
  userName,
  onSave,
  onShare,
  className = ''
}: CardDeckProps) {
  const [selectedCard, setSelectedCard] = useState<CardType | null>(null);
  const [isFlipped, setIsFlipped] = useState(false);

  const cardTypes: CardType[] = ['essence', 'energy', 'talent', 'flow', 'fortune', 'guardian'];

  const handleCardClick = (cardType: CardType) => {
    if (selectedCard === cardType) {
      setIsFlipped(!isFlipped);
    } else {
      setSelectedCard(cardType);
      setIsFlipped(false);
    }
  };

  return (
    <div className={`rounded-xl border border-gray-200 bg-white p-6 ${className}`}>
      {/* 헤더 */}
      <div className="mb-6 text-center">
        <h3 className="text-lg font-bold text-gray-900">
          ✦ 나의 운명 카드 ✦
        </h3>
        {userName && (
          <p className="mt-1 text-sm text-gray-500">{userName}님의 카드 덱</p>
        )}
      </div>

      {/* 6장 카드 그리드 */}
      <div className="grid grid-cols-3 gap-3 sm:grid-cols-6">
        {cardTypes.map((type, index) => {
          const desc = getCardDescription(type, cardDeck);
          const isSelected = selectedCard === type;

          return (
            <motion.button
              key={type}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              onClick={() => handleCardClick(type)}
              className={`relative aspect-[2/3] rounded-lg p-2 text-white shadow-lg transition-all ${
                isSelected ? 'ring-2 ring-yellow-400 scale-105' : 'hover:scale-105'
              }`}
              style={{
                background: `linear-gradient(135deg, var(--tw-gradient-from), var(--tw-gradient-to))`
              }}
            >
              <div className={`absolute inset-0 rounded-lg bg-gradient-to-br ${cardGradients[type]}`} />
              <div className="relative flex h-full flex-col items-center justify-center">
                <span className="text-2xl sm:text-3xl">{cardIcons[type]}</span>
                <span className="mt-1 text-[10px] sm:text-xs font-medium opacity-90">
                  {desc.subtitle}
                </span>
                <span className="text-[8px] sm:text-[10px] opacity-70">
                  {desc.title}
                </span>
              </div>
            </motion.button>
          );
        })}
      </div>

      {/* 선택된 카드 상세 */}
      <AnimatePresence mode="wait">
        {selectedCard && (
          <motion.div
            key={selectedCard}
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="mt-4 overflow-hidden"
          >
            <div className={`rounded-lg bg-gradient-to-br ${cardGradients[selectedCard]} p-4 text-white`}>
              {(() => {
                const desc = getCardDescription(selectedCard, cardDeck);
                return (
                  <>
                    <div className="flex items-center gap-2">
                      <span className="text-2xl">{cardIcons[selectedCard]}</span>
                      <div>
                        <h4 className="font-bold">{desc.title}: {desc.subtitle}</h4>
                        <div className="flex flex-wrap gap-1 mt-1">
                          {desc.keywords.map((kw, i) => (
                            <span key={i} className="rounded-full bg-white/20 px-2 py-0.5 text-xs">
                              #{kw}
                            </span>
                          ))}
                        </div>
                      </div>
                    </div>
                    <p className="mt-3 text-sm leading-relaxed opacity-95">
                      {desc.description}
                    </p>
                  </>
                );
              })()}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* 한 줄 운명 */}
      {destinyLine && (
        <div className="mt-6 rounded-lg bg-gradient-to-r from-gray-900 to-gray-800 p-4 text-center">
          <p className="text-xs text-gray-400 mb-1">나의 운명을 한 줄로</p>
          <p className="text-sm font-medium text-white">
            "{destinyLine}"
          </p>
        </div>
      )}

      {/* 저장/공유 버튼 */}
      <div className="mt-4 flex gap-2">
        {onSave && (
          <button
            onClick={onSave}
            className="flex-1 rounded-lg border border-gray-300 bg-white py-2.5 text-sm font-medium text-gray-700 hover:bg-gray-50"
          >
            📥 저장하기
          </button>
        )}
        {onShare && (
          <button
            onClick={onShare}
            className="flex-1 rounded-lg bg-gradient-to-r from-purple-500 to-pink-500 py-2.5 text-sm font-medium text-white hover:opacity-90"
          >
            📤 공유하기
          </button>
        )}
      </div>
    </div>
  );
}

export default CardDeck;
