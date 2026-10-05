import { Metadata } from "next";
import Link from "next/link";
import { discoverByFilter, UniversalItem } from "@/lib/tmdb";
import { Star, Play, ChevronLeft, ChevronRight, Filter } from "lucide-react";

export const metadata: Metadata = {
  title: "Watch Anime Free Online in HD | FilmologyX",
  description: "Stream the best anime shows and films free online in HD — Attack on Titan, Demon Slayer, One Piece, Naruto and more.",
};

const ANIME_GENRES = [
  { id: "anime", label: "All Anime" },
  { id: "anime_action", label: "Action" },
  { id: "anime_scifi", label: "Sci-Fi & Fantasy" },
  { id: "anime_drama", label: "Drama" },
  { id: "anime_comedy", label: "Comedy" },
  { id: "anime_movies", label: "Anime Films" },
  { id: "anime_top", label: "Top Rated" },
];

export default async function AnimePage({
  searchParams,
}: {
  searchParams: Promise<{ genre?: string; page?: string }>;
}) {
  const { genre = "anime", page = "1" } = await searchParams;
  const currentPage = Math.max(1, parseInt(page, 10) || 1);
  const activeGenre = ANIME_GENRES.some((g) => g.id === genre) ? genre : "anime";

  const animeList: UniversalItem[] = await discoverByFilter(activeGenre, currentPage);

  return (
    <div className="space-y-6 sm:space-y-8 pb-16">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 border-b border-purple-900/30 pb-5">
        <div>
          <div className="flex items-center space-x-2 text-orange-400 text-xs font-bold uppercase tracking-wider mb-1">
            <span className="text-lg">⛩️</span>
            <span>Anime Catalog</span>
          </div>
          <h1 className="text-2xl sm:text-4xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-white via-orange-100 to-rose-200 tracking-tight">
            Explore Anime
          </h1>
          <p className="text-slate-400 text-xs sm:text-sm mt-1">
            Stream the best anime series and films — Attack on Titan, Demon Slayer, One Piece, Dragon Ball & more.
          </p>
        </div>

        <div className="flex items-center space-x-2 bg-slate-900 border border-orange-500/20 px-3.5 py-1.5 rounded-full text-xs font-semibold text-orange-300">
          <span>⛩️</span>
          <span>Page {currentPage}</span>
        </div>
      </div>

      {/* Genre Filter Pills */}
      <div className="flex items-center space-x-2 overflow-x-auto pb-2 scrollbar-none">
        <div className="flex items-center space-x-1.5 text-slate-400 text-xs font-semibold shrink-0 pr-1">
          <Filter className="w-3.5 h-3.5 text-orange-400" />
          <span className="hidden sm:inline">Type:</span>
        </div>
        {ANIME_GENRES.map((g) => (
          <Link
            key={g.id}
            href={`/anime?genre=${g.id}&page=1`}
            className={`px-3.5 py-1.5 rounded-full text-xs font-bold transition-all shrink-0 active:scale-95 ${
              activeGenre === g.id
                ? "bg-gradient-to-r from-orange-500 to-rose-600 text-white shadow-md shadow-orange-500/30"
                : "bg-slate-900/80 hover:bg-slate-800 text-slate-300 border border-orange-500/20"
            }`}
          >
            {g.label}
          </Link>
        ))}
      </div>

      {/* Anime Grid */}
      {animeList.length > 0 ? (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3 sm:gap-5">
          {animeList.map((item) => (
            <Link
              key={item.id}
              href={`/movie/${item.id}`}
              className="group relative flex flex-col bg-slate-900/60 rounded-xl sm:rounded-2xl overflow-hidden border border-orange-900/20 hover:border-orange-500/50 transition-all duration-200 hover:-translate-y-1 hover:shadow-xl hover:shadow-orange-600/10"
            >
              <div className="relative aspect-[2/3] w-full bg-slate-950 overflow-hidden">
                {item.thumbnailUrl && item.thumbnailUrl !== "/placeholder.png" ? (
                  <img
                    src={item.thumbnailUrl}
                    alt={item.title}
                    loading="lazy"
                    decoding="async"
                    className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                  />
                ) : (
                  <div className="w-full h-full flex flex-col items-center justify-center p-3 text-center text-slate-500">
                    <span className="text-3xl mb-1">⛩️</span>
                    <span className="text-[10px]">{item.title}</span>
                  </div>
                )}

                <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-transparent to-transparent opacity-80" />

                {/* Rating Badge */}
                {item.voteAverage && (
                  <div className="absolute top-2 right-2 flex items-center space-x-1 bg-black/75 border border-amber-500/40 text-amber-300 text-[10px] font-bold px-2 py-0.5 rounded-md shadow">
                    <Star className="w-2.5 h-2.5 fill-current text-amber-400" />
                    <span>{item.voteAverage.toFixed(1)}</span>
                  </div>
                )}

                {/* Anime Badge */}
                <div className="absolute top-2 left-2 bg-orange-600/90 text-white text-[9px] font-extrabold px-1.5 py-0.5 rounded shadow flex items-center space-x-1">
                  <span>⛩️</span>
                  <span>ANIME</span>
                </div>

                {/* Play Overlay */}
                <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                  <div className="w-11 h-11 rounded-full bg-gradient-to-r from-orange-500 to-rose-600 flex items-center justify-center shadow-lg">
                    <Play className="w-5 h-5 text-white fill-current ml-0.5" />
                  </div>
                </div>
              </div>

              {/* Title & Info */}
              <div className="p-3">
                <h3 className="text-white text-xs sm:text-sm font-bold line-clamp-1 group-hover:text-orange-300 transition-colors">
                  {item.title}
                </h3>
                <div className="flex items-center space-x-2 text-[10px] text-slate-400 mt-1">
                  <span className="text-orange-400 font-semibold truncate max-w-[80px]">Anime</span>
                  <span>•</span>
                  <span>{item.releaseYear}</span>
                </div>
              </div>
            </Link>
          ))}
        </div>
      ) : (
        <div className="text-center py-16 bg-slate-900/40 rounded-2xl border border-orange-900/20 p-8">
          <span className="text-5xl block mb-3">⛩️</span>
          <h3 className="text-lg font-bold text-white mb-1">No anime found</h3>
          <p className="text-xs text-slate-400">Try selecting another category or go back to page 1.</p>
        </div>
      )}

      {/* Pagination */}
      <div className="flex items-center justify-center space-x-3 pt-6">
        {currentPage > 1 && (
          <Link
            href={`/anime?genre=${activeGenre}&page=${currentPage - 1}`}
            className="flex items-center space-x-1.5 px-4 py-2 rounded-xl bg-slate-900 hover:bg-slate-800 border border-orange-500/20 text-slate-200 text-xs font-bold transition-all"
          >
            <ChevronLeft className="w-4 h-4" />
            <span>Previous</span>
          </Link>
        )}
        <span className="text-xs text-slate-400 px-3 py-2 bg-slate-900/60 rounded-xl border border-orange-500/10">
          Page <strong className="text-white">{currentPage}</strong>
        </span>
        <Link
          href={`/anime?genre=${activeGenre}&page=${currentPage + 1}`}
          className="flex items-center space-x-1.5 px-4 py-2 rounded-xl bg-gradient-to-r from-orange-500 to-rose-600 hover:from-orange-400 hover:to-rose-500 text-white text-xs font-bold transition-all shadow"
        >
          <span>Next</span>
          <ChevronRight className="w-4 h-4" />
        </Link>
      </div>
    </div>
  );
}
