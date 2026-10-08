'use client';

import React, { useState, useEffect } from 'react';
import { Search, X, ArrowRight } from 'lucide-react';
import Link from 'next/link';
import Image from 'next/image';
import { Product } from '@/types';
import { trackEvent } from '@/lib/analytics';

interface SearchModalProps {
  isOpen: boolean;
  onClose: () => void;
  products: Product[];
}

export const SearchModal: React.FC<SearchModalProps> = ({ isOpen, onClose, products }) => {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<Product[]>([]);

  useEffect(() => {
    if (!query.trim()) {
      setResults([]);
      return;
    }

    const q = query.toLowerCase();
    const filtered = products.filter(
      (p) =>
        p.name.toLowerCase().includes(q) ||
        p.tagline.toLowerCase().includes(q) ||
        p.category.toLowerCase().includes(q) ||
        p.description.toLowerCase().includes(q)
    );
    setResults(filtered);

    if (query.length > 2) {
      trackEvent('search', { search_term: query });
    }
  }, [query, products]);

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
      <div 
        className="w-full max-w-2xl bg-white rounded-3xl shadow-2xl border border-gray-100 overflow-hidden flex flex-col"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Search Input Bar */}
        <div className="flex items-center px-6 py-4 border-b border-gray-100 gap-3">
          <Search className="w-5 h-5 text-[#0C534E]" />
          <input
            type="text"
            placeholder="Search pet toys (e.g., 3-in-1, chew, fetch, puzzle)..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            autoFocus
            className="w-full text-base sm:text-lg outline-none text-[#162624] placeholder-gray-400 font-medium"
          />
          <button
            onClick={onClose}
            className="p-1.5 rounded-full hover:bg-gray-100 text-gray-500 hover:text-black transition"
            aria-label="Close search"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content Body */}
        <div className="max-h-[60vh] overflow-y-auto p-6">
          {query.trim() === '' ? (
            <div>
              <p className="text-xs font-bold uppercase tracking-wider text-gray-400 mb-3">Popular Searches</p>
              <div className="flex flex-wrap gap-2">
                {['3-in-1 Pet Toy', 'Chew Toys', 'Dog Toys', 'Dental Care', 'Puzzle Balls', 'Outdoor Fetch'].map((term) => (
                  <button
                    key={term}
                    onClick={() => setQuery(term)}
                    className="px-3.5 py-1.5 rounded-full bg-[#FAFBF9] border border-gray-200 text-xs font-semibold text-[#162624] hover:border-[#0C534E] hover:bg-[#F0F7F6] transition"
                  >
                    {term}
                  </button>
                ))}
              </div>
            </div>
          ) : results.length > 0 ? (
            <div className="space-y-3">
              <p className="text-xs font-bold uppercase tracking-wider text-gray-400 mb-2">
                Found {results.length} {results.length === 1 ? 'Product' : 'Products'}
              </p>
              {results.map((prod) => (
                <Link
                  key={prod.id}
                  href={`/product/${prod.slug}`}
                  onClick={onClose}
                  className="flex items-center gap-4 p-3 rounded-2xl hover:bg-[#F3F7F6] border border-transparent hover:border-[#A3D2CD] transition group"
                >
                  <div className="w-14 h-14 relative rounded-xl overflow-hidden bg-gray-50 border border-gray-100 shrink-0">
                    <Image
                      src={prod.images[0]}
                      alt={prod.name}
                      fill
                      className="object-cover group-hover:scale-105 transition"
                    />
                  </div>
                  <div className="flex-1 min-w-0">
                    <h4 className="font-bold text-sm sm:text-base text-[#162624] truncate group-hover:text-[#0C534E]">
                      {prod.name}
                    </h4>
                    <p className="text-xs text-gray-500 truncate">{prod.tagline}</p>
                    <div className="flex items-center gap-2 mt-1">
                      <span className="font-extrabold text-sm text-[#0C534E]">${prod.price.toFixed(2)}</span>
                      {prod.compareAtPrice && (
                        <span className="text-xs text-gray-400 line-through">
                          ${prod.compareAtPrice.toFixed(2)}
                        </span>
                      )}
                    </div>
                  </div>
                  <ArrowRight className="w-4 h-4 text-gray-300 group-hover:text-[#0C534E] group-hover:translate-x-1 transition" />
                </Link>
              ))}
            </div>
          ) : (
            <div className="text-center py-10">
              <div className="w-12 h-12 rounded-full bg-gray-100 text-gray-400 flex items-center justify-center mx-auto mb-3">
                <Search className="w-6 h-6" />
              </div>
              <p className="font-bold text-[#162624]">No toys found for &ldquo;{query}&rdquo;</p>
              <p className="text-xs text-gray-500 mt-1">Try searching for &quot;chew&quot;, &quot;3-in-1&quot;, or &quot;rope&quot;.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
