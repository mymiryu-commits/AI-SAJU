'use client';

import { useState } from 'react';
import { useTranslations } from 'next-intl';
import { Link } from '@/i18n/routing';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  Users,
  Plus,
  Heart,
  Home,
  Briefcase,
  UserPlus,
  Copy,
  Star,
  Calendar,
  Gift,
  ChevronRight,
  Trash2,
  Edit,
} from 'lucide-react';

// Mock data
const groups = [
  {
    id: '1',
    name: '우리 가족',
    type: 'family',
    members: [
      { id: '1', name: '나', birthDate: '1990-05-15', relation: '본인', isOwner: true },
      { id: '2', name: '배우자', birthDate: '1992-08-22', relation: '배우자' },
      { id: '3', name: '아들', birthDate: '2018-03-10', relation: '자녀' },
      { id: '4', name: '딸', birthDate: '2020-11-05', relation: '자녀' },
    ],
    compatibility: 85,
    shareCode: 'FAM-ABC123',
    createdAt: '2024-06-15',
  },
  {
    id: '2',
    name: '직장 동료',
    type: 'team',
    members: [
      { id: '1', name: '나', birthDate: '1990-05-15', relation: '본인', isOwner: true },
      { id: '5', name: '팀장님', birthDate: '1985-02-20', relation: '동료' },
      { id: '6', name: '동기', birthDate: '1991-07-12', relation: '동료' },
    ],
    compatibility: 78,
    shareCode: 'TEAM-XYZ789',
    createdAt: '2024-09-01',
  },
];

const groupTypes = [
  { id: 'family', label: '가족', icon: Home },
  { id: 'couple', label: '연인', icon: Heart },
  { id: 'friends', label: '친구', icon: Users },
  { id: 'team', label: '팀/동료', icon: Briefcase },
];

const anniversaries = [
  { id: '1', name: '결혼기념일', date: '2016-05-20', type: 'anniversary' },
  { id: '2', name: '아들 생일', date: '2018-03-10', type: 'birthday' },
  { id: '3', name: '딸 생일', date: '2020-11-05', type: 'birthday' },
];

export default function FamilyPage() {
  const t = useTranslations();
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [newGroupName, setNewGroupName] = useState('');
  const [newGroupType, setNewGroupType] = useState('family');

  const handleCreateGroup = () => {
    console.log('Create group:', { name: newGroupName, type: newGroupType });
    setIsCreateOpen(false);
    setNewGroupName('');
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold mb-2">가족/그룹 관리</h1>
          <p className="text-muted-foreground">
            가족, 친구, 동료 그룹을 만들고 궁합을 확인하세요
          </p>
        </div>
        <Dialog open={isCreateOpen} onOpenChange={setIsCreateOpen}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="mr-2 h-4 w-4" />
              새 그룹
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>새 그룹 만들기</DialogTitle>
              <DialogDescription>
                가족, 친구, 동료 그룹을 만들어 함께 운세를 확인하세요
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-4 py-4">
              <div className="space-y-2">
                <Label>그룹 이름</Label>
                <Input
                  placeholder="예: 우리 가족"
                  value={newGroupName}
                  onChange={(e) => setNewGroupName(e.target.value)}
                />
              </div>
              <div className="space-y-2">
                <Label>그룹 유형</Label>
                <div className="grid grid-cols-4 gap-2">
                  {groupTypes.map((type) => {
                    const Icon = type.icon;
                    return (
                      <button
                        key={type.id}
                        onClick={() => setNewGroupType(type.id)}
                        className={`p-3 rounded-lg border-2 transition-all ${
                          newGroupType === type.id
                            ? 'border-primary bg-primary/5'
                            : 'border-muted hover:border-muted-foreground/20'
                        }`}
                      >
                        <Icon className={`h-5 w-5 mx-auto mb-1 ${
                          newGroupType === type.id ? 'text-primary' : 'text-muted-foreground'
                        }`} />
                        <div className="text-xs">{type.label}</div>
                      </button>
                    );
                  })}
                </div>
              </div>
            </div>
            <div className="flex justify-end gap-2">
              <Button variant="outline" onClick={() => setIsCreateOpen(false)}>
                취소
              </Button>
              <Button onClick={handleCreateGroup} disabled={!newGroupName}>
                만들기
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      {/* Groups */}
      <div className="space-y-4">
        {groups.map((group) => {
          const typeInfo = groupTypes.find((t) => t.id === group.type);
          const Icon = typeInfo?.icon || Users;

          return (
            <Card key={group.id} className="overflow-hidden">
              <CardHeader className="pb-2">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="p-2 rounded-lg bg-primary/10">
                      <Icon className="h-5 w-5 text-primary" />
                    </div>
                    <div>
                      <CardTitle className="text-lg">{group.name}</CardTitle>
                      <CardDescription>
                        {group.members.length}명 · {typeInfo?.label}
                      </CardDescription>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <Button variant="ghost" size="icon">
                      <Edit className="h-4 w-4" />
                    </Button>
                    <Button variant="ghost" size="icon" className="text-red-500">
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                {/* Members */}
                <div className="flex flex-wrap gap-2 mb-4">
                  {group.members.map((member) => (
                    <div
                      key={member.id}
                      className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-muted"
                    >
                      <div className="w-6 h-6 rounded-full bg-gradient-to-br from-purple-400 to-pink-400 flex items-center justify-center text-white text-xs">
                        {member.name.charAt(0)}
                      </div>
                      <span className="text-sm">{member.name}</span>
                      {member.isOwner && (
                        <Star className="h-3 w-3 text-yellow-500" />
                      )}
                    </div>
                  ))}
                  <button className="flex items-center gap-1 px-3 py-1.5 rounded-full border border-dashed border-muted-foreground/30 text-muted-foreground hover:border-primary hover:text-primary transition-colors">
                    <UserPlus className="h-4 w-4" />
                    <span className="text-sm">추가</span>
                  </button>
                </div>

                {/* Actions */}
                <div className="flex items-center justify-between pt-4 border-t">
                  <div className="flex items-center gap-2">
                    <Badge variant="secondary" className="gap-1">
                      <Heart className="h-3 w-3" />
                      궁합 {group.compatibility}%
                    </Badge>
                    <Button variant="ghost" size="sm" className="gap-1">
                      <Copy className="h-3 w-3" />
                      {group.shareCode}
                    </Button>
                  </div>
                  <Link href={`/fortune/group?id=${group.id}`}>
                    <Button size="sm">
                      그룹 궁합 보기
                      <ChevronRight className="ml-1 h-4 w-4" />
                    </Button>
                  </Link>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {groups.length === 0 && (
        <Card className="p-8 text-center">
          <Users className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
          <h3 className="font-semibold mb-2">아직 그룹이 없습니다</h3>
          <p className="text-muted-foreground mb-4">
            가족, 친구, 동료 그룹을 만들어 함께 운세를 확인하세요
          </p>
          <Button onClick={() => setIsCreateOpen(true)}>
            <Plus className="mr-2 h-4 w-4" />
            첫 그룹 만들기
          </Button>
        </Card>
      )}

      {/* Anniversary Calendar */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="flex items-center gap-2">
              <Calendar className="h-5 w-5 text-primary" />
              가족 기념일
            </CardTitle>
            <Button variant="outline" size="sm">
              <Plus className="mr-1 h-4 w-4" />
              추가
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {anniversaries.map((event) => {
              const eventDate = new Date(event.date);
              const today = new Date();
              const thisYear = new Date(today.getFullYear(), eventDate.getMonth(), eventDate.getDate());
              if (thisYear < today) {
                thisYear.setFullYear(thisYear.getFullYear() + 1);
              }
              const daysUntil = Math.ceil((thisYear.getTime() - today.getTime()) / (1000 * 60 * 60 * 24));

              return (
                <div
                  key={event.id}
                  className="flex items-center justify-between p-3 rounded-lg bg-muted/50"
                >
                  <div className="flex items-center gap-3">
                    <div className={`p-2 rounded-lg ${
                      event.type === 'birthday' ? 'bg-pink-100 text-pink-600' : 'bg-purple-100 text-purple-600'
                    }`}>
                      {event.type === 'birthday' ? (
                        <Gift className="h-5 w-5" />
                      ) : (
                        <Heart className="h-5 w-5" />
                      )}
                    </div>
                    <div>
                      <div className="font-medium">{event.name}</div>
                      <div className="text-sm text-muted-foreground">
                        {eventDate.getMonth() + 1}월 {eventDate.getDate()}일
                      </div>
                    </div>
                  </div>
                  <Badge variant={daysUntil <= 7 ? 'default' : 'secondary'}>
                    {daysUntil === 0 ? '오늘!' : `D-${daysUntil}`}
                  </Badge>
                </div>
              );
            })}
          </div>
        </CardContent>
      </Card>

      {/* Invite Link */}
      <Card className="bg-gradient-to-r from-blue-50 to-purple-50 dark:from-blue-950/20 dark:to-purple-950/20 border-blue-200">
        <CardContent className="p-6">
          <div className="flex items-center gap-4">
            <div className="p-3 rounded-full bg-blue-500 text-white">
              <UserPlus className="h-6 w-6" />
            </div>
            <div className="flex-1">
              <h3 className="font-semibold">가족/친구 초대하기</h3>
              <p className="text-sm text-muted-foreground">
                초대 링크를 공유하면 자동으로 그룹에 참여됩니다
              </p>
            </div>
            <Button>
              초대 링크 복사
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
