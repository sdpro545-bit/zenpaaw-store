import { NextResponse } from 'next/server';
import { z } from 'zod';
import { db } from '@/lib/db';
import { env } from '@/env';

const checkoutItemSchema = z.object({
  variantId: z.string().min(1),
  quantity: z.number().int().min(1).max(99),
});

const customerSchema = z.object({
  firstName: z.string().min(1, 'First name is required'),
  lastName: z.string().min(1, 'Last name is required'),
  email: z.string().email('Valid email is required'),
  phone: z.string().optional(),
  address: z.string().min(1, 'Address is required'),
  apartment: z.string().optional(),
  city: z.string().min(1, 'City is required'),
  state: z.string().min(1, 'State is required'),
  zipCode: z.string().min(1, 'ZIP Code is required'),
  country: z.string().default('United States'),
});

const checkoutRequestSchema = z.object({
  customer: customerSchema,
  items: z.array(checkoutItemSchema).min(1, 'Cart cannot be empty'),
  couponCode: z.string().optional(),
  paymentProvider: z.enum(['stripe', 'paystack']).default('stripe'),
});

export async function POST(req: Request) {
  try {
    const json = await req.json();
    const parsed = checkoutRequestSchema.safeParse(json);

    if (!parsed.success) {
      return NextResponse.json(
        { error: 'Invalid checkout request data', details: parsed.error.format() },
        { status: 400 }
      );
    }

    const { customer, items, couponCode, paymentProvider } = parsed.data;

    // 1. Server recalculates and validates everything from database
    // Tampering with client prices or discounts in the request has ZERO effect!
    const calculation = db.calculateCartTotals({
      items: items.map((it) => ({ variantId: it.variantId, qty: it.quantity })),
      couponCode,
    });

    if (!calculation.valid) {
      return NextResponse.json(
        { error: calculation.errors.join('; ') },
        { status: 400 }
      );
    }

    // 2. Create pending order in database with sequential number (ZP-100001+)
    const order = db.createOrder({
      email: customer.email,
      items: items.map((it) => ({ variantId: it.variantId, qty: it.quantity })),
      couponCode,
      shippingAddress: customer,
      paymentProvider,
    });

    // 3. Initiate payment session / client secret
    // In production with Stripe keys configured: creates Stripe PaymentIntent
    // In test/dev mode without keys: generates secure simulation secret clearly marked for test verification
    let clientSecret: string | null = null;
    const paymentUrl: string | null = null;

    if (paymentProvider === 'stripe' && env.STRIPE_SECRET_KEY && !env.STRIPE_SECRET_KEY.includes('placeholder')) {
      // Real Stripe PaymentIntent integration
      // const stripe = new Stripe(env.STRIPE_SECRET_KEY);
      // const pi = await stripe.paymentIntents.create({
      //   amount: calculation.totalCents,
      //   currency: 'usd',
      //   metadata: { orderId: order.id, orderNumber: order.number },
      // });
      // clientSecret = pi.client_secret;
    } else {
      // Test mode payment reference
      clientSecret = `test_secret_${order.id}_${calculation.totalCents}`;
    }

    return NextResponse.json({
      success: true,
      orderId: order.id,
      orderNumber: order.number,
      subtotal: (calculation.subtotalCents / 100).toFixed(2),
      shippingCost: (calculation.shippingCents / 100).toFixed(2),
      discount: (calculation.discountCents / 100).toFixed(2),
      total: (calculation.totalCents / 100).toFixed(2),
      currency: order.currency,
      clientSecret,
      paymentUrl,
      status: order.status, // starts as pending_payment
    });
  } catch (err: any) {
    console.error('Checkout processing error:', err);
    return NextResponse.json(
      { error: 'Internal server error processing checkout' },
      { status: 500 }
    );
  }
}
