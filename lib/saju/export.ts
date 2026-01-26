/**
 * 사주 분석 결과 내보내기 유틸리티
 * PDF 문서화 및 음성 합성
 */

import { PremiumStoryResult } from './storytelling';

// PDF 텍스트 생성 (클라이언트에서 html2pdf 또는 jsPDF 사용)
export function generatePDFContent(
  result: PremiumStoryResult,
  userName: string,
  birthDate: string
): string {
  const sections: string[] = [];

  // 표지
  sections.push(`
═══════════════════════════════════════════════════════════════

                     🔮 AI-PLANX 프리미엄 사주 분석 보고서 🔮

                     ${userName}님의 운명 분석서

                     생년월일: ${birthDate}
                     분석일: ${new Date().toLocaleDateString('ko-KR')}

═══════════════════════════════════════════════════════════════
`);

  // 프로필 요약
  sections.push(`
┌─────────────────────────────────────────────────────────────┐
│                        📋 프로필 요약                         │
├─────────────────────────────────────────────────────────────┤
│  일간(日干): ${result.profile.dayMasterName} (${result.profile.dayMaster})
│  오행: ${result.profile.element}
│  띠: ${result.profile.animalSign}
│  핵심 키워드: ${result.profile.coreTraits.join(', ')}
└─────────────────────────────────────────────────────────────┘
`);

  // 인트로 스토리
  sections.push(`
📖 당신의 이야기
───────────────────────────────────────────────────────────────
${result.introStory}
`);

  // 성격 심층 분석
  sections.push(`
🧠 성격 심층 분석
───────────────────────────────────────────────────────────────
■ 타고난 성향
  ${result.personalityDeepDive.innateNature}

■ 숨겨진 잠재력
  ${result.personalityDeepDive.hiddenPotential}

■ 주의할 점
  ${result.personalityDeepDive.shadowSide}

■ 인생의 교훈
  ${result.personalityDeepDive.lifeLesson}
`);

  // 대운 분석
  sections.push(`
🌊 대운 (10년 주기) 분석
───────────────────────────────────────────────────────────────
${result.majorCycles.map(cycle => `
▶ ${cycle.startAge}세 ~ ${cycle.endAge}세 | ${cycle.stem}${cycle.branch} (${cycle.element})
  테마: ${cycle.theme}
  기회: ${cycle.opportunities.join(', ')}
  도전: ${cycle.challenges.join(', ')}
  조언: ${cycle.advice}
`).join('\n')}
`);

  // 연운 분석
  sections.push(`
📅 향후 5년 연운 분석
───────────────────────────────────────────────────────────────
${result.yearlyFortunes.map(fortune => `
★ ${fortune.year}년 (${fortune.animal}띠 해) - ${fortune.stem}${fortune.branch}
  ┌────────────────────────────────────────┐
  │ 종합: ${'★'.repeat(Math.floor(fortune.overall / 20))}${'☆'.repeat(5 - Math.floor(fortune.overall / 20))} ${fortune.overall}점
  │ 재물: ${'★'.repeat(Math.floor(fortune.wealth / 20))}${'☆'.repeat(5 - Math.floor(fortune.wealth / 20))} ${fortune.wealth}점
  │ 애정: ${'★'.repeat(Math.floor(fortune.love / 20))}${'☆'.repeat(5 - Math.floor(fortune.love / 20))} ${fortune.love}점
  │ 직업: ${'★'.repeat(Math.floor(fortune.career / 20))}${'☆'.repeat(5 - Math.floor(fortune.career / 20))} ${fortune.career}점
  │ 건강: ${'★'.repeat(Math.floor(fortune.health / 20))}${'☆'.repeat(5 - Math.floor(fortune.health / 20))} ${fortune.health}점
  └────────────────────────────────────────┘
  키워드: ${fortune.keywords.join(' | ')}
  기회: ${fortune.opportunities.join(', ')}
  주의: ${fortune.risks.join(', ')}
`).join('\n')}
`);

  // 오늘의 운세
  sections.push(`
☀️ 오늘의 운세 (${result.dailyFortune.date})
───────────────────────────────────────────────────────────────
일진: ${result.dailyFortune.stem}${result.dailyFortune.branch}
운세 점수: ${result.dailyFortune.overallScore}/100

행운의 시간: ${result.dailyFortune.luckyTime}
행운의 색상: ${result.dailyFortune.luckyColor}
행운의 숫자: ${result.dailyFortune.luckyNumber}
행운의 방향: ${result.dailyFortune.luckyDirection}

오늘의 조언: ${result.dailyFortune.advice}
주의사항: ${result.dailyFortune.warning}

💫 오늘의 확언:
"${result.dailyFortune.affirmation}"
`);

  // 인간관계
  sections.push(`
💑 인간관계 분석
───────────────────────────────────────────────────────────────
■ 이상적인 파트너
  ${result.relationships.idealPartner}

■ 잘 맞는 유형
${result.relationships.compatibleTypes.map(t => `  • ${t}`).join('\n')}

■ 주의가 필요한 유형
${result.relationships.challengingTypes.map(t => `  • ${t}`).join('\n')}

■ 우정 스타일
  ${result.relationships.friendshipStyle}

■ 가족 관계
  ${result.relationships.familyDynamics}
`);

  // 직업 적성
  sections.push(`
💼 직업 적성 분석
───────────────────────────────────────────────────────────────
${result.careerMatches.map(career => `
▶ ${career.field} (적합도: ${career.matchScore}%)
  이유: ${career.reasons.join(', ')}
  성공 요인: ${career.successFactors.join(', ')}
  주의점: ${career.risks.join(', ')}
  추천 역할: ${career.idealRole}
`).join('\n')}
`);

  // 재물운
  sections.push(`
💰 재물운 분석
───────────────────────────────────────────────────────────────
■ 돈 성향: ${result.wealthProfile.moneyPersonality}
■ 수입 스타일: ${result.wealthProfile.incomeStyle}
■ 투자 조언: ${result.wealthProfile.investmentAdvice}
■ 재물 전성기: ${result.wealthProfile.wealthPeakPeriod}

⚠️ 재정적 주의사항:
${result.wealthProfile.financialRisks.map(r => `  • ${r}`).join('\n')}
`);

  // 건강
  sections.push(`
🏥 건강 분석
───────────────────────────────────────────────────────────────
■ 체질: ${result.healthProfile.constitutionType}

■ 취약 부위:
${result.healthProfile.vulnerabilities.map(v => `  • ${v}`).join('\n')}

■ 예방 수칙:
${result.healthProfile.preventiveMeasures.map(m => `  • ${m}`).join('\n')}

■ 추천 운동: ${result.healthProfile.idealExercise}

■ 식이 권장:
${result.healthProfile.dietRecommendations.map(d => `  • ${d}`).join('\n')}
`);

  // 인생 가이드
  sections.push(`
🌟 인생 가이드
───────────────────────────────────────────────────────────────
■ 인생 사명
  "${result.lifeGuidance.missionStatement}"

■ 올해의 테마
  ${result.lifeGuidance.yearlyTheme}

■ 현재 시기 조언
  ${result.lifeGuidance.currentPhaseAdvice}

■ 미래 전망
  ${result.lifeGuidance.futureOutlook}
`);

  // 행운의 요소
  sections.push(`
🍀 행운의 요소
───────────────────────────────────────────────────────────────
■ 행운의 색상: ${result.luckyElements.colors.join(', ')}
■ 행운의 숫자: ${result.luckyElements.numbers.join(', ')}
■ 행운의 방향: ${result.luckyElements.directions.join(', ')}
■ 행운의 보석: ${result.luckyElements.gemstones.join(', ')}
■ 행운의 식물: ${result.luckyElements.plants.join(', ')}
`);

  // 마무리
  sections.push(`
═══════════════════════════════════════════════════════════════

                     🙏 ${userName}님의 행복을 기원합니다 🙏

                     AI-PLANX Premium Analysis Report
                     © ${new Date().getFullYear()} AI-PlanX

                     이 보고서는 사주명리학과 AI 기술을 결합하여
                     작성되었습니다. 참고 자료로 활용해 주세요.

═══════════════════════════════════════════════════════════════
`);

  return sections.join('\n');
}

// 음성 합성용 스크립트 생성
export function generateVoiceScript(
  result: PremiumStoryResult,
  userName: string,
  options: {
    includeIntro?: boolean;
    includePersonality?: boolean;
    includeMajorCycles?: boolean;
    includeYearlyFortune?: boolean;
    includeDailyFortune?: boolean;
    includeRelationships?: boolean;
    includeCareer?: boolean;
    includeWealth?: boolean;
    includeHealth?: boolean;
    includeGuidance?: boolean;
  } = {}
): string {
  const {
    includeIntro = true,
    includePersonality = true,
    includeMajorCycles = true,
    includeYearlyFortune = true,
    includeDailyFortune = true,
    includeRelationships = true,
    includeCareer = true,
    includeWealth = true,
    includeHealth = true,
    includeGuidance = true,
  } = options;

  const scripts: string[] = [];

  // 오프닝
  scripts.push(`안녕하세요, ${userName}님. AI사주의 프리미엄 사주 분석 결과를 음성으로 전해드립니다.`);
  scripts.push(`잠시 편안하게 자리에 앉아 당신만의 운명 이야기에 귀 기울여 주세요.`);
  scripts.push(`[잠시 쉼]`);

  // 인트로
  if (includeIntro) {
    scripts.push(`먼저 당신의 사주 프로필을 말씀드리겠습니다.`);
    scripts.push(`${userName}님은 ${result.profile.animalSign}띠로 태어나셨습니다.`);
    scripts.push(`일간은 ${result.profile.dayMasterName}이며, ${result.profile.element} 오행의 기운을 타고 나셨습니다.`);
    scripts.push(`당신을 표현하는 핵심 키워드는 ${result.profile.coreTraits.join(', ')} 입니다.`);
    scripts.push(`[잠시 쉼]`);
    scripts.push(result.introStory);
    scripts.push(`[잠시 쉼]`);
  }

  // 성격 심층 분석
  if (includePersonality) {
    scripts.push(`이제 성격 심층 분석을 말씀드리겠습니다.`);
    scripts.push(`당신의 타고난 성향은 다음과 같습니다.`);
    scripts.push(result.personalityDeepDive.innateNature);
    scripts.push(`[잠시 쉼]`);
    scripts.push(`당신 안에 숨겨진 잠재력이 있습니다.`);
    scripts.push(result.personalityDeepDive.hiddenPotential);
    scripts.push(`[잠시 쉼]`);
    scripts.push(`다만, 주의해야 할 부분도 있습니다.`);
    scripts.push(result.personalityDeepDive.shadowSide);
    scripts.push(`[잠시 쉼]`);
    scripts.push(`이번 생에서 배워야 할 교훈은 다음과 같습니다.`);
    scripts.push(result.personalityDeepDive.lifeLesson);
    scripts.push(`[잠시 쉼]`);
  }

  // 대운 분석
  if (includeMajorCycles && result.majorCycles.length > 0) {
    scripts.push(`이제 대운, 즉 10년 단위의 큰 흐름을 말씀드리겠습니다.`);

    result.majorCycles.slice(0, 4).forEach(cycle => {
      scripts.push(`${cycle.startAge}세부터 ${cycle.endAge}세까지는 ${cycle.theme}입니다.`);
      scripts.push(`이 시기의 기회는 ${cycle.opportunities.join(', ')} 입니다.`);
      scripts.push(`도전 과제는 ${cycle.challenges.join(', ')} 입니다.`);
      scripts.push(`조언을 드리자면, ${cycle.advice}`);
      scripts.push(`[잠시 쉼]`);
    });
  }

  // 연운 분석
  if (includeYearlyFortune && result.yearlyFortunes.length > 0) {
    scripts.push(`이제 향후 5년간의 연운을 말씀드리겠습니다.`);

    result.yearlyFortunes.forEach(fortune => {
      scripts.push(`${fortune.year}년, ${fortune.animal}띠 해의 운세입니다.`);
      scripts.push(`종합 운세는 100점 만점에 ${fortune.overall}점입니다.`);
      scripts.push(`이 해의 키워드는 ${fortune.keywords.join(', ')} 입니다.`);

      if (fortune.opportunities.length > 0) {
        scripts.push(`기회 요소로는 ${fortune.opportunities.join(', ')} 가 있습니다.`);
      }
      if (fortune.risks.length > 0) {
        scripts.push(`주의할 점으로는 ${fortune.risks.join(', ')} 입니다.`);
      }
      scripts.push(`[잠시 쉼]`);
    });
  }

  // 오늘의 운세
  if (includeDailyFortune) {
    scripts.push(`오늘의 운세를 말씀드리겠습니다.`);
    scripts.push(`오늘의 일진은 ${result.dailyFortune.stem}${result.dailyFortune.branch}이며, 운세 점수는 ${result.dailyFortune.overallScore}점입니다.`);
    scripts.push(`행운의 시간은 ${result.dailyFortune.luckyTime}이고, 행운의 색상은 ${result.dailyFortune.luckyColor}입니다.`);
    scripts.push(`행운의 숫자는 ${result.dailyFortune.luckyNumber}, 행운의 방향은 ${result.dailyFortune.luckyDirection}입니다.`);
    scripts.push(`오늘의 조언입니다. ${result.dailyFortune.advice}`);
    scripts.push(`주의사항은 다음과 같습니다. ${result.dailyFortune.warning}`);
    scripts.push(`[잠시 쉼]`);
    scripts.push(`오늘의 확언을 따라 읽어보세요.`);
    scripts.push(`"${result.dailyFortune.affirmation}"`);
    scripts.push(`[잠시 쉼]`);
  }

  // 인간관계
  if (includeRelationships) {
    scripts.push(`인간관계에 대해 말씀드리겠습니다.`);
    scripts.push(`당신에게 이상적인 파트너는 ${result.relationships.idealPartner}`);
    scripts.push(`[잠시 쉼]`);
    scripts.push(`친구 관계에서 당신은 ${result.relationships.friendshipStyle}`);
    scripts.push(`[잠시 쉼]`);
  }

  // 직업 적성
  if (includeCareer && result.careerMatches.length > 0) {
    scripts.push(`직업 적성에 대해 말씀드리겠습니다.`);

    result.careerMatches.slice(0, 3).forEach(career => {
      scripts.push(`${career.field} 분야는 적합도 ${career.matchScore}%입니다.`);
      scripts.push(`이 분야가 맞는 이유는 ${career.reasons.join(', ')} 입니다.`);
      scripts.push(`추천하는 역할은 ${career.idealRole} 입니다.`);
      scripts.push(`[잠시 쉼]`);
    });
  }

  // 재물운
  if (includeWealth) {
    scripts.push(`재물운에 대해 말씀드리겠습니다.`);
    scripts.push(`당신의 돈 성향은 ${result.wealthProfile.moneyPersonality}`);
    scripts.push(`수입을 올리는 스타일은 ${result.wealthProfile.incomeStyle}`);
    scripts.push(`투자에 대한 조언입니다. ${result.wealthProfile.investmentAdvice}`);
    scripts.push(`재물 전성기는 ${result.wealthProfile.wealthPeakPeriod} 로 예상됩니다.`);
    scripts.push(`[잠시 쉼]`);
  }

  // 건강
  if (includeHealth) {
    scripts.push(`건강에 대해 말씀드리겠습니다.`);
    scripts.push(`당신의 체질은 ${result.healthProfile.constitutionType} 입니다.`);
    scripts.push(`주의해야 할 부위는 ${result.healthProfile.vulnerabilities.join(', ')} 입니다.`);
    scripts.push(`추천하는 운동은 ${result.healthProfile.idealExercise} 입니다.`);
    scripts.push(`[잠시 쉼]`);
  }

  // 인생 가이드
  if (includeGuidance) {
    scripts.push(`마지막으로 인생 가이드를 말씀드리겠습니다.`);
    scripts.push(`당신의 인생 사명입니다.`);
    scripts.push(result.lifeGuidance.missionStatement);
    scripts.push(`[잠시 쉼]`);
    scripts.push(`현재 시기에 대한 조언입니다.`);
    scripts.push(result.lifeGuidance.currentPhaseAdvice);
    scripts.push(`[잠시 쉼]`);
    scripts.push(`미래 전망입니다.`);
    scripts.push(result.lifeGuidance.futureOutlook);
    scripts.push(`[잠시 쉼]`);
  }

  // 클로징
  scripts.push(`이상으로 ${userName}님의 프리미엄 사주 분석을 마치겠습니다.`);
  scripts.push(`이 분석이 당신의 인생 여정에 작은 등불이 되기를 바랍니다.`);
  scripts.push(`행운의 색상 ${result.luckyElements.colors.join(', ')}을 가까이 두시고,`);
  scripts.push(`행운의 숫자 ${result.luckyElements.numbers.join(', ')}을 기억해주세요.`);
  scripts.push(`${userName}님의 앞날에 행운이 함께하기를 진심으로 기원합니다.`);
  scripts.push(`감사합니다.`);

  return scripts.join('\n');
}

// 브라우저 TTS 음성 합성 (Web Speech API 사용)
export function speakText(
  text: string,
  options: {
    lang?: string;
    rate?: number;
    pitch?: number;
    volume?: number;
    voiceIndex?: number;
    onEnd?: () => void;
    onError?: (error: Error) => void;
  } = {}
): SpeechSynthesisUtterance | null {
  if (typeof window === 'undefined' || !('speechSynthesis' in window)) {
    console.warn('Speech synthesis is not supported in this browser');
    return null;
  }

  const {
    lang = 'ko-KR',
    rate = 0.9,
    pitch = 1,
    volume = 1,
    voiceIndex = 0,
    onEnd,
    onError,
  } = options;

  // [잠시 쉼] 처리
  const processedText = text
    .replace(/\[잠시 쉼\]/g, '.')
    .replace(/\n/g, ' ');

  const utterance = new SpeechSynthesisUtterance(processedText);
  utterance.lang = lang;
  utterance.rate = rate;
  utterance.pitch = pitch;
  utterance.volume = volume;

  // 한국어 음성 선택
  const voices = window.speechSynthesis.getVoices();
  const koreanVoices = voices.filter(v => v.lang.includes('ko'));

  if (koreanVoices.length > voiceIndex) {
    utterance.voice = koreanVoices[voiceIndex];
  }

  if (onEnd) {
    utterance.onend = onEnd;
  }

  if (onError) {
    utterance.onerror = (event) => onError(new Error(event.error));
  }

  window.speechSynthesis.speak(utterance);

  return utterance;
}

// 음성 합성 중지
export function stopSpeaking(): void {
  if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
    window.speechSynthesis.cancel();
  }
}

// 음성 합성 일시 정지
export function pauseSpeaking(): void {
  if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
    window.speechSynthesis.pause();
  }
}

// 음성 합성 재개
export function resumeSpeaking(): void {
  if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
    window.speechSynthesis.resume();
  }
}

// 사용 가능한 한국어 음성 목록 가져오기
export function getKoreanVoices(): SpeechSynthesisVoice[] {
  if (typeof window === 'undefined' || !('speechSynthesis' in window)) {
    return [];
  }

  return window.speechSynthesis.getVoices().filter(v => v.lang.includes('ko'));
}

// HTML 형식의 프린트 가능한 보고서 생성
export function generatePrintableHTML(
  result: PremiumStoryResult,
  userName: string,
  birthDate: string
): string {
  return `
<!DOCTYPE html>
<html lang="ko">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${userName}님의 사주 분석 보고서</title>
  <style>
    @import url('https://fonts.googleapis.com/css2?family=Noto+Sans+KR:wght@300;400;500;700&display=swap');

    * {
      margin: 0;
      padding: 0;
      box-sizing: border-box;
    }

    body {
      font-family: 'Noto Sans KR', sans-serif;
      line-height: 1.8;
      color: #333;
      background: #f5f5f5;
    }

    .container {
      max-width: 800px;
      margin: 0 auto;
      background: white;
      box-shadow: 0 0 20px rgba(0,0,0,0.1);
    }

    .cover {
      background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
      color: white;
      padding: 60px 40px;
      text-align: center;
    }

    .cover h1 {
      font-size: 28px;
      margin-bottom: 20px;
    }

    .cover .subtitle {
      font-size: 18px;
      opacity: 0.9;
    }

    .section {
      padding: 40px;
      border-bottom: 1px solid #eee;
    }

    .section-title {
      font-size: 20px;
      color: #667eea;
      margin-bottom: 20px;
      display: flex;
      align-items: center;
      gap: 10px;
    }

    .profile-grid {
      display: grid;
      grid-template-columns: repeat(2, 1fr);
      gap: 15px;
    }

    .profile-item {
      background: #f8f9fa;
      padding: 15px;
      border-radius: 8px;
    }

    .profile-label {
      font-size: 12px;
      color: #666;
      margin-bottom: 5px;
    }

    .profile-value {
      font-size: 16px;
      font-weight: 500;
    }

    .story-box {
      background: linear-gradient(to right, #ffecd2, #fcb69f);
      padding: 25px;
      border-radius: 12px;
      font-style: italic;
    }

    .fortune-card {
      background: #f8f9fa;
      border-radius: 12px;
      padding: 20px;
      margin-bottom: 15px;
    }

    .fortune-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 15px;
    }

    .fortune-year {
      font-size: 18px;
      font-weight: 600;
    }

    .fortune-scores {
      display: grid;
      grid-template-columns: repeat(5, 1fr);
      gap: 10px;
      text-align: center;
    }

    .score-item {
      padding: 10px;
      background: white;
      border-radius: 8px;
    }

    .score-label {
      font-size: 11px;
      color: #666;
    }

    .score-value {
      font-size: 18px;
      font-weight: 600;
      color: #667eea;
    }

    .badge {
      display: inline-block;
      padding: 4px 12px;
      background: #667eea;
      color: white;
      border-radius: 20px;
      font-size: 12px;
      margin-right: 8px;
      margin-bottom: 8px;
    }

    .advice-box {
      background: #e8f5e9;
      border-left: 4px solid #4caf50;
      padding: 15px 20px;
      margin: 15px 0;
    }

    .warning-box {
      background: #fff3e0;
      border-left: 4px solid #ff9800;
      padding: 15px 20px;
      margin: 15px 0;
    }

    .lucky-grid {
      display: grid;
      grid-template-columns: repeat(3, 1fr);
      gap: 15px;
    }

    .lucky-item {
      text-align: center;
      padding: 20px;
      background: #f8f9fa;
      border-radius: 12px;
    }

    .lucky-icon {
      font-size: 24px;
      margin-bottom: 10px;
    }

    .footer {
      background: #333;
      color: white;
      padding: 30px;
      text-align: center;
    }

    @media print {
      body {
        background: white;
      }
      .container {
        box-shadow: none;
      }
      .section {
        page-break-inside: avoid;
      }
    }
  </style>
</head>
<body>
  <div class="container">
    <div class="cover">
      <h1>🔮 프리미엄 사주 분석 보고서</h1>
      <div class="subtitle">${userName}님의 운명 분석서</div>
      <p style="margin-top: 20px; opacity: 0.8;">
        생년월일: ${birthDate}<br>
        분석일: ${new Date().toLocaleDateString('ko-KR')}
      </p>
    </div>

    <div class="section">
      <h2 class="section-title">📋 프로필 요약</h2>
      <div class="profile-grid">
        <div class="profile-item">
          <div class="profile-label">일간 (日干)</div>
          <div class="profile-value">${result.profile.dayMasterName} (${result.profile.dayMaster})</div>
        </div>
        <div class="profile-item">
          <div class="profile-label">오행</div>
          <div class="profile-value">${result.profile.element}</div>
        </div>
        <div class="profile-item">
          <div class="profile-label">띠</div>
          <div class="profile-value">${result.profile.animalSign}</div>
        </div>
        <div class="profile-item">
          <div class="profile-label">핵심 키워드</div>
          <div class="profile-value">${result.profile.coreTraits.join(', ')}</div>
        </div>
      </div>
    </div>

    <div class="section">
      <h2 class="section-title">📖 당신의 이야기</h2>
      <div class="story-box">
        ${result.introStory.replace(/\n/g, '<br>')}
      </div>
    </div>

    <div class="section">
      <h2 class="section-title">🧠 성격 심층 분석</h2>
      <div class="advice-box">
        <strong>타고난 성향</strong><br>
        ${result.personalityDeepDive.innateNature}
      </div>
      <div class="advice-box">
        <strong>숨겨진 잠재력</strong><br>
        ${result.personalityDeepDive.hiddenPotential}
      </div>
      <div class="warning-box">
        <strong>주의할 점</strong><br>
        ${result.personalityDeepDive.shadowSide}
      </div>
      <div class="advice-box">
        <strong>인생의 교훈</strong><br>
        ${result.personalityDeepDive.lifeLesson}
      </div>
    </div>

    <div class="section">
      <h2 class="section-title">📅 향후 5년 운세</h2>
      ${result.yearlyFortunes.map(fortune => `
        <div class="fortune-card">
          <div class="fortune-header">
            <span class="fortune-year">${fortune.year}년 (${fortune.animal}띠)</span>
            <span>${fortune.stem}${fortune.branch}</span>
          </div>
          <div class="fortune-scores">
            <div class="score-item">
              <div class="score-label">종합</div>
              <div class="score-value">${fortune.overall}</div>
            </div>
            <div class="score-item">
              <div class="score-label">재물</div>
              <div class="score-value">${fortune.wealth}</div>
            </div>
            <div class="score-item">
              <div class="score-label">애정</div>
              <div class="score-value">${fortune.love}</div>
            </div>
            <div class="score-item">
              <div class="score-label">직업</div>
              <div class="score-value">${fortune.career}</div>
            </div>
            <div class="score-item">
              <div class="score-label">건강</div>
              <div class="score-value">${fortune.health}</div>
            </div>
          </div>
          <div style="margin-top: 15px;">
            ${fortune.keywords.map(k => `<span class="badge">${k}</span>`).join('')}
          </div>
        </div>
      `).join('')}
    </div>

    <div class="section">
      <h2 class="section-title">🍀 행운의 요소</h2>
      <div class="lucky-grid">
        <div class="lucky-item">
          <div class="lucky-icon">🎨</div>
          <div class="profile-label">행운의 색상</div>
          <div>${result.luckyElements.colors.join(', ')}</div>
        </div>
        <div class="lucky-item">
          <div class="lucky-icon">🔢</div>
          <div class="profile-label">행운의 숫자</div>
          <div>${result.luckyElements.numbers.join(', ')}</div>
        </div>
        <div class="lucky-item">
          <div class="lucky-icon">🧭</div>
          <div class="profile-label">행운의 방향</div>
          <div>${result.luckyElements.directions.join(', ')}</div>
        </div>
        <div class="lucky-item">
          <div class="lucky-icon">💎</div>
          <div class="profile-label">행운의 보석</div>
          <div>${result.luckyElements.gemstones.join(', ')}</div>
        </div>
        <div class="lucky-item">
          <div class="lucky-icon">🌿</div>
          <div class="profile-label">행운의 식물</div>
          <div>${result.luckyElements.plants.join(', ')}</div>
        </div>
        <div class="lucky-item">
          <div class="lucky-icon">🌟</div>
          <div class="profile-label">인생 사명</div>
          <div style="font-size: 12px;">${result.lifeGuidance.missionStatement.slice(0, 50)}...</div>
        </div>
      </div>
    </div>

    <div class="footer">
      <p>🙏 ${userName}님의 행복을 기원합니다 🙏</p>
      <p style="margin-top: 10px; font-size: 12px; opacity: 0.7;">
        AI-PLANX Premium Analysis Report<br>
        © ${new Date().getFullYear()} AI-PlanX
      </p>
    </div>
  </div>
</body>
</html>
  `;
}
