import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";
import Link from "next/link";
import { Film, User, ShieldCheck } from "lucide-react";
import LocalWatchlistSection from "./LocalWatchlistSection";

export default async function ProfilePage() {
  const session = await getServerSession(authOptions);

  if (!session) {
    redirect("/login");
  }

  let dbWatchlists: any[] = [];
  try {
    dbWatchlists = await prisma.watchlist.findMany({
      where: { userId: session.user.id },
      include: { movie: true },
    });
  } catch (err) {
    console.warn("Could not query DB watchlists:", err);
  }

  return (
    <div className="max-w-5xl mx-auto space-y-8 sm:space-y-10 pb-16 font-sans">
      {/* Profile Header */}
      <div className="bg-slate-900/80 border border-purple-900/30 p-6 sm:p-8 rounded-3xl backdrop-blur-xl shadow-xl flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div className="flex items-center space-x-4">
          <div className="w-14 h-14 rounded-2xl bg-gradient-to-tr from-rose-500 to-purple-600 flex items-center justify-center text-white shadow-lg">
            <User className="w-7 h-7" />
          </div>
          <div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-white">My Account</h1>
            <p className="text-slate-400 text-xs sm:text-sm mt-0.5">{session.user.email}</p>
          </div>
        </div>

        <div className="flex items-center space-x-2 bg-slate-950 px-3.5 py-1.5 rounded-full border border-purple-500/20 text-xs font-semibold text-purple-300">
          <ShieldCheck className="w-4 h-4 text-emerald-400" />
          <span>Verified Member ({session.user.role || "USER"})</span>
        </div>
      </div>

      {/* Saved Watchlist Section (Synced locally + server) */}
      <div className="bg-slate-900/60 border border-purple-900/30 p-6 sm:p-8 rounded-3xl backdrop-blur-xl shadow-xl">
        <LocalWatchlistSection />
      </div>

      {/* Database Synced Titles (if any exist in SQLite) */}
      {dbWatchlists.length > 0 && (
        <div className="space-y-4 pt-4 border-t border-purple-900/20">
          <h2 className="text-lg font-bold text-white">Database Bookmarks ({dbWatchlists.length})</h2>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            {dbWatchlists.map((item) => (
              <Link
                href={`/movie/${item.movie.id}`}
                key={item.id}
                className="group relative flex flex-col bg-slate-950 rounded-xl overflow-hidden border border-purple-900/30 hover:border-rose-500/50 transition-all duration-200"
              >
                <div className="aspect-[2/3] w-full bg-slate-900 overflow-hidden relative">
                  {item.movie.thumbnailUrl ? (
                    <img
                      src={item.movie.thumbnailUrl}
                      alt={item.movie.title}
                      className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                    />
                  ) : (
                    <div className="w-full h-full flex flex-col items-center justify-center p-3 text-center">
                      <Film className="w-8 h-8 text-purple-900/50 mb-1" />
                      <span className="text-[10px] text-purple-300/50">{item.movie.title}</span>
                    </div>
                  )}
                </div>
                <div className="p-2.5">
                  <h4 className="text-white text-xs font-bold truncate group-hover:text-rose-300 transition-colors">
                    {item.movie.title}
                  </h4>
                </div>
              </Link>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
