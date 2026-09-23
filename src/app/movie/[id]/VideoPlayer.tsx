"use client";

import { useState, useRef, useEffect, useMemo, useCallback } from "react";
import { Play, Server, Film, ShieldCheck, Tv, ChevronLeft, ChevronRight, Download, Clock, RotateCcw, Zap, RefreshCw } from "lucide-react";
import { isRealSeries, getSeriesMetadata, getEpisodesForSeason } from "@/lib/series";
import SeriesEpisodeNavigator from "@/components/SeriesEpisodeNavigator";
import { saveWatchProgress, getWatchProgress, clearWatchItem, formatTime, WatchItem } from "@/lib/watchProgress";

export default function VideoPlayer({ 
  movieVideoUrl, 
  thumbnailUrl,
  genre,
  title = "Movie",
  adDirectLink,
  requiredClicks = 2,
  adsEnabled = true,
}: { 
  movieVideoUrl: string | null; 
  thumbnailUrl: string | null;
  genre?: string;
  title?: string;
  adDirectLink?: string;
  requiredClicks?: number;
  adsEnabled?: boolean;
}) {
  const [clickCount, setClickCount] = useState(0);
  const [selectedServer, setSelectedServer] = useState<number>(1);
  const [isAutoMode, setIsAutoMode] = useState<boolean>(true);
  const [autoStatusMessage, setAutoStatusMessage] = useState<string | null>(null);
  const [season, setSeason] = useState<number>(1);
  const [episode, setEpisode] = useState<number>(1);
  const DEFAULT_AD_LINK = "https://consciousdunkvastly.com/vkcab8pm?key=2d7f9ab1644671035abd720ada6bab69";
  const activeAdLink = (adDirectLink && adDirectLink.startsWith("http")) ? adDirectLink : DEFAULT_AD_LINK;
  const effectiveClicks = (typeof requiredClicks === "number" && requiredClicks > 0) ? requiredClicks : 3;
  const targetClicks = Math.max(1, effectiveClicks);
  const videoRef = useRef<HTMLVideoElement>(null);

  // Arabic subtitle state & IMDb ID resolution
  const [arabicSubTracks, setArabicSubTracks] = useState<Array<{ id: string; label: string; url: string }>>([]);
  const [activeArabicSubUrl, setActiveArabicSubUrl] = useState<string | null>(null);
  const [loadingSubs, setLoadingSubs] = useState<boolean>(false);
  const [resolvedImdbId, setResolvedImdbId] = useState<string | null>(null);

  // Watch progress tracking state
  const [savedProgress, setSavedProgress] = useState<WatchItem | null>(null);
  const [showResumeBanner, setShowResumeBanner] = useState<boolean>(true);
  const [isServerLoaded, setIsServerLoaded] = useState<boolean>(false);

  // Check if title is a TV Series (strict - movies are NEVER a series)
  const isSeries = useMemo(() => {
    return isRealSeries(movieVideoUrl, genre);
  }, [genre, movieVideoUrl]);

  const seriesMeta = useMemo(() => {
    return isSeries ? getSeriesMetadata(movieVideoUrl, genre) : null;
  }, [isSeries, movieVideoUrl, genre]);

  const availableEpisodesCount = useMemo(() => {
    return isSeries ? getEpisodesForSeason(movieVideoUrl, season, genre) : 0;
  }, [isSeries, movieVideoUrl, season, genre]);

  // Load saved watch progress for current title/season/episode
  useEffect(() => {
    if (!movieVideoUrl) return;
    const progress = getWatchProgress(movieVideoUrl, season, episode);
    setSavedProgress(progress);
    setShowResumeBanner(!!progress);
  }, [movieVideoUrl, season, episode]);

  // NOTE: No window.open override here — the iframe sandbox attribute on the player
  // already blocks streaming servers from opening unauthorized popups.
  // Our own ad clicks use window.open directly from user gesture (onClick) so they work fine.

  // Listen for player postMessage events (e.g. VidLink or HTML5 video) for progress & auto load status
  useEffect(() => {
    const handleMsg = (e: MessageEvent) => {
      try {
        if (e.data && typeof e.data === "object") {
          setIsServerLoaded(true);
          const { type, data, time, duration } = e.data;
          let curr = 0;
          let dur = 0;
          if (type === "MEDIA_DATA" && data) {
            curr = data.currentTime || data.time || 0;
            dur = data.duration || 0;
          } else if (typeof time === "number") {
            curr = time;
            dur = duration || 0;
          }
          if (curr > 5 && movieVideoUrl) {
            saveWatchProgress({
              id: movieVideoUrl,
              title: title || "Movie",
              thumbnailUrl,
              currentTime: Math.floor(curr),
              duration: Math.floor(dur) || 7200,
              genre,
              season: isSeries ? season : undefined,
              episode: isSeries ? episode : undefined,
            });
            const updated = getWatchProgress(movieVideoUrl, season, episode);
            if (updated) setSavedProgress(updated);
          }
        }
      } catch {}
    };

    window.addEventListener("message", handleMsg);
    return () => window.removeEventListener("message", handleMsg);
  }, [movieVideoUrl, title, thumbnailUrl, genre, isSeries, season, episode]);

  // Periodic watch progress saver while user stays on player page
  useEffect(() => {
    if (!movieVideoUrl) return;
    let secondsWatched = 0;
    const interval = setInterval(() => {
      secondsWatched += 15;
      const existing = getWatchProgress(movieVideoUrl, season, episode);
      const newTime = (existing?.currentTime || 0) + 15;
      saveWatchProgress({
        id: movieVideoUrl,
        title: title || "Movie",
        thumbnailUrl,
        currentTime: newTime,
        duration: existing?.duration || 7200,
        genre,
        season: isSeries ? season : undefined,
        episode: isSeries ? episode : undefined,
      });
      const p = getWatchProgress(movieVideoUrl, season, episode);
      if (p) setSavedProgress(p);
    }, 15000);

    return () => clearInterval(interval);
  }, [movieVideoUrl, title, thumbnailUrl, genre, isSeries, season, episode]);

  // Fetch verified Arabic subtitles from /api/subtitles & resolve IMDb ID
  useEffect(() => {
    if (!movieVideoUrl) return;
    setLoadingSubs(true);
    fetch(`/api/subtitles?id=${encodeURIComponent(movieVideoUrl)}&type=${isSeries ? "series" : "movie"}&season=${season}&episode=${episode}`)
      .then((res) => res.json())
      .then((data) => {
        if (data.success) {
          if (data.imdbId) {
            setResolvedImdbId(data.imdbId);
          }
          if (data.tracks && data.tracks.length > 0) {
            setArabicSubTracks(data.tracks);
            const origin = typeof window !== "undefined" ? window.location.origin : "";
            const proxied = `${origin}/api/subtitles/vtt?url=${encodeURIComponent(data.defaultArabicUrl)}`;
            setActiveArabicSubUrl(proxied);
          } else {
            setArabicSubTracks([]);
            setActiveArabicSubUrl(null);
          }
        }
      })
      .catch((err) => console.warn("Failed to load Arabic subtitles:", err))
      .finally(() => setLoadingSubs(false));
  }, [movieVideoUrl, isSeries, season, episode]);

  // Read URL query params on mount for direct episode deep-linking (e.g. ?s=1&e=2)
  useEffect(() => {
    if (typeof window !== "undefined") {
      const params = new URLSearchParams(window.location.search);
      const sParam = params.get("season") || params.get("s");
      const eParam = params.get("episode") || params.get("e");
      if (sParam) {
        const sNum = parseInt(sParam, 10);
        if (!isNaN(sNum) && sNum >= 1) setSeason(sNum);
      }
      if (eParam) {
        const eNum = parseInt(eParam, 10);
        if (!isNaN(eNum) && eNum >= 1) setEpisode(eNum);
      }
    }
  }, []);

  // Normalize and parse the video URL or ID
  const parsedSources = useMemo(() => {
    if (!movieVideoUrl) return null;

    let trimmed = movieVideoUrl.trim();
    if (trimmed.startsWith("tv:")) {
      trimmed = trimmed.replace("tv:", "");
    }

    const effectiveId = resolvedImdbId || trimmed;

    // Check if it's an IMDb ID (e.g. tt0816692) or TMDb ID (e.g. 157336)
    const isImdbId = /^tt\d+$/i.test(effectiveId);
    const isTmdbId = /^\d+$/.test(effectiveId);

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
    let server5 = "";

    if (isSeries && (isImdbId || isTmdbId)) {
      server1 = `https://www.2embed.skin/embedtv/${effectiveId}&s=${season}&e=${episode}`;
      server2 = `https://anyembed.xyz/embed/tmdb-tv-${effectiveId}-${season}-${episode}`;
      server3 = `https://vidsrc.sh/embed/tv?tmdb=${effectiveId}&season=${season}&episode=${episode}`;
      server4 = `https://frembed.pro/api/serie.php?id=${effectiveId}&sa=${season}&epi=${episode}`;
      server5 = `https://autoembed.co/tv/tmdb/${effectiveId}/${season}/${episode}`;
    } else if (isImdbId || isTmdbId) {
      server1 = `https://www.2embed.skin/embed/${effectiveId}`;
      server2 = `https://anyembed.xyz/embed/tmdb-movie-${effectiveId}`;
      server3 = `https://vidsrc.sh/embed/movie?tmdb=${effectiveId}`;
      server4 = `https://frembed.pro/api/film.php?id=${effectiveId}`;
      server5 = `https://autoembed.co/movie/tmdb/${effectiveId}`;
    } else if (youtubeEmbed) {
      server1 = youtubeEmbed;
      server2 = youtubeEmbed;
      server3 = youtubeEmbed;
      server4 = youtubeEmbed;
      server5 = youtubeEmbed;
    } else if (isDirectVideo) {
      server1 = trimmed;
      server2 = trimmed;
      server3 = trimmed;
      server4 = trimmed;
      server5 = trimmed;
    } else {
      server1 = trimmed;
      server2 = trimmed;
      server3 = trimmed;
      server4 = trimmed;
      server5 = trimmed;
    }

    return {
      isImdbOrTmdb: isImdbId || isTmdbId,
      isDirectVideo,
      server1,
      server2,
      server3,
      server4,
      server5,
      currentUrl: selectedServer === 1 ? server1 : selectedServer === 2 ? server2 : selectedServer === 3 ? server3 : selectedServer === 4 ? server4 : server5
    };
  }, [movieVideoUrl, resolvedImdbId, selectedServer, isSeries, season, episode]);



  const handleFakeClick = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();

    // Immediately trigger the ad tab upon direct user click
    try {
      window.open(activeAdLink, "_blank");
    } catch (err) {
      console.error("Popup launch error:", err);
    }

    setClickCount((prev) => prev + 1);
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

  const needsPopups = (adsEnabled ?? true) && clickCount < targetClicks;

  const serverList = useMemo(() => [
    { id: 1, label: "2Embed (Stream 1)", short: "2Embed" },
    { id: 2, label: "AnyEmbed (Stream 2)", short: "AnyEmbed" },
    { id: 3, label: "VidSrc (Stream 3)", short: "VidSrc" },
    { id: 4, label: "FrEmbed (Stream 4)", short: "FrEmbed" },
    { id: 5, label: "AutoEmbed (Stream 5)", short: "AutoEmbed" },
  ], []);

  const handleNextServer = useCallback((reason?: string) => {
    setSelectedServer((prev) => {
      const next = prev >= 5 ? 1 : prev + 1;
      const targetServer = serverList.find((s) => s.id === next);
      const name = targetServer ? targetServer.label : `Server ${next}`;
      setAutoStatusMessage(reason ? `${reason} → Switched to ${name}` : `⚡ Switched to ${name}`);
      setTimeout(() => setAutoStatusMessage(null), 3500);
      return next;
    });
  }, [serverList]);

  // Watchdog timer: automatically switch to next server if current server doesn't respond or load within 8s in Auto mode
  useEffect(() => {
    if (!isAutoMode || needsPopups || !parsedSources?.isImdbOrTmdb) return;

    setIsServerLoaded(false);

    const watchdog = setTimeout(() => {
      if (!isServerLoaded) {
        handleNextServer("Server unreachable");
      }
    }, 8000);

    return () => clearTimeout(watchdog);
  }, [selectedServer, isAutoMode, needsPopups, parsedSources, handleNextServer, isServerLoaded]);

  return (
    <div className="flex flex-col gap-3 w-full">
      {/* Resume Watching Progress Banner */}
      {showResumeBanner && savedProgress && savedProgress.currentTime > 10 && (
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 bg-gradient-to-r from-rose-950/90 via-purple-950/90 to-slate-900/95 border border-rose-500/40 p-3.5 sm:px-5 sm:py-3 rounded-2xl sm:backdrop-blur-md shadow-xl transition-all">
          <div className="flex items-center space-x-3 text-slate-100">
            <div className="p-2 bg-rose-500/20 text-rose-400 rounded-xl border border-rose-500/30 shrink-0">
              <Clock className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center space-x-2">
                <span className="font-bold text-white text-xs sm:text-sm">Continue Watching</span>
                <span className="bg-rose-500/25 text-rose-300 font-extrabold px-2 py-0.5 rounded-md text-[10px]">
                  {savedProgress.progressPercent}% Completed
                </span>
              </div>
              <p className="text-slate-300 text-xs mt-0.5">
                You stopped at <strong className="text-rose-400 font-bold">{formatTime(savedProgress.currentTime)}</strong>. Click to jump back to where you left off.
              </p>
            </div>
          </div>

          <div className="flex items-center space-x-2 w-full sm:w-auto shrink-0">
            <button
              type="button"
              onClick={() => {
                setShowResumeBanner(false);
              }}
              className="flex-1 sm:flex-none inline-flex items-center justify-center space-x-1.5 bg-gradient-to-r from-rose-600 to-purple-600 hover:from-rose-500 hover:to-purple-500 text-white font-bold text-xs px-4 py-2 rounded-xl shadow-lg transition-transform hover:scale-105 cursor-pointer"
            >
              <Play className="w-3.5 h-3.5 fill-current" />
              <span>Resume at {formatTime(savedProgress.currentTime)}</span>
            </button>
            <button
              type="button"
              onClick={() => {
                if (movieVideoUrl) clearWatchItem(movieVideoUrl, season, episode);
                setSavedProgress(null);
                setShowResumeBanner(false);
              }}
              className="p-2 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-xl text-xs font-semibold border border-purple-500/20 cursor-pointer"
              title="Clear watch progress and start from 0:00"
            >
              <RotateCcw className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}

      {/* 16:9 Video Player Screen */}
      <div id="video-player-screen" className="relative aspect-video w-full bg-black rounded-2xl sm:rounded-3xl overflow-hidden border border-purple-500/30 shadow-[0_0_50px_rgba(139,92,246,0.3)] gpu-layer">
        {/* Desktop Overlay Server Bar (visible on sm+) */}
        {parsedSources.isImdbOrTmdb && (
          <div className="hidden sm:flex absolute top-3 left-3 right-3 z-40 items-center justify-between bg-slate-950/85 sm:backdrop-blur-md px-3.5 py-1.5 rounded-xl border border-purple-500/20 text-xs">
            <div className="flex items-center space-x-2">
              <div className="flex items-center space-x-1.5 text-rose-300 font-medium">
                <Server className="w-3.5 h-3.5 text-rose-400" />
                <span>Server:</span>
              </div>
              <button
                type="button"
                onClick={() => {
                  setIsAutoMode(true);
                  setSelectedServer(1);
                  setAutoStatusMessage("⚡ Auto Mode: Playing fastest stream (AutoEmbed)");
                  setTimeout(() => setAutoStatusMessage(null), 3500);
                }}
                className={`px-2.5 py-1 rounded-lg font-bold transition-all text-xs flex items-center space-x-1 cursor-pointer ${
                  isAutoMode
                    ? "bg-gradient-to-r from-amber-500 to-rose-500 text-white shadow-sm ring-1 ring-amber-300/40"
                    : "bg-slate-800/80 text-amber-300/80 hover:bg-slate-700"
                }`}
                title="Automatically plays the best working server"
              >
                <Zap className="w-3 h-3 fill-current text-amber-200" />
                <span>Auto (Best)</span>
              </button>
            </div>

            <div className="flex items-center space-x-1.5 flex-wrap">
              {serverList.map((s) => (
                <button
                  key={s.id}
                  type="button"
                  onClick={() => {
                    setSelectedServer(s.id);
                    setIsAutoMode(false);
                  }}
                  className={`px-2.5 py-1 rounded-lg font-semibold transition-all text-xs cursor-pointer ${
                    selectedServer === s.id && !isAutoMode
                      ? "bg-gradient-to-r from-rose-600 to-purple-600 text-white shadow-sm"
                      : selectedServer === s.id && isAutoMode
                      ? "bg-purple-900/60 text-purple-200 font-bold border border-rose-500/60 shadow-sm"
                      : "bg-slate-800/80 text-purple-200 hover:bg-slate-700"
                  }`}
                >
                  {s.label}
                </button>
              ))}

              <button
                type="button"
                onClick={() => handleNextServer()}
                className="px-2 py-1 bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white rounded-lg text-xs font-semibold border border-purple-500/20 flex items-center space-x-1 cursor-pointer transition-colors"
                title="Stream buffering or not working? Click to try next server"
              >
                <RefreshCw className="w-3 h-3 text-rose-400" />
                <span>Next ↻</span>
              </button>
            </div>
          </div>
        )}

        {/* Desktop Overlay TV Series Selector (visible on sm+) */}
        {isSeries && (
          <div className="hidden sm:flex absolute top-13 left-3 right-3 z-40 flex-wrap items-center justify-between gap-2 bg-slate-950/90 sm:backdrop-blur-md px-3.5 py-1.5 rounded-xl border border-purple-500/20 text-xs">
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
                  {Array.from({ length: Math.max(1, seriesMeta?.totalSeasons || 10) }, (_, i) => i + 1).map((s) => (
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
                  {Array.from({ length: availableEpisodesCount }, (_, i) => i + 1).map((ep) => (
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

        {/* Sponsor / Fake Ads Verification Screen (Anti-Bypass Enabled) */}
        {needsPopups && (
          <div 
            className="absolute inset-0 z-50 flex flex-col items-center justify-center bg-slate-950/95 sm:backdrop-blur-md p-4 text-center transition-all select-none"
            onClick={handleFakeClick}
          >
            {/* Play Icon */}
            <div className="w-14 sm:w-20 h-14 sm:h-20 bg-gradient-to-r from-rose-600 to-purple-600 rounded-full flex items-center justify-center shadow-[0_0_35px_rgba(244,63,94,0.5)] transition-transform mb-3 sm:mb-5 cursor-pointer hover:scale-105">
              <Play className="w-6 sm:w-9 h-6 sm:h-9 text-white fill-current ml-0.5 sm:ml-1" />
            </div>
            
            {/* Ad Verification Card */}
            <div className="bg-slate-900/95 border border-purple-500/40 px-5 sm:px-8 py-3.5 sm:py-6 rounded-xl sm:rounded-2xl max-w-xs sm:max-w-md shadow-2xl sm:backdrop-blur-xl">
              <div className="inline-flex items-center space-x-1.5 text-rose-400 text-[10px] sm:text-xs font-semibold uppercase tracking-wider mb-1 sm:mb-2">
                <ShieldCheck className="w-3.5 sm:w-4 h-3.5 sm:h-4" />
                <span>Stream Security Verification</span>
              </div>
              
              <h3 className="text-base sm:text-xl font-bold text-white mb-1">
                Unlock HD Stream
              </h3>

              <p className="text-slate-300 mb-3 sm:mb-4 text-xs sm:text-sm leading-relaxed">
                {`Tap play screen to complete step ${clickCount + 1} of ${targetClicks}.`}
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

        {/* Floating Auto-Status Notification Toast */}
        {autoStatusMessage && (
          <div className="absolute top-12 left-1/2 -translate-x-1/2 z-50 bg-slate-950/95 border border-amber-500/60 text-amber-300 px-4 py-1.5 rounded-full text-xs font-bold shadow-2xl flex items-center space-x-2 sm:backdrop-blur-md">
            <Zap className="w-3.5 h-3.5 text-amber-400 fill-current shrink-0" />
            <span>{autoStatusMessage}</span>
          </div>
        )}

        {/* Video Player Frame */}
        <div className="w-full h-full relative">
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
              onLoad={() => setIsServerLoaded(true)}
              onError={() => {
                if (isAutoMode) handleNextServer("Server error");
              }}
            />
          )}
        </div>
      </div>

      {/* Subtitles & Quick Server Failsafe Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2.5 bg-slate-900/95 border border-purple-500/30 p-3 sm:px-4 sm:py-3 rounded-xl sm:rounded-2xl sm:backdrop-blur-md shadow-lg">
        <div className="flex items-center space-x-2 text-slate-200 flex-1 min-w-0">
          <span className={`font-bold px-2.5 py-0.5 rounded-full border text-[10px] uppercase tracking-wider shrink-0 flex items-center gap-1 ${arabicSubTracks.length > 0 ? "bg-emerald-500/20 text-emerald-300 border-emerald-500/30" : loadingSubs ? "bg-purple-500/20 text-purple-300 border-purple-500/30" : "bg-slate-700/50 text-slate-400 border-slate-600/30"}`}>
            <span className={`w-1.5 h-1.5 rounded-full ${arabicSubTracks.length > 0 ? "bg-emerald-400 animate-pulse" : loadingSubs ? "bg-purple-400 animate-pulse" : "bg-slate-500"}`}></span>
            <span>Arabic Subs</span>
          </span>
          <span className="text-slate-300 text-xs truncate">
            {loadingSubs ? (
              <span className="text-purple-300">Searching Arabic subtitles...</span>
            ) : arabicSubTracks.length > 0 ? (
              <span>
                <strong className="text-emerald-400">{arabicSubTracks.length} Arabic subtitle file{arabicSubTracks.length > 1 ? "s" : ""} available</strong>. Download to use with player's "Upload" button if needed.
              </span>
            ) : (
              <span className="text-slate-400">Stream buffering or black screen? Try switching servers.</span>
            )}
          </span>
        </div>

        <div className="flex items-center space-x-2 shrink-0">
          {/* Quick Failsafe Next Server Button */}
          <button
            type="button"
            onClick={() => handleNextServer()}
            className="inline-flex items-center gap-1.5 bg-slate-800 hover:bg-slate-700 border border-purple-500/30 text-purple-200 hover:text-white px-3 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer shadow"
            title="Stream stuck or buffering? Click to switch to next server instantly"
          >
            <RefreshCw className="w-3.5 h-3.5 text-rose-400" />
            <span>Switch Server (↻)</span>
          </button>

          {/* Download Arabic Subtitles Button on the Side */}
          {arabicSubTracks.length > 0 && activeArabicSubUrl && (
            <a
              href={`${activeArabicSubUrl}&download=true&filename=Arabic_Subtitles.vtt`}
              download="Arabic_Subtitles.vtt"
              className="inline-flex items-center gap-1.5 bg-gradient-to-r from-rose-600 to-purple-600 hover:from-rose-500 hover:to-purple-500 text-white text-xs font-bold px-3.5 py-2 rounded-xl shadow transition-all hover:scale-105 cursor-pointer"
            >
              <Download className="w-3.5 h-3.5" />
              <span>Download Subs</span>
            </a>
          )}
        </div>
      </div>

      {/* Dedicated Mobile Controls Bar (Servers + TV Series Episode Switcher) */}
      <div className="flex sm:hidden flex-col gap-2.5 bg-slate-900/95 border border-purple-500/20 p-3 rounded-2xl">
        {/* Mobile Server Selector */}
        {parsedSources.isImdbOrTmdb && (
          <div className="flex flex-col gap-2">
            <div className="flex items-center justify-between">
              <span className="text-[11px] text-rose-300 font-bold uppercase tracking-wider flex items-center gap-1 shrink-0">
                <Server className="w-3.5 h-3.5" />
                <span>Server:</span>
              </span>
              <button
                type="button"
                onClick={() => {
                  setIsAutoMode(true);
                  setSelectedServer(1);
                  setAutoStatusMessage("⚡ Auto Mode: Fastest stream active");
                  setTimeout(() => setAutoStatusMessage(null), 3000);
                }}
                className={`px-2.5 py-0.5 rounded-lg text-[11px] font-bold flex items-center gap-1 ${
                  isAutoMode
                    ? "bg-gradient-to-r from-amber-500 to-rose-500 text-white shadow-sm ring-1 ring-amber-300/40"
                    : "bg-slate-800 text-amber-300"
                }`}
              >
                <Zap className="w-3 h-3 fill-current" />
                <span>⚡ Auto (Best)</span>
              </button>
            </div>
            <div className="grid grid-cols-2 gap-1.5">
              {serverList.map((s) => (
                <button
                  key={s.id}
                  type="button"
                  onClick={() => {
                    setSelectedServer(s.id);
                    setIsAutoMode(false);
                  }}
                  className={`py-1.5 px-2 rounded-xl text-xs font-bold transition-all text-center min-h-[36px] ${
                    selectedServer === s.id && !isAutoMode
                      ? "bg-gradient-to-r from-rose-600 to-purple-600 text-white shadow"
                      : selectedServer === s.id && isAutoMode
                      ? "bg-purple-900/60 text-white border border-rose-500/60 font-black shadow"
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
                  {Array.from({ length: Math.max(1, seriesMeta?.totalSeasons || 1) }, (_, i) => i + 1).map((s) => (
                    <option key={s} value={s}>Season {s}</option>
                  ))}
                </select>

                {/* Episode Dropdown */}
                <select
                  value={episode}
                  onChange={(e) => setEpisode(Number(e.target.value))}
                  className="bg-slate-800 border border-purple-500/30 text-white rounded-xl px-2.5 py-2 text-xs font-bold flex-1 focus:outline-none focus:border-rose-500 min-h-[40px]"
                >
                  {Array.from({ length: availableEpisodesCount }, (_, i) => i + 1).map((ep) => (
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

      {/* Interactive Full Series Episode Navigator & Grid */}
      {isSeries && (
        <div className="mt-2 sm:mt-4">
          <SeriesEpisodeNavigator
            movieVideoUrl={movieVideoUrl}
            genre={genre}
            currentSeason={season}
            currentEpisode={episode}
            onSelectEpisode={(newSeason, newEpisode) => {
              setSeason(newSeason);
              setEpisode(newEpisode);
              const el = document.getElementById("video-player-screen");
              if (el) {
                el.scrollIntoView({ behavior: "smooth", block: "start" });
              }
            }}
          />
        </div>
      )}
    </div>
  );
}
