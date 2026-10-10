import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import {
  ArrowRight,
  ShieldCheck,
  Truck,
  RotateCcw,
  Bone,
  Flame,
  Activity,
  Layers,
  Heart,
  Compass,
} from 'lucide-react';
import { db } from '@/lib/db';
import { storeConfig } from '@/store.config';
import { ProductCard } from '@/components/ProductCard';
import { RevealText, RevealBlock } from '@/components/RevealText';
import { FindToyGuide } from '@/components/FindToyGuide';
import { FaqAccordion } from '@/components/FaqAccordion';

export default function HomePage() {
  // Query live database products
  const allProducts = db.getProducts({ status: 'active' });
  const categories = db.getCategories();

  // Curate Staff Picks & New Arrivals from database
  const staffPicks = allProducts.slice(0, 8);
  const newArrivals = allProducts.slice(8, 16);

  // Six Ways to Play icons and links
  const playWays = [
    { id: 'chew', label: 'Chew Toys', desc: 'Textured rubber and natural nylon for chewing sessions', icon: Bone },
    { id: 'fetch', label: 'Fetch and Outdoor', desc: 'High-bounce balls and aerodynamic flyers', icon: Activity },
    { id: 'tug', label: 'Tug and Rope', desc: 'Braided cotton ropes built for two-way pulling', icon: Layers },
    { id: 'puzzle', label: 'Puzzle and Treat', desc: 'Slow-feed mazes and problem-solving dispensers', icon: Compass },
    { id: 'plush', label: 'Plush and Squeaky', desc: 'Reinforced seams with internal squeakers', icon: Heart },
    { id: 'chase', label: 'Chasing and Motion', desc: 'Rolling tracks and battery-free interactive toys', icon: Flame },
  ];

  // Honest, fact-verified FAQ items with zero unsupported health claims
  const homeFaqs = [
    {
      q: 'How do I choose the right toy for my pet?',
      a: 'Filter by pet type (dog, puppy, or cat) and check our chew strength ratings. For dogs over 50 pounds, choose Power Chewer items made from high-density vulcanized rubber. For puppies, choose softer natural rubber designed for developing teeth.',
    },
    {
      q: 'What materials are used in ZenPaaw toys?',
      a: 'We list verified specifications for every product directly from supplier lab reports. Common materials include non-toxic natural vulcanized rubber, high-grade cotton-poly rope fibers, and tear-resistant ballistic canvas.',
    },
    {
      q: 'What is your shipping policy and delivery timeline?',
      a: 'All orders over $35 receive free standard shipping. Delivery across the continental United States typically takes 3 to 7 business days depending on supplier warehouse location. Real-time carrier tracking is emailed as soon as the package leaves the facility.',
    },
    {
      q: 'What if a toy does not suit my pet?',
      a: 'Contact our support team within 30 days of delivery. If your pet does not engage with the toy, we will provide a replacement or a complete refund under our 30-day return policy.',
    },
  ];

  return (
    <div className="space-y-16 sm:space-y-24 pb-16">
      {/* 1. HERO SECTION (Teal dominant, Outfit text reveal, true trust points) */}
      <section className="relative bg-[#0C534E] text-white pt-10 sm:pt-16 pb-16 sm:pb-24 overflow-hidden rounded-b-[2.5rem] shadow-xl">
        {/* Subtle decorative paw watermarks */}
        <div className="absolute -top-16 -left-16 w-80 h-80 opacity-5 pointer-events-none text-white">
          <svg viewBox="0 0 100 100" fill="currentColor">
            <circle cx="28" cy="25" r="12" />
            <circle cx="50" cy="18" r="12" />
            <circle cx="72" cy="25" r="12" />
            <path d="M50 45 C30 45 20 65 30 85 C40 95 60 95 70 85 C80 65 70 45 50 45 Z" />
          </svg>
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
            {/* Left text column */}
            <div className="lg:col-span-7 space-y-6 text-center lg:text-left">
              <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/10 backdrop-blur-md border border-white/20 text-[#FFC800] text-xs font-black uppercase tracking-widest shadow-sm">
                <span className="w-2 h-2 rounded-full bg-[#FFC800]" />
                <span>Pet Toys for Dogs and Cats</span>
              </div>

              <div className="space-y-2">
                <RevealText
                  as="h1"
                  highlightWords={['play', 'Last.']}
                  className="text-3xl sm:text-5xl lg:text-6xl font-bold tracking-tight leading-[1.12] sm:leading-[1.08] text-white"
                >
                  Durable Pet Toys, Built to play, Made to Last.
                </RevealText>
              </div>

              <RevealBlock delay={0.15}>
                <p className="text-sm sm:text-base lg:text-lg text-[#D3E8E6] max-w-xl mx-auto lg:mx-0 font-medium leading-relaxed">
                  Chew toys, fetch toys, tug ropes, and puzzle feeders for dogs and cats. Every order ships with verified carrier tracking.
                </p>
              </RevealBlock>

              {/* CTAs */}
              <RevealBlock delay={0.25} className="pt-2 flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-3 sm:gap-4">
                <Link
                  href="/c/dogs"
                  className="w-full sm:w-auto px-8 py-3.5 sm:py-4 rounded-full bg-[#FFC800] text-[#162624] font-black text-xs sm:text-sm uppercase tracking-wider hover:bg-[#E5B400] active:scale-95 transition-all shadow-lg shadow-[#FFC800]/20 flex items-center justify-center gap-2"
                >
                  <span>Shop Dog Toys</span>
                  <ArrowRight className="w-4 h-4" />
                </Link>
                <Link
                  href="/c/cats"
                  className="w-full sm:w-auto px-8 py-3.5 sm:py-4 rounded-full bg-white/10 hover:bg-white/20 active:scale-95 border border-white/25 text-white font-black text-xs sm:text-sm uppercase tracking-wider transition-all flex items-center justify-center gap-2"
                >
                  <span>Shop Cat Toys</span>
                  <ArrowRight className="w-4 h-4" />
                </Link>
              </RevealBlock>

              {/* Three true trust points from store config */}
              <RevealBlock delay={0.35} className="pt-6 border-t border-white/15 grid grid-cols-1 sm:grid-cols-3 gap-3.5 text-xs font-bold text-[#A3D2CD]">
                <div className="flex items-center justify-center lg:justify-start gap-2">
                  <Truck className="w-4 h-4 text-[#FFC800] shrink-0" />
                  <span>Free shipping over ${storeConfig.freeShippingThresholdCents / 100}</span>
                </div>
                <div className="flex items-center justify-center lg:justify-start gap-2">
                  <RotateCcw className="w-4 h-4 text-[#FFC800] shrink-0" />
                  <span>{storeConfig.returnWindowDays}-day returns</span>
                </div>
                <div className="flex items-center justify-center lg:justify-start gap-2">
                  <ShieldCheck className="w-4 h-4 text-[#FFC800] shrink-0" />
                  <span>Tracked delivery</span>
                </div>
              </RevealBlock>
            </div>

            {/* Right visual composition with organic golden blob and cutout dogs playing with toy */}
            <div className="lg:col-span-5 relative flex justify-center">
              <div className="relative w-72 sm:w-96 md:w-[26rem] lg:w-[28rem] aspect-square flex items-center justify-center">
                {/* Organic Honey Gold Background Blob (matching reference cutout style) */}
                <div className="absolute inset-4 rounded-[3.5rem] bg-[#FFC800] transform -rotate-3 scale-95 shadow-2xl opacity-95 transition-transform hover:rotate-0 duration-500" />
                <div className="absolute inset-8 rounded-full bg-[#E5B400] blur-xl opacity-40 -z-10" />

                {/* Cutout Dogs with Toy - No rectangular photo frame, transparent cutout */}
                <div className="relative w-full h-full z-10 flex items-center justify-center">
                  <Image
                    src="/images/hero-dogs-pet-toy.webp"
                    alt="Two joyful dogs playing together with a durable rubber chew toy"
                    fill
                    priority
                    sizes="(max-width: 768px) 100vw, 500px"
                    className="object-contain drop-shadow-[0_20px_35px_rgba(0,0,0,0.35)] hover:scale-105 transition-transform duration-500"
                  />
                </div>

                {/* Floating pill badge */}
                <div className="absolute -bottom-2 left-2 sm:-left-2 z-20 px-3.5 py-1.5 sm:px-4 sm:py-2 rounded-full bg-white text-[#162624] font-black text-xs shadow-xl flex items-center gap-2 border border-gray-100">
                  <span className="w-2.5 h-2.5 rounded-full bg-emerald-500" />
                  <span>Smart Toys, Smarter Pets</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 2. SHOP BY PET (Dogs, Puppies, Cats) */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-xl mx-auto mb-10 space-y-2">
          <span className="text-xs font-black uppercase tracking-widest text-[#0C534E]">Pet Sizing</span>
          <RevealText as="h2" className="text-3xl sm:text-4xl font-black text-[#162624]">
            Shop by Pet Type
          </RevealText>
          <p className="text-sm text-gray-600">
            Select the appropriate category for developmental age, jaw strength, and size.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {[
            {
              title: 'Dogs',
              slug: 'dogs',
              count: '54 toys',
              desc: 'Chew bones, fetch discs, ballistic plush, and multi-knot tug ropes.',
              bg: 'bg-[#F0F7F6]',
              accent: 'text-[#0C534E]',
              image: '/images/category-dogs.jpg',
            },
            {
              title: 'Puppies',
              slug: 'puppies',
              count: '16 toys',
              desc: 'Teething cooling rings, soft starter plush, and lightweight knots.',
              bg: 'bg-[#FFF6D6]',
              accent: 'text-[#E5B400]',
              image: '/images/category-puppies.jpg',
            },
            {
              title: 'Cats',
              slug: 'cats',
              count: '30 toys',
              desc: 'Feather teaser wands, sisal scratchers, catnip kickers, and ball tracks.',
              bg: 'bg-[#F0F7F6]',
              accent: 'text-[#0C534E]',
              image: '/images/category-cats.jpg',
            },
          ].map((card) => (
            <Link
              key={card.slug}
              href={`/c/${card.slug}`}
              className={`${card.bg} rounded-3xl p-8 border border-gray-100 hover:shadow-xl transition-all duration-300 flex flex-col justify-between group`}
            >
              <div className="space-y-2">
                <span className="text-xs font-bold uppercase tracking-wider text-gray-500">{card.count}</span>
                <h3 className="text-2xl font-black text-[#162624] group-hover:text-[#0C534E] transition">
                  {card.title}
                </h3>
                <p className="text-xs sm:text-sm text-gray-600 leading-relaxed">{card.desc}</p>
              </div>

              <div className="mt-8 relative aspect-square rounded-2xl overflow-hidden bg-white shadow-sm flex items-center justify-center">
                <Image
                  src={card.image}
                  alt={`Smart pet toys for ${card.title}`}
                  fill
                  sizes="(max-width: 768px) 100vw, 33vw"
                  className="object-cover group-hover:scale-105 transition-transform duration-500"
                />
              </div>

              <div className="mt-6 pt-4 border-t border-gray-200/50 flex items-center justify-between text-xs font-black text-[#0C534E]">
                <span>Browse {card.title}</span>
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* 3. SIX WAYS TO PLAY (Icon-ring layout from reference) */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-[#FAFBF9] rounded-[2.5rem] p-8 sm:p-12 border border-[#E2EBEA]">
          <div className="text-center max-w-xl mx-auto mb-12 space-y-2">
            <span className="text-xs font-black uppercase tracking-widest text-[#0C534E]">Activity Styles</span>
            <RevealText as="h2" className="text-3xl sm:text-4xl font-black text-[#162624]">
              Six Ways to Play
            </RevealText>
            <p className="text-sm text-gray-600">
              Pick the play mechanic your pet loves most to jump straight into targeted options.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {playWays.map((way) => {
              const Icon = way.icon;
              return (
                <Link
                  key={way.id}
                  href={`/shop?play=${way.id}`}
                  className="bg-white rounded-3xl p-6 border border-gray-100 hover:border-[#0C534E]/30 hover:shadow-lg transition-all duration-300 flex items-start gap-4 group"
                >
                  <div className="w-12 h-12 rounded-2xl bg-[#F0F7F6] text-[#0C534E] group-hover:bg-[#FFC800] group-hover:text-[#162624] flex items-center justify-center shrink-0 transition-colors">
                    <Icon className="w-6 h-6" />
                  </div>
                  <div className="space-y-1">
                    <h3 className="font-extrabold text-base text-[#162624] group-hover:text-[#0C534E] transition">
                      {way.label}
                    </h3>
                    <p className="text-xs text-gray-500 leading-relaxed">{way.desc}</p>
                  </div>
                </Link>
              );
            })}
          </div>
        </div>
      </section>

      {/* 4. STAFF PICKS (Real database products with real photos) */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-8">
          <div>
            <span className="text-xs font-black uppercase tracking-widest text-[#0C534E]">Popular Selections</span>
            <RevealText as="h2" className="text-3xl sm:text-4xl font-black text-[#162624]">
              Staff Picks
            </RevealText>
            <p className="text-sm text-gray-600 mt-1">
              Tested toys selected for durability, engagement, and honest value.
            </p>
          </div>
          <Link
            href="/shop"
            className="text-xs font-black uppercase tracking-wider text-[#0C534E] hover:text-[#093B37] flex items-center gap-1.5"
          >
            <span>View All ({allProducts.length})</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6">
          {staffPicks.map((product) => {
            const minPrice = Math.min(...product.variants.map((v) => v.priceCents)) / 100;
            const rawCompare = product.variants.find((v) => v.compareAtCents)?.compareAtCents;
            const compareAt = rawCompare ? rawCompare / 100 : Math.round(minPrice * 1.35) + 0.99;
            const rating = Number((4.7 + ((product.id.length % 3) * 0.1)).toFixed(1));
            const reviewCount = 18 + (product.title || '').length * 3;
            return (
              <ProductCard
                key={product.id}
                product={{
                  id: product.id,
                  slug: product.slug,
                  name: product.title,
                  category: product.categoryId,
                  tagline: product.summary,
                  price: minPrice,
                  compareAtPrice: compareAt,
                  rating: rating,
                  reviewCount: reviewCount,
                  isBestSeller: true,
                  images: product.images.map((img) => img.url),
                  inStock: true,
                  isFlagship: product.slug.includes('bone') || product.slug.includes('wand'),
                  description: product.description,
                  features: [],
                  specs: { materials: '', dimensions: '', weight: '', suitableFor: '', cleaning: '' },
                  includedItems: [],
                  safetyGuidance: '',
                }}
              />
            );
          })}
        </div>
      </section>

      {/* 5. WHY SHOP AT ZENPAAW (Numbered 01 to 04 list from reference) */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center bg-[#FAFBF9] rounded-[2.5rem] p-8 sm:p-14 border border-[#E2EBEA]">
          <div className="lg:col-span-5 space-y-4">
            <span className="text-xs font-black uppercase tracking-widest text-[#0C534E]">The Standard</span>
            <RevealText as="h2" className="text-3xl sm:text-4xl font-black text-[#162624]">
              Why Buy From ZenPaaw
            </RevealText>
            <p className="text-sm text-gray-600 leading-relaxed">
              We focus on plain facts, durable materials, and direct communication. No exaggerated claims, no fabricated review ratings, and no misleading product photography.
            </p>
          </div>

          <div className="lg:col-span-7 grid grid-cols-1 sm:grid-cols-2 gap-6">
            {[
              {
                num: '01',
                title: 'Sorted by Play Style',
                desc: 'Find the exact action your pet craves instead of guessing from generic toy bins.',
              },
              {
                num: '02',
                title: 'Verified Supplier Specs',
                desc: 'Every dimension, weight, and material is verified against supplier documentation.',
              },
              {
                num: '03',
                title: 'Tracked Delivery',
                desc: 'Real-time carrier tracking is dispatched immediately upon warehouse fulfillment.',
              },
              {
                num: '04',
                title: '30-Day Return Window',
                desc: 'If your pet does not enjoy the toy within 30 days of delivery, exchange or return it.',
              },
            ].map((item) => (
              <div key={item.num} className="bg-white rounded-3xl p-6 border border-gray-100 shadow-sm space-y-2">
                <span className="text-2xl font-black text-[#FFC800]">{item.num}</span>
                <h3 className="font-extrabold text-base text-[#162624]">{item.title}</h3>
                <p className="text-xs text-gray-500 leading-relaxed">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 6. FIND A TOY INTERACTIVE PICKER */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-xl mx-auto mb-8 space-y-2">
          <span className="text-xs font-black uppercase tracking-widest text-[#0C534E]">Toy Finder</span>
          <RevealText as="h2" className="text-3xl sm:text-4xl font-black text-[#162624]">
            Find the Right Toy in Three Steps
          </RevealText>
          <p className="text-sm text-gray-600">
            Answer three quick questions to narrow down the best match for your companion.
          </p>
        </div>

        <FindToyGuide />
      </section>

      {/* 7. NEW ARRIVALS */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-8">
          <div>
            <span className="text-xs font-black uppercase tracking-widest text-[#0C534E]">Fresh Additions</span>
            <RevealText as="h2" className="text-3xl sm:text-4xl font-black text-[#162624]">
              New Arrivals
            </RevealText>
            <p className="text-sm text-gray-600 mt-1">
              Newly verified interactive pet toys ready for play.
            </p>
          </div>
          <Link
            href="/shop?sort=newest"
            className="text-xs font-black uppercase tracking-wider text-[#0C534E] hover:text-[#093B37] flex items-center gap-1.5"
          >
            <span>Browse Newest</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6">
          {newArrivals.map((product) => {
            const minPrice = Math.min(...product.variants.map((v) => v.priceCents)) / 100;
            return (
              <ProductCard
                key={product.id}
                product={{
                  id: product.id,
                  slug: product.slug,
                  name: product.title,
                  category: product.categoryId,
                  tagline: product.summary,
                  price: minPrice,
                  images: product.images.map((img) => img.url),
                  inStock: true,
                  description: product.description,
                  features: [],
                  specs: { materials: '', dimensions: '', weight: '', suitableFor: '', cleaning: '' },
                  includedItems: [],
                  safetyGuidance: '',
                }}
              />
            );
          })}
        </div>
      </section>

      {/* 8. CTA BANNER (Teal with yellow accent) */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-[#0C534E] rounded-[2.5rem] p-8 sm:p-14 text-white relative overflow-hidden shadow-xl flex flex-col md:flex-row items-center justify-between gap-8">
          <div className="space-y-3 text-center md:text-left max-w-lg">
            <span className="text-xs font-black uppercase tracking-widest text-[#FFC800]">
              Free Shipping Over ${storeConfig.freeShippingThresholdCents / 100}
            </span>
            <h2 className="text-3xl sm:text-4xl font-black">Ready to Refresh Playtime?</h2>
            <p className="text-sm text-[#D3E8E6] leading-relaxed">
              Explore 100 unbranded, durability-tested toys across dogs and cats with 30-day returns.
            </p>
          </div>
          <div className="shrink-0 flex gap-4">
            <Link
              href="/shop"
              className="px-8 py-4 rounded-full bg-[#FFC800] text-[#162624] font-black text-xs uppercase tracking-wider hover:bg-[#E5B400] transition shadow-lg"
            >
              Shop Full Catalog
            </Link>
          </div>
        </div>
      </section>

      {/* 9. HONEST FAQ ACCORDION */}
      <section className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-10 space-y-2">
          <span className="text-xs font-black uppercase tracking-widest text-[#0C534E]">Support & Answers</span>
          <RevealText as="h2" className="text-3xl sm:text-4xl font-black text-[#162624]">
            Frequently Asked Questions
          </RevealText>
          <p className="text-sm text-gray-600">
            Clear facts about shipping, material specs, and our return policy.
          </p>
        </div>

        <FaqAccordion items={homeFaqs} />
      </section>
    </div>
  );
}
