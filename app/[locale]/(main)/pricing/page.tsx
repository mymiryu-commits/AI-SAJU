'use client';

import { useState } from 'react';
import { useTranslations } from 'next-intl';
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

const plans = {
  monthly: {
    free: { price: 0, period: 'forever' },
    basic: { price: 4900, priceUsd: 3.99, priceJpy: 550, period: 'month' },
    pro: { price: 9900, priceUsd: 7.99, priceJpy: 1100, period: 'month' },
    premium: { price: 19900, priceUsd: 15.99, priceJpy: 2200, period: 'month' },
  },
  yearly: {
    free: { price: 0, period: 'forever' },
    basic: { price: 39900, priceUsd: 32.99, priceJpy: 4400, period: 'year', monthlyEquiv: 3325 },
    pro: { price: 79900, priceUsd: 64.99, priceJpy: 8800, period: 'year', monthlyEquiv: 6658 },
    premium: { price: 149900, priceUsd: 119.99, priceJpy: 16500, period: 'year', monthlyEquiv: 12491 },
  },
};

const features = {
  free: [
    { text: 'Daily free fortune', included: true },
    { text: 'Basic Saju analysis (1 time)', included: true },
    { text: 'AI rankings access', included: true },
    { text: 'Basic guides', included: true },
    { text: 'Detailed analysis', included: false },
    { text: 'PDF reports', included: false },
    { text: 'Voice reports', included: false },
    { text: 'Expert consultation', included: false },
  ],
  basic: [
    { text: 'Daily free fortune', included: true },
    { text: 'Detailed Saju analysis (3/month)', included: true },
    { text: 'AI rankings access', included: true },
    { text: 'All guides & tutorials', included: true },
    { text: 'Ad-free experience', included: true },
    { text: 'PDF reports', included: true },
    { text: 'Voice reports', included: false },
    { text: 'Expert consultation', included: false },
  ],
  pro: [
    { text: 'Daily free fortune', included: true },
    { text: 'Unlimited Saju & Face analysis', included: true },
    { text: 'AI rankings access', included: true },
    { text: 'All guides & tutorials', included: true },
    { text: 'Ad-free experience', included: true },
    { text: 'PDF reports', included: true },
    { text: 'Voice reports', included: true },
    { text: 'Priority support', included: true },
  ],
  premium: [
    { text: 'Everything in Pro', included: true },
    { text: 'Integrated analysis', included: true },
    { text: 'Family/Group analysis', included: true },
    { text: 'Expert consultation (1/month)', included: true },
    { text: 'Personalized predictions', included: true },
    { text: 'Early access to new features', included: true },
    { text: 'Dedicated support', included: true },
    { text: 'API access', included: true },
  ],
};

const planMeta: Record<string, { icon: typeof Star; color: string; bgColor: string; popular?: boolean }> = {
  free: { icon: Star, color: 'text-gray-500', bgColor: 'bg-gray-100' },
  basic: { icon: Zap, color: 'text-blue-500', bgColor: 'bg-blue-100' },
  pro: { icon: Sparkles, color: 'text-purple-500', bgColor: 'bg-purple-100', popular: true },
  premium: { icon: Crown, color: 'text-yellow-500', bgColor: 'bg-yellow-100' },
};

export default function PricingPage() {
  const t = useTranslations('pricing');
  const [billingPeriod, setBillingPeriod] = useState<'monthly' | 'yearly'>('monthly');

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('ko-KR').format(price);
  };

  return (
    <div className="container mx-auto px-4 py-8 md:py-16">
      {/* Header */}
      <div className="text-center mb-12">
        <Badge className="mb-4 bg-primary/10 text-primary">
          <Sparkles className="mr-1 h-3 w-3" />
          Pricing Plans
        </Badge>
        <h1 className="text-3xl md:text-5xl font-bold mb-4">{t('title')}</h1>
        <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
          {t('subtitle')}
        </p>
      </div>

      {/* Billing Toggle */}
      <div className="flex justify-center mb-12">
        <Tabs
          value={billingPeriod}
          onValueChange={(v) => setBillingPeriod(v as 'monthly' | 'yearly')}
        >
          <TabsList className="grid grid-cols-2 w-64">
            <TabsTrigger value="monthly">{t('monthly')}</TabsTrigger>
            <TabsTrigger value="yearly" className="relative">
              {t('yearly')}
              <Badge className="absolute -top-3 -right-3 bg-green-500 text-white text-xs">
                -17%
              </Badge>
            </TabsTrigger>
          </TabsList>
        </Tabs>
      </div>

      {/* Plans Grid */}
      <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 max-w-7xl mx-auto">
        {(['free', 'basic', 'pro', 'premium'] as const).map((plan) => {
          const meta = planMeta[plan];
          const Icon = meta.icon;
          const pricing = plans[billingPeriod][plan];
          const planFeatures = features[plan];

          return (
            <Card
              key={plan}
              className={`relative ${
                meta.popular
                  ? 'border-primary shadow-lg scale-105 z-10'
                  : ''
              }`}
            >
              {meta.popular && (
                <div className="absolute -top-4 left-1/2 -translate-x-1/2">
                  <Badge className="bg-primary text-primary-foreground">
                    Most Popular
                  </Badge>
                </div>
              )}
              <CardHeader className="text-center pb-2">
                <div
                  className={`w-12 h-12 rounded-full ${meta.bgColor} flex items-center justify-center mx-auto mb-4`}
                >
                  <Icon className={`h-6 w-6 ${meta.color}`} />
                </div>
                <CardTitle className="text-xl capitalize">
                  {t(`tiers.${plan}.name` as 'tiers.free.name')}
                </CardTitle>
                <CardDescription>
                  {plan === 'free'
                    ? 'Get started for free'
                    : plan === 'basic'
                    ? 'For casual users'
                    : plan === 'pro'
                    ? 'For regular users'
                    : 'For power users'}
                </CardDescription>
              </CardHeader>
              <CardContent className="text-center">
                <div className="mb-6">
                  <span className="text-4xl font-bold">
                    {pricing.price === 0 ? (
                      'Free'
                    ) : (
                      <>
                        ₩{formatPrice(pricing.price)}
                      </>
                    )}
                  </span>
                  {pricing.price > 0 && (
                    <span className="text-muted-foreground">
                      /{billingPeriod === 'monthly' ? 'mo' : 'yr'}
                    </span>
                  )}
                  {billingPeriod === 'yearly' && 'monthlyEquiv' in pricing && (
                    <p className="text-sm text-muted-foreground mt-1">
                      ₩{formatPrice(pricing.monthlyEquiv)}/mo equivalent
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
                  variant={meta.popular ? 'default' : 'outline'}
                >
                  {plan === 'free' ? (
                    'Get Started'
                  ) : (
                    <>
                      Subscribe
                      <ArrowRight className="ml-2 h-4 w-4" />
                    </>
                  )}
                </Button>
              </CardFooter>
            </Card>
          );
        })}
      </div>

      {/* Additional Services */}
      <div className="mt-16 max-w-4xl mx-auto">
        <h2 className="text-2xl font-bold text-center mb-8">
          Individual Services
        </h2>
        <div className="grid md:grid-cols-3 gap-4">
          <Card>
            <CardContent className="p-6 text-center">
              <h3 className="font-semibold mb-2">Saju Analysis</h3>
              <p className="text-2xl font-bold text-primary">₩5,900</p>
              <p className="text-sm text-muted-foreground">per analysis</p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-6 text-center">
              <h3 className="font-semibold mb-2">Face Reading</h3>
              <p className="text-2xl font-bold text-primary">₩5,900</p>
              <p className="text-sm text-muted-foreground">per analysis</p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-6 text-center">
              <h3 className="font-semibold mb-2">Compatibility</h3>
              <p className="text-2xl font-bold text-primary">₩9,900</p>
              <p className="text-sm text-muted-foreground">per pair</p>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* FAQ */}
      <div className="mt-16 max-w-3xl mx-auto">
        <h2 className="text-2xl font-bold text-center mb-8">
          Frequently Asked Questions
        </h2>
        <div className="space-y-4">
          <Card>
            <CardContent className="p-6">
              <div className="flex items-start gap-4">
                <HelpCircle className="h-5 w-5 text-primary shrink-0 mt-0.5" />
                <div>
                  <h3 className="font-semibold mb-1">Can I cancel anytime?</h3>
                  <p className="text-muted-foreground">
                    Yes, you can cancel your subscription at any time. You will
                    continue to have access until the end of your billing
                    period.
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
                    What payment methods do you accept?
                  </h3>
                  <p className="text-muted-foreground">
                    We accept credit/debit cards, PayPal, and local payment
                    methods including Toss Pay (Korea), LINE Pay (Japan), and
                    more.
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
                    Is there a free trial?
                  </h3>
                  <p className="text-muted-foreground">
                    Yes! You can use our Free plan forever with limited
                    features. We also offer a 7-day free trial for Pro and
                    Premium plans.
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
