'use client';

import { useState, useRef, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import {
  ArrowRight,
  Share2,
  Download,
  RefreshCw,
  Heart,
  Briefcase,
  Users,
  Sparkles,
  ChevronDown,
  Crown,
  Lock,
} from 'lucide-react';
import { Link } from '@/i18n/routing';
import {
  analyzeAnimalDna,
  AnimalInfo,
  AnimalType,
  ANIMAL_DATABASE,
  calculateAnimalCompatibility,
  FiveElement,
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

const elementBgColors: Record<FiveElement, string> = {
  '木': 'bg-green-50 dark:bg-green-950/30',
  '火': 'bg-red-50 dark:bg-red-950/30',
  '土': 'bg-amber-50 dark:bg-amber-950/30',
  '金': 'bg-gray-50 dark:bg-gray-950/30',
  '水': 'bg-blue-50 dark:bg-blue-950/30',
};

export default function AnimalDnaPage() {
  const [step, setStep] = useState<'input' | 'analyzing' | 'result'>('input');
  const [birthYear, setBirthYear] = useState('');
  const [birthMonth, setBirthMonth] = useState('');
  const [birthDay, setBirthDay] = useState('');
  const [birthHour, setBirthHour] = useState('');
  const [result, setResult] = useState<{
    animal: AnimalInfo;
    mainElement: FiveElement;
    subElement: FiveElement;
    yinYang: 'yang' | 'yin';
    compatibility: AnimalType[];
    incompatibility: AnimalType[];
  } | null>(null);
  const [selectedCompareAnimal, setSelectedCompareAnimal] = useState<AnimalType | null>(null);
  const resultCardRef = useRef<HTMLDivElement>(null);

  // 연도 옵션 생성 (1940-2024)
  const yearOptions = Array.from({ length: 85 }, (_, i) => 2024 - i);
  const monthOptions = Array.from({ length: 12 }, (_, i) => i + 1);
  const dayOptions = Array.from({ length: 31 }, (_, i) => i + 1);
  const hourOptions = Array.from({ length: 24 }, (_, i) => i);

  const handleAnalyze = () => {
    if (!birthYear || !birthMonth || !birthDay) return;

    setStep('analyzing');

    // 분석 애니메이션
    setTimeout(() => {
      const analysisResult = analyzeAnimalDna(
        parseInt(birthYear),
        parseInt(birthMonth),
        parseInt(birthDay),
        birthHour ? parseInt(birthHour) : undefined
      );
      setResult(analysisResult);
      setStep('result');
    }, 2000);
  };

  const handleReset = () => {
    setStep('input');
    setBirthYear('');
    setBirthMonth('');
    setBirthDay('');
    setBirthHour('');
    setResult(null);
    setSelectedCompareAnimal(null);
  };

  const handleShare = async () => {
    if (!result) return;

    const shareData = {
      title: `나의 운명 동물 DNA: ${result.animal.title}`,
      text: `🦊 나는 ${result.animal.title}! ${result.animal.description}\n\n나의 동물 DNA를 확인해보세요!`,
      url: window.location.href,
    };

    if (navigator.share) {
      try {
        await navigator.share(shareData);
      } catch (err) {
        console.log('Share cancelled');
      }
    } else {
      // 클립보드 복사
      await navigator.clipboard.writeText(`${shareData.text}\n${shareData.url}`);
      alert('링크가 복사되었습니다!');
    }
  };

  // 분석 중 화면
  if (step === 'analyzing') {
    return (
      <div className="min-h-screen bg-gradient-to-b from-purple-50 via-pink-50 to-background dark:from-purple-950/20 dark:via-pink-950/10 dark:to-background flex items-center justify-center">
        <div className="text-center space-y-6">
          <div className="relative w-32 h-32 mx-auto">
            <div className="absolute inset-0 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full animate-ping opacity-20" />
            <div className="absolute inset-2 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full animate-pulse" />
            <div className="absolute inset-0 flex items-center justify-center text-6xl animate-bounce">
              🧬
            </div>
          </div>
          <div>
            <h2 className="text-2xl font-bold mb-2">당신의 동물 DNA를 분석 중...</h2>
            <p className="text-muted-foreground">사주 오행을 기반으로 운명의 동물을 찾고 있습니다</p>
          </div>
          <div className="flex justify-center gap-2">
            {['🦊', '🦅', '🐺', '🐉', '🦁'].map((emoji, i) => (
              <span
                key={i}
                className="text-3xl animate-bounce"
                style={{ animationDelay: `${i * 100}ms` }}
              >
                {emoji}
              </span>
            ))}
          </div>
        </div>
      </div>
    );
  }

  // 결과 화면
  if (step === 'result' && result) {
    const compatibilityResult = selectedCompareAnimal
      ? calculateAnimalCompatibility(result.animal.id, selectedCompareAnimal)
      : null;

    return (
      <div className="min-h-screen bg-gradient-to-b from-purple-50 via-pink-50 to-background dark:from-purple-950/20 dark:via-pink-950/10 dark:to-background">
        <div className="container mx-auto px-4 py-8 max-w-2xl">
          {/* 결과 카드 */}
          <div ref={resultCardRef} className="mb-8">
            <Card className={`overflow-hidden border-2 ${elementBgColors[result.mainElement]}`}>
              <CardContent className="p-0">
                {/* 헤더 */}
                <div className={`bg-gradient-to-r ${elementColors[result.mainElement]} p-6 text-white text-center`}>
                  <div className="text-7xl mb-4 animate-bounce" style={{ animationDuration: '2s' }}>
                    {animalEmojis[result.animal.id]}
                  </div>
                  <h1 className="text-3xl font-bold mb-2">{result.animal.title}</h1>
                  <p className="text-white/90">{result.animal.description}</p>
                </div>

                {/* 오행 정보 */}
                <div className="p-6 border-b">
                  <div className="flex justify-center gap-4 text-center">
                    <div>
                      <div className="text-sm text-muted-foreground mb-1">주 오행</div>
                      <div className={`text-2xl font-bold bg-gradient-to-r ${elementColors[result.mainElement]} bg-clip-text text-transparent`}>
                        {result.mainElement}
                      </div>
                    </div>
                    <div className="text-2xl text-muted-foreground">+</div>
                    <div>
                      <div className="text-sm text-muted-foreground mb-1">부 오행</div>
                      <div className={`text-2xl font-bold bg-gradient-to-r ${elementColors[result.subElement]} bg-clip-text text-transparent`}>
                        {result.subElement}
                      </div>
                    </div>
                    <div className="text-2xl text-muted-foreground">=</div>
                    <div>
                      <div className="text-sm text-muted-foreground mb-1">음양</div>
                      <div className="text-2xl font-bold">
                        {result.yinYang === 'yang' ? '☀️ 양' : '🌙 음'}
                      </div>
                    </div>
                  </div>
                </div>

                {/* 성향 그래프 */}
                <div className="p-6 border-b">
                  <h3 className="font-bold mb-4 flex items-center gap-2">
                    <Sparkles className="h-5 w-5 text-purple-500" />
                    성향 분석
                  </h3>
                  <div className="space-y-3">
                    {Object.entries({
                      관찰력: result.animal.traits.observation,
                      적응력: result.animal.traits.adaptability,
                      독립성: result.animal.traits.independence,
                      리더십: result.animal.traits.leadership,
                      창의성: result.animal.traits.creativity,
                      안정성: result.animal.traits.stability,
                    }).map(([name, value]) => (
                      <div key={name} className="flex items-center gap-3">
                        <div className="w-16 text-sm text-muted-foreground">{name}</div>
                        <div className="flex-1 h-3 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
                          <div
                            className={`h-full bg-gradient-to-r ${elementColors[result.mainElement]} rounded-full transition-all duration-1000`}
                            style={{ width: `${value}%` }}
                          />
                        </div>
                        <div className="w-10 text-sm font-medium text-right">{value}%</div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* 강점/약점 */}
                <div className="p-6 border-b grid grid-cols-2 gap-4">
                  <div>
                    <h4 className="font-medium text-green-600 dark:text-green-400 mb-2">💪 강점</h4>
                    <ul className="text-sm space-y-1">
                      {result.animal.strengths.map((s, i) => (
                        <li key={i} className="text-muted-foreground">• {s}</li>
                      ))}
                    </ul>
                  </div>
                  <div>
                    <h4 className="font-medium text-red-600 dark:text-red-400 mb-2">⚠️ 주의점</h4>
                    <ul className="text-sm space-y-1">
                      {result.animal.weaknesses.map((w, i) => (
                        <li key={i} className="text-muted-foreground">• {w}</li>
                      ))}
                    </ul>
                  </div>
                </div>

                {/* 궁합 동물 */}
                <div className="p-6 border-b">
                  <h3 className="font-bold mb-4 flex items-center gap-2">
                    <Heart className="h-5 w-5 text-pink-500" />
                    궁합 동물
                  </h3>
                  <div className="flex gap-3 justify-center mb-4">
                    {result.compatibility.slice(0, 3).map((animalId) => (
                      <div key={animalId} className="text-center">
                        <div className="text-4xl mb-1">{animalEmojis[animalId]}</div>
                        <div className="text-xs text-muted-foreground">
                          {ANIMAL_DATABASE[animalId].name}
                        </div>
                      </div>
                    ))}
                  </div>
                  <div className="text-center text-sm text-muted-foreground">
                    상극: {result.incompatibility.map(id => ANIMAL_DATABASE[id].name).join(', ')}
                  </div>
                </div>

                {/* 적합 직업 & 연애 스타일 */}
                <div className="p-6 grid grid-cols-2 gap-4">
                  <div>
                    <h4 className="font-medium flex items-center gap-1 mb-2">
                      <Briefcase className="h-4 w-4" /> 적합 직업
                    </h4>
                    <div className="flex flex-wrap gap-1">
                      {result.animal.careerFit.map((career, i) => (
                        <span key={i} className="text-xs bg-purple-100 dark:bg-purple-900/30 text-purple-700 dark:text-purple-300 px-2 py-1 rounded-full">
                          {career}
                        </span>
                      ))}
                    </div>
                  </div>
                  <div>
                    <h4 className="font-medium flex items-center gap-1 mb-2">
                      <Heart className="h-4 w-4" /> 연애 스타일
                    </h4>
                    <p className="text-xs text-muted-foreground">{result.animal.loveStyle}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* 공유 버튼 */}
          <div className="flex gap-3 mb-8">
            <Button onClick={handleShare} className="flex-1" variant="outline">
              <Share2 className="h-4 w-4 mr-2" />
              공유하기
            </Button>
            <Button onClick={handleReset} variant="outline">
              <RefreshCw className="h-4 w-4 mr-2" />
              다시하기
            </Button>
          </div>

          {/* 궁합 체크 */}
          <Card className="mb-8">
            <CardContent className="p-6">
              <h3 className="font-bold mb-4 flex items-center gap-2">
                <Users className="h-5 w-5 text-purple-500" />
                다른 동물과 궁합 보기
              </h3>
              <div className="grid grid-cols-4 gap-2 mb-4">
                {Object.entries(animalEmojis).map(([animalId, emoji]) => (
                  <button
                    key={animalId}
                    onClick={() => setSelectedCompareAnimal(animalId as AnimalType)}
                    className={`p-3 rounded-xl text-center transition-all ${
                      selectedCompareAnimal === animalId
                        ? 'bg-purple-100 dark:bg-purple-900/50 ring-2 ring-purple-500'
                        : 'bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700'
                    }`}
                  >
                    <div className="text-2xl">{emoji}</div>
                    <div className="text-[10px] text-muted-foreground mt-1">
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
                      <span className="text-2xl">{animalEmojis[result.animal.id]}</span>
                      <span className="text-muted-foreground">×</span>
                      <span className="text-2xl">{animalEmojis[selectedCompareAnimal]}</span>
                    </div>
                    <div className="text-2xl font-bold">{compatibilityResult.score}점</div>
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
                  <Lock className="h-4 w-4" /> 월간 동물 운세
                </li>
                <li className="flex items-center gap-2">
                  <Lock className="h-4 w-4" /> 궁합 동물 TOP 10 상세 분석
                </li>
                <li className="flex items-center gap-2">
                  <Lock className="h-4 w-4" /> 동물 진화 시스템 (레벨업)
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
            당신의 <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-500 to-pink-500">운명 동물</span>은?
          </h1>
          <p className="text-muted-foreground">
            사주 오행을 기반으로 당신만의 동물 DNA를 분석합니다
          </p>
        </div>

        {/* 동물 프리뷰 */}
        <div className="flex justify-center gap-2 mb-10 flex-wrap">
          {['🦊', '🦅', '🐯', '🐉', '🦁', '🐺', '🐬', '🦢'].map((emoji, i) => (
            <div
              key={i}
              className="w-12 h-12 rounded-full bg-white dark:bg-gray-800 shadow-lg flex items-center justify-center text-2xl animate-bounce"
              style={{ animationDelay: `${i * 100}ms`, animationDuration: '2s' }}
            >
              {emoji}
            </div>
          ))}
        </div>

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
              🧬 내 동물 DNA 분석하기
              <ArrowRight className="ml-2 h-5 w-5" />
            </Button>
          </CardContent>
        </Card>

        {/* 안내 */}
        <div className="text-center text-sm text-muted-foreground">
          <p>✨ 30초 안에 당신의 운명 동물을 알려드립니다</p>
          <p>📱 결과를 친구와 공유해보세요!</p>
        </div>
      </div>
    </div>
  );
}
