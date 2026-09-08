import { prisma } from "@/lib/prisma";
import Link from "next/link";
import { Play, Film, Search } from "lucide-react";

export default async function Home() {
  const movies = await prisma.movie.findMany({
    orderBy: { createdAt: 'desc' },
    take: 12,
  });

  const featuredMovie = movies.length > 0 ? movies[0] : null;

  return (
    <div className="flex flex-col min-h-screen font-sans">
      {/* Hero Section */}
      {featuredMovie && (
        <section className="relative w-full h-[75vh] min-h-[550px] flex items-center justify-center overflow-hidden rounded-3xl mt-2 border border-purple-500/20 shadow-[0_0_50px_rgba(139,92,246,0.15)] group">
          {featuredMovie.thumbnailUrl ? (
            <img 
              src={featuredMovie.thumbnailUrl} 
              alt={featuredMovie.title} 
              className="absolute inset-0 w-full h-full object-cover transition-transform duration-1000 group-hover:scale-105" 
            />
          ) : (
            <div className="absolute inset-0 bg-slate-900 flex items-center justify-center">
              <Film className="w-32 h-32 text-purple-900/50" />
            </div>
          )}
          
          {/* Gradients for Rose Winter Sky Overlay */}
          <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/60 to-transparent opacity-90" />
          <div className="absolute inset-0 bg-gradient-to-r from-slate-950 via-purple-950/50 to-transparent opacity-80" />
          <div className="absolute inset-0 bg-rose-500/10 mix-blend-overlay pointer-events-none" />
          
          <div className="relative z-10 max-w-7xl w-full mx-auto px-6 sm:px-10 lg:px-12 flex flex-col items-start pt-20">
            <div className="inline-flex items-center space-x-2 bg-rose-500/10 border border-rose-500/20 rounded-full px-4 py-1.5 mb-6 backdrop-blur-md">
              <span className="flex h-2 w-2 rounded-full bg-rose-500 animate-pulse"></span>
              <span className="text-rose-200 text-sm font-medium tracking-wide uppercase">Featured Movie</span>
            </div>
            <h1 className="text-5xl md:text-7xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-white via-rose-100 to-purple-200 mb-6 drop-shadow-[0_2px_20px_rgba(244,63,94,0.3)] max-w-3xl tracking-tight">
              {featuredMovie.title}
            </h1>
            <p className="text-slate-300 text-lg md:text-xl max-w-2xl mb-10 line-clamp-3 drop-shadow-md font-light leading-relaxed">
              {featuredMovie.description}
            </p>
            <div className="flex flex-col sm:flex-row gap-5 w-full sm:w-auto">
              <Link 
                href={`/movie/${featuredMovie.id}`}
                className="bg-gradient-to-r from-rose-600 to-purple-600 hover:from-rose-500 hover:to-purple-500 text-white px-10 py-4 rounded-full font-bold flex items-center justify-center transition-all hover:scale-105 shadow-[0_0_30px_rgba(244,63,94,0.4)] hover:shadow-[0_0_40px_rgba(168,85,247,0.6)] group/btn"
              >
                <Play className="w-5 h-5 mr-3 fill-current group-hover/btn:scale-110 transition-transform" /> 
                <span className="tracking-wide">Watch Now</span>
              </Link>
            </div>
          </div>
        </section>
      )}

      {/* Search Section */}
      <section className="max-w-4xl w-full mx-auto px-4 -mt-10 relative z-20 mb-16">
        <form action="/search" method="GET" className="relative group/search">
          <div className="relative flex items-center">
            <Search className="absolute left-6 w-6 h-6 text-purple-400/60 group-focus-within/search:text-rose-400 transition-colors" />
            <input 
              type="text" 
              name="q" 
              placeholder="Search top tier movies..." 
              className="w-full bg-slate-900/80 backdrop-blur-xl border border-purple-500/30 text-slate-100 px-16 py-5 rounded-full focus:outline-none focus:ring-2 focus:ring-rose-500/50 focus:border-rose-500/50 shadow-[0_10px_40px_rgba(0,0,0,0.5)] text-lg transition-all placeholder:text-purple-300/40"
            />
            <button type="submit" className="absolute right-3 bg-slate-800 hover:bg-slate-700 text-rose-300 hover:text-rose-200 px-8 py-3 rounded-full font-medium transition-all border border-purple-500/20">
              Search
            </button>
          </div>
        </form>
      </section>

      {/* Movies Grid */}
      <main className="flex-grow max-w-7xl mx-auto w-full px-4 sm:px-6 lg:px-8 pb-24">
        <div className="flex items-center justify-between mb-10">
          <h2 className="text-3xl font-bold text-white flex items-center tracking-tight">
            <span className="bg-gradient-to-b from-rose-400 to-purple-600 w-1.5 h-8 mr-4 rounded-full shadow-[0_0_10px_rgba(244,63,94,0.5)]"></span>
            Trending Now
          </h2>
        </div>
        
        {movies.length === 0 ? (
          <div className="text-center text-purple-300 py-32 bg-slate-900/30 backdrop-blur-sm rounded-3xl border border-purple-900/30">
            <Film className="w-16 h-16 mx-auto mb-6 text-purple-500/50 animate-pulse" />
            <p className="text-2xl font-light">No movies available yet. Check back soon!</p>
          </div>
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 md:gap-8 lg:gap-10">
            {movies.map((movie) => (
              <Link href={`/movie/${movie.id}`} key={movie.id} className="group cursor-pointer">
                <div className="relative aspect-[2/3] bg-slate-900 rounded-2xl overflow-hidden border border-purple-900/30 transition-all duration-500 group-hover:-translate-y-2 group-hover:shadow-[0_20px_40px_rgba(139,92,246,0.2)] group-hover:border-rose-500/50">
                  {movie.thumbnailUrl ? (
                    <img src={movie.thumbnailUrl} alt={movie.title} className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" />
                  ) : (
                    <div className="w-full h-full flex flex-col items-center justify-center bg-slate-900 p-4 text-center">
                      <Film className="w-12 h-12 text-purple-900/50 mb-3" />
                      <span className="text-purple-300/50 text-sm font-medium">{movie.title}</span>
                    </div>
                  )}
                  <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/40 to-transparent opacity-90 transition-opacity duration-300 group-hover:opacity-100" />
                  <div className="absolute inset-0 bg-rose-500/10 opacity-0 group-hover:opacity-100 mix-blend-overlay transition-opacity duration-500" />
                  
                  <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300 backdrop-blur-[2px] bg-slate-950/20">
                    <div className="bg-white/10 backdrop-blur-md rounded-full p-5 transform scale-50 group-hover:scale-100 transition-all duration-500 border border-white/20 shadow-[0_0_30px_rgba(244,63,94,0.3)]">
                      <Play className="w-8 h-8 text-white fill-current ml-1" />
                    </div>
                  </div>
                  
                  <div className="absolute bottom-0 left-0 right-0 p-6 transform translate-y-4 group-hover:translate-y-0 transition-transform duration-500">
                    <div className="text-xs font-bold text-rose-400 mb-2 uppercase tracking-widest drop-shadow-md">{movie.genre}</div>
                    <h3 className="font-bold text-slate-100 text-xl leading-tight truncate drop-shadow-lg mb-1">{movie.title}</h3>
                    <div className="flex items-center text-sm text-purple-300/80 font-medium">
                      <span>{movie.releaseYear}</span>
                    </div>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        )}
      </main>

      {/* Footer */}
      <footer className="bg-slate-950 border-t border-purple-900/30 py-16 mt-auto relative overflow-hidden">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-[1px] bg-gradient-to-r from-transparent via-rose-500/50 to-transparent"></div>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col md:flex-row items-center justify-between relative z-10">
          <div className="flex items-center space-x-3 mb-6 md:mb-0 group cursor-pointer">
            <Film className="w-8 h-8 text-rose-500 group-hover:text-rose-400 transition-colors drop-shadow-[0_0_10px_rgba(244,63,94,0.5)]" />
            <span className="font-bold text-2xl tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-white to-purple-200">
              Filmology<span className="text-rose-500">X</span>
            </span>
          </div>
          <p className="text-purple-300/60 text-sm font-medium">
            &copy; {new Date().getFullYear()} FilmologyX. All rights reserved.
          </p>
        </div>
      </footer>
    </div>
  );
}
