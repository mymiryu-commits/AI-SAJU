/**
 * 감정 공명 매핑 데이터
 *
 * 50대+ 사용자의 공감도를 200% 끌어올리기 위한
 * 심층 심리 분석 및 과거 검증 데이터
 */

import type { Element } from '@/types/saju';

// ========== 1. 어린시절 패턴 (과거 검증 - "소름 돋는" 예측) ==========
export const CHILDHOOD_PATTERNS: Record<string, {
  commonPhrase: string;      // 어릴 때 자주 들었던 말
  familyRole: string;        // 가정에서의 역할
  hiddenStruggle: string;    // 숨겨진 어려움
  formativeExperience: string; // 형성적 경험
  validationMessage: string;  // 검증 메시지
}> = {
  '甲': {
    commonPhrase: '"왜 그렇게 고집이 세니", "네 생각대로만 하려고 하지 마"',
    familyRole: '가정에서 의견을 내는 역할, 하지만 그만큼 책임감도 무거웠어요',
    hiddenStruggle: '인정받고 싶은 마음과 자기 길을 가고 싶은 마음 사이에서 갈등했습니다',
    formativeExperience: '어릴 때 누군가의 불합리한 결정에 반발했던 기억이 있으실 거예요',
    validationMessage: '당신의 고집은 사실 신념이었습니다. 그게 당신을 여기까지 이끌어왔어요'
  },
  '乙': {
    commonPhrase: '"넌 참 순하다", "착하기만 하면 손해 봐"',
    familyRole: '분위기를 맞추는 역할, 갈등을 피하려고 자신을 숨겼어요',
    hiddenStruggle: '하고 싶은 말을 참으면서 속으로 많이 울었습니다',
    formativeExperience: '다른 사람 눈치를 보느라 진짜 하고 싶은 것을 포기한 적이 있어요',
    validationMessage: '당신의 유연함은 지혜입니다. 그 덕분에 많은 관계를 지켜왔어요'
  },
  '丙': {
    commonPhrase: '"넌 왜 그렇게 나서니", "조용히 좀 있어"',
    familyRole: '관심의 중심이었지만, 그만큼 기대와 압박도 컸어요',
    hiddenStruggle: '늘 밝아야 한다는 부담감에 혼자 있을 때 지쳤습니다',
    formativeExperience: '무대 공포증이나 시선 집중에 대한 양가감정이 있었어요',
    validationMessage: '당신의 열정은 진짜입니다. 주변을 밝히는 건 당신만의 재능이에요'
  },
  '丁': {
    commonPhrase: '"어른스럽다", "눈치가 빠르다", "생각이 깊다"',
    familyRole: '어른들의 감정을 읽는 아이, 어린 나이에 분위기 파악을 잘했어요',
    hiddenStruggle: '너무 일찍 철이 들어서 동년배와 어울리기 어려웠습니다',
    formativeExperience: '부모님의 걱정을 덜어드리려고 일찍 어른 노릇을 한 기억이 있어요',
    validationMessage: '당신의 섬세함은 선물입니다. 그 덕분에 깊은 인연을 만들 수 있었어요'
  },
  '戊': {
    commonPhrase: '"믿음직하다", "듬직하다", "책임감 있다"',
    familyRole: '가족의 기둥 역할, 동생들이나 약한 이들을 보호했어요',
    hiddenStruggle: '항상 강해야 한다는 부담감에 약한 모습을 보일 수 없었습니다',
    formativeExperience: '가정의 어려움을 혼자 감당하려 했던 시기가 있어요',
    validationMessage: '당신의 든든함은 타고난 것입니다. 많은 사람이 당신 덕분에 버텼어요'
  },
  '己': {
    commonPhrase: '"왜 그렇게 걱정이 많니", "너무 신중하다"',
    familyRole: '조용히 뒷바라지하는 역할, 눈에 띄지 않게 도왔어요',
    hiddenStruggle: '인정받고 싶지만 나서기는 싫은 모순된 마음이 있었습니다',
    formativeExperience: '묵묵히 한 일이 당연하게 여겨져서 서운했던 적이 있어요',
    validationMessage: '당신의 신중함이 가족을 지켰습니다. 그 가치를 아는 사람은 알아요'
  },
  '庚': {
    commonPhrase: '"왜 그렇게 따지니", "좀 부드럽게 말해"',
    familyRole: '원칙을 지키는 역할, 공정함을 중요시했어요',
    hiddenStruggle: '옳다고 생각한 것을 말했는데 미움받은 경험이 있습니다',
    formativeExperience: '부당한 상황에서 참지 못하고 나섰다가 혼난 기억이 있어요',
    validationMessage: '당신의 정의감은 진짜입니다. 세상에 꼭 필요한 사람이에요'
  },
  '辛': {
    commonPhrase: '"예민하다", "까다롭다", "완벽주의자"',
    familyRole: '기준을 세우는 역할, 품질을 따지고 정확함을 추구했어요',
    hiddenStruggle: '스스로에게 너무 엄격해서 늘 부족하다고 느꼈습니다',
    formativeExperience: '100점이 아니면 칭찬받지 못한 기억이 있어요',
    validationMessage: '당신의 안목은 특별합니다. 그 예민함이 당신을 빛나게 해요'
  },
  '壬': {
    commonPhrase: '"속을 모르겠다", "무슨 생각하니", "깊다"',
    familyRole: '혼자만의 세계가 있는 아이, 생각이 많았어요',
    hiddenStruggle: '마음을 표현하는 게 어려워서 오해받은 적이 많습니다',
    formativeExperience: '깊이 신뢰했던 사람에게 배신당한 경험이 트라우마로 남아있어요',
    validationMessage: '당신의 깊이는 보물입니다. 시간이 지나면 진가를 알아보는 사람이 와요'
  },
  '癸': {
    commonPhrase: '"상상력이 풍부하다", "몽상가 같다", "감수성이 예민하다"',
    familyRole: '조용한 관찰자, 가족들의 감정을 민감하게 느꼈어요',
    hiddenStruggle: '현실과 이상 사이에서 방황했고, 이해받지 못한다고 느꼈습니다',
    formativeExperience: '꿈을 말했다가 "현실적으로 생각해"라는 말에 상처받은 적 있어요',
    validationMessage: '당신의 감수성은 창의성입니다. 나이가 들수록 빛나는 재능이에요'
  }
};

// ========== 2. 관계 상처 패턴 ==========
export const RELATIONSHIP_WOUNDS: Record<string, {
  trustIssue: string;        // 신뢰 문제
  abandonmentFear: string;   // 버림받음 두려움
  betrayalExperience: string; // 배신 경험
  boundaryProblem: string;   // 경계 문제
  healingPath: string;       // 치유의 길
}> = {
  '甲': {
    trustIssue: '자신의 의견이 무시당했던 경험이 트라우마입니다',
    abandonmentFear: '인정받지 못하면 존재 가치가 없다고 느낍니다',
    betrayalExperience: '믿고 따랐던 사람이 자신을 이용한 경험이 있어요',
    boundaryProblem: '너무 강하게 나서다가 관계가 틀어진 적이 있습니다',
    healingPath: '자신의 가치는 남의 인정과 무관합니다. 스스로를 먼저 인정해주세요'
  },
  '乙': {
    trustIssue: '맞추다 보니 진짜 자신을 잃어버린 느낌입니다',
    abandonmentFear: '거절당하면 모든 게 끝난다고 느낍니다',
    betrayalExperience: '착하게 굴었는데 이용당한 경험이 있어요',
    boundaryProblem: '싫은 것을 싫다고 말하지 못해 쌓인 분노가 있습니다',
    healingPath: '당신의 "아니오"도 사랑입니다. 자신을 지키는 것도 배려예요'
  },
  '丙': {
    trustIssue: '겉으로 밝지만 속마음을 나누기 어렵습니다',
    abandonmentFear: '관심이 사라지면 존재감이 없어지는 느낌입니다',
    betrayalExperience: '열정을 쏟았던 관계에서 차갑게 외면당한 적이 있어요',
    boundaryProblem: '너무 많이 주다가 지쳐버린 경험이 있습니다',
    healingPath: '밝지 않아도 당신은 가치 있습니다. 쉬어도 괜찮아요'
  },
  '丁': {
    trustIssue: '상대의 진심을 의심하게 됩니다',
    abandonmentFear: '혼자 남겨지면 어떡하나 하는 불안이 있습니다',
    betrayalExperience: '섬세하게 배려했는데 무신경하게 대우받은 적이 있어요',
    boundaryProblem: '상대 감정에 너무 휘둘려서 지칩니다',
    healingPath: '모든 관계에 완벽할 필요 없습니다. 나를 위한 시간도 필요해요'
  },
  '戊': {
    trustIssue: '기대어도 되는 사람인지 확인하기 어렵습니다',
    abandonmentFear: '내가 약해지면 모두 떠날 것 같습니다',
    betrayalExperience: '든든하게 지켜줬는데 당연하게 여겨진 적이 있어요',
    boundaryProblem: '모든 걸 혼자 감당하려다 무너진 적이 있습니다',
    healingPath: '당신도 기댈 곳이 필요합니다. 도움을 요청해도 괜찮아요'
  },
  '己': {
    trustIssue: '진심을 표현하면 부담스러워할까 걱정됩니다',
    abandonmentFear: '내가 부족해서 떠나는 거라고 생각합니다',
    betrayalExperience: '조용히 도왔는데 공로를 빼앗긴 경험이 있어요',
    boundaryProblem: '자기 욕구를 말하지 못해 억울함이 쌓입니다',
    healingPath: '당신의 욕구도 중요합니다. 말해도 괜찮아요'
  },
  '庚': {
    trustIssue: '사람들이 원칙 없이 움직이면 신뢰하기 어렵습니다',
    abandonmentFear: '내 방식대로 하면 사람들이 떠날까 걱정됩니다',
    betrayalExperience: '정의를게 행동했는데 배신당한 경험이 있어요',
    boundaryProblem: '너무 직설적으로 말해서 관계가 멀어진 적이 있습니다',
    healingPath: '옳은 말도 방법이 필요합니다. 마음을 먼저 전해보세요'
  },
  '辛': {
    trustIssue: '상대가 진심인지 끊임없이 테스트하게 됩니다',
    abandonmentFear: '완벽하지 않으면 사랑받을 자격이 없다고 느낍니다',
    betrayalExperience: '진심을 다했는데 가볍게 여겨진 적이 있어요',
    boundaryProblem: '기대치가 높아서 실망하는 일이 많습니다',
    healingPath: '불완전함도 매력입니다. 완벽하지 않아도 사랑받을 수 있어요'
  },
  '壬': {
    trustIssue: '"배신"이라는 단어에 유독 민감합니다',
    abandonmentFear: '깊이 연결되면 그만큼 상처도 깊을까 두렵습니다',
    betrayalExperience: '100% 신뢰했던 사람에게 크게 실망한 후 문을 닫았어요',
    boundaryProblem: '마음을 열면 모든 걸 주는데, 그래서 지칩니다',
    healingPath: '천천히 열어도 괜찮습니다. 시간을 두고 신뢰를 쌓아가세요'
  },
  '癸': {
    trustIssue: '현실적인 사람을 만나면 내가 이상하게 느껴집니다',
    abandonmentFear: '나를 이해해주는 사람이 없을 것 같습니다',
    betrayalExperience: '꿈을 함께 꾸던 사람이 현실을 핑계로 떠났어요',
    boundaryProblem: '감정이입이 심해서 상대의 고통을 내 것처럼 느낍니다',
    healingPath: '당신과 파장이 맞는 사람은 분명 있습니다. 기다려주세요'
  }
};

// ========== 3. 배우자 갈등 패턴 (50대 핵심) ==========
export const SPOUSE_CONFLICT_PATTERNS: Record<string, {
  myExpressionStyle: string;     // 나의 표현 방식
  partnerMisunderstanding: string; // 배우자의 오해
  hiddenNeed: string;            // 숨겨진 욕구
  conflictTrigger: string;       // 갈등 촉발점
  reconciliationTip: string;     // 화해 팁
}> = {
  '甲': {
    myExpressionStyle: '직접적으로 의견을 말하고 결정을 주도합니다',
    partnerMisunderstanding: '배우자는 "왜 항상 당신 마음대로야"라고 느낄 수 있어요',
    hiddenNeed: '인정과 존중을 받고 싶어합니다',
    conflictTrigger: '의견이 무시당할 때 폭발합니다',
    reconciliationTip: '"당신 의견은 어때?"라고 먼저 물어보세요. 작은 양보가 큰 화해가 됩니다'
  },
  '乙': {
    myExpressionStyle: '맞추려고 하고 갈등을 피합니다',
    partnerMisunderstanding: '배우자는 "진짜 속마음을 모르겠다"고 느낄 수 있어요',
    hiddenNeed: '안전하게 진심을 말할 수 있는 환경이 필요합니다',
    conflictTrigger: '참다 참다 한꺼번에 터집니다',
    reconciliationTip: '작은 것부터 솔직히 말해보세요. "사실 나는..."으로 시작해보세요'
  },
  '丙': {
    myExpressionStyle: '열정적으로 표현하고 관심을 많이 줍니다',
    partnerMisunderstanding: '배우자는 "부담스럽다", "왜 이렇게 과하니"라고 느낄 수 있어요',
    hiddenNeed: '같은 온도의 반응을 원합니다',
    conflictTrigger: '무관심하게 대우받을 때 상처받습니다',
    reconciliationTip: '배우자의 표현 방식이 다를 뿐, 사랑이 없는 게 아닙니다'
  },
  '丁': {
    myExpressionStyle: '섬세하게 배려하고 분위기를 읽습니다',
    partnerMisunderstanding: '배우자는 "왜 말을 안 하고 눈치만 보니"라고 느낄 수 있어요',
    hiddenNeed: '내 배려를 알아주길 원합니다',
    conflictTrigger: '무신경한 말 한마디에 깊이 상처받습니다',
    reconciliationTip: '기대를 말로 표현하세요. 배우자는 눈치채지 못할 수 있어요'
  },
  '戊': {
    myExpressionStyle: '묵묵히 행동으로 보여줍니다',
    partnerMisunderstanding: '배우자는 "왜 말이 없어", "감정이 있기는 해?"라고 느낄 수 있어요',
    hiddenNeed: '내 방식대로 사랑해도 인정받고 싶습니다',
    conflictTrigger: '당연하게 여겨질 때 서운합니다',
    reconciliationTip: '사랑한다는 말을 해보세요. 행동만으로는 전달이 안 될 수 있어요'
  },
  '己': {
    myExpressionStyle: '조용히 뒷바라지하며 챙깁니다',
    partnerMisunderstanding: '배우자는 "잔소리가 많다", "왜 그렇게 걱정해"라고 느낄 수 있어요',
    hiddenNeed: '고마움을 표현받고 싶습니다',
    conflictTrigger: '노력이 무시당할 때 억울합니다',
    reconciliationTip: '"걱정돼서 그래"라고 마음을 먼저 말해보세요'
  },
  '庚': {
    myExpressionStyle: '문제를 지적하고 해결책을 제시합니다',
    partnerMisunderstanding: '배우자는 "왜 항상 비판적이야"라고 느낄 수 있어요',
    hiddenNeed: '가정을 더 좋게 만들고 싶은 마음입니다',
    conflictTrigger: '비효율적인 상황을 참기 어렵습니다',
    reconciliationTip: '지적 전에 "당신 덕분에 좋아진 것"을 먼저 말해보세요'
  },
  '辛': {
    myExpressionStyle: '디테일을 신경 쓰고 기준이 높습니다',
    partnerMisunderstanding: '배우자는 "왜 이렇게 까다로워"라고 느낄 수 있어요',
    hiddenNeed: '노력을 인정받고 싶습니다',
    conflictTrigger: '대충 하는 것을 보면 실망합니다',
    reconciliationTip: '배우자의 노력도 인정해주세요. 기준이 다를 뿐이에요'
  },
  '壬': {
    myExpressionStyle: '깊이 생각하고 혼자 정리한 후 말합니다',
    partnerMisunderstanding: '배우자는 "왜 말을 안 해", "뭘 숨기니"라고 느낄 수 있어요',
    hiddenNeed: '내 깊은 생각을 이해받고 싶습니다',
    conflictTrigger: '성급하게 답을 요구받을 때 답답합니다',
    reconciliationTip: '"생각 중이야, 시간 좀 줘"라고 과정을 공유해보세요'
  },
  '癸': {
    myExpressionStyle: '감정적으로 반응하고 직감을 따릅니다',
    partnerMisunderstanding: '배우자는 "논리적으로 말해", "현실적으로 생각해"라고 느낄 수 있어요',
    hiddenNeed: '감정을 있는 그대로 받아주길 원합니다',
    conflictTrigger: '"그게 뭐가 중요해"라는 말에 상처받습니다',
    reconciliationTip: '배우자의 현실적 조언도 사랑의 표현입니다. 방식이 다를 뿐이에요'
  }
};

// ========== 4. 자녀 관계 분석 (50대 핵심) ==========
export const CHILD_RELATIONSHIP: Record<string, {
  parentingStyle: string;        // 양육 스타일
  strengthAsParent: string;      // 부모로서 강점
  blindSpot: string;             // 사각지대
  childPerspective: string;      // 자녀 입장
  communicationTip: string;      // 소통 팁
  regretHealing: string;         // 후회 치유
}> = {
  '甲': {
    parentingStyle: '올바른 길을 제시하고 이끌려는 부모',
    strengthAsParent: '자녀에게 명확한 방향과 원칙을 심어줍니다',
    blindSpot: '자녀의 다른 선택을 존중하기 어려울 수 있어요',
    childPerspective: '자녀는 인정받고 싶지만, 압박감을 느낄 수 있습니다',
    communicationTip: '조언 전에 "어떻게 생각해?"라고 먼저 물어보세요',
    regretHealing: '당신의 방식이 틀린 게 아닙니다. 사랑의 표현이 달랐을 뿐이에요'
  },
  '乙': {
    parentingStyle: '자녀의 편에서 이해하고 공감하는 부모',
    strengthAsParent: '자녀가 편하게 마음을 열 수 있는 환경을 만듭니다',
    blindSpot: '필요한 훈계를 못 하고 넘어갈 수 있어요',
    childPerspective: '자녀는 따뜻함을 느끼지만, 때로는 단호함을 원할 수 있습니다',
    communicationTip: '때로는 "안 돼"라고 말해도 괜찮아요',
    regretHealing: '당신의 따뜻함이 자녀에게 안전 기지가 되었습니다'
  },
  '丙': {
    parentingStyle: '열정적으로 응원하고 함께하는 부모',
    strengthAsParent: '자녀에게 꿈을 심어주고 가능성을 믿어줍니다',
    blindSpot: '기대가 커서 자녀가 부담을 느낄 수 있어요',
    childPerspective: '자녀는 사랑받는다고 느끼지만, 기대에 못 미칠까 불안할 수 있습니다',
    communicationTip: '"결과와 상관없이 널 사랑해"라고 말해주세요',
    regretHealing: '당신의 응원이 자녀에게 용기를 주었습니다'
  },
  '丁': {
    parentingStyle: '자녀의 감정을 세심하게 읽는 부모',
    strengthAsParent: '자녀의 미묘한 변화도 놓치지 않습니다',
    blindSpot: '자녀가 독립하려 할 때 불안할 수 있어요',
    childPerspective: '자녀는 이해받는다고 느끼지만, 때로는 혼자 해보고 싶을 수 있습니다',
    communicationTip: '필요할 때 부를게, 라고 말할 공간을 주세요',
    regretHealing: '당신의 관심이 자녀에게 든든한 버팀목이었습니다'
  },
  '戊': {
    parentingStyle: '묵묵히 뒤에서 지켜보는 부모',
    strengthAsParent: '자녀에게 안정감과 신뢰를 줍니다',
    blindSpot: '감정 표현이 부족해서 서먹할 수 있어요',
    childPerspective: '자녀는 든든하지만, 마음을 모르겠다고 느낄 수 있습니다',
    communicationTip: '"사랑한다", "자랑스럽다"를 말로 표현해보세요',
    regretHealing: '당신이 있어서 자녀가 세상을 두려워하지 않았습니다'
  },
  '己': {
    parentingStyle: '세심하게 챙기고 걱정하는 부모',
    strengthAsParent: '자녀의 필요를 미리 파악해서 준비해줍니다',
    blindSpot: '걱정이 잔소리로 느껴질 수 있어요',
    childPerspective: '자녀는 챙김받는다고 느끼지만, 간섭으로 느낄 수 있습니다',
    communicationTip: '걱정 대신 "믿어"라고 말해보세요',
    regretHealing: '당신의 정성이 자녀를 건강하게 키웠습니다'
  },
  '庚': {
    parentingStyle: '원칙과 기준을 가르치는 부모',
    strengthAsParent: '자녀에게 옳고 그름을 명확히 알려줍니다',
    blindSpot: '유연성이 부족해 보일 수 있어요',
    childPerspective: '자녀는 배우지만, 인정받고 싶어할 수 있습니다',
    communicationTip: '칭찬부터, 그다음 조언을 해보세요',
    regretHealing: '당신 덕분에 자녀가 바른 가치관을 갖게 되었습니다'
  },
  '辛': {
    parentingStyle: '세련되고 품격 있게 키우는 부모',
    strengthAsParent: '자녀의 안목과 취향을 높여줍니다',
    blindSpot: '기준이 높아서 자녀가 부담을 느낄 수 있어요',
    childPerspective: '자녀는 배우지만, 완벽해야 한다는 압박을 느낄 수 있습니다',
    communicationTip: '"최선을 다했으면 충분해"라고 말해주세요',
    regretHealing: '당신의 안목이 자녀를 특별하게 만들었습니다'
  },
  '壬': {
    parentingStyle: '자녀의 잠재력을 깊이 이해하는 부모',
    strengthAsParent: '자녀의 숨은 재능을 발견해줍니다',
    blindSpot: '표현이 부족해서 관심이 없는 것처럼 보일 수 있어요',
    childPerspective: '자녀는 자유롭지만, 관심이 있는지 궁금할 수 있습니다',
    communicationTip: '적극적으로 관심을 표현해보세요',
    regretHealing: '당신의 믿음이 자녀에게 자유를 주었습니다'
  },
  '癸': {
    parentingStyle: '자녀의 감성과 꿈을 키워주는 부모',
    strengthAsParent: '자녀의 상상력과 창의성을 존중합니다',
    blindSpot: '현실적인 조언이 부족할 수 있어요',
    childPerspective: '자녀는 이해받지만, 현실적 가이드가 필요할 수 있습니다',
    communicationTip: '꿈과 현실 사이의 다리를 함께 만들어주세요',
    regretHealing: '당신 덕분에 자녀가 꿈꾸는 법을 배웠습니다'
  }
};

// ========== 5. 건강 구체적 예측 ==========
export const HEALTH_PREDICTIONS: Record<Element, {
  vulnerableOrgans: string[];    // 취약 장기
  commonSymptoms: string[];      // 흔한 증상
  ageRelatedRisks: string;       // 연령 관련 위험
  preventionTips: string[];      // 예방법
  goldenTime: string;            // 최적 시간
}> = {
  'wood': {
    vulnerableOrgans: ['간', '담낭', '눈', '근육', '손톱'],
    commonSymptoms: ['시력 저하', '근육 경직', '쉽게 피로함', '손톱 깨짐', '두통'],
    ageRelatedRisks: '40대 이후 간 기능 저하, 눈 침침함 주의',
    preventionTips: [
      '새벽 5-7시 가벼운 산책 (간 해독 시간)',
      '초록색 채소 섭취 (시금치, 브로콜리)',
      '분노를 삭이지 말고 글로 적어서 해소',
      '봄에 특히 간 건강 체크'
    ],
    goldenTime: '새벽 1-3시(간), 5-7시(대장) 숙면 중요'
  },
  'fire': {
    vulnerableOrgans: ['심장', '소장', '혀', '혈관', '안면'],
    commonSymptoms: ['가슴 두근거림', '불면증', '손발 저림', '안면 홍조', '혀 갈라짐'],
    ageRelatedRisks: '50대 이후 심혈관 질환, 혈압 변동 주의',
    preventionTips: [
      '점심(11-13시) 이후 20분 휴식',
      '붉은색 음식 섭취 (토마토, 대추)',
      '과도한 흥분, 기쁨도 심장에 부담',
      '여름에 특히 심장 건강 체크'
    ],
    goldenTime: '오전 11시-오후 1시 휴식 필수'
  },
  'earth': {
    vulnerableOrgans: ['비장', '위장', '입술', '근육', '피부'],
    commonSymptoms: ['소화불량', '복부 팽만', '입술 트기', '무기력함', '부종'],
    ageRelatedRisks: '60대 이후 당뇨, 소화기 약화 주의',
    preventionTips: [
      '식사 시간 규칙적으로 (위장 리듬)',
      '노란색 음식 섭취 (호박, 고구마, 바나나)',
      '과도한 걱정이 비장을 손상시킴',
      '환절기에 특히 소화기 건강 체크'
    ],
    goldenTime: '오전 7-9시(위), 9-11시(비장) 아침 중요'
  },
  'metal': {
    vulnerableOrgans: ['폐', '대장', '피부', '코', '기관지'],
    commonSymptoms: ['호흡 얕음', '피부 건조', '변비', '만성 기침', '알레르기'],
    ageRelatedRisks: '55대 이후 폐 기능 저하, 호흡기 질환 주의',
    preventionTips: [
      '새벽 3-5시 숙면 (폐 재생 시간)',
      '흰색 음식 섭취 (도라지, 배, 무)',
      '슬픔을 너무 삭이지 말고 표현',
      '가을에 특히 폐 건강 체크'
    ],
    goldenTime: '새벽 3-5시(폐) 깊은 수면 중요'
  },
  'water': {
    vulnerableOrgans: ['신장', '방광', '귀', '뼈', '머리카락'],
    commonSymptoms: ['허리 시림', '이명', '야간 빈뇨', '탈모', '무릎 시림'],
    ageRelatedRisks: '50대 이후 신장 기능 저하, 뼈 약화 주의',
    preventionTips: [
      '오후 5-7시 충분한 수분 섭취 (신장 활성 시간)',
      '검은색 음식 섭취 (검은콩, 검은깨, 미역)',
      '공포와 불안이 신장을 손상시킴',
      '겨울에 특히 신장 건강 체크'
    ],
    goldenTime: '오후 5-7시(신장) 물 마시기, 저녁 휴식'
  }
};

// ========== 6. 인생 2막 / 숨겨진 꿈 분석 ==========
export const HIDDEN_DREAMS: Record<string, {
  childhoodDream: string;      // 어린 시절 꿈
  suppressedBy: string;        // 억압한 이유
  lateBloomingTalent: string;  // 늦깎이 재능
  secondActSuggestion: string; // 2막 제안
  startingPoint: string;       // 시작점
}> = {
  '甲': {
    childhoodDream: '리더, 사업가, 정치인, 운동선수',
    suppressedBy: '현실적인 직업을 선택해야 했습니다',
    lateBloomingTalent: '사람들을 이끄는 카리스마와 추진력',
    secondActSuggestion: '동호회 회장, 봉사단체 리더, 마을 이장, 창업 멘토',
    startingPoint: '작은 모임부터 이끌어보세요. 당신에겐 사람을 모으는 힘이 있어요'
  },
  '乙': {
    childhoodDream: '예술가, 상담사, 교사, 간호사',
    suppressedBy: '다른 사람을 먼저 챙기느라 자신의 꿈을 뒤로 미뤘습니다',
    lateBloomingTalent: '사람의 마음을 치유하는 공감 능력',
    secondActSuggestion: '원예, 플라워 아트, 상담 봉사, 동화 작가',
    startingPoint: '식물을 키우거나 글을 써보세요. 작은 것부터 시작해도 됩니다'
  },
  '丙': {
    childhoodDream: '배우, 아나운서, 강사, 연예인',
    suppressedBy: '안정적인 길을 가야 했습니다',
    lateBloomingTalent: '무대 위에서 빛나는 퍼포먼스와 열정',
    secondActSuggestion: '유튜브 크리에이터, 강연자, 연극 동호회, 트로트 가수',
    startingPoint: '스마트폰 하나로 시작하세요. 당신의 이야기가 콘텐츠가 됩니다'
  },
  '丁': {
    childhoodDream: '작가, 화가, 디자이너, 심리학자',
    suppressedBy: '예술로는 먹고살기 어렵다는 말에 접었습니다',
    lateBloomingTalent: '아름다움을 포착하는 섬세한 감각',
    secondActSuggestion: '수필 작가, 캘리그라피, 인테리어 소품 제작, 마음 상담',
    startingPoint: '하루 10분 일기부터 시작해보세요. 당신의 언어가 작품이 됩니다'
  },
  '戊': {
    childhoodDream: '건축가, 농부, 사업가, 부동산 전문가',
    suppressedBy: '가족을 책임지느라 도전하지 못했습니다',
    lateBloomingTalent: '무에서 유를 창조하는 뚝심과 신뢰감',
    secondActSuggestion: '주말농장, 게스트하우스, 목공예, 부동산 컨설팅',
    startingPoint: '작은 텃밭이나 취미 목공부터 시작해보세요'
  },
  '己': {
    childhoodDream: '요리사, 영양사, 교육자, 사회복지사',
    suppressedBy: '눈에 띄지 않는 일이라 주목받지 못했습니다',
    lateBloomingTalent: '사람을 돌보고 키우는 양육 본능',
    secondActSuggestion: '홈쿠킹 클래스, 반찬 사업, 어린이집 봉사, 힐링캠프 운영',
    startingPoint: '요리 레시피를 정리하거나 손주 돌봄에서 시작해보세요'
  },
  '庚': {
    childhoodDream: '검사, 군인, 수사관, 외과의사',
    suppressedBy: '현실적인 조건이 맞지 않았습니다',
    lateBloomingTalent: '정의를 실현하고 문제를 해결하는 추진력',
    secondActSuggestion: '법률 상담 봉사, 분쟁 조정, 헬스 트레이너, 공정거래 감시',
    startingPoint: '동네 민원 해결사로 시작해보세요. 당신의 정의감이 필요한 곳이 있어요'
  },
  '辛': {
    childhoodDream: '보석 디자이너, 패션 디자이너, 평론가, 큐레이터',
    suppressedBy: '예술 분야의 불안정함 때문에 포기했습니다',
    lateBloomingTalent: '아름다움을 감별하는 날카로운 안목',
    secondActSuggestion: '핸드메이드 주얼리, 빈티지 숍, 미술관 도슨트, 패션 블로그',
    startingPoint: '좋아하는 분야의 전시회부터 다녀보세요. 안목이 자산이 됩니다'
  },
  '壬': {
    childhoodDream: '철학자, 작가, 탐험가, 과학자',
    suppressedBy: '현실과 동떨어진 꿈이라고 여겼습니다',
    lateBloomingTalent: '깊이 있는 통찰력과 지혜',
    secondActSuggestion: '여행 작가, 명상 지도자, 인생 멘토, 팟캐스트 운영',
    startingPoint: '생각을 글로 정리하거나 여행 기록을 남겨보세요'
  },
  '癸': {
    childhoodDream: '시인, 음악가, 영화감독, 점술가',
    suppressedBy: '"현실적으로 생각해"라는 말에 꿈을 접었습니다',
    lateBloomingTalent: '영감을 포착하는 예민한 감수성',
    secondActSuggestion: '시 동인, 음악 감상 모임, 타로 상담, 힐링 음악 제작',
    startingPoint: '매일 하나씩 시를 읽거나 음악을 들으며 감상을 적어보세요'
  }
};

// ========== 7. 연령대별 핵심 공감 메시지 ==========
type AgeGroup = 'youth' | 'adult' | 'middle' | 'senior';

export const AGE_SPECIFIC_MESSAGES: Record<AgeGroup, {
  lifeStage: string;           // 인생 단계
  currentChallenge: string;    // 현재 도전
  deepNeed: string;            // 깊은 욕구
  validationMessage: string;   // 인정 메시지
  futureHope: string;          // 미래 희망
}> = {
  'youth': {
    lifeStage: '가능성을 탐색하는 시기',
    currentChallenge: '진로, 취업, 정체성 확립',
    deepNeed: '내가 잘할 수 있는 게 뭔지 알고 싶다',
    validationMessage: '아직 답을 못 찾아도 괜찮아요. 찾아가는 과정 자체가 성장입니다',
    futureHope: '당신만의 길이 반드시 열립니다'
  },
  'adult': {
    lifeStage: '기반을 다지는 시기',
    currentChallenge: '커리어 성장, 가정 형성, 경제적 안정',
    deepNeed: '내가 잘하고 있는 건지 확인받고 싶다',
    validationMessage: '지금 당신은 충분히 잘하고 있습니다. 보이지 않는 곳에서도 성장하고 있어요',
    futureHope: '지금의 노력이 10년 후 큰 열매가 됩니다'
  },
  'middle': {
    lifeStage: '수확과 전환의 시기',
    currentChallenge: '커리어 정점/전환, 자녀 독립, 건강 관리',
    deepNeed: '지금까지 살아온 게 의미 있었는지 알고 싶다',
    validationMessage: '당신이 걸어온 길에 의미 없는 것은 없습니다. 모든 경험이 지금의 지혜가 되었어요',
    futureHope: '인생 후반전이 더 빛나는 사람들이 있습니다. 당신이 그런 사람이에요'
  },
  'senior': {
    lifeStage: '완성과 전수의 시기',
    currentChallenge: '건강, 관계 재정립, 유산(legacy) 고민',
    deepNeed: '내 삶이 의미 있었는지, 남기고 싶다',
    validationMessage: '당신의 삶은 이미 많은 사람에게 영향을 주었습니다. 존재 자체가 의미입니다',
    futureHope: '당신의 이야기와 지혜가 다음 세대의 등불이 됩니다'
  }
};

// ========== 헬퍼 함수 ==========

/**
 * 나이에 따른 연령 그룹 반환
 */
export function getAgeGroup(age: number): AgeGroup {
  if (age < 30) return 'youth';
  if (age < 45) return 'adult';
  if (age < 60) return 'middle';
  return 'senior';
}

/**
 * 일간으로 주요 오행 찾기
 */
export function getDayMasterElement(dayStem: string): Element {
  const mapping: Record<string, Element> = {
    '甲': 'wood', '乙': 'wood',
    '丙': 'fire', '丁': 'fire',
    '戊': 'earth', '己': 'earth',
    '庚': 'metal', '辛': 'metal',
    '壬': 'water', '癸': 'water'
  };
  return mapping[dayStem] || 'wood';
}

/**
 * 나이 계산 (만 나이)
 */
export function calculateAge(birthDate: string): number {
  const birth = new Date(birthDate);
  const today = new Date();
  let age = today.getFullYear() - birth.getFullYear();
  const monthDiff = today.getMonth() - birth.getMonth();
  if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birth.getDate())) {
    age--;
  }
  return age;
}
