'use client';

import { useState, useEffect } from 'react';
import { useTranslations } from 'next-intl';
import { Link } from '@/i18n/routing';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import {
  Star,
  Sparkles,
  Heart,
  Briefcase,
  Coins,
  Activity,
  ArrowRight,
  Calendar,
  Sun,
  Moon,
  Loader2,
  Info,
  Clock,
  Palette,
  Hash,
  Users,
  CheckCircle,
  AlertCircle,
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

// 별자리 아이콘 컴포넌트
const ZodiacIcon = ({ sign, size = 48 }: { sign: ZodiacSign; size?: number }) => {
  const info = ZODIAC_DATA[sign];
  return (
    <div
      className="flex items-center justify-center rounded-full bg-gradient-to-br from-indigo-500 to-purple-600 text-white font-bold"
      style={{ width: size, height: size, fontSize: size * 0.5 }}
    >
      {info.symbol}
    </div>
  );
};

// 점수 표시 컴포넌트
const ScoreBar = ({ label, score, color }: { label: string; score: number; color: string }) => (
  <div className="space-y-1">
    <div className="flex justify-between text-sm">
      <span>{label}</span>
      <span className="font-bold">{score}점</span>
    </div>
    <div className="h-2 bg-muted rounded-full overflow-hidden">
      <div
        className={`h-full ${color} transition-all duration-500`}
        style={{ width: `${score}%` }}
      />
    </div>
  </div>
);

export default function ZodiacPage() {
  const [step, setStep] = useState<'input' | 'analyzing' | 'result'>('input');
  const [birthDate, setBirthDate] = useState('');
  const [birthDate2, setBirthDate2] = useState('');
  const [mode, setMode] = useState<'single' | 'compatibility'>('single');
  const [analysis, setAnalysis] = useState<ZodiacAnalysis | null>(null);
  const [compatibility, setCompatibility] = useState<ZodiacCompatibility | null>(null);
  const [progress, setProgress] = useState(0);

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
        return prev + 10;
      });
    }, 150);

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
    }, 1800);
  };

  const handleReset = () => {
    setStep('input');
    setBirthDate('');
    setBirthDate2('');
    setAnalysis(null);
    setCompatibility(null);
    setProgress(0);
  };

  // 분석 중 화면
  if (step === 'analyzing') {
    return (
      <div className="container mx-auto px-4 py-16">
        <div className="max-w-md mx-auto text-center">
          <div className="mb-8">
            <div className="w-24 h-24 mx-auto mb-6 rounded-full bg-gradient-to-r from-indigo-500 to-purple-600 flex items-center justify-center animate-pulse">
              <Star className="h-12 w-12 text-white" />
            </div>
            <h2 className="text-2xl font-bold mb-2">별자리 분석 중</h2>
            <p className="text-muted-foreground">
              당신의 별자리 운세를 분석하고 있습니다...
            </p>
          </div>
          <div className="space-y-2">
            <Progress value={progress} className="h-3" />
            <p className="text-sm text-muted-foreground">{progress}% 완료</p>
          </div>
          <div className="mt-8 flex items-center justify-center gap-2 text-sm text-muted-foreground">
            <Loader2 className="h-4 w-4 animate-spin" />
            <span>잠시만 기다려주세요...</span>
          </div>
        </div>
      </div>
    );
  }

  // 결과 화면
  if (step === 'result' && analysis) {
    const { signInfo, personality, dailyFortune } = analysis;

    return (
      <div className="container mx-auto px-4 py-8 md:py-16">
        <div className="max-w-3xl mx-auto">
          {/* Header */}
          <div className="text-center mb-8">
            <Badge className="mb-4 bg-indigo-100 text-indigo-700 dark:bg-indigo-900 dark:text-indigo-300">
              별자리 분석 완료
            </Badge>
            <div className="flex justify-center mb-4">
              <ZodiacIcon sign={analysis.sign} size={80} />
            </div>
            <h1 className="text-3xl font-bold mb-2">
              {signInfo.korean} {signInfo.symbol}
            </h1>
            <p className="text-muted-foreground">{signInfo.dateRange}</p>
          </div>

          <Tabs defaultValue="daily" className="space-y-6">
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="daily">오늘의 운세</TabsTrigger>
              <TabsTrigger value="personality">성격 분석</TabsTrigger>
              <TabsTrigger value="compatibility">궁합</TabsTrigger>
            </TabsList>

            {/* 오늘의 운세 */}
            <TabsContent value="daily" className="space-y-6">
              {/* 종합 점수 */}
              <Card className="bg-gradient-to-r from-indigo-50 to-purple-50 dark:from-indigo-950/20 dark:to-purple-950/20 border-indigo-200">
                <CardContent className="py-8 text-center">
                  <div className="text-6xl font-bold text-indigo-600 mb-2">
                    {dailyFortune.overall}점
                  </div>
                  <p className="text-muted-foreground">오늘의 종합 운세</p>
                  <div className="flex justify-center gap-1 mt-4">
                    {Array.from({ length: 5 }).map((_, i) => (
                      <Star
                        key={i}
                        className={`h-6 w-6 ${
                          i < Math.round(dailyFortune.overall / 20)
                            ? 'text-yellow-400 fill-yellow-400'
                            : 'text-gray-300'
                        }`}
                      />
                    ))}
                  </div>
                </CardContent>
              </Card>

              {/* 세부 운세 */}
              <Card>
                <CardHeader>
                  <CardTitle>세부 운세</CardTitle>
                  <CardDescription>
                    {new Date().toLocaleDateString('ko-KR', {
                      year: 'numeric',
                      month: 'long',
                      day: 'numeric',
                    })}
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <ScoreBar label="애정운" score={dailyFortune.love} color="bg-rose-500" />
                  <ScoreBar label="직장운" score={dailyFortune.career} color="bg-blue-500" />
                  <ScoreBar label="금전운" score={dailyFortune.money} color="bg-emerald-500" />
                  <ScoreBar label="건강운" score={dailyFortune.health} color="bg-orange-500" />
                </CardContent>
              </Card>

              {/* 오늘의 조언 */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Sparkles className="h-5 w-5 text-indigo-500" />
                    오늘의 조언
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-lg leading-relaxed">{dailyFortune.advice}</p>
                </CardContent>
              </Card>

              {/* 행운의 요소 */}
              <Card>
                <CardHeader>
                  <CardTitle>오늘의 행운</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-3 gap-4">
                    <div className="text-center p-4 rounded-lg bg-muted">
                      <Clock className="h-6 w-6 mx-auto mb-2 text-indigo-500" />
                      <div className="text-sm text-muted-foreground">행운의 시간</div>
                      <div className="font-bold">{dailyFortune.luckyTime}</div>
                    </div>
                    <div className="text-center p-4 rounded-lg bg-muted">
                      <Palette className="h-6 w-6 mx-auto mb-2 text-pink-500" />
                      <div className="text-sm text-muted-foreground">행운의 색상</div>
                      <div className="font-bold">{dailyFortune.luckyColor}</div>
                    </div>
                    <div className="text-center p-4 rounded-lg bg-muted">
                      <Hash className="h-6 w-6 mx-auto mb-2 text-emerald-500" />
                      <div className="text-sm text-muted-foreground">행운의 숫자</div>
                      <div className="font-bold">{dailyFortune.luckyNumber}</div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            {/* 성격 분석 */}
            <TabsContent value="personality" className="space-y-6">
              {/* 별자리 정보 */}
              <Card>
                <CardHeader>
                  <CardTitle>별자리 정보</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="p-3 rounded-lg bg-muted">
                      <div className="text-sm text-muted-foreground">원소</div>
                      <div className="font-medium">
                        {signInfo.element === 'fire' && '불 (Fire) 🔥'}
                        {signInfo.element === 'earth' && '땅 (Earth) 🌍'}
                        {signInfo.element === 'air' && '공기 (Air) 💨'}
                        {signInfo.element === 'water' && '물 (Water) 💧'}
                      </div>
                    </div>
                    <div className="p-3 rounded-lg bg-muted">
                      <div className="text-sm text-muted-foreground">특성</div>
                      <div className="font-medium">
                        {signInfo.quality === 'cardinal' && '활동궁'}
                        {signInfo.quality === 'fixed' && '고정궁'}
                        {signInfo.quality === 'mutable' && '변통궁'}
                      </div>
                    </div>
                    <div className="p-3 rounded-lg bg-muted">
                      <div className="text-sm text-muted-foreground">수호 행성</div>
                      <div className="font-medium">{signInfo.rulingPlanet}</div>
                    </div>
                    <div className="p-3 rounded-lg bg-muted">
                      <div className="text-sm text-muted-foreground">행운의 요일</div>
                      <div className="font-medium">{signInfo.luckyDay}</div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* 강점 */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 text-emerald-600">
                    <CheckCircle className="h-5 w-5" />
                    강점
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex flex-wrap gap-2">
                    {personality.strengths.map((strength, i) => (
                      <Badge key={i} variant="secondary" className="bg-emerald-100 text-emerald-700">
                        {strength}
                      </Badge>
                    ))}
                  </div>
                </CardContent>
              </Card>

              {/* 약점 */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 text-amber-600">
                    <AlertCircle className="h-5 w-5" />
                    주의할 점
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex flex-wrap gap-2">
                    {personality.weaknesses.map((weakness, i) => (
                      <Badge key={i} variant="secondary" className="bg-amber-100 text-amber-700">
                        {weakness}
                      </Badge>
                    ))}
                  </div>
                </CardContent>
              </Card>

              {/* 성격 특성 */}
              <Card>
                <CardHeader>
                  <CardTitle>성격 특성</CardTitle>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-2">
                    {personality.traits.map((trait, i) => (
                      <li key={i} className="flex items-start gap-2">
                        <Star className="h-4 w-4 text-indigo-500 mt-1 shrink-0" />
                        <span>{trait}</span>
                      </li>
                    ))}
                  </ul>
                </CardContent>
              </Card>

              {/* 연애 스타일 */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Heart className="h-5 w-5 text-rose-500" />
                    연애 스타일
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="leading-relaxed">{personality.loveStyle}</p>
                </CardContent>
              </Card>

              {/* 업무 스타일 */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Briefcase className="h-5 w-5 text-blue-500" />
                    업무 스타일
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="leading-relaxed">{personality.workStyle}</p>
                </CardContent>
              </Card>
            </TabsContent>

            {/* 궁합 */}
            <TabsContent value="compatibility" className="space-y-6">
              {compatibility ? (
                <>
                  {/* 궁합 점수 */}
                  <Card className="bg-gradient-to-r from-rose-50 to-pink-50 dark:from-rose-950/20 dark:to-pink-950/20 border-rose-200">
                    <CardContent className="py-8 text-center">
                      <div className="flex justify-center items-center gap-4 mb-4">
                        <ZodiacIcon sign={compatibility.sign1} size={60} />
                        <Heart className="h-8 w-8 text-rose-500" />
                        <ZodiacIcon sign={compatibility.sign2} size={60} />
                      </div>
                      <div className="text-5xl font-bold text-rose-600 mb-2">
                        {compatibility.overallScore}점
                      </div>
                      <p className="text-muted-foreground">
                        {ZODIAC_DATA[compatibility.sign1].korean} ♥ {ZODIAC_DATA[compatibility.sign2].korean}
                      </p>
                    </CardContent>
                  </Card>

                  {/* 세부 궁합 */}
                  <Card>
                    <CardHeader>
                      <CardTitle>세부 궁합</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <ScoreBar label="연애 궁합" score={compatibility.loveScore} color="bg-rose-500" />
                      <ScoreBar label="우정 궁합" score={compatibility.friendshipScore} color="bg-blue-500" />
                      <ScoreBar label="업무 궁합" score={compatibility.workScore} color="bg-emerald-500" />
                    </CardContent>
                  </Card>

                  {/* 원소 상호작용 */}
                  <Card>
                    <CardHeader>
                      <CardTitle>원소 상호작용</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <p className="text-lg leading-relaxed">{compatibility.elementInteraction}</p>
                    </CardContent>
                  </Card>

                  {/* 강점 */}
                  <Card>
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2 text-emerald-600">
                        <CheckCircle className="h-5 w-5" />
                        잘 맞는 점
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <ul className="space-y-2">
                        {compatibility.strengths.map((s, i) => (
                          <li key={i} className="flex items-start gap-2">
                            <CheckCircle className="h-4 w-4 text-emerald-500 mt-1" />
                            <span>{s}</span>
                          </li>
                        ))}
                      </ul>
                    </CardContent>
                  </Card>

                  {/* 도전 */}
                  <Card>
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2 text-amber-600">
                        <AlertCircle className="h-5 w-5" />
                        주의할 점
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <ul className="space-y-2">
                        {compatibility.challenges.map((c, i) => (
                          <li key={i} className="flex items-start gap-2">
                            <AlertCircle className="h-4 w-4 text-amber-500 mt-1" />
                            <span>{c}</span>
                          </li>
                        ))}
                      </ul>
                    </CardContent>
                  </Card>

                  {/* 조언 */}
                  <Card>
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2">
                        <Sparkles className="h-5 w-5 text-indigo-500" />
                        궁합 조언
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <p className="text-lg leading-relaxed">{compatibility.advice}</p>
                    </CardContent>
                  </Card>
                </>
              ) : (
                <>
                  {/* 잘 맞는 별자리 */}
                  <Card>
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2 text-emerald-600">
                        <Heart className="h-5 w-5" />
                        잘 맞는 별자리
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="flex flex-wrap gap-3">
                        {analysis.compatibility.bestMatches.map((sign) => (
                          <div key={sign} className="flex items-center gap-2 px-4 py-2 rounded-full bg-emerald-100 dark:bg-emerald-900/30">
                            <span className="text-xl">{ZODIAC_DATA[sign].symbol}</span>
                            <span className="font-medium">{ZODIAC_DATA[sign].korean}</span>
                          </div>
                        ))}
                      </div>
                    </CardContent>
                  </Card>

                  {/* 적당히 맞는 별자리 */}
                  <Card>
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2 text-blue-600">
                        <Users className="h-5 w-5" />
                        적당히 맞는 별자리
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="flex flex-wrap gap-3">
                        {analysis.compatibility.goodMatches.map((sign) => (
                          <div key={sign} className="flex items-center gap-2 px-4 py-2 rounded-full bg-blue-100 dark:bg-blue-900/30">
                            <span className="text-xl">{ZODIAC_DATA[sign].symbol}</span>
                            <span className="font-medium">{ZODIAC_DATA[sign].korean}</span>
                          </div>
                        ))}
                      </div>
                    </CardContent>
                  </Card>

                  {/* 주의가 필요한 별자리 */}
                  <Card>
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2 text-amber-600">
                        <AlertCircle className="h-5 w-5" />
                        노력이 필요한 별자리
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="flex flex-wrap gap-3">
                        {analysis.compatibility.challengingMatches.map((sign) => (
                          <div key={sign} className="flex items-center gap-2 px-4 py-2 rounded-full bg-amber-100 dark:bg-amber-900/30">
                            <span className="text-xl">{ZODIAC_DATA[sign].symbol}</span>
                            <span className="font-medium">{ZODIAC_DATA[sign].korean}</span>
                          </div>
                        ))}
                      </div>
                    </CardContent>
                  </Card>

                  {/* 궁합 분석 유도 */}
                  <Card className="border-dashed">
                    <CardContent className="py-8 text-center">
                      <Heart className="h-12 w-12 mx-auto mb-4 text-rose-400" />
                      <h3 className="font-bold mb-2">상세 궁합 분석</h3>
                      <p className="text-muted-foreground mb-4">
                        특정 사람과의 궁합이 궁금하다면
                        <br />
                        상대방의 생년월일을 입력해보세요
                      </p>
                      <Button
                        variant="outline"
                        onClick={() => {
                          setMode('compatibility');
                          handleReset();
                        }}
                      >
                        궁합 분석하기
                      </Button>
                    </CardContent>
                  </Card>
                </>
              )}
            </TabsContent>
          </Tabs>

          {/* Actions */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center mt-8">
            <Button variant="outline" onClick={handleReset}>
              다시 분석하기
            </Button>
            <Link href="/fortune">
              <Button variant="ghost">
                다른 운세 보기
              </Button>
            </Link>
          </div>
        </div>
      </div>
    );
  }

  // 입력 폼
  return (
    <div className="container mx-auto px-4 py-8 md:py-16">
      <div className="max-w-xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <Badge className="mb-4 bg-indigo-100 text-indigo-700 dark:bg-indigo-900 dark:text-indigo-300">
            <Star className="mr-1 h-3 w-3" />
            별자리 분석
          </Badge>
          <h1 className="text-3xl md:text-4xl font-bold mb-4">별자리 운세</h1>
          <p className="text-muted-foreground">
            생년월일을 입력하면 별자리를 분석하고
            <br />
            오늘의 운세를 확인할 수 있습니다
          </p>
        </div>

        {/* 별자리 모아보기 */}
        <Card className="mb-6">
          <CardHeader>
            <CardTitle className="text-sm">12궁 별자리</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-6 gap-2">
              {Object.values(ZODIAC_DATA).map((info) => (
                <div
                  key={info.sign}
                  className="text-center p-2 rounded-lg hover:bg-muted transition-colors cursor-pointer"
                  title={`${info.korean} (${info.dateRange})`}
                >
                  <div className="text-2xl mb-1">{info.symbol}</div>
                  <div className="text-xs text-muted-foreground">{info.korean}</div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Mode Selection */}
        <Card className="mb-6">
          <CardContent className="py-4">
            <Tabs value={mode} onValueChange={(v) => setMode(v as 'single' | 'compatibility')}>
              <TabsList className="grid w-full grid-cols-2">
                <TabsTrigger value="single">
                  <Star className="mr-2 h-4 w-4" />
                  내 별자리
                </TabsTrigger>
                <TabsTrigger value="compatibility">
                  <Heart className="mr-2 h-4 w-4" />
                  궁합 분석
                </TabsTrigger>
              </TabsList>
            </Tabs>
          </CardContent>
        </Card>

        {/* Form */}
        <Card>
          <CardHeader>
            <CardTitle>생년월일 입력</CardTitle>
            <CardDescription>
              {mode === 'single'
                ? '생년월일을 입력하면 별자리를 분석합니다'
                : '두 사람의 생년월일을 입력하면 궁합을 분석합니다'}
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="birthDate">
                {mode === 'single' ? '생년월일' : '첫 번째 분의 생년월일'}
              </Label>
              <Input
                id="birthDate"
                type="date"
                value={birthDate}
                onChange={(e) => setBirthDate(e.target.value)}
                required
              />
              {birthDate && (
                <p className="text-sm text-muted-foreground">
                  → {ZODIAC_DATA[getZodiacSign(birthDate)].korean} {ZODIAC_DATA[getZodiacSign(birthDate)].symbol}
                </p>
              )}
            </div>

            {mode === 'compatibility' && (
              <div className="space-y-2">
                <Label htmlFor="birthDate2">두 번째 분의 생년월일</Label>
                <Input
                  id="birthDate2"
                  type="date"
                  value={birthDate2}
                  onChange={(e) => setBirthDate2(e.target.value)}
                  required
                />
                {birthDate2 && (
                  <p className="text-sm text-muted-foreground">
                    → {ZODIAC_DATA[getZodiacSign(birthDate2)].korean} {ZODIAC_DATA[getZodiacSign(birthDate2)].symbol}
                  </p>
                )}
              </div>
            )}

            <Button
              className="w-full bg-gradient-to-r from-indigo-500 to-purple-600 hover:from-indigo-600 hover:to-purple-700"
              size="lg"
              onClick={handleAnalyze}
              disabled={!birthDate || (mode === 'compatibility' && !birthDate2)}
            >
              {mode === 'single' ? '별자리 분석하기' : '궁합 분석하기'}
              <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
          </CardContent>
        </Card>

        {/* Info Card */}
        <Card className="mt-6 bg-muted/50">
          <CardContent className="py-4">
            <div className="flex items-start gap-3">
              <Info className="h-5 w-5 text-muted-foreground mt-0.5" />
              <div className="text-sm text-muted-foreground">
                <p className="font-medium mb-1">별자리 운세란?</p>
                <p>
                  태어난 날짜에 따라 12개의 별자리 중 하나에 속하게 됩니다.
                  각 별자리는 고유한 성격 특성과 운세를 가지고 있으며,
                  다른 별자리와의 궁합도 확인할 수 있습니다.
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
