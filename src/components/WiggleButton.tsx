'use client';

import React from 'react';
import Link from 'next/link';
import { motion } from 'motion/react';
import { ArrowRight } from 'lucide-react';

interface WiggleButtonProps {
  href: string;
  label: string;
  className?: string;
}

export const WiggleButton: React.FC<WiggleButtonProps> = ({ href, label, className = '' }) => {
  return (
    <motion.div
      animate={{
        rotate: [0, -3.5, 3.5, -3, 2.5, 0],
        scale: [1, 1.035, 1.035, 1.02, 1],
      }}
      transition={{
        duration: 1.1,
        repeat: Infinity,
        repeatDelay: 2.4,
        ease: 'easeInOut',
      }}
      whileHover={{ scale: 1.06 }}
      whileTap={{ scale: 0.94 }}
      className="inline-block w-full sm:w-auto transform-gpu"
    >
      <Link
        href={href}
        className={`relative group w-full sm:w-auto px-8 py-3.5 sm:py-4 rounded-full bg-[#FFC800] text-[#162624] font-black text-xs sm:text-sm uppercase tracking-wider hover:bg-[#E5B400] transition-all shadow-xl shadow-[#FFC800]/25 flex items-center justify-center gap-2 overflow-hidden ${className}`}
      >
        {/* Subtle shimmer sheen passing across button */}
        <motion.div
          animate={{
            x: ['-100%', '200%'],
          }}
          transition={{
            duration: 2.8,
            repeat: Infinity,
            repeatDelay: 2.0,
            ease: 'linear',
          }}
          className="absolute inset-0 w-1/2 h-full bg-gradient-to-r from-transparent via-white/35 to-transparent skew-x-12 pointer-events-none"
        />

        <span className="relative z-10">{label}</span>
        <ArrowRight className="w-4 h-4 relative z-10 group-hover:translate-x-1 transition-transform" />
      </Link>
    </motion.div>
  );
};
