'use client';

import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Eye, EyeOff, Save, Loader2, CheckCircle, AlertCircle, Key, RefreshCw } from 'lucide-react';

interface ApiKeyConfig {
  gemini: string;
  openai: string;
  toss_secret: string;
  toss_webhook_secret: string;
  stripe_secret: string;
  stripe_webhook_secret: string;
}

interface ApiKeyField {
  key: keyof ApiKeyConfig;
  label: string;
  description: string;
  placeholder: string;
}

const API_KEY_FIELDS: ApiKeyField[] = [
  {
    key: 'gemini',
    label: 'Gemini API Key',
    description: 'Google Gemini AI API 키 (TTS, AI 분석용)',
    placeholder: 'AIza...',
  },
  {
    key: 'openai',
    label: 'OpenAI API Key',
    description: 'OpenAI API 키 (TTS, AI 분석용)',
    placeholder: 'sk-...',
  },
  {
    key: 'toss_secret',
    label: 'Toss Secret Key',
    description: '토스페이먼츠 시크릿 키 (결제 확인용)',
    placeholder: 'test_sk_...',
  },
  {
    key: 'toss_webhook_secret',
    label: 'Toss Webhook Secret',
    description: '토스페이먼츠 웹훅 시크릿 (서명 검증용)',
    placeholder: 'whsec_...',
  },
  {
    key: 'stripe_secret',
    label: 'Stripe Secret Key',
    description: 'Stripe 시크릿 키 (해외 결제용)',
    placeholder: 'sk_...',
  },
  {
    key: 'stripe_webhook_secret',
    label: 'Stripe Webhook Secret',
    description: 'Stripe 웹훅 시크릿 (서명 검증용)',
    placeholder: 'whsec_...',
  },
];

export default function ApiKeysPage() {
  const [apiKeys, setApiKeys] = useState<ApiKeyConfig>({
    gemini: '',
    openai: '',
    toss_secret: '',
    toss_webhook_secret: '',
    stripe_secret: '',
    stripe_webhook_secret: '',
  });
  const [showKeys, setShowKeys] = useState<Record<string, boolean>>({});
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [saveStatus, setSaveStatus] = useState<'idle' | 'success' | 'error'>('idle');
  const [errorMessage, setErrorMessage] = useState('');

  useEffect(() => {
    fetchApiKeys();
  }, []);

  const fetchApiKeys = async () => {
    try {
      setLoading(true);
      const response = await fetch('/api/admin/api-keys');
      if (!response.ok) throw new Error('Failed to fetch API keys');

      const data = await response.json();
      // 마스킹된 키를 표시 (실제 키는 서버에서 마스킹됨)
      setApiKeys(data.keys || {});
    } catch (error) {
      console.error('Error fetching API keys:', error);
      setErrorMessage('API 키를 불러오는 데 실패했습니다.');
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async () => {
    try {
      setSaving(true);
      setSaveStatus('idle');
      setErrorMessage('');

      const response = await fetch('/api/admin/api-keys', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ keys: apiKeys }),
      });

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.error || 'Failed to save API keys');
      }

      setSaveStatus('success');
      setTimeout(() => setSaveStatus('idle'), 3000);
    } catch (error) {
      console.error('Error saving API keys:', error);
      setSaveStatus('error');
      setErrorMessage(error instanceof Error ? error.message : 'API 키 저장에 실패했습니다.');
    } finally {
      setSaving(false);
    }
  };

  const toggleShowKey = (key: string) => {
    setShowKeys(prev => ({ ...prev, [key]: !prev[key] }));
  };

  const handleKeyChange = (key: keyof ApiKeyConfig, value: string) => {
    setApiKeys(prev => ({ ...prev, [key]: value }));
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <Loader2 className="h-8 w-8 animate-spin text-purple-600" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
            API 키 설정
          </h1>
          <p className="text-gray-600 dark:text-gray-400 mt-1">
            외부 서비스 연동에 필요한 API 키를 관리합니다.
          </p>
        </div>
        <Button onClick={fetchApiKeys} variant="outline" size="sm">
          <RefreshCw className="h-4 w-4 mr-2" />
          새로고침
        </Button>
      </div>

      {/* 보안 경고 */}
      <Card className="border-yellow-200 bg-yellow-50 dark:bg-yellow-900/20">
        <CardContent className="pt-6">
          <div className="flex gap-3">
            <AlertCircle className="h-5 w-5 text-yellow-600 flex-shrink-0" />
            <div>
              <p className="font-medium text-yellow-800 dark:text-yellow-200">
                보안 주의사항
              </p>
              <ul className="text-sm text-yellow-700 dark:text-yellow-300 mt-1 list-disc list-inside">
                <li>API 키는 암호화되어 저장됩니다.</li>
                <li>키를 다른 사람과 공유하지 마세요.</li>
                <li>프로덕션 키는 반드시 별도로 관리하세요.</li>
              </ul>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* API Keys Form */}
      <div className="grid gap-6 md:grid-cols-2">
        {API_KEY_FIELDS.map((field) => (
          <Card key={field.key}>
            <CardHeader>
              <CardTitle className="text-lg flex items-center gap-2">
                <Key className="h-5 w-5 text-purple-600" />
                {field.label}
              </CardTitle>
              <CardDescription>{field.description}</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                <Label htmlFor={field.key} className="sr-only">
                  {field.label}
                </Label>
                <div className="relative">
                  <Input
                    id={field.key}
                    type={showKeys[field.key] ? 'text' : 'password'}
                    value={apiKeys[field.key]}
                    onChange={(e) => handleKeyChange(field.key, e.target.value)}
                    placeholder={field.placeholder}
                    className="pr-10 font-mono text-sm"
                  />
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    className="absolute right-0 top-0 h-full px-3"
                    onClick={() => toggleShowKey(field.key)}
                  >
                    {showKeys[field.key] ? (
                      <EyeOff className="h-4 w-4" />
                    ) : (
                      <Eye className="h-4 w-4" />
                    )}
                  </Button>
                </div>
                {apiKeys[field.key] && apiKeys[field.key].includes('*') && (
                  <p className="text-xs text-gray-500">
                    저장된 키가 있습니다. 변경하려면 새 키를 입력하세요.
                  </p>
                )}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Save Button */}
      <div className="flex items-center justify-end gap-4">
        {saveStatus === 'success' && (
          <span className="text-green-600 flex items-center gap-2">
            <CheckCircle className="h-5 w-5" />
            저장되었습니다
          </span>
        )}
        {saveStatus === 'error' && (
          <span className="text-red-600 flex items-center gap-2">
            <AlertCircle className="h-5 w-5" />
            {errorMessage}
          </span>
        )}
        <Button onClick={handleSave} disabled={saving}>
          {saving ? (
            <>
              <Loader2 className="h-4 w-4 mr-2 animate-spin" />
              저장 중...
            </>
          ) : (
            <>
              <Save className="h-4 w-4 mr-2" />
              저장하기
            </>
          )}
        </Button>
      </div>
    </div>
  );
}
