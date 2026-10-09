import { NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { z } from 'zod';

const lookupSchema = z.object({
  number: z.string().min(3),
  email: z.string().email(),
});

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const parseResult = lookupSchema.safeParse({
      number: searchParams.get('number'),
      email: searchParams.get('email'),
    });

    if (!parseResult.success) {
      return NextResponse.json(
        { error: 'Valid order number and email are required.' },
        { status: 400 }
      );
    }

    const { number, email } = parseResult.data;
    const order = db.getOrderByNumber(number);

    if (!order || order.email.toLowerCase() !== email.toLowerCase()) {
      return NextResponse.json(
        { error: 'No matching order found with the provided details.' },
        { status: 404 }
      );
    }

    // Return sanitized public tracking info only (omit internal cost/payment secrets)
    return NextResponse.json({
      order: {
        id: order.id,
        number: order.number,
        status: order.status,
        currency: order.currency,
        totalCents: order.totalCents,
        createdAt: order.createdAt,
        items: order.items.map((i) => ({
          title: i.titleSnapshot,
          qty: i.qty,
          image: i.imageSnapshot,
        })),
        shipments: order.shipments,
      },
    });
  } catch (err: any) {
    return NextResponse.json(
      { error: 'Failed to lookup order.' },
      { status: 500 }
    );
  }
}
