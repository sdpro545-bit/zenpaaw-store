import { NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { Review } from '@/types';

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const productId = searchParams.get('productId') || undefined;
  const reviews = db.getReviews(productId);
  return NextResponse.json({ reviews });
}

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const newReview: Review = {
      id: `rev-${Date.now()}`,
      productId: body.productId,
      author: body.author,
      rating: body.rating || 5,
      date: new Date().toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' }),
      verifiedBuyer: true,
      petName: body.petName || undefined,
      petBreed: body.petBreed || undefined,
      title: body.title || 'Great toy!',
      comment: body.comment
    };

    const created = db.addReview(newReview);
    return NextResponse.json({ success: true, review: created });
  } catch {
    return NextResponse.json({ error: 'Server error adding review' }, { status: 500 });
  }
}
