/**
 * 타로 카드 타입 정의
 */

// 메이저 아르카나 (22장)
export type MajorArcana =
  | 'the-fool'
  | 'the-magician'
  | 'the-high-priestess'
  | 'the-empress'
  | 'the-emperor'
  | 'the-hierophant'
  | 'the-lovers'
  | 'the-chariot'
  | 'strength'
  | 'the-hermit'
  | 'wheel-of-fortune'
  | 'justice'
  | 'the-hanged-man'
  | 'death'
  | 'temperance'
  | 'the-devil'
  | 'the-tower'
  | 'the-star'
  | 'the-moon'
  | 'the-sun'
  | 'judgement'
  | 'the-world';

// 마이너 아르카나 수트
export type Suit = 'wands' | 'cups' | 'swords' | 'pentacles';

// 마이너 아르카나 랭크
export type Rank = 'ace' | '2' | '3' | '4' | '5' | '6' | '7' | '8' | '9' | '10' | 'page' | 'knight' | 'queen' | 'king';

// 카드 방향
export type CardOrientation = 'upright' | 'reversed';

// 스프레드 타입
export type SpreadType = 'single' | 'three-card' | 'celtic-cross' | 'love' | 'career';

// 카드 ID (메이저 또는 마이너)
export type CardId = MajorArcana | `${Rank}-of-${Suit}`;

// 타로 카드 기본 정보
export interface TarotCardInfo {
  id: CardId;
  number: number;
  name: string;
  korean: string;
  type: 'major' | 'minor';
  suit?: Suit;
  rank?: Rank;
  element?: 'fire' | 'water' | 'air' | 'earth';
  zodiac?: string;
  planet?: string;
  keywords: string[];
  imageUrl?: string;
}

// 카드 의미 (정방향/역방향)
export interface CardMeaning {
  upright: {
    general: string;
    love: string;
    career: string;
    advice: string;
    keywords: string[];
  };
  reversed: {
    general: string;
    love: string;
    career: string;
    advice: string;
    keywords: string[];
  };
  story: string;
  symbolism: string;
}

// 뽑힌 카드
export interface DrawnCard {
  card: TarotCardInfo;
  orientation: CardOrientation;
  position?: string;
  positionMeaning?: string;
}

// 스프레드 포지션 정의
export interface SpreadPosition {
  id: string;
  name: string;
  korean: string;
  description: string;
  x: number; // 위치 (% 단위)
  y: number;
  rotation?: number;
}

// 스프레드 정의
export interface SpreadDefinition {
  type: SpreadType;
  name: string;
  korean: string;
  description: string;
  cardCount: number;
  positions: SpreadPosition[];
}

// 타로 리딩 결과
export interface TarotReading {
  id: string;
  spreadType: SpreadType;
  question?: string;
  cards: DrawnCard[];
  interpretation: string;
  advice: string;
  createdAt: Date;
}

// 카드 상태 (애니메이션용)
export interface CardState {
  isFlipped: boolean;
  isSelected: boolean;
  isRevealed: boolean;
  animationDelay: number;
}

// 수트 정보
export interface SuitInfo {
  suit: Suit;
  korean: string;
  element: 'fire' | 'water' | 'air' | 'earth';
  symbol: string;
  meaning: string;
  color: string;
}

// 수트 데이터
export const SUIT_DATA: Record<Suit, SuitInfo> = {
  wands: {
    suit: 'wands',
    korean: '완드 (지팡이)',
    element: 'fire',
    symbol: '🔥',
    meaning: '열정, 창의성, 의지력, 행동',
    color: 'orange',
  },
  cups: {
    suit: 'cups',
    korean: '컵',
    element: 'water',
    symbol: '💧',
    meaning: '감정, 직관, 관계, 사랑',
    color: 'blue',
  },
  swords: {
    suit: 'swords',
    korean: '소드 (검)',
    element: 'air',
    symbol: '💨',
    meaning: '지성, 소통, 갈등, 진실',
    color: 'sky',
  },
  pentacles: {
    suit: 'pentacles',
    korean: '펜타클 (동전)',
    element: 'earth',
    symbol: '🌍',
    meaning: '물질, 재정, 건강, 실용성',
    color: 'emerald',
  },
};

// 스프레드 정의
export const SPREAD_DEFINITIONS: Record<SpreadType, SpreadDefinition> = {
  single: {
    type: 'single',
    name: 'Single Card',
    korean: '원카드',
    description: '오늘의 메시지를 담은 한 장의 카드',
    cardCount: 1,
    positions: [
      {
        id: 'present',
        name: 'Present',
        korean: '현재',
        description: '지금 이 순간 당신에게 필요한 메시지',
        x: 50,
        y: 50,
      },
    ],
  },
  'three-card': {
    type: 'three-card',
    name: 'Three Card Spread',
    korean: '쓰리카드',
    description: '과거, 현재, 미래의 흐름을 보여주는 세 장의 카드',
    cardCount: 3,
    positions: [
      {
        id: 'past',
        name: 'Past',
        korean: '과거',
        description: '지나온 경험과 영향',
        x: 20,
        y: 50,
      },
      {
        id: 'present',
        name: 'Present',
        korean: '현재',
        description: '현재 상황과 에너지',
        x: 50,
        y: 50,
      },
      {
        id: 'future',
        name: 'Future',
        korean: '미래',
        description: '다가올 가능성과 방향',
        x: 80,
        y: 50,
      },
    ],
  },
  'celtic-cross': {
    type: 'celtic-cross',
    name: 'Celtic Cross',
    korean: '켈틱 크로스',
    description: '깊이 있는 분석을 위한 전통적인 10장 배치',
    cardCount: 10,
    positions: [
      {
        id: 'present',
        name: 'Present Situation',
        korean: '현재 상황',
        description: '현재 당신을 둘러싼 상황',
        x: 30,
        y: 50,
      },
      {
        id: 'challenge',
        name: 'Challenge',
        korean: '도전/장애물',
        description: '현재 직면한 도전이나 장애물',
        x: 30,
        y: 50,
        rotation: 90,
      },
      {
        id: 'foundation',
        name: 'Foundation',
        korean: '근본 원인',
        description: '상황의 기초가 되는 요소',
        x: 30,
        y: 80,
      },
      {
        id: 'recent-past',
        name: 'Recent Past',
        korean: '최근 과거',
        description: '최근 일어난 영향력 있는 사건',
        x: 10,
        y: 50,
      },
      {
        id: 'crown',
        name: 'Crown',
        korean: '목표/이상',
        description: '최선의 결과 또는 목표',
        x: 30,
        y: 20,
      },
      {
        id: 'near-future',
        name: 'Near Future',
        korean: '가까운 미래',
        description: '곧 다가올 영향',
        x: 50,
        y: 50,
      },
      {
        id: 'self',
        name: 'Self',
        korean: '자아',
        description: '이 상황에서의 당신의 태도',
        x: 75,
        y: 80,
      },
      {
        id: 'environment',
        name: 'Environment',
        korean: '환경',
        description: '주변 사람들과 환경의 영향',
        x: 75,
        y: 60,
      },
      {
        id: 'hopes-fears',
        name: 'Hopes & Fears',
        korean: '희망과 두려움',
        description: '내면의 희망과 두려움',
        x: 75,
        y: 40,
      },
      {
        id: 'outcome',
        name: 'Outcome',
        korean: '결과',
        description: '상황의 최종 결과',
        x: 75,
        y: 20,
      },
    ],
  },
  love: {
    type: 'love',
    name: 'Love Spread',
    korean: '연애 스프레드',
    description: '사랑과 관계에 대한 5장 배치',
    cardCount: 5,
    positions: [
      {
        id: 'you',
        name: 'You',
        korean: '당신',
        description: '관계에서 당신의 에너지',
        x: 20,
        y: 60,
      },
      {
        id: 'partner',
        name: 'Partner',
        korean: '상대방',
        description: '상대방의 에너지',
        x: 80,
        y: 60,
      },
      {
        id: 'relationship',
        name: 'Relationship',
        korean: '관계',
        description: '두 사람 사이의 에너지',
        x: 50,
        y: 50,
      },
      {
        id: 'challenge',
        name: 'Challenge',
        korean: '도전',
        description: '관계에서 극복해야 할 점',
        x: 50,
        y: 80,
      },
      {
        id: 'potential',
        name: 'Potential',
        korean: '잠재력',
        description: '관계의 미래 가능성',
        x: 50,
        y: 20,
      },
    ],
  },
  career: {
    type: 'career',
    name: 'Career Spread',
    korean: '커리어 스프레드',
    description: '직업과 경력에 대한 5장 배치',
    cardCount: 5,
    positions: [
      {
        id: 'current',
        name: 'Current Position',
        korean: '현재 위치',
        description: '현재 직업적 상황',
        x: 50,
        y: 50,
      },
      {
        id: 'strengths',
        name: 'Strengths',
        korean: '강점',
        description: '활용해야 할 강점',
        x: 20,
        y: 30,
      },
      {
        id: 'obstacles',
        name: 'Obstacles',
        korean: '장애물',
        description: '극복해야 할 장애물',
        x: 80,
        y: 30,
      },
      {
        id: 'action',
        name: 'Action',
        korean: '행동',
        description: '취해야 할 행동',
        x: 20,
        y: 70,
      },
      {
        id: 'outcome',
        name: 'Outcome',
        korean: '결과',
        description: '예상되는 결과',
        x: 80,
        y: 70,
      },
    ],
  },
};
