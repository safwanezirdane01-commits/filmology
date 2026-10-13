"use client";

import Link from "next/link";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { useLanguage } from "@/context/LanguageContext";

export default function CatalogPaginationView({
  basePath,
  activeGenre,
  currentPage,
  sort,
}: {
  basePath: string;
  activeGenre: string;
  currentPage: number;
  sort: string;
}) {
  const { t, isArabic } = useLanguage();

  return (
    <div className="flex items-center justify-center space-x-3 rtl:space-x-reverse pt-6">
      {currentPage > 1 && (
        <Link
          href={`${basePath}?genre=${activeGenre}&page=${currentPage - 1}&sort=${sort}`}
          className="flex items-center space-x-1.5 rtl:space-x-reverse px-4 py-2 rounded-xl bg-slate-900 hover:bg-slate-800 border border-purple-500/20 text-slate-200 text-xs font-bold transition-all"
        >
          {isArabic ? <ChevronRight className="w-4 h-4" /> : <ChevronLeft className="w-4 h-4" />}
          <span>{t("common.prev")}</span>
        </Link>
      )}
      <span className="text-xs text-slate-400 px-3 py-2 bg-slate-900/60 rounded-xl border border-purple-500/10">
        {t("common.page")} <strong className="text-white">{currentPage}</strong>
      </span>
      <Link
        href={`${basePath}?genre=${activeGenre}&page=${currentPage + 1}&sort=${sort}`}
        className="flex items-center space-x-1.5 rtl:space-x-reverse px-4 py-2 rounded-xl bg-gradient-to-r from-rose-600 to-purple-600 hover:from-rose-500 hover:to-purple-500 text-white text-xs font-bold transition-all shadow"
      >
        <span>{t("common.next")}</span>
        {isArabic ? <ChevronLeft className="w-4 h-4" /> : <ChevronRight className="w-4 h-4" />}
      </Link>
    </div>
  );
}
