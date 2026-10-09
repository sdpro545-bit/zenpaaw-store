'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import Link from 'next/link';
import { useCart } from '@/context/CartContext';
import { storeConfig } from '@/store.config';
import { trackEvent } from '@/lib/analytics';
import {
  CreditCard,
  Truck,
  ArrowLeft,
  CheckCircle2,
  AlertCircle,
  Shield,
} from 'lucide-react';

export default function CheckoutPage() {
  const router = useRouter();
  const { cart, subtotal, discountAmount, isFreeShipping, appliedCoupon, clearCart } = useCart();

  const shippingCost = isFreeShipping ? 0 : storeConfig.standardShippingRateCents / 100;
  const estimatedTotal = Math.max(0, subtotal - discountAmount + shippingCost);

  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    address: '',
    apartment: '',
    city: '',
    state: 'CA',
    zipCode: '',
    country: 'United States',
  });

  const [paymentProvider, setPaymentProvider] = useState<'stripe' | 'paystack'>('stripe');
  const [isProcessing, setIsProcessing] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmitOrder = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg('');

    if (cart.length === 0) {
      setErrorMsg('Your cart is empty. Please add toys to continue.');
      return;
    }

    if (
      !formData.firstName ||
      !formData.lastName ||
      !formData.email ||
      !formData.address ||
      !formData.city ||
      !formData.zipCode
    ) {
      setErrorMsg('Please complete all required shipping address fields.');
      return;
    }

    setIsProcessing(true);

    try {
      trackEvent('begin_checkout', {
        value: estimatedTotal,
        items_count: cart.length,
      });

      // 1. Submit order to server endpoint for recalculation from database
      const checkoutRes = await fetch('/api/checkout', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          customer: formData,
          items: cart.map((i) => ({
            variantId: i.selectedVariant || i.product.id,
            quantity: i.quantity,
          })),
          couponCode: appliedCoupon?.code,
          paymentProvider,
        }),
      });

      const checkoutData = await checkoutRes.json();

      if (!checkoutRes.ok) {
        throw new Error(checkoutData.error || 'Server rejected checkout parameters.');
      }

      const { orderNumber, clientSecret, paymentUrl } = checkoutData;

      if (paymentUrl) {
        // Hosted checkout redirect (Stripe / Paystack)
        window.location.href = paymentUrl;
        return;
      }

      // Test Mode server payment verification
      const verifyRes = await fetch('/api/checkout/simulate-payment', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          orderNumber,
          clientSecret,
        }),
      });

      const verifyData = await verifyRes.json();

      if (!verifyRes.ok) {
        throw new Error(verifyData.error || 'Payment authorization simulation failed.');
      }

      // Success: clear cart and redirect to verified order confirmation receipt
      clearCart();
      trackEvent('purchase', {
        order_number: orderNumber,
        value: estimatedTotal,
      });

      router.push(`/order/${orderNumber}?email=${encodeURIComponent(formData.email)}`);
    } catch (err: any) {
      setErrorMsg(err.message || 'An unexpected error occurred during checkout.');
      setIsProcessing(false);
    }
  };

  if (cart.length === 0) {
    return (
      <div className="min-h-[60vh] flex flex-col items-center justify-center p-6 text-center space-y-4">
        <h1 className="text-2xl font-black text-[#162624]">Your Cart is Currently Empty</h1>
        <p className="text-xs text-gray-500 max-w-sm">
          Please add products to your cart before proceeding to checkout.
        </p>
        <Link
          href="/shop"
          className="px-8 py-3.5 rounded-full bg-[#0C534E] text-[#FFC800] text-xs font-black uppercase tracking-wider shadow-md"
        >
          Return to Shop
        </Link>
      </div>
    );
  }

  return (
    <div className="bg-[#FAFBF9] min-h-screen py-10 sm:py-16">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6">
        <div className="flex items-center justify-between">
          <Link
            href="/cart"
            className="inline-flex items-center gap-1.5 text-xs font-bold text-gray-500 hover:text-[#0C534E]"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>Back to Cart</span>
          </Link>
          <div className="flex items-center gap-1.5 text-xs text-[#0C534E] font-bold">
            <Shield className="w-4 h-4" />
            <span>Secure Hosted Checkout</span>
          </div>
        </div>

        <form onSubmit={handleSubmitOrder} className="grid grid-cols-1 lg:grid-cols-12 gap-10">
          {/* Left Column: Contact, Address, & Payment Options */}
          <div className="lg:col-span-7 space-y-8">
            {/* 1. Contact Information */}
            <div className="bg-white rounded-3xl p-6 sm:p-8 border border-gray-100 shadow-sm space-y-4">
              <div className="flex items-center justify-between">
                <h2 className="text-lg font-black text-[#162624]">1. Contact Information</h2>
                <span className="text-xs text-gray-400 font-medium">Step 1 of 3</span>
              </div>

              <div className="space-y-3">
                <div>
                  <label className="text-xs font-bold text-gray-600 block mb-1">Email Address *</label>
                  <input
                    type="email"
                    name="email"
                    required
                    placeholder="you@example.com"
                    value={formData.email}
                    onChange={handleInputChange}
                    className="w-full px-4 py-2.5 rounded-xl border border-gray-200 text-xs sm:text-sm outline-none focus:border-[#0C534E]"
                  />
                  <span className="text-[0.68rem] text-gray-400 mt-1 block">
                    Order confirmation and tracked shipping updates are dispatched here.
                  </span>
                </div>

                <div>
                  <label className="text-xs font-bold text-gray-600 block mb-1">
                    Phone Number (Optional)
                  </label>
                  <input
                    type="tel"
                    name="phone"
                    placeholder="+1 (555) 000-0000"
                    value={formData.phone}
                    onChange={handleInputChange}
                    className="w-full px-4 py-2.5 rounded-xl border border-gray-200 text-xs sm:text-sm outline-none focus:border-[#0C534E]"
                  />
                </div>
              </div>
            </div>

            {/* 2. Shipping Address */}
            <div className="bg-white rounded-3xl p-6 sm:p-8 border border-gray-100 shadow-sm space-y-4">
              <div className="flex items-center justify-between">
                <h2 className="text-lg font-black text-[#162624]">2. Shipping Address</h2>
                <span className="text-xs text-gray-400 font-medium">Step 2 of 3</span>
              </div>

              <div className="space-y-3">
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="text-xs font-bold text-gray-600 block mb-1">First Name *</label>
                    <input
                      type="text"
                      name="firstName"
                      required
                      placeholder="Jane"
                      value={formData.firstName}
                      onChange={handleInputChange}
                      className="w-full px-4 py-2.5 rounded-xl border border-gray-200 text-xs sm:text-sm outline-none focus:border-[#0C534E]"
                    />
                  </div>
                  <div>
                    <label className="text-xs font-bold text-gray-600 block mb-1">Last Name *</label>
                    <input
                      type="text"
                      name="lastName"
                      required
                      placeholder="Doe"
                      value={formData.lastName}
                      onChange={handleInputChange}
                      className="w-full px-4 py-2.5 rounded-xl border border-gray-200 text-xs sm:text-sm outline-none focus:border-[#0C534E]"
                    />
                  </div>
                </div>

                <div>
                  <label className="text-xs font-bold text-gray-600 block mb-1">Street Address *</label>
                  <input
                    type="text"
                    name="address"
                    required
                    placeholder="123 Main Street"
                    value={formData.address}
                    onChange={handleInputChange}
                    className="w-full px-4 py-2.5 rounded-xl border border-gray-200 text-xs sm:text-sm outline-none focus:border-[#0C534E]"
                  />
                </div>

                <div>
                  <label className="text-xs font-bold text-gray-600 block mb-1">
                    Apartment, Suite (Optional)
                  </label>
                  <input
                    type="text"
                    name="apartment"
                    placeholder="Apt 4B"
                    value={formData.apartment}
                    onChange={handleInputChange}
                    className="w-full px-4 py-2.5 rounded-xl border border-gray-200 text-xs sm:text-sm outline-none focus:border-[#0C534E]"
                  />
                </div>

                <div className="grid grid-cols-3 gap-3">
                  <div>
                    <label className="text-xs font-bold text-gray-600 block mb-1">City *</label>
                    <input
                      type="text"
                      name="city"
                      required
                      placeholder="San Francisco"
                      value={formData.city}
                      onChange={handleInputChange}
                      className="w-full px-4 py-2.5 rounded-xl border border-gray-200 text-xs sm:text-sm outline-none focus:border-[#0C534E]"
                    />
                  </div>
                  <div>
                    <label className="text-xs font-bold text-gray-600 block mb-1">State *</label>
                    <select
                      name="state"
                      value={formData.state}
                      onChange={handleInputChange}
                      className="w-full px-3 py-2.5 rounded-xl border border-gray-200 text-xs sm:text-sm outline-none focus:border-[#0C534E] bg-white"
                    >
                      {['CA', 'NY', 'TX', 'FL', 'WA', 'OR', 'IL', 'OH', 'CO', 'NC'].map((st) => (
                        <option key={st} value={st}>
                          {st}
                        </option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className="text-xs font-bold text-gray-600 block mb-1">ZIP Code *</label>
                    <input
                      type="text"
                      name="zipCode"
                      required
                      placeholder="94111"
                      value={formData.zipCode}
                      onChange={handleInputChange}
                      className="w-full px-4 py-2.5 rounded-xl border border-gray-200 text-xs sm:text-sm outline-none focus:border-[#0C534E]"
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* 3. Payment Method (PCI Compliant Provider Integration - Zero Raw Card Inputs) */}
            <div className="bg-white rounded-3xl p-6 sm:p-8 border border-gray-100 shadow-sm space-y-4">
              <div className="flex items-center justify-between">
                <h2 className="text-lg font-black text-[#162624] flex items-center gap-2">
                  <CreditCard className="w-5 h-5 text-[#0C534E]" />
                  <span>3. Payment Method</span>
                </h2>
                <span className="text-xs text-gray-400 font-medium">Step 3 of 3</span>
              </div>

              <p className="text-xs text-gray-500 leading-relaxed">
                Payment is processed securely through our provider gateway. We do not collect or store raw payment card data on our servers.
              </p>

              <div className="space-y-3">
                <label className="p-4 rounded-2xl border-2 border-[#0C534E] bg-[#F0F7F6] flex items-center justify-between cursor-pointer">
                  <div className="flex items-center gap-3">
                    <input
                      type="radio"
                      name="paymentProvider"
                      checked={paymentProvider === 'stripe'}
                      onChange={() => setPaymentProvider('stripe')}
                      className="accent-[#0C534E] w-4 h-4"
                    />
                    <div>
                      <span className="font-black text-sm text-[#162624] block">
                        Credit / Debit Card (Stripe Gateway & Test Simulation)
                      </span>
                      <span className="text-xs text-gray-500 block">
                        Compliant hosted tokenization element.
                      </span>
                    </div>
                  </div>
                  <CreditCard className="w-5 h-5 text-[#0C534E]" />
                </label>

                <label className="p-4 rounded-2xl border border-gray-200 bg-white flex items-center justify-between cursor-pointer hover:border-gray-300">
                  <div className="flex items-center gap-3">
                    <input
                      type="radio"
                      name="paymentProvider"
                      checked={paymentProvider === 'paystack'}
                      onChange={() => setPaymentProvider('paystack')}
                      className="accent-[#0C534E] w-4 h-4"
                    />
                    <div>
                      <span className="font-black text-sm text-[#162624] block">
                        Paystack Gateway
                      </span>
                      <span className="text-xs text-gray-500 block">
                        African & international merchant checkout adapter.
                      </span>
                    </div>
                  </div>
                  <Truck className="w-5 h-5 text-gray-400" />
                </label>
              </div>

              <div className="p-4 rounded-2xl bg-[#FAFBF9] border border-gray-100 flex items-center gap-2 text-xs text-gray-600">
                <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                <span>Totals are re-calculated and verified server-side prior to charge authorization.</span>
              </div>
            </div>
          </div>

          {/* Right Column: Order Summary */}
          <div className="lg:col-span-5 space-y-6">
            <div className="bg-white rounded-3xl p-6 sm:p-8 border border-gray-100 shadow-sm space-y-6 sticky top-24">
              <h2 className="text-lg font-black text-[#162624] border-b border-gray-100 pb-4">
                Order Summary ({cart.length} {cart.length === 1 ? 'item' : 'items'})
              </h2>

              <div className="max-h-64 overflow-y-auto divide-y divide-gray-100 pr-1">
                {cart.map((item) => (
                  <div key={item.product.id} className="py-3 flex gap-3 items-center">
                    <div className="w-14 h-14 rounded-xl bg-gray-50 border border-gray-100 overflow-hidden relative shrink-0">
                      <Image
                        src={item.product.images[0] || '/brand/zenpaaw-symbol.svg'}
                        alt={item.product.name}
                        fill
                        className="object-contain p-1"
                        sizes="56px"
                      />
                    </div>
                    <div className="flex-1 min-w-0">
                      <h4 className="text-xs font-bold text-[#162624] truncate">{item.product.name}</h4>
                      <span className="text-[0.68rem] text-gray-500">Qty: {item.quantity}</span>
                    </div>
                    <span className="text-xs font-black text-[#0C534E] tabular-nums">
                      ${(item.product.price * item.quantity).toFixed(2)}
                    </span>
                  </div>
                ))}
              </div>

              <div className="space-y-2.5 pt-4 border-t border-gray-100 text-xs">
                <div className="flex justify-between text-gray-600">
                  <span>Subtotal</span>
                  <span className="font-bold tabular-nums">${subtotal.toFixed(2)}</span>
                </div>
                {discountAmount > 0 && (
                  <div className="flex justify-between text-emerald-600 font-bold">
                    <span>Discount</span>
                    <span className="tabular-nums">-${discountAmount.toFixed(2)}</span>
                  </div>
                )}
                <div className="flex justify-between text-gray-600">
                  <span>Shipping</span>
                  <span className="font-bold tabular-nums">
                    {isFreeShipping ? 'FREE' : `$${shippingCost.toFixed(2)}`}
                  </span>
                </div>
                <div className="flex justify-between text-base font-black text-[#162624] pt-3 border-t border-gray-100">
                  <span>Total</span>
                  <span className="text-[#0C534E] tabular-nums">${estimatedTotal.toFixed(2)}</span>
                </div>
              </div>

              {errorMsg && (
                <div className="p-3.5 rounded-2xl bg-red-50 text-red-700 text-xs font-bold flex items-center gap-2">
                  <AlertCircle className="w-4 h-4 shrink-0" />
                  <span>{errorMsg}</span>
                </div>
              )}

              <button
                type="submit"
                disabled={isProcessing}
                className="w-full py-4 rounded-full bg-[#0C534E] text-[#FFC800] font-black text-xs uppercase tracking-wider hover:bg-[#093B37] transition shadow-lg shadow-[#0C534E]/25 flex items-center justify-center gap-2 disabled:opacity-50"
              >
                {isProcessing ? (
                  <span className="w-4 h-4 border-2 border-[#FFC800] border-t-transparent rounded-full animate-spin" />
                ) : (
                  <span>Complete Order • ${estimatedTotal.toFixed(2)}</span>
                )}
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}
