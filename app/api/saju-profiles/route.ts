import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

// 사주 프로필 타입
interface SajuProfile {
  id?: string;
  user_id: string;
  name: string;
  birth_date: string;
  birth_time?: string;
  gender: string;
  calendar?: string;
  blood_type?: string;
  mbti?: string;
  career_type?: string;
  career_level?: string;
  years_exp?: number;
  marital_status?: string;
  has_children?: boolean;
  children_ages?: number[];
  interests?: string[];
  current_concern?: string;
  relation_type?: string;
  nickname?: string;
  display_order?: number;
  is_favorite?: boolean;
}

// GET: 사용자의 사주 프로필 목록 조회
export async function GET(request: NextRequest) {
  try {
    const userId = request.headers.get('x-user-id');

    if (!userId) {
      return NextResponse.json(
        { error: '인증이 필요합니다.' },
        { status: 401 }
      );
    }

    const { data, error } = await supabase
      .from('saju_profiles')
      .select('*')
      .eq('user_id', userId)
      .order('is_favorite', { ascending: false })
      .order('display_order', { ascending: true })
      .order('created_at', { ascending: false });

    if (error) {
      console.error('프로필 조회 오류:', error);
      return NextResponse.json(
        { error: '프로필 조회에 실패했습니다.' },
        { status: 500 }
      );
    }

    return NextResponse.json({ profiles: data });
  } catch (error) {
    console.error('프로필 조회 오류:', error);
    return NextResponse.json(
      { error: '서버 오류가 발생했습니다.' },
      { status: 500 }
    );
  }
}

// POST: 새 사주 프로필 저장
export async function POST(request: NextRequest) {
  try {
    const userId = request.headers.get('x-user-id');

    if (!userId) {
      return NextResponse.json(
        { error: '인증이 필요합니다.' },
        { status: 401 }
      );
    }

    const body = await request.json();
    const { profile } = body as { profile: Omit<SajuProfile, 'user_id'> };

    if (!profile.name || !profile.birth_date || !profile.gender) {
      return NextResponse.json(
        { error: '필수 정보가 누락되었습니다.' },
        { status: 400 }
      );
    }

    // 현재 프로필 개수 확인 (최대 20개 제한)
    const { count } = await supabase
      .from('saju_profiles')
      .select('*', { count: 'exact', head: true })
      .eq('user_id', userId);

    if (count && count >= 20) {
      return NextResponse.json(
        { error: '최대 20개의 프로필만 저장할 수 있습니다.' },
        { status: 400 }
      );
    }

    const { data, error } = await supabase
      .from('saju_profiles')
      .insert({
        user_id: userId,
        name: profile.name,
        birth_date: profile.birth_date,
        birth_time: profile.birth_time || null,
        gender: profile.gender,
        calendar: profile.calendar || 'solar',
        blood_type: profile.blood_type || null,
        mbti: profile.mbti || null,
        career_type: profile.career_type || null,
        career_level: profile.career_level || null,
        years_exp: profile.years_exp || null,
        marital_status: profile.marital_status || null,
        has_children: profile.has_children || false,
        children_ages: profile.children_ages || null,
        interests: profile.interests || null,
        current_concern: profile.current_concern || null,
        relation_type: profile.relation_type || 'self',
        nickname: profile.nickname || null,
        display_order: count || 0
      })
      .select()
      .single();

    if (error) {
      console.error('프로필 저장 오류:', error);
      return NextResponse.json(
        { error: '프로필 저장에 실패했습니다.' },
        { status: 500 }
      );
    }

    return NextResponse.json({ profile: data, message: '프로필이 저장되었습니다.' });
  } catch (error) {
    console.error('프로필 저장 오류:', error);
    return NextResponse.json(
      { error: '서버 오류가 발생했습니다.' },
      { status: 500 }
    );
  }
}

// PUT: 프로필 수정
export async function PUT(request: NextRequest) {
  try {
    const userId = request.headers.get('x-user-id');

    if (!userId) {
      return NextResponse.json(
        { error: '인증이 필요합니다.' },
        { status: 401 }
      );
    }

    const body = await request.json();
    const { profileId, updates } = body as { profileId: string; updates: Partial<SajuProfile> };

    if (!profileId) {
      return NextResponse.json(
        { error: '프로필 ID가 필요합니다.' },
        { status: 400 }
      );
    }

    // 소유권 확인
    const { data: existing } = await supabase
      .from('saju_profiles')
      .select('id')
      .eq('id', profileId)
      .eq('user_id', userId)
      .single();

    if (!existing) {
      return NextResponse.json(
        { error: '프로필을 찾을 수 없습니다.' },
        { status: 404 }
      );
    }

    const { data, error } = await supabase
      .from('saju_profiles')
      .update({
        ...updates,
        updated_at: new Date().toISOString()
      })
      .eq('id', profileId)
      .eq('user_id', userId)
      .select()
      .single();

    if (error) {
      console.error('프로필 수정 오류:', error);
      return NextResponse.json(
        { error: '프로필 수정에 실패했습니다.' },
        { status: 500 }
      );
    }

    return NextResponse.json({ profile: data, message: '프로필이 수정되었습니다.' });
  } catch (error) {
    console.error('프로필 수정 오류:', error);
    return NextResponse.json(
      { error: '서버 오류가 발생했습니다.' },
      { status: 500 }
    );
  }
}

// DELETE: 프로필 삭제
export async function DELETE(request: NextRequest) {
  try {
    const userId = request.headers.get('x-user-id');

    if (!userId) {
      return NextResponse.json(
        { error: '인증이 필요합니다.' },
        { status: 401 }
      );
    }

    const { searchParams } = new URL(request.url);
    const profileId = searchParams.get('profileId');

    if (!profileId) {
      return NextResponse.json(
        { error: '프로필 ID가 필요합니다.' },
        { status: 400 }
      );
    }

    const { error } = await supabase
      .from('saju_profiles')
      .delete()
      .eq('id', profileId)
      .eq('user_id', userId);

    if (error) {
      console.error('프로필 삭제 오류:', error);
      return NextResponse.json(
        { error: '프로필 삭제에 실패했습니다.' },
        { status: 500 }
      );
    }

    return NextResponse.json({ message: '프로필이 삭제되었습니다.' });
  } catch (error) {
    console.error('프로필 삭제 오류:', error);
    return NextResponse.json(
      { error: '서버 오류가 발생했습니다.' },
      { status: 500 }
    );
  }
}
