'use client';

import { useState } from 'react';
import { Link } from '@/i18n/routing';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import {
  ArrowRight,
  ArrowLeft,
  Brain,
  Users,
  Briefcase,
  Heart,
  Sparkles,
  CheckCircle,
  ChevronRight,
} from 'lucide-react';
import {
  MBTI_QUESTIONS,
  MBTI_TYPES,
  MBTI_DIMENSIONS,
  MBTIAnswer,
  MBTIType,
  calculateMBTI,
  getTendencyDescription,
  calculateCompatibility,
} from '@/lib/fortune/mbti';

export default function MBTIAnalysisPage() {
  const [step, setStep] = useState<'intro' | 'questions' | 'result'>('intro');
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [answers, setAnswers] = useState<MBTIAnswer[]>([]);
  const [result, setResult] = useState<ReturnType<typeof calculateMBTI> | null>(null);
  const [compareType, setCompareType] = useState<MBTIType | null>(null);

  const handleStart = () => {
    setStep('questions');
    setCurrentQuestion(0);
    setAnswers([]);
  };

  const handleAnswer = (answer: 'A' | 'B') => {
    const newAnswers = [
      ...answers.filter((a) => a.questionId !== MBTI_QUESTIONS[currentQuestion].id),
      { questionId: MBTI_QUESTIONS[currentQuestion].id, answer },
    ];
    setAnswers(newAnswers);

    if (currentQuestion < MBTI_QUESTIONS.length - 1) {
      setCurrentQuestion(currentQuestion + 1);
    } else {
      // 결과 계산
      const mbtiResult = calculateMBTI(newAnswers);
      setResult(mbtiResult);
      setStep('result');
    }
  };

  const handlePrev = () => {
    if (currentQuestion > 0) {
      setCurrentQuestion(currentQuestion - 1);
    }
  };

  const handleRestart = () => {
    setStep('intro');
    setCurrentQuestion(0);
    setAnswers([]);
    setResult(null);
    setCompareType(null);
  };

  // 인트로 화면
  if (step === 'intro') {
    return (
      <div className="min-h-screen bg-gradient-to-b from-indigo-50 to-purple-50 dark:from-indigo-950/20 dark:to-purple-950/20">
        <div className="container mx-auto px-4 py-8 md:py-16">
          <div className="max-w-2xl mx-auto text-center">
            {/* 헤더 */}
            <Badge className="mb-4 bg-gradient-to-r from-indigo-500 to-purple-500 text-white">
              <Brain className="mr-1 h-3 w-3" />
              무료 성격 분석
            </Badge>
            <h1 className="text-3xl md:text-4xl font-bold mb-4">
              MBTI 성향 분석
            </h1>
            <p className="text-lg text-muted-foreground mb-8">
              16문항으로 알아보는 나의 성격 유형<br />
              <span className="text-indigo-600 dark:text-indigo-400 font-medium">
                강한 성향은 대문자, 약한 성향은 소문자로 표시
              </span>
            </p>

            {/* 특징 카드 */}
            <div className="grid grid-cols-2 gap-4 mb-8">
              {[
                { icon: Brain, title: '4가지 차원', desc: '에너지, 인식, 판단, 생활' },
                { icon: Users, title: '16가지 유형', desc: '나만의 성격 유형 발견' },
                { icon: Heart, title: '궁합 분석', desc: '다른 유형과의 궁합' },
                { icon: Briefcase, title: '직업 추천', desc: '어울리는 직업 제안' },
              ].map((item, i) => {
                const Icon = item.icon;
                return (
                  <Card key={i} className="text-left">
                    <CardContent className="p-4">
                      <Icon className="h-8 w-8 text-indigo-500 mb-2" />
                      <h3 className="font-semibold">{item.title}</h3>
                      <p className="text-sm text-muted-foreground">{item.desc}</p>
                    </CardContent>
                  </Card>
                );
              })}
            </div>

            {/* 시작 버튼 */}
            <button
              onClick={handleStart}
              className="inline-flex items-center justify-center h-14 px-10 bg-gradient-to-r from-indigo-500 to-purple-500 hover:from-indigo-600 hover:to-purple-600 text-white font-semibold rounded-xl shadow-lg transition-all text-lg"
            >
              <Sparkles className="mr-2 h-5 w-5" />
              분석 시작하기
              <ArrowRight className="ml-2 h-5 w-5" />
            </button>

            <p className="text-sm text-muted-foreground mt-4">
              약 3분 소요 · 16문항
            </p>
          </div>
        </div>
      </div>
    );
  }

  // 질문 화면
  if (step === 'questions') {
    const question = MBTI_QUESTIONS[currentQuestion];
    const progress = ((currentQuestion + 1) / MBTI_QUESTIONS.length) * 100;
    const dimensionName = MBTI_DIMENSIONS[question.dimension].name;

    return (
      <div className="min-h-screen bg-gradient-to-b from-indigo-50 to-purple-50 dark:from-indigo-950/20 dark:to-purple-950/20">
        <div className="container mx-auto px-4 py-8">
          <div className="max-w-2xl mx-auto">
            {/* 진행 상황 */}
            <div className="mb-8">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm text-muted-foreground">
                  {currentQuestion + 1} / {MBTI_QUESTIONS.length}
                </span>
                <Badge variant="outline">{dimensionName}</Badge>
              </div>
              <Progress value={progress} className="h-2" />
            </div>

            {/* 질문 카드 */}
            <Card className="mb-6">
              <CardContent className="p-8">
                <h2 className="text-xl md:text-2xl font-bold text-center mb-8">
                  {question.question}
                </h2>

                <div className="space-y-4">
                  <button
                    onClick={() => handleAnswer('A')}
                    className="w-full p-5 text-left rounded-xl border-2 border-gray-200 dark:border-gray-700 hover:border-indigo-400 dark:hover:border-indigo-500 hover:bg-indigo-50 dark:hover:bg-indigo-950/30 transition-all group"
                  >
                    <div className="flex items-center gap-4">
                      <div className="w-10 h-10 rounded-full bg-indigo-100 dark:bg-indigo-900/50 flex items-center justify-center font-bold text-indigo-600 dark:text-indigo-400 group-hover:bg-indigo-500 group-hover:text-white transition-colors">
                        A
                      </div>
                      <span className="text-base md:text-lg">{question.optionA.text}</span>
                    </div>
                  </button>

                  <button
                    onClick={() => handleAnswer('B')}
                    className="w-full p-5 text-left rounded-xl border-2 border-gray-200 dark:border-gray-700 hover:border-purple-400 dark:hover:border-purple-500 hover:bg-purple-50 dark:hover:bg-purple-950/30 transition-all group"
                  >
                    <div className="flex items-center gap-4">
                      <div className="w-10 h-10 rounded-full bg-purple-100 dark:bg-purple-900/50 flex items-center justify-center font-bold text-purple-600 dark:text-purple-400 group-hover:bg-purple-500 group-hover:text-white transition-colors">
                        B
                      </div>
                      <span className="text-base md:text-lg">{question.optionB.text}</span>
                    </div>
                  </button>
                </div>
              </CardContent>
            </Card>

            {/* 네비게이션 */}
            {currentQuestion > 0 && (
              <button
                onClick={handlePrev}
                className="inline-flex items-center text-muted-foreground hover:text-foreground transition-colors"
              >
                <ArrowLeft className="mr-1 h-4 w-4" />
                이전 질문
              </button>
            )}
          </div>
        </div>
      </div>
    );
  }

  // 결과 화면
  if (step === 'result' && result) {
    const { type, tendency, displayType, typeInfo } = result;

    return (
      <div className="min-h-screen bg-gradient-to-b from-indigo-50 to-purple-50 dark:from-indigo-950/20 dark:to-purple-950/20">
        <div className="container mx-auto px-4 py-8">
          <div className="max-w-3xl mx-auto">
            {/* 결과 헤더 */}
            <Card className="mb-6 overflow-hidden">
              <div className="bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 p-8 text-white text-center">
                <Badge className="mb-4 bg-white/20 text-white border-white/30">
                  분석 완료
                </Badge>
                <div className="text-6xl md:text-8xl font-bold mb-4 tracking-wider">
                  {displayType}
                </div>
                <h1 className="text-2xl md:text-3xl font-bold mb-2">{typeInfo.name}</h1>
                <p className="text-white/80">{typeInfo.nickname}</p>
              </div>

              <CardContent className="p-6">
                <p className="text-lg text-center mb-6">{typeInfo.description}</p>

                {/* 대소문자 범례 */}
                <div className="flex justify-center gap-4 mb-6">
                  <div className="flex items-center gap-2 text-sm">
                    <span className="font-bold text-lg">A</span>
                    <span className="text-muted-foreground">= 강한 성향</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm">
                    <span className="font-bold text-lg text-gray-400">a</span>
                    <span className="text-muted-foreground">= 약한 성향</span>
                  </div>
                </div>

                {/* 차원별 성향 그래프 */}
                <div className="space-y-4">
                  {[
                    { dim: 'EI' as const, left: 'E', right: 'I', leftName: '외향', rightName: '내향' },
                    { dim: 'SN' as const, left: 'S', right: 'N', leftName: '감각', rightName: '직관' },
                    { dim: 'TF' as const, left: 'T', right: 'F', leftName: '사고', rightName: '감정' },
                    { dim: 'JP' as const, left: 'J', right: 'P', leftName: '판단', rightName: '인식' },
                  ].map(({ dim, left, right, leftName, rightName }) => {
                    const dimInfo = MBTI_DIMENSIONS[dim];
                    const value = tendency[dim];
                    const isLeftStrong = value < 50;
                    const strength = Math.abs(value - 50);

                    return (
                      <div key={dim} className="p-4 rounded-xl bg-gray-50 dark:bg-gray-800/50">
                        <div className="flex items-center justify-between mb-2">
                          <span className="text-sm font-medium">{dimInfo.name}</span>
                          <span className="text-sm text-muted-foreground">
                            {getTendencyDescription(value, dim)}
                          </span>
                        </div>
                        <div className="flex items-center gap-3">
                          <span className={`w-8 text-center font-bold ${isLeftStrong ? 'text-indigo-600 dark:text-indigo-400' : 'text-gray-400'}`}>
                            {isLeftStrong && strength > 25 ? left : left.toLowerCase()}
                          </span>
                          <div className="flex-1 h-3 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden relative">
                            <div
                              className={`absolute top-0 h-full transition-all ${
                                isLeftStrong
                                  ? 'left-0 bg-gradient-to-r from-indigo-500 to-indigo-400'
                                  : 'right-0 bg-gradient-to-l from-purple-500 to-purple-400'
                              }`}
                              style={{ width: `${strength}%` }}
                            />
                            <div className="absolute left-1/2 top-0 bottom-0 w-0.5 bg-gray-400" />
                          </div>
                          <span className={`w-8 text-center font-bold ${!isLeftStrong ? 'text-purple-600 dark:text-purple-400' : 'text-gray-400'}`}>
                            {!isLeftStrong && strength > 25 ? right : right.toLowerCase()}
                          </span>
                        </div>
                        <div className="flex justify-between mt-1 text-xs text-muted-foreground">
                          <span>{leftName}</span>
                          <span>{rightName}</span>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </CardContent>
            </Card>

            {/* 강점/약점 */}
            <div className="grid md:grid-cols-2 gap-4 mb-6">
              <Card>
                <CardHeader>
                  <CardTitle className="text-emerald-600 dark:text-emerald-400 flex items-center gap-2">
                    <CheckCircle className="h-5 w-5" />
                    강점
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-2">
                    {typeInfo.strengths.map((s, i) => (
                      <li key={i} className="flex items-center gap-2">
                        <span className="text-emerald-500">✓</span>
                        {s}
                      </li>
                    ))}
                  </ul>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="text-amber-600 dark:text-amber-400 flex items-center gap-2">
                    <Sparkles className="h-5 w-5" />
                    성장 포인트
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-2">
                    {typeInfo.weaknesses.map((w, i) => (
                      <li key={i} className="flex items-center gap-2">
                        <span className="text-amber-500">!</span>
                        {w}
                      </li>
                    ))}
                  </ul>
                </CardContent>
              </Card>
            </div>

            {/* 추천 직업 */}
            <Card className="mb-6">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Briefcase className="h-5 w-5 text-blue-500" />
                  어울리는 직업
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex flex-wrap gap-2">
                  {typeInfo.careers.map((career, i) => (
                    <Badge key={i} variant="secondary" className="px-3 py-1">
                      {career}
                    </Badge>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* 궁합 분석 */}
            <Card className="mb-6">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Heart className="h-5 w-5 text-rose-500" />
                  MBTI 궁합
                </CardTitle>
                <CardDescription>다른 유형과의 궁합을 확인해보세요</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="mb-4">
                  <label className="block text-sm font-medium mb-2">상대방 MBTI 선택</label>
                  <div className="grid grid-cols-4 md:grid-cols-8 gap-2">
                    {(Object.keys(MBTI_TYPES) as MBTIType[]).map((t) => (
                      <button
                        key={t}
                        onClick={() => setCompareType(t)}
                        className={`p-2 text-sm rounded-lg border transition-all ${
                          compareType === t
                            ? 'border-rose-400 bg-rose-50 dark:bg-rose-950/30 text-rose-600 dark:text-rose-400'
                            : 'border-gray-200 dark:border-gray-700 hover:border-rose-300'
                        }`}
                      >
                        {t}
                      </button>
                    ))}
                  </div>
                </div>

                {compareType && (
                  <div className="p-4 rounded-xl bg-rose-50 dark:bg-rose-950/30 border border-rose-200 dark:border-rose-800">
                    <div className="flex items-center justify-center gap-4 mb-3">
                      <div className="text-center">
                        <div className="text-2xl font-bold text-indigo-600 dark:text-indigo-400">{type}</div>
                        <div className="text-sm text-muted-foreground">나</div>
                      </div>
                      <Heart className="h-6 w-6 text-rose-500" />
                      <div className="text-center">
                        <div className="text-2xl font-bold text-purple-600 dark:text-purple-400">{compareType}</div>
                        <div className="text-sm text-muted-foreground">상대</div>
                      </div>
                    </div>
                    {(() => {
                      const compat = calculateCompatibility(type, compareType);
                      return (
                        <>
                          <div className="text-center mb-2">
                            <span className="text-3xl font-bold text-rose-600 dark:text-rose-400">
                              {compat.score}점
                            </span>
                          </div>
                          <p className="text-center text-sm">{compat.description}</p>
                        </>
                      );
                    })()}
                  </div>
                )}
              </CardContent>
            </Card>

            {/* 액션 버튼 */}
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <button
                onClick={handleRestart}
                className="inline-flex items-center justify-center h-11 px-6 bg-white dark:bg-gray-800 text-gray-800 dark:text-white border border-gray-300 dark:border-gray-600 hover:bg-gray-50 dark:hover:bg-gray-700 font-medium rounded-xl transition-all"
              >
                다시 검사하기
              </button>
              <Link href="/fortune/saju">
                <button className="inline-flex items-center justify-center h-11 px-6 bg-gradient-to-r from-indigo-500 to-purple-500 hover:from-indigo-600 hover:to-purple-600 text-white font-semibold rounded-xl transition-all">
                  사주와 함께 분석하기
                  <ChevronRight className="ml-1 h-4 w-4" />
                </button>
              </Link>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return null;
}
