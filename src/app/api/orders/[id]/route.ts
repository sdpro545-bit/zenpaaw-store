import { NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { verifyAdminSession } from '@/lib/auth';

export async function GET(req: Request, props: { params: Promise<{ id: string }> }) {
  const { id } = await props.params;
  const { searchParams } = new URL(req.url);
  const email = searchParams.get('email');

  // 1. Check if user has admin session
  const session = await verifyAdminSession(req);
  if (session.authenticated) {
    const order = db.getOrderById(id) || db.getOrderByNumber(id);
    if (!order) {
      return NextResponse.json({ error: 'Order not found' }, { status: 404 });
    }
    return NextResponse.json({ order });
  }

  // 2. If customer lookup, require order number plus email
  if (email) {
    const order = db.getOrderByNumberAndEmail(id, email) || (db.getOrderById(id)?.email.toLowerCase() === email.toLowerCase() ? db.getOrderById(id) : null);
    if (!order) {
      return NextResponse.json({ error: 'Order not found matching provided details' }, { status: 404 });
    }
    return NextResponse.json({ order });
  }

  // 3. Unauthorized anonymous request
  return NextResponse.json(
    { error: 'Unauthorized: Order access requires admin authentication or customer verification' },
    { status: 401 }
  );
}
