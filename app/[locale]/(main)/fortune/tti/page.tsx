'use client';

import { useState, useEffect } from 'react';
import { Link } from '@/i18n/routing';
import { Button } from '@/components/ui/button';
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
  ArrowLeft,
  Clock,
  Palette,
  Hash,
  Compass,
  Calendar,
  Trophy,
  Crown,
  ChevronRight,
} from 'lucide-react';
import {
  CHINESE_ZODIAC,
  ChineseZodiacSign,
  getChineseZodiac,
  generateDailyZodiacFortune,
  getTodayZodiacRanking,
} from '@/lib/fortune/chineseZodiac';

// 띠 아이콘 매핑
const zodiacIcons: Record<ChineseZodiacSign, string> = {
  rat: '🐀',
  ox: '🐂',
  tiger: '🐅',
  rabbit: '🐇',
  dragon: '🐉',
  snake: '🐍',
  horse: '🐎',
  sheep: '🐑',
  monkey: '🐵',
  rooster: '🐓',
  dog: '🐕',
  pig: '🐷',
};

const zodiacOrder: ChineseZodiacSign[] = [
  'rat', 'ox', 'tiger', 'rabbit', 'dragon', 'snake',
  'horse', 'sheep', 'monkey', 'rooster', 'dog', 'pig'
];

export default function ChineseZodiacFortunePage() {
  const [selectedSign, setSelectedSign] = useState<ChineseZodiacSign | null>(null);
  const [birthYear, setBirthYear] = useState<string>('');
  const [fortune, setFortune] = useState<ReturnType<typeof generateDailyZodiacFortune> | null>(null);
  const [ranking, setRanking] = useState<ReturnType<typeof getTodayZodiacRanking>>([]);
  const [currentDate, setCurrentDate] = useState(new Date());

  useEffect(() => {
    // 오늘의 띠별 순위 가져오기
    setRanking(getTodayZodiacRanking(new Date()));
  }, []);

  const handleYearInput = (year: string) => {
    setBirthYear(year);
    if (year.length === 4) {
      const yearNum = parseInt(year, 10);
      if (yearNum >= 1920 && yearNum <= 2024) {
        const sign = getChineseZodiac(yearNum);
        setSelectedSign(sign);
        setFortune(generateDailyZodiacFortune(sign, new Date()));
      }
    }
  };

  const handleSignSelect = (sign: ChineseZodiacSign) => {
    setSelectedSign(sign);
    setFortune(generateDailyZodiacFortune(sign, new Date()));
  };

  const handleBack = () => {
    setSelectedSign(null);
    setFortune(null);
    setBirthYear('');
  };

  // 결과 화면
  if (selectedSign && fortune) {
    const signData = CHINESE_ZODIAC[selectedSign];
    const myRank = ranking.find(r => r.sign === selectedSign);

    return (
      <div className="min-h-screen bg-gradient-to-b from-amber-50 to-orange-50 dark:from-amber-950/20 dark:to-orange-950/20">
        <div className="container mx-auto px-4 py-8">
          <div className="max-w-3xl mx-auto">
            {/* 뒤로가기 */}
            <Button variant="ghost" onClick={handleBack} className="mb-6">
              <ArrowLeft className="mr-2 h-4 w-4" />
              다른 띠 보기
            </Button>

            {/* 헤더 카드 */}
            <Card className="mb-6 overflow-hidden">
              <div className="bg-gradient-to-r from-amber-500 via-orange-500 to-red-500 p-8 text-white text-center relative overflow-hidden">
                {/* 배경 패턴 */}
                <div className="absolute inset-0 opacity-10">
                  {Array.from({ length: 20 }).map((_, i) => (
                    <span
                      key={i}
                      className="absolute text-6xl"
                      style={{
                        left: `${(i % 5) * 25}%`,
                        top: `${Math.floor(i / 5) * 30}%`,
                        transform: 'rotate(-15deg)',
                      }}
                    >
                      {zodiacIcons[selectedSign]}
                    </span>
                  ))}
                </div>

                <div className="relative z-10">
                  <div className="text-8xl mb-4">{zodiacIcons[selectedSign]}</div>
                  <h1 className="text-3xl font-bold mb-2">{signData.name}띠</h1>
                  <p className="text-amber-100 mb-4">{signData.korean}</p>

                  {myRank && (
                    <Badge className="bg-white/20 text-white border-white/30 text-lg px-4 py-2">
                      <Trophy className="mr-2 h-4 w-4" />
                      오늘 {myRank.rank}위
                    </Badge>
                  )}
                </div>
              </div>

              <CardContent className="p-6">
                <div className="text-center mb-6">
                  <div className="flex items-center justify-center gap-2 text-muted-foreground mb-2">
                    <Calendar className="h-4 w-4" />
                    <span>{currentDate.toLocaleDateString('ko-KR', { year: 'numeric', month: 'long', day: 'numeric', weekday: 'long' })}</span>
                  </div>
                  <p className="text-lg">{fortune.advice}</p>
                </div>

                {/* 종합 점수 */}
                <div className="grid grid-cols-5 gap-2 md:gap-4">
                  {[
                    { key: 'overall', label: '종합', score: fortune.scores.overall, icon: Star, color: 'text-amber-500' },
                    { key: 'wealth', label: '재물', score: fortune.scores.wealth, icon: Coins, color: 'text-emerald-500' },
                    { key: 'love', label: '애정', score: fortune.scores.love, icon: Heart, color: 'text-rose-500' },
                    { key: 'career', label: '직장', score: fortune.scores.career, icon: Briefcase, color: 'text-blue-500' },
                    { key: 'health', label: '건강', score: fortune.scores.health, icon: Activity, color: 'text-green-500' },
                  ].map((item) => {
                    const Icon = item.icon;
                    return (
                      <div key={item.key} className="text-center">
                        <div className={`text-2xl md:text-3xl font-bold ${item.color}`}>
                          {item.score}
                        </div>
                        <div className="text-xs text-muted-foreground flex items-center justify-center gap-1">
                          <Icon className="h-3 w-3" />
                          {item.label}
                        </div>
                        <Progress value={item.score} className="h-1 mt-1" />
                      </div>
                    );
                  })}
                </div>
              </CardContent>
            </Card>

            {/* 상세 운세 탭 */}
            <Tabs defaultValue="fortune" className="space-y-4">
              <TabsList className="grid w-full grid-cols-3">
                <TabsTrigger value="fortune">오늘의 운세</TabsTrigger>
                <TabsTrigger value="lucky">행운 요소</TabsTrigger>
                <TabsTrigger value="info">띠 정보</TabsTrigger>
              </TabsList>

              {/* 오늘의 운세 */}
              <TabsContent value="fortune" className="space-y-4">
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Sparkles className="h-5 w-5 text-amber-500" />
                      상세 운세
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    {[
                      { label: '종합운', text: fortune.fortune.overall, icon: Star, color: 'bg-amber-100 dark:bg-amber-900/30' },
                      { label: '재물운', text: fortune.fortune.wealth, icon: Coins, color: 'bg-emerald-100 dark:bg-emerald-900/30' },
                      { label: '애정운', text: fortune.fortune.love, icon: Heart, color: 'bg-rose-100 dark:bg-rose-900/30' },
                      { label: '직장운', text: fortune.fortune.career, icon: Briefcase, color: 'bg-blue-100 dark:bg-blue-900/30' },
                      { label: '건강운', text: fortune.fortune.health, icon: Activity, color: 'bg-green-100 dark:bg-green-900/30' },
                    ].map((item) => {
                      const Icon = item.icon;
                      return (
                        <div key={item.label} className={`p-4 rounded-lg ${item.color}`}>
                          <div className="flex items-center gap-2 font-semibold mb-2">
                            <Icon className="h-4 w-4" />
                            {item.label}
                          </div>
                          <p className="text-sm text-muted-foreground">{item.text}</p>
                        </div>
                      );
                    })}
                  </CardContent>
                </Card>

                {/* 주의사항 */}
                <Card className="border-amber-200 dark:border-amber-800">
                  <CardContent className="py-4">
                    <p className="text-amber-800 dark:text-amber-200">
                      <strong>오늘의 조언:</strong> {fortune.caution}
                    </p>
                  </CardContent>
                </Card>
              </TabsContent>

              {/* 행운 요소 */}
              <TabsContent value="lucky" className="space-y-4">
                <Card>
                  <CardHeader>
                    <CardTitle>오늘의 행운 요소</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                      <div className="text-center p-4 rounded-xl bg-gradient-to-br from-amber-50 to-orange-50 dark:from-amber-950/30 dark:to-orange-950/30">
                        <Clock className="h-8 w-8 mx-auto mb-2 text-amber-500" />
                        <div className="text-xs text-muted-foreground mb-1">행운의 시간</div>
                        <div className="font-bold">{fortune.luckyTime}</div>
                      </div>
                      <div className="text-center p-4 rounded-xl bg-gradient-to-br from-pink-50 to-rose-50 dark:from-pink-950/30 dark:to-rose-950/30">
                        <Palette className="h-8 w-8 mx-auto mb-2 text-pink-500" />
                        <div className="text-xs text-muted-foreground mb-1">행운의 색상</div>
                        <div className="font-bold">{fortune.luckyColor}</div>
                      </div>
                      <div className="text-center p-4 rounded-xl bg-gradient-to-br from-emerald-50 to-teal-50 dark:from-emerald-950/30 dark:to-teal-950/30">
                        <Hash className="h-8 w-8 mx-auto mb-2 text-emerald-500" />
                        <div className="text-xs text-muted-foreground mb-1">행운의 숫자</div>
                        <div className="font-bold">{fortune.luckyNumber}</div>
                      </div>
                      <div className="text-center p-4 rounded-xl bg-gradient-to-br from-blue-50 to-indigo-50 dark:from-blue-950/30 dark:to-indigo-950/30">
                        <Compass className="h-8 w-8 mx-auto mb-2 text-blue-500" />
                        <div className="text-xs text-muted-foreground mb-1">행운의 방향</div>
                        <div className="font-bold">{fortune.luckyDirection}</div>
                      </div>
                    </div>

                    <div className="mt-6 p-4 rounded-xl bg-gradient-to-r from-purple-50 to-pink-50 dark:from-purple-950/30 dark:to-pink-950/30">
                      <div className="text-center">
                        <Sparkles className="h-6 w-6 mx-auto mb-2 text-purple-500" />
                        <div className="text-sm text-muted-foreground mb-1">오늘의 추천 활동</div>
                        <div className="font-bold text-lg">{fortune.luckyActivity}</div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>

              {/* 띠 정보 */}
              <TabsContent value="info" className="space-y-4">
                <Card>
                  <CardHeader>
                    <CardTitle>{signData.name}띠 기본 정보</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                      <div className="p-4 rounded-lg bg-muted/50">
                        <div className="text-sm text-muted-foreground mb-1">오행</div>
                        <div className="font-medium">
                          {signData.element === 'water' && '수(水) 💧'}
                          {signData.element === 'earth' && '토(土) 🌍'}
                          {signData.element === 'wood' && '목(木) 🌲'}
                          {signData.element === 'fire' && '화(火) 🔥'}
                          {signData.element === 'metal' && '금(金) ⚙️'}
                        </div>
                      </div>
                      <div className="p-4 rounded-lg bg-muted/50">
                        <div className="text-sm text-muted-foreground mb-1">해당 연도</div>
                        <div className="font-medium text-sm">{signData.years.slice(-5).join(', ')}...</div>
                      </div>
                    </div>

                    <div className="space-y-3">
                      <div>
                        <h4 className="font-semibold mb-2 text-emerald-600">강점</h4>
                        <div className="flex flex-wrap gap-2">
                          {signData.strengths.map((s, i) => (
                            <Badge key={i} variant="secondary" className="bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-300">
                              {s}
                            </Badge>
                          ))}
                        </div>
                      </div>
                      <div>
                        <h4 className="font-semibold mb-2">성격 특성</h4>
                        <div className="flex flex-wrap gap-2">
                          {signData.personality.map((p, i) => (
                            <Badge key={i} variant="outline">{p}</Badge>
                          ))}
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2 text-rose-600">
                      <Heart className="h-5 w-5" />
                      띠별 궁합
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <div>
                        <div className="text-sm text-muted-foreground mb-2">잘 맞는 띠</div>
                        <div className="flex gap-2">
                          {signData.bestMatch.map((m) => (
                            <div key={m} className="flex items-center gap-1 px-3 py-2 rounded-full bg-emerald-100 dark:bg-emerald-900/30">
                              <span className="text-xl">{zodiacIcons[m]}</span>
                              <span className="text-sm font-medium">{CHINESE_ZODIAC[m].name}</span>
                            </div>
                          ))}
                        </div>
                      </div>
                      <div>
                        <div className="text-sm text-muted-foreground mb-2">주의가 필요한 띠</div>
                        <div className="flex gap-2">
                          {signData.worstMatch.map((m) => (
                            <div key={m} className="flex items-center gap-1 px-3 py-2 rounded-full bg-amber-100 dark:bg-amber-900/30">
                              <span className="text-xl">{zodiacIcons[m]}</span>
                              <span className="text-sm font-medium">{CHINESE_ZODIAC[m].name}</span>
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>
            </Tabs>

            {/* CTA */}
            <Card className="mt-6 bg-gradient-to-r from-amber-50 to-orange-50 dark:from-amber-950/20 dark:to-orange-950/20">
              <CardContent className="py-8 text-center">
                <Crown className="h-12 w-12 mx-auto mb-4 text-amber-500" />
                <h3 className="text-xl font-bold mb-2">더 자세한 분석이 궁금하신가요?</h3>
                <p className="text-muted-foreground mb-6">
                  사주팔자 기반 심층 분석으로 당신의 운명을 알아보세요
                </p>
                <div className="flex flex-col sm:flex-row gap-4 justify-center">
                  <Link href="/fortune/saju">
                    <button className="inline-flex items-center justify-center h-11 px-6 bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600 text-white font-semibold rounded-lg transition-all text-sm">
                      무료 사주 분석하기
                      <ArrowRight className="ml-2 h-4 w-4" />
                    </button>
                  </Link>
                  <Link href="/fortune/newyear">
                    <button className="inline-flex items-center justify-center h-11 px-6 bg-white dark:bg-gray-800 text-gray-800 dark:text-white border border-gray-300 dark:border-gray-600 hover:bg-gray-50 dark:hover:bg-gray-700 font-medium rounded-lg transition-all text-sm">
                      2026 신년운세 보기
                    </button>
                  </Link>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    );
  }

  // 선택 화면
  return (
    <div className="min-h-screen bg-gradient-to-b from-amber-50 to-orange-50 dark:from-amber-950/20 dark:to-orange-950/20">
      <div className="container mx-auto px-4 py-8 md:py-16">
        <div className="max-w-4xl mx-auto">
          {/* 헤더 */}
          <div className="text-center mb-12">
            <Badge className="mb-4 bg-gradient-to-r from-amber-500 to-orange-500 text-white">
              <Sparkles className="mr-1 h-3 w-3" />
              매일 무료
            </Badge>
            <h1 className="text-3xl md:text-4xl font-bold mb-4">
              띠별 오늘의 운세
            </h1>
            <p className="text-lg text-muted-foreground">
              태어난 해를 입력하거나 띠를 선택해주세요
            </p>
          </div>

          {/* 연도 입력 */}
          <Card className="mb-8">
            <CardContent className="p-6">
              <div className="flex flex-col md:flex-row items-center gap-4">
                <div className="flex-1 w-full">
                  <label className="block text-sm font-medium mb-2">태어난 해</label>
                  <input
                    type="number"
                    placeholder="예: 1990"
                    value={birthYear}
                    onChange={(e) => handleYearInput(e.target.value)}
                    className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-white rounded-lg text-lg text-center focus:outline-none focus:ring-2 focus:ring-amber-500"
                    min="1920"
                    max="2024"
                  />
                </div>
                {birthYear.length === 4 && selectedSign && (
                  <div className="text-center md:text-left">
                    <div className="text-4xl mb-1">{zodiacIcons[selectedSign]}</div>
                    <div className="font-bold">{CHINESE_ZODIAC[selectedSign].name}띠</div>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>

          {/* 오늘의 띠별 순위 */}
          <Card className="mb-8">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Trophy className="h-5 w-5 text-amber-500" />
                오늘의 띠별 운세 순위
              </CardTitle>
              <CardDescription>
                {currentDate.toLocaleDateString('ko-KR', { month: 'long', day: 'numeric' })} 기준
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                {ranking.slice(0, 4).map((item, index) => (
                  <button
                    key={item.sign}
                    onClick={() => handleSignSelect(item.sign)}
                    className="p-4 rounded-xl bg-gradient-to-br from-amber-100 to-orange-100 dark:from-amber-900/30 dark:to-orange-900/30 hover:shadow-lg transition-all text-center"
                  >
                    <div className="flex items-center justify-center gap-2 mb-2">
                      <span className={`text-lg font-bold ${index === 0 ? 'text-amber-500' : index === 1 ? 'text-gray-400' : index === 2 ? 'text-amber-700' : 'text-gray-500'}`}>
                        {index + 1}위
                      </span>
                    </div>
                    <div className="text-3xl mb-1">{zodiacIcons[item.sign]}</div>
                    <div className="font-medium">{item.signInfo.name}띠</div>
                    <div className="text-sm text-muted-foreground">{item.score}점</div>
                  </button>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* 12간지 그리드 */}
          <Card>
            <CardHeader>
              <CardTitle>12간지 띠 선택</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-3">
                {zodiacOrder.map((sign) => {
                  const data = CHINESE_ZODIAC[sign];
                  const rankInfo = ranking.find(r => r.sign === sign);
                  return (
                    <button
                      key={sign}
                      onClick={() => handleSignSelect(sign)}
                      className="group p-4 rounded-xl border border-border/50 hover:border-amber-300 hover:bg-amber-50 dark:hover:bg-amber-950/30 transition-all text-center"
                    >
                      <div className="text-4xl mb-2 group-hover:scale-110 transition-transform">
                        {zodiacIcons[sign]}
                      </div>
                      <div className="font-medium">{data.name}띠</div>
                      <div className="text-xs text-muted-foreground">{data.korean}</div>
                      {rankInfo && (
                        <Badge variant="outline" className="mt-2 text-xs">
                          {rankInfo.rank}위 · {rankInfo.score}점
                        </Badge>
                      )}
                    </button>
                  );
                })}
              </div>
            </CardContent>
          </Card>

          {/* 다른 무료 운세 */}
          <div className="mt-8 grid md:grid-cols-2 gap-4">
            <Link href="/fortune/free">
              <Card className="h-full hover:shadow-lg transition-shadow cursor-pointer">
                <CardContent className="p-6 flex items-center gap-4">
                  <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center">
                    <Calendar className="h-7 w-7 text-white" />
                  </div>
                  <div className="flex-1">
                    <h3 className="font-bold mb-1">오늘의 운세</h3>
                    <p className="text-sm text-muted-foreground">매일 업데이트되는 종합 운세</p>
                  </div>
                  <ChevronRight className="h-5 w-5 text-muted-foreground" />
                </CardContent>
              </Card>
            </Link>
            <Link href="/fortune/newyear">
              <Card className="h-full hover:shadow-lg transition-shadow cursor-pointer">
                <CardContent className="p-6 flex items-center gap-4">
                  <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-amber-500 to-red-500 flex items-center justify-center">
                    <Star className="h-7 w-7 text-white" />
                  </div>
                  <div className="flex-1">
                    <h3 className="font-bold mb-1">2026 신년운세</h3>
                    <p className="text-sm text-muted-foreground">올해의 운세를 미리 확인하세요</p>
                  </div>
                  <ChevronRight className="h-5 w-5 text-muted-foreground" />
                </CardContent>
              </Card>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
