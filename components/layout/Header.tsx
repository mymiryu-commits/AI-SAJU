'use client';

import { useState } from 'react';
import { useTranslations } from 'next-intl';
import { Link, usePathname } from '@/i18n/routing';
import { Menu, X, ChevronDown, Globe } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

const navLinks = [
  { href: '/ranking', key: 'ranking' },
  { href: '/guide', key: 'guide' },
  { href: '/fortune', key: 'fortune' },
  { href: '/prompts', key: 'prompts' },
  { href: '/pricing', key: 'pricing' },
] as const;

export function Header() {
  const t = useTranslations('nav');
  const pathname = usePathname();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <nav className="container mx-auto flex h-16 items-center justify-between px-4">
        {/* Logo */}
        <Link href="/" className="flex items-center space-x-2">
          <span className="text-2xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
            AI 수익화
          </span>
        </Link>

        {/* Desktop Navigation */}
        <div className="hidden md:flex items-center space-x-6">
          {navLinks.map((link) => (
            <Link
              key={link.key}
              href={link.href}
              className={cn(
                'text-sm font-medium transition-colors hover:text-primary',
                pathname === link.href
                  ? 'text-primary'
                  : 'text-muted-foreground'
              )}
            >
              {t(link.key)}
            </Link>
          ))}
        </div>

        {/* Right side actions */}
        <div className="hidden md:flex items-center space-x-4">
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
            <Button size="sm">{t('signup')}</Button>
          </Link>
        </div>

        {/* Mobile menu button */}
        <button
          className="md:hidden p-2"
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
          <div className="container mx-auto px-4 py-4 space-y-4">
            {navLinks.map((link) => (
              <Link
                key={link.key}
                href={link.href}
                className={cn(
                  'block py-2 text-sm font-medium transition-colors',
                  pathname === link.href
                    ? 'text-primary'
                    : 'text-muted-foreground'
                )}
                onClick={() => setMobileMenuOpen(false)}
              >
                {t(link.key)}
              </Link>
            ))}
            <div className="flex flex-col space-y-2 pt-4 border-t">
              <Link href="/login" onClick={() => setMobileMenuOpen(false)}>
                <Button variant="outline" className="w-full">
                  {t('login')}
                </Button>
              </Link>
              <Link href="/signup" onClick={() => setMobileMenuOpen(false)}>
                <Button className="w-full">{t('signup')}</Button>
              </Link>
            </div>
          </div>
        </div>
      )}
    </header>
  );
}
