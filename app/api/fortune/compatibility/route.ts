/**
 * 궁합 분석 API (간편 버전)
 * POST /api/fortune/compatibility
 *
 * 생년월일만 받아서 사주 계산 후 궁합 분석
 */

import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import { calculateSaju } from '@/lib/fortune/saju/newIndex';
import {
  analyzeCoupleCompatibility,
  analyzeBusinessCompatibility,
  type PersonInfo,
  type CoupleCompatibilityResult,
} from '@/lib/fortune/compatibility';

interface PersonInput {
  name: string;
  birthDate: string;   // "1990-05-15"
  birthTime?: string;  // "14:00" or null
  gender: 'male' | 'female';
  calendar?: 'solar' | 'lunar';
}

interface CompatibilityRequest {
  type: 'couple' | 'friend' | 'colleague' | 'family';
  person1: PersonInput;
  person2: PersonInput;
}

// 관계 유형별 분석 가중치
const RELATION_WEIGHTS = {
  couple: { passion: 1.2, stability: 1.1, communication: 1.0, growth: 1.0, trust: 1.1 },
  friend: { communication: 1.3, growth: 1.2, passion: 0.7, stability: 0.9, trust: 1.1 },
  colleague: { communication: 1.2, growth: 1.3, stability: 1.1, passion: 0.6, trust: 1.0 },
  family: { trust: 1.3, stability: 1.2, communication: 1.1, growth: 0.9, passion: 0.7 },
};

export async function POST(request: NextRequest) {
  try {
    const body: CompatibilityRequest = await request.json();
    const { type, person1: p1Input, person2: p2Input } = body;

    // 필수 필드 검증
    if (!type || !p1Input || !p2Input) {
      return NextResponse.json(
        { success: false, error: '필수 정보가 누락되었습니다.' },
        { status: 400 }
      );
    }

    // 인증 및 결제권 확인
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();

    // 관리자 이메일 목록
    const ADMIN_EMAILS = ['mymiryu@gmail.com'];
    const isAdmin = user?.email ? ADMIN_EMAILS.includes(user.email) : false;

    if (!isAdmin) {
      if (!user) {
        return NextResponse.json(
          { success: false, error: '로그인이 필요합니다.', errorCode: 'AUTH_REQUIRED' },
          { status: 401 }
        );
      }

      // 결제권 확인
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const { data: vouchers } = await (supabase as any)
        .from('user_vouchers')
        .select('*')
        .eq('user_id', user.id)
        .eq('service_type', 'compatibility')
        .eq('status', 'active')
        .gt('remaining_quantity', 0)
        .gt('expires_at', new Date().toISOString())
        .order('expires_at', { ascending: true })
        .limit(1);

      if (!vouchers || vouchers.length === 0) {
        return NextResponse.json({
          success: false,
          error: '궁합 분석은 결제권이 필요합니다.',
          errorCode: 'NO_VOUCHER',
        }, { status: 402 });
      }

      // 결제권 사용
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const { data: useResult, error: useError } = await (supabase as any).rpc('use_voucher', {
        p_user_id: user.id,
        p_service_type: 'compatibility',
        p_quantity: 1,
        p_related_id: null,
        p_related_type: 'compatibility_analysis',
      });

      if (useError || !useResult?.success) {
        return NextResponse.json({
          success: false,
          error: '결제권 사용에 실패했습니다.',
          errorCode: 'VOUCHER_USE_FAILED',
        }, { status: 500 });
      }
    }

    if (!p1Input.name || !p1Input.birthDate || !p1Input.gender) {
      return NextResponse.json(
        { success: false, error: '첫 번째 분의 정보가 불완전합니다.' },
        { status: 400 }
      );
    }

    if (!p2Input.name || !p2Input.birthDate || !p2Input.gender) {
      return NextResponse.json(
        { success: false, error: '두 번째 분의 정보가 불완전합니다.' },
        { status: 400 }
      );
    }

    // 사주 계산
    const saju1 = calculateSaju(
      p1Input.birthDate,
      p1Input.birthTime,
      p1Input.calendar === 'lunar'
    );

    const saju2 = calculateSaju(
      p2Input.birthDate,
      p2Input.birthTime,
      p2Input.calendar === 'lunar'
    );

    // PersonInfo 구성
    const person1: PersonInfo = {
      name: p1Input.name,
      gender: p1Input.gender,
      sajuChart: saju1,
      birthDate: p1Input.birthDate,
    };

    const person2: PersonInfo = {
      name: p2Input.name,
      gender: p2Input.gender,
      sajuChart: saju2,
      birthDate: p2Input.birthDate,
    };

    // 궁합 분석 (기본: couple 분석 사용, 관계 유형에 따라 가중치 적용)
    const baseResult = analyzeCoupleCompatibility(person1, person2);

    // 관계 유형별 시너지 점수 조정
    const weights = RELATION_WEIGHTS[type] || RELATION_WEIGHTS.couple;
    const adjustedSynergy = {
      communication: Math.min(100, Math.round(baseResult.synergy.communication * weights.communication)),
      passion: Math.min(100, Math.round(baseResult.synergy.passion * weights.passion)),
      stability: Math.min(100, Math.round(baseResult.synergy.stability * weights.stability)),
      growth: Math.min(100, Math.round(baseResult.synergy.growth * weights.growth)),
      trust: Math.min(100, Math.round(baseResult.synergy.trust * weights.trust)),
    };

    // 조정된 총점 계산
    const avgSynergy = Object.values(adjustedSynergy).reduce((a, b) => a + b, 0) / 5;
    const adjustedTotalScore = Math.round(
      (baseResult.totalScore * 0.6) + (avgSynergy * 0.4)
    );

    // 등급 재계산
    const adjustedGrade = getGrade(adjustedTotalScore);

    // 관계 유형별 맞춤 조언 생성
    const relationAdvice = generateRelationAdvice(type, baseResult, person1, person2);

    // 월별 궁합 생성 (2026년)
    const monthlyCompatibility = generateMonthlyCompatibility(saju1, saju2, 2026);

    // 응답 구성
    const result = {
      ...baseResult,
      totalScore: adjustedTotalScore,
      grade: adjustedGrade.grade,
      gradeDescription: adjustedGrade.description,
      synergy: adjustedSynergy,
      relationType: type,
      relationAdvice,
      monthlyCompatibility,
      person1: {
        name: p1Input.name,
        birthDate: p1Input.birthDate,
        gender: p1Input.gender,
        dayMaster: saju1.day.heavenlyStem,
        dayMasterKorean: saju1.day.stemKorean,
      },
      person2: {
        name: p2Input.name,
        birthDate: p2Input.birthDate,
        gender: p2Input.gender,
        dayMaster: saju2.day.heavenlyStem,
        dayMasterKorean: saju2.day.stemKorean,
      },
    };

    return NextResponse.json({
      success: true,
      data: result,
      timestamp: new Date().toISOString(),
    });

  } catch (error) {
    console.error('Compatibility analysis error:', error);
    return NextResponse.json(
      { success: false, error: '궁합 분석 중 오류가 발생했습니다.' },
      { status: 500 }
    );
  }
}

/**
 * 등급 계산
 */
function getGrade(score: number): { grade: 'S' | 'A' | 'B' | 'C' | 'D'; description: string } {
  if (score >= 90) return { grade: 'S', description: '천생연분! 최고의 궁합입니다.' };
  if (score >= 80) return { grade: 'A', description: '매우 좋은 궁합입니다.' };
  if (score >= 70) return { grade: 'B', description: '좋은 궁합입니다.' };
  if (score >= 60) return { grade: 'C', description: '보통의 궁합입니다.' };
  return { grade: 'D', description: '노력이 필요한 궁합입니다.' };
}

/**
 * 관계 유형별 맞춤 조언 생성
 */
function generateRelationAdvice(
  type: string,
  result: CoupleCompatibilityResult,
  person1: PersonInfo,
  person2: PersonInfo
): string[] {
  const adviceMap: Record<string, string[]> = {
    couple: [
      '서로의 다름을 인정하고 존중하는 자세가 중요합니다.',
      '주기적인 데이트와 대화 시간을 가지세요.',
      result.synergy.communication < 70
        ? '소통에 더 신경 쓰면 관계가 깊어집니다.'
        : '좋은 소통 능력을 유지하세요.',
      result.synergy.stability < 70
        ? '안정감을 주는 행동과 말을 의식적으로 해보세요.'
        : '현재의 안정적인 관계를 소중히 여기세요.',
    ],
    friend: [
      '서로의 관심사를 공유하며 우정을 쌓으세요.',
      '어려울 때 함께 해주는 것이 진정한 우정입니다.',
      '각자의 공간을 존중하면서 가까움을 유지하세요.',
    ],
    colleague: [
      '업무에서 서로의 강점을 활용하면 시너지가 납니다.',
      '명확한 역할 분담이 갈등을 줄입니다.',
      '의견 충돌 시 감정보다 논리로 대화하세요.',
    ],
    family: [
      '가족이라도 예의와 존중은 필수입니다.',
      '정기적인 가족 시간을 갖는 것이 좋습니다.',
      '서로의 성장을 응원하고 지지해주세요.',
    ],
  };

  return adviceMap[type] || adviceMap.couple;
}

/**
 * 월별 궁합 점수 생성
 */
function generateMonthlyCompatibility(
  saju1: any,
  saju2: any,
  year: number
): { month: string; score: number; advice: string }[] {
  const months = ['1월', '2월', '3월', '4월', '5월', '6월', '7월', '8월', '9월', '10월', '11월', '12월'];

  // 일간 기반 시드 생성
  const seed = (saju1.day.heavenlyStem.charCodeAt(0) + saju2.day.heavenlyStem.charCodeAt(0)) * year;

  const monthlyAdvice = [
    '새로운 시작에 좋은 달',
    '소통을 강화하세요',
    '함께 성장하는 시기',
    '인내심이 필요한 달',
    '최고의 시너지가 나는 달',
    '서로 배려가 필요한 시기',
    '도전을 함께 극복하세요',
    '여행이나 데이트 추천',
    '깊은 대화를 나누세요',
    '안정적인 시기',
    '주의가 필요한 달',
    '마무리와 계획의 시기',
  ];

  return months.map((month, idx) => {
    // 일관된 점수 생성 (시드 기반)
    const hash = ((seed + idx * 17) % 30) + 70; // 70-100 범위
    return {
      month,
      score: hash,
      advice: monthlyAdvice[idx],
    };
  });
}
