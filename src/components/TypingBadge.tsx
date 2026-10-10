'use client';

import React, { useState, useEffect } from 'react';
import { motion } from 'motion/react';

interface TypingBadgeProps {
  className?: string;
  text?: string;
}

export const TypingBadge: React.FC<TypingBadgeProps> = ({
  className = '',
  text = 'Smart Toys, Smarter Pets',
}) => {
  const [displayedText, setDisplayedText] = useState('');
  const [isDeleting, setIsDeleting] = useState(false);
  const [loopNum, setLoopNum] = useState(0);

  useEffect(() => {
    let timer: NodeJS.Timeout;

    if (!isDeleting && displayedText === text) {
      // Pause when fully typed
      timer = setTimeout(() => setIsDeleting(true), 3200);
    } else if (isDeleting && displayedText === '') {
      // Pause when completely cleared, then re-type
      setIsDeleting(false);
      setLoopNum((prev) => prev + 1);
      timer = setTimeout(() => {}, 400);
    } else {
      const speed = isDeleting ? 45 : 90;
      timer = setTimeout(() => {
        setDisplayedText((prev) =>
          isDeleting ? prev.slice(0, -1) : text.slice(0, prev.length + 1)
        );
      }, speed);
    }

    return () => clearTimeout(timer);
  }, [displayedText, isDeleting, text, loopNum]);

  return (
    <div
      className={`px-3.5 py-1.5 sm:px-4 sm:py-2 rounded-full bg-white text-[#162624] font-black text-xs shadow-xl flex items-center gap-2 border border-gray-100 select-none ${className}`}
    >
      <span className="relative flex h-2.5 w-2.5">
        <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
        <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-emerald-500" />
      </span>
      <span className="tracking-tight min-w-[155px] sm:min-w-[170px] inline-flex items-center">
        {displayedText}
        <motion.span
          animate={{ opacity: [1, 0, 1] }}
          transition={{ duration: 0.8, repeat: Infinity }}
          className="inline-block w-0.5 h-3.5 bg-emerald-600 ml-0.5 align-middle"
        />
      </span>
    </div>
  );
};
