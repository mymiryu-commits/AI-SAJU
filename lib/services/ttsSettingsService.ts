/**
 * TTS 설정 서비스
 *
 * 관리자가 TTS 제공자를 선택할 수 있도록 하는 서비스입니다.
 * 설정은 site_settings 테이블에 저장됩니다.
 */

export type TTSProviderType =
  | 'openai'      // OpenAI TTS (Nova) - 기본값
  | 'gemini-flash' // Gemini 2.5 Flash TTS - 빠르고 저렴
  | 'gemini-pro'   // Gemini 2.5 Pro TTS - 고품질
  | 'edge'         // Microsoft Edge TTS - 무료
  | 'google'       // Google Cloud TTS
  | 'naver';       // Naver Clova TTS

export interface TTSSettings {
  provider: TTSProviderType;
  voice?: string;
  speed?: number;
  // 테스트 모드 (관리자만 음성 생성 가능)
  testMode?: boolean;
  // Gemini 스타일 프롬프트
  geminiStylePrompt?: string;
}

export const DEFAULT_TTS_SETTINGS: TTSSettings = {
  provider: 'openai',
  voice: 'nova',
  speed: 0.95,
  testMode: false
};

// TTS 제공자 정보
export const TTS_PROVIDERS = {
  'openai': {
    name: 'OpenAI TTS',
    description: '고품질 영어/한국어 지원, 다양한 음성',
    cost: '~$0.045/3000자 (약 60원)',
    quality: 8,
    speed: 'medium',
    voices: ['nova', 'shimmer', 'echo', 'onyx', 'fable', 'alloy'],
    defaultVoice: 'nova',
    requiresApiKey: 'OPENAI_API_KEY'
  },
  'gemini-flash': {
    name: 'Gemini Flash TTS',
    description: '빠르고 저렴, 감정 표현 우수, 문맥 이해',
    cost: '~$0.03/3000자 (약 40원)',
    quality: 8.5,
    speed: 'fast',
    voices: ['Kore', 'Aoede', 'Charon', 'Puck'],
    defaultVoice: 'Kore',
    requiresApiKey: 'GOOGLE_AI_API_KEY'
  },
  'gemini-pro': {
    name: 'Gemini Pro TTS',
    description: '최고 품질, 자연스러운 감정, 스타일 조절',
    cost: '~$0.06/3000자 (약 80원)',
    quality: 9,
    speed: 'medium',
    voices: ['Kore', 'Aoede', 'Charon', 'Puck'],
    defaultVoice: 'Kore',
    requiresApiKey: 'GOOGLE_AI_API_KEY'
  },
  'edge': {
    name: 'Microsoft Edge TTS',
    description: '무료, 기본 품질, 한국어 지원',
    cost: '무료',
    quality: 6,
    speed: 'fast',
    voices: ['ko-KR-SunHiNeural', 'ko-KR-InJoonNeural'],
    defaultVoice: 'ko-KR-SunHiNeural',
    requiresApiKey: null
  },
  'google': {
    name: 'Google Cloud TTS',
    description: 'WaveNet/Neural2 음성, 안정적',
    cost: '~$0.048/3000자 (약 65원)',
    quality: 7,
    speed: 'medium',
    voices: ['ko-KR-Neural2-A', 'ko-KR-Neural2-B', 'ko-KR-Neural2-C'],
    defaultVoice: 'ko-KR-Neural2-A',
    requiresApiKey: 'GOOGLE_TTS_API_KEY'
  },
  'naver': {
    name: 'Naver Clova TTS',
    description: '한국어 특화, 자연스러운 발음',
    cost: '~$0.05/3000자 (약 70원)',
    quality: 7.5,
    speed: 'medium',
    voices: ['vdain', 'vhyeri', 'vyuna', 'vgoeun'],
    defaultVoice: 'vdain',
    requiresApiKey: 'NAVER_CLIENT_ID'
  }
} as const;

/**
 * 서버에서 TTS 설정 가져오기
 */
export async function fetchTTSSettings(): Promise<TTSSettings> {
  try {
    const response = await fetch('/api/site-settings?key=tts_settings');
    if (!response.ok) {
      return DEFAULT_TTS_SETTINGS;
    }
    const result = await response.json();
    return result.data?.value || DEFAULT_TTS_SETTINGS;
  } catch (error) {
    console.error('Error fetching TTS settings:', error);
    return DEFAULT_TTS_SETTINGS;
  }
}

/**
 * TTS 설정 저장하기 (관리자 전용)
 */
export async function saveTTSSettings(settings: TTSSettings): Promise<boolean> {
  try {
    const response = await fetch('/api/site-settings', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        key: 'tts_settings',
        value: settings
      })
    });
    return response.ok;
  } catch (error) {
    console.error('Error saving TTS settings:', error);
    return false;
  }
}

/**
 * 현재 TTS 제공자의 기본 음성 가져오기
 */
export function getDefaultVoice(provider: TTSProviderType): string {
  return TTS_PROVIDERS[provider]?.defaultVoice || 'nova';
}

/**
 * API 키 확인
 */
export function checkApiKeyAvailable(provider: TTSProviderType): boolean {
  const requiredKey = TTS_PROVIDERS[provider]?.requiresApiKey;
  if (!requiredKey) return true; // Edge TTS는 API 키 불필요

  // 서버사이드에서만 확인 가능
  if (typeof window !== 'undefined') return true;

  return !!process.env[requiredKey];
}
