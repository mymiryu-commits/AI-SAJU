'use client';

import { useState } from 'react';
import { Link } from '@/i18n/routing';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import {
  Star,
  Sparkles,
  Heart,
  Briefcase,
  Coins,
  Activity,
  ArrowRight,
  ArrowLeft,
  Calendar,
  Crown,
  Lock,
  ChevronRight,
  CheckCircle,
  Gift,
  Zap,
  TrendingUp,
  AlertTriangle,
} from 'lucide-react';
import {
  CHINESE_ZODIAC,
  ChineseZodiacSign,
  getChineseZodiac,
  generateNewYearFortune,
} from '@/lib/fortune/chineseZodiac';

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

export default function NewYearFortunePage() {
  const [birthYear, setBirthYear] = useState<string>('');
  const [selectedSign, setSelectedSign] = useState<ChineseZodiacSign | null>(null);
  const [fortune, setFortune] = useState<ReturnType<typeof generateNewYearFortune> | null>(null);

  const handleYearInput = (year: string) => {
    setBirthYear(year);
    if (year.length === 4) {
      const yearNum = parseInt(year, 10);
      if (yearNum >= 1920 && yearNum <= 2010) {
        const sign = getChineseZodiac(yearNum);
        setSelectedSign(sign);
        setFortune(generateNewYearFortune(sign, yearNum));
      }
    }
  };

  const handleSignSelect = (sign: ChineseZodiacSign) => {
    // 대표 연도로 계산
    const representativeYear = CHINESE_ZODIAC[sign].years[CHINESE_ZODIAC[sign].years.length - 2] || 1990;
    setSelectedSign(sign);
    setBirthYear(representativeYear.toString());
    setFortune(generateNewYearFortune(sign, representativeYear));
  };

  const handleBack = () => {
    setSelectedSign(null);
    setFortune(null);
    setBirthYear('');
  };

  // 결과 화면
  if (fortune && selectedSign) {
    const signData = CHINESE_ZODIAC[selectedSign];

    return (
      <div className="min-h-screen bg-gradient-to-b from-red-50 via-amber-50 to-orange-50 dark:from-red-950/20 dark:via-amber-950/20 dark:to-orange-950/20">
        <div className="container mx-auto px-4 py-8">
          <div className="max-w-3xl mx-auto">
            {/* 뒤로가기 */}
            <Button variant="ghost" onClick={handleBack} className="mb-6">
              <ArrowLeft className="mr-2 h-4 w-4" />
              다시 선택하기
            </Button>

            {/* 헤더 카드 */}
            <Card className="mb-6 overflow-hidden">
              <div className="relative bg-gradient-to-r from-red-600 via-amber-500 to-orange-500 p-8 text-white text-center overflow-hidden">
                {/* 배경 장식 */}
                <div className="absolute inset-0 opacity-10">
                  <div className="absolute top-4 left-4 text-8xl">🎊</div>
                  <div className="absolute bottom-4 right-4 text-8xl">🧧</div>
                  <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 text-[200px] opacity-20">
                    {zodiacIcons[selectedSign]}
                  </div>
                </div>

                <div className="relative z-10">
                  <Badge className="mb-4 bg-white/20 text-white border-white/30">
                    <Star className="mr-1 h-3 w-3" />
                    2026년 병오년(丙午年)
                  </Badge>
                  <div className="text-7xl mb-4">{zodiacIcons[selectedSign]}</div>
                  <h1 className="text-3xl font-bold mb-2">{signData.name}띠 신년운세</h1>
                  <p className="text-white/80">{fortune.age}세 ({fortune.birthYear}년생)</p>
                </div>
              </div>

              <CardContent className="p-6">
                {/* 띠 궁합 */}
                <div className={`p-4 rounded-xl mb-6 ${fortune.compatibility.isGoodMatch ? 'bg-emerald-100 dark:bg-emerald-900/30' : fortune.compatibility.isBadMatch ? 'bg-amber-100 dark:bg-amber-900/30' : 'bg-blue-100 dark:bg-blue-900/30'}`}>
                  <div className="flex items-center gap-4 justify-center">
                    <div className="text-4xl">{zodiacIcons[selectedSign]}</div>
                    <div className="text-2xl">×</div>
                    <div className="text-4xl">{zodiacIcons[fortune.yearZodiac]}</div>
                  </div>
                  <p className="text-center mt-3 font-medium">
                    {fortune.compatibility.description}
                  </p>
                </div>

                {/* 종합 메시지 */}
                <div className="text-center mb-6">
                  <Sparkles className="h-8 w-8 mx-auto mb-3 text-amber-500" />
                  <p className="text-lg leading-relaxed">{fortune.freePreview.overallMessage}</p>
                </div>

                {/* 점수 */}
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

            {/* 무료 프리뷰 */}
            <Card className="mb-6">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Gift className="h-5 w-5 text-emerald-500" />
                  무료 운세 미리보기
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {/* 핵심 조언 */}
                <div className="p-4 rounded-xl bg-gradient-to-r from-amber-50 to-orange-50 dark:from-amber-950/30 dark:to-orange-950/30">
                  <h4 className="font-semibold mb-2 flex items-center gap-2">
                    <Zap className="h-4 w-4 text-amber-500" />
                    2026년 핵심 조언
                  </h4>
                  <p className="text-muted-foreground">{fortune.freePreview.keyAdvice}</p>
                </div>

                {/* 행운의 달 */}
                <div className="grid grid-cols-2 gap-4">
                  <div className="p-4 rounded-xl bg-emerald-50 dark:bg-emerald-950/30">
                    <h4 className="font-semibold mb-2 flex items-center gap-2 text-emerald-700 dark:text-emerald-300">
                      <TrendingUp className="h-4 w-4" />
                      행운의 달
                    </h4>
                    <div className="flex gap-2">
                      {fortune.freePreview.luckyMonths.map((month) => (
                        <Badge key={month} className="bg-emerald-200 text-emerald-800 dark:bg-emerald-800 dark:text-emerald-200">
                          {month}월
                        </Badge>
                      ))}
                    </div>
                  </div>
                  <div className="p-4 rounded-xl bg-amber-50 dark:bg-amber-950/30">
                    <h4 className="font-semibold mb-2 flex items-center gap-2 text-amber-700 dark:text-amber-300">
                      <AlertTriangle className="h-4 w-4" />
                      주의할 달
                    </h4>
                    <div className="flex gap-2">
                      {fortune.freePreview.cautionMonths.map((month) => (
                        <Badge key={month} className="bg-amber-200 text-amber-800 dark:bg-amber-800 dark:text-amber-200">
                          {month}월
                        </Badge>
                      ))}
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* 프리미엄 잠금 콘텐츠 */}
            <Card className="mb-6 relative overflow-hidden">
              <div className="absolute inset-0 backdrop-blur-sm bg-white/80 dark:bg-black/80 z-10 flex flex-col items-center justify-center">
                <Lock className="h-12 w-12 text-amber-500 mb-4" />
                <h3 className="text-xl font-bold mb-2">프리미엄 상세 분석</h3>
                <p className="text-muted-foreground text-center mb-4 px-4">
                  월별 운세, 재물 전략, 건강 조언 등<br />
                  상세한 2026년 분석을 확인하세요
                </p>
                <Link href="/pricing">
                  <Button className="bg-gradient-to-r from-amber-500 to-orange-500 text-white">
                    <Crown className="mr-2 h-4 w-4" />
                    프리미엄 이용하기
                  </Button>
                </Link>
              </div>

              <CardHeader>
                <CardTitle>2026년 월별 상세 운세</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-3 md:grid-cols-4 gap-3 blur-sm">
                  {Array.from({ length: 12 }).map((_, i) => (
                    <div key={i} className="p-4 rounded-lg bg-muted/50 text-center">
                      <div className="font-bold text-lg">{i + 1}월</div>
                      <div className="text-2xl font-bold text-amber-500">??</div>
                      <div className="text-xs text-muted-foreground">점수</div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* 프리미엄 기능 안내 */}
            <Card className="mb-6 border-amber-200 dark:border-amber-800">
              <CardHeader className="bg-gradient-to-r from-amber-50 to-orange-50 dark:from-amber-950/30 dark:to-orange-950/30">
                <CardTitle className="flex items-center gap-2">
                  <Crown className="h-5 w-5 text-amber-500" />
                  프리미엄 신년운세에서 확인하세요
                </CardTitle>
              </CardHeader>
              <CardContent className="p-6">
                <div className="grid md:grid-cols-2 gap-4">
                  {[
                    { icon: Calendar, text: '12개월 상세 운세', desc: '월별 운세 흐름과 행운의 날' },
                    { icon: Coins, text: '재물운 전략', desc: '투자, 지출 타이밍 분석' },
                    { icon: Heart, text: '애정운 분석', desc: '인연의 시기와 궁합' },
                    { icon: Briefcase, text: '직장운 가이드', desc: '이직, 승진 최적 타이밍' },
                    { icon: Activity, text: '건강 조언', desc: '주의해야 할 건강 포인트' },
                    { icon: Star, text: '행운의 날', desc: '중요한 결정에 좋은 날짜' },
                  ].map((item, i) => {
                    const Icon = item.icon;
                    return (
                      <div key={i} className="flex items-start gap-3 p-3 rounded-lg hover:bg-muted/50 transition-colors">
                        <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-amber-100 to-orange-100 dark:from-amber-900/30 dark:to-orange-900/30 flex items-center justify-center flex-shrink-0">
                          <Icon className="h-5 w-5 text-amber-600" />
                        </div>
                        <div>
                          <div className="font-semibold">{item.text}</div>
                          <div className="text-sm text-muted-foreground">{item.desc}</div>
                        </div>
                      </div>
                    );
                  })}
                </div>

                <div className="mt-6 text-center">
                  <Link href="/fortune/integrated">
                    <Button size="lg" className="bg-gradient-to-r from-amber-500 to-orange-500 text-white">
                      <Crown className="mr-2 h-5 w-5" />
                      프리미엄 통합 분석 시작
                      <ArrowRight className="ml-2 h-5 w-5" />
                    </Button>
                  </Link>
                  <p className="text-sm text-muted-foreground mt-2">
                    신년운세 포함 · 사주팔자 심층 분석
                  </p>
                </div>
              </CardContent>
            </Card>

            {/* 다른 무료 운세 */}
            <div className="grid md:grid-cols-2 gap-4">
              <Link href="/fortune/tti">
                <Card className="h-full hover:shadow-lg transition-shadow cursor-pointer">
                  <CardContent className="p-6 flex items-center gap-4">
                    <div className="text-4xl">{zodiacIcons[selectedSign]}</div>
                    <div className="flex-1">
                      <h3 className="font-bold mb-1">오늘의 띠별 운세</h3>
                      <p className="text-sm text-muted-foreground">매일 업데이트</p>
                    </div>
                    <ChevronRight className="h-5 w-5 text-muted-foreground" />
                  </CardContent>
                </Card>
              </Link>
              <Link href="/fortune/saju">
                <Card className="h-full hover:shadow-lg transition-shadow cursor-pointer">
                  <CardContent className="p-6 flex items-center gap-4">
                    <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center">
                      <Sparkles className="h-7 w-7 text-white" />
                    </div>
                    <div className="flex-1">
                      <h3 className="font-bold mb-1">무료 사주 분석</h3>
                      <p className="text-sm text-muted-foreground">사주팔자 기반 분석</p>
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

  // 선택 화면
  return (
    <div className="min-h-screen bg-gradient-to-b from-red-50 via-amber-50 to-orange-50 dark:from-red-950/20 dark:via-amber-950/20 dark:to-orange-950/20">
      <div className="container mx-auto px-4 py-8 md:py-16">
        <div className="max-w-4xl mx-auto">
          {/* 헤더 */}
          <div className="text-center mb-12">
            <Badge className="mb-4 bg-gradient-to-r from-red-500 to-amber-500 text-white">
              <Star className="mr-1 h-3 w-3" />
              2026 병오년
            </Badge>
            <h1 className="text-3xl md:text-5xl font-bold mb-4">
              🧧 2026 신년운세 🧧
            </h1>
            <p className="text-lg text-muted-foreground mb-2">
              말띠의 해, 당신의 2026년을 미리 확인하세요
            </p>
            <div className="flex items-center justify-center gap-2 text-6xl mt-4">
              🐎
            </div>
          </div>

          {/* 연도 입력 */}
          <Card className="mb-8 border-amber-200 dark:border-amber-800">
            <CardContent className="p-6">
              <div className="flex flex-col md:flex-row items-center gap-4">
                <div className="flex-1 w-full">
                  <label className="block text-sm font-medium mb-2">태어난 해를 입력하세요</label>
                  <input
                    type="number"
                    placeholder="예: 1990"
                    value={birthYear}
                    onChange={(e) => handleYearInput(e.target.value)}
                    className="w-full px-4 py-3 border border-amber-200 dark:border-amber-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-white rounded-lg text-lg text-center focus:outline-none focus:ring-2 focus:ring-amber-500"
                    min="1920"
                    max="2010"
                  />
                </div>
                {birthYear.length === 4 && selectedSign && (
                  <div className="text-center md:text-left">
                    <div className="text-5xl mb-1">{zodiacIcons[selectedSign]}</div>
                    <div className="font-bold text-lg">{CHINESE_ZODIAC[selectedSign].name}띠</div>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>

          {/* 2026년 띠별 전망 요약 */}
          <Card className="mb-8">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <TrendingUp className="h-5 w-5 text-amber-500" />
                2026년 띠별 전망
              </CardTitle>
              <CardDescription>
                말띠 해와의 궁합으로 보는 전반적인 운세 흐름
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-3 md:grid-cols-4 gap-4">
                {[
                  { sign: 'tiger' as ChineseZodiacSign, status: 'best', label: '대길' },
                  { sign: 'sheep' as ChineseZodiacSign, status: 'good', label: '길' },
                  { sign: 'rabbit' as ChineseZodiacSign, status: 'good', label: '길' },
                  { sign: 'dog' as ChineseZodiacSign, status: 'normal', label: '평' },
                  { sign: 'pig' as ChineseZodiacSign, status: 'normal', label: '평' },
                  { sign: 'monkey' as ChineseZodiacSign, status: 'normal', label: '평' },
                  { sign: 'snake' as ChineseZodiacSign, status: 'normal', label: '평' },
                  { sign: 'dragon' as ChineseZodiacSign, status: 'normal', label: '평' },
                  { sign: 'ox' as ChineseZodiacSign, status: 'caution', label: '주의' },
                  { sign: 'rooster' as ChineseZodiacSign, status: 'caution', label: '주의' },
                  { sign: 'rat' as ChineseZodiacSign, status: 'caution', label: '주의' },
                  { sign: 'horse' as ChineseZodiacSign, status: 'self', label: '본명년' },
                ].map((item) => (
                  <button
                    key={item.sign}
                    onClick={() => handleSignSelect(item.sign)}
                    className={`p-3 rounded-xl text-center transition-all hover:shadow-lg ${
                      item.status === 'best' ? 'bg-emerald-100 dark:bg-emerald-900/30 ring-2 ring-emerald-300' :
                      item.status === 'good' ? 'bg-blue-100 dark:bg-blue-900/30' :
                      item.status === 'caution' ? 'bg-amber-100 dark:bg-amber-900/30' :
                      item.status === 'self' ? 'bg-red-100 dark:bg-red-900/30' :
                      'bg-gray-100 dark:bg-gray-900/30'
                    }`}
                  >
                    <div className="text-3xl mb-1">{zodiacIcons[item.sign]}</div>
                    <div className="font-medium text-sm">{CHINESE_ZODIAC[item.sign].name}</div>
                    <Badge variant="outline" className={`mt-1 text-xs ${
                      item.status === 'best' ? 'border-emerald-500 text-emerald-700' :
                      item.status === 'good' ? 'border-blue-500 text-blue-700' :
                      item.status === 'caution' ? 'border-amber-500 text-amber-700' :
                      item.status === 'self' ? 'border-red-500 text-red-700' :
                      ''
                    }`}>
                      {item.label}
                    </Badge>
                  </button>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* 12간지 그리드 */}
          <Card className="mb-8">
            <CardHeader>
              <CardTitle>띠 선택하기</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-3">
                {zodiacOrder.map((sign) => {
                  const data = CHINESE_ZODIAC[sign];
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
                    </button>
                  );
                })}
              </div>
            </CardContent>
          </Card>

          {/* 프리미엄 안내 */}
          <Card className="bg-gradient-to-r from-amber-50 to-orange-50 dark:from-amber-950/30 dark:to-orange-950/30 border-amber-200 dark:border-amber-800">
            <CardContent className="py-8 text-center">
              <Crown className="h-12 w-12 mx-auto mb-4 text-amber-500" />
              <h3 className="text-2xl font-bold mb-2">프리미엄 신년운세</h3>
              <p className="text-muted-foreground mb-6 max-w-lg mx-auto">
                사주팔자 기반 심층 분석으로<br />
                2026년 월별 운세, 재물 전략, 인연 분석까지 확인하세요
              </p>
              <div className="flex flex-wrap justify-center gap-2 mb-6">
                {['12개월 상세 운세', '행운의 날짜', '재물 전략', '건강 조언'].map((feature) => (
                  <Badge key={feature} variant="secondary" className="bg-white/50">
                    <CheckCircle className="mr-1 h-3 w-3 text-emerald-500" />
                    {feature}
                  </Badge>
                ))}
              </div>
              <Link href="/fortune/integrated">
                <Button size="lg" className="bg-gradient-to-r from-amber-500 to-orange-500 text-white">
                  <Crown className="mr-2 h-5 w-5" />
                  프리미엄 분석 시작
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Button>
              </Link>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
