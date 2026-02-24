'use client';

import { useState, useRef, useCallback } from 'react';
import { Upload, Check, X, Trash2, Image as ImageIcon, RefreshCw, AlertCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { uploadLogo, deleteLogo } from '@/lib/storage/logos';
import { cn } from '@/lib/utils';

// AI Tools list for logo management
const aiToolsList = [
  { id: 'chatgpt', name: 'ChatGPT', company: 'OpenAI' },
  { id: 'claude', name: 'Claude', company: 'Anthropic' },
  { id: 'gemini', name: 'GEMINI', company: 'Google' },
  { id: 'midjourney', name: 'Midjourney', company: 'Midjourney' },
  { id: 'dalle', name: 'DALL-E 3', company: 'OpenAI' },
  { id: 'runway', name: 'Runway', company: 'Runway' },
  { id: 'github-copilot', name: 'GitHub Copilot', company: 'GitHub' },
  { id: 'cursor', name: 'Cursor', company: 'Cursor' },
  { id: 'elevenlabs', name: 'ElevenLabs', company: 'ElevenLabs' },
  { id: 'suno', name: 'Suno', company: 'Suno AI' },
  { id: 'framer', name: 'Framer', company: 'Framer' },
  { id: 'zapier', name: 'Zapier AI', company: 'Zapier' },
  { id: 'jasper', name: 'Jasper', company: 'Jasper AI' },
  { id: 'copyai', name: 'Copy.ai', company: 'Copy.ai' },
  { id: 'perplexity', name: 'Perplexity', company: 'Perplexity AI' },
  { id: 'writesonic', name: 'Writesonic', company: 'Writesonic' },
  { id: 'rytr', name: 'Rytr', company: 'Rytr' },
  { id: 'quillbot', name: 'QuillBot', company: 'QuillBot' },
  { id: 'wordtune', name: 'Wordtune', company: 'AI21 Labs' },
  { id: 'grammarly', name: 'Grammarly', company: 'Grammarly' },
  { id: 'stable-diffusion', name: 'Stable Diffusion', company: 'Stability AI' },
  { id: 'leonardo', name: 'Leonardo AI', company: 'Leonardo.ai' },
  { id: 'canva', name: 'Canva AI', company: 'Canva' },
  { id: 'adobe-firefly', name: 'Adobe Firefly', company: 'Adobe' },
  { id: 'pika', name: 'Pika Labs', company: 'Pika' },
  { id: 'ideogram', name: 'Ideogram', company: 'Ideogram' },
  { id: 'udio', name: 'Udio', company: 'Udio' },
  { id: 'mubert', name: 'Mubert', company: 'Mubert' },
  { id: 'aiva', name: 'AIVA', company: 'AIVA' },
  { id: 'soundraw', name: 'Soundraw', company: 'Soundraw' },
  { id: 'boomy', name: 'Boomy', company: 'Boomy' },
  { id: 'descript', name: 'Descript', company: 'Descript' },
  { id: 'webflow', name: 'Webflow', company: 'Webflow' },
  { id: '10web', name: '10Web', company: '10Web' },
  { id: 'wix', name: 'Wix ADI', company: 'Wix' },
  { id: 'durable', name: 'Durable', company: 'Durable' },
  { id: 'hostinger', name: 'Hostinger AI', company: 'Hostinger' },
  { id: 'squarespace', name: 'Squarespace', company: 'Squarespace' },
  { id: 'tabnine', name: 'Tabnine', company: 'Tabnine' },
  { id: 'replit', name: 'Replit AI', company: 'Replit' },
  { id: 'codeium', name: 'Codeium', company: 'Codeium' },
  { id: 'amazon-q', name: 'Amazon Q', company: 'AWS' },
  { id: 'sourcegraph', name: 'Sourcegraph Cody', company: 'Sourcegraph' },
  { id: 'make', name: 'Make', company: 'Make' },
  { id: 'n8n', name: 'n8n', company: 'n8n' },
  { id: 'bardeen', name: 'Bardeen', company: 'Bardeen' },
  { id: 'axiom', name: 'Axiom', company: 'Axiom' },
  { id: 'magical', name: 'Magical', company: 'Magical' },
  { id: 'duolingo', name: 'Duolingo Max', company: 'Duolingo' },
  { id: 'khanmigo', name: 'Khanmigo', company: 'Khan Academy' },
  { id: 'quizlet', name: 'Quizlet', company: 'Quizlet' },
  { id: 'photomath', name: 'Photomath', company: 'Photomath' },
  { id: 'socratic', name: 'Socratic', company: 'Google' },
  { id: 'hubspot', name: 'HubSpot AI', company: 'HubSpot' },
  { id: 'surfer', name: 'Surfer SEO', company: 'Surfer' },
  { id: 'adcreative', name: 'AdCreative.ai', company: 'AdCreative' },
  { id: 'frase', name: 'Frase', company: 'Frase' },
  { id: 'marketmuse', name: 'MarketMuse', company: 'MarketMuse' },
  { id: 'openai-api', name: 'OpenAI API', company: 'OpenAI' },
  { id: 'google-ai-studio', name: 'Google AI Studio', company: 'Google' },
  { id: 'anthropic-api', name: 'Anthropic API', company: 'Anthropic' },
  { id: 'huggingface', name: 'Hugging Face', company: 'Hugging Face' },
  { id: 'replicate', name: 'Replicate', company: 'Replicate' },
];

interface UploadState {
  [key: string]: {
    uploading: boolean;
    success: boolean;
    error: string | null;
    logoUrl: string | null;
  };
}

export default function AdminLogosPage() {
  const [uploadStates, setUploadStates] = useState<UploadState>({});
  const [searchTerm, setSearchTerm] = useState('');
  const fileInputRefs = useRef<{ [key: string]: HTMLInputElement | null }>({});

  const filteredTools = aiToolsList.filter(
    (tool) =>
      tool.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      tool.company.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleFileSelect = useCallback(async (toolId: string, file: File) => {
    setUploadStates((prev) => ({
      ...prev,
      [toolId]: { uploading: true, success: false, error: null, logoUrl: null },
    }));

    const result = await uploadLogo(file, toolId);

    setUploadStates((prev) => ({
      ...prev,
      [toolId]: {
        uploading: false,
        success: result.success,
        error: result.error || null,
        logoUrl: result.url || null,
      },
    }));
  }, []);

  const handleDelete = useCallback(async (toolId: string) => {
    if (!confirm('정말 이 로고를 삭제하시겠습니까?')) return;

    setUploadStates((prev) => ({
      ...prev,
      [toolId]: { uploading: true, success: false, error: null, logoUrl: null },
    }));

    const success = await deleteLogo(toolId);

    setUploadStates((prev) => ({
      ...prev,
      [toolId]: {
        uploading: false,
        success: success,
        error: success ? null : '삭제 실패',
        logoUrl: null,
      },
    }));
  }, []);

  const triggerFileInput = (toolId: string) => {
    fileInputRefs.current[toolId]?.click();
  };

  return (
    <div className="content-area">
      {/* Header */}
      <div className="section-header animate-fade-in-up mb-8">
        <div className="inline-flex items-center gap-2 px-4 py-2 bg-primary/10 rounded-full mb-4">
          <ImageIcon className="h-4 w-4 text-primary" />
          <span className="text-sm font-medium">관리자 전용</span>
        </div>
        <h1 className="section-title">AI 도구 로고 관리</h1>
        <p className="section-subtitle">각 AI 도구의 로고 이미지를 업로드하세요</p>
      </div>

      {/* Info Box */}
      <div className="rank-card p-4 mb-6 bg-blue-50 dark:bg-blue-950/30 border-blue-200 dark:border-blue-800">
        <div className="flex gap-3">
          <AlertCircle className="h-5 w-5 text-blue-500 shrink-0 mt-0.5" />
          <div className="text-sm">
            <p className="font-medium text-blue-700 dark:text-blue-300 mb-1">로고 업로드 안내</p>
            <ul className="text-blue-600 dark:text-blue-400 space-y-1">
              <li>- 지원 형식: PNG, JPG, SVG, WebP, GIF</li>
              <li>- 최대 크기: 2MB</li>
              <li>- 권장 크기: 200x200px (정사각형)</li>
              <li>- 투명 배경 PNG 권장</li>
            </ul>
          </div>
        </div>
      </div>

      {/* Search */}
      <div className="search-bar mb-6">
        <input
          type="text"
          placeholder="도구 이름 또는 회사명 검색..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="flex-1"
        />
      </div>

      {/* Tools Grid */}
      <div className="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
        {filteredTools.map((tool) => {
          const state = uploadStates[tool.id] || {
            uploading: false,
            success: false,
            error: null,
            logoUrl: null,
          };

          return (
            <div
              key={tool.id}
              className={cn(
                'rank-card p-4 transition-all',
                state.success && 'border-green-500',
                state.error && 'border-red-500'
              )}
            >
              {/* Logo Preview */}
              <div className="flex items-center gap-4 mb-4">
                <div className="w-16 h-16 rounded-xl bg-secondary flex items-center justify-center overflow-hidden">
                  {state.logoUrl ? (
                    <img
                      src={state.logoUrl}
                      alt={tool.name}
                      className="w-full h-full object-contain p-1"
                    />
                  ) : (
                    <span className="text-xl font-bold text-muted-foreground">
                      {tool.name.substring(0, 2).toUpperCase()}
                    </span>
                  )}
                </div>
                <div className="flex-1 min-w-0">
                  <h3 className="font-bold truncate">{tool.name}</h3>
                  <p className="text-sm text-muted-foreground truncate">{tool.company}</p>
                  <p className="text-xs text-muted-foreground/60">ID: {tool.id}</p>
                </div>
              </div>

              {/* Status */}
              {state.success && (
                <div className="flex items-center gap-2 text-sm text-green-600 mb-3">
                  <Check className="h-4 w-4" />
                  <span>업로드 완료</span>
                </div>
              )}
              {state.error && (
                <div className="flex items-center gap-2 text-sm text-red-600 mb-3">
                  <X className="h-4 w-4" />
                  <span>{state.error}</span>
                </div>
              )}

              {/* Actions */}
              <div className="flex gap-2">
                <input
                  ref={(el) => {
                    fileInputRefs.current[tool.id] = el;
                  }}
                  type="file"
                  accept="image/png,image/jpeg,image/svg+xml,image/webp,image/gif"
                  className="hidden"
                  onChange={(e) => {
                    const file = e.target.files?.[0];
                    if (file) handleFileSelect(tool.id, file);
                  }}
                />
                <Button
                  size="sm"
                  className="flex-1 btn-primary"
                  onClick={() => triggerFileInput(tool.id)}
                  disabled={state.uploading}
                >
                  {state.uploading ? (
                    <RefreshCw className="h-4 w-4 animate-spin" />
                  ) : (
                    <Upload className="h-4 w-4 mr-1" />
                  )}
                  {state.logoUrl ? '변경' : '업로드'}
                </Button>
                {state.logoUrl && (
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => handleDelete(tool.id)}
                    disabled={state.uploading}
                  >
                    <Trash2 className="h-4 w-4 text-red-500" />
                  </Button>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
