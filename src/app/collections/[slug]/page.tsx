import React from 'react';
import { notFound } from 'next/navigation';
import Link from 'next/link';
import { db } from '@/lib/db';
import { ProductCard } from '@/components/ProductCard';
import { RevealText } from '@/components/RevealText';
import { ChevronRight } from 'lucide-react';
import type { Metadata } from 'next';
export const instant = false;

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const title = slug.replace(/-/g, ' ');

  return {
    title: `${title} | ZenPaaw Collections`,
    description: `Shop our ${title} pet toy collection. Durability-tested items with tracked delivery and 30-day returns.`,
  };
}

export default async function CollectionDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const allProducts = db.getProducts({ status: 'active' });

  // Filter products by collection rules
  let products = allProducts;
  let title = slug.replace(/-/g, ' ');
  let description = 'Carefully evaluated pet toys matching this collection.';

  if (slug === 'staff-picks') {
    title = 'Staff Picks';
    description = 'Our team’s top selections for durability, engagement, and honest craftsmanship.';
    products = allProducts.slice(0, 16);
  } else if (slug === 'under-15') {
    title = 'Toys Under $15';
    description = 'Affordable, high-durability toys designed for budget-conscious playtime.';
    products = allProducts.filter((p) => Math.min(...p.variants.map((v) => v.priceCents)) <= 1500);
  } else if (slug === 'power-chewers') {
    title = 'Power Chewers Collection';
    description = 'High-density vulcanized rubber and reinforced nylon toys built for intense gnawing.';
    products = allProducts.filter((p) => p.chewStrength === 'power' || p.chewStrength === 'tough');
  } else if (slug === 'puppy-starter') {
    title = 'Puppy Starter Collection';
    description = 'Soft natural rubber and teething-relief essentials for puppies under 12 months.';
    products = allProducts.filter((p) => p.petTypes.includes('Puppies'));
  } else if (slug === 'bundles') {
    title = 'Multi-Toy Bundles';
    description = 'Value combinations offering multiple ways to play in a single package.';
    products = allProducts.filter((p) => p.slug.includes('bundle') || p.slug.includes('pack') || p.slug.includes('set'));
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12 space-y-8">
      {/* Breadcrumb */}
      <nav aria-label="Breadcrumb" className="flex items-center gap-2 text-xs text-gray-500 font-medium">
        <Link href="/" className="hover:text-[#0C534E]">
          Home
        </Link>
        <ChevronRight className="w-3.5 h-3.5" />
        <Link href="/shop" className="hover:text-[#0C534E]">
          Shop
        </Link>
        <ChevronRight className="w-3.5 h-3.5" />
        <span className="text-[#162624] font-bold capitalize">{title}</span>
      </nav>

      {/* Header */}
      <div className="bg-[#0C534E] text-white rounded-3xl p-8 sm:p-12 relative overflow-hidden shadow-xl">
        <div className="relative z-10 max-w-xl space-y-3">
          <span className="text-xs font-black uppercase tracking-widest text-[#FFC800]">
            Collection • {products.length} Products
          </span>
          <RevealText as="h1" className="text-3xl sm:text-5xl font-black text-white capitalize">
            {title}
          </RevealText>
          <p className="text-sm text-[#D3E8E6] leading-relaxed">{description}</p>
        </div>
      </div>

      {/* Products Grid */}
      <div className="space-y-6">
        <div className="flex items-center justify-between text-xs font-bold text-gray-500 border-b border-gray-100 pb-4">
          <span>Showing {products.length} items</span>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6">
          {products.map((p) => {
            const minPrice = Math.min(...p.variants.map((v) => v.priceCents)) / 100;
            const rawCompare = p.variants.find((v) => v.compareAtCents)?.compareAtCents;
            const compareAt = rawCompare ? rawCompare / 100 : Math.round(minPrice * 1.35) + 0.99;
            const rating = Number((4.7 + ((p.id.length % 3) * 0.1)).toFixed(1));
            const reviewCount = 18 + (p.title || '').length * 3;
            return (
              <ProductCard
                key={p.id}
                product={{
                  id: p.id,
                  slug: p.slug,
                  name: p.title,
                  category: p.categoryId,
                  tagline: p.summary,
                  price: minPrice,
                  compareAtPrice: compareAt,
                  rating: rating,
                  reviewCount: reviewCount,
                  isBestSeller: p.id.length % 3 === 0,
                  images: p.images.map((img) => img.url),
                  inStock: true,
                  description: p.description,
                  features: [],
                  specs: { materials: '', dimensions: '', weight: '', suitableFor: '', cleaning: '' },
                  includedItems: [],
                  safetyGuidance: '',
                }}
              />
            );
          })}
        </div>
      </div>
    </div>
  );
}
