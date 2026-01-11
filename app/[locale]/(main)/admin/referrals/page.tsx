'use client';

import { useState, useEffect } from 'react';
import { Link2, Save, Trash2, ExternalLink, Search, CheckCircle, AlertCircle } from 'lucide-react';
import { defaultWebsites } from '@/lib/data/aiTools';

interface ReferralUrl {
  toolName: string;
  url: string;
}

export default function ReferralsAdminPage() {
  const [referralUrls, setReferralUrls] = useState<Record<string, string>>({});
  const [searchQuery, setSearchQuery] = useState('');
  const [saveStatus, setSaveStatus] = useState<'idle' | 'saving' | 'saved' | 'error'>('idle');

  // Load saved referral URLs on mount
  useEffect(() => {
    const stored = localStorage.getItem('ai-referral-urls');
    if (stored) {
      try {
        setReferralUrls(JSON.parse(stored));
      } catch (e) {
        console.error('Failed to parse referral URLs:', e);
      }
    }
  }, []);

  // Save referral URLs to localStorage
  const saveReferralUrls = () => {
    setSaveStatus('saving');
    try {
      localStorage.setItem('ai-referral-urls', JSON.stringify(referralUrls));
      setSaveStatus('saved');
      setTimeout(() => setSaveStatus('idle'), 2000);
    } catch (e) {
      console.error('Failed to save referral URLs:', e);
      setSaveStatus('error');
      setTimeout(() => setSaveStatus('idle'), 3000);
    }
  };

  // Update a referral URL
  const updateReferralUrl = (toolName: string, url: string) => {
    setReferralUrls(prev => ({
      ...prev,
      [toolName]: url,
    }));
  };

  // Remove a referral URL (use default)
  const removeReferralUrl = (toolName: string) => {
    setReferralUrls(prev => {
      const updated = { ...prev };
      delete updated[toolName];
      return updated;
    });
  };

  // Get all tool names
  const allTools = Object.keys(defaultWebsites);

  // Filter tools based on search
  const filteredTools = allTools.filter(tool =>
    tool.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="content-area">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="section-header animate-fade-in-up">
          <h1 className="section-title flex items-center gap-2">
            <Link2 className="h-8 w-8" />
            레퍼럴 URL 관리
          </h1>
          <p className="section-subtitle">
            각 AI 도구의 레퍼럴(제휴) 링크를 설정하세요. 설정된 링크는 사용자가 카드를 클릭했을 때 사용됩니다.
          </p>
        </div>

        {/* Action Bar */}
        <div className="flex flex-col sm:flex-row gap-4 mb-6 animate-fade-in-up" style={{ animationDelay: '100ms' }}>
          {/* Search */}
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
            <input
              type="text"
              placeholder="AI 도구 검색..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 bg-card border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary"
            />
          </div>

          {/* Save Button */}
          <button
            onClick={saveReferralUrls}
            disabled={saveStatus === 'saving'}
            className="flex items-center gap-2 px-6 py-2.5 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-colors disabled:opacity-50"
          >
            {saveStatus === 'saving' ? (
              <>
                <div className="h-4 w-4 border-2 border-primary-foreground/30 border-t-primary-foreground rounded-full animate-spin" />
                저장 중...
              </>
            ) : saveStatus === 'saved' ? (
              <>
                <CheckCircle className="h-4 w-4" />
                저장됨
              </>
            ) : saveStatus === 'error' ? (
              <>
                <AlertCircle className="h-4 w-4" />
                오류
              </>
            ) : (
              <>
                <Save className="h-4 w-4" />
                변경사항 저장
              </>
            )}
          </button>
        </div>

        {/* Info Box */}
        <div className="bg-blue-50 dark:bg-blue-950/30 border border-blue-200 dark:border-blue-800 rounded-lg p-4 mb-6 animate-fade-in-up" style={{ animationDelay: '150ms' }}>
          <h3 className="text-sm font-semibold text-blue-800 dark:text-blue-200 mb-1">
            레퍼럴 URL 사용 방법
          </h3>
          <ul className="text-sm text-blue-700 dark:text-blue-300 space-y-1">
            <li>• 레퍼럴 URL을 입력하면 기본 URL 대신 사용됩니다.</li>
            <li>• 비워두면 기본 URL이 사용됩니다.</li>
            <li>• 변경 후 반드시 '변경사항 저장' 버튼을 클릭하세요.</li>
            <li>• 설정은 브라우저에 저장되며, 서버에 저장하려면 Supabase 연동이 필요합니다.</li>
          </ul>
        </div>

        {/* Tools List */}
        <div className="space-y-3">
          {filteredTools.map((toolName, index) => {
            const defaultUrl = defaultWebsites[toolName];
            const customUrl = referralUrls[toolName] || '';
            const hasCustomUrl = !!customUrl;

            return (
              <div
                key={toolName}
                className="bg-card border border-border rounded-lg p-4 animate-fade-in-up"
                style={{ animationDelay: `${200 + index * 30}ms` }}
              >
                <div className="flex flex-col sm:flex-row sm:items-center gap-4">
                  {/* Tool Name */}
                  <div className="sm:w-40 flex-shrink-0">
                    <h3 className="font-semibold text-foreground">{toolName}</h3>
                    <p className="text-xs text-muted-foreground truncate">
                      기본: {defaultUrl}
                    </p>
                  </div>

                  {/* URL Input */}
                  <div className="flex-1">
                    <div className="relative">
                      <input
                        type="url"
                        placeholder={defaultUrl}
                        value={customUrl}
                        onChange={(e) => updateReferralUrl(toolName, e.target.value)}
                        className={`w-full px-4 py-2 bg-secondary border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/20 ${
                          hasCustomUrl ? 'border-primary' : 'border-border'
                        }`}
                      />
                      {hasCustomUrl && (
                        <span className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-primary font-medium">
                          커스텀
                        </span>
                      )}
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="flex gap-2 flex-shrink-0">
                    {/* Test Link */}
                    <a
                      href={customUrl || defaultUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="p-2 text-muted-foreground hover:text-foreground hover:bg-secondary rounded-lg transition-colors"
                      title="링크 테스트"
                    >
                      <ExternalLink className="h-5 w-5" />
                    </a>

                    {/* Remove Custom URL */}
                    {hasCustomUrl && (
                      <button
                        onClick={() => removeReferralUrl(toolName)}
                        className="p-2 text-red-500 hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-950/30 rounded-lg transition-colors"
                        title="커스텀 URL 제거"
                      >
                        <Trash2 className="h-5 w-5" />
                      </button>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Empty State */}
        {filteredTools.length === 0 && (
          <div className="text-center py-12 text-muted-foreground">
            <Search className="h-12 w-12 mx-auto mb-4 opacity-50" />
            <p>'{searchQuery}'에 해당하는 AI 도구가 없습니다.</p>
          </div>
        )}

        {/* Stats */}
        <div className="mt-8 p-4 bg-secondary rounded-lg">
          <div className="flex justify-between text-sm">
            <span className="text-muted-foreground">총 AI 도구</span>
            <span className="font-medium">{allTools.length}개</span>
          </div>
          <div className="flex justify-between text-sm mt-2">
            <span className="text-muted-foreground">커스텀 레퍼럴 설정</span>
            <span className="font-medium text-primary">{Object.keys(referralUrls).length}개</span>
          </div>
        </div>
      </div>
    </div>
  );
}
