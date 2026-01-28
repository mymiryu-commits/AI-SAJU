/**
 * OpenAI Vision API를 사용한 실제 얼굴 분석
 * - 이미지에서 얼굴 특징 추출
 * - 관상학적 해석 생성
 */

import OpenAI from 'openai';
import {
  FacePartType,
  FaceFeatureShape,
  FOREHEAD_SHAPES,
  EYE_SHAPES,
  NOSE_SHAPES,
  MOUTH_SHAPES,
  CHIN_SHAPES,
  EAR_SHAPES,
} from '@/types/face';

// OpenAI 클라이언트 lazy 초기화 (빌드 타임 오류 방지)
let openaiClient: OpenAI | null = null;

function getOpenAIClient(): OpenAI | null {
  if (!process.env.OPENAI_API_KEY) {
    return null;
  }
  if (!openaiClient) {
    openaiClient = new OpenAI({
      apiKey: process.env.OPENAI_API_KEY,
    });
  }
  return openaiClient;
}

// 부위별 형태 매핑
const SHAPE_MAPPINGS: Record<FacePartType, Record<string, FaceFeatureShape>> = {
  forehead: FOREHEAD_SHAPES,
  eyes: EYE_SHAPES,
  nose: NOSE_SHAPES,
  mouth: MOUTH_SHAPES,
  chin: CHIN_SHAPES,
  ears: EAR_SHAPES,
};

export interface VisionAnalysisResult {
  success: boolean;
  features?: {
    forehead: { shapeId: string; confidence: number; description: string };
    eyes: { shapeId: string; confidence: number; description: string };
    nose: { shapeId: string; confidence: number; description: string };
    mouth: { shapeId: string; confidence: number; description: string };
    chin: { shapeId: string; confidence: number; description: string };
    ears: { shapeId: string; confidence: number; description: string };
  };
  overallDescription?: string;
  error?: string;
}

/**
 * Vision API로 얼굴 분석 수행
 */
export async function analyzeWithVision(imageData: string): Promise<VisionAnalysisResult> {
  try {
    // OpenAI 클라이언트 가져오기
    const openai = getOpenAIClient();
    if (!openai) {
      console.warn('OpenAI API key not configured, falling back to deterministic analysis');
      return { success: false, error: 'API_KEY_NOT_CONFIGURED' };
    }

    // 이미지 데이터 검증
    if (!imageData || !imageData.startsWith('data:image')) {
      return { success: false, error: 'INVALID_IMAGE_DATA' };
    }

    // Vision API 호출
    const response = await openai.chat.completions.create({
      model: 'gpt-4o',
      messages: [
        {
          role: 'system',
          content: `당신은 동양 관상학 전문가입니다. 제공된 얼굴 사진을 분석하여 관상학적 특징을 JSON 형식으로 반환하세요.

각 부위별로 다음 형태 ID 중 가장 적합한 것을 선택하세요:

이마(forehead): wide_high(넓고 높은), round(둥근), flat(평평한), narrow(좁은), protruding(돌출된)
눈(eyes): phoenix(봉황눈), dragon(용눈), almond(아몬드), round(둥근), long(긴), small(작은)
코(nose): straight(곧은), high_bridge(높은 콧대), wide_wings(넓은 콧볼), rounded_tip(둥근 코끝), aquiline(매부리), button(단추코)
입(mouth): cherry(앵두입술), full(풍성한), thin(얇은), wide(넓은), upturned(올라간 입꼬리), defined(뚜렷한 인중)
턱(chin): square(각진), round(둥근), pointed(뾰족한), wide(넓은), double(이중턱), cleft(움푹)
귀(ears): buddha(부처귀), thick_lobe(두꺼운 귓불), attached(붙은), detached(떨어진), pointed(뾰족한), large(큰)

반드시 다음 JSON 형식으로 응답하세요:
{
  "forehead": { "shapeId": "형태ID", "confidence": 0.8, "description": "관상학적 설명" },
  "eyes": { "shapeId": "형태ID", "confidence": 0.8, "description": "관상학적 설명" },
  "nose": { "shapeId": "형태ID", "confidence": 0.8, "description": "관상학적 설명" },
  "mouth": { "shapeId": "형태ID", "confidence": 0.8, "description": "관상학적 설명" },
  "chin": { "shapeId": "형태ID", "confidence": 0.8, "description": "관상학적 설명" },
  "ears": { "shapeId": "형태ID", "confidence": 0.8, "description": "관상학적 설명" },
  "overall": "전체적인 관상 인상"
}`
        },
        {
          role: 'user',
          content: [
            {
              type: 'text',
              text: '이 사진의 얼굴을 관상학적으로 분석해주세요. JSON 형식으로만 응답해주세요.'
            },
            {
              type: 'image_url',
              image_url: {
                url: imageData,
                detail: 'high'
              }
            }
          ]
        }
      ],
      max_tokens: 1500,
      temperature: 0.3,
    });

    const content = response.choices[0]?.message?.content;
    if (!content) {
      return { success: false, error: 'NO_RESPONSE' };
    }

    // JSON 파싱
    const jsonMatch = content.match(/\{[\s\S]*\}/);
    if (!jsonMatch) {
      console.error('Failed to extract JSON from response:', content);
      return { success: false, error: 'INVALID_JSON_RESPONSE' };
    }

    const parsed = JSON.parse(jsonMatch[0]);

    // 결과 검증 및 변환
    const features = {
      forehead: validateAndNormalize('forehead', parsed.forehead),
      eyes: validateAndNormalize('eyes', parsed.eyes),
      nose: validateAndNormalize('nose', parsed.nose),
      mouth: validateAndNormalize('mouth', parsed.mouth),
      chin: validateAndNormalize('chin', parsed.chin),
      ears: validateAndNormalize('ears', parsed.ears),
    };

    return {
      success: true,
      features,
      overallDescription: parsed.overall || '',
    };

  } catch (error) {
    console.error('Vision analysis error:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'UNKNOWN_ERROR'
    };
  }
}

/**
 * 분석 결과 검증 및 정규화
 */
function validateAndNormalize(
  part: FacePartType,
  data: { shapeId?: string; confidence?: number; description?: string } | undefined
): { shapeId: string; confidence: number; description: string } {
  const shapes = SHAPE_MAPPINGS[part];
  const shapeIds = Object.keys(shapes);
  const defaultShapeId = shapeIds[0];

  if (!data) {
    return {
      shapeId: defaultShapeId,
      confidence: 0.5,
      description: '분석 중 일부 정보를 확인할 수 없었습니다.'
    };
  }

  // shapeId 검증
  let shapeId = data.shapeId || defaultShapeId;
  if (!shapeIds.includes(shapeId)) {
    // 가장 유사한 형태 찾기
    const lowerShapeId = shapeId.toLowerCase();
    const found = shapeIds.find(id => id.toLowerCase().includes(lowerShapeId) || lowerShapeId.includes(id.toLowerCase()));
    shapeId = found || defaultShapeId;
  }

  return {
    shapeId,
    confidence: Math.min(1, Math.max(0, data.confidence || 0.7)),
    description: data.description || shapes[shapeId]?.description || ''
  };
}

/**
 * 이미지 해시 기반 결정론적 분석 (Vision API 실패 시 폴백)
 * 같은 이미지는 항상 같은 결과 반환
 */
export function deterministicAnalysis(imageData: string): VisionAnalysisResult {
  // 이미지 데이터에서 해시 생성
  const hash = generateHash(imageData);

  const features = {
    forehead: selectByHash('forehead', hash, 0),
    eyes: selectByHash('eyes', hash, 1),
    nose: selectByHash('nose', hash, 2),
    mouth: selectByHash('mouth', hash, 3),
    chin: selectByHash('chin', hash, 4),
    ears: selectByHash('ears', hash, 5),
  };

  return {
    success: true,
    features,
    overallDescription: '이미지 특성 기반 분석 결과입니다.',
  };
}

/**
 * 문자열에서 해시값 생성
 */
function generateHash(str: string): number {
  let hash = 0;
  // 이미지 데이터 중 일부만 사용 (성능)
  const sample = str.slice(0, 10000);
  for (let i = 0; i < sample.length; i++) {
    const char = sample.charCodeAt(i);
    hash = ((hash << 5) - hash) + char;
    hash = hash & hash;
  }
  return Math.abs(hash);
}

/**
 * 해시 기반 형태 선택
 */
function selectByHash(
  part: FacePartType,
  hash: number,
  offset: number
): { shapeId: string; confidence: number; description: string } {
  const shapes = SHAPE_MAPPINGS[part];
  const shapeIds = Object.keys(shapes);

  // 해시와 오프셋을 사용하여 일관된 선택
  const index = (hash + offset * 7919) % shapeIds.length; // 7919는 소수
  const shapeId = shapeIds[index];
  const shape = shapes[shapeId];

  // 해시 기반 신뢰도 (0.65 ~ 0.95)
  const confidence = 0.65 + ((hash + offset * 13) % 30) / 100;

  return {
    shapeId,
    confidence,
    description: shape.description,
  };
}

export default analyzeWithVision;
