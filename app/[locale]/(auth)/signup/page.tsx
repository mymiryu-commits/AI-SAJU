'use client';

import { useState } from 'react';
import { useTranslations } from 'next-intl';
import { useRouter, Link } from '@/i18n/routing';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { useAuth } from '@/lib/hooks/useAuth';
import { Loader2, AlertCircle, CheckCircle, Mail } from 'lucide-react';

export default function SignupPage() {
  const t = useTranslations('auth.signup');
  const router = useRouter();
  const { signUpWithEmail, signInWithOAuth } = useAuth();

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
    agreeTerms: false,
    agreePrivacy: false,
    agreeMarketing: false,
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    // Validation
    if (formData.password !== formData.confirmPassword) {
      setError('비밀번호가 일치하지 않습니다.');
      return;
    }

    if (formData.password.length < 6) {
      setError('비밀번호는 최소 6자 이상이어야 합니다.');
      return;
    }

    if (!formData.agreeTerms || !formData.agreePrivacy) {
      setError('필수 약관에 동의해주세요.');
      return;
    }

    setLoading(true);

    try {
      const { data, error } = await signUpWithEmail(formData.email, formData.password);

      if (error) {
        if (error.message.includes('User already registered')) {
          setError('이미 가입된 이메일입니다.');
        } else if (error.message.includes('Invalid email')) {
          setError('유효하지 않은 이메일 형식입니다.');
        } else {
          setError(error.message);
        }
        return;
      }

      // Success - show confirmation message
      setSuccess(true);
    } catch (err) {
      setError('회원가입 중 오류가 발생했습니다.');
    } finally {
      setLoading(false);
    }
  };

  const handleSocialLogin = async (provider: 'google' | 'kakao' | 'apple') => {
    setLoading(true);
    setError(null);

    try {
      const { error } = await signInWithOAuth(provider);

      if (error) {
        setError(`${provider} 로그인 실패: ${error.message}`);
        setLoading(false);
      }
    } catch (err) {
      setError('소셜 로그인 중 오류가 발생했습니다.');
      setLoading(false);
    }
  };

  // Success view
  if (success) {
    return (
      <Card className="border-0 shadow-none lg:border lg:shadow-sm">
        <CardContent className="pt-8 text-center">
          <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-green-100 flex items-center justify-center">
            <Mail className="h-8 w-8 text-green-600" />
          </div>
          <h2 className="text-2xl font-bold mb-2">이메일을 확인해주세요!</h2>
          <p className="text-muted-foreground mb-6">
            <span className="font-medium text-foreground">{formData.email}</span>로<br />
            인증 이메일을 발송했습니다.
          </p>
          <p className="text-sm text-muted-foreground mb-6">
            이메일의 인증 링크를 클릭하면 회원가입이 완료됩니다.<br />
            이메일이 오지 않는 경우 스팸함을 확인해주세요.
          </p>
          <div className="space-y-3">
            <Button
              variant="outline"
              className="w-full"
              onClick={() => router.push('/login')}
            >
              로그인 페이지로 이동
            </Button>
            <Button
              variant="ghost"
              className="w-full"
              onClick={() => setSuccess(false)}
            >
              다른 이메일로 가입하기
            </Button>
          </div>
        </CardContent>
      </Card>
    );
  }

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
        {/* Error Alert */}
        {error && (
          <Alert variant="destructive" className="mb-4">
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}

        {/* Social Login Buttons */}
        <div className="space-y-3 mb-6">
          <Button
            type="button"
            variant="outline"
            className="w-full"
            onClick={() => handleSocialLogin('google')}
            disabled={loading}
          >
            <svg className="mr-2 h-4 w-4" viewBox="0 0 24 24">
              <path
                fill="currentColor"
                d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
              />
              <path
                fill="currentColor"
                d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
              />
              <path
                fill="currentColor"
                d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
              />
              <path
                fill="currentColor"
                d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
              />
            </svg>
            Google로 시작하기
          </Button>
          <Button
            type="button"
            variant="outline"
            className="w-full bg-[#FEE500] hover:bg-[#FEE500]/90 text-black border-[#FEE500]"
            onClick={() => handleSocialLogin('kakao')}
            disabled={loading}
          >
            <svg className="mr-2 h-4 w-4" viewBox="0 0 24 24">
              <path
                fill="currentColor"
                d="M12 3c-5.52 0-10 3.59-10 8 0 2.85 1.9 5.35 4.74 6.76-.16.58-.56 2.05-.64 2.37-.1.4.15.39.31.28.13-.08 2.04-1.38 2.87-1.94.85.13 1.75.19 2.68.19 5.52 0 10-3.59 10-8s-4.48-8-9.96-8z"
              />
            </svg>
            카카오로 시작하기
          </Button>
        </div>

        <div className="relative my-6">
          <div className="absolute inset-0 flex items-center">
            <div className="w-full border-t" />
          </div>
          <div className="relative flex justify-center text-xs uppercase">
            <span className="bg-background px-2 text-muted-foreground">
              또는 이메일로 가입
            </span>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="name">{t('name')}</Label>
            <Input
              id="name"
              name="name"
              type="text"
              placeholder="홍길동"
              value={formData.name}
              onChange={handleChange}
              disabled={loading}
              required
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="email">{t('email')}</Label>
            <Input
              id="email"
              name="email"
              type="email"
              placeholder="name@example.com"
              value={formData.email}
              onChange={handleChange}
              disabled={loading}
              required
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="password">{t('password')}</Label>
            <Input
              id="password"
              name="password"
              type="password"
              placeholder="최소 6자 이상"
              value={formData.password}
              onChange={handleChange}
              disabled={loading}
              minLength={6}
              required
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="confirmPassword">{t('confirmPassword')}</Label>
            <Input
              id="confirmPassword"
              name="confirmPassword"
              type="password"
              placeholder="비밀번호 확인"
              value={formData.confirmPassword}
              onChange={handleChange}
              disabled={loading}
              required
            />
          </div>

          <div className="space-y-3 pt-2">
            <label className="flex items-start space-x-2 text-sm">
              <input
                type="checkbox"
                name="agreeTerms"
                checked={formData.agreeTerms}
                onChange={handleChange}
                className="rounded border-gray-300 mt-0.5"
                required
              />
              <span>
                <span className="text-red-500">[필수]</span> {t('agreeTerms')}
              </span>
            </label>
            <label className="flex items-start space-x-2 text-sm">
              <input
                type="checkbox"
                name="agreePrivacy"
                checked={formData.agreePrivacy}
                onChange={handleChange}
                className="rounded border-gray-300 mt-0.5"
                required
              />
              <span>
                <span className="text-red-500">[필수]</span> {t('agreePrivacy')}
              </span>
            </label>
            <label className="flex items-start space-x-2 text-sm text-muted-foreground">
              <input
                type="checkbox"
                name="agreeMarketing"
                checked={formData.agreeMarketing}
                onChange={handleChange}
                className="rounded border-gray-300 mt-0.5"
              />
              <span>
                <span className="text-blue-500">[선택]</span> {t('agreeMarketing')}
              </span>
            </label>
          </div>

          <Button type="submit" className="w-full" disabled={loading}>
            {loading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                가입 중...
              </>
            ) : (
              t('submit')
            )}
          </Button>
        </form>

        <p className="mt-6 text-center text-sm text-muted-foreground">
          {t('hasAccount')}{' '}
          <Link href="/login" className="text-primary hover:underline">
            {t('login')}
          </Link>
        </p>
      </CardContent>
    </Card>
  );
}
