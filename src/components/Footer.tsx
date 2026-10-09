'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { ZenPaawLogo } from './ZenPaawLogo';
import { Mail, Check, ShieldCheck, Truck, RotateCcw, HeartHandshake } from 'lucide-react';

export const Footer: React.FC = () => {
  const [email, setEmail] = useState('');
  const [isSubscribed, setIsSubscribed] = useState(false);

  const handleSubscribe = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !email.includes('@')) return;
    setIsSubscribed(true);
    setEmail('');
  };

  return (
    <footer className="bg-[#093B37] text-white pt-16 pb-12 border-t border-[#0C534E]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Top Trust Pillars Grid */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 pb-12 border-b border-[#0C534E]/60">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-2xl bg-[#0C534E] flex items-center justify-center text-[#FFC800] shrink-0">
              <Truck className="w-6 h-6" />
            </div>
            <div>
              <h5 className="font-bold text-sm text-white">Free U.S. Shipping</h5>
              <p className="text-xs text-[#A3D2CD]">On all orders over $35</p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-2xl bg-[#0C534E] flex items-center justify-center text-[#FFC800] shrink-0">
              <RotateCcw className="w-6 h-6" />
            </div>
            <div>
              <h5 className="font-bold text-sm text-white">30-Day Play Guarantee</h5>
              <p className="text-xs text-[#A3D2CD]">Hassle-free easy returns</p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-2xl bg-[#0C534E] flex items-center justify-center text-[#FFC800] shrink-0">
              <ShieldCheck className="w-6 h-6" />
            </div>
            <div>
              <h5 className="font-bold text-sm text-white">Safe & Non-Toxic</h5>
              <p className="text-xs text-[#A3D2CD]">BPA-free food-grade rubber</p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-2xl bg-[#0C534E] flex items-center justify-center text-[#FFC800] shrink-0">
              <HeartHandshake className="w-6 h-6" />
            </div>
            <div>
              <h5 className="font-bold text-sm text-white">Dedicated Support</h5>
              <p className="text-xs text-[#A3D2CD]">Pet parent care 7 days/wk</p>
            </div>
          </div>
        </div>

        {/* Main Footer Links & Newsletter */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-10 py-12 border-b border-[#0C534E]/60">
          {/* Brand Info & Identity */}
          <div className="md:col-span-4 space-y-4">
            <ZenPaawLogo theme="light" size="lg" showTagline={true} />
            <p className="text-xs sm:text-sm text-[#D3E8E6] leading-relaxed max-w-sm">
              ZenPaaw is a modern pet lifestyle brand on a mission to make everyday playtime more engaging, active, and rewarding for dogs and their people.
            </p>
            <div className="text-xs text-[#A3D2CD] pt-2">
              <p className="font-bold text-white mb-1">Our Play Philosophy:</p>
              <p>One Toy. Three Ways to Play. More Value.</p>
            </div>
          </div>

          {/* Quick Links Column 1: Shop */}
          <div className="md:col-span-2 space-y-3">
            <h4 className="font-black text-sm uppercase tracking-wider text-[#FFC800]">Shop</h4>
            <ul className="space-y-2 text-xs sm:text-sm text-[#D3E8E6]">
              <li>
                <Link href="/product/zenpaaw-3-in-1-pet-toy" className="hover:text-white hover:underline transition">
                  Flagship 3-in-1 Toy
                </Link>
              </li>
              <li>
                <Link href="/shop?cat=Dog+Toys" className="hover:text-white hover:underline transition">
                  Dog Toys
                </Link>
              </li>
              <li>
                <Link href="/shop?cat=Chew+Toys" className="hover:text-white hover:underline transition">
                  Chew & Dental
                </Link>
              </li>
              <li>
                <Link href="/shop?cat=Interactive+Toys" className="hover:text-white hover:underline transition">
                  Interactive Puzzles
                </Link>
              </li>
              <li>
                <Link href="/shop?cat=Fetch+%26+Outdoor" className="hover:text-white hover:underline transition">
                  Fetch & Outdoor
                </Link>
              </li>
            </ul>
          </div>

          {/* Quick Links Column 2: Help & Policies */}
          <div className="md:col-span-2 space-y-3">
            <h4 className="font-black text-sm uppercase tracking-wider text-[#FFC800]">Help & Care</h4>
            <ul className="space-y-2 text-xs sm:text-sm text-[#D3E8E6]">
              <li>
                <Link href="/faq" className="hover:text-white hover:underline transition">
                  FAQ & Toy Guide
                </Link>
              </li>
              <li>
                <Link href="/shipping" className="hover:text-white hover:underline transition">
                  Shipping & Delivery
                </Link>
              </li>
              <li>
                <Link href="/returns" className="hover:text-white hover:underline transition">
                  Returns & Refunds
                </Link>
              </li>
              <li>
                <Link href="/contact" className="hover:text-white hover:underline transition">
                  Contact Support
                </Link>
              </li>
              <li>
                <Link href="/about" className="hover:text-white hover:underline transition">
                  Our Story
                </Link>
              </li>
            </ul>
          </div>

          {/* Newsletter Subscription Column */}
          <div className="md:col-span-4 space-y-4">
            <h4 className="font-black text-sm uppercase tracking-wider text-[#FFC800]">Join the Play Club</h4>
            <p className="text-xs sm:text-sm text-[#D3E8E6] leading-relaxed">
              Subscribe for launch offers, enrichment tips, and new toy releases. Unsubscribe anytime.
            </p>

            {isSubscribed ? (
              <div className="p-3.5 rounded-2xl bg-[#0C534E] text-[#FFC800] flex items-center gap-2.5 text-xs font-bold">
                <Check className="w-4 h-4 shrink-0" />
                <span>You&apos;re on the list! Watch your inbox for playful perks.</span>
              </div>
            ) : (
              <form onSubmit={handleSubscribe} className="space-y-2">
                <div className="flex gap-2">
                  <div className="relative flex-1">
                    <Mail className="w-4 h-4 text-gray-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                    <input
                      type="email"
                      placeholder="Enter your email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      required
                      className="w-full pl-10 pr-3 py-2.5 rounded-full bg-white/10 border border-white/20 text-white placeholder-gray-400 text-xs sm:text-sm outline-none focus:border-[#FFC800]"
                    />
                  </div>
                  <button
                    type="submit"
                    className="px-5 py-2.5 rounded-full bg-[#FFC800] text-[#162624] font-extrabold text-xs sm:text-sm hover:bg-[#E5B400] transition shrink-0"
                  >
                    Join
                  </button>
                </div>
                <p className="text-[0.68rem] text-[#A3D2CD]">
                  By signing up you agree to our{' '}
                  <Link href="/privacy" className="underline hover:text-white">
                    Privacy Policy
                  </Link>.
                </p>
              </form>
            )}
          </div>
        </div>

        {/* Bottom Legal, Payment Icons & Copyright */}
        <div className="pt-8 flex flex-col md:flex-row items-center justify-between gap-4 text-xs text-[#A3D2CD]">
          <p>© 2026 ZenPaaw™. All rights reserved.</p>

          <div className="flex flex-wrap items-center gap-4 text-xs">
            <Link href="/privacy" className="hover:text-white hover:underline transition">
              Privacy Policy
            </Link>
            <span>•</span>
            <Link href="/terms" className="hover:text-white hover:underline transition">
              Terms & Conditions
            </Link>
            <span>•</span>
            <Link href="/shipping" className="hover:text-white hover:underline transition">
              Shipping Terms
            </Link>
            <span>•</span>
            <Link href="/admin" className="hover:text-white hover:underline transition">
              Admin Portal
            </Link>
            <span>•</span>
            <button
              onClick={() => {
                if (typeof window !== 'undefined') {
                  window.dispatchEvent(new CustomEvent('replay_zenpaaw_intro'));
                }
              }}
              className="text-[#FFC800] hover:text-white hover:underline transition cursor-pointer font-bold"
            >
              Replay Intro
            </button>
          </div>

          <div className="flex items-center gap-2">
            <span className="text-[0.68rem] uppercase tracking-wider text-gray-400 font-bold">Secure Cards:</span>
            <div className="flex gap-1.5 text-[0.65rem] font-bold text-[#162624]">
              <span className="px-2 py-0.5 rounded bg-white font-extrabold">VISA</span>
              <span className="px-2 py-0.5 rounded bg-white font-extrabold">MC</span>
              <span className="px-2 py-0.5 rounded bg-white font-extrabold">AMEX</span>
              <span className="px-2 py-0.5 rounded bg-white font-extrabold">APPLE PAY</span>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
