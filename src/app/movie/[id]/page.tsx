import { prisma } from "@/lib/prisma";
import { notFound } from "next/navigation";
import Link from "next/link";
import WatchlistButton from "./WatchlistButton";
import ReviewSection from "./ReviewSection";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import VideoPlayer from "./VideoPlayer";
import { Star, Sparkles, Film, Play, Tv, Share2 } from "lucide-react";

export default async function MovieDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const movie = await prisma.movie.findUnique({
    where: { id },
  });

  if (!movie) {
    notFound();
  }

  const session = await getServerSession(authOptions);
  
  let isInWatchlist = false;
  if (session) {
    const watchlist = await prisma.watchlist.findUnique({
      where: {
        userId_movieId: {
          userId: session.user.id,
          movieId: movie.id,
        }
      }
    });
    isInWatchlist = !!watchlist;
  }

  // Fetch Recommended / Related Movies (same genre or other top movies)
  const relatedMovies = await prisma.movie.findMany({
    where: {
      NOT: { id: movie.id }
    },
    orderBy: { createdAt: "desc" },
    take: 5
  });

  return (
    <div className="max-w-5xl mx-auto space-y-12 font-sans pb-20">
      {/* Video Player with Cinematic Ambilight Glow */}
      <div className="relative group">
        {/* Ambient Glow Background Effect */}
        <div className="absolute -inset-4 sm:-inset-6 bg-gradient-to-r from-rose-600/30 via-purple-600/25 to-rose-600/30 rounded-3xl blur-2xl opacity-60 group-hover:opacity-90 transition-opacity duration-1000 -z-10" />

        <div className="aspect-video bg-slate-950 rounded-3xl overflow-hidden border border-purple-500/30 shadow-[0_0_60px_rgba(139,92,246,0.3)] relative">
          <VideoPlayer 
            movieVideoUrl={movie.videoUrl} 
            thumbnailUrl={movie.thumbnailUrl} 
          />
        </div>
      </div>

      {/* Movie Details & Action Header */}
      <div className="bg-slate-900/70 backdrop-blur-2xl p-8 sm:p-10 rounded-3xl border border-purple-900/40 shadow-2xl relative overflow-hidden">
        <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-rose-500 via-purple-500 to-rose-500"></div>
        <div className="absolute top-0 right-0 w-80 h-80 bg-rose-500/10 blur-[100px] pointer-events-none rounded-full"></div>
        
        <div className="flex flex-col sm:flex-row justify-between items-start gap-6 mb-6 relative z-10">
          <div>
            <div className="flex flex-wrap items-center gap-2.5 mb-3">
              <span className="bg-rose-500/15 text-rose-300 border border-rose-500/30 px-3 py-1 rounded-full uppercase tracking-wider text-xs font-bold">
                {movie.genre}
              </span>
              <span className="bg-slate-800/80 px-3 py-1 rounded-full border border-purple-500/20 text-xs font-semibold text-purple-200">
                {movie.releaseYear}
              </span>
              <span className="bg-amber-500/10 text-amber-300 border border-amber-500/25 px-2.5 py-1 rounded-full text-xs font-bold flex items-center space-x-1">
                <Star className="w-3 h-3 fill-current text-amber-400" />
                <span>8.8 / 10 IMDb</span>
              </span>
              <span className="bg-slate-800/80 text-purple-300 border border-purple-500/20 px-2.5 py-1 rounded-full text-xs font-bold">
                4K Ultra HD
              </span>
              <span className="bg-slate-800/80 text-purple-300 border border-purple-500/20 px-2.5 py-1 rounded-full text-xs font-bold">
                Dolby 5.1
              </span>
            </div>

            <h1 className="text-3xl sm:text-5xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-white via-rose-100 to-purple-200 tracking-tight leading-tight">
              {movie.title}
            </h1>
          </div>

          <div className="flex items-center space-x-3 shrink-0">
            {session && (
              <WatchlistButton movieId={movie.id} initialStatus={isInWatchlist} />
            )}
          </div>
        </div>
        
        <p className="text-slate-300 text-base sm:text-lg leading-relaxed font-light relative z-10 max-w-4xl">
          {movie.description}
        </p>
      </div>

      {/* "More Like This" Recommended Movies Row */}
      {relatedMovies.length > 0 && (
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <h2 className="text-2xl font-bold text-white flex items-center space-x-2">
              <Sparkles className="w-5 h-5 text-rose-400" />
              <span>More Like This</span>
            </h2>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-4">
            {relatedMovies.map((rel) => (
              <Link
                href={`/movie/${rel.id}`}
                key={rel.id}
                className="group relative flex flex-col cursor-pointer"
              >
                <div className="relative aspect-[2/3] bg-slate-900 rounded-2xl overflow-hidden border border-purple-900/30 transition-all duration-300 group-hover:-translate-y-1.5 group-hover:shadow-[0_15px_30px_rgba(244,63,94,0.3)] group-hover:border-rose-500/50">
                  {rel.thumbnailUrl ? (
                    <img
                      src={rel.thumbnailUrl}
                      alt={rel.title}
                      loading="lazy"
                      className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                    />
                  ) : (
                    <div className="w-full h-full flex flex-col items-center justify-center bg-slate-900 p-3 text-center">
                      <Film className="w-8 h-8 text-purple-900/50 mb-1" />
                      <span className="text-purple-300/50 text-[10px]">{rel.title}</span>
                    </div>
                  )}
                  <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/20 to-transparent opacity-80" />
                  
                  <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                    <div className="bg-gradient-to-r from-rose-600 to-purple-600 rounded-full p-3 shadow-lg">
                      <Play className="w-4 h-4 text-white fill-current ml-0.5" />
                    </div>
                  </div>

                  <div className="absolute bottom-0 left-0 right-0 p-3">
                    <p className="text-[10px] text-rose-400 font-bold uppercase">{rel.genre}</p>
                    <h4 className="text-white text-xs font-bold truncate group-hover:text-rose-200 transition-colors">
                      {rel.title}
                    </h4>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      )}

      {/* Community Reviews & Ratings Section */}
      <div className="bg-slate-900/40 backdrop-blur-xl rounded-3xl border border-purple-900/30 p-8 sm:p-10 shadow-xl">
        <ReviewSection movieId={movie.id} isLoggedIn={!!session} />
      </div>
    </div>
  );
}
