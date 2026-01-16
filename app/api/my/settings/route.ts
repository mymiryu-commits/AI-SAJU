/**
 * 사용자 설정 API
 *
 * GET /api/my/settings - 설정 조회
 * PATCH /api/my/settings - 설정 업데이트
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

    // 사용자 정보 조회
    const { data: userData } = await (supabase as any)
      .from('users')
      .select('*')
      .eq('id', user.id)
      .single();

    // 사용자 설정 조회
    const { data: settingsData } = await (supabase as any)
      .from('user_settings')
      .select('*')
      .eq('user_id', user.id)
      .single();

    // 프로필 정보 구성
    const profile = {
      name: userData?.name || user.user_metadata?.full_name || '',
      email: user.email || userData?.email || '',
      phone: userData?.phone || '',
      birthDate: userData?.birth_date || '',
      birthTime: userData?.birth_time || '',
      gender: userData?.gender || 'male',
      locale: settingsData?.locale || 'ko',
      timezone: settingsData?.timezone || 'Asia/Seoul',
    };

    // 알림 설정 구성
    const notifications = {
      dailyFortunePush: settingsData?.daily_fortune_push ?? true,
      dailyFortuneTime: settingsData?.daily_fortune_time || '07:00',
      marketingEmail: settingsData?.marketing_email ?? true,
      marketingPush: settingsData?.marketing_push ?? false,
    };

    return NextResponse.json({
      success: true,
      profile,
      notifications,
    });
  } catch (error) {
    console.error('Settings fetch error:', error);
    return NextResponse.json(
      { error: '설정을 불러오는데 실패했습니다.' },
      { status: 500 }
    );
  }
}

export async function PATCH(request: NextRequest) {
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

    const body = await request.json();
    const { profile, notifications } = body;

    // 프로필 정보 업데이트
    if (profile) {
      const userUpdate: any = {};
      if (profile.name !== undefined) userUpdate.name = profile.name;
      if (profile.email !== undefined) userUpdate.email = profile.email;
      if (profile.phone !== undefined) userUpdate.phone = profile.phone;
      if (profile.birthDate !== undefined) userUpdate.birth_date = profile.birthDate;
      if (profile.birthTime !== undefined) userUpdate.birth_time = profile.birthTime;
      if (profile.gender !== undefined) userUpdate.gender = profile.gender;

      if (Object.keys(userUpdate).length > 0) {
        const { error: userError } = await (supabase as any)
          .from('users')
          .upsert({
            id: user.id,
            ...userUpdate,
            updated_at: new Date().toISOString(),
          });

        if (userError) {
          console.error('User update error:', userError);
        }
      }

      // locale, timezone은 settings 테이블에 저장
      if (profile.locale !== undefined || profile.timezone !== undefined) {
        const settingsUpdate: any = {};
        if (profile.locale !== undefined) settingsUpdate.locale = profile.locale;
        if (profile.timezone !== undefined) settingsUpdate.timezone = profile.timezone;

        const { error: settingsError } = await (supabase as any)
          .from('user_settings')
          .upsert({
            user_id: user.id,
            ...settingsUpdate,
            updated_at: new Date().toISOString(),
          });

        if (settingsError) {
          console.error('Settings update error:', settingsError);
        }
      }
    }

    // 알림 설정 업데이트
    if (notifications) {
      const settingsUpdate: any = {};
      if (notifications.dailyFortunePush !== undefined) {
        settingsUpdate.daily_fortune_push = notifications.dailyFortunePush;
      }
      if (notifications.dailyFortuneTime !== undefined) {
        settingsUpdate.daily_fortune_time = notifications.dailyFortuneTime;
      }
      if (notifications.marketingEmail !== undefined) {
        settingsUpdate.marketing_email = notifications.marketingEmail;
      }
      if (notifications.marketingPush !== undefined) {
        settingsUpdate.marketing_push = notifications.marketingPush;
      }

      if (Object.keys(settingsUpdate).length > 0) {
        const { error: settingsError } = await (supabase as any)
          .from('user_settings')
          .upsert({
            user_id: user.id,
            ...settingsUpdate,
            updated_at: new Date().toISOString(),
          });

        if (settingsError) {
          console.error('Settings update error:', settingsError);
        }
      }
    }

    return NextResponse.json({
      success: true,
      message: '설정이 저장되었습니다.',
    });
  } catch (error) {
    console.error('Settings update error:', error);
    return NextResponse.json(
      { error: '설정 저장에 실패했습니다.' },
      { status: 500 }
    );
  }
}
