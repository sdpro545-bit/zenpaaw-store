'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { ChevronDown, ChevronUp, Search, ArrowRight, HelpCircle } from 'lucide-react';

export default function FaqPage() {
  const [openFaq, setOpenFaq] = useState<number | null>(0);
  const [searchTerm, setSearchTerm] = useState('');

  const faqData = [
    {
      category: 'Product & Play',
      q: 'What is the ZenPaaw 3-in-1 Pet Toy?',
      a: 'The ZenPaaw 3-in-1 Pet Toy brings together three distinct functions: a textured rubber ball for bouncing, a ribbed cylindrical roller with raised rubber ridges for chewing, and a braided rope handle for long fetch launches and outdoor tugging.'
    },
    {
      category: 'Product & Play',
      q: 'What types of play does the toy support?',
      a: 'It supports solo exploratory play, satisfying chewing sessions with textured surface ridges, and high-energy interactive fetch games in the yard or park.'
    },
    {
      category: 'Product & Play',
      q: 'Is the toy suitable for every dog size and breed?',
      a: 'It is ideally sized for small-to-large dogs ranging from 15 lbs to 75 lbs. While constructed from heavy-duty non-toxic TPR rubber, no pet toy is 100% indestructible. We recommend supervising all playtime and removing any toy if damaged.'
    },
    {
      category: 'Product & Play',
      q: 'How do I clean and sanitize the toy?',
      a: 'The rubber ball and dental cylinder can be quickly rinsed with warm soapy water or washed on the top rack of your dishwasher. The cotton-poly rope can be hand-washed or spot-cleaned.'
    },
    {
      category: 'Shipping & Delivery',
      q: 'Where do you ship and what are the delivery costs?',
      a: 'We currently ship to all 50 U.S. states. Orders over $35 receive Free Standard U.S. Shipping. Orders under $35 ship at a flat standard rate of $4.99.'
    },
    {
      category: 'Shipping & Delivery',
      q: 'How long does shipping take to arrive?',
      a: 'Orders are processed within 1 to 2 business days. Standard delivery across the continental U.S. takes between 3 to 5 business days. Real-time carrier tracking is provided via email as soon as your package is dispatched.'
    },
    {
      category: 'Shipping & Delivery',
      q: 'How do I track my order?',
      a: 'Once your order is dispatched, you will receive an automatic email containing your USPS/UPS tracking link. You can also view real-time fulfillment status on your Order Confirmation receipt page.'
    },
    {
      category: 'Returns & Guarantee',
      q: 'What is your 30-Day Play Guarantee?',
      a: 'We want both you and your pet to be completely happy. If your dog doesn’t enjoy the toy within 30 days of receiving it, simply reach out to support@zenpaaw.com and we will issue a full refund or free replacement.'
    }
  ];

  const filteredFaqs = faqData.filter(
    (f) =>
      f.q.toLowerCase().includes(searchTerm.toLowerCase()) ||
      f.a.toLowerCase().includes(searchTerm.toLowerCase()) ||
      f.category.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="bg-[#FAFBF9] min-h-screen py-12 sm:py-20">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 space-y-10">
        <div className="text-center space-y-3">
          <span className="px-3.5 py-1 rounded-full bg-[#F0F7F6] text-[#0C534E] text-xs font-black uppercase tracking-widest inline-block">
            Help Center
          </span>
          <h1 className="text-4xl sm:text-5xl font-black text-[#162624] tracking-tight">
            Frequently Asked Questions
          </h1>
          <p className="text-sm sm:text-base text-gray-500 max-w-lg mx-auto">
            Got questions about our pet toys, materials, or shipping? Find clear answers below.
          </p>

          {/* Search Bar */}
          <div className="pt-4 max-w-md mx-auto">
            <div className="relative">
              <Search className="w-4 h-4 text-gray-400 absolute left-4 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                placeholder="Search questions (e.g. cleaning, shipping, sizing)..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-11 pr-4 py-3 rounded-full bg-white border border-gray-200 text-xs sm:text-sm outline-none focus:border-[#0C534E] shadow-sm"
              />
            </div>
          </div>
        </div>

        {/* FAQ Accordion List */}
        <div className="space-y-3">
          {filteredFaqs.map((faq, idx) => {
            const isOpen = openFaq === idx;
            return (
              <div
                key={faq.q}
                className={`rounded-2xl border transition-all duration-200 overflow-hidden ${
                  isOpen
                    ? 'bg-[#0C534E] text-white border-[#0C534E] shadow-md'
                    : 'bg-[#FFC800] text-[#162624] border-[#FFC800] hover:bg-[#E5B400]'
                }`}
              >
                <button
                  onClick={() => setOpenFaq(isOpen ? null : idx)}
                  className="w-full px-6 py-4.5 flex items-center justify-between text-left font-black text-sm sm:text-base gap-4"
                >
                  <div>
                    <span className="text-[0.68rem] uppercase font-bold tracking-wider opacity-70 block mb-0.5">
                      {faq.category}
                    </span>
                    <span>{faq.q}</span>
                  </div>
                  {isOpen ? (
                    <ChevronUp className="w-5 h-5 shrink-0 text-[#FFC800]" />
                  ) : (
                    <ChevronDown className="w-5 h-5 shrink-0 text-[#162624]" />
                  )}
                </button>

                {isOpen && (
                  <div className="px-6 pb-5 pt-1 text-xs sm:text-sm text-[#D3E8E6] leading-relaxed border-t border-white/10">
                    {faq.a}
                  </div>
                )}
              </div>
            );
          })}
        </div>

        {/* Support Help Card */}
        <div className="p-8 rounded-3xl bg-white border border-gray-200 text-center space-y-3 shadow-sm">
          <HelpCircle className="w-8 h-8 text-[#0C534E] mx-auto" />
          <h3 className="text-lg font-black text-[#162624]">Still have questions?</h3>
          <p className="text-xs sm:text-sm text-gray-500 max-w-sm mx-auto">
            Our pet parent care team is happy to help with breed sizing recommendations and orders.
          </p>
          <div className="pt-2">
            <Link
              href="/contact"
              className="inline-flex items-center gap-2 px-6 py-2.5 rounded-full bg-[#0C534E] text-[#FFC800] text-xs font-black hover:bg-[#093B37] transition"
            >
              <span>Contact Pet Support</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
