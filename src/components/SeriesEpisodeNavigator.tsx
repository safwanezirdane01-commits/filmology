"use client";

import { useState } from "react";
import { Tv, Play, ChevronLeft, ChevronRight, Sparkles, Hash } from "lucide-react";
import { getSeriesMetadata } from "@/lib/series";

interface SeriesEpisodeNavigatorProps {
  movieVideoUrl: string | null;
  genre?: string;
  currentSeason: number;
  currentEpisode: number;
  onSelectEpisode: (season: number, episode: number) => void;
}

export default function SeriesEpisodeNavigator({
  movieVideoUrl,
  genre,
  currentSeason,
  currentEpisode,
  onSelectEpisode,
}: SeriesEpisodeNavigatorProps) {
  const meta = getSeriesMetadata(movieVideoUrl, genre);
  const [jumpInput, setJumpInput] = useState<string>("");

  if (!meta) return null;

  const totalSeasons = Math.max(1, meta.totalSeasons || 1);
  const seasonsList = Array.from({ length: totalSeasons }, (_, i) => i + 1);

  // Episode count for the currently selected season
  const episodesCount = meta.seasons[currentSeason] || 24;
  const episodesList = Array.from({ length: episodesCount }, (_, i) => i + 1);

  const handlePrev = () => {
    if (currentEpisode > 1) {
      onSelectEpisode(currentSeason, currentEpisode - 1);
    } else if (currentSeason > 1) {
      // Go to last episode of previous season
      const prevSeason = currentSeason - 1;
      const prevSeasonMax = meta.seasons[prevSeason] || 24;
      onSelectEpisode(prevSeason, prevSeasonMax);
    }
  };

  const handleNext = () => {
    if (currentEpisode < episodesCount) {
      onSelectEpisode(currentSeason, currentEpisode + 1);
    } else if (currentSeason < totalSeasons) {
      // Go to episode 1 of next season
      onSelectEpisode(currentSeason + 1, 1);
    }
  };

  const handleJumpSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const parsed = parseInt(jumpInput.trim(), 10);
    if (!isNaN(parsed) && parsed >= 1) {
      onSelectEpisode(currentSeason, parsed);
      setJumpInput("");
    }
  };

  return (
    <div className="w-full bg-slate-900/90 border border-purple-500/25 rounded-2xl sm:rounded-3xl p-4 sm:p-6 backdrop-blur-xl shadow-xl space-y-4 sm:space-y-6">
      {/* Header with Title & Quick Switchers */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 sm:pb-4 border-b border-purple-900/30">
        <div className="flex items-center space-x-2.5">
          <div className="p-2 rounded-xl bg-gradient-to-br from-rose-500/20 to-purple-600/20 border border-rose-500/30 text-rose-400">
            <Tv className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center space-x-2">
              <h3 className="text-base sm:text-lg font-extrabold text-white">
                Series Episodes
              </h3>
              <span className="bg-rose-500/20 text-rose-300 text-[10px] font-bold px-2 py-0.5 rounded-full border border-rose-500/30 uppercase tracking-wider">
                Full Collection
              </span>
            </div>
            <p className="text-xs text-purple-300/60 font-medium">
              Now Streaming: Season {currentSeason} • Episode {currentEpisode}
            </p>
          </div>
        </div>

        {/* Prev / Next Episode Buttons */}
        <div className="flex items-center space-x-2 self-start sm:self-auto">
          <button
            type="button"
            onClick={handlePrev}
            disabled={currentSeason === 1 && currentEpisode === 1}
            className="px-3 py-1.5 bg-slate-800/90 hover:bg-slate-700 disabled:opacity-30 disabled:hover:bg-slate-800/90 rounded-xl text-slate-200 text-xs font-semibold flex items-center space-x-1 border border-purple-500/20 transition-all cursor-pointer disabled:cursor-not-allowed"
          >
            <ChevronLeft className="w-3.5 h-3.5" />
            <span>Prev Ep</span>
          </button>
          <div className="px-3 py-1.5 bg-gradient-to-r from-rose-500/10 to-purple-600/10 border border-rose-500/30 rounded-xl text-rose-300 text-xs font-bold">
            S{currentSeason} : E{currentEpisode}
          </div>
          <button
            type="button"
            onClick={handleNext}
            disabled={currentSeason === totalSeasons && currentEpisode === episodesCount}
            className="px-3.5 py-1.5 bg-gradient-to-r from-rose-600 to-purple-600 hover:from-rose-500 hover:to-purple-500 disabled:opacity-30 rounded-xl text-white text-xs font-bold flex items-center space-x-1 shadow-md transition-all cursor-pointer disabled:cursor-not-allowed"
          >
            <span>Next Ep</span>
            <ChevronRight className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {/* Season Selector Tabs */}
      <div>
        <div className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-2.5 flex items-center justify-between">
          <span>Select Season ({totalSeasons} Available)</span>
          <span className="text-[11px] text-purple-400 font-normal">
            Season {currentSeason} has {episodesCount} Episodes
          </span>
        </div>
        <div className="flex flex-wrap items-center gap-1.5 sm:gap-2">
          {seasonsList.map((s) => {
            const isSelected = s === currentSeason;
            const seasonEps = meta.seasons[s] || 24;
            return (
              <button
                key={s}
                type="button"
                onClick={() => {
                  onSelectEpisode(s, 1);
                }}
                className={`px-3 sm:px-4 py-1.5 sm:py-2 rounded-xl text-xs font-bold transition-all flex items-center space-x-1.5 cursor-pointer ${
                  isSelected
                    ? "bg-gradient-to-r from-rose-600 to-purple-600 text-white shadow-[0_0_20px_rgba(244,63,94,0.35)] scale-105"
                    : "bg-slate-800/80 text-purple-200/80 hover:bg-slate-700/90 hover:text-white border border-purple-500/15"
                }`}
              >
                <span>Season {s}</span>
                <span
                  className={`text-[10px] px-1.5 py-0.2 rounded-full font-medium ${
                    isSelected
                      ? "bg-white/20 text-white"
                      : "bg-slate-900/60 text-purple-300/70"
                  }`}
                >
                  {seasonEps} eps
                </span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Episode Cards Grid */}
      <div>
        <div className="flex items-center justify-between mb-3">
          <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">
            Episodes in Season {currentSeason}
          </span>

          {/* Quick Jump Input for Long-Running Shows */}
          <form onSubmit={handleJumpSubmit} className="flex items-center space-x-1.5">
            <span className="text-[11px] text-purple-300/60 hidden sm:inline">Jump to:</span>
            <div className="relative flex items-center">
              <input
                type="number"
                min="1"
                max="999"
                placeholder="Ep #"
                value={jumpInput}
                onChange={(e) => setJumpInput(e.target.value)}
                className="w-16 sm:w-20 bg-slate-800/90 border border-purple-500/30 text-white text-xs px-2 py-1 rounded-lg focus:outline-none focus:border-rose-500 placeholder:text-purple-300/40 text-center font-bold"
              />
              <button
                type="submit"
                className="ml-1 px-2 py-1 bg-purple-600/50 hover:bg-purple-600 text-white text-[11px] font-bold rounded-lg transition-colors cursor-pointer"
              >
                Go
              </button>
            </div>
          </form>
        </div>

        {/* Responsive Grid of All Episodes */}
        <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-6 lg:grid-cols-8 gap-2 sm:gap-2.5 max-h-[340px] overflow-y-auto pr-1 scrollbar-thin scrollbar-thumb-purple-600/40">
          {episodesList.map((ep) => {
            const isPlaying = ep === currentEpisode;
            return (
              <button
                key={ep}
                type="button"
                onClick={() => onSelectEpisode(currentSeason, ep)}
                className={`group relative p-2.5 sm:p-3 rounded-xl sm:rounded-2xl transition-all flex flex-col items-center justify-center text-center cursor-pointer border ${
                  isPlaying
                    ? "bg-gradient-to-br from-rose-600/30 to-purple-600/40 border-rose-500 shadow-[0_0_25px_rgba(244,63,94,0.3)] ring-1 ring-rose-400"
                    : "bg-slate-800/60 hover:bg-slate-800 border-purple-500/15 hover:border-purple-500/40"
                }`}
              >
                <div className="flex items-center space-x-1 mb-1">
                  <Play
                    className={`w-3 h-3 transition-transform ${
                      isPlaying
                        ? "text-rose-400 fill-current scale-110"
                        : "text-purple-400/60 group-hover:text-rose-400 fill-current group-hover:scale-110"
                    }`}
                  />
                  <span
                    className={`text-xs sm:text-sm font-extrabold ${
                      isPlaying ? "text-white" : "text-slate-200 group-hover:text-white"
                    }`}
                  >
                    EP {ep}
                  </span>
                </div>

                {isPlaying ? (
                  <span className="inline-flex items-center space-x-1 text-[9px] font-bold text-rose-300 uppercase tracking-wider">
                    <span className="w-1.5 h-1.5 rounded-full bg-rose-400 animate-ping"></span>
                    <span>Playing</span>
                  </span>
                ) : (
                  <span className="text-[10px] text-purple-300/50 group-hover:text-purple-300/80 font-medium">
                    Episode {ep}
                  </span>
                )}
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
}
