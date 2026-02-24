/**
 * API Key Service
 *
 * DB에 저장된 API 키를 안전하게 조회하는 서비스
 * 환경변수보다 DB 저장 키를 우선 사용
 */

import { createServiceClient } from '@/lib/supabase/server';
import crypto from 'crypto';

// 암호화 키
const ENCRYPTION_KEY = process.env.API_KEY_ENCRYPTION_SECRET ||
  crypto.createHash('sha256')
    .update(process.env.SUPABASE_SERVICE_ROLE_KEY || 'default-key')
    .digest();

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

// API 키 캐시 (5분)
let apiKeysCache: Record<string, string> | null = null;
let cacheTimestamp = 0;
const CACHE_TTL = 5 * 60 * 1000; // 5분

/**
 * DB에서 API 키 조회 (캐싱 적용)
 */
async function fetchApiKeysFromDB(): Promise<Record<string, string>> {
  // 캐시가 유효하면 반환
  if (apiKeysCache && Date.now() - cacheTimestamp < CACHE_TTL) {
    return apiKeysCache;
  }

  try {
    const serviceClient = createServiceClient();

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const { data, error } = await (serviceClient as any)
      .from('site_settings')
      .select('api_keys')
      .eq('id', 1)
      .single();

    if (error) {
      console.error('[ApiKeyService] Error fetching keys:', error);
      return {};
    }

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const encryptedKeys = (data as any)?.api_keys || {};

    // 복호화
    const decryptedKeys: Record<string, string> = {};
    for (const [key, value] of Object.entries(encryptedKeys)) {
      decryptedKeys[key] = decryptApiKey(value as string);
    }

    // 캐시 업데이트
    apiKeysCache = decryptedKeys;
    cacheTimestamp = Date.now();

    return decryptedKeys;
  } catch (error) {
    console.error('[ApiKeyService] Unexpected error:', error);
    return {};
  }
}

/**
 * Gemini API 키 조회
 * DB 키 > 환경변수 순서로 조회
 */
export async function getGeminiApiKey(): Promise<string | null> {
  const dbKeys = await fetchApiKeysFromDB();

  // DB 키 우선
  if (dbKeys.gemini) {
    return dbKeys.gemini;
  }

  // 환경변수 fallback (deprecated)
  return process.env.GOOGLE_AI_API_KEY || process.env.GEMINI_API_KEY || null;
}

/**
 * OpenAI API 키 조회
 */
export async function getOpenAIApiKey(): Promise<string | null> {
  const dbKeys = await fetchApiKeysFromDB();

  if (dbKeys.openai) {
    return dbKeys.openai;
  }

  return process.env.OPENAI_API_KEY || null;
}

/**
 * Toss Secret Key 조회
 */
export async function getTossSecretKey(): Promise<string | null> {
  const dbKeys = await fetchApiKeysFromDB();

  if (dbKeys.toss_secret) {
    return dbKeys.toss_secret;
  }

  return process.env.TOSS_SECRET_KEY || null;
}

/**
 * Toss Webhook Secret 조회
 */
export async function getTossWebhookSecret(): Promise<string | null> {
  const dbKeys = await fetchApiKeysFromDB();

  if (dbKeys.toss_webhook_secret) {
    return dbKeys.toss_webhook_secret;
  }

  return process.env.TOSS_WEBHOOK_SECRET || null;
}

/**
 * Stripe Secret Key 조회
 */
export async function getStripeSecretKey(): Promise<string | null> {
  const dbKeys = await fetchApiKeysFromDB();

  if (dbKeys.stripe_secret) {
    return dbKeys.stripe_secret;
  }

  return process.env.STRIPE_SECRET_KEY || null;
}

/**
 * Stripe Webhook Secret 조회
 */
export async function getStripeWebhookSecret(): Promise<string | null> {
  const dbKeys = await fetchApiKeysFromDB();

  if (dbKeys.stripe_webhook_secret) {
    return dbKeys.stripe_webhook_secret;
  }

  return process.env.STRIPE_WEBHOOK_SECRET || null;
}

/**
 * 캐시 초기화 (API 키 업데이트 후 호출)
 */
export function clearApiKeyCache(): void {
  apiKeysCache = null;
  cacheTimestamp = 0;
}
