'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { ZenPaawLogo } from './ZenPaawLogo';
import { useCart } from '@/context/CartContext';
import { SearchModal } from './SearchModal';
import { initialProducts } from '@/data/products';
import { Search, ShoppingBag, Menu, X, Shield, ChevronRight } from 'lucide-react';

export const Header: React.FC = () => {
  const pathname = usePathname();
  const { itemCount, setIsCartOpen } = useCart();
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navLinks = [
    { name: 'Home', href: '/' },
    { name: 'Shop All', href: '/shop' },
    { name: '3-in-1 Flagship', href: '/product/zenpaaw-3-in-1-pet-toy' },
    { name: 'About', href: '/about' },
    { name: 'FAQ', href: '/faq' },
    { name: 'Contact', href: '/contact' },
  ];

  // Announcement bar text
  const announcementText = '🐾 FREE U.S. SHIPPING OVER $35 • 30-DAY MONEY-BACK PLAY GUARANTEE';

  return (
    <>
      {/* Top Announcement Bar */}
      <div className="bg-[#093B37] text-white text-[0.72rem] font-bold tracking-wider py-2 px-4 text-center border-b border-[#0C534E]/50 select-none flex items-center justify-center gap-2">
        <span className="inline-block w-2 h-2 rounded-full bg-[#FFC800] animate-pulse" />
        <span>{announcementText}</span>
      </div>

      {/* Main Sticky Header */}
      <header
        className={`sticky top-0 z-40 w-full transition-all duration-300 ${
          isScrolled
            ? 'bg-white/95 backdrop-blur-md shadow-md py-3 border-b border-gray-100'
            : 'bg-white py-4.5 border-b border-gray-100'
        }`}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-between">
          {/* Brand Logo */}
          <div className="flex items-center">
            <ZenPaawLogo
              size={isScrolled ? 'sm' : 'md'}
              showTagline={!isScrolled}
              theme="dark"
            />
          </div>

          {/* Desktop Navigation Links */}
          <nav className="hidden md:flex items-center space-x-1 lg:space-x-2">
            {navLinks.map((link) => {
              const isActive = pathname === link.href;
              return (
                <Link
                  key={link.name}
                  href={link.href}
                  className={`px-3.5 py-1.5 rounded-full text-xs lg:text-sm font-bold transition-all relative ${
                    isActive
                      ? 'text-[#0C534E] bg-[#F0F7F6]'
                      : 'text-[#162624] hover:text-[#0C534E] hover:bg-gray-50'
                  }`}
                >
                  {link.name}
                  {link.name === '3-in-1 Flagship' && (
                    <span className="ml-1.5 px-1.5 py-0.2 rounded-full bg-[#FFC800] text-[#162624] text-[0.62rem] font-black uppercase tracking-wider">
                      Hot
                    </span>
                  )}
                </Link>
              );
            })}
          </nav>

          {/* Action Icons */}
          <div className="flex items-center space-x-2 sm:space-x-3">
            {/* Search Button */}
            <button
              onClick={() => setIsSearchOpen(true)}
              className="p-2.5 rounded-full hover:bg-[#F0F7F6] text-[#162624] hover:text-[#0C534E] transition"
              aria-label="Search toys"
            >
              <Search className="w-5 h-5" />
            </button>

            {/* Admin Portal Quick Link */}
            <Link
              href="/admin"
              className="hidden sm:inline-flex p-2.5 rounded-full hover:bg-[#F0F7F6] text-gray-400 hover:text-[#0C534E] transition"
              title="Admin Dashboard"
              aria-label="Admin Dashboard"
            >
              <Shield className="w-4 h-4" />
            </Link>

            {/* Shopping Cart Button with Dynamic Badge */}
            <button
              onClick={() => setIsCartOpen(true)}
              className="relative p-2.5 rounded-full bg-[#0C534E] text-[#FFC800] hover:bg-[#093B37] shadow-md shadow-[#0C534E]/20 transition flex items-center gap-1.5"
              aria-label={`Cart with ${itemCount} items`}
            >
              <ShoppingBag className="w-5 h-5" />
              <span className="text-xs font-black tabular-nums text-white pr-0.5">
                {itemCount}
              </span>
              {itemCount > 0 && (
                <span className="absolute -top-1 -right-1 flex h-4 w-4">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#FFC800] opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-4 w-4 bg-[#FFC800] text-[#162624] text-[0.62rem] font-black items-center justify-center">
                    {itemCount}
                  </span>
                </span>
              )}
            </button>

            {/* Mobile Hamburger Toggle */}
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="md:hidden p-2 rounded-xl hover:bg-gray-100 text-[#162624] transition"
              aria-label="Toggle mobile menu"
            >
              {isMobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>

        {/* Mobile Animated Dropdown Menu */}
        {isMobileMenuOpen && (
          <div className="md:hidden bg-white border-b border-gray-200 px-6 py-6 space-y-4 shadow-xl animate-in slide-in-from-top-2 duration-200">
            <div className="flex flex-col space-y-2">
              {navLinks.map((link) => (
                <Link
                  key={link.name}
                  href={link.href}
                  onClick={() => setIsMobileMenuOpen(false)}
                  className={`flex items-center justify-between py-2.5 px-3 rounded-xl text-base font-bold transition ${
                    pathname === link.href
                      ? 'bg-[#F0F7F6] text-[#0C534E]'
                      : 'text-[#162624] hover:bg-gray-50'
                  }`}
                >
                  <span>{link.name}</span>
                  <ChevronRight className="w-4 h-4 text-gray-400" />
                </Link>
              ))}
              <Link
                href="/admin"
                onClick={() => setIsMobileMenuOpen(false)}
                className="flex items-center justify-between py-2.5 px-3 rounded-xl text-sm font-semibold text-gray-500 hover:bg-gray-50 transition border-t border-gray-100 mt-2 pt-3"
              >
                <span>Store Management (Admin)</span>
                <Shield className="w-4 h-4 text-gray-400" />
              </Link>
            </div>
          </div>
        )}
      </header>

      {/* Global Instant Search Modal */}
      <SearchModal
        isOpen={isSearchOpen}
        onClose={() => setIsSearchOpen(false)}
        products={initialProducts}
      />
    </>
  );
};

export default Header;
