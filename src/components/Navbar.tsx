"use client";

import Link from "next/link";
import { useSession, signOut } from "next-auth/react";
import { Film, Search, Menu, X, User, ShieldCheck, LogOut, Clapperboard, Tv, Star, Loader2, ArrowRight, MoreVertical, Globe, Check } from "lucide-react";
import { useState, useRef, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useLanguage, Language } from "@/context/LanguageContext";

const AVAILABLE_LANGUAGES: Array<{ code: Language; label: string; flag: string; font?: string }> = [
  { code: "en", label: "English", flag: "🇬🇧" },
  { code: "ar", label: "العربية", flag: "🇸🇦", font: "'Cairo', sans-serif" },
  { code: "fr", label: "Français", flag: "🇫🇷" },
  { code: "pt", label: "Português", flag: "🇧🇷" },
  { code: "es", label: "Español", flag: "🇪🇸" },
  { code: "de", label: "Deutsch", flag: "🇩🇪" },
];

export default function Navbar() {
  const { data: session, status } = useSession();
  const { language, setLanguage, t, translateGenre } = useLanguage();
  const [searchQuery, setSearchQuery] = useState("");
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [mobileSearchOpen, setMobileSearchOpen] = useState(false);
  const [moreMenuOpen, setMoreMenuOpen] = useState(false);
  const mobileSearchInputRef = useRef<HTMLInputElement>(null);
  const searchContainerRef = useRef<HTMLDivElement>(null);
  const moreMenuRef = useRef<HTMLDivElement>(null);
  const mobileMoreMenuRef = useRef<HTMLDivElement>(null);
  const router = useRouter();

  // Instant autocomplete state
  const [liveResults, setLiveResults] = useState<any[]>([]);
  const [isSearching, setIsSearching] = useState(false);
  const [showDropdown, setShowDropdown] = useState(false);

  useEffect(() => {
    if (mobileSearchOpen && mobileSearchInputRef.current) {
      mobileSearchInputRef.current.focus();
    }
  }, [mobileSearchOpen]);

  // Debounced live search
  useEffect(() => {
    const q = searchQuery.trim();
    if (!q || q.length < 2) {
      setLiveResults([]);
      setIsSearching(false);
      setShowDropdown(false);
      return;
    }

    setIsSearching(true);
    setShowDropdown(true);

    const timer = setTimeout(() => {
      fetch(`/api/search?q=${encodeURIComponent(q)}`)
        .then((res) => res.json())
        .then((data) => {
          if (data.results) {
            setLiveResults(data.results.slice(0, 5));
          }
        })
        .catch(() => {})
        .finally(() => setIsSearching(false));
    }, 250);

    return () => clearTimeout(timer);
  }, [searchQuery]);

  // Click outside listener to close all dropdowns
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (searchContainerRef.current && !searchContainerRef.current.contains(e.target as Node)) {
        setShowDropdown(false);
      }
      // Close more menu if clicking outside both desktop and mobile more-menu refs
      const clickedInsideMore =
        (moreMenuRef.current && moreMenuRef.current.contains(e.target as Node)) ||
        (mobileMoreMenuRef.current && mobileMoreMenuRef.current.contains(e.target as Node));
      if (!clickedInsideMore) {
        setMoreMenuOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      setShowDropdown(false);
      router.push(`/search?q=${encodeURIComponent(searchQuery.trim())}`);
      setMobileSearchOpen(false);
      setMobileMenuOpen(false);
      setMoreMenuOpen(false);
    }
  };

  /** Shared language dropdown panel used in both desktop and mobile ⋮ menus */
  const LanguageDropdownPanel = () => (
    <div className="bg-slate-900 border border-purple-500/30 rounded-2xl shadow-2xl overflow-hidden animate-in fade-in slide-in-from-top-2 duration-150 w-56">
      {/* Language Section */}
      <div className="px-3 pt-3 pb-1">
        <p className="text-[10px] font-bold uppercase tracking-wider text-purple-400/70 flex items-center gap-1.5 mb-2">
          <Globe className="w-3 h-3" />
          {t("nav.language")}
        </p>
        <div className="space-y-1">
          {AVAILABLE_LANGUAGES.map((lang) => {
            const isSelected = language === lang.code;
            return (
              <button
                key={lang.code}
                type="button"
                onClick={() => { setLanguage(lang.code); setMoreMenuOpen(false); }}
                className={`w-full flex items-center justify-between px-3 py-2 rounded-xl text-sm transition-all ${
                  isSelected
                    ? "bg-rose-500/20 text-white border border-rose-500/40 font-bold"
                    : "text-slate-300 hover:bg-slate-800 hover:text-white font-medium border border-transparent"
                }`}
                style={lang.font ? { fontFamily: lang.font } : undefined}
              >
                <span className="flex items-center gap-2.5">
                  <span className="text-base">{lang.flag}</span>
                  <span>{lang.label}</span>
                </span>
                {isSelected && <Check className="w-3.5 h-3.5 text-rose-400 shrink-0" />}
              </button>
            );
          })}
        </div>
      </div>

      {/* Divider + Quick Links */}
      <div className="border-t border-purple-900/30 px-3 py-2 space-y-0.5">
        <Link
          href="/dmca"
          onClick={() => setMoreMenuOpen(false)}
          className="flex items-center gap-2.5 px-3 py-2 rounded-xl text-xs text-slate-400 hover:text-white hover:bg-slate-800 transition-colors font-medium"
        >
          <span>🛡️</span>
          <span>{t("nav.dmca")}</span>
        </Link>
        <a
          href="mailto:dmca.filmologyx@gmail.com"
          onClick={() => setMoreMenuOpen(false)}
          className="flex items-center gap-2.5 px-3 py-2 rounded-xl text-xs text-slate-400 hover:text-white hover:bg-slate-800 transition-colors font-medium"
        >
          <span>✉️</span>
          <span>{t("nav.contact")}</span>
        </a>
      </div>
    </div>
  );

  return (
    <nav className="sticky top-0 z-50 bg-slate-950/95 border-b border-purple-900/30 shadow-[0_4px_25px_rgba(0,0,0,0.4)]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 gap-2">

          {/* Logo & Navigation Links */}
          <div className="flex items-center space-x-4 sm:space-x-6 shrink-0">
            <Link
              href="/"
              className="flex items-center space-x-2 text-white group"
              onClick={() => {
                setMobileMenuOpen(false);
                setMobileSearchOpen(false);
                setMoreMenuOpen(false);
                setShowDropdown(false);
              }}
            >
              <img
                src="/logo.png"
                alt="FilmologyX Logo"
                className="w-8 h-8 sm:w-9 sm:h-9 rounded-xl object-contain drop-shadow-[0_0_12px_rgba(244,63,94,0.6)] group-hover:scale-105 transition-transform"
              />
              <span className="font-bold text-lg sm:text-xl tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-white to-purple-200">
                Filmology<span className="text-rose-500 group-hover:text-rose-400 transition-colors">X</span>
              </span>
            </Link>

            {/* Desktop Navigation Links */}
            <div className="hidden lg:flex items-center space-x-1">
              <Link
                href="/movies"
                className="text-slate-300 hover:text-white hover:bg-purple-900/30 px-3 py-1.5 rounded-full text-xs font-semibold transition-all flex items-center space-x-1.5"
              >
                <Clapperboard className="w-3.5 h-3.5 text-rose-400" />
                <span>{t("nav.movies")}</span>
              </Link>
              <Link
                href="/series"
                className="text-slate-300 hover:text-white hover:bg-purple-900/30 px-3 py-1.5 rounded-full text-xs font-semibold transition-all flex items-center space-x-1.5"
              >
                <Tv className="w-3.5 h-3.5 text-purple-400" />
                <span>{t("nav.series")}</span>
              </Link>
            </div>
          </div>

          {/* Desktop Search Bar with Live Instant Autocomplete */}
          <div ref={searchContainerRef} className="hidden md:flex flex-1 max-w-md mx-4 lg:mx-6 relative">
            <form onSubmit={handleSearch} className="w-full relative group">
              <div className="relative flex items-center">
                <Search className="absolute left-3.5 w-4 h-4 text-purple-300/60 group-focus-within:text-rose-400 transition-colors" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  onFocus={() => {
                    if (searchQuery.trim().length >= 2) setShowDropdown(true);
                  }}
                  placeholder={t("nav.searchPlaceholder")}
                  className="w-full bg-slate-900/70 border border-purple-900/50 text-slate-100 pl-10 pr-10 py-2 rounded-full focus:outline-none focus:ring-2 focus:ring-rose-500/50 focus:border-rose-500/50 focus:bg-slate-900 text-sm transition-all placeholder:text-purple-300/40"
                />
                {isSearching && (
                  <Loader2 className="absolute right-3.5 w-4 h-4 text-rose-400 animate-spin" />
                )}
              </div>
            </form>

            {/* Live Autocomplete Dropdown */}
            {showDropdown && searchQuery.trim().length >= 2 && (
              <div className="absolute top-full left-0 right-0 mt-2 bg-slate-900 border border-purple-500/30 rounded-2xl shadow-2xl overflow-hidden z-50 animate-in fade-in slide-in-from-top-2 duration-150">
                {liveResults.length > 0 ? (
                  <div className="divide-y divide-purple-900/20">
                    {liveResults.map((item) => (
                      <Link
                        key={item.id}
                        href={`/movie/${item.id}`}
                        onClick={() => {
                          setShowDropdown(false);
                          setSearchQuery("");
                        }}
                        className="flex items-center space-x-3 p-2.5 hover:bg-slate-800 transition-colors"
                      >
                        <div className="w-9 h-12 bg-slate-800 rounded-md overflow-hidden shrink-0 border border-purple-500/20">
                          {item.thumbnailUrl && item.thumbnailUrl !== "/placeholder.png" ? (
                            <img
                              src={item.thumbnailUrl}
                              alt={item.title}
                              className="w-full h-full object-cover"
                              loading="lazy"
                            />
                          ) : (
                            <div className="w-full h-full flex items-center justify-center text-slate-500">
                              <Film className="w-4 h-4" />
                            </div>
                          )}
                        </div>
                        <div className="flex-1 min-w-0">
                          {/* Movie title always stays in original language (no translation) */}
                          <h4 className="text-white text-xs font-bold truncate original-title" dir="ltr">{item.title}</h4>
                          <div className="flex items-center space-x-2 text-[10px] text-slate-400 mt-0.5">
                            <span className="text-rose-400 font-semibold">{translateGenre(item.genre)}</span>
                            <span>•</span>
                            <span>{item.releaseYear}</span>
                            {item.mediaType === "tv" && (
                              <span className="bg-purple-900/40 text-purple-300 px-1.5 py-0.5 rounded text-[9px] font-bold">
                                TV
                              </span>
                            )}
                          </div>
                        </div>
                        {item.voteAverage && (
                          <div className="flex items-center space-x-1 text-[11px] text-amber-300 font-bold bg-amber-500/10 px-2 py-0.5 rounded-full shrink-0">
                            <Star className="w-3 h-3 fill-current text-amber-400" />
                            <span>{item.voteAverage.toFixed(1)}</span>
                          </div>
                        )}
                      </Link>
                    ))}
                    <button
                      type="button"
                      onClick={(e) => handleSearch(e)}
                      className="w-full py-2.5 px-4 text-xs font-bold text-rose-400 hover:text-white hover:bg-rose-600/20 transition-colors flex items-center justify-center space-x-1 text-center"
                    >
                      <span>{t("nav.seeAllResults")} &quot;{searchQuery}&quot;</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </button>
                  </div>
                ) : !isSearching ? (
                  <div className="p-4 text-center text-xs text-slate-400">
                    No matching titles found. Press Enter to search everywhere.
                  </div>
                ) : null}
              </div>
            )}
          </div>

          {/* Desktop Auth Controls + 3-dots */}
          <div className="hidden md:flex items-center space-x-3">
            {status === "loading" ? (
              <div className="text-purple-300/50 text-xs animate-pulse">Loading...</div>
            ) : session ? (
              <>
                {session.user.role === "ADMIN" && (
                  <Link
                    href="/admin"
                    className="text-slate-300 hover:text-white hover:bg-purple-900/30 px-3 py-1.5 rounded-full text-xs font-medium transition-all"
                  >
                    Admin
                  </Link>
                )}
                <Link
                  href="/profile"
                  className="text-slate-300 hover:text-white hover:bg-purple-900/30 px-3 py-1.5 rounded-full text-xs font-medium transition-all flex items-center space-x-1"
                >
                  <User className="w-3.5 h-3.5" />
                  <span>{t("nav.profile")}</span>
                </Link>
                <button
                  onClick={() => signOut()}
                  className="bg-rose-500/10 text-rose-400 hover:bg-rose-500 hover:text-white px-4 py-1.5 rounded-full text-xs font-medium transition-all"
                >
                  {t("nav.logout")}
                </button>
              </>
            ) : (
              <>
                <Link
                  href="/login"
                  className="text-slate-300 hover:text-white hover:bg-purple-900/30 px-4 py-2 rounded-full text-xs sm:text-sm font-medium transition-all"
                >
                  {t("nav.login")}
                </Link>
                <Link
                  href="/register"
                  className="bg-gradient-to-r from-rose-600 to-purple-600 hover:from-rose-500 hover:to-purple-500 text-white px-4 py-2 rounded-full text-xs sm:text-sm font-medium transition-all shadow-[0_0_15px_rgba(244,63,94,0.3)]"
                >
                  {t("nav.signup")}
                </Link>
              </>
            )}

            {/* ⋮ Desktop 3-Dots Menu */}
            <div ref={moreMenuRef} className="relative">
              <button
                type="button"
                onClick={() => setMoreMenuOpen((prev) => !prev)}
                aria-label={t("nav.options")}
                title={t("nav.options")}
                className={`p-2 rounded-xl border transition-all active:scale-95 ${
                  moreMenuOpen
                    ? "bg-purple-900/50 border-purple-500/60 text-white shadow-[0_0_12px_rgba(139,92,246,0.3)]"
                    : "text-slate-300 hover:text-white hover:bg-slate-900/70 border-purple-500/20"
                }`}
              >
                <MoreVertical className="w-4 h-4" />
              </button>
              {moreMenuOpen && (
                <div className="absolute top-full right-0 mt-2 z-50">
                  <LanguageDropdownPanel />
                </div>
              )}
            </div>
          </div>

          {/* Mobile Action Icons */}
          <div className="flex md:hidden items-center space-x-2">
            {/* Mobile Search toggle */}
            <button
              type="button"
              onClick={() => {
                setMobileSearchOpen(!mobileSearchOpen);
                if (mobileMenuOpen) setMobileMenuOpen(false);
                if (moreMenuOpen) setMoreMenuOpen(false);
              }}
              aria-label="Toggle search"
              className="p-2 rounded-xl text-slate-300 hover:text-white hover:bg-slate-900/70 border border-purple-500/20 active:scale-95 transition-all"
            >
              <Search className="w-5 h-5 text-rose-400" />
            </button>

            {/* Mobile ⋮ 3-Dots */}
            <div ref={mobileMoreMenuRef} className="relative">
              <button
                type="button"
                onClick={() => {
                  setMoreMenuOpen((prev) => !prev);
                  if (mobileMenuOpen) setMobileMenuOpen(false);
                  if (mobileSearchOpen) setMobileSearchOpen(false);
                }}
                aria-label={t("nav.options")}
                className={`p-2 rounded-xl border active:scale-95 transition-all ${
                  moreMenuOpen
                    ? "bg-purple-900/50 border-purple-500/60 text-white"
                    : "text-slate-300 hover:text-white hover:bg-slate-900/70 border-purple-500/20"
                }`}
              >
                <MoreVertical className="w-5 h-5" />
              </button>
              {moreMenuOpen && (
                <div className="absolute top-full right-0 mt-2 z-50">
                  <LanguageDropdownPanel />
                </div>
              )}
            </div>

            {/* Hamburger menu */}
            <button
              type="button"
              onClick={() => {
                setMobileMenuOpen(!mobileMenuOpen);
                if (mobileSearchOpen) setMobileSearchOpen(false);
                if (moreMenuOpen) setMoreMenuOpen(false);
              }}
              aria-label="Toggle navigation menu"
              className="p-2 rounded-xl text-slate-300 hover:text-white hover:bg-slate-900/70 border border-purple-500/20 active:scale-95 transition-all"
            >
              {mobileMenuOpen ? <X className="w-5 h-5 text-rose-400" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>

        {/* Mobile Search Bar Drawer */}
        {mobileSearchOpen && (
          <div className="md:hidden pb-3 pt-1 border-t border-purple-900/20 animate-in fade-in slide-in-from-top-2 duration-200">
            <form onSubmit={handleSearch} className="relative">
              <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-purple-400" />
              <input
                ref={mobileSearchInputRef}
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder={t("nav.searchPlaceholder")}
                className="w-full bg-slate-900 border border-purple-500/40 text-white pl-10 pr-20 py-2.5 rounded-full text-sm focus:outline-none focus:ring-2 focus:ring-rose-500/50 shadow-lg"
              />
              <button
                type="submit"
                className="absolute right-1.5 top-1/2 -translate-y-1/2 bg-gradient-to-r from-rose-600 to-purple-600 text-white text-xs font-bold px-3.5 py-1.5 rounded-full shadow"
              >
                {t("nav.search")}
              </button>
            </form>

            {/* Mobile Search Live Autocomplete */}
            {searchQuery.trim().length >= 2 && liveResults.length > 0 && (
              <div className="mt-2 bg-slate-900 border border-purple-500/30 rounded-xl overflow-hidden shadow-xl divide-y divide-purple-900/20">
                {liveResults.map((item) => (
                  <Link
                    key={`m-${item.id}`}
                    href={`/movie/${item.id}`}
                    onClick={() => {
                      setMobileSearchOpen(false);
                      setSearchQuery("");
                    }}
                    className="flex items-center space-x-3 p-2.5 hover:bg-slate-800 transition-colors"
                  >
                    <div className="w-8 h-11 bg-slate-800 rounded overflow-hidden shrink-0 border border-purple-500/20">
                      {item.thumbnailUrl && item.thumbnailUrl !== "/placeholder.png" ? (
                        <img
                          src={item.thumbnailUrl}
                          alt={item.title}
                          className="w-full h-full object-cover"
                          loading="lazy"
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center text-slate-500">
                          <Film className="w-3.5 h-3.5" />
                        </div>
                      )}
                    </div>
                    <div className="flex-1 min-w-0">
                      {/* Movie title always in original language — no translation */}
                      <h4 className="text-white text-xs font-bold truncate original-title" dir="ltr">{item.title}</h4>
                      <p className="text-[10px] text-slate-400">{translateGenre(item.genre)} • {item.releaseYear}</p>
                    </div>
                  </Link>
                ))}
              </div>
            )}
          </div>
        )}

        {/* Mobile Menu Drawer */}
        {mobileMenuOpen && (
          <div className="md:hidden py-4 border-t border-purple-900/30 space-y-4 animate-in fade-in slide-in-from-top-2 duration-200 max-h-[calc(100vh-4.5rem)] overflow-y-auto pb-6">
            {/* Quick Links */}
            <div className="grid grid-cols-2 gap-2 pb-2">
              <Link
                href="/movies"
                onClick={() => setMobileMenuOpen(false)}
                className="flex items-center space-x-2 p-3 rounded-xl bg-slate-900 border border-purple-500/20 text-slate-200 hover:text-white hover:border-rose-500/40 text-sm font-medium"
              >
                <Clapperboard className="w-4 h-4 text-rose-400" />
                <span>{t("nav.allMovies")}</span>
              </Link>
              <Link
                href="/series"
                onClick={() => setMobileMenuOpen(false)}
                className="flex items-center space-x-2 p-3 rounded-xl bg-slate-900 border border-purple-500/20 text-slate-200 hover:text-white hover:border-purple-500/40 text-sm font-medium"
              >
                <Tv className="w-4 h-4 text-purple-400" />
                <span>{t("nav.series")}</span>
              </Link>
            </div>

            {/* User Profile / Auth Actions */}
            <div className="pt-2 border-t border-purple-900/20">
              {status === "loading" ? (
                <div className="text-center py-2 text-xs text-purple-300/60">Loading...</div>
              ) : session ? (
                <div className="space-y-2">
                  <div className="px-3 py-2 bg-slate-900/50 rounded-xl border border-purple-500/10">
                    <p className="text-xs text-slate-400">Signed in as</p>
                    <p className="text-sm font-semibold text-rose-300 truncate">{session.user.email}</p>
                  </div>
                  <div className="flex flex-col gap-1.5">
                    {session.user.role === "ADMIN" && (
                      <Link
                        href="/admin"
                        onClick={() => setMobileMenuOpen(false)}
                        className="flex items-center space-x-2 p-3 rounded-xl hover:bg-slate-900 text-slate-200 hover:text-white text-sm font-medium"
                      >
                        <ShieldCheck className="w-4 h-4 text-amber-400" />
                        <span>{t("nav.admin")}</span>
                      </Link>
                    )}
                    <Link
                      href="/profile"
                      onClick={() => setMobileMenuOpen(false)}
                      className="flex items-center space-x-2 p-3 rounded-xl hover:bg-slate-900 text-slate-200 hover:text-white text-sm font-medium"
                    >
                      <User className="w-4 h-4 text-purple-400" />
                      <span>{t("nav.profile")} & {t("nav.watchlist")}</span>
                    </Link>
                    <button
                      onClick={() => {
                        setMobileMenuOpen(false);
                        signOut();
                      }}
                      className="w-full flex items-center justify-center space-x-2 p-3 rounded-xl bg-rose-500/10 border border-rose-500/30 text-rose-300 hover:bg-rose-500 hover:text-white text-sm font-semibold transition-all mt-2"
                    >
                      <LogOut className="w-4 h-4" />
                      <span>{t("nav.logout")}</span>
                    </button>
                  </div>
                </div>
              ) : (
                <div className="grid grid-cols-2 gap-3 pt-2">
                  <Link
                    href="/login"
                    onClick={() => setMobileMenuOpen(false)}
                    className="flex items-center justify-center p-3 rounded-xl bg-slate-900 border border-purple-500/30 text-slate-200 hover:text-white text-sm font-semibold transition-all text-center"
                  >
                    {t("nav.login")}
                  </Link>
                  <Link
                    href="/register"
                    onClick={() => setMobileMenuOpen(false)}
                    className="flex items-center justify-center p-3 rounded-xl bg-gradient-to-r from-rose-600 to-purple-600 text-white text-sm font-bold shadow-lg shadow-rose-600/30 transition-all text-center"
                  >
                    {t("nav.signup")}
                  </Link>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </nav>
  );
}
