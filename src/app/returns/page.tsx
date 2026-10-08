import React from 'react';
import Link from 'next/link';
import { RotateCcw, Check, Heart, ArrowRight } from 'lucide-react';

export default function ReturnsPage() {
  return (
    <div className="bg-[#FAFBF9] min-h-screen py-12 sm:py-20">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 space-y-10">
        <div className="text-center space-y-3">
          <span className="px-3.5 py-1 rounded-full bg-[#F0F7F6] text-[#0C534E] text-xs font-black uppercase tracking-widest inline-block">
            Risk-Free Play
          </span>
          <h1 className="text-4xl sm:text-5xl font-black text-[#162624] tracking-tight">
            Returns & 30-Day Play Guarantee
          </h1>
          <p className="text-sm sm:text-base text-gray-500 max-w-lg mx-auto">
            We want your dog to love their new toy. If they aren&apos;t delighted, we make returns simple.
          </p>
        </div>

        <div className="bg-white rounded-3xl p-8 sm:p-12 border border-gray-100 shadow-sm space-y-8 text-sm text-gray-700 leading-relaxed">
          <div className="space-y-4">
            <h2 className="text-xl font-black text-[#162624]">Our 30-Day Play Guarantee</h2>
            <p>
              Every ZenPaaw product comes with our <strong>30-Day Play Guarantee</strong>. If your pet does not engage with the toy, or if you are unsatisfied with the quality within 30 days of delivery, you are entitled to a full refund or a free product exchange.
            </p>
          </div>

          <div className="space-y-4">
            <h3 className="text-lg font-black text-[#162624]">How to Request a Return or Exchange</h3>
            <ol className="list-decimal pl-5 space-y-2 text-xs sm:text-sm">
              <li>
                Email us at <strong className="text-[#162624]">support@zenpaaw.com</strong> with your order number (e.g., ZP-10829).
              </li>
              <li>
                Briefly share feedback on how your pet interacted with the toy so we can continue improving our designs.
              </li>
              <li>
                Our support team will issue a prepaid return shipping label or authorize a direct replacement within 24 hours.
              </li>
            </ol>
          </div>

          <div className="space-y-4">
            <h3 className="text-lg font-black text-[#162624]">Refund Processing</h3>
            <p>
              Once your return is received or verified, your refund will be processed back to your original payment method (Credit Card, Apple Pay, etc.) within <strong>3 to 5 business days</strong>.
            </p>
          </div>

          <div className="pt-4 border-t border-gray-100 flex items-center justify-between">
            <span className="text-xs text-gray-500">Need help with an existing order?</span>
            <Link
              href="/contact"
              className="px-6 py-2.5 rounded-full bg-[#0C534E] text-[#FFC800] text-xs font-bold hover:bg-[#093B37] transition"
            >
              Contact Support Team
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
