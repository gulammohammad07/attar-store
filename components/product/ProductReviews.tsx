"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { m as motion, AnimatePresence } from "framer-motion";
import {
  CheckCircle2,
  Loader2,
  MessageSquarePlus,
  Star,
  UserCheck,
  X,
} from "lucide-react";
import type { Product } from "@/lib/data/products";
import {
  getProductReviewAggregateAction,
  submitReviewAction,
  type ReviewAggregate,
} from "@/lib/actions/review.actions";
import { useAuth } from "@/lib/store/auth-context";
import { cn } from "@/lib/utils";
import { toast } from "sonner";

const REVIEWERS = [
  { name: "Aarav S.", location: "Mumbai" },
  { name: "Meera P.", location: "Delhi" },
  { name: "Kabir M.", location: "Bengaluru" },
  { name: "Ishita R.", location: "Pune" },
];

const COMMENTS = [
  "Absolutely stunning — lasts the whole day and evolves beautifully on the skin.",
  "The quality is remarkable. It smells far more expensive than it costs.",
  "Received so many compliments. My new signature scent, no question.",
  "Rich, layered and elegant. The delivery and packaging were top-notch too.",
];

const RATING_DESCRIPTIONS: Record<number, string> = {
  1: "1 Star — Disappointed",
  2: "2 Stars — Fair / Not for me",
  3: "3 Stars — Good / Average longevity",
  4: "4 Stars — Very Good / Highly recommend",
  5: "5 Stars — Outstanding / Signature scent",
};

const ZERO_DISTRIBUTION = [5, 4, 3, 2, 1].map((stars) => ({
  stars,
  percent: 0,
}));

function buildSeedReviews(product: Product) {
  const seed = product.id.split("").reduce((a, c) => a + c.charCodeAt(0), 0);
  return REVIEWERS.map((reviewer, i) => {
    const rating = product.rating >= 4.8 ? 5 : 4;
    return {
      key: `sample-${i}`,
      name: reviewer.name,
      location: reviewer.location,
      rating,
      comment: COMMENTS[(seed + i) % COMMENTS.length],
      date: `${10 + ((seed + i) % 9)} ${["Jan", "Feb", "Mar", "Apr", "May", "Jun"][i % 4]} 2026`,
      verified: false,
      sample: true,
    };
  });
}

function formatDate(iso: string) {
  try {
    return new Date(iso).toLocaleDateString("en-IN", {
      day: "numeric",
      month: "short",
      year: "numeric",
    });
  } catch {
    return "";
  }
}

type DisplayReview = {
  key: string;
  name: string;
  location: string;
  rating: number;
  comment: string;
  date: string;
  verified: boolean;
  sample: boolean;
};

export default function ProductReviews({
  product,
  aggregate,
  onAggregateChange,
}: {
  product: Product;
  aggregate: ReviewAggregate | null;
  onAggregateChange: (aggregate: ReviewAggregate) => void;
}) {
  const router = useRouter();
  const { user, status } = useAuth();

  const [showForm, setShowForm] = useState(false);
  const [userRating, setUserRating] = useState(5);
  const [hoverRating, setHoverRating] = useState<number | null>(null);
  const [guestName, setGuestName] = useState("");
  const [guestEmail, setGuestEmail] = useState("");
  const [comment, setComment] = useState("");
  const [submitting, setSubmitting] = useState(false);

  // Real-time synchronization:
  // 1. Fetches on mount
  // 2. Polls periodically when the page is actively visible
  useEffect(() => {
    let active = true;

    const refreshAggregate = () => {
      getProductReviewAggregateAction(product.id).then((next) => {
        if (active && next) {
          onAggregateChange(next);
        }
      });
    };

    refreshAggregate();

    const interval = setInterval(() => {
      if (document.visibilityState === "visible") {
        refreshAggregate();
      }
    }, 15000);

    const handleVisibility = () => {
      if (document.visibilityState === "visible") {
        refreshAggregate();
      }
    };
    document.addEventListener("visibilitychange", handleVisibility);

    return () => {
      active = false;
      clearInterval(interval);
      document.removeEventListener("visibilitychange", handleVisibility);
    };
  }, [product.id, onAggregateChange]);

  const realReviews =
    aggregate && aggregate.reviews.length > 0 ? aggregate.reviews : null;

  const displayReviews: DisplayReview[] = realReviews
    ? realReviews.map((review) => ({
        key: review.id,
        name: review.name,
        location: review.verified ? "Verified Buyer" : "Customer Review",
        rating: review.rating,
        comment: review.comment,
        date: formatDate(review.createdAt),
        verified: review.verified,
        sample: false,
      }))
    : buildSeedReviews(product);

  const average =
    aggregate && aggregate.count > 0 ? aggregate.average : product.rating;
  const count = aggregate ? aggregate.count : product.reviewCount;
  const verifiedCount = aggregate?.verifiedCount ?? 0;
  const distribution = aggregate?.distribution ?? ZERO_DISTRIBUTION;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (status === "loading" || submitting) return;

    if (!user) {
      if (!guestName.trim() || guestName.trim().length < 2) {
        toast.error("Please enter your name (at least 2 characters).");
        return;
      }
    }

    if (!comment.trim() || comment.trim().length < 5) {
      toast.error("Please share a short review (at least 5 characters).");
      return;
    }

    setSubmitting(true);
    try {
      const result = await submitReviewAction({
        productId: product.id,
        rating: userRating,
        comment: comment.trim(),
        guestName: !user ? guestName.trim() : undefined,
        guestEmail: !user && guestEmail.trim() ? guestEmail.trim() : undefined,
      });

      if (!result.success) {
        toast.error(result.message ?? "Could not submit your review.");
        setSubmitting(false);
        return;
      }

      toast.success(result.message || "Thank you! Your review is now live.");
      setShowForm(false);
      setUserRating(5);
      setHoverRating(null);
      setComment("");
      setGuestName("");
      setGuestEmail("");

      if (result.aggregate) {
        onAggregateChange(result.aggregate);
      }

      router.refresh();
    } catch {
      toast.error("An unexpected error occurred while saving your review.");
    } finally {
      setSubmitting(false);
    }
  };

  const activeRating = hoverRating ?? userRating;

  return (
    <div className="grid gap-12 lg:grid-cols-[340px_1fr]">
      {/* Left Column: Summary & Review Trigger */}
      <div className="space-y-6">
        <div className="rounded-3xl border border-[#174A63]/10 bg-white p-8 text-center shadow-xs">
          <p className="font-display text-6xl font-semibold tracking-tight text-[#174A63]">
            {average.toFixed(1)}
          </p>
          <div className="mt-3 flex justify-center gap-1">
            {Array.from({ length: 5 }).map((_, i) => (
              <Star
                key={i}
                size={18}
                className={
                  i < Math.round(average)
                    ? "fill-gold text-gold"
                    : "text-[#174A63]/15"
                }
              />
            ))}
          </div>
          <p className="mt-2 text-sm text-[#174A63]/60">
            Based on {count} {count === 1 ? "review" : "reviews"}
            {verifiedCount > 0 && (
              <>
                {" "}
                •{" "}
                <span className="font-medium text-gold">
                  {verifiedCount} verified
                </span>
              </>
            )}
          </p>

          {/* Star Distribution Breakdown */}
          <div className="mt-6 space-y-2.5">
            {distribution.map((d) => (
              <div key={d.stars} className="flex items-center gap-3">
                <span className="w-7 text-right text-xs font-medium text-[#174A63]/60">
                  {d.stars}★
                </span>
                <div className="h-2 flex-1 overflow-hidden rounded-full bg-[#174A63]/10">
                  <div
                    className="h-full rounded-full bg-gold transition-all duration-500"
                    style={{ width: `${d.percent}%` }}
                  />
                </div>
                <span className="w-8 text-xs text-[#174A63]/45 text-right font-mono">
                  {d.percent}%
                </span>
              </div>
            ))}
          </div>

          <div className="mt-8 border-t border-[#174A63]/10 pt-6">
            <button
              type="button"
              onClick={() => setShowForm((prev) => !prev)}
              className={cn(
                "flex w-full items-center justify-center gap-2 rounded-full py-3.5 text-sm font-semibold transition-all shadow-sm cursor-pointer",
                showForm
                  ? "border border-[#174A63]/20 bg-white text-[#174A63] hover:bg-neutral-50"
                  : "bg-[#174A63] text-white hover:bg-gold hover:shadow-md",
              )}
            >
              {showForm ? (
                <>
                  <X size={16} /> Close Review Form
                </>
              ) : (
                <>
                  <MessageSquarePlus size={16} /> Write a Review
                </>
              )}
            </button>
            <p className="mt-2.5 text-xs text-[#174A63]/45">
              Verified instantly • Shows immediately on this page
            </p>
          </div>
        </div>

        {/* Review Form Drawer / Card */}
        <AnimatePresence>
          {showForm && (
            <motion.div
              initial={{ opacity: 0, height: 0, y: -10 }}
              animate={{ opacity: 1, height: "auto", y: 0 }}
              exit={{ opacity: 0, height: 0, y: -10 }}
              transition={{ duration: 0.3 }}
              className="overflow-hidden"
            >
              <form
                onSubmit={handleSubmit}
                className="rounded-3xl border border-gold/30 bg-[#FAF8F5] p-6 shadow-md"
              >
                <div className="flex items-center justify-between pb-3 border-b border-[#174A63]/10">
                  <h3 className="font-display text-lg font-semibold text-[#174A63]">
                    Your Experience
                  </h3>
                  <button
                    type="button"
                    onClick={() => setShowForm(false)}
                    className="rounded-full p-1 text-[#174A63]/40 hover:bg-black/5 hover:text-[#174A63] cursor-pointer"
                    aria-label="Close"
                  >
                    <X size={16} />
                  </button>
                </div>

                {/* Authenticated user badge or guest fields */}
                <div className="mt-4">
                  {user ? (
                    <div className="flex items-center gap-2.5 rounded-2xl bg-white p-3 border border-[#174A63]/10 text-xs">
                      <div className="flex h-7 w-7 items-center justify-center rounded-full bg-[#174A63] font-display text-xs text-gold">
                        {user.name?.charAt(0) || "U"}
                      </div>
                      <div className="flex-1 truncate">
                        <p className="font-semibold text-[#174A63]">
                          {user.name}
                        </p>
                        <p className="text-[11px] text-[#174A63]/50 truncate">
                          {user.email}
                        </p>
                      </div>
                      <span className="flex items-center gap-1 rounded-full bg-emerald-50 px-2 py-0.5 text-[10px] font-medium text-emerald-700">
                        <UserCheck size={12} /> Logged In
                      </span>
                    </div>
                  ) : (
                    <div className="space-y-3">
                      <div>
                        <label
                          htmlFor="review-guest-name"
                          className="block text-xs font-semibold text-[#174A63]"
                        >
                          Your Name <span className="text-red-500">*</span>
                        </label>
                        <input
                          id="review-guest-name"
                          type="text"
                          required
                          value={guestName}
                          onChange={(e) => setGuestName(e.target.value)}
                          placeholder="e.g. Danish Ansari"
                          className="mt-1 w-full rounded-xl border border-[#174A63]/20 bg-white px-3.5 py-2 text-sm text-[#174A63] placeholder:text-[#174A63]/30 focus:border-gold focus:outline-none focus:ring-1 focus:ring-gold"
                        />
                      </div>
                      <div>
                        <div className="flex items-center justify-between">
                          <label
                            htmlFor="review-guest-email"
                            className="block text-xs font-semibold text-[#174A63]"
                          >
                            Email Address{" "}
                            <span className="text-[11px] font-normal text-[#174A63]/50">
                              (optional)
                            </span>
                          </label>
                          <Link
                            href={`/sign-in?next=/product/${product.slug}`}
                            className="text-[11px] font-medium text-gold hover:underline"
                          >
                            Have an account? Sign in
                          </Link>
                        </div>
                        <input
                          id="review-guest-email"
                          type="email"
                          value={guestEmail}
                          onChange={(e) => setGuestEmail(e.target.value)}
                          placeholder="Used to verify previous orders"
                          className="mt-1 w-full rounded-xl border border-[#174A63]/20 bg-white px-3.5 py-2 text-sm text-[#174A63] placeholder:text-[#174A63]/30 focus:border-gold focus:outline-none focus:ring-1 focus:ring-gold"
                        />
                      </div>
                    </div>
                  )}
                </div>

                {/* Rating selection with hover preview */}
                <div className="mt-4">
                  <span className="block text-xs font-semibold text-[#174A63]">
                    Overall Rating
                  </span>
                  <div className="mt-1.5 flex items-center gap-1.5">
                    {Array.from({ length: 5 }).map((_, i) => {
                      const starValue = i + 1;
                      const isFilled = starValue <= activeRating;
                      return (
                        <button
                          key={starValue}
                          type="button"
                          onClick={() => setUserRating(starValue)}
                          onMouseEnter={() => setHoverRating(starValue)}
                          onMouseLeave={() => setHoverRating(null)}
                          className="cursor-pointer p-0.5 transition-transform hover:scale-120 focus:outline-none"
                          aria-label={`Rate ${starValue} star${starValue > 1 ? "s" : ""}`}
                        >
                          <Star
                            size={24}
                            className={cn(
                              "transition-colors",
                              isFilled
                                ? "fill-gold text-gold"
                                : "text-[#174A63]/20",
                            )}
                          />
                        </button>
                      );
                    })}
                  </div>
                  <p className="mt-1 text-xs font-medium text-gold">
                    {RATING_DESCRIPTIONS[activeRating]}
                  </p>
                </div>

                {/* Review comment */}
                <div className="mt-4">
                  <div className="flex items-center justify-between text-xs">
                    <label
                      htmlFor="review-comment"
                      className="font-semibold text-[#174A63]"
                    >
                      Your Review <span className="text-red-500">*</span>
                    </label>
                    <span
                      className={cn(
                        "text-[11px]",
                        comment.trim().length >= 5
                          ? "text-[#174A63]/50"
                          : "text-amber-600 font-medium",
                      )}
                    >
                      {comment.trim().length} / 1000
                    </span>
                  </div>
                  <textarea
                    id="review-comment"
                    required
                    rows={4}
                    value={comment}
                    onChange={(e) => setComment(e.target.value)}
                    placeholder="Tell us about the scent profile, how long it lasts on your skin, the sillage, and what occasions you wear it for..."
                    className="mt-1.5 w-full rounded-2xl border border-[#174A63]/20 bg-white p-3 text-sm text-[#174A63] placeholder:text-[#174A63]/30 focus:border-gold focus:outline-none focus:ring-1 focus:ring-gold"
                  />
                </div>

                {/* Submit button */}
                <button
                  type="submit"
                  disabled={submitting}
                  className="mt-4 flex w-full items-center justify-center gap-2 rounded-full bg-gold py-3 text-sm font-semibold text-white shadow-sm transition-all hover:bg-[#174A63] disabled:cursor-not-allowed disabled:opacity-60 cursor-pointer"
                >
                  {submitting && <Loader2 size={16} className="animate-spin" />}
                  {submitting ? "Saving to Database…" : "Submit Review"}
                </button>
              </form>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Right Column: Reviews List */}
      <div>
        {realReviews && realReviews.length > 0 ? (
          <div className="space-y-4">
            <div className="flex items-center justify-between border-b border-[#174A63]/10 pb-4">
              <h3 className="font-display text-xl font-semibold text-[#174A63]">
                Customer Reviews ({realReviews.length})
              </h3>
              <span className="flex items-center gap-1.5 text-xs text-emerald-700 bg-emerald-50 px-3 py-1 rounded-full font-medium">
                <span className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse" />
                Live from Database
              </span>
            </div>

            <div className="space-y-4">
              {displayReviews.map((review, index) => (
                <motion.div
                  key={review.key}
                  initial={{ opacity: 0, y: 12 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3, delay: index * 0.04 }}
                  className="rounded-3xl border border-[#174A63]/10 bg-white p-6 shadow-xs transition-shadow hover:shadow-md"
                >
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex items-center gap-3">
                      <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-[#174A63] font-display text-lg font-medium text-gold shadow-inner">
                        {review.name.charAt(0).toUpperCase()}
                      </div>
                      <div>
                        <div className="flex items-center gap-2">
                          <p className="font-semibold text-sm text-[#174A63]">
                            {review.name}
                          </p>
                          {review.verified && (
                            <span className="inline-flex items-center gap-1 rounded-full bg-gold/15 px-2 py-0.5 text-[10px] font-semibold tracking-wide text-gold uppercase">
                              <CheckCircle2 size={11} /> Verified Buyer
                            </span>
                          )}
                        </div>
                        <p className="text-xs text-[#174A63]/45 mt-0.5">
                          {review.location} • {review.date}
                        </p>
                      </div>
                    </div>

                    <div className="flex gap-0.5 shrink-0">
                      {Array.from({ length: 5 }).map((_, i) => (
                        <Star
                          key={i}
                          size={14}
                          className={
                            i < review.rating
                              ? "fill-gold text-gold"
                              : "text-[#174A63]/15"
                          }
                        />
                      ))}
                    </div>
                  </div>

                  <p className="mt-4 text-sm leading-relaxed text-[#174A63]/80">
                    &ldquo;{review.comment}&rdquo;
                  </p>
                </motion.div>
              ))}
            </div>
          </div>
        ) : (
          <div className="space-y-6">
            {/* Empty State Banner */}
            <div className="rounded-3xl border border-dashed border-[#174A63]/20 bg-white/70 p-10 text-center shadow-xs">
              <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-gold/10 text-gold mb-4">
                <Star size={26} className="fill-gold" />
              </div>
              <h3 className="font-display text-2xl font-medium text-[#174A63]">
                Be the first to review {product.name}
              </h3>
              <p className="mt-2 text-sm text-[#174A63]/60 max-w-md mx-auto leading-relaxed">
                Have you sampled or worn this exquisite attar? Share your thoughts
                on its notes, silage, and longevity with fellow perfume lovers.
              </p>
              <button
                type="button"
                onClick={() => setShowForm(true)}
                className="mt-6 inline-flex items-center gap-2 rounded-full bg-[#174A63] px-7 py-3 text-sm font-semibold text-white transition-all hover:bg-gold hover:shadow-md cursor-pointer"
              >
                <MessageSquarePlus size={16} /> Write the First Review
              </button>
            </div>

            {/* Sample Impressions Guide */}
            <div>
              <p className="text-xs font-semibold tracking-wider uppercase text-[#174A63]/40 mb-3">
                Curated Fragrance Impressions
              </p>
              <div className="grid gap-3 sm:grid-cols-2">
                {displayReviews.map((review) => (
                  <div
                    key={review.key}
                    className="rounded-2xl border border-[#174A63]/10 bg-white/50 p-4 text-xs text-[#174A63]/70"
                  >
                    <div className="flex items-center justify-between">
                      <span className="font-semibold text-[#174A63]">
                        {review.name}
                      </span>
                      <div className="flex gap-0.5">
                        {Array.from({ length: 5 }).map((_, i) => (
                          <Star
                            key={i}
                            size={11}
                            className={
                              i < review.rating
                                ? "fill-gold text-gold"
                                : "text-[#174A63]/15"
                            }
                          />
                        ))}
                      </div>
                    </div>
                    <p className="mt-2 italic">&ldquo;{review.comment}&rdquo;</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}