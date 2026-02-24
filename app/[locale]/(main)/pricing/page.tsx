'use client';

import { useState } from 'react';
import { useTranslations, useLocale } from 'next-intl';
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
  Gift,
  Cat,
  FlipVertical,
  Brain,
  Sun,
} from 'lucide-react';
import {
  SUBSCRIPTION_TIERS,
  ANALYSIS_PRODUCTS,
  FREE_SERVICES,
  getCurrencyFromLocale,
  formatPrice,
  type Currency,
} from '@/lib/payment/pricing';

type LocaleKey = 'ko' | 'ja' | 'en';

const planKeys = ['free', 'basic', 'pro', 'premium'] as const;

const planMeta: Record<string, { icon: typeof Star; color: string; bgColor: string; popular?: boolean }> = {
  free: { icon: Star, color: 'text-gray-500', bgColor: 'bg-gray-100' },
  basic: { icon: Zap, color: 'text-blue-500', bgColor: 'bg-blue-100' },
  pro: { icon: Sparkles, color: 'text-purple-500', bgColor: 'bg-purple-100', popular: true },
  premium: { icon: Crown, color: 'text-yellow-500', bgColor: 'bg-yellow-100' },
};

function getPlanPrice(plan: string, currency: Currency, yearly: boolean): number {
  if (plan === 'free') return 0;
  const tier = SUBSCRIPTION_TIERS[plan];
  if (!tier) return 0;
  const monthly = tier.price[currency];
  return yearly ? Math.round(monthly * 10) : monthly;
}

function getFeatureKeys(plan: string): { text: string; included: boolean }[] {
  const allFeatures: Record<string, { text: string; included: boolean }[]> = {
    free: [
      { text: 'feature_daily_fortune', included: true },
      { text: 'feature_tarot', included: true },
      { text: 'feature_mbti', included: true },
      { text: 'feature_animal', included: true },
      { text: 'feature_ad_free', included: false },
      { text: 'feature_paid_services', included: false },
    ],
    basic: [
      { text: 'feature_all_free', included: true },
      { text: 'feature_saju_3', included: true },
      { text: 'feature_ad_free', included: true },
      { text: 'feature_pdf', included: true },
      { text: 'feature_priority', included: false },
    ],
    pro: [
      { text: 'feature_all_basic', included: true },
      { text: 'feature_unlimited_paid', included: true },
      { text: 'feature_pdf', included: true },
      { text: 'feature_voice', included: true },
      { text: 'feature_priority', included: true },
    ],
    premium: [
      { text: 'feature_all_pro', included: true },
      { text: 'feature_family', included: true },
      { text: 'feature_expert', included: true },
      { text: 'feature_early_access', included: true },
      { text: 'feature_dedicated', included: true },
    ],
  };
  return allFeatures[plan] ?? [];
}

const freeServiceIcons: Record<string, typeof Sun> = {
  daily_fortune: Sun,
  tarot: FlipVertical,
  mbti_fortune: Brain,
  animal_fortune: Cat,
};

export default function PricingPage() {
  const t = useTranslations('pricing');
  const locale = useLocale() as LocaleKey;
  const currency = getCurrencyFromLocale(locale);
  const [billingPeriod, setBillingPeriod] = useState<'monthly' | 'yearly'>('monthly');
  const yearly = billingPeriod === 'yearly';

  const paidServiceKeys = Object.keys(ANALYSIS_PRODUCTS) as string[];
  const freeServiceKeys = Object.keys(FREE_SERVICES) as string[];

  return (
    <div className="container mx-auto px-4 py-8 md:py-16">
      {/* Header */}
      <div className="text-center mb-12">
        <Badge className="mb-4 bg-primary/10 text-primary">
          <Sparkles className="mr-1 h-3 w-3" />
          {t('title')}
        </Badge>
        <h1 className="text-3xl md:text-5xl font-bold mb-4">{t('title')}</h1>
        <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
          {t('subtitle')}
        </p>
      </div>

      {/* ===== FREE SERVICES SECTION ===== */}
      <div className="mb-16 max-w-4xl mx-auto">
        <div className="text-center mb-8">
          <div className="flex items-center justify-center gap-2 mb-2">
            <Gift className="h-5 w-5 text-green-500" />
            <h2 className="text-2xl font-bold">{t('freeSection')}</h2>
          </div>
          <p className="text-muted-foreground">{t('freeSubtitle')}</p>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {freeServiceKeys.map((key) => {
            const service = FREE_SERVICES[key];
            if (!service) return null;
            const Icon = freeServiceIcons[key] || Star;
            return (
              <Card key={key} className="text-center hover:shadow-md transition-shadow">
                <CardContent className="p-6">
                  <div className="w-12 h-12 rounded-full bg-green-100 flex items-center justify-center mx-auto mb-3">
                    <Icon className="h-6 w-6 text-green-600" />
                  </div>
                  <h3 className="font-semibold mb-1">{service.name[locale]}</h3>
                  <p className="text-xs text-muted-foreground mb-3">{service.description[locale]}</p>
                  <Badge className="bg-green-500 text-white">{t('freeLabel')}</Badge>
                </CardContent>
              </Card>
            );
          })}
        </div>
      </div>

      {/* ===== PAID SERVICES SECTION ===== */}
      <div className="mb-16 max-w-4xl mx-auto">
        <div className="text-center mb-8">
          <h2 className="text-2xl font-bold">{t('paidSection')}</h2>
          <p className="text-muted-foreground">{t('paidSubtitle')}</p>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {paidServiceKeys.map((key) => {
            const product = ANALYSIS_PRODUCTS[key];
            if (!product) return null;
            return (
              <Card key={key} className="text-center hover:shadow-md transition-shadow">
                <CardContent className="p-6">
                  <h3 className="font-semibold mb-2">{product.name[locale]}</h3>
                  <p className="text-xs text-muted-foreground mb-3">{product.description[locale]}</p>
                  <p className="text-2xl font-bold text-primary">
                    {formatPrice(product.price[currency], currency)}
                  </p>
                  <p className="text-xs text-muted-foreground">{t('perUse')}</p>
                </CardContent>
              </Card>
            );
          })}
        </div>
      </div>

      {/* ===== SUBSCRIPTION PLANS ===== */}
      <div className="mb-16">
        <div className="text-center mb-8">
          <h2 className="text-2xl font-bold">{t('subscriptionSection')}</h2>
          <p className="text-muted-foreground">{t('subscriptionSubtitle')}</p>
        </div>

        {/* Billing Toggle */}
        <div className="flex justify-center mb-8">
          <Tabs
            value={billingPeriod}
            onValueChange={(v) => setBillingPeriod(v as 'monthly' | 'yearly')}
          >
            <TabsList className="grid grid-cols-2 w-64">
              <TabsTrigger value="monthly">{t('monthly')}</TabsTrigger>
              <TabsTrigger value="yearly" className="relative">
                {t('yearly')}
                <Badge className="absolute -top-3 -right-3 bg-green-500 text-white text-xs">
                  {t('yearlyDiscount')}
                </Badge>
              </TabsTrigger>
            </TabsList>
          </Tabs>
        </div>

        {/* Plans Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 max-w-7xl mx-auto">
          {planKeys.map((plan) => {
            const meta = planMeta[plan];
            const Icon = meta.icon;
            const price = getPlanPrice(plan, currency, yearly);
            const planFeatures = getFeatureKeys(plan);

            return (
              <Card
                key={plan}
                className={`relative ${
                  meta.popular ? 'border-primary shadow-lg scale-105 z-10' : ''
                }`}
              >
                {meta.popular && (
                  <div className="absolute -top-4 left-1/2 -translate-x-1/2">
                    <Badge className="bg-primary text-primary-foreground">
                      {t('popular')}
                    </Badge>
                  </div>
                )}
                <CardHeader className="text-center pb-2">
                  <div className={`w-12 h-12 rounded-full ${meta.bgColor} flex items-center justify-center mx-auto mb-4`}>
                    <Icon className={`h-6 w-6 ${meta.color}`} />
                  </div>
                  <CardTitle className="text-xl">
                    {t(`tiers.${plan}.name` as `tiers.free.name`)}
                  </CardTitle>
                  <CardDescription>
                    {plan !== 'free' && SUBSCRIPTION_TIERS[plan]
                      ? SUBSCRIPTION_TIERS[plan].description[locale]
                      : t(`tiers.${plan}.features.0` as `tiers.free.features.0`)}
                  </CardDescription>
                </CardHeader>
                <CardContent className="text-center">
                  <div className="mb-6">
                    {price === 0 ? (
                      <span className="text-4xl font-bold">{t('tiers.free.name')}</span>
                    ) : (
                      <>
                        <span className="text-4xl font-bold">
                          {formatPrice(price, currency)}
                        </span>
                        <span className="text-muted-foreground">
                          /{yearly ? (locale === 'ko' ? '년' : locale === 'ja' ? '年' : 'yr') : (locale === 'ko' ? '월' : locale === 'ja' ? '月' : 'mo')}
                        </span>
                        {yearly && (
                          <p className="text-sm text-muted-foreground mt-1">
                            {formatPrice(Math.round(price / 12), currency)}/{locale === 'ko' ? '월' : locale === 'ja' ? '月' : 'mo'}
                          </p>
                        )}
                      </>
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
                        <span className={feature.included ? '' : 'text-muted-foreground'}>
                          {t(`features.${feature.text}` as `features.feature_daily_fortune`)}
                        </span>
                      </li>
                    ))}
                  </ul>
                </CardContent>
                <CardFooter>
                  <Button className="w-full" variant={meta.popular ? 'default' : 'outline'}>
                    {plan === 'free' ? (
                      t('cta.current')
                    ) : (
                      <>
                        {t('cta.subscribe')}
                        <ArrowRight className="ml-2 h-4 w-4" />
                      </>
                    )}
                  </Button>
                </CardFooter>
              </Card>
            );
          })}
        </div>
      </div>

      {/* FAQ */}
      <div className="max-w-3xl mx-auto">
        <h2 className="text-2xl font-bold text-center mb-8">{t('faq.title')}</h2>
        <div className="space-y-4">
          {(['cancel', 'payment', 'trial'] as const).map((faq) => (
            <Card key={faq}>
              <CardContent className="p-6">
                <div className="flex items-start gap-4">
                  <HelpCircle className="h-5 w-5 text-primary shrink-0 mt-0.5" />
                  <div>
                    <h3 className="font-semibold mb-1">{t(`faq.${faq}.q` as `faq.cancel.q`)}</h3>
                    <p className="text-muted-foreground">{t(`faq.${faq}.a` as `faq.cancel.a`)}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
}
