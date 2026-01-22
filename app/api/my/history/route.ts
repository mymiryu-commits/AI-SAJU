/**
 * 운세 히스토리 API
 *
 * GET /api/my/history - 사용자의 운세 분석 히스토리 조회
 * DELETE /api/my/history?id=xxx - 특정 분석 결과 삭제
 * PATCH /api/my/history - 저장 상태 토글 (즐겨찾기)
 */

import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';

export async function GET(request: NextRequest) {
  try {
    const supabase = await createClient();

    // 사용자 인증 확인
    const { data: { user }, error: authError } = await supabase.auth.getUser();
    if (authError || !user) {
      return NextResponse.json(
        { error: '로그인이 필요합니다.' },
        { status: 401 }
      );
    }

    const { searchParams } = new URL(request.url);
    const type = searchParams.get('type'); // 'all', 'saju', 'daily', 'compatibility', etc.
    const saved = searchParams.get('saved'); // 'true' for saved only
    const limit = parseInt(searchParams.get('limit') || '50');
    const offset = parseInt(searchParams.get('offset') || '0');

    // 운세 분석 히스토리 조회
    let analyses: any[] = [];
    try {
      let query = (supabase as any)
        .from('fortune_analyses')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false })
        .range(offset, offset + limit - 1);

      // 타입 필터
      if (type && type !== 'all') {
        query = query.eq('type', type);
      }

      const { data, error: fetchError } = await query;

      if (fetchError) {
        console.error('History fetch error:', fetchError);
        // 테이블이 없어도 빈 배열 반환
      } else {
        analyses = data || [];
      }
    } catch (e) {
      console.error('History query error:', e);
      // 에러 시 빈 배열 반환
    }

    // 데이터 변환
    const historyItems = (analyses || []).map((analysis: any) => {
      const resultSummary = analysis.result_summary || {};
      const resultFull = analysis.result_full || {};
      const inputData = analysis.input_data || {};
      const scores = analysis.scores || {};

      // 45일 다운로드 제한 체크
      const createdAt = new Date(analysis.created_at);
      const downloadExpiresAt = new Date(createdAt);
      downloadExpiresAt.setDate(downloadExpiresAt.getDate() + 45);
      const canDownload = new Date() <= downloadExpiresAt;
      const daysUntilExpire = Math.max(0, Math.ceil((downloadExpiresAt.getTime() - Date.now()) / (1000 * 60 * 60 * 24)));

      return {
        id: analysis.id,
        type: analysis.type,
        subtype: analysis.subtype,
        title: getTypeTitle(analysis.type),
        subtitle: getSubtitle(analysis, inputData, resultFull),
        date: analysis.created_at,
        isPremium: analysis.price_paid > 0,
        result: {
          summary: resultSummary.summary || resultFull.summary || '',
          score: scores.overall || resultSummary.score || 0,
        },
        saved: resultSummary.saved || false,
        hasPdf: !!analysis.pdf_url,
        hasAudio: !!analysis.audio_url,
        pdfUrl: canDownload ? analysis.pdf_url : null,
        audioUrl: canDownload ? analysis.audio_url : null,
        shareImageUrl: analysis.share_image_url,
        canDownload,
        daysUntilExpire,
        downloadExpiresAt: downloadExpiresAt.toISOString(),
      };
    });

    // 저장된 항목 필터링 (클라이언트 측에서도 가능하지만 서버에서 처리)
    const filteredItems = saved === 'true'
      ? historyItems.filter((item: any) => item.saved)
      : historyItems;

    // 통계 계산
    const stats = {
      totalAnalyses: analyses?.length || 0,
      savedCount: historyItems.filter((item: any) => item.saved).length,
      premiumCount: historyItems.filter((item: any) => item.isPremium).length,
      averageScore: calculateAverageScore(historyItems),
    };

    return NextResponse.json({
      success: true,
      items: filteredItems,
      stats,
      pagination: {
        limit,
        offset,
        hasMore: (analyses?.length || 0) === limit,
      },
    });
  } catch (error) {
    console.error('History API error:', error);
    return NextResponse.json(
      { error: '서버 오류가 발생했습니다.' },
      { status: 500 }
    );
  }
}

// 저장 상태 토글 (즐겨찾기)
export async function PATCH(request: NextRequest) {
  try {
    const supabase = await createClient();

    const { data: { user }, error: authError } = await supabase.auth.getUser();
    if (authError || !user) {
      return NextResponse.json(
        { error: '로그인이 필요합니다.' },
        { status: 401 }
      );
    }

    const body = await request.json();
    const { id, saved } = body;

    if (!id) {
      return NextResponse.json(
        { error: '분석 ID가 필요합니다.' },
        { status: 400 }
      );
    }

    // 현재 데이터 조회
    const { data: current, error: fetchError } = await (supabase as any)
      .from('fortune_analyses')
      .select('result_summary')
      .eq('id', id)
      .eq('user_id', user.id)
      .single();

    if (fetchError || !current) {
      return NextResponse.json(
        { error: '분석 결과를 찾을 수 없습니다.' },
        { status: 404 }
      );
    }

    // result_summary 업데이트
    const newSummary = {
      ...((current as any).result_summary || {}),
      saved: saved !== undefined ? saved : !((current as any).result_summary?.saved || false),
    };

    const { error: updateError } = await (supabase as any)
      .from('fortune_analyses')
      .update({ result_summary: newSummary })
      .eq('id', id)
      .eq('user_id', user.id);

    if (updateError) {
      console.error('Update error:', updateError);
      return NextResponse.json(
        { error: '저장 상태 변경 중 오류가 발생했습니다.' },
        { status: 500 }
      );
    }

    return NextResponse.json({
      success: true,
      saved: newSummary.saved,
    });
  } catch (error) {
    console.error('PATCH history error:', error);
    return NextResponse.json(
      { error: '서버 오류가 발생했습니다.' },
      { status: 500 }
    );
  }
}

// 분석 결과 삭제
export async function DELETE(request: NextRequest) {
  try {
    const supabase = await createClient();

    const { data: { user }, error: authError } = await supabase.auth.getUser();
    if (authError || !user) {
      return NextResponse.json(
        { error: '로그인이 필요합니다.' },
        { status: 401 }
      );
    }

    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');

    if (!id) {
      return NextResponse.json(
        { error: '분석 ID가 필요합니다.' },
        { status: 400 }
      );
    }

    const { error: deleteError } = await (supabase as any)
      .from('fortune_analyses')
      .delete()
      .eq('id', id)
      .eq('user_id', user.id);

    if (deleteError) {
      console.error('Delete error:', deleteError);
      return NextResponse.json(
        { error: '삭제 중 오류가 발생했습니다.' },
        { status: 500 }
      );
    }

    return NextResponse.json({
      success: true,
      message: '분석 결과가 삭제되었습니다.',
    });
  } catch (error) {
    console.error('DELETE history error:', error);
    return NextResponse.json(
      { error: '서버 오류가 발생했습니다.' },
      { status: 500 }
    );
  }
}

// Helper functions
function getTypeTitle(type: string): string {
  const titles: Record<string, string> = {
    saju: '사주 분석',
    daily: '오늘의 운세',
    compatibility: '궁합 분석',
    tarot: '타로 상담',
    integrated: '통합 분석',
    face: '관상 분석',
    group: '그룹 분석',
    yearly: '연간 운세',
    monthly: '월간 운세',
  };
  return titles[type] || '운세 분석';
}

function getSubtitle(analysis: any, inputData: any, resultFull: any): string {
  const type = analysis.type;
  const date = new Date(analysis.created_at);
  const year = date.getFullYear();

  switch (type) {
    case 'saju':
      return `${year}년 종합 운세`;
    case 'daily':
      return date.toLocaleDateString('ko-KR', { year: 'numeric', month: 'long', day: 'numeric' });
    case 'compatibility':
      const names = inputData.names || [];
      return names.length >= 2 ? `${names[0]} ♥ ${names[1]}` : '궁합 분석';
    case 'yearly':
      return `${resultFull.targetYear || year}년 운세`;
    case 'monthly':
      return `${resultFull.targetMonth || (date.getMonth() + 1)}월 운세`;
    default:
      return analysis.subtype || '';
  }
}

function calculateAverageScore(items: any[]): number {
  const scoredItems = items.filter(item => item.result.score > 0);
  if (scoredItems.length === 0) return 0;
  const total = scoredItems.reduce((acc, item) => acc + item.result.score, 0);
  return Math.round(total / scoredItems.length);
}
