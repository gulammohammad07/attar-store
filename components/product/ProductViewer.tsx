"use client";

import Image from "next/image";
import { useRef, useState } from "react";
import { m as motion, useMotionValue, useSpring } from "framer-motion";
import { ChevronLeft, ChevronRight, ZoomIn } from "lucide-react";
import type { Product } from "@/lib/data/products";
import { cn } from "@/lib/utils";

export default function ProductViewer({ product }: { product: Product }) {
  const [active, setActive] = useState(0);
  const [zoomed, setZoomed] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  const mx = useMotionValue(50);
  const my = useMotionValue(50);
  const rotateX = useSpring(my, { stiffness: 150, damping: 20 });
  const rotateY = useSpring(mx, { stiffness: 150, damping: 20 });

  const images = product.gallery.length ? product.gallery : [product.image];

  const handleMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const rect = ref.current?.getBoundingClientRect();
    if (!rect) return;
    const x = ((e.clientX - rect.left) / rect.width) * 100;
    const y = ((e.clientY - rect.top) / rect.height) * 100;
    mx.set(x);
    my.set(y);

    const rx = (y / 100 - 0.5) * -8;
    const ry = (x / 100 - 0.5) * 8;
    rotateX.set(rx);
    rotateY.set(ry);
  };

  const reset = () => {
    mx.set(50);
    my.set(50);
    rotateX.set(0);
    rotateY.set(0);
  };

  return (
    <div className="grid gap-4 md:grid-cols-[80px_1fr]">
      {/* Thumbnails */}
      <div className="order-2 flex gap-3 md:order-1 md:flex-col">
        {images.map((image, index) => (
          <button
            key={index}
            type="button"
            onClick={() => setActive(index)}
            className={cn(
              "relative h-20 w-20 shrink-0 overflow-hidden rounded-xl border-2 bg-white transition-all",
              active === index
                ? "border-gold shadow-md"
                : "border-transparent opacity-60 hover:opacity-100",
            )}
            aria-label={`View image ${index + 1}`}
          >
            <Image
              src={image}
              alt={`${product.name} view ${index + 1}`}
              fill
              sizes="80px"
              className="object-contain p-1.5"
            />
          </button>
        ))}
      </div>

      {/* Main viewer */}
      <div
        ref={ref}
        onMouseMove={handleMove}
        onMouseLeave={() => {
          reset();
          setZoomed(false);
        }}
        onClick={() => setZoomed((z) => !z)}
        className="group relative order-1 cursor-zoom-in overflow-hidden rounded-3xl bg-[#f8f5f0] md:order-2"
        style={{ perspective: 1000 }}
      >
        <motion.div
          style={{
            rotateX,
            rotateY,
            transformStyle: "preserve-3d",
          }}
          className="relative aspect-square w-full"
        >
          <motion.div
            key={active}
            initial={{ opacity: 0, scale: 0.97 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.4 }}
            className={cn("absolute inset-0", zoomed && "scale-125")}
            style={
              zoomed
                ? {
                    transformOrigin: `${mx.get()}% ${my.get()}%`,
                  }
                : undefined
            }
          >
            <Image
              src={images[active]}
              alt={product.name}
              fill
              priority
              sizes="(max-width: 768px) 100vw, 50vw"
              className="object-contain p-10 transition-transform duration-700"
            />
          </motion.div>
        </motion.div>

        {images.length > 1 && (
          <>
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                setActive((a) => (a - 1 + images.length) % images.length);
              }}
              aria-label="Previous image"
              className="absolute left-3 top-1/2 z-10 flex h-10 w-10 -translate-y-1/2 items-center justify-center rounded-full bg-white/80 text-[#1c1712]/70 opacity-0 shadow backdrop-blur transition-all group-hover:opacity-100 hover:scale-110 hover:text-[#1c1712]"
            >
              <ChevronLeft size={20} />
            </button>

            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                setActive((a) => (a + 1) % images.length);
              }}
              aria-label="Next image"
              className="absolute right-3 top-1/2 z-10 flex h-10 w-10 -translate-y-1/2 items-center justify-center rounded-full bg-white/80 text-[#1c1712]/70 opacity-0 shadow backdrop-blur transition-all group-hover:opacity-100 hover:scale-110 hover:text-[#1c1712]"
            >
              <ChevronRight size={20} />
            </button>
          </>
        )}

        {/* Zoom hint */}
        <div className="pointer-events-none absolute right-4 top-4 flex h-10 w-10 items-center justify-center rounded-full bg-white/80 text-[#1c1712]/60 opacity-0 shadow backdrop-blur transition-opacity group-hover:opacity-100">
          <ZoomIn size={18} />
        </div>

        {/* Floating shine */}
        <div className="pointer-events-none absolute inset-0 bg-gradient-to-tr from-transparent via-white/20 to-transparent opacity-0 transition-opacity duration-500 group-hover:opacity-100" />
      </div>
    </div>
  );
}
