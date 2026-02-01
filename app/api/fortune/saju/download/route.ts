/**
 * 사주 분석 결과 다운로드 API
 *
 * PDF 문서 및 음성 파일 다운로드 기능
 *
 * GET /api/fortune/saju/download?type=pdf&analysisId=xxx
 * GET /api/fortune/saju/download?type=audio&analysisId=xxx
 * POST /api/fortune/saju/download (실시간 생성)
 *
 * 무료 사용자: 블라인드 처리된 PDF 다운로드 가능
 * 프리미엄 사용자: 전체 PDF 및 음성 다운로드 가능
 */

import { NextRequest, NextResponse } from 'next/server';
import { createClient, createServiceClient } from '@/lib/supabase/server';
import {
  generateSajuPDF,
  generatePDFFilename,
  generateSajuAudio,
  generateAudioFilename,
  generateNarrationScript,
  narrationToText
} from '@/lib/fortune/saju/export';
import { calculateSaju } from '@/lib/fortune/saju/calculator';
import { analyzeOheng } from '@/lib/fortune/saju/oheng';
import {
  deductPoints,
  getPointBalance,
  PRODUCT_COSTS
} from '@/lib/services/pointService';
import { blindPremiumContent } from '@/lib/services/analysisService';
import {
  checkFileExists,
  downloadStoredFile,
  uploadAnalysisFile,
  updateAnalysisFileUrls
} from '@/lib/storage/analysisFiles';
import type { UserInput, SajuChart, OhengBalance, PremiumContent, Element } from '@/types/saju';
import type { TTSProviderType, TTSSettings } from '@/lib/services/ttsSettingsService';

// 관리자 이메일 목록
const ADMIN_EMAILS = ['mymiryu@gmail.com'];

// 기본 TTS 설정
const DEFAULT_TTS_SETTINGS: TTSSettings = {
  provider: 'openai',
  voice: 'nova',
  speed: 0.95,
  testMode: false
};

/**
 * DB에서 TTS 설정 가져오기 (서버사이드)
 */
async function getTTSSettingsFromDB(): Promise<TTSSettings> {
  try {
    const serviceClient = createServiceClient();
    const { data, error } = await (serviceClient as any)
      .from('site_settings')
      .select('value')
      .eq('key', 'tts_settings')
      .single();

    if (error || !data?.value) {
      return DEFAULT_TTS_SETTINGS;
    }

    return data.value as TTSSettings;
  } catch (error) {
    console.error('Error fetching TTS settings:', error);
    return DEFAULT_TTS_SETTINGS;
  }
}

/**
 * TTS 제공자별 API 키 및 설정 가져오기
 */
function getTTSConfig(provider: TTSProviderType, voiceId?: string) {
  const openaiKey = process.env.OPENAI_API_KEY;
  const googleAIKey = process.env.GOOGLE_AI_API_KEY;
  const googleTTSKey = process.env.GOOGLE_TTS_API_KEY;

  switch (provider) {
    case 'openai':
      if (!openaiKey) {
        console.warn('OpenAI API key not found, falling back to Edge TTS');
        return { provider: 'edge' as const, voiceId: 'ko-KR-SunHiNeural' };
      }
      return { provider: 'openai' as const, apiKey: openaiKey, voiceId: voiceId || 'nova' };

    case 'gemini-flash':
      if (!googleAIKey) {
        console.warn('Google AI API key not found, falling back to OpenAI');
        if (openaiKey) return { provider: 'openai' as const, apiKey: openaiKey, voiceId: 'nova' };
        return { provider: 'edge' as const, voiceId: 'ko-KR-SunHiNeural' };
      }
      return { provider: 'gemini-flash' as const, apiKey: googleAIKey, voiceId: voiceId || 'Kore' };

    case 'gemini-pro':
      if (!googleAIKey) {
        console.warn('Google AI API key not found, falling back to OpenAI');
        if (openaiKey) return { provider: 'openai' as const, apiKey: openaiKey, voiceId: 'nova' };
        return { provider: 'edge' as const, voiceId: 'ko-KR-SunHiNeural' };
      }
      return { provider: 'gemini-pro' as const, apiKey: googleAIKey, voiceId: voiceId || 'Kore' };

    case 'google':
      if (!googleTTSKey) {
        console.warn('Google Cloud TTS API key not found, falling back to Edge TTS');
        return { provider: 'edge' as const, voiceId: 'ko-KR-SunHiNeural' };
      }
      return { provider: 'google' as const, apiKey: googleTTSKey, voiceId: voiceId || 'ko-KR-Neural2-A' };

    case 'edge':
    default:
      return { provider: 'edge' as const, voiceId: voiceId || 'ko-KR-SunHiNeural' };
  }
}

// 저장된 분석 결과에서 다운로드 (GET)
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const type = searchParams.get('type'); // 'pdf' or 'audio'
    const analysisId = searchParams.get('analysisId');

    if (!type || !['pdf', 'audio'].includes(type)) {
      return NextResponse.json(
        { error: '유효하지 않은 다운로드 타입입니다. pdf 또는 audio를 지정해주세요.' },
        { status: 400 }
      );
    }

    if (!analysisId) {
      return NextResponse.json(
        { error: '분석 ID가 필요합니다.' },
        { status: 400 }
      );
    }

    const supabase = await createClient();

    // 사용자 확인
    const { data: { user }, error: authError } = await supabase.auth.getUser();
    if (authError || !user) {
      return NextResponse.json(
        { error: '로그인이 필요합니다.' },
        { status: 401 }
      );
    }

    // 분석 결과 조회
    const { data: analysis, error: fetchError } = await (supabase as any)
      .from('fortune_analyses')
      .select('*')
      .eq('id', analysisId)
      .eq('user_id', user.id)
      .single();

    if (fetchError || !analysis) {
      return NextResponse.json(
        { error: '분석 결과를 찾을 수 없습니다.' },
        { status: 404 }
      );
    }

    // 만료 확인 (45일 보관 기간)
    if (analysis.expires_at) {
      const expiresAt = new Date(analysis.expires_at);
      if (new Date() > expiresAt) {
        return NextResponse.json(
          {
            error: '다운로드 기간이 만료되었습니다. 분석일로부터 45일 이내에만 다운로드 가능합니다.',
            errorCode: 'DOWNLOAD_EXPIRED'
          },
          { status: 410 }  // Gone
        );
      }
    } else {
      // expires_at이 없는 경우, created_at 기준 45일 체크
      const createdAt = new Date(analysis.created_at);
      const expirationDate = new Date(createdAt.getTime() + 45 * 24 * 60 * 60 * 1000);
      if (new Date() > expirationDate) {
        return NextResponse.json(
          {
            error: '다운로드 기간이 만료되었습니다. 분석일로부터 45일 이내에만 다운로드 가능합니다.',
            errorCode: 'DOWNLOAD_EXPIRED'
          },
          { status: 410 }
        );
      }
    }

    // 데이터 준비 (input_data JSON에서 사용자 정보 추출)
    const inputData = analysis.input_data as Record<string, unknown> || {};
    const userInput: UserInput = {
      name: (inputData.name as string) || '사용자',
      birthDate: (inputData.birthDate as string) || '',
      birthTime: inputData.birthTime as string | undefined,
      gender: (inputData.gender as 'male' | 'female') || 'male',
      careerType: inputData.careerType as UserInput['careerType']
    };

    // 생년월일 유효성 검사
    if (!userInput.birthDate) {
      return NextResponse.json(
        { error: '분석 데이터에 생년월일 정보가 없습니다.' },
        { status: 400 }
      );
    }

    const resultData = analysis.result_full as Record<string, unknown> | null;
    const saju = (resultData?.saju as SajuChart) || calculateSaju(userInput.birthDate, userInput.birthTime);
    const ohengResult = analyzeOheng(saju);
    const oheng = ohengResult.balance;
    const yongsin = ohengResult.yongsin;
    const gisin = ohengResult.gisin;

    const premium: PremiumContent | undefined = resultData?.premium as PremiumContent | undefined;
    const targetYear = (resultData?.targetYear as number) || new Date().getFullYear();

    // 포인트 잔액 및 프리미엄 상태 확인
    const pointBalance = await getPointBalance(user.id);
    const isPremiumUser = pointBalance?.isPremium || false;
    const isAnalysisPremium = analysis.is_premium === true;

    if (type === 'pdf') {
      // PDF는 무료 사용자도 다운로드 가능하지만, 무료 버전은 블라인드 처리
      let pdfPremium = premium;
      let isBlindedPDF = false;

      // 프리미엄 사용자이거나, 이 분석이 프리미엄인 경우 전체 PDF 제공
      if (!isPremiumUser && !isAnalysisPremium) {
        // 무료 사용자: 블라인드 처리된 PDF 생성
        if (premium) {
          pdfPremium = blindPremiumContent(premium);
        }
        isBlindedPDF = true;
      }

      // 저장된 PDF 확인 (프리미엄 분석만 저장)
      if (isAnalysisPremium && !isBlindedPDF) {
        const storedPdf = await downloadStoredFile(user.id, analysisId, 'pdf');
        if (storedPdf.success && storedPdf.data) {
          console.log(`[PDF] Serving stored PDF for analysis ${analysisId}`);
          const filename = generatePDFFilename(userInput, targetYear);
          return new NextResponse(storedPdf.data, {
            status: 200,
            headers: {
              'Content-Type': 'application/pdf',
              'Content-Disposition': `attachment; filename="${encodeURIComponent(filename)}"`,
              'Content-Length': storedPdf.data.length.toString(),
              'X-PDF-Type': 'full',
              'X-Source': 'stored'
            }
          });
        }
      }

      // PDF 생성
      const pdfBuffer = await generateSajuPDF({
        user: userInput,
        saju,
        oheng,
        yongsin,
        gisin,
        premium: pdfPremium,
        targetYear
      });

      // 프리미엄 PDF는 저장 (재사용을 위해)
      if (isAnalysisPremium && !isBlindedPDF) {
        const uploadResult = await uploadAnalysisFile(user.id, analysisId, 'pdf', pdfBuffer);
        if (uploadResult.success && uploadResult.url) {
          await updateAnalysisFileUrls(analysisId, { pdfUrl: uploadResult.url });
          console.log(`[PDF] Saved PDF for analysis ${analysisId}`);
        }
      }

      const filename = isBlindedPDF
        ? generatePDFFilename(userInput, targetYear).replace('.pdf', '_무료버전.pdf')
        : generatePDFFilename(userInput, targetYear);

      return new NextResponse(new Uint8Array(pdfBuffer), {
        status: 200,
        headers: {
          'Content-Type': 'application/pdf',
          'Content-Disposition': `attachment; filename="${encodeURIComponent(filename)}"`,
          'Content-Length': pdfBuffer.length.toString(),
          'X-PDF-Type': isBlindedPDF ? 'blinded' : 'full',
          'X-Source': 'generated'
        }
      });
    } else {
      // ========== 음성(MP3) 다운로드 ==========
      // 중요: MP3는 비용 발생으로 최초 1회만 생성, 이후 저장된 파일 제공

      const isAdmin = user.email ? ADMIN_EMAILS.includes(user.email) : false;

      // 1. 먼저 저장된 음성 파일이 있는지 확인
      const audioExists = await checkFileExists(user.id, analysisId, 'audio');

      if (audioExists) {
        // 저장된 파일 다운로드
        const storedAudio = await downloadStoredFile(user.id, analysisId, 'audio');
        if (storedAudio.success && storedAudio.data) {
          console.log(`[Audio] Serving stored MP3 for analysis ${analysisId}`);
          const filename = generateAudioFilename(userInput, targetYear);
          return new NextResponse(storedAudio.data, {
            status: 200,
            headers: {
              'Content-Type': 'audio/mpeg',
              'Content-Disposition': `attachment; filename="${encodeURIComponent(filename)}"`,
              'Content-Length': storedAudio.data.length.toString(),
              'X-Source': 'stored'
            }
          });
        }
      }

      // 2. DB에 audio_url이 있는지도 확인 (이미 생성된 적 있음을 의미)
      if (analysis.audio_url && !audioExists) {
        // URL은 있는데 파일이 없음 (만료되었거나 삭제됨)
        return NextResponse.json(
          {
            error: '이전에 생성된 음성 파일이 만료되었습니다. 음성은 최초 1회만 생성 가능합니다.',
            errorCode: 'AUDIO_ALREADY_GENERATED'
          },
          { status: 410 }
        );
      }

      // 3. 새로 생성 (최초 1회만)
      const currentPoints = pointBalance?.points || 0;
      const audioCost = PRODUCT_COSTS.voice; // 300 포인트

      // 무료 대상: 관리자, 프리미엄 구독자, 프리미엄 분석
      const isFreeAudio = isAdmin || isPremiumUser || isAnalysisPremium;

      // 무료 대상이 아니고 포인트도 부족한 경우
      if (!isFreeAudio && currentPoints < audioCost) {
        return NextResponse.json(
          {
            error: `음성 생성에는 ${audioCost} 포인트가 필요합니다. 현재 보유 포인트: ${currentPoints}`,
            errorCode: 'INSUFFICIENT_POINTS',
            requiredPoints: audioCost,
            currentPoints: currentPoints,
            upgradeRequired: true
          },
          { status: 402 }
        );
      }

      // 무료 대상이 아닌 경우에만 포인트 차감
      if (!isFreeAudio) {
        const deductResult = await deductPoints(user.id, 'voice');
        if (!deductResult.success) {
          return NextResponse.json(
            { error: '포인트 차감에 실패했습니다.' },
            { status: 500 }
          );
        }
      }

      // DB에서 TTS 설정 가져오기
      const ttsSettings = await getTTSSettingsFromDB();

      // TTS 설정에서 제공자 및 음성 설정
      const config = getTTSConfig(ttsSettings.provider, ttsSettings.voice);

      console.log(`[TTS] Generating new audio with provider: ${config.provider}, voice: ${config.voiceId}`);

      const audioBuffer = await generateSajuAudio({
        user: userInput,
        saju,
        oheng,
        yongsin,
        gisin,
        premium,
        targetYear,
        config
      });

      // 4. 생성된 음성 파일 저장 (재생성 방지)
      const uploadResult = await uploadAnalysisFile(user.id, analysisId, 'audio', audioBuffer);
      if (uploadResult.success && uploadResult.url) {
        await updateAnalysisFileUrls(analysisId, { audioUrl: uploadResult.url });
        console.log(`[Audio] Saved MP3 for analysis ${analysisId}`);
      } else {
        console.error(`[Audio] Failed to save MP3 for analysis ${analysisId}:`, uploadResult.error);
      }

      const filename = generateAudioFilename(userInput, targetYear);

      return new NextResponse(new Uint8Array(audioBuffer), {
        status: 200,
        headers: {
          'Content-Type': 'audio/mpeg',
          'Content-Disposition': `attachment; filename="${encodeURIComponent(filename)}"`,
          'Content-Length': audioBuffer.length.toString(),
          'X-TTS-Provider': config.provider,
          'X-Source': 'generated'
        }
      });
    }
  } catch (error) {
    console.error('Download error:', error);
    return NextResponse.json(
      { error: '다운로드 중 오류가 발생했습니다.' },
      { status: 500 }
    );
  }
}

// 실시간 생성 다운로드 (POST)
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const {
      type,
      user: userInput,
      saju,
      oheng,
      yongsin,
      gisin,
      premium,
      targetYear = 2026
    } = body as {
      type: string;
      user: UserInput;
      saju: SajuChart;
      oheng: OhengBalance;
      yongsin?: Element[];
      gisin?: Element[];
      premium?: PremiumContent;
      targetYear?: number;
    };

    if (!type || !['pdf', 'audio', 'script'].includes(type)) {
      return NextResponse.json(
        { error: '유효하지 않은 다운로드 타입입니다.' },
        { status: 400 }
      );
    }

    if (!userInput || !saju || !oheng) {
      return NextResponse.json(
        { error: '필수 데이터가 누락되었습니다.' },
        { status: 400 }
      );
    }

    // 음성 생성은 관리자/프리미엄 구독자 무료, 일반 사용자는 포인트 차감
    if (type === 'audio') {
      const supabase = await createClient();
      const { data: { user }, error: authError } = await supabase.auth.getUser();

      if (authError || !user) {
        return NextResponse.json(
          { error: '음성 생성은 로그인이 필요합니다.' },
          { status: 401 }
        );
      }

      const isAdmin = user.email ? ADMIN_EMAILS.includes(user.email) : false;
      const pointBalance = await getPointBalance(user.id);
      const isPremiumUser = pointBalance?.isPremium || false;
      const currentPoints = pointBalance?.points || 0;
      const audioCost = PRODUCT_COSTS.voice; // 300 포인트

      // 무료 대상: 관리자, 프리미엄 구독자
      const isFreeAudio = isAdmin || isPremiumUser;

      // 무료 대상이 아니고 포인트도 부족한 경우
      if (!isFreeAudio && currentPoints < audioCost) {
        return NextResponse.json(
          {
            error: `음성 생성에는 ${audioCost} 포인트가 필요합니다. 현재 보유 포인트: ${currentPoints}`,
            errorCode: 'INSUFFICIENT_POINTS',
            requiredPoints: audioCost,
            currentPoints: currentPoints,
            upgradeRequired: true
          },
          { status: 402 }
        );
      }

      // 무료 대상이 아닌 경우에만 포인트 차감
      if (!isFreeAudio) {
        const deductResult = await deductPoints(user.id, 'voice');
        if (!deductResult.success) {
          return NextResponse.json(
            { error: '포인트 차감에 실패했습니다.' },
            { status: 500 }
          );
        }
      }
    }

    // script 타입은 나레이션 텍스트만 반환 (미리보기용)
    if (type === 'script') {
      const script = generateNarrationScript({
        user: userInput,
        saju,
        oheng,
        yongsin,
        gisin,
        premium,
        targetYear
      });

      return NextResponse.json({
        success: true,
        script: narrationToText(script),
        estimatedDuration: script.totalDuration,
        sections: script.sections.map(s => ({
          title: s.title,
          content: s.content
        }))
      });
    }

    if (type === 'pdf') {
      const pdfBuffer = await generateSajuPDF({
        user: userInput,
        saju,
        oheng,
        yongsin,
        gisin,
        premium,
        targetYear
      });

      const filename = generatePDFFilename(userInput, targetYear);

      return new NextResponse(new Uint8Array(pdfBuffer), {
        status: 200,
        headers: {
          'Content-Type': 'application/pdf',
          'Content-Disposition': `attachment; filename="${encodeURIComponent(filename)}"`,
          'Content-Length': pdfBuffer.length.toString()
        }
      });
    } else {
      // audio
      // DB에서 TTS 설정 가져오기
      const ttsSettings = await getTTSSettingsFromDB();
      const requestedVoice = (body as Record<string, unknown>).voiceId as string;

      // TTS 설정에서 제공자 및 음성 설정 (요청된 음성이 있으면 우선)
      const config = getTTSConfig(ttsSettings.provider, requestedVoice || ttsSettings.voice);

      console.log(`[TTS POST] Using provider: ${config.provider}, voice: ${config.voiceId}`);

      const audioBuffer = await generateSajuAudio({
        user: userInput,
        saju,
        oheng,
        yongsin,
        gisin,
        premium,
        targetYear,
        config
      });

      const filename = generateAudioFilename(userInput, targetYear);

      return new NextResponse(new Uint8Array(audioBuffer), {
        status: 200,
        headers: {
          'Content-Type': 'audio/mpeg',
          'Content-Disposition': `attachment; filename="${encodeURIComponent(filename)}"`,
          'Content-Length': audioBuffer.length.toString(),
          'X-TTS-Provider': config.provider
        }
      });
    }
  } catch (error) {
    console.error('Download generation error:', error);
    return NextResponse.json(
      { error: '파일 생성 중 오류가 발생했습니다.' },
      { status: 500 }
    );
  }
}
