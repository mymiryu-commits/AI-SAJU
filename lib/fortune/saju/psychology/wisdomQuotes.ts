/**
 * 인생 격언 100개 데이터베이스
 *
 * 성향별 맞춤형 명언/격언 시스템
 * - 융 원형 (12가지)
 * - 십신 성향 (10가지)
 * - 생애주기별 맞춤
 */

export interface WisdomQuote {
  id: number;
  korean: string;          // 한글 격언
  original?: string;       // 원문 (영어/한문 등)
  author: string;          // 작가/출처
  authorKorean?: string;   // 작가 한글명
  theme: QuoteTheme;       // 주제
  archetypes: string[];    // 적합한 융 원형
  sipsins: string[];       // 적합한 십신
  lifeStages: string[];    // 적합한 생애주기
  mood: QuoteMood;         // 분위기
}

export type QuoteTheme =
  | 'courage'      // 용기/도전
  | 'wisdom'       // 지혜/통찰
  | 'perseverance' // 인내/끈기
  | 'love'         // 사랑/관계
  | 'success'      // 성공/성취
  | 'peace'        // 평화/안정
  | 'growth'       // 성장/발전
  | 'creativity'   // 창의/표현
  | 'leadership'   // 리더십/영향력
  | 'balance'      // 균형/조화
  | 'faith'        // 믿음/신뢰
  | 'freedom';     // 자유/독립

export type QuoteMood = 'inspiring' | 'comforting' | 'challenging' | 'reflective';

/**
 * 100개의 성향 맞춤형 인생 격언
 */
export const WISDOM_QUOTES: WisdomQuote[] = [
  // ========== 용기/도전 (Courage) ==========
  {
    id: 1,
    korean: "천 리 길도 한 걸음부터 시작된다.",
    original: "千里之行 始於足下",
    author: "Lao Tzu",
    authorKorean: "노자",
    theme: 'courage',
    archetypes: ['hero', 'explorer'],
    sipsins: ['geopjae', 'pyeongwan'],
    lifeStages: ['youth_early', 'youth_mid'],
    mood: 'inspiring'
  },
  {
    id: 2,
    korean: "용기란 두려움이 없는 것이 아니라, 두려움보다 더 중요한 것이 있다고 판단하는 것이다.",
    original: "Courage is not the absence of fear, but rather the judgment that something else is more important than fear.",
    author: "Ambrose Redmoon",
    theme: 'courage',
    archetypes: ['hero', 'ruler', 'magician'],
    sipsins: ['pyeongwan', 'jeonggwan'],
    lifeStages: ['adult_early', 'adult_mid'],
    mood: 'inspiring'
  },
  {
    id: 3,
    korean: "실패는 성공의 어머니다. 넘어지지 않는 것이 아니라 넘어져도 다시 일어서는 것이 중요하다.",
    author: "에디슨 (Thomas Edison)",
    theme: 'courage',
    archetypes: ['hero', 'explorer', 'creator'],
    sipsins: ['geopjae', 'sanggwan'],
    lifeStages: ['youth_mid', 'adult_early'],
    mood: 'challenging'
  },
  {
    id: 4,
    korean: "당신이 할 수 있다고 믿든, 할 수 없다고 믿든, 당신 말이 맞다.",
    original: "Whether you think you can or think you can't, you're right.",
    author: "Henry Ford",
    authorKorean: "헨리 포드",
    theme: 'courage',
    archetypes: ['ruler', 'hero', 'magician'],
    sipsins: ['bijeon', 'geopjae'],
    lifeStages: ['youth_early', 'adult_early'],
    mood: 'challenging'
  },
  {
    id: 5,
    korean: "큰 뜻을 품은 자는 반드시 때를 기다린다. 때가 오면 과감히 행동하라.",
    original: "大器晚成",
    author: "고전",
    theme: 'courage',
    archetypes: ['sage', 'ruler'],
    sipsins: ['jeongin', 'jeonggwan'],
    lifeStages: ['adult_mid', 'adult_late'],
    mood: 'inspiring'
  },
  {
    id: 6,
    korean: "새벽이 가장 어두운 법이다. 어둠 뒤에는 반드시 빛이 온다.",
    original: "The darkest hour is just before the dawn.",
    author: "Thomas Fuller",
    authorKorean: "토마스 풀러",
    theme: 'courage',
    archetypes: ['innocent', 'sage'],
    sipsins: ['jeongin', 'siksin'],
    lifeStages: ['adult_mid', 'senior_early'],
    mood: 'comforting'
  },
  {
    id: 7,
    korean: "모험 없이는 아무것도 얻을 수 없다.",
    original: "Nothing ventured, nothing gained.",
    author: "영어 속담",
    theme: 'courage',
    archetypes: ['explorer', 'hero', 'outlaw'],
    sipsins: ['geopjae', 'pyeonjae'],
    lifeStages: ['youth_early', 'youth_mid', 'adult_early'],
    mood: 'challenging'
  },
  {
    id: 8,
    korean: "뜻이 있는 곳에 길이 있다.",
    original: "Where there's a will, there's a way.",
    author: "영어 속담",
    theme: 'courage',
    archetypes: ['hero', 'explorer'],
    sipsins: ['bijeon', 'geopjae', 'pyeongwan'],
    lifeStages: ['youth_early', 'youth_mid'],
    mood: 'inspiring'
  },

  // ========== 지혜/통찰 (Wisdom) ==========
  {
    id: 9,
    korean: "아는 것이 힘이다. 그러나 진정한 지혜는 아는 것을 실천하는 데 있다.",
    original: "Knowledge is power, but wisdom is the application of that knowledge.",
    author: "Francis Bacon",
    authorKorean: "프랜시스 베이컨",
    theme: 'wisdom',
    archetypes: ['sage', 'magician'],
    sipsins: ['jeongin', 'pyeonin'],
    lifeStages: ['adult_early', 'adult_mid', 'adult_late'],
    mood: 'reflective'
  },
  {
    id: 10,
    korean: "자기 자신을 아는 것이 모든 지혜의 시작이다.",
    original: "Knowing yourself is the beginning of all wisdom.",
    author: "Aristotle",
    authorKorean: "아리스토텔레스",
    theme: 'wisdom',
    archetypes: ['sage', 'magician', 'explorer'],
    sipsins: ['pyeonin', 'jeongin'],
    lifeStages: ['adult_mid', 'adult_late', 'senior_early'],
    mood: 'reflective'
  },
  {
    id: 11,
    korean: "현명한 사람은 남의 실수에서 배우고, 어리석은 사람은 자신의 실수에서도 배우지 못한다.",
    author: "오토 폰 비스마르크",
    theme: 'wisdom',
    archetypes: ['sage', 'ruler'],
    sipsins: ['jeongin', 'jeonggwan'],
    lifeStages: ['adult_early', 'adult_mid'],
    mood: 'reflective'
  },
  {
    id: 12,
    korean: "침묵은 금이다. 말하기 전에 세 번 생각하라.",
    original: "三思而後行",
    author: "공자",
    theme: 'wisdom',
    archetypes: ['sage', 'caregiver'],
    sipsins: ['jeongin', 'jeongjae'],
    lifeStages: ['adult_mid', 'adult_late', 'senior_early'],
    mood: 'reflective'
  },
  {
    id: 13,
    korean: "물은 가장 부드러우면서도 가장 단단한 것을 뚫는다. 유연함이 진정한 강함이다.",
    original: "天下莫柔弱於水 而攻堅強者莫之能勝",
    author: "Lao Tzu",
    authorKorean: "노자",
    theme: 'wisdom',
    archetypes: ['sage', 'magician'],
    sipsins: ['pyeonin', 'siksin'],
    lifeStages: ['adult_late', 'senior_early', 'senior_mid'],
    mood: 'reflective'
  },
  {
    id: 14,
    korean: "오늘 하루가 인생의 마지막 날인 것처럼 살아라. 그러면 언젠가 정말 그런 날이 올 것이다.",
    original: "Live as if you were to die tomorrow.",
    author: "Mahatma Gandhi",
    authorKorean: "마하트마 간디",
    theme: 'wisdom',
    archetypes: ['sage', 'innocent'],
    sipsins: ['pyeonin', 'siksin'],
    lifeStages: ['senior_early', 'senior_mid', 'senior_late'],
    mood: 'reflective'
  },
  {
    id: 15,
    korean: "배움에는 왕도가 없다. 꾸준함만이 정답이다.",
    author: "유클리드",
    theme: 'wisdom',
    archetypes: ['sage'],
    sipsins: ['jeongin', 'jeongjae'],
    lifeStages: ['youth_early', 'youth_mid', 'adult_early'],
    mood: 'challenging'
  },
  {
    id: 16,
    korean: "남을 가르치는 것은 두 번 배우는 것이다.",
    original: "To teach is to learn twice.",
    author: "Joseph Joubert",
    authorKorean: "조제프 주베르",
    theme: 'wisdom',
    archetypes: ['sage', 'caregiver'],
    sipsins: ['jeongin', 'siksin'],
    lifeStages: ['adult_mid', 'adult_late'],
    mood: 'inspiring'
  },

  // ========== 인내/끈기 (Perseverance) ==========
  {
    id: 17,
    korean: "포기하지 않는 한, 실패란 없다. 멈추지 않으면 반드시 도착한다.",
    original: "Success is not final, failure is not fatal: it is the courage to continue that counts.",
    author: "Winston Churchill",
    authorKorean: "윈스턴 처칠",
    theme: 'perseverance',
    archetypes: ['hero', 'ruler'],
    sipsins: ['jeongjae', 'bijeon'],
    lifeStages: ['adult_early', 'adult_mid'],
    mood: 'inspiring'
  },
  {
    id: 18,
    korean: "물방울이 바위를 뚫는 것은 힘이 아니라 끈기다.",
    original: "滴水穿石",
    author: "중국 속담",
    theme: 'perseverance',
    archetypes: ['sage', 'caregiver'],
    sipsins: ['jeongjae', 'jeongin'],
    lifeStages: ['adult_mid', 'adult_late'],
    mood: 'comforting'
  },
  {
    id: 19,
    korean: "다이아몬드는 압력을 받아야 빛난다. 고난이 당신을 빛나게 한다.",
    author: "현대 격언",
    theme: 'perseverance',
    archetypes: ['hero', 'magician'],
    sipsins: ['geopjae', 'pyeongwan'],
    lifeStages: ['youth_mid', 'adult_early'],
    mood: 'challenging'
  },
  {
    id: 20,
    korean: "참을 인(忍) 자를 세 번 쓰면 살인도 면한다.",
    author: "한국 속담",
    theme: 'perseverance',
    archetypes: ['sage', 'caregiver'],
    sipsins: ['jeongin', 'jeongjae'],
    lifeStages: ['adult_mid', 'adult_late', 'senior_early'],
    mood: 'reflective'
  },
  {
    id: 21,
    korean: "로마는 하루아침에 이루어지지 않았다.",
    original: "Rome wasn't built in a day.",
    author: "영어 속담",
    theme: 'perseverance',
    archetypes: ['ruler', 'creator'],
    sipsins: ['jeongjae', 'jeonggwan'],
    lifeStages: ['adult_early', 'adult_mid'],
    mood: 'comforting'
  },
  {
    id: 22,
    korean: "가장 어두운 밤도 끝이 있고, 태양은 반드시 떠오른다.",
    original: "Even the darkest night will end and the sun will rise.",
    author: "Victor Hugo",
    authorKorean: "빅토르 위고",
    theme: 'perseverance',
    archetypes: ['innocent', 'lover'],
    sipsins: ['siksin', 'jeongin'],
    lifeStages: ['adult_mid', 'senior_early'],
    mood: 'comforting'
  },
  {
    id: 23,
    korean: "고생 끝에 낙이 온다. 지금의 어려움은 내일의 행복을 위한 것이다.",
    author: "한국 속담",
    theme: 'perseverance',
    archetypes: ['caregiver', 'innocent'],
    sipsins: ['jeongjae', 'siksin'],
    lifeStages: ['adult_early', 'adult_mid'],
    mood: 'comforting'
  },
  {
    id: 24,
    korean: "나무는 바람에 흔들려야 뿌리가 깊어진다.",
    author: "현대 격언",
    theme: 'perseverance',
    archetypes: ['sage', 'hero'],
    sipsins: ['jeongin', 'bijeon'],
    lifeStages: ['youth_mid', 'adult_early'],
    mood: 'reflective'
  },

  // ========== 사랑/관계 (Love) ==========
  {
    id: 25,
    korean: "사랑받는 것보다 사랑하는 것이 더 큰 행복이다.",
    author: "성 프란치스코",
    theme: 'love',
    archetypes: ['lover', 'caregiver'],
    sipsins: ['siksin', 'jeongin'],
    lifeStages: ['adult_early', 'adult_mid', 'senior_mid'],
    mood: 'reflective'
  },
  {
    id: 26,
    korean: "인생에서 가장 좋은 것들은 무료다. 웃음, 사랑, 친구, 가족.",
    author: "현대 격언",
    theme: 'love',
    archetypes: ['innocent', 'lover', 'jester'],
    sipsins: ['siksin', 'jeongin'],
    lifeStages: ['senior_early', 'senior_mid', 'senior_late'],
    mood: 'comforting'
  },
  {
    id: 27,
    korean: "진정한 친구는 네가 넘어질 때 손을 내미는 사람이다.",
    author: "현대 격언",
    theme: 'love',
    archetypes: ['caregiver', 'lover'],
    sipsins: ['bijeon', 'siksin'],
    lifeStages: ['youth_mid', 'adult_early', 'adult_mid'],
    mood: 'comforting'
  },
  {
    id: 28,
    korean: "가족은 선택이 아니라 운명이다. 그러나 사랑은 선택이다.",
    author: "현대 격언",
    theme: 'love',
    archetypes: ['caregiver', 'ruler'],
    sipsins: ['jeongin', 'jeongjae'],
    lifeStages: ['adult_mid', 'adult_late', 'senior_early'],
    mood: 'reflective'
  },
  {
    id: 29,
    korean: "세상에서 가장 아름다운 것은 눈에 보이지 않는다. 마음으로 느껴야 한다.",
    original: "The best and most beautiful things in the world cannot be seen or even touched - they must be felt with the heart.",
    author: "Helen Keller",
    authorKorean: "헬렌 켈러",
    theme: 'love',
    archetypes: ['lover', 'innocent'],
    sipsins: ['siksin', 'pyeonin'],
    lifeStages: ['adult_early', 'adult_mid'],
    mood: 'reflective'
  },
  {
    id: 30,
    korean: "화해할 수 있을 때 화해하라. 내일이 없을 수도 있다.",
    author: "현대 격언",
    theme: 'love',
    archetypes: ['caregiver', 'sage'],
    sipsins: ['jeongin', 'siksin'],
    lifeStages: ['adult_late', 'senior_early', 'senior_mid'],
    mood: 'comforting'
  },
  {
    id: 31,
    korean: "사람을 얻으려면 먼저 그 마음을 얻어야 한다.",
    original: "得人心者得天下",
    author: "중국 격언",
    theme: 'love',
    archetypes: ['ruler', 'lover', 'caregiver'],
    sipsins: ['jeonggwan', 'siksin'],
    lifeStages: ['adult_early', 'adult_mid'],
    mood: 'reflective'
  },
  {
    id: 32,
    korean: "작은 친절이 큰 사랑을 만든다.",
    author: "마더 테레사",
    theme: 'love',
    archetypes: ['caregiver', 'innocent'],
    sipsins: ['siksin', 'jeongin'],
    lifeStages: ['adult_mid', 'senior_early', 'senior_mid'],
    mood: 'inspiring'
  },

  // ========== 성공/성취 (Success) ==========
  {
    id: 33,
    korean: "성공은 99%의 노력과 1%의 영감으로 이루어진다.",
    author: "Thomas Edison",
    authorKorean: "토마스 에디슨",
    theme: 'success',
    archetypes: ['creator', 'hero'],
    sipsins: ['jeongjae', 'geopjae'],
    lifeStages: ['youth_mid', 'adult_early'],
    mood: 'challenging'
  },
  {
    id: 34,
    korean: "기회는 준비된 자에게 온다.",
    original: "Luck is what happens when preparation meets opportunity.",
    author: "Seneca",
    authorKorean: "세네카",
    theme: 'success',
    archetypes: ['sage', 'ruler'],
    sipsins: ['jeongjae', 'pyeonjae'],
    lifeStages: ['youth_mid', 'adult_early', 'adult_mid'],
    mood: 'inspiring'
  },
  {
    id: 35,
    korean: "큰 꿈을 꾸어라. 꿈이 커야 실현도 크다.",
    author: "현대 격언",
    theme: 'success',
    archetypes: ['hero', 'magician', 'ruler'],
    sipsins: ['pyeongwan', 'geopjae'],
    lifeStages: ['youth_early', 'youth_mid'],
    mood: 'inspiring'
  },
  {
    id: 36,
    korean: "오늘 할 일을 내일로 미루지 마라.",
    author: "벤자민 프랭클린",
    theme: 'success',
    archetypes: ['ruler', 'hero'],
    sipsins: ['jeongjae', 'jeonggwan'],
    lifeStages: ['youth_early', 'youth_mid', 'adult_early'],
    mood: 'challenging'
  },
  {
    id: 37,
    korean: "목표가 없으면 어디로 가는지 알 수 없다. 방향을 정하고 나아가라.",
    author: "현대 격언",
    theme: 'success',
    archetypes: ['ruler', 'explorer'],
    sipsins: ['jeonggwan', 'pyeongwan'],
    lifeStages: ['youth_early', 'youth_mid'],
    mood: 'challenging'
  },
  {
    id: 38,
    korean: "남과 비교하지 마라. 어제의 나와 비교하라.",
    author: "현대 격언",
    theme: 'success',
    archetypes: ['sage', 'hero'],
    sipsins: ['bijeon', 'jeongin'],
    lifeStages: ['adult_early', 'adult_mid'],
    mood: 'reflective'
  },
  {
    id: 39,
    korean: "작은 일에도 최선을 다하라. 그것이 큰 일의 시작이다.",
    author: "현대 격언",
    theme: 'success',
    archetypes: ['caregiver', 'ruler'],
    sipsins: ['jeongjae', 'jeongin'],
    lifeStages: ['youth_early', 'youth_mid', 'adult_early'],
    mood: 'inspiring'
  },
  {
    id: 40,
    korean: "실패를 두려워하지 마라. 시도하지 않는 것이 진정한 실패다.",
    author: "현대 격언",
    theme: 'success',
    archetypes: ['hero', 'explorer', 'outlaw'],
    sipsins: ['geopjae', 'sanggwan'],
    lifeStages: ['youth_early', 'youth_mid'],
    mood: 'challenging'
  },

  // ========== 평화/안정 (Peace) ==========
  {
    id: 41,
    korean: "마음의 평화가 가장 큰 부이다.",
    author: "고전 격언",
    theme: 'peace',
    archetypes: ['sage', 'innocent'],
    sipsins: ['jeongin', 'jeongjae'],
    lifeStages: ['adult_late', 'senior_early', 'senior_mid'],
    mood: 'comforting'
  },
  {
    id: 42,
    korean: "있는 그대로의 나를 받아들이는 것이 행복의 시작이다.",
    author: "현대 격언",
    theme: 'peace',
    archetypes: ['innocent', 'sage'],
    sipsins: ['siksin', 'jeongin'],
    lifeStages: ['adult_mid', 'adult_late', 'senior_early'],
    mood: 'comforting'
  },
  {
    id: 43,
    korean: "욕심을 버리면 마음이 편해진다. 비워야 채워진다.",
    author: "불교 격언",
    theme: 'peace',
    archetypes: ['sage', 'innocent'],
    sipsins: ['jeongin', 'siksin'],
    lifeStages: ['senior_early', 'senior_mid', 'senior_late'],
    mood: 'reflective'
  },
  {
    id: 44,
    korean: "행복은 먼 곳에 있지 않다. 지금 이 순간에 있다.",
    author: "현대 격언",
    theme: 'peace',
    archetypes: ['innocent', 'jester'],
    sipsins: ['siksin', 'pyeonjae'],
    lifeStages: ['adult_mid', 'senior_early', 'senior_mid'],
    mood: 'comforting'
  },
  {
    id: 45,
    korean: "남의 행복을 시기하지 마라. 나만의 행복을 가꾸어라.",
    author: "현대 격언",
    theme: 'peace',
    archetypes: ['sage', 'caregiver'],
    sipsins: ['jeongin', 'jeongjae'],
    lifeStages: ['adult_early', 'adult_mid'],
    mood: 'reflective'
  },
  {
    id: 46,
    korean: "소박하게 살아라. 단순함 속에 진정한 풍요가 있다.",
    author: "현대 격언",
    theme: 'peace',
    archetypes: ['sage', 'innocent'],
    sipsins: ['jeongjae', 'jeongin'],
    lifeStages: ['senior_early', 'senior_mid', 'senior_late'],
    mood: 'comforting'
  },
  {
    id: 47,
    korean: "내려놓을 때 비로소 자유로워진다.",
    author: "불교 격언",
    theme: 'peace',
    archetypes: ['sage', 'magician'],
    sipsins: ['pyeonin', 'jeongin'],
    lifeStages: ['adult_late', 'senior_early', 'senior_mid'],
    mood: 'reflective'
  },
  {
    id: 48,
    korean: "웃으면 복이 온다. 미소가 최고의 화장이다.",
    author: "한국 속담",
    theme: 'peace',
    archetypes: ['jester', 'innocent', 'lover'],
    sipsins: ['siksin', 'pyeonjae'],
    lifeStages: ['adult_mid', 'senior_early'],
    mood: 'comforting'
  },

  // ========== 성장/발전 (Growth) ==========
  {
    id: 49,
    korean: "배움에는 끝이 없다. 평생 학습이 경쟁력이다.",
    author: "현대 격언",
    theme: 'growth',
    archetypes: ['sage', 'explorer'],
    sipsins: ['jeongin', 'pyeonin'],
    lifeStages: ['adult_early', 'adult_mid', 'adult_late'],
    mood: 'inspiring'
  },
  {
    id: 50,
    korean: "오늘의 나는 어제의 나보다 한 발 앞서 있어야 한다.",
    author: "현대 격언",
    theme: 'growth',
    archetypes: ['hero', 'explorer'],
    sipsins: ['geopjae', 'bijeon'],
    lifeStages: ['youth_early', 'youth_mid', 'adult_early'],
    mood: 'challenging'
  },
  {
    id: 51,
    korean: "변화를 두려워하지 마라. 변화 속에 기회가 있다.",
    author: "현대 격언",
    theme: 'growth',
    archetypes: ['explorer', 'magician'],
    sipsins: ['pyeonjae', 'sanggwan'],
    lifeStages: ['adult_early', 'adult_mid'],
    mood: 'inspiring'
  },
  {
    id: 52,
    korean: "독서는 정신의 양식이다. 책 속에 길이 있다.",
    original: "書中自有顔如玉 書中自有黃金屋",
    author: "중국 격언",
    theme: 'growth',
    archetypes: ['sage'],
    sipsins: ['jeongin', 'pyeonin'],
    lifeStages: ['youth_early', 'youth_mid', 'adult_early'],
    mood: 'inspiring'
  },
  {
    id: 53,
    korean: "위기는 곧 기회다. 어려움 속에서 성장한다.",
    original: "危機即機會",
    author: "동양 격언",
    theme: 'growth',
    archetypes: ['hero', 'magician'],
    sipsins: ['pyeongwan', 'geopjae'],
    lifeStages: ['adult_early', 'adult_mid'],
    mood: 'challenging'
  },
  {
    id: 54,
    korean: "경험이 최고의 스승이다. 실수해도 괜찮다.",
    author: "현대 격언",
    theme: 'growth',
    archetypes: ['explorer', 'jester'],
    sipsins: ['sanggwan', 'siksin'],
    lifeStages: ['youth_early', 'youth_mid'],
    mood: 'comforting'
  },
  {
    id: 55,
    korean: "자기 계발에 투자하라. 그것이 가장 확실한 투자다.",
    author: "현대 격언",
    theme: 'growth',
    archetypes: ['ruler', 'sage'],
    sipsins: ['jeongjae', 'jeongin'],
    lifeStages: ['youth_mid', 'adult_early'],
    mood: 'inspiring'
  },
  {
    id: 56,
    korean: "불편한 영역을 벗어나야 성장한다. 안주하지 마라.",
    author: "현대 격언",
    theme: 'growth',
    archetypes: ['explorer', 'hero', 'outlaw'],
    sipsins: ['geopjae', 'sanggwan'],
    lifeStages: ['youth_mid', 'adult_early', 'adult_mid'],
    mood: 'challenging'
  },

  // ========== 창의/표현 (Creativity) ==========
  {
    id: 57,
    korean: "상상력은 지식보다 중요하다. 지식에는 한계가 있지만 상상력은 무한하다.",
    original: "Imagination is more important than knowledge.",
    author: "Albert Einstein",
    authorKorean: "알베르트 아인슈타인",
    theme: 'creativity',
    archetypes: ['creator', 'magician'],
    sipsins: ['sanggwan', 'pyeonin'],
    lifeStages: ['youth_early', 'youth_mid', 'adult_early'],
    mood: 'inspiring'
  },
  {
    id: 58,
    korean: "예술은 삶을 아름답게 만든다. 창조하는 삶을 살아라.",
    author: "현대 격언",
    theme: 'creativity',
    archetypes: ['creator', 'lover'],
    sipsins: ['siksin', 'sanggwan'],
    lifeStages: ['adult_early', 'adult_mid', 'senior_early'],
    mood: 'inspiring'
  },
  {
    id: 59,
    korean: "남들과 다르게 생각하라. 차별화가 경쟁력이다.",
    author: "현대 격언",
    theme: 'creativity',
    archetypes: ['outlaw', 'creator', 'magician'],
    sipsins: ['sanggwan', 'pyeonin'],
    lifeStages: ['youth_mid', 'adult_early'],
    mood: 'challenging'
  },
  {
    id: 60,
    korean: "실패는 창조의 과정이다. 수많은 실패 끝에 성공이 탄생한다.",
    author: "현대 격언",
    theme: 'creativity',
    archetypes: ['creator', 'explorer'],
    sipsins: ['sanggwan', 'siksin'],
    lifeStages: ['youth_mid', 'adult_early'],
    mood: 'comforting'
  },
  {
    id: 61,
    korean: "자신만의 색깔을 가져라. 세상에 하나뿐인 당신의 가치를 믿어라.",
    author: "현대 격언",
    theme: 'creativity',
    archetypes: ['creator', 'outlaw'],
    sipsins: ['bijeon', 'sanggwan'],
    lifeStages: ['youth_early', 'youth_mid'],
    mood: 'inspiring'
  },
  {
    id: 62,
    korean: "모든 창조는 모방에서 시작한다. 그러나 거기서 멈추지 마라.",
    author: "현대 격언",
    theme: 'creativity',
    archetypes: ['creator', 'sage'],
    sipsins: ['jeongin', 'sanggwan'],
    lifeStages: ['youth_mid', 'adult_early'],
    mood: 'reflective'
  },
  {
    id: 63,
    korean: "열정 없이는 위대한 것을 이룰 수 없다.",
    original: "Nothing great was ever achieved without enthusiasm.",
    author: "Ralph Waldo Emerson",
    authorKorean: "랠프 왈도 에머슨",
    theme: 'creativity',
    archetypes: ['creator', 'hero', 'lover'],
    sipsins: ['siksin', 'geopjae'],
    lifeStages: ['youth_early', 'youth_mid', 'adult_early'],
    mood: 'inspiring'
  },
  {
    id: 64,
    korean: "규칙을 알아야 창의적으로 깰 수 있다.",
    author: "피카소",
    theme: 'creativity',
    archetypes: ['creator', 'outlaw', 'magician'],
    sipsins: ['sanggwan', 'pyeonin'],
    lifeStages: ['adult_early', 'adult_mid'],
    mood: 'reflective'
  },

  // ========== 리더십/영향력 (Leadership) ==========
  {
    id: 65,
    korean: "앞장서서 이끌어라. 말보다 행동으로 보여주어라.",
    author: "현대 격언",
    theme: 'leadership',
    archetypes: ['ruler', 'hero'],
    sipsins: ['pyeongwan', 'jeonggwan'],
    lifeStages: ['adult_early', 'adult_mid', 'adult_late'],
    mood: 'challenging'
  },
  {
    id: 66,
    korean: "섬기는 자가 진정한 리더다.",
    original: "The greatest among you will be your servant.",
    author: "성경",
    theme: 'leadership',
    archetypes: ['caregiver', 'ruler'],
    sipsins: ['jeonggwan', 'siksin'],
    lifeStages: ['adult_mid', 'adult_late'],
    mood: 'reflective'
  },
  {
    id: 67,
    korean: "결단력이 리더의 가장 중요한 덕목이다.",
    author: "현대 격언",
    theme: 'leadership',
    archetypes: ['ruler', 'hero'],
    sipsins: ['pyeongwan', 'geopjae'],
    lifeStages: ['adult_early', 'adult_mid'],
    mood: 'challenging'
  },
  {
    id: 68,
    korean: "책임지는 자만이 리더가 될 수 있다.",
    author: "현대 격언",
    theme: 'leadership',
    archetypes: ['ruler', 'caregiver'],
    sipsins: ['jeonggwan', 'jeongjae'],
    lifeStages: ['adult_mid', 'adult_late'],
    mood: 'reflective'
  },
  {
    id: 69,
    korean: "팀원의 성공이 곧 리더의 성공이다.",
    author: "현대 격언",
    theme: 'leadership',
    archetypes: ['caregiver', 'ruler'],
    sipsins: ['jeonggwan', 'siksin'],
    lifeStages: ['adult_mid', 'adult_late'],
    mood: 'inspiring'
  },
  {
    id: 70,
    korean: "비전을 제시하고 함께 가라. 혼자 가면 빠르지만 함께 가면 멀리 간다.",
    author: "아프리카 속담",
    theme: 'leadership',
    archetypes: ['ruler', 'sage'],
    sipsins: ['jeonggwan', 'pyeongwan'],
    lifeStages: ['adult_mid', 'adult_late'],
    mood: 'inspiring'
  },
  {
    id: 71,
    korean: "비판을 두려워하지 마라. 비판 없이는 성장할 수 없다.",
    author: "현대 격언",
    theme: 'leadership',
    archetypes: ['ruler', 'hero'],
    sipsins: ['pyeongwan', 'bijeon'],
    lifeStages: ['adult_early', 'adult_mid'],
    mood: 'challenging'
  },
  {
    id: 72,
    korean: "솔선수범이 최고의 교육이다.",
    author: "현대 격언",
    theme: 'leadership',
    archetypes: ['ruler', 'caregiver', 'sage'],
    sipsins: ['jeonggwan', 'jeongin'],
    lifeStages: ['adult_mid', 'adult_late'],
    mood: 'inspiring'
  },

  // ========== 균형/조화 (Balance) ==========
  {
    id: 73,
    korean: "일과 삶의 균형이 행복의 비결이다.",
    author: "현대 격언",
    theme: 'balance',
    archetypes: ['caregiver', 'sage'],
    sipsins: ['jeongjae', 'siksin'],
    lifeStages: ['adult_mid', 'adult_late'],
    mood: 'reflective'
  },
  {
    id: 74,
    korean: "과유불급이다. 지나침은 모자람과 같다.",
    original: "過猶不及",
    author: "공자",
    theme: 'balance',
    archetypes: ['sage', 'ruler'],
    sipsins: ['jeongjae', 'jeongin'],
    lifeStages: ['adult_mid', 'adult_late', 'senior_early'],
    mood: 'reflective'
  },
  {
    id: 75,
    korean: "몸과 마음의 균형을 유지하라. 건강이 최고의 재산이다.",
    author: "현대 격언",
    theme: 'balance',
    archetypes: ['caregiver', 'sage'],
    sipsins: ['jeongjae', 'jeongin'],
    lifeStages: ['adult_late', 'senior_early', 'senior_mid'],
    mood: 'comforting'
  },
  {
    id: 76,
    korean: "급하게 먹으면 체한다. 천천히 그러나 꾸준히 가라.",
    author: "현대 격언",
    theme: 'balance',
    archetypes: ['sage', 'caregiver'],
    sipsins: ['jeongin', 'jeongjae'],
    lifeStages: ['adult_early', 'adult_mid'],
    mood: 'comforting'
  },
  {
    id: 77,
    korean: "음양의 조화가 만물의 이치다. 밝음만 있으면 그림자가 없다.",
    author: "동양 철학",
    theme: 'balance',
    archetypes: ['sage', 'magician'],
    sipsins: ['pyeonin', 'jeongin'],
    lifeStages: ['adult_late', 'senior_early'],
    mood: 'reflective'
  },
  {
    id: 78,
    korean: "때로는 멈추는 것도 전진이다.",
    author: "현대 격언",
    theme: 'balance',
    archetypes: ['sage', 'innocent'],
    sipsins: ['jeongin', 'siksin'],
    lifeStages: ['adult_mid', 'adult_late', 'senior_early'],
    mood: 'comforting'
  },
  {
    id: 79,
    korean: "중용의 덕이 군자의 길이다.",
    original: "中庸之德 其至矣乎",
    author: "공자",
    theme: 'balance',
    archetypes: ['sage', 'ruler'],
    sipsins: ['jeonggwan', 'jeongin'],
    lifeStages: ['adult_mid', 'adult_late', 'senior_early'],
    mood: 'reflective'
  },
  {
    id: 80,
    korean: "인생은 마라톤이다. 처음부터 전력 질주하면 끝까지 못 간다.",
    author: "현대 격언",
    theme: 'balance',
    archetypes: ['sage', 'caregiver'],
    sipsins: ['jeongjae', 'jeongin'],
    lifeStages: ['adult_early', 'adult_mid'],
    mood: 'reflective'
  },

  // ========== 믿음/신뢰 (Faith) ==========
  {
    id: 81,
    korean: "믿음이 산을 옮긴다.",
    original: "Faith can move mountains.",
    author: "성경",
    theme: 'faith',
    archetypes: ['innocent', 'magician'],
    sipsins: ['jeongin', 'siksin'],
    lifeStages: ['adult_mid', 'senior_early'],
    mood: 'inspiring'
  },
  {
    id: 82,
    korean: "자신을 믿어라. 누구보다 당신을 잘 아는 것은 당신 자신이다.",
    author: "현대 격언",
    theme: 'faith',
    archetypes: ['hero', 'innocent'],
    sipsins: ['bijeon', 'geopjae'],
    lifeStages: ['youth_early', 'youth_mid', 'adult_early'],
    mood: 'inspiring'
  },
  {
    id: 83,
    korean: "신뢰는 쌓는 데 오래 걸리지만 무너지는 데는 순간이다.",
    author: "현대 격언",
    theme: 'faith',
    archetypes: ['caregiver', 'ruler'],
    sipsins: ['jeongjae', 'jeonggwan'],
    lifeStages: ['adult_early', 'adult_mid'],
    mood: 'reflective'
  },
  {
    id: 84,
    korean: "진실은 언젠가 반드시 밝혀진다. 정직이 최선의 정책이다.",
    original: "Honesty is the best policy.",
    author: "Benjamin Franklin",
    authorKorean: "벤자민 프랭클린",
    theme: 'faith',
    archetypes: ['sage', 'ruler'],
    sipsins: ['jeonggwan', 'jeongjae'],
    lifeStages: ['adult_early', 'adult_mid', 'adult_late'],
    mood: 'reflective'
  },
  {
    id: 85,
    korean: "하늘은 스스로 돕는 자를 돕는다.",
    original: "Heaven helps those who help themselves.",
    author: "서양 격언",
    theme: 'faith',
    archetypes: ['hero', 'ruler'],
    sipsins: ['bijeon', 'geopjae'],
    lifeStages: ['youth_mid', 'adult_early'],
    mood: 'inspiring'
  },
  {
    id: 86,
    korean: "기도하되 노를 저어라.",
    author: "러시아 속담",
    theme: 'faith',
    archetypes: ['sage', 'hero'],
    sipsins: ['jeongin', 'jeongjae'],
    lifeStages: ['adult_early', 'adult_mid'],
    mood: 'inspiring'
  },
  {
    id: 87,
    korean: "어두운 터널을 지나면 반드시 빛이 있다. 희망을 잃지 마라.",
    author: "현대 격언",
    theme: 'faith',
    archetypes: ['innocent', 'sage'],
    sipsins: ['siksin', 'jeongin'],
    lifeStages: ['adult_mid', 'senior_early'],
    mood: 'comforting'
  },
  {
    id: 88,
    korean: "인연을 믿어라. 만날 사람은 반드시 만나게 되어 있다.",
    author: "동양 격언",
    theme: 'faith',
    archetypes: ['lover', 'innocent'],
    sipsins: ['siksin', 'pyeonjae'],
    lifeStages: ['youth_mid', 'adult_early', 'adult_mid'],
    mood: 'comforting'
  },

  // ========== 자유/독립 (Freedom) ==========
  {
    id: 89,
    korean: "자유는 책임을 수반한다. 책임 없는 자유는 방종이다.",
    author: "현대 격언",
    theme: 'freedom',
    archetypes: ['outlaw', 'ruler'],
    sipsins: ['geopjae', 'jeonggwan'],
    lifeStages: ['youth_mid', 'adult_early'],
    mood: 'reflective'
  },
  {
    id: 90,
    korean: "자신의 길을 가라. 남의 눈치를 보지 마라.",
    author: "현대 격언",
    theme: 'freedom',
    archetypes: ['outlaw', 'explorer'],
    sipsins: ['bijeon', 'sanggwan'],
    lifeStages: ['youth_early', 'youth_mid', 'adult_early'],
    mood: 'inspiring'
  },
  {
    id: 91,
    korean: "경제적 자유가 진정한 자유의 시작이다.",
    author: "현대 격언",
    theme: 'freedom',
    archetypes: ['ruler', 'explorer'],
    sipsins: ['jeongjae', 'pyeonjae'],
    lifeStages: ['adult_early', 'adult_mid'],
    mood: 'challenging'
  },
  {
    id: 92,
    korean: "정신의 자유가 가장 소중하다. 생각을 가두지 마라.",
    author: "현대 격언",
    theme: 'freedom',
    archetypes: ['sage', 'outlaw', 'magician'],
    sipsins: ['pyeonin', 'sanggwan'],
    lifeStages: ['adult_mid', 'adult_late'],
    mood: 'reflective'
  },
  {
    id: 93,
    korean: "틀에 박힌 삶을 거부하라. 나만의 인생을 살아라.",
    author: "현대 격언",
    theme: 'freedom',
    archetypes: ['outlaw', 'creator', 'explorer'],
    sipsins: ['sanggwan', 'geopjae'],
    lifeStages: ['youth_early', 'youth_mid'],
    mood: 'challenging'
  },
  {
    id: 94,
    korean: "여행은 영혼을 자유롭게 한다.",
    author: "현대 격언",
    theme: 'freedom',
    archetypes: ['explorer', 'jester'],
    sipsins: ['pyeonjae', 'siksin'],
    lifeStages: ['adult_early', 'adult_mid', 'senior_early'],
    mood: 'inspiring'
  },
  {
    id: 95,
    korean: "구속에서 벗어나려면 먼저 내 마음의 감옥을 허물어라.",
    author: "현대 격언",
    theme: 'freedom',
    archetypes: ['magician', 'outlaw'],
    sipsins: ['pyeonin', 'sanggwan'],
    lifeStages: ['adult_mid', 'adult_late'],
    mood: 'reflective'
  },
  {
    id: 96,
    korean: "자유롭게 태어났으니 자유롭게 살아라.",
    author: "현대 격언",
    theme: 'freedom',
    archetypes: ['outlaw', 'explorer', 'innocent'],
    sipsins: ['bijeon', 'geopjae'],
    lifeStages: ['youth_early', 'youth_mid'],
    mood: 'inspiring'
  },

  // ========== 추가 명언들 ==========
  {
    id: 97,
    korean: "인생은 짧고 예술은 길다.",
    original: "Ars longa, vita brevis.",
    author: "Hippocrates",
    authorKorean: "히포크라테스",
    theme: 'wisdom',
    archetypes: ['creator', 'sage'],
    sipsins: ['sanggwan', 'pyeonin'],
    lifeStages: ['adult_mid', 'adult_late', 'senior_early'],
    mood: 'reflective'
  },
  {
    id: 98,
    korean: "미래를 예측하는 가장 좋은 방법은 미래를 만드는 것이다.",
    original: "The best way to predict the future is to create it.",
    author: "Peter Drucker",
    authorKorean: "피터 드러커",
    theme: 'success',
    archetypes: ['creator', 'ruler', 'magician'],
    sipsins: ['sanggwan', 'pyeongwan'],
    lifeStages: ['adult_early', 'adult_mid'],
    mood: 'inspiring'
  },
  {
    id: 99,
    korean: "매일 조금씩 나아지면 결국 대단한 성과를 이룬다.",
    author: "현대 격언",
    theme: 'growth',
    archetypes: ['hero', 'sage'],
    sipsins: ['jeongjae', 'jeongin'],
    lifeStages: ['youth_mid', 'adult_early', 'adult_mid'],
    mood: 'inspiring'
  },
  {
    id: 100,
    korean: "내 인생의 주인공은 나다. 누구도 대신 살아줄 수 없다.",
    author: "현대 격언",
    theme: 'freedom',
    archetypes: ['hero', 'outlaw', 'ruler'],
    sipsins: ['bijeon', 'pyeongwan'],
    lifeStages: ['youth_early', 'youth_mid', 'adult_early'],
    mood: 'inspiring'
  }
];

/**
 * 성향에 맞는 격언 찾기
 */
export function getMatchingQuotes(
  archetype: string,
  sipsin: string,
  lifeStage: string,
  limit: number = 3
): WisdomQuote[] {
  // 점수 계산하여 정렬
  const scored = WISDOM_QUOTES.map(quote => {
    let score = 0;

    // 원형 매칭 (가중치 3)
    if (quote.archetypes.includes(archetype)) score += 3;

    // 십신 매칭 (가중치 2)
    if (quote.sipsins.includes(sipsin)) score += 2;

    // 생애주기 매칭 (가중치 2)
    if (quote.lifeStages.includes(lifeStage)) score += 2;

    return { quote, score };
  });

  // 점수순 정렬 후 상위 N개 반환
  return scored
    .filter(s => s.score > 0)
    .sort((a, b) => b.score - a.score)
    .slice(0, limit)
    .map(s => s.quote);
}

/**
 * 랜덤 격언 가져오기 (성향 필터링 포함)
 */
export function getRandomQuote(
  archetype?: string,
  sipsin?: string,
  lifeStage?: string
): WisdomQuote {
  let candidates = WISDOM_QUOTES;

  // 필터링
  if (archetype || sipsin || lifeStage) {
    candidates = WISDOM_QUOTES.filter(q => {
      let match = true;
      if (archetype && !q.archetypes.includes(archetype)) match = false;
      if (sipsin && !q.sipsins.includes(sipsin)) match = false;
      if (lifeStage && !q.lifeStages.includes(lifeStage)) match = false;
      return match;
    });

    // 완전 일치가 없으면 부분 일치로
    if (candidates.length === 0) {
      candidates = WISDOM_QUOTES.filter(q =>
        (archetype && q.archetypes.includes(archetype)) ||
        (sipsin && q.sipsins.includes(sipsin)) ||
        (lifeStage && q.lifeStages.includes(lifeStage))
      );
    }

    // 그래도 없으면 전체에서
    if (candidates.length === 0) {
      candidates = WISDOM_QUOTES;
    }
  }

  const idx = Math.floor(Math.random() * candidates.length);
  return candidates[idx];
}

/**
 * 주제별 격언 가져오기
 */
export function getQuotesByTheme(theme: QuoteTheme): WisdomQuote[] {
  return WISDOM_QUOTES.filter(q => q.theme === theme);
}

/**
 * 분위기별 격언 가져오기
 */
export function getQuotesByMood(mood: QuoteMood): WisdomQuote[] {
  return WISDOM_QUOTES.filter(q => q.mood === mood);
}

/**
 * 오늘의 격언 (날짜 기반 고정)
 */
export function getTodayQuote(
  archetype?: string,
  sipsin?: string,
  lifeStage?: string
): WisdomQuote {
  const matchingQuotes = archetype || sipsin || lifeStage
    ? getMatchingQuotes(archetype || '', sipsin || '', lifeStage || '', 10)
    : WISDOM_QUOTES;

  const today = new Date();
  const dayOfYear = Math.floor(
    (today.getTime() - new Date(today.getFullYear(), 0, 0).getTime()) / 86400000
  );

  const idx = dayOfYear % matchingQuotes.length;
  return matchingQuotes[idx];
}
