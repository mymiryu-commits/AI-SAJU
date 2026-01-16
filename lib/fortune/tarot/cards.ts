/**
 * 타로 카드 78장 데이터
 */

import { TarotCardInfo, CardMeaning, CardId, Suit, Rank } from './types';

// ===== 메이저 아르카나 (22장) =====
export const MAJOR_ARCANA: TarotCardInfo[] = [
  {
    id: 'the-fool',
    number: 0,
    name: 'The Fool',
    korean: '바보',
    type: 'major',
    element: 'air',
    planet: '천왕성',
    keywords: ['새로운 시작', '순수함', '자유', '모험'],
  },
  {
    id: 'the-magician',
    number: 1,
    name: 'The Magician',
    korean: '마법사',
    type: 'major',
    element: 'air',
    planet: '수성',
    keywords: ['의지력', '창조', '기술', '자원 활용'],
  },
  {
    id: 'the-high-priestess',
    number: 2,
    name: 'The High Priestess',
    korean: '여사제',
    type: 'major',
    element: 'water',
    planet: '달',
    keywords: ['직관', '신비', '무의식', '내면의 지혜'],
  },
  {
    id: 'the-empress',
    number: 3,
    name: 'The Empress',
    korean: '여황제',
    type: 'major',
    element: 'earth',
    planet: '금성',
    keywords: ['풍요', '모성', '자연', '창조력'],
  },
  {
    id: 'the-emperor',
    number: 4,
    name: 'The Emperor',
    korean: '황제',
    type: 'major',
    element: 'fire',
    zodiac: '양자리',
    keywords: ['권위', '구조', '리더십', '안정'],
  },
  {
    id: 'the-hierophant',
    number: 5,
    name: 'The Hierophant',
    korean: '교황',
    type: 'major',
    element: 'earth',
    zodiac: '황소자리',
    keywords: ['전통', '가르침', '신념', '도덕'],
  },
  {
    id: 'the-lovers',
    number: 6,
    name: 'The Lovers',
    korean: '연인',
    type: 'major',
    element: 'air',
    zodiac: '쌍둥이자리',
    keywords: ['사랑', '선택', '조화', '가치관'],
  },
  {
    id: 'the-chariot',
    number: 7,
    name: 'The Chariot',
    korean: '전차',
    type: 'major',
    element: 'water',
    zodiac: '게자리',
    keywords: ['의지', '승리', '결단력', '전진'],
  },
  {
    id: 'strength',
    number: 8,
    name: 'Strength',
    korean: '힘',
    type: 'major',
    element: 'fire',
    zodiac: '사자자리',
    keywords: ['용기', '인내', '내면의 힘', '자기 통제'],
  },
  {
    id: 'the-hermit',
    number: 9,
    name: 'The Hermit',
    korean: '은둔자',
    type: 'major',
    element: 'earth',
    zodiac: '처녀자리',
    keywords: ['성찰', '고독', '지혜', '내면 탐구'],
  },
  {
    id: 'wheel-of-fortune',
    number: 10,
    name: 'Wheel of Fortune',
    korean: '운명의 수레바퀴',
    type: 'major',
    planet: '목성',
    keywords: ['변화', '운명', '기회', '사이클'],
  },
  {
    id: 'justice',
    number: 11,
    name: 'Justice',
    korean: '정의',
    type: 'major',
    element: 'air',
    zodiac: '천칭자리',
    keywords: ['공정', '진실', '균형', '인과응보'],
  },
  {
    id: 'the-hanged-man',
    number: 12,
    name: 'The Hanged Man',
    korean: '매달린 사람',
    type: 'major',
    element: 'water',
    planet: '해왕성',
    keywords: ['희생', '새로운 관점', '기다림', '순응'],
  },
  {
    id: 'death',
    number: 13,
    name: 'Death',
    korean: '죽음',
    type: 'major',
    element: 'water',
    zodiac: '전갈자리',
    keywords: ['변환', '끝과 시작', '재탄생', '변화'],
  },
  {
    id: 'temperance',
    number: 14,
    name: 'Temperance',
    korean: '절제',
    type: 'major',
    element: 'fire',
    zodiac: '사수자리',
    keywords: ['균형', '인내', '조화', '중용'],
  },
  {
    id: 'the-devil',
    number: 15,
    name: 'The Devil',
    korean: '악마',
    type: 'major',
    element: 'earth',
    zodiac: '염소자리',
    keywords: ['속박', '물질주의', '그림자', '유혹'],
  },
  {
    id: 'the-tower',
    number: 16,
    name: 'The Tower',
    korean: '탑',
    type: 'major',
    element: 'fire',
    planet: '화성',
    keywords: ['급변', '파괴', '계시', '해방'],
  },
  {
    id: 'the-star',
    number: 17,
    name: 'The Star',
    korean: '별',
    type: 'major',
    element: 'air',
    zodiac: '물병자리',
    keywords: ['희망', '영감', '평화', '치유'],
  },
  {
    id: 'the-moon',
    number: 18,
    name: 'The Moon',
    korean: '달',
    type: 'major',
    element: 'water',
    zodiac: '물고기자리',
    keywords: ['환상', '직관', '불안', '무의식'],
  },
  {
    id: 'the-sun',
    number: 19,
    name: 'The Sun',
    korean: '태양',
    type: 'major',
    element: 'fire',
    planet: '태양',
    keywords: ['성공', '기쁨', '활력', '명확함'],
  },
  {
    id: 'judgement',
    number: 20,
    name: 'Judgement',
    korean: '심판',
    type: 'major',
    element: 'fire',
    planet: '명왕성',
    keywords: ['부활', '판단', '소명', '자기 평가'],
  },
  {
    id: 'the-world',
    number: 21,
    name: 'The World',
    korean: '세계',
    type: 'major',
    planet: '토성',
    keywords: ['완성', '성취', '통합', '여정의 끝'],
  },
];

// ===== 마이너 아르카나 생성 함수 =====
const RANKS: { rank: Rank; number: number; korean: string }[] = [
  { rank: 'ace', number: 1, korean: '에이스' },
  { rank: '2', number: 2, korean: '2' },
  { rank: '3', number: 3, korean: '3' },
  { rank: '4', number: 4, korean: '4' },
  { rank: '5', number: 5, korean: '5' },
  { rank: '6', number: 6, korean: '6' },
  { rank: '7', number: 7, korean: '7' },
  { rank: '8', number: 8, korean: '8' },
  { rank: '9', number: 9, korean: '9' },
  { rank: '10', number: 10, korean: '10' },
  { rank: 'page', number: 11, korean: '페이지' },
  { rank: 'knight', number: 12, korean: '나이트' },
  { rank: 'queen', number: 13, korean: '퀸' },
  { rank: 'king', number: 14, korean: '킹' },
];

const SUITS: { suit: Suit; korean: string; element: 'fire' | 'water' | 'air' | 'earth' }[] = [
  { suit: 'wands', korean: '완드', element: 'fire' },
  { suit: 'cups', korean: '컵', element: 'water' },
  { suit: 'swords', korean: '소드', element: 'air' },
  { suit: 'pentacles', korean: '펜타클', element: 'earth' },
];

// 마이너 아르카나 키워드
const MINOR_KEYWORDS: Record<Suit, Record<Rank, string[]>> = {
  wands: {
    ace: ['새로운 시작', '열정', '영감', '잠재력'],
    '2': ['계획', '결정', '미래 비전', '진행'],
    '3': ['확장', '기회', '성장', '탐험'],
    '4': ['축하', '조화', '안정', '이정표'],
    '5': ['경쟁', '갈등', '도전', '긴장'],
    '6': ['승리', '인정', '자신감', '성취'],
    '7': ['방어', '끈기', '도전', '입장'],
    '8': ['빠른 진행', '움직임', '행동', '뉴스'],
    '9': ['인내', '회복력', '끈기', '경계'],
    '10': ['부담', '책임', '스트레스', '완료 직전'],
    page: ['탐험', '열정', '자유 정신', '새 메시지'],
    knight: ['에너지', '열정', '모험', '충동'],
    queen: ['자신감', '결단력', '열정', '독립'],
    king: ['리더십', '비전', '기업가', '명예'],
  },
  cups: {
    ace: ['새로운 감정', '직관', '사랑의 시작', '창의성'],
    '2': ['파트너십', '조화', '상호 끌림', '균형'],
    '3': ['축하', '우정', '창의적 협력', '기쁨'],
    '4': ['무관심', '명상', '재평가', '권태'],
    '5': ['상실', '슬픔', '후회', '실망'],
    '6': ['향수', '추억', '순수함', '재회'],
    '7': ['환상', '선택', '상상', '소망'],
    '8': ['떠남', '실망', '탐색', '더 깊은 의미'],
    '9': ['만족', '감사', '소원 성취', '행복'],
    '10': ['행복', '조화', '가정', '정서적 충족'],
    page: ['창의성', '직관', '새 감정', '꿈'],
    knight: ['로맨스', '매력', '상상력', '제안'],
    queen: ['공감', '직관', '양육', '감성 지능'],
    king: ['감정 균형', '외교', '관대함', '지혜'],
  },
  swords: {
    ace: ['명확함', '돌파구', '진실', '새 아이디어'],
    '2': ['결정', '균형', '교착 상태', '선택'],
    '3': ['상심', '슬픔', '고통', '배신'],
    '4': ['휴식', '회복', '명상', '재충전'],
    '5': ['갈등', '패배', '손실', '승자 없는 싸움'],
    '6': ['전환', '회복', '떠남', '더 나은 시기'],
    '7': ['속임', '전략', '은밀함', '기지'],
    '8': ['제한', '속박', '무력감', '자기 제한'],
    '9': ['불안', '걱정', '악몽', '절망'],
    '10': ['끝', '고통의 정점', '배신', '위기'],
    page: ['호기심', '새 아이디어', '소식', '경계'],
    knight: ['행동', '충동', '야망', '결단력'],
    queen: ['독립', '명확한 판단', '직접 소통', '경험'],
    king: ['지적 권위', '진실', '윤리', '판단력'],
  },
  pentacles: {
    ace: ['새 기회', '번영', '잠재력', '풍요의 시작'],
    '2': ['균형', '적응', '우선순위', '유연성'],
    '3': ['협력', '학습', '기술', '팀워크'],
    '4': ['보안', '절약', '소유욕', '안정'],
    '5': ['어려움', '빈곤', '고립', '걱정'],
    '6': ['관대함', '나눔', '균형', '기부'],
    '7': ['평가', '보상', '인내', '장기 투자'],
    '8': ['기술', '노력', '장인정신', '헌신'],
    '9': ['풍요', '자립', '사치', '성취'],
    '10': ['부', '상속', '가족', '장기적 성공'],
    page: ['야망', '기회', '학습', '새 모험'],
    knight: ['효율', '일상', '책임', '인내'],
    queen: ['양육', '실용성', '재정 안정', '안락함'],
    king: ['풍요', '안정', '리더십', '사업 감각'],
  },
};

// 마이너 아르카나 생성
export const MINOR_ARCANA: TarotCardInfo[] = SUITS.flatMap((suitInfo) =>
  RANKS.map((rankInfo) => ({
    id: `${rankInfo.rank}-of-${suitInfo.suit}` as CardId,
    number: rankInfo.number,
    name: `${rankInfo.rank.charAt(0).toUpperCase() + rankInfo.rank.slice(1)} of ${suitInfo.suit.charAt(0).toUpperCase() + suitInfo.suit.slice(1)}`,
    korean: `${suitInfo.korean} ${rankInfo.korean}`,
    type: 'minor' as const,
    suit: suitInfo.suit,
    rank: rankInfo.rank,
    element: suitInfo.element,
    keywords: MINOR_KEYWORDS[suitInfo.suit][rankInfo.rank],
  }))
);

// 전체 덱 (78장)
export const FULL_DECK: TarotCardInfo[] = [...MAJOR_ARCANA, ...MINOR_ARCANA];

// 카드 ID로 찾기
export function getCardById(id: CardId): TarotCardInfo | undefined {
  return FULL_DECK.find((card) => card.id === id);
}

// 랜덤 카드 뽑기
export function drawRandomCards(count: number, allowReversed: boolean = true): { card: TarotCardInfo; isReversed: boolean }[] {
  const shuffled = [...FULL_DECK].sort(() => Math.random() - 0.5);
  return shuffled.slice(0, count).map((card) => ({
    card,
    isReversed: allowReversed && Math.random() > 0.5,
  }));
}

// 메이저 아르카나만 뽑기
export function drawMajorArcana(count: number, allowReversed: boolean = true): { card: TarotCardInfo; isReversed: boolean }[] {
  const shuffled = [...MAJOR_ARCANA].sort(() => Math.random() - 0.5);
  return shuffled.slice(0, count).map((card) => ({
    card,
    isReversed: allowReversed && Math.random() > 0.5,
  }));
}

// 특정 수트만 뽑기
export function drawFromSuit(suit: Suit, count: number, allowReversed: boolean = true): { card: TarotCardInfo; isReversed: boolean }[] {
  const suitCards = MINOR_ARCANA.filter((card) => card.suit === suit);
  const shuffled = suitCards.sort(() => Math.random() - 0.5);
  return shuffled.slice(0, count).map((card) => ({
    card,
    isReversed: allowReversed && Math.random() > 0.5,
  }));
}

// ===== 이미지 파일명 매핑 =====
// 숫자를 로마 숫자로 변환
const toRomanNumeral = (num: number): string => {
  const romanNumerals: Record<number, string> = {
    1: 'I', 2: 'II', 3: 'III', 4: 'IV', 5: 'V',
    6: 'VI', 7: 'VII', 8: 'VIII', 9: 'IX', 10: 'X',
  };
  return romanNumerals[num] || num.toString();
};

// 수트명 매핑 (파일명 형식)
const SUIT_FILENAME: Record<Suit, string> = {
  wands: 'WANDS',
  cups: 'CUPS',
  swords: 'SWORDS',
  pentacles: 'PENTACLES',
};

/**
 * 카드 ID를 이미지 파일명으로 변환
 * 파일명 패턴:
 * - 메이저 아르카나: the-fool, the-magician, judgement 등 (소문자)
 * - 에이스: ace-of-wands, ace-of-cups 등 (소문자)
 * - 숫자 카드 2-10: WANDS-II, CUPS-X 등 (대문자 + 로마숫자)
 * - 페이지/나이트/퀸: PAGE-OF-WANDS, KNIGHT-OF-CUPS 등 (대문자)
 * - 킹: king-of-wands 등 (소문자)
 */
export function getCardImageFilename(card: TarotCardInfo): string {
  // 메이저 아르카나
  if (card.type === 'major') {
    return card.id; // the-fool, the-magician, judgement 등
  }

  // 마이너 아르카나
  const suit = card.suit!;
  const rank = card.rank!;

  // 에이스
  if (rank === 'ace') {
    return `ace-of-${suit}`; // ace-of-wands, ace-of-cups
  }

  // 숫자 카드 2-10 (로마 숫자 사용)
  const numericRanks = ['2', '3', '4', '5', '6', '7', '8', '9', '10'];
  if (numericRanks.includes(rank)) {
    const roman = toRomanNumeral(parseInt(rank));
    return `${SUIT_FILENAME[suit]}-${roman}`; // WANDS-II, CUPS-X
  }

  // 킹 (소문자)
  if (rank === 'king') {
    return `king-of-${suit}`; // king-of-wands
  }

  // 페이지, 나이트, 퀸 (대문자)
  return `${rank.toUpperCase()}-OF-${SUIT_FILENAME[suit]}`; // PAGE-OF-WANDS, KNIGHT-OF-CUPS
}

/**
 * 카드 이미지 URL 생성
 */
export function getCardImageUrl(card: TarotCardInfo, extension: string = 'jpg'): string {
  const filename = getCardImageFilename(card);
  return `/images/tarot/${filename}.${extension}`;
}
