import { Suspense } from 'react';
import { useTranslations } from 'next-intl';
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
  Users,
  Sparkles,
  ArrowRight,
  CheckCircle2,
  Flame,
} from 'lucide-react';

// AI 툴 데이터 - 파스텔 톤 디자인
const aiTools = [
  {
    id: '1',
    slug: 'chatgpt',
    name: 'ChatGPT',
    category: 'chat',
    description: 'OpenAI의 대화형 AI. GPT-4o 기반으로 자연스러운 대화와 다양한 작업 수행이 가능합니다.',
    website: 'https://chat.openai.com',
    pricingType: 'freemium',
    price: '무료~$20/월',
    totalScore: 95,
    reviewCount: 1250,
    isFeatured: true,
    trend: 'up',
    useCases: ['블로그 글쓰기', '번역', '코딩', '분석'],
    monthlyIncome: '100~500만',
    borderColor: 'border-emerald-300/40',
    iconBg: 'bg-gradient-to-br from-emerald-400 to-teal-500',
    accentColor: 'text-emerald-400',
  },
  {
    id: '2',
    slug: 'claude',
    name: 'Claude',
    category: 'chat',
    description: 'Anthropic의 AI 어시스턴트. 긴 문맥 처리와 분석적 사고, 코딩에 강점이 있습니다.',
    website: 'https://claude.ai',
    pricingType: 'freemium',
    price: '무료~$20/월',
    totalScore: 94,
    reviewCount: 890,
    isFeatured: true,
    trend: 'up',
    useCases: ['코딩', '분석', '문서 작성', '리서치'],
    monthlyIncome: '200~800만',
    borderColor: 'border-orange-300/40',
    iconBg: 'bg-gradient-to-br from-orange-400 to-amber-500',
    accentColor: 'text-orange-400',
  },
  {
    id: '3',
    slug: 'midjourney',
    name: 'Midjourney',
    category: 'image',
    description: '최고 품질의 AI 이미지 생성. 예술적이고 창의적인 이미지 제작에 특화되어 있습니다.',
    website: 'https://midjourney.com',
    pricingType: 'paid',
    price: '$10~$60/월',
    totalScore: 98,
    reviewCount: 2100,
    isFeatured: true,
    trend: 'stable',
    useCases: ['썸네일', '상세페이지', '이모티콘', 'NFT'],
    monthlyIncome: '200~1,000만',
    borderColor: 'border-violet-300/40',
    iconBg: 'bg-gradient-to-br from-violet-400 to-purple-500',
    accentColor: 'text-violet-400',
  },
  {
    id: '4',
    slug: 'runway',
    name: 'Runway',
    category: 'video',
    description: '영상 생성 및 편집 AI. Gen-3로 고품질 AI 영상을 만들 수 있습니다.',
    website: 'https://runway.ml',
    pricingType: 'freemium',
    price: '무료~$35/월',
    totalScore: 92,
    reviewCount: 650,
    isFeatured: true,
    trend: 'up',
    useCases: ['쇼츠', '릴스', '광고', 'MV'],
    monthlyIncome: '300~1,500만',
    borderColor: 'border-pink-300/40',
    iconBg: 'bg-gradient-to-br from-pink-400 to-rose-500',
    accentColor: 'text-pink-400',
  },
  {
    id: '5',
    slug: 'elevenlabs',
    name: 'ElevenLabs',
    category: 'voice',
    description: '고품질 AI 음성 합성. 자연스러운 음성 생성과 음성 복제가 가능합니다.',
    website: 'https://elevenlabs.io',
    pricingType: 'freemium',
    price: '무료~$22/월',
    totalScore: 95,
    reviewCount: 720,
    isFeatured: true,
    trend: 'up',
    useCases: ['나레이션', '더빙', '팟캐스트', '오디오북'],
    monthlyIncome: '150~600만',
    borderColor: 'border-purple-300/40',
    iconBg: 'bg-gradient-to-br from-purple-400 to-indigo-500',
    accentColor: 'text-purple-400',
  },
  {
    id: '6',
    slug: 'cursor',
    name: 'Cursor',
    category: 'code',
    description: 'AI 기반 코드 에디터. Claude/GPT와 연동하여 빠른 개발이 가능합니다.',
    website: 'https://cursor.sh',
    pricingType: 'freemium',
    price: '무료~$20/월',
    totalScore: 93,
    reviewCount: 560,
    isFeatured: true,
    trend: 'up',
    useCases: ['웹개발', 'SaaS', '자동화', '앱개발'],
    monthlyIncome: '500~3,000만',
    borderColor: 'border-cyan-300/40',
    iconBg: 'bg-gradient-to-br from-cyan-400 to-blue-500',
    accentColor: 'text-cyan-400',
  },
  {
    id: '7',
    slug: 'canva',
    name: 'Canva AI',
    category: 'design',
    description: '디자인 올인원 툴. AI 기능으로 빠른 디자인 제작이 가능합니다.',
    website: 'https://canva.com',
    pricingType: 'freemium',
    price: '무료~$15/월',
    totalScore: 90,
    reviewCount: 1800,
    isFeatured: false,
    trend: 'stable',
    useCases: ['썸네일', 'SNS', '프레젠테이션', '로고'],
    monthlyIncome: '100~400만',
    borderColor: 'border-teal-300/40',
    iconBg: 'bg-gradient-to-br from-teal-400 to-emerald-500',
    accentColor: 'text-teal-400',
  },
  {
    id: '8',
    slug: 'heygen',
    name: 'HeyGen',
    category: 'video',
    description: 'AI 아바타 영상 생성. 얼굴 없이 전문적인 영상 제작이 가능합니다.',
    website: 'https://heygen.com',
    pricingType: 'paid',
    price: '$24~$180/월',
    totalScore: 88,
    reviewCount: 420,
    isFeatured: false,
    trend: 'up',
    useCases: ['쇼츠', '강의', '광고', '소개영상'],
    monthlyIncome: '200~800만',
    borderColor: 'border-amber-300/40',
    iconBg: 'bg-gradient-to-br from-amber-400 to-yellow-500',
    accentColor: 'text-amber-400',
  },
];

// 수익화 AI 조합 - 파스텔 톤 디자인
const monetizationCombos = [
  {
    id: 'shorts',
    category: '쇼츠 제작',
    icon: Play,
    difficulty: '중',
    avgIncome: '200~800만',
    period: '2~4주',
    borderColor: 'border-rose-300/50',
    accentColor: 'text-rose-400',
    combos: [
      {
        name: '얼굴 없는 쇼츠',
        tools: ['ChatGPT', 'Runway', 'ElevenLabs', 'CapCut'],
        income: '300~600만',
        desc: '스크립트→영상→음성→편집',
      },
      {
        name: 'AI 아바타 쇼츠',
        tools: ['ChatGPT', 'HeyGen', 'Canva'],
        income: '400~800만',
        desc: '가상 인물로 콘텐츠 제작',
      },
      {
        name: '정보성 쇼츠',
        tools: ['Claude', 'Midjourney', 'Runway'],
        income: '200~500만',
        desc: '지식 콘텐츠 자동화',
      },
    ],
  },
  {
    id: 'threads',
    category: '쓰레드/SNS',
    icon: MessageCircle,
    difficulty: '하',
    avgIncome: '100~400만',
    period: '즉시',
    borderColor: 'border-sky-300/50',
    accentColor: 'text-sky-400',
    combos: [
      {
        name: '쓰레드 자동화',
        tools: ['ChatGPT', 'Canva AI'],
        income: '100~300만',
        desc: '글+이미지 자동 생성',
      },
      {
        name: '인스타 릴스',
        tools: ['ChatGPT', 'Runway', 'CapCut'],
        income: '150~400만',
        desc: '트렌드 콘텐츠 양산',
      },
      {
        name: '트위터 성장',
        tools: ['Claude', 'Midjourney'],
        income: '100~250만',
        desc: '바이럴 콘텐츠 제작',
      },
    ],
  },
  {
    id: 'coupang',
    category: '쿠팡파트너스',
    icon: ShoppingCart,
    difficulty: '하',
    avgIncome: '50~300만',
    period: '1~2주',
    borderColor: 'border-orange-300/50',
    accentColor: 'text-orange-400',
    combos: [
      {
        name: '리뷰 블로그',
        tools: ['ChatGPT', 'Surfer SEO'],
        income: '100~300만',
        desc: '제품 리뷰 포스팅',
      },
      {
        name: '비교 콘텐츠',
        tools: ['Claude', 'Canva AI'],
        income: '80~200만',
        desc: '제품 비교 글 자동화',
      },
      {
        name: '쇼츠 리뷰',
        tools: ['ChatGPT', 'Runway', 'CapCut'],
        income: '150~400만',
        desc: '제품 쇼츠 제작',
      },
    ],
  },
  {
    id: 'automation',
    category: '업무 자동화',
    icon: Bot,
    difficulty: '중',
    avgIncome: '300~1,500만',
    period: '2~4주',
    borderColor: 'border-emerald-300/50',
    accentColor: 'text-emerald-400',
    combos: [
      {
        name: 'n8n 자동화 대행',
        tools: ['n8n', 'ChatGPT API', 'Make'],
        income: '400~1,200만',
        desc: '기업 워크플로우 구축',
      },
      {
        name: '챗봇 구축',
        tools: ['OpenAI API', 'Voiceflow'],
        income: '300~800만',
        desc: '고객 응대 챗봇',
      },
      {
        name: '데이터 분석 대행',
        tools: ['Claude', 'Python', 'Tableau'],
        income: '500~1,500만',
        desc: '리포트 자동화',
      },
    ],
  },
  {
    id: 'design',
    category: '디자인/비주얼',
    icon: Palette,
    difficulty: '중',
    avgIncome: '200~800만',
    period: '1~2주',
    borderColor: 'border-fuchsia-300/50',
    accentColor: 'text-fuchsia-400',
    combos: [
      {
        name: '상세페이지 제작',
        tools: ['Midjourney', 'Figma', 'Canva'],
        income: '300~600만',
        desc: '쇼핑몰 상세페이지',
      },
      {
        name: '썸네일 대행',
        tools: ['DALL-E', 'Canva AI', 'Photoshop'],
        income: '150~400만',
        desc: '유튜브/블로그 썸네일',
      },
      {
        name: '이모티콘 판매',
        tools: ['Midjourney', 'Procreate'],
        income: '100~500만',
        desc: '카카오/라인 이모티콘',
      },
    ],
  },
  {
    id: 'advanced',
    category: '고급 수익화',
    icon: Crown,
    difficulty: '상',
    avgIncome: '500~3,000만',
    period: '1~3개월',
    borderColor: 'border-amber-300/50',
    accentColor: 'text-amber-400',
    combos: [
      {
        name: 'SaaS 개발',
        tools: ['Cursor', 'Claude', 'Vercel'],
        income: '1,000~5,000만',
        desc: 'AI 기반 서비스 개발',
      },
      {
        name: 'AI 컨설팅',
        tools: ['복합 AI 툴'],
        income: '500~2,000만',
        desc: '기업 AI 도입 컨설팅',
      },
      {
        name: '온라인 강의',
        tools: ['Claude', 'Synthesia', 'Teachable'],
        income: '300~1,500만',
        desc: 'AI 활용법 강의',
      },
    ],
  },
];

const categories = [
  { key: 'all', label: '전체', icon: Zap },
  { key: 'shorts', label: '쇼츠 제작', icon: Play },
  { key: 'threads', label: '쓰레드/SNS', icon: MessageCircle },
  { key: 'coupang', label: '쿠팡파트너스', icon: ShoppingCart },
  { key: 'automation', label: '업무 자동화', icon: Bot },
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
    <div className="min-h-screen bg-gradient-to-b from-slate-50 via-white to-slate-100">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-10">
          <RankingHeader />
        </div>

        {/* Content */}
        <Suspense fallback={<div className="text-slate-400">Loading...</div>}>
          <RankingContent locale={locale} />
        </Suspense>
      </div>
    </div>
  );
}

function RankingHeader() {
  return (
    <div className="text-center">
      <Badge className="mb-4 bg-gradient-to-r from-violet-100 to-purple-100 text-violet-600 border-violet-200">
        <Sparkles className="mr-1 h-3 w-3" /> AI 수익화 가이드
      </Badge>
      <h1 className="text-3xl md:text-5xl font-bold bg-gradient-to-r from-slate-800 via-violet-700 to-purple-700 bg-clip-text text-transparent mb-3">
        AI 툴 & 수익화 조합 순위
      </h1>
      <p className="text-slate-500 max-w-2xl mx-auto">
        검증된 AI 툴과 수익화 조합을 확인하세요. 난이도별로 나에게 맞는 방법을 찾아보세요.
      </p>
    </div>
  );
}

function RankingContent({ locale }: { locale: string }) {
  return (
    <div className="space-y-12">
      {/* AI 툴 순위 섹션 */}
      <section>
        <div className="flex items-center gap-3 mb-6">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-violet-500 to-purple-600 flex items-center justify-center shadow-lg shadow-violet-200">
            <Star className="h-5 w-5 text-white" />
          </div>
          <div>
            <h2 className="text-xl font-bold text-slate-800">AI 툴 순위 TOP 8</h2>
            <p className="text-sm text-slate-500">성능 & 수익화 기준</p>
          </div>
        </div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {aiTools.map((tool, index) => (
            <ToolCard key={tool.id} tool={tool} rank={index + 1} />
          ))}
        </div>
      </section>

      {/* 수익화 조합 섹션 */}
      <section>
        <div className="flex items-center gap-3 mb-6">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-emerald-500 to-teal-600 flex items-center justify-center shadow-lg shadow-emerald-200">
            <DollarSign className="h-5 w-5 text-white" />
          </div>
          <div>
            <h2 className="text-xl font-bold text-slate-800">수익화 AI 조합</h2>
            <p className="text-sm text-slate-500">난이도별 분류</p>
          </div>
        </div>

        <Tabs defaultValue="all" className="space-y-6">
          <TabsList className="bg-white border border-slate-200 p-1.5 flex-wrap h-auto gap-1 shadow-sm rounded-xl">
            {categories.map((cat) => {
              const Icon = cat.icon;
              return (
                <TabsTrigger
                  key={cat.key}
                  value={cat.key}
                  className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-violet-500 data-[state=active]:to-purple-600 data-[state=active]:text-white data-[state=active]:shadow-md text-slate-600 gap-2 px-4 py-2 rounded-lg transition-all"
                >
                  <Icon className="h-4 w-4" />
                  <span className="hidden sm:inline">{cat.label}</span>
                </TabsTrigger>
              );
            })}
          </TabsList>

          <TabsContent value="all" className="space-y-6">
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
              {monetizationCombos.map((combo) => (
                <ComboCard key={combo.id} combo={combo} />
              ))}
            </div>
          </TabsContent>

          {monetizationCombos.map((combo) => (
            <TabsContent key={combo.id} value={combo.id} className="space-y-4">
              <ComboCard combo={combo} expanded />
            </TabsContent>
          ))}
        </Tabs>
      </section>

      {/* CTA */}
      <section className="text-center py-8">
        <div className="bg-gradient-to-r from-violet-50 to-purple-50 border border-violet-200 rounded-2xl p-8 shadow-sm">
          <h3 className="text-2xl font-bold text-slate-800 mb-3">
            어떤 방법이 나에게 맞을까?
          </h3>
          <p className="text-slate-500 mb-6">
            AI 사주로 나에게 맞는 수익화 방법을 찾아보세요
          </p>
          <Link href="/fortune/free">
            <Button className="bg-gradient-to-r from-violet-500 to-purple-600 hover:from-violet-600 hover:to-purple-700 text-white shadow-lg shadow-violet-200">
              무료 AI 사주 보기
              <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
          </Link>
        </div>
      </section>
    </div>
  );
}

function ToolCard({
  tool,
  rank,
}: {
  tool: (typeof aiTools)[0];
  rank: number;
}) {
  return (
    <div
      className="rounded-2xl bg-white border border-slate-200 p-4 hover:shadow-lg hover:shadow-slate-200/50 hover:border-slate-300 hover:-translate-y-1 transition-all cursor-pointer group"
    >
      {/* Header */}
      <div className="flex items-start justify-between mb-3">
        <div className="flex items-center gap-3">
          <div className={`w-10 h-10 rounded-xl ${tool.iconBg} flex items-center justify-center text-white font-bold text-sm shadow-md`}>
            #{rank}
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h3 className="font-semibold text-slate-800">{tool.name}</h3>
              {tool.trend === 'up' && (
                <TrendingUp className="h-3.5 w-3.5 text-emerald-500" />
              )}
            </div>
            <p className="text-xs text-slate-400">{tool.price}</p>
          </div>
        </div>
        <div className="flex items-center gap-1 bg-amber-50 px-2.5 py-1 rounded-full border border-amber-200">
          <Star className="h-3.5 w-3.5 text-amber-500 fill-amber-500" />
          <span className="text-amber-700 text-sm font-semibold">{tool.totalScore}</span>
        </div>
      </div>

      {/* Description */}
      <p className="text-xs text-slate-500 mb-3 line-clamp-2 leading-relaxed">{tool.description}</p>

      {/* Use Cases */}
      <div className="flex flex-wrap gap-1.5 mb-3">
        {tool.useCases.slice(0, 3).map((useCase) => (
          <span key={useCase} className="text-xs text-slate-600 bg-slate-100 px-2.5 py-1 rounded-full">
            {useCase}
          </span>
        ))}
      </div>

      {/* Income */}
      <div className="flex items-center justify-between pt-3 border-t border-slate-100">
        <span className="text-xs text-slate-400">예상 수익</span>
        <span className="text-sm font-bold text-emerald-600">₩{tool.monthlyIncome}/월</span>
      </div>

      {/* Visit Button */}
      <a
        href={tool.website}
        target="_blank"
        rel="noopener noreferrer"
        className="mt-3 w-full flex items-center justify-center gap-2 text-xs text-violet-600 hover:text-white hover:bg-violet-500 transition-colors py-2.5 rounded-xl bg-violet-50 border border-violet-200 font-medium"
      >
        사이트 방문 <ExternalLink className="h-3 w-3" />
      </a>
    </div>
  );
}

function ComboCard({
  combo,
  expanded = false,
}: {
  combo: (typeof monetizationCombos)[0];
  expanded?: boolean;
}) {
  const Icon = combo.icon;

  const difficultyStyles = {
    '하': 'bg-emerald-50 text-emerald-600 border-emerald-200',
    '중': 'bg-amber-50 text-amber-600 border-amber-200',
    '상': 'bg-rose-50 text-rose-600 border-rose-200',
  };

  return (
    <div
      className={`rounded-2xl bg-white border border-slate-200 overflow-hidden ${expanded ? '' : 'hover:shadow-lg hover:shadow-slate-200/50 hover:-translate-y-1'} transition-all`}
    >
      {/* Header */}
      <div className="p-4 border-b border-slate-100 bg-gradient-to-r from-slate-50 to-white">
        <div className="flex items-center justify-between mb-2">
          <div className="flex items-center gap-3">
            <div className={`w-10 h-10 rounded-xl ${combo.accentColor.replace('text-', 'bg-').replace('-400', '-100')} flex items-center justify-center border ${combo.borderColor}`}>
              <Icon className={`h-5 w-5 ${combo.accentColor}`} />
            </div>
            <div>
              <h3 className="font-semibold text-slate-800">{combo.category}</h3>
              <div className="flex items-center gap-2 text-xs text-slate-400">
                <Clock className="h-3 w-3" />
                {combo.period}
              </div>
            </div>
          </div>
          <Badge className={`text-xs ${difficultyStyles[combo.difficulty as keyof typeof difficultyStyles]}`}>
            난이도 {combo.difficulty}
          </Badge>
        </div>
        <div className="flex items-center justify-between">
          <span className="text-xs text-slate-400">평균 수익</span>
          <span className="font-bold text-emerald-600">₩{combo.avgIncome}/월</span>
        </div>
      </div>

      {/* Combos */}
      <div className="p-3 space-y-2">
        {combo.combos.map((item, idx) => (
          <div
            key={idx}
            className="p-3 rounded-xl bg-slate-50 hover:bg-slate-100 transition-colors border border-slate-100"
          >
            <div className="flex items-center justify-between mb-2">
              <span className="text-slate-800 text-sm font-medium">{item.name}</span>
              <span className="text-xs font-bold text-emerald-600">₩{item.income}</span>
            </div>
            <p className="text-xs text-slate-500 mb-2">{item.desc}</p>
            <div className="flex flex-wrap gap-1.5">
              {item.tools.map((tool) => (
                <span key={tool} className="text-xs bg-white text-slate-600 px-2 py-1 rounded-md border border-slate-200">
                  {tool}
                </span>
              ))}
            </div>
          </div>
        ))}
      </div>

      {expanded && (
        <div className="p-4 border-t border-slate-100 bg-slate-50">
          <div className="flex items-center gap-2 text-sm text-slate-600">
            <CheckCircle2 className="h-4 w-4 text-emerald-500" />
            <span>총 {combo.combos.length}가지 수익화 방법</span>
          </div>
        </div>
      )}
    </div>
  );
}
