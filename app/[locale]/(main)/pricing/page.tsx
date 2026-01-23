'use client';

import { useState } from 'react';
import { Link } from '@/i18n/routing';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import {
  Check,
  Sparkles,
  QrCode,
  Dices,
  Gift,
  Building2,
  ArrowRight,
  HelpCircle,
  Clock,
  FileText,
  Volume2,
} from 'lucide-react';

// 사주분석 패키지
const sajuPackages = [
  {
    name: '1회권',
    quantity: 1,
    regularPrice: 29900,
    salePrice: 14900,
    discount: '50%',
    label: '런칭특가',
    popular: false,
    limitedOffer: true,
  },
  {
    name: '3회권',
    quantity: 3,
    regularPrice: 79900,
    salePrice: 38900,
    discount: '51%',
    label: '런칭특가',
    popular: false,
  },
  {
    name: '5회권',
    quantity: 5,
    regularPrice: 119900,
    salePrice: 59900,
    discount: '50%',
    label: '런칭특가',
    popular: false,
  },
  {
    name: '10회권',
    quantity: 10,
    regularPrice: 199900,
    salePrice: 97000,
    discount: '51%',
    label: '추천',
    popular: true,
  },
  {
    name: '30회권',
    quantity: 30,
    regularPrice: 449000,
    salePrice: 299000,
    discount: '33%',
    label: null,
    popular: false,
  },
  {
    name: '50회권',
    quantity: 50,
    regularPrice: 749000,
    salePrice: 399000,
    discount: '47%',
    label: '최대할인',
    popular: false,
  },
];

// QR코드/로또 패키지
const utilityPackages = [
  {
    type: 'qrcode',
    name: 'QR코드 생성',
    icon: QrCode,
    color: 'text-blue-500',
    bgColor: 'bg-blue-100 dark:bg-blue-900/30',
    packages: [
      { quantity: 30, price: 4900 },
      { quantity: 100, price: 9900 },
    ],
  },
  {
    type: 'lotto',
    name: '로또번호 AI추천',
    icon: Dices,
    color: 'text-green-500',
    bgColor: 'bg-green-100 dark:bg-green-900/30',
    packages: [
      { quantity: 30, price: 4900 },
      { quantity: 100, price: 9900 },
    ],
  },
];

// B2B 패키지
const b2bPackages = [
  {
    name: '라이트',
    quantity: 30,
    price: 99000,
    features: ['월 30회 분석', 'PDF 리포트', '이메일 지원'],
    pdfOnly: true,
  },
  {
    name: '스탠다드',
    quantity: 30,
    price: 149000,
    features: ['월 30회 분석', 'PDF + 음성 리포트', '우선 지원'],
    popular: true,
  },
  {
    name: '프리미엄',
    quantity: 50,
    price: 249000,
    features: ['월 50회 분석', 'PDF + 음성 리포트', '상호 삽입 기능', '전담 매니저'],
  },
];

export default function PricingPage() {
  const [activeTab, setActiveTab] = useState('personal');

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('ko-KR').format(price);
  };

  return (
    <div className="container mx-auto px-4 py-8 md:py-16">
      {/* Header */}
      <div className="text-center mb-12">
        <Badge className="mb-4 bg-primary/10 text-primary">
          <Sparkles className="mr-1 h-3 w-3" />
          이용권 요금제
        </Badge>
        <h1 className="text-3xl md:text-5xl font-bold mb-4">
          합리적인 가격으로 시작하세요
        </h1>
        <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
          필요한 만큼만 구매하고, 1년간 자유롭게 사용하세요
        </p>
      </div>

      {/* Tabs */}
      <Tabs value={activeTab} onValueChange={setActiveTab} className="mb-12">
        <TabsList className="grid grid-cols-2 w-64 mx-auto">
          <TabsTrigger value="personal">개인</TabsTrigger>
          <TabsTrigger value="business">
            <Building2 className="mr-1 h-4 w-4" />
            비즈니스
          </TabsTrigger>
        </TabsList>

        {/* 개인 요금제 */}
        <TabsContent value="personal" className="mt-8">
          {/* 사주분석 */}
          <div className="mb-16">
            <div className="flex items-center justify-center gap-3 mb-8">
              <div className="p-3 rounded-xl bg-purple-100 dark:bg-purple-900/30">
                <Sparkles className="h-6 w-6 text-purple-500" />
              </div>
              <div>
                <h2 className="text-2xl font-bold">사주 완전분석</h2>
                <p className="text-muted-foreground">PDF 리포트 + 음성 해설 제공</p>
              </div>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4 max-w-6xl mx-auto">
              {sajuPackages.map((pkg) => (
                <Card
                  key={pkg.quantity}
                  className={`relative ${pkg.popular ? 'border-primary shadow-lg ring-2 ring-primary' : ''}`}
                >
                  {pkg.label && (
                    <div className="absolute -top-3 left-1/2 -translate-x-1/2">
                      <Badge className={pkg.popular ? 'bg-primary' : 'bg-red-500'}>
                        {pkg.label}
                      </Badge>
                    </div>
                  )}
                  <CardContent className="p-4 pt-6 text-center">
                    <h3 className="font-bold text-lg mb-2">{pkg.name}</h3>
                    <p className="text-sm text-muted-foreground line-through">
                      {formatPrice(pkg.regularPrice)}원
                    </p>
                    <p className="text-2xl font-bold text-primary">
                      {formatPrice(pkg.salePrice)}원
                    </p>
                    <p className="text-xs text-muted-foreground mt-1">
                      1회당 {formatPrice(Math.round(pkg.salePrice / pkg.quantity))}원
                    </p>
                    <Badge variant="outline" className="mt-2 text-red-500 border-red-500">
                      {pkg.discount} 할인
                    </Badge>
                  </CardContent>
                </Card>
              ))}
            </div>

            {/* 사주분석 포함 내용 */}
            <div className="mt-8 max-w-2xl mx-auto">
              <Card className="bg-muted/50">
                <CardContent className="p-6">
                  <h4 className="font-semibold mb-4 text-center">사주 완전분석 포함 내용</h4>
                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div className="flex items-center gap-2">
                      <FileText className="h-4 w-4 text-primary" />
                      <span>12페이지 PDF 리포트</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Volume2 className="h-4 w-4 text-primary" />
                      <span>8분 음성 해설</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Check className="h-4 w-4 text-green-500" />
                      <span>사주팔자 상세 분석</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Check className="h-4 w-4 text-green-500" />
                      <span>올해 운세 + 월별 운세</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Check className="h-4 w-4 text-green-500" />
                      <span>성격/적성/건강 분석</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Check className="h-4 w-4 text-green-500" />
                      <span>재물/직업/연애운 분석</span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>

          {/* QR코드 / 로또 */}
          <div className="mb-16">
            <h2 className="text-2xl font-bold text-center mb-8">추가 서비스</h2>
            <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
              {utilityPackages.map((service) => {
                const Icon = service.icon;
                return (
                  <Card key={service.type}>
                    <CardHeader>
                      <div className="flex items-center gap-3">
                        <div className={`p-2 rounded-lg ${service.bgColor}`}>
                          <Icon className={`h-5 w-5 ${service.color}`} />
                        </div>
                        <CardTitle>{service.name}</CardTitle>
                      </div>
                    </CardHeader>
                    <CardContent>
                      <div className="grid grid-cols-2 gap-4">
                        {service.packages.map((pkg) => (
                          <div
                            key={pkg.quantity}
                            className="text-center p-4 rounded-lg bg-muted/50"
                          >
                            <p className="font-bold text-lg">{pkg.quantity}회권</p>
                            <p className="text-2xl font-bold text-primary">
                              {formatPrice(pkg.price)}원
                            </p>
                            <p className="text-xs text-muted-foreground">
                              1회당 {formatPrice(Math.round(pkg.price / pkg.quantity))}원
                            </p>
                          </div>
                        ))}
                      </div>
                    </CardContent>
                  </Card>
                );
              })}
            </div>
          </div>

          {/* 선물하기 */}
          <div className="max-w-2xl mx-auto">
            <Card className="bg-gradient-to-r from-pink-50 to-purple-50 dark:from-pink-950/20 dark:to-purple-950/20 border-pink-200">
              <CardContent className="p-6">
                <div className="flex items-center gap-4">
                  <div className="p-3 rounded-xl bg-pink-100 dark:bg-pink-900/30">
                    <Gift className="h-6 w-6 text-pink-500" />
                  </div>
                  <div className="flex-1">
                    <h3 className="font-bold text-lg">선물하기</h3>
                    <p className="text-muted-foreground text-sm">
                      소중한 분께 사주분석을 선물하세요. 구매 후 링크로 간편하게 전달!
                    </p>
                  </div>
                  <Link href="/my/vouchers">
                    <Button variant="outline">
                      선물하기
                      <ArrowRight className="ml-2 h-4 w-4" />
                    </Button>
                  </Link>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        {/* 비즈니스 요금제 */}
        <TabsContent value="business" className="mt-8">
          <div className="text-center mb-8">
            <h2 className="text-2xl font-bold mb-2">철학관/점집 파트너 프로그램</h2>
            <p className="text-muted-foreground">
              고객에게 AI 사주분석 서비스를 제공하세요
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-6 max-w-5xl mx-auto">
            {b2bPackages.map((pkg) => (
              <Card
                key={pkg.name}
                className={`relative ${pkg.popular ? 'border-primary shadow-lg ring-2 ring-primary' : ''}`}
              >
                {pkg.popular && (
                  <div className="absolute -top-3 left-1/2 -translate-x-1/2">
                    <Badge className="bg-primary">추천</Badge>
                  </div>
                )}
                <CardHeader className="text-center">
                  <CardTitle>{pkg.name}</CardTitle>
                  <CardDescription>월 {pkg.quantity}회 분석</CardDescription>
                </CardHeader>
                <CardContent className="text-center">
                  <p className="text-3xl font-bold text-primary mb-2">
                    월 {formatPrice(pkg.price)}원
                  </p>
                  <p className="text-sm text-muted-foreground mb-4">
                    회당 {formatPrice(Math.round(pkg.price / pkg.quantity))}원
                  </p>
                  <ul className="space-y-2 text-left">
                    {pkg.features.map((feature, index) => (
                      <li key={index} className="flex items-center gap-2 text-sm">
                        <Check className="h-4 w-4 text-green-500" />
                        {feature}
                      </li>
                    ))}
                  </ul>
                </CardContent>
                <CardFooter>
                  <Button className="w-full" variant={pkg.popular ? 'default' : 'outline'}>
                    문의하기
                  </Button>
                </CardFooter>
              </Card>
            ))}
          </div>

          <div className="mt-8 text-center">
            <p className="text-muted-foreground">
              대량 구매 및 맞춤 상담: <a href="mailto:mymiryu@gmail.com" className="text-primary underline">mymiryu@gmail.com</a>
            </p>
          </div>
        </TabsContent>
      </Tabs>

      {/* 공통 안내 */}
      <div className="max-w-3xl mx-auto space-y-8">
        {/* 유효기간 안내 */}
        <Card className="bg-amber-50 dark:bg-amber-950/20 border-amber-200">
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <Clock className="h-5 w-5 text-amber-600" />
              <div>
                <h4 className="font-medium">이용권 유효기간 안내</h4>
                <p className="text-sm text-muted-foreground">
                  모든 이용권은 구매일로부터 1년간 유효합니다. 미사용분은 환불 가능합니다.
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* FAQ */}
        <div>
          <h2 className="text-2xl font-bold text-center mb-8">자주 묻는 질문</h2>
          <div className="space-y-4">
            <Card>
              <CardContent className="p-6">
                <div className="flex items-start gap-4">
                  <HelpCircle className="h-5 w-5 text-primary shrink-0 mt-0.5" />
                  <div>
                    <h3 className="font-semibold mb-1">환불이 가능한가요?</h3>
                    <p className="text-muted-foreground">
                      네, 미사용 이용권은 환불 가능합니다. 사용한 횟수는 정가 기준으로 차감됩니다.
                      자세한 내용은 <Link href="/legal/refund" className="text-primary underline">환불 정책</Link>을 확인해주세요.
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-6">
                <div className="flex items-start gap-4">
                  <HelpCircle className="h-5 w-5 text-primary shrink-0 mt-0.5" />
                  <div>
                    <h3 className="font-semibold mb-1">결제 수단은 무엇이 있나요?</h3>
                    <p className="text-muted-foreground">
                      신용카드, 체크카드, 토스페이, 카카오페이 등 다양한 결제 수단을 지원합니다.
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-6">
                <div className="flex items-start gap-4">
                  <HelpCircle className="h-5 w-5 text-primary shrink-0 mt-0.5" />
                  <div>
                    <h3 className="font-semibold mb-1">선물은 어떻게 하나요?</h3>
                    <p className="text-muted-foreground">
                      이용권 구매 후 &apos;선물하기&apos; 기능으로 링크를 생성하여 전달하시면 됩니다.
                      받는 분이 링크를 통해 바로 사용할 수 있습니다.
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* CTA */}
        <div className="text-center pt-8">
          <Link href="/my/vouchers">
            <Button size="lg" className="px-8">
              이용권 구매하기
              <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
}
