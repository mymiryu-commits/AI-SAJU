'use client';

import { useState } from 'react';
import { useTranslations } from 'next-intl';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Input } from '@/components/ui/input';
import {
  Users,
  Copy,
  Share2,
  Gift,
  TrendingUp,
  Star,
  Crown,
  ChevronRight,
  CheckCircle,
  MessageCircle,
  Link as LinkIcon,
} from 'lucide-react';

// Mock data
const referralData = {
  code: 'AIRANK2025ABC',
  totalReferrals: 12,
  pendingRewards: 45000,
  earnedRewards: 127500,
  level: 2,
  referrals: [
    { id: 1, name: '김**', date: '2025-01-08', status: 'completed', reward: 15000 },
    { id: 2, name: '이**', date: '2025-01-05', status: 'completed', reward: 12000 },
    { id: 3, name: '박**', date: '2025-01-03', status: 'pending', reward: 0 },
    { id: 4, name: '최**', date: '2024-12-28', status: 'completed', reward: 18000 },
    { id: 5, name: '정**', date: '2024-12-25', status: 'completed', reward: 9900 },
  ],
};

const LEVELS = [
  { level: 1, minReferrals: 0, commission: 20, label: '브론즈' },
  { level: 2, minReferrals: 5, commission: 25, label: '실버' },
  { level: 3, minReferrals: 20, commission: 30, label: '골드' },
  { level: 4, minReferrals: 50, commission: 35, label: '플래티넘' },
];

export default function ReferralPage() {
  const t = useTranslations();
  const [copied, setCopied] = useState(false);

  const currentLevel = LEVELS.find((l) => l.level === referralData.level) || LEVELS[0];
  const nextLevel = LEVELS.find((l) => l.level === referralData.level + 1);

  const copyToClipboard = async () => {
    try {
      await navigator.clipboard.writeText(
        `https://ai-rank.kr/signup?ref=${referralData.code}`
      );
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error('Copy failed:', err);
    }
  };

  const shareKakao = () => {
    // Kakao share implementation
    console.log('Share to Kakao');
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold mb-2">친구 초대</h1>
        <p className="text-muted-foreground">
          친구를 초대하고 결제액의 최대 35%를 적립받으세요!
        </p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4 text-center">
            <Users className="h-8 w-8 mx-auto mb-2 text-blue-500" />
            <div className="text-2xl font-bold">{referralData.totalReferrals}</div>
            <div className="text-sm text-muted-foreground">총 초대</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 text-center">
            <TrendingUp className="h-8 w-8 mx-auto mb-2 text-green-500" />
            <div className="text-2xl font-bold">₩{referralData.earnedRewards.toLocaleString()}</div>
            <div className="text-sm text-muted-foreground">누적 적립</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 text-center">
            <Gift className="h-8 w-8 mx-auto mb-2 text-purple-500" />
            <div className="text-2xl font-bold">₩{referralData.pendingRewards.toLocaleString()}</div>
            <div className="text-sm text-muted-foreground">대기 중</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 text-center">
            <Star className="h-8 w-8 mx-auto mb-2 text-yellow-500" />
            <div className="text-2xl font-bold">{currentLevel.commission}%</div>
            <div className="text-sm text-muted-foreground">현재 수수료</div>
          </CardContent>
        </Card>
      </div>

      {/* Referral Code */}
      <Card className="bg-gradient-to-r from-purple-50 to-pink-50 dark:from-purple-950/20 dark:to-pink-950/20 border-purple-200">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <LinkIcon className="h-5 w-5 text-purple-500" />
            내 추천 코드
          </CardTitle>
          <CardDescription>
            친구에게 추천 링크를 공유하면 자동으로 연결됩니다
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex gap-2 mb-4">
            <div className="flex-1">
              <Input
                value={`https://ai-rank.kr/signup?ref=${referralData.code}`}
                readOnly
                className="bg-white dark:bg-background"
              />
            </div>
            <Button onClick={copyToClipboard} variant={copied ? 'default' : 'outline'}>
              {copied ? (
                <>
                  <CheckCircle className="mr-2 h-4 w-4" />
                  복사됨
                </>
              ) : (
                <>
                  <Copy className="mr-2 h-4 w-4" />
                  복사
                </>
              )}
            </Button>
          </div>

          <div className="flex gap-2">
            <Button onClick={shareKakao} className="flex-1 bg-yellow-400 hover:bg-yellow-500 text-black">
              <MessageCircle className="mr-2 h-4 w-4" />
              카카오톡 공유
            </Button>
            <Button variant="outline" className="flex-1">
              <Share2 className="mr-2 h-4 w-4" />
              다른 방법으로 공유
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Level Progress */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Crown className="h-5 w-5 text-yellow-500" />
            추천인 레벨
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center gap-4 mb-6">
            <div className="p-4 rounded-full bg-gradient-to-r from-purple-500 to-pink-500 text-white">
              <Crown className="h-8 w-8" />
            </div>
            <div>
              <Badge className="mb-1">Lv.{currentLevel.level} {currentLevel.label}</Badge>
              <p className="text-sm text-muted-foreground">
                결제액의 <strong>{currentLevel.commission}%</strong>를 적립받습니다
              </p>
            </div>
          </div>

          {nextLevel && (
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span>다음 레벨까지</span>
                <span>
                  {referralData.totalReferrals}/{nextLevel.minReferrals}명
                </span>
              </div>
              <Progress
                value={(referralData.totalReferrals / nextLevel.minReferrals) * 100}
                className="h-2"
              />
              <p className="text-xs text-muted-foreground text-center">
                {nextLevel.minReferrals - referralData.totalReferrals}명 더 초대하면{' '}
                <strong>{nextLevel.commission}%</strong> 적립!
              </p>
            </div>
          )}

          {/* Level Tiers */}
          <div className="grid grid-cols-4 gap-2 mt-6">
            {LEVELS.map((level) => {
              const isActive = referralData.level >= level.level;
              return (
                <div
                  key={level.level}
                  className={`text-center p-3 rounded-lg border-2 ${
                    isActive
                      ? 'border-primary bg-primary/5'
                      : 'border-muted'
                  }`}
                >
                  <div className="text-xs text-muted-foreground">Lv.{level.level}</div>
                  <div className="font-bold">{level.label}</div>
                  <div className="text-sm text-primary">{level.commission}%</div>
                  <div className="text-xs text-muted-foreground">{level.minReferrals}명+</div>
                </div>
              );
            })}
          </div>
        </CardContent>
      </Card>

      {/* Referral Benefits */}
      <Card>
        <CardHeader>
          <CardTitle>추천 혜택</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid md:grid-cols-2 gap-4">
            <div className="p-4 rounded-lg bg-blue-50 dark:bg-blue-950/20 border border-blue-200">
              <h4 className="font-semibold text-blue-700 dark:text-blue-300 mb-2">
                🎁 신규 가입자 혜택
              </h4>
              <ul className="text-sm space-y-1 text-blue-600 dark:text-blue-400">
                <li>• 가입 즉시 <strong>200P</strong> 지급</li>
                <li>• 추천인 코드 입력 시 추가 혜택</li>
                <li>• 첫 결제 10% 할인</li>
              </ul>
            </div>
            <div className="p-4 rounded-lg bg-purple-50 dark:bg-purple-950/20 border border-purple-200">
              <h4 className="font-semibold text-purple-700 dark:text-purple-300 mb-2">
                💰 추천인 혜택
              </h4>
              <ul className="text-sm space-y-1 text-purple-600 dark:text-purple-400">
                <li>• 친구 가입 시 <strong>300P</strong> 적립</li>
                <li>• 레벨업 시 수수료율 상승 (최대 35%)</li>
                <li>• 월간 TOP 추천인 특별 혜택</li>
              </ul>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Referral History */}
      <Card>
        <CardHeader>
          <CardTitle>초대 내역</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {referralData.referrals.map((referral) => (
              <div
                key={referral.id}
                className="flex items-center justify-between p-3 rounded-lg bg-muted/50"
              >
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-gradient-to-br from-purple-400 to-pink-400 flex items-center justify-center text-white font-bold">
                    {referral.name.charAt(0)}
                  </div>
                  <div>
                    <div className="font-medium">{referral.name}</div>
                    <div className="text-sm text-muted-foreground">{referral.date}</div>
                  </div>
                </div>
                <div className="text-right">
                  {referral.status === 'completed' ? (
                    <>
                      <Badge className="bg-green-500">적립 완료</Badge>
                      <div className="text-sm font-medium text-green-600 mt-1">
                        +₩{referral.reward.toLocaleString()}
                      </div>
                    </>
                  ) : (
                    <Badge variant="secondary">대기 중</Badge>
                  )}
                </div>
              </div>
            ))}
          </div>

          {referralData.referrals.length === 0 && (
            <div className="text-center py-8 text-muted-foreground">
              아직 초대한 친구가 없습니다.
              <br />
              지금 친구를 초대해보세요!
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
