import { createClient } from '@/lib/supabase/client';

const BUCKET_NAME = 'ai-logos';

export interface UploadLogoResult {
  success: boolean;
  url?: string;
  error?: string;
}

/**
 * Upload a logo image to Supabase Storage
 */
export async function uploadLogo(
  file: File,
  toolId: string
): Promise<UploadLogoResult> {
  try {
    const supabase = createClient();

    // Validate file type
    const allowedTypes = ['image/png', 'image/jpeg', 'image/svg+xml', 'image/webp', 'image/gif'];
    if (!allowedTypes.includes(file.type)) {
      return {
        success: false,
        error: '지원하지 않는 파일 형식입니다. PNG, JPG, SVG, WebP, GIF만 가능합니다.',
      };
    }

    // Validate file size (max 2MB)
    const maxSize = 2 * 1024 * 1024;
    if (file.size > maxSize) {
      return {
        success: false,
        error: '파일 크기는 2MB 이하여야 합니다.',
      };
    }

    // Generate unique filename
    const fileExt = file.name.split('.').pop();
    const fileName = `${toolId}.${fileExt}`;

    // Upload to Supabase Storage
    const { data, error } = await supabase.storage
      .from(BUCKET_NAME)
      .upload(fileName, file, {
        cacheControl: '3600',
        upsert: true, // Overwrite if exists
      });

    if (error) {
      console.error('Upload error:', error);
      return {
        success: false,
        error: error.message,
      };
    }

    // Get public URL
    const { data: urlData } = supabase.storage
      .from(BUCKET_NAME)
      .getPublicUrl(fileName);

    return {
      success: true,
      url: urlData.publicUrl,
    };
  } catch (error) {
    console.error('Upload error:', error);
    return {
      success: false,
      error: '로고 업로드 중 오류가 발생했습니다.',
    };
  }
}

/**
 * Delete a logo from Supabase Storage
 */
export async function deleteLogo(toolId: string): Promise<boolean> {
  try {
    const supabase = createClient();

    // Try to delete common extensions
    const extensions = ['png', 'jpg', 'jpeg', 'svg', 'webp', 'gif'];

    for (const ext of extensions) {
      const fileName = `${toolId}.${ext}`;
      await supabase.storage.from(BUCKET_NAME).remove([fileName]);
    }

    return true;
  } catch (error) {
    console.error('Delete error:', error);
    return false;
  }
}

/**
 * Get logo URL from Supabase Storage
 */
export function getLogoUrl(toolId: string, extension: string = 'png'): string {
  const supabase = createClient();
  const fileName = `${toolId}.${extension}`;

  const { data } = supabase.storage
    .from(BUCKET_NAME)
    .getPublicUrl(fileName);

  return data.publicUrl;
}

/**
 * List all logos in storage
 */
export async function listLogos(): Promise<string[]> {
  try {
    const supabase = createClient();

    const { data, error } = await supabase.storage
      .from(BUCKET_NAME)
      .list();

    if (error) {
      console.error('List error:', error);
      return [];
    }

    return data?.map(file => file.name) || [];
  } catch (error) {
    console.error('List error:', error);
    return [];
  }
}
