import React from 'react';
import Link from 'next/link';
import { Truck, Clock, ShieldCheck, MapPin } from 'lucide-react';

export default function ShippingPage() {
  return (
    <div className="bg-[#FAFBF9] min-h-screen py-12 sm:py-20">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 space-y-10">
        <div className="text-center space-y-3">
          <span className="px-3.5 py-1 rounded-full bg-[#F0F7F6] text-[#0C534E] text-xs font-black uppercase tracking-widest inline-block">
            Fast & Reliable
          </span>
          <h1 className="text-4xl sm:text-5xl font-black text-[#162624] tracking-tight">
            Shipping & Delivery Policy
          </h1>
          <p className="text-sm sm:text-base text-gray-500 max-w-lg mx-auto">
            Clear delivery timelines and shipping options across the United States.
          </p>
        </div>

        <div className="bg-white rounded-3xl p-8 sm:p-12 border border-gray-100 shadow-sm space-y-8 text-sm text-gray-700 leading-relaxed">
          {/* Shipping Tiers Table */}
          <div>
            <h2 className="text-xl font-black text-[#162624] mb-4">U.S. Shipping Rates & Speeds</h2>
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs border border-gray-100 rounded-2xl overflow-hidden">
                <thead className="bg-[#F0F7F6] text-[#0C534E] font-extrabold uppercase">
                  <tr>
                    <th className="p-3.5">Method</th>
                    <th className="p-3.5">Estimated Transit</th>
                    <th className="p-3.5">Order Threshold</th>
                    <th className="p-3.5">Cost</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  <tr>
                    <td className="p-3.5 font-bold">Standard U.S. Shipping</td>
                    <td className="p-3.5">3 – 5 business days</td>
                    <td className="p-3.5 font-bold text-emerald-600">Orders $35.00 and above</td>
                    <td className="p-3.5 font-black text-emerald-600">FREE</td>
                  </tr>
                  <tr>
                    <td className="p-3.5 font-bold">Standard U.S. Shipping</td>
                    <td className="p-3.5">3 – 5 business days</td>
                    <td className="p-3.5">Orders under $35.00</td>
                    <td className="p-3.5 font-bold text-[#0C534E]">$4.99 flat rate</td>
                  </tr>
                  <tr>
                    <td className="p-3.5 font-bold">Express Air Delivery</td>
                    <td className="p-3.5">1 – 2 business days</td>
                    <td className="p-3.5">Any order value</td>
                    <td className="p-3.5 font-bold text-[#0C534E]">$9.99</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>

          <div className="space-y-4">
            <h3 className="text-lg font-black text-[#162624]">Order Processing Time</h3>
            <p>
              All orders placed Monday through Friday are processed within <strong>24 to 48 hours</strong>. Once your order has been packaged and handed over to our carrier (USPS or UPS), you will immediately receive an automated confirmation email with a live tracking link.
            </p>
          </div>

          <div className="space-y-4">
            <h3 className="text-lg font-black text-[#162624]">Tracking Your Shipment</h3>
            <p>
              Your tracking number allows you to follow the package at every stage from dispatch to delivery. If you have not received tracking within 3 business days of placing your order, please reach out to <Link href="/contact" className="text-[#0C534E] font-bold underline">support@zenpaaw.com</Link> with your order number.
            </p>
          </div>

          <div className="p-6 rounded-2xl bg-[#FAFBF9] border border-gray-200 flex items-start gap-3.5">
            <ShieldCheck className="w-6 h-6 text-[#0C534E] shrink-0 mt-0.5" />
            <div className="text-xs">
              <h4 className="font-bold text-[#162624] text-sm mb-1">Lost or Damaged in Transit?</h4>
              <p className="text-gray-600">
                If your package arrives damaged or gets delayed past the carrier delivery window, contact our team and we will issue an immediate replacement at zero extra cost.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
