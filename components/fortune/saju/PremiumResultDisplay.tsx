'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Calendar, Briefcase, Users, Clock, Target, TrendingUp,
  ChevronDown, ChevronUp, Star, AlertTriangle, CheckCircle,
  Heart, MapPin, Palette, Hash
} from 'lucide-react';
import { Progress } from '@/components/ui/progress';
import {
  PremiumContent, MonthlyAction, LifeTimeline, FamilyImpact,
  CareerAnalysis, TimingAnalysis, InterestStrategy, ELEMENT_KOREAN
} from '@/types/saju';

interface Props {
  premium: PremiumContent;
  userName: string;
}

export default function PremiumResultDisplay({ premium, userName }: Props) {
  const [activeSection, setActiveSection] = useState<string | null>('monthly');

  const sections = [
    { id: 'monthly', label: '월별 액션플랜', icon: Calendar, content: premium.monthlyActionPlan },
    { id: 'timeline', label: '인생 타임라인', icon: TrendingUp, content: premium.lifeTimeline },
    { id: 'career', label: '직업 분석', icon: Briefcase, content: premium.careerAnalysis },
    { id: 'family', label: '가족 영향 분석', icon: Users, content: premium.familyImpact },
    { id: 'timing', label: '타이밍 분석', icon: Clock, content: premium.timingAnalysis },
    { id: 'interests', label: '관심사 전략', icon: Target, content: premium.interestStrategies }
  ].filter(s => s.content);

  return (
    <div className="space-y-4">
      <div className="text-center mb-6">
        <div className="inline-flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-purple-500 to-pink-500 text-white rounded-full text-sm font-medium">
          <Star className="w-4 h-4" />
          프리미엄 분석 결과
        </div>
        <h2 className="mt-4 text-2xl font-bold text-gray-800 dark:text-white">
          {userName}님의 맞춤 분석
        </h2>
      </div>

      {/* 섹션 아코디언 */}
      <div className="space-y-3">
        {sections.map(section => (
          <div
            key={section.id}
            className="bg-white dark:bg-gray-900 rounded-xl shadow-lg overflow-hidden"
          >
            <button
              onClick={() => setActiveSection(
                activeSection === section.id ? null : section.id
              )}
              className="w-full p-4 flex items-center justify-between hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors"
            >
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-purple-100 dark:bg-purple-900/50 flex items-center justify-center">
                  <section.icon className="w-5 h-5 text-purple-600 dark:text-purple-400" />
                </div>
                <span className="font-medium text-gray-800 dark:text-white">
                  {section.label}
                </span>
              </div>
              {activeSection === section.id ? (
                <ChevronUp className="w-5 h-5 text-gray-400" />
              ) : (
                <ChevronDown className="w-5 h-5 text-gray-400" />
              )}
            </button>

            <AnimatePresence>
              {activeSection === section.id && (
                <motion.div
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: 'auto', opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  transition={{ duration: 0.3 }}
                  className="border-t dark:border-gray-800"
                >
                  <div className="p-4">
                    {section.id === 'monthly' && premium.monthlyActionPlan && (
                      <MonthlyActionPlanView actions={premium.monthlyActionPlan} />
                    )}
                    {section.id === 'timeline' && premium.lifeTimeline && (
                      <LifeTimelineView timeline={premium.lifeTimeline} />
                    )}
                    {section.id === 'career' && premium.careerAnalysis && (
                      <CareerAnalysisView analysis={premium.careerAnalysis} />
                    )}
                    {section.id === 'family' && premium.familyImpact && (
                      <FamilyImpactView impact={premium.familyImpact} />
                    )}
                    {section.id === 'timing' && premium.timingAnalysis && (
                      <TimingAnalysisView timing={premium.timingAnalysis} />
                    )}
                    {section.id === 'interests' && premium.interestStrategies && (
                      <InterestStrategiesView strategies={premium.interestStrategies} />
                    )}
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        ))}
      </div>
    </div>
  );
}

// 월별 액션플랜 뷰
function MonthlyActionPlanView({ actions }: { actions: MonthlyAction[] }) {
  const [selectedMonth, setSelectedMonth] = useState(new Date().getMonth() + 1);

  const currentAction = actions.find(a => a.month === selectedMonth) || actions[0];

  return (
    <div className="space-y-4">
      {/* 월 선택 */}
      <div className="flex gap-2 overflow-x-auto pb-2">
        {actions.map(action => (
          <button
            key={action.month}
            onClick={() => setSelectedMonth(action.month)}
            className={`px-4 py-2 rounded-full whitespace-nowrap transition-all
              ${selectedMonth === action.month
                ? 'bg-purple-600 text-white'
                : 'bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400 hover:bg-gray-200'}`}
          >
            {action.monthName}
            <span className={`ml-1 text-xs ${selectedMonth === action.month ? 'text-white/80' : ''}`}>
              {action.score}점
            </span>
          </button>
        ))}
      </div>

      {currentAction && (
        <motion.div
          key={currentAction.month}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="space-y-4"
        >
          {/* 점수 */}
          <div className="flex items-center gap-3">
            <div className={`text-2xl font-bold
              ${currentAction.score >= 80 ? 'text-green-500' :
                currentAction.score >= 60 ? 'text-yellow-500' : 'text-red-500'}`}>
              {currentAction.score}점
            </div>
            <Progress value={currentAction.score} className="flex-1 h-3" />
          </div>

          {/* 해야 할 일 */}
          <div>
            <h4 className="flex items-center gap-2 font-medium text-gray-800 dark:text-white mb-3">
              <CheckCircle className="w-4 h-4 text-green-500" />
              이 달에 해야 할 일
            </h4>
            <div className="space-y-3">
              {currentAction.mustDo.map((todo, idx) => (
                <div
                  key={idx}
                  className="p-3 bg-green-50 dark:bg-green-900/30 rounded-lg"
                >
                  <div className="flex items-center gap-2 mb-1">
                    <span className="px-2 py-0.5 bg-green-100 dark:bg-green-800 text-green-700 dark:text-green-300 text-xs rounded-full">
                      {todo.category}
                    </span>
                  </div>
                  <p className="text-sm text-gray-700 dark:text-gray-300">
                    {todo.action}
                  </p>
                  <div className="flex gap-4 mt-2 text-xs text-gray-500">
                    <span>최적일: {todo.optimalDays.join(', ')}일</span>
                    <span>최적시간: {todo.optimalTime}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* 피해야 할 일 */}
          <div>
            <h4 className="flex items-center gap-2 font-medium text-gray-800 dark:text-white mb-3">
              <AlertTriangle className="w-4 h-4 text-red-500" />
              이 달에 피해야 할 일
            </h4>
            <ul className="space-y-2">
              {currentAction.mustAvoid.map((avoid, idx) => (
                <li
                  key={idx}
                  className="flex items-start gap-2 text-sm text-gray-600 dark:text-gray-400"
                >
                  <span className="text-red-500 mt-0.5">×</span>
                  {avoid}
                </li>
              ))}
            </ul>
          </div>

          {/* 행운의 요소 */}
          <div className="grid grid-cols-3 gap-3">
            <div className="p-3 bg-gray-50 dark:bg-gray-800 rounded-lg text-center">
              <Palette className="w-5 h-5 mx-auto mb-1 text-purple-500" />
              <p className="text-xs text-gray-500 mb-1">행운 색상</p>
              <p className="font-medium text-gray-800 dark:text-white">
                {currentAction.luckyElements.color}
              </p>
            </div>
            <div className="p-3 bg-gray-50 dark:bg-gray-800 rounded-lg text-center">
              <Hash className="w-5 h-5 mx-auto mb-1 text-blue-500" />
              <p className="text-xs text-gray-500 mb-1">행운 숫자</p>
              <p className="font-medium text-gray-800 dark:text-white">
                {currentAction.luckyElements.number}
              </p>
            </div>
            <div className="p-3 bg-gray-50 dark:bg-gray-800 rounded-lg text-center">
              <MapPin className="w-5 h-5 mx-auto mb-1 text-green-500" />
              <p className="text-xs text-gray-500 mb-1">행운 방향</p>
              <p className="font-medium text-gray-800 dark:text-white">
                {currentAction.luckyElements.direction}
              </p>
            </div>
          </div>
        </motion.div>
      )}
    </div>
  );
}

// 인생 타임라인 뷰
function LifeTimelineView({ timeline }: { timeline: LifeTimeline }) {
  return (
    <div className="space-y-6">
      {/* 현재 나이 */}
      <div className="text-center p-4 bg-purple-50 dark:bg-purple-900/30 rounded-xl">
        <p className="text-sm text-purple-600 dark:text-purple-400 mb-1">현재 나이</p>
        <p className="text-3xl font-bold text-purple-700 dark:text-purple-300">
          {timeline.currentAge}세
        </p>
      </div>

      {/* 인생 단계 */}
      <div>
        <h4 className="font-medium text-gray-800 dark:text-white mb-3">인생 단계별 흐름</h4>
        <div className="space-y-3">
          {timeline.phases.map((phase, idx) => (
            <div
              key={idx}
              className={`p-4 rounded-lg border-l-4 ${
                phase.score >= 80 ? 'border-green-500 bg-green-50 dark:bg-green-900/20' :
                phase.score >= 60 ? 'border-yellow-500 bg-yellow-50 dark:bg-yellow-900/20' :
                'border-red-500 bg-red-50 dark:bg-red-900/20'
              }`}
            >
              <div className="flex justify-between items-center mb-2">
                <span className="font-medium text-gray-800 dark:text-white">
                  {phase.ageRange}세 - {phase.phase}
                </span>
                <span className="text-lg font-bold">{phase.score}점</span>
              </div>
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <p className="text-green-600 dark:text-green-400 font-medium mb-1">기회</p>
                  <ul className="space-y-1">
                    {phase.opportunities.map((opp, i) => (
                      <li key={i} className="text-gray-600 dark:text-gray-400">• {opp}</li>
                    ))}
                  </ul>
                </div>
                <div>
                  <p className="text-red-600 dark:text-red-400 font-medium mb-1">도전</p>
                  <ul className="space-y-1">
                    {phase.challenges.map((ch, i) => (
                      <li key={i} className="text-gray-600 dark:text-gray-400">• {ch}</li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* 전환점 */}
      <div>
        <h4 className="font-medium text-gray-800 dark:text-white mb-3">인생 전환점</h4>
        <div className="space-y-2">
          {timeline.turningPoints.map((point, idx) => (
            <div
              key={idx}
              className="flex items-center gap-3 p-3 bg-gray-50 dark:bg-gray-800 rounded-lg"
            >
              <div className={`w-3 h-3 rounded-full ${
                point.importance === 'critical' ? 'bg-red-500' :
                point.importance === 'important' ? 'bg-yellow-500' : 'bg-blue-500'
              }`} />
              <div className="flex-1">
                <p className="font-medium text-gray-800 dark:text-white">
                  {point.age}세 ({point.year}년)
                </p>
                <p className="text-sm text-gray-600 dark:text-gray-400">{point.event}</p>
              </div>
              <span className={`px-2 py-1 text-xs rounded-full ${
                point.importance === 'critical' ? 'bg-red-100 text-red-700' :
                point.importance === 'important' ? 'bg-yellow-100 text-yellow-700' : 'bg-blue-100 text-blue-700'
              }`}>
                {point.importance === 'critical' ? '중요' : point.importance === 'important' ? '주목' : '참고'}
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* 골든 윈도우 */}
      <div>
        <h4 className="flex items-center gap-2 font-medium text-gray-800 dark:text-white mb-3">
          <Star className="w-4 h-4 text-yellow-500" />
          골든 윈도우 (최적 기회)
        </h4>
        <div className="space-y-2">
          {timeline.goldenWindows.map((window, idx) => (
            <div
              key={idx}
              className="p-4 bg-gradient-to-r from-yellow-50 to-orange-50 dark:from-yellow-900/30 dark:to-orange-900/30 rounded-lg"
            >
              <div className="flex justify-between items-center mb-2">
                <span className="font-medium text-gray-800 dark:text-white">{window.period}</span>
                <span className="text-lg font-bold text-yellow-600">{window.successRate}%</span>
              </div>
              <p className="text-sm text-gray-600 dark:text-gray-400">{window.purpose}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

// 직업 분석 뷰
function CareerAnalysisView({ analysis }: { analysis: CareerAnalysis }) {
  return (
    <div className="space-y-6">
      {/* 매칭 점수 */}
      <div className="text-center p-6 bg-gradient-to-br from-blue-50 to-indigo-50 dark:from-blue-900/30 dark:to-indigo-900/30 rounded-xl">
        <p className="text-sm text-blue-600 dark:text-blue-400 mb-2">직업 적합도</p>
        <div className="text-4xl font-bold text-blue-700 dark:text-blue-300 mb-2">
          {analysis.matchScore}점
        </div>
        <Progress value={analysis.matchScore} className="h-3 max-w-xs mx-auto" />
      </div>

      {/* 시너지/약점 */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="p-4 bg-green-50 dark:bg-green-900/20 rounded-xl">
          <h4 className="flex items-center gap-2 font-medium text-green-700 dark:text-green-400 mb-3">
            <CheckCircle className="w-4 h-4" />
            강점
          </h4>
          <ul className="space-y-2">
            {analysis.synergy.map((item, idx) => (
              <li key={idx} className="text-sm text-gray-600 dark:text-gray-400">
                • {item}
              </li>
            ))}
          </ul>
        </div>
        <div className="p-4 bg-red-50 dark:bg-red-900/20 rounded-xl">
          <h4 className="flex items-center gap-2 font-medium text-red-700 dark:text-red-400 mb-3">
            <AlertTriangle className="w-4 h-4" />
            약점
          </h4>
          <ul className="space-y-2">
            {analysis.weakPoints.map((item, idx) => (
              <li key={idx} className="text-sm text-gray-600 dark:text-gray-400">
                • {item}
              </li>
            ))}
          </ul>
        </div>
      </div>

      {/* 해결책 */}
      <div className="p-4 bg-purple-50 dark:bg-purple-900/20 rounded-xl">
        <h4 className="font-medium text-purple-700 dark:text-purple-400 mb-3">해결 전략</h4>
        <ul className="space-y-2">
          {analysis.solutions.map((solution, idx) => (
            <li key={idx} className="flex items-start gap-2 text-sm text-gray-600 dark:text-gray-400">
              <span className="text-purple-500">→</span>
              {solution}
            </li>
          ))}
        </ul>
      </div>

      {/* 또래 비교 */}
      <div>
        <h4 className="font-medium text-gray-800 dark:text-white mb-3">또래 대비 포지션</h4>
        <div className="grid grid-cols-3 gap-3">
          <div className="p-3 bg-gray-50 dark:bg-gray-800 rounded-lg text-center">
            <p className="text-xs text-gray-500 mb-1">기술 성숙도</p>
            <p className="text-lg font-bold text-blue-600">상위 {analysis.peerPosition.techMaturity}%</p>
          </div>
          <div className="p-3 bg-gray-50 dark:bg-gray-800 rounded-lg text-center">
            <p className="text-xs text-gray-500 mb-1">리더십 잠재력</p>
            <p className="text-lg font-bold text-green-600">상위 {analysis.peerPosition.leadershipPotential}%</p>
          </div>
          <div className="p-3 bg-gray-50 dark:bg-gray-800 rounded-lg text-center">
            <p className="text-xs text-gray-500 mb-1">번아웃 위험</p>
            <p className={`text-lg font-bold ${
              analysis.peerPosition.burnoutRisk === 'low' ? 'text-green-600' :
              analysis.peerPosition.burnoutRisk === 'high' ? 'text-red-600' : 'text-yellow-600'
            }`}>
              {analysis.peerPosition.burnoutRisk === 'low' ? '낮음' :
               analysis.peerPosition.burnoutRisk === 'high' ? '높음' : '보통'}
            </p>
          </div>
        </div>
      </div>

      {/* 방향 제안 */}
      <div className="p-4 bg-gradient-to-r from-purple-100 to-pink-100 dark:from-purple-900/30 dark:to-pink-900/30 rounded-xl">
        <h4 className="font-medium text-gray-800 dark:text-white mb-2">최적 방향</h4>
        <p className="text-sm text-gray-600 dark:text-gray-400">{analysis.optimalDirection}</p>
      </div>

      <div className="p-4 bg-yellow-50 dark:bg-yellow-900/20 rounded-xl">
        <h4 className="flex items-center gap-2 font-medium text-yellow-700 dark:text-yellow-400 mb-2">
          <Clock className="w-4 h-4" />
          전환 타이밍
        </h4>
        <p className="text-sm text-gray-600 dark:text-gray-400">{analysis.pivotTiming}</p>
      </div>
    </div>
  );
}

// 가족 영향 분석 뷰
function FamilyImpactView({ impact }: { impact: FamilyImpact }) {
  return (
    <div className="space-y-6">
      {/* 상태 요약 */}
      <div className="grid grid-cols-3 gap-3">
        <div className="p-4 bg-gray-50 dark:bg-gray-800 rounded-xl text-center">
          <Heart className="w-6 h-6 mx-auto mb-2 text-pink-500" />
          <p className="text-xs text-gray-500 mb-1">배우자 스트레스</p>
          <p className={`font-medium ${
            impact.spouseStress === 'low' ? 'text-green-600' :
            impact.spouseStress === 'high' ? 'text-red-600' : 'text-yellow-600'
          }`}>
            {impact.spouseStress === 'low' ? '낮음' :
             impact.spouseStress === 'high' ? '높음' : '보통'}
          </p>
        </div>
        <div className="p-4 bg-gray-50 dark:bg-gray-800 rounded-xl text-center">
          <Users className="w-6 h-6 mx-auto mb-2 text-blue-500" />
          <p className="text-xs text-gray-500 mb-1">자녀 영향</p>
          <p className={`font-medium ${
            impact.childrenImpact === 'positive' ? 'text-green-600' :
            impact.childrenImpact === 'negative' ? 'text-red-600' : 'text-yellow-600'
          }`}>
            {impact.childrenImpact === 'positive' ? '긍정적' :
             impact.childrenImpact === 'negative' ? '부정적' : '중립적'}
          </p>
        </div>
        <div className="p-4 bg-gray-50 dark:bg-gray-800 rounded-xl text-center">
          <span className="text-2xl mb-2 block">👨‍👩‍👧</span>
          <p className="text-xs text-gray-500 mb-1">부모 돌봄</p>
          <p className="font-medium text-gray-700 dark:text-gray-300 text-sm">
            {impact.parentCare}
          </p>
        </div>
      </div>

      {/* 주의사항 */}
      <div className="p-4 bg-red-50 dark:bg-red-900/20 rounded-xl">
        <h4 className="flex items-center gap-2 font-medium text-red-700 dark:text-red-400 mb-3">
          <AlertTriangle className="w-4 h-4" />
          주의사항
        </h4>
        <ul className="space-y-2">
          {impact.warnings.map((warning, idx) => (
            <li key={idx} className="text-sm text-gray-600 dark:text-gray-400">
              • {warning}
            </li>
          ))}
        </ul>
      </div>

      {/* 권장사항 */}
      <div className="p-4 bg-green-50 dark:bg-green-900/20 rounded-xl">
        <h4 className="flex items-center gap-2 font-medium text-green-700 dark:text-green-400 mb-3">
          <CheckCircle className="w-4 h-4" />
          권장사항
        </h4>
        <ul className="space-y-2">
          {impact.recommendations.map((rec, idx) => (
            <li key={idx} className="text-sm text-gray-600 dark:text-gray-400">
              • {rec}
            </li>
          ))}
        </ul>
      </div>

      {/* 재정 타임라인 */}
      <div>
        <h4 className="font-medium text-gray-800 dark:text-white mb-3">가계 재정 타임라인</h4>
        <div className="space-y-2">
          {impact.financialTimeline.map((item, idx) => (
            <div
              key={idx}
              className="flex items-center gap-3 p-3 bg-gray-50 dark:bg-gray-800 rounded-lg"
            >
              <div className="w-16 text-center">
                <p className="text-lg font-bold text-purple-600">{item.year}</p>
              </div>
              <div className="flex-1">
                <p className="font-medium text-gray-800 dark:text-white">{item.event}</p>
                <p className="text-sm text-gray-600 dark:text-gray-400">{item.impact}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

// 타이밍 분석 뷰
function TimingAnalysisView({ timing }: { timing: TimingAnalysis }) {
  return (
    <div className="space-y-6">
      {/* 현재 윈도우 */}
      <div className={`p-6 rounded-xl ${
        timing.currentWindow.isOpen
          ? 'bg-gradient-to-br from-green-50 to-emerald-50 dark:from-green-900/30 dark:to-emerald-900/30'
          : 'bg-gradient-to-br from-red-50 to-orange-50 dark:from-red-900/30 dark:to-orange-900/30'
      }`}>
        <div className="flex items-center gap-3 mb-4">
          <div className={`w-12 h-12 rounded-full flex items-center justify-center ${
            timing.currentWindow.isOpen ? 'bg-green-500' : 'bg-red-500'
          }`}>
            {timing.currentWindow.isOpen ? (
              <CheckCircle className="w-6 h-6 text-white" />
            ) : (
              <Clock className="w-6 h-6 text-white" />
            )}
          </div>
          <div>
            <p className="font-bold text-lg text-gray-800 dark:text-white">
              {timing.currentWindow.isOpen ? '기회의 창이 열려 있습니다!' : '현재 기회의 창이 닫혀 있습니다'}
            </p>
            <p className="text-sm text-gray-600 dark:text-gray-400">
              남은 기간: {timing.currentWindow.remainingDays}일
            </p>
          </div>
        </div>

        <div className="space-y-2 text-sm">
          <div className="p-3 bg-white/50 dark:bg-gray-800/50 rounded-lg">
            <p className="font-medium text-gray-700 dark:text-gray-300 mb-1">놓칠 경우</p>
            <p className="text-gray-600 dark:text-gray-400">{timing.currentWindow.missedConsequence}</p>
          </div>
          <div className="p-3 bg-white/50 dark:bg-gray-800/50 rounded-lg">
            <p className="font-medium text-gray-700 dark:text-gray-300 mb-1">회복 시간</p>
            <p className="text-gray-600 dark:text-gray-400">{timing.currentWindow.recoveryTime}</p>
          </div>
        </div>
      </div>

      {/* 다음 기회 */}
      <div className="p-4 bg-purple-50 dark:bg-purple-900/20 rounded-xl">
        <h4 className="flex items-center gap-2 font-medium text-purple-700 dark:text-purple-400 mb-3">
          <Star className="w-4 h-4" />
          다음 기회
        </h4>
        <div className="flex justify-between items-center">
          <div>
            <p className="text-lg font-bold text-gray-800 dark:text-white">
              {timing.nextOpportunity.date}
            </p>
            <p className="text-sm text-gray-600 dark:text-gray-400">예정일</p>
          </div>
          <div className="text-right">
            <p className="text-lg font-bold text-purple-600">
              {timing.nextOpportunity.probability}%
            </p>
            <p className="text-sm text-gray-600 dark:text-gray-400">성공 확률</p>
          </div>
        </div>
        <Progress value={timing.nextOpportunity.probability} className="mt-3 h-2" />
      </div>
    </div>
  );
}

// 관심사 전략 뷰
function InterestStrategiesView({ strategies }: { strategies: InterestStrategy[] }) {
  const [selectedInterest, setSelectedInterest] = useState(0);
  const current = strategies[selectedInterest];

  return (
    <div className="space-y-4">
      {/* 관심사 선택 */}
      <div className="flex gap-2 overflow-x-auto pb-2">
        {strategies.map((strategy, idx) => (
          <button
            key={idx}
            onClick={() => setSelectedInterest(idx)}
            className={`px-4 py-2 rounded-full whitespace-nowrap transition-all
              ${selectedInterest === idx
                ? 'bg-purple-600 text-white'
                : 'bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400 hover:bg-gray-200'}`}
          >
            {strategy.interest}
            <span className={`ml-1 text-xs ${selectedInterest === idx ? 'text-white/80' : ''}`}>
              P{strategy.priority}
            </span>
          </button>
        ))}
      </div>

      {current && (
        <motion.div
          key={selectedInterest}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="space-y-4"
        >
          {/* 적합도 */}
          <div className="flex items-center gap-4">
            <div className="flex-1">
              <div className="flex justify-between mb-1">
                <span className="text-sm text-gray-600 dark:text-gray-400">사주 적합도</span>
                <span className="text-sm font-bold">{current.sajuAlignment}%</span>
              </div>
              <Progress value={current.sajuAlignment} className="h-2" />
            </div>
          </div>

          <div className="p-3 bg-yellow-50 dark:bg-yellow-900/20 rounded-lg">
            <p className="text-sm">
              <span className="font-medium text-yellow-700 dark:text-yellow-400">최적 시기: </span>
              <span className="text-gray-600 dark:text-gray-400">{current.timing}</span>
            </p>
          </div>

          {/* DO / DON'T */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="p-4 bg-green-50 dark:bg-green-900/20 rounded-xl">
              <h4 className="flex items-center gap-2 font-medium text-green-700 dark:text-green-400 mb-3">
                <CheckCircle className="w-4 h-4" />
                해야 할 것
              </h4>
              <ul className="space-y-2">
                {current.doList.map((item, idx) => (
                  <li key={idx} className="text-sm text-gray-600 dark:text-gray-400">
                    • {item}
                  </li>
                ))}
              </ul>
            </div>
            <div className="p-4 bg-red-50 dark:bg-red-900/20 rounded-xl">
              <h4 className="flex items-center gap-2 font-medium text-red-700 dark:text-red-400 mb-3">
                <AlertTriangle className="w-4 h-4" />
                하지 말아야 할 것
              </h4>
              <ul className="space-y-2">
                {current.dontList.map((item, idx) => (
                  <li key={idx} className="text-sm text-gray-600 dark:text-gray-400">
                    • {item}
                  </li>
                ))}
              </ul>
            </div>
          </div>

          {/* 맞춤 조언 */}
          <div className="p-4 bg-purple-50 dark:bg-purple-900/20 rounded-xl">
            <h4 className="font-medium text-purple-700 dark:text-purple-400 mb-2">맞춤 조언</h4>
            <p className="text-sm text-gray-600 dark:text-gray-400">{current.specificAdvice}</p>
          </div>
        </motion.div>
      )}
    </div>
  );
}
