import React from 'react';

export default function TermsPage() {
  return (
    <div className="bg-[#FAFBF9] min-h-screen py-12 sm:py-20">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        <div>
          <span className="text-xs font-black uppercase tracking-widest text-[#0C534E]">Terms</span>
          <h1 className="text-3xl sm:text-4xl font-black text-[#162624] tracking-tight mt-1">
            Terms & Conditions
          </h1>
          <p className="text-xs text-gray-500 mt-1">Last updated: October 2026</p>
        </div>

        <div className="bg-white rounded-3xl p-8 sm:p-12 border border-gray-100 shadow-sm space-y-6 text-sm text-gray-700 leading-relaxed">
          <section className="space-y-2">
            <h2 className="text-base font-extrabold text-[#162624]">1. Agreement to Terms</h2>
            <p>
              By accessing or using the ZenPaaw website, you agree to be bound by these Terms and Conditions and our standard operating policies.
            </p>
          </section>

          <section className="space-y-2">
            <h2 className="text-base font-extrabold text-[#162624]">2. Products & Supervised Play Guidance</h2>
            <p>
              ZenPaaw products are intended for domestic pet play and training. Because every animal has unique bite strength and habits, <strong>pets should always be supervised during playtime</strong>. Please regularly inspect toys for wear and tear and discard immediately if any component becomes damaged.
            </p>
          </section>

          <section className="space-y-2">
            <h2 className="text-base font-extrabold text-[#162624]">3. Pricing & Orders</h2>
            <p>
              All prices are listed in USD. We reserve the right to modify prices or correct errors without prior notice. An order is confirmed once payment authorization is verified by the payment processor.
            </p>
          </section>

          <section className="space-y-2">
            <h2 className="text-base font-extrabold text-[#162624]">4. Intellectual Property</h2>
            <p>
              The ZenPaaw™ name, logo mark, photography, and website content are the exclusive intellectual property of ZenPaaw.
            </p>
          </section>
        </div>
      </div>
    </div>
  );
}
