'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { ChatInterface } from '@/components/chat';
import { createClient } from '@/lib/supabase/client';
import { Loader2 } from 'lucide-react';

interface ProfileData {
  name?: string;
  birth_date?: string;
  mbti?: string;
  blood_type?: string;
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

  useEffect(() => {
    async function loadUserData() {
      const supabase = createClient();
      const { data: { user } } = await supabase.auth.getUser();

      if (!user) {
        router.push('/login?redirect=/saju/chat');
        return;
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

  return (
    <div className="container max-w-5xl mx-auto py-6 px-4">
      {/* 헤더 */}
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-800 dark:text-white">
          💬 AI 사주 상담
        </h1>
        <p className="text-sm text-gray-500 mt-1">
          당신의 사주 데이터를 기반으로 맞춤형 상담을 제공합니다
        </p>
      </div>

      {/* 사주 데이터 없음 경고 */}
      {!sajuData && (
        <div className="mb-6 p-4 bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 rounded-lg">
          <p className="text-sm text-yellow-700 dark:text-yellow-400">
            ⚠️ 아직 사주 분석을 하지 않으셨네요.{' '}
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
