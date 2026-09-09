"use client";

import { useState, useRef, useEffect, useMemo } from "react";
import { Play, Server, Film, ShieldCheck, Tv, ChevronLeft, ChevronRight } from "lucide-react";

export default function VideoPlayer({ 
  movieVideoUrl, 
  thumbnailUrl,
  genre,
  adDirectLink,
  requiredClicks = 2,
  adsEnabled = true,
}: { 
  movieVideoUrl: string | null; 
  thumbnailUrl: string | null;
  genre?: string;
  adDirectLink?: string;
  requiredClicks?: number;
  adsEnabled?: boolean;
}) {
  const [clickCount, setClickCount] = useState(0);
  const [selectedServer, setSelectedServer] = useState<number>(1);
  const [season, setSeason] = useState<number>(1);
  const [episode, setEpisode] = useState<number>(1);
  const targetClicks = Math.max(1, requiredClicks);
  const videoRef = useRef<HTMLVideoElement>(null);

  // Check if title is a TV Series
  const isSeries = useMemo(() => {
    const isTvGenre = genre ? /series|tv|show|anime/i.test(genre) : false;
    const isTvUrl = movieVideoUrl ? movieVideoUrl.trim().startsWith("tv:") : false;
    return isTvGenre || isTvUrl;
  }, [genre, movieVideoUrl]);

  // Normalize and parse the video URL or ID
  const parsedSources = useMemo(() => {
    if (!movieVideoUrl) return null;

    let trimmed = movieVideoUrl.trim();
    if (trimmed.startsWith("tv:")) {
      trimmed = trimmed.replace("tv:", "");
    }

    // Check if it's an IMDb ID (e.g. tt0816692) or TMDb ID (e.g. 157336)
    const isImdbId = /^tt\d+$/i.test(trimmed);
    const isTmdbId = /^\d+$/.test(trimmed);

    // Check if it's a direct video link (.mp4, .webm, .ogg, .m3u8, etc.)
    const isDirectVideo = /\.(mp4|webm|ogg|m4v|m3u8)($|\?)/i.test(trimmed) || 
      trimmed.includes("gtv-videos-bucket") || 
      trimmed.includes("commondatastorage.googleapis.com");

    // Check if YouTube
    const ytMatch = trimmed.match(/(?:youtube\.com\/(?:[^\/]+\/.+\/|(?:v|e(?:mbed)?)\/|.*[?&]v=)|youtu\.be\/)([^"&?\/\s]{11})/i);
    const youtubeEmbed = ytMatch ? `https://www.youtube-nocookie.com/embed/${ytMatch[1]}?autoplay=1` : null;

    let server1 = "";
    let server2 = "";
    let server3 = "";
    let server4 = "";

    if (isSeries && (isImdbId || isTmdbId)) {
      server1 = `https://vidlink.pro/tv/${trimmed}/${season}/${episode}?primaryColor=e11d48&secondaryColor=a855f7&autoplay=true`;
      server2 = `https://vidsrc.me/embed/tv?${isImdbId ? `imdb=${trimmed}` : `tmdb=${trimmed}`}&season=${season}&episode=${episode}`;
      server3 = `https://vidsrc.xyz/embed/tv/${trimmed}/${season}-${episode}`;
      server4 = `https://embed.su/embed/tv/${trimmed}/${season}/${episode}`;
    } else if (isImdbId || isTmdbId) {
      server1 = `https://vidlink.pro/movie/${trimmed}?primaryColor=e11d48&secondaryColor=a855f7&autoplay=true`;
      server2 = `https://vidsrc.me/embed/movie?${isImdbId ? `imdb=${trimmed}` : `tmdb=${trimmed}`}`;
      server3 = `https://vidsrc.xyz/embed/movie/${trimmed}`;
      server4 = `https://embed.su/embed/movie/${trimmed}`;
    } else if (youtubeEmbed) {
      server1 = youtubeEmbed;
      server2 = youtubeEmbed;
      server3 = youtubeEmbed;
      server4 = youtubeEmbed;
    } else if (isDirectVideo) {
      server1 = trimmed;
      server2 = trimmed;
      server3 = trimmed;
      server4 = trimmed;
    } else {
      server1 = trimmed;
      server2 = trimmed;
      server3 = trimmed;
      server4 = trimmed;
    }

    return {
      isImdbOrTmdb: isImdbId || isTmdbId,
      isDirectVideo,
      server1,
      server2,
      server3,
      server4,
      currentUrl: selectedServer === 1 ? server1 : selectedServer === 2 ? server2 : selectedServer === 3 ? server3 : server4
    };
  }, [movieVideoUrl, selectedServer, isSeries, season, episode]);

  const handleFakeClick = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    
    if (adDirectLink && adDirectLink.startsWith("http")) {
      window.open(adDirectLink, "_blank");
    } else {
      window.open("about:blank", "_blank");
    }
    setClickCount(prev => prev + 1);
  };

  // Auto-play when direct video becomes unblocked
  useEffect(() => {
    if (clickCount >= targetClicks && videoRef.current && parsedSources?.isDirectVideo) {
      videoRef.current.play().catch(e => console.log("Autoplay blocked:", e));
    }
  }, [clickCount, targetClicks, parsedSources]);

  if (!movieVideoUrl || !parsedSources) {
    return (
      <div className="w-full aspect-video rounded-2xl sm:rounded-3xl flex flex-col items-center justify-center bg-slate-950 text-purple-300/60 p-6 text-center border border-purple-500/20">
        <Film className="w-12 h-12 mb-3 text-purple-600/40 animate-pulse" />
        <h3 className="text-lg font-bold text-white mb-1">No Video Available</h3>
        <p className="text-xs max-w-sm">Add a video link or IMDb/TMDb ID in the Admin panel to start streaming.</p>
      </div>
    );
  }

  const needsPopups = adsEnabled && clickCount < targetClicks;

  return (
    <div className="flex flex-col gap-3 w-full">
      {/* 16:9 Video Player Screen */}
      <div className="relative aspect-video w-full bg-black rounded-2xl sm:rounded-3xl overflow-hidden border border-purple-500/30 shadow-[0_0_50px_rgba(139,92,246,0.3)]">
        {/* Desktop Overlay Server Bar (visible on sm+) */}
        {parsedSources.isImdbOrTmdb && (
          <div className="hidden sm:flex absolute top-3 left-3 right-3 z-40 items-center justify-between bg-slate-950/85 backdrop-blur-md px-3.5 py-1.5 rounded-xl border border-purple-500/20 text-xs">
            <div className="flex items-center space-x-1.5 text-rose-300 font-medium">
              <Server className="w-3.5 h-3.5 text-rose-400" />
              <span>Server:</span>
            </div>
            <div className="flex items-center space-x-1.5">
              {[
                { id: 1, label: "VidLink (1080p)" },
                { id: 2, label: "VidSrc" },
                { id: 3, label: "Backup" },
                { id: 4, label: "🌙 Arabic Subs" }
              ].map((s) => (
                <button
                  key={s.id}
                  type="button"
                  onClick={() => setSelectedServer(s.id)}
                  className={`px-3 py-1 rounded-lg font-semibold transition-all text-xs ${
                    selectedServer === s.id
                      ? "bg-gradient-to-r from-rose-600 to-purple-600 text-white shadow-sm"
                      : "bg-slate-800/80 text-purple-200 hover:bg-slate-700"
                  }`}
                >
                  {s.label}
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Desktop Overlay TV Series Selector (visible on sm+) */}
        {isSeries && (
          <div className="hidden sm:flex absolute top-13 left-3 right-3 z-40 flex-wrap items-center justify-between gap-2 bg-slate-950/90 backdrop-blur-md px-3.5 py-1.5 rounded-xl border border-purple-500/20 text-xs">
            <div className="flex items-center space-x-3">
              <span className="font-bold text-rose-400 uppercase tracking-wider flex items-center space-x-1">
                <Tv className="w-3.5 h-3.5" />
                <span>Series</span>
              </span>
              <div className="flex items-center space-x-1.5">
                <span className="text-slate-400">Season:</span>
                <select
                  value={season}
                  onChange={(e) => {
                    setSeason(Number(e.target.value));
                    setEpisode(1);
                  }}
                  className="bg-slate-800 border border-purple-500/30 text-white rounded px-2 py-0.5 font-semibold focus:outline-none focus:border-rose-500 text-xs"
                >
                  {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((s) => (
                    <option key={s} value={s}>Season {s}</option>
                  ))}
                </select>
              </div>
              <div className="flex items-center space-x-1.5">
                <span className="text-slate-400">Episode:</span>
                <select
                  value={episode}
                  onChange={(e) => setEpisode(Number(e.target.value))}
                  className="bg-slate-800 border border-purple-500/30 text-white rounded px-2 py-0.5 font-semibold focus:outline-none focus:border-rose-500 text-xs"
                >
                  {Array.from({ length: 24 }, (_, i) => i + 1).map((ep) => (
                    <option key={ep} value={ep}>Episode {ep}</option>
                  ))}
                </select>
              </div>
            </div>
            <div className="flex items-center space-x-1.5">
              <button
                type="button"
                disabled={episode <= 1}
                onClick={() => setEpisode((prev) => Math.max(1, prev - 1))}
                className="px-2.5 py-0.5 bg-slate-800 hover:bg-slate-700 disabled:opacity-30 rounded text-slate-200 font-medium text-xs"
              >
                ◀ Prev
              </button>
              <button
                type="button"
                onClick={() => setEpisode((prev) => prev + 1)}
                className="px-2.5 py-0.5 bg-gradient-to-r from-rose-600 to-purple-600 hover:from-rose-500 hover:to-purple-500 rounded text-white font-bold text-xs"
              >
                Next ▶
              </button>
            </div>
          </div>
        )}

        {/* Sponsor / Fake Ads Verification Screen */}
        {needsPopups && (
          <div 
            className="absolute inset-0 z-50 flex flex-col items-center justify-center cursor-pointer bg-slate-950/90 backdrop-blur-sm p-4 text-center transition-all"
            onClick={handleFakeClick}
          >
            {/* Pulsing Play Button */}
            <div className="w-14 sm:w-20 h-14 sm:h-20 bg-gradient-to-r from-rose-600 to-purple-600 rounded-full flex items-center justify-center shadow-[0_0_35px_rgba(244,63,94,0.5)] transition-transform mb-3 sm:mb-6 animate-pulse">
              <Play className="w-6 sm:w-9 h-6 sm:h-9 text-white fill-current ml-0.5 sm:ml-1" />
            </div>
            
            {/* Ad Verification Notice */}
            <div className="bg-slate-900/95 border border-purple-500/30 px-5 sm:px-8 py-3.5 sm:py-6 rounded-xl sm:rounded-2xl max-w-xs sm:max-w-md shadow-2xl backdrop-blur-xl">
              <div className="inline-flex items-center space-x-1.5 text-rose-400 text-[10px] sm:text-xs font-semibold uppercase tracking-wider mb-1 sm:mb-2">
                <ShieldCheck className="w-3.5 sm:w-4 h-3.5 sm:h-4" />
                <span>Verification</span>
              </div>
              <h3 className="text-base sm:text-xl font-bold text-white mb-1 sm:mb-2">Unlock HD Stream</h3>
              <p className="text-slate-300 mb-3 sm:mb-5 text-xs sm:text-sm leading-relaxed line-clamp-2 sm:line-clamp-none">
                Tap play to support free streaming.
              </p>
              
              {/* Progress Bar */}
              <div className="w-full bg-slate-800 rounded-full h-2 sm:h-2.5 mb-2 overflow-hidden border border-purple-500/20">
                <div 
                  className="bg-gradient-to-r from-rose-500 to-purple-600 h-2 sm:h-2.5 rounded-full transition-all duration-300" 
                  style={{ width: `${(clickCount / targetClicks) * 100}%` }}
                />
              </div>
              <div className="flex items-center justify-between text-[10px] sm:text-xs">
                <span className="text-purple-300/70 font-medium">Steps completed</span>
                <span className="text-rose-400 font-bold">{clickCount} / {targetClicks}</span>
              </div>
            </div>
          </div>
        )}

        {/* Video Player Frame */}
        <div className="w-full h-full">
          {parsedSources.isDirectVideo ? (
            <video 
              ref={videoRef}
              key={`direct-${parsedSources.currentUrl}`}
              controls={!needsPopups}
              className="w-full h-full object-contain" 
              poster={thumbnailUrl || undefined}
              src={parsedSources.currentUrl}
              playsInline
            />
          ) : (
            <iframe 
              key={`embed-${parsedSources.currentUrl}`}
              src={needsPopups ? undefined : parsedSources.currentUrl}
              className="w-full h-full border-0"
              allowFullScreen
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; fullscreen"
            />
          )}
        </div>
      </div>

      {/* Dedicated Mobile Controls Bar (Servers + TV Series Episode Switcher) */}
      <div className="flex sm:hidden flex-col gap-2.5 bg-slate-900/80 border border-purple-500/20 p-3 rounded-2xl backdrop-blur-md">
        {/* Mobile Server Selector */}
        {parsedSources.isImdbOrTmdb && (
          <div className="flex flex-col gap-2">
            <span className="text-[11px] text-rose-300 font-bold uppercase tracking-wider flex items-center gap-1 shrink-0">
              <Server className="w-3.5 h-3.5" />
              <span>Server:</span>
            </span>
            <div className="grid grid-cols-2 gap-1.5">
              {[
                { id: 1, label: "VidLink" },
                { id: 2, label: "VidSrc" },
                { id: 3, label: "Backup" },
                { id: 4, label: "🌙 Arabic" }
              ].map((s) => (
                <button
                  key={s.id}
                  type="button"
                  onClick={() => setSelectedServer(s.id)}
                  className={`py-1.5 px-2 rounded-xl text-xs font-bold transition-all text-center min-h-[36px] ${
                    selectedServer === s.id
                      ? "bg-gradient-to-r from-rose-600 to-purple-600 text-white shadow"
                      : "bg-slate-800/80 text-purple-200 border border-purple-500/10"
                  }`}
                >
                  {s.label}
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Mobile TV Series Switcher */}
        {isSeries && (
          <div className="flex flex-col gap-2 pt-2 border-t border-purple-900/30">
            <div className="flex items-center justify-between gap-2">
              <div className="flex items-center gap-2 flex-1">
                {/* Season Dropdown */}
                <select
                  value={season}
                  onChange={(e) => {
                    setSeason(Number(e.target.value));
                    setEpisode(1);
                  }}
                  className="bg-slate-800 border border-purple-500/30 text-white rounded-xl px-2.5 py-2 text-xs font-bold flex-1 focus:outline-none focus:border-rose-500 min-h-[40px]"
                >
                  {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((s) => (
                    <option key={s} value={s}>Season {s}</option>
                  ))}
                </select>

                {/* Episode Dropdown */}
                <select
                  value={episode}
                  onChange={(e) => setEpisode(Number(e.target.value))}
                  className="bg-slate-800 border border-purple-500/30 text-white rounded-xl px-2.5 py-2 text-xs font-bold flex-1 focus:outline-none focus:border-rose-500 min-h-[40px]"
                >
                  {Array.from({ length: 24 }, (_, i) => i + 1).map((ep) => (
                    <option key={ep} value={ep}>Episode {ep}</option>
                  ))}
                </select>
              </div>

              {/* Prev / Next Episode Buttons */}
              <div className="flex items-center gap-1.5 shrink-0">
                <button
                  type="button"
                  disabled={episode <= 1}
                  onClick={() => setEpisode((prev) => Math.max(1, prev - 1))}
                  className="p-2 bg-slate-800 hover:bg-slate-700 disabled:opacity-30 rounded-xl text-slate-200 min-h-[40px] min-w-[40px] flex items-center justify-center border border-purple-500/10"
                  aria-label="Previous episode"
                >
                  <ChevronLeft className="w-4 h-4" />
                </button>
                <button
                  type="button"
                  onClick={() => setEpisode((prev) => prev + 1)}
                  className="p-2 bg-gradient-to-r from-rose-600 to-purple-600 rounded-xl text-white min-h-[40px] min-w-[40px] flex items-center justify-center shadow"
                  aria-label="Next episode"
                >
                  <ChevronRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
