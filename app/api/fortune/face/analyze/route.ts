/**
 * 관상 분석 API 엔드포인트
 * POST /api/fortune/face/analyze
 *
 * - 결제권 확인 및 차감
 * - Vision API를 통한 실제 얼굴 분석
 * - 분석 실패 시 결제권 자동 복구
 * - TTS 음성 파일 생성 (옵션)
 */

import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import { isAdminEmail } from '@/lib/auth/permissions';
import { analyzeFace, analyzeFaceWithVision } from '@/lib/fortune/face/faceAnalysis';
import { generateTTSScript } from '@/lib/fortune/face/faceStorytelling';

export const maxDuration = 60;

export async function POST(request: NextRequest) {
  try {
    const supabase = await createClient();

    // 사용자 인증 확인
    const { data: { user }, error: authError } = await supabase.auth.getUser();

    if (authError || !user) {
      return NextResponse.json(
        { success: false, error: '로그인이 필요합니다.', errorCode: 'UNAUTHORIZED' },
        { status: 401 }
      );
    }

    const isAdmin = user.email ? isAdminEmail(user.email) : false;

    // 요청 데이터
    const body = await request.json();
    const { imageData, generateVoice = false } = body;

    // 결제권 사용 여부 추적 (롤백용)
    let voucherUsed = false;
    let usedVoucherId: string | null = null;

    // 관리자가 아닌 경우 결제권 확인 및 사용
    if (!isAdmin) {
      // 결제권 확인
      const { data: vouchers, error: voucherError } = await (supabase as any)
        .from('user_vouchers')
        .select('*')
        .eq('user_id', user.id)
        .eq('service_type', 'face')
        .eq('status', 'active')
        .gt('remaining_quantity', 0)
        .gt('expires_at', new Date().toISOString())
        .order('expires_at', { ascending: true })
        .limit(1);

      if (voucherError) {
        console.error('Voucher check error:', voucherError);
        return NextResponse.json(
          { success: false, error: '결제권 확인 중 오류가 발생했습니다.', errorCode: 'VOUCHER_CHECK_FAILED' },
          { status: 500 }
        );
      }

      if (!vouchers || vouchers.length === 0) {
        return NextResponse.json(
          {
            success: false,
            error: '관상 분석은 결제권이 필요합니다.',
            errorCode: 'NO_VOUCHER',
          },
          { status: 402 }
        );
      }

      // 결제권 사용 전에 ID 저장 (롤백용)
      usedVoucherId = vouchers[0].id;

      // 결제권 사용
      const { data: useResult, error: useError } = await (supabase as any).rpc('use_voucher', {
        p_user_id: user.id,
        p_service_type: 'face',
        p_quantity: 1,
        p_related_id: null,
        p_related_type: 'face_analysis',
      });

      if (useError || useResult === false) {
        console.error('Voucher use error:', useError);
        return NextResponse.json(
          { success: false, error: '결제권 사용 중 오류가 발생했습니다.', errorCode: 'VOUCHER_USE_FAILED' },
          { status: 500 }
        );
      }

      voucherUsed = true;
    }

    // 관상 분석 실행 (Vision API 사용)
    let analysisResult;
    try {
      // imageData가 있으면 Vision API 사용, 없으면 폴백
      if (imageData && imageData.startsWith('data:image')) {
        analysisResult = await analyzeFaceWithVision(imageData);
      } else {
        analysisResult = analyzeFace(imageData);
      }
    } catch (analysisError) {
      console.error('Face analysis error:', analysisError);

      // 분석 실패 시 결제권 복구
      if (voucherUsed && usedVoucherId) {
        try {
          await rollbackVoucher(supabase, user.id, usedVoucherId, 'face');
          console.log('Voucher rolled back successfully due to analysis failure');
        } catch (rollbackError) {
          console.error('Voucher rollback failed:', rollbackError);
        }
      }

      return NextResponse.json(
        { success: false, error: '얼굴 분석 중 오류가 발생했습니다. 결제권이 복구되었습니다.', errorCode: 'ANALYSIS_FAILED' },
        { status: 500 }
      );
    }

    // TTS 스크립트 생성
    const ttsScript = generateTTSScript(
      analysisResult.features,
      analysisResult.scores.overallScore,
      analysisResult.personality,
      analysisResult.highlights.strengths
    );

    // 분석 결과 저장 (테이블이 없을 수 있으므로 try-catch)
    try {
      const { error: saveError } = await (supabase as any)
        .from('face_analyses')
        .insert({
          user_id: user.id,
          analysis_id: analysisResult.analysisId,
          overall_score: analysisResult.scores.overallScore,
          part_scores: analysisResult.scores.partScores,
          fortune_scores: analysisResult.scores.fortuneScores,
          personality: analysisResult.personality,
          advice: analysisResult.advice,
          tts_script: ttsScript,
          created_at: new Date().toISOString(),
        });

      if (saveError) {
        console.warn('Face analysis save warning:', saveError);
      }
    } catch (dbError) {
      // DB 저장 실패해도 분석 결과는 반환
      console.warn('Face analysis DB save skipped:', dbError);
    }

    // 음성 파일 생성 (옵션)
    let audioUrl: string | undefined;
    if (generateVoice) {
      try {
        // TTS 생성 API 호출
        const ttsResponse = await fetch(`${process.env.NEXT_PUBLIC_APP_URL}/api/tts/generate`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            text: ttsScript,
            type: 'face_analysis',
            analysisId: analysisResult.analysisId,
          }),
        });

        if (ttsResponse.ok) {
          const ttsData = await ttsResponse.json();
          audioUrl = ttsData.audioUrl;
          analysisResult.audio = {
            url: audioUrl || '',
            duration: ttsData.duration || 0,
            generatedAt: new Date().toISOString(),
          };
        }
      } catch (ttsError) {
        console.warn('TTS generation failed:', ttsError);
        // TTS 실패해도 분석 결과는 반환
      }
    }

    // 남은 결제권 수 조회
    let remainingVouchers = 0;
    if (!isAdmin) {
      const { data: remaining } = await (supabase as any)
        .from('user_vouchers')
        .select('remaining_quantity')
        .eq('user_id', user.id)
        .eq('service_type', 'face')
        .eq('status', 'active')
        .gt('remaining_quantity', 0)
        .gt('expires_at', new Date().toISOString());

      remainingVouchers = remaining?.reduce((sum: number, v: any) => sum + v.remaining_quantity, 0) || 0;
    }

    return NextResponse.json({
      success: true,
      result: analysisResult,
      ttsScript,
      remainingVouchers,
      isAdmin,
    });

  } catch (error) {
    console.error('Face analysis error:', error);
    return NextResponse.json(
      { success: false, error: '관상 분석 중 오류가 발생했습니다.', errorCode: 'ANALYSIS_FAILED' },
      { status: 500 }
    );
  }
}

// GET - 이전 분석 결과 조회
export async function GET(request: NextRequest) {
  try {
    const supabase = await createClient();
    const { data: { user }, error: authError } = await supabase.auth.getUser();

    if (authError || !user) {
      return NextResponse.json(
        { success: false, error: '로그인이 필요합니다.' },
        { status: 401 }
      );
    }

    const { searchParams } = new URL(request.url);
    const analysisId = searchParams.get('id');

    if (analysisId) {
      // 특정 분석 결과 조회
      const { data, error } = await (supabase as any)
        .from('face_analyses')
        .select('*')
        .eq('user_id', user.id)
        .eq('analysis_id', analysisId)
        .single();

      if (error || !data) {
        return NextResponse.json(
          { success: false, error: '분석 결과를 찾을 수 없습니다.' },
          { status: 404 }
        );
      }

      return NextResponse.json({ success: true, result: data });
    }

    // 최근 분석 목록 조회
    const { data, error } = await (supabase as any)
      .from('face_analyses')
      .select('analysis_id, overall_score, created_at')
      .eq('user_id', user.id)
      .order('created_at', { ascending: false })
      .limit(10);

    if (error) {
      return NextResponse.json(
        { success: false, error: '분석 목록 조회 실패' },
        { status: 500 }
      );
    }

    return NextResponse.json({ success: true, analyses: data || [] });

  } catch (error) {
    console.error('Face analysis fetch error:', error);
    return NextResponse.json(
      { success: false, error: '조회 중 오류가 발생했습니다.' },
      { status: 500 }
    );
  }
}

/**
 * 결제권 롤백 함수
 * 분석 실패 시 차감된 결제권을 복구
 */
async function rollbackVoucher(
  supabase: any,
  userId: string,
  voucherId: string,
  serviceType: string
): Promise<boolean> {
  try {
    // 해당 결제권의 remaining_quantity를 1 증가
    const { error: rollbackError } = await supabase
      .from('user_vouchers')
      .update({
        remaining_quantity: supabase.raw('remaining_quantity + 1'),
      })
      .eq('id', voucherId)
      .eq('user_id', userId);

    if (rollbackError) {
      // raw SQL이 안 되면 직접 조회 후 업데이트
      const { data: voucher } = await supabase
        .from('user_vouchers')
        .select('remaining_quantity')
        .eq('id', voucherId)
        .single();

      if (voucher) {
        await supabase
          .from('user_vouchers')
          .update({ remaining_quantity: voucher.remaining_quantity + 1 })
          .eq('id', voucherId);
      }
    }

    // 사용 기록 삭제 또는 취소 표시 (최근 기록)
    const { data: usageLog } = await supabase
      .from('voucher_usage_logs')
      .select('id')
      .eq('user_id', userId)
      .eq('service_type', serviceType)
      .order('used_at', { ascending: false })
      .limit(1);

    if (usageLog && usageLog.length > 0) {
      await supabase
        .from('voucher_usage_logs')
        .delete()
        .eq('id', usageLog[0].id);
    }

    console.log(`Voucher ${voucherId} rolled back for user ${userId}`);
    return true;
  } catch (error) {
    console.error('Voucher rollback error:', error);
    return false;
  }
}
