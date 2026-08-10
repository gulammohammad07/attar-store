"use client";

import Image from "next/image";
import { m as motion, useScroll, useTransform } from "framer-motion";
import { useRef } from "react";
import { Sparkles, Droplets, Clock, ChevronRight } from "lucide-react";

const pillars = [
  {
    icon: Sparkles,
    title: "Rare Ingredients",
    text: "Kashmiri oud, Damask rose and Mysore sandalwood — sourced from trusted artisans.",
  },
  {
    icon: Droplets,
    title: "Hand-Poured",
    text: "Every bottle is filled, rested and sealed by hand in small batches.",
  },
  {
    icon: Clock,
    title: "Aged With Patience",
    text: "Our blends rest for weeks to mature into deeper, richer compositions.",
  },
];

const milestones = [
  {
    year: "2018",
    title: "A Single Copper Still",
    text: "MD Perfumes is born in the attar bazaars of the Middle East.",
  },
  {
    year: "2020",
    title: "The First Atelier",
    text: "Our workshop opens, and hand-poured batches find their first collectors.",
  },
  {
    year: "2023",
    title: "50 Rare Blends",
    text: "Kashmiri oud and Mysore sandalwood join a growing, hand-curated maison.",
  },
  {
    year: "Today",
    title: "Loved Worldwide",
    text: "10,000+ collectors across the globe wear an MD signature.",
  },
];

export default function BrandStory({
  banner,
}: {
  banner?: { title: string | null; imageUrl: string };
}) {
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start end", "end start"],
  });
  const imageY = useTransform(scrollYProgress, [0, 1], [40, -40]);

  return (
    <section id="story" className="overflow-hidden bg-[#F8FCFE] py-28 text-[#174A63]">
      <div className="mx-auto max-w-7xl px-6">
        <div
          className={`grid items-center gap-16 ${
            banner?.imageUrl
              ? "lg:grid-cols-2"
              : "lg:grid-cols-1 lg:mx-auto lg:max-w-3xl"
          }`}
        >
          {/* Visual */}
          {banner?.imageUrl && (
            <motion.div
              initial={{ opacity: 0, x: -40 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true, margin: "-80px" }}
              transition={{ duration: 0.7 }}
              className="relative order-2 lg:order-1"
            >
              <motion.div
                style={{ y: imageY }}
                className="relative aspect-[4/5] overflow-hidden rounded-[2rem] border border-gold/25 shadow-[0_40px_80px_-40px_rgba(23,74,99,0.45)]"
              >
                <Image
                  src={banner.imageUrl}
                  alt={banner.title ?? "The art of attar making"}
                  fill
                  sizes="(max-width: 1024px) 100vw, 50vw"
                  className="object-cover transition-transform duration-700 hover:scale-105"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#F8FCFE]/35 to-transparent" />
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: 0.3 }}
                className="absolute -bottom-6 -right-6 hidden rounded-2xl border border-gold/40 bg-white/80 p-6 shadow-[0_0_50px_rgba(201,169,110,0.25)] backdrop-blur-md sm:block"
              >
                <p className="gold-gradient-text font-display text-4xl font-semibold">
                  8+ Yrs
                </p>
                <p className="mt-1 text-xs tracking-[0.2em] text-[#174A63]/60 uppercase">
                  of Craft
                </p>
              </motion.div>
            </motion.div>
          )}

          {/* Copy */}
          <div className="order-1 lg:order-2">
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
              className="text-[11px] font-semibold tracking-[0.3em] text-gold uppercase"
            >
              Our Story
            </motion.p>

            <motion.h2
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.1 }}
              className="mt-4 font-display text-4xl font-medium sm:text-5xl"
            >
              Perfume, the way
              <span className="gold-gradient-text italic">
                {" "}
                it was meant to be
              </span>
            </motion.h2>

            <motion.p
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="mt-6 text-sm leading-relaxed text-[#174A63]/60"
            >
              Born from a fascination with the attar bazaars of the Middle
              East, MD Perfumes began with a single copper still and a belief:
              that fragrance should be pure, concentrated and personal. No
              fillers, no shortcuts — just rare oils, aged with devotion and
              bottled by hand.
            </motion.p>

            <div className="mt-10 space-y-6">
              {pillars.map((pillar, index) => (
                <motion.div
                  key={pillar.title}
                  initial={{ opacity: 0, x: 30 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: 0.2 + index * 0.1 }}
                  className="group flex gap-4 rounded-2xl border border-gold/20 bg-white/60 p-4 shadow-[0_10px_30px_-18px_rgba(23,74,99,0.2)] transition-colors duration-500 hover:border-gold/40 hover:bg-white/80"
                >
                  <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl border border-gold/30 bg-gold/10">
                    <pillar.icon size={20} className="text-gold" />
                  </div>
                  <div>
                    <h3 className="font-display text-lg font-medium text-[#174A63]">
                      {pillar.title}
                    </h3>
                    <p className="mt-1 text-sm text-[#174A63]/55">
                      {pillar.text}
                    </p>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </div>

        {/* Timeline */}
        <div ref={ref} className="mt-28 grid gap-10 lg:grid-cols-4 lg:gap-6">
          {milestones.map((milestone, index) => (
            <motion.div
              key={milestone.year}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-60px" }}
              transition={{ duration: 0.6, delay: index * 0.12 }}
              className="relative"
            >
              {index < milestones.length - 1 && (
                <div className="absolute left-[5px] top-7 hidden h-full w-px bg-gradient-to-b from-gold/50 to-gold/10 lg:block" />
              )}
              <div className="absolute left-0 top-1.5 hidden h-[11px] w-[11px] rounded-full border-2 border-gold bg-[#F8FCFE] lg:block" />
              <div className="lg:pl-8">
                <p className="gold-gradient-text font-display text-3xl font-semibold">
                  {milestone.year}
                </p>
                <h3 className="mt-3 font-display text-lg font-medium text-[#174A63]">
                  {milestone.title}
                </h3>
                <p className="mt-2 text-sm leading-relaxed text-[#174A63]/55">
                  {milestone.text}
                </p>
                <ChevronRight size={14} className="mt-3 hidden text-gold/50 lg:block" />
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
