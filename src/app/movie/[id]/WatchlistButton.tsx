"use client";
import { useState } from "react";
import { Bookmark, BookmarkCheck } from "lucide-react";
import { useRouter } from "next/navigation";

export default function WatchlistButton({ movieId, initialStatus }: { movieId: string; initialStatus: boolean }) {
  const [inWatchlist, setInWatchlist] = useState(initialStatus);
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const toggleWatchlist = async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/watchlist", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ movieId, action: inWatchlist ? "remove" : "add" }),
      });

      if (res.ok) {
        setInWatchlist(!inWatchlist);
        router.refresh(); // Refresh to update server components
      }
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <button
      onClick={toggleWatchlist}
      disabled={loading}
      className={`flex items-center gap-2 px-6 py-3 rounded-full font-bold transition-all shadow-lg ${
        inWatchlist 
          ? "bg-slate-800 hover:bg-slate-700 text-purple-200 border border-purple-500/30 shadow-[0_0_15px_rgba(139,92,246,0.15)]" 
          : "bg-gradient-to-r from-rose-600 to-purple-600 hover:from-rose-500 hover:to-purple-500 text-white shadow-[0_0_20px_rgba(244,63,94,0.3)] hover:shadow-[0_0_30px_rgba(168,85,247,0.5)] border border-rose-500/20"
      }`}
    >
      {inWatchlist ? (
        <>
          <BookmarkCheck className="w-5 h-5" />
          In Watchlist
        </>
      ) : (
        <>
          <Bookmark className="w-5 h-5" />
          Add to Watchlist
        </>
      )}
    </button>
  );
}
