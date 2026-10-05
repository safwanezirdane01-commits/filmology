"use client";

import { useRef } from "react";
import Link from "next/link";
import { Star, Play, Film, ChevronLeft, ChevronRight } from "lucide-react";
import QuickWatchlistHeart from "@/components/QuickWatchlistHeart";

export interface ShelfMovie {
  id: string;
  title: string;
  genre: string;
  releaseYear: number;
  thumbnailUrl: string;
  voteAverage?: number;
  mediaType?: "movie" | "tv";
}

export default function MovieShelf({
  title,
  icon,
  subtitle,
  movies,
  badgeText,
}: {
  title: string;
  icon?: React.ReactNode;
  subtitle?: string;
  movies: ShelfMovie[];
  badgeText?: string;
}) {
  const scrollRef = useRef<HTMLDivElement>(null);

  const scroll = (direction: "left" | "right") => {
    if (!scrollRef.current) return;
    const offset = direction === "left" ? -500 : 500;
    scrollRef.current.scrollBy({ left: offset, behavior: "smooth" });
  };

  if (!movies || movies.length === 0) return null;

  return (
    <section className="space-y-3 sm:space-y-4 relative group/shelf">
      {/* Shelf Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-2.5 sm:space-x-3">
          {icon && <div className="text-rose-400 shrink-0">{icon}</div>}
          <div>
            <h3 className="text-lg sm:text-2xl font-bold text-white tracking-tight flex items-center space-x-2">
              <span>{title}</span>
              {badgeText && (
                <span className="text-[10px] sm:text-xs font-extrabold uppercase px-2 py-0.5 rounded-full bg-rose-500/20 text-rose-300 border border-rose-500/30">
                  {badgeText}
                </span>
              )}
            </h3>
            {subtitle && (
              <p className="text-xs text-purple-300/60 hidden sm:block">{subtitle}</p>
            )}
          </div>
        </div>

        {/* Scroll Controls */}
        <div className="flex items-center space-x-1.5">
          <button
            type="button"
            onClick={() => scroll("left")}
            aria-label="Scroll left"
            className="p-1.5 sm:p-2 rounded-xl bg-slate-900/80 hover:bg-slate-800 text-slate-300 hover:text-white border border-purple-500/20 transition-all cursor-pointer shadow"
          >
            <ChevronLeft className="w-4 h-4" />
          </button>
          <button
            type="button"
            onClick={() => scroll("right")}
            aria-label="Scroll right"
            className="p-1.5 sm:p-2 rounded-xl bg-slate-900/80 hover:bg-slate-800 text-slate-300 hover:text-white border border-purple-500/20 transition-all cursor-pointer shadow"
          >
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Horizontal Scrolling Card Track */}
      <div
        ref={scrollRef}
        className="flex items-center gap-3 sm:gap-4 overflow-x-auto pb-3 pt-1 scrollbar-none scroll-smooth touch-pan-x"
      >
        {movies.map((m) => {
          const rating = m.voteAverage && m.voteAverage > 0 ? m.voteAverage.toFixed(1) : "8.5";
          return (
            <Link
              key={m.id}
              href={`/movie/${m.id}`}
              className="group/card relative flex-none w-36 sm:w-44 md:w-48 bg-slate-950 rounded-xl sm:rounded-2xl overflow-hidden border border-purple-900/30 hover:border-rose-500/60 transition-all duration-300 hover:-translate-y-1.5 hover:shadow-[0_12px_30px_rgba(244,63,94,0.3)] gpu-layer contain-paint"
            >
              <div className="relative aspect-[2/3] w-full overflow-hidden bg-slate-900">
                {m.thumbnailUrl ? (
                  <img
                    src={m.thumbnailUrl}
                    alt={m.title}
                    loading="lazy"
                    decoding="async"
                    className="w-full h-full object-cover transition-transform duration-500 group-hover/card:scale-105"
                  />
                ) : (
                  <div className="w-full h-full flex flex-col items-center justify-center p-3 text-center">
                    <Film className="w-8 h-8 text-purple-900/50 mb-1" />
                    <span className="text-purple-300/50 text-[10px]">{m.title}</span>
                  </div>
                )}

                {/* Rating Badge */}
                <div className="absolute top-2 right-2 bg-slate-950/85 sm:backdrop-blur-md px-1.5 py-0.5 rounded-md border border-amber-500/30 flex items-center space-x-1 text-[10px] font-bold text-amber-300">
                  <Star className="w-2.5 h-2.5 fill-current text-amber-400" />
                  <span>{rating}</span>
                </div>

                {/* Release Year Badge */}
                <div className="absolute top-2 left-2 bg-slate-950/85 sm:backdrop-blur-md px-1.5 py-0.5 rounded-md border border-purple-500/30 text-[10px] font-semibold text-slate-300">
                  {m.releaseYear}
                </div>

                {/* Gradients */}
                <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/20 to-transparent opacity-85" />

                  {/* Quick Watchlist Heart Button */}
                  <div className="absolute bottom-2 right-2 z-20">
                    <QuickWatchlistHeart
                      item={{
                        id: m.id,
                        title: m.title,
                        thumbnailUrl: m.thumbnailUrl,
                        genre: m.genre,
                        releaseYear: m.releaseYear,
                      }}
                    />
                  </div>
                </div>

              {/* Title & Info */}
              <div className="p-2.5 sm:p-3 space-y-0.5">
                <span className="text-[9px] sm:text-[10px] text-rose-400 font-bold uppercase tracking-wider line-clamp-1">
                  {m.genre}
                </span>
                <h4 className="text-white text-xs sm:text-sm font-bold truncate group-hover/card:text-rose-200 transition-colors">
                  {m.title}
                </h4>
              </div>
            </Link>
          );
        })}
      </div>
    </section>
  );
}
