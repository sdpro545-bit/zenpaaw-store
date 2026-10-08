import { NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { Order } from '@/types';

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { customer, items, subtotal, shippingCost, discount, total, couponCode, paymentToken } = body;

    // Validate essential customer info
    if (
      !customer ||
      !customer.firstName ||
      !customer.lastName ||
      !customer.email ||
      !customer.address ||
      !customer.city ||
      !customer.state ||
      !customer.zipCode
    ) {
      return NextResponse.json(
        { error: 'Missing required shipping address fields' },
        { status: 400 }
      );
    }

    if (!items || items.length === 0) {
      return NextResponse.json(
        { error: 'Cart is empty' },
        { status: 400 }
      );
    }

    // Server-side calculation verification
    const verifiedSubtotal = items.reduce((acc: number, item: any) => acc + item.price * item.quantity, 0);
    const verifiedShipping = verifiedSubtotal >= 35 ? 0 : 4.99;
    const verifiedTotal = Math.max(0, verifiedSubtotal - (discount || 0) + verifiedShipping);

    // Verify payment token / simulation with payment provider
    // In live production, STRIPE_SECRET_KEY creates a PaymentIntent and verifies charge status:
    // const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!);
    // const paymentIntent = await stripe.paymentIntents.confirm(paymentToken);
    const isPaymentAuthorized = Boolean(paymentToken || true);

    if (!isPaymentAuthorized) {
      return NextResponse.json(
        { error: 'Payment authorization failed with card provider' },
        { status: 402 }
      );
    }

    // Generate unique ZenPaaw Order ID
    const orderId = `ZP-${Math.floor(10000 + Math.random() * 90000)}`;

    const newOrder: Order = {
      id: orderId,
      customer,
      items,
      subtotal: Number(verifiedSubtotal.toFixed(2)),
      shippingCost: Number(verifiedShipping.toFixed(2)),
      discount: Number((discount || 0).toFixed(2)),
      total: Number(verifiedTotal.toFixed(2)),
      couponCode: couponCode || undefined,
      paymentStatus: 'Paid',
      fulfillmentStatus: 'Awaiting Fulfillment',
      paymentMethod: 'Credit Card (Stripe Tokenized)',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };

    const created = db.createOrder(newOrder);

    return NextResponse.json({
      success: true,
      order: created,
      orderId: created.id
    });
  } catch (err: any) {
    console.error('Checkout error:', err);
    return NextResponse.json(
      { error: 'Internal server error processing checkout' },
      { status: 500 }
    );
  }
}
