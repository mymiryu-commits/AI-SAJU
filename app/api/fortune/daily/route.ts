import { NextRequest, NextResponse } from 'next/server';
import { createClient, createServiceClient } from '@/lib/supabase/server';

// 천간 (하늘의 기운)
const CHEONGAN = ['갑', '을', '병', '정', '무', '기', '경', '신', '임', '계'];
// 지지 (땅의 기운)
const JIJI = ['자', '축', '인', '묘', '진', '사', '오', '미', '신', '유', '술', '해'];

// 오늘의 천간지지 계산
function getDailyGanJi(date: Date) {
  // 기준일: 1900년 1월 31일 = 경자일
  const baseDate = new Date(1900, 0, 31);
  const diffTime = date.getTime() - baseDate.getTime();
  const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));

  const ganIndex = (diffDays + 6) % 10; // 경(6)부터 시작
  const jiIndex = diffDays % 12;

  return {
    gan: CHEONGAN[ganIndex],
    ji: JIJI[jiIndex],
    ganIndex,
    jiIndex,
  };
}

// 오행별 운세 조언
const OHENG_ADVICE: Record<string, string[]> = {
  목: [
    '새로운 시작에 적합한 날입니다. 계획했던 프로젝트를 시작해보세요.',
    '창의력이 넘치는 날입니다. 아이디어를 적극적으로 표현하세요.',
    '성장과 발전의 기운이 강합니다. 자기계발에 투자하세요.',
  ],
  화: [
    '열정이 넘치는 하루입니다. 적극적으로 행동하면 좋은 결과가 있습니다.',
    '사교활동에 좋은 날입니다. 새로운 인연을 만나보세요.',
    '표현력이 빛나는 날입니다. 프레젠테이션이나 발표에 유리합니다.',
  ],
  토: [
    '안정과 균형이 중요한 날입니다. 중심을 잡고 차분하게 임하세요.',
    '신뢰를 쌓기 좋은 날입니다. 약속을 지키고 성실하게 행동하세요.',
    '계획을 정리하고 체계화하기 좋은 날입니다.',
  ],
  금: [
    '결단력이 필요한 날입니다. 망설이지 말고 결정을 내리세요.',
    '재정 관련 일에 유리한 날입니다. 투자나 저축을 고려해보세요.',
    '정리정돈과 마무리에 적합한 날입니다.',
  ],
  수: [
    '지혜와 통찰력이 높은 날입니다. 중요한 결정에 유리합니다.',
    '학습과 연구에 좋은 날입니다. 새로운 지식을 쌓아보세요.',
    '유연한 대처가 필요한 날입니다. 변화에 적응하세요.',
  ],
};

// 오행별 주의사항
const OHENG_CAUTION: Record<string, string[]> = {
  목: [
    '급하게 서두르면 실수할 수 있습니다. 차분하게 진행하세요.',
    '고집을 부리면 관계가 멀어질 수 있습니다.',
    '무리한 계획은 피하세요.',
  ],
  화: [
    '감정 조절에 유의하세요. 화를 참지 못하면 손해를 볼 수 있습니다.',
    '충동적인 소비를 조심하세요.',
    '말실수에 주의하세요.',
  ],
  토: [
    '우유부단함이 기회를 놓치게 할 수 있습니다.',
    '변화를 두려워하지 마세요.',
    '지나친 걱정은 금물입니다.',
  ],
  금: [
    '지나친 완벽주의는 스트레스가 됩니다.',
    '융통성 없는 태도는 갈등을 일으킬 수 있습니다.',
    '비판보다 격려가 필요한 날입니다.',
  ],
  수: [
    '지나친 생각은 실행력을 떨어뜨립니다.',
    '감정에 휩쓸리지 마세요.',
    '현실적인 판단이 필요합니다.',
  ],
};

function generateDailyFortune(date: Date, userId?: string) {
  // Use date and userId as seed for consistent daily fortune
  const seed = date.getFullYear() * 10000 + (date.getMonth() + 1) * 100 + date.getDate();
  const userSeed = userId ? userId.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0) : 0;
  const combinedSeed = seed + userSeed;

  const random = (min: number, max: number, offset: number = 0) => {
    const x = Math.sin((combinedSeed + offset) * 9999) * 10000;
    return Math.floor((x - Math.floor(x)) * (max - min + 1)) + min;
  };

  // 오늘의 간지
  const dailyGanJi = getDailyGanJi(date);

  // 천간에서 오행 도출
  const ganOheng: Record<string, string> = {
    '갑': '목', '을': '목', '병': '화', '정': '화', '무': '토',
    '기': '토', '경': '금', '신': '금', '임': '수', '계': '수',
  };
  const todayOheng = ganOheng[dailyGanJi.gan];

  // 색상 (오행 기반)
  const ohengColors: Record<string, string[]> = {
    목: ['초록', '연두', '청록'],
    화: ['빨강', '주황', '분홍'],
    토: ['노랑', '베이지', '갈색'],
    금: ['흰색', '은색', '금색'],
    수: ['검정', '파랑', '남색'],
  };

  // 방향 (오행 기반)
  const ohengDirections: Record<string, string[]> = {
    목: ['동쪽', '동남쪽'],
    화: ['남쪽', '남동쪽'],
    토: ['중앙', '북동쪽', '남서쪽'],
    금: ['서쪽', '북서쪽'],
    수: ['북쪽', '북동쪽'],
  };

  // 운세 점수 계산 (일간지에 따라 변동)
  const baseScore = 65 + (dailyGanJi.ganIndex * 2) % 15;

  const colors = ohengColors[todayOheng];
  const directions = ohengDirections[todayOheng];
  const advices = OHENG_ADVICE[todayOheng];
  const cautions = OHENG_CAUTION[todayOheng];

  return {
    date: date.toISOString().split('T')[0],
    dailyGanJi: `${dailyGanJi.gan}${dailyGanJi.ji}일`,
    todayOheng,
    scores: {
      overall: Math.min(95, baseScore + random(0, 20, 1)),
      wealth: Math.min(98, baseScore + random(-5, 25, 2)),
      love: Math.min(95, baseScore + random(-10, 20, 3)),
      career: Math.min(95, baseScore + random(0, 22, 4)),
      health: Math.min(90, baseScore + random(-8, 15, 5)),
    },
    lucky: {
      time: `${random(6, 18, 6).toString().padStart(2, '0')}:00`,
      color: colors[random(0, colors.length - 1, 7)],
      number: random(1, 99, 8),
      direction: directions[random(0, directions.length - 1, 9)],
    },
    advice: advices[random(0, advices.length - 1, 10)],
    caution: cautions[random(0, cautions.length - 1, 11)],
  };
}

export async function GET(request: NextRequest) {
  try {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();

    const today = new Date();
    const fortune = generateDailyFortune(today, user?.id);

    // If user is logged in, check/save daily fortune
    if (user) {
      const dateStr = today.toISOString().split('T')[0];

      // Check if today's fortune exists
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const { data: existing } = await (supabase as any)
        .from('daily_fortunes')
        .select('*')
        .eq('user_id', user.id)
        .eq('fortune_date', dateStr)
        .single();

      if (!existing) {
        // Save new daily fortune (Service client 사용)
        const serviceClient = createServiceClient();
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const { error: dailyError } = await (serviceClient as any).from('daily_fortunes').insert({
          user_id: user.id,
          fortune_date: dateStr,
          overall_score: fortune.scores.overall,
          wealth_score: fortune.scores.wealth,
          love_score: fortune.scores.love,
          career_score: fortune.scores.career,
          health_score: fortune.scores.health,
          summary: fortune.advice,
          advice: fortune.advice,
          lucky_time: fortune.lucky.time,
          lucky_color: fortune.lucky.color,
          lucky_number: fortune.lucky.number.toString(),
          caution: fortune.caution,
        });
        if (dailyError) {
          console.error('[Daily] 운세 저장 실패:', dailyError);
        }
      }
    }

    return NextResponse.json({
      success: true,
      fortune,
    });
  } catch (error) {
    console.error('Daily fortune error:', error);
    return NextResponse.json(
      { error: 'Failed to generate fortune' },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
      return NextResponse.json(
        { error: 'Authentication required' },
        { status: 401 }
      );
    }

    const today = new Date().toISOString().split('T')[0];

    // Check in for today
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const { data: existing } = await (supabase as any)
      .from('checkins')
      .select('*')
      .eq('user_id', user.id)
      .eq('checked_at', today)
      .single() as { data: { streak_count: number } | null };

    if (existing) {
      return NextResponse.json({
        success: true,
        alreadyCheckedIn: true,
        streak: existing.streak_count,
      });
    }

    // Get yesterday's check-in for streak calculation
    const yesterday = new Date(Date.now() - 86400000).toISOString().split('T')[0];
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const { data: yesterdayCheckin } = await (supabase as any)
      .from('checkins')
      .select('streak_count')
      .eq('user_id', user.id)
      .eq('checked_at', yesterday)
      .single() as { data: { streak_count: number } | null };

    const newStreak = yesterdayCheckin ? yesterdayCheckin.streak_count + 1 : 1;

    // Determine reward
    let rewardType = 'coin';
    let rewardAmount = 10;

    if (newStreak % 7 === 0) {
      rewardType = 'bonus';
      rewardAmount = 50;
    } else if (newStreak % 30 === 0) {
      rewardType = 'premium_day';
      rewardAmount = 1;
    }

    // Create check-in (Service client 사용)
    const serviceClient = createServiceClient();
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const { error: checkinError } = await (serviceClient as any).from('checkins').insert({
      user_id: user.id,
      checked_at: today,
      streak_count: newStreak,
      reward_type: rewardType,
      reward_amount: rewardAmount,
    });
    if (checkinError) {
      console.error('[Checkin] 체크인 저장 실패:', checkinError);
    }

    // Add coins to user balance
    if (rewardType === 'coin' || rewardType === 'bonus') {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      await (serviceClient as any).rpc('increment_coins', {
        user_id: user.id,
        amount: rewardAmount,
      });
    }

    return NextResponse.json({
      success: true,
      streak: newStreak,
      reward: {
        type: rewardType,
        amount: rewardAmount,
      },
    });
  } catch (error) {
    console.error('Check-in error:', error);
    return NextResponse.json(
      { error: 'Check-in failed' },
      { status: 500 }
    );
  }
}
