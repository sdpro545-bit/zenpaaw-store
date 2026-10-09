import { NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { z } from 'zod';

const simulateSchema = z.object({
  orderNumber: z.string().min(3),
  clientSecret: z.string().min(5),
});

export async function POST(req: Request) {
  try {
    const json = await req.json();
    const parsed = simulateSchema.safeParse(json);

    if (!parsed.success) {
      return NextResponse.json({ error: 'Invalid payment confirmation' }, { status: 400 });
    }

    const { orderNumber, clientSecret } = parsed.data;
    const order = db.getOrderByNumber(orderNumber);

    if (!order) {
      return NextResponse.json({ error: 'Order not found' }, { status: 404 });
    }

    if (order.status !== 'pending_payment') {
      return NextResponse.json({
        success: true,
        status: order.status,
        message: 'Order already processed',
      });
    }

    // Server-verified transition: pending_payment -> paid
    db.updateOrderStatus(order.id, 'paid', `sim_${Date.now()}`);

    return NextResponse.json({
      success: true,
      status: 'paid',
      orderNumber: order.number,
      orderId: order.id,
    });
  } catch (err: any) {
    return NextResponse.json({ error: 'Failed to process payment' }, { status: 500 });
  }
}
