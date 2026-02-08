/**
 * 관상학 스토리텔링 생성기
 * - 이야기 형식의 관상 해석
 * - 음성(TTS)용 스크립트 생성
 * - 호기심 유발 및 만족도 향상 전략
 */

import {
  FacePartType,
  FacePartAnalysis,
  FACE_PART_KOREAN,
  getGradeFromScore,
} from '@/types/face';

interface StorytellingResult {
  opening: string;
  featureStory: string;
  fortuneNarrative: string;
  closingAdvice: string;
  fullScript: string;
}

// ===== 도입부 템플릿 =====
const OPENING_TEMPLATES = [
  '당신의 얼굴에는 하늘이 내려준 특별한 기운이 담겨 있습니다.',
  '관상학에서 말하는 "복상"의 징후가 당신의 얼굴 곳곳에 숨어 있습니다.',
  '수천 년 동양 지혜의 렌즈로 당신을 바라보니, 놀라운 이야기가 보입니다.',
  '당신의 관상 속에는 성공과 행복의 씨앗이 이미 심어져 있습니다.',
  '옛 명리학자들이 보았다면 고개를 끄덕였을, 그런 관상입니다.',
];

const SCORE_BASED_OPENINGS: Record<string, string[]> = {
  S: [
    '놀랍습니다! 관상학적으로 매우 특별한 상을 가지고 계십니다.',
    '천 년에 한 번 나올까 말까 한 복상의 징후가 보입니다.',
    '당신의 관상은 마치 대자연이 빚어낸 명작과 같습니다.',
  ],
  A: [
    '좋은 관상입니다. 타고난 복과 재능이 얼굴 곳곳에 드러나 있습니다.',
    '관상학적으로 상위 20%에 드는 좋은 상을 가지고 계십니다.',
    '뚜렷한 성공의 징조가 당신의 얼굴에 새겨져 있습니다.',
  ],
  B: [
    '균형 잡힌 관상입니다. 큰 파란 없이 꾸준한 발전이 예상됩니다.',
    '안정적이면서도 성장의 가능성이 열려 있는 상입니다.',
    '노력에 따라 크게 발전할 수 있는 잠재력을 가진 관상입니다.',
  ],
  C: [
    '평범함 속에 숨겨진 가능성이 보입니다.',
    '겉으로 드러나지 않는 내면의 힘이 있는 상입니다.',
    '때를 기다리면 빛을 발할 잠재력을 품고 있습니다.',
  ],
  D: [
    '도전이 있지만, 그것이 오히려 성장의 발판이 될 수 있습니다.',
    '관상은 변할 수 있습니다. 마음과 행동이 얼굴을 바꿉니다.',
    '노력과 덕을 쌓으면 관상도 따라서 좋아지는 법입니다.',
  ],
};

// ===== 부위 연결 스토리 템플릿 =====
function generateFeatureConnectionStory(
  features: Record<FacePartType, FacePartAnalysis>,
  strengths: FacePartAnalysis[],
  improvements: FacePartAnalysis[]
): string {
  const parts: string[] = [];

  // 강점 부위 스토리
  if (strengths.length > 0) {
    const strengthNames = strengths.map(s => s.partKorean).join('과 ');
    const firstStrength = strengths[0];

    parts.push(
      `특히 눈에 띄는 것은 ${strengthNames}입니다. ` +
      `${firstStrength.storytelling} `
    );

    if (strengths.length > 1) {
      parts.push(
        `또한 ${strengths[1].partKorean}에서도 좋은 기운이 느껴집니다. ` +
        `${strengths[1].shape.description}의 특성이 두드러지게 나타나고 있어, ` +
        `이 두 부위의 조화가 당신의 운을 크게 상승시킬 것입니다.`
      );
    }
  }

  // 각 부위별 연결 스토리
  const featureOrder: FacePartType[] = ['forehead', 'eyes', 'nose', 'mouth', 'chin', 'ears'];

  parts.push('\n\n이제 얼굴의 각 부위를 자세히 살펴보겠습니다.\n');

  for (const part of featureOrder) {
    const feature = features[part];
    const grade = getGradeFromScore(feature.score);

    if (feature.isStrength) {
      parts.push(
        `▸ ${feature.partKorean} (${feature.score}점, ${grade.korean}): ` +
        `"${feature.shape.korean}"의 형태로, ${feature.trait}을(를) 나타냅니다. ` +
        `이는 당신의 큰 강점입니다. ${feature.storytelling}`
      );
    } else if (feature.isImprovement) {
      parts.push(
        `▸ ${feature.partKorean} (${feature.score}점, ${grade.korean}): ` +
        `${feature.shape.korean}의 형태입니다. 아직 잠재력이 발현되지 않았지만, ` +
        `노력과 덕을 쌓으면 변화할 수 있습니다.`
      );
    } else {
      parts.push(
        `▸ ${feature.partKorean} (${feature.score}점, ${grade.korean}): ` +
        `${feature.shape.korean}으로, ${feature.trait}을(를) 의미합니다. ` +
        `균형 잡힌 상태로 안정적인 기운이 흐르고 있습니다.`
      );
    }
  }

  // 보완점 조언
  if (improvements.length > 0) {
    parts.push('\n\n【보완점에 대한 조언】');
    for (const imp of improvements) {
      parts.push(
        `${imp.partKorean}은 아직 기운이 덜 발현된 상태입니다. ` +
        `이 부분은 노력과 수양으로 충분히 보완할 수 있으며, ` +
        `오히려 겸손함과 성장의 동력이 될 수 있습니다.`
      );
    }
  }

  return parts.join('\n');
}

// ===== 운세 이야기 생성 =====
function generateFortuneNarrative(
  overallScore: number,
  personality: { coreTraits: string[]; hiddenPotential: string }
): string {
  const grade = getGradeFromScore(overallScore);
  const parts: string[] = [];

  parts.push('\n\n【운세 총평】\n');

  // 등급별 운세 이야기
  const fortuneStories: Record<string, string[]> = {
    S: [
      '당신의 관상은 "복상 중의 복상"이라 할 수 있습니다. ' +
      '재물운, 관록운, 인덕이 모두 갖춰진 드문 경우입니다. ' +
      '다만 이러한 복은 나눌수록 커지니, 주변에 베푸는 것을 잊지 마세요.',

      '역사 속 성공한 위인들의 관상에서 볼 수 있는 특징들이 당신에게도 보입니다. ' +
      '큰 그림을 그리고 꾸준히 나아가면, 반드시 원하는 바를 이룰 수 있을 것입니다.',
    ],
    A: [
      '좋은 관상입니다. 특히 직업운과 재물운에서 좋은 흐름이 보입니다. ' +
      '40대부터는 더욱 안정되고 풍요로운 시기가 찾아올 것입니다. ' +
      '지금 심은 씨앗이 그때 큰 열매가 될 것입니다.',

      '당신의 관상은 노력이 배신하지 않는 상입니다. ' +
      '꾸준함을 유지하면 남들보다 조금 늦더라도 결국 정상에 서게 될 것입니다.',
    ],
    B: [
      '균형 잡힌 관상으로, 큰 파란 없이 안정적인 삶이 예상됩니다. ' +
      '급격한 상승은 없지만, 추락도 없습니다. ' +
      '꾸준함이 당신의 가장 큰 무기가 될 것입니다.',

      '관상학에서는 이를 "중정지상(中正之相)"이라 합니다. ' +
      '중심을 잡고 바른 길을 걸으면 복이 스스로 찾아오는 상입니다.',
    ],
    C: [
      '평범해 보이지만, 관상은 마음에 따라 변합니다. ' +
      '선한 마음과 꾸준한 노력은 얼굴도 바꿉니다. ' +
      '현재의 관상은 출발점일 뿐, 도착점이 아닙니다.',
    ],
    D: [
      '관상학의 대가들은 말합니다. "심상(心相)이 면상(面相)을 이긴다"고. ' +
      '마음을 닦고 덕을 쌓으면, 관상도 바뀔 수 있습니다. ' +
      '오늘의 관상이 평생을 결정하지 않습니다.',
    ],
  };

  const stories = fortuneStories[grade.grade] || fortuneStories['C'];
  parts.push(stories[Math.floor(Math.random() * stories.length)]);

  // 성격 특성 연결
  parts.push(`\n\n관상에서 읽히는 당신의 핵심 특성은 "${personality.coreTraits.slice(0, 3).join(', ')}"입니다.`);
  parts.push(`또한 ${personality.hiddenPotential}`);

  return parts.join('');
}

// ===== 마무리 조언 생성 =====
function generateClosingAdvice(
  overallScore: number,
  strengths: FacePartAnalysis[]
): string {
  const parts: string[] = [];
  const grade = getGradeFromScore(overallScore);

  parts.push('\n\n【마무리 조언】\n');

  // 강점 활용 조언
  if (strengths.length > 0) {
    const mainStrength = strengths[0];
    parts.push(
      `당신의 가장 큰 강점인 ${mainStrength.partKorean}을(를) 적극 활용하세요. ` +
      `${mainStrength.trait}의 특성은 인생의 많은 순간에서 빛을 발할 것입니다.`
    );
  }

  // 등급별 마무리 조언
  const closingByGrade: Record<string, string> = {
    S: '타고난 복에 감사하고, 그 복을 나누며 사세요. 주는 만큼 더 큰 복이 돌아올 것입니다.',
    A: '좋은 관상을 가졌으니, 자신감을 갖고 큰 꿈을 향해 나아가세요. 당신에게는 그럴 자격이 있습니다.',
    B: '균형 잡힌 삶을 유지하면서 조금씩 성장하세요. 조급해하지 않으면 결국 원하는 곳에 도달합니다.',
    C: '지금은 씨앗을 뿌리는 시기입니다. 열매는 때가 되면 반드시 맺힙니다.',
    D: '관상은 변합니다. 좋은 마음을 품고, 좋은 행동을 하면 얼굴도 바뀝니다. 희망을 잃지 마세요.',
  };

  parts.push('\n' + closingByGrade[grade.grade]);

  // 공통 마무리
  parts.push(
    '\n\n관상학은 가능성을 보여줄 뿐, 운명을 결정하지 않습니다. ' +
    '당신의 선택과 노력이 관상이 보여주는 가능성을 현실로 만듭니다. ' +
    '좋은 관상을 가졌다면 더욱 노력하고, 부족한 점이 있다면 그것을 채워나가세요. ' +
    '결국 인생의 주인공은 당신 자신입니다.'
  );

  return parts.join('');
}

// ===== 메인 스토리텔링 생성 함수 =====
export function generateStorytelling(
  features: Record<FacePartType, FacePartAnalysis>,
  overallScore: number,
  personality: { coreTraits: string[]; hiddenPotential: string; socialStyle: string; decisionStyle: string },
  strengths: FacePartAnalysis[],
  improvements: FacePartAnalysis[]
): StorytellingResult {
  const grade = getGradeFromScore(overallScore);

  // 도입부
  const gradeOpenings = SCORE_BASED_OPENINGS[grade.grade] || SCORE_BASED_OPENINGS['C'];
  const opening =
    gradeOpenings[Math.floor(Math.random() * gradeOpenings.length)] + '\n\n' +
    `종합 점수 ${overallScore}점, ${grade.korean} 등급의 관상입니다.\n` +
    OPENING_TEMPLATES[Math.floor(Math.random() * OPENING_TEMPLATES.length)];

  // 부위별 스토리
  const featureStory = generateFeatureConnectionStory(features, strengths, improvements);

  // 운세 이야기
  const fortuneNarrative = generateFortuneNarrative(overallScore, personality);

  // 마무리 조언
  const closingAdvice = generateClosingAdvice(overallScore, strengths);

  // 전체 스크립트 (TTS용)
  const fullScript = [
    '【관상 분석 결과】\n',
    opening,
    '\n',
    featureStory,
    fortuneNarrative,
    closingAdvice,
  ].join('');

  return {
    opening,
    featureStory,
    fortuneNarrative,
    closingAdvice,
    fullScript,
  };
}

// ===== TTS용 간결한 스크립트 생성 =====
export function generateTTSScript(
  features: Record<FacePartType, FacePartAnalysis>,
  overallScore: number,
  personality: { coreTraits: string[] },
  strengths: FacePartAnalysis[]
): string {
  const grade = getGradeFromScore(overallScore);
  const parts: string[] = [];

  // 인트로
  parts.push('관상 분석 결과를 말씀드리겠습니다.');
  parts.push(`종합 점수는 백점 만점에 ${overallScore}점으로, ${grade.korean} 등급입니다.`);

  // 강점
  if (strengths.length > 0) {
    const strengthNames = strengths.map(s => s.partKorean).join(', ');
    parts.push(`특히 ${strengthNames} 부위에서 좋은 기운이 나타났습니다.`);
    parts.push(strengths[0].storytelling);
  }

  // 핵심 특성
  if (personality.coreTraits.length > 0) {
    parts.push(`관상에서 읽히는 핵심 특성은 ${personality.coreTraits.slice(0, 3).join(', ')}입니다.`);
  }

  // 마무리
  parts.push('관상은 가능성을 보여줄 뿐입니다. 당신의 노력이 운명을 만듭니다. 좋은 하루 되세요.');

  return parts.join(' ');
}

export default generateStorytelling;
