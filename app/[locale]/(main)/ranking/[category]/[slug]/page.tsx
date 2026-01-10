'use client';

import { useTranslations } from 'next-intl';
import { useParams } from 'next/navigation';
import { Link } from '@/i18n/routing';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import {
  Star,
  ExternalLink,
  ArrowLeft,
  CheckCircle,
  XCircle,
  ThumbsUp,
  MessageSquare,
  TrendingUp,
  DollarSign,
  Zap,
  Globe,
} from 'lucide-react';

// Sample data for AI tool details
const AI_TOOL_DETAILS: Record<string, {
  name: string;
  description: string;
  fullDescription: string;
  logo: string;
  website: string;
  totalScore: number;
  scores: { quality: number; free: number; ux: number; value: number; updates: number };
  pricingType: 'free' | 'freemium' | 'paid';
  pricing: { free: string; paid: string };
  pros: string[];
  cons: string[];
  freeFeatures: string[];
  paidFeatures: string[];
  screenshots: string[];
  reviews: Array<{ user: string; rating: number; content: string; date: string; helpful: number }>;
  relatedTools: string[];
}> = {
  chatgpt: {
    name: 'ChatGPT',
    description: 'OpenAI의 대화형 AI 모델',
    fullDescription: 'ChatGPT는 OpenAI가 개발한 대화형 AI 모델로, 자연어 처리 기술을 기반으로 다양한 질문에 답변하고, 글쓰기, 코딩, 분석 등 다양한 작업을 수행할 수 있습니다. GPT-4 Turbo를 기반으로 하며, 이미지 인식, 코드 실행, 웹 브라우징 등의 고급 기능을 지원합니다.',
    logo: '🤖',
    website: 'https://chat.openai.com',
    totalScore: 95,
    scores: { quality: 98, free: 85, ux: 95, value: 90, updates: 95 },
    pricingType: 'freemium',
    pricing: { free: '무료 (GPT-3.5)', paid: '$20/월 (GPT-4)' },
    pros: [
      '최고 수준의 대화 품질',
      '다양한 플러그인 지원',
      '코드 실행 및 이미지 분석 가능',
      '지속적인 업데이트',
      '모바일 앱 지원',
    ],
    cons: [
      '무료 버전 제한적',
      '피크 시간대 느린 응답',
      '가끔 부정확한 정보 생성',
      'GPT-4는 유료',
    ],
    freeFeatures: [
      'GPT-3.5 모델 사용',
      '기본 대화 기능',
      '제한된 메시지 수',
    ],
    paidFeatures: [
      'GPT-4 및 GPT-4 Turbo 접근',
      'DALL-E 3 이미지 생성',
      '코드 인터프리터',
      '웹 브라우징',
      '우선 응답',
    ],
    screenshots: [],
    reviews: [
      { user: '김개발', rating: 5, content: '코딩할 때 정말 유용합니다. 복잡한 알고리즘도 잘 설명해줘요.', date: '2025-01-05', helpful: 24 },
      { user: '이마케터', rating: 4, content: '마케팅 콘텐츠 작성에 많이 활용하고 있습니다. 다만 가끔 사실 확인이 필요해요.', date: '2025-01-03', helpful: 18 },
      { user: '박학생', rating: 5, content: '과제할 때 도움이 많이 됩니다. 무료 버전도 충분히 좋아요.', date: '2024-12-28', helpful: 32 },
    ],
    relatedTools: ['claude', 'gemini', 'perplexity'],
  },
  claude: {
    name: 'Claude',
    description: 'Anthropic의 안전한 AI 어시스턴트',
    fullDescription: 'Claude는 Anthropic이 개발한 AI 어시스턴트로, 안전성과 유용성을 균형있게 추구합니다. 긴 문서 분석, 복잡한 추론, 코딩 등에서 뛰어난 성능을 보이며, 특히 100K 토큰 이상의 긴 컨텍스트 처리가 가능합니다.',
    logo: '🧠',
    website: 'https://claude.ai',
    totalScore: 94,
    scores: { quality: 97, free: 80, ux: 96, value: 92, updates: 90 },
    pricingType: 'freemium',
    pricing: { free: '무료 (일일 제한)', paid: '$20/월 (Pro)' },
    pros: [
      '긴 문서 처리 능력',
      '뛰어난 분석력',
      '코딩 성능 우수',
      '안전한 응답',
      '빠른 속도',
    ],
    cons: [
      '실시간 정보 접근 불가',
      '이미지 생성 미지원',
      '플러그인 제한적',
    ],
    freeFeatures: [
      'Claude 3.5 Sonnet 사용',
      '파일 업로드',
      '일일 메시지 제한',
    ],
    paidFeatures: [
      '더 많은 메시지',
      '우선 접근',
      'Claude 3 Opus 사용',
      'Artifacts 기능',
    ],
    screenshots: [],
    reviews: [
      { user: '최연구원', rating: 5, content: '논문 분석할 때 최고입니다. 긴 PDF도 한 번에 처리해요.', date: '2025-01-04', helpful: 42 },
      { user: '정개발자', rating: 5, content: '코드 리뷰가 정말 꼼꼼해요. Claude Code도 좋아요.', date: '2025-01-02', helpful: 35 },
    ],
    relatedTools: ['chatgpt', 'gemini', 'perplexity'],
  },
  midjourney: {
    name: 'Midjourney',
    description: '최고 품질의 AI 이미지 생성',
    fullDescription: 'Midjourney는 텍스트 프롬프트를 기반으로 고품질 이미지를 생성하는 AI 도구입니다. 예술적이고 창의적인 이미지 생성에 특화되어 있으며, Discord를 통해 서비스를 제공합니다.',
    logo: '🎨',
    website: 'https://midjourney.com',
    totalScore: 96,
    scores: { quality: 99, free: 70, ux: 85, value: 88, updates: 95 },
    pricingType: 'paid',
    pricing: { free: '무료 체험 종료', paid: '$10~60/월' },
    pros: [
      '최고 수준의 이미지 품질',
      '독특한 예술적 스타일',
      '활발한 커뮤니티',
      '지속적인 버전 업데이트',
    ],
    cons: [
      'Discord 필수',
      '무료 버전 없음',
      '프롬프트 학습 필요',
      '세밀한 제어 어려움',
    ],
    freeFeatures: [],
    paidFeatures: [
      '무제한 이미지 생성',
      '고해상도 출력',
      '상업적 사용 가능',
      '빠른 생성 모드',
    ],
    screenshots: [],
    reviews: [
      { user: '김디자이너', rating: 5, content: '이미지 퀄리티가 정말 놀랍습니다. 작업 효율이 많이 올랐어요.', date: '2025-01-06', helpful: 56 },
    ],
    relatedTools: ['dall-e', 'stable-diffusion', 'leonardo'],
  },
};

export default function ToolDetailPage() {
  const t = useTranslations();
  const params = useParams();
  const category = params.category as string;
  const slug = params.slug as string;

  const tool = AI_TOOL_DETAILS[slug];

  if (!tool) {
    return (
      <div className="container mx-auto px-4 py-12 text-center">
        <h1 className="text-2xl font-bold mb-4">AI 도구를 찾을 수 없습니다</h1>
        <Link href="/ranking">
          <Button>목록으로 돌아가기</Button>
        </Link>
      </div>
    );
  }

  const renderStars = (rating: number) => {
    return Array.from({ length: 5 }, (_, i) => (
      <Star
        key={i}
        className={`h-4 w-4 ${i < rating ? 'text-yellow-400 fill-yellow-400' : 'text-gray-300'}`}
      />
    ));
  };

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Back Button */}
      <Link href={`/ranking/${category}`} className="inline-flex items-center gap-2 text-muted-foreground hover:text-foreground mb-6">
        <ArrowLeft className="h-4 w-4" />
        카테고리로 돌아가기
      </Link>

      {/* Header */}
      <div className="flex flex-col md:flex-row gap-8 mb-8">
        <div className="flex-shrink-0">
          <div className="text-8xl mb-4">{tool.logo}</div>
        </div>
        <div className="flex-1">
          <div className="flex items-center gap-3 mb-2">
            <h1 className="text-3xl font-bold">{tool.name}</h1>
            <Badge variant={
              tool.pricingType === 'free' ? 'default' :
              tool.pricingType === 'freemium' ? 'secondary' : 'outline'
            }>
              {tool.pricingType === 'free' ? '무료' :
               tool.pricingType === 'freemium' ? '부분무료' : '유료'}
            </Badge>
          </div>
          <p className="text-xl text-muted-foreground mb-4">{tool.description}</p>
          <p className="text-foreground mb-6">{tool.fullDescription}</p>
          <div className="flex gap-3">
            <a href={tool.website} target="_blank" rel="noopener noreferrer">
              <Button size="lg">
                <Globe className="h-4 w-4 mr-2" />
                사이트 방문
              </Button>
            </a>
            <Button variant="outline" size="lg">
              <ExternalLink className="h-4 w-4 mr-2" />
              어필리에이트 링크
            </Button>
          </div>
        </div>
        <div className="flex-shrink-0 text-center p-6 bg-muted rounded-xl">
          <div className="text-5xl font-bold text-primary mb-2">{tool.totalScore}</div>
          <div className="text-muted-foreground">총점</div>
        </div>
      </div>

      {/* Scores */}
      <Card className="mb-8">
        <CardHeader>
          <CardTitle>상세 점수</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-5 gap-6">
            {[
              { key: 'quality', label: '품질', icon: Star, color: 'text-yellow-500' },
              { key: 'free', label: '무료 범위', icon: DollarSign, color: 'text-green-500' },
              { key: 'ux', label: '사용성', icon: Zap, color: 'text-blue-500' },
              { key: 'value', label: '가성비', icon: TrendingUp, color: 'text-purple-500' },
              { key: 'updates', label: '업데이트', icon: MessageSquare, color: 'text-orange-500' },
            ].map(({ key, label, icon: Icon, color }) => (
              <div key={key} className="text-center p-4 bg-muted/50 rounded-lg">
                <Icon className={`h-6 w-6 mx-auto mb-2 ${color}`} />
                <div className="text-2xl font-bold mb-1">
                  {tool.scores[key as keyof typeof tool.scores]}
                </div>
                <div className="text-sm text-muted-foreground mb-2">{label}</div>
                <Progress value={tool.scores[key as keyof typeof tool.scores]} className="h-2" />
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Tabs */}
      <Tabs defaultValue="overview" className="mb-8">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="overview">개요</TabsTrigger>
          <TabsTrigger value="pricing">가격</TabsTrigger>
          <TabsTrigger value="reviews">리뷰</TabsTrigger>
          <TabsTrigger value="related">관련 도구</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="mt-6">
          <div className="grid md:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-green-600">
                  <CheckCircle className="h-5 w-5" />
                  장점
                </CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2">
                  {tool.pros.map((pro, i) => (
                    <li key={i} className="flex items-start gap-2">
                      <CheckCircle className="h-4 w-4 text-green-500 mt-1 flex-shrink-0" />
                      <span>{pro}</span>
                    </li>
                  ))}
                </ul>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-red-600">
                  <XCircle className="h-5 w-5" />
                  단점
                </CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2">
                  {tool.cons.map((con, i) => (
                    <li key={i} className="flex items-start gap-2">
                      <XCircle className="h-4 w-4 text-red-500 mt-1 flex-shrink-0" />
                      <span>{con}</span>
                    </li>
                  ))}
                </ul>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="pricing" className="mt-6">
          <div className="grid md:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>무료 버전</CardTitle>
                <p className="text-2xl font-bold text-primary">{tool.pricing.free}</p>
              </CardHeader>
              <CardContent>
                {tool.freeFeatures.length > 0 ? (
                  <ul className="space-y-2">
                    {tool.freeFeatures.map((feature, i) => (
                      <li key={i} className="flex items-center gap-2">
                        <CheckCircle className="h-4 w-4 text-green-500" />
                        <span>{feature}</span>
                      </li>
                    ))}
                  </ul>
                ) : (
                  <p className="text-muted-foreground">무료 버전이 제공되지 않습니다.</p>
                )}
              </CardContent>
            </Card>

            <Card className="border-primary">
              <CardHeader>
                <CardTitle>유료 버전</CardTitle>
                <p className="text-2xl font-bold text-primary">{tool.pricing.paid}</p>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2">
                  {tool.paidFeatures.map((feature, i) => (
                    <li key={i} className="flex items-center gap-2">
                      <Star className="h-4 w-4 text-yellow-500" />
                      <span>{feature}</span>
                    </li>
                  ))}
                </ul>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="reviews" className="mt-6">
          <div className="space-y-4">
            {tool.reviews.map((review, i) => (
              <Card key={i}>
                <CardContent className="pt-6">
                  <div className="flex items-start justify-between mb-3">
                    <div>
                      <div className="font-semibold">{review.user}</div>
                      <div className="flex items-center gap-2 mt-1">
                        <div className="flex">{renderStars(review.rating)}</div>
                        <span className="text-sm text-muted-foreground">{review.date}</span>
                      </div>
                    </div>
                    <Button variant="ghost" size="sm">
                      <ThumbsUp className="h-4 w-4 mr-1" />
                      {review.helpful}
                    </Button>
                  </div>
                  <p className="text-muted-foreground">{review.content}</p>
                </CardContent>
              </Card>
            ))}

            <Card className="bg-muted/50">
              <CardContent className="pt-6 text-center">
                <p className="text-muted-foreground mb-4">이 도구를 사용해보셨나요?</p>
                <Button>리뷰 작성하기</Button>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="related" className="mt-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {tool.relatedTools.map((relatedSlug) => {
              const related = AI_TOOL_DETAILS[relatedSlug];
              if (!related) return null;
              return (
                <Link key={relatedSlug} href={`/ranking/${category}/${relatedSlug}`}>
                  <Card className="hover:shadow-lg transition-shadow cursor-pointer">
                    <CardContent className="pt-6">
                      <div className="flex items-center gap-4">
                        <div className="text-4xl">{related.logo}</div>
                        <div>
                          <h3 className="font-semibold">{related.name}</h3>
                          <p className="text-sm text-muted-foreground">{related.description}</p>
                          <div className="text-lg font-bold text-primary mt-1">{related.totalScore}점</div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </Link>
              );
            })}
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}
