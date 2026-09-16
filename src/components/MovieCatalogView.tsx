"use client";

import { useState, useMemo, useEffect, useCallback } from "react";
import Link from "next/link";
import { Star, Play, Film, Search, Sparkles, Loader2, Plus, FilmIcon, ChevronDown, Clock, X } from "lucide-react";
import { getWatchHistory, clearWatchItem, formatTime, WatchItem } from "@/lib/watchProgress";

interface MovieItem {
  id: string;
  title: string;
  genre: string;
  releaseYear: number;
  videoUrl: string;
  thumbnailUrl: string;
  description: string;
  category?: string;
  voteAverage?: number;
  mediaType?: "movie" | "tv";
}

function getMovieRating(title: string, voteAverage?: number): string {
  if (voteAverage && voteAverage > 0) {
    return voteAverage.toFixed(1);
  }
  let hash = 0;
  for (let i = 0; i < title.length; i++) {
    hash = (hash * 31 + title.charCodeAt(i)) % 1000;
  }
  const rating = 7.5 + (Math.abs(hash) % 21) / 10;
  return rating.toFixed(1);
}

export default function MovieCatalogView({ movies }: { movies: MovieItem[] }) {
  const [activeCategory, setActiveCategory] = useState<string>("all");
  const [filterSearch, setFilterSearch] = useState<string>("");
  const [sortBy, setSortBy] = useState<"trending" | "year" | "title">("trending");

  // Track dynamically loaded extra movies per category from IMDb/TMDb
  const [extraMovies, setExtraMovies] = useState<Record<string, MovieItem[]>>({});
  const [categoryPages, setCategoryPages] = useState<Record<string, number>>({});
  const [loadingMore, setLoadingMore] = useState<boolean>(false);

  // Continue Watching list state
  const [continueWatchingList, setContinueWatchingList] = useState<WatchItem[]>([]);

  useEffect(() => {
    const history = getWatchHistory();
    const active = history.filter(
      (h) => h.currentTime > 10 && h.progressPercent < 95
    );
    setContinueWatchingList(active);
  }, []);

  const handleRemoveContinueWatching = (e: React.MouseEvent, item: WatchItem) => {
    e.preventDefault();
    e.stopPropagation();
    clearWatchItem(item.id, item.season, item.episode);
    setContinueWatchingList((prev) => prev.filter((i) => !(i.id === item.id && i.season === item.season && i.episode === item.episode)));
  };

  const categories = [
    { id: "all", label: "All Library", icon: "🎬" },
    { id: "imdb_trending", label: "IMDb Trending", icon: "🔥" },
    { id: "imdb_top", label: "Top Rated IMDb", icon: "⭐" },
    { id: "series", label: "TV Series & Shows", icon: "📺" },
    { id: "action", label: "Action & Marvel", icon: "💥" },
    { id: "scifi", label: "Sci-Fi Universe", icon: "🌌" },
    { id: "drama", label: "Drama & Hits", icon: "🎭" },
    { id: "horror", label: "Horror", icon: "👻" },
    { id: "comedy", label: "Comedy", icon: "😂" },
    { id: "romance", label: "Romance", icon: "💕" },
    { id: "arabic", label: "MENA Cinema", icon: "🌟" },
  ];

  // Load initial page of movies for dynamic categories if not loaded yet
  useEffect(() => {
    if (
      (activeCategory === "imdb_trending" || activeCategory === "imdb_top") &&
      !extraMovies[activeCategory]
    ) {
      setLoadingMore(true);
      fetch(`/api/discover?category=${activeCategory}&page=1`)
        .then((res) => res.json())
        .then((data) => {
          if (data.results) {
            setExtraMovies((prev) => ({ ...prev, [activeCategory]: data.results }));
            setCategoryPages((prev) => ({ ...prev, [activeCategory]: 1 }));
          }
        })
        .catch((err) => console.warn("Initial category fetch failed:", err))
        .finally(() => setLoadingMore(false));
    }
  }, [activeCategory, extraMovies]);

  // Handler to load next batch of films from IMDb/TMDb
  const handleLoadMore = useCallback(async () => {
    if (loadingMore) return;
    setLoadingMore(true);

    const currentPage = categoryPages[activeCategory] || 1;
    const nextPage = currentPage + 1;

    try {
      const res = await fetch(`/api/discover?category=${activeCategory}&page=${nextPage}`);
      const data = await res.json();
      if (data.results && data.results.length > 0) {
        setExtraMovies((prev) => {
          const currentList = prev[activeCategory] || [];
          const existingIds = new Set(currentList.map((m) => m.id));
          const newItems = data.results.filter((m: MovieItem) => !existingIds.has(m.id));
          return {
            ...prev,
            [activeCategory]: [...currentList, ...newItems],
          };
        });
        setCategoryPages((prev) => ({ ...prev, [activeCategory]: nextPage }));
      }
    } catch (err) {
      console.warn("Load more failed:", err);
    } finally {
      setLoadingMore(false);
    }
  }, [activeCategory, categoryPages, loadingMore]);

  const filteredMovies = useMemo(() => {
    // Base source: local curated movies
    let baseList: MovieItem[] = [];
    if (activeCategory === "imdb_trending" || activeCategory === "imdb_top") {
      baseList = [];
    } else {
      baseList = movies;
    }

    const dynamicallyLoaded = extraMovies[activeCategory] || [];

    // Merge base with dynamically loaded, avoiding duplicate IDs or titles
    const seenTitles = new Set<string>();
    const merged: MovieItem[] = [];

    for (const m of baseList) {
      const key = m.title.toLowerCase().trim();
      if (!seenTitles.has(key)) {
        seenTitles.add(key);
        merged.push(m);
      }
    }

    for (const m of dynamicallyLoaded) {
      const key = m.title.toLowerCase().trim();
      if (!seenTitles.has(key)) {
        seenTitles.add(key);
        merged.push(m);
      }
    }

    let list = merged.filter((m) => {
      const genre = m.genre.toLowerCase();
      const matchCat =
        activeCategory === "all" ||
        activeCategory === "imdb_trending" ||
        activeCategory === "imdb_top" ||
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
  }, [movies, activeCategory, filterSearch, sortBy, extraMovies]);

  return (
    <div className="space-y-6 sm:space-y-8">
      {/* Continue Watching Row (renders when user has unfinished titles) */}
      {continueWatchingList.length > 0 && (
        <div className="space-y-3 sm:space-y-4 bg-slate-900/50 p-4 sm:p-5 rounded-2xl sm:rounded-3xl border border-rose-500/30 backdrop-blur-xl">
          <div className="flex items-center justify-between">
            <h3 className="text-base sm:text-xl font-bold text-white flex items-center space-x-2">
              <Clock className="w-4 sm:w-5 h-4 sm:h-5 text-rose-400 animate-pulse" />
              <span>Continue Watching</span>
              <span className="bg-rose-500/20 text-rose-300 text-xs px-2 py-0.5 rounded-full font-bold">
                {continueWatchingList.length}
              </span>
            </h3>
          </div>

          <div className="flex items-center gap-3.5 overflow-x-auto pb-2 scrollbar-none touch-pan-x">
            {continueWatchingList.map((item) => {
              const url = item.season && item.episode 
                ? `/movie/${item.id}?season=${item.season}&episode=${item.episode}`
                : `/movie/${item.id}`;
              return (
                <div
                  key={`${item.id}-${item.season}-${item.episode}`}
                  className="group relative flex-none w-48 sm:w-56 bg-slate-950 rounded-2xl overflow-hidden border border-purple-900/40 shadow-lg hover:border-rose-500/50 transition-all duration-300"
                >
                  <Link href={url} className="block relative aspect-video w-full overflow-hidden bg-slate-900">
                    {item.thumbnailUrl ? (
                      <img
                        src={item.thumbnailUrl}
                        alt={item.title}
                        loading="lazy"
                        className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                      />
                    ) : (
                      <div className="w-full h-full flex flex-col items-center justify-center p-3 text-center">
                        <Film className="w-8 h-8 text-purple-900/50 mb-1" />
                        <span className="text-purple-300/50 text-[10px]">{item.title}</span>
                      </div>
                    )}
                    <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/20 to-transparent" />
                    
                    {/* Play Overlay */}
                    <div className="absolute inset-0 flex items-center justify-center opacity-90 sm:opacity-0 group-hover:opacity-100 transition-opacity">
                      <div className="bg-gradient-to-r from-rose-600 to-purple-600 rounded-full p-2.5 shadow-lg scale-90 sm:scale-100">
                        <Play className="w-4 h-4 text-white fill-current ml-0.5" />
                      </div>
                    </div>

                    {/* Progress Bar Overlay */}
                    <div className="absolute bottom-0 left-0 right-0 h-1.5 bg-slate-800">
                      <div
                        className="h-full bg-gradient-to-r from-rose-500 to-purple-500 transition-all"
                        style={{ width: `${item.progressPercent}%` }}
                      />
                    </div>

                    {/* Season / Episode Badge */}
                    {item.season && item.episode && (
                      <div className="absolute top-2 left-2 bg-slate-900/90 text-rose-300 text-[10px] font-bold px-2 py-0.5 rounded-md border border-rose-500/30">
                        S{item.season} E{item.episode}
                      </div>
                    )}

                    {/* Delete item button */}
                    <button
                      type="button"
                      onClick={(e) => handleRemoveContinueWatching(e, item)}
                      className="absolute top-2 right-2 p-1 bg-slate-900/80 hover:bg-rose-900/90 text-slate-400 hover:text-white rounded-full transition-colors"
                      title="Remove from Continue Watching"
                    >
                      <X className="w-3.5 h-3.5" />
                    </button>
                  </Link>

                  <div className="p-2.5 sm:p-3 space-y-1">
                    <h4 className="text-white text-xs font-bold truncate group-hover:text-rose-200">
                      {item.title}
                    </h4>
                    <div className="flex items-center justify-between text-[10px] text-slate-400">
                      <span>{formatTime(item.currentTime)} watched</span>
                      <span className="text-rose-400 font-bold">{item.progressPercent}%</span>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

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
                className={`flex items-center space-x-1.5 px-3 sm:px-4 py-2 sm:py-2.5 rounded-xl text-xs font-bold whitespace-nowrap transition-all min-h-[38px] cursor-pointer ${
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

      {/* Quick Search Deep Link Banner */}
      {filterSearch.trim().length > 1 && (
        <div className="flex items-center justify-between bg-gradient-to-r from-rose-950/40 via-purple-950/40 to-slate-950/40 border border-rose-500/30 p-3 sm:p-4 rounded-xl sm:rounded-2xl backdrop-blur-md">
          <div className="flex items-center space-x-2 text-white text-xs sm:text-sm">
            <Sparkles className="w-4 h-4 text-rose-400 shrink-0" />
            <span>
              Looking for more results matching <strong className="text-rose-300">"{filterSearch}"</strong>?
            </span>
          </div>
          <Link
            href={`/search?q=${encodeURIComponent(filterSearch.trim())}`}
            className="bg-gradient-to-r from-rose-600 to-purple-600 hover:from-rose-500 hover:to-purple-500 text-white text-xs font-bold px-3 py-1.5 rounded-lg flex items-center space-x-1 shrink-0 shadow transition-all hover:scale-105"
          >
            <Search className="w-3.5 h-3.5" />
            <span>Search Entire IMDb Library</span>
          </Link>
        </div>
      )}

      {/* Library Stats Badge */}
      <div className="flex items-center justify-between px-1 text-xs text-slate-400">
        <span className="flex items-center gap-1.5">
          <FilmIcon className="w-3.5 h-3.5 text-rose-400" />
          <span>
            Showing <strong className="text-white font-semibold">{filteredMovies.length}</strong> titles
          </span>
        </span>
        <span className="text-[11px] text-purple-300/60 hidden sm:inline">
          Connected to global IMDb & TMDb library (millions of titles streamable in 1080p)
        </span>
      </div>

      {/* Movies Grid */}
      {filteredMovies.length === 0 && !loadingMore ? (
        <div className="text-center text-purple-300 py-16 sm:py-24 bg-slate-900/30 backdrop-blur-sm rounded-2xl sm:rounded-3xl border border-purple-900/30">
          <Film className="w-10 sm:w-14 h-10 sm:h-14 mx-auto mb-3 text-purple-500/40 animate-pulse" />
          <h3 className="text-lg sm:text-xl font-bold text-white mb-1">No movies found in this view</h3>
          <p className="text-xs sm:text-sm text-slate-400 mb-4">
            Try searching across the millions of titles in the global IMDb database.
          </p>
          {filterSearch.trim() && (
            <Link
              href={`/search?q=${encodeURIComponent(filterSearch.trim())}`}
              className="inline-flex items-center space-x-1.5 bg-gradient-to-r from-rose-600 to-purple-600 text-white text-xs font-bold px-4 py-2 rounded-xl shadow hover:scale-105 transition-all"
            >
              <Search className="w-3.5 h-3.5" />
              <span>Search IMDb for "{filterSearch}"</span>
            </Link>
          )}
        </div>
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-3 sm:gap-5 md:gap-6">
          {filteredMovies.map((movie) => {
            const rating = getMovieRating(movie.title, movie.voteAverage);
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
                      {movie.mediaType === "tv" ? "SERIES" : "4K UHD"}
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
                    <h3 className="font-bold text-white text-xs sm:text-sm md:text-base leading-tight drop-shadow-md line-clamp-2">
                      {movie.title}
                    </h3>
                    <div className="text-[10px] sm:text-xs text-purple-200/60 font-semibold mt-0.5">
                      {movie.releaseYear}
                    </div>
                  </div>
                </div>
              </Link>
            );
          })}
        </div>
      )}

      {/* Infinite "Load More Films from IMDb" Button */}
      <div className="flex flex-col items-center justify-center pt-6 sm:pt-10 pb-4">
        <button
          type="button"
          onClick={handleLoadMore}
          disabled={loadingMore}
          className="group relative inline-flex items-center justify-center gap-2.5 px-8 py-3.5 sm:py-4 rounded-full font-bold text-sm sm:text-base text-white bg-gradient-to-r from-rose-600 via-purple-600 to-rose-600 bg-[length:200%_auto] hover:bg-[position:right_center] transition-all duration-500 shadow-[0_0_30px_rgba(244,63,94,0.3)] hover:shadow-[0_0_40px_rgba(244,63,94,0.5)] hover:scale-105 active:scale-95 disabled:opacity-50 cursor-pointer border border-white/10"
        >
          {loadingMore ? (
            <>
              <Loader2 className="w-4 sm:w-5 h-4 sm:h-5 animate-spin" />
              <span>Loading More Films from IMDb...</span>
            </>
          ) : (
            <>
              <Plus className="w-4 sm:w-5 h-4 sm:h-5 transition-transform group-hover:rotate-90" />
              <span>Load More Films from IMDb & TMDb</span>
            </>
          )}
        </button>
        <p className="text-[11px] sm:text-xs text-slate-500 mt-2">
          Click to continuously expand your library with thousands of titles
        </p>
      </div>
    </div>
  );
}
