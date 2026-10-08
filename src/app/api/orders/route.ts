import { NextResponse } from 'next/server';
import { db } from '@/lib/db';

export async function GET() {
  const orders = db.getOrders();
  return NextResponse.json({ orders });
}
