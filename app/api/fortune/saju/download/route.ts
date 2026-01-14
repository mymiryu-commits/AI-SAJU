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
import { createClient } from '@/utils/supabase/server';
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
import type { UserInput, SajuChart, OhengBalance, AnalysisResult, PremiumContent } from '@/types/saju';

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
    const { data: analysis, error: fetchError } = await supabase
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

    // 프리미엄 분석 결과 조회 (있는 경우)
    const { data: premiumAnalysis } = await supabase
      .from('premium_analyses')
      .select('*')
      .eq('analysis_id', analysisId)
      .single();

    // 사용자 정보 조회
    const { data: userData } = await supabase
      .from('users')
      .select('*')
      .eq('id', user.id)
      .single();

    // 데이터 준비
    const userInput: UserInput = {
      name: userData?.name || '사용자',
      birthDate: analysis.birth_date,
      birthTime: analysis.birth_time,
      gender: analysis.gender || 'male',
      careerType: userData?.career_type,
      careerLevel: userData?.career_level,
      yearsExp: userData?.years_exp,
      maritalStatus: userData?.marital_status,
      hasChildren: userData?.has_children,
      childrenAges: userData?.children_ages,
      interests: userData?.interests,
      currentConcern: userData?.current_concern
    };

    const saju = analysis.result?.saju || calculateSaju(userInput.birthDate, userInput.birthTime);
    const oheng = analysis.result?.oheng || analyzeOheng(saju);
    const result: AnalysisResult = analysis.result || {};

    const premium: PremiumContent | undefined = premiumAnalysis ? {
      familyImpact: premiumAnalysis.family_impact,
      careerAnalysis: premiumAnalysis.career_analysis,
      interestStrategies: premiumAnalysis.interest_strategies,
      monthlyActionPlan: premiumAnalysis.monthly_action_plan,
      lifeTimeline: premiumAnalysis.life_timeline,
      timingAnalysis: premiumAnalysis.timing_analysis
    } : undefined;

    const targetYear = premiumAnalysis?.target_year || new Date().getFullYear();

    if (type === 'pdf') {
      // PDF 생성
      const pdfBuffer = await generateSajuPDF({
        user: userInput,
        saju,
        oheng,
        result,
        premium,
        targetYear
      });

      const filename = generatePDFFilename(userInput, targetYear);

      // PDF URL 업데이트 (Storage에 저장하는 경우)
      // await uploadToStorage(pdfBuffer, filename, 'pdf');

      return new NextResponse(pdfBuffer, {
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
        result,
        premium,
        targetYear,
        config: {
          provider: 'openai',
          apiKey: openaiKey,
          voiceId: 'nova'
        }
      });

      const filename = generateAudioFilename(userInput, targetYear);

      return new NextResponse(audioBuffer, {
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
    const { type, user: userInput, saju, oheng, result, premium, targetYear = 2026 } = body;

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
        result: result || {},
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
        result: result || {},
        premium,
        targetYear
      });

      const filename = generatePDFFilename(userInput, targetYear);

      return new NextResponse(pdfBuffer, {
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
        result: result || {},
        premium,
        targetYear,
        config: {
          provider: 'openai',
          apiKey: openaiKey,
          voiceId: body.voiceId || 'nova'
        }
      });

      const filename = generateAudioFilename(userInput, targetYear);

      return new NextResponse(audioBuffer, {
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
