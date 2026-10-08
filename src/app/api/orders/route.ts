import { NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { verifyAdminSession } from '@/lib/auth';

export async function GET(req: Request) {
  // Session check - anonymous requests must get 401
  const session = await verifyAdminSession(req);
  if (!session.authenticated) {
    return NextResponse.json({ error: 'Unauthorized: Admin session required' }, { status: 401 });
  }

  const { searchParams } = new URL(req.url);
  const status = searchParams.get('status') || undefined;
  const limit = searchParams.get('limit') ? parseInt(searchParams.get('limit')!, 10) : 50;

  const orders = db.getOrders({ status, limit });
  return NextResponse.json({ orders });
}
