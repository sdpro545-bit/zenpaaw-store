import { NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { verifyAdminSession } from '@/lib/auth';

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const petType = searchParams.get('pet') || undefined;
  const categoryId = searchParams.get('cat') || undefined;
  const query = searchParams.get('q') || undefined;

  const products = db.getProducts({ petType, categoryId, query });
  return NextResponse.json({ products });
}

export async function POST(req: Request) {
  const session = await verifyAdminSession(req);
  if (!session.authenticated) {
    return NextResponse.json({ error: 'Unauthorized: Admin session required' }, { status: 401 });
  }

  try {
    const body = await req.json();
    if (!body.title || !body.slug) {
      return NextResponse.json({ error: 'Missing required product fields' }, { status: 400 });
    }
    // Return success
    return NextResponse.json({ success: true, product: body });
  } catch {
    return NextResponse.json({ error: 'Server error' }, { status: 500 });
  }
}

export async function PATCH(req: Request) {
  const session = await verifyAdminSession(req);
  if (!session.authenticated) {
    return NextResponse.json({ error: 'Unauthorized: Admin session required' }, { status: 401 });
  }

  try {
    const { id, ...updates } = await req.json();
    if (!id) return NextResponse.json({ error: 'Missing product ID' }, { status: 400 });
    return NextResponse.json({ success: true, id, updates });
  } catch {
    return NextResponse.json({ error: 'Server error' }, { status: 500 });
  }
}
