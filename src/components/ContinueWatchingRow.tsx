"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Play, Clock, X, Film, Tv, ChevronRight } from "lucide-react";
import { getWatchHistory, clearWatchItem, formatTime, WatchItem } from "@/lib/watchProgress";

export default function ContinueWatchingRow() {
  const [items, setItems] = useState<WatchItem[]>([]);
  const [mounted, setMounted] = useState<boolean>(false);

  useEffect(() => {
    setMounted(true);
    const history = getWatchHistory();
    // Only show items with meaningful progress (not finished)
    const valid = history.filter(
      (item) => item.currentTime > 5 && item.progressPercent < 95
    );
    setItems(valid);
  }, []);

  const handleDismiss = (e: React.MouseEvent, item: WatchItem) => {
    e.preventDefault();
    e.stopPropagation();
    clearWatchItem(item.id, item.season, item.episode);
    setItems((prev) =>
      prev.filter(
        (i) =>
          !(
            i.id === item.id &&
            (i.season || 1) === (item.season || 1) &&
            (i.episode || 1) === (item.episode || 1)
          )
      )
    );
  };

  if (!mounted || items.length === 0) return null;

  return (
    <section className="max-w-7xl mx-auto w-full px-3 sm:px-6 lg:px-8 -mt-2 sm:-mt-4">
      <div className="flex items-center justify-between mb-3 sm:mb-4">
        <div className="flex items-center space-x-2.5">
          <div className="p-1.5 sm:p-2 bg-gradient-to-br from-rose-500/20 to-purple-500/20 border border-rose-500/30 rounded-xl text-rose-400">
            <Clock className="w-4 sm:w-5 h-4 sm:h-5" />
          </div>
          <div>
            <h3 className="text-white text-base sm:text-lg font-bold flex items-center gap-2">
              Continue Watching
              <span className="bg-rose-500/20 border border-rose-500/30 text-rose-300 text-[10px] font-bold px-2 py-0.5 rounded-full">
                {items.length}
              </span>
            </h3>
            <p className="text-purple-300/50 text-[11px] sm:text-xs">Pick up right where you left off</p>
          </div>
        </div>
      </div>

      {/* Horizontal Scrollable Carousel */}
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3 sm:gap-4">
        {items.slice(0, 5).map((item) => {
          const isSeries = !!item.season || !!item.episode;
          const timeLeft = Math.max(0, item.duration - item.currentTime);

          return (
            <div
              key={`${item.id}-${item.season || 1}-${item.episode || 1}`}
              className="group relative bg-slate-900/90 border border-purple-900/40 hover:border-rose-500/50 rounded-xl sm:rounded-2xl overflow-hidden transition-all duration-300 hover:shadow-[0_0_25px_rgba(244,63,94,0.2)] flex flex-col"
            >
              {/* Poster & Play Action Area */}
              <Link href={`/movie/${item.id}`} className="relative aspect-video w-full bg-slate-950 overflow-hidden block">
                {item.thumbnailUrl ? (
                  <img
                    src={item.thumbnailUrl}
                    alt={item.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500 brightness-90 group-hover:brightness-100"
                    loading="lazy"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-slate-600 bg-slate-900">
                    <Film className="w-8 h-8 opacity-40" />
                  </div>
                )}

                {/* Dark Vignette Overlay */}
                <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/40 to-transparent" />

                {/* Floating Play Button */}
                <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                  <div className="w-10 sm:w-12 h-10 sm:h-12 rounded-full bg-rose-600/90 text-white flex items-center justify-center shadow-lg transform scale-90 group-hover:scale-100 transition-transform duration-300">
                    <Play className="w-5 h-5 fill-current ml-0.5" />
                  </div>
                </div>

                {/* Dismiss Button */}
                <button
                  type="button"
                  onClick={(e) => handleDismiss(e, item)}
                  className="absolute top-1.5 right-1.5 z-20 w-6 h-6 rounded-full bg-slate-950/80 hover:bg-rose-600 text-slate-400 hover:text-white flex items-center justify-center transition-colors cursor-pointer"
                  title="Remove from history"
                >
                  <X className="w-3.5 h-3.5" />
                </button>

                {/* Badge (Season/Episode or Movie) */}
                <div className="absolute bottom-2 left-2 flex items-center space-x-1.5">
                  {isSeries ? (
                    <span className="bg-purple-900/90 border border-purple-500/40 text-purple-200 text-[10px] font-bold px-2 py-0.5 rounded-md flex items-center gap-1 shadow">
                      <Tv className="w-2.5 h-2.5" />
                      S{item.season || 1}:E{item.episode || 1}
                    </span>
                  ) : (
                    <span className="bg-slate-900/90 border border-slate-700 text-slate-300 text-[10px] font-bold px-2 py-0.5 rounded-md flex items-center gap-1 shadow">
                      <Film className="w-2.5 h-2.5" />
                      Movie
                    </span>
                  )}
                  <span className="text-[10px] text-slate-300 font-medium bg-black/60 px-1.5 py-0.5 rounded">
                    {formatTime(timeLeft)} left
                  </span>
                </div>
              </Link>

              {/* Progress Bar (Netflix Style) */}
              <div className="w-full bg-slate-800 h-1.5 overflow-hidden">
                <div
                  className="bg-gradient-to-r from-rose-500 to-purple-600 h-full transition-all duration-300"
                  style={{ width: `${Math.max(5, item.progressPercent)}%` }}
                />
              </div>

              {/* Info Title */}
              <div className="p-2 sm:p-3 flex items-center justify-between">
                <Link href={`/movie/${item.id}`} className="flex-1 min-w-0">
                  <h4 className="text-white text-xs sm:text-sm font-semibold truncate hover:text-rose-400 transition-colors">
                    {item.title}
                  </h4>
                  <p className="text-[10px] sm:text-xs text-purple-300/50 truncate">
                    {item.genre || (isSeries ? "TV Series" : "Cinema")}
                  </p>
                </Link>
                <Link
                  href={`/movie/${item.id}`}
                  className="p-1 rounded-lg hover:bg-slate-800 text-slate-400 hover:text-white transition-colors"
                >
                  <ChevronRight className="w-4 h-4" />
                </Link>
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
}
