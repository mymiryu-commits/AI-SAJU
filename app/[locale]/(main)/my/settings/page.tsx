'use client';

import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Switch } from '@/components/ui/switch';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
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
  User,
  Bell,
  Globe,
  Shield,
  LogOut,
  Save,
  Trash2,
  Loader2,
  AlertCircle,
  Check,
  Settings2,
} from 'lucide-react';
import { Link } from '@/i18n/routing';
import { useAuth } from '@/lib/hooks/useAuth';
import { useToast } from '@/hooks/use-toast';
import { createClient } from '@/lib/supabase/client';
import HeroImageSettings from '@/components/admin/HeroImageSettings';
import type { Database } from '@/types/database';

type UsersRow = Database['public']['Tables']['users']['Row'];

interface ProfileData {
  name: string;
  email: string;
  phone: string;
  birthDate: string;
  birthTime: string;
  gender: string;
  locale: string;
  timezone: string;
}

interface NotificationSettings {
  dailyFortunePush: boolean;
  dailyFortuneTime: string;
  marketingEmail: boolean;
  marketingPush: boolean;
}

export default function SettingsPage() {
  const { user, isLoading: authLoading } = useAuth();
  const { toast } = useToast();

  const [profile, setProfile] = useState<ProfileData>({
    name: '',
    email: '',
    phone: '',
    birthDate: '',
    birthTime: '',
    gender: 'male',
    locale: 'ko',
    timezone: 'Asia/Seoul',
  });

  const [notifications, setNotifications] = useState<NotificationSettings>({
    dailyFortunePush: true,
    dailyFortuneTime: '07:00',
    marketingEmail: true,
    marketingPush: false,
  });

  const [isLoading, setIsLoading] = useState(true);
  const [isSavingProfile, setIsSavingProfile] = useState(false);
  const [isSavingNotifications, setIsSavingNotifications] = useState(false);
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Admin 상태
  const [isAdmin, setIsAdmin] = useState(false);
  const [checkingAdmin, setCheckingAdmin] = useState(true);

  // 데이터 로딩
  useEffect(() => {
    if (!authLoading && user) {
      fetchSettings();
      checkAdminStatus();
    } else if (!authLoading && !user) {
      setIsLoading(false);
      setCheckingAdmin(false);
    }
  }, [user, authLoading]);

  const checkAdminStatus = async () => {
    try {
      const supabase = createClient();
      const { data: { user: authUser } } = await supabase.auth.getUser();

      if (authUser) {
        // 환경변수 + 하드코딩된 fallback admin 이메일
        const envEmails = process.env.NEXT_PUBLIC_ADMIN_EMAILS?.split(',') || [];
        const fallbackEmails = ['mymiryu@gmail.com']; // 하드코딩 fallback
        const adminEmails = [...new Set([...envEmails, ...fallbackEmails])];

        console.log('Admin check:', {
          userEmail: authUser.email,
          adminEmails,
          envValue: process.env.NEXT_PUBLIC_ADMIN_EMAILS
        });

        // 이메일로 admin 체크
        if (authUser.email && adminEmails.includes(authUser.email)) {
          console.log('Admin confirmed by email');
          setIsAdmin(true);
          return;
        }

        // users 테이블이 있으면 membership_tier 체크
        try {
          const { data: userData } = await supabase
            .from('users')
            .select('membership_tier')
            .eq('id', authUser.id)
            .single<Pick<UsersRow, 'membership_tier'>>();

          setIsAdmin(userData?.membership_tier === 'admin');
        } catch {
          // users 테이블이 없으면 이메일로만 체크
          setIsAdmin(false);
        }
      }
    } catch (error) {
      console.error('Error checking admin status:', error);
    } finally {
      setCheckingAdmin(false);
    }
  };

  const fetchSettings = async () => {
    try {
      setIsLoading(true);
      setError(null);

      const response = await fetch('/api/my/settings');
      const data = await response.json();

      if (response.ok) {
        if (data.profile) {
          setProfile(prev => ({ ...prev, ...data.profile }));
        }
        if (data.notifications) {
          setNotifications(prev => ({ ...prev, ...data.notifications }));
        }
      }
    } catch (err) {
      console.error('Fetch settings error:', err);
      setError('설정을 불러오는데 실패했습니다.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleProfileChange = (name: string, value: string) => {
    setProfile((prev) => ({ ...prev, [name]: value }));
  };

  const handleNotificationChange = (name: string, value: boolean | string) => {
    setNotifications((prev) => ({ ...prev, [name]: value }));
  };

  const handleSaveProfile = async () => {
    try {
      setIsSavingProfile(true);

      const response = await fetch('/api/my/settings', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ profile }),
      });

      if (response.ok) {
        toast({ title: '프로필이 저장되었습니다' });
      } else {
        throw new Error('저장 실패');
      }
    } catch (err) {
      toast({ title: '저장 중 오류가 발생했습니다', variant: 'destructive' });
    } finally {
      setIsSavingProfile(false);
    }
  };

  const handleSaveNotifications = async () => {
    try {
      setIsSavingNotifications(true);

      const response = await fetch('/api/my/settings', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ notifications }),
      });

      if (response.ok) {
        toast({ title: '알림 설정이 저장되었습니다' });
      } else {
        throw new Error('저장 실패');
      }
    } catch (err) {
      toast({ title: '저장 중 오류가 발생했습니다', variant: 'destructive' });
    } finally {
      setIsSavingNotifications(false);
    }
  };

  const handleDeleteAccount = async () => {
    try {
      setIsDeleting(true);

      const response = await fetch('/api/my/account', {
        method: 'DELETE',
      });

      if (response.ok) {
        toast({ title: '계정이 삭제되었습니다' });
        window.location.href = '/';
      } else {
        throw new Error('삭제 실패');
      }
    } catch (err) {
      toast({ title: '계정 삭제 중 오류가 발생했습니다', variant: 'destructive' });
    } finally {
      setIsDeleting(false);
      setShowDeleteDialog(false);
    }
  };

  // 로그인 필요 화면
  if (!authLoading && !user) {
    return (
      <div className="space-y-6">
        <Card className="p-8 text-center">
          <AlertCircle className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
          <h3 className="font-semibold mb-2">로그인이 필요합니다</h3>
          <p className="text-muted-foreground mb-4">
            설정을 변경하려면 로그인해주세요
          </p>
          <Link href="/auth/login">
            <Button>로그인하기</Button>
          </Link>
        </Card>
      </div>
    );
  }

  // 로딩 상태
  if (isLoading) {
    return (
      <div className="space-y-6">
        <Card className="p-8 text-center">
          <Loader2 className="h-8 w-8 mx-auto mb-4 animate-spin text-primary" />
          <p className="text-muted-foreground">설정을 불러오는 중...</p>
        </Card>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl md:text-3xl font-bold">설정</h1>
        <p className="text-muted-foreground">
          계정 설정과 환경설정을 관리하세요
        </p>
      </div>

      <Tabs defaultValue="profile" className="space-y-6">
        <TabsList className={`grid w-full ${isAdmin ? 'grid-cols-5' : 'grid-cols-4'}`}>
          <TabsTrigger value="profile" className="gap-2">
            <User className="h-4 w-4" />
            <span className="hidden sm:inline">프로필</span>
          </TabsTrigger>
          <TabsTrigger value="notifications" className="gap-2">
            <Bell className="h-4 w-4" />
            <span className="hidden sm:inline">알림</span>
          </TabsTrigger>
          <TabsTrigger value="preferences" className="gap-2">
            <Globe className="h-4 w-4" />
            <span className="hidden sm:inline">환경설정</span>
          </TabsTrigger>
          <TabsTrigger value="security" className="gap-2">
            <Shield className="h-4 w-4" />
            <span className="hidden sm:inline">보안</span>
          </TabsTrigger>
          {!checkingAdmin && isAdmin && (
            <TabsTrigger value="admin" className="gap-2">
              <Settings2 className="h-4 w-4" />
              <span className="hidden sm:inline">관리자</span>
            </TabsTrigger>
          )}
        </TabsList>

        {/* Profile Tab */}
        <TabsContent value="profile">
          <Card>
            <CardHeader>
              <CardTitle>프로필 정보</CardTitle>
              <CardDescription>
                개인 정보와 운세 분석에 사용되는 정보를 관리하세요
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="name">이름</Label>
                  <Input
                    id="name"
                    value={profile.name}
                    onChange={(e) => handleProfileChange('name', e.target.value)}
                    placeholder="홍길동"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="email">이메일</Label>
                  <Input
                    id="email"
                    type="email"
                    value={profile.email}
                    onChange={(e) => handleProfileChange('email', e.target.value)}
                    placeholder="example@email.com"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="phone">전화번호</Label>
                  <Input
                    id="phone"
                    value={profile.phone}
                    onChange={(e) => handleProfileChange('phone', e.target.value)}
                    placeholder="010-1234-5678"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="birthDate">생년월일</Label>
                  <Input
                    id="birthDate"
                    type="date"
                    value={profile.birthDate}
                    onChange={(e) => handleProfileChange('birthDate', e.target.value)}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="birthTime">태어난 시간</Label>
                  <Input
                    id="birthTime"
                    type="time"
                    value={profile.birthTime}
                    onChange={(e) => handleProfileChange('birthTime', e.target.value)}
                  />
                  <p className="text-xs text-muted-foreground">
                    정확한 사주 분석을 위해 태어난 시간을 입력해주세요
                  </p>
                </div>
                <div className="space-y-2">
                  <Label>성별</Label>
                  <Select
                    value={profile.gender}
                    onValueChange={(value) => handleProfileChange('gender', value)}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="male">남성</SelectItem>
                      <SelectItem value="female">여성</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <Button onClick={handleSaveProfile} disabled={isSavingProfile}>
                {isSavingProfile ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    저장 중...
                  </>
                ) : (
                  <>
                    <Save className="mr-2 h-4 w-4" />
                    변경사항 저장
                  </>
                )}
              </Button>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Notifications Tab */}
        <TabsContent value="notifications">
          <Card>
            <CardHeader>
              <CardTitle>알림 설정</CardTitle>
              <CardDescription>
                알림을 받는 방법과 시간을 설정하세요
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-4">
                <div className="flex items-center justify-between p-4 rounded-lg border">
                  <div className="space-y-0.5">
                    <Label className="text-base">매일 운세 알림</Label>
                    <p className="text-sm text-muted-foreground">
                      매일 아침 오늘의 운세 알림을 받습니다
                    </p>
                  </div>
                  <Switch
                    checked={notifications.dailyFortunePush}
                    onCheckedChange={(checked) =>
                      handleNotificationChange('dailyFortunePush', checked)
                    }
                  />
                </div>

                {notifications.dailyFortunePush && (
                  <div className="ml-4 p-4 rounded-lg bg-muted">
                    <Label htmlFor="fortuneTime">알림 시간</Label>
                    <Input
                      id="fortuneTime"
                      type="time"
                      value={notifications.dailyFortuneTime}
                      onChange={(e) =>
                        handleNotificationChange('dailyFortuneTime', e.target.value)
                      }
                      className="w-32 mt-2"
                    />
                  </div>
                )}

                <div className="flex items-center justify-between p-4 rounded-lg border">
                  <div className="space-y-0.5">
                    <Label className="text-base">마케팅 이메일</Label>
                    <p className="text-sm text-muted-foreground">
                      프로모션 및 업데이트 이메일을 받습니다
                    </p>
                  </div>
                  <Switch
                    checked={notifications.marketingEmail}
                    onCheckedChange={(checked) =>
                      handleNotificationChange('marketingEmail', checked)
                    }
                  />
                </div>

                <div className="flex items-center justify-between p-4 rounded-lg border">
                  <div className="space-y-0.5">
                    <Label className="text-base">푸시 알림</Label>
                    <p className="text-sm text-muted-foreground">
                      기기에서 푸시 알림을 받습니다
                    </p>
                  </div>
                  <Switch
                    checked={notifications.marketingPush}
                    onCheckedChange={(checked) =>
                      handleNotificationChange('marketingPush', checked)
                    }
                  />
                </div>
              </div>
              <Button onClick={handleSaveNotifications} disabled={isSavingNotifications}>
                {isSavingNotifications ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    저장 중...
                  </>
                ) : (
                  <>
                    <Save className="mr-2 h-4 w-4" />
                    알림 설정 저장
                  </>
                )}
              </Button>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Preferences Tab */}
        <TabsContent value="preferences">
          <Card>
            <CardHeader>
              <CardTitle>언어 및 지역</CardTitle>
              <CardDescription>
                언어와 지역 설정을 변경하세요
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>언어</Label>
                  <Select
                    value={profile.locale}
                    onValueChange={(value) => handleProfileChange('locale', value)}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="ko">한국어</SelectItem>
                      <SelectItem value="ja">日本語</SelectItem>
                      <SelectItem value="en">English</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label>시간대</Label>
                  <Select
                    value={profile.timezone}
                    onValueChange={(value) => handleProfileChange('timezone', value)}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Asia/Seoul">서울 (GMT+9)</SelectItem>
                      <SelectItem value="Asia/Tokyo">도쿄 (GMT+9)</SelectItem>
                      <SelectItem value="America/New_York">뉴욕 (GMT-5)</SelectItem>
                      <SelectItem value="America/Los_Angeles">로스앤젤레스 (GMT-8)</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <Button onClick={handleSaveProfile} disabled={isSavingProfile}>
                {isSavingProfile ? (
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                ) : (
                  <Save className="mr-2 h-4 w-4" />
                )}
                환경설정 저장
              </Button>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Security Tab */}
        <TabsContent value="security">
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>비밀번호 변경</CardTitle>
                <CardDescription>
                  계정 보안을 위해 비밀번호를 변경하세요
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="currentPassword">현재 비밀번호</Label>
                  <Input id="currentPassword" type="password" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="newPassword">새 비밀번호</Label>
                  <Input id="newPassword" type="password" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="confirmPassword">새 비밀번호 확인</Label>
                  <Input id="confirmPassword" type="password" />
                </div>
                <Button>비밀번호 변경</Button>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>연결된 계정</CardTitle>
                <CardDescription>
                  소셜 로그인 연결을 관리하세요
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between p-4 rounded-lg border">
                  <div className="flex items-center gap-4">
                    <div className="w-10 h-10 rounded-full bg-white border flex items-center justify-center">
                      <span className="text-lg font-bold text-blue-500">G</span>
                    </div>
                    <div>
                      <h4 className="font-medium">Google</h4>
                      <p className="text-sm text-muted-foreground">
                        연결되지 않음
                      </p>
                    </div>
                  </div>
                  <Button variant="outline">연결</Button>
                </div>
                <div className="flex items-center justify-between p-4 rounded-lg border">
                  <div className="flex items-center gap-4">
                    <div className="w-10 h-10 rounded-full bg-yellow-400 flex items-center justify-center text-black font-bold">
                      K
                    </div>
                    <div>
                      <h4 className="font-medium">카카오</h4>
                      <p className="text-sm text-muted-foreground flex items-center gap-1">
                        <Check className="h-3 w-3 text-green-500" />
                        연결됨
                      </p>
                    </div>
                  </div>
                  <Button variant="outline">연결 해제</Button>
                </div>
                <div className="flex items-center justify-between p-4 rounded-lg border">
                  <div className="flex items-center gap-4">
                    <div className="w-10 h-10 rounded-full bg-green-500 flex items-center justify-center text-white font-bold">
                      N
                    </div>
                    <div>
                      <h4 className="font-medium">네이버</h4>
                      <p className="text-sm text-muted-foreground">
                        연결되지 않음
                      </p>
                    </div>
                  </div>
                  <Button variant="outline">연결</Button>
                </div>
              </CardContent>
            </Card>

            <Card className="border-destructive">
              <CardHeader>
                <CardTitle className="text-destructive">위험 구역</CardTitle>
                <CardDescription>
                  되돌릴 수 없는 계정 관련 작업입니다
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between p-4 rounded-lg border border-destructive/50">
                  <div>
                    <h4 className="font-medium">계정 삭제</h4>
                    <p className="text-sm text-muted-foreground">
                      계정과 모든 데이터가 영구적으로 삭제됩니다
                    </p>
                  </div>
                  <Button variant="destructive" onClick={() => setShowDeleteDialog(true)}>
                    <Trash2 className="mr-2 h-4 w-4" />
                    계정 삭제
                  </Button>
                </div>
                <div className="flex items-center justify-between p-4 rounded-lg border">
                  <div>
                    <h4 className="font-medium">모든 기기에서 로그아웃</h4>
                    <p className="text-sm text-muted-foreground">
                      모든 기기에서 로그아웃합니다
                    </p>
                  </div>
                  <Button variant="outline">
                    <LogOut className="mr-2 h-4 w-4" />
                    전체 로그아웃
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        {/* Admin Tab - Only visible to admins */}
        {!checkingAdmin && isAdmin && (
          <TabsContent value="admin">
            <div className="space-y-6">
              <Card className="border-primary/50 bg-primary/5">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Settings2 className="h-5 w-5" />
                    사이트 관리
                  </CardTitle>
                  <CardDescription>
                    사이트 전체 설정을 관리합니다. 변경 사항은 모든 사용자에게 적용됩니다.
                  </CardDescription>
                </CardHeader>
              </Card>

              <HeroImageSettings />
            </div>
          </TabsContent>
        )}
      </Tabs>

      {/* Delete Account Dialog */}
      <AlertDialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>정말로 계정을 삭제하시겠습니까?</AlertDialogTitle>
            <AlertDialogDescription>
              이 작업은 되돌릴 수 없습니다. 계정과 관련된 모든 데이터(분석 내역, 저장된 프로필, 구독 정보 등)가 영구적으로 삭제됩니다.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={isDeleting}>취소</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDeleteAccount}
              disabled={isDeleting}
              className="bg-red-500 hover:bg-red-600"
            >
              {isDeleting ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  삭제 중...
                </>
              ) : (
                '계정 삭제'
              )}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
