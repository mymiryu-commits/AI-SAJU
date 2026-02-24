'use client';

import { useState, useEffect } from 'react';
import { Link } from '@/i18n/routing';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import {
  Star,
  Sparkles,
  Heart,
  Briefcase,
  Coins,
  Activity,
  ArrowRight,
  Moon,
  Loader2,
  Clock,
  Palette,
  Hash,
  Users,
  Flame,
  Wind,
  Droplets,
  Mountain,
  Quote,
  BookOpen,
  Compass,
} from 'lucide-react';
import {
  analyzeZodiac,
  analyzeZodiacCompatibility,
  getZodiacSign,
  ZODIAC_DATA,
  ZodiacSign,
  ZodiacAnalysis,
  ZodiacCompatibility,
} from '@/lib/fortune/zodiac';
import {
  ZODIAC_MYTHOLOGY,
  generateDailyStory,
  generateLoveStory,
  generateMoneyStory,
  generatePersonalityNarrative,
  generateCompatibilityStory,
  generateTodayMessage,
  getFortuneLevel,
} from '@/lib/fortune/zodiac/storytelling';

// 별 애니메이션 배경
const StarryBackground = () => (
  <div className="absolute inset-0 overflow-hidden pointer-events-none">
    {Array.from({ length: 50 }).map((_, i) => (
      <div
        key={i}
        className="absolute w-1 h-1 bg-white rounded-full animate-pulse"
        style={{
          top: `${Math.random() * 100}%`,
          left: `${Math.random() * 100}%`,
          animationDelay: `${Math.random() * 3}s`,
          animationDuration: `${2 + Math.random() * 2}s`,
          opacity: 0.3 + Math.random() * 0.7,
        }}
      />
    ))}
  </div>
);

// 원소 아이콘 컴포넌트
const ElementIcon = ({ element, className = '' }: { element: string; className?: string }) => {
  switch (element) {
    case 'fire':
      return <Flame className={`text-orange-500 ${className}`} />;
    case 'earth':
      return <Mountain className={`text-amber-700 ${className}`} />;
    case 'air':
      return <Wind className={`text-sky-500 ${className}`} />;
    case 'water':
      return <Droplets className={`text-blue-500 ${className}`} />;
    default:
      return <Star className={className} />;
  }
};

// 원형 점수 표시 컴포넌트
const ScoreCircle = ({
  score,
  label,
  icon: Icon,
  color
}: {
  score: number;
  label: string;
  icon: React.ElementType;
  color: string;
}) => {
  const circumference = 2 * Math.PI * 40;
  const offset = circumference - (score / 100) * circumference;

  return (
    <div className="flex flex-col items-center gap-2">
      <div className="relative w-24 h-24">
        <svg className="w-24 h-24 -rotate-90">
          <circle
            cx="48"
            cy="48"
            r="40"
            stroke="currentColor"
            strokeWidth="8"
            fill="none"
            className="text-muted/30"
          />
          <circle
            cx="48"
            cy="48"
            r="40"
            stroke="currentColor"
            strokeWidth="8"
            fill="none"
            strokeDasharray={circumference}
            strokeDashoffset={offset}
            strokeLinecap="round"
            className={`${color} transition-all duration-1000`}
          />
        </svg>
        <div className="absolute inset-0 flex items-center justify-center flex-col">
          <Icon className={`h-5 w-5 ${color.replace('text-', 'text-')}`} />
          <span className="text-lg font-bold">{score}</span>
        </div>
      </div>
      <span className="text-sm text-muted-foreground">{label}</span>
    </div>
  );
};

// 인용구 카드 컴포넌트
const QuoteCard = ({ quote, author }: { quote: string; author?: string }) => (
  <Card className="bg-gradient-to-br from-indigo-50 via-purple-50 to-pink-50 dark:from-indigo-950/30 dark:via-purple-950/30 dark:to-pink-950/30 border-none shadow-lg">
    <CardContent className="py-6">
      <div className="flex gap-4">
        <Quote className="h-8 w-8 text-indigo-400 shrink-0 rotate-180" />
        <div>
          <p className="text-lg leading-relaxed italic text-foreground/80">{quote}</p>
          {author && (
            <p className="mt-3 text-sm text-muted-foreground">— {author}</p>
          )}
        </div>
      </div>
    </CardContent>
  </Card>
);

// 별자리 아이콘 컴포넌트 (크고 화려하게)
const ZodiacHero = ({ sign, info }: { sign: ZodiacSign; info: typeof ZODIAC_DATA[ZodiacSign] }) => {
  const myth = ZODIAC_MYTHOLOGY[sign];

  return (
    <div className="relative py-12 px-4 rounded-3xl bg-gradient-to-br from-indigo-900 via-purple-900 to-slate-900 overflow-hidden">
      <StarryBackground />
      <div className="relative z-10 text-center">
        <div className="mb-4">
          <span className="text-7xl md:text-9xl">{info.symbol}</span>
        </div>
        <h1 className="text-3xl md:text-4xl font-bold text-white mb-2">
          {info.korean}
        </h1>
        <p className="text-indigo-200 mb-4">{info.dateRange}</p>
        <div className="flex justify-center gap-4 text-sm">
          <Badge className="bg-white/20 text-white border-white/30">
            <ElementIcon element={info.element} className="h-3 w-3 mr-1" />
            {info.element === 'fire' ? '불' : info.element === 'earth' ? '땅' : info.element === 'air' ? '공기' : '물'}
          </Badge>
          <Badge className="bg-white/20 text-white border-white/30">
            {myth.deity}
          </Badge>
        </div>
      </div>
    </div>
  );
};

export default function ZodiacPage() {
  const [step, setStep] = useState<'input' | 'analyzing' | 'result'>('input');
  const [birthDate, setBirthDate] = useState('');
  const [birthDate2, setBirthDate2] = useState('');
  const [mode, setMode] = useState<'single' | 'compatibility'>('single');
  const [analysis, setAnalysis] = useState<ZodiacAnalysis | null>(null);
  const [compatibility, setCompatibility] = useState<ZodiacCompatibility | null>(null);
  const [progress, setProgress] = useState(0);
  const [revealedSections, setRevealedSections] = useState<number>(0);

  // 순차적 섹션 공개 효과
  useEffect(() => {
    if (step === 'result') {
      const timer = setInterval(() => {
        setRevealedSections((prev) => {
          if (prev >= 10) {
            clearInterval(timer);
            return prev;
          }
          return prev + 1;
        });
      }, 200);
      return () => clearInterval(timer);
    } else {
      setRevealedSections(0);
    }
  }, [step]);

  const handleAnalyze = () => {
    if (!birthDate) return;

    setStep('analyzing');
    setProgress(0);

    const interval = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 100) {
          clearInterval(interval);
          return 100;
        }
        return prev + 5;
      });
    }, 100);

    setTimeout(() => {
      clearInterval(interval);

      if (mode === 'single') {
        const result = analyzeZodiac(birthDate);
        setAnalysis(result);
      } else {
        const result = analyzeZodiac(birthDate);
        setAnalysis(result);
        if (birthDate2) {
          const compatResult = analyzeZodiacCompatibility(birthDate, birthDate2);
          setCompatibility(compatResult);
        }
      }

      setStep('result');
    }, 2200);
  };

  const handleReset = () => {
    setStep('input');
    setBirthDate('');
    setBirthDate2('');
    setAnalysis(null);
    setCompatibility(null);
    setProgress(0);
    setRevealedSections(0);
  };

  // 분석 중 화면 - 더 몰입감 있게
  if (step === 'analyzing') {
    const analyzingMessages = [
      '별들의 위치를 확인하고 있습니다...',
      '당신의 별자리를 찾고 있습니다...',
      '수호성의 메시지를 해독하고 있습니다...',
      '신화 속 이야기를 불러오고 있습니다...',
      '운명의 실타래를 풀고 있습니다...',
    ];
    const messageIndex = Math.min(Math.floor(progress / 20), 4);

    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-indigo-950 via-purple-950 to-slate-950">
        <StarryBackground />
        <div className="relative z-10 max-w-md mx-auto text-center px-4">
          <div className="mb-8">
            <div className="w-32 h-32 mx-auto mb-6 rounded-full bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 flex items-center justify-center animate-spin-slow relative">
              <div className="absolute inset-2 rounded-full bg-indigo-950 flex items-center justify-center">
                <Star className="h-12 w-12 text-white animate-pulse" />
              </div>
            </div>
            <h2 className="text-2xl font-bold text-white mb-4">별자리를 읽는 중...</h2>
            <p className="text-indigo-200 h-6 transition-all duration-300">
              {analyzingMessages[messageIndex]}
            </p>
          </div>
          <div className="space-y-3">
            <div className="h-2 bg-white/10 rounded-full overflow-hidden">
              <div
                className="h-full bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 transition-all duration-300"
                style={{ width: `${progress}%` }}
              />
            </div>
            <p className="text-sm text-indigo-300">{progress}% 완료</p>
          </div>
        </div>
      </div>
    );
  }

  // 결과 화면 - 스토리텔링 중심
  if (step === 'result' && analysis) {
    const { signInfo, personality, dailyFortune } = analysis;
    const myth = ZODIAC_MYTHOLOGY[analysis.sign];
    const fortuneLevel = getFortuneLevel(dailyFortune.overall);

    return (
      <div className="min-h-screen bg-gradient-to-b from-slate-50 to-white dark:from-slate-950 dark:to-slate-900">
        <div className="container mx-auto px-4 py-8 md:py-12">
          <div className="max-w-3xl mx-auto space-y-8">
            {/* Hero Section */}
            <div
              className={`transform transition-all duration-700 ${revealedSections >= 1 ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}
            >
              <ZodiacHero sign={analysis.sign} info={signInfo} />
            </div>

            {/* 오늘의 메시지 */}
            <div
              className={`transform transition-all duration-700 ${revealedSections >= 2 ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}
            >
              <QuoteCard quote={generateTodayMessage(analysis.sign)} author={myth.deity} />
            </div>

            <Tabs defaultValue="today" className="space-y-6">
              <TabsList className="grid w-full grid-cols-4 h-14">
                <TabsTrigger value="today" className="flex flex-col gap-1 h-full">
                  <Sparkles className="h-4 w-4" />
                  <span className="text-xs">오늘</span>
                </TabsTrigger>
                <TabsTrigger value="story" className="flex flex-col gap-1 h-full">
                  <BookOpen className="h-4 w-4" />
                  <span className="text-xs">이야기</span>
                </TabsTrigger>
                <TabsTrigger value="destiny" className="flex flex-col gap-1 h-full">
                  <Compass className="h-4 w-4" />
                  <span className="text-xs">운명</span>
                </TabsTrigger>
                <TabsTrigger value="love" className="flex flex-col gap-1 h-full">
                  <Heart className="h-4 w-4" />
                  <span className="text-xs">인연</span>
                </TabsTrigger>
              </TabsList>

              {/* 오늘의 운세 탭 */}
              <TabsContent value="today" className="space-y-6">
                {/* 오늘의 스토리 */}
                <Card
                  className={`transform transition-all duration-700 ${revealedSections >= 3 ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}
                >
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Sparkles className="h-5 w-5 text-indigo-500" />
                      오늘의 별자리 메시지
                    </CardTitle>
                    <CardDescription>
                      {new Date().toLocaleDateString('ko-KR', {
                        year: 'numeric',
                        month: 'long',
                        day: 'numeric',
                        weekday: 'long',
                      })}
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <p className="text-lg leading-relaxed">
                      {generateDailyStory(analysis.sign, dailyFortune.overall)}
                    </p>
                  </CardContent>
                </Card>

                {/* 운세 점수 */}
                <Card
                  className={`transform transition-all duration-700 ${revealedSections >= 4 ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}
                >
                  <CardHeader>
                    <CardTitle>오늘의 운세 흐름</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                      <ScoreCircle score={dailyFortune.love} label="애정운" icon={Heart} color="text-rose-500" />
                      <ScoreCircle score={dailyFortune.career} label="직장운" icon={Briefcase} color="text-blue-500" />
                      <ScoreCircle score={dailyFortune.money} label="금전운" icon={Coins} color="text-emerald-500" />
                      <ScoreCircle score={dailyFortune.health} label="건강운" icon={Activity} color="text-orange-500" />
                    </div>
                  </CardContent>
                </Card>

                {/* 사랑과 재물 스토리 */}
                <div className="grid md:grid-cols-2 gap-4">
                  <Card
                    className={`transform transition-all duration-700 ${revealedSections >= 5 ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}
                  >
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2 text-rose-600">
                        <Heart className="h-5 w-5" />
                        사랑의 별빛
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <p className="text-sm leading-relaxed text-muted-foreground">
                        {generateLoveStory(dailyFortune.love)}
                      </p>
                    </CardContent>
                  </Card>

                  <Card
                    className={`transform transition-all duration-700 delay-100 ${revealedSections >= 5 ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}
                  >
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2 text-emerald-600">
                        <Coins className="h-5 w-5" />
                        풍요의 흐름
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <p className="text-sm leading-relaxed text-muted-foreground">
                        {generateMoneyStory(dailyFortune.money)}
                      </p>
                    </CardContent>
                  </Card>
                </div>

                {/* 행운의 요소 */}
                <Card
                  className={`transform transition-all duration-700 ${revealedSections >= 6 ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}
                >
                  <CardHeader>
                    <CardTitle>오늘의 행운 열쇠</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-3 gap-4">
                      <div className="text-center p-4 rounded-xl bg-gradient-to-br from-indigo-50 to-purple-50 dark:from-indigo-950/30 dark:to-purple-950/30">
                        <Clock className="h-8 w-8 mx-auto mb-2 text-indigo-500" />
                        <div className="text-xs text-muted-foreground mb-1">행운의 시간</div>
                        <div className="font-bold text-lg">{dailyFortune.luckyTime}</div>
                      </div>
                      <div className="text-center p-4 rounded-xl bg-gradient-to-br from-pink-50 to-rose-50 dark:from-pink-950/30 dark:to-rose-950/30">
                        <Palette className="h-8 w-8 mx-auto mb-2 text-pink-500" />
                        <div className="text-xs text-muted-foreground mb-1">행운의 색상</div>
                        <div className="font-bold text-lg">{dailyFortune.luckyColor}</div>
                      </div>
                      <div className="text-center p-4 rounded-xl bg-gradient-to-br from-emerald-50 to-teal-50 dark:from-emerald-950/30 dark:to-teal-950/30">
                        <Hash className="h-8 w-8 mx-auto mb-2 text-emerald-500" />
                        <div className="text-xs text-muted-foreground mb-1">행운의 숫자</div>
                        <div className="font-bold text-lg">{dailyFortune.luckyNumber}</div>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                {/* 오늘의 조언 */}
                <Card
                  className={`border-indigo-200 dark:border-indigo-800 transform transition-all duration-700 ${revealedSections >= 7 ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}
                >
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Sparkles className="h-5 w-5 text-indigo-500" />
                      별들의 조언
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-lg leading-relaxed font-medium">{dailyFortune.advice}</p>
                  </CardContent>
                </Card>
              </TabsContent>

              {/* 신화 이야기 탭 */}
              <TabsContent value="story" className="space-y-6">
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <BookOpen className="h-5 w-5 text-indigo-500" />
                      {myth.title}
                    </CardTitle>
                    <CardDescription>당신의 별자리에 담긴 신화</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <p className="text-lg leading-relaxed mb-6">{myth.story}</p>
                    <div className="p-4 rounded-xl bg-gradient-to-r from-indigo-50 to-purple-50 dark:from-indigo-950/30 dark:to-purple-950/30">
                      <p className="text-sm text-muted-foreground mb-2">수호신의 축복</p>
                      <p className="font-medium">{myth.blessing}</p>
                    </div>
                  </CardContent>
                </Card>

                <QuoteCard quote={myth.destinyPath} author={myth.deity} />

                <Card>
                  <CardHeader>
                    <CardTitle>당신의 별자리 정보</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-2 gap-4">
                      <div className="p-4 rounded-xl bg-muted/50">
                        <div className="flex items-center gap-2 mb-2">
                          <ElementIcon element={signInfo.element} className="h-5 w-5" />
                          <span className="text-sm text-muted-foreground">원소</span>
                        </div>
                        <div className="font-medium">
                          {signInfo.element === 'fire' && '불 (Fire) 🔥'}
                          {signInfo.element === 'earth' && '땅 (Earth) 🌍'}
                          {signInfo.element === 'air' && '공기 (Air) 💨'}
                          {signInfo.element === 'water' && '물 (Water) 💧'}
                        </div>
                      </div>
                      <div className="p-4 rounded-xl bg-muted/50">
                        <div className="flex items-center gap-2 mb-2">
                          <Star className="h-5 w-5 text-yellow-500" />
                          <span className="text-sm text-muted-foreground">특성</span>
                        </div>
                        <div className="font-medium">
                          {signInfo.quality === 'cardinal' && '활동궁 (Cardinal)'}
                          {signInfo.quality === 'fixed' && '고정궁 (Fixed)'}
                          {signInfo.quality === 'mutable' && '변통궁 (Mutable)'}
                        </div>
                      </div>
                      <div className="p-4 rounded-xl bg-muted/50">
                        <div className="flex items-center gap-2 mb-2">
                          <Moon className="h-5 w-5 text-slate-500" />
                          <span className="text-sm text-muted-foreground">수호 행성</span>
                        </div>
                        <div className="font-medium">{signInfo.rulingPlanet}</div>
                      </div>
                      <div className="p-4 rounded-xl bg-muted/50">
                        <div className="flex items-center gap-2 mb-2">
                          <Sparkles className="h-5 w-5 text-indigo-500" />
                          <span className="text-sm text-muted-foreground">행운의 요일</span>
                        </div>
                        <div className="font-medium">{signInfo.luckyDay}</div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>

              {/* 운명 & 성격 탭 */}
              <TabsContent value="destiny" className="space-y-6">
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Compass className="h-5 w-5 text-indigo-500" />
                      당신의 운명 이야기
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="prose prose-indigo dark:prose-invert max-w-none">
                      {generatePersonalityNarrative(analysis.sign).split('\n\n').map((paragraph, i) => (
                        <p key={i} className="text-lg leading-relaxed mb-4">{paragraph}</p>
                      ))}
                    </div>
                  </CardContent>
                </Card>

                {/* 강점 */}
                <Card>
                  <CardHeader>
                    <CardTitle className="text-emerald-600">✨ 빛나는 재능</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="flex flex-wrap gap-2">
                      {personality.strengths.map((strength, i) => (
                        <Badge key={i} className="bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-300 px-3 py-1">
                          {strength}
                        </Badge>
                      ))}
                    </div>
                  </CardContent>
                </Card>

                {/* 성격 특성 */}
                <Card>
                  <CardHeader>
                    <CardTitle>당신만의 특별함</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <ul className="space-y-3">
                      {personality.traits.map((trait, i) => (
                        <li key={i} className="flex items-start gap-3">
                          <Star className="h-5 w-5 text-indigo-500 mt-0.5 shrink-0" />
                          <span className="text-lg">{trait}</span>
                        </li>
                      ))}
                    </ul>
                  </CardContent>
                </Card>

                {/* 연애 & 업무 스타일 */}
                <div className="grid md:grid-cols-2 gap-4">
                  <Card>
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2 text-rose-600">
                        <Heart className="h-5 w-5" />
                        사랑의 방식
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <p className="leading-relaxed">{personality.loveStyle}</p>
                    </CardContent>
                  </Card>

                  <Card>
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2 text-blue-600">
                        <Briefcase className="h-5 w-5" />
                        일의 방식
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <p className="leading-relaxed">{personality.workStyle}</p>
                    </CardContent>
                  </Card>
                </div>
              </TabsContent>

              {/* 인연 & 궁합 탭 */}
              <TabsContent value="love" className="space-y-6">
                {compatibility ? (
                  <>
                    {/* 궁합 스토리 */}
                    <Card className="bg-gradient-to-r from-rose-50 to-pink-50 dark:from-rose-950/20 dark:to-pink-950/20 border-rose-200">
                      <CardContent className="py-8">
                        <div className="flex justify-center items-center gap-4 mb-6">
                          <div className="text-center">
                            <div className="text-5xl mb-2">{ZODIAC_DATA[compatibility.sign1].symbol}</div>
                            <span className="text-sm">{ZODIAC_DATA[compatibility.sign1].korean}</span>
                          </div>
                          <Heart className="h-10 w-10 text-rose-500 animate-pulse" />
                          <div className="text-center">
                            <div className="text-5xl mb-2">{ZODIAC_DATA[compatibility.sign2].symbol}</div>
                            <span className="text-sm">{ZODIAC_DATA[compatibility.sign2].korean}</span>
                          </div>
                        </div>
                        <div className="text-center">
                          <div className="text-5xl font-bold text-rose-600 mb-2">
                            {compatibility.overallScore}점
                          </div>
                          <p className="text-muted-foreground">두 별자리의 인연 점수</p>
                        </div>
                      </CardContent>
                    </Card>

                    {/* 궁합 이야기 */}
                    <Card>
                      <CardHeader>
                        <CardTitle>인연의 이야기</CardTitle>
                      </CardHeader>
                      <CardContent>
                        <div className="prose prose-rose dark:prose-invert max-w-none">
                          {generateCompatibilityStory(compatibility.sign1, compatibility.sign2, compatibility.overallScore)
                            .split('\n\n')
                            .map((paragraph, i) => (
                              <p key={i} className="text-lg leading-relaxed mb-4">{paragraph}</p>
                            ))}
                        </div>
                      </CardContent>
                    </Card>

                    {/* 세부 궁합 점수 */}
                    <Card>
                      <CardHeader>
                        <CardTitle>궁합의 빛깔</CardTitle>
                      </CardHeader>
                      <CardContent>
                        <div className="grid grid-cols-3 gap-4">
                          <ScoreCircle score={compatibility.loveScore} label="사랑" icon={Heart} color="text-rose-500" />
                          <ScoreCircle score={compatibility.friendshipScore} label="우정" icon={Users} color="text-blue-500" />
                          <ScoreCircle score={compatibility.workScore} label="협력" icon={Briefcase} color="text-emerald-500" />
                        </div>
                      </CardContent>
                    </Card>

                    {/* 조언 */}
                    <QuoteCard quote={compatibility.advice} author="별들의 속삭임" />
                  </>
                ) : (
                  <>
                    {/* 잘 맞는 별자리 */}
                    <Card>
                      <CardHeader>
                        <CardTitle className="flex items-center gap-2 text-emerald-600">
                          <Heart className="h-5 w-5" />
                          운명적 인연의 별자리
                        </CardTitle>
                        <CardDescription>당신과 가장 잘 어울리는 별자리들</CardDescription>
                      </CardHeader>
                      <CardContent>
                        <div className="flex flex-wrap gap-3">
                          {analysis.compatibility.bestMatches.map((sign) => (
                            <div
                              key={sign}
                              className="flex items-center gap-2 px-4 py-3 rounded-full bg-gradient-to-r from-emerald-100 to-teal-100 dark:from-emerald-900/30 dark:to-teal-900/30"
                            >
                              <span className="text-2xl">{ZODIAC_DATA[sign].symbol}</span>
                              <span className="font-medium">{ZODIAC_DATA[sign].korean}</span>
                            </div>
                          ))}
                        </div>
                      </CardContent>
                    </Card>

                    {/* 좋은 궁합 */}
                    <Card>
                      <CardHeader>
                        <CardTitle className="flex items-center gap-2 text-blue-600">
                          <Users className="h-5 w-5" />
                          좋은 인연의 별자리
                        </CardTitle>
                      </CardHeader>
                      <CardContent>
                        <div className="flex flex-wrap gap-3">
                          {analysis.compatibility.goodMatches.map((sign) => (
                            <div
                              key={sign}
                              className="flex items-center gap-2 px-4 py-3 rounded-full bg-gradient-to-r from-blue-100 to-indigo-100 dark:from-blue-900/30 dark:to-indigo-900/30"
                            >
                              <span className="text-2xl">{ZODIAC_DATA[sign].symbol}</span>
                              <span className="font-medium">{ZODIAC_DATA[sign].korean}</span>
                            </div>
                          ))}
                        </div>
                      </CardContent>
                    </Card>

                    {/* 도전적 궁합 */}
                    <Card>
                      <CardHeader>
                        <CardTitle className="flex items-center gap-2 text-amber-600">
                          <Sparkles className="h-5 w-5" />
                          성장을 주는 별자리
                        </CardTitle>
                        <CardDescription>도전적이지만 함께하면 더 성장할 수 있는 관계</CardDescription>
                      </CardHeader>
                      <CardContent>
                        <div className="flex flex-wrap gap-3">
                          {analysis.compatibility.challengingMatches.map((sign) => (
                            <div
                              key={sign}
                              className="flex items-center gap-2 px-4 py-3 rounded-full bg-gradient-to-r from-amber-100 to-orange-100 dark:from-amber-900/30 dark:to-orange-900/30"
                            >
                              <span className="text-2xl">{ZODIAC_DATA[sign].symbol}</span>
                              <span className="font-medium">{ZODIAC_DATA[sign].korean}</span>
                            </div>
                          ))}
                        </div>
                      </CardContent>
                    </Card>

                    {/* 상세 궁합 분석 유도 */}
                    <Card className="border-dashed border-rose-300 dark:border-rose-800">
                      <CardContent className="py-8 text-center">
                        <Heart className="h-16 w-16 mx-auto mb-4 text-rose-400" />
                        <h3 className="text-xl font-bold mb-2">특별한 인연 분석</h3>
                        <p className="text-muted-foreground mb-6">
                          특정 사람과의 운명적 인연이 궁금하시다면
                          <br />
                          상대방의 생년월일로 상세한 궁합을 확인해보세요
                        </p>
                        <Button
                          variant="outline"
                          className="border-rose-300 text-rose-600 hover:bg-rose-50"
                          onClick={() => {
                            setMode('compatibility');
                            handleReset();
                          }}
                        >
                          <Heart className="mr-2 h-4 w-4" />
                          인연 분석하기
                        </Button>
                      </CardContent>
                    </Card>
                  </>
                )}
              </TabsContent>
            </Tabs>

            {/* Actions */}
            <div className="flex flex-col sm:flex-row gap-4 justify-center pt-4">
              <Button variant="outline" onClick={handleReset} size="lg">
                다시 분석하기
              </Button>
              <Link href="/fortune">
                <Button variant="ghost" size="lg">
                  다른 운세 보기
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // 입력 폼 - 더 몰입감 있게
  return (
    <div className="min-h-screen bg-gradient-to-b from-indigo-950 via-purple-950 to-slate-950">
      <StarryBackground />
      <div className="container mx-auto px-4 py-8 md:py-16 relative z-10">
        <div className="max-w-xl mx-auto">
          {/* Header */}
          <div className="text-center mb-8">
            <Badge className="mb-4 bg-white/10 text-white border-white/20">
              <Star className="mr-1 h-3 w-3" />
              별자리 분석
            </Badge>
            <h1 className="text-3xl md:text-5xl font-bold text-white mb-4">
              별이 들려주는<br />당신의 이야기
            </h1>
            <p className="text-indigo-200">
              수천 년 전부터 별들은 인간의 운명을 속삭여왔습니다
              <br />
              당신의 별자리가 전하는 메시지를 들어보세요
            </p>
          </div>

          {/* 12궁 별자리 */}
          <Card className="mb-6 bg-white/10 border-white/20 backdrop-blur-sm">
            <CardHeader>
              <CardTitle className="text-sm text-white/80">12궁의 별자리</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-6 gap-2">
                {Object.values(ZODIAC_DATA).map((info) => (
                  <div
                    key={info.sign}
                    className="text-center p-2 rounded-lg hover:bg-white/10 transition-colors cursor-pointer group"
                    title={`${info.korean} (${info.dateRange})`}
                  >
                    <div className="text-2xl mb-1 group-hover:scale-125 transition-transform">{info.symbol}</div>
                    <div className="text-xs text-white/60">{info.korean}</div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Mode Selection */}
          <Card className="mb-6 bg-white/10 border-white/20 backdrop-blur-sm">
            <CardContent className="py-4">
              <Tabs value={mode} onValueChange={(v) => setMode(v as 'single' | 'compatibility')}>
                <TabsList className="grid w-full grid-cols-2 bg-white/10">
                  <TabsTrigger value="single" className="data-[state=active]:bg-white/20 text-white">
                    <Star className="mr-2 h-4 w-4" />
                    내 별자리
                  </TabsTrigger>
                  <TabsTrigger value="compatibility" className="data-[state=active]:bg-white/20 text-white">
                    <Heart className="mr-2 h-4 w-4" />
                    인연 분석
                  </TabsTrigger>
                </TabsList>
              </Tabs>
            </CardContent>
          </Card>

          {/* Form */}
          <Card className="bg-white/10 border-white/20 backdrop-blur-sm">
            <CardHeader>
              <CardTitle className="text-white">생년월일 입력</CardTitle>
              <CardDescription className="text-white/60">
                {mode === 'single'
                  ? '당신이 태어난 날, 별들의 배열을 확인합니다'
                  : '두 영혼이 만난 별자리의 인연을 확인합니다'}
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="birthDate" className="text-white/80">
                  {mode === 'single' ? '생년월일' : '첫 번째 분의 생년월일'}
                </Label>
                <Input
                  id="birthDate"
                  type="date"
                  value={birthDate}
                  onChange={(e) => setBirthDate(e.target.value)}
                  required
                  className="bg-white/10 border-white/20 text-white"
                />
                {birthDate && (
                  <p className="text-sm text-indigo-300 flex items-center gap-2">
                    <span className="text-xl">{ZODIAC_DATA[getZodiacSign(birthDate)].symbol}</span>
                    {ZODIAC_DATA[getZodiacSign(birthDate)].korean}의 별 아래 태어나셨군요
                  </p>
                )}
              </div>

              {mode === 'compatibility' && (
                <div className="space-y-2">
                  <Label htmlFor="birthDate2" className="text-white/80">두 번째 분의 생년월일</Label>
                  <Input
                    id="birthDate2"
                    type="date"
                    value={birthDate2}
                    onChange={(e) => setBirthDate2(e.target.value)}
                    required
                    className="bg-white/10 border-white/20 text-white"
                  />
                  {birthDate2 && (
                    <p className="text-sm text-indigo-300 flex items-center gap-2">
                      <span className="text-xl">{ZODIAC_DATA[getZodiacSign(birthDate2)].symbol}</span>
                      {ZODIAC_DATA[getZodiacSign(birthDate2)].korean}의 별 아래 태어나셨군요
                    </p>
                  )}
                </div>
              )}

              <Button
                className="w-full bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 hover:from-indigo-600 hover:via-purple-600 hover:to-pink-600 text-white shadow-lg shadow-purple-500/25"
                size="lg"
                onClick={handleAnalyze}
                disabled={!birthDate || (mode === 'compatibility' && !birthDate2)}
              >
                {mode === 'single' ? '별자리 이야기 듣기' : '인연의 이야기 듣기'}
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </CardContent>
          </Card>

          {/* Info Card */}
          <Card className="mt-6 bg-white/5 border-white/10 backdrop-blur-sm">
            <CardContent className="py-4">
              <div className="flex items-start gap-3">
                <BookOpen className="h-5 w-5 text-indigo-300 mt-0.5" />
                <div className="text-sm text-white/60">
                  <p className="font-medium mb-1 text-white/80">별자리와 신화</p>
                  <p>
                    고대 그리스인들은 밤하늘의 별자리에 신들의 이야기를 담았습니다.
                    당신의 별자리에 담긴 신화 속 영웅과 신들의 축복을 만나보세요.
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
