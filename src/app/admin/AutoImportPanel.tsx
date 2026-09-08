"use client";

import { useState } from "react";
import { 
  importCatalogMovies, 
  importTmdbTrendingMovies, 
  importTmdbById, 
  searchTmdbMovies 
} from "./actions";
import { 
  Sparkles, 
  Search, 
  Film, 
  DownloadCloud, 
  CheckCircle2, 
  AlertCircle, 
  Loader2, 
  Flame, 
  Compass, 
  KeyRound,
  Plus
} from "lucide-react";

export default function AutoImportPanel() {
  const [loading, setLoading] = useState(false);
  const [statusMsg, setStatusMsg] = useState<{ type: "success" | "error"; text: string } | null>(null);
  const [tmdbIdInput, setTmdbIdInput] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState<any[]>([]);
  const [apiKey, setApiKey] = useState("");
  const [showKeyInput, setShowKeyInput] = useState(false);

  // Bulk import from curated catalog
  const handleBulkCatalog = async (category?: string) => {
    setLoading(true);
    setStatusMsg(null);
    try {
      const res = await importCatalogMovies(category);
      if (res.success) {
        setStatusMsg({
          type: "success",
          text: `Success! Added ${res.count} new movies to your library (out of ${res.totalProcessed} processed).`
        });
      }
    } catch (err: any) {
      setStatusMsg({ type: "error", text: err.message || "Failed to auto-import movies." });
    } finally {
      setLoading(false);
    }
  };

  // Import by TMDb ID
  const handleImportById = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!tmdbIdInput.trim()) return;

    setLoading(true);
    setStatusMsg(null);
    try {
      const res = await importTmdbById(tmdbIdInput.trim(), apiKey.trim() || undefined);
      if (res.success && res.movie) {
        setStatusMsg({
          type: "success",
          text: `Added "${res.movie.title}" (${res.movie.releaseYear}) to your library!`
        });
        setTmdbIdInput("");
      } else {
        setStatusMsg({ type: "error", text: res.error || "Could not find or add movie." });
      }
    } catch (err: any) {
      setStatusMsg({ type: "error", text: err.message || "Failed to import movie." });
    } finally {
      setLoading(false);
    }
  };

  // Import Trending from TMDb
  const handleImportTrending = async () => {
    if (!apiKey.trim()) {
      setShowKeyInput(true);
      setStatusMsg({
        type: "error",
        text: "Please enter a TMDB API Key or Bearer Token below to fetch live trending movies."
      });
      return;
    }

    setLoading(true);
    setStatusMsg(null);
    try {
      const res = await importTmdbTrendingMovies(apiKey.trim());
      if (res.success) {
        setStatusMsg({
          type: "success",
          text: `Successfully imported ${res.count} trending movies from TMDB!`
        });
      } else {
        setStatusMsg({ type: "error", text: res.error || "Failed to fetch trending." });
      }
    } catch (err: any) {
      setStatusMsg({ type: "error", text: err.message || "Failed to import trending movies." });
    } finally {
      setLoading(false);
    }
  };

  // Search TMDb
  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!searchQuery.trim()) return;

    if (!apiKey.trim()) {
      setShowKeyInput(true);
      setStatusMsg({
        type: "error",
        text: "Please provide a TMDB API Key below to use live search."
      });
      return;
    }

    setLoading(true);
    setStatusMsg(null);
    try {
      const results = await searchTmdbMovies(searchQuery.trim(), apiKey.trim());
      setSearchResults(results);
      if (results.length === 0) {
        setStatusMsg({ type: "error", text: "No movies found for that search query." });
      }
    } catch (err: any) {
      setStatusMsg({ type: "error", text: err.message || "Search failed." });
    } finally {
      setLoading(false);
    }
  };

  // Import single result from search
  const handleImportSearchResult = async (movie: any) => {
    setLoading(true);
    setStatusMsg(null);
    try {
      const res = await importTmdbById(movie.videoUrl, apiKey.trim() || undefined);
      if (res.success && res.movie) {
        setStatusMsg({
          type: "success",
          text: `Imported "${res.movie.title}"!`
        });
      } else {
        setStatusMsg({ type: "error", text: res.error || "Could not import." });
      }
    } catch (err: any) {
      setStatusMsg({ type: "error", text: err.message || "Failed to import." });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-slate-900/90 border border-purple-500/30 rounded-3xl p-6 sm:p-8 shadow-2xl backdrop-blur-xl relative overflow-hidden">
      {/* Decorative gradient blur */}
      <div className="absolute top-0 right-0 w-96 h-96 bg-rose-500/10 blur-[100px] pointer-events-none rounded-full"></div>

      <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 mb-8 relative z-10">
        <div>
          <div className="inline-flex items-center space-x-2 bg-rose-500/10 border border-rose-500/20 rounded-full px-3.5 py-1 mb-2">
            <Sparkles className="w-4 h-4 text-rose-400 animate-spin" style={{ animationDuration: "6s" }} />
            <span className="text-rose-300 text-xs font-bold uppercase tracking-wider">Automated Importer</span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
            Auto-Populate & Import Movies
          </h2>
          <p className="text-slate-400 text-sm mt-1">
            Instantly fill your website with full movie metadata, posters, and streaming links.
          </p>
        </div>

        <button
          type="button"
          onClick={() => setShowKeyInput(!showKeyInput)}
          className="flex items-center space-x-2 text-xs font-semibold px-4 py-2 rounded-full border border-purple-500/30 bg-slate-800/80 hover:bg-slate-700/80 text-purple-200 transition-all"
        >
          <KeyRound className="w-3.5 h-3.5 text-rose-400" />
          <span>{apiKey ? "TMDb Key Saved ✓" : "Configure TMDb Key"}</span>
        </button>
      </div>

      {/* Optional TMDb API Key Accordion */}
      {showKeyInput && (
        <div className="mb-6 p-4 rounded-2xl bg-slate-950/70 border border-purple-500/20 text-sm">
          <label className="block text-slate-300 font-semibold mb-1">
            TMDb API Key or Bearer Token (Optional for Live Search & Trending)
          </label>
          <p className="text-xs text-slate-400 mb-3">
            Get a free API key at <a href="https://www.themoviedb.org/settings/api" target="_blank" rel="noreferrer" className="text-rose-400 underline">themoviedb.org/settings/api</a>. If not set, you can still use the 1-Click Curated Auto-Importer below with zero setup!
          </p>
          <div className="flex gap-2">
            <input
              type="password"
              value={apiKey}
              onChange={(e) => setApiKey(e.target.value)}
              placeholder="Paste your TMDB API Key / Read Access Token..."
              className="flex-1 bg-slate-900 border border-purple-500/30 rounded-xl px-4 py-2 text-white text-sm focus:outline-none focus:border-rose-500"
            />
            <button
              type="button"
              onClick={() => setShowKeyInput(false)}
              className="bg-purple-600 hover:bg-purple-500 text-white font-semibold px-4 py-2 rounded-xl text-sm transition-all"
            >
              Save
            </button>
          </div>
        </div>
      )}

      {/* Status Messages */}
      {statusMsg && (
        <div className={`mb-6 p-4 rounded-2xl flex items-center space-x-3 text-sm font-medium ${
          statusMsg.type === "success" 
            ? "bg-emerald-500/10 border border-emerald-500/30 text-emerald-300" 
            : "bg-rose-500/10 border border-rose-500/30 text-rose-300"
        }`}>
          {statusMsg.type === "success" ? (
            <CheckCircle2 className="w-5 h-5 shrink-0 text-emerald-400" />
          ) : (
            <AlertCircle className="w-5 h-5 shrink-0 text-rose-400" />
          )}
          <span>{statusMsg.text}</span>
        </div>
      )}

      {/* Grid of Import Actions */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
        {/* Section 1: 1-Click Instant Catalog Auto-Import */}
        <div className="bg-slate-950/60 p-6 rounded-2xl border border-purple-900/40 flex flex-col justify-between">
          <div>
            <div className="flex items-center space-x-2 text-purple-300 font-semibold mb-2">
              <DownloadCloud className="w-4 h-4 text-rose-400" />
              <span>1-Click Curated Catalog (No API Key Required)</span>
            </div>
            <p className="text-slate-400 text-xs mb-5">
              Instantly imports dozens of blockbuster movies, complete with 4K/HD posters, descriptions, and active 1080p stream IDs.
            </p>

            <button
              type="button"
              disabled={loading}
              onClick={() => handleBulkCatalog()}
              className="w-full bg-gradient-to-r from-rose-600 to-purple-600 hover:from-rose-500 hover:to-purple-500 text-white font-bold py-3.5 px-6 rounded-xl flex items-center justify-center space-x-2 shadow-lg shadow-rose-500/20 transition-all hover:scale-[1.01] active:scale-[0.99] disabled:opacity-50"
            >
              {loading ? (
                <Loader2 className="w-5 h-5 animate-spin" />
              ) : (
                <>
                  <Sparkles className="w-5 h-5" />
                  <span>⚡ Auto-Import All Curated Blockbusters</span>
                </>
              )}
            </button>
          </div>

          {/* Category Pills */}
          <div className="mt-5 pt-4 border-t border-purple-900/30">
            <span className="text-xs text-slate-400 font-medium block mb-2.5">Or auto-import by category:</span>
            <div className="flex flex-wrap gap-2">
              <button
                type="button"
                disabled={loading}
                onClick={() => handleBulkCatalog("action")}
                className="text-xs bg-slate-800/80 hover:bg-rose-500/20 border border-purple-500/20 hover:border-rose-500/40 px-3 py-1.5 rounded-lg text-purple-200 transition-all"
              >
                💥 Action & Marvel
              </button>
              <button
                type="button"
                disabled={loading}
                onClick={() => handleBulkCatalog("scifi")}
                className="text-xs bg-slate-800/80 hover:bg-rose-500/20 border border-purple-500/20 hover:border-rose-500/40 px-3 py-1.5 rounded-lg text-purple-200 transition-all"
              >
                🌌 Sci-Fi Hits
              </button>
              <button
                type="button"
                disabled={loading}
                onClick={() => handleBulkCatalog("animation")}
                className="text-xs bg-slate-800/80 hover:bg-rose-500/20 border border-purple-500/20 hover:border-rose-500/40 px-3 py-1.5 rounded-lg text-purple-200 transition-all"
              >
                🎨 Animation & Family
              </button>
              <button
                type="button"
                disabled={loading}
                onClick={() => handleBulkCatalog("horror")}
                className="text-xs bg-slate-800/80 hover:bg-rose-500/20 border border-purple-500/20 hover:border-rose-500/40 px-3 py-1.5 rounded-lg text-purple-200 transition-all"
              >
                👻 Horror & Suspense
              </button>
              <button
                type="button"
                disabled={loading}
                onClick={() => handleBulkCatalog("drama")}
                className="text-xs bg-slate-800/80 hover:bg-rose-500/20 border border-purple-500/20 hover:border-rose-500/40 px-3 py-1.5 rounded-lg text-purple-200 transition-all"
              >
                🎭 Drama
              </button>
            </div>
          </div>
        </div>

        {/* Section 2: Auto-Import by TMDb ID or Live Search */}
        <div className="bg-slate-950/60 p-6 rounded-2xl border border-purple-900/40 flex flex-col justify-between space-y-6">
          {/* Quick Import by TMDb ID */}
          <div>
            <div className="flex items-center space-x-2 text-purple-300 font-semibold mb-2">
              <Compass className="w-4 h-4 text-rose-400" />
              <span>Quick Auto-Import by TMDb ID</span>
            </div>
            <p className="text-slate-400 text-xs mb-3">
              Enter any TMDb ID (e.g. <code>157336</code> for Interstellar) to pull full info automatically.
            </p>
            <form onSubmit={handleImportById} className="flex gap-2">
              <input
                type="text"
                value={tmdbIdInput}
                onChange={(e) => setTmdbIdInput(e.target.value)}
                placeholder="TMDb ID (e.g. 533535)..."
                className="flex-1 bg-slate-900 border border-purple-500/30 rounded-xl px-4 py-2.5 text-white text-sm focus:outline-none focus:border-rose-500"
              />
              <button
                type="submit"
                disabled={loading || !tmdbIdInput.trim()}
                className="bg-purple-600 hover:bg-purple-500 text-white font-bold px-5 py-2.5 rounded-xl text-sm transition-all disabled:opacity-50"
              >
                {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : "Import"}
              </button>
            </form>
          </div>

          {/* Live Search & Import */}
          <div className="pt-4 border-t border-purple-900/30">
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center space-x-2 text-purple-300 font-semibold">
                <Search className="w-4 h-4 text-rose-400" />
                <span>Search TMDb & Import</span>
              </div>
              <button
                type="button"
                onClick={handleImportTrending}
                disabled={loading}
                className="text-xs text-rose-400 hover:text-rose-300 font-semibold flex items-center space-x-1"
              >
                <Flame className="w-3.5 h-3.5" />
                <span>Import Trending</span>
              </button>
            </div>
            <form onSubmit={handleSearch} className="flex gap-2">
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search any movie (e.g. Gladiator, Avatar)..."
                className="flex-1 bg-slate-900 border border-purple-500/30 rounded-xl px-4 py-2.5 text-white text-sm focus:outline-none focus:border-rose-500"
              />
              <button
                type="submit"
                disabled={loading || !searchQuery.trim()}
                className="bg-slate-800 hover:bg-slate-700 text-rose-300 border border-purple-500/30 font-bold px-5 py-2.5 rounded-xl text-sm transition-all disabled:opacity-50"
              >
                Search
              </button>
            </form>
          </div>
        </div>
      </div>

      {/* Search Results Preview & One-Click Add */}
      {searchResults.length > 0 && (
        <div className="mt-6 pt-6 border-t border-purple-900/40">
          <h3 className="text-lg font-bold text-white mb-4 flex items-center space-x-2">
            <Film className="w-5 h-5 text-rose-400" />
            <span>Search Results ({searchResults.length})</span>
          </h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 max-h-[400px] overflow-y-auto pr-2">
            {searchResults.map((m) => (
              <div
                key={m.videoUrl}
                className="bg-slate-950/80 border border-purple-500/20 rounded-2xl p-3 flex gap-3 items-center hover:border-rose-500/40 transition-all"
              >
                {m.thumbnailUrl ? (
                  <img
                    src={m.thumbnailUrl}
                    alt={m.title}
                    className="w-14 h-20 object-cover rounded-xl shrink-0"
                  />
                ) : (
                  <div className="w-14 h-20 bg-slate-900 rounded-xl flex items-center justify-center shrink-0">
                    <Film className="w-6 h-6 text-purple-600/50" />
                  </div>
                )}
                <div className="flex-1 min-w-0">
                  <h4 className="text-white text-sm font-bold truncate">{m.title}</h4>
                  <p className="text-xs text-rose-400">{m.releaseYear} • {m.genre}</p>
                  <p className="text-[11px] text-slate-400 line-clamp-2 mt-1">{m.description}</p>
                </div>
                <button
                  type="button"
                  disabled={loading}
                  onClick={() => handleImportSearchResult(m)}
                  className="bg-gradient-to-r from-rose-600 to-purple-600 hover:from-rose-500 hover:to-purple-500 text-white p-2.5 rounded-xl transition-all shrink-0 hover:scale-105"
                  title="Import this movie"
                >
                  <Plus className="w-4 h-4" />
                </button>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
