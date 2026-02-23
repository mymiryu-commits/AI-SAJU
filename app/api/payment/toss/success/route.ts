import { NextRequest, NextResponse } from 'next/server';

// Toss Payments redirects here after successful payment
// Client-side will call /api/payment/toss/confirm to finalize
export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const paymentKey = searchParams.get('paymentKey');
  const orderId = searchParams.get('orderId');
  const amount = searchParams.get('amount');

  if (!paymentKey || !orderId || !amount) {
    const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || '';
    return NextResponse.redirect(`${baseUrl}/ko/pricing?error=missing_params`);
  }

  // Redirect to client-side success page with payment data
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || '';
  const params = new URLSearchParams({ paymentKey, orderId, amount });
  return NextResponse.redirect(
    `${baseUrl}/ko/payment/success?${params.toString()}`
  );
}
