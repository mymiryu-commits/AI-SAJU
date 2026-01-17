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

// 월별 고유 조언 데이터
const MONTHLY_UNIQUE_ADVICE: Record<number, {
  theme: string;
  wisdom: string;
  actionTip: string;
}> = {
  1: {
    theme: '새로운 시작의 달',
    wisdom: '겨울의 끝자락에서 봄을 준비하듯, 이 달은 내면의 계획을 다듬는 시기입니다.',
    actionTip: '올해의 큰 그림을 그리고, 첫 발걸음을 내딛으세요.'
  },
  2: {
    theme: '인내와 축적의 달',
    wisdom: '아직 땅은 차갑지만, 씨앗은 이미 싹틀 준비를 합니다.',
    actionTip: '조급함을 버리고 기초를 다지는 데 집중하세요.'
  },
  3: {
    theme: '도약의 달',
    wisdom: '봄바람이 불어오듯, 새로운 기회의 문이 열리기 시작합니다.',
    actionTip: '망설이던 일을 시작하기에 좋은 시기입니다.'
  },
  4: {
    theme: '성장의 달',
    wisdom: '꽃이 피어나듯, 당신의 노력도 눈에 보이는 결과로 나타납니다.',
    actionTip: '인맥을 넓히고 협력 관계를 강화하세요.'
  },
  5: {
    theme: '결실 준비의 달',
    wisdom: '열매를 맺기 위해서는 꾸준한 관리가 필요합니다.',
    actionTip: '진행 중인 프로젝트의 완성도를 높이세요.'
  },
  6: {
    theme: '전환의 달',
    wisdom: '한 해의 절반이 지나는 시점, 방향을 점검할 때입니다.',
    actionTip: '상반기를 돌아보고 하반기 전략을 수정하세요.'
  },
  7: {
    theme: '도전의 달',
    wisdom: '뜨거운 여름처럼 열정을 불태울 시기입니다.',
    actionTip: '두려움을 떨치고 새로운 도전에 나서세요.'
  },
  8: {
    theme: '수확의 달',
    wisdom: '그동안 뿌린 씨앗이 열매를 맺는 시기입니다.',
    actionTip: '노력의 결과를 인정받을 기회를 놓치지 마세요.'
  },
  9: {
    theme: '정리의 달',
    wisdom: '가을의 시작과 함께 불필요한 것을 정리할 때입니다.',
    actionTip: '관계와 업무를 점검하고 효율을 높이세요.'
  },
  10: {
    theme: '완성의 달',
    wisdom: '한 해의 프로젝트를 마무리할 최적의 시기입니다.',
    actionTip: '미루던 일을 끝내고 성취감을 느끼세요.'
  },
  11: {
    theme: '성찰의 달',
    wisdom: '겨울을 앞두고 내면을 돌아보는 시간입니다.',
    actionTip: '올해의 성과를 정리하고 감사함을 나누세요.'
  },
  12: {
    theme: '마무리와 재충전의 달',
    wisdom: '한 해를 마감하며 새해를 위한 에너지를 모으세요.',
    actionTip: '휴식과 재충전으로 내년을 준비하세요.'
  }
};

// 스토리텔링 생성 함수
function generateMonthlyStory(
  monthNum: number,
  score: number,
  yongsin?: Element[],
  userName?: string
): string {
  const advice = MONTHLY_UNIQUE_ADVICE[monthNum];
  if (!advice) return '';

  const scoreDescription = score >= 80 ? '매우 좋은 기운이 흐르는'
    : score >= 60 ? '안정적인 기운이 감도는'
    : score >= 40 ? '조심스럽게 나아가야 할'
    : '신중함이 필요한';

  const yongsinAdvice = yongsin?.length
    ? `특히 ${yongsin.map(e => ELEMENT_KOREAN[e]).join(', ')}의 기운을 활용하면 더욱 좋은 결과를 얻을 수 있습니다.`
    : '';

  return `${userName ? userName + '님에게 ' : ''}${monthNum}월은 ${scoreDescription} 시기입니다. ${advice.wisdom} ${yongsinAdvice}`;
}

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

      premium.monthlyActionPlan.forEach((action: MonthlyAction, index: number) => {
        const monthNum = index + 1;
        const monthAdvice = MONTHLY_UNIQUE_ADVICE[monthNum];

        checkNewPage(50);
        addSubSection(`${action.monthName} - ${monthAdvice?.theme || ''} (점수: ${action.score}점)`);

        // 스토리텔링 문구 추가
        const story = generateMonthlyStory(monthNum, action.score, yongsin, user.name);
        if (story) {
          addText(story);
          yPos += 3;
        }

        // 이달의 핵심 조언
        if (monthAdvice?.actionTip) {
          addText(`💡 이달의 핵심: ${monthAdvice.actionTip}`);
          yPos += 2;
        }

        if (action.mustDo?.length) {
          addText('▸ 실천 항목:');
          action.mustDo.forEach(item => {
            addText(`  • [${item.category}] ${item.action}`);
            if (item.optimalDays?.length) {
              addText(`    추천일: ${item.optimalDays.join(', ')}일 / 시간: ${item.optimalTime}`);
            }
          });
        }

        if (action.mustAvoid?.length) {
          addText(`▸ 주의사항: ${action.mustAvoid.join(', ')}`);
        }

        if (action.luckyElements) {
          addText(`▸ 행운 요소: 색상(${action.luckyElements.color}) | 숫자(${action.luckyElements.number}) | 방향(${action.luckyElements.direction})`);
        }

        yPos += 5;
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
