"use client";

import { useState } from "react";
import { PlayCircle, Loader2 } from "lucide-react";
import TrailerModal from "./TrailerModal";
import { useLanguage } from "@/context/LanguageContext";

interface WatchTrailerButtonProps {
  id: string;
  title: string;
  isTv?: boolean;
  className?: string;
  variant?: "primary" | "secondary" | "pill";
}

export default function WatchTrailerButton({
  id,
  title,
  isTv = false,
  className = "",
  variant = "secondary",
}: WatchTrailerButtonProps) {
  const { t } = useLanguage();
  const [isOpen, setIsOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [trailerKey, setTrailerKey] = useState<string | null>(null);

  const handleClick = async () => {
    if (trailerKey) {
      setIsOpen(true);
      return;
    }

    setLoading(true);
    try {
      const res = await fetch(`/api/trailer?id=${encodeURIComponent(id)}&type=${isTv ? "tv" : "movie"}`);
      const data = await res.json();
      if (data.success && data.trailerKey) {
        setTrailerKey(data.trailerKey);
      }
    } catch {
      // Fallback
    } finally {
      setLoading(false);
      setIsOpen(true);
    }
  };

  const baseStyle = variant === "primary"
    ? "bg-gradient-to-r from-rose-600 to-purple-600 hover:from-rose-500 hover:to-purple-500 text-white shadow-lg"
    : variant === "pill"
    ? "bg-slate-900/90 hover:bg-slate-800 text-purple-200 border border-purple-500/30"
    : "bg-slate-800/90 hover:bg-slate-700/90 text-slate-200 border border-purple-500/20";

  return (
    <>
      <button
        type="button"
        onClick={handleClick}
        disabled={loading}
        className={`inline-flex items-center justify-center space-x-2 rtl:space-x-reverse px-4 py-2.5 rounded-xl font-semibold text-xs sm:text-sm transition-all active:scale-95 disabled:opacity-50 cursor-pointer ${baseStyle} ${className}`}
        title={`${t("details.trailer")} - ${title}`}
      >
        {loading ? (
          <Loader2 className="w-4 h-4 animate-spin text-rose-400" />
        ) : (
          <PlayCircle className="w-4 h-4 text-rose-400" />
        )}
        <span>{t("details.trailer")}</span>
      </button>

      <TrailerModal
        isOpen={isOpen}
        onClose={() => setIsOpen(false)}
        trailerKey={trailerKey}
        title={title}
      />
    </>
  );
}
