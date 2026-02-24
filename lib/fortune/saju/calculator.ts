/**
 * 사주 계산기 (Four Pillars Calculator)
 * 년주, 월주, 일주, 시주 계산
 */

import { SajuChart, SajuPillar, Element } from '@/types/saju';

// 천간 (10개)
export const HEAVENLY_STEMS = ['甲', '乙', '丙', '丁', '戊', '己', '庚', '辛', '壬', '癸'];
export const HEAVENLY_STEMS_KO = ['갑', '을', '병', '정', '무', '기', '경', '신', '임', '계'];

// 지지 (12개)
export const EARTHLY_BRANCHES = ['子', '丑', '寅', '卯', '辰', '巳', '午', '未', '申', '酉', '戌', '亥'];
export const EARTHLY_BRANCHES_KO = ['자', '축', '인', '묘', '진', '사', '오', '미', '신', '유', '술', '해'];

// 천간 오행 매핑
export const STEM_ELEMENTS: Record<string, Element> = {
  '甲': 'wood', '乙': 'wood',
  '丙': 'fire', '丁': 'fire',
  '戊': 'earth', '己': 'earth',
  '庚': 'metal', '辛': 'metal',
  '壬': 'water', '癸': 'water'
};

// 지지 오행 매핑
export const BRANCH_ELEMENTS: Record<string, Element> = {
  '寅': 'wood', '卯': 'wood',
  '巳': 'fire', '午': 'fire',
  '辰': 'earth', '戌': 'earth', '丑': 'earth', '未': 'earth',
  '申': 'metal', '酉': 'metal',
  '亥': 'water', '子': 'water'
};

// 띠 이름
export const ZODIAC_NAMES: Record<string, string> = {
  '子': '쥐', '丑': '소', '寅': '호랑이', '卯': '토끼',
  '辰': '용', '巳': '뱀', '午': '말', '未': '양',
  '申': '원숭이', '酉': '닭', '戌': '개', '亥': '돼지'
};

// 60갑자
export const SIXTY_JIAZI: string[] = [];
for (let i = 0; i < 60; i++) {
  SIXTY_JIAZI.push(HEAVENLY_STEMS[i % 10] + EARTHLY_BRANCHES[i % 12]);
}

/**
 * 진태양시(True Solar Time) 조정
 * 한국 표준시(KST)는 135°E 경도 기준이지만, 서울은 127°E에 위치
 * 경도 차이: 135° - 127° = 8°
 * 시간 차이: 8° × 4분/° = 32분
 * 따라서 한국에서 진태양시 = 시계시간 - 32분
 */
const KOREA_LONGITUDE_CORRECTION_MINUTES = 32;

// 절기 데이터 (2024-2030년 주요 절기)
// 실제 서비스에서는 만세력 API나 더 정확한 데이터 사용 권장
const SOLAR_TERMS_DATA: Record<number, Record<number, number>> = {
  // year: { month: day } - 해당 월의 절기 시작일
  2024: { 1: 6, 2: 4, 3: 5, 4: 4, 5: 5, 6: 5, 7: 6, 8: 7, 9: 7, 10: 8, 11: 7, 12: 7 },
  2025: { 1: 5, 2: 3, 3: 5, 4: 4, 5: 5, 6: 5, 7: 7, 8: 7, 9: 7, 10: 8, 11: 7, 12: 7 },
  2026: { 1: 5, 2: 4, 3: 5, 4: 5, 5: 5, 6: 5, 7: 7, 8: 7, 9: 7, 10: 8, 11: 7, 12: 7 },
  2027: { 1: 5, 2: 4, 3: 5, 4: 5, 5: 5, 6: 6, 7: 7, 8: 7, 9: 8, 10: 8, 11: 7, 12: 7 },
  2028: { 1: 6, 2: 4, 3: 5, 4: 4, 5: 5, 6: 5, 7: 6, 8: 7, 9: 7, 10: 8, 11: 7, 12: 6 },
  2029: { 1: 5, 2: 3, 3: 5, 4: 4, 5: 5, 6: 5, 7: 6, 8: 7, 9: 7, 10: 8, 11: 7, 12: 7 },
  2030: { 1: 5, 2: 4, 3: 5, 4: 5, 5: 5, 6: 5, 7: 7, 8: 7, 9: 7, 10: 8, 11: 7, 12: 7 },
};

/**
 * 사주 계산 메인 함수
 */
export function calculateSaju(
  birthDate: string,
  birthTime?: string | null,
  isLunar: boolean = false
): SajuChart {
  // 음력일 경우 양력으로 변환 (간략화된 로직, 실제로는 음양력 변환 라이브러리 사용 권장)
  const date = isLunar ? convertLunarToSolar(birthDate) : new Date(birthDate);

  const year = date.getFullYear();
  const month = date.getMonth() + 1;
  const day = date.getDate();

  // 년주 계산
  const yearPillar = calculateYearPillar(year, month, day);

  // 월주 계산 (절기 기준)
  const monthPillar = calculateMonthPillar(year, month, day, yearPillar.heavenlyStem);

  // 일주 계산
  const dayPillar = calculateDayPillar(year, month, day);

  // 시주 계산 (시간 있을 경우)
  const timePillar = birthTime
    ? calculateTimePillar(dayPillar.heavenlyStem, birthTime)
    : undefined;

  return {
    year: yearPillar,
    month: monthPillar,
    day: dayPillar,
    time: timePillar
  };
}

/**
 * 년주 계산
 */
function calculateYearPillar(year: number, month: number, day: number): SajuPillar {
  // 입춘 전이면 전년도로 계산 (보통 2월 4일 전후)
  let adjustedYear = year;
  if (month === 1 || (month === 2 && day < 4)) {
    adjustedYear = year - 1;
  }

  // 갑자년 기준 (1984년 = 갑자년)
  const baseYear = 1984;
  const diff = adjustedYear - baseYear;

  const stemIndex = ((diff % 10) + 10) % 10;
  const branchIndex = ((diff % 12) + 12) % 12;

  return createPillar(stemIndex, branchIndex);
}

/**
 * 월주 계산 (절기 기준)
 */
function calculateMonthPillar(
  year: number,
  month: number,
  day: number,
  yearStem: string
): SajuPillar {
  // 절기 기준 월 계산
  const solarTermDay = getSolarTermDay(year, month);

  // 절기 이전이면 전월로 계산
  let adjustedMonth = month;
  if (day < solarTermDay) {
    adjustedMonth = month === 1 ? 12 : month - 1;
  }

  // 월지 인덱스 (인월=1월, 묘월=2월, ...)
  // 인(寅)=2, 묘(卯)=3, 진(辰)=4, 사(巳)=5, 오(午)=6, 미(未)=7
  // 신(申)=8, 유(酉)=9, 술(戌)=10, 해(亥)=11, 자(子)=12, 축(丑)=1
  const branchIndex = (adjustedMonth + 1) % 12;

  // 월간 계산: 년간에 따라 결정
  // 갑기년 -> 병인월 시작, 을경년 -> 무인월 시작, etc.
  const yearStemIndex = HEAVENLY_STEMS.indexOf(yearStem);
  const monthStemBase = [2, 4, 6, 8, 0, 2, 4, 6, 8, 0]; // 병, 무, 경, 임, 갑 순환
  const stemIndex = (monthStemBase[yearStemIndex] + adjustedMonth - 1) % 10;

  return createPillar(stemIndex, branchIndex);
}

/**
 * 일주 계산 (율리우스적일 기반)
 */
function calculateDayPillar(year: number, month: number, day: number): SajuPillar {
  // 율리우스적일 계산
  const a = Math.floor((14 - month) / 12);
  const y = year + 4800 - a;
  const m = month + 12 * a - 3;

  const julianDay = day + Math.floor((153 * m + 2) / 5) + 365 * y
    + Math.floor(y / 4) - Math.floor(y / 100) + Math.floor(y / 400) - 32045;

  // 갑자일 기준점 (1990년 1월 27일 = 갑자일)
  const baseJulianDay = 2447918; // 1990-01-27
  const diff = julianDay - baseJulianDay;

  const stemIndex = ((diff % 10) + 10) % 10;
  const branchIndex = ((diff % 12) + 12) % 12;

  return createPillar(stemIndex, branchIndex);
}

/**
 * 진태양시로 시간 조정 (한국 기준)
 * @param time HH:MM 형식의 시간 문자열
 * @returns 조정된 시간 (시, 분)
 */
function adjustToTrueSolarTime(time: string): { hours: number; minutes: number; adjustedHours: number } {
  const [hours, minutes = 0] = time.split(':').map(Number);

  // 총 분으로 변환 후 32분 빼기
  let totalMinutes = hours * 60 + minutes - KOREA_LONGITUDE_CORRECTION_MINUTES;

  // 음수 처리 (전날로 넘어가는 경우)
  if (totalMinutes < 0) {
    totalMinutes += 24 * 60; // 24시간 더하기
  }

  const adjustedHours = Math.floor(totalMinutes / 60);
  const adjustedMinutes = totalMinutes % 60;

  return {
    hours: adjustedHours,
    minutes: adjustedMinutes,
    adjustedHours: adjustedHours
  };
}

/**
 * 시주 계산 (진태양시 적용)
 */
function calculateTimePillar(dayStem: string, time: string): SajuPillar {
  // 진태양시로 조정 (한국 기준 -32분)
  const { adjustedHours } = adjustToTrueSolarTime(time);
  const hours = adjustedHours;

  // 시지 계산 (2시간 단위)
  // 子시: 23:00-00:59, 丑시: 01:00-02:59, ...
  let branchIndex: number;
  if (hours === 23 || hours === 0) {
    branchIndex = 0; // 子
  } else {
    branchIndex = Math.floor((hours + 1) / 2);
  }

  // 시간 계산: 일간 기준
  // 갑기일 -> 갑자시 시작, 을경일 -> 병자시 시작, etc.
  const dayStemIndex = HEAVENLY_STEMS.indexOf(dayStem);
  const hourStemBase = [0, 2, 4, 6, 8, 0, 2, 4, 6, 8]; // 갑, 병, 무, 경, 임 순환
  const stemIndex = (hourStemBase[dayStemIndex] + branchIndex) % 10;

  return createPillar(stemIndex, branchIndex);
}

/**
 * 주(柱) 객체 생성
 */
function createPillar(stemIndex: number, branchIndex: number): SajuPillar {
  const stem = HEAVENLY_STEMS[stemIndex];
  const branch = EARTHLY_BRANCHES[branchIndex];

  return {
    heavenlyStem: stem,
    earthlyBranch: branch,
    stemKorean: HEAVENLY_STEMS_KO[stemIndex],
    branchKorean: EARTHLY_BRANCHES_KO[branchIndex],
    element: STEM_ELEMENTS[stem],
    zodiac: ZODIAC_NAMES[branch]
  };
}

/**
 * 해당 년월의 절기 일자 반환
 */
function getSolarTermDay(year: number, month: number): number {
  const yearData = SOLAR_TERMS_DATA[year];
  if (yearData && yearData[month]) {
    return yearData[month];
  }
  // 기본값 (대략적인 절기일)
  const defaultDays: Record<number, number> = {
    1: 6, 2: 4, 3: 6, 4: 5, 5: 6, 6: 6,
    7: 7, 8: 8, 9: 8, 10: 8, 11: 7, 12: 7
  };
  return defaultDays[month] || 6;
}

/**
 * 음력 -> 양력 변환 (간략화된 버전)
 * 실제 서비스에서는 정확한 음양력 변환 라이브러리 사용 권장
 */
function convertLunarToSolar(lunarDateStr: string): Date {
  // 간략화된 변환 - 실제로는 음력 테이블 필요
  // 여기서는 대략 30일 정도 더하는 것으로 간략화
  const date = new Date(lunarDateStr);
  date.setDate(date.getDate() + 30);
  return date;
}

/**
 * 60갑자에서 인덱스 찾기
 */
export function findSixtyJiaziIndex(stem: string, branch: string): number {
  const combo = stem + branch;
  return SIXTY_JIAZI.indexOf(combo);
}

/**
 * 대운 계산
 */
export function calculateDaeun(
  saju: SajuChart,
  gender: 'male' | 'female',
  birthDate: string
): { age: number; stem: string; branch: string; element: Element }[] {
  const dayStem = saju.day.heavenlyStem;
  const monthStem = saju.month.heavenlyStem;
  const monthBranch = saju.month.earthlyBranch;

  // 양남음녀 순행, 음남양녀 역행
  const stemIndex = HEAVENLY_STEMS.indexOf(dayStem);
  const isYangStem = stemIndex % 2 === 0;
  const isForward = (isYangStem && gender === 'male') || (!isYangStem && gender === 'female');

  const monthStemIdx = HEAVENLY_STEMS.indexOf(monthStem);
  const monthBranchIdx = EARTHLY_BRANCHES.indexOf(monthBranch);

  const daeunList: { age: number; stem: string; branch: string; element: Element }[] = [];

  // 대운 시작 나이 계산 (간략화)
  const startAge = 3; // 실제로는 출생일과 절기 차이로 계산

  for (let i = 0; i < 10; i++) {
    const offset = isForward ? i + 1 : -(i + 1);
    const newStemIdx = ((monthStemIdx + offset) % 10 + 10) % 10;
    const newBranchIdx = ((monthBranchIdx + offset) % 12 + 12) % 12;

    const stem = HEAVENLY_STEMS[newStemIdx];
    const branch = EARTHLY_BRANCHES[newBranchIdx];

    daeunList.push({
      age: startAge + i * 10,
      stem,
      branch,
      element: STEM_ELEMENTS[stem]
    });
  }

  return daeunList;
}

/**
 * 세운 계산 (특정 연도의 운)
 */
export function calculateSeun(year: number): { stem: string; branch: string; element: Element } {
  const baseYear = 1984; // 갑자년
  const diff = year - baseYear;

  const stemIndex = ((diff % 10) + 10) % 10;
  const branchIndex = ((diff % 12) + 12) % 12;

  const stem = HEAVENLY_STEMS[stemIndex];
  const branch = EARTHLY_BRANCHES[branchIndex];

  return {
    stem,
    branch,
    element: STEM_ELEMENTS[stem]
  };
}

/**
 * 월운 계산
 */
export function calculateWolun(year: number, month: number): { stem: string; branch: string; element: Element } {
  const seun = calculateSeun(year);
  const yearStemIndex = HEAVENLY_STEMS.indexOf(seun.stem);

  const branchIndex = (month + 1) % 12;
  const monthStemBase = [2, 4, 6, 8, 0, 2, 4, 6, 8, 0];
  const stemIndex = (monthStemBase[yearStemIndex] + month - 1) % 10;

  const stem = HEAVENLY_STEMS[stemIndex];
  const branch = EARTHLY_BRANCHES[branchIndex];

  return {
    stem,
    branch,
    element: STEM_ELEMENTS[stem]
  };
}

/**
 * 나이 계산
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

/**
 * 만세 (한국 나이) 계산
 */
export function calculateKoreanAge(birthDate: string): number {
  const birth = new Date(birthDate);
  const today = new Date();
  return today.getFullYear() - birth.getFullYear() + 1;
}
