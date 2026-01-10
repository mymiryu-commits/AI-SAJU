import { useTranslations } from 'next-intl';
import { setRequestLocale } from 'next-intl/server';
import { Link } from '@/i18n/routing';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import Image from 'next/image';
import {
  ArrowRight,
  Sparkles,
  TrendingUp,
  Star,
  Zap,
  MessageSquare,
  Image as ImageIcon,
  Video,
  Code,
  Briefcase,
  DollarSign,
  GraduationCap,
  Palette,
  Music,
  PenTool,
  Layers,
  ChevronRight,
  Crown,
  Target,
  Users,
  Rocket,
} from 'lucide-react';

// AI Tools with logos and detailed info
const aiTools = [
  {
    name: 'ChatGPT',
    logo: '/ai-logos/chatgpt.svg',
    category: 'chat',
    score: 95,
    trend: 'up',
    badge: 'TOP 1',
    color: 'from-emerald-500 to-teal-600',
    description: '가장 범용적인 대화형 AI',
    users: '100M+',
  },
  {
    name: 'Claude',
    logo: '/ai-logos/claude.svg',
    category: 'chat',
    score: 93,
    trend: 'up',
    badge: 'TOP 2',
    color: 'from-orange-500 to-amber-600',
    description: '코딩과 분석에 최적화',
    users: '50M+',
  },
  {
    name: 'Midjourney',
    logo: '/ai-logos/midjourney.svg',
    category: 'image',
    score: 98,
    trend: 'stable',
    badge: 'TOP 1',
    color: 'from-indigo-500 to-purple-600',
    description: '최고의 이미지 생성 AI',
    users: '16M+',
  },
  {
    name: 'Runway',
    logo: '/ai-logos/runway.svg',
    category: 'video',
    score: 90,
    trend: 'up',
    badge: 'HOT',
    color: 'from-pink-500 to-rose-600',
    description: '전문가급 영상 생성',
    users: '5M+',
  },
  {
    name: 'Cursor',
    logo: '/ai-logos/cursor.svg',
    category: 'code',
    score: 94,
    trend: 'up',
    badge: 'NEW',
    color: 'from-blue-500 to-cyan-600',
    description: 'AI 기반 코드 에디터',
    users: '2M+',
  },
  {
    name: 'Perplexity',
    logo: '/ai-logos/perplexity.svg',
    category: 'search',
    score: 91,
    trend: 'up',
    badge: 'HOT',
    color: 'from-violet-500 to-purple-600',
    description: 'AI 검색 엔진',
    users: '10M+',
  },
];

// AI Combo recommendations
const aiCombos = [
  {
    title: '콘텐츠 크리에이터',
    description: '블로그, 유튜브, SNS 콘텐츠 제작',
    tools: ['ChatGPT', 'Midjourney', 'Runway'],
    icon: Palette,
    gradient: 'from-pink-500 via-purple-500 to-indigo-500',
  },
  {
    title: '스타트업 창업자',
    description: '비즈니스 기획부터 개발까지',
    tools: ['Claude', 'Cursor', 'Notion AI'],
    icon: Rocket,
    gradient: 'from-orange-500 via-red-500 to-pink-500',
  },
  {
    title: '마케터',
    description: '광고 카피, 이미지, 분석',
    tools: ['ChatGPT', 'DALL-E', 'Jasper'],
    icon: Target,
    gradient: 'from-green-500 via-emerald-500 to-teal-500',
  },
  {
    title: '개발자',
    description: '코딩, 디버깅, 문서화',
    tools: ['Claude', 'Cursor', 'GitHub Copilot'],
    icon: Code,
    gradient: 'from-blue-500 via-cyan-500 to-teal-500',
  },
];

// Practical categories
const practicalCategories = [
  {
    key: 'business',
    title: '업무 효율화',
    icon: Briefcase,
    color: 'bg-blue-500',
    items: ['문서 작성', '이메일', '회의록', '번역'],
  },
  {
    key: 'monetization',
    title: '수익화',
    icon: DollarSign,
    color: 'bg-green-500',
    items: ['콘텐츠 제작', '디자인', '마케팅', '자동화'],
  },
  {
    key: 'learning',
    title: '학습/교육',
    icon: GraduationCap,
    color: 'bg-purple-500',
    items: ['논문 분석', '언어 학습', '튜터링', '요약'],
  },
  {
    key: 'creative',
    title: '크리에이티브',
    icon: Palette,
    color: 'bg-pink-500',
    items: ['이미지', '영상', '음악', '글쓰기'],
  },
];

export default async function HomePage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);

  return (
    <div className="flex flex-col min-h-screen bg-gradient-to-b from-slate-950 via-slate-900 to-slate-950">
      {/* Hero Section - Glassmorphism */}
      <section className="relative overflow-hidden py-20 md:py-32">
        {/* Animated background orbs */}
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-purple-500/30 rounded-full blur-3xl animate-pulse" />
          <div className="absolute top-1/2 right-1/4 w-80 h-80 bg-blue-500/20 rounded-full blur-3xl animate-pulse delay-1000" />
          <div className="absolute bottom-1/4 left-1/2 w-72 h-72 bg-pink-500/20 rounded-full blur-3xl animate-pulse delay-500" />
        </div>

        {/* Grid pattern overlay */}
        <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.02)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.02)_1px,transparent_1px)] bg-[size:64px_64px]" />

        <div className="container mx-auto px-4 relative z-10">
          <div className="max-w-4xl mx-auto text-center">
            <Badge className="mb-6 bg-white/10 text-white border border-white/20 backdrop-blur-sm px-4 py-2">
              <Sparkles className="mr-2 h-4 w-4 text-yellow-400" />
              2025 AI Tools Ranking
            </Badge>

            <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold mb-6 leading-tight">
              <span className="bg-gradient-to-r from-white via-purple-200 to-white bg-clip-text text-transparent">
                최적의 AI 조합을
              </span>
              <br />
              <span className="bg-gradient-to-r from-purple-400 via-pink-400 to-blue-400 bg-clip-text text-transparent">
                발견하세요
              </span>
            </h1>

            <p className="text-lg md:text-xl text-slate-400 mb-10 max-w-2xl mx-auto">
              500+ AI 툴 분석 · 목적별 최적 조합 추천 · 실제 사용자 리뷰 기반
            </p>

            <div className="flex flex-wrap justify-center gap-4">
              <Link href="/ranking">
                <Button size="lg" className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white px-8 py-6 text-lg rounded-xl shadow-lg shadow-purple-500/25 transition-all hover:shadow-purple-500/40 hover:scale-105">
                  AI 랭킹 보기
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Button>
              </Link>
              <Link href="/fortune/free">
                <Button size="lg" variant="outline" className="border-white/20 text-white hover:bg-white/10 px-8 py-6 text-lg rounded-xl backdrop-blur-sm">
                  <Sparkles className="mr-2 h-5 w-5 text-yellow-400" />
                  AI 운세 체험
                </Button>
              </Link>
            </div>
          </div>

          {/* Floating AI logos */}
          <div className="mt-16 flex justify-center items-center gap-8 flex-wrap">
            {aiTools.slice(0, 6).map((tool, index) => (
              <div
                key={tool.name}
                className="group relative"
                style={{ animationDelay: `${index * 100}ms` }}
              >
                <div className="w-16 h-16 md:w-20 md:h-20 rounded-2xl bg-white/10 backdrop-blur-md border border-white/20 flex items-center justify-center transition-all duration-300 group-hover:scale-110 group-hover:bg-white/20 group-hover:shadow-lg group-hover:shadow-purple-500/20">
                  <div className={`w-10 h-10 md:w-12 md:h-12 rounded-xl bg-gradient-to-br ${tool.color} flex items-center justify-center text-white font-bold text-lg`}>
                    {tool.name.charAt(0)}
                  </div>
                </div>
                <span className="absolute -bottom-6 left-1/2 -translate-x-1/2 text-xs text-slate-500 opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap">
                  {tool.name}
                </span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Top AI Tools Section */}
      <section className="py-20 relative">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between mb-12">
            <div>
              <Badge className="mb-3 bg-yellow-500/20 text-yellow-400 border-yellow-500/30">
                <Crown className="mr-1 h-3 w-3" /> TOP RANKED
              </Badge>
              <h2 className="text-3xl md:text-4xl font-bold text-white">
                이번 주 인기 AI
              </h2>
            </div>
            <Link href="/ranking" className="text-purple-400 hover:text-purple-300 flex items-center gap-1 text-sm">
              전체 보기 <ChevronRight className="h-4 w-4" />
            </Link>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {aiTools.map((tool, index) => (
              <Card key={tool.name} className="bg-white/5 border-white/10 backdrop-blur-sm hover:bg-white/10 transition-all duration-300 hover:scale-[1.02] hover:shadow-xl hover:shadow-purple-500/10 overflow-hidden group">
                <CardContent className="p-6">
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex items-center gap-4">
                      <div className={`w-14 h-14 rounded-xl bg-gradient-to-br ${tool.color} flex items-center justify-center text-white font-bold text-xl shadow-lg`}>
                        {tool.name.charAt(0)}
                      </div>
                      <div>
                        <h3 className="font-semibold text-white text-lg">{tool.name}</h3>
                        <p className="text-sm text-slate-400">{tool.description}</p>
                      </div>
                    </div>
                    <Badge
                      className={`${
                        tool.badge === 'TOP 1' ? 'bg-yellow-500/20 text-yellow-400 border-yellow-500/30' :
                        tool.badge === 'TOP 2' ? 'bg-slate-500/20 text-slate-300 border-slate-500/30' :
                        tool.badge === 'HOT' ? 'bg-red-500/20 text-red-400 border-red-500/30' :
                        'bg-blue-500/20 text-blue-400 border-blue-500/30'
                      }`}
                    >
                      {tool.badge}
                    </Badge>
                  </div>

                  <div className="flex items-center justify-between mt-4 pt-4 border-t border-white/10">
                    <div className="flex items-center gap-4">
                      <div className="flex items-center gap-1.5">
                        <Star className="h-4 w-4 text-yellow-400 fill-yellow-400" />
                        <span className="text-white font-medium">{tool.score}</span>
                      </div>
                      <div className="flex items-center gap-1.5 text-slate-400 text-sm">
                        <Users className="h-4 w-4" />
                        {tool.users}
                      </div>
                    </div>
                    {tool.trend === 'up' && (
                      <div className="flex items-center gap-1 text-green-400 text-sm">
                        <TrendingUp className="h-4 w-4" />
                        상승중
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* AI Combo Recommendations */}
      <section className="py-20 relative">
        <div className="absolute inset-0 bg-gradient-to-b from-purple-900/20 to-transparent" />
        <div className="container mx-auto px-4 relative z-10">
          <div className="text-center mb-12">
            <Badge className="mb-3 bg-purple-500/20 text-purple-400 border-purple-500/30">
              <Layers className="mr-1 h-3 w-3" /> AI COMBO
            </Badge>
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
              목적별 AI 조합 추천
            </h2>
            <p className="text-slate-400 max-w-2xl mx-auto">
              혼자 쓰면 좋은 AI, 함께 쓰면 더 강력해집니다
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-6">
            {aiCombos.map((combo) => {
              const Icon = combo.icon;
              return (
                <Card key={combo.title} className="bg-white/5 border-white/10 backdrop-blur-sm hover:bg-white/10 transition-all duration-300 overflow-hidden group cursor-pointer">
                  <CardContent className="p-6">
                    <div className="flex items-start gap-4">
                      <div className={`w-14 h-14 rounded-xl bg-gradient-to-br ${combo.gradient} flex items-center justify-center shrink-0`}>
                        <Icon className="h-7 w-7 text-white" />
                      </div>
                      <div className="flex-1">
                        <h3 className="font-semibold text-white text-lg mb-1">{combo.title}</h3>
                        <p className="text-sm text-slate-400 mb-4">{combo.description}</p>
                        <div className="flex flex-wrap gap-2">
                          {combo.tools.map((tool) => (
                            <Badge key={tool} variant="secondary" className="bg-white/10 text-white border-white/20">
                              {tool}
                            </Badge>
                          ))}
                        </div>
                      </div>
                      <ChevronRight className="h-5 w-5 text-slate-500 group-hover:text-white group-hover:translate-x-1 transition-all" />
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>

          <div className="text-center mt-8">
            <Link href="/ranking">
              <Button variant="outline" className="border-white/20 text-white hover:bg-white/10">
                더 많은 조합 보기
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Practical Categories */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <Badge className="mb-3 bg-blue-500/20 text-blue-400 border-blue-500/30">
              <Target className="mr-1 h-3 w-3" /> USE CASES
            </Badge>
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
              어떤 용도로 사용하시나요?
            </h2>
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {practicalCategories.map((cat) => {
              const Icon = cat.icon;
              return (
                <Link key={cat.key} href={`/ranking?use=${cat.key}`}>
                  <Card className="bg-white/5 border-white/10 backdrop-blur-sm hover:bg-white/10 transition-all duration-300 hover:scale-[1.02] h-full cursor-pointer group">
                    <CardContent className="p-6">
                      <div className={`w-12 h-12 rounded-xl ${cat.color} flex items-center justify-center mb-4 group-hover:scale-110 transition-transform`}>
                        <Icon className="h-6 w-6 text-white" />
                      </div>
                      <h3 className="font-semibold text-white text-lg mb-3">{cat.title}</h3>
                      <div className="flex flex-wrap gap-2">
                        {cat.items.map((item) => (
                          <span key={item} className="text-xs text-slate-400 bg-white/5 px-2 py-1 rounded">
                            {item}
                          </span>
                        ))}
                      </div>
                    </CardContent>
                  </Card>
                </Link>
              );
            })}
          </div>
        </div>
      </section>

      {/* Fortune CTA Section */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <Card className="overflow-hidden bg-gradient-to-br from-purple-900/50 via-slate-900 to-pink-900/50 border-white/10 backdrop-blur-sm">
            <div className="grid md:grid-cols-2 gap-8 p-8 md:p-12">
              <div>
                <Badge className="mb-4 bg-yellow-500/20 text-yellow-400 border-yellow-500/30">
                  <Sparkles className="mr-1 h-3 w-3" />
                  AI FORTUNE
                </Badge>
                <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
                  AI가 분석하는<br />당신의 운세
                </h2>
                <p className="text-slate-400 mb-8">
                  사주, 관상, 궁합까지 - AI 기반의 정확한 분석을 경험하세요
                </p>
                <div className="flex flex-wrap gap-4">
                  <Link href="/fortune/free">
                    <Button className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white">
                      무료 체험하기
                      <ArrowRight className="ml-2 h-4 w-4" />
                    </Button>
                  </Link>
                  <Link href="/fortune">
                    <Button variant="outline" className="border-white/20 text-white hover:bg-white/10">
                      서비스 알아보기
                    </Button>
                  </Link>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                {[
                  { href: '/fortune/saju', icon: Zap, label: '사주 분석', desc: '타고난 운명 분석' },
                  { href: '/fortune/face', icon: Star, label: '관상 분석', desc: 'AI 얼굴 분석' },
                  { href: '/fortune/compatibility', icon: Users, label: '궁합 분석', desc: '인연 궁합 확인' },
                  { href: '/fortune/integrated', icon: Sparkles, label: '종합 분석', desc: '모든 운세 통합' },
                ].map((item) => {
                  const Icon = item.icon;
                  return (
                    <Link key={item.href} href={item.href}>
                      <div className="p-4 rounded-xl bg-white/5 border border-white/10 hover:bg-white/10 hover:border-white/20 transition-all cursor-pointer group h-full">
                        <Icon className="h-6 w-6 text-purple-400 mb-2 group-hover:scale-110 transition-transform" />
                        <h4 className="font-medium text-white mb-1">{item.label}</h4>
                        <p className="text-xs text-slate-500">{item.desc}</p>
                      </div>
                    </Link>
                  );
                })}
              </div>
            </div>
          </Card>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-16 border-t border-white/10">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {[
              { value: '500+', label: 'AI 툴 분석' },
              { value: '50K+', label: '사용자 리뷰' },
              { value: '100+', label: 'AI 조합 추천' },
              { value: '99%', label: '만족도' },
            ].map((stat) => (
              <div key={stat.label} className="text-center">
                <div className="text-3xl md:text-4xl font-bold bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent mb-2">
                  {stat.value}
                </div>
                <div className="text-slate-500 text-sm">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
