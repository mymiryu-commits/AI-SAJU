/**
 * AI API 클라이언트
 *
 * Claude API 및 OpenAI API를 통합 관리합니다.
 */

export type AIModel = 'haiku' | 'sonnet' | 'gpt-4o' | 'gpt-4o-mini';

interface AIRequestOptions {
  model: AIModel;
  systemPrompt: string;
  userPrompt: string;
  maxTokens?: number;
  temperature?: number;
}

interface AIResponse {
  content: string;
  tokensUsed: number;
  model: string;
}

// Claude 모델 매핑
const CLAUDE_MODELS: Record<string, string> = {
  haiku: 'claude-3-5-haiku-20241022',
  sonnet: 'claude-sonnet-4-20250514'
};

// OpenAI 모델 매핑
const OPENAI_MODELS: Record<string, string> = {
  'gpt-4o': 'gpt-4o',
  'gpt-4o-mini': 'gpt-4o-mini'
};

/**
 * Claude API 호출
 */
async function callClaudeAPI(options: AIRequestOptions): Promise<AIResponse> {
  const apiKey = process.env.ANTHROPIC_API_KEY;

  if (!apiKey) {
    throw new Error('ANTHROPIC_API_KEY is not configured');
  }

  const modelId = CLAUDE_MODELS[options.model];
  if (!modelId) {
    throw new Error(`Invalid Claude model: ${options.model}`);
  }

  const response = await fetch('https://api.anthropic.com/v1/messages', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'x-api-key': apiKey,
      'anthropic-version': '2023-06-01'
    },
    body: JSON.stringify({
      model: modelId,
      max_tokens: options.maxTokens || 1024,
      system: options.systemPrompt,
      messages: [
        {
          role: 'user',
          content: options.userPrompt
        }
      ],
      temperature: options.temperature || 0.7
    })
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.error?.message || 'Claude API call failed');
  }

  const data = await response.json();

  return {
    content: data.content[0]?.text || '',
    tokensUsed: (data.usage?.input_tokens || 0) + (data.usage?.output_tokens || 0),
    model: modelId
  };
}

/**
 * OpenAI API 호출
 */
async function callOpenAIAPI(options: AIRequestOptions): Promise<AIResponse> {
  const apiKey = process.env.OPENAI_API_KEY;

  if (!apiKey) {
    throw new Error('OPENAI_API_KEY is not configured');
  }

  const modelId = OPENAI_MODELS[options.model];
  if (!modelId) {
    throw new Error(`Invalid OpenAI model: ${options.model}`);
  }

  const response = await fetch('https://api.openai.com/v1/chat/completions', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${apiKey}`
    },
    body: JSON.stringify({
      model: modelId,
      max_tokens: options.maxTokens || 1024,
      temperature: options.temperature || 0.7,
      messages: [
        {
          role: 'system',
          content: options.systemPrompt
        },
        {
          role: 'user',
          content: options.userPrompt
        }
      ]
    })
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.error?.message || 'OpenAI API call failed');
  }

  const data = await response.json();

  return {
    content: data.choices[0]?.message?.content || '',
    tokensUsed: data.usage?.total_tokens || 0,
    model: modelId
  };
}

/**
 * AI 응답 생성 (통합)
 */
export async function generateAIResponse(options: AIRequestOptions): Promise<AIResponse> {
  const isClaudeModel = options.model === 'haiku' || options.model === 'sonnet';

  if (isClaudeModel) {
    return callClaudeAPI(options);
  } else {
    return callOpenAIAPI(options);
  }
}

/**
 * 티어별 모델 선택
 */
export function getModelForTier(tier: 'free' | 'subscriber' | 'premium'): AIModel {
  switch (tier) {
    case 'free':
      return 'haiku';
    case 'subscriber':
    case 'premium':
      return 'gpt-4o';
    default:
      return 'haiku';
  }
}

/**
 * 토큰 추정 (간단한 근사)
 */
export function estimateTokens(text: string): number {
  // 한글은 대략 1.5~2 토큰/글자, 영문은 ~0.25 토큰/글자
  const koreanChars = (text.match(/[가-힣]/g) || []).length;
  const otherChars = text.length - koreanChars;

  return Math.ceil(koreanChars * 1.5 + otherChars * 0.4);
}

export default {
  generateAIResponse,
  getModelForTier,
  estimateTokens
};
