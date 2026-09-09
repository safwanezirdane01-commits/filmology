"use client";

import { Suspense, useMemo, useState } from "react";
import { useSearchParams } from "next/navigation";
import { CURATED_CATALOG } from "@/lib/catalog";
import Link from "next/link";
import { Play, Film, Search as SearchIcon } from "lucide-react";

function SearchContent() {
  const searchParams = useSearchParams();
  const qParam = searchParams.get("q") || "";
  const [searchTerm, setSearchTerm] = useState(qParam);

  const movies = useMemo(() => {
    const query = searchTerm.trim().toLowerCase();
    if (!query) return [];
    return CURATED_CATALOG.filter(
      (m) =>
        m.title.toLowerCase().includes(query) ||
        m.genre.toLowerCase().includes(query)
    );
  }, [searchTerm]);

  return (
    <div className="flex flex-col min-h-screen">
      <main className="flex-grow max-w-7xl mx-auto w-full px-3 sm:px-6 lg:px-8 py-4 sm:py-8 md:py-12">
        <h1 className="text-2xl sm:text-3xl font-bold text-white mb-4 sm:mb-8 flex items-center">
          <SearchIcon className="mr-2 sm:mr-3 text-rose-500 w-6 sm:w-8 h-6 sm:h-8" />
          {searchTerm ? `Search Results for "${searchTerm}"` : "Search Movies"}
        </h1>

        {/* Search Input */}
        <div className="mb-6 sm:mb-12 max-w-2xl">
          <div className="relative flex items-center">
            <SearchIcon className="absolute left-3.5 sm:left-4 w-4 sm:w-5 h-4 sm:h-5 text-slate-400" />
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Search movies, genres..."
              className="w-full bg-slate-900 border border-purple-500/30 text-white pl-10 sm:pl-12 pr-4 py-3 sm:py-4 rounded-full focus:outline-none focus:ring-2 focus:ring-rose-500 focus:border-transparent shadow-lg text-sm sm:text-lg"
            />
          </div>
        </div>

        {!searchTerm ? (
          <div className="text-center text-slate-500 py-12 sm:py-20 bg-slate-900/50 rounded-2xl border border-purple-500/20 px-4">
            <SearchIcon className="w-12 sm:w-16 h-12 sm:h-16 mx-auto mb-3 sm:mb-4 text-slate-600" />
            <p className="text-base sm:text-xl">Enter a search term to find movies or genres.</p>
          </div>
        ) : movies.length === 0 ? (
          <div className="text-center text-slate-500 py-12 sm:py-20 bg-slate-900/50 rounded-2xl border border-purple-500/20 px-4">
            <Film className="w-12 sm:w-16 h-12 sm:h-16 mx-auto mb-3 sm:mb-4 text-slate-600" />
            <p className="text-base sm:text-xl">No movies found matching "{searchTerm}".</p>
            <p className="mt-2 text-xs sm:text-sm text-slate-400">Try checking your spelling or searching for another term.</p>
          </div>
        ) : (
          <div>
            <p className="text-slate-400 text-xs sm:text-sm mb-4 sm:mb-6">Found {movies.length} result{movies.length === 1 ? "" : "s"}</p>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3 sm:gap-6">
              {movies.map((movie) => (
                <Link href={`/movie/${movie.id}`} key={movie.id} className="group cursor-pointer">
                  <div className="relative aspect-[2/3] bg-slate-900 rounded-xl sm:rounded-2xl overflow-hidden border border-purple-900/30 transition-all duration-300 group-hover:scale-105 group-hover:shadow-[0_0_25px_rgba(244,63,94,0.3)] group-hover:border-rose-500/50">
                    {movie.thumbnailUrl ? (
                      <img src={movie.thumbnailUrl} alt={movie.title} className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110" />
                    ) : (
                      <div className="w-full h-full flex flex-col items-center justify-center bg-slate-900 p-3 text-center">
                        <Film className="w-8 h-8 text-slate-600 mb-1" />
                        <span className="text-slate-400 text-xs">{movie.title}</span>
                      </div>
                    )}
                    <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/20 to-transparent opacity-80" />
                    <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center backdrop-blur-[2px]">
                      <div className="bg-rose-600 rounded-full p-3 sm:p-4 transform scale-75 group-hover:scale-100 transition-transform duration-300">
                        <Play className="w-6 sm:w-8 h-6 sm:h-8 text-white fill-current ml-0.5 sm:ml-1" />
                      </div>
                    </div>
                    <div className="absolute bottom-0 left-0 right-0 p-2.5 sm:p-4 transform translate-y-1 group-hover:translate-y-0 transition-transform">
                      <div className="text-[9px] sm:text-xs font-bold text-rose-400 mb-0.5 uppercase tracking-wider">{movie.genre}</div>
                      <h3 className="font-bold text-white text-xs sm:text-base leading-tight truncate drop-shadow-md">{movie.title}</h3>
                      <div className="text-[10px] sm:text-xs text-slate-300 mt-0.5 sm:mt-1">{movie.releaseYear}</div>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        )}
      </main>
    </div>
  );
}

export default function SearchPage() {
  return (
    <Suspense fallback={<div className="text-center py-20 text-slate-400">Loading search...</div>}>
      <SearchContent />
    </Suspense>
  );
}
