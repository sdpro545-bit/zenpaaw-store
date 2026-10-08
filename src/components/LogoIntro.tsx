'use client';

import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { ZenPaawLogo } from './ZenPaawLogo';

export const LogoIntro: React.FC = () => {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    // Only show on first visit per browser session
    try {
      const shown = sessionStorage.getItem('zp_logo_intro_shown');
      if (!shown) {
        setIsVisible(true);
        sessionStorage.setItem('zp_logo_intro_shown', 'true');
        // Auto-dismiss under 1.2s
        const timer = setTimeout(() => {
          setIsVisible(false);
        }, 1150);
        return () => clearTimeout(timer);
      }
    } catch {
      // In case storage is unavailable
    }
  }, []);

  const handleSkip = () => {
    setIsVisible(false);
  };

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          initial={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.28, ease: [0.16, 1, 0.3, 1] }}
          onClick={handleSkip}
          className="fixed inset-0 z-50 flex items-center justify-center bg-[#0C534E] cursor-pointer select-none"
          role="dialog"
          aria-label="ZenPaaw Logo Intro (click to skip)"
        >
          <motion.div
            initial={{ scale: 0.88, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{
              duration: 0.65,
              ease: [0.16, 1, 0.3, 1],
            }}
            className="flex flex-col items-center justify-center"
          >
            <ZenPaawLogo
              variant="stacked"
              tone="onTeal"
              size="lg"
              showTagline={true}
              animateOnHover={false}
            />
            <span className="text-[0.68rem] text-white/50 mt-4 tracking-widest uppercase font-mono">
              Click to skip
            </span>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default LogoIntro;
