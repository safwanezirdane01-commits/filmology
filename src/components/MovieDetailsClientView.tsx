"use client";

import Link from "next/link";
import { Star, Sparkles, Film, Play, Users } from "lucide-react";
import WatchTrailerButton from "@/components/WatchTrailerButton";
import WatchlistButton from "@/app/movie/[id]/WatchlistButton";
import ShareButton from "@/components/ShareButton";
import { useLanguage } from "@/context/LanguageContext";

interface MovieData {
  id: string;
  title: string;
  genre: string;
  releaseYear: number;
  description: string;
  descriptionAr?: string | null;
  videoUrl?: string | null;
  thumbnailUrl: string | null;
  backdropUrl?: string | null;
}

interface CastMember {
  id: number;
  name: string;
  character: string;
  profileUrl: string | null;
}

interface RelatedMovie {
  id: string;
  title: string;
  genre: string;
  thumbnailUrl: string | null;
}

export default function MovieDetailsClientView({
  movie,
  castMembers,
  relatedMovies,
  isTv,
}: {
  movie: MovieData;
  castMembers: CastMember[];
  relatedMovies: RelatedMovie[];
  isTv: boolean;
}) {
  const { t, isArabic, dir, translateGenre } = useLanguage();

  const displayDescription = isArabic && movie.descriptionAr && movie.descriptionAr.trim().length > 0
    ? movie.descriptionAr
    : movie.description;

  return (
    <div className="space-y-6 sm:space-y-10" dir={dir}>
      {/* Movie Details & Action Header */}
      <div className="bg-slate-900/90 sm:backdrop-blur-2xl p-4 sm:p-7 md:p-10 rounded-2xl sm:rounded-3xl border border-purple-900/40 shadow-2xl relative overflow-hidden">
        <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-rose-500 via-purple-500 to-rose-500"></div>
        <div className="absolute top-0 right-0 w-60 sm:w-80 h-60 sm:h-80 bg-rose-500/10 blur-[80px] sm:blur-[100px] pointer-events-none rounded-full"></div>
        
        <div className="flex flex-col sm:flex-row justify-between items-start gap-4 sm:gap-6 mb-4 sm:mb-6 relative z-10">
          <div>
            {/* Badges Bar */}
            <div className="flex flex-wrap items-center gap-2 sm:gap-2.5 mb-2.5 sm:mb-3">
              <span className="bg-rose-500/15 text-rose-300 border border-rose-500/30 px-2.5 sm:px-3 py-0.5 sm:py-1 rounded-full uppercase tracking-wider text-[10px] sm:text-xs font-bold">
                {translateGenre(movie.genre)}
              </span>
              <span className="bg-slate-800/80 px-2.5 sm:px-3 py-0.5 sm:py-1 rounded-full border border-purple-500/20 text-[10px] sm:text-xs font-semibold text-purple-200">
                {movie.releaseYear}
              </span>
              <span className="bg-amber-500/10 text-amber-300 border border-amber-500/25 px-2 sm:px-2.5 py-0.5 sm:py-1 rounded-full text-[10px] sm:text-xs font-bold flex items-center space-x-1 rtl:space-x-reverse">
                <Star className="w-2.5 sm:w-3 h-2.5 sm:h-3 fill-current text-amber-400" />
                <span>8.8 / 10 IMDb</span>
              </span>
              <span className="bg-slate-800/80 text-purple-300 border border-purple-500/20 px-2 sm:px-2.5 py-0.5 sm:py-1 rounded-full text-[10px] sm:text-xs font-bold">
                {t("details.quality")}
              </span>
              <span className="bg-slate-800/80 text-purple-300 border border-purple-500/20 px-2 sm:px-2.5 py-0.5 sm:py-1 rounded-full text-[10px] sm:text-xs font-bold">
                {t("details.audio")}
              </span>
            </div>

            {/* Movie Title: STRICTLY KEEP IN ORIGINAL ENGLISH, NEVER TRANSLATE */}
            <h1 
              dir="ltr"
              className="original-title text-2xl sm:text-4xl md:text-5xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-white via-rose-100 to-purple-200 tracking-tight leading-tight"
            >
              {movie.title}
            </h1>
          </div>

          {/* Action Buttons: Watch Trailer, Watchlist, Share */}
          <div className="flex flex-wrap items-center gap-2.5 sm:gap-3 shrink-0 w-full sm:w-auto">
            <WatchTrailerButton id={movie.videoUrl || movie.id} title={movie.title} isTv={Boolean(isTv)} variant="primary" />
            <WatchlistButton 
              movieId={movie.id} 
              title={movie.title}
              thumbnailUrl={movie.thumbnailUrl}
              genre={movie.genre}
              releaseYear={movie.releaseYear}
            />
            <ShareButton title={movie.title} />
          </div>
        </div>
        
        {/* Description: Native Arabic when Arabic selected, otherwise original English */}
        <p className="text-slate-300 text-sm sm:text-base md:text-lg leading-relaxed font-light relative z-10 max-w-4xl" dir={isArabic ? "rtl" : "ltr"}>
          {displayDescription}
        </p>
      </div>

      {/* Top Cast Shelf */}
      {castMembers.length > 0 && (
        <div className="space-y-3 sm:space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-xl sm:text-2xl font-bold text-white flex items-center space-x-2 rtl:space-x-reverse">
              <Users className="w-4 sm:w-5 h-4 sm:h-5 text-rose-400" />
              <span>{t("details.topCast")}</span>
            </h2>
          </div>

          <div className="flex gap-3 sm:gap-4 overflow-x-auto pb-2 scrollbar-none contain-paint">
            {castMembers.map((actor) => (
              <div
                key={actor.id}
                className="flex flex-col items-center text-center shrink-0 w-24 sm:w-28 group"
              >
                <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-full overflow-hidden bg-slate-800 border-2 border-purple-500/20 group-hover:border-rose-500/60 transition-colors mb-2 shadow-md">
                  {actor.profileUrl ? (
                    <img
                      src={actor.profileUrl}
                      alt={actor.name}
                      loading="lazy"
                      decoding="async"
                      className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center bg-slate-800 text-slate-500">
                      <Users className="w-6 h-6" />
                    </div>
                  )}
                </div>
                <h4 className="original-title text-white text-xs font-semibold line-clamp-1 group-hover:text-rose-300 transition-colors" dir="ltr">
                  {actor.name}
                </h4>
                {actor.character && (
                  <p className="original-title text-[10px] text-slate-400 line-clamp-1" dir="ltr">
                    {actor.character}
                  </p>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* "More Like This" Recommended Movies Row */}
      {relatedMovies.length > 0 && (
        <div className="space-y-4 sm:space-y-6">
          <div className="flex items-center justify-between">
            <h2 className="text-xl sm:text-2xl font-bold text-white flex items-center space-x-2 rtl:space-x-reverse">
              <Sparkles className="w-4 sm:w-5 h-4 sm:h-5 text-rose-400" />
              <span>{t("details.moreLikeThis")}</span>
            </h2>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-3 sm:gap-4">
            {relatedMovies.map((rel) => (
              <Link
                href={`/movie/${rel.id}`}
                key={rel.id}
                className="group relative flex flex-col cursor-pointer"
              >
                <div className="relative aspect-[2/3] bg-slate-900 rounded-xl sm:rounded-2xl overflow-hidden border border-purple-900/30 transition-all duration-300 sm:group-hover:-translate-y-1.5 sm:group-hover:shadow-[0_15px_30px_rgba(244,63,94,0.3)] sm:group-hover:border-rose-500/50 contain-paint gpu-layer">
                  {rel.thumbnailUrl ? (
                    <img
                      src={rel.thumbnailUrl}
                      alt={rel.title}
                      loading="lazy"
                      decoding="async"
                      className="w-full h-full object-cover transition-transform duration-300 sm:group-hover:scale-105"
                    />
                  ) : (
                    <div className="w-full h-full flex flex-col items-center justify-center bg-slate-900 p-3 text-center">
                      <Film className="w-8 h-8 text-purple-900/50 mb-1" />
                      <span className="original-title text-purple-300/50 text-[10px]" dir="ltr">{rel.title}</span>
                    </div>
                  )}
                  <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/20 to-transparent opacity-80" />
                  
                  <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                    <div className="bg-gradient-to-r from-rose-600 to-purple-600 rounded-full p-2.5 sm:p-3 shadow-lg">
                      <Play className="w-3.5 sm:w-4 h-3.5 sm:h-4 text-white fill-current ml-0.5" />
                    </div>
                  </div>

                  <div className="absolute bottom-0 left-0 right-0 p-2.5 sm:p-3">
                    <p className="text-[9px] sm:text-[10px] text-rose-400 font-bold uppercase line-clamp-1">
                      {translateGenre(rel.genre)}
                    </p>
                    <h4 className="original-title text-white text-xs font-bold truncate group-hover:text-rose-200 transition-colors" dir="ltr">
                      {rel.title}
                    </h4>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
