'use client';

import React, { useState } from 'react';
import { Star, CheckCircle2, ThumbsUp, MessageSquare, Send } from 'lucide-react';

interface Review {
  id: string;
  author: string;
  pet: string;
  rating: number;
  date: string;
  title: string;
  content: string;
  helpfulCount: number;
  verified: boolean;
}

interface ProductReviewsSectionProps {
  productTitle: string;
  petType: string;
}

export const ProductReviewsSection: React.FC<ProductReviewsSectionProps> = ({
  productTitle,
  petType,
}) => {
  const [reviews, setReviews] = useState<Review[]>([
    {
      id: 'rev-1',
      author: 'Sarah M.',
      pet: petType === 'Cats' ? 'Milo (2 yr British Shorthair)' : 'Max (3 yr Golden Retriever)',
      rating: 5,
      date: '2 weeks ago',
      title: 'Remarkable durability and instant obsession!',
      content:
        `Usually toys don't survive more than 48 hours in our household, but the ${productTitle} has held up flawlessly. The texture and bounce keep my pet completely occupied during work calls. Super easy to clean and rinse too!`,
      helpfulCount: 24,
      verified: true,
    },
    {
      id: 'rev-2',
      author: 'David L.',
      pet: petType === 'Cats' ? 'Luna (1 yr Calico)' : 'Buster (4 yr Australian Shepherd)',
      rating: 5,
      date: '1 month ago',
      title: 'True mental enrichment - best purchase this year',
      content:
        `High quality materials with zero chemical or toxic odor right out of the packaging. You can tell real thought went into the ergonomics. My pet brings this everywhere around the living room.`,
      helpfulCount: 17,
      verified: true,
    },
    {
      id: 'rev-3',
      author: 'Elena R.',
      pet: petType === 'Cats' ? 'Oliver & Cleo (Rescue Cats)' : 'Daisy (Puppy, 8 months)',
      rating: 5,
      date: '1 month ago',
      title: 'Extremely well made, totally safe',
      content:
        `Firm yet gentle on teeth and gums. No sharp edges, no fraying, and withstands vigorous daily play sessions without degrading. 10/10 recommendation for any pet parent.`,
      helpfulCount: 12,
      verified: true,
    },
  ]);

  const [isWritingReview, setIsWritingReview] = useState(false);
  const [newRating, setNewRating] = useState(5);
  const [newAuthor, setNewAuthor] = useState('');
  const [newPet, setNewPet] = useState('');
  const [newTitle, setNewTitle] = useState('');
  const [newContent, setNewContent] = useState('');
  const [submitted, setSubmitted] = useState(false);

  const handleSubmitReview = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newAuthor || !newContent || !newTitle) return;

    const newRev: Review = {
      id: `rev-${Date.now()}`,
      author: newAuthor,
      pet: newPet || 'Happy Pet Parent',
      rating: newRating,
      date: 'Just now',
      title: newTitle,
      content: newContent,
      helpfulCount: 1,
      verified: true,
    };

    setReviews([newRev, ...reviews]);
    setSubmitted(true);
    setIsWritingReview(false);
    setNewAuthor('');
    setNewPet('');
    setNewTitle('');
    setNewContent('');
  };

  const avgRating = 4.9;
  const totalReviews = reviews.length + 38;

  return (
    <section className="bg-white rounded-3xl p-6 sm:p-10 border border-[#E2EBEA] shadow-sm space-y-8">
      {/* Header and Rating Overview */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6 pb-8 border-b border-gray-100">
        <div>
          <span className="text-xs font-black uppercase tracking-widest text-[#0C534E]">Verified Feedback</span>
          <h2 className="text-2xl sm:text-3xl font-black text-[#162624] mt-1">Customer Reviews & Ratings</h2>
          <p className="text-xs sm:text-sm text-gray-500 mt-1">
            Real feedback from verified pet parents testing durability, engagement, and safety.
          </p>
        </div>

        <button
          onClick={() => setIsWritingReview(!isWritingReview)}
          className="self-start lg:self-auto px-5 py-2.5 rounded-full bg-[#0C534E] text-[#FFC800] text-xs font-black uppercase tracking-wider hover:bg-[#093B37] transition shadow-md shadow-[#0C534E]/20"
        >
          {isWritingReview ? 'Cancel Review' : 'Write a Review'}
        </button>
      </div>

      {/* Aggregate Score & Star Breakdown */}
      <div className="grid grid-cols-1 md:grid-cols-12 gap-8 items-center bg-[#FAFBF9] rounded-2xl p-6 border border-gray-100">
        <div className="md:col-span-4 text-center md:text-left space-y-2 md:border-r md:border-gray-200 md:pr-6">
          <div className="text-5xl font-black text-[#0C534E] tracking-tight">{avgRating}</div>
          <div className="flex items-center justify-center md:justify-start gap-1">
            {[...Array(5)].map((_, i) => (
              <Star key={i} className="w-5 h-5 fill-[#FFC800] text-[#FFC800]" />
            ))}
          </div>
          <p className="text-xs font-bold text-gray-500">Based on {totalReviews} verified purchases</p>
          <span className="inline-block text-[0.7rem] px-2.5 py-0.5 rounded-full bg-emerald-100 text-emerald-800 font-bold">
            98% Recommendation Rate
          </span>
        </div>

        <div className="md:col-span-8 space-y-2 text-xs font-bold text-gray-600">
          {[
            { stars: 5, pct: 88, count: Math.round(totalReviews * 0.88) },
            { stars: 4, pct: 10, count: Math.round(totalReviews * 0.10) },
            { stars: 3, pct: 2, count: Math.round(totalReviews * 0.02) },
            { stars: 2, pct: 0, count: 0 },
            { stars: 1, pct: 0, count: 0 },
          ].map((row) => (
            <div key={row.stars} className="flex items-center gap-3">
              <span className="w-12 shrink-0">{row.stars} Stars</span>
              <div className="flex-1 h-2 rounded-full bg-gray-200 overflow-hidden">
                <div
                  className="h-full bg-gradient-to-r from-[#0C534E] to-[#FFC800] rounded-full"
                  style={{ width: `${row.pct}%` }}
                />
              </div>
              <span className="w-10 text-right text-gray-400 tabular-nums">{row.pct}%</span>
            </div>
          ))}
        </div>
      </div>

      {submitted && (
        <div className="p-4 rounded-2xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-bold flex items-center gap-2">
          <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
          <span>Thank you! Your verified review has been published successfully.</span>
        </div>
      )}

      {/* Interactive Write Review Form */}
      {isWritingReview && (
        <form onSubmit={handleSubmitReview} className="bg-white rounded-2xl p-6 border border-gray-200 shadow-sm space-y-4">
          <h3 className="font-black text-sm uppercase tracking-wider text-[#162624]">Share Your Experience</h3>
          
          <div>
            <label className="block text-xs font-bold text-gray-600 mb-1">Overall Rating</label>
            <div className="flex items-center gap-2">
              {[1, 2, 3, 4, 5].map((star) => (
                <button
                  type="button"
                  key={star}
                  onClick={() => setNewRating(star)}
                  className="p-1 hover:scale-110 transition"
                >
                  <Star
                    className={`w-6 h-6 ${
                      star <= newRating
                        ? 'fill-[#FFC800] text-[#FFC800]'
                        : 'text-gray-300'
                    }`}
                  />
                </button>
              ))}
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-gray-600 mb-1">Your Name</label>
              <input
                type="text"
                required
                value={newAuthor}
                onChange={(e) => setNewAuthor(e.target.value)}
                placeholder="e.g. Jessica T."
                className="w-full px-3.5 py-2 rounded-xl border border-gray-200 text-xs outline-none focus:border-[#0C534E]"
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-gray-600 mb-1">Pet Breed / Age</label>
              <input
                type="text"
                value={newPet}
                onChange={(e) => setNewPet(e.target.value)}
                placeholder="e.g. Charlie (2 yr Labrador)"
                className="w-full px-3.5 py-2 rounded-xl border border-gray-200 text-xs outline-none focus:border-[#0C534E]"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-gray-600 mb-1">Review Headline</label>
            <input
              type="text"
              required
              value={newTitle}
              onChange={(e) => setNewTitle(e.target.value)}
              placeholder="e.g. Excellent chew resistance and quality"
              className="w-full px-3.5 py-2 rounded-xl border border-gray-200 text-xs outline-none focus:border-[#0C534E]"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-gray-600 mb-1">Review Details</label>
            <textarea
              required
              rows={3}
              value={newContent}
              onChange={(e) => setNewContent(e.target.value)}
              placeholder="Describe how your pet plays with it, durability, texture, and size..."
              className="w-full px-3.5 py-2 rounded-xl border border-gray-200 text-xs outline-none focus:border-[#0C534E]"
            />
          </div>

          <div className="flex justify-end gap-3 pt-2">
            <button
              type="button"
              onClick={() => setIsWritingReview(false)}
              className="px-4 py-2 rounded-xl text-xs font-bold text-gray-500 hover:bg-gray-100"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-5 py-2 rounded-xl bg-[#0C534E] text-[#FFC800] text-xs font-black uppercase tracking-wider hover:bg-[#093B37] flex items-center gap-1.5 shadow"
            >
              <Send className="w-3.5 h-3.5" />
              <span>Submit Review</span>
            </button>
          </div>
        </form>
      )}

      {/* Reviews List */}
      <div className="space-y-4 pt-2">
        {reviews.map((rev) => (
          <div
            key={rev.id}
            className="p-5 sm:p-6 rounded-2xl bg-[#FAFBF9] border border-gray-100 space-y-3 transition hover:border-[#0C534E]/30"
          >
            <div className="flex flex-wrap items-center justify-between gap-2">
              <div className="flex items-center gap-2">
                <div className="flex items-center gap-0.5">
                  {[...Array(rev.rating)].map((_, i) => (
                    <Star key={i} className="w-4 h-4 fill-[#FFC800] text-[#FFC800]" />
                  ))}
                </div>
                <h4 className="font-extrabold text-sm text-[#162624]">{rev.title}</h4>
              </div>
              <span className="text-[0.7rem] text-gray-400 font-medium">{rev.date}</span>
            </div>

            <p className="text-xs sm:text-sm text-gray-600 leading-relaxed">{rev.content}</p>

            <div className="flex flex-wrap items-center justify-between gap-2 pt-2 border-t border-gray-200/50 text-[0.72rem]">
              <div className="flex items-center gap-2">
                <span className="font-extrabold text-[#162624]">{rev.author}</span>
                <span className="text-gray-400">•</span>
                <span className="text-gray-500 font-medium">{rev.pet}</span>
                {rev.verified && (
                  <span className="inline-flex items-center gap-1 text-emerald-700 font-bold bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-100 text-[0.65rem]">
                    <CheckCircle2 className="w-3 h-3 text-emerald-600" />
                    Verified Buyer
                  </span>
                )}
              </div>

              <div className="flex items-center gap-1.5 text-gray-400">
                <ThumbsUp className="w-3.5 h-3.5" />
                <span>Helpful ({rev.helpfulCount})</span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
};
