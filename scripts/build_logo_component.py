import os
import re

with open('public/brand/zenpaaw-symbol.svg', 'r', encoding='utf-8') as f:
    sym = f.read()

toe_ol = re.search(r'id="zenpaaw-toe-outer-left"\s+d="([^"]+)"', sym).group(1)
toe_il = re.search(r'id="zenpaaw-toe-inner-left"\s+d="([^"]+)"', sym).group(1)
toe_ir = re.search(r'id="zenpaaw-toe-inner-right"\s+d="([^"]+)"', sym).group(1)
toe_or = re.search(r'id="zenpaaw-toe-outer-right"\s+d="([^"]+)"', sym).group(1)
heel = re.search(r'id="zenpaaw-heel-pad"\s+d="([^"]+)"', sym).group(1)

with open('public/brand/zenpaaw-lockup-stacked.svg', 'r', encoding='utf-8') as f:
    stacked = f.read()

stacked_vb = re.search(r'viewBox="([^"]+)"', stacked).group(1)
wm_group = re.search(r'<g id="zenpaaw-wordmark"[^>]*>(.*?)</g>', stacked, re.DOTALL).group(1).strip()
tag_group = re.search(r'<g id="zenpaaw-tagline"[^>]*>(.*?)</g>', stacked, re.DOTALL).group(1).strip()

with open('public/brand/zenpaaw-horizontal.svg', 'r', encoding='utf-8') as f:
    horiz = f.read()
horiz_vb = re.search(r'viewBox="([^"]+)"', horiz).group(1)

template = '''import React from 'react';
import Link from 'next/link';

export interface ZenPaawLogoProps {
  variant?: 'symbol' | 'horizontal' | 'stacked';
  tone?: 'onTeal' | 'onLight';
  size?: 'sm' | 'md' | 'lg' | 'xl' | number;
  showTagline?: boolean;
  className?: string;
  animateOnHover?: boolean;
}

export const ZenPaawLogo: React.FC<ZenPaawLogoProps> = ({
  variant = 'horizontal',
  tone = 'onLight',
  size = 'md',
  showTagline = true,
  className = '',
  animateOnHover = true,
}) => {
  // Dimensions per Section 4.2:
  // Minimum sizes: symbol 20px, horizontal lockup 112px wide, tagline shown only when lockup >= 220px wide
  const getDimensions = () => {
    if (typeof size === 'number') {
      return { width: Math.max(size, variant === 'symbol' ? 20 : 112) };
    }
    switch (size) {
      case 'sm':
        return {
          width: variant === 'symbol' ? 24 : variant === 'horizontal' ? 120 : 140,
        };
      case 'md':
        return {
          width: variant === 'symbol' ? 36 : variant === 'horizontal' ? 168 : 200,
        };
      case 'lg':
        return {
          width: variant === 'symbol' ? 52 : variant === 'horizontal' ? 240 : 280,
        };
      case 'xl':
        return {
          width: variant === 'symbol' ? 72 : variant === 'horizontal' ? 320 : 380,
        };
    }
  };

  const { width } = getDimensions();
  const canShowTagline = showTagline && width >= 220;

  // Colors per Section 4.1 & 4.3:
  // Symbol is always #FFC800.
  // Wordmark is one solid colour: white on teal, teal (#0C534E) on light.
  // Tagline is #FFC800.
  const yellowColor = '#FFC800';
  const wordmarkColor = tone === 'onTeal' ? '#FFFFFF' : '#0C534E';

  // Toe animation classes for interactive micro-interaction
  const toeAnim = animateOnHover ? 'transition-transform duration-300 group-hover:-translate-y-2' : '';

  if (variant === 'symbol') {
    return (
      <Link
        href="/"
        className={"inline-flex items-center justify-center group focus:outline-none focus-visible:ring-2 focus-visible:ring-[#FFC800] rounded-full " + className}
        aria-label="ZenPaaw Home"
      >
        <svg
          viewBox="0 0 1469 1312"
          width={width}
          height={Math.round(width * (1312 / 1469))}
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          className="shrink-0 overflow-visible"
        >
          <g fill={yellowColor}>
            <path
              id="zenpaaw-toe-outer-left"
              d="__TOE_OL__"
              className={toeAnim + " origin-center group-hover:-rotate-3"}
            />
            <path
              id="zenpaaw-toe-inner-left"
              d="__TOE_IL__"
              className={toeAnim + " group-hover:-translate-y-3 delay-75"}
            />
            <path
              id="zenpaaw-toe-inner-right"
              d="__TOE_IR__"
              className={toeAnim + " group-hover:-translate-y-3 delay-100"}
            />
            <path
              id="zenpaaw-toe-outer-right"
              d="__TOE_OR__"
              className={toeAnim + " origin-center group-hover:rotate-3 delay-150"}
            />
            <path id="zenpaaw-heel-pad" d="__HEEL__" />
          </g>
        </svg>
      </Link>
    );
  }

  if (variant === 'stacked') {
    return (
      <Link
        href="/"
        className={"inline-flex flex-col items-center group focus:outline-none focus-visible:ring-2 focus-visible:ring-[#FFC800] rounded-xl p-1 " + className}
        aria-label="ZenPaaw - Happy Pets, Happier Lives"
      >
        <svg
          viewBox="__STACKED_VB__"
          width={width}
          height={Math.round(width * (2506 / 3574))}
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          className="shrink-0 overflow-visible"
        >
          <g fill={yellowColor}>
            <path
              d="__TOE_OL__"
              className={toeAnim}
              transform="translate(1052, 0)"
            />
            <path
              d="__TOE_IL__"
              className={toeAnim + " delay-75"}
              transform="translate(1052, 0)"
            />
            <path
              d="__TOE_IR__"
              className={toeAnim + " delay-100"}
              transform="translate(1052, 0)"
            />
            <path
              d="__TOE_OR__"
              className={toeAnim + " delay-150"}
              transform="translate(1052, 0)"
            />
            <path d="__HEEL__" transform="translate(1052, 0)" />
          </g>
          <g fill={wordmarkColor} transform="translate(0, 100)">
            __WM_GROUP__
          </g>
          {canShowTagline && (
            <g fill={yellowColor} transform="translate(0, 100)">
              __TAG_GROUP__
            </g>
          )}
        </svg>
      </Link>
    );
  }

  // Default: Horizontal Lockup
  return (
    <Link
      href="/"
      className={"inline-flex items-center group focus:outline-none focus-visible:ring-2 focus-visible:ring-[#FFC800] rounded-xl py-1 px-1.5 " + className}
      aria-label="ZenPaaw - Pet Toys for Dogs and Cats"
    >
      <svg
        viewBox="__HORIZ_VB__"
        width={width}
        height={Math.round(width * (686 / 4278))}
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="shrink-0 overflow-visible"
      >
        {/* Symbol (scaled to align with wordmark) */}
        <g transform="scale(0.4672)" fill={yellowColor}>
          <path d="__TOE_OL__" className={toeAnim} />
          <path d="__TOE_IL__" className={toeAnim + " delay-75"} />
          <path d="__TOE_IR__" className={toeAnim + " delay-100"} />
          <path d="__TOE_OR__" className={toeAnim + " delay-150"} />
          <path d="__HEEL__" />
        </g>
        {/* Wordmark (Solid single color) */}
        <g transform="translate(746, 0)" fill={wordmarkColor}>
          __WM_GROUP__
        </g>
      </svg>
    </Link>
  );
};

export default ZenPaawLogo;
'''

output = template.replace('__TOE_OL__', toe_ol)
output = output.replace('__TOE_IL__', toe_il)
output = output.replace('__TOE_IR__', toe_ir)
output = output.replace('__TOE_OR__', toe_or)
output = output.replace('__HEEL__', heel)
output = output.replace('__STACKED_VB__', stacked_vb)
output = output.replace('__WM_GROUP__', wm_group)
output = output.replace('__TAG_GROUP__', tag_group)
output = output.replace('__HORIZ_VB__', horiz_vb)

with open('src/components/ZenPaawLogo.tsx', 'w', encoding='utf-8') as f:
    f.write(output)

print("Generated src/components/ZenPaawLogo.tsx successfully!")
