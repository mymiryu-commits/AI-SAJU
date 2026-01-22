'use client';

/**
 * 사주 분석 결과 PDF 템플릿
 *
 * HTML 기반 PDF 생성을 위한 템플릿 컴포넌트
 * 프리미엄급 고급스러운 디자인 적용
 * 전통 사주 이론 (십신, 신살, 12운성, 합충형파해) 통합
 */

import { forwardRef } from 'react';
import type {
  UserInput,
  SajuChart,
  OhengBalance,
  AnalysisResult,
  PremiumContent,
  Element
} from '@/types/saju';
import { ELEMENT_KOREAN, CAREER_KOREAN } from '@/types/saju';

interface PdfTemplateProps {
  user: UserInput;
  saju: SajuChart;
  oheng: OhengBalance;
  result: AnalysisResult;
  premium?: PremiumContent;
  targetYear?: number;
}

// 오행 색상 매핑
const ELEMENT_COLORS: Record<Element, string> = {
  wood: '#22c55e',
  fire: '#ef4444',
  earth: '#eab308',
  metal: '#9ca3af',
  water: '#3b82f6'
};

// 오행 한글 매핑 (괄호 없이)
const ELEMENT_NAMES: Record<Element, string> = {
  wood: '목',
  fire: '화',
  earth: '토',
  metal: '금',
  water: '수'
};

// 오행 자연 표현
const ELEMENT_NATURE: Record<Element, string> = {
  wood: '나무의 성장하는 기운',
  fire: '불꽃처럼 열정적인 기운',
  earth: '대지처럼 안정적인 기운',
  metal: '금속처럼 단단한 기운',
  water: '물처럼 유연한 기운'
};

// 오행 상세 설명
const ELEMENT_DESCRIPTION: Record<Element, string> = {
  wood: '봄의 새싹처럼 성장과 발전을 상징합니다. 창의력과 추진력이 강하며, 새로운 시작과 도전을 좋아합니다.',
  fire: '여름의 태양처럼 열정과 에너지를 상징합니다. 밝고 적극적이며, 리더십과 표현력이 뛰어납니다.',
  earth: '대지처럼 안정과 신뢰를 상징합니다. 중용과 균형을 중시하며, 포용력과 책임감이 강합니다.',
  metal: '가을의 결실처럼 결단과 완성을 상징합니다. 정의롭고 원칙적이며, 분석력과 판단력이 뛰어납니다.',
  water: '겨울의 지혜처럼 깊은 사고와 적응력을 상징합니다. 직관력이 뛰어나고 유연하며, 학문과 예술에 재능이 있습니다.'
};

const PdfTemplate = forwardRef<HTMLDivElement, PdfTemplateProps>(
  ({ user, saju, oheng, result, premium, targetYear = 2026 }, ref) => {
    // 기본값 설정 (데이터가 없을 때 에러 방지)
    const {
      scores = { overall: 70, wealth: 70, love: 70, career: 70, health: 70 },
      personality,
      yongsin = [],
      gisin = [],
      aiAnalysis
    } = result || {};

    // 나이 계산
    const birthYear = parseInt(user.birthDate.split('-')[0]);
    const age = targetYear - birthYear;
    const koreanAge = age + 1;

    // 오행 정렬 (높은 순)
    const sortedElements = (['wood', 'fire', 'earth', 'metal', 'water'] as Element[])
      .map(el => ({ key: el, value: oheng[el] || 0 }))
      .sort((a, b) => b.value - a.value);

    const strongestElement = sortedElements[0];
    const weakestElement = sortedElements[4];

    // 별자리 계산
    const zodiacSign = getZodiacSign(user.birthDate);

    return (
      <div
        ref={ref}
        className="pdf-template"
        style={{
          width: '210mm',
          minHeight: '297mm',
          padding: '15mm',
          backgroundColor: '#ffffff',
          fontFamily: 'Pretendard, "Noto Sans KR", "Malgun Gothic", -apple-system, BlinkMacSystemFont, sans-serif',
          fontSize: '10pt',
          lineHeight: 1.6,
          color: '#1f2937'
        }}
      >
        {/* 웹 폰트 프리로드 */}
        <link
          href="https://cdn.jsdelivr.net/gh/orioncactus/pretendard@v1.3.9/dist/web/static/pretendard.min.css"
          rel="stylesheet"
        />

        {/* ============ 표지 ============ */}
        <div style={{
          textAlign: 'center',
          minHeight: '250mm',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
          alignItems: 'center'
        }}>
          {/* 상단 그라데이션 바 */}
          <div style={{
            width: '100%',
            height: '80px',
            background: 'linear-gradient(135deg, #6366f1 0%, #a855f7 100%)',
            borderRadius: '12px',
            marginBottom: '40px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center'
          }}>
            <h1 style={{
              fontSize: '28pt',
              fontWeight: 700,
              color: '#ffffff',
              margin: 0
            }}>
              사주팔자 분석 리포트
            </h1>
          </div>

          <p style={{ fontSize: '16pt', color: '#6b7280', marginBottom: '50px' }}>
            {targetYear}년 운세 분석
          </p>

          {/* 사용자 정보 카드 */}
          <div style={{
            display: 'inline-block',
            padding: '40px 60px',
            background: 'linear-gradient(135deg, #f8fafc 0%, #e2e8f0 100%)',
            borderRadius: '20px',
            border: '1px solid #e2e8f0',
            boxShadow: '0 4px 20px rgba(0,0,0,0.1)'
          }}>
            <p style={{ fontSize: '20pt', marginBottom: '16px', fontWeight: 700, color: '#1f2937' }}>
              <span style={{ color: '#6366f1' }}>성명:</span> {user.name}
            </p>
            <div style={{ borderTop: '1px solid #d1d5db', paddingTop: '16px', marginTop: '16px' }}>
              <p style={{ fontSize: '12pt', color: '#4b5563', marginBottom: '8px' }}>
                생년월일: {user.birthDate} (만 {age}세 / 한국나이 {koreanAge}세)
              </p>
              {user.birthTime && (
                <p style={{ fontSize: '12pt', color: '#4b5563', marginBottom: '8px' }}>
                  출생시간: {user.birthTime}
                </p>
              )}
              <p style={{ fontSize: '12pt', color: '#4b5563', marginBottom: '8px' }}>
                성별: {user.gender === 'male' ? '남성' : '여성'}
              </p>
              {user.bloodType && (
                <p style={{ fontSize: '12pt', color: '#4b5563', marginBottom: '8px' }}>
                  혈액형: {user.bloodType}형
                </p>
              )}
              {zodiacSign && (
                <p style={{ fontSize: '12pt', color: '#4b5563', marginBottom: '8px' }}>
                  별자리: {zodiacSign}
                </p>
              )}
              {user.mbti && (
                <p style={{ fontSize: '12pt', color: '#4b5563' }}>
                  MBTI: {user.mbti}
                </p>
              )}
            </div>
          </div>

          <div style={{ marginTop: '80px' }}>
            <p style={{ fontSize: '10pt', color: '#9ca3af' }}>
              발행일: {new Date().toLocaleDateString('ko-KR')}
            </p>
            <p style={{
              fontSize: '12pt',
              color: '#6366f1',
              fontWeight: 600,
              marginTop: '8px'
            }}>
              AI-SAJU Premium Service
            </p>
          </div>
        </div>

        {/* 페이지 나누기 */}
        <div style={{ pageBreakAfter: 'always' }} />

        {/* ============ 1. 사주팔자 기본 정보 ============ */}
        <Section title="1. 사주팔자 기본 정보">
          <SubSection title="사주 구성">
            <table style={{
              width: '100%',
              borderCollapse: 'collapse',
              marginBottom: '20px',
              tableLayout: 'fixed'
            }}>
              <thead>
                <tr style={{ backgroundColor: '#f8fafc' }}>
                  <th style={{ ...tableHeaderStyle, width: '15%', textAlign: 'center' }}>구분</th>
                  <th style={{ ...tableHeaderStyle, width: '20%', textAlign: 'center' }}>천간</th>
                  <th style={{ ...tableHeaderStyle, width: '20%', textAlign: 'center' }}>지지</th>
                  <th style={{ ...tableHeaderStyle, width: '15%', textAlign: 'center' }}>오행</th>
                  <th style={{ ...tableHeaderStyle, width: '30%', textAlign: 'center' }}>의미</th>
                </tr>
              </thead>
              <tbody>
                {[
                  { name: '년주', pillar: saju.year, meaning: '조상/사회 (초년운, 1~15세)' },
                  { name: '월주', pillar: saju.month, meaning: '부모/직장 (청년운, 16~30세)' },
                  { name: '일주', pillar: saju.day, meaning: '본인/배우자 (중년운, 31~45세)' },
                  { name: '시주', pillar: saju.time, meaning: '자녀/말년 (말년운, 46세 이후)' }
                ].map(({ name, pillar, meaning }) => pillar && (
                  <tr key={name}>
                    <td style={{ ...tableCellStyle, textAlign: 'center', fontWeight: 700 }}>{name}</td>
                    <td style={{ ...tableCellStyle, textAlign: 'center', fontSize: '16pt', fontWeight: 600 }}>
                      {pillar.stemKorean || pillar.heavenlyStem || '-'}
                    </td>
                    <td style={{ ...tableCellStyle, textAlign: 'center', fontSize: '16pt', fontWeight: 600 }}>
                      {pillar.branchKorean || pillar.earthlyBranch || '-'}
                    </td>
                    <td style={{ ...tableCellStyle, textAlign: 'center' }}>
                      <span style={{
                        display: 'inline-block',
                        padding: '4px 12px',
                        borderRadius: '6px',
                        backgroundColor: pillar.element ? `${ELEMENT_COLORS[pillar.element]}20` : '#f3f4f6',
                        color: pillar.element ? ELEMENT_COLORS[pillar.element] : '#6b7280',
                        fontWeight: 700,
                        fontSize: '11pt'
                      }}>
                        {pillar.element ? ELEMENT_NAMES[pillar.element] : '-'}
                      </span>
                    </td>
                    <td style={{ ...tableCellStyle, color: '#6b7280', fontSize: '9pt', textAlign: 'center' }}>
                      {meaning}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </SubSection>

          {/* 일주 분석 */}
          {aiAnalysis?.dayMasterAnalysis && (
            <SubSection title="일주(日柱) 분석 - 당신의 본질">
              <InfoBox type="highlight">
                <p style={{ lineHeight: 1.8, textAlign: 'justify' }}>
                  {aiAnalysis.dayMasterAnalysis}
                </p>
              </InfoBox>
            </SubSection>
          )}
        </Section>

        {/* ============ 2. 오행 분석 ============ */}
        <Section title="2. 오행 에너지 분석">
          <SubSection title="오행 분포">
            <div style={{ marginBottom: '20px' }}>
              {sortedElements.map(({ key, value }) => (
                <div key={key} style={{
                  display: 'flex',
                  alignItems: 'center',
                  marginBottom: '14px'
                }}>
                  <span style={{
                    width: '80px',
                    fontWeight: 700,
                    color: ELEMENT_COLORS[key],
                    fontSize: '11pt'
                  }}>
                    {ELEMENT_NAMES[key]}({ELEMENT_KOREAN[key].slice(0, 1)})
                  </span>
                  <div style={{
                    flex: 1,
                    height: '24px',
                    backgroundColor: '#f3f4f6',
                    borderRadius: '12px',
                    overflow: 'hidden',
                    marginRight: '16px'
                  }}>
                    <div style={{
                      width: `${value}%`,
                      height: '100%',
                      backgroundColor: ELEMENT_COLORS[key],
                      borderRadius: '12px',
                      transition: 'width 0.3s'
                    }} />
                  </div>
                  <span style={{
                    width: '60px',
                    textAlign: 'right',
                    fontWeight: 600,
                    fontSize: '11pt'
                  }}>
                    {value.toFixed(1)}%
                  </span>
                </div>
              ))}
            </div>

            {/* 가장 강한 기운 설명 */}
            <InfoBox type="success" style={{ marginBottom: '16px' }}>
              <h4 style={{ color: '#059669', fontWeight: 700, marginBottom: '12px', fontSize: '12pt' }}>
                가장 강한 기운: {ELEMENT_NATURE[strongestElement.key]} ({strongestElement.value.toFixed(1)}%)
              </h4>
              <p style={{ color: '#374151', lineHeight: 1.7 }}>
                {ELEMENT_DESCRIPTION[strongestElement.key]}
              </p>
            </InfoBox>

            {/* 보완이 필요한 기운 설명 */}
            <InfoBox type="warning">
              <h4 style={{ color: '#dc2626', fontWeight: 700, marginBottom: '12px', fontSize: '12pt' }}>
                보완이 필요한 기운: {ELEMENT_NATURE[weakestElement.key]} ({weakestElement.value.toFixed(1)}%)
              </h4>
              <p style={{ color: '#374151', lineHeight: 1.7 }}>
                {ELEMENT_DESCRIPTION[weakestElement.key]} 이 기운을 보완하면 삶의 균형을 찾을 수 있습니다.
              </p>
            </InfoBox>
          </SubSection>

          {/* 용신/기신 분석 */}
          {(yongsin?.length > 0 || gisin?.length > 0) && (
            <SubSection title="용신(用神) & 기신(忌神) - 운을 좌우하는 핵심 에너지">
              <p style={{ color: '#6b7280', marginBottom: '16px', fontSize: '10pt' }}>
                용신은 당신에게 도움이 되는 기운이고, 기신은 주의해야 할 기운입니다.
              </p>
              <div style={{ display: 'flex', gap: '20px', flexWrap: 'wrap' }}>
                {yongsin?.length > 0 && (
                  <InfoBox type="success" style={{ flex: 1, minWidth: '200px' }}>
                    <h4 style={{
                      color: '#059669',
                      fontWeight: 700,
                      marginBottom: '12px',
                      fontSize: '12pt'
                    }}>
                      용신 - 행운을 가져다 주는 기운
                    </h4>
                    {yongsin.map(el => (
                      <div key={el} style={{ marginBottom: '8px' }}>
                        <p style={{ fontWeight: 600, color: ELEMENT_COLORS[el] }}>
                          {ELEMENT_NATURE[el]}
                        </p>
                      </div>
                    ))}
                    <p style={{
                      fontSize: '9pt',
                      color: '#059669',
                      marginTop: '12px',
                      padding: '8px',
                      backgroundColor: '#ecfdf5',
                      borderRadius: '6px'
                    }}>
                      이 오행과 관련된 색상, 방향, 음식, 사람을 가까이하면 운이 좋아집니다.
                    </p>
                  </InfoBox>
                )}

                {gisin?.length > 0 && (
                  <InfoBox type="warning" style={{ flex: 1, minWidth: '200px' }}>
                    <h4 style={{
                      color: '#dc2626',
                      fontWeight: 700,
                      marginBottom: '12px',
                      fontSize: '12pt'
                    }}>
                      기신 - 주의해야 할 기운
                    </h4>
                    {gisin.map(el => (
                      <div key={el} style={{ marginBottom: '8px' }}>
                        <p style={{ fontWeight: 600, color: ELEMENT_COLORS[el] }}>
                          {ELEMENT_NATURE[el]}
                        </p>
                      </div>
                    ))}
                    <p style={{
                      fontSize: '9pt',
                      color: '#dc2626',
                      marginTop: '12px',
                      padding: '8px',
                      backgroundColor: '#fef2f2',
                      borderRadius: '6px'
                    }}>
                      이 기운이 과도할 때는 중요한 결정을 피하고, 균형을 유지하세요.
                    </p>
                  </InfoBox>
                )}
              </div>
            </SubSection>
          )}
        </Section>

        {/* 페이지 나누기 */}
        <div style={{ pageBreakAfter: 'always' }} />

        {/* ============ 3. 운세 점수 ============ */}
        <Section title={`3. ${targetYear}년 운세 점수`}>
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(5, 1fr)',
            gap: '15px',
            marginBottom: '24px'
          }}>
            {[
              { key: 'overall', label: '종합', icon: '⭐' },
              { key: 'wealth', label: '재물', icon: '💰' },
              { key: 'love', label: '애정', icon: '💕' },
              { key: 'career', label: '직업', icon: '💼' },
              { key: 'health', label: '건강', icon: '💪' }
            ].map(({ key, label, icon }) => (
              <ScoreCard
                key={key}
                label={label}
                icon={icon}
                score={scores[key as keyof typeof scores]}
              />
            ))}
          </div>

          <InfoBox type="info">
            <p style={{ textAlign: 'center', fontWeight: 600 }}>
              {targetYear}년 종합 점수 <strong style={{ fontSize: '18pt', color: '#6366f1' }}>{scores.overall}점</strong>
            </p>
            <p style={{ textAlign: 'center', marginTop: '8px', color: '#4b5563' }}>
              {scores.overall >= 80 ? '매우 좋은 운세입니다! 적극적으로 기회를 잡으세요.' :
               scores.overall >= 60 ? '무난한 운세입니다. 꾸준히 노력하면 좋은 결과가 있습니다.' :
               '신중함이 필요한 해입니다. 기초를 다지는 데 집중하세요.'}
            </p>
          </InfoBox>

          {/* AI 연간 운세 분석 */}
          {aiAnalysis?.yearlyFortune && (
            <SubSection title={`${targetYear}년 세운(歲運) 분석`}>
              <InfoBox type="highlight">
                <p style={{ lineHeight: 1.8, textAlign: 'justify' }}>
                  {aiAnalysis.yearlyFortune}
                </p>
              </InfoBox>
            </SubSection>
          )}
        </Section>

        {/* ============ 4. 성격 및 종합 분석 ============ */}
        <Section title="4. 성격 분석">
          {/* AI 성격 분석 */}
          {aiAnalysis?.personalityReading && (
            <SubSection title="사주로 본 당신의 성격">
              <InfoBox type="default">
                <p style={{ lineHeight: 1.8, textAlign: 'justify' }}>
                  {aiAnalysis.personalityReading}
                </p>
              </InfoBox>
            </SubSection>
          )}

          {/* 사주 특성 + MBTI 특성 */}
          {personality && (
            <div style={{ display: 'flex', gap: '20px', flexWrap: 'wrap', marginTop: '20px' }}>
              <InfoBox type="default" style={{ flex: 1, minWidth: '200px' }}>
                <h4 style={{ fontWeight: 700, marginBottom: '12px', color: '#6366f1' }}>사주 특성</h4>
                <ul style={{ paddingLeft: '20px', margin: 0 }}>
                  {personality.sajuTraits?.map((s, i) => (
                    <li key={i} style={{ marginBottom: '6px', lineHeight: 1.6 }}>{s}</li>
                  ))}
                </ul>
              </InfoBox>

              {personality.mbtiTraits && user.mbti && (
                <InfoBox type="default" style={{ flex: 1, minWidth: '200px' }}>
                  <h4 style={{ fontWeight: 700, marginBottom: '12px', color: '#a855f7' }}>MBTI ({user.mbti}) 특성</h4>
                  <ul style={{ paddingLeft: '20px', margin: 0 }}>
                    {personality.mbtiTraits.map((w, i) => (
                      <li key={i} style={{ marginBottom: '6px', lineHeight: 1.6 }}>{w}</li>
                    ))}
                  </ul>
                </InfoBox>
              )}
            </div>
          )}

          {/* 교차 분석 */}
          {personality?.crossAnalysis && (
            <InfoBox type="highlight" style={{ marginTop: '20px' }}>
              <h4 style={{ fontWeight: 700, marginBottom: '12px' }}>사주-MBTI 통합 분석</h4>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                <p><strong>일치도:</strong> {personality.crossAnalysis.matchRate}%</p>
                <p><strong>시너지:</strong> {personality.crossAnalysis.synergy}</p>
                <p><strong>보완점:</strong> {personality.crossAnalysis.conflict}</p>
                <p><strong>해결책:</strong> {personality.crossAnalysis.resolution}</p>
              </div>
            </InfoBox>
          )}

          {/* 핵심 키워드 */}
          {personality?.coreKeyword && (
            <div style={{
              textAlign: 'center',
              marginTop: '24px',
              padding: '20px',
              background: 'linear-gradient(135deg, #6366f1 0%, #a855f7 100%)',
              borderRadius: '12px'
            }}>
              <p style={{ fontSize: '10pt', color: '#e0e7ff', marginBottom: '8px' }}>
                당신을 한마디로 표현하면
              </p>
              <p style={{ fontSize: '18pt', fontWeight: 700, color: '#ffffff' }}>
                "{personality.coreKeyword}"
              </p>
            </div>
          )}
        </Section>

        {/* 페이지 나누기 */}
        <div style={{ pageBreakAfter: 'always' }} />

        {/* ============ 5. 분야별 운세 및 조언 ============ */}
        <Section title="5. 분야별 운세 및 조언">
          {aiAnalysis && (
            <>
              {/* 재물운 */}
              {aiAnalysis.fortuneAdvice?.wealth && (
                <SubSection title="재물운 - 돈과 재산">
                  <InfoBox type="default">
                    <p style={{ lineHeight: 1.8, textAlign: 'justify' }}>
                      {aiAnalysis.fortuneAdvice.wealth}
                    </p>
                  </InfoBox>
                </SubSection>
              )}

              {/* 재물 전략 */}
              {aiAnalysis.wealthStrategy && (
                <InfoBox type="success" style={{ marginTop: '12px', marginBottom: '20px' }}>
                  <h4 style={{ fontWeight: 700, marginBottom: '8px', color: '#059669' }}>재물 전략</h4>
                  <p style={{ lineHeight: 1.8 }}>{aiAnalysis.wealthStrategy}</p>
                </InfoBox>
              )}

              {/* 애정운 */}
              {aiAnalysis.fortuneAdvice?.love && (
                <SubSection title="애정운 - 연애와 결혼">
                  <InfoBox type="default">
                    <p style={{ lineHeight: 1.8, textAlign: 'justify' }}>
                      {aiAnalysis.fortuneAdvice.love}
                    </p>
                  </InfoBox>
                </SubSection>
              )}

              {/* 인간관계 */}
              {aiAnalysis.relationshipAnalysis && (
                <InfoBox type="info" style={{ marginTop: '12px', marginBottom: '20px' }}>
                  <h4 style={{ fontWeight: 700, marginBottom: '8px', color: '#2563eb' }}>대인관계 분석</h4>
                  <p style={{ lineHeight: 1.8 }}>{aiAnalysis.relationshipAnalysis}</p>
                </InfoBox>
              )}

              {/* 직업운 */}
              {aiAnalysis.fortuneAdvice?.career && (
                <SubSection title="직업운 - 일과 사업">
                  <InfoBox type="default">
                    <p style={{ lineHeight: 1.8, textAlign: 'justify' }}>
                      {aiAnalysis.fortuneAdvice.career}
                    </p>
                  </InfoBox>
                </SubSection>
              )}

              {/* 커리어 가이드 */}
              {aiAnalysis.careerGuidance && (
                <InfoBox type="highlight" style={{ marginTop: '12px', marginBottom: '20px' }}>
                  <h4 style={{ fontWeight: 700, marginBottom: '8px', color: '#6366f1' }}>커리어 가이드</h4>
                  <p style={{ lineHeight: 1.8 }}>{aiAnalysis.careerGuidance}</p>
                </InfoBox>
              )}

              {/* 건강운 */}
              {aiAnalysis.fortuneAdvice?.health && (
                <SubSection title="건강운 - 건강과 체력">
                  <InfoBox type="default">
                    <p style={{ lineHeight: 1.8, textAlign: 'justify' }}>
                      {aiAnalysis.fortuneAdvice.health}
                    </p>
                  </InfoBox>
                </SubSection>
              )}

              {/* 건강 조언 */}
              {aiAnalysis.healthAdvice && (
                <InfoBox type="warning" style={{ marginTop: '12px' }}>
                  <h4 style={{ fontWeight: 700, marginBottom: '8px', color: '#dc2626' }}>건강 관리 조언</h4>
                  <p style={{ lineHeight: 1.8 }}>{aiAnalysis.healthAdvice}</p>
                </InfoBox>
              )}
            </>
          )}
        </Section>

        {/* 페이지 나누기 */}
        <div style={{ pageBreakAfter: 'always' }} />

        {/* ============ 6. 대운과 인생 흐름 ============ */}
        <Section title="6. 대운(大運)과 인생 흐름">
          {aiAnalysis?.tenYearFortune && (
            <SubSection title="현재 대운 분석 - 인생의 큰 흐름">
              <InfoBox type="highlight">
                <p style={{ lineHeight: 1.8, textAlign: 'justify' }}>
                  {aiAnalysis.tenYearFortune}
                </p>
              </InfoBox>
            </SubSection>
          )}

          {aiAnalysis?.lifePath && (
            <SubSection title="인생의 길 - 타고난 운명의 흐름">
              <InfoBox type="default">
                <p style={{ lineHeight: 1.8, textAlign: 'justify' }}>
                  {aiAnalysis.lifePath}
                </p>
              </InfoBox>
            </SubSection>
          )}

          {aiAnalysis?.spiritualGuidance && (
            <SubSection title="영적 가이드 - 내면의 성장">
              <InfoBox type="info">
                <p style={{ lineHeight: 1.8, textAlign: 'justify' }}>
                  {aiAnalysis.spiritualGuidance}
                </p>
              </InfoBox>
            </SubSection>
          )}
        </Section>

        {/* ============ 7. 행운 요소 & 주의사항 ============ */}
        <Section title="7. 행운 요소 & 주의사항">
          {aiAnalysis?.luckyElements && (
            <SubSection title="행운을 부르는 요소">
              <InfoBox type="success">
                <p style={{ lineHeight: 1.8, textAlign: 'justify' }}>
                  {typeof aiAnalysis.luckyElements === 'string'
                    ? aiAnalysis.luckyElements
                    : typeof aiAnalysis.luckyElements === 'object'
                      ? Object.entries(aiAnalysis.luckyElements as Record<string, unknown>)
                          .map(([key, value]) => `${key}: ${value}`)
                          .join(', ')
                      : '행운의 요소 정보를 확인하세요.'}
                </p>
              </InfoBox>
            </SubSection>
          )}

          {aiAnalysis?.warningAdvice && (
            <SubSection title="주의해야 할 점">
              <InfoBox type="warning">
                <p style={{ lineHeight: 1.8, textAlign: 'justify' }}>
                  {aiAnalysis.warningAdvice}
                </p>
              </InfoBox>
            </SubSection>
          )}

          {/* 실천 액션플랜 */}
          {aiAnalysis?.actionPlan && aiAnalysis.actionPlan.length > 0 && (
            <SubSection title={`${targetYear}년 실천 액션플랜`}>
              <InfoBox type="highlight">
                <ol style={{ paddingLeft: '20px', margin: 0 }}>
                  {aiAnalysis.actionPlan.map((action, idx) => (
                    <li key={idx} style={{
                      marginBottom: '12px',
                      lineHeight: 1.7,
                      fontWeight: idx === 0 ? 600 : 400
                    }}>
                      {action}
                    </li>
                  ))}
                </ol>
              </InfoBox>
            </SubSection>
          )}
        </Section>

        {/* ============ 프리미엄 콘텐츠 ============ */}
        {premium && (
          <>
            {/* 페이지 나누기 */}
            <div style={{ pageBreakAfter: 'always' }} />

            {/* 월별 운세 */}
            {premium.monthlyActionPlan && (
              <Section title="8. 월별 행운 액션플랜">
                <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                  <thead>
                    <tr style={{ backgroundColor: '#f8fafc' }}>
                      <th style={{ ...tableHeaderStyle, textAlign: 'center', width: '12%' }}>월</th>
                      <th style={{ ...tableHeaderStyle, textAlign: 'center', width: '12%' }}>점수</th>
                      <th style={{ ...tableHeaderStyle, width: '38%' }}>해야 할 것</th>
                      <th style={{ ...tableHeaderStyle, width: '38%' }}>피해야 할 것</th>
                    </tr>
                  </thead>
                  <tbody>
                    {premium.monthlyActionPlan.map((month, idx) => (
                      <tr key={idx}>
                        <td style={{ ...tableCellStyle, fontWeight: 700, textAlign: 'center' }}>
                          {month.monthName}
                        </td>
                        <td style={{ ...tableCellStyle, textAlign: 'center' }}>
                          <span style={{
                            display: 'inline-block',
                            padding: '4px 10px',
                            borderRadius: '6px',
                            backgroundColor: month.score >= 80 ? '#dcfce7' : month.score >= 60 ? '#fef3c7' : '#fee2e2',
                            color: month.score >= 80 ? '#059669' : month.score >= 60 ? '#d97706' : '#dc2626',
                            fontWeight: 700
                          }}>
                            {month.score}점
                          </span>
                        </td>
                        <td style={{ ...tableCellStyle, fontSize: '9pt' }}>
                          {month.mustDo?.slice(0, 2).map(d => d.action).join(', ') || '-'}
                        </td>
                        <td style={{ ...tableCellStyle, fontSize: '9pt', color: '#dc2626' }}>
                          {month.mustAvoid?.slice(0, 2).join(', ') || '-'}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </Section>
            )}

            {/* 직업 분석 */}
            {premium.careerAnalysis && (
              <Section title="9. 직업 및 커리어 분석">
                <div style={{ display: 'flex', gap: '20px', flexWrap: 'wrap' }}>
                  <InfoBox type="default" style={{ flex: 1, minWidth: '200px' }}>
                    <h4 style={{ fontWeight: 700, marginBottom: '12px' }}>현재 직업 적합도</h4>
                    <p style={{ marginBottom: '8px' }}>
                      직업: {user.careerType ? CAREER_KOREAN[user.careerType] || user.careerType : '미입력'}
                    </p>
                    <p>
                      적합도: <strong style={{ fontSize: '16pt', color: '#6366f1' }}>
                        {premium.careerAnalysis.matchScore}점
                      </strong>
                    </p>
                  </InfoBox>

                  <InfoBox type="success" style={{ flex: 1, minWidth: '200px' }}>
                    <h4 style={{ fontWeight: 700, marginBottom: '12px', color: '#059669' }}>
                      시너지 포인트
                    </h4>
                    <ul style={{ paddingLeft: '20px', margin: 0 }}>
                      {premium.careerAnalysis.synergy?.map((s, i) => (
                        <li key={i}>{s}</li>
                      ))}
                    </ul>
                  </InfoBox>
                </div>

                <InfoBox type="highlight" style={{ marginTop: '20px' }}>
                  <p><strong>최적 방향:</strong> {premium.careerAnalysis.optimalDirection}</p>
                  <p><strong>전환 시기:</strong> {premium.careerAnalysis.pivotTiming}</p>
                </InfoBox>
              </Section>
            )}

            {/* 인생 타임라인 */}
            {premium.lifeTimeline && (
              <>
                <div style={{ pageBreakAfter: 'always' }} />
                <Section title="10. 인생 타임라인">
                  <p style={{ marginBottom: '16px', color: '#6b7280' }}>
                    현재 나이: <strong>{premium.lifeTimeline.currentAge}세</strong>
                  </p>

                  {premium.lifeTimeline.phases?.map((phase, idx) => (
                    <InfoBox
                      key={idx}
                      type={phase.score >= 70 ? 'success' : 'default'}
                      style={{ marginBottom: '16px' }}
                    >
                      <h4 style={{ fontWeight: 700, marginBottom: '8px' }}>
                        [{phase.ageRange}세] {phase.phase} - {phase.score}점
                      </h4>
                      <div style={{ display: 'flex', gap: '20px' }}>
                        <div style={{ flex: 1 }}>
                          <p style={{ fontSize: '9pt', color: '#059669', fontWeight: 600 }}>기회</p>
                          <p style={{ fontSize: '9pt' }}>{phase.opportunities?.join(', ')}</p>
                        </div>
                        <div style={{ flex: 1 }}>
                          <p style={{ fontSize: '9pt', color: '#dc2626', fontWeight: 600 }}>도전</p>
                          <p style={{ fontSize: '9pt' }}>{phase.challenges?.join(', ')}</p>
                        </div>
                      </div>
                    </InfoBox>
                  ))}

                  {premium.lifeTimeline.goldenWindows && (
                    <SubSection title="황금 기회의 시기">
                      <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                        <thead>
                          <tr style={{ backgroundColor: '#fef3c7' }}>
                            <th style={tableHeaderStyle}>기간</th>
                            <th style={tableHeaderStyle}>목적</th>
                            <th style={{ ...tableHeaderStyle, textAlign: 'center' }}>성공률</th>
                          </tr>
                        </thead>
                        <tbody>
                          {premium.lifeTimeline.goldenWindows.map((gw, idx) => (
                            <tr key={idx}>
                              <td style={tableCellStyle}>{gw.period}</td>
                              <td style={tableCellStyle}>{gw.purpose}</td>
                              <td style={{ ...tableCellStyle, textAlign: 'center', fontWeight: 700, color: '#d97706' }}>
                                {gw.successRate}%
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </SubSection>
                  )}
                </Section>
              </>
            )}
          </>
        )}

        {/* ============ 마무리 페이지 ============ */}
        <div style={{ pageBreakBefore: 'always', textAlign: 'center', paddingTop: '60px' }}>
          <h2 style={{ fontSize: '20pt', marginBottom: '30px', color: '#6366f1' }}>
            분석을 마치며
          </h2>

          <InfoBox type="highlight" style={{ maxWidth: '500px', margin: '0 auto 40px', textAlign: 'left' }}>
            <p style={{ marginBottom: '16px', lineHeight: 1.8 }}>
              이 분석 리포트는 동양 철학의 지혜인 사주팔자를 기반으로 작성되었습니다.
            </p>
            <p style={{ marginBottom: '16px', lineHeight: 1.8 }}>
              사주는 타고난 기질과 인생의 흐름을 보여주지만, 운명은 정해진 것이 아닙니다.
              자신의 강점을 살리고 약점을 보완하며, 때를 알고 행동하는 것이 중요합니다.
            </p>
            <p style={{ fontWeight: 700, color: '#6366f1', fontSize: '12pt' }}>
              "아는 것이 힘이고, 준비하는 자에게 기회가 옵니다."
            </p>
          </InfoBox>

          {/* 종합 메시지 */}
          {aiAnalysis?.fortuneAdvice?.overall && (
            <InfoBox type="info" style={{ maxWidth: '500px', margin: '0 auto 40px', textAlign: 'left' }}>
              <h4 style={{ fontWeight: 700, marginBottom: '12px', color: '#2563eb' }}>
                {user.name}님에게 드리는 한마디
              </h4>
              <p style={{ lineHeight: 1.8 }}>
                {aiAnalysis.fortuneAdvice.overall}
              </p>
            </InfoBox>
          )}

          <div style={{ marginTop: '60px', color: '#9ca3af' }}>
            <p>분석 생성일: {new Date().toLocaleDateString('ko-KR')}</p>
            <p style={{ marginTop: '12px', fontWeight: 700, fontSize: '14pt', color: '#6366f1' }}>
              AI-SAJU Premium Service
            </p>
            <p style={{ fontSize: '10pt', marginTop: '6px', color: '#a5b4fc' }}>
              Your Fortune, Your Choice
            </p>
          </div>
        </div>
      </div>
    );
  }
);

PdfTemplate.displayName = 'PdfTemplate';

export default PdfTemplate;

// ============ 헬퍼 함수 ============

// 별자리 계산
function getZodiacSign(birthDate: string): string {
  const [, month, day] = birthDate.split('-').map(Number);

  const signs = [
    { name: '염소자리', start: [12, 22], end: [1, 19] },
    { name: '물병자리', start: [1, 20], end: [2, 18] },
    { name: '물고기자리', start: [2, 19], end: [3, 20] },
    { name: '양자리', start: [3, 21], end: [4, 19] },
    { name: '황소자리', start: [4, 20], end: [5, 20] },
    { name: '쌍둥이자리', start: [5, 21], end: [6, 21] },
    { name: '게자리', start: [6, 22], end: [7, 22] },
    { name: '사자자리', start: [7, 23], end: [8, 22] },
    { name: '처녀자리', start: [8, 23], end: [9, 22] },
    { name: '천칭자리', start: [9, 23], end: [10, 22] },
    { name: '전갈자리', start: [10, 23], end: [11, 21] },
    { name: '사수자리', start: [11, 22], end: [12, 21] },
  ];

  for (const sign of signs) {
    const [startMonth, startDay] = sign.start;
    const [endMonth, endDay] = sign.end;

    if (startMonth === endMonth) {
      if (month === startMonth && day >= startDay && day <= endDay) {
        return sign.name;
      }
    } else if (startMonth < endMonth) {
      if ((month === startMonth && day >= startDay) || (month === endMonth && day <= endDay)) {
        return sign.name;
      }
    } else {
      // 염소자리처럼 연도를 넘는 경우
      if ((month === startMonth && day >= startDay) || (month === endMonth && day <= endDay)) {
        return sign.name;
      }
    }
  }

  return '염소자리'; // 기본값
}

// ============ 스타일 상수 ============

const tableHeaderStyle: React.CSSProperties = {
  padding: '12px 16px',
  textAlign: 'left',
  fontWeight: 700,
  fontSize: '10pt',
  borderBottom: '2px solid #e5e7eb',
  color: '#374151',
  backgroundColor: '#f8fafc'
};

const tableCellStyle: React.CSSProperties = {
  padding: '12px 16px',
  borderBottom: '1px solid #e5e7eb',
  fontSize: '10pt',
  verticalAlign: 'middle'
};

// ============ 컴포넌트들 ============

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div style={{ marginBottom: '32px' }}>
      <h2 style={{
        fontSize: '14pt',
        fontWeight: 700,
        color: '#1f2937',
        marginBottom: '20px',
        paddingBottom: '10px',
        borderBottom: '3px solid #6366f1'
      }}>
        {title}
      </h2>
      {children}
    </div>
  );
}

function SubSection({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div style={{ marginBottom: '24px' }}>
      <h3 style={{
        fontSize: '11pt',
        fontWeight: 700,
        color: '#374151',
        marginBottom: '14px',
        paddingLeft: '12px',
        borderLeft: '4px solid #a855f7'
      }}>
        {title}
      </h3>
      {children}
    </div>
  );
}

interface InfoBoxProps {
  type: 'default' | 'success' | 'warning' | 'info' | 'highlight';
  children: React.ReactNode;
  style?: React.CSSProperties;
}

function InfoBox({ type, children, style }: InfoBoxProps) {
  const bgColors = {
    default: '#f8fafc',
    success: '#f0fdf4',
    warning: '#fef2f2',
    info: '#eff6ff',
    highlight: 'linear-gradient(135deg, #f5f3ff 0%, #ede9fe 100%)'
  };

  const borderColors = {
    default: '#e2e8f0',
    success: '#86efac',
    warning: '#fecaca',
    info: '#93c5fd',
    highlight: '#c4b5fd'
  };

  return (
    <div style={{
      padding: '18px',
      borderRadius: '12px',
      background: bgColors[type],
      border: `1px solid ${borderColors[type]}`,
      ...style
    }}>
      {children}
    </div>
  );
}

function ScoreCard({ label, icon, score }: { label: string; icon: string; score: number }) {
  const getScoreColor = (s: number) => {
    if (s >= 80) return '#059669';
    if (s >= 60) return '#d97706';
    return '#dc2626';
  };

  const getScoreBg = (s: number) => {
    if (s >= 80) return 'linear-gradient(135deg, #f0fdf4 0%, #dcfce7 100%)';
    if (s >= 60) return 'linear-gradient(135deg, #fffbeb 0%, #fef3c7 100%)';
    return 'linear-gradient(135deg, #fef2f2 0%, #fee2e2 100%)';
  };

  return (
    <div style={{
      textAlign: 'center',
      padding: '18px',
      borderRadius: '12px',
      background: getScoreBg(score),
      border: '1px solid #e2e8f0'
    }}>
      <div style={{ fontSize: '22pt', marginBottom: '6px' }}>{icon}</div>
      <div style={{ fontSize: '9pt', color: '#6b7280', marginBottom: '6px', fontWeight: 600 }}>{label}</div>
      <div style={{
        fontSize: '18pt',
        fontWeight: 700,
        color: getScoreColor(score)
      }}>
        {score}
      </div>
    </div>
  );
}
