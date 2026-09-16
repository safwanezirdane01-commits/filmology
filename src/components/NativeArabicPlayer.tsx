"use client";

import { useEffect, useRef, useState } from "react";

interface Props {
  streamUrl: string;
  streamType: string; // "application/x-mpegURL" or "video/mp4"
  subtitleUrl: string | null;
  poster?: string | null;
}

export default function NativeArabicPlayer({ streamUrl, streamType, subtitleUrl, poster }: Props) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [hlsLoaded, setHlsLoaded] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const video = videoRef.current;
    if (!video || !streamUrl) return;

    const isHls =
      streamType === "application/x-mpegURL" ||
      streamUrl.includes(".m3u8");

    if (isHls) {
      // Dynamically import hls.js only on client
      import("hls.js").then(({ default: Hls }) => {
        if (!Hls.isSupported()) {
          // Safari natively supports HLS
          video.src = streamUrl;
          setHlsLoaded(true);
          return;
        }
        const hls = new Hls({
          maxBufferLength: 30,
          maxMaxBufferLength: 60,
          enableWorker: true,
        });
        hls.loadSource(streamUrl);
        hls.attachMedia(video);
        hls.on(Hls.Events.MANIFEST_PARSED, () => {
          setHlsLoaded(true);
          video.play().catch(() => {});
        });
        hls.on(Hls.Events.ERROR, (_evt, data) => {
          if (data.fatal) setError("Stream error – try another server.");
        });
        return () => hls.destroy();
      });
    } else {
      video.src = streamUrl;
      setHlsLoaded(true);
    }
  }, [streamUrl, streamType]);

  // Enable Arabic subtitle track once video + track are ready
  useEffect(() => {
    const video = videoRef.current;
    if (!video || !subtitleUrl || !hlsLoaded) return;

    const enableArabic = () => {
      for (let i = 0; i < video.textTracks.length; i++) {
        const track = video.textTracks[i];
        if (track.language === "ar" || track.label.includes("ربية") || track.label.toLowerCase().includes("arabic")) {
          track.mode = "showing";
        } else {
          track.mode = "disabled";
        }
      }
    };

    video.addEventListener("loadedmetadata", enableArabic);
    // Also try enabling after a short delay as track loading can be async
    const timer = setTimeout(enableArabic, 1500);
    return () => {
      video.removeEventListener("loadedmetadata", enableArabic);
      clearTimeout(timer);
    };
  }, [subtitleUrl, hlsLoaded]);

  if (error) {
    return (
      <div className="w-full h-full flex items-center justify-center bg-black text-red-400 text-sm p-4 text-center">
        {error}
      </div>
    );
  }

  return (
    <div className="w-full h-full relative bg-black">
      <video
        ref={videoRef}
        className="w-full h-full"
        controls
        autoPlay
        playsInline
        poster={poster || undefined}
        crossOrigin="anonymous"
        style={{
          // Custom subtitle styling for Arabic (RTL, larger font)
          "--webkit-media-text-track-display": "block",
        } as React.CSSProperties}
      >
        {subtitleUrl && (
          <track
            kind="subtitles"
            src={subtitleUrl}
            srcLang="ar"
            label="العربية"
            default
          />
        )}
      </video>

      {/* Arabic subtitle CSS injection via style tag */}
      <style>{`
        video::cue {
          font-size: 1.3em;
          background: rgba(0,0,0,0.75);
          color: #ffffff;
          font-family: 'Segoe UI', Tahoma, Arial, sans-serif;
          line-height: 1.5;
          direction: rtl;
          unicode-bidi: bidi-override;
        }
      `}</style>
    </div>
  );
}
