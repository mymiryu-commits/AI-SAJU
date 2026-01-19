/**
 * AI 시나리오 프롬프트 통합 모듈
 */

import { generateLovePrompt, LOVE_SCENARIO_CONFIG } from './loveScenario';
import { generateCareerPrompt, CAREER_SCENARIO_CONFIG } from './careerScenario';
import { generateFinancePrompt, FINANCE_SCENARIO_CONFIG } from './financeScenario';
import { generateHealthPrompt, HEALTH_SCENARIO_CONFIG } from './healthScenario';
import { generateFamilyPrompt, FAMILY_SCENARIO_CONFIG } from './familyScenario';
import type { ChatScenario } from '@/types/chat';

interface SajuContext {
  dayMaster: string;
  fourPillars: any;
  yongsin: string[];
  oheng: any;
  mbti?: string;
  bloodType?: string;
  birthDate: string;
  userName?: string;
}

export const SCENARIO_CONFIGS = {
  love: LOVE_SCENARIO_CONFIG,
  career: CAREER_SCENARIO_CONFIG,
  finance: FINANCE_SCENARIO_CONFIG,
  health: HEALTH_SCENARIO_CONFIG,
  family: FAMILY_SCENARIO_CONFIG
};

export function generatePrompt(
  scenario: ChatScenario,
  context: SajuContext,
  userMessage: string
): string {
  switch (scenario) {
    case 'love':
      return generateLovePrompt(context, userMessage);
    case 'career':
      return generateCareerPrompt(context, userMessage);
    case 'finance':
      return generateFinancePrompt(context, userMessage);
    case 'health':
      return generateHealthPrompt(context, userMessage);
    case 'family':
      return generateFamilyPrompt(context, userMessage);
    default:
      throw new Error(`Unknown scenario: ${scenario}`);
  }
}

export function getSystemPrompt(scenario: ChatScenario): string {
  return SCENARIO_CONFIGS[scenario].systemPrompt;
}

export {
  generateLovePrompt,
  generateCareerPrompt,
  generateFinancePrompt,
  generateHealthPrompt,
  generateFamilyPrompt
};
