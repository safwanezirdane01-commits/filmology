"use client";

import Link from "next/link";
import { useSession, signOut } from "next-auth/react";
import { Film, Search, Menu, X, User, ShieldCheck, LogOut, Clapperboard, Tv } from "lucide-react";
import { useState, useRef, useEffect } from "react";
import { useRouter } from "next/navigation";

export default function Navbar() {
  const { data: session, status } = useSession();
  const [searchQuery, setSearchQuery] = useState("");
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [mobileSearchOpen, setMobileSearchOpen] = useState(false);
  const mobileSearchInputRef = useRef<HTMLInputElement>(null);
  const router = useRouter();

  useEffect(() => {
    if (mobileSearchOpen && mobileSearchInputRef.current) {
      mobileSearchInputRef.current.focus();
    }
  }, [mobileSearchOpen]);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      router.push(`/search?q=${encodeURIComponent(searchQuery.trim())}`);
      setMobileSearchOpen(false);
      setMobileMenuOpen(false);
    }
  };

  return (
    <nav className="sticky top-0 z-50 bg-slate-950/95 sm:bg-slate-950/90 sm:backdrop-blur-md border-b border-purple-900/30 shadow-[0_4px_25px_rgba(0,0,0,0.4)]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 gap-2">
          {/* Logo & Brand */}
          <div className="flex items-center shrink-0">
            <Link 
              href="/" 
              className="flex items-center space-x-2 text-white group"
              onClick={() => {
                setMobileMenuOpen(false);
                setMobileSearchOpen(false);
              }}
            >
              <Film className="w-7 h-7 sm:w-8 sm:h-8 text-rose-500 group-hover:text-rose-400 transition-colors drop-shadow-[0_0_10px_rgba(244,63,94,0.5)]" />
              <span className="font-bold text-lg sm:text-xl tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-white to-purple-200">
                Filmology<span className="text-rose-500 group-hover:text-rose-400 transition-colors">X</span>
              </span>
            </Link>
          </div>
          
          {/* Desktop Search Bar (hidden on mobile) */}
          <div className="hidden md:flex flex-1 max-w-md mx-6">
            <form onSubmit={handleSearch} className="w-full relative group">
              <div className="relative flex items-center">
                <Search className="absolute left-3.5 w-4 h-4 text-purple-300/60 group-focus-within:text-rose-400 transition-colors" />
                <input 
                  type="text" 
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search movies, series, genres..." 
                  className="w-full bg-slate-900/60 border border-purple-900/50 text-slate-100 pl-10 pr-4 py-2 rounded-full focus:outline-none focus:ring-2 focus:ring-rose-500/50 focus:border-rose-500/50 focus:bg-slate-900/90 text-sm transition-all placeholder:text-purple-300/40"
                />
              </div>
            </form>
          </div>

          {/* Desktop Auth Controls */}
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
                  <span>Profile</span>
                </Link>
                <button
                  onClick={() => signOut()}
                  className="bg-rose-500/10 text-rose-400 hover:bg-rose-500 hover:text-white px-4 py-1.5 rounded-full text-xs font-medium transition-all"
                >
                  Log Out
                </button>
              </>
            ) : (
              <>
                <Link
                  href="/login"
                  className="text-slate-300 hover:text-white hover:bg-purple-900/30 px-4 py-2 rounded-full text-xs sm:text-sm font-medium transition-all"
                >
                  Log In
                </Link>
                <Link
                  href="/register"
                  className="bg-gradient-to-r from-rose-600 to-purple-600 hover:from-rose-500 hover:to-purple-500 text-white px-4 py-2 rounded-full text-xs sm:text-sm font-medium transition-all shadow-[0_0_15px_rgba(244,63,94,0.3)]"
                >
                  Sign Up
                </Link>
              </>
            )}
          </div>

          {/* Mobile Action Icons (Search Toggle & Hamburger Menu) */}
          <div className="flex md:hidden items-center space-x-2">
            <button
              type="button"
              onClick={() => {
                setMobileSearchOpen(!mobileSearchOpen);
                if (mobileMenuOpen) setMobileMenuOpen(false);
              }}
              aria-label="Toggle search"
              className="p-2 rounded-xl text-slate-300 hover:text-white hover:bg-slate-900/70 border border-purple-500/20 active:scale-95 transition-all"
            >
              <Search className="w-5 h-5 text-rose-400" />
            </button>

            <button
              type="button"
              onClick={() => {
                setMobileMenuOpen(!mobileMenuOpen);
                if (mobileSearchOpen) setMobileSearchOpen(false);
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
                placeholder="Search movies, TV series, actors..."
                className="w-full bg-slate-900 border border-purple-500/40 text-white pl-10 pr-20 py-2.5 rounded-full text-sm focus:outline-none focus:ring-2 focus:ring-rose-500/50 shadow-lg"
              />
              <button
                type="submit"
                className="absolute right-1.5 top-1/2 -translate-y-1/2 bg-gradient-to-r from-rose-600 to-purple-600 text-white text-xs font-bold px-3.5 py-1.5 rounded-full shadow"
              >
                Search
              </button>
            </form>
          </div>
        )}

        {/* Mobile Menu Drawer */}
        {mobileMenuOpen && (
          <div className="md:hidden py-4 border-t border-purple-900/30 space-y-4 animate-in fade-in slide-in-from-top-2 duration-200 max-h-[calc(100vh-4.5rem)] overflow-y-auto pb-6">
            {/* Quick Links */}
            <div className="grid grid-cols-2 gap-2 pb-2">
              <Link
                href="/search"
                onClick={() => setMobileMenuOpen(false)}
                className="flex items-center space-x-2 p-3 rounded-xl bg-slate-900/80 border border-purple-500/20 text-slate-200 hover:text-white hover:border-rose-500/40 text-sm font-medium"
              >
                <Clapperboard className="w-4 h-4 text-rose-400" />
                <span>All Movies</span>
              </Link>
              <Link
                href="/search?q=series"
                onClick={() => setMobileMenuOpen(false)}
                className="flex items-center space-x-2 p-3 rounded-xl bg-slate-900/80 border border-purple-500/20 text-slate-200 hover:text-white hover:border-rose-500/40 text-sm font-medium"
              >
                <Tv className="w-4 h-4 text-purple-400" />
                <span>TV Series</span>
              </Link>
            </div>

            {/* User Profile / Auth Actions */}
            <div className="pt-2 border-t border-purple-900/20">
              {status === "loading" ? (
                <div className="text-center py-2 text-xs text-purple-300/60">Loading account...</div>
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
                        <span>Admin Dashboard</span>
                      </Link>
                    )}
                    <Link
                      href="/profile"
                      onClick={() => setMobileMenuOpen(false)}
                      className="flex items-center space-x-2 p-3 rounded-xl hover:bg-slate-900 text-slate-200 hover:text-white text-sm font-medium"
                    >
                      <User className="w-4 h-4 text-purple-400" />
                      <span>My Profile & Watchlist</span>
                    </Link>
                    <button
                      onClick={() => {
                        setMobileMenuOpen(false);
                        signOut();
                      }}
                      className="w-full flex items-center justify-center space-x-2 p-3 rounded-xl bg-rose-500/10 border border-rose-500/30 text-rose-300 hover:bg-rose-500 hover:text-white text-sm font-semibold transition-all mt-2"
                    >
                      <LogOut className="w-4 h-4" />
                      <span>Log Out</span>
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
                    Log In
                  </Link>
                  <Link
                    href="/register"
                    onClick={() => setMobileMenuOpen(false)}
                    className="flex items-center justify-center p-3 rounded-xl bg-gradient-to-r from-rose-600 to-purple-600 text-white text-sm font-bold shadow-lg shadow-rose-600/30 transition-all text-center"
                  >
                    Sign Up
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
