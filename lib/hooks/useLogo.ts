'use client';

import { useState, useEffect, useCallback } from 'react';
import { createClient } from '@/lib/supabase/client';

const BUCKET_NAME = 'ai-logos';
const SITE_LOGO_PATH = 'site/site-logo';
const AI_ICON_PATH = 'site/ai-icon';

export interface LogoSettings {
  siteLogo: string | null;
  aiLogo: string | null;
}

export function useLogo() {
  const [logos, setLogos] = useState<LogoSettings>({
    siteLogo: null,
    aiLogo: null,
  });
  const [isLoaded, setIsLoaded] = useState(false);
  const [isUploading, setIsUploading] = useState(false);

  // Load logos from Supabase Storage on mount
  useEffect(() => {
    loadLogos();
  }, []);

  const loadLogos = async () => {
    try {
      const supabase = createClient();

      // List files in site folder
      const { data: files, error } = await supabase.storage
        .from(BUCKET_NAME)
        .list('site');

      if (error) {
        console.error('Error loading logos:', error);
        setIsLoaded(true);
        return;
      }

      let siteLogo: string | null = null;
      let aiLogo: string | null = null;

      if (files) {
        for (const file of files) {
          if (file.name.startsWith('site-logo')) {
            const { data } = supabase.storage
              .from(BUCKET_NAME)
              .getPublicUrl(`site/${file.name}`);
            siteLogo = data.publicUrl;
          }
          if (file.name.startsWith('ai-icon')) {
            const { data } = supabase.storage
              .from(BUCKET_NAME)
              .getPublicUrl(`site/${file.name}`);
            aiLogo = data.publicUrl;
          }
        }
      }

      setLogos({ siteLogo, aiLogo });
    } catch (error) {
      console.error('Error loading logos:', error);
    } finally {
      setIsLoaded(true);
    }
  };

  const uploadLogo = async (file: File, type: 'site' | 'ai'): Promise<{ success: boolean; error?: string }> => {
    setIsUploading(true);
    try {
      const supabase = createClient();

      // Validate file type
      const allowedTypes = ['image/png', 'image/jpeg', 'image/svg+xml', 'image/webp', 'image/gif'];
      if (!allowedTypes.includes(file.type)) {
        return { success: false, error: '지원하지 않는 파일 형식입니다.' };
      }

      // Validate file size (max 2MB)
      if (file.size > 2 * 1024 * 1024) {
        return { success: false, error: '파일 크기는 2MB 이하여야 합니다.' };
      }

      // Delete existing logo first
      await deleteLogo(type);

      // Generate filename
      const fileExt = file.name.split('.').pop();
      const fileName = type === 'site' ? `site-logo.${fileExt}` : `ai-icon.${fileExt}`;
      const filePath = `site/${fileName}`;

      console.log('Uploading to:', BUCKET_NAME, filePath);

      // Upload to Supabase
      const { error } = await supabase.storage
        .from(BUCKET_NAME)
        .upload(filePath, file, {
          cacheControl: '3600',
          upsert: true,
        });

      if (error) {
        console.error('Upload error:', error);
        return { success: false, error: `업로드 실패: ${error.message}` };
      }

      // Get public URL
      const { data: urlData } = supabase.storage
        .from(BUCKET_NAME)
        .getPublicUrl(filePath);

      const logoUrl = urlData.publicUrl;

      // Update state
      if (type === 'site') {
        setLogos(prev => ({ ...prev, siteLogo: logoUrl }));
      } else {
        setLogos(prev => ({ ...prev, aiLogo: logoUrl }));
      }

      return { success: true };
    } catch (error) {
      console.error('Upload error:', error);
      return { success: false, error: '업로드 중 오류가 발생했습니다.' };
    } finally {
      setIsUploading(false);
    }
  };

  const deleteLogo = async (type: 'site' | 'ai'): Promise<boolean> => {
    try {
      const supabase = createClient();

      // List files and find the logo to delete
      const { data: files } = await supabase.storage
        .from(BUCKET_NAME)
        .list('site');

      if (files) {
        const prefix = type === 'site' ? 'site-logo' : 'ai-icon';
        const filesToDelete = files
          .filter(f => f.name.startsWith(prefix))
          .map(f => `site/${f.name}`);

        if (filesToDelete.length > 0) {
          await supabase.storage.from(BUCKET_NAME).remove(filesToDelete);
        }
      }

      // Update state
      if (type === 'site') {
        setLogos(prev => ({ ...prev, siteLogo: null }));
      } else {
        setLogos(prev => ({ ...prev, aiLogo: null }));
      }

      return true;
    } catch (error) {
      console.error('Delete error:', error);
      return false;
    }
  };

  const setSiteLogo = useCallback(async (file: File | null) => {
    if (file) {
      return uploadLogo(file, 'site');
    } else {
      await deleteLogo('site');
      return { success: true };
    }
  }, []);

  const setAiLogo = useCallback(async (file: File | null) => {
    if (file) {
      return uploadLogo(file, 'ai');
    } else {
      await deleteLogo('ai');
      return { success: true };
    }
  }, []);

  return {
    ...logos,
    isLoaded,
    isUploading,
    setSiteLogo,
    setAiLogo,
    refreshLogos: loadLogos,
  };
}

// Utility to convert file to base64 (keeping for backwards compatibility)
export function fileToBase64(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => resolve(reader.result as string);
    reader.onerror = (error) => reject(error);
  });
}
