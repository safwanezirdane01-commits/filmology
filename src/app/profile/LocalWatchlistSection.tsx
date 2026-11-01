"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { Film, Trash2, Play } from "lucide-react";
import { getSavedWatchlist, toggleSavedWatchlist, SavedWatchItem } from "@/lib/watchlist";

export default function LocalWatchlistSection() {
  const [items, setItems] = useState<SavedWatchItem[]>([]);
  const [mounted, setMounted] = useState(false);

  const loadItems = () => {
    setItems(getSavedWatchlist());
  };

  useEffect(() => {
    setMounted(true);
    loadItems();

    window.addEventListener("filmologyx_watchlist_updated", loadItems);
    return () => window.removeEventListener("filmologyx_watchlist_updated", loadItems);
  }, []);

  const handleRemove = (e: React.MouseEvent, item: SavedWatchItem) => {
    e.preventDefault();
    e.stopPropagation();
    toggleSavedWatchlist(item);
    loadItems();
  };

  if (!mounted) return null;

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-xl sm:text-2xl font-bold text-white flex items-center space-x-2">
          <span>Saved Watchlist</span>
          <span className="text-xs bg-rose-500/20 text-rose-300 border border-rose-500/30 px-2 py-0.5 rounded-full font-bold">
            {items.length} titles
          </span>
        </h2>
      </div>

      {items.length === 0 ? (
        <div className="bg-slate-900/60 p-8 rounded-2xl border border-purple-900/30 text-center text-slate-400">
          <p className="text-sm font-medium">Your watchlist is currently empty.</p>
          <p className="text-xs text-slate-500 mt-1">
            Tap the heart icon on any movie poster to save it here for later!
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
          {items.map((item) => (
            <div
              key={item.id}
              className="group relative flex flex-col bg-slate-950 rounded-xl overflow-hidden border border-purple-900/30 hover:border-rose-500/50 transition-all duration-200"
            >
              <Link href={`/movie/${item.id}`} className="relative aspect-[2/3] w-full bg-slate-900 overflow-hidden block">
                {item.thumbnailUrl ? (
                  <img
                    src={item.thumbnailUrl}
                    alt={item.title}
                    loading="lazy"
                    className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                  />
                ) : (
                  <div className="w-full h-full flex flex-col items-center justify-center p-3 text-center">
                    <Film className="w-8 h-8 text-purple-900/50 mb-1" />
                    <span className="text-[10px] text-purple-300/50">{item.title}</span>
                  </div>
                )}

                <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-transparent to-transparent opacity-80" />

                {/* Play hover */}
                <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                  <div className="w-10 h-10 rounded-full bg-rose-600 flex items-center justify-center shadow-lg">
                    <Play className="w-4 h-4 text-white fill-current ml-0.5" />
                  </div>
                </div>
              </Link>

              {/* Remove button */}
              <button
                type="button"
                onClick={(e) => handleRemove(e, item)}
                className="absolute top-2 right-2 p-1.5 rounded-full bg-slate-950/80 hover:bg-rose-600 text-slate-400 hover:text-white transition-colors border border-white/10 z-10"
                title="Remove from Watchlist"
              >
                <Trash2 className="w-3.5 h-3.5" />
              </button>

              <div className="p-2.5">
                <h4 className="text-white text-xs font-bold truncate group-hover:text-rose-300 transition-colors">
                  {item.title}
                </h4>
                {item.releaseYear && (
                  <p className="text-[10px] text-slate-400 mt-0.5">{item.genre || "Cinema"} • {item.releaseYear}</p>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
