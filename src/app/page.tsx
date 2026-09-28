import { prisma } from "@/lib/prisma";
import { CURATED_CATALOG } from "@/lib/catalog";
import { getTrendingMovies, getTopRatedMovies } from "@/lib/tmdb";
import Link from "next/link";
import { Search, Zap, ShieldCheck, Clapperboard, Flame, Star, Tv, Film } from "lucide-react";
import MovieCatalogView from "@/components/MovieCatalogView";
import HeroSpotlightCarousel, { SpotlightItem } from "@/components/HeroSpotlightCarousel";
import MovieShelf from "@/components/MovieShelf";

export const dynamic = "force-dynamic";

export default async function Home() {
  let dbMovies: any[] = [];
  try {
    dbMovies = await prisma.movie.findMany({
      orderBy: { createdAt: "desc" },
    });
  } catch (err) {
    console.warn("Prisma findMany failed on Home, using catalog fallback:", err);
  }

  // Combine CURATED_CATALOG with database movies
  const movieMap = new Map<string, any>();
  for (const item of CURATED_CATALOG) {
    movieMap.set(item.title.toLowerCase().trim(), item);
  }
  for (const dbItem of dbMovies) {
    const key = dbItem.title.toLowerCase().trim();
    if (movieMap.has(key)) {
      const existing = movieMap.get(key);
      movieMap.set(key, {
        ...existing,
        ...dbItem,
        id: existing.id,
        thumbnailUrl: existing.thumbnailUrl || dbItem.thumbnailUrl,
        genre: existing.genre || dbItem.genre,
      });
    } else {
      movieMap.set(key, dbItem);
    }
  }
  const movies = Array.from(movieMap.values());

  // Fetch live worldwide trending and top rated movies in parallel from TMDb
  const [liveTrending, liveTopRated] = await Promise.all([
    getTrendingMovies(1).catch(() => []),
    getTopRatedMovies(1).catch(() => []),
  ]);

  // Curate Spotlight Carousel (top 6-8 standout blockbusters & trending hits)
  const spotlightCandidates: SpotlightItem[] = [];

  // Add top trending hits from TMDb
  for (const t of liveTrending.slice(0, 4)) {
    spotlightCandidates.push({
      id: t.id,
      title: t.title,
      genre: t.genre,
      releaseYear: t.releaseYear,
      description: t.description,
      thumbnailUrl: t.thumbnailUrl,
      backdropUrl: t.backdropUrl,
      voteAverage: t.voteAverage || 8.8,
      tag: "🔥 #1 Worldwide Trending",
    });
  }

  // Add curated top blockbusters from library (Dune 2, Deadpool, Interstellar, Gladiator, Oppenheimer)
  const topBlockbusters = movies.filter(m => 
    /dune|deadpool|gladiator|interstellar|oppenheimer|dark knight|spider-man/i.test(m.title)
  ).slice(0, 4);

  for (const b of topBlockbusters) {
    spotlightCandidates.push({
      id: b.id,
      title: b.title,
      genre: b.genre,
      releaseYear: b.releaseYear,
      description: b.description,
      thumbnailUrl: b.thumbnailUrl,
      backdropUrl: b.thumbnailUrl,
      voteAverage: 8.9,
      tag: "⭐ All-Time Masterpiece",
    });
  }

  // Fallback if needed
  if (spotlightCandidates.length === 0 && movies.length > 0) {
    for (const m of movies.slice(0, 6)) {
      spotlightCandidates.push({
        id: m.id,
        title: m.title,
        genre: m.genre,
        releaseYear: m.releaseYear,
        description: m.description,
        thumbnailUrl: m.thumbnailUrl,
        backdropUrl: m.thumbnailUrl,
        voteAverage: 8.8,
      });
    }
  }

  // Curate TV Series list
  const tvSeries = movies.filter(
    (m) => m.category === "series" || /series|show/i.test(m.genre)
  );

  // Curate Top Rated Masterpieces
  const topRatedShelves = movies.filter(
    (m) => m.category !== "series" && !/series|show/i.test(m.genre)
  ).slice(0, 15);

  return (
    <div className="flex flex-col min-h-screen font-sans -mt-4 space-y-8 sm:space-y-12">
      {/* 🎬 DYNAMIC ROTATING HERO SPOTLIGHT CAROUSEL */}
      <HeroSpotlightCarousel movies={spotlightCandidates} />

      {/* Modern Floating Search Box */}
      <section className="max-w-4xl w-full mx-auto px-3 sm:px-4 -mt-6 sm:-mt-10 relative z-20">
        <form action="/search" method="GET" className="relative group/search">
          <div className="relative flex items-center">
            <Search className="absolute left-4 sm:left-6 w-4 sm:w-5 h-4 sm:h-5 text-purple-400/60 group-focus-within/search:text-rose-400 transition-colors" />
            <input 
              type="text" 
              name="q" 
              placeholder="Search by title, genre, actor..." 
              className="w-full bg-slate-900/95 sm:backdrop-blur-2xl border border-purple-500/30 text-slate-100 pl-11 sm:pl-16 pr-24 sm:pr-32 py-3.5 sm:py-5 rounded-full focus:outline-none focus:ring-2 focus:ring-rose-500/50 focus:border-rose-500/50 shadow-[0_15px_50px_rgba(0,0,0,0.6)] text-xs sm:text-base md:text-lg transition-all placeholder:text-purple-300/40"
            />
            <button 
              type="submit" 
              className="absolute right-1.5 sm:right-2.5 bg-gradient-to-r from-rose-600 to-purple-600 hover:from-rose-500 hover:to-purple-500 text-white font-bold px-4 sm:px-6 py-2 sm:py-2.5 rounded-full text-xs sm:text-sm transition-all shadow-md min-h-[36px]"
            >
              Search
            </button>
          </div>
        </form>
      </section>

      {/* Feature Highlights Bar */}
      <section className="max-w-7xl mx-auto w-full px-3 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-2.5 sm:gap-4">
          <div className="bg-slate-900/40 border border-purple-900/30 rounded-xl sm:rounded-2xl p-3 sm:p-4 flex items-center space-x-3 sm:backdrop-blur-md">
            <div className="bg-rose-500/10 p-2 sm:p-2.5 rounded-lg sm:rounded-xl text-rose-400 border border-rose-500/20 shrink-0">
              <Zap className="w-4 sm:w-5 h-4 sm:h-5" />
            </div>
            <div>
              <h4 className="text-white text-xs sm:text-sm font-bold">Ultra Fast 1080p Streaming</h4>
              <p className="text-[11px] sm:text-xs text-slate-400">Direct CDN and multi-server failover</p>
            </div>
          </div>

          <div className="bg-slate-900/40 border border-purple-900/30 rounded-xl sm:rounded-2xl p-3 sm:p-4 flex items-center space-x-3 sm:backdrop-blur-md">
            <div className="bg-purple-500/10 p-2 sm:p-2.5 rounded-lg sm:rounded-xl text-purple-400 border border-purple-500/20 shrink-0">
              <Clapperboard className="w-4 sm:w-5 h-4 sm:h-5" />
            </div>
            <div>
              <h4 className="text-white text-xs sm:text-sm font-bold">10,000+ Films & Shows Ready</h4>
              <p className="text-[11px] sm:text-xs text-slate-400">Full IMDb Library, Marvel, Sci-Fi & Series</p>
            </div>
          </div>

          <div className="bg-slate-900/40 border border-purple-900/30 rounded-xl sm:rounded-2xl p-3 sm:p-4 flex items-center space-x-3 sm:backdrop-blur-md sm:col-span-2 md:col-span-1">
            <div className="bg-emerald-500/10 p-2 sm:p-2.5 rounded-lg sm:rounded-xl text-emerald-400 border border-emerald-500/20 shrink-0">
              <ShieldCheck className="w-4 sm:w-5 h-4 sm:h-5" />
            </div>
            <div>
              <h4 className="text-white text-xs sm:text-sm font-bold">100% Free & Open</h4>
              <p className="text-[11px] sm:text-xs text-slate-400">Watch instantly, no credit card needed</p>
            </div>
          </div>
        </div>
      </section>

      {/* 🌟 CURATED SHELVES: DYNAMIC CONTENT ROWS */}
      <section className="max-w-7xl mx-auto w-full px-4 sm:px-6 lg:px-8 space-y-10 sm:space-y-12">
        {/* Shelf 1: Trending Worldwide */}
        {liveTrending.length > 0 && (
          <MovieShelf
            title="Trending Worldwide"
            badgeText="Live Today"
            icon={<Flame className="w-5 sm:w-6 h-5 sm:h-6 text-rose-500 fill-current" />}
            subtitle="The most-watched films across the globe right now"
            movies={liveTrending.slice(0, 15)}
          />
        )}

        {/* Shelf 2: All-Time Masterpieces */}
        {topRatedShelves.length > 0 && (
          <MovieShelf
            title="All-Time Masterpieces"
            badgeText="IMDb 8.8+"
            icon={<Star className="w-5 sm:w-6 h-5 sm:h-6 text-amber-400 fill-current" />}
            subtitle="Critically acclaimed cinema classics and highest-rated films"
            movies={topRatedShelves}
          />
        )}

        {/* Shelf 3: Binge-Worthy TV Series */}
        {tvSeries.length > 0 && (
          <MovieShelf
            title="Binge-Worthy TV Series"
            badgeText="Top Shows"
            icon={<Tv className="w-5 sm:w-6 h-5 sm:h-6 text-purple-400" />}
            subtitle="Full multi-season series with episode navigator"
            movies={tvSeries}
          />
        )}
      </section>

      {/* Main Movies Catalog with Live Filtering */}
      <main className="flex-grow max-w-7xl mx-auto w-full px-4 sm:px-6 lg:px-8 pb-24">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl sm:text-3xl font-extrabold text-white flex items-center tracking-tight">
            <span className="bg-gradient-to-b from-rose-500 to-purple-600 w-1.5 h-7 mr-3.5 rounded-full shadow-[0_0_12px_rgba(244,63,94,0.6)]"></span>
            Browse Film Collection
          </h2>
          <span className="text-xs text-purple-300/70 font-semibold">
            10,000+ Titles & Instant Search
          </span>
        </div>

        <MovieCatalogView movies={movies} />
      </main>

      {/* Sleek Modern Footer */}
      <footer className="bg-slate-950 border-t border-purple-900/30 py-12 mt-auto relative overflow-hidden">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-[1px] bg-gradient-to-r from-transparent via-rose-500/50 to-transparent"></div>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col md:flex-row items-center justify-between gap-4 relative z-10">
          <div className="flex items-center space-x-3 group cursor-pointer">
            <Film className="w-7 h-7 text-rose-500 group-hover:text-rose-400 transition-colors drop-shadow-[0_0_10px_rgba(244,63,94,0.5)]" />
            <span className="font-bold text-xl tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-white to-purple-200">
              Filmology<span className="text-rose-500">X</span>
            </span>
          </div>
          <p className="text-purple-300/60 text-xs font-medium text-center md:text-right">
            &copy; {new Date().getFullYear()} FilmologyX. High-Definition Free Streaming Platform.
          </p>
        </div>
      </footer>
    </div>
  );
}
