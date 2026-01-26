'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Upload, Trash2, ImageIcon, Loader2, Check, AlertCircle } from 'lucide-react';
import Image from 'next/image';
import { PageHeroSettings } from '@/types/settings';

const SETTINGS_KEY = 'saju_advanced_hero';

export default function SajuAdvancedHeroSettings() {
  const [settings, setSettings] = useState<PageHeroSettings>({
    backgroundImage: '',
    overlayOpacity: 70,
  });
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  // 설정 불러오기
  useEffect(() => {
    const fetchSettings = async () => {
      try {
        const response = await fetch(`/api/site-settings?key=${SETTINGS_KEY}`);
        const result = await response.json();
        if (result.data?.value) {
          setSettings(result.data.value);
        }
      } catch (error) {
        console.error('Error fetching settings:', error);
      } finally {
        setIsLoading(false);
      }
    };
    fetchSettings();
  }, []);

  // 이미지 업로드
  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // 파일 유효성 검사
    if (!file.type.startsWith('image/')) {
      setMessage({ type: 'error', text: '이미지 파일만 업로드 가능합니다.' });
      return;
    }
    if (file.size > 5 * 1024 * 1024) {
      setMessage({ type: 'error', text: '파일 크기는 5MB 이하여야 합니다.' });
      return;
    }

    setIsUploading(true);
    setMessage(null);

    try {
      const formData = new FormData();
      formData.append('file', file);
      formData.append('folder', 'saju-advanced-hero');

      const response = await fetch('/api/site-settings/upload', {
        method: 'POST',
        body: formData,
      });

      if (!response.ok) {
        throw new Error('이미지 업로드에 실패했습니다.');
      }

      const result = await response.json();
      setSettings(prev => ({ ...prev, backgroundImage: result.url }));
      setMessage({ type: 'success', text: '이미지가 업로드되었습니다.' });
    } catch (error) {
      setMessage({ type: 'error', text: '이미지 업로드에 실패했습니다.' });
    } finally {
      setIsUploading(false);
    }
  };

  // 이미지 삭제
  const handleImageDelete = async () => {
    if (!settings.backgroundImage) return;

    try {
      const response = await fetch('/api/site-settings/upload', {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ url: settings.backgroundImage }),
      });

      if (response.ok) {
        setSettings(prev => ({ ...prev, backgroundImage: '' }));
        setMessage({ type: 'success', text: '이미지가 삭제되었습니다.' });
      }
    } catch (error) {
      setMessage({ type: 'error', text: '이미지 삭제에 실패했습니다.' });
    }
  };

  // 설정 저장
  const handleSave = async () => {
    setIsSaving(true);
    setMessage(null);

    try {
      const response = await fetch('/api/site-settings', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ key: SETTINGS_KEY, value: settings }),
      });

      if (!response.ok) {
        throw new Error('설정 저장에 실패했습니다.');
      }

      setMessage({ type: 'success', text: '설정이 저장되었습니다.' });
    } catch (error) {
      setMessage({ type: 'error', text: '설정 저장에 실패했습니다.' });
    } finally {
      setIsSaving(false);
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-12">
        <Loader2 className="h-8 w-8 animate-spin text-purple-500" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* 알림 메시지 */}
      {message && (
        <div className={`p-4 rounded-lg flex items-center gap-2 ${
          message.type === 'success'
            ? 'bg-green-50 dark:bg-green-950/30 text-green-700 dark:text-green-400'
            : 'bg-red-50 dark:bg-red-950/30 text-red-700 dark:text-red-400'
        }`}>
          {message.type === 'success' ? (
            <Check className="h-5 w-5" />
          ) : (
            <AlertCircle className="h-5 w-5" />
          )}
          {message.text}
        </div>
      )}

      {/* 배경 이미지 설정 */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <ImageIcon className="h-5 w-5 text-purple-500" />
            배경 이미지
          </CardTitle>
          <CardDescription>
            정통사주 페이지 상단 히어로 섹션의 배경 이미지를 설정합니다.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* 현재 이미지 미리보기 */}
          {settings.backgroundImage ? (
            <div className="relative">
              <div className="relative w-full aspect-[21/9] rounded-xl overflow-hidden border">
                <Image
                  src={settings.backgroundImage}
                  alt="배경 이미지"
                  fill
                  className="object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-br from-purple-900/70 via-violet-900/60 to-indigo-900/70" />
                <div className="absolute inset-0 flex items-center justify-center">
                  <span className="text-white text-2xl font-bold">정통 사주 분석</span>
                </div>
              </div>
              <Button
                variant="destructive"
                size="sm"
                className="absolute top-2 right-2"
                onClick={handleImageDelete}
              >
                <Trash2 className="h-4 w-4 mr-1" />
                삭제
              </Button>
            </div>
          ) : (
            <div className="border-2 border-dashed rounded-xl p-8 text-center">
              <ImageIcon className="h-12 w-12 mx-auto text-muted-foreground/50 mb-3" />
              <p className="text-muted-foreground text-sm">
                배경 이미지가 설정되지 않았습니다.
                <br />
                기본 그라데이션이 표시됩니다.
              </p>
            </div>
          )}

          {/* 이미지 업로드 */}
          <div>
            <Label htmlFor="hero-image">이미지 업로드</Label>
            <div className="mt-2 flex gap-2">
              <Input
                id="hero-image"
                type="file"
                accept="image/*"
                onChange={handleImageUpload}
                disabled={isUploading}
                className="flex-1"
              />
              {isUploading && (
                <div className="flex items-center px-4">
                  <Loader2 className="h-5 w-5 animate-spin text-purple-500" />
                </div>
              )}
            </div>
            <p className="text-xs text-muted-foreground mt-1">
              권장 크기: 1920x600 이상, 최대 5MB (JPG, PNG, WebP)
            </p>
          </div>

          {/* 오버레이 투명도 */}
          <div>
            <Label htmlFor="overlay-opacity">오버레이 투명도: {settings.overlayOpacity}%</Label>
            <input
              id="overlay-opacity"
              type="range"
              min="0"
              max="100"
              value={settings.overlayOpacity || 70}
              onChange={(e) => setSettings(prev => ({ ...prev, overlayOpacity: parseInt(e.target.value) }))}
              className="w-full mt-2"
            />
            <p className="text-xs text-muted-foreground mt-1">
              배경 이미지 위에 표시되는 그라데이션 오버레이의 투명도
            </p>
          </div>
        </CardContent>
      </Card>

      {/* 저장 버튼 */}
      <div className="flex justify-end">
        <Button
          onClick={handleSave}
          disabled={isSaving}
          className="bg-gradient-to-r from-purple-500 to-indigo-500 hover:from-purple-600 hover:to-indigo-600"
        >
          {isSaving ? (
            <Loader2 className="h-4 w-4 mr-2 animate-spin" />
          ) : (
            <Check className="h-4 w-4 mr-2" />
          )}
          설정 저장
        </Button>
      </div>
    </div>
  );
}
