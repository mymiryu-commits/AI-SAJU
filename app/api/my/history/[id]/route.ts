/**
 * 개별 분석 결과 조회 API
 *
 * GET /api/my/history/[id] - 저장된 분석 결과 상세 조회 (무료)
 *
 * 이미 결제한 분석 결과를 다시 볼 때는 포인트 차감 없음
 */

import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id: analysisId } = await params;

    if (!analysisId) {
      return NextResponse.json(
        { error: '분석 ID가 필요합니다.' },
        { status: 400 }
      );
    }

    const supabase = await createClient();

    // 사용자 인증 확인
    const { data: { user }, error: authError } = await supabase.auth.getUser();
    if (authError || !user) {
      return NextResponse.json(
        { error: '로그인이 필요합니다.' },
        { status: 401 }
      );
    }

    // 분석 결과 조회 (본인 것만)
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

    // 30일 보관 기간 체크
    const expiresAt = analysis.expires_at
      ? new Date(analysis.expires_at)
      : new Date(new Date(analysis.created_at).getTime() + 30 * 24 * 60 * 60 * 1000);
    const isExpired = new Date() > expiresAt;
    const daysRemaining = Math.max(0, Math.ceil((expiresAt.getTime() - Date.now()) / (1000 * 60 * 60 * 24)));

    // 블라인드 처리 여부 확인
    // 이미 결제한 분석 (is_premium: true) 또는 포인트로 결제한 분석은 블라인드 해제
    const isBlinded = analysis.is_blinded && !analysis.is_premium;

    return NextResponse.json({
      success: true,
      data: {
        id: analysis.id,
        type: analysis.type,
        subtype: analysis.subtype,
        createdAt: analysis.created_at,
        expiresAt: expiresAt.toISOString(),
        daysRemaining,
        isExpired,
        isPremium: analysis.is_premium,
        isBlinded,
        // 사용자 입력 데이터
        inputData: analysis.input_data,
        // 요약 데이터
        summary: analysis.result_summary,
        // 전체 결과 (블라인드 여부에 따라)
        fullResult: isBlinded ? null : analysis.result_full,
        // 점수
        scores: analysis.scores,
        // 키워드
        keywords: analysis.keywords,
        // 파일 URLs (만료 전에만)
        pdfUrl: !isExpired ? analysis.pdf_url : null,
        audioUrl: !isExpired ? analysis.audio_url : null,
        shareImageUrl: analysis.share_image_url,
      },
    });
  } catch (error) {
    console.error('History detail API error:', error);
    return NextResponse.json(
      { error: '서버 오류가 발생했습니다.' },
      { status: 500 }
    );
  }
}
