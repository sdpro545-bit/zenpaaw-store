import { NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { Product } from '@/types';

export async function GET() {
  const products = db.getProducts();
  return NextResponse.json({ products });
}

export async function POST(req: Request) {
  try {
    const newProduct: Product = await req.json();
    if (!newProduct.id || !newProduct.name || !newProduct.price) {
      return NextResponse.json({ error: 'Missing required product fields' }, { status: 400 });
    }
    const created = db.addProduct(newProduct);
    return NextResponse.json({ success: true, product: created });
  } catch {
    return NextResponse.json({ error: 'Server error' }, { status: 500 });
  }
}

export async function PATCH(req: Request) {
  try {
    const { id, ...updates } = await req.json();
    if (!id) return NextResponse.json({ error: 'Missing product ID' }, { status: 400 });

    const updated = db.updateProduct(id, updates);
    if (!updated) return NextResponse.json({ error: 'Product not found' }, { status: 404 });

    return NextResponse.json({ success: true, product: updated });
  } catch {
    return NextResponse.json({ error: 'Server error' }, { status: 500 });
  }
}
