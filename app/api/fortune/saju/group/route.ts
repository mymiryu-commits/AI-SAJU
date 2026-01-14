/**
 * 다자간 궁합 분석 API
 * POST /api/fortune/saju/group
 */

import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import {
  analyzeGroupCompatibility,
  generateGroupSummary,
  calculateSaju,
  analyzeOheng
} from '@/lib/fortune/saju/newIndex';
import type { GroupMember, GroupCompatibility, RelationType } from '@/types/saju';

interface GroupMemberInput {
  name: string;
  birthDate: string;
  birthTime?: string;
  gender: 'male' | 'female';
  relation: RelationType;
}

export async function POST(request: NextRequest) {
  try {
    const { members } = await request.json() as { members: GroupMemberInput[] };

    // 검증
    if (!members || !Array.isArray(members)) {
      return NextResponse.json(
        { success: false, error: '멤버 정보가 필요합니다.' },
        { status: 400 }
      );
    }

    if (members.length < 2 || members.length > 5) {
      return NextResponse.json(
        { success: false, error: '2~5명 사이의 인원만 분석 가능합니다.' },
        { status: 400 }
      );
    }

    // 각 멤버의 사주 계산
    const analyzedMembers: GroupMember[] = members.map((member, index) => {
      const saju = calculateSaju(member.birthDate, member.birthTime);
      const ohengResult = analyzeOheng(saju);

      return {
        id: `member_${index + 1}`,
        name: member.name,
        birthDate: member.birthDate,
        birthTime: member.birthTime,
        gender: member.gender,
        relation: member.relation,
        saju,
        oheng: ohengResult.balance
      };
    });

    // 그룹 궁합 분석
    const groupAnalysis = analyzeGroupCompatibility(analyzedMembers);

    // 요약 생성
    const summary = generateGroupSummary(groupAnalysis);

    // 인증된 사용자면 저장
    let analysisId = null;

    try {
      const supabase = await createClient();
      const { data: { user } } = await supabase.auth.getUser();

      if (user) {
        const { data, error } = await (supabase as any)
          .from('fortune_analyses')
          .insert({
            user_id: user.id,
            type: 'saju',
            subtype: 'group',
            input_data: { members },
            result_summary: {
              totalMembers: groupAnalysis.totalMembers,
              overallHarmony: groupAnalysis.groupDynamics.overallHarmony,
              dominantElement: groupAnalysis.groupDynamics.dominantElement,
              memberNames: analyzedMembers.map(m => m.name)
            },
            result_full: {
              groupAnalysis,
              summary
            },
            keywords: [
              'group',
              groupAnalysis.groupDynamics.dominantElement,
              ...members.map(m => m.relation)
            ]
          })
          .select('id')
          .single();

        if (!error && data) {
          analysisId = data.id;
        }
      }
    } catch (dbError) {
      console.warn('DB 저장 실패:', dbError);
    }

    return NextResponse.json({
      success: true,
      data: {
        analysis: groupAnalysis,
        summary,
        members: analyzedMembers.map(m => ({
          id: m.id,
          name: m.name,
          relation: m.relation,
          dayMaster: m.saju?.day.heavenlyStem,
          dayElement: m.saju?.day.element,
          zodiac: m.saju?.year.zodiac
        }))
      },
      meta: {
        analysisId,
        totalMembers: members.length,
        timestamp: new Date().toISOString()
      }
    });

  } catch (error) {
    console.error('Group analysis error:', error);
    return NextResponse.json(
      { success: false, error: '그룹 분석 중 오류가 발생했습니다.' },
      { status: 500 }
    );
  }
}

/**
 * 특정 쌍 궁합 상세 조회
 * GET /api/fortune/saju/group?member1=xxx&member2=xxx
 */
export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const member1Birth = searchParams.get('member1Birth');
  const member2Birth = searchParams.get('member2Birth');

  if (!member1Birth || !member2Birth) {
    return NextResponse.json(
      { success: false, error: '두 멤버의 생년월일이 필요합니다.' },
      { status: 400 }
    );
  }

  try {
    const saju1 = calculateSaju(member1Birth);
    const saju2 = calculateSaju(member2Birth);

    const oheng1 = analyzeOheng(saju1);
    const oheng2 = analyzeOheng(saju2);

    // 간단한 궁합 점수 계산
    const compatibility = calculateSimpleCompatibility(
      saju1.day.element,
      saju2.day.element
    );

    return NextResponse.json({
      success: true,
      data: {
        member1: {
          dayMaster: saju1.day.heavenlyStem,
          dayElement: saju1.day.element,
          zodiac: saju1.year.zodiac
        },
        member2: {
          dayMaster: saju2.day.heavenlyStem,
          dayElement: saju2.day.element,
          zodiac: saju2.year.zodiac
        },
        compatibility
      }
    });

  } catch (error) {
    console.error('Pair compatibility error:', error);
    return NextResponse.json(
      { success: false, error: '궁합 분석 중 오류가 발생했습니다.' },
      { status: 500 }
    );
  }
}

/**
 * 간단한 궁합 계산
 */
function calculateSimpleCompatibility(
  element1: string,
  element2: string
): { score: number; type: string; description: string } {
  // 상생 관계
  const generating: Record<string, string> = {
    wood: 'fire', fire: 'earth', earth: 'metal', metal: 'water', water: 'wood'
  };

  // 상극 관계
  const controlling: Record<string, string> = {
    wood: 'earth', earth: 'water', water: 'fire', fire: 'metal', metal: 'wood'
  };

  if (element1 === element2) {
    return {
      score: 70,
      type: '비화',
      description: '같은 에너지로 서로 이해하지만, 발전이 정체될 수 있습니다.'
    };
  }

  if (generating[element1] === element2 || generating[element2] === element1) {
    return {
      score: 88,
      type: '상생',
      description: '서로를 자연스럽게 돕는 좋은 관계입니다.'
    };
  }

  if (controlling[element1] === element2 || controlling[element2] === element1) {
    return {
      score: 55,
      type: '상극',
      description: '긴장 관계가 있지만, 서로 다른 관점으로 보완할 수 있습니다.'
    };
  }

  return {
    score: 75,
    type: '중화',
    description: '직접적인 상생상극이 없어 중립적인 관계입니다.'
  };
}
