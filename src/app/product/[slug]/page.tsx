'use client';

import React, { useState, useEffect, Suspense } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Image from 'next/image';
import Link from 'next/link';
import { initialProducts } from '@/data/products';
import { useCart } from '@/context/CartContext';
import { Product, Review } from '@/types';
import {
  Star,
  Plus,
  Minus,
  ShoppingBag,
  Zap,
  Truck,
  RotateCcw,
  ShieldCheck,
  ChevronDown,
  ChevronUp,
  Check,
  Share2,
  Sparkles
} from 'lucide-react';
import { trackEvent } from '@/lib/analytics';

function ProductDetailContent() {
  const params = useParams();
  const router = useRouter();
  const slug = params?.slug as string;
  const { addToCart } = useCart();

  const [product, setProduct] = useState<Product | null>(null);
  const [selectedImageIndex, setSelectedImageIndex] = useState(0);
  const [quantity, setQuantity] = useState(1);
  const [openAccordion, setOpenAccordion] = useState<string>('how-it-works');
  const [showReviewForm, setShowReviewForm] = useState(false);
  const [reviews, setReviews] = useState<Review[]>([]);
  const [newReview, setNewReview] = useState({
    author: '',
    petName: '',
    petBreed: '',
    rating: 5,
    title: '',
    comment: ''
  });
  const [reviewSubmitted, setReviewSubmitted] = useState(false);

  useEffect(() => {
    const found = initialProducts.find((p) => p.slug === slug) || initialProducts[0];
    setProduct(found);

    // Track view_item event
    trackEvent('view_item', {
      item_id: found.id,
      item_name: found.name,
      price: found.price,
      category: found.category
    });

    // Fetch reviews
    fetch(`/api/reviews?productId=${found.id}`)
      .then((res) => res.json())
      .then((data) => {
        if (data.reviews) setReviews(data.reviews);
      })
      .catch(() => {});
  }, [slug]);

  if (!product) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center">
        <div className="w-8 h-8 border-4 border-[#0C534E] border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  const handleBuyNow = () => {
    addToCart(product, quantity);
    router.push('/checkout');
  };

  const handleAddReview = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newReview.author || !newReview.comment) return;

    try {
      const res = await fetch('/api/reviews', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          productId: product.id,
          ...newReview
        })
      });
      const data = await res.json();
      if (res.ok && data.review) {
        setReviews([data.review, ...reviews]);
        setReviewSubmitted(true);
        setShowReviewForm(false);
      }
    } catch (err) {
      console.error(err);
    }
  };

  const toggleAccordion = (id: string) => {
    setOpenAccordion(openAccordion === id ? '' : id);
  };

  const discountPercent = product.compareAtPrice
    ? Math.round(((product.compareAtPrice - product.price) / product.compareAtPrice) * 100)
    : 0;

  return (
    <div className="bg-[#FAFBF9] min-h-screen pb-20">
      {/* Breadcrumb Bar */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
        <nav className="flex items-center text-xs text-gray-500 font-medium gap-2">
          <Link href="/" className="hover:text-[#0C534E]">Home</Link>
          <span>/</span>
          <Link href="/shop" className="hover:text-[#0C534E]">Shop</Link>
          <span>/</span>
          <span className="text-[#162624] font-bold truncate">{product.name}</span>
        </nav>
      </div>

      {/* Product Main Section */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-2 pb-16">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-14">
          {/* Left: Product Image Gallery */}
          <div className="lg:col-span-7 space-y-4">
            {/* Main Stage Image */}
            <div className="relative aspect-square w-full rounded-3xl overflow-hidden bg-white border border-gray-200/80 shadow-md">
              <Image
                src={product.images[selectedImageIndex] || product.images[0]}
                alt={`${product.name} large view`}
                fill
                priority
                className="object-contain p-6 transition-all duration-300"
              />

              {product.isFlagship && (
                <div className="absolute top-4 left-4 px-3.5 py-1.5 rounded-full bg-[#0C534E] text-[#FFC800] text-xs font-black uppercase tracking-wider shadow-md">
                  ★ Flagship 3-in-1 Concept
                </div>
              )}

              {discountPercent > 0 && (
                <div className="absolute top-4 right-4 px-3 py-1 rounded-full bg-emerald-600 text-white text-xs font-black shadow-md">
                  Save {discountPercent}%
                </div>
              )}
            </div>

            {/* Thumbnail Strip */}
            <div className="grid grid-cols-4 gap-3">
              {product.images.map((img, idx) => (
                <button
                  key={img}
                  onClick={() => setSelectedImageIndex(idx)}
                  className={`relative aspect-square rounded-2xl overflow-hidden bg-white border-2 transition-all duration-200 ${
                    selectedImageIndex === idx
                      ? 'border-[#0C534E] shadow-md ring-2 ring-[#0C534E]/20'
                      : 'border-gray-200 hover:border-gray-300 opacity-70 hover:opacity-100'
                  }`}
                >
                  <Image src={img} alt={`Thumbnail ${idx + 1}`} fill className="object-cover" />
                </button>
              ))}
            </div>

            {/* Packaging Visual Guarantee Note */}
            <div className="p-4 rounded-2xl bg-[#F0F7F6] border border-[#E2EBEA] flex items-center gap-3 text-xs text-[#0C534E]">
              <Sparkles className="w-5 h-5 text-[#FFC800] shrink-0" />
              <span>
                Ships in our signature unbleached kraft packaging box. Clean, eco-conscious, and gift-ready.
              </span>
            </div>
          </div>

          {/* Right: Product Purchase Details & Accordions */}
          <div className="lg:col-span-5 space-y-6">
            <div>
              <div className="flex items-center justify-between gap-2 mb-2">
                <span className="px-3 py-1 rounded-full bg-[#F0F7F6] text-[#0C534E] text-xs font-extrabold uppercase tracking-wider">
                  {product.category}
                </span>
                <span className="text-xs text-emerald-600 font-bold flex items-center gap-1.5">
                  <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                  In Stock & Ready to Ship
                </span>
              </div>

              <h1 className="text-3xl sm:text-4xl font-black text-[#162624] tracking-tight">
                {product.name}
              </h1>

              {/* Rating & Reviews */}
              <div className="flex items-center gap-2 mt-2">
                <div className="flex items-center text-[#FFC800]">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="w-4 h-4 fill-[#FFC800]" />
                  ))}
                </div>
                <span className="text-sm font-extrabold text-[#162624]">{product.rating.toFixed(1)}</span>
                <span className="text-xs text-gray-400">({product.reviewCount} verified reviews)</span>
              </div>
            </div>

            {/* Price Block */}
            <div className="p-4 rounded-2xl bg-white border border-gray-100 shadow-sm flex items-baseline justify-between">
              <div>
                <div className="flex items-baseline gap-2.5">
                  <span className="text-3xl sm:text-4xl font-black text-[#0C534E] tabular-nums">
                    ${product.price.toFixed(2)}
                  </span>
                  {product.compareAtPrice && (
                    <span className="text-base sm:text-lg text-gray-400 line-through tabular-nums">
                      ${product.compareAtPrice.toFixed(2)}
                    </span>
                  )}
                </div>
                <span className="text-[0.68rem] text-gray-400">Taxes calculated at checkout</span>
              </div>

              {discountPercent > 0 && (
                <span className="px-3 py-1 rounded-full bg-emerald-50 text-emerald-700 text-xs font-bold border border-emerald-200">
                  You Save ${(product.compareAtPrice! - product.price).toFixed(2)}
                </span>
              )}
            </div>

            {/* Short Tagline / Value Summary */}
            <p className="text-sm text-gray-600 leading-relaxed font-medium">
              {product.description}
            </p>

            {/* Quantity Selector & Action Buttons */}
            <div className="space-y-3 pt-2">
              <div className="flex items-center gap-4">
                <span className="text-xs font-bold uppercase tracking-wider text-gray-500">Quantity</span>
                <div className="flex items-center border border-gray-200 rounded-full bg-white px-3 py-1">
                  <button
                    onClick={() => setQuantity(Math.max(1, quantity - 1))}
                    className="p-1 hover:text-[#0C534E] text-gray-500 transition"
                  >
                    <Minus className="w-4 h-4" />
                  </button>
                  <span className="w-10 text-center font-bold text-sm text-[#162624] tabular-nums">
                    {quantity}
                  </span>
                  <button
                    onClick={() => setQuantity(quantity + 1)}
                    className="p-1 hover:text-[#0C534E] text-gray-500 transition"
                  >
                    <Plus className="w-4 h-4" />
                  </button>
                </div>
              </div>

              <div className="flex flex-col sm:flex-row gap-3 pt-2">
                <button
                  onClick={() => addToCart(product, quantity)}
                  className="flex-1 py-4 px-6 rounded-full bg-[#FFC800] text-[#162624] font-black text-base hover:bg-[#E5B400] shadow-xl shadow-[#FFC800]/25 transition active:scale-95 flex items-center justify-center gap-2"
                >
                  <ShoppingBag className="w-5 h-5" />
                  <span>Add to Cart • ${(product.price * quantity).toFixed(2)}</span>
                </button>

                <button
                  onClick={handleBuyNow}
                  className="flex-1 py-4 px-6 rounded-full bg-[#0C534E] text-white font-black text-base hover:bg-[#093B37] shadow-xl shadow-[#0C534E]/20 transition active:scale-95 flex items-center justify-center gap-2"
                >
                  <Zap className="w-5 h-5 fill-current text-[#FFC800]" />
                  <span>Buy It Now</span>
                </button>
              </div>
            </div>

            {/* Trust Pillars */}
            <div className="grid grid-cols-2 gap-3 pt-3 text-xs text-gray-600">
              <div className="flex items-center gap-2 p-2.5 rounded-xl bg-white border border-gray-100">
                <Truck className="w-4 h-4 text-[#0C534E]" />
                <span>Free U.S. Shipping over $35</span>
              </div>
              <div className="flex items-center gap-2 p-2.5 rounded-xl bg-white border border-gray-100">
                <RotateCcw className="w-4 h-4 text-[#0C534E]" />
                <span>30-Day Play Guarantee</span>
              </div>
            </div>

            {/* Accordion Specification Panels */}
            <div className="space-y-2 pt-4 border-t border-gray-200">
              {/* Accordion 1: How It Works */}
              <div className="bg-white rounded-2xl border border-gray-200 overflow-hidden">
                <button
                  onClick={() => toggleAccordion('how-it-works')}
                  className="w-full px-5 py-3.5 flex items-center justify-between text-left font-extrabold text-sm text-[#162624]"
                >
                  <span>How It Works (Play • Chew • Fetch)</span>
                  {openAccordion === 'how-it-works' ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                </button>
                {openAccordion === 'how-it-works' && product.playModes && (
                  <div className="px-5 pb-4 text-xs text-gray-600 space-y-2 border-t border-gray-100 pt-3">
                    <p><strong>1. Play:</strong> {product.playModes.play}</p>
                    <p><strong>2. Chew:</strong> {product.playModes.chew}</p>
                    <p><strong>3. Fetch:</strong> {product.playModes.fetch}</p>
                  </div>
                )}
              </div>

              {/* Accordion 2: Materials & Specs */}
              <div className="bg-white rounded-2xl border border-gray-200 overflow-hidden">
                <button
                  onClick={() => toggleAccordion('specs')}
                  className="w-full px-5 py-3.5 flex items-center justify-between text-left font-extrabold text-sm text-[#162624]"
                >
                  <span>Materials & Specifications</span>
                  {openAccordion === 'specs' ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                </button>
                {openAccordion === 'specs' && (
                  <div className="px-5 pb-4 text-xs text-gray-600 space-y-1.5 border-t border-gray-100 pt-3">
                    <p><strong>Materials:</strong> {product.specs.materials}</p>
                    <p><strong>Dimensions:</strong> {product.specs.dimensions}</p>
                    <p><strong>Weight:</strong> {product.specs.weight}</p>
                    <p><strong>Suitable For:</strong> {product.specs.suitableFor}</p>
                    <p><strong>Cleaning:</strong> {product.specs.cleaning}</p>
                  </div>
                )}
              </div>

              {/* Accordion 3: What's Included */}
              <div className="bg-white rounded-2xl border border-gray-200 overflow-hidden">
                <button
                  onClick={() => toggleAccordion('included')}
                  className="w-full px-5 py-3.5 flex items-center justify-between text-left font-extrabold text-sm text-[#162624]"
                >
                  <span>What&apos;s Included</span>
                  {openAccordion === 'included' ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                </button>
                {openAccordion === 'included' && (
                  <ul className="px-5 pb-4 text-xs text-gray-600 space-y-1 border-t border-gray-100 pt-3 list-disc pl-8">
                    {product.includedItems.map((item, idx) => (
                      <li key={idx}>{item}</li>
                    ))}
                  </ul>
                )}
              </div>

              {/* Accordion 4: Safety & Care */}
              <div className="bg-white rounded-2xl border border-gray-200 overflow-hidden">
                <button
                  onClick={() => toggleAccordion('safety')}
                  className="w-full px-5 py-3.5 flex items-center justify-between text-left font-extrabold text-sm text-[#162624]"
                >
                  <span>Pet Safety & Supervised Play Guidance</span>
                  {openAccordion === 'safety' ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                </button>
                {openAccordion === 'safety' && (
                  <div className="px-5 pb-4 text-xs text-gray-600 border-t border-gray-100 pt-3 leading-relaxed">
                    {product.safetyGuidance}
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Customer Reviews Section */}
        <div className="mt-20 pt-12 border-t border-gray-200">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
            <div>
              <h3 className="text-2xl font-black text-[#162624]">Customer Feedback</h3>
              <p className="text-xs text-gray-500 mt-0.5">Real verified pet parent experiences with {product.name}</p>
            </div>

            <button
              onClick={() => setShowReviewForm(!showReviewForm)}
              className="px-5 py-2.5 rounded-full bg-[#0C534E] text-[#FFC800] text-xs font-black hover:bg-[#093B37] transition w-fit"
            >
              {showReviewForm ? 'Cancel' : 'Write a Review'}
            </button>
          </div>

          {/* Interactive Review Form */}
          {showReviewForm && (
            <form onSubmit={handleAddReview} className="mb-10 p-6 rounded-3xl bg-white border border-gray-200 shadow-sm space-y-4">
              <h4 className="font-extrabold text-base text-[#162624]">Share Your Pet&apos;s Experience</h4>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <input
                  type="text"
                  placeholder="Your Name *"
                  value={newReview.author}
                  onChange={(e) => setNewReview({ ...newReview, author: e.target.value })}
                  required
                  className="px-4 py-2.5 rounded-xl border border-gray-200 text-xs outline-none focus:border-[#0C534E]"
                />
                <input
                  type="text"
                  placeholder="Pet's Name"
                  value={newReview.petName}
                  onChange={(e) => setNewReview({ ...newReview, petName: e.target.value })}
                  className="px-4 py-2.5 rounded-xl border border-gray-200 text-xs outline-none focus:border-[#0C534E]"
                />
                <input
                  type="text"
                  placeholder="Pet Breed (e.g. Golden Retriever)"
                  value={newReview.petBreed}
                  onChange={(e) => setNewReview({ ...newReview, petBreed: e.target.value })}
                  className="px-4 py-2.5 rounded-xl border border-gray-200 text-xs outline-none focus:border-[#0C534E]"
                />
              </div>

              <div className="flex items-center gap-2">
                <span className="text-xs font-bold text-gray-500">Rating:</span>
                <select
                  value={newReview.rating}
                  onChange={(e) => setNewReview({ ...newReview, rating: Number(e.target.value) })}
                  className="px-3 py-1.5 rounded-lg border border-gray-200 text-xs font-bold"
                >
                  <option value={5}>⭐⭐⭐⭐⭐ (5 Stars)</option>
                  <option value={4}>⭐⭐⭐⭐ (4 Stars)</option>
                  <option value={3}>⭐⭐⭐ (3 Stars)</option>
                </select>
              </div>

              <input
                type="text"
                placeholder="Review Headline (e.g. Barnaby loves it!)"
                value={newReview.title}
                onChange={(e) => setNewReview({ ...newReview, title: e.target.value })}
                className="w-full px-4 py-2.5 rounded-xl border border-gray-200 text-xs outline-none focus:border-[#0C534E]"
              />

              <textarea
                placeholder="Write your review..."
                rows={3}
                value={newReview.comment}
                onChange={(e) => setNewReview({ ...newReview, comment: e.target.value })}
                required
                className="w-full px-4 py-2.5 rounded-xl border border-gray-200 text-xs outline-none focus:border-[#0C534E]"
              />

              <button
                type="submit"
                className="px-6 py-2.5 rounded-full bg-[#FFC800] text-[#162624] text-xs font-black hover:bg-[#E5B400] transition"
              >
                Submit Review
              </button>
            </form>
          )}

          {reviewSubmitted && (
            <div className="mb-6 p-4 rounded-2xl bg-emerald-50 text-emerald-800 text-xs font-bold flex items-center gap-2">
              <Check className="w-4 h-4" />
              <span>Thank you! Your verified pet review has been added.</span>
            </div>
          )}

          {/* Reviews List */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {reviews.map((rev) => (
              <div key={rev.id} className="bg-white rounded-3xl p-6 border border-gray-100 shadow-sm flex flex-col justify-between">
                <div>
                  <div className="flex items-center gap-1 text-[#FFC800] mb-2">
                    {[...Array(rev.rating)].map((_, i) => (
                      <Star key={i} className="w-3.5 h-3.5 fill-[#FFC800]" />
                    ))}
                  </div>
                  <h4 className="font-extrabold text-sm text-[#162624] mb-1">{rev.title}</h4>
                  <p className="text-xs text-gray-600 leading-relaxed">&ldquo;{rev.comment}&rdquo;</p>
                </div>
                <div className="mt-4 pt-3 border-t border-gray-100 flex items-center justify-between text-[0.7rem] text-gray-400">
                  <span className="font-bold text-[#162624]">{rev.author} {rev.petName && `& ${rev.petName}`}</span>
                  <span className="text-emerald-600 font-bold">✓ Verified</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Sticky Mobile Add-to-Cart Bar */}
      <div className="lg:hidden fixed bottom-0 left-0 right-0 z-30 bg-white/95 backdrop-blur-md border-t border-gray-200 px-4 py-3 flex items-center justify-between gap-3 shadow-2xl">
        <div>
          <span className="text-xs text-gray-500 font-medium block truncate max-w-[120px]">{product.name}</span>
          <span className="text-base font-black text-[#0C534E]">${product.price.toFixed(2)}</span>
        </div>
        <button
          onClick={() => addToCart(product, quantity)}
          className="flex-1 max-w-[220px] py-3 px-5 rounded-full bg-[#FFC800] text-[#162624] font-black text-sm hover:bg-[#E5B400] transition flex items-center justify-center gap-2"
        >
          <ShoppingBag className="w-4 h-4" />
          <span>Add to Cart</span>
        </button>
      </div>
    </div>
  );
}

export default function ProductDetailPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-[70vh] flex items-center justify-center">
          <div className="w-10 h-10 border-4 border-[#0C534E] border-t-transparent rounded-full animate-spin" />
        </div>
      }
    >
      <ProductDetailContent />
    </Suspense>
  );
}
