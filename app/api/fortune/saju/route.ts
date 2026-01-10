import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';
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
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      await (supabase as any).from('fortune_analyses').insert({
        user_id: user.id,
        type: 'saju',
        subtype: 'basic',
        input_data: { name, birthDate, birthTime, gender, calendar },
        result_summary: result.summary,
        result_full: result,
        keywords: result.keywords,
        scores: result.scores,
      });
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
