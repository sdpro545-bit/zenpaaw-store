import { NextResponse } from 'next/server';
import { db } from '@/lib/db';

export async function GET() {
  const coupons = db.getCoupons();
  return NextResponse.json({ coupons });
}

export async function POST(req: Request) {
  try {
    const { code, subtotal } = await req.json();
    if (!code) {
      return NextResponse.json({ valid: false, message: 'Coupon code required' }, { status: 400 });
    }

    const result = db.validateCoupon(code, subtotal || 0);
    return NextResponse.json(result);
  } catch {
    return NextResponse.json({ valid: false, message: 'Server error' }, { status: 500 });
  }
}
