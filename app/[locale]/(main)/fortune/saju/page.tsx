'use client';

import { useState, useEffect, useCallback } from 'react';
import { useTranslations } from 'next-intl';
import { useRouter, Link } from '@/i18n/routing';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Progress } from '@/components/ui/progress';
import { Sparkles, ArrowRight, Loader2, Zap, Star, Heart, Briefcase, Activity, Lock, Save, User, Crown, Brain, Target, TrendingUp, Calendar, Shield } from 'lucide-react';
import { createClient } from '@/lib/supabase/client';

// Admin email for full access
const ADMIN_EMAIL = 'mymiryu@naver.com';

// Generate hour options for birth time
const birthHours = Array.from({ length: 24 }, (_, i) => ({
  value: i.toString().padStart(2, '0'),
  label: `${i.toString().padStart(2, '0')}:00 - ${i.toString().padStart(2, '0')}:59`,
}));

// Blood type options
const bloodTypes = [
  { value: 'A', label: 'A형' },
  { value: 'B', label: 'B형' },
  { value: 'O', label: 'O형' },
  { value: 'AB', label: 'AB형' },
];

// MBTI options
const mbtiTypes = [
  'ISTJ', 'ISFJ', 'INFJ', 'INTJ',
  'ISTP', 'ISFP', 'INFP', 'INTP',
  'ESTP', 'ESFP', 'ENFP', 'ENTP',
  'ESTJ', 'ESFJ', 'ENFJ', 'ENTJ',
];

// Zodiac signs (Western)
const zodiacSigns = [
  { value: 'aries', label: '양자리 (3/21-4/19)' },
  { value: 'taurus', label: '황소자리 (4/20-5/20)' },
  { value: 'gemini', label: '쌍둥이자리 (5/21-6/20)' },
  { value: 'cancer', label: '게자리 (6/21-7/22)' },
  { value: 'leo', label: '사자자리 (7/23-8/22)' },
  { value: 'virgo', label: '처녀자리 (8/23-9/22)' },
  { value: 'libra', label: '천칭자리 (9/23-10/22)' },
  { value: 'scorpio', label: '전갈자리 (10/23-11/21)' },
  { value: 'sagittarius', label: '궁수자리 (11/22-12/21)' },
  { value: 'capricorn', label: '염소자리 (12/22-1/19)' },
  { value: 'aquarius', label: '물병자리 (1/20-2/18)' },
  { value: 'pisces', label: '물고기자리 (2/19-3/20)' },
];

// Sasang Constitution (사상체질)
const sasangTypes = [
  { value: 'taeyang', label: '태양인 (太陽人)' },
  { value: 'soyang', label: '소양인 (少陽人)' },
  { value: 'taeeum', label: '태음인 (太陰人)' },
  { value: 'soeum', label: '소음인 (少陰人)' },
  { value: 'unknown', label: '모름' },
];

// Tarot card options for selection
const tarotCards = [
  { value: 'fool', label: '바보 (The Fool)' },
  { value: 'magician', label: '마법사 (The Magician)' },
  { value: 'high_priestess', label: '여사제 (High Priestess)' },
  { value: 'empress', label: '여황제 (The Empress)' },
  { value: 'emperor', label: '황제 (The Emperor)' },
  { value: 'hierophant', label: '교황 (Hierophant)' },
  { value: 'lovers', label: '연인 (The Lovers)' },
  { value: 'chariot', label: '전차 (The Chariot)' },
  { value: 'strength', label: '힘 (Strength)' },
  { value: 'hermit', label: '은둔자 (The Hermit)' },
  { value: 'wheel', label: '운명의 수레바퀴 (Wheel of Fortune)' },
  { value: 'justice', label: '정의 (Justice)' },
  { value: 'hanged', label: '매달린 사람 (Hanged Man)' },
  { value: 'death', label: '죽음 (Death)' },
  { value: 'temperance', label: '절제 (Temperance)' },
  { value: 'devil', label: '악마 (The Devil)' },
  { value: 'tower', label: '탑 (The Tower)' },
  { value: 'star', label: '별 (The Star)' },
  { value: 'moon', label: '달 (The Moon)' },
  { value: 'sun', label: '태양 (The Sun)' },
  { value: 'judgement', label: '심판 (Judgement)' },
  { value: 'world', label: '세계 (The World)' },
];

interface FormData {
  name: string;
  birthYear: string;
  birthMonth: string;
  birthDay: string;
  birthHour: string;
  gender: string;
  calendar: string;
  bloodType: string;
  mbti: string;
  zodiac: string;
  sasang: string;
  tarotCard: string;
}

interface UserProfile {
  id?: string;
  email?: string;
  formData: FormData;
  savedAt: string;
}

// Calculate age from birth year
function calculateAge(birthYear: string): number {
  const currentYear = new Date().getFullYear();
  return currentYear - parseInt(birthYear);
}

// Get zodiac sign from birth date
function getZodiacFromDate(month: string, day: string): string {
  const m = parseInt(month);
  const d = parseInt(day);

  if ((m === 3 && d >= 21) || (m === 4 && d <= 19)) return 'aries';
  if ((m === 4 && d >= 20) || (m === 5 && d <= 20)) return 'taurus';
  if ((m === 5 && d >= 21) || (m === 6 && d <= 20)) return 'gemini';
  if ((m === 6 && d >= 21) || (m === 7 && d <= 22)) return 'cancer';
  if ((m === 7 && d >= 23) || (m === 8 && d <= 22)) return 'leo';
  if ((m === 8 && d >= 23) || (m === 9 && d <= 22)) return 'virgo';
  if ((m === 9 && d >= 23) || (m === 10 && d <= 22)) return 'libra';
  if ((m === 10 && d >= 23) || (m === 11 && d <= 21)) return 'scorpio';
  if ((m === 11 && d >= 22) || (m === 12 && d <= 21)) return 'sagittarius';
  if ((m === 12 && d >= 22) || (m === 1 && d <= 19)) return 'capricorn';
  if ((m === 1 && d >= 20) || (m === 2 && d <= 18)) return 'aquarius';
  return 'pisces';
}

// Generate comprehensive analysis based on all inputs
function generateComprehensiveAnalysis(formData: FormData, isAdmin: boolean) {
  const age = calculateAge(formData.birthYear);
  const ageGroup = age < 30 ? '20대' : age < 40 ? '30대' : age < 50 ? '40대' : age < 60 ? '50대' : '60대 이상';

  // Four Pillars based on birth data
  const fourPillars = {
    year: { heavenly: '甲', earthly: '子', element: '목(木)' },
    month: { heavenly: '丙', earthly: '寅', element: '화(火)' },
    day: { heavenly: '戊', earthly: '午', element: '토(土)' },
    hour: { heavenly: '庚', earthly: '申', element: '금(金)' },
  };

  // Base scores with variations based on inputs
  const baseScores = {
    overall: 82 + (formData.mbti?.includes('E') ? 5 : 0),
    wealth: 78 + (formData.bloodType === 'O' ? 5 : 0),
    love: 80 + (formData.zodiac?.includes('libra') || formData.zodiac?.includes('leo') ? 8 : 0),
    career: 85 + (formData.mbti?.includes('J') ? 5 : 0),
    health: 75 + (formData.sasang === 'taeeum' ? 5 : formData.sasang === 'soeum' ? -3 : 0),
  };

  // Blood type analysis
  const bloodTypeAnalysis: Record<string, { personality: string[]; compatibility: string; advice: string }> = {
    'A': {
      personality: ['세심하고 꼼꼼한 성격', '책임감이 강함', '완벽주의 성향'],
      compatibility: 'O형, A형과 좋은 궁합',
      advice: '스트레스 관리가 중요합니다. 완벽을 추구하되 자신에게 너무 엄격하지 마세요.',
    },
    'B': {
      personality: ['자유로운 영혼', '창의적 사고', '독립적인 성향'],
      compatibility: 'AB형, O형과 좋은 궁합',
      advice: '집중력을 유지하면 큰 성과를 낼 수 있습니다.',
    },
    'O': {
      personality: ['리더십이 강함', '목표 지향적', '사교적인 성격'],
      compatibility: 'A형, B형과 좋은 궁합',
      advice: '열정을 조절하고 꾸준히 나아가면 성공합니다.',
    },
    'AB': {
      personality: ['이성적이고 논리적', '다재다능함', '적응력이 뛰어남'],
      compatibility: 'AB형, B형과 좋은 궁합',
      advice: '양면성을 잘 활용하면 어떤 상황에서도 빛납니다.',
    },
  };

  // MBTI analysis
  const mbtiAnalysis: Record<string, { strengths: string[]; career: string; relationship: string }> = {
    'INTJ': { strengths: ['전략적 사고', '독립적', '혁신적'], career: '연구원, 컨설턴트, 기획자', relationship: '깊고 의미있는 관계 선호' },
    'INTP': { strengths: ['분석적', '창의적', '논리적'], career: '프로그래머, 과학자, 분석가', relationship: '지적 교류 중시' },
    'ENTJ': { strengths: ['리더십', '결단력', '효율성'], career: '경영자, 변호사, 사업가', relationship: '파트너십 중시' },
    'ENTP': { strengths: ['혁신적', '논쟁적', '적응력'], career: '기업가, 마케터, 발명가', relationship: '지적 자극 필요' },
    'INFJ': { strengths: ['통찰력', '이상주의', '헌신적'], career: '상담사, 작가, 심리학자', relationship: '깊은 유대감 추구' },
    'INFP': { strengths: ['창의적', '이상주의', '공감능력'], career: '작가, 예술가, 심리상담사', relationship: '진정성 있는 관계 중시' },
    'ENFJ': { strengths: ['카리스마', '공감능력', '이타적'], career: '교사, HR, 코치', relationship: '조화로운 관계 추구' },
    'ENFP': { strengths: ['열정적', '창의적', '사교적'], career: '마케터, 컨설턴트, 배우', relationship: '자유롭고 깊은 관계' },
    'ISTJ': { strengths: ['신뢰성', '체계적', '헌신적'], career: '회계사, 공무원, 관리자', relationship: '안정적인 관계 선호' },
    'ISFJ': { strengths: ['헌신적', '배려심', '실용적'], career: '간호사, 교사, 행정직', relationship: '보살핌과 헌신' },
    'ESTJ': { strengths: ['조직력', '리더십', '실용적'], career: '관리자, 군인, 변호사', relationship: '전통적 가치 중시' },
    'ESFJ': { strengths: ['사교적', '책임감', '협력적'], career: '영업, 간호사, 이벤트기획'], relationship: '조화로운 관계' },
    'ISTP': { strengths: ['분석적', '실용적', '적응력'], career: '엔지니어, 기술자, 파일럿', relationship: '독립적이지만 충실' },
    'ISFP': { strengths: ['예술적', '유연함', '친절함'], career: '디자이너, 셰프, 수의사', relationship: '진실된 관계 추구' },
    'ESTP': { strengths: ['행동력', '적응력', '실용적'], career: '영업, 기업가, 운동선수', relationship: '활동적인 관계' },
    'ESFP': { strengths: ['사교적', '낙관적', '실용적'], career: '배우, 이벤트기획, 영업', relationship: '즐거운 관계 추구' },
  };

  // Sasang Constitution analysis
  const sasangAnalysis: Record<string, { health: string; diet: string; exercise: string }> = {
    'taeyang': {
      health: '폐 기능이 강하고 간 기능이 약한 편입니다. 열이 많아 차가운 음식이 좋습니다.',
      diet: '메밀, 냉면, 조개류, 해산물, 채소 위주의 식단이 좋습니다.',
      exercise: '수영, 산책 등 가벼운 운동이 적합합니다.',
    },
    'soyang': {
      health: '비장이 강하고 신장이 약한 편입니다. 열이 많아 몸을 차게 유지하세요.',
      diet: '돼지고기, 굴, 오이, 수박, 참외가 좋습니다. 맵고 뜨거운 음식은 피하세요.',
      exercise: '수영, 조깅 등 땀을 많이 흘리지 않는 운동이 좋습니다.',
    },
    'taeeum': {
      health: '간 기능이 강하고 폐 기능이 약한 편입니다. 습담이 많아 땀을 내는 것이 좋습니다.',
      diet: '소고기, 무, 도라지, 율무, 콩나물이 좋습니다. 과식을 피하세요.',
      exercise: '등산, 달리기 등 땀을 많이 흘리는 유산소 운동이 좋습니다.',
    },
    'soeum': {
      health: '신장이 강하고 비장이 약한 편입니다. 소화기능이 약해 따뜻한 음식이 좋습니다.',
      diet: '닭고기, 찹쌀, 인삼, 대추, 생강이 좋습니다. 찬 음식은 피하세요.',
      exercise: '가벼운 산책, 요가 등 무리하지 않는 운동이 좋습니다.',
    },
    'unknown': {
      health: '사상체질 검사를 받아보시면 더 정확한 건강 관리가 가능합니다.',
      diet: '균형 잡힌 식단을 유지하세요.',
      exercise: '규칙적인 운동을 권장합니다.',
    },
  };

  // Tarot card analysis
  const tarotAnalysis: Record<string, { meaning: string; advice: string; timing: string }> = {
    'fool': { meaning: '새로운 시작, 모험, 순수함', advice: '두려움 없이 새로운 도전을 시작하세요.', timing: '봄, 새 학기, 새 직장' },
    'magician': { meaning: '의지력, 창조력, 자원 활용', advice: '당신의 잠재력을 최대한 발휘할 때입니다.', timing: '프로젝트 시작, 사업 출범' },
    'high_priestess': { meaning: '직관, 신비, 내면의 지혜', advice: '내면의 목소리에 귀 기울이세요.', timing: '중요한 결정 전, 명상 시기' },
    'empress': { meaning: '풍요, 모성, 창조성', advice: '창의적 프로젝트에 좋은 시기입니다.', timing: '임신, 창작활동, 풍요로운 시기' },
    'emperor': { meaning: '권위, 구조, 안정', advice: '체계적인 접근이 성공을 가져옵니다.', timing: '승진, 리더십 발휘, 조직 관리' },
    'hierophant': { meaning: '전통, 교육, 영적 지도', advice: '멘토의 조언을 구하세요.', timing: '학습, 자격증 취득, 결혼' },
    'lovers': { meaning: '사랑, 조화, 선택', advice: '마음의 결정을 따르세요.', timing: '연애, 결혼, 중요한 선택' },
    'chariot': { meaning: '의지력, 승리, 결단', advice: '목표를 향해 전진하세요.', timing: '경쟁, 시험, 도전' },
    'strength': { meaning: '내면의 힘, 용기, 인내', advice: '부드러운 접근이 더 효과적입니다.', timing: '어려운 상황 극복, 치유' },
    'hermit': { meaning: '성찰, 고독, 내면 탐색', advice: '혼자만의 시간이 필요합니다.', timing: '휴식, 명상, 자기계발' },
    'wheel': { meaning: '변화, 운명, 기회', advice: '변화를 받아들이고 흐름에 맡기세요.', timing: '전환기, 기회 포착' },
    'justice': { meaning: '공정, 진실, 균형', advice: '정직하게 행동하면 좋은 결과가 옵니다.', timing: '법적 문제, 계약, 공정한 결정' },
    'hanged': { meaning: '희생, 새로운 관점, 인내', advice: '다른 관점에서 상황을 보세요.', timing: '기다림, 관점 전환' },
    'death': { meaning: '끝과 시작, 변화, 재탄생', advice: '옛것을 놓고 새것을 받아들이세요.', timing: '큰 변화, 이별, 새 출발' },
    'temperance': { meaning: '균형, 절제, 조화', advice: '극단을 피하고 중용을 지키세요.', timing: '건강 관리, 균형 잡기' },
    'devil': { meaning: '유혹, 집착, 물질주의', advice: '자신을 옭아매는 것에서 벗어나세요.', timing: '중독 극복, 자유 찾기' },
    'tower': { meaning: '급변, 충격, 깨달음', advice: '예상치 못한 변화에 대비하세요.', timing: '위기, 급격한 변화' },
    'star': { meaning: '희망, 영감, 평화', advice: '밝은 미래를 믿으세요.', timing: '회복, 희망, 영감' },
    'moon': { meaning: '불안, 환상, 직감', advice: '감정에 휘둘리지 마세요.', timing: '불확실한 시기, 직관 신뢰' },
    'sun': { meaning: '성공, 기쁨, 활력', advice: '긍정적인 에너지가 넘칩니다.', timing: '성공, 행복, 축하' },
    'judgement': { meaning: '부활, 심판, 자기성찰', advice: '과거를 돌아보고 새롭게 시작하세요.', timing: '재평가, 결산, 새 출발' },
    'world': { meaning: '완성, 성취, 여행', advice: '목표가 달성되는 시기입니다.', timing: '완성, 졸업, 여행' },
  };

  // Age-specific analysis
  const ageAnalysis: Record<string, { focus: string; opportunities: string[]; challenges: string[] }> = {
    '20대': {
      focus: '자기 발견과 성장의 시기입니다. 다양한 경험을 통해 자신의 길을 찾으세요.',
      opportunities: ['새로운 기술 학습', '네트워킹 확대', '해외 경험', '창업 도전'],
      challenges: ['재정 관리', '진로 결정', '독립', '인간관계 형성'],
    },
    '30대': {
      focus: '커리어와 가정의 기반을 다지는 시기입니다. 균형이 중요합니다.',
      opportunities: ['전문성 강화', '리더십 개발', '자산 형성', '가정 구축'],
      challenges: ['일-생활 균형', '건강 관리 시작', '투자 결정', '육아와 커리어'],
    },
    '40대': {
      focus: '성숙과 재도약의 시기입니다. 축적된 경험을 활용하세요.',
      opportunities: ['경력 절정', '멘토링', '제2의 인생 설계', '자녀 교육 투자'],
      challenges: ['건강 관리 강화', '중년의 위기', '부모 돌봄', '은퇴 준비'],
    },
    '50대': {
      focus: '인생의 수확기입니다. 지혜를 나누고 다음 세대를 위해 기여하세요.',
      opportunities: ['경험 전수', '재테크 마무리', '취미 생활', '사회 공헌'],
      challenges: ['건강 최우선', '은퇴 후 계획', '자녀 독립', '노후 준비'],
    },
    '60대 이상': {
      focus: '지혜와 여유의 시기입니다. 삶의 의미를 찾고 즐기세요.',
      opportunities: ['손자녀와의 시간', '여행', '봉사활동', '새로운 취미'],
      challenges: ['건강 유지', '사회적 연결', '재정 관리', '가족 돌봄'],
    },
  };

  // Core insights - overlapping analysis from multiple systems
  const coreInsights: string[] = [];

  // Find overlapping personality traits
  if (formData.bloodType && formData.mbti) {
    const bloodInfo = bloodTypeAnalysis[formData.bloodType];
    const mbtiInfo = mbtiAnalysis[formData.mbti];

    if (bloodInfo && mbtiInfo) {
      if ((formData.bloodType === 'O' || formData.bloodType === 'B') && formData.mbti.includes('E')) {
        coreInsights.push('🌟 혈액형과 MBTI 모두 사교적이고 활동적인 성향을 나타냅니다. 리더십 역할에 적합합니다.');
      }
      if ((formData.bloodType === 'A' || formData.bloodType === 'AB') && formData.mbti.includes('I')) {
        coreInsights.push('🌟 내향적이고 분석적인 성향이 강합니다. 전문 분야에서 깊이 있는 성과를 낼 수 있습니다.');
      }
    }
  }

  // Find overlapping health insights
  if (formData.sasang && formData.sasang !== 'unknown') {
    const sasangInfo = sasangAnalysis[formData.sasang];
    if (sasangInfo) {
      coreInsights.push(`💪 사상체질(${formData.sasang === 'taeyang' ? '태양인' : formData.sasang === 'soyang' ? '소양인' : formData.sasang === 'taeeum' ? '태음인' : '소음인'})에 맞는 건강 관리가 중요합니다.`);
    }
  }

  // Add tarot insight
  if (formData.tarotCard) {
    const tarotInfo = tarotAnalysis[formData.tarotCard];
    if (tarotInfo) {
      coreInsights.push(`🎴 타로 카드가 제시하는 핵심 메시지: ${tarotInfo.meaning}`);
    }
  }

  // Age-related core insight
  const ageInfo = ageAnalysis[ageGroup];
  if (ageInfo) {
    coreInsights.push(`📅 ${ageGroup} 핵심: ${ageInfo.focus}`);
  }

  // Future predictions by age decade
  const futurePredictions = [];
  const currentAgeDecade = Math.floor(age / 10) * 10;

  for (let decade = currentAgeDecade; decade <= currentAgeDecade + 30; decade += 10) {
    const decadeGroup = decade < 30 ? '20대' : decade < 40 ? '30대' : decade < 50 ? '40대' : decade < 60 ? '50대' : '60대 이상';
    const prediction = ageAnalysis[decadeGroup];
    if (prediction) {
      futurePredictions.push({
        decade: `${decade}대`,
        focus: prediction.focus,
        opportunities: prediction.opportunities,
        challenges: prediction.challenges,
      });
    }
  }

  return {
    fourPillars,
    scores: baseScores,
    personality: bloodTypeAnalysis[formData.bloodType]?.personality || ['성격 분석을 위해 혈액형을 선택해주세요.'],
    bloodTypeAnalysis: bloodTypeAnalysis[formData.bloodType],
    mbtiAnalysis: mbtiAnalysis[formData.mbti],
    sasangAnalysis: sasangAnalysis[formData.sasang] || sasangAnalysis['unknown'],
    tarotAnalysis: tarotAnalysis[formData.tarotCard],
    ageAnalysis: ageInfo,
    coreInsights,
    futurePredictions,
    luckyElements: {
      color: formData.zodiac === 'leo' || formData.zodiac === 'aries' ? '빨간색' : formData.zodiac === 'taurus' || formData.zodiac === 'virgo' ? '녹색' : '보라색',
      number: String(((parseInt(formData.birthYear) || 1990) % 9) + 1),
      direction: formData.gender === 'male' ? '동쪽' : '서쪽',
    },
    currentAge: age,
    ageGroup,
    isAdmin,
  };
}

export default function SajuPage() {
  const t = useTranslations('fortune.saju');
  const router = useRouter();
  const [step, setStep] = useState<'form' | 'analyzing' | 'result'>('form');
  const [progress, setProgress] = useState(0);
  const [formData, setFormData] = useState<FormData>({
    name: '',
    birthYear: '',
    birthMonth: '',
    birthDay: '',
    birthHour: '',
    gender: '',
    calendar: 'solar',
    bloodType: '',
    mbti: '',
    zodiac: '',
    sasang: '',
    tarotCard: '',
  });
  const [user, setUser] = useState<{ email: string } | null>(null);
  const [savedProfiles, setSavedProfiles] = useState<UserProfile[]>([]);
  const [showSavedProfiles, setShowSavedProfiles] = useState(false);
  const [isAdmin, setIsAdmin] = useState(false);

  // Check for logged-in user
  useEffect(() => {
    const checkUser = async () => {
      try {
        const supabase = createClient();
        const { data: { user: authUser } } = await supabase.auth.getUser();
        if (authUser?.email) {
          setUser({ email: authUser.email });
          setIsAdmin(authUser.email === ADMIN_EMAIL);
          // Load saved profiles from localStorage
          const saved = localStorage.getItem(`saju_profiles_${authUser.email}`);
          if (saved) {
            setSavedProfiles(JSON.parse(saved));
          }
        }
      } catch (error) {
        console.error('Error checking user:', error);
      }
    };
    checkUser();

    // Also check localStorage for saved session
    const savedEmail = localStorage.getItem('saju_user_email');
    if (savedEmail) {
      setUser({ email: savedEmail });
      setIsAdmin(savedEmail === ADMIN_EMAIL);
      const saved = localStorage.getItem(`saju_profiles_${savedEmail}`);
      if (saved) {
        setSavedProfiles(JSON.parse(saved));
      }
    }
  }, []);

  // Auto-calculate zodiac when birth month/day changes
  useEffect(() => {
    if (formData.birthMonth && formData.birthDay && !formData.zodiac) {
      const zodiac = getZodiacFromDate(formData.birthMonth, formData.birthDay);
      setFormData(prev => ({ ...prev, zodiac }));
    }
  }, [formData.birthMonth, formData.birthDay, formData.zodiac]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Validate year is exactly 4 digits
    if (!/^\d{4}$/.test(formData.birthYear)) {
      alert('출생 연도는 4자리 숫자로 입력해주세요.');
      return;
    }

    setStep('analyzing');

    // Simulate analysis progress
    const progressInterval = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 100) {
          clearInterval(progressInterval);
          setStep('result');
          return 100;
        }
        return prev + 10;
      });
    }, 300);
  };

  const handleChange = (name: string, value: string) => {
    // Validate year input to only allow 4 digits
    if (name === 'birthYear') {
      // Only allow digits and max 4 characters
      if (!/^\d{0,4}$/.test(value)) {
        return;
      }
    }
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const saveProfile = () => {
    if (!user) {
      alert('프로필을 저장하려면 로그인이 필요합니다.');
      return;
    }

    const newProfile: UserProfile = {
      id: Date.now().toString(),
      email: user.email,
      formData,
      savedAt: new Date().toISOString(),
    };

    const updatedProfiles = [...savedProfiles, newProfile];
    setSavedProfiles(updatedProfiles);
    localStorage.setItem(`saju_profiles_${user.email}`, JSON.stringify(updatedProfiles));
    alert('프로필이 저장되었습니다!');
  };

  const loadProfile = (profile: UserProfile) => {
    setFormData(profile.formData);
    setShowSavedProfiles(false);
  };

  const deleteProfile = (profileId: string) => {
    if (!user) return;
    const updatedProfiles = savedProfiles.filter(p => p.id !== profileId);
    setSavedProfiles(updatedProfiles);
    localStorage.setItem(`saju_profiles_${user.email}`, JSON.stringify(updatedProfiles));
  };

  // Demo login for admin
  const handleDemoLogin = () => {
    const email = ADMIN_EMAIL;
    localStorage.setItem('saju_user_email', email);
    setUser({ email });
    setIsAdmin(true);
    const saved = localStorage.getItem(`saju_profiles_${email}`);
    if (saved) {
      setSavedProfiles(JSON.parse(saved));
    }
    alert('관리자 모드로 로그인되었습니다.');
  };

  if (step === 'analyzing') {
    return <AnalyzingView progress={progress} />;
  }

  if (step === 'result') {
    const result = generateComprehensiveAnalysis(formData, isAdmin);
    return <ResultView result={result} formData={formData} onReset={() => { setStep('form'); setProgress(0); }} isAdmin={isAdmin} />;
  }

  return (
    <div className="container mx-auto px-4 py-8 md:py-16">
      <div className="max-w-2xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <Badge className="mb-4 bg-purple-100 text-purple-700 dark:bg-purple-900 dark:text-purple-300">
            <Sparkles className="mr-1 h-3 w-3" />
            {isAdmin ? '관리자 전체 분석' : '종합 분석'}
          </Badge>
          <h1 className="text-3xl md:text-4xl font-bold mb-4">{t('title')}</h1>
          <p className="text-muted-foreground">{t('subtitle')}</p>
        </div>

        {/* User Status & Demo Login */}
        <div className="mb-6 flex items-center justify-between">
          <div className="flex items-center gap-2">
            {user ? (
              <>
                <Badge variant="outline" className="flex items-center gap-1">
                  <User className="h-3 w-3" />
                  {user.email}
                </Badge>
                {isAdmin && (
                  <Badge className="bg-amber-500 text-white">
                    <Crown className="h-3 w-3 mr-1" />
                    관리자
                  </Badge>
                )}
              </>
            ) : (
              <Button variant="outline" size="sm" onClick={handleDemoLogin}>
                <Crown className="h-4 w-4 mr-2" />
                관리자 로그인
              </Button>
            )}
          </div>
          {user && savedProfiles.length > 0 && (
            <Button
              variant="outline"
              size="sm"
              onClick={() => setShowSavedProfiles(!showSavedProfiles)}
            >
              저장된 프로필 ({savedProfiles.length})
            </Button>
          )}
        </div>

        {/* Saved Profiles */}
        {showSavedProfiles && savedProfiles.length > 0 && (
          <Card className="mb-6">
            <CardHeader>
              <CardTitle className="text-lg">저장된 프로필</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                {savedProfiles.map((profile) => (
                  <div key={profile.id} className="flex items-center justify-between p-3 bg-muted rounded-lg">
                    <div>
                      <div className="font-medium">{profile.formData.name}</div>
                      <div className="text-sm text-muted-foreground">
                        {profile.formData.birthYear}.{profile.formData.birthMonth}.{profile.formData.birthDay}
                      </div>
                    </div>
                    <div className="flex gap-2">
                      <Button size="sm" onClick={() => loadProfile(profile)}>
                        불러오기
                      </Button>
                      <Button size="sm" variant="destructive" onClick={() => deleteProfile(profile.id!)}>
                        삭제
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        )}

        {/* Form */}
        <Card>
          <CardHeader>
            <CardTitle>종합 분석 정보 입력</CardTitle>
            <CardDescription>
              정확한 분석을 위해 아래 정보를 입력해주세요
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Name */}
              <div className="space-y-2">
                <Label htmlFor="name">{t('form.name')}</Label>
                <Input
                  id="name"
                  placeholder={t('form.namePlaceholder')}
                  value={formData.name}
                  onChange={(e) => handleChange('name', e.target.value)}
                  required
                />
              </div>

              {/* Birth Date - Separate inputs for year/month/day */}
              <div className="space-y-2">
                <Label>{t('form.birthDate')}</Label>
                <div className="grid grid-cols-3 gap-2">
                  <div>
                    <Input
                      type="text"
                      inputMode="numeric"
                      placeholder="연도 (예: 1990)"
                      value={formData.birthYear}
                      onChange={(e) => handleChange('birthYear', e.target.value)}
                      maxLength={4}
                      pattern="\d{4}"
                      required
                    />
                    <span className="text-xs text-muted-foreground">4자리 숫자만</span>
                  </div>
                  <Select
                    value={formData.birthMonth}
                    onValueChange={(value) => handleChange('birthMonth', value)}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="월" />
                    </SelectTrigger>
                    <SelectContent>
                      {Array.from({ length: 12 }, (_, i) => (
                        <SelectItem key={i + 1} value={(i + 1).toString().padStart(2, '0')}>
                          {i + 1}월
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <Select
                    value={formData.birthDay}
                    onValueChange={(value) => handleChange('birthDay', value)}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="일" />
                    </SelectTrigger>
                    <SelectContent>
                      {Array.from({ length: 31 }, (_, i) => (
                        <SelectItem key={i + 1} value={(i + 1).toString().padStart(2, '0')}>
                          {i + 1}일
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>

              {/* Calendar Type */}
              <div className="space-y-2">
                <Label>{t('form.calendar')}</Label>
                <Tabs
                  value={formData.calendar}
                  onValueChange={(value) => handleChange('calendar', value)}
                >
                  <TabsList className="grid w-full grid-cols-2">
                    <TabsTrigger value="solar">{t('form.calendarSolar')}</TabsTrigger>
                    <TabsTrigger value="lunar">{t('form.calendarLunar')}</TabsTrigger>
                  </TabsList>
                </Tabs>
              </div>

              {/* Birth Time */}
              <div className="space-y-2">
                <Label>{t('form.birthTime')}</Label>
                <Select
                  value={formData.birthHour}
                  onValueChange={(value) => handleChange('birthHour', value)}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="시간 선택" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="unknown">{t('form.birthTimeUnknown')}</SelectItem>
                    {birthHours.map((hour) => (
                      <SelectItem key={hour.value} value={hour.value}>
                        {hour.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {/* Gender */}
              <div className="space-y-2">
                <Label>{t('form.gender')}</Label>
                <Tabs
                  value={formData.gender}
                  onValueChange={(value) => handleChange('gender', value)}
                >
                  <TabsList className="grid w-full grid-cols-2">
                    <TabsTrigger value="male">{t('form.genderMale')}</TabsTrigger>
                    <TabsTrigger value="female">{t('form.genderFemale')}</TabsTrigger>
                  </TabsList>
                </Tabs>
              </div>

              {/* Divider */}
              <div className="relative my-8">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t" />
                </div>
                <div className="relative flex justify-center text-xs uppercase">
                  <span className="bg-background px-2 text-muted-foreground">
                    추가 분석 정보 (선택)
                  </span>
                </div>
              </div>

              {/* Blood Type */}
              <div className="space-y-2">
                <Label className="flex items-center gap-2">
                  <Activity className="h-4 w-4 text-red-500" />
                  혈액형
                </Label>
                <Select
                  value={formData.bloodType}
                  onValueChange={(value) => handleChange('bloodType', value)}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="혈액형 선택" />
                  </SelectTrigger>
                  <SelectContent>
                    {bloodTypes.map((type) => (
                      <SelectItem key={type.value} value={type.value}>
                        {type.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {/* MBTI */}
              <div className="space-y-2">
                <Label className="flex items-center gap-2">
                  <Brain className="h-4 w-4 text-blue-500" />
                  MBTI 유형
                </Label>
                <Select
                  value={formData.mbti}
                  onValueChange={(value) => handleChange('mbti', value)}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="MBTI 선택" />
                  </SelectTrigger>
                  <SelectContent>
                    {mbtiTypes.map((type) => (
                      <SelectItem key={type} value={type}>
                        {type}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {/* Zodiac */}
              <div className="space-y-2">
                <Label className="flex items-center gap-2">
                  <Star className="h-4 w-4 text-yellow-500" />
                  별자리
                </Label>
                <Select
                  value={formData.zodiac}
                  onValueChange={(value) => handleChange('zodiac', value)}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="별자리 선택 (생일 입력 시 자동 계산)" />
                  </SelectTrigger>
                  <SelectContent>
                    {zodiacSigns.map((sign) => (
                      <SelectItem key={sign.value} value={sign.value}>
                        {sign.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {/* Sasang Constitution */}
              <div className="space-y-2">
                <Label className="flex items-center gap-2">
                  <Shield className="h-4 w-4 text-green-500" />
                  사상체질
                </Label>
                <Select
                  value={formData.sasang}
                  onValueChange={(value) => handleChange('sasang', value)}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="사상체질 선택" />
                  </SelectTrigger>
                  <SelectContent>
                    {sasangTypes.map((type) => (
                      <SelectItem key={type.value} value={type.value}>
                        {type.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {/* Tarot Card */}
              <div className="space-y-2">
                <Label className="flex items-center gap-2">
                  <Target className="h-4 w-4 text-purple-500" />
                  타로 카드 (끌리는 카드 선택)
                </Label>
                <Select
                  value={formData.tarotCard}
                  onValueChange={(value) => handleChange('tarotCard', value)}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="타로 카드 선택" />
                  </SelectTrigger>
                  <SelectContent>
                    {tarotCards.map((card) => (
                      <SelectItem key={card.value} value={card.value}>
                        {card.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {/* Action Buttons */}
              <div className="flex gap-2">
                <Button type="submit" size="lg" className="flex-1">
                  {t('form.submit')}
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
                {user && (
                  <Button type="button" variant="outline" size="lg" onClick={saveProfile}>
                    <Save className="h-4 w-4" />
                  </Button>
                )}
              </div>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

function AnalyzingView({ progress }: { progress: number }) {
  const stages = [
    '사주팔자 계산 중...',
    '혈액형 성격 분석 중...',
    'MBTI 패턴 매칭 중...',
    '별자리 운세 확인 중...',
    '사상체질 건강 분석 중...',
    '타로 해석 중...',
    '종합 분석 생성 중...',
    '핵심 인사이트 도출 중...',
    '미래 예측 계산 중...',
    '결과 정리 중...',
  ];

  const currentStage = Math.min(Math.floor(progress / 10), stages.length - 1);

  return (
    <div className="container mx-auto px-4 py-16">
      <div className="max-w-md mx-auto text-center">
        <div className="mb-8">
          <div className="w-24 h-24 mx-auto mb-6 rounded-full fortune-gradient flex items-center justify-center animate-pulse">
            <Sparkles className="h-12 w-12 text-white" />
          </div>
          <h2 className="text-2xl font-bold mb-2">종합 분석 중</h2>
          <p className="text-muted-foreground">
            {stages[currentStage]}
          </p>
        </div>
        <div className="space-y-2">
          <Progress value={progress} className="h-3" />
          <p className="text-sm text-muted-foreground">{progress}% 완료</p>
        </div>
        <div className="mt-8 flex items-center justify-center gap-2 text-sm text-muted-foreground">
          <Loader2 className="h-4 w-4 animate-spin" />
          <span>잠시만 기다려주세요...</span>
        </div>
      </div>
    </div>
  );
}

function ResultView({
  result,
  formData,
  onReset,
  isAdmin,
}: {
  result: ReturnType<typeof generateComprehensiveAnalysis>;
  formData: FormData;
  onReset: () => void;
  isAdmin: boolean;
}) {
  const t = useTranslations('fortune.saju.result');
  const [timeLeft, setTimeLeft] = useState({ hours: 23, minutes: 59, seconds: 59 });

  // Countdown timer effect
  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft(prev => {
        let { hours, minutes, seconds } = prev;
        seconds--;
        if (seconds < 0) {
          seconds = 59;
          minutes--;
        }
        if (minutes < 0) {
          minutes = 59;
          hours--;
        }
        if (hours < 0) {
          hours = 23;
          minutes = 59;
          seconds = 59;
        }
        return { hours, minutes, seconds };
      });
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  const scoreItems = [
    { key: 'overall', label: '종합운', icon: Zap, color: 'text-purple-500' },
    { key: 'wealth', label: '재물운', icon: Star, color: 'text-yellow-500' },
    { key: 'love', label: '애정운', icon: Heart, color: 'text-pink-500' },
    { key: 'career', label: '직업운', icon: Briefcase, color: 'text-blue-500' },
    { key: 'health', label: '건강운', icon: Activity, color: 'text-green-500' },
  ];

  // For admin, show all content without blur
  const showPremium = isAdmin;

  return (
    <div className="container mx-auto px-4 py-8 md:py-16">
      <div className="max-w-3xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <Badge className="mb-4 bg-green-100 text-green-700 dark:bg-green-900 dark:text-green-300">
            분석 완료
          </Badge>
          {isAdmin && (
            <Badge className="mb-4 ml-2 bg-amber-500 text-white">
              <Crown className="h-3 w-3 mr-1" />
              관리자 전체 접근
            </Badge>
          )}
          <h1 className="text-3xl md:text-4xl font-bold mb-2">{t('title')}</h1>
          <p className="text-muted-foreground">
            {formData.name} - {formData.birthYear}.{formData.birthMonth}.{formData.birthDay} ({result.currentAge}세, {result.ageGroup})
          </p>
        </div>

        {/* Core Insights - Always Visible */}
        {result.coreInsights.length > 0 && (
          <Card className="mb-6 border-2 border-primary/30 bg-gradient-to-r from-purple-50 to-pink-50 dark:from-purple-950 dark:to-pink-950">
            <CardHeader>
              <div className="flex items-center gap-2">
                <Target className="h-5 w-5 text-primary" />
                <CardTitle>핵심 종합 분석</CardTitle>
              </div>
              <CardDescription>모든 분석 결과에서 겹치는 핵심 인사이트</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {result.coreInsights.map((insight, index) => (
                  <div key={index} className="p-3 bg-white/50 dark:bg-black/20 rounded-lg">
                    <p className="font-medium">{insight}</p>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        )}

        {/* Four Pillars - FREE */}
        <Card className="mb-6">
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle>{t('fourPillars')}</CardTitle>
              <Badge variant="secondary">무료</Badge>
            </div>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-4 gap-4">
              {Object.entries(result.fourPillars).map(([pillar, data]) => (
                <div key={pillar} className="text-center p-4 rounded-lg bg-muted">
                  <div className="text-xs text-muted-foreground mb-2 capitalize">
                    {t(`${pillar}Pillar` as 'yearPillar' | 'monthPillar' | 'dayPillar' | 'hourPillar')}
                  </div>
                  <div className="text-2xl font-bold mb-1">
                    {data.heavenly}
                  </div>
                  <div className="text-xl mb-2">{data.earthly}</div>
                  <Badge variant="outline" className="text-xs">
                    {data.element}
                  </Badge>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Scores - FREE */}
        <Card className="mb-6">
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle>2026년 운세 점수</CardTitle>
              <Badge variant="secondary">무료</Badge>
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {scoreItems.map((item) => {
                const Icon = item.icon;
                const score = result.scores[item.key as keyof typeof result.scores];
                return (
                  <div key={item.key} className="flex items-center gap-4">
                    <div className={`p-2 rounded-lg bg-muted ${item.color}`}>
                      <Icon className="h-5 w-5" />
                    </div>
                    <div className="flex-1">
                      <div className="flex justify-between mb-1">
                        <span className="text-sm font-medium">{item.label}</span>
                        <span className="text-sm font-bold">{score}/100</span>
                      </div>
                      <div className="h-2 bg-muted rounded-full overflow-hidden">
                        <div
                          className="h-full bg-gradient-to-r from-purple-500 to-pink-500 transition-all"
                          style={{ width: `${score}%` }}
                        />
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </CardContent>
        </Card>

        {/* Blood Type Analysis */}
        {result.bloodTypeAnalysis && (
          <Card className={`mb-6 ${!showPremium ? 'relative' : ''}`}>
            {!showPremium && (
              <div className="absolute inset-0 flex items-center justify-center z-10 bg-white/80 dark:bg-black/80 backdrop-blur-sm rounded-xl">
                <div className="text-center">
                  <Lock className="h-8 w-8 text-primary mx-auto mb-2" />
                  <p className="font-semibold">프리미엄 콘텐츠</p>
                </div>
              </div>
            )}
            <CardHeader>
              <div className="flex items-center gap-2">
                <Activity className="h-5 w-5 text-red-500" />
                <CardTitle>혈액형 분석 ({formData.bloodType}형)</CardTitle>
              </div>
            </CardHeader>
            <CardContent className={!showPremium ? 'blur-sm' : ''}>
              <div className="space-y-4">
                <div>
                  <h4 className="font-semibold mb-2">성격 특성</h4>
                  <ul className="space-y-1">
                    {result.bloodTypeAnalysis.personality.map((trait, i) => (
                      <li key={i} className="flex items-center gap-2">
                        <Sparkles className="h-3 w-3 text-primary" />
                        {trait}
                      </li>
                    ))}
                  </ul>
                </div>
                <div>
                  <h4 className="font-semibold mb-2">궁합</h4>
                  <p className="text-muted-foreground">{result.bloodTypeAnalysis.compatibility}</p>
                </div>
                <div>
                  <h4 className="font-semibold mb-2">조언</h4>
                  <p className="text-muted-foreground">{result.bloodTypeAnalysis.advice}</p>
                </div>
              </div>
            </CardContent>
          </Card>
        )}

        {/* MBTI Analysis */}
        {result.mbtiAnalysis && (
          <Card className={`mb-6 ${!showPremium ? 'relative' : ''}`}>
            {!showPremium && (
              <div className="absolute inset-0 flex items-center justify-center z-10 bg-white/80 dark:bg-black/80 backdrop-blur-sm rounded-xl">
                <div className="text-center">
                  <Lock className="h-8 w-8 text-primary mx-auto mb-2" />
                  <p className="font-semibold">프리미엄 콘텐츠</p>
                </div>
              </div>
            )}
            <CardHeader>
              <div className="flex items-center gap-2">
                <Brain className="h-5 w-5 text-blue-500" />
                <CardTitle>MBTI 분석 ({formData.mbti})</CardTitle>
              </div>
            </CardHeader>
            <CardContent className={!showPremium ? 'blur-sm' : ''}>
              <div className="space-y-4">
                <div>
                  <h4 className="font-semibold mb-2">강점</h4>
                  <div className="flex flex-wrap gap-2">
                    {result.mbtiAnalysis.strengths.map((strength, i) => (
                      <Badge key={i} variant="secondary">{strength}</Badge>
                    ))}
                  </div>
                </div>
                <div>
                  <h4 className="font-semibold mb-2">적합 직업</h4>
                  <p className="text-muted-foreground">{result.mbtiAnalysis.career}</p>
                </div>
                <div>
                  <h4 className="font-semibold mb-2">관계 스타일</h4>
                  <p className="text-muted-foreground">{result.mbtiAnalysis.relationship}</p>
                </div>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Sasang Constitution Analysis */}
        {result.sasangAnalysis && formData.sasang !== 'unknown' && (
          <Card className={`mb-6 ${!showPremium ? 'relative' : ''}`}>
            {!showPremium && (
              <div className="absolute inset-0 flex items-center justify-center z-10 bg-white/80 dark:bg-black/80 backdrop-blur-sm rounded-xl">
                <div className="text-center">
                  <Lock className="h-8 w-8 text-primary mx-auto mb-2" />
                  <p className="font-semibold">프리미엄 콘텐츠</p>
                </div>
              </div>
            )}
            <CardHeader>
              <div className="flex items-center gap-2">
                <Shield className="h-5 w-5 text-green-500" />
                <CardTitle>사상체질 건강 분석</CardTitle>
              </div>
            </CardHeader>
            <CardContent className={!showPremium ? 'blur-sm' : ''}>
              <div className="space-y-4">
                <div>
                  <h4 className="font-semibold mb-2">건강 특성</h4>
                  <p className="text-muted-foreground">{result.sasangAnalysis.health}</p>
                </div>
                <div>
                  <h4 className="font-semibold mb-2">추천 식단</h4>
                  <p className="text-muted-foreground">{result.sasangAnalysis.diet}</p>
                </div>
                <div>
                  <h4 className="font-semibold mb-2">추천 운동</h4>
                  <p className="text-muted-foreground">{result.sasangAnalysis.exercise}</p>
                </div>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Tarot Analysis */}
        {result.tarotAnalysis && (
          <Card className={`mb-6 ${!showPremium ? 'relative' : ''}`}>
            {!showPremium && (
              <div className="absolute inset-0 flex items-center justify-center z-10 bg-white/80 dark:bg-black/80 backdrop-blur-sm rounded-xl">
                <div className="text-center">
                  <Lock className="h-8 w-8 text-primary mx-auto mb-2" />
                  <p className="font-semibold">프리미엄 콘텐츠</p>
                </div>
              </div>
            )}
            <CardHeader>
              <div className="flex items-center gap-2">
                <Target className="h-5 w-5 text-purple-500" />
                <CardTitle>타로 카드 해석</CardTitle>
              </div>
            </CardHeader>
            <CardContent className={!showPremium ? 'blur-sm' : ''}>
              <div className="space-y-4">
                <div>
                  <h4 className="font-semibold mb-2">카드 의미</h4>
                  <p className="text-muted-foreground">{result.tarotAnalysis.meaning}</p>
                </div>
                <div>
                  <h4 className="font-semibold mb-2">조언</h4>
                  <p className="text-muted-foreground">{result.tarotAnalysis.advice}</p>
                </div>
                <div>
                  <h4 className="font-semibold mb-2">적합한 시기</h4>
                  <p className="text-muted-foreground">{result.tarotAnalysis.timing}</p>
                </div>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Age-Based Future Analysis */}
        {result.futurePredictions.length > 0 && (
          <Card className={`mb-6 ${!showPremium ? 'relative' : ''}`}>
            {!showPremium && (
              <div className="absolute inset-0 flex items-center justify-center z-10 bg-white/80 dark:bg-black/80 backdrop-blur-sm rounded-xl">
                <div className="text-center">
                  <Lock className="h-8 w-8 text-primary mx-auto mb-2" />
                  <p className="font-semibold">프리미엄 콘텐츠</p>
                </div>
              </div>
            )}
            <CardHeader>
              <div className="flex items-center gap-2">
                <TrendingUp className="h-5 w-5 text-amber-500" />
                <CardTitle>연령대별 미래 예측</CardTitle>
              </div>
              <CardDescription>현재 {result.currentAge}세 이후의 인생 로드맵</CardDescription>
            </CardHeader>
            <CardContent className={!showPremium ? 'blur-sm' : ''}>
              <div className="space-y-6">
                {result.futurePredictions.map((prediction, index) => (
                  <div key={index} className="border-l-4 border-primary pl-4">
                    <h4 className="font-bold text-lg mb-2">{prediction.decade}</h4>
                    <p className="text-muted-foreground mb-3">{prediction.focus}</p>
                    <div className="grid md:grid-cols-2 gap-4">
                      <div>
                        <h5 className="font-semibold text-green-600 mb-1">기회</h5>
                        <ul className="text-sm space-y-1">
                          {prediction.opportunities.map((opp, i) => (
                            <li key={i}>• {opp}</li>
                          ))}
                        </ul>
                      </div>
                      <div>
                        <h5 className="font-semibold text-orange-600 mb-1">도전</h5>
                        <ul className="text-sm space-y-1">
                          {prediction.challenges.map((ch, i) => (
                            <li key={i}>• {ch}</li>
                          ))}
                        </ul>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        )}

        {/* Lucky Elements - FREE */}
        <Card className="mb-6">
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle>행운의 요소</CardTitle>
              <Badge variant="secondary">무료</Badge>
            </div>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-3 gap-4">
              <div className="text-center p-4 rounded-lg bg-muted">
                <div className="text-sm text-muted-foreground mb-1">행운의 색</div>
                <div className="font-bold text-purple-500">{result.luckyElements.color}</div>
              </div>
              <div className="text-center p-4 rounded-lg bg-muted">
                <div className="text-sm text-muted-foreground mb-1">행운의 숫자</div>
                <div className="font-bold text-primary">{result.luckyElements.number}</div>
              </div>
              <div className="text-center p-4 rounded-lg bg-muted">
                <div className="text-sm text-muted-foreground mb-1">행운의 방향</div>
                <div className="font-bold">{result.luckyElements.direction}</div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Conversion CTA - Only show if not admin */}
        {!isAdmin && (
          <Card className="mb-8 bg-gradient-to-r from-purple-600 to-pink-600 text-white border-0">
            <CardContent className="p-8 text-center">
              <h3 className="text-2xl font-bold mb-2">지금 결제하면 30% 할인!</h3>
              <p className="text-white/80 mb-4">
                모든 상세 분석 + 연령대별 미래 예측 + PDF 다운로드
              </p>

              {/* Countdown Timer */}
              <div className="flex justify-center gap-4 mb-6">
                <div className="bg-white/20 rounded-lg px-4 py-2">
                  <div className="text-2xl font-bold">{timeLeft.hours.toString().padStart(2, '0')}</div>
                  <div className="text-xs text-white/60">시간</div>
                </div>
                <div className="text-2xl font-bold">:</div>
                <div className="bg-white/20 rounded-lg px-4 py-2">
                  <div className="text-2xl font-bold">{timeLeft.minutes.toString().padStart(2, '0')}</div>
                  <div className="text-xs text-white/60">분</div>
                </div>
                <div className="text-2xl font-bold">:</div>
                <div className="bg-white/20 rounded-lg px-4 py-2">
                  <div className="text-2xl font-bold">{timeLeft.seconds.toString().padStart(2, '0')}</div>
                  <div className="text-xs text-white/60">초</div>
                </div>
              </div>

              <div className="flex items-center justify-center gap-4 mb-6">
                <span className="text-3xl font-bold">₩4,130</span>
                <span className="text-xl text-white/60 line-through">₩5,900</span>
              </div>

              <Button size="lg" className="bg-white text-purple-600 hover:bg-white/90 w-full max-w-md">
                프리미엄 분석 결제하기
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>

              <p className="text-xs text-white/60 mt-4">
                카카오페이, 네이버페이, 신용카드 결제 가능
              </p>
            </CardContent>
          </Card>
        )}

        {/* Actions */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Button variant="outline" onClick={onReset}>
            다시 분석하기
          </Button>
          <Link href="/fortune">
            <Button variant="ghost">
              다른 운세 보기
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
}
