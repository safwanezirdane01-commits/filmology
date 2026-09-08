"use client";

import { useState, useRef, useEffect, useMemo } from "react";
import { Play, Server, Film, ShieldCheck, Tv } from "lucide-react";

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

    if (isSeries && (isImdbId || isTmdbId)) {
      server1 = `https://vidlink.pro/tv/${trimmed}/${season}/${episode}`;
      server2 = `https://vidsrc.me/embed/tv?${isImdbId ? `imdb=${trimmed}` : `tmdb=${trimmed}`}&season=${season}&episode=${episode}`;
      server3 = `https://vidsrc.xyz/embed/tv/${trimmed}/${season}-${episode}`;
    } else if (isImdbId || isTmdbId) {
      server1 = `https://vidlink.pro/movie/${trimmed}`;
      server2 = `https://vidsrc.me/embed/movie?${isImdbId ? `imdb=${trimmed}` : `tmdb=${trimmed}`}`;
      server3 = `https://vidsrc.xyz/embed/movie/${trimmed}`;
    } else if (youtubeEmbed) {
      server1 = youtubeEmbed;
      server2 = youtubeEmbed;
      server3 = youtubeEmbed;
    } else if (isDirectVideo) {
      server1 = trimmed;
      server2 = trimmed;
      server3 = trimmed;
    } else {
      // It's already a full embed URL or custom provider
      server1 = trimmed;
      server2 = trimmed;
      server3 = trimmed;
    }

    return {
      isDirectVideo,
      isImdbOrTmdb: isImdbId || isTmdbId,
      isYoutube: !!youtubeEmbed,
      server1,
      server2,
      server3,
      currentUrl: selectedServer === 1 ? server1 : selectedServer === 2 ? server2 : server3
    };
  }, [movieVideoUrl, selectedServer, isSeries, season, episode]);

  const handleFakeClick = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    
    if (adDirectLink && adDirectLink.startsWith("http")) {
      window.open(adDirectLink, "_blank");
    } else {
      console.log("Sponsor popup triggered! Configure your Adsterra/Monetag link in /admin to earn money.");
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
      <div className="w-full h-full flex flex-col items-center justify-center bg-slate-950 text-purple-300/60 p-8 text-center">
        <Film className="w-16 h-16 mb-4 text-purple-600/40 animate-pulse" />
        <h3 className="text-xl font-bold text-white mb-2">No Video Available</h3>
        <p className="text-sm max-w-md">Add a video link, embed URL, or IMDb/TMDb ID in the Admin panel to start streaming.</p>
      </div>
    );
  }

  const needsPopups = adsEnabled && clickCount < targetClicks;

  return (
    <div className="relative w-full h-full flex flex-col bg-black group overflow-hidden">
      {/* Top Server Selector Bar (for multi-server streaming) */}
      {parsedSources.isImdbOrTmdb && (
        <div className="absolute top-3 left-3 right-3 z-40 flex items-center justify-between bg-slate-950/80 backdrop-blur-md px-4 py-2 rounded-xl border border-purple-500/20 text-xs">
          <div className="flex items-center space-x-2 text-rose-300 font-medium">
            <Server className="w-3.5 h-3.5 text-rose-400" />
            <span className="hidden sm:inline">Streaming Server:</span>
          </div>
          <div className="flex items-center space-x-2">
            <button 
              type="button"
              onClick={() => setSelectedServer(1)}
              className={`px-3 py-1 rounded-lg font-semibold transition-all ${
                selectedServer === 1 
                  ? "bg-gradient-to-r from-rose-600 to-purple-600 text-white shadow-md shadow-rose-500/20" 
                  : "bg-slate-800/80 text-purple-200 hover:bg-slate-700"
              }`}
            >
              VidLink (1080p)
            </button>
            <button 
              type="button"
              onClick={() => setSelectedServer(2)}
              className={`px-3 py-1 rounded-lg font-semibold transition-all ${
                selectedServer === 2 
                  ? "bg-gradient-to-r from-rose-600 to-purple-600 text-white shadow-md shadow-rose-500/20" 
                  : "bg-slate-800/80 text-purple-200 hover:bg-slate-700"
              }`}
            >
              VidSrc
            </button>
            <button 
              type="button"
              onClick={() => setSelectedServer(3)}
              className={`px-3 py-1 rounded-lg font-semibold transition-all ${
                selectedServer === 3 
                  ? "bg-gradient-to-r from-rose-600 to-purple-600 text-white shadow-md shadow-rose-500/20" 
                  : "bg-slate-800/80 text-purple-200 hover:bg-slate-700"
              }`}
            >
              Backup
            </button>
          </div>
        </div>
      )}

      {/* TV Series Season & Episode Controller Bar */}
      {isSeries && (
        <div className="absolute top-14 left-3 right-3 z-40 flex flex-wrap items-center justify-between gap-2 bg-slate-950/90 backdrop-blur-md px-4 py-2 rounded-xl border border-purple-500/20 text-xs">
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
                className="bg-slate-800 border border-purple-500/30 text-white rounded px-2 py-1 font-semibold focus:outline-none focus:border-rose-500"
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
                className="bg-slate-800 border border-purple-500/30 text-white rounded px-2 py-1 font-semibold focus:outline-none focus:border-rose-500"
              >
                {Array.from({ length: 24 }, (_, i) => i + 1).map((ep) => (
                  <option key={ep} value={ep}>Episode {ep}</option>
                ))}
              </select>
            </div>
          </div>
          <div className="flex items-center space-x-2">
            <button
              type="button"
              disabled={episode <= 1}
              onClick={() => setEpisode((prev) => Math.max(1, prev - 1))}
              className="px-2.5 py-1 bg-slate-800 hover:bg-slate-700 disabled:opacity-30 rounded text-slate-200 font-medium"
            >
              ◀ Prev
            </button>
            <button
              type="button"
              onClick={() => setEpisode((prev) => prev + 1)}
              className="px-2.5 py-1 bg-gradient-to-r from-rose-600 to-purple-600 hover:from-rose-500 hover:to-purple-500 rounded text-white font-bold"
            >
              Next ▶
            </button>
          </div>
        </div>
      )}

      {/* Sponsor / Fake Ads Verification Screen */}
      {needsPopups && (
        <div 
          className="absolute inset-0 z-50 flex flex-col items-center justify-center cursor-pointer bg-slate-950/90 backdrop-blur-sm transition-all"
          onClick={handleFakeClick}
        >
          {/* Pulsing Play Button */}
          <div className="w-20 h-20 bg-gradient-to-r from-rose-600 to-purple-600 rounded-full flex items-center justify-center shadow-[0_0_40px_rgba(244,63,94,0.5)] group-hover:scale-110 transition-transform mb-6 animate-pulse">
            <Play className="w-9 h-9 text-white fill-current ml-1" />
          </div>
          
          {/* Ad Verification Notice */}
          <div className="bg-slate-900/95 border border-purple-500/30 px-8 py-6 rounded-2xl text-center max-w-md shadow-2xl mx-4 backdrop-blur-xl">
            <div className="inline-flex items-center space-x-2 text-rose-400 text-xs font-semibold uppercase tracking-wider mb-2">
              <ShieldCheck className="w-4 h-4" />
              <span>Sponsor Verification</span>
            </div>
            <h3 className="text-xl font-bold text-white mb-2">Unlock HD Stream</h3>
            <p className="text-slate-300 mb-5 text-sm leading-relaxed">
              Click play to support FilmologyX free streaming. Stream will unlock after verification.
            </p>
            
            {/* Progress Bar */}
            <div className="w-full bg-slate-800 rounded-full h-2.5 mb-3 overflow-hidden border border-purple-500/20">
              <div 
                className="bg-gradient-to-r from-rose-500 to-purple-600 h-2.5 rounded-full transition-all duration-300 shadow-[0_0_10px_rgba(244,63,94,0.5)]" 
                style={{ width: `${(clickCount / targetClicks) * 100}%` }}
              />
            </div>
            <div className="flex items-center justify-between text-xs">
              <span className="text-purple-300/70 font-medium">Steps completed</span>
              <span className="text-rose-400 font-bold">{clickCount} / {targetClicks}</span>
            </div>
          </div>
        </div>
      )}

      {/* Main Video Stream Container */}
      <div className="w-full h-full flex-1">
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
  );
}

