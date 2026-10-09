'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { ZenPaawLogo } from './ZenPaawLogo';
import { useCart } from '@/context/CartContext';
import { SearchModal } from './SearchModal';
import {
  Search,
  ShoppingBag,
  Menu,
  X,
  Heart,
  Home,
  Grid,
  ChevronRight,
} from 'lucide-react';

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

  // Keyboard shortcut Cmd/Ctrl + K for search modal
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        setIsSearchOpen(true);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  const navLinks = [
    { name: 'Dogs', href: '/c/dogs' },
    { name: 'Puppies', href: '/c/puppies' },
    { name: 'Cats', href: '/c/cats' },
    { name: 'Shop All', href: '/shop' },
    { name: 'Collections', href: '/collections/staff-picks' },
    { name: 'About', href: '/about' },
    { name: 'FAQ', href: '/faq' },
  ];

  return (
    <>
      {/* Main Sticky Header */}
      <header
        className={`sticky top-0 z-40 w-full transition-all duration-300 ${
          isScrolled
            ? 'bg-white/98 backdrop-blur-md shadow-sm py-2.5 border-b border-[#E2EBEA]'
            : 'bg-white py-3.5 border-b border-[#E2EBEA]'
        }`}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-between">
          {/* Brand Logo */}
          <div className="flex items-center">
            <ZenPaawLogo
              variant="horizontal"
              size={isScrolled ? 'sm' : 'md'}
              showTagline={false}
              theme="dark"
              className="py-1"
            />
          </div>

          {/* Desktop Navigation */}
          <nav className="hidden lg:flex items-center space-x-1 xl:space-x-2">
            {navLinks.map((link) => {
              const isActive = pathname === link.href;
              return (
                <Link
                  key={link.name}
                  href={link.href}
                  className={`px-3.5 py-2 rounded-full text-xs xl:text-sm font-extrabold tracking-tight transition-all relative ${
                    isActive
                      ? 'text-[#093B37] bg-[#E2EBEA]'
                      : 'text-[#0C534E] hover:text-[#093B37] hover:bg-[#F0F7F6]'
                  }`}
                >
                  {link.name}
                </Link>
              );
            })}
          </nav>

          {/* Action Icons */}
          <div className="flex items-center space-x-1 sm:space-x-2">
            {/* Search Button (without ⌘K badge per feedback) */}
            <button
              onClick={() => setIsSearchOpen(true)}
              className="p-2.5 rounded-full hover:bg-[#F0F7F6] text-[#0C534E] transition active:scale-95"
              aria-label="Search pet toys"
            >
              <Search className="w-5 h-5 stroke-[2]" />
            </button>

            {/* Wishlist Button */}
            <Link
              href="/wishlist"
              className="p-2.5 rounded-full hover:bg-[#F0F7F6] text-[#0C534E] transition active:scale-95"
              aria-label="Wishlist"
            >
              <Heart className="w-5 h-5 stroke-[2]" />
            </Link>

            {/* Shopping Cart Button */}
            <button
              onClick={() => setIsCartOpen(true)}
              className="relative px-3.5 py-2.5 rounded-full bg-[#0C534E] text-[#FFC800] hover:bg-[#093B37] shadow-md shadow-[#0C534E]/20 transition-all hover:scale-[1.03] active:scale-95 flex items-center gap-2 group cursor-pointer"
              aria-label={`Cart with ${itemCount} items`}
            >
              <ShoppingBag className="w-5 h-5 stroke-[2.5] transition-transform group-hover:-rotate-6" />
              <span className="text-xs font-black tabular-nums text-white pr-0.5">
                {itemCount}
              </span>
              {itemCount > 0 && (
                <span className="absolute -top-1 -right-1 flex h-4 w-4">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#FFC800] opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-4 w-4 bg-[#FFC800] text-[#093B37] text-[0.62rem] font-black items-center justify-center shadow">
                    {itemCount}
                  </span>
                </span>
              )}
            </button>

            {/* Mobile Hamburger Toggle */}
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="lg:hidden p-2 rounded-xl hover:bg-[#F0F7F6] text-[#0C534E] transition"
              aria-label="Toggle mobile menu"
            >
              {isMobileMenuOpen ? (
                <X className="w-6 h-6 stroke-[2.5]" />
              ) : (
                <Menu className="w-6 h-6 stroke-[2.5]" />
              )}
            </button>
          </div>
        </div>

        {/* Mobile Animated Dropdown Menu */}
        {isMobileMenuOpen && (
          <div className="lg:hidden bg-white border-b border-[#E2EBEA] px-6 py-6 space-y-4 shadow-xl">
            <div className="flex flex-col space-y-2">
              {navLinks.map((link) => (
                <Link
                  key={link.name}
                  href={link.href}
                  onClick={() => setIsMobileMenuOpen(false)}
                  className={`flex items-center justify-between py-2.5 px-3 rounded-xl text-base font-extrabold transition ${
                    pathname === link.href
                      ? 'bg-[#E2EBEA] text-[#093B37]'
                      : 'text-[#0C534E] hover:bg-[#F0F7F6]'
                  }`}
                >
                  <span>{link.name}</span>
                  <ChevronRight className="w-4 h-4 text-[#0C534E]" />
                </Link>
              ))}
            </div>
          </div>
        )}
      </header>

      {/* Mobile Bottom Tab Bar (Section 9.1 & 10) */}
      <div className="md:hidden fixed bottom-0 left-0 right-0 z-40 bg-white/98 backdrop-blur-md border-t border-[#E2EBEA] px-4 py-2 flex items-center justify-around shadow-2xl">
        <Link
          href="/"
          className={`flex flex-col items-center gap-0.5 text-[0.65rem] font-bold ${
            pathname === '/' ? 'text-[#0C534E]' : 'text-gray-500'
          }`}
        >
          <Home className="w-5 h-5" />
          <span>Home</span>
        </Link>
        <Link
          href="/shop"
          className={`flex flex-col items-center gap-0.5 text-[0.65rem] font-bold ${
            pathname.startsWith('/shop') || pathname.startsWith('/c')
              ? 'text-[#0C534E]'
              : 'text-gray-500'
          }`}
        >
          <Grid className="w-5 h-5" />
          <span>Shop</span>
        </Link>
        <button
          onClick={() => setIsSearchOpen(true)}
          className="flex flex-col items-center gap-0.5 text-[0.65rem] font-bold text-gray-500"
        >
          <Search className="w-5 h-5" />
          <span>Search</span>
        </button>
        <Link
          href="/wishlist"
          className={`flex flex-col items-center gap-0.5 text-[0.65rem] font-bold ${
            pathname === '/wishlist' ? 'text-[#0C534E]' : 'text-gray-500'
          }`}
        >
          <Heart className="w-5 h-5" />
          <span>Wishlist</span>
        </Link>
        <button
          onClick={() => setIsCartOpen(true)}
          className="flex flex-col items-center gap-0.5 text-[0.65rem] font-bold text-[#0C534E] relative"
        >
          <ShoppingBag className="w-5 h-5" />
          <span>Cart</span>
          {itemCount > 0 && (
            <span className="absolute -top-1 right-1.5 w-4 h-4 rounded-full bg-[#FFC800] text-[#162624] text-[0.6rem] font-black flex items-center justify-center">
              {itemCount}
            </span>
          )}
        </button>
      </div>

      {/* Global Instant Search Modal */}
      <SearchModal isOpen={isSearchOpen} onClose={() => setIsSearchOpen(false)} />
    </>
  );
};

export default Header;
