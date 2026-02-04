'use client';

import { useState, useCallback, useEffect } from 'react';
import Image from 'next/image';
import { useAuth } from '@/lib/hooks/useAuth';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
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
  Sparkles,
  ImageIcon,
  Check,
  Zap,
  Shield,
  Share2,
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { cn } from '@/lib/utils';

type QRType = 'url' | 'vcard' | 'wifi' | 'email' | 'phone' | 'sms' | 'location' | 'event';

const qrTypes = [
  { id: 'url' as QRType, name: 'URL 링크', icon: Link2, description: '웹사이트 주소', gradient: 'from-blue-500 to-cyan-500', popular: true },
  { id: 'vcard' as QRType, name: '연락처', icon: User, description: '명함 QR코드', gradient: 'from-violet-500 to-purple-500', popular: true },
  { id: 'wifi' as QRType, name: 'WiFi', icon: Wifi, description: '비밀번호 없이 연결', gradient: 'from-green-500 to-emerald-500' },
  { id: 'email' as QRType, name: '이메일', icon: Mail, description: '이메일 작성', gradient: 'from-amber-500 to-orange-500' },
  { id: 'phone' as QRType, name: '전화', icon: Phone, description: '바로 전화 연결', gradient: 'from-pink-500 to-rose-500' },
  { id: 'sms' as QRType, name: 'SMS', icon: MessageSquare, description: '문자 메시지', gradient: 'from-teal-500 to-cyan-500' },
  { id: 'location' as QRType, name: '위치', icon: MapPin, description: '지도 위치', gradient: 'from-red-500 to-orange-500' },
  { id: 'event' as QRType, name: '일정', icon: Calendar, description: '캘린더 추가', gradient: 'from-indigo-500 to-blue-500' },
];

const presetColors = [
  { name: '클래식', color: '#000000', bg: '#FFFFFF' },
  { name: '다크', color: '#FFFFFF', bg: '#1a1a1a' },
  { name: '네이비', color: '#1e3a5f', bg: '#f0f4f8' },
  { name: '로얄', color: '#7c3aed', bg: '#f5f3ff' },
  { name: '에메랄드', color: '#059669', bg: '#ecfdf5' },
  { name: '로즈', color: '#be185d', bg: '#fdf2f8' },
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

  // Hero image from settings
  const [heroImageUrl, setHeroImageUrl] = useState<string | null>(null);
  const [heroImageLoaded, setHeroImageLoaded] = useState(false);

  // Fetch hero image from settings
  useEffect(() => {
    const fetchHeroImage = async () => {
      try {
        const response = await fetch('/api/site-settings?key=qr_hero_image');
        const result = await response.json();
        if (result.data?.value?.image_url) {
          setHeroImageUrl(result.data.value.image_url);
        }
      } catch (error) {
        console.error('Failed to fetch QR hero image:', error);
      }
    };
    fetchHeroImage();
  }, []);

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
    } catch (err) {
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

  const applyPreset = (preset: typeof presetColors[0]) => {
    setOptions(prev => ({
      ...prev,
      color: preset.color,
      backgroundColor: preset.bg,
    }));
  };

  const renderForm = () => {
    const inputClass = "bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700 focus:border-cyan-500 focus:ring-cyan-500/20";

    switch (selectedType) {
      case 'url':
        return (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-4"
          >
            <div>
              <Label className="text-sm font-medium">URL 주소</Label>
              <Input
                placeholder="https://example.com"
                value={formData.url || ''}
                onChange={(e) => handleInputChange('url', e.target.value)}
                className={cn("mt-1.5", inputClass)}
              />
              <p className="text-xs text-muted-foreground mt-1">웹사이트, SNS, 앱 링크 등</p>
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
                <Label className="text-sm font-medium">성</Label>
                <Input
                  placeholder="홍"
                  value={formData.lastName || ''}
                  onChange={(e) => handleInputChange('lastName', e.target.value)}
                  className={cn("mt-1.5", inputClass)}
                />
              </div>
              <div>
                <Label className="text-sm font-medium">이름</Label>
                <Input
                  placeholder="길동"
                  value={formData.firstName || ''}
                  onChange={(e) => handleInputChange('firstName', e.target.value)}
                  className={cn("mt-1.5", inputClass)}
                />
              </div>
            </div>
            <div>
              <Label className="text-sm font-medium">회사</Label>
              <Input
                placeholder="회사명"
                value={formData.organization || ''}
                onChange={(e) => handleInputChange('organization', e.target.value)}
                className={cn("mt-1.5", inputClass)}
              />
            </div>
            <div>
              <Label className="text-sm font-medium">직함</Label>
              <Input
                placeholder="대표이사"
                value={formData.title || ''}
                onChange={(e) => handleInputChange('title', e.target.value)}
                className={cn("mt-1.5", inputClass)}
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label className="text-sm font-medium">전화번호</Label>
                <Input
                  placeholder="010-1234-5678"
                  value={formData.phone || ''}
                  onChange={(e) => handleInputChange('phone', e.target.value)}
                  className={cn("mt-1.5", inputClass)}
                />
              </div>
              <div>
                <Label className="text-sm font-medium">이메일</Label>
                <Input
                  placeholder="email@example.com"
                  value={formData.email || ''}
                  onChange={(e) => handleInputChange('email', e.target.value)}
                  className={cn("mt-1.5", inputClass)}
                />
              </div>
            </div>
            <div>
              <Label className="text-sm font-medium">웹사이트</Label>
              <Input
                placeholder="https://example.com"
                value={formData.website || ''}
                onChange={(e) => handleInputChange('website', e.target.value)}
                className={cn("mt-1.5", inputClass)}
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
              <Label className="text-sm font-medium">네트워크 이름 (SSID)</Label>
              <Input
                placeholder="MyWiFi"
                value={formData.ssid || ''}
                onChange={(e) => handleInputChange('ssid', e.target.value)}
                className={cn("mt-1.5", inputClass)}
              />
            </div>
            <div>
              <Label className="text-sm font-medium">비밀번호</Label>
              <Input
                type="password"
                placeholder="WiFi 비밀번호"
                value={formData.password || ''}
                onChange={(e) => handleInputChange('password', e.target.value)}
                className={cn("mt-1.5", inputClass)}
              />
            </div>
            <div>
              <Label className="text-sm font-medium">암호화 방식</Label>
              <Select
                value={formData.encryption || 'WPA'}
                onValueChange={(value) => handleInputChange('encryption', value)}
              >
                <SelectTrigger className={cn("mt-1.5", inputClass)}>
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
              <Label className="text-sm font-medium">이메일 주소</Label>
              <Input
                placeholder="email@example.com"
                value={formData.email || ''}
                onChange={(e) => handleInputChange('email', e.target.value)}
                className={cn("mt-1.5", inputClass)}
              />
            </div>
            <div>
              <Label className="text-sm font-medium">제목</Label>
              <Input
                placeholder="이메일 제목"
                value={formData.subject || ''}
                onChange={(e) => handleInputChange('subject', e.target.value)}
                className={cn("mt-1.5", inputClass)}
              />
            </div>
            <div>
              <Label className="text-sm font-medium">내용</Label>
              <Input
                placeholder="이메일 내용"
                value={formData.body || ''}
                onChange={(e) => handleInputChange('body', e.target.value)}
                className={cn("mt-1.5", inputClass)}
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
              <Label className="text-sm font-medium">전화번호</Label>
              <Input
                placeholder="010-1234-5678"
                value={formData.phone || ''}
                onChange={(e) => handleInputChange('phone', e.target.value)}
                className={cn("mt-1.5", inputClass)}
              />
              <p className="text-xs text-muted-foreground mt-1">스캔하면 바로 전화가 연결됩니다</p>
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
              <Label className="text-sm font-medium">전화번호</Label>
              <Input
                placeholder="010-1234-5678"
                value={formData.phone || ''}
                onChange={(e) => handleInputChange('phone', e.target.value)}
                className={cn("mt-1.5", inputClass)}
              />
            </div>
            <div>
              <Label className="text-sm font-medium">메시지</Label>
              <Input
                placeholder="문자 내용"
                value={formData.message || ''}
                onChange={(e) => handleInputChange('message', e.target.value)}
                className={cn("mt-1.5", inputClass)}
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
              <Label className="text-sm font-medium">주소</Label>
              <Input
                placeholder="서울시 강남구..."
                value={formData.address || ''}
                onChange={(e) => handleInputChange('address', e.target.value)}
                className={cn("mt-1.5", inputClass)}
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label className="text-sm font-medium">위도</Label>
                <Input
                  placeholder="37.5665"
                  value={formData.latitude || ''}
                  onChange={(e) => handleInputChange('latitude', e.target.value)}
                  className={cn("mt-1.5", inputClass)}
                />
              </div>
              <div>
                <Label className="text-sm font-medium">경도</Label>
                <Input
                  placeholder="126.9780"
                  value={formData.longitude || ''}
                  onChange={(e) => handleInputChange('longitude', e.target.value)}
                  className={cn("mt-1.5", inputClass)}
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
              <Label className="text-sm font-medium">일정 제목</Label>
              <Input
                placeholder="회의"
                value={formData.title || ''}
                onChange={(e) => handleInputChange('title', e.target.value)}
                className={cn("mt-1.5", inputClass)}
              />
            </div>
            <div>
              <Label className="text-sm font-medium">설명</Label>
              <Input
                placeholder="일정 설명"
                value={formData.description || ''}
                onChange={(e) => handleInputChange('description', e.target.value)}
                className={cn("mt-1.5", inputClass)}
              />
            </div>
            <div>
              <Label className="text-sm font-medium">장소</Label>
              <Input
                placeholder="회의실"
                value={formData.location || ''}
                onChange={(e) => handleInputChange('location', e.target.value)}
                className={cn("mt-1.5", inputClass)}
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label className="text-sm font-medium">시작 시간</Label>
                <Input
                  type="datetime-local"
                  value={formData.startDate || ''}
                  onChange={(e) => handleInputChange('startDate', e.target.value)}
                  className={cn("mt-1.5", inputClass)}
                />
              </div>
              <div>
                <Label className="text-sm font-medium">종료 시간</Label>
                <Input
                  type="datetime-local"
                  value={formData.endDate || ''}
                  onChange={(e) => handleInputChange('endDate', e.target.value)}
                  className={cn("mt-1.5", inputClass)}
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
    <div className="min-h-screen bg-gradient-to-b from-cyan-50 via-blue-50 to-indigo-50 dark:from-gray-900 dark:via-cyan-950/20 dark:to-gray-900">
      <div className="container mx-auto px-4 py-8 max-w-6xl">
        {/* Premium Hero Section */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-10 relative overflow-hidden rounded-3xl"
        >
          <div className="absolute inset-0 bg-gradient-to-br from-cyan-500 via-blue-600 to-indigo-700" />
          <div className="absolute inset-0 bg-[url('/grid.svg')] opacity-10" />
          <div className="absolute top-0 right-0 w-96 h-96 bg-white/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2" />
          <div className="absolute bottom-0 left-0 w-64 h-64 bg-cyan-300/20 rounded-full blur-3xl translate-y-1/2 -translate-x-1/2" />

          <div className="relative z-10 flex flex-col md:flex-row items-center gap-8 p-8 md:p-12">
            {/* Text Content */}
            <div className="flex-1 text-center md:text-left text-white">
              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.1 }}
                className="inline-flex items-center gap-2 px-4 py-2 bg-white/20 backdrop-blur-sm rounded-full text-white/90 text-sm mb-4"
              >
                <Sparkles className="h-4 w-4" />
                PLANX-QR Pro
              </motion.div>
              <motion.h1
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
                className="text-3xl md:text-4xl lg:text-5xl font-bold mb-4"
              >
                프리미엄 QR코드
                <br />
                <span className="text-cyan-200">생성기</span>
              </motion.h1>
              <motion.p
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
                className="text-white/80 text-lg max-w-lg"
              >
                URL, 명함, WiFi, 이메일 등 8가지 유형의 QR코드를
                <br className="hidden md:block" />
                브랜드 색상으로 커스터마이징하세요
              </motion.p>

              {/* Stats */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4 }}
                className="flex flex-wrap justify-center md:justify-start gap-6 mt-6"
              >
                {[
                  { icon: QrCode, label: '8가지 유형' },
                  { icon: Palette, label: '무제한 색상' },
                  { icon: Download, label: '고화질 다운로드' },
                ].map((item, i) => (
                  <div key={i} className="flex items-center gap-2 text-white/80">
                    <item.icon className="h-4 w-4" />
                    <span className="text-sm">{item.label}</span>
                  </div>
                ))}
              </motion.div>
            </div>

            {/* Hero Image */}
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.3 }}
              className="w-full md:w-80 lg:w-96 aspect-square rounded-2xl overflow-hidden bg-white/10 backdrop-blur-sm flex items-center justify-center relative shadow-2xl"
            >
              {heroImageUrl ? (
                <>
                  {!heroImageLoaded && (
                    <div className="absolute inset-0 flex items-center justify-center animate-pulse">
                      <QrCode className="h-20 w-20 text-white/30" />
                    </div>
                  )}
                  <Image
                    src={heroImageUrl}
                    alt="QR Code Generator"
                    fill
                    className={`object-cover transition-opacity duration-300 ${
                      heroImageLoaded ? 'opacity-100' : 'opacity-0'
                    }`}
                    onLoad={() => setHeroImageLoaded(true)}
                    sizes="(max-width: 768px) 100vw, 384px"
                    priority
                  />
                </>
              ) : (
                <div className="flex flex-col items-center justify-center text-white/50">
                  <div className="w-32 h-32 rounded-2xl bg-white/20 backdrop-blur flex items-center justify-center mb-4">
                    <QrCode className="h-16 w-16 text-white" />
                  </div>
                  <span className="text-sm">스캔하세요</span>
                </div>
              )}
            </motion.div>
          </div>
        </motion.div>

        {/* QR Type Selection - Premium Cards */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="mb-8"
        >
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-bold">QR코드 유형 선택</h2>
            <Badge variant="outline" className="text-cyan-600 border-cyan-200">
              {qrTypes.length}개 유형 지원
            </Badge>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            {qrTypes.map((type, index) => {
              const Icon = type.icon;
              return (
                <motion.button
                  key={type.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.05 * index }}
                  onClick={() => {
                    setSelectedType(type.id);
                    setFormData({});
                    setGeneratedQR(null);
                  }}
                  className={cn(
                    'relative p-4 rounded-2xl border-2 text-left transition-all duration-300 group',
                    selectedType === type.id
                      ? 'border-cyan-500 bg-gradient-to-br from-cyan-50 to-blue-50 dark:from-cyan-950/30 dark:to-blue-950/30 shadow-lg shadow-cyan-500/20'
                      : 'border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 hover:border-cyan-300 hover:shadow-md'
                  )}
                >
                  {type.popular && (
                    <Badge className="absolute -top-2 -right-2 bg-gradient-to-r from-amber-500 to-orange-500 text-white text-[10px] px-2">
                      인기
                    </Badge>
                  )}
                  <div className={cn(
                    'w-10 h-10 rounded-xl bg-gradient-to-br flex items-center justify-center mb-3 shadow-lg transition-transform group-hover:scale-110',
                    type.gradient
                  )}>
                    <Icon className="h-5 w-5 text-white" />
                  </div>
                  <div className="font-semibold text-sm mb-0.5">{type.name}</div>
                  <div className="text-xs text-muted-foreground">{type.description}</div>
                  {selectedType === type.id && (
                    <motion.div
                      layoutId="selected-indicator"
                      className="absolute top-3 right-3"
                    >
                      <div className="w-5 h-5 rounded-full bg-cyan-500 flex items-center justify-center">
                        <Check className="h-3 w-3 text-white" />
                      </div>
                    </motion.div>
                  )}
                </motion.button>
              );
            })}
          </div>
        </motion.div>

        {/* Main Content */}
        <div className="grid lg:grid-cols-5 gap-6">
          {/* Form Section */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.5 }}
            className="lg:col-span-3"
          >
            <Card className="border-0 shadow-xl bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm">
              <CardHeader className="pb-2">
                <div className="flex items-center gap-3">
                  {selectedTypeInfo && (
                    <div className={cn(
                      'w-12 h-12 rounded-xl bg-gradient-to-br flex items-center justify-center shadow-lg',
                      selectedTypeInfo.gradient
                    )}>
                      <selectedTypeInfo.icon className="h-6 w-6 text-white" />
                    </div>
                  )}
                  <div>
                    <CardTitle>{selectedTypeInfo?.name} QR코드</CardTitle>
                    <CardDescription>{selectedTypeInfo?.description}</CardDescription>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="pt-4">
                <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
                  <TabsList className="grid w-full grid-cols-2 mb-6 bg-gray-100 dark:bg-gray-700 p-1 rounded-xl">
                    <TabsTrigger value="content" className="rounded-lg data-[state=active]:bg-white dark:data-[state=active]:bg-gray-600">
                      <Settings className="h-4 w-4 mr-2" />
                      내용 입력
                    </TabsTrigger>
                    <TabsTrigger value="design" className="rounded-lg data-[state=active]:bg-white dark:data-[state=active]:bg-gray-600">
                      <Palette className="h-4 w-4 mr-2" />
                      디자인
                    </TabsTrigger>
                  </TabsList>

                  <TabsContent value="content" className="mt-0">
                    <AnimatePresence mode="wait">
                      {renderForm()}
                    </AnimatePresence>
                  </TabsContent>

                  <TabsContent value="design" className="mt-0 space-y-6">
                    {/* Color Presets */}
                    <div>
                      <Label className="text-sm font-medium mb-3 block">프리셋 색상</Label>
                      <div className="grid grid-cols-3 sm:grid-cols-6 gap-2">
                        {presetColors.map((preset) => (
                          <button
                            key={preset.name}
                            onClick={() => applyPreset(preset)}
                            className={cn(
                              'p-3 rounded-xl border-2 transition-all hover:scale-105',
                              options.color === preset.color && options.backgroundColor === preset.bg
                                ? 'border-cyan-500 ring-2 ring-cyan-500/20'
                                : 'border-gray-200 dark:border-gray-700'
                            )}
                          >
                            <div
                              className="w-8 h-8 rounded-lg mx-auto mb-1"
                              style={{ backgroundColor: preset.bg, border: `3px solid ${preset.color}` }}
                            />
                            <span className="text-xs">{preset.name}</span>
                          </button>
                        ))}
                      </div>
                    </div>

                    {/* Custom Colors */}
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <Label className="text-sm font-medium">QR 색상</Label>
                        <div className="flex items-center gap-2 mt-2">
                          <input
                            type="color"
                            value={options.color}
                            onChange={(e) => setOptions(prev => ({ ...prev, color: e.target.value }))}
                            className="w-12 h-12 rounded-xl cursor-pointer border-2 border-gray-200"
                          />
                          <Input
                            value={options.color}
                            onChange={(e) => setOptions(prev => ({ ...prev, color: e.target.value }))}
                            className="flex-1 font-mono"
                          />
                        </div>
                      </div>
                      <div>
                        <Label className="text-sm font-medium">배경 색상</Label>
                        <div className="flex items-center gap-2 mt-2">
                          <input
                            type="color"
                            value={options.backgroundColor}
                            onChange={(e) => setOptions(prev => ({ ...prev, backgroundColor: e.target.value }))}
                            className="w-12 h-12 rounded-xl cursor-pointer border-2 border-gray-200"
                          />
                          <Input
                            value={options.backgroundColor}
                            onChange={(e) => setOptions(prev => ({ ...prev, backgroundColor: e.target.value }))}
                            className="flex-1 font-mono"
                          />
                        </div>
                      </div>
                    </div>

                    {/* Size */}
                    <div>
                      <div className="flex items-center justify-between mb-2">
                        <Label className="text-sm font-medium">QR코드 크기</Label>
                        <span className="text-sm font-mono text-muted-foreground">{options.size}px</span>
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
                      <Label className="text-sm font-medium">오류 정정 수준</Label>
                      <Select
                        value={options.errorCorrectionLevel}
                        onValueChange={(value) => setOptions(prev => ({
                          ...prev,
                          errorCorrectionLevel: value as 'L' | 'M' | 'Q' | 'H'
                        }))}
                      >
                        <SelectTrigger className="mt-2">
                          <SelectValue placeholder="오류 정정 수준 선택" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="L">낮음 (L) - 7% 복구</SelectItem>
                          <SelectItem value="M">중간 (M) - 15% 복구 ✓ 권장</SelectItem>
                          <SelectItem value="Q">높음 (Q) - 25% 복구</SelectItem>
                          <SelectItem value="H">최고 (H) - 30% 복구</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </TabsContent>
                </Tabs>

                {error && (
                  <motion.div
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="mt-4 p-4 bg-red-50 dark:bg-red-950/30 text-red-600 dark:text-red-400 rounded-xl text-sm"
                  >
                    {error}
                  </motion.div>
                )}

                <Button
                  onClick={handleGenerate}
                  disabled={isGenerating}
                  className="w-full mt-6 h-14 text-lg gap-2 bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-600 hover:to-blue-700 shadow-lg shadow-cyan-500/25"
                >
                  {isGenerating ? (
                    <>
                      <Loader2 className="h-5 w-5 animate-spin" />
                      생성 중...
                    </>
                  ) : (
                    <>
                      <Zap className="h-5 w-5" />
                      QR코드 생성하기
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
            transition={{ delay: 0.6 }}
            className="lg:col-span-2"
          >
            <Card className="border-0 shadow-xl bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm sticky top-24">
              <CardHeader>
                <CardTitle className="text-lg">미리보기</CardTitle>
                <CardDescription>생성된 QR코드</CardDescription>
              </CardHeader>
              <CardContent className="flex flex-col items-center">
                <AnimatePresence mode="wait">
                  {generatedQR ? (
                    <motion.div
                      key="qr"
                      initial={{ opacity: 0, scale: 0.8 }}
                      animate={{ opacity: 1, scale: 1 }}
                      exit={{ opacity: 0, scale: 0.8 }}
                      className="w-full"
                    >
                      <div
                        className="p-6 rounded-2xl shadow-inner mx-auto w-fit"
                        style={{ backgroundColor: options.backgroundColor }}
                      >
                        <img
                          src={generatedQR}
                          alt="Generated QR Code"
                          style={{
                            width: Math.min(options.size, 220),
                            height: Math.min(options.size, 220)
                          }}
                        />
                      </div>

                      <div className="mt-6 space-y-3">
                        <Button
                          onClick={handleDownload}
                          className="w-full gap-2 bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700"
                        >
                          <Download className="h-4 w-4" />
                          PNG 다운로드
                        </Button>

                        {!user && (
                          <p className="text-xs text-muted-foreground text-center">
                            로그인하면 생성 기록을 저장할 수 있습니다
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
                      className="w-48 h-48 bg-gradient-to-br from-gray-100 to-gray-50 dark:from-gray-700 dark:to-gray-800 rounded-2xl flex items-center justify-center"
                    >
                      <div className="text-center text-muted-foreground">
                        <QrCode className="h-16 w-16 mx-auto mb-3 opacity-30" />
                        <p className="text-sm">QR코드가 여기에</p>
                        <p className="text-sm">표시됩니다</p>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </CardContent>
            </Card>
          </motion.div>
        </div>

        {/* Features Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.7 }}
          className="mt-12"
        >
          <h2 className="text-2xl font-bold text-center mb-8">PLANX-QR 특징</h2>
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {[
              { icon: Zap, title: '즉시 생성', desc: '클릭 한 번으로 바로 QR코드 생성', color: 'text-yellow-500', bg: 'bg-yellow-100 dark:bg-yellow-900/30' },
              { icon: Palette, title: '무제한 커스텀', desc: '브랜드 색상으로 자유롭게 디자인', color: 'text-purple-500', bg: 'bg-purple-100 dark:bg-purple-900/30' },
              { icon: Shield, title: '오류 복구', desc: '최대 30%까지 오류 복구 지원', color: 'text-green-500', bg: 'bg-green-100 dark:bg-green-900/30' },
              { icon: Share2, title: '다양한 유형', desc: '8가지 유형 QR코드 지원', color: 'text-blue-500', bg: 'bg-blue-100 dark:bg-blue-900/30' },
            ].map((item, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.8 + i * 0.1 }}
              >
                <Card className="border-0 shadow-lg hover:shadow-xl transition-shadow bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm">
                  <CardContent className="p-6 text-center">
                    <div className={cn('w-14 h-14 rounded-2xl flex items-center justify-center mx-auto mb-4', item.bg)}>
                      <item.icon className={cn('h-7 w-7', item.color)} />
                    </div>
                    <h3 className="font-semibold mb-2">{item.title}</h3>
                    <p className="text-sm text-muted-foreground">{item.desc}</p>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </div>
    </div>
  );
}
