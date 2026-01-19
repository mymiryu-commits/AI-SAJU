'use client';

import React, { useState, useRef, useEffect } from 'react';
import { useTranslations, useLocale } from 'next-intl';
import { Link, usePathname, useRouter } from '@/i18n/routing';
import { Menu, X, ChevronDown, Check, Sun, Moon, User, Settings, LogOut, Crown, Sparkles } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { cn } from '@/lib/utils';
import { useTheme } from '@/components/providers/ThemeProvider';
import { useLogo } from '@/lib/hooks/useLogo';
import { useAuth } from '@/lib/hooks/useAuth';
import { Badge } from '@/components/ui/badge';

// 메인 네비게이션 링크
const mainNavLinks = [
  { href: '/ranking', key: 'aiRanking', icon: '📊' },
  { href: '/marketplace', key: 'aiStore', icon: '🛒' },
] as const;

// 운세 서브메뉴
const fortuneSubMenu = [
  { href: '/saju', key: 'sajuHome', icon: '🌙', description: 'AI 사주 홈' },
  { href: '/fortune/saju', key: 'saju', icon: '🔮', description: '나만의 운명카드 6장' },
  { href: '/saju/chat', key: 'sajuChat', icon: '💬', description: 'AI 사주 상담사' },
  { href: '/saju/advanced', key: 'sajuAdvanced', icon: '🏛️', description: '십신/신살/12운성/합충' },
  { href: '/fortune/compatibility', key: 'compatibility', icon: '💑', description: '커플/비즈니스 궁합' },
  { href: '/fortune/tarot', key: 'tarot', icon: '🃏', description: '오늘의 카드 뽑기' },
] as const;

// 기타 링크
const otherNavLinks = [
  { href: '/lotto', key: 'lotto', icon: '🎱' },
  { href: '/tools/qrcode', key: 'qr', icon: '📱' },
] as const;

const languages = [
  { code: 'ko', label: '한국어', flag: '🇰🇷' },
  { code: 'en', label: 'English', flag: '🇺🇸' },
  { code: 'ja', label: '日本語', flag: '🇯🇵' },
] as const;

export function Header() {
  const t = useTranslations('nav');
  const pathname = usePathname();
  const router = useRouter();
  const locale = useLocale();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [fortuneDropdownOpen, setFortuneDropdownOpen] = useState(false);
  const [mounted, setMounted] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const { theme, toggleTheme } = useTheme();
  const { siteLogo, aiLogo, isLoaded } = useLogo();
  const { user, isAdmin, isLoading, signOut } = useAuth();

  // Handle hydration mismatch
  React.useEffect(() => {
    setMounted(true);
  }, []);

  // 드롭다운 외부 클릭 시 닫기
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setFortuneDropdownOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleLanguageChange = (newLocale: string) => {
    router.replace(pathname, { locale: newLocale });
  };

  const handleSignOut = async () => {
    await signOut();
    router.push('/');
  };

  const currentLanguage = languages.find((lang) => lang.code === locale) || languages[0];

  // Get user display name (email before @)
  const getUserDisplayName = () => {
    if (!user?.email) return '';
    return user.email.split('@')[0];
  };

  const isFortuneActive = pathname.startsWith('/fortune');

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <nav className="container mx-auto flex h-16 items-center justify-between px-4">
        {/* Logo */}
        <Link href="/" className="flex items-center gap-2.5 group">
          {/* AI Icon Logo */}
          {mounted && aiLogo ? (
            <img
              src={aiLogo}
              alt="AI Logo"
              className="w-10 h-10 rounded-xl object-cover shadow-lg shadow-amber-500/25 group-hover:shadow-amber-500/40 transition-shadow"
            />
          ) : (
            <div className="relative w-10 h-10 rounded-xl bg-gradient-to-br from-amber-400 via-orange-500 to-amber-600 flex items-center justify-center shadow-lg shadow-amber-500/25 group-hover:shadow-amber-500/40 transition-shadow">
              <span className="text-white font-bold text-sm tracking-tight">AI</span>
              <div className="absolute -top-0.5 -right-0.5 w-2.5 h-2.5 bg-gradient-to-br from-yellow-300 to-amber-400 rounded-full shadow-sm" />
            </div>
          )}

          {/* Site Logo or Text */}
          <div className="hidden sm:block">
            {mounted && siteLogo ? (
              <img
                src={siteLogo}
                alt="Site Logo"
                className="max-h-8 max-w-[150px] object-contain"
              />
            ) : (
              <>
                <span className="text-lg font-bold bg-gradient-to-r from-amber-600 to-orange-600 dark:from-amber-400 dark:to-orange-400 bg-clip-text text-transparent">AI-PlanX</span>
                <span className="text-[10px] text-muted-foreground block -mt-0.5 tracking-wide">AI 수익화 플랫폼</span>
              </>
            )}
          </div>
        </Link>

        {/* Desktop Navigation */}
        <div className="hidden lg:flex items-center gap-1">
          {/* AI랭킹, AI스토어 */}
          {mainNavLinks.map((link) => (
            <Link
              key={link.key}
              href={link.href}
              className={cn(
                'px-4 py-2 text-sm font-medium rounded-xl transition-all duration-300',
                pathname === link.href
                  ? 'bg-gradient-to-r from-amber-500/20 to-orange-500/20 text-amber-700 dark:text-amber-300 shadow-sm'
                  : 'text-muted-foreground hover:bg-gradient-to-r hover:from-amber-100/80 hover:to-orange-100/80 dark:hover:from-amber-900/30 dark:hover:to-orange-900/30 hover:text-amber-700 dark:hover:text-amber-300'
              )}
            >
              <span className="mr-1.5">{link.icon}</span>
              {t(link.key)}
            </Link>
          ))}

          {/* 운세 드롭다운 */}
          <div className="relative" ref={dropdownRef}>
            <button
              onClick={() => setFortuneDropdownOpen(!fortuneDropdownOpen)}
              onMouseEnter={() => setFortuneDropdownOpen(true)}
              className={cn(
                'flex items-center gap-1 px-4 py-2 text-sm font-medium rounded-xl transition-all duration-300',
                isFortuneActive
                  ? 'bg-gradient-to-r from-amber-500/20 to-orange-500/20 text-amber-700 dark:text-amber-300 shadow-sm'
                  : 'text-muted-foreground hover:bg-gradient-to-r hover:from-amber-100/80 hover:to-orange-100/80 dark:hover:from-amber-900/30 dark:hover:to-orange-900/30 hover:text-amber-700 dark:hover:text-amber-300'
              )}
            >
              <span className="mr-1">✨</span>
              {t('fortune')}
              <ChevronDown className={cn(
                'h-4 w-4 transition-transform',
                fortuneDropdownOpen && 'rotate-180'
              )} />
            </button>

            {/* 드롭다운 메뉴 */}
            {fortuneDropdownOpen && (
              <div
                className="absolute top-full left-0 mt-1 w-64 rounded-xl border bg-background shadow-lg py-2 animate-in fade-in-0 zoom-in-95"
                onMouseLeave={() => setFortuneDropdownOpen(false)}
              >
                {fortuneSubMenu.map((item) => (
                  <Link
                    key={item.key}
                    href={item.href}
                    onClick={() => setFortuneDropdownOpen(false)}
                    className={cn(
                      'flex items-start gap-3 px-4 py-3 hover:bg-accent transition-colors',
                      pathname === item.href && 'bg-accent'
                    )}
                  >
                    <span className="text-xl">{item.icon}</span>
                    <div>
                      <div className="font-medium text-foreground">
                        {t(item.key)}
                      </div>
                      <div className="text-xs text-muted-foreground">
                        {item.description}
                      </div>
                    </div>
                  </Link>
                ))}
              </div>
            )}
          </div>

          {/* 로또, QR */}
          {otherNavLinks.map((link) => (
            <Link
              key={link.key}
              href={link.href}
              className={cn(
                'px-4 py-2 text-sm font-medium rounded-xl transition-all duration-300',
                pathname === link.href
                  ? 'bg-gradient-to-r from-amber-500/20 to-orange-500/20 text-amber-700 dark:text-amber-300 shadow-sm'
                  : 'text-muted-foreground hover:bg-gradient-to-r hover:from-amber-100/80 hover:to-orange-100/80 dark:hover:from-amber-900/30 dark:hover:to-orange-900/30 hover:text-amber-700 dark:hover:text-amber-300'
              )}
            >
              <span className="mr-1.5">{link.icon}</span>
              {t(link.key)}
            </Link>
          ))}
        </div>

        {/* Right side actions */}
        <div className="flex items-center gap-2">
          {/* Theme Toggle */}
          <button
            onClick={toggleTheme}
            className="theme-toggle"
            aria-label="Toggle theme"
          >
            {mounted ? (
              theme === 'light' ? (
                <Moon className="h-5 w-5 text-muted-foreground" />
              ) : (
                <Sun className="h-5 w-5 text-muted-foreground" />
              )
            ) : (
              <Moon className="h-5 w-5 text-muted-foreground" />
            )}
          </button>

          {/* Language Selector */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="sm" className="gap-2">
                <span className="text-base">{currentLanguage.flag}</span>
                <span className="hidden sm:inline text-sm">{currentLanguage.label}</span>
                <ChevronDown className="h-3 w-3" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              {languages.map((lang) => (
                <DropdownMenuItem
                  key={lang.code}
                  onClick={() => handleLanguageChange(lang.code)}
                  className="gap-2 cursor-pointer"
                >
                  <span className="text-base">{lang.flag}</span>
                  <span>{lang.label}</span>
                  {locale === lang.code && (
                    <Check className="h-4 w-4 ml-auto text-primary" />
                  )}
                </DropdownMenuItem>
              ))}
            </DropdownMenuContent>
          </DropdownMenu>

          {/* User Menu */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="icon" className="rounded-full relative">
                {user ? (
                  <div className="w-8 h-8 rounded-full bg-gradient-to-br from-amber-400 to-orange-500 flex items-center justify-center text-white font-semibold text-sm">
                    {getUserDisplayName().charAt(0).toUpperCase()}
                  </div>
                ) : (
                  <User className="h-5 w-5 text-muted-foreground" />
                )}
                {isAdmin && (
                  <div className="absolute -top-0.5 -right-0.5 w-3 h-3 bg-amber-500 rounded-full flex items-center justify-center">
                    <Crown className="h-2 w-2 text-white" />
                  </div>
                )}
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-56">
              {user ? (
                <>
                  {/* User Info */}
                  <div className="px-3 py-2">
                    <div className="flex items-center gap-2">
                      <div className="w-10 h-10 rounded-full bg-gradient-to-br from-amber-400 to-orange-500 flex items-center justify-center text-white font-semibold">
                        {getUserDisplayName().charAt(0).toUpperCase()}
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium truncate">{getUserDisplayName()}</p>
                        <p className="text-xs text-muted-foreground truncate">{user.email}</p>
                      </div>
                    </div>
                    {isAdmin && (
                      <Badge className="mt-2 bg-amber-500 text-white">
                        <Crown className="h-3 w-3 mr-1" />
                        관리자
                      </Badge>
                    )}
                  </div>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem asChild>
                    <Link href="/my/dashboard" className="cursor-pointer">
                      <Sparkles className="h-4 w-4 mr-2" />
                      마이페이지
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem asChild>
                    <Link href="/my/settings" className="cursor-pointer">
                      <Settings className="h-4 w-4 mr-2" />
                      계정 설정
                    </Link>
                  </DropdownMenuItem>
                  {isAdmin && (
                    <DropdownMenuItem asChild>
                      <Link href="/admin/settings" className="cursor-pointer">
                        <Settings className="h-4 w-4 mr-2" />
                        사이트 관리
                      </Link>
                    </DropdownMenuItem>
                  )}
                  <DropdownMenuSeparator />
                  <DropdownMenuItem onClick={handleSignOut} className="cursor-pointer text-red-600">
                    <LogOut className="h-4 w-4 mr-2" />
                    로그아웃
                  </DropdownMenuItem>
                </>
              ) : (
                <>
                  <DropdownMenuItem asChild>
                    <Link href="/login" className="cursor-pointer">
                      <User className="h-4 w-4 mr-2" />
                      로그인
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem asChild>
                    <Link href="/signup" className="cursor-pointer">
                      <Sparkles className="h-4 w-4 mr-2" />
                      회원가입
                    </Link>
                  </DropdownMenuItem>
                </>
              )}
            </DropdownMenuContent>
          </DropdownMenu>

          {/* Settings - Link to admin settings (only for admin) */}
          {isAdmin && (
            <Link href="/admin/settings">
              <Button variant="ghost" size="icon" className="hidden sm:flex rounded-full">
                <Settings className="h-5 w-5 text-muted-foreground" />
              </Button>
            </Link>
          )}

          {/* Mobile menu button */}
          <button
            className="lg:hidden p-2"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          >
            {mobileMenuOpen ? (
              <X className="h-6 w-6" />
            ) : (
              <Menu className="h-6 w-6" />
            )}
          </button>
        </div>
      </nav>

      {/* Mobile Navigation */}
      {mobileMenuOpen && (
        <div className="lg:hidden border-t bg-background animate-fade-in">
          <div className="container mx-auto px-4 py-4 space-y-2">
            {/* AI랭킹, AI스토어 */}
            {mainNavLinks.map((link) => (
              <Link
                key={link.key}
                href={link.href}
                className={cn(
                  'flex items-center gap-2 py-3 px-4 text-sm font-medium rounded-xl transition-all duration-300',
                  pathname === link.href
                    ? 'bg-gradient-to-r from-amber-500/20 to-orange-500/20 text-amber-700 dark:text-amber-300'
                    : 'bg-gradient-to-r from-gray-100/80 to-gray-50/80 dark:from-gray-800/50 dark:to-gray-700/50 text-muted-foreground'
                )}
                onClick={() => setMobileMenuOpen(false)}
              >
                <span>{link.icon}</span>
                {t(link.key)}
              </Link>
            ))}

            {/* 운세 섹션 */}
            <div className="py-2">
              <div className="px-4 py-2 text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                ✨ {t('fortune')}
              </div>
              {fortuneSubMenu.map((item) => (
                <Link
                  key={item.key}
                  href={item.href}
                  className={cn(
                    'flex items-center gap-3 px-4 py-3 ml-2 rounded-xl text-sm transition-colors',
                    pathname === item.href
                      ? 'bg-gradient-to-r from-amber-500/20 to-orange-500/20 text-amber-700 dark:text-amber-300'
                      : 'text-muted-foreground hover:bg-accent'
                  )}
                  onClick={() => setMobileMenuOpen(false)}
                >
                  <span>{item.icon}</span>
                  <div>
                    <div className="font-medium">{t(item.key)}</div>
                    <div className="text-xs opacity-70">{item.description}</div>
                  </div>
                </Link>
              ))}
            </div>

            {/* 로또, QR */}
            {otherNavLinks.map((link) => (
              <Link
                key={link.key}
                href={link.href}
                className={cn(
                  'flex items-center gap-2 py-3 px-4 text-sm font-medium rounded-xl transition-all duration-300',
                  pathname === link.href
                    ? 'bg-gradient-to-r from-amber-500/20 to-orange-500/20 text-amber-700 dark:text-amber-300'
                    : 'bg-gradient-to-r from-gray-100/80 to-gray-50/80 dark:from-gray-800/50 dark:to-gray-700/50 text-muted-foreground'
                )}
                onClick={() => setMobileMenuOpen(false)}
              >
                <span>{link.icon}</span>
                {t(link.key)}
              </Link>
            ))}

            {/* Mobile User Section */}
            <div className="py-3 px-4 border-t mt-4">
              {user ? (
                <div className="space-y-3">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-gradient-to-br from-amber-400 to-orange-500 flex items-center justify-center text-white font-semibold">
                      {getUserDisplayName().charAt(0).toUpperCase()}
                    </div>
                    <div>
                      <p className="font-medium">{getUserDisplayName()}</p>
                      <p className="text-xs text-muted-foreground">{user.email}</p>
                    </div>
                    {isAdmin && (
                      <Badge className="bg-amber-500 text-white ml-auto">
                        <Crown className="h-3 w-3 mr-1" />
                        관리자
                      </Badge>
                    )}
                  </div>
                  <div className="flex gap-2">
                    <Link href="/my/dashboard" className="flex-1" onClick={() => setMobileMenuOpen(false)}>
                      <Button variant="outline" size="sm" className="w-full">
                        마이페이지
                      </Button>
                    </Link>
                    <Button
                      variant="destructive"
                      size="sm"
                      onClick={() => {
                        handleSignOut();
                        setMobileMenuOpen(false);
                      }}
                    >
                      로그아웃
                    </Button>
                  </div>
                </div>
              ) : (
                <div className="flex gap-2">
                  <Link href="/login" className="flex-1" onClick={() => setMobileMenuOpen(false)}>
                    <Button variant="outline" size="sm" className="w-full">
                      로그인
                    </Button>
                  </Link>
                  <Link href="/signup" className="flex-1" onClick={() => setMobileMenuOpen(false)}>
                    <Button size="sm" className="w-full">
                      회원가입
                    </Button>
                  </Link>
                </div>
              )}
            </div>

            {/* Mobile Settings Link (Admin only) */}
            {isAdmin && (
              <Link
                href="/admin/settings"
                className="block py-3 px-4 text-sm font-medium rounded-lg transition-colors text-muted-foreground hover:bg-secondary/50"
                onClick={() => setMobileMenuOpen(false)}
              >
                사이트 설정
              </Link>
            )}

            {/* Mobile Language Selector */}
            <div className="py-3 px-4 border-t mt-4">
              <p className="text-xs text-muted-foreground mb-2">언어 선택</p>
              <div className="flex gap-2">
                {languages.map((lang) => (
                  <Button
                    key={lang.code}
                    variant={locale === lang.code ? 'default' : 'outline'}
                    size="sm"
                    onClick={() => {
                      handleLanguageChange(lang.code);
                      setMobileMenuOpen(false);
                    }}
                    className="gap-1"
                  >
                    <span>{lang.flag}</span>
                    <span className="text-xs">{lang.code.toUpperCase()}</span>
                  </Button>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}
    </header>
  );
}
