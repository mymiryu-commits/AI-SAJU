import { NextRequest, NextResponse } from 'next/server';
import { createClient, createServiceClient } from '@/lib/supabase/server';
import { calculateSaju } from '@/lib/fortune/saju';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { name, birthDate, birthTime, gender, calendar } = body;

    // Validate input
    if (!name || !birthDate || !gender) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }

    // Calculate Saju
    const result = calculateSaju({
      birthDate: new Date(birthDate),
      birthTime: birthTime || null,
      gender,
      isLunar: calendar === 'lunar',
    });

    // Get user if authenticated
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();

    // Save to database if user is authenticated
    if (user) {
      // Service client를 사용하여 RLS 우회 (인증 확인 완료 후)
      const serviceClient = createServiceClient();

      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const { data: insertData, error: insertError } = await (serviceClient as any).from('fortune_analyses').insert({
        user_id: user.id,
        type: 'saju',
        subtype: 'basic',
        input_data: { name, birthDate, birthTime, gender, calendar },
        result_summary: result.summary,
        result_full: result,
        keywords: result.keywords,
        scores: result.scores,
      }).select('id').single();

      if (insertError) {
        console.error('[Saju] Failed to save analysis:', insertError);
        console.error('[Saju] User ID:', user.id);
        console.error('[Saju] Error code:', insertError.code);
        console.error('[Saju] Error message:', insertError.message);
        console.error('[Saju] Error details:', insertError.details);
      } else {
        console.log('[Saju] Analysis saved successfully for user:', user.id, 'ID:', insertData?.id);
      }
    }

    return NextResponse.json({
      success: true,
      result,
    });
  } catch (error) {
    console.error('Saju analysis error:', error);
    return NextResponse.json(
      { error: 'Analysis failed' },
      { status: 500 }
    );
  }
}
