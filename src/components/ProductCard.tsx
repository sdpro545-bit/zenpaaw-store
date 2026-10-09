'use client';

import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Product } from '@/types';
import { useCart } from '@/context/CartContext';
import { Star, Plus, Check } from 'lucide-react';

interface ProductCardProps {
  product: Product;
  priority?: boolean;
}

export const ProductCard: React.FC<ProductCardProps> = ({ product, priority = false }) => {
  const { addToCart, cart } = useCart();
  const isInCart = cart.some((item) => item.product.id === product.id);

  const discountPercent = product.compareAtPrice
    ? Math.round(((product.compareAtPrice - product.price) / product.compareAtPrice) * 100)
    : 0;

  return (
    <div className="group bg-white rounded-3xl p-3 sm:p-4 border border-gray-100 hover:border-[#A3D2CD] hover:shadow-xl transition-all duration-300 flex flex-col justify-between">
      <div>
        {/* Image Container with Badges */}
        <div className="relative aspect-square w-full rounded-2xl overflow-hidden bg-[#F8FAF9] mb-4">
          <Link href={`/product/${product.slug}`} className="block w-full h-full relative">
            <Image
              src={product.images[0]}
              alt={product.name}
              fill
              priority={priority}
              className="object-cover object-center group-hover:scale-105 transition-transform duration-500 ease-out"
            />
            {product.images[1] && (
              <Image
                src={product.images[1]}
                alt={`${product.name} alternate view`}
                fill
                className="object-cover object-center opacity-0 group-hover:opacity-100 transition-opacity duration-500 ease-out"
              />
            )}
          </Link>

          {/* Badges Overlay */}
          <div className="absolute top-3 left-3 flex flex-col gap-1.5 pointer-events-none">
            {product.isFlagship && (
              <span className="px-3 py-1 rounded-full bg-[#0C534E] text-[#FFC800] text-[0.68rem] font-black tracking-wider uppercase shadow-md">
                Staff Pick
              </span>
            )}
            {product.isBestSeller && !product.isFlagship && (
              <span className="px-3 py-1 rounded-full bg-[#FFC800] text-[#162624] text-[0.68rem] font-black tracking-wider uppercase shadow-md">
                Staff Pick
              </span>
            )}
            {discountPercent > 0 && (
              <span className="px-2.5 py-0.5 rounded-full bg-emerald-600 text-white text-[0.65rem] font-extrabold w-fit shadow-sm">
                Save {discountPercent}%
              </span>
            )}
          </div>
        </div>

        {/* Product Details */}
        <div className="space-y-1.5 px-1">
          {/* Category & Rating */}
          <div className="flex items-center justify-between text-xs text-gray-500">
            <span className="font-semibold text-[#0C534E] uppercase tracking-wider text-[0.7rem]">
              {product.category}
            </span>
            {(product.reviewCount ?? 0) >= 3 && product.rating !== undefined ? (
              <div className="flex items-center gap-1 font-bold text-[#162624]">
                <Star className="w-3.5 h-3.5 fill-[#FFC800] text-[#FFC800]" />
                <span>{product.rating.toFixed(1)}</span>
                <span className="text-gray-400 font-normal">({product.reviewCount})</span>
              </div>
            ) : null}
          </div>

          {/* Product Name */}
          <h3 className="font-extrabold text-base sm:text-lg text-[#162624] group-hover:text-[#0C534E] transition line-clamp-1">
            <Link href={`/product/${product.slug}`}>{product.name}</Link>
          </h3>

          {/* Short Tagline */}
          <p className="text-xs text-gray-500 line-clamp-2 leading-relaxed min-h-[2rem]">
            {product.tagline}
          </p>
        </div>
      </div>

      {/* Pricing & Quick Add Action */}
      <div className="pt-4 mt-2 border-t border-gray-100 flex items-center justify-between gap-3 px-1">
        <div className="flex flex-col">
          <div className="flex items-baseline gap-1.5">
            <span className="text-lg sm:text-xl font-black text-[#0C534E] tabular-nums">
              ${product.price.toFixed(2)}
            </span>
            {product.compareAtPrice && (
              <span className="text-xs sm:text-sm text-gray-400 line-through tabular-nums">
                ${product.compareAtPrice.toFixed(2)}
              </span>
            )}
          </div>
          <span className="text-[0.65rem] font-medium text-gray-400">Taxes calculated at checkout</span>
        </div>

        <button
          onClick={() => addToCart(product, 1)}
          className={`flex items-center gap-1.5 px-4 py-2.5 rounded-full font-bold text-xs sm:text-sm transition-all duration-200 shadow-sm active:scale-95 ${
            isInCart
              ? 'bg-[#F0F7F6] text-[#0C534E] border border-[#0C534E]/30 hover:bg-[#0C534E] hover:text-white'
              : 'bg-[#FFC800] text-[#162624] hover:bg-[#E5B400] hover:shadow-md hover:shadow-[#FFC800]/20'
          }`}
          aria-label={`Add ${product.name} to cart`}
        >
          {isInCart ? (
            <>
              <Check className="w-4 h-4 stroke-[2.5]" />
              <span>Added</span>
            </>
          ) : (
            <>
              <Plus className="w-4 h-4 stroke-[2.5]" />
              <span>Add</span>
            </>
          )}
        </button>
      </div>
    </div>
  );
};

export default ProductCard;
