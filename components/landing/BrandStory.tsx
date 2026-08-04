"use client";

import Image from "next/image";
import { motion } from "framer-motion";
import { Sparkles, Droplets, Clock } from "lucide-react";

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

export default function BrandStory() {
  return (
    <section id="story" className="overflow-hidden bg-charcoal py-24 text-[#f0ebe2]">
      <div className="mx-auto max-w-7xl px-6">
        <div className="grid items-center gap-16 lg:grid-cols-2">
          {/* Visual */}
          <motion.div
            initial={{ opacity: 0, x: -40 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, margin: "-80px" }}
            transition={{ duration: 0.7 }}
            className="relative"
          >
            <div className="relative aspect-[4/5] overflow-hidden rounded-3xl">
              <Image
                src="/images/products/oud.png"
                alt="The art of attar making"
                fill
                sizes="(max-width: 1024px) 100vw, 50vw"
                className="object-cover transition-transform duration-700 hover:scale-105"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent" />
            </div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.3 }}
              className="absolute -bottom-6 -right-6 hidden rounded-2xl bg-gold p-6 shadow-2xl sm:block"
            >
              <p className="font-display text-4xl font-semibold text-white">
                8+ Yrs
              </p>
              <p className="mt-1 text-xs tracking-[0.2em] text-white/80 uppercase">
                of Craft
              </p>
            </motion.div>
          </motion.div>

          {/* Copy */}
          <div>
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
              <span className="gold-gradient-text italic"> it was meant to be</span>
            </motion.h2>

            <motion.p
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="mt-6 text-sm leading-relaxed text-[#f0ebe2]/60"
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
                  className="flex gap-4"
                >
                  <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl border border-gold/30 bg-gold/10">
                    <pillar.icon size={20} className="text-gold" />
                  </div>
                  <div>
                    <h3 className="font-display text-lg font-medium">
                      {pillar.title}
                    </h3>
                    <p className="mt-1 text-sm text-[#f0ebe2]/50">
                      {pillar.text}
                    </p>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
