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
      <main className="flex-grow max-w-7xl mx-auto w-full px-4 sm:px-6 lg:px-8 py-8 md:py-12">
        <h1 className="text-3xl font-bold text-white mb-8 flex items-center">
          <SearchIcon className="mr-3 text-rose-500 w-8 h-8" />
          {searchTerm ? `Search Results for "${searchTerm}"` : "Search Movies"}
        </h1>

        {/* Search Input */}
        <div className="mb-12 max-w-2xl">
          <div className="relative flex items-center">
            <SearchIcon className="absolute left-4 w-6 h-6 text-slate-400" />
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Search movies, genres..."
              className="w-full bg-slate-900 border border-purple-500/30 text-white px-12 py-4 rounded-full focus:outline-none focus:ring-2 focus:ring-rose-500 focus:border-transparent shadow-lg text-lg"
            />
          </div>
        </div>

        {!searchTerm ? (
          <div className="text-center text-slate-500 py-20 bg-slate-900/50 rounded-2xl border border-purple-500/20">
            <SearchIcon className="w-16 h-16 mx-auto mb-4 text-slate-600" />
            <p className="text-xl">Enter a search term to find movies or genres.</p>
          </div>
        ) : movies.length === 0 ? (
          <div className="text-center text-slate-500 py-20 bg-slate-900/50 rounded-2xl border border-purple-500/20">
            <Film className="w-16 h-16 mx-auto mb-4 text-slate-600" />
            <p className="text-xl">No movies found matching "{searchTerm}".</p>
            <p className="mt-2 text-slate-400">Try checking your spelling or searching for another term.</p>
          </div>
        ) : (
          <div>
            <p className="text-slate-400 mb-6">Found {movies.length} result{movies.length === 1 ? "" : "s"}</p>
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 md:gap-8">
              {movies.map((movie) => (
                <Link href={`/movie/${movie.id}`} key={movie.id} className="group cursor-pointer">
                  <div className="relative aspect-[2/3] bg-slate-900 rounded-2xl overflow-hidden border border-purple-900/30 transition-all duration-300 group-hover:scale-105 group-hover:shadow-[0_0_25px_rgba(244,63,94,0.3)] group-hover:border-rose-500/50">
                    {movie.thumbnailUrl ? (
                      <img src={movie.thumbnailUrl} alt={movie.title} className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110" />
                    ) : (
                      <div className="w-full h-full flex flex-col items-center justify-center bg-slate-900 p-4 text-center">
                        <Film className="w-12 h-12 text-slate-600 mb-2" />
                        <span className="text-slate-400 text-sm">{movie.title}</span>
                      </div>
                    )}
                    <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/20 to-transparent opacity-80" />
                    <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center backdrop-blur-[2px]">
                      <div className="bg-rose-600 rounded-full p-4 transform scale-50 group-hover:scale-100 transition-transform duration-300">
                        <Play className="w-8 h-8 text-white fill-current ml-1" />
                      </div>
                    </div>
                    <div className="absolute bottom-0 left-0 right-0 p-4 transform translate-y-2 group-hover:translate-y-0 transition-transform">
                      <div className="text-xs font-bold text-rose-400 mb-1 uppercase tracking-wider">{movie.genre}</div>
                      <h3 className="font-bold text-white text-lg leading-tight truncate drop-shadow-md">{movie.title}</h3>
                      <div className="text-sm text-slate-300 mt-1">{movie.releaseYear}</div>
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
