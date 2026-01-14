/**
 * 사주 분석 결과 음성 나레이션 생성기
 *
 * TTS(Text-to-Speech) 서비스를 사용하여 음성 파일 생성
 * 지원 서비스: Google Cloud TTS, Naver Clova, OpenAI TTS
 */

import type {
  UserInput,
  SajuChart,
  OhengBalance,
  PremiumContent,
  MonthlyAction,
  Element
} from '@/types/saju';
import { ELEMENT_KOREAN, CAREER_KOREAN } from '@/types/saju';

// TTS 제공자 타입
export type TTSProvider = 'google' | 'naver' | 'openai';

interface TTSConfig {
  provider: TTSProvider;
  apiKey?: string;
  voiceId?: string;
  speed?: number;
  pitch?: number;
}

interface AudioGeneratorOptions {
  user: UserInput;
  saju: SajuChart;
  oheng: OhengBalance;
  yongsin?: Element[];
  gisin?: Element[];
  premium?: PremiumContent;
  targetYear?: number;
  config?: TTSConfig;
}

interface NarrationScript {
  sections: NarrationSection[];
  totalDuration: number; // 예상 시간 (초)
}

interface NarrationSection {
  title: string;
  content: string;
  pauseAfter: number; // ms
}

/**
 * 나레이션 스크립트 생성
 */
export function generateNarrationScript(options: AudioGeneratorOptions): NarrationScript {
  const { user, saju, oheng, yongsin, gisin, premium, targetYear = 2026 } = options;
  const sections: NarrationSection[] = [];

  // 오프닝
  sections.push({
    title: '오프닝',
    content: `안녕하세요, ${user.name}님. ${targetYear}년 사주 분석 리포트를 시작하겠습니다. ` +
             `${user.name}님은 ${user.birthDate} ${user.gender === 'male' ? '남성' : '여성'}으로, ` +
             `출생 시간은 ${user.birthTime || '미상'}입니다.`,
    pauseAfter: 1500
  });

  // 사주팔자 설명
  const pillarsText = getSajuDescription(saju, user.name);
  sections.push({
    title: '사주팔자',
    content: `먼저 ${user.name}님의 사주팔자를 살펴보겠습니다. ${pillarsText}`,
    pauseAfter: 1000
  });

  // 오행 분석
  const ohengText = getOhengDescription(oheng, yongsin, gisin);
  sections.push({
    title: '오행 분석',
    content: `오행 분석 결과입니다. ${ohengText}`,
    pauseAfter: 1000
  });

  // 프리미엄 콘텐츠
  if (premium) {
    // 가족 분석
    if (premium.familyImpact) {
      const familyText = getFamilyDescription(premium.familyImpact);
      sections.push({
        title: '가족 관계',
        content: `가족 관계 분석입니다. ${familyText}`,
        pauseAfter: 1000
      });
    }

    // 직업 분석
    if (premium.careerAnalysis) {
      const careerText = getCareerDescription(premium.careerAnalysis, user);
      sections.push({
        title: '직업 분석',
        content: `커리어 분석입니다. ${careerText}`,
        pauseAfter: 1000
      });
    }

    // 월별 운세 (하이라이트만)
    if (premium.monthlyActionPlan?.length) {
      const monthlyText = getMonthlyHighlights(premium.monthlyActionPlan, targetYear);
      sections.push({
        title: '월별 운세',
        content: `${targetYear}년 월별 운세 하이라이트입니다. ${monthlyText}`,
        pauseAfter: 1000
      });
    }

    // 타이밍 분석
    if (premium.timingAnalysis) {
      const timingText = getTimingDescription(premium.timingAnalysis);
      sections.push({
        title: '타이밍 분석',
        content: `중요한 타이밍 분석입니다. ${timingText}`,
        pauseAfter: 1000
      });
    }
  }

  // 클로징
  sections.push({
    title: '마무리',
    content: `이상으로 ${user.name}님의 ${targetYear}년 사주 분석을 마치겠습니다. ` +
             `운명은 정해진 것이 아닙니다. 자신의 선택과 노력으로 더 나은 미래를 만들어 가세요. ` +
             `더 자세한 분석이 필요하시면 프리미엄 서비스를 이용해 주세요. 감사합니다.`,
    pauseAfter: 0
  });

  // 예상 시간 계산 (한글 약 4~5글자/초)
  const totalChars = sections.reduce((sum, s) => sum + s.content.length, 0);
  const totalDuration = Math.ceil(totalChars / 4.5);

  return { sections, totalDuration };
}

/**
 * 나레이션을 단일 텍스트로 변환
 */
export function narrationToText(script: NarrationScript): string {
  return script.sections.map(s => s.content).join('\n\n');
}

/**
 * OpenAI TTS API를 사용한 음성 생성
 */
export async function generateAudioWithOpenAI(
  text: string,
  apiKey: string,
  voice: string = 'nova'
): Promise<Buffer> {
  const response = await fetch('https://api.openai.com/v1/audio/speech', {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${apiKey}`,
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      model: 'tts-1-hd',
      input: text,
      voice: voice, // alloy, echo, fable, onyx, nova, shimmer
      response_format: 'mp3',
      speed: 1.0
    })
  });

  if (!response.ok) {
    const error = await response.text();
    throw new Error(`OpenAI TTS Error: ${error}`);
  }

  const arrayBuffer = await response.arrayBuffer();
  return Buffer.from(arrayBuffer);
}

/**
 * Google Cloud TTS API를 사용한 음성 생성
 */
export async function generateAudioWithGoogle(
  text: string,
  apiKey: string,
  languageCode: string = 'ko-KR',
  voiceName: string = 'ko-KR-Wavenet-A'
): Promise<Buffer> {
  const response = await fetch(
    `https://texttospeech.googleapis.com/v1/text:synthesize?key=${apiKey}`,
    {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        input: { text },
        voice: {
          languageCode,
          name: voiceName
        },
        audioConfig: {
          audioEncoding: 'MP3',
          speakingRate: 1.0,
          pitch: 0
        }
      })
    }
  );

  if (!response.ok) {
    const error = await response.text();
    throw new Error(`Google TTS Error: ${error}`);
  }

  const data = await response.json();
  return Buffer.from(data.audioContent, 'base64');
}

/**
 * Naver Clova TTS API를 사용한 음성 생성
 */
export async function generateAudioWithNaver(
  text: string,
  clientId: string,
  clientSecret: string,
  speaker: string = 'nara' // nara, njinho, nhajun, ndain, etc.
): Promise<Buffer> {
  const response = await fetch('https://naveropenapi.apigw.ntruss.com/tts-premium/v1/tts', {
    method: 'POST',
    headers: {
      'X-NCP-APIGW-API-KEY-ID': clientId,
      'X-NCP-APIGW-API-KEY': clientSecret,
      'Content-Type': 'application/x-www-form-urlencoded'
    },
    body: new URLSearchParams({
      speaker,
      text,
      volume: '0',
      speed: '0',
      pitch: '0',
      format: 'mp3'
    })
  });

  if (!response.ok) {
    const error = await response.text();
    throw new Error(`Naver TTS Error: ${error}`);
  }

  const arrayBuffer = await response.arrayBuffer();
  return Buffer.from(arrayBuffer);
}

/**
 * 통합 음성 생성 함수
 */
export async function generateSajuAudio(options: AudioGeneratorOptions): Promise<Buffer> {
  const script = generateNarrationScript(options);
  const fullText = narrationToText(script);

  const config = options.config || { provider: 'openai' as TTSProvider };

  switch (config.provider) {
    case 'openai':
      if (!config.apiKey) throw new Error('OpenAI API key required');
      return generateAudioWithOpenAI(fullText, config.apiKey, config.voiceId || 'nova');

    case 'google':
      if (!config.apiKey) throw new Error('Google API key required');
      return generateAudioWithGoogle(fullText, config.apiKey);

    case 'naver':
      // Naver는 clientId/clientSecret 필요
      throw new Error('Naver TTS requires separate client ID and secret');

    default:
      throw new Error(`Unknown TTS provider: ${config.provider}`);
  }
}

/**
 * 음성 파일명 생성
 */
export function generateAudioFilename(user: UserInput, targetYear: number = 2026): string {
  const date = new Date().toISOString().split('T')[0];
  const safeName = user.name.replace(/[^가-힣a-zA-Z0-9]/g, '');
  return `사주분석_음성_${safeName}_${targetYear}년_${date}.mp3`;
}

// ========== 헬퍼 함수들 ==========

function getSajuDescription(saju: SajuChart, userName: string): string {
  const parts: string[] = [];

  if (saju.year) {
    parts.push(`년주는 ${saju.year.heavenlyStem}${saju.year.earthlyBranch}로, ${saju.year.zodiac || ''}띠입니다`);
  }
  if (saju.month) {
    parts.push(`월주는 ${saju.month.heavenlyStem}${saju.month.earthlyBranch}입니다`);
  }
  if (saju.day) {
    parts.push(`일주는 ${saju.day.heavenlyStem}${saju.day.earthlyBranch}로, 이것이 ${userName}님의 본명입니다`);
  }
  if (saju.time) {
    parts.push(`시주는 ${saju.time.heavenlyStem}${saju.time.earthlyBranch}입니다`);
  }

  return parts.join('. ') + '.';
}

function getOhengDescription(
  oheng: OhengBalance,
  yongsin?: Element[],
  gisin?: Element[]
): string {
  const parts: string[] = [];

  // 오행 분포
  const elements = [
    { name: '목', value: oheng.wood },
    { name: '화', value: oheng.fire },
    { name: '토', value: oheng.earth },
    { name: '금', value: oheng.metal },
    { name: '수', value: oheng.water }
  ].sort((a, b) => (b.value || 0) - (a.value || 0));

  parts.push(`오행 중 ${elements[0].name}의 기운이 ${elements[0].value?.toFixed(0)}%로 가장 강하고, ` +
             `${elements[4].name}의 기운이 ${elements[4].value?.toFixed(0)}%로 가장 약합니다`);

  if (yongsin?.length) {
    const yongsinKo = yongsin.map(e => ELEMENT_KOREAN[e]).join(', ');
    parts.push(`용신, 즉 도움이 되는 기운은 ${yongsinKo}입니다`);
  }

  if (gisin?.length) {
    const gisinKo = gisin.map(e => ELEMENT_KOREAN[e]).join(', ');
    parts.push(`기신, 즉 피해야 할 기운은 ${gisinKo}입니다`);
  }

  return parts.join('. ') + '.';
}

function getFamilyDescription(family: {
  spouseStress: 'low' | 'medium' | 'high';
  childrenImpact: 'positive' | 'neutral' | 'negative';
  parentCare: string;
  recommendations?: string[];
  financialTimeline?: { year: number; event: string; impact: string }[];
}): string {
  const parts: string[] = [];

  const stressLevel = family.spouseStress === 'low' ? '낮은' : family.spouseStress === 'medium' ? '보통의' : '높은';
  parts.push(`배우자와의 관계에서 ${stressLevel} 스트레스가 예상됩니다`);

  const childImpact = family.childrenImpact === 'positive' ? '긍정적인' : family.childrenImpact === 'neutral' ? '중립적인' : '주의가 필요한';
  parts.push(`자녀 관계는 ${childImpact} 영향이 있습니다`);

  if (family.parentCare) {
    parts.push(`부모님 돌봄: ${family.parentCare}`);
  }

  return parts.join('. ') + '.';
}

function getCareerDescription(
  career: {
    matchScore: number;
    synergy?: string[];
    optimalDirection: string;
  },
  user: UserInput
): string {
  const parts: string[] = [];

  if (user.careerType && career.matchScore) {
    const careerName = CAREER_KOREAN[user.careerType] || user.careerType;
    parts.push(`현재 ${careerName} 직종과의 적합도는 ${career.matchScore}점입니다`);
  }

  if (career.synergy?.length) {
    parts.push(`직업적 시너지는 ${career.synergy.slice(0, 2).join(', ')}입니다`);
  }

  if (career.optimalDirection) {
    parts.push(`최적 방향은 ${career.optimalDirection}입니다`);
  }

  return parts.join('. ') + '.';
}

function getMonthlyHighlights(monthlyPlan: MonthlyAction[], year: number): string {
  const parts: string[] = [];

  // 최고의 달 찾기
  const sortedMonths = [...monthlyPlan].sort((a, b) => (b.score || 0) - (a.score || 0));
  const bestMonth = sortedMonths[0];
  const worstMonth = sortedMonths[sortedMonths.length - 1];

  if (bestMonth) {
    parts.push(`${year}년 최고의 달은 ${bestMonth.monthName}로, 점수는 ${bestMonth.score}점입니다`);
  }

  if (worstMonth) {
    parts.push(`주의가 필요한 달은 ${worstMonth.monthName}입니다. 신중한 판단이 필요합니다`);
  }

  return parts.join('. ') + '.';
}

function getTimingDescription(timing: {
  currentWindow: {
    isOpen: boolean;
    remainingDays: number;
    missedConsequence: string;
    recoveryTime: string;
  };
  nextOpportunity: {
    date: string;
    probability: number;
  };
}): string {
  const parts: string[] = [];

  if (timing.currentWindow.isOpen) {
    parts.push(`현재 기회의 창이 열려 있으며, ${timing.currentWindow.remainingDays}일 남았습니다`);
  } else {
    parts.push(`현재 기회의 창은 닫혀 있습니다`);
  }

  parts.push(`다음 기회는 ${timing.nextOpportunity.date}이며, 성공 확률은 ${timing.nextOpportunity.probability}%입니다`);

  return parts.join('. ') + '.';
}

export default {
  generateNarrationScript,
  narrationToText,
  generateSajuAudio,
  generateAudioFilename,
  generateAudioWithOpenAI,
  generateAudioWithGoogle,
  generateAudioWithNaver
};
