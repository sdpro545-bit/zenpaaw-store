import { NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { verifyAdminSession } from '@/lib/auth';

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const code = searchParams.get('code');

  // If checking a single coupon code
  if (code) {
    const coupon = db.getCouponByCode(code);
    if (!coupon) {
      return NextResponse.json({ valid: false, message: 'Invalid coupon code' }, { status: 404 });
    }
    return NextResponse.json({
      valid: true,
      code: coupon.code,
      type: coupon.type,
      valueCents: coupon.valueCents,
      minSubtotalCents: coupon.minSubtotalCents,
      freeShipping: coupon.freeShipping,
    });
  }

  // Listing all coupons requires admin session - anonymous requests get 401
  const session = await verifyAdminSession(req);
  if (!session.authenticated) {
    return NextResponse.json({ error: 'Unauthorized: Admin session required to list coupons' }, { status: 401 });
  }

  const coupons = db.listCoupons();
  return NextResponse.json({ coupons });
}

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const code = body.code?.trim().toUpperCase();
    if (!code) {
      return NextResponse.json({ valid: false, message: 'Coupon code required' }, { status: 400 });
    }

    const coupon = db.getCouponByCode(code);
    if (!coupon) {
      return NextResponse.json({ valid: false, message: 'Coupon code not found' });
    }

    const subtotal = body.subtotalCents !== undefined
      ? body.subtotalCents
      : Math.round((Number(body.subtotal) || 0) * 100);
    if (subtotal < coupon.minSubtotalCents) {
      const minDollars = (coupon.minSubtotalCents / 100).toFixed(2);
      return NextResponse.json({
        valid: false,
        message: `Minimum order of $${minDollars} required for this coupon`,
      });
    }

    return NextResponse.json({
      valid: true,
      coupon: {
        code: coupon.code,
        type: coupon.type,
        valueCents: coupon.valueCents,
        freeShipping: coupon.freeShipping,
      },
    });
  } catch {
    return NextResponse.json({ valid: false, message: 'Server error validating coupon' }, { status: 500 });
  }
}
