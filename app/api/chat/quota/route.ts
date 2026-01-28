/**
 * 채팅 사용량 조회 API
 */

import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import { getUserQuota } from '@/lib/services/chatService';

export async function GET(request: NextRequest) {
  try {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
      return NextResponse.json(
        { error: '로그인이 필요합니다.' },
        { status: 401 }
      );
    }

    const quota = await getUserQuota(user.id);

    return NextResponse.json(quota);
  } catch (error) {
    console.error('Quota API error:', error);

    return NextResponse.json(
      { error: '사용량 조회에 실패했습니다.' },
      { status: 500 }
    );
  }
}
