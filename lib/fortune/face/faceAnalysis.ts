/**
 * 관상학 분석 서비스
 * - Vision API를 통한 실제 얼굴 분석
 * - 부위별 점수화 알고리즘
 * - 가중치 통합 점수 계산
 * - 강점/보완점 도출
 */

import {
  FacePartType,
  FacePartAnalysis,
  FaceAnalysisResult,
  FaceFortuneScores,
  FACE_PART_KOREAN,
  FACE_PART_WEIGHTS,
  FORTUNE_PART_INFLUENCE,
  FOREHEAD_SHAPES,
  EYE_SHAPES,
  NOSE_SHAPES,
  MOUTH_SHAPES,
  CHIN_SHAPES,
  EAR_SHAPES,
  FaceFeatureShape,
  CELEBRITY_EXAMPLES,
  getGradeFromScore,
} from '@/types/face';
import { generateStorytelling } from './faceStorytelling';
import { analyzeWithVision, deterministicAnalysis, VisionAnalysisResult } from './visionAnalysis';

// UUID 생성 함수
function generateUUID(): string {
  // crypto.randomUUID() 사용 (Node.js 환경)
  if (typeof crypto !== 'undefined' && crypto.randomUUID) {
    return crypto.randomUUID();
  }
  // 폴백: 간단한 UUID 생성
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, (c) => {
    const r = (Math.random() * 16) | 0;
    const v = c === 'x' ? r : (r & 0x3) | 0x8;
    return v.toString(16);
  });
}

// ===== 부위별 형태 매핑 =====
const SHAPE_MAPPINGS: Record<FacePartType, Record<string, FaceFeatureShape>> = {
  forehead: FOREHEAD_SHAPES,
  eyes: EYE_SHAPES,
  nose: NOSE_SHAPES,
  mouth: MOUTH_SHAPES,
  chin: CHIN_SHAPES,
  ears: EAR_SHAPES,
};

// ===== 형태별 기본 점수 범위 =====
const FORTUNE_TYPE_SCORE_RANGES = {
  positive: { min: 78, max: 98 },
  neutral: { min: 65, max: 85 },
  challenging: { min: 55, max: 72 },
};

// ===== 부위별 스토리텔링 템플릿 =====
const STORYTELLING_TEMPLATES: Record<FacePartType, Record<string, string[]>> = {
  forehead: {
    positive: [
      '당신의 이마는 마치 푸른 하늘을 담은 호수처럼 넓고 맑습니다. 옛 관상학에서는 이러한 이마를 "천창(天倉)"이라 하여, 하늘의 창고가 열린 사람이라 표현했습니다.',
      '높고 넓은 이마는 총명함과 원대한 포부를 나타냅니다. 마치 대지를 굽어보는 산봉우리처럼, 당신은 넓은 시야로 세상을 바라볼 수 있는 능력을 타고났습니다.',
    ],
    neutral: [
      '당신의 이마는 균형 잡힌 형태로, 안정적이고 꾸준한 성장을 예고합니다. 급하지 않게 차근차근 쌓아가는 우직함이 있습니다.',
    ],
  },
  eyes: {
    positive: [
      '당신의 눈은 맑은 샘물처럼 깊고 투명합니다. 관상학에서는 이를 "청수안(淸水眼)"이라 하여, 마음이 맑고 지혜로운 사람의 상징으로 봅니다.',
      '빛나는 눈동자는 마치 밤하늘의 별처럼 총명함을 드러냅니다. 사람의 마음을 꿰뚫어 보는 통찰력이 당신의 가장 큰 무기가 될 것입니다.',
    ],
    neutral: [
      '당신의 눈은 신중함과 관찰력을 나타냅니다. 급하게 판단하지 않고 깊이 살피는 성품이 장점입니다.',
    ],
  },
  nose: {
    positive: [
      '당신의 코는 산의 능선처럼 곧고 단정합니다. 관상학에서 코는 "재백궁(財帛宮)"이라 하여 재물과 자존심을 관장하는데, 이는 탄탄한 경제적 기반을 예고합니다.',
      '넓은 콧볼은 재물을 담는 그릇의 크기를 상징합니다. 마치 바다가 모든 강물을 받아들이듯, 당신에게도 재물이 흘러들어올 것입니다.',
    ],
    neutral: [
      '균형 잡힌 코는 안정적인 재물 흐름을 나타냅니다. 급격한 부침 없이 꾸준한 성장이 예상됩니다.',
    ],
  },
  mouth: {
    positive: [
      '당신의 입술은 복숭아꽃처럼 싱그럽습니다. 관상학에서는 이를 "복록구(福祿口)"라 하여, 말로써 복을 부르는 상이라 합니다.',
      '풍성한 입술과 선명한 입 꼬리는 표현력과 설득력의 상징입니다. 당신의 말 한마디가 사람들의 마음을 움직이는 힘을 가졌습니다.',
    ],
    neutral: [
      '단정한 입 모양은 논리적이고 분석적인 언변을 나타냅니다. 감성보다 이성으로 설득하는 힘이 있습니다.',
    ],
  },
  chin: {
    positive: [
      '당신의 턱은 대지처럼 든든합니다. 관상학에서 턱은 "지각(地閣)"이라 하여, 말년의 안정과 후손의 복을 나타냅니다.',
      '각진 턱선은 의지력과 결단력의 상징입니다. 어떤 어려움에도 흔들리지 않는 내면의 힘이 당신에게 있습니다.',
    ],
    neutral: [
      '균형 잡힌 턱은 꾸준한 노력으로 안정을 이루어가는 상입니다. 인내심이 결국 좋은 결실을 맺게 합니다.',
    ],
  },
  ears: {
    positive: [
      '당신의 귀는 부처님의 귀처럼 복스럽습니다. 관상학에서 두꺼운 귓불은 "복덕상(福德相)"의 대표적 특징으로, 타고난 복과 장수를 의미합니다.',
      '크고 두꺼운 귀는 부와 명예가 함께 하는 상입니다. 마치 대지가 모든 것을 품듯, 당신에게도 복이 모여들 것입니다.',
    ],
    neutral: [
      '단정한 귀 모양은 현실적이고 실행력 있는 성품을 나타냅니다. 뜬구름 잡는 일 없이 착실하게 성과를 냅니다.',
    ],
  },
};

// ===== 랜덤 요소가 포함된 점수 생성 =====
function generateScore(fortuneType: 'positive' | 'neutral' | 'challenging'): number {
  const range = FORTUNE_TYPE_SCORE_RANGES[fortuneType];
  // 기본 점수에 약간의 랜덤 변동 추가
  const baseScore = range.min + Math.random() * (range.max - range.min);
  // 소수점 제거
  return Math.round(baseScore);
}

// ===== Vision API 결과에서 형태 선택 =====
function selectShapeFromVision(
  part: FacePartType,
  visionResult: VisionAnalysisResult
): { shape: FaceFeatureShape; confidence: number; description: string } | null {
  if (!visionResult.success || !visionResult.features) {
    return null;
  }

  const visionFeature = visionResult.features[part];
  if (!visionFeature) {
    return null;
  }

  const shapes = SHAPE_MAPPINGS[part];
  const shape = shapes[visionFeature.shapeId];

  if (!shape) {
    // 유효하지 않은 shapeId의 경우 기본값 반환
    const defaultShape = Object.values(shapes)[0];
    return {
      shape: defaultShape,
      confidence: visionFeature.confidence,
      description: visionFeature.description,
    };
  }

  return {
    shape,
    confidence: visionFeature.confidence,
    description: visionFeature.description,
  };
}

// ===== 형태 선택 (폴백용 - 랜덤) =====
function selectShapeRandom(part: FacePartType): FaceFeatureShape {
  const shapes = Object.values(SHAPE_MAPPINGS[part]);
  const randomIndex = Math.floor(Math.random() * shapes.length);
  return shapes[randomIndex];
}

// ===== 부위별 분석 생성 =====
function analyzePartByShape(part: FacePartType, shape: FaceFeatureShape): FacePartAnalysis {
  const score = generateScore(shape.fortuneType);
  const isStrength = score >= 85;
  const isImprovement = score < 70;

  // 스토리텔링 선택
  const templateKey = shape.fortuneType === 'challenging' ? 'neutral' : shape.fortuneType;
  const templates = STORYTELLING_TEMPLATES[part][templateKey] || STORYTELLING_TEMPLATES[part]['neutral'];
  const storytelling = templates[Math.floor(Math.random() * templates.length)];

  // 유명인 예시
  const celebrityList = CELEBRITY_EXAMPLES[part][shape.id] || [];

  return {
    part,
    partKorean: FACE_PART_KOREAN[part],
    score,
    shape,
    trait: shape.description,
    meaning: generateDetailedMeaning(part, shape, score),
    isStrength,
    isImprovement,
    storytelling,
    examples: celebrityList.length > 0 ? celebrityList : undefined,
  };
}

// ===== 부위별 분석 생성 (Vision API 신뢰도 반영) =====
function analyzePartByShapeWithConfidence(
  part: FacePartType,
  shape: FaceFeatureShape,
  confidence: number,
  visionDescription: string
): FacePartAnalysis {
  // 기본 점수 생성
  let baseScore = generateScore(shape.fortuneType);

  // Vision API 신뢰도에 따른 점수 조정
  // 높은 신뢰도(0.8+)일 경우 점수 범위 확장
  if (confidence >= 0.8) {
    const adjustment = (confidence - 0.8) * 10; // 최대 +2점
    baseScore = Math.min(100, baseScore + Math.round(adjustment));
  }

  const score = baseScore;
  const isStrength = score >= 85;
  const isImprovement = score < 70;

  // 스토리텔링 선택
  const templateKey = shape.fortuneType === 'challenging' ? 'neutral' : shape.fortuneType;
  const templates = STORYTELLING_TEMPLATES[part][templateKey] || STORYTELLING_TEMPLATES[part]['neutral'];
  const storytelling = templates[Math.floor(Math.random() * templates.length)];

  // 유명인 예시
  const celebrityList = CELEBRITY_EXAMPLES[part][shape.id] || [];

  // Vision API 설명을 trait에 반영
  const trait = visionDescription || shape.description;

  return {
    part,
    partKorean: FACE_PART_KOREAN[part],
    score,
    shape,
    trait,
    meaning: generateDetailedMeaning(part, shape, score),
    isStrength,
    isImprovement,
    storytelling,
    examples: celebrityList.length > 0 ? celebrityList : undefined,
    confidence, // Vision API 신뢰도 추가
  };
}

// ===== 상세 해석 생성 =====
function generateDetailedMeaning(
  part: FacePartType,
  shape: FaceFeatureShape,
  score: number
): string {
  const grade = getGradeFromScore(score);
  const partName = FACE_PART_KOREAN[part];

  const meaningTemplates: Record<FacePartType, string[]> = {
    forehead: [
      `${shape.korean}의 형태는 ${shape.description}을(를) 나타냅니다.`,
      `특히 ${partName} 부위에서 ${grade.korean} 등급(${score}점)의 관상이 나타났습니다.`,
      `이는 초년운과 지적 능력에서 좋은 기운이 있음을 의미합니다.`,
    ],
    eyes: [
      `${shape.korean}의 형태로, ${shape.description}을(를) 암시합니다.`,
      `눈은 마음의 창으로, ${grade.korean} 등급의 맑고 빛나는 기운이 있습니다.`,
      `대인관계에서 신뢰를 얻기 쉬우며, 통찰력이 뛰어납니다.`,
    ],
    nose: [
      `${shape.korean}은(는) ${shape.description}의 상징입니다.`,
      `재물궁인 코에서 ${grade.korean} 등급이 나타나, 재물운이 좋습니다.`,
      `40대 중반부터 특히 재물운이 상승할 조짐이 있습니다.`,
    ],
    mouth: [
      `${shape.korean}의 입 모양은 ${shape.description}을(를) 의미합니다.`,
      `${grade.korean} 등급의 입술은 언변과 인복에서 좋은 기운입니다.`,
      `말로써 사람을 얻고, 좋은 인연을 만들어갈 수 있습니다.`,
    ],
    chin: [
      `${shape.korean}은(는) ${shape.description}을(를) 나타냅니다.`,
      `턱에서 ${grade.korean} 등급이 나타나 말년 운이 밝습니다.`,
      `끈기와 인내로 결국 성공을 이루는 상입니다.`,
    ],
    ears: [
      `${shape.korean}의 귀는 ${shape.description}을(를) 상징합니다.`,
      `${grade.korean} 등급의 귀는 타고난 복덕이 있음을 나타냅니다.`,
      `건강하고 장수할 상이며, 지혜가 깊습니다.`,
    ],
  };

  return meaningTemplates[part].join(' ');
}

// ===== 가중치 적용 점수 계산 =====
function calculateWeightedScore(partScores: Record<FacePartType, number>): number {
  let weightedSum = 0;
  const parts: FacePartType[] = ['forehead', 'eyes', 'nose', 'mouth', 'chin', 'ears'];

  for (const part of parts) {
    weightedSum += partScores[part] * FACE_PART_WEIGHTS[part];
  }

  return Math.round(weightedSum);
}

// ===== 보너스 점수 계산 =====
function calculateBonus(partScores: Record<FacePartType, number>): { points: number; reason?: string } {
  const exceptionalParts: { part: FacePartType; score: number }[] = [];

  for (const [part, score] of Object.entries(partScores)) {
    if (score >= 92) {
      exceptionalParts.push({ part: part as FacePartType, score });
    }
  }

  if (exceptionalParts.length === 0) {
    return { points: 0 };
  }

  // 특출난 부위에 대한 보너스
  let bonusPoints = 0;
  const reasons: string[] = [];

  for (const { part, score } of exceptionalParts) {
    const partBonus = Math.round((score - 90) * 0.5);
    bonusPoints += partBonus;
    reasons.push(`${FACE_PART_KOREAN[part]} 특출(+${partBonus}점)`);
  }

  return {
    points: Math.min(bonusPoints, 10), // 최대 10점 보너스
    reason: reasons.join(', '),
  };
}

// ===== 운세별 점수 계산 =====
function calculateFortuneScores(partScores: Record<FacePartType, number>): FaceFortuneScores {
  const fortunes: FaceFortuneScores = {
    career: 0,
    wealth: 0,
    love: 0,
    health: 0,
    social: 0,
  };

  for (const fortune of Object.keys(fortunes) as (keyof FaceFortuneScores)[]) {
    let score = 0;
    const influences = FORTUNE_PART_INFLUENCE[fortune];

    for (const [part, weight] of Object.entries(influences)) {
      score += partScores[part as FacePartType] * weight;
    }

    // 약간의 랜덤 변동 추가 (±3점)
    const variation = (Math.random() - 0.5) * 6;
    fortunes[fortune] = Math.min(100, Math.max(0, Math.round(score + variation)));
  }

  return fortunes;
}

// ===== 성격 분석 생성 =====
function generatePersonality(features: Record<FacePartType, FacePartAnalysis>): {
  coreTraits: string[];
  hiddenPotential: string;
  socialStyle: string;
  decisionStyle: string;
} {
  const coreTraits: string[] = [];

  // 각 부위의 특성을 종합
  if (features.forehead.score >= 80) coreTraits.push('지적 호기심이 왕성함');
  if (features.eyes.score >= 80) coreTraits.push('뛰어난 통찰력');
  if (features.nose.score >= 80) coreTraits.push('현실적 판단력');
  if (features.mouth.score >= 80) coreTraits.push('탁월한 표현력');
  if (features.chin.score >= 80) coreTraits.push('강한 의지력');
  if (features.ears.score >= 80) coreTraits.push('타고난 복덕');

  // 최소 3개 보장
  const additionalTraits = ['창의적 사고', '균형 잡힌 감성', '실행력', '인내심', '적응력'];
  while (coreTraits.length < 3) {
    const trait = additionalTraits[Math.floor(Math.random() * additionalTraits.length)];
    if (!coreTraits.includes(trait)) coreTraits.push(trait);
  }

  // 숨겨진 잠재력
  const potentials = [
    '예술적 감각이 숨어 있어, 창작 활동에서 빛을 발할 수 있습니다.',
    '사람들을 이끄는 리더십의 자질이 내면에 잠재되어 있습니다.',
    '위기 상황에서 빛나는 침착함과 결단력이 숨어 있습니다.',
    '깊은 통찰력으로 남들이 보지 못하는 것을 볼 수 있는 능력이 있습니다.',
    '인내와 끈기로 큰 일을 이룰 수 있는 잠재력을 가지고 있습니다.',
  ];

  // 대인관계 스타일
  const socialStyles = [
    '처음에는 조심스럽지만 친해지면 깊은 유대를 형성하는 타입',
    '누구와도 쉽게 어울리는 사교적인 성격',
    '소수의 깊은 관계를 선호하는 타입',
    '첫인상이 좋아 사람들에게 호감을 주는 타입',
  ];

  // 의사결정 스타일
  const decisionStyles = [
    '데이터와 논리를 기반으로 신중하게 결정',
    '직관과 감각을 믿고 빠르게 결정',
    '충분한 정보 수집 후 확신이 들면 과감하게 결정',
    '주변의 의견을 경청한 후 종합적으로 판단',
  ];

  return {
    coreTraits: coreTraits.slice(0, 5),
    hiddenPotential: potentials[Math.floor(Math.random() * potentials.length)],
    socialStyle: socialStyles[Math.floor(Math.random() * socialStyles.length)],
    decisionStyle: decisionStyles[Math.floor(Math.random() * decisionStyles.length)],
  };
}

// ===== 조언 생성 =====
function generateAdvice(
  features: Record<FacePartType, FacePartAnalysis>,
  fortuneScores: FaceFortuneScores
): FaceAnalysisResult['advice'] {
  const careerAdvices = [
    '눈의 통찰력을 활용하여 전략적 기획이나 분석 업무에서 두각을 나타낼 수 있습니다.',
    '이마의 지성과 코의 현실감각을 결합하면 사업가로서 성공할 자질이 충분합니다.',
    '입의 표현력을 살려 커뮤니케이션이 중요한 직종에서 빛을 발할 것입니다.',
  ];

  const relationshipAdvices = [
    '눈의 맑은 기운이 좋은 인연을 끌어당깁니다. 진심으로 대하면 좋은 만남이 있을 것입니다.',
    '턱의 안정감이 파트너에게 신뢰를 줍니다. 꾸준함을 보여주세요.',
    '입술의 매력이 사교 운을 높입니다. 적극적으로 인연을 찾아보세요.',
  ];

  const wealthAdvices = [
    '코의 재물운이 좋으니, 40대부터 재산 증식에 집중하면 좋은 결과가 있을 것입니다.',
    '귀의 복덕상이 타고난 재물운을 나타냅니다. 저축과 투자를 꾸준히 하세요.',
    '이마의 지혜로 현명한 재테크가 가능합니다. 장기적 관점을 유지하세요.',
  ];

  const lifestyleAdvices = [
    '아침형 인간이 되면 운기가 상승합니다. 이른 기상을 권합니다.',
    '물 근처에서 좋은 기운을 받습니다. 바다나 강가에서 휴식을 취해보세요.',
    '녹색 계열의 컬러가 행운을 가져옵니다. 식물을 키우는 것도 좋습니다.',
  ];

  const luckyColors = ['청색', '녹색', '금색', '자주색', '흰색'];
  const luckyNumbers = [3, 6, 7, 8, 9];
  const luckyDirections = ['동쪽', '동남쪽', '남쪽', '서쪽', '북쪽'];
  const luckyTimes = ['오전 7-9시', '오전 9-11시', '오후 1-3시', '오후 5-7시'];

  return {
    career: careerAdvices[Math.floor(Math.random() * careerAdvices.length)],
    relationship: relationshipAdvices[Math.floor(Math.random() * relationshipAdvices.length)],
    wealth: wealthAdvices[Math.floor(Math.random() * wealthAdvices.length)],
    lifestyle: lifestyleAdvices[Math.floor(Math.random() * lifestyleAdvices.length)],
    lucky: {
      color: luckyColors[Math.floor(Math.random() * luckyColors.length)],
      number: luckyNumbers[Math.floor(Math.random() * luckyNumbers.length)],
      direction: luckyDirections[Math.floor(Math.random() * luckyDirections.length)],
      time: luckyTimes[Math.floor(Math.random() * luckyTimes.length)],
    },
  };
}

// ===== 메인 분석 함수 (비동기 - Vision API 사용) =====
export async function analyzeFaceWithVision(imageData: string): Promise<FaceAnalysisResult> {
  // Vision API로 실제 얼굴 분석 시도
  let visionResult: VisionAnalysisResult;
  let useAI = false;

  try {
    visionResult = await analyzeWithVision(imageData);
    useAI = visionResult.success;
    console.log('Vision API result:', visionResult.success ? 'success' : visionResult.error);
  } catch (error) {
    console.warn('Vision API failed, using deterministic fallback:', error);
    visionResult = deterministicAnalysis(imageData);
  }

  // Vision API 실패 시 결정론적 분석 사용
  if (!visionResult.success) {
    visionResult = deterministicAnalysis(imageData);
  }

  // 부위별 형태 선택 (Vision API 결과 또는 결정론적 결과)
  const parts: FacePartType[] = ['forehead', 'eyes', 'nose', 'mouth', 'chin', 'ears'];
  const selectedShapes: Record<FacePartType, FaceFeatureShape> = {} as Record<FacePartType, FaceFeatureShape>;
  const visionConfidences: Record<FacePartType, number> = {} as Record<FacePartType, number>;
  const visionDescriptions: Record<FacePartType, string> = {} as Record<FacePartType, string>;

  for (const part of parts) {
    const visionData = selectShapeFromVision(part, visionResult);
    if (visionData) {
      selectedShapes[part] = visionData.shape;
      visionConfidences[part] = visionData.confidence;
      visionDescriptions[part] = visionData.description;
    } else {
      selectedShapes[part] = selectShapeRandom(part);
      visionConfidences[part] = 0.5;
      visionDescriptions[part] = '';
    }
  }

  // 부위별 분석 (Vision API 신뢰도 반영)
  const features: Record<FacePartType, FacePartAnalysis> = {} as Record<FacePartType, FacePartAnalysis>;
  for (const part of parts) {
    features[part] = analyzePartByShapeWithConfidence(
      part,
      selectedShapes[part],
      visionConfidences[part],
      visionDescriptions[part]
    );
  }

  return buildAnalysisResult(features, useAI, visionResult.overallDescription);
}

// ===== 메인 분석 함수 (동기 - 폴백용) =====
export function analyzeFace(imageData?: string): FaceAnalysisResult {
  // 이미지가 제공된 경우 결정론적 분석 사용
  if (imageData) {
    const visionResult = deterministicAnalysis(imageData);
    const parts: FacePartType[] = ['forehead', 'eyes', 'nose', 'mouth', 'chin', 'ears'];
    const features: Record<FacePartType, FacePartAnalysis> = {} as Record<FacePartType, FacePartAnalysis>;

    for (const part of parts) {
      const visionData = selectShapeFromVision(part, visionResult);
      if (visionData) {
        features[part] = analyzePartByShapeWithConfidence(
          part,
          visionData.shape,
          visionData.confidence,
          visionData.description
        );
      } else {
        features[part] = analyzePartByShape(part, selectShapeRandom(part));
      }
    }

    return buildAnalysisResult(features, false);
  }

  // 이미지가 없는 경우 랜덤 분석 (테스트용)
  const selectedShapes: Record<FacePartType, FaceFeatureShape> = {
    forehead: selectShapeRandom('forehead'),
    eyes: selectShapeRandom('eyes'),
    nose: selectShapeRandom('nose'),
    mouth: selectShapeRandom('mouth'),
    chin: selectShapeRandom('chin'),
    ears: selectShapeRandom('ears'),
  };

  // 부위별 분석
  const features: Record<FacePartType, FacePartAnalysis> = {
    forehead: analyzePartByShape('forehead', selectedShapes.forehead),
    eyes: analyzePartByShape('eyes', selectedShapes.eyes),
    nose: analyzePartByShape('nose', selectedShapes.nose),
    mouth: analyzePartByShape('mouth', selectedShapes.mouth),
    chin: analyzePartByShape('chin', selectedShapes.chin),
    ears: analyzePartByShape('ears', selectedShapes.ears),
  };

  return buildAnalysisResult(features, false);
}

// ===== 분석 결과 빌드 헬퍼 =====
function buildAnalysisResult(
  features: Record<FacePartType, FacePartAnalysis>,
  useAI: boolean,
  overallDescription?: string
): FaceAnalysisResult {
  // 부위별 점수 추출
  const partScores: Record<FacePartType, number> = {
    forehead: features.forehead.score,
    eyes: features.eyes.score,
    nose: features.nose.score,
    mouth: features.mouth.score,
    chin: features.chin.score,
    ears: features.ears.score,
  };

  // 가중치 적용 점수
  const weightedScores: Record<FacePartType, number> = {} as Record<FacePartType, number>;
  for (const part of Object.keys(partScores) as FacePartType[]) {
    weightedScores[part] = Math.round(partScores[part] * FACE_PART_WEIGHTS[part] * 100) / 100;
  }

  // 보너스 계산
  const bonus = calculateBonus(partScores);

  // 종합 점수
  const baseScore = calculateWeightedScore(partScores);
  const overallScore = Math.min(100, baseScore + bonus.points);

  // 운세별 점수
  const fortuneScores = calculateFortuneScores(partScores);

  // 강점/보완점 분류
  const strengths = Object.values(features).filter(f => f.isStrength);
  const improvements = Object.values(features).filter(f => f.isImprovement);
  const exceptional = Object.values(features).find(f => f.score >= 95);

  // 성격 분석
  const personality = generatePersonality(features);

  // 조언 생성
  const advice = generateAdvice(features, fortuneScores);

  // 스토리텔링 생성
  const storytelling = generateStorytelling(features, overallScore, personality, strengths, improvements);

  return {
    analysisId: generateUUID(),
    analyzedAt: new Date().toISOString(),
    features,
    scores: {
      partScores,
      weightedScores,
      bonusPoints: bonus.points,
      bonusReason: bonus.reason,
      overallScore,
      fortuneScores,
    },
    highlights: {
      strengths,
      improvements,
      exceptional,
    },
    personality,
    storytelling,
    advice,
    metadata: {
      useAI,
      overallDescription,
    },
  };
}

export default analyzeFace;
