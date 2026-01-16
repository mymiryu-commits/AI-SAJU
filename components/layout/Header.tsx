'use client';

import { useState, useRef, useEffect } from 'react';
import { useTranslations } from 'next-intl';
import { Link, usePathname } from '@/i18n/routing';
import { Menu, X, ChevronDown, Globe } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

// 메인 네비게이션 링크
const mainNavLinks = [
  { href: '/ranking', key: 'aiRanking', icon: '📊' },
  { href: '/store', key: 'aiStore', icon: '🛒' },
] as const;

// 운세 서브메뉴
const fortuneSubMenu = [
  { href: '/fortune/saju', key: 'saju', icon: '🔮', description: '나만의 운명카드 6장' },
  { href: '/fortune/tarot', key: 'tarot', icon: '🃏', description: '오늘의 카드 뽑기' },
] as const;

// 기타 링크
const otherNavLinks = [
  { href: '/lotto', key: 'lotto', icon: '🎱' },
  { href: '/qr', key: 'qr', icon: '📱' },
] as const;

export function Header() {
  const t = useTranslations('nav');
  const pathname = usePathname();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [fortuneDropdownOpen, setFortuneDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

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

  const isFortuneActive = pathname.startsWith('/fortune');

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <nav className="container mx-auto flex h-16 items-center justify-between px-4">
        {/* Logo */}
        <Link href="/" className="flex items-center space-x-2">
          <span className="text-2xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
            AI 사주
          </span>
        </Link>

        {/* Desktop Navigation */}
        <div className="hidden md:flex items-center space-x-1">
          {/* AI랭킹, AI스토어 */}
          {mainNavLinks.map((link) => (
            <Link
              key={link.key}
              href={link.href}
              className={cn(
                'px-4 py-2 text-sm font-medium rounded-lg transition-colors hover:bg-accent hover:text-accent-foreground',
                pathname === link.href
                  ? 'bg-accent text-accent-foreground'
                  : 'text-muted-foreground'
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
                'flex items-center gap-1 px-4 py-2 text-sm font-medium rounded-lg transition-colors hover:bg-accent hover:text-accent-foreground',
                isFortuneActive
                  ? 'bg-accent text-accent-foreground'
                  : 'text-muted-foreground'
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
                'px-4 py-2 text-sm font-medium rounded-lg transition-colors hover:bg-accent hover:text-accent-foreground',
                pathname === link.href
                  ? 'bg-accent text-accent-foreground'
                  : 'text-muted-foreground'
              )}
            >
              <span className="mr-1.5">{link.icon}</span>
              {t(link.key)}
            </Link>
          ))}
        </div>

        {/* Right side actions */}
        <div className="hidden md:flex items-center space-x-2">
          {/* Language Selector */}
          <Button variant="ghost" size="sm" className="gap-1">
            <Globe className="h-4 w-4" />
            <ChevronDown className="h-3 w-3" />
          </Button>

          {/* Auth buttons */}
          <Link href="/login">
            <Button variant="ghost" size="sm">
              {t('login')}
            </Button>
          </Link>
          <Link href="/signup">
            <Button size="sm" className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700">
              {t('signup')}
            </Button>
          </Link>
        </div>

        {/* Mobile menu button */}
        <button
          className="md:hidden p-2 rounded-lg hover:bg-accent"
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
        >
          {mobileMenuOpen ? (
            <X className="h-6 w-6" />
          ) : (
            <Menu className="h-6 w-6" />
          )}
        </button>
      </nav>

      {/* Mobile Navigation */}
      {mobileMenuOpen && (
        <div className="md:hidden border-t bg-background">
          <div className="container mx-auto px-4 py-4 space-y-1">
            {/* AI랭킹, AI스토어 */}
            {mainNavLinks.map((link) => (
              <Link
                key={link.key}
                href={link.href}
                className={cn(
                  'flex items-center gap-2 px-4 py-3 rounded-lg text-sm font-medium transition-colors',
                  pathname === link.href
                    ? 'bg-accent text-accent-foreground'
                    : 'text-muted-foreground hover:bg-accent hover:text-accent-foreground'
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
                    'flex items-center gap-3 px-4 py-3 ml-2 rounded-lg text-sm transition-colors',
                    pathname === item.href
                      ? 'bg-accent text-accent-foreground'
                      : 'text-muted-foreground hover:bg-accent hover:text-accent-foreground'
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
                  'flex items-center gap-2 px-4 py-3 rounded-lg text-sm font-medium transition-colors',
                  pathname === link.href
                    ? 'bg-accent text-accent-foreground'
                    : 'text-muted-foreground hover:bg-accent hover:text-accent-foreground'
                )}
                onClick={() => setMobileMenuOpen(false)}
              >
                <span>{link.icon}</span>
                {t(link.key)}
              </Link>
            ))}

            {/* Auth buttons */}
            <div className="flex flex-col space-y-2 pt-4 border-t mt-4">
              <Link href="/login" onClick={() => setMobileMenuOpen(false)}>
                <Button variant="outline" className="w-full">
                  {t('login')}
                </Button>
              </Link>
              <Link href="/signup" onClick={() => setMobileMenuOpen(false)}>
                <Button className="w-full bg-gradient-to-r from-purple-600 to-pink-600">
                  {t('signup')}
                </Button>
              </Link>
            </div>
          </div>
        </div>
      )}
    </header>
  );
}
