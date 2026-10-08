import React from 'react';
import Link from 'next/link';

interface LogoProps {
  variant?: 'full' | 'symbol' | 'compact';
  theme?: 'dark' | 'light' | 'teal' | 'yellow';
  className?: string;
  size?: 'sm' | 'md' | 'lg' | 'xl';
  showTagline?: boolean;
}

export const ZenPaawSymbol: React.FC<{
  size?: number;
  className?: string;
  primaryColor?: string;
  accentColor?: string;
}> = ({
  size = 40,
  className = '',
  primaryColor = '#0C534E',
  accentColor = '#FFC800',
}) => {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 100 100"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={`shrink-0 transition-transform duration-300 hover:scale-105 ${className}`}
      aria-label="ZenPaaw Z-Paw Monogram"
    >
      {/* 
        Custom Z + Paw Monogram:
        The bold dynamic strokes of the letter 'Z' interlock with the central paw pad.
        Four playful rounded toe pads arc gracefully over the top bar of the Z.
      */}

      {/* 4 Toe Pads dancing along the upper apex of the Z */}
      <circle cx="28" cy="18" r="7.5" fill={accentColor} />
      <circle cx="44" cy="12" r="8.5" fill={accentColor} />
      <circle cx="62" cy="13" r="8.5" fill={accentColor} />
      <circle cx="78" cy="20" r="7.5" fill={accentColor} />

      {/* Main Z Letterform with embedded soft paw geometry */}
      {/* Top horizontal bar of Z */}
      <path
        d="M20 28H76C79.3137 28 82 30.6863 82 34C82 35.8 81.2 37.4 79.8 38.6L44 68H78C81.3137 68 84 70.6863 84 74C84 77.3137 81.3137 80 78 80H22C18.6863 80 16 77.3137 16 74C16 72.2 16.8 70.6 18.2 69.4L54 40H20C16.6863 40 14 37.3137 14 34C14 30.6863 16.6863 28 20 28Z"
        fill={primaryColor}
      />

      {/* Central soft paw pad nestled in the core of the Z diagonal */}
      <ellipse
        cx="49"
        cy="54"
        rx="9"
        ry="7.5"
        fill={accentColor}
        transform="rotate(-12 49 54)"
      />
    </svg>
  );
};

export const ZenPaawLogo: React.FC<LogoProps> = ({
  variant = 'full',
  theme = 'dark',
  className = '',
  size = 'md',
  showTagline = false,
}) => {
  // Theme color mapping
  let primarySymbolColor = '#0C534E';
  let accentSymbolColor = '#FFC800';
  let textTitleColor = 'text-[#162624]';
  let textPaawAccent = 'text-[#0C534E]';
  let taglineColor = 'text-[#596A68]';

  if (theme === 'light') {
    // For dark teal backgrounds (e.g. Hero, Footer, Banners)
    primarySymbolColor = '#FFFFFF';
    accentSymbolColor = '#FFC800';
    textTitleColor = 'text-white';
    textPaawAccent = 'text-[#FFC800]';
    taglineColor = 'text-[#A3D2CD]';
  } else if (theme === 'yellow') {
    primarySymbolColor = '#162624';
    accentSymbolColor = '#0C534E';
    textTitleColor = 'text-[#162624]';
    textPaawAccent = 'text-[#0C534E]';
    taglineColor = 'text-[#485B58]';
  }

  // Size sizing
  const symbolSizes = {
    sm: 28,
    md: 38,
    lg: 48,
    xl: 60,
  };

  const textSizes = {
    sm: 'text-xl',
    md: 'text-2xl',
    lg: 'text-3xl',
    xl: 'text-4xl',
  };

  const currentSymbolSize = symbolSizes[size];

  if (variant === 'symbol') {
    return (
      <Link href="/" className={`inline-flex items-center group ${className}`}>
        <ZenPaawSymbol
          size={currentSymbolSize}
          primaryColor={primarySymbolColor}
          accentColor={accentSymbolColor}
        />
      </Link>
    );
  }

  return (
    <Link
      href="/"
      className={`inline-flex items-center gap-2.5 group select-none ${className}`}
      aria-label="ZenPaaw Home"
    >
      <ZenPaawSymbol
        size={currentSymbolSize}
        primaryColor={primarySymbolColor}
        accentColor={accentSymbolColor}
      />

      <div className="flex flex-col leading-none">
        <span
          className={`font-black tracking-tight ${textSizes[size]} ${textTitleColor} font-sans`}
          style={{ letterSpacing: '-0.03em' }}
        >
          Zen<span className={textPaawAccent}>Paaw</span>
          <span className="text-[0.45em] align-top ml-0.5 font-bold opacity-60">™</span>
        </span>
        {showTagline && (
          <span
            className={`text-[0.62rem] font-medium tracking-wide mt-0.5 ${taglineColor}`}
          >
            Happy Pets. Happier Lives.
          </span>
        )}
      </div>
    </Link>
  );
};

export default ZenPaawLogo;
