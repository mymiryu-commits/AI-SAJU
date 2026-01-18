/**
 * 가족/그룹 관리 API
 *
 * GET /api/my/family - 사용자의 그룹 목록 조회
 * POST /api/my/family - 새 그룹 생성
 * PATCH /api/my/family - 그룹 정보 수정
 * DELETE /api/my/family?id=xxx - 그룹 삭제
 */

import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import { nanoid } from 'nanoid';

// 그룹 목록 조회
export async function GET(request: NextRequest) {
  try {
    const supabase = await createClient();

    const { data: { user }, error: authError } = await supabase.auth.getUser();
    if (authError || !user) {
      return NextResponse.json(
        { error: '로그인이 필요합니다.' },
        { status: 401 }
      );
    }

    // 사용자가 소유한 그룹 조회
    let groups: any[] = [];
    try {
      const { data, error: fetchError } = await (supabase as any)
        .from('fortune_groups')
        .select('*')
        .eq('owner_id', user.id)
        .order('created_at', { ascending: false });

      if (fetchError) {
        console.error('Groups fetch error:', fetchError);
        // 테이블이 없어도 빈 배열 반환
      } else {
        groups = data || [];
      }
    } catch (e) {
      console.error('Groups query error:', e);
    }

    // 저장된 프로필 조회 (가족 멤버 자동 불러오기용)
    let profiles: any[] = [];
    try {
      const { data } = await (supabase as any)
        .from('saju_profiles')
        .select('*')
        .eq('user_id', user.id)
        .order('display_order', { ascending: true });
      profiles = data || [];
    } catch (e) {
      console.error('Profiles query error:', e);
    }

    // 그룹 데이터 변환
    const formattedGroups = (groups || []).map((group: any) => ({
      id: group.id,
      name: group.name,
      type: group.type,
      members: group.members || [],
      compatibility: group.compatibility_matrix?.overall || null,
      shareCode: group.share_code,
      isPublic: group.is_public,
      createdAt: group.created_at,
      updatedAt: group.updated_at,
      insights: group.group_insights,
    }));

    // 프로필 데이터 변환 (불러오기용)
    const formattedProfiles = (profiles || []).map((profile: any) => ({
      id: profile.id,
      name: profile.name,
      nickname: profile.nickname,
      birthDate: profile.birth_date,
      birthTime: profile.birth_time,
      gender: profile.gender,
      relationType: profile.relation_type,
      isFavorite: profile.is_favorite,
      bloodType: profile.blood_type,
      mbti: profile.mbti,
    }));

    return NextResponse.json({
      success: true,
      groups: formattedGroups,
      profiles: formattedProfiles, // 불러오기 가능한 프로필 목록
    });
  } catch (error) {
    console.error('Family API error:', error);
    return NextResponse.json(
      { error: '서버 오류가 발생했습니다.' },
      { status: 500 }
    );
  }
}

// 새 그룹 생성
export async function POST(request: NextRequest) {
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
    const { name, type, members, profileIds } = body;

    if (!name || !type) {
      return NextResponse.json(
        { error: '그룹 이름과 유형은 필수입니다.' },
        { status: 400 }
      );
    }

    // 프로필 ID로 멤버 정보 가져오기 (자동 불러오기)
    let groupMembers = members || [];

    if (profileIds && profileIds.length > 0) {
      const { data: profiles } = await (supabase as any)
        .from('saju_profiles')
        .select('*')
        .eq('user_id', user.id)
        .in('id', profileIds);

      if (profiles) {
        const profileMembers = profiles.map((p: any) => ({
          id: p.id,
          name: p.name,
          nickname: p.nickname,
          birthDate: p.birth_date,
          birthTime: p.birth_time,
          gender: p.gender,
          relation: p.relation_type === 'self' ? '본인' : getRelationLabel(p.relation_type),
          isOwner: p.relation_type === 'self',
        }));
        groupMembers = [...groupMembers, ...profileMembers];
      }
    }

    // 공유 코드 생성
    const shareCode = generateShareCode(type);

    // 그룹 생성
    const { data: newGroup, error: insertError } = await (supabase as any)
      .from('fortune_groups')
      .insert({
        owner_id: user.id,
        name,
        type,
        members: groupMembers,
        share_code: shareCode,
        is_public: false,
      })
      .select()
      .single();

    if (insertError) {
      console.error('Group insert error:', insertError);
      return NextResponse.json(
        { error: '그룹 생성 중 오류가 발생했습니다.' },
        { status: 500 }
      );
    }

    return NextResponse.json({
      success: true,
      group: {
        id: newGroup.id,
        name: newGroup.name,
        type: newGroup.type,
        members: newGroup.members,
        shareCode: newGroup.share_code,
        createdAt: newGroup.created_at,
      },
    });
  } catch (error) {
    console.error('Create group error:', error);
    return NextResponse.json(
      { error: '서버 오류가 발생했습니다.' },
      { status: 500 }
    );
  }
}

// 그룹 수정 (멤버 추가/제거 포함)
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
    const { id, name, members, addProfileIds, removeMemberIds } = body;

    if (!id) {
      return NextResponse.json(
        { error: '그룹 ID가 필요합니다.' },
        { status: 400 }
      );
    }

    // 현재 그룹 조회
    const { data: currentGroup, error: fetchError } = await (supabase as any)
      .from('fortune_groups')
      .select('*')
      .eq('id', id)
      .eq('owner_id', user.id)
      .single();

    if (fetchError || !currentGroup) {
      return NextResponse.json(
        { error: '그룹을 찾을 수 없습니다.' },
        { status: 404 }
      );
    }

    let updatedMembers = currentGroup.members || [];

    // 프로필에서 멤버 추가
    if (addProfileIds && addProfileIds.length > 0) {
      const { data: profiles } = await (supabase as any)
        .from('saju_profiles')
        .select('*')
        .eq('user_id', user.id)
        .in('id', addProfileIds);

      if (profiles) {
        const newMembers = profiles.map((p: any) => ({
          id: p.id,
          name: p.name,
          nickname: p.nickname,
          birthDate: p.birth_date,
          birthTime: p.birth_time,
          gender: p.gender,
          relation: getRelationLabel(p.relation_type),
          isOwner: p.relation_type === 'self',
        }));

        // 중복 제거하며 추가
        const existingIds = new Set(updatedMembers.map((m: any) => m.id));
        newMembers.forEach((m: any) => {
          if (!existingIds.has(m.id)) {
            updatedMembers.push(m);
          }
        });
      }
    }

    // 멤버 제거
    if (removeMemberIds && removeMemberIds.length > 0) {
      const removeSet = new Set(removeMemberIds);
      updatedMembers = updatedMembers.filter((m: any) => !removeSet.has(m.id));
    }

    // 직접 전달된 members가 있으면 사용
    if (members !== undefined) {
      updatedMembers = members;
    }

    // 업데이트 데이터 구성
    const updateData: any = {
      updated_at: new Date().toISOString(),
    };

    if (name !== undefined) updateData.name = name;
    if (updatedMembers !== undefined) updateData.members = updatedMembers;

    const { data: updated, error: updateError } = await (supabase as any)
      .from('fortune_groups')
      .update(updateData)
      .eq('id', id)
      .eq('owner_id', user.id)
      .select()
      .single();

    if (updateError) {
      console.error('Group update error:', updateError);
      return NextResponse.json(
        { error: '그룹 수정 중 오류가 발생했습니다.' },
        { status: 500 }
      );
    }

    return NextResponse.json({
      success: true,
      group: {
        id: updated.id,
        name: updated.name,
        type: updated.type,
        members: updated.members,
        shareCode: updated.share_code,
        updatedAt: updated.updated_at,
      },
    });
  } catch (error) {
    console.error('Update group error:', error);
    return NextResponse.json(
      { error: '서버 오류가 발생했습니다.' },
      { status: 500 }
    );
  }
}

// 그룹 삭제
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
        { error: '그룹 ID가 필요합니다.' },
        { status: 400 }
      );
    }

    const { error: deleteError } = await (supabase as any)
      .from('fortune_groups')
      .delete()
      .eq('id', id)
      .eq('owner_id', user.id);

    if (deleteError) {
      console.error('Group delete error:', deleteError);
      return NextResponse.json(
        { error: '그룹 삭제 중 오류가 발생했습니다.' },
        { status: 500 }
      );
    }

    return NextResponse.json({
      success: true,
      message: '그룹이 삭제되었습니다.',
    });
  } catch (error) {
    console.error('Delete group error:', error);
    return NextResponse.json(
      { error: '서버 오류가 발생했습니다.' },
      { status: 500 }
    );
  }
}

// Helper functions
function generateShareCode(type: string): string {
  const prefix = type.toUpperCase().slice(0, 3);
  const code = nanoid(6).toUpperCase();
  return `${prefix}-${code}`;
}

function getRelationLabel(relationType: string): string {
  const labels: Record<string, string> = {
    self: '본인',
    family: '가족',
    spouse: '배우자',
    child: '자녀',
    parent: '부모',
    sibling: '형제자매',
    friend: '친구',
    colleague: '동료',
    other: '기타',
  };
  return labels[relationType] || relationType;
}
