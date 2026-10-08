'use client';

import React, { useEffect, useState, Suspense } from 'react';
import { useParams } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import { Order } from '@/types';
import {
  CheckCircle2,
  Package,
  Truck,
  ArrowRight,
  Clock,
  Printer,
  ShieldCheck,
  Mail
} from 'lucide-react';

function OrderConfirmationContent() {
  const params = useParams();
  const orderId = params?.orderId as string;
  const [order, setOrder] = useState<Order | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch(`/api/orders/${orderId}`)
      .then((res) => res.json())
      .then((data) => {
        if (data.order) {
          setOrder(data.order);
        }
      })
      .catch((err) => console.error(err))
      .finally(() => setLoading(false));
  }, [orderId]);

  if (loading) {
    return (
      <div className="min-h-[70vh] flex items-center justify-center">
        <div className="w-10 h-10 border-4 border-[#0C534E] border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  if (!order) {
    return (
      <div className="min-h-[60vh] flex flex-col items-center justify-center p-6 text-center">
        <h2 className="text-xl font-bold text-[#162624]">Order not found</h2>
        <p className="text-sm text-gray-500 mt-1">We couldn&apos;t locate order #{orderId}.</p>
        <Link
          href="/"
          className="mt-4 px-6 py-2.5 rounded-full bg-[#0C534E] text-[#FFC800] text-sm font-bold"
        >
          Return Home
        </Link>
      </div>
    );
  }

  return (
    <div className="bg-[#FAFBF9] min-h-screen py-12 sm:py-20">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        {/* Success Header Card */}
        <div className="bg-white rounded-3xl p-8 sm:p-12 border border-gray-100 shadow-md text-center space-y-4">
          <div className="w-16 h-16 rounded-full bg-[#F0F7F6] text-[#0C534E] flex items-center justify-center mx-auto shadow-sm">
            <CheckCircle2 className="w-9 h-9 stroke-[2.5]" />
          </div>

          <div className="space-y-1">
            <span className="text-xs font-black uppercase tracking-widest text-[#0C534E]">
              Payment Confirmed
            </span>
            <h1 className="text-3xl sm:text-4xl font-black text-[#162624] tracking-tight">
              Thank You For Your Order!
            </h1>
            <p className="text-sm text-gray-500 max-w-md mx-auto">
              We&apos;ve sent a confirmation email with full receipt to{' '}
              <strong className="text-[#162624]">{order.customer.email}</strong>.
            </p>
          </div>

          <div className="inline-flex items-center gap-3 px-4 py-2 rounded-2xl bg-[#FAFBF9] border border-gray-200 text-xs">
            <span className="text-gray-500">Order Reference:</span>
            <span className="font-mono font-black text-sm text-[#0C534E]">{order.id}</span>
          </div>
        </div>

        {/* Dropshipping Fulfillment Timeline Status */}
        <div className="bg-white rounded-3xl p-6 sm:p-8 border border-gray-100 shadow-sm space-y-4">
          <h2 className="text-base font-black text-[#162624]">Fulfillment Timeline</h2>

          <div className="grid grid-cols-1 sm:grid-cols-4 gap-4 pt-2">
            <div className="p-4 rounded-2xl bg-[#F0F7F6] border border-[#0C534E]/30 space-y-1">
              <div className="flex items-center gap-2 text-xs font-bold text-[#0C534E]">
                <CheckCircle2 className="w-4 h-4 text-[#0C534E]" />
                <span>1. Order Placed</span>
              </div>
              <p className="text-[0.68rem] text-gray-500">Paid & Verified</p>
            </div>

            <div className="p-4 rounded-2xl bg-[#FFF6D6] border border-[#FFC800] space-y-1">
              <div className="flex items-center gap-2 text-xs font-bold text-[#162624]">
                <Clock className="w-4 h-4 text-[#FFC800]" />
                <span>2. Processing</span>
              </div>
              <p className="text-[0.68rem] text-gray-500">Warehouse Prep</p>
            </div>

            <div className="p-4 rounded-2xl bg-[#FAFBF9] border border-gray-200 space-y-1 opacity-60">
              <div className="flex items-center gap-2 text-xs font-bold text-gray-500">
                <Truck className="w-4 h-4" />
                <span>3. Dispatched</span>
              </div>
              <p className="text-[0.68rem] text-gray-400">Tracking assigned</p>
            </div>

            <div className="p-4 rounded-2xl bg-[#FAFBF9] border border-gray-200 space-y-1 opacity-60">
              <div className="flex items-center gap-2 text-xs font-bold text-gray-500">
                <Package className="w-4 h-4" />
                <span>4. Delivered</span>
              </div>
              <p className="text-[0.68rem] text-gray-400">Happy paws playing</p>
            </div>
          </div>
        </div>

        {/* Order Details & Summary */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-8">
          {/* Purchased Items */}
          <div className="md:col-span-7 bg-white rounded-3xl p-6 sm:p-8 border border-gray-100 shadow-sm space-y-4">
            <h3 className="text-base font-black text-[#162624]">Items in this Shipment</h3>

            <div className="divide-y divide-gray-100">
              {order.items.map((item) => (
                <div key={item.productId} className="py-4 flex items-center gap-4">
                  <div className="w-16 h-16 rounded-xl bg-[#FAFBF9] border border-gray-100 overflow-hidden relative shrink-0">
                    <Image src={item.image} alt={item.productName} fill className="object-cover" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <h4 className="font-extrabold text-sm text-[#162624] truncate">{item.productName}</h4>
                    <p className="text-xs text-gray-500">Qty: {item.quantity}</p>
                  </div>
                  <span className="font-extrabold text-sm text-[#0C534E] tabular-nums">
                    ${(item.price * item.quantity).toFixed(2)}
                  </span>
                </div>
              ))}
            </div>

            <div className="pt-4 border-t border-gray-100 space-y-2 text-xs">
              <div className="flex justify-between text-gray-500">
                <span>Subtotal</span>
                <span className="font-bold text-[#162624] tabular-nums">${order.subtotal.toFixed(2)}</span>
              </div>
              {order.discount > 0 && (
                <div className="flex justify-between text-emerald-600 font-bold">
                  <span>Discount</span>
                  <span className="tabular-nums">-${order.discount.toFixed(2)}</span>
                </div>
              )}
              <div className="flex justify-between text-gray-500">
                <span>Shipping</span>
                <span className="font-bold text-[#162624]">
                  {order.shippingCost === 0 ? 'FREE' : `$${order.shippingCost.toFixed(2)}`}
                </span>
              </div>
              <div className="flex justify-between text-base font-black text-[#162624] pt-2 border-t border-gray-200">
                <span>Total Paid</span>
                <span className="text-[#0C534E] tabular-nums">${order.total.toFixed(2)}</span>
              </div>
            </div>
          </div>

          {/* Customer & Shipping Destination */}
          <div className="md:col-span-5 space-y-6">
            <div className="bg-white rounded-3xl p-6 sm:p-8 border border-gray-100 shadow-sm space-y-4">
              <h3 className="text-base font-black text-[#162624]">Shipping Destination</h3>
              <div className="text-xs text-gray-600 space-y-1">
                <p className="font-extrabold text-sm text-[#162624]">
                  {order.customer.firstName} {order.customer.lastName}
                </p>
                <p>{order.customer.address}</p>
                {order.customer.apartment && <p>{order.customer.apartment}</p>}
                <p>
                  {order.customer.city}, {order.customer.state} {order.customer.zipCode}
                </p>
                <p>{order.customer.country}</p>
                <p className="pt-2 text-gray-400">{order.customer.phone}</p>
              </div>

              <div className="pt-4 border-t border-gray-100 flex items-center justify-between">
                <button
                  onClick={() => window.print()}
                  className="inline-flex items-center gap-1.5 text-xs font-bold text-gray-500 hover:text-[#0C534E]"
                >
                  <Printer className="w-4 h-4" />
                  <span>Print Receipt</span>
                </button>
                <Link
                  href="/shop"
                  className="inline-flex items-center gap-1 text-xs font-black text-[#0C534E] hover:underline"
                >
                  <span>Continue Shopping</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </Link>
              </div>
            </div>

            <div className="p-4 rounded-2xl bg-[#F0F7F6] border border-[#E2EBEA] flex items-center gap-3 text-xs text-[#0C534E]">
              <ShieldCheck className="w-5 h-5 text-[#FFC800] shrink-0" />
              <span>
                Backed by our 30-Day Play Guarantee. If your dog isn&apos;t delighted, reach out anytime.
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function OrderConfirmationPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-[70vh] flex items-center justify-center">
          <div className="w-10 h-10 border-4 border-[#0C534E] border-t-transparent rounded-full animate-spin" />
        </div>
      }
    >
      <OrderConfirmationContent />
    </Suspense>
  );
}
