import { NextRequest, NextResponse } from 'next/server';
import { loadLottoHistoryFromDB, loadLottoHistory, analyzePatterns, generateStatsSummary, getLatestCompletedRound } from '@/lib/lotto';

export const dynamic = 'force-dynamic';

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const limit = parseInt(searchParams.get('limit') || '50');
    const includeAnalysis = searchParams.get('analysis') === 'true';

    // Supabase에서 데이터 로드 (실패시 JSON fallback)
    const allResults = await loadLottoHistoryFromDB(undefined, undefined, limit);

    // 현재 완료된 회차 정보 포함
    const latestCompletedRound = getLatestCompletedRound();
    const results = allResults.slice(0, limit);

    let response: Record<string, unknown> = {
      success: true,
      count: results.length,
      latestCompletedRound,
      results,
    };

    // 분석 정보 포함
    if (includeAnalysis && results.length > 0) {
      const analysis = analyzePatterns(allResults, 10);
      const summary = generateStatsSummary(allResults);

      response.analysis = {
        hotNumbers: analysis.hotNumbers,
        coldNumbers: analysis.coldNumbers,
        consecutiveRate: analysis.consecutiveRate,
        summary,
      };
    }

    return NextResponse.json(response);
  } catch (error) {
    console.error('History API Error:', error);
    return NextResponse.json(
      { error: '데이터 조회 중 오류가 발생했습니다.' },
      { status: 500 }
    );
  }
}
