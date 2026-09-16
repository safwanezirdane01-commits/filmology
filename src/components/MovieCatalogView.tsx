"use client";

import { useState, useMemo } from "react";
import Link from "next/link";
import { Play, Film, Star, Sparkles, SlidersHorizontal, Eye } from "lucide-react";

export interface MovieItem {
  id: string;
  title: string;
  genre: string;
  releaseYear: number;
  thumbnailUrl: string | null;
  description: string;
}

// Generate realistic rating from title hash
function getMovieRating(title: string): string {
  let hash = 0;
  for (let i = 0; i < title.length; i++) {
    hash = (hash << 5) - hash + title.charCodeAt(i);
    hash |= 0;
  }
  const rating = 7.5 + (Math.abs(hash) % 20) / 10;
  return Math.min(9.4, rating).toFixed(1);
}

export default function MovieCatalogView({ movies }: { movies: MovieItem[] }) {
  const [activeCategory, setActiveCategory] = useState<string>("all");
  const [filterSearch, setFilterSearch] = useState<string>("");
  const [sortBy, setSortBy] = useState<"trending" | "year" | "title">("trending");

  const categories = [
    { id: "all", label: "All Library", icon: "🎬" },
    { id: "series", label: "TV Series & Shows", icon: "📺" },
    { id: "action", label: "Action & Marvel", icon: "💥" },
    { id: "scifi", label: "Sci-Fi Universe", icon: "🌌" },
    { id: "animation", label: "Animation", icon: "🎨" },
    { id: "drama", label: "Drama & Hits", icon: "🎭" },
    { id: "horror", label: "Horror", icon: "👻" },
    { id: "comedy", label: "Comedy", icon: "😂" },
    { id: "romance", label: "Romance", icon: "💕" },
    { id: "arabic", label: "MENA Cinema", icon: "🌟" },
  ];

  const filteredMovies = useMemo(() => {
    let list = movies.filter((m) => {
      const genre = m.genre.toLowerCase();
      const matchCat =
        activeCategory === "all" ||
        (activeCategory === "series"
          ? /series|tv/i.test(m.genre)
          : activeCategory === "arabic"
          ? /arabic|mena|egyptian|lebanese|jordanian|palestinian/i.test(m.genre)
          : activeCategory === "comedy"
          ? genre.includes("comedy")
          : activeCategory === "romance"
          ? genre.includes("romance")
          : genre.includes(activeCategory.toLowerCase()));
      const matchQuery =
        !filterSearch.trim() ||
        m.title.toLowerCase().includes(filterSearch.toLowerCase()) ||
        m.genre.toLowerCase().includes(filterSearch.toLowerCase()) ||
        m.description.toLowerCase().includes(filterSearch.toLowerCase());
      return matchCat && matchQuery;
    });

    if (sortBy === "year") {
      list = [...list].sort((a, b) => b.releaseYear - a.releaseYear);
    } else if (sortBy === "title") {
      list = [...list].sort((a, b) => a.title.localeCompare(b.title));
    }

    return list;
  }, [movies, activeCategory, filterSearch, sortBy]);

  return (
    <div className="space-y-6 sm:space-y-8">
      {/* Category Pills & Controls Bar */}
      <div className="flex flex-col md:flex-row items-stretch md:items-center justify-between gap-3 bg-slate-900/40 p-2.5 sm:p-4 rounded-xl sm:rounded-2xl border border-purple-900/30 backdrop-blur-xl">
        {/* Category Pills with smooth horizontal scrolling */}
        <div className="flex items-center gap-1.5 overflow-x-auto w-full md:w-auto pb-1 md:pb-0 scrollbar-none touch-pan-x">
          {categories.map((cat) => {
            const isActive = activeCategory === cat.id;
            return (
              <button
                key={cat.id}
                type="button"
                onClick={() => setActiveCategory(cat.id)}
                className={`flex items-center space-x-1.5 px-3 sm:px-4 py-2 sm:py-2.5 rounded-xl text-xs font-bold whitespace-nowrap transition-all min-h-[38px] ${
                  isActive
                    ? "bg-gradient-to-r from-rose-600 to-purple-600 text-white shadow-lg shadow-rose-500/25 scale-[1.02]"
                    : "bg-slate-800/60 text-purple-200/80 hover:bg-slate-800 hover:text-white border border-purple-500/10"
                }`}
              >
                <span>{cat.icon}</span>
                <span>{cat.label}</span>
              </button>
            );
          })}
        </div>

        {/* Quick Search & Sort Filters */}
        <div className="flex items-center gap-2 w-full md:w-auto justify-between md:justify-end">
          <input
            type="text"
            value={filterSearch}
            onChange={(e) => setFilterSearch(e.target.value)}
            placeholder="Quick filter..."
            className="bg-slate-950/80 border border-purple-500/20 text-white text-xs px-3 py-2 rounded-xl focus:outline-none focus:border-rose-500 flex-1 sm:w-44 transition-all"
          />
          <select
            value={sortBy}
            onChange={(e: any) => setSortBy(e.target.value)}
            className="bg-slate-950/80 border border-purple-500/20 text-purple-200 text-xs px-2.5 py-2 rounded-xl focus:outline-none focus:border-rose-500 cursor-pointer shrink-0"
          >
            <option value="trending">🔥 Trending</option>
            <option value="year">📅 Year</option>
            <option value="title">🔤 Title</option>
          </select>
        </div>
      </div>

      {/* Movies Grid */}
      {filteredMovies.length === 0 ? (
        <div className="text-center text-purple-300 py-16 sm:py-24 bg-slate-900/30 backdrop-blur-sm rounded-2xl sm:rounded-3xl border border-purple-900/30">
          <Film className="w-10 sm:w-14 h-10 sm:h-14 mx-auto mb-3 text-purple-500/40 animate-pulse" />
          <h3 className="text-lg sm:text-xl font-bold text-white mb-1">No movies found</h3>
          <p className="text-xs sm:text-sm text-slate-400">Try selecting another genre or clearing your filter search.</p>
        </div>
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-3 sm:gap-5 md:gap-6">
          {filteredMovies.map((movie) => {
            const rating = getMovieRating(movie.title);
            return (
              <Link
                href={`/movie/${movie.id}`}
                key={movie.id}
                className="group relative flex flex-col cursor-pointer"
              >
                {/* Poster Container */}
                <div className="relative aspect-[2/3] bg-slate-900 rounded-xl sm:rounded-2xl overflow-hidden border border-purple-900/30 transition-all duration-300 group-hover:-translate-y-1.5 group-hover:shadow-[0_15px_30px_rgba(244,63,94,0.25)] group-hover:border-rose-500/50">
                  {movie.thumbnailUrl ? (
                    <img
                      src={movie.thumbnailUrl}
                      alt={movie.title}
                      loading="lazy"
                      className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                    />
                  ) : (
                    <div className="w-full h-full flex flex-col items-center justify-center bg-slate-900 p-3 text-center">
                      <Film className="w-8 h-8 text-purple-900/50 mb-1" />
                      <span className="text-purple-300/50 text-[10px] font-medium">{movie.title}</span>
                    </div>
                  )}

                  {/* Gradient Overlay */}
                  <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/20 to-transparent opacity-85 group-hover:opacity-90 transition-opacity" />

                  {/* Top Badges */}
                  <div className="absolute top-2 sm:top-2.5 left-2 sm:left-2.5 right-2 sm:right-2.5 flex items-center justify-between z-10">
                    <span className="inline-flex items-center space-x-1 bg-slate-950/85 backdrop-blur-md px-1.5 sm:px-2 py-0.5 rounded-md text-[9px] sm:text-[10px] font-bold text-amber-300 border border-amber-500/20 shadow">
                      <Star className="w-2.5 sm:w-3 h-2.5 sm:h-3 fill-current text-amber-400" />
                      <span>{rating}</span>
                    </span>
                    <span className="bg-gradient-to-r from-rose-600/90 to-purple-600/90 backdrop-blur-md px-1 sm:px-1.5 py-0.5 rounded text-[8px] sm:text-[9px] font-extrabold uppercase tracking-wider text-white shadow-sm">
                      4K UHD
                    </span>
                  </div>

                  {/* Play Button Overlay */}
                  <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-300 backdrop-blur-[2px] bg-slate-950/40">
                    <div className="bg-gradient-to-r from-rose-600 to-purple-600 rounded-full p-3 sm:p-4 transform scale-75 group-hover:scale-100 transition-all duration-300 shadow-[0_0_25px_rgba(244,63,94,0.6)]">
                      <Play className="w-5 sm:w-6 h-5 sm:h-6 text-white fill-current ml-0.5" />
                    </div>
                  </div>

                  {/* Bottom Poster Info Overlay */}
                  <div className="absolute bottom-0 left-0 right-0 p-2.5 sm:p-3.5">
                    <div className="text-[9px] sm:text-[10px] font-bold text-rose-400 mb-0.5 uppercase tracking-wider line-clamp-1">
                      {movie.genre}
                    </div>
                    <h3 className="font-bold text-slate-100 text-xs sm:text-sm leading-snug truncate drop-shadow-md group-hover:text-rose-200 transition-colors">
                      {movie.title}
                    </h3>
                    <div className="flex items-center space-x-1.5 sm:space-x-2 text-[10px] sm:text-[11px] text-purple-300/70 font-medium mt-0.5 sm:mt-1">
                      <span>{movie.releaseYear}</span>
                      <span>•</span>
                      <span className="flex items-center space-x-0.5 text-slate-400">
                        <Eye className="w-2.5 sm:w-3 h-2.5 sm:h-3 text-purple-400" />
                        <span>Free</span>
                      </span>
                    </div>
                  </div>
                </div>
              </Link>
            );
          })}
        </div>
      )}
    </div>
  );
}
