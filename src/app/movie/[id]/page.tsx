import { prisma } from "@/lib/prisma";
import { notFound } from "next/navigation";
import WatchlistButton from "./WatchlistButton";
import ReviewSection from "./ReviewSection";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import VideoPlayer from "./VideoPlayer";

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

  return (
    <div className="max-w-5xl mx-auto space-y-10 font-sans">
      {/* Video Player */}
      <div className="aspect-video bg-slate-950 rounded-2xl overflow-hidden border border-purple-500/20 shadow-[0_0_50px_rgba(139,92,246,0.15)] relative group">
        <VideoPlayer 
          movieVideoUrl={movie.videoUrl} 
          thumbnailUrl={movie.thumbnailUrl} 
        />
        <div className="absolute inset-0 pointer-events-none ring-1 ring-inset ring-white/10 rounded-2xl"></div>
      </div>

      <div className="bg-slate-900/60 backdrop-blur-xl p-8 sm:p-10 rounded-3xl border border-purple-900/40 shadow-[0_10px_40px_rgba(0,0,0,0.3)] relative overflow-hidden">
        <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-rose-500 to-purple-600"></div>
        <div className="absolute top-0 right-0 w-64 h-64 bg-rose-500/10 blur-[100px] pointer-events-none rounded-full"></div>
        
        <div className="flex flex-col sm:flex-row justify-between items-start gap-6 mb-6 relative z-10">
          <div>
            <h1 className="text-4xl sm:text-5xl font-extrabold mb-3 text-transparent bg-clip-text bg-gradient-to-r from-white via-rose-100 to-purple-200 tracking-tight">
              {movie.title}
            </h1>
            <div className="flex flex-wrap gap-3 items-center text-purple-300/80 text-sm font-medium">
              <span className="bg-slate-800/80 px-3 py-1 rounded-full border border-purple-500/20">{movie.releaseYear}</span>
              <span className="bg-rose-500/10 text-rose-300 border border-rose-500/20 px-3 py-1 rounded-full uppercase tracking-wider text-xs font-bold">{movie.genre}</span>
            </div>
          </div>
          {session && (
            <div className="shrink-0">
              <WatchlistButton movieId={movie.id} initialStatus={isInWatchlist} />
            </div>
          )}
        </div>
        
        <p className="text-slate-300 text-lg leading-relaxed font-light relative z-10">
          {movie.description}
        </p>
      </div>

      <div className="bg-slate-900/40 backdrop-blur-md rounded-3xl border border-purple-900/30 p-8 sm:p-10 shadow-[0_10px_30px_rgba(0,0,0,0.2)]">
        <ReviewSection movieId={movie.id} isLoggedIn={!!session} />
      </div>
    </div>
  );
}
