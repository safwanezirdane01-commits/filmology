"use client";

import { useState, useEffect, useCallback } from "react";
import { useSession } from "next-auth/react";
import { Star } from "lucide-react";

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
  const isLoggedIn = !!session || !!initialIsLoggedIn;
  const [reviews, setReviews] = useState<Review[]>([]);
  const [rating, setRating] = useState(5);
  const [comment, setComment] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const fetchReviews = useCallback(async () => {
    const res = await fetch(`/api/reviews?movieId=${movieId}`);
    if (res.ok) {
      const data = await res.json();
      setReviews(data);
    }
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
        body: JSON.stringify({ movieId, rating, comment }),
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
      <div className="flex items-center gap-4 mb-8">
        <h2 className="text-3xl font-bold text-slate-100 flex items-center">
          <span className="bg-gradient-to-b from-rose-400 to-purple-600 w-1.5 h-8 mr-4 rounded-full shadow-[0_0_10px_rgba(244,63,94,0.5)]"></span>
          Reviews
        </h2>
        {reviews.length > 0 && (
          <div className="flex items-center gap-1.5 bg-slate-900/50 px-4 py-1.5 rounded-full border border-purple-500/20 shadow-inner">
            <Star className="text-rose-400 fill-current w-5 h-5 drop-shadow-[0_0_8px_rgba(244,63,94,0.5)]" />
            <span className="font-bold text-rose-200">{avgRating}</span>
            <span className="text-purple-300/60 text-sm">({reviews.length})</span>
          </div>
        )}
      </div>

      {isLoggedIn ? (
        <form onSubmit={handleSubmit} className="mb-10 space-y-5 bg-slate-900/60 p-6 sm:p-8 rounded-2xl border border-purple-900/30 shadow-lg">
          <div>
            <label className="block text-sm font-medium text-purple-300/80 mb-3 uppercase tracking-wide">Your Rating</label>
            <div className="flex gap-2">
              {[1, 2, 3, 4, 5].map((star) => (
                <button
                  key={star}
                  type="button"
                  onClick={() => setRating(star)}
                  className="focus:outline-none transition-transform hover:scale-110"
                >
                  <Star
                    className={`w-8 h-8 transition-colors ${
                      star <= rating ? "text-rose-400 fill-current drop-shadow-[0_0_8px_rgba(244,63,94,0.5)]" : "text-slate-700 hover:text-rose-400/50"
                    }`}
                  />
                </button>
              ))}
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium text-purple-300/80 mb-3 uppercase tracking-wide">Comment (optional)</label>
            <textarea
              value={comment}
              onChange={(e) => setComment(e.target.value)}
              className="w-full bg-slate-950/50 border border-purple-900/50 rounded-xl p-4 text-slate-100 placeholder-purple-300/30 focus:outline-none focus:border-rose-500/50 focus:ring-1 focus:ring-rose-500/50 transition-all shadow-inner"
              rows={4}
              placeholder="What did you think of the movie?"
            />
          </div>
          <button
            type="submit"
            disabled={isSubmitting}
            className="bg-gradient-to-r from-rose-600 to-purple-600 hover:from-rose-500 hover:to-purple-500 text-white px-8 py-3 rounded-full font-bold transition-all shadow-[0_0_15px_rgba(244,63,94,0.3)] hover:shadow-[0_0_25px_rgba(168,85,247,0.5)] disabled:opacity-50 border border-rose-500/20"
          >
            {isSubmitting ? "Submitting..." : "Submit Review"}
          </button>
        </form>
      ) : (
        <div className="mb-10 bg-slate-900/40 p-6 rounded-2xl text-center text-purple-300/60 border border-purple-900/30 font-medium">
          Please log in to leave a review.
        </div>
      )}

      <div className="space-y-6">
        {reviews.length === 0 ? (
          <div className="text-center py-10 bg-slate-900/20 rounded-2xl border border-slate-800/50">
            <p className="text-purple-300/50 text-lg font-light">No reviews yet. Be the first!</p>
          </div>
        ) : (
          reviews.map((review) => (
            <div key={review.id} className="bg-slate-900/40 p-6 rounded-2xl border border-purple-900/20 transition-all hover:bg-slate-900/60 hover:border-purple-500/20">
              <div className="flex items-center justify-between mb-3">
                <span className="text-rose-200 font-semibold tracking-wide">{review.user.email.split('@')[0]}</span>
                <div className="flex text-rose-400 gap-1">
                  {[...Array(5)].map((_, i) => (
                    <Star
                      key={i}
                      className={`w-4 h-4 ${i < review.rating ? "fill-current" : "text-slate-700"}`}
                    />
                  ))}
                </div>
              </div>
              {review.comment && <p className="text-slate-300 text-sm leading-relaxed">{review.comment}</p>}
            </div>
          ))
        )}
      </div>
    </div>
  );
}
