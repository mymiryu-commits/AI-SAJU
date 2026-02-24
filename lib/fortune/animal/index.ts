// Korean/Chinese Zodiac Animal Fortune (띠 동물점)
// 12 animals cycle based on birth year

export interface AnimalInfo {
  id: string;
  emoji: string;
  name: { ko: string; ja: string; en: string };
  personality: { ko: string; ja: string; en: string };
  strengths: { ko: string[]; ja: string[]; en: string[] };
  compatible: string[]; // compatible animal IDs
  incompatible: string[]; // incompatible animal IDs
}

export const ZODIAC_ANIMALS: Record<string, AnimalInfo> = {
  rat: {
    id: 'rat',
    emoji: '🐀',
    name: { ko: '쥐', ja: 'ネズミ', en: 'Rat' },
    personality: {
      ko: '영리하고 재치가 넘치며, 적응력이 뛰어납니다. 사교적이고 매력적인 성격으로 사람들에게 인기가 많습니다.',
      ja: '賢くて機知に富み、適応力に優れています。社交的で魅力的な性格で人気があります。',
      en: 'Clever and resourceful with excellent adaptability. Social and charming personality that attracts others.',
    },
    strengths: {
      ko: ['영리함', '적응력', '사교성', '직감력'],
      ja: ['賢さ', '適応力', '社交性', '直感力'],
      en: ['Intelligence', 'Adaptability', 'Sociability', 'Intuition'],
    },
    compatible: ['dragon', 'monkey', 'ox'],
    incompatible: ['horse', 'rooster'],
  },
  ox: {
    id: 'ox',
    emoji: '🐂',
    name: { ko: '소', ja: '牛', en: 'Ox' },
    personality: {
      ko: '성실하고 인내심이 강하며, 책임감이 뛰어납니다. 묵묵히 자신의 길을 걸어가는 신뢰할 수 있는 사람입니다.',
      ja: '誠実で忍耐強く、責任感に優れています。黙々と自分の道を歩む信頼できる人です。',
      en: 'Diligent and patient with a strong sense of responsibility. A reliable person who steadily walks their own path.',
    },
    strengths: {
      ko: ['성실함', '인내심', '책임감', '신뢰감'],
      ja: ['誠実さ', '忍耐力', '責任感', '信頼感'],
      en: ['Diligence', 'Patience', 'Responsibility', 'Reliability'],
    },
    compatible: ['rat', 'snake', 'rooster'],
    incompatible: ['goat', 'horse'],
  },
  tiger: {
    id: 'tiger',
    emoji: '🐅',
    name: { ko: '호랑이', ja: '虎', en: 'Tiger' },
    personality: {
      ko: '용감하고 자신감이 넘치며, 리더십이 뛰어납니다. 정의감이 강하고 도전을 즐기는 모험가입니다.',
      ja: '勇敢で自信に満ち、リーダーシップに優れています。正義感が強く挑戦を楽しむ冒険家です。',
      en: 'Brave and confident with excellent leadership. An adventurer with a strong sense of justice who enjoys challenges.',
    },
    strengths: {
      ko: ['용기', '리더십', '정의감', '도전정신'],
      ja: ['勇気', 'リーダーシップ', '正義感', '挑戦精神'],
      en: ['Courage', 'Leadership', 'Justice', 'Adventurous spirit'],
    },
    compatible: ['horse', 'dog', 'pig'],
    incompatible: ['monkey', 'snake'],
  },
  rabbit: {
    id: 'rabbit',
    emoji: '🐇',
    name: { ko: '토끼', ja: 'ウサギ', en: 'Rabbit' },
    personality: {
      ko: '온화하고 섬세하며, 예술적 감각이 뛰어납니다. 평화를 사랑하고 주변을 편안하게 만드는 힘이 있습니다.',
      ja: '穏やかで繊細、芸術的感覚に優れています。平和を愛し、周りを安心させる力があります。',
      en: 'Gentle and delicate with outstanding artistic sense. Loves peace and has the power to make others comfortable.',
    },
    strengths: {
      ko: ['섬세함', '예술성', '평화로움', '외교력'],
      ja: ['繊細さ', '芸術性', '平和さ', '外交力'],
      en: ['Delicacy', 'Artistry', 'Peacefulness', 'Diplomacy'],
    },
    compatible: ['goat', 'pig', 'dog'],
    incompatible: ['rooster', 'rat'],
  },
  dragon: {
    id: 'dragon',
    emoji: '🐉',
    name: { ko: '용', ja: '龍', en: 'Dragon' },
    personality: {
      ko: '카리스마가 넘치고 야심이 큽니다. 열정적이고 에너지가 넘치며, 큰 꿈을 이루려는 의지가 강합니다.',
      ja: 'カリスマ性があり、野心的です。情熱的でエネルギッシュ、大きな夢を実現する意志が強いです。',
      en: 'Charismatic and ambitious. Passionate and energetic with a strong will to achieve big dreams.',
    },
    strengths: {
      ko: ['카리스마', '열정', '자신감', '창의력'],
      ja: ['カリスマ', '情熱', '自信', '創造力'],
      en: ['Charisma', 'Passion', 'Confidence', 'Creativity'],
    },
    compatible: ['rat', 'monkey', 'rooster'],
    incompatible: ['dog', 'rabbit'],
  },
  snake: {
    id: 'snake',
    emoji: '🐍',
    name: { ko: '뱀', ja: '蛇', en: 'Snake' },
    personality: {
      ko: '지혜롭고 통찰력이 뛰어나며, 신비로운 매력을 가지고 있습니다. 깊은 사고력과 직관으로 핵심을 꿰뚫습니다.',
      ja: '知恵深く洞察力に優れ、神秘的な魅力を持っています。深い思考力と直感で核心を突きます。',
      en: 'Wise and insightful with mysterious charm. Penetrates the core with deep thinking and intuition.',
    },
    strengths: {
      ko: ['지혜', '통찰력', '신비로움', '집중력'],
      ja: ['知恵', '洞察力', '神秘性', '集中力'],
      en: ['Wisdom', 'Insight', 'Mystery', 'Focus'],
    },
    compatible: ['ox', 'rooster', 'monkey'],
    incompatible: ['tiger', 'pig'],
  },
  horse: {
    id: 'horse',
    emoji: '🐎',
    name: { ko: '말', ja: '馬', en: 'Horse' },
    personality: {
      ko: '활발하고 자유로우며, 독립심이 강합니다. 에너지가 넘치고 어디서든 주목받는 존재입니다.',
      ja: '活発で自由、独立心が強いです。エネルギッシュでどこでも注目される存在です。',
      en: 'Lively and free-spirited with strong independence. Energetic and always the center of attention.',
    },
    strengths: {
      ko: ['활발함', '독립심', '열정', '행동력'],
      ja: ['活発さ', '独立心', '情熱', '行動力'],
      en: ['Liveliness', 'Independence', 'Passion', 'Action-oriented'],
    },
    compatible: ['tiger', 'goat', 'dog'],
    incompatible: ['rat', 'ox'],
  },
  goat: {
    id: 'goat',
    emoji: '🐑',
    name: { ko: '양', ja: '羊', en: 'Goat' },
    personality: {
      ko: '온순하고 창의적이며, 예술적 재능이 뛰어납니다. 따뜻한 마음씨로 주변을 감동시키는 힘이 있습니다.',
      ja: '温順で創造的、芸術的才能に優れています。温かい心で周りを感動させる力があります。',
      en: 'Gentle and creative with outstanding artistic talent. Has the warm heart to move people around them.',
    },
    strengths: {
      ko: ['창의성', '온순함', '예술성', '공감능력'],
      ja: ['創造性', '温順さ', '芸術性', '共感力'],
      en: ['Creativity', 'Gentleness', 'Artistry', 'Empathy'],
    },
    compatible: ['rabbit', 'horse', 'pig'],
    incompatible: ['ox', 'dog'],
  },
  monkey: {
    id: 'monkey',
    emoji: '🐒',
    name: { ko: '원숭이', ja: '猿', en: 'Monkey' },
    personality: {
      ko: '재치있고 영리하며, 유머 감각이 뛰어납니다. 빠른 두뇌 회전과 적응력으로 어떤 상황에서도 빛을 발합니다.',
      ja: '機知に富み賢く、ユーモアのセンスに優れています。素早い頭の回転と適応力でどんな状況でも輝きます。',
      en: 'Witty and clever with a great sense of humor. Shines in any situation with quick thinking and adaptability.',
    },
    strengths: {
      ko: ['재치', '영리함', '유머', '문제해결력'],
      ja: ['機知', '賢さ', 'ユーモア', '問題解決力'],
      en: ['Wit', 'Cleverness', 'Humor', 'Problem-solving'],
    },
    compatible: ['rat', 'dragon', 'snake'],
    incompatible: ['tiger', 'pig'],
  },
  rooster: {
    id: 'rooster',
    emoji: '🐓',
    name: { ko: '닭', ja: '鶏', en: 'Rooster' },
    personality: {
      ko: '근면하고 관찰력이 뛰어나며, 솔직한 성격입니다. 완벽을 추구하고 자신의 능력에 자부심을 가집니다.',
      ja: '勤勉で観察力に優れ、率直な性格です。完璧を追求し、自分の能力に誇りを持ちます。',
      en: 'Hardworking and observant with an honest personality. Pursues perfection and takes pride in their abilities.',
    },
    strengths: {
      ko: ['근면함', '관찰력', '솔직함', '완벽주의'],
      ja: ['勤勉さ', '観察力', '率直さ', '完璧主義'],
      en: ['Diligence', 'Observation', 'Honesty', 'Perfectionism'],
    },
    compatible: ['ox', 'snake', 'dragon'],
    incompatible: ['rabbit', 'rat'],
  },
  dog: {
    id: 'dog',
    emoji: '🐕',
    name: { ko: '개', ja: '犬', en: 'Dog' },
    personality: {
      ko: '충성스럽고 정직하며, 정의감이 강합니다. 친구와 가족을 위해 헌신적이며, 신뢰할 수 있는 동반자입니다.',
      ja: '忠実で正直、正義感が強いです。友人や家族のために献身的で、信頼できるパートナーです。',
      en: 'Loyal and honest with a strong sense of justice. Devoted to friends and family, a trustworthy companion.',
    },
    strengths: {
      ko: ['충성심', '정직함', '정의감', '헌신'],
      ja: ['忠誠心', '正直さ', '正義感', '献身'],
      en: ['Loyalty', 'Honesty', 'Justice', 'Devotion'],
    },
    compatible: ['tiger', 'rabbit', 'horse'],
    incompatible: ['dragon', 'goat'],
  },
  pig: {
    id: 'pig',
    emoji: '🐷',
    name: { ko: '돼지', ja: '猪', en: 'Pig' },
    personality: {
      ko: '관대하고 낙천적이며, 순수한 마음을 가지고 있습니다. 베풀기를 좋아하고 주변에 행복을 전파하는 사람입니다.',
      ja: '寛大で楽天的、純粋な心を持っています。施すことが好きで、周りに幸福を広める人です。',
      en: 'Generous and optimistic with a pure heart. Loves to give and spreads happiness to those around them.',
    },
    strengths: {
      ko: ['관대함', '낙천성', '순수함', '풍요로움'],
      ja: ['寛大さ', '楽天性', '純粋さ', '豊かさ'],
      en: ['Generosity', 'Optimism', 'Purity', 'Abundance'],
    },
    compatible: ['tiger', 'rabbit', 'goat'],
    incompatible: ['snake', 'monkey'],
  },
};

const ANIMAL_ORDER = [
  'rat', 'ox', 'tiger', 'rabbit', 'dragon', 'snake',
  'horse', 'goat', 'monkey', 'rooster', 'dog', 'pig',
] as const;

/**
 * Get zodiac animal based on birth year
 * The Chinese zodiac cycles every 12 years starting from Rat (1924, 1936, 1948...)
 */
export function getAnimalByYear(year: number): AnimalInfo {
  const index = ((year - 4) % 12 + 12) % 12; // 4 AD was a Rat year
  return ZODIAC_ANIMALS[ANIMAL_ORDER[index]];
}

/**
 * Get compatibility between two zodiac animals
 */
export function getAnimalCompatibility(
  animal1Id: string,
  animal2Id: string
): { score: number; level: 'great' | 'good' | 'neutral' | 'challenging' } {
  const animal1 = ZODIAC_ANIMALS[animal1Id];
  if (!animal1) return { score: 50, level: 'neutral' };

  if (animal1.compatible.includes(animal2Id)) {
    return { score: 90, level: 'great' };
  }
  if (animal1.incompatible.includes(animal2Id)) {
    return { score: 30, level: 'challenging' };
  }
  return { score: 60, level: 'good' };
}
