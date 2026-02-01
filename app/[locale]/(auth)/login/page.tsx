'use client';

import { useState, useEffect } from 'react';
import { useTranslations } from 'next-intl';
import { useRouter, Link } from '@/i18n/routing';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { useAuth } from '@/lib/hooks/useAuth';
import { Loader2, AlertCircle, CheckCircle, ExternalLink, Copy } from 'lucide-react';
import { isWebView, getWebViewAppName, getExternalBrowserUrl } from '@/lib/utils/webview';

export default function LoginPage() {
  const t = useTranslations('auth.login');
  const router = useRouter();
  const { signInWithEmail, signInWithOAuth, isLoading: authLoading } = useAuth();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [inWebView, setInWebView] = useState(false);
  const [webViewApp, setWebViewApp] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);

  // WebView 감지
  useEffect(() => {
    const detected = isWebView();
    setInWebView(detected);
    if (detected) {
      setWebViewApp(getWebViewAppName());
    }
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setSuccess(null);

    try {
      const { data, error } = await signInWithEmail(email, password);

      if (error) {
        if (error.message.includes('Invalid login credentials')) {
          setError('이메일 또는 비밀번호가 올바르지 않습니다.');
        } else if (error.message.includes('Email not confirmed')) {
          setError('이메일 인증이 필요합니다. 이메일을 확인해주세요.');
        } else {
          setError(error.message);
        }
        return;
      }

      if (data.user) {
        setSuccess('로그인 성공! 잠시 후 이동합니다...');
        // Save email for saju page admin check
        localStorage.setItem('saju_user_email', data.user.email || '');
        setTimeout(() => {
          router.push('/');
        }, 1000);
      }
    } catch (err) {
      setError('로그인 중 오류가 발생했습니다.');
    } finally {
      setLoading(false);
    }
  };

  const handleCopyUrl = async () => {
    try {
      await navigator.clipboard.writeText(getExternalBrowserUrl());
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      // Fallback for older browsers
      const textArea = document.createElement('textarea');
      textArea.value = getExternalBrowserUrl();
      document.body.appendChild(textArea);
      textArea.select();
      document.execCommand('copy');
      document.body.removeChild(textArea);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const handleSocialLogin = async (provider: 'google' | 'kakao') => {
    // WebView에서 Google OAuth 시도 시 경고
    if (inWebView && provider === 'google') {
      setError(`${webViewApp || '인앱 브라우저'}에서는 Google 로그인이 지원되지 않습니다. 아래 안내에 따라 외부 브라우저에서 접속해주세요.`);
      return;
    }

    setLoading(true);
    setError(null);

    try {
      console.log(`Starting ${provider} OAuth login...`);
      const { data, error } = await signInWithOAuth(provider);

      console.log('OAuth response:', { data, error });

      if (error) {
        console.error('OAuth error:', error);
        // WebView 관련 에러 메시지 개선
        if (error.message.includes('disallowed_useragent')) {
          setError('인앱 브라우저에서는 Google 로그인이 지원되지 않습니다. 외부 브라우저(Chrome, Safari 등)에서 접속해주세요.');
        } else {
          setError(`${provider} 로그인 실패: ${error.message}`);
        }
        setLoading(false);
        return;
      }

      // OAuth returns a URL to redirect to
      if (data?.url) {
        console.log('Redirecting to:', data.url);
        window.location.href = data.url;
      } else {
        console.error('No redirect URL returned');
        setError('로그인 URL을 가져오지 못했습니다.');
        setLoading(false);
      }
    } catch (err) {
      console.error('OAuth exception:', err);
      setError('소셜 로그인 중 오류가 발생했습니다.');
      setLoading(false);
    }
  };

  return (
    <Card className="border-0 shadow-none lg:border lg:shadow-sm">
      <CardHeader className="text-center">
        <div className="lg:hidden mb-4">
          <Link href="/" className="text-2xl font-bold bg-gradient-to-r from-amber-600 to-orange-600 bg-clip-text text-transparent">
            AI-PlanX
          </Link>
        </div>
        <CardTitle className="text-2xl">{t('title')}</CardTitle>
        <CardDescription>{t('subtitle')}</CardDescription>
      </CardHeader>
      <CardContent>
        {/* WebView Warning */}
        {inWebView && (
          <Alert className="mb-4 border-amber-500 bg-amber-50 text-amber-800">
            <ExternalLink className="h-4 w-4" />
            <AlertDescription>
              <div className="space-y-2">
                <p className="font-medium">
                  {webViewApp ? `${webViewApp} 앱` : '인앱 브라우저'}에서는 Google 로그인이 지원되지 않습니다.
                </p>
                <p className="text-sm">
                  외부 브라우저(Chrome, Safari)에서 접속해주세요.
                </p>
                <div className="flex gap-2 mt-2">
                  <Button
                    type="button"
                    size="sm"
                    variant="outline"
                    className="text-amber-800 border-amber-500 hover:bg-amber-100"
                    onClick={handleCopyUrl}
                  >
                    <Copy className="h-3 w-3 mr-1" />
                    {copied ? '복사됨!' : 'URL 복사'}
                  </Button>
                </div>
                <p className="text-xs text-amber-600 mt-1">
                  URL을 복사하여 Chrome 또는 Safari에 붙여넣기 해주세요.
                </p>
              </div>
            </AlertDescription>
          </Alert>
        )}

        {/* Error Alert */}
        {error && (
          <Alert variant="destructive" className="mb-4">
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}

        {/* Success Alert */}
        {success && (
          <Alert className="mb-4 border-green-500 bg-green-50 text-green-700">
            <CheckCircle className="h-4 w-4" />
            <AlertDescription>{success}</AlertDescription>
          </Alert>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="email">{t('email')}</Label>
            <Input
              id="email"
              type="email"
              placeholder="name@example.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              disabled={loading}
            />
          </div>
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <Label htmlFor="password">{t('password')}</Label>
              <Link
                href="/forgot-password"
                className="text-sm text-primary hover:underline"
              >
                {t('forgotPassword')}
              </Link>
            </div>
            <Input
              id="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              disabled={loading}
              minLength={6}
            />
          </div>
          <Button type="submit" className="w-full" disabled={loading || authLoading}>
            {loading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                로그인 중...
              </>
            ) : (
              t('submit')
            )}
          </Button>
        </form>

        <div className="relative my-6">
          <div className="absolute inset-0 flex items-center">
            <div className="w-full border-t" />
          </div>
          <div className="relative flex justify-center text-xs uppercase">
            <span className="bg-background px-2 text-muted-foreground">
              {t('or')}
            </span>
          </div>
        </div>

        <div className="space-y-3">
          {/* Google 로그인 버튼 - 구글 브랜드 가이드라인 적용 */}
          <Button
            type="button"
            variant="outline"
            className={`w-full bg-white hover:bg-gray-50 text-gray-700 border-gray-300 shadow-sm ${inWebView ? 'opacity-50' : ''}`}
            onClick={() => handleSocialLogin('google')}
            disabled={loading}
          >
            <svg className="mr-2 h-5 w-5" viewBox="0 0 24 24">
              <path
                fill="#4285F4"
                d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
              />
              <path
                fill="#34A853"
                d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
              />
              <path
                fill="#FBBC05"
                d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
              />
              <path
                fill="#EA4335"
                d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
              />
            </svg>
            Google로 계속하기
            {inWebView && <span className="ml-1 text-xs">(외부 브라우저 필요)</span>}
          </Button>

          {/* 카카오 로그인 버튼 */}
          <Button
            type="button"
            variant="outline"
            className="w-full bg-[#FEE500] hover:bg-[#FEE500]/90 text-[#191919] border-[#FEE500] font-medium"
            onClick={() => handleSocialLogin('kakao')}
            disabled={loading}
          >
            <svg className="mr-2 h-5 w-5" viewBox="0 0 24 24">
              <path
                fill="#191919"
                d="M12 3c-5.52 0-10 3.59-10 8 0 2.85 1.9 5.35 4.74 6.76-.16.58-.56 2.05-.64 2.37-.1.4.15.39.31.28.13-.08 2.04-1.38 2.87-1.94.85.13 1.75.19 2.68.19 5.52 0 10-3.59 10-8s-4.48-8-9.96-8z"
              />
            </svg>
            카카오로 계속하기
          </Button>
        </div>

        <p className="mt-6 text-center text-sm text-muted-foreground">
          {t('noAccount')}{' '}
          <Link href="/signup" className="text-primary hover:underline">
            {t('signup')}
          </Link>
        </p>
      </CardContent>
    </Card>
  );
}
