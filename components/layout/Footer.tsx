'use client';

import { Link } from '@/i18n/routing';
import { Phone, Mail, Building2 } from 'lucide-react';

export function Footer() {
  return (
    <footer className="border-t bg-muted/50">
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
          {/* Company Info */}
          <div className="col-span-2 md:col-span-1">
            <h3 className="font-semibold mb-4">플랜엑스솔루션</h3>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li className="flex items-center gap-2">
                <Building2 className="h-4 w-4" />
                <span>사업자등록번호: 786-87-03494</span>
              </li>
              <li className="flex items-center gap-2">
                <Phone className="h-4 w-4" />
                <a href="tel:1588-5617" className="hover:text-primary">
                  고객센터: 1588-5617
                </a>
              </li>
              <li className="flex items-center gap-2">
                <Mail className="h-4 w-4" />
                <a href="mailto:mymiryu@gmail.com" className="hover:text-primary">
                  mymiryu@gmail.com
                </a>
              </li>
            </ul>
          </div>

          {/* Services */}
          <div>
            <h3 className="font-semibold mb-4">서비스</h3>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li>
                <Link href="/fortune/saju" className="hover:text-primary">
                  사주분석
                </Link>
              </li>
              <li>
                <Link href="/fortune/face" className="hover:text-primary">
                  관상분석
                </Link>
              </li>
              <li>
                <Link href="/tools/qrcode" className="hover:text-primary">
                  QR코드 생성
                </Link>
              </li>
              <li>
                <Link href="/pricing" className="hover:text-primary">
                  요금제
                </Link>
              </li>
            </ul>
          </div>

          {/* Support */}
          <div>
            <h3 className="font-semibold mb-4">고객지원</h3>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li>
                <Link href="/guide" className="hover:text-primary">
                  이용가이드
                </Link>
              </li>
              <li>
                <a href="tel:1588-5617" className="hover:text-primary">
                  전화문의
                </a>
              </li>
              <li>
                <a href="mailto:mymiryu@gmail.com" className="hover:text-primary">
                  이메일문의
                </a>
              </li>
            </ul>
          </div>

          {/* Legal - 토스 심사 필수 페이지 */}
          <div>
            <h3 className="font-semibold mb-4">약관 및 정책</h3>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li>
                <Link href="/legal/terms" className="hover:text-primary">
                  이용약관
                </Link>
              </li>
              <li>
                <Link href="/legal/privacy" className="hover:text-primary">
                  개인정보처리방침
                </Link>
              </li>
              <li>
                <Link href="/legal/refund" className="hover:text-primary">
                  환불정책
                </Link>
              </li>
              <li>
                <Link href="/legal/disclaimer" className="hover:text-primary">
                  책임제한조항
                </Link>
              </li>
            </ul>
          </div>
        </div>

        {/* Business Info - 전자상거래법 필수 표기사항 */}
        <div className="mt-8 pt-8 border-t">
          <div className="text-xs text-muted-foreground space-y-1">
            <p><strong>플랜엑스솔루션 주식회사</strong></p>
            <p>대표: 이현석 | 사업자등록번호: 786-87-03494</p>
            <p>고객센터: 1588-5617 (평일 09:00 ~ 18:00)</p>
            <p>이메일: mymiryu@gmail.com</p>
          </div>
        </div>

        {/* Copyright */}
        <div className="mt-8 pt-4 border-t text-center text-sm text-muted-foreground">
          <p>&copy; {new Date().getFullYear()} 플랜엑스솔루션 주식회사. All rights reserved.</p>
          <p className="text-xs mt-2">
            본 서비스의 사주분석, 운세 정보는 참고용이며, 중요한 결정은 전문가와 상담하시기 바랍니다.
          </p>
        </div>
      </div>
    </footer>
  );
}
