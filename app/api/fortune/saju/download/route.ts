/**
 * 사주 분석 결과 다운로드 API
 *
 * PDF 문서 및 음성 파일 다운로드 기능
 *
 * GET /api/fortune/saju/download?type=pdf&analysisId=xxx
 * GET /api/fortune/saju/download?type=audio&analysisId=xxx
 * POST /api/fortune/saju/download (실시간 생성)
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
import type { UserInput, SajuChart, OhengBalance, PremiumContent, Element } from '@/types/saju';

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

    if (type === 'pdf') {
      // PDF 생성
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
      // 음성 생성
      const openaiKey = process.env.OPENAI_API_KEY;
      if (!openaiKey) {
        return NextResponse.json(
          { error: '음성 생성 서비스가 설정되지 않았습니다.' },
          { status: 503 }
        );
      }

      const audioBuffer = await generateSajuAudio({
        user: userInput,
        saju,
        oheng,
        yongsin,
        gisin,
        premium,
        targetYear,
        config: {
          provider: 'openai',
          apiKey: openaiKey,
          voiceId: 'nova'
        }
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
      const openaiKey = process.env.OPENAI_API_KEY;
      if (!openaiKey) {
        return NextResponse.json(
          { error: '음성 생성 서비스가 설정되지 않았습니다. 관리자에게 문의하세요.' },
          { status: 503 }
        );
      }

      const audioBuffer = await generateSajuAudio({
        user: userInput,
        saju,
        oheng,
        yongsin,
        gisin,
        premium,
        targetYear,
        config: {
          provider: 'openai',
          apiKey: openaiKey,
          voiceId: (body as Record<string, unknown>).voiceId as string || 'nova'
        }
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
