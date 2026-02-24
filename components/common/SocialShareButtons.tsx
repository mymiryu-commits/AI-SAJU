'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip';
import {
  Copy,
  Check,
  Share2,
  MessageCircle,
  Twitter,
  Facebook,
  Link as LinkIcon,
} from 'lucide-react';

interface SocialShareButtonsProps {
  title: string;
  description: string;
  url?: string;
  imageUrl?: string;
  shareData?: {
    score?: number;
    grade?: string;
    type?: string;
  };
  variant?: 'default' | 'compact' | 'card';
  className?: string;
}

export function SocialShareButtons({
  title,
  description,
  url,
  imageUrl,
  shareData,
  variant = 'default',
  className = '',
}: SocialShareButtonsProps) {
  const [copied, setCopied] = useState(false);
  const shareUrl = url || (typeof window !== 'undefined' ? window.location.href : '');

  // URL 인코딩
  const encodedUrl = encodeURIComponent(shareUrl);
  const encodedTitle = encodeURIComponent(title);
  const encodedDescription = encodeURIComponent(description);

  // 공유 텍스트 생성
  const getShareText = () => {
    let text = title;
    if (shareData?.score) {
      text += ` - ${shareData.score}점`;
    }
    if (shareData?.grade) {
      text += ` (${shareData.grade}등급)`;
    }
    text += `\n\n${description}`;
    return text;
  };

  // 클립보드 복사
  const copyToClipboard = async () => {
    try {
      await navigator.clipboard.writeText(shareUrl);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error('Copy failed:', err);
    }
  };

  // 카카오톡 공유
  const shareToKakao = () => {
    if (typeof window !== 'undefined' && (window as any).Kakao) {
      const Kakao = (window as any).Kakao;
      if (!Kakao.isInitialized()) {
        // 카카오 SDK 초기화 필요
        console.log('Kakao SDK not initialized');
        return;
      }

      Kakao.Share.sendDefault({
        objectType: 'feed',
        content: {
          title,
          description,
          imageUrl: imageUrl || 'https://ai-planx.com/og-image.png',
          link: {
            webUrl: shareUrl,
            mobileWebUrl: shareUrl,
          },
        },
        buttons: [
          {
            title: '나도 해보기',
            link: {
              webUrl: shareUrl,
              mobileWebUrl: shareUrl,
            },
          },
        ],
      });
    } else {
      // 카카오톡 앱으로 직접 공유 시도
      const kakaoUrl = `https://story.kakao.com/share?url=${encodedUrl}`;
      window.open(kakaoUrl, '_blank', 'width=600,height=400');
    }
  };

  // 트위터(X) 공유
  const shareToTwitter = () => {
    const text = getShareText();
    const twitterUrl = `https://twitter.com/intent/tweet?text=${encodeURIComponent(text)}&url=${encodedUrl}`;
    window.open(twitterUrl, '_blank', 'width=600,height=400');
  };

  // 페이스북 공유
  const shareToFacebook = () => {
    const facebookUrl = `https://www.facebook.com/sharer/sharer.php?u=${encodedUrl}&quote=${encodedTitle}`;
    window.open(facebookUrl, '_blank', 'width=600,height=400');
  };

  // 네이티브 공유 (모바일)
  const nativeShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title,
          text: getShareText(),
          url: shareUrl,
        });
      } catch (err) {
        console.log('Share cancelled or failed:', err);
      }
    } else {
      copyToClipboard();
    }
  };

  if (variant === 'compact') {
    return (
      <TooltipProvider>
        <div className={`flex items-center gap-1 ${className}`}>
          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                variant="ghost"
                size="icon"
                className="h-8 w-8"
                onClick={shareToKakao}
              >
                <MessageCircle className="h-4 w-4 text-yellow-500" />
              </Button>
            </TooltipTrigger>
            <TooltipContent>카카오톡 공유</TooltipContent>
          </Tooltip>

          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                variant="ghost"
                size="icon"
                className="h-8 w-8"
                onClick={shareToTwitter}
              >
                <Twitter className="h-4 w-4 text-sky-500" />
              </Button>
            </TooltipTrigger>
            <TooltipContent>X(트위터) 공유</TooltipContent>
          </Tooltip>

          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                variant="ghost"
                size="icon"
                className="h-8 w-8"
                onClick={copyToClipboard}
              >
                {copied ? (
                  <Check className="h-4 w-4 text-green-500" />
                ) : (
                  <LinkIcon className="h-4 w-4" />
                )}
              </Button>
            </TooltipTrigger>
            <TooltipContent>{copied ? '복사됨!' : '링크 복사'}</TooltipContent>
          </Tooltip>
        </div>
      </TooltipProvider>
    );
  }

  if (variant === 'card') {
    return (
      <div className={`p-4 bg-gradient-to-r from-pink-50 to-purple-50 dark:from-pink-950/30 dark:to-purple-950/30 rounded-xl border border-pink-200 dark:border-pink-800 ${className}`}>
        <div className="flex items-center gap-2 mb-3">
          <Share2 className="h-5 w-5 text-pink-500" />
          <span className="font-semibold text-sm">친구에게 공유하기</span>
          <span className="text-xs text-muted-foreground ml-auto">공유하면 100P 적립!</span>
        </div>

        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            className="flex-1 bg-yellow-400 hover:bg-yellow-500 text-yellow-900 border-yellow-500"
            onClick={shareToKakao}
          >
            <MessageCircle className="mr-2 h-4 w-4" />
            카카오톡
          </Button>

          <Button
            variant="outline"
            className="flex-1 bg-sky-500 hover:bg-sky-600 text-white border-sky-600"
            onClick={shareToTwitter}
          >
            <Twitter className="mr-2 h-4 w-4" />
            X (트위터)
          </Button>

          <Button
            variant="outline"
            className="flex-1"
            onClick={copyToClipboard}
          >
            {copied ? (
              <>
                <Check className="mr-2 h-4 w-4 text-green-500" />
                복사됨!
              </>
            ) : (
              <>
                <Copy className="mr-2 h-4 w-4" />
                링크 복사
              </>
            )}
          </Button>
        </div>
      </div>
    );
  }

  // Default variant
  return (
    <div className={`flex flex-wrap items-center gap-2 ${className}`}>
      <Button
        variant="outline"
        size="sm"
        className="bg-yellow-400 hover:bg-yellow-500 text-yellow-900 border-yellow-500"
        onClick={shareToKakao}
      >
        <MessageCircle className="mr-2 h-4 w-4" />
        카카오톡
      </Button>

      <Button
        variant="outline"
        size="sm"
        className="bg-sky-500 hover:bg-sky-600 text-white border-sky-600"
        onClick={shareToTwitter}
      >
        <Twitter className="mr-2 h-4 w-4" />
        X
      </Button>

      <Button
        variant="outline"
        size="sm"
        className="bg-blue-600 hover:bg-blue-700 text-white border-blue-700"
        onClick={shareToFacebook}
      >
        <Facebook className="mr-2 h-4 w-4" />
        Facebook
      </Button>

      <Button
        variant="outline"
        size="sm"
        onClick={nativeShare}
      >
        <Share2 className="mr-2 h-4 w-4" />
        더보기
      </Button>

      <Button
        variant="ghost"
        size="sm"
        onClick={copyToClipboard}
      >
        {copied ? (
          <>
            <Check className="mr-2 h-4 w-4 text-green-500" />
            복사됨!
          </>
        ) : (
          <>
            <Copy className="mr-2 h-4 w-4" />
            링크
          </>
        )}
      </Button>
    </div>
  );
}

// 궁합 결과 전용 공유 카드
interface CompatibilityShareCardProps {
  person1Name: string;
  person2Name: string;
  score: number;
  grade: string;
  relationType: string;
}

export function CompatibilityShareCard({
  person1Name,
  person2Name,
  score,
  grade,
  relationType,
}: CompatibilityShareCardProps) {
  const gradeColors: Record<string, string> = {
    S: 'from-amber-400 to-yellow-500',
    A: 'from-pink-400 to-rose-500',
    B: 'from-blue-400 to-indigo-500',
    C: 'from-green-400 to-emerald-500',
    D: 'from-gray-400 to-slate-500',
  };

  const relationLabels: Record<string, string> = {
    couple: '연인 궁합',
    friend: '친구 궁합',
    colleague: '비즈니스 궁합',
    family: '가족 궁합',
  };

  const title = `${person1Name} ♥ ${person2Name} ${relationLabels[relationType] || '궁합'} 결과`;
  const description = `${score}점 ${grade}등급! 우리의 궁합을 확인해보세요.`;

  return (
    <div className="relative overflow-hidden rounded-2xl">
      {/* 배경 그라데이션 */}
      <div className={`absolute inset-0 bg-gradient-to-br ${gradeColors[grade] || gradeColors.C} opacity-10`} />

      <div className="relative p-6 text-center">
        {/* 점수 표시 */}
        <div className="mb-4">
          <div className={`inline-flex items-center justify-center w-24 h-24 rounded-full bg-gradient-to-br ${gradeColors[grade] || gradeColors.C}`}>
            <div className="text-white text-center">
              <div className="text-3xl font-bold">{score}</div>
              <div className="text-xs opacity-80">점</div>
            </div>
          </div>
        </div>

        {/* 이름들 */}
        <div className="flex items-center justify-center gap-3 mb-3">
          <span className="text-lg font-semibold">{person1Name}</span>
          <span className="text-2xl text-pink-500">♥</span>
          <span className="text-lg font-semibold">{person2Name}</span>
        </div>

        {/* 등급 */}
        <div className={`inline-block px-4 py-1 rounded-full text-white text-sm font-bold bg-gradient-to-r ${gradeColors[grade] || gradeColors.C} mb-4`}>
          {grade}등급 {relationLabels[relationType] || '궁합'}
        </div>

        {/* 공유 버튼 */}
        <SocialShareButtons
          title={title}
          description={description}
          shareData={{ score, grade, type: relationType }}
          variant="card"
          className="mt-4"
        />
      </div>
    </div>
  );
}

export default SocialShareButtons;
