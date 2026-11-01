"use client";

import { useState, useEffect, useCallback } from "react";
import { useSession } from "next-auth/react";
import { Star, MessageCircle, Send, User } from "lucide-react";
import { useLanguage } from "@/context/LanguageContext";

type Review = {
  id: string;
  rating: number;
  comment: string | null;
  createdAt: string;
  user: {
    email: string;
  };
};

export default function ReviewSection({ movieId, isLoggedIn: initialIsLoggedIn }: { movieId: string, isLoggedIn?: boolean }) {
  const { data: session } = useSession();
  const { t, isArabic } = useLanguage();
  const isLoggedIn = !!session || !!initialIsLoggedIn;
  const [reviews, setReviews] = useState<Review[]>([]);
  const [rating, setRating] = useState(5);
  const [comment, setComment] = useState("");
  const [guestName, setGuestName] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const fetchReviews = useCallback(async () => {
    try {
      const res = await fetch(`/api/reviews?movieId=${movieId}`);
      if (res.ok) {
        const data = await res.json();
        if (Array.isArray(data)) {
          setReviews(data);
        }
      }
    } catch {}
  }, [movieId]);

  useEffect(() => {
    fetchReviews();
  }, [fetchReviews]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!rating) return;

    setIsSubmitting(true);
    try {
      const res = await fetch("/api/reviews", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ 
          movieId, 
          rating, 
          comment,
          guestName: isLoggedIn ? undefined : (guestName.trim() || "Guest")
        }),
      });

      if (res.ok) {
        setRating(5);
        setComment("");
        fetchReviews();
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  const avgRating = reviews.length > 0 
    ? (reviews.reduce((acc, r) => acc + r.rating, 0) / reviews.length).toFixed(1)
    : 0;

  return (
    <div className="bg-transparent mt-2">
      <div className="flex items-center justify-between mb-8 flex-wrap gap-4">
        <div className="flex items-center">
          <span className="bg-gradient-to-b from-rose-400 to-purple-600 w-1.5 h-8 mr-4 rtl:mr-0 rtl:ml-4 rounded-full shadow-[0_0_10px_rgba(244,63,94,0.5)]"></span>
          <div>
            <h2 className="text-2xl sm:text-3xl font-black text-slate-100">
              Community Reviews & Chat
            </h2>
            <p className="text-xs text-slate-400 mt-0.5">Share your rating and thoughts with fellow viewers</p>
          </div>
        </div>

        {reviews.length > 0 && (
          <div className="flex items-center gap-1.5 bg-slate-900/80 px-4 py-2 rounded-2xl border border-purple-500/20 shadow-inner">
            <Star className="text-amber-400 fill-current w-4 h-4 drop-shadow-[0_0_8px_rgba(244,63,94,0.5)]" />
            <span className="font-extrabold text-white text-sm">{avgRating} / 5</span>
            <span className="text-purple-300/60 text-xs font-semibold">({reviews.length} reviews)</span>
          </div>
        )}
      </div>

      {/* Guest & Logged-in Review Form */}
      <form onSubmit={handleSubmit} className="mb-10 space-y-4 bg-slate-900/70 p-5 sm:p-7 rounded-2xl sm:rounded-3xl border border-purple-900/40 shadow-xl">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b border-purple-900/30 pb-4">
          <div>
            <label className="block text-xs font-bold text-purple-300/90 uppercase tracking-wider mb-1.5">
              Your Rating
            </label>
            <div className="flex gap-1.5">
              {[1, 2, 3, 4, 5].map((star) => (
                <button
                  key={star}
                  type="button"
                  onClick={() => setRating(star)}
                  className="focus:outline-none transition-transform hover:scale-125 cursor-pointer p-0.5"
                >
                  <Star
                    className={`w-6 sm:w-7 h-6 sm:h-7 transition-colors ${
                      star <= rating ? "text-amber-400 fill-current drop-shadow-[0_0_6px_rgba(251,191,36,0.6)]" : "text-slate-700 hover:text-amber-400/50"
                    }`}
                  />
                </button>
              ))}
            </div>
          </div>

          {!isLoggedIn && (
            <div className="w-full sm:w-auto">
              <label className="block text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-1">
                Your Nickname (Optional)
              </label>
              <input
                type="text"
                maxLength={25}
                placeholder="e.g. CinemaFan"
                value={guestName}
                onChange={(e) => setGuestName(e.target.value)}
                className="w-full sm:w-56 px-3.5 py-2 bg-slate-950/80 border border-purple-500/30 rounded-xl text-xs text-white placeholder-slate-500 focus:outline-none focus:border-rose-500 transition-colors"
              />
            </div>
          )}
        </div>

        <div>
          <label className="block text-xs font-bold text-purple-300/90 uppercase tracking-wider mb-1.5">
            Your Comment or Reaction
          </label>
          <textarea
            value={comment}
            required
            onChange={(e) => setComment(e.target.value)}
            className="w-full bg-slate-950/80 border border-purple-500/30 rounded-2xl p-4 text-sm text-slate-100 placeholder-slate-500 focus:outline-none focus:border-rose-500 transition-all resize-none"
            rows={3}
            placeholder="Tell us what you liked about this title... (no login required!)"
            dir="auto"
          />
        </div>

        <div className="flex justify-end pt-1">
          <button
            type="submit"
            disabled={isSubmitting || !comment.trim()}
            className="flex items-center space-x-2 bg-gradient-to-r from-rose-600 to-purple-600 hover:from-rose-500 hover:to-purple-500 text-white px-7 py-2.5 rounded-xl font-bold text-xs sm:text-sm transition-all shadow-lg shadow-rose-500/20 disabled:opacity-40 cursor-pointer"
          >
            <Send className="w-4 h-4" />
            <span>{isSubmitting ? "Posting..." : "Post Review"}</span>
          </button>
        </div>
      </form>

      {/* Reviews List */}
      <div className="space-y-3">
        {reviews.length === 0 ? (
          <div className="text-center py-10 bg-slate-900/30 rounded-2xl border border-purple-900/20">
            <MessageCircle className="w-8 h-8 text-slate-600 mx-auto mb-2" />
            <p className="text-slate-400 text-sm font-medium">No reviews yet — be the first to leave your thoughts!</p>
          </div>
        ) : (
          reviews.map((review) => {
            const displayName = review.user.email.split("@")[0] || "Viewer";
            return (
              <div key={review.id} className="bg-slate-900/60 p-4 sm:p-5 rounded-2xl border border-purple-900/30 transition-all hover:bg-slate-900/80 hover:border-purple-500/30">
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center space-x-2.5">
                    <div className="w-7 h-7 rounded-full bg-gradient-to-tr from-rose-500 to-purple-600 flex items-center justify-center text-white text-[11px] font-black uppercase">
                      {displayName[0]}
                    </div>
                    <div>
                      <span className="text-sm font-bold text-white capitalize">{displayName}</span>
                      <span className="text-[10px] text-slate-500 ml-2">
                        {new Date(review.createdAt).toLocaleDateString()}
                      </span>
                    </div>
                  </div>

                  <div className="flex text-amber-400 gap-0.5">
                    {[...Array(5)].map((_, i) => (
                      <Star
                        key={i}
                        className={`w-3.5 h-3.5 ${i < review.rating ? "fill-current" : "text-slate-800"}`}
                      />
                    ))}
                  </div>
                </div>
                {review.comment && <p className="text-slate-300 text-xs sm:text-sm leading-relaxed pl-9" dir="auto">{review.comment}</p>}
              </div>
            );
          })
        )}
      </div>
    </div>
  );
}
