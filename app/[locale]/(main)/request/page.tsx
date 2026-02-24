'use client';

import { useState } from 'react';
import { FileQuestion, DollarSign, Users, Clock, ThumbsUp, MessageSquare, CheckCircle, AlertCircle, PlusCircle, Filter, TrendingUp, Award } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

const statusOptions = [
  { key: 'all', label: '전체' },
  { key: 'open', label: '모집중' },
  { key: 'in_progress', label: '제작중' },
  { key: 'completed', label: '완료' },
];

const requests = [
  {
    id: '1',
    title: 'Sora AI 영상 제작 가이드북',
    description: 'OpenAI Sora를 활용한 영상 제작 A to Z 가이드가 필요합니다. 프롬프트 작성법부터 편집, 수익화까지 포함되면 좋겠습니다.',
    requester: '영상크리에이터',
    avatar: '🎬',
    suggestedPrice: 49900,
    currentPledge: 1247000,
    backers: 32,
    targetBackers: 50,
    deadline: '2024-02-28',
    status: 'open',
    category: 'guide',
    votes: 156,
    comments: 23,
    createdAt: '3일 전',
  },
  {
    id: '2',
    title: 'AI 음악 수익화 완벽 가이드',
    description: 'Suno, Udio 등 AI 음악 플랫폼을 활용해서 음원 수익화하는 방법. Spotify, Apple Music 배포 방법 포함.',
    requester: '뮤직프로듀서',
    avatar: '🎵',
    suggestedPrice: 39900,
    currentPledge: 998000,
    backers: 28,
    targetBackers: 30,
    deadline: '2024-02-15',
    status: 'in_progress',
    category: 'guide',
    votes: 234,
    comments: 45,
    createdAt: '1주 전',
  },
  {
    id: '3',
    title: 'Claude API n8n 연동 템플릿',
    description: 'Claude API를 n8n에서 활용하는 다양한 워크플로우 템플릿이 필요합니다. 블로그 자동화, 이메일 처리 등.',
    requester: '자동화러버',
    avatar: '⚡',
    suggestedPrice: 29900,
    currentPledge: 598000,
    backers: 20,
    targetBackers: 30,
    deadline: '2024-02-20',
    status: 'open',
    category: 'template',
    votes: 89,
    comments: 12,
    createdAt: '5일 전',
  },
  {
    id: '4',
    title: 'AI 이모티콘 제작 & 판매 가이드',
    description: 'Midjourney, DALL-E로 이모티콘 만들어서 카카오톡, 라인에 판매하는 전체 프로세스 가이드.',
    requester: '이모티콘작가',
    avatar: '😊',
    suggestedPrice: 24900,
    currentPledge: 746000,
    backers: 35,
    targetBackers: 40,
    deadline: '2024-03-01',
    status: 'open',
    category: 'guide',
    votes: 167,
    comments: 34,
    createdAt: '1주 전',
  },
  {
    id: '5',
    title: '쿠팡파트너스 AI 블로그 자동화 시스템',
    description: '키워드 리서치부터 글 작성, 포스팅까지 완전 자동화된 쿠팡파트너스 블로그 시스템 구축 가이드.',
    requester: '부업연구가',
    avatar: '💰',
    suggestedPrice: 59900,
    currentPledge: 1798000,
    backers: 42,
    targetBackers: 40,
    deadline: '2024-02-10',
    status: 'completed',
    category: 'system',
    votes: 312,
    comments: 78,
    createdAt: '2주 전',
  },
  {
    id: '6',
    title: 'AI 캐릭터 IP 사업화 가이드',
    description: 'AI로 캐릭터를 만들고 IP 사업화(굿즈, 웹툰, NFT 등)하는 방법에 대한 종합 가이드.',
    requester: 'IP사업가',
    avatar: '🎨',
    suggestedPrice: 69900,
    currentPledge: 489000,
    backers: 8,
    targetBackers: 30,
    deadline: '2024-03-15',
    status: 'open',
    category: 'guide',
    votes: 45,
    comments: 6,
    createdAt: '2일 전',
  },
];

const topCreators = [
  { name: 'AI가이드마스터', avatar: '📚', completed: 12, earnings: '15,240,000' },
  { name: '자동화천재', avatar: '⚡', completed: 8, earnings: '9,870,000' },
  { name: '프롬프트킹', avatar: '👑', completed: 6, earnings: '7,450,000' },
];

export default function RequestPage() {
  const [selectedStatus, setSelectedStatus] = useState('all');
  const [showCreateModal, setShowCreateModal] = useState(false);

  const filteredRequests = requests.filter(
    (req) => selectedStatus === 'all' || req.status === selectedStatus
  );

  return (
    <div className="content-area">
      {/* Header */}
      <div className="section-header animate-fade-in-up">
        <div className="inline-flex items-center gap-2 px-4 py-2 bg-primary/10 rounded-full mb-4">
          <FileQuestion className="h-4 w-4 text-primary" />
          <span className="text-sm font-medium">크라우드 펀딩</span>
        </div>
        <h1 className="section-title">자료 요청</h1>
        <p className="section-subtitle">
          원하는 자료를 요청하고, 크리에이터가 제작하면 수수료 정산까지
        </p>
      </div>

      {/* Stats Banner */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8 animate-fade-in-up animation-delay-100">
        {[
          { label: '진행중인 요청', value: '24건', icon: Clock },
          { label: '총 펀딩 금액', value: '₩45.2M', icon: DollarSign },
          { label: '참여 후원자', value: '1,234명', icon: Users },
          { label: '완료된 제작', value: '89건', icon: CheckCircle },
        ].map((stat) => {
          const Icon = stat.icon;
          return (
            <div key={stat.label} className="rank-card p-4 text-center">
              <Icon className="h-6 w-6 mx-auto mb-2 text-muted-foreground" />
              <p className="text-2xl font-bold">{stat.value}</p>
              <p className="text-xs text-muted-foreground">{stat.label}</p>
            </div>
          );
        })}
      </div>

      <div className="grid lg:grid-cols-4 gap-8">
        {/* Main Content */}
        <div className="lg:col-span-3">
          {/* Filter & Actions */}
          <div className="flex flex-col sm:flex-row gap-4 mb-6 animate-fade-in-up animation-delay-200">
            <div className="flex gap-2 flex-wrap">
              {statusOptions.map((option) => (
                <Button
                  key={option.key}
                  variant={selectedStatus === option.key ? 'default' : 'outline'}
                  size="sm"
                  onClick={() => setSelectedStatus(option.key)}
                  className={cn(
                    selectedStatus === option.key && 'btn-primary'
                  )}
                >
                  {option.label}
                </Button>
              ))}
            </div>
            <Button className="btn-primary sm:ml-auto" onClick={() => setShowCreateModal(true)}>
              <PlusCircle className="h-4 w-4 mr-2" />
              자료 요청하기
            </Button>
          </div>

          {/* Request Cards */}
          <div className="space-y-4 animate-fade-in-up animation-delay-300">
            {filteredRequests.map((request) => (
              <RequestCard key={request.id} request={request} />
            ))}
          </div>
        </div>

        {/* Sidebar */}
        <div className="space-y-6 animate-fade-in-up animation-delay-400">
          {/* How it works */}
          <div className="rank-card p-5">
            <h3 className="font-bold mb-4">이용 방법</h3>
            <div className="space-y-4 text-sm">
              {[
                { step: '1', title: '자료 요청', desc: '원하는 자료를 요청하고 희망 가격을 설정하세요' },
                { step: '2', title: '후원 참여', desc: '다른 사용자들이 후원에 참여합니다' },
                { step: '3', title: '크리에이터 제작', desc: '목표 달성 시 크리에이터가 제작을 시작합니다' },
                { step: '4', title: '자료 배포', desc: '완성된 자료가 후원자에게 배포됩니다' },
              ].map((item) => (
                <div key={item.step} className="flex gap-3">
                  <div className="w-6 h-6 rounded-full bg-primary text-primary-foreground flex items-center justify-center text-xs font-bold shrink-0">
                    {item.step}
                  </div>
                  <div>
                    <p className="font-medium">{item.title}</p>
                    <p className="text-muted-foreground text-xs">{item.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Top Creators */}
          <div className="rank-card p-5">
            <h3 className="font-bold mb-4 flex items-center gap-2">
              <Award className="h-5 w-5 text-amber-500" />
              인기 크리에이터
            </h3>
            <div className="space-y-3">
              {topCreators.map((creator, index) => (
                <div key={creator.name} className="flex items-center gap-3">
                  <span className="text-2xl">{creator.avatar}</span>
                  <div className="flex-1 min-w-0">
                    <p className="font-medium text-sm truncate">{creator.name}</p>
                    <p className="text-xs text-muted-foreground">
                      {creator.completed}건 완료 · ₩{creator.earnings}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Commission Info */}
          <div className="rank-card p-5 bg-primary/5">
            <h3 className="font-bold mb-2">수수료 안내</h3>
            <div className="text-sm space-y-2">
              <div className="flex justify-between">
                <span className="text-muted-foreground">크리에이터 수익</span>
                <span className="font-bold">85%</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">플랫폼 수수료</span>
                <span className="font-bold">15%</span>
              </div>
              <p className="text-xs text-muted-foreground pt-2 border-t">
                * 제작 완료 후 7일 이내 정산됩니다
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function RequestCard({ request }: { request: typeof requests[0] }) {
  const progress = Math.min((request.backers / request.targetBackers) * 100, 100);

  const statusColors = {
    open: 'bg-emerald-500/10 text-emerald-600',
    in_progress: 'bg-amber-500/10 text-amber-600',
    completed: 'bg-blue-500/10 text-blue-600',
  };

  const statusLabels = {
    open: '모집중',
    in_progress: '제작중',
    completed: '완료',
  };

  return (
    <div className="rank-card p-5">
      {/* Header */}
      <div className="flex items-start justify-between mb-3">
        <div className="flex items-center gap-3">
          <span className="text-2xl">{request.avatar}</span>
          <div>
            <span className="text-sm font-medium">{request.requester}</span>
            <span className="text-xs text-muted-foreground ml-2">{request.createdAt}</span>
          </div>
        </div>
        <span className={cn('text-xs font-medium px-2 py-1 rounded', statusColors[request.status as keyof typeof statusColors])}>
          {statusLabels[request.status as keyof typeof statusLabels]}
        </span>
      </div>

      {/* Title & Description */}
      <h3 className="font-bold text-lg mb-2">{request.title}</h3>
      <p className="text-sm text-muted-foreground mb-4 line-clamp-2">{request.description}</p>

      {/* Progress */}
      <div className="mb-4">
        <div className="flex justify-between text-sm mb-2">
          <span className="text-muted-foreground">
            {request.backers}명 / {request.targetBackers}명 참여
          </span>
          <span className="font-bold">₩{request.currentPledge.toLocaleString()}</span>
        </div>
        <div className="h-2 bg-secondary rounded-full overflow-hidden">
          <div
            className="h-full bg-primary rounded-full transition-all"
            style={{ width: `${progress}%` }}
          />
        </div>
        <div className="flex justify-between text-xs mt-1">
          <span className="text-muted-foreground">희망가격: ₩{request.suggestedPrice.toLocaleString()}</span>
          <span className="text-muted-foreground">마감: {request.deadline}</span>
        </div>
      </div>

      {/* Actions */}
      <div className="flex items-center justify-between pt-4 border-t">
        <div className="flex items-center gap-4 text-sm text-muted-foreground">
          <div className="flex items-center gap-1">
            <ThumbsUp className="h-4 w-4" />
            <span>{request.votes}</span>
          </div>
          <div className="flex items-center gap-1">
            <MessageSquare className="h-4 w-4" />
            <span>{request.comments}</span>
          </div>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" size="sm">
            상세보기
          </Button>
          {request.status === 'open' && (
            <Button size="sm" className="btn-primary">
              후원하기
            </Button>
          )}
          {request.status === 'completed' && (
            <Button size="sm" className="btn-primary">
              구매하기
            </Button>
          )}
        </div>
      </div>
    </div>
  );
}
