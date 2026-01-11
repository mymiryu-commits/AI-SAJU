import { NextRequest, NextResponse } from 'next/server';
import {
  generateLottoNumbers,
  loadLottoHistory,
  analyzePatterns,
  optimizeMultiGame,
} from '@/lib/lotto';
import type { FilterConfig } from '@/types/lotto';
import { DEFAULT_FILTER_CONFIG } from '@/types/lotto';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    const {
      count = 5,
      config = DEFAULT_FILTER_CONFIG,
      usePattern = true,
      premium = false,
      optimize = false,
    } = body as {
      count?: number;
      config?: FilterConfig;
      usePattern?: boolean;
      premium?: boolean;
      optimize?: boolean;
    };

    // 유효성 검사
    if (count < 1 || count > 50) {
      return NextResponse.json(
        { error: '게임 수는 1-50 사이여야 합니다.' },
        { status: 400 }
      );
    }

    // 역대 데이터 로드
    const previousResults = loadLottoHistory();

    // 최적화 모드
    if (optimize && (count === 5 || count === 10 || count === 20)) {
      const optimized = optimizeMultiGame(
        config,
        previousResults,
        count as 5 | 10 | 20,
        { usePattern, strategy: 'balanced' }
      );

      return NextResponse.json({
        success: true,
        games: optimized.games,
        stats: {
          coverage: optimized.coverage,
          overlapRate: optimized.overlapRate,
          diversityScore: optimized.diversityScore,
        },
      });
    }

    // 일반 생성
    const result = generateLottoNumbers({
      count,
      config,
      previousResults,
      usePattern,
      premium,
      sortByQuality: true,
    });

    // 분석 정보 포함
    let analysisInfo = null;
    if (usePattern && previousResults.length > 0) {
      const analysis = analyzePatterns(previousResults, 10);
      analysisInfo = {
        hotNumbers: analysis.hotNumbers,
        coldNumbers: analysis.coldNumbers,
        consecutiveRate: analysis.consecutiveRate,
      };
    }

    return NextResponse.json({
      success: true,
      games: result.games,
      quality: result.quality,
      analysis: analysisInfo,
    });
  } catch (error) {
    console.error('Generate API Error:', error);
    return NextResponse.json(
      { error: '번호 생성 중 오류가 발생했습니다.' },
      { status: 500 }
    );
  }
}
