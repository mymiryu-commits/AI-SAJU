'use client';

import { useState, useEffect } from 'react';
import { useTranslations } from 'next-intl';
import { Link } from '@/i18n/routing';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import {
  Sparkles,
  Sun,
  Moon,
  Star,
  Heart,
  Briefcase,
  Coins,
  Activity,
  ArrowRight,
  Calendar,
  Clock,
  CheckCircle,
  Gift,
} from 'lucide-react';

// 날짜 기반 운세 생성
function generateDailyFortune(date: Date) {
  const seed = date.getFullYear() * 10000 + (date.getMonth() + 1) * 100 + date.getDate();
  const random = (min: number, max: number) => {
    const x = Math.sin(seed * 9999) * 10000;
    return Math.floor((x - Math.floor(x)) * (max - min + 1)) + min;
  };

  const advices = [
    '오늘은 새로운 시작을 하기에 좋은 날입니다. 직감을 믿으세요.',
    '인간관계에 집중하세요. 좋은 소통이 기회를 가져옵니다.',
    '오늘의 금전적 결정은 오래 영향을 미칠 수 있습니다.',
    '자기 관리에 시간을 투자하세요. 건강이 곧 재산입니다.',
    '창의적인 활동이 예상치 못한 보상을 가져올 것입니다.',
    '타인에게 인내심을 가지세요. 친절은 배로 돌아옵니다.',
  ];

  const cautions = [
    '오후에 충동 구매를 피하세요.',
    '오후 3시 경 말을 조심하세요.',
    '중요한 서류는 서명 전에 꼭 다시 확인하세요.',
    '번아웃을 피하기 위해 휴식을 취하세요.',
    '식단에 주의하세요, 특히 단 음식을.',
    '중요한 결정을 서두르지 마세요.',
  ];

  const colors = ['보라', '파랑', '초록', '빨강', '노랑', '주황'];

  return {
    overall: random(60, 95),
    wealth: random(55, 98),
    love: random(50, 95),
    career: random(60, 95),
    health: random(55, 90),
    luckyTime: `${random(6, 18)}:00`,
    luckyColor: colors[random(0, 5)],
    luckyNumber: random(1, 99),
    advice: advices[random(0, 5)],
    caution: cautions[random(0, 5)],
  };
}

export default function FreeFortunePage() {
  const t = useTranslations('fortune');
  const tDaily = useTranslations('fortune.daily');
  const [fortune, setFortune] = useState<ReturnType<typeof generateDailyFortune> | null>(null);
  const [checkedIn, setCheckedIn] = useState(false);
  const [streak, setStreak] = useState(0);
  const [currentTime, setCurrentTime] = useState(new Date());

  useEffect(() => {
    setFortune(generateDailyFortune(new Date()));
    const lastCheckin = localStorage.getItem('lastCheckin');
    const today = new Date().toDateString();
    if (lastCheckin === today) {
      setCheckedIn(true);
      setStreak(parseInt(localStorage.getItem('streak') || '1', 10));
    }
  }, []);

  useEffect(() => {
    const timer = setInterval(() => setCurrentTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  const handleCheckin = () => {
    const today = new Date().toDateString();
    const lastCheckin = localStorage.getItem('lastCheckin');
    const yesterday = new Date(Date.now() - 86400000).toDateString();

    let newStreak = 1;
    if (lastCheckin === yesterday) {
      newStreak = parseInt(localStorage.getItem('streak') || '0', 10) + 1;
    }

    localStorage.setItem('lastCheckin', today);
    localStorage.setItem('streak', newStreak.toString());
    setCheckedIn(true);
    setStreak(newStreak);
  };

  if (!fortune) {
    return (
      <div className="container mx-auto px-4 py-16 text-center">
        <Sparkles className="h-12 w-12 animate-spin mx-auto text-primary" />
        <p className="mt-4 text-muted-foreground">운세를 불러오는 중...</p>
      </div>
    );
  }

  const scoreItems = [
    { key: 'overall', label: '종합운', icon: Star, score: fortune.overall, color: 'text-purple-500' },
    { key: 'wealth', label: '재물운', icon: Coins, score: fortune.wealth, color: 'text-yellow-500' },
    { key: 'love', label: '애정운', icon: Heart, score: fortune.love, color: 'text-pink-500' },
    { key: 'career', label: '직업운', icon: Briefcase, score: fortune.career, color: 'text-blue-500' },
    { key: 'health', label: '건강운', icon: Activity, score: fortune.health, color: 'text-green-500' },
  ];

  const colorMap: Record<string, string> = {
    '보라': '#9333ea',
    '파랑': '#3b82f6',
    '초록': '#22c55e',
    '빨강': '#ef4444',
    '노랑': '#eab308',
    '주황': '#f97316',
  };

  return (
    <div className="container mx-auto px-4 py-8 md:py-16">
      {/* 헤더 */}
      <div className="text-center mb-8">
        <Badge className="mb-4 bg-gradient-to-r from-purple-500 to-pink-500 text-white">
          <Sparkles className="mr-1 h-3 w-3" />
          {t('free.title')}
        </Badge>
        <h1 className="text-3xl md:text-4xl font-bold mb-2">{tDaily('title')}</h1>
        <div className="flex items-center justify-center gap-2 text-muted-foreground">
          <Calendar className="h-4 w-4" />
          <span>{currentTime.toLocaleDateString('ko-KR')}</span>
          <Clock className="h-4 w-4 ml-2" />
          <span>{currentTime.toLocaleTimeString('ko-KR')}</span>
        </div>
      </div>

      <div className="max-w-4xl mx-auto">
        {/* 출석 체크 카드 */}
        <Card className="mb-6 overflow-hidden">
          <div className="bg-gradient-to-r from-purple-500 to-pink-500 p-6 text-white">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-xl font-bold mb-1">{tDaily('checkin')}</h2>
                <p className="text-white/80">
                  {checkedIn
                    ? `연속 ${streak}일째 출석 중!`
                    : '출석 체크하고 연속 기록을 시작하세요!'}
                </p>
              </div>
              {checkedIn ? (
                <div className="flex items-center gap-2 bg-white/20 rounded-full px-4 py-2">
                  <CheckCircle className="h-5 w-5" />
                  <span>출석 완료</span>
                </div>
              ) : (
                <Button
                  onClick={handleCheckin}
                  className="bg-white text-purple-600 hover:bg-white/90"
                >
                  <Gift className="mr-2 h-4 w-4" />
                  출석하기
                </Button>
              )}
            </div>
            {/* 연속 출석 시각화 */}
            <div className="mt-4 flex gap-1">
              {Array.from({ length: 7 }).map((_, i) => (
                <div
                  key={i}
                  className={`flex-1 h-2 rounded-full ${
                    i < streak ? 'bg-white' : 'bg-white/30'
                  }`}
                />
              ))}
            </div>
            <p className="text-xs text-white/60 mt-2">7일 연속 출석시 보너스 보상!</p>
          </div>
        </Card>

        {/* 운세 점수 그리드 */}
        <div className="grid md:grid-cols-5 gap-4 mb-6">
          {scoreItems.map((item) => {
            const Icon = item.icon;
            return (
              <Card key={item.key} className="text-center">
                <CardContent className="p-4">
                  <Icon className={`h-6 w-6 mx-auto mb-2 ${item.color}`} />
                  <div className="text-2xl font-bold mb-1">{item.score}</div>
                  <div className="text-xs text-muted-foreground">
                    {item.label}
                  </div>
                  <Progress value={item.score} className="h-1 mt-2" />
                </CardContent>
              </Card>
            );
          })}
        </div>

        {/* 오늘의 메시지 카드 */}
        <Card className="mb-6">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Sun className="h-5 w-5 text-yellow-500" />
              오늘의 메시지
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <p className="text-lg">{fortune.advice}</p>
            <div className="p-4 rounded-lg bg-amber-50 dark:bg-amber-950/20 border border-amber-200 dark:border-amber-800">
              <p className="text-amber-800 dark:text-amber-200 text-sm">
                <strong>주의:</strong> {fortune.caution}
              </p>
            </div>
          </CardContent>
        </Card>

        {/* 행운의 요소 */}
        <div className="grid md:grid-cols-3 gap-4 mb-8">
          <Card>
            <CardContent className="p-6 text-center">
              <Clock className="h-8 w-8 mx-auto mb-2 text-primary" />
              <div className="text-sm text-muted-foreground mb-1">
                행운의 시간
              </div>
              <div className="text-xl font-bold">{fortune.luckyTime}</div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-6 text-center">
              <div
                className="w-8 h-8 rounded-full mx-auto mb-2"
                style={{ backgroundColor: colorMap[fortune.luckyColor] || '#9333ea' }}
              />
              <div className="text-sm text-muted-foreground mb-1">
                행운의 색
              </div>
              <div className="text-xl font-bold">{fortune.luckyColor}</div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-6 text-center">
              <Star className="h-8 w-8 mx-auto mb-2 text-yellow-500" />
              <div className="text-sm text-muted-foreground mb-1">
                행운의 숫자
              </div>
              <div className="text-xl font-bold">{fortune.luckyNumber}</div>
            </CardContent>
          </Card>
        </div>

        {/* CTA 섹션 */}
        <Card className="bg-gradient-to-r from-purple-50 to-pink-50 dark:from-purple-950/20 dark:to-pink-950/20 border-purple-200 dark:border-purple-800">
          <CardContent className="p-8 text-center">
            <Moon className="h-12 w-12 mx-auto mb-4 text-purple-500" />
            <h3 className="text-xl font-bold mb-2">더 자세한 분석을 원하시나요?</h3>
            <p className="text-muted-foreground mb-6 max-w-md mx-auto">
              프리미엄 사주 분석으로 나의 운명을 자세히 알아보세요.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link href="/fortune/saju">
                <Button size="lg">
                  무료 사주 분석
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </Link>
              <Link href="/pricing">
                <Button size="lg" variant="outline">
                  프리미엄 요금제 보기
                </Button>
              </Link>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
