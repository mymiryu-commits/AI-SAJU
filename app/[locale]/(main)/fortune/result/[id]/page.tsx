'use client';

/**
 * 저장된 분석 결과 조회 페이지
 *
 * /fortune/result/[id]
 *
 * 이미 결제한 분석 결과를 다시 볼 때는 포인트 차감 없음
 */

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { Link } from '@/i18n/routing';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertDescription } from '@/components/ui/alert';
import {
  ArrowLeft,
  Loader2,
  AlertCircle,
  Calendar,
  Clock,
  Download,
  Volume2,
  Lock,
  Sparkles,
} from 'lucide-react';
import { useAuth } from '@/lib/hooks/useAuth';
import SajuResultCard from '@/components/fortune/saju/SajuResultCard';
import type { AnalysisResult } from '@/types/saju';

interface AnalysisData {
  id: string;
  type: string;
  subtype: string;
  createdAt: string;
  expiresAt: string;
  daysRemaining: number;
  isExpired: boolean;
  isPremium: boolean;
  isBlinded: boolean;
  inputData: any;
  summary: any;
  fullResult: AnalysisResult | null;
  scores: any;
  keywords: string[];
  pdfUrl: string | null;
  audioUrl: string | null;
}

export default function SavedAnalysisPage() {
  const params = useParams();
  const router = useRouter();
  const { user, isLoading: authLoading } = useAuth();

  const [analysis, setAnalysis] = useState<AnalysisData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [downloadingType, setDownloadingType] = useState<'pdf' | 'audio' | null>(null);

  const analysisId = params?.id as string;

  useEffect(() => {
    const fetchAnalysis = async () => {
      if (!analysisId || authLoading) return;

      if (!user) {
        setError('로그인이 필요합니다.');
        setIsLoading(false);
        return;
      }

      try {
        setIsLoading(true);
        setError(null);

        const response = await fetch(`/api/my/history/${analysisId}`);
        const data = await response.json();

        if (!response.ok) {
          setError(data.error || '분석 결과를 불러올 수 없습니다.');
          return;
        }

        setAnalysis(data.data);
      } catch (err) {
        console.error('Fetch analysis error:', err);
        setError('분석 결과를 불러오는 중 오류가 발생했습니다.');
      } finally {
        setIsLoading(false);
      }
    };

    fetchAnalysis();
  }, [analysisId, user, authLoading]);

  const handleDownload = async (type: 'pdf' | 'audio') => {
    if (!analysis || analysis.isExpired) {
      alert('다운로드 기간이 만료되었습니다.');
      return;
    }

    try {
      setDownloadingType(type);
      const response = await fetch(`/api/fortune/saju/download?type=${type}&analysisId=${analysisId}`);

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        alert(errorData.error || '다운로드 중 오류가 발생했습니다.');
        return;
      }

      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = type === 'pdf' ? `사주분석_${analysisId}.pdf` : `사주분석_${analysisId}.mp3`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      window.URL.revokeObjectURL(url);
    } catch (err) {
      console.error('Download error:', err);
      alert('다운로드 중 오류가 발생했습니다.');
    } finally {
      setDownloadingType(null);
    }
  };

  // 로딩 중
  if (authLoading || isLoading) {
    return (
      <div className="space-y-6">
        <Card className="p-8 text-center">
          <Loader2 className="h-8 w-8 mx-auto mb-4 animate-spin text-primary" />
          <p className="text-muted-foreground">분석 결과를 불러오는 중...</p>
        </Card>
      </div>
    );
  }

  // 로그인 필요
  if (!user) {
    return (
      <div className="space-y-6">
        <Card className="p-8 text-center">
          <AlertCircle className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
          <h3 className="font-semibold mb-2">로그인이 필요합니다</h3>
          <p className="text-muted-foreground mb-4">
            저장된 분석 결과를 보려면 로그인해주세요
          </p>
          <Link href="/login">
            <Button>로그인하기</Button>
          </Link>
        </Card>
      </div>
    );
  }

  // 에러
  if (error) {
    return (
      <div className="space-y-6">
        <Button variant="ghost" onClick={() => router.back()} className="mb-4">
          <ArrowLeft className="h-4 w-4 mr-2" />
          뒤로 가기
        </Button>
        <Card className="p-8 text-center border-red-200 bg-red-50 dark:bg-red-950/20">
          <AlertCircle className="h-12 w-12 mx-auto mb-4 text-red-500" />
          <h3 className="font-semibold mb-2 text-red-700 dark:text-red-400">{error}</h3>
          <Button variant="outline" onClick={() => router.push('/my/history')}>
            히스토리로 이동
          </Button>
        </Card>
      </div>
    );
  }

  // 데이터 없음
  if (!analysis) {
    return (
      <div className="space-y-6">
        <Button variant="ghost" onClick={() => router.back()} className="mb-4">
          <ArrowLeft className="h-4 w-4 mr-2" />
          뒤로 가기
        </Button>
        <Card className="p-8 text-center">
          <AlertCircle className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
          <h3 className="font-semibold mb-2">분석 결과를 찾을 수 없습니다</h3>
          <Button variant="outline" onClick={() => router.push('/my/history')}>
            히스토리로 이동
          </Button>
        </Card>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between flex-wrap gap-4">
        <div className="flex items-center gap-4">
          <Button variant="ghost" onClick={() => router.back()}>
            <ArrowLeft className="h-4 w-4 mr-2" />
            뒤로
          </Button>
          <div>
            <h1 className="text-xl font-bold flex items-center gap-2">
              <Sparkles className="h-5 w-5 text-primary" />
              사주 분석 결과
              {analysis.isPremium && (
                <Badge variant="secondary">프리미엄</Badge>
              )}
            </h1>
            <p className="text-sm text-muted-foreground flex items-center gap-2 mt-1">
              <Calendar className="h-3 w-3" />
              {new Date(analysis.createdAt).toLocaleDateString('ko-KR', {
                year: 'numeric',
                month: 'long',
                day: 'numeric',
              })}
              {!analysis.isExpired && (
                <span className="flex items-center gap-1">
                  <Clock className="h-3 w-3" />
                  D-{analysis.daysRemaining} 다운로드 가능
                </span>
              )}
            </p>
          </div>
        </div>

        {/* Download Buttons */}
        {!analysis.isExpired && analysis.type === 'saju' && (
          <div className="flex gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => handleDownload('pdf')}
              disabled={downloadingType === 'pdf'}
            >
              {downloadingType === 'pdf' ? (
                <Loader2 className="h-4 w-4 mr-2 animate-spin" />
              ) : (
                <Download className="h-4 w-4 mr-2" />
              )}
              PDF
            </Button>
            {analysis.isPremium && (
              <Button
                variant="outline"
                size="sm"
                onClick={() => handleDownload('audio')}
                disabled={downloadingType === 'audio'}
              >
                {downloadingType === 'audio' ? (
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                ) : (
                  <Volume2 className="h-4 w-4 mr-2" />
                )}
                음성
              </Button>
            )}
          </div>
        )}
      </div>

      {/* Expired Warning */}
      {analysis.isExpired && (
        <Alert variant="destructive">
          <Clock className="h-4 w-4" />
          <AlertDescription>
            다운로드 기간이 만료되었습니다. 분석 결과는 45일간 보관됩니다.
          </AlertDescription>
        </Alert>
      )}

      {/* Blinded Warning */}
      {analysis.isBlinded && (
        <Alert>
          <Lock className="h-4 w-4" />
          <AlertDescription>
            이 분석은 무료 버전입니다. 전체 분석 결과를 보려면 포인트로 업그레이드하세요.
          </AlertDescription>
        </Alert>
      )}

      {/* Analysis Result */}
      {analysis.fullResult ? (
        <SajuResultCard
          result={analysis.fullResult}
          onUnlockPremium={() => router.push('/fortune/saju')}
          isPremiumUnlocked={analysis.isPremium}
          productLevel={analysis.isPremium ? 'deep' : 'free'}
          analysisId={analysis.id}
        />
      ) : (
        // Fallback: Show summary data
        <Card>
          <CardHeader>
            <CardTitle>분석 요약</CardTitle>
            <CardDescription>
              {analysis.inputData?.name}님의 사주 분석 결과입니다
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {/* Basic Info */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="p-4 bg-muted rounded-lg text-center">
                <p className="text-sm text-muted-foreground mb-1">년주</p>
                <p className="font-bold text-lg">{analysis.summary?.saju?.year || '-'}</p>
              </div>
              <div className="p-4 bg-muted rounded-lg text-center">
                <p className="text-sm text-muted-foreground mb-1">월주</p>
                <p className="font-bold text-lg">{analysis.summary?.saju?.month || '-'}</p>
              </div>
              <div className="p-4 bg-muted rounded-lg text-center">
                <p className="text-sm text-muted-foreground mb-1">일주</p>
                <p className="font-bold text-lg">{analysis.summary?.saju?.day || '-'}</p>
              </div>
              <div className="p-4 bg-muted rounded-lg text-center">
                <p className="text-sm text-muted-foreground mb-1">시주</p>
                <p className="font-bold text-lg">{analysis.summary?.saju?.time || '-'}</p>
              </div>
            </div>

            {/* Scores */}
            {analysis.scores && (
              <div className="grid grid-cols-5 gap-2">
                {['overall', 'wealth', 'love', 'career', 'health'].map((key) => {
                  const labels: Record<string, string> = {
                    overall: '종합',
                    wealth: '재물',
                    love: '애정',
                    career: '직업',
                    health: '건강',
                  };
                  const score = analysis.scores[key];
                  return (
                    <div
                      key={key}
                      className="p-3 bg-muted rounded-lg text-center"
                    >
                      <p className="text-xs text-muted-foreground mb-1">{labels[key]}</p>
                      <p
                        className={`font-bold text-lg ${
                          score >= 80
                            ? 'text-green-600'
                            : score >= 60
                            ? 'text-yellow-600'
                            : 'text-red-600'
                        }`}
                      >
                        {score}
                      </p>
                    </div>
                  );
                })}
              </div>
            )}

            {/* Keywords */}
            {analysis.keywords && analysis.keywords.length > 0 && (
              <div className="flex flex-wrap gap-2">
                {analysis.keywords.map((keyword, i) => (
                  <Badge key={i} variant="outline">
                    {keyword}
                  </Badge>
                ))}
              </div>
            )}

            {/* Upgrade CTA for blinded */}
            {analysis.isBlinded && (
              <div className="p-6 bg-gradient-to-r from-purple-50 to-indigo-50 dark:from-purple-950/20 dark:to-indigo-950/20 rounded-lg text-center">
                <Lock className="h-8 w-8 mx-auto mb-3 text-purple-500" />
                <h3 className="font-semibold mb-2">전체 분석 결과가 잠겨있습니다</h3>
                <p className="text-sm text-muted-foreground mb-4">
                  포인트를 사용하여 상세 분석 결과를 확인하세요
                </p>
                <Link href="/fortune/saju">
                  <Button>새 분석 시작하기</Button>
                </Link>
              </div>
            )}
          </CardContent>
        </Card>
      )}

      {/* Back to History */}
      <div className="text-center">
        <Link href="/my/history">
          <Button variant="outline">
            <ArrowLeft className="h-4 w-4 mr-2" />
            히스토리로 돌아가기
          </Button>
        </Link>
      </div>
    </div>
  );
}
