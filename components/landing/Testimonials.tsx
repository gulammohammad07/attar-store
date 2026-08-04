"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Quote, Star } from "lucide-react";
import { testimonials } from "@/lib/data/products";
import SectionHeading from "@/components/landing/SectionHeading";
import { cn } from "@/lib/utils";

export default function Testimonials() {
  const [active, setActive] = useState(0);

  return (
    <section className="bg-[#F7F3EC] py-24">
      <div className="mx-auto max-w-5xl px-6">
        <SectionHeading
          eyebrow="Word of Mouth"
          title="Loved by Connoisseurs"
          description="Real reviews from clients who made MD Perfumes their signature."
        />

        <div className="relative">
          <Quote
            size={80}
            className="absolute -top-6 left-0 text-gold/20"
          />

          <div className="relative min-h-[220px] pt-10 sm:min-h-[200px]">
            <AnimatePresence mode="wait">
              <motion.figure
                key={active}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.4 }}
                className="mx-auto max-w-3xl text-center"
              >
                <div className="flex items-center justify-center gap-1">
                  {Array.from({ length: 5 }).map((_, i) => (
                    <Star
                      key={i}
                      size={18}
                      className={
                        i < testimonials[active].rating
                          ? "fill-gold text-gold"
                          : "text-[#1c1712]/20"
                      }
                    />
                  ))}
                </div>

                <blockquote className="mt-6 font-display text-2xl font-medium leading-relaxed text-[#1c1712] sm:text-3xl">
                  &ldquo;{testimonials[active].quote}&rdquo;
                </blockquote>

                <figcaption className="mt-8">
                  <p className="text-sm font-semibold tracking-[0.15em] text-[#1c1712] uppercase">
                    {testimonials[active].name}
                  </p>
                  <p className="mt-1 text-xs tracking-wide text-[#1c1712]/40">
                    {testimonials[active].location}
                  </p>
                </figcaption>
              </motion.figure>
            </AnimatePresence>
          </div>

          {/* Dots */}
          <div className="mt-10 flex justify-center gap-2.5">
            {testimonials.map((t, i) => (
              <button
                key={t.name}
                type="button"
                onClick={() => setActive(i)}
                aria-label={`View review from ${t.name}`}
                className={cn(
                  "h-2 rounded-full transition-all duration-300",
                  active === i
                    ? "w-8 bg-gold"
                    : "w-2 bg-[#1c1712]/20 hover:bg-[#1c1712]/40",
                )}
              />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
