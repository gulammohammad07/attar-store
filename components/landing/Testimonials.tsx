"use client";

import { Quote, Star } from "lucide-react";
import { testimonials } from "@/lib/data/products";
import SectionHeading from "@/components/landing/SectionHeading";

const cards = [...testimonials, ...testimonials];

export default function Testimonials() {
  return (
    <section className="relative overflow-hidden bg-[#0a0908] py-28 text-[#f0ebe2]">
      <div className="pointer-events-none absolute left-1/2 top-0 h-px w-[60%] -translate-x-1/2 bg-gradient-to-r from-transparent via-gold/40 to-transparent" />
      <div className="pointer-events-none absolute left-1/2 top-1/2 h-[420px] w-[720px] -translate-x-1/2 -translate-y-1/2 bg-[radial-gradient(ellipse,rgba(198,161,91,0.08),transparent_70%)]" />

      <div className="relative mx-auto max-w-7xl px-6">
        <SectionHeading
          dark
          eyebrow="Word of Mouth"
          title="Loved by Connoisseurs"
          description="Real reviews from clients who made MD Perfumes their signature."
        />
      </div>

      <div className="relative mt-4">
        <div className="pointer-events-none absolute inset-y-0 left-0 z-10 w-16 bg-gradient-to-r from-[#0a0908] to-transparent sm:w-32" />
        <div className="pointer-events-none absolute inset-y-0 right-0 z-10 w-16 bg-gradient-to-l from-[#0a0908] to-transparent sm:w-32" />

        <div className="overflow-hidden [mask-image:linear-gradient(to_right,transparent,black_4%,black_96%,transparent)]">
          <div
            className="group flex w-max gap-6 animate-marquee gpu group-hover:[animation-play-state:paused]"
            style={{ animationDuration: "70s", animationDirection: "reverse" }}
          >
            {cards.map((t, i) => (
              <article
                key={`${t.name}-${i}`}
                className="relative w-[320px] shrink-0 rounded-[1.75rem] border border-white/10 bg-[#0a0908]/50 p-8 transition-colors duration-500 hover:border-gold/40 sm:w-[400px]"
              >
                <Quote
                  size={36}
                  className="absolute right-6 top-6 text-gold/20"
                />

                <div className="flex items-center gap-1">
                  {Array.from({ length: 5 }).map((_, starIndex) => (
                    <Star
                      key={starIndex}
                      size={15}
                      className={
                        starIndex < t.rating
                          ? "fill-gold text-gold"
                          : "text-white/15"
                      }
                    />
                  ))}
                </div>

                <blockquote className="mt-5 text-sm leading-relaxed text-[#f0ebe2]/75">
                  &ldquo;{t.quote}&rdquo;
                </blockquote>

                <footer className="mt-7 flex items-center gap-4">
                  <div className="flex h-11 w-11 items-center justify-center rounded-full bg-gradient-to-br from-gold/40 to-gold/10 font-display text-lg font-semibold text-gold-light">
                    {t.name.charAt(0)}
                  </div>
                  <div>
                    <p className="text-sm font-semibold tracking-[0.12em] text-[#f0ebe2] uppercase">
                      {t.name}
                    </p>
                    <p className="mt-0.5 text-[11px] tracking-wide text-[#f0ebe2]/40">
                      {t.location}
                    </p>
                  </div>
                </footer>
              </article>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
