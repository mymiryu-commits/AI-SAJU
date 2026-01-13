import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import {
  SUBSCRIPTION_TIERS,
  ANALYSIS_PRODUCTS,
  COIN_PACKAGES,
  QR_CODE_PLANS,
  getCurrencyFromLocale,
  getPrice,
} from '@/lib/payment/pricing';

export async function POST(request: NextRequest) {
  try {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
      return NextResponse.json(
        { error: 'Authentication required' },
        { status: 401 }
      );
    }

    const body = await request.json();
    const { productType, productId, locale = 'ko' } = body;

    // Validate product
    let product;
    switch (productType) {
      case 'subscription':
        product = SUBSCRIPTION_TIERS[productId];
        break;
      case 'analysis':
        product = ANALYSIS_PRODUCTS[productId];
        break;
      case 'coin':
        product = COIN_PACKAGES[productId];
        break;
      case 'qr':
        product = QR_CODE_PLANS[productId];
        break;
      default:
        return NextResponse.json(
          { error: 'Invalid product type' },
          { status: 400 }
        );
    }

    if (!product) {
      return NextResponse.json(
        { error: 'Product not found' },
        { status: 404 }
      );
    }

    const currency = getCurrencyFromLocale(locale);
    const amount = getPrice(product, currency);

    // Determine payment provider based on locale
    const paymentProvider = locale === 'ko' ? 'toss' : 'stripe';

    // Create payment record
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const { data: payment, error } = await (supabase as any)
      .from('payments')
      .insert({
        user_id: user.id,
        type: productType,
        reference_id: product.id,
        amount,
        currency,
        payment_provider: paymentProvider,
        payment_status: 'pending',
      })
      .select()
      .single();

    if (error) {
      console.error('Payment creation error:', error);
      return NextResponse.json(
        { error: 'Failed to create payment' },
        { status: 500 }
      );
    }

    // Generate payment session based on provider
    if (paymentProvider === 'toss') {
      // TossPayments integration
      const tossPaymentData = {
        orderId: payment.id,
        orderName: product.name[locale as 'ko' | 'ja' | 'en'] || product.name.en,
        amount,
        customerName: user.email?.split('@')[0] || 'Customer',
        customerEmail: user.email,
        successUrl: `${process.env.NEXT_PUBLIC_SITE_URL}/api/payment/toss/success`,
        failUrl: `${process.env.NEXT_PUBLIC_SITE_URL}/api/payment/toss/fail`,
      };

      return NextResponse.json({
        success: true,
        provider: 'toss',
        paymentId: payment.id,
        paymentData: tossPaymentData,
      });
    } else {
      // Stripe integration
      const stripePaymentData = {
        paymentId: payment.id,
        amount: currency === 'jpy' ? amount : Math.round(amount * 100), // Stripe uses cents
        currency,
        productName: product.name[locale as 'ko' | 'ja' | 'en'] || product.name.en,
        customerEmail: user.email,
        successUrl: `${process.env.NEXT_PUBLIC_SITE_URL}/api/payment/stripe/success?session_id={CHECKOUT_SESSION_ID}`,
        cancelUrl: `${process.env.NEXT_PUBLIC_SITE_URL}/api/payment/stripe/cancel`,
      };

      return NextResponse.json({
        success: true,
        provider: 'stripe',
        paymentId: payment.id,
        paymentData: stripePaymentData,
      });
    }
  } catch (error) {
    console.error('Payment creation error:', error);
    return NextResponse.json(
      { error: 'Payment creation failed' },
      { status: 500 }
    );
  }
}
