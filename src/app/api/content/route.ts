import { NextResponse } from 'next/server';
import { db } from '@/lib/db';

export async function GET() {
  const content = db.getContent();
  return NextResponse.json({ content });
}

export async function PUT(req: Request) {
  try {
    const updates = await req.json();
    const updated = db.updateContent(updates);
    return NextResponse.json({ success: true, content: updated });
  } catch {
    return NextResponse.json({ error: 'Server error updating site content' }, { status: 500 });
  }
}
