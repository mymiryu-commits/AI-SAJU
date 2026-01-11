import { NextRequest, NextResponse } from 'next/server';
import { loadLottoHistory, analyzePatterns, generateStatsSummary } from '@/lib/lotto';

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const limit = parseInt(searchParams.get('limit') || '50');
    const includeAnalysis = searchParams.get('analysis') === 'true';

    // 역대 데이터 로드
    const allResults = loadLottoHistory();
    const results = allResults.slice(0, limit);

    let response: Record<string, unknown> = {
      success: true,
      count: results.length,
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
