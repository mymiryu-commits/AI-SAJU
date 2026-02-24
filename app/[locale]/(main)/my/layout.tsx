'use client';

import { useTranslations } from 'next-intl';
import { Link, usePathname } from '@/i18n/routing';
import { cn } from '@/lib/utils';
import {
  LayoutDashboard,
  History,
  Users,
  CreditCard,
  Settings,
  Ticket,
} from 'lucide-react';

const navItems = [
  { href: '/my/dashboard', key: 'dashboard', icon: LayoutDashboard },
  { href: '/my/history', key: 'history', icon: History },
  { href: '/my/family', key: 'family', icon: Users },
  { href: '/my/vouchers', key: 'vouchers', icon: Ticket },
  { href: '/my/subscription', key: 'subscription', icon: CreditCard },
  { href: '/my/settings', key: 'settings', icon: Settings },
];

export default function MyPageLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const t = useTranslations('mypage.tabs');
  const pathname = usePathname();

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex flex-col lg:flex-row gap-8">
        {/* Sidebar */}
        <aside className="lg:w-64 shrink-0">
          <nav className="sticky top-24 space-y-1">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = pathname === item.href;
              return (
                <Link
                  key={item.key}
                  href={item.href}
                  className={cn(
                    'flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium transition-colors',
                    isActive
                      ? 'bg-primary text-primary-foreground'
                      : 'hover:bg-muted'
                  )}
                >
                  <Icon className="h-5 w-5" />
                  {t(item.key as 'dashboard')}
                </Link>
              );
            })}
          </nav>
        </aside>

        {/* Main Content */}
        <main className="flex-1 min-w-0">{children}</main>
      </div>
    </div>
  );
}
