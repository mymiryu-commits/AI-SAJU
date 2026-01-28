'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { ChatInterface } from '@/components/chat';
import { createClient } from '@/lib/supabase/client';
import { Loader2, Crown, Lock, Sparkles, ArrowRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Link } from '@/i18n/routing';

interface ProfileData {
  name?: string;
  birth_date?: string;
  mbti?: string;
  blood_type?: string;
  premium_until?: string;
}

interface FourPillars {
  year?: { heavenly?: string; earthly?: string };
  month?: { heavenly?: string; earthly?: string };
  day?: { heavenly?: string; earthly?: string };
  hour?: { heavenly?: string; earthly?: string };
}

interface FortuneAnalysisData {
  result_full?: {
    fourPillars?: FourPillars;
    elementBalance?: Record<string, number>;
    dominantElement?: string;
    scores?: Record<string, number>;
  };
}

export default function SajuChatPage() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(true);
  const [sajuData, setSajuData] = useState<any>(null);
  const [userName, setUserName] = useState<string>('');
  const [isPremium, setIsPremium] = useState(false);
  const [chatOpen, setChatOpen] = useState(false);

  useEffect(() => {
    async function loadUserData() {
      const supabase = createClient();
      const { data: { user } } = await supabase.auth.getUser();

      if (!user) {
        router.push('/login?redirect=/saju/chat');
        return;
      }

      // 프리미엄 상태 확인
      const { data: profile } = await supabase
        .from('profiles')
        .select('premium_until')
        .eq('id', user.id)
        .single() as { data: { premium_until?: string } | null };

      const premiumUntil = profile?.premium_until ? new Date(profile.premium_until) : null;
      const userIsPremium = premiumUntil ? premiumUntil > new Date() : false;
      setIsPremium(userIsPremium);

      // 프리미엄 사용자는 자동으로 채팅창 오픈
      if (userIsPremium) {
        setChatOpen(true);
      }

      // 1. sessionStorage에서 사주 분석 결과 확인 (사주 분석 결과 페이지에서 전달됨)
      const storedResult = sessionStorage.getItem('sajuAnalysisResult');
      const storedUserInput = sessionStorage.getItem('sajuUserInput');

      if (storedResult && storedUserInput) {
        try {
          const analysisResult = JSON.parse(storedResult);
          const userInput = JSON.parse(storedUserInput);

          setUserName(userInput.name || '');
          setSajuData({
            dayMaster: analysisResult.saju?.day?.heavenlyStem || '미상',
            fourPillars: {
              year: { heavenly: analysisResult.saju?.year?.heavenlyStem, earthly: analysisResult.saju?.year?.earthlyBranch },
              month: { heavenly: analysisResult.saju?.month?.heavenlyStem, earthly: analysisResult.saju?.month?.earthlyBranch },
              day: { heavenly: analysisResult.saju?.day?.heavenlyStem, earthly: analysisResult.saju?.day?.earthlyBranch },
              hour: { heavenly: analysisResult.saju?.hour?.heavenlyStem, earthly: analysisResult.saju?.hour?.earthlyBranch }
            },
            yongsin: analysisResult.yongsin || [],
            oheng: analysisResult.oheng || {},
            mbti: userInput.mbti,
            bloodType: userInput.bloodType,
            birthDate: userInput.birthDate,
            userName: userInput.name
          });
          setIsLoading(false);
          return;
        } catch (e) {
          console.error('Failed to parse sessionStorage data:', e);
        }
      }

      // 2. DB에서 프로필 및 사주 데이터 조회 (fallback)
      try {
        const { data: profile } = await supabase
          .from('profiles')
          .select('name, birth_date, mbti, blood_type')
          .eq('id', user.id)
          .single() as { data: ProfileData | null };

        if (profile) {
          setUserName(profile.name || '');

          // 최근 사주 분석 결과 조회 (fortune_analyses 테이블에서)
          const { data: fortuneResult } = await supabase
            .from('fortune_analyses')
            .select('result_full')
            .eq('user_id', user.id)
            .eq('type', 'saju')
            .order('created_at', { ascending: false })
            .limit(1)
            .single() as { data: FortuneAnalysisData | null };

          if (fortuneResult?.result_full) {
            const result = fortuneResult.result_full;
            setSajuData({
              dayMaster: result.fourPillars?.day?.heavenly || '미상',
              fourPillars: result.fourPillars,
              yongsin: result.dominantElement ? [result.dominantElement] : [],
              oheng: result.elementBalance || {},
              mbti: profile.mbti,
              bloodType: profile.blood_type,
              birthDate: profile.birth_date,
              userName: profile.name
            });
          }
        }
      } catch (e) {
        console.error('Failed to load from DB:', e);
      }

      setIsLoading(false);
    }

    loadUserData();
  }, [router]);

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-purple-500" />
      </div>
    );
  }

  // 프리미엄이 아닌 경우 제한 안내
  if (!isPremium && !chatOpen) {
    return (
      <div className="container max-w-3xl mx-auto py-12 px-4">
        <div className="bg-gradient-to-br from-purple-50 via-pink-50 to-rose-50 dark:from-purple-950/40 dark:via-pink-950/30 dark:to-rose-950/20 border border-purple-200/50 dark:border-purple-800/30 rounded-3xl p-8 md:p-12 relative overflow-hidden">
          {/* Background decoration */}
          <div className="absolute top-0 right-0 w-64 h-64 bg-gradient-to-br from-purple-200/40 to-pink-200/30 dark:from-purple-600/10 dark:to-pink-600/10 rounded-full blur-[80px]" />
          <div className="absolute bottom-0 left-0 w-48 h-48 bg-gradient-to-br from-rose-200/40 to-orange-200/30 dark:from-rose-600/10 dark:to-orange-600/10 rounded-full blur-[80px]" />

          <div className="relative z-10 text-center">
            {/* Premium Badge */}
            <div className="inline-flex items-center gap-2 bg-gradient-to-r from-amber-400 to-orange-500 text-white rounded-full px-5 py-2 mb-6">
              <Crown className="h-5 w-5" />
              <span className="font-bold">PREMIUM 전용</span>
            </div>

            {/* Lock Icon */}
            <div className="w-20 h-20 mx-auto mb-6 rounded-full bg-gradient-to-br from-purple-100 to-pink-100 dark:from-purple-900/40 dark:to-pink-900/40 flex items-center justify-center">
              <Lock className="h-10 w-10 text-purple-500" />
            </div>

            {/* Title */}
            <h1 className="text-2xl md:text-3xl font-bold text-foreground mb-4">
              AI 사주 상담
            </h1>

            {/* Description */}
            <p className="text-muted-foreground mb-6 max-w-md mx-auto leading-relaxed">
              AI 사주 상담은 <span className="font-bold text-purple-600 dark:text-purple-400">프리미엄 회원</span> 전용 서비스입니다.
              <br />
              개인 맞춤형 깊은 상담을 경험해보세요.
            </p>

            {/* Features */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8 max-w-lg mx-auto">
              <div className="bg-white/50 dark:bg-gray-900/30 rounded-xl p-4 border border-purple-100 dark:border-purple-800/30">
                <Sparkles className="h-6 w-6 text-purple-500 mx-auto mb-2" />
                <p className="text-sm font-medium text-foreground">무제한 상담</p>
              </div>
              <div className="bg-white/50 dark:bg-gray-900/30 rounded-xl p-4 border border-purple-100 dark:border-purple-800/30">
                <Crown className="h-6 w-6 text-amber-500 mx-auto mb-2" />
                <p className="text-sm font-medium text-foreground">맞춤형 분석</p>
              </div>
              <div className="bg-white/50 dark:bg-gray-900/30 rounded-xl p-4 border border-purple-100 dark:border-purple-800/30">
                <Lock className="h-6 w-6 text-pink-500 mx-auto mb-2" />
                <p className="text-sm font-medium text-foreground">모든 분석 무료</p>
              </div>
            </div>

            {/* Pricing */}
            <div className="mb-8">
              <p className="text-3xl font-bold text-foreground mb-1">
                월 <span className="bg-gradient-to-r from-purple-500 to-pink-500 bg-clip-text text-transparent">9,900원</span>
              </p>
              <p className="text-sm text-muted-foreground">모든 프리미엄 기능 무제한 이용</p>
            </div>

            {/* CTA Buttons */}
            <div className="flex flex-col sm:flex-row gap-3 justify-center">
              <Link href="/pricing">
                <Button
                  size="lg"
                  className="bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white px-8 py-6 text-base font-semibold rounded-xl shadow-xl shadow-purple-500/25 hover:shadow-purple-500/40 transition-all hover:-translate-y-0.5"
                >
                  <Crown className="mr-2 h-5 w-5" />
                  프리미엄 시작하기
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Button>
              </Link>
              <Link href="/fortune/saju">
                <Button
                  size="lg"
                  variant="outline"
                  className="px-8 py-6 text-base font-semibold rounded-xl"
                >
                  무료 사주 분석 받기
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="container max-w-5xl mx-auto py-6 px-4">
      {/* 헤더 */}
      <div className="mb-6">
        <div className="flex items-center gap-3 mb-2">
          <h1 className="text-2xl font-bold text-gray-800 dark:text-white">
            AI 사주 상담
          </h1>
          {isPremium && (
            <span className="inline-flex items-center gap-1 bg-gradient-to-r from-amber-400 to-orange-500 text-white text-xs font-bold px-2 py-1 rounded-full">
              <Crown className="h-3 w-3" />
              PREMIUM
            </span>
          )}
        </div>
        <p className="text-sm text-gray-500 mt-1">
          당신의 사주 데이터를 기반으로 맞춤형 상담을 제공합니다
        </p>
      </div>

      {/* 사주 데이터 없음 경고 */}
      {!sajuData && (
        <div className="mb-6 p-4 bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 rounded-lg">
          <p className="text-sm text-yellow-700 dark:text-yellow-400">
            아직 사주 분석을 하지 않으셨네요.{' '}
            <a href="/fortune/saju" className="underline font-medium">
              먼저 사주 분석
            </a>
            을 받으시면 더 정확한 상담이 가능합니다.
          </p>
        </div>
      )}

      {/* 채팅 인터페이스 */}
      <div className="h-[700px]">
        <ChatInterface
          sajuData={sajuData}
          userName={userName}
        />
      </div>
    </div>
  );
}
