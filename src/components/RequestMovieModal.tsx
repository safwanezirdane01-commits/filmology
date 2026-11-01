"use client";

import { useState } from "react";
import { MessageSquarePlus, Send, X, CheckCircle, Film, Sparkles } from "lucide-react";

export default function RequestMovieModal({ telegramUrl }: { telegramUrl?: string }) {
  const [isOpen, setIsOpen] = useState(false);
  const [title, setTitle] = useState("");
  const [year, setYear] = useState("");
  const [type, setType] = useState<"movie" | "series">("movie");
  const [submitted, setSubmitted] = useState(false);

  const activeTelegram = telegramUrl && telegramUrl.startsWith("http") ? telegramUrl : "https://t.me/FilmologyX";

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) return;

    // Save request or forward to Telegram
    setSubmitted(true);
    setTimeout(() => {
      // Prompt user to join Telegram for faster uploads
      window.open(
        `${activeTelegram}?text=${encodeURIComponent(`Movie Request: ${title} (${year || "Any year"}) [${type}]`)}`,
        "_blank"
      );
    }, 900);
  };

  const handleClose = () => {
    setIsOpen(false);
    setSubmitted(false);
    setTitle("");
    setYear("");
  };

  return (
    <>
      {/* Floating CTA Trigger Button (Desktop bottom-right / Mobile accessible) */}
      <button
        type="button"
        onClick={() => setIsOpen(true)}
        className="fixed bottom-16 md:bottom-6 right-4 sm:right-6 z-30 flex items-center space-x-2 bg-gradient-to-r from-rose-600 to-purple-600 hover:from-rose-500 hover:to-purple-500 text-white px-3.5 sm:px-4 py-2 sm:py-2.5 rounded-full shadow-2xl shadow-rose-600/30 border border-purple-400/30 transition-all hover:scale-105 active:scale-95 cursor-pointer text-xs sm:text-sm font-bold"
        aria-label="Request a movie"
      >
        <Sparkles className="w-4 h-4 text-rose-200 animate-pulse" />
        <span>Request Movie</span>
      </button>

      {/* Modal Dialog */}
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md animate-in fade-in duration-200">
          <div className="relative w-full max-w-md bg-slate-900 border border-purple-500/30 rounded-3xl p-6 sm:p-7 shadow-2xl space-y-5 text-slate-100">
            {/* Close Button */}
            <button
              type="button"
              onClick={handleClose}
              className="absolute top-4 right-4 p-2 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800 transition-colors cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>

            {/* Header */}
            <div className="space-y-1.5 pr-8">
              <div className="flex items-center space-x-2 text-rose-400">
                <Film className="w-5 h-5" />
                <span className="text-xs font-bold uppercase tracking-wider">FilmologyX Studio</span>
              </div>
              <h3 className="text-xl sm:text-2xl font-black text-white">Request a Movie or Series</h3>
              <p className="text-xs text-slate-400 leading-relaxed">
                Can't find what you are looking for? Send us the title and our automated encoders will add it within 24 hours.
              </p>
            </div>

            {submitted ? (
              <div className="py-6 text-center space-y-3">
                <div className="w-12 h-12 bg-emerald-500/20 text-emerald-400 rounded-full flex items-center justify-center mx-auto">
                  <CheckCircle className="w-6 h-6" />
                </div>
                <h4 className="font-bold text-white text-base">Request Received!</h4>
                <p className="text-xs text-slate-400 max-w-xs mx-auto">
                  Opening our Telegram channel now so you receive a direct notification the second it's uploaded.
                </p>
                <button
                  type="button"
                  onClick={handleClose}
                  className="mt-2 px-5 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-xs font-semibold text-white"
                >
                  Done
                </button>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-4">
                {/* Type Selector */}
                <div className="grid grid-cols-2 gap-2 bg-slate-950 p-1 rounded-xl border border-purple-500/20 text-xs font-semibold">
                  <button
                    type="button"
                    onClick={() => setType("movie")}
                    className={`py-2 rounded-lg transition-all ${
                      type === "movie" ? "bg-rose-600 text-white" : "text-slate-400 hover:text-white"
                    }`}
                  >
                    Movie
                  </button>
                  <button
                    type="button"
                    onClick={() => setType("series")}
                    className={`py-2 rounded-lg transition-all ${
                      type === "series" ? "bg-purple-600 text-white" : "text-slate-400 hover:text-white"
                    }`}
                  >
                    TV Series / Anime
                  </button>
                </div>

                {/* Title Input */}
                <div className="space-y-1">
                  <label className="text-[11px] font-bold text-slate-300 uppercase tracking-wider">
                    Title / Name *
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Gladiator II, Breaking Bad Season 1..."
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    className="w-full px-3.5 py-2.5 bg-slate-950 border border-purple-500/20 rounded-xl text-sm text-white placeholder-slate-500 focus:outline-none focus:border-rose-500 transition-colors"
                  />
                </div>

                {/* Release Year (Optional) */}
                <div className="space-y-1">
                  <label className="text-[11px] font-bold text-slate-300 uppercase tracking-wider">
                    Release Year (Optional)
                  </label>
                  <input
                    type="number"
                    placeholder="e.g. 2024"
                    value={year}
                    onChange={(e) => setYear(e.target.value)}
                    className="w-full px-3.5 py-2.5 bg-slate-950 border border-purple-500/20 rounded-xl text-sm text-white placeholder-slate-500 focus:outline-none focus:border-rose-500 transition-colors"
                  />
                </div>

                {/* Submit button */}
                <button
                  type="submit"
                  className="w-full py-3 bg-gradient-to-r from-rose-600 to-purple-600 hover:from-rose-500 hover:to-purple-500 text-white font-bold text-sm rounded-xl transition-all shadow-lg shadow-rose-500/20 flex items-center justify-center space-x-2 cursor-pointer"
                >
                  <Send className="w-4 h-4" />
                  <span>Submit Request</span>
                </button>
              </form>
            )}
          </div>
        </div>
      )}
    </>
  );
}
