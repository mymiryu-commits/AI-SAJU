import { NextRequest, NextResponse } from 'next/server';

export async function GET(request: NextRequest) {
  const redirectBase = process.env.NEXT_PUBLIC_SITE_URL || '';
  const { searchParams } = new URL(request.url);
  const errorCode = searchParams.get('code') || 'unknown';
  const errorMessage = searchParams.get('message') || '';

  console.log('Payment failed:', { errorCode, errorMessage });

  // 결제 실패 페이지로 리다이렉트 (로케일 포함)
  const params = new URLSearchParams({
    error: errorCode,
    ...(errorMessage && { message: errorMessage }),
  });

  return NextResponse.redirect(
    `${redirectBase}/ko/payment/fail?${params.toString()}`
  );
}
