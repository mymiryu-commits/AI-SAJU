'use client';

import { useState, useEffect } from 'react';
import { useTranslations } from 'next-intl';
import { Link } from '@/i18n/routing';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Checkbox } from '@/components/ui/checkbox';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter,
} from '@/components/ui/dialog';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';
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
  Loader2,
  AlertCircle,
  Check,
  User,
} from 'lucide-react';
import { useAuth } from '@/lib/hooks/useAuth';
import { useToast } from '@/hooks/use-toast';

interface GroupMember {
  id: string;
  name: string;
  nickname?: string;
  birthDate: string;
  birthTime?: string;
  gender: string;
  relation: string;
  isOwner?: boolean;
}

interface Group {
  id: string;
  name: string;
  type: string;
  members: GroupMember[];
  compatibility?: number | null;
  shareCode: string;
  isPublic: boolean;
  createdAt: string;
  updatedAt?: string;
}

interface Profile {
  id: string;
  name: string;
  nickname?: string;
  birthDate: string;
  birthTime?: string;
  gender: string;
  relationType: string;
  isFavorite: boolean;
  bloodType?: string;
  mbti?: string;
}

const groupTypes = [
  { id: 'family', label: '가족', icon: Home },
  { id: 'couple', label: '연인', icon: Heart },
  { id: 'friends', label: '친구', icon: Users },
  { id: 'team', label: '팀/동료', icon: Briefcase },
];

const typeColors: Record<string, string> = {
  family: 'bg-purple-100 text-purple-600 dark:bg-purple-900/30',
  couple: 'bg-pink-100 text-pink-600 dark:bg-pink-900/30',
  friends: 'bg-blue-100 text-blue-600 dark:bg-blue-900/30',
  team: 'bg-green-100 text-green-600 dark:bg-green-900/30',
};

export default function FamilyPage() {
  const t = useTranslations();
  const { user, isLoading: authLoading } = useAuth();
  const { toast } = useToast();

  const [groups, setGroups] = useState<Group[]>([]);
  const [profiles, setProfiles] = useState<Profile[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Create dialog state
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [newGroupName, setNewGroupName] = useState('');
  const [newGroupType, setNewGroupType] = useState('family');
  const [selectedProfileIds, setSelectedProfileIds] = useState<string[]>([]);
  const [isCreating, setIsCreating] = useState(false);

  // Edit dialog state
  const [editGroup, setEditGroup] = useState<Group | null>(null);
  const [editName, setEditName] = useState('');
  const [isEditing, setIsEditing] = useState(false);

  // Delete dialog state
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);

  // Add member dialog
  const [addMemberGroupId, setAddMemberGroupId] = useState<string | null>(null);
  const [addMemberProfileIds, setAddMemberProfileIds] = useState<string[]>([]);

  // 데이터 로딩
  useEffect(() => {
    if (!authLoading && user) {
      fetchData();
    } else if (!authLoading && !user) {
      setIsLoading(false);
    }
  }, [user, authLoading]);

  const fetchData = async () => {
    try {
      setIsLoading(true);
      setError(null);

      const response = await fetch('/api/my/family');
      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || '데이터를 불러오는데 실패했습니다.');
      }

      setGroups(data.groups || []);
      setProfiles(data.profiles || []);
    } catch (err) {
      console.error('Fetch family error:', err);
      setError(err instanceof Error ? err.message : '오류가 발생했습니다.');
    } finally {
      setIsLoading(false);
    }
  };

  // 그룹 생성
  const handleCreateGroup = async () => {
    if (!newGroupName.trim()) {
      toast({ title: '그룹 이름을 입력해주세요', variant: 'destructive' });
      return;
    }

    try {
      setIsCreating(true);

      const response = await fetch('/api/my/family', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: newGroupName,
          type: newGroupType,
          profileIds: selectedProfileIds,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || '그룹 생성에 실패했습니다.');
      }

      setGroups([data.group, ...groups]);
      setIsCreateOpen(false);
      setNewGroupName('');
      setSelectedProfileIds([]);
      toast({ title: '그룹이 생성되었습니다' });
    } catch (err) {
      console.error('Create group error:', err);
      toast({
        title: err instanceof Error ? err.message : '오류가 발생했습니다.',
        variant: 'destructive',
      });
    } finally {
      setIsCreating(false);
    }
  };

  // 그룹 수정
  const handleEditGroup = async () => {
    if (!editGroup || !editName.trim()) return;

    try {
      setIsEditing(true);

      const response = await fetch('/api/my/family', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          id: editGroup.id,
          name: editName,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || '그룹 수정에 실패했습니다.');
      }

      setGroups(groups.map(g => g.id === editGroup.id ? data.group : g));
      setEditGroup(null);
      toast({ title: '그룹이 수정되었습니다' });
    } catch (err) {
      console.error('Edit group error:', err);
      toast({
        title: err instanceof Error ? err.message : '오류가 발생했습니다.',
        variant: 'destructive',
      });
    } finally {
      setIsEditing(false);
    }
  };

  // 그룹 삭제
  const handleDeleteGroup = async () => {
    if (!deleteId) return;

    try {
      setIsDeleting(true);

      const response = await fetch(`/api/my/family?id=${deleteId}`, {
        method: 'DELETE',
      });

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.error || '그룹 삭제에 실패했습니다.');
      }

      setGroups(groups.filter(g => g.id !== deleteId));
      setDeleteId(null);
      toast({ title: '그룹이 삭제되었습니다' });
    } catch (err) {
      console.error('Delete group error:', err);
      toast({
        title: err instanceof Error ? err.message : '오류가 발생했습니다.',
        variant: 'destructive',
      });
    } finally {
      setIsDeleting(false);
    }
  };

  // 멤버 추가
  const handleAddMembers = async () => {
    if (!addMemberGroupId || addMemberProfileIds.length === 0) return;

    try {
      const response = await fetch('/api/my/family', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          id: addMemberGroupId,
          addProfileIds: addMemberProfileIds,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || '멤버 추가에 실패했습니다.');
      }

      setGroups(groups.map(g => g.id === addMemberGroupId ? data.group : g));
      setAddMemberGroupId(null);
      setAddMemberProfileIds([]);
      toast({ title: '멤버가 추가되었습니다' });
    } catch (err) {
      console.error('Add member error:', err);
      toast({
        title: err instanceof Error ? err.message : '오류가 발생했습니다.',
        variant: 'destructive',
      });
    }
  };

  // 멤버 제거
  const handleRemoveMember = async (groupId: string, memberId: string) => {
    try {
      const response = await fetch('/api/my/family', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          id: groupId,
          removeMemberIds: [memberId],
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || '멤버 제거에 실패했습니다.');
      }

      setGroups(groups.map(g => g.id === groupId ? data.group : g));
      toast({ title: '멤버가 제거되었습니다' });
    } catch (err) {
      console.error('Remove member error:', err);
      toast({
        title: err instanceof Error ? err.message : '오류가 발생했습니다.',
        variant: 'destructive',
      });
    }
  };

  // 공유 코드 복사
  const handleCopyCode = async (code: string) => {
    try {
      await navigator.clipboard.writeText(code);
      toast({ title: '공유 코드가 복사되었습니다' });
    } catch {
      toast({ title: '복사에 실패했습니다', variant: 'destructive' });
    }
  };

  // 프로필 선택 토글
  const toggleProfileSelection = (profileId: string, currentList: string[], setList: (ids: string[]) => void) => {
    if (currentList.includes(profileId)) {
      setList(currentList.filter(id => id !== profileId));
    } else {
      setList([...currentList, profileId]);
    }
  };

  // 현재 그룹에 없는 프로필만 필터링
  const getAvailableProfiles = (group?: Group) => {
    if (!group) return profiles;
    const memberIds = new Set(group.members.map(m => m.id));
    return profiles.filter(p => !memberIds.has(p.id));
  };

  // 로그인 필요 화면
  if (!authLoading && !user) {
    return (
      <div className="space-y-6">
        <Card className="p-8 text-center">
          <AlertCircle className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
          <h3 className="font-semibold mb-2">로그인이 필요합니다</h3>
          <p className="text-muted-foreground mb-4">
            가족/그룹 관리를 이용하려면 로그인해주세요
          </p>
          <Link href="/auth/login">
            <Button>로그인하기</Button>
          </Link>
        </Card>
      </div>
    );
  }

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
          <DialogContent className="max-w-md">
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

              {/* 프로필 자동 불러오기 */}
              {profiles.length > 0 && (
                <div className="space-y-2">
                  <Label>저장된 프로필에서 불러오기</Label>
                  <div className="max-h-40 overflow-y-auto space-y-2 border rounded-lg p-2">
                    {profiles.map((profile) => (
                      <div
                        key={profile.id}
                        className={`flex items-center gap-3 p-2 rounded-lg cursor-pointer transition-colors ${
                          selectedProfileIds.includes(profile.id)
                            ? 'bg-primary/10 border border-primary'
                            : 'bg-muted/50 hover:bg-muted'
                        }`}
                        onClick={() => toggleProfileSelection(profile.id, selectedProfileIds, setSelectedProfileIds)}
                      >
                        <div className="w-8 h-8 rounded-full bg-gradient-to-br from-purple-400 to-pink-400 flex items-center justify-center text-white text-sm">
                          {profile.name.charAt(0)}
                        </div>
                        <div className="flex-1">
                          <div className="font-medium text-sm">{profile.nickname || profile.name}</div>
                          <div className="text-xs text-muted-foreground">{profile.name}</div>
                        </div>
                        {selectedProfileIds.includes(profile.id) && (
                          <Check className="h-4 w-4 text-primary" />
                        )}
                      </div>
                    ))}
                  </div>
                  <p className="text-xs text-muted-foreground">
                    {selectedProfileIds.length}명 선택됨
                  </p>
                </div>
              )}
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setIsCreateOpen(false)}>
                취소
              </Button>
              <Button onClick={handleCreateGroup} disabled={!newGroupName || isCreating}>
                {isCreating ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    생성 중...
                  </>
                ) : (
                  '만들기'
                )}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>

      {/* Loading State */}
      {isLoading && (
        <Card className="p-8 text-center">
          <Loader2 className="h-8 w-8 mx-auto mb-4 animate-spin text-primary" />
          <p className="text-muted-foreground">데이터를 불러오는 중...</p>
        </Card>
      )}

      {/* Error State */}
      {error && (
        <Card className="p-8 text-center border-red-200 bg-red-50 dark:bg-red-950/20">
          <AlertCircle className="h-12 w-12 mx-auto mb-4 text-red-500" />
          <h3 className="font-semibold mb-2 text-red-700 dark:text-red-400">{error}</h3>
          <Button variant="outline" onClick={fetchData}>
            다시 시도
          </Button>
        </Card>
      )}

      {/* Groups */}
      {!isLoading && !error && (
        <>
          <div className="space-y-4">
            {groups.map((group) => {
              const typeInfo = groupTypes.find((t) => t.id === group.type);
              const Icon = typeInfo?.icon || Users;
              const colorClass = typeColors[group.type] || '';

              return (
                <Card key={group.id} className="overflow-hidden">
                  <CardHeader className="pb-2">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div className={`p-2 rounded-lg ${colorClass}`}>
                          <Icon className="h-5 w-5" />
                        </div>
                        <div>
                          <CardTitle className="text-lg">{group.name}</CardTitle>
                          <CardDescription>
                            {group.members.length}명 · {typeInfo?.label}
                          </CardDescription>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => {
                            setEditGroup(group);
                            setEditName(group.name);
                          }}
                        >
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="icon"
                          className="text-red-500"
                          onClick={() => setDeleteId(group.id)}
                        >
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
                          className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-muted group"
                        >
                          <div className="w-6 h-6 rounded-full bg-gradient-to-br from-purple-400 to-pink-400 flex items-center justify-center text-white text-xs">
                            {member.name.charAt(0)}
                          </div>
                          <span className="text-sm">{member.nickname || member.name}</span>
                          {member.isOwner && (
                            <Star className="h-3 w-3 text-yellow-500" />
                          )}
                          {!member.isOwner && (
                            <button
                              onClick={() => handleRemoveMember(group.id, member.id)}
                              className="opacity-0 group-hover:opacity-100 transition-opacity text-red-500 hover:text-red-600"
                            >
                              <Trash2 className="h-3 w-3" />
                            </button>
                          )}
                        </div>
                      ))}
                      <button
                        onClick={() => setAddMemberGroupId(group.id)}
                        className="flex items-center gap-1 px-3 py-1.5 rounded-full border border-dashed border-muted-foreground/30 text-muted-foreground hover:border-primary hover:text-primary transition-colors"
                      >
                        <UserPlus className="h-4 w-4" />
                        <span className="text-sm">추가</span>
                      </button>
                    </div>

                    {/* Actions */}
                    <div className="flex items-center justify-between pt-4 border-t">
                      <div className="flex items-center gap-2">
                        {group.compatibility && (
                          <Badge variant="secondary" className="gap-1">
                            <Heart className="h-3 w-3" />
                            궁합 {group.compatibility}%
                          </Badge>
                        )}
                        <Button
                          variant="ghost"
                          size="sm"
                          className="gap-1"
                          onClick={() => handleCopyCode(group.shareCode)}
                        >
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

          {/* Profile Notice */}
          {profiles.length === 0 && (
            <Card className="bg-blue-50 dark:bg-blue-950/20 border-blue-200">
              <CardContent className="p-4">
                <div className="flex items-start gap-3">
                  <User className="h-5 w-5 text-blue-600 mt-0.5" />
                  <div className="flex-1">
                    <h4 className="font-medium text-blue-800 dark:text-blue-200">프로필 저장 안내</h4>
                    <p className="text-sm text-blue-700 dark:text-blue-300 mb-2">
                      사주 분석 시 프로필을 저장하면 그룹 생성 시 자동으로 불러올 수 있습니다.
                    </p>
                    <Link href="/fortune/saju">
                      <Button size="sm" variant="outline">
                        사주 분석하기
                        <ChevronRight className="ml-1 h-4 w-4" />
                      </Button>
                    </Link>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}

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
                <Button onClick={() => {
                  const link = `${window.location.origin}/invite`;
                  navigator.clipboard.writeText(link);
                  toast({ title: '초대 링크가 복사되었습니다' });
                }}>
                  초대 링크 복사
                </Button>
              </div>
            </CardContent>
          </Card>
        </>
      )}

      {/* Edit Group Dialog */}
      <Dialog open={!!editGroup} onOpenChange={() => setEditGroup(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>그룹 수정</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label>그룹 이름</Label>
              <Input
                value={editName}
                onChange={(e) => setEditName(e.target.value)}
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setEditGroup(null)}>
              취소
            </Button>
            <Button onClick={handleEditGroup} disabled={isEditing}>
              {isEditing ? <Loader2 className="h-4 w-4 animate-spin" /> : '저장'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Add Member Dialog */}
      <Dialog open={!!addMemberGroupId} onOpenChange={() => {
        setAddMemberGroupId(null);
        setAddMemberProfileIds([]);
      }}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>멤버 추가</DialogTitle>
            <DialogDescription>
              저장된 프로필에서 멤버를 추가하세요
            </DialogDescription>
          </DialogHeader>
          <div className="py-4">
            {getAvailableProfiles(groups.find(g => g.id === addMemberGroupId)).length > 0 ? (
              <div className="space-y-2 max-h-60 overflow-y-auto">
                {getAvailableProfiles(groups.find(g => g.id === addMemberGroupId)).map((profile) => (
                  <div
                    key={profile.id}
                    className={`flex items-center gap-3 p-3 rounded-lg cursor-pointer transition-colors ${
                      addMemberProfileIds.includes(profile.id)
                        ? 'bg-primary/10 border border-primary'
                        : 'bg-muted/50 hover:bg-muted'
                    }`}
                    onClick={() => toggleProfileSelection(profile.id, addMemberProfileIds, setAddMemberProfileIds)}
                  >
                    <div className="w-10 h-10 rounded-full bg-gradient-to-br from-purple-400 to-pink-400 flex items-center justify-center text-white">
                      {profile.name.charAt(0)}
                    </div>
                    <div className="flex-1">
                      <div className="font-medium">{profile.nickname || profile.name}</div>
                      <div className="text-sm text-muted-foreground">
                        {profile.birthDate && new Date(profile.birthDate).toLocaleDateString('ko-KR')}
                      </div>
                    </div>
                    {addMemberProfileIds.includes(profile.id) && (
                      <Check className="h-5 w-5 text-primary" />
                    )}
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-8 text-muted-foreground">
                <User className="h-12 w-12 mx-auto mb-4 opacity-50" />
                <p>추가할 수 있는 프로필이 없습니다</p>
                <Link href="/fortune/saju">
                  <Button variant="link" className="mt-2">
                    새 프로필 만들기
                  </Button>
                </Link>
              </div>
            )}
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => {
              setAddMemberGroupId(null);
              setAddMemberProfileIds([]);
            }}>
              취소
            </Button>
            <Button
              onClick={handleAddMembers}
              disabled={addMemberProfileIds.length === 0}
            >
              {addMemberProfileIds.length}명 추가
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation Dialog */}
      <AlertDialog open={!!deleteId} onOpenChange={() => setDeleteId(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>그룹을 삭제하시겠습니까?</AlertDialogTitle>
            <AlertDialogDescription>
              이 작업은 되돌릴 수 없습니다. 그룹과 관련된 모든 데이터가 삭제됩니다.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={isDeleting}>취소</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDeleteGroup}
              disabled={isDeleting}
              className="bg-red-500 hover:bg-red-600"
            >
              {isDeleting ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  삭제 중...
                </>
              ) : (
                '삭제'
              )}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
