'use client';

import { useState } from 'react';
import { useTranslations } from 'next-intl';
import { Link } from '@/i18n/routing';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  Star,
  Search,
  MessageCircle,
  Phone,
  Video,
  Clock,
  Users,
  Award,
  Filter,
  ChevronRight,
  Heart,
} from 'lucide-react';

const SPECIALTIES = [
  { id: 'all', label: '전체' },
  { id: 'saju', label: '사주/명리' },
  { id: 'tarot', label: '타로' },
  { id: 'shaman', label: '신점' },
  { id: 'astrology', label: '점성술' },
  { id: 'healing', label: '힐링/상담' },
];

const EXPERTS = [
  {
    id: '1',
    name: '청담 선생',
    title: '사주명리 전문가',
    image: '/experts/expert1.jpg',
    specialties: ['saju', 'tarot'],
    rating: 4.9,
    reviewCount: 1247,
    consultationCount: 3520,
    experience: 25,
    level: 'master',
    bio: '25년 경력의 명리학 전문가입니다. 정확한 분석과 따뜻한 조언으로 많은 분들께 도움을 드리고 있습니다.',
    languages: ['ko'],
    rates: {
      chat: { krw: 3000, perMinute: true },
      call: { krw: 5000, perMinute: true },
      video: { krw: 8000, perMinute: true },
    },
    isOnline: true,
    isFavorite: false,
    badges: ['인기', '빠른응답'],
  },
  {
    id: '2',
    name: '운명의별',
    title: '타로/점성술 마스터',
    image: '/experts/expert2.jpg',
    specialties: ['tarot', 'astrology'],
    rating: 4.8,
    reviewCount: 892,
    consultationCount: 2180,
    experience: 15,
    level: 'popular',
    bio: '타로와 점성술을 통해 여러분의 미래를 함께 읽어드립니다. 연애, 직장, 재물 문제 모두 상담 가능합니다.',
    languages: ['ko', 'en'],
    rates: {
      chat: { krw: 2500, perMinute: true },
      call: { krw: 4000, perMinute: true },
      video: { krw: 6000, perMinute: true },
    },
    isOnline: true,
    isFavorite: true,
    badges: ['추천'],
  },
  {
    id: '3',
    name: '혜안',
    title: '신점/무속인',
    image: '/experts/expert3.jpg',
    specialties: ['shaman'],
    rating: 4.7,
    reviewCount: 567,
    consultationCount: 1890,
    experience: 30,
    level: 'master',
    bio: '30년간 많은 분들의 고민을 해결해드렸습니다. 신명을 통한 정확한 조언을 드립니다.',
    languages: ['ko'],
    rates: {
      chat: { krw: 4000, perMinute: true },
      call: { krw: 6000, perMinute: true },
    },
    isOnline: false,
    isFavorite: false,
    badges: ['경력30년'],
  },
  {
    id: '4',
    name: 'Luna',
    title: '힐링 상담사',
    image: '/experts/expert4.jpg',
    specialties: ['healing', 'tarot'],
    rating: 4.9,
    reviewCount: 423,
    consultationCount: 980,
    experience: 8,
    level: 'regular',
    bio: '마음의 상처를 치유하고 앞으로 나아갈 힘을 드립니다. 영어 상담도 가능합니다.',
    languages: ['ko', 'en', 'ja'],
    rates: {
      chat: { krw: 2000, perMinute: true },
      call: { krw: 3500, perMinute: true },
      video: { krw: 5000, perMinute: true },
    },
    isOnline: true,
    isFavorite: false,
    badges: ['다국어'],
  },
  {
    id: '5',
    name: '도원 선생',
    title: '사주/관상 전문',
    image: '/experts/expert5.jpg',
    specialties: ['saju'],
    rating: 4.6,
    reviewCount: 789,
    consultationCount: 2450,
    experience: 20,
    level: 'popular',
    bio: '사주와 관상을 함께 보아 더욱 정확한 분석을 해드립니다. 사업, 투자 상담 전문입니다.',
    languages: ['ko'],
    rates: {
      chat: { krw: 3500, perMinute: true },
      call: { krw: 5500, perMinute: true },
    },
    isOnline: false,
    isFavorite: false,
    badges: ['사업전문'],
  },
];

const LEVEL_BADGES: Record<string, { label: string; color: string }> = {
  new: { label: '신규', color: 'bg-green-500' },
  regular: { label: '정규', color: 'bg-blue-500' },
  popular: { label: '인기', color: 'bg-purple-500' },
  master: { label: '마스터', color: 'bg-yellow-500' },
};

export default function ExpertsPage() {
  const t = useTranslations('fortune');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedSpecialty, setSelectedSpecialty] = useState('all');
  const [sortBy, setSortBy] = useState('rating');

  const filteredExperts = EXPERTS.filter((expert) => {
    const matchesSearch = expert.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      expert.title.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesSpecialty = selectedSpecialty === 'all' ||
      expert.specialties.includes(selectedSpecialty);
    return matchesSearch && matchesSpecialty;
  }).sort((a, b) => {
    switch (sortBy) {
      case 'rating':
        return b.rating - a.rating;
      case 'reviews':
        return b.reviewCount - a.reviewCount;
      case 'price_low':
        return a.rates.chat.krw - b.rates.chat.krw;
      case 'price_high':
        return b.rates.chat.krw - a.rates.chat.krw;
      default:
        return 0;
    }
  });

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Header */}
      <div className="text-center mb-8">
        <Badge className="mb-4" variant="secondary">
          <Users className="mr-1 h-3 w-3" />
          전문가 상담
        </Badge>
        <h1 className="text-3xl md:text-4xl font-bold mb-4">운세 전문가 상담</h1>
        <p className="text-muted-foreground max-w-2xl mx-auto">
          검증된 전문가들과 1:1 상담을 통해 더 깊은 조언을 받아보세요.
          채팅, 전화, 영상 상담이 가능합니다.
        </p>
      </div>

      {/* Filters */}
      <div className="mb-8 space-y-4">
        <div className="flex flex-col md:flex-row gap-4">
          {/* Search */}
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-5 w-5" />
            <Input
              placeholder="전문가 검색..."
              className="pl-10"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>

          {/* Specialty Filter */}
          <Select value={selectedSpecialty} onValueChange={setSelectedSpecialty}>
            <SelectTrigger className="w-full md:w-[180px]">
              <Filter className="mr-2 h-4 w-4" />
              <SelectValue placeholder="분야 선택" />
            </SelectTrigger>
            <SelectContent>
              {SPECIALTIES.map((specialty) => (
                <SelectItem key={specialty.id} value={specialty.id}>
                  {specialty.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          {/* Sort */}
          <Select value={sortBy} onValueChange={setSortBy}>
            <SelectTrigger className="w-full md:w-[180px]">
              <SelectValue placeholder="정렬" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="rating">평점순</SelectItem>
              <SelectItem value="reviews">리뷰순</SelectItem>
              <SelectItem value="price_low">가격 낮은순</SelectItem>
              <SelectItem value="price_high">가격 높은순</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Specialty Tabs */}
        <div className="flex flex-wrap gap-2">
          {SPECIALTIES.map((specialty) => (
            <Button
              key={specialty.id}
              variant={selectedSpecialty === specialty.id ? 'default' : 'outline'}
              size="sm"
              onClick={() => setSelectedSpecialty(specialty.id)}
            >
              {specialty.label}
            </Button>
          ))}
        </div>
      </div>

      {/* Experts Grid */}
      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredExperts.map((expert) => {
          const levelBadge = LEVEL_BADGES[expert.level];
          return (
            <Card key={expert.id} className="overflow-hidden hover:shadow-lg transition-shadow">
              <CardContent className="p-0">
                {/* Profile Header */}
                <div className="relative p-4 pb-0">
                  <div className="flex gap-4">
                    {/* Avatar */}
                    <div className="relative">
                      <div className="w-20 h-20 rounded-full bg-gradient-to-br from-purple-400 to-pink-400 flex items-center justify-center text-white text-2xl font-bold">
                        {expert.name.charAt(0)}
                      </div>
                      {expert.isOnline && (
                        <div className="absolute bottom-0 right-0 w-5 h-5 bg-green-500 rounded-full border-2 border-white" />
                      )}
                    </div>

                    {/* Info */}
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <h3 className="font-bold text-lg">{expert.name}</h3>
                        <Badge className={levelBadge.color}>{levelBadge.label}</Badge>
                      </div>
                      <p className="text-sm text-muted-foreground mb-2">{expert.title}</p>
                      <div className="flex items-center gap-2 text-sm">
                        <Star className="h-4 w-4 text-yellow-400 fill-yellow-400" />
                        <span className="font-medium">{expert.rating}</span>
                        <span className="text-muted-foreground">({expert.reviewCount})</span>
                      </div>
                    </div>

                    {/* Favorite */}
                    <button className="absolute top-4 right-4">
                      <Heart
                        className={`h-5 w-5 ${
                          expert.isFavorite
                            ? 'text-red-500 fill-red-500'
                            : 'text-muted-foreground'
                        }`}
                      />
                    </button>
                  </div>

                  {/* Badges */}
                  <div className="flex flex-wrap gap-1 mt-3">
                    {expert.badges.map((badge) => (
                      <Badge key={badge} variant="secondary" className="text-xs">
                        {badge}
                      </Badge>
                    ))}
                  </div>
                </div>

                {/* Bio */}
                <div className="p-4 pt-2">
                  <p className="text-sm text-muted-foreground line-clamp-2">{expert.bio}</p>
                </div>

                {/* Stats */}
                <div className="grid grid-cols-3 border-t border-b">
                  <div className="p-3 text-center border-r">
                    <div className="text-lg font-bold">{expert.consultationCount.toLocaleString()}</div>
                    <div className="text-xs text-muted-foreground">상담 수</div>
                  </div>
                  <div className="p-3 text-center border-r">
                    <div className="text-lg font-bold">{expert.experience}년</div>
                    <div className="text-xs text-muted-foreground">경력</div>
                  </div>
                  <div className="p-3 text-center">
                    <div className="text-lg font-bold">{(expert.rating * 20).toFixed(0)}%</div>
                    <div className="text-xs text-muted-foreground">만족도</div>
                  </div>
                </div>

                {/* Rates */}
                <div className="p-4 bg-muted/30">
                  <div className="flex items-center gap-4 text-sm mb-3">
                    <div className="flex items-center gap-1">
                      <MessageCircle className="h-4 w-4 text-blue-500" />
                      <span>₩{expert.rates.chat.krw.toLocaleString()}/분</span>
                    </div>
                    {expert.rates.call && (
                      <div className="flex items-center gap-1">
                        <Phone className="h-4 w-4 text-green-500" />
                        <span>₩{expert.rates.call.krw.toLocaleString()}/분</span>
                      </div>
                    )}
                    {expert.rates.video && (
                      <div className="flex items-center gap-1">
                        <Video className="h-4 w-4 text-purple-500" />
                        <span>₩{expert.rates.video.krw.toLocaleString()}/분</span>
                      </div>
                    )}
                  </div>

                  <Link href={`/fortune/experts/${expert.id}`}>
                    <Button className="w-full" disabled={!expert.isOnline}>
                      {expert.isOnline ? (
                        <>
                          상담 시작하기
                          <ChevronRight className="ml-2 h-4 w-4" />
                        </>
                      ) : (
                        <>
                          <Clock className="mr-2 h-4 w-4" />
                          현재 오프라인
                        </>
                      )}
                    </Button>
                  </Link>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {filteredExperts.length === 0 && (
        <div className="text-center py-12">
          <p className="text-muted-foreground">조건에 맞는 전문가가 없습니다.</p>
        </div>
      )}

      {/* CTA */}
      <Card className="mt-12 bg-gradient-to-r from-purple-50 to-pink-50 dark:from-purple-950/20 dark:to-pink-950/20 border-purple-200">
        <CardContent className="p-8 text-center">
          <Award className="h-12 w-12 mx-auto mb-4 text-purple-500" />
          <h3 className="text-xl font-bold mb-2">전문가로 등록하고 싶으신가요?</h3>
          <p className="text-muted-foreground mb-4">
            검증된 전문가라면 AI RANK에서 상담 서비스를 제공할 수 있습니다.
          </p>
          <Button variant="outline">
            전문가 등록 신청
            <ChevronRight className="ml-2 h-4 w-4" />
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}
