'use client';

import { useState, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useToolLogos } from '@/lib/hooks/useToolLogos';
import { aiToolsData } from '@/lib/data/aiTools';
import {
  Upload,
  Trash2,
  Image as ImageIcon,
  Search,
  CheckCircle,
  AlertCircle,
  Loader2,
  RefreshCw,
  ImageOff,
  Cloud,
} from 'lucide-react';

// Convert tool name to safe filename (same as in hook)
function toSafeFileName(toolName: string): string {
  return toolName
    .toLowerCase()
    .replace(/[^a-z0-9가-힣]/g, '-')
    .replace(/-+/g, '-')
    .replace(/^-|-$/g, '');
}

export default function ToolLogosPage() {
  const { toolLogos, isLoaded, isUploading, setToolLogo, clearAllToolLogos, refreshLogos } = useToolLogos();
  const [searchQuery, setSearchQuery] = useState('');
  const [uploadingTool, setUploadingTool] = useState<string | null>(null);
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);
  const fileInputRefs = useRef<Record<string, HTMLInputElement | null>>({});

  // Get unique tools from all categories
  const getAllUniqueTools = () => {
    const toolMap = new Map<string, typeof aiToolsData.all[0]>();

    // Iterate through all categories
    Object.values(aiToolsData).forEach(categoryTools => {
      categoryTools.forEach(tool => {
        if (!toolMap.has(tool.name)) {
          toolMap.set(tool.name, tool);
        }
      });
    });

    return Array.from(toolMap.values());
  };

  const allTools = getAllUniqueTools();

  // Filter tools based on search
  const filteredTools = allTools.filter(tool =>
    tool.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    tool.company.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleFileUpload = async (file: File, toolName: string) => {
    setUploadingTool(toolName);
    setMessage(null);

    const result = await setToolLogo(toolName, file);

    if (result.success) {
      setMessage({ type: 'success', text: `${toolName} 로고가 업로드되었습니다.` });
    } else {
      setMessage({ type: 'error', text: result.error || '업로드 중 오류가 발생했습니다.' });
    }

    setUploadingTool(null);
  };

  const handleDelete = async (toolName: string) => {
    setUploadingTool(toolName);
    const result = await setToolLogo(toolName, null);

    if (result.success) {
      setMessage({ type: 'success', text: `${toolName} 로고가 기본값으로 복원되었습니다.` });
    } else {
      setMessage({ type: 'error', text: '삭제 중 오류가 발생했습니다.' });
    }

    setUploadingTool(null);
  };

  const handleClearAll = async () => {
    if (confirm('모든 커스텀 로고를 삭제하시겠습니까? 기본 로고로 복원됩니다.')) {
      const success = await clearAllToolLogos();
      if (success) {
        setMessage({ type: 'success', text: '모든 커스텀 로고가 삭제되었습니다.' });
      } else {
        setMessage({ type: 'error', text: '삭제 중 오류가 발생했습니다.' });
      }
    }
  };

  const customLogoCount = Object.keys(toolLogos).length;

  // Check if a tool has a custom logo
  const hasCustomLogo = (toolName: string): boolean => {
    const safeName = toSafeFileName(toolName);
    return !!toolLogos[safeName];
  };

  // Get the display logo URL
  const getDisplayLogo = (tool: typeof allTools[0]): string => {
    const safeName = toSafeFileName(tool.name);
    return toolLogos[safeName] || tool.logo;
  };

  if (!isLoaded) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-8 max-w-6xl">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-8">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-violet-100 to-purple-100 dark:from-violet-900/30 dark:to-purple-900/30 flex items-center justify-center">
              <ImageIcon className="h-6 w-6 text-violet-600 dark:text-violet-400" />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-foreground">AI 툴 로고 관리</h1>
              <p className="text-muted-foreground text-sm flex items-center gap-2">
                깨진 로고를 직접 업로드하여 교체하세요 ({customLogoCount}개 커스텀 적용)
                <span className="inline-flex items-center gap-1 text-xs text-emerald-600 dark:text-emerald-400">
                  <Cloud className="h-3 w-3" />
                  서버 저장
                </span>
              </p>
            </div>
          </div>

          <div className="flex gap-2">
            <Button
              variant="outline"
              onClick={refreshLogos}
              disabled={isUploading}
            >
              <RefreshCw className={`mr-2 h-4 w-4 ${isUploading ? 'animate-spin' : ''}`} />
              새로고침
            </Button>
            {customLogoCount > 0 && (
              <Button
                variant="outline"
                onClick={handleClearAll}
                disabled={isUploading}
                className="text-red-500 hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-950/30"
              >
                <Trash2 className="mr-2 h-4 w-4" />
                전체 초기화
              </Button>
            )}
          </div>
        </div>

        {/* Message */}
        {message && (
          <div className={`mb-6 p-4 rounded-xl flex items-center gap-3 ${
            message.type === 'success'
              ? 'bg-emerald-100 dark:bg-emerald-900/30 text-emerald-700 dark:text-emerald-300'
              : 'bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-300'
          }`}>
            {message.type === 'success' ? (
              <CheckCircle className="h-5 w-5" />
            ) : (
              <AlertCircle className="h-5 w-5" />
            )}
            <span className="text-sm font-medium">{message.text}</span>
          </div>
        )}

        {/* Search */}
        <div className="mb-6">
          <div className="relative max-w-md">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="AI 툴 검색..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10"
            />
          </div>
        </div>

        {/* Tools Grid */}
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          {filteredTools.map((tool) => {
            const customLogo = hasCustomLogo(tool.name);
            const displayLogo = getDisplayLogo(tool);
            const isUploadingThis = uploadingTool === tool.name;

            return (
              <div
                key={tool.name}
                className={`bg-card border rounded-xl p-4 ${
                  customLogo
                    ? 'border-emerald-300 dark:border-emerald-700 bg-emerald-50/50 dark:bg-emerald-950/20'
                    : 'border-border'
                }`}
              >
                {/* Tool Header */}
                <div className="flex items-start gap-3 mb-4">
                  {/* Logo Preview */}
                  <div className="w-12 h-12 rounded-lg bg-secondary flex items-center justify-center overflow-hidden flex-shrink-0">
                    <img
                      src={displayLogo}
                      alt={tool.name}
                      className="w-10 h-10 object-contain"
                      onError={(e) => {
                        const target = e.target as HTMLImageElement;
                        target.style.display = 'none';
                        target.nextElementSibling?.classList.remove('hidden');
                      }}
                    />
                    <ImageOff className="h-5 w-5 text-muted-foreground hidden" />
                  </div>

                  <div className="flex-1 min-w-0">
                    <h3 className="font-semibold text-foreground text-sm truncate">{tool.name}</h3>
                    <p className="text-muted-foreground text-xs truncate">{tool.company}</p>
                    {customLogo && (
                      <span className="inline-flex items-center gap-1 text-[10px] text-emerald-600 dark:text-emerald-400 font-medium mt-1">
                        <CheckCircle className="h-3 w-3" />
                        커스텀 로고
                      </span>
                    )}
                  </div>
                </div>

                {/* Actions */}
                <input
                  ref={(el) => { fileInputRefs.current[tool.name] = el; }}
                  type="file"
                  accept="image/*"
                  className="hidden"
                  onChange={(e) => {
                    const file = e.target.files?.[0];
                    if (file) handleFileUpload(file, tool.name);
                    e.target.value = '';
                  }}
                />

                <div className="flex gap-2">
                  <Button
                    size="sm"
                    variant={customLogo ? "outline" : "default"}
                    onClick={() => fileInputRefs.current[tool.name]?.click()}
                    disabled={isUploadingThis || isUploading}
                    className={`flex-1 text-xs ${
                      !customLogo
                        ? 'bg-gradient-to-r from-violet-500 to-purple-600 hover:from-violet-600 hover:to-purple-700 text-white'
                        : ''
                    }`}
                  >
                    {isUploadingThis ? (
                      <Loader2 className="mr-1 h-3 w-3 animate-spin" />
                    ) : (
                      <Upload className="mr-1 h-3 w-3" />
                    )}
                    {customLogo ? '변경' : '업로드'}
                  </Button>
                  {customLogo && (
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => handleDelete(tool.name)}
                      disabled={isUploadingThis || isUploading}
                      className="text-red-500 hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-950/30"
                    >
                      <Trash2 className="h-3 w-3" />
                    </Button>
                  )}
                </div>
              </div>
            );
          })}
        </div>

        {filteredTools.length === 0 && (
          <div className="text-center py-12">
            <p className="text-muted-foreground">검색 결과가 없습니다</p>
          </div>
        )}

        {/* Tips */}
        <div className="mt-8 bg-violet-50 dark:bg-violet-950/20 border border-violet-200 dark:border-violet-800/30 rounded-xl p-5">
          <h3 className="font-semibold text-violet-800 dark:text-violet-300 mb-2">로고 업로드 팁</h3>
          <ul className="text-sm text-violet-700 dark:text-violet-400 space-y-1">
            <li>• PNG 또는 SVG 형식 권장 (투명 배경 지원)</li>
            <li>• 정사각형 권장, 40x40px ~ 100x100px</li>
            <li>• 파일 크기: 500KB 이하</li>
            <li>• 녹색 테두리: 커스텀 로고가 적용된 툴</li>
            <li>• <span className="text-emerald-600 dark:text-emerald-400 font-medium">Supabase 서버에 저장되어 모든 기기에서 적용됩니다</span></li>
          </ul>
        </div>
      </div>
    </div>
  );
}
