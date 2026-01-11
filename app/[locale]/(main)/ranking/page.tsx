'use client';

import { useState } from 'react';
import Image from 'next/image';
import { Star, Trophy, ExternalLink } from 'lucide-react';
import { cn } from '@/lib/utils';

// AI Tools Data with categories
const aiTools = {
  all: [
    { id: '1', name: 'ChatGPT', company: 'OpenAI', rating: 4.8, price: '월 $20', description: 'OpenAI의 대화형 AI 어시스턴트', logo: '/logos/openai.png', category: 'writing' },
    { id: '2', name: 'Claude', company: 'Anthropic', rating: 4.7, price: '월 $20', description: 'Anthropic의 안전한 AI 어시스턴트', logo: '/logos/anthropic.png', category: 'writing' },
    { id: '3', name: 'GEMINI', company: 'Google', rating: 4.6, price: '무료/월 $20', description: 'Google의 멀티모달 AI', logo: '/logos/google.png', category: 'writing' },
    { id: '4', name: 'Jasper', company: 'Jasper AI', rating: 4.5, price: '월 $39', description: '마케팅 콘텐츠 전문 AI', logo: '/logos/jasper.png', category: 'writing' },
    { id: '5', name: 'Copy.ai', company: 'Copy.ai', rating: 4.2, price: '월 $36', description: 'AI 카피라이팅 전문 도구', logo: '/logos/copyai.png', category: 'writing' },
    { id: '6', name: 'Perplexity', company: 'Perplexity AI', rating: 4.4, price: '무료/월 $20', description: '검색 기반 AI 답변 생성', logo: '/logos/perplexity.png', category: 'writing' },
    { id: '7', name: 'Writesonic', company: 'Writesonic', rating: 4.1, price: '월 $13', description: 'AI 콘텐츠 생성 플랫폼', logo: '/logos/writesonic.png', category: 'writing' },
    { id: '8', name: 'Rytr', company: 'Rytr', rating: 4.0, price: '월 $9', description: 'AI 라이팅 어시스턴트', logo: '/logos/rytr.png', category: 'writing' },
    { id: '9', name: 'QuillBot', company: 'QuillBot', rating: 4.2, price: '월 $5', description: 'AI 패러프레이징 도구', logo: '/logos/quillbot.png', category: 'writing' },
    { id: '10', name: 'Wordtune', company: 'AI21 Labs', rating: 4.0, price: '월 $10', description: 'AI 글쓰기 개선 도구', logo: '/logos/wordtune.png', category: 'writing' },
    { id: '11', name: 'Grammarly Business', company: 'Grammarly', rating: 4.1, price: '월 $15', description: '팀용 AI 글쓰기 도구', logo: '/logos/grammarly.png', category: 'writing' },
  ],
  writing: [
    { id: '1', name: 'ChatGPT', company: 'OpenAI', rating: 4.8, price: '월 $20', description: 'OpenAI의 대화형 AI 어시스턴트', logo: '/logos/openai.png', category: 'writing' },
    { id: '2', name: 'Claude', company: 'Anthropic', rating: 4.7, price: '월 $20', description: 'Anthropic의 안전한 AI 어시스턴트', logo: '/logos/anthropic.png', category: 'writing' },
    { id: '3', name: 'GEMINI', company: 'Google', rating: 4.6, price: '무료/월 $20', description: 'Google의 멀티모달 AI', logo: '/logos/google.png', category: 'writing' },
    { id: '4', name: 'Jasper', company: 'Jasper AI', rating: 4.5, price: '월 $39', description: '마케팅 콘텐츠 전문 AI', logo: '/logos/jasper.png', category: 'writing' },
    { id: '5', name: 'Copy.ai', company: 'Copy.ai', rating: 4.2, price: '월 $36', description: 'AI 카피라이팅 전문 도구', logo: '/logos/copyai.png', category: 'writing' },
    { id: '6', name: 'Perplexity', company: 'Perplexity AI', rating: 4.4, price: '무료/월 $20', description: '검색 기반 AI 답변 생성', logo: '/logos/perplexity.png', category: 'writing' },
    { id: '7', name: 'Writesonic', company: 'Writesonic', rating: 4.1, price: '월 $13', description: 'AI 콘텐츠 생성 플랫폼', logo: '/logos/writesonic.png', category: 'writing' },
    { id: '8', name: 'Rytr', company: 'Rytr', rating: 4.0, price: '월 $9', description: 'AI 라이팅 어시스턴트', logo: '/logos/rytr.png', category: 'writing' },
    { id: '9', name: 'QuillBot', company: 'QuillBot', rating: 4.2, price: '월 $5', description: 'AI 패러프레이징 도구', logo: '/logos/quillbot.png', category: 'writing' },
    { id: '10', name: 'Wordtune', company: 'AI21 Labs', rating: 4.0, price: '월 $10', description: 'AI 글쓰기 개선 도구', logo: '/logos/wordtune.png', category: 'writing' },
    { id: '11', name: 'Grammarly Business', company: 'Grammarly', rating: 4.1, price: '월 $15', description: '팀용 AI 글쓰기 도구', logo: '/logos/grammarly.png', category: 'writing' },
  ],
  image: [
    { id: '1', name: 'Midjourney', company: 'Midjourney', rating: 4.9, price: '월 $10', description: '최고 품질의 AI 이미지 생성', logo: '/logos/midjourney.png', category: 'image' },
    { id: '2', name: 'DALL-E 3', company: 'OpenAI', rating: 4.6, price: '월 $20', description: 'OpenAI의 이미지 생성 AI', logo: '/logos/openai.png', category: 'image' },
    { id: '3', name: 'Runway', company: 'Runway', rating: 4.4, price: '월 $15', description: 'AI 비디오 생성 플랫폼', logo: '/logos/runway.png', category: 'image' },
    { id: '4', name: 'Stable Diffusion', company: 'Stability AI', rating: 4.3, price: '무료', description: '오픈소스 이미지 생성 AI', logo: '/logos/stability.png', category: 'image' },
    { id: '5', name: 'Leonardo AI', company: 'Leonardo.ai', rating: 4.2, price: '월 $12', description: '게임 에셋 특화 AI', logo: '/logos/leonardo.png', category: 'image' },
    { id: '6', name: 'Canva AI', company: 'Canva', rating: 4.3, price: '월 $15', description: '디자인 자동화 플랫폼', logo: '/logos/canva.png', category: 'image' },
    { id: '7', name: 'Adobe Firefly', company: 'Adobe', rating: 4.4, price: '월 $23', description: 'Adobe의 생성형 AI', logo: '/logos/adobe.png', category: 'image' },
    { id: '8', name: 'Pika Labs', company: 'Pika', rating: 4.1, price: '월 $10', description: 'AI 비디오 생성', logo: '/logos/pika.png', category: 'image' },
    { id: '9', name: 'Ideogram', company: 'Ideogram', rating: 4.0, price: '무료/월 $8', description: '텍스트 렌더링 특화 AI', logo: '/logos/ideogram.png', category: 'image' },
  ],
  audio: [
    { id: '1', name: 'Suno', company: 'Suno AI', rating: 4.5, price: '월 $10', description: 'AI 음악 생성 플랫폼', logo: '/logos/suno.png', category: 'audio' },
    { id: '2', name: 'Udio', company: 'Udio', rating: 4.3, price: '월 $12', description: '고품질 AI 음악 제작', logo: '/logos/udio.png', category: 'audio' },
    { id: '3', name: 'ElevenLabs', company: 'ElevenLabs', rating: 4.7, price: '월 $5', description: 'AI 음성 합성 도구', logo: '/logos/elevenlabs.png', category: 'audio' },
    { id: '4', name: 'Mubert', company: 'Mubert', rating: 4.1, price: '월 $14', description: 'AI 배경음악 생성', logo: '/logos/mubert.png', category: 'audio' },
    { id: '5', name: 'AIVA', company: 'AIVA', rating: 4.0, price: '월 $11', description: 'AI 작곡가', logo: '/logos/aiva.png', category: 'audio' },
    { id: '6', name: 'Soundraw', company: 'Soundraw', rating: 3.9, price: '월 $17', description: '로열티 프리 AI 음악', logo: '/logos/soundraw.png', category: 'audio' },
    { id: '7', name: 'Boomy', company: 'Boomy', rating: 3.7, price: '월 $3', description: '즉석 음악 생성', logo: '/logos/boomy.png', category: 'audio' },
    { id: '8', name: 'Beatoven.ai', company: 'Beatoven', rating: 3.8, price: '월 $6', description: '맞춤형 배경음악', logo: '/logos/beatoven.png', category: 'audio' },
    { id: '9', name: 'Descript', company: 'Descript', rating: 4.2, price: '월 $12', description: 'AI 오디오/비디오 편집', logo: '/logos/descript.png', category: 'audio' },
  ],
  website: [
    { id: '1', name: 'Framer', company: 'Framer', rating: 4.7, price: '월 $20', description: 'AI 기반 웹사이트 빌더', logo: '/logos/framer.png', category: 'website' },
    { id: '2', name: 'Webflow', company: 'Webflow', rating: 4.6, price: '월 $14', description: '노코드 웹사이트 제작', logo: '/logos/webflow.png', category: 'website' },
    { id: '3', name: '10Web', company: '10Web', rating: 4.3, price: '월 $10', description: 'AI 웹사이트 생성기', logo: '/logos/10web.png', category: 'website' },
    { id: '4', name: 'Wix ADI', company: 'Wix', rating: 4.1, price: '월 $16', description: 'AI 웹사이트 디자인', logo: '/logos/wix.png', category: 'website' },
    { id: '5', name: 'Durable', company: 'Durable', rating: 4.0, price: '월 $12', description: '30초 웹사이트 생성', logo: '/logos/durable.png', category: 'website' },
    { id: '6', name: 'Hostinger AI', company: 'Hostinger', rating: 3.9, price: '월 $3', description: 'AI 웹사이트 빌더', logo: '/logos/hostinger.png', category: 'website' },
    { id: '7', name: 'Squarespace AI', company: 'Squarespace', rating: 4.2, price: '월 $18', description: '디자인 중심 웹빌더', logo: '/logos/squarespace.png', category: 'website' },
    { id: '8', name: 'Bookmark AI', company: 'Bookmark', rating: 3.8, price: '월 $12', description: 'AIDA 웹사이트 빌더', logo: '/logos/bookmark.png', category: 'website' },
    { id: '9', name: 'Relume', company: 'Relume', rating: 4.1, price: '월 $38', description: 'AI 웹사이트 와이어프레임', logo: '/logos/relume.png', category: 'website' },
  ],
  coding: [
    { id: '1', name: 'GitHub Copilot', company: 'GitHub', rating: 4.8, price: '월 $10', description: 'AI 코드 어시스턴트', logo: '/logos/github.png', category: 'coding' },
    { id: '2', name: 'Cursor', company: 'Cursor', rating: 4.7, price: '월 $20', description: 'AI 기반 코드 에디터', logo: '/logos/cursor.png', category: 'coding' },
    { id: '3', name: 'Tabnine', company: 'Tabnine', rating: 4.3, price: '월 $12', description: 'AI 코드 자동완성', logo: '/logos/tabnine.png', category: 'coding' },
    { id: '4', name: 'Replit AI', company: 'Replit', rating: 4.4, price: '월 $7', description: 'AI 기반 개발 환경', logo: '/logos/replit.png', category: 'coding' },
    { id: '5', name: 'Codeium', company: 'Codeium', rating: 4.2, price: '무료', description: '무료 AI 코딩 도구', logo: '/logos/codeium.png', category: 'coding' },
    { id: '6', name: 'Amazon CodeWhisperer', company: 'AWS', rating: 4.1, price: '무료/월 $19', description: 'AWS AI 코드 생성', logo: '/logos/aws.png', category: 'coding' },
    { id: '7', name: 'Sourcegraph Cody', company: 'Sourcegraph', rating: 4.0, price: '무료/월 $9', description: 'AI 코드 검색 & 생성', logo: '/logos/sourcegraph.png', category: 'coding' },
    { id: '8', name: 'Pieces', company: 'Pieces', rating: 3.9, price: '무료', description: 'AI 코드 스니펫 관리', logo: '/logos/pieces.png', category: 'coding' },
  ],
  automation: [
    { id: '1', name: 'Zapier AI', company: 'Zapier', rating: 4.5, price: '월 $20', description: 'AI 워크플로우 자동화', logo: '/logos/zapier.png', category: 'automation' },
    { id: '2', name: 'Make (Integromat)', company: 'Make', rating: 4.4, price: '월 $9', description: '시각적 자동화 플랫폼', logo: '/logos/make.png', category: 'automation' },
    { id: '3', name: 'n8n', company: 'n8n', rating: 4.3, price: '무료/월 $20', description: '오픈소스 자동화 도구', logo: '/logos/n8n.png', category: 'automation' },
    { id: '4', name: 'Bardeen', company: 'Bardeen', rating: 4.2, price: '무료/월 $10', description: 'AI 브라우저 자동화', logo: '/logos/bardeen.png', category: 'automation' },
    { id: '5', name: 'Axiom', company: 'Axiom', rating: 4.0, price: '월 $15', description: '노코드 브라우저 봇', logo: '/logos/axiom.png', category: 'automation' },
    { id: '6', name: 'Magical', company: 'Magical', rating: 4.1, price: '무료/월 $10', description: 'AI 텍스트 확장', logo: '/logos/magical.png', category: 'automation' },
  ],
  education: [
    { id: '1', name: 'Duolingo Max', company: 'Duolingo', rating: 4.6, price: '월 $30', description: 'AI 언어 학습', logo: '/logos/duolingo.png', category: 'education' },
    { id: '2', name: 'Khan Academy Khanmigo', company: 'Khan Academy', rating: 4.5, price: '월 $4', description: 'AI 튜터', logo: '/logos/khan.png', category: 'education' },
    { id: '3', name: 'Quizlet Q-Chat', company: 'Quizlet', rating: 4.3, price: '월 $8', description: 'AI 학습 도우미', logo: '/logos/quizlet.png', category: 'education' },
    { id: '4', name: 'Photomath', company: 'Photomath', rating: 4.4, price: '무료/월 $10', description: 'AI 수학 문제 풀이', logo: '/logos/photomath.png', category: 'education' },
    { id: '5', name: 'Socratic', company: 'Google', rating: 4.2, price: '무료', description: 'AI 숙제 도우미', logo: '/logos/google.png', category: 'education' },
    { id: '6', name: 'Knowji', company: 'Knowji', rating: 4.0, price: '월 $5', description: 'AI 어휘 학습', logo: '/logos/knowji.png', category: 'education' },
  ],
  marketing: [
    { id: '1', name: 'HubSpot AI', company: 'HubSpot', rating: 4.5, price: '월 $45', description: 'AI 마케팅 자동화', logo: '/logos/hubspot.png', category: 'marketing' },
    { id: '2', name: 'Surfer SEO', company: 'Surfer', rating: 4.4, price: '월 $59', description: 'AI SEO 최적화', logo: '/logos/surfer.png', category: 'marketing' },
    { id: '3', name: 'AdCreative.ai', company: 'AdCreative', rating: 4.3, price: '월 $29', description: 'AI 광고 크리에이티브', logo: '/logos/adcreative.png', category: 'marketing' },
    { id: '4', name: 'Frase', company: 'Frase', rating: 4.2, price: '월 $15', description: 'AI 콘텐츠 전략', logo: '/logos/frase.png', category: 'marketing' },
    { id: '5', name: 'MarketMuse', company: 'MarketMuse', rating: 4.1, price: '월 $149', description: 'AI 콘텐츠 인텔리전스', logo: '/logos/marketmuse.png', category: 'marketing' },
    { id: '6', name: 'Phrasee', company: 'Phrasee', rating: 4.0, price: '문의', description: 'AI 마케팅 카피', logo: '/logos/phrasee.png', category: 'marketing' },
  ],
  platform: [
    { id: '1', name: 'OpenAI Platform', company: 'OpenAI', rating: 4.9, price: '사용량 기반', description: 'GPT API 플랫폼', logo: '/logos/openai.png', category: 'platform' },
    { id: '2', name: 'Google AI Studio', company: 'Google', rating: 4.6, price: '무료/사용량', description: 'Gemini API 플랫폼', logo: '/logos/google.png', category: 'platform' },
    { id: '3', name: 'Anthropic API', company: 'Anthropic', rating: 4.7, price: '사용량 기반', description: 'Claude API 플랫폼', logo: '/logos/anthropic.png', category: 'platform' },
    { id: '4', name: 'Hugging Face', company: 'Hugging Face', rating: 4.5, price: '무료/Pro', description: 'AI 모델 허브', logo: '/logos/huggingface.png', category: 'platform' },
    { id: '5', name: 'Replicate', company: 'Replicate', rating: 4.3, price: '사용량 기반', description: 'AI 모델 호스팅', logo: '/logos/replicate.png', category: 'platform' },
    { id: '6', name: 'Together AI', company: 'Together', rating: 4.2, price: '사용량 기반', description: '오픈소스 AI 호스팅', logo: '/logos/together.png', category: 'platform' },
  ],
};

const categoryLabels: Record<string, string> = {
  all: '전체 AI 도구 랭킹',
  writing: '글쓰기 AI 도구',
  image: '이미지/영상 AI 도구',
  audio: '음원 AI 도구',
  website: '홈페이지 AI 도구',
  coding: 'AI 코딩 도구',
  automation: '업무/자동화 AI 도구',
  education: '교육 AI 도구',
  marketing: '마케팅/광고 AI 도구',
  platform: 'AI 플랫폼',
};

const categorySubtitles: Record<string, string> = {
  all: '1위부터 3위까지 특별 표시된 최고의 AI 도구들을 확인하세요',
  writing: '최고의 글쓰기 AI 도구들을 랭킹순으로 확인하세요',
  image: '최고의 이미지/영상 AI 도구들을 랭킹순으로 확인하세요',
  audio: '최고의 음원 AI 도구들을 랭킹순으로 확인하세요',
  website: '최고의 홈페이지 AI 도구들을 랭킹순으로 확인하세요',
  coding: '최고의 AI 코딩 도구들을 랭킹순으로 확인하세요',
  automation: '최고의 업무/자동화 AI 도구들을 랭킹순으로 확인하세요',
  education: '최고의 교육 AI 도구들을 랭킹순으로 확인하세요',
  marketing: '최고의 마케팅/광고 AI 도구들을 랭킹순으로 확인하세요',
  platform: '최고의 AI 플랫폼들을 랭킹순으로 확인하세요',
};

interface Tool {
  id: string;
  name: string;
  company: string;
  rating: number;
  price: string;
  description: string;
  logo: string;
  category: string;
}

function ToolCard({ tool, rank }: { tool: Tool; rank: number }) {
  const isTopThree = rank <= 3;

  const getTrophyIcon = () => {
    if (rank === 1) return <Trophy className="h-5 w-5 trophy-gold" />;
    if (rank === 2) return <Trophy className="h-5 w-5 trophy-silver" />;
    if (rank === 3) return <Trophy className="h-5 w-5 trophy-bronze" />;
    return null;
  };

  return (
    <div
      className={cn(
        'rank-card p-5 animate-fade-in-up',
        rank === 1 && 'rank-1',
        rank === 2 && 'rank-2',
        rank === 3 && 'rank-3'
      )}
      style={{ animationDelay: `${(rank - 1) * 50}ms` }}
    >
      {/* Top Row - Trophy/Rank & Category */}
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          {isTopThree ? (
            getTrophyIcon()
          ) : (
            <span className="text-sm font-medium text-muted-foreground">#{rank}</span>
          )}
        </div>
        <span className="category-tag">
          {tool.category === 'writing' ? '글쓰기' :
           tool.category === 'image' ? '이미지/영상' :
           tool.category === 'audio' ? '음원' :
           tool.category === 'website' ? '홈페이지' :
           tool.category === 'coding' ? 'AI코딩' :
           tool.category === 'automation' ? '업무/자동화' :
           tool.category === 'education' ? '교육' :
           tool.category === 'marketing' ? '마케팅/광고' :
           tool.category === 'platform' ? 'AI 플랫폼' : tool.category}
        </span>
        {isTopThree && (
          <span className="text-sm font-medium text-muted-foreground">#{rank}</span>
        )}
      </div>

      {/* Logo & Info */}
      <div className="flex items-start gap-4 mb-3">
        <div className="logo-placeholder">
          {tool.name.substring(0, 2).toUpperCase()}
        </div>
        <div className="flex-1 min-w-0">
          <h3 className="font-bold text-lg truncate">{tool.name}</h3>
          <div className="flex items-center gap-2 mt-1">
            <div className="rating">
              <Star className="h-4 w-4 rating-star" />
              <span className="text-sm font-medium">{tool.rating}</span>
            </div>
            <span className="price-tag text-sm">{tool.price}</span>
          </div>
        </div>
      </div>

      {/* Description */}
      <p className="text-sm text-muted-foreground line-clamp-2">
        {tool.description}
      </p>
    </div>
  );
}

export default function RankingPage() {
  const [category, setCategory] = useState<string>('all');

  // Get tools for current category
  const tools = aiTools[category as keyof typeof aiTools] || aiTools.all;

  return (
    <div className="content-area">
      {/* Section Header */}
      <div className="section-header animate-fade-in-up">
        <h1 className="section-title">{categoryLabels[category]}</h1>
        <p className="section-subtitle">{categorySubtitles[category]}</p>
      </div>

      {/* Tools Grid */}
      <div className="grid-cards">
        {tools.map((tool, index) => (
          <ToolCard key={tool.id} tool={tool} rank={index + 1} />
        ))}
      </div>
    </div>
  );
}
