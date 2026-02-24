/**
 * AI 사주 상담 챗봇 API
 */

import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import { processChat } from '@/lib/services/chatService';
import type { ChatRequest } from '@/types/chat';

export async function POST(request: NextRequest) {
  try {
    // 인증 확인
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
      return NextResponse.json(
        { error: '로그인이 필요합니다.' },
        { status: 401 }
      );
    }

    // 요청 파싱
    const body: ChatRequest = await request.json();

    if (!body.scenario || !body.message) {
      return NextResponse.json(
        { error: '시나리오와 메시지는 필수입니다.' },
        { status: 400 }
      );
    }

    // 메시지 길이 제한
    if (body.message.length > 1000) {
      return NextResponse.json(
        { error: '메시지는 1000자 이내로 작성해주세요.' },
        { status: 400 }
      );
    }

    // 사주 데이터가 없으면 프로필에서 가져오기
    let sajuData = body.sajuData;

    if (!sajuData) {
      const { data: profile } = await supabase
        .from('profiles')
        .select('birth_date, mbti, blood_type')
        .eq('id', user.id)
        .single() as { data: { birth_date?: string; mbti?: string; blood_type?: string } | null };

      if (profile?.birth_date) {
        // 저장된 사주 분석 결과 조회
        const { data: sajuResult } = await supabase
          .from('saju_results')
          .select('saju_chart, yongsin, oheng')
          .eq('user_id', user.id)
          .order('created_at', { ascending: false })
          .limit(1)
          .single() as { data: { saju_chart?: any; yongsin?: string[]; oheng?: any } | null };

        if (sajuResult) {
          sajuData = {
            dayMaster: sajuResult.saju_chart?.day?.heavenlyStem || '미상',
            fourPillars: sajuResult.saju_chart,
            yongsin: sajuResult.yongsin || [],
            oheng: sajuResult.oheng || {},
            mbti: profile.mbti,
            bloodType: profile.blood_type,
            birthDate: profile.birth_date
          };
        }
      }
    }

    // 챗봇 응답 생성
    const result = await processChat({
      userId: user.id,
      sessionId: body.sessionId,
      scenario: body.scenario,
      message: body.message,
      sajuData
    });

    return NextResponse.json(result);
  } catch (error) {
    console.error('Chat API error:', error);

    const message = error instanceof Error ? error.message : '응답 생성에 실패했습니다.';

    // 한도 초과 에러는 403
    if (message.includes('한도')) {
      return NextResponse.json({ error: message }, { status: 403 });
    }

    return NextResponse.json(
      { error: message },
      { status: 500 }
    );
  }
}
