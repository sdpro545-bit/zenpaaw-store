import React from 'react';
import Link from 'next/link';
import { db } from '@/lib/db';
import { ProductCard } from '@/components/ProductCard';
import { RevealText } from '@/components/RevealText';
import { Search, ChevronRight } from 'lucide-react';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Search Pet Toys | ZenPaaw',
  description: 'Search our full catalog of 100+ unbranded, durable pet toys.',
};

export const instant = false;

export default async function SearchPage({
  searchParams,
}: {
  searchParams: Promise<{ q?: string }>;
}) {
  const { q = '' } = await searchParams;
  const term = q.trim();

  const products = term
    ? db.getProducts({ query: term, status: 'active' })
    : [];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12 space-y-8">
      {/* Breadcrumb */}
      <nav aria-label="Breadcrumb" className="flex items-center gap-2 text-xs text-gray-500 font-medium">
        <Link href="/" className="hover:text-[#0C534E]">
          Home
        </Link>
        <ChevronRight className="w-3.5 h-3.5" />
        <span className="text-[#162624] font-bold">Search</span>
      </nav>

      {/* Search Header */}
      <div className="bg-[#FAFBF9] rounded-3xl p-8 sm:p-12 border border-[#E2EBEA] space-y-6">
        <div>
          <span className="text-xs font-black uppercase tracking-widest text-[#0C534E]">
            Catalog Search
          </span>
          <RevealText as="h1" className="text-3xl sm:text-4xl font-black text-[#162624] mt-1">
            {term ? `Results for “${term}”` : 'Search Pet Toys'}
          </RevealText>
          <p className="text-sm text-gray-600 mt-1">
            {term
              ? `Found ${products.length} products matching your query.`
              : 'Type a toy name, material, or play style to search our verified catalog.'}
          </p>
        </div>

        {/* Search Input Bar */}
        <form action="/search" method="GET" className="max-w-xl flex gap-2">
          <div className="relative flex-1">
            <Search className="w-4 h-4 text-gray-400 absolute left-4 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              name="q"
              defaultValue={term}
              placeholder="Search by toy type (e.g. rope, ball, feather, teaser)..."
              className="w-full pl-11 pr-4 py-3.5 rounded-full bg-white border border-gray-200 text-sm outline-none focus:border-[#0C534E] shadow-sm"
            />
          </div>
          <button
            type="submit"
            className="px-6 py-3.5 rounded-full bg-[#0C534E] text-[#FFC800] font-black text-xs uppercase tracking-wider hover:bg-[#093B37] transition shadow-md shrink-0"
          >
            Search
          </button>
        </form>
      </div>

      {/* Results */}
      {term && (
        <div className="space-y-6">
          {products.length === 0 ? (
            <div className="text-center py-16 bg-[#FAFBF9] rounded-3xl border border-gray-100 p-8 space-y-4">
              <h3 className="text-lg font-black text-[#162624]">No toys found for “{term}”</h3>
              <p className="text-xs text-gray-500 max-w-sm mx-auto">
                Check spelling, try broader terms like “chew” or “fetch”, or browse by pet type.
              </p>
              <div className="flex justify-center gap-3 pt-2">
                <Link
                  href="/c/dogs"
                  className="px-5 py-2.5 rounded-full bg-white border border-gray-200 text-xs font-bold hover:bg-gray-50"
                >
                  Dog Toys
                </Link>
                <Link
                  href="/c/cats"
                  className="px-5 py-2.5 rounded-full bg-white border border-gray-200 text-xs font-bold hover:bg-gray-50"
                >
                  Cat Toys
                </Link>
              </div>
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
      )}
    </div>
  );
}
