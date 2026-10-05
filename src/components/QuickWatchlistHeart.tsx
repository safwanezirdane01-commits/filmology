"use client";

import { useState, useEffect } from "react";
import { Heart } from "lucide-react";
import { isItemInWatchlist, toggleSavedWatchlist, SavedWatchItem } from "@/lib/watchlist";

export default function QuickWatchlistHeart({
  item,
  className = "",
}: {
  item: SavedWatchItem;
  className?: string;
}) {
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    setSaved(isItemInWatchlist(item.id));

    const handleUpdate = () => {
      setSaved(isItemInWatchlist(item.id));
    };

    window.addEventListener("filmologyx_watchlist_updated", handleUpdate);
    return () => window.removeEventListener("filmologyx_watchlist_updated", handleUpdate);
  }, [item.id]);

  const handleToggle = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    const newStatus = toggleSavedWatchlist(item);
    setSaved(newStatus);
  };

  return (
    <button
      type="button"
      onClick={handleToggle}
      aria-label={saved ? "Remove from Watchlist" : "Save to Watchlist"}
      title={saved ? "Saved in Watchlist" : "Add to Watchlist"}
      className={`p-1.5 sm:p-2 rounded-full transition-all duration-200 active:scale-125 cursor-pointer z-20 ${
        saved
          ? "bg-rose-600/90 text-white shadow-lg shadow-rose-600/40 ring-1 ring-white/30"
          : "bg-slate-950/70 hover:bg-slate-900 text-slate-300 hover:text-rose-400 border border-white/10 hover:border-rose-500/40"
      } ${className}`}
    >
      <Heart className={`w-3.5 sm:w-4 h-3.5 sm:h-4 ${saved ? "fill-current text-white" : ""}`} />
    </button>
  );
}
