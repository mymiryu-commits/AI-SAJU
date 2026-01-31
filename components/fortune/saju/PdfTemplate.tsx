'use client';

/**
 * 사주 분석 결과 PDF 템플릿
 *
 * HTML 기반 PDF 생성을 위한 템플릿 컴포넌트
 * 프리미엄급 고급스러운 디자인 적용
 * 전통 사주 이론 (십신, 신살, 12운성, 합충형파해) 통합
 */

import { forwardRef, useState, useEffect, useMemo } from 'react';
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

// 정통사주 분석 모듈 import
import { analyzeSipsin, interpretSipsinChart, SIPSIN_INFO, type SipsinType } from '@/lib/fortune/saju/analysis/sipsin';
import { analyzeSinsal } from '@/lib/fortune/saju/analysis/sinsal';
import { analyzeUnsung } from '@/lib/fortune/saju/analysis/unsung';
import { analyzeHapChung, transformToConsumerFriendlyRisk } from '@/lib/fortune/saju/analysis/hapchung';
import { calculateDaeun, HEAVENLY_STEMS, HEAVENLY_STEMS_KO, EARTHLY_BRANCHES, EARTHLY_BRANCHES_KO } from '@/lib/fortune/saju/calculator';

// 운명 카드 시스템
import { generateCardDeck, generateCardDeckSummary, getCardDescription } from '@/lib/fortune/saju/cards';

// 심리 기반 스토리텔링 시스템
import {
  generatePsychologicalStory,
  getLifecycleData,
  getArchetypeByDayMaster,
  getAgeSpecificAdvice,
  type FourActStructure
} from '@/lib/fortune/saju/psychology';

// 천간/지지 한글 변환 헬퍼
const getStemKo = (stem: string): string => {
  const idx = HEAVENLY_STEMS.indexOf(stem);
  return idx >= 0 ? HEAVENLY_STEMS_KO[idx] : stem;
};
const getBranchKo = (branch: string): string => {
  const idx = EARTHLY_BRANCHES.indexOf(branch);
  return idx >= 0 ? EARTHLY_BRANCHES_KO[idx] : branch;
};

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

// ============ 정통사주 스토리텔링 데이터 ============

// 십신 스토리텔링 (사용자 친화적 해석)
const SIPSIN_STORYTELLING: Record<SipsinType, {
  icon: string;
  title: string;
  metaphor: string;
  story: string;
  strength: string;
  bestFit: string;
}> = {
  bijeon: {
    icon: '🤝',
    title: '동료의 에너지',
    metaphor: '대나무',
    story: '당신 안에는 대나무처럼 곧게 뻗어가는 독립심이 있습니다. 남에게 기대지 않고 스스로 일어서는 힘, 그것이 당신의 핵심 에너지입니다.',
    strength: '독립심, 자존심, 경쟁력, 개척정신',
    bestFit: '창업, 프리랜서, 1인 기업, 자영업'
  },
  geopjae: {
    icon: '🔥',
    title: '도전의 에너지',
    metaphor: '덩굴나무',
    story: '당신 안에는 덩굴처럼 끊임없이 뻗어가는 확장의 에너지가 있습니다. 새로운 영역을 개척하고 도전하는 것이 당신의 본능입니다.',
    strength: '추진력, 승부욕, 도전정신, 확장력',
    bestFit: '영업, 투자, 스포츠, 스타트업'
  },
  siksin: {
    icon: '🎨',
    title: '표현의 에너지',
    metaphor: '과일나무',
    story: '당신 안에는 풍성한 열매를 맺는 과일나무가 있습니다. 창작하고, 표현하고, 나누는 것에서 가장 큰 기쁨을 느낍니다.',
    strength: '창의력, 표현력, 낙관성, 베푸는 마음',
    bestFit: '예술, 요리, 교육, 콘텐츠 제작'
  },
  sanggwan: {
    icon: '💡',
    title: '혁신의 에너지',
    metaphor: '버드나무',
    story: '당신 안에는 유연하게 흔들리는 버드나무가 있습니다. 틀을 깨고 새롭게 창조하는 것, 기존의 것을 비판하고 개선하는 것이 당신의 재능입니다.',
    strength: '창의성, 비판력, 언변, 독창성',
    bestFit: '비평가, 예술가, 변호사, 컨설턴트'
  },
  jeongjae: {
    icon: '🏦',
    title: '안정의 에너지',
    metaphor: '은행나무',
    story: '당신 안에는 오래 사는 은행나무가 있습니다. 착실하게 쌓아가고, 절약하고, 지키는 것이 당신의 강점입니다.',
    strength: '성실함, 절약, 현실감각, 책임감',
    bestFit: '회계, 금융, 공무원, 관리직'
  },
  pyeonjae: {
    icon: '💰',
    title: '기회의 에너지',
    metaphor: '밤나무',
    story: '당신 안에는 풍성한 열매의 밤나무가 있습니다. 기회를 포착하고, 투자하고, 재물을 불리는 것이 당신의 본능적 재능입니다.',
    strength: '기회 포착, 사교성, 융통성, 투자 감각',
    bestFit: '사업, 투자, 마케팅, 무역'
  },
  jeonggwan: {
    icon: '⚖️',
    title: '질서의 에너지',
    metaphor: '향나무',
    story: '당신 안에는 향기로운 향나무가 있습니다. 질서를 세우고, 규칙을 지키며, 사람들을 바른 길로 인도하는 것이 당신의 사명입니다.',
    strength: '책임감, 신뢰성, 리더십, 정의감',
    bestFit: '공직, 법률, 교육, 관리자'
  },
  pyeongwan: {
    icon: '⚔️',
    title: '권위의 에너지',
    metaphor: '참나무',
    story: '당신 안에는 강인한 참나무가 있습니다. 리더십과 추진력으로 세상을 이끄는 것, 어려운 상황에서도 굴하지 않는 것이 당신의 힘입니다.',
    strength: '결단력, 추진력, 위기 대응력, 카리스마',
    bestFit: '군인, 경찰, 경영자, 정치인'
  },
  jeongin: {
    icon: '📚',
    title: '지혜의 에너지',
    metaphor: '느티나무',
    story: '당신 안에는 포근한 느티나무가 있습니다. 배우고, 가르치며, 지식을 나누는 것이 당신의 천성입니다.',
    strength: '학습력, 이해력, 배려심, 인내심',
    bestFit: '학자, 교사, 연구원, 상담사'
  },
  pyeonin: {
    icon: '🔮',
    title: '통찰의 에너지',
    metaphor: '소나무',
    story: '당신 안에는 지혜로운 소나무가 있습니다. 깊이 사고하고 통찰하는 것, 남들이 보지 못하는 것을 꿰뚫어보는 것이 당신의 재능입니다.',
    strength: '직관력, 창의성, 독창성, 깊은 사고',
    bestFit: '연구, 기획, 전략, 철학'
  }
};

// 신살 실용적 해석
const SINSAL_FRIENDLY: Record<string, {
  icon: string;
  title: string;
  meaning: string;
  activation: string;
}> = {
  cheoneuigwiin: { icon: '⭐', title: '귀인의 별', meaning: '위기 때 도와주는 사람이 나타납니다', activation: '어려울 때 주변에 도움을 요청하세요' },
  munchanggwisin: { icon: '📖', title: '학문의 별', meaning: '학업과 자격증 운이 강합니다', activation: '공부나 자격증 취득에 도전하세요' },
  taegeuggwisin: { icon: '☯️', title: '태극의 별', meaning: '큰 복과 행운이 따릅니다', activation: '중요한 결정에 자신감을 가지세요' },
  yeokmasal: { icon: '🐎', title: '이동의 별', meaning: '여행, 이사, 이직 운이 강합니다', activation: '새로운 환경에서 기회를 찾으세요' },
  dohwasal: { icon: '🌸', title: '매력의 별', meaning: '이성에게 인기가 많습니다', activation: '외모와 매력 관리에 투자하세요' },
  hwagaesal: { icon: '🎭', title: '예술의 별', meaning: '예술적 감각이 뛰어납니다', activation: '창작 활동이나 취미를 살리세요' }
};

// 12운성 에너지 설명
const UNSUNG_SIMPLE: Record<string, {
  emoji: string;
  level: string;
  meaning: string;
}> = {
  jangseong: { emoji: '🌱', level: '시작', meaning: '새로운 시작의 에너지, 성장의 잠재력' },
  mokyok: { emoji: '🚿', level: '정화', meaning: '정리하고 깨끗이 하는 시기' },
  gwandae: { emoji: '👔', level: '성인', meaning: '책임감 있는 성인으로서의 당당함' },
  geonnok: { emoji: '💼', level: '안정', meaning: '직장이나 일에서의 안정된 성취' },
  jewang: { emoji: '👑', level: '전성기', meaning: '최고의 에너지, 큰 결정에 유리' },
  soe: { emoji: '🍂', level: '쇠퇴', meaning: '에너지 감소, 무리하지 말 것' },
  byeong: { emoji: '🤒', level: '휴식', meaning: '건강 관리와 휴식이 필요' },
  sa: { emoji: '🌙', level: '정지', meaning: '활동을 줄이고 내면을 돌아볼 때' },
  myo: { emoji: '⚰️', level: '저장', meaning: '에너지를 모으고 저축하는 시기' },
  jeol: { emoji: '💨', level: '끊음', meaning: '과거와 단절, 새로운 시작 준비' },
  tae: { emoji: '🤰', level: '잉태', meaning: '새로운 계획이 싹트는 시기' },
  yang: { emoji: '👶', level: '양육', meaning: '아이디어를 키우고 준비하는 시기' }
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

    // ============ 정통사주 분석 계산 ============
    // 현재 나이 계산
    const currentAge = useMemo(() => {
      const birthYear = new Date(user.birthDate).getFullYear();
      const currentYear = new Date().getFullYear();
      return currentYear - birthYear + 1; // 한국 나이
    }, [user.birthDate]);

    const traditionalAnalysis = useMemo(() => {
      try {
        const sipsinChart = analyzeSipsin(saju);
        const sipsinInterp = interpretSipsinChart(sipsinChart);
        const sinsalAnalysis = analyzeSinsal(saju);
        const unsungAnalysis = analyzeUnsung(saju);
        const hapchungAnalysis = analyzeHapChung(saju);
        const consumerRisks = transformToConsumerFriendlyRisk(hapchungAnalysis);

        // 대운 계산
        const daeunList = calculateDaeun(saju, user.gender, user.birthDate);

        // 현재 대운 찾기
        const currentDaeun = daeunList.find((d, idx) => {
          const nextAge = daeunList[idx + 1]?.age ?? Infinity;
          return currentAge >= d.age && currentAge < nextAge;
        }) || daeunList[0];

        // 현재 대운 인덱스
        const currentDaeunIndex = daeunList.findIndex(d => d === currentDaeun);

        // 용신을 한글로 변환 (카드 덱 생성용)
        const yongsinKorean = yongsin.map((el: Element) => {
          const map: Record<Element, string> = { wood: '목', fire: '화', earth: '토', metal: '금', water: '수' };
          return map[el] || '목';
        });

        // 우세 십신 (카드 덱 생성용)
        const dominantSipsin = sipsinInterp.dominant[0] || 'siksin';
        const sipsinKoreanMap: Record<SipsinType, string> = {
          bijeon: '비견', geopjae: '겁재', siksin: '식신', sanggwan: '상관',
          pyeonjae: '편재', jeongjae: '정재', pyeongwan: '편관', jeonggwan: '정관',
          pyeonin: '편인', jeongin: '정인'
        };

        // 운명 카드 덱 생성
        const cardDeck = generateCardDeck(
          user,
          saju,
          oheng,
          yongsinKorean,
          sipsinKoreanMap[dominantSipsin] || '식신',
          targetYear
        );

        return {
          sipsin: { chart: sipsinChart, interp: sipsinInterp },
          sinsal: sinsalAnalysis,
          unsung: unsungAnalysis,
          hapchung: { analysis: hapchungAnalysis, risks: consumerRisks },
          daeun: {
            list: daeunList,
            current: currentDaeun,
            currentIndex: currentDaeunIndex
          },
          cardDeck,
          psychologyStory: generatePsychologicalStory({
            userName: user.name,
            dayMaster: saju.day.heavenlyStem,
            dayMasterKo: saju.day.stemKorean,
            age: currentAge,
            gender: user.gender,
            birthYear: new Date(user.birthDate).getFullYear(),
            yongsin: yongsin,
            currentDaeunElement: currentDaeun?.element,
            targetYear
          }),
          lifecycleData: getLifecycleData(currentAge),
          archetype: getArchetypeByDayMaster(saju.day.stemKorean)
        };
      } catch (e) {
        console.error('Traditional analysis failed:', e);
        return null;
      }
    }, [saju, user, oheng, yongsin, user.gender, user.birthDate, currentAge, targetYear]);

    // 십신 한글 변환 헬퍼
    const sipsinToKorean = (type: SipsinType): string => SIPSIN_INFO[type]?.korean || type;

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

        {/* ============ 심리 기반 스토리텔링 섹션 ============ */}
        {traditionalAnalysis?.psychologyStory && (
          <Section title={`${user.name}님만을 위한 이야기`}>
            {/* 4막 구조 스토리 */}

            {/* 1막: 프롤로그 - 신뢰 구축 */}
            <div style={{
              marginBottom: '24px',
              padding: '20px 24px',
              backgroundColor: '#fefce8',
              borderRadius: '12px',
              borderLeft: '4px solid #eab308'
            }}>
              <p style={{
                fontSize: '10pt',
                color: '#a16207',
                fontWeight: 600,
                marginBottom: '8px',
                textTransform: 'uppercase',
                letterSpacing: '1px'
              }}>
                PROLOGUE
              </p>
              <p style={{
                fontSize: '13pt',
                color: '#1f2937',
                lineHeight: 1.8,
                fontWeight: 400
              }}>
                {traditionalAnalysis.psychologyStory.act1_prologue.content}
              </p>
            </div>

            {/* 2막: 공감과 위로 */}
            <div style={{
              marginBottom: '24px',
              padding: '20px 24px',
              backgroundColor: '#fdf2f8',
              borderRadius: '12px',
              borderLeft: '4px solid #ec4899'
            }}>
              <p style={{
                fontSize: '10pt',
                color: '#9d174d',
                fontWeight: 600,
                marginBottom: '8px'
              }}>
                당신의 마음을 압니다
              </p>
              <p style={{
                fontSize: '13pt',
                color: '#1f2937',
                lineHeight: 1.8
              }}>
                {traditionalAnalysis.psychologyStory.act2_empathy.content}
              </p>
            </div>

            {/* 3막: 희망과 전환 (클라이맥스) */}
            <div style={{
              marginBottom: '24px',
              padding: '24px',
              background: 'linear-gradient(135deg, #ecfdf5 0%, #d1fae5 100%)',
              borderRadius: '12px',
              border: '2px solid #10b981'
            }}>
              <p style={{
                fontSize: '10pt',
                color: '#047857',
                fontWeight: 700,
                marginBottom: '12px'
              }}>
                희망의 빛
              </p>
              <p style={{
                fontSize: '14pt',
                color: '#064e3b',
                lineHeight: 1.8,
                fontWeight: 500
              }}>
                {traditionalAnalysis.psychologyStory.act3_hope.content}
              </p>
            </div>

            {/* 4막: 에필로그 - 여운 */}
            <div style={{
              marginBottom: '24px',
              padding: '20px 24px',
              backgroundColor: '#f5f3ff',
              borderRadius: '12px',
              borderLeft: '4px solid #8b5cf6'
            }}>
              <p style={{
                fontSize: '10pt',
                color: '#6d28d9',
                fontWeight: 600,
                marginBottom: '8px'
              }}>
                기억해 주세요
              </p>
              <p style={{
                fontSize: '13pt',
                color: '#1f2937',
                lineHeight: 1.8
              }}>
                {traditionalAnalysis.psychologyStory.act4_epilogue.content}
              </p>
            </div>

            {/* 운명 한 줄 */}
            <div style={{
              marginTop: '32px',
              padding: '24px',
              background: 'linear-gradient(135deg, #1e293b 0%, #334155 100%)',
              borderRadius: '16px',
              textAlign: 'center'
            }}>
              <p style={{
                fontSize: '10pt',
                color: '#94a3b8',
                marginBottom: '12px',
                letterSpacing: '2px'
              }}>
                나의 운명 한 줄
              </p>
              <p style={{
                fontSize: '16pt',
                color: '#ffffff',
                fontWeight: 700,
                lineHeight: 1.6
              }}>
                {traditionalAnalysis.psychologyStory.destinyLine}
              </p>
            </div>

            {/* 연령대별 핵심 조언 */}
            {traditionalAnalysis.lifecycleData && (
              <div style={{ marginTop: '24px' }}>
                <SubSection title={`${traditionalAnalysis.lifecycleData.ageRange} 시기, 알아두세요`}>
                  <div style={{
                    display: 'grid',
                    gridTemplateColumns: '1fr 1fr',
                    gap: '16px'
                  }}>
                    {/* 지금 가장 중요한 것 */}
                    <div style={{
                      padding: '16px',
                      backgroundColor: '#f0fdf4',
                      borderRadius: '10px',
                      border: '1px solid #bbf7d0'
                    }}>
                      <p style={{
                        fontSize: '10pt',
                        color: '#15803d',
                        fontWeight: 600,
                        marginBottom: '8px'
                      }}>
                        지금 가장 중요한 것
                      </p>
                      <p style={{ fontSize: '12pt', color: '#1f2937', lineHeight: 1.6 }}>
                        {traditionalAnalysis.lifecycleData.insights.practicalAdvice}
                      </p>
                    </div>

                    {/* 피해야 할 것 */}
                    <div style={{
                      padding: '16px',
                      backgroundColor: '#fef2f2',
                      borderRadius: '10px',
                      border: '1px solid #fecaca'
                    }}>
                      <p style={{
                        fontSize: '10pt',
                        color: '#b91c1c',
                        fontWeight: 600,
                        marginBottom: '8px'
                      }}>
                        피해야 할 것
                      </p>
                      <p style={{ fontSize: '12pt', color: '#1f2937', lineHeight: 1.6 }}>
                        {traditionalAnalysis.lifecycleData.insights.avoidance}
                      </p>
                    </div>
                  </div>

                  {/* 희망 메시지 */}
                  <div style={{
                    marginTop: '16px',
                    padding: '16px',
                    backgroundColor: '#faf5ff',
                    borderRadius: '10px',
                    border: '1px solid #e9d5ff'
                  }}>
                    <p style={{
                      fontSize: '10pt',
                      color: '#7e22ce',
                      fontWeight: 600,
                      marginBottom: '8px'
                    }}>
                      희망의 메시지
                    </p>
                    <p style={{ fontSize: '12pt', color: '#1f2937', lineHeight: 1.6 }}>
                      {traditionalAnalysis.lifecycleData.hopeMessages.shortTerm}
                    </p>
                  </div>

                  {/* 명언/글귀 */}
                  <div style={{
                    marginTop: '16px',
                    padding: '20px',
                    backgroundColor: '#f8fafc',
                    borderRadius: '10px',
                    borderLeft: '3px solid #6366f1'
                  }}>
                    <p style={{
                      fontSize: '12pt',
                      color: '#4f46e5',
                      fontStyle: 'italic',
                      lineHeight: 1.7
                    }}>
                      "{traditionalAnalysis.lifecycleData.wisdomQuotes.original}"
                    </p>
                  </div>
                </SubSection>
              </div>
            )}
          </Section>
        )}

        {/* 페이지 나누기 */}
        <div style={{ pageBreakAfter: 'always' }} />

        {/* ============ 정통사주 심층 해석 섹션 ============ */}
        {traditionalAnalysis && (
          <>
            <Section title="정통사주 심층 해석">
              <p style={{
                color: '#6b7280',
                marginBottom: '20px',
                fontSize: '12pt',
                lineHeight: 1.7,
                padding: '12px 16px',
                backgroundColor: '#f8fafc',
                borderRadius: '8px',
                borderLeft: '4px solid #6366f1'
              }}>
                사주팔자는 수천 년 동양 철학의 지혜입니다. 아래 분석은 당신의 사주에 담긴
                <strong> 십신(관계 에너지)</strong>, <strong>신살(특별한 별)</strong>,
                <strong> 12운성(생애 에너지)</strong>, <strong>합충형파해(관계 조화)</strong>를
                현대적 관점에서 해석한 것입니다.
              </p>

              {/* 십신 분석 */}
              <SubSection title="나의 관계 에너지 (십신 분석)">
                <p style={{ color: '#6b7280', marginBottom: '12px', fontSize: '11pt' }}>
                  십신은 일간(나)을 기준으로 사주의 다른 기운들과의 관계를 나타냅니다.
                  당신에게 가장 강한 에너지와 그 의미를 알려드립니다.
                </p>

                {/* 우세 십신 카드 */}
                {traditionalAnalysis.sipsin.interp.dominant.length > 0 && (
                  <div style={{ marginBottom: '16px' }}>
                    {traditionalAnalysis.sipsin.interp.dominant.slice(0, 2).map((type) => {
                      const story = SIPSIN_STORYTELLING[type];
                      const info = SIPSIN_INFO[type];
                      return (
                        <InfoBox key={type} type="highlight" style={{ marginBottom: '12px' }}>
                          <div style={{ display: 'flex', alignItems: 'flex-start', gap: '12px' }}>
                            <span style={{ fontSize: '28pt' }}>{story?.icon || '🔮'}</span>
                            <div style={{ flex: 1 }}>
                              <h4 style={{ fontWeight: 700, color: '#6366f1', marginBottom: '6px', fontSize: '14pt' }}>
                                {info?.korean}({info?.hanja}) - {story?.title || '에너지'}
                              </h4>
                              <p style={{ lineHeight: 1.7, marginBottom: '8px', fontSize: '12pt' }}>
                                {story?.story || info?.personality}
                              </p>
                              <div style={{ display: 'flex', gap: '16px', flexWrap: 'wrap', fontSize: '11pt' }}>
                                <span><strong style={{ color: '#059669' }}>강점:</strong> {story?.strength || info?.strength}</span>
                                <span><strong style={{ color: '#2563eb' }}>적합 분야:</strong> {story?.bestFit || info?.career?.join(', ')}</span>
                              </div>
                            </div>
                          </div>
                        </InfoBox>
                      );
                    })}
                  </div>
                )}

                {/* 십신 분포 요약 */}
                <InfoBox type="default">
                  <p style={{ marginBottom: '6px' }}>
                    <strong>십신 균형:</strong> {traditionalAnalysis.sipsin.interp.balance}
                  </p>
                  <p style={{ marginBottom: '6px' }}>
                    <strong>성격 특성:</strong> {traditionalAnalysis.sipsin.interp.personality}
                  </p>
                  <p>
                    <strong>직업 적성:</strong> {traditionalAnalysis.sipsin.interp.career}
                  </p>
                </InfoBox>
              </SubSection>

              {/* 신살 분석 */}
              <SubSection title="나를 돕는 특별한 별 (신살 분석)">
                <p style={{ color: '#6b7280', marginBottom: '12px', fontSize: '11pt' }}>
                  신살은 사주에 작용하는 특별한 기운입니다. 길신(복), 특수살(재능), 흉살(주의)로 나뉩니다.
                </p>

                <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap' }}>
                  {/* 길신 */}
                  {traditionalAnalysis.sinsal.gilsin.filter(s => s.present).length > 0 && (
                    <InfoBox type="success" style={{ flex: 1, minWidth: '200px' }}>
                      <h4 style={{ color: '#059669', fontWeight: 700, marginBottom: '10px', fontSize: '13pt' }}>
                        길신 - 행운을 가져다주는 별
                      </h4>
                      {traditionalAnalysis.sinsal.gilsin.filter(s => s.present).slice(0, 3).map(s => {
                        const friendly = SINSAL_FRIENDLY[s.type];
                        return (
                          <div key={s.type} style={{ marginBottom: '8px', fontSize: '12pt' }}>
                            <p style={{ fontWeight: 600 }}>
                              {friendly?.icon || '⭐'} {s.info.korean}({s.info.hanja})
                              {s.location && <span style={{ color: '#6b7280', fontSize: '10pt' }}> [{s.location}]</span>}
                            </p>
                            <p style={{ color: '#374151', fontSize: '11pt' }}>
                              {friendly?.meaning || s.info.description}
                            </p>
                          </div>
                        );
                      })}
                    </InfoBox>
                  )}

                  {/* 특수살 */}
                  {traditionalAnalysis.sinsal.teuksuSal.filter(s => s.present).length > 0 && (
                    <InfoBox type="info" style={{ flex: 1, minWidth: '200px' }}>
                      <h4 style={{ color: '#2563eb', fontWeight: 700, marginBottom: '10px', fontSize: '13pt' }}>
                        특수살 - 특별한 재능의 별
                      </h4>
                      {traditionalAnalysis.sinsal.teuksuSal.filter(s => s.present).slice(0, 3).map(s => {
                        const friendly = SINSAL_FRIENDLY[s.type];
                        return (
                          <div key={s.type} style={{ marginBottom: '8px', fontSize: '12pt' }}>
                            <p style={{ fontWeight: 600 }}>
                              {friendly?.icon || '✨'} {s.info.korean}({s.info.hanja})
                            </p>
                            <p style={{ color: '#374151', fontSize: '11pt' }}>
                              {friendly?.meaning || s.info.description}
                            </p>
                          </div>
                        );
                      })}
                    </InfoBox>
                  )}
                </div>

                {/* 흉살 (있을 경우만) */}
                {traditionalAnalysis.sinsal.hyungsal.filter(s => s.present).length > 0 && (
                  <InfoBox type="warning" style={{ marginTop: '12px' }}>
                    <h4 style={{ color: '#dc2626', fontWeight: 700, marginBottom: '10px', fontSize: '13pt' }}>
                      주의할 기운
                    </h4>
                    {traditionalAnalysis.sinsal.hyungsal.filter(s => s.present).slice(0, 2).map(s => (
                      <div key={s.type} style={{ marginBottom: '8px', fontSize: '12pt' }}>
                        <p style={{ fontWeight: 600 }}>△ {s.info.korean}({s.info.hanja})</p>
                        <p style={{ color: '#374151', fontSize: '11pt' }}>{s.info.effect}</p>
                        {s.info.remedy && (
                          <p style={{ color: '#059669', fontSize: '11pt' }}>→ 해소법: {s.info.remedy}</p>
                        )}
                      </div>
                    ))}
                  </InfoBox>
                )}

                <p style={{ marginTop: '12px', fontSize: '11pt', color: '#6b7280', fontStyle: 'italic' }}>
                  {traditionalAnalysis.sinsal.summary}
                </p>
              </SubSection>
            </Section>

            {/* 페이지 나누기 */}
            <div style={{ pageBreakAfter: 'always' }} />

            <Section title="생애 에너지와 관계 조화">
              {/* 12운성 분석 */}
              <SubSection title="현재 생애 에너지 (12운성)">
                <p style={{ color: '#6b7280', marginBottom: '12px', fontSize: '11pt' }}>
                  12운성은 인생의 에너지 주기를 나타냅니다. 지금 당신의 에너지 상태를 확인하세요.
                </p>

                {/* 에너지 바 시각화 */}
                <div style={{ marginBottom: '16px' }}>
                  {traditionalAnalysis.unsung.positions.map((pos) => {
                    const energyPercent = (pos.info.energyLevel / 10) * 100;
                    const simple = UNSUNG_SIMPLE[pos.unsung];
                    return (
                      <div key={pos.pillar} style={{
                        display: 'flex',
                        alignItems: 'center',
                        marginBottom: '8px',
                        fontSize: '12pt'
                      }}>
                        <span style={{ width: '60px', fontWeight: 600 }}>{pos.pillar}</span>
                        <span style={{ width: '30px' }}>{simple?.emoji || '○'}</span>
                        <span style={{ width: '50px', color: '#6366f1', fontWeight: 600 }}>
                          {pos.info.korean}
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
                            width: `${energyPercent}%`,
                            height: '100%',
                            backgroundColor: energyPercent >= 70 ? '#22c55e' : energyPercent >= 40 ? '#eab308' : '#ef4444',
                            borderRadius: '10px'
                          }} />
                        </div>
                        <span style={{ width: '60px', textAlign: 'right' }}>
                          {pos.info.energyLevel}/10
                        </span>
                      </div>
                    );
                  })}
                </div>

                {/* 현재 에너지 상태 요약 */}
                <InfoBox type="highlight">
                  <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                    <span style={{ fontSize: '32pt' }}>
                      {UNSUNG_SIMPLE[traditionalAnalysis.unsung.peakPosition.unsung]?.emoji || '⭐'}
                    </span>
                    <div>
                      <h4 style={{ fontWeight: 700, color: '#6366f1', marginBottom: '4px' }}>
                        현재 에너지 상태: {traditionalAnalysis.unsung.dominantStage}
                      </h4>
                      <p style={{ fontSize: '12pt', marginBottom: '4px' }}>
                        평균 에너지: <strong>{traditionalAnalysis.unsung.averageEnergy.toFixed(1)}</strong>/10점
                      </p>
                      <p style={{ fontSize: '12pt' }}>
                        최고 에너지 위치: <strong>{traditionalAnalysis.unsung.peakPosition.pillar}</strong>
                        ({traditionalAnalysis.unsung.peakPosition.info.korean}) - {traditionalAnalysis.unsung.peakPosition.info.description}
                      </p>
                    </div>
                  </div>
                </InfoBox>
              </SubSection>

              {/* 합충형파해 분석 */}
              <SubSection title="관계와 타이밍의 조화 (합충형파해)">
                <p style={{ color: '#6b7280', marginBottom: '12px', fontSize: '11pt' }}>
                  사주 내 지지(地支)들의 관계를 분석합니다. 합(合)은 조화, 충(沖)은 충돌을 의미합니다.
                </p>

                {/* 조화 점수 */}
                <div style={{
                  display: 'flex',
                  alignItems: 'center',
                  marginBottom: '16px',
                  padding: '12px 16px',
                  backgroundColor: '#f8fafc',
                  borderRadius: '8px'
                }}>
                  <span style={{ fontWeight: 700, marginRight: '12px' }}>관계 조화 점수:</span>
                  <div style={{
                    flex: 1,
                    height: '24px',
                    backgroundColor: '#e5e7eb',
                    borderRadius: '12px',
                    overflow: 'hidden',
                    marginRight: '12px'
                  }}>
                    <div style={{
                      width: `${traditionalAnalysis.hapchung.analysis.harmonyScore}%`,
                      height: '100%',
                      backgroundColor: traditionalAnalysis.hapchung.analysis.harmonyScore >= 70 ? '#22c55e' :
                                       traditionalAnalysis.hapchung.analysis.harmonyScore >= 40 ? '#eab308' : '#ef4444',
                      borderRadius: '12px'
                    }} />
                  </div>
                  <span style={{
                    fontWeight: 700,
                    fontSize: '16pt',
                    color: traditionalAnalysis.hapchung.analysis.harmonyScore >= 70 ? '#059669' :
                           traditionalAnalysis.hapchung.analysis.harmonyScore >= 40 ? '#d97706' : '#dc2626'
                  }}>
                    {traditionalAnalysis.hapchung.analysis.harmonyScore}점
                  </span>
                </div>

                {/* 조화 관계 (합) */}
                {traditionalAnalysis.hapchung.analysis.harmonies.length > 0 && (
                  <InfoBox type="success" style={{ marginBottom: '12px' }}>
                    <h4 style={{ color: '#059669', fontWeight: 700, marginBottom: '8px', fontSize: '13pt' }}>
                      조화로운 관계 (합)
                    </h4>
                    {traditionalAnalysis.hapchung.analysis.harmonies.slice(0, 3).map((rel, idx) => (
                      <p key={idx} style={{ fontSize: '12pt', marginBottom: '4px' }}>
                        • {rel.positions.join(' - ')}: {rel.effect}
                      </p>
                    ))}
                  </InfoBox>
                )}

                {/* 주의 관계 (충/형/파/해) */}
                {traditionalAnalysis.hapchung.analysis.conflicts.length > 0 && (
                  <InfoBox type="warning" style={{ marginBottom: '12px' }}>
                    <h4 style={{ color: '#dc2626', fontWeight: 700, marginBottom: '8px', fontSize: '13pt' }}>
                      주의할 관계
                    </h4>
                    {traditionalAnalysis.hapchung.analysis.conflicts.slice(0, 3).map((rel, idx) => (
                      <p key={idx} style={{ fontSize: '12pt', marginBottom: '4px' }}>
                        △ {rel.positions.join(' - ')}: {rel.type} - {rel.effect}
                      </p>
                    ))}
                  </InfoBox>
                )}

                {/* 실생활 조언 */}
                {traditionalAnalysis.hapchung.risks.length > 0 && (
                  <InfoBox type="info">
                    <h4 style={{ color: '#2563eb', fontWeight: 700, marginBottom: '8px', fontSize: '13pt' }}>
                      실생활 적용 가이드
                    </h4>
                    {traditionalAnalysis.hapchung.risks.slice(0, 3).map((risk, idx) => (
                      <div key={idx} style={{ marginBottom: '8px', fontSize: '12pt' }}>
                        <p style={{ fontWeight: 600, color: risk.isPositive ? '#059669' : '#d97706' }}>
                          {risk.isPositive ? '✓' : '△'} {risk.type}
                        </p>
                        <p style={{ color: '#374151', fontSize: '11pt' }}>{risk.actionTip}</p>
                      </div>
                    ))}
                  </InfoBox>
                )}

                <p style={{ marginTop: '12px', fontSize: '11pt', color: '#6b7280', fontStyle: 'italic' }}>
                  {traditionalAnalysis.hapchung.analysis.summary}
                </p>
              </SubSection>
            </Section>

            {/* ============ 대운 타임라인 섹션 ============ */}
            <Section title="10년 주기 인생 운세 (대운)">
              <p style={{
                color: '#6b7280',
                marginBottom: '20px',
                fontSize: '12pt',
                lineHeight: 1.7,
                padding: '12px 16px',
                backgroundColor: '#faf5ff',
                borderRadius: '8px',
                borderLeft: '4px solid #8b5cf6'
              }}>
                <strong>대운(大運)</strong>은 10년 단위로 바뀌는 큰 운의 흐름입니다.
                마치 계절처럼 인생에도 시기가 있으며, 각 대운마다 특별한 기운과 기회가 찾아옵니다.
              </p>

              {/* 현재 대운 하이라이트 */}
              {traditionalAnalysis.daeun.current && (
                <div style={{
                  backgroundColor: '#8b5cf6',
                  color: 'white',
                  padding: '20px 24px',
                  borderRadius: '12px',
                  marginBottom: '24px',
                  boxShadow: '0 4px 12px rgba(139, 92, 246, 0.3)'
                }}>
                  <div style={{ display: 'flex', alignItems: 'center', marginBottom: '12px' }}>
                    <span style={{ fontSize: '28pt', marginRight: '16px' }}>🌟</span>
                    <div>
                      <p style={{ fontSize: '11pt', opacity: 0.9, marginBottom: '4px' }}>현재 진행 중인 대운</p>
                      <p style={{ fontSize: '20pt', fontWeight: 700 }}>
                        {getStemKo(traditionalAnalysis.daeun.current.stem)}
                        {getBranchKo(traditionalAnalysis.daeun.current.branch)}운
                        ({traditionalAnalysis.daeun.current.age}세 ~)
                      </p>
                    </div>
                  </div>
                  <p style={{ fontSize: '12pt', lineHeight: 1.6, opacity: 0.95 }}>
                    {(() => {
                      const elem = traditionalAnalysis.daeun.current.element;
                      const elemName = ELEMENT_NAMES[elem];
                      const descriptions: Record<Element, string> = {
                        wood: '성장과 도전의 시기입니다. 새로운 시작, 학업, 자기계발에 좋습니다.',
                        fire: '열정과 표현의 시기입니다. 적극적인 활동, 사회 진출, 인맥 확장에 좋습니다.',
                        earth: '안정과 축적의 시기입니다. 기반 다지기, 저축, 부동산에 좋습니다.',
                        metal: '결실과 정리의 시기입니다. 성과 거두기, 전문성 완성에 좋습니다.',
                        water: '지혜와 준비의 시기입니다. 공부, 계획 수립, 내면 성장에 좋습니다.'
                      };
                      return `${elemName}(${elem === 'wood' ? '木' : elem === 'fire' ? '火' : elem === 'earth' ? '土' : elem === 'metal' ? '金' : '水'})의 기운이 흐르는 시기 - ${descriptions[elem]}`;
                    })()}
                  </p>
                </div>
              )}

              {/* 대운 타임라인 */}
              <SubSection title="나의 대운 여정">
                <div style={{
                  position: 'relative',
                  padding: '20px 0'
                }}>
                  {/* 타임라인 선 */}
                  <div style={{
                    position: 'absolute',
                    top: '45px',
                    left: '20px',
                    right: '20px',
                    height: '4px',
                    backgroundColor: '#e5e7eb',
                    borderRadius: '2px',
                    zIndex: 0
                  }} />

                  {/* 대운 아이템들 */}
                  <div style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    position: 'relative',
                    zIndex: 1
                  }}>
                    {traditionalAnalysis.daeun.list.slice(0, 8).map((daeun, idx) => {
                      const isCurrent = idx === traditionalAnalysis.daeun.currentIndex;
                      const isPast = idx < traditionalAnalysis.daeun.currentIndex;
                      const elemColor = ELEMENT_COLORS[daeun.element];

                      return (
                        <div
                          key={idx}
                          style={{
                            display: 'flex',
                            flexDirection: 'column',
                            alignItems: 'center',
                            width: '60px'
                          }}
                        >
                          {/* 나이 */}
                          <p style={{
                            fontSize: '9pt',
                            color: isCurrent ? '#8b5cf6' : '#9ca3af',
                            fontWeight: isCurrent ? 700 : 400,
                            marginBottom: '8px'
                          }}>
                            {daeun.age}세
                          </p>

                          {/* 원형 노드 */}
                          <div style={{
                            width: isCurrent ? '28px' : '20px',
                            height: isCurrent ? '28px' : '20px',
                            borderRadius: '50%',
                            backgroundColor: isCurrent ? '#8b5cf6' : isPast ? elemColor : '#e5e7eb',
                            border: isCurrent ? '4px solid rgba(139, 92, 246, 0.3)' : 'none',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            boxShadow: isCurrent ? '0 2px 8px rgba(139, 92, 246, 0.4)' : 'none'
                          }}>
                            {isCurrent && (
                              <span style={{ color: 'white', fontSize: '10pt' }}>★</span>
                            )}
                          </div>

                          {/* 대운 표시 */}
                          <div style={{
                            marginTop: '8px',
                            textAlign: 'center'
                          }}>
                            <p style={{
                              fontSize: isCurrent ? '11pt' : '10pt',
                              fontWeight: isCurrent ? 700 : 500,
                              color: isCurrent ? '#8b5cf6' : isPast ? '#374151' : '#9ca3af'
                            }}>
                              {getStemKo(daeun.stem)}
                              {getBranchKo(daeun.branch)}
                            </p>
                            <p style={{
                              fontSize: '8pt',
                              color: elemColor,
                              fontWeight: 600
                            }}>
                              {ELEMENT_NAMES[daeun.element]}
                            </p>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>

                {/* 대운 해석 카드들 */}
                <div style={{ marginTop: '24px' }}>
                  <p style={{
                    fontSize: '11pt',
                    color: '#6b7280',
                    marginBottom: '12px',
                    fontWeight: 600
                  }}>
                    주요 대운 시기 해석
                  </p>
                  <div style={{
                    display: 'grid',
                    gridTemplateColumns: 'repeat(2, 1fr)',
                    gap: '12px'
                  }}>
                    {traditionalAnalysis.daeun.list.slice(
                      Math.max(0, traditionalAnalysis.daeun.currentIndex - 1),
                      traditionalAnalysis.daeun.currentIndex + 3
                    ).map((daeun, idx) => {
                      const realIdx = Math.max(0, traditionalAnalysis.daeun.currentIndex - 1) + idx;
                      const isCurrent = realIdx === traditionalAnalysis.daeun.currentIndex;
                      const isPast = realIdx < traditionalAnalysis.daeun.currentIndex;
                      const elemColor = ELEMENT_COLORS[daeun.element];

                      const periodDescriptions: Record<Element, { theme: string; advice: string }> = {
                        wood: { theme: '성장 · 시작', advice: '새로운 도전을 두려워하지 마세요' },
                        fire: { theme: '열정 · 활동', advice: '적극적으로 나서면 빛을 발합니다' },
                        earth: { theme: '안정 · 기반', advice: '내실을 다지는 것이 중요합니다' },
                        metal: { theme: '결실 · 성취', advice: '그동안의 노력이 결실을 맺습니다' },
                        water: { theme: '지혜 · 준비', advice: '다음을 위한 충전의 시간입니다' }
                      };

                      return (
                        <div
                          key={idx}
                          style={{
                            padding: '14px 16px',
                            backgroundColor: isCurrent ? '#faf5ff' : '#f9fafb',
                            borderRadius: '10px',
                            border: isCurrent ? '2px solid #8b5cf6' : '1px solid #e5e7eb'
                          }}
                        >
                          <div style={{ display: 'flex', alignItems: 'center', marginBottom: '8px' }}>
                            <div style={{
                              width: '8px',
                              height: '8px',
                              borderRadius: '50%',
                              backgroundColor: elemColor,
                              marginRight: '8px'
                            }} />
                            <span style={{
                              fontSize: '12pt',
                              fontWeight: 700,
                              color: isCurrent ? '#8b5cf6' : '#374151'
                            }}>
                              {daeun.age}세 ~ {daeun.age + 9}세
                              {isCurrent && ' (현재)'}
                              {isPast && ' (지남)'}
                            </span>
                          </div>
                          <p style={{
                            fontSize: '13pt',
                            fontWeight: 600,
                            color: '#1f2937',
                            marginBottom: '4px'
                          }}>
                            {getStemKo(daeun.stem)}{getBranchKo(daeun.branch)}운 - {periodDescriptions[daeun.element].theme}
                          </p>
                          <p style={{
                            fontSize: '10pt',
                            color: '#6b7280'
                          }}>
                            {periodDescriptions[daeun.element].advice}
                          </p>
                        </div>
                      );
                    })}
                  </div>
                </div>
              </SubSection>
            </Section>

            {/* ============ 운명 카드 섹션 ============ */}
            {traditionalAnalysis.cardDeck && (
              <Section title="나의 운명 카드">
                <p style={{
                  color: '#6b7280',
                  marginBottom: '20px',
                  fontSize: '12pt',
                  lineHeight: 1.7,
                  padding: '12px 16px',
                  backgroundColor: '#fef3c7',
                  borderRadius: '8px',
                  borderLeft: '4px solid #f59e0b'
                }}>
                  당신의 사주를 상징하는 <strong>운명 카드</strong>입니다.
                  꽃, 동물, 나무, 보석으로 표현된 당신만의 운명 이야기를 확인하세요.
                </p>

                {/* 카드 그리드 */}
                <div style={{
                  display: 'grid',
                  gridTemplateColumns: 'repeat(2, 1fr)',
                  gap: '16px',
                  marginBottom: '24px'
                }}>
                  {/* 본질 카드 (꽃) */}
                  <div style={{
                    padding: '20px',
                    backgroundColor: '#fdf2f8',
                    borderRadius: '12px',
                    border: '2px solid #ec4899'
                  }}>
                    <div style={{ display: 'flex', alignItems: 'center', marginBottom: '12px' }}>
                      <span style={{ fontSize: '24pt', marginRight: '12px' }}>🌸</span>
                      <div>
                        <p style={{ fontSize: '10pt', color: '#9d174d', fontWeight: 600 }}>본질 카드</p>
                        <p style={{ fontSize: '14pt', fontWeight: 700, color: '#831843' }}>
                          {traditionalAnalysis.cardDeck.essence.flowerKorean}
                        </p>
                      </div>
                    </div>
                    <p style={{ fontSize: '11pt', color: '#6b7280', lineHeight: 1.6 }}>
                      {traditionalAnalysis.cardDeck.essence.story.slice(0, 80)}...
                    </p>
                    <div style={{ marginTop: '8px', display: 'flex', gap: '6px', flexWrap: 'wrap' }}>
                      {traditionalAnalysis.cardDeck.essence.keywords.map((kw, i) => (
                        <span key={i} style={{
                          fontSize: '9pt',
                          padding: '2px 8px',
                          backgroundColor: '#fbcfe8',
                          borderRadius: '10px',
                          color: '#9d174d'
                        }}>{kw}</span>
                      ))}
                    </div>
                  </div>

                  {/* 에너지 카드 (동물) */}
                  <div style={{
                    padding: '20px',
                    backgroundColor: '#ecfdf5',
                    borderRadius: '12px',
                    border: '2px solid #10b981'
                  }}>
                    <div style={{ display: 'flex', alignItems: 'center', marginBottom: '12px' }}>
                      <span style={{ fontSize: '24pt', marginRight: '12px' }}>🦋</span>
                      <div>
                        <p style={{ fontSize: '10pt', color: '#047857', fontWeight: 600 }}>에너지 카드</p>
                        <p style={{ fontSize: '14pt', fontWeight: 700, color: '#064e3b' }}>
                          {traditionalAnalysis.cardDeck.energy.animalKorean}
                        </p>
                      </div>
                    </div>
                    <p style={{ fontSize: '11pt', color: '#6b7280', lineHeight: 1.6 }}>
                      {traditionalAnalysis.cardDeck.energy.story.slice(0, 80)}...
                    </p>
                    <div style={{ marginTop: '8px', display: 'flex', gap: '6px', flexWrap: 'wrap' }}>
                      {traditionalAnalysis.cardDeck.energy.keywords.map((kw, i) => (
                        <span key={i} style={{
                          fontSize: '9pt',
                          padding: '2px 8px',
                          backgroundColor: '#a7f3d0',
                          borderRadius: '10px',
                          color: '#047857'
                        }}>{kw}</span>
                      ))}
                    </div>
                  </div>

                  {/* 재능 카드 (나무) */}
                  <div style={{
                    padding: '20px',
                    backgroundColor: '#fef9c3',
                    borderRadius: '12px',
                    border: '2px solid #eab308'
                  }}>
                    <div style={{ display: 'flex', alignItems: 'center', marginBottom: '12px' }}>
                      <span style={{ fontSize: '24pt', marginRight: '12px' }}>🌳</span>
                      <div>
                        <p style={{ fontSize: '10pt', color: '#a16207', fontWeight: 600 }}>재능 카드</p>
                        <p style={{ fontSize: '14pt', fontWeight: 700, color: '#713f12' }}>
                          {traditionalAnalysis.cardDeck.talent.treeKorean}
                        </p>
                      </div>
                    </div>
                    <p style={{ fontSize: '11pt', color: '#6b7280', lineHeight: 1.6 }}>
                      {traditionalAnalysis.cardDeck.talent.story.slice(0, 80)}...
                    </p>
                    <div style={{ marginTop: '8px', display: 'flex', gap: '6px', flexWrap: 'wrap' }}>
                      {traditionalAnalysis.cardDeck.talent.keywords.map((kw, i) => (
                        <span key={i} style={{
                          fontSize: '9pt',
                          padding: '2px 8px',
                          backgroundColor: '#fef08a',
                          borderRadius: '10px',
                          color: '#a16207'
                        }}>{kw}</span>
                      ))}
                    </div>
                  </div>

                  {/* 수호 카드 (보석) */}
                  <div style={{
                    padding: '20px',
                    backgroundColor: '#ede9fe',
                    borderRadius: '12px',
                    border: '2px solid #8b5cf6'
                  }}>
                    <div style={{ display: 'flex', alignItems: 'center', marginBottom: '12px' }}>
                      <span style={{ fontSize: '24pt', marginRight: '12px' }}>💎</span>
                      <div>
                        <p style={{ fontSize: '10pt', color: '#6d28d9', fontWeight: 600 }}>수호 카드</p>
                        <p style={{ fontSize: '14pt', fontWeight: 700, color: '#4c1d95' }}>
                          {traditionalAnalysis.cardDeck.guardian.mainGemKorean}
                        </p>
                      </div>
                    </div>
                    <p style={{ fontSize: '11pt', color: '#6b7280', lineHeight: 1.6 }}>
                      {traditionalAnalysis.cardDeck.guardian.story.slice(0, 80)}...
                    </p>
                    <div style={{ marginTop: '8px', display: 'flex', gap: '6px', flexWrap: 'wrap' }}>
                      {traditionalAnalysis.cardDeck.guardian.keywords.map((kw, i) => (
                        <span key={i} style={{
                          fontSize: '9pt',
                          padding: '2px 8px',
                          backgroundColor: '#ddd6fe',
                          borderRadius: '10px',
                          color: '#6d28d9'
                        }}>{kw}</span>
                      ))}
                    </div>
                  </div>
                </div>

                {/* 행운 정보 요약 */}
                <div style={{
                  padding: '16px 20px',
                  backgroundColor: '#f8fafc',
                  borderRadius: '10px',
                  border: '1px solid #e2e8f0'
                }}>
                  <p style={{ fontSize: '12pt', fontWeight: 700, color: '#1e293b', marginBottom: '12px' }}>
                    🍀 나의 행운 정보
                  </p>
                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '12px' }}>
                    <div>
                      <p style={{ fontSize: '9pt', color: '#64748b' }}>행운 숫자</p>
                      <p style={{ fontSize: '14pt', fontWeight: 700, color: '#0f172a' }}>
                        {traditionalAnalysis.cardDeck.fortune.luckyNumbers.join(' · ')}
                      </p>
                    </div>
                    <div>
                      <p style={{ fontSize: '9pt', color: '#64748b' }}>행운 방향</p>
                      <p style={{ fontSize: '14pt', fontWeight: 700, color: '#0f172a' }}>
                        {traditionalAnalysis.cardDeck.fortune.luckyDirection}
                      </p>
                    </div>
                    <div>
                      <p style={{ fontSize: '9pt', color: '#64748b' }}>행운 색상</p>
                      <p style={{ fontSize: '14pt', fontWeight: 700, color: '#0f172a' }}>
                        {traditionalAnalysis.cardDeck.fortune.luckyColor}
                      </p>
                    </div>
                    <div>
                      <p style={{ fontSize: '9pt', color: '#64748b' }}>행운의 달</p>
                      <p style={{ fontSize: '14pt', fontWeight: 700, color: '#0f172a' }}>
                        {traditionalAnalysis.cardDeck.fortune.luckyMonths.map(m => `${m}월`).join(', ')}
                      </p>
                    </div>
                  </div>
                </div>
              </Section>
            )}

            {/* 페이지 나누기 */}
            <div style={{ pageBreakAfter: 'always' }} />
          </>
        )}

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
