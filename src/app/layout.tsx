import type { Metadata } from 'next';
import { Plus_Jakarta_Sans } from 'next/font/google';
import './globals.css';
import { CartProvider } from '@/context/CartContext';
import { Header } from '@/components/Header';
import { Footer } from '@/components/Footer';
import { CartDrawer } from '@/components/CartDrawer';

const jakarta = Plus_Jakarta_Sans({
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-sans',
  weight: ['400', '500', '600', '700', '800'],
});

export const metadata: Metadata = {
  metadataBase: new URL('https://zenpaaw.com'),
  title: 'ZenPaaw™ | Better Play. Happier Pets. | 3-in-1 Pet Toys',
  description:
    'Discover the ZenPaaw 3-in-1 Pet Toy: one toy with three ways to play—play, chew, and fetch. Thoughtfully designed pet toys for happier, active dogs.',
  keywords: [
    'ZenPaaw',
    '3-in-1 pet toy',
    'dog toys',
    'interactive dog toys',
    'chew toys',
    'dental dog toy',
    'pet products',
    'fetch toy'
  ],
  authors: [{ name: 'ZenPaaw' }],
  openGraph: {
    title: 'ZenPaaw™ | One Toy. Three Ways to Play.',
    description:
      'Keep your dog engaged, active, and happy with the ZenPaaw 3-in-1 pet toy. Premium BPA-free rubber, dental cleaning nubs, and heavy-duty rope.',
    url: 'https://zenpaaw.com',
    siteName: 'ZenPaaw',
    images: [
      {
        url: '/images/hero-dog.jpg',
        width: 1200,
        height: 900,
        alt: 'ZenPaaw 3-in-1 Pet Toy with Golden Retriever',
      },
    ],
    locale: 'en_US',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'ZenPaaw™ | One Toy. Three Ways to Play.',
    description: 'Thoughtfully designed pet toys engineered for active dogs.',
    images: ['/images/hero-dog.jpg'],
  },
  icons: {
    icon: '/favicon.ico',
  },
};

import { Suspense } from 'react';

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={`${jakarta.variable} font-sans scroll-smooth`}>
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
              logo: 'https://zenpaaw.com/images/packaging-concepts.png',
              description: 'Independent modern pet lifestyle and toy brand focused on multi-functional play.',
              priceRange: '$$',
              paymentAccepted: 'Credit Card, Apple Pay, Google Pay',
              currenciesAccepted: 'USD',
            }),
          }}
        />
      </head>
      <body className="min-h-screen bg-[#FAFBF9] text-[#162624] flex flex-col antialiased selection:bg-[#FFC800] selection:text-[#162624]">
        <CartProvider>
          <Suspense fallback={<div className="h-16 bg-white border-b border-gray-100" />}>
            <Header />
          </Suspense>
          <main className="flex-grow">{children}</main>
          <CartDrawer />
          <Footer />
        </CartProvider>
      </body>
    </html>
  );
}
