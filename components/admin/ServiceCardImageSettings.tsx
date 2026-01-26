'use client';

import { useState, useEffect, useRef } from 'react';
import Image from 'next/image';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import {
  Upload,
  Trash2,
  Save,
  Loader2,
  ImageIcon,
  Sun,
  Moon,
  Star,
  MessageCircle,
  Heart,
  Sparkles,
  Dices,
  Brain,
  Calendar,
  Gift,
  Dna,
} from 'lucide-react';
import { createClient } from '@/lib/supabase/client';
import { ServiceCardImages } from '@/types/settings';

export type { ServiceCardImages };

const serviceCards = [
  { id: 'daily_fortune', title: '오늘의 운세', icon: Sun, color: 'from-amber-400 to-orange-500' },
  { id: 'saju_basic', title: '사주 분석', icon: Star, color: 'from-blue-400 to-indigo-500' },
  { id: 'saju_advanced', title: '정통 사주', icon: Moon, color: 'from-purple-400 to-violet-500' },
  { id: 'ai_chat', title: 'AI 사주 상담', icon: MessageCircle, color: 'from-rose-400 to-pink-500' },
  { id: 'compatibility', title: '궁합 분석', icon: Heart, color: 'from-pink-400 to-rose-500' },
  { id: 'tarot', title: '타로 점', icon: Sparkles, color: 'from-violet-400 to-purple-500' },
  { id: 'lotto', title: '로또 분석', icon: Dices, color: 'from-emerald-400 to-teal-500' },
  { id: 'mbti', title: 'MBTI 분석', icon: Brain, color: 'from-indigo-400 to-purple-500' },
  { id: 'tti', title: '띠별 운세', icon: Calendar, color: 'from-orange-400 to-red-500' },
  { id: 'newyear', title: '신년운세', icon: Gift, color: 'from-red-400 to-rose-500' },
  { id: 'animal_dna', title: 'AI 동물 DNA', icon: Dna, color: 'from-purple-400 to-pink-500' },
];

interface ServiceCardImageSettingsProps {
  onSave?: () => void;
}

export default function ServiceCardImageSettings({ onSave }: ServiceCardImageSettingsProps) {
  const [images, setImages] = useState<ServiceCardImages>({});
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [uploadingId, setUploadingId] = useState<string | null>(null);
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  const fileInputRefs = useRef<Record<string, HTMLInputElement | null>>({});
  const supabase = createClient();

  useEffect(() => {
    fetchImages();
  }, []);

  const fetchImages = async () => {
    try {
      const response = await fetch('/api/site-settings?key=service_card_images');
      const result = await response.json();

      if (result.data?.value) {
        setImages(result.data.value);
      }
    } catch (error) {
      console.error('Error fetching images:', error);
      setMessage({ type: 'error', text: '이미지 설정을 불러오는데 실패했습니다' });
    } finally {
      setLoading(false);
    }
  };

  const handleImageUpload = async (file: File, cardId: string) => {
    setUploadingId(cardId);
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
      const filename = `service-card-${cardId}-${timestamp}.${ext}`;

      // Upload directly to Supabase Storage
      const { data: uploadData, error: uploadError } = await supabase.storage
        .from('hero-images')
        .upload(filename, file, {
          contentType: file.type,
          upsert: true,
        });

      if (uploadError) {
        console.error('Upload error:', uploadError);
        throw new Error('이미지 업로드에 실패했습니다: ' + uploadError.message);
      }

      // Get public URL
      const { data: { publicUrl } } = supabase.storage
        .from('hero-images')
        .getPublicUrl(filename);

      setImages(prev => ({
        ...prev,
        [cardId]: publicUrl,
      }));

      setMessage({ type: 'success', text: '이미지가 업로드되었습니다' });
    } catch (error) {
      console.error('Error uploading image:', error);
      setMessage({ type: 'error', text: error instanceof Error ? error.message : '업로드 실패' });
    } finally {
      setUploadingId(null);
    }
  };

  const handleRemoveImage = (cardId: string) => {
    setImages(prev => {
      const newImages = { ...prev };
      delete newImages[cardId as keyof ServiceCardImages];
      return newImages;
    });
  };

  const handleSaveAll = async () => {
    setSaving(true);
    setMessage(null);

    try {
      const response = await fetch('/api/site-settings', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          key: 'service_card_images',
          value: images,
        }),
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.error || '저장 실패');
      }

      setMessage({ type: 'success', text: '모든 이미지 설정이 저장되었습니다!' });
      onSave?.();
    } catch (error) {
      console.error('Error saving images:', error);
      setMessage({ type: 'error', text: error instanceof Error ? error.message : '저장 실패' });
    } finally {
      setSaving(false);
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>, cardId: string) => {
    const file = e.target.files?.[0];
    if (file) {
      handleImageUpload(file, cardId);
    }
    e.target.value = '';
  };

  if (loading) {
    return (
      <Card>
        <CardContent className="flex items-center justify-center py-12">
          <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      {/* Message Display */}
      {message && (
        <div
          className={`p-4 rounded-lg ${
            message.type === 'success'
              ? 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400'
              : 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400'
          }`}
        >
          {message.text}
        </div>
      )}

      {/* Service Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {serviceCards.map((card) => {
          const Icon = card.icon;
          const imageUrl = images[card.id as keyof ServiceCardImages];
          const isUploading = uploadingId === card.id;

          return (
            <Card key={card.id} className="overflow-hidden">
              <CardHeader className="pb-3">
                <CardTitle className="flex items-center gap-2 text-base">
                  <div className={`w-8 h-8 rounded-lg bg-gradient-to-br ${card.color} flex items-center justify-center`}>
                    <Icon className="h-4 w-4 text-white" />
                  </div>
                  {card.title}
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <input
                  ref={(el) => { fileInputRefs.current[card.id] = el; }}
                  type="file"
                  accept="image/jpeg,image/png,image/webp,image/gif"
                  onChange={(e) => handleFileChange(e, card.id)}
                  className="hidden"
                />

                {imageUrl ? (
                  <div className="relative aspect-video rounded-lg overflow-hidden border group">
                    <Image
                      src={imageUrl}
                      alt={card.title}
                      fill
                      className="object-cover"
                    />
                    <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
                      <Button
                        variant="secondary"
                        size="sm"
                        onClick={() => fileInputRefs.current[card.id]?.click()}
                        disabled={isUploading}
                      >
                        {isUploading ? (
                          <Loader2 className="h-4 w-4 animate-spin" />
                        ) : (
                          <Upload className="h-4 w-4" />
                        )}
                      </Button>
                      <Button
                        variant="destructive"
                        size="sm"
                        onClick={() => handleRemoveImage(card.id)}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                ) : (
                  <div
                    onClick={() => fileInputRefs.current[card.id]?.click()}
                    className={`aspect-video rounded-lg border-2 border-dashed border-muted-foreground/25 flex flex-col items-center justify-center cursor-pointer hover:border-primary/50 transition-colors bg-gradient-to-br ${card.color}/10`}
                  >
                    {isUploading ? (
                      <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
                    ) : (
                      <>
                        <ImageIcon className="h-6 w-6 text-muted-foreground mb-1" />
                        <p className="text-xs text-muted-foreground">클릭하여 업로드</p>
                      </>
                    )}
                  </div>
                )}
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* Save Button */}
      <div className="flex justify-end">
        <Button onClick={handleSaveAll} disabled={saving} size="lg">
          {saving ? (
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
          ) : (
            <Save className="mr-2 h-4 w-4" />
          )}
          서비스 카드 이미지 저장
        </Button>
      </div>

      {/* Tips */}
      <div className="bg-amber-50 dark:bg-amber-950/20 border border-amber-200 dark:border-amber-800/30 rounded-xl p-4">
        <h3 className="font-semibold text-amber-800 dark:text-amber-300 mb-2">이미지 업로드 팁</h3>
        <ul className="text-sm text-amber-700 dark:text-amber-400 space-y-1">
          <li>• 권장 비율: 16:9 또는 4:3 (가로형)</li>
          <li>• 권장 해상도: 800x450px 이상</li>
          <li>• 지원 형식: JPEG, PNG, WebP, GIF</li>
          <li>• 파일 크기: 10MB 이하</li>
        </ul>
      </div>
    </div>
  );
}
