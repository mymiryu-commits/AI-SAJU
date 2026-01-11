'use client';

import { usePathname, useSearchParams } from 'next/navigation';
import { Link } from '@/i18n/routing';
import { cn } from '@/lib/utils';
import {
  Flame,
  PenTool,
  Image,
  Music,
  Globe,
  Code2,
  Briefcase,
  GraduationCap,
  Megaphone,
  Layers,
  FileText,
  BookOpen,
  ShoppingBag,
  Users,
  FileQuestion,
  MessageCircle,
} from 'lucide-react';

export const sidebarCategories = [
  { key: 'all', label: '전체', icon: Flame, href: '/ranking' },
  { key: 'writing', label: '글쓰기', icon: PenTool, href: '/ranking?category=writing' },
  { key: 'image', label: '이미지/영상', icon: Image, href: '/ranking?category=image' },
  { key: 'audio', label: '음원', icon: Music, href: '/ranking?category=audio' },
  { key: 'website', label: '홈페이지', icon: Globe, href: '/ranking?category=website' },
  { key: 'coding', label: 'AI코딩', icon: Code2, href: '/ranking?category=coding' },
  { key: 'automation', label: '업무/자동화', icon: Briefcase, href: '/ranking?category=automation' },
  { key: 'education', label: '교육', icon: GraduationCap, href: '/ranking?category=education' },
  { key: 'marketing', label: '마케팅/광고', icon: Megaphone, href: '/ranking?category=marketing' },
  { key: 'platform', label: 'AI 플랫폼', icon: Layers, href: '/ranking?category=platform' },
];

export const sidebarMenu = [
  { key: 'prompts', label: '프롬프트', icon: FileText, href: '/prompts' },
  { key: 'ebook', label: '수익화 E-Book', icon: BookOpen, href: '/ebook' },
  { key: 'marketplace', label: '판매 사이트', icon: ShoppingBag, href: '/marketplace' },
  { key: 'community', label: '커뮤니티', icon: Users, href: '/community' },
  { key: 'request', label: '자료 요청', icon: FileQuestion, href: '/request' },
];

export function Sidebar() {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const currentCategory = searchParams.get('category') || 'all';

  const isRankingPage = pathname?.includes('/ranking');

  return (
    <aside className="sidebar sidebar-desktop w-64 min-h-screen p-4 sticky top-0 overflow-y-auto">
      <div className="space-y-6">
        {/* AI Categories */}
        <div>
          <h3 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-3 px-3">
            AI 카테고리
          </h3>
          <nav className="space-y-1">
            {sidebarCategories.map((item) => {
              const Icon = item.icon;
              const isActive = isRankingPage && (
                (item.key === 'all' && !searchParams.get('category')) ||
                currentCategory === item.key
              );

              return (
                <Link
                  key={item.key}
                  href={item.href}
                  className={cn(
                    'sidebar-item flex items-center gap-3 px-3 py-2.5 text-sm',
                    isActive && 'active bg-secondary'
                  )}
                >
                  <Icon className={cn(
                    'h-5 w-5',
                    isActive ? 'text-foreground' : 'text-muted-foreground'
                  )} />
                  <span className={cn(
                    isActive ? 'text-foreground font-medium' : 'text-muted-foreground'
                  )}>
                    {item.label}
                  </span>
                </Link>
              );
            })}
          </nav>
        </div>

        {/* Divider */}
        <div className="border-t border-border" />

        {/* Menu Items */}
        <div>
          <h3 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-3 px-3">
            메뉴
          </h3>
          <nav className="space-y-1">
            {sidebarMenu.map((item) => {
              const Icon = item.icon;
              const isActive = pathname?.includes(item.href);

              return (
                <Link
                  key={item.key}
                  href={item.href}
                  className={cn(
                    'sidebar-item flex items-center gap-3 px-3 py-2.5 text-sm',
                    isActive && 'active bg-secondary'
                  )}
                >
                  <Icon className={cn(
                    'h-5 w-5',
                    isActive ? 'text-foreground' : 'text-muted-foreground'
                  )} />
                  <span className={cn(
                    isActive ? 'text-foreground font-medium' : 'text-muted-foreground'
                  )}>
                    {item.label}
                  </span>
                </Link>
              );
            })}
          </nav>
        </div>
      </div>

      {/* AI Chat Button */}
      <div className="mt-8">
        <button className="ai-chat-btn w-full justify-center">
          <MessageCircle className="h-5 w-5" />
          <span>AI 상담</span>
        </button>
      </div>
    </aside>
  );
}
