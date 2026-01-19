import { setRequestLocale } from 'next-intl/server';
import { Link } from '@/i18n/routing';
import { Button } from '@/components/ui/button';
import { VersionBadge } from '@/components/ui/version-badge';
import {
  ArrowRight,
  Sparkles,
  TrendingUp,
  Zap,
  Flame,
  Crown,
  Target,
  Rocket,
  Play,
  BarChart3,
  Wallet,
  Trophy,
  Clock,
  CheckCircle2,
  Cpu,
  Layers,
  Users,
  ArrowUpRight,
  Gem,
  Lightbulb,
  QrCode,
  ExternalLink,
} from 'lucide-react';
import { createClient } from '@/lib/supabase/server';
import Image from 'next/image';
import type { Database } from '@/types/database';

type SiteSettingsRow = Database['public']['Tables']['site_settings']['Row'];

interface HeroSettings {
  background_image_url: string | null;
  content_image_url: string | null;
  use_gradient: boolean;
  gradient_from: string;
  gradient_via: string;
  gradient_to: string;
}

const defaultHeroSettings: HeroSettings = {
  background_image_url: null,
  content_image_url: null,
  use_gradient: true,
  gradient_from: '#9333ea',
  gradient_via: '#7e22ce',
  gradient_to: '#db2777',
};

// 수익화 카테고리 데이터
const categories = [
  {
    id: 'beginner',
    title: '입문',
    subtitle: '누구나 시작 가능',
    icon: Rocket,
    color: 'from-amber-400 to-orange-500',
    shadowColor: 'shadow-amber-500/20',
    items: [
      { name: '블로그 글쓰기', income: '50~150만', tools: 'ChatGPT' },
      { name: '번역/교정', income: '80~200만', tools: 'DeepL' },
      { name: '카피라이팅', income: '100~300만', tools: 'Jasper' },
    ],
  },
  {
    id: 'content',
    title: '콘텐츠',
    subtitle: '영상/음성 기반',
    icon: Play,
    color: 'from-rose-400 to-pink-500',
    shadowColor: 'shadow-rose-500/20',
    items: [
      { name: '유튜브 쇼츠', income: '200~800만', tools: 'Runway' },
      { name: '전자책 출판', income: '150~500만', tools: 'Claude' },
      { name: '온라인 강의', income: '300~1500만', tools: 'Synthesia' },
    ],
  },
  {
    id: 'design',
    title: '디자인',
    subtitle: '이미지 기반',
    icon: Target,
    color: 'from-fuchsia-400 to-purple-500',
    shadowColor: 'shadow-fuchsia-500/20',
    items: [
      { name: '상세페이지', income: '200~600만', tools: 'Midjourney' },
      { name: '썸네일', income: '150~400만', tools: 'DALL-E' },
      { name: 'AI 아트', income: '200~800만', tools: 'Stable Diffusion' },
    ],
  },
  {
    id: 'advanced',
    title: '고급',
    subtitle: '전문성 필요',
    icon: Crown,
    color: 'from-yellow-400 to-amber-500',
    shadowColor: 'shadow-yellow-500/20',
    items: [
      { name: 'SaaS 개발', income: '500~3000만', tools: 'Cursor' },
      { name: '자동화 구축', income: '400~1500만', tools: 'n8n' },
      { name: 'AI 컨설팅', income: '500~2000만', tools: '복합 AI' },
    ],
  },
];

// 실제 수익 사례
const successCases = [
  { category: '쇼츠 자동화', income: '월 580만', period: '4개월', difficulty: '중', avatar: '🎬' },
  { category: '상세페이지 외주', income: '월 420만', period: '2개월', difficulty: '하', avatar: '🎨' },
  { category: 'AI 자동화 대행', income: '월 1,200만', period: '3개월', difficulty: '상', avatar: '🤖' },
];

// 통계 데이터
const stats = [
  { value: '500+', label: 'AI 툴 분석', icon: Cpu },
  { value: '12.8K', label: '수익 창출자', icon: Users },
  { value: '₩4.2억', label: '이번달 총 수익', icon: Wallet },
  { value: '3개월', label: '평균 수익 달성', icon: Clock },
];

async function getHeroSettings(): Promise<HeroSettings> {
  try {
    const supabase = await createClient();
    const { data, error } = await supabase
      .from('site_settings')
      .select('value')
      .eq('key', 'hero_settings')
      .single<Pick<SiteSettingsRow, 'value'>>();

    if (error || !data) {
      return defaultHeroSettings;
    }

    return data.value as unknown as HeroSettings;
  } catch (error) {
    console.error('Error fetching hero settings:', error);
    return defaultHeroSettings;
  }
}

export default async function HomePage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);

  const heroSettings = await getHeroSettings();
  const hasBackgroundImage = !!heroSettings.background_image_url;

  return (
    <div className="min-h-screen bg-background">
      {/* ===== HERO SECTION ===== */}
      <section className="relative min-h-[85vh] flex items-center justify-center overflow-hidden bg-gradient-to-b from-amber-50/50 via-background to-background dark:from-amber-950/20 dark:via-background dark:to-background">
        {/* Custom Background Image from Admin Settings */}
        {hasBackgroundImage && (
          <div className="absolute inset-0 z-0">
            <Image
              src={heroSettings.background_image_url!}
              alt="Hero background"
              fill
              className="object-cover"
              priority
            />
            <div className="absolute inset-0 bg-background/60 dark:bg-background/80" />
          </div>
        )}

        {/* Animated Background Elements (hidden when custom image is set) */}
        {!hasBackgroundImage && (
          <div className="absolute inset-0 overflow-hidden">
            {/* Gradient Orbs - Warm Colors */}
            <div className="absolute top-1/4 left-1/4 w-[500px] h-[500px] bg-gradient-to-br from-amber-200/40 to-orange-300/30 dark:from-amber-600/20 dark:to-orange-500/15 rounded-full blur-[100px] animate-pulse-subtle" />
            <div className="absolute bottom-1/4 right-1/4 w-[400px] h-[400px] bg-gradient-to-br from-rose-200/30 to-pink-300/25 dark:from-rose-600/15 dark:to-pink-500/10 rounded-full blur-[100px] animate-pulse-subtle animation-delay-500" />
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-gradient-to-br from-yellow-100/30 to-amber-200/25 dark:from-yellow-600/10 dark:to-amber-500/10 rounded-full blur-[120px] animate-pulse-subtle animation-delay-300" />

            {/* Decorative grid pattern */}
            <div className="absolute inset-0 bg-[linear-gradient(rgba(251,191,36,0.03)_1px,transparent_1px),linear-gradient(90deg,rgba(251,191,36,0.03)_1px,transparent_1px)] bg-[size:60px_60px]" />
          </div>
        )}

        <div className="container mx-auto px-4 relative z-10">
          <div className="max-w-5xl mx-auto text-center">
            {/* Top Badge */}
            <div className="flex flex-col items-center gap-2 mb-8 animate-fade-in-up">
              <div className="inline-flex items-center gap-3 bg-gradient-to-r from-amber-100 to-orange-100 dark:from-amber-900/40 dark:to-orange-900/40 border border-amber-200/50 dark:border-amber-700/50 rounded-full px-5 py-2.5 shadow-lg shadow-amber-500/10">
                <span className="relative flex h-2.5 w-2.5">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-amber-500 opacity-75" />
                  <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-gradient-to-r from-amber-500 to-orange-500" />
                </span>
                <span className="text-amber-800 dark:text-amber-200 text-sm font-medium">
                  오늘 <span className="font-bold text-amber-900 dark:text-amber-100">12,847명</span>이 AI로 수익 창출 중
                </span>
              </div>
              <VersionBadge variant="hero" />
            </div>

            {/* Main Headline */}
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6 animate-fade-in-up animation-delay-100 leading-tight">
              <span className="text-foreground">AI로 시작하는</span>
              <br />
              <span className="bg-gradient-to-r from-amber-500 via-orange-500 to-rose-500 bg-clip-text text-transparent">
                월 1,000만원 수익화
              </span>
            </h1>

            {/* Subheadline */}
            <p className="text-lg md:text-xl text-muted-foreground mb-8 max-w-2xl mx-auto animate-fade-in-up animation-delay-200 leading-relaxed">
              검증된 AI 조합으로 부업부터 본업까지
              <br className="hidden md:block" />
              <span className="text-foreground font-medium">실제 수익 사례</span>와 <span className="text-foreground font-medium">단계별 가이드</span> 제공
            </p>

            {/* Trust Indicators */}
            <div className="flex flex-wrap justify-center gap-4 md:gap-6 mb-10 animate-fade-in-up animation-delay-300">
              {['500+ AI 툴 분석', '1,200+ 수익화 사례', '평균 3개월 내 수익'].map((item, i) => (
                <div key={i} className="flex items-center gap-2 text-muted-foreground text-sm">
                  <CheckCircle2 className="h-4 w-4 text-amber-500" />
                  <span>{item}</span>
                </div>
              ))}
            </div>

            {/* CTA Buttons */}
            <div className="flex flex-wrap justify-center gap-4 animate-fade-in-up animation-delay-400">
              <Link href="/ranking">
                <Button
                  size="lg"
                  className="bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600 text-white px-8 py-6 text-base font-semibold rounded-xl shadow-xl shadow-amber-500/25 hover:shadow-amber-500/40 transition-all hover:-translate-y-0.5"
                >
                  <TrendingUp className="mr-2 h-5 w-5" />
                  수익화 AI 순위 보기
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Button>
              </Link>
              <Link href="/guide">
                <Button
                  size="lg"
                  variant="outline"
                  className="px-8 py-6 text-base font-semibold rounded-xl border-2 hover:bg-secondary/50 transition-all hover:-translate-y-0.5"
                >
                  <Play className="mr-2 h-5 w-5" />
                  무료 가이드 시작
                </Button>
              </Link>
            </div>
          </div>
        </div>

        {/* Bottom gradient fade */}
        <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-background to-transparent" />
      </section>

      {/* ===== STATS SECTION ===== */}
      <section className="py-16 relative">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 md:gap-8">
            {stats.map((stat, i) => {
              const Icon = stat.icon;
              return (
                <div
                  key={stat.label}
                  className="text-center group animate-fade-in-up"
                  style={{ animationDelay: `${i * 100}ms` }}
                >
                  <div className="inline-flex items-center justify-center w-14 h-14 rounded-2xl bg-gradient-to-br from-amber-100 to-orange-100 dark:from-amber-900/30 dark:to-orange-900/30 mb-4 group-hover:scale-110 transition-transform duration-300 shadow-lg shadow-amber-500/10">
                    <Icon className="h-6 w-6 text-amber-600 dark:text-amber-400" />
                  </div>
                  <div className="text-3xl md:text-4xl font-bold text-foreground mb-1">
                    {stat.value}
                  </div>
                  <div className="text-muted-foreground text-sm">
                    {stat.label}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* ===== CATEGORIES SECTION ===== */}
      <section className="py-20 relative">
        <div className="container mx-auto px-4">
          {/* Section Header */}
          <div className="text-center mb-14">
            <div className="inline-flex items-center gap-2 bg-gradient-to-r from-rose-100 to-pink-100 dark:from-rose-900/30 dark:to-pink-900/30 border border-rose-200/50 dark:border-rose-700/50 rounded-full px-4 py-2 mb-6">
              <BarChart3 className="h-4 w-4 text-rose-500" />
              <span className="text-rose-700 dark:text-rose-300 text-sm font-medium">난이도별 수익화</span>
            </div>
            <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
              나에게 맞는 수익화 찾기
            </h2>
            <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
              현실적인 예상 수익과 필요 기간을 확인하세요
            </p>
          </div>

          {/* Category Cards */}
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-5">
            {categories.map((cat, index) => {
              const Icon = cat.icon;
              return (
                <div
                  key={cat.id}
                  className="group bg-card border border-border rounded-2xl overflow-hidden hover:shadow-xl hover:-translate-y-1 transition-all duration-300 animate-fade-in-up"
                  style={{ animationDelay: `${index * 100}ms` }}
                >
                  {/* Card Header */}
                  <div className={`bg-gradient-to-r ${cat.color} p-5`}>
                    <div className="flex items-center justify-between mb-3">
                      <div className="w-11 h-11 bg-white/20 rounded-xl flex items-center justify-center backdrop-blur-sm">
                        <Icon className="h-5 w-5 text-white" />
                      </div>
                      <ArrowUpRight className="h-5 w-5 text-white/60 group-hover:text-white group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-all" />
                    </div>
                    <h3 className="text-xl font-bold text-white mb-0.5">{cat.title}</h3>
                    <p className="text-white/80 text-sm">{cat.subtitle}</p>
                  </div>

                  {/* Card Content */}
                  <div className="p-4 space-y-2">
                    {cat.items.map((item, idx) => (
                      <div
                        key={idx}
                        className="flex items-center justify-between p-3 rounded-xl bg-secondary/50 hover:bg-secondary transition-colors cursor-pointer"
                      >
                        <div>
                          <p className="text-foreground font-medium text-sm">
                            {item.name}
                          </p>
                          <p className="text-muted-foreground text-xs mt-0.5">{item.tools}</p>
                        </div>
                        <div className="text-amber-600 dark:text-amber-400 font-bold text-sm">
                          {item.income}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* ===== SUCCESS CASES SECTION ===== */}
      <section className="py-20 relative bg-gradient-to-b from-background via-amber-50/30 to-background dark:from-background dark:via-amber-950/10 dark:to-background">
        <div className="container mx-auto px-4">
          {/* Section Header */}
          <div className="text-center mb-14">
            <div className="inline-flex items-center gap-2 bg-gradient-to-r from-amber-100 to-yellow-100 dark:from-amber-900/30 dark:to-yellow-900/30 border border-amber-200/50 dark:border-amber-700/50 rounded-full px-4 py-2 mb-6">
              <Trophy className="h-4 w-4 text-amber-500" />
              <span className="text-amber-700 dark:text-amber-300 text-sm font-medium">검증된 성공 사례</span>
            </div>
            <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
              실제 수익화 후기
            </h2>
            <p className="text-muted-foreground text-lg">
              현실적인 수익과 소요 기간
            </p>
          </div>

          {/* Success Cards */}
          <div className="grid md:grid-cols-3 gap-6 max-w-4xl mx-auto">
            {successCases.map((item, index) => (
              <div
                key={index}
                className="bg-card border border-border rounded-2xl p-6 text-center hover:shadow-xl hover:-translate-y-1 transition-all duration-300 animate-fade-in-up"
                style={{ animationDelay: `${index * 100}ms` }}
              >
                <div className="text-4xl mb-4">{item.avatar}</div>
                <div className="text-3xl font-bold bg-gradient-to-r from-amber-500 to-orange-500 bg-clip-text text-transparent mb-2">
                  {item.income}
                </div>
                <div className="text-foreground font-semibold mb-1">{item.category}</div>
                <div className="text-muted-foreground text-sm mb-4">{item.period} 소요</div>
                <div className={`inline-flex items-center px-3 py-1.5 rounded-full text-xs font-medium ${
                  item.difficulty === '하'
                    ? 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400'
                    : item.difficulty === '중'
                    ? 'bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400'
                    : 'bg-rose-100 text-rose-700 dark:bg-rose-900/30 dark:text-rose-400'
                }`}>
                  난이도 {item.difficulty}
                </div>
              </div>
            ))}
          </div>

          {/* CTA */}
          <div className="text-center mt-12">
            <Link href="/guide">
              <Button
                className="bg-gradient-to-r from-rose-500 to-pink-500 hover:from-rose-600 hover:to-pink-600 text-white px-8 py-6 text-base font-semibold rounded-xl shadow-xl shadow-rose-500/25 hover:shadow-rose-500/40 transition-all hover:-translate-y-0.5"
              >
                <Rocket className="mr-2 h-5 w-5" />
                나도 시작하기
                <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* ===== FORTUNE CTA SECTION ===== */}
      <section className="py-20 relative">
        <div className="container mx-auto px-4">
          <div className="bg-gradient-to-br from-amber-50 via-orange-50 to-rose-50 dark:from-amber-950/40 dark:via-orange-950/30 dark:to-rose-950/20 border border-amber-200/50 dark:border-amber-800/30 rounded-3xl p-10 md:p-14 relative overflow-hidden">
            {/* Background decoration */}
            <div className="absolute top-0 right-0 w-80 h-80 bg-gradient-to-br from-amber-200/40 to-orange-200/30 dark:from-amber-600/10 dark:to-orange-600/10 rounded-full blur-[80px]" />
            <div className="absolute bottom-0 left-0 w-64 h-64 bg-gradient-to-br from-rose-200/40 to-pink-200/30 dark:from-rose-600/10 dark:to-pink-600/10 rounded-full blur-[80px]" />

            <div className="relative z-10 flex flex-col md:flex-row items-center justify-between gap-8">
              <div className="text-center md:text-left">
                <div className="inline-flex items-center gap-2 bg-white/80 dark:bg-gray-900/50 rounded-full px-4 py-2 mb-5 shadow-sm">
                  <Sparkles className="h-4 w-4 text-amber-500" />
                  <span className="text-amber-700 dark:text-amber-300 text-sm font-medium">AI FORTUNE</span>
                </div>
                <h2 className="text-2xl md:text-3xl font-bold text-foreground mb-3">
                  오늘의 AI 수익운은?
                </h2>
                <p className="text-muted-foreground text-base max-w-md">
                  AI 사주 분석으로 나에게 맞는 수익화 분야를 찾아보세요
                </p>
              </div>
              <div className="flex flex-col sm:flex-row gap-4">
                <Link href="/fortune/saju">
                  <Button
                    size="lg"
                    className="bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600 text-white px-8 py-6 text-base font-semibold rounded-xl shadow-xl shadow-amber-500/25 hover:shadow-amber-500/40 transition-all hover:-translate-y-0.5"
                  >
                    <Zap className="mr-2 h-5 w-5" />
                    무료 운세 보기
                  </Button>
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ===== FEATURES SECTION ===== */}
      <section className="py-20 relative">
        <div className="container mx-auto px-4">
          <div className="grid md:grid-cols-3 gap-6">
            {[
              {
                icon: Lightbulb,
                title: '최신 AI 분석',
                desc: '500+ AI 툴의 실시간 분석과 수익화 잠재력 평가',
                gradient: 'from-amber-400 to-orange-500',
              },
              {
                icon: Layers,
                title: '단계별 가이드',
                desc: '초보자부터 전문가까지 맞춤형 수익화 로드맵',
                gradient: 'from-rose-400 to-pink-500',
              },
              {
                icon: Users,
                title: '커뮤니티',
                desc: '12,000+ 수익 창출자들과 함께하는 성장 네트워크',
                gradient: 'from-fuchsia-400 to-purple-500',
              },
            ].map((feature, i) => {
              const Icon = feature.icon;
              return (
                <div key={i} className="bg-card border border-border rounded-2xl p-7 hover:shadow-xl hover:-translate-y-1 transition-all duration-300 animate-fade-in-up" style={{ animationDelay: `${i * 100}ms` }}>
                  <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${feature.gradient} flex items-center justify-center mb-5 shadow-lg`}>
                    <Icon className="h-6 w-6 text-white" />
                  </div>
                  <h3 className="text-lg font-bold text-foreground mb-2">{feature.title}</h3>
                  <p className="text-muted-foreground text-sm leading-relaxed">{feature.desc}</p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* ===== QR CODE TOOL SECTION ===== */}
      <section className="py-16 relative">
        <div className="container mx-auto px-4">
          <div className="bg-gradient-to-br from-violet-50 via-purple-50 to-fuchsia-50 dark:from-violet-950/40 dark:via-purple-950/30 dark:to-fuchsia-950/20 border border-violet-200/50 dark:border-violet-800/30 rounded-3xl p-8 md:p-10 relative overflow-hidden">
            {/* Background decoration */}
            <div className="absolute top-0 right-0 w-64 h-64 bg-gradient-to-br from-violet-200/40 to-purple-200/30 dark:from-violet-600/10 dark:to-purple-600/10 rounded-full blur-[60px]" />
            <div className="absolute bottom-0 left-0 w-48 h-48 bg-gradient-to-br from-fuchsia-200/40 to-pink-200/30 dark:from-fuchsia-600/10 dark:to-pink-600/10 rounded-full blur-[60px]" />

            <div className="relative z-10 flex flex-col md:flex-row items-center justify-between gap-6">
              <div className="flex items-center gap-5">
                <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-violet-500 to-purple-600 flex items-center justify-center shadow-xl shadow-violet-500/25">
                  <QrCode className="h-8 w-8 text-white" />
                </div>
                <div>
                  <h3 className="text-xl md:text-2xl font-bold text-foreground mb-1">
                    PLANX-QR
                  </h3>
                  <p className="text-muted-foreground text-sm md:text-base">
                    QR 코드 생성 및 관리 서비스
                  </p>
                </div>
              </div>
              <a
                href="https://30daysliving.com"
                target="_blank"
                rel="noopener noreferrer"
              >
                <Button
                  size="lg"
                  className="bg-gradient-to-r from-violet-500 to-purple-600 hover:from-violet-600 hover:to-purple-700 text-white px-8 py-6 text-base font-semibold rounded-xl shadow-xl shadow-violet-500/25 hover:shadow-violet-500/40 transition-all hover:-translate-y-0.5"
                >
                  <QrCode className="mr-2 h-5 w-5" />
                  QR 서비스 이용하기
                  <ExternalLink className="ml-2 h-4 w-4" />
                </Button>
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* ===== FINAL CTA ===== */}
      <section className="py-20 relative">
        <div className="container mx-auto px-4 text-center">
          <div className="max-w-2xl mx-auto">
            <div className="inline-flex items-center gap-2 bg-gradient-to-r from-amber-100 to-orange-100 dark:from-amber-900/30 dark:to-orange-900/30 rounded-full px-4 py-2 mb-6">
              <Gem className="h-4 w-4 text-amber-500" />
              <span className="text-amber-700 dark:text-amber-300 text-sm font-medium">지금 시작하세요</span>
            </div>
            <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
              AI 수익화의 시작
            </h2>
            <p className="text-muted-foreground text-lg mb-10 max-w-xl mx-auto">
              이미 12,000명 이상이 AI를 활용해 새로운 수익을 창출하고 있습니다
            </p>
            <Link href="/ranking">
              <Button
                size="lg"
                className="bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600 text-white px-10 py-6 text-base font-semibold rounded-xl shadow-xl shadow-amber-500/25 hover:shadow-amber-500/40 transition-all hover:-translate-y-0.5"
              >
                <Flame className="mr-2 h-5 w-5" />
                수익화 AI 탐색하기
                <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Bottom Spacer */}
      <div className="h-16" />
    </div>
  );
}
