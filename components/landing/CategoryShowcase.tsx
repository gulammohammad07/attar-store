"use client";

import Link from "next/link";
import Image from "next/image";
import { memo, useRef } from "react";
import {
  m as motion,
  useMotionValue,
  useMotionTemplate,
  useSpring,
  useTransform,
} from "framer-motion";
import { ArrowUpRight } from "lucide-react";
import type { StorefrontCategory } from "@/lib/services/storefront-data";
import SectionHeading from "@/components/landing/SectionHeading";
import { useHoverCapable } from "@/lib/hooks/use-media-query";

export default function CategoryShowcase({
  categories,
}: {
  categories: StorefrontCategory[];
}) {
  // Resolved once here rather than per card — one media-query subscription
  // instead of one per category tile.
  const tiltOk = useHoverCapable();

  return (
    <section className="relative overflow-hidden bg-[#f8fcfe] py-28 sm:py-36">
      <div className="pointer-events-none absolute left-1/2 top-0 h-px w-[60%] -translate-x-1/2 bg-gradient-to-r from-transparent via-gold/30 to-transparent" />
      <div className="pointer-events-none absolute -right-40 top-1/3 h-[420px] w-[420px] bg-[radial-gradient(circle,rgba(201,169,110,0.12),transparent_70%)]" />
      <div className="pointer-events-none absolute -left-40 top-2/3 h-[300px] w-[300px] bg-[radial-gradient(circle,rgba(142,201,232,0.08),transparent_70%)]" />

      <div className="relative mx-auto max-w-7xl px-6">
        <SectionHeading
          eyebrow="The Collection"
          title="Shop by Category"
          description="Our olfactory families, each a world of its own. Find the note that speaks to you."
        />

        <div className="grid grid-cols-1 gap-7 md:grid-cols-2 lg:grid-cols-3">
          {categories.map((category, index) => (
            <TiltCard
              key={category.slug}
              category={category}
              index={index}
              tiltOk={tiltOk}
            />
          ))}
        </div>
      </div>
    </section>
  );
}

const TiltCard = memo(function TiltCard({
  category,
  index,
  tiltOk,
}: {
  category: StorefrontCategory;
  index: number;
  tiltOk: boolean;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const mx = useMotionValue(0);
  const my = useMotionValue(0);
  const rotateX = useSpring(my, { stiffness: 100, damping: 18, mass: 0.5 });
  const rotateY = useSpring(mx, { stiffness: 100, damping: 18, mass: 0.5 });
  const glareX = useTransform(mx, [-0.5, 0.5], ["0%", "100%"]);
  const glareY = useTransform(my, [0.5, -0.5], ["0%", "100%"]);
  const glare = useMotionTemplate`radial-gradient(circle at ${glareX} ${glareY}, rgba(224,199,149,0.32), transparent 55%)`;

  const handleMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!tiltOk) return;
    const rect = ref.current?.getBoundingClientRect();
    if (!rect) return;
    const x = (e.clientX - rect.left) / rect.width - 0.5;
    const y = (e.clientY - rect.top) / rect.height - 0.5;
    mx.set(x * 20);
    my.set(-y * 20);
  };

  const reset = () => {
    mx.set(0);
    my.set(0);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 50 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-80px" }}
      transition={{ duration: 0.7, delay: index * 0.14, ease: [0.22, 1, 0.36, 1] }}
    >
      <Link href={`/shop?category=${category.slug}`} className="group block">
        <motion.div
          ref={ref}
          onMouseMove={handleMove}
          onMouseLeave={reset}
          style={
            tiltOk
              ? {
                  rotateX,
                  rotateY,
                  transformStyle: "preserve-3d",
                  perspective: 1000,
                }
              : undefined
          }
          className="relative overflow-hidden rounded-[2.5rem] border border-gold/15 bg-white shadow-[0_24px_60px_-20px_rgba(15,40,56,0.15)] transition-all duration-700 group-hover:border-gold/50 group-hover:shadow-[0_40px_80px_-30px_rgba(201,169,110,0.25)]"
        >
          <div className="relative aspect-[4/3] overflow-hidden bg-gradient-to-b from-[#f0f7fb] via-[#f8fcfe] to-[#faf9f7]">
            {category.imageUrl ? (
              <Image
                src={category.imageUrl}
                alt=""
                fill
                sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 33vw"
                className="object-cover transition-transform duration-700 ease-out group-hover:scale-110 group-hover:-translate-y-2"
              />
            ) : (
              <div className="flex h-full items-center justify-center">
                <span className="font-display text-8xl font-medium text-gold/30 transition-colors duration-500 group-hover:text-gold/50">
                  {category.name.charAt(0)}
                </span>
              </div>
            )}

            <div className="absolute inset-0 bg-gradient-to-t from-[#0a1b26]/85 via-[#0a1b26]/30 to-transparent transition-opacity duration-700 group-hover:from-[#0a1b26]/90" />

            {/* Cursor-following glare — pointless without a cursor, and it
                rebuilds a radial-gradient string every frame, so keep it off
                touch devices entirely. */}
            {tiltOk && (
              <motion.div
                style={{ background: glare }}
                className="pointer-events-none absolute inset-0 opacity-0 transition-opacity duration-500 group-hover:opacity-100"
              />
            )}

            <div className="absolute right-6 top-6 flex h-11 w-11 items-center justify-center rounded-full border border-gold/40 bg-white/70 text-gold opacity-0 shadow-lg backdrop-blur-xl transition-all duration-700 group-hover:opacity-100">
              <ArrowUpRight size={18} />
            </div>

            <div
              className="absolute inset-x-0 bottom-0 p-7"
              style={{ transform: "translateZ(40px)" }}
            >
              <h3 className="font-display text-[1.7rem] font-medium tracking-tight text-[#fff]">
                {category.name}
              </h3>
              {category.tagline && (
                <p className="mt-2 text-sm tracking-wide text-[#dceff7]/85">
                  {category.tagline}
                </p>
              )}
            </div>
          </div>
        </motion.div>
      </Link>
    </motion.div>
  );
});
