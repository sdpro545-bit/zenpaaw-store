import React from 'react';

export default function PrivacyPage() {
  return (
    <div className="bg-[#FAFBF9] min-h-screen py-12 sm:py-20">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        <div>
          <span className="text-xs font-black uppercase tracking-widest text-[#0C534E]">Legal</span>
          <h1 className="text-3xl sm:text-4xl font-black text-[#162624] tracking-tight mt-1">
            Privacy Policy
          </h1>
          <p className="text-xs text-gray-500 mt-1">Last updated: October 2026</p>
        </div>

        <div className="bg-white rounded-3xl p-8 sm:p-12 border border-gray-100 shadow-sm space-y-6 text-sm text-gray-700 leading-relaxed">
          <section className="space-y-2">
            <h2 className="text-base font-extrabold text-[#162624]">1. Information We Collect</h2>
            <p>
              When you visit or make a purchase from ZenPaaw, we collect personal information you provide to us, including your name, shipping address, billing address, email address, and phone number, solely to process and deliver your order.
            </p>
          </section>

          <section className="space-y-2">
            <h2 className="text-base font-extrabold text-[#162624]">2. Payment Information Security</h2>
            <p>
              All payment transactions are encrypted and tokenized using industry-standard payment gateways (e.g., Stripe). We never collect, view, or store raw credit card numbers or security CVV codes on our servers.
            </p>
          </section>

          <section className="space-y-2">
            <h2 className="text-base font-extrabold text-[#162624]">3. How We Use Your Information</h2>
            <p>
              We use your information strictly to fulfill orders, process payments, provide tracking updates, and communicate with you about your order status. We never sell or rent your personal information to third parties.
            </p>
          </section>

          <section className="space-y-2">
            <h2 className="text-base font-extrabold text-[#162624]">4. Cookies and Analytics</h2>
            <p>
              We utilize cookies to maintain your shopping cart across browser sessions and collect anonymous marketing analytics to improve storefront performance.
            </p>
          </section>

          <section className="space-y-2">
            <h2 className="text-base font-extrabold text-[#162624]">5. Contact Us</h2>
            <p>
              For privacy-related inquiries, contact us at <strong>privacy@zenpaaw.com</strong>.
            </p>
          </section>
        </div>
      </div>
    </div>
  );
}
