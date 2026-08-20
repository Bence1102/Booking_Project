import { useState } from "react";
import type { Resource, Review } from "../../@types";
import { useLanguage } from "../../context/LanguageContext";
import api from "../../api/axios";

interface ResourceCardProps {
  resource: Resource;
  isFavorite: boolean;
  onToggleFavorite: (resourceId: string, isFavorite: boolean) => void;
}

function Stars({ value }: { value: number }) {
  const rounded = Math.round(value);
  return (
    <span className="text-amber-400 text-sm tracking-tight">
      {"★".repeat(rounded)}
      <span className="text-slate-700">{"★".repeat(5 - rounded)}</span>
    </span>
  );
}

export default function ResourceCard({ resource, isFavorite, onToggleFavorite }: ResourceCardProps) {
  const { t } = useLanguage();
  const [expanded, setExpanded] = useState(false);
  const [reviews, setReviews] = useState<Review[]>([]);
  const [reviewCount, setReviewCount] = useState(resource.reviewCount ?? 0);
  const [avgRating, setAvgRating] = useState(resource.avgRating ?? null);
  const [loadingReviews, setLoadingReviews] = useState(false);
  const [rating, setRating] = useState(5);
  const [comment, setComment] = useState("");
  const [error, setError] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const loadReviews = async () => {
    setLoadingReviews(true);
    try {
      const res = await api.get<Review[]>(`/resources/${resource.id}/reviews`);
      setReviews(res.data);
      setReviewCount(res.data.length);
      setAvgRating(
        res.data.length ? res.data.reduce((sum, r) => sum + r.rating, 0) / res.data.length : null
      );
    } catch (err) {
      console.error(err);
    } finally {
      setLoadingReviews(false);
    }
  };

  const toggleExpanded = () => {
    const next = !expanded;
    setExpanded(next);
    if (next) {
      loadReviews();
    }
  };

  const handleSubmitReview = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setSubmitting(true);

    try {
      await api.post(`/resources/${resource.id}/reviews`, { rating, comment: comment || undefined });
      setComment("");
      loadReviews();
    } catch (err: any) {
      setError(err.response?.data?.error || "Sikertelen mentés!");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 space-y-4">
      <div className="flex items-start justify-between">
        <div>
          <h3 className="font-bold text-white">{resource.name}</h3>
          {resource.description && <p className="text-slate-400 text-xs mt-1">{resource.description}</p>}
        </div>
        <button
          onClick={() => onToggleFavorite(resource.id, isFavorite)}
          title={isFavorite ? t.removeFavorite : t.addFavorite}
          className={`text-xl leading-none transition-colors ${isFavorite ? "text-rose-500" : "text-slate-600 hover:text-rose-400"}`}
        >
          {isFavorite ? "❤️" : "🤍"}
        </button>
      </div>

      <div className="flex items-center space-x-2 text-xs">
        {avgRating ? (
          <>
            <Stars value={avgRating} />
            <span className="text-slate-400">
              {avgRating.toFixed(1)} ({reviewCount})
            </span>
          </>
        ) : (
          <span className="text-slate-500">{t.noRatingsYet}</span>
        )}
      </div>

      <button onClick={toggleExpanded} className="text-xs font-semibold text-indigo-400 hover:text-indigo-300">
        {expanded ? "▲" : "▼"} {t.reviewsTitle} {reviewCount > 0 ? `(${reviewCount})` : ""}
      </button>

      {expanded && (
        <div className="space-y-4 border-t border-slate-800 pt-4">
          {loadingReviews ? (
            <p className="text-slate-500 text-xs">...</p>
          ) : reviews.length === 0 ? (
            <p className="text-slate-500 text-xs">{t.noReviewsYet}</p>
          ) : (
            <div className="space-y-3 max-h-48 overflow-y-auto pr-1">
              {reviews.map((r) => (
                <div key={r.id} className="bg-slate-950/60 border border-slate-800/60 rounded-xl p-3">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-semibold text-slate-200">{r.user.name}</span>
                    <Stars value={r.rating} />
                  </div>
                  {r.comment && <p className="text-slate-400 text-xs mt-1">{r.comment}</p>}
                </div>
              ))}
            </div>
          )}

          {error && <p className="text-rose-400 text-xs">{error}</p>}

          <form onSubmit={handleSubmitReview} className="space-y-2">
            <label className="block text-[10px] font-semibold text-slate-400 uppercase tracking-wider">
              {t.writeReview}
            </label>
            <div className="flex items-center space-x-1">
              {[1, 2, 3, 4, 5].map((n) => (
                <button
                  type="button"
                  key={n}
                  onClick={() => setRating(n)}
                  className={`text-lg leading-none ${n <= rating ? "text-amber-400" : "text-slate-700"}`}
                >
                  ★
                </button>
              ))}
            </div>
            <textarea
              value={comment}
              onChange={(e) => setComment(e.target.value)}
              placeholder={t.commentLabel}
              rows={2}
              className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-indigo-500"
            />
            <button
              type="submit"
              disabled={submitting}
              className="text-xs font-semibold bg-indigo-600 hover:bg-indigo-500 text-white px-4 py-2 rounded-xl transition-all disabled:opacity-50"
            >
              {t.submitReview}
            </button>
          </form>
        </div>
      )}
    </div>
  );
}
