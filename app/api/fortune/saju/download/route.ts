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
import { createClient } from '@/lib/supabase/server';
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
import type { UserInput, SajuChart, OhengBalance, PremiumContent, Element } from '@/types/saju';

// 관리자 이메일 목록
const ADMIN_EMAILS = ['mymiryu@gmail.com'];

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

    // 데이터 준비
    const userInput: UserInput = {
      name: (analysis as Record<string, unknown>).user_name as string || '사용자',
      birthDate: analysis.birth_date as string,
      birthTime: (analysis as Record<string, unknown>).birth_time as string | undefined,
      gender: (analysis.gender as 'male' | 'female') || 'male',
      careerType: (analysis as Record<string, unknown>).career_type as UserInput['careerType']
    };

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

      const filename = isBlindedPDF
        ? generatePDFFilename(userInput, targetYear).replace('.pdf', '_무료버전.pdf')
        : generatePDFFilename(userInput, targetYear);

      return new NextResponse(new Uint8Array(pdfBuffer), {
        status: 200,
        headers: {
          'Content-Type': 'application/pdf',
          'Content-Disposition': `attachment; filename="${encodeURIComponent(filename)}"`,
          'Content-Length': pdfBuffer.length.toString(),
          'X-PDF-Type': isBlindedPDF ? 'blinded' : 'full'
        }
      });
    } else {
      // 음성 생성 - 관리자 무료, 포인트 보유 사용자는 포인트 차감
      const isAdmin = user.email ? ADMIN_EMAILS.includes(user.email) : false;
      const currentPoints = pointBalance?.points || 0;
      const audioCost = PRODUCT_COSTS.voice; // 300 포인트

      // 관리자가 아니고, 프리미엄 분석도 아니고, 포인트도 부족한 경우
      if (!isAdmin && !isAnalysisPremium && currentPoints < audioCost) {
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

      // 관리자가 아니고 프리미엄 분석도 아닌 경우 포인트 차감
      if (!isAdmin && !isAnalysisPremium) {
        const deductResult = await deductPoints(user.id, 'voice');
        if (!deductResult.success) {
          return NextResponse.json(
            { error: '포인트 차감에 실패했습니다.' },
            { status: 500 }
          );
        }
      }

      // Edge TTS를 기본 사용 (무료, API 키 불필요)
      // OpenAI를 사용하려면 환경변수에 OPENAI_API_KEY 설정
      const ttsProvider = process.env.TTS_PROVIDER || 'edge';
      const openaiKey = process.env.OPENAI_API_KEY;

      const config = ttsProvider === 'openai' && openaiKey
        ? {
            provider: 'openai' as const,
            apiKey: openaiKey,
            voiceId: 'nova'
          }
        : {
            provider: 'edge' as const,
            voiceId: 'ko-KR-SunHiNeural' // 한국어 여성, 따뜻한 음성
          };

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
          'Content-Length': audioBuffer.length.toString()
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

    // 음성 생성은 관리자 무료, 일반 사용자는 포인트 차감
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
      const currentPoints = pointBalance?.points || 0;
      const audioCost = PRODUCT_COSTS.voice; // 300 포인트

      // 관리자가 아니고 포인트도 부족한 경우
      if (!isAdmin && currentPoints < audioCost) {
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

      // 관리자가 아닌 경우 포인트 차감
      if (!isAdmin) {
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
      // Edge TTS를 기본 사용 (무료, API 키 불필요)
      const ttsProvider = process.env.TTS_PROVIDER || 'edge';
      const openaiKey = process.env.OPENAI_API_KEY;
      const requestedVoice = (body as Record<string, unknown>).voiceId as string;

      const config = ttsProvider === 'openai' && openaiKey
        ? {
            provider: 'openai' as const,
            apiKey: openaiKey,
            voiceId: requestedVoice || 'nova'
          }
        : {
            provider: 'edge' as const,
            voiceId: requestedVoice || 'ko-KR-SunHiNeural' // 한국어 여성, 따뜻한 음성
          };

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
          'Content-Length': audioBuffer.length.toString()
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
