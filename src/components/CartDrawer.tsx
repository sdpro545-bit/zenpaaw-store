'use client';

import React, { useState } from 'react';
import { useCart } from '@/context/CartContext';
import { initialProducts } from '@/data/products';
import { X, Plus, Minus, Trash2, ArrowRight, ShieldCheck, Sparkles, Tag, Check } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';

export const CartDrawer: React.FC = () => {
  const {
    cart,
    isCartOpen,
    setIsCartOpen,
    updateQuantity,
    removeFromCart,
    subtotal,
    itemCount,
    appliedCoupon,
    applyCoupon,
    removeCoupon,
    discountAmount,
    freeShippingThreshold,
    amountNeededForFreeShipping,
    isFreeShipping,
    addToCart
  } = useCart();

  const [couponCodeInput, setCouponCodeInput] = useState('');
  const [couponError, setCouponError] = useState('');
  const [isApplyingCoupon, setIsApplyingCoupon] = useState(false);

  // Cross-sell item recommendation
  const crossSellItem = initialProducts.find(
    (p) => p.id === 'zenpaaw-puzzle-treat-ball' && !cart.some((c) => c.product.id === p.id)
  ) || initialProducts.find((p) => !cart.some((c) => c.product.id === p.id));

  const progressPercent = Math.min(100, (subtotal / freeShippingThreshold) * 100);

  const handleApplyCoupon = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!couponCodeInput.trim()) return;

    setIsApplyingCoupon(true);
    setCouponError('');

    try {
      const res = await fetch('/api/coupons', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ code: couponCodeInput, subtotal })
      });
      const data = await res.json();
      if (res.ok && data.valid) {
        applyCoupon(data.coupon);
        setCouponCodeInput('');
      } else {
        setCouponError(data.message || 'Invalid coupon code');
      }
    } catch {
      setCouponError('Network error checking coupon');
    } finally {
      setIsApplyingCoupon(false);
    }
  };

  if (!isCartOpen) return null;

  const estimatedTotal = Math.max(0, subtotal - discountAmount + (isFreeShipping ? 0 : 4.99));

  return (
    <div className="fixed inset-0 z-50 overflow-hidden">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/60 backdrop-blur-sm transition-opacity"
        onClick={() => setIsCartOpen(false)}
      />

      <div className="fixed inset-y-0 right-0 max-w-full flex pl-10">
        <div className="w-screen max-w-md bg-white shadow-2xl flex flex-col">
          {/* Header */}
          <div className="px-6 py-5 border-b border-gray-100 flex items-center justify-between bg-[#FAFBF9]">
            <div className="flex items-center gap-2.5">
              <h2 className="text-lg font-black text-[#162624] tracking-tight">Your Play Cart</h2>
              <span className="px-2.5 py-0.5 rounded-full bg-[#0C534E] text-[#FFC800] text-xs font-bold">
                {itemCount} {itemCount === 1 ? 'item' : 'items'}
              </span>
            </div>
            <button
              onClick={() => setIsCartOpen(false)}
              className="p-2 rounded-full hover:bg-gray-200 text-gray-500 hover:text-black transition"
              aria-label="Close cart drawer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Free Shipping Progress Meter */}
          <div className="px-6 py-3.5 bg-[#F0F7F6] border-b border-[#E2EBEA]">
            <div className="flex items-center justify-between text-xs font-bold mb-1.5">
              <span className="text-[#0C534E] flex items-center gap-1.5">
                <Sparkles className="w-3.5 h-3.5 text-[#FFC800]" />
                {isFreeShipping ? (
                  <span className="text-[#0C534E]">Unlocked Free Standard Shipping.</span>
                ) : (
                  <span>
                    Add <strong className="text-[#162624]">${amountNeededForFreeShipping.toFixed(2)}</strong> more for FREE shipping
                  </span>
                )}
              </span>
              <span className="text-gray-500 font-semibold">{Math.round(progressPercent)}%</span>
            </div>
            <div className="w-full h-2 rounded-full bg-gray-200 overflow-hidden">
              <div
                className="h-full bg-gradient-to-r from-[#0C534E] to-[#FFC800] rounded-full transition-all duration-500"
                style={{ width: `${progressPercent}%` }}
              />
            </div>
          </div>

          {/* Cart Items List */}
          <div className="flex-1 overflow-y-auto px-6 py-4 divide-y divide-gray-100">
            {cart.length === 0 ? (
              <div className="h-full flex flex-col items-center justify-center text-center py-12">
                <div className="w-20 h-20 rounded-full bg-[#F0F7F6] text-[#0C534E] flex items-center justify-center mb-4">
                  <Tag className="w-8 h-8 stroke-[1.5]" />
                </div>
                <h3 className="text-lg font-extrabold text-[#162624]">Your cart is empty</h3>
                <p className="text-sm text-gray-500 max-w-xs mt-1 mb-6">
                  Explore our catalog of chew toys, fetch toys, and enrichment puzzles.
                </p>
                <button
                  onClick={() => setIsCartOpen(false)}
                  className="px-6 py-3 rounded-full bg-[#0C534E] text-white text-sm font-bold hover:bg-[#093B37] shadow-lg shadow-[#0C534E]/20 transition"
                >
                  Explore Pet Toys
                </button>
              </div>
            ) : (
              cart.map((item) => (
                <div key={item.product.id} className="py-4 flex gap-4 items-center">
                  <div className="w-20 h-20 rounded-2xl bg-gray-50 border border-gray-100 overflow-hidden relative shrink-0">
                    <Image
                      src={item.product.images[0]}
                      alt={item.product.name}
                      fill
                      className="object-cover"
                    />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between gap-1">
                      <Link
                        href={`/product/${item.product.slug}`}
                        onClick={() => setIsCartOpen(false)}
                        className="font-bold text-sm text-[#162624] hover:text-[#0C534E] line-clamp-1 transition"
                      >
                        {item.product.name}
                      </Link>
                      <button
                        onClick={() => removeFromCart(item.product.id)}
                        className="text-gray-400 hover:text-red-500 p-1 transition"
                        title="Remove item"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                    <p className="text-xs text-gray-500 mb-2">{item.product.category}</p>
                    <div className="flex items-center justify-between">
                      {/* Quantity Controller */}
                      <div className="flex items-center border border-gray-200 rounded-full bg-white px-2 py-0.5">
                        <button
                          onClick={() => updateQuantity(item.product.id, item.quantity - 1)}
                          className="p-1 hover:text-[#0C534E] text-gray-500 transition"
                          aria-label="Decrease quantity"
                        >
                          <Minus className="w-3 h-3" />
                        </button>
                        <span className="w-6 text-center text-xs font-bold text-[#162624] tabular-nums">
                          {item.quantity}
                        </span>
                        <button
                          onClick={() => updateQuantity(item.product.id, item.quantity + 1)}
                          className="p-1 hover:text-[#0C534E] text-gray-500 transition"
                          aria-label="Increase quantity"
                        >
                          <Plus className="w-3 h-3" />
                        </button>
                      </div>

                      <div className="text-right">
                        <span className="text-sm font-extrabold text-[#0C534E] tabular-nums">
                          ${(item.product.price * item.quantity).toFixed(2)}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              ))
            )}

            {/* Cross-Sell Recommendation: Complete the Playtime */}
            {crossSellItem && cart.length > 0 && (
              <div className="mt-4 pt-4 border-t border-dashed border-gray-200">
                <div className="flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-[#0C534E] mb-2.5">
                  <Sparkles className="w-3.5 h-3.5 text-[#FFC800]" />
                  <span>Complete the Playtime</span>
                </div>
                <div className="p-3 rounded-2xl bg-[#F8FAF9] border border-[#E2EBEA] flex items-center gap-3">
                  <div className="w-14 h-14 rounded-xl bg-white border border-gray-100 overflow-hidden relative shrink-0">
                    <Image
                      src={crossSellItem.images[0]}
                      alt={crossSellItem.name}
                      fill
                      className="object-cover"
                    />
                  </div>
                  <div className="flex-1 min-w-0">
                    <h5 className="font-bold text-xs text-[#162624] truncate">{crossSellItem.name}</h5>
                    <p className="text-[0.7rem] text-gray-500 truncate">{crossSellItem.tagline}</p>
                    <span className="text-xs font-extrabold text-[#0C534E]">${crossSellItem.price.toFixed(2)}</span>
                  </div>
                  <button
                    onClick={() => addToCart(crossSellItem, 1)}
                    className="px-3 py-1.5 rounded-full bg-[#0C534E] text-[#FFC800] text-xs font-extrabold hover:bg-[#093B37] shrink-0 transition"
                  >
                    + Add
                  </button>
                </div>
              </div>
            )}
          </div>

          {/* Footer & Checkout Area */}
          {cart.length > 0 && (
            <div className="p-6 border-t border-gray-100 bg-[#FAFBF9] space-y-3">
              {/* Promo Code Input */}
              {appliedCoupon ? (
                <div className="flex items-center justify-between px-3.5 py-2 rounded-xl bg-[#F0F7F6] border border-[#A3D2CD] text-xs">
                  <div className="flex items-center gap-2">
                    <Check className="w-4 h-4 text-[#0C534E]" />
                    <span className="font-bold text-[#0C534E]">
                      Code <strong>{appliedCoupon.code}</strong> applied ({appliedCoupon.description})
                    </span>
                  </div>
                  <button
                    onClick={removeCoupon}
                    className="text-xs text-red-500 font-bold hover:underline"
                  >
                    Remove
                  </button>
                </div>
              ) : (
                <form onSubmit={handleApplyCoupon} className="flex gap-2">
                  <input
                    type="text"
                    placeholder="Promo code (e.g., ZEN10)"
                    value={couponCodeInput}
                    onChange={(e) => setCouponCodeInput(e.target.value)}
                    className="flex-1 px-3.5 py-2 rounded-xl border border-gray-200 text-xs font-semibold uppercase outline-none focus:border-[#0C534E]"
                  />
                  <button
                    type="submit"
                    disabled={isApplyingCoupon}
                    className="px-4 py-2 rounded-xl bg-gray-200 text-[#162624] hover:bg-gray-300 text-xs font-bold transition disabled:opacity-50"
                  >
                    Apply
                  </button>
                </form>
              )}
              {couponError && <p className="text-xs text-red-500">{couponError}</p>}

              {/* Price Calculation */}
              <div className="space-y-1.5 text-xs">
                <div className="flex justify-between text-gray-500">
                  <span>Subtotal</span>
                  <span className="font-bold text-[#162624] tabular-nums">${subtotal.toFixed(2)}</span>
                </div>
                {discountAmount > 0 && (
                  <div className="flex justify-between text-emerald-600 font-bold">
                    <span>Discount</span>
                    <span className="tabular-nums">-${discountAmount.toFixed(2)}</span>
                  </div>
                )}
                <div className="flex justify-between text-gray-500">
                  <span>Estimated Shipping</span>
                  <span className="font-bold text-[#162624]">
                    {isFreeShipping ? <span className="text-emerald-600">FREE</span> : '$4.99'}
                  </span>
                </div>
                <div className="flex justify-between text-base font-black text-[#162624] pt-2 border-t border-gray-200">
                  <span>Estimated Total</span>
                  <span className="text-[#0C534E] tabular-nums">${estimatedTotal.toFixed(2)}</span>
                </div>
              </div>

              {/* Checkout Action Button */}
              <Link
                href="/checkout"
                onClick={() => setIsCartOpen(false)}
                className="w-full flex items-center justify-center gap-2 py-3.5 rounded-full bg-[#FFC800] text-[#162624] font-extrabold text-sm hover:bg-[#E5B400] shadow-lg shadow-[#FFC800]/30 transition group"
              >
                <span>Proceed to Secure Checkout</span>
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition" />
              </Link>

              <div className="flex items-center justify-center gap-1.5 text-[0.7rem] text-gray-400 font-medium pt-1">
                <ShieldCheck className="w-3.5 h-3.5 text-[#0C534E]" />
                <span>256-Bit Encrypted Checkout • 30-Day Money-Back Guarantee</span>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
