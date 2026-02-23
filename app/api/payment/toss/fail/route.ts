import { NextRequest, NextResponse } from 'next/server';

// Toss Payments redirects here when payment fails or is canceled
export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const code = searchParams.get('code') || 'UNKNOWN_ERROR';
  const message = searchParams.get('message') || 'Payment failed';
  const orderId = searchParams.get('orderId') || '';

  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || '';
  const params = new URLSearchParams({ code, message, orderId });
  return NextResponse.redirect(
    `${baseUrl}/ko/payment/fail?${params.toString()}`
  );
}
