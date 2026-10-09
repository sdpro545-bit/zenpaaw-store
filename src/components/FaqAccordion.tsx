'use client';

import React, { useState } from 'react';
import { Plus, Minus } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

interface FaqItem {
  q: string;
  a: string;
}

export function FaqAccordion({ items }: { items: FaqItem[] }) {
  const [openIdx, setOpenIdx] = useState<number | null>(0);

  return (
    <div className="space-y-3">
      {items.map((item, idx) => {
        const isOpen = openIdx === idx;
        return (
          <div
            key={idx}
            className={`rounded-2xl transition-all duration-300 border ${
              isOpen
                ? 'bg-[#0C534E] text-white border-[#0C534E] shadow-md'
                : 'bg-white text-[#162624] border-gray-100 hover:border-gray-200 shadow-sm'
            }`}
          >
            <button
              type="button"
              onClick={() => setOpenIdx(isOpen ? null : idx)}
              className="w-full px-6 py-5 flex items-center justify-between text-left gap-4 font-black text-base sm:text-lg focus:outline-none"
              aria-expanded={isOpen}
            >
              <span className={isOpen ? 'text-[#FFC800]' : 'text-[#162624]'}>
                {item.q}
              </span>
              <span
                className={`p-1.5 rounded-full transition-transform duration-300 shrink-0 ${
                  isOpen ? 'bg-[#FFC800] text-[#162624] rotate-180' : 'bg-gray-100 text-gray-500'
                }`}
              >
                {isOpen ? <Minus className="w-4 h-4 stroke-[2.5]" /> : <Plus className="w-4 h-4 stroke-[2.5]" />}
              </span>
            </button>
            <AnimatePresence initial={false}>
              {isOpen && (
                <motion.div
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: 'auto', opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  transition={{ duration: 0.28, ease: [0.16, 1, 0.3, 1] }}
                  className="overflow-hidden"
                >
                  <div className="px-6 pb-6 text-sm sm:text-base leading-relaxed text-[#D3E8E6] font-normal border-t border-white/10 pt-4">
                    {item.a}
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        );
      })}
    </div>
  );
}
