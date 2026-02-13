import { NextRequest, NextResponse } from 'next/server';
import { createClient, createServiceClient } from '@/lib/supabase/server';
import crypto from 'crypto';

// Admin 이메일 목록
const ADMIN_EMAILS = ['mymiryu@gmail.com'];

// 암호화 키 (환경변수에서 가져오거나 생성)
const ENCRYPTION_KEY = process.env.API_KEY_ENCRYPTION_SECRET ||
  crypto.createHash('sha256')
    .update(process.env.SUPABASE_SERVICE_ROLE_KEY || 'default-key')
    .digest();

// API 키 암호화
function encryptApiKey(key: string): string {
  if (!key || key.includes('*')) return key; // 이미 마스킹된 키는 그대로

  const iv = crypto.randomBytes(16);
  const cipher = crypto.createCipheriv('aes-256-cbc', ENCRYPTION_KEY, iv);
  let encrypted = cipher.update(key, 'utf8', 'hex');
  encrypted += cipher.final('hex');
  return `${iv.toString('hex')}:${encrypted}`;
}

// API 키 복호화
function decryptApiKey(encryptedKey: string): string {
  if (!encryptedKey || !encryptedKey.includes(':')) return encryptedKey;

  try {
    const [ivHex, encrypted] = encryptedKey.split(':');
    const iv = Buffer.from(ivHex, 'hex');
    const decipher = crypto.createDecipheriv('aes-256-cbc', ENCRYPTION_KEY, iv);
    let decrypted = decipher.update(encrypted, 'hex', 'utf8');
    decrypted += decipher.final('utf8');
    return decrypted;
  } catch {
    return encryptedKey;
  }
}

// API 키 마스킹 (표시용)
function maskApiKey(key: string): string {
  if (!key) return '';

  // 암호화된 키인 경우 먼저 복호화
  const decrypted = decryptApiKey(key);

  // 앞 4자, 뒤 4자만 보이고 나머지는 ***
  if (decrypted.length <= 8) return '***';
  return `${decrypted.substring(0, 4)}${'*'.repeat(Math.min(8, decrypted.length - 8))}${decrypted.substring(decrypted.length - 4)}`;
}

// Admin 권한 확인
async function checkAdminAuth(): Promise<{ isAdmin: boolean; error?: string }> {
  const supabase = await createClient();
  const { data: { user }, error } = await supabase.auth.getUser();

  if (error || !user) {
    return { isAdmin: false, error: 'Unauthorized' };
  }

  const userEmail = user.email?.toLowerCase();
  if (!userEmail || !ADMIN_EMAILS.includes(userEmail)) {
    return { isAdmin: false, error: 'Forbidden' };
  }

  return { isAdmin: true };
}

// GET: API 키 조회 (마스킹됨)
export async function GET() {
  const authResult = await checkAdminAuth();
  if (!authResult.isAdmin) {
    return NextResponse.json({ error: authResult.error }, { status: authResult.error === 'Forbidden' ? 403 : 401 });
  }

  try {
    const serviceClient = createServiceClient();

    // site_settings에서 api_keys 조회
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const { data, error } = await (serviceClient as any)
      .from('site_settings')
      .select('api_keys')
      .eq('id', 1)
      .single();

    if (error && error.code !== 'PGRST116') {
      console.error('Error fetching API keys:', error);
      return NextResponse.json({ error: 'Failed to fetch API keys' }, { status: 500 });
    }

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const apiKeys = (data as any)?.api_keys || {};

    // 마스킹된 키 반환
    const maskedKeys: Record<string, string> = {};
    for (const [key, value] of Object.entries(apiKeys)) {
      maskedKeys[key] = maskApiKey(value as string);
    }

    return NextResponse.json({ keys: maskedKeys });
  } catch (error) {
    console.error('Error in GET /api/admin/api-keys:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

// POST: API 키 저장
export async function POST(request: NextRequest) {
  const authResult = await checkAdminAuth();
  if (!authResult.isAdmin) {
    return NextResponse.json({ error: authResult.error }, { status: authResult.error === 'Forbidden' ? 403 : 401 });
  }

  try {
    const body = await request.json();
    const { keys } = body;

    if (!keys || typeof keys !== 'object') {
      return NextResponse.json({ error: 'Invalid request body' }, { status: 400 });
    }

    const serviceClient = createServiceClient();

    // 기존 API 키 조회
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const { data: existing } = await (serviceClient as any)
      .from('site_settings')
      .select('api_keys')
      .eq('id', 1)
      .single();

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const existingKeys = (existing as any)?.api_keys || {};

    // 새로운 키만 암호화하여 업데이트 (마스킹된 키는 기존 값 유지)
    const updatedKeys: Record<string, string> = {};
    for (const [key, value] of Object.entries(keys)) {
      const strValue = String(value);

      if (!strValue || strValue.includes('*')) {
        // 빈 값이거나 마스킹된 키는 기존 값 유지
        if (existingKeys[key]) {
          updatedKeys[key] = existingKeys[key];
        }
      } else {
        // 새로운 키는 암호화하여 저장
        updatedKeys[key] = encryptApiKey(strValue);
      }
    }

    // Upsert (있으면 업데이트, 없으면 삽입)
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const { error } = await (serviceClient as any)
      .from('site_settings')
      .upsert({
        id: 1,
        api_keys: updatedKeys,
        updated_at: new Date().toISOString(),
      }, { onConflict: 'id' });

    if (error) {
      console.error('Error saving API keys:', error);
      return NextResponse.json({ error: 'Failed to save API keys' }, { status: 500 });
    }

    return NextResponse.json({ success: true, message: 'API keys saved successfully' });
  } catch (error) {
    console.error('Error in POST /api/admin/api-keys:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
