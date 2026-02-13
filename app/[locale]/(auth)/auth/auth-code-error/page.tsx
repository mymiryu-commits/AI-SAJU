'use client';

import { useSearchParams } from 'next/navigation';
import { Link } from '@/i18n/routing';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { AlertCircle, ArrowLeft, RefreshCw } from 'lucide-react';

export default function AuthCodeErrorPage() {
  const searchParams = useSearchParams();
  const error = searchParams.get('error');
  const errorDescription = searchParams.get('error_description');

  const getErrorMessage = () => {
    switch (error) {
      case 'access_denied':
        return '로그인이 취소되었습니다.';
      case 'exchange_failed':
        return '인증 코드 교환에 실패했습니다.';
      case 'no_code':
        return '인증 코드가 제공되지 않았습니다.';
      case 'exception':
        return '로그인 처리 중 오류가 발생했습니다.';
      default:
        return '로그인 중 오류가 발생했습니다.';
    }
  };

  return (
    <Card className="border-0 shadow-none lg:border lg:shadow-sm max-w-md mx-auto">
      <CardHeader className="text-center">
        <div className="lg:hidden mb-4">
          <Link href="/" className="text-2xl font-bold bg-gradient-to-r from-amber-600 to-orange-600 bg-clip-text text-transparent">
            AI-SAJU
          </Link>
        </div>
        <CardTitle className="text-2xl text-red-600">로그인 오류</CardTitle>
        <CardDescription>소셜 로그인 중 문제가 발생했습니다</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>
            <div className="space-y-2">
              <p className="font-medium">{getErrorMessage()}</p>
              {errorDescription && (
                <p className="text-sm opacity-80">{errorDescription}</p>
              )}
            </div>
          </AlertDescription>
        </Alert>

        <div className="space-y-3">
          <p className="text-sm text-muted-foreground">
            다음 방법을 시도해 보세요:
          </p>
          <ul className="text-sm text-muted-foreground list-disc list-inside space-y-1">
            <li>브라우저 쿠키를 허용해주세요</li>
            <li>시크릿/프라이빗 모드가 아닌 일반 모드에서 시도해주세요</li>
            <li>다른 소셜 로그인 방법을 사용해보세요</li>
            <li>인앱 브라우저 대신 Chrome/Safari를 사용해주세요</li>
          </ul>
        </div>

        <div className="flex flex-col gap-2 pt-4">
          <Button asChild className="w-full">
            <Link href="/login">
              <RefreshCw className="mr-2 h-4 w-4" />
              다시 로그인하기
            </Link>
          </Button>
          <Button variant="outline" asChild className="w-full">
            <Link href="/">
              <ArrowLeft className="mr-2 h-4 w-4" />
              홈으로 돌아가기
            </Link>
          </Button>
        </div>

        {/* Debug info for development */}
        {process.env.NODE_ENV === 'development' && (
          <div className="mt-6 p-3 bg-gray-100 rounded text-xs">
            <p className="font-mono">Error: {error || 'N/A'}</p>
            <p className="font-mono">Description: {errorDescription || 'N/A'}</p>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
