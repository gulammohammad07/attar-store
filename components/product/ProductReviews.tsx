"use client";

import { useMemo, useState } from "react";
import { m as motion } from "framer-motion";
import { Star } from "lucide-react";
import type { Product } from "@/lib/data/products";
import { cn } from "@/lib/utils";

const REVIEWERS = [
  { name: "Aarav S.", location: "Mumbai" },
  { name: "Meera P.", location: "Delhi" },
  { name: "Kabir M.", location: "Bengaluru" },
  { name: "Ishita R.", location: "Pune" },
  { name: "Vihaan K.", location: "Hyderabad" },
  { name: "Ananya T.", location: "Chennai" },
];

const COMMENTS = [
  "Absolutely stunning — lasts the whole day and evolves beautifully on the skin.",
  "The quality is remarkable. It smells far more expensive than it costs.",
  "Received so many compliments. My new signature scent, no question.",
  "Rich, layered and elegant. The delivery and packaging were top-notch too.",
  "Subtle at first, then opens into something truly special. Worth every rupee.",
  "Perfect for special occasions. The projection is outstanding.",
];

function buildReviews(product: Product) {
  const seed = product.id.split("").reduce((a, c) => a + c.charCodeAt(0), 0);
  return REVIEWERS.map((reviewer, i) => {
    const rating = product.rating >= 4.8 ? 5 : product.rating >= 4.5 ? 4 : 4;
    return {
      ...reviewer,
      rating,
      comment: COMMENTS[(seed + i) % COMMENTS.length],
      date: `${10 + ((seed + i) % 9)} ${["Jan", "Feb", "Mar", "Apr", "May", "Jun"][i % 6]} 2026`,
    };
  }).slice(0, 4);
}

export default function ProductReviews({ product }: { product: Product }) {
  const reviews = useMemo(() => buildReviews(product), [product]);
  const [showForm, setShowForm] = useState(false);
  const [userRating, setUserRating] = useState(5);

  const distribution = [
    { stars: 5, percent: product.rating >= 4.8 ? 82 : 60 },
    { stars: 4, percent: 14 },
    { stars: 3, percent: 3 },
    { stars: 2, percent: 1 },
    { stars: 1, percent: 0 },
  ];

  return (
    <div className="grid gap-12 lg:grid-cols-[320px_1fr]">
      {/* Summary */}
      <div>
        <div className="rounded-3xl border border-[#174A63]/10 bg-white p-8 text-center">
          <p className="font-display text-6xl font-semibold text-[#174A63]">
            {product.rating}
          </p>
          <div className="mt-2 flex justify-center gap-1">
            {Array.from({ length: 5 }).map((_, i) => (
              <Star
                key={i}
                size={16}
                className={
                  i < Math.round(product.rating)
                    ? "fill-gold text-gold"
                    : "text-[#174A63]/20"
                }
              />
            ))}
          </div>
          <p className="mt-2 text-sm text-[#174A63]/50">
            {product.reviewCount} verified reviews
          </p>

          <div className="mt-6 space-y-2">
            {distribution.map((d) => (
              <div key={d.stars} className="flex items-center gap-3">
                <span className="w-8 text-right text-xs text-[#174A63]/50">
                  {d.stars}★
                </span>
                <div className="h-2 flex-1 overflow-hidden rounded-full bg-[#174A63]/10">
                  <div
                    className="h-full rounded-full bg-gold"
                    style={{ width: `${d.percent}%` }}
                  />
                </div>
                <span className="w-8 text-xs text-[#174A63]/40">
                  {d.percent}%
                </span>
              </div>
            ))}
          </div>
        </div>

        <button
          type="button"
          onClick={() => setShowForm((s) => !s)}
          className="mt-4 w-full rounded-full bg-[#174A63] py-3.5 text-sm font-medium text-white transition-colors hover:bg-gold"
        >
          Write a Review
        </button>

        {showForm && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="mt-4 rounded-2xl border border-[#174A63]/10 bg-white p-6"
          >
            <p className="mb-3 text-sm font-medium">Your rating</p>
            <div className="mb-4 flex gap-1">
              {Array.from({ length: 5 }).map((_, i) => (
                <button
                  key={i}
                  type="button"
                  onClick={() => setUserRating(i + 1)}
                  aria-label={`Rate ${i + 1} stars`}
                >
                  <Star
                    size={22}
                    className={cn(
                      "transition-colors",
                      i < userRating
                        ? "fill-gold text-gold"
                        : "text-[#174A63]/20",
                    )}
                  />
                </button>
              ))}
            </div>
            <textarea
              rows={3}
              placeholder="Share your experience..."
              className="w-full rounded-xl border border-[#174A63]/15 p-3 text-sm focus:border-gold focus:outline-none"
            />
            <button
              type="button"
              onClick={() => {
                setShowForm(false);
                setUserRating(5);
              }}
              className="mt-3 rounded-full bg-gold px-6 py-2.5 text-sm font-medium text-white"
            >
              Submit Review
            </button>
          </motion.div>
        )}
      </div>

      {/* Review list */}
      <div className="space-y-6">
        {reviews.map((review, index) => (
          <motion.div
            key={index}
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.4, delay: index * 0.08 }}
            className="rounded-2xl border border-[#174A63]/10 bg-white p-6"
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-full bg-[#174A63] font-display text-lg text-gold">
                  {review.name.charAt(0)}
                </div>
                <div>
                  <p className="text-sm font-semibold text-[#174A63]">
                    {review.name}
                  </p>
                  <p className="text-xs text-[#174A63]/40">
                    {review.location} • {review.date}
                  </p>
                </div>
              </div>
              <div className="flex gap-0.5">
                {Array.from({ length: 5 }).map((_, i) => (
                  <Star
                    key={i}
                    size={13}
                    className={
                      i < review.rating
                        ? "fill-gold text-gold"
                        : "text-[#174A63]/20"
                    }
                  />
                ))}
              </div>
            </div>

            <p className="mt-4 text-sm leading-relaxed text-[#174A63]/70">
              &ldquo;{review.comment}&rdquo;
            </p>

            <p className="mt-3 text-[10px] font-medium tracking-wider text-gold uppercase">
              ✓ Verified Purchase
            </p>
          </motion.div>
        ))}
      </div>
    </div>
  );
}
