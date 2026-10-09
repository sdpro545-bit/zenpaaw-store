import React from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { Sparkles, ArrowRight, Heart, Shield, RefreshCw } from 'lucide-react';

export default function AboutPage() {
  return (
    <div className="bg-[#FAFBF9] min-h-screen py-12 sm:py-20">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
        {/* Header */}
        <div className="text-center space-y-4">
          <span className="px-3.5 py-1 rounded-full bg-[#F0F7F6] text-[#0C534E] text-xs font-black uppercase tracking-widest inline-block">
            Our Purpose
          </span>
          <h1 className="text-4xl sm:text-5xl font-black text-[#162624] tracking-tight">
            Built for Better Everyday Play
          </h1>
          <p className="text-base sm:text-lg text-gray-600 max-w-2xl mx-auto leading-relaxed">
            At ZenPaaw, we believe that playtime shouldn&apos;t require a living room floor littered with dozens of broken, single-use toys.
          </p>
        </div>

        {/* Hero Visual Card */}
        <div className="relative aspect-[16/9] rounded-3xl overflow-hidden shadow-xl border border-gray-100">
          <Image
            src="/images/hero-dog.jpg"
            alt="ZenPaaw pet play philosophy"
            fill
            className="object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent flex items-end p-8">
            <span className="text-white text-lg sm:text-xl font-bold">
              Happy Pets. Happier Lives.
            </span>
          </div>
        </div>

        {/* Story Body */}
        <div className="bg-white rounded-3xl p-8 sm:p-12 border border-gray-100 shadow-sm space-y-6 text-sm sm:text-base text-gray-700 leading-relaxed">
          <h2 className="text-2xl font-black text-[#162624]">Why ZenPaaw Exists</h2>
          <p>
            Dogs need more than just one repetitive action. They want to chew when they need to soothe themselves or clean their gums. They want to fetch when they have boundless energy outdoors. And they want to interact and solve small challenges when they are lounging at home.
          </p>
          <p>
            Most pet toys break quickly or fail to hold attention. Our focus is multi-purpose enrichment: sourcing durable materials, clear packaging, and toys that provide distinct ways to play from a single purchase.
          </p>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-6">
            <div className="p-5 rounded-2xl bg-[#FAFBF9] border border-gray-100 space-y-2">
              <RefreshCw className="w-6 h-6 text-[#0C534E]" />
              <h4 className="font-extrabold text-sm text-[#162624]">Play Variety</h4>
              <p className="text-xs text-gray-500">
                Toys that combine bouncing, chewing, or tugging to match how your pet plays.
              </p>
            </div>

            <div className="p-5 rounded-2xl bg-[#FAFBF9] border border-gray-100 space-y-2">
              <Shield className="w-6 h-6 text-[#0C534E]" />
              <h4 className="font-extrabold text-sm text-[#162624]">Tested Materials</h4>
              <p className="text-xs text-gray-500">
                Natural rubber and cotton fibers designed for everyday fetch and chew sessions.
              </p>
            </div>

            <div className="p-5 rounded-2xl bg-[#FAFBF9] border border-gray-100 space-y-2">
              <Heart className="w-6 h-6 text-[#0C534E]" />
              <h4 className="font-extrabold text-sm text-[#162624]">Honest Pet Value</h4>
              <p className="text-xs text-gray-500">
                Direct pricing, clear specifications, and straightforward 30-day returns.
              </p>
            </div>
          </div>

          <div className="pt-6 border-t border-gray-100 text-center">
            <Link
              href="/shop"
              className="inline-flex items-center gap-2 px-8 py-3.5 rounded-full bg-[#0C534E] text-[#FFC800] font-black text-sm hover:bg-[#093B37] shadow-lg shadow-[#0C534E]/20 transition"
            >
              <span>Explore All Toys</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
