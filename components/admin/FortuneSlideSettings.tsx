'use client';

import { useState, useEffect, useRef } from 'react';
import Image from 'next/image';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import {
  Upload,
  Trash2,
  Save,
  Loader2,
  ImageIcon,
  Plus,
  GripVertical,
  ArrowUp,
  ArrowDown,
} from 'lucide-react';
import { createClient } from '@/lib/supabase/client';
import { SlideImage, FortuneSlideSettings as FortuneSlideSettingsType } from '@/types/settings';

interface FortuneSlideSettingsProps {
  onSave?: () => void;
}

export default function FortuneSlideSettings({ onSave }: FortuneSlideSettingsProps) {
  const [slides, setSlides] = useState<SlideImage[]>([]);
  const [autoPlay, setAutoPlay] = useState(true);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [uploadingId, setUploadingId] = useState<string | null>(null);
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  const fileInputRefs = useRef<Record<string, HTMLInputElement | null>>({});
  const supabase = createClient();

  useEffect(() => {
    fetchSlides();
  }, []);

  const fetchSlides = async () => {
    try {
      const response = await fetch('/api/site-settings?key=fortune_slides');
      const result = await response.json();

      if (result.data?.value) {
        setSlides(result.data.value.slides || []);
        setAutoPlay(result.data.value.autoPlay !== false);
      }
    } catch (error) {
      console.error('Error fetching slides:', error);
      setMessage({ type: 'error', text: '슬라이드 설정을 불러오는데 실패했습니다' });
    } finally {
      setLoading(false);
    }
  };

  const addNewSlide = () => {
    const newSlide: SlideImage = {
      id: `slide-${Date.now()}`,
      url: '',
      title: '',
      description: '',
      order: slides.length + 1,
    };
    setSlides([...slides, newSlide]);
  };

  const removeSlide = (id: string) => {
    setSlides(slides.filter(s => s.id !== id));
  };

  const updateSlide = (id: string, updates: Partial<SlideImage>) => {
    setSlides(slides.map(s => s.id === id ? { ...s, ...updates } : s));
  };

  const moveSlide = (id: string, direction: 'up' | 'down') => {
    const index = slides.findIndex(s => s.id === id);
    if (index === -1) return;

    const newIndex = direction === 'up' ? index - 1 : index + 1;
    if (newIndex < 0 || newIndex >= slides.length) return;

    const newSlides = [...slides];
    [newSlides[index], newSlides[newIndex]] = [newSlides[newIndex], newSlides[index]];

    // Update order values
    newSlides.forEach((slide, i) => {
      slide.order = i + 1;
    });

    setSlides(newSlides);
  };

  const handleImageUpload = async (file: File, slideId: string) => {
    setUploadingId(slideId);
    setMessage(null);

    try {
      const allowedTypes = ['image/jpeg', 'image/png', 'image/webp', 'image/gif'];
      if (!allowedTypes.includes(file.type)) {
        throw new Error('지원하지 않는 파일 형식입니다. (JPEG, PNG, WebP, GIF만 가능)');
      }

      const maxSize = 10 * 1024 * 1024;
      if (file.size > maxSize) {
        throw new Error('파일 크기가 10MB를 초과합니다.');
      }

      const ext = file.name.split('.').pop();
      const timestamp = Date.now();
      const filename = `fortune-slide-${timestamp}.${ext}`;

      const { data: uploadData, error: uploadError } = await supabase.storage
        .from('hero-images')
        .upload(filename, file, {
          contentType: file.type,
          upsert: true,
        });

      if (uploadError) {
        throw new Error('이미지 업로드에 실패했습니다: ' + uploadError.message);
      }

      const { data: { publicUrl } } = supabase.storage
        .from('hero-images')
        .getPublicUrl(filename);

      updateSlide(slideId, { url: publicUrl });
      setMessage({ type: 'success', text: '이미지가 업로드되었습니다' });
    } catch (error) {
      console.error('Error uploading image:', error);
      setMessage({ type: 'error', text: error instanceof Error ? error.message : '업로드 실패' });
    } finally {
      setUploadingId(null);
    }
  };

  const handleSaveAll = async () => {
    setSaving(true);
    setMessage(null);

    try {
      const settings: FortuneSlideSettingsType = {
        slides: slides.sort((a, b) => a.order - b.order),
        autoPlay,
        autoPlayInterval: 4000,
      };

      const response = await fetch('/api/site-settings', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          key: 'fortune_slides',
          value: settings,
        }),
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.error || '저장 실패');
      }

      setMessage({ type: 'success', text: '슬라이드 설정이 저장되었습니다!' });
      onSave?.();
    } catch (error) {
      console.error('Error saving slides:', error);
      setMessage({ type: 'error', text: error instanceof Error ? error.message : '저장 실패' });
    } finally {
      setSaving(false);
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>, slideId: string) => {
    const file = e.target.files?.[0];
    if (file) {
      handleImageUpload(file, slideId);
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

      {/* Settings */}
      <Card>
        <CardHeader>
          <CardTitle className="text-base">슬라이드 설정</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-between">
            <div>
              <Label htmlFor="autoplay">자동 재생</Label>
              <p className="text-sm text-muted-foreground">4초마다 자동으로 슬라이드 전환</p>
            </div>
            <Switch
              id="autoplay"
              checked={autoPlay}
              onCheckedChange={setAutoPlay}
            />
          </div>
        </CardContent>
      </Card>

      {/* Slides List */}
      <div className="space-y-4">
        {slides.map((slide, index) => {
          const isUploading = uploadingId === slide.id;

          return (
            <Card key={slide.id} className="overflow-hidden">
              <CardContent className="p-4">
                <div className="flex gap-4">
                  {/* Image Upload */}
                  <div className="w-48 flex-shrink-0">
                    <input
                      ref={(el) => { fileInputRefs.current[slide.id] = el; }}
                      type="file"
                      accept="image/jpeg,image/png,image/webp,image/gif"
                      onChange={(e) => handleFileChange(e, slide.id)}
                      className="hidden"
                    />

                    {slide.url ? (
                      <div className="relative aspect-video rounded-lg overflow-hidden border group">
                        <Image
                          src={slide.url}
                          alt={slide.title || '슬라이드'}
                          fill
                          className="object-cover"
                        />
                        <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
                          <Button
                            variant="secondary"
                            size="sm"
                            onClick={() => fileInputRefs.current[slide.id]?.click()}
                            disabled={isUploading}
                          >
                            {isUploading ? (
                              <Loader2 className="h-4 w-4 animate-spin" />
                            ) : (
                              <Upload className="h-4 w-4" />
                            )}
                          </Button>
                        </div>
                      </div>
                    ) : (
                      <div
                        onClick={() => fileInputRefs.current[slide.id]?.click()}
                        className="aspect-video rounded-lg border-2 border-dashed border-muted-foreground/25 flex flex-col items-center justify-center cursor-pointer hover:border-primary/50 transition-colors bg-muted/30"
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
                  </div>

                  {/* Slide Info */}
                  <div className="flex-1 space-y-3">
                    <div>
                      <Label htmlFor={`title-${slide.id}`}>제목</Label>
                      <Input
                        id={`title-${slide.id}`}
                        value={slide.title || ''}
                        onChange={(e) => updateSlide(slide.id, { title: e.target.value })}
                        placeholder="슬라이드 제목"
                      />
                    </div>
                    <div>
                      <Label htmlFor={`desc-${slide.id}`}>설명</Label>
                      <Input
                        id={`desc-${slide.id}`}
                        value={slide.description || ''}
                        onChange={(e) => updateSlide(slide.id, { description: e.target.value })}
                        placeholder="슬라이드 설명"
                      />
                    </div>
                    <div>
                      <Label htmlFor={`link-${slide.id}`}>링크 (선택)</Label>
                      <Input
                        id={`link-${slide.id}`}
                        value={slide.link || ''}
                        onChange={(e) => updateSlide(slide.id, { link: e.target.value })}
                        placeholder="/pricing 또는 https://..."
                      />
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="flex flex-col gap-2">
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => moveSlide(slide.id, 'up')}
                      disabled={index === 0}
                    >
                      <ArrowUp className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => moveSlide(slide.id, 'down')}
                      disabled={index === slides.length - 1}
                    >
                      <ArrowDown className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => removeSlide(slide.id)}
                      className="text-red-500 hover:text-red-600 hover:bg-red-50"
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* Add Slide Button */}
      <Button variant="outline" onClick={addNewSlide} className="w-full">
        <Plus className="mr-2 h-4 w-4" />
        슬라이드 추가
      </Button>

      {/* Save Button */}
      <div className="flex justify-end">
        <Button onClick={handleSaveAll} disabled={saving} size="lg">
          {saving ? (
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
          ) : (
            <Save className="mr-2 h-4 w-4" />
          )}
          슬라이드 설정 저장
        </Button>
      </div>

      {/* Tips */}
      <div className="bg-purple-50 dark:bg-purple-950/20 border border-purple-200 dark:border-purple-800/30 rounded-xl p-4">
        <h3 className="font-semibold text-purple-800 dark:text-purple-300 mb-2">슬라이드 이미지 팁</h3>
        <ul className="text-sm text-purple-700 dark:text-purple-400 space-y-1">
          <li>• 권장 비율: 16:9 (가로형, 1920x1080px)</li>
          <li>• 이미지가 없으면 그라데이션 배경에 텍스트만 표시됩니다</li>
          <li>• 제목과 설명은 이미지 위에 오버레이로 표시됩니다</li>
          <li>• 지원 형식: JPEG, PNG, WebP, GIF (최대 10MB)</li>
        </ul>
      </div>
    </div>
  );
}
