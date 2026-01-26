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

// Generate daily fortune based on date
function generateDailyFortune(date: Date) {
  const seed = date.getFullYear() * 10000 + (date.getMonth() + 1) * 100 + date.getDate();
  const random = (min: number, max: number) => {
    const x = Math.sin(seed * 9999) * 10000;
    return Math.floor((x - Math.floor(x)) * (max - min + 1)) + min;
  };

  return {
    overall: random(60, 95),
    wealth: random(55, 98),
    love: random(50, 95),
    career: random(60, 95),
    health: random(55, 90),
    luckyTime: `${random(6, 18)}:00`,
    luckyColorKey: ['Purple', 'Blue', 'Green', 'Red', 'Yellow', 'Orange'][random(0, 5)] as string,
    luckyNumber: random(1, 99),
    adviceIndex: random(0, 5),
    cautionIndex: random(0, 5),
  };
}

export default function FreeFortunePage() {
  const t = useTranslations('fortune');
  const tDaily = useTranslations('fortune.daily');
  const tCommon = useTranslations('common');
  const [fortune, setFortune] = useState<ReturnType<typeof generateDailyFortune> | null>(null);
  const [checkedIn, setCheckedIn] = useState(false);
  const [streak, setStreak] = useState(0);
  const [currentTime, setCurrentTime] = useState(new Date());

  useEffect(() => {
    setFortune(generateDailyFortune(new Date()));
    // Check if user has checked in today (would use localStorage or DB in production)
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
        <p className="mt-4 text-muted-foreground">{tCommon('loading')}</p>
      </div>
    );
  }

  const scoreItems = [
    { key: 'overall', icon: Star, score: fortune.overall, color: 'text-purple-500' },
    { key: 'wealth', icon: Coins, score: fortune.wealth, color: 'text-yellow-500' },
    { key: 'love', icon: Heart, score: fortune.love, color: 'text-pink-500' },
    { key: 'career', icon: Briefcase, score: fortune.career, color: 'text-blue-500' },
    { key: 'health', icon: Activity, score: fortune.health, color: 'text-green-500' },
  ];

  // Get translated color name
  const luckyColorTranslated = tDaily(`colors.${fortune.luckyColorKey}` as 'colors.Purple');

  // Get color hex for display
  const colorMap: Record<string, string> = {
    Purple: '#9333ea',
    Blue: '#3b82f6',
    Green: '#22c55e',
    Red: '#ef4444',
    Yellow: '#eab308',
    Orange: '#f97316',
  };

  return (
    <div className="container mx-auto px-4 py-8 md:py-16">
      {/* Header */}
      <div className="text-center mb-8">
        <Badge className="mb-4 bg-gradient-to-r from-purple-500 to-pink-500 text-white">
          <Sparkles className="mr-1 h-3 w-3" />
          {t('free.title')}
        </Badge>
        <h1 className="text-3xl md:text-4xl font-bold mb-2">{tDaily('title')}</h1>
        <div className="flex items-center justify-center gap-2 text-muted-foreground">
          <Calendar className="h-4 w-4" />
          <span>{currentTime.toLocaleDateString()}</span>
          <Clock className="h-4 w-4 ml-2" />
          <span>{currentTime.toLocaleTimeString()}</span>
        </div>
      </div>

      <div className="max-w-4xl mx-auto">
        {/* Check-in Card */}
        <Card className="mb-6 overflow-hidden">
          <div className="bg-gradient-to-r from-purple-500 to-pink-500 p-6 text-white">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-xl font-bold mb-1">{tDaily('checkin')}</h2>
                <p className="text-white/80">
                  {checkedIn
                    ? tDaily('streakDays', { count: streak })
                    : tDaily('streakStart')}
                </p>
              </div>
              {checkedIn ? (
                <div className="flex items-center gap-2 bg-white/20 rounded-full px-4 py-2">
                  <CheckCircle className="h-5 w-5" />
                  <span>{tDaily('checkedIn')}</span>
                </div>
              ) : (
                <Button
                  onClick={handleCheckin}
                  className="bg-white text-purple-600 hover:bg-white/90"
                >
                  <Gift className="mr-2 h-4 w-4" />
                  {tDaily('checkInBtn')}
                </Button>
              )}
            </div>
            {/* Streak visualization */}
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
            <p className="text-xs text-white/60 mt-2">{tDaily('streakBonus')}</p>
          </div>
        </Card>

        {/* Fortune Scores Grid */}
        <div className="grid md:grid-cols-5 gap-4 mb-6">
          {scoreItems.map((item) => {
            const Icon = item.icon;
            return (
              <Card key={item.key} className="text-center">
                <CardContent className="p-4">
                  <Icon className={`h-6 w-6 mx-auto mb-2 ${item.color}`} />
                  <div className="text-2xl font-bold mb-1">{item.score}</div>
                  <div className="text-xs text-muted-foreground capitalize">
                    {tDaily(`scores.${item.key}` as 'scores.overall')}
                  </div>
                  <Progress value={item.score} className="h-1 mt-2" />
                </CardContent>
              </Card>
            );
          })}
        </div>

        {/* Main Fortune Card */}
        <Card className="mb-6">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Sun className="h-5 w-5 text-yellow-500" />
              {tDaily('todayMessage')}
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <p className="text-lg">{tDaily(`advices.${fortune.adviceIndex}` as 'advices.0')}</p>
            <div className="p-4 rounded-lg bg-amber-50 dark:bg-amber-950/20 border border-amber-200 dark:border-amber-800">
              <p className="text-amber-800 dark:text-amber-200 text-sm">
                <strong>{tDaily('caution')}:</strong> {tDaily(`cautions.${fortune.cautionIndex}` as 'cautions.0')}
              </p>
            </div>
          </CardContent>
        </Card>

        {/* Lucky Items */}
        <div className="grid md:grid-cols-3 gap-4 mb-8">
          <Card>
            <CardContent className="p-6 text-center">
              <Clock className="h-8 w-8 mx-auto mb-2 text-primary" />
              <div className="text-sm text-muted-foreground mb-1">
                {tDaily('luckyItems.time')}
              </div>
              <div className="text-xl font-bold">{fortune.luckyTime}</div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-6 text-center">
              <div
                className="w-8 h-8 rounded-full mx-auto mb-2"
                style={{ backgroundColor: colorMap[fortune.luckyColorKey] }}
              />
              <div className="text-sm text-muted-foreground mb-1">
                {tDaily('luckyItems.color')}
              </div>
              <div className="text-xl font-bold">{luckyColorTranslated}</div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-6 text-center">
              <Star className="h-8 w-8 mx-auto mb-2 text-yellow-500" />
              <div className="text-sm text-muted-foreground mb-1">
                {tDaily('luckyItems.number')}
              </div>
              <div className="text-xl font-bold">{fortune.luckyNumber}</div>
            </CardContent>
          </Card>
        </div>

        {/* CTA Section */}
        <Card className="bg-gradient-to-r from-purple-50 to-pink-50 dark:from-purple-950/20 dark:to-pink-950/20 border-purple-200 dark:border-purple-800">
          <CardContent className="p-8 text-center">
            <Moon className="h-12 w-12 mx-auto mb-4 text-purple-500" />
            <h3 className="text-xl font-bold mb-2">{tDaily('deeperAnalysis.title')}</h3>
            <p className="text-muted-foreground mb-6 max-w-md mx-auto">
              {tDaily('deeperAnalysis.description')}
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link href="/fortune/saju">
                <Button size="lg">
                  {tDaily('deeperAnalysis.freeSaju')}
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </Link>
              <Link href="/pricing">
                <Button size="lg" variant="outline">
                  {tDaily('deeperAnalysis.viewPlans')}
                </Button>
              </Link>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
