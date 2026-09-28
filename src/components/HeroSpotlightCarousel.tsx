"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import Link from "next/link";
import { Play, Info, Star, ChevronLeft, ChevronRight, Film, Flame } from "lucide-react";

export interface SpotlightItem {
  id: string;
  title: string;
  genre: string;
  releaseYear: number;
  description: string;
  thumbnailUrl: string;
  backdropUrl?: string | null;
  voteAverage?: number;
  tag?: string;
}

export default function HeroSpotlightCarousel({ movies }: { movies: SpotlightItem[] }) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isHovered, setIsHovered] = useState(false);
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  const total = movies.length;

  const nextSlide = useCallback(() => {
    if (total === 0) return;
    setCurrentIndex((prev) => (prev + 1) % total);
  }, [total]);

  const prevSlide = useCallback(() => {
    if (total === 0) return;
    setCurrentIndex((prev) => (prev - 1 + total) % total);
  }, [total]);

  // Auto-advance slides every 6.5 seconds when not hovered
  useEffect(() => {
    if (total <= 1 || isHovered) {
      if (timerRef.current) clearInterval(timerRef.current);
      return;
    }

    timerRef.current = setInterval(() => {
      nextSlide();
    }, 6500);

    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [total, isHovered, nextSlide]);

  if (!movies || movies.length === 0) return null;

  const current = movies[currentIndex] || movies[0];
  const bgImage = current.backdropUrl || current.thumbnailUrl;
  const rating = current.voteAverage && current.voteAverage > 0 
    ? current.voteAverage.toFixed(1) 
    : "8.9";

  return (
    <section 
      className="relative w-full min-h-[460px] sm:min-h-[540px] md:h-[72vh] md:max-h-[720px] flex items-center justify-center overflow-hidden rounded-2xl sm:rounded-3xl mt-1 sm:mt-2 border border-purple-500/20 shadow-[0_0_50px_rgba(139,92,246,0.15)] group gpu-layer"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* Background Image with Smooth Crossfade */}
      <div className="absolute inset-0 overflow-hidden">
        {movies.map((m, idx) => {
          const src = m.backdropUrl || m.thumbnailUrl;
          const isActive = idx === currentIndex;
          return (
            <div
              key={m.id + idx}
              className={`absolute inset-0 transition-opacity duration-1000 ease-in-out ${
                isActive ? "opacity-100 z-0 scale-100" : "opacity-0 -z-10 scale-105 pointer-events-none"
              }`}
            >
              {src ? (
                <img
                  src={src}
                  alt={m.title}
                  className="w-full h-full object-cover object-center transition-transform duration-[7000ms] ease-out group-hover:scale-105"
                  loading={idx === 0 ? "eager" : "lazy"}
                  decoding="async"
                />
              ) : (
                <div className="w-full h-full bg-slate-900 flex items-center justify-center">
                  <Film className="w-24 sm:w-32 h-24 sm:h-32 text-purple-900/50" />
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* Gradients Overlay */}
      <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/80 to-slate-950/40 opacity-95 z-10" />
      <div className="absolute inset-0 bg-gradient-to-r from-slate-950 via-purple-950/70 to-transparent opacity-95 z-10" />
      <div className="absolute inset-0 bg-rose-500/10 mix-blend-overlay pointer-events-none z-10" />

      {/* Slide Content */}
      <div className="relative z-20 max-w-7xl w-full mx-auto px-4 sm:px-8 lg:px-12 flex flex-col items-start py-8 sm:py-14">
        {/* Spotlight Pills */}
        <div className="flex flex-wrap items-center gap-2 sm:gap-3 mb-3 sm:mb-5">
          <div className="inline-flex items-center space-x-1.5 sm:space-x-2 bg-rose-500/20 border border-rose-500/40 rounded-full px-2.5 sm:px-3.5 py-0.5 sm:py-1 sm:backdrop-blur-md">
            <Flame className="w-3.5 h-3.5 text-rose-400 fill-current animate-pulse" />
            <span className="text-rose-200 text-[10px] sm:text-xs font-bold tracking-wider uppercase">
              {current.tag || `#${currentIndex + 1} Featured Blockbuster`}
            </span>
          </div>

          <div className="inline-flex items-center space-x-1 bg-amber-500/10 border border-amber-500/30 rounded-full px-2 sm:px-3 py-0.5 sm:py-1 sm:backdrop-blur-md text-amber-300 text-[10px] sm:text-xs font-bold">
            <Star className="w-3 sm:w-3.5 h-3 sm:h-3.5 fill-current text-amber-400" />
            <span>{rating} / 10 IMDb</span>
          </div>

          <span className="bg-slate-800/80 border border-purple-500/20 text-purple-200 text-[10px] sm:text-xs font-bold px-2 sm:px-2.5 py-0.5 sm:py-1 rounded-full uppercase">
            {current.genre}
          </span>

          <span className="bg-slate-800/80 border border-purple-500/20 text-slate-300 text-[10px] sm:text-xs font-bold px-2 sm:px-2.5 py-0.5 sm:py-1 rounded-full uppercase hidden xs:inline-block">
            {current.releaseYear}
          </span>

          <span className="bg-gradient-to-r from-rose-500/20 to-purple-500/20 border border-rose-500/30 text-rose-300 text-[10px] sm:text-xs font-bold px-2 sm:px-2.5 py-0.5 sm:py-1 rounded-full uppercase hidden sm:inline-block">
            4K Ultra HD
          </span>
        </div>

        {/* Title */}
        <h1 className="text-2xl sm:text-4xl md:text-6xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-white via-rose-100 to-purple-200 mb-3 sm:mb-5 drop-shadow-[0_2px_25px_rgba(244,63,94,0.4)] max-w-3xl tracking-tight leading-tight transition-all duration-300">
          {current.title}
        </h1>

        {/* Synopsis */}
        <p className="text-slate-300 text-xs sm:text-base md:text-lg max-w-2xl mb-5 sm:mb-8 line-clamp-2 sm:line-clamp-3 drop-shadow-md font-light leading-relaxed">
          {current.description}
        </p>

        {/* Action Buttons */}
        <div className="flex flex-row items-center gap-2.5 sm:gap-4 w-full sm:w-auto">
          <Link 
            href={`/movie/${current.id}`}
            className="flex-1 sm:flex-none bg-gradient-to-r from-rose-600 to-purple-600 hover:from-rose-500 hover:to-purple-500 text-white px-5 sm:px-8 py-3 sm:py-3.5 rounded-full font-bold flex items-center justify-center transition-all hover:scale-105 shadow-[0_0_30px_rgba(244,63,94,0.4)] group/btn text-xs sm:text-base min-h-[44px]"
          >
            <Play className="w-4 sm:w-5 h-4 sm:h-5 mr-1.5 sm:mr-2.5 fill-current group-hover/btn:scale-110 transition-transform" /> 
            <span className="tracking-wide">Watch Free</span>
          </Link>
          <Link 
            href={`/movie/${current.id}`}
            className="flex-1 sm:flex-none bg-slate-900/80 hover:bg-slate-800/90 text-slate-200 border border-purple-500/30 px-4 sm:px-6 py-3 sm:py-3.5 rounded-full font-semibold flex items-center justify-center transition-all hover:border-rose-500/50 sm:backdrop-blur-md text-xs sm:text-sm min-h-[44px]"
          >
            <Info className="w-3.5 sm:w-4 h-3.5 sm:h-4 mr-1.5 sm:mr-2 text-rose-400" />
            <span>Details</span>
          </Link>
        </div>
      </div>

      {/* Prev / Next Navigation Arrows */}
      {total > 1 && (
        <>
          <button
            type="button"
            onClick={prevSlide}
            aria-label="Previous Film"
            className="absolute left-2 sm:left-4 top-1/2 -translate-y-1/2 z-30 p-2 sm:p-3 rounded-full bg-slate-950/60 hover:bg-slate-900/90 text-white border border-purple-500/30 hover:border-rose-500/60 sm:backdrop-blur-md transition-all opacity-70 group-hover:opacity-100 hover:scale-110 cursor-pointer shadow-lg"
          >
            <ChevronLeft className="w-5 sm:w-6 h-5 sm:h-6" />
          </button>
          <button
            type="button"
            onClick={nextSlide}
            aria-label="Next Film"
            className="absolute right-2 sm:right-4 top-1/2 -translate-y-1/2 z-30 p-2 sm:p-3 rounded-full bg-slate-950/60 hover:bg-slate-900/90 text-white border border-purple-500/30 hover:border-rose-500/60 sm:backdrop-blur-md transition-all opacity-70 group-hover:opacity-100 hover:scale-110 cursor-pointer shadow-lg"
          >
            <ChevronRight className="w-5 sm:w-6 h-5 sm:h-6" />
          </button>
        </>
      )}

      {/* Slide Indicators / Dots */}
      {total > 1 && (
        <div className="absolute bottom-3 sm:bottom-5 left-1/2 -translate-x-1/2 z-30 flex items-center gap-1.5 sm:gap-2 bg-slate-950/70 sm:backdrop-blur-md px-3 py-1.5 rounded-full border border-purple-500/20">
          {movies.map((_, idx) => (
            <button
              key={idx}
              type="button"
              onClick={() => setCurrentIndex(idx)}
              aria-label={`Go to slide ${idx + 1}`}
              className={`transition-all duration-300 rounded-full cursor-pointer ${
                idx === currentIndex
                  ? "w-6 sm:w-8 h-2 bg-gradient-to-r from-rose-500 to-purple-500 shadow-[0_0_10px_rgba(244,63,94,0.6)]"
                  : "w-2 h-2 bg-slate-600 hover:bg-slate-400"
              }`}
            />
          ))}
        </div>
      )}
    </section>
  );
}
