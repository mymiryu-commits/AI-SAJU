'use client';

import { useState } from 'react';
import { useTranslations } from 'next-intl';
import { Link } from '@/i18n/routing';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertDescription } from '@/components/ui/alert';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Progress } from '@/components/ui/progress';
import {
  Users,
  UserPlus,
  Trash2,
  ArrowRight,
  ArrowLeft,
  Loader2,
  Sparkles,
  Star,
  AlertCircle,
  Crown,
  Zap,
  Shield,
  Target,
  TrendingUp,
  Heart,
  Briefcase,
  Home,
  GraduationCap,
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

type RelationType = 'friend' | 'colleague' | 'family' | 'study';

interface PersonData {
  id: string;
  name: string;
  birthDate: string;
  birthHour: string;
  gender: string;
  relation: RelationType;
}

interface GroupResult {
  overallScore: number;
  grade: 'S' | 'A' | 'B' | 'C' | 'D';
  teamChemistry: {
    harmony: number;
    synergy: number;
    balance: number;
    growth: number;
  };
  memberRoles: {
    name: string;
    role: string;
    element: string;
    strength: string;
  }[];
  pairAnalysis: {
    person1: string;
    person2: string;
    score: number;
    relationship: string;
  }[];
  strengths: string[];
  challenges: string[];
  advice: string[];
  bestCombinations: string[];
  warningPairs: string[];
}

const relationTypes: { id: RelationType; label: string; icon: typeof Users; color: string }[] = [
  { id: 'friend', label: '친구 모임', icon: Users, color: 'text-blue-500' },
  { id: 'colleague', label: '비즈니스/팀', icon: Briefcase, color: 'text-green-500' },
  { id: 'family', label: '가족', icon: Home, color: 'text-orange-500' },
  { id: 'study', label: '스터디/동아리', icon: GraduationCap, color: 'text-purple-500' },
];

const birthHours = Array.from({ length: 24 }, (_, i) => ({
  value: i.toString().padStart(2, '0'),
  label: `${i.toString().padStart(2, '0')}:00 - ${i.toString().padStart(2, '0')}:59`,
}));

const gradeColors: Record<string, string> = {
  S: 'bg-gradient-to-r from-yellow-400 to-amber-500 text-white',
  A: 'bg-gradient-to-r from-pink-500 to-rose-500 text-white',
  B: 'bg-gradient-to-r from-blue-500 to-indigo-500 text-white',
  C: 'bg-gradient-to-r from-green-500 to-emerald-500 text-white',
  D: 'bg-gradient-to-r from-gray-500 to-slate-500 text-white',
};

const gradeDescriptions: Record<string, string> = {
  S: '환상의 팀! 서로를 완벽히 보완합니다',
  A: '최고의 케미! 함께하면 시너지 폭발',
  B: '좋은 조합! 서로 배울 점이 많아요',
  C: '무난한 관계, 노력하면 발전 가능',
  D: '주의 필요, 갈등 조율이 중요해요',
};

const createEmptyPerson = (id: string): PersonData => ({
  id,
  name: '',
  birthDate: '',
  birthHour: '',
  gender: '',
  relation: 'friend',
});

export default function GroupAnalysisPage() {
  const t = useTranslations('fortune');

  const [step, setStep] = useState<'form' | 'analyzing' | 'result'>('form');
  const [groupType, setGroupType] = useState<RelationType>('friend');
  const [members, setMembers] = useState<PersonData[]>([
    createEmptyPerson('1'),
    createEmptyPerson('2'),
  ]);
  const [result, setResult] = useState<GroupResult | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [progress, setProgress] = useState(0);

  const addMember = () => {
    if (members.length < 5) {
      setMembers([...members, createEmptyPerson(Date.now().toString())]);
    }
  };

  const removeMember = (id: string) => {
    if (members.length > 2) {
      setMembers(members.filter(m => m.id !== id));
    }
  };

  const updateMember = (id: string, field: keyof PersonData, value: string) => {
    setMembers(members.map(m =>
      m.id === id ? { ...m, [field]: value } : m
    ));
  };

  const isFormValid = () => {
    return members.every(m => m.name && m.birthDate && m.gender);
  };

  const handleAnalyze = async () => {
    if (!isFormValid()) {
      setError('모든 멤버의 정보를 입력해주세요.');
      return;
    }

    setError(null);
    setStep('analyzing');
    setProgress(0);

    // 진행률 애니메이션
    const progressInterval = setInterval(() => {
      setProgress(prev => Math.min(prev + Math.random() * 15, 90));
    }, 300);

    try {
      const response = await fetch('/api/fortune/saju/group', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          members: members.map(m => ({
            name: m.name,
            birthDate: m.birthDate,
            birthTime: m.birthHour || undefined,
            gender: m.gender,
            relation: groupType,
          })),
        }),
      });

      const data = await response.json();

      if (!response.ok || !data.success) {
        throw new Error(data.error || '분석에 실패했습니다.');
      }

      clearInterval(progressInterval);
      setProgress(100);

      setTimeout(() => {
        setResult(data.data);
        setStep('result');
      }, 500);

    } catch (err) {
      clearInterval(progressInterval);
      setError(err instanceof Error ? err.message : '분석 중 오류가 발생했습니다.');
      setStep('form');
    }
  };

  // 분석 중 화면
  if (step === 'analyzing') {
    return (
      <div className="min-h-screen bg-gradient-to-b from-violet-50 via-purple-50 to-pink-50 dark:from-gray-900 dark:via-purple-950/20 dark:to-gray-900">
        <div className="container mx-auto px-4 py-20">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="max-w-md mx-auto text-center"
          >
            <div className="relative w-32 h-32 mx-auto mb-8">
              <motion.div
                className="absolute inset-0 rounded-full bg-gradient-to-r from-violet-500 to-purple-500 opacity-20"
                animate={{ scale: [1, 1.2, 1] }}
                transition={{ duration: 2, repeat: Infinity }}
              />
              <div className="absolute inset-2 rounded-full bg-gradient-to-br from-violet-500 to-purple-600 flex items-center justify-center">
                <Users className="w-12 h-12 text-white" />
              </div>
            </div>

            <h2 className="text-2xl font-bold mb-4 bg-gradient-to-r from-violet-600 to-purple-600 bg-clip-text text-transparent">
              그룹 케미 분석 중...
            </h2>
            <p className="text-muted-foreground mb-8">
              {members.length}명의 사주를 종합 분석하고 있습니다
            </p>

            <div className="space-y-4">
              <Progress value={progress} className="h-2" />
              <p className="text-sm text-muted-foreground">{Math.round(progress)}%</p>
            </div>

            <div className="mt-8 flex justify-center gap-2">
              {members.map((m, i) => (
                <motion.div
                  key={m.id}
                  className="w-10 h-10 rounded-full bg-gradient-to-br from-violet-400 to-purple-500 flex items-center justify-center text-white font-semibold text-sm"
                  animate={{ y: [0, -10, 0] }}
                  transition={{ duration: 0.5, delay: i * 0.1, repeat: Infinity, repeatDelay: 1 }}
                >
                  {m.name.charAt(0) || '?'}
                </motion.div>
              ))}
            </div>
          </motion.div>
        </div>
      </div>
    );
  }

  // 결과 화면
  if (step === 'result' && result) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-violet-50 via-purple-50 to-pink-50 dark:from-gray-900 dark:via-purple-950/20 dark:to-gray-900">
        <div className="container mx-auto px-4 py-8 max-w-4xl">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-6"
          >
            {/* 헤더 */}
            <div className="text-center mb-8">
              <Badge className="mb-4 bg-violet-500">그룹 분석 완료</Badge>
              <h1 className="text-3xl font-bold mb-2">
                {members.map(m => m.name).join(' · ')}
              </h1>
              <p className="text-muted-foreground">팀 케미 분석 리포트</p>
            </div>

            {/* 종합 점수 */}
            <Card className="overflow-hidden">
              <div className="bg-gradient-to-r from-violet-500 to-purple-600 p-8 text-white text-center">
                <p className="text-violet-100 mb-2">팀 케미 점수</p>
                <div className="flex items-center justify-center gap-4 mb-4">
                  <span className="text-6xl font-bold">{result.overallScore}</span>
                  <Badge className={`${gradeColors[result.grade]} text-2xl px-4 py-2`}>
                    {result.grade}
                  </Badge>
                </div>
                <p className="text-violet-100">{gradeDescriptions[result.grade]}</p>
              </div>

              {/* 케미 지표 */}
              <CardContent className="p-6">
                <h3 className="font-semibold mb-4 flex items-center gap-2">
                  <Zap className="h-5 w-5 text-violet-500" />
                  팀 케미 지표
                </h3>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  {[
                    { label: '조화', value: result.teamChemistry.harmony, icon: Heart, color: 'text-pink-500' },
                    { label: '시너지', value: result.teamChemistry.synergy, icon: Zap, color: 'text-yellow-500' },
                    { label: '균형', value: result.teamChemistry.balance, icon: Shield, color: 'text-blue-500' },
                    { label: '성장', value: result.teamChemistry.growth, icon: TrendingUp, color: 'text-green-500' },
                  ].map((item) => (
                    <div key={item.label} className="text-center p-4 bg-gray-50 dark:bg-gray-800 rounded-xl">
                      <item.icon className={`h-6 w-6 mx-auto mb-2 ${item.color}`} />
                      <p className="text-2xl font-bold">{item.value}</p>
                      <p className="text-xs text-muted-foreground">{item.label}</p>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* 멤버별 역할 */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Crown className="h-5 w-5 text-amber-500" />
                  멤버별 역할 분석
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid gap-4">
                  {result.memberRoles.map((member, i) => (
                    <motion.div
                      key={i}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: i * 0.1 }}
                      className="flex items-center gap-4 p-4 bg-gradient-to-r from-gray-50 to-white dark:from-gray-800 dark:to-gray-750 rounded-xl border"
                    >
                      <div className="w-12 h-12 rounded-full bg-gradient-to-br from-violet-400 to-purple-500 flex items-center justify-center text-white font-bold">
                        {member.name.charAt(0)}
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-1">
                          <span className="font-semibold">{member.name}</span>
                          <Badge variant="outline" className="text-xs">{member.element}</Badge>
                        </div>
                        <p className="text-sm font-medium text-violet-600 dark:text-violet-400">{member.role}</p>
                        <p className="text-xs text-muted-foreground">{member.strength}</p>
                      </div>
                    </motion.div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* 강점 & 주의점 */}
            <div className="grid md:grid-cols-2 gap-4">
              <Card className="border-green-200 dark:border-green-800">
                <CardHeader className="pb-2">
                  <CardTitle className="text-green-600 dark:text-green-400 flex items-center gap-2 text-lg">
                    <Star className="h-5 w-5" />
                    팀의 강점
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-2">
                    {result.strengths.map((s, i) => (
                      <li key={i} className="flex items-start gap-2 text-sm">
                        <span className="text-green-500 mt-1">✓</span>
                        {s}
                      </li>
                    ))}
                  </ul>
                </CardContent>
              </Card>

              <Card className="border-orange-200 dark:border-orange-800">
                <CardHeader className="pb-2">
                  <CardTitle className="text-orange-600 dark:text-orange-400 flex items-center gap-2 text-lg">
                    <AlertCircle className="h-5 w-5" />
                    주의할 점
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-2">
                    {result.challenges.map((c, i) => (
                      <li key={i} className="flex items-start gap-2 text-sm">
                        <span className="text-orange-500 mt-1">!</span>
                        {c}
                      </li>
                    ))}
                  </ul>
                </CardContent>
              </Card>
            </div>

            {/* 팀 조언 */}
            <Card className="bg-gradient-to-br from-violet-50 to-purple-50 dark:from-violet-950/20 dark:to-purple-950/20 border-violet-200 dark:border-violet-800">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Target className="h-5 w-5 text-violet-500" />
                  팀을 위한 조언
                </CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="space-y-3">
                  {result.advice.map((a, i) => (
                    <li key={i} className="flex items-start gap-3">
                      <span className="w-6 h-6 rounded-full bg-violet-500 text-white flex items-center justify-center text-xs flex-shrink-0">
                        {i + 1}
                      </span>
                      <span className="text-sm">{a}</span>
                    </li>
                  ))}
                </ul>
              </CardContent>
            </Card>

            {/* 액션 버튼 */}
            <div className="flex flex-col sm:flex-row gap-4 justify-center pt-4">
              <Button
                variant="outline"
                onClick={() => { setStep('form'); setResult(null); }}
                className="gap-2"
              >
                <ArrowLeft className="h-4 w-4" />
                다시 분석하기
              </Button>
              <Link href="/fortune/compatibility">
                <Button className="gap-2 bg-gradient-to-r from-pink-500 to-rose-500 hover:from-pink-600 hover:to-rose-600">
                  <Heart className="h-4 w-4" />
                  1:1 궁합 보기
                </Button>
              </Link>
            </div>
          </motion.div>
        </div>
      </div>
    );
  }

  // 입력 폼
  return (
    <div className="min-h-screen bg-gradient-to-b from-violet-50 via-purple-50 to-pink-50 dark:from-gray-900 dark:via-purple-950/20 dark:to-gray-900">
      <div className="container mx-auto px-4 py-8 max-w-3xl">
        {/* 헤더 */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-8"
        >
          <div className="inline-flex items-center justify-center w-20 h-20 rounded-2xl bg-gradient-to-br from-violet-500 to-purple-600 mb-4 shadow-xl shadow-violet-500/25">
            <Users className="h-10 w-10 text-white" />
          </div>
          <h1 className="text-3xl font-bold mb-2 bg-gradient-to-r from-violet-600 to-purple-600 bg-clip-text text-transparent">
            그룹 케미 분석
          </h1>
          <p className="text-muted-foreground">
            2~5명의 팀 케미를 사주로 분석해보세요
          </p>
          <Badge className="mt-2 bg-violet-500">NEW</Badge>
        </motion.div>

        {error && (
          <Alert variant="destructive" className="mb-6">
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}

        {/* 그룹 유형 선택 */}
        <Card className="mb-6">
          <CardHeader>
            <CardTitle className="text-lg">모임 유형</CardTitle>
            <CardDescription>어떤 관계의 그룹인가요?</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
              {relationTypes.map((type) => (
                <button
                  key={type.id}
                  onClick={() => setGroupType(type.id)}
                  className={`p-4 rounded-xl border-2 transition-all ${
                    groupType === type.id
                      ? 'border-violet-500 bg-violet-50 dark:bg-violet-950/30'
                      : 'border-gray-200 dark:border-gray-700 hover:border-violet-300'
                  }`}
                >
                  <type.icon className={`h-6 w-6 mx-auto mb-2 ${type.color}`} />
                  <p className="text-sm font-medium">{type.label}</p>
                </button>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* 멤버 입력 */}
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle className="text-lg">멤버 정보</CardTitle>
                <CardDescription>{members.length}/5명</CardDescription>
              </div>
              <Button
                variant="outline"
                size="sm"
                onClick={addMember}
                disabled={members.length >= 5}
                className="gap-2"
              >
                <UserPlus className="h-4 w-4" />
                멤버 추가
              </Button>
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            <AnimatePresence>
              {members.map((member, index) => (
                <motion.div
                  key={member.id}
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  exit={{ opacity: 0, height: 0 }}
                  className="p-4 bg-gray-50 dark:bg-gray-800 rounded-xl space-y-4"
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <div className="w-8 h-8 rounded-full bg-gradient-to-br from-violet-400 to-purple-500 flex items-center justify-center text-white font-semibold text-sm">
                        {index + 1}
                      </div>
                      <span className="font-medium">멤버 {index + 1}</span>
                    </div>
                    {members.length > 2 && (
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => removeMember(member.id)}
                        className="text-red-500 hover:text-red-600 hover:bg-red-50"
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    )}
                  </div>

                  <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                    <div>
                      <Label className="text-xs">이름 *</Label>
                      <Input
                        placeholder="홍길동"
                        value={member.name}
                        onChange={(e) => updateMember(member.id, 'name', e.target.value)}
                        className="mt-1"
                      />
                    </div>
                    <div>
                      <Label className="text-xs">생년월일 *</Label>
                      <Input
                        type="date"
                        value={member.birthDate}
                        onChange={(e) => updateMember(member.id, 'birthDate', e.target.value)}
                        className="mt-1"
                      />
                    </div>
                    <div>
                      <Label className="text-xs">태어난 시간</Label>
                      <Select
                        value={member.birthHour}
                        onValueChange={(v) => updateMember(member.id, 'birthHour', v)}
                      >
                        <SelectTrigger className="mt-1">
                          <SelectValue placeholder="모름" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="unknown">모름</SelectItem>
                          {birthHours.map((h) => (
                            <SelectItem key={h.value} value={h.value}>
                              {h.label}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                    <div>
                      <Label className="text-xs">성별 *</Label>
                      <Select
                        value={member.gender}
                        onValueChange={(v) => updateMember(member.id, 'gender', v)}
                      >
                        <SelectTrigger className="mt-1">
                          <SelectValue placeholder="선택" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="male">남성</SelectItem>
                          <SelectItem value="female">여성</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>

            <Button
              onClick={handleAnalyze}
              disabled={!isFormValid()}
              className="w-full h-14 text-lg gap-2 bg-gradient-to-r from-violet-500 to-purple-600 hover:from-violet-600 hover:to-purple-700 shadow-lg shadow-violet-500/25"
            >
              <Sparkles className="h-5 w-5" />
              {members.length}명 그룹 케미 분석하기
              <ArrowRight className="h-5 w-5" />
            </Button>
          </CardContent>
        </Card>

        {/* 안내 */}
        <div className="mt-6 text-center text-sm text-muted-foreground">
          <p>💡 태어난 시간을 입력하면 더 정확한 분석이 가능해요</p>
          <p className="mt-1">2~5명의 팀원 정보를 입력해주세요</p>
        </div>
      </div>
    </div>
  );
}
