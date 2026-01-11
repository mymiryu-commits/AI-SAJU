'use client';

import { useState, useEffect, useCallback } from 'react';
import { createClient } from '@/lib/supabase/client';

const BUCKET_NAME = 'ai-logos';
const TOOLS_FOLDER = 'tools';

export interface ToolLogoSettings {
  [toolName: string]: string; // toolName -> URL
}

// Convert tool name to safe filename
function toSafeFileName(toolName: string): string {
  return toolName
    .toLowerCase()
    .replace(/[^a-z0-9가-힣]/g, '-')
    .replace(/-+/g, '-')
    .replace(/^-|-$/g, '');
}

export function useToolLogos() {
  const [toolLogos, setToolLogos] = useState<ToolLogoSettings>({});
  const [isLoaded, setIsLoaded] = useState(false);
  const [isUploading, setIsUploading] = useState(false);

  // Load tool logos from Supabase Storage on mount
  useEffect(() => {
    loadToolLogos();
  }, []);

  const loadToolLogos = async () => {
    try {
      const supabase = createClient();

      // List files in tools folder
      const { data: files, error } = await supabase.storage
        .from(BUCKET_NAME)
        .list(TOOLS_FOLDER);

      if (error) {
        console.error('Error loading tool logos:', error);
        setIsLoaded(true);
        return;
      }

      const logos: ToolLogoSettings = {};

      if (files) {
        for (const file of files) {
          // Extract tool name from filename (remove extension)
          const toolName = file.name.replace(/\.[^/.]+$/, '');
          const { data } = supabase.storage
            .from(BUCKET_NAME)
            .getPublicUrl(`${TOOLS_FOLDER}/${file.name}`);
          logos[toolName] = data.publicUrl + '?t=' + Date.now(); // Cache bust
        }
      }

      setToolLogos(logos);
    } catch (error) {
      console.error('Error loading tool logos:', error);
    } finally {
      setIsLoaded(true);
    }
  };

  const setToolLogo = useCallback(async (
    toolName: string,
    file: File | null
  ): Promise<{ success: boolean; error?: string }> => {
    setIsUploading(true);
    try {
      const supabase = createClient();
      const safeToolName = toSafeFileName(toolName);

      if (file) {
        // Validate file type
        const allowedTypes = ['image/png', 'image/jpeg', 'image/svg+xml', 'image/webp', 'image/gif'];
        if (!allowedTypes.includes(file.type)) {
          setIsUploading(false);
          return { success: false, error: '지원하지 않는 파일 형식입니다.' };
        }

        // Validate file size (max 500KB for tool logos)
        if (file.size > 500 * 1024) {
          setIsUploading(false);
          return { success: false, error: '파일 크기는 500KB 이하여야 합니다.' };
        }

        // Delete existing logo first
        await deleteToolLogoFile(safeToolName);

        // Generate filename
        const fileExt = file.name.split('.').pop();
        const fileName = `${safeToolName}.${fileExt}`;
        const filePath = `${TOOLS_FOLDER}/${fileName}`;

        // Upload to Supabase
        const { error } = await supabase.storage
          .from(BUCKET_NAME)
          .upload(filePath, file, {
            cacheControl: '3600',
            upsert: true,
          });

        if (error) {
          console.error('Upload error:', error);
          setIsUploading(false);
          return { success: false, error: error.message };
        }

        // Get public URL
        const { data: urlData } = supabase.storage
          .from(BUCKET_NAME)
          .getPublicUrl(filePath);

        const logoUrl = urlData.publicUrl + '?t=' + Date.now();

        // Update state - use original tool name as key
        setToolLogos(prev => ({
          ...prev,
          [safeToolName]: logoUrl,
        }));

        setIsUploading(false);
        return { success: true };
      } else {
        // Delete logo
        await deleteToolLogoFile(safeToolName);
        setToolLogos(prev => {
          const updated = { ...prev };
          delete updated[safeToolName];
          return updated;
        });
        setIsUploading(false);
        return { success: true };
      }
    } catch (error) {
      console.error('Error setting tool logo:', error);
      setIsUploading(false);
      return { success: false, error: '오류가 발생했습니다.' };
    }
  }, []);

  const deleteToolLogoFile = async (safeToolName: string): Promise<boolean> => {
    try {
      const supabase = createClient();

      // List files and find matching ones to delete
      const { data: files } = await supabase.storage
        .from(BUCKET_NAME)
        .list(TOOLS_FOLDER);

      if (files) {
        const filesToDelete = files
          .filter(f => f.name.startsWith(safeToolName + '.'))
          .map(f => `${TOOLS_FOLDER}/${f.name}`);

        if (filesToDelete.length > 0) {
          await supabase.storage.from(BUCKET_NAME).remove(filesToDelete);
        }
      }

      return true;
    } catch (error) {
      console.error('Delete error:', error);
      return false;
    }
  };

  const getToolLogo = useCallback((toolName: string): string | null => {
    const safeToolName = toSafeFileName(toolName);
    return toolLogos[safeToolName] || null;
  }, [toolLogos]);

  const clearAllToolLogos = useCallback(async (): Promise<boolean> => {
    try {
      const supabase = createClient();

      // List and delete all files in tools folder
      const { data: files } = await supabase.storage
        .from(BUCKET_NAME)
        .list(TOOLS_FOLDER);

      if (files && files.length > 0) {
        const filesToDelete = files.map(f => `${TOOLS_FOLDER}/${f.name}`);
        await supabase.storage.from(BUCKET_NAME).remove(filesToDelete);
      }

      setToolLogos({});
      return true;
    } catch (error) {
      console.error('Clear error:', error);
      return false;
    }
  }, []);

  return {
    toolLogos,
    isLoaded,
    isUploading,
    setToolLogo,
    getToolLogo,
    clearAllToolLogos,
    refreshLogos: loadToolLogos,
  };
}

// Utility to convert file to base64
export function fileToBase64(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => resolve(reader.result as string);
    reader.onerror = (error) => reject(error);
  });
}
