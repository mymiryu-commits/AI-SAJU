'use client';

import { useState, useEffect } from 'react';
import { Loader2, BookOpen, Star, Activity, Link2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { SipsinChart, SinsalCard, UnsungChart, HapChungDiagram } from '@/components/saju/advanced';
import { cn } from '@/lib/utils';

type TabType = 'sipsin' | 'sinsal' | 'unsung' | 'hapchung';

const TABS: { id: TabType; label: string; icon: React.ElementType }[] = [
  { id: 'sipsin', label: '십신(十神)', icon: BookOpen },
  { id: 'sinsal', label: '신살(神殺)', icon: Star },
  { id: 'unsung', label: '12운성', icon: Activity },
  { id: 'hapchung', label: '합충형파해', icon: Link2 }
];

export default function AdvancedSajuPage() {
  const [activeTab, setActiveTab] = useState<TabType>('sipsin');
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchData() {
      try {
        setLoading(true);
        setError(null);

        // sessionStorage에서 사주 차트 데이터 확인
        const storedChart = sessionStorage.getItem('sajuChart');

        if (storedChart) {
          // sessionStorage에 데이터가 있으면 POST로 분석 요청
          const sajuChart = JSON.parse(storedChart);
          const res = await fetch('/api/saju/advanced', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ sajuChart })
          });

          if (!res.ok) {
            const errorData = await res.json();
            throw new Error(errorData.error || '분석 데이터를 불러올 수 없습니다.');
          }

          const result = await res.json();
          setData(result);
        } else {
          // sessionStorage에 없으면 DB에서 조회 시도 (GET)
          const res = await fetch('/api/saju/advanced');
          if (!res.ok) {
            const errorData = await res.json();
            throw new Error(errorData.error || '분석 데이터를 불러올 수 없습니다.');
          }

          const result = await res.json();
          setData(result);
        }
      } catch (err) {
        setError(err instanceof Error ? err.message : '오류가 발생했습니다.');
      } finally {
        setLoading(false);
      }
    }

    fetchData();
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="w-12 h-12 text-purple-500 animate-spin mx-auto mb-4" />
          <p className="text-gray-600 dark:text-gray-400">정통 사주 분석 중...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center p-4">
        <div className="max-w-md w-full bg-white dark:bg-gray-800 rounded-xl p-8 shadow-lg text-center">
          <div className="w-16 h-16 bg-red-100 dark:bg-red-900/30 rounded-full flex items-center justify-center mx-auto mb-4">
            <span className="text-3xl">!</span>
          </div>
          <h2 className="text-xl font-bold text-gray-800 dark:text-white mb-2">
            분석을 불러올 수 없습니다
          </h2>
          <p className="text-gray-600 dark:text-gray-400 mb-6">
            {error}
          </p>
          <Button onClick={() => window.location.href = '/fortune/saju'}>
            사주 분석하러 가기
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-8">
      <div className="container mx-auto px-4 max-w-4xl">
        {/* 헤더 */}
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-800 dark:text-white mb-2">
            정통 사주 분석
          </h1>
          <p className="text-gray-600 dark:text-gray-400">
            십신, 신살, 12운성, 합충형파해를 통한 심층 분석
          </p>
        </div>

        {/* 탭 네비게이션 */}
        <div className="bg-white dark:bg-gray-800 rounded-xl p-2 mb-6 shadow-sm border border-gray-200 dark:border-gray-700">
          <div className="flex gap-2 overflow-x-auto">
            {TABS.map((tab) => {
              const Icon = tab.icon;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={cn(
                    'flex items-center gap-2 px-4 py-3 rounded-lg text-sm font-medium transition-all whitespace-nowrap flex-1',
                    activeTab === tab.id
                      ? 'bg-gradient-to-r from-purple-500 to-blue-500 text-white shadow-md'
                      : 'text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700'
                  )}
                >
                  <Icon className="w-4 h-4" />
                  <span className="hidden sm:inline">{tab.label}</span>
                </button>
              );
            })}
          </div>
        </div>

        {/* 탭 콘텐츠 */}
        <div className="animate-in fade-in duration-300">
          {activeTab === 'sipsin' && data?.sipsin && (
            <SipsinChart
              chart={data.sipsin.chart}
              interpretation={data.sipsin.interpretation}
            />
          )}

          {activeTab === 'sinsal' && data?.sinsal && (
            <SinsalCard analysis={data.sinsal} />
          )}

          {activeTab === 'unsung' && data?.unsung && (
            <UnsungChart analysis={data.unsung} />
          )}

          {activeTab === 'hapchung' && data?.hapchung && (
            <HapChungDiagram analysis={data.hapchung} />
          )}
        </div>

        {/* 면책조항 */}
        <div className="mt-8 text-center text-sm text-gray-500 dark:text-gray-400">
          <p>본 분석은 전통 명리학 이론에 기반한 참고 자료입니다.</p>
          <p>중요한 결정은 반드시 전문가와 상담하시기 바랍니다.</p>
        </div>
      </div>
    </div>
  );
}
