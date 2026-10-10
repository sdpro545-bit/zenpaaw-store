'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { motion, AnimatePresence } from 'motion/react';
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
  Bone,
  Sparkles,
} from 'lucide-react';

export const Header: React.FC = () => {
  const pathname = usePathname();
  const { itemCount, setIsCartOpen, isCartOpen } = useCart();
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
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.92 }}
              onClick={() => setIsSearchOpen(true)}
              className="p-2.5 rounded-full hover:bg-[#F0F7F6] text-[#0C534E] transition active:scale-95 cursor-pointer"
              aria-label="Search pet toys"
            >
              <Search className="w-5 h-5 stroke-[2]" />
            </motion.button>

            {/* Wishlist Button */}
            <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.92 }}>
              <Link
                href="/wishlist"
                className="p-2.5 rounded-full hover:bg-[#F0F7F6] text-[#0C534E] transition block"
                aria-label="Wishlist"
              >
                <Heart className="w-5 h-5 stroke-[2]" />
              </Link>
            </motion.div>

            {/* Shopping Cart Button with open/close and click animations */}
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.92 }}
              onClick={() => setIsCartOpen(!isCartOpen)}
              className={`relative px-3.5 py-2.5 rounded-full transition-all duration-200 flex items-center gap-2 group cursor-pointer ${
                isCartOpen
                  ? 'bg-[#093B37] text-white shadow-lg ring-2 ring-[#FFC800]'
                  : 'bg-[#0C534E] text-[#FFC800] hover:bg-[#093B37] shadow-md shadow-[#0C534E]/20'
              }`}
              aria-label={`Cart with ${itemCount} items`}
            >
              <motion.div
                animate={isCartOpen ? { rotate: [0, -15, 15, -8, 0], scale: 1.1 } : { rotate: 0, scale: 1 }}
                transition={{ duration: 0.35, ease: 'easeInOut' }}
              >
                <ShoppingBag className="w-5 h-5 stroke-[2.5]" />
              </motion.div>
              <motion.span
                key={itemCount}
                initial={{ scale: 0.6 }}
                animate={{ scale: 1 }}
                transition={{ type: 'spring', stiffness: 450, damping: 15 }}
                className="text-xs font-black tabular-nums text-white pr-0.5"
              >
                {itemCount}
              </motion.span>
              {itemCount > 0 && (
                <motion.span
                  key={`badge-${itemCount}`}
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ type: 'spring', stiffness: 500, damping: 15 }}
                  className="absolute -top-1 -right-1 flex h-4 w-4"
                >
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#FFC800] opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-4 w-4 bg-[#FFC800] text-[#093B37] text-[0.62rem] font-black items-center justify-center shadow">
                    {itemCount}
                  </span>
                </motion.span>
              )}
            </motion.button>

            {/* Mobile/Tablet Hamburger Toggle */}
            <motion.button
              whileTap={{ scale: 0.88 }}
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="lg:hidden p-2 rounded-xl hover:bg-[#F0F7F6] text-[#0C534E] transition cursor-pointer"
              aria-label="Toggle mobile menu"
            >
              <motion.div
                key={isMobileMenuOpen ? 'close' : 'open'}
                initial={{ rotate: -90, opacity: 0 }}
                animate={{ rotate: 0, opacity: 1 }}
                transition={{ duration: 0.2 }}
              >
                {isMobileMenuOpen ? (
                  <X className="w-6 h-6 stroke-[2.5]" />
                ) : (
                  <Menu className="w-6 h-6 stroke-[2.5]" />
                )}
              </motion.div>
            </motion.button>
          </div>
        </div>

        {/* Mobile Animated Dropdown Menu with Spring Accordion */}
        <AnimatePresence>
          {isMobileMenuOpen && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.28, ease: [0.16, 1, 0.3, 1] }}
              className="lg:hidden overflow-hidden bg-white/98 backdrop-blur-md border-b border-[#E2EBEA] shadow-xl"
            >
              <div className="px-5 py-5 space-y-2">
                {navLinks.map((link, idx) => (
                  <motion.div
                    key={link.name}
                    initial={{ opacity: 0, x: -16 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: idx * 0.035 }}
                  >
                    <Link
                      href={link.href}
                      onClick={() => setIsMobileMenuOpen(false)}
                      className={`flex items-center justify-between py-3 px-4 rounded-2xl text-base font-extrabold transition-all active:scale-[0.98] ${
                        pathname === link.href
                          ? 'bg-[#E2EBEA] text-[#093B37]'
                          : 'text-[#0C534E] hover:bg-[#F0F7F6]'
                      }`}
                    >
                      <span>{link.name}</span>
                      <ChevronRight className="w-4 h-4 text-[#0C534E]" />
                    </Link>
                  </motion.div>
                ))}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </header>

      {/* Mobile & Tablet Bottom Tab Bar (Responsive for all screens < 1024px) */}
      <nav
        aria-label="Mobile and tablet navigation"
        className="lg:hidden fixed bottom-0 left-0 right-0 z-40 bg-white/95 backdrop-blur-xl border-t border-[#0C534E]/10 px-2 sm:px-6 py-2 shadow-[0_-8px_30px_rgba(0,0,0,0.08)] pb-[calc(0.5rem+env(safe-area-inset-bottom,0px))]"
      >
        <div className="max-w-md mx-auto flex items-center justify-around gap-1">
          {[
            { name: 'Home', href: '/', icon: Home, isActive: pathname === '/' },
            { name: 'Shop', href: '/shop', icon: Grid, isActive: pathname === '/shop' },
            { name: 'Dogs', href: '/c/dogs', icon: Bone, isActive: pathname.startsWith('/c/dogs') },
            { name: 'Cats', href: '/c/cats', icon: Sparkles, isActive: pathname.startsWith('/c/cats') },
          ].map((item) => {
            const Icon = item.icon;
            return (
              <Link
                key={item.name}
                href={item.href}
                prefetch={true}
                className="relative flex-1 py-1.5 px-1 flex flex-col items-center justify-center rounded-2xl transition-colors touch-manipulation"
              >
                {item.isActive && (
                  <motion.div
                    layoutId="mobileActiveTabIndicator"
                    className="absolute inset-0 bg-[#0C534E] rounded-2xl shadow-sm"
                    transition={{ type: 'spring', stiffness: 450, damping: 30 }}
                  />
                )}
                <motion.div
                  whileTap={{ scale: 0.82 }}
                  className={`flex flex-col items-center gap-0.5 z-10 transition-colors duration-200 ${
                    item.isActive ? 'text-[#FFC800]' : 'text-gray-600 hover:text-[#0C534E]'
                  }`}
                >
                  <Icon className="w-5 h-5 stroke-[2.2]" />
                  <span
                    className={`text-[0.68rem] tracking-tight ${
                      item.isActive ? 'font-black text-white' : 'font-bold'
                    }`}
                  >
                    {item.name}
                  </span>
                </motion.div>
              </Link>
            );
          })}

          {/* Cart Drawer Trigger Tab */}
          <motion.button
            whileTap={{ scale: 0.82 }}
            onClick={() => setIsCartOpen(true)}
            className="relative flex-1 py-1.5 px-1 flex flex-col items-center justify-center rounded-2xl text-gray-600 hover:text-[#0C534E] cursor-pointer"
            aria-label="Open Cart"
          >
            <div className="relative flex flex-col items-center gap-0.5">
              <ShoppingBag className="w-5 h-5 stroke-[2.2]" />
              <span className="text-[0.68rem] font-bold tracking-tight">Cart</span>
              {itemCount > 0 && (
                <motion.span
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  key={`mobile-cart-badge-${itemCount}`}
                  transition={{ type: 'spring', stiffness: 500, damping: 15 }}
                  className="absolute -top-1.5 -right-2 min-w-4 h-4 px-1 rounded-full bg-[#FFC800] text-[#093B37] text-[0.62rem] font-black flex items-center justify-center shadow"
                >
                  {itemCount}
                </motion.span>
              )}
            </div>
          </motion.button>
        </div>
      </nav>

      {/* Global Instant Search Modal */}
      <SearchModal isOpen={isSearchOpen} onClose={() => setIsSearchOpen(false)} />
    </>
  );
};

export default Header;
