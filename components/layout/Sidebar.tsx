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
  Sparkles,
  ChevronRight,
} from 'lucide-react';

// Category colors for sidebar icons
const categoryIconColors: Record<string, string> = {
  all: 'text-amber-500',
  writing: 'text-blue-500',
  image: 'text-purple-500',
  audio: 'text-pink-500',
  website: 'text-cyan-500',
  coding: 'text-green-500',
  automation: 'text-orange-500',
  education: 'text-indigo-500',
  marketing: 'text-rose-500',
  platform: 'text-amber-500',
};

const categoryBgColors: Record<string, string> = {
  all: 'bg-amber-500/10',
  writing: 'bg-blue-500/10',
  image: 'bg-purple-500/10',
  audio: 'bg-pink-500/10',
  website: 'bg-cyan-500/10',
  coding: 'bg-green-500/10',
  automation: 'bg-orange-500/10',
  education: 'bg-indigo-500/10',
  marketing: 'bg-rose-500/10',
  platform: 'bg-amber-500/10',
};

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
    <aside className="sidebar sidebar-desktop w-72 min-h-screen sticky top-0 overflow-y-auto">
      {/* Premium Header */}
      <div className="p-5 border-b border-border/50">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-amber-400 to-orange-500 flex items-center justify-center shadow-lg shadow-amber-500/20">
            <Sparkles className="h-5 w-5 text-white" />
          </div>
          <div>
            <h2 className="font-bold text-foreground">AI 도구 랭킹</h2>
            <p className="text-xs text-muted-foreground">최고의 AI 도구를 찾아보세요</p>
          </div>
        </div>
      </div>

      <div className="p-4 space-y-6">
        {/* AI Categories */}
        <div>
          <div className="flex items-center justify-between mb-3 px-2">
            <h3 className="text-[11px] font-semibold text-muted-foreground uppercase tracking-widest">
              카테고리
            </h3>
            <span className="text-[10px] text-muted-foreground/60">
              {sidebarCategories.length}
            </span>
          </div>
          <nav className="space-y-1">
            {sidebarCategories.map((item) => {
              const Icon = item.icon;
              const isActive = isRankingPage && (
                (item.key === 'all' && !searchParams.get('category')) ||
                currentCategory === item.key
              );
              const iconColor = categoryIconColors[item.key] || 'text-muted-foreground';
              const bgColor = categoryBgColors[item.key] || 'bg-secondary';

              return (
                <Link
                  key={item.key}
                  href={item.href}
                  className={cn(
                    'group flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm transition-all duration-200',
                    isActive
                      ? 'bg-gradient-to-r from-primary/20 to-primary/5 border border-primary/20 shadow-sm'
                      : 'hover:bg-secondary/80 border border-transparent'
                  )}
                >
                  <div className={cn(
                    'w-8 h-8 rounded-lg flex items-center justify-center transition-all duration-200',
                    isActive ? bgColor : 'bg-secondary group-hover:bg-secondary/80'
                  )}>
                    <Icon className={cn(
                      'h-4 w-4 transition-colors',
                      isActive ? iconColor : 'text-muted-foreground group-hover:' + iconColor
                    )} />
                  </div>
                  <span className={cn(
                    'flex-1 transition-colors',
                    isActive ? 'text-foreground font-semibold' : 'text-muted-foreground group-hover:text-foreground'
                  )}>
                    {item.label}
                  </span>
                  {isActive && (
                    <ChevronRight className="h-4 w-4 text-primary" />
                  )}
                </Link>
              );
            })}
          </nav>
        </div>

        {/* Elegant Divider */}
        <div className="relative py-2">
          <div className="absolute inset-0 flex items-center px-4">
            <div className="w-full border-t border-border/50" />
          </div>
          <div className="relative flex justify-center">
            <span className="bg-sidebar-bg px-3 text-[10px] text-muted-foreground/60 uppercase tracking-widest">
              서비스
            </span>
          </div>
        </div>

        {/* Menu Items */}
        <div>
          <nav className="space-y-1">
            {sidebarMenu.map((item) => {
              const Icon = item.icon;
              const isActive = pathname?.includes(item.href);

              return (
                <Link
                  key={item.key}
                  href={item.href}
                  className={cn(
                    'group flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm transition-all duration-200',
                    isActive
                      ? 'bg-gradient-to-r from-secondary to-secondary/50 border border-border shadow-sm'
                      : 'hover:bg-secondary/80 border border-transparent'
                  )}
                >
                  <div className={cn(
                    'w-8 h-8 rounded-lg flex items-center justify-center transition-all duration-200',
                    isActive ? 'bg-primary/10' : 'bg-secondary group-hover:bg-secondary/80'
                  )}>
                    <Icon className={cn(
                      'h-4 w-4 transition-colors',
                      isActive ? 'text-primary' : 'text-muted-foreground group-hover:text-foreground'
                    )} />
                  </div>
                  <span className={cn(
                    'flex-1 transition-colors',
                    isActive ? 'text-foreground font-semibold' : 'text-muted-foreground group-hover:text-foreground'
                  )}>
                    {item.label}
                  </span>
                  {isActive && (
                    <div className="w-1.5 h-1.5 rounded-full bg-primary" />
                  )}
                </Link>
              );
            })}
          </nav>
        </div>

        {/* Premium Card */}
        <div className="mt-6 p-4 rounded-2xl bg-gradient-to-br from-primary/10 via-primary/5 to-transparent border border-primary/20">
          <div className="flex items-center gap-2 mb-2">
            <div className="w-6 h-6 rounded-full bg-primary/20 flex items-center justify-center">
              <Sparkles className="h-3 w-3 text-primary" />
            </div>
            <span className="text-xs font-semibold text-foreground">PRO 업그레이드</span>
          </div>
          <p className="text-xs text-muted-foreground mb-3 leading-relaxed">
            프리미엄 기능을 이용하고 더 많은 AI 도구 정보를 확인하세요.
          </p>
          <button className="w-full py-2 px-3 rounded-lg bg-primary text-primary-foreground text-xs font-semibold hover:bg-primary/90 transition-colors">
            업그레이드
          </button>
        </div>
      </div>

      {/* AI Chat Button - Fixed Position */}
      <div className="fixed bottom-6 left-6 z-50">
        <button className="flex items-center gap-2 px-5 py-3 rounded-full bg-gradient-to-r from-amber-500 to-orange-500 text-white font-medium shadow-lg shadow-amber-500/30 hover:shadow-amber-500/40 hover:scale-105 transition-all duration-200">
          <MessageCircle className="h-5 w-5" />
          <span>AI 상담</span>
        </button>
      </div>
    </aside>
  );
}
