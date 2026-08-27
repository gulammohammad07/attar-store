"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { m as motion, AnimatePresence, useMotionValue, useSpring } from "framer-motion";
import { ChevronLeft, ChevronRight, Eye, Heart, ShoppingBag, Star } from "lucide-react";
import type { Product } from "@/lib/data/products";
import { useWishlist } from "@/lib/store/wishlist-context";
import { useCart } from "@/lib/store/cart-context";
import { cn, formatPrice } from "@/lib/utils";
import QuickViewModal from "@/components/product/QuickViewModal";
import { toast } from "sonner";

export default function ProductCard({
  product,
  className,
  loading = "lazy",
  dark = false,
}: {
  product: Product;
  className?: string;
  loading?: "lazy" | "eager";
  dark?: boolean;
}) {
  const { isWishlisted, toggleWishlist } = useWishlist();
  const { addToCart } = useCart();
  const [quickViewOpen, setQuickViewOpen] = useState(false);
  const [imgIndex, setImgIndex] = useState(0);
  const [isMobile, setIsMobile] = useState(
    () => typeof window !== "undefined" && window.matchMedia("(pointer: coarse)").matches,
  );

  const images = product.gallery.length ? product.gallery : [product.image];
  const hasMultiple = images.length > 1;

  const prevImage = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setImgIndex((i) => (i - 1 + images.length) % images.length);
  };

  const nextImage = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setImgIndex((i) => (i + 1) % images.length);
  };

  const ref = useRef<HTMLDivElement>(null);
  const mx = useMotionValue(0);
  const my = useMotionValue(0);
  const rotateX = useSpring(my, { stiffness: 200, damping: 18 });
  const rotateY = useSpring(mx, { stiffness: 200, damping: 18 });

  useEffect(() => {
    const mq = window.matchMedia("(pointer: coarse)");
    const handler = (e: MediaQueryListEvent) => setIsMobile(e.matches);
    mq.addEventListener("change", handler);
    return () => mq.removeEventListener("change", handler);
  }, []);

  const handleMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (isMobile) return;
    const rect = ref.current?.getBoundingClientRect();
    if (!rect) return;
    const x = (e.clientX - rect.left) / rect.width - 0.5;
    const y = (e.clientY - rect.top) / rect.height - 0.5;
    mx.set(x * 10);
    my.set(-y * 10);
  };

  const reset = () => {
    mx.set(0);
    my.set(0);
  };

  const wished = isWishlisted(product.id);
  const price = product.salePrice ?? product.price;
  const discount = product.salePrice
    ? Math.round(((product.price - product.salePrice) / product.price) * 100)
    : 0;

  return (
    <>
      <motion.div
        ref={ref}
        onMouseMove={handleMove}
        onMouseLeave={reset}
        initial={false}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-40px" }}
        transition={{ duration: 0.4, ease: "easeOut" }}
        style={
          isMobile
            ? undefined
            : { rotateX, rotateY, transformStyle: "preserve-3d", perspective: 800 }
        }
        className={cn("group relative", className)}
      >
        <div className={cn(
          "relative overflow-hidden rounded-3xl shadow-sm transition-all duration-700 group-hover:shadow-2xl",
          dark
            ? "border border-white/[0.06] bg-[#112d3d] group-hover:border-gold/40 group-hover:shadow-[0_30px_70px_-20px_rgba(201,169,110,0.4)]"
            : "border border-[#e0ecf2] bg-white group-hover:border-gold/40 group-hover:shadow-[0_30px_70px_-20px_rgba(201,169,110,0.3)]"
        )}>
          {product.badge && (
            <span
              className={cn(
                "absolute left-4 top-4 z-10 rounded-full px-3 py-1 text-[10px] font-bold tracking-[0.14em] uppercase",
                product.badge === "Sale"
                  ? "bg-red-600 text-white"
                  : product.badge === "Limited Edition"
                    ? "bg-[#174A63] text-gold"
                    : "bg-gold text-white",
              )}
            >
              {product.badge}
            </span>
          )}

          {discount > 0 && product.badge !== "Sale" && (
            <span className={cn(
              "absolute right-4 top-4 z-10 rounded-full px-3 py-1 text-[10px] font-bold backdrop-blur",
              dark ? "bg-[#0a1b26]/80 text-red-400" : "bg-white/90 text-red-600"
            )}>
              -{discount}%
            </span>
          )}

          <div className="absolute right-4 top-14 z-10 flex flex-col gap-2">
            <button
              type="button"
              onClick={() => toggleWishlist(product)}
              aria-label="Add to wishlist"
              className={cn(
                "flex h-9 w-9 items-center justify-center rounded-full shadow backdrop-blur transition-all hover:scale-110",
                dark
                  ? "bg-[#0a1b26]/70 text-[#dceff7]/60 hover:text-red-400"
                  : "bg-white/90 text-[#174A63]/50 hover:text-red-500",
                wished && "text-red-500",
              )}
            >
              <Heart size={16} fill={wished ? "currentColor" : "none"} />
            </button>

            <button
              type="button"
              onClick={() => setQuickViewOpen(true)}
              aria-label="Quick view"
              className={cn(
                "flex h-9 w-9 items-center justify-center rounded-full shadow backdrop-blur transition-all hover:scale-110",
                dark
                  ? "bg-[#0a1b26]/70 text-[#dceff7]/60"
                  : "bg-white/90 text-[#174A63]/50"
              )}
            >
              <Eye size={16} />
            </button>
          </div>

          <div className={cn(
            "relative aspect-[4/4.5] w-full overflow-hidden sm:aspect-[4/4.2]",
            dark ? "bg-gradient-to-b from-[#122d3d] to-[#0a1b26]" : "bg-[#EFF8FC]"
          )}>
            <Link
              href={`/product/${product.slug}`}
              className="block h-full w-full"
              onClick={(e) => e.stopPropagation()}
            >
              <AnimatePresence initial={false}>
                <motion.div
                  key={imgIndex}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.25 }}
                  className="absolute inset-0"
                >
                  <Image
                    src={images[imgIndex]}
                    alt={product.name}
                    fill
                    loading={loading}
                    sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 300px"
                    className="object-cover transition-transform duration-700 ease-out group-hover:scale-110"
                  />
                </motion.div>
              </AnimatePresence>
            </Link>

            {hasMultiple && (
              <>
                <button
                  type="button"
                  onClick={prevImage}
                  aria-label="Previous image"
                  className={cn(
                    "absolute left-2 top-1/2 z-10 flex h-8 w-8 -translate-y-1/2 items-center justify-center rounded-full shadow-md backdrop-blur transition-all hover:scale-110",
                    dark ? "bg-[#0a1b26]/70 text-[#dceff7]/70" : "bg-white/90 text-[#174A63]/70"
                  )}
                >
                  <ChevronLeft size={16} />
                </button>

                <button
                  type="button"
                  onClick={nextImage}
                  aria-label="Next image"
                  className={cn(
                    "absolute right-2 top-1/2 z-10 flex h-8 w-8 -translate-y-1/2 items-center justify-center rounded-full shadow-md backdrop-blur transition-all hover:scale-110",
                    dark ? "bg-[#0a1b26]/70 text-[#dceff7]/70" : "bg-white/90 text-[#174A63]/70"
                  )}
                >
                  <ChevronRight size={16} />
                </button>

                <div className="absolute inset-x-0 bottom-2 z-10 flex items-center justify-center gap-1.5">
                  {images.map((_, i) => (
                    <button
                      key={i}
                      type="button"
                      onClick={(e) => {
                        e.preventDefault();
                        e.stopPropagation();
                        setImgIndex(i);
                      }}
                      aria-label={`View image ${i + 1}`}
                      className={cn(
                        "h-1.5 rounded-full transition-all duration-300",
                        i === imgIndex
                          ? "w-4 bg-gold"
                          : dark ? "w-1.5 bg-[#dceff7]/40 hover:bg-gold/70" : "w-1.5 bg-white/80 hover:bg-gold/70",
                      )}
                    />
                  ))}
                </div>
              </>
            )}
          </div>

          <div className={cn("p-4 sm:p-5", dark && "border-t border-white/[0.06]")}>
            <div className="flex items-center justify-between">
              <p className="text-[10px] font-semibold tracking-[0.18em] text-gold uppercase">
                {product.brand}
              </p>
              <div className="flex items-center gap-1 text-xs">
                <Star size={12} className="fill-gold text-gold" />
                <span className={cn("font-medium", dark ? "text-[#dceff7]/80" : "text-[#174A63]")}>
                  {product.rating}
                </span>
                <span className={cn(dark ? "text-[#dceff7]/30" : "text-[#174A63]/40")}>
                  ({product.reviewCount})
                </span>
              </div>
            </div>

            <Link href={`/product/${product.slug}`} className="mt-1.5 block">
              <h3 className={cn(
                "font-display text-lg font-semibold transition-colors group-hover:text-gold sm:text-xl",
                dark ? "text-[#f8fcfe]" : "text-[#174A63]"
              )}>
                {product.name}
              </h3>
            </Link>

            <p className={cn("mt-1 text-xs", dark ? "text-[#dceff7]/35" : "text-[#174A63]/45")}>
              {product.volume} • {product.category}
            </p>

            <div className="mt-3 flex items-center gap-2">
              <span className={cn("text-lg font-semibold", dark ? "text-[#f8fcfe]" : "text-[#174A63]")}>
                {formatPrice(price)}
              </span>
              {product.salePrice && (
                <span className={cn("text-sm line-through", dark ? "text-[#dceff7]/25" : "text-[#174A63]/35")}>
                  {formatPrice(product.price)}
                </span>
              )}
            </div>

            <button
              type="button"
              onClick={() => {
                addToCart(product);
                toast.success(`${product.name} added to bag`);
              }}
              className={cn(
                "mt-4 flex w-full items-center justify-center gap-2 rounded-full py-3 text-sm font-medium transition-all duration-700",
                dark
                  ? "bg-gradient-to-r from-[#174A63] to-[#0f2838] text-[#f8fcfe] hover:from-gold hover:to-gold-light hover:text-[#0a1b26]"
                  : "bg-[#174A63] text-white hover:bg-gold"
              )}
            >
              <ShoppingBag size={16} />
              Add to Bag
            </button>
          </div>
        </div>
      </motion.div>

      <QuickViewModal
        key={`${product.id}-${quickViewOpen}`}
        product={product}
        open={quickViewOpen}
        onClose={() => setQuickViewOpen(false)}
      />
    </>
  );
}
