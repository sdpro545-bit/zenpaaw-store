import React from 'react';
import { notFound } from 'next/navigation';
import Link from 'next/link';
import { db } from '@/lib/db';
import { ProductCard } from '@/components/ProductCard';
import { RevealText } from '@/components/RevealText';
import { ChevronRight, Filter } from 'lucide-react';
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
  params: Promise<{ pet: string }>;
}): Promise<Metadata> {
  const { pet } = await params;
  const petName = VALID_PETS[pet.toLowerCase()];
  if (!petName) return { title: 'Category Not Found | ZenPaaw' };

  return {
    title: `${petName} Toys | ZenPaaw Marketplace`,
    description: `Shop verified, durable pet toys designed for ${petName.toLowerCase()}. Free shipping over $35 and 30-day returns.`,
  };
}

export default async function PetCategoryPage({
  params,
}: {
  params: Promise<{ pet: string }>;
}) {
  const { pet } = await params;
  const petName = VALID_PETS[pet.toLowerCase()];

  if (!petName) {
    notFound();
  }

  const products = db.getProducts({ petType: petName, status: 'active' });
  const allCategories = db.getCategories();

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
        <span className="text-[#162624] font-bold">{petName}</span>
      </nav>

      {/* Hero Header */}
      <div className="bg-[#0C534E] text-white rounded-3xl p-8 sm:p-12 relative overflow-hidden shadow-xl">
        <div className="relative z-10 max-w-xl space-y-3">
          <span className="text-xs font-black uppercase tracking-widest text-[#FFC800]">
            Catalog • {products.length} Toys Available
          </span>
          <RevealText as="h1" className="text-3xl sm:text-5xl font-black text-white">
            {petName} Toys
          </RevealText>
          <p className="text-sm text-[#D3E8E6] leading-relaxed">
            Durable chew toys, interactive puzzles, and enrichment gear designed for {petName.toLowerCase()}.
          </p>
        </div>
      </div>

      {/* Product Grid */}
      <div className="space-y-6">
        <div className="flex items-center justify-between text-xs font-bold text-gray-500 border-b border-gray-100 pb-4">
          <span>Showing {products.length} products</span>
          <Link
            href={`/shop?pet=${pet.toLowerCase()}`}
            className="flex items-center gap-1.5 text-[#0C534E] hover:underline"
          >
            <Filter className="w-3.5 h-3.5" />
            <span>Faceted Filter View</span>
          </Link>
        </div>

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
      </div>
    </div>
  );
}
