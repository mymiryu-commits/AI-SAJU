/**
 * 사주 분석 결과 PDF 생성기
 *
 * 서버 사이드에서 PDF 문서를 생성합니다.
 * @jspdf 라이브러리 사용 (한글 폰트 지원)
 */

import { jsPDF } from 'jspdf';
import type {
  UserInput,
  SajuChart,
  OhengBalance,
  AnalysisResult,
  PremiumContent,
  MonthlyAction,
  Element
} from '@/types/saju';
import {
  ELEMENT_KOREAN,
  CAREER_KOREAN,
  INTEREST_KOREAN,
  CONCERN_KOREAN
} from '@/types/saju';

// 폰트 임베딩은 실제 프로덕션에서 처리
// 여기서는 기본 구조만 정의

interface PDFGeneratorOptions {
  user: UserInput;
  saju: SajuChart;
  oheng: OhengBalance;
  result: AnalysisResult;
  premium?: PremiumContent;
  targetYear?: number;
}

interface PDFSection {
  title: string;
  content: string[];
}

/**
 * 사주 분석 PDF 문서 생성
 */
export async function generateSajuPDF(options: PDFGeneratorOptions): Promise<Buffer> {
  const { user, saju, oheng, result, premium, targetYear = 2026 } = options;

  // PDF 생성 (A4 사이즈)
  const doc = new jsPDF({
    orientation: 'portrait',
    unit: 'mm',
    format: 'a4'
  });

  let yPos = 20;
  const pageWidth = 210;
  const pageHeight = 297;
  const margin = 20;
  const contentWidth = pageWidth - margin * 2;
  const lineHeight = 7;

  // 헬퍼 함수: 줄바꿈 체크 및 페이지 추가
  const checkNewPage = (height: number = lineHeight) => {
    if (yPos + height > pageHeight - margin) {
      doc.addPage();
      yPos = margin;
    }
  };

  // 헬퍼 함수: 텍스트 출력
  const addText = (text: string, fontSize: number = 10, isBold: boolean = false) => {
    doc.setFontSize(fontSize);
    checkNewPage(fontSize * 0.5);

    // 긴 텍스트 줄바꿈 처리
    const lines = doc.splitTextToSize(text, contentWidth);
    lines.forEach((line: string) => {
      checkNewPage();
      doc.text(line, margin, yPos);
      yPos += lineHeight;
    });
  };

  // 헬퍼 함수: 섹션 제목
  const addSectionTitle = (title: string) => {
    yPos += 5;
    checkNewPage(15);
    doc.setFontSize(14);
    doc.text(title, margin, yPos);
    yPos += 3;
    doc.setLineWidth(0.5);
    doc.line(margin, yPos, pageWidth - margin, yPos);
    yPos += 10;
  };

  // 헬퍼 함수: 서브 섹션
  const addSubSection = (title: string) => {
    yPos += 3;
    checkNewPage(12);
    doc.setFontSize(12);
    doc.text(`■ ${title}`, margin, yPos);
    yPos += 8;
  };

  // ========== 표지 ==========
  doc.setFontSize(28);
  doc.text('사주팔자 분석 리포트', pageWidth / 2, 80, { align: 'center' });

  doc.setFontSize(16);
  doc.text(`${targetYear}년 운세 분석`, pageWidth / 2, 100, { align: 'center' });

  doc.setFontSize(14);
  doc.text(`성명: ${user.name}`, pageWidth / 2, 130, { align: 'center' });
  doc.text(`생년월일: ${user.birthDate}`, pageWidth / 2, 140, { align: 'center' });
  if (user.birthTime) {
    doc.text(`출생시간: ${user.birthTime}`, pageWidth / 2, 150, { align: 'center' });
  }
  doc.text(`성별: ${user.gender === 'male' ? '남성' : '여성'}`, pageWidth / 2, 160, { align: 'center' });

  doc.setFontSize(10);
  doc.text(`발행일: ${new Date().toLocaleDateString('ko-KR')}`, pageWidth / 2, 250, { align: 'center' });
  doc.text('AI-SAJU Premium Service', pageWidth / 2, 260, { align: 'center' });

  // ========== 본문 시작 ==========
  doc.addPage();
  yPos = margin;

  // 1. 사주팔자 기본 정보
  addSectionTitle('1. 사주팔자 기본 정보');

  addSubSection('사주 구성');
  const pillars = [
    { name: '년주(年柱)', pillar: saju.yearPillar },
    { name: '월주(月柱)', pillar: saju.monthPillar },
    { name: '일주(日柱)', pillar: saju.dayPillar },
    { name: '시주(時柱)', pillar: saju.hourPillar }
  ];

  pillars.forEach(({ name, pillar }) => {
    if (pillar) {
      const stemElement = pillar.stemElement ? ELEMENT_KOREAN[pillar.stemElement] : '';
      const branchElement = pillar.branchElement ? ELEMENT_KOREAN[pillar.branchElement] : '';
      addText(`${name}: ${pillar.stem}${pillar.branch} (${stemElement}/${branchElement})`);
    }
  });

  // 2. 오행 분석
  addSectionTitle('2. 오행(五行) 분석');

  addSubSection('오행 분포');
  const elements: Element[] = ['wood', 'fire', 'earth', 'metal', 'water'];
  elements.forEach(el => {
    const percentage = oheng[el] || 0;
    const bar = '█'.repeat(Math.round(percentage / 5)) + '░'.repeat(20 - Math.round(percentage / 5));
    addText(`${ELEMENT_KOREAN[el]}: ${bar} ${percentage.toFixed(1)}%`);
  });

  if (result.ohengAnalysis) {
    addSubSection('용신/기신 분석');
    if (result.ohengAnalysis.yongsin?.length) {
      addText(`용신(用神): ${result.ohengAnalysis.yongsin.map(e => ELEMENT_KOREAN[e]).join(', ')}`);
      addText('- 용신은 당신에게 이로운 기운으로, 이 오행을 활용하면 운이 좋아집니다.');
    }
    if (result.ohengAnalysis.gisin?.length) {
      addText(`기신(忌神): ${result.ohengAnalysis.gisin.map(e => ELEMENT_KOREAN[e]).join(', ')}`);
      addText('- 기신은 피해야 할 기운으로, 이 오행을 피하면 흉함을 줄일 수 있습니다.');
    }
  }

  // 3. 성격 분석
  if (result.personalityAnalysis) {
    addSectionTitle('3. 성격 및 특성 분석');

    const personality = result.personalityAnalysis;
    addSubSection('핵심 성격');
    personality.coreTraits?.forEach((trait: string) => addText(`• ${trait}`));

    if (personality.strengths?.length) {
      addSubSection('장점');
      personality.strengths.forEach((s: string) => addText(`• ${s}`));
    }

    if (personality.weaknesses?.length) {
      addSubSection('단점 및 보완점');
      personality.weaknesses.forEach((w: string) => addText(`• ${w}`));
    }
  }

  // 4. 또래 비교 (있는 경우)
  if (result.peerComparison) {
    addSectionTitle('4. 또래 비교 분석');

    const peer = result.peerComparison;
    addSubSection('또래 대비 위치');
    addText(`분석 대상: ${peer.ageGroup || '동년배'} 그룹`);
    addText(`종합 순위: 상위 ${100 - (peer.overallRank || 50)}%`);

    if (peer.scores) {
      addSubSection('세부 점수');
      if (peer.scores.careerMaturity !== undefined) {
        addText(`커리어 성숙도: ${peer.scores.careerMaturity}점`);
      }
      if (peer.scores.decisionStability !== undefined) {
        addText(`결정 안정성: ${peer.scores.decisionStability}점`);
      }
      if (peer.scores.wealthManagement !== undefined) {
        addText(`재물 관리력: ${peer.scores.wealthManagement}점`);
      }
    }
  }

  // 5. 프리미엄 콘텐츠 (있는 경우)
  if (premium) {
    // 가족 영향 분석
    if (premium.familyImpact) {
      addSectionTitle('5. 가족 관계 분석');
      const family = premium.familyImpact;

      if (family.spouseAnalysis) {
        addSubSection('배우자 관계');
        addText(`올해 영향도: ${family.spouseAnalysis.impact || '보통'}`);
        if (family.spouseAnalysis.advice) {
          addText(`조언: ${family.spouseAnalysis.advice}`);
        }
      }

      if (family.childrenAnalysis?.length) {
        addSubSection('자녀 관계');
        family.childrenAnalysis.forEach((child: { age: number; element: Element; advice?: string }, idx: number) => {
          addText(`자녀 ${idx + 1} (${child.age}세): ${child.advice || '좋은 관계 유지'}`);
        });
      }
    }

    // 직업 분석
    if (premium.careerAnalysis) {
      addSectionTitle('6. 직업 및 커리어 분석');
      const career = premium.careerAnalysis;

      addSubSection('현재 직업 적합도');
      if (user.careerType) {
        addText(`현재 직업: ${CAREER_KOREAN[user.careerType] || user.careerType}`);
      }
      addText(`적합도 점수: ${career.matchScore || 0}점 / 100점`);

      if (career.strengths?.length) {
        addSubSection('강점');
        career.strengths.forEach((s: string) => addText(`• ${s}`));
      }

      if (career.recommendations?.length) {
        addSubSection('추천 직종');
        career.recommendations.forEach((r: string) => addText(`• ${r}`));
      }
    }

    // 월별 액션플랜
    if (premium.monthlyActionPlan?.length) {
      addSectionTitle('7. 월별 행운 액션플랜');

      premium.monthlyActionPlan.forEach((action: MonthlyAction) => {
        checkNewPage(30);
        addSubSection(`${action.month}월`);
        addText(`테마: ${action.theme}`);
        addText(`행운 요소: ${action.luckyElement}`);
        addText(`행동 지침: ${action.actionItems?.join(', ') || ''}`);
        if (action.warning) {
          addText(`주의사항: ${action.warning}`);
        }
      });
    }

    // 인생 타임라인
    if (premium.lifeTimeline) {
      addSectionTitle('8. 인생 타임라인');

      const timeline = premium.lifeTimeline;

      if (timeline.phases?.length) {
        addSubSection('인생 시기별 분석');
        timeline.phases.forEach((phase: { age: string; theme: string; description: string }) => {
          addText(`${phase.age}: ${phase.theme}`);
          addText(`  → ${phase.description}`);
        });
      }

      if (timeline.goldenWindows?.length) {
        addSubSection('황금 기회의 시기');
        timeline.goldenWindows.forEach((window: { period: string; opportunity: string }) => {
          addText(`• ${window.period}: ${window.opportunity}`);
        });
      }
    }

    // 타이밍 분석
    if (premium.timingAnalysis) {
      addSectionTitle('9. 최적 타이밍 분석');

      const timing = premium.timingAnalysis;

      if (timing.bestMonths?.length) {
        addSubSection('좋은 시기');
        addText(`추천 월: ${timing.bestMonths.join(', ')}월`);
      }

      if (timing.cautionMonths?.length) {
        addSubSection('주의 시기');
        addText(`주의 월: ${timing.cautionMonths.join(', ')}월`);
      }

      if (timing.majorDecisions) {
        addSubSection('중요 결정 가이드');
        Object.entries(timing.majorDecisions).forEach(([decision, advice]) => {
          addText(`• ${decision}: ${advice as string}`);
        });
      }
    }

    // 관심사별 전략
    if (premium.interestStrategies?.length) {
      addSectionTitle('10. 관심사별 맞춤 전략');

      premium.interestStrategies.forEach((strategy: { interest: string; strategy: string; actions: string[] }) => {
        addSubSection(INTEREST_KOREAN[strategy.interest as keyof typeof INTEREST_KOREAN] || strategy.interest);
        addText(strategy.strategy);
        if (strategy.actions?.length) {
          strategy.actions.forEach(action => addText(`  • ${action}`));
        }
      });
    }
  }

  // ========== 마무리 페이지 ==========
  doc.addPage();
  yPos = 100;

  doc.setFontSize(16);
  doc.text('분석을 마치며', pageWidth / 2, yPos, { align: 'center' });
  yPos += 20;

  doc.setFontSize(11);
  const closingText = [
    '이 분석 리포트는 사주팔자를 기반으로 한 참고 자료입니다.',
    '운명은 정해진 것이 아니라 자신의 선택과 노력에 따라 바뀔 수 있습니다.',
    '좋은 운은 준비된 자에게 찾아옵니다.',
    '',
    '더 자세한 상담이 필요하시면 프리미엄 서비스를 이용해 주세요.',
    '',
    `분석 생성일: ${new Date().toLocaleDateString('ko-KR')}`,
    'AI-SAJU - Your Fortune, Your Choice'
  ];

  closingText.forEach(line => {
    doc.text(line, pageWidth / 2, yPos, { align: 'center' });
    yPos += 8;
  });

  // PDF를 Buffer로 반환
  const pdfOutput = doc.output('arraybuffer');
  return Buffer.from(pdfOutput);
}

/**
 * PDF 파일명 생성
 */
export function generatePDFFilename(user: UserInput, targetYear: number = 2026): string {
  const date = new Date().toISOString().split('T')[0];
  const safeName = user.name.replace(/[^가-힣a-zA-Z0-9]/g, '');
  return `사주분석_${safeName}_${targetYear}년_${date}.pdf`;
}

/**
 * PDF 문서 섹션 데이터 생성 (텍스트 변환용)
 */
export function generatePDFSections(options: PDFGeneratorOptions): PDFSection[] {
  const { user, saju, oheng, result, premium, targetYear = 2026 } = options;
  const sections: PDFSection[] = [];

  // 기본 정보
  sections.push({
    title: '기본 정보',
    content: [
      `성명: ${user.name}`,
      `생년월일: ${user.birthDate}`,
      `출생시간: ${user.birthTime || '미상'}`,
      `성별: ${user.gender === 'male' ? '남성' : '여성'}`
    ]
  });

  // 사주 구성
  const sajuContent: string[] = [];
  if (saju.yearPillar) sajuContent.push(`년주: ${saju.yearPillar.stem}${saju.yearPillar.branch}`);
  if (saju.monthPillar) sajuContent.push(`월주: ${saju.monthPillar.stem}${saju.monthPillar.branch}`);
  if (saju.dayPillar) sajuContent.push(`일주: ${saju.dayPillar.stem}${saju.dayPillar.branch}`);
  if (saju.hourPillar) sajuContent.push(`시주: ${saju.hourPillar.stem}${saju.hourPillar.branch}`);
  sections.push({ title: '사주팔자', content: sajuContent });

  // 오행 분석
  const ohengContent = [
    `목(木): ${oheng.wood?.toFixed(1) || 0}%`,
    `화(火): ${oheng.fire?.toFixed(1) || 0}%`,
    `토(土): ${oheng.earth?.toFixed(1) || 0}%`,
    `금(金): ${oheng.metal?.toFixed(1) || 0}%`,
    `수(水): ${oheng.water?.toFixed(1) || 0}%`
  ];

  if (result.ohengAnalysis?.yongsin?.length) {
    ohengContent.push(`용신: ${result.ohengAnalysis.yongsin.map(e => ELEMENT_KOREAN[e]).join(', ')}`);
  }
  if (result.ohengAnalysis?.gisin?.length) {
    ohengContent.push(`기신: ${result.ohengAnalysis.gisin.map(e => ELEMENT_KOREAN[e]).join(', ')}`);
  }
  sections.push({ title: '오행 분석', content: ohengContent });

  // 성격 분석
  if (result.personalityAnalysis) {
    const personalityContent: string[] = [];
    if (result.personalityAnalysis.coreTraits?.length) {
      personalityContent.push('핵심 성격: ' + result.personalityAnalysis.coreTraits.join(', '));
    }
    if (result.personalityAnalysis.strengths?.length) {
      personalityContent.push('장점: ' + result.personalityAnalysis.strengths.join(', '));
    }
    if (result.personalityAnalysis.weaknesses?.length) {
      personalityContent.push('보완점: ' + result.personalityAnalysis.weaknesses.join(', '));
    }
    sections.push({ title: '성격 분석', content: personalityContent });
  }

  // 프리미엄 콘텐츠 섹션들...
  if (premium?.monthlyActionPlan?.length) {
    const monthlyContent = premium.monthlyActionPlan.map((m: MonthlyAction) =>
      `${m.month}월: ${m.theme} - ${m.actionItems?.join(', ') || ''}`
    );
    sections.push({ title: `${targetYear}년 월별 운세`, content: monthlyContent });
  }

  return sections;
}

export default {
  generateSajuPDF,
  generatePDFFilename,
  generatePDFSections
};
