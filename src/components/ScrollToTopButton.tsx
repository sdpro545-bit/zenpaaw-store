'use client';

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';

export const ScrollToTopButton: React.FC = () => {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      // Appear when user scrolls down beyond 300px
      if (window.scrollY > 300) {
        setIsVisible(true);
      } else {
        setIsVisible(false);
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    handleScroll();

    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth',
    });
  };

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.button
          key="scroll-to-top"
          initial={{ opacity: 0, scale: 0.6, y: 16 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.6, y: 16 }}
          transition={{ type: 'spring', stiffness: 420, damping: 26 }}
          onClick={scrollToTop}
          aria-label="Back to top"
          className="fixed bottom-20 right-4 sm:bottom-6 sm:right-6 z-40 w-9 h-9 sm:w-10 sm:h-10 rounded-full bg-black text-white hover:bg-neutral-800 active:bg-neutral-900 shadow-xl shadow-black/35 flex items-center justify-center cursor-pointer transition-transform hover:scale-110 active:scale-95 touch-manipulation group"
        >
          {/* Thick rounded chevron up icon matching user reference image */}
          <svg
            viewBox="0 0 24 24"
            className="w-4 h-4 sm:w-4.5 sm:h-4.5 text-white transition-transform group-hover:-translate-y-0.5"
            fill="none"
            stroke="currentColor"
            strokeWidth="3.4"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <path d="M 6 14.5 L 12 8.5 L 18 14.5" />
          </svg>
        </motion.button>
      )}
    </AnimatePresence>
  );
};
