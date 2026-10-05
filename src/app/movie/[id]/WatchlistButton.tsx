"use client";

import { useState, useEffect } from "react";
import { Bookmark, BookmarkCheck } from "lucide-react";
import { isItemInWatchlist, toggleSavedWatchlist } from "@/lib/watchlist";

export default function WatchlistButton({ 
  movieId, 
  title = "Movie",
  thumbnailUrl = null,
  genre,
  releaseYear,
}: { 
  movieId: string; 
  title?: string;
  thumbnailUrl?: string | null;
  genre?: string;
  releaseYear?: number;
}) {
  const [inWatchlist, setInWatchlist] = useState(false);

  useEffect(() => {
    setInWatchlist(isItemInWatchlist(movieId));

    const handleUpdate = () => {
      setInWatchlist(isItemInWatchlist(movieId));
    };

    window.addEventListener("filmologyx_watchlist_updated", handleUpdate);
    return () => window.removeEventListener("filmologyx_watchlist_updated", handleUpdate);
  }, [movieId]);

  const toggleWatchlist = () => {
    const newStatus = toggleSavedWatchlist({
      id: movieId,
      title,
      thumbnailUrl,
      genre,
      releaseYear,
    });
    setInWatchlist(newStatus);
  };

  return (
    <button
      type="button"
      onClick={toggleWatchlist}
      className={`inline-flex items-center gap-2 px-5 py-2.5 sm:px-6 sm:py-3 rounded-full text-xs sm:text-sm font-bold transition-all shadow-lg active:scale-95 cursor-pointer shrink-0 ${
        inWatchlist 
          ? "bg-slate-800 hover:bg-slate-700 text-rose-300 border border-rose-500/40 shadow-[0_0_15px_rgba(244,63,94,0.2)]" 
          : "bg-gradient-to-r from-rose-600 to-purple-600 hover:from-rose-500 hover:to-purple-500 text-white shadow-[0_0_20px_rgba(244,63,94,0.3)] hover:shadow-[0_0_30px_rgba(168,85,247,0.5)] border border-rose-500/20"
      }`}
    >
      {inWatchlist ? (
        <>
          <BookmarkCheck className="w-4 h-4 sm:w-5 sm:h-5 text-rose-400" />
          <span>In Watchlist</span>
        </>
      ) : (
        <>
          <Bookmark className="w-4 h-4 sm:w-5 sm:h-5" />
          <span>Add to Watchlist</span>
        </>
      )}
    </button>
  );
}
