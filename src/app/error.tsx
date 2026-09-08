"use client";

import { useEffect } from "react";
import Link from "next/link";
import { AlertCircle, RefreshCw, Home } from "lucide-react";

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error("FilmologyX Runtime Error:", error);
  }, [error]);

  return (
    <div className="min-h-[70vh] flex flex-col items-center justify-center text-center px-4">
      <div className="relative mb-6">
        <div className="w-24 h-24 rounded-full bg-amber-500/10 border border-amber-500/20 flex items-center justify-center">
          <AlertCircle className="w-12 h-12 text-amber-500" />
        </div>
        <div className="absolute -inset-2 bg-amber-500/20 rounded-full blur-xl -z-10 animate-pulse" />
      </div>

      <h1 className="text-3xl sm:text-4xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-white via-rose-100 to-purple-200 mb-3 tracking-tight">
        Something went wrong
      </h1>

      <p className="text-slate-400 max-w-md mb-8 text-sm sm:text-base">
        A temporary issue occurred while loading this page. Please try reloading or head back to the home page.
      </p>

      <div className="flex flex-wrap items-center justify-center gap-4">
        <button
          onClick={() => reset()}
          className="inline-flex items-center space-x-2 bg-gradient-to-r from-rose-600 to-purple-600 hover:from-rose-500 hover:to-purple-500 text-white font-semibold px-6 py-3 rounded-full transition-all duration-300 shadow-lg shadow-rose-600/30 hover:scale-105"
        >
          <RefreshCw className="w-4 h-4" />
          <span>Try Again</span>
        </button>
        <Link
          href="/"
          className="inline-flex items-center space-x-2 bg-slate-900 border border-purple-500/30 hover:border-rose-500/50 text-slate-200 hover:text-white font-medium px-6 py-3 rounded-full transition-all duration-300"
        >
          <Home className="w-4 h-4" />
          <span>Go Home</span>
        </Link>
      </div>
    </div>
  );
}
