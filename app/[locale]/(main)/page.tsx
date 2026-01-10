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

// 4가지 수익화 카테고리 - 난이도별 현실적 수익화 방법
const monetizationCategories = [
  {
    id: 'beginner',
    title: '입문',
    subtitle: '누구나 시작 가능',
    icon: Rocket,
    gradient: 'from-emerald-500/20 to-teal-500/20',
    borderColor: 'border-emerald-500/30',
    accentColor: 'text-emerald-400',
    items: [
      { name: '블로그 글쓰기', income: '50~150만', tools: 'ChatGPT', time: '1~2주' },
      { name: '번역/교정', income: '80~200만', tools: 'DeepL + GPT', time: '즉시' },
      { name: '카피라이팅', income: '100~300만', tools: 'Jasper', time: '1주' },
      { name: 'SNS 콘텐츠', income: '50~200만', tools: 'ChatGPT + Canva', time: '즉시' },
    ],
  },
  {
    id: 'content',
    title: '콘텐츠 제작',
    subtitle: '영상/음성 기반',
    icon: Play,
    gradient: 'from-violet-500/20 to-purple-500/20',
    borderColor: 'border-violet-500/30',
    accentColor: 'text-violet-400',
    items: [
      { name: '유튜브 쇼츠', income: '200~800만', tools: 'Runway + HeyGen', time: '2~4주' },
      { name: '팟캐스트 제작', income: '100~400만', tools: 'ElevenLabs + Descript', time: '2주' },
      { name: '전자책 출판', income: '150~500만', tools: 'Claude + Canva', time: '2~4주' },
      { name: '온라인 강의', income: '300~1,500만', tools: 'Synthesia + GPT', time: '1~2개월' },
    ],
  },
  {
    id: 'design',
    title: '디자인/비주얼',
    subtitle: '이미지 기반',
    icon: Target,
    gradient: 'from-pink-500/20 to-rose-500/20',
    borderColor: 'border-pink-500/30',
    accentColor: 'text-pink-400',
    items: [
      { name: '상세페이지 제작', income: '200~600만', tools: 'Midjourney + Figma', time: '1~2주' },
      { name: '썸네일 디자인', income: '150~400만', tools: 'DALL-E + Canva', time: '즉시' },
      { name: '이모티콘 판매', income: '100~500만', tools: 'Midjourney', time: '2~4주' },
      { name: 'AI 아트 판매', income: '200~800만', tools: 'Stable Diffusion', time: '1~2주' },
    ],
  },
  {
    id: 'advanced',
    title: '고급 수익화',
    subtitle: '전문성 필요',
    icon: Crown,
    gradient: 'from-amber-500/20 to-orange-500/20',
    borderColor: 'border-amber-500/30',
    accentColor: 'text-amber-400',
    items: [
      { name: 'SaaS 개발', income: '500~3,000만', tools: 'Cursor + Claude', time: '1~3개월' },
      { name: '자동화 구축', income: '400~1,500만', tools: 'n8n + GPT API', time: '2~4주' },
      { name: 'AI 컨설팅', income: '500~2,000만', tools: '복합 AI', time: '즉시' },
      { name: '커스텀 챗봇', income: '300~1,000만', tools: 'OpenAI API', time: '2~4주' },
    ],
  },
];

// 실제 수익화 사례 - 더 상세하고 현실적인 데이터
const realCases = [
  {
    category: '쇼츠 자동화',
    income: '월 580만',
    period: '4개월',
    difficulty: '중',
    tools: ['Runway', 'ElevenLabs', 'CapCut'],
    desc: '하루 3개 쇼츠 업로드',
  },
  {
    category: '상세페이지 외주',
    income: '월 420만',
    period: '2개월',
    difficulty: '하',
    tools: ['Midjourney', 'Figma'],
    desc: '주 3~4건 제작',
  },
  {
    category: '블로그 애드센스',
    income: '월 280만',
    period: '6개월',
    difficulty: '하',
    tools: ['ChatGPT', 'Surfer SEO'],
    desc: '일 2~3개 포스팅',
  },
  {
    category: 'AI 자동화 대행',
    income: '월 1,200만',
    period: '3개월',
    difficulty: '상',
    tools: ['n8n', 'Make', 'GPT API'],
    desc: '중소기업 5곳 계약',
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
                <Button size="lg" className="bg-gradient-to-r from-slate-700 to-slate-800 hover:from-slate-600 hover:to-slate-700 text-white border border-slate-500/50 px-8 py-6 text-lg rounded-xl backdrop-blur-sm group transition-all hover:scale-105">
                  <Play className="mr-2 h-5 w-5 text-emerald-400" />
                  무료 가이드 시작
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* 4가지 수익화 카테고리 섹션 */}
      <section className="py-16 relative">
        <div className="container mx-auto px-4">
          <div className="text-center mb-10">
            <Badge className="mb-3 bg-gradient-to-r from-purple-500/20 to-pink-500/20 text-purple-400 border-purple-500/30">
              <BarChart3 className="mr-1 h-3 w-3" /> 난이도별 수익화 방법
            </Badge>
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-3">
              나에게 맞는 수익화 찾기
            </h2>
            <p className="text-slate-400">현실적인 예상 수익과 필요 기간</p>
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {monetizationCategories.map((cat) => {
              const Icon = cat.icon;
              return (
                <div
                  key={cat.id}
                  className={`rounded-2xl bg-gradient-to-br ${cat.gradient} ${cat.borderColor} border backdrop-blur-sm overflow-hidden hover:scale-[1.02] transition-all cursor-pointer group`}
                >
                  {/* 카테고리 헤더 */}
                  <div className="p-4 border-b border-white/5">
                    <div className="flex items-center gap-3 mb-2">
                      <div className={`w-8 h-8 rounded-lg bg-slate-900/50 flex items-center justify-center`}>
                        <Icon className={`h-4 w-4 ${cat.accentColor}`} />
                      </div>
                      <div>
                        <h3 className="font-bold text-white text-sm">{cat.title}</h3>
                        <p className="text-xs text-slate-400">{cat.subtitle}</p>
                      </div>
                    </div>
                  </div>

                  {/* 아이템 리스트 */}
                  <div className="p-3 space-y-2">
                    {cat.items.map((item, idx) => (
                      <div
                        key={idx}
                        className="p-2.5 rounded-lg bg-slate-900/40 hover:bg-slate-900/60 transition-colors"
                      >
                        <div className="flex items-center justify-between mb-1">
                          <span className="text-white text-sm font-medium">{item.name}</span>
                          <span className={`text-xs font-bold ${cat.accentColor}`}>₩{item.income}</span>
                        </div>
                        <div className="flex items-center justify-between text-xs text-slate-500">
                          <span>{item.tools}</span>
                          <span className="flex items-center gap-1">
                            <Clock className="h-3 w-3" />
                            {item.time}
                          </span>
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

      {/* 실제 수익화 사례 */}
      <section className="py-16 relative">
        <div className="absolute inset-0 bg-gradient-to-b from-green-900/10 to-transparent" />
        <div className="container mx-auto px-4 relative z-10">
          <div className="text-center mb-10">
            <Badge className="mb-3 bg-green-500/20 text-green-400 border-green-500/30">
              <Wallet className="mr-1 h-3 w-3" /> 검증된 수익 사례
            </Badge>
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-3">
              실제 수익화 후기
            </h2>
            <p className="text-slate-400">현실적인 수익과 소요 기간</p>
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {realCases.map((item, index) => (
              <div
                key={index}
                className="rounded-2xl bg-gradient-to-br from-slate-800/50 to-slate-900/50 border border-slate-700/50 p-5 hover:border-green-500/30 transition-all cursor-pointer group"
              >
                {/* 상단: 수익 & 난이도 */}
                <div className="flex items-start justify-between mb-3">
                  <div>
                    <div className="text-2xl font-bold text-green-400">{item.income}</div>
                    <p className="text-xs text-slate-500">{item.period} 소요</p>
                  </div>
                  <Badge className={`text-xs ${
                    item.difficulty === '하' ? 'bg-emerald-500/20 text-emerald-400 border-emerald-500/30' :
                    item.difficulty === '중' ? 'bg-amber-500/20 text-amber-400 border-amber-500/30' :
                    'bg-rose-500/20 text-rose-400 border-rose-500/30'
                  }`}>
                    난이도 {item.difficulty}
                  </Badge>
                </div>

                {/* 카테고리 & 설명 */}
                <h3 className="font-semibold text-white mb-1">{item.category}</h3>
                <p className="text-xs text-slate-400 mb-4">{item.desc}</p>

                {/* 사용 툴 */}
                <div className="flex flex-wrap gap-1.5">
                  {item.tools.map((tool) => (
                    <span
                      key={tool}
                      className="text-xs bg-slate-700/50 text-slate-300 px-2 py-1 rounded-md"
                    >
                      {tool}
                    </span>
                  ))}
                </div>
              </div>
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
