'use client';

import { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  TrendingUp, Heart, Briefcase, Activity, Sparkles,
  Lock, ChevronRight, Calendar, Target, Star,
  Compass, DollarSign, Shield, Lightbulb, CheckCircle2, Brain, Download,
  Flower2, Trees, Gem, Zap, Clock, Layers, ArrowRight, Crown, Sun
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import {
  AnalysisResult, SajuChart, OhengBalance,
  ELEMENT_KOREAN, PeerComparison, AIAnalysis, Element
} from '@/types/saju';
import { generateZodiacAnalysis, type ZodiacAnalysis } from '@/lib/fortune/saju/analysis/zodiacAnalysis';
import { CardDeck, RootCard } from '@/types/cards';
import PremiumResultDisplay from './PremiumResultDisplay';
import DownloadButtons from './DownloadButtons';

// 탭 타입 정의 (새 구조: 또래 비교 제거, 새 탭 추가)
type TabType = 'destiny' | 'elements' | 'zodiac' | 'monthly' | 'timeline' | 'premium';

// 상품 레벨 타입
type ProductLevel = 'free' | 'basic' | 'deep' | 'premium' | 'vip';

// 상품별 해금 카드 (누적)
const PRODUCT_CARDS: Record<ProductLevel, string[]> = {
  free: ['root', 'essence'],                                         // 근본, 본질
  basic: ['root', 'essence', 'energy', 'talent'],                    // + 에너지, 재능
  deep: ['root', 'essence', 'energy', 'talent', 'flow', 'guardian'], // + 흐름, 수호
  premium: ['root', 'essence', 'energy', 'talent', 'flow', 'guardian'],
  vip: ['root', 'essence', 'energy', 'talent', 'flow', 'guardian'],
};

// 카드 타입별 한글명
const CARD_NAMES: Record<string, string> = {
  root: '근본',
  essence: '본질',
  energy: '에너지',
  talent: '재능',
  flow: '흐름',
  guardian: '수호',
};

interface Props {
  result: AnalysisResult;
  onUnlockPremium: () => void;
  isPremiumUnlocked?: boolean;
  productLevel?: ProductLevel;  // 구매한 상품 레벨
  analysisId?: string;
}

export default function SajuResultCard({
  result,
  onUnlockPremium,
  isPremiumUnlocked = false,
  productLevel = 'free',
  analysisId
}: Props) {
  const [activeTab, setActiveTab] = useState<TabType>('destiny');
  const [selectedCard, setSelectedCard] = useState<string | null>(null);

  const { saju, oheng, scores, personality, yongsin, gisin, coreMessage, aiAnalysis } = result;

  // 스토리텔링 데이터 (카드덱 포함)
  const storytelling = result.premium?.storytelling;
  const cardDeck = storytelling?.cardDeck;
  const sixtyJiazi = result.premium?.sixtyJiazi;
  const elementPoetry = result.premium?.elementPoetry;

  // 60갑자 기반 히어로 데이터
  const heroData = {
    jiazi: sixtyJiazi?.yearKorean || cardDeck?.root?.yearKorean || '갑자',
    animal: sixtyJiazi?.animalDescription || cardDeck?.root?.animalKorean || '청서(靑鼠)',
    nature: sixtyJiazi?.nature || cardDeck?.root?.nature || '새벽 숲의 첫 번째 빛',
    personality: sixtyJiazi?.personality || cardDeck?.root?.personality || coreMessage.insight,
    color: sixtyJiazi?.color || cardDeck?.root?.color || '#9333EA'
  };

  // 별자리 분석 (useMemo로 최적화)
  const zodiacAnalysis = useMemo(() => {
    // 오행에서 가장 강한 요소 찾기
    const elements: Element[] = ['wood', 'fire', 'earth', 'metal', 'water'];
    const dominantElement = elements.reduce((max, el) =>
      (oheng[el] || 0) > (oheng[max] || 0) ? el : max
    , 'wood' as Element);

    return generateZodiacAnalysis(result.user.birthDate, dominantElement, 2026);
  }, [result.user.birthDate, oheng]);

  // 6장 카드 배열 구성
  const sixCards = cardDeck ? [
    {
      type: 'root',
      typeKorean: '근본',
      icon: Crown,
      data: cardDeck.root,
      color: 'from-amber-500 to-orange-600',
      description: '60갑자가 말하는 당신의 뿌리'
    },
    {
      type: 'essence',
      typeKorean: '본질',
      icon: Flower2,
      data: cardDeck.essence,
      color: 'from-pink-500 to-rose-600',
      description: '일간이 그려낸 당신의 꽃'
    },
    {
      type: 'energy',
      typeKorean: '에너지',
      icon: Zap,
      data: cardDeck.energy,
      color: 'from-yellow-500 to-amber-600',
      description: '용신이 불어넣은 생명력'
    },
    {
      type: 'talent',
      typeKorean: '재능',
      icon: Trees,
      data: cardDeck.talent,
      color: 'from-green-500 to-emerald-600',
      description: '십신이 키워낸 재능의 나무'
    },
    {
      type: 'flow',
      typeKorean: '흐름',
      icon: Clock,
      data: cardDeck.flow,
      color: 'from-blue-500 to-cyan-600',
      description: '2026년 당신의 자연현상'
    },
    {
      type: 'guardian',
      typeKorean: '수호',
      icon: Gem,
      data: cardDeck.guardian,
      color: 'from-purple-500 to-violet-600',
      description: '당신을 지키는 보석'
    }
  ] : [];

  // 카드 잠금 여부 확인 (productLevel 기반)
  const isCardUnlocked = (cardType: string): boolean => {
    // isPremiumUnlocked가 true면 모든 카드 해금 (기존 호환성)
    if (isPremiumUnlocked) return true;
    return PRODUCT_CARDS[productLevel].includes(cardType);
  };

  // 다음 티어 정보 (업그레이드 유도용)
  const getNextTier = (): { level: ProductLevel; price: number; cardsToUnlock: string[] } | null => {
    if (productLevel === 'free') {
      return { level: 'basic', price: 500, cardsToUnlock: ['에너지', '재능'] };
    }
    if (productLevel === 'basic') {
      return { level: 'deep', price: 1000, cardsToUnlock: ['흐름', '수호'] };
    }
    if (productLevel === 'deep') {
      return { level: 'premium', price: 2000, cardsToUnlock: [] };
    }
    return null;
  };

  const nextTier = getNextTier();
  const unlockedCardCount = PRODUCT_CARDS[productLevel].length;

  return (
    <div className="max-w-2xl mx-auto">
      {/* ============================================ */}
      {/* 히어로 섹션 - 60갑자 + 6장 카드 기반 시적 표현 */}
      {/* ============================================ */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="relative overflow-hidden bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 text-white p-6 rounded-3xl mb-6"
      >
        {/* 배경 장식 */}
        <div className="absolute inset-0 opacity-20">
          <div className="absolute top-0 right-0 w-64 h-64 bg-gradient-to-br from-purple-500 to-pink-500 rounded-full blur-3xl" />
          <div className="absolute bottom-0 left-0 w-48 h-48 bg-gradient-to-br from-blue-500 to-cyan-500 rounded-full blur-3xl" />
        </div>

        <div className="relative z-10">
          {/* 60갑자 배지 */}
          <div className="flex items-center gap-2 mb-4">
            <span className="px-3 py-1 bg-amber-500/20 border border-amber-500/30 rounded-full text-amber-300 text-sm font-medium">
              {heroData.jiazi}년생
            </span>
            <span className="px-3 py-1 bg-purple-500/20 border border-purple-500/30 rounded-full text-purple-300 text-sm">
              {heroData.animal}
            </span>
          </div>

          {/* 시적 타이틀 */}
          <h1 className="text-2xl md:text-3xl font-bold mb-2">
            <span className="bg-gradient-to-r from-amber-200 via-purple-200 to-pink-200 bg-clip-text text-transparent">
              {heroData.nature}
            </span>
          </h1>

          {/* 서브 메시지 */}
          <p className="text-gray-300 text-sm mb-4 leading-relaxed">
            {coreMessage.hook}
          </p>

          {/* 6장 카드 미니 프리뷰 */}
          {cardDeck && (
            <div className="flex gap-2 mt-4 overflow-x-auto pb-2 -mx-2 px-2">
              {sixCards.slice(0, 6).map((card, idx) => (
                <motion.div
                  key={card.type}
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: idx * 0.1 }}
                  className={`flex-shrink-0 w-14 h-20 rounded-lg bg-gradient-to-br ${card.color}
                    flex flex-col items-center justify-center cursor-pointer hover:scale-105 transition-transform`}
                  onClick={() => {
                    setActiveTab('destiny');
                    setSelectedCard(card.type);
                  }}
                >
                  <card.icon className="w-5 h-5 text-white/90 mb-1" />
                  <span className="text-[10px] text-white/80">{card.typeKorean}</span>
                </motion.div>
              ))}
            </div>
          )}

          {/* 핵심 인사이트 (접힌 상태) */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3 }}
            className="mt-4 p-4 bg-white/5 backdrop-blur-sm rounded-xl border border-white/10"
          >
            <p className="text-sm text-gray-200 leading-relaxed">
              {heroData.personality}
            </p>
          </motion.div>
        </div>
      </motion.div>

      {/* ============================================ */}
      {/* 탭 네비게이션 (새 구조: 또래 비교 제거) */}
      {/* ============================================ */}
      <div className="flex gap-1.5 mb-6 overflow-x-auto pb-2 scrollbar-hide">
        {[
          { id: 'destiny' as TabType, label: '운명', icon: Layers },
          { id: 'elements' as TabType, label: '오행', icon: Sparkles },
          { id: 'zodiac' as TabType, label: '별자리', icon: Sun },
          { id: 'monthly' as TabType, label: '월운', icon: Calendar },
          { id: 'timeline' as TabType, label: '타임라인', icon: TrendingUp },
          { id: 'premium' as TabType, label: '프리미엄', icon: isPremiumUnlocked ? Star : Lock }
        ].map(tab => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`flex items-center gap-1.5 px-3 py-2 rounded-xl whitespace-nowrap transition-all text-sm
              ${activeTab === tab.id
                ? 'bg-gradient-to-r from-purple-600 to-pink-600 text-white shadow-lg shadow-purple-500/25'
                : 'bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400 hover:bg-gray-200 dark:hover:bg-gray-700'}`}
          >
            <tab.icon className="w-4 h-4" />
            {tab.label}
          </button>
        ))}
      </div>

      {/* ============================================ */}
      {/* 탭 콘텐츠 */}
      {/* ============================================ */}
      <div className="bg-white dark:bg-gray-900 rounded-2xl shadow-lg overflow-hidden">
        <AnimatePresence mode="wait">
          {/* ========== 나의 운명 탭 (6장 카드 시스템) ========== */}
          {activeTab === 'destiny' && (
            <motion.div
              key="destiny"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="p-6 space-y-6"
            >
              {/* 사주 원국 미니 */}
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-bold text-gray-800 dark:text-white flex items-center gap-2">
                  <Layers className="w-5 h-5 text-purple-500" />
                  나의 운명 카드
                </h3>
                <span className="text-xs text-gray-500 dark:text-gray-400">
                  {saju.day?.stemKorean}{saju.day?.branchKorean}일주
                </span>
              </div>

              {/* 해금 카드 상태 표시 */}
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs text-gray-500 dark:text-gray-400">
                  {unlockedCardCount}/6장 해금됨
                </span>
                {nextTier && (
                  <button
                    onClick={onUnlockPremium}
                    className="text-xs text-purple-600 dark:text-purple-400 hover:underline"
                  >
                    +{nextTier.cardsToUnlock.join(', ')} 해금하기 →
                  </button>
                )}
              </div>

              {/* 6장 카드 그리드 */}
              {cardDeck ? (
                <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                  {sixCards.map((card, idx) => (
                    <DestinyCardItem
                      key={card.type}
                      card={card}
                      index={idx}
                      isSelected={selectedCard === card.type}
                      onClick={() => setSelectedCard(selectedCard === card.type ? null : card.type)}
                      isPremium={!isCardUnlocked(card.type)}
                    />
                  ))}
                </div>
              ) : (
                /* 카드덱이 없을 때 기본 정보 표시 */
                <div className="space-y-4">
                  <div className="grid grid-cols-4 gap-3">
                    {[
                      { label: '년주', pillar: saju.year },
                      { label: '월주', pillar: saju.month },
                      { label: '일주', pillar: saju.day },
                      { label: '시주', pillar: saju.time }
                    ].map((item, idx) => (
                      <div
                        key={idx}
                        className="bg-gray-50 dark:bg-gray-800 rounded-xl p-3 text-center"
                      >
                        <p className="text-xs text-gray-500 mb-1">{item.label}</p>
                        {item.pillar ? (
                          <>
                            <p className="text-xl font-bold text-gray-800 dark:text-white">
                              {item.pillar.heavenlyStem}{item.pillar.earthlyBranch}
                            </p>
                            <div className={`mt-2 px-2 py-0.5 rounded-full text-xs inline-block
                              ${getElementColor(item.pillar.element)}`}>
                              {ELEMENT_KOREAN[item.pillar.element]}
                            </div>
                          </>
                        ) : (
                          <p className="text-xl text-gray-400">-</p>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* 선택된 카드 상세 */}
              <AnimatePresence>
                {selectedCard && cardDeck && (
                  <SelectedCardDetail
                    card={sixCards.find(c => c.type === selectedCard)}
                    cardDeck={cardDeck}
                    isUnlocked={selectedCard ? isCardUnlocked(selectedCard) : false}
                    onUnlockPremium={onUnlockPremium}
                    nextTier={nextTier}
                  />
                )}
              </AnimatePresence>

              {/* MBTI 통합 분석 */}
              {cardDeck?.mbtiInsight && (
                <div className="p-4 bg-gradient-to-br from-indigo-50 to-purple-50 dark:from-indigo-900/20 dark:to-purple-900/20 rounded-xl border border-indigo-100 dark:border-indigo-800">
                  <div className="flex items-center gap-2 mb-2">
                    <Brain className="w-4 h-4 text-indigo-600 dark:text-indigo-400" />
                    <span className="text-sm font-medium text-indigo-700 dark:text-indigo-400">
                      MBTI 통합 분석 ({cardDeck.mbtiInsight.mbti})
                    </span>
                  </div>
                  <p className="text-sm text-gray-600 dark:text-gray-400 leading-relaxed">
                    {cardDeck.mbtiInsight.personalizedAdvice}
                  </p>
                </div>
              )}

              {/* 성격 핵심 키워드 */}
              <div className="p-4 bg-gray-50 dark:bg-gray-800 rounded-xl">
                <h4 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">
                  {personality.coreKeyword}
                </h4>
                <div className="flex flex-wrap gap-2">
                  {personality.sajuTraits.slice(0, 3).map((trait, idx) => (
                    <span
                      key={idx}
                      className="px-3 py-1 bg-purple-100 dark:bg-purple-900/30 text-purple-700 dark:text-purple-300 rounded-full text-sm"
                    >
                      {trait}
                    </span>
                  ))}
                </div>
              </div>

              {/* 프리미엄 유도 (잠겨있을 때) */}
              {!isPremiumUnlocked && (
                <FOMOSection
                  title="6장 운명 카드의 비밀"
                  description="4장의 숨겨진 카드가 당신만의 특별한 기회를 알려드립니다"
                  features={['재능 카드: 당신이 빛나는 분야', '흐름 카드: 2026년 최적의 타이밍', '수호 카드: 당신을 지키는 힘']}
                  onUnlock={onUnlockPremium}
                />
              )}
            </motion.div>
          )}

          {/* ========== 오행 분석 탭 (상생/상극 시각화) ========== */}
          {activeTab === 'elements' && (
            <motion.div
              key="elements"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="p-6 space-y-6"
            >
              <h3 className="text-lg font-bold text-gray-800 dark:text-white flex items-center gap-2">
                <Sparkles className="w-5 h-5 text-amber-500" />
                오행 에너지 분석
              </h3>

              {/* 오행 오각형 시각화 */}
              <OhengPentagonChart balance={oheng} yongsin={yongsin} gisin={gisin} />

              {/* 오행 분포 바 차트 */}
              <div className="p-4 bg-gray-50 dark:bg-gray-800 rounded-xl">
                <h4 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-4">
                  오행 분포
                </h4>
                <OhengChart balance={oheng} />
              </div>

              {/* 용신/기신 */}
              <div className="grid grid-cols-2 gap-4">
                <div className="p-4 bg-gradient-to-br from-emerald-50 to-green-50 dark:from-emerald-900/20 dark:to-green-900/20 rounded-xl border border-green-200 dark:border-green-800">
                  <h4 className="text-sm font-medium text-green-700 dark:text-green-400 mb-3 flex items-center gap-2">
                    <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
                    용신 (用神)
                  </h4>
                  <p className="text-xs text-gray-500 dark:text-gray-400 mb-2">나에게 좋은 기운</p>
                  <div className="flex flex-wrap gap-2">
                    {yongsin.map(el => (
                      <span key={el} className="px-3 py-1.5 bg-green-100 dark:bg-green-800 rounded-lg text-sm font-medium text-green-800 dark:text-green-200">
                        {ELEMENT_KOREAN[el]}
                      </span>
                    ))}
                  </div>
                </div>
                <div className="p-4 bg-gradient-to-br from-red-50 to-rose-50 dark:from-red-900/20 dark:to-rose-900/20 rounded-xl border border-red-200 dark:border-red-800">
                  <h4 className="text-sm font-medium text-red-700 dark:text-red-400 mb-3 flex items-center gap-2">
                    <span className="w-2 h-2 bg-red-500 rounded-full" />
                    기신 (忌神)
                  </h4>
                  <p className="text-xs text-gray-500 dark:text-gray-400 mb-2">주의할 기운</p>
                  <div className="flex flex-wrap gap-2">
                    {gisin.map(el => (
                      <span key={el} className="px-3 py-1.5 bg-red-100 dark:bg-red-800 rounded-lg text-sm font-medium text-red-800 dark:text-red-200">
                        {ELEMENT_KOREAN[el]}
                      </span>
                    ))}
                  </div>
                </div>
              </div>

              {/* 오행 시적 표현 */}
              {(elementPoetry || cardDeck?.elementPoetry) && (
                <div className="p-5 bg-gradient-to-br from-purple-50 to-pink-50 dark:from-purple-900/20 dark:to-pink-900/20 rounded-xl border border-purple-200 dark:border-purple-800">
                  <h4 className="text-sm font-medium text-purple-700 dark:text-purple-400 mb-3 flex items-center gap-2">
                    <Star className="w-4 h-4" />
                    오행의 시적 해석
                  </h4>
                  <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
                    {cardDeck?.elementPoetry?.poeticPhrase || elementPoetry?.balancePoetry}
                  </p>
                  {(cardDeck?.elementPoetry?.balanceAdvice || elementPoetry?.overallHarmony) && (
                    <p className="mt-3 text-sm text-purple-600 dark:text-purple-400">
                      {cardDeck?.elementPoetry?.balanceAdvice || elementPoetry?.overallHarmony}
                    </p>
                  )}
                </div>
              )}

              {/* 상생/상극 관계 (프리미엄) */}
              {isPremiumUnlocked && elementPoetry ? (
                <div className="space-y-4">
                  {/* 상생 관계 */}
                  <div className="p-4 bg-blue-50 dark:bg-blue-900/20 rounded-xl">
                    <h4 className="text-sm font-medium text-blue-700 dark:text-blue-400 mb-3">
                      🌊 상생 관계 (서로 살리는 힘)
                    </h4>
                    <div className="space-y-2">
                      {elementPoetry.generatingRelations?.slice(0, 2).map((rel, idx) => (
                        <div key={idx} className="p-3 bg-white/60 dark:bg-gray-800/60 rounded-lg">
                          <p className="font-medium text-gray-800 dark:text-white text-sm">{rel.relationName}</p>
                          <p className="text-xs text-gray-600 dark:text-gray-400 mt-1">{rel.poeticExpression}</p>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* 상극 관계 */}
                  <div className="p-4 bg-orange-50 dark:bg-orange-900/20 rounded-xl">
                    <h4 className="text-sm font-medium text-orange-700 dark:text-orange-400 mb-3">
                      ⚔️ 상극 관계 (균형을 잡는 힘)
                    </h4>
                    <div className="space-y-2">
                      {elementPoetry.controllingRelations?.slice(0, 2).map((rel, idx) => (
                        <div key={idx} className="p-3 bg-white/60 dark:bg-gray-800/60 rounded-lg">
                          <p className="font-medium text-gray-800 dark:text-white text-sm">{rel.relationName}</p>
                          <p className="text-xs text-gray-600 dark:text-gray-400 mt-1">{rel.poeticExpression}</p>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              ) : !isPremiumUnlocked && (
                <FOMOSection
                  title="오행의 숨겨진 관계"
                  description="상생과 상극의 에너지 흐름을 이해하면 인생의 파도를 탈 수 있습니다"
                  features={['상생 관계: 당신을 성장시키는 에너지', '상극 관계: 균형을 잡아주는 힘', '맞춤 균형 조언']}
                  onUnlock={onUnlockPremium}
                />
              )}
            </motion.div>
          )}

          {/* ========== 별자리 분석 탭 ========== */}
          {activeTab === 'zodiac' && (
            <motion.div
              key="zodiac"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="p-6 space-y-6"
            >
              <h3 className="text-lg font-bold text-gray-800 dark:text-white flex items-center gap-2">
                <Sun className="w-5 h-5 text-yellow-500" />
                별자리 × 사주 통합 분석
              </h3>

              {/* 별자리 카드 */}
              <div className="p-5 bg-gradient-to-br from-indigo-900 via-purple-900 to-pink-900 rounded-2xl text-white relative overflow-hidden">
                {/* 배경 별 장식 */}
                <div className="absolute inset-0 opacity-30">
                  <div className="absolute top-4 right-4 w-2 h-2 bg-white rounded-full animate-pulse" />
                  <div className="absolute top-12 right-12 w-1 h-1 bg-white rounded-full animate-pulse" style={{ animationDelay: '0.5s' }} />
                  <div className="absolute top-8 left-8 w-1.5 h-1.5 bg-white rounded-full animate-pulse" style={{ animationDelay: '1s' }} />
                  <div className="absolute bottom-8 right-20 w-1 h-1 bg-white rounded-full animate-pulse" style={{ animationDelay: '1.5s' }} />
                </div>

                <div className="relative z-10">
                  <div className="flex items-center gap-3 mb-4">
                    <span className="text-4xl">{zodiacAnalysis.sign.symbol}</span>
                    <div>
                      <h4 className="text-xl font-bold">{zodiacAnalysis.sign.name}</h4>
                      <p className="text-sm text-purple-200">{zodiacAnalysis.sign.english} • {zodiacAnalysis.sign.dateRange}</p>
                    </div>
                  </div>

                  <p className="text-sm text-gray-200 leading-relaxed mb-4">
                    {zodiacAnalysis.sign.personality}
                  </p>

                  {/* 별자리 키워드 */}
                  <div className="flex flex-wrap gap-2">
                    {zodiacAnalysis.sign.keywords.map((keyword, idx) => (
                      <span key={idx} className="px-2 py-1 bg-white/20 rounded-full text-xs">
                        #{keyword}
                      </span>
                    ))}
                  </div>
                </div>
              </div>

              {/* 별자리 × 사주 조화 */}
              <div className="p-4 bg-gradient-to-br from-amber-50 to-orange-50 dark:from-amber-900/20 dark:to-orange-900/20 rounded-xl border border-amber-200 dark:border-amber-800">
                <div className="flex items-center justify-between mb-3">
                  <h4 className="text-sm font-medium text-amber-700 dark:text-amber-400 flex items-center gap-2">
                    <Star className="w-4 h-4" />
                    사주와의 조화
                  </h4>
                  <span className="px-3 py-1 bg-amber-500 text-white rounded-full text-sm font-bold">
                    {zodiacAnalysis.harmony.score}점
                  </span>
                </div>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  {zodiacAnalysis.harmony.description}
                </p>
              </div>

              {/* 통합 인사이트 */}
              <div className="p-4 bg-gray-50 dark:bg-gray-800 rounded-xl">
                <h4 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-3 flex items-center gap-2">
                  <Lightbulb className="w-4 h-4 text-yellow-500" />
                  통합 인사이트
                </h4>
                <p className="text-sm text-gray-600 dark:text-gray-400 leading-relaxed">
                  {zodiacAnalysis.integratedInsight}
                </p>
              </div>

              {/* 2026년 별자리 운세 */}
              <div className="p-4 bg-gradient-to-br from-purple-50 to-pink-50 dark:from-purple-900/20 dark:to-pink-900/20 rounded-xl border border-purple-200 dark:border-purple-800">
                <h4 className="text-sm font-medium text-purple-700 dark:text-purple-400 mb-2">
                  2026년 별자리 운세
                </h4>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  {zodiacAnalysis.yearForecast}
                </p>
              </div>

              {/* 강점 & 주의점 */}
              <div className="grid grid-cols-2 gap-4">
                <div className="p-4 bg-green-50 dark:bg-green-900/20 rounded-xl border border-green-200 dark:border-green-800">
                  <h4 className="text-sm font-medium text-green-700 dark:text-green-400 mb-2">
                    강점
                  </h4>
                  <ul className="text-xs text-gray-600 dark:text-gray-400 space-y-1">
                    {zodiacAnalysis.sign.strengths.map((s, idx) => (
                      <li key={idx}>• {s}</li>
                    ))}
                  </ul>
                </div>
                <div className="p-4 bg-red-50 dark:bg-red-900/20 rounded-xl border border-red-200 dark:border-red-800">
                  <h4 className="text-sm font-medium text-red-700 dark:text-red-400 mb-2">
                    주의할 점
                  </h4>
                  <ul className="text-xs text-gray-600 dark:text-gray-400 space-y-1">
                    {zodiacAnalysis.sign.weaknesses.map((w, idx) => (
                      <li key={idx}>• {w}</li>
                    ))}
                  </ul>
                </div>
              </div>

              {/* 행운 요소 */}
              <div className="p-4 bg-gray-50 dark:bg-gray-800 rounded-xl">
                <h4 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">
                  행운의 요소
                </h4>
                <div className="grid grid-cols-3 gap-3 text-center">
                  <div>
                    <p className="text-xs text-gray-500 mb-1">행운의 색</p>
                    <p className="font-medium text-gray-800 dark:text-white">{zodiacAnalysis.sign.luckyColor}</p>
                  </div>
                  <div>
                    <p className="text-xs text-gray-500 mb-1">행운의 숫자</p>
                    <p className="font-medium text-gray-800 dark:text-white">{zodiacAnalysis.sign.luckyNumber.join(', ')}</p>
                  </div>
                  <div>
                    <p className="text-xs text-gray-500 mb-1">수호성</p>
                    <p className="font-medium text-gray-800 dark:text-white">{zodiacAnalysis.sign.ruler}</p>
                  </div>
                </div>
              </div>

              {/* 궁합 좋은 별자리 */}
              <div className="p-4 bg-pink-50 dark:bg-pink-900/20 rounded-xl border border-pink-200 dark:border-pink-800">
                <h4 className="text-sm font-medium text-pink-700 dark:text-pink-400 mb-2 flex items-center gap-2">
                  <Heart className="w-4 h-4" />
                  궁합 좋은 별자리
                </h4>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  {zodiacAnalysis.sign.compatibility.join(', ')}
                </p>
              </div>
            </motion.div>
          )}

          {/* ========== 월별 운세 탭 (무료 3개월 + 시적 표현) ========== */}
          {activeTab === 'monthly' && (
            <motion.div
              key="monthly"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="p-6 space-y-6"
            >
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-bold text-gray-800 dark:text-white flex items-center gap-2">
                  <Calendar className="w-5 h-5 text-blue-500" />
                  2026년 월별 운세
                </h3>
                <span className={`px-2 py-1 text-xs rounded-full ${
                  productLevel === 'free'
                    ? 'bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400'
                    : productLevel === 'basic'
                    ? 'bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-400'
                    : 'bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400'
                }`}>
                  {productLevel === 'free' ? '1개월 힌트' : productLevel === 'basic' ? '3개월' : '12개월 전체'}
                </span>
              </div>

              {/* 종합 점수 서클 */}
              <div className="flex items-center justify-center py-4">
                <div className="relative">
                  <div className="w-28 h-28 rounded-full bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center shadow-lg shadow-purple-500/30">
                    <span className="text-3xl font-bold text-white">{scores.overall}</span>
                  </div>
                  <span className="absolute -bottom-2 left-1/2 -translate-x-1/2 bg-white dark:bg-gray-800 px-3 py-1 rounded-full text-xs font-medium text-gray-600 dark:text-gray-400 shadow">
                    종합운세
                  </span>
                </div>
              </div>

              {/* 4대 운세 점수 */}
              <div className="grid grid-cols-2 gap-3">
                {[
                  { id: 'wealth', label: '재물운', score: scores.wealth, icon: DollarSign, color: 'amber' },
                  { id: 'love', label: '애정운', score: scores.love, icon: Heart, color: 'pink' },
                  { id: 'career', label: '직업운', score: scores.career, icon: Briefcase, color: 'blue' },
                  { id: 'health', label: '건강운', score: scores.health, icon: Activity, color: 'green' }
                ].map(item => (
                  <MiniScoreCard key={item.id} label={item.label} score={item.score} icon={item.icon} color={item.color} />
                ))}
              </div>

              {/* 월별 운세 카드 (티어별 해금) */}
              <div className="space-y-3">
                <h4 className="text-sm font-medium text-gray-700 dark:text-gray-300">
                  월별 흐름
                </h4>
                {getMonthlyFortune(result).map((month, idx) => {
                  // 티어별 해금 개월수: free=1, basic=3, deep+=12
                  const unlockedMonths = productLevel === 'free' ? 1 : productLevel === 'basic' ? 3 : 12;
                  const isLocked = idx >= unlockedMonths && !isPremiumUnlocked;

                  return (
                    <MonthlyFortuneCard
                      key={month.month}
                      month={month}
                      isLocked={isLocked}
                      delay={idx * 0.1}
                    />
                  );
                })}
              </div>

              {/* 월별 흐름 시적 해석 */}
              {cardDeck?.flow && (
                <div className="p-4 bg-gradient-to-br from-blue-50 to-cyan-50 dark:from-blue-900/20 dark:to-cyan-900/20 rounded-xl border border-blue-200 dark:border-blue-800">
                  <h4 className="text-sm font-medium text-blue-700 dark:text-blue-400 mb-2 flex items-center gap-2">
                    <Clock className="w-4 h-4" />
                    {cardDeck.flow.phenomenonKorean}의 해
                  </h4>
                  <p className="text-sm text-gray-600 dark:text-gray-400 leading-relaxed">
                    {cardDeck.flow.story}
                  </p>
                </div>
              )}

              {/* 업그레이드 유도 */}
              {productLevel !== 'deep' && productLevel !== 'premium' && productLevel !== 'vip' && !isPremiumUnlocked && (
                <FOMOSection
                  title={productLevel === 'free' ? "2개월 이후의 운세가 궁금하다면" : "4월 이후의 운세가 궁금하다면"}
                  description={productLevel === 'free'
                    ? "베이직 분석으로 3개월 운세를, 심층 분석으로 12개월 전체를 확인하세요"
                    : "심층 분석으로 12개월 전체 운세와 최적의 행동 타이밍을 확인하세요"}
                  features={productLevel === 'free'
                    ? ['3개월 상세 운세', '에너지/재능 카드 해금']
                    : ['12개월 전체 운세', '흐름/수호 카드 해금', 'AI 맞춤 분석']}
                  onUnlock={onUnlockPremium}
                  price={productLevel === 'free' ? 500 : 1000}
                />
              )}
            </motion.div>
          )}

          {/* ========== 인생 타임라인 탭 ========== */}
          {activeTab === 'timeline' && (
            <motion.div
              key="timeline"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="p-6 space-y-6"
            >
              <h3 className="text-lg font-bold text-gray-800 dark:text-white flex items-center gap-2">
                <TrendingUp className="w-5 h-5 text-purple-500" />
                인생 타임라인
              </h3>

              {/* 현재 시기 표시 */}
              <div className="p-4 bg-gradient-to-r from-purple-500 to-pink-500 rounded-xl text-white">
                <p className="text-sm opacity-80 mb-1">현재 당신의 시기</p>
                <p className="text-lg font-bold">
                  {result.premium?.lifeTimeline?.phases?.[0]?.phase || '성장기'}
                </p>
                <p className="text-sm mt-2 opacity-90">
                  {aiAnalysis?.lifePath || '지금은 내면의 힘을 키우는 시기입니다.'}
                </p>
              </div>

              {/* 대운 흐름 프리뷰 */}
              <div className="space-y-3">
                <h4 className="text-sm font-medium text-gray-700 dark:text-gray-300">
                  대운 흐름 미리보기
                </h4>
                {/* 무료: 현재 대운만 표시 */}
                <div className="p-4 bg-blue-50 dark:bg-blue-900/20 rounded-xl border border-blue-200 dark:border-blue-800">
                  <div className="flex items-center gap-3 mb-2">
                    <div className="w-10 h-10 bg-blue-500 rounded-full flex items-center justify-center text-white font-bold">
                      NOW
                    </div>
                    <div>
                      <p className="font-medium text-gray-800 dark:text-white">현재 대운</p>
                      <p className="text-xs text-gray-500 dark:text-gray-400">
                        {aiAnalysis?.tenYearFortune?.slice(0, 50)}...
                      </p>
                    </div>
                  </div>
                </div>

                {/* 잠긴 타임라인 */}
                {[
                  { label: '다음 대운', years: '향후 10년' },
                  { label: '인생 전환점', years: '중요 시기' },
                  { label: '골든윈도우', years: '최적의 기회' }
                ].map((item, idx) => (
                  <div
                    key={idx}
                    className={`p-4 rounded-xl border relative overflow-hidden
                      ${isPremiumUnlocked
                        ? 'bg-gray-50 dark:bg-gray-800 border-gray-200 dark:border-gray-700'
                        : 'bg-gray-100 dark:bg-gray-800/50 border-gray-200 dark:border-gray-700'}`}
                  >
                    {!isPremiumUnlocked && (
                      <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/80 to-white dark:via-gray-900/80 dark:to-gray-900 flex items-center justify-end pr-4">
                        <Lock className="w-4 h-4 text-gray-400" />
                      </div>
                    )}
                    <div className="flex items-center gap-3">
                      <div className={`w-10 h-10 rounded-full flex items-center justify-center text-sm font-bold
                        ${idx === 0 ? 'bg-amber-100 text-amber-700' :
                          idx === 1 ? 'bg-purple-100 text-purple-700' :
                          'bg-green-100 text-green-700'}`}
                      >
                        {idx + 1}
                      </div>
                      <div>
                        <p className="font-medium text-gray-800 dark:text-white">{item.label}</p>
                        <p className="text-xs text-gray-500 dark:text-gray-400">{item.years}</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              {/* 프리미엄 유도 */}
              {!isPremiumUnlocked && (
                <FOMOSection
                  title="당신의 인생 지도"
                  description="대운의 흐름, 전환점, 골든윈도우까지 한눈에 파악하세요"
                  features={['10년 주기 대운 분석', '인생 전환점 예측', '최적의 결정 타이밍']}
                  onUnlock={onUnlockPremium}
                />
              )}
            </motion.div>
          )}

          {/* ========== 프리미엄 탭 (개선된 FOMO) ========== */}
          {activeTab === 'premium' && (
            <motion.div
              key="premium"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="p-6"
            >
              {isPremiumUnlocked && result.premium ? (
                <div className="space-y-6">
                  <PremiumResultDisplay
                    premium={result.premium}
                    userName={result.user.name}
                  />

                  {/* 다운로드 버튼 */}
                  <div className="border-t pt-6">
                    <div className="flex items-center gap-2 mb-4">
                      <Download className="w-5 h-5 text-gray-600 dark:text-gray-400" />
                      <h4 className="font-medium text-gray-700 dark:text-gray-300">
                        분석 결과 다운로드
                      </h4>
                    </div>
                    <DownloadButtons
                      user={result.user}
                      saju={saju}
                      oheng={oheng}
                      result={result}
                      premium={result.premium}
                      analysisId={analysisId}
                      isPremium={true}
                      onUpgradeClick={onUnlockPremium}
                    />
                  </div>
                </div>
              ) : (
                <div className="space-y-6">
                  {/* 기회 기반 헤드라인 */}
                  <div className="text-center">
                    <div className="inline-flex items-center justify-center w-16 h-16 mb-4 bg-gradient-to-br from-amber-400 to-orange-500 rounded-2xl shadow-lg shadow-amber-500/30">
                      <Crown className="w-8 h-8 text-white" />
                    </div>
                    <h3 className="text-xl font-bold text-gray-800 dark:text-white mb-2">
                      당신만의 특별한 기회
                    </h3>
                    <p className="text-gray-600 dark:text-gray-400 text-sm">
                      2026년, 당신에게 열린 가능성을 발견하세요
                    </p>
                  </div>

                  {/* 기회 카드 (FOMO - 기회 기반) */}
                  <div className="grid grid-cols-1 gap-3">
                    {[
                      {
                        icon: Star,
                        title: '6장 운명 카드 전체',
                        description: '숨겨진 4장의 카드가 당신의 재능과 기회를 알려드립니다',
                        color: 'from-amber-500 to-orange-500'
                      },
                      {
                        icon: Calendar,
                        title: '12개월 상세 운세',
                        description: '매달의 최적 타이밍과 행운의 요소를 확인하세요',
                        color: 'from-blue-500 to-cyan-500'
                      },
                      {
                        icon: TrendingUp,
                        title: '인생 타임라인',
                        description: '대운의 흐름과 인생 전환점을 미리 파악하세요',
                        color: 'from-purple-500 to-pink-500'
                      },
                      {
                        icon: Sparkles,
                        title: '오행 관계 심층 분석',
                        description: '상생과 상극의 에너지를 활용하는 방법',
                        color: 'from-green-500 to-emerald-500'
                      }
                    ].map((item, idx) => (
                      <motion.div
                        key={idx}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: idx * 0.1 }}
                        className="flex items-start gap-3 p-4 bg-gray-50 dark:bg-gray-800 rounded-xl"
                      >
                        <div className={`w-10 h-10 rounded-lg bg-gradient-to-br ${item.color} flex items-center justify-center shrink-0`}>
                          <item.icon className="w-5 h-5 text-white" />
                        </div>
                        <div>
                          <p className="font-medium text-gray-800 dark:text-white text-sm">{item.title}</p>
                          <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">{item.description}</p>
                        </div>
                      </motion.div>
                    ))}
                  </div>

                  {/* CTA 버튼 */}
                  <div className="pt-4">
                    <Button
                      onClick={onUnlockPremium}
                      className="w-full bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 py-6 text-lg font-medium shadow-lg shadow-purple-500/30"
                    >
                      나의 기회 확인하기
                      <ArrowRight className="w-5 h-5 ml-2" />
                    </Button>
                    <p className="text-center text-xs text-gray-500 dark:text-gray-400 mt-3">
                      지금 확인하면 PDF 리포트를 무료로 제공해 드립니다
                    </p>
                  </div>
                </div>
              )}
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* ============================================ */}
      {/* 하단 CTA (기회 기반 FOMO) */}
      {/* ============================================ */}
      {!isPremiumUnlocked && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="mt-6 p-6 bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 rounded-2xl text-white relative overflow-hidden"
        >
          {/* 배경 장식 */}
          <div className="absolute inset-0 opacity-20">
            <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-amber-500 to-orange-500 rounded-full blur-3xl" />
            <div className="absolute bottom-0 left-0 w-24 h-24 bg-gradient-to-br from-purple-500 to-pink-500 rounded-full blur-3xl" />
          </div>

          <div className="relative z-10">
            <div className="flex items-center gap-2 justify-center mb-2">
              <Sparkles className="w-4 h-4 text-amber-400" />
              <span className="text-sm text-amber-300 font-medium">특별한 기회</span>
            </div>
            <p className="text-center text-lg font-medium mb-2">
              {sixtyJiazi?.nature || heroData.nature}
            </p>
            <p className="text-center text-sm opacity-80 mb-4">
              2026년, 당신만의 골든타임을 놓치지 마세요
            </p>
            <Button
              onClick={onUnlockPremium}
              className="w-full bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600 text-white py-5"
            >
              {coreMessage.cta || '나의 기회 확인하기'}
              <ArrowRight className="w-4 h-4 ml-2" />
            </Button>
          </div>
        </motion.div>
      )}
    </div>
  );
}

// 오행 차트 컴포넌트
function OhengChart({ balance }: { balance: OhengBalance }) {
  const elements = [
    { key: 'wood', label: '목(木)', color: 'bg-green-500' },
    { key: 'fire', label: '화(火)', color: 'bg-red-500' },
    { key: 'earth', label: '토(土)', color: 'bg-yellow-500' },
    { key: 'metal', label: '금(金)', color: 'bg-gray-400' },
    { key: 'water', label: '수(水)', color: 'bg-blue-500' }
  ] as const;

  const maxValue = Math.max(...Object.values(balance));

  return (
    <div className="space-y-3">
      {elements.map(el => (
        <div key={el.key} className="flex items-center gap-3">
          <span className="w-16 text-sm text-gray-600 dark:text-gray-400">{el.label}</span>
          <div className="flex-1 h-6 bg-gray-100 dark:bg-gray-800 rounded-full overflow-hidden">
            <motion.div
              initial={{ width: 0 }}
              animate={{ width: `${(balance[el.key] / maxValue) * 100}%` }}
              transition={{ duration: 0.5, delay: 0.2 }}
              className={`h-full ${el.color} rounded-full`}
            />
          </div>
          <span className="w-8 text-sm text-gray-600 dark:text-gray-400">
            {balance[el.key].toFixed(1)}
          </span>
        </div>
      ))}
    </div>
  );
}

// 점수 바 컴포넌트
function ScoreBar({ label, score, icon: Icon, color }: {
  label: string;
  score: number;
  icon: React.ElementType;
  color: string;
}) {
  const colorClasses: Record<string, string> = {
    yellow: 'text-yellow-600 bg-yellow-100',
    pink: 'text-pink-600 bg-pink-100',
    blue: 'text-blue-600 bg-blue-100',
    green: 'text-green-600 bg-green-100'
  };

  return (
    <div className="flex items-center gap-4">
      <div className={`w-10 h-10 rounded-full flex items-center justify-center ${colorClasses[color]}`}>
        <Icon className="w-5 h-5" />
      </div>
      <div className="flex-1">
        <div className="flex justify-between mb-1">
          <span className="text-sm text-gray-600 dark:text-gray-400">{label}</span>
          <span className="text-sm font-bold text-gray-800 dark:text-white">{score}점</span>
        </div>
        <Progress value={score} className="h-2" />
      </div>
    </div>
  );
}

// 또래 비교 차트
function PeerComparisonChart({ comparison }: { comparison: PeerComparison }) {
  const items = [
    { label: '커리어 성숙도', value: comparison.careerMaturity, inverted: true },
    { label: '결정 안정성', value: comparison.decisionStability, inverted: true },
    { label: '재물 관리', value: comparison.wealthManagement, inverted: true }
  ];

  return (
    <div className="space-y-4">
      {items.map(item => (
        <div key={item.label}>
          <div className="flex justify-between mb-1">
            <span className="text-sm text-gray-600 dark:text-gray-400">{item.label}</span>
            <span className="text-sm font-medium text-purple-600">
              상위 {item.value}%
            </span>
          </div>
          <div className="h-3 bg-gray-100 dark:bg-gray-800 rounded-full overflow-hidden">
            <motion.div
              initial={{ width: 0 }}
              animate={{ width: `${100 - item.value}%` }}
              transition={{ duration: 0.5 }}
              className="h-full bg-gradient-to-r from-purple-500 to-pink-500 rounded-full"
            />
          </div>
        </div>
      ))}

      <div className="flex items-center gap-2 mt-4">
        <span className="text-sm text-gray-500">위험 노출도:</span>
        <span className={`px-3 py-1 rounded-full text-sm font-medium
          ${comparison.riskExposure === 'low' ? 'bg-green-100 text-green-700' :
            comparison.riskExposure === 'high' ? 'bg-red-100 text-red-700' :
            'bg-yellow-100 text-yellow-700'}`}
        >
          {comparison.riskExposure === 'low' ? '낮음' :
           comparison.riskExposure === 'high' ? '높음' : '보통'}
        </span>
      </div>
    </div>
  );
}

// 오행 색상 헬퍼
function getElementColor(element: string): string {
  const colors: Record<string, string> = {
    wood: 'bg-green-100 text-green-700 dark:bg-green-900/50 dark:text-green-400',
    fire: 'bg-red-100 text-red-700 dark:bg-red-900/50 dark:text-red-400',
    earth: 'bg-yellow-100 text-yellow-700 dark:bg-yellow-900/50 dark:text-yellow-400',
    metal: 'bg-gray-100 text-gray-700 dark:bg-gray-700 dark:text-gray-300',
    water: 'bg-blue-100 text-blue-700 dark:bg-blue-900/50 dark:text-blue-400'
  };
  return colors[element] || colors.earth;
}

// 전문가 분석 섹션 컴포넌트
function ExpertSection({
  icon: Icon,
  title,
  subtitle,
  content,
  colorClass,
  iconColor
}: {
  icon: React.ElementType;
  title: string;
  subtitle?: string;
  content: string;
  colorClass: string;
  iconColor: string;
}) {
  return (
    <div className={`p-5 rounded-xl border ${colorClass}`}>
      <div className="flex items-start gap-3 mb-3">
        <div className={`w-10 h-10 rounded-full flex items-center justify-center ${colorClass}`}>
          <Icon className={`w-5 h-5 ${iconColor}`} />
        </div>
        <div>
          <h4 className="font-bold text-gray-800 dark:text-white">{title}</h4>
          {subtitle && (
            <p className="text-xs text-gray-500 dark:text-gray-400">{subtitle}</p>
          )}
        </div>
      </div>
      <p className="text-sm text-gray-700 dark:text-gray-300 leading-relaxed whitespace-pre-line">
        {content}
      </p>
    </div>
  );
}

// ============================================
// 새로운 컴포넌트들
// ============================================

// 6장 운명 카드 아이템
function DestinyCardItem({
  card,
  index,
  isSelected,
  onClick,
  isPremium
}: {
  card: {
    type: string;
    typeKorean: string;
    icon: React.ElementType;
    data: unknown;
    color: string;
    description: string;
  };
  index: number;
  isSelected: boolean;
  onClick: () => void;
  isPremium: boolean;
}) {
  const Icon = card.icon;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.1 }}
      onClick={!isPremium ? onClick : undefined}
      className={`relative p-4 rounded-xl cursor-pointer transition-all
        ${isSelected
          ? 'ring-2 ring-purple-500 shadow-lg'
          : 'hover:shadow-md'}
        ${isPremium
          ? 'bg-gray-100 dark:bg-gray-800/50'
          : `bg-gradient-to-br ${card.color} text-white`}`}
    >
      {isPremium && (
        <div className="absolute inset-0 bg-gradient-to-br from-gray-200/80 to-gray-300/80 dark:from-gray-700/80 dark:to-gray-800/80 rounded-xl flex items-center justify-center backdrop-blur-sm">
          <Lock className="w-5 h-5 text-gray-500 dark:text-gray-400" />
        </div>
      )}

      <div className="flex flex-col items-center text-center">
        <div className={`w-12 h-12 rounded-full flex items-center justify-center mb-2
          ${isPremium ? 'bg-gray-200 dark:bg-gray-700' : 'bg-white/20'}`}>
          <Icon className={`w-6 h-6 ${isPremium ? 'text-gray-400' : 'text-white'}`} />
        </div>
        <p className={`font-bold text-sm ${isPremium ? 'text-gray-500 dark:text-gray-400' : ''}`}>
          {card.typeKorean}
        </p>
        <p className={`text-xs mt-1 ${isPremium ? 'text-gray-400' : 'text-white/80'}`}>
          {card.description.slice(0, 12)}...
        </p>
      </div>
    </motion.div>
  );
}

// 선택된 카드 상세 정보
function SelectedCardDetail({
  card,
  cardDeck,
  isUnlocked,
  onUnlockPremium,
  nextTier
}: {
  card?: {
    type: string;
    typeKorean: string;
    icon: React.ElementType;
    color: string;
    description: string;
  };
  cardDeck: CardDeck;
  isUnlocked: boolean;
  onUnlockPremium: () => void;
  nextTier: { level: string; price: number; cardsToUnlock: string[] } | null;
}) {
  if (!card) return null;

  const getCardData = () => {
    switch (card.type) {
      case 'root':
        return cardDeck.root;
      case 'essence':
        return cardDeck.essence;
      case 'energy':
        return cardDeck.energy;
      case 'talent':
        return cardDeck.talent;
      case 'flow':
        return cardDeck.flow;
      case 'guardian':
        return cardDeck.guardian;
      default:
        return null;
    }
  };

  const data = getCardData();
  if (!data) return null;

  const Icon = card.icon;

  // 잠긴 카드 표시
  if (!isUnlocked) {
    return (
      <motion.div
        initial={{ opacity: 0, height: 0 }}
        animate={{ opacity: 1, height: 'auto' }}
        exit={{ opacity: 0, height: 0 }}
        className="p-5 rounded-xl bg-gradient-to-br from-gray-700 to-gray-800 text-white overflow-hidden"
      >
        <div className="flex items-start gap-4">
          <div className="w-14 h-14 bg-white/10 rounded-xl flex items-center justify-center shrink-0">
            <Lock className="w-7 h-7 text-gray-400" />
          </div>
          <div className="flex-1">
            <h4 className="font-bold text-lg text-gray-300">{card.typeKorean} 카드 🔒</h4>
            <p className="text-sm text-gray-400 mt-1">{card.description}</p>

            {/* 해금 유도 */}
            {nextTier && (
              <div className="mt-4 p-3 bg-purple-600/30 rounded-lg">
                <p className="text-sm text-purple-200 mb-2">
                  이 카드를 해금하려면 <strong>{nextTier.level}</strong> 분석이 필요합니다
                </p>
                <button
                  onClick={onUnlockPremium}
                  className="w-full py-2 bg-purple-600 hover:bg-purple-700 rounded-lg text-sm font-medium transition"
                >
                  {nextTier.price}P로 업그레이드
                </button>
              </div>
            )}
          </div>
        </div>
      </motion.div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, height: 0 }}
      animate={{ opacity: 1, height: 'auto' }}
      exit={{ opacity: 0, height: 0 }}
      className={`p-5 rounded-xl bg-gradient-to-br ${card.color} text-white overflow-hidden`}
    >
      <div className="flex items-start gap-4">
        <div className="w-14 h-14 bg-white/20 rounded-xl flex items-center justify-center shrink-0">
          <Icon className="w-7 h-7" />
        </div>
        <div className="flex-1">
          <h4 className="font-bold text-lg">{card.typeKorean} 카드</h4>
          <p className="text-sm text-white/80 mt-1">{card.description}</p>

          {/* 카드 키워드 */}
          {'keywords' in data && data.keywords && (
            <div className="flex flex-wrap gap-2 mt-3">
              {(data.keywords as string[]).map((kw, idx) => (
                <span key={idx} className="px-2 py-1 bg-white/20 rounded-full text-xs">
                  {kw}
                </span>
              ))}
            </div>
          )}

          {/* 카드 스토리 */}
          {'story' in data && data.story && (
            <p className="mt-3 text-sm text-white/90 leading-relaxed">
              {(data.story as string).slice(0, 100)}...
            </p>
          )}
        </div>
      </div>
    </motion.div>
  );
}

// FOMO 섹션 (기회 기반)
function FOMOSection({
  title,
  description,
  features,
  onUnlock,
  price
}: {
  title: string;
  description: string;
  features: string[];
  onUnlock: () => void;
  price?: number;
}) {
  return (
    <div className="p-5 bg-gradient-to-br from-purple-50 to-pink-50 dark:from-purple-900/20 dark:to-pink-900/20 rounded-xl border border-purple-200 dark:border-purple-800">
      <div className="flex items-start gap-3 mb-4">
        <div className="w-10 h-10 bg-gradient-to-br from-purple-500 to-pink-500 rounded-lg flex items-center justify-center shrink-0">
          <Sparkles className="w-5 h-5 text-white" />
        </div>
        <div>
          <h4 className="font-bold text-gray-800 dark:text-white">{title}</h4>
          <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">{description}</p>
        </div>
      </div>

      <div className="space-y-2 mb-4">
        {features.map((feature, idx) => (
          <div key={idx} className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400">
            <CheckCircle2 className="w-4 h-4 text-purple-500 shrink-0" />
            {feature}
          </div>
        ))}
      </div>

      <Button
        onClick={onUnlock}
        className="w-full bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700"
      >
        {price ? `${price}P로 업그레이드` : '지금 확인하기'}
        <ArrowRight className="w-4 h-4 ml-2" />
      </Button>
    </div>
  );
}

// 오행 오각형 차트
function OhengPentagonChart({
  balance,
  yongsin,
  gisin
}: {
  balance: OhengBalance;
  yongsin: Element[];
  gisin: Element[];
}) {
  const elements = [
    { key: 'wood' as const, label: '목', angle: -90, color: '#22c55e' },
    { key: 'fire' as const, label: '화', angle: -18, color: '#ef4444' },
    { key: 'earth' as const, label: '토', angle: 54, color: '#eab308' },
    { key: 'metal' as const, label: '금', angle: 126, color: '#9ca3af' },
    { key: 'water' as const, label: '수', angle: 198, color: '#3b82f6' }
  ];

  const maxValue = Math.max(...Object.values(balance), 5);
  const center = 100;
  const maxRadius = 55;

  const getPoint = (angle: number, value: number) => {
    const rad = (angle * Math.PI) / 180;
    const radius = (value / maxValue) * maxRadius;
    return {
      x: center + radius * Math.cos(rad),
      y: center + radius * Math.sin(rad)
    };
  };

  const pathPoints = elements.map(el => getPoint(el.angle, balance[el.key]));
  const pathD = pathPoints.map((p, i) => `${i === 0 ? 'M' : 'L'} ${p.x} ${p.y}`).join(' ') + ' Z';

  return (
    <div className="flex justify-center items-center py-4">
      <svg width="200" height="200" viewBox="0 0 200 200">
        {/* 배경 오각형 가이드 */}
        {[0.2, 0.4, 0.6, 0.8, 1].map((scale, idx) => (
          <polygon
            key={idx}
            points={elements.map(el => {
              const p = getPoint(el.angle, maxValue * scale);
              return `${p.x},${p.y}`;
            }).join(' ')}
            fill="none"
            stroke="currentColor"
            strokeWidth="0.5"
            className="text-gray-200 dark:text-gray-700"
          />
        ))}

        {/* 축 라인 */}
        {elements.map(el => {
          const p = getPoint(el.angle, maxValue);
          return (
            <line
              key={el.key}
              x1={center}
              y1={center}
              x2={p.x}
              y2={p.y}
              stroke="currentColor"
              strokeWidth="0.5"
              className="text-gray-200 dark:text-gray-700"
            />
          );
        })}

        {/* 데이터 영역 */}
        <motion.path
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          d={pathD}
          fill="url(#pentagonGradient)"
          fillOpacity="0.3"
          stroke="url(#pentagonGradient)"
          strokeWidth="2"
        />

        {/* 그라데이션 정의 */}
        <defs>
          <linearGradient id="pentagonGradient" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#9333EA" />
            <stop offset="100%" stopColor="#EC4899" />
          </linearGradient>
        </defs>

        {/* 라벨 */}
        {elements.map(el => {
          const labelRadius = maxRadius + 25;
          const rad = (el.angle * Math.PI) / 180;
          const x = center + labelRadius * Math.cos(rad);
          const y = center + labelRadius * Math.sin(rad);
          const isYongsin = yongsin.includes(el.key);
          const isGisin = gisin.includes(el.key);

          return (
            <g key={el.key}>
              <circle
                cx={x}
                cy={y}
                r="14"
                fill={isYongsin ? '#22c55e' : isGisin ? '#ef4444' : el.color}
                fillOpacity={isYongsin || isGisin ? 1 : 0.2}
              />
              <text
                x={x}
                y={y}
                textAnchor="middle"
                dominantBaseline="central"
                className={`text-xs font-bold ${isYongsin || isGisin ? 'fill-white' : 'fill-gray-600 dark:fill-gray-400'}`}
              >
                {el.label}
              </text>
            </g>
          );
        })}
      </svg>
    </div>
  );
}

// 미니 점수 카드
function MiniScoreCard({
  label,
  score,
  icon: Icon,
  color
}: {
  label: string;
  score: number;
  icon: React.ElementType;
  color: string;
}) {
  const colorStyles: Record<string, string> = {
    amber: 'from-amber-400 to-orange-500 text-amber-900',
    pink: 'from-pink-400 to-rose-500 text-pink-900',
    blue: 'from-blue-400 to-indigo-500 text-blue-900',
    green: 'from-green-400 to-emerald-500 text-green-900'
  };

  return (
    <div className={`p-3 rounded-xl bg-gradient-to-br ${colorStyles[color]} relative overflow-hidden`}>
      <div className="absolute top-0 right-0 w-16 h-16 bg-white/10 rounded-full -translate-y-1/2 translate-x-1/2" />
      <div className="relative z-10 flex items-center gap-2">
        <Icon className="w-4 h-4 opacity-80" />
        <span className="text-xs font-medium opacity-80">{label}</span>
      </div>
      <p className="relative z-10 text-2xl font-bold mt-1">{score}<span className="text-sm font-normal">점</span></p>
    </div>
  );
}

// 월별 운세 카드
function MonthlyFortuneCard({
  month,
  isLocked,
  delay
}: {
  month: {
    month: number;
    monthName: string;
    score: number;
    keyword: string;
    advice: string;
  };
  isLocked: boolean;
  delay: number;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ delay }}
      className={`p-4 rounded-xl border relative overflow-hidden
        ${isLocked
          ? 'bg-gray-50 dark:bg-gray-800/50 border-gray-200 dark:border-gray-700'
          : 'bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700'}`}
    >
      {isLocked && (
        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/60 to-white dark:via-gray-900/60 dark:to-gray-900 flex items-center justify-end pr-4">
          <Lock className="w-4 h-4 text-gray-400" />
        </div>
      )}

      <div className="flex items-center gap-4">
        <div className={`w-12 h-12 rounded-xl flex items-center justify-center font-bold
          ${getMonthColor(month.score)}`}>
          {month.month}월
        </div>
        <div className="flex-1">
          <div className="flex items-center gap-2 mb-1">
            <span className="font-medium text-gray-800 dark:text-white">{month.keyword}</span>
            <span className="text-xs text-gray-500">{month.score}점</span>
          </div>
          <p className="text-xs text-gray-500 dark:text-gray-400 line-clamp-1">
            {month.advice}
          </p>
        </div>
      </div>
    </motion.div>
  );
}

// 월별 색상 헬퍼
function getMonthColor(score: number): string {
  if (score >= 80) return 'bg-gradient-to-br from-amber-400 to-orange-500 text-white';
  if (score >= 60) return 'bg-gradient-to-br from-green-400 to-emerald-500 text-white';
  if (score >= 40) return 'bg-gradient-to-br from-blue-400 to-cyan-500 text-white';
  return 'bg-gradient-to-br from-gray-300 to-gray-400 text-gray-700';
}

// 월별 운세 데이터 생성
function getMonthlyFortune(result: AnalysisResult) {
  const monthlyPlan = result.premium?.monthlyActionPlan;

  if (monthlyPlan && monthlyPlan.length > 0) {
    return monthlyPlan.slice(0, 6).map(m => ({
      month: m.month,
      monthName: m.monthName,
      score: m.score,
      keyword: m.mustDo?.[0]?.category || '성장',
      advice: m.mustDo?.[0]?.action || '이 달의 운세를 확인하세요'
    }));
  }

  // 기본 데이터
  const baseScore = result.scores.overall;
  return [
    { month: 1, monthName: '1월', score: Math.min(100, baseScore + 5), keyword: '새로운 시작', advice: '올해의 계획을 세우기 좋은 시기입니다' },
    { month: 2, monthName: '2월', score: Math.min(100, baseScore + 10), keyword: '준비와 성장', advice: '기반을 다지는 시기입니다' },
    { month: 3, monthName: '3월', score: Math.min(100, baseScore + 15), keyword: '도약의 기회', advice: '적극적으로 움직이세요' },
    { month: 4, monthName: '4월', score: Math.min(100, baseScore), keyword: '안정과 조정', advice: '프리미엄에서 확인하세요' },
    { month: 5, monthName: '5월', score: Math.min(100, baseScore - 5), keyword: '성장의 시기', advice: '프리미엄에서 확인하세요' },
    { month: 6, monthName: '6월', score: Math.min(100, baseScore + 8), keyword: '수확의 시작', advice: '프리미엄에서 확인하세요' }
  ];
}
