'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import {
  DollarSign,
  Save,
  RefreshCw,
  AlertCircle,
  CheckCircle2,
  Percent,
  Coins,
  CreditCard,
  Sparkles,
} from 'lucide-react';
import type { ServicePriceSettings, PriceConfig, CoinPackageConfig } from '@/types/settings';
import { DEFAULT_PRICE_SETTINGS } from '@/types/settings';

// 가격 입력 카드 컴포넌트
function PriceCard({
  title,
  description,
  config,
  onChange,
  showDiscount = true,
}: {
  title: string;
  description?: string;
  config: PriceConfig;
  onChange: (config: PriceConfig) => void;
  showDiscount?: boolean;
}) {
  return (
    <Card>
      <CardHeader className="pb-3">
        <CardTitle className="text-base flex items-center justify-between">
          {title}
          <Badge variant={config.isActive ? 'default' : 'secondary'}>
            {config.isActive ? '활성' : '비활성'}
          </Badge>
        </CardTitle>
        {description && (
          <CardDescription className="text-xs">{description}</CardDescription>
        )}
      </CardHeader>
      <CardContent className="space-y-3">
        <div className="grid grid-cols-3 gap-2">
          <div>
            <Label className="text-xs">KRW</Label>
            <Input
              type="number"
              value={config.krw}
              onChange={(e) => onChange({ ...config, krw: parseInt(e.target.value) || 0 })}
              className="h-8"
            />
          </div>
          <div>
            <Label className="text-xs">JPY</Label>
            <Input
              type="number"
              value={config.jpy}
              onChange={(e) => onChange({ ...config, jpy: parseInt(e.target.value) || 0 })}
              className="h-8"
            />
          </div>
          <div>
            <Label className="text-xs">USD</Label>
            <Input
              type="number"
              step="0.01"
              value={config.usd}
              onChange={(e) => onChange({ ...config, usd: parseFloat(e.target.value) || 0 })}
              className="h-8"
            />
          </div>
        </div>
        {showDiscount && (
          <div className="flex items-center gap-2">
            <Label className="text-xs whitespace-nowrap">할인율</Label>
            <div className="relative flex-1">
              <Input
                type="number"
                value={config.discountPercent || 0}
                onChange={(e) => onChange({ ...config, discountPercent: parseInt(e.target.value) || 0 })}
                className="h-8 pr-8"
              />
              <Percent className="absolute right-2 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            </div>
          </div>
        )}
        <div className="flex items-center gap-2">
          <input
            type="checkbox"
            id={`active-${title}`}
            checked={config.isActive}
            onChange={(e) => onChange({ ...config, isActive: e.target.checked })}
            className="rounded"
          />
          <Label htmlFor={`active-${title}`} className="text-xs">활성화</Label>
        </div>
      </CardContent>
    </Card>
  );
}

// 코인 패키지 카드 컴포넌트
function CoinPackageCard({
  title,
  config,
  onChange,
}: {
  title: string;
  config: CoinPackageConfig;
  onChange: (config: CoinPackageConfig) => void;
}) {
  return (
    <Card>
      <CardHeader className="pb-3">
        <CardTitle className="text-base flex items-center gap-2">
          <Coins className="h-4 w-4 text-yellow-500" />
          {title}
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-3">
        <div className="grid grid-cols-2 gap-2">
          <div>
            <Label className="text-xs">코인 수량</Label>
            <Input
              type="number"
              value={config.coins}
              onChange={(e) => onChange({ ...config, coins: parseInt(e.target.value) || 0 })}
              className="h-8"
            />
          </div>
          <div>
            <Label className="text-xs">보너스</Label>
            <Input
              type="number"
              value={config.bonus}
              onChange={(e) => onChange({ ...config, bonus: parseInt(e.target.value) || 0 })}
              className="h-8"
            />
          </div>
        </div>
        <div className="grid grid-cols-3 gap-2">
          <div>
            <Label className="text-xs">KRW</Label>
            <Input
              type="number"
              value={config.krw}
              onChange={(e) => onChange({ ...config, krw: parseInt(e.target.value) || 0 })}
              className="h-8"
            />
          </div>
          <div>
            <Label className="text-xs">JPY</Label>
            <Input
              type="number"
              value={config.jpy}
              onChange={(e) => onChange({ ...config, jpy: parseInt(e.target.value) || 0 })}
              className="h-8"
            />
          </div>
          <div>
            <Label className="text-xs">USD</Label>
            <Input
              type="number"
              step="0.01"
              value={config.usd}
              onChange={(e) => onChange({ ...config, usd: parseFloat(e.target.value) || 0 })}
              className="h-8"
            />
          </div>
        </div>
        <div className="flex items-center gap-2">
          <input
            type="checkbox"
            id={`coin-active-${title}`}
            checked={config.isActive}
            onChange={(e) => onChange({ ...config, isActive: e.target.checked })}
            className="rounded"
          />
          <Label htmlFor={`coin-active-${title}`} className="text-xs">활성화</Label>
        </div>
      </CardContent>
    </Card>
  );
}

export default function AdminPricingPage() {
  const [settings, setSettings] = useState<ServicePriceSettings>(DEFAULT_PRICE_SETTINGS);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // 설정 불러오기
  useEffect(() => {
    async function loadSettings() {
      try {
        const res = await fetch('/api/admin/settings?key=pricing');
        if (res.ok) {
          const data = await res.json();
          if (data.value) {
            setSettings(data.value);
          }
        }
      } catch (e) {
        console.error('Failed to load settings:', e);
      }
    }
    loadSettings();
  }, []);

  // 설정 저장
  const handleSave = async () => {
    setSaving(true);
    setError(null);
    setSaved(false);

    try {
      const res = await fetch('/api/admin/settings', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ key: 'pricing', value: settings }),
      });

      if (!res.ok) {
        throw new Error('저장 실패');
      }

      setSaved(true);
      setTimeout(() => setSaved(false), 3000);
    } catch (e) {
      setError('설정 저장에 실패했습니다.');
    } finally {
      setSaving(false);
    }
  };

  // 기본값으로 리셋
  const handleReset = () => {
    if (confirm('모든 가격을 기본값으로 초기화하시겠습니까?')) {
      setSettings(DEFAULT_PRICE_SETTINGS);
    }
  };

  // 부분 업데이트 헬퍼
  const updateSajuPrice = (tier: keyof typeof settings.saju, config: PriceConfig) => {
    setSettings({ ...settings, saju: { ...settings.saju, [tier]: config } });
  };

  const updateSubscriptionPrice = (tier: keyof typeof settings.subscription, config: PriceConfig) => {
    setSettings({ ...settings, subscription: { ...settings.subscription, [tier]: config } });
  };

  const updateCoinPackage = (tier: keyof typeof settings.coins, config: CoinPackageConfig) => {
    setSettings({ ...settings, coins: { ...settings.coins, [tier]: config } });
  };

  return (
    <div className="space-y-6">
      {/* 헤더 */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold flex items-center gap-2">
            <DollarSign className="h-6 w-6 text-green-600" />
            가격 설정
          </h1>
          <p className="text-muted-foreground text-sm mt-1">
            서비스별 가격과 할인율을 설정합니다
          </p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" onClick={handleReset}>
            <RefreshCw className="h-4 w-4 mr-2" />
            초기화
          </Button>
          <Button onClick={handleSave} disabled={saving}>
            {saving ? (
              <RefreshCw className="h-4 w-4 mr-2 animate-spin" />
            ) : (
              <Save className="h-4 w-4 mr-2" />
            )}
            저장
          </Button>
        </div>
      </div>

      {/* 상태 메시지 */}
      {error && (
        <div className="flex items-center gap-2 p-3 bg-red-50 text-red-700 rounded-lg">
          <AlertCircle className="h-4 w-4" />
          {error}
        </div>
      )}
      {saved && (
        <div className="flex items-center gap-2 p-3 bg-green-50 text-green-700 rounded-lg">
          <CheckCircle2 className="h-4 w-4" />
          설정이 저장되었습니다
        </div>
      )}

      {/* 탭 컨텐츠 */}
      <Tabs defaultValue="saju" className="space-y-4">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="saju" className="flex items-center gap-1">
            <Sparkles className="h-4 w-4" />
            사주 분석
          </TabsTrigger>
          <TabsTrigger value="other" className="flex items-center gap-1">
            <DollarSign className="h-4 w-4" />
            기타 분석
          </TabsTrigger>
          <TabsTrigger value="subscription" className="flex items-center gap-1">
            <CreditCard className="h-4 w-4" />
            구독
          </TabsTrigger>
          <TabsTrigger value="coins" className="flex items-center gap-1">
            <Coins className="h-4 w-4" />
            코인
          </TabsTrigger>
        </TabsList>

        {/* 사주 분석 가격 */}
        <TabsContent value="saju" className="space-y-4">
          <div className="grid md:grid-cols-3 gap-4">
            <PriceCard
              title="기본 분석"
              description="사주팔자 기본 분석 및 2025년 운세"
              config={settings.saju.basic}
              onChange={(config) => updateSajuPrice('basic', config)}
            />
            <PriceCard
              title="심층 분석"
              description="대운 분석 포함 10년 운세"
              config={settings.saju.deep}
              onChange={(config) => updateSajuPrice('deep', config)}
            />
            <PriceCard
              title="프리미엄 분석"
              description="월별 상세 운세 + PDF + 음성"
              config={settings.saju.premium}
              onChange={(config) => updateSajuPrice('premium', config)}
            />
          </div>
        </TabsContent>

        {/* 기타 분석 가격 */}
        <TabsContent value="other" className="space-y-4">
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4">
            <PriceCard
              title="관상 분석"
              description="AI 얼굴 분석"
              config={settings.face.basic}
              onChange={(config) => setSettings({ ...settings, face: { basic: config } })}
            />
            <PriceCard
              title="통합 분석"
              description="사주 + 관상 + 별자리"
              config={settings.integrated.standard}
              onChange={(config) => setSettings({ ...settings, integrated: { standard: config } })}
            />
            <PriceCard
              title="궁합 분석"
              description="두 사람의 사주 궁합"
              config={settings.compatibility.standard}
              onChange={(config) => setSettings({
                ...settings,
                compatibility: { ...settings.compatibility, standard: config }
              })}
            />
            <PriceCard
              title="다자간 궁합"
              description="2~5인 동시 분석"
              config={settings.compatibility.group}
              onChange={(config) => setSettings({
                ...settings,
                compatibility: { ...settings.compatibility, group: config }
              })}
            />
          </div>
        </TabsContent>

        {/* 구독 가격 */}
        <TabsContent value="subscription" className="space-y-4">
          <div className="grid md:grid-cols-3 gap-4">
            <PriceCard
              title="베이직"
              description="개인 사용자를 위한 기본 플랜"
              config={settings.subscription.basic}
              onChange={(config) => updateSubscriptionPrice('basic', config)}
              showDiscount={false}
            />
            <PriceCard
              title="프로"
              description="더 많은 분석이 필요한 분"
              config={settings.subscription.pro}
              onChange={(config) => updateSubscriptionPrice('pro', config)}
              showDiscount={false}
            />
            <PriceCard
              title="프리미엄"
              description="모든 기능 무제한 이용"
              config={settings.subscription.premium}
              onChange={(config) => updateSubscriptionPrice('premium', config)}
              showDiscount={false}
            />
          </div>
        </TabsContent>

        {/* 코인 패키지 */}
        <TabsContent value="coins" className="space-y-4">
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4">
            <CoinPackageCard
              title="100 코인"
              config={settings.coins.c100}
              onChange={(config) => updateCoinPackage('c100', config)}
            />
            <CoinPackageCard
              title="500 코인"
              config={settings.coins.c500}
              onChange={(config) => updateCoinPackage('c500', config)}
            />
            <CoinPackageCard
              title="1000 코인"
              config={settings.coins.c1000}
              onChange={(config) => updateCoinPackage('c1000', config)}
            />
            <CoinPackageCard
              title="3000 코인"
              config={settings.coins.c3000}
              onChange={(config) => updateCoinPackage('c3000', config)}
            />
          </div>
        </TabsContent>
      </Tabs>

      {/* 글로벌 할인 설정 */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Percent className="h-5 w-5 text-orange-500" />
            글로벌 할인 설정
          </CardTitle>
          <CardDescription>
            전체 서비스에 적용되는 할인 이벤트를 설정합니다
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2">
              <input
                type="checkbox"
                id="global-discount-enabled"
                checked={settings.globalDiscount?.enabled || false}
                onChange={(e) => setSettings({
                  ...settings,
                  globalDiscount: {
                    ...settings.globalDiscount,
                    enabled: e.target.checked,
                    percent: settings.globalDiscount?.percent || 10,
                  }
                })}
                className="rounded"
              />
              <Label htmlFor="global-discount-enabled">할인 활성화</Label>
            </div>
            {settings.globalDiscount?.enabled && (
              <div className="flex items-center gap-2">
                <Label className="whitespace-nowrap">할인율</Label>
                <div className="relative w-24">
                  <Input
                    type="number"
                    value={settings.globalDiscount?.percent || 0}
                    onChange={(e) => setSettings({
                      ...settings,
                      globalDiscount: {
                        ...settings.globalDiscount,
                        enabled: true,
                        percent: parseInt(e.target.value) || 0,
                      }
                    })}
                    className="pr-8"
                  />
                  <Percent className="absolute right-2 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                </div>
              </div>
            )}
          </div>
          {settings.globalDiscount?.enabled && (
            <div className="grid md:grid-cols-3 gap-4">
              <div>
                <Label>메시지 (KO)</Label>
                <Input
                  value={settings.globalDiscount?.message?.ko || ''}
                  onChange={(e) => setSettings({
                    ...settings,
                    globalDiscount: {
                      ...settings.globalDiscount,
                      enabled: true,
                      percent: settings.globalDiscount?.percent || 10,
                      message: {
                        ...settings.globalDiscount?.message,
                        ko: e.target.value,
                        ja: settings.globalDiscount?.message?.ja || '',
                        en: settings.globalDiscount?.message?.en || '',
                      }
                    }
                  })}
                  placeholder="특별 할인 이벤트!"
                />
              </div>
              <div>
                <Label>메시지 (JA)</Label>
                <Input
                  value={settings.globalDiscount?.message?.ja || ''}
                  onChange={(e) => setSettings({
                    ...settings,
                    globalDiscount: {
                      ...settings.globalDiscount,
                      enabled: true,
                      percent: settings.globalDiscount?.percent || 10,
                      message: {
                        ...settings.globalDiscount?.message,
                        ko: settings.globalDiscount?.message?.ko || '',
                        ja: e.target.value,
                        en: settings.globalDiscount?.message?.en || '',
                      }
                    }
                  })}
                  placeholder="特別割引イベント！"
                />
              </div>
              <div>
                <Label>메시지 (EN)</Label>
                <Input
                  value={settings.globalDiscount?.message?.en || ''}
                  onChange={(e) => setSettings({
                    ...settings,
                    globalDiscount: {
                      ...settings.globalDiscount,
                      enabled: true,
                      percent: settings.globalDiscount?.percent || 10,
                      message: {
                        ...settings.globalDiscount?.message,
                        ko: settings.globalDiscount?.message?.ko || '',
                        ja: settings.globalDiscount?.message?.ja || '',
                        en: e.target.value,
                      }
                    }
                  })}
                  placeholder="Special Discount Event!"
                />
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
