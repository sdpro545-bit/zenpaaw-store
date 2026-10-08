'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { initialProducts } from '@/data/products';
import { useCart } from '@/context/CartContext';
import { ProductCard } from '@/components/ProductCard';
import {
  Sparkles,
  ArrowRight,
  ShieldCheck,
  Check,
  Star,
  ChevronDown,
  ChevronUp,
  PackageCheck,
  Smile,
  Zap,
  ShoppingBag
} from 'lucide-react';

export default function HomePage() {
  const { addToCart } = useCart();
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [openFaqIndex, setOpenFaqIndex] = useState<number | null>(0);

  const flagshipProduct = initialProducts.find((p) => p.isFlagship) || initialProducts[0];

  const categories = ['All', 'Dog Toys', 'Chew Toys', 'Interactive Toys', 'Fetch & Outdoor', 'Best Sellers'];

  const filteredProducts =
    selectedCategory === 'All'
      ? initialProducts
      : initialProducts.filter((p) => p.category === selectedCategory || (selectedCategory === 'Best Sellers' && p.isBestSeller));

  const faqs = [
    {
      q: 'What is the ZenPaaw 3-in-1 Pet Toy?',
      a: 'The ZenPaaw 3-in-1 is an all-in-one enrichment toy engineered with a textured bouncy rubber ball, a ribbed dental chew roller with scraping nubs, and a heavy-duty braided rope. It gives your dog three distinct play experiences (play, chew, and fetch) without needing three separate toys.'
    },
    {
      q: 'What types of play does it support?',
      a: 'It supports solo play and rolling, satisfying dental chewing to clean gums, and active outdoor fetch and gentle tug-of-war games with pet parents.'
    },
    {
      q: 'Is it suitable for every dog breed?',
      a: 'It is ideally balanced for medium to large dogs (20 to 75 lbs) and active chewers. While engineered with durable, non-toxic TPR rubber, no pet toy is completely indestructible. We always recommend supervising your dog during initial play sessions.'
    },
    {
      q: 'How do I clean and sanitize the toy?',
      a: 'Simply rinse with warm soapy water after outdoor fetch sessions. The rubber ball and roller modules are also top-rack dishwasher safe for easy sanitization.'
    },
    {
      q: 'How long does shipping take and where do you ship?',
      a: 'We ship across the entire United States. Standard delivery takes 3 to 5 business days, and orders over $35 qualify for Free Standard U.S. Shipping. Expedited shipping is available at checkout.'
    },
    {
      q: 'What is your 30-Day Play Guarantee?',
      a: 'If your dog doesn’t love playing with the ZenPaaw 3-in-1 toy within 30 days of delivery, contact our support team and we will provide a full refund or exchange—no friction.'
    }
  ];

  return (
    <div className="flex flex-col">
      {/* ========================================================= */}
      {/* 01. HERO SECTION (Deep Teal dominant with Yellow Organic Blob) */}
      {/* ========================================================= */}
      <section className="relative overflow-hidden bg-[#0C534E] text-white pt-10 pb-16 lg:pt-16 lg:pb-24">
        {/* Subtle background decorative paw watermarks */}
        <div className="absolute inset-0 opacity-5 pointer-events-none bg-[radial-gradient(#FFC800_1px,transparent_1px)] [background-size:28px_28px]" />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-8 items-center">
            {/* Left Content Column */}
            <div className="lg:col-span-7 space-y-6 text-center lg:text-left">
              {/* Eyebrow badge */}
              <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/10 backdrop-blur-md border border-white/20 text-[#FFC800] text-xs font-black uppercase tracking-widest shadow-sm">
                <Sparkles className="w-3.5 h-3.5 fill-[#FFC800]" />
                <span>BETTER PLAY. HAPPIER PETS.</span>
              </div>

              {/* Main Headline */}
              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-black tracking-tight leading-[1.08] text-white">
                More Play. <br />
                <span className="text-[#FFC800]">More Fun.</span> <br />
                Happier Paws.
              </h1>

              {/* Supporting Copy */}
              <p className="text-base sm:text-lg text-[#D3E8E6] max-w-xl mx-auto lg:mx-0 font-medium leading-relaxed">
                Thoughtfully selected pet toys designed to keep dogs engaged, active, and ready to play. Experience the flagship 3-in-1 toy that combines play, chew, and fetch in one durable design.
              </p>

              {/* Action Buttons */}
              <div className="flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-4 pt-2">
                <a
                  href="#flagship"
                  className="w-full sm:w-auto px-8 py-4 rounded-full bg-[#FFC800] text-[#162624] font-black text-base hover:bg-[#E5B400] shadow-xl shadow-[#FFC800]/25 transition duration-200 transform hover:-translate-y-0.5 text-center flex items-center justify-center gap-2 group"
                >
                  <span>Explore 3-in-1 Toy</span>
                  <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition" />
                </a>

                <Link
                  href="/shop"
                  className="w-full sm:w-auto px-8 py-4 rounded-full bg-white/10 hover:bg-white/20 text-white font-bold text-base border border-white/30 backdrop-blur-sm transition duration-200 text-center"
                >
                  Shop All Toys
                </Link>
              </div>

              {/* Key Trust Signals */}
              <div className="pt-6 border-t border-white/15 flex flex-wrap items-center justify-center lg:justify-start gap-6 text-xs text-[#D3E8E6] font-semibold">
                <div className="flex items-center gap-2">
                  <ShieldCheck className="w-4 h-4 text-[#FFC800]" />
                  <span>Non-Toxic Food-Grade Rubber</span>
                </div>
                <div className="flex items-center gap-2">
                  <Check className="w-4 h-4 text-[#FFC800]" />
                  <span>Free U.S. Shipping Over $35</span>
                </div>
                <div className="flex items-center gap-2">
                  <Star className="w-4 h-4 fill-[#FFC800] text-[#FFC800]" />
                  <span>4.9 / 5 Pet Parent Rating</span>
                </div>
              </div>
            </div>

            {/* Right Media Column with Dog + 3-in-1 Toy + Organic Yellow Shape */}
            <div className="lg:col-span-5 relative flex items-center justify-center">
              {/* Reference-inspired Organic Warm Yellow Blob */}
              <div className="absolute w-[320px] h-[320px] sm:w-[420px] sm:h-[420px] bg-[#FFC800] organic-shape-yellow -z-0 opacity-90 blur-none transform rotate-6 scale-105" />

              {/* Secondary Soft Teal Depth Shape */}
              <div className="absolute w-[300px] h-[300px] sm:w-[380px] sm:h-[380px] bg-[#093B37] organic-shape-teal -z-0 -top-4 -left-4 opacity-40" />

              {/* Main Cutout Pet Composition Image */}
              <div className="relative z-10 w-full max-w-[420px] aspect-[4/3] sm:aspect-square rounded-3xl overflow-hidden shadow-2xl border-4 border-white/20">
                <Image
                  src="/images/hero-dog.jpg"
                  alt="Happy Golden Retriever playing with ZenPaaw 3-in-1 Pet Toy"
                  fill
                  priority
                  className="object-cover object-center"
                />

                {/* Floating Value Pill */}
                <div className="absolute bottom-4 left-4 right-4 bg-white/95 backdrop-blur-md rounded-2xl p-3 shadow-xl border border-gray-100 flex items-center justify-between">
                  <div>
                    <span className="text-[0.68rem] font-black uppercase tracking-wider text-[#0C534E] block">
                      Flagship Concept
                    </span>
                    <h4 className="text-sm font-extrabold text-[#162624]">ZenPaaw 3-in-1 Toy</h4>
                  </div>
                  <div className="text-right">
                    <span className="text-base font-black text-[#0C534E] block">$24.99</span>
                    <span className="text-[0.65rem] text-emerald-600 font-bold">Ready to Ship</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ========================================================= */}
      {/* 02. VALUE PROPOSITION: ONE TOY. THREE WAYS TO PLAY.       */}
      {/* ========================================================= */}
      <section className="py-16 sm:py-24 bg-white relative">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto mb-14">
            <span className="px-3.5 py-1 rounded-full bg-[#F0F7F6] text-[#0C534E] text-xs font-black uppercase tracking-widest inline-block mb-3">
              Smart Value Design
            </span>
            <h2 className="text-3xl sm:text-4xl font-black text-[#162624] tracking-tight">
              One Toy. Three Ways to Play.
            </h2>
            <p className="text-base text-gray-500 mt-3 font-medium">
              Keep playtime exciting without buying three separate products. Engineered for multi-dimensional engagement.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* Mode 1: PLAY */}
            <div className="bg-[#FAFBF9] rounded-3xl p-8 border border-gray-100 hover:border-[#0C534E]/30 hover:shadow-xl transition-all duration-300 relative group flex flex-col justify-between">
              <div>
                <div className="w-14 h-14 rounded-2xl bg-[#0C534E] text-[#FFC800] flex items-center justify-center font-black text-xl mb-6 shadow-md shadow-[#0C534E]/20">
                  <Smile className="w-7 h-7" />
                </div>
                <span className="text-xs font-black uppercase tracking-widest text-[#0C534E]">01 • Mental Agility</span>
                <h3 className="text-2xl font-black text-[#162624] mt-1 mb-3">PLAY</h3>
                <p className="text-sm text-gray-600 leading-relaxed">
                  Interactive multi-surface rolling keeps dogs mentally stimulated, curious, and focused. Great for solo indoor exploration or guided training rewards.
                </p>
              </div>
              <div className="mt-6 pt-4 border-t border-gray-200/60 text-xs font-bold text-[#0C534E] flex items-center gap-1.5">
                <Check className="w-4 h-4 text-[#FFC800]" />
                <span>Mentally engaging solo play</span>
              </div>
            </div>

            {/* Mode 2: CHEW */}
            <div className="bg-[#FAFBF9] rounded-3xl p-8 border-2 border-[#FFC800] hover:shadow-xl transition-all duration-300 relative group flex flex-col justify-between shadow-lg shadow-[#FFC800]/10">
              <div className="absolute -top-3.5 right-6 px-3 py-1 rounded-full bg-[#FFC800] text-[#162624] text-[0.65rem] font-black uppercase tracking-wider">
                Dental Ridge Tech
              </div>
              <div>
                <div className="w-14 h-14 rounded-2xl bg-[#FFC800] text-[#162624] flex items-center justify-center font-black text-xl mb-6 shadow-md shadow-[#FFC800]/20">
                  <Zap className="w-7 h-7" />
                </div>
                <span className="text-xs font-black uppercase tracking-widest text-[#0C534E]">02 • Oral Care</span>
                <h3 className="text-2xl font-black text-[#162624] mt-1 mb-3">CHEW</h3>
                <p className="text-sm text-gray-600 leading-relaxed">
                  Ergonomic cylinder roller with textured rubber nubs massages gums and helps clean teeth while satisfying the natural instinct to gnaw safely.
                </p>
              </div>
              <div className="mt-6 pt-4 border-t border-gray-200/60 text-xs font-bold text-[#0C534E] flex items-center gap-1.5">
                <Check className="w-4 h-4 text-[#FFC800]" />
                <span>Massaging nubs scrape plaque</span>
              </div>
            </div>

            {/* Mode 3: FETCH */}
            <div className="bg-[#FAFBF9] rounded-3xl p-8 border border-gray-100 hover:border-[#0C534E]/30 hover:shadow-xl transition-all duration-300 relative group flex flex-col justify-between">
              <div>
                <div className="w-14 h-14 rounded-2xl bg-[#0C534E] text-[#FFC800] flex items-center justify-center font-black text-xl mb-6 shadow-md shadow-[#0C534E]/20">
                  <PackageCheck className="w-7 h-7" />
                </div>
                <span className="text-xs font-black uppercase tracking-widest text-[#0C534E]">03 • Outdoor Bond</span>
                <h3 className="text-2xl font-black text-[#162624] mt-1 mb-3">FETCH</h3>
                <p className="text-sm text-gray-600 leading-relaxed">
                  Reinforced braided rope loop enables high-velocity throws across the lawn or park, giving dogs the vigorous cardio exercise they crave.
                </p>
              </div>
              <div className="mt-6 pt-4 border-t border-gray-200/60 text-xs font-bold text-[#0C534E] flex items-center gap-1.5">
                <Check className="w-4 h-4 text-[#FFC800]" />
                <span>Aerodynamic throwing handle</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ========================================================= */}
      {/* 03. FLAGSHIP PRODUCT SPOTLIGHT (ZenPaaw 3-in-1 Pet Toy)   */}
      {/* ========================================================= */}
      <section id="flagship" className="py-16 sm:py-24 bg-[#F8FAF9] border-y border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-white rounded-3xl p-6 sm:p-10 lg:p-12 shadow-xl border border-gray-100 grid grid-cols-1 lg:grid-cols-12 gap-10 items-center">
            {/* Gallery / Product Showcase */}
            <div className="lg:col-span-6 space-y-4">
              <div className="relative aspect-square w-full rounded-2xl overflow-hidden bg-[#FAFBF9] border border-gray-100">
                <Image
                  src="/images/toy-isolated.jpg"
                  alt="ZenPaaw 3-in-1 Pet Toy isolated photo"
                  fill
                  className="object-contain p-4"
                />
                <span className="absolute top-4 left-4 px-3.5 py-1 rounded-full bg-[#0C534E] text-[#FFC800] text-xs font-black uppercase tracking-wider">
                  Flagship $24.99
                </span>
                <span className="absolute bottom-4 left-4 px-3 py-1 rounded-full bg-white/95 backdrop-blur-md text-[#162624] text-xs font-bold shadow">
                  ★ 4.9 Rating (38 Reviews)
                </span>
              </div>

              {/* Thumbnail Strip */}
              <div className="grid grid-cols-3 gap-3">
                <div className="relative aspect-square rounded-xl overflow-hidden border-2 border-[#0C534E]">
                  <Image src="/images/toy-isolated.jpg" alt="Isolated toy" fill className="object-cover" />
                </div>
                <div className="relative aspect-square rounded-xl overflow-hidden border border-gray-200">
                  <Image src="/images/hero-dog.jpg" alt="Dog with toy" fill className="object-cover" />
                </div>
                <div className="relative aspect-square rounded-xl overflow-hidden border border-gray-200">
                  <Image src="/images/packaging-box.jpg" alt="Branded packaging" fill className="object-cover" />
                </div>
              </div>
            </div>

            {/* Product Details & Direct Purchase Actions */}
            <div className="lg:col-span-6 space-y-6">
              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  <span className="text-xs font-bold uppercase tracking-wider text-[#0C534E]">
                    Direct Brand Flagship
                  </span>
                  <span className="text-xs text-gray-300">•</span>
                  <span className="text-xs text-emerald-600 font-bold flex items-center gap-1">
                    <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                    In Stock (142 Units Ready to Ship)
                  </span>
                </div>
                <h2 className="text-3xl sm:text-4xl font-black text-[#162624] tracking-tight">
                  ZenPaaw 3-in-1 Pet Toy
                </h2>
                <p className="text-sm text-gray-500 font-medium">
                  {flagshipProduct.tagline}
                </p>
              </div>

              {/* Price & Guarantee */}
              <div className="flex items-baseline gap-3 pt-1">
                <span className="text-3xl sm:text-4xl font-black text-[#0C534E] tabular-nums">
                  $24.99
                </span>
                <span className="text-lg text-gray-400 line-through tabular-nums">
                  $34.99
                </span>
                <span className="px-2.5 py-0.5 rounded-full bg-emerald-100 text-emerald-800 text-xs font-black">
                  Save 28% Today
                </span>
              </div>

              {/* Feature Bullets */}
              <ul className="space-y-2.5 text-xs sm:text-sm text-gray-700">
                <li className="flex items-start gap-2.5">
                  <Check className="w-4 h-4 text-[#0C534E] shrink-0 mt-0.5" />
                  <span><strong>Dual-action TPR rubber:</strong> textured dental roller + high-bounce ball</span>
                </li>
                <li className="flex items-start gap-2.5">
                  <Check className="w-4 h-4 text-[#0C534E] shrink-0 mt-0.5" />
                  <span><strong>Heavy-duty braided cotton-poly rope:</strong> designed for secure throwing & tugging</span>
                </li>
                <li className="flex items-start gap-2.5">
                  <Check className="w-4 h-4 text-[#0C534E] shrink-0 mt-0.5" />
                  <span><strong>100% BPA-Free & Non-Toxic:</strong> food-grade safe materials for your peace of mind</span>
                </li>
                <li className="flex items-start gap-2.5">
                  <Check className="w-4 h-4 text-[#0C534E] shrink-0 mt-0.5" />
                  <span><strong>Eco-friendly packaging:</strong> unbleached kraft box ready for gifting</span>
                </li>
              </ul>

              {/* CTAs */}
              <div className="flex flex-col sm:flex-row gap-3 pt-2">
                <button
                  onClick={() => addToCart(flagshipProduct, 1)}
                  className="flex-1 py-4 px-6 rounded-full bg-[#FFC800] text-[#162624] font-black text-sm sm:text-base hover:bg-[#E5B400] shadow-xl shadow-[#FFC800]/25 transition active:scale-95 flex items-center justify-center gap-2"
                >
                  <ShoppingBag className="w-5 h-5" />
                  <span>Add to Cart — $24.99</span>
                </button>

                <Link
                  href="/product/zenpaaw-3-in-1-pet-toy"
                  className="py-4 px-6 rounded-full bg-[#F0F7F6] text-[#0C534E] hover:bg-[#0C534E] hover:text-white font-bold text-sm sm:text-base transition text-center"
                >
                  View Details
                </Link>
              </div>

              {/* Trust Footer */}
              <div className="pt-4 border-t border-gray-100 grid grid-cols-2 gap-4 text-xs text-gray-500">
                <div>
                  <strong className="text-[#162624] block">📦 Fast Shipping:</strong>
                  <span>Delivers in 3-5 business days across U.S.</span>
                </div>
                <div>
                  <strong className="text-[#162624] block">🛡️ 30-Day Guarantee:</strong>
                  <span>No hassle returns if pet isn&apos;t thrilled</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ========================================================= */}
      {/* 04. WHY PET PARENTS CHOOSE ZENPAAW (Inspired by Reference) */}
      {/* ========================================================= */}
      <section className="py-20 sm:py-28 bg-white relative overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
            {/* Left Image with Reference-Style Deep Teal Organic Blob */}
            <div className="lg:col-span-5 relative flex items-center justify-center">
              <div className="absolute w-[300px] h-[300px] sm:w-[380px] sm:h-[380px] bg-[#0C534E] organic-shape-teal -z-0" />
              <div className="relative z-10 w-full max-w-[380px] aspect-[4/5] rounded-3xl overflow-hidden shadow-2xl border-4 border-white">
                <Image
                  src="/images/hero-dog.jpg"
                  alt="Healthy dog with ZenPaaw"
                  fill
                  className="object-cover"
                />
              </div>
            </div>

            {/* Right List with Oversized Numbers 01, 02, 03, 04 */}
            <div className="lg:col-span-7 space-y-8">
              <div>
                <span className="text-xs font-black uppercase tracking-widest text-[#0C534E]">
                  Designed For Pet Parents
                </span>
                <h2 className="text-3xl sm:text-4xl font-black text-[#162624] tracking-tight mt-1">
                  Why Pet Parents Choose ZenPaaw
                </h2>
                <p className="text-sm text-gray-500 mt-2 font-medium">
                  We strip out marketing gimmicks and focus on durable materials, versatile play styles, and honest value.
                </p>
              </div>

              <div className="space-y-6">
                {/* 01 */}
                <div className="flex items-start gap-4 p-4 rounded-2xl hover:bg-[#F8FAF9] transition">
                  <span className="w-12 h-12 rounded-2xl bg-[#FFC800] text-[#162624] font-black text-xl flex items-center justify-center shrink-0 shadow-sm">
                    01
                  </span>
                  <div>
                    <h3 className="font-extrabold text-base text-[#162624]">Fun-Focused Products</h3>
                    <p className="text-xs sm:text-sm text-gray-600 mt-0.5 leading-relaxed">
                      Every toy is curated to trigger natural pet play instincts—fetching, tugging, problem-solving, and healthy chewing.
                    </p>
                  </div>
                </div>

                {/* 02 */}
                <div className="flex items-start gap-4 p-4 rounded-2xl hover:bg-[#F8FAF9] transition">
                  <span className="w-12 h-12 rounded-2xl bg-[#FFC800] text-[#162624] font-black text-xl flex items-center justify-center shrink-0 shadow-sm">
                    02
                  </span>
                  <div>
                    <h3 className="font-extrabold text-base text-[#162624]">Great Everyday Value</h3>
                    <p className="text-xs sm:text-sm text-gray-600 mt-0.5 leading-relaxed">
                      Instead of buying three individual toys that clutter your living room, one ZenPaaw toy delivers three distinct functions for less.
                    </p>
                  </div>
                </div>

                {/* 03 */}
                <div className="flex items-start gap-4 p-4 rounded-2xl hover:bg-[#F8FAF9] transition">
                  <span className="w-12 h-12 rounded-2xl bg-[#FFC800] text-[#162624] font-black text-xl flex items-center justify-center shrink-0 shadow-sm">
                    03
                  </span>
                  <div>
                    <h3 className="font-extrabold text-base text-[#162624]">Carefully Selected Safe Materials</h3>
                    <p className="text-xs sm:text-sm text-gray-600 mt-0.5 leading-relaxed">
                      BPA-free, non-toxic food-grade TPR rubber and unbleached cotton-poly fibers tested for everyday canine play.
                    </p>
                  </div>
                </div>

                {/* 04 */}
                <div className="flex items-start gap-4 p-4 rounded-2xl hover:bg-[#F8FAF9] transition">
                  <span className="w-12 h-12 rounded-2xl bg-[#FFC800] text-[#162624] font-black text-xl flex items-center justify-center shrink-0 shadow-sm">
                    04
                  </span>
                  <div>
                    <h3 className="font-extrabold text-base text-[#162624]">Made For Everyday Play</h3>
                    <p className="text-xs sm:text-sm text-gray-600 mt-0.5 leading-relaxed">
                      Dishwasher-safe modules, mud-resistant braided ropes, and weather-proof compounds ready for park, yard, or living room.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ========================================================= */}
      {/* 05. PRODUCT COLLECTION / CATALOG GRID                    */}
      {/* ========================================================= */}
      <section id="shop" className="py-16 sm:py-24 bg-[#FAFBF9] border-t border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row md:items-end justify-between mb-10 gap-4">
            <div>
              <span className="text-xs font-black uppercase tracking-widest text-[#0C534E]">
                The ZenPaaw Lineup
              </span>
              <h2 className="text-3xl sm:text-4xl font-black text-[#162624] tracking-tight mt-1">
                Explore All Pet Toys
              </h2>
              <p className="text-sm text-gray-500 mt-1">
                Engineered for exercise, mental stimulation, and dental hygiene.
              </p>
            </div>

            <Link
              href="/shop"
              className="inline-flex items-center gap-1.5 text-sm font-extrabold text-[#0C534E] hover:underline"
            >
              <span>View Full Catalog</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>

          {/* Category Filter Pills */}
          <div className="flex items-center gap-2 overflow-x-auto pb-4 mb-8 scrollbar-none">
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`px-4 py-2 rounded-full text-xs font-bold whitespace-nowrap transition-all ${
                  selectedCategory === cat
                    ? 'bg-[#0C534E] text-[#FFC800] shadow-md shadow-[#0C534E]/20'
                    : 'bg-white text-gray-600 hover:bg-gray-100 border border-gray-200'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>

          {/* Product Cards Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {filteredProducts.map((product, index) => (
              <ProductCard key={product.id} product={product} priority={index < 2} />
            ))}
          </div>
        </div>
      </section>

      {/* ========================================================= */}
      {/* 06. BRAND PACKAGING DIRECTION SHOWCASE                    */}
      {/* ========================================================= */}
      <section className="py-16 sm:py-24 bg-white border-t border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto mb-14">
            <span className="px-3.5 py-1 rounded-full bg-[#F0F7F6] text-[#0C534E] text-xs font-black uppercase tracking-widest inline-block mb-3">
              Packaging & Presentation
            </span>
            <h2 className="text-3xl sm:text-4xl font-black text-[#162624] tracking-tight">
              Eco-Conscious Unboxing Experience
            </h2>
            <p className="text-sm text-gray-500 mt-2 font-medium">
              We package every ZenPaaw product with natural materials and clean, minimalist presentation—ready for gifting right at your doorstep.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* Packaging 1 */}
            <div className="bg-[#FAFBF9] rounded-3xl p-6 border border-gray-200/80 space-y-4">
              <div className="relative aspect-[4/3] rounded-2xl overflow-hidden bg-white">
                <Image
                  src="/images/packaging-box.jpg"
                  alt="ZenPaaw Kraft Cardboard Box Packaging"
                  fill
                  className="object-cover"
                />
              </div>
              <div>
                <span className="text-[0.68rem] font-bold uppercase tracking-wider text-[#0C534E]">Option A</span>
                <h4 className="text-lg font-black text-[#162624]">Cardboard Gift Box</h4>
                <p className="text-xs text-gray-500 mt-1">
                  Rigid unbleached recyclable kraft cardboard that protects the toy in transit and looks premium under the tree.
                </p>
              </div>
            </div>

            {/* Packaging 2 */}
            <div className="bg-[#FAFBF9] rounded-3xl p-6 border border-gray-200/80 space-y-4">
              <div className="relative aspect-[4/3] rounded-2xl overflow-hidden bg-white">
                <Image
                  src="/images/packaging-concepts.png"
                  alt="ZenPaaw Packaging Concept Paper Bag"
                  fill
                  className="object-cover object-top"
                />
              </div>
              <div>
                <span className="text-[0.68rem] font-bold uppercase tracking-wider text-[#0C534E]">Option B</span>
                <h4 className="text-lg font-black text-[#162624]">Branded Paper Bag</h4>
                <p className="text-xs text-gray-500 mt-1">
                  Lightweight, clean eco-pouch with printed ZenPaaw identity and play mode badges.
                </p>
              </div>
            </div>

            {/* Packaging 3 */}
            <div className="bg-[#FAFBF9] rounded-3xl p-6 border border-gray-200/80 space-y-4">
              <div className="relative aspect-[4/3] rounded-2xl overflow-hidden bg-white">
                <Image
                  src="/images/toy-isolated.jpg"
                  alt="ZenPaaw Sealed Pack Concept"
                  fill
                  className="object-cover"
                />
              </div>
              <div>
                <span className="text-[0.68rem] font-bold uppercase tracking-wider text-[#0C534E]">Option C</span>
                <h4 className="text-lg font-black text-[#162624]">Dust-Sealed Header Pack</h4>
                <p className="text-xs text-gray-500 mt-1">
                  Protects product from moisture and warehouse dust with a bold ZenPaaw header card.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ========================================================= */}
      {/* 07. FAQ ACCORDION (TEAL + YELLOW STYLING AS IN REFERENCE)  */}
      {/* ========================================================= */}
      <section className="py-20 sm:py-28 bg-[#FAFBF9] border-t border-gray-200">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <span className="text-xs font-black uppercase tracking-widest text-[#0C534E]">
              Clear Answers
            </span>
            <h2 className="text-3xl sm:text-4xl font-black text-[#162624] tracking-tight mt-1">
              Frequently Asked Questions
            </h2>
            <p className="text-sm text-gray-500 mt-2">
              Everything you need to know about the ZenPaaw 3-in-1 toy, materials, and shipping.
            </p>
          </div>

          <div className="space-y-3.5">
            {faqs.map((faq, index) => {
              const isOpen = openFaqIndex === index;
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
                    onClick={() => setOpenFaqIndex(isOpen ? null : index)}
                    className="w-full px-6 py-4 flex items-center justify-between text-left font-black text-sm sm:text-base gap-4"
                  >
                    <span>{faq.q}</span>
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
        </div>
      </section>

      {/* ========================================================= */}
      {/* 08. FINAL CTA SECTION (Deep Teal with Organic Yellow Blob) */}
      {/* ========================================================= */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-[#0C534E] rounded-3xl p-8 sm:p-14 lg:p-16 relative overflow-hidden text-center text-white shadow-2xl">
            {/* Background Organic Yellow Shapes */}
            <div className="absolute -bottom-16 -left-16 w-64 h-64 bg-[#FFC800] organic-shape-yellow opacity-40 blur-none pointer-events-none" />
            <div className="absolute -top-16 -right-16 w-72 h-72 bg-[#FFC800] organic-shape-yellow opacity-40 blur-none pointer-events-none" />

            <div className="relative z-10 max-w-2xl mx-auto space-y-6">
              <span className="px-3.5 py-1 rounded-full bg-white/15 text-[#FFC800] text-xs font-black uppercase tracking-widest inline-block">
                Start Better Play Today
              </span>

              <h2 className="text-3xl sm:text-5xl font-black text-white tracking-tight leading-tight">
                Ready to Make Playtime Better?
              </h2>

              <p className="text-base sm:text-lg text-[#D3E8E6] font-medium leading-relaxed">
                Give your pet more ways to play with ZenPaaw. One toy, three ways to play, and hours of engaging fun for just $24.99.
              </p>

              <div className="pt-2 flex flex-col sm:flex-row items-center justify-center gap-4">
                <Link
                  href="/product/zenpaaw-3-in-1-pet-toy"
                  className="w-full sm:w-auto px-8 py-4 rounded-full bg-[#FFC800] text-[#162624] font-black text-base hover:bg-[#E5B400] shadow-xl shadow-[#FFC800]/25 transition active:scale-95 flex items-center justify-center gap-2 group"
                >
                  <ShoppingBag className="w-5 h-5" />
                  <span>Get the 3-in-1 Toy — $24.99</span>
                </Link>

                <Link
                  href="/shop"
                  className="w-full sm:w-auto px-8 py-4 rounded-full bg-white/10 hover:bg-white/20 text-white font-bold text-base border border-white/20 transition"
                >
                  Explore All Toys
                </Link>
              </div>

              <div className="flex items-center justify-center gap-6 pt-4 text-xs text-[#A3D2CD]">
                <span>✓ 30-Day Money-Back Guarantee</span>
                <span>•</span>
                <span>✓ Fast U.S. Shipping</span>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
