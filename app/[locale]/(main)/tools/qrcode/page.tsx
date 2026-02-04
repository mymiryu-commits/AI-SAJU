'use client';

import { useState, useCallback } from 'react';
import { useAuth } from '@/lib/hooks/useAuth';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Slider } from '@/components/ui/slider';
import {
  Link2,
  User,
  Wifi,
  Mail,
  Phone,
  MessageSquare,
  MapPin,
  Calendar,
  Download,
  Loader2,
  QrCode,
  Palette,
  Settings,
  Check,
  ChevronRight,
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { cn } from '@/lib/utils';

type QRType = 'url' | 'vcard' | 'wifi' | 'email' | 'phone' | 'sms' | 'location' | 'event';

const qrTypes = [
  { id: 'url' as QRType, name: 'URL', icon: Link2, description: '웹사이트 링크' },
  { id: 'vcard' as QRType, name: '명함', icon: User, description: '연락처 카드' },
  { id: 'wifi' as QRType, name: 'WiFi', icon: Wifi, description: '네트워크 연결' },
  { id: 'email' as QRType, name: '이메일', icon: Mail, description: '메일 작성' },
  { id: 'phone' as QRType, name: '전화', icon: Phone, description: '전화 연결' },
  { id: 'sms' as QRType, name: 'SMS', icon: MessageSquare, description: '문자 전송' },
  { id: 'location' as QRType, name: '위치', icon: MapPin, description: '지도 위치' },
  { id: 'event' as QRType, name: '일정', icon: Calendar, description: '캘린더 추가' },
];

const presetThemes = [
  { name: '클래식', color: '#000000', bg: '#FFFFFF' },
  { name: '인버스', color: '#FFFFFF', bg: '#18181B' },
  { name: '골드', color: '#92400E', bg: '#FFFBEB' },
  { name: '그레이', color: '#374151', bg: '#F9FAFB' },
  { name: '세이지', color: '#374151', bg: '#F0FDF4' },
  { name: '로즈', color: '#374151', bg: '#FFF1F2' },
];

export default function QRCodeGeneratorPage() {
  const { user } = useAuth();
  const [selectedType, setSelectedType] = useState<QRType>('url');
  const [formData, setFormData] = useState<Record<string, string>>({});
  const [options, setOptions] = useState({
    size: 300,
    color: '#000000',
    backgroundColor: '#FFFFFF',
    errorCorrectionLevel: 'M' as 'L' | 'M' | 'Q' | 'H',
    margin: 4,
  });
  const [generatedQR, setGeneratedQR] = useState<string | null>(null);
  const [isGenerating, setIsGenerating] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState('content');

  const handleInputChange = useCallback((field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    setError(null);
  }, []);

  const handleGenerate = async () => {
    setIsGenerating(true);
    setError(null);

    try {
      const response = await fetch('/api/qr/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          type: selectedType,
          data: formData,
          options,
        }),
      });

      const data = await response.json();

      if (data.success) {
        setGeneratedQR(data.qrCode);
      } else {
        setError(data.error || 'QR 코드 생성에 실패했습니다.');
      }
    } catch {
      setError('QR 코드 생성 중 오류가 발생했습니다.');
    } finally {
      setIsGenerating(false);
    }
  };

  const handleDownload = () => {
    if (!generatedQR) return;

    const link = document.createElement('a');
    link.download = `qrcode-${selectedType}-${Date.now()}.png`;
    link.href = generatedQR;
    link.click();
  };

  const applyPreset = (preset: typeof presetThemes[0]) => {
    setOptions(prev => ({
      ...prev,
      color: preset.color,
      backgroundColor: preset.bg,
    }));
  };

  const renderForm = () => {
    const inputClass = "bg-white dark:bg-zinc-900 border-zinc-200 dark:border-zinc-800 focus:border-zinc-400 focus:ring-zinc-400/20 rounded-lg";

    switch (selectedType) {
      case 'url':
        return (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-4"
          >
            <div>
              <Label className="text-sm font-medium text-zinc-700 dark:text-zinc-300">URL 주소</Label>
              <Input
                placeholder="https://example.com"
                value={formData.url || ''}
                onChange={(e) => handleInputChange('url', e.target.value)}
                className={cn("mt-2 h-12", inputClass)}
              />
            </div>
          </motion.div>
        );

      case 'vcard':
        return (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-4"
          >
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label className="text-sm font-medium text-zinc-700 dark:text-zinc-300">성</Label>
                <Input
                  placeholder="홍"
                  value={formData.lastName || ''}
                  onChange={(e) => handleInputChange('lastName', e.target.value)}
                  className={cn("mt-2 h-11", inputClass)}
                />
              </div>
              <div>
                <Label className="text-sm font-medium text-zinc-700 dark:text-zinc-300">이름</Label>
                <Input
                  placeholder="길동"
                  value={formData.firstName || ''}
                  onChange={(e) => handleInputChange('firstName', e.target.value)}
                  className={cn("mt-2 h-11", inputClass)}
                />
              </div>
            </div>
            <div>
              <Label className="text-sm font-medium text-zinc-700 dark:text-zinc-300">회사</Label>
              <Input
                placeholder="회사명"
                value={formData.organization || ''}
                onChange={(e) => handleInputChange('organization', e.target.value)}
                className={cn("mt-2 h-11", inputClass)}
              />
            </div>
            <div>
              <Label className="text-sm font-medium text-zinc-700 dark:text-zinc-300">직함</Label>
              <Input
                placeholder="대표이사"
                value={formData.title || ''}
                onChange={(e) => handleInputChange('title', e.target.value)}
                className={cn("mt-2 h-11", inputClass)}
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label className="text-sm font-medium text-zinc-700 dark:text-zinc-300">전화번호</Label>
                <Input
                  placeholder="010-1234-5678"
                  value={formData.phone || ''}
                  onChange={(e) => handleInputChange('phone', e.target.value)}
                  className={cn("mt-2 h-11", inputClass)}
                />
              </div>
              <div>
                <Label className="text-sm font-medium text-zinc-700 dark:text-zinc-300">이메일</Label>
                <Input
                  placeholder="email@example.com"
                  value={formData.email || ''}
                  onChange={(e) => handleInputChange('email', e.target.value)}
                  className={cn("mt-2 h-11", inputClass)}
                />
              </div>
            </div>
            <div>
              <Label className="text-sm font-medium text-zinc-700 dark:text-zinc-300">웹사이트</Label>
              <Input
                placeholder="https://example.com"
                value={formData.website || ''}
                onChange={(e) => handleInputChange('website', e.target.value)}
                className={cn("mt-2 h-11", inputClass)}
              />
            </div>
          </motion.div>
        );

      case 'wifi':
        return (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-4"
          >
            <div>
              <Label className="text-sm font-medium text-zinc-700 dark:text-zinc-300">네트워크 이름 (SSID)</Label>
              <Input
                placeholder="MyWiFi"
                value={formData.ssid || ''}
                onChange={(e) => handleInputChange('ssid', e.target.value)}
                className={cn("mt-2 h-11", inputClass)}
              />
            </div>
            <div>
              <Label className="text-sm font-medium text-zinc-700 dark:text-zinc-300">비밀번호</Label>
              <Input
                type="password"
                placeholder="WiFi 비밀번호"
                value={formData.password || ''}
                onChange={(e) => handleInputChange('password', e.target.value)}
                className={cn("mt-2 h-11", inputClass)}
              />
            </div>
            <div>
              <Label className="text-sm font-medium text-zinc-700 dark:text-zinc-300">암호화 방식</Label>
              <Select
                value={formData.encryption || 'WPA'}
                onValueChange={(value) => handleInputChange('encryption', value)}
              >
                <SelectTrigger className={cn("mt-2 h-11", inputClass)}>
                  <SelectValue placeholder="암호화 방식 선택" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="WPA">WPA/WPA2</SelectItem>
                  <SelectItem value="WEP">WEP</SelectItem>
                  <SelectItem value="nopass">암호 없음</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </motion.div>
        );

      case 'email':
        return (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-4"
          >
            <div>
              <Label className="text-sm font-medium text-zinc-700 dark:text-zinc-300">이메일 주소</Label>
              <Input
                placeholder="email@example.com"
                value={formData.email || ''}
                onChange={(e) => handleInputChange('email', e.target.value)}
                className={cn("mt-2 h-11", inputClass)}
              />
            </div>
            <div>
              <Label className="text-sm font-medium text-zinc-700 dark:text-zinc-300">제목</Label>
              <Input
                placeholder="이메일 제목"
                value={formData.subject || ''}
                onChange={(e) => handleInputChange('subject', e.target.value)}
                className={cn("mt-2 h-11", inputClass)}
              />
            </div>
            <div>
              <Label className="text-sm font-medium text-zinc-700 dark:text-zinc-300">내용</Label>
              <Input
                placeholder="이메일 내용"
                value={formData.body || ''}
                onChange={(e) => handleInputChange('body', e.target.value)}
                className={cn("mt-2 h-11", inputClass)}
              />
            </div>
          </motion.div>
        );

      case 'phone':
        return (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-4"
          >
            <div>
              <Label className="text-sm font-medium text-zinc-700 dark:text-zinc-300">전화번호</Label>
              <Input
                placeholder="010-1234-5678"
                value={formData.phone || ''}
                onChange={(e) => handleInputChange('phone', e.target.value)}
                className={cn("mt-2 h-12", inputClass)}
              />
            </div>
          </motion.div>
        );

      case 'sms':
        return (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-4"
          >
            <div>
              <Label className="text-sm font-medium text-zinc-700 dark:text-zinc-300">전화번호</Label>
              <Input
                placeholder="010-1234-5678"
                value={formData.phone || ''}
                onChange={(e) => handleInputChange('phone', e.target.value)}
                className={cn("mt-2 h-11", inputClass)}
              />
            </div>
            <div>
              <Label className="text-sm font-medium text-zinc-700 dark:text-zinc-300">메시지</Label>
              <Input
                placeholder="문자 내용"
                value={formData.message || ''}
                onChange={(e) => handleInputChange('message', e.target.value)}
                className={cn("mt-2 h-11", inputClass)}
              />
            </div>
          </motion.div>
        );

      case 'location':
        return (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-4"
          >
            <div>
              <Label className="text-sm font-medium text-zinc-700 dark:text-zinc-300">주소</Label>
              <Input
                placeholder="서울시 강남구..."
                value={formData.address || ''}
                onChange={(e) => handleInputChange('address', e.target.value)}
                className={cn("mt-2 h-11", inputClass)}
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label className="text-sm font-medium text-zinc-700 dark:text-zinc-300">위도</Label>
                <Input
                  placeholder="37.5665"
                  value={formData.latitude || ''}
                  onChange={(e) => handleInputChange('latitude', e.target.value)}
                  className={cn("mt-2 h-11", inputClass)}
                />
              </div>
              <div>
                <Label className="text-sm font-medium text-zinc-700 dark:text-zinc-300">경도</Label>
                <Input
                  placeholder="126.9780"
                  value={formData.longitude || ''}
                  onChange={(e) => handleInputChange('longitude', e.target.value)}
                  className={cn("mt-2 h-11", inputClass)}
                />
              </div>
            </div>
          </motion.div>
        );

      case 'event':
        return (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-4"
          >
            <div>
              <Label className="text-sm font-medium text-zinc-700 dark:text-zinc-300">일정 제목</Label>
              <Input
                placeholder="회의"
                value={formData.title || ''}
                onChange={(e) => handleInputChange('title', e.target.value)}
                className={cn("mt-2 h-11", inputClass)}
              />
            </div>
            <div>
              <Label className="text-sm font-medium text-zinc-700 dark:text-zinc-300">설명</Label>
              <Input
                placeholder="일정 설명"
                value={formData.description || ''}
                onChange={(e) => handleInputChange('description', e.target.value)}
                className={cn("mt-2 h-11", inputClass)}
              />
            </div>
            <div>
              <Label className="text-sm font-medium text-zinc-700 dark:text-zinc-300">장소</Label>
              <Input
                placeholder="회의실"
                value={formData.location || ''}
                onChange={(e) => handleInputChange('location', e.target.value)}
                className={cn("mt-2 h-11", inputClass)}
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label className="text-sm font-medium text-zinc-700 dark:text-zinc-300">시작</Label>
                <Input
                  type="datetime-local"
                  value={formData.startDate || ''}
                  onChange={(e) => handleInputChange('startDate', e.target.value)}
                  className={cn("mt-2 h-11", inputClass)}
                />
              </div>
              <div>
                <Label className="text-sm font-medium text-zinc-700 dark:text-zinc-300">종료</Label>
                <Input
                  type="datetime-local"
                  value={formData.endDate || ''}
                  onChange={(e) => handleInputChange('endDate', e.target.value)}
                  className={cn("mt-2 h-11", inputClass)}
                />
              </div>
            </div>
          </motion.div>
        );

      default:
        return null;
    }
  };

  const selectedTypeInfo = qrTypes.find(t => t.id === selectedType);

  return (
    <div className="min-h-screen bg-zinc-50 dark:bg-zinc-950">
      <div className="container mx-auto px-4 py-12 max-w-5xl">
        {/* Minimal Header */}
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-12"
        >
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-zinc-900 dark:bg-white mb-6">
            <QrCode className="h-8 w-8 text-white dark:text-zinc-900" />
          </div>
          <h1 className="text-3xl md:text-4xl font-semibold text-zinc-900 dark:text-white tracking-tight">
            QR Code Generator
          </h1>
          <p className="mt-3 text-zinc-500 dark:text-zinc-400 max-w-md mx-auto">
            URL, 명함, WiFi 등 8가지 유형의 QR코드를 생성하세요
          </p>
        </motion.div>

        {/* Type Selection - Horizontal Scroll */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="mb-10"
        >
          <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-hide">
            {qrTypes.map((type) => {
              const Icon = type.icon;
              const isSelected = selectedType === type.id;
              return (
                <button
                  key={type.id}
                  onClick={() => {
                    setSelectedType(type.id);
                    setFormData({});
                    setGeneratedQR(null);
                  }}
                  className={cn(
                    'flex items-center gap-2 px-4 py-2.5 rounded-full whitespace-nowrap transition-all',
                    isSelected
                      ? 'bg-zinc-900 dark:bg-white text-white dark:text-zinc-900'
                      : 'bg-white dark:bg-zinc-900 text-zinc-600 dark:text-zinc-400 hover:bg-zinc-100 dark:hover:bg-zinc-800 border border-zinc-200 dark:border-zinc-800'
                  )}
                >
                  <Icon className="h-4 w-4" />
                  <span className="text-sm font-medium">{type.name}</span>
                </button>
              );
            })}
          </div>
        </motion.div>

        {/* Main Content */}
        <div className="grid lg:grid-cols-5 gap-8">
          {/* Form Section */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2 }}
            className="lg:col-span-3"
          >
            <Card className="border-zinc-200 dark:border-zinc-800 shadow-sm bg-white dark:bg-zinc-900">
              <CardContent className="p-6">
                <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
                  <TabsList className="grid w-full grid-cols-2 mb-6 bg-zinc-100 dark:bg-zinc-800 p-1 rounded-lg h-11">
                    <TabsTrigger
                      value="content"
                      className="rounded-md data-[state=active]:bg-white dark:data-[state=active]:bg-zinc-700 data-[state=active]:shadow-sm"
                    >
                      <Settings className="h-4 w-4 mr-2" />
                      내용
                    </TabsTrigger>
                    <TabsTrigger
                      value="design"
                      className="rounded-md data-[state=active]:bg-white dark:data-[state=active]:bg-zinc-700 data-[state=active]:shadow-sm"
                    >
                      <Palette className="h-4 w-4 mr-2" />
                      스타일
                    </TabsTrigger>
                  </TabsList>

                  <TabsContent value="content" className="mt-0">
                    <div className="mb-6 pb-6 border-b border-zinc-100 dark:border-zinc-800">
                      <div className="flex items-center gap-3">
                        {selectedTypeInfo && (
                          <div className="w-10 h-10 rounded-xl bg-zinc-100 dark:bg-zinc-800 flex items-center justify-center">
                            <selectedTypeInfo.icon className="h-5 w-5 text-zinc-700 dark:text-zinc-300" />
                          </div>
                        )}
                        <div>
                          <h3 className="font-medium text-zinc-900 dark:text-white">{selectedTypeInfo?.name}</h3>
                          <p className="text-sm text-zinc-500">{selectedTypeInfo?.description}</p>
                        </div>
                      </div>
                    </div>
                    <AnimatePresence mode="wait">
                      {renderForm()}
                    </AnimatePresence>
                  </TabsContent>

                  <TabsContent value="design" className="mt-0 space-y-6">
                    {/* Theme Presets */}
                    <div>
                      <Label className="text-sm font-medium text-zinc-700 dark:text-zinc-300 mb-3 block">테마</Label>
                      <div className="grid grid-cols-3 sm:grid-cols-6 gap-2">
                        {presetThemes.map((preset) => (
                          <button
                            key={preset.name}
                            onClick={() => applyPreset(preset)}
                            className={cn(
                              'p-3 rounded-xl border transition-all hover:scale-[1.02]',
                              options.color === preset.color && options.backgroundColor === preset.bg
                                ? 'border-zinc-900 dark:border-white ring-1 ring-zinc-900 dark:ring-white'
                                : 'border-zinc-200 dark:border-zinc-700'
                            )}
                          >
                            <div
                              className="w-full aspect-square rounded-lg mb-2"
                              style={{ backgroundColor: preset.bg, border: `2px solid ${preset.color}` }}
                            />
                            <span className="text-xs text-zinc-600 dark:text-zinc-400">{preset.name}</span>
                          </button>
                        ))}
                      </div>
                    </div>

                    {/* Custom Colors */}
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <Label className="text-sm font-medium text-zinc-700 dark:text-zinc-300">QR 색상</Label>
                        <div className="flex items-center gap-2 mt-2">
                          <input
                            type="color"
                            value={options.color}
                            onChange={(e) => setOptions(prev => ({ ...prev, color: e.target.value }))}
                            className="w-11 h-11 rounded-lg cursor-pointer border border-zinc-200 dark:border-zinc-700"
                          />
                          <Input
                            value={options.color}
                            onChange={(e) => setOptions(prev => ({ ...prev, color: e.target.value }))}
                            className="flex-1 font-mono text-sm h-11 bg-white dark:bg-zinc-900 border-zinc-200 dark:border-zinc-700"
                          />
                        </div>
                      </div>
                      <div>
                        <Label className="text-sm font-medium text-zinc-700 dark:text-zinc-300">배경 색상</Label>
                        <div className="flex items-center gap-2 mt-2">
                          <input
                            type="color"
                            value={options.backgroundColor}
                            onChange={(e) => setOptions(prev => ({ ...prev, backgroundColor: e.target.value }))}
                            className="w-11 h-11 rounded-lg cursor-pointer border border-zinc-200 dark:border-zinc-700"
                          />
                          <Input
                            value={options.backgroundColor}
                            onChange={(e) => setOptions(prev => ({ ...prev, backgroundColor: e.target.value }))}
                            className="flex-1 font-mono text-sm h-11 bg-white dark:bg-zinc-900 border-zinc-200 dark:border-zinc-700"
                          />
                        </div>
                      </div>
                    </div>

                    {/* Size */}
                    <div>
                      <div className="flex items-center justify-between mb-3">
                        <Label className="text-sm font-medium text-zinc-700 dark:text-zinc-300">크기</Label>
                        <span className="text-sm font-mono text-zinc-500">{options.size}px</span>
                      </div>
                      <Slider
                        value={[options.size]}
                        onValueChange={([value]) => setOptions(prev => ({ ...prev, size: value }))}
                        min={100}
                        max={1000}
                        step={50}
                        className="py-2"
                      />
                    </div>

                    {/* Error Correction */}
                    <div>
                      <Label className="text-sm font-medium text-zinc-700 dark:text-zinc-300">오류 정정</Label>
                      <Select
                        value={options.errorCorrectionLevel}
                        onValueChange={(value) => setOptions(prev => ({
                          ...prev,
                          errorCorrectionLevel: value as 'L' | 'M' | 'Q' | 'H'
                        }))}
                      >
                        <SelectTrigger className="mt-2 h-11 bg-white dark:bg-zinc-900 border-zinc-200 dark:border-zinc-700">
                          <SelectValue placeholder="오류 정정 수준 선택" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="L">낮음 (7%)</SelectItem>
                          <SelectItem value="M">중간 (15%) — 권장</SelectItem>
                          <SelectItem value="Q">높음 (25%)</SelectItem>
                          <SelectItem value="H">최고 (30%)</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </TabsContent>
                </Tabs>

                {error && (
                  <motion.div
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="mt-6 p-4 bg-red-50 dark:bg-red-950/30 text-red-600 dark:text-red-400 rounded-lg text-sm"
                  >
                    {error}
                  </motion.div>
                )}

                <Button
                  onClick={handleGenerate}
                  disabled={isGenerating}
                  className="w-full mt-6 h-12 text-base gap-2 bg-zinc-900 dark:bg-white text-white dark:text-zinc-900 hover:bg-zinc-800 dark:hover:bg-zinc-100 rounded-xl"
                >
                  {isGenerating ? (
                    <>
                      <Loader2 className="h-5 w-5 animate-spin" />
                      생성 중...
                    </>
                  ) : (
                    <>
                      QR코드 생성
                      <ChevronRight className="h-5 w-5" />
                    </>
                  )}
                </Button>
              </CardContent>
            </Card>
          </motion.div>

          {/* Preview Section */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.3 }}
            className="lg:col-span-2"
          >
            <div className="sticky top-24">
              <Card className="border-zinc-200 dark:border-zinc-800 shadow-sm bg-white dark:bg-zinc-900">
                <CardContent className="p-6">
                  <div className="text-center mb-4">
                    <h3 className="font-medium text-zinc-900 dark:text-white">미리보기</h3>
                  </div>

                  <AnimatePresence mode="wait">
                    {generatedQR ? (
                      <motion.div
                        key="qr"
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0, scale: 0.95 }}
                      >
                        <div
                          className="p-6 rounded-xl mx-auto w-fit"
                          style={{ backgroundColor: options.backgroundColor }}
                        >
                          <img
                            src={generatedQR}
                            alt="Generated QR Code"
                            style={{
                              width: Math.min(options.size, 200),
                              height: Math.min(options.size, 200)
                            }}
                          />
                        </div>

                        <div className="mt-6 space-y-3">
                          <Button
                            onClick={handleDownload}
                            variant="outline"
                            className="w-full h-11 gap-2 border-zinc-200 dark:border-zinc-700 hover:bg-zinc-50 dark:hover:bg-zinc-800 rounded-xl"
                          >
                            <Download className="h-4 w-4" />
                            다운로드
                          </Button>

                          {!user && (
                            <p className="text-xs text-zinc-500 text-center">
                              로그인하면 기록을 저장할 수 있습니다
                            </p>
                          )}
                        </div>
                      </motion.div>
                    ) : (
                      <motion.div
                        key="empty"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="aspect-square max-w-[200px] mx-auto bg-zinc-100 dark:bg-zinc-800 rounded-xl flex items-center justify-center"
                      >
                        <div className="text-center">
                          <QrCode className="h-12 w-12 mx-auto mb-3 text-zinc-300 dark:text-zinc-600" />
                          <p className="text-sm text-zinc-400 dark:text-zinc-500">QR코드가 여기에<br />표시됩니다</p>
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </CardContent>
              </Card>

              {/* Subtle Features */}
              <div className="mt-6 grid grid-cols-2 gap-3">
                {[
                  { label: '8가지 유형', check: true },
                  { label: '고화질 출력', check: true },
                  { label: '무료 사용', check: true },
                  { label: '광고 없음', check: true },
                ].map((item, i) => (
                  <div key={i} className="flex items-center gap-2 text-sm text-zinc-500 dark:text-zinc-400">
                    <div className="w-4 h-4 rounded-full bg-zinc-100 dark:bg-zinc-800 flex items-center justify-center">
                      <Check className="h-2.5 w-2.5 text-zinc-600 dark:text-zinc-400" />
                    </div>
                    {item.label}
                  </div>
                ))}
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
}
