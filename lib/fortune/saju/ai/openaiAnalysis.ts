/**
 * OpenAI 기반 사주 분석 해석 생성
 */

import OpenAI from 'openai';
import type { UserInput, SajuChart, OhengBalance, Element } from '@/types/saju';

// OpenAI 클라이언트는 함수 호출 시 생성 (빌드 타임 에러 방지)
function getOpenAIClient() {
  return new OpenAI({
    apiKey: process.env.OPENAI_API_KEY,
  });
}

interface SajuContext {
  user: UserInput;
  saju: SajuChart;
  oheng: OhengBalance;
  yongsin: Element[];
  gisin: Element[];
  scores: {
    overall: number;
    wealth: number;
    love: number;
    career: number;
    health: number;
  };
  dayMasterStrength: string;
}

/**
 * AI 기반 풍부한 분석 결과 생성
 */
export async function generateAIAnalysis(context: SajuContext): Promise<{
  personalityReading: string;
  fortuneAdvice: {
    overall: string;
    wealth: string;
    love: string;
    career: string;
    health: string;
  };
  coreMessage: {
    hook: string;
    insight: string;
    urgency: string;
  };
  lifePath: string;
  luckyElements: string;
  warningAdvice: string;
}> {
  const { user, saju, oheng, yongsin, gisin, scores, dayMasterStrength } = context;

  const ELEMENT_KOREAN: Record<string, string> = {
    wood: '목(木)', fire: '화(火)', earth: '토(土)', metal: '금(金)', water: '수(水)'
  };

  const systemPrompt = `당신은 30년 경력의 사주명리학 전문가입니다. 사주 데이터를 바탕으로 깊이 있고 구체적인 분석을 제공합니다.

분석 원칙:
1. 추상적인 말 대신 구체적인 행동 조언을 제공
2. 개인의 생년월일과 현재 고민에 맞춤화된 해석
3. 긍정적이면서도 현실적인 조언
4. 사주학적 근거를 바탕으로 한 설명
5. 한국어로 자연스럽게 작성

응답 형식: JSON으로 반환`;

  const userPrompt = `다음 사주 정보를 바탕으로 깊이 있는 분석을 해주세요.

## 사용자 정보
- 이름: ${user.name}
- 성별: ${user.gender === 'male' ? '남성' : '여성'}
- 생년월일: ${user.birthDate}
- 태어난 시: ${user.birthTime || '모름'}
- 현재 고민: ${user.currentConcern || '없음'}
- 직업군: ${user.careerType || '미입력'}
- MBTI: ${user.mbti || '미입력'}

## 사주 원국
- 년주: ${saju.year.heavenlyStem}${saju.year.earthlyBranch} (${saju.year.stemKorean}${saju.year.branchKorean})
- 월주: ${saju.month.heavenlyStem}${saju.month.earthlyBranch} (${saju.month.stemKorean}${saju.month.branchKorean})
- 일주: ${saju.day.heavenlyStem}${saju.day.earthlyBranch} (${saju.day.stemKorean}${saju.day.branchKorean}) - 일간: ${saju.day.element}
${saju.time ? `- 시주: ${saju.time.heavenlyStem}${saju.time.earthlyBranch} (${saju.time.stemKorean}${saju.time.branchKorean})` : '- 시주: 미상'}

## 오행 분포
- 목(木): ${oheng.wood.toFixed(1)}
- 화(火): ${oheng.fire.toFixed(1)}
- 토(土): ${oheng.earth.toFixed(1)}
- 금(金): ${oheng.metal.toFixed(1)}
- 수(水): ${oheng.water.toFixed(1)}

## 분석 결과
- 일간 강약: ${dayMasterStrength === 'strong' ? '신강' : dayMasterStrength === 'weak' ? '신약' : '중화'}
- 용신: ${yongsin.map(e => ELEMENT_KOREAN[e]).join(', ')}
- 기신: ${gisin.map(e => ELEMENT_KOREAN[e]).join(', ')}
- 2026년 운세 점수: 종합 ${scores.overall}점, 재물 ${scores.wealth}점, 애정 ${scores.love}점, 직업 ${scores.career}점, 건강 ${scores.health}점

다음 JSON 형식으로 응답해주세요:
{
  "personalityReading": "(일간과 사주 구성을 바탕으로 한 성격 분석 3-4문장. 강점과 주의점을 구체적으로)",
  "fortuneAdvice": {
    "overall": "(2026년 전체 운세 흐름과 핵심 조언 2-3문장)",
    "wealth": "(재물운 상세 분석과 구체적 행동 조언 2-3문장)",
    "love": "(애정운/인간관계 분석과 조언 2-3문장)",
    "career": "(직업/사업운 분석과 실천 가능한 조언 2-3문장)",
    "health": "(건강운 분석과 주의사항 2문장)"
  },
  "coreMessage": {
    "hook": "(사용자의 고민에 맞춘 강력한 첫 메시지 1-2문장. 공감과 통찰)",
    "insight": "(사주가 말해주는 핵심 인사이트 2-3문장. 구체적이고 실용적으로)",
    "urgency": "(지금 행동해야 하는 이유 1문장)"
  },
  "lifePath": "(인생 전체 흐름과 중요 시기 언급 2-3문장)",
  "luckyElements": "(행운을 가져다주는 요소들: 색상, 방향, 숫자, 음식 등 구체적으로)",
  "warningAdvice": "(특히 주의해야 할 점 1-2문장)"
}`;

  try {
    const response = await getOpenAIClient().chat.completions.create({
      model: 'gpt-4o-mini',
      messages: [
        { role: 'system', content: systemPrompt },
        { role: 'user', content: userPrompt }
      ],
      temperature: 0.7,
      max_tokens: 2000,
      response_format: { type: 'json_object' }
    });

    const content = response.choices[0]?.message?.content;
    if (!content) {
      throw new Error('No response from OpenAI');
    }

    const result = JSON.parse(content);
    return result;
  } catch (error) {
    console.error('OpenAI Analysis Error:', error);

    // 폴백: 기본 분석 반환
    return generateFallbackAnalysis(context);
  }
}

/**
 * 폴백 분석 (OpenAI 실패 시)
 */
function generateFallbackAnalysis(context: SajuContext) {
  const { user, saju, scores, yongsin, gisin, dayMasterStrength } = context;

  const ELEMENT_KOREAN: Record<string, string> = {
    wood: '목(木)', fire: '화(火)', earth: '토(土)', metal: '금(金)', water: '수(水)'
  };

  const dayMasterTraits: Record<string, string> = {
    '甲': '강인한 리더십과 추진력을 가지고 계십니다. 목표를 향해 곧게 나아가는 성향이지만, 때로는 유연함이 필요합니다.',
    '乙': '부드럽고 유연한 성격으로 환경에 잘 적응합니다. 섬세한 감각이 뛰어나지만 결단력을 키워야 할 때가 있습니다.',
    '丙': '밝고 열정적인 에너지로 주변을 환하게 밝힙니다. 사교성이 뛰어나지만 감정 조절에 신경 써야 합니다.',
    '丁': '따뜻하고 섬세한 성품으로 깊은 사고를 합니다. 헌신적이지만 자기 표현에 더 적극적일 필요가 있습니다.',
    '戊': '믿음직하고 안정적인 성격입니다. 책임감이 강하지만 변화에 대한 두려움을 극복해야 합니다.',
    '己': '배려심이 깊고 인내심이 강합니다. 꼼꼼한 성격이지만 때로는 과감한 도전이 필요합니다.',
    '庚': '결단력과 실행력이 뛰어납니다. 정의감이 강하지만 상대방의 입장도 헤아려야 합니다.',
    '辛': '섬세하고 세련된 감각을 가지고 계십니다. 완벽주의 성향이 있으니 자신에게 관대해지세요.',
    '壬': '지혜롭고 포용적인 성격입니다. 창의력이 뛰어나지만 일관성을 유지하는 것이 중요합니다.',
    '癸': '직관적이고 감수성이 풍부합니다. 깊은 통찰력이 있지만 현실적인 실행력을 키워야 합니다.'
  };

  const concernMessages: Record<string, string> = {
    money: '재정적인 고민이 있으시군요. 당신의 사주를 보면 재물운의 흐름이 있습니다.',
    career: '직업과 커리어에 대한 고민이 있으시군요. 사주에서 그 방향성을 찾을 수 있습니다.',
    romance: '사랑과 관계에 대한 고민이 있으시군요. 당신의 애정운을 살펴보겠습니다.',
    family: '가족 관계에 대한 고민이 있으시군요. 사주에서 그 해답을 찾아보겠습니다.',
    health: '건강에 대한 걱정이 있으시군요. 사주에서 주의해야 할 점을 알려드리겠습니다.',
    direction: '인생의 방향에 대한 고민이 있으시군요. 사주가 그 길을 밝혀줄 것입니다.',
    relationship: '인간관계에 스트레스가 있으시군요. 사주에서 해결책을 찾아보겠습니다.',
    none: '현재 특별한 고민이 없으시군요. 앞으로의 운세 흐름을 살펴보겠습니다.'
  };

  return {
    personalityReading: dayMasterTraits[saju.day.heavenlyStem] || '독특하고 개성 있는 성격을 가지고 계십니다.',
    fortuneAdvice: {
      overall: `2026년은 ${dayMasterStrength === 'strong' ? '차분하게 내실을 다지는' : dayMasterStrength === 'weak' ? '적극적으로 기회를 잡는' : '균형 있게 발전하는'} 시기입니다. 용신인 ${yongsin.map(e => ELEMENT_KOREAN[e]).join(', ')}의 기운을 활용하세요.`,
      wealth: scores.wealth >= 80 ? '재물운이 좋은 시기입니다. 투자나 새로운 수입원을 만들기 좋습니다.' : scores.wealth >= 60 ? '안정적인 재정 관리가 중요합니다. 큰 지출은 신중하게 결정하세요.' : '재정적으로 조심해야 할 시기입니다. 저축과 절약에 집중하세요.',
      love: scores.love >= 80 ? '인간관계와 애정운이 좋습니다. 새로운 만남이나 관계 발전의 기회가 있습니다.' : scores.love >= 60 ? '현재 관계에 집중하고 소통을 강화하세요.' : '인간관계에서 오해가 생기기 쉽습니다. 대화로 풀어가세요.',
      career: scores.career >= 80 ? '직업운이 상승하는 시기입니다. 승진이나 새로운 기회가 올 수 있습니다.' : scores.career >= 60 ? '현재 위치에서 실력을 쌓는 것이 좋습니다.' : '직장에서 인내심이 필요합니다. 준비를 철저히 하세요.',
      health: scores.health >= 80 ? '건강운이 좋습니다. 하지만 과신하지 말고 규칙적인 생활을 유지하세요.' : '건강 관리에 신경 써야 합니다. 정기 검진과 휴식을 챙기세요.'
    },
    coreMessage: {
      hook: concernMessages[user.currentConcern || 'none'],
      insight: `${user.name}님의 일간 ${saju.day.heavenlyStem}(${saju.day.stemKorean})은 ${saju.day.element === 'wood' ? '성장과 발전' : saju.day.element === 'fire' ? '열정과 표현' : saju.day.element === 'earth' ? '안정과 신뢰' : saju.day.element === 'metal' ? '결단과 정의' : '지혜와 유연함'}의 기운을 가지고 있습니다. 용신인 ${yongsin.map(e => ELEMENT_KOREAN[e]).join(', ')}를 보강하면 운세가 더욱 좋아집니다.`,
      urgency: '2026년 상반기가 특히 중요한 시기입니다. 미리 준비하세요.'
    },
    lifePath: `${saju.year.zodiac}띠로서 ${user.gender === 'male' ? '남성' : '여성'}의 기운이 있습니다. 30대 후반~40대에 큰 기회가 올 수 있으며, 꾸준한 노력이 결실을 맺는 시기입니다.`,
    luckyElements: `행운의 색상: ${yongsin.includes('wood') ? '초록색' : yongsin.includes('fire') ? '빨간색' : yongsin.includes('earth') ? '노란색' : yongsin.includes('metal') ? '흰색' : '검정색/파란색'}, 행운의 방향: ${yongsin.includes('wood') ? '동쪽' : yongsin.includes('fire') ? '남쪽' : yongsin.includes('earth') ? '중앙' : yongsin.includes('metal') ? '서쪽' : '북쪽'}, 행운의 숫자: ${Math.floor(Math.random() * 9) + 1}, ${Math.floor(Math.random() * 9) + 1}`,
    warningAdvice: `기신인 ${gisin.map(e => ELEMENT_KOREAN[e]).join(', ')}의 기운이 강한 시기나 장소는 피하는 것이 좋습니다.`
  };
}
