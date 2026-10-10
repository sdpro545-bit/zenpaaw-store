'use client';

import React from 'react';
import { motion } from 'motion/react';

export const AnimatedBouncingToy: React.FC = () => {
  return (
    <div
      aria-hidden="true"
      className="absolute inset-0 overflow-hidden pointer-events-none select-none z-0"
    >
      {/* 1. Main Bouncing Pet Tennis Ball (Right-center background) */}
      <div className="absolute right-6 sm:right-16 md:right-28 bottom-12 sm:bottom-16 w-20 h-28 sm:w-24 sm:h-32 flex flex-col items-center justify-end opacity-35 sm:opacity-45">
        {/* Animated Bouncing Ball with Squash & Stretch */}
        <motion.div
          animate={{
            y: [-75, 0, -50, 0, -25, 0],
            scaleX: [1, 1.28, 0.92, 1.2, 0.96, 1.15],
            scaleY: [1, 0.72, 1.12, 0.8, 1.05, 0.85],
            rotate: [0, 45, 90, 135, 180, 225],
          }}
          transition={{
            duration: 2.4,
            repeat: Infinity,
            ease: [
              [0.33, 0, 0.67, 1], // drop
              [0, 0.55, 0.45, 1], // rebound
              [0.33, 0, 0.67, 1],
              [0, 0.55, 0.45, 1],
              [0.33, 0, 0.67, 1],
              [0, 0.55, 0.45, 1],
            ],
          }}
          className="relative w-14 h-14 sm:w-16 sm:h-16 rounded-full bg-gradient-to-tr from-[#E5B400] via-[#FFC800] to-[#FFF099] shadow-lg shadow-[#FFC800]/30 flex items-center justify-center transform-gpu"
        >
          {/* Tennis ball curved seam 1 */}
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
          <div className="w-5 h-5 text-[#0C534E]/60">
            <svg viewBox="0 0 24 24" fill="currentColor">
              <ellipse cx="6.5" cy="8" rx="2" ry="3" />
              <ellipse cx="12" cy="5" rx="2" ry="3" />
              <ellipse cx="17.5" cy="8" rx="2" ry="3" />
              <path d="M6 14 C6 11, 18 11, 18 14 C18 18, 14 20, 12 20 C10 20, 6 18, 6 14 Z" />
            </svg>
          </div>
        </motion.div>

        {/* Dynamic Shadow expanding/contracting in sync with bounce height */}
        <motion.div
          animate={{
            scaleX: [0.35, 1.25, 0.5, 1.15, 0.7, 1.05],
            opacity: [0.2, 0.7, 0.3, 0.6, 0.4, 0.65],
          }}
          transition={{
            duration: 2.4,
            repeat: Infinity,
            ease: 'easeInOut',
          }}
          className="w-14 h-2.5 rounded-full bg-[#093B37]/80 blur-xs mt-1"
        />
      </div>

      {/* 2. Floating Natural Rubber Bone (Left background, subtle playful float) */}
      <motion.div
        animate={{
          y: [-12, 12, -12],
          rotate: [-14, 10, -14],
        }}
        transition={{
          duration: 4.8,
          repeat: Infinity,
          ease: 'easeInOut',
        }}
        className="absolute left-4 sm:left-12 top-24 sm:top-28 opacity-25 sm:opacity-35 transform-gpu"
      >
        <svg
          width="54"
          height="32"
          viewBox="0 0 72 40"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          className="text-[#FFC800] filter drop-shadow(0 4px 10px rgba(0,0,0,0.15))"
        >
          {/* Stylized cute pet chew bone */}
          <path
            d="M 16 12 C 16 6, 8 6, 8 12 C 8 16, 5 18, 2 20 C -1 22, -1 28, 5 30 C 10 32, 15 28, 18 24 L 54 24 C 57 28, 62 32, 67 30 C 73 28, 73 22, 70 20 C 67 18, 64 16, 64 12 C 64 6, 56 6, 56 12 C 54 16, 50 16, 48 16 L 24 16 C 22 16, 18 16, 16 12 Z"
            fill="currentColor"
          />
        </svg>
      </motion.div>

      {/* 3. Playful Cat Yarn Ball (Top-right background, slow harmonic drift) */}
      <motion.div
        animate={{
          y: [0, -18, 0],
          x: [0, 8, 0],
          rotate: [0, 180, 360],
        }}
        transition={{
          duration: 6.2,
          repeat: Infinity,
          ease: 'easeInOut',
        }}
        className="absolute right-12 sm:right-36 top-12 sm:top-16 opacity-20 sm:opacity-30 transform-gpu"
      >
        <div className="relative w-12 h-12 rounded-full bg-gradient-to-tr from-[#14726B] to-[#A3D2CD] border border-white/30 flex items-center justify-center">
          {/* Yarn swirls */}
          <svg
            viewBox="0 0 100 100"
            className="w-full h-full text-white/60"
            fill="none"
            stroke="currentColor"
            strokeWidth="4"
          >
            <circle cx="50" cy="50" r="42" strokeDasharray="8 6" />
            <path d="M 20 50 C 40 20, 60 80, 80 50" />
            <path d="M 50 20 C 20 40, 80 60, 50 80" />
            {/* Playful thread tail */}
            <path d="M 75 75 C 90 95, 105 85, 110 100" strokeWidth="3" />
          </svg>
        </div>
      </motion.div>
    </div>
  );
};
