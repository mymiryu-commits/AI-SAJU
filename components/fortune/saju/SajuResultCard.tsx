'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import {
  TrendingUp, Heart, Briefcase, Activity, Sparkles,
  Lock, ChevronRight, Users, Calendar, Target, Star,
  Compass, DollarSign, Shield, Lightbulb, CheckCircle2, Brain
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import {
  AnalysisResult, SajuChart, OhengBalance,
  ELEMENT_KOREAN, PeerComparison, AIAnalysis
} from '@/types/saju';
import PremiumResultDisplay from './PremiumResultDisplay';

interface Props {
  result: AnalysisResult;
  onUnlockPremium: () => void;
  isPremiumUnlocked?: boolean;
}

export default function SajuResultCard({
  result,
  onUnlockPremium,
  isPremiumUnlocked = false
}: Props) {
  const [activeTab, setActiveTab] = useState<'basic' | 'expert' | 'scores' | 'peer' | 'premium'>('basic');

  const { saju, oheng, scores, personality, peerComparison, yongsin, gisin, coreMessage, aiAnalysis } = result;

  return (
    <div className="max-w-2xl mx-auto">
      {/* 핵심 메시지 (고민 기반) */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-gradient-to-br from-purple-600 to-pink-600 text-white p-6 rounded-2xl mb-6"
      >
        <p className="text-sm opacity-80 mb-2">당신의 사주가 말합니다</p>
        <p className="text-lg font-medium whitespace-pre-line">{coreMessage.hook}</p>
        <div className="mt-4 p-4 bg-white/10 rounded-xl">
          <p className="text-sm whitespace-pre-line">{coreMessage.insight}</p>
        </div>
      </motion.div>

      {/* 탭 네비게이션 */}
      <div className="flex gap-2 mb-6 overflow-x-auto pb-2">
        {[
          { id: 'basic', label: '기본 정보', icon: Sparkles },
          { id: 'expert', label: '전문가 분석', icon: Brain },
          { id: 'scores', label: '운세 점수', icon: TrendingUp },
          { id: 'peer', label: '또래 비교', icon: Users },
          { id: 'premium', label: '프리미엄', icon: Lock }
        ].map(tab => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id as typeof activeTab)}
            className={`flex items-center gap-2 px-4 py-2 rounded-full whitespace-nowrap transition-all
              ${activeTab === tab.id
                ? 'bg-purple-600 text-white'
                : 'bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400 hover:bg-gray-200'}`}
          >
            <tab.icon className="w-4 h-4" />
            {tab.label}
          </button>
        ))}
      </div>

      {/* 탭 콘텐츠 */}
      <div className="bg-white dark:bg-gray-900 rounded-2xl shadow-lg overflow-hidden">
        {/* 기본 정보 탭 */}
        {activeTab === 'basic' && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="p-6 space-y-6"
          >
            {/* 사주 원국 */}
            <div>
              <h3 className="text-lg font-bold text-gray-800 dark:text-white mb-4">
                사주 원국 (四柱)
              </h3>
              <div className="grid grid-cols-4 gap-3">
                {[
                  { label: '년주', pillar: saju.year, sub: '年柱' },
                  { label: '월주', pillar: saju.month, sub: '月柱' },
                  { label: '일주', pillar: saju.day, sub: '日柱' },
                  { label: '시주', pillar: saju.time, sub: '時柱' }
                ].map((item, idx) => (
                  <div
                    key={idx}
                    className="bg-gray-50 dark:bg-gray-800 rounded-xl p-4 text-center"
                  >
                    <p className="text-xs text-gray-500 mb-1">{item.label}</p>
                    {item.pillar ? (
                      <>
                        <p className="text-2xl font-bold text-gray-800 dark:text-white">
                          {item.pillar.heavenlyStem}{item.pillar.earthlyBranch}
                        </p>
                        <p className="text-xs text-gray-500 mt-1">
                          {item.pillar.stemKorean}{item.pillar.branchKorean}
                        </p>
                        <div className={`mt-2 px-2 py-1 rounded-full text-xs inline-block
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

            {/* 오행 분포 */}
            <div>
              <h3 className="text-lg font-bold text-gray-800 dark:text-white mb-4">
                오행 분포
              </h3>
              <OhengChart balance={oheng} />
            </div>

            {/* 용신/기신 */}
            <div className="grid grid-cols-2 gap-4">
              <div className="bg-green-50 dark:bg-green-900/30 p-4 rounded-xl">
                <h4 className="text-sm font-medium text-green-700 dark:text-green-400 mb-2">
                  용신 (用神) - 나에게 좋은 기운
                </h4>
                <div className="flex gap-2">
                  {yongsin.map(el => (
                    <span key={el} className="px-3 py-1 bg-green-100 dark:bg-green-800 rounded-full text-sm text-green-800 dark:text-green-200">
                      {ELEMENT_KOREAN[el]}
                    </span>
                  ))}
                </div>
              </div>
              <div className="bg-red-50 dark:bg-red-900/30 p-4 rounded-xl">
                <h4 className="text-sm font-medium text-red-700 dark:text-red-400 mb-2">
                  기신 (忌神) - 주의할 기운
                </h4>
                <div className="flex gap-2">
                  {gisin.map(el => (
                    <span key={el} className="px-3 py-1 bg-red-100 dark:bg-red-800 rounded-full text-sm text-red-800 dark:text-red-200">
                      {ELEMENT_KOREAN[el]}
                    </span>
                  ))}
                </div>
              </div>
            </div>

            {/* 성격 분석 */}
            <div>
              <h3 className="text-lg font-bold text-gray-800 dark:text-white mb-4">
                성격 분석 - "{personality.coreKeyword}"
              </h3>

              {/* AI 성격 분석 (있을 경우) */}
              {aiAnalysis?.personalityReading && (
                <div className="mb-4 p-4 bg-gradient-to-br from-purple-50 to-pink-50 dark:from-purple-900/20 dark:to-pink-900/20 rounded-xl border border-purple-100 dark:border-purple-800">
                  <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
                    {aiAnalysis.personalityReading}
                  </p>
                </div>
              )}

              <div className="space-y-2">
                {personality.sajuTraits.map((trait, idx) => (
                  <div key={idx} className="flex items-center gap-2 text-gray-600 dark:text-gray-400">
                    <div className="w-2 h-2 bg-purple-500 rounded-full" />
                    {trait}
                  </div>
                ))}
              </div>

              {personality.mbtiTraits && (
                <div className="mt-4 p-4 bg-purple-50 dark:bg-purple-900/30 rounded-xl">
                  <p className="text-sm font-medium text-purple-700 dark:text-purple-400 mb-2">
                    MBTI 교차 분석 (일치도: {personality.crossAnalysis.matchRate}%)
                  </p>
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    {personality.crossAnalysis.synergy}
                  </p>
                </div>
              )}
            </div>

            {/* AI 인생 경로 & 행운 요소 */}
            {aiAnalysis && (
              <>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {/* 인생 경로 */}
                  <div className="p-4 bg-blue-50 dark:bg-blue-900/30 rounded-xl">
                    <h4 className="text-sm font-medium text-blue-700 dark:text-blue-400 mb-2 flex items-center gap-2">
                      <Calendar className="w-4 h-4" />
                      인생 흐름
                    </h4>
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                      {aiAnalysis.lifePath}
                    </p>
                  </div>

                  {/* 행운 요소 */}
                  <div className="p-4 bg-amber-50 dark:bg-amber-900/30 rounded-xl">
                    <h4 className="text-sm font-medium text-amber-700 dark:text-amber-400 mb-2 flex items-center gap-2">
                      <Sparkles className="w-4 h-4" />
                      행운 요소
                    </h4>
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                      {aiAnalysis.luckyElements}
                    </p>
                  </div>
                </div>

                {/* 주의사항 */}
                {aiAnalysis.warningAdvice && (
                  <div className="p-4 bg-red-50 dark:bg-red-900/30 rounded-xl border border-red-100 dark:border-red-800">
                    <h4 className="text-sm font-medium text-red-700 dark:text-red-400 mb-2">
                      주의사항
                    </h4>
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                      {aiAnalysis.warningAdvice}
                    </p>
                  </div>
                )}
              </>
            )}
          </motion.div>
        )}

        {/* 전문가 분석 탭 */}
        {activeTab === 'expert' && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="p-6 space-y-6"
          >
            <h3 className="text-lg font-bold text-gray-800 dark:text-white flex items-center gap-2">
              <Star className="w-5 h-5 text-amber-500" />
              전문가 심층 분석
            </h3>

            {aiAnalysis ? (
              <div className="space-y-6">
                {/* 일주 분석 */}
                {aiAnalysis.dayMasterAnalysis && (
                  <ExpertSection
                    icon={Compass}
                    title="일주(日柱) 분석"
                    content={aiAnalysis.dayMasterAnalysis}
                    colorClass="bg-purple-50 dark:bg-purple-900/30 border-purple-200 dark:border-purple-800"
                    iconColor="text-purple-600 dark:text-purple-400"
                  />
                )}

                {/* 대운 분석 */}
                {aiAnalysis.tenYearFortune && (
                  <ExpertSection
                    icon={Calendar}
                    title="대운(大運) 분석"
                    subtitle="10년 주기 운세"
                    content={aiAnalysis.tenYearFortune}
                    colorClass="bg-blue-50 dark:bg-blue-900/30 border-blue-200 dark:border-blue-800"
                    iconColor="text-blue-600 dark:text-blue-400"
                  />
                )}

                {/* 2026년 세운 */}
                {aiAnalysis.yearlyFortune && (
                  <ExpertSection
                    icon={Star}
                    title="2026년 세운(歲運)"
                    subtitle="병오년 운세"
                    content={aiAnalysis.yearlyFortune}
                    colorClass="bg-amber-50 dark:bg-amber-900/30 border-amber-200 dark:border-amber-800"
                    iconColor="text-amber-600 dark:text-amber-400"
                  />
                )}

                {/* 월운 */}
                {aiAnalysis.monthlyFortune && (
                  <ExpertSection
                    icon={Calendar}
                    title="월운(月運) 분석"
                    subtitle="상반기 주요 시기"
                    content={aiAnalysis.monthlyFortune}
                    colorClass="bg-teal-50 dark:bg-teal-900/30 border-teal-200 dark:border-teal-800"
                    iconColor="text-teal-600 dark:text-teal-400"
                  />
                )}

                {/* 인연/관계 분석 */}
                {aiAnalysis.relationshipAnalysis && (
                  <ExpertSection
                    icon={Heart}
                    title="인연 & 관계 분석"
                    content={aiAnalysis.relationshipAnalysis}
                    colorClass="bg-pink-50 dark:bg-pink-900/30 border-pink-200 dark:border-pink-800"
                    iconColor="text-pink-600 dark:text-pink-400"
                  />
                )}

                {/* 직업 가이드 */}
                {aiAnalysis.careerGuidance && (
                  <ExpertSection
                    icon={Briefcase}
                    title="직업 & 사업 가이드"
                    content={aiAnalysis.careerGuidance}
                    colorClass="bg-indigo-50 dark:bg-indigo-900/30 border-indigo-200 dark:border-indigo-800"
                    iconColor="text-indigo-600 dark:text-indigo-400"
                  />
                )}

                {/* 재물 전략 */}
                {aiAnalysis.wealthStrategy && (
                  <ExpertSection
                    icon={DollarSign}
                    title="재물 전략"
                    content={aiAnalysis.wealthStrategy}
                    colorClass="bg-yellow-50 dark:bg-yellow-900/30 border-yellow-200 dark:border-yellow-800"
                    iconColor="text-yellow-600 dark:text-yellow-400"
                  />
                )}

                {/* 건강 조언 */}
                {aiAnalysis.healthAdvice && (
                  <ExpertSection
                    icon={Shield}
                    title="건강 조언"
                    content={aiAnalysis.healthAdvice}
                    colorClass="bg-green-50 dark:bg-green-900/30 border-green-200 dark:border-green-800"
                    iconColor="text-green-600 dark:text-green-400"
                  />
                )}

                {/* 영적 가이드 */}
                {aiAnalysis.spiritualGuidance && (
                  <ExpertSection
                    icon={Lightbulb}
                    title="정신 & 영적 가이드"
                    content={aiAnalysis.spiritualGuidance}
                    colorClass="bg-violet-50 dark:bg-violet-900/30 border-violet-200 dark:border-violet-800"
                    iconColor="text-violet-600 dark:text-violet-400"
                  />
                )}

                {/* 액션플랜 */}
                {aiAnalysis.actionPlan && aiAnalysis.actionPlan.length > 0 && (
                  <div className="p-5 bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-800 dark:to-gray-900 rounded-xl border border-gray-200 dark:border-gray-700">
                    <h4 className="font-bold text-gray-800 dark:text-white mb-4 flex items-center gap-2">
                      <CheckCircle2 className="w-5 h-5 text-emerald-600" />
                      실천 액션플랜
                    </h4>
                    <div className="space-y-3">
                      {aiAnalysis.actionPlan.map((action, idx) => (
                        <div
                          key={idx}
                          className="flex items-start gap-3 p-3 bg-white dark:bg-gray-800 rounded-lg shadow-sm"
                        >
                          <div className={`w-7 h-7 rounded-full flex items-center justify-center text-sm font-bold shrink-0
                            ${idx === 0 ? 'bg-emerald-500 text-white' :
                              idx === 1 ? 'bg-blue-500 text-white' :
                              idx === 2 ? 'bg-purple-500 text-white' :
                              idx === 3 ? 'bg-amber-500 text-white' :
                              'bg-red-500 text-white'}`}
                          >
                            {idx + 1}
                          </div>
                          <p className="text-sm text-gray-700 dark:text-gray-300 leading-relaxed pt-1">
                            {action}
                          </p>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            ) : (
              <div className="text-center py-12">
                <div className="w-16 h-16 mx-auto mb-4 bg-gray-100 dark:bg-gray-800 rounded-full flex items-center justify-center">
                  <Brain className="w-8 h-8 text-gray-400" />
                </div>
                <p className="text-gray-500 dark:text-gray-400">
                  AI 전문가 분석을 불러오는 중...
                </p>
              </div>
            )}
          </motion.div>
        )}

        {/* 운세 점수 탭 */}
        {activeTab === 'scores' && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="p-6 space-y-6"
          >
            <h3 className="text-lg font-bold text-gray-800 dark:text-white">
              2026년 운세 점수
            </h3>

            {/* 종합 점수 */}
            <div className="text-center py-6">
              <div className="inline-flex items-center justify-center w-32 h-32 rounded-full bg-gradient-to-br from-purple-500 to-pink-500">
                <span className="text-4xl font-bold text-white">{scores.overall}</span>
              </div>
              <p className="mt-4 text-gray-600 dark:text-gray-400">종합 운세</p>
              {aiAnalysis?.fortuneAdvice?.overall && (
                <p className="mt-3 text-sm text-gray-600 dark:text-gray-400 max-w-md mx-auto">
                  {aiAnalysis.fortuneAdvice.overall}
                </p>
              )}
            </div>

            {/* 상세 점수 */}
            <div className="space-y-6">
              {[
                { key: 'wealth', label: '재물운', score: scores.wealth, icon: TrendingUp, color: 'yellow', advice: aiAnalysis?.fortuneAdvice?.wealth },
                { key: 'love', label: '애정운', score: scores.love, icon: Heart, color: 'pink', advice: aiAnalysis?.fortuneAdvice?.love },
                { key: 'career', label: '직업운', score: scores.career, icon: Briefcase, color: 'blue', advice: aiAnalysis?.fortuneAdvice?.career },
                { key: 'health', label: '건강운', score: scores.health, icon: Activity, color: 'green', advice: aiAnalysis?.fortuneAdvice?.health }
              ].map(item => (
                <div key={item.key} className="space-y-2">
                  <ScoreBar label={item.label} score={item.score} icon={item.icon} color={item.color} />
                  {item.advice && (
                    <p className="text-xs text-gray-500 dark:text-gray-400 pl-14 leading-relaxed">
                      {item.advice}
                    </p>
                  )}
                </div>
              ))}
            </div>
          </motion.div>
        )}

        {/* 또래 비교 탭 */}
        {activeTab === 'peer' && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="p-6 space-y-6"
          >
            <h3 className="text-lg font-bold text-gray-800 dark:text-white">
              동년배 비교 분석
            </h3>

            <PeerComparisonChart comparison={peerComparison} />

            <div className="p-4 bg-gray-50 dark:bg-gray-800 rounded-xl">
              <p className="text-sm text-gray-600 dark:text-gray-400">
                {peerComparison.summary}
              </p>
            </div>

            {/* 프리미엄 유도 */}
            <div className="border-2 border-dashed border-purple-300 dark:border-purple-700 rounded-xl p-4">
              <div className="flex items-center gap-3 mb-3">
                <Lock className="w-5 h-5 text-purple-500" />
                <span className="font-medium text-gray-700 dark:text-gray-300">
                  상위 15%가 하고 있는 것이 궁금하시다면?
                </span>
              </div>
              <Button
                onClick={onUnlockPremium}
                variant="outline"
                className="w-full border-purple-500 text-purple-600"
              >
                프리미엄 분석 보기
                <ChevronRight className="w-4 h-4 ml-1" />
              </Button>
            </div>
          </motion.div>
        )}

        {/* 프리미엄 탭 */}
        {activeTab === 'premium' && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="p-6"
          >
            {isPremiumUnlocked && result.premium ? (
              <PremiumResultDisplay
                premium={result.premium}
                userName={result.user.name}
              />
            ) : (
              <div className="text-center py-12">
                <div className="w-20 h-20 mx-auto mb-4 bg-purple-100 dark:bg-purple-900/30 rounded-full flex items-center justify-center">
                  <Lock className="w-10 h-10 text-purple-500" />
                </div>
                <h3 className="text-xl font-bold text-gray-800 dark:text-white mb-2">
                  프리미엄 분석
                </h3>
                <p className="text-gray-600 dark:text-gray-400 mb-6">
                  더 상세한 분석과 맞춤 전략을 확인하세요
                </p>

                <div className="space-y-3 text-left max-w-sm mx-auto mb-6">
                  {[
                    '월별 상세 액션플랜',
                    '인생 타임라인 분석',
                    '가족 영향 분석',
                    '직업 매칭 분석',
                    '골든윈도우 타이밍'
                  ].map((feature, idx) => (
                    <div key={idx} className="flex items-center gap-2 text-gray-600 dark:text-gray-400">
                      <div className="w-5 h-5 bg-purple-100 dark:bg-purple-900/30 rounded-full flex items-center justify-center">
                        <Target className="w-3 h-3 text-purple-600" />
                      </div>
                      {feature}
                    </div>
                  ))}
                </div>

                <Button
                  onClick={onUnlockPremium}
                  className="bg-gradient-to-r from-purple-600 to-pink-600"
                >
                  프리미엄 분석 받기
                </Button>
              </div>
            )}
          </motion.div>
        )}
      </div>

      {/* CTA */}
      {!isPremiumUnlocked && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="mt-6 p-6 bg-gradient-to-r from-purple-600 to-pink-600 rounded-2xl text-white text-center"
        >
          <p className="text-sm opacity-80 mb-2">{coreMessage.urgency}</p>
          <Button
            onClick={onUnlockPremium}
            variant="secondary"
            className="mt-4 bg-white text-purple-600 hover:bg-gray-100"
          >
            {coreMessage.cta}
          </Button>
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
