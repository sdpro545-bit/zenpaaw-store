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
  Store,
  ChevronRight,
  Bone,
  Cat,
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

      {/* Mobile & Tablet Floating Bottom Pill Navigation Bar */}
      <nav
        aria-label="Mobile and tablet navigation"
        className="lg:hidden fixed bottom-3 sm:bottom-4 left-3 right-3 sm:left-1/2 sm:-translate-x-1/2 max-w-md z-50 select-none overflow-visible mb-[env(safe-area-inset-bottom,0px)] transform-gpu"
        style={{
          WebkitTransform: 'translate3d(0, 0, 0)',
          transform: 'translate3d(0, 0, 0)',
          WebkitBackfaceVisibility: 'hidden',
          backfaceVisibility: 'hidden',
        }}
      >
        <div className="relative w-full bg-white rounded-[2.2rem] border border-[#0C534E]/10 shadow-[0_12px_36px_rgba(12,83,78,0.18)] px-2 h-[4.2rem] flex items-center justify-around overflow-visible">
          {[
            { name: 'Home', href: '/', icon: Home, isActive: pathname === '/' && !isCartOpen },
            { name: 'Shop', href: '/shop', icon: Store, isActive: pathname === '/shop' && !isCartOpen },
            { name: 'Dogs', href: '/c/dogs', icon: Bone, isActive: pathname.startsWith('/c/dogs') && !isCartOpen },
            { name: 'Cats', href: '/c/cats', icon: Cat, isActive: pathname.startsWith('/c/cats') && !isCartOpen },
            { name: 'Cart', isCart: true, icon: ShoppingBag, isActive: isCartOpen },
          ].map((item) => {
            const Icon = item.icon;

            if (item.isCart) {
              return (
                <div key={item.name} className="relative flex-1 flex flex-col items-center justify-center h-full overflow-visible">
                  {item.isActive && (
                    <motion.div
                      layoutId="mobileNavActiveIndicator"
                      transition={{
                        type: 'spring',
                        stiffness: 420,
                        damping: 30,
                        mass: 0.8,
                      }}
                      className="absolute -top-4 left-1/2 -translate-x-1/2 flex flex-col items-center pointer-events-none z-20 overflow-visible"
                    >
                      {/* Concentric circular cradle contour matching the round green circle */}
                      <svg
                        viewBox="0 0 96 40"
                        className="absolute -top-2 left-1/2 -translate-x-1/2 w-24 h-10 text-white fill-current pointer-events-none drop-shadow-[0_-3px_5px_rgba(12,83,78,0.06)] overflow-visible"
                      >
                        <path d="M 0 24 L 15.75 24 A 8 8 0 0 0 22.92 19.56 A 28 28 0 0 1 73.08 19.56 A 8 8 0 0 0 80.25 24 L 96 24 L 96 40 L 0 40 Z" />
                      </svg>
                      {/* Elevated Circular Bubble with icon */}
                      <div className="relative w-12 h-12 rounded-full bg-[#0C534E] text-[#FFC800] ring-4 ring-white shadow-[0_8px_24px_rgba(12,83,78,0.38)] flex items-center justify-center overflow-visible">
                        <Icon className="w-5 h-5 stroke-[2.5]" />
                        {itemCount > 0 && (
                          <span className="absolute -top-1 -right-1 min-w-4 h-4 px-1 rounded-full bg-[#FFC800] text-[#093B37] text-[0.62rem] font-black flex items-center justify-center shadow">
                            {itemCount}
                          </span>
                        )}
                      </div>
                    </motion.div>
                  )}

                  <button
                    onClick={() => setIsCartOpen(!isCartOpen)}
                    className="relative w-full h-full flex flex-col items-center justify-center cursor-pointer focus:outline-none touch-manipulation"
                    aria-label={item.isActive ? 'Close Cart' : `Open Cart (${itemCount} items)`}
                  >
                    {item.isActive ? (
                      <span className="text-[0.68rem] font-black text-[#0C534E] mt-5.5 tracking-tight">Cart</span>
                    ) : (
                      <>
                        <div className="relative">
                          <Icon className="w-5 h-5 stroke-[2.2] text-gray-400 group-hover:text-[#0C534E] transition-colors" />
                          {itemCount > 0 && (
                            <span className="absolute -top-1.5 -right-2 min-w-4 h-4 px-1 rounded-full bg-[#FFC800] text-[#093B37] text-[0.62rem] font-black flex items-center justify-center shadow">
                              {itemCount}
                            </span>
                          )}
                        </div>
                        <span className="text-[0.68rem] font-bold text-gray-500 tracking-tight mt-0.5">Cart</span>
                      </>
                    )}
                  </button>
                </div>
              );
            }

            return (
              <div key={item.name} className="relative flex-1 flex flex-col items-center justify-center h-full overflow-visible">
                {item.isActive && (
                  <motion.div
                    layoutId="mobileNavActiveIndicator"
                    transition={{
                      type: 'spring',
                      stiffness: 420,
                      damping: 30,
                      mass: 0.8,
                    }}
                    className="absolute -top-4 left-1/2 -translate-x-1/2 flex flex-col items-center pointer-events-none z-20 overflow-visible"
                  >
                    {/* Concentric circular cradle contour matching the round green circle */}
                    <svg
                      viewBox="0 0 96 40"
                      className="absolute -top-2 left-1/2 -translate-x-1/2 w-24 h-10 text-white fill-current pointer-events-none drop-shadow-[0_-3px_5px_rgba(12,83,78,0.06)] overflow-visible"
                    >
                      <path d="M 0 24 L 15.75 24 A 8 8 0 0 0 22.92 19.56 A 28 28 0 0 1 73.08 19.56 A 8 8 0 0 0 80.25 24 L 96 24 L 96 40 L 0 40 Z" />
                    </svg>
                    {/* Elevated Circular Bubble with icon */}
                    <div className="relative w-12 h-12 rounded-full bg-[#0C534E] text-[#FFC800] ring-4 ring-white shadow-[0_8px_24px_rgba(12,83,78,0.38)] flex items-center justify-center overflow-visible">
                      <Icon className="w-5 h-5 stroke-[2.5]" />
                    </div>
                  </motion.div>
                )}

                <Link
                  href={item.href!}
                  prefetch={true}
                  className="relative w-full h-full flex flex-col items-center justify-center touch-manipulation focus:outline-none"
                  aria-label={item.name}
                >
                  {item.isActive ? (
                    <span className="text-[0.68rem] font-black text-[#0C534E] mt-5.5 tracking-tight">
                      {item.name}
                    </span>
                  ) : (
                    <>
                      <Icon className="w-5 h-5 stroke-[2.2] text-gray-400 group-hover:text-[#0C534E] transition-colors" />
                      <span className="text-[0.68rem] font-bold text-gray-500 tracking-tight mt-0.5">{item.name}</span>
                    </>
                  )}
                </Link>
              </div>
            );
          })}
        </div>
      </nav>

      {/* Global Instant Search Modal */}
      <SearchModal isOpen={isSearchOpen} onClose={() => setIsSearchOpen(false)} />
    </>
  );
};

export default Header;
