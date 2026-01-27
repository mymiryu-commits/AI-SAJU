'use client';

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import {
  LayoutDashboard,
  DollarSign,
  Users,
  TrendingUp,
  Activity,
  Zap,
  ArrowUpRight,
  ArrowDownRight,
  Sparkles,
} from 'lucide-react';
import Link from 'next/link';

const quickLinks = [
  {
    title: '사주 분석 테스트',
    description: '프리미엄 분석 테스트',
    href: '/fortune/integrated?admin_test=true',
    icon: Sparkles,
    color: 'text-pink-600',
    bgColor: 'bg-pink-100 dark:bg-pink-900/30',
  },
  {
    title: '가격 설정',
    description: '서비스 가격 관리',
    href: '/admin/pricing',
    icon: DollarSign,
    color: 'text-green-600',
    bgColor: 'bg-green-100 dark:bg-green-900/30',
  },
  {
    title: '배너 관리',
    description: '프로모션 배너 설정',
    href: '/admin/banners',
    icon: Zap,
    color: 'text-purple-600',
    bgColor: 'bg-purple-100 dark:bg-purple-900/30',
  },
  {
    title: '사용자 관리',
    description: '회원 정보 조회',
    href: '/admin/users',
    icon: Users,
    color: 'text-blue-600',
    bgColor: 'bg-blue-100 dark:bg-blue-900/30',
  },
  {
    title: '통계',
    description: '서비스 통계 보기',
    href: '/admin/analytics',
    icon: TrendingUp,
    color: 'text-orange-600',
    bgColor: 'bg-orange-100 dark:bg-orange-900/30',
  },
];

const stats = [
  {
    title: '총 사용자',
    value: '12,345',
    change: '+12%',
    isUp: true,
    icon: Users,
  },
  {
    title: '오늘 분석',
    value: '234',
    change: '+8%',
    isUp: true,
    icon: Activity,
  },
  {
    title: '오늘 매출',
    value: '₩1,234,500',
    change: '-3%',
    isUp: false,
    icon: DollarSign,
  },
  {
    title: '전환율',
    value: '4.2%',
    change: '+0.5%',
    isUp: true,
    icon: TrendingUp,
  },
];

export default function AdminDashboardPage() {
  return (
    <div className="space-y-6">
      {/* 헤더 */}
      <div>
        <h1 className="text-2xl font-bold flex items-center gap-2">
          <LayoutDashboard className="h-6 w-6 text-purple-600" />
          관리자 대시보드
        </h1>
        <p className="text-muted-foreground text-sm mt-1">
          AI-SAJU 서비스 관리 및 통계
        </p>
      </div>

      {/* 통계 카드 */}
      <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map((stat) => (
          <Card key={stat.title}>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <stat.icon className="h-5 w-5 text-muted-foreground" />
                <Badge
                  variant={stat.isUp ? 'default' : 'destructive'}
                  className="text-xs"
                >
                  {stat.isUp ? (
                    <ArrowUpRight className="h-3 w-3 mr-1" />
                  ) : (
                    <ArrowDownRight className="h-3 w-3 mr-1" />
                  )}
                  {stat.change}
                </Badge>
              </div>
              <div className="mt-3">
                <p className="text-2xl font-bold">{stat.value}</p>
                <p className="text-xs text-muted-foreground">{stat.title}</p>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* 빠른 링크 */}
      <div>
        <h2 className="text-lg font-semibold mb-4">빠른 메뉴</h2>
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {quickLinks.map((link) => (
            <Link key={link.href} href={link.href}>
              <Card className="hover:shadow-md transition-shadow cursor-pointer h-full">
                <CardContent className="p-4">
                  <div className={`w-10 h-10 rounded-lg ${link.bgColor} flex items-center justify-center mb-3`}>
                    <link.icon className={`h-5 w-5 ${link.color}`} />
                  </div>
                  <h3 className="font-medium">{link.title}</h3>
                  <p className="text-xs text-muted-foreground mt-1">
                    {link.description}
                  </p>
                </CardContent>
              </Card>
            </Link>
          ))}
        </div>
      </div>

      {/* 최근 활동 */}
      <div className="grid lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="text-base">최근 분석</CardTitle>
            <CardDescription>최근 수행된 분석 목록</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {[1, 2, 3, 4, 5].map((i) => (
                <div key={i} className="flex items-center justify-between py-2 border-b last:border-0">
                  <div>
                    <p className="text-sm font-medium">사주 기본 분석</p>
                    <p className="text-xs text-muted-foreground">user{i}@email.com</p>
                  </div>
                  <div className="text-right">
                    <p className="text-sm">₩5,900</p>
                    <p className="text-xs text-muted-foreground">{i}분 전</p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-base">시스템 상태</CardTitle>
            <CardDescription>서비스 운영 현황</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-sm">API 서버</span>
                <Badge variant="default" className="bg-green-500">정상</Badge>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm">데이터베이스</span>
                <Badge variant="default" className="bg-green-500">정상</Badge>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm">결제 시스템</span>
                <Badge variant="default" className="bg-green-500">정상</Badge>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm">AI 분석 엔진</span>
                <Badge variant="default" className="bg-green-500">정상</Badge>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm">로또 데이터</span>
                <Badge variant="default" className="bg-green-500">최신</Badge>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
