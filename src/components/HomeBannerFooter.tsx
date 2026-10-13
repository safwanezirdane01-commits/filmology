"use client";

import Link from "next/link";
import { useLanguage } from "@/context/LanguageContext";

export default function HomeBannerFooter() {
  const { t } = useLanguage();

  return (
    <>
      {/* Official Brand Showcase Banner */}
      <section className="max-w-7xl mx-auto w-full px-4 sm:px-6 lg:px-8 pb-16">
        <div className="relative rounded-3xl overflow-hidden border border-purple-500/30 shadow-[0_0_50px_rgba(168,85,247,0.25)] group">
          <img
            src="/banner.png"
            alt="FilmologyX Official Cinematic Banner"
            className="w-full h-auto object-cover max-h-[360px] sm:max-h-[440px] transform group-hover:scale-[1.01] transition-transform duration-700"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/20 to-transparent pointer-events-none" />
          <div className="absolute bottom-4 sm:bottom-8 left-4 sm:left-8 right-4 sm:right-8 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div>
              <p className="text-rose-400 text-xs sm:text-sm font-bold uppercase tracking-wider">
                {t("footer.hubTag")}
              </p>
              <h3 className="text-lg sm:text-2xl font-black text-white">
                {t("footer.hubTitle")}
              </h3>
            </div>
            <a
              href="#search-section"
              className="px-5 py-2.5 rounded-full bg-gradient-to-r from-rose-600 to-purple-600 hover:from-rose-500 hover:to-purple-500 text-white font-bold text-xs sm:text-sm shadow-xl flex items-center gap-2 transition-all hover:scale-105 active:scale-95 cursor-pointer"
            >
              {t("footer.startWatching")}
            </a>
          </div>
        </div>
      </section>

      {/* Sleek Modern Footer */}
      <footer className="bg-slate-950 border-t border-purple-900/30 py-12 mt-auto relative overflow-hidden">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-[1px] bg-gradient-to-r from-transparent via-rose-500/50 to-transparent"></div>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8 relative z-10">
          <div className="flex flex-col md:flex-row items-center justify-between gap-6">
            <Link href="/" className="flex items-center space-x-3 rtl:space-x-reverse group cursor-pointer">
              <img
                src="/logo.png"
                alt="FilmologyX Logo"
                className="w-8 h-8 rounded-xl object-contain drop-shadow-[0_0_12px_rgba(244,63,94,0.6)] group-hover:scale-105 transition-transform"
              />
              <span className="font-bold text-xl tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-white to-purple-200">
                Filmology<span className="text-rose-500">X</span>
              </span>
            </Link>

            {/* Footer Navigation Links */}
            <div className="flex flex-wrap items-center justify-center gap-6 text-xs font-semibold text-slate-400">
              <Link href="/movies" className="hover:text-white transition-colors">{t("nav.movies")}</Link>
              <Link href="/series" className="hover:text-white transition-colors">{t("nav.series")}</Link>
              <Link href="/search" className="hover:text-white transition-colors">{t("nav.search")}</Link>
              <Link href="/dmca" className="text-rose-400/90 hover:text-rose-300 transition-colors font-bold flex items-center gap-1">
                <span>🛡️</span> {t("nav.dmca")}
              </Link>
              <a href="mailto:dmca.filmologyx@gmail.com" className="hover:text-white transition-colors">
                {t("nav.contact")}
              </a>
            </div>
          </div>

          <div className="pt-6 border-t border-purple-900/20 flex flex-col md:flex-row items-center justify-between gap-4 text-center md:text-left rtl:md:text-right">
            <p className="text-[11px] text-slate-500 max-w-2xl leading-relaxed">
              {t("footer.disclaimer")}
            </p>
            <p className="text-purple-300/50 text-[11px] font-medium shrink-0">
              &copy; {new Date().getFullYear()} FilmologyX. {t("footer.rights")}
            </p>
          </div>
        </div>
      </footer>
    </>
  );
}
