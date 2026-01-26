'use client';

import { useState, useEffect, Suspense } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { Link } from '@/i18n/routing';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import {
  Gift,
  Loader2,
  AlertCircle,
  CheckCircle,
  Sparkles,
  QrCode,
  Dices,
  Clock,
  User,
  MessageSquare,
} from 'lucide-react';
import { useAuth } from '@/lib/hooks/useAuth';

const serviceTypeConfig: Record<string, { icon: typeof Sparkles; label: string; color: string }> = {
  saju: {
    icon: Sparkles,
    label: '사주 완전분석',
    color: 'text-purple-500 bg-purple-100 dark:bg-purple-900/30',
  },
  qrcode: {
    icon: QrCode,
    label: 'QR코드 생성',
    color: 'text-blue-500 bg-blue-100 dark:bg-blue-900/30',
  },
  lotto: {
    icon: Dices,
    label: '로또번호 AI추천',
    color: 'text-green-500 bg-green-100 dark:bg-green-900/30',
  },
};

interface GiftInfo {
  service_type: string;
  quantity: number;
  message: string | null;
  status: string;
  expires_at: string;
  sender_name: string;
  is_claimable: boolean;
}

function GiftClaimPageContent() {
  const { user, isLoading: authLoading } = useAuth();
  const searchParams = useSearchParams();
  const router = useRouter();
  const codeFromUrl = searchParams.get('code');

  const [code, setCode] = useState(codeFromUrl || '');
  const [giftInfo, setGiftInfo] = useState<GiftInfo | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isClaiming, setIsClaiming] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<{ quantity: number; service_type: string } | null>(null);

  // URL에 코드가 있으면 자동 조회
  useEffect(() => {
    if (codeFromUrl && !giftInfo && !isLoading) {
      handleCheckCode();
    }
  }, [codeFromUrl]);

  const handleCheckCode = async () => {
    if (!code.trim()) {
      setError('선물 코드를 입력해주세요.');
      return;
    }

    try {
      setIsLoading(true);
      setError(null);
      setGiftInfo(null);

      const response = await fetch(`/api/voucher/gift/claim?code=${encodeURIComponent(code.trim())}`);
      const data = await response.json();

      if (!response.ok) {
        setError(data.error || '선물 정보를 불러오는데 실패했습니다.');
        return;
      }

      setGiftInfo(data.gift);
    } catch (err) {
      console.error('Check code error:', err);
      setError('오류가 발생했습니다.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleClaim = async () => {
    if (!user) {
      // 로그인 페이지로 리다이렉트 (코드 유지)
      router.push(`/auth/login?redirect=/gift/claim?code=${encodeURIComponent(code)}`);
      return;
    }

    try {
      setIsClaiming(true);
      setError(null);

      const response = await fetch('/api/voucher/gift/claim', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ code: code.trim() }),
      });

      const data = await response.json();

      if (!response.ok) {
        setError(data.error || '선물 수령에 실패했습니다.');
        return;
      }

      setSuccess({
        quantity: data.voucher.quantity,
        service_type: data.voucher.service_type,
      });
      setGiftInfo(null);
    } catch (err) {
      console.error('Claim error:', err);
      setError('오류가 발생했습니다.');
    } finally {
      setIsClaiming(false);
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('ko-KR', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  // 성공 화면
  if (success) {
    const config = serviceTypeConfig[success.service_type] || {
      icon: Gift,
      label: success.service_type,
      color: 'text-gray-500 bg-gray-100',
    };
    const Icon = config.icon;

    return (
      <div className="container mx-auto px-4 py-8 max-w-lg">
        <Card className="text-center">
          <CardContent className="pt-8 pb-6 space-y-6">
            <div className="w-20 h-20 mx-auto rounded-full bg-green-100 dark:bg-green-900/30 flex items-center justify-center">
              <CheckCircle className="h-10 w-10 text-green-600" />
            </div>

            <div>
              <h1 className="text-2xl font-bold mb-2">선물을 받았습니다!</h1>
              <p className="text-muted-foreground">
                이용권이 내 계정에 추가되었습니다
              </p>
            </div>

            <div className="flex items-center justify-center gap-3 p-4 bg-muted rounded-lg">
              <div className={`p-2 rounded-lg ${config.color}`}>
                <Icon className="h-6 w-6" />
              </div>
              <div className="text-left">
                <p className="font-semibold">{config.label}</p>
                <p className="text-2xl font-bold text-primary">{success.quantity}회</p>
              </div>
            </div>

            <div className="space-y-3">
              <Link href="/my/vouchers">
                <Button className="w-full">
                  내 이용권 확인하기
                </Button>
              </Link>
              <Link href="/fortune">
                <Button variant="outline" className="w-full">
                  바로 사용하기
                </Button>
              </Link>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8 max-w-lg">
      <Card>
        <CardHeader className="text-center">
          <div className="w-16 h-16 mx-auto rounded-full bg-pink-100 dark:bg-pink-900/30 flex items-center justify-center mb-4">
            <Gift className="h-8 w-8 text-pink-600" />
          </div>
          <CardTitle className="text-2xl">선물 수령하기</CardTitle>
          <CardDescription>
            선물 코드를 입력하여 이용권을 받으세요
          </CardDescription>
        </CardHeader>

        <CardContent className="space-y-6">
          {/* 코드 입력 */}
          <div className="space-y-2">
            <div className="flex gap-2">
              <Input
                placeholder="선물 코드 입력"
                value={code}
                onChange={(e) => setCode(e.target.value.toUpperCase())}
                className="uppercase font-mono text-lg tracking-wider"
                maxLength={12}
              />
              <Button
                onClick={handleCheckCode}
                disabled={isLoading || !code.trim()}
              >
                {isLoading ? (
                  <Loader2 className="h-4 w-4 animate-spin" />
                ) : (
                  '확인'
                )}
              </Button>
            </div>
          </div>

          {/* 에러 메시지 */}
          {error && (
            <div className="flex items-center gap-2 p-3 bg-red-50 dark:bg-red-950/20 text-red-700 dark:text-red-400 rounded-lg">
              <AlertCircle className="h-4 w-4 shrink-0" />
              <span className="text-sm">{error}</span>
            </div>
          )}

          {/* 선물 정보 */}
          {giftInfo && (
            <div className="space-y-4">
              <div className="border rounded-lg p-4 space-y-4">
                {/* 서비스 타입 */}
                {(() => {
                  const config = serviceTypeConfig[giftInfo.service_type] || {
                    icon: Gift,
                    label: giftInfo.service_type,
                    color: 'text-gray-500 bg-gray-100',
                  };
                  const Icon = config.icon;

                  return (
                    <div className="flex items-center gap-3">
                      <div className={`p-3 rounded-lg ${config.color}`}>
                        <Icon className="h-6 w-6" />
                      </div>
                      <div>
                        <p className="text-sm text-muted-foreground">선물 내용</p>
                        <p className="font-semibold text-lg">
                          {config.label} <span className="text-primary">{giftInfo.quantity}회</span>
                        </p>
                      </div>
                    </div>
                  );
                })()}

                {/* 보낸 사람 */}
                <div className="flex items-center gap-3 text-sm">
                  <User className="h-4 w-4 text-muted-foreground" />
                  <span className="text-muted-foreground">보낸 사람:</span>
                  <span className="font-medium">{giftInfo.sender_name}</span>
                </div>

                {/* 메시지 */}
                {giftInfo.message && (
                  <div className="flex items-start gap-3 p-3 bg-muted rounded-lg">
                    <MessageSquare className="h-4 w-4 text-muted-foreground mt-0.5" />
                    <p className="text-sm italic">&ldquo;{giftInfo.message}&rdquo;</p>
                  </div>
                )}

                {/* 만료일 */}
                <div className="flex items-center gap-3 text-sm">
                  <Clock className="h-4 w-4 text-muted-foreground" />
                  <span className="text-muted-foreground">수령 기한:</span>
                  <span className={giftInfo.status === 'expired' ? 'text-red-500' : ''}>
                    {formatDate(giftInfo.expires_at)}
                  </span>
                </div>

                {/* 상태 뱃지 */}
                <div className="flex justify-center">
                  {giftInfo.status === 'pending' && giftInfo.is_claimable && (
                    <Badge className="bg-green-500">수령 가능</Badge>
                  )}
                  {giftInfo.status === 'claimed' && (
                    <Badge variant="secondary">이미 수령됨</Badge>
                  )}
                  {giftInfo.status === 'expired' && (
                    <Badge variant="destructive">기한 만료</Badge>
                  )}
                  {giftInfo.status === 'cancelled' && (
                    <Badge variant="destructive">취소됨</Badge>
                  )}
                </div>
              </div>

              {/* 수령 버튼 */}
              {giftInfo.is_claimable && (
                <Button
                  className="w-full h-12 text-lg"
                  onClick={handleClaim}
                  disabled={isClaiming}
                >
                  {isClaiming ? (
                    <>
                      <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                      처리 중...
                    </>
                  ) : !user ? (
                    <>
                      로그인하고 받기
                    </>
                  ) : (
                    <>
                      <Gift className="mr-2 h-5 w-5" />
                      선물 받기
                    </>
                  )}
                </Button>
              )}

              {!giftInfo.is_claimable && (
                <Link href="/my/vouchers">
                  <Button variant="outline" className="w-full">
                    내 이용권 확인하기
                  </Button>
                </Link>
              )}
            </div>
          )}

          {/* 안내 */}
          {!giftInfo && !error && (
            <div className="text-center text-sm text-muted-foreground space-y-2 pt-4">
              <p>선물 링크를 받으셨나요?</p>
              <p>링크를 클릭하거나 선물 코드를 직접 입력하세요.</p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}

// Wrapper with Suspense for useSearchParams
export default function GiftClaimPage() {
  return (
    <Suspense fallback={
      <div className="container mx-auto px-4 py-8 max-w-lg">
        <Card className="p-8 text-center">
          <Loader2 className="h-8 w-8 mx-auto mb-4 animate-spin text-primary" />
          <p className="text-muted-foreground">로딩 중...</p>
        </Card>
      </div>
    }>
      <GiftClaimPageContent />
    </Suspense>
  );
}
