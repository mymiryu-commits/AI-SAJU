'use client';

import { useTranslations } from 'next-intl';
import { Link } from '@/i18n/routing';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import {
  Crown,
  Coins,
  BarChart3,
  Calendar,
  ArrowRight,
  Sparkles,
  Star,
  Gift,
  Users,
  Clock,
} from 'lucide-react';

// Mock user data
const mockUser = {
  name: 'John Doe',
  email: 'john@example.com',
  membership: 'free',
  coins: 150,
  totalAnalyses: 12,
  streak: 5,
  joinDate: '2024-01-15',
  recentAnalyses: [
    { id: '1', type: 'saju', date: '2025-01-09', score: 85 },
    { id: '2', type: 'face', date: '2025-01-08', score: 82 },
    { id: '3', type: 'daily', date: '2025-01-07', score: 78 },
  ],
  referralCode: 'JOHN2025',
  referralCount: 3,
};

export default function DashboardPage() {
  const t = useTranslations('mypage.dashboard');

  return (
    <div className="space-y-6">
      {/* Welcome Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h1 className="text-2xl md:text-3xl font-bold">
            {t('welcome', { name: mockUser.name })}
          </h1>
          <p className="text-muted-foreground">
            Here&apos;s an overview of your account
          </p>
        </div>
        <Link href="/fortune/free">
          <Button>
            <Sparkles className="mr-2 h-4 w-4" />
            Check Today&apos;s Fortune
          </Button>
        </Link>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center gap-4">
              <div className="p-3 rounded-lg bg-purple-100 dark:bg-purple-900/20">
                <Crown className="h-6 w-6 text-purple-500" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">{t('membership')}</p>
                <p className="text-xl font-bold capitalize">{mockUser.membership}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center gap-4">
              <div className="p-3 rounded-lg bg-yellow-100 dark:bg-yellow-900/20">
                <Coins className="h-6 w-6 text-yellow-500" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">{t('coins')}</p>
                <p className="text-xl font-bold">{mockUser.coins}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center gap-4">
              <div className="p-3 rounded-lg bg-blue-100 dark:bg-blue-900/20">
                <BarChart3 className="h-6 w-6 text-blue-500" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">{t('analyses')}</p>
                <p className="text-xl font-bold">{mockUser.totalAnalyses}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center gap-4">
              <div className="p-3 rounded-lg bg-green-100 dark:bg-green-900/20">
                <Calendar className="h-6 w-6 text-green-500" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">{t('streak')}</p>
                <p className="text-xl font-bold">{mockUser.streak} days</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Main Content Grid */}
      <div className="grid lg:grid-cols-2 gap-6">
        {/* Recent Analyses */}
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle>Recent Analyses</CardTitle>
              <Link href="/my/history">
                <Button variant="ghost" size="sm">
                  View All
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </Link>
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {mockUser.recentAnalyses.map((analysis) => (
                <div
                  key={analysis.id}
                  className="flex items-center justify-between p-4 rounded-lg bg-muted"
                >
                  <div className="flex items-center gap-4">
                    <div className="p-2 rounded-lg bg-background">
                      <Star className="h-5 w-5 text-primary" />
                    </div>
                    <div>
                      <p className="font-medium capitalize">{analysis.type} Analysis</p>
                      <p className="text-sm text-muted-foreground">{analysis.date}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="font-bold text-lg">{analysis.score}</p>
                    <p className="text-xs text-muted-foreground">score</p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Quick Actions */}
        <Card>
          <CardHeader>
            <CardTitle>Quick Actions</CardTitle>
            <CardDescription>Start a new analysis or explore features</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 gap-4">
              <Link href="/fortune/saju">
                <div className="p-4 rounded-lg border hover:border-primary transition-colors cursor-pointer text-center">
                  <Sparkles className="h-8 w-8 mx-auto mb-2 text-purple-500" />
                  <p className="font-medium">Saju Analysis</p>
                </div>
              </Link>
              <Link href="/fortune/face">
                <div className="p-4 rounded-lg border hover:border-primary transition-colors cursor-pointer text-center">
                  <Star className="h-8 w-8 mx-auto mb-2 text-blue-500" />
                  <p className="font-medium">Face Reading</p>
                </div>
              </Link>
              <Link href="/fortune/compatibility">
                <div className="p-4 rounded-lg border hover:border-primary transition-colors cursor-pointer text-center">
                  <Users className="h-8 w-8 mx-auto mb-2 text-pink-500" />
                  <p className="font-medium">Compatibility</p>
                </div>
              </Link>
              <Link href="/pricing">
                <div className="p-4 rounded-lg border hover:border-primary transition-colors cursor-pointer text-center">
                  <Crown className="h-8 w-8 mx-auto mb-2 text-yellow-500" />
                  <p className="font-medium">Upgrade Plan</p>
                </div>
              </Link>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Referral Card */}
      <Card className="bg-gradient-to-r from-purple-50 to-pink-50 dark:from-purple-950/20 dark:to-pink-950/20">
        <CardContent className="p-6">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div className="flex items-center gap-4">
              <div className="p-3 rounded-lg bg-purple-500 text-white">
                <Gift className="h-6 w-6" />
              </div>
              <div>
                <h3 className="font-bold text-lg">Invite Friends & Earn Rewards</h3>
                <p className="text-muted-foreground">
                  Share your code and get 100 coins for each friend who signs up
                </p>
              </div>
            </div>
            <div className="flex items-center gap-4">
              <div className="text-center">
                <p className="text-2xl font-bold text-primary">{mockUser.referralCount}</p>
                <p className="text-xs text-muted-foreground">Referrals</p>
              </div>
              <div className="px-4 py-2 rounded-lg bg-background font-mono">
                {mockUser.referralCode}
              </div>
              <Button>Copy Code</Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Upgrade Banner for Free Users */}
      {mockUser.membership === 'free' && (
        <Card className="border-primary">
          <CardContent className="p-6">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
              <div>
                <Badge className="mb-2 bg-primary">Limited Offer</Badge>
                <h3 className="font-bold text-lg">Upgrade to Pro for 30% off</h3>
                <p className="text-muted-foreground">
                  Get unlimited analyses, voice reports, and priority support
                </p>
              </div>
              <Link href="/pricing">
                <Button size="lg">
                  Upgrade Now
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </Link>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
