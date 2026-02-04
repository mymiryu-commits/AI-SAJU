/**
 * 다자간 궁합 분석 API
 * POST /api/fortune/saju/group
 */

import { NextRequest, NextResponse } from 'next/server';
import { createClient, createServiceClient } from '@/lib/supabase/server';
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
        // Service client 사용 (RLS 우회, 인증 확인 완료 후)
        const serviceClient = createServiceClient();

        const { data, error } = await (serviceClient as any)
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

        if (error) {
          console.error('[Group] 분석 저장 실패:', error);
        } else if (data) {
          analysisId = data.id;
          console.log('[Group] 분석 저장 성공:', analysisId);
        }
      }
    } catch (dbError) {
      console.warn('DB 저장 실패:', dbError);
    }

    // 프론트엔드용 응답 데이터 변환
    const overallScore = Math.round(groupAnalysis.groupDynamics.overallHarmony);
    const grade = overallScore >= 90 ? 'S' : overallScore >= 80 ? 'A' : overallScore >= 70 ? 'B' : overallScore >= 60 ? 'C' : 'D';

    // 오행 한글 변환
    const elementKorean: Record<string, string> = {
      wood: '목(木)', fire: '화(火)', earth: '토(土)', metal: '금(金)', water: '수(水)'
    };

    // 역할 매핑
    const roleMap: Record<string, { role: string; strength: string }> = {
      wood: { role: '🌱 개척자/선구자', strength: '새로운 아이디어와 시작을 이끕니다' },
      fire: { role: '🔥 동기부여자/리더', strength: '열정으로 팀에 활력을 불어넣습니다' },
      earth: { role: '🪨 조율자/중재자', strength: '갈등을 조율하고 안정감을 제공합니다' },
      metal: { role: '⚔️ 실행자/완결자', strength: '결단력 있게 마무리를 담당합니다' },
      water: { role: '💧 전략가/분석가', strength: '유연하게 상황을 파악하고 조언합니다' }
    };

    const memberRoles = analyzedMembers.map(m => {
      const element = m.saju?.day.element || 'earth';
      const roleInfo = roleMap[element] || roleMap.earth;
      return {
        name: m.name,
        role: roleInfo.role,
        element: elementKorean[element] || element,
        strength: roleInfo.strength
      };
    });

    // 쌍별 분석
    const pairAnalysis: { person1: string; person2: string; score: number; relationship: string }[] = [];
    for (let i = 0; i < analyzedMembers.length; i++) {
      for (let j = i + 1; j < analyzedMembers.length; j++) {
        const e1 = analyzedMembers[i].saju?.day.element || 'earth';
        const e2 = analyzedMembers[j].saju?.day.element || 'earth';
        const compat = calculateSimpleCompatibility(e1, e2);
        pairAnalysis.push({
          person1: analyzedMembers[i].name,
          person2: analyzedMembers[j].name,
          score: compat.score,
          relationship: compat.type
        });
      }
    }

    // 팀 케미 지표 계산 (groupDynamics 기반으로 추정)
    const dynamics = groupAnalysis.groupDynamics as Record<string, unknown>;
    const baseHarmony = groupAnalysis.groupDynamics.overallHarmony;
    const teamChemistry = {
      harmony: Math.round(baseHarmony),
      synergy: Math.round((dynamics.synergyPotential as number) || baseHarmony * 0.95),
      balance: Math.round((dynamics.balanceScore as number) || baseHarmony * 0.9),
      growth: Math.round((dynamics.growthPotential as number) || baseHarmony * 1.05)
    };

    // 강점 생성 (summary는 string)
    const dominantEl = groupAnalysis.groupDynamics.dominantElement;
    const missingEl = groupAnalysis.groupDynamics.missingElement;
    const strengths = [
      `${elementKorean[dominantEl] || dominantEl} 에너지가 팀을 주도합니다`,
      groupAnalysis.groupDynamics.groupStrength || '서로 다른 관점이 시너지를 만들어냅니다',
      '다양한 에너지가 조화를 이룹니다'
    ];

    // 주의점 생성
    const potentialConflicts = (dynamics.potentialConflicts as string[]) || [];
    const challenges = potentialConflicts.length > 0
      ? potentialConflicts.slice(0, 3)
      : [
          groupAnalysis.groupDynamics.groupWeakness || '의견 충돌 시 충분한 대화가 필요합니다',
          `${elementKorean[missingEl] || missingEl} 에너지 보충이 필요합니다`,
          '목표를 함께 공유하고 점검하세요'
        ];

    // 조언 생성
    const advice = [
      '정기적인 소통 시간을 가지세요',
      '각자의 강점을 인정하고 활용하세요',
      '갈등 발생 시 감정보다 목표에 집중하세요',
      `${elementKorean[missingEl] || ''} 특성을 가진 활동을 함께 해보세요`
    ];

    return NextResponse.json({
      success: true,
      data: {
        overallScore,
        grade,
        teamChemistry,
        memberRoles,
        pairAnalysis,
        strengths,
        challenges,
        advice,
        bestCombinations: pairAnalysis.filter(p => p.score >= 80).map(p => `${p.person1} & ${p.person2}`),
        warningPairs: pairAnalysis.filter(p => p.score < 60).map(p => `${p.person1} & ${p.person2}`),
        // 원본 데이터도 포함
        rawAnalysis: groupAnalysis,
        summary
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
