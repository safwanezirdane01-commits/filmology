"use client";
import Link from "next/link";
import { useSession, signOut } from "next-auth/react";
import { Film, Search } from "lucide-react";
import { useState } from "react";
import { useRouter } from "next/navigation";

export default function Navbar() {
  const { data: session, status } = useSession();
  const [searchQuery, setSearchQuery] = useState("");
  const router = useRouter();

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      router.push(`/search?q=${encodeURIComponent(searchQuery.trim())}`);
    }
  };

  return (
    <nav className="sticky top-0 z-50 bg-slate-950/80 backdrop-blur-md border-b border-purple-900/30 shadow-[0_4px_30px_rgba(0,0,0,0.1)]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center">
            <Link href="/" className="flex items-center space-x-2 text-white group">
              <Film className="w-8 h-8 text-rose-500 group-hover:text-rose-400 transition-colors drop-shadow-[0_0_10px_rgba(244,63,94,0.5)]" />
              <span className="font-bold text-xl hidden sm:block tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-white to-purple-200">
                Filmology<span className="text-rose-500 group-hover:text-rose-400 transition-colors">X</span>
              </span>
            </Link>
          </div>
          
          {/* Inline Search */}
          <div className="flex-1 max-w-md mx-4">
            <form onSubmit={handleSearch} className="relative group">
              <div className="relative flex items-center">
                <Search className="absolute left-3 w-4 h-4 text-purple-300/60 group-focus-within:text-rose-400 transition-colors" />
                <input 
                  type="text" 
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search..." 
                  className="w-full bg-slate-900/50 border border-purple-900/50 text-slate-100 pl-10 pr-4 py-2 rounded-full focus:outline-none focus:ring-2 focus:ring-rose-500/50 focus:border-rose-500/50 focus:bg-slate-900/80 text-sm transition-all placeholder:text-purple-300/40"
                />
              </div>
            </form>
          </div>

          <div className="flex items-center space-x-4">
            {status === "loading" ? (
              <div className="text-purple-300/50 text-sm animate-pulse">Loading...</div>
            ) : session ? (
              <>
                {session.user.role === "ADMIN" && (
                  <Link href="/admin" className="text-slate-300 hover:text-white hover:bg-purple-900/30 px-3 py-2 rounded-full text-sm font-medium transition-all">
                    Admin
                  </Link>
                )}
                <Link href="/profile" className="text-slate-300 hover:text-white hover:bg-purple-900/30 px-3 py-2 rounded-full text-sm font-medium transition-all">
                  Profile
                </Link>
                <button
                  onClick={() => signOut()}
                  className="bg-rose-500/10 text-rose-400 hover:bg-rose-500 hover:text-white px-5 py-2 rounded-full text-sm font-medium transition-all"
                >
                  Log Out
                </button>
              </>
            ) : (
              <>
                <Link
                  href="/login"
                  className="text-slate-300 hover:text-white hover:bg-purple-900/30 px-4 py-2 rounded-full text-sm font-medium transition-all"
                >
                  Log In
                </Link>
                <Link
                  href="/register"
                  className="bg-gradient-to-r from-rose-600 to-purple-600 hover:from-rose-500 hover:to-purple-500 text-white px-5 py-2 rounded-full text-sm font-medium transition-all shadow-[0_0_15px_rgba(244,63,94,0.3)] hover:shadow-[0_0_25px_rgba(244,63,94,0.5)]"
                >
                  Sign Up
                </Link>
              </>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
}
