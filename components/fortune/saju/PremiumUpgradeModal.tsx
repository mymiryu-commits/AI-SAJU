'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent } from '@/components/ui/card';
import {
  Check,
  Crown,
  Star,
  Sparkles,
  ArrowRight,
  Loader2,
  Zap,
  FileText,
  Volume2,
  Calendar,
  Heart,
  TrendingUp,
} from 'lucide-react';

interface Package {
  id: string;
  name: string;
  price: number;
  originalPrice: number;
  features: string[];
  highlight?: string;
  popular?: boolean;
  planType: string; // bundle plan type
}

// 패키지 정의 - DB의 bundle 패키지와 매핑
const packages: Package[] = [
  {
    id: 'basic',
    name: '베이직',
    price: 4900,
    originalPrice: 9800,
    planType: 'basic',
    features: [
      '사주팔자 완전 분석',
      '오행 분석',
      '2026년 총운',
      '성격 분석',
    ],
  },
  {
    id: 'standard',
    name: '스탠다드',
    price: 9800,
    originalPrice: 19600,
    planType: 'standard',
    features: [
      '베이직 모든 기능',
      '궁합 분석 1회',
      '월별 운세 12개월',
      'PDF 다운로드',
    ],
    highlight: '가장 인기',
    popular: true,
  },
  {
    id: 'premium',
    name: '프리미엄',
    price: 19600,
    originalPrice: 39200,
    planType: 'premium',
    features: [
      '스탠다드 모든 기능',
      '관상 분석 1회',
      '10년 대운 분석',
      'MBTI 통합 분석',
      '음성 리포트',
    ],
    highlight: 'BEST',
  },
];

interface Props {
  isOpen: boolean;
  onClose: () => void;
  onSelectPackage?: (packageId: string) => void;
  currentAnalysisId?: string;
}

export default function PremiumUpgradeModal({
  isOpen,
  onClose,
  onSelectPackage,
  currentAnalysisId,
}: Props) {
  const router = useRouter();
  const [selectedPackage, setSelectedPackage] = useState<string>('standard');
  const [isProcessing, setIsProcessing] = useState(false);
  const [dbPackages, setDbPackages] = useState<Record<string, string>>({});

  // DB에서 번들 패키지 ID 가져오기
  useEffect(() => {
    const fetchPackages = async () => {
      try {
        const response = await fetch('/api/voucher/packages?service_type=bundle');
        if (response.ok) {
          const data = await response.json();
          if (data.packages) {
            const pkgMap: Record<string, string> = {};
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            data.packages.forEach((pkg: any) => {
              if (pkg.plan_type) {
                pkgMap[pkg.plan_type] = pkg.id;
              }
            });
            setDbPackages(pkgMap);
          }
        }
      } catch (error) {
        console.error('Failed to fetch packages:', error);
      }
    };
    if (isOpen) {
      fetchPackages();
    }
  }, [isOpen]);

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('ko-KR').format(price);
  };

  const handlePurchase = async () => {
    if (onSelectPackage) {
      onSelectPackage(selectedPackage);
      return;
    }

    setIsProcessing(true);

    try {
      const pkg = packages.find(p => p.id === selectedPackage);
      const dbPackageId = dbPackages[pkg?.planType || ''];

      if (!dbPackageId) {
        alert('패키지 정보를 불러오는 중입니다. 잠시 후 다시 시도해주세요.');
        setIsProcessing(false);
        return;
      }

      // 결제권 구매 API 호출
      const response = await fetch('/api/voucher/purchase', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          package_id: dbPackageId,
          metadata: {
            analysisId: currentAnalysisId,
          },
        }),
      });

      const data = await response.json();

      if (data.success && data.toss) {
        // 토스페이먼츠 결제 페이지로 이동
        const tossClientKey = process.env.NEXT_PUBLIC_TOSS_PAYMENTS_CLIENT_KEY;
        if (tossClientKey && typeof window !== 'undefined') {
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          const tossPayments = (window as any).TossPayments?.(tossClientKey);
          if (tossPayments) {
            await tossPayments.requestPayment('카드', {
              amount: data.toss.amount,
              orderId: data.toss.orderId,
              orderName: data.toss.orderName,
              customerName: data.toss.customerName,
              successUrl: data.toss.successUrl,
              failUrl: data.toss.failUrl,
            });
          } else {
            // SDK 없으면 redirect 방식
            window.location.href = `/payment/checkout?orderId=${data.orderId}&amount=${data.toss.amount}&orderName=${encodeURIComponent(data.toss.orderName)}`;
          }
        }
      } else {
        alert(data.error || '결제 준비 중 오류가 발생했습니다.');
      }
    } catch (error) {
      console.error('Payment error:', error);
      alert('결제 처리 중 오류가 발생했습니다.');
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader className="text-center pb-4">
          <div className="flex justify-center mb-3">
            <div className="w-16 h-16 rounded-full bg-gradient-to-r from-purple-500 to-pink-500 flex items-center justify-center">
              <Crown className="h-8 w-8 text-white" />
            </div>
          </div>
          <DialogTitle className="text-2xl">프리미엄으로 업그레이드</DialogTitle>
          <DialogDescription className="text-base">
            전체 분석 결과와 프리미엄 기능을 해금하세요
          </DialogDescription>
        </DialogHeader>

        {/* 가치 강조 */}
        <div className="grid grid-cols-3 gap-3 mb-6">
          <div className="text-center p-3 rounded-lg bg-blue-50 dark:bg-blue-950/30">
            <FileText className="h-6 w-6 mx-auto mb-1 text-blue-500" />
            <p className="text-xs font-medium">PDF 리포트</p>
          </div>
          <div className="text-center p-3 rounded-lg bg-purple-50 dark:bg-purple-950/30">
            <Calendar className="h-6 w-6 mx-auto mb-1 text-purple-500" />
            <p className="text-xs font-medium">월별 운세</p>
          </div>
          <div className="text-center p-3 rounded-lg bg-pink-50 dark:bg-pink-950/30">
            <Volume2 className="h-6 w-6 mx-auto mb-1 text-pink-500" />
            <p className="text-xs font-medium">음성 리포트</p>
          </div>
        </div>

        {/* 패키지 선택 */}
        <div className="space-y-3 mb-6">
          {packages.map((pkg) => (
            <Card
              key={pkg.id}
              className={`cursor-pointer transition-all ${
                selectedPackage === pkg.id
                  ? 'border-2 border-purple-500 shadow-lg bg-purple-50/50 dark:bg-purple-950/20'
                  : 'border hover:border-purple-300'
              }`}
              onClick={() => setSelectedPackage(pkg.id)}
            >
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    {/* Radio */}
                    <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${
                      selectedPackage === pkg.id
                        ? 'border-purple-500 bg-purple-500'
                        : 'border-gray-300'
                    }`}>
                      {selectedPackage === pkg.id && (
                        <Check className="h-3 w-3 text-white" />
                      )}
                    </div>

                    {/* Info */}
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="font-semibold">{pkg.name}</span>
                        {pkg.highlight && (
                          <Badge
                            className={`text-xs ${
                              pkg.popular
                                ? 'bg-purple-500 text-white'
                                : 'bg-amber-500 text-white'
                            }`}
                          >
                            {pkg.highlight}
                          </Badge>
                        )}
                      </div>
                      <div className="text-xs text-muted-foreground mt-0.5">
                        {pkg.features.slice(0, 2).join(' · ')}
                      </div>
                    </div>
                  </div>

                  {/* Price */}
                  <div className="text-right">
                    <div className="font-bold text-lg">₩{formatPrice(pkg.price)}</div>
                    <div className="text-xs text-muted-foreground line-through">
                      ₩{formatPrice(pkg.originalPrice)}
                    </div>
                  </div>
                </div>

                {/* Expanded Features */}
                {selectedPackage === pkg.id && (
                  <div className="mt-3 pt-3 border-t">
                    <ul className="space-y-1">
                      {pkg.features.map((feature, idx) => (
                        <li key={idx} className="flex items-center gap-2 text-sm">
                          <Check className="h-4 w-4 text-green-500" />
                          <span>{feature}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
              </CardContent>
            </Card>
          ))}
        </div>

        {/* CTA */}
        <div className="space-y-3">
          <Button
            size="lg"
            className="w-full bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600"
            onClick={handlePurchase}
            disabled={isProcessing}
          >
            {isProcessing ? (
              <>
                <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                결제 준비 중...
              </>
            ) : (
              <>
                <Sparkles className="mr-2 h-5 w-5" />
                ₩{formatPrice(packages.find(p => p.id === selectedPackage)?.price || 0)} 결제하기
                <ArrowRight className="ml-2 h-5 w-5" />
              </>
            )}
          </Button>

          <p className="text-center text-xs text-muted-foreground">
            안전한 결제 · 7일 이내 환불 가능 · 1년 유효기간
          </p>
        </div>

        {/* 리뷰 미리보기 */}
        <div className="mt-4 p-4 rounded-lg bg-muted/50">
          <div className="flex items-center gap-2 mb-2">
            <div className="flex">
              {[1, 2, 3, 4, 5].map((i) => (
                <Star key={i} className="h-4 w-4 text-yellow-400 fill-yellow-400" />
              ))}
            </div>
            <span className="text-sm font-medium">4.9/5</span>
            <span className="text-xs text-muted-foreground">(2,847명 평가)</span>
          </div>
          <p className="text-sm text-muted-foreground italic">
            "PDF 리포트가 정말 상세해서 좋았어요. 월별 운세도 매달 참고하고 있습니다!"
          </p>
        </div>
      </DialogContent>
    </Dialog>
  );
}
