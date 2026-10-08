import { NextResponse } from 'next/server';
import { db } from '@/lib/db';

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const productId = searchParams.get('productId');

  if (!productId) {
    return NextResponse.json({ reviews: [] });
  }

  const reviews = db.getReviewsByProductId(productId);
  return NextResponse.json({ reviews });
}

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { productId, orderNumber, rating, title, body: reviewBody } = body;

    if (!productId || !orderNumber || !rating) {
      return NextResponse.json(
        { error: 'Reviews require verified delivered order details' },
        { status: 400 }
      );
    }

    // Verify order exists in delivered status
    const order = db.getOrderByNumber(orderNumber);
    if (!order || order.status !== 'delivered') {
      return NextResponse.json(
        { error: 'Reviews are only permitted for confirmed, delivered purchases' },
        { status: 403 }
      );
    }

    return NextResponse.json({
      success: true,
      message: 'Review submitted for moderation',
    });
  } catch {
    return NextResponse.json({ error: 'Server error adding review' }, { status: 500 });
  }
}
