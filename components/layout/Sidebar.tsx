'use client';

import { usePathname, useSearchParams } from 'next/navigation';
import { Link } from '@/i18n/routing';
import { cn } from '@/lib/utils';
import { useAIShortcuts } from '@/lib/hooks/useAIShortcuts';
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
  Sparkles,
  ChevronRight,
  Gift,
  ExternalLink,
} from 'lucide-react';

// Category colors for sidebar icons
const categoryIconColors: Record<string, string> = {
  all: 'text-amber-500',
  free: 'text-emerald-500',
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
  free: 'bg-emerald-500/10',
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
  { key: 'free', label: '무료 AI', icon: Gift, href: '/ranking?category=free' },
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
  const { shortcuts: aiShortcuts } = useAIShortcuts();

  const isRankingPage = pathname?.includes('/ranking');

  return (
    <aside className="sidebar sidebar-desktop w-64 min-h-screen sticky top-0 overflow-y-auto">
      {/* Premium Header */}
      <div className="p-4 border-b border-border/50">
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

      <div className="p-3 space-y-5">
        {/* AI Categories */}
        <div>
          <div className="flex items-center justify-between mb-2 px-2">
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
                    'group flex items-center gap-2.5 px-2.5 py-2 rounded-xl text-sm transition-all duration-300',
                    isActive
                      ? 'bg-gradient-to-r from-amber-500/20 to-orange-500/10 border border-amber-300/30 shadow-sm'
                      : 'bg-gradient-to-r from-amber-50/80 via-yellow-50/60 to-green-50/50 dark:from-amber-900/20 dark:via-yellow-900/15 dark:to-green-900/10 border border-amber-100/50 dark:border-amber-800/30 hover:from-amber-100/90 hover:via-yellow-100/70 hover:to-green-100/60 dark:hover:from-amber-900/30 dark:hover:via-yellow-900/25 dark:hover:to-green-900/20 hover:border-amber-200/60'
                  )}
                >
                  <div className={cn(
                    'w-7 h-7 rounded-lg flex items-center justify-center transition-all duration-200',
                    isActive ? bgColor : 'bg-white/60 dark:bg-gray-800/60 group-hover:bg-amber-100/60 dark:group-hover:bg-amber-900/30'
                  )}>
                    <Icon className={cn(
                      'h-3.5 w-3.5 transition-colors',
                      isActive ? iconColor : 'text-muted-foreground group-hover:text-amber-600 dark:group-hover:text-amber-400'
                    )} />
                  </div>
                  <span className={cn(
                    'flex-1 transition-colors text-[13px]',
                    isActive ? 'text-amber-700 dark:text-amber-300 font-semibold' : 'text-muted-foreground group-hover:text-amber-700 dark:group-hover:text-amber-300'
                  )}>
                    {item.label}
                  </span>
                  {isActive && (
                    <ChevronRight className="h-3.5 w-3.5 text-amber-500" />
                  )}
                </Link>
              );
            })}
          </nav>
        </div>

        {/* Elegant Divider */}
        <div className="relative py-1">
          <div className="absolute inset-0 flex items-center px-3">
            <div className="w-full border-t border-border/50" />
          </div>
          <div className="relative flex justify-center">
            <span className="bg-sidebar-bg px-2 text-[10px] text-muted-foreground/60 uppercase tracking-widest">
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
                    'group flex items-center gap-2.5 px-2.5 py-2 rounded-xl text-sm transition-all duration-300',
                    isActive
                      ? 'bg-gradient-to-r from-amber-500/20 to-orange-500/10 border border-amber-300/30 shadow-sm'
                      : 'bg-gradient-to-r from-amber-50/80 via-yellow-50/60 to-green-50/50 dark:from-amber-900/20 dark:via-yellow-900/15 dark:to-green-900/10 border border-amber-100/50 dark:border-amber-800/30 hover:from-amber-100/90 hover:via-yellow-100/70 hover:to-green-100/60 dark:hover:from-amber-900/30 dark:hover:via-yellow-900/25 dark:hover:to-green-900/20 hover:border-amber-200/60'
                  )}
                >
                  <div className={cn(
                    'w-7 h-7 rounded-lg flex items-center justify-center transition-all duration-200',
                    isActive ? 'bg-amber-500/10' : 'bg-white/60 dark:bg-gray-800/60 group-hover:bg-amber-100/60 dark:group-hover:bg-amber-900/30'
                  )}>
                    <Icon className={cn(
                      'h-3.5 w-3.5 transition-colors',
                      isActive ? 'text-amber-600' : 'text-muted-foreground group-hover:text-amber-600 dark:group-hover:text-amber-400'
                    )} />
                  </div>
                  <span className={cn(
                    'flex-1 transition-colors text-[13px]',
                    isActive ? 'text-amber-700 dark:text-amber-300 font-semibold' : 'text-muted-foreground group-hover:text-amber-700 dark:group-hover:text-amber-300'
                  )}>
                    {item.label}
                  </span>
                  {isActive && (
                    <div className="w-1.5 h-1.5 rounded-full bg-amber-500" />
                  )}
                </Link>
              );
            })}
          </nav>
        </div>

        {/* AI Shortcuts */}
        <div>
          <div className="flex items-center justify-between mb-2 px-2">
            <h3 className="text-[11px] font-semibold text-muted-foreground uppercase tracking-widest">
              AI 바로가기
            </h3>
          </div>
          <div className="grid grid-cols-2 gap-1.5">
            {aiShortcuts.map((ai) => (
              <a
                key={ai.key}
                href={ai.referralUrl || ai.url}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-1.5 px-2 py-1.5 rounded-lg text-xs bg-gradient-to-r from-amber-50/70 via-yellow-50/50 to-green-50/40 dark:from-amber-900/15 dark:via-yellow-900/10 dark:to-green-900/8 border border-amber-100/40 dark:border-amber-800/20 text-muted-foreground hover:from-amber-100/80 hover:via-yellow-100/60 hover:to-green-100/50 dark:hover:from-amber-900/25 dark:hover:via-yellow-900/20 dark:hover:to-green-900/15 hover:text-amber-700 dark:hover:text-amber-300 hover:border-amber-200/50 transition-all duration-300"
              >
                <ExternalLink className="h-3 w-3" />
                <span>{ai.label}</span>
              </a>
            ))}
          </div>
        </div>

        {/* Premium Card */}
        <div className="p-3 rounded-xl bg-gradient-to-br from-amber-500/10 via-orange-500/5 to-transparent border border-amber-300/20">
          <div className="flex items-center gap-2 mb-2">
            <div className="w-5 h-5 rounded-full bg-amber-500/20 flex items-center justify-center">
              <Sparkles className="h-2.5 w-2.5 text-amber-600" />
            </div>
            <span className="text-xs font-semibold text-foreground">PRO 업그레이드</span>
          </div>
          <p className="text-[11px] text-muted-foreground mb-2 leading-relaxed">
            프리미엄 기능으로 더 많은 AI 도구를 확인하세요.
          </p>
          <button className="w-full py-1.5 px-2 rounded-lg bg-gradient-to-r from-amber-500 to-orange-500 text-white text-xs font-semibold hover:from-amber-600 hover:to-orange-600 transition-all duration-300 shadow-sm shadow-amber-500/20">
            업그레이드
          </button>
        </div>
      </div>
    </aside>
  );
}
