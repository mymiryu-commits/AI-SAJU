'use client';

import { useState, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import {
  ArrowRight,
  Share2,
  RefreshCw,
  Heart,
  Briefcase,
  Users,
  Sparkles,
  Crown,
  Lock,
  Eye,
  HeartHandshake,
} from 'lucide-react';
import { Link } from '@/i18n/routing';
import {
  analyzeDualAnimalDna,
  DualAnimalResult,
  AnimalType,
  ANIMAL_DATABASE,
  calculateAnimalCompatibility,
  FiveElement,
  getMatchLevelLabel,
  getMatchLevelEmoji,
  MatchLevel,
} from '@/lib/fortune/animalDna';

// 동물 이모지 매핑
const animalEmojis: Record<AnimalType, string> = {
  fox: '🦊', deer: '🦌', tiger: '🐯', dragon: '🐉',
  eagle: '🦅', lion: '🦁', phoenix: '🔥', snake: '🐍',
  bear: '🐻', ox: '🐂', elephant: '🐘', wolf: '🐺',
  dolphin: '🐬', turtle: '🐢', whale: '🐋', swan: '🦢',
};

// 오행 색상 매핑
const elementColors: Record<FiveElement, string> = {
  '木': 'from-green-400 to-emerald-600',
  '火': 'from-red-400 to-orange-600',
  '土': 'from-yellow-400 to-amber-600',
  '金': 'from-gray-300 to-slate-500',
  '水': 'from-blue-400 to-indigo-600',
};

// 일치도 색상 매핑
const matchLevelColors: Record<MatchLevel, string> = {
  identical: 'from-green-400 to-emerald-500',
  similar: 'from-blue-400 to-cyan-500',
  different: 'from-amber-400 to-orange-500',
  opposite: 'from-purple-400 to-pink-500',
};

export default function AnimalDnaPage() {
  const [step, setStep] = useState<'input' | 'analyzing' | 'result'>('input');
  const [birthYear, setBirthYear] = useState('');
  const [birthMonth, setBirthMonth] = useState('');
  const [birthDay, setBirthDay] = useState('');
  const [birthHour, setBirthHour] = useState('');
  const [result, setResult] = useState<DualAnimalResult | null>(null);
  const [selectedCompareAnimal, setSelectedCompareAnimal] = useState<AnimalType | null>(null);
  const [activeTab, setActiveTab] = useState<'outer' | 'inner'>('outer');
  const resultCardRef = useRef<HTMLDivElement>(null);

  // 연도 옵션 생성 (1940-2024)
  const yearOptions = Array.from({ length: 85 }, (_, i) => 2024 - i);
  const monthOptions = Array.from({ length: 12 }, (_, i) => i + 1);
  const dayOptions = Array.from({ length: 31 }, (_, i) => i + 1);
  const hourOptions = Array.from({ length: 24 }, (_, i) => i);

  const handleAnalyze = () => {
    if (!birthYear || !birthMonth || !birthDay) return;

    setStep('analyzing');

    setTimeout(() => {
      const analysisResult = analyzeDualAnimalDna(
        parseInt(birthYear),
        parseInt(birthMonth),
        parseInt(birthDay),
        birthHour ? parseInt(birthHour) : undefined
      );
      setResult(analysisResult);
      setStep('result');
    }, 2500);
  };

  const handleReset = () => {
    setStep('input');
    setBirthYear('');
    setBirthMonth('');
    setBirthDay('');
    setBirthHour('');
    setResult(null);
    setSelectedCompareAnimal(null);
    setActiveTab('outer');
  };

  const handleShare = async () => {
    if (!result) return;

    const shareText = result.outer.animal.id === result.inner.animal.id
      ? `🧬 나의 동물 DNA: ${result.outer.animal.emoji} ${result.outer.animal.title}!\n순수한 ${result.outer.animal.name}형 - 겉과 속이 같은 진정성 있는 사람이래요!`
      : `🧬 나의 동물 DNA\n겉: ${result.outer.animal.emoji} ${result.outer.animal.name}\n속: ${result.inner.animal.emoji} ${result.inner.animal.name}\n\n일치도 ${result.matchScore}% - ${result.matchDescription}`;

    const shareData = {
      title: '나의 동물 DNA',
      text: shareText + '\n\n나의 동물 DNA를 확인해보세요!',
      url: window.location.href,
    };

    if (navigator.share) {
      try {
        await navigator.share(shareData);
      } catch {
        console.log('Share cancelled');
      }
    } else {
      await navigator.clipboard.writeText(`${shareData.text}\n${shareData.url}`);
      alert('링크가 복사되었습니다!');
    }
  };

  // 분석 중 화면
  if (step === 'analyzing') {
    return (
      <div className="min-h-screen bg-gradient-to-b from-purple-50 via-pink-50 to-background dark:from-purple-950/20 dark:via-pink-950/10 dark:to-background flex items-center justify-center">
        <div className="text-center space-y-6">
          <div className="relative w-40 h-40 mx-auto">
            <div className="absolute inset-0 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full animate-ping opacity-20" />
            <div className="absolute inset-4 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full animate-pulse" />
            <div className="absolute inset-0 flex items-center justify-center gap-2">
              <span className="text-4xl animate-bounce" style={{ animationDelay: '0ms' }}>🎭</span>
              <span className="text-5xl animate-bounce" style={{ animationDelay: '200ms' }}>🧬</span>
              <span className="text-4xl animate-bounce" style={{ animationDelay: '400ms' }}>💫</span>
            </div>
          </div>
          <div>
            <h2 className="text-2xl font-bold mb-2">겉과 속의 동물을 분석 중...</h2>
            <p className="text-muted-foreground">당신의 두 가지 모습을 찾고 있습니다</p>
          </div>
          <div className="flex justify-center gap-3">
            <div className="text-center">
              <div className="text-3xl animate-pulse">👤</div>
              <div className="text-xs text-muted-foreground mt-1">겉모습</div>
            </div>
            <div className="text-2xl text-muted-foreground animate-pulse">↔️</div>
            <div className="text-center">
              <div className="text-3xl animate-pulse">❤️</div>
              <div className="text-xs text-muted-foreground mt-1">내면</div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // 결과 화면
  if (step === 'result' && result) {
    const isSameAnimal = result.outer.animal.id === result.inner.animal.id;
    const currentAnimal = activeTab === 'outer' ? result.outer.animal : result.inner.animal;
    const currentElement = activeTab === 'outer' ? result.outer.element : result.inner.element;

    const compatibilityResult = selectedCompareAnimal
      ? calculateAnimalCompatibility(result.inner.animal.id, selectedCompareAnimal)
      : null;

    return (
      <div className="min-h-screen bg-gradient-to-b from-purple-50 via-pink-50 to-background dark:from-purple-950/20 dark:via-pink-950/10 dark:to-background">
        <div className="container mx-auto px-4 py-8 max-w-2xl">
          {/* 메인 결과 카드 */}
          <div ref={resultCardRef} className="mb-6">
            <Card className="overflow-hidden border-2 border-purple-200 dark:border-purple-800">
              <CardContent className="p-0">
                {/* 겉과 속 비교 헤더 */}
                <div className="bg-gradient-to-r from-purple-500 via-pink-500 to-rose-500 p-6 text-white">
                  <div className="text-center mb-4">
                    <div className="inline-flex items-center gap-2 bg-white/20 rounded-full px-3 py-1 text-sm mb-3">
                      {getMatchLevelEmoji(result.matchLevel)} 일치도 {result.matchScore}%
                    </div>
                    <h1 className="text-2xl md:text-3xl font-bold">{result.combinedTitle}</h1>
                  </div>

                  {/* 겉 ↔ 속 비교 */}
                  <div className="flex items-center justify-center gap-4 md:gap-8">
                    {/* 겉 동물 */}
                    <div className="text-center">
                      <div className="text-xs text-white/70 mb-1">겉 (外)</div>
                      <div
                        className={`w-20 h-20 md:w-24 md:h-24 rounded-2xl bg-white/20 backdrop-blur flex items-center justify-center text-4xl md:text-5xl cursor-pointer transition-all ${activeTab === 'outer' ? 'ring-4 ring-white scale-110' : 'opacity-70 hover:opacity-100'}`}
                        onClick={() => setActiveTab('outer')}
                      >
                        {animalEmojis[result.outer.animal.id]}
                      </div>
                      <div className="text-sm font-medium mt-2">{result.outer.animal.name}</div>
                    </div>

                    {/* 일치도 표시 */}
                    <div className="flex flex-col items-center">
                      <div className="text-3xl">{isSameAnimal ? '=' : '↔️'}</div>
                      <div className={`text-xs mt-1 px-2 py-0.5 rounded-full ${
                        result.matchLevel === 'identical' ? 'bg-green-400/30' :
                        result.matchLevel === 'similar' ? 'bg-blue-400/30' :
                        result.matchLevel === 'different' ? 'bg-amber-400/30' :
                        'bg-pink-400/30'
                      }`}>
                        {getMatchLevelLabel(result.matchLevel)}
                      </div>
                    </div>

                    {/* 속 동물 */}
                    <div className="text-center">
                      <div className="text-xs text-white/70 mb-1">속 (內)</div>
                      <div
                        className={`w-20 h-20 md:w-24 md:h-24 rounded-2xl bg-white/20 backdrop-blur flex items-center justify-center text-4xl md:text-5xl cursor-pointer transition-all ${activeTab === 'inner' ? 'ring-4 ring-white scale-110' : 'opacity-70 hover:opacity-100'}`}
                        onClick={() => setActiveTab('inner')}
                      >
                        {animalEmojis[result.inner.animal.id]}
                      </div>
                      <div className="text-sm font-medium mt-2">{result.inner.animal.name}</div>
                    </div>
                  </div>
                </div>

                {/* 종합 성격 설명 */}
                <div className="p-4 bg-gradient-to-r from-purple-50 to-pink-50 dark:from-purple-950/30 dark:to-pink-950/30 border-b">
                  <p className="text-center text-sm md:text-base">
                    {result.personality}
                  </p>
                </div>

                {/* 탭 전환 */}
                <div className="flex border-b">
                  <button
                    onClick={() => setActiveTab('outer')}
                    className={`flex-1 py-3 text-sm font-medium flex items-center justify-center gap-2 transition-colors ${
                      activeTab === 'outer'
                        ? 'bg-purple-100 dark:bg-purple-900/30 text-purple-700 dark:text-purple-300 border-b-2 border-purple-500'
                        : 'text-muted-foreground hover:bg-gray-50 dark:hover:bg-gray-800'
                    }`}
                  >
                    <Eye className="h-4 w-4" />
                    겉모습 (타인이 보는 나)
                  </button>
                  <button
                    onClick={() => setActiveTab('inner')}
                    className={`flex-1 py-3 text-sm font-medium flex items-center justify-center gap-2 transition-colors ${
                      activeTab === 'inner'
                        ? 'bg-pink-100 dark:bg-pink-900/30 text-pink-700 dark:text-pink-300 border-b-2 border-pink-500'
                        : 'text-muted-foreground hover:bg-gray-50 dark:hover:bg-gray-800'
                    }`}
                  >
                    <HeartHandshake className="h-4 w-4" />
                    내면 (진짜 나)
                  </button>
                </div>

                {/* 선택된 동물 상세 */}
                <div className="p-6">
                  {/* 동물 타이틀 */}
                  <div className="text-center mb-6">
                    <div className="text-5xl mb-3">{animalEmojis[currentAnimal.id]}</div>
                    <h2 className={`text-2xl font-bold bg-gradient-to-r ${elementColors[currentElement]} bg-clip-text text-transparent`}>
                      {currentAnimal.title}
                    </h2>
                    <p className="text-muted-foreground text-sm mt-2">
                      {activeTab === 'outer' ? result.outer.description : result.inner.description}
                    </p>
                  </div>

                  {/* 오행 & 음양 */}
                  <div className="flex justify-center gap-6 mb-6 p-4 bg-gray-50 dark:bg-gray-800/50 rounded-xl">
                    <div className="text-center">
                      <div className="text-xs text-muted-foreground mb-1">오행</div>
                      <div className={`text-xl font-bold bg-gradient-to-r ${elementColors[currentElement]} bg-clip-text text-transparent`}>
                        {currentElement}
                      </div>
                    </div>
                    <div className="text-center">
                      <div className="text-xs text-muted-foreground mb-1">음양</div>
                      <div className="text-xl font-bold">
                        {(activeTab === 'outer' ? result.yinYang.outer : result.yinYang.inner) === 'yang' ? '☀️ 양' : '🌙 음'}
                      </div>
                    </div>
                  </div>

                  {/* 성향 그래프 */}
                  <div className="mb-6">
                    <h3 className="font-bold mb-4 flex items-center gap-2">
                      <Sparkles className="h-5 w-5 text-purple-500" />
                      {activeTab === 'outer' ? '겉으로 보이는 성향' : '내면의 진짜 성향'}
                    </h3>
                    <div className="space-y-3">
                      {Object.entries({
                        관찰력: currentAnimal.traits.observation,
                        적응력: currentAnimal.traits.adaptability,
                        독립성: currentAnimal.traits.independence,
                        리더십: currentAnimal.traits.leadership,
                        창의성: currentAnimal.traits.creativity,
                        안정성: currentAnimal.traits.stability,
                      }).map(([name, value]) => (
                        <div key={name} className="flex items-center gap-3">
                          <div className="w-14 text-sm text-muted-foreground">{name}</div>
                          <div className="flex-1 h-2.5 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
                            <div
                              className={`h-full bg-gradient-to-r ${activeTab === 'outer' ? 'from-purple-400 to-purple-600' : 'from-pink-400 to-pink-600'} rounded-full transition-all duration-1000`}
                              style={{ width: `${value}%` }}
                            />
                          </div>
                          <div className="w-10 text-sm font-medium text-right">{value}%</div>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* 강점/약점 */}
                  <div className="grid grid-cols-2 gap-4 mb-6">
                    <div className="p-4 bg-green-50 dark:bg-green-950/30 rounded-xl">
                      <h4 className="font-medium text-green-700 dark:text-green-400 mb-2 text-sm">💪 강점</h4>
                      <ul className="text-xs space-y-1">
                        {currentAnimal.strengths.map((s, i) => (
                          <li key={i} className="text-muted-foreground">• {s}</li>
                        ))}
                      </ul>
                    </div>
                    <div className="p-4 bg-red-50 dark:bg-red-950/30 rounded-xl">
                      <h4 className="font-medium text-red-700 dark:text-red-400 mb-2 text-sm">⚠️ 주의점</h4>
                      <ul className="text-xs space-y-1">
                        {currentAnimal.weaknesses.map((w, i) => (
                          <li key={i} className="text-muted-foreground">• {w}</li>
                        ))}
                      </ul>
                    </div>
                  </div>

                  {/* 적합 직업 & 연애 스타일 */}
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <h4 className="font-medium flex items-center gap-1 mb-2 text-sm">
                        <Briefcase className="h-4 w-4" /> 적합 직업
                      </h4>
                      <div className="flex flex-wrap gap-1">
                        {currentAnimal.careerFit.map((career, i) => (
                          <span key={i} className="text-xs bg-purple-100 dark:bg-purple-900/30 text-purple-700 dark:text-purple-300 px-2 py-1 rounded-full">
                            {career}
                          </span>
                        ))}
                      </div>
                    </div>
                    <div>
                      <h4 className="font-medium flex items-center gap-1 mb-2 text-sm">
                        <Heart className="h-4 w-4" /> 연애 스타일
                      </h4>
                      <p className="text-xs text-muted-foreground">{currentAnimal.loveStyle}</p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* 공유 버튼 */}
          <div className="flex gap-3 mb-6">
            <Button onClick={handleShare} className="flex-1 bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600">
              <Share2 className="h-4 w-4 mr-2" />
              결과 공유하기
            </Button>
            <Button onClick={handleReset} variant="outline">
              <RefreshCw className="h-4 w-4 mr-2" />
              다시
            </Button>
          </div>

          {/* 궁합 체크 */}
          <Card className="mb-6">
            <CardContent className="p-6">
              <h3 className="font-bold mb-4 flex items-center gap-2">
                <Users className="h-5 w-5 text-purple-500" />
                내 속마음({result.inner.animal.name})과 궁합 보기
              </h3>
              <div className="grid grid-cols-4 gap-2 mb-4">
                {Object.entries(animalEmojis).map(([animalId, emoji]) => (
                  <button
                    key={animalId}
                    onClick={() => setSelectedCompareAnimal(animalId as AnimalType)}
                    className={`p-2 rounded-xl text-center transition-all ${
                      selectedCompareAnimal === animalId
                        ? 'bg-purple-100 dark:bg-purple-900/50 ring-2 ring-purple-500'
                        : 'bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700'
                    }`}
                  >
                    <div className="text-xl">{emoji}</div>
                    <div className="text-[10px] text-muted-foreground mt-0.5">
                      {ANIMAL_DATABASE[animalId as AnimalType].name}
                    </div>
                  </button>
                ))}
              </div>

              {compatibilityResult && selectedCompareAnimal && (
                <div className={`p-4 rounded-xl ${
                  compatibilityResult.relationship === 'best' ? 'bg-green-100 dark:bg-green-900/30' :
                  compatibilityResult.relationship === 'worst' ? 'bg-red-100 dark:bg-red-900/30' :
                  'bg-gray-100 dark:bg-gray-800'
                }`}>
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center gap-2">
                      <span className="text-xl">{animalEmojis[result.inner.animal.id]}</span>
                      <span className="text-sm text-muted-foreground">내 속마음</span>
                      <span className="text-muted-foreground">×</span>
                      <span className="text-xl">{animalEmojis[selectedCompareAnimal]}</span>
                    </div>
                    <div className="text-xl font-bold">{compatibilityResult.score}점</div>
                  </div>
                  <p className="text-sm">{compatibilityResult.description}</p>
                </div>
              )}
            </CardContent>
          </Card>

          {/* 프리미엄 유도 */}
          <Card className="bg-gradient-to-r from-purple-500 to-pink-500 text-white">
            <CardContent className="p-6">
              <div className="flex items-center gap-2 mb-3">
                <Crown className="h-5 w-5" />
                <h3 className="font-bold">프리미엄 상세 분석</h3>
              </div>
              <ul className="text-sm space-y-2 mb-4 text-white/90">
                <li className="flex items-center gap-2">
                  <Lock className="h-4 w-4" /> 겉과 속의 갈등 해소 가이드
                </li>
                <li className="flex items-center gap-2">
                  <Lock className="h-4 w-4" /> 월간 동물 운세 (겉/속 각각)
                </li>
                <li className="flex items-center gap-2">
                  <Lock className="h-4 w-4" /> 궁합 동물 TOP 10 상세 분석
                </li>
                <li className="flex items-center gap-2">
                  <Lock className="h-4 w-4" /> 고화질 공유 카드 (워터마크 X)
                </li>
              </ul>
              <Link href="/pricing">
                <Button className="w-full bg-white text-purple-600 hover:bg-gray-100">
                  9,900원으로 잠금 해제
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </Link>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  // 입력 화면
  return (
    <div className="min-h-screen bg-gradient-to-b from-purple-50 via-pink-50 to-background dark:from-purple-950/20 dark:via-pink-950/10 dark:to-background">
      <div className="container mx-auto px-4 py-12 max-w-lg">
        {/* 헤더 */}
        <div className="text-center mb-10">
          <div className="inline-flex items-center gap-2 bg-gradient-to-r from-purple-500 to-pink-500 text-white rounded-full px-4 py-1.5 text-sm font-medium mb-4">
            <span>🧬</span>
            <span>AI 동물 DNA</span>
          </div>
          <h1 className="text-3xl md:text-4xl font-bold mb-3">
            겉과 속, <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-500 to-pink-500">두 개의 동물</span>
          </h1>
          <p className="text-muted-foreground">
            사주로 보는 타인에게 보이는 나 vs 진짜 내면의 나
          </p>
        </div>

        {/* 겉과 속 프리뷰 */}
        <div className="flex justify-center items-center gap-4 mb-10">
          <div className="text-center">
            <div className="w-16 h-16 rounded-2xl bg-purple-100 dark:bg-purple-900/30 shadow-lg flex items-center justify-center text-3xl animate-pulse">
              🦁
            </div>
            <div className="text-xs text-muted-foreground mt-2">겉모습</div>
          </div>
          <div className="text-2xl text-purple-400 animate-pulse">↔️</div>
          <div className="text-center">
            <div className="w-16 h-16 rounded-2xl bg-pink-100 dark:bg-pink-900/30 shadow-lg flex items-center justify-center text-3xl animate-pulse" style={{ animationDelay: '500ms' }}>
              🦊
            </div>
            <div className="text-xs text-muted-foreground mt-2">내면</div>
          </div>
        </div>

        {/* 설명 카드 */}
        <Card className="mb-6 bg-gradient-to-r from-purple-50 to-pink-50 dark:from-purple-950/30 dark:to-pink-950/30 border-purple-200 dark:border-purple-800">
          <CardContent className="p-4">
            <div className="text-sm text-center space-y-2">
              <p>🎭 어떤 사람은 겉과 속이 같고,</p>
              <p>💫 어떤 사람은 완전히 다르기도 해요</p>
              <p className="font-medium text-purple-700 dark:text-purple-300">당신은 어떤 타입일까요?</p>
            </div>
          </CardContent>
        </Card>

        {/* 입력 폼 */}
        <Card className="mb-8">
          <CardContent className="p-6 space-y-4">
            <h2 className="font-bold text-lg mb-4">생년월일을 입력하세요</h2>

            {/* 생년월일 선택 */}
            <div className="grid grid-cols-3 gap-3">
              <div>
                <label className="text-sm text-muted-foreground mb-1 block">년도</label>
                <select
                  value={birthYear}
                  onChange={(e) => setBirthYear(e.target.value)}
                  className="w-full px-3 py-2.5 border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                >
                  <option value="">년도</option>
                  {yearOptions.map(year => (
                    <option key={year} value={year}>{year}년</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="text-sm text-muted-foreground mb-1 block">월</label>
                <select
                  value={birthMonth}
                  onChange={(e) => setBirthMonth(e.target.value)}
                  className="w-full px-3 py-2.5 border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                >
                  <option value="">월</option>
                  {monthOptions.map(month => (
                    <option key={month} value={month}>{month}월</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="text-sm text-muted-foreground mb-1 block">일</label>
                <select
                  value={birthDay}
                  onChange={(e) => setBirthDay(e.target.value)}
                  className="w-full px-3 py-2.5 border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                >
                  <option value="">일</option>
                  {dayOptions.map(day => (
                    <option key={day} value={day}>{day}일</option>
                  ))}
                </select>
              </div>
            </div>

            {/* 태어난 시간 (선택) */}
            <div>
              <label className="text-sm text-muted-foreground mb-1 block">
                태어난 시간 <span className="text-xs">(선택)</span>
              </label>
              <select
                value={birthHour}
                onChange={(e) => setBirthHour(e.target.value)}
                className="w-full px-3 py-2.5 border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
              >
                <option value="">모름 / 선택안함</option>
                {hourOptions.map(hour => (
                  <option key={hour} value={hour}>
                    {hour.toString().padStart(2, '0')}:00 ~ {hour.toString().padStart(2, '0')}:59
                  </option>
                ))}
              </select>
            </div>

            {/* 분석 버튼 */}
            <Button
              onClick={handleAnalyze}
              disabled={!birthYear || !birthMonth || !birthDay}
              className="w-full py-6 text-lg bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600"
            >
              🎭 겉과 속 동물 분석하기
              <ArrowRight className="ml-2 h-5 w-5" />
            </Button>
          </CardContent>
        </Card>

        {/* 안내 */}
        <div className="text-center text-sm text-muted-foreground space-y-1">
          <p>✨ 30초 안에 두 가지 동물을 알려드립니다</p>
          <p>📱 친구와 비교해보세요!</p>
        </div>
      </div>
    </div>
  );
}
