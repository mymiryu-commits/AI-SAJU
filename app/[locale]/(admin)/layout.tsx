'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/lib/hooks/useAuth';
import {
  Settings,
  DollarSign,
  Image,
  Flag,
  ChevronLeft,
  Menu,
  X,
  LayoutDashboard,
  Users,
  BarChart3,
  Key,
  FileText,
  Loader2,
  ShieldAlert,
} from 'lucide-react';

const adminNavItems = [
  {
    title: '대시보드',
    href: '/admin',
    icon: LayoutDashboard,
  },
  {
    title: '가격 설정',
    href: '/admin/pricing',
    icon: DollarSign,
  },
  {
    title: '배너 관리',
    href: '/admin/banners',
    icon: Image,
  },
  {
    title: '기능 플래그',
    href: '/admin/features',
    icon: Flag,
  },
  {
    title: '사용자 관리',
    href: '/admin/users',
    icon: Users,
  },
  {
    title: '생성 로그',
    href: '/admin/generation-logs',
    icon: FileText,
  },
  {
    title: 'API 키 설정',
    href: '/admin/api-keys',
    icon: Key,
  },
  {
    title: '통계',
    href: '/admin/analytics',
    icon: BarChart3,
  },
];

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const router = useRouter();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const { user, isLoading, isAdmin } = useAuth();

  // 인증 체크 - 클라이언트 사이드 fallback
  useEffect(() => {
    if (!isLoading) {
      if (!user) {
        // 로그인 안됨 - 로그인 페이지로 리다이렉트
        router.replace('/login?redirect=' + encodeURIComponent(pathname));
      } else if (!isAdmin) {
        // Admin 아님 - 홈으로 리다이렉트
        router.replace('/');
      }
    }
  }, [user, isLoading, isAdmin, router, pathname]);

  // 로딩 중
  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="h-8 w-8 animate-spin text-purple-600 mx-auto mb-4" />
          <p className="text-gray-600 dark:text-gray-400">인증 확인 중...</p>
        </div>
      </div>
    );
  }

  // 인증 실패
  if (!user || !isAdmin) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center">
        <div className="text-center">
          <ShieldAlert className="h-12 w-12 text-red-500 mx-auto mb-4" />
          <h1 className="text-xl font-bold text-gray-900 dark:text-white mb-2">
            접근 권한이 없습니다
          </h1>
          <p className="text-gray-600 dark:text-gray-400 mb-4">
            관리자 계정으로 로그인해주세요.
          </p>
          <Button onClick={() => router.push('/login')}>
            로그인 페이지로 이동
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      {/* Mobile sidebar backdrop */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 z-40 bg-black/50 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside
        className={cn(
          'fixed inset-y-0 left-0 z-50 w-64 transform bg-white dark:bg-gray-800 shadow-lg transition-transform lg:translate-x-0',
          sidebarOpen ? 'translate-x-0' : '-translate-x-full'
        )}
      >
        <div className="flex h-16 items-center justify-between px-4 border-b">
          <div className="flex items-center gap-2">
            <Settings className="h-6 w-6 text-purple-600" />
            <span className="font-bold text-lg">관리자</span>
          </div>
          <Button
            variant="ghost"
            size="icon"
            className="lg:hidden"
            onClick={() => setSidebarOpen(false)}
          >
            <X className="h-5 w-5" />
          </Button>
        </div>

        <nav className="p-4 space-y-1 max-h-[calc(100vh-180px)] overflow-y-auto">
          {adminNavItems.map((item) => {
            const isActive = pathname.endsWith(item.href) ||
              (item.href === '/admin' && pathname.endsWith('/admin'));
            return (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  'flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors',
                  isActive
                    ? 'bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-300'
                    : 'text-gray-600 hover:bg-gray-100 dark:text-gray-400 dark:hover:bg-gray-700/50'
                )}
              >
                <item.icon className="h-5 w-5" />
                {item.title}
              </Link>
            );
          })}
        </nav>

        <div className="absolute bottom-4 left-4 right-4 space-y-2">
          <div className="text-xs text-gray-500 dark:text-gray-400 px-2">
            {user.email}
          </div>
          <Link href="/">
            <Button variant="outline" className="w-full">
              <ChevronLeft className="h-4 w-4 mr-2" />
              사이트로 돌아가기
            </Button>
          </Link>
        </div>
      </aside>

      {/* Main content */}
      <div className="lg:pl-64">
        {/* Top bar */}
        <header className="sticky top-0 z-30 flex h-16 items-center gap-4 border-b bg-white dark:bg-gray-800 px-4 lg:px-6">
          <Button
            variant="ghost"
            size="icon"
            className="lg:hidden"
            onClick={() => setSidebarOpen(true)}
          >
            <Menu className="h-5 w-5" />
          </Button>
          <div className="flex-1">
            <h1 className="text-lg font-semibold">AI-SAJU 관리자</h1>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-sm text-green-600 bg-green-100 px-2 py-1 rounded-full">
              Admin
            </span>
          </div>
        </header>

        {/* Page content */}
        <main className="p-4 lg:p-6">
          {children}
        </main>
      </div>
    </div>
  );
}
