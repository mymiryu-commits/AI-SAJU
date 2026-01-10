import { setRequestLocale } from 'next-intl/server';
import { Link } from '@/i18n/routing';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import {
  ArrowRight,
  Sparkles,
  TrendingUp,
  Star,
  Zap,
  DollarSign,
  Flame,
  ChevronRight,
  Crown,
  Target,
  Users,
  Rocket,
  Play,
  BarChart3,
  Wallet,
  Trophy,
  Eye,
  Clock,
  CheckCircle2,
} from 'lucide-react';

// AI 순위 데이터 - 범용 AI
const topAITools = [
  {
    rank: 1,
    name: 'ChatGPT',
    category: '대화형 AI',
    score: 95,
    monthlyIncome: '₩3,200만',
    incomeDesc: '콘텐츠 제작 평균',
    color: 'from-emerald-500 to-teal-600',
    users: '200M+',
    trending: true,
  },
  {
    rank: 2,
    name: 'Claude',
    category: '코딩/분석',
    score: 94,
    monthlyIncome: '₩2,800만',
    incomeDesc: '개발 프리랜서 평균',
    color: 'from-orange-500 to-amber-600',
    users: '50M+',
    trending: true,
  },
  {
    rank: 3,
    name: 'Midjourney',
    category: '이미지 생성',
    score: 98,
    monthlyIncome: '₩1,500만',
    incomeDesc: '디자인 판매 평균',
    color: 'from-indigo-500 to-purple-600',
    users: '16M+',
    trending: false,
  },
];

// 수익화 AI 순위
const monetizationAI = [
  {
    rank: 1,
    name: 'Jasper',
    useCase: '마케팅 카피',
    avgIncome: '₩850만/월',
    difficulty: '쉬움',
    color: 'from-violet-500 to-purple-600',
  },
  {
    rank: 2,
    name: 'Midjourney',
    useCase: '디자인 판매',
    avgIncome: '₩1,200만/월',
    difficulty: '보통',
    color: 'from-pink-500 to-rose-600',
  },
  {
    rank: 3,
    name: 'Cursor + Claude',
    useCase: 'SaaS 개발',
    avgIncome: '₩3,500만/월',
    difficulty: '어려움',
    color: 'from-blue-500 to-cyan-600',
  },
];

// 수익화 성공 사례
const successStories = [
  {
    title: '블로그 자동화',
    income: '월 ₩320만',
    period: '3개월만에',
    tools: ['ChatGPT', 'Canva AI'],
    avatar: '👨‍💻',
  },
  {
    title: '유튜브 쇼츠',
    income: '월 ₩580만',
    period: '6개월만에',
    tools: ['Runway', 'ElevenLabs'],
    avatar: '🎬',
  },
  {
    title: '이모티콘 판매',
    income: '월 ₩450만',
    period: '2개월만에',
    tools: ['Midjourney', 'DALL-E'],
    avatar: '🎨',
  },
  {
    title: '온라인 강의',
    income: '월 ₩1,200만',
    period: '4개월만에',
    tools: ['Claude', 'Synthesia'],
    avatar: '📚',
  },
];

// 수익화 카테고리
const incomeCategories = [
  {
    icon: Rocket,
    title: '빠른 시작',
    desc: '오늘 바로 시작 가능',
    items: ['블로그', '번역', '카피라이팅'],
    gradient: 'from-green-500 to-emerald-600',
    avgIncome: '₩200~500만',
  },
  {
    icon: Target,
    title: '안정적 수익',
    desc: '꾸준한 수입 창출',
    items: ['콘텐츠 제작', '디자인', 'SNS 관리'],
    gradient: 'from-blue-500 to-indigo-600',
    avgIncome: '₩500~1,000만',
  },
  {
    icon: Crown,
    title: '고수익',
    desc: '전문성 기반 고수익',
    items: ['SaaS 개발', '컨설팅', '교육'],
    gradient: 'from-amber-500 to-orange-600',
    avgIncome: '₩1,000만+',
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
      {/* Hero Section - 수익화 테마 */}
      <section className="relative overflow-hidden py-16 md:py-28">
        {/* Animated background */}
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute top-20 left-10 w-72 h-72 bg-green-500/20 rounded-full blur-3xl animate-pulse" />
          <div className="absolute top-40 right-20 w-96 h-96 bg-emerald-500/15 rounded-full blur-3xl animate-pulse delay-700" />
          <div className="absolute bottom-20 left-1/3 w-80 h-80 bg-yellow-500/10 rounded-full blur-3xl animate-pulse delay-1000" />
        </div>

        {/* Grid pattern */}
        <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.02)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.02)_1px,transparent_1px)] bg-[size:64px_64px]" />

        <div className="container mx-auto px-4 relative z-10">
          {/* 실시간 수익 배너 */}
          <div className="flex justify-center mb-8">
            <div className="inline-flex items-center gap-3 bg-gradient-to-r from-green-500/20 to-emerald-500/20 border border-green-500/30 rounded-full px-5 py-2.5 backdrop-blur-sm">
              <span className="relative flex h-2.5 w-2.5">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-green-500"></span>
              </span>
              <span className="text-green-400 text-sm font-medium">
                오늘 AI로 수익 창출 중인 사람: <span className="text-white font-bold">12,847명</span>
              </span>
            </div>
          </div>

          <div className="max-w-5xl mx-auto text-center">
            <Badge className="mb-6 bg-amber-500/20 text-amber-400 border-amber-500/30 px-4 py-2">
              <DollarSign className="mr-2 h-4 w-4" />
              2025 AI 수익화 가이드
            </Badge>

            <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold mb-6 leading-tight">
              <span className="text-white">
                AI로 시작하는
              </span>
              <br />
              <span className="bg-gradient-to-r from-green-400 via-emerald-400 to-teal-400 bg-clip-text text-transparent">
                월 1,000만원 수익화
              </span>
            </h1>

            <p className="text-lg md:text-xl text-slate-400 mb-6 max-w-3xl mx-auto">
              검증된 AI 조합으로 부업부터 본업까지 · 실제 수익 사례 공개 · 단계별 가이드 제공
            </p>

            {/* 핵심 지표 */}
            <div className="flex flex-wrap justify-center gap-6 mb-10">
              <div className="flex items-center gap-2 text-slate-300">
                <CheckCircle2 className="h-5 w-5 text-green-400" />
                <span>500+ AI 툴 분석</span>
              </div>
              <div className="flex items-center gap-2 text-slate-300">
                <CheckCircle2 className="h-5 w-5 text-green-400" />
                <span>1,200+ 수익화 사례</span>
              </div>
              <div className="flex items-center gap-2 text-slate-300">
                <CheckCircle2 className="h-5 w-5 text-green-400" />
                <span>평균 3개월 내 수익 달성</span>
              </div>
            </div>

            <div className="flex flex-wrap justify-center gap-4">
              <Link href="/ranking">
                <Button size="lg" className="bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 text-white px-8 py-6 text-lg rounded-xl shadow-lg shadow-green-500/25 transition-all hover:shadow-green-500/40 hover:scale-105">
                  <Flame className="mr-2 h-5 w-5" />
                  수익화 AI 순위 보기
                </Button>
              </Link>
              <Link href="/guide">
                <Button size="lg" variant="outline" className="border-white/20 text-white hover:bg-white/10 px-8 py-6 text-lg rounded-xl backdrop-blur-sm group">
                  <Play className="mr-2 h-5 w-5 group-hover:text-green-400 transition-colors" />
                  무료 가이드 시작
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* 양쪽 순위 비교 섹션 */}
      <section className="py-16 relative">
        <div className="container mx-auto px-4">
          <div className="grid lg:grid-cols-2 gap-8">
            {/* 왼쪽: AI 순위 */}
            <div>
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-purple-500/20 flex items-center justify-center">
                    <Trophy className="h-5 w-5 text-purple-400" />
                  </div>
                  <div>
                    <h2 className="text-xl font-bold text-white">AI 순위 TOP 3</h2>
                    <p className="text-sm text-slate-500">성능 기반</p>
                  </div>
                </div>
                <Link href="/ranking" className="text-purple-400 hover:text-purple-300 text-sm flex items-center gap-1">
                  전체 보기 <ChevronRight className="h-4 w-4" />
                </Link>
              </div>

              <div className="space-y-3">
                {topAITools.map((tool) => (
                  <Card key={tool.name} className="bg-white/5 border-white/10 hover:bg-white/10 transition-all cursor-pointer group">
                    <CardContent className="p-4">
                      <div className="flex items-center gap-4">
                        <div className={`w-10 h-10 rounded-lg bg-gradient-to-br ${tool.color} flex items-center justify-center text-white font-bold text-sm`}>
                          #{tool.rank}
                        </div>
                        <div className="flex-1">
                          <div className="flex items-center gap-2">
                            <span className="font-semibold text-white">{tool.name}</span>
                            {tool.trending && (
                              <TrendingUp className="h-4 w-4 text-green-400" />
                            )}
                          </div>
                          <span className="text-xs text-slate-500">{tool.category}</span>
                        </div>
                        <div className="text-right">
                          <div className="flex items-center gap-1">
                            <Star className="h-4 w-4 text-yellow-400 fill-yellow-400" />
                            <span className="text-white font-medium">{tool.score}</span>
                          </div>
                          <span className="text-xs text-slate-500">{tool.users} 사용</span>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>

            {/* 오른쪽: 수익화 순위 */}
            <div>
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-green-500/20 flex items-center justify-center">
                    <DollarSign className="h-5 w-5 text-green-400" />
                  </div>
                  <div>
                    <h2 className="text-xl font-bold text-white">수익화 AI TOP 3</h2>
                    <p className="text-sm text-slate-500">수익 기반</p>
                  </div>
                </div>
                <Link href="/ranking?sort=income" className="text-green-400 hover:text-green-300 text-sm flex items-center gap-1">
                  전체 보기 <ChevronRight className="h-4 w-4" />
                </Link>
              </div>

              <div className="space-y-3">
                {monetizationAI.map((tool) => (
                  <Card key={tool.name} className="bg-white/5 border-white/10 hover:bg-white/10 transition-all cursor-pointer group">
                    <CardContent className="p-4">
                      <div className="flex items-center gap-4">
                        <div className={`w-10 h-10 rounded-lg bg-gradient-to-br ${tool.color} flex items-center justify-center text-white font-bold text-sm`}>
                          #{tool.rank}
                        </div>
                        <div className="flex-1">
                          <div className="flex items-center gap-2">
                            <span className="font-semibold text-white">{tool.name}</span>
                          </div>
                          <span className="text-xs text-slate-500">{tool.useCase}</span>
                        </div>
                        <div className="text-right">
                          <div className="text-green-400 font-bold">{tool.avgIncome}</div>
                          <Badge variant="secondary" className={`text-xs ${
                            tool.difficulty === '쉬움' ? 'bg-green-500/20 text-green-400' :
                            tool.difficulty === '보통' ? 'bg-yellow-500/20 text-yellow-400' :
                            'bg-red-500/20 text-red-400'
                          }`}>
                            {tool.difficulty}
                          </Badge>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 수익화 성공 사례 */}
      <section className="py-16 relative">
        <div className="absolute inset-0 bg-gradient-to-b from-green-900/10 to-transparent" />
        <div className="container mx-auto px-4 relative z-10">
          <div className="text-center mb-10">
            <Badge className="mb-3 bg-green-500/20 text-green-400 border-green-500/30">
              <Wallet className="mr-1 h-3 w-3" /> 실제 수익 사례
            </Badge>
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-3">
              이번 달 성공 사례
            </h2>
            <p className="text-slate-400">실제 사용자들의 AI 수익화 결과</p>
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {successStories.map((story, index) => (
              <Card key={index} className="bg-white/5 border-white/10 hover:bg-white/10 transition-all cursor-pointer group overflow-hidden">
                <CardContent className="p-5">
                  <div className="text-4xl mb-3">{story.avatar}</div>
                  <h3 className="font-semibold text-white mb-1">{story.title}</h3>
                  <div className="text-2xl font-bold text-green-400 mb-1">{story.income}</div>
                  <p className="text-xs text-slate-500 mb-3">{story.period} 달성</p>
                  <div className="flex flex-wrap gap-1">
                    {story.tools.map((tool) => (
                      <span key={tool} className="text-xs bg-white/10 text-slate-300 px-2 py-0.5 rounded">
                        {tool}
                      </span>
                    ))}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          <div className="text-center mt-8">
            <Link href="/guide">
              <Button className="bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 text-white">
                나도 시작하기
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* 수익 단계별 가이드 */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <div className="text-center mb-10">
            <Badge className="mb-3 bg-amber-500/20 text-amber-400 border-amber-500/30">
              <BarChart3 className="mr-1 h-3 w-3" /> 수익 단계별
            </Badge>
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-3">
              당신의 목표는?
            </h2>
          </div>

          <div className="grid md:grid-cols-3 gap-6">
            {incomeCategories.map((cat, index) => {
              const Icon = cat.icon;
              return (
                <Card key={index} className="bg-white/5 border-white/10 hover:bg-white/10 transition-all cursor-pointer group overflow-hidden relative">
                  <div className={`absolute top-0 left-0 w-full h-1 bg-gradient-to-r ${cat.gradient}`} />
                  <CardContent className="p-6">
                    <div className={`w-14 h-14 rounded-xl bg-gradient-to-br ${cat.gradient} flex items-center justify-center mb-4 group-hover:scale-110 transition-transform`}>
                      <Icon className="h-7 w-7 text-white" />
                    </div>
                    <h3 className="text-xl font-bold text-white mb-1">{cat.title}</h3>
                    <p className="text-sm text-slate-500 mb-4">{cat.desc}</p>
                    <div className="flex flex-wrap gap-2 mb-4">
                      {cat.items.map((item) => (
                        <span key={item} className="text-xs bg-white/10 text-slate-300 px-2 py-1 rounded">
                          {item}
                        </span>
                      ))}
                    </div>
                    <div className="flex items-center justify-between pt-4 border-t border-white/10">
                      <span className="text-slate-500 text-sm">예상 수익</span>
                      <span className="text-green-400 font-bold">{cat.avgIncome}</span>
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </div>
      </section>

      {/* Fortune CTA - 간소화 */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <Card className="overflow-hidden bg-gradient-to-br from-purple-900/40 via-slate-900 to-indigo-900/40 border-white/10">
            <CardContent className="p-8 md:p-12">
              <div className="flex flex-col md:flex-row items-center justify-between gap-8">
                <div className="text-center md:text-left">
                  <Badge className="mb-4 bg-purple-500/20 text-purple-400 border-purple-500/30">
                    <Sparkles className="mr-1 h-3 w-3" />
                    AI FORTUNE
                  </Badge>
                  <h2 className="text-2xl md:text-3xl font-bold text-white mb-2">
                    오늘의 AI 수익운은?
                  </h2>
                  <p className="text-slate-400">
                    AI 사주로 나에게 맞는 수익화 분야를 찾아보세요
                  </p>
                </div>
                <div className="flex gap-4">
                  <Link href="/fortune/free">
                    <Button size="lg" className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white">
                      무료 운세 보기
                      <Zap className="ml-2 h-4 w-4" />
                    </Button>
                  </Link>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* 통계 섹션 */}
      <section className="py-12 border-t border-white/10">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {[
              { icon: Eye, value: '500+', label: 'AI 툴 분석', color: 'text-purple-400' },
              { icon: Users, value: '12.8K', label: '수익 창출자', color: 'text-green-400' },
              { icon: DollarSign, value: '₩4.2억', label: '이번 달 총 수익', color: 'text-amber-400' },
              { icon: Clock, value: '3개월', label: '평균 수익 달성', color: 'text-blue-400' },
            ].map((stat) => {
              const Icon = stat.icon;
              return (
                <div key={stat.label} className="text-center">
                  <Icon className={`h-6 w-6 mx-auto mb-2 ${stat.color}`} />
                  <div className={`text-2xl md:text-3xl font-bold ${stat.color} mb-1`}>
                    {stat.value}
                  </div>
                  <div className="text-slate-500 text-xs">{stat.label}</div>
                </div>
              );
            })}
          </div>
        </div>
      </section>
    </div>
  );
}
