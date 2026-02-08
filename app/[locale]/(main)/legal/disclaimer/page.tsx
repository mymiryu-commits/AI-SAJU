'use client';

import { Card, CardContent } from '@/components/ui/card';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { AlertTriangle, Info } from 'lucide-react';

export default function DisclaimerPage() {
  return (
    <div className="container mx-auto px-4 py-8 max-w-4xl">
      <h1 className="text-3xl font-bold mb-8 text-center">책임 제한 조항</h1>

      <Alert className="mb-6 border-amber-200 bg-amber-50">
        <AlertTriangle className="h-4 w-4 text-amber-600" />
        <AlertTitle className="text-amber-800">중요 고지사항</AlertTitle>
        <AlertDescription className="text-amber-700">
          본 서비스 이용 전 아래 책임 제한 조항을 반드시 읽어주시기 바랍니다.
        </AlertDescription>
      </Alert>

      <Card>
        <CardContent className="prose prose-sm max-w-none p-6 space-y-6">
          <section>
            <h2 className="text-xl font-semibold mb-4">제1조 (서비스 이용에 관한 면책)</h2>
            <ol className="list-decimal pl-6 space-y-3">
              <li>
                <strong>정보의 성격:</strong> 본 서비스에서 제공하는 사주분석, 운세, 궁합, 관상분석,
                AI 기반 예측 등의 모든 정보는 <u>오락 및 참고 목적</u>으로만 제공됩니다.
                해당 정보는 과학적으로 검증된 것이 아니며, 어떠한 사실이나 미래를 보장하지 않습니다.
              </li>
              <li>
                <strong>의사결정 책임:</strong> 서비스에서 제공하는 정보를 기반으로 한 이용자의
                의사결정(투자, 취업, 결혼, 건강, 법적 문제 등)에 대해 회사는 어떠한 책임도 지지 않습니다.
                중요한 결정은 반드시 해당 분야의 전문가와 상담하시기 바랍니다.
              </li>
              <li>
                <strong>정확성 비보장:</strong> 회사는 서비스를 통해 제공되는 정보의 정확성, 완전성,
                신뢰성, 적시성, 유용성을 보증하지 않습니다.
              </li>
            </ol>
          </section>

          <section>
            <h2 className="text-xl font-semibold mb-4">제2조 (서비스 제공에 관한 면책)</h2>
            <ol className="list-decimal pl-6 space-y-3">
              <li>
                <strong>서비스 중단:</strong> 회사는 다음 각 호의 경우 서비스의 전부 또는 일부를
                제한하거나 중지할 수 있으며, 이로 인한 손해에 대해 책임을 지지 않습니다:
                <ul className="list-disc pl-6 mt-2">
                  <li>컴퓨터 등 정보통신설비의 보수점검, 교체 및 고장, 통신두절 등의 사유가 발생한 경우</li>
                  <li>천재지변, 전쟁, 정전, 서비스 설비의 장애 또는 서비스 이용의 폭주 등으로 서비스 제공이 곤란한 경우</li>
                  <li>기간통신사업자가 전기통신 서비스를 중지한 경우</li>
                  <li>기타 불가항력적 사유가 있는 경우</li>
                </ul>
              </li>
              <li>
                <strong>제3자 서비스:</strong> 회사는 제3자가 제공하는 서비스(결제, 소셜 로그인 등)의
                장애나 오류에 대해 책임을 지지 않습니다.
              </li>
              <li>
                <strong>데이터 손실:</strong> 이용자의 귀책사유로 인한 서비스 이용 장애, 데이터 손실에
                대해 회사는 책임을 지지 않습니다.
              </li>
            </ol>
          </section>

          <section>
            <h2 className="text-xl font-semibold mb-4">제3조 (사주분석 서비스 특별 고지)</h2>
            <div className="bg-blue-50 border border-blue-200 p-4 rounded-lg">
              <div className="flex items-start gap-3">
                <Info className="h-5 w-5 text-blue-600 mt-0.5" />
                <div className="text-blue-800">
                  <p className="mb-2">
                    <strong>사주분석 서비스에 대한 특별 안내:</strong>
                  </p>
                  <ol className="list-decimal pl-4 space-y-2 text-sm">
                    <li>
                      본 서비스의 사주분석은 전통 명리학 이론을 바탕으로 AI가 생성한 결과입니다.
                      이는 미래를 예측하는 것이 아니며, <strong>참고용 정보</strong>로만 활용하시기 바랍니다.
                    </li>
                    <li>
                      건강, 질병, 의료 관련 정보가 포함된 경우, 이는 의학적 조언이 아닙니다.
                      건강 문제는 반드시 의료 전문가와 상담하시기 바랍니다.
                    </li>
                    <li>
                      재물운, 투자운 등 재정 관련 정보는 투자 조언이 아닙니다.
                      투자 결정은 금융 전문가와 상담하시기 바랍니다.
                    </li>
                    <li>
                      분석 결과로 인한 심리적 영향에 대해 회사는 책임을 지지 않습니다.
                    </li>
                  </ol>
                </div>
              </div>
            </div>
          </section>

          <section>
            <h2 className="text-xl font-semibold mb-4">제4조 (QR코드 서비스 면책)</h2>
            <ol className="list-decimal pl-6 space-y-2">
              <li>
                회사는 이용자가 생성한 QR코드에 포함된 정보의 정확성, 적법성에 대해 책임을 지지 않습니다.
              </li>
              <li>
                QR코드를 통해 연결되는 외부 사이트나 콘텐츠에 대해 회사는 책임을 지지 않습니다.
              </li>
              <li>
                이용자는 QR코드를 불법적인 목적으로 사용하여서는 안 되며, 이로 인한 법적 책임은
                전적으로 이용자에게 있습니다.
              </li>
            </ol>
          </section>

          <section>
            <h2 className="text-xl font-semibold mb-4">제5조 (손해배상의 제한)</h2>
            <ol className="list-decimal pl-6 space-y-3">
              <li>
                <strong>배상 범위:</strong> 회사의 고의 또는 중대한 과실로 인한 경우를 제외하고,
                회사의 손해배상 책임은 이용자가 해당 서비스에 대해 지불한 금액을 한도로 합니다.
              </li>
              <li>
                <strong>간접 손해:</strong> 회사는 서비스 이용과 관련하여 발생한 간접적, 부수적,
                결과적, 특별 또는 징벌적 손해에 대해 책임을 지지 않습니다.
              </li>
              <li>
                <strong>무료 서비스:</strong> 회사가 무료로 제공하는 서비스의 이용과 관련하여
                발생한 손해에 대해 회사는 책임을 지지 않습니다.
              </li>
            </ol>
          </section>

          <section>
            <h2 className="text-xl font-semibold mb-4">제6조 (이용자의 의무)</h2>
            <ol className="list-decimal pl-6 space-y-2">
              <li>
                이용자는 본 서비스가 제공하는 정보를 참고 목적으로만 활용해야 합니다.
              </li>
              <li>
                이용자는 서비스를 통해 얻은 정보를 바탕으로 중요한 결정을 내리기 전에
                해당 분야의 전문가와 상담해야 합니다.
              </li>
              <li>
                이용자는 서비스를 불법적인 목적으로 사용하지 않을 의무가 있습니다.
              </li>
            </ol>
          </section>

          <section>
            <h2 className="text-xl font-semibold mb-4">제7조 (준거법 및 관할법원)</h2>
            <ol className="list-decimal pl-6 space-y-2">
              <li>본 약관은 대한민국 법률에 따라 규율되고 해석됩니다.</li>
              <li>
                서비스 이용으로 발생한 분쟁에 대해 소송이 제기되는 경우,
                회사의 본사 소재지를 관할하는 법원을 관할법원으로 합니다.
              </li>
            </ol>
          </section>

          <section className="border-t pt-6 mt-8">
            <h2 className="text-xl font-semibold mb-4">부칙</h2>
            <p>본 책임 제한 조항은 2025년 1월 1일부터 시행합니다.</p>
          </section>

          <section className="bg-muted/50 p-4 rounded-lg mt-8">
            <h3 className="font-semibold mb-2">사업자 정보</h3>
            <ul className="text-sm space-y-1">
              <li>상호: 플랜엑스솔루션 주식회사</li>
              <li>대표자: 김형석</li>
              <li>사업자등록번호: 786-87-03494</li>
              <li>통신판매업 신고번호: 신고예정</li>
              <li>주소: 강원특별자치도 춘천시 춘천순환로 108, 501호</li>
              <li>고객센터: 1588-5617 (평일 09:00~18:00)</li>
              <li>이메일: mymiryu@gmail.com</li>
            </ul>
          </section>
        </CardContent>
      </Card>
    </div>
  );
}
