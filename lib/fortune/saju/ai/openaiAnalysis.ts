/**
 * OpenAI 기반 전문가 수준 사주 분석
 * 전통 사주 이론 (십신, 신살, 12운성, 합충형파해) 통합
 */

import OpenAI from 'openai';
import type { UserInput, SajuChart, OhengBalance, Element } from '@/types/saju';
import {
  analyzeSipsin,
  analyzeSinsal,
  analyzeUnsung,
  analyzeHapChung,
  interpretSipsinChart,
  transformToConsumerFriendlyRisk,
  analyzeRiskTiming,
  SIPSIN_INFO,
  type SipsinChart,
  type SipsinType,
  type SinsalAnalysis,
  type UnsungAnalysis,
  type HapChungAnalysis
} from '../analysis';

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

const ELEMENT_KOREAN: Record<string, string> = {
  wood: '목(木)', fire: '화(火)', earth: '토(土)', metal: '금(金)', water: '수(水)'
};

const STEM_MEANING: Record<string, string> = {
  '甲': '갑목(甲木) - 큰 나무, 대들보, 리더십과 추진력의 상징',
  '乙': '을목(乙木) - 풀과 덩굴, 유연성과 적응력의 상징',
  '丙': '병화(丙火) - 태양, 열정과 밝음의 상징',
  '丁': '정화(丁火) - 촛불과 등불, 섬세함과 따뜻함의 상징',
  '戊': '무토(戊土) - 큰 산, 안정과 신뢰의 상징',
  '己': '기토(己土) - 들판과 정원, 포용과 배려의 상징',
  '庚': '경금(庚金) - 바위와 쇠, 결단력과 정의의 상징',
  '辛': '신금(辛金) - 보석과 귀금속, 섬세함과 예리함의 상징',
  '壬': '임수(壬水) - 강과 바다, 지혜와 포용의 상징',
  '癸': '계수(癸水) - 이슬과 샘물, 직관과 감수성의 상징'
};

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
  // 새로운 전문가 분석
  dayMasterAnalysis: string;
  tenYearFortune: string;
  yearlyFortune: string;
  monthlyFortune: string;
  relationshipAnalysis: string;
  careerGuidance: string;
  wealthStrategy: string;
  healthAdvice: string;
  spiritualGuidance: string;
  actionPlan: string[];
}> {
  const { user, saju, oheng, yongsin, gisin, scores, dayMasterStrength } = context;

  const birthYear = parseInt(user.birthDate.split('-')[0]);
  const currentYear = new Date().getFullYear();
  const age = currentYear - birthYear + 1; // 한국 나이

  // ===== 전통 사주 분석 실행 =====
  const sipsinChart = analyzeSipsin(saju);
  const sipsinInterp = interpretSipsinChart(sipsinChart);
  const sinsalAnalysis = analyzeSinsal(saju);
  const unsungAnalysis = analyzeUnsung(saju);
  const hapchungAnalysis = analyzeHapChung(saju);

  // 전통 분석 데이터 포맷팅
  const traditionalAnalysis = formatTraditionalAnalysis(
    sipsinChart,
    sipsinInterp,
    sinsalAnalysis,
    unsungAnalysis,
    hapchungAnalysis
  );

  const systemPrompt = `당신은 40년 경력의 대한민국 최고 사주명리학 대가이자, 베스트셀러 운명학 작가입니다.
수많은 정재계 인사, 연예인, 기업인들의 사주를 봐온 전문가입니다.

## 스토리텔링 원칙 (중요!)
1. **후킹 기법**: 의뢰인의 가장 특징적인 면을 먼저 언급하여 공감을 이끌어내세요
   - 예: "책임감이 매우 강한 김형석님" / "섬세하면서도 추진력 있는 이수진님"
2. **대화체 서술**: 마치 눈앞에서 이야기하듯 자연스럽고 따뜻하게 말하세요
3. **시나리오 작가처럼**: 추상적 설명 대신 구체적 장면과 상황으로 묘사하세요
   - 나쁜 예: "금전운이 좋습니다"
   - 좋은 예: "올 하반기, 예상치 못한 곳에서 기회가 찾아옵니다. 평소 관심 두었던 분야에서 수익이 생길 조짐입니다."

## 분석 원칙
1. **구체성**: 추상적인 말 대신 구체적인 시기, 행동, 방향을 제시
2. **전문성**: 사주학적 용어와 원리를 바탕으로 한 논리적 해석
3. **실용성**: 즉시 실천 가능한 조언 제공
4. **개인화**: 의뢰인의 나이, 성별, 직업, 가정상황, 고민에 완전히 맞춤화된 해석
5. **균형**: 긍정적 측면과 주의점을 균형있게 제시

## 해석 깊이
- 일간(日干)의 특성과 주변 글자와의 관계를 세밀하게 분석
- 오행의 생극제화(生剋制化) 관계 해석
- 용신과 기신의 작용력 분석
- 대운과 세운의 흐름 파악
- 현재 시점에서의 운의 흐름과 전환점 제시

응답은 반드시 JSON 형식으로 제공하세요.`;

  // 결혼 상태 한글 변환
  const maritalStatusText: Record<string, string> = {
    'single': '미혼',
    'married': '기혼',
    'divorced': '이혼',
    'remarried': '재혼'
  };

  // 직급 한글 변환
  const careerLevelText: Record<string, string> = {
    'entry': '신입/사원급',
    'mid': '대리/과장급',
    'senior': '차장/부장급',
    'executive': '임원급'
  };

  // 관심사 한글 변환
  const interestText: Record<string, string> = {
    'career': '커리어/직장',
    'wealth': '재테크/투자',
    'love': '연애/결혼',
    'health': '건강/운동',
    'family': '가족관계',
    'study': '학업/자기계발',
    'business': '창업/사업',
    'relationship': '대인관계'
  };

  const userPrompt = `## 의뢰인 정보
- 성명: ${user.name}
- 성별: ${user.gender === 'male' ? '남성' : '여성'}
- 생년월일: ${user.birthDate} (만 ${currentYear - birthYear}세, 한국나이 ${age}세)
- 출생시: ${user.birthTime || '미상'}
- 역법: ${user.calendar === 'lunar' ? '음력' : '양력'}
- 현재 고민: ${user.currentConcern ? getConcernText(user.currentConcern) : '없음'}
- 직업/분야: ${user.careerType || '미입력'}
- 직급/경력: ${user.careerLevel ? careerLevelText[user.careerLevel] : '미입력'}${user.yearsExp ? ` (경력 ${user.yearsExp}년)` : ''}
- 결혼 상태: ${user.maritalStatus ? maritalStatusText[user.maritalStatus] : '미입력'}
- 자녀: ${user.hasChildren ? (user.childrenAges?.length ? `있음 (${user.childrenAges.join(', ')}세)` : '있음') : '없음/미입력'}
- 관심 분야: ${user.interests?.length ? user.interests.map(i => interestText[i] || i).join(', ') : '미입력'}
- MBTI: ${user.mbti || '미입력'}
- 혈액형: ${user.bloodType || '미입력'}

## 사주 원국 (四柱 原局)
┌──────┬──────┬──────┬──────┐
│ 시주 │ 일주 │ 월주 │ 년주 │
├──────┼──────┼──────┼──────┤
│ ${saju.time ? saju.time.heavenlyStem : '??'} │ ${saju.day.heavenlyStem} │ ${saju.month.heavenlyStem} │ ${saju.year.heavenlyStem} │ ← 천간
│ ${saju.time ? saju.time.earthlyBranch : '??'} │ ${saju.day.earthlyBranch} │ ${saju.month.earthlyBranch} │ ${saju.year.earthlyBranch} │ ← 지지
└──────┴──────┴──────┴──────┘

## 일간(日干) 정보
- 일간: ${saju.day.heavenlyStem} (${saju.day.stemKorean})
- 의미: ${STEM_MEANING[saju.day.heavenlyStem] || '분석 중'}
- 오행: ${ELEMENT_KOREAN[saju.day.element]}
- 일간 강약: ${dayMasterStrength === 'strong' ? '신강(身强) - 일간의 힘이 강함' : dayMasterStrength === 'weak' ? '신약(身弱) - 일간의 힘이 약함' : '중화(中和) - 균형 잡힌 상태'}

## 오행 분포
- 목(木): ${oheng.wood.toFixed(1)} ${getOhengLevel(oheng.wood)}
- 화(火): ${oheng.fire.toFixed(1)} ${getOhengLevel(oheng.fire)}
- 토(土): ${oheng.earth.toFixed(1)} ${getOhengLevel(oheng.earth)}
- 금(金): ${oheng.metal.toFixed(1)} ${getOhengLevel(oheng.metal)}
- 수(水): ${oheng.water.toFixed(1)} ${getOhengLevel(oheng.water)}

## 용신(用神) & 기신(忌神)
- 용신: ${yongsin.map(e => ELEMENT_KOREAN[e]).join(', ')} - 이 기운을 보강하면 운이 좋아집니다
- 기신: ${gisin.map(e => ELEMENT_KOREAN[e]).join(', ')} - 이 기운이 강해지면 주의가 필요합니다

## 기초 운세 점수 (100점 만점)
- 종합: ${scores.overall}점
- 재물: ${scores.wealth}점
- 애정: ${scores.love}점
- 직업: ${scores.career}점
- 건강: ${scores.health}점

${traditionalAnalysis}

## 현재 시점
- 2026년 병오(丙午)년
- ${age}세의 운

---

위 정보를 바탕으로 다음 JSON 형식으로 전문가 수준의 상세 분석을 제공해주세요:

{
  "personalityReading": "(먼저 '${user.name}님은 [특징적 성격]한 분이시네요.'로 시작. 일간 ${saju.day.heavenlyStem}의 본질적 특성을 의뢰인 상황에 맞춰 구체적으로. 마치 오랜 친구에게 말하듯 따뜻하게 5-6문장)",

  "dayMasterAnalysis": "(일주 ${saju.day.heavenlyStem}${saju.day.earthlyBranch}의 의미, 일간과 일지의 관계, 이 조합이 가진 특별한 의미를 4-5문장으로)",

  "tenYearFortune": "(현재 나이 ${age}세 기준 대운 분석. 지금이 어떤 대운 시기인지, 앞으로의 대운 흐름, 인생의 전환점 시기를 4-5문장으로)",

  "yearlyFortune": "(2026년 병오년 세운 분석. 올해 전체 운의 흐름, 좋은 시기와 조심할 시기, 핵심 키워드를 5-6문장으로)",

  "monthlyFortune": "(2026년 상반기 월별 운세 요약. 특히 좋은 달, 주의할 달, 중요한 시기를 3-4문장으로)",

  "relationshipAnalysis": "(대인관계와 인연 분석. ${user.maritalStatus === 'married' ? '배우자와의 관계, 가정 내 역할' : user.maritalStatus === 'single' ? '인연을 만날 시기와 이상적인 배우자상' : '현재 상황에 맞는 인간관계 조언'}. 어떤 사람과 잘 맞는지, 주의할 관계, 귀인의 특징을 4-5문장으로)",

  "careerGuidance": "(${user.careerType ? user.careerType + ' 분야에서의' : '직업/사업'}${user.careerLevel === 'entry' ? ' 신입으로서 성장 전략' : user.careerLevel === 'executive' ? ' 리더로서 경영/관리 전략' : ''} 구체적 방향성. ${user.yearsExp ? `경력 ${user.yearsExp}년차에 맞는 ` : ''}적합한 업종, 피해야 할 분야, 성공 전략을 5-6문장으로)",

  "wealthStrategy": "(재물운 상세 분석. 돈이 들어오는 방향, 투자 적기, 재물 관리 전략을 4-5문장으로)",

  "healthAdvice": "(건강 분석. 오행 불균형으로 인해 주의할 장기/질환, 건강 관리법을 3-4문장으로)",

  "spiritualGuidance": "(영적/정신적 조언. 마음가짐, 수양 방법, 개운법을 3-4문장으로)",

  "fortuneAdvice": {
    "overall": "(2026년 전체 운세 핵심 메시지. ${user.interests?.length ? user.interests.map(i => interestText[i] || i).join(', ') + ' 분야에 대한 운세 포함' : ''} 3-4문장)",
    "wealth": "(재물운 구체적 조언. ${user.careerLevel === 'executive' ? '경영자 관점의 투자/자산 관리' : '현 직급에 맞는 재테크 전략'} 행동 지침 3-4문장)",
    "love": "(${user.maritalStatus === 'married' ? '부부운/가정운' : user.maritalStatus === 'single' ? '연애운/결혼운' : '애정운'}${user.hasChildren ? ', 자녀운' : ''} 구체적 조언 3-4문장)",
    "career": "(직업/사업운. ${user.careerType || '현재 분야'}에서의 구체적 전략 3-4문장)",
    "health": "(건강운 주의사항과 관리법 2-3문장)"
  },

  "coreMessage": {
    "hook": "(${user.name}님의 사주에서 발견한 가장 중요한 메시지. 고민인 '${user.currentConcern || '없음'}'에 대한 사주적 답변. ${user.maritalStatus === 'married' ? '가정인으로서' : ''} ${user.hasChildren ? '부모로서' : ''} 강렬하고 공감가는 2-3문장)",
    "insight": "(사주가 말해주는 핵심 인사이트. ${user.name}님의 ${user.careerType || '직업'}, ${user.maritalStatus === 'married' ? '가정' : '인간관계'}, ${user.interests?.length ? user.interests[0] : '삶'} 분야를 위한 맞춤 조언 3-4문장)",
    "urgency": "(지금 ${age}세, 이 시기가 중요한 이유, 행동해야 하는 이유 1-2문장)"
  },

  "lifePath": "(인생 전체 흐름. 주요 전환점 시기, 대운의 변화, 노년운까지 4-5문장으로)",

  "luckyElements": "(구체적인 행운 요소들. 행운의 색상, 방위, 숫자, 요일, 시간대, 음식, 장소 등을 구체적으로)",

  "warningAdvice": "(반드시 주의해야 할 사항. 피해야 할 것들, 조심할 시기나 상황 2-3문장)",

  "actionPlan": [
    "(즉시 실천할 행동 1)",
    "(이번 달 안에 할 행동 2)",
    "(올해 안에 할 행동 3)",
    "(장기적으로 준비할 것 4)",
    "(반드시 피해야 할 것 5)"
  ]
}`;

  try {
    const response = await getOpenAIClient().chat.completions.create({
      model: 'gpt-4o',  // 더 강력한 모델 사용
      messages: [
        { role: 'system', content: systemPrompt },
        { role: 'user', content: userPrompt }
      ],
      temperature: 0.8,
      max_tokens: 4000,
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
    return generateFallbackAnalysis(context);
  }
}

function getConcernText(concern: string): string {
  const concerns: Record<string, string> = {
    money: '돈/재정 문제',
    career: '직장/커리어 고민',
    romance: '연애/결혼 문제',
    family: '가족 갈등',
    health: '건강 걱정',
    direction: '인생 방향 혼란',
    relationship: '인간관계 스트레스',
    none: '특별한 고민 없음'
  };
  return concerns[concern] || concern;
}

function getOhengLevel(value: number): string {
  if (value >= 3) return '(과다)';
  if (value >= 2) return '(강함)';
  if (value >= 1) return '(보통)';
  if (value > 0) return '(약함)';
  return '(없음)';
}

function generateFallbackAnalysis(context: SajuContext) {
  const { user, saju, scores, yongsin, gisin, dayMasterStrength, oheng } = context;

  const birthYear = parseInt(user.birthDate.split('-')[0]);
  const age = new Date().getFullYear() - birthYear + 1;

  return {
    personalityReading: `${user.name}님은 일간 ${saju.day.heavenlyStem}(${saju.day.stemKorean})의 기운을 타고나셨습니다. ${saju.day.element === 'wood' ? '나무처럼 성장을 추구하며 곧은 성품을 가지셨습니다.' : saju.day.element === 'fire' ? '불처럼 열정적이고 밝은 에너지를 가지셨습니다.' : saju.day.element === 'earth' ? '흙처럼 안정적이고 신뢰를 주는 성품입니다.' : saju.day.element === 'metal' ? '쇠처럼 결단력 있고 정의로운 성품입니다.' : '물처럼 지혜롭고 유연한 성품입니다.'} ${dayMasterStrength === 'strong' ? '신강한 사주로 자신감과 추진력이 강하나, 때로는 유연함이 필요합니다.' : dayMasterStrength === 'weak' ? '신약한 사주로 섬세하고 협조적이나, 때로는 결단력이 필요합니다.' : '균형 잡힌 사주로 상황에 따라 유연하게 대처할 수 있습니다.'}`,

    dayMasterAnalysis: `일주 ${saju.day.heavenlyStem}${saju.day.earthlyBranch}(${saju.day.stemKorean}${saju.day.branchKorean})은 ${STEM_MEANING[saju.day.heavenlyStem]?.split(' - ')[1] || '독특한 기운'}을 나타냅니다. 이 조합은 내면과 외면의 조화를 보여주며, ${user.gender === 'male' ? '남성' : '여성'}으로서의 삶에서 특별한 역할을 암시합니다.`,

    tenYearFortune: `현재 ${age}세로, ${Math.floor((age - 1) / 10) * 10 + 1}세부터 시작된 대운의 영향 아래 있습니다. ${dayMasterStrength === 'strong' ? '현재 대운에서는 조금 쉬어가며 내실을 다지는 것이 좋습니다.' : '현재 대운에서는 적극적으로 기회를 잡아야 합니다.'} 다음 전환점은 ${Math.ceil(age / 10) * 10 + 1}세 전후로 예상됩니다.`,

    yearlyFortune: `2026년 병오(丙午)년은 화(火) 기운이 강한 해입니다. ${yongsin.includes('fire') ? '용신인 화의 기운이 들어오니 전반적으로 운이 상승하는 해입니다.' : gisin.includes('fire') ? '기신인 화의 기운이 강하니 감정 조절과 인내가 필요한 해입니다.' : '화의 기운을 적절히 활용하면 좋은 성과를 얻을 수 있습니다.'} 상반기에 중요한 결정을, 하반기에는 실행에 집중하세요.`,

    monthlyFortune: `2026년 상반기 중 ${scores.overall >= 75 ? '3월과 5월이 특히 좋습니다.' : '4월과 6월에 좋은 기회가 있습니다.'} ${scores.wealth >= 70 ? '재물운은 2월과 4월에 상승합니다.' : '재물 관련해서는 신중한 접근이 필요합니다.'}`,

    relationshipAnalysis: `${user.name}님에게 맞는 사람은 ${yongsin.map(e => ELEMENT_KOREAN[e]).join(', ')} 기운이 강한 사람입니다. ${user.gender === 'male' ? '배우자궁' : '배우자궁'}에서 ${saju.day.element === 'wood' || saju.day.element === 'fire' ? '활발하고 적극적인' : '차분하고 안정적인'} 인연이 좋습니다.`,

    careerGuidance: `${user.careerType ? `${user.careerType} 분야는 ` : '직업적으로 '}${yongsin.includes('wood') ? '성장과 창의성이 필요한 분야' : yongsin.includes('fire') ? '소통과 표현이 중요한 분야' : yongsin.includes('earth') ? '안정적이고 신뢰가 중요한 분야' : yongsin.includes('metal') ? '정밀함과 결단력이 필요한 분야' : '유연성과 지혜가 필요한 분야'}에서 성공 가능성이 높습니다. ${dayMasterStrength === 'strong' ? '독립적인 사업이나 리더 역할이 적합합니다.' : '협력과 파트너십을 통한 성장이 좋습니다.'}`,

    wealthStrategy: `재물운에서 ${yongsin.includes('metal') ? '금 기운을 활용하세요. 서쪽 방향이나 금융 관련 분야에서 기회가 있습니다.' : yongsin.includes('water') ? '수 기운을 활용하세요. 유동적인 자산 관리와 북쪽 방향이 좋습니다.' : '꾸준한 저축과 안정적인 투자가 좋습니다.'} ${scores.wealth >= 80 ? '올해는 투자에 좋은 시기입니다.' : '올해는 지키는 재테크에 집중하세요.'}`,

    healthAdvice: `오행 분포를 보면 ${oheng.wood < 1 ? '목 기운이 부족하여 간, 담, 눈 건강에 주의가 필요합니다.' : oheng.fire < 1 ? '화 기운이 부족하여 심장, 혈액순환에 주의가 필요합니다.' : oheng.earth < 1 ? '토 기운이 부족하여 위장, 소화기 건강에 주의가 필요합니다.' : oheng.metal < 1 ? '금 기운이 부족하여 폐, 호흡기, 피부 건강에 주의가 필요합니다.' : oheng.water < 1 ? '수 기운이 부족하여 신장, 방광, 귀 건강에 주의가 필요합니다.' : '전반적으로 균형 잡힌 건강 상태입니다.'} 규칙적인 운동과 충분한 휴식이 중요합니다.`,

    spiritualGuidance: `${user.name}님의 사주에서 가장 중요한 것은 ${dayMasterStrength === 'strong' ? '겸손과 유연함을 기르는 것입니다. 명상이나 요가가 도움됩니다.' : '자신감과 결단력을 기르는 것입니다. 목표 설정과 작은 성공 경험이 도움됩니다.'} 용신인 ${yongsin.map(e => ELEMENT_KOREAN[e]).join(', ')} 기운과 관련된 활동이 개운에 좋습니다.`,

    fortuneAdvice: {
      overall: `2026년은 ${user.name}님에게 ${scores.overall >= 80 ? '도약의 해입니다. 적극적으로 기회를 잡으세요.' : scores.overall >= 70 ? '안정적인 성장의 해입니다. 꾸준히 노력하면 좋은 결과가 있습니다.' : '내실을 다지는 해입니다. 무리한 확장보다는 기반을 다지세요.'} 용신인 ${yongsin.map(e => ELEMENT_KOREAN[e]).join(', ')} 기운을 적극 활용하세요.`,
      wealth: scores.wealth >= 80 ? '재물운이 좋습니다. 새로운 수입원을 만들거나 투자를 고려해볼 만합니다. 단, 과욕은 금물입니다.' : scores.wealth >= 60 ? '안정적인 재정 관리가 필요합니다. 큰 지출이나 투자는 신중하게 결정하세요.' : '재물 관련해서 보수적인 접근이 필요합니다. 저축에 집중하고 불필요한 지출을 줄이세요.',
      love: scores.love >= 80 ? '인간관계와 애정운이 좋습니다. 새로운 만남이나 관계 발전의 기회가 있습니다. 적극적으로 다가가세요.' : scores.love >= 60 ? '현재 관계에 집중하고 소통을 강화하세요. 오해가 생기기 쉬우니 표현을 명확히 하세요.' : '인간관계에서 인내가 필요합니다. 감정적인 결정은 피하고, 시간을 갖고 천천히 풀어가세요.',
      career: scores.career >= 80 ? '직업운이 상승합니다. 승진, 이직, 사업 확장 등 좋은 기회가 올 수 있습니다. 준비된 자에게 행운이 옵니다.' : scores.career >= 60 ? '현재 위치에서 실력을 쌓는 것이 좋습니다. 급격한 변화보다는 점진적인 발전을 추구하세요.' : '직장에서 인내심이 필요합니다. 갈등 상황에서는 한 발 물러서서 상황을 보세요.',
      health: scores.health >= 80 ? '건강운이 좋습니다. 하지만 과신은 금물, 규칙적인 생활과 정기 검진을 유지하세요.' : '건강 관리에 더 신경 써야 합니다. 과로를 피하고 충분한 휴식을 취하세요. 정기 검진을 권합니다.'
    },

    coreMessage: {
      hook: `${user.name}님, ${user.currentConcern === 'money' ? '재물에 대한 고민이 있으시군요. 사주를 보니 돈복은 있으나 시기가 중요합니다.' : user.currentConcern === 'career' ? '직업에 대한 고민이 있으시군요. 당신의 사주는 특정 분야에서 큰 성공을 암시합니다.' : user.currentConcern === 'romance' ? '사랑에 대한 고민이 있으시군요. 좋은 인연이 다가오고 있습니다.' : user.currentConcern === 'health' ? '건강이 걱정되시는군요. 사주에서 주의해야 할 점을 알려드리겠습니다.' : user.currentConcern === 'direction' ? '인생의 방향에 대한 고민이 있으시군요. 사주가 그 답을 가지고 있습니다.' : '사주에서 중요한 메시지가 있습니다.'}`,
      insight: `${user.name}님의 일간 ${saju.day.heavenlyStem}은 ${saju.day.element === 'wood' ? '성장과 발전' : saju.day.element === 'fire' ? '열정과 표현' : saju.day.element === 'earth' ? '안정과 신뢰' : saju.day.element === 'metal' ? '결단과 정의' : '지혜와 유연함'}의 기운입니다. 용신인 ${yongsin.map(e => ELEMENT_KOREAN[e]).join(', ')}를 보강하면 운이 크게 상승합니다. ${dayMasterStrength === 'strong' ? '강한 기운을 가지고 있으니 리더십을 발휘할 기회를 잡으세요.' : '섬세한 기운을 가지고 있으니 협력과 조화를 통해 성장하세요.'}`,
      urgency: '2026년 상반기가 특히 중요한 시기입니다. 이 기간에 기반을 다지면 하반기와 내년에 큰 결실을 볼 수 있습니다.'
    },

    lifePath: `${user.name}님은 ${saju.year.zodiac}띠로서 ${age}세인 지금 ${Math.floor((age - 1) / 10) + 1}번째 대운을 지나고 있습니다. ${age < 30 ? '젊은 시기에 기반을 다지면 30대 중반 이후 크게 도약할 수 있습니다.' : age < 45 ? '인생의 황금기에 접어들고 있습니다. 이 시기에 큰 결정을 하면 좋은 결과가 있습니다.' : age < 60 ? '안정과 결실의 시기입니다. 지금까지의 노력이 빛을 발할 때입니다.' : '지혜와 경험을 바탕으로 후반생을 풍요롭게 만들 수 있습니다.'}`,

    luckyElements: `행운의 색상: ${yongsin.includes('wood') ? '초록색, 청록색' : yongsin.includes('fire') ? '빨간색, 주황색' : yongsin.includes('earth') ? '노란색, 베이지색' : yongsin.includes('metal') ? '흰색, 금색, 은색' : '검정색, 파란색, 남색'}. 행운의 방향: ${yongsin.includes('wood') ? '동쪽' : yongsin.includes('fire') ? '남쪽' : yongsin.includes('earth') ? '중앙, 남서쪽' : yongsin.includes('metal') ? '서쪽' : '북쪽'}. 행운의 숫자: ${yongsin.includes('wood') ? '3, 8' : yongsin.includes('fire') ? '2, 7' : yongsin.includes('earth') ? '5, 10' : yongsin.includes('metal') ? '4, 9' : '1, 6'}. 행운의 요일: ${yongsin.includes('wood') ? '목요일' : yongsin.includes('fire') ? '화요일' : yongsin.includes('earth') ? '토요일' : yongsin.includes('metal') ? '금요일' : '수요일'}.`,

    warningAdvice: `기신인 ${gisin.map(e => ELEMENT_KOREAN[e]).join(', ')} 기운이 강한 시기나 장소는 주의가 필요합니다. ${gisin.includes('wood') ? '봄철이나 동쪽 방향에서 큰 결정은 피하세요.' : gisin.includes('fire') ? '여름철이나 남쪽 방향에서 감정적 결정은 피하세요.' : gisin.includes('earth') ? '환절기에 건강 관리에 특히 주의하세요.' : gisin.includes('metal') ? '가을철에 금전 관련 큰 결정은 신중하게.' : '겨울철에 건강과 안전에 주의하세요.'}`,

    actionPlan: [
      `용신인 ${yongsin.map(e => ELEMENT_KOREAN[e]).join(', ')} 기운을 보강하는 활동을 시작하세요`,
      `${scores.career >= 70 ? '커리어 관련 새로운 도전을 계획하세요' : '현재 업무에서 실력을 쌓는 데 집중하세요'}`,
      `${scores.wealth >= 70 ? '재테크나 부업을 고려해보세요' : '불필요한 지출을 점검하고 저축 계획을 세우세요'}`,
      `건강을 위해 ${oheng.water < 1 ? '수분 섭취와 신장 건강' : oheng.fire < 1 ? '혈액순환과 심장 건강' : '규칙적인 운동'}에 신경 쓰세요`,
      `기신인 ${gisin.map(e => ELEMENT_KOREAN[e]).join(', ')} 관련 상황에서는 큰 결정을 피하세요`
    ]
  };
}

/**
 * 전통 사주 분석 데이터를 프롬프트용 텍스트로 포맷팅
 */
function formatTraditionalAnalysis(
  sipsinChart: SipsinChart,
  sipsinInterp: ReturnType<typeof interpretSipsinChart>,
  sinsalAnalysis: SinsalAnalysis,
  unsungAnalysis: UnsungAnalysis,
  hapchungAnalysis: HapChungAnalysis
): string {
  let text = '';

  // 십신 타입을 한글로 변환하는 헬퍼 함수
  const toKorean = (type: SipsinType): string => SIPSIN_INFO[type]?.korean || type;

  // 1. 십신(十神) 분석
  text += `## 십신(十神) 분석
사주에 나타난 십신 관계:
- 년주 십신: ${toKorean(sipsinChart.yearStem)} (천간) / ${toKorean(sipsinChart.yearBranch)} (지지)
- 월주 십신: ${toKorean(sipsinChart.monthStem)} (천간) / ${toKorean(sipsinChart.monthBranch)} (지지)
- 일주 십신: ${toKorean(sipsinChart.dayStem)} (천간) / ${toKorean(sipsinChart.dayBranch)} (지지)
- 시주 십신: ${sipsinChart.hourStem ? toKorean(sipsinChart.hourStem) : '미상'} (천간) / ${sipsinChart.hourBranch ? toKorean(sipsinChart.hourBranch) : '미상'} (지지)

십신 분포:
${Object.entries(sipsinChart.distribution).filter(([_, count]) => count > 0).map(([type, count]) => `- ${toKorean(type as SipsinType)}: ${count}개`).join('\n') || '- 분석 중'}

주요 특성:
- 우세 십신: ${sipsinInterp.dominant.length > 0 ? sipsinInterp.dominant.map(d => toKorean(d)).join(', ') : '특정 우세 없음'}
- 부족 십신: ${sipsinInterp.missing.length > 0 ? sipsinInterp.missing.map(m => toKorean(m)).join(', ') : '특정 부족 없음'}
- 균형: ${sipsinInterp.balance}
- 성격: ${sipsinInterp.personality}
- 직업 적성: ${sipsinInterp.career}
- 조언: ${sipsinInterp.advice}

`;

  // 2. 신살(神殺) 분석
  const hasGilsin = sinsalAnalysis.gilsin.filter(s => s.present).length > 0;
  const hasHyungsal = sinsalAnalysis.hyungsal.filter(s => s.present).length > 0;
  const hasTeuksu = sinsalAnalysis.teuksuSal.filter(s => s.present).length > 0;

  if (hasGilsin || hasHyungsal || hasTeuksu) {
    text += `## 신살(神殺) 분석
`;
    if (hasGilsin) {
      text += `길신(吉神):
${sinsalAnalysis.gilsin.filter(s => s.present).slice(0, 4).map(s => `- ${s.info.korean}(${s.info.hanja})${s.location ? ` [${s.location}]` : ''}: ${s.info.description} → ${s.info.effect}`).join('\n')}
`;
    }
    if (hasTeuksu) {
      text += `특수살(特殊殺):
${sinsalAnalysis.teuksuSal.filter(s => s.present).slice(0, 3).map(s => `- ${s.info.korean}(${s.info.hanja})${s.location ? ` [${s.location}]` : ''}: ${s.info.description} → ${s.info.effect}`).join('\n')}
`;
    }
    if (hasHyungsal) {
      text += `흉살(凶殺):
${sinsalAnalysis.hyungsal.filter(s => s.present).slice(0, 3).map(s => `- ${s.info.korean}(${s.info.hanja})${s.location ? ` [${s.location}]` : ''}: ${s.info.description} → 주의: ${s.info.effect}${s.info.remedy ? `, 해소법: ${s.info.remedy}` : ''}`).join('\n')}
`;
    }
    text += `
신살 종합: ${sinsalAnalysis.summary}
${sinsalAnalysis.advice.length > 0 ? `조언: ${sinsalAnalysis.advice.slice(0, 2).join(' ')}` : ''}

`;
  }

  // 3. 12운성 분석
  text += `## 12운성(十二運星) 분석
각 지지의 운성 상태:
${unsungAnalysis.positions.map(p => `- ${p.pillar} ${p.branch}: ${p.info.korean}(${p.info.hanja}) [에너지 ${p.info.energyLevel}/10] - ${p.info.description}`).join('\n')}

현재 생애 주기: ${unsungAnalysis.dominantStage}
평균 에너지: ${unsungAnalysis.averageEnergy.toFixed(1)}점
최고 에너지: ${unsungAnalysis.peakPosition.pillar} (${unsungAnalysis.peakPosition.info.korean})
최저 에너지: ${unsungAnalysis.lowestPosition.pillar} (${unsungAnalysis.lowestPosition.info.korean})

12운성 종합: ${unsungAnalysis.lifeCycleSummary}

`;

  // 4. 관계·계약·이동 리스크 분석 (합충형파해 소비자 친화적 변환)
  const consumerRisks = transformToConsumerFriendlyRisk(hapchungAnalysis);

  text += `## 관계·계약·이동 리스크 분석
조화 점수: ${hapchungAnalysis.harmonyScore}점 / 100점

`;

  // 기회·연결 (합)
  const opportunities = consumerRisks.filter(r => r.type === '기회·연결');
  if (opportunities.length > 0) {
    text += `🌟 기회·연결 (인복/협력 운):
${opportunities.slice(0, 3).map(r => `- ${r.description}\n  💡 ${r.actionTip}`).join('\n')}

`;
  }

  // 변화·이동 (충)
  const changes = consumerRisks.filter(r => r.type === '변화·이동');
  if (changes.length > 0) {
    text += `🔄 변화·이동 (이직/이사 시기):
${changes.slice(0, 2).map(r => `- ${r.description}\n  ⚠️ ${r.actionTip}`).join('\n')}

`;
  }

  // 스트레스·자기압박 (형)
  const stress = consumerRisks.filter(r => r.type === '스트레스·자기압박');
  if (stress.length > 0) {
    text += `⚡ 스트레스·자기압박 (번아웃 주의):
${stress.slice(0, 2).map(r => `- ${r.description}\n  🧘 ${r.actionTip}`).join('\n')}

`;
  }

  // 관계 오해·계약 파손 (파/해)
  const relationRisks = consumerRisks.filter(r => r.type === '관계 오해·계약 파손');
  if (relationRisks.length > 0) {
    text += `💔 관계 오해·계약 파손 (소통/서류 주의):
${relationRisks.slice(0, 2).map(r => `- ${r.description}\n  📋 ${r.actionTip}`).join('\n')}

`;
  }

  if (consumerRisks.length === 0) {
    text += `✨ 특별한 리스크 없이 안정적인 사주입니다.

`;
  }

  text += `
종합 해석: ${hapchungAnalysis.summary}
${hapchungAnalysis.advice.length > 0 ? `활용 조언: ${hapchungAnalysis.advice.slice(0, 2).join(' ')}` : ''}
`;

  return text;
}
