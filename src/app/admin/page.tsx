import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { addMovie, deleteMovie } from "./actions";
import AutoImportPanel from "./AutoImportPanel";
import { Film, Trash2, PlusCircle, Clapperboard } from "lucide-react";

export default async function AdminPage() {
  const session = await getServerSession(authOptions);

  if (!session) {
    redirect("/login");
  }

  const movies = await prisma.movie.findMany({
    orderBy: { createdAt: "desc" },
  });

  return (
    <div className="max-w-6xl mx-auto space-y-12 pb-20 font-sans">
      {/* Page Title */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b border-purple-900/30 pb-6">
        <div>
          <h1 className="text-4xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-white via-rose-100 to-purple-200 tracking-tight">
            Admin Studio
          </h1>
          <p className="text-slate-400 text-sm mt-1">
            Manage your movie catalog, auto-import content, and monitor streaming links.
          </p>
        </div>
        <div className="flex items-center space-x-2 bg-slate-900 border border-purple-500/20 px-4 py-2 rounded-full text-xs font-semibold text-purple-300">
          <Clapperboard className="w-4 h-4 text-rose-400" />
          <span>{movies.length} Total Movies in Library</span>
        </div>
      </div>

      {/* 🚀 AUTOMATED IMPORTER PANEL */}
      <AutoImportPanel />

      {/* Manual Movie Creator */}
      <div className="bg-slate-900/60 border border-purple-900/40 p-8 rounded-3xl backdrop-blur-xl shadow-xl">
        <div className="flex items-center space-x-2 mb-6">
          <PlusCircle className="w-5 h-5 text-rose-400" />
          <h2 className="text-xl font-bold text-white">Manual Add Custom Movie</h2>
        </div>
        
        <form action={addMovie} className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1.5 uppercase tracking-wider">Title</label>
              <input name="title" required className="w-full p-3 rounded-xl bg-slate-950/80 border border-purple-500/20 text-white text-sm focus:outline-none focus:border-rose-500" placeholder="Movie title..." />
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1.5 uppercase tracking-wider">Genre</label>
              <input name="genre" required className="w-full p-3 rounded-xl bg-slate-950/80 border border-purple-500/20 text-white text-sm focus:outline-none focus:border-rose-500" placeholder="e.g. Sci-Fi, Action..." />
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1.5 uppercase tracking-wider">Release Year</label>
              <input name="releaseYear" type="number" defaultValue={new Date().getFullYear()} required className="w-full p-3 rounded-xl bg-slate-950/80 border border-purple-500/20 text-white text-sm focus:outline-none focus:border-rose-500" />
            </div>
            <div className="md:col-span-1">
              <label className="block text-xs font-semibold text-slate-300 mb-1.5 uppercase tracking-wider">Poster Thumbnail URL</label>
              <input name="thumbnailUrl" type="url" className="w-full p-3 rounded-xl bg-slate-950/80 border border-purple-500/20 text-white text-sm focus:outline-none focus:border-rose-500" placeholder="https://..." />
            </div>
            <div className="md:col-span-2">
              <label className="block text-xs font-semibold text-slate-300 mb-1.5 uppercase tracking-wider">Video Stream (MP4 link, Embed URL, or TMDb ID)</label>
              <input name="videoUrl" type="text" className="w-full p-3 rounded-xl bg-slate-950/80 border border-purple-500/20 text-white text-sm focus:outline-none focus:border-rose-500" placeholder="e.g. 157336, tt0816692, or https://...mp4" />
            </div>
            <div className="md:col-span-3">
              <label className="block text-xs font-semibold text-slate-300 mb-1.5 uppercase tracking-wider">Description</label>
              <textarea name="description" required rows={3} className="w-full p-3 rounded-xl bg-slate-950/80 border border-purple-500/20 text-white text-sm focus:outline-none focus:border-rose-500" placeholder="Movie synopsis..." />
            </div>
          </div>
          <button type="submit" className="bg-gradient-to-r from-rose-600 to-purple-600 hover:from-rose-500 hover:to-purple-500 text-white font-bold py-3 px-8 rounded-xl text-sm transition-all shadow-lg shadow-rose-500/20">
            Save Custom Movie
          </button>
        </form>
      </div>

      {/* Manage Movies Table */}
      <div>
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold text-white flex items-center space-x-2">
            <Film className="w-6 h-6 text-rose-400" />
            <span>Library ({movies.length})</span>
          </h2>
        </div>
        <div className="bg-slate-900/60 rounded-3xl border border-purple-900/30 overflow-hidden shadow-xl">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-950 border-b border-purple-900/30 text-purple-300/80 text-xs uppercase tracking-wider">
                <th className="p-4">Movie</th>
                <th className="p-4">Year</th>
                <th className="p-4">Genre</th>
                <th className="p-4">Stream Source</th>
                <th className="p-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-purple-900/20 text-sm">
              {movies.length === 0 ? (
                <tr>
                  <td colSpan={5} className="p-8 text-center text-purple-300/60">
                    No movies found in your library yet. Use the Auto-Import buttons above!
                  </td>
                </tr>
              ) : (
                movies.map(movie => (
                  <tr key={movie.id} className="hover:bg-purple-950/20 transition-colors">
                    <td className="p-4">
                      <div className="flex items-center space-x-3">
                        {movie.thumbnailUrl ? (
                          <img src={movie.thumbnailUrl} alt={movie.title} className="w-10 h-14 object-cover rounded-lg shrink-0 border border-purple-500/20" />
                        ) : (
                          <div className="w-10 h-14 bg-slate-800 rounded-lg flex items-center justify-center shrink-0">
                            <Film className="w-5 h-5 text-purple-500/40" />
                          </div>
                        )}
                        <div>
                          <a href={`/movie/${movie.id}`} className="font-bold text-white hover:text-rose-400 transition-colors line-clamp-1">
                            {movie.title}
                          </a>
                          <p className="text-xs text-slate-400 line-clamp-1 max-w-sm">{movie.description}</p>
                        </div>
                      </div>
                    </td>
                    <td className="p-4 text-slate-300">{movie.releaseYear}</td>
                    <td className="p-4">
                      <span className="bg-rose-500/10 text-rose-300 border border-rose-500/20 px-2.5 py-1 rounded-full text-xs font-semibold">
                        {movie.genre}
                      </span>
                    </td>
                    <td className="p-4 text-xs font-mono text-purple-300/70 truncate max-w-[150px]">
                      {movie.videoUrl || "None"}
                    </td>
                    <td className="p-4 text-right">
                      <form action={async () => {
                        "use server";
                        await deleteMovie(movie.id);
                      }}>
                        <button type="submit" className="text-rose-400 hover:text-rose-300 p-2 rounded-lg hover:bg-rose-500/10 transition-colors" title="Delete movie">
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </form>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
