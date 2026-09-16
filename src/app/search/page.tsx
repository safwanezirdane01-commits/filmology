"use client";

import { Suspense, useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
import { Play, Film, Search as SearchIcon, Sparkles, Tv, Star, Loader2 } from "lucide-react";
import { CURATED_CATALOG } from "@/lib/catalog";

interface SearchMovieItem {
  id: string;
  title: string;
  genre: string;
  releaseYear: number;
  videoUrl?: string;
  thumbnailUrl: string;
  description?: string;
  mediaType?: "movie" | "tv";
  voteAverage?: number;
}

function SearchContent() {
  const searchParams = useSearchParams();
  const qParam = searchParams.get("q") || "";
  const [searchTerm, setSearchTerm] = useState(qParam);
  const [results, setResults] = useState<SearchMovieItem[]>([]);
  const [trending, setTrending] = useState<SearchMovieItem[]>([]);
  const [loading, setLoading] = useState(false);

  // Initial load: trending movies from IMDb / TMDb
  useEffect(() => {
    fetch("/api/discover?type=trending")
      .then((res) => res.json())
      .then((data) => {
        if (data.results) setTrending(data.results);
      })
      .catch((err) => console.warn("Trending fetch failed:", err));
  }, []);

  // Debounced search across entire IMDb / TMDb database
  useEffect(() => {
    const query = searchTerm.trim();
    if (!query) {
      setResults([]);
      setLoading(false);
      return;
    }

    // Instant local matches first for zero-lag UI
    const qLower = query.toLowerCase();
    const local = CURATED_CATALOG.filter(
      (m) =>
        m.title.toLowerCase().includes(qLower) ||
        m.genre.toLowerCase().includes(qLower)
    ).map((m) => ({
      id: m.id,
      title: m.title,
      genre: m.genre,
      releaseYear: m.releaseYear,
      thumbnailUrl: m.thumbnailUrl,
      mediaType: (m.category === "series" || /series|tv/i.test(m.genre) ? "tv" : "movie") as "movie" | "tv",
    }));
    setResults(local);

    setLoading(true);
    const timeout = setTimeout(() => {
      fetch(`/api/search?q=${encodeURIComponent(query)}`)
        .then((res) => res.json())
        .then((data) => {
          if (data.results && data.results.length > 0) {
            setResults(data.results);
          }
        })
        .catch((err) => console.warn("Search fetch failed:", err))
        .finally(() => setLoading(false));
    }, 350);

    return () => clearTimeout(timeout);
  }, [searchTerm]);

  const displayList = searchTerm.trim() ? results : trending;

  return (
    <div className="flex flex-col min-h-screen">
      <main className="flex-grow max-w-7xl mx-auto w-full px-3 sm:px-6 lg:px-8 py-4 sm:py-8 md:py-12">
        {/* Header */}
        <div className="mb-4 sm:mb-8">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-rose-500/10 border border-rose-500/20 text-rose-300 text-xs font-semibold mb-3">
            <Sparkles className="w-3.5 h-3.5 text-rose-400" />
            <span>Universal IMDb & TMDb Library</span>
          </div>
          <h1 className="text-2xl sm:text-4xl font-extrabold text-white flex items-center gap-2">
            <SearchIcon className="text-rose-500 w-6 sm:w-8 h-6 sm:h-8" />
            <span>{searchTerm ? `Results for "${searchTerm}"` : "Search Any Film or Series"}</span>
          </h1>
          <p className="text-slate-400 text-xs sm:text-sm mt-1">
            Search millions of movies and TV shows from IMDb & TMDb with instant 1080p streaming.
          </p>
        </div>

        {/* Search Input */}
        <div className="mb-6 sm:mb-10 max-w-2xl">
          <div className="relative flex items-center">
            <SearchIcon className="absolute left-3.5 sm:left-4 w-4 sm:w-5 h-4 sm:h-5 text-slate-400" />
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Search by movie title, IMDb ID, TV series, actor..."
              className="w-full bg-slate-900/90 border border-purple-500/30 text-white pl-10 sm:pl-12 pr-10 py-3 sm:py-3.5 rounded-2xl focus:outline-none focus:ring-2 focus:ring-rose-500 focus:border-transparent shadow-lg text-sm sm:text-base backdrop-blur-md"
            />
            {loading && (
              <Loader2 className="absolute right-3.5 sm:right-4 w-4 sm:w-5 h-4 sm:h-5 text-rose-400 animate-spin" />
            )}
          </div>
        </div>

        {/* Status indicator */}
        <div className="flex items-center justify-between mb-4 sm:mb-6">
          <div className="text-xs sm:text-sm text-slate-400">
            {searchTerm.trim() ? (
              <span>
                Found <strong className="text-white">{results.length}</strong> title{results.length === 1 ? "" : "s"} across IMDb & TMDb
              </span>
            ) : (
              <span className="flex items-center gap-1.5 text-slate-300 font-medium">
                <Star className="w-3.5 h-3.5 text-amber-400 fill-amber-400" />
                <span>Trending Worldwide on IMDb</span>
              </span>
            )}
          </div>
        </div>

        {/* Results Grid */}
        {displayList.length === 0 && !loading ? (
          <div className="text-center text-slate-500 py-12 sm:py-20 bg-slate-900/40 rounded-2xl border border-purple-500/20 px-4">
            <Film className="w-12 sm:w-16 h-12 sm:h-16 mx-auto mb-3 sm:mb-4 text-slate-600" />
            <p className="text-base sm:text-xl text-white font-medium">No results found for "{searchTerm}".</p>
            <p className="mt-1 text-xs sm:text-sm text-slate-400">
              Try searching by the original English title, actor, or TMDb/IMDb ID (e.g. tt0816692).
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3 sm:gap-6">
            {displayList.map((movie) => (
              <Link href={`/movie/${movie.id}`} key={movie.id} className="group cursor-pointer">
                <div className="relative aspect-[2/3] bg-slate-900 rounded-xl sm:rounded-2xl overflow-hidden border border-purple-900/30 transition-all duration-300 group-hover:scale-105 group-hover:shadow-[0_0_25px_rgba(244,63,94,0.3)] group-hover:border-rose-500/50">
                  {movie.thumbnailUrl ? (
                    <img
                      src={movie.thumbnailUrl}
                      alt={movie.title}
                      loading="lazy"
                      className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                    />
                  ) : (
                    <div className="w-full h-full flex flex-col items-center justify-center bg-slate-900 p-3 text-center">
                      <Film className="w-8 h-8 text-slate-600 mb-1" />
                      <span className="text-slate-400 text-xs">{movie.title}</span>
                    </div>
                  )}

                  {/* Type Badge (Series vs Movie) */}
                  <div className="absolute top-2 left-2 z-10">
                    <span
                      className={`px-2 py-0.5 rounded-md text-[10px] font-bold uppercase tracking-wider shadow-sm flex items-center gap-1 ${
                        movie.mediaType === "tv"
                          ? "bg-purple-600/90 text-white"
                          : "bg-rose-600/90 text-white"
                      }`}
                    >
                      {movie.mediaType === "tv" ? <Tv className="w-2.5 h-2.5" /> : null}
                      <span>{movie.mediaType === "tv" ? "Series" : "Movie"}</span>
                    </span>
                  </div>

                  {/* Gradient Overlay */}
                  <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/20 to-transparent opacity-85" />

                  {/* Hover Play Button */}
                  <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center backdrop-blur-[2px]">
                    <div className="bg-rose-600 rounded-full p-3 sm:p-4 transform scale-75 group-hover:scale-100 transition-transform duration-300 shadow-lg">
                      <Play className="w-6 sm:w-8 h-6 sm:h-8 text-white fill-current ml-0.5 sm:ml-1" />
                    </div>
                  </div>

                  {/* Bottom Movie Details */}
                  <div className="absolute bottom-0 left-0 right-0 p-2.5 sm:p-4 transform translate-y-1 group-hover:translate-y-0 transition-transform">
                    <div className="text-[9px] sm:text-xs font-bold text-rose-400 mb-0.5 uppercase tracking-wider">
                      {movie.genre}
                    </div>
                    <h3 className="font-bold text-white text-xs sm:text-base leading-tight truncate drop-shadow-md">
                      {movie.title}
                    </h3>
                    <div className="flex items-center justify-between text-[10px] sm:text-xs text-slate-300 mt-0.5 sm:mt-1">
                      <span>{movie.releaseYear || 2024}</span>
                      {movie.voteAverage ? (
                        <span className="flex items-center gap-0.5 text-amber-300 font-semibold">
                          <Star className="w-2.5 h-2.5 fill-amber-400" />
                          <span>{movie.voteAverage}</span>
                        </span>
                      ) : null}
                    </div>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        )}
      </main>
    </div>
  );
}

export default function SearchPage() {
  return (
    <Suspense fallback={<div className="text-center py-20 text-slate-400">Loading universal search...</div>}>
      <SearchContent />
    </Suspense>
  );
}
