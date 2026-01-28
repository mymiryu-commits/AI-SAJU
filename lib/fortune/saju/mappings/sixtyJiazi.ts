/**
 * 60갑자 매핑 시스템
 *
 * 60갑자(六十甲子)는 10천간과 12지지의 조합으로
 * 각각 고유한 상징과 의미를 가집니다.
 */

// 60갑자 타입 정의
export interface SixtyJiaziInfo {
  jiazi: string;           // 갑자 (예: '甲子')
  korean: string;          // 한글 (예: '갑자')
  animal: string;          // 상징 동물
  animalKorean: string;    // 동물 한글명
  nature: string;          // 자연 심볼
  color: string;           // 대표 색상
  keywords: string[];      // 핵심 키워드
  personality: string;     // 성격 설명
  destiny: string;         // 운명 설명
  year: number[];          // 해당 연도 (예시)
}

// 천간 배열
export const HEAVENLY_STEMS = ['甲', '乙', '丙', '丁', '戊', '己', '庚', '辛', '壬', '癸'];
export const HEAVENLY_STEMS_KOREAN = ['갑', '을', '병', '정', '무', '기', '경', '신', '임', '계'];

// 지지 배열
export const EARTHLY_BRANCHES = ['子', '丑', '寅', '卯', '辰', '巳', '午', '未', '申', '酉', '戌', '亥'];
export const EARTHLY_BRANCHES_KOREAN = ['자', '축', '인', '묘', '진', '사', '오', '미', '신', '유', '술', '해'];

// 지지별 띠 동물
export const ZODIAC_ANIMALS: Record<string, { animal: string; korean: string }> = {
  '子': { animal: 'rat', korean: '쥐' },
  '丑': { animal: 'ox', korean: '소' },
  '寅': { animal: 'tiger', korean: '호랑이' },
  '卯': { animal: 'rabbit', korean: '토끼' },
  '辰': { animal: 'dragon', korean: '용' },
  '巳': { animal: 'snake', korean: '뱀' },
  '午': { animal: 'horse', korean: '말' },
  '未': { animal: 'sheep', korean: '양' },
  '申': { animal: 'monkey', korean: '원숭이' },
  '酉': { animal: 'rooster', korean: '닭' },
  '戌': { animal: 'dog', korean: '개' },
  '亥': { animal: 'pig', korean: '돼지' }
};

// 60갑자 상세 매핑
export const SIXTY_JIAZI_MAPPING: Record<string, SixtyJiaziInfo> = {
  // 甲 계열 (목)
  '甲子': {
    jiazi: '甲子',
    korean: '갑자',
    animal: '청서',
    animalKorean: '청서(靑鼠) - 푸른 쥐',
    nature: '새벽 숲의 첫 번째 빛',
    color: '#2E8B57',
    keywords: ['시작', '개척', '리더십'],
    personality: '새벽을 여는 리더의 기상. 어디서든 첫 번째가 되고자 하며, 남들이 가지 않는 길을 개척합니다.',
    destiny: '큰 뜻을 품고 태어났습니다. 평범한 삶보다는 무언가를 이루어내는 인생이 당신의 운명입니다.',
    year: [1924, 1984, 2044]
  },
  '甲寅': {
    jiazi: '甲寅',
    korean: '갑인',
    animal: '청호',
    animalKorean: '청호(靑虎) - 푸른 호랑이',
    nature: '우뚝 선 소나무',
    color: '#228B22',
    keywords: ['용맹', '독립', '권위'],
    personality: '산중왕의 기품. 어떤 상황에서도 굽히지 않는 당당함이 있습니다.',
    destiny: '리더로서의 운명을 타고났습니다. 많은 이들이 당신을 따르게 될 것입니다.',
    year: [1914, 1974, 2034]
  },
  '甲辰': {
    jiazi: '甲辰',
    korean: '갑진',
    animal: '청룡',
    animalKorean: '청룡(靑龍) - 푸른 용',
    nature: '구름 위로 솟는 청룡',
    color: '#006400',
    keywords: ['비상', '성공', '권력'],
    personality: '하늘을 나는 용의 기운. 큰 꿈을 품고 그것을 현실로 만드는 힘이 있습니다.',
    destiny: '때가 되면 하늘로 오르는 운명. 40대 이후 대성할 상입니다.',
    year: [1904, 1964, 2024]
  },
  '甲午': {
    jiazi: '甲午',
    korean: '갑오',
    animal: '청마',
    animalKorean: '청마(靑馬) - 푸른 말',
    nature: '초원을 달리는 천리마',
    color: '#32CD32',
    keywords: ['속도', '자유', '활력'],
    personality: '멈출 줄 모르는 에너지. 한 곳에 머무르기보다 끊임없이 움직이며 성장합니다.',
    destiny: '바람처럼 빠르게 성공하는 운명. 젊은 시절 일찍 두각을 나타냅니다.',
    year: [1954, 2014, 2074]
  },
  '甲申': {
    jiazi: '甲申',
    korean: '갑신',
    animal: '청후',
    animalKorean: '청후(靑猴) - 푸른 원숭이',
    nature: '나무 위 재빠른 지략가',
    color: '#3CB371',
    keywords: ['영민', '재치', '적응력'],
    personality: '머리 회전이 빠르고 임기응변에 능합니다. 어떤 상황도 유연하게 헤쳐나갑니다.',
    destiny: '지혜로 성공하는 운명. 사업과 재테크에 유리합니다.',
    year: [1944, 2004, 2064]
  },
  '甲戌': {
    jiazi: '甲戌',
    korean: '갑술',
    animal: '청구',
    animalKorean: '청구(靑狗) - 푸른 개',
    nature: '산을 지키는 의로운 수호자',
    color: '#2F4F4F',
    keywords: ['충성', '정의', '신뢰'],
    personality: '한번 맺은 인연은 끝까지 지킵니다. 의리와 신뢰의 사람입니다.',
    destiny: '늦되 크게 성공하는 운명. 중년 이후 기반이 단단해집니다.',
    year: [1934, 1994, 2054]
  },

  // 乙 계열 (목)
  '乙丑': {
    jiazi: '乙丑',
    korean: '을축',
    animal: '청우',
    animalKorean: '청우(靑牛) - 푸른 소',
    nature: '봄 들판의 새싹',
    color: '#8FBC8F',
    keywords: ['인내', '성실', '축적'],
    personality: '느리지만 확실하게 나아갑니다. 꾸준함이 가장 큰 무기입니다.',
    destiny: '차곡차곡 쌓아 결국 성공하는 운명. 재물복이 강합니다.',
    year: [1925, 1985, 2045]
  },
  '乙卯': {
    jiazi: '乙卯',
    korean: '을묘',
    animal: '청토',
    animalKorean: '청토(靑兎) - 푸른 토끼',
    nature: '숲속 고요한 난초',
    color: '#66CDAA',
    keywords: ['우아함', '지혜', '평화'],
    personality: '부드럽지만 단단합니다. 조용히 자신의 길을 가는 현자의 모습이 있습니다.',
    destiny: '지혜로 성공하는 운명. 학문이나 예술에서 빛납니다.',
    year: [1915, 1975, 2035]
  },
  '乙巳': {
    jiazi: '乙巳',
    korean: '을사',
    animal: '청사',
    animalKorean: '청사(靑蛇) - 푸른 뱀',
    nature: '풀숲에 숨은 지혜의 뱀',
    color: '#98FB98',
    keywords: ['통찰', '변화', '재생'],
    personality: '상황을 꿰뚫어보는 직관력이 있습니다. 필요할 때 완전히 변신할 수 있습니다.',
    destiny: '위기를 기회로 만드는 운명. 역경을 통해 더 강해집니다.',
    year: [1905, 1965, 2025]
  },
  '乙未': {
    jiazi: '乙未',
    korean: '을미',
    animal: '청양',
    animalKorean: '청양(靑羊) - 푸른 양',
    nature: '푸른 초원의 평화로운 양',
    color: '#90EE90',
    keywords: ['온화', '예술', '조화'],
    personality: '다정하고 감성이 풍부합니다. 예술적 감각이 뛰어납니다.',
    destiny: '예술과 문화로 성공하는 운명. 아름다운 것을 만들어냅니다.',
    year: [1955, 2015, 2075]
  },
  '乙酉': {
    jiazi: '乙酉',
    korean: '을유',
    animal: '청계',
    animalKorean: '청계(靑鷄) - 푸른 닭',
    nature: '새벽을 알리는 푸른 수탉',
    color: '#7CFC00',
    keywords: ['근면', '정확', '시간'],
    personality: '부지런하고 정확합니다. 시간 관리의 달인입니다.',
    destiny: '성실함으로 성공하는 운명. 차곡차곡 쌓아 큰 성취를 이룹니다.',
    year: [1945, 2005, 2065]
  },
  '乙亥': {
    jiazi: '乙亥',
    korean: '을해',
    animal: '청저',
    animalKorean: '청저(靑猪) - 푸른 돼지',
    nature: '숲속 풍요로운 땅',
    color: '#00FA9A',
    keywords: ['복', '풍요', '낙천'],
    personality: '복이 많고 낙천적입니다. 어디서든 풍요를 만들어냅니다.',
    destiny: '복록이 따르는 운명. 큰 노력 없이도 좋은 기회가 옵니다.',
    year: [1935, 1995, 2055]
  },

  // 丙 계열 (화)
  '丙子': {
    jiazi: '丙子',
    korean: '병자',
    animal: '적서',
    animalKorean: '적서(赤鼠) - 붉은 쥐',
    nature: '밤하늘의 붉은 별',
    color: '#FF4500',
    keywords: ['열정', '민첩', '기회'],
    personality: '열정적이고 기회를 잡는 감각이 뛰어납니다.',
    destiny: '열정으로 성공하는 운명. 젊은 시절 빛나는 기회가 옵니다.',
    year: [1936, 1996, 2056]
  },
  '丙寅': {
    jiazi: '丙寅',
    korean: '병인',
    animal: '적호',
    animalKorean: '적호(赤虎) - 붉은 호랑이',
    nature: '타오르는 태양 아래 호랑이',
    color: '#FF6347',
    keywords: ['위엄', '열정', '리더십'],
    personality: '불같은 카리스마. 사람들이 자연스럽게 따릅니다.',
    destiny: '영웅적 삶의 운명. 큰 업적을 남길 수 있습니다.',
    year: [1926, 1986, 2046]
  },
  '丙辰': {
    jiazi: '丙辰',
    korean: '병진',
    animal: '적룡',
    animalKorean: '적룡(赤龍) - 붉은 용',
    nature: '화염 속에서 승천하는 용',
    color: '#DC143C',
    keywords: ['권력', '성공', '변혁'],
    personality: '강렬한 존재감. 어디서든 중심이 됩니다.',
    destiny: '정치나 사업에서 대성하는 운명. 40대에 절정을 맞습니다.',
    year: [1916, 1976, 2036]
  },
  '丙午': {
    jiazi: '丙午',
    korean: '병오',
    animal: '적마',
    animalKorean: '적마(赤馬) - 붉은 말',
    nature: '한낮의 타오르는 태양',
    color: '#FF0000',
    keywords: ['정열', '속도', '성취'],
    personality: '가장 뜨거운 열정. 무엇이든 빠르게 이루어냅니다.',
    destiny: '빠른 성공의 운명. 젊어서 빛나지만 중년의 관리가 중요합니다.',
    year: [1906, 1966, 2026]
  },
  '丙申': {
    jiazi: '丙申',
    korean: '병신',
    animal: '적후',
    animalKorean: '적후(赤猴) - 붉은 원숭이',
    nature: '불빛 아래 재주 넘는 원숭이',
    color: '#FF7F50',
    keywords: ['재치', '열정', '연예'],
    personality: '끼가 넘치고 사람들을 즐겁게 합니다.',
    destiny: '예능이나 사업에서 성공하는 운명. 인기운이 강합니다.',
    year: [1956, 2016, 2076]
  },
  '丙戌': {
    jiazi: '丙戌',
    korean: '병술',
    animal: '적구',
    animalKorean: '적구(赤狗) - 붉은 개',
    nature: '불의 수호자',
    color: '#B22222',
    keywords: ['충직', '열정', '보호'],
    personality: '뜨거운 충성심. 사랑하는 이들을 끝까지 지킵니다.',
    destiny: '신뢰와 열정으로 성공하는 운명. 조직의 핵심이 됩니다.',
    year: [1946, 2006, 2066]
  },

  // 丁 계열 (화)
  '丁丑': {
    jiazi: '丁丑',
    korean: '정축',
    animal: '적우',
    animalKorean: '적우(赤牛) - 붉은 소',
    nature: '등불 아래 묵묵한 소',
    color: '#CD5C5C',
    keywords: ['헌신', '인내', '따뜻함'],
    personality: '조용히 타오르는 헌신. 묵묵히 일하며 주변을 따뜻하게 합니다.',
    destiny: '노력이 보상받는 운명. 중년에 결실을 맺습니다.',
    year: [1937, 1997, 2057]
  },
  '丁卯': {
    jiazi: '丁卯',
    korean: '정묘',
    animal: '적토',
    animalKorean: '적토(赤兎) - 붉은 토끼',
    nature: '촛불 곁의 따뜻한 토끼',
    color: '#E9967A',
    keywords: ['섬세', '예술', '감성'],
    personality: '섬세하고 감성적입니다. 예술적 재능이 뛰어납니다.',
    destiny: '예술이나 문학으로 성공하는 운명. 감동을 주는 사람입니다.',
    year: [1927, 1987, 2047]
  },
  '丁巳': {
    jiazi: '丁巳',
    korean: '정사',
    animal: '적사',
    animalKorean: '적사(赤蛇) - 붉은 뱀',
    nature: '붉게 타오르는 촛불',
    color: '#FA8072',
    keywords: ['직관', '열정', '신비'],
    personality: '강한 직관력과 신비로운 매력이 있습니다.',
    destiny: '특별한 재능으로 성공하는 운명. 사람들을 끌어당기는 힘이 있습니다.',
    year: [1917, 1977, 2037]
  },
  '丁未': {
    jiazi: '丁未',
    korean: '정미',
    animal: '적양',
    animalKorean: '적양(赤羊) - 붉은 양',
    nature: '석양 아래 따뜻한 양',
    color: '#F08080',
    keywords: ['온화', '봉사', '사랑'],
    personality: '따뜻한 마음으로 주변을 돌봅니다.',
    destiny: '사람을 돕는 일로 성공하는 운명. 교육이나 의료에 적합합니다.',
    year: [1907, 1967, 2027]
  },
  '丁酉': {
    jiazi: '丁酉',
    korean: '정유',
    animal: '적계',
    animalKorean: '적계(赤鷄) - 붉은 닭',
    nature: '아침 햇살을 받는 닭',
    color: '#FFA07A',
    keywords: ['정확', '열정', '시작'],
    personality: '새로운 시작을 알리는 존재. 정확하고 열정적입니다.',
    destiny: '새벽을 여는 운명. 새로운 분야를 개척합니다.',
    year: [1957, 2017, 2077]
  },
  '丁亥': {
    jiazi: '丁亥',
    korean: '정해',
    animal: '적저',
    animalKorean: '적저(赤猪) - 붉은 돼지',
    nature: '화롯가의 복스러운 돼지',
    color: '#FF6B6B',
    keywords: ['풍요', '따뜻', '복'],
    personality: '따뜻하고 복이 많습니다. 어디서든 풍요를 가져옵니다.',
    destiny: '복과 풍요의 운명. 물질적 풍요와 정서적 따뜻함을 모두 가집니다.',
    year: [1947, 2007, 2067]
  },

  // 戊 계열 (토)
  '戊子': {
    jiazi: '戊子',
    korean: '무자',
    animal: '황서',
    animalKorean: '황서(黃鼠) - 황금 쥐',
    nature: '황금빛 들판의 쥐',
    color: '#DAA520',
    keywords: ['재물', '기회', '저축'],
    personality: '재물을 모으는 타고난 감각이 있습니다.',
    destiny: '재물복이 강한 운명. 부를 축적할 수 있습니다.',
    year: [1948, 2008, 2068]
  },
  '戊寅': {
    jiazi: '戊寅',
    korean: '무인',
    animal: '황호',
    animalKorean: '황호(黃虎) - 황금 호랑이',
    nature: '산 위의 당당한 황금 호랑이',
    color: '#B8860B',
    keywords: ['권위', '안정', '리더십'],
    personality: '든든하고 당당합니다. 자연스러운 리더입니다.',
    destiny: '높은 지위에 오르는 운명. 조직의 수장이 됩니다.',
    year: [1938, 1998, 2058]
  },
  '戊辰': {
    jiazi: '戊辰',
    korean: '무진',
    animal: '황룡',
    animalKorean: '황룡(黃龍) - 황금 용',
    nature: '대지 위에 군림하는 황룡',
    color: '#FFD700',
    keywords: ['권력', '재물', '성공'],
    personality: '제왕의 기운. 최고의 자리를 향합니다.',
    destiny: '대업을 이루는 운명. 정치나 사업에서 정점에 오릅니다.',
    year: [1928, 1988, 2048]
  },
  '戊午': {
    jiazi: '戊午',
    korean: '무오',
    animal: '황마',
    animalKorean: '황마(黃馬) - 황금 말',
    nature: '황금빛 초원을 달리는 말',
    color: '#F0E68C',
    keywords: ['행동력', '재물', '성취'],
    personality: '에너지가 넘치고 실행력이 강합니다.',
    destiny: '행동으로 성공하는 운명. 중년에 절정을 맞습니다.',
    year: [1918, 1978, 2038]
  },
  '戊申': {
    jiazi: '戊申',
    korean: '무신',
    animal: '황후',
    animalKorean: '황후(黃猴) - 황금 원숭이',
    nature: '황금 과일을 든 원숭이',
    color: '#EEE8AA',
    keywords: ['지혜', '재물', '재주'],
    personality: '영리하고 재주가 많습니다. 돈 버는 감각이 탁월합니다.',
    destiny: '지혜로 부를 쌓는 운명. 사업에서 성공합니다.',
    year: [1908, 1968, 2028]
  },
  '戊戌': {
    jiazi: '戊戌',
    korean: '무술',
    animal: '황구',
    animalKorean: '황구(黃狗) - 황금 개',
    nature: '황금빛 산을 지키는 개',
    color: '#BDB76B',
    keywords: ['신뢰', '안정', '수호'],
    personality: '믿음직하고 흔들리지 않습니다.',
    destiny: '안정 속에서 성공하는 운명. 부동산이나 기반 사업에 유리합니다.',
    year: [1958, 2018, 2078]
  },

  // 己 계열 (토)
  '己丑': {
    jiazi: '己丑',
    korean: '기축',
    animal: '황우',
    animalKorean: '황우(黃牛) - 황금 소',
    nature: '비옥한 황토 밭의 소',
    color: '#CD853F',
    keywords: ['근면', '축적', '안정'],
    personality: '성실하게 일하며 차곡차곡 모읍니다.',
    destiny: '노력의 결실을 맛보는 운명. 땅이나 부동산과 인연이 깊습니다.',
    year: [1949, 2009, 2069]
  },
  '己卯': {
    jiazi: '己卯',
    korean: '기묘',
    animal: '황토',
    animalKorean: '황토(黃兎) - 황금 토끼',
    nature: '화사한 꽃밭의 토끼',
    color: '#DEB887',
    keywords: ['조화', '감성', '풍요'],
    personality: '감성이 풍부하고 조화를 이룹니다.',
    destiny: '예술과 풍요를 누리는 운명. 안정된 행복을 찾습니다.',
    year: [1939, 1999, 2059]
  },
  '己巳': {
    jiazi: '己巳',
    korean: '기사',
    animal: '황사',
    animalKorean: '황사(黃蛇) - 황금 뱀',
    nature: '황토 언덕의 지혜로운 뱀',
    color: '#D2691E',
    keywords: ['지혜', '축적', '변화'],
    personality: '지혜롭게 기회를 포착하고 재물을 모읍니다.',
    destiny: '지혜로 재물을 모으는 운명. 투자에 능합니다.',
    year: [1929, 1989, 2049]
  },
  '己未': {
    jiazi: '己未',
    korean: '기미',
    animal: '황양',
    animalKorean: '황양(黃羊) - 황금 양',
    nature: '풍요로운 들판의 양',
    color: '#F5DEB3',
    keywords: ['온화', '풍요', '예술'],
    personality: '온화하고 풍요로운 삶을 만듭니다.',
    destiny: '평화롭고 풍요로운 운명. 농업이나 식품업에 적합합니다.',
    year: [1919, 1979, 2039]
  },
  '己酉': {
    jiazi: '己酉',
    korean: '기유',
    animal: '황계',
    animalKorean: '황계(黃鷄) - 황금 닭',
    nature: '황금알을 낳는 닭',
    color: '#FFEFD5',
    keywords: ['근면', '재물', '수확'],
    personality: '부지런히 일하여 풍요를 만들어냅니다.',
    destiny: '꾸준한 노력으로 부를 쌓는 운명. 재물복이 따릅니다.',
    year: [1909, 1969, 2029]
  },
  '己亥': {
    jiazi: '己亥',
    korean: '기해',
    animal: '황저',
    animalKorean: '황저(黃猪) - 황금 돼지',
    nature: '풍요로운 황금 돼지',
    color: '#FFE4B5',
    keywords: ['복', '풍요', '낙관'],
    personality: '복이 많고 풍요로운 기운을 가집니다.',
    destiny: '타고난 복으로 풍요로운 운명. 무엇을 해도 잘 됩니다.',
    year: [1959, 2019, 2079]
  },

  // 庚 계열 (금)
  '庚子': {
    jiazi: '庚子',
    korean: '경자',
    animal: '백서',
    animalKorean: '백서(白鼠) - 흰 쥐',
    nature: '달빛 아래 빛나는 쥐',
    color: '#C0C0C0',
    keywords: ['민첩', '결단', '기회'],
    personality: '빠른 판단력과 결단력이 있습니다.',
    destiny: '기회를 잡아 성공하는 운명. 순간의 결단이 인생을 바꿉니다.',
    year: [1960, 2020, 2080]
  },
  '庚寅': {
    jiazi: '庚寅',
    korean: '경인',
    animal: '백호',
    animalKorean: '백호(白虎) - 흰 호랑이',
    nature: '달빛 아래 포효하는 백호',
    color: '#F5F5F5',
    keywords: ['위엄', '결단', '권위'],
    personality: '날카로운 결단력과 당당한 위엄이 있습니다.',
    destiny: '강인한 리더의 운명. 어려운 상황에서 빛을 발합니다.',
    year: [1950, 2010, 2070]
  },
  '庚辰': {
    jiazi: '庚辰',
    korean: '경진',
    animal: '백룡',
    animalKorean: '백룡(白龍) - 흰 용',
    nature: '구름 사이 빛나는 백룡',
    color: '#E8E8E8',
    keywords: ['권력', '변화', '성공'],
    personality: '강력한 변화의 힘을 가지고 있습니다.',
    destiny: '권력과 성공을 쥐는 운명. 하지만 검소함을 잊지 말아야 합니다.',
    year: [1940, 2000, 2060]
  },
  '庚午': {
    jiazi: '庚午',
    korean: '경오',
    animal: '백마',
    animalKorean: '백마(白馬) - 흰 말',
    nature: '달리는 순백의 천마',
    color: '#FFFAFA',
    keywords: ['속도', '결단', '성취'],
    personality: '빠르게 결정하고 빠르게 실행합니다.',
    destiny: '속전속결의 운명. 젊어서 크게 성공합니다.',
    year: [1930, 1990, 2050]
  },
  '庚申': {
    jiazi: '庚申',
    korean: '경신',
    animal: '백후',
    animalKorean: '백후(白猴) - 흰 원숭이',
    nature: '달빛 아래 재주 부리는 원숭이',
    color: '#DCDCDC',
    keywords: ['영리', '결단', '기술'],
    personality: '뛰어난 두뇌와 기술력을 가졌습니다.',
    destiny: '기술이나 전문직으로 성공하는 운명. 독자적인 길을 갑니다.',
    year: [1920, 1980, 2040]
  },
  '庚戌': {
    jiazi: '庚戌',
    korean: '경술',
    animal: '백구',
    animalKorean: '백구(白狗) - 흰 개',
    nature: '달빛 아래 지키는 충직한 개',
    color: '#D3D3D3',
    keywords: ['충성', '결단', '수호'],
    personality: '원칙을 지키며 충직합니다.',
    destiny: '신뢰로 성공하는 운명. 법이나 보안 분야에 적합합니다.',
    year: [1910, 1970, 2030]
  },

  // 辛 계열 (금)
  '辛丑': {
    jiazi: '辛丑',
    korean: '신축',
    animal: '백우',
    animalKorean: '백우(白牛) - 흰 소',
    nature: '서리 맞은 들판의 순백 소',
    color: '#FFFFF0',
    keywords: ['순수', '인내', '고고함'],
    personality: '순수하고 고고합니다. 쉽게 타협하지 않습니다.',
    destiny: '진정성으로 인정받는 운명. 늦되 확실한 성공을 합니다.',
    year: [1961, 2021, 2081]
  },
  '辛卯': {
    jiazi: '辛卯',
    korean: '신묘',
    animal: '백토',
    animalKorean: '백토(白兎) - 흰 토끼',
    nature: '달 위에 앉은 옥토끼',
    color: '#FFF5EE',
    keywords: ['섬세', '예술', '순수'],
    personality: '섬세하고 예술적 감각이 뛰어납니다.',
    destiny: '예술이나 디자인으로 성공하는 운명. 아름다움을 창조합니다.',
    year: [1951, 2011, 2071]
  },
  '辛巳': {
    jiazi: '辛巳',
    korean: '신사',
    animal: '백사',
    animalKorean: '백사(白蛇) - 흰 뱀',
    nature: '달빛에 비친 은빛 뱀',
    color: '#F8F8FF',
    keywords: ['직관', '변화', '재생'],
    personality: '날카로운 직관력과 변신의 능력이 있습니다.',
    destiny: '위기를 넘기며 성장하는 운명. 변화에 강합니다.',
    year: [1941, 2001, 2061]
  },
  '辛未': {
    jiazi: '辛未',
    korean: '신미',
    animal: '백양',
    animalKorean: '백양(白羊) - 흰 양',
    nature: '눈 덮인 산의 순백 양',
    color: '#FFFAF0',
    keywords: ['순수', '평화', '예술'],
    personality: '순수하고 평화를 사랑합니다.',
    destiny: '예술과 봉사로 빛나는 운명. 사람들에게 감동을 줍니다.',
    year: [1931, 1991, 2051]
  },
  '辛酉': {
    jiazi: '辛酉',
    korean: '신유',
    animal: '백계',
    animalKorean: '백계(白鷄) - 흰 닭',
    nature: '새벽 서리 위의 순백 닭',
    color: '#FAEBD7',
    keywords: ['정확', '순수', '완벽'],
    personality: '정확하고 완벽을 추구합니다.',
    destiny: '전문성으로 인정받는 운명. 장인의 경지에 오릅니다.',
    year: [1921, 1981, 2041]
  },
  '辛亥': {
    jiazi: '辛亥',
    korean: '신해',
    animal: '백저',
    animalKorean: '백저(白猪) - 흰 돼지',
    nature: '깨끗한 눈 위의 순백 돼지',
    color: '#FAF0E6',
    keywords: ['순수', '복', '풍요'],
    personality: '순수하고 복이 많습니다.',
    destiny: '깨끗한 마음으로 복을 받는 운명. 주변에 좋은 일이 생깁니다.',
    year: [1911, 1971, 2031]
  },

  // 壬 계열 (수)
  '壬子': {
    jiazi: '壬子',
    korean: '임자',
    animal: '흑서',
    animalKorean: '흑서(黑鼠) - 검은 쥐',
    nature: '깊은 밤 고요한 물가의 쥐',
    color: '#2F4F4F',
    keywords: ['지혜', '깊이', '기회'],
    personality: '깊은 지혜와 직관력을 가졌습니다.',
    destiny: '지혜로 세상을 읽는 운명. 투자나 기획에 뛰어납니다.',
    year: [1972, 2032, 2092]
  },
  '壬寅': {
    jiazi: '壬寅',
    korean: '임인',
    animal: '흑호',
    animalKorean: '흑호(黑虎) - 검은 호랑이',
    nature: '물가에서 포효하는 검은 호랑이',
    color: '#191970',
    keywords: ['위엄', '지혜', '권력'],
    personality: '깊은 지혜와 강한 카리스마를 가졌습니다.',
    destiny: '지략으로 세상을 움직이는 운명. 참모 역할에 뛰어납니다.',
    year: [1962, 2022, 2082]
  },
  '壬辰': {
    jiazi: '壬辰',
    korean: '임진',
    animal: '흑룡',
    animalKorean: '흑룡(黑龍) - 검은 용',
    nature: '깊은 바다에서 솟구치는 흑룡',
    color: '#000080',
    keywords: ['변화', '권력', '지혜'],
    personality: '깊은 곳에서 힘을 축적하여 때가 되면 폭발합니다.',
    destiny: '대기만성의 운명. 40대 이후 크게 성공합니다.',
    year: [1952, 2012, 2072]
  },
  '壬午': {
    jiazi: '壬午',
    korean: '임오',
    animal: '흑마',
    animalKorean: '흑마(黑馬) - 검은 말',
    nature: '밤바다를 달리는 검은 말',
    color: '#483D8B',
    keywords: ['속도', '깊이', '변화'],
    personality: '빠르면서도 깊이가 있습니다.',
    destiny: '빠른 변화 속에서 성공하는 운명. 급변하는 환경에 강합니다.',
    year: [1942, 2002, 2062]
  },
  '壬申': {
    jiazi: '壬申',
    korean: '임신',
    animal: '흑후',
    animalKorean: '흑후(黑猴) - 검은 원숭이',
    nature: '물가에서 지략을 펼치는 원숭이',
    color: '#6A5ACD',
    keywords: ['지략', '적응', '변화'],
    personality: '뛰어난 지략과 적응력을 가졌습니다.',
    destiny: '머리로 성공하는 운명. 전략가나 컨설턴트에 적합합니다.',
    year: [1932, 1992, 2052]
  },
  '壬戌': {
    jiazi: '壬戌',
    korean: '임술',
    animal: '흑구',
    animalKorean: '흑구(黑狗) - 검은 개',
    nature: '물가를 지키는 충직한 검은 개',
    color: '#4682B4',
    keywords: ['충성', '지혜', '수호'],
    personality: '지혜롭고 충직합니다.',
    destiny: '신뢰와 지혜로 인정받는 운명. 보안이나 수사 분야에 적합합니다.',
    year: [1922, 1982, 2042]
  },

  // 癸 계열 (수)
  '癸丑': {
    jiazi: '癸丑',
    korean: '계축',
    animal: '흑우',
    animalKorean: '흑우(黑牛) - 검은 소',
    nature: '이슬 맺힌 밭의 검은 소',
    color: '#708090',
    keywords: ['인내', '지혜', '축적'],
    personality: '조용히 지혜를 쌓아갑니다.',
    destiny: '지혜와 인내로 부를 쌓는 운명. 학자나 연구원에 적합합니다.',
    year: [1973, 2033, 2093]
  },
  '癸卯': {
    jiazi: '癸卯',
    korean: '계묘',
    animal: '흑토',
    animalKorean: '흑토(黑兎) - 검은 토끼',
    nature: '새벽 이슬 속 검은 토끼',
    color: '#778899',
    keywords: ['직관', '감성', '지혜'],
    personality: '섬세한 감성과 직관력이 있습니다.',
    destiny: '예술과 지혜를 겸비한 운명. 창작 분야에서 빛납니다.',
    year: [1963, 2023, 2083]
  },
  '癸巳': {
    jiazi: '癸巳',
    korean: '계사',
    animal: '흑사',
    animalKorean: '흑사(黑蛇) - 검은 뱀',
    nature: '깊은 웅덩이 속 검은 뱀',
    color: '#5F9EA0',
    keywords: ['통찰', '변화', '재생'],
    personality: '깊은 통찰력과 변신의 능력이 있습니다.',
    destiny: '위기를 기회로 만드는 운명. 투자나 전략에 능합니다.',
    year: [1953, 2013, 2073]
  },
  '癸未': {
    jiazi: '癸未',
    korean: '계미',
    animal: '흑양',
    animalKorean: '흑양(黑羊) - 검은 양',
    nature: '비 오는 들판의 검은 양',
    color: '#B0C4DE',
    keywords: ['온화', '지혜', '감성'],
    personality: '지혜롭고 감성이 풍부합니다.',
    destiny: '지혜와 온화함으로 사람을 이끄는 운명. 교육자에 적합합니다.',
    year: [1943, 2003, 2063]
  },
  '癸酉': {
    jiazi: '癸酉',
    korean: '계유',
    animal: '흑계',
    animalKorean: '흑계(黑鷄) - 검은 닭',
    nature: '새벽안개 속 검은 닭',
    color: '#ADD8E6',
    keywords: ['정확', '직관', '시작'],
    personality: '직관적이고 정확합니다.',
    destiny: '통찰력으로 새로운 시작을 여는 운명. 기획 분야에 적합합니다.',
    year: [1933, 1993, 2053]
  },
  '癸亥': {
    jiazi: '癸亥',
    korean: '계해',
    animal: '흑저',
    animalKorean: '흑저(黑猪) - 검은 돼지',
    nature: '깊은 물가의 복스러운 검은 돼지',
    color: '#87CEEB',
    keywords: ['지혜', '복', '풍요'],
    personality: '지혜롭고 복이 많습니다.',
    destiny: '지혜와 복이 함께하는 운명. 물을 다루는 사업에 유리합니다.',
    year: [1923, 1983, 2043]
  }
};

/**
 * 60갑자 정보 조회
 */
export function getSixtyJiaziInfo(heavenlyStem: string, earthlyBranch: string): SixtyJiaziInfo | null {
  const jiazi = `${heavenlyStem}${earthlyBranch}`;
  return SIXTY_JIAZI_MAPPING[jiazi] || null;
}

/**
 * 연주 기반 60갑자 조회
 */
export function getYearJiaziInfo(year: number): SixtyJiaziInfo | null {
  // 60갑자 주기 계산 (1984년 = 갑자년 기준)
  const baseYear = 1984;
  let cycle = ((year - baseYear) % 60 + 60) % 60;

  const stemIndex = cycle % 10;
  const branchIndex = cycle % 12;

  const stem = HEAVENLY_STEMS[stemIndex];
  const branch = EARTHLY_BRANCHES[branchIndex];

  return getSixtyJiaziInfo(stem, branch);
}

/**
 * 60갑자 프롤로그 생성
 */
export function generateJiaziPrologue(jiazi: SixtyJiaziInfo): string {
  return `당신은 ${jiazi.korean}년의 ${jiazi.animalKorean}입니다.

${jiazi.nature}처럼, 당신의 영혼에는 특별한 빛이 깃들어 있습니다.

${jiazi.personality}

${jiazi.destiny}`;
}

/**
 * 60갑자 에필로그 생성
 */
export function generateJiaziEpilogue(jiazi: SixtyJiaziInfo, dayMasterElement: string): string {
  const elementDescriptions: Record<string, string> = {
    '목': '봄의 새싹처럼 끊임없이 성장하며',
    '화': '태양처럼 세상을 밝히며',
    '토': '대지처럼 모든 것을 품으며',
    '금': '보석처럼 빛나며',
    '수': '강물처럼 유연하게 흐르며'
  };

  const elementDesc = elementDescriptions[dayMasterElement] || '당신만의 빛으로';

  return `${jiazi.animalKorean}의 기운을 품은 당신,
${elementDesc} 인생의 여정을 걸어가고 있습니다.

오늘 이 분석은 끝이 아닌 시작입니다.
당신의 운명은 이미 정해진 것이 아니라,
매 순간의 선택으로 만들어지는 것입니다.

${jiazi.keywords.join(', ')}의 힘을 믿고,
당신만의 길을 당당히 걸어가세요.

운명은 당신 편입니다. 🌟`;
}

export default {
  SIXTY_JIAZI_MAPPING,
  HEAVENLY_STEMS,
  EARTHLY_BRANCHES,
  ZODIAC_ANIMALS,
  getSixtyJiaziInfo,
  getYearJiaziInfo,
  generateJiaziPrologue,
  generateJiaziEpilogue
};
