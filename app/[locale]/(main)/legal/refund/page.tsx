'use client';

import { Card, CardContent } from '@/components/ui/card';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { AlertCircle, CheckCircle, XCircle } from 'lucide-react';

export default function RefundPolicyPage() {
  return (
    <div className="container mx-auto px-4 py-8 max-w-4xl">
      <h1 className="text-3xl font-bold mb-8 text-center">환불 정책</h1>

      <Alert className="mb-6 border-blue-200 bg-blue-50">
        <AlertCircle className="h-4 w-4 text-blue-600" />
        <AlertTitle className="text-blue-800">디지털 콘텐츠 환불 안내</AlertTitle>
        <AlertDescription className="text-blue-700">
          본 서비스는 디지털 콘텐츠를 제공하며, 전자상거래 등에서의 소비자보호에 관한 법률에 따라 환불 정책이 적용됩니다.
        </AlertDescription>
      </Alert>

      <Card>
        <CardContent className="prose prose-sm max-w-none p-6 space-y-6">
          <section>
            <h2 className="text-xl font-semibold mb-4">제1조 (환불 정책 개요)</h2>
            <p>
              플랜엑스솔루션 주식회사(이하 "회사")는 「전자상거래 등에서의 소비자보호에 관한 법률」 및
              「콘텐츠산업진흥법」에 따라 다음과 같은 환불 정책을 운영합니다.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold mb-4">제2조 (환불 가능 기간)</h2>
            <div className="space-y-4">
              <div className="flex items-start gap-3 p-4 bg-green-50 rounded-lg">
                <CheckCircle className="h-5 w-5 text-green-600 mt-0.5" />
                <div>
                  <h4 className="font-semibold text-green-800">환불 가능</h4>
                  <ul className="list-disc pl-4 text-green-700 mt-2">
                    <li>결제일로부터 7일 이내, 서비스 미이용 시 전액 환불</li>
                    <li>서비스 장애로 인해 정상적인 이용이 불가능한 경우</li>
                    <li>결제 후 서비스가 제공되지 않은 경우</li>
                  </ul>
                </div>
              </div>

              <div className="flex items-start gap-3 p-4 bg-yellow-50 rounded-lg">
                <AlertCircle className="h-5 w-5 text-yellow-600 mt-0.5" />
                <div>
                  <h4 className="font-semibold text-yellow-800">부분 환불</h4>
                  <ul className="list-disc pl-4 text-yellow-700 mt-2">
                    <li>구독 서비스: 결제일로부터 7일 이후 해지 시, 남은 기간에 대해 일할 계산하여 환불</li>
                    <li>코인/포인트: 사용하지 않은 잔여 코인에 대해 환불 (단, 보너스 코인 제외)</li>
                  </ul>
                </div>
              </div>

              <div className="flex items-start gap-3 p-4 bg-red-50 rounded-lg">
                <XCircle className="h-5 w-5 text-red-600 mt-0.5" />
                <div>
                  <h4 className="font-semibold text-red-800">환불 불가</h4>
                  <ul className="list-disc pl-4 text-red-700 mt-2">
                    <li>이미 다운로드하거나 열람한 디지털 콘텐츠 (사주분석 결과, PDF 리포트 등)</li>
                    <li>이미 생성 완료된 QR코드</li>
                    <li>서비스 이용 후 단순 변심에 의한 환불 요청</li>
                    <li>무료로 제공받은 보너스 코인, 포인트, 혜택</li>
                    <li>제3자에게 양도 또는 선물한 서비스</li>
                  </ul>
                </div>
              </div>
            </div>
          </section>

          <section>
            <h2 className="text-xl font-semibold mb-4">제3조 (디지털 콘텐츠 특성에 따른 환불 제한)</h2>
            <p className="mb-4">
              「전자상거래 등에서의 소비자보호에 관한 법률」 제17조 제2항 및 동법 시행령 제21조에 따라,
              다음의 디지털 콘텐츠는 청약철회가 제한됩니다:
            </p>
            <ol className="list-decimal pl-6 space-y-2">
              <li>
                <strong>사주분석 서비스:</strong> 분석 결과가 생성되어 이용자에게 제공된 경우
                (콘텐츠의 제공이 개시된 경우)
              </li>
              <li>
                <strong>QR코드 생성 서비스:</strong> QR코드가 생성 완료된 경우
                (복제가 가능한 디지털 콘텐츠의 경우 복제 가능한 형태로 제공된 경우)
              </li>
              <li>
                <strong>PDF 리포트:</strong> 다운로드가 완료되거나 열람이 시작된 경우
              </li>
              <li>
                <strong>음성 리포트:</strong> 재생이 시작된 경우
              </li>
            </ol>
            <p className="mt-4 text-sm text-muted-foreground">
              ※ 위 내용은 결제 전 이용자에게 명확히 고지되며, 이용자의 동의를 받습니다.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold mb-4">제4조 (구독 서비스 환불)</h2>
            <table className="w-full border-collapse border">
              <thead>
                <tr className="bg-muted">
                  <th className="border p-3 text-left">환불 시점</th>
                  <th className="border p-3 text-left">환불 금액</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td className="border p-3">결제 후 7일 이내 (미이용 시)</td>
                  <td className="border p-3">전액 환불</td>
                </tr>
                <tr>
                  <td className="border p-3">결제 후 7일 이내 (이용 시)</td>
                  <td className="border p-3">이용일수 차감 후 환불</td>
                </tr>
                <tr>
                  <td className="border p-3">결제 후 7일 이후</td>
                  <td className="border p-3">남은 기간 일할 계산 환불</td>
                </tr>
                <tr>
                  <td className="border p-3">이용 기간 50% 이상 경과</td>
                  <td className="border p-3">환불 불가</td>
                </tr>
              </tbody>
            </table>
            <p className="mt-4 text-sm">
              * 일할 계산 공식: 환불금액 = 결제금액 × (잔여일수 / 총 이용일수)
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold mb-4">제5조 (환불 절차)</h2>
            <ol className="list-decimal pl-6 space-y-3">
              <li>
                <strong>환불 신청:</strong> 고객센터(1588-5617) 또는 이메일(mymiryu@gmail.com)로 환불 신청
              </li>
              <li>
                <strong>필요 정보:</strong> 회원 이메일, 결제일, 결제금액, 환불 사유
              </li>
              <li>
                <strong>처리 기간:</strong> 환불 신청 접수 후 영업일 기준 3~5일 이내 처리
              </li>
              <li>
                <strong>환불 방법:</strong> 원결제 수단으로 환불 (카드 결제 시 카드사 정책에 따라 최대 7일 소요)
              </li>
            </ol>
          </section>

          <section>
            <h2 className="text-xl font-semibold mb-4">제6조 (예외 사항)</h2>
            <ol className="list-decimal pl-6 space-y-2">
              <li>회사의 귀책사유로 서비스 이용이 불가능한 경우, 전액 환불합니다.</li>
              <li>결제 오류, 이중 결제 등 명백한 오류의 경우, 확인 후 즉시 환불합니다.</li>
              <li>미성년자의 법정대리인 동의 없는 결제는 관련 법령에 따라 처리합니다.</li>
            </ol>
          </section>

          <section>
            <h2 className="text-xl font-semibold mb-4">제7조 (횟수권/이용권 환불)</h2>
            <ol className="list-decimal pl-6 space-y-3">
              <li>
                <strong>환불 계산 기준:</strong> 횟수권 환불 시 사용분은 정가 기준으로 차감합니다.
                <p className="text-sm text-muted-foreground mt-1">
                  환불금액 = 결제금액 - (사용횟수 × 정가)
                </p>
              </li>
              <li>
                <strong>서비스별 정가:</strong>
                <ul className="list-disc pl-4 mt-2 space-y-1">
                  <li>사주 완전분석: 1회 29,900원</li>
                  <li>QR코드 생성: 1회 500원</li>
                  <li>로또번호 AI추천: 1회 500원</li>
                </ul>
              </li>
              <li>
                <strong>환불 예시:</strong>
                <div className="bg-muted/50 p-3 rounded-lg mt-2 text-sm">
                  <p>• 사주분석 10회권 97,000원 구매, 2회 사용 후 환불 시</p>
                  <p>• 환불금액: 97,000 - (2 × 29,900) = <strong>37,200원</strong></p>
                  <p className="text-muted-foreground mt-1">※ 사용분이 결제금액을 초과하면 환불금액은 0원</p>
                </div>
              </li>
              <li>
                <strong>환불 제한:</strong>
                <ul className="list-disc pl-4 mt-2 space-y-1">
                  <li>선물받은 이용권은 환불 불가</li>
                  <li>타인에게 선물한 이용권은 환불 불가</li>
                  <li>이벤트/프로모션으로 무료 지급된 이용권은 환불 불가</li>
                </ul>
              </li>
              <li>
                <strong>유효기간:</strong> 이용권의 유효기간은 구매일로부터 1년이며,
                유효기간 경과 후 미사용분은 소멸됩니다.
              </li>
            </ol>
          </section>

          <section className="border-t pt-6 mt-8">
            <h2 className="text-xl font-semibold mb-4">부칙</h2>
            <p>본 환불 정책은 2025년 1월 1일부터 시행합니다.</p>
          </section>

          <section className="bg-muted/50 p-4 rounded-lg mt-8">
            <h3 className="font-semibold mb-2">환불 문의</h3>
            <ul className="text-sm space-y-1">
              <li>고객센터: 1588-5617 (평일 09:00~18:00, 점심 12:00~13:00)</li>
              <li>이메일: mymiryu@gmail.com</li>
              <li>상호: 플랜엑스솔루션 주식회사</li>
              <li>대표자: 김형석</li>
              <li>사업자등록번호: 786-87-03494</li>
              <li>통신판매업 신고번호: 신고예정</li>
              <li>주소: 강원특별자치도 춘천시 춘천순환로 108, 501호</li>
            </ul>
          </section>
        </CardContent>
      </Card>
    </div>
  );
}
