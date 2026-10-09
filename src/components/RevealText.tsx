'use client';

import React, { useEffect, useRef, useState } from 'react';
import { motion, useInView } from 'motion/react';

interface RevealTextProps {
  children: React.ReactNode;
  as?: 'h1' | 'h2' | 'h3' | 'h4' | 'p' | 'span';
  by?: 'words' | 'lines';
  stagger?: number;
  className?: string;
  highlightWords?: string[];
}

export function RevealText({
  children,
  as: Component = 'h1',
  by = 'words',
  stagger = 0.045,
  className = '',
  highlightWords = [],
}: RevealTextProps) {
  const ref = useRef<HTMLElement>(null);
  const isInView = useInView(ref, { once: true, margin: '-10%' });
  const [fontsReady, setFontsReady] = useState(false);
  const [hasJs, setHasJs] = useState(false);

  useEffect(() => {
    setHasJs(true);
    if (typeof document !== 'undefined') {
      document.documentElement.classList.add('js');
      if (document.fonts) {
        document.fonts.ready.then(() => setFontsReady(true));
      } else {
        setFontsReady(true);
      }
    }
  }, []);

  const fullText = typeof children === 'string' ? children : React.Children.toArray(children).join(' ');
  const words = fullText.split(/\s+/).filter(Boolean);
  const mode = by === 'words' && words.length > 12 ? 'lines' : by;

  // Render standard text for SSR & crawlers
  if (!hasJs || !fontsReady) {
    return (
      <Component ref={ref as any} className={className} data-reveal-heading="true">
        {children}
      </Component>
    );
  }

  return (
    <Component
      ref={ref as any}
      className={`relative inline-block ${className}`}
      aria-label={fullText}
      data-reveal-heading="true"
    >
      {mode === 'words' ? (
        <span aria-hidden="true" className="inline-flex flex-wrap gap-x-[0.28em]">
          {words.map((word, index) => {
            const isHighlight = highlightWords.some((h) => word.toLowerCase().includes(h.toLowerCase()));
            return (
              <span
                key={`${word}-${index}`}
                className="inline-block overflow-hidden pb-[0.14em]"
                style={{ verticalAlign: 'top' }}
              >
                <motion.span
                  className={`inline-block ${isHighlight ? 'text-[#FFC800] relative' : ''}`}
                  initial={{ transform: 'translateY(105%) rotate(2deg)', opacity: 0 }}
                  animate={
                    isInView
                      ? { transform: 'translateY(0%) rotate(0deg)', opacity: 1 }
                      : { transform: 'translateY(105%) rotate(2deg)', opacity: 0 }
                  }
                  transition={{
                    duration: 0.72,
                    ease: [0.16, 1, 0.3, 1],
                    delay: Math.min(index * stagger, 0.45),
                  }}
                >
                  {word}
                  {isHighlight && (
                    <motion.svg
                      className="absolute -bottom-1 left-0 w-full h-2 text-[#FFC800] pointer-events-none"
                      viewBox="0 0 100 12"
                      preserveAspectRatio="none"
                      initial={{ pathLength: 0, opacity: 0 }}
                      animate={isInView ? { pathLength: 1, opacity: 1 } : { pathLength: 0, opacity: 0 }}
                      transition={{ delay: 0.45 + index * stagger, duration: 0.5 }}
                    >
                      <path
                        d="M 2 8 Q 50 12 98 6"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="3.5"
                        strokeLinecap="round"
                      />
                    </motion.svg>
                  )}
                </motion.span>
              </span>
            );
          })}
        </span>
      ) : (
        <span aria-hidden="true" className="block overflow-hidden pb-[0.14em]">
          <motion.span
            className="block"
            initial={{ transform: 'translateY(105%) rotate(1deg)', opacity: 0 }}
            animate={
              isInView
                ? { transform: 'translateY(0%) rotate(0deg)', opacity: 1 }
                : { transform: 'translateY(105%) rotate(1deg)', opacity: 0 }
            }
            transition={{ duration: 0.72, ease: [0.16, 1, 0.3, 1] }}
          >
            {children}
          </motion.span>
        </span>
      )}
    </Component>
  );
}

export function RevealBlock({
  children,
  className = '',
  delay = 0,
}: {
  children: React.ReactNode;
  className?: string;
  delay?: number;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once: true, margin: '-10%' });

  return (
    <motion.div
      ref={ref}
      className={className}
      initial={{ opacity: 0, y: 16 }}
      animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 16 }}
      transition={{ duration: 0.48, ease: [0.16, 1, 0.3, 1], delay }}
    >
      {children}
    </motion.div>
  );
}
