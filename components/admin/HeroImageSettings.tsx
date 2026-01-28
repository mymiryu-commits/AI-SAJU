'use client';

import { useState, useEffect, useRef } from 'react';
import Image from 'next/image';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import {
  Upload,
  Trash2,
  Save,
  Loader2,
  ImageIcon,
  Palette,
  Eye,
} from 'lucide-react';

export interface HeroSettings {
  background_image_url: string | null;
  content_image_url: string | null;
  use_gradient: boolean;
  gradient_from: string;
  gradient_via: string;
  gradient_to: string;
}

interface HeroImageSettingsProps {
  onSave?: () => void;
}

export default function HeroImageSettings({ onSave }: HeroImageSettingsProps) {
  const [settings, setSettings] = useState<HeroSettings>({
    background_image_url: null,
    content_image_url: null,
    use_gradient: true,
    gradient_from: '#9333ea',
    gradient_via: '#7e22ce',
    gradient_to: '#db2777',
  });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [uploading, setUploading] = useState<'background' | 'content' | null>(null);
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  const backgroundInputRef = useRef<HTMLInputElement>(null);
  const contentInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    fetchSettings();
  }, []);

  const fetchSettings = async () => {
    try {
      const response = await fetch('/api/site-settings?key=hero_settings');
      const result = await response.json();

      if (result.data?.value) {
        setSettings(result.data.value);
      }
    } catch (error) {
      console.error('Error fetching settings:', error);
      setMessage({ type: 'error', text: 'Failed to load settings' });
    } finally {
      setLoading(false);
    }
  };

  const handleImageUpload = async (file: File, type: 'background' | 'content') => {
    setUploading(type);
    setMessage(null);

    try {
      const formData = new FormData();
      formData.append('file', file);
      formData.append('type', type);

      const response = await fetch('/api/site-settings/upload', {
        method: 'POST',
        body: formData,
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.error || 'Upload failed');
      }

      // Update settings with new image URL
      const urlKey = type === 'background' ? 'background_image_url' : 'content_image_url';
      setSettings(prev => ({
        ...prev,
        [urlKey]: result.url,
      }));

      setMessage({ type: 'success', text: `${type === 'background' ? 'Background' : 'Content'} image uploaded` });
    } catch (error) {
      console.error('Error uploading image:', error);
      setMessage({ type: 'error', text: error instanceof Error ? error.message : 'Upload failed' });
    } finally {
      setUploading(null);
    }
  };

  const handleRemoveImage = (type: 'background' | 'content') => {
    const urlKey = type === 'background' ? 'background_image_url' : 'content_image_url';
    setSettings(prev => ({
      ...prev,
      [urlKey]: null,
    }));
  };

  const handleSaveSettings = async () => {
    setSaving(true);
    setMessage(null);

    try {
      const response = await fetch('/api/site-settings', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          key: 'hero_settings',
          value: settings,
        }),
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.error || 'Save failed');
      }

      setMessage({ type: 'success', text: 'Settings saved successfully!' });
      onSave?.();
    } catch (error) {
      console.error('Error saving settings:', error);
      setMessage({ type: 'error', text: error instanceof Error ? error.message : 'Save failed' });
    } finally {
      setSaving(false);
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>, type: 'background' | 'content') => {
    const file = e.target.files?.[0];
    if (file) {
      handleImageUpload(file, type);
    }
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

      {/* Background Image Card */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <ImageIcon className="h-5 w-5" />
            Hero Background Image
          </CardTitle>
          <CardDescription>
            Upload a background image for the hero section. This will replace the gradient background.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <input
            ref={backgroundInputRef}
            type="file"
            accept="image/jpeg,image/png,image/webp,image/gif"
            onChange={(e) => handleFileChange(e, 'background')}
            className="hidden"
          />

          {settings.background_image_url ? (
            <div className="relative aspect-video rounded-lg overflow-hidden border">
              <Image
                src={settings.background_image_url}
                alt="Hero background"
                fill
                className="object-cover"
              />
              <div className="absolute inset-0 bg-black/40 opacity-0 hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
                <Button
                  variant="secondary"
                  size="sm"
                  onClick={() => backgroundInputRef.current?.click()}
                  disabled={uploading === 'background'}
                >
                  {uploading === 'background' ? (
                    <Loader2 className="h-4 w-4 animate-spin" />
                  ) : (
                    <Upload className="h-4 w-4" />
                  )}
                  Change
                </Button>
                <Button
                  variant="destructive"
                  size="sm"
                  onClick={() => handleRemoveImage('background')}
                >
                  <Trash2 className="h-4 w-4" />
                  Remove
                </Button>
              </div>
            </div>
          ) : (
            <div
              onClick={() => backgroundInputRef.current?.click()}
              className="aspect-video rounded-lg border-2 border-dashed border-muted-foreground/25 flex flex-col items-center justify-center cursor-pointer hover:border-primary/50 transition-colors"
            >
              {uploading === 'background' ? (
                <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
              ) : (
                <>
                  <Upload className="h-8 w-8 text-muted-foreground mb-2" />
                  <p className="text-sm text-muted-foreground">Click to upload background image</p>
                  <p className="text-xs text-muted-foreground mt-1">JPEG, PNG, WebP, GIF (max 5MB)</p>
                </>
              )}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Content Image Card */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <ImageIcon className="h-5 w-5" />
            Hero Content Image
          </CardTitle>
          <CardDescription>
            Upload an image to display alongside the hero text content.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <input
            ref={contentInputRef}
            type="file"
            accept="image/jpeg,image/png,image/webp,image/gif"
            onChange={(e) => handleFileChange(e, 'content')}
            className="hidden"
          />

          {settings.content_image_url ? (
            <div className="relative w-64 h-64 rounded-lg overflow-hidden border mx-auto">
              <Image
                src={settings.content_image_url}
                alt="Hero content"
                fill
                className="object-cover"
              />
              <div className="absolute inset-0 bg-black/40 opacity-0 hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
                <Button
                  variant="secondary"
                  size="sm"
                  onClick={() => contentInputRef.current?.click()}
                  disabled={uploading === 'content'}
                >
                  {uploading === 'content' ? (
                    <Loader2 className="h-4 w-4 animate-spin" />
                  ) : (
                    <Upload className="h-4 w-4" />
                  )}
                  Change
                </Button>
                <Button
                  variant="destructive"
                  size="sm"
                  onClick={() => handleRemoveImage('content')}
                >
                  <Trash2 className="h-4 w-4" />
                  Remove
                </Button>
              </div>
            </div>
          ) : (
            <div
              onClick={() => contentInputRef.current?.click()}
              className="w-64 h-64 mx-auto rounded-lg border-2 border-dashed border-muted-foreground/25 flex flex-col items-center justify-center cursor-pointer hover:border-primary/50 transition-colors"
            >
              {uploading === 'content' ? (
                <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
              ) : (
                <>
                  <Upload className="h-8 w-8 text-muted-foreground mb-2" />
                  <p className="text-sm text-muted-foreground">Click to upload</p>
                  <p className="text-xs text-muted-foreground mt-1">JPEG, PNG, WebP, GIF</p>
                </>
              )}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Gradient Settings Card */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Palette className="h-5 w-5" />
            Gradient Settings
          </CardTitle>
          <CardDescription>
            Customize the gradient colors when no background image is set.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center gap-4">
            <input
              type="checkbox"
              id="use_gradient"
              checked={settings.use_gradient}
              onChange={(e) =>
                setSettings(prev => ({ ...prev, use_gradient: e.target.checked }))
              }
              className="h-5 w-5"
            />
            <Label htmlFor="use_gradient">Use gradient background (when no image is set)</Label>
          </div>

          <div className="grid grid-cols-3 gap-4">
            <div className="space-y-2">
              <Label htmlFor="gradient_from">From Color</Label>
              <div className="flex gap-2">
                <input
                  type="color"
                  id="gradient_from"
                  value={settings.gradient_from}
                  onChange={(e) =>
                    setSettings(prev => ({ ...prev, gradient_from: e.target.value }))
                  }
                  className="w-12 h-10 rounded cursor-pointer"
                />
                <Input
                  value={settings.gradient_from}
                  onChange={(e) =>
                    setSettings(prev => ({ ...prev, gradient_from: e.target.value }))
                  }
                  className="flex-1"
                />
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="gradient_via">Via Color</Label>
              <div className="flex gap-2">
                <input
                  type="color"
                  id="gradient_via"
                  value={settings.gradient_via}
                  onChange={(e) =>
                    setSettings(prev => ({ ...prev, gradient_via: e.target.value }))
                  }
                  className="w-12 h-10 rounded cursor-pointer"
                />
                <Input
                  value={settings.gradient_via}
                  onChange={(e) =>
                    setSettings(prev => ({ ...prev, gradient_via: e.target.value }))
                  }
                  className="flex-1"
                />
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="gradient_to">To Color</Label>
              <div className="flex gap-2">
                <input
                  type="color"
                  id="gradient_to"
                  value={settings.gradient_to}
                  onChange={(e) =>
                    setSettings(prev => ({ ...prev, gradient_to: e.target.value }))
                  }
                  className="w-12 h-10 rounded cursor-pointer"
                />
                <Input
                  value={settings.gradient_to}
                  onChange={(e) =>
                    setSettings(prev => ({ ...prev, gradient_to: e.target.value }))
                  }
                  className="flex-1"
                />
              </div>
            </div>
          </div>

          {/* Gradient Preview */}
          <div className="mt-4">
            <Label>Preview</Label>
            <div
              className="h-24 rounded-lg mt-2 flex items-center justify-center text-white font-bold"
              style={{
                background: settings.background_image_url
                  ? `url(${settings.background_image_url}) center/cover`
                  : settings.use_gradient
                  ? `linear-gradient(to bottom right, ${settings.gradient_from}, ${settings.gradient_via}, ${settings.gradient_to})`
                  : '#1f2937',
              }}
            >
              <Eye className="mr-2 h-4 w-4" />
              Hero Preview
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Save Button */}
      <div className="flex justify-end">
        <Button onClick={handleSaveSettings} disabled={saving} size="lg">
          {saving ? (
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
          ) : (
            <Save className="mr-2 h-4 w-4" />
          )}
          Save Hero Settings
        </Button>
      </div>
    </div>
  );
}
