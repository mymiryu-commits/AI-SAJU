'use client';

import { Card, CardContent } from '@/components/ui/card';

export default function TermsOfServicePage() {
  return (
    <div className="container mx-auto px-4 py-8 max-w-4xl">
      <h1 className="text-3xl font-bold mb-8 text-center">이용약관</h1>

      <Card>
        <CardContent className="prose prose-sm max-w-none p-6 space-y-6">
          <section>
            <h2 className="text-xl font-semibold mb-4">제1조 (목적)</h2>
            <p>
              본 약관은 플랜엑스솔루션 주식회사(이하 "회사")가 운영하는 AI-PlanX 서비스(이하 "서비스")의
              이용과 관련하여 회사와 이용자 간의 권리, 의무 및 책임사항, 기타 필요한 사항을 규정함을 목적으로 합니다.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold mb-4">제2조 (정의)</h2>
            <ol className="list-decimal pl-6 space-y-2">
              <li>"서비스"란 회사가 제공하는 사주분석, QR코드 생성, AI 기반 콘텐츠 서비스 등 온라인 디지털 콘텐츠 서비스를 말합니다.</li>
              <li>"이용자"란 본 약관에 따라 회사가 제공하는 서비스를 이용하는 회원 및 비회원을 말합니다.</li>
              <li>"회원"이란 회사에 개인정보를 제공하고 회원등록을 한 자로서, 회사의 서비스를 계속적으로 이용할 수 있는 자를 말합니다.</li>
              <li>"디지털 콘텐츠"란 서비스를 통해 제공되는 사주분석 리포트, QR코드, AI 생성 콘텐츠 등을 말합니다.</li>
              <li>"유료서비스"란 회사가 유료로 제공하는 구독권, 분석권, 코인 등의 서비스를 말합니다.</li>
            </ol>
          </section>

          <section>
            <h2 className="text-xl font-semibold mb-4">제3조 (약관의 효력 및 변경)</h2>
            <ol className="list-decimal pl-6 space-y-2">
              <li>본 약관은 서비스 화면에 게시하거나 기타의 방법으로 이용자에게 공지함으로써 효력을 발생합니다.</li>
              <li>회사는 관련 법령을 위배하지 않는 범위에서 본 약관을 변경할 수 있으며, 변경된 약관은 제1항과 같은 방법으로 공지합니다.</li>
              <li>이용자는 변경된 약관에 동의하지 않을 경우 서비스 이용을 중단하고 탈퇴할 수 있습니다.</li>
            </ol>
          </section>

          <section>
            <h2 className="text-xl font-semibold mb-4">제4조 (서비스의 제공)</h2>
            <ol className="list-decimal pl-6 space-y-2">
              <li>회사는 다음과 같은 서비스를 제공합니다:
                <ul className="list-disc pl-6 mt-2">
                  <li>사주팔자 분석 서비스 (기본분석, 심층분석, 프리미엄분석)</li>
                  <li>관상 분석 서비스</li>
                  <li>궁합 분석 서비스</li>
                  <li>QR코드 생성 서비스</li>
                  <li>AI 기반 콘텐츠 생성 서비스</li>
                  <li>기타 회사가 정하는 서비스</li>
                </ul>
              </li>
              <li>서비스는 연중무휴, 1일 24시간 제공을 원칙으로 합니다. 다만, 시스템 점검 등의 필요에 의해 일시적으로 중단될 수 있습니다.</li>
            </ol>
          </section>

          <section>
            <h2 className="text-xl font-semibold mb-4">제5조 (회원가입)</h2>
            <ol className="list-decimal pl-6 space-y-2">
              <li>이용자는 회사가 정한 가입 양식에 따라 회원정보를 기입한 후 본 약관에 동의한다는 의사표시를 함으로써 회원가입을 신청합니다.</li>
              <li>회사는 제1항과 같이 회원으로 가입할 것을 신청한 이용자 중 다음 각 호에 해당하지 않는 한 회원으로 등록합니다:
                <ul className="list-disc pl-6 mt-2">
                  <li>가입신청자가 본 약관에 의하여 이전에 회원자격을 상실한 적이 있는 경우</li>
                  <li>등록 내용에 허위, 기재누락, 오기가 있는 경우</li>
                  <li>기타 회원으로 등록하는 것이 회사의 기술상 현저히 지장이 있다고 판단되는 경우</li>
                </ul>
              </li>
            </ol>
          </section>

          <section>
            <h2 className="text-xl font-semibold mb-4">제6조 (유료서비스 이용)</h2>
            <ol className="list-decimal pl-6 space-y-2">
              <li>회원은 회사가 정한 요금을 결제함으로써 유료서비스를 이용할 수 있습니다.</li>
              <li>유료서비스의 종류, 이용요금 및 결제방법은 서비스 내에 별도로 게시합니다.</li>
              <li>회사는 유료서비스의 요금을 변경할 수 있으며, 변경 시 최소 7일 전에 공지합니다.</li>
              <li>구독서비스는 해지하지 않는 한 자동으로 갱신되며, 갱신 시점에 등록된 결제수단으로 요금이 청구됩니다.</li>
            </ol>
          </section>

          <section>
            <h2 className="text-xl font-semibold mb-4">제7조 (회원의 의무)</h2>
            <ol className="list-decimal pl-6 space-y-2">
              <li>회원은 다음 각 호의 행위를 하여서는 안 됩니다:
                <ul className="list-disc pl-6 mt-2">
                  <li>신청 또는 변경 시 허위내용의 등록</li>
                  <li>타인의 정보 도용</li>
                  <li>회사가 게시한 정보의 변경</li>
                  <li>회사가 정한 정보 이외의 정보(컴퓨터 프로그램 등) 등의 송신 또는 게시</li>
                  <li>회사와 기타 제3자의 저작권 등 지적재산권에 대한 침해</li>
                  <li>회사 및 기타 제3자의 명예를 손상시키거나 업무를 방해하는 행위</li>
                  <li>서비스를 이용하여 얻은 정보를 회사의 사전 승낙 없이 복제, 유통, 조장하거나 상업적으로 이용하는 행위</li>
                </ul>
              </li>
            </ol>
          </section>

          <section>
            <h2 className="text-xl font-semibold mb-4">제8조 (저작권의 귀속)</h2>
            <ol className="list-decimal pl-6 space-y-2">
              <li>서비스에 대한 저작권 및 지적재산권은 회사에 귀속됩니다.</li>
              <li>이용자가 서비스를 이용함으로써 생성된 디지털 콘텐츠의 저작권은 이용자에게 귀속됩니다. 다만, 이용자는 해당 콘텐츠를 개인적 목적으로만 사용할 수 있습니다.</li>
              <li>이용자는 서비스를 이용하여 얻은 정보를 회사의 사전 승낙 없이 복제, 송신, 출판, 배포, 방송 기타 방법에 의하여 영리목적으로 이용하거나 제3자에게 이용하게 하여서는 안 됩니다.</li>
            </ol>
          </section>

          <section>
            <h2 className="text-xl font-semibold mb-4">제9조 (면책조항)</h2>
            <ol className="list-decimal pl-6 space-y-2">
              <li>회사는 천재지변, 전쟁 및 기타 불가항력적 사유로 인해 서비스를 제공할 수 없는 경우에는 서비스 제공에 관한 책임이 면제됩니다.</li>
              <li>회사는 서비스를 통해 제공되는 사주분석, 운세, AI 분석 결과 등의 정보에 대해 그 정확성, 신뢰성, 적합성을 보증하지 않습니다. 해당 정보는 참고용으로만 제공되며, 이를 기반으로 한 이용자의 의사결정에 대해 회사는 책임을 지지 않습니다.</li>
              <li>회사는 이용자의 귀책사유로 인한 서비스 이용의 장애에 대하여 책임을 지지 않습니다.</li>
            </ol>
          </section>

          <section>
            <h2 className="text-xl font-semibold mb-4">제10조 (분쟁 해결)</h2>
            <ol className="list-decimal pl-6 space-y-2">
              <li>회사는 이용자가 제기하는 정당한 의견이나 불만을 반영하고 그 피해를 보상처리하기 위해 고객센터를 운영합니다.</li>
              <li>본 약관에 명시되지 않은 사항은 관련 법령 및 상관례에 따릅니다.</li>
              <li>서비스 이용으로 발생한 분쟁에 대해 소송이 제기될 경우 회사의 본사 소재지를 관할하는 법원을 관할법원으로 합니다.</li>
            </ol>
          </section>

          <section className="border-t pt-6 mt-8">
            <h2 className="text-xl font-semibold mb-4">부칙</h2>
            <p>본 약관은 2025년 1월 1일부터 시행합니다.</p>
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
