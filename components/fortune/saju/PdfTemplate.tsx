'use client';

/**
 * 사주 분석 결과 PDF 템플릿
 *
 * HTML 기반 PDF 생성을 위한 템플릿 컴포넌트
 * 프리미엄급 고급스러운 디자인 적용
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

// 오행 시적 표현
const ELEMENT_POETIC: Record<Element, string> = {
  wood: '푸른 새싹',
  fire: '타오르는 불꽃',
  earth: '너른 대지',
  metal: '빛나는 보석',
  water: '깊은 물'
};

const PdfTemplate = forwardRef<HTMLDivElement, PdfTemplateProps>(
  ({ user, saju, oheng, result, premium, targetYear = 2026 }, ref) => {
    const { scores, personality, yongsin, gisin } = result;

    // 나이 계산
    const birthYear = parseInt(user.birthDate.split('-')[0]);
    const age = targetYear - birthYear;

    // 오행 정렬 (높은 순)
    const sortedElements = (['wood', 'fire', 'earth', 'metal', 'water'] as Element[])
      .map(el => ({ key: el, value: oheng[el] || 0 }))
      .sort((a, b) => b.value - a.value);

    const strongestElement = sortedElements[0];
    const weakestElement = sortedElements[4];

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
        {/* 표지 */}
        <div style={{
          textAlign: 'center',
          marginBottom: '60px',
          paddingTop: '80px'
        }}>
          <h1 style={{
            fontSize: '28pt',
            fontWeight: 700,
            marginBottom: '20px',
            background: 'linear-gradient(135deg, #6366f1 0%, #a855f7 100%)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            backgroundClip: 'text'
          }}>
            사주팔자 분석 리포트
          </h1>
          <p style={{ fontSize: '16pt', color: '#6b7280', marginBottom: '40px' }}>
            {targetYear}년 운세 분석
          </p>

          <div style={{
            display: 'inline-block',
            padding: '30px 50px',
            background: 'linear-gradient(135deg, #f8fafc 0%, #e2e8f0 100%)',
            borderRadius: '16px',
            border: '1px solid #e2e8f0'
          }}>
            <p style={{ fontSize: '14pt', marginBottom: '8px' }}>
              <strong>성명:</strong> {user.name}
            </p>
            <p style={{ fontSize: '12pt', color: '#4b5563', marginBottom: '4px' }}>
              생년월일: {user.birthDate} (만 {age}세)
            </p>
            {user.birthTime && (
              <p style={{ fontSize: '12pt', color: '#4b5563', marginBottom: '4px' }}>
                출생시간: {user.birthTime}
              </p>
            )}
            <p style={{ fontSize: '12pt', color: '#4b5563' }}>
              성별: {user.gender === 'male' ? '남성' : '여성'}
            </p>
          </div>

          <p style={{ fontSize: '10pt', color: '#9ca3af', marginTop: '60px' }}>
            발행일: {new Date().toLocaleDateString('ko-KR')}
          </p>
          <p style={{
            fontSize: '11pt',
            color: '#6366f1',
            fontWeight: 600,
            marginTop: '8px'
          }}>
            AI-SAJU Premium Service
          </p>
        </div>

        {/* 페이지 나누기 */}
        <div style={{ pageBreakAfter: 'always' }} />

        {/* 1. 사주팔자 기본 정보 */}
        <Section title="1. 사주팔자 기본 정보">
          <SubSection title="사주 구성">
            <table style={{
              width: '100%',
              borderCollapse: 'collapse',
              marginBottom: '20px'
            }}>
              <thead>
                <tr style={{ backgroundColor: '#f8fafc' }}>
                  <th style={tableHeaderStyle}>구분</th>
                  <th style={tableHeaderStyle}>천간</th>
                  <th style={tableHeaderStyle}>지지</th>
                  <th style={tableHeaderStyle}>오행</th>
                  <th style={tableHeaderStyle}>의미</th>
                </tr>
              </thead>
              <tbody>
                {[
                  { name: '년주', pillar: saju.year, meaning: '조상/사회' },
                  { name: '월주', pillar: saju.month, meaning: '부모/직장' },
                  { name: '일주', pillar: saju.day, meaning: '본인/배우자' },
                  { name: '시주', pillar: saju.time, meaning: '자녀/말년' }
                ].map(({ name, pillar, meaning }) => pillar && (
                  <tr key={name}>
                    <td style={tableCellStyle}><strong>{name}</strong></td>
                    <td style={{ ...tableCellStyle, textAlign: 'center', fontSize: '14pt' }}>
                      {pillar.stemKorean || pillar.heavenlyStem || '-'}
                    </td>
                    <td style={{ ...tableCellStyle, textAlign: 'center', fontSize: '14pt' }}>
                      {pillar.branchKorean || pillar.earthlyBranch || '-'}
                    </td>
                    <td style={{ ...tableCellStyle, textAlign: 'center' }}>
                      <span style={{
                        display: 'inline-block',
                        padding: '2px 8px',
                        borderRadius: '4px',
                        backgroundColor: pillar.element ? `${ELEMENT_COLORS[pillar.element]}20` : '#f3f4f6',
                        color: pillar.element ? ELEMENT_COLORS[pillar.element] : '#6b7280',
                        fontWeight: 600
                      }}>
                        {pillar.element ? ELEMENT_NAMES[pillar.element] : '-'}
                      </span>
                    </td>
                    <td style={{ ...tableCellStyle, color: '#6b7280', fontSize: '9pt' }}>
                      {meaning}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </SubSection>
        </Section>

        {/* 2. 오행 분석 */}
        <Section title="2. 오행 분석">
          <SubSection title="오행 분포">
            <div style={{ marginBottom: '20px' }}>
              {sortedElements.map(({ key, value }) => (
                <div key={key} style={{
                  display: 'flex',
                  alignItems: 'center',
                  marginBottom: '12px'
                }}>
                  <span style={{
                    width: '60px',
                    fontWeight: 600,
                    color: ELEMENT_COLORS[key]
                  }}>
                    {ELEMENT_NAMES[key]}
                  </span>
                  <div style={{
                    flex: 1,
                    height: '20px',
                    backgroundColor: '#f3f4f6',
                    borderRadius: '10px',
                    overflow: 'hidden',
                    marginRight: '12px'
                  }}>
                    <div style={{
                      width: `${value}%`,
                      height: '100%',
                      backgroundColor: ELEMENT_COLORS[key],
                      borderRadius: '10px',
                      transition: 'width 0.3s'
                    }} />
                  </div>
                  <span style={{
                    width: '50px',
                    textAlign: 'right',
                    fontWeight: 500
                  }}>
                    {value.toFixed(1)}%
                  </span>
                </div>
              ))}
            </div>

            <InfoBox type="highlight">
              <p style={{ marginBottom: '8px' }}>
                <strong>강한 기운:</strong> {ELEMENT_POETIC[strongestElement.key]} ({strongestElement.value.toFixed(1)}%)
              </p>
              <p>
                <strong>보완 필요:</strong> {ELEMENT_POETIC[weakestElement.key]} ({weakestElement.value.toFixed(1)}%)
              </p>
            </InfoBox>
          </SubSection>

          {(yongsin?.length > 0 || gisin?.length > 0) && (
            <SubSection title="용신/기신 분석">
              <div style={{ display: 'flex', gap: '20px', flexWrap: 'wrap' }}>
                {yongsin?.length > 0 && (
                  <InfoBox type="success" style={{ flex: 1, minWidth: '200px' }}>
                    <h4 style={{
                      color: '#059669',
                      fontWeight: 600,
                      marginBottom: '8px',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '8px'
                    }}>
                      ★ 용신 - 힘이 되는 기운
                    </h4>
                    {yongsin.map(el => (
                      <p key={el} style={{ marginBottom: '4px' }}>
                        • {ELEMENT_POETIC[el]} ({ELEMENT_NAMES[el]})
                      </p>
                    ))}
                    <p style={{
                      fontSize: '9pt',
                      color: '#6b7280',
                      marginTop: '8px',
                      fontStyle: 'italic'
                    }}>
                      이 오행과 관련된 색상, 방향, 활동을 활용하면 운이 상승합니다.
                    </p>
                  </InfoBox>
                )}

                {gisin?.length > 0 && (
                  <InfoBox type="warning" style={{ flex: 1, minWidth: '200px' }}>
                    <h4 style={{
                      color: '#dc2626',
                      fontWeight: 600,
                      marginBottom: '8px',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '8px'
                    }}>
                      ☆ 기신 - 조심할 기운
                    </h4>
                    {gisin.map(el => (
                      <p key={el} style={{ marginBottom: '4px' }}>
                        • {ELEMENT_POETIC[el]} ({ELEMENT_NAMES[el]})
                      </p>
                    ))}
                    <p style={{
                      fontSize: '9pt',
                      color: '#6b7280',
                      marginTop: '8px',
                      fontStyle: 'italic'
                    }}>
                      이 오행 관련 활동을 줄이면 균형을 유지할 수 있습니다.
                    </p>
                  </InfoBox>
                )}
              </div>
            </SubSection>
          )}
        </Section>

        {/* 페이지 나누기 */}
        <div style={{ pageBreakAfter: 'always' }} />

        {/* 3. 운세 점수 */}
        <Section title={`3. ${targetYear}년 운세 점수`}>
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(5, 1fr)',
            gap: '15px',
            marginBottom: '20px'
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
            <p style={{ textAlign: 'center', fontWeight: 500 }}>
              {targetYear}년 종합 점수 <strong style={{ fontSize: '16pt', color: '#6366f1' }}>{scores.overall}점</strong>
              {scores.overall >= 80 ? ' - 매우 좋은 해입니다!' :
               scores.overall >= 60 ? ' - 무난한 해입니다.' :
               ' - 신중한 해입니다.'}
            </p>
          </InfoBox>
        </Section>

        {/* 4. 성격 분석 */}
        {personality && (
          <Section title="4. 성격 분석">
            <div style={{ display: 'flex', gap: '20px', flexWrap: 'wrap' }}>
              <InfoBox type="default" style={{ flex: 1, minWidth: '200px' }}>
                <h4 style={{ fontWeight: 600, marginBottom: '12px' }}>사주 특성</h4>
                <ul style={{ paddingLeft: '20px', margin: 0 }}>
                  {personality.sajuTraits?.map((s, i) => (
                    <li key={i} style={{ marginBottom: '4px' }}>{s}</li>
                  ))}
                </ul>
              </InfoBox>

              {personality.mbtiTraits && (
                <InfoBox type="default" style={{ flex: 1, minWidth: '200px' }}>
                  <h4 style={{ fontWeight: 600, marginBottom: '12px' }}>MBTI 특성</h4>
                  <ul style={{ paddingLeft: '20px', margin: 0 }}>
                    {personality.mbtiTraits.map((w, i) => (
                      <li key={i} style={{ marginBottom: '4px' }}>{w}</li>
                    ))}
                  </ul>
                </InfoBox>
              )}
            </div>

            {personality.crossAnalysis && (
              <InfoBox type="highlight" style={{ marginTop: '20px' }}>
                <p style={{ marginBottom: '8px' }}>
                  <strong>일치도:</strong> {personality.crossAnalysis.matchRate}%
                </p>
                <p style={{ marginBottom: '8px' }}>
                  <strong>시너지:</strong> {personality.crossAnalysis.synergy}
                </p>
                <p style={{ marginBottom: '8px' }}>
                  <strong>보완점:</strong> {personality.crossAnalysis.conflict}
                </p>
                <p>
                  <strong>해결책:</strong> {personality.crossAnalysis.resolution}
                </p>
              </InfoBox>
            )}

            {personality.coreKeyword && (
              <InfoBox type="info" style={{ marginTop: '16px', textAlign: 'center' }}>
                <p style={{ fontSize: '12pt', fontWeight: 600, color: '#6366f1' }}>
                  "{personality.coreKeyword}"
                </p>
              </InfoBox>
            )}
          </Section>
        )}

        {/* 프리미엄 콘텐츠 */}
        {premium && (
          <>
            {/* 페이지 나누기 */}
            <div style={{ pageBreakAfter: 'always' }} />

            {/* 5. 월별 운세 */}
            {premium.monthlyActionPlan && (
              <Section title="5. 월별 행운 액션플랜">
                <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                  <thead>
                    <tr style={{ backgroundColor: '#f8fafc' }}>
                      <th style={tableHeaderStyle}>월</th>
                      <th style={tableHeaderStyle}>점수</th>
                      <th style={tableHeaderStyle}>해야 할 것</th>
                      <th style={tableHeaderStyle}>피해야 할 것</th>
                    </tr>
                  </thead>
                  <tbody>
                    {premium.monthlyActionPlan.map((month, idx) => (
                      <tr key={idx}>
                        <td style={{ ...tableCellStyle, fontWeight: 600, textAlign: 'center' }}>
                          {month.monthName}
                        </td>
                        <td style={{ ...tableCellStyle, textAlign: 'center' }}>
                          <span style={{
                            display: 'inline-block',
                            padding: '2px 8px',
                            borderRadius: '4px',
                            backgroundColor: month.score >= 80 ? '#dcfce7' : month.score >= 60 ? '#fef3c7' : '#fee2e2',
                            color: month.score >= 80 ? '#059669' : month.score >= 60 ? '#d97706' : '#dc2626',
                            fontWeight: 600
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

            {/* 6. 직업 분석 */}
            {premium.careerAnalysis && (
              <Section title="6. 직업 및 커리어 분석">
                <div style={{ display: 'flex', gap: '20px', flexWrap: 'wrap' }}>
                  <InfoBox type="default" style={{ flex: 1, minWidth: '200px' }}>
                    <h4 style={{ fontWeight: 600, marginBottom: '12px' }}>현재 직업 적합도</h4>
                    <p style={{ marginBottom: '8px' }}>
                      직업: {user.careerType ? CAREER_KOREAN[user.careerType] || user.careerType : '미입력'}
                    </p>
                    <p>
                      적합도: <strong style={{ fontSize: '14pt', color: '#6366f1' }}>
                        {premium.careerAnalysis.matchScore}점
                      </strong>
                    </p>
                  </InfoBox>

                  <InfoBox type="success" style={{ flex: 1, minWidth: '200px' }}>
                    <h4 style={{ fontWeight: 600, marginBottom: '12px', color: '#059669' }}>
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

            {/* 페이지 나누기 */}
            <div style={{ pageBreakAfter: 'always' }} />

            {/* 7. 인생 타임라인 */}
            {premium.lifeTimeline && (
              <Section title="7. 인생 타임라인">
                <p style={{ marginBottom: '16px', color: '#6b7280' }}>
                  현재 나이: <strong>{premium.lifeTimeline.currentAge}세</strong>
                </p>

                {premium.lifeTimeline.phases?.map((phase, idx) => (
                  <InfoBox
                    key={idx}
                    type={phase.score >= 70 ? 'success' : 'default'}
                    style={{ marginBottom: '16px' }}
                  >
                    <h4 style={{ fontWeight: 600, marginBottom: '8px' }}>
                      [{phase.ageRange}세] {phase.phase} - {phase.score}점
                    </h4>
                    <div style={{ display: 'flex', gap: '20px' }}>
                      <div style={{ flex: 1 }}>
                        <p style={{ fontSize: '9pt', color: '#059669', fontWeight: 500 }}>기회</p>
                        <p style={{ fontSize: '9pt' }}>{phase.opportunities?.join(', ')}</p>
                      </div>
                      <div style={{ flex: 1 }}>
                        <p style={{ fontSize: '9pt', color: '#dc2626', fontWeight: 500 }}>도전</p>
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
                          <th style={tableHeaderStyle}>성공률</th>
                        </tr>
                      </thead>
                      <tbody>
                        {premium.lifeTimeline.goldenWindows.map((gw, idx) => (
                          <tr key={idx}>
                            <td style={tableCellStyle}>{gw.period}</td>
                            <td style={tableCellStyle}>{gw.purpose}</td>
                            <td style={{ ...tableCellStyle, textAlign: 'center', fontWeight: 600, color: '#d97706' }}>
                              {gw.successRate}%
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </SubSection>
                )}
              </Section>
            )}
          </>
        )}

        {/* 마무리 페이지 */}
        <div style={{ pageBreakBefore: 'always', textAlign: 'center', paddingTop: '80px' }}>
          <h2 style={{ fontSize: '18pt', marginBottom: '30px', color: '#6366f1' }}>
            분석을 마치며
          </h2>

          <InfoBox type="highlight" style={{ maxWidth: '500px', margin: '0 auto 30px' }}>
            <p style={{ marginBottom: '12px' }}>
              이 분석 리포트는 사주팔자를 기반으로 한 참고 자료입니다.
            </p>
            <p style={{ marginBottom: '12px' }}>
              운명은 정해진 것이 아니라 자신의 선택과 노력에 따라 바뀔 수 있습니다.
            </p>
            <p style={{ fontWeight: 600, color: '#6366f1' }}>
              좋은 운은 준비된 자에게 찾아옵니다.
            </p>
          </InfoBox>

          <div style={{ marginTop: '60px', color: '#9ca3af' }}>
            <p>분석 생성일: {new Date().toLocaleDateString('ko-KR')}</p>
            <p style={{ marginTop: '8px', fontWeight: 600, color: '#6366f1' }}>
              AI-SAJU Premium Service
            </p>
            <p style={{ fontSize: '9pt', marginTop: '4px' }}>
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

// 스타일 상수
const tableHeaderStyle: React.CSSProperties = {
  padding: '10px 12px',
  textAlign: 'left',
  fontWeight: 600,
  fontSize: '9pt',
  borderBottom: '2px solid #e5e7eb',
  color: '#374151'
};

const tableCellStyle: React.CSSProperties = {
  padding: '10px 12px',
  borderBottom: '1px solid #e5e7eb',
  fontSize: '10pt'
};

// 컴포넌트들
function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div style={{ marginBottom: '30px' }}>
      <h2 style={{
        fontSize: '14pt',
        fontWeight: 700,
        color: '#1f2937',
        marginBottom: '16px',
        paddingBottom: '8px',
        borderBottom: '2px solid #6366f1'
      }}>
        {title}
      </h2>
      {children}
    </div>
  );
}

function SubSection({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div style={{ marginBottom: '20px' }}>
      <h3 style={{
        fontSize: '11pt',
        fontWeight: 600,
        color: '#374151',
        marginBottom: '12px',
        display: 'flex',
        alignItems: 'center',
        gap: '8px'
      }}>
        ■ {title}
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
      padding: '16px',
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

  return (
    <div style={{
      textAlign: 'center',
      padding: '16px',
      borderRadius: '12px',
      background: 'linear-gradient(135deg, #f8fafc 0%, #e2e8f0 100%)',
      border: '1px solid #e2e8f0'
    }}>
      <div style={{ fontSize: '20pt', marginBottom: '4px' }}>{icon}</div>
      <div style={{ fontSize: '9pt', color: '#6b7280', marginBottom: '4px' }}>{label}</div>
      <div style={{
        fontSize: '16pt',
        fontWeight: 700,
        color: getScoreColor(score)
      }}>
        {score}
      </div>
    </div>
  );
}
