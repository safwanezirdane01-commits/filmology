"use client";

import Link from "next/link";
import { Zap, ShieldCheck, Clapperboard, Flame, Star, Tv } from "lucide-react";
import { useLanguage } from "@/context/LanguageContext";
import MovieShelf from "@/components/MovieShelf";

interface MovieItem {
  id: string;
  title: string;
  genre: string;
  releaseYear: number;
  videoUrl?: string;
  thumbnailUrl: string;
  description?: string;
  backdropUrl?: string | null;
  voteAverage?: number;
  mediaType?: "movie" | "tv";
}

interface HomeClientWrapperProps {
  liveTrending: MovieItem[];
  topRatedShelves: MovieItem[];
  tvSeries: MovieItem[];
}

export default function HomeClientWrapper({
  liveTrending,
  topRatedShelves,
  tvSeries,
}: HomeClientWrapperProps) {
  const { t, isArabic } = useLanguage();

  return (
    <>
      {/* Feature Highlights Bar */}
      <section className="max-w-7xl mx-auto w-full px-3 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-2.5 sm:gap-4">
          <div className="bg-slate-900/40 border border-purple-900/30 rounded-xl sm:rounded-2xl p-3 sm:p-4 flex items-center space-x-3 rtl:space-x-reverse sm:backdrop-blur-md">
            <div className="bg-rose-500/10 p-2 sm:p-2.5 rounded-lg sm:rounded-xl text-rose-400 border border-rose-500/20 shrink-0">
              <Zap className="w-4 sm:w-5 h-4 sm:h-5" />
            </div>
            <div>
              <h4 className="text-white text-xs sm:text-sm font-bold">{t("features.fastTitle")}</h4>
              <p className="text-[11px] sm:text-xs text-slate-400">{t("features.fastDesc")}</p>
            </div>
          </div>

          <div className="bg-slate-900/40 border border-purple-900/30 rounded-xl sm:rounded-2xl p-3 sm:p-4 flex items-center space-x-3 rtl:space-x-reverse sm:backdrop-blur-md">
            <div className="bg-purple-500/10 p-2 sm:p-2.5 rounded-lg sm:rounded-xl text-purple-400 border border-purple-500/20 shrink-0">
              <Clapperboard className="w-4 sm:w-5 h-4 sm:h-5" />
            </div>
            <div>
              <h4 className="text-white text-xs sm:text-sm font-bold">{t("features.libraryTitle")}</h4>
              <p className="text-[11px] sm:text-xs text-slate-400">{t("features.libraryDesc")}</p>
            </div>
          </div>

          <div className="bg-slate-900/40 border border-purple-900/30 rounded-xl sm:rounded-2xl p-3 sm:p-4 flex items-center space-x-3 rtl:space-x-reverse sm:backdrop-blur-md sm:col-span-2 md:col-span-1">
            <div className="bg-emerald-500/10 p-2 sm:p-2.5 rounded-lg sm:rounded-xl text-emerald-400 border border-emerald-500/20 shrink-0">
              <ShieldCheck className="w-4 sm:w-5 h-4 sm:h-5" />
            </div>
            <div>
              <h4 className="text-white text-xs sm:text-sm font-bold">{t("features.freeTitle")}</h4>
              <p className="text-[11px] sm:text-xs text-slate-400">{t("features.freeDesc")}</p>
            </div>
          </div>
        </div>
      </section>

      {/* 🌟 CURATED SHELVES: DYNAMIC CONTENT ROWS */}
      <section className="max-w-7xl mx-auto w-full px-4 sm:px-6 lg:px-8 space-y-10 sm:space-y-12">
        {/* Shelf 1: Trending Worldwide */}
        {liveTrending.length > 0 && (
          <MovieShelf
            title={t("shelf.trendingTitle")}
            badgeText={t("shelf.trendingBadge")}
            icon={<Flame className="w-5 sm:w-6 h-5 sm:h-6 text-rose-500 fill-current" />}
            subtitle={t("shelf.trendingSubtitle")}
            movies={liveTrending.slice(0, 15)}
          />
        )}

        {/* Shelf 2: All-Time Masterpieces */}
        {topRatedShelves.length > 0 && (
          <MovieShelf
            title={t("shelf.masterpiecesTitle")}
            badgeText={t("shelf.masterpiecesBadge")}
            icon={<Star className="w-5 sm:w-6 h-5 sm:h-6 text-amber-400 fill-current" />}
            subtitle={t("shelf.masterpiecesSubtitle")}
            movies={topRatedShelves}
          />
        )}

        {/* Shelf 3: Binge-Worthy TV Series */}
        {tvSeries.length > 0 && (
          <MovieShelf
            title={t("shelf.seriesTitle")}
            badgeText={t("shelf.seriesBadge")}
            icon={<Tv className="w-5 sm:w-6 h-5 sm:h-6 text-purple-400" />}
            subtitle={t("shelf.seriesSubtitle")}
            movies={tvSeries}
          />
        )}
      </section>

      {/* Browse Film Collection Heading */}
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl sm:text-3xl font-extrabold text-white flex items-center tracking-tight">
          <span className="bg-gradient-to-b from-rose-500 to-purple-600 w-1.5 h-7 mr-3.5 rtl:mr-0 rtl:ml-3.5 rounded-full shadow-[0_0_12px_rgba(244,63,94,0.6)]"></span>
          {t("catalog.browse")}
        </h2>
        <span className="text-xs text-purple-300/70 font-semibold">
          {t("catalog.count")}
        </span>
      </div>
    </>
  );
}
