'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Heart, Trash2, ShoppingBag, ArrowRight } from 'lucide-react';
import { useCart } from '@/context/CartContext';
import { ProductCard } from '@/components/ProductCard';

export default function WishlistPage() {
  const { addToCart } = useCart();
  const [wishlistItems, setWishlistItems] = useState<any[]>([]);

  useEffect(() => {
    try {
      const saved = localStorage.getItem('zenpaaw_wishlist');
      if (saved) {
        setWishlistItems(JSON.parse(saved));
      }
    } catch (e) {
      console.error(e);
    }
  }, []);

  const handleRemove = (id: string) => {
    const updated = wishlistItems.filter((i) => i.id !== id);
    setWishlistItems(updated);
    localStorage.setItem('zenpaaw_wishlist', JSON.stringify(updated));
  };

  const handleAddAll = () => {
    wishlistItems.forEach((item) => {
      addToCart(item, 1);
    });
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 sm:py-16 space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 border-b border-gray-100 pb-6">
        <div>
          <span className="text-xs font-black uppercase tracking-widest text-[#0C534E]">
            Saved For Later
          </span>
          <h1 className="text-3xl sm:text-4xl font-black text-[#162624] mt-1">My Wishlist</h1>
          <p className="text-xs sm:text-sm text-gray-500 mt-1">
            {wishlistItems.length} {wishlistItems.length === 1 ? 'item' : 'items'} saved in your browser.
          </p>
        </div>

        {wishlistItems.length > 0 && (
          <button
            type="button"
            onClick={handleAddAll}
            className="px-6 py-3 rounded-full bg-[#0C534E] text-[#FFC800] text-xs font-black uppercase tracking-wider flex items-center gap-2 hover:bg-[#093B37] transition shadow-md shrink-0"
          >
            <ShoppingBag className="w-4 h-4" />
            <span>Add All to Cart</span>
          </button>
        )}
      </div>

      {wishlistItems.length === 0 ? (
        <div className="text-center py-20 bg-[#FAFBF9] rounded-3xl border border-gray-100 p-8 space-y-4">
          <div className="w-16 h-16 rounded-full bg-[#F0F7F6] text-[#0C534E] flex items-center justify-center mx-auto mb-2">
            <Heart className="w-8 h-8" />
          </div>
          <h2 className="text-xl font-black text-[#162624]">Your Wishlist is Empty</h2>
          <p className="text-xs sm:text-sm text-gray-500 max-w-sm mx-auto">
            Click the heart icon on any toy card to save favorites while you browse.
          </p>
          <div className="pt-2">
            <Link
              href="/shop"
              className="inline-flex items-center gap-2 px-8 py-3.5 rounded-full bg-[#0C534E] text-[#FFC800] text-xs font-black uppercase tracking-wider hover:bg-[#093B37] transition shadow-md"
            >
              <span>Explore Toys</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </div>
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6">
          {wishlistItems.map((item) => (
            <div key={item.id} className="relative group">
              <ProductCard product={item} />
              <button
                type="button"
                onClick={() => handleRemove(item.id)}
                className="absolute top-2 right-2 p-2 rounded-full bg-white/90 text-gray-400 hover:text-red-500 hover:bg-white transition shadow-sm z-10"
                title="Remove from wishlist"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
