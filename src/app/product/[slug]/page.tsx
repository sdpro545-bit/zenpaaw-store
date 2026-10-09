import React from 'react';
import { notFound } from 'next/navigation';
import Link from 'next/link';
import { ChevronRight, ShieldCheck, AlertCircle } from 'lucide-react';
import { db } from '@/lib/db';
import { ProductGallery } from '@/components/ProductGallery';
import { ProductBuyBox } from '@/components/ProductBuyBox';
import { ProductCard } from '@/components/ProductCard';
import { RevealText } from '@/components/RevealText';
import type { Metadata } from 'next';
export const instant = false;

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const product = db.getProductBySlug(slug);
  if (!product) return { title: 'Product Not Found | ZenPaaw' };

  return {
    title: `${product.title} | ZenPaaw Pet Toys`,
    description: product.summary || product.description.slice(0, 160),
    openGraph: {
      title: product.title,
      description: product.summary,
      images: product.images[0]?.url ? [{ url: product.images[0].url }] : [],
    },
  };
}

export default async function ProductDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const product = db.getProductBySlug(slug);

  if (!product) {
    notFound();
  }

  // Related products from same category or pet type
  const related = db
    .getProducts({ categoryId: product.categoryId, status: 'active' })
    .filter((p) => p.id !== product.id)
    .slice(0, 4);

  const minPrice = Math.min(...product.variants.map((v) => v.priceCents)) / 100;
  const verifiedClaims = product.claims.filter((c) => c.verified);

  // Structured Data (JSON-LD)
  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'Product',
    name: product.title,
    description: product.summary,
    image: product.images.map((img) => img.url),
    offers: {
      '@type': 'Offer',
      price: minPrice.toFixed(2),
      priceCurrency: 'USD',
      availability: product.variants.some((v) => v.available)
        ? 'https://schema.org/InStock'
        : 'https://schema.org/OutOfStock',
    },
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12 space-y-16">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      {/* Breadcrumbs */}
      <nav aria-label="Breadcrumb" className="flex items-center gap-2 text-xs text-gray-500 font-medium">
        <Link href="/" className="hover:text-[#0C534E]">
          Home
        </Link>
        <ChevronRight className="w-3.5 h-3.5" />
        <Link href="/shop" className="hover:text-[#0C534E]">
          Shop
        </Link>
        <ChevronRight className="w-3.5 h-3.5" />
        <span className="text-gray-400 capitalize">{product.categoryId.replace('-', ' ')}</span>
        <ChevronRight className="w-3.5 h-3.5" />
        <span className="text-[#162624] font-bold truncate max-w-[200px]">{product.title}</span>
      </nav>

      {/* Main Product Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-14 items-start">
        {/* Left: Gallery (Sticky on desktop) */}
        <div className="lg:col-span-7">
          <ProductGallery
            images={product.images.map((img) => ({ url: img.url, alt: img.alt }))}
            title={product.title}
          />
        </div>

        {/* Right: Buy Box */}
        <div className="lg:col-span-5 space-y-6">
          <div className="space-y-2">
            <span className="text-xs font-black uppercase tracking-widest text-[#0C534E]">
              {product.petTypes.join(' & ')} • {product.playStyles.join(', ')}
            </span>
            <RevealText as="h1" className="text-2xl sm:text-3xl font-black text-[#162624] leading-tight">
              {product.title}
            </RevealText>
            <p className="text-sm text-gray-600 leading-relaxed">{product.summary}</p>
          </div>

          <ProductBuyBox
            product={{
              id: product.id,
              slug: product.slug,
              title: product.title,
              summary: product.summary,
              category: product.categoryId,
              images: product.images.map((img) => img.url),
            }}
            variants={product.variants.map((v) => ({
              id: v.id,
              sku: v.sku,
              option1Name: v.option1Name,
              option1Value: v.option1Value,
              option2Name: v.option2Name,
              option2Value: v.option2Value,
              priceCents: v.priceCents,
              compareAtCents: v.compareAtCents,
              available: v.available,
              leadTimeDaysMin: v.leadTimeDaysMin,
              leadTimeDaysMax: v.leadTimeDaysMax,
            }))}
          />

          {/* Description & Overview */}
          <div className="pt-6 border-t border-gray-100 space-y-3">
            <h2 className="text-sm font-black uppercase tracking-wider text-[#162624]">Product Overview</h2>
            <p className="text-xs sm:text-sm text-gray-600 leading-relaxed">{product.description}</p>
          </div>
        </div>
      </div>

      {/* Verified Specifications Table (Section 5.4 Claims Policy) */}
      <section className="bg-[#FAFBF9] rounded-3xl p-6 sm:p-10 border border-[#E2EBEA] space-y-6">
        <div>
          <span className="text-xs font-black uppercase tracking-widest text-[#0C534E]">Supplier Verified</span>
          <h2 className="text-xl sm:text-2xl font-black text-[#162624] mt-1">Verified Specifications</h2>
          <p className="text-xs sm:text-sm text-gray-500 mt-1">
            All material and dimension claims are verified directly from manufacturer lab specifications.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {verifiedClaims.map((claim) => (
            <div
              key={claim.id}
              className="p-4 rounded-2xl bg-white border border-gray-100 flex items-start justify-between gap-4"
            >
              <div>
                <span className="text-xs font-bold text-gray-400 uppercase tracking-wider block">
                  {claim.key}
                </span>
                <span className="text-sm font-black text-[#162624] mt-0.5 block">{claim.value}</span>
              </div>
              <span className="px-2 py-1 rounded-full bg-[#F0F7F6] text-[#0C534E] text-[0.65rem] font-bold">
                Verified Spec
              </span>
            </div>
          ))}

          <div className="p-4 rounded-2xl bg-white border border-gray-100 flex items-start justify-between gap-4">
            <div>
              <span className="text-xs font-bold text-gray-400 uppercase tracking-wider block">
                Chew Strength Rating
              </span>
              <span className="text-sm font-black text-[#162624] mt-0.5 block capitalize">
                {product.chewStrength}
              </span>
            </div>
            <span className="px-2 py-1 rounded-full bg-[#FFF6D6] text-[#E5B400] text-[0.65rem] font-bold">
              Rating
            </span>
          </div>
        </div>

        {/* Safety and Supervision Guidance */}
        <div className="p-4 rounded-2xl bg-amber-50/70 border border-amber-200/60 flex items-start gap-3 text-xs text-amber-900 leading-relaxed">
          <AlertCircle className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
          <div>
            <strong>Safety and Supervision Notice:</strong> No pet toy is completely indestructible. Supervise your pet during play and inspect the toy regularly. Remove and replace the toy if parts become loose, worn, or separated to prevent accidental ingestion.
          </div>
        </div>
      </section>

      {/* Related Products */}
      {related.length > 0 && (
        <section className="space-y-6">
          <div className="flex items-center justify-between">
            <div>
              <span className="text-xs font-black uppercase tracking-widest text-[#0C534E]">More to Explore</span>
              <h2 className="text-2xl font-black text-[#162624]">You May Also Like</h2>
            </div>
            <Link
              href="/shop"
              className="text-xs font-black uppercase tracking-wider text-[#0C534E] hover:underline"
            >
              View All Toys
            </Link>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 sm:gap-6">
            {related.map((rel) => {
              const relMinPrice = Math.min(...rel.variants.map((v) => v.priceCents)) / 100;
              return (
                <ProductCard
                  key={rel.id}
                  product={{
                    id: rel.id,
                    slug: rel.slug,
                    name: rel.title,
                    category: rel.categoryId,
                    tagline: rel.summary,
                    price: relMinPrice,
                    images: rel.images.map((img) => img.url),
                    inStock: true,
                    description: rel.description,
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
      )}
    </div>
  );
}
