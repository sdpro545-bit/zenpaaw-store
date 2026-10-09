import type { Metadata } from 'next';
import { Plus_Jakarta_Sans, Outfit } from 'next/font/google';
import './globals.css';
import { CartProvider } from '@/context/CartContext';
import { Header } from '@/components/Header';
import { Footer } from '@/components/Footer';
import { CartDrawer } from '@/components/CartDrawer';
import { Suspense } from 'react';
import { SplashOnboarding } from '@/components/SplashOnboarding';

const jakarta = Plus_Jakarta_Sans({
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-sans',
  weight: ['400', '500', '600', '700'],
});

const outfit = Outfit({
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-display',
  weight: ['500', '600', '700', '800', '900'],
});

export const metadata: Metadata = {
  metadataBase: new URL('https://zenpaaw.com'),
  title: 'ZenPaaw | Pet Toys for Dogs and Cats',
  description:
    'Chew toys, fetch toys, tug ropes, and puzzle feeders for dogs and cats. Every order ships with tracking.',
  keywords: [
    'ZenPaaw',
    'dog toys',
    'cat toys',
    'chew toys',
    'puzzle feeders',
    'pet toys',
    'puppy toys'
  ],
  authors: [{ name: 'ZenPaaw' }],
  manifest: '/manifest.webmanifest',
  icons: {
    icon: '/icon.svg',
    shortcut: '/favicon.ico',
    apple: '/apple-icon.png',
  },
  openGraph: {
    title: 'ZenPaaw | Pet Toys for Dogs and Cats',
    description:
      'Chew toys, fetch toys, tug ropes, and puzzle feeders for dogs and cats. Every order ships with tracking.',
    url: 'https://zenpaaw.com',
    siteName: 'ZenPaaw',
    images: [
      {
        url: '/opengraph-image.png',
        width: 1200,
        height: 630,
        alt: 'ZenPaaw - Pet Toys for Dogs and Cats',
      },
    ],
    locale: 'en_US',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'ZenPaaw | Pet Toys for Dogs and Cats',
    description: 'Chew toys, fetch toys, tug ropes, and puzzle feeders for dogs and cats.',
    images: ['/opengraph-image.png'],
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={`${jakarta.variable} ${outfit.variable} font-sans scroll-smooth`}>
      <head>
        {/* Organization Structured Data Schema */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              '@context': 'https://schema.org',
              '@type': 'OnlineStore',
              name: 'ZenPaaw',
              url: 'https://zenpaaw.com',
              logo: 'https://zenpaaw.com/brand/zenpaaw-lockup-stacked.svg',
              description: 'Durable, enriching toys for dogs and cats. Transparent materials and honest play.',
              priceRange: '$$',
              paymentAccepted: 'Credit Card, PayPal, Paystack',
              currenciesAccepted: 'USD',
            }),
          }}
        />
      </head>
      <body className="min-h-screen bg-[#FAFBF9] text-[#162624] flex flex-col antialiased selection:bg-[#FFC800] selection:text-[#162624]">
        <SplashOnboarding />
        <CartProvider>
          <Suspense fallback={<div className="h-16 bg-white border-b border-gray-100" />}>
            <Header />
          </Suspense>
          <main className="flex-grow pb-20 md:pb-0">{children}</main>
          <CartDrawer />
          <Footer />
        </CartProvider>
      </body>
    </html>
  );
}
