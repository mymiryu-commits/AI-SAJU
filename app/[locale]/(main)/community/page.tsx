'use client';

import { useState } from 'react';
import { Users, MessageSquare, ThumbsUp, Eye, Clock, Pin, Flame, TrendingUp, Award, Bookmark, ChevronRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

const categories = [
  { key: 'all', label: '전체', icon: Users },
  { key: 'questions', label: '질문', icon: MessageSquare },
  { key: 'tips', label: '팁 공유', icon: Award },
  { key: 'showcase', label: '성공사례', icon: TrendingUp },
  { key: 'discussion', label: '자유토론', icon: Flame },
];

const posts = [
  {
    id: '1',
    title: 'ChatGPT로 월 500만원 달성한 후기 공유합니다',
    category: 'showcase',
    author: '성공맨',
    avatar: '👨‍💼',
    content: '안녕하세요, 3개월 전에 시작해서 드디어 월 500만원을 달성했습니다. 제가 사용한 방법은...',
    likes: 234,
    comments: 89,
    views: 3421,
    createdAt: '2시간 전',
    isPinned: true,
    isHot: true,
    tags: ['성공후기', 'ChatGPT', '수익인증'],
  },
  {
    id: '2',
    title: 'Midjourney 프롬프트 작성 꿀팁 모음',
    category: 'tips',
    author: '이미지장인',
    avatar: '🎨',
    content: '이미지 생성할 때 많이들 헤매시는데, 제가 터득한 프롬프트 작성법을 공유합니다...',
    likes: 156,
    comments: 45,
    views: 2134,
    createdAt: '5시간 전',
    isPinned: false,
    isHot: true,
    tags: ['Midjourney', '프롬프트', '꿀팁'],
  },
  {
    id: '3',
    title: '쇼츠 자동화 봇 만들 때 주의할 점이 뭐가 있을까요?',
    category: 'questions',
    author: '초보개발자',
    avatar: '🤔',
    content: 'n8n으로 쇼츠 자동화 시스템을 구축하려고 하는데, 경험 있으신 분들 조언 부탁드립니다...',
    likes: 34,
    comments: 23,
    views: 567,
    createdAt: '1일 전',
    isPinned: false,
    isHot: false,
    tags: ['질문', 'n8n', '자동화'],
  },
  {
    id: '4',
    title: 'Claude vs ChatGPT 블로그 글쓰기 비교 테스트',
    category: 'tips',
    author: '비교분석가',
    avatar: '📊',
    content: '같은 키워드로 두 AI에게 블로그 글을 쓰게 해봤습니다. 결과는 놀라웠는데...',
    likes: 189,
    comments: 67,
    views: 2876,
    createdAt: '1일 전',
    isPinned: false,
    isHot: true,
    tags: ['Claude', 'ChatGPT', '비교분석'],
  },
  {
    id: '5',
    title: 'AI로 부업 시작하시는 분들께 드리는 현실 조언',
    category: 'discussion',
    author: '현실주의자',
    avatar: '💭',
    content: '너무 장밋빛 전망만 보시면 안됩니다. 제가 1년 동안 경험한 현실적인 이야기를...',
    likes: 312,
    comments: 156,
    views: 4532,
    createdAt: '2일 전',
    isPinned: true,
    isHot: true,
    tags: ['현실조언', '부업', '경험담'],
  },
  {
    id: '6',
    title: 'ElevenLabs API 연동 에러 해결 방법',
    category: 'questions',
    author: '개발하는곰',
    avatar: '🐻',
    content: '음성 합성 API 연동하다가 계속 에러가 나는데, 혹시 같은 경험 있으신 분...',
    likes: 12,
    comments: 8,
    views: 234,
    createdAt: '3일 전',
    isPinned: false,
    isHot: false,
    tags: ['ElevenLabs', 'API', '에러'],
  },
];

const topContributors = [
  { name: '성공맨', avatar: '👨‍💼', posts: 156, likes: 4532 },
  { name: '이미지장인', avatar: '🎨', posts: 89, likes: 3421 },
  { name: '자동화마스터', avatar: '⚡', posts: 67, likes: 2876 },
  { name: '비교분석가', avatar: '📊', posts: 45, likes: 2134 },
  { name: '프롬프트연구소', avatar: '🔬', posts: 34, likes: 1876 },
];

export default function CommunityPage() {
  const [selectedCategory, setSelectedCategory] = useState('all');

  const filteredPosts = posts.filter(
    (post) => selectedCategory === 'all' || post.category === selectedCategory
  );

  const pinnedPosts = filteredPosts.filter((p) => p.isPinned);
  const regularPosts = filteredPosts.filter((p) => !p.isPinned);

  return (
    <div className="content-area">
      {/* Header */}
      <div className="section-header animate-fade-in-up">
        <div className="inline-flex items-center gap-2 px-4 py-2 bg-primary/10 rounded-full mb-4">
          <Users className="h-4 w-4 text-primary" />
          <span className="text-sm font-medium">AI 크리에이터 커뮤니티</span>
        </div>
        <h1 className="section-title">커뮤니티</h1>
        <p className="section-subtitle">AI 수익화에 대한 정보를 나누고 함께 성장해요</p>
      </div>

      <div className="grid lg:grid-cols-4 gap-8">
        {/* Main Content */}
        <div className="lg:col-span-3">
          {/* Category Tabs */}
          <div className="flex gap-2 mb-6 overflow-x-auto pb-2 animate-fade-in-up animation-delay-100">
            {categories.map((cat) => {
              const Icon = cat.icon;
              return (
                <Button
                  key={cat.key}
                  variant={selectedCategory === cat.key ? 'default' : 'outline'}
                  size="sm"
                  onClick={() => setSelectedCategory(cat.key)}
                  className={cn(
                    'whitespace-nowrap gap-2',
                    selectedCategory === cat.key && 'btn-primary'
                  )}
                >
                  <Icon className="h-4 w-4" />
                  {cat.label}
                </Button>
              );
            })}
          </div>

          {/* Pinned Posts */}
          {pinnedPosts.length > 0 && (
            <div className="mb-6 animate-fade-in-up animation-delay-200">
              {pinnedPosts.map((post) => (
                <PostCard key={post.id} post={post} />
              ))}
            </div>
          )}

          {/* Regular Posts */}
          <div className="space-y-4 animate-fade-in-up animation-delay-300">
            {regularPosts.map((post) => (
              <PostCard key={post.id} post={post} />
            ))}
          </div>

          {/* Write Button */}
          <div className="mt-8 text-center">
            <Button className="btn-primary px-8">
              <MessageSquare className="h-4 w-4 mr-2" />
              글쓰기
            </Button>
          </div>
        </div>

        {/* Sidebar */}
        <div className="space-y-6 animate-fade-in-up animation-delay-400">
          {/* Top Contributors */}
          <div className="rank-card p-5">
            <h3 className="font-bold mb-4 flex items-center gap-2">
              <Award className="h-5 w-5 text-amber-500" />
              이번 주 TOP 기여자
            </h3>
            <div className="space-y-3">
              {topContributors.map((user, index) => (
                <div key={user.name} className="flex items-center gap-3">
                  <span className="text-sm font-bold text-muted-foreground w-4">
                    {index + 1}
                  </span>
                  <span className="text-2xl">{user.avatar}</span>
                  <div className="flex-1 min-w-0">
                    <p className="font-medium text-sm truncate">{user.name}</p>
                    <p className="text-xs text-muted-foreground">
                      {user.posts}개 글 · {user.likes.toLocaleString()} 좋아요
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Popular Tags */}
          <div className="rank-card p-5">
            <h3 className="font-bold mb-4 flex items-center gap-2">
              <TrendingUp className="h-5 w-5 text-rose-500" />
              인기 태그
            </h3>
            <div className="flex flex-wrap gap-2">
              {['ChatGPT', '수익화', 'Midjourney', '자동화', '쇼츠', '프롬프트', '부업', 'n8n'].map(
                (tag) => (
                  <span
                    key={tag}
                    className="text-xs px-3 py-1.5 bg-secondary rounded-full cursor-pointer hover:bg-primary/10 transition-colors"
                  >
                    #{tag}
                  </span>
                )
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function PostCard({ post }: { post: typeof posts[0] }) {
  return (
    <div className={cn(
      'rank-card p-5 cursor-pointer group',
      post.isPinned && 'border-primary/30'
    )}>
      {/* Header */}
      <div className="flex items-center gap-3 mb-3">
        <span className="text-2xl">{post.avatar}</span>
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2">
            <span className="font-medium text-sm">{post.author}</span>
            {post.isPinned && (
              <Pin className="h-3.5 w-3.5 text-primary" />
            )}
            {post.isHot && (
              <Flame className="h-3.5 w-3.5 text-orange-500" />
            )}
          </div>
          <span className="text-xs text-muted-foreground">{post.createdAt}</span>
        </div>
        <Button variant="ghost" size="icon" className="opacity-0 group-hover:opacity-100 transition-opacity">
          <Bookmark className="h-4 w-4" />
        </Button>
      </div>

      {/* Title */}
      <h3 className="font-bold text-lg mb-2 group-hover:text-primary transition-colors">
        {post.title}
      </h3>

      {/* Content Preview */}
      <p className="text-sm text-muted-foreground mb-3 line-clamp-2">
        {post.content}
      </p>

      {/* Tags */}
      <div className="flex flex-wrap gap-1 mb-3">
        {post.tags.map((tag) => (
          <span key={tag} className="text-xs px-2 py-0.5 bg-secondary rounded">
            #{tag}
          </span>
        ))}
      </div>

      {/* Stats */}
      <div className="flex items-center gap-4 text-sm text-muted-foreground pt-3 border-t">
        <div className="flex items-center gap-1">
          <ThumbsUp className="h-4 w-4" />
          <span>{post.likes}</span>
        </div>
        <div className="flex items-center gap-1">
          <MessageSquare className="h-4 w-4" />
          <span>{post.comments}</span>
        </div>
        <div className="flex items-center gap-1">
          <Eye className="h-4 w-4" />
          <span>{post.views.toLocaleString()}</span>
        </div>
      </div>
    </div>
  );
}
