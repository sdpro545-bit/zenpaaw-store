'use client';

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';

interface SloganPair {
  prefix: string;
  word1: string;
  middle: string;
  word2: string;
  suffix?: string;
}

const PHRASES: SloganPair[] = [
  {
    prefix: 'Built to',
    word1: 'Play',
    middle: ', Made to',
    word2: 'Last.',
  },
  {
    prefix: 'Meet',
    word1: 'Smart Toys',
    middle: 'for',
    word2: 'Smarter Pets.',
  },
  {
    prefix: 'Safe to',
    word1: 'Chew',
    middle: ', Born to',
    word2: 'Fetch.',
  },
  {
    prefix: 'Engineered for',
    word1: 'Joy',
    middle: ', Tested to',
    word2: 'Endure.',
  },
];

export const HeroWordSwitcher: React.FC = () => {
  const [index, setIndex] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setIndex((prev) => (prev + 1) % PHRASES.length);
    }, 2800);
    return () => clearInterval(timer);
  }, []);

  const current = PHRASES[index];

  return (
    <div className="space-y-1">
      <h1 className="text-3xl sm:text-5xl lg:text-6xl font-black tracking-tight leading-[1.12] sm:leading-[1.08] text-white">
        <span>Durable Pet Toys, </span>
        <span className="inline-block relative min-h-[1.25em] align-top">
          <AnimatePresence mode="wait">
            <motion.span
              key={index}
              initial={{ y: 22, opacity: 0, filter: 'blur(4px)' }}
              animate={{ y: 0, opacity: 1, filter: 'blur(0px)' }}
              exit={{ y: -22, opacity: 0, filter: 'blur(4px)' }}
              transition={{ duration: 0.45, ease: [0.16, 1, 0.3, 1] }}
              className="inline-flex flex-wrap items-center justify-center lg:justify-start gap-x-2"
            >
              <span className="text-white/90 font-medium">{current.prefix}</span>
              <span className="relative inline-block px-2.5 py-0.5 rounded-lg bg-[#FFC800] text-[#162624] font-black shadow-md shadow-[#FFC800]/25 transform -rotate-1">
                {current.word1}
              </span>
              <span className="text-white/90 font-medium">{current.middle}</span>
              <span className="relative inline-block px-2.5 py-0.5 rounded-lg bg-[#FFC800] text-[#162624] font-black shadow-md shadow-[#FFC800]/25 transform rotate-1">
                {current.word2}
              </span>
            </motion.span>
          </AnimatePresence>
        </span>
      </h1>
    </div>
  );
};
