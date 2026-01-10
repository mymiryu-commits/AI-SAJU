import { Suspense } from 'react';
import { setRequestLocale } from 'next-intl/server';
import { Link } from '@/i18n/routing';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import {
  Star,
  ExternalLink,
  TrendingUp,
  Zap,
  Play,
  ShoppingCart,
  Briefcase,
  Palette,
  MessageCircle,
  Bot,
  Crown,
  Clock,
  DollarSign,
  Sparkles,
  ArrowRight,
  CheckCircle2,
  ArrowUpRight,
} from 'lucide-react';

// AI 툴 데이터
const aiTools = [
  {
    id: '1',
    name: 'ChatGPT',
    category: 'chat',
    description: 'OpenAI의 대화형 AI. GPT-4o 기반으로 자연스러운 대화와 다양한 작업 수행.',
    website: 'https://chat.openai.com',
    price: '무료~$20/월',
    totalScore: 95,
    trend: 'up',
    useCases: ['블로그', '번역', '코딩'],
    monthlyIncome: '100~500만',
    gradient: 'from-emerald-500 to-teal-600',
  },
  {
    id: '2',
    name: 'Claude',
    category: 'chat',
    description: 'Anthropic의 AI. 긴 문맥 처리와 분석적 사고, 코딩에 강점.',
    website: 'https://claude.ai',
    price: '무료~$20/월',
    totalScore: 94,
    trend: 'up',
    useCases: ['코딩', '분석', '문서'],
    monthlyIncome: '200~800만',
    gradient: 'from-orange-500 to-amber-600',
  },
  {
    id: '3',
    name: 'Midjourney',
    category: 'image',
    description: '최고 품질 AI 이미지 생성. 예술적이고 창의적인 이미지에 특화.',
    website: 'https://midjourney.com',
    price: '$10~$60/월',
    totalScore: 98,
    trend: 'stable',
    useCases: ['썸네일', '상세페이지', 'NFT'],
    monthlyIncome: '200~1,000만',
    gradient: 'from-violet-500 to-purple-600',
  },
  {
    id: '4',
    name: 'Runway',
    category: 'video',
    description: '영상 생성 및 편집 AI. Gen-3로 고품질 AI 영상 제작.',
    website: 'https://runway.ml',
    price: '무료~$35/월',
    totalScore: 92,
    trend: 'up',
    useCases: ['쇼츠', '릴스', '광고'],
    monthlyIncome: '300~1,500만',
    gradient: 'from-pink-500 to-rose-600',
  },
  {
    id: '5',
    name: 'ElevenLabs',
    category: 'voice',
    description: '고품질 AI 음성 합성. 자연스러운 음성 생성과 복제.',
    website: 'https://elevenlabs.io',
    price: '무료~$22/월',
    totalScore: 95,
    trend: 'up',
    useCases: ['나레이션', '더빙', '팟캐스트'],
    monthlyIncome: '150~600만',
    gradient: 'from-purple-500 to-indigo-600',
  },
  {
    id: '6',
    name: 'Cursor',
    category: 'code',
    description: 'AI 기반 코드 에디터. Claude/GPT 연동으로 빠른 개발.',
    website: 'https://cursor.sh',
    price: '무료~$20/월',
    totalScore: 93,
    trend: 'up',
    useCases: ['웹개발', 'SaaS', '자동화'],
    monthlyIncome: '500~3,000만',
    gradient: 'from-cyan-500 to-blue-600',
  },
  {
    id: '7',
    name: 'Canva AI',
    category: 'design',
    description: '디자인 올인원 툴. AI로 빠른 디자인 제작.',
    website: 'https://canva.com',
    price: '무료~$15/월',
    totalScore: 90,
    trend: 'stable',
    useCases: ['썸네일', 'SNS', '로고'],
    monthlyIncome: '100~400만',
    gradient: 'from-teal-500 to-emerald-600',
  },
  {
    id: '8',
    name: 'HeyGen',
    category: 'video',
    description: 'AI 아바타 영상 생성. 얼굴 없이 전문적인 영상 제작.',
    website: 'https://heygen.com',
    price: '$24~$180/월',
    totalScore: 88,
    trend: 'up',
    useCases: ['쇼츠', '강의', '광고'],
    monthlyIncome: '200~800만',
    gradient: 'from-amber-500 to-yellow-600',
  },
];

// 수익화 조합 데이터
const monetizationCombos = [
  {
    id: 'shorts',
    category: '쇼츠 제작',
    icon: Play,
    difficulty: '중',
    avgIncome: '200~800만',
    period: '2~4주',
    gradient: 'from-rose-500 to-pink-600',
    combos: [
      { name: '얼굴 없는 쇼츠', tools: ['ChatGPT', 'Runway', 'ElevenLabs'], income: '300~600만' },
      { name: 'AI 아바타 쇼츠', tools: ['ChatGPT', 'HeyGen', 'Canva'], income: '400~800만' },
      { name: '정보성 쇼츠', tools: ['Claude', 'Midjourney', 'Runway'], income: '200~500만' },
    ],
  },
  {
    id: 'threads',
    category: '쓰레드/SNS',
    icon: MessageCircle,
    difficulty: '하',
    avgIncome: '100~400만',
    period: '즉시',
    gradient: 'from-sky-500 to-blue-600',
    combos: [
      { name: '쓰레드 자동화', tools: ['ChatGPT', 'Canva AI'], income: '100~300만' },
      { name: '인스타 릴스', tools: ['ChatGPT', 'Runway'], income: '150~400만' },
      { name: '트위터 성장', tools: ['Claude', 'Midjourney'], income: '100~250만' },
    ],
  },
  {
    id: 'coupang',
    category: '쿠팡파트너스',
    icon: ShoppingCart,
    difficulty: '하',
    avgIncome: '50~300만',
    period: '1~2주',
    gradient: 'from-orange-500 to-amber-600',
    combos: [
      { name: '리뷰 블로그', tools: ['ChatGPT', 'Surfer SEO'], income: '100~300만' },
      { name: '비교 콘텐츠', tools: ['Claude', 'Canva AI'], income: '80~200만' },
      { name: '쇼츠 리뷰', tools: ['ChatGPT', 'Runway'], income: '150~400만' },
    ],
  },
  {
    id: 'automation',
    category: '업무 자동화',
    icon: Bot,
    difficulty: '중',
    avgIncome: '300~1,500만',
    period: '2~4주',
    gradient: 'from-emerald-500 to-teal-600',
    combos: [
      { name: 'n8n 자동화 대행', tools: ['n8n', 'ChatGPT API'], income: '400~1,200만' },
      { name: '챗봇 구축', tools: ['OpenAI API', 'Voiceflow'], income: '300~800만' },
      { name: '데이터 분석', tools: ['Claude', 'Python'], income: '500~1,500만' },
    ],
  },
  {
    id: 'design',
    category: '디자인/비주얼',
    icon: Palette,
    difficulty: '중',
    avgIncome: '200~800만',
    period: '1~2주',
    gradient: 'from-fuchsia-500 to-purple-600',
    combos: [
      { name: '상세페이지 제작', tools: ['Midjourney', 'Figma'], income: '300~600만' },
      { name: '썸네일 대행', tools: ['DALL-E', 'Canva'], income: '150~400만' },
      { name: '이모티콘 판매', tools: ['Midjourney'], income: '100~500만' },
    ],
  },
  {
    id: 'advanced',
    category: '고급 수익화',
    icon: Crown,
    difficulty: '상',
    avgIncome: '500~3,000만',
    period: '1~3개월',
    gradient: 'from-amber-500 to-orange-600',
    combos: [
      { name: 'SaaS 개발', tools: ['Cursor', 'Claude', 'Vercel'], income: '1,000~5,000만' },
      { name: 'AI 컨설팅', tools: ['복합 AI 툴'], income: '500~2,000만' },
      { name: '온라인 강의', tools: ['Claude', 'Synthesia'], income: '300~1,500만' },
    ],
  },
];

const categories = [
  { key: 'all', label: '전체', icon: Zap },
  { key: 'shorts', label: '쇼츠', icon: Play },
  { key: 'threads', label: 'SNS', icon: MessageCircle },
  { key: 'coupang', label: '쿠팡', icon: ShoppingCart },
  { key: 'automation', label: '자동화', icon: Bot },
  { key: 'design', label: '디자인', icon: Palette },
  { key: 'advanced', label: '고급', icon: Crown },
];

export default async function RankingPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);

  return (
    <div className="min-h-screen luxury-gradient">
      {/* Background Effects */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-20 left-10 w-[500px] h-[500px] bg-violet-600/10 rounded-full blur-[150px]" />
        <div className="absolute bottom-20 right-10 w-[600px] h-[600px] bg-emerald-600/10 rounded-full blur-[150px]" />
        <div className="absolute inset-0 bg-grid-pattern opacity-20" />
      </div>

      <div className="container mx-auto px-4 py-12 relative z-10">
        {/* Header */}
        <header className="text-center mb-16 animate-fade-in-up">
          <div className="inline-flex items-center gap-2 glass rounded-full px-5 py-2.5 mb-6">
            <Sparkles className="h-4 w-4 text-violet-400" />
            <span className="text-slate-300 text-sm font-medium">AI 수익화 가이드</span>
          </div>
          <h1 className="text-headline font-bold text-white mb-4">
            AI 툴 & 수익화 조합 순위
          </h1>
          <p className="text-slate-400 text-lg max-w-2xl mx-auto">
            검증된 AI 툴과 수익화 조합을 확인하세요
          </p>
        </header>

        <Suspense fallback={
          <div className="text-center py-20">
            <div className="w-8 h-8 border-2 border-violet-500 border-t-transparent rounded-full animate-spin mx-auto mb-4" />
            <p className="text-slate-400">로딩 중...</p>
          </div>
        }>
          <RankingContent />
        </Suspense>
      </div>
    </div>
  );
}

function RankingContent() {
  return (
    <div className="space-y-20">
      {/* AI 툴 순위 섹션 */}
      <section className="animate-fade-in-up animation-delay-150">
        <div className="flex items-center gap-4 mb-8">
          <div className="w-12 h-12 rounded-2xl glass-card flex items-center justify-center">
            <Star className="h-6 w-6 text-amber-400" />
          </div>
          <div>
            <h2 className="text-2xl font-bold text-white">AI 툴 TOP 8</h2>
            <p className="text-slate-400 text-sm">성능 & 수익화 기준 순위</p>
          </div>
        </div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-5">
          {aiTools.map((tool, index) => (
            <ToolCard key={tool.id} tool={tool} rank={index + 1} />
          ))}
        </div>
      </section>

      {/* 수익화 조합 섹션 */}
      <section className="animate-fade-in-up animation-delay-300">
        <div className="flex items-center gap-4 mb-8">
          <div className="w-12 h-12 rounded-2xl glass-card flex items-center justify-center">
            <DollarSign className="h-6 w-6 text-emerald-400" />
          </div>
          <div>
            <h2 className="text-2xl font-bold text-white">수익화 AI 조합</h2>
            <p className="text-slate-400 text-sm">난이도별 분류</p>
          </div>
        </div>

        <Tabs defaultValue="all" className="space-y-8">
          <TabsList className="glass p-2 flex-wrap h-auto gap-2 rounded-2xl border-white/10">
            {categories.map((cat) => {
              const Icon = cat.icon;
              return (
                <TabsTrigger
                  key={cat.key}
                  value={cat.key}
                  className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-violet-500 data-[state=active]:to-purple-600 data-[state=active]:text-white data-[state=active]:shadow-lg text-slate-400 gap-2 px-5 py-2.5 rounded-xl transition-all hover:text-white"
                >
                  <Icon className="h-4 w-4" />
                  <span className="hidden sm:inline">{cat.label}</span>
                </TabsTrigger>
              );
            })}
          </TabsList>

          <TabsContent value="all" className="space-y-6">
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-5">
              {monetizationCombos.map((combo, index) => (
                <ComboCard key={combo.id} combo={combo} index={index} />
              ))}
            </div>
          </TabsContent>

          {monetizationCombos.map((combo) => (
            <TabsContent key={combo.id} value={combo.id}>
              <ComboCard combo={combo} expanded />
            </TabsContent>
          ))}
        </Tabs>
      </section>

      {/* CTA */}
      <section className="animate-fade-in-up animation-delay-500">
        <div className="glass-premium rounded-[2rem] p-10 md:p-14 text-center relative overflow-hidden">
          <div className="absolute top-0 right-0 w-80 h-80 bg-violet-500/10 rounded-full blur-[100px]" />
          <div className="absolute bottom-0 left-0 w-60 h-60 bg-emerald-500/10 rounded-full blur-[100px]" />

          <div className="relative z-10">
            <h3 className="text-2xl md:text-3xl font-bold text-white mb-4">
              어떤 방법이 나에게 맞을까?
            </h3>
            <p className="text-slate-400 mb-8 max-w-lg mx-auto">
              AI 사주 분석으로 나에게 맞는 수익화 방법을 찾아보세요
            </p>
            <Link href="/fortune/saju">
              <Button
                size="lg"
                className="btn-premium bg-gradient-to-r from-violet-500 to-purple-600 hover:from-violet-600 hover:to-purple-700 text-white px-8 py-6 text-lg rounded-2xl shadow-2xl shadow-violet-500/30"
              >
                <Sparkles className="mr-2 h-5 w-5" />
                무료 AI 사주 보기
                <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}

function ToolCard({ tool, rank }: { tool: (typeof aiTools)[0]; rank: number }) {
  return (
    <div className="card-premium glass-card rounded-2xl overflow-hidden group">
      {/* Header with gradient */}
      <div className={`bg-gradient-to-r ${tool.gradient} p-5`}>
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-white/20 rounded-xl flex items-center justify-center text-white font-bold backdrop-blur-sm">
              #{rank}
            </div>
            <div>
              <h3 className="font-bold text-white">{tool.name}</h3>
              <p className="text-white/70 text-xs">{tool.price}</p>
            </div>
          </div>
          <div className="flex items-center gap-1 bg-white/20 px-2.5 py-1 rounded-full backdrop-blur-sm">
            <Star className="h-3.5 w-3.5 text-white fill-white" />
            <span className="text-white text-sm font-semibold">{tool.totalScore}</span>
          </div>
        </div>
        {tool.trend === 'up' && (
          <div className="flex items-center gap-1 text-white/80 text-xs">
            <TrendingUp className="h-3 w-3" />
            <span>상승 중</span>
          </div>
        )}
      </div>

      {/* Content */}
      <div className="p-5">
        <p className="text-slate-400 text-sm mb-4 line-clamp-2">{tool.description}</p>

        {/* Use Cases */}
        <div className="flex flex-wrap gap-2 mb-4">
          {tool.useCases.map((useCase) => (
            <span key={useCase} className="text-xs text-slate-300 bg-white/5 px-3 py-1.5 rounded-lg">
              {useCase}
            </span>
          ))}
        </div>

        {/* Income */}
        <div className="flex items-center justify-between pt-4 border-t border-white/10">
          <span className="text-slate-500 text-xs">예상 수익</span>
          <span className="font-bold text-emerald-400">₩{tool.monthlyIncome}/월</span>
        </div>

        {/* Visit Button */}
        <a
          href={tool.website}
          target="_blank"
          rel="noopener noreferrer"
          className="mt-4 w-full flex items-center justify-center gap-2 text-sm text-white bg-white/5 hover:bg-white/10 transition-colors py-3 rounded-xl font-medium group/btn"
        >
          사이트 방문
          <ExternalLink className="h-4 w-4 group-hover/btn:translate-x-0.5 group-hover/btn:-translate-y-0.5 transition-transform" />
        </a>
      </div>
    </div>
  );
}

function ComboCard({
  combo,
  expanded = false,
  index = 0,
}: {
  combo: (typeof monetizationCombos)[0];
  expanded?: boolean;
  index?: number;
}) {
  const Icon = combo.icon;

  const difficultyColors = {
    '하': 'bg-emerald-500/20 text-emerald-400 border-emerald-500/30',
    '중': 'bg-amber-500/20 text-amber-400 border-amber-500/30',
    '상': 'bg-rose-500/20 text-rose-400 border-rose-500/30',
  };

  return (
    <div
      className="card-premium glass-card rounded-2xl overflow-hidden animate-fade-in-up"
      style={{ animationDelay: `${index * 50}ms` }}
    >
      {/* Header */}
      <div className={`bg-gradient-to-r ${combo.gradient} p-5`}>
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-white/20 rounded-xl flex items-center justify-center backdrop-blur-sm">
              <Icon className="h-5 w-5 text-white" />
            </div>
            <div>
              <h3 className="font-bold text-white">{combo.category}</h3>
              <div className="flex items-center gap-1 text-white/70 text-xs">
                <Clock className="h-3 w-3" />
                {combo.period}
              </div>
            </div>
          </div>
          <Badge className={`text-xs border ${difficultyColors[combo.difficulty as keyof typeof difficultyColors]}`}>
            난이도 {combo.difficulty}
          </Badge>
        </div>
        <div className="flex items-center justify-between">
          <span className="text-white/70 text-xs">평균 수익</span>
          <span className="font-bold text-white">₩{combo.avgIncome}/월</span>
        </div>
      </div>

      {/* Combos List */}
      <div className="p-4 space-y-3">
        {combo.combos.map((item, idx) => (
          <div
            key={idx}
            className="p-4 rounded-xl bg-white/5 hover:bg-white/10 transition-colors cursor-pointer group/item"
          >
            <div className="flex items-center justify-between mb-2">
              <span className="text-white font-medium text-sm group-hover/item:text-emerald-400 transition-colors">
                {item.name}
              </span>
              <span className="text-xs font-bold text-emerald-400">₩{item.income}</span>
            </div>
            <div className="flex flex-wrap gap-1.5">
              {item.tools.map((tool) => (
                <span key={tool} className="text-xs text-slate-400 bg-white/5 px-2 py-1 rounded-md">
                  {tool}
                </span>
              ))}
            </div>
          </div>
        ))}
      </div>

      {expanded && (
        <div className="px-5 py-4 border-t border-white/10">
          <div className="flex items-center gap-2 text-sm text-slate-300">
            <CheckCircle2 className="h-4 w-4 text-emerald-400" />
            <span>총 {combo.combos.length}가지 수익화 방법</span>
          </div>
        </div>
      )}
    </div>
  );
}
