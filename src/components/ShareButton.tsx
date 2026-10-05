"use client";

import { useState } from "react";
import { Share2, Check, Copy } from "lucide-react";

export default function ShareButton({
  title,
  url,
}: {
  title: string;
  url?: string;
}) {
  const [copied, setCopied] = useState(false);

  const handleShare = async () => {
    const shareUrl = url || (typeof window !== "undefined" ? window.location.href : "");
    const shareText = `Watch "${title}" free in 1080p Full HD on FilmologyX! 🍿🎬`;

    if (typeof navigator !== "undefined" && navigator.share) {
      try {
        await navigator.share({
          title: `${title} | FilmologyX`,
          text: shareText,
          url: shareUrl,
        });
        return;
      } catch (err) {
        // Fallback to clipboard if user dismissed or share failed
      }
    }

    // Clipboard copy fallback
    try {
      await navigator.clipboard.writeText(shareUrl);
      setCopied(true);
      setTimeout(() => setCopied(false), 2500);
    } catch {
      // Fallback manual prompt
      window.prompt("Copy link to share:", shareUrl);
    }
  };

  return (
    <button
      type="button"
      onClick={handleShare}
      className="inline-flex items-center space-x-2 px-4 py-2.5 sm:px-5 sm:py-3 rounded-full text-xs sm:text-sm font-bold bg-slate-800/90 hover:bg-slate-700/90 text-slate-200 hover:text-white border border-purple-500/20 hover:border-purple-400/50 transition-all duration-200 active:scale-95 shadow-md shrink-0"
      title="Share with friends"
    >
      {copied ? (
        <>
          <Check className="w-4 h-4 text-emerald-400" />
          <span className="text-emerald-300">Link Copied!</span>
        </>
      ) : (
        <>
          <Share2 className="w-4 h-4 text-rose-400" />
          <span>Share</span>
        </>
      )}
    </button>
  );
}
