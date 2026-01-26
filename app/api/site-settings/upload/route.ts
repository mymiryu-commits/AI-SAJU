import { NextRequest, NextResponse } from 'next/server';
import { createClient, createServiceClient } from '@/lib/supabase/server';
import type { Database } from '@/types/database';

// Route segment config for larger file uploads
export const dynamic = 'force-dynamic';
export const runtime = 'nodejs';

type UsersRow = Database['public']['Tables']['users']['Row'];

// POST - Upload hero image to Supabase Storage (admin only)
export async function POST(request: NextRequest) {
  try {
    const supabase = await createClient();

    // Check if user is authenticated
    const { data: { user }, error: authError } = await supabase.auth.getUser();

    if (authError || !user) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    // Check if user is admin (email-based + DB fallback)
    const adminEmails = ['mymiryu@gmail.com']; // 하드코딩 admin 이메일
    const envEmails = process.env.NEXT_PUBLIC_ADMIN_EMAILS?.split(',') || [];
    const allAdminEmails = [...new Set([...adminEmails, ...envEmails])];

    let isAdmin = user.email && allAdminEmails.includes(user.email);

    // DB에서도 체크 (users 테이블이 있는 경우)
    if (!isAdmin) {
      try {
        const { data: userData } = await supabase
          .from('users')
          .select('membership_tier')
          .eq('id', user.id)
          .single<Pick<UsersRow, 'membership_tier'>>();

        isAdmin = userData?.membership_tier === 'admin';
      } catch {
        // users 테이블이 없으면 무시
      }
    }

    if (!isAdmin) {
      return NextResponse.json(
        { error: 'Forbidden - Admin access required' },
        { status: 403 }
      );
    }

    const formData = await request.formData();
    const file = formData.get('file') as File | null;
    const imageType = formData.get('type') as string | null; // 'background' or 'content'

    if (!file) {
      return NextResponse.json(
        { error: 'No file provided' },
        { status: 400 }
      );
    }

    // 허용된 이미지 타입: background, content, 또는 service_로 시작하는 서비스 카드 타입
    const validTypes = ['background', 'content'];
    const isServiceCard = imageType?.startsWith('service_');

    if (!imageType || (!validTypes.includes(imageType) && !isServiceCard)) {
      return NextResponse.json(
        { error: 'Invalid image type. Must be "background", "content", or service card type (e.g., "service_daily_fortune")' },
        { status: 400 }
      );
    }

    // Validate file type
    const allowedTypes = ['image/jpeg', 'image/png', 'image/webp', 'image/gif'];
    if (!allowedTypes.includes(file.type)) {
      return NextResponse.json(
        { error: 'Invalid file type. Allowed: JPEG, PNG, WebP, GIF' },
        { status: 400 }
      );
    }

    // Validate file size (max 5MB)
    const maxSize = 5 * 1024 * 1024; // 5MB
    if (file.size > maxSize) {
      return NextResponse.json(
        { error: 'File too large. Maximum size is 5MB' },
        { status: 400 }
      );
    }

    // Generate unique filename
    const ext = file.name.split('.').pop();
    const timestamp = Date.now();
    const filename = `hero-${imageType}-${timestamp}.${ext}`;

    // Convert File to ArrayBuffer
    const arrayBuffer = await file.arrayBuffer();
    const buffer = new Uint8Array(arrayBuffer);

    // 서비스 롤 클라이언트 사용 (스토리지 RLS 우회)
    const serviceClient = createServiceClient();

    // Upload to Supabase Storage
    const { data: uploadData, error: uploadError } = await serviceClient.storage
      .from('hero-images')
      .upload(filename, buffer, {
        contentType: file.type,
        upsert: true,
      });

    if (uploadError) {
      console.error('Error uploading to storage:', uploadError);
      return NextResponse.json(
        { error: 'Failed to upload image: ' + uploadError.message },
        { status: 500 }
      );
    }

    // Get public URL
    const { data: { publicUrl } } = serviceClient.storage
      .from('hero-images')
      .getPublicUrl(filename);

    return NextResponse.json({
      url: publicUrl,
      filename,
      message: 'Image uploaded successfully',
    });
  } catch (error) {
    console.error('Error in POST /api/site-settings/upload:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

// DELETE - Delete hero image from Supabase Storage (admin only)
export async function DELETE(request: NextRequest) {
  try {
    const supabase = await createClient();

    // Check if user is authenticated
    const { data: { user }, error: authError } = await supabase.auth.getUser();

    if (authError || !user) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    // Check if user is admin (email-based + DB fallback)
    const adminEmails = ['mymiryu@gmail.com']; // 하드코딩 admin 이메일
    const envEmails = process.env.NEXT_PUBLIC_ADMIN_EMAILS?.split(',') || [];
    const allAdminEmails = [...new Set([...adminEmails, ...envEmails])];

    let isAdmin = user.email && allAdminEmails.includes(user.email);

    // DB에서도 체크 (users 테이블이 있는 경우)
    if (!isAdmin) {
      try {
        const { data: userData } = await supabase
          .from('users')
          .select('membership_tier')
          .eq('id', user.id)
          .single<Pick<UsersRow, 'membership_tier'>>();

        isAdmin = userData?.membership_tier === 'admin';
      } catch {
        // users 테이블이 없으면 무시
      }
    }

    if (!isAdmin) {
      return NextResponse.json(
        { error: 'Forbidden - Admin access required' },
        { status: 403 }
      );
    }

    const { searchParams } = new URL(request.url);
    const filename = searchParams.get('filename');

    if (!filename) {
      return NextResponse.json(
        { error: 'No filename provided' },
        { status: 400 }
      );
    }

    // 서비스 롤 클라이언트 사용 (스토리지 RLS 우회)
    const serviceClient = createServiceClient();

    // Delete from Supabase Storage
    const { error: deleteError } = await serviceClient.storage
      .from('hero-images')
      .remove([filename]);

    if (deleteError) {
      console.error('Error deleting from storage:', deleteError);
      return NextResponse.json(
        { error: 'Failed to delete image' },
        { status: 500 }
      );
    }

    return NextResponse.json({ message: 'Image deleted successfully' });
  } catch (error) {
    console.error('Error in DELETE /api/site-settings/upload:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
