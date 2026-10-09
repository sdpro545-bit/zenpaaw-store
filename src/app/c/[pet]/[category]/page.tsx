import React from 'react';
import { notFound } from 'next/navigation';
import Link from 'next/link';
import { db } from '@/lib/db';
import { ProductCard } from '@/components/ProductCard';
import { RevealText } from '@/components/RevealText';
import { ChevronRight } from 'lucide-react';
import type { Metadata } from 'next';

const VALID_PETS: Record<string, string> = {
  dogs: 'Dogs',
  puppies: 'Puppies',
  cats: 'Cats',
};
export const instant = false;

export async function generateMetadata({
  params,
}: {
  params: Promise<{ pet: string; category: string }>;
}): Promise<Metadata> {
  const { pet, category } = await params;
  const petName = VALID_PETS[pet.toLowerCase()];
  const categoryTitle = category.replace(/-/g, ' ');

  return {
    title: `${categoryTitle} for ${petName || 'Pets'} | ZenPaaw`,
    description: `Shop verified ${categoryTitle} for ${petName}. Every order ships with tracking and 30-day returns.`,
  };
}

export default async function SubCategoryPage({
  params,
}: {
  params: Promise<{ pet: string; category: string }>;
}) {
  const { pet, category } = await params;
  const petName = VALID_PETS[pet.toLowerCase()];

  if (!petName) {
    notFound();
  }

  // Filter products by pet and matching category
  const products = db
    .getProducts({ petType: petName, status: 'active' })
    .filter(
      (p) =>
        p.categoryId.toLowerCase().includes(category.toLowerCase()) ||
        category.toLowerCase().includes(p.categoryId.toLowerCase())
    );

  const categoryTitle = category.replace(/-/g, ' ');

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12 space-y-8">
      {/* Breadcrumb */}
      <nav aria-label="Breadcrumb" className="flex items-center gap-2 text-xs text-gray-500 font-medium">
        <Link href="/" className="hover:text-[#0C534E]">
          Home
        </Link>
        <ChevronRight className="w-3.5 h-3.5" />
        <Link href={`/c/${pet.toLowerCase()}`} className="hover:text-[#0C534E]">
          {petName}
        </Link>
        <ChevronRight className="w-3.5 h-3.5" />
        <span className="text-[#162624] font-bold capitalize">{categoryTitle}</span>
      </nav>

      {/* Header */}
      <div className="bg-[#0C534E] text-white rounded-3xl p-8 sm:p-12 relative overflow-hidden shadow-xl">
        <div className="relative z-10 max-w-xl space-y-3">
          <span className="text-xs font-black uppercase tracking-widest text-[#FFC800]">
            {petName} Category • {products.length} Products
          </span>
          <RevealText as="h1" className="text-3xl sm:text-5xl font-black text-white capitalize">
            {categoryTitle}
          </RevealText>
          <p className="text-sm text-[#D3E8E6] leading-relaxed">
            Verified materials, direct pricing, and tracked shipping for {petName.toLowerCase()}.
          </p>
        </div>
      </div>

      {/* Products */}
      <div className="space-y-6">
        <div className="flex items-center justify-between text-xs font-bold text-gray-500 border-b border-gray-100 pb-4">
          <span>Showing {products.length} products</span>
        </div>

        {products.length === 0 ? (
          <div className="text-center py-16 bg-[#FAFBF9] rounded-3xl border border-gray-100 p-8 space-y-4">
            <h3 className="text-xl font-black text-[#162624]">No toys in this specific filter</h3>
            <p className="text-xs text-gray-500 max-w-sm mx-auto">
              Try exploring our broader {petName} catalog to see all active options.
            </p>
            <Link
              href={`/c/${pet.toLowerCase()}`}
              className="inline-block px-6 py-3 rounded-full bg-[#0C534E] text-[#FFC800] text-xs font-black uppercase tracking-wider"
            >
              View All {petName} Toys
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6">
            {products.map((p) => {
              const minPrice = Math.min(...p.variants.map((v) => v.priceCents)) / 100;
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
        )}
      </div>
    </div>
  );
}
