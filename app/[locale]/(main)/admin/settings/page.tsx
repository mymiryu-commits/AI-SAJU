'use client';

import { useState, useRef, useEffect } from 'react';
import Image from 'next/image';
import { Button } from '@/components/ui/button';
import { useLogo } from '@/lib/hooks/useLogo';
import { useAIShortcuts, type AIShortcut } from '@/lib/hooks/useAIShortcuts';
import { createClient } from '@/lib/supabase/client';
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
  ExternalLink,
  Plus,
  Save,
  RotateCcw,
  Users,
  Coins,
  QrCode,
  Volume2,
  Mic,
} from 'lucide-react';
import {
  type TTSProviderType,
  type TTSSettings,
  TTS_PROVIDERS,
  DEFAULT_TTS_SETTINGS,
  fetchTTSSettings,
  saveTTSSettings
} from '@/lib/services/ttsSettingsService';
import { Link } from '@/i18n/routing';

export default function AdminSettingsPage() {
  const { siteLogo, aiLogo, isLoaded, isUploading, setSiteLogo, setAiLogo } = useLogo();
  const { shortcuts, isLoaded: shortcutsLoaded, saveShortcuts, resetToDefault } = useAIShortcuts();
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);
  const [editingShortcuts, setEditingShortcuts] = useState<AIShortcut[]>([]);
  const [newShortcut, setNewShortcut] = useState({ key: '', label: '', url: '', referralUrl: '' });

  // QR Hero Image state
  const [qrHeroImage, setQrHeroImage] = useState<string | null>(null);
  const [qrHeroImageLoading, setQrHeroImageLoading] = useState(true);
  const [qrHeroImageUploading, setQrHeroImageUploading] = useState(false);

  // TTS Settings state
  const [ttsSettings, setTtsSettings] = useState<TTSSettings>(DEFAULT_TTS_SETTINGS);
  const [ttsLoading, setTtsLoading] = useState(true);
  const [ttsSaving, setTtsSaving] = useState(false);

  const siteLogoInputRef = useRef<HTMLInputElement>(null);
  const aiLogoInputRef = useRef<HTMLInputElement>(null);
  const qrHeroImageInputRef = useRef<HTMLInputElement>(null);

  const supabase = createClient();

  // Fetch QR Hero Image on mount
  useEffect(() => {
    const fetchQrHeroImage = async () => {
      try {
        const response = await fetch('/api/site-settings?key=qr_hero_image');
        const result = await response.json();
        if (result.data?.value?.image_url) {
          setQrHeroImage(result.data.value.image_url);
        }
      } catch (error) {
        console.error('Error fetching QR hero image:', error);
      } finally {
        setQrHeroImageLoading(false);
      }
    };
    fetchQrHeroImage();
  }, []);

  // Fetch TTS Settings on mount
  useEffect(() => {
    const loadTTSSettings = async () => {
      try {
        const settings = await fetchTTSSettings();
        setTtsSettings(settings);
      } catch (error) {
        console.error('Error fetching TTS settings:', error);
      } finally {
        setTtsLoading(false);
      }
    };
    loadTTSSettings();
  }, []);

  // TTS Settings handlers
  const handleTTSProviderChange = (provider: TTSProviderType) => {
    const providerInfo = TTS_PROVIDERS[provider];
    setTtsSettings(prev => ({
      ...prev,
      provider,
      voice: providerInfo?.defaultVoice || prev.voice
    }));
  };

  const handleTTSVoiceChange = (voice: string) => {
    setTtsSettings(prev => ({ ...prev, voice }));
  };

  const handleSaveTTSSettings = async () => {
    setTtsSaving(true);
    setMessage(null);
    try {
      const success = await saveTTSSettings(ttsSettings);
      if (success) {
        setMessage({ type: 'success', text: 'TTS 설정이 저장되었습니다.' });
      } else {
        setMessage({ type: 'error', text: 'TTS 설정 저장에 실패했습니다.' });
      }
    } catch (error) {
      console.error('Error saving TTS settings:', error);
      setMessage({ type: 'error', text: 'TTS 설정 저장 중 오류가 발생했습니다.' });
    } finally {
      setTtsSaving(false);
    }
  };

  // QR Hero Image upload handler
  const handleQrHeroImageUpload = async (file: File) => {
    setQrHeroImageUploading(true);
    setMessage(null);

    try {
      // Validate file type
      const allowedTypes = ['image/jpeg', 'image/png', 'image/webp', 'image/gif'];
      if (!allowedTypes.includes(file.type)) {
        throw new Error('지원하지 않는 파일 형식입니다. (JPEG, PNG, WebP, GIF만 가능)');
      }

      // Validate file size (max 10MB)
      const maxSize = 10 * 1024 * 1024;
      if (file.size > maxSize) {
        throw new Error('파일 크기가 10MB를 초과합니다.');
      }

      // Generate unique filename
      const ext = file.name.split('.').pop();
      const timestamp = Date.now();
      const filename = `qr-hero-${timestamp}.${ext}`;

      // Upload to Supabase Storage
      const { data: uploadData, error: uploadError } = await supabase.storage
        .from('hero-images')
        .upload(`qr-hero/${filename}`, file, {
          cacheControl: '3600',
          upsert: false,
        });

      if (uploadError) throw uploadError;

      // Get public URL
      const { data: urlData } = supabase.storage
        .from('hero-images')
        .getPublicUrl(`qr-hero/${filename}`);

      const imageUrl = urlData.publicUrl;

      // Save to site_settings
      const response = await fetch('/api/site-settings', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          key: 'qr_hero_image',
          value: { image_url: imageUrl },
        }),
      });

      if (!response.ok) throw new Error('설정 저장 실패');

      setQrHeroImage(imageUrl);
      setMessage({ type: 'success', text: 'QR 히어로 이미지가 업로드되었습니다.' });
    } catch (error) {
      console.error('Error uploading QR hero image:', error);
      setMessage({ type: 'error', text: error instanceof Error ? error.message : '업로드 중 오류가 발생했습니다.' });
    } finally {
      setQrHeroImageUploading(false);
    }
  };

  // QR Hero Image delete handler
  const handleQrHeroImageDelete = async () => {
    setQrHeroImageUploading(true);
    setMessage(null);

    try {
      // Save empty value to site_settings
      const response = await fetch('/api/site-settings', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          key: 'qr_hero_image',
          value: { image_url: null },
        }),
      });

      if (!response.ok) throw new Error('설정 저장 실패');

      setQrHeroImage(null);
      setMessage({ type: 'success', text: 'QR 히어로 이미지가 삭제되었습니다.' });
    } catch (error) {
      console.error('Error deleting QR hero image:', error);
      setMessage({ type: 'error', text: '삭제 중 오류가 발생했습니다.' });
    } finally {
      setQrHeroImageUploading(false);
    }
  };

  // Initialize editing shortcuts when loaded
  useState(() => {
    if (shortcutsLoaded && editingShortcuts.length === 0) {
      setEditingShortcuts(shortcuts);
    }
  });

  // Update editing shortcuts when shortcuts change
  if (shortcutsLoaded && editingShortcuts.length === 0 && shortcuts.length > 0) {
    setEditingShortcuts(shortcuts);
  }

  const handleShortcutChange = (index: number, field: keyof AIShortcut, value: string) => {
    const updated = [...editingShortcuts];
    updated[index] = { ...updated[index], [field]: value };
    setEditingShortcuts(updated);
  };

  const handleAddShortcut = () => {
    if (!newShortcut.key || !newShortcut.label || !newShortcut.url) {
      setMessage({ type: 'error', text: '키, 이름, URL은 필수입니다.' });
      return;
    }
    setEditingShortcuts([...editingShortcuts, newShortcut]);
    setNewShortcut({ key: '', label: '', url: '', referralUrl: '' });
  };

  const handleRemoveShortcut = (index: number) => {
    const updated = editingShortcuts.filter((_, i) => i !== index);
    setEditingShortcuts(updated);
  };

  const handleSaveShortcuts = () => {
    const success = saveShortcuts(editingShortcuts);
    if (success) {
      setMessage({ type: 'success', text: 'AI 바로가기가 저장되었습니다.' });
    } else {
      setMessage({ type: 'error', text: '저장 중 오류가 발생했습니다.' });
    }
  };

  const handleResetShortcuts = () => {
    resetToDefault();
    setEditingShortcuts([]);
    setMessage({ type: 'success', text: '기본값으로 초기화되었습니다.' });
  };

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

        {/* User Management Link */}
        <Link href="/admin/users">
          <div className="mt-8 bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-950/30 dark:to-indigo-950/30 border border-blue-200 dark:border-blue-800/30 rounded-xl p-5 hover:shadow-lg transition-shadow cursor-pointer group">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center">
                  <Users className="h-6 w-6 text-white" />
                </div>
                <div>
                  <h3 className="font-semibold text-blue-800 dark:text-blue-300">회원 관리</h3>
                  <p className="text-sm text-blue-600 dark:text-blue-400">가입 회원 목록 조회 및 포인트 부여</p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <Coins className="h-4 w-4 text-amber-500" />
                <ArrowRight className="h-5 w-5 text-blue-500 group-hover:translate-x-1 transition-transform" />
              </div>
            </div>
          </div>
        </Link>

        {/* AI Tool Logos Link */}
        <Link href="/admin/tool-logos">
          <div className="mt-4 bg-gradient-to-r from-violet-50 to-purple-50 dark:from-violet-950/30 dark:to-purple-950/30 border border-violet-200 dark:border-violet-800/30 rounded-xl p-5 hover:shadow-lg transition-shadow cursor-pointer group">
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

        {/* Service Card Images Link */}
        <Link href="/admin/service-cards">
          <div className="mt-4 bg-gradient-to-r from-pink-50 to-rose-50 dark:from-pink-950/30 dark:to-rose-950/30 border border-pink-200 dark:border-pink-800/30 rounded-xl p-5 hover:shadow-lg transition-shadow cursor-pointer group">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-pink-500 to-rose-600 flex items-center justify-center">
                  <ImageIcon className="h-6 w-6 text-white" />
                </div>
                <div>
                  <h3 className="font-semibold text-pink-800 dark:text-pink-300">서비스 카드 이미지 관리</h3>
                  <p className="text-sm text-pink-600 dark:text-pink-400">홈페이지 서비스 카드 이미지를 변경하세요</p>
                </div>
              </div>
              <ArrowRight className="h-5 w-5 text-pink-500 group-hover:translate-x-1 transition-transform" />
            </div>
          </div>
        </Link>

        {/* Fortune Slide Images Link */}
        <Link href="/admin/fortune-slides">
          <div className="mt-4 bg-gradient-to-r from-purple-50 to-indigo-50 dark:from-purple-950/30 dark:to-indigo-950/30 border border-purple-200 dark:border-purple-800/30 rounded-xl p-5 hover:shadow-lg transition-shadow cursor-pointer group">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-purple-500 to-indigo-600 flex items-center justify-center">
                  <Layers className="h-6 w-6 text-white" />
                </div>
                <div>
                  <h3 className="font-semibold text-purple-800 dark:text-purple-300">운세 슬라이드 이미지 관리</h3>
                  <p className="text-sm text-purple-600 dark:text-purple-400">통합 분석 페이지 상단 슬라이드 이미지를 관리하세요</p>
                </div>
              </div>
              <ArrowRight className="h-5 w-5 text-purple-500 group-hover:translate-x-1 transition-transform" />
            </div>
          </div>
        </Link>

        {/* QR Hero Image */}
        <div className="mt-8 bg-card border border-border rounded-2xl p-6">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-violet-100 to-purple-100 dark:from-violet-900/30 dark:to-purple-900/30 flex items-center justify-center">
              <QrCode className="h-5 w-5 text-violet-600 dark:text-violet-400" />
            </div>
            <div>
              <h2 className="text-lg font-bold text-foreground">QR 히어로 이미지</h2>
              <p className="text-muted-foreground text-sm">QR 코드 생성기 페이지 상단 히어로 이미지</p>
            </div>
          </div>

          {/* Preview */}
          <div className="mb-6">
            <label className="text-sm font-medium text-muted-foreground mb-2 block">미리보기</label>
            <div className="w-full h-48 rounded-xl bg-gradient-to-br from-violet-50 to-purple-50 dark:from-violet-900/20 dark:to-purple-900/20 border-2 border-dashed border-violet-200 dark:border-violet-700 flex items-center justify-center overflow-hidden relative">
              {qrHeroImageLoading ? (
                <Loader2 className="h-8 w-8 animate-spin text-violet-400" />
              ) : qrHeroImage ? (
                <Image
                  src={qrHeroImage}
                  alt="QR Hero Image"
                  fill
                  className="object-cover"
                />
              ) : (
                <div className="text-center">
                  <ImageIcon className="h-12 w-12 text-violet-300 dark:text-violet-600 mx-auto mb-2" />
                  <span className="text-sm text-violet-400 dark:text-violet-500">이미지 없음</span>
                  <p className="text-xs text-violet-300 dark:text-violet-600 mt-1">권장: 800x600px</p>
                </div>
              )}
            </div>
          </div>

          {/* Upload Button */}
          <input
            ref={qrHeroImageInputRef}
            type="file"
            accept="image/*"
            className="hidden"
            onChange={(e) => {
              const file = e.target.files?.[0];
              if (file) handleQrHeroImageUpload(file);
              e.target.value = '';
            }}
          />

          <div className="flex gap-2">
            <Button
              onClick={() => qrHeroImageInputRef.current?.click()}
              disabled={qrHeroImageUploading}
              className="flex-1 bg-gradient-to-r from-violet-500 to-purple-500 hover:from-violet-600 hover:to-purple-600 text-white"
            >
              {qrHeroImageUploading ? (
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              ) : (
                <Upload className="mr-2 h-4 w-4" />
              )}
              이미지 업로드
            </Button>
            {qrHeroImage && (
              <Button
                variant="outline"
                onClick={handleQrHeroImageDelete}
                disabled={qrHeroImageUploading}
                className="text-red-500 hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-950/30"
              >
                <Trash2 className="h-4 w-4" />
              </Button>
            )}
          </div>
        </div>

        {/* TTS Settings */}
        <div className="mt-8 bg-card border border-border rounded-2xl p-6">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-cyan-100 to-blue-100 dark:from-cyan-900/30 dark:to-blue-900/30 flex items-center justify-center">
                <Volume2 className="h-5 w-5 text-cyan-600 dark:text-cyan-400" />
              </div>
              <div>
                <h2 className="text-lg font-bold text-foreground">음성(TTS) 설정</h2>
                <p className="text-muted-foreground text-sm">사주 분석 음성 생성에 사용할 TTS 제공자를 선택하세요</p>
              </div>
            </div>
            <Button
              size="sm"
              onClick={handleSaveTTSSettings}
              disabled={ttsSaving || ttsLoading}
              className="bg-gradient-to-r from-cyan-500 to-blue-500 hover:from-cyan-600 hover:to-blue-600 text-white"
            >
              {ttsSaving ? (
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              ) : (
                <Save className="mr-2 h-4 w-4" />
              )}
              저장
            </Button>
          </div>

          {ttsLoading ? (
            <div className="flex items-center justify-center py-8">
              <Loader2 className="h-6 w-6 animate-spin text-cyan-500" />
            </div>
          ) : (
            <div className="space-y-4">
              {/* TTS Provider Selection */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
                {(Object.entries(TTS_PROVIDERS) as [TTSProviderType, typeof TTS_PROVIDERS[TTSProviderType]][]).map(([key, provider]) => (
                  <button
                    key={key}
                    onClick={() => handleTTSProviderChange(key)}
                    className={`p-4 rounded-xl border-2 text-left transition-all ${
                      ttsSettings.provider === key
                        ? 'border-cyan-500 bg-cyan-50 dark:bg-cyan-950/30'
                        : 'border-border hover:border-cyan-300 dark:hover:border-cyan-700'
                    }`}
                  >
                    <div className="flex items-center justify-between mb-2">
                      <span className="font-semibold text-foreground">{provider.name}</span>
                      <span className={`text-xs px-2 py-0.5 rounded-full ${
                        provider.quality >= 8.5 ? 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400' :
                        provider.quality >= 7 ? 'bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400' :
                        'bg-gray-100 text-gray-600 dark:bg-gray-800 dark:text-gray-400'
                      }`}>
                        품질 {provider.quality}/10
                      </span>
                    </div>
                    <p className="text-xs text-muted-foreground mb-2">{provider.description}</p>
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-medium text-cyan-600 dark:text-cyan-400">{provider.cost}</span>
                      {ttsSettings.provider === key && (
                        <CheckCircle className="h-4 w-4 text-cyan-500" />
                      )}
                    </div>
                  </button>
                ))}
              </div>

              {/* Voice Selection */}
              <div className="mt-6 p-4 rounded-xl bg-secondary/50 border border-border">
                <div className="flex items-center gap-2 mb-3">
                  <Mic className="h-4 w-4 text-cyan-500" />
                  <span className="font-medium text-foreground">음성 선택</span>
                </div>
                <div className="flex flex-wrap gap-2">
                  {TTS_PROVIDERS[ttsSettings.provider]?.voices.map((voice) => (
                    <button
                      key={voice}
                      onClick={() => handleTTSVoiceChange(voice)}
                      className={`px-3 py-1.5 rounded-lg text-sm transition-all ${
                        ttsSettings.voice === voice
                          ? 'bg-cyan-500 text-white'
                          : 'bg-background border border-border hover:border-cyan-300'
                      }`}
                    >
                      {voice}
                    </button>
                  ))}
                </div>
              </div>

              {/* Current Settings Summary */}
              <div className="mt-4 p-3 rounded-lg bg-cyan-50 dark:bg-cyan-950/20 border border-cyan-200 dark:border-cyan-800/30">
                <p className="text-sm text-cyan-800 dark:text-cyan-300">
                  <strong>현재 설정:</strong> {TTS_PROVIDERS[ttsSettings.provider]?.name} - {ttsSettings.voice}
                </p>
                <p className="text-xs text-cyan-600 dark:text-cyan-400 mt-1">
                  예상 비용: {TTS_PROVIDERS[ttsSettings.provider]?.cost}
                </p>
              </div>
            </div>
          )}
        </div>

        {/* AI Shortcuts Management */}
        <div className="mt-8 bg-card border border-border rounded-2xl p-6">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-emerald-100 to-teal-100 dark:from-emerald-900/30 dark:to-teal-900/30 flex items-center justify-center">
                <ExternalLink className="h-5 w-5 text-emerald-600 dark:text-emerald-400" />
              </div>
              <div>
                <h2 className="text-lg font-bold text-foreground">AI 바로가기 관리</h2>
                <p className="text-muted-foreground text-sm">레퍼럴 링크를 설정하여 수익을 창출하세요</p>
              </div>
            </div>
            <div className="flex gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={handleResetShortcuts}
                className="text-muted-foreground"
              >
                <RotateCcw className="h-4 w-4 mr-1" />
                초기화
              </Button>
              <Button
                size="sm"
                onClick={handleSaveShortcuts}
                className="bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-600 hover:to-teal-600 text-white"
              >
                <Save className="h-4 w-4 mr-1" />
                저장
              </Button>
            </div>
          </div>

          {/* Shortcuts List */}
          <div className="space-y-3 mb-4">
            {editingShortcuts.map((shortcut, index) => (
              <div key={shortcut.key} className="p-3 rounded-xl bg-secondary/50 border border-border">
                <div className="grid grid-cols-4 gap-2 mb-2">
                  <input
                    type="text"
                    value={shortcut.label}
                    onChange={(e) => handleShortcutChange(index, 'label', e.target.value)}
                    placeholder="이름"
                    className="px-3 py-1.5 rounded-lg border border-border bg-background text-sm"
                  />
                  <input
                    type="text"
                    value={shortcut.url}
                    onChange={(e) => handleShortcutChange(index, 'url', e.target.value)}
                    placeholder="기본 URL"
                    className="px-3 py-1.5 rounded-lg border border-border bg-background text-sm"
                  />
                  <input
                    type="text"
                    value={shortcut.referralUrl}
                    onChange={(e) => handleShortcutChange(index, 'referralUrl', e.target.value)}
                    placeholder="레퍼럴 URL (선택)"
                    className="px-3 py-1.5 rounded-lg border border-border bg-background text-sm col-span-1"
                  />
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => handleRemoveShortcut(index)}
                    className="text-red-500 hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-950/30"
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
                {shortcut.referralUrl && (
                  <p className="text-xs text-emerald-600 dark:text-emerald-400">
                    ✓ 레퍼럴 링크 적용됨
                  </p>
                )}
              </div>
            ))}
          </div>

          {/* Add New Shortcut */}
          <div className="p-3 rounded-xl bg-amber-50/50 dark:bg-amber-950/20 border border-amber-200/50 dark:border-amber-800/30">
            <p className="text-sm font-medium text-amber-700 dark:text-amber-300 mb-2">새 바로가기 추가</p>
            <div className="grid grid-cols-5 gap-2">
              <input
                type="text"
                value={newShortcut.key}
                onChange={(e) => setNewShortcut({ ...newShortcut, key: e.target.value })}
                placeholder="키 (영문)"
                className="px-3 py-1.5 rounded-lg border border-border bg-background text-sm"
              />
              <input
                type="text"
                value={newShortcut.label}
                onChange={(e) => setNewShortcut({ ...newShortcut, label: e.target.value })}
                placeholder="표시 이름"
                className="px-3 py-1.5 rounded-lg border border-border bg-background text-sm"
              />
              <input
                type="text"
                value={newShortcut.url}
                onChange={(e) => setNewShortcut({ ...newShortcut, url: e.target.value })}
                placeholder="기본 URL"
                className="px-3 py-1.5 rounded-lg border border-border bg-background text-sm"
              />
              <input
                type="text"
                value={newShortcut.referralUrl}
                onChange={(e) => setNewShortcut({ ...newShortcut, referralUrl: e.target.value })}
                placeholder="레퍼럴 URL"
                className="px-3 py-1.5 rounded-lg border border-border bg-background text-sm"
              />
              <Button
                onClick={handleAddShortcut}
                className="bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600 text-white"
              >
                <Plus className="h-4 w-4 mr-1" />
                추가
              </Button>
            </div>
          </div>
        </div>

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
