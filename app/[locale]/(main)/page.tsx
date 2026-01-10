import { setRequestLocale } from 'next-intl/server';
import { Link } from '@/i18n/routing';
import { Button } from '@/components/ui/button';
import {
  ArrowRight,
  Sparkles,
  TrendingUp,
  Star,
  Zap,
  DollarSign,
  Flame,
  Crown,
  Target,
  Rocket,
  Play,
  BarChart3,
  Wallet,
  Trophy,
  Eye,
  Clock,
  CheckCircle2,
  MousePointer,
  ArrowUpRight,
  Cpu,
  Layers,
  Globe,
} from 'lucide-react';

// 수익화 카테고리 데이터
const categories = [
  {
    id: 'beginner',
    title: '입문',
    subtitle: '누구나 시작 가능',
    icon: Rocket,
    color: 'from-emerald-500 to-teal-600',
    shadowColor: 'shadow-emerald-500/20',
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
    color: 'from-violet-500 to-purple-600',
    shadowColor: 'shadow-violet-500/20',
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
    color: 'from-pink-500 to-rose-600',
    shadowColor: 'shadow-pink-500/20',
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
    color: 'from-amber-500 to-orange-600',
    shadowColor: 'shadow-amber-500/20',
    items: [
      { name: 'SaaS 개발', income: '500~3000만', tools: 'Cursor' },
      { name: '자동화 구축', income: '400~1500만', tools: 'n8n' },
      { name: 'AI 컨설팅', income: '500~2000만', tools: '복합 AI' },
    ],
  },
];

// 실제 수익 사례
const successCases = [
  { category: '쇼츠 자동화', income: '월 580만', period: '4개월', difficulty: '중' },
  { category: '상세페이지 외주', income: '월 420만', period: '2개월', difficulty: '하' },
  { category: 'AI 자동화 대행', income: '월 1,200만', period: '3개월', difficulty: '상' },
];

// 통계 데이터
const stats = [
  { value: '500+', label: 'AI 툴 분석', icon: Cpu },
  { value: '12.8K', label: '수익 창출자', icon: TrendingUp },
  { value: '₩4.2억', label: '이번달 총 수익', icon: Wallet },
  { value: '3개월', label: '평균 수익 달성', icon: Clock },
];

export default async function HomePage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);

  return (
    <div className="min-h-screen luxury-gradient">
      {/* ===== HERO SECTION ===== */}
      <section className="relative min-h-[90vh] flex items-center justify-center overflow-hidden">
        {/* Animated Background Elements */}
        <div className="absolute inset-0 overflow-hidden">
          {/* Gradient Orbs */}
          <div className="absolute top-1/4 left-1/4 w-[600px] h-[600px] bg-purple-600/20 rounded-full blur-[128px] animate-float" />
          <div className="absolute bottom-1/4 right-1/4 w-[500px] h-[500px] bg-blue-600/15 rounded-full blur-[128px] animate-float animation-delay-500" />
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-emerald-600/10 rounded-full blur-[150px] animate-float animation-delay-1000" />

          {/* Grid Pattern */}
          <div className="absolute inset-0 bg-grid-pattern opacity-30" />

          {/* Floating particles */}
          <div className="absolute top-20 left-[10%] w-2 h-2 bg-purple-400 rounded-full animate-float opacity-60" />
          <div className="absolute top-40 right-[15%] w-3 h-3 bg-emerald-400 rounded-full animate-float animation-delay-300 opacity-60" />
          <div className="absolute bottom-40 left-[20%] w-2 h-2 bg-pink-400 rounded-full animate-float animation-delay-700 opacity-60" />
          <div className="absolute bottom-60 right-[25%] w-2 h-2 bg-amber-400 rounded-full animate-float animation-delay-500 opacity-60" />
        </div>

        <div className="container mx-auto px-4 relative z-10">
          <div className="max-w-5xl mx-auto text-center">
            {/* Top Badge */}
            <div className="inline-flex items-center gap-3 glass rounded-full px-6 py-3 mb-8 animate-fade-in-up">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
                <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500" />
              </span>
              <span className="text-slate-300 text-sm">
                오늘 <span className="text-white font-semibold">12,847명</span>이 AI로 수익 창출 중
              </span>
            </div>

            {/* Main Headline */}
            <h1 className="text-display font-bold mb-8 animate-fade-in-up animation-delay-150">
              <span className="text-white">AI로 시작하는</span>
              <br />
              <span className="text-gradient-emerald animate-text-glow">
                월 1,000만원 수익화
              </span>
            </h1>

            {/* Subheadline */}
            <p className="text-xl md:text-2xl text-slate-400 mb-8 max-w-3xl mx-auto animate-fade-in-up animation-delay-300 leading-relaxed">
              검증된 AI 조합으로 부업부터 본업까지
              <br className="hidden md:block" />
              <span className="text-slate-300">실제 수익 사례</span>와 <span className="text-slate-300">단계별 가이드</span> 제공
            </p>

            {/* Trust Indicators */}
            <div className="flex flex-wrap justify-center gap-6 mb-12 animate-fade-in-up animation-delay-500">
              {['500+ AI 툴 분석', '1,200+ 수익화 사례', '평균 3개월 내 수익'].map((item, i) => (
                <div key={i} className="flex items-center gap-2 text-slate-400">
                  <CheckCircle2 className="h-5 w-5 text-emerald-400" />
                  <span>{item}</span>
                </div>
              ))}
            </div>

            {/* CTA Buttons */}
            <div className="flex flex-wrap justify-center gap-4 animate-fade-in-up animation-delay-700">
              <Link href="/ranking">
                <Button
                  size="lg"
                  className="btn-premium bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-600 hover:to-teal-700 text-white px-8 py-7 text-lg rounded-2xl shadow-2xl shadow-emerald-500/30"
                >
                  <TrendingUp className="mr-2 h-5 w-5" />
                  수익화 AI 순위 보기
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Button>
              </Link>
              <Link href="/guide">
                <Button
                  size="lg"
                  className="btn-premium glass text-white px-8 py-7 text-lg rounded-2xl hover:bg-white/10"
                >
                  <Play className="mr-2 h-5 w-5" />
                  무료 가이드 시작
                </Button>
              </Link>
            </div>

            {/* Scroll Indicator */}
            <div className="absolute bottom-8 left-1/2 -translate-x-1/2 animate-bounce-subtle">
              <MousePointer className="h-6 w-6 text-slate-500" />
            </div>
          </div>
        </div>
      </section>

      {/* ===== STATS SECTION ===== */}
      <section className="py-20 relative">
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-emerald-950/10 to-transparent" />
        <div className="container mx-auto px-4 relative z-10">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {stats.map((stat, i) => {
              const Icon = stat.icon;
              return (
                <div
                  key={stat.label}
                  className="text-center group animate-fade-in-up"
                  style={{ animationDelay: `${i * 100}ms` }}
                >
                  <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl glass mb-4 group-hover:scale-110 transition-transform duration-300">
                    <Icon className="h-7 w-7 text-emerald-400" />
                  </div>
                  <div className="text-4xl md:text-5xl font-bold text-white mb-2">
                    {stat.value}
                  </div>
                  <div className="text-slate-500 text-sm">
                    {stat.label}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* ===== CATEGORIES SECTION ===== */}
      <section className="py-24 relative">
        <div className="container mx-auto px-4">
          {/* Section Header */}
          <div className="text-center mb-16">
            <div className="inline-flex items-center gap-2 glass rounded-full px-5 py-2.5 mb-6">
              <BarChart3 className="h-4 w-4 text-violet-400" />
              <span className="text-slate-300 text-sm font-medium">난이도별 수익화</span>
            </div>
            <h2 className="text-headline font-bold text-white mb-4">
              나에게 맞는 수익화 찾기
            </h2>
            <p className="text-slate-400 text-lg">
              현실적인 예상 수익과 필요 기간을 확인하세요
            </p>
          </div>

          {/* Category Cards */}
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {categories.map((cat, index) => {
              const Icon = cat.icon;
              return (
                <div
                  key={cat.id}
                  className="card-premium glass-card rounded-3xl overflow-hidden animate-fade-in-up"
                  style={{ animationDelay: `${index * 100}ms` }}
                >
                  {/* Card Header */}
                  <div className={`bg-gradient-to-r ${cat.color} p-6`}>
                    <div className="flex items-center justify-between mb-4">
                      <div className="w-12 h-12 bg-white/20 rounded-xl flex items-center justify-center backdrop-blur-sm">
                        <Icon className="h-6 w-6 text-white" />
                      </div>
                      <ArrowUpRight className="h-5 w-5 text-white/60 group-hover:text-white transition-colors" />
                    </div>
                    <h3 className="text-2xl font-bold text-white mb-1">{cat.title}</h3>
                    <p className="text-white/70 text-sm">{cat.subtitle}</p>
                  </div>

                  {/* Card Content */}
                  <div className="p-5 space-y-3">
                    {cat.items.map((item, idx) => (
                      <div
                        key={idx}
                        className="flex items-center justify-between p-4 rounded-xl bg-white/5 hover:bg-white/10 transition-colors cursor-pointer group/item"
                      >
                        <div>
                          <p className="text-white font-medium text-sm group-hover/item:text-emerald-400 transition-colors">
                            {item.name}
                          </p>
                          <p className="text-slate-500 text-xs mt-0.5">{item.tools}</p>
                        </div>
                        <div className="text-emerald-400 font-bold text-sm">
                          ₩{item.income}
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
      <section className="py-24 relative">
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-purple-950/10 to-transparent" />
        <div className="container mx-auto px-4 relative z-10">
          {/* Section Header */}
          <div className="text-center mb-16">
            <div className="inline-flex items-center gap-2 glass rounded-full px-5 py-2.5 mb-6">
              <Trophy className="h-4 w-4 text-amber-400" />
              <span className="text-slate-300 text-sm font-medium">검증된 성공 사례</span>
            </div>
            <h2 className="text-headline font-bold text-white mb-4">
              실제 수익화 후기
            </h2>
            <p className="text-slate-400 text-lg">
              현실적인 수익과 소요 기간
            </p>
          </div>

          {/* Success Cards */}
          <div className="grid md:grid-cols-3 gap-6 max-w-4xl mx-auto">
            {successCases.map((item, index) => (
              <div
                key={index}
                className="card-premium glass-card rounded-3xl p-8 text-center animate-fade-in-up"
                style={{ animationDelay: `${index * 100}ms` }}
              >
                <div className="text-4xl font-bold text-emerald-400 mb-2">
                  {item.income}
                </div>
                <div className="text-white font-semibold mb-1">{item.category}</div>
                <div className="text-slate-500 text-sm mb-4">{item.period} 소요</div>
                <div className={`inline-flex items-center px-3 py-1.5 rounded-full text-xs font-medium ${
                  item.difficulty === '하'
                    ? 'bg-emerald-500/20 text-emerald-400'
                    : item.difficulty === '중'
                    ? 'bg-amber-500/20 text-amber-400'
                    : 'bg-rose-500/20 text-rose-400'
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
                className="btn-premium bg-gradient-to-r from-violet-500 to-purple-600 hover:from-violet-600 hover:to-purple-700 text-white px-8 py-6 text-lg rounded-2xl shadow-2xl shadow-violet-500/30"
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
      <section className="py-24 relative">
        <div className="container mx-auto px-4">
          <div className="glass-premium rounded-[2rem] p-12 md:p-16 relative overflow-hidden animate-border-glow">
            {/* Background decoration */}
            <div className="absolute top-0 right-0 w-96 h-96 bg-purple-500/10 rounded-full blur-[100px]" />
            <div className="absolute bottom-0 left-0 w-80 h-80 bg-pink-500/10 rounded-full blur-[100px]" />

            <div className="relative z-10 flex flex-col md:flex-row items-center justify-between gap-8">
              <div className="text-center md:text-left">
                <div className="inline-flex items-center gap-2 glass rounded-full px-4 py-2 mb-6">
                  <Sparkles className="h-4 w-4 text-purple-400" />
                  <span className="text-slate-300 text-sm font-medium">AI FORTUNE</span>
                </div>
                <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
                  오늘의 AI 수익운은?
                </h2>
                <p className="text-slate-400 text-lg max-w-md">
                  AI 사주 분석으로 나에게 맞는 수익화 분야를 찾아보세요
                </p>
              </div>
              <div className="flex flex-col sm:flex-row gap-4">
                <Link href="/fortune/saju">
                  <Button
                    size="lg"
                    className="btn-premium bg-gradient-to-r from-purple-500 to-pink-600 hover:from-purple-600 hover:to-pink-700 text-white px-8 py-6 text-lg rounded-2xl shadow-2xl shadow-purple-500/30"
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
      <section className="py-24 relative">
        <div className="container mx-auto px-4">
          <div className="grid md:grid-cols-3 gap-8">
            {[
              {
                icon: Cpu,
                title: '최신 AI 분석',
                desc: '500+ AI 툴의 실시간 분석과 수익화 잠재력 평가',
                color: 'text-violet-400',
              },
              {
                icon: Layers,
                title: '단계별 가이드',
                desc: '초보자부터 전문가까지 맞춤형 수익화 로드맵',
                color: 'text-emerald-400',
              },
              {
                icon: Globe,
                title: '커뮤니티',
                desc: '12,000+ 수익 창출자들과 함께하는 성장 네트워크',
                color: 'text-amber-400',
              },
            ].map((feature, i) => {
              const Icon = feature.icon;
              return (
                <div key={i} className="glass-card rounded-3xl p-8 card-premium animate-fade-in-up" style={{ animationDelay: `${i * 100}ms` }}>
                  <div className={`w-14 h-14 rounded-2xl glass flex items-center justify-center mb-6 ${feature.color}`}>
                    <Icon className="h-7 w-7" />
                  </div>
                  <h3 className="text-xl font-bold text-white mb-3">{feature.title}</h3>
                  <p className="text-slate-400 leading-relaxed">{feature.desc}</p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* ===== FINAL CTA ===== */}
      <section className="py-24 relative">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-headline font-bold text-white mb-6">
            지금 바로 시작하세요
          </h2>
          <p className="text-slate-400 text-lg mb-10 max-w-2xl mx-auto">
            이미 12,000명 이상이 AI를 활용해 새로운 수익을 창출하고 있습니다
          </p>
          <Link href="/ranking">
            <Button
              size="lg"
              className="btn-premium bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-600 hover:to-teal-700 text-white px-10 py-7 text-lg rounded-2xl shadow-2xl shadow-emerald-500/30"
            >
              <Flame className="mr-2 h-5 w-5" />
              수익화 AI 탐색하기
              <ArrowRight className="ml-2 h-5 w-5" />
            </Button>
          </Link>
        </div>
      </section>

      {/* Bottom Spacer */}
      <div className="h-20" />
    </div>
  );
}
