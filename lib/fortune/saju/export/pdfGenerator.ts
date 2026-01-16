/**
 * 사주 분석 결과 PDF 생성기
 *
 * 서버 사이드에서 PDF 문서를 생성합니다.
 * @jspdf 라이브러리 사용 (한글 폰트 지원)
 */

import { jsPDF } from 'jspdf';
import { createKoreanPDF } from '@/lib/fonts/koreanFont';
import type {
  UserInput,
  SajuChart,
  SajuPillar,
  OhengBalance,
  PremiumContent,
  MonthlyAction,
  Element
} from '@/types/saju';
import {
  ELEMENT_KOREAN,
  CAREER_KOREAN,
  INTEREST_KOREAN
} from '@/types/saju';

interface PDFGeneratorOptions {
  user: UserInput;
  saju: SajuChart;
  oheng: OhengBalance;
  yongsin?: Element[];
  gisin?: Element[];
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
  const { user, saju, oheng, yongsin, gisin, premium, targetYear = 2026 } = options;

  // PDF 생성 (A4 사이즈, 한글 폰트 지원)
  const doc = await createKoreanPDF({
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
  const addText = (text: string, fontSize: number = 10) => {
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
  const pillars: { name: string; pillar?: SajuPillar }[] = [
    { name: '년주(年柱)', pillar: saju.year },
    { name: '월주(月柱)', pillar: saju.month },
    { name: '일주(日柱)', pillar: saju.day },
    { name: '시주(時柱)', pillar: saju.time }
  ];

  pillars.forEach(({ name, pillar }) => {
    if (pillar) {
      const elementKo = pillar.element ? ELEMENT_KOREAN[pillar.element] : '';
      addText(`${name}: ${pillar.heavenlyStem}${pillar.earthlyBranch} (${pillar.stemKorean}${pillar.branchKorean}) - ${elementKo}`);
    }
  });

  // 2. 오행 분석
  addSectionTitle('2. 오행(五行) 분석');

  addSubSection('오행 분포');
  const elements: Element[] = ['wood', 'fire', 'earth', 'metal', 'water'];
  elements.forEach(el => {
    const percentage = oheng[el] || 0;
    const barFilled = Math.round(percentage / 5);
    const bar = '█'.repeat(barFilled) + '░'.repeat(20 - barFilled);
    addText(`${ELEMENT_KOREAN[el]}: ${bar} ${percentage.toFixed(1)}%`);
  });

  if (yongsin?.length || gisin?.length) {
    addSubSection('용신/기신 분석');
    if (yongsin?.length) {
      addText(`용신(用神): ${yongsin.map(e => ELEMENT_KOREAN[e]).join(', ')}`);
      addText('- 용신은 당신에게 이로운 기운으로, 이 오행을 활용하면 운이 좋아집니다.');
    }
    if (gisin?.length) {
      addText(`기신(忌神): ${gisin.map(e => ELEMENT_KOREAN[e]).join(', ')}`);
      addText('- 기신은 피해야 할 기운으로, 이 오행을 피하면 흉함을 줄일 수 있습니다.');
    }
  }

  // 3. 프리미엄 콘텐츠 (있는 경우)
  if (premium) {
    // 가족 영향 분석
    if (premium.familyImpact) {
      addSectionTitle('3. 가족 관계 분석');
      const family = premium.familyImpact;

      addSubSection('가족 상황');
      addText(`배우자 스트레스: ${family.spouseStress === 'low' ? '낮음' : family.spouseStress === 'medium' ? '보통' : '높음'}`);
      addText(`자녀 영향: ${family.childrenImpact === 'positive' ? '긍정적' : family.childrenImpact === 'neutral' ? '중립' : '주의 필요'}`);
      addText(`부모 돌봄: ${family.parentCare}`);

      if (family.warnings?.length) {
        addSubSection('주의 사항');
        family.warnings.forEach(w => addText(`• ${w}`));
      }

      if (family.recommendations?.length) {
        addSubSection('권장 사항');
        family.recommendations.forEach(r => addText(`• ${r}`));
      }
    }

    // 직업 분석
    if (premium.careerAnalysis) {
      addSectionTitle('4. 직업 및 커리어 분석');
      const career = premium.careerAnalysis;

      addSubSection('현재 직업 적합도');
      if (user.careerType) {
        addText(`현재 직업: ${CAREER_KOREAN[user.careerType] || user.careerType}`);
      }
      addText(`적합도 점수: ${career.matchScore || 0}점 / 100점`);

      if (career.synergy?.length) {
        addSubSection('시너지 포인트');
        career.synergy.forEach(s => addText(`• ${s}`));
      }

      if (career.weakPoints?.length) {
        addSubSection('보완 필요 영역');
        career.weakPoints.forEach(w => addText(`• ${w}`));
      }

      if (career.solutions?.length) {
        addSubSection('해결책');
        career.solutions.forEach(s => addText(`• ${s}`));
      }

      addText(`최적 방향: ${career.optimalDirection}`);
      addText(`전환 시기: ${career.pivotTiming}`);
    }

    // 월별 액션플랜
    if (premium.monthlyActionPlan?.length) {
      addSectionTitle('5. 월별 행운 액션플랜');

      premium.monthlyActionPlan.forEach((action: MonthlyAction) => {
        checkNewPage(30);
        addSubSection(`${action.monthName} (점수: ${action.score}점)`);

        if (action.mustDo?.length) {
          action.mustDo.forEach(item => {
            addText(`[${item.category}] ${item.action}`);
            if (item.optimalDays?.length) {
              addText(`  추천일: ${item.optimalDays.join(', ')}일 / 시간: ${item.optimalTime}`);
            }
          });
        }

        if (action.mustAvoid?.length) {
          addText(`주의사항: ${action.mustAvoid.join(', ')}`);
        }

        if (action.luckyElements) {
          addText(`행운 색상: ${action.luckyElements.color} | 숫자: ${action.luckyElements.number} | 방향: ${action.luckyElements.direction}`);
        }
      });
    }

    // 인생 타임라인
    if (premium.lifeTimeline) {
      addSectionTitle('6. 인생 타임라인');

      const timeline = premium.lifeTimeline;
      addText(`현재 나이: ${timeline.currentAge}세`);

      if (timeline.phases?.length) {
        addSubSection('인생 시기별 분석');
        timeline.phases.forEach(phase => {
          addText(`[${phase.ageRange}세] ${phase.phase} (${phase.score}점)`);
          if (phase.opportunities?.length) {
            addText(`  기회: ${phase.opportunities.join(', ')}`);
          }
          if (phase.challenges?.length) {
            addText(`  도전: ${phase.challenges.join(', ')}`);
          }
        });
      }

      if (timeline.turningPoints?.length) {
        addSubSection('전환점');
        timeline.turningPoints.forEach(tp => {
          const importance = tp.importance === 'critical' ? '★★★' : tp.importance === 'important' ? '★★' : '★';
          addText(`${tp.year}년 (${tp.age}세) ${importance}: ${tp.event}`);
        });
      }

      if (timeline.goldenWindows?.length) {
        addSubSection('황금 기회의 시기');
        timeline.goldenWindows.forEach(gw => {
          addText(`• ${gw.period}: ${gw.purpose} (성공률 ${gw.successRate}%)`);
        });
      }
    }

    // 타이밍 분석
    if (premium.timingAnalysis) {
      addSectionTitle('7. 최적 타이밍 분석');

      const timing = premium.timingAnalysis;

      addSubSection('현재 기회의 창');
      addText(`상태: ${timing.currentWindow.isOpen ? '열림' : '닫힘'}`);
      addText(`남은 기간: ${timing.currentWindow.remainingDays}일`);
      addText(`놓칠 경우: ${timing.currentWindow.missedConsequence}`);
      addText(`회복 시간: ${timing.currentWindow.recoveryTime}`);

      addSubSection('다음 기회');
      addText(`시기: ${timing.nextOpportunity.date}`);
      addText(`확률: ${timing.nextOpportunity.probability}%`);
    }

    // 관심사별 전략
    if (premium.interestStrategies?.length) {
      addSectionTitle('8. 관심사별 맞춤 전략');

      premium.interestStrategies.forEach(strategy => {
        addSubSection(INTEREST_KOREAN[strategy.interest] || strategy.interest);
        addText(`적합도: ${strategy.sajuAlignment}점 | 최적 시기: ${strategy.timing}`);
        addText(`우선순위: ${strategy.priority}순위`);

        if (strategy.doList?.length) {
          addText(`해야 할 것: ${strategy.doList.join(', ')}`);
        }
        if (strategy.dontList?.length) {
          addText(`피해야 할 것: ${strategy.dontList.join(', ')}`);
        }
        addText(`조언: ${strategy.specificAdvice}`);
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
  const { user, saju, oheng, yongsin, gisin, premium, targetYear = 2026 } = options;
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
  if (saju.year) sajuContent.push(`년주: ${saju.year.heavenlyStem}${saju.year.earthlyBranch}`);
  if (saju.month) sajuContent.push(`월주: ${saju.month.heavenlyStem}${saju.month.earthlyBranch}`);
  if (saju.day) sajuContent.push(`일주: ${saju.day.heavenlyStem}${saju.day.earthlyBranch}`);
  if (saju.time) sajuContent.push(`시주: ${saju.time.heavenlyStem}${saju.time.earthlyBranch}`);
  sections.push({ title: '사주팔자', content: sajuContent });

  // 오행 분석
  const ohengContent = [
    `목(木): ${oheng.wood?.toFixed(1) || 0}%`,
    `화(火): ${oheng.fire?.toFixed(1) || 0}%`,
    `토(土): ${oheng.earth?.toFixed(1) || 0}%`,
    `금(金): ${oheng.metal?.toFixed(1) || 0}%`,
    `수(水): ${oheng.water?.toFixed(1) || 0}%`
  ];

  if (yongsin?.length) {
    ohengContent.push(`용신: ${yongsin.map(e => ELEMENT_KOREAN[e]).join(', ')}`);
  }
  if (gisin?.length) {
    ohengContent.push(`기신: ${gisin.map(e => ELEMENT_KOREAN[e]).join(', ')}`);
  }
  sections.push({ title: '오행 분석', content: ohengContent });

  // 프리미엄 콘텐츠 섹션들...
  if (premium?.monthlyActionPlan?.length) {
    const monthlyContent = premium.monthlyActionPlan.map((m: MonthlyAction) =>
      `${m.monthName}: ${m.mustDo?.map(d => d.action).join(', ') || ''}`
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
