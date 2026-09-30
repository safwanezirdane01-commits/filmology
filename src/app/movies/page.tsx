import { Metadata } from "next";
import Link from "next/link";
import { discoverByFilter, UniversalItem } from "@/lib/tmdb";
import { Film, Star, Play, ChevronLeft, ChevronRight, Clapperboard, Filter } from "lucide-react";

export const metadata: Metadata = {
  title: "Watch Movies Free in 1080p Full HD | FilmologyX",
  description: "Browse thousands of free movies across action, horror, comedy, sci-fi and romance in HD quality.",
};

const GENRES = [
  { id: "all", label: "All Movies" },
  { id: "action", label: "Action" },
  { id: "scifi", label: "Sci-Fi" },
  { id: "horror", label: "Horror" },
  { id: "comedy", label: "Comedy" },
  { id: "drama", label: "Drama" },
  { id: "romance", label: "Romance" },
  { id: "imdb_trending", label: "Trending" },
  { id: "imdb_top", label: "Top Rated" },
];

export default async function MoviesPage({
  searchParams,
}: {
  searchParams: Promise<{ genre?: string; page?: string }>;
}) {
  const { genre = "all", page = "1" } = await searchParams;
  const currentPage = Math.max(1, parseInt(page, 10) || 1);
  const activeGenre = GENRES.some((g) => g.id === genre) ? genre : "all";

  const movies: UniversalItem[] = await discoverByFilter(activeGenre, currentPage);

  return (
    <div className="space-y-6 sm:space-y-8 pb-16">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 border-b border-purple-900/30 pb-5">
        <div>
          <div className="flex items-center space-x-2 text-rose-400 text-xs font-bold uppercase tracking-wider mb-1">
            <Clapperboard className="w-4 h-4" />
            <span>Movies Catalog</span>
          </div>
          <h1 className="text-2xl sm:text-4xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-white via-rose-100 to-purple-200 tracking-tight">
            Explore Free Movies
          </h1>
          <p className="text-slate-400 text-xs sm:text-sm mt-1">
            Stream blockbuster movies and cinema classics in 1080p with multi-server failover.
          </p>
        </div>

        <div className="flex items-center space-x-2 bg-slate-900 border border-purple-500/20 px-3.5 py-1.5 rounded-full text-xs font-semibold text-purple-300">
          <Film className="w-3.5 h-3.5 text-rose-400" />
          <span>Page {currentPage}</span>
        </div>
      </div>

      {/* Genre Filter Pills */}
      <div className="flex items-center space-x-2 overflow-x-auto pb-2 scrollbar-none contain-paint">
        <div className="flex items-center space-x-1.5 text-slate-400 text-xs font-semibold shrink-0 pr-1">
          <Filter className="w-3.5 h-3.5 text-rose-400" />
          <span className="hidden sm:inline">Genre:</span>
        </div>
        {GENRES.map((g) => (
          <Link
            key={g.id}
            href={`/movies?genre=${g.id}&page=1`}
            className={`px-3.5 py-1.5 rounded-full text-xs font-bold transition-all shrink-0 active:scale-95 ${
              activeGenre === g.id
                ? "bg-gradient-to-r from-rose-600 to-purple-600 text-white shadow-md shadow-rose-600/30"
                : "bg-slate-900/80 hover:bg-slate-800 text-slate-300 border border-purple-500/20"
            }`}
          >
            {g.label}
          </Link>
        ))}
      </div>

      {/* Movies Grid */}
      {movies.length > 0 ? (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3 sm:gap-5">
          {movies.map((movie) => (
            <Link
              key={movie.id}
              href={`/movie/${movie.id}`}
              className="group relative flex flex-col bg-slate-900/60 rounded-xl sm:rounded-2xl overflow-hidden border border-purple-900/30 hover:border-rose-500/50 transition-all duration-200 hover:-translate-y-1 hover:shadow-xl hover:shadow-rose-600/10"
            >
              <div className="relative aspect-[2/3] w-full bg-slate-950 overflow-hidden">
                {movie.thumbnailUrl && movie.thumbnailUrl !== "/placeholder.png" ? (
                  <img
                    src={movie.thumbnailUrl}
                    alt={movie.title}
                    loading="lazy"
                    decoding="async"
                    className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                  />
                ) : (
                  <div className="w-full h-full flex flex-col items-center justify-center p-3 text-center text-slate-500">
                    <Film className="w-8 h-8 mb-1 text-purple-900/50" />
                    <span className="text-[10px]">{movie.title}</span>
                  </div>
                )}

                <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-transparent to-transparent opacity-80" />

                {/* Rating Badge */}
                {movie.voteAverage && (
                  <div className="absolute top-2 right-2 flex items-center space-x-1 bg-black/75 border border-amber-500/40 text-amber-300 text-[10px] font-bold px-2 py-0.5 rounded-md shadow">
                    <Star className="w-2.5 h-2.5 fill-current text-amber-400" />
                    <span>{movie.voteAverage.toFixed(1)}</span>
                  </div>
                )}

                {/* Quality Badge */}
                <div className="absolute top-2 left-2 bg-rose-600/90 text-white text-[9px] font-extrabold px-1.5 py-0.5 rounded shadow">
                  HD
                </div>

                {/* Play Hover Overlay */}
                <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                  <div className="w-11 h-11 rounded-full bg-gradient-to-r from-rose-600 to-purple-600 flex items-center justify-center shadow-lg">
                    <Play className="w-5 h-5 text-white fill-current ml-0.5" />
                  </div>
                </div>
              </div>

              {/* Title & Info */}
              <div className="p-3 flex flex-col justify-between flex-1">
                <div>
                  <h3 className="text-white text-xs sm:text-sm font-bold line-clamp-1 group-hover:text-rose-300 transition-colors">
                    {movie.title}
                  </h3>
                  <div className="flex items-center space-x-2 text-[10px] text-slate-400 mt-1">
                    <span className="text-rose-400 font-semibold truncate max-w-[80px]">{movie.genre}</span>
                    <span>•</span>
                    <span>{movie.releaseYear}</span>
                  </div>
                </div>
              </div>
            </Link>
          ))}
        </div>
      ) : (
        <div className="text-center py-16 bg-slate-900/40 rounded-2xl border border-purple-900/30 p-8">
          <Film className="w-12 h-12 text-purple-400/40 mx-auto mb-3" />
          <h3 className="text-lg font-bold text-white mb-1">No movies found</h3>
          <p className="text-xs text-slate-400">Try selecting another genre or return to page 1.</p>
        </div>
      )}

      {/* Pagination Controls */}
      <div className="flex items-center justify-center space-x-3 pt-6">
        {currentPage > 1 && (
          <Link
            href={`/movies?genre=${activeGenre}&page=${currentPage - 1}`}
            className="flex items-center space-x-1.5 px-4 py-2 rounded-xl bg-slate-900 hover:bg-slate-800 border border-purple-500/20 text-slate-200 text-xs font-bold transition-all"
          >
            <ChevronLeft className="w-4 h-4" />
            <span>Previous</span>
          </Link>
        )}
        <span className="text-xs text-slate-400 px-3 py-2 bg-slate-900/60 rounded-xl border border-purple-500/10">
          Page <strong className="text-white">{currentPage}</strong>
        </span>
        <Link
          href={`/movies?genre=${activeGenre}&page=${currentPage + 1}`}
          className="flex items-center space-x-1.5 px-4 py-2 rounded-xl bg-gradient-to-r from-rose-600 to-purple-600 hover:from-rose-500 hover:to-purple-500 text-white text-xs font-bold transition-all shadow"
        >
          <span>Next</span>
          <ChevronRight className="w-4 h-4" />
        </Link>
      </div>
    </div>
  );
}
