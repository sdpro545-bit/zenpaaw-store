'use client';

import React, { useState } from 'react';
import { Mail, Clock, ShieldCheck, Check, MessageSquare } from 'lucide-react';

export default function ContactPage() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    orderNumber: '',
    subject: 'General Question',
    message: ''
  });
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitted(true);
  };

  return (
    <div className="bg-[#FAFBF9] min-h-screen py-12 sm:py-20">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
        <div className="text-center space-y-3">
          <span className="px-3.5 py-1 rounded-full bg-[#F0F7F6] text-[#0C534E] text-xs font-black uppercase tracking-widest inline-block">
            We&apos;re Here To Help
          </span>
          <h1 className="text-4xl sm:text-5xl font-black text-[#162624] tracking-tight">
            Contact Pet Parent Support
          </h1>
          <p className="text-sm sm:text-base text-gray-500 max-w-md mx-auto">
            Have questions about an existing order, shipping, or toy sizing? Reach out and we will get back to you promptly.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-12 gap-8 items-start">
          {/* Contact Details Card */}
          <div className="md:col-span-5 space-y-4">
            <div className="bg-white rounded-3xl p-6 sm:p-8 border border-gray-100 shadow-sm space-y-6">
              <div className="flex items-start gap-3.5">
                <div className="w-10 h-10 rounded-2xl bg-[#0C534E] text-[#FFC800] flex items-center justify-center shrink-0">
                  <Mail className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="font-extrabold text-sm text-[#162624]">Email Support</h4>
                  <p className="text-xs text-gray-500 mt-0.5">support@zenpaaw.com</p>
                  <span className="text-[0.68rem] text-emerald-600 font-bold block mt-1">
                    Replies within 12–24 hours
                  </span>
                </div>
              </div>

              <div className="flex items-start gap-3.5">
                <div className="w-10 h-10 rounded-2xl bg-[#0C534E] text-[#FFC800] flex items-center justify-center shrink-0">
                  <Clock className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="font-extrabold text-sm text-[#162624]">Support Hours</h4>
                  <p className="text-xs text-gray-500 mt-0.5">Monday – Friday: 9am – 6pm EST</p>
                  <p className="text-xs text-gray-500">Saturday: 10am – 4pm EST</p>
                </div>
              </div>

              <div className="flex items-start gap-3.5">
                <div className="w-10 h-10 rounded-2xl bg-[#0C534E] text-[#FFC800] flex items-center justify-center shrink-0">
                  <ShieldCheck className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="font-extrabold text-sm text-[#162624]">30-Day Guarantee</h4>
                  <p className="text-xs text-gray-500 mt-0.5">
                    Need an exchange or refund? Send your order number and we will resolve it immediately.
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Contact Message Form */}
          <div className="md:col-span-7 bg-white rounded-3xl p-6 sm:p-8 border border-gray-100 shadow-sm">
            {submitted ? (
              <div className="text-center py-10 space-y-3">
                <div className="w-14 h-14 rounded-full bg-emerald-50 text-emerald-700 flex items-center justify-center mx-auto">
                  <Check className="w-7 h-7" />
                </div>
                <h3 className="text-xl font-black text-[#162624]">Message Received!</h3>
                <p className="text-xs text-gray-500 max-w-xs mx-auto">
                  Thank you for reaching out. One of our pet care specialists will reply to{' '}
                  <strong className="text-[#162624]">{formData.email}</strong> shortly.
                </p>
                <button
                  onClick={() => setSubmitted(false)}
                  className="mt-4 px-6 py-2 rounded-full bg-[#0C534E] text-[#FFC800] text-xs font-bold"
                >
                  Send Another Message
                </button>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-4">
                <h3 className="font-extrabold text-base text-[#162624] flex items-center gap-2">
                  <MessageSquare className="w-4 h-4 text-[#0C534E]" />
                  <span>Send Us a Message</span>
                </h3>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="text-xs font-bold text-gray-600 block mb-1">Your Name *</label>
                    <input
                      type="text"
                      required
                      placeholder="Jane Doe"
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      className="w-full px-4 py-2.5 rounded-xl border border-gray-200 text-xs outline-none focus:border-[#0C534E]"
                    />
                  </div>
                  <div>
                    <label className="text-xs font-bold text-gray-600 block mb-1">Email Address *</label>
                    <input
                      type="email"
                      required
                      placeholder="jane@example.com"
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                      className="w-full px-4 py-2.5 rounded-xl border border-gray-200 text-xs outline-none focus:border-[#0C534E]"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="text-xs font-bold text-gray-600 block mb-1">Order ID (If Applicable)</label>
                    <input
                      type="text"
                      placeholder="e.g. ZP-10829"
                      value={formData.orderNumber}
                      onChange={(e) => setFormData({ ...formData, orderNumber: e.target.value })}
                      className="w-full px-4 py-2.5 rounded-xl border border-gray-200 text-xs font-mono outline-none focus:border-[#0C534E]"
                    />
                  </div>
                  <div>
                    <label className="text-xs font-bold text-gray-600 block mb-1">Topic</label>
                    <select
                      value={formData.subject}
                      onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                      className="w-full px-3 py-2.5 rounded-xl border border-gray-200 text-xs font-bold outline-none focus:border-[#0C534E] bg-white"
                    >
                      <option value="General Question">General Question</option>
                      <option value="Order Status">Order Status & Tracking</option>
                      <option value="Returns & Refunds">Returns & 30-Day Guarantee</option>
                      <option value="Product Sizing">Toy Sizing & Safety</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label className="text-xs font-bold text-gray-600 block mb-1">Your Message *</label>
                  <textarea
                    rows={4}
                    required
                    placeholder="How can we help your pet today?"
                    value={formData.message}
                    onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                    className="w-full px-4 py-2.5 rounded-xl border border-gray-200 text-xs outline-none focus:border-[#0C534E]"
                  />
                </div>

                <button
                  type="submit"
                  className="w-full py-3.5 rounded-full bg-[#0C534E] text-[#FFC800] font-black text-xs sm:text-sm hover:bg-[#093B37] shadow-lg shadow-[#0C534E]/20 transition"
                >
                  Send Inquiry
                </button>
              </form>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
