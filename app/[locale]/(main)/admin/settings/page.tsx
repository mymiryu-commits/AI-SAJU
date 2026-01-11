'use client';

import { useState, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { useLogo } from '@/lib/hooks/useLogo';
import {
  Upload,
  Trash2,
  Image as ImageIcon,
  Settings,
  CheckCircle,
  AlertCircle,
  Loader2,
  ArrowRight,
  Layers,
  Cloud,
} from 'lucide-react';
import { Link } from '@/i18n/routing';

export default function AdminSettingsPage() {
  const { siteLogo, aiLogo, isLoaded, isUploading, setSiteLogo, setAiLogo } = useLogo();
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  const siteLogoInputRef = useRef<HTMLInputElement>(null);
  const aiLogoInputRef = useRef<HTMLInputElement>(null);

  const handleFileUpload = async (file: File, type: 'site' | 'ai') => {
    setMessage(null);

    const result = type === 'site'
      ? await setSiteLogo(file)
      : await setAiLogo(file);

    if (result.success) {
      setMessage({ type: 'success', text: '로고가 성공적으로 업로드되었습니다.' });
    } else {
      setMessage({ type: 'error', text: result.error || '업로드 중 오류가 발생했습니다.' });
    }
  };

  const handleDelete = async (type: 'site' | 'ai') => {
    const result = type === 'site'
      ? await setSiteLogo(null)
      : await setAiLogo(null);

    if (result.success) {
      setMessage({ type: 'success', text: '로고가 삭제되었습니다.' });
    } else {
      setMessage({ type: 'error', text: '삭제 중 오류가 발생했습니다.' });
    }
  };

  if (!isLoaded) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-8 max-w-4xl">
        {/* Header */}
        <div className="flex items-center gap-3 mb-8">
          <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-amber-100 to-orange-100 dark:from-amber-900/30 dark:to-orange-900/30 flex items-center justify-center">
            <Settings className="h-6 w-6 text-amber-600 dark:text-amber-400" />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-foreground">사이트 설정</h1>
            <p className="text-muted-foreground text-sm flex items-center gap-2">
              로고 및 브랜딩 설정을 관리합니다
              <span className="inline-flex items-center gap-1 text-xs text-emerald-600 dark:text-emerald-400">
                <Cloud className="h-3 w-3" />
                서버 저장
              </span>
            </p>
          </div>
        </div>

        {/* Message */}
        {message && (
          <div className={`mb-6 p-4 rounded-xl flex items-center gap-3 ${
            message.type === 'success'
              ? 'bg-emerald-100 dark:bg-emerald-900/30 text-emerald-700 dark:text-emerald-300'
              : 'bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-300'
          }`}>
            {message.type === 'success' ? (
              <CheckCircle className="h-5 w-5" />
            ) : (
              <AlertCircle className="h-5 w-5" />
            )}
            <span className="text-sm font-medium">{message.text}</span>
          </div>
        )}

        <div className="grid md:grid-cols-2 gap-6">
          {/* Site Logo */}
          <div className="bg-card border border-border rounded-2xl p-6">
            <h2 className="text-lg font-bold text-foreground mb-2">메인 로고</h2>
            <p className="text-muted-foreground text-sm mb-6">
              헤더에 표시되는 사이트 메인 로고입니다. (권장: 200x50px)
            </p>

            {/* Preview */}
            <div className="mb-6">
              <label className="text-sm font-medium text-muted-foreground mb-2 block">미리보기</label>
              <div className="w-full h-24 rounded-xl bg-secondary/50 border-2 border-dashed border-border flex items-center justify-center">
                {siteLogo ? (
                  <img
                    src={siteLogo}
                    alt="Site Logo"
                    className="max-h-16 max-w-[180px] object-contain"
                  />
                ) : (
                  <div className="text-center">
                    <ImageIcon className="h-8 w-8 text-muted-foreground mx-auto mb-1" />
                    <span className="text-xs text-muted-foreground">로고 없음</span>
                  </div>
                )}
              </div>
            </div>

            {/* Upload Button */}
            <input
              ref={siteLogoInputRef}
              type="file"
              accept="image/*"
              className="hidden"
              onChange={(e) => {
                const file = e.target.files?.[0];
                if (file) handleFileUpload(file, 'site');
                e.target.value = '';
              }}
            />

            <div className="flex gap-2">
              <Button
                onClick={() => siteLogoInputRef.current?.click()}
                disabled={isUploading}
                className="flex-1 bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600 text-white"
              >
                {isUploading ? (
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                ) : (
                  <Upload className="mr-2 h-4 w-4" />
                )}
                업로드
              </Button>
              {siteLogo && (
                <Button
                  variant="outline"
                  onClick={() => handleDelete('site')}
                  disabled={isUploading}
                  className="text-red-500 hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-950/30"
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              )}
            </div>
          </div>

          {/* AI Logo */}
          <div className="bg-card border border-border rounded-2xl p-6">
            <h2 className="text-lg font-bold text-foreground mb-2">AI 아이콘 로고</h2>
            <p className="text-muted-foreground text-sm mb-6">
              헤더 왼쪽에 표시되는 AI 아이콘입니다. (권장: 40x40px, 정사각형)
            </p>

            {/* Preview */}
            <div className="mb-6">
              <label className="text-sm font-medium text-muted-foreground mb-2 block">미리보기</label>
              <div className="w-full h-24 rounded-xl bg-secondary/50 border-2 border-dashed border-border flex items-center justify-center">
                {aiLogo ? (
                  <img
                    src={aiLogo}
                    alt="AI Logo"
                    className="w-12 h-12 rounded-xl object-cover"
                  />
                ) : (
                  <div className="text-center">
                    <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-amber-400 via-orange-500 to-amber-600 flex items-center justify-center mx-auto mb-1">
                      <span className="text-white font-bold text-sm">AI</span>
                    </div>
                    <span className="text-xs text-muted-foreground">기본 로고</span>
                  </div>
                )}
              </div>
            </div>

            {/* Upload Button */}
            <input
              ref={aiLogoInputRef}
              type="file"
              accept="image/*"
              className="hidden"
              onChange={(e) => {
                const file = e.target.files?.[0];
                if (file) handleFileUpload(file, 'ai');
                e.target.value = '';
              }}
            />

            <div className="flex gap-2">
              <Button
                onClick={() => aiLogoInputRef.current?.click()}
                disabled={isUploading}
                className="flex-1 bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600 text-white"
              >
                {isUploading ? (
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                ) : (
                  <Upload className="mr-2 h-4 w-4" />
                )}
                업로드
              </Button>
              {aiLogo && (
                <Button
                  variant="outline"
                  onClick={() => handleDelete('ai')}
                  disabled={isUploading}
                  className="text-red-500 hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-950/30"
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              )}
            </div>
          </div>
        </div>

        {/* AI Tool Logos Link */}
        <Link href="/admin/tool-logos">
          <div className="mt-8 bg-gradient-to-r from-violet-50 to-purple-50 dark:from-violet-950/30 dark:to-purple-950/30 border border-violet-200 dark:border-violet-800/30 rounded-xl p-5 hover:shadow-lg transition-shadow cursor-pointer group">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-violet-500 to-purple-600 flex items-center justify-center">
                  <Layers className="h-6 w-6 text-white" />
                </div>
                <div>
                  <h3 className="font-semibold text-violet-800 dark:text-violet-300">AI 툴 로고 관리</h3>
                  <p className="text-sm text-violet-600 dark:text-violet-400">깨진 AI 툴 로고를 직접 업로드하여 교체하세요</p>
                </div>
              </div>
              <ArrowRight className="h-5 w-5 text-violet-500 group-hover:translate-x-1 transition-transform" />
            </div>
          </div>
        </Link>

        {/* Tips */}
        <div className="mt-6 bg-amber-50 dark:bg-amber-950/20 border border-amber-200 dark:border-amber-800/30 rounded-xl p-5">
          <h3 className="font-semibold text-amber-800 dark:text-amber-300 mb-2">로고 업로드 팁</h3>
          <ul className="text-sm text-amber-700 dark:text-amber-400 space-y-1">
            <li>• PNG 또는 SVG 형식 권장 (투명 배경 지원)</li>
            <li>• 메인 로고: 가로형 권장, 최대 너비 200px</li>
            <li>• AI 아이콘: 정사각형 권장, 40x40px</li>
            <li>• 파일 크기: 2MB 이하</li>
            <li>• <span className="text-emerald-600 dark:text-emerald-400 font-medium">Supabase 서버에 저장되어 모든 기기에서 적용됩니다</span></li>
          </ul>
        </div>
      </div>
    </div>
  );
}
