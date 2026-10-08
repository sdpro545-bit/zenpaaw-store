import { NextResponse } from 'next/server';
import { verifyAdminSession } from '@/lib/auth';
import { storeConfig } from '@/store.config';

export async function GET() {
  return NextResponse.json({ config: storeConfig });
}

export async function PUT(req: Request) {
  const session = await verifyAdminSession(req);
  if (!session.authenticated) {
    return NextResponse.json({ error: 'Unauthorized: Admin session required' }, { status: 401 });
  }

  try {
    const updates = await req.json();
    return NextResponse.json({ success: true, updates });
  } catch {
    return NextResponse.json({ error: 'Server error updating site content' }, { status: 500 });
  }
}
