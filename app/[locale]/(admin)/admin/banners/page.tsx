'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import {
  Image as ImageIcon,
  Save,
  RefreshCw,
  AlertCircle,
  CheckCircle2,
  Link as LinkIcon,
  Eye,
  EyeOff,
} from 'lucide-react';
import type { LottoBannerSettings } from '@/types/settings';
import { DEFAULT_LOTTO_BANNER_SETTINGS } from '@/types/settings';

export default function AdminBannersPage() {
  const [settings, setSettings] = useState<LottoBannerSettings>(DEFAULT_LOTTO_BANNER_SETTINGS);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [previewMode, setPreviewMode] = useState(false);

  // 설정 불러오기
  useEffect(() => {
    async function loadSettings() {
      try {
        const res = await fetch('/api/admin/settings?key=lotto_banner');
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
        body: JSON.stringify({ key: 'lotto_banner', value: settings }),
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
    if (confirm('배너 설정을 기본값으로 초기화하시겠습니까?')) {
      setSettings(DEFAULT_LOTTO_BANNER_SETTINGS);
    }
  };

  return (
    <div className="space-y-6">
      {/* 헤더 */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold flex items-center gap-2">
            <ImageIcon className="h-6 w-6 text-purple-600" />
            배너 관리
          </h1>
          <p className="text-muted-foreground text-sm mt-1">
            로또 페이지 상단 배너 이미지를 설정합니다
          </p>
        </div>
        <div className="flex gap-2">
          <Button
            variant="outline"
            onClick={() => setPreviewMode(!previewMode)}
          >
            {previewMode ? <EyeOff className="h-4 w-4 mr-2" /> : <Eye className="h-4 w-4 mr-2" />}
            {previewMode ? '미리보기 닫기' : '미리보기'}
          </Button>
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

      {/* 미리보기 */}
      {previewMode && settings.imageUrl && (
        <Card className="overflow-hidden">
          <CardHeader className="pb-2">
            <CardTitle className="text-base">배너 미리보기</CardTitle>
          </CardHeader>
          <CardContent>
            <div
              className="relative w-full overflow-hidden"
              style={{
                maxHeight: settings.style?.maxHeight || '200px',
                borderRadius: settings.style?.borderRadius || '12px',
              }}
            >
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={settings.imageUrl}
                alt="Banner Preview"
                className="w-full h-auto object-cover"
              />
            </div>
          </CardContent>
        </Card>
      )}

      {/* 로또 배너 설정 */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            <span className="flex items-center gap-2">
              <ImageIcon className="h-5 w-5 text-purple-500" />
              로또 페이지 배너
            </span>
            <Badge variant={settings.enabled ? 'default' : 'secondary'}>
              {settings.enabled ? '활성' : '비활성'}
            </Badge>
          </CardTitle>
          <CardDescription>
            로또 분석 페이지 상단에 표시되는 프로모션 배너
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* 활성화 토글 */}
          <div className="flex items-center gap-3">
            <input
              type="checkbox"
              id="banner-enabled"
              checked={settings.enabled}
              onChange={(e) => setSettings({ ...settings, enabled: e.target.checked })}
              className="rounded w-5 h-5"
            />
            <Label htmlFor="banner-enabled" className="text-base font-medium">
              배너 표시
            </Label>
          </div>

          {/* 이미지 URL */}
          <div className="space-y-2">
            <Label className="flex items-center gap-2">
              <ImageIcon className="h-4 w-4" />
              이미지 URL
            </Label>
            <Input
              value={settings.imageUrl || ''}
              onChange={(e) => setSettings({ ...settings, imageUrl: e.target.value })}
              placeholder="https://example.com/banner.jpg"
            />
            <p className="text-xs text-muted-foreground">
              권장 크기: 1200 x 200px (가로형 배너)
            </p>
          </div>

          {/* 링크 URL */}
          <div className="space-y-2">
            <Label className="flex items-center gap-2">
              <LinkIcon className="h-4 w-4" />
              클릭 시 이동할 URL (선택)
            </Label>
            <Input
              value={settings.linkUrl || ''}
              onChange={(e) => setSettings({ ...settings, linkUrl: e.target.value })}
              placeholder="https://example.com/promotion"
            />
          </div>

          {/* 대체 텍스트 */}
          <div className="space-y-4">
            <Label>대체 텍스트 (Alt Text)</Label>
            <div className="grid md:grid-cols-3 gap-4">
              <div>
                <Label className="text-xs text-muted-foreground">한국어</Label>
                <Input
                  value={settings.altText?.ko || ''}
                  onChange={(e) => setSettings({
                    ...settings,
                    altText: {
                      ko: e.target.value,
                      ja: settings.altText?.ja || '',
                      en: settings.altText?.en || '',
                    }
                  })}
                  placeholder="로또 특별 이벤트"
                />
              </div>
              <div>
                <Label className="text-xs text-muted-foreground">일본어</Label>
                <Input
                  value={settings.altText?.ja || ''}
                  onChange={(e) => setSettings({
                    ...settings,
                    altText: {
                      ko: settings.altText?.ko || '',
                      ja: e.target.value,
                      en: settings.altText?.en || '',
                    }
                  })}
                  placeholder="ロト特別イベント"
                />
              </div>
              <div>
                <Label className="text-xs text-muted-foreground">영어</Label>
                <Input
                  value={settings.altText?.en || ''}
                  onChange={(e) => setSettings({
                    ...settings,
                    altText: {
                      ko: settings.altText?.ko || '',
                      ja: settings.altText?.ja || '',
                      en: e.target.value,
                    }
                  })}
                  placeholder="Lotto Special Event"
                />
              </div>
            </div>
          </div>

          {/* 스타일 설정 */}
          <div className="space-y-4">
            <Label>스타일 설정</Label>
            <div className="grid md:grid-cols-2 gap-4">
              <div>
                <Label className="text-xs text-muted-foreground">모서리 둥글기</Label>
                <Input
                  value={settings.style?.borderRadius || '12px'}
                  onChange={(e) => setSettings({
                    ...settings,
                    style: {
                      ...settings.style,
                      borderRadius: e.target.value,
                    }
                  })}
                  placeholder="12px"
                />
              </div>
              <div>
                <Label className="text-xs text-muted-foreground">최대 높이</Label>
                <Input
                  value={settings.style?.maxHeight || '200px'}
                  onChange={(e) => setSettings({
                    ...settings,
                    style: {
                      ...settings.style,
                      maxHeight: e.target.value,
                    }
                  })}
                  placeholder="200px"
                />
              </div>
            </div>
          </div>

          {/* 위치 */}
          <div className="space-y-2">
            <Label>배너 위치</Label>
            <div className="flex gap-4">
              <label className="flex items-center gap-2">
                <input
                  type="radio"
                  name="position"
                  checked={settings.position === 'top'}
                  onChange={() => setSettings({ ...settings, position: 'top' })}
                  className="rounded"
                />
                상단
              </label>
              <label className="flex items-center gap-2">
                <input
                  type="radio"
                  name="position"
                  checked={settings.position === 'bottom'}
                  onChange={() => setSettings({ ...settings, position: 'bottom' })}
                  className="rounded"
                />
                하단
              </label>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* 도움말 */}
      <Card className="bg-blue-50 dark:bg-blue-950/30 border-blue-200">
        <CardContent className="p-4">
          <h3 className="font-medium mb-2">배너 이미지 가이드</h3>
          <ul className="text-sm text-muted-foreground space-y-1">
            <li>권장 이미지 크기: 1200 x 200px (가로형)</li>
            <li>지원 형식: JPG, PNG, WebP</li>
            <li>파일 크기: 500KB 이하 권장</li>
            <li>이미지 호스팅: Supabase Storage 또는 외부 CDN 사용</li>
          </ul>
        </CardContent>
      </Card>
    </div>
  );
}
