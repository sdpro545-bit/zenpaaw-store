'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { ArrowRight, RotateCcw, Check } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

export function FindToyGuide() {
  const router = useRouter();
  const [step, setStep] = useState(1);
  const [pet, setPet] = useState<'Dogs' | 'Puppies' | 'Cats'>('Dogs');
  const [size, setSize] = useState('Medium (20-50 lbs)');
  const [chew, setChew] = useState<'gentle' | 'moderate' | 'power'>('moderate');
  const [play, setPlay] = useState<'chew' | 'fetch' | 'tug' | 'puzzle' | 'plush' | 'chase'>('chew');

  const handleFinish = () => {
    const params = new URLSearchParams();
    params.set('pet', pet.toLowerCase());
    if (pet !== 'Cats') {
      params.set('chew', chew);
    }
    params.set('play', play);
    router.push(`/shop?${params.toString()}`);
  };

  const handleReset = () => {
    setStep(1);
    setPet('Dogs');
    setChew('moderate');
    setPlay('chew');
  };

  return (
    <div className="bg-white rounded-3xl p-6 sm:p-10 border border-[#E2EBEA] shadow-sm relative overflow-hidden">
      {/* Decorative paw watermark */}
      <div className="absolute -top-10 -right-10 w-44 h-44 opacity-5 pointer-events-none text-[#0C534E]">
        <svg viewBox="0 0 100 100" fill="currentColor">
          <circle cx="28" cy="25" r="12" />
          <circle cx="50" cy="18" r="12" />
          <circle cx="72" cy="25" r="12" />
          <path d="M50 45 C30 45 20 65 30 85 C40 95 60 95 70 85 C80 65 70 45 50 45 Z" />
        </svg>
      </div>

      <div className="max-w-2xl mx-auto">
        {/* Step progress bar */}
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center gap-2">
            {[1, 2, 3].map((s) => (
              <div
                key={s}
                className={`h-2 rounded-full transition-all duration-300 ${
                  s === step ? 'w-10 bg-[#0C534E]' : s < step ? 'w-6 bg-[#FFC800]' : 'w-4 bg-gray-200'
                }`}
              />
            ))}
          </div>
          <span className="text-xs font-black uppercase tracking-wider text-[#0C534E]">
            Step {step} of 3
          </span>
        </div>

        <AnimatePresence mode="wait">
          {step === 1 && (
            <motion.div
              key="step-1"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.28 }}
              className="space-y-6"
            >
              <div>
                <h3 className="text-xl sm:text-2xl font-black text-[#162624]">Who is playing?</h3>
                <p className="text-xs sm:text-sm text-gray-500 mt-1">
                  Select your pet companion to filter appropriate sizes and textures.
                </p>
              </div>

              <div className="grid grid-cols-3 gap-3">
                {(['Dogs', 'Puppies', 'Cats'] as const).map((p) => (
                  <button
                    key={p}
                    type="button"
                    onClick={() => setPet(p)}
                    className={`p-4 rounded-2xl border-2 text-center transition font-black text-sm flex flex-col items-center justify-center gap-2 ${
                      pet === p
                        ? 'border-[#0C534E] bg-[#F0F7F6] text-[#0C534E] shadow-sm'
                        : 'border-gray-200 hover:border-gray-300 text-gray-700 bg-white'
                    }`}
                  >
                    <span>{p}</span>
                    {pet === p && <Check className="w-4 h-4 text-[#0C534E]" />}
                  </button>
                ))}
              </div>

              {pet === 'Dogs' && (
                <div className="space-y-2 pt-2">
                  <label className="text-xs font-bold text-[#162624] block">Dog Weight Range</label>
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                    {['Small (under 20 lbs)', 'Medium (20-50 lbs)', 'Large (over 50 lbs)'].map((s) => (
                      <button
                        key={s}
                        type="button"
                        onClick={() => setSize(s)}
                        className={`p-2.5 rounded-xl text-xs font-bold border text-left transition ${
                          size === s
                            ? 'border-[#0C534E] bg-[#F0F7F6] text-[#0C534E]'
                            : 'border-gray-200 text-gray-600'
                        }`}
                      >
                        {s}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              <div className="flex justify-end pt-4">
                <button
                  type="button"
                  onClick={() => setStep(2)}
                  className="px-6 py-3 rounded-full bg-[#0C534E] text-[#FFC800] text-xs font-black uppercase tracking-wider flex items-center gap-2 hover:bg-[#093B37] transition shadow-md"
                >
                  <span>Next: Chew Strength</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            </motion.div>
          )}

          {step === 2 && (
            <motion.div
              key="step-2"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.28 }}
              className="space-y-6"
            >
              <div>
                <h3 className="text-xl sm:text-2xl font-black text-[#162624]">How hard do they chew?</h3>
                <p className="text-xs sm:text-sm text-gray-500 mt-1">
                  We match durability ratings so toys last through playtime safely.
                </p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                {[
                  { id: 'gentle', title: 'Gentle Chewer', desc: 'Carries, mouths, and snuggles softly.' },
                  { id: 'moderate', title: 'Moderate Chewer', desc: 'Active gnawing on rubber and rope.' },
                  { id: 'power', title: 'Power Chewer', desc: 'Heavy jaws requiring high-density vulcanized rubber.' },
                ].map((c) => (
                  <button
                    key={c.id}
                    type="button"
                    onClick={() => setChew(c.id as any)}
                    className={`p-4 rounded-2xl border-2 text-left transition flex flex-col justify-between ${
                      chew === c.id
                        ? 'border-[#0C534E] bg-[#F0F7F6] text-[#0C534E] shadow-sm'
                        : 'border-gray-200 hover:border-gray-300 text-gray-700 bg-white'
                    }`}
                  >
                    <div>
                      <div className="font-black text-sm text-[#162624] mb-1">{c.title}</div>
                      <div className="text-xs text-gray-500 leading-relaxed">{c.desc}</div>
                    </div>
                    {chew === c.id && <Check className="w-4 h-4 text-[#0C534E] mt-3" />}
                  </button>
                ))}
              </div>

              <div className="flex items-center justify-between pt-4">
                <button
                  type="button"
                  onClick={() => setStep(1)}
                  className="px-4 py-2 text-xs font-bold text-gray-500 hover:text-[#162624]"
                >
                  Back
                </button>
                <button
                  type="button"
                  onClick={() => setStep(3)}
                  className="px-6 py-3 rounded-full bg-[#0C534E] text-[#FFC800] text-xs font-black uppercase tracking-wider flex items-center gap-2 hover:bg-[#093B37] transition shadow-md"
                >
                  <span>Next: Play Style</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            </motion.div>
          )}

          {step === 3 && (
            <motion.div
              key="step-3"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.28 }}
              className="space-y-6"
            >
              <div>
                <h3 className="text-xl sm:text-2xl font-black text-[#162624]">What is their favorite play?</h3>
                <p className="text-xs sm:text-sm text-gray-500 mt-1">
                  Pick the activity your pet gets most excited about.
                </p>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                {[
                  { id: 'chew', label: 'Chewing & Gnawing' },
                  { id: 'fetch', label: 'Outdoor Fetch' },
                  { id: 'tug', label: 'Tug & Resistance' },
                  { id: 'puzzle', label: 'Treat & Puzzles' },
                  { id: 'plush', label: 'Soft & Squeaky' },
                  { id: 'chase', label: 'Chasing & Rolling' },
                ].map((item) => (
                  <button
                    key={item.id}
                    type="button"
                    onClick={() => setPlay(item.id as any)}
                    className={`p-3.5 rounded-2xl border-2 text-center transition text-xs font-extrabold ${
                      play === item.id
                        ? 'border-[#0C534E] bg-[#F0F7F6] text-[#0C534E] shadow-sm'
                        : 'border-gray-200 hover:border-gray-300 text-gray-700 bg-white'
                    }`}
                  >
                    {item.label}
                  </button>
                ))}
              </div>

              <div className="flex items-center justify-between pt-4">
                <button
                  type="button"
                  onClick={() => setStep(2)}
                  className="px-4 py-2 text-xs font-bold text-gray-500 hover:text-[#162624]"
                >
                  Back
                </button>
                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={handleReset}
                    className="p-3 rounded-full hover:bg-gray-100 text-gray-400 hover:text-gray-600 transition"
                    title="Reset picker"
                  >
                    <RotateCcw className="w-4 h-4" />
                  </button>
                  <button
                    type="button"
                    onClick={handleFinish}
                    className="px-6 py-3 rounded-full bg-[#FFC800] text-[#162624] text-xs font-black uppercase tracking-wider flex items-center gap-2 hover:bg-[#E5B400] transition shadow-md"
                  >
                    <span>View Recommended Toys</span>
                    <ArrowRight className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
