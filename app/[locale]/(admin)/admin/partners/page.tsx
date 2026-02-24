'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import {
  Building2,
  QrCode,
  TrendingUp,
  DollarSign,
  Users,
  Plus,
  Eye,
  Download,
  Copy,
  Check,
  Loader2,
  Search,
  RefreshCw,
  Store,
  Coffee,
  Wine,
  Hotel,
  MoreHorizontal,
} from 'lucide-react';

interface Partner {
  id: string;
  company_name: string;
  business_type: string;
  contact_name: string;
  contact_email: string;
  contact_phone: string;
  address?: string;
  tier: 'bronze' | 'silver' | 'gold' | 'platinum';
  commission_rate: number;
  is_active: boolean;
  total_revenue: number;
  total_commission: number;
  pending_commission: number;
  created_at: string;
  qr_codes?: {
    id: string;
    code: string;
    name: string;
    scan_count: number;
    conversion_count: number;
    total_revenue: number;
  }[];
}

const PARTNER_TIERS = {
  bronze: { name: '브론즈', color: 'bg-amber-100 text-amber-800', rate: 25 },
  silver: { name: '실버', color: 'bg-gray-100 text-gray-800', rate: 30 },
  gold: { name: '골드', color: 'bg-yellow-100 text-yellow-800', rate: 35 },
  platinum: { name: '플래티넘', color: 'bg-purple-100 text-purple-800', rate: 40 },
};

const BUSINESS_TYPES = {
  restaurant: { name: '식당', icon: Store },
  cafe: { name: '카페', icon: Coffee },
  bar: { name: '바/펍', icon: Wine },
  hotel: { name: '호텔', icon: Hotel },
  other: { name: '기타', icon: Building2 },
};

export default function AdminPartnersPage() {
  const [partners, setPartners] = useState<Partner[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedTier, setSelectedTier] = useState<string>('all');
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [selectedPartner, setSelectedPartner] = useState<Partner | null>(null);
  const [copied, setCopied] = useState<string | null>(null);

  // 새 파트너 폼 상태
  const [newPartner, setNewPartner] = useState({
    companyName: '',
    businessType: 'restaurant',
    contactName: '',
    contactEmail: '',
    contactPhone: '',
    address: '',
    tier: 'bronze',
  });

  // 통계
  const [stats, setStats] = useState({
    totalPartners: 0,
    activePartners: 0,
    totalRevenue: 0,
    totalCommission: 0,
    pendingCommission: 0,
  });

  useEffect(() => {
    fetchPartners();
  }, []);

  const fetchPartners = async () => {
    setLoading(true);
    try {
      // 실제로는 API 호출
      // const response = await fetch('/api/partner?admin=true');
      // const data = await response.json();

      // 목업 데이터
      const mockPartners: Partner[] = [
        {
          id: '1',
          company_name: '홍길동 식당',
          business_type: 'restaurant',
          contact_name: '홍길동',
          contact_email: 'hong@example.com',
          contact_phone: '010-1234-5678',
          address: '서울시 강남구 테헤란로 123',
          tier: 'silver',
          commission_rate: 30,
          is_active: true,
          total_revenue: 1250000,
          total_commission: 375000,
          pending_commission: 125000,
          created_at: '2025-12-01',
          qr_codes: [
            { id: 'qr1', code: 'PTN-ABC123', name: '메인 카운터', scan_count: 156, conversion_count: 23, total_revenue: 850000 },
            { id: 'qr2', code: 'PTN-DEF456', name: '테이블 QR', scan_count: 89, conversion_count: 12, total_revenue: 400000 },
          ],
        },
        {
          id: '2',
          company_name: '카페 모닝',
          business_type: 'cafe',
          contact_name: '김철수',
          contact_email: 'kim@example.com',
          contact_phone: '010-2345-6789',
          address: '서울시 서초구 서초대로 456',
          tier: 'bronze',
          commission_rate: 25,
          is_active: true,
          total_revenue: 450000,
          total_commission: 112500,
          pending_commission: 45000,
          created_at: '2026-01-15',
          qr_codes: [
            { id: 'qr3', code: 'PTN-GHI789', name: '메인 QR', scan_count: 78, conversion_count: 8, total_revenue: 450000 },
          ],
        },
        {
          id: '3',
          company_name: '바 루프탑',
          business_type: 'bar',
          contact_name: '이영희',
          contact_email: 'lee@example.com',
          contact_phone: '010-3456-7890',
          tier: 'gold',
          commission_rate: 35,
          is_active: true,
          total_revenue: 3200000,
          total_commission: 1120000,
          pending_commission: 320000,
          created_at: '2025-10-01',
          qr_codes: [
            { id: 'qr4', code: 'PTN-JKL012', name: '바 카운터', scan_count: 245, conversion_count: 45, total_revenue: 2100000 },
            { id: 'qr5', code: 'PTN-MNO345', name: '테라스', scan_count: 123, conversion_count: 18, total_revenue: 1100000 },
          ],
        },
      ];

      setPartners(mockPartners);

      // 통계 계산
      setStats({
        totalPartners: mockPartners.length,
        activePartners: mockPartners.filter(p => p.is_active).length,
        totalRevenue: mockPartners.reduce((acc, p) => acc + p.total_revenue, 0),
        totalCommission: mockPartners.reduce((acc, p) => acc + p.total_commission, 0),
        pendingCommission: mockPartners.reduce((acc, p) => acc + p.pending_commission, 0),
      });
    } catch (error) {
      console.error('Failed to fetch partners:', error);
    }
    setLoading(false);
  };

  const handleAddPartner = async () => {
    try {
      const response = await fetch('/api/partner', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newPartner),
      });

      if (response.ok) {
        setIsAddModalOpen(false);
        fetchPartners();
        setNewPartner({
          companyName: '',
          businessType: 'restaurant',
          contactName: '',
          contactEmail: '',
          contactPhone: '',
          address: '',
          tier: 'bronze',
        });
      }
    } catch (error) {
      console.error('Failed to add partner:', error);
    }
  };

  const copyToClipboard = async (text: string, id: string) => {
    await navigator.clipboard.writeText(text);
    setCopied(id);
    setTimeout(() => setCopied(null), 2000);
  };

  const filteredPartners = partners.filter(partner => {
    const matchesSearch = partner.company_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      partner.contact_email.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesTier = selectedTier === 'all' || partner.tier === selectedTier;
    return matchesSearch && matchesTier;
  });

  return (
    <div className="space-y-6">
      {/* 헤더 */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold flex items-center gap-2">
            <Building2 className="h-6 w-6 text-indigo-600" />
            비즈니스 파트너 관리
          </h1>
          <p className="text-muted-foreground mt-1">
            QR 기반 수익 쉐어 파트너를 관리합니다
          </p>
        </div>
        <Dialog open={isAddModalOpen} onOpenChange={setIsAddModalOpen}>
          <DialogTrigger asChild>
            <Button className="bg-indigo-600 hover:bg-indigo-700">
              <Plus className="mr-2 h-4 w-4" />
              파트너 추가
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-md">
            <DialogHeader>
              <DialogTitle>새 파트너 등록</DialogTitle>
              <DialogDescription>
                새로운 비즈니스 파트너를 등록합니다
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-4 py-4">
              <div className="space-y-2">
                <Label>업체명 *</Label>
                <Input
                  value={newPartner.companyName}
                  onChange={(e) => setNewPartner({ ...newPartner, companyName: e.target.value })}
                  placeholder="예: 홍길동 식당"
                />
              </div>
              <div className="space-y-2">
                <Label>업종</Label>
                <Select
                  value={newPartner.businessType}
                  onValueChange={(v) => setNewPartner({ ...newPartner, businessType: v })}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {Object.entries(BUSINESS_TYPES).map(([key, { name }]) => (
                      <SelectItem key={key} value={key}>{name}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>담당자명</Label>
                  <Input
                    value={newPartner.contactName}
                    onChange={(e) => setNewPartner({ ...newPartner, contactName: e.target.value })}
                  />
                </div>
                <div className="space-y-2">
                  <Label>연락처</Label>
                  <Input
                    value={newPartner.contactPhone}
                    onChange={(e) => setNewPartner({ ...newPartner, contactPhone: e.target.value })}
                  />
                </div>
              </div>
              <div className="space-y-2">
                <Label>이메일 *</Label>
                <Input
                  type="email"
                  value={newPartner.contactEmail}
                  onChange={(e) => setNewPartner({ ...newPartner, contactEmail: e.target.value })}
                />
              </div>
              <div className="space-y-2">
                <Label>주소</Label>
                <Input
                  value={newPartner.address}
                  onChange={(e) => setNewPartner({ ...newPartner, address: e.target.value })}
                />
              </div>
              <div className="space-y-2">
                <Label>파트너 등급</Label>
                <Select
                  value={newPartner.tier}
                  onValueChange={(v) => setNewPartner({ ...newPartner, tier: v })}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {Object.entries(PARTNER_TIERS).map(([key, { name, rate }]) => (
                      <SelectItem key={key} value={key}>
                        {name} ({rate}% 수익 쉐어)
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setIsAddModalOpen(false)}>
                취소
              </Button>
              <Button onClick={handleAddPartner}>
                등록하기
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>

      {/* 통계 카드 */}
      <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-indigo-100 rounded-lg">
                <Building2 className="h-5 w-5 text-indigo-600" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">총 파트너</p>
                <p className="text-xl font-bold">{stats.totalPartners}</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-green-100 rounded-lg">
                <Users className="h-5 w-5 text-green-600" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">활성 파트너</p>
                <p className="text-xl font-bold">{stats.activePartners}</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-blue-100 rounded-lg">
                <TrendingUp className="h-5 w-5 text-blue-600" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">총 매출</p>
                <p className="text-xl font-bold">₩{stats.totalRevenue.toLocaleString()}</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-purple-100 rounded-lg">
                <DollarSign className="h-5 w-5 text-purple-600" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">총 커미션</p>
                <p className="text-xl font-bold">₩{stats.totalCommission.toLocaleString()}</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-orange-100 rounded-lg">
                <DollarSign className="h-5 w-5 text-orange-600" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">미지급 커미션</p>
                <p className="text-xl font-bold">₩{stats.pendingCommission.toLocaleString()}</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* 검색 및 필터 */}
      <Card>
        <CardContent className="p-4">
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="업체명 또는 이메일로 검색..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
            <Select value={selectedTier} onValueChange={setSelectedTier}>
              <SelectTrigger className="w-[150px]">
                <SelectValue placeholder="등급 필터" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">전체 등급</SelectItem>
                {Object.entries(PARTNER_TIERS).map(([key, { name }]) => (
                  <SelectItem key={key} value={key}>{name}</SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Button variant="outline" onClick={fetchPartners}>
              <RefreshCw className="h-4 w-4" />
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* 파트너 목록 */}
      <Card>
        <CardHeader>
          <CardTitle>파트너 목록</CardTitle>
          <CardDescription>
            {filteredPartners.length}개의 파트너
          </CardDescription>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className="flex justify-center py-8">
              <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>업체명</TableHead>
                  <TableHead>업종</TableHead>
                  <TableHead>등급</TableHead>
                  <TableHead className="text-right">매출</TableHead>
                  <TableHead className="text-right">커미션</TableHead>
                  <TableHead>QR 코드</TableHead>
                  <TableHead>상태</TableHead>
                  <TableHead></TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredPartners.map((partner) => {
                  const BusinessIcon = BUSINESS_TYPES[partner.business_type as keyof typeof BUSINESS_TYPES]?.icon || Building2;
                  const tierInfo = PARTNER_TIERS[partner.tier];

                  return (
                    <TableRow key={partner.id}>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <BusinessIcon className="h-4 w-4 text-muted-foreground" />
                          <div>
                            <p className="font-medium">{partner.company_name}</p>
                            <p className="text-xs text-muted-foreground">{partner.contact_email}</p>
                          </div>
                        </div>
                      </TableCell>
                      <TableCell>
                        {BUSINESS_TYPES[partner.business_type as keyof typeof BUSINESS_TYPES]?.name || partner.business_type}
                      </TableCell>
                      <TableCell>
                        <Badge className={tierInfo.color}>
                          {tierInfo.name} ({tierInfo.rate}%)
                        </Badge>
                      </TableCell>
                      <TableCell className="text-right font-medium">
                        ₩{partner.total_revenue.toLocaleString()}
                      </TableCell>
                      <TableCell className="text-right">
                        <div>
                          <p className="font-medium">₩{partner.total_commission.toLocaleString()}</p>
                          {partner.pending_commission > 0 && (
                            <p className="text-xs text-orange-600">
                              미지급: ₩{partner.pending_commission.toLocaleString()}
                            </p>
                          )}
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <QrCode className="h-4 w-4 text-muted-foreground" />
                          <span>{partner.qr_codes?.length || 0}개</span>
                        </div>
                      </TableCell>
                      <TableCell>
                        {partner.is_active ? (
                          <Badge className="bg-green-100 text-green-800">활성</Badge>
                        ) : (
                          <Badge variant="secondary">비활성</Badge>
                        )}
                      </TableCell>
                      <TableCell>
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => setSelectedPartner(partner)}
                        >
                          <Eye className="h-4 w-4" />
                        </Button>
                      </TableCell>
                    </TableRow>
                  );
                })}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>

      {/* 파트너 상세 모달 */}
      <Dialog open={!!selectedPartner} onOpenChange={(open) => !open && setSelectedPartner(null)}>
        <DialogContent className="max-w-2xl">
          {selectedPartner && (
            <>
              <DialogHeader>
                <DialogTitle className="flex items-center gap-2">
                  {(() => {
                    const Icon = BUSINESS_TYPES[selectedPartner.business_type as keyof typeof BUSINESS_TYPES]?.icon || Building2;
                    return <Icon className="h-5 w-5" />;
                  })()}
                  {selectedPartner.company_name}
                </DialogTitle>
                <DialogDescription>
                  파트너 상세 정보 및 QR 코드 관리
                </DialogDescription>
              </DialogHeader>

              <Tabs defaultValue="info">
                <TabsList className="grid w-full grid-cols-2">
                  <TabsTrigger value="info">기본 정보</TabsTrigger>
                  <TabsTrigger value="qr">QR 코드</TabsTrigger>
                </TabsList>

                <TabsContent value="info" className="space-y-4 mt-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label className="text-muted-foreground">담당자</Label>
                      <p className="font-medium">{selectedPartner.contact_name}</p>
                    </div>
                    <div>
                      <Label className="text-muted-foreground">연락처</Label>
                      <p className="font-medium">{selectedPartner.contact_phone}</p>
                    </div>
                    <div>
                      <Label className="text-muted-foreground">이메일</Label>
                      <p className="font-medium">{selectedPartner.contact_email}</p>
                    </div>
                    <div>
                      <Label className="text-muted-foreground">등급</Label>
                      <Badge className={PARTNER_TIERS[selectedPartner.tier].color}>
                        {PARTNER_TIERS[selectedPartner.tier].name}
                      </Badge>
                    </div>
                    <div className="col-span-2">
                      <Label className="text-muted-foreground">주소</Label>
                      <p className="font-medium">{selectedPartner.address || '-'}</p>
                    </div>
                  </div>

                  <div className="grid grid-cols-3 gap-4 mt-4">
                    <Card>
                      <CardContent className="p-4 text-center">
                        <p className="text-sm text-muted-foreground">총 매출</p>
                        <p className="text-xl font-bold">₩{selectedPartner.total_revenue.toLocaleString()}</p>
                      </CardContent>
                    </Card>
                    <Card>
                      <CardContent className="p-4 text-center">
                        <p className="text-sm text-muted-foreground">총 커미션</p>
                        <p className="text-xl font-bold text-green-600">₩{selectedPartner.total_commission.toLocaleString()}</p>
                      </CardContent>
                    </Card>
                    <Card>
                      <CardContent className="p-4 text-center">
                        <p className="text-sm text-muted-foreground">미지급</p>
                        <p className="text-xl font-bold text-orange-600">₩{selectedPartner.pending_commission.toLocaleString()}</p>
                      </CardContent>
                    </Card>
                  </div>
                </TabsContent>

                <TabsContent value="qr" className="space-y-4 mt-4">
                  <div className="flex justify-between items-center">
                    <p className="text-sm text-muted-foreground">
                      {selectedPartner.qr_codes?.length || 0}개의 QR 코드
                    </p>
                    <Button size="sm">
                      <Plus className="mr-2 h-4 w-4" />
                      QR 추가
                    </Button>
                  </div>

                  <div className="space-y-3">
                    {selectedPartner.qr_codes?.map((qr) => (
                      <Card key={qr.id}>
                        <CardContent className="p-4">
                          <div className="flex items-center justify-between">
                            <div className="flex items-center gap-3">
                              <div className="p-2 bg-indigo-100 rounded-lg">
                                <QrCode className="h-5 w-5 text-indigo-600" />
                              </div>
                              <div>
                                <p className="font-medium">{qr.name}</p>
                                <p className="text-sm text-muted-foreground">{qr.code}</p>
                              </div>
                            </div>
                            <div className="flex items-center gap-4">
                              <div className="text-right">
                                <p className="text-sm">스캔 {qr.scan_count}회</p>
                                <p className="text-xs text-muted-foreground">
                                  전환 {qr.conversion_count}회 ({((qr.conversion_count / qr.scan_count) * 100).toFixed(1)}%)
                                </p>
                              </div>
                              <p className="font-medium">₩{qr.total_revenue.toLocaleString()}</p>
                              <div className="flex gap-1">
                                <Button
                                  variant="ghost"
                                  size="icon"
                                  onClick={() => copyToClipboard(`https://ai-planx.com/fortune/integrated?partner=${qr.code}`, qr.id)}
                                >
                                  {copied === qr.id ? (
                                    <Check className="h-4 w-4 text-green-500" />
                                  ) : (
                                    <Copy className="h-4 w-4" />
                                  )}
                                </Button>
                                <Button variant="ghost" size="icon">
                                  <Download className="h-4 w-4" />
                                </Button>
                              </div>
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                </TabsContent>
              </Tabs>
            </>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
