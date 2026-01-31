/**
 * 생애주기 맞춤형 심리 분석 모듈
 *
 * 에릭슨의 심리사회적 발달 이론 + 현실적 한국 사회 맥락 통합
 * 연령대별 핵심 고민, 과제, 솔루션, 희망 메시지 제공
 */

import type { Element } from '@/types/saju';

// 생애주기 단계 정의
export type LifeStage =
  | 'youth_early'      // 20-24세: 청년 초기 (정체성 탐색)
  | 'youth_mid'        // 25-29세: 청년 중기 (자리잡기)
  | 'adult_early'      // 30-34세: 성인 초기 (기반 구축)
  | 'adult_mid'        // 35-39세: 성인 중기 (성장과 균형)
  | 'middle_early'     // 40-44세: 중년 초기 (전환점)
  | 'middle_mid'       // 45-49세: 중년 중기 (재정립)
  | 'middle_late'      // 50-54세: 중년 후기 (성찰)
  | 'mature_early'     // 55-59세: 장년 초기 (수확)
  | 'mature_mid'       // 60-64세: 장년 중기 (지혜)
  | 'elder';           // 65세+: 노년 (완성)

// 생애주기별 상세 데이터
export interface LifecycleData {
  stage: LifeStage;
  ageRange: string;
  koreanName: string;

  // 에릭슨 발달 과제
  eriksonTask: string;
  eriksonCrisis: string;

  // 현실적 고민 (한국 사회 맥락)
  realLifeConcerns: {
    primary: string;           // 핵심 고민
    secondary: string[];       // 부수적 고민들
    hiddenFear: string;        // 숨겨진 두려움
    unspokenWish: string;      // 말 못한 바람
  };

  // 공감 메시지
  empathyMessages: {
    opening: string;           // "혹시 ~하신 적 있으세요?"
    validation: string;        // "그건 당연한 거예요"
    understanding: string;     // "왜 그런지 알려드릴게요"
  };

  // 통찰과 솔루션
  insights: {
    rootCause: string;         // 고민의 본질
    paradigmShift: string;     // 관점 전환
    practicalAdvice: string;   // 실질적 조언
    avoidance: string;         // 피해야 할 것
  };

  // 희망 메시지
  hopeMessages: {
    immediate: string;         // 지금 당장의 희망
    shortTerm: string;         // 1-2년 내
    longTerm: string;          // 장기적 비전
    destinyLine: string;       // 운명 한 줄
  };

  // 공감 글귀/명언
  wisdomQuotes: {
    eastern: string;           // 동양 명언
    western: string;           // 서양 명언
    original: string;          // 오리지널 글귀
  };
}

// ========== 생애주기별 데이터 ==========

export const LIFECYCLE_DATA: Record<LifeStage, LifecycleData> = {
  // 20-24세: 청년 초기
  youth_early: {
    stage: 'youth_early',
    ageRange: '20-24세',
    koreanName: '청년 초기',

    eriksonTask: '정체성 vs 역할 혼란',
    eriksonCrisis: '나는 누구인가? 무엇을 해야 하는가?',

    realLifeConcerns: {
      primary: '진로와 미래에 대한 막막함',
      secondary: [
        '취업 준비의 압박감',
        '또래와의 비교',
        '경제적 독립에 대한 부담',
        '연애와 관계의 어려움'
      ],
      hiddenFear: '나만 뒤처지는 것 같은 두려움',
      unspokenWish: '누군가 "괜찮아, 천천히 해도 돼"라고 말해주길'
    },

    empathyMessages: {
      opening: '혹시 요즘 "나는 뭘 하고 싶은 걸까" 하는 생각이 자주 드시나요? 친구들은 다 방향을 찾은 것 같은데, 나만 아직도 헤매는 것 같은...',
      validation: '그 막막함, 당연한 거예요. 이 시기는 원래 그래요. 모두가 확신 있어 보이지만, 사실 다들 불안합니다.',
      understanding: '20대 초반은 "시도"의 시간이지 "완성"의 시간이 아니에요. 지금 방황하는 건 게으른 게 아니라, 진지하게 고민하고 있다는 증거입니다.'
    },

    insights: {
      rootCause: '빨리 정답을 찾아야 한다는 조급함이 가장 큰 적입니다. 하지만 인생의 정답은 "찾는" 게 아니라 "만들어가는" 거예요.',
      paradigmShift: '비교는 독입니다. 남들의 속도가 아닌, 나만의 리듬을 찾으세요. 빠른 사람이 성공하는 게 아니라, 포기하지 않는 사람이 성공합니다.',
      practicalAdvice: '지금은 "넓게" 경험할 때입니다. 한 우물만 파지 말고, 다양한 시도를 해보세요. 그 경험들이 30대에 연결됩니다.',
      avoidance: '완벽한 준비를 기다리지 마세요. 준비되지 않아도 일단 시작하는 게 최고의 준비입니다.'
    },

    hopeMessages: {
      immediate: '오늘 하루, 작은 것 하나만 해보세요. 그게 내일의 방향이 됩니다.',
      shortTerm: '2년 후, 지금의 고민들이 "그때 그랬지" 하고 웃으며 말할 추억이 됩니다.',
      longTerm: '당신이 지금 흘리는 땀방울들은 30대에 꽃이 되어 돌아옵니다.',
      destinyLine: '길을 찾는 중인 당신, 이미 걷고 있다는 것 자체가 답입니다.'
    },

    wisdomQuotes: {
      eastern: '"천 리 길도 한 걸음부터" - 노자. 지금 한 걸음이 천 리의 시작입니다.',
      western: '"스무 살에는 미래가 걱정되고, 마흔에는 과거가 걱정된다. 차라리 스무 살의 걱정이 낫다." - 마크 트웨인',
      original: '지금 헤매는 당신에게: 길을 잃은 게 아니라, 새 길을 만들고 있는 거예요.'
    }
  },

  // 25-29세: 청년 중기
  youth_mid: {
    stage: 'youth_mid',
    ageRange: '25-29세',
    koreanName: '청년 중기',

    eriksonTask: '친밀감 vs 고립감',
    eriksonCrisis: '진정한 관계를 맺을 수 있는가?',

    realLifeConcerns: {
      primary: '커리어 불안과 미래 설계',
      secondary: [
        '결혼에 대한 압박',
        '경제적 자립의 어려움',
        '직장 생활의 회의감',
        '인간관계의 피로감'
      ],
      hiddenFear: '이대로 평범하게 살다 끝나는 건 아닐까',
      unspokenWish: '나도 특별한 무언가가 되고 싶어'
    },

    empathyMessages: {
      opening: '혹시 요즘 "이게 맞나?" 하는 생각이 드시나요? 하루하루 열심히 사는데, 어딘가 공허한 느낌...',
      validation: '20대 후반의 그 불안, 누구나 겪습니다. 오히려 불안하지 않으면 그게 더 문제예요.',
      understanding: '이 시기는 "정리"의 시간입니다. 20대 초반의 경험들을 정리하고, 30대의 방향을 잡는 전환점이에요.'
    },

    insights: {
      rootCause: '완벽해야 한다는 강박이 당신을 힘들게 합니다. 하지만 지금 불완전한 게 정상이에요.',
      paradigmShift: '성공의 기준을 바꾸세요. "남들이 보기에 좋은 삶"이 아니라 "내가 만족하는 삶"이 진짜 성공입니다.',
      practicalAdvice: '이 시기에 해야 할 건 "선택"입니다. 모든 걸 다 할 수 없어요. 진짜 원하는 2-3가지에 집중하세요.',
      avoidance: '"아직 젊으니까"라는 말에 속지 마세요. 30대는 금방 옵니다. 지금 씨앗을 심어야 합니다.'
    },

    hopeMessages: {
      immediate: '지금 느끼는 불안은, 더 나아지고 싶다는 욕구의 표현입니다. 그게 당신의 엔진이에요.',
      shortTerm: '3년 후, 지금 고민하며 내린 결정들이 당신의 30대를 만듭니다.',
      longTerm: '불안했던 20대 후반이, 40대에는 "그때 진짜 열심히 살았구나" 하는 자부심이 됩니다.',
      destinyLine: '불완전해도 괜찮아, 지금 당신은 완성 중입니다.'
    },

    wisdomQuotes: {
      eastern: '"청춘은 인생의 봄이요, 봄은 청춘이다" - 이광수. 지금이 씨앗 뿌릴 봄입니다.',
      western: '"20대에 하지 않은 일을 30대에 후회한다" - 워렌 버핏',
      original: '완벽한 준비란 없습니다. 지금 출발선에 서 있는 당신이 이미 반은 달린 거예요.'
    }
  },

  // 30-34세: 성인 초기
  adult_early: {
    stage: 'adult_early',
    ageRange: '30-34세',
    koreanName: '성인 초기',

    eriksonTask: '생산성 vs 침체',
    eriksonCrisis: '사회에 기여하고 있는가? 성장하고 있는가?',

    realLifeConcerns: {
      primary: '일과 삶의 균형, 정착에 대한 압박',
      secondary: [
        '결혼/출산 타이밍',
        '내 집 마련의 부담',
        '커리어 정체기',
        '부모님의 건강 걱정'
      ],
      hiddenFear: '이미 늦은 건 아닐까, 기회를 놓친 건 아닐까',
      unspokenWish: '조금만 쉬고 싶어, 잠시만 숨 좀 쉬고 싶어'
    },

    empathyMessages: {
      opening: '요즘 "벌써 30대인데..." 하는 생각이 드시죠? 시간은 빠르게 가는데, 이룬 건 별로 없는 것 같고...',
      validation: '30대 초반의 그 압박감, 이해합니다. 사회가 만든 타임라인에 쫓기는 기분이죠.',
      understanding: '하지만 알아두세요. 30대는 "마감"이 아니라 "진짜 시작"입니다. 20대의 실험 끝에, 이제 본게임이 시작된 거예요.'
    },

    insights: {
      rootCause: '"정상"이라는 환상에 쫓기고 있습니다. 결혼, 집, 아이... 그게 행복의 조건은 아닙니다.',
      paradigmShift: '사회의 타임라인이 아닌, "나의 타임라인"을 만드세요. 남들이 뭐라 하든, 당신 인생은 당신 거예요.',
      practicalAdvice: '지금 가장 중요한 건 "기반"입니다. 경제적 기반, 관계적 기반, 건강 기반. 이 세 가지를 다지세요.',
      avoidance: '모든 걸 한 번에 하려 하지 마세요. 하나씩, 천천히. 급할수록 돌아가세요.'
    },

    hopeMessages: {
      immediate: '숨 쉬어도 됩니다. 잠시 멈춰도 괜찮아요. 쉬는 것도 전진의 일부입니다.',
      shortTerm: '35세가 되면, 지금 다진 기반 위에 집을 짓기 시작합니다. 지금은 기초공사 중이에요.',
      longTerm: '40대의 당신은 오늘의 선택에 감사할 거예요. "그때 흔들리지 않았구나" 하면서.',
      destinyLine: '늦은 게 아닙니다. 당신만의 속도로 가는 중일 뿐.'
    },

    wisdomQuotes: {
      eastern: '"대기만성(大器晩成)" - 큰 그릇은 늦게 이루어진다. 조급해하지 마세요.',
      western: '"인생은 40부터라고 하지만, 진짜 준비는 30에 끝난다" - 앙드레 모루아',
      original: '30대, 조급함을 내려놓는 순간 진짜 성장이 시작됩니다.'
    }
  },

  // 35-39세: 성인 중기
  adult_mid: {
    stage: 'adult_mid',
    ageRange: '35-39세',
    koreanName: '성인 중기',

    eriksonTask: '생산성의 확장',
    eriksonCrisis: '내가 만든 것이 가치가 있는가?',

    realLifeConcerns: {
      primary: '커리어의 방향성과 가정의 책임',
      secondary: [
        '육아와 일의 병행',
        '경제적 압박 (대출, 교육비)',
        '건강 신호의 시작',
        '관계의 권태기'
      ],
      hiddenFear: '이렇게 살다 끝나는 건가, 내 꿈은 어디 갔지',
      unspokenWish: '나만의 시간이 갖고 싶어, 나로 살고 싶어'
    },

    empathyMessages: {
      opening: '혹시 요즘 "내 인생은 어디 갔지?" 하는 생각이 드시나요? 가정, 회사, 부모님... 다 챙기느라 정작 "나"는 놓친 것 같은...',
      validation: '그 공허함, 이기적인 게 아니에요. 지금까지 너무 남을 위해 살았기 때문에 생기는 자연스러운 감정입니다.',
      understanding: '30대 후반은 "균형"을 배우는 시기예요. 모든 역할을 완벽히 할 수 없어요. 이제 "나"도 챙겨야 합니다.'
    },

    insights: {
      rootCause: '완벽한 아빠/엄마, 완벽한 직장인, 완벽한 자식... 모든 걸 완벽히 하려다 지쳐버린 거예요.',
      paradigmShift: '"좋은 사람"이 되려 하지 말고, "행복한 사람"이 되세요. 행복한 사람이 결국 좋은 영향을 줍니다.',
      practicalAdvice: '일주일에 2시간만이라도 "나만의 시간"을 만드세요. 그게 충전이 되어 나머지 시간을 버티게 합니다.',
      avoidance: '죄책감에 시달리지 마세요. 당신이 쉬는 건 이기적인 게 아니라 필수입니다.'
    },

    hopeMessages: {
      immediate: '오늘 10분만 나를 위해 쓰세요. 커피 한 잔이라도, 그게 시작입니다.',
      shortTerm: '40대에 접어들면, 지금의 수고가 안정으로 바뀝니다. 터널의 끝이 보이기 시작해요.',
      longTerm: '50대의 당신은 이 시기를 "가장 열심히 살았던 때"로 기억할 거예요.',
      destinyLine: '지금 지쳐 있다면, 그만큼 열심히 산 증거입니다.'
    },

    wisdomQuotes: {
      eastern: '"산은 높아야 골이 깊다" - 높은 산만큼 깊은 골짜기가 있듯, 책임만큼 보람도 옵니다.',
      western: '"행복은 목적지가 아니라 여행 방식이다" - 마가렛 리 런벡',
      original: '모든 역할 사이에서, 가장 소중한 역할은 "나 자신"입니다.'
    }
  },

  // 40-44세: 중년 초기
  middle_early: {
    stage: 'middle_early',
    ageRange: '40-44세',
    koreanName: '중년 초기',

    eriksonTask: '자기 통합의 시작',
    eriksonCrisis: '인생의 전반전은 어땠는가? 후반전은?',

    realLifeConcerns: {
      primary: '인생 전환점에서의 방향 재설정',
      secondary: [
        '건강에 대한 현실적 걱정',
        '자녀 교육 스트레스',
        '직장에서의 위치 불안',
        '부모님 부양 문제'
      ],
      hiddenFear: '인생의 절반이 지났다는 무게감',
      unspokenWish: '다시 시작할 수 있을까, 아직 늦지 않았을까'
    },

    empathyMessages: {
      opening: '혹시 요즘 "인생의 반이 지났구나" 하는 생각에 멈칫하신 적 있으세요? 거울을 볼 때, 문득 시간이 어디 갔나 싶은...',
      validation: '40대의 그 무게감, 자연스러운 거예요. 누구나 이 시기에 한 번쯤 인생을 되돌아봅니다.',
      understanding: '40대는 "전환"의 시기입니다. 전반전이 끝났을 뿐, 후반전은 이제 시작이에요. 그리고 후반전이 더 재밌습니다.'
    },

    insights: {
      rootCause: '"해야 하는 것"과 "하고 싶은 것" 사이의 괴리가 커진 거예요. 이제 진지하게 조율할 때입니다.',
      paradigmShift: '40대는 "버리는" 시기입니다. 필요 없는 관계, 의미 없는 일, 과거의 미련... 비워야 새 것이 들어옵니다.',
      practicalAdvice: '지금 해야 할 건 "정리"입니다. 인생 전반전의 성적표를 냉정하게 보고, 후반전 전략을 세우세요.',
      avoidance: '젊은 척 하지 마세요. 40대의 품격으로 사세요. 무리하면 몸이 먼저 말립니다.'
    },

    hopeMessages: {
      immediate: '오늘, 정말 중요한 게 뭔지 적어보세요. 10개 중 3개만 남기세요. 그게 후반전의 방향입니다.',
      shortTerm: '45세까지 정리가 되면, 이후 5년은 "성장"의 시간이 됩니다.',
      longTerm: '50대에 "40대 때 정리 잘했다"고 스스로 칭찬하게 될 거예요.',
      destinyLine: '인생 후반전, 지금부터가 진짜입니다.'
    },

    wisdomQuotes: {
      eastern: '"사십이불혹(四十而不惑)" - 공자. 40에는 미혹되지 않는다. 이제 흔들리지 않을 때입니다.',
      western: '"인생은 40부터" - 빅토르 위고. 40대야말로 진정한 시작입니다.',
      original: '전반전의 점수는 중요하지 않아요. 후반전을 어떻게 뛰느냐가 최종 결과를 결정합니다.'
    }
  },

  // 45-49세: 중년 중기
  middle_mid: {
    stage: 'middle_mid',
    ageRange: '45-49세',
    koreanName: '중년 중기',

    eriksonTask: '자기 재정립',
    eriksonCrisis: '진정한 나는 누구인가? 무엇을 남길 것인가?',

    realLifeConcerns: {
      primary: '정체성 재확립과 의미 찾기',
      secondary: [
        '체력 저하의 실감',
        '자녀의 독립 준비',
        '노후 준비의 압박',
        '배우자와의 관계 재정립'
      ],
      hiddenFear: '존재의 의미를 잃어버릴까 봐',
      unspokenWish: '아직 이루고 싶은 게 있어'
    },

    empathyMessages: {
      opening: '혹시 요즘 "내가 이렇게 살아도 되나" 하는 생각이 드시나요? 책임은 늘어나는데, 나만의 꿈은 점점 멀어지는 것 같은...',
      validation: '그 허무함, 중년의 통과의례입니다. 오히려 이런 질문을 하는 당신이 건강한 거예요.',
      understanding: '45-49세는 "재탄생"의 시기예요. 이제까지의 나를 넘어, 새로운 내가 될 기회입니다.'
    },

    insights: {
      rootCause: '남들의 기대에 맞춰 살다 보니, 진짜 "나"를 잃어버린 거예요. 이제 찾을 때입니다.',
      paradigmShift: '"성공"의 정의를 바꾸세요. 돈, 지위가 아닌 "만족"과 "평화"가 진짜 성공입니다.',
      practicalAdvice: '하루 30분, 아무도 모르는 "나만의 프로젝트"를 시작하세요. 취미든 공부든, 그게 당신을 살립니다.',
      avoidance: '"이 나이에 무슨..."이라는 말을 버리세요. 나이는 숫자일 뿐, 가능성은 열려 있습니다.'
    },

    hopeMessages: {
      immediate: '오늘, 20년 전에 하고 싶었던 걸 떠올려 보세요. 아직 할 수 있는 게 있을 거예요.',
      shortTerm: '50대 초반, 지금 시작한 "나만의 것"이 새로운 정체성이 됩니다.',
      longTerm: '60대에 "그때 시작하길 정말 잘했다"고 말하게 될 거예요.',
      destinyLine: '지금이 가장 젊은 날입니다. 시작하기에 늦은 때란 없어요.'
    },

    wisdomQuotes: {
      eastern: '"인생은 짧고 예술은 길다" - 히포크라테스. 당신이 남길 것은 무엇인가요?',
      western: '"중년은 위기가 아니라 기회다" - 칼 융',
      original: '지금까지 당신은 세상을 위해 살았습니다. 이제 조금은 당신을 위해 사세요.'
    }
  },

  // 50-54세: 중년 후기
  middle_late: {
    stage: 'middle_late',
    ageRange: '50-54세',
    koreanName: '중년 후기',

    eriksonTask: '통합 vs 절망의 시작',
    eriksonCrisis: '나의 인생은 가치가 있었는가?',

    realLifeConcerns: {
      primary: '인생 성찰과 남은 시간의 의미',
      secondary: [
        '건강 관리의 절박함',
        '자녀의 독립과 빈둥지 증후군',
        '은퇴 후 계획',
        '관계의 재정립'
      ],
      hiddenFear: '후회 속에 남은 인생을 보낼까 봐',
      unspokenWish: '아직 시간이 있다면, 다르게 살고 싶어'
    },

    empathyMessages: {
      opening: '혹시 밤에 "나는 잘 살았나" 하는 생각이 드실 때가 있으세요? 뒤돌아보면 아쉬움도 있고...',
      validation: '그 성찰, 지혜로운 거예요. 반성할 줄 아는 사람만이 진짜 성장합니다.',
      understanding: '50대는 "정산"의 시기가 아니라 "새로운 출발"의 시기입니다. 아직 20-30년이 남았어요.'
    },

    insights: {
      rootCause: '과거에 매여 있으면 안 됩니다. 후회는 에너지만 소모해요. 이제 앞을 볼 때입니다.',
      paradigmShift: '"남은 시간"이 아니라 "주어진 시간"으로 생각하세요. 아직 충분합니다.',
      practicalAdvice: '버킷리스트를 만드세요. 작은 것부터. 그리고 하나씩 지워나가세요. 그게 삶의 활력이 됩니다.',
      avoidance: '"이제 늦었어"라는 말을 금지하세요. 늦은 건 없어요. 지금이 가장 빠른 때입니다.'
    },

    hopeMessages: {
      immediate: '오늘, 못 해본 것 하나를 해보세요. 작은 거라도. 그게 새로운 당신의 시작입니다.',
      shortTerm: '55세에는 지금 시작한 것들이 당신의 새로운 정체성이 됩니다.',
      longTerm: '60대, 70대에 "50대에 다시 시작하길 잘했다"고 말하게 될 거예요.',
      destinyLine: '50대는 끝이 아니라, 제2막의 시작입니다.'
    },

    wisdomQuotes: {
      eastern: '"지천명(知天命)" - 50에 하늘의 뜻을 안다. 이제 당신의 소명을 알 때입니다.',
      western: '"50대는 인생의 오후다. 오후가 오전보다 아름다울 수 있다." - 칼 융',
      original: '지나온 길이 당신의 전부가 아닙니다. 앞으로 갈 길이 더 많습니다.'
    }
  },

  // 55-59세: 장년 초기
  mature_early: {
    stage: 'mature_early',
    ageRange: '55-59세',
    koreanName: '장년 초기',

    eriksonTask: '지혜의 전수',
    eriksonCrisis: '다음 세대에 무엇을 남길 것인가?',

    realLifeConcerns: {
      primary: '은퇴 후의 삶과 새로운 역할',
      secondary: [
        '건강 유지의 중요성',
        '배우자와의 시간',
        '손주와의 관계',
        '사회적 연결 유지'
      ],
      hiddenFear: '쓸모없는 사람이 될까 봐',
      unspokenWish: '여전히 필요한 사람이고 싶어'
    },

    empathyMessages: {
      opening: '은퇴가 가까워지면서 "나는 이제 뭘 해야 하지?" 하는 생각이 드시죠?',
      validation: '그 불안, 당연한 거예요. 평생 달려온 사람이 멈추면 불안한 게 정상입니다.',
      understanding: '하지만 은퇴는 "끝"이 아니라 "전환"입니다. 이제 진짜 하고 싶은 걸 할 시간이에요.'
    },

    insights: {
      rootCause: '자신의 가치를 "일"에만 두었기 때문에 불안한 거예요. 이제 새로운 가치를 찾을 때입니다.',
      paradigmShift: '"생산"에서 "전수"로. 당신의 경험과 지혜를 나누세요. 그게 가장 큰 가치입니다.',
      practicalAdvice: '멘토가 되세요. 젊은 사람들에게 경험을 나누세요. 당신의 실패담도 소중한 자산입니다.',
      avoidance: '집에만 있지 마세요. 사회적 연결을 유지하세요. 사람과의 관계가 건강의 비결입니다.'
    },

    hopeMessages: {
      immediate: '오늘, 누군가에게 당신의 경험을 나눠보세요. 그게 당신의 새로운 역할입니다.',
      shortTerm: '60세에는 "제2의 인생"이 본격적으로 시작됩니다. 지금은 준비 단계예요.',
      longTerm: '70대에 "55세 이후가 가장 행복했다"고 말하게 될 거예요.',
      destinyLine: '은퇴는 끝이 아니라, 진짜 삶의 시작입니다.'
    },

    wisdomQuotes: {
      eastern: '"노익장(老益壯)" - 늙을수록 더 강해진다. 당신의 지혜가 힘입니다.',
      western: '"젊음은 힘, 노년은 지혜" - 아리스토텔레스',
      original: '당신이 쌓아온 경험은 책으로도 살 수 없는 보물입니다. 나눠주세요.'
    }
  },

  // 60-64세: 장년 중기
  mature_mid: {
    stage: 'mature_mid',
    ageRange: '60-64세',
    koreanName: '장년 중기',

    eriksonTask: '자아 통합',
    eriksonCrisis: '내 인생을 받아들일 수 있는가?',

    realLifeConcerns: {
      primary: '삶의 의미와 만족',
      secondary: [
        '건강 관리',
        '배우자/가족과의 시간',
        '손주 양육 참여',
        '노후 자금 관리'
      ],
      hiddenFear: '후회 속에 남은 날들을 보낼까 봐',
      unspokenWish: '남은 시간을 의미 있게 살고 싶어'
    },

    empathyMessages: {
      opening: '60대가 되니 "이게 내 인생이었구나" 하는 생각이 드시죠? 좋은 것도 아쉬운 것도...',
      validation: '그 감회, 소중한 거예요. 삶을 돌아볼 줄 아는 건 지혜입니다.',
      understanding: '60대는 "받아들임"의 시기입니다. 완벽하지 않아도, 당신의 삶은 가치가 있었어요.'
    },

    insights: {
      rootCause: '완벽한 삶은 없습니다. 아쉬움이 있어도, 그것도 포함해서 당신의 이야기예요.',
      paradigmShift: '후회보다 감사로. "하지 못한 것"보다 "해낸 것"에 집중하세요.',
      practicalAdvice: '매일 감사한 것 3가지를 적으세요. 작은 것도요. 그게 마음의 평화를 줍니다.',
      avoidance: '과거에 매여 살지 마세요. 오늘에 집중하세요. 어제는 이미 지났습니다.'
    },

    hopeMessages: {
      immediate: '오늘, 감사한 것 하나를 떠올려 보세요. 그게 행복의 시작입니다.',
      shortTerm: '65세에는 마음의 평화가 더 깊어집니다. 지금은 그 과정 중이에요.',
      longTerm: '70대, 80대에 "잘 살았다"고 미소 짓게 될 거예요.',
      destinyLine: '당신의 인생은 이미 아름다운 이야기입니다.'
    },

    wisdomQuotes: {
      eastern: '"이순(耳順)" - 60에 귀가 순해진다. 이제 세상의 소리가 달리 들릴 거예요.',
      western: '"인생에서 가장 좋은 시기는 지금이다" - 에이브러햄 링컨',
      original: '완벽하지 않아도 괜찮습니다. 당신의 인생은 그 자체로 의미가 있습니다.'
    }
  },

  // 65세+: 노년
  elder: {
    stage: 'elder',
    ageRange: '65세 이상',
    koreanName: '노년',

    eriksonTask: '자아 통합 vs 절망',
    eriksonCrisis: '삶을 평화롭게 마무리할 수 있는가?',

    realLifeConcerns: {
      primary: '평화로운 마무리와 유산',
      secondary: [
        '건강 유지',
        '가족과의 관계',
        '삶의 의미 정리',
        '죽음에 대한 수용'
      ],
      hiddenFear: '외롭게 마지막을 맞을까 봐',
      unspokenWish: '사랑하는 사람들 곁에서 평화롭게'
    },

    empathyMessages: {
      opening: '긴 여정을 걸어오셨네요. 돌아보면 참 많은 일이 있었죠...',
      validation: '지금까지 오신 것 자체가 대단한 거예요. 쉽지 않았을 텐데, 잘 견뎌오셨습니다.',
      understanding: '이제는 평화롭게 쉴 자격이 있습니다. 충분히 달려왔으니까요.'
    },

    insights: {
      rootCause: '삶의 무게를 다 내려놓을 때입니다. 이제 가볍게 사셔도 됩니다.',
      paradigmShift: '남기는 것보다 "나누는 것"이 중요합니다. 사랑, 지혜, 경험을.',
      practicalAdvice: '매일 사랑하는 사람에게 마음을 전하세요. 그게 가장 큰 유산입니다.',
      avoidance: '후회하며 살지 마세요. 모든 선택에는 이유가 있었습니다.'
    },

    hopeMessages: {
      immediate: '오늘, 사랑하는 사람에게 "고맙다, 사랑한다" 말해보세요.',
      shortTerm: '앞으로의 날들이 평화롭고 따뜻하기를 바랍니다.',
      longTerm: '당신이 남긴 사랑은 영원히 기억될 거예요.',
      destinyLine: '당신은 충분히 잘 살았습니다. 이제 쉬셔도 됩니다.'
    },

    wisdomQuotes: {
      eastern: '"종심소욕(從心所欲)" - 70에 마음 가는 대로 해도 된다. 공자의 말씀처럼.',
      western: '"삶의 목적은 행복이 아니라 의미다" - 빅터 프랭클',
      original: '당신이 살아온 모든 날이 누군가에게 빛이 되었습니다.'
    }
  }
};

// ========== 헬퍼 함수 ==========

/**
 * 나이로 생애주기 단계 결정
 */
export function getLifeStage(age: number): LifeStage {
  if (age < 20) return 'youth_early'; // 10대도 youth_early로
  if (age <= 24) return 'youth_early';
  if (age <= 29) return 'youth_mid';
  if (age <= 34) return 'adult_early';
  if (age <= 39) return 'adult_mid';
  if (age <= 44) return 'middle_early';
  if (age <= 49) return 'middle_mid';
  if (age <= 54) return 'middle_late';
  if (age <= 59) return 'mature_early';
  if (age <= 64) return 'mature_mid';
  return 'elder';
}

/**
 * 생애주기 데이터 가져오기
 */
export function getLifecycleData(age: number): LifecycleData {
  const stage = getLifeStage(age);
  return LIFECYCLE_DATA[stage];
}

/**
 * 성별에 따른 맞춤 메시지 조정
 */
export function getGenderAdjustedMessage(
  message: string,
  gender: 'male' | 'female'
): string {
  // 성별에 따른 미묘한 표현 조정
  if (gender === 'female') {
    return message
      .replace(/아빠/g, '엄마')
      .replace(/남편/g, '아내')
      .replace(/사위/g, '며느리');
  }
  return message;
}

/**
 * 연령대별 핵심 고민 키워드
 */
export function getAgeConcernKeywords(age: number): string[] {
  const stage = getLifeStage(age);
  const data = LIFECYCLE_DATA[stage];
  return [data.realLifeConcerns.primary, ...data.realLifeConcerns.secondary.slice(0, 2)];
}

/**
 * 일간 + 연령 조합 인사이트 생성
 */
export function getDayMasterLifeStageInsight(
  dayMaster: string,
  age: number
): string {
  const stage = getLifeStage(age);
  const data = LIFECYCLE_DATA[stage];

  // 일간별 특성과 연령대 조합
  const dayMasterTraits: Record<string, string> = {
    '갑': '개척자의 기운',
    '을': '적응력의 기운',
    '병': '열정의 기운',
    '정': '섬세함의 기운',
    '무': '안정의 기운',
    '기': '포용의 기운',
    '경': '결단의 기운',
    '신': '세련됨의 기운',
    '임': '지혜의 기운',
    '계': '직관의 기운'
  };

  const trait = dayMasterTraits[dayMaster] || '특별한 기운';

  return `${trait}을 가진 당신이 ${data.ageRange}를 지나고 있습니다. ` +
    `${data.realLifeConcerns.primary}이 고민이시라면, 그건 ${trait}이 방향을 찾고 있는 거예요.`;
}
