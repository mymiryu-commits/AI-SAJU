'use client';

import { ArrowLeft, Layers } from 'lucide-react';
import { Link } from '@/i18n/routing';
import { Button } from '@/components/ui/button';
import FortuneSlideSettings from '@/components/admin/FortuneSlideSettings';

export default function FortuneSlidesAdminPage() {
  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-8 max-w-5xl">
        {/* Header */}
        <div className="flex items-center gap-4 mb-8">
          <Link href="/admin/settings">
            <Button variant="ghost" size="icon" className="rounded-full">
              <ArrowLeft className="h-5 w-5" />
            </Button>
          </Link>
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-purple-100 to-indigo-100 dark:from-purple-900/30 dark:to-indigo-900/30 flex items-center justify-center">
              <Layers className="h-6 w-6 text-purple-600 dark:text-purple-400" />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-foreground">운세 슬라이드 이미지 관리</h1>
              <p className="text-muted-foreground text-sm">
                통합 분석 페이지 상단에 표시되는 슬라이드 이미지를 관리합니다
              </p>
            </div>
          </div>
        </div>

        {/* Fortune Slide Settings */}
        <FortuneSlideSettings />
      </div>
    </div>
  );
}
