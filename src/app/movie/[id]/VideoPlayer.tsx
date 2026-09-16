"use client";

import { useState, useRef, useEffect, useMemo } from "react";
import { Play, Server, Film, ShieldCheck, Tv, ChevronLeft, ChevronRight } from "lucide-react";
import { isRealSeries, getSeriesMetadata, getEpisodesForSeason } from "@/lib/series";
import SeriesEpisodeNavigator from "@/components/SeriesEpisodeNavigator";
import dynamic from "next/dynamic";

const NativeArabicPlayer = dynamic(() => import("@/components/NativeArabicPlayer"), { ssr: false });


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

  // Arabic subtitle state
  const [arabicSubTracks, setArabicSubTracks] = useState<Array<{ id: string; label: string; url: string }>>([]);
  const [activeArabicSubUrl, setActiveArabicSubUrl] = useState<string | null>(null);
  const [loadingSubs, setLoadingSubs] = useState<boolean>(false);

  // Native stream state (for the built-in Arabic player, server 6)
  const [streamUrl, setStreamUrl] = useState<string | null>(null);
  const [streamType, setStreamType] = useState<string>("video/mp4");
  const [loadingStream, setLoadingStream] = useState<boolean>(false);
  const [streamError, setStreamError] = useState<string | null>(null);

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

  // Fetch verified Arabic subtitles from /api/subtitles
  useEffect(() => {
    if (!movieVideoUrl) return;
    setLoadingSubs(true);
    fetch(`/api/subtitles?id=${encodeURIComponent(movieVideoUrl)}&type=${isSeries ? "series" : "movie"}&season=${season}&episode=${episode}`)
      .then((res) => res.json())
      .then((data) => {
        if (data.success && data.tracks && data.tracks.length > 0) {
          setArabicSubTracks(data.tracks);
          const origin = typeof window !== "undefined" ? window.location.origin : "";
          const proxied = `${origin}/api/subtitles/vtt?url=${encodeURIComponent(data.defaultArabicUrl)}`;
          setActiveArabicSubUrl(proxied);
        } else {
          setArabicSubTracks([]);
          setActiveArabicSubUrl(null);
        }
      })
      .catch((err) => console.warn("Failed to load Arabic subtitles:", err))
      .finally(() => setLoadingSubs(false));
  }, [movieVideoUrl, isSeries, season, episode]);

  // Fetch real stream URL when "Arabic Player" server (6) is selected
  useEffect(() => {
    if (selectedServer !== 6 || !movieVideoUrl) return;
    setLoadingStream(true);
    setStreamUrl(null);
    setStreamError(null);
    fetch(`/api/stream?id=${encodeURIComponent(movieVideoUrl)}&type=${isSeries ? "series" : "movie"}&season=${season}&episode=${episode}`)
      .then((res) => res.json())
      .then((data) => {
        if (data.success && data.url) {
          setStreamUrl(data.url);
          setStreamType(data.type || "video/mp4");
        } else {
          setStreamError("لم يتم العثور على بث مباشر — جرّب سيرفراً آخر.");
        }
      })
      .catch(() => setStreamError("خطأ في تحميل البث — جرّب سيرفراً آخر."))
      .finally(() => setLoadingStream(false));
  }, [selectedServer, movieVideoUrl, isSeries, season, episode]);


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
    let server5 = "";

    const subParam = activeArabicSubUrl
      ? `&sub_file=${encodeURIComponent(activeArabicSubUrl)}&sub_label=Arabic`
      : "";

    if (isSeries && (isImdbId || isTmdbId)) {
      server1 = `https://multiembed.mov/?video_id=${trimmed}&tmdb=1&s=${season}&e=${episode}`;
      server2 = `https://vidlink.pro/tv/${trimmed}/${season}/${episode}?primaryColor=e11d48&secondaryColor=a855f7&autoplay=true${subParam}`;
      server3 = `https://vidsrc.to/embed/tv/${trimmed}/${season}/${episode}`;
      server4 = `https://vidsrc.me/embed/tv?${isImdbId ? `imdb=${trimmed}` : `tmdb=${trimmed}`}&season=${season}&episode=${episode}`;
      server5 = `https://vidsrc.xyz/embed/tv/${trimmed}/${season}-${episode}`;
    } else if (isImdbId || isTmdbId) {
      server1 = `https://multiembed.mov/?video_id=${trimmed}&tmdb=1`;
      server2 = `https://vidlink.pro/movie/${trimmed}?primaryColor=e11d48&secondaryColor=a855f7&autoplay=true${subParam}`;
      server3 = `https://vidsrc.to/embed/movie/${trimmed}`;
      server4 = `https://vidsrc.me/embed/movie?${isImdbId ? `imdb=${trimmed}` : `tmdb=${trimmed}`}`;
      server5 = `https://vidsrc.xyz/embed/movie/${trimmed}`;
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
  }, [movieVideoUrl, selectedServer, isSeries, season, episode, activeArabicSubUrl]);

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
      <div id="video-player-screen" className="relative aspect-video w-full bg-black rounded-2xl sm:rounded-3xl overflow-hidden border border-purple-500/30 shadow-[0_0_50px_rgba(139,92,246,0.3)]">
        {/* Desktop Overlay Server Bar (visible on sm+) */}
        {parsedSources.isImdbOrTmdb && (
          <div className="hidden sm:flex absolute top-3 left-3 right-3 z-40 items-center justify-between bg-slate-950/85 backdrop-blur-md px-3.5 py-1.5 rounded-xl border border-purple-500/20 text-xs">
            <div className="flex items-center space-x-1.5 text-rose-300 font-medium">
              <Server className="w-3.5 h-3.5 text-rose-400" />
              <span>Server:</span>
            </div>
            <div className="flex items-center space-x-1.5 flex-wrap">
              {[
                { id: 1, label: "Multi-Sub (Arabic)" },
                { id: 2, label: "VidLink (1080p)" },
                { id: 3, label: "VidSrc Pro" },
                { id: 4, label: "VidSrc ME" },
                { id: 5, label: "Backup" },
                { id: 6, label: "🇸🇦 Arabic Player" },
              ].map((s) => (
                <button
                  key={s.id}
                  type="button"
                  onClick={() => setSelectedServer(s.id)}
                  className={`px-2.5 py-1 rounded-lg font-semibold transition-all text-xs cursor-pointer ${
                    selectedServer === s.id
                      ? s.id === 6
                        ? "bg-gradient-to-r from-emerald-600 to-teal-600 text-white shadow-sm"
                        : "bg-gradient-to-r from-rose-600 to-purple-600 text-white shadow-sm"
                      : s.id === 6
                      ? "bg-emerald-900/40 text-emerald-300 hover:bg-emerald-800/60 border border-emerald-600/30"
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
        <div className="w-full h-full relative">
          {selectedServer === 6 && !needsPopups ? (
            /* ─── Built-in Arabic Player with native subtitle track ─── */
            <div className="w-full h-full flex items-center justify-center bg-black">
              {loadingStream ? (
                <div className="flex flex-col items-center gap-3 text-center p-6">
                  <div className="w-10 h-10 border-4 border-emerald-500 border-t-transparent rounded-full animate-spin" />
                  <p className="text-emerald-300 text-sm font-semibold">جارٍ تحميل البث المباشر...</p>
                  <p className="text-slate-400 text-xs">يتم البحث عن أفضل جودة متاحة</p>
                </div>
              ) : streamError ? (
                <div className="flex flex-col items-center gap-3 text-center p-6">
                  <p className="text-red-400 text-sm">{streamError}</p>
                  <button
                    type="button"
                    onClick={() => setSelectedServer(1)}
                    className="px-4 py-2 bg-rose-600 hover:bg-rose-500 text-white text-xs font-bold rounded-xl"
                  >
                    ← العودة للسيرفر 1
                  </button>
                </div>
              ) : streamUrl ? (
                <NativeArabicPlayer
                  streamUrl={streamUrl}
                  streamType={streamType}
                  subtitleUrl={activeArabicSubUrl}
                  poster={thumbnailUrl}
                />
              ) : null}
            </div>
          ) : parsedSources.isDirectVideo ? (
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


      {/* Arabic Subtitles Toolbar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2.5 bg-slate-900/95 border border-purple-500/30 p-3 sm:px-4 sm:py-3 rounded-xl sm:rounded-2xl backdrop-blur-md shadow-lg">
        <div className="flex items-center space-x-2 text-slate-200 flex-1 min-w-0">
          <span className={`font-bold px-2.5 py-0.5 rounded-full border text-[10px] uppercase tracking-wider shrink-0 flex items-center gap-1 ${arabicSubTracks.length > 0 ? "bg-emerald-500/20 text-emerald-300 border-emerald-500/30" : loadingSubs ? "bg-purple-500/20 text-purple-300 border-purple-500/30" : "bg-slate-700/50 text-slate-400 border-slate-600/30"}`}>
            <span className={`w-1.5 h-1.5 rounded-full ${arabicSubTracks.length > 0 ? "bg-emerald-400 animate-pulse" : loadingSubs ? "bg-purple-400 animate-pulse" : "bg-slate-500"}`}></span>
            <span>ترجمة عربية</span>
          </span>
          <span className="text-slate-300 text-xs truncate">
            {loadingSubs ? (
              <span className="text-purple-300">جارٍ البحث عن الترجمة العربية...</span>
            ) : arabicSubTracks.length > 0 ? (
              <span>
                تم العثور على <strong className="text-emerald-400">{arabicSubTracks.length} مسار عربي</strong>.{" "}
                اضغط <strong className="text-rose-400">تحميل الترجمة</strong> ثم ارفعها من زر{" "}
                <span className="bg-slate-800 px-1.5 py-0.5 rounded text-purple-200 border border-purple-500/30 font-bold">Upload</span>{" "}
                داخل المشغّل.
              </span>
            ) : (
              <span className="text-slate-400">لا توجد ترجمة عربية — جرّب مشغّلاً آخر.</span>
            )}
          </span>
        </div>

        {/* Action Buttons */}
        {arabicSubTracks.length > 0 && activeArabicSubUrl && (
          <div className="flex items-center gap-2 shrink-0 flex-wrap">
            {/* Switch to Arabic Player (server 6) for fully integrated subtitle experience */}
            {selectedServer !== 6 && (
              <button
                type="button"
                onClick={() => setSelectedServer(6)}
                className="inline-flex items-center gap-1.5 bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold px-3 py-1.5 rounded-xl shadow transition-all hover:scale-105 cursor-pointer"
              >
                <span>🇸🇦</span>
                <span>تشغيل بترجمة عربية مدمجة</span>
              </button>
            )}
            {/* Download VTT for Upload-based players */}
            <a
              href={`${activeArabicSubUrl}&download=true&filename=Arabic_Subtitles.vtt`}
              download="Arabic_Subtitles.vtt"
              className="inline-flex items-center gap-1.5 bg-gradient-to-r from-rose-600 to-purple-600 hover:from-rose-500 hover:to-purple-500 text-white text-xs font-bold px-3 py-1.5 rounded-xl shadow transition-all hover:scale-105 cursor-pointer"
            >
              <span>📥</span>
              <span>تحميل الترجمة .VTT</span>
            </a>
          </div>
        )}
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
                { id: 1, label: "Multi-Sub (Arabic)" },
                { id: 2, label: "VidLink (1080p)" },
                { id: 3, label: "VidSrc Pro" },
                { id: 4, label: "VidSrc ME" },
                { id: 5, label: "Backup" },
                { id: 6, label: "🇸🇦 Arabic Player" },
              ].map((s) => (
                <button
                  key={s.id}
                  type="button"
                  onClick={() => setSelectedServer(s.id)}
                  className={`py-1.5 px-2 rounded-xl text-xs font-bold transition-all text-center min-h-[36px] ${
                    selectedServer === s.id
                      ? s.id === 6
                        ? "bg-gradient-to-r from-emerald-600 to-teal-600 text-white shadow"
                        : "bg-gradient-to-r from-rose-600 to-purple-600 text-white shadow"
                      : s.id === 6
                      ? "bg-emerald-900/30 text-emerald-300 border border-emerald-600/30"
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
