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

export default function CategoryShowcase({
  categories,
}: {
  categories: StorefrontCategory[];
}) {
  return (
    <section className="relative overflow-hidden bg-[#f7f3ec] py-28">
      <div className="pointer-events-none absolute left-1/2 top-0 h-px w-[60%] -translate-x-1/2 bg-gradient-to-r from-transparent via-gold/40 to-transparent" />
      <div className="pointer-events-none absolute -right-40 top-1/3 h-[420px] w-[420px] bg-[radial-gradient(circle,rgba(198,161,91,0.12),transparent_70%)]" />

      <div className="relative mx-auto max-w-7xl px-6">
        <SectionHeading
          eyebrow="The Collection"
          title="Shop by Category"
          description="Our olfactory families, each a world of its own. Find the note that speaks to you."
        />

        <div className="grid grid-cols-2 gap-4 md:grid-cols-3 lg:grid-cols-6 lg:gap-5">
          {categories.map((category, index) => (
            <TiltCard
              key={category.slug}
              category={category}
              index={index}
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
}: {
  category: StorefrontCategory;
  index: number;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const mx = useMotionValue(0);
  const my = useMotionValue(0);
  const rotateX = useSpring(my, { stiffness: 180, damping: 16 });
  const rotateY = useSpring(mx, { stiffness: 180, damping: 16 });
  const glareX = useTransform(mx, [-0.5, 0.5], ["0%", "100%"]);
  const glareY = useTransform(my, [0.5, -0.5], ["0%", "100%"]);
  const glare = useMotionTemplate`radial-gradient(circle at ${glareX} ${glareY}, rgba(230,200,144,0.22), transparent 55%)`;

  const handleMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const rect = ref.current?.getBoundingClientRect();
    if (!rect) return;
    const x = (e.clientX - rect.left) / rect.width - 0.5;
    const y = (e.clientY - rect.top) / rect.height - 0.5;
    mx.set(x * 22);
    my.set(-y * 22);
  };

  const reset = () => {
    mx.set(0);
    my.set(0);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 34 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-40px" }}
      transition={{ duration: 0.55, delay: index * 0.07 }}
    >
      <Link href={`/shop?category=${category.slug}`} className="group block">
        <motion.div
          ref={ref}
          onMouseMove={handleMove}
          onMouseLeave={reset}
          style={{ rotateX, rotateY, transformStyle: "preserve-3d", perspective: 900 }}
          className="relative overflow-hidden rounded-[1.6rem] border border-gold/20 bg-white/60 p-[1px] shadow-[0_14px_36px_-18px_rgba(28,23,18,0.25)] transition-colors duration-500 group-hover:border-gold/60"
        >
          <div className="relative aspect-[3/4] overflow-hidden rounded-[calc(1.6rem-1px)] bg-gradient-to-b from-[#faf6ec] via-[#f3ecdd] to-[#ecdfc6]">
            {category.imageUrl ? (
              <Image
                src={category.imageUrl}
                alt={category.name}
                fill
                sizes="(max-width: 768px) 50vw, 16vw"
                className="object-contain p-6 transition-transform duration-700 ease-out group-hover:scale-110 group-hover:-translate-y-1"
              />
            ) : (
              <div className="flex h-full items-center justify-center">
                <span className="font-display text-6xl font-medium text-gold/30 transition-colors duration-500 group-hover:text-gold/60">
                  {category.name.charAt(0)}
                </span>
              </div>
            )}

            <div className="absolute inset-0 bg-gradient-to-t from-[#f7f3ec]/90 via-transparent to-transparent opacity-60 transition-opacity duration-500 group-hover:opacity-90" />

            {/* glare */}
            <motion.div
              style={{ background: glare }}
              className="pointer-events-none absolute inset-0 opacity-0 transition-opacity duration-300 group-hover:opacity-100"
            />

            <div className="absolute right-3 top-3 flex h-8 w-8 items-center justify-center rounded-full border border-gold/40 bg-white/70 text-gold opacity-0 shadow-md backdrop-blur transition-all duration-500 group-hover:opacity-100">
              <ArrowUpRight size={14} />
            </div>

            <div
              className="absolute inset-x-0 bottom-0 p-4"
              style={{ transform: "translateZ(40px)" }}
            >
              <h3 className="font-display text-xl font-medium text-[#1c1712]">
                {category.name}
              </h3>
              {category.tagline && (
                <p className="mt-0.5 line-clamp-1 text-[10px] tracking-wide text-[#1c1712]/50">
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
