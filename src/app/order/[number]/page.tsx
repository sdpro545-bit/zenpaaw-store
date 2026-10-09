import React from 'react';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { db } from '@/lib/db';
import { CheckCircle2, Package, ArrowRight, ShieldCheck, Mail } from 'lucide-react';
import { RevealText } from '@/components/RevealText';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Order Confirmation | ZenPaaw',
  description: 'Your order has been confirmed and submitted for fulfillment.',
};

export const instant = false;

export default async function OrderConfirmationPage({
  params,
  searchParams,
}: {
  params: Promise<{ number: string }>;
  searchParams: Promise<{ email?: string }>;
}) {
  const { number } = await params;
  const { email = '' } = await searchParams;

  const order = db.getOrderByNumber(number);

  if (!order) {
    notFound();
  }

  // If email was passed in query, verify match
  if (email && order.email.toLowerCase() !== email.toLowerCase()) {
    notFound();
  }

  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-16 space-y-10">
      {/* Success Stamp Card */}
      <div className="bg-white rounded-3xl p-8 sm:p-12 border border-[#E2EBEA] shadow-sm text-center space-y-6">
        <div className="w-20 h-20 rounded-full bg-[#F0F7F6] text-[#0C534E] flex items-center justify-center mx-auto border-2 border-[#A3D2CD]">
          <CheckCircle2 className="w-10 h-10 text-[#0C534E]" />
        </div>

        <div className="space-y-2">
          <span className="text-xs font-black uppercase tracking-widest text-[#0C534E]">
            Payment Received & Verified
          </span>
          <RevealText as="h1" className="text-3xl sm:text-4xl font-black text-[#162624]">
            Order #{order.number} Confirmed
          </RevealText>
          <p className="text-sm text-gray-600 max-w-md mx-auto leading-relaxed">
            Thank you for ordering with ZenPaaw. A confirmation receipt has been sent to{' '}
            <strong className="text-[#162624]">{order.email}</strong>.
          </p>
        </div>

        <div className="p-4 rounded-2xl bg-[#FAFBF9] border border-gray-100 flex items-center justify-center gap-3 text-xs text-gray-600">
          <Mail className="w-4 h-4 text-[#0C534E]" />
          <span>Fulfillment dispatch notification and tracking link will follow via email.</span>
        </div>
      </div>

      {/* Order Summary */}
      <div className="bg-white rounded-3xl p-8 border border-[#E2EBEA] shadow-sm space-y-6">
        <h2 className="text-lg font-black text-[#162624] border-b border-gray-100 pb-4">
          Order Items
        </h2>

        <div className="divide-y divide-gray-100">
          {order.items.map((item) => (
            <div key={item.id} className="py-4 flex items-center justify-between gap-4">
              <div>
                <h3 className="font-extrabold text-sm text-[#162624]">{item.titleSnapshot}</h3>
                <span className="text-xs text-gray-500">Qty: {item.qty}</span>
              </div>
              <span className="font-black text-sm text-[#0C534E] tabular-nums">
                ${((item.priceSnapshotCents * item.qty) / 100).toFixed(2)}
              </span>
            </div>
          ))}
        </div>

        <div className="pt-4 border-t border-gray-100 space-y-2 text-xs">
          <div className="flex justify-between text-gray-600">
            <span>Subtotal</span>
            <span className="font-bold tabular-nums">${(order.subtotalCents / 100).toFixed(2)}</span>
          </div>
          <div className="flex justify-between text-gray-600">
            <span>Shipping</span>
            <span className="font-bold tabular-nums">
              {order.shippingCents === 0 ? 'FREE' : `$${(order.shippingCents / 100).toFixed(2)}`}
            </span>
          </div>
          <div className="flex justify-between text-base font-black text-[#162624] pt-2 border-t border-gray-100">
            <span>Total</span>
            <span className="text-[#0C534E] tabular-nums">${(order.totalCents / 100).toFixed(2)}</span>
          </div>
        </div>
      </div>

      {/* Next Steps */}
      <div className="text-center space-y-4">
        <Link
          href={`/track`}
          className="inline-flex items-center gap-2 px-8 py-3.5 rounded-full bg-[#0C534E] text-[#FFC800] text-xs font-black uppercase tracking-wider hover:bg-[#093B37] transition shadow-md"
        >
          <span>Track Order Progress</span>
          <ArrowRight className="w-4 h-4" />
        </Link>
      </div>
    </div>
  );
}
