'use client';

import React, { useState, useEffect } from 'react';
import { Search, X, ArrowRight } from 'lucide-react';
import Link from 'next/link';
import Image from 'next/image';
import { trackEvent } from '@/lib/analytics';

interface SearchModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const SearchModal: React.FC<SearchModalProps> = ({ isOpen, onClose }) => {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!query.trim()) {
      setResults([]);
      return;
    }

    const timer = setTimeout(async () => {
      setLoading(true);
      try {
        const res = await fetch(`/api/products?q=${encodeURIComponent(query.trim())}`);
        const data = await res.json();
        if (data.products) {
          setResults(data.products.slice(0, 8));
        }
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    }, 200);

    return () => clearTimeout(timer);
  }, [query]);

  // Handle escape key
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    if (isOpen) {
      window.addEventListener('keydown', handleKeyDown);
      document.body.style.overflow = 'hidden';
    }
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      document.body.style.overflow = 'auto';
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center pt-16 sm:pt-24 px-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="bg-white rounded-3xl w-full max-w-2xl shadow-2xl border border-gray-100 overflow-hidden flex flex-col max-h-[80vh]">
        {/* Search Header Input */}
        <div className="p-4 sm:p-5 border-b border-gray-100 flex items-center gap-3">
          <Search className="w-5 h-5 text-gray-400 shrink-0" />
          <input
            type="text"
            placeholder="Search all toys (e.g. rope, bone, catnip, puzzle)..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            autoFocus
            className="w-full text-sm sm:text-base outline-none placeholder-gray-400 text-[#162624] font-medium"
          />
          {query && (
            <button
              onClick={() => setQuery('')}
              className="p-1 rounded-full text-gray-400 hover:text-gray-600"
            >
              <X className="w-4 h-4" />
            </button>
          )}
          <button
            onClick={onClose}
            className="p-2 rounded-full hover:bg-gray-100 text-gray-500 transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Results List */}
        <div className="overflow-y-auto p-4 flex-1">
          {loading && (
            <div className="py-8 text-center text-xs text-gray-400 font-bold">
              Searching database...
            </div>
          )}

          {!loading && query.trim() && results.length === 0 && (
            <div className="py-12 text-center">
              <p className="text-sm text-gray-500 font-medium">No pet toys found for &ldquo;{query}&rdquo;</p>
              <span className="text-xs text-gray-400 mt-1 block">
                Try searching for generic terms like &ldquo;chew&rdquo;, &ldquo;fetch&rdquo;, or &ldquo;wand&rdquo;.
              </span>
            </div>
          )}

          {!loading && results.length > 0 && (
            <div className="divide-y divide-gray-100">
              {results.map((product) => {
                const minPrice =
                  product.variants && product.variants.length > 0
                    ? Math.min(...product.variants.map((v: any) => v.priceCents)) / 100
                    : 14.99;
                const thumb = product.images?.[0]?.url || '/brand/zenpaaw-symbol.svg';

                return (
                  <Link
                    key={product.id}
                    href={`/product/${product.slug}`}
                    onClick={onClose}
                    className="flex items-center gap-4 py-3 px-2 rounded-2xl hover:bg-[#F0F7F6] transition group"
                  >
                    <div className="w-14 h-14 rounded-xl bg-gray-50 border border-gray-100 relative overflow-hidden shrink-0">
                      <Image
                        src={thumb}
                        alt={product.title}
                        fill
                        className="object-contain p-1"
                        sizes="56px"
                      />
                    </div>
                    <div className="flex-1 min-w-0">
                      <span className="text-[0.65rem] font-black uppercase tracking-wider text-[#0C534E]">
                        {product.categoryId}
                      </span>
                      <h4 className="text-xs sm:text-sm font-extrabold text-[#162624] group-hover:text-[#0C534E] truncate">
                        {product.title}
                      </h4>
                      <p className="text-xs text-gray-500 truncate">{product.summary}</p>
                    </div>
                    <span className="text-xs sm:text-sm font-black text-[#0C534E] tabular-nums">
                      ${minPrice.toFixed(2)}
                    </span>
                  </Link>
                );
              })}
            </div>
          )}

          {!query && (
            <div className="py-6 px-2 space-y-4">
              <span className="text-[0.68rem] font-black uppercase tracking-wider text-gray-400 block">
                Popular Searches
              </span>
              <div className="flex flex-wrap gap-2">
                {['Chew Bone', 'Cotton Rope Tug', 'Teaser Wand', 'Snuffle Mat', 'Catnip Kicker'].map(
                  (term) => (
                    <button
                      key={term}
                      onClick={() => setQuery(term)}
                      className="px-3.5 py-1.5 rounded-full bg-gray-100 hover:bg-[#F0F7F6] hover:text-[#0C534E] text-xs font-bold text-gray-600 transition"
                    >
                      {term}
                    </button>
                  )
                )}
              </div>
            </div>
          )}
        </div>

        {/* Footer Link to Full Search */}
        {query && results.length > 0 && (
          <div className="p-3 bg-[#FAFBF9] border-t border-gray-100 text-center">
            <Link
              href={`/search?q=${encodeURIComponent(query)}`}
              onClick={onClose}
              className="text-xs font-black text-[#0C534E] hover:underline flex items-center justify-center gap-1.5"
            >
              <span>View all results on search page</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>
        )}
      </div>
    </div>
  );
};
