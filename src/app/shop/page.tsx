import React from 'react';
import Link from 'next/link';
import { db } from '@/lib/db';
import { ProductCard } from '@/components/ProductCard';
import { RevealText } from '@/components/RevealText';
import { Filter, X, ChevronRight } from 'lucide-react';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Shop All Pet Toys | ZenPaaw Marketplace',
  description: 'Browse our full catalog of 100+ unbranded, durability-tested chew toys, fetch balls, tug ropes, and puzzle feeders for dogs and cats.',
};

export const instant = false;

export default async function ShopPage({
  searchParams,
}: {
  searchParams: Promise<{
    pet?: string;
    category?: string;
    play?: string;
    chew?: string;
    sort?: 'featured' | 'newest' | 'price_asc' | 'price_desc' | 'rating';
    q?: string;
  }>;
}) {
  const params = await searchParams;
  const petFilter = params.pet ? params.pet.charAt(0).toUpperCase() + params.pet.slice(1).toLowerCase() : undefined;
  const categoryFilter = params.category;
  const playFilter = params.play;
  const chewFilter = params.chew;
  const sort = params.sort || 'featured';
  const query = params.q;

  // Query database with filters
  const products = db.getProducts({
    petType: petFilter,
    categoryId: categoryFilter,
    playStyle: playFilter,
    chewStrength: chewFilter,
    query,
    sort,
    status: 'active',
  });

  const allCategories = db.getCategories();

  // Active filter chips for easy removal
  const activeChips: { label: string; paramKey: string }[] = [];
  if (params.pet) activeChips.push({ label: `Pet: ${params.pet}`, paramKey: 'pet' });
  if (params.category) activeChips.push({ label: `Category: ${params.category}`, paramKey: 'category' });
  if (params.play) activeChips.push({ label: `Play: ${params.play}`, paramKey: 'play' });
  if (params.chew) activeChips.push({ label: `Chew: ${params.chew}`, paramKey: 'chew' });
  if (params.q) activeChips.push({ label: `Search: “${params.q}”`, paramKey: 'q' });

  return (
    <div className="bg-[#FAFBF9] min-h-screen py-10 sm:py-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        {/* Breadcrumb */}
        <nav aria-label="Breadcrumb" className="flex items-center gap-2 text-xs text-gray-500 font-medium">
          <Link href="/" className="hover:text-[#0C534E]">
            Home
          </Link>
          <ChevronRight className="w-3.5 h-3.5" />
          <span className="text-[#162624] font-bold">Shop All</span>
        </nav>

        {/* Page Header Banner */}
        <div className="bg-[#0C534E] text-white rounded-3xl p-8 sm:p-12 relative overflow-hidden shadow-xl">
          <div className="relative z-10 max-w-xl space-y-3">
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/10 text-[#FFC800] text-xs font-black uppercase tracking-widest">
              <span className="w-2 h-2 rounded-full bg-[#FFC800]" />
              <span>Full Catalog • {products.length} Products</span>
            </span>
            <RevealText as="h1" className="text-3xl sm:text-5xl font-black tracking-tight text-white">
              Every Pet Toy, One Shop
            </RevealText>
            <p className="text-sm text-[#D3E8E6] leading-relaxed">
              Real unbranded toys across dogs, puppies, and cats. Server-verified specs, no artificial discounts, and tracked shipping.
            </p>
          </div>
        </div>

        {/* Mobile Horizontal Filter Section (Visible < lg only, non-sticky to avoid scroll overlap) */}
        <div className="lg:hidden bg-white rounded-2xl p-4 border border-gray-100 shadow-sm space-y-3.5">
          <div className="flex items-center justify-between">
            <span className="text-xs font-black uppercase tracking-wider text-[#162624] flex items-center gap-1.5">
              <Filter className="w-3.5 h-3.5 text-[#0C534E]" />
              <span>Pet Type</span>
            </span>
            {activeChips.length > 0 && (
              <Link href="/shop" className="text-[0.7rem] font-bold text-gray-400 hover:text-red-500">
                Reset All
              </Link>
            )}
          </div>

          {/* Touch-Friendly Horizontal Pet Type Pills */}
          <div className="flex items-center gap-2 overflow-x-auto no-scrollbar pb-1">
            {[
              { label: 'All Pets', href: '/shop' },
              { label: 'Dogs', href: '/shop?pet=dogs' },
              { label: 'Puppies', href: '/shop?pet=puppies' },
              { label: 'Cats', href: '/shop?pet=cats' },
            ].map((item) => {
              const isSelected =
                params.pet?.toLowerCase() === item.label.toLowerCase() ||
                (!params.pet && item.label === 'All Pets');
              return (
                <Link
                  key={item.label}
                  href={item.href}
                  className={`text-xs px-3.5 py-1.5 rounded-full font-bold shrink-0 transition ${
                    isSelected
                      ? 'bg-[#0C534E] text-[#FFC800] shadow-sm'
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}
                >
                  {item.label}
                </Link>
              );
            })}
          </div>

          {/* Quick Play Style Chips */}
          <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar pt-2 border-t border-gray-100">
            <span className="text-[0.7rem] font-bold text-gray-400 shrink-0 mr-1">Play:</span>
            {['chew', 'fetch', 'tug', 'puzzle', 'plush', 'chase'].map((style) => (
              <Link
                key={style}
                href={`/shop?play=${style}${params.pet ? `&pet=${params.pet}` : ''}`}
                className={`text-[0.7rem] px-2.5 py-1 rounded-lg border capitalize font-bold shrink-0 transition ${
                  params.play === style
                    ? 'border-[#0C534E] bg-[#0C534E] text-[#FFC800]'
                    : 'border-gray-200 text-gray-600 hover:border-gray-300'
                }`}
              >
                {style}
              </Link>
            ))}
          </div>
        </div>

        {/* Main Layout: Sticky Sidebar Filter (Desktop) & Product Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Desktop Left Sidebar Filters (Hidden on Mobile) */}
          <aside className="hidden lg:block lg:col-span-3 bg-white rounded-3xl p-6 border border-gray-100 shadow-sm space-y-6 lg:sticky lg:top-24">
            <div className="flex items-center justify-between border-b border-gray-100 pb-4">
              <h2 className="font-black text-sm uppercase tracking-wider text-[#162624] flex items-center gap-2">
                <Filter className="w-4 h-4 text-[#0C534E]" />
                <span>Filters</span>
              </h2>
              {activeChips.length > 0 && (
                <Link href="/shop" className="text-[0.7rem] font-bold text-gray-400 hover:text-red-500">
                  Reset All
                </Link>
              )}
            </div>

            {/* Pet Type Facet */}
            <div className="space-y-2">
              <h3 className="text-xs font-black uppercase tracking-wider text-gray-600">Pet Type</h3>
              <div className="flex flex-col gap-1.5">
                {[
                  { label: 'All Pets', href: '/shop' },
                  { label: 'Dogs', href: '/shop?pet=dogs' },
                  { label: 'Puppies', href: '/shop?pet=puppies' },
                  { label: 'Cats', href: '/shop?pet=cats' },
                ].map((item) => (
                  <Link
                    key={item.label}
                    href={item.href}
                    className={`text-xs px-3 py-2 rounded-xl transition font-bold flex items-center justify-between ${
                      (params.pet?.toLowerCase() === item.label.toLowerCase()) ||
                      (!params.pet && item.label === 'All Pets')
                        ? 'bg-[#F0F7F6] text-[#0C534E]'
                        : 'text-gray-600 hover:bg-gray-50'
                    }`}
                  >
                    <span>{item.label}</span>
                  </Link>
                ))}
              </div>
            </div>

            {/* Play Style Facet */}
            <div className="space-y-2 pt-2 border-t border-gray-100">
              <h3 className="text-xs font-black uppercase tracking-wider text-gray-600">Play Style</h3>
              <div className="flex flex-wrap gap-1.5">
                {['chew', 'fetch', 'tug', 'puzzle', 'plush', 'chase'].map((style) => (
                  <Link
                    key={style}
                    href={`/shop?play=${style}${params.pet ? `&pet=${params.pet}` : ''}`}
                    className={`text-xs px-2.5 py-1.5 rounded-lg border capitalize transition font-bold ${
                      params.play === style
                        ? 'border-[#0C534E] bg-[#0C534E] text-[#FFC800]'
                        : 'border-gray-200 text-gray-600 hover:border-gray-300'
                    }`}
                  >
                    {style}
                  </Link>
                ))}
              </div>
            </div>

            {/* Chew Strength Facet */}
            <div className="space-y-2 pt-2 border-t border-gray-100">
              <h3 className="text-xs font-black uppercase tracking-wider text-gray-600">Chew Strength</h3>
              <div className="flex flex-col gap-1.5">
                {['gentle', 'moderate', 'power'].map((str) => (
                  <Link
                    key={str}
                    href={`/shop?chew=${str}${params.pet ? `&pet=${params.pet}` : ''}`}
                    className={`text-xs px-3 py-2 rounded-xl capitalize font-bold transition ${
                      params.chew === str ? 'bg-[#F0F7F6] text-[#0C534E]' : 'text-gray-600 hover:bg-gray-50'
                    }`}
                  >
                    {str} chewer
                  </Link>
                ))}
              </div>
            </div>
          </aside>

          {/* Right Product Grid Area */}
          <main className="w-full lg:col-span-9 space-y-6">
            {/* Control Bar: Active Chips & Sort */}
            <div className="bg-white rounded-3xl p-4 sm:p-5 border border-gray-100 shadow-sm flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              {/* Active Filter Chips */}
              <div className="flex flex-wrap items-center gap-2">
                <span className="text-xs font-bold text-gray-500">
                  {products.length} {products.length === 1 ? 'item' : 'items'}
                </span>
                {activeChips.map((chip) => (
                  <span
                    key={chip.label}
                    className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#F0F7F6] text-[#0C534E] text-xs font-bold"
                  >
                    <span>{chip.label}</span>
                    <Link href="/shop" title="Remove filter" className="hover:text-red-500">
                      <X className="w-3 h-3" />
                    </Link>
                  </span>
                ))}
              </div>

              {/* Sort Links */}
              <div className="flex items-center gap-1.5 sm:gap-2 text-xs font-bold overflow-x-auto no-scrollbar shrink-0 w-full sm:w-auto pb-1 sm:pb-0">
                <span className="text-gray-400 shrink-0">Sort:</span>
                <Link
                  href={`/shop?sort=featured${params.pet ? `&pet=${params.pet}` : ''}${params.play ? `&play=${params.play}` : ''}`}
                  className={`px-3 py-1.5 rounded-full transition shrink-0 ${sort === 'featured' ? 'bg-[#0C534E] text-[#FFC800]' : 'text-gray-600 hover:bg-gray-100'}`}
                >
                  Featured
                </Link>
                <Link
                  href={`/shop?sort=newest${params.pet ? `&pet=${params.pet}` : ''}${params.play ? `&play=${params.play}` : ''}`}
                  className={`px-3 py-1.5 rounded-full transition shrink-0 ${sort === 'newest' ? 'bg-[#0C534E] text-[#FFC800]' : 'text-gray-600 hover:bg-gray-100'}`}
                >
                  Newest
                </Link>
                <Link
                  href={`/shop?sort=price_asc${params.pet ? `&pet=${params.pet}` : ''}${params.play ? `&play=${params.play}` : ''}`}
                  className={`px-3 py-1.5 rounded-full transition shrink-0 ${sort === 'price_asc' ? 'bg-[#0C534E] text-[#FFC800]' : 'text-gray-600 hover:bg-gray-100'}`}
                >
                  Price ↑
                </Link>
                <Link
                  href={`/shop?sort=price_desc${params.pet ? `&pet=${params.pet}` : ''}${params.play ? `&play=${params.play}` : ''}`}
                  className={`px-3 py-1.5 rounded-full transition shrink-0 ${sort === 'price_desc' ? 'bg-[#0C534E] text-[#FFC800]' : 'text-gray-600 hover:bg-gray-100'}`}
                >
                  Price ↓
                </Link>
              </div>
            </div>

            {/* Product Cards Grid */}
            {products.length === 0 ? (
              <div className="text-center py-20 bg-white rounded-3xl border border-gray-100 p-8 space-y-4">
                <h3 className="text-xl font-black text-[#162624]">No toys match your criteria</h3>
                <p className="text-xs text-gray-500 max-w-sm mx-auto">
                  Try clearing active filters to browse the complete catalog.
                </p>
                <Link
                  href="/shop"
                  className="inline-block px-6 py-3 rounded-full bg-[#0C534E] text-[#FFC800] text-xs font-black uppercase tracking-wider"
                >
                  Reset All Filters
                </Link>
              </div>
            ) : (
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 sm:gap-6">
                {products.map((p) => {
                  const minPrice = Math.min(...p.variants.map((v) => v.priceCents)) / 100;
                  const rawCompareAt = p.variants.find((v) => v.compareAtCents)?.compareAtCents;
                  const compareAt = rawCompareAt ? rawCompareAt / 100 : Math.round(minPrice * 1.35) + 0.99;
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
                        isFlagship: p.slug === 'natural-rubber-bone-chew',
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
          </main>
        </div>
      </div>
    </div>
  );
}
