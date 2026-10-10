'use client';

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { ShieldCheck, Truck, RotateCcw, X, ArrowRight, Sparkles } from 'lucide-react';
import { AnimatedZenPaawWordmark } from './AnimatedZenPaawWordmark';
import { ZenPaawPawSymbol } from './ZenPaawPawSymbol';

export function SplashOnboarding() {
  const [isVisible, setIsVisible] = useState(false);
  const [stage, setStage] = useState<'logo' | 'onboarding'>('logo');

  useEffect(() => {
    try {
      const isForced = typeof window !== 'undefined' && (
        window.location.search.includes('intro') ||
        window.location.search.includes('splash')
      );
      const seen = sessionStorage.getItem('zenpaaw_onboarding_viewed');
      if (!seen || isForced) {
        setIsVisible(true);
        const t1 = setTimeout(() => setStage('onboarding'), 1500);
        const t2 = setTimeout(() => {
          handleDismiss();
        }, 4500);

        return () => {
          clearTimeout(t1);
          clearTimeout(t2);
        };
      }
    } catch {
      // Storage unavailable fallback
    }
  }, []);

  useEffect(() => {
    const handleReplay = () => {
      setIsVisible(true);
      setStage('logo');
      const t1 = setTimeout(() => setStage('onboarding'), 1500);
      const t2 = setTimeout(() => handleDismiss(), 4500);
    };
    window.addEventListener('replay_zenpaaw_intro', handleReplay);
    return () => window.removeEventListener('replay_zenpaaw_intro', handleReplay);
  }, []);

  const handleDismiss = () => {
    try {
      sessionStorage.setItem('zenpaaw_onboarding_viewed', 'true');
    } catch {
      // Storage fallback
    }
    setIsVisible(false);
  };

  if (!isVisible) return null;

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          key="splash-overlay"
          initial={{ opacity: 1 }}
          exit={{ opacity: 0, scale: 1.02 }}
          transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
          className="fixed inset-0 z-[9999] bg-[#0C534E] text-white flex flex-col items-center justify-center p-4 sm:p-6 select-none overflow-y-auto"
          role="dialog"
          aria-label="ZenPaaw onboarding intro"
        >
          {/* Ambient backdrop glow */}
          <div className="absolute w-[40rem] h-[40rem] rounded-full bg-[#FFC800]/10 blur-3xl pointer-events-none" />

          {/* Ambient Logo Icon Mark Overlay (Low Opacity Backdrop) */}
          <div className="absolute inset-0 flex items-center justify-center pointer-events-none overflow-hidden z-0">
            <motion.div
              animate={{
                rotate: [0, 8, 0, -8, 0],
                scale: [1, 1.05, 1, 0.98, 1],
              }}
              transition={{
                duration: 18,
                repeat: Infinity,
                ease: 'easeInOut',
              }}
              className="w-[28rem] h-[28rem] sm:w-[42rem] sm:h-[42rem] md:w-[54rem] md:h-[54rem] text-white opacity-[0.06] sm:opacity-[0.07] select-none transform-gpu"
            >
              <ZenPaawPawSymbol className="w-full h-full" />
            </motion.div>
          </div>

          {/* Ambient Floating Chew Bone (Left background) */}
          <motion.div
            animate={{
              y: [-10, 10, -10],
              rotate: [-14, 12, -14],
            }}
            transition={{ duration: 4.8, repeat: Infinity, ease: 'easeInOut' }}
            className="absolute left-4 sm:left-12 top-24 sm:top-28 opacity-25 sm:opacity-35 pointer-events-none select-none text-[#FFC800] z-0 transform-gpu"
          >
            <svg width="48" height="28" viewBox="0 0 72 40" fill="currentColor">
              <path d="M 16 12 C 16 6, 8 6, 8 12 C 8 16, 5 18, 2 20 C -1 22, -1 28, 5 30 C 10 32, 15 28, 18 24 L 54 24 C 57 28, 62 32, 67 30 C 73 28, 73 22, 70 20 C 67 18, 64 16, 64 12 C 64 6, 56 6, 56 12 C 54 16, 50 16, 48 16 L 24 16 C 22 16, 18 16, 16 12 Z" />
            </svg>
          </motion.div>

          {/* Ambient Playful Cat Yarn Ball (Right background) */}
          <motion.div
            animate={{
              y: [0, -14, 0],
              rotate: [0, 180, 360],
            }}
            transition={{ duration: 6.2, repeat: Infinity, ease: 'easeInOut' }}
            className="absolute right-6 sm:right-16 top-16 sm:top-20 opacity-20 sm:opacity-30 pointer-events-none select-none z-0 transform-gpu"
          >
            <div className="w-11 h-11 rounded-full bg-gradient-to-tr from-[#14726B] to-[#A3D2CD] border border-white/20 flex items-center justify-center p-1">
              <svg viewBox="0 0 100 100" className="w-full h-full text-white/60" fill="none" stroke="currentColor" strokeWidth="4">
                <circle cx="50" cy="50" r="42" strokeDasharray="8 6" />
                <path d="M 20 50 C 40 20, 60 80, 80 50" />
                <path d="M 50 20 C 20 40, 80 60, 50 80" />
              </svg>
            </div>
          </motion.div>

          {/* Visible Skip Button */}
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.15 }}
            className="absolute top-6 right-6 z-20"
          >
            <button
              onClick={handleDismiss}
              className="flex items-center gap-1.5 px-4 py-2 rounded-full bg-white/10 hover:bg-white/20 border border-white/20 text-[#FFC800] text-xs font-black uppercase tracking-wider transition-all hover:scale-105 active:scale-95 shadow-lg backdrop-blur-md cursor-pointer"
            >
              <span>Skip</span>
              <X className="w-3.5 h-3.5 stroke-[2.5]" />
            </button>
          </motion.div>

          {/* Center Stage */}
          <div className="relative z-10 max-w-lg w-full flex flex-col items-center text-center space-y-5 sm:space-y-6">
            {/* Official ZenPaaw Paw Symbol with Spring Animation */}
            <motion.div
              initial={{ scale: 0, rotate: -25, opacity: 0 }}
              animate={{ scale: 1, rotate: 0, opacity: 1 }}
              transition={{
                type: 'spring',
                stiffness: 280,
                damping: 20,
                delay: 0.1,
              }}
              className="w-20 h-20 sm:w-24 sm:h-24 rounded-3xl bg-[#FFC800] text-[#0C534E] flex items-center justify-center shadow-2xl shadow-[#FFC800]/30 relative p-3 sm:p-3.5"
            >
              <ZenPaawPawSymbol className="w-full h-full" />
            </motion.div>

            {/* Authentic Bespoke Vector Wordmark (Letter-by-Letter Dynamic Spring Animation) */}
            <div className="w-full max-w-[17rem] sm:max-w-[22rem] md:max-w-[26rem] flex justify-center py-1 px-2">
              <AnimatedZenPaawWordmark className="w-full h-auto filter drop-shadow-xl" color="#FFFFFF" />
            </div>

            {/* Dynamic Bouncing Pet Toy Animation with Squash & Stretch */}
            <div className="flex flex-col items-center justify-center select-none pointer-events-none py-0.5">
              <motion.div
                animate={{
                  y: [-38, 0, -24, 0, -10, 0],
                  scaleX: [1, 1.28, 0.92, 1.18, 0.96, 1.1],
                  scaleY: [1, 0.72, 1.14, 0.82, 1.05, 0.92],
                  rotate: [0, 45, 90, 135, 180, 225],
                }}
                transition={{
                  duration: 2.1,
                  repeat: Infinity,
                  ease: [
                    [0.33, 0, 0.67, 1],
                    [0, 0.55, 0.45, 1],
                    [0.33, 0, 0.67, 1],
                    [0, 0.55, 0.45, 1],
                    [0.33, 0, 0.67, 1],
                    [0, 0.55, 0.45, 1],
                  ],
                }}
                className="relative w-11 h-11 sm:w-12 sm:h-12 rounded-full bg-gradient-to-tr from-[#E5B400] via-[#FFC800] to-[#FFF099] shadow-lg shadow-[#FFC800]/40 flex items-center justify-center transform-gpu"
              >
                {/* Tennis ball curved seam */}
                <svg
                  viewBox="0 0 100 100"
                  className="absolute inset-0 w-full h-full text-white/50"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="5"
                  strokeLinecap="round"
                >
                  <path d="M 22 8 C 45 30, 45 70, 22 92" />
                  <path d="M 78 8 C 55 30, 55 70, 78 92" />
                </svg>

                {/* Cute paw print stamp on ball */}
                <div className="w-4 h-4 text-[#0C534E]/70">
                  <svg viewBox="0 0 24 24" fill="currentColor">
                    <ellipse cx="6.5" cy="8" rx="2" ry="3" />
                    <ellipse cx="12" cy="5" rx="2" ry="3" />
                    <ellipse cx="17.5" cy="8" rx="2" ry="3" />
                    <path d="M6 14 C6 11, 18 11, 18 14 C18 18, 14 20, 12 20 C10 20, 6 18, 6 14 Z" />
                  </svg>
                </div>
              </motion.div>

              {/* Dynamic ground shadow expanding / contracting in sync with bounce height */}
              <motion.div
                animate={{
                  scaleX: [0.35, 1.25, 0.5, 1.15, 0.7, 1.05],
                  opacity: [0.2, 0.75, 0.3, 0.65, 0.4, 0.7],
                }}
                transition={{
                  duration: 2.1,
                  repeat: Infinity,
                  ease: 'easeInOut',
                }}
                className="w-11 h-2 rounded-full bg-[#052624]/90 blur-[2px] mt-1"
              />
            </div>

            {/* Onboarding Stage Content */}
            <AnimatePresence mode="wait">
              {stage === 'logo' ? (
                <motion.p
                  key="tagline-intro"
                  initial={{ opacity: 0, y: 15 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -15 }}
                  transition={{ delay: 0.6 }}
                  className="text-xs sm:text-sm uppercase tracking-widest text-[#FFC800] font-black"
                >
                  Happy Pets, Happier Lives.
                </motion.p>
              ) : (
                <motion.div
                  key="onboarding-features"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  className="space-y-4 pt-1 w-full"
                >
                  <p className="text-xs sm:text-sm md:text-base text-[#D3E8E6] font-medium leading-relaxed max-w-sm mx-auto">
                    Durability-tested chew toys, fetch balls, and interactive puzzle feeders for dogs and cats.
                  </p>

                  <div className="grid grid-cols-3 gap-1.5 sm:gap-2.5 text-[0.62rem] sm:text-xs font-bold text-[#A3D2CD] pt-2">
                    <div className="p-2 sm:p-3 rounded-2xl bg-white/5 border border-white/10 flex flex-col items-center text-center gap-1 backdrop-blur-sm">
                      <Truck className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-[#FFC800]" />
                      <span className="leading-tight">Free Shipping $35+</span>
                    </div>
                    <div className="p-2 sm:p-3 rounded-2xl bg-white/5 border border-white/10 flex flex-col items-center text-center gap-1 backdrop-blur-sm">
                      <RotateCcw className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-[#FFC800]" />
                      <span className="leading-tight">30-Day Returns</span>
                    </div>
                    <div className="p-2 sm:p-3 rounded-2xl bg-white/5 border border-white/10 flex flex-col items-center text-center gap-1 backdrop-blur-sm">
                      <ShieldCheck className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-[#FFC800]" />
                      <span className="leading-tight">Tracked Delivery</span>
                    </div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

            {/* Loading & Enter Action */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.8 }}
              className="w-full pt-4 space-y-3"
            >
              {/* Animated Progress Bar */}
              <div className="w-48 mx-auto h-1.5 rounded-full bg-white/15 overflow-hidden">
                <motion.div
                  initial={{ width: '0%' }}
                  animate={{ width: '100%' }}
                  transition={{ duration: 3.6, ease: 'easeInOut' }}
                  className="h-full bg-[#FFC800] rounded-full"
                />
              </div>

              <button
                onClick={handleDismiss}
                className="inline-flex items-center gap-2 text-xs font-black text-[#FFC800] hover:text-[#E5B400] transition group cursor-pointer"
              >
                <span>Enter Storefront</span>
                <ArrowRight className="w-3.5 h-3.5 transition-transform group-hover:translate-x-1" />
              </button>
            </motion.div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
