'use client';

import { useState } from 'react';
import { useTranslations } from 'next-intl';
import { Link } from '@/i18n/routing';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';
import {
  Check,
  X,
  Sparkles,
  Zap,
  Crown,
  Star,
  ArrowRight,
  HelpCircle,
} from 'lucide-react';
import {
  PRICING,
  PLAN_FEATURES,
  PLAN_META,
  formatPrice,
  type PlanType,
  type BillingPeriod,
} from '@/lib/constants/pricing';

const planIcons = {
  free: Star,
  basic: Zap,
  pro: Sparkles,
  premium: Crown,
} as const;

export default function PricingPage() {
  const t = useTranslations('pricing');
  const [billingPeriod, setBillingPeriod] = useState<BillingPeriod>('monthly');

  return (
    <div className="container mx-auto px-4 py-8 md:py-16">
      {/* 헤더 */}
      <div className="text-center mb-12">
        <Badge className="mb-4 bg-primary/10 text-primary">
          <Sparkles className="mr-1 h-3 w-3" />
          요금제
        </Badge>
        <h1 className="text-3xl md:text-5xl font-bold mb-4">{t('title')}</h1>
        <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
          {t('subtitle')}
        </p>
      </div>

      {/* 결제 주기 토글 */}
      <div className="flex justify-center mb-12">
        <Tabs
          value={billingPeriod}
          onValueChange={(v) => setBillingPeriod(v as BillingPeriod)}
        >
          <TabsList className="grid grid-cols-2 w-64">
            <TabsTrigger value="monthly">{t('monthly')}</TabsTrigger>
            <TabsTrigger value="yearly" className="relative">
              {t('yearly')}
              <Badge className="absolute -top-3 -right-3 bg-green-500 text-white text-xs">
                -{PRICING.discount.yearly}%
              </Badge>
            </TabsTrigger>
          </TabsList>
        </Tabs>
      </div>

      {/* 플랜 그리드 */}
      <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 max-w-7xl mx-auto">
        {(['free', 'basic', 'pro', 'premium'] as const).map((plan) => {
          const meta = PLAN_META[plan];
          const Icon = planIcons[plan];
          const pricing = PRICING.subscription[billingPeriod][plan];
          const planFeatures = PLAN_FEATURES[plan];
          const isPopular = 'popular' in meta && meta.popular;

          return (
            <Card
              key={plan}
              className={`relative ${
                isPopular ? 'border-primary shadow-lg scale-105 z-10' : ''
              }`}
            >
              {isPopular && (
                <div className="absolute -top-4 left-1/2 -translate-x-1/2">
                  <Badge className="bg-primary text-primary-foreground">
                    가장 인기
                  </Badge>
                </div>
              )}
              <CardHeader className="text-center pb-2">
                <div
                  className={`w-12 h-12 rounded-full ${meta.bgColor} flex items-center justify-center mx-auto mb-4`}
                >
                  <Icon className={`h-6 w-6 ${meta.color}`} />
                </div>
                <CardTitle className="text-xl">
                  {meta.name}
                </CardTitle>
                <CardDescription>
                  {meta.description}
                </CardDescription>
              </CardHeader>
              <CardContent className="text-center">
                <div className="mb-6">
                  <span className="text-4xl font-bold">
                    {pricing.price === 0 ? (
                      '무료'
                    ) : (
                      <>
                        ₩{formatPrice(pricing.price)}
                      </>
                    )}
                  </span>
                  {pricing.price > 0 && (
                    <span className="text-muted-foreground">
                      /{billingPeriod === 'monthly' ? '월' : '년'}
                    </span>
                  )}
                  {billingPeriod === 'yearly' && 'monthlyEquiv' in pricing && (
                    <p className="text-sm text-muted-foreground mt-1">
                      월 ₩{formatPrice(pricing.monthlyEquiv)} 환산
                    </p>
                  )}
                </div>

                <ul className="space-y-3 text-left">
                  {planFeatures.map((feature, index) => (
                    <li key={index} className="flex items-start gap-2">
                      {feature.included ? (
                        <Check className="h-5 w-5 text-green-500 shrink-0" />
                      ) : (
                        <X className="h-5 w-5 text-muted-foreground shrink-0" />
                      )}
                      <span
                        className={
                          feature.included ? '' : 'text-muted-foreground'
                        }
                      >
                        {feature.text}
                      </span>
                    </li>
                  ))}
                </ul>
              </CardContent>
              <CardFooter>
                <Button
                  className="w-full"
                  variant={isPopular ? 'default' : 'outline'}
                >
                  {plan === 'free' ? (
                    '시작하기'
                  ) : (
                    <>
                      구독하기
                      <ArrowRight className="ml-2 h-4 w-4" />
                    </>
                  )}
                </Button>
              </CardFooter>
            </Card>
          );
        })}
      </div>

      {/* 개별 서비스 */}
      <div className="mt-16 max-w-4xl mx-auto">
        <h2 className="text-2xl font-bold text-center mb-8">
          개별 서비스
        </h2>
        <div className="grid md:grid-cols-3 gap-4">
          <Card>
            <CardContent className="p-6 text-center">
              <h3 className="font-semibold mb-2">사주 분석</h3>
              <p className="text-2xl font-bold text-primary">
                ₩{formatPrice(PRICING.individual.saju.price)}
              </p>
              <p className="text-sm text-muted-foreground">1회 분석</p>
              <Link href="/fortune/saju">
                <Button variant="outline" className="w-full mt-4">
                  분석 시작
                </Button>
              </Link>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-6 text-center">
              <h3 className="font-semibold mb-2">관상 분석</h3>
              <p className="text-2xl font-bold text-primary">
                ₩{formatPrice(PRICING.individual.face.price)}
              </p>
              <p className="text-sm text-muted-foreground">1회 분석</p>
              <Link href="/fortune/face">
                <Button variant="outline" className="w-full mt-4">
                  분석 시작
                </Button>
              </Link>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-6 text-center">
              <h3 className="font-semibold mb-2">궁합 분석</h3>
              <p className="text-2xl font-bold text-primary">
                ₩{formatPrice(PRICING.individual.compatibility.price)}
              </p>
              <p className="text-sm text-muted-foreground">1쌍 분석</p>
              <Link href="/fortune/compatibility">
                <Button variant="outline" className="w-full mt-4">
                  분석 시작
                </Button>
              </Link>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* FAQ */}
      <div className="mt-16 max-w-3xl mx-auto">
        <h2 className="text-2xl font-bold text-center mb-8">
          자주 묻는 질문
        </h2>
        <div className="space-y-4">
          <Card>
            <CardContent className="p-6">
              <div className="flex items-start gap-4">
                <HelpCircle className="h-5 w-5 text-primary shrink-0 mt-0.5" />
                <div>
                  <h3 className="font-semibold mb-1">언제든지 취소할 수 있나요?</h3>
                  <p className="text-muted-foreground">
                    네, 언제든지 구독을 취소할 수 있습니다. 결제 기간이 끝날 때까지
                    서비스를 계속 이용하실 수 있습니다.
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-6">
              <div className="flex items-start gap-4">
                <HelpCircle className="h-5 w-5 text-primary shrink-0 mt-0.5" />
                <div>
                  <h3 className="font-semibold mb-1">
                    어떤 결제 수단을 사용할 수 있나요?
                  </h3>
                  <p className="text-muted-foreground">
                    신용/체크카드, 토스페이, 카카오페이, 네이버페이 등
                    다양한 결제 수단을 지원합니다.
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-6">
              <div className="flex items-start gap-4">
                <HelpCircle className="h-5 w-5 text-primary shrink-0 mt-0.5" />
                <div>
                  <h3 className="font-semibold mb-1">
                    무료 체험이 가능한가요?
                  </h3>
                  <p className="text-muted-foreground">
                    네! 무료 플랜으로 기본 기능을 무제한 사용하실 수 있으며,
                    Pro 및 프리미엄 플랜은 7일 무료 체험을 제공합니다.
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
