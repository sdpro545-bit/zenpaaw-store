import Link from 'next/link';
import { ArrowLeft, Search } from 'lucide-react';
import { RevealText } from '@/components/RevealText';

export default function NotFound() {
  return (
    <div className="min-h-[70vh] flex items-center justify-center px-4 py-16 bg-[#FAFBF9]">
      <div className="max-w-md w-full text-center space-y-6">
        {/* CSS Paw tapping animation */}
        <div className="mx-auto w-24 h-24 rounded-full bg-[#F0F7F6] border-2 border-[#A3D2CD] flex items-center justify-center relative overflow-hidden">
          <div className="w-12 h-12 relative animate-bounce">
            <svg viewBox="0 0 24 24" fill="#FFC800" className="w-full h-full drop-shadow-sm">
              <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1 15h-2v-2h2v2zm0-4h-2V7h2v6z" fill="#0C534E" />
            </svg>
          </div>
        </div>

        <div className="space-y-2">
          <span className="text-xs font-black uppercase tracking-widest text-[#0C534E]">
            404 • Page Not Found
          </span>
          <RevealText as="h1" className="text-3xl sm:text-4xl font-black text-[#162624]">
            This Toy Has Rolled Away
          </RevealText>
          <p className="text-sm text-gray-600 leading-relaxed max-w-sm mx-auto">
            The page or product you are looking for does not exist or has been moved. Explore our active catalog below.
          </p>
        </div>

        <div className="pt-2 flex flex-col sm:flex-row items-center justify-center gap-3">
          <Link
            href="/shop"
            className="w-full sm:w-auto px-6 py-3 rounded-full bg-[#0C534E] text-[#FFC800] font-black text-xs uppercase tracking-wider hover:bg-[#093B37] transition shadow-md"
          >
            Browse All Toys
          </Link>
          <Link
            href="/"
            className="w-full sm:w-auto px-6 py-3 rounded-full bg-white border border-gray-200 text-[#162624] font-bold text-xs hover:bg-gray-50 transition flex items-center justify-center gap-1.5"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Back to Home</span>
          </Link>
        </div>
      </div>
    </div>
  );
}
