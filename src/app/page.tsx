import { prisma } from "@/lib/prisma";
import { CURATED_CATALOG } from "@/lib/catalog";
import Link from "next/link";
import { Play, Film, Search, Star, Sparkles, Zap, ShieldCheck, Clapperboard, Info } from "lucide-react";
import MovieCatalogView from "@/components/MovieCatalogView";

export default async function Home() {
  let movies: any[] = [];
  try {
    movies = await prisma.movie.findMany({
      orderBy: { createdAt: "desc" },
    });
  } catch (err) {
    console.warn("Prisma findMany failed on Home, using catalog fallback:", err);
  }

  if (!movies || movies.length === 0) {
    movies = CURATED_CATALOG;
  }

  const featuredMovie = movies.length > 0 ? movies[0] : null;

  return (
    <div className="flex flex-col min-h-screen font-sans -mt-4">
      {/* Cinematic Hero Spotlight */}
      {featuredMovie && (
        <section className="relative w-full min-h-[440px] sm:min-h-[520px] md:h-[70vh] md:max-h-[700px] flex items-center justify-center overflow-hidden rounded-2xl sm:rounded-3xl mt-1 sm:mt-2 border border-purple-500/20 shadow-[0_0_50px_rgba(139,92,246,0.15)] group">
          {featuredMovie.thumbnailUrl ? (
            <img 
              src={featuredMovie.thumbnailUrl} 
              alt={featuredMovie.title} 
              className="absolute inset-0 w-full h-full object-cover object-center transition-transform duration-1000 group-hover:scale-105" 
            />
          ) : (
            <div className="absolute inset-0 bg-slate-900 flex items-center justify-center">
              <Film className="w-24 sm:w-32 h-24 sm:h-32 text-purple-900/50" />
            </div>
          )}
          
          {/* Gradients Overlay */}
          <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/75 to-slate-950/40 opacity-95" />
          <div className="absolute inset-0 bg-gradient-to-r from-slate-950 via-purple-950/60 to-transparent opacity-90" />
          <div className="absolute inset-0 bg-rose-500/10 mix-blend-overlay pointer-events-none" />
          
          <div className="relative z-10 max-w-7xl w-full mx-auto px-4 sm:px-8 lg:px-12 flex flex-col items-start py-8 sm:py-14">
            {/* Spotlight Pills */}
            <div className="flex flex-wrap items-center gap-2 sm:gap-3 mb-3 sm:mb-5">
              <div className="inline-flex items-center space-x-1.5 sm:space-x-2 bg-rose-500/20 border border-rose-500/40 rounded-full px-2.5 sm:px-3.5 py-0.5 sm:py-1 backdrop-blur-md">
                <span className="flex h-1.5 sm:h-2 w-1.5 sm:w-2 rounded-full bg-rose-500 animate-pulse"></span>
                <span className="text-rose-200 text-[10px] sm:text-xs font-bold tracking-wider uppercase">#1 Trending Movie</span>
              </div>
              <div className="inline-flex items-center space-x-1 bg-amber-500/10 border border-amber-500/30 rounded-full px-2 sm:px-3 py-0.5 sm:py-1 backdrop-blur-md text-amber-300 text-[10px] sm:text-xs font-bold">
                <Star className="w-3 sm:w-3.5 h-3 sm:h-3.5 fill-current text-amber-400" />
                <span>8.9 / 10 IMDb</span>
              </div>
              <span className="bg-slate-800/80 border border-purple-500/20 text-purple-200 text-[10px] sm:text-xs font-bold px-2 sm:px-2.5 py-0.5 sm:py-1 rounded-full uppercase">
                4K Ultra HD
              </span>
            </div>

            <h1 className="text-2xl sm:text-4xl md:text-6xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-white via-rose-100 to-purple-200 mb-3 sm:mb-5 drop-shadow-[0_2px_25px_rgba(244,63,94,0.4)] max-w-3xl tracking-tight leading-tight">
              {featuredMovie.title}
            </h1>

            <p className="text-slate-300 text-xs sm:text-base md:text-lg max-w-2xl mb-5 sm:mb-8 line-clamp-2 sm:line-clamp-3 drop-shadow-md font-light leading-relaxed">
              {featuredMovie.description}
            </p>

            {/* Action Buttons */}
            <div className="flex flex-row items-center gap-2.5 sm:gap-4 w-full sm:w-auto">
              <Link 
                href={`/movie/${featuredMovie.id}`}
                className="flex-1 sm:flex-none bg-gradient-to-r from-rose-600 to-purple-600 hover:from-rose-500 hover:to-purple-500 text-white px-4 sm:px-8 py-3 sm:py-3.5 rounded-full font-bold flex items-center justify-center transition-all hover:scale-105 shadow-[0_0_30px_rgba(244,63,94,0.4)] group/btn text-xs sm:text-base min-h-[44px]"
              >
                <Play className="w-4 sm:w-5 h-4 sm:h-5 mr-1.5 sm:mr-2.5 fill-current group-hover/btn:scale-110 transition-transform" /> 
                <span className="tracking-wide">Watch Free</span>
              </Link>
              <Link 
                href={`/movie/${featuredMovie.id}`}
                className="flex-1 sm:flex-none bg-slate-900/80 hover:bg-slate-800/90 text-slate-200 border border-purple-500/30 px-4 sm:px-6 py-3 sm:py-3.5 rounded-full font-semibold flex items-center justify-center transition-all hover:border-rose-500/50 backdrop-blur-md text-xs sm:text-sm min-h-[44px]"
              >
                <Info className="w-3.5 sm:w-4 h-3.5 sm:h-4 mr-1.5 sm:mr-2 text-rose-400" />
                <span>Details</span>
              </Link>
            </div>
          </div>
        </section>
      )}

      {/* Modern Floating Search Box */}
      <section className="max-w-4xl w-full mx-auto px-3 sm:px-4 -mt-5 sm:-mt-8 relative z-20 mb-8 sm:mb-12">
        <form action="/search" method="GET" className="relative group/search">
          <div className="relative flex items-center">
            <Search className="absolute left-4 sm:left-6 w-4 sm:w-5 h-4 sm:h-5 text-purple-400/60 group-focus-within/search:text-rose-400 transition-colors" />
            <input 
              type="text" 
              name="q" 
              placeholder="Search by title, genre, actor..." 
              className="w-full bg-slate-900/95 backdrop-blur-2xl border border-purple-500/30 text-slate-100 pl-11 sm:pl-16 pr-24 sm:pr-32 py-3.5 sm:py-5 rounded-full focus:outline-none focus:ring-2 focus:ring-rose-500/50 focus:border-rose-500/50 shadow-[0_15px_50px_rgba(0,0,0,0.6)] text-xs sm:text-base md:text-lg transition-all placeholder:text-purple-300/40"
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
      <section className="max-w-7xl mx-auto w-full px-3 sm:px-6 lg:px-8 mb-8 sm:mb-12">
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-2.5 sm:gap-4">
          <div className="bg-slate-900/40 border border-purple-900/30 rounded-xl sm:rounded-2xl p-3 sm:p-4 flex items-center space-x-3 backdrop-blur-md">
            <div className="bg-rose-500/10 p-2 sm:p-2.5 rounded-lg sm:rounded-xl text-rose-400 border border-rose-500/20 shrink-0">
              <Zap className="w-4 sm:w-5 h-4 sm:h-5" />
            </div>
            <div>
              <h4 className="text-white text-xs sm:text-sm font-bold">Ultra Fast 1080p Streaming</h4>
              <p className="text-[11px] sm:text-xs text-slate-400">Direct CDN and multi-server failover</p>
            </div>
          </div>

          <div className="bg-slate-900/40 border border-purple-900/30 rounded-xl sm:rounded-2xl p-3 sm:p-4 flex items-center space-x-3 backdrop-blur-md">
            <div className="bg-purple-500/10 p-2 sm:p-2.5 rounded-lg sm:rounded-xl text-purple-400 border border-purple-500/20 shrink-0">
              <Clapperboard className="w-4 sm:w-5 h-4 sm:h-5" />
            </div>
            <div>
              <h4 className="text-white text-xs sm:text-sm font-bold">{movies.length} Films Ready to Stream</h4>
              <p className="text-[11px] sm:text-xs text-slate-400">Blockbusters, Marvel, Sci-Fi & Series</p>
            </div>
          </div>

          <div className="bg-slate-900/40 border border-purple-900/30 rounded-xl sm:rounded-2xl p-3 sm:p-4 flex items-center space-x-3 backdrop-blur-md sm:col-span-2 md:col-span-1">
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

      {/* Main Movies Catalog with Live Filtering */}
      <main className="flex-grow max-w-7xl mx-auto w-full px-4 sm:px-6 lg:px-8 pb-24">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl sm:text-3xl font-extrabold text-white flex items-center tracking-tight">
            <span className="bg-gradient-to-b from-rose-500 to-purple-600 w-1.5 h-7 mr-3.5 rounded-full shadow-[0_0_12px_rgba(244,63,94,0.6)]"></span>
            Browse Film Collection
          </h2>
          <span className="text-xs text-purple-300/70 font-semibold">
            {movies.length} Titles Available
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
