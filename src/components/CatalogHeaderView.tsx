"use client";

import Link from "next/link";
import { Clapperboard, Tv, Film, Filter } from "lucide-react";
import CatalogSortBar from "@/components/CatalogSortBar";
import { useLanguage } from "@/context/LanguageContext";

interface GenreItem {
  id: string;
  label: string;
}

export default function CatalogHeaderView({
  type = "movies",
  activeGenre,
  currentPage,
  sort,
  genres,
}: {
  type?: "movies" | "series";
  activeGenre: string;
  currentPage: number;
  sort: string;
  genres: GenreItem[];
}) {
  const { t, isArabic, dir, translateGenre } = useLanguage();
  const basePath = type === "movies" ? "/movies" : "/series";

  const isMovies = type === "movies";
  const catalogBadge = isMovies ? t("movies.catalog") : t("series.catalog");
  const pageTitle = isMovies ? t("movies.title") : t("series.title");
  const pageSubtitle = isMovies ? t("movies.subtitle") : t("series.subtitle");
  const filterLabel = isMovies ? t("common.genre") : t("common.category");

  return (
    <div className="space-y-4 sm:space-y-6" dir={dir}>
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 border-b border-purple-900/30 pb-5">
        <div>
          <div className="flex items-center space-x-2 rtl:space-x-reverse text-rose-400 text-xs font-bold uppercase tracking-wider mb-1">
            {isMovies ? <Clapperboard className="w-4 h-4" /> : <Tv className="w-4 h-4 text-purple-400" />}
            <span>{catalogBadge}</span>
          </div>
          <h1 className="text-2xl sm:text-4xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-white via-rose-100 to-purple-200 tracking-tight">
            {pageTitle}
          </h1>
          <p className="text-slate-400 text-xs sm:text-sm mt-1 max-w-3xl leading-relaxed">
            {pageSubtitle}
          </p>
        </div>

        <div className="flex items-center space-x-2.5 rtl:space-x-reverse">
          <CatalogSortBar currentSort={sort} basePath={basePath} currentGenre={activeGenre} />
          <div className="flex items-center space-x-1.5 rtl:space-x-reverse bg-slate-900 border border-purple-500/20 px-3 py-1.5 rounded-full text-xs font-semibold text-purple-300">
            {isMovies ? <Film className="w-3.5 h-3.5 text-rose-400" /> : <Tv className="w-3.5 h-3.5 text-purple-400" />}
            <span>{t("common.page")} {currentPage}</span>
          </div>
        </div>
      </div>

      {/* Genre Filter Pills */}
      <div className="flex items-center space-x-2 rtl:space-x-reverse overflow-x-auto pb-2 scrollbar-none contain-paint">
        <div className="flex items-center space-x-1.5 rtl:space-x-reverse text-slate-400 text-xs font-semibold shrink-0 pr-1 rtl:pr-0 rtl:pl-1">
          <Filter className="w-3.5 h-3.5 text-rose-400" />
          <span className="hidden sm:inline">{filterLabel}</span>
        </div>
        {genres.map((g) => (
          <Link
            key={g.id}
            href={`${basePath}?genre=${g.id}&page=1&sort=${sort}`}
            className={`px-3.5 py-1.5 rounded-full text-xs font-bold transition-all shrink-0 active:scale-95 cursor-pointer ${
              activeGenre === g.id
                ? "bg-gradient-to-r from-rose-600 to-purple-600 text-white shadow-md shadow-rose-600/30"
                : "bg-slate-900/80 hover:bg-slate-800 text-slate-300 border border-purple-500/20"
            }`}
          >
            {translateGenre(g.label)}
          </Link>
        ))}
      </div>
    </div>
  );
}
