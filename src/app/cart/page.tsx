'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useCart } from '@/context/CartContext';
import { Trash2, Plus, Minus, ArrowRight, ShieldCheck, Tag, Check, Sparkles } from 'lucide-react';

export default function CartPage() {
  const {
    cart,
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
    isFreeShipping
  } = useCart();

  const [couponInput, setCouponInput] = useState('');
  const [couponError, setCouponError] = useState('');
  const [isApplying, setIsApplying] = useState(false);

  const handleCouponSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!couponInput.trim()) return;
    setIsApplying(true);
    setCouponError('');

    try {
      const res = await fetch('/api/coupons', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ code: couponInput, subtotal })
      });
      const data = await res.json();
      if (res.ok && data.valid) {
        applyCoupon(data.coupon);
        setCouponInput('');
      } else {
        setCouponError(data.message || 'Invalid coupon');
      }
    } catch {
      setCouponError('Network error checking coupon');
    } finally {
      setIsApplying(false);
    }
  };

  const shippingCost = isFreeShipping ? 0 : 4.99;
  const total = Math.max(0, subtotal - discountAmount + shippingCost);

  if (cart.length === 0) {
    return (
      <div className="min-h-[70vh] flex flex-col items-center justify-center text-center px-4">
        <div className="w-20 h-20 rounded-full bg-[#F0F7F6] text-[#0C534E] flex items-center justify-center mb-4">
          <Tag className="w-8 h-8" />
        </div>
        <h1 className="text-2xl font-black text-[#162624]">Your cart is currently empty</h1>
        <p className="text-sm text-gray-500 max-w-sm mt-1 mb-6">
          Your pet is waiting for their next favorite toy! Check out our flagship 3-in-1 pet toy.
        </p>
        <Link
          href="/shop"
          className="px-8 py-3.5 rounded-full bg-[#0C534E] text-[#FFC800] font-black text-sm hover:bg-[#093B37] shadow-lg shadow-[#0C534E]/20 transition"
        >
          Explore Pet Toys
        </Link>
      </div>
    );
  }

  return (
    <div className="bg-[#FAFBF9] min-h-screen py-10 sm:py-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        <div className="flex items-center justify-between">
          <h1 className="text-3xl font-black text-[#162624] tracking-tight">Shopping Cart</h1>
          <span className="text-sm font-bold text-gray-500">
            {itemCount} {itemCount === 1 ? 'item' : 'items'}
          </span>
        </div>

        {/* Free Shipping Progress Indicator */}
        <div className="p-4 rounded-2xl bg-[#F0F7F6] border border-[#E2EBEA]">
          <div className="flex items-center justify-between text-xs font-bold mb-2">
            <span className="text-[#0C534E] flex items-center gap-1.5">
              <Sparkles className="w-4 h-4 text-[#FFC800]" />
              {isFreeShipping ? (
                <span>Unlocked Free Standard Shipping.</span>
              ) : (
                <span>
                  Add <strong className="text-[#162624]">${amountNeededForFreeShipping.toFixed(2)}</strong> more to get FREE shipping
                </span>
              )}
            </span>
          </div>
          <div className="w-full h-2 rounded-full bg-gray-200 overflow-hidden">
            <div
              className="h-full bg-gradient-to-r from-[#0C534E] to-[#FFC800] rounded-full transition-all duration-300"
              style={{ width: `${Math.min(100, (subtotal / freeShippingThreshold) * 100)}%` }}
            />
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          {/* Items List */}
          <div className="lg:col-span-8 bg-white rounded-3xl p-6 border border-gray-100 shadow-sm divide-y divide-gray-100">
            {cart.map((item) => (
              <div key={item.product.id} className="py-6 flex gap-4 sm:gap-6 items-center">
                <div className="w-24 h-24 rounded-2xl bg-[#FAFBF9] border border-gray-100 overflow-hidden relative shrink-0">
                  <Image
                    src={item.product.images[0]}
                    alt={item.product.name}
                    fill
                    className="object-cover"
                  />
                </div>

                <div className="flex-1 min-w-0">
                  <div className="flex items-start justify-between gap-2">
                    <Link
                      href={`/product/${item.product.slug}`}
                      className="font-extrabold text-base text-[#162624] hover:text-[#0C534E] transition line-clamp-1"
                    >
                      {item.product.name}
                    </Link>
                    <button
                      onClick={() => removeFromCart(item.product.id)}
                      className="text-gray-400 hover:text-red-500 p-1 transition"
                      title="Remove"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>

                  <p className="text-xs text-gray-500 mb-3">{item.product.category}</p>

                  <div className="flex items-center justify-between">
                    <div className="flex items-center border border-gray-200 rounded-full bg-white px-2.5 py-1">
                      <button
                        onClick={() => updateQuantity(item.product.id, item.quantity - 1)}
                        className="p-1 hover:text-[#0C534E] text-gray-500 transition"
                      >
                        <Minus className="w-3.5 h-3.5" />
                      </button>
                      <span className="w-8 text-center text-xs font-bold tabular-nums">
                        {item.quantity}
                      </span>
                      <button
                        onClick={() => updateQuantity(item.product.id, item.quantity + 1)}
                        className="p-1 hover:text-[#0C534E] text-gray-500 transition"
                      >
                        <Plus className="w-3.5 h-3.5" />
                      </button>
                    </div>

                    <div className="text-right">
                      <span className="text-base font-black text-[#0C534E] tabular-nums">
                        ${(item.product.price * item.quantity).toFixed(2)}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Summary Panel */}
          <div className="lg:col-span-4 space-y-6">
            <div className="bg-white rounded-3xl p-6 border border-gray-100 shadow-sm space-y-4">
              <h3 className="text-lg font-black text-[#162624]">Order Summary</h3>

              {/* Coupon Form */}
              {appliedCoupon ? (
                <div className="flex items-center justify-between p-3 rounded-xl bg-[#F0F7F6] border border-[#A3D2CD] text-xs">
                  <div className="flex items-center gap-1.5 font-bold text-[#0C534E]">
                    <Check className="w-4 h-4" />
                    <span>Coupon <strong>{appliedCoupon.code}</strong> applied</span>
                  </div>
                  <button onClick={removeCoupon} className="text-red-500 font-bold hover:underline">
                    Remove
                  </button>
                </div>
              ) : (
                <form onSubmit={handleCouponSubmit} className="space-y-1">
                  <div className="flex gap-2">
                    <input
                      type="text"
                      placeholder="Discount code (e.g. ZEN10)"
                      value={couponInput}
                      onChange={(e) => setCouponInput(e.target.value)}
                      className="flex-1 px-3.5 py-2 rounded-xl border border-gray-200 text-xs font-semibold uppercase outline-none focus:border-[#0C534E]"
                    />
                    <button
                      type="submit"
                      disabled={isApplying}
                      className="px-4 py-2 rounded-xl bg-gray-100 hover:bg-gray-200 text-xs font-bold text-[#162624] transition disabled:opacity-50"
                    >
                      Apply
                    </button>
                  </div>
                  {couponError && <p className="text-xs text-red-500 mt-1">{couponError}</p>}
                </form>
              )}

              {/* Calculations */}
              <div className="space-y-2 text-xs pt-2 border-t border-gray-100">
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
                    {isFreeShipping ? <span className="text-emerald-600">FREE</span> : `$${shippingCost.toFixed(2)}`}
                  </span>
                </div>
                <div className="flex justify-between text-base font-black text-[#162624] pt-3 border-t border-gray-100">
                  <span>Estimated Total</span>
                  <span className="text-[#0C534E] tabular-nums">${total.toFixed(2)}</span>
                </div>
              </div>

              <Link
                href="/checkout"
                className="w-full flex items-center justify-center gap-2 py-4 rounded-full bg-[#FFC800] text-[#162624] font-black text-sm hover:bg-[#E5B400] shadow-lg shadow-[#FFC800]/25 transition"
              >
                <span>Proceed to Checkout</span>
                <ArrowRight className="w-4 h-4" />
              </Link>

              <div className="flex items-center justify-center gap-1.5 text-[0.7rem] text-gray-400 font-medium">
                <ShieldCheck className="w-3.5 h-3.5 text-[#0C534E]" />
                <span>SSL 256-Bit Secure & Encrypted Checkout</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
