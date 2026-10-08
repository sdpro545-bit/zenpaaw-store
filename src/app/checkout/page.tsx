'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import Link from 'next/link';
import { useCart } from '@/context/CartContext';
import { ShippingAddress } from '@/types';
import { trackEvent } from '@/lib/analytics';
import {
  Lock,
  ShieldCheck,
  CreditCard,
  Truck,
  ArrowLeft,
  CheckCircle2,
  AlertCircle
} from 'lucide-react';

export default function CheckoutPage() {
  const router = useRouter();
  const { cart, subtotal, discountAmount, isFreeShipping, appliedCoupon, clearCart } = useCart();

  const shippingCost = isFreeShipping ? 0 : 4.99;
  const total = Math.max(0, subtotal - discountAmount + shippingCost);

  const [formData, setFormData] = useState<ShippingAddress>({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    address: '',
    apartment: '',
    city: '',
    state: 'CA',
    zipCode: '',
    country: 'United States'
  });

  const [cardDetails, setCardDetails] = useState({
    cardNumber: '',
    expDate: '',
    cvc: '',
    nameOnCard: ''
  });

  const [shippingMethod, setShippingMethod] = useState<'standard' | 'express'>('standard');
  const [isProcessing, setIsProcessing] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleCardChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setCardDetails({ ...cardDetails, [e.target.name]: e.target.value });
  };

  const handleSubmitOrder = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg('');

    if (cart.length === 0) {
      setErrorMsg('Your cart is empty. Add products to proceed.');
      return;
    }

    // Basic address validation
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

    // Basic card validation
    if (!cardDetails.cardNumber || !cardDetails.expDate || !cardDetails.cvc) {
      setErrorMsg('Please enter valid credit card details.');
      return;
    }

    setIsProcessing(true);

    try {
      // Begin checkout event
      trackEvent('begin_checkout', {
        value: total,
        items_count: cart.length
      });

      // Prepare order items
      const items = cart.map((i) => ({
        productId: i.product.id,
        productName: i.product.name,
        price: i.product.price,
        quantity: i.quantity,
        image: i.product.images[0]
      }));

      // Generate client-side token mock (Stripe Elements architecture)
      const simulatedToken = `tok_stripe_${Date.now()}_${Math.random().toString(36).substring(7)}`;

      const res = await fetch('/api/checkout', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          customer: formData,
          items,
          subtotal,
          shippingCost,
          discount: discountAmount,
          total,
          couponCode: appliedCoupon?.code,
          paymentToken: simulatedToken
        })
      });

      const data = await res.json();

      if (!res.ok || !data.success) {
        throw new Error(data.error || 'Failed to process checkout');
      }

      // Track confirmed purchase event (only fires on verified server success!)
      trackEvent('purchase', {
        transaction_id: data.orderId,
        value: total,
        shipping: shippingCost,
        items
      });

      // Clear client cart
      clearCart();

      // Navigate to order confirmation
      router.push(`/order-confirmation/${data.orderId}`);
    } catch (err: any) {
      setErrorMsg(err.message || 'Payment processing error. Please try again.');
      setIsProcessing(false);
    }
  };

  if (cart.length === 0) {
    return (
      <div className="min-h-[60vh] flex flex-col items-center justify-center p-6 text-center">
        <h2 className="text-xl font-bold text-[#162624]">Your cart is currently empty</h2>
        <Link
          href="/shop"
          className="mt-4 px-6 py-2.5 rounded-full bg-[#0C534E] text-[#FFC800] text-sm font-bold"
        >
          Return to Shop
        </Link>
      </div>
    );
  }

  return (
    <div className="bg-[#FAFBF9] min-h-screen py-10 sm:py-16">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-6 flex items-center justify-between">
          <Link
            href="/cart"
            className="inline-flex items-center gap-1.5 text-xs font-bold text-gray-500 hover:text-[#0C534E]"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>Back to Cart</span>
          </Link>
          <div className="flex items-center gap-1.5 text-xs text-[#0C534E] font-bold">
            <Lock className="w-3.5 h-3.5" />
            <span>256-Bit SSL Encrypted Checkout</span>
          </div>
        </div>

        <form onSubmit={handleSubmitOrder} className="grid grid-cols-1 lg:grid-cols-12 gap-10">
          {/* Left Column: Customer & Payment Form */}
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
                    Order confirmation and shipping tracking will be sent here.
                  </span>
                </div>

                <div>
                  <label className="text-xs font-bold text-gray-600 block mb-1">Phone Number (Optional)</label>
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
                    placeholder="123 Bark Avenue"
                    value={formData.address}
                    onChange={handleInputChange}
                    className="w-full px-4 py-2.5 rounded-xl border border-gray-200 text-xs sm:text-sm outline-none focus:border-[#0C534E]"
                  />
                </div>

                <div>
                  <label className="text-xs font-bold text-gray-600 block mb-1">Apartment, Suite, Unit (Optional)</label>
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
                      placeholder="Portland"
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
                        <option key={st} value={st}>{st}</option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className="text-xs font-bold text-gray-600 block mb-1">ZIP Code *</label>
                    <input
                      type="text"
                      name="zipCode"
                      required
                      placeholder="97201"
                      value={formData.zipCode}
                      onChange={handleInputChange}
                      className="w-full px-4 py-2.5 rounded-xl border border-gray-200 text-xs sm:text-sm outline-none focus:border-[#0C534E]"
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* 3. Payment Method (Secure Tokenized Architecture) */}
            <div className="bg-white rounded-3xl p-6 sm:p-8 border border-gray-100 shadow-sm space-y-4">
              <div className="flex items-center justify-between">
                <h2 className="text-lg font-black text-[#162624] flex items-center gap-2">
                  <CreditCard className="w-5 h-5 text-[#0C534E]" />
                  <span>3. Payment Information</span>
                </h2>
                <span className="text-xs text-emerald-600 font-bold flex items-center gap-1">
                  <ShieldCheck className="w-4 h-4" />
                  <span>Stripe Protected</span>
                </span>
              </div>

              <p className="text-xs text-gray-500">
                All transactions are securely tokenized with 256-bit encryption. We never store raw card numbers.
              </p>

              <div className="p-4 rounded-2xl bg-[#FAFBF9] border border-gray-200 space-y-3">
                <div>
                  <label className="text-xs font-bold text-gray-600 block mb-1">Card Number *</label>
                  <input
                    type="text"
                    name="cardNumber"
                    required
                    placeholder="4242 •••• •••• 4242 (Test Mode)"
                    value={cardDetails.cardNumber}
                    onChange={handleCardChange}
                    maxLength={19}
                    className="w-full px-4 py-2.5 rounded-xl border border-gray-200 text-xs sm:text-sm outline-none focus:border-[#0C534E] bg-white font-mono"
                  />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="text-xs font-bold text-gray-600 block mb-1">Expires (MM/YY) *</label>
                    <input
                      type="text"
                      name="expDate"
                      required
                      placeholder="12/28"
                      maxLength={5}
                      value={cardDetails.expDate}
                      onChange={handleCardChange}
                      className="w-full px-4 py-2.5 rounded-xl border border-gray-200 text-xs sm:text-sm outline-none focus:border-[#0C534E] bg-white font-mono"
                    />
                  </div>
                  <div>
                    <label className="text-xs font-bold text-gray-600 block mb-1">Security CVC *</label>
                    <input
                      type="text"
                      name="cvc"
                      required
                      placeholder="123"
                      maxLength={4}
                      value={cardDetails.cvc}
                      onChange={handleCardChange}
                      className="w-full px-4 py-2.5 rounded-xl border border-gray-200 text-xs sm:text-sm outline-none focus:border-[#0C534E] bg-white font-mono"
                    />
                  </div>
                </div>

                <div>
                  <label className="text-xs font-bold text-gray-600 block mb-1">Name on Card *</label>
                  <input
                    type="text"
                    name="nameOnCard"
                    required
                    placeholder="Jane Doe"
                    value={cardDetails.nameOnCard}
                    onChange={handleCardChange}
                    className="w-full px-4 py-2.5 rounded-xl border border-gray-200 text-xs sm:text-sm outline-none focus:border-[#0C534E] bg-white"
                  />
                </div>
              </div>

              {errorMsg && (
                <div className="p-3.5 rounded-xl bg-red-50 text-red-700 text-xs font-bold flex items-center gap-2">
                  <AlertCircle className="w-4 h-4 shrink-0" />
                  <span>{errorMsg}</span>
                </div>
              )}

              <button
                type="submit"
                disabled={isProcessing}
                className="w-full py-4 rounded-full bg-[#FFC800] text-[#162624] font-black text-base hover:bg-[#E5B400] shadow-xl shadow-[#FFC800]/25 transition duration-200 disabled:opacity-50 flex items-center justify-center gap-2 active:scale-95"
              >
                {isProcessing ? (
                  <>
                    <div className="w-5 h-5 border-2 border-[#162624] border-t-transparent rounded-full animate-spin" />
                    <span>Authorizing Payment...</span>
                  </>
                ) : (
                  <>
                    <Lock className="w-4 h-4" />
                    <span>Pay ${total.toFixed(2)} USD</span>
                  </>
                )}
              </button>
            </div>
          </div>

          {/* Right Column: Order Summary Breakdown */}
          <div className="lg:col-span-5 space-y-6">
            <div className="bg-white rounded-3xl p-6 sm:p-8 border border-gray-100 shadow-sm space-y-4">
              <h3 className="text-lg font-black text-[#162624]">Order Summary ({cart.length} items)</h3>

              {/* Items List */}
              <div className="divide-y divide-gray-100 max-h-72 overflow-y-auto pr-1">
                {cart.map((item) => (
                  <div key={item.product.id} className="py-3 flex items-center gap-3">
                    <div className="w-16 h-16 rounded-xl bg-[#FAFBF9] border border-gray-100 overflow-hidden relative shrink-0">
                      <Image
                        src={item.product.images[0]}
                        alt={item.product.name}
                        fill
                        className="object-cover"
                      />
                      <span className="absolute top-1 right-1 w-5 h-5 rounded-full bg-[#0C534E] text-[#FFC800] text-[0.62rem] font-bold flex items-center justify-center">
                        {item.quantity}
                      </span>
                    </div>
                    <div className="flex-1 min-w-0">
                      <h4 className="font-bold text-xs text-[#162624] truncate">{item.product.name}</h4>
                      <p className="text-[0.68rem] text-gray-500">{item.product.category}</p>
                    </div>
                    <span className="font-extrabold text-xs text-[#0C534E] tabular-nums">
                      ${(item.product.price * item.quantity).toFixed(2)}
                    </span>
                  </div>
                ))}
              </div>

              {/* Price Breakdown */}
              <div className="space-y-2 text-xs pt-3 border-t border-gray-100">
                <div className="flex justify-between text-gray-500">
                  <span>Subtotal</span>
                  <span className="font-bold text-[#162624] tabular-nums">${subtotal.toFixed(2)}</span>
                </div>
                {discountAmount > 0 && (
                  <div className="flex justify-between text-emerald-600 font-bold">
                    <span>Discount ({appliedCoupon?.code})</span>
                    <span className="tabular-nums">-${discountAmount.toFixed(2)}</span>
                  </div>
                )}
                <div className="flex justify-between text-gray-500">
                  <span>Standard U.S. Shipping</span>
                  <span className="font-bold text-[#162624]">
                    {isFreeShipping ? <span className="text-emerald-600">FREE</span> : `$${shippingCost.toFixed(2)}`}
                  </span>
                </div>
                <div className="flex justify-between text-gray-500">
                  <span>Estimated Taxes</span>
                  <span className="font-bold text-gray-400">Included</span>
                </div>
                <div className="flex justify-between text-base font-black text-[#162624] pt-3 border-t border-gray-200">
                  <span>Total Due</span>
                  <span className="text-[#0C534E] tabular-nums">${total.toFixed(2)}</span>
                </div>
              </div>

              {/* Trust Badges */}
              <div className="pt-4 border-t border-gray-100 space-y-2 text-[0.72rem] text-gray-500">
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-[#0C534E]" />
                  <span>30-Day Money-Back Play Guarantee</span>
                </div>
                <div className="flex items-center gap-2">
                  <Truck className="w-4 h-4 text-[#0C534E]" />
                  <span>Ships in 1-2 business days with USPS/UPS tracking</span>
                </div>
              </div>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}
