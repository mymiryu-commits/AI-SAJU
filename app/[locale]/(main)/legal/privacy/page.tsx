'use client';

import { Card, CardContent } from '@/components/ui/card';

export default function PrivacyPolicyPage() {
  return (
    <div className="container mx-auto px-4 py-8 max-w-4xl">
      <h1 className="text-3xl font-bold mb-8 text-center">개인정보처리방침</h1>

      <Card>
        <CardContent className="prose prose-sm max-w-none p-6 space-y-6">
          <p className="text-muted-foreground">
            플랜엑스솔루션 주식회사(이하 "회사")는 「개인정보보호법」에 따라 이용자의 개인정보를 보호하고
            이와 관련한 고충을 신속하고 원활하게 처리할 수 있도록 다음과 같이 개인정보 처리방침을 수립·공개합니다.
          </p>

          <section>
            <h2 className="text-xl font-semibold mb-4">제1조 (개인정보의 수집 항목 및 수집 방법)</h2>
            <h3 className="text-lg font-medium mt-4 mb-2">1. 수집하는 개인정보 항목</h3>
            <table className="w-full border-collapse border text-sm">
              <thead>
                <tr className="bg-muted">
                  <th className="border p-2 text-left">수집 시점</th>
                  <th className="border p-2 text-left">필수 항목</th>
                  <th className="border p-2 text-left">선택 항목</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td className="border p-2">회원가입</td>
                  <td className="border p-2">이메일, 비밀번호</td>
                  <td className="border p-2">이름, 프로필 이미지</td>
                </tr>
                <tr>
                  <td className="border p-2">소셜 로그인</td>
                  <td className="border p-2">소셜 계정 식별자, 이메일</td>
                  <td className="border p-2">이름, 프로필 이미지</td>
                </tr>
                <tr>
                  <td className="border p-2">사주분석 서비스</td>
                  <td className="border p-2">생년월일, 출생시간</td>
                  <td className="border p-2">성별, 이름</td>
                </tr>
                <tr>
                  <td className="border p-2">결제</td>
                  <td className="border p-2">결제정보(카드번호, 계좌번호 등)</td>
                  <td className="border p-2">-</td>
                </tr>
              </tbody>
            </table>

            <h3 className="text-lg font-medium mt-4 mb-2">2. 자동 수집 정보</h3>
            <ul className="list-disc pl-6">
              <li>접속 IP 주소, 접속 일시, 서비스 이용 기록</li>
              <li>기기 정보 (기기 종류, OS 버전, 브라우저 종류)</li>
              <li>쿠키, 광고 식별자</li>
            </ul>
          </section>

          <section>
            <h2 className="text-xl font-semibold mb-4">제2조 (개인정보의 수집 및 이용 목적)</h2>
            <ol className="list-decimal pl-6 space-y-2">
              <li><strong>회원 관리:</strong> 회원제 서비스 제공, 본인확인, 부정 이용 방지</li>
              <li><strong>서비스 제공:</strong> 사주분석, QR코드 생성, AI 콘텐츠 제공</li>
              <li><strong>결제 처리:</strong> 유료 서비스 결제 및 환불</li>
              <li><strong>고객 지원:</strong> 문의 응대, 불만 처리, 공지사항 전달</li>
              <li><strong>서비스 개선:</strong> 통계 분석, 서비스 품질 향상</li>
              <li><strong>마케팅:</strong> 이벤트 안내, 광고성 정보 제공 (동의 시)</li>
            </ol>
          </section>

          <section>
            <h2 className="text-xl font-semibold mb-4">제3조 (개인정보의 보유 및 이용 기간)</h2>
            <p>
              회사는 법령에 따른 개인정보 보유·이용기간 또는 정보주체로부터 개인정보를 수집 시에 동의받은
              개인정보 보유·이용기간 내에서 개인정보를 처리·보유합니다.
            </p>
            <table className="w-full border-collapse border text-sm mt-4">
              <thead>
                <tr className="bg-muted">
                  <th className="border p-2 text-left">구분</th>
                  <th className="border p-2 text-left">보유 기간</th>
                  <th className="border p-2 text-left">근거 법령</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td className="border p-2">회원정보</td>
                  <td className="border p-2">회원 탈퇴 시까지</td>
                  <td className="border p-2">-</td>
                </tr>
                <tr>
                  <td className="border p-2">계약 또는 청약철회 기록</td>
                  <td className="border p-2">5년</td>
                  <td className="border p-2">전자상거래법</td>
                </tr>
                <tr>
                  <td className="border p-2">대금결제 및 재화 공급 기록</td>
                  <td className="border p-2">5년</td>
                  <td className="border p-2">전자상거래법</td>
                </tr>
                <tr>
                  <td className="border p-2">소비자 불만 또는 분쟁처리 기록</td>
                  <td className="border p-2">3년</td>
                  <td className="border p-2">전자상거래법</td>
                </tr>
                <tr>
                  <td className="border p-2">접속 기록</td>
                  <td className="border p-2">3개월</td>
                  <td className="border p-2">통신비밀보호법</td>
                </tr>
              </tbody>
            </table>
          </section>

          <section>
            <h2 className="text-xl font-semibold mb-4">제4조 (개인정보의 제3자 제공)</h2>
            <p>
              회사는 이용자의 개인정보를 제1조에서 명시한 범위 내에서만 처리하며, 이용자의 동의 없이는
              본래의 목적 범위를 초과하여 처리하거나 제3자에게 제공하지 않습니다. 다만, 다음의 경우에는
              예외로 합니다:
            </p>
            <ol className="list-decimal pl-6 mt-4 space-y-2">
              <li>이용자가 사전에 동의한 경우</li>
              <li>법령에 의거하거나, 수사목적으로 법령에 정해진 절차와 방법에 따라 수사기관의 요구가 있는 경우</li>
            </ol>
          </section>

          <section>
            <h2 className="text-xl font-semibold mb-4">제5조 (개인정보처리의 위탁)</h2>
            <p>회사는 원활한 개인정보 업무처리를 위해 다음과 같이 개인정보 처리업무를 위탁하고 있습니다:</p>
            <table className="w-full border-collapse border text-sm mt-4">
              <thead>
                <tr className="bg-muted">
                  <th className="border p-2 text-left">위탁받는 자</th>
                  <th className="border p-2 text-left">위탁 업무</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td className="border p-2">토스페이먼츠</td>
                  <td className="border p-2">결제 처리</td>
                </tr>
                <tr>
                  <td className="border p-2">Supabase</td>
                  <td className="border p-2">데이터베이스 호스팅</td>
                </tr>
                <tr>
                  <td className="border p-2">Vercel</td>
                  <td className="border p-2">웹 호스팅</td>
                </tr>
              </tbody>
            </table>
          </section>

          <section>
            <h2 className="text-xl font-semibold mb-4">제6조 (개인정보의 파기)</h2>
            <ol className="list-decimal pl-6 space-y-2">
              <li>
                <strong>파기 절차:</strong> 이용자가 입력한 정보는 목적 달성 후 별도의 DB에 옮겨져
                내부 방침 및 관련 법령에 따라 일정기간 저장된 후 파기됩니다.
              </li>
              <li>
                <strong>파기 방법:</strong> 전자적 파일 형태의 정보는 기록을 재생할 수 없는 기술적 방법을
                사용하여 삭제합니다.
              </li>
            </ol>
          </section>

          <section>
            <h2 className="text-xl font-semibold mb-4">제7조 (정보주체의 권리·의무 및 행사방법)</h2>
            <p>이용자는 개인정보주체로서 다음과 같은 권리를 행사할 수 있습니다:</p>
            <ol className="list-decimal pl-6 mt-4 space-y-2">
              <li>개인정보 열람 요구</li>
              <li>오류 등이 있을 경우 정정 요구</li>
              <li>삭제 요구</li>
              <li>처리정지 요구</li>
            </ol>
            <p className="mt-4">
              권리 행사는 서면, 전화, 전자우편, 모사전송(FAX) 등을 통해 하실 수 있으며
              회사는 지체 없이 조치하겠습니다.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold mb-4">제8조 (개인정보 보호책임자)</h2>
            <div className="bg-muted/50 p-4 rounded-lg">
              <ul className="space-y-2">
                <li><strong>성명:</strong> 김형석</li>
                <li><strong>직책:</strong> 대표이사</li>
                <li><strong>연락처:</strong> 1588-5617</li>
                <li><strong>이메일:</strong> mymiryu@gmail.com</li>
              </ul>
            </div>
          </section>

          <section>
            <h2 className="text-xl font-semibold mb-4">제9조 (개인정보의 안전성 확보조치)</h2>
            <p>회사는 개인정보의 안전성 확보를 위해 다음과 같은 조치를 취하고 있습니다:</p>
            <ol className="list-decimal pl-6 mt-4 space-y-2">
              <li><strong>관리적 조치:</strong> 내부관리계획 수립·시행, 정기적 직원 교육</li>
              <li><strong>기술적 조치:</strong> 개인정보처리시스템 접근권한 관리, 접근통제시스템 설치, 고유식별정보 등의 암호화, 보안프로그램 설치</li>
              <li><strong>물리적 조치:</strong> 전산실, 자료보관실 등의 접근통제</li>
            </ol>
          </section>

          <section>
            <h2 className="text-xl font-semibold mb-4">제10조 (권익침해 구제방법)</h2>
            <p>개인정보 침해에 대한 신고나 상담이 필요하신 경우 아래 기관에 문의하시기 바랍니다:</p>
            <ul className="list-disc pl-6 mt-4 space-y-2">
              <li>개인정보침해신고센터: (국번없이) 118 (privacy.kisa.or.kr)</li>
              <li>개인정보분쟁조정위원회: (국번없이) 1833-6972 (www.kopico.go.kr)</li>
              <li>대검찰청 사이버범죄수사단: (국번없이) 1301 (www.spo.go.kr)</li>
              <li>경찰청 사이버안전국: (국번없이) 182 (cyberbureau.police.go.kr)</li>
            </ul>
          </section>

          <section className="border-t pt-6 mt-8">
            <h2 className="text-xl font-semibold mb-4">부칙</h2>
            <p>본 개인정보처리방침은 2025년 1월 1일부터 시행합니다.</p>
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
