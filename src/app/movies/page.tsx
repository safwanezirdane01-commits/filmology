import { Metadata } from "next";
import Link from "next/link";
import { discoverByFilter, UniversalItem } from "@/lib/tmdb";
import { Film, Star } from "lucide-react";
import QuickWatchlistHeart from "@/components/QuickWatchlistHeart";
import CatalogHeaderView from "@/components/CatalogHeaderView";
import CatalogPaginationView from "@/components/CatalogPaginationView";

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
  { id: "animation", label: "Animation" },
  { id: "imdb_trending", label: "Trending" },
  { id: "imdb_top", label: "Top Rated" },
];

export default async function MoviesPage({
  searchParams,
}: {
  searchParams: Promise<{ genre?: string; page?: string; sort?: string }>;
}) {
  const { genre = "all", page = "1", sort = "popular" } = await searchParams;
  const currentPage = Math.max(1, parseInt(page, 10) || 1);
  const activeGenre = GENRES.some((g) => g.id === genre) ? genre : "all";

  const movies: UniversalItem[] = await discoverByFilter(activeGenre, currentPage);

  // Apply sorting
  if (sort === "rating") {
    movies.sort((a, b) => (b.voteAverage || 0) - (a.voteAverage || 0));
  } else if (sort === "year") {
    movies.sort((a, b) => (b.releaseYear || 0) - (a.releaseYear || 0));
  } else if (sort === "title") {
    movies.sort((a, b) => a.title.localeCompare(b.title));
  }

  return (
    <div className="space-y-6 sm:space-y-8 pb-16">
      <CatalogHeaderView
        type="movies"
        activeGenre={activeGenre}
        currentPage={currentPage}
        sort={sort}
        genres={GENRES}
      />

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
                    <span className="original-title text-[10px]" dir="ltr">{movie.title}</span>
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

                {/* Quick Watchlist Heart Button */}
                <div className="absolute bottom-2 right-2 z-20">
                  <QuickWatchlistHeart
                    item={{
                      id: movie.id,
                      title: movie.title,
                      thumbnailUrl: movie.thumbnailUrl,
                      genre: movie.genre,
                      releaseYear: movie.releaseYear,
                    }}
                  />
                </div>
              </div>

              {/* Title & Info */}
              <div className="p-3 flex flex-col justify-between flex-1">
                <div>
                  <h3 className="original-title text-white text-xs sm:text-sm font-bold line-clamp-1 group-hover:text-rose-300 transition-colors" dir="ltr">
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
      <CatalogPaginationView
        basePath="/movies"
        activeGenre={activeGenre}
        currentPage={currentPage}
        sort={sort}
      />
    </div>
  );
}
