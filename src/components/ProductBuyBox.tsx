'use client';

import React, { useState } from 'react';
import { motion } from 'motion/react';
import { Check, ShoppingBag, Truck, RotateCcw, ShieldCheck, Heart } from 'lucide-react';
import { useCart } from '@/context/CartContext';
import { storeConfig } from '@/store.config';

interface Variant {
  id: string;
  sku: string;
  option1Name?: string;
  option1Value?: string;
  option2Name?: string;
  option2Value?: string;
  priceCents: number;
  compareAtCents?: number;
  available: boolean;
  leadTimeDaysMin: number;
  leadTimeDaysMax: number;
}

interface ProductBuyBoxProps {
  product: {
    id: string;
    slug: string;
    title: string;
    summary: string;
    category: string;
    images: string[];
  };
  variants: Variant[];
}

export function ProductBuyBox({ product, variants }: ProductBuyBoxProps) {
  const { addToCart } = useCart();
  const [selectedVariantId, setSelectedVariantId] = useState<string>(
    variants[0]?.id || ''
  );
  const [quantity, setQuantity] = useState(1);
  const [buttonState, setButtonState] = useState<'idle' | 'loading' | 'success'>('idle');

  const activeVariant = variants.find((v) => v.id === selectedVariantId) || variants[0];
  const price = (activeVariant?.priceCents || 0) / 100;
  const compareAtPrice = activeVariant?.compareAtCents ? activeVariant.compareAtCents / 100 : null;

  const handleAddToCart = () => {
    if (buttonState !== 'idle') return;
    setButtonState('loading');

    setTimeout(() => {
      addToCart(
        {
          id: product.id,
          slug: product.slug,
          name: product.title,
          price: price,
          category: product.category,
          images: product.images,
          inStock: activeVariant?.available ?? true,
          tagline: product.summary,
          description: '',
          features: [],
          specs: { materials: '', dimensions: '', weight: '', suitableFor: '', cleaning: '' },
          includedItems: [],
          safetyGuidance: '',
        },
        quantity,
        selectedVariantId
      );

      setButtonState('success');
      setTimeout(() => {
        setButtonState('idle');
      }, 1400);
    }, 350);
  };

  return (
    <div className="space-y-6">
      {/* Price Display */}
      <div className="flex items-center gap-3 flex-wrap">
        <span className="text-3xl sm:text-4xl font-black text-[#0C534E] tabular-nums">
          ${price.toFixed(2)}
        </span>
        {compareAtPrice && compareAtPrice > price && (
          <>
            <span className="text-base sm:text-lg text-gray-400 line-through tabular-nums font-semibold">
              ${compareAtPrice.toFixed(2)}
            </span>
            <span className="px-2.5 py-0.5 rounded-full bg-emerald-100 text-emerald-800 text-xs font-black tracking-wide">
              Save {Math.round(((compareAtPrice - price) / compareAtPrice) * 100)}%
            </span>
          </>
        )}
      </div>

      {/* Variant Selector */}
      {variants.length > 1 && (
        <div className="space-y-3 pt-2">
          <label className="text-xs font-black uppercase tracking-wider text-[#162624]">
            Select Variant
          </label>
          <div className="flex flex-wrap gap-2.5">
            {variants.map((v) => {
              const label = [v.option1Value, v.option2Value].filter(Boolean).join(' / ') || v.sku;
              const isSelected = v.id === selectedVariantId;
              return (
                <button
                  key={v.id}
                  type="button"
                  disabled={!v.available}
                  onClick={() => setSelectedVariantId(v.id)}
                  className={`px-4 py-2.5 rounded-2xl text-xs font-bold border transition ${
                    isSelected
                      ? 'border-[#0C534E] bg-[#F0F7F6] text-[#0C534E] ring-1 ring-[#0C534E]'
                      : v.available
                      ? 'border-gray-200 text-gray-700 hover:border-gray-300 bg-white'
                      : 'border-gray-100 bg-gray-50 text-gray-400 line-through cursor-not-allowed'
                  }`}
                >
                  {label}
                </button>
              );
            })}
          </div>
        </div>
      )}

      {/* Quantity Stepper & Add Button */}
      <div className="pt-2 flex flex-col sm:flex-row gap-3">
        <div className="inline-flex items-center rounded-full border border-gray-200 bg-white p-1">
          <button
            type="button"
            onClick={() => setQuantity((q) => Math.max(1, q - 1))}
            className="w-9 h-9 rounded-full flex items-center justify-center text-sm font-bold text-gray-600 hover:bg-gray-100 transition"
          >
            -
          </button>
          <span className="w-10 text-center text-sm font-black text-[#162624] tabular-nums">
            {quantity}
          </span>
          <button
            type="button"
            onClick={() => setQuantity((q) => q + 1)}
            className="w-9 h-9 rounded-full flex items-center justify-center text-sm font-bold text-gray-600 hover:bg-gray-100 transition"
          >
            +
          </button>
        </div>

        <button
          type="button"
          disabled={buttonState !== 'idle' || !(activeVariant?.available ?? true)}
          onClick={handleAddToCart}
          className={`flex-1 px-8 py-4 rounded-full font-black text-xs uppercase tracking-wider flex items-center justify-center gap-2 transition shadow-lg ${
            buttonState === 'success'
              ? 'bg-emerald-600 text-white'
              : 'bg-[#FFC800] text-[#162624] hover:bg-[#E5B400] shadow-[#FFC800]/25'
          }`}
        >
          {buttonState === 'loading' ? (
            <span className="w-4 h-4 border-2 border-[#162624] border-t-transparent rounded-full animate-spin" />
          ) : buttonState === 'success' ? (
            <>
              <Check className="w-4 h-4 stroke-[3]" />
              <span>Added to Cart</span>
            </>
          ) : (
            <>
              <ShoppingBag className="w-4 h-4" />
              <span>Add to Cart • ${(price * quantity).toFixed(2)}</span>
            </>
          )}
        </button>
      </div>

      {/* Trust & Delivery Badges */}
      <div className="pt-6 border-t border-gray-100 space-y-3 text-xs text-gray-600">
        <div className="flex items-center gap-2.5">
          <Truck className="w-4 h-4 text-[#0C534E] shrink-0" />
          <span>
            Standard delivery: <strong>{activeVariant?.leadTimeDaysMin || 3} to {activeVariant?.leadTimeDaysMax || 7} business days</strong> with tracking.
          </span>
        </div>
        <div className="flex items-center gap-2.5">
          <RotateCcw className="w-4 h-4 text-[#0C534E] shrink-0" />
          <span>{storeConfig.returnWindowDays}-day returns. Contact us for a full refund or exchange.</span>
        </div>
        <div className="flex items-center gap-2.5">
          <ShieldCheck className="w-4 h-4 text-[#0C534E] shrink-0" />
          <span>Free shipping on all orders over ${storeConfig.freeShippingThresholdCents / 100}.</span>
        </div>
      </div>

      {/* Sticky Mobile Bar */}
      <div className="lg:hidden fixed bottom-0 left-0 right-0 z-40 bg-white/95 backdrop-blur-md border-t border-gray-200 px-4 py-3 flex items-center justify-between gap-3 shadow-2xl">
        <div className="min-w-0">
          <div className="text-xs font-bold text-[#162624] truncate">{product.title}</div>
          <div className="text-base font-black text-[#0C534E] tabular-nums">${price.toFixed(2)}</div>
        </div>
        <button
          type="button"
          disabled={buttonState !== 'idle' || !(activeVariant?.available ?? true)}
          onClick={handleAddToCart}
          className="px-6 py-3 rounded-full bg-[#FFC800] text-[#162624] font-black text-xs uppercase tracking-wider shrink-0 shadow-md"
        >
          {buttonState === 'success' ? 'Added' : 'Add to Cart'}
        </button>
      </div>
    </div>
  );
}
