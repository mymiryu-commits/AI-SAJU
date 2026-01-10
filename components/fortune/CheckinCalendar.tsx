'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import {
  Gift,
  CheckCircle,
  Star,
  Coins,
  Crown,
  Flame,
  Calendar,
  ChevronLeft,
  ChevronRight,
} from 'lucide-react';

interface CheckinData {
  date: string;
  streak: number;
  rewardType: string;
  rewardAmount: number;
}

interface CheckinCalendarProps {
  checkins?: CheckinData[];
  currentStreak?: number;
  onCheckin?: () => void;
}

const REWARDS = [
  { day: 1, type: 'coin', amount: 10, icon: Coins, label: '10 코인' },
  { day: 2, type: 'coin', amount: 10, icon: Coins, label: '10 코인' },
  { day: 3, type: 'coin', amount: 20, icon: Coins, label: '20 코인' },
  { day: 4, type: 'coin', amount: 10, icon: Coins, label: '10 코인' },
  { day: 5, type: 'coin', amount: 20, icon: Coins, label: '20 코인' },
  { day: 6, type: 'coin', amount: 30, icon: Coins, label: '30 코인' },
  { day: 7, type: 'bonus', amount: 50, icon: Gift, label: '50 코인 + 타로 1회' },
];

const MILESTONE_REWARDS = [
  { days: 14, reward: '100 코인', icon: Star },
  { days: 30, reward: '기본 분석 무료', icon: Crown },
  { days: 100, reward: '500 코인', icon: Gift },
  { days: 365, reward: '프리미엄 1개월', icon: Crown },
];

export function CheckinCalendar({
  checkins = [],
  currentStreak = 0,
  onCheckin,
}: CheckinCalendarProps) {
  const [currentMonth, setCurrentMonth] = useState(new Date());
  const [todayCheckedIn, setTodayCheckedIn] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const today = new Date();
  const todayStr = today.toISOString().split('T')[0];

  useEffect(() => {
    // Check if already checked in today
    const lastCheckin = localStorage.getItem('lastCheckin');
    if (lastCheckin === todayStr) {
      setTodayCheckedIn(true);
    }
  }, [todayStr]);

  const handleCheckin = async () => {
    if (todayCheckedIn || isLoading) return;

    setIsLoading(true);
    try {
      const response = await fetch('/api/fortune/daily', {
        method: 'POST',
      });

      if (response.ok) {
        localStorage.setItem('lastCheckin', todayStr);
        setTodayCheckedIn(true);
        onCheckin?.();
      }
    } catch (error) {
      console.error('Check-in error:', error);
    } finally {
      setIsLoading(false);
    }
  };

  // Calendar logic
  const year = currentMonth.getFullYear();
  const month = currentMonth.getMonth();
  const firstDay = new Date(year, month, 1).getDay();
  const daysInMonth = new Date(year, month + 1, 0).getDate();

  const prevMonth = () => {
    setCurrentMonth(new Date(year, month - 1, 1));
  };

  const nextMonth = () => {
    setCurrentMonth(new Date(year, month + 1, 1));
  };

  const checkinDates = new Set(checkins.map((c) => c.date));

  const renderCalendar = () => {
    const days = [];
    const weekDays = ['일', '월', '화', '수', '목', '금', '토'];

    // Week day headers
    for (const day of weekDays) {
      days.push(
        <div key={`header-${day}`} className="text-center text-xs text-muted-foreground py-2">
          {day}
        </div>
      );
    }

    // Empty cells for days before first day of month
    for (let i = 0; i < firstDay; i++) {
      days.push(<div key={`empty-${i}`} className="p-2" />);
    }

    // Days of month
    for (let day = 1; day <= daysInMonth; day++) {
      const dateStr = `${year}-${String(month + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
      const isToday = dateStr === todayStr;
      const isCheckedIn = checkinDates.has(dateStr) || (isToday && todayCheckedIn);
      const isPast = new Date(dateStr) < new Date(todayStr);
      const isFuture = new Date(dateStr) > today;

      days.push(
        <div
          key={day}
          className={`relative p-2 text-center rounded-lg transition-colors ${
            isToday
              ? 'bg-primary/10 ring-2 ring-primary'
              : isCheckedIn
              ? 'bg-green-100 dark:bg-green-900/30'
              : isPast
              ? 'text-muted-foreground'
              : ''
          }`}
        >
          <span className={`text-sm ${isFuture ? 'text-muted-foreground/50' : ''}`}>
            {day}
          </span>
          {isCheckedIn && (
            <CheckCircle className="absolute bottom-0 right-0 h-3 w-3 text-green-500" />
          )}
        </div>
      );
    }

    return days;
  };

  const streakDayInWeek = (currentStreak % 7) || 7;
  const nextMilestone = MILESTONE_REWARDS.find((m) => m.days > currentStreak);

  return (
    <div className="space-y-6">
      {/* Streak Card */}
      <Card className="bg-gradient-to-r from-orange-500 to-red-500 text-white border-0">
        <CardContent className="p-6">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-3">
              <div className="p-3 bg-white/20 rounded-full">
                <Flame className="h-8 w-8" />
              </div>
              <div>
                <h3 className="text-2xl font-bold">{currentStreak}일 연속</h3>
                <p className="text-white/80">출석 체크 중!</p>
              </div>
            </div>
            <Button
              onClick={handleCheckin}
              disabled={todayCheckedIn || isLoading}
              className={`${
                todayCheckedIn
                  ? 'bg-white/20 cursor-not-allowed'
                  : 'bg-white text-orange-600 hover:bg-white/90'
              }`}
            >
              {todayCheckedIn ? (
                <>
                  <CheckCircle className="mr-2 h-4 w-4" />
                  출석 완료
                </>
              ) : (
                <>
                  <Gift className="mr-2 h-4 w-4" />
                  출석 체크
                </>
              )}
            </Button>
          </div>

          {/* Weekly Progress */}
          <div className="space-y-2">
            <div className="flex justify-between text-sm">
              <span>주간 보상 진행</span>
              <span>{streakDayInWeek}/7일</span>
            </div>
            <Progress value={(streakDayInWeek / 7) * 100} className="h-2 bg-white/30" />
          </div>
        </CardContent>
      </Card>

      {/* Weekly Rewards */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg flex items-center gap-2">
            <Gift className="h-5 w-5 text-primary" />
            주간 출석 보상
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-7 gap-2">
            {REWARDS.map((reward, index) => {
              const Icon = reward.icon;
              const isEarned = streakDayInWeek > index;
              const isCurrent = streakDayInWeek === index + 1;

              return (
                <div
                  key={reward.day}
                  className={`relative text-center p-3 rounded-lg border-2 transition-all ${
                    isEarned
                      ? 'border-green-500 bg-green-50 dark:bg-green-900/20'
                      : isCurrent
                      ? 'border-primary bg-primary/5'
                      : 'border-muted'
                  }`}
                >
                  <div className="text-xs text-muted-foreground mb-1">Day {reward.day}</div>
                  <Icon
                    className={`h-6 w-6 mx-auto mb-1 ${
                      isEarned ? 'text-green-500' : isCurrent ? 'text-primary' : 'text-muted-foreground'
                    }`}
                  />
                  <div className="text-xs font-medium">{reward.label}</div>
                  {isEarned && (
                    <CheckCircle className="absolute -top-1 -right-1 h-4 w-4 text-green-500 bg-white rounded-full" />
                  )}
                </div>
              );
            })}
          </div>
        </CardContent>
      </Card>

      {/* Milestones */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg flex items-center gap-2">
            <Crown className="h-5 w-5 text-yellow-500" />
            마일스톤 보상
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {MILESTONE_REWARDS.map((milestone) => {
              const Icon = milestone.icon;
              const isEarned = currentStreak >= milestone.days;
              const progress = Math.min((currentStreak / milestone.days) * 100, 100);

              return (
                <div
                  key={milestone.days}
                  className={`flex items-center gap-4 p-3 rounded-lg ${
                    isEarned ? 'bg-yellow-50 dark:bg-yellow-900/20' : 'bg-muted/50'
                  }`}
                >
                  <div
                    className={`p-2 rounded-full ${
                      isEarned ? 'bg-yellow-500 text-white' : 'bg-muted'
                    }`}
                  >
                    <Icon className="h-5 w-5" />
                  </div>
                  <div className="flex-1">
                    <div className="flex justify-between mb-1">
                      <span className="font-medium">{milestone.days}일 연속 출석</span>
                      <Badge variant={isEarned ? 'default' : 'secondary'}>
                        {milestone.reward}
                      </Badge>
                    </div>
                    <Progress value={progress} className="h-1.5" />
                  </div>
                  {isEarned && <CheckCircle className="h-5 w-5 text-green-500" />}
                </div>
              );
            })}
          </div>

          {nextMilestone && (
            <p className="text-sm text-muted-foreground mt-4 text-center">
              다음 마일스톤까지 <strong>{nextMilestone.days - currentStreak}일</strong> 남았습니다!
            </p>
          )}
        </CardContent>
      </Card>

      {/* Calendar */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="text-lg flex items-center gap-2">
              <Calendar className="h-5 w-5 text-primary" />
              출석 캘린더
            </CardTitle>
            <div className="flex items-center gap-2">
              <Button variant="ghost" size="icon" onClick={prevMonth}>
                <ChevronLeft className="h-4 w-4" />
              </Button>
              <span className="font-medium">
                {year}년 {month + 1}월
              </span>
              <Button variant="ghost" size="icon" onClick={nextMonth}>
                <ChevronRight className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-7 gap-1">{renderCalendar()}</div>
          <div className="flex items-center justify-center gap-4 mt-4 text-sm">
            <div className="flex items-center gap-1">
              <div className="w-3 h-3 rounded-full bg-green-500" />
              <span>출석 완료</span>
            </div>
            <div className="flex items-center gap-1">
              <div className="w-3 h-3 rounded-full bg-primary" />
              <span>오늘</span>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
