'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { Search, Package, Truck, CheckCircle2, Clock, AlertCircle } from 'lucide-react';

export default function TrackOrderPage() {
  const [orderNumber, setOrderNumber] = useState('');
  const [email, setEmail] = useState('');
  const [order, setOrder] = useState<any | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const handleTrack = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
      const res = await fetch(`/api/orders/lookup?number=${encodeURIComponent(orderNumber.trim())}&email=${encodeURIComponent(email.trim())}`);
      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || 'Order not found with provided number and email.');
      }
      setOrder(data.order);
    } catch (err: any) {
      setError(err.message);
      setOrder(null);
    } finally {
      setLoading(false);
    }
  };

  const steps = [
    { key: 'paid', label: 'Order Confirmed', icon: CheckCircle2 },
    { key: 'sent_to_supplier', label: 'Processing at Facility', icon: Clock },
    { key: 'shipped', label: 'Dispatched & In Transit', icon: Truck },
    { key: 'delivered', label: 'Delivered', icon: Package },
  ];

  const getStatusIndex = (status: string) => {
    if (status === 'delivered') return 3;
    if (status === 'shipped') return 2;
    if (status === 'sent_to_supplier') return 1;
    return 0;
  };

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-10 sm:py-16 space-y-10">
      {/* Header */}
      <div className="text-center max-w-xl mx-auto space-y-2">
        <span className="text-xs font-black uppercase tracking-widest text-[#0C534E]">
          Real-Time Fulfillment
        </span>
        <h1 className="text-3xl sm:text-4xl font-black text-[#162624]">Track Your Order</h1>
        <p className="text-xs sm:text-sm text-gray-500">
          Enter your order number (e.g. ZP-100001) and customer email to view shipment progress.
        </p>
      </div>

      {/* Lookup Form */}
      <div className="bg-white rounded-3xl p-6 sm:p-10 border border-[#E2EBEA] shadow-sm max-w-xl mx-auto">
        <form onSubmit={handleTrack} className="space-y-4">
          <div>
            <label className="text-xs font-black uppercase tracking-wider text-[#162624] block mb-1.5">
              Order Number
            </label>
            <input
              type="text"
              required
              value={orderNumber}
              onChange={(e) => setOrderNumber(e.target.value)}
              placeholder="ZP-100001"
              className="w-full px-4 py-3 rounded-2xl border border-gray-200 text-sm outline-none focus:border-[#0C534E]"
            />
          </div>

          <div>
            <label className="text-xs font-black uppercase tracking-wider text-[#162624] block mb-1.5">
              Billing or Shipping Email
            </label>
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="customer@example.com"
              className="w-full px-4 py-3 rounded-2xl border border-gray-200 text-sm outline-none focus:border-[#0C534E]"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3.5 rounded-full bg-[#0C534E] text-[#FFC800] font-black text-xs uppercase tracking-wider hover:bg-[#093B37] transition shadow-md flex items-center justify-center gap-2"
          >
            {loading ? (
              <span className="w-4 h-4 border-2 border-[#FFC800] border-t-transparent rounded-full animate-spin" />
            ) : (
              <>
                <Search className="w-4 h-4" />
                <span>Track Order</span>
              </>
            )}
          </button>
        </form>

        {error && (
          <div className="mt-4 p-4 rounded-2xl bg-red-50 text-red-700 text-xs font-bold flex items-center gap-2">
            <AlertCircle className="w-4 h-4 shrink-0" />
            <span>{error}</span>
          </div>
        )}
      </div>

      {/* Order Status Display */}
      {order && (
        <div className="bg-white rounded-3xl p-6 sm:p-10 border border-[#E2EBEA] shadow-sm space-y-8 animate-fadeIn">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-gray-100 pb-6">
            <div>
              <span className="text-xs font-bold text-gray-400 uppercase tracking-wider">Order Status</span>
              <h2 className="text-2xl font-black text-[#162624] mt-0.5">{order.number}</h2>
            </div>
            <div className="px-4 py-1.5 rounded-full bg-[#F0F7F6] text-[#0C534E] text-xs font-black uppercase tracking-wider w-fit">
              {order.status.replace(/_/g, ' ')}
            </div>
          </div>

          {/* Progress Timeline */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            {steps.map((st, idx) => {
              const currentIdx = getStatusIndex(order.status);
              const isPastOrCurrent = currentIdx >= idx;
              const Icon = st.icon;
              return (
                <div
                  key={st.key}
                  className={`p-4 rounded-2xl border text-center space-y-2 ${
                    isPastOrCurrent
                      ? 'border-[#0C534E] bg-[#F0F7F6] text-[#0C534E]'
                      : 'border-gray-100 text-gray-400 bg-gray-50'
                  }`}
                >
                  <Icon className="w-6 h-6 mx-auto" />
                  <span className="text-xs font-bold block">{st.label}</span>
                </div>
              );
            })}
          </div>

          {/* Shipment Details if present */}
          {order.shipments && order.shipments.length > 0 && (
            <div className="p-4 rounded-2xl bg-[#FAFBF9] border border-gray-100 space-y-2 text-xs">
              <span className="font-bold text-[#162624] block">Carrier Tracking:</span>
              {order.shipments.map((s: any) => (
                <div key={s.id} className="flex items-center justify-between">
                  <span>{s.carrier || 'Standard Freight'}: <strong>{s.trackingNumber}</strong></span>
                  {s.trackingUrl && (
                    <a
                      href={s.trackingUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-[#0C534E] font-bold underline"
                    >
                      Track on Carrier
                    </a>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
