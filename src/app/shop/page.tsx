'use client';

import React, { useState, useMemo } from 'react';
import { initialProducts } from '@/data/products';
import { ProductCard } from '@/components/ProductCard';
import { Search, SlidersHorizontal, Sparkles } from 'lucide-react';

export default function ShopPage() {
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [searchQuery, setSearchQuery] = useState('');
  const [sortBy, setSortBy] = useState<'featured' | 'price-asc' | 'price-desc' | 'rating'>('featured');

  const categories = [
    'All',
    'Dog Toys',
    'Chew Toys',
    'Interactive Toys',
    'Fetch & Outdoor',
    'Best Sellers'
  ];

  const filteredProducts = useMemo(() => {
    return initialProducts
      .filter((p) => {
        const matchesCategory =
          selectedCategory === 'All'
            ? true
            : selectedCategory === 'Best Sellers'
            ? p.isBestSeller
            : p.category === selectedCategory;

        const matchesQuery =
          p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
          p.tagline.toLowerCase().includes(searchQuery.toLowerCase()) ||
          p.description.toLowerCase().includes(searchQuery.toLowerCase());

        return matchesCategory && matchesQuery;
      })
      .sort((a, b) => {
        if (sortBy === 'price-asc') return a.price - b.price;
        if (sortBy === 'price-desc') return b.price - a.price;
        if (sortBy === 'rating') return b.rating - a.rating;
        // featured: flagship first, then bestseller
        if (a.isFlagship) return -1;
        if (b.isFlagship) return 1;
        return 0;
      });
  }, [selectedCategory, searchQuery, sortBy]);

  return (
    <div className="bg-[#FAFBF9] min-h-screen py-10 sm:py-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        {/* Page Header Banner */}
        <div className="bg-[#0C534E] text-white rounded-3xl p-8 sm:p-12 relative overflow-hidden shadow-xl">
          <div className="absolute top-0 right-0 w-80 h-80 bg-[#FFC800] organic-shape-yellow opacity-20 pointer-events-none -mr-20 -mt-20" />
          <div className="relative z-10 max-w-xl space-y-3">
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/10 text-[#FFC800] text-xs font-black uppercase tracking-widest">
              <Sparkles className="w-3.5 h-3.5" />
              <span>Full Collection</span>
            </span>
            <h1 className="text-3xl sm:text-5xl font-black tracking-tight text-white">
              Shop Pet Toys
            </h1>
            <p className="text-sm sm:text-base text-[#D3E8E6] font-medium leading-relaxed">
              Explore our line of carefully selected toys designed for everyday fetch, dental chewing, and interactive mental stimulation.
            </p>
          </div>
        </div>

        {/* Filter Controls Bar */}
        <div className="flex flex-col md:flex-row items-center justify-between gap-4 pt-2">
          {/* Category Tabs */}
          <div className="flex items-center gap-2 overflow-x-auto w-full md:w-auto pb-2 md:pb-0 scrollbar-none">
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`px-4 py-2 rounded-full text-xs font-bold whitespace-nowrap transition-all ${
                  selectedCategory === cat
                    ? 'bg-[#0C534E] text-[#FFC800] shadow-md shadow-[#0C534E]/20'
                    : 'bg-white text-[#162624] hover:bg-gray-100 border border-gray-200'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>

          {/* Search & Sort Filters */}
          <div className="flex items-center gap-3 w-full md:w-auto">
            {/* Search Input */}
            <div className="relative flex-1 md:w-64">
              <Search className="w-4 h-4 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                placeholder="Search toys..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-9 pr-3 py-2 rounded-full bg-white border border-gray-200 text-xs font-medium outline-none focus:border-[#0C534E]"
              />
            </div>

            {/* Sort Select */}
            <div className="relative shrink-0">
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value as any)}
                aria-label="Sort products"
                className="pl-3 pr-8 py-2 rounded-full bg-white border border-gray-200 text-xs font-bold text-[#162624] outline-none focus:border-[#0C534E] appearance-none cursor-pointer"
              >
                <option value="featured">Featured First</option>
                <option value="price-asc">Price: Low to High</option>
                <option value="price-desc">Price: High to Low</option>
                <option value="rating">Top Rated</option>
              </select>
              <SlidersHorizontal className="w-3.5 h-3.5 text-gray-400 absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none" />
            </div>
          </div>
        </div>

        {/* Results Counter */}
        <div className="text-xs text-gray-500 font-medium">
          Showing <strong className="text-[#162624]">{filteredProducts.length}</strong> toys
        </div>

        {/* Products Grid */}
        {filteredProducts.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {filteredProducts.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        ) : (
          <div className="text-center py-20 bg-white rounded-3xl border border-gray-100 p-8">
            <h3 className="text-lg font-black text-[#162624]">No toys found</h3>
            <p className="text-xs text-gray-500 mt-1 mb-4">
              Try adjusting your search or category filters.
            </p>
            <button
              onClick={() => {
                setSelectedCategory('All');
                setSearchQuery('');
              }}
              className="px-5 py-2.5 rounded-full bg-[#0C534E] text-[#FFC800] text-xs font-bold"
            >
              Reset Filters
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
