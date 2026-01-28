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
} from 'lucide-react';

type QRType = 'url' | 'vcard' | 'wifi' | 'email' | 'phone' | 'sms' | 'location' | 'event';

const qrTypes = [
  { id: 'url' as QRType, name: 'URL 링크', icon: Link2, description: '웹사이트 주소' },
  { id: 'vcard' as QRType, name: '연락처', icon: User, description: '명함 QR코드' },
  { id: 'wifi' as QRType, name: 'WiFi', icon: Wifi, description: '비밀번호 없이 연결' },
  { id: 'email' as QRType, name: '이메일', icon: Mail, description: '이메일 작성' },
  { id: 'phone' as QRType, name: '전화', icon: Phone, description: '바로 전화 연결' },
  { id: 'sms' as QRType, name: 'SMS', icon: MessageSquare, description: '문자 메시지' },
  { id: 'location' as QRType, name: '위치', icon: MapPin, description: '지도 위치' },
  { id: 'event' as QRType, name: '일정', icon: Calendar, description: '캘린더 추가' },
];

export default function QRCodeGeneratorPage() {
  const { user, isAdmin } = useAuth();
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

  const renderForm = () => {
    switch (selectedType) {
      case 'url':
        return (
          <div className="space-y-4">
            <div>
              <Label>URL</Label>
              <Input
                placeholder="https://example.com"
                value={formData.url || ''}
                onChange={(e) => handleInputChange('url', e.target.value)}
              />
            </div>
          </div>
        );

      case 'vcard':
        return (
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label>이름</Label>
                <Input
                  placeholder="홍"
                  value={formData.firstName || ''}
                  onChange={(e) => handleInputChange('firstName', e.target.value)}
                />
              </div>
              <div>
                <Label>성</Label>
                <Input
                  placeholder="길동"
                  value={formData.lastName || ''}
                  onChange={(e) => handleInputChange('lastName', e.target.value)}
                />
              </div>
            </div>
            <div>
              <Label>회사</Label>
              <Input
                placeholder="회사명"
                value={formData.organization || ''}
                onChange={(e) => handleInputChange('organization', e.target.value)}
              />
            </div>
            <div>
              <Label>직함</Label>
              <Input
                placeholder="대표이사"
                value={formData.title || ''}
                onChange={(e) => handleInputChange('title', e.target.value)}
              />
            </div>
            <div>
              <Label>전화번호</Label>
              <Input
                placeholder="010-1234-5678"
                value={formData.phone || ''}
                onChange={(e) => handleInputChange('phone', e.target.value)}
              />
            </div>
            <div>
              <Label>이메일</Label>
              <Input
                placeholder="email@example.com"
                value={formData.email || ''}
                onChange={(e) => handleInputChange('email', e.target.value)}
              />
            </div>
            <div>
              <Label>웹사이트</Label>
              <Input
                placeholder="https://example.com"
                value={formData.website || ''}
                onChange={(e) => handleInputChange('website', e.target.value)}
              />
            </div>
          </div>
        );

      case 'wifi':
        return (
          <div className="space-y-4">
            <div>
              <Label>네트워크 이름 (SSID)</Label>
              <Input
                placeholder="MyWiFi"
                value={formData.ssid || ''}
                onChange={(e) => handleInputChange('ssid', e.target.value)}
              />
            </div>
            <div>
              <Label>비밀번호</Label>
              <Input
                type="password"
                placeholder="WiFi 비밀번호"
                value={formData.password || ''}
                onChange={(e) => handleInputChange('password', e.target.value)}
              />
            </div>
            <div>
              <Label>암호화 방식</Label>
              <Select
                value={formData.encryption || 'WPA'}
                onValueChange={(value) => handleInputChange('encryption', value)}
              >
                <SelectTrigger>
                  <SelectValue placeholder="암호화 방식 선택" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="WPA">WPA/WPA2</SelectItem>
                  <SelectItem value="WEP">WEP</SelectItem>
                  <SelectItem value="nopass">암호 없음</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        );

      case 'email':
        return (
          <div className="space-y-4">
            <div>
              <Label>이메일 주소</Label>
              <Input
                placeholder="email@example.com"
                value={formData.email || ''}
                onChange={(e) => handleInputChange('email', e.target.value)}
              />
            </div>
            <div>
              <Label>제목</Label>
              <Input
                placeholder="이메일 제목"
                value={formData.subject || ''}
                onChange={(e) => handleInputChange('subject', e.target.value)}
              />
            </div>
            <div>
              <Label>내용</Label>
              <Input
                placeholder="이메일 내용"
                value={formData.body || ''}
                onChange={(e) => handleInputChange('body', e.target.value)}
              />
            </div>
          </div>
        );

      case 'phone':
        return (
          <div className="space-y-4">
            <div>
              <Label>전화번호</Label>
              <Input
                placeholder="010-1234-5678"
                value={formData.phone || ''}
                onChange={(e) => handleInputChange('phone', e.target.value)}
              />
            </div>
          </div>
        );

      case 'sms':
        return (
          <div className="space-y-4">
            <div>
              <Label>전화번호</Label>
              <Input
                placeholder="010-1234-5678"
                value={formData.phone || ''}
                onChange={(e) => handleInputChange('phone', e.target.value)}
              />
            </div>
            <div>
              <Label>메시지</Label>
              <Input
                placeholder="문자 내용"
                value={formData.message || ''}
                onChange={(e) => handleInputChange('message', e.target.value)}
              />
            </div>
          </div>
        );

      case 'location':
        return (
          <div className="space-y-4">
            <div>
              <Label>주소</Label>
              <Input
                placeholder="서울시 강남구..."
                value={formData.address || ''}
                onChange={(e) => handleInputChange('address', e.target.value)}
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label>위도</Label>
                <Input
                  placeholder="37.5665"
                  value={formData.latitude || ''}
                  onChange={(e) => handleInputChange('latitude', e.target.value)}
                />
              </div>
              <div>
                <Label>경도</Label>
                <Input
                  placeholder="126.9780"
                  value={formData.longitude || ''}
                  onChange={(e) => handleInputChange('longitude', e.target.value)}
                />
              </div>
            </div>
          </div>
        );

      case 'event':
        return (
          <div className="space-y-4">
            <div>
              <Label>일정 제목</Label>
              <Input
                placeholder="회의"
                value={formData.title || ''}
                onChange={(e) => handleInputChange('title', e.target.value)}
              />
            </div>
            <div>
              <Label>설명</Label>
              <Input
                placeholder="일정 설명"
                value={formData.description || ''}
                onChange={(e) => handleInputChange('description', e.target.value)}
              />
            </div>
            <div>
              <Label>장소</Label>
              <Input
                placeholder="회의실"
                value={formData.location || ''}
                onChange={(e) => handleInputChange('location', e.target.value)}
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label>시작 시간</Label>
                <Input
                  type="datetime-local"
                  value={formData.startDate || ''}
                  onChange={(e) => handleInputChange('startDate', e.target.value)}
                />
              </div>
              <div>
                <Label>종료 시간</Label>
                <Input
                  type="datetime-local"
                  value={formData.endDate || ''}
                  onChange={(e) => handleInputChange('endDate', e.target.value)}
                />
              </div>
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <div className="container mx-auto px-4 py-8 max-w-6xl">
      {/* Hero Section */}
      <div className="mb-10 bg-gradient-to-br from-violet-50 via-purple-50 to-fuchsia-50 dark:from-violet-950/40 dark:via-purple-950/30 dark:to-fuchsia-950/20 border border-violet-200/50 dark:border-violet-800/30 rounded-3xl overflow-hidden relative">
        {/* Background decoration */}
        <div className="absolute top-0 right-0 w-64 h-64 bg-gradient-to-br from-violet-200/40 to-purple-200/30 dark:from-violet-600/10 dark:to-purple-600/10 rounded-full blur-[60px]" />
        <div className="absolute bottom-0 left-0 w-48 h-48 bg-gradient-to-br from-fuchsia-200/40 to-pink-200/30 dark:from-fuchsia-600/10 dark:to-pink-600/10 rounded-full blur-[60px]" />

        <div className="relative z-10 flex flex-col md:flex-row items-center gap-6 p-8 md:p-10">
          {/* Text Content */}
          <div className="flex-1 text-center md:text-left">
            <div className="inline-flex items-center gap-2 px-3 py-1 bg-violet-100 dark:bg-violet-900/50 rounded-full text-violet-600 dark:text-violet-300 text-sm mb-4">
              <Sparkles className="h-3.5 w-3.5" />
              PLANX-QR
            </div>
            <h1 className="text-2xl md:text-3xl lg:text-4xl font-bold text-foreground mb-3">
              다기능 QR코드 생성기
            </h1>
            <p className="text-muted-foreground text-base md:text-lg max-w-lg">
              URL, 명함, WiFi, 이메일 등 다양한 QR코드를 쉽고 빠르게 생성하세요
            </p>
          </div>

          {/* Image Area - Configurable from admin settings */}
          <div className="w-full md:w-80 lg:w-96 aspect-[4/3] rounded-2xl overflow-hidden bg-gradient-to-br from-violet-100 to-purple-100 dark:from-violet-900/30 dark:to-purple-900/30 flex items-center justify-center relative shadow-xl shadow-violet-500/10">
            {heroImageUrl ? (
              <>
                {!heroImageLoaded && (
                  <div className="absolute inset-0 flex items-center justify-center animate-pulse">
                    <QrCode className="h-16 w-16 text-violet-300 dark:text-violet-600" />
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
              <div className="flex flex-col items-center justify-center text-violet-400 dark:text-violet-500">
                <ImageIcon className="h-16 w-16 mb-2 opacity-50" />
                <span className="text-sm opacity-70">히어로 이미지</span>
                <span className="text-xs opacity-50">관리자 설정에서 추가</span>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Sub Header */}
      <div className="text-center mb-8">
        <Badge className="mb-4 bg-primary/10 text-primary">
          <QrCode className="mr-1 h-3 w-3" />
          QR Code Generator
        </Badge>
        <h2 className="text-2xl md:text-3xl font-bold mb-4">QR코드 유형 선택</h2>
        <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
          생성하고 싶은 QR코드 유형을 선택하세요
        </p>
      </div>

      <div className="grid lg:grid-cols-3 gap-6">
        {/* Type Selection */}
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle>QR코드 유형 선택</CardTitle>
            <CardDescription>생성하고 싶은 QR코드 유형을 선택하세요</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-6">
              {qrTypes.map((type) => {
                const Icon = type.icon;
                return (
                  <button
                    key={type.id}
                    onClick={() => {
                      setSelectedType(type.id);
                      setFormData({});
                      setGeneratedQR(null);
                    }}
                    className={`p-4 rounded-lg border text-center transition-all ${
                      selectedType === type.id
                        ? 'border-primary bg-primary/5 ring-2 ring-primary'
                        : 'border-muted hover:border-primary/50'
                    }`}
                  >
                    <Icon className={`h-6 w-6 mx-auto mb-2 ${
                      selectedType === type.id ? 'text-primary' : 'text-muted-foreground'
                    }`} />
                    <div className="text-sm font-medium">{type.name}</div>
                    <div className="text-xs text-muted-foreground">{type.description}</div>
                  </button>
                );
              })}
            </div>

            <Tabs defaultValue="content" className="w-full">
              <TabsList className="grid w-full grid-cols-2">
                <TabsTrigger value="content">
                  <Settings className="h-4 w-4 mr-2" />
                  내용 입력
                </TabsTrigger>
                <TabsTrigger value="design">
                  <Palette className="h-4 w-4 mr-2" />
                  디자인 설정
                </TabsTrigger>
              </TabsList>

              <TabsContent value="content" className="mt-4">
                {renderForm()}
              </TabsContent>

              <TabsContent value="design" className="mt-4 space-y-6">
                <div>
                  <Label>QR코드 크기: {options.size}px</Label>
                  <Slider
                    value={[options.size]}
                    onValueChange={([value]) => setOptions(prev => ({ ...prev, size: value }))}
                    min={100}
                    max={1000}
                    step={50}
                    className="mt-2"
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label>QR 색상</Label>
                    <div className="flex items-center gap-2 mt-2">
                      <input
                        type="color"
                        value={options.color}
                        onChange={(e) => setOptions(prev => ({ ...prev, color: e.target.value }))}
                        className="w-10 h-10 rounded cursor-pointer"
                      />
                      <Input
                        value={options.color}
                        onChange={(e) => setOptions(prev => ({ ...prev, color: e.target.value }))}
                        className="flex-1"
                      />
                    </div>
                  </div>
                  <div>
                    <Label>배경 색상</Label>
                    <div className="flex items-center gap-2 mt-2">
                      <input
                        type="color"
                        value={options.backgroundColor}
                        onChange={(e) => setOptions(prev => ({ ...prev, backgroundColor: e.target.value }))}
                        className="w-10 h-10 rounded cursor-pointer"
                      />
                      <Input
                        value={options.backgroundColor}
                        onChange={(e) => setOptions(prev => ({ ...prev, backgroundColor: e.target.value }))}
                        className="flex-1"
                      />
                    </div>
                  </div>
                </div>

                <div>
                  <Label>오류 정정 수준</Label>
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
                      <SelectItem value="M">중간 (M) - 15% 복구</SelectItem>
                      <SelectItem value="Q">높음 (Q) - 25% 복구</SelectItem>
                      <SelectItem value="H">최고 (H) - 30% 복구</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <Label>여백: {options.margin}</Label>
                  <Slider
                    value={[options.margin]}
                    onValueChange={([value]) => setOptions(prev => ({ ...prev, margin: value }))}
                    min={0}
                    max={10}
                    step={1}
                    className="mt-2"
                  />
                </div>
              </TabsContent>
            </Tabs>

            {error && (
              <div className="mt-4 p-3 bg-destructive/10 text-destructive rounded-lg text-sm">
                {error}
              </div>
            )}

            <Button
              onClick={handleGenerate}
              disabled={isGenerating}
              className="w-full mt-6"
              size="lg"
            >
              {isGenerating ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  생성 중...
                </>
              ) : (
                <>
                  <QrCode className="mr-2 h-4 w-4" />
                  QR코드 생성
                </>
              )}
            </Button>
          </CardContent>
        </Card>

        {/* Preview */}
        <Card>
          <CardHeader>
            <CardTitle>미리보기</CardTitle>
            <CardDescription>생성된 QR코드를 확인하세요</CardDescription>
          </CardHeader>
          <CardContent className="flex flex-col items-center">
            {generatedQR ? (
              <>
                <div className="p-4 bg-white rounded-lg shadow-inner border">
                  <img
                    src={generatedQR}
                    alt="Generated QR Code"
                    className="max-w-full"
                    style={{ width: Math.min(options.size, 250), height: Math.min(options.size, 250) }}
                  />
                </div>
                <Button
                  onClick={handleDownload}
                  className="w-full mt-4"
                  variant="outline"
                >
                  <Download className="mr-2 h-4 w-4" />
                  다운로드
                </Button>
                {!user && (
                  <p className="text-xs text-muted-foreground mt-4 text-center">
                    로그인하면 생성한 QR코드를 저장하고 관리할 수 있습니다
                  </p>
                )}
              </>
            ) : (
              <div className="w-48 h-48 bg-muted rounded-lg flex items-center justify-center">
                <div className="text-center text-muted-foreground">
                  <QrCode className="h-12 w-12 mx-auto mb-2 opacity-50" />
                  <p className="text-sm">QR코드가 여기에 표시됩니다</p>
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Features Section */}
      <div className="mt-12">
        <h2 className="text-2xl font-bold text-center mb-8">지원 기능</h2>
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <Card>
            <CardContent className="p-6 text-center">
              <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <User className="h-6 w-6 text-blue-600" />
              </div>
              <h3 className="font-semibold mb-2">연락처 (vCard)</h3>
              <p className="text-sm text-muted-foreground">
                스캔하면 핸드폰에 연락처가 자동 저장됩니다
              </p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-6 text-center">
              <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Wifi className="h-6 w-6 text-green-600" />
              </div>
              <h3 className="font-semibold mb-2">WiFi 연결</h3>
              <p className="text-sm text-muted-foreground">
                비밀번호 입력 없이 WiFi에 바로 연결됩니다
              </p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-6 text-center">
              <div className="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Calendar className="h-6 w-6 text-purple-600" />
              </div>
              <h3 className="font-semibold mb-2">이벤트 일정</h3>
              <p className="text-sm text-muted-foreground">
                캘린더에 일정이 자동으로 추가됩니다
              </p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-6 text-center">
              <div className="w-12 h-12 bg-orange-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Palette className="h-6 w-6 text-orange-600" />
              </div>
              <h3 className="font-semibold mb-2">커스터마이징</h3>
              <p className="text-sm text-muted-foreground">
                색상, 크기, 오류 정정 수준을 자유롭게 설정
              </p>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
