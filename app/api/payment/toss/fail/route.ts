import { NextRequest, NextResponse } from 'next/server';

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const errorCode = searchParams.get('code') || 'unknown';
  const errorMessage = searchParams.get('message') || 'Unknown error';

  console.log('Payment failed:', { errorCode, errorMessage });

  // Redirect to pricing page with error message
  return NextResponse.redirect(
    new URL(`/pricing?error=${encodeURIComponent(errorCode)}&message=${encodeURIComponent(errorMessage)}`, request.url)
  );
}
