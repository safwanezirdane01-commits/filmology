import Link from "next/link";
import { Film, Home, ArrowLeft } from "lucide-react";

export default function NotFound() {
  return (
    <div className="min-h-[70vh] flex flex-col items-center justify-center text-center px-4">
      <div className="relative mb-6">
        <div className="w-24 h-24 rounded-full bg-rose-500/10 border border-rose-500/20 flex items-center justify-center">
          <Film className="w-12 h-12 text-rose-500" />
        </div>
        <div className="absolute -inset-2 bg-rose-500/20 rounded-full blur-xl -z-10 animate-pulse" />
      </div>

      <h1 className="text-4xl sm:text-5xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-white via-rose-100 to-purple-200 mb-3 tracking-tight">
        Movie Not Found
      </h1>

      <p className="text-slate-400 max-w-md mb-8 text-base sm:text-lg">
        The title or page you are looking for doesn't exist, was moved, or is temporarily unavailable.
      </p>

      <div className="flex flex-wrap items-center justify-center gap-4">
        <Link
          href="/"
          className="inline-flex items-center space-x-2 bg-gradient-to-r from-rose-600 to-purple-600 hover:from-rose-500 hover:to-purple-500 text-white font-semibold px-6 py-3 rounded-full transition-all duration-300 shadow-lg shadow-rose-600/30 hover:scale-105"
        >
          <Home className="w-4 h-4" />
          <span>Back to Home</span>
        </Link>
        <Link
          href="/search"
          className="inline-flex items-center space-x-2 bg-slate-900 border border-purple-500/30 hover:border-rose-500/50 text-slate-200 hover:text-white font-medium px-6 py-3 rounded-full transition-all duration-300"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Explore Catalog</span>
        </Link>
      </div>
    </div>
  );
}
