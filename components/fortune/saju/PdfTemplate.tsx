'use client';

/**
 * 사주 분석 결과 PDF 템플릿
 *
 * HTML 기반 PDF 생성을 위한 템플릿 컴포넌트
 * 프리미엄급 고급스러운 디자인 적용
 * 전통 사주 이론 (십신, 신살, 12운성, 합충형파해) 통합
 */

import { forwardRef, useState, useEffect } from 'react';
import QRCode from 'qrcode';
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

// 오행별 구체적 추천 정보
const ELEMENT_SPECIFICS: Record<Element, {
  colors: string;
  direction: string;
  foods: string;
  personTypes: string;
  mbtiTypes: string;
  sense: string;
  senseAdvice: string;
}> = {
  wood: {
    colors: '청록색, 초록색, 연두색 계열의 의류나 소품',
    direction: '동쪽 방향 (창문이 동향인 방, 동쪽에 있는 카페나 공원)',
    foods: '푸른 잎채소, 신맛 과일(레몬, 귤, 매실), 식초 드레싱 샐러드',
    personTypes: '도전적이고 추진력 있는 사람, 새로운 아이디어를 잘 내는 창의적 성향, 성장 지향적이고 긍정 에너지를 가진 사람',
    mbtiTypes: 'ENFP, ENTP, ENTJ 성향',
    sense: '시각',
    senseAdvice: '시각적 자극에 민감할 수 있습니다. 자연의 푸른 풍경을 자주 보면 마음이 안정되며, 복잡한 시각 환경은 피로를 유발할 수 있으니 정리된 공간을 유지하세요.'
  },
  fire: {
    colors: '빨간색, 자주색, 오렌지색 계열의 포인트 아이템',
    direction: '남쪽 방향 (햇볕이 잘 드는 남향 공간, 남쪽의 모임 장소)',
    foods: '쓴맛 식품(커피, 다크초콜릿, 녹차), 붉은 과일(석류, 토마토), 고추류',
    personTypes: '에너지 넘치고 밝은 성격의 사람, 열정적으로 목표를 추구하는 리더형, 유머 감각이 있고 분위기를 띄우는 사람',
    mbtiTypes: 'ESFP, ENFJ, ESTP 성향',
    sense: '미각',
    senseAdvice: '미각이 예민한 편입니다. 다양한 맛의 음식으로 에너지를 충전할 수 있으며, 너무 자극적인 음식은 감정 기복을 키울 수 있으니 균형 잡힌 식사를 권합니다.'
  },
  earth: {
    colors: '노란색, 베이지색, 갈색 계열의 안정감 있는 톤',
    direction: '거주지 중심부 (집 가까운 곳에서의 활동, 익숙한 공간)',
    foods: '단맛 식품(고구마, 호박, 꿀, 대추차), 곡물류(현미, 잡곡밥), 뿌리채소(당근, 감자)',
    personTypes: '신뢰감 있고 안정적인 사람, 약속을 잘 지키며 책임감이 강한 사람, 경청을 잘 하고 포용력 있는 사람',
    mbtiTypes: 'ISFJ, ISTJ, ESFJ 성향',
    sense: '촉각',
    senseAdvice: '촉각에 예민한 편입니다. 부드러운 소재의 옷이나 침구가 안정감을 주며, 맨발로 흙이나 잔디를 밟는 접지(어싱)가 기운 보충에 도움이 됩니다.'
  },
  metal: {
    colors: '흰색, 금색, 은색 계열의 깔끔한 톤',
    direction: '서쪽 방향 (저녁 노을이 보이는 서향 공간, 서쪽 지역 여행)',
    foods: '매운맛 식품(생강차, 마늘, 양파), 흰색 식품(무, 배, 도라지), 견과류',
    personTypes: '원칙을 중시하고 체계적인 사람, 분석력이 뛰어나고 논리적인 사람, 결단력 있고 정직한 사람',
    mbtiTypes: 'INTJ, ESTJ, ISTJ 성향',
    sense: '후각',
    senseAdvice: '후각이 민감한 편입니다. 은은한 아로마(라벤더, 유칼립투스)가 집중력을 높이며, 강한 향이나 환기 안 되는 공간은 컨디션 저하를 유발할 수 있으니 주의하세요.'
  },
  water: {
    colors: '검정색, 남색, 짙은 파란색 계열의 차분한 톤',
    direction: '북쪽 방향 (조용하고 차분한 북향 서재, 북쪽 방면의 수변 공간)',
    foods: '해산물(생선, 새우, 미역), 콩류(두부, 된장, 검은콩), 수분이 풍부한 과일(수박, 배)',
    personTypes: '차분하고 사려 깊은 사람, 직관력이 뛰어나고 감성이 풍부한 사람, 조용하지만 깊이 있는 대화를 나눌 수 있는 사람',
    mbtiTypes: 'INFJ, INTP, INFP 성향',
    sense: '청각',
    senseAdvice: '청각이 예민한 편입니다. 자연의 물소리나 잔잔한 음악이 마음의 평화를 가져다주며, 소음이 많은 환경에서는 에너지가 빠르게 소모되니 조용한 시간을 확보하세요.'
  }
};

// 오행별 기신 주의사항
const ELEMENT_CAUTION: Record<Element, string> = {
  wood: '목(木) 기운이 과할 때는 충동적인 새 시작이나 무리한 사업 확장을 자제하세요. 푸른색 계열 의류를 줄이고, 동쪽 방향의 큰 결정을 미루는 것이 좋습니다. 과도한 신맛 음식을 피하고, 무계획적으로 도전만 추구하는 사람과는 거리를 두세요.',
  fire: '화(火) 기운이 과할 때는 감정적 대응이나 성급한 판단을 주의하세요. 빨간색 계열 의류를 줄이고, 남쪽 방향 이동이나 뜨거운 환경을 피하는 것이 좋습니다. 맵고 자극적인 음식을 줄이고, 흥분을 부추기는 사람과의 접촉을 자제하세요.',
  earth: '토(土) 기운이 과할 때는 지나친 안전 추구로 기회를 놓칠 수 있습니다. 갈색·베이지 톤을 줄이고, 익숙한 곳만 고집하지 마세요. 단맛 음식 과잉 섭취를 주의하고, 변화를 두려워하며 현상 유지만 바라는 사람에게서 벗어나세요.',
  metal: '금(金) 기운이 과할 때는 과도한 비판이나 완벽주의가 인간관계를 해칠 수 있습니다. 흰색·금속 톤을 줄이고, 서쪽 방향의 중요 계약을 재고하세요. 매운 음식을 줄이고, 지나치게 원칙적이고 융통성 없는 사람과의 갈등을 조심하세요.',
  water: '수(水) 기운이 과할 때는 우유부단함이나 지나친 걱정으로 행동력이 떨어질 수 있습니다. 검정·남색 의류를 줄이고, 북쪽 방향의 이동을 자제하세요. 짠 음식 과잉 섭취를 주의하고, 비관적이고 소극적인 사람과의 장시간 교류를 피하세요.'
};

const PdfTemplate = forwardRef<HTMLDivElement, PdfTemplateProps>(
  ({ user, saju, oheng, result, premium, targetYear = 2026 }, ref) => {
    // QR 코드 생성
    const [qrCodeDataUrl, setQrCodeDataUrl] = useState<string>('');

    // 추천 코드 생성 (이름 + 생년월일 해시)
    const generateReferralCode = () => {
      const base = `${user.name}${user.birthDate}`.replace(/[^a-zA-Z0-9가-힣]/g, '');
      // 간단한 해시: 문자열을 숫자로 변환
      let hash = 0;
      for (let i = 0; i < base.length; i++) {
        hash = ((hash << 5) - hash) + base.charCodeAt(i);
        hash = hash & hash; // 32bit integer로 변환
      }
      return `REF-${Math.abs(hash).toString(36).toUpperCase().slice(0, 8)}`;
    };

    const referralCode = generateReferralCode();
    const referralLink = `https://ai-planx.com/signup?ref=${referralCode}`;

    useEffect(() => {
      // QR 코드 생성
      QRCode.toDataURL(referralLink, {
        width: 140,
        margin: 1,
        color: { dark: '#4f46e5', light: '#ffffff' }
      })
        .then(url => setQrCodeDataUrl(url))
        .catch(err => console.error('QR code generation failed:', err));
    }, [referralLink]);

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
          padding: '12mm',
          backgroundColor: '#ffffff',
          fontFamily: 'Pretendard, "Noto Sans KR", "Malgun Gothic", -apple-system, BlinkMacSystemFont, sans-serif',
          fontSize: '13pt',
          lineHeight: 1.7,
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
          minHeight: '220mm',
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

          <p style={{ fontSize: '18pt', color: '#6b7280', marginBottom: '50px' }}>
            {targetYear}년 운세 분석
          </p>

          {/* 사용자 정보 카드 */}
          <div style={{
            display: 'inline-block',
            padding: '30px 50px',
            background: 'linear-gradient(135deg, #f8fafc 0%, #e2e8f0 100%)',
            borderRadius: '20px',
            border: '1px solid #e2e8f0',
            boxShadow: '0 4px 20px rgba(0,0,0,0.1)'
          }}>
            <p style={{ fontSize: '20pt', marginBottom: '12px', fontWeight: 700, color: '#1f2937' }}>
              <span style={{ color: '#6366f1' }}>성명:</span> {user.name}
            </p>
            <div style={{ borderTop: '1px solid #d1d5db', paddingTop: '12px', marginTop: '12px' }}>
              <p style={{ fontSize: '14pt', color: '#4b5563', marginBottom: '8px' }}>
                생년월일: {user.birthDate} (만 {age}세 / 한국나이 {koreanAge}세)
              </p>
              {user.birthTime && (
                <p style={{ fontSize: '14pt', color: '#4b5563', marginBottom: '8px' }}>
                  출생시간: {user.birthTime}
                </p>
              )}
              <p style={{ fontSize: '14pt', color: '#4b5563', marginBottom: '8px' }}>
                성별: {user.gender === 'male' ? '남성' : '여성'}
              </p>
              {user.bloodType && (
                <p style={{ fontSize: '14pt', color: '#4b5563', marginBottom: '8px' }}>
                  혈액형: {user.bloodType}형
                </p>
              )}
              {zodiacSign && (
                <p style={{ fontSize: '14pt', color: '#4b5563', marginBottom: '8px' }}>
                  별자리: {zodiacSign}
                </p>
              )}
              {user.mbti && (
                <p style={{ fontSize: '14pt', color: '#4b5563' }}>
                  MBTI: {user.mbti}
                </p>
              )}
            </div>
          </div>

          <div style={{ marginTop: '50px' }}>
            <p style={{ fontSize: '12pt', color: '#9ca3af' }}>
              발행일: {new Date().toLocaleDateString('ko-KR')}
            </p>
            <p style={{
              fontSize: '12pt',
              color: '#6366f1',
              fontWeight: 600,
              marginTop: '8px'
            }}>
              AI-PLANX Premium Service
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
                        fontSize: '13pt'
                      }}>
                        {pillar.element ? ELEMENT_NAMES[pillar.element] : '-'}
                      </span>
                    </td>
                    <td style={{ ...tableCellStyle, color: '#6b7280', fontSize: '13pt', textAlign: 'center' }}>
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
            <div style={{ marginBottom: '14px' }}>
              {sortedElements.map(({ key, value }) => (
                <div key={key} style={{
                  display: 'flex',
                  alignItems: 'center',
                  marginBottom: '10px'
                }}>
                  <span style={{
                    width: '80px',
                    fontWeight: 700,
                    color: ELEMENT_COLORS[key],
                    fontSize: '13pt'
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
                    fontSize: '13pt'
                  }}>
                    {value.toFixed(1)}%
                  </span>
                </div>
              ))}
            </div>

            {/* 가장 강한 기운 설명 */}
            <InfoBox type="success" style={{ marginBottom: '10px' }}>
              <h4 style={{ color: '#059669', fontWeight: 700, marginBottom: '8px', fontSize: '14pt' }}>
                가장 강한 기운: {ELEMENT_NATURE[strongestElement.key]} ({strongestElement.value.toFixed(1)}%)
              </h4>
              <p style={{ color: '#374151', lineHeight: 1.6 }}>
                {ELEMENT_DESCRIPTION[strongestElement.key]}
              </p>
            </InfoBox>

            {/* 보완이 필요한 기운 설명 */}
            <InfoBox type="warning">
              <h4 style={{ color: '#dc2626', fontWeight: 700, marginBottom: '8px', fontSize: '14pt' }}>
                보완이 필요한 기운: {ELEMENT_NATURE[weakestElement.key]} ({weakestElement.value.toFixed(1)}%)
              </h4>
              <p style={{ color: '#374151', lineHeight: 1.6 }}>
                {ELEMENT_DESCRIPTION[weakestElement.key]} 이 기운을 보완하면 삶의 균형을 찾을 수 있습니다.
              </p>
            </InfoBox>
          </SubSection>

          {/* 용신/기신 분석 */}
          {(yongsin?.length > 0 || gisin?.length > 0) && (
            <SubSection title="용신(用神) & 기신(忌神) - 운을 좌우하는 핵심 에너지">
              <p style={{ color: '#6b7280', marginBottom: '14px', fontSize: '12pt', lineHeight: 1.7 }}>
                용신은 당신의 사주에서 부족한 기운을 채워 균형을 잡아주는 <strong>행운의 에너지</strong>이고,
                기신은 이미 과한 기운이 더해질 때 <strong>불균형을 일으키는 에너지</strong>입니다.
                아래 가이드를 일상에 적용하면 운의 흐름을 더 유리하게 만들 수 있습니다.
              </p>

              {/* 용신 상세 */}
              {yongsin?.length > 0 && (
                <InfoBox type="success" style={{ marginBottom: '14px' }}>
                  <h4 style={{
                    color: '#059669',
                    fontWeight: 700,
                    marginBottom: '14px',
                    fontSize: '14pt'
                  }}>
                    용신 - 행운을 가져다 주는 기운
                  </h4>
                  {yongsin.map(el => (
                    <div key={el} style={{
                      marginBottom: '16px',
                      paddingBottom: '16px',
                      borderBottom: '1px dashed #86efac'
                    }}>
                      <p style={{
                        fontWeight: 700,
                        color: ELEMENT_COLORS[el],
                        fontSize: '13pt',
                        marginBottom: '10px'
                      }}>
                        {ELEMENT_NATURE[el]}
                      </p>
                      <div style={{ fontSize: '12pt', color: '#374151', lineHeight: 1.8 }}>
                        <p style={{ marginBottom: '4px' }}>
                          <strong style={{ color: '#059669' }}>행운 색상:</strong> {ELEMENT_SPECIFICS[el].colors}
                        </p>
                        <p style={{ marginBottom: '4px' }}>
                          <strong style={{ color: '#059669' }}>유리한 방향:</strong> {ELEMENT_SPECIFICS[el].direction}
                        </p>
                        <p style={{ marginBottom: '4px' }}>
                          <strong style={{ color: '#059669' }}>추천 음식:</strong> {ELEMENT_SPECIFICS[el].foods}
                        </p>
                        <p style={{ marginBottom: '4px' }}>
                          <strong style={{ color: '#059669' }}>함께하면 좋은 사람:</strong> {ELEMENT_SPECIFICS[el].personTypes}
                          {' '}({ELEMENT_SPECIFICS[el].mbtiTypes})
                        </p>
                      </div>
                    </div>
                  ))}
                  {/* 감각 민감도 */}
                  {yongsin.length > 0 && (
                    <div style={{
                      padding: '10px 12px',
                      backgroundColor: '#ecfdf5',
                      borderRadius: '8px',
                      fontSize: '12pt',
                      color: '#065f46',
                      lineHeight: 1.7
                    }}>
                      <strong>민감한 감각 ({ELEMENT_SPECIFICS[yongsin[0]].sense}):</strong>{' '}
                      {ELEMENT_SPECIFICS[yongsin[0]].senseAdvice}
                    </div>
                  )}
                </InfoBox>
              )}

              {/* 기신 상세 */}
              {gisin?.length > 0 && (
                <InfoBox type="warning">
                  <h4 style={{
                    color: '#dc2626',
                    fontWeight: 700,
                    marginBottom: '14px',
                    fontSize: '14pt'
                  }}>
                    기신 - 주의해야 할 기운
                  </h4>
                  {gisin.map(el => (
                    <div key={el} style={{
                      marginBottom: '16px',
                      paddingBottom: '16px',
                      borderBottom: '1px dashed #fecaca'
                    }}>
                      <p style={{
                        fontWeight: 700,
                        color: ELEMENT_COLORS[el],
                        fontSize: '13pt',
                        marginBottom: '10px'
                      }}>
                        {ELEMENT_NATURE[el]}
                      </p>
                      <p style={{ fontSize: '12pt', color: '#374151', lineHeight: 1.8 }}>
                        {ELEMENT_CAUTION[el]}
                      </p>
                    </div>
                  ))}
                </InfoBox>
              )}
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
            gap: '10px',
            marginBottom: '16px'
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
            <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap', marginTop: '14px' }}>
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
            <InfoBox type="highlight" style={{ marginTop: '14px' }}>
              <h4 style={{ fontWeight: 700, marginBottom: '8px' }}>사주-MBTI 통합 분석</h4>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px' }}>
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
              marginTop: '16px',
              padding: '14px',
              background: 'linear-gradient(135deg, #6366f1 0%, #a855f7 100%)',
              borderRadius: '10px'
            }}>
              <p style={{ fontSize: '11pt', color: '#e0e7ff', marginBottom: '6px' }}>
                당신을 한마디로 표현하면
              </p>
              <p style={{ fontSize: '16pt', fontWeight: 700, color: '#ffffff' }}>
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
                <InfoBox type="success" style={{ marginTop: '8px', marginBottom: '14px' }}>
                  <h4 style={{ fontWeight: 700, marginBottom: '6px', color: '#059669' }}>재물 전략</h4>
                  <p style={{ lineHeight: 1.7 }}>{aiAnalysis.wealthStrategy}</p>
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
                <InfoBox type="info" style={{ marginTop: '8px', marginBottom: '14px' }}>
                  <h4 style={{ fontWeight: 700, marginBottom: '6px', color: '#2563eb' }}>대인관계 분석</h4>
                  <p style={{ lineHeight: 1.7 }}>{aiAnalysis.relationshipAnalysis}</p>
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
                <InfoBox type="highlight" style={{ marginTop: '8px', marginBottom: '14px' }}>
                  <h4 style={{ fontWeight: 700, marginBottom: '6px', color: '#6366f1' }}>커리어 가이드</h4>
                  <p style={{ lineHeight: 1.7 }}>{aiAnalysis.careerGuidance}</p>
                </InfoBox>
              )}

            </>
          )}
        </Section>

        {/* ============ 건강운 (새 페이지 시작) ============ */}
        {aiAnalysis && (aiAnalysis.fortuneAdvice?.health || aiAnalysis.healthAdvice) && (
          <div style={{ pageBreakBefore: 'always', paddingTop: '30px' }}>
            <Section title="건강운 - 건강과 체력">
              {aiAnalysis.fortuneAdvice?.health && (
                <InfoBox type="default" style={{ marginBottom: '14px' }}>
                  <p style={{ lineHeight: 1.8, textAlign: 'justify' }}>
                    {aiAnalysis.fortuneAdvice.health}
                  </p>
                </InfoBox>
              )}

              {aiAnalysis.healthAdvice && (
                <InfoBox type="warning">
                  <h4 style={{ fontWeight: 700, marginBottom: '6px', color: '#dc2626' }}>건강 관리 조언</h4>
                  <p style={{ lineHeight: 1.7 }}>{aiAnalysis.healthAdvice}</p>
                </InfoBox>
              )}
            </Section>
          </div>
        )}

        {/* ============ 6. 이성관 심층 분석 ============ */}
        {aiAnalysis?.loveAndPartnerAnalysis && (
          <Section title="6. 이성관 심층 분석 - 인연과 사랑">
            {/* 후킹 메시지 */}
            {aiAnalysis.loveAndPartnerAnalysis.hook && (
              <InfoBox type="highlight" style={{ marginBottom: '16px' }}>
                <p style={{ lineHeight: 1.8, textAlign: 'justify', fontSize: '14pt', fontWeight: 500 }}>
                  {aiAnalysis.loveAndPartnerAnalysis.hook}
                </p>
              </InfoBox>
            )}

            {/* 이상적인 파트너 */}
            {aiAnalysis.loveAndPartnerAnalysis.idealPartnerTraits?.length > 0 && (
              <SubSection title="나에게 맞는 이상적인 파트너">
                <InfoBox type="success">
                  <ul style={{ paddingLeft: '20px', margin: 0 }}>
                    {aiAnalysis.loveAndPartnerAnalysis.idealPartnerTraits.map((trait: string, i: number) => (
                      <li key={i} style={{ marginBottom: '8px', lineHeight: 1.7 }}>
                        {trait}
                      </li>
                    ))}
                  </ul>
                </InfoBox>
              </SubSection>
            )}

            {/* 상성 분석 */}
            {aiAnalysis.loveAndPartnerAnalysis.compatibilityFactors && (
              <SubSection title="MBTI, 별자리, 사주 종합 상성">
                <InfoBox type="info">
                  <p style={{ lineHeight: 1.8, textAlign: 'justify' }}>
                    {aiAnalysis.loveAndPartnerAnalysis.compatibilityFactors}
                  </p>
                </InfoBox>
              </SubSection>
            )}

            {/* 주의해야 할 이성 유형 */}
            {aiAnalysis.loveAndPartnerAnalysis.warningSignsInPartner?.length > 0 && (
              <SubSection title="주의해야 할 이성 유형">
                <InfoBox type="warning">
                  <ul style={{ paddingLeft: '20px', margin: 0 }}>
                    {aiAnalysis.loveAndPartnerAnalysis.warningSignsInPartner.map((sign: string, i: number) => (
                      <li key={i} style={{ marginBottom: '8px', lineHeight: 1.7, color: '#dc2626' }}>
                        {sign}
                      </li>
                    ))}
                  </ul>
                </InfoBox>
              </SubSection>
            )}

            {/* 만남 전략 */}
            {aiAnalysis.loveAndPartnerAnalysis.meetingStrategy && (
              <SubSection title="좋은 인연을 만나는 방법">
                <InfoBox type="default">
                  <p style={{ lineHeight: 1.8, textAlign: 'justify' }}>
                    {aiAnalysis.loveAndPartnerAnalysis.meetingStrategy}
                  </p>
                </InfoBox>
              </SubSection>
            )}

            {/* 연애 스타일 조언 */}
            {aiAnalysis.loveAndPartnerAnalysis.relationshipAdvice && (
              <SubSection title="나의 연애 스타일과 조언">
                <InfoBox type="highlight">
                  <p style={{ lineHeight: 1.8, textAlign: 'justify' }}>
                    {aiAnalysis.loveAndPartnerAnalysis.relationshipAdvice}
                  </p>
                </InfoBox>
              </SubSection>
            )}

            {/* 인연 시기 분석 */}
            {aiAnalysis.loveAndPartnerAnalysis.timingAnalysis && (
              <SubSection title="인연이 찾아오는 시기">
                <InfoBox type="info">
                  <p style={{ lineHeight: 1.8, textAlign: 'justify' }}>
                    {aiAnalysis.loveAndPartnerAnalysis.timingAnalysis}
                  </p>
                </InfoBox>
              </SubSection>
            )}

            {/* 파트너 체크리스트 */}
            {aiAnalysis.loveAndPartnerAnalysis.partnerChecklist?.length > 0 && (
              <SubSection title="이 사람이 나와 맞는지 확인하는 체크리스트">
                <InfoBox type="default" style={{ backgroundColor: '#fef3c7', border: '1px solid #fbbf24' }}>
                  <p style={{ marginBottom: '12px', fontWeight: 700, color: '#92400e' }}>
                    만나고 있는 사람이 있다면, 아래 항목들을 체크해보세요:
                  </p>
                  <ol style={{ paddingLeft: '20px', margin: 0 }}>
                    {aiAnalysis.loveAndPartnerAnalysis.partnerChecklist.map((item: string, i: number) => (
                      <li key={i} style={{ marginBottom: '8px', lineHeight: 1.7, color: '#78350f' }}>
                        {item}
                      </li>
                    ))}
                  </ol>
                  <p style={{ marginTop: '12px', fontSize: '12pt', color: '#92400e' }}>
                    * 3개 이상 해당된다면 좋은 인연일 가능성이 높습니다.
                  </p>
                </InfoBox>
              </SubSection>
            )}
          </Section>
        )}

        {/* ============ 7. 대운과 인생 흐름 (6번 이성관 분석 바로 아래) ============ */}
        <Section title="7. 대운(大運)과 인생 흐름">
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

        {/* ============ 8. 행운 요소 & 주의사항 ============ */}
        <Section title="8. 행운 요소 & 주의사항">
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
              <Section title="9. 월별 행운 액션플랜">
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
                        <td style={{ ...tableCellStyle, fontSize: '13pt' }}>
                          {month.mustDo?.slice(0, 2).map(d => d.action).join(', ') || '-'}
                        </td>
                        <td style={{ ...tableCellStyle, fontSize: '13pt', color: '#dc2626' }}>
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
              <Section title="10. 직업 및 커리어 분석">
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
                <Section title="11. 인생 타임라인">
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
                          <p style={{ fontSize: '13pt', color: '#059669', fontWeight: 600 }}>기회</p>
                          <p style={{ fontSize: '13pt' }}>{phase.opportunities?.join(', ')}</p>
                        </div>
                        <div style={{ flex: 1 }}>
                          <p style={{ fontSize: '13pt', color: '#dc2626', fontWeight: 600 }}>도전</p>
                          <p style={{ fontSize: '13pt' }}>{phase.challenges?.join(', ')}</p>
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
              AI-PLANX Premium Service
            </p>
            <p style={{ fontSize: '12pt', marginTop: '6px', color: '#a5b4fc' }}>
              Your Fortune, Your Choice
            </p>
          </div>
        </div>

        {/* ====== 공유 & 추천 페이지 ====== */}
        <div style={{ pageBreakBefore: 'always', textAlign: 'center', paddingTop: '50px' }}>
          <h2 style={{ fontSize: '18pt', marginBottom: '16px', color: '#6366f1' }}>
            소중한 분과 함께하세요
          </h2>
          <p style={{ fontSize: '13pt', color: '#6b7280', marginBottom: '40px', lineHeight: 1.7 }}>
            이 분석이 도움이 되셨다면,<br />
            가족과 친구에게도 운명의 지혜를 선물해 보세요.
          </p>

          {/* QR 코드 영역 */}
          <div style={{
            width: '160px',
            height: '160px',
            margin: '0 auto 20px',
            border: '2px solid #e5e7eb',
            borderRadius: '12px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            backgroundColor: '#ffffff',
            overflow: 'hidden'
          }}>
            {qrCodeDataUrl ? (
              <img
                src={qrCodeDataUrl}
                alt="추천 링크 QR 코드"
                style={{ width: '140px', height: '140px' }}
              />
            ) : (
              <div style={{
                width: '140px',
                height: '140px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                backgroundColor: '#f3f4f6',
                color: '#6366f1',
                fontSize: '12pt'
              }}>
                QR 생성 중...
              </div>
            )}
          </div>

          <p style={{ fontSize: '13pt', fontWeight: 700, color: '#4f46e5', marginBottom: '8px' }}>
            AI-PLANX.COM
          </p>
          <p style={{ fontSize: '12pt', color: '#9ca3af', marginBottom: '40px' }}>
            QR코드를 스캔하여 바로 접속하세요
          </p>

          {/* 추천 혜택 안내 */}
          <InfoBox type="highlight" style={{ maxWidth: '420px', margin: '0 auto', textAlign: 'center' }}>
            <p style={{ fontSize: '12pt', fontWeight: 700, color: '#6366f1', marginBottom: '12px' }}>
              친구 추천 할인 혜택
            </p>
            <p style={{ fontSize: '12pt', color: '#4b5563', lineHeight: 1.8, marginBottom: '16px' }}>
              추천 링크로 친구가 가입하면<br />
              나에게 <strong style={{ color: '#6366f1' }}>3,000원 할인 쿠폰</strong> 지급!<br />
              친구에게도 <strong style={{ color: '#6366f1' }}>2,000원 할인 쿠폰</strong>을 드려요.
            </p>
            <p style={{ fontSize: '11pt', color: '#6b7280', marginBottom: '16px' }}>
              * 쿠폰은 모든 유료 분석 패키지 결제 시 사용 가능합니다.
            </p>
            <div style={{
              backgroundColor: '#f0f0ff',
              padding: '12px 20px',
              borderRadius: '8px',
              display: 'inline-block'
            }}>
              <p style={{ fontSize: '13pt', color: '#6b7280', marginBottom: '4px' }}>
                내 추천 코드
              </p>
              <p style={{ fontSize: '14pt', fontWeight: 700, color: '#4f46e5', letterSpacing: '2px' }}>
                {referralCode}
              </p>
            </div>
          </InfoBox>

          {/* 하단 안내 */}
          <div style={{ marginTop: '50px', color: '#9ca3af', fontSize: '13pt', lineHeight: 1.6 }}>
            <p>AI-PLANX — 수천 년 동양 철학의 지혜를 현대 기술로 재해석합니다.</p>
            <p style={{ marginTop: '4px' }}>당신만을 위한 깊이 있는 분석, 다른 어디에서도 경험할 수 없는 정밀함.</p>
            <p style={{ marginTop: '4px' }}>당신의 운명, 당신의 선택.</p>
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
  padding: '10px 10px',
  textAlign: 'left',
  fontWeight: 700,
  fontSize: '12pt',
  borderBottom: '2px solid #e5e7eb',
  color: '#374151',
  backgroundColor: '#f8fafc'
};

const tableCellStyle: React.CSSProperties = {
  padding: '10px 10px',
  borderBottom: '1px solid #e5e7eb',
  fontSize: '12pt',
  verticalAlign: 'middle'
};

// ============ 컴포넌트들 ============

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div style={{ marginBottom: '20px' }}>
      <h2 style={{
        fontSize: '18pt',
        fontWeight: 700,
        color: '#1f2937',
        marginBottom: '16px',
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
    <div style={{ marginBottom: '16px' }}>
      <h3 style={{
        fontSize: '15pt',
        fontWeight: 700,
        color: '#374151',
        marginBottom: '12px',
        paddingLeft: '14px',
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
      padding: '14px 16px',
      borderRadius: '12px',
      background: bgColors[type],
      border: `1px solid ${borderColors[type]}`,
      fontSize: '13pt',
      lineHeight: 1.7,
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
      padding: '12px 8px',
      borderRadius: '10px',
      background: getScoreBg(score),
      border: '1px solid #e2e8f0'
    }}>
      <div style={{ fontSize: '20pt', marginBottom: '4px' }}>{icon}</div>
      <div style={{ fontSize: '12pt', color: '#6b7280', marginBottom: '4px', fontWeight: 600 }}>{label}</div>
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
