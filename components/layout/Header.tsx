'use client';

import React, { useState } from 'react';
import { useTranslations, useLocale } from 'next-intl';
import { Link, usePathname, useRouter } from '@/i18n/routing';
import { Menu, X, ChevronDown, Check, Sun, Moon, User, Settings } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { cn } from '@/lib/utils';
import { useTheme } from '@/components/providers/ThemeProvider';
import { useLogo } from '@/lib/hooks/useLogo';

const navLinks = [
  { href: '/ranking', key: 'ranking', label: '전체 순위' },
  { href: '/fortune', key: 'fortune', label: '사주분석' },
  { href: '/lotto', key: 'lotto', label: '로또 분석' },
  { href: '/prompts', key: 'prompts', label: '프롬프트' },
  { href: '/ebook', key: 'ebook', label: 'E-Book' },
  { href: '/marketplace', key: 'marketplace', label: '판매 사이트' },
  { href: '/community', key: 'community', label: '커뮤니티' },
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
  const [mounted, setMounted] = useState(false);
  const { theme, toggleTheme } = useTheme();
  const { siteLogo, aiLogo, isLoaded } = useLogo();

  // Handle hydration mismatch
  React.useEffect(() => {
    setMounted(true);
  }, []);

  const handleLanguageChange = (newLocale: string) => {
    router.replace(pathname, { locale: newLocale });
  };

  const currentLanguage = languages.find((lang) => lang.code === locale) || languages[0];

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
          {navLinks.map((link) => (
            <Link
              key={link.key}
              href={link.href}
              className={cn(
                'px-4 py-2 text-sm font-medium rounded-xl transition-all duration-300',
                pathname === link.href || pathname?.startsWith(link.href)
                  ? 'bg-gradient-to-r from-amber-500/20 to-orange-500/20 text-amber-700 dark:text-amber-300 shadow-sm'
                  : 'bg-gradient-to-r from-gray-100/80 to-gray-50/80 dark:from-gray-800/50 dark:to-gray-700/50 text-muted-foreground hover:from-amber-100/80 hover:to-orange-100/80 dark:hover:from-amber-900/30 dark:hover:to-orange-900/30 hover:text-amber-700 dark:hover:text-amber-300'
              )}
            >
              {link.label}
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
              <Button variant="ghost" size="icon" className="rounded-full">
                <User className="h-5 w-5 text-muted-foreground" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem asChild>
                <Link href="/login" className="cursor-pointer">
                  로그인
                </Link>
              </DropdownMenuItem>
              <DropdownMenuItem asChild>
                <Link href="/signup" className="cursor-pointer">
                  회원가입
                </Link>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>

          {/* Settings - Link to admin settings */}
          <Link href="/admin/settings">
            <Button variant="ghost" size="icon" className="hidden sm:flex rounded-full">
              <Settings className="h-5 w-5 text-muted-foreground" />
            </Button>
          </Link>

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
            {navLinks.map((link) => (
              <Link
                key={link.key}
                href={link.href}
                className={cn(
                  'block py-3 px-4 text-sm font-medium rounded-xl transition-all duration-300',
                  pathname === link.href || pathname?.startsWith(link.href)
                    ? 'bg-gradient-to-r from-amber-500/20 to-orange-500/20 text-amber-700 dark:text-amber-300'
                    : 'bg-gradient-to-r from-gray-100/80 to-gray-50/80 dark:from-gray-800/50 dark:to-gray-700/50 text-muted-foreground'
                )}
                onClick={() => setMobileMenuOpen(false)}
              >
                {link.label}
              </Link>
            ))}

            {/* Mobile Settings Link */}
            <Link
              href="/admin/settings"
              className="block py-3 px-4 text-sm font-medium rounded-lg transition-colors text-muted-foreground hover:bg-secondary/50"
              onClick={() => setMobileMenuOpen(false)}
            >
              사이트 설정
            </Link>

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
