"use client";

import { Search } from "lucide-react";
import { useLanguage } from "@/context/LanguageContext";

export default function HomeSearchBox() {
  const { t } = useLanguage();

  return (
    <section className="max-w-4xl w-full mx-auto px-3 sm:px-4 -mt-6 sm:-mt-10 relative z-20">
      <form action="/search" method="GET" className="relative group/search">
        <div className="relative flex items-center">
          <Search className="absolute left-4 sm:left-6 w-4 sm:w-5 h-4 sm:h-5 text-purple-400/60 group-focus-within/search:text-rose-400 transition-colors" />
          <input
            type="text"
            name="q"
            placeholder={t("nav.searchPlaceholder")}
            className="w-full bg-slate-900/95 sm:backdrop-blur-2xl border border-purple-500/30 text-slate-100 pl-11 sm:pl-16 pr-24 sm:pr-32 py-3.5 sm:py-5 rounded-full focus:outline-none focus:ring-2 focus:ring-rose-500/50 focus:border-rose-500/50 shadow-[0_15px_50px_rgba(0,0,0,0.6)] text-xs sm:text-base md:text-lg transition-all placeholder:text-purple-300/40"
          />
          <button
            type="submit"
            className="absolute right-1.5 sm:right-2.5 bg-gradient-to-r from-rose-600 to-purple-600 hover:from-rose-500 hover:to-purple-500 text-white font-bold px-4 sm:px-6 py-2 sm:py-2.5 rounded-full text-xs sm:text-sm transition-all shadow-md min-h-[36px]"
          >
            {t("nav.search")}
          </button>
        </div>
      </form>
    </section>
  );
}
